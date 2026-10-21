-- CreateIndex
CREATE INDEX `brands_is_active_name_idx` ON `brands`(`is_active`, `name`);

-- CreateIndex
CREATE INDEX `categories_is_active_name_idx` ON `categories`(`is_active`, `name`);

-- CreateIndex
CREATE INDEX `users_is_active_created_at_idx` ON `users`(`is_active`, `created_at`);
