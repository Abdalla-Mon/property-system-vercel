/*
  Warnings:

  - Made the column `buildingGuardName` on table `Property` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Property_buildingGuardId_fkey` ON `Property`;

-- AlterTable
ALTER TABLE `Property` MODIFY `propertyId` VARCHAR(191) NOT NULL,
    MODIFY `voucherNumber` VARCHAR(191) NULL,
    MODIFY `buildingGuardId` VARCHAR(191) NULL,
    MODIFY `bankAccountNumber` VARCHAR(191) NOT NULL,
    MODIFY `plateNumber` VARCHAR(191) NOT NULL,
    MODIFY `buildingGuardName` VARCHAR(191) NOT NULL,
    MODIFY `buildingGuardPhone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Unit` MODIFY `number` VARCHAR(191) NULL,
    MODIFY `electricityMeter` VARCHAR(191) NULL,
    MODIFY `unitId` VARCHAR(191) NULL;
