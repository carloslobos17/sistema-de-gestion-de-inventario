/*
  Warnings:

  - You are about to drop the column `first_name` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `customers` table. All the data in the column will be lost.
  - You are about to alter the column `document_number` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - A unique constraint covering the columns `[nrc]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[document_type,document_number]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_type` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `customers_document_number_key` ON `customers`;

-- DropIndex
DROP INDEX `customers_email_key` ON `customers`;

-- DropIndex
DROP INDEX `customers_is_active_last_name_first_name_idx` ON `customers`;

-- DropIndex
DROP INDEX `customers_phone_key` ON `customers`;

-- AlterTable
ALTER TABLE `customers` DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    ADD COLUMN `customer_type` ENUM('FinalConsumer', 'Taxpayer') NOT NULL,
    ADD COLUMN `district_id` INTEGER NULL,
    ADD COLUMN `document_type` ENUM('NIT', 'DUI', 'PASSPORT', 'RESIDENT_CARD', 'OTHER') NULL,
    ADD COLUMN `economic_activity_code` CHAR(5) NULL,
    ADD COLUMN `gender` ENUM('M', 'F') NULL,
    ADD COLUMN `name` VARCHAR(200) NOT NULL,
    ADD COLUMN `nrc` VARCHAR(8) NULL,
    ADD COLUMN `phone_alt` VARCHAR(50) NULL,
    ADD COLUMN `trade_name` VARCHAR(200) NULL,
    MODIFY `document_number` VARCHAR(20) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `customers_nrc_key` ON `customers`(`nrc`);

-- CreateIndex
CREATE INDEX `customers_is_active_name_idx` ON `customers`(`is_active`, `name`);

-- CreateIndex
CREATE UNIQUE INDEX `customers_document_type_document_number_key` ON `customers`(`document_type`, `document_number`);

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_economic_activity_code_fkey` FOREIGN KEY (`economic_activity_code`) REFERENCES `economic_activities`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
