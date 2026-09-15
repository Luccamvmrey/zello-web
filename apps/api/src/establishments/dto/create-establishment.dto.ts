import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { CreateEstablishmentDto as CreateEstablishmentPayload } from '@repo/types';
import { normalizeCep } from '../../common/utils/cep.util.js';
import { normalizeCnpj } from '../../common/utils/cnpj.util.js';

export class CreateEstablishmentDto implements CreateEstablishmentPayload {
  @Transform(({ value }: { value: string }) => normalizeCnpj(value))
  @IsString()
  @Length(14, 14, { message: 'CNPJ deve conter 14 dígitos.' })
  cnpj!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nomeFantasia!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  razaoSocial!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  segmento!: string;

  @Transform(({ value }: { value?: string }) => (value ? normalizeCep(value) : value))
  @IsOptional()
  @IsString()
  @Length(8, 8, { message: 'CEP deve conter 8 dígitos.' })
  cep?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  logradouro?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  numero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  complemento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bairro?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  cidade?: string;

  @Transform(({ value }: { value?: string }) => value?.toUpperCase())
  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'UF deve conter 2 letras.' })
  estado?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  faturamento?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100, { message: 'Encargos tributários devem estar entre 0 e 100.' })
  encargosTributarios?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  numPdvs?: number;
}
