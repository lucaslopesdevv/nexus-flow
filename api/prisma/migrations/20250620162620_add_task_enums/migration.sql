/*
  Warnings:

  - Changed the type of `priority` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "tasks" 
  ALTER COLUMN "priority" TYPE "TaskPriority" USING priority::text::"TaskPriority",
  ALTER COLUMN "status" TYPE "TaskStatus" USING status::text::"TaskStatus";
