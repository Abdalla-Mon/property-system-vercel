-- AlterTable
ALTER TABLE `Property` ADD COLUMN `neighbourId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Neighbour` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `districtId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Neighbour` ADD CONSTRAINT `Neighbour_districtId_fkey` FOREIGN KEY (`districtId`) REFERENCES `District`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_neighbourId_fkey` FOREIGN KEY (`neighbourId`) REFERENCES `Neighbour`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
