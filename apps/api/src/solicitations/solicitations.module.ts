import { Module } from '@nestjs/common';
import { CollaboratorsModule } from '../collaborators/collaborators.module.js';
import { TerminalsModule } from '../terminals/terminals.module.js';
import { SolicitationsController } from './solicitations.controller.js';
import { SolicitationsService } from './solicitations.service.js';

@Module({
  imports: [CollaboratorsModule, TerminalsModule],
  controllers: [SolicitationsController],
  providers: [SolicitationsService],
})
export class SolicitationsModule {}
