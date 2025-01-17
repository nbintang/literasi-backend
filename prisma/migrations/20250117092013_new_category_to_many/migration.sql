-- DropForeignKey
ALTER TABLE `Book` DROP FOREIGN KEY `Book_categoryId_fkey`;

-- DropIndex
DROP INDEX `Book_categoryId_fkey` ON `Book`;

-- CreateTable
CREATE TABLE `_BookCategory` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BookCategory_AB_unique`(`A`, `B`),
    INDEX `_BookCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BookCategory` ADD CONSTRAINT `_BookCategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookCategory` ADD CONSTRAINT `_BookCategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
