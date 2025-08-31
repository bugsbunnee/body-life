/*
  Warnings:

  - The primary key for the `conversations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `conversations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[conversationId]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conversationId` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastResponseId` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `conversations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `conversations` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `conversationId` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastResponseId` VARCHAR(255) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`conversationId`);

-- CreateIndex
CREATE UNIQUE INDEX `conversations_conversationId_key` ON `conversations`(`conversationId`);
