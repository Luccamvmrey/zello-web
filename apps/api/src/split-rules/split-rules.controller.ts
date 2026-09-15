import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { SplitRule } from '@repo/types';
import { CurrentEstablishment } from '../common/decorators/current-establishment.decorator.js';
import { RequiresEstablishment } from '../common/decorators/requires-establishment.decorator.js';
import { SplitRulesService } from './split-rules.service.js';
import { CreateSplitRuleDto } from './dto/create-split-rule.dto.js';
import { UpdateSplitRuleDto } from './dto/update-split-rule.dto.js';

@Controller('split-rules')
@RequiresEstablishment()
export class SplitRulesController {
  constructor(private readonly splitRulesService: SplitRulesService) {}

  @Post()
  create(
    @CurrentEstablishment() establishmentId: string,
    @Body() dto: CreateSplitRuleDto,
  ): Promise<SplitRule> {
    return this.splitRulesService.create(establishmentId, dto);
  }

  @Get()
  findAll(
    @CurrentEstablishment() establishmentId: string,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<SplitRule[]> {
    return this.splitRulesService.findAll(establishmentId, includeInactive === 'true');
  }

  @Get(':id')
  findOne(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
  ): Promise<SplitRule> {
    return this.splitRulesService.findOne(establishmentId, id);
  }

  @Patch(':id')
  update(
    @CurrentEstablishment() establishmentId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSplitRuleDto,
  ): Promise<SplitRule> {
    return this.splitRulesService.update(establishmentId, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentEstablishment() establishmentId: string, @Param('id') id: string): Promise<void> {
    return this.splitRulesService.remove(establishmentId, id);
  }
}
