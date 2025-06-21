-- CreateTable
CREATE TABLE "focus_presets" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "type" "FocusType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "focus_presets_pkey" PRIMARY KEY ("id")
);
