/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceType` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `paidAmount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ContractExpenseToRentAgreement` ADD COLUMN `paidAmount` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `dueDate`,
    DROP COLUMN `invoiceType`,
    DROP COLUMN `paidAmount`,
    DROP COLUMN `status`,
    ADD COLUMN `contractExpenseId` INTEGER NULL,
    ADD COLUMN `paymentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `MaintenanceInstallment` MODIFY `type` ENUM('CASH', 'BANK') NULL;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `paidAmount` DOUBLE NOT NULL DEFAULT 0,
    `dueDate` DATETIME(3) NOT NULL,
    `installmentId` INTEGER NOT NULL,
    `maintenanceInstallmentId` INTEGER NULL,
    `bankId` INTEGER NULL,
    `paymentTypeMethod` ENUM('CASH', 'BANK') NULL,
    `status` ENUM('PENDING', 'PAID', 'OVERDUE') NOT NULL,
    `propertyId` INTEGER NULL,
    `clientId` INTEGER NULL,
    `maintenanceId` INTEGER NULL,
    `rentAgreementId` INTEGER NULL,
    `contractExpenseId` INTEGER NULL,
    `paymentType` ENUM('RENT', 'TAX', 'INSURANCE', 'REGISTRATION', 'MAINTENANCE', 'OTHER') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_installmentId_fkey` FOREIGN KEY (`installmentId`) REFERENCES `Installment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_maintenanceInstallmentId_fkey` FOREIGN KEY (`maintenanceInstallmentId`) REFERENCES `MaintenanceInstallment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bankId_fkey` FOREIGN KEY (`bankId`) REFERENCES `Bank`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_maintenanceId_fkey` FOREIGN KEY (`maintenanceId`) REFERENCES `Maintenance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_rentAgreementId_fkey` FOREIGN KEY (`rentAgreementId`) REFERENCES `RentAgreement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_contractExpenseId_fkey` FOREIGN KEY (`contractExpenseId`) REFERENCES `ContractExpenseToRentAgreement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_contractExpenseId_fkey` FOREIGN KEY (`contractExpenseId`) REFERENCES `ContractExpenseToRentAgreement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
