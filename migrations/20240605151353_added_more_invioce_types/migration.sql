-- AlterTable
ALTER TABLE `Invoice` MODIFY `invoiceType` ENUM('RENT', 'TAX', 'INSURANCE', 'REGISTRATION', 'MAINTENANCE', 'OTHER') NULL;