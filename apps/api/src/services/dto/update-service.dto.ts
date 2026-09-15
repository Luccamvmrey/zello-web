import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MaxLength } from 'class-validator';
import type { UpdateServiceDto as UpdateServicePayload } from '@repo/types';

export class UpdateServiceDto implements UpdateServicePayload {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01, { message: 'O preço deve ser maior que zero.' })
  price?: number;
}
