/*
  Warnings:

  - You are about to drop the column `clientId` on the `Invoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_clientId_fkey`;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `clientId`,
    ADD COLUMN `ownerId` INTEGER NULL,
    ADD COLUMN `renterId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_renterId_fkey` FOREIGN KEY (`renterId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
