-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ESTABLISHMENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED');

-- AlterTable
-- Users existentes recebem ACTIVE (já estavam usando o sistema); o default
-- é ajustado em seguida para que novos cadastros entrem como PENDING_APPROVAL.
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'ESTABLISHMENT';
ALTER TABLE "users" ADD COLUMN "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "users" ALTER COLUMN "accountStatus" SET DEFAULT 'PENDING_APPROVAL';
