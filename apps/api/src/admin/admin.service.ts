import { Injectable, NotFoundException } from '@nestjs/common';
import type { AdminAccount, AdminAccountStatusFilter, AdminOverview } from '@repo/types';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAccounts(status: AdminAccountStatusFilter): Promise<AdminAccount[]> {
    const users = await this.prisma.user.findMany({
      where: status === 'ALL' ? {} : { accountStatus: status },
      orderBy: { createdAt: 'desc' },
      include: {
        establishment: { select: { nomeFantasia: true, cnpj: true } },
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt.toISOString(),
      establishment: user.establishment,
    }));
  }

  async approve(id: string): Promise<AdminAccount> {
    return this.setStatus(id, 'ACTIVE');
  }

  async reject(id: string): Promise<AdminAccount> {
    return this.setStatus(id, 'SUSPENDED');
  }

  async reactivate(id: string): Promise<AdminAccount> {
    return this.setStatus(id, 'ACTIVE');
  }

  async overview(): Promise<AdminOverview> {
    const [pendingAccounts, totalEstablishments, totalCollaborators] = await Promise.all([
      this.prisma.user.count({ where: { accountStatus: 'PENDING_APPROVAL' } }),
      this.prisma.establishment.count(),
      this.prisma.collaborator.count(),
    ]);

    return {
      pendingAccounts,
      // Vem do spec R.2 — intencionalmente 0 até lá.
      pendingSolicitations: 0,
      totalEstablishments,
      totalCollaborators,
    };
  }

  private async setStatus(
    id: string,
    accountStatus: 'ACTIVE' | 'SUSPENDED',
  ): Promise<AdminAccount> {
    const existing = await this.prisma.user.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Conta não encontrada.');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { accountStatus },
      include: {
        establishment: { select: { nomeFantasia: true, cnpj: true } },
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt.toISOString(),
      establishment: user.establishment,
    };
  }
}
