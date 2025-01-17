-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_orderedUserId_fkey`;

-- DropIndex
DROP INDEX `Order_orderedUserId_fkey` ON `Order`;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_orderedUserId_fkey` FOREIGN KEY (`orderedUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
