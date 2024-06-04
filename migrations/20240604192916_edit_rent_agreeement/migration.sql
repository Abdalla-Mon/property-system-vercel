/*
  Warnings:

  - You are about to alter the column `tax` on the `RentAgreement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `registrationFees` on the `RentAgreement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `insuranceFees` on the `RentAgreement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `RentAgreement` MODIFY `tax` INTEGER NULL,
    MODIFY `registrationFees` INTEGER NULL,
    MODIFY `insuranceFees` INTEGER NULL,
    MODIFY `totalContractPrice` DOUBLE NULL;
