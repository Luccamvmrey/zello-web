import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  AdminSolicitation,
  CollaboratorSolicitationData,
  Solicitation,
  SolicitationStatus,
  SolicitationType,
  TerminalSolicitationData,
} from '@repo/types';
import { CollaboratorsService } from '../collaborators/collaborators.service.js';
import { normalizeCnpj, isValidCnpj } from '../common/utils/cnpj.util.js';
import { normalizeCpf, isValidCpf } from '../common/utils/cpf.util.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TerminalsService } from '../terminals/terminals.service.js';
import type { CreateSolicitationDto } from './dto/create-solicitation.dto.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SolicitationData = CollaboratorSolicitationData | TerminalSolicitationData;

interface SolicitationEntity {
  id: string;
  establishmentId: string;
  type: SolicitationType;
  status: SolicitationStatus;
  data: Prisma.JsonValue;
  adminNotes: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
}

function toSolicitation(entity: SolicitationEntity): Solicitation {
  return {
    id: entity.id,
    establishmentId: entity.establishmentId,
    type: entity.type,
    status: entity.status,
    data: entity.data as unknown as SolicitationData,
    adminNotes: entity.adminNotes,
    reviewedAt: entity.reviewedAt?.toISOString() ?? null,
    createdAt: entity.createdAt.toISOString(),
  };
}

@Injectable()
export class SolicitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly collaboratorsService: CollaboratorsService,
    private readonly terminalsService: TerminalsService,
  ) {}

  async create(establishmentId: string, dto: CreateSolicitationDto): Promise<Solicitation> {
    const data = this.validateData(dto.type, dto.data);
    await this.assertNoPendingDuplicate(establishmentId, dto.type, data);
    await this.assertResourceAvailable(establishmentId, dto.type, data);

    const solicitation = await this.prisma.solicitation.create({
      data: {
        establishmentId,
        type: dto.type,
        data: data as unknown as Prisma.InputJsonValue,
      },
    });

    return toSolicitation(solicitation);
  }

  async findAll(
    establishmentId: string,
    type?: SolicitationType,
    status?: SolicitationStatus,
  ): Promise<Solicitation[]> {
    const solicitations = await this.prisma.solicitation.findMany({
      where: { establishmentId, ...(type ? { type } : {}), ...(status ? { status } : {}) },
      orderBy: { createdAt: 'desc' },
    });

    return solicitations.map(toSolicitation);
  }

  async findOne(establishmentId: string, id: string): Promise<Solicitation> {
    const solicitation = await this.prisma.solicitation.findFirst({
      where: { id, establishmentId },
    });

    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    return toSolicitation(solicitation);
  }

  async cancel(establishmentId: string, id: string): Promise<void> {
    const solicitation = await this.prisma.solicitation.findFirst({
      where: { id, establishmentId },
    });

    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    if (solicitation.status !== 'PENDING') {
      throw new BadRequestException('Só é possível cancelar solicitações pendentes.');
    }

    await this.prisma.solicitation.delete({ where: { id } });
  }

  async adminFindAll(
    type?: SolicitationType,
    status: 'ALL' | SolicitationStatus = 'PENDING',
    establishmentId?: string,
  ): Promise<AdminSolicitation[]> {
    const solicitations = await this.prisma.solicitation.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(status === 'ALL' ? {} : { status }),
        ...(establishmentId ? { establishmentId } : {}),
      },
      orderBy: { createdAt: 'asc' },
      include: {
        establishment: { select: { id: true, nomeFantasia: true, cnpj: true } },
      },
    });

    return solicitations.map((solicitation) => ({
      ...toSolicitation(solicitation),
      establishment: solicitation.establishment,
    }));
  }

  async approve(id: string, adminId: string): Promise<AdminSolicitation> {
    const solicitation = await this.prisma.solicitation.findUnique({
      where: { id },
      include: { establishment: { select: { id: true, nomeFantasia: true, cnpj: true } } },
    });

    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    if (solicitation.status !== 'PENDING') {
      throw new BadRequestException('Só é possível aprovar solicitações pendentes.');
    }

    const data = solicitation.data as unknown as SolicitationData;

    if (solicitation.type === 'NEW_COLLABORATOR') {
      const collaboratorData = data as CollaboratorSolicitationData;
      await this.collaboratorsService.create(solicitation.establishmentId, collaboratorData);
    } else {
      const terminalData = data as TerminalSolicitationData;
      await this.terminalsService.create(solicitation.establishmentId, terminalData);
    }

    const updated = await this.prisma.solicitation.update({
      where: { id },
      data: { status: 'APPROVED', reviewedById: adminId, reviewedAt: new Date() },
      include: { establishment: { select: { id: true, nomeFantasia: true, cnpj: true } } },
    });

    return { ...toSolicitation(updated), establishment: updated.establishment };
  }

  async reject(id: string, adminId: string, notes: string | undefined): Promise<AdminSolicitation> {
    const solicitation = await this.prisma.solicitation.findUnique({
      where: { id },
      include: { establishment: { select: { id: true, nomeFantasia: true, cnpj: true } } },
    });

    if (!solicitation) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    if (solicitation.status !== 'PENDING') {
      throw new BadRequestException('Só é possível rejeitar solicitações pendentes.');
    }

    const updated = await this.prisma.solicitation.update({
      where: { id },
      data: {
        status: 'REJECTED',
        adminNotes: notes ?? null,
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
      include: { establishment: { select: { id: true, nomeFantasia: true, cnpj: true } } },
    });

    return { ...toSolicitation(updated), establishment: updated.establishment };
  }

  private validateData(type: SolicitationType, raw: unknown): SolicitationData {
    if (typeof raw !== 'object' || raw === null) {
      throw new BadRequestException('Dados da solicitação inválidos.');
    }

    return type === 'NEW_COLLABORATOR'
      ? this.validateCollaboratorData(raw as Record<string, unknown>)
      : this.validateTerminalData(raw as Record<string, unknown>);
  }

  private validateCollaboratorData(raw: Record<string, unknown>): CollaboratorSolicitationData {
    const { name, email, phone, document, documentType } = raw;

    if (typeof name !== 'string' || !name.trim()) {
      throw new BadRequestException('Nome é obrigatório.');
    }

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      throw new BadRequestException('Informe um e-mail válido.');
    }

    if (phone !== undefined && typeof phone !== 'string') {
      throw new BadRequestException('Telefone inválido.');
    }

    if (documentType !== 'CPF' && documentType !== 'CNPJ') {
      throw new BadRequestException('Tipo de documento inválido.');
    }

    if (typeof document !== 'string') {
      throw new BadRequestException('Documento inválido.');
    }

    const normalizedDocument =
      documentType === 'CPF' ? normalizeCpf(document) : normalizeCnpj(document);
    const isValid =
      documentType === 'CPF' ? isValidCpf(normalizedDocument) : isValidCnpj(normalizedDocument);

    if (!isValid) {
      throw new BadRequestException('Documento inválido.');
    }

    return {
      name: name.trim(),
      email,
      ...(typeof phone === 'string' ? { phone } : {}),
      document: normalizedDocument,
      documentType,
    };
  }

  private validateTerminalData(raw: Record<string, unknown>): TerminalSolicitationData {
    const { name } = raw;

    if (typeof name !== 'string' || !name.trim()) {
      throw new BadRequestException('Nome do terminal é obrigatório.');
    }

    return { name: name.trim() };
  }

  private async assertNoPendingDuplicate(
    establishmentId: string,
    type: SolicitationType,
    data: SolicitationData,
  ): Promise<void> {
    const pending = await this.prisma.solicitation.findMany({
      where: { establishmentId, type, status: 'PENDING' },
    });

    const key = this.dataKey(type, data);

    const duplicate = pending.some(
      (solicitation) => this.dataKey(type, solicitation.data as unknown as SolicitationData) === key,
    );

    if (duplicate) {
      throw new ConflictException('Já existe uma solicitação pendente para este recurso.');
    }
  }

  private async assertResourceAvailable(
    establishmentId: string,
    type: SolicitationType,
    data: SolicitationData,
  ): Promise<void> {
    if (type === 'NEW_COLLABORATOR') {
      const { document } = data as CollaboratorSolicitationData;
      const existing = await this.prisma.collaborator.findUnique({
        where: { establishmentId_document: { establishmentId, document } },
      });

      if (existing) {
        throw new ConflictException('Este recurso já existe.');
      }
    } else {
      const { name } = data as TerminalSolicitationData;
      const existing = await this.prisma.logicalTerminal.findUnique({
        where: { establishmentId_name: { establishmentId, name } },
      });

      if (existing) {
        throw new ConflictException('Este recurso já existe.');
      }
    }
  }

  private dataKey(type: SolicitationType, data: SolicitationData): string {
    return type === 'NEW_COLLABORATOR'
      ? (data as CollaboratorSolicitationData).document
      : (data as TerminalSolicitationData).name;
  }
}
