/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `order_item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `items` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('CUSTOMER', 'PROVIDER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_mealId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_orderId_fkey";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "items" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "UserRoles" NOT NULL DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE "order_item";

-- DropEnum
DROP TYPE "USER_ROLES";
