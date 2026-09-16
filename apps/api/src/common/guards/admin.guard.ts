import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { JwtUser } from '../../auth/current-user.decorator.js';

/**
 * Confere role: ADMIN no banco (não confia só no claim do JWT — reflete
 * demoções sem exigir novo login), igual ao padrão do EstablishmentGuard.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: JwtUser }>();

    const user = await this.prisma.user.findUnique({
      where: { id: request.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso restrito a administradores');
    }

    return true;
  }
}
