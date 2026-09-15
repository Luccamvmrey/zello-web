import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

/** Injeta o establishmentId resolvido pelo EstablishmentGuard. */
export const CurrentEstablishment = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { establishmentId: string }>();
    return request.establishmentId;
  },
);
