import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { SplitRule } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateSplitRuleDto } from './dto/create-split-rule.dto.js';
import type { UpdateSplitRuleDto } from './dto/update-split-rule.dto.js';

function toSplitRule(entity: {
  id: string;
  establishmentId: string;
  name: string;
  type: SplitRule['type'];
  value: { toNumber(): number };
  description: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}): SplitRule {
  return {
    id: entity.id,
    establishmentId: entity.establishmentId,
    name: entity.name,
    type: entity.type,
    value: entity.value.toNumber(),
    description: entity.description,
    active: entity.active,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

@Injectable()
export class SplitRulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(establishmentId: string, dto: CreateSplitRuleDto): Promise<SplitRule> {
    await this.assertNameAvailable(establishmentId, dto.name);

    const splitRule = await this.prisma.splitRule.create({
      data: { ...dto, establishmentId },
    });

    return toSplitRule(splitRule);
  }

  async findAll(establishmentId: string, includeInactive: boolean): Promise<SplitRule[]> {
    const splitRules = await this.prisma.splitRule.findMany({
      where: {
        establishmentId,
        ...(includeInactive ? {} : { active: true }),
      },
      orderBy: { name: 'asc' },
    });

    return splitRules.map(toSplitRule);
  }

  async findOne(establishmentId: string, id: string): Promise<SplitRule> {
    const splitRule = await this.prisma.splitRule.findFirst({
      where: { id, establishmentId },
    });

    if (!splitRule) {
      throw new NotFoundException('Regra de negócio não encontrada.');
    }

    return toSplitRule(splitRule);
  }

  async update(establishmentId: string, id: string, dto: UpdateSplitRuleDto): Promise<SplitRule> {
    await this.findOne(establishmentId, id);

    if (dto.name) {
      await this.assertNameAvailable(establishmentId, dto.name, id);
    }

    const splitRule = await this.prisma.splitRule.update({
      where: { id },
      data: dto,
    });

    return toSplitRule(splitRule);
  }

  async remove(establishmentId: string, id: string): Promise<void> {
    await this.findOne(establishmentId, id);

    await this.prisma.splitRule.update({
      where: { id },
      data: { active: false },
    });
  }

  private async assertNameAvailable(
    establishmentId: string,
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prisma.splitRule.findUnique({
      where: { establishmentId_name: { establishmentId, name } },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Já existe uma regra com esse nome para este estabelecimento.');
    }
  }
}
