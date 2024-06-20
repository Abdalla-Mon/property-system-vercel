/*
  Warnings:

  - The values [CLIENT,RENT_AGREEMENT,BILLING] on the enum `PrivilegeArea` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PrivilegeArea_new" AS ENUM ('HOME', 'FOLLOW_UP', 'PROPERTY', 'UNIT', 'RENT', 'INVOICE', 'MAINTENANCE', 'REPORT', 'OWNER', 'RENTER', 'SETTING');
ALTER TABLE "UserPrivilege" ALTER COLUMN "area" TYPE "PrivilegeArea_new" USING ("area"::text::"PrivilegeArea_new");
ALTER TYPE "PrivilegeArea" RENAME TO "PrivilegeArea_old";
ALTER TYPE "PrivilegeArea_new" RENAME TO "PrivilegeArea";
DROP TYPE "PrivilegeArea_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;
