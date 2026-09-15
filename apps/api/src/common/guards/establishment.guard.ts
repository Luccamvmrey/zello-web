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
 * O JwtAuthGuard só popula { id, email } em request.user — o establishmentId
 * precisa ser buscado no banco. Anexa em request.establishmentId para o
 * controller/CurrentEstablishment consumirem sem nova consulta.
 */
@Injectable()
export class EstablishmentGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtUser; establishmentId?: string }>();

    const user = await this.prisma.user.findUnique({
      where: { id: request.user.id },
      select: { establishmentId: true },
    });

    if (!user?.establishmentId) {
      throw new ForbiddenException('Complete o cadastro do estabelecimento.');
    }

    request.establishmentId = user.establishmentId;
    return true;
  }
}
