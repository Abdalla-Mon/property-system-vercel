/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `invoiceType` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expense` DROP COLUMN `isPaid`;

-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `invoiceType` ENUM('RENT', 'TAX', 'INSURANCE', 'REGISTRATION', 'MAINTENANCE', 'OTHER') NOT NULL;
