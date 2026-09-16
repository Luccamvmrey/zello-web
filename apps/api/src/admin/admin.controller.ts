import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import type {
  AdminAccount,
  AdminAccountStatusFilter,
  AdminEstablishmentOption,
  AdminOverview,
} from '@repo/types';
import { AdminOnly } from '../common/decorators/admin-only.decorator.js';
import { AdminService } from './admin.service.js';
import { RejectAccountDto } from './dto/reject-account.dto.js';

@Controller('admin')
@AdminOnly()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('establishments')
  findEstablishments(): Promise<AdminEstablishmentOption[]> {
    return this.adminService.findEstablishments();
  }

  @Get('accounts')
  findAccounts(
    @Query('status') status: AdminAccountStatusFilter = 'PENDING_APPROVAL',
  ): Promise<AdminAccount[]> {
    return this.adminService.findAccounts(status);
  }

  @Patch('accounts/:id/approve')
  approve(@Param('id') id: string): Promise<AdminAccount> {
    return this.adminService.approve(id);
  }

  @Patch('accounts/:id/reject')
  reject(@Param('id') id: string, @Body() _dto: RejectAccountDto): Promise<AdminAccount> {
    return this.adminService.reject(id);
  }

  @Patch('accounts/:id/reactivate')
  reactivate(@Param('id') id: string): Promise<AdminAccount> {
    return this.adminService.reactivate(id);
  }

  @Get('overview')
  overview(): Promise<AdminOverview> {
    return this.adminService.overview();
  }
}
