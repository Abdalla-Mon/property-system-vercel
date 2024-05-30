/*
  Warnings:

  - Added the required column `clientId` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyId` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `clientId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Income` ADD COLUMN `propertyId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Income` ADD CONSTRAINT `Income_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
