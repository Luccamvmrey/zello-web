import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { Collaborator } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateCollaboratorDto } from './dto/create-collaborator.dto.js';
import type { UpdateCollaboratorDto } from './dto/update-collaborator.dto.js';

function toCollaborator(entity: {
  id: string;
  establishmentId: string;
  name: string;
  email: string;
  phone: string | null;
  document: string;
  documentType: Collaborator['documentType'];
  stoneRecebedorId: string | null;
  onboardingStatus: Collaborator['onboardingStatus'];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Collaborator {
  return {
    id: entity.id,
    establishmentId: entity.establishmentId,
    name: entity.name,
    email: entity.email,
    phone: entity.phone,
    document: entity.document,
    documentType: entity.documentType,
    stoneRecebedorId: entity.stoneRecebedorId,
    onboardingStatus: entity.onboardingStatus,
    active: entity.active,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

@Injectable()
export class CollaboratorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(establishmentId: string, dto: CreateCollaboratorDto): Promise<Collaborator> {
    await this.assertDocumentAvailable(establishmentId, dto.document);

    const collaborator = await this.prisma.collaborator.create({
      data: {
        ...dto,
        establishmentId,
        onboardingStatus: 'ACTIVE',
        stoneRecebedorId: null,
      },
    });

    return toCollaborator(collaborator);
  }

  async findAll(establishmentId: string, includeInactive: boolean): Promise<Collaborator[]> {
    const collaborators = await this.prisma.collaborator.findMany({
      where: {
        establishmentId,
        ...(includeInactive ? {} : { active: true }),
      },
      orderBy: { name: 'asc' },
    });

    return collaborators.map(toCollaborator);
  }

  async findOne(establishmentId: string, id: string): Promise<Collaborator> {
    const collaborator = await this.prisma.collaborator.findFirst({
      where: { id, establishmentId },
    });

    if (!collaborator) {
      throw new NotFoundException('Colaborador não encontrado.');
    }

    return toCollaborator(collaborator);
  }

  async update(
    establishmentId: string,
    id: string,
    dto: UpdateCollaboratorDto,
  ): Promise<Collaborator> {
    await this.findOne(establishmentId, id);

    const collaborator = await this.prisma.collaborator.update({
      where: { id },
      data: dto,
    });

    return toCollaborator(collaborator);
  }

  async remove(establishmentId: string, id: string): Promise<void> {
    await this.findOne(establishmentId, id);

    await this.prisma.collaborator.update({
      where: { id },
      data: { active: false },
    });
  }

  private async assertDocumentAvailable(establishmentId: string, document: string): Promise<void> {
    const existing = await this.prisma.collaborator.findUnique({
      where: { establishmentId_document: { establishmentId, document } },
    });

    if (existing) {
      throw new ConflictException('Documento já cadastrado para este estabelecimento.');
    }
  }
}
