import { Injectable, NotFoundException } from '@nestjs/common';
import type { Service } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateServiceDto } from './dto/create-service.dto.js';
import type { UpdateServiceDto } from './dto/update-service.dto.js';

function toService(entity: {
  id: string;
  establishmentId: string;
  name: string;
  price: { toNumber(): number };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Service {
  return {
    id: entity.id,
    establishmentId: entity.establishmentId,
    name: entity.name,
    price: entity.price.toNumber(),
    active: entity.active,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(establishmentId: string, dto: CreateServiceDto): Promise<Service> {
    const service = await this.prisma.service.create({
      data: { ...dto, establishmentId },
    });

    return toService(service);
  }

  async findAll(establishmentId: string, includeInactive: boolean): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      where: {
        establishmentId,
        ...(includeInactive ? {} : { active: true }),
      },
      orderBy: { name: 'asc' },
    });

    return services.map(toService);
  }

  async findOne(establishmentId: string, id: string): Promise<Service> {
    const service = await this.prisma.service.findFirst({
      where: { id, establishmentId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado.');
    }

    return toService(service);
  }

  async update(establishmentId: string, id: string, dto: UpdateServiceDto): Promise<Service> {
    await this.findOne(establishmentId, id);

    const service = await this.prisma.service.update({
      where: { id },
      data: dto,
    });

    return toService(service);
  }

  async remove(establishmentId: string, id: string): Promise<void> {
    await this.findOne(establishmentId, id);

    await this.prisma.service.update({
      where: { id },
      data: { active: false },
    });
  }
}
