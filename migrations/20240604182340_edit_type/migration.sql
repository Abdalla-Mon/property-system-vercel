/*
  Warnings:

  - You are about to alter the column `tax` on the `RentAgreement` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `registrationFees` on the `RentAgreement` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `insuranceFees` on the `RentAgreement` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Installment` MODIFY `type` ENUM('CASH', 'BANK') NULL;

-- AlterTable
ALTER TABLE `RentAgreement` ADD COLUMN `status` ENUM('CANCELED', 'EXPIRED', 'ACTIVE') NOT NULL DEFAULT 'ACTIVE',
    MODIFY `tax` VARCHAR(191) NULL,
    MODIFY `registrationFees` VARCHAR(191) NULL,
    MODIFY `insuranceFees` VARCHAR(191) NULL;
