import { IsOptional, IsString, MaxLength } from 'class-validator';
import type { RejectAccountDto as RejectAccountPayload } from '@repo/types';

export class RejectAccountDto implements RejectAccountPayload {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
