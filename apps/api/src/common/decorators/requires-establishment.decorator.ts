import { UseGuards } from '@nestjs/common';
import { EstablishmentGuard } from '../guards/establishment.guard.js';

/** Aplicar em toda rota exceto auth e establishments.create (usuário ainda sem establishment). */
export const RequiresEstablishment = () => UseGuards(EstablishmentGuard);
