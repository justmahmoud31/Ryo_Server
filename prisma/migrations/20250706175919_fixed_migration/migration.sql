-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_governmentId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "governmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_governmentId_fkey" FOREIGN KEY ("governmentId") REFERENCES "Government"("id") ON DELETE SET NULL ON UPDATE CASCADE;
