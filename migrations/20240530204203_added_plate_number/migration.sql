/*
  Warnings:

  - Added the required column `plateNumber` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Property` ADD COLUMN `plateNumber` VARCHAR(191) NOT NULL;
