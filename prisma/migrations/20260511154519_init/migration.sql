-- CreateTable
CREATE TABLE `persons` (
    `id` CHAR(36) NOT NULL,
    `national_id_hash` VARCHAR(255) NULL,
    `display_name` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `profile` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `persons_email_idx`(`email`),
    INDEX `persons_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `person_id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_person_id_idx`(`person_id`),
    INDEX `users_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(64) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sessions_user_id_idx`(`user_id`),
    INDEX `sessions_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` CHAR(36) NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `scope_level` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `roles_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `education_area_offices` (
    `id` CHAR(36) NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `office_type` VARCHAR(100) NULL,
    `province` VARCHAR(255) NULL,
    `region` VARCHAR(255) NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(50) NULL,
    `email` VARCHAR(255) NULL,
    `settings` JSON NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `education_area_offices_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_networks` (
    `id` CHAR(36) NOT NULL,
    `area_office_id` CHAR(36) NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `school_networks_area_office_id_idx`(`area_office_id`),
    UNIQUE INDEX `school_networks_area_office_id_code_key`(`area_office_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schools` (
    `id` CHAR(36) NOT NULL,
    `area_office_id` CHAR(36) NULL,
    `school_network_id` CHAR(36) NULL,
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NULL,
    `province` VARCHAR(255) NULL,
    `district` VARCHAR(255) NULL,
    `subdistrict` VARCHAR(255) NULL,
    `school_size` VARCHAR(100) NULL,
    `school_type` VARCHAR(100) NULL,
    `settings` JSON NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `schools_code_key`(`code`),
    INDEX `schools_area_office_id_school_network_id_idx`(`area_office_id`, `school_network_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academic_years` (
    `id` CHAR(36) NOT NULL,
    `school_id` CHAR(36) NOT NULL,
    `year_label` VARCHAR(20) NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `is_current` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `academic_years_school_id_is_current_idx`(`school_id`, `is_current`),
    UNIQUE INDEX `academic_years_school_id_year_label_key`(`school_id`, `year_label`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academic_terms` (
    `id` CHAR(36) NOT NULL,
    `academic_year_id` CHAR(36) NOT NULL,
    `term_no` TINYINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `is_current` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `academic_terms_academic_year_id_is_current_idx`(`academic_year_id`, `is_current`),
    UNIQUE INDEX `academic_terms_academic_year_id_term_no_key`(`academic_year_id`, `term_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` CHAR(36) NOT NULL,
    `school_id` CHAR(36) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `head_user_id` CHAR(36) NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `departments_school_id_code_key`(`school_id`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classrooms` (
    `id` CHAR(36) NOT NULL,
    `school_id` CHAR(36) NOT NULL,
    `academic_year_id` CHAR(36) NOT NULL,
    `level` VARCHAR(50) NOT NULL,
    `room_no` VARCHAR(50) NULL,
    `name` VARCHAR(255) NOT NULL,
    `homeroom_teacher_user_id` CHAR(36) NULL,
    `student_count` INTEGER NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `classrooms_school_id_academic_year_id_idx`(`school_id`, `academic_year_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_school_memberships` (
    `id` CHAR(36) NOT NULL,
    `person_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NULL,
    `school_id` CHAR(36) NOT NULL,
    `academic_year_id` CHAR(36) NULL,
    `department_id` CHAR(36) NULL,
    `classroom_id` CHAR(36) NULL,
    `role_id` CHAR(36) NOT NULL,
    `position_title` VARCHAR(255) NULL,
    `membership_type` VARCHAR(100) NOT NULL DEFAULT 'staff',
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_school_memberships_person_id_school_id_academic_year_id_idx`(`person_id`, `school_id`, `academic_year_id`),
    INDEX `user_school_memberships_school_id_role_id_status_idx`(`school_id`, `role_id`, `status`),
    INDEX `user_school_memberships_department_id_idx`(`department_id`),
    INDEX `user_school_memberships_classroom_id_idx`(`classroom_id`),
    UNIQUE INDEX `user_school_memberships_person_id_school_id_academic_year_id_key`(`person_id`, `school_id`, `academic_year_id`, `department_id`, `classroom_id`, `role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_area_assignments` (
    `id` CHAR(36) NOT NULL,
    `person_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NULL,
    `area_office_id` CHAR(36) NOT NULL,
    `role_code` VARCHAR(100) NOT NULL,
    `position_title` VARCHAR(255) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_area_assignments_person_id_area_office_id_idx`(`person_id`, `area_office_id`),
    INDEX `user_area_assignments_area_office_id_role_code_status_idx`(`area_office_id`, `role_code`, `status`),
    UNIQUE INDEX `user_area_assignments_person_id_area_office_id_role_code_key`(`person_id`, `area_office_id`, `role_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agents` (
    `id` CHAR(36) NOT NULL,
    `school_id` CHAR(36) NULL,
    `area_office_id` CHAR(36) NULL,
    `department_id` CHAR(36) NULL,
    `scope_level` VARCHAR(50) NOT NULL DEFAULT 'school',
    `agent_type` VARCHAR(100) NOT NULL,
    `grade_level` VARCHAR(50) NULL,
    `name` VARCHAR(255) NOT NULL,
    `system_prompt` MEDIUMTEXT NOT NULL,
    `model_provider` VARCHAR(100) NOT NULL DEFAULT 'anthropic',
    `model_name` VARCHAR(255) NOT NULL,
    `temperature` DECIMAL(3, 2) NOT NULL DEFAULT 0.30,
    `max_tokens` INTEGER NULL,
    `monthly_token_budget` BIGINT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `agents_school_id_agent_type_status_idx`(`school_id`, `agent_type`, `status`),
    INDEX `agents_school_id_scope_level_idx`(`school_id`, `scope_level`),
    INDEX `agents_area_office_id_scope_level_idx`(`area_office_id`, `scope_level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agent_scope_assignments` (
    `id` CHAR(36) NOT NULL,
    `agent_id` CHAR(36) NOT NULL,
    `scope_level` VARCHAR(50) NOT NULL,
    `area_office_id` CHAR(36) NULL,
    `school_network_id` CHAR(36) NULL,
    `school_id` CHAR(36) NULL,
    `academic_year_id` CHAR(36) NULL,
    `academic_term_id` CHAR(36) NULL,
    `department_id` CHAR(36) NULL,
    `classroom_id` CHAR(36) NULL,
    `role_description` TEXT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `agent_scope_assignments_agent_id_idx`(`agent_id`),
    INDEX `agent_scope_assignments_school_id_department_id_classroom_id_idx`(`school_id`, `department_id`, `classroom_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_conversations` (
    `id` CHAR(36) NOT NULL,
    `agent_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `school_id` CHAR(36) NULL,
    `title` VARCHAR(255) NULL,
    `task_id` CHAR(36) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `ai_conversations_user_id_agent_id_updated_at_idx`(`user_id`, `agent_id`, `updated_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_messages` (
    `id` CHAR(36) NOT NULL,
    `conversation_id` CHAR(36) NOT NULL,
    `role` VARCHAR(20) NOT NULL,
    `content` MEDIUMTEXT NOT NULL,
    `attachments` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ai_messages_conversation_id_created_at_idx`(`conversation_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_run_logs` (
    `id` CHAR(36) NOT NULL,
    `conversation_id` CHAR(36) NULL,
    `agent_id` CHAR(36) NOT NULL,
    `school_id` CHAR(36) NULL,
    `model_provider` VARCHAR(100) NOT NULL,
    `model_name` VARCHAR(255) NOT NULL,
    `prompt_tokens` INTEGER NULL,
    `completion_tokens` INTEGER NULL,
    `total_tokens` INTEGER NULL,
    `prompt_cache_read_tokens` INTEGER NULL,
    `prompt_cache_creation_tokens` INTEGER NULL,
    `cost_usd` DECIMAL(10, 4) NULL,
    `latency_ms` INTEGER NULL,
    `status` VARCHAR(50) NOT NULL,
    `error_message` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ai_run_logs_school_id_created_at_idx`(`school_id`, `created_at`),
    INDEX `ai_run_logs_agent_id_created_at_idx`(`agent_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher_daily_reflections` (
    `id` CHAR(36) NOT NULL,
    `school_id` CHAR(36) NOT NULL,
    `area_office_id` CHAR(36) NULL,
    `school_network_id` CHAR(36) NULL,
    `academic_year_id` CHAR(36) NOT NULL,
    `academic_term_id` CHAR(36) NULL,
    `department_id` CHAR(36) NULL,
    `classroom_id` CHAR(36) NULL,
    `lesson_plan_id` CHAR(36) NULL,
    `task_id` CHAR(36) NULL,
    `teacher_user_id` CHAR(36) NOT NULL,
    `teacher_person_id` CHAR(36) NULL,
    `reflection_date` DATE NOT NULL,
    `period_no` TINYINT NULL,
    `subject` VARCHAR(255) NULL,
    `topic` VARCHAR(500) NULL,
    `what_happened` TEXT NULL,
    `what_students_did` TEXT NULL,
    `successes` TEXT NULL,
    `problems` TEXT NULL,
    `next_improvement` TEXT NULL,
    `summary_short` TEXT NULL,
    `ai_summary` MEDIUMTEXT NULL,
    `ai_tags` JSON NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'draft',
    `is_sar_candidate` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `teacher_daily_reflections_teacher_user_id_reflection_date_idx`(`teacher_user_id`, `reflection_date`),
    INDEX `teacher_daily_reflections_teacher_user_id_status_idx`(`teacher_user_id`, `status`),
    INDEX `teacher_daily_reflections_school_id_academic_year_id_reflect_idx`(`school_id`, `academic_year_id`, `reflection_date`),
    INDEX `teacher_daily_reflections_school_id_status_idx`(`school_id`, `status`),
    INDEX `teacher_daily_reflections_classroom_id_reflection_date_idx`(`classroom_id`, `reflection_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reflection_attachments` (
    `id` CHAR(36) NOT NULL,
    `reflection_id` CHAR(36) NOT NULL,
    `evidence_file_id` CHAR(36) NOT NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `reflection_attachments_reflection_id_idx`(`reflection_id`),
    UNIQUE INDEX `reflection_attachments_reflection_id_evidence_file_id_key`(`reflection_id`, `evidence_file_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reflection_ai_summaries` (
    `id` CHAR(36) NOT NULL,
    `reflection_id` CHAR(36) NOT NULL,
    `agent_id` CHAR(36) NOT NULL,
    `summary_text` MEDIUMTEXT NOT NULL,
    `tags` JSON NULL,
    `confidence` DECIMAL(3, 2) NULL,
    `model_name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `reflection_ai_summaries_reflection_id_created_at_idx`(`reflection_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reflection_sar_mappings` (
    `id` CHAR(36) NOT NULL,
    `reflection_id` CHAR(36) NOT NULL,
    `sar_standard_code` VARCHAR(100) NOT NULL,
    `sar_topic` VARCHAR(500) NULL,
    `evidence_strength` VARCHAR(50) NOT NULL DEFAULT 'medium',
    `mapped_by_agent_id` CHAR(36) NULL,
    `mapped_by_user_id` CHAR(36) NULL,
    `approved` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `reflection_sar_mappings_reflection_id_idx`(`reflection_id`),
    INDEX `reflection_sar_mappings_sar_standard_code_idx`(`sar_standard_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evidence_files` (
    `id` CHAR(36) NOT NULL,
    `school_id` CHAR(36) NOT NULL,
    `area_office_id` CHAR(36) NULL,
    `academic_year_id` CHAR(36) NULL,
    `academic_term_id` CHAR(36) NULL,
    `department_id` CHAR(36) NULL,
    `classroom_id` CHAR(36) NULL,
    `task_id` CHAR(36) NULL,
    `file_type` VARCHAR(50) NOT NULL,
    `file_url` VARCHAR(1000) NOT NULL,
    `file_size_bytes` BIGINT NULL,
    `mime_type` VARCHAR(100) NULL,
    `title` VARCHAR(500) NULL,
    `description` TEXT NULL,
    `uploaded_by_user_id` CHAR(36) NOT NULL,
    `tags` JSON NULL,
    `sar_status` VARCHAR(50) NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `evidence_files_school_id_academic_year_id_idx`(`school_id`, `academic_year_id`),
    INDEX `evidence_files_uploaded_by_user_id_idx`(`uploaded_by_user_id`),
    INDEX `evidence_files_sar_status_idx`(`sar_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `persons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_networks` ADD CONSTRAINT `school_networks_area_office_id_fkey` FOREIGN KEY (`area_office_id`) REFERENCES `education_area_offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_area_office_id_fkey` FOREIGN KEY (`area_office_id`) REFERENCES `education_area_offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_school_network_id_fkey` FOREIGN KEY (`school_network_id`) REFERENCES `school_networks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academic_years` ADD CONSTRAINT `academic_years_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academic_terms` ADD CONSTRAINT `academic_terms_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classrooms` ADD CONSTRAINT `classrooms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classrooms` ADD CONSTRAINT `classrooms_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_school_memberships` ADD CONSTRAINT `user_school_memberships_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `persons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_school_memberships` ADD CONSTRAINT `user_school_memberships_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_school_memberships` ADD CONSTRAINT `user_school_memberships_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_school_memberships` ADD CONSTRAINT `user_school_memberships_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_school_memberships` ADD CONSTRAINT `user_school_memberships_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_school_memberships` ADD CONSTRAINT `user_school_memberships_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_school_memberships` ADD CONSTRAINT `user_school_memberships_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_area_assignments` ADD CONSTRAINT `user_area_assignments_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `persons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_area_assignments` ADD CONSTRAINT `user_area_assignments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_area_assignments` ADD CONSTRAINT `user_area_assignments_area_office_id_fkey` FOREIGN KEY (`area_office_id`) REFERENCES `education_area_offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agents` ADD CONSTRAINT `agents_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agents` ADD CONSTRAINT `agents_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agent_scope_assignments` ADD CONSTRAINT `agent_scope_assignments_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_conversations` ADD CONSTRAINT `ai_conversations_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_conversations` ADD CONSTRAINT `ai_conversations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_conversations` ADD CONSTRAINT `ai_conversations_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_messages` ADD CONSTRAINT `ai_messages_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `ai_conversations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_run_logs` ADD CONSTRAINT `ai_run_logs_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `ai_conversations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_run_logs` ADD CONSTRAINT `ai_run_logs_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_run_logs` ADD CONSTRAINT `ai_run_logs_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_daily_reflections` ADD CONSTRAINT `teacher_daily_reflections_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_daily_reflections` ADD CONSTRAINT `teacher_daily_reflections_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_daily_reflections` ADD CONSTRAINT `teacher_daily_reflections_academic_term_id_fkey` FOREIGN KEY (`academic_term_id`) REFERENCES `academic_terms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_daily_reflections` ADD CONSTRAINT `teacher_daily_reflections_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_daily_reflections` ADD CONSTRAINT `teacher_daily_reflections_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_daily_reflections` ADD CONSTRAINT `teacher_daily_reflections_teacher_user_id_fkey` FOREIGN KEY (`teacher_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_daily_reflections` ADD CONSTRAINT `teacher_daily_reflections_teacher_person_id_fkey` FOREIGN KEY (`teacher_person_id`) REFERENCES `persons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reflection_attachments` ADD CONSTRAINT `reflection_attachments_reflection_id_fkey` FOREIGN KEY (`reflection_id`) REFERENCES `teacher_daily_reflections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reflection_attachments` ADD CONSTRAINT `reflection_attachments_evidence_file_id_fkey` FOREIGN KEY (`evidence_file_id`) REFERENCES `evidence_files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reflection_ai_summaries` ADD CONSTRAINT `reflection_ai_summaries_reflection_id_fkey` FOREIGN KEY (`reflection_id`) REFERENCES `teacher_daily_reflections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reflection_ai_summaries` ADD CONSTRAINT `reflection_ai_summaries_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reflection_sar_mappings` ADD CONSTRAINT `reflection_sar_mappings_reflection_id_fkey` FOREIGN KEY (`reflection_id`) REFERENCES `teacher_daily_reflections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reflection_sar_mappings` ADD CONSTRAINT `reflection_sar_mappings_mapped_by_agent_id_fkey` FOREIGN KEY (`mapped_by_agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reflection_sar_mappings` ADD CONSTRAINT `reflection_sar_mappings_mapped_by_user_id_fkey` FOREIGN KEY (`mapped_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidence_files` ADD CONSTRAINT `evidence_files_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidence_files` ADD CONSTRAINT `evidence_files_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidence_files` ADD CONSTRAINT `evidence_files_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evidence_files` ADD CONSTRAINT `evidence_files_uploaded_by_user_id_fkey` FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
