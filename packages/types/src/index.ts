/**
 * Contratos compartilhados entre a API (apps/api) e os frontends
 * (apps/web, apps/landing). Mantidos como tipos puros — sem runtime —
 * para que qualquer app possa importar sem custo de bundle.
 */

/* ---------------------------------------------------------------- enums */

export type DocumentType = 'CPF' | 'CNPJ';

export type OnboardingStatus = 'PENDING' | 'INVITED' | 'LINKED' | 'ACTIVE';

export type SplitRuleType = 'PERCENTAGE' | 'FIXED';

export type TerminalStatus = 'PAIRED' | 'UNPAIRED' | 'OFFLINE';

export type PaymentMethod = 'CREDIT' | 'DEBIT' | 'PIX';

export type SaleStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';

/* ----------------------------------------------------------------- auth */

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Usuário devolvido por /auth/register e /auth/login. */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  establishmentId: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

/** Recorte do Establishment exposto em /auth/me. */
export interface EstablishmentSummary {
  id: string;
  cnpj: string;
  nomeFantasia: string;
  razaoSocial: string;
  segmento: string;
  numPdvs: number;
}

/** Resposta de GET /auth/me. */
export interface MeResponse extends AuthUser {
  establishment: EstablishmentSummary | null;
}
