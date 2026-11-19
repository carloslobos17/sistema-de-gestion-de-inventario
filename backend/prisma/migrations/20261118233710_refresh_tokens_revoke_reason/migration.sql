-- AlterTable
ALTER TABLE `refresh_tokens` ADD COLUMN `revoked_reason` ENUM('ROTATED', 'LOGOUT', 'SESSION_LIMIT', 'SECURITY') NULL;
