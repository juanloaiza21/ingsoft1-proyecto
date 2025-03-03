/*
  Warnings:

  - The values [CREDIT,DEBIT,PSE,BANKDEPOSIT] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `bank` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `bankNumber` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `cardHolder` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `cardNumber` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `expirationDate` on the `PaymentMethod` table. All the data in the column will be lost.
  - Made the column `paymentMethodId` on table `Bill` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('CASH', 'PAYPAL');
ALTER TABLE "PaymentMethod" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_paymentMethodId_fkey";

-- AlterTable
ALTER TABLE "Bill" ALTER COLUMN "paymentMethodId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "bank",
DROP COLUMN "bankNumber",
DROP COLUMN "cardHolder",
DROP COLUMN "cardNumber",
DROP COLUMN "expirationDate";

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
