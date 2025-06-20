-- AlterTable
ALTER TABLE "inventory" ALTER COLUMN "quantity" DROP DEFAULT,
ALTER COLUMN "price" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Finance" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Finance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Focus" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Focus_pkey" PRIMARY KEY ("id")
);
