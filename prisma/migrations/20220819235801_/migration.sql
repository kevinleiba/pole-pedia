-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_articleUuid_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_sectionUuid_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_articleUuid_fkey";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "sectionUuid" DROP NOT NULL,
ALTER COLUMN "articleUuid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "articleUuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_articleUuid_fkey" FOREIGN KEY ("articleUuid") REFERENCES "Article"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_sectionUuid_fkey" FOREIGN KEY ("sectionUuid") REFERENCES "Section"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_articleUuid_fkey" FOREIGN KEY ("articleUuid") REFERENCES "Article"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
