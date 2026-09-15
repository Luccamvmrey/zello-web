import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { Collaborator } from '@repo/types';
import { CurrentEstablishment } from '../common/decorators/current-establishment.decorator.js';
import { RequiresEstablishment } from '../common/decorators/requires-establishment.decorator.js';
import { CollaboratorsService } from './collaborators.service.js';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto.js';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto.js';

@Controller('collaborators')
@RequiresEstablishment()
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Post()
  create(
    @CurrentEstablishment() establishmentId: string,
    @Body() dto: CreateCollaboratorDto,
  ): Promise<Collaborator> {
    return this.collaboratorsService.create(establishmentId, dto);
  }

  @Get()
  findAll(
    @CurrentEstablishment() establishmentId: string,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<Collaborator[]> {
    return this.collaboratorsService.findAll(establishmentId, includeInactive === 'true');
  }

  @Get(':id')
  findOne(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<Collaborator> {
    return this.collaboratorsService.findOne(establishmentId, id);
  }

  @Patch(':id')
  update(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCollaboratorDto,
  ): Promise<Collaborator> {
    return this.collaboratorsService.update(establishmentId, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentEstablishment() establishmentId: string, @Param('id') id: string): Promise<void> {
    return this.collaboratorsService.remove(establishmentId, id);
  }
}
