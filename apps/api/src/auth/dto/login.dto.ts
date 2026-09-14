import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import type { LoginPayload } from '@repo/types';

export class LoginDto implements LoginPayload {
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(1, { message: 'Informe a senha.' })
  @MaxLength(72)
  password!: string;
}
