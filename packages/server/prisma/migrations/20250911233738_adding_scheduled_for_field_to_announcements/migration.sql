/*
  Warnings:

  - Added the required column `scheduledFor` to the `announcements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `announcements` ADD COLUMN `scheduledFor` DATETIME(3) NOT NULL;
