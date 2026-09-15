import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import type { UpdateSplitRuleDto as UpdateSplitRulePayload, SplitRuleType } from '@repo/types';
import { IsValidSplitValue } from '../../common/validators/is-valid-split-value.validator.js';

export class UpdateSplitRuleDto implements UpdateSplitRulePayload {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsIn(['PERCENTAGE', 'FIXED'], { message: 'Tipo de regra inválido.' })
  type?: SplitRuleType;

  @IsOptional()
  @IsNumber()
  @ValidateIf((o: { value?: unknown }) => o.value !== undefined)
  @IsValidSplitValue()
  value?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
