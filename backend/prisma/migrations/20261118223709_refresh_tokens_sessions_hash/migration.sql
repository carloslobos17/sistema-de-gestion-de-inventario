/*
  Warnings:

  - You are about to drop the column `is_revoked` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `refresh_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token_hash]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token_hash` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- Las sesiones viejas guardan el token sin hash y ya no sirven: todos vuelven a iniciar sesión una vez
DELETE FROM `refresh_tokens`;

-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_user_id_fkey`;

-- DropIndex
DROP INDEX `refresh_tokens_token_key` ON `refresh_tokens`;

-- DropIndex
DROP INDEX `refresh_tokens_user_id_key` ON `refresh_tokens`;

-- AlterTable
ALTER TABLE `refresh_tokens` DROP COLUMN `is_revoked`,
    DROP COLUMN `token`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `revoked_at` DATETIME(3) NULL,
    ADD COLUMN `token_hash` CHAR(64) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `refresh_tokens_token_hash_key` ON `refresh_tokens`(`token_hash`);

-- CreateIndex
CREATE INDEX `refresh_tokens_user_id_revoked_at_idx` ON `refresh_tokens`(`user_id`, `revoked_at`);

-- AddForeignKey (se vuelve a crear la relación con users que se quitó arriba)
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
