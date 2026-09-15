import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { Service } from '@repo/types';
import { CurrentEstablishment } from '../common/decorators/current-establishment.decorator.js';
import { RequiresEstablishment } from '../common/decorators/requires-establishment.decorator.js';
import { ServicesService } from './services.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';

@Controller('services')
@RequiresEstablishment()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(
    @CurrentEstablishment() establishmentId: string,
    @Body() dto: CreateServiceDto,
  ): Promise<Service> {
    return this.servicesService.create(establishmentId, dto);
  }

  @Get()
  findAll(
    @CurrentEstablishment() establishmentId: string,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<Service[]> {
    return this.servicesService.findAll(establishmentId, includeInactive === 'true');
  }

  @Get(':id')
  findOne(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<Service> {
    return this.servicesService.findOne(establishmentId, id);
  }

  @Patch(':id')
  update(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(establishmentId, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentEstablishment() establishmentId: string, @Param('id') id: string): Promise<void> {
    return this.servicesService.remove(establishmentId, id);
  }

  @Patch(':id/reactivate')
  reactivate(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<Service> {
    return this.servicesService.reactivate(establishmentId, id);
  }
}
