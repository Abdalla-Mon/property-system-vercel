/*
  Warnings:

  - You are about to alter the column `propertyId` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `voucherNumber` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `bankAccountNumber` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `plateNumber` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `number` on the `Unit` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `electricityMeter` on the `Unit` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `unitId` on the `Unit` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `BuildingGuard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Property` DROP FOREIGN KEY `Property_buildingGuardId_fkey`;

-- AlterTable
ALTER TABLE `Property` ADD COLUMN `buildingGuardName` VARCHAR(191) NULL,
    ADD COLUMN `buildingGuardPhone` INTEGER NULL,
    MODIFY `propertyId` INTEGER NOT NULL,
    MODIFY `voucherNumber` INTEGER NULL,
    MODIFY `location` VARCHAR(191) NULL,
    MODIFY `street` VARCHAR(191) NULL,
    MODIFY `buildingGuardId` INTEGER NULL,
    MODIFY `bankAccountNumber` INTEGER NOT NULL,
    MODIFY `plateNumber` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Unit` MODIFY `number` INTEGER NULL,
    MODIFY `electricityMeter` INTEGER NULL,
    MODIFY `unitId` INTEGER NULL;

-- DropTable
DROP TABLE `BuildingGuard`;
