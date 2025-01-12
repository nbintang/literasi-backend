/*
  Warnings:

  - You are about to drop the column `imageId` on the `book` table. All the data in the column will be lost.
  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_imageId_fkey`;

-- AlterTable
ALTER TABLE `book` DROP COLUMN `imageId`,
    ADD COLUMN `image` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `image` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `image`;
