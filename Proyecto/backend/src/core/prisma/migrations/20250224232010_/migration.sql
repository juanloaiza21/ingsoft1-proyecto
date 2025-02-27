-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_paymentMethodId_fkey";

-- AlterTable
ALTER TABLE "Bill" ALTER COLUMN "paymentMethodId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
