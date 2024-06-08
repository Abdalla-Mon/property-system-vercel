/*
  Warnings:

  - You are about to drop the column `paymentTypeMethod` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `paymentTypeMethod` ENUM('CASH', 'BANK') NULL;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `paymentTypeMethod`;
