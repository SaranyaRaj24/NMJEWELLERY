-- CreateTable
CREATE TABLE `bills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_number` VARCHAR(191) NOT NULL,
    `bill_name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `bills_bill_number_key`(`bill_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bill_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_number` VARCHAR(191) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tag_number` VARCHAR(191) NOT NULL,
    `before_weight` DOUBLE NULL,
    `after_weight` DOUBLE NULL,
    `difference` DOUBLE NULL,
    `adjustment` DOUBLE NULL,
    `final_weight` DOUBLE NULL,
    `product_number` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `product_type` ENUM('hold', 'active', 'sold') NOT NULL DEFAULT 'active',
    `barcode_weight` DOUBLE NULL,
    `lot_id` INTEGER NOT NULL,

    UNIQUE INDEX `product_info_product_number_key`(`product_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lot_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lot_name` VARCHAR(191) NOT NULL,
    `bulk_weight_before` DOUBLE NULL,
    `bulk_after_weight` DOUBLE NULL,
    `adjustment_percent` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lot_process` ENUM('completed', 'not_completed') NOT NULL DEFAULT 'not_completed',

    UNIQUE INDEX `lot_info_lot_name_key`(`lot_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bill_items` ADD CONSTRAINT `bill_items_bill_number_fkey` FOREIGN KEY (`bill_number`) REFERENCES `bills`(`bill_number`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bill_items` ADD CONSTRAINT `bill_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_info` ADD CONSTRAINT `product_info_lot_id_fkey` FOREIGN KEY (`lot_id`) REFERENCES `lot_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
