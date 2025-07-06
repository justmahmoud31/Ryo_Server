-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_sizeId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "sizeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE SET NULL ON UPDATE CASCADE;
