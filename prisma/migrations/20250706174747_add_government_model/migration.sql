-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "governmentId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Government" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Government_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_governmentId_fkey" FOREIGN KEY ("governmentId") REFERENCES "Government"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
