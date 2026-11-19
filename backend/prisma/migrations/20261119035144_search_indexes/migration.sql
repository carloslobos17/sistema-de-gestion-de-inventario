-- CreateIndex
CREATE INDEX `customers_document_number_idx` ON `customers`(`document_number`);

-- CreateIndex
CREATE INDEX `customers_phone_idx` ON `customers`(`phone`);

-- CreateIndex
CREATE INDEX `customers_email_idx` ON `customers`(`email`);

-- CreateIndex
CREATE FULLTEXT INDEX `customers_name_trade_name_idx` ON `customers`(`name`, `trade_name`);

-- CreateIndex
CREATE INDEX `suppliers_document_number_idx` ON `suppliers`(`document_number`);

-- CreateIndex
CREATE INDEX `suppliers_email_idx` ON `suppliers`(`email`);

-- CreateIndex
CREATE FULLTEXT INDEX `suppliers_name_legal_name_contact_name_idx` ON `suppliers`(`name`, `legal_name`, `contact_name`);
