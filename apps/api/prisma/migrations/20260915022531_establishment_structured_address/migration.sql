/*
  Warnings:

  - You are about to drop the column `endereco` on the `establishments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "endereco",
ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "cep" VARCHAR(8),
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "estado" VARCHAR(2),
ADD COLUMN     "logradouro" TEXT,
ADD COLUMN     "numero" TEXT;
