/*
  Warnings:

  - You are about to drop the column `isPaid` on the `MaintenanceInstallment` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `MaintenanceInstallment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `MaintenanceInstallment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `MaintenanceInstallment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MaintenanceInstallment` DROP COLUMN `isPaid`,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL;
