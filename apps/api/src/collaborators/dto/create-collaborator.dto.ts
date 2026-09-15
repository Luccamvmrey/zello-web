import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import type { CreateCollaboratorDto as CreateCollaboratorPayload, DocumentType } from '@repo/types';
import { IsValidDocument } from '../../common/validators/is-valid-document.validator.js';

export class CreateCollaboratorDto implements CreateCollaboratorPayload {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @MaxLength(255)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @Transform(({ value }: { value: string }) => value?.replace(/\D/g, ''))
  @IsString()
  @IsValidDocument({ message: 'Documento inválido.' })
  document!: string;

  @IsIn(['CPF', 'CNPJ'], { message: 'Tipo de documento inválido.' })
  documentType!: DocumentType;
}
