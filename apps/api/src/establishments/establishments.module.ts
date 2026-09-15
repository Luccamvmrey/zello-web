import { Module } from '@nestjs/common';
import { EstablishmentsController } from './establishments.controller.js';
import { EstablishmentsService } from './establishments.service.js';

@Module({
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService],
})
export class EstablishmentsModule {}
