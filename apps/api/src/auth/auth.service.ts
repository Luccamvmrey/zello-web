import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import type {
  AuthResponse,
  AuthUser,
  EstablishmentSummary,
  MeResponse,
  RegisterResponse,
  UserRole,
} from '@repo/types';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { JwtPayload } from './jwt.strategy.js';

const BCRYPT_ROUNDS = 10;

/** Mesma mensagem para e-mail inexistente e senha errada — não vazar se o e-mail existe. */
const INVALID_CREDENTIALS = 'Credenciais inválidas.';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const email = normalizeEmail(dto.email);

    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    await this.prisma.user.create({
      data: {
        email,
        name: dto.name.trim(),
        passwordHash: await hash(dto.password, BCRYPT_ROUNDS),
        accountStatus: 'PENDING_APPROVAL',
      },
    });

    return { message: 'Conta criada. Aguarde aprovação para acessar o sistema.' };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizeEmail(dto.email) },
    });

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const passwordMatches = await compare(dto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    if (user.accountStatus === 'PENDING_APPROVAL') {
      throw new ForbiddenException('Sua conta está aguardando aprovação.');
    }

    if (user.accountStatus === 'SUSPENDED') {
      throw new ForbiddenException('Sua conta foi suspensa.');
    }

    return this.buildAuthResponse(user);
  }

  async me(userId: string): Promise<MeResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        establishment: {
          select: {
            id: true,
            cnpj: true,
            nomeFantasia: true,
            razaoSocial: true,
            segmento: true,
            numPdvs: true,
          },
        },
      },
    });

    // O token é válido mas o usuário sumiu (conta removida). Trata como não autenticado.
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      accountStatus: user.accountStatus,
      establishmentId: user.establishmentId,
      establishment: user.establishment as EstablishmentSummary | null,
    };
  }

  private buildAuthResponse(user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    establishmentId: string | null;
  }): AuthResponse {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const publicUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      establishmentId: user.establishmentId,
    };

    return { accessToken: this.jwt.sign(payload), user: publicUser };
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
