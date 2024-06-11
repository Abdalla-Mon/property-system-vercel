-- AlterTable
ALTER TABLE `Installment` MODIFY `type` ENUM('CASH', 'BANK', 'CHEQUE') NULL;

-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `chequeNumber` VARCHAR(191) NULL,
    MODIFY `paymentTypeMethod` ENUM('CASH', 'BANK', 'CHEQUE') NULL;

-- AlterTable
ALTER TABLE `MaintenanceInstallment` MODIFY `type` ENUM('CASH', 'BANK', 'CHEQUE') NULL;
