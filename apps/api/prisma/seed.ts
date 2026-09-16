import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env['DATABASE_URL'];

if (!connectionString) {
  throw new Error('DATABASE_URL não está definida. Confira o apps/api/.env.');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

/**
 * Senha de dev, usada só quando ADMIN_SEED_PASSWORD não está setada.
 * Em qualquer deploy real, defina ADMIN_SEED_PASSWORD no ambiente.
 */
const ADMIN_SEED_PASSWORD = process.env['ADMIN_SEED_PASSWORD'] ?? 'TROCAR_ESSA_SENHA';

async function main(): Promise<void> {
  await prisma.user.upsert({
    where: { email: 'admin@zello.com.br' },
    update: {},
    create: {
      email: 'admin@zello.com.br',
      name: 'Admin Zello',
      passwordHash: await bcrypt.hash(ADMIN_SEED_PASSWORD, 10),
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
    },
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
