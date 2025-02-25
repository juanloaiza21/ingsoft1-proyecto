/*
  Warnings:

  - Added the required column `paymenForm` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_paymentMethodId_fkey";

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "paymenForm" "PaymentType" NOT NULL,
ALTER COLUMN "paymentMethodId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
