/*
  Warnings:

  - Made the column `role` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Profile` MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
