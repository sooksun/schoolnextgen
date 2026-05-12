/*
  Warnings:

  - You are about to alter the column `file_size_bytes` on the `evidence_files` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedInt`.

*/
-- DropForeignKey
ALTER TABLE `agents` DROP FOREIGN KEY `agents_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `ai_conversations` DROP FOREIGN KEY `ai_conversations_user_id_fkey`;

-- AlterTable
ALTER TABLE `evidence_files` MODIFY `file_size_bytes` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `agents` ADD CONSTRAINT `agents_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_conversations` ADD CONSTRAINT `ai_conversations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
