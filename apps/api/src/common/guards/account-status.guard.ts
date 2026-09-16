import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../auth/public.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { JwtUser } from '../../auth/current-user.decorator.js';

/**
 * Registrado como APP_GUARD logo após o JwtAuthGuard: segunda barreira
 * contra tokens emitidos antes de uma suspensão. Replica a checagem de
 * @Public() do JwtAuthGuard, já que request.user não existe em rotas públicas.
 */
@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user: JwtUser }>();

    const user = await this.prisma.user.findUnique({
      where: { id: request.user.id },
      select: { accountStatus: true },
    });

    if (user?.accountStatus === 'PENDING_APPROVAL') {
      throw new ForbiddenException('Sua conta está aguardando aprovação.');
    }

    if (user?.accountStatus === 'SUSPENDED') {
      throw new ForbiddenException('Sua conta foi suspensa.');
    }

    return true;
  }
}
