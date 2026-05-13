-- CreateTable
CREATE TABLE `tasks` (
    `id` CHAR(36) NOT NULL,
    `school_id` CHAR(36) NOT NULL,
    `area_office_id` CHAR(36) NULL,
    `school_network_id` CHAR(36) NULL,
    `academic_year_id` CHAR(36) NOT NULL,
    `academic_term_id` CHAR(36) NULL,
    `department_id` CHAR(36) NULL,
    `classroom_id` CHAR(36) NULL,
    `task_type` VARCHAR(100) NOT NULL,
    `scope_level` VARCHAR(50) NOT NULL DEFAULT 'school',
    `title` VARCHAR(500) NOT NULL,
    `description` MEDIUMTEXT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'draft',
    `priority` VARCHAR(20) NOT NULL DEFAULT 'normal',
    `due_date` DATETIME(3) NULL,
    `created_by_user_id` CHAR(36) NOT NULL,
    `created_by_agent_id` CHAR(36) NULL,
    `parent_task_id` CHAR(36) NULL,
    `metadata` JSON NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `tasks_school_id_academic_year_id_academic_term_id_idx`(`school_id`, `academic_year_id`, `academic_term_id`),
    INDEX `tasks_school_id_status_idx`(`school_id`, `status`),
    INDEX `tasks_department_id_status_idx`(`department_id`, `status`),
    INDEX `tasks_classroom_id_status_idx`(`classroom_id`, `status`),
    INDEX `tasks_due_date_status_idx`(`due_date`, `status`),
    INDEX `tasks_parent_task_id_idx`(`parent_task_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task_assignees` (
    `id` CHAR(36) NOT NULL,
    `task_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NULL,
    `agent_id` CHAR(36) NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'responsible',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `task_assignees_task_id_idx`(`task_id`),
    INDEX `task_assignees_user_id_role_idx`(`user_id`, `role`),
    INDEX `task_assignees_agent_id_role_idx`(`agent_id`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ai_conversations_task_id_idx` ON `ai_conversations`(`task_id`);

-- CreateIndex
CREATE INDEX `evidence_files_task_id_idx` ON `evidence_files`(`task_id`);

-- CreateIndex
CREATE INDEX `teacher_daily_reflections_task_id_idx` ON `teacher_daily_reflections`(`task_id`);

-- AddForeignKey
ALTER TABLE `ai_conversations` ADD CONSTRAINT `ai_conversations_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_daily_reflections` ADD CONSTRAINT `teacher_daily_reflections_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidence_files` ADD CONSTRAINT `evidence_files_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_academic_term_id_fkey` FOREIGN KEY (`academic_term_id`) REFERENCES `academic_terms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_created_by_agent_id_fkey` FOREIGN KEY (`created_by_agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_parent_task_id_fkey` FOREIGN KEY (`parent_task_id`) REFERENCES `tasks`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `task_assignees` ADD CONSTRAINT `task_assignees_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_assignees` ADD CONSTRAINT `task_assignees_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_assignees` ADD CONSTRAINT `task_assignees_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
