import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import type { Establishment, EstablishmentWithCounts } from '@repo/types';
import { CurrentEstablishment } from '../common/decorators/current-establishment.decorator.js';
import { RequiresEstablishment } from '../common/decorators/requires-establishment.decorator.js';
import { CurrentUser, type JwtUser } from '../auth/current-user.decorator.js';
import { CreateEstablishmentDto } from './dto/create-establishment.dto.js';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto.js';
import { EstablishmentsService } from './establishments.service.js';

@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateEstablishmentDto,
  ): Promise<Establishment> {
    return this.establishmentsService.create(user.id, dto);
  }

  @Get('me')
  @RequiresEstablishment()
  getMe(@CurrentEstablishment() establishmentId: string): Promise<EstablishmentWithCounts> {
    return this.establishmentsService.getMeWithCounts(establishmentId);
  }

  @Patch('me')
  @RequiresEstablishment()
  updateMe(
    @CurrentEstablishment() establishmentId: string,
    @Body() dto: UpdateEstablishmentDto,
  ): Promise<Establishment> {
    return this.establishmentsService.update(establishmentId, dto);
  }
}
