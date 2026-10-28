/*
  Warnings:

  - You are about to drop the column `company_name` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `nit` on the `suppliers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[document_type,document_number]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `district_id` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_number` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_type` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier_type` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `suppliers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `suppliers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `suppliers_company_name_key` ON `suppliers`;

-- DropIndex
DROP INDEX `suppliers_email_key` ON `suppliers`;

-- DropIndex
DROP INDEX `suppliers_is_active_company_name_idx` ON `suppliers`;

-- DropIndex
DROP INDEX `suppliers_nit_key` ON `suppliers`;

-- DropIndex
DROP INDEX `suppliers_phone_key` ON `suppliers`;

-- AlterTable
ALTER TABLE `suppliers` DROP COLUMN `company_name`,
    DROP COLUMN `nit`,
    ADD COLUMN `applies_perception` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `district_id` INTEGER NOT NULL,
    ADD COLUMN `document_number` VARCHAR(20) NOT NULL,
    ADD COLUMN `document_type` ENUM('NIT', 'DUI', 'PASSPORT', 'RESIDENT_CARD', 'OTHER') NOT NULL,
    ADD COLUMN `economic_activity_code` CHAR(5) NULL,
    ADD COLUMN `legal_name` VARCHAR(200) NULL,
    ADD COLUMN `name` VARCHAR(200) NOT NULL,
    ADD COLUMN `phone_alt` VARCHAR(50) NULL,
    ADD COLUMN `supplier_type` ENUM('Taxpayer', 'ExcludedSubject') NOT NULL,
    MODIFY `email` VARCHAR(150) NOT NULL,
    MODIFY `address` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `economic_activities` (
    `code` CHAR(5) NOT NULL,
    `name` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `suppliers_name_key` ON `suppliers`(`name`);

-- CreateIndex
CREATE INDEX `suppliers_is_active_name_idx` ON `suppliers`(`is_active`, `name`);

-- CreateIndex
CREATE UNIQUE INDEX `suppliers_document_type_document_number_key` ON `suppliers`(`document_type`, `document_number`);

-- AddForeignKey
ALTER TABLE `suppliers` ADD CONSTRAINT `suppliers_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suppliers` ADD CONSTRAINT `suppliers_economic_activity_code_fkey` FOREIGN KEY (`economic_activity_code`) REFERENCES `economic_activities`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
