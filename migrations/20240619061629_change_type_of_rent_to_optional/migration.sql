-- DropForeignKey
ALTER TABLE "RentAgreement" DROP CONSTRAINT "RentAgreement_typeId_fkey";

-- AlterTable
ALTER TABLE "RentAgreement" ALTER COLUMN "typeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RentAgreement" ADD CONSTRAINT "RentAgreement_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "RentAgreementType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
