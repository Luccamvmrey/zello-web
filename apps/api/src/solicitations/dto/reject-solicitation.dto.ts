import { IsOptional, IsString, MaxLength } from 'class-validator';
import type { RejectSolicitationDto as RejectSolicitationPayload } from '@repo/types';

export class RejectSolicitationDto implements RejectSolicitationPayload {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
