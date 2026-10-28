/*
  Warnings:

  - You are about to drop the column `is_active` on the `units_of_measure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `credit_limit` DECIMAL(12, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `suppliers` ADD COLUMN `contact_name` VARCHAR(150) NULL;

-- AlterTable
ALTER TABLE `units_of_measure` DROP COLUMN `is_active`,
    MODIFY `id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `customers_is_active_last_name_first_name_idx` ON `customers`(`is_active`, `last_name`, `first_name`);

-- CreateIndex
CREATE INDEX `suppliers_is_active_company_name_idx` ON `suppliers`(`is_active`, `company_name`);
