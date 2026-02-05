-- CreateEnum
CREATE TYPE "SectorEnum" AS ENUM ('TECHNOLOGY', 'HEALTHCARE', 'FINANCE', 'EDUCATION', 'MANUFACTURING', 'RETAIL', 'CONSTRUCTION', 'TRANSPORTATION', 'ENERGY', 'AGRICULTURE', 'TELECOMMUNICATIONS', 'HOSPITALITY', 'REAL_ESTATE', 'MEDIA', 'CONSULTING');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('OMR', 'EGP', 'SAR', 'AED');

-- CreateEnum
CREATE TYPE "PDFChoice" AS ENUM ('upload', 'generate');

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "phone_number" TEXT,
    "address" TEXT,
    "profile_image" TEXT,
    "role" TEXT,
    "company_that_worked_with" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "company_profile_id" TEXT,
    "company_title" TEXT NOT NULL,
    "company_number" TEXT,
    "company_website" TEXT,
    "company_email" TEXT NOT NULL,
    "sectors" "SectorEnum"[],
    "bio" TEXT,
    "phone_number" TEXT,
    "address" TEXT,
    "profile_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenders" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "tender_sectors" "SectorEnum"[],
    "currency" "Currency" NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "terms" TEXT NOT NULL,
    "scope_of_works" TEXT NOT NULL,
    "pdf_choice" "PDFChoice" NOT NULL,
    "company_id" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_fields" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tender_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_email_key" ON "companies"("company_email");

-- CreateIndex
CREATE INDEX "tenders_company_id_idx" ON "tenders"("company_id");

-- CreateIndex
CREATE INDEX "tenders_user_id_idx" ON "tenders"("user_id");

-- CreateIndex
CREATE INDEX "tenders_end_date_idx" ON "tenders"("end_date");

-- CreateIndex
CREATE INDEX "custom_fields_tender_id_idx" ON "custom_fields"("tender_id");

-- AddForeignKey
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_fields" ADD CONSTRAINT "custom_fields_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
