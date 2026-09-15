import { Global, Module } from '@nestjs/common';
import { EstablishmentGuard } from './guards/establishment.guard.js';

@Global()
@Module({
  providers: [EstablishmentGuard],
  exports: [EstablishmentGuard],
})
export class CommonModule {}
