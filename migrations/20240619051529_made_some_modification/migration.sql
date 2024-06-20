/*
  Warnings:

  - You are about to drop the column `location` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `District` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Neighbour` table. All the data in the column will be lost.
  - You are about to drop the column `bankAccountNumber` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `State` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_propertyId_fkey";

-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "rentAgreementId" INTEGER,
ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "propertyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "propertyId" INTEGER,
ALTER COLUMN "accountName" DROP NOT NULL,
ALTER COLUMN "accountNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "City" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "District" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "Neighbour" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "bankAccountNumber";

-- AlterTable
ALTER TABLE "State" DROP COLUMN "location";

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_rentAgreementId_fkey" FOREIGN KEY ("rentAgreementId") REFERENCES "RentAgreement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
