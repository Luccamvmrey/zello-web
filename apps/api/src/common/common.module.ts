import { Global, Module } from '@nestjs/common';
import { AccountStatusGuard } from './guards/account-status.guard.js';
import { AdminGuard } from './guards/admin.guard.js';
import { EstablishmentGuard } from './guards/establishment.guard.js';

@Global()
@Module({
  providers: [EstablishmentGuard, AdminGuard, AccountStatusGuard],
  exports: [EstablishmentGuard, AdminGuard, AccountStatusGuard],
})
export class CommonModule {}
