import { ConflictException, Injectable } from '@nestjs/common';
import type { Establishment, EstablishmentWithCounts } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateEstablishmentDto } from './dto/create-establishment.dto.js';
import type { UpdateEstablishmentDto } from './dto/update-establishment.dto.js';

/** Decimal do Prisma não serializa como number sozinho — converte explicitamente. */
function toEstablishment(entity: {
  id: string;
  cnpj: string;
  nomeFantasia: string;
  razaoSocial: string;
  segmento: string;
  faturamento: { toNumber(): number } | null;
  encargosTributarios: { toNumber(): number } | null;
  numPdvs: number;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  stoneAccountId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Establishment {
  return {
    id: entity.id,
    cnpj: entity.cnpj,
    nomeFantasia: entity.nomeFantasia,
    razaoSocial: entity.razaoSocial,
    segmento: entity.segmento,
    faturamento: entity.faturamento?.toNumber() ?? null,
    encargosTributarios: entity.encargosTributarios?.toNumber() ?? null,
    numPdvs: entity.numPdvs,
    cep: entity.cep,
    logradouro: entity.logradouro,
    numero: entity.numero,
    complemento: entity.complemento,
    bairro: entity.bairro,
    cidade: entity.cidade,
    estado: entity.estado,
    stoneAccountId: entity.stoneAccountId,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

@Injectable()
export class EstablishmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateEstablishmentDto): Promise<Establishment> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    if (user.establishmentId) {
      throw new ConflictException('Estabelecimento já cadastrado.');
    }

    await this.assertCnpjAvailable(dto.cnpj);

    const establishment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.establishment.create({
        data: { ...dto, numPdvs: dto.numPdvs ?? 1 },
      });
      await tx.user.update({
        where: { id: userId },
        data: { establishmentId: created.id },
      });
      return created;
    });

    return toEstablishment(establishment);
  }

  async getMeWithCounts(establishmentId: string): Promise<EstablishmentWithCounts> {
    const establishment = await this.prisma.establishment.findUniqueOrThrow({
      where: { id: establishmentId },
      include: {
        _count: {
          select: {
            collaborators: true,
            logicalTerminals: true,
            services: true,
            splitRules: true,
          },
        },
      },
    });

    const { _count, ...rest } = establishment;

    return {
      ...toEstablishment(rest),
      collaboratorCount: _count.collaborators,
      terminalCount: _count.logicalTerminals,
      serviceCount: _count.services,
      splitRuleCount: _count.splitRules,
    };
  }

  async update(
    establishmentId: string,
    dto: UpdateEstablishmentDto,
  ): Promise<Establishment> {
    if (dto.cnpj) {
      await this.assertCnpjAvailable(dto.cnpj, establishmentId);
    }

    const establishment = await this.prisma.establishment.update({
      where: { id: establishmentId },
      data: dto,
    });

    return toEstablishment(establishment);
  }

  private async assertCnpjAvailable(cnpj: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.establishment.findUnique({ where: { cnpj } });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException('CNPJ já cadastrado.');
    }
  }
}
