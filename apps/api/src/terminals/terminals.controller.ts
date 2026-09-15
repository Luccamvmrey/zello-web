import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { LogicalTerminal, LogicalTerminalDetail, LogicalTerminalWithCount } from '@repo/types';
import { CurrentEstablishment } from '../common/decorators/current-establishment.decorator.js';
import { RequiresEstablishment } from '../common/decorators/requires-establishment.decorator.js';
import { TerminalsService } from './terminals.service.js';
import { CreateTerminalDto } from './dto/create-terminal.dto.js';
import { UpdateTerminalDto } from './dto/update-terminal.dto.js';

@Controller('terminals')
@RequiresEstablishment()
export class TerminalsController {
  constructor(private readonly terminalsService: TerminalsService) {}

  @Post()
  create(
    @CurrentEstablishment() establishmentId: string,
    @Body() dto: CreateTerminalDto,
  ): Promise<LogicalTerminal> {
    return this.terminalsService.create(establishmentId, dto);
  }

  @Get()
  findAll(
    @CurrentEstablishment() establishmentId: string,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<LogicalTerminalWithCount[]> {
    return this.terminalsService.findAll(establishmentId, includeInactive === 'true');
  }

  @Get(':id')
  findOne(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<LogicalTerminalDetail> {
    return this.terminalsService.findOneDetail(establishmentId, id);
  }

  @Patch(':id')
  update(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTerminalDto,
  ): Promise<LogicalTerminal> {
    return this.terminalsService.update(establishmentId, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentEstablishment() establishmentId: string, @Param('id') id: string): Promise<void> {
    return this.terminalsService.remove(establishmentId, id);
  }

  @Patch(':id/reactivate')
  reactivate(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<LogicalTerminal> {
    return this.terminalsService.reactivate(establishmentId, id);
  }
}
