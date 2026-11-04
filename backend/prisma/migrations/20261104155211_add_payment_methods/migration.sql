-- CreateTable
CREATE TABLE `payment_methods` (
    `code` CHAR(2) NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `payment_methods_name_key`(`name`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
