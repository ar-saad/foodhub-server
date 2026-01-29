/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `meal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "meal" DROP COLUMN "imageUrl",
ADD COLUMN     "image" TEXT;
