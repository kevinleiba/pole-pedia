/*
  Warnings:

  - The primary key for the `Article` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `introduction` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Article` table. All the data in the column will be lost.

*/
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- AlterTable
ALTER TABLE "Article" DROP CONSTRAINT "Article_pkey",
DROP COLUMN "content",
DROP COLUMN "id",
DROP COLUMN "image",
DROP COLUMN "introduction",
DROP COLUMN "title",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Article_pkey" PRIMARY KEY ("uuid");

-- CreateTable
CREATE TABLE "Section" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "articleUuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Image" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sectionUuid" UUID NOT NULL,
    "articleUuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Information" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "articleUuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Information_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_SubSections" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_articleUuid_key" ON "Section"("articleUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Image_articleUuid_key" ON "Image"("articleUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Information_articleUuid_key" ON "Information"("articleUuid");

-- CreateIndex
CREATE UNIQUE INDEX "_SubSections_AB_unique" ON "_SubSections"("A", "B");

-- CreateIndex
CREATE INDEX "_SubSections_B_index" ON "_SubSections"("B");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_articleUuid_fkey" FOREIGN KEY ("articleUuid") REFERENCES "Article"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_sectionUuid_fkey" FOREIGN KEY ("sectionUuid") REFERENCES "Section"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_articleUuid_fkey" FOREIGN KEY ("articleUuid") REFERENCES "Article"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Information" ADD CONSTRAINT "Information_articleUuid_fkey" FOREIGN KEY ("articleUuid") REFERENCES "Article"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubSections" ADD CONSTRAINT "_SubSections_A_fkey" FOREIGN KEY ("A") REFERENCES "Section"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubSections" ADD CONSTRAINT "_SubSections_B_fkey" FOREIGN KEY ("B") REFERENCES "Section"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
