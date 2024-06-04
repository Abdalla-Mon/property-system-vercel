/*
  Warnings:

  - You are about to drop the column `ownerId` on the `RentAgreement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `RentAgreement` DROP FOREIGN KEY `RentAgreement_ownerId_fkey`;

-- AlterTable
ALTER TABLE `RentAgreement` DROP COLUMN `ownerId`;
