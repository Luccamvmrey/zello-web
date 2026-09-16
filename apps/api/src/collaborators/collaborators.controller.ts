import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { Collaborator } from '@repo/types';
import { AdminOnly } from '../common/decorators/admin-only.decorator.js';
import { CurrentEstablishment } from '../common/decorators/current-establishment.decorator.js';
import { RequiresEstablishment } from '../common/decorators/requires-establishment.decorator.js';
import { CollaboratorsService } from './collaborators.service.js';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto.js';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto.js';

// Escrita (POST/PATCH/DELETE) é @AdminOnly() — o establishment não cria mais
// colaborador direto, só via solicitação (spec R.2). Essas rotas de escrita
// não são chamadas pelo dashboard: a aprovação de solicitação chama o service
// diretamente. Leitura continua @RequiresEstablishment() como sempre.
@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Post()
  @AdminOnly()
  create(
    @CurrentEstablishment() establishmentId: string,
    @Body() dto: CreateCollaboratorDto,
  ): Promise<Collaborator> {
    return this.collaboratorsService.create(establishmentId, dto);
  }

  @Get()
  @RequiresEstablishment()
  findAll(
    @CurrentEstablishment() establishmentId: string,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<Collaborator[]> {
    return this.collaboratorsService.findAll(establishmentId, includeInactive === 'true');
  }

  @Get(':id')
  @RequiresEstablishment()
  findOne(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<Collaborator> {
    return this.collaboratorsService.findOne(establishmentId, id);
  }

  @Patch(':id')
  @AdminOnly()
  update(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCollaboratorDto,
  ): Promise<Collaborator> {
    return this.collaboratorsService.update(establishmentId, id, dto);
  }

  @Delete(':id')
  @AdminOnly()
  @HttpCode(204)
  remove(@CurrentEstablishment() establishmentId: string, @Param('id') id: string): Promise<void> {
    return this.collaboratorsService.remove(establishmentId, id);
  }

  @Patch(':id/reactivate')
  @AdminOnly()
  reactivate(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<Collaborator> {
    return this.collaboratorsService.reactivate(establishmentId, id);
  }
}
