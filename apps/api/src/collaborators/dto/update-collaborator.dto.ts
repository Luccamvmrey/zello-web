import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import type { UpdateCollaboratorDto as UpdateCollaboratorPayload } from '@repo/types';

export class UpdateCollaboratorDto implements UpdateCollaboratorPayload {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}
