import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import type { AuthResponse, MeResponse, RegisterResponse } from '@repo/types';
import { AuthService } from './auth.service.js';
import { CurrentUser, type JwtUser } from './current-user.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { Public } from './public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Get('me')
  me(@CurrentUser() user: JwtUser): Promise<MeResponse> {
    return this.authService.me(user.id);
  }
}
