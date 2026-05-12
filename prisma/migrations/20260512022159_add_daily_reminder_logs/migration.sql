-- CreateTable
CREATE TABLE `daily_reminder_logs` (
    `id` CHAR(36) NOT NULL,
    `school_id` CHAR(36) NOT NULL,
    `run_date` DATE NOT NULL,
    `job_kind` VARCHAR(50) NOT NULL,
    `triggered_by` VARCHAR(50) NOT NULL,
    `teachers_total` INTEGER NOT NULL DEFAULT 0,
    `teachers_missing` INTEGER NOT NULL DEFAULT 0,
    `notifications_sent` INTEGER NOT NULL DEFAULT 0,
    `details` JSON NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3) NULL,
    `status` VARCHAR(50) NOT NULL,
    `error_message` TEXT NULL,

    INDEX `daily_reminder_logs_run_date_job_kind_idx`(`run_date`, `job_kind`),
    UNIQUE INDEX `daily_reminder_logs_school_id_run_date_job_kind_key`(`school_id`, `run_date`, `job_kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
