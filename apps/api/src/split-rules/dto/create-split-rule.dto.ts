import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import type { CreateSplitRuleDto as CreateSplitRulePayload, SplitRuleType } from '@repo/types';
import { IsValidSplitValue } from '../../common/validators/is-valid-split-value.validator.js';

export class CreateSplitRuleDto implements CreateSplitRulePayload {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsIn(['PERCENTAGE', 'FIXED'], { message: 'Tipo de regra inválido.' })
  type!: SplitRuleType;

  @IsNumber()
  @IsValidSplitValue()
  value!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
