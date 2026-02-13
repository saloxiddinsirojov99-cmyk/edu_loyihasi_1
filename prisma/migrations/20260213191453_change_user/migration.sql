/*
  Warnings:

  - You are about to drop the column `firstName` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "students_username_key";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ALTER COLUMN "role" SET DEFAULT 'SUPERADMIN';
