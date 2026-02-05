/*
  Warnings:

  - The values [RealEstate] on the enum `SectorEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SectorEnum_new" AS ENUM ('Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Construction', 'Transportation', 'Energy', 'Agriculture', 'Telecommunications', 'Hospitality', 'Realestate', 'Media', 'Consulting');
ALTER TABLE "companies" ALTER COLUMN "sectors" TYPE "SectorEnum_new"[] USING ("sectors"::text::"SectorEnum_new"[]);
ALTER TABLE "tenders" ALTER COLUMN "tender_sectors" TYPE "SectorEnum_new"[] USING ("tender_sectors"::text::"SectorEnum_new"[]);
ALTER TYPE "SectorEnum" RENAME TO "SectorEnum_old";
ALTER TYPE "SectorEnum_new" RENAME TO "SectorEnum";
DROP TYPE "public"."SectorEnum_old";
COMMIT;
