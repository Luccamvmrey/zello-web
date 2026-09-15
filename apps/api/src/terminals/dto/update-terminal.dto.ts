import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import type { UpdateTerminalDto as UpdateTerminalPayload } from '@repo/types';

export class UpdateTerminalDto implements UpdateTerminalPayload {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;
}
