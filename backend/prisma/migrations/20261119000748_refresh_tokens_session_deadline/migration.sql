/*
  Warnings:

  - Added the required column `session_expires_at` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- Las sesiones existentes no tienen fin de jornada: se borran y todos vuelven a iniciar sesión una vez
DELETE FROM `refresh_tokens`;

-- AlterTable
ALTER TABLE `refresh_tokens` ADD COLUMN `session_expires_at` DATETIME(3) NOT NULL;