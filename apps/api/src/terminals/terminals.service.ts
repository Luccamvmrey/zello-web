import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { LogicalTerminal, LogicalTerminalDetail, LogicalTerminalWithCount } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateTerminalDto } from './dto/create-terminal.dto.js';
import type { UpdateTerminalDto } from './dto/update-terminal.dto.js';

function toTerminal(entity: {
  id: string;
  establishmentId: string;
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}): LogicalTerminal {
  return {
    id: entity.id,
    establishmentId: entity.establishmentId,
    name: entity.name,
    active: entity.active,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

@Injectable()
export class TerminalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(establishmentId: string, dto: CreateTerminalDto): Promise<LogicalTerminal> {
    await this.assertNameAvailable(establishmentId, dto.name);

    const terminal = await this.prisma.logicalTerminal.create({
      data: { ...dto, establishmentId },
    });

    return toTerminal(terminal);
  }

  async findAll(
    establishmentId: string,
    includeInactive: boolean,
  ): Promise<LogicalTerminalWithCount[]> {
    const terminals = await this.prisma.logicalTerminal.findMany({
      where: {
        establishmentId,
        ...(includeInactive ? {} : { active: true }),
      },
      orderBy: { name: 'asc' },
      include: { _count: { select: { physicalTerminals: true } } },
    });

    return terminals.map((terminal) => ({
      ...toTerminal(terminal),
      physicalTerminalCount: terminal._count.physicalTerminals,
    }));
  }

  async findOne(establishmentId: string, id: string) {
    const terminal = await this.prisma.logicalTerminal.findFirst({
      where: { id, establishmentId },
    });

    if (!terminal) {
      throw new NotFoundException('Terminal não encontrado.');
    }

    return terminal;
  }

  async findOneDetail(establishmentId: string, id: string): Promise<LogicalTerminalDetail> {
    const terminal = await this.findOne(establishmentId, id);

    const physicalTerminals = await this.prisma.physicalTerminal.findMany({
      where: { logicalTerminalId: id },
      select: { id: true, machineSerial: true, deviceName: true, status: true, lastSeenAt: true },
    });

    return {
      ...toTerminal(terminal),
      physicalTerminals: physicalTerminals.map((physicalTerminal) => ({
        ...physicalTerminal,
        lastSeenAt: physicalTerminal.lastSeenAt?.toISOString() ?? null,
      })),
    };
  }

  async update(
    establishmentId: string,
    id: string,
    dto: UpdateTerminalDto,
  ): Promise<LogicalTerminal> {
    await this.findOne(establishmentId, id);

    if (dto.name) {
      await this.assertNameAvailable(establishmentId, dto.name, id);
    }

    const terminal = await this.prisma.logicalTerminal.update({
      where: { id },
      data: dto,
    });

    return toTerminal(terminal);
  }

  async remove(establishmentId: string, id: string): Promise<void> {
    await this.findOne(establishmentId, id);

    const pairedCount = await this.prisma.physicalTerminal.count({
      where: { logicalTerminalId: id, status: 'PAIRED' },
    });

    if (pairedCount > 0) {
      throw new ConflictException('Desvincule os terminais físicos antes de desativar');
    }

    await this.prisma.logicalTerminal.update({
      where: { id },
      data: { active: false },
    });
  }

  async reactivate(establishmentId: string, id: string): Promise<LogicalTerminal> {
    await this.findOne(establishmentId, id);

    const terminal = await this.prisma.logicalTerminal.update({
      where: { id },
      data: { active: true },
    });

    return toTerminal(terminal);
  }

  private async assertNameAvailable(
    establishmentId: string,
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.logicalTerminal.findUnique({
      where: { establishmentId_name: { establishmentId, name } },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Já existe um terminal com esse nome para este estabelecimento.');
    }
  }
}
