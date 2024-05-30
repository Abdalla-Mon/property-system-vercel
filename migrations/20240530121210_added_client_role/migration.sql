/*
  Warnings:

  - Added the required column `role` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Client` ADD COLUMN `role` ENUM('OWNER', 'RENTER') NOT NULL;
