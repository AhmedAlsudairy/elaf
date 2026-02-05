/*
  Warnings:

  - A unique constraint covering the columns `[company_profile_id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "company_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_profile_id_key" ON "companies"("company_profile_id");

-- CreateIndex
CREATE INDEX "companies_company_email_idx" ON "companies"("company_email");

-- CreateIndex
CREATE INDEX "user_profiles_company_id_idx" ON "user_profiles"("company_id");

-- CreateIndex
CREATE INDEX "user_profiles_clerkUserId_idx" ON "user_profiles"("clerkUserId");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
