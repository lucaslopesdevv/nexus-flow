/*
  Warnings:

  - Changed the type of `type` on the `focus_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('income', 'expense');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('salary', 'investment', 'other_income', 'food', 'transportation', 'utilities', 'entertainment', 'shopping', 'healthcare', 'other_expense');

-- CreateEnum
CREATE TYPE "FocusType" AS ENUM ('focus', 'break');

-- AlterTable
ALTER TABLE "focus_sessions" DROP COLUMN "type",
ADD COLUMN     "type" "FocusType" NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "TransactionCategory" NOT NULL;
