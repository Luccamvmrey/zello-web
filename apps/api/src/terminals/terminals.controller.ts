import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { LogicalTerminal, LogicalTerminalDetail, LogicalTerminalWithCount } from '@repo/types';
import { AdminOnly } from '../common/decorators/admin-only.decorator.js';
import { CurrentEstablishment } from '../common/decorators/current-establishment.decorator.js';
import { RequiresEstablishment } from '../common/decorators/requires-establishment.decorator.js';
import { TerminalsService } from './terminals.service.js';
import { CreateTerminalDto } from './dto/create-terminal.dto.js';
import { UpdateTerminalDto } from './dto/update-terminal.dto.js';

// Escrita (POST/PATCH/DELETE) é @AdminOnly() — mesmo padrão de collaborators
// (spec R.2): terminal só se cria via solicitação aprovada pelo admin.
@Controller('terminals')
export class TerminalsController {
  constructor(private readonly terminalsService: TerminalsService) {}

  @Post()
  @AdminOnly()
  create(
    @CurrentEstablishment() establishmentId: string,
    @Body() dto: CreateTerminalDto,
  ): Promise<LogicalTerminal> {
    return this.terminalsService.create(establishmentId, dto);
  }

  @Get()
  @RequiresEstablishment()
  findAll(
    @CurrentEstablishment() establishmentId: string,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<LogicalTerminalWithCount[]> {
    return this.terminalsService.findAll(establishmentId, includeInactive === 'true');
  }

  @Get(':id')
  @RequiresEstablishment()
  findOne(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<LogicalTerminalDetail> {
    return this.terminalsService.findOneDetail(establishmentId, id);
  }

  @Patch(':id')
  @AdminOnly()
  update(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTerminalDto,
  ): Promise<LogicalTerminal> {
    return this.terminalsService.update(establishmentId, id, dto);
  }

  @Delete(':id')
  @AdminOnly()
  @HttpCode(204)
  remove(@CurrentEstablishment() establishmentId: string, @Param('id') id: string): Promise<void> {
    return this.terminalsService.remove(establishmentId, id);
  }

  @Patch(':id/reactivate')
  @AdminOnly()
  reactivate(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<LogicalTerminal> {
    return this.terminalsService.reactivate(establishmentId, id);
  }
}
