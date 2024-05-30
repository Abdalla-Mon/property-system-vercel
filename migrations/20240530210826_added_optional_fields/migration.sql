-- AlterTable
ALTER TABLE `Unit` MODIFY `number` VARCHAR(191) NULL,
    MODIFY `yearlyRentPrice` DOUBLE NULL,
    MODIFY `electricityMeter` VARCHAR(191) NULL,
    MODIFY `numBedrooms` INTEGER NULL,
    MODIFY `numBathrooms` INTEGER NULL,
    MODIFY `numACs` INTEGER NULL,
    MODIFY `numLivingRooms` INTEGER NULL,
    MODIFY `numKitchens` INTEGER NULL,
    MODIFY `numSaloons` INTEGER NULL,
    MODIFY `unitId` VARCHAR(191) NULL,
    MODIFY `typeId` INTEGER NULL;
