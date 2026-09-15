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

/* --------------------------------------------------------- establishments */

export interface Establishment {
  id: string;
  cnpj: string;
  nomeFantasia: string;
  razaoSocial: string;
  segmento: string;
  faturamento: number | null;
  encargosTributarios: number | null;
  numPdvs: number;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  stoneAccountId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Resposta de GET /establishments/me — Establishment + contagens de entidades relacionadas. */
export interface EstablishmentWithCounts extends Establishment {
  collaboratorCount: number;
  terminalCount: number;
  serviceCount: number;
  splitRuleCount: number;
}

export interface CreateEstablishmentDto {
  cnpj: string;
  nomeFantasia: string;
  razaoSocial: string;
  segmento: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  faturamento?: number;
  encargosTributarios?: number;
  numPdvs?: number;
}

export type UpdateEstablishmentDto = Partial<CreateEstablishmentDto>;

/* --------------------------------------------------------- collaborators */

export interface Collaborator {
  id: string;
  establishmentId: string;
  name: string;
  email: string;
  phone: string | null;
  document: string;
  documentType: DocumentType;
  stoneRecebedorId: string | null;
  onboardingStatus: OnboardingStatus;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollaboratorDto {
  name: string;
  email: string;
  phone?: string;
  document: string;
  documentType: DocumentType;
}

export type UpdateCollaboratorDto = Partial<Pick<CreateCollaboratorDto, 'name' | 'email' | 'phone'>>;

/* ---------------------------------------------------------------- split rules */

export interface SplitRule {
  id: string;
  establishmentId: string;
  name: string;
  type: SplitRuleType;
  value: number;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSplitRuleDto {
  name: string;
  type: SplitRuleType;
  value: number;
  description?: string;
}

export type UpdateSplitRuleDto = Partial<CreateSplitRuleDto>;

/* -------------------------------------------------------------- services */

export interface Service {
  id: string;
  establishmentId: string;
  name: string;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  name: string;
  price: number;
}

export type UpdateServiceDto = Partial<CreateServiceDto>;

/* ------------------------------------------------------------- terminals */

export interface LogicalTerminal {
  id: string;
  establishmentId: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LogicalTerminalWithCount extends LogicalTerminal {
  physicalTerminalCount: number;
}

export interface PhysicalTerminalSummary {
  id: string;
  machineSerial: string;
  deviceName: string | null;
  status: TerminalStatus;
  lastSeenAt: string | null;
}

export interface LogicalTerminalDetail extends LogicalTerminal {
  physicalTerminals: PhysicalTerminalSummary[];
}

export interface CreateTerminalDto {
  name: string;
}

export type UpdateTerminalDto = Partial<CreateTerminalDto>;
