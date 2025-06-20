/*
  Warnings:

  - You are about to drop the column `unit` on the `inventory` table. All the data in the column will be lost.
  - You are about to alter the column `description` on the `inventory` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "inventory" DROP COLUMN "unit",
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "price" SET DEFAULT 0;
