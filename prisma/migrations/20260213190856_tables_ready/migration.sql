/*
  Warnings:

  - You are about to drop the column `endDate` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `lessonDate` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `roomNumber` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `joinDate` on the `student_groups` table. All the data in the column will be lost.
  - You are about to drop the `attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attendance_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staffs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "TeacherStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'FIRED');

-- AlterEnum
ALTER TYPE "GroupStatus" ADD VALUE 'CANCELLED';

-- AlterEnum
ALTER TYPE "StudentGroupStatus" ADD VALUE 'DROPPED';

-- AlterEnum
ALTER TYPE "StudentStatus" ADD VALUE 'FRIZE';

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "attendance_details" DROP CONSTRAINT "attendance_details_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "attendance_details" DROP CONSTRAINT "attendance_details_studentId_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_courseId_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_groupId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_groupId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_groupId_fkey";

-- DropForeignKey
ALTER TABLE "student_groups" DROP CONSTRAINT "student_groups_groupId_fkey";

-- DropForeignKey
ALTER TABLE "student_groups" DROP CONSTRAINT "student_groups_studentId_fkey";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "endDate",
DROP COLUMN "startDate";

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "description",
DROP COLUMN "endTime",
DROP COLUMN "lessonDate",
DROP COLUMN "roomNumber",
DROP COLUMN "startTime",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "student_groups" DROP COLUMN "joinDate";

-- DropTable
DROP TABLE "attendance";

-- DropTable
DROP TABLE "attendance_details";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "schedule";

-- DropTable
DROP TABLE "staffs";

-- DropEnum
DROP TYPE "AttendanceStatus";

-- DropEnum
DROP TYPE "Day";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "birthDate" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "position" TEXT,
    "hireDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_groups" ADD CONSTRAINT "student_groups_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_groups" ADD CONSTRAINT "student_groups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
