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

export type UserRole = 'ESTABLISHMENT' | 'ADMIN';

export type AccountStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED';

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

/** Resposta de POST /auth/register — a conta ainda não pode logar. */
export interface RegisterResponse {
  message: string;
}

/** Usuário devolvido por /auth/login. */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
  accountStatus: AccountStatus;
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

/* ------------------------------------------------------------------ admin */

export interface AdminAccountEstablishment {
  nomeFantasia: string;
  cnpj: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: string;
  establishment: AdminAccountEstablishment | null;
}

export type AdminAccountStatusFilter = AccountStatus | 'ALL';

export interface RejectAccountDto {
  reason?: string;
}

export interface AdminOverview {
  pendingAccounts: number;
  pendingSolicitations: number;
  totalEstablishments: number;
  totalCollaborators: number;
}

/* ------------------------------------------------------------ solicitations */

export type SolicitationType = 'NEW_COLLABORATOR' | 'NEW_TERMINAL';

export type SolicitationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type SolicitationStatusFilter = SolicitationStatus | 'ALL';

export interface CollaboratorSolicitationData {
  name: string;
  email: string;
  phone?: string;
  document: string;
  documentType: DocumentType;
}

export interface TerminalSolicitationData {
  name: string;
}

export interface CreateSolicitationDto {
  type: SolicitationType;
  data: CollaboratorSolicitationData | TerminalSolicitationData;
}

export interface Solicitation {
  id: string;
  establishmentId: string;
  type: SolicitationType;
  status: SolicitationStatus;
  data: CollaboratorSolicitationData | TerminalSolicitationData;
  adminNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface AdminSolicitationEstablishment {
  id: string;
  nomeFantasia: string;
  cnpj: string;
}

export interface AdminSolicitation extends Solicitation {
  establishment: AdminSolicitationEstablishment;
}

export interface RejectSolicitationDto {
  notes?: string;
}

export interface AdminEstablishmentOption {
  id: string;
  nomeFantasia: string;
  cnpj: string;
}
