-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_authorId_fkey`;

-- AlterTable
ALTER TABLE `Profile` MODIFY `authorId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
