import { IsNotEmpty, IsNumber, IsString, Min, MaxLength } from 'class-validator';
import type { CreateServiceDto as CreateServicePayload } from '@repo/types';

export class CreateServiceDto implements CreateServicePayload {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsNumber()
  @Min(0.01, { message: 'O preço deve ser maior que zero.' })
  price!: number;
}
