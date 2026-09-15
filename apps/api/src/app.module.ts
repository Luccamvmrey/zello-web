import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';
import { CollaboratorsModule } from './collaborators/collaborators.module.js';
import { CommonModule } from './common/common.module.js';
import { EstablishmentsModule } from './establishments/establishments.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ServicesModule } from './services/services.module.js';
import { SplitRulesModule } from './split-rules/split-rules.module.js';
import { TerminalsModule } from './terminals/terminals.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CommonModule,
    AuthModule,
    EstablishmentsModule,
    CollaboratorsModule,
    SplitRulesModule,
    ServicesModule,
    TerminalsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Tudo protegido por padrão; rotas abertas usam @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
