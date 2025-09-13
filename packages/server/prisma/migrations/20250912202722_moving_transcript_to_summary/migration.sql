/*
  Warnings:

  - You are about to drop the column `transcript` on the `messages` table. All the data in the column will be lost.
  - Added the required column `transcript` to the `summaries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `messages` DROP COLUMN `transcript`;

-- AlterTable
ALTER TABLE `summaries` ADD COLUMN `transcript` TEXT NOT NULL;
