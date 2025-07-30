/*
  Warnings:

  - You are about to drop the column `offerId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_offerId_fkey";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "offerId" INTEGER;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "offerId";

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
