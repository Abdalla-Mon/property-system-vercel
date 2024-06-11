-- AlterTable
ALTER TABLE `Maintenance` ADD COLUMN `payEvery` ENUM('ONCE', 'TWO_MONTHS', 'FOUR_MONTHS', 'SIX_MONTHS', 'ONE_YEAR') NULL,
    ADD COLUMN `unitId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
