/*
  Warnings:

  - You are about to drop the `Finance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Focus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Finance";

-- DropTable
DROP TABLE "Focus";

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "focus_sessions" (
    "id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "type" VARCHAR(10) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "focus_sessions_pkey" PRIMARY KEY ("id")
);
