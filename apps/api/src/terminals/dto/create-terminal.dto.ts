import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import type { CreateTerminalDto as CreateTerminalPayload } from '@repo/types';

export class CreateTerminalDto implements CreateTerminalPayload {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}
