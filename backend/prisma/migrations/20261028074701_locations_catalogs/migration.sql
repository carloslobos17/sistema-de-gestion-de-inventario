/*
  Warnings:

  - A unique constraint covering the columns `[nit]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nrc]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nit` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `suppliers` ADD COLUMN `nit` VARCHAR(14) NOT NULL,
    ADD COLUMN `nrc` VARCHAR(8) NULL;

-- CreateTable
CREATE TABLE `departments` (
    `code` CHAR(2) NOT NULL,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `municipalities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `department_code` CHAR(2) NOT NULL,
    `code` CHAR(2) NOT NULL,
    `name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `municipalities_department_code_code_key`(`department_code`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `districts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `municipality_id` INTEGER NOT NULL,
    `code` CHAR(2) NOT NULL,
    `name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `districts_municipality_id_code_key`(`municipality_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `suppliers_nit_key` ON `suppliers`(`nit`);

-- CreateIndex
CREATE UNIQUE INDEX `suppliers_nrc_key` ON `suppliers`(`nrc`);

-- AddForeignKey
ALTER TABLE `municipalities` ADD CONSTRAINT `municipalities_department_code_fkey` FOREIGN KEY (`department_code`) REFERENCES `departments`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_municipality_id_fkey` FOREIGN KEY (`municipality_id`) REFERENCES `municipalities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
