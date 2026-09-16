-- CreateEnum
CREATE TYPE "SolicitationType" AS ENUM ('NEW_COLLABORATOR', 'NEW_TERMINAL');

-- CreateEnum
CREATE TYPE "SolicitationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "solicitations" (
    "id" UUID NOT NULL,
    "establishmentId" UUID NOT NULL,
    "type" "SolicitationType" NOT NULL,
    "status" "SolicitationStatus" NOT NULL DEFAULT 'PENDING',
    "data" JSONB NOT NULL,
    "adminNotes" TEXT,
    "reviewedById" UUID,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "solicitations_establishmentId_idx" ON "solicitations"("establishmentId");

-- AddForeignKey
ALTER TABLE "solicitations" ADD CONSTRAINT "solicitations_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitations" ADD CONSTRAINT "solicitations_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
