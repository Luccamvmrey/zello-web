import { IsIn, IsObject } from 'class-validator';
import type { CreateSolicitationDto as CreateSolicitationPayload, SolicitationType } from '@repo/types';

/**
 * `data` é polimórfico (formato depende de `type`), então não dá pra validar
 * campo a campo aqui sem quebrar o `whitelist: true` global — a validação
 * específica de cada tipo acontece em `SolicitationsService`.
 */
export class CreateSolicitationDto implements CreateSolicitationPayload {
  @IsIn(['NEW_COLLABORATOR', 'NEW_TERMINAL'], { message: 'Tipo de solicitação inválido.' })
  type!: SolicitationType;

  @IsObject({ message: 'Dados da solicitação inválidos.' })
  data!: CreateSolicitationPayload['data'];
}
