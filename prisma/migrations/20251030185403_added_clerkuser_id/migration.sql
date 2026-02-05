/*
  Warnings:

  - A unique constraint covering the columns `[clerkUserId]` on the table `user_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `user_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "clerkUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_clerkUserId_key" ON "user_profiles"("clerkUserId");
