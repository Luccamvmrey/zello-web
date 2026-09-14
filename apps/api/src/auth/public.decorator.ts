import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Libera uma rota do JwtAuthGuard registrado globalmente. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
