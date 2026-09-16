import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { AdminSolicitation, Solicitation, SolicitationStatus, SolicitationType } from '@repo/types';
import { CurrentUser, type JwtUser } from '../auth/current-user.decorator.js';
import { AdminOnly } from '../common/decorators/admin-only.decorator.js';
import { CurrentEstablishment } from '../common/decorators/current-establishment.decorator.js';
import { RequiresEstablishment } from '../common/decorators/requires-establishment.decorator.js';
import { CreateSolicitationDto } from './dto/create-solicitation.dto.js';
import { RejectSolicitationDto } from './dto/reject-solicitation.dto.js';
import { SolicitationsService } from './solicitations.service.js';

@Controller()
export class SolicitationsController {
  constructor(private readonly solicitationsService: SolicitationsService) {}

  @Post('solicitations')
  @RequiresEstablishment()
  create(
    @CurrentEstablishment() establishmentId: string,
    @Body() dto: CreateSolicitationDto,
  ): Promise<Solicitation> {
    return this.solicitationsService.create(establishmentId, dto);
  }

  @Get('solicitations')
  @RequiresEstablishment()
  findAll(
    @CurrentEstablishment() establishmentId: string,
    @Query('type') type?: SolicitationType,
    @Query('status') status?: SolicitationStatus,
  ): Promise<Solicitation[]> {
    return this.solicitationsService.findAll(establishmentId, type, status);
  }

  @Get('solicitations/:id')
  @RequiresEstablishment()
  findOne(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<Solicitation> {
    return this.solicitationsService.findOne(establishmentId, id);
  }

  @Delete('solicitations/:id')
  @RequiresEstablishment()
  @HttpCode(204)
  cancel(@CurrentEstablishment() establishmentId: string, @Param('id') id: string): Promise<void> {
    return this.solicitationsService.cancel(establishmentId, id);
  }

  @Get('admin/solicitations')
  @AdminOnly()
  adminFindAll(
    @Query('type') type?: SolicitationType,
    @Query('status') status: 'ALL' | SolicitationStatus = 'PENDING',
    @Query('establishmentId') establishmentId?: string,
  ): Promise<AdminSolicitation[]> {
    return this.solicitationsService.adminFindAll(type, status, establishmentId);
  }

  @Patch('admin/solicitations/:id/approve')
  @AdminOnly()
  approve(@CurrentUser() user: JwtUser, @Param('id') id: string): Promise<AdminSolicitation> {
    return this.solicitationsService.approve(id, user.id);
  }

  @Patch('admin/solicitations/:id/reject')
  @AdminOnly()
  reject(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body() dto: RejectSolicitationDto,
  ): Promise<AdminSolicitation> {
    return this.solicitationsService.reject(id, user.id, dto.notes);
  }
}
