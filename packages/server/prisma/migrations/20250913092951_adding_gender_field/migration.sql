/*
  Warnings:

  - Added the required column `gender` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `dateVisited` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `gender` VARCHAR(10) NOT NULL,
    ADD COLUMN `notes` TEXT NULL;
