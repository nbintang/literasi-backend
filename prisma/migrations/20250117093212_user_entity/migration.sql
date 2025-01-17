/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `_BookCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_BookCategory` DROP FOREIGN KEY `_BookCategory_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BookCategory` DROP FOREIGN KEY `_BookCategory_B_fkey`;

-- AlterTable
ALTER TABLE `Book` DROP COLUMN `categoryId`;

-- DropTable
DROP TABLE `_BookCategory`;

-- CreateTable
CREATE TABLE `_BookCategories` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BookCategories_AB_unique`(`A`, `B`),
    INDEX `_BookCategories_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Book_title_idx` ON `Book`(`title`);

-- AddForeignKey
ALTER TABLE `_BookCategories` ADD CONSTRAINT `_BookCategories_A_fkey` FOREIGN KEY (`A`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookCategories` ADD CONSTRAINT `_BookCategories_B_fkey` FOREIGN KEY (`B`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
