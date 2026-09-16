import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard.js';

/** Aplicar em rotas admin. Nunca combinar com @RequiresEstablishment(). */
export const AdminOnly = () => UseGuards(AdminGuard);
