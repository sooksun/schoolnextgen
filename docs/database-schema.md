# Database Schema

**Target DB:** MariaDB 11.x · `utf8mb4_unicode_ci` · InnoDB
**ที่มา:** สังเคราะห์จาก `Thinking_make_prd.md` V2 (multi-tenant) + V3 (Reflection) + V4 (Duty Log + Observation)
**Status:** ออกแบบบน paper — ยังไม่ได้สร้างจริง. ตอนทำจริงให้แปลงเป็น Prisma schema แล้วใช้ `prisma migrate` ไม่ใช่ SQL ตรง ๆ

---

## 1. หลักการออกแบบ

1. **Multi-tenant ระดับลึก** — ทุก operational table มี `area_office_id` / `school_id` / `academic_year_id` ตามขอบเขตของข้อมูล
2. **Identity separation** — `persons` (คน) แยกจาก `users` (บัญชี) แยกจาก membership (สิทธิ์ใน scope)
3. **Scope-aware agents** — agent ทำงานได้หลาย scope ผ่าน `agent_scope_assignments`
4. **Status enums เป็น VARCHAR** ไม่ใช่ MySQL ENUM (รองรับการเพิ่มสถานะ)
5. **JSON columns** สำหรับ settings/profile/layout (MariaDB 11 รองรับ)
6. **Soft delete** ผ่าน `deleted_at` เมื่อจำเป็น

---

## 2. ตารางหลัก — Tenant Layer

### education_area_offices
```sql
CREATE TABLE education_area_offices (
  id CHAR(36) PRIMARY KEY,
  code VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  office_type VARCHAR(100) NULL,          -- primary/secondary/special
  province VARCHAR(255) NULL,
  region VARCHAR(255) NULL,
  address TEXT NULL,
  phone VARCHAR(50) NULL,
  email VARCHAR(255) NULL,
  settings JSON NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_education_area_code (code)
);
```

### school_networks
```sql
CREATE TABLE school_networks (
  id CHAR(36) PRIMARY KEY,
  area_office_id CHAR(36) NOT NULL,
  code VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_school_networks_area FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
  UNIQUE KEY uq_school_network_area_code (area_office_id, code)
);
```

### schools
```sql
CREATE TABLE schools (
  id CHAR(36) PRIMARY KEY,
  area_office_id CHAR(36) NULL,
  school_network_id CHAR(36) NULL,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  address TEXT NULL,
  province VARCHAR(255) NULL,
  district VARCHAR(255) NULL,
  subdistrict VARCHAR(255) NULL,
  school_size VARCHAR(100) NULL,           -- small/medium/large/extra_large
  school_type VARCHAR(100) NULL,           -- regular/expansion/highland/border
  settings JSON NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_schools_area_network (area_office_id, school_network_id)
);
```

### academic_years / academic_terms
```sql
CREATE TABLE academic_years (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NOT NULL,
  year_label VARCHAR(20) NOT NULL,         -- "2569"
  start_date DATE NULL,
  end_date DATE NULL,
  is_current TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_academic_years_school_label (school_id, year_label)
);

CREATE TABLE academic_terms (
  id CHAR(36) PRIMARY KEY,
  academic_year_id CHAR(36) NOT NULL,
  term_no TINYINT NOT NULL,                -- 1, 2, 3
  name VARCHAR(100) NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  is_current TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_academic_terms_year_term (academic_year_id, term_no)
);
```

### departments (4 ฝ่าย)
```sql
CREATE TABLE departments (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NOT NULL,
  code VARCHAR(50) NOT NULL,               -- academic/budget/hr/general_affairs
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  head_user_id CHAR(36) NULL,
  display_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_departments_school_code (school_id, code)
);
```

### classrooms
```sql
CREATE TABLE classrooms (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NOT NULL,
  academic_year_id CHAR(36) NOT NULL,
  level VARCHAR(50) NOT NULL,              -- K2, K3, G1..G6, M1..M3
  room_no VARCHAR(50) NULL,
  name VARCHAR(255) NOT NULL,
  homeroom_teacher_user_id CHAR(36) NULL,
  student_count INT NULL,
  KEY idx_classrooms_school_year (school_id, academic_year_id)
);
```

---

## 3. Identity Layer

### persons
```sql
CREATE TABLE persons (
  id CHAR(36) PRIMARY KEY,
  national_id_hash VARCHAR(255) NULL,      -- hash, ห้าม plain
  display_name VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NULL,
  last_name VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  profile JSON NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_persons_email (email)
);
```

### users
```sql
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  person_id CHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_person FOREIGN KEY (person_id) REFERENCES persons(id)
);
```

### roles
```sql
CREATE TABLE roles (
  id CHAR(36) PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,       -- director, deputy_academic, teacher, area_admin, ...
  name VARCHAR(255) NOT NULL,
  scope_level VARCHAR(50) NOT NULL,        -- system/area/school/department/classroom
  description TEXT NULL
);
```

### user_school_memberships
```sql
CREATE TABLE user_school_memberships (
  id CHAR(36) PRIMARY KEY,
  person_id CHAR(36) NOT NULL,
  user_id CHAR(36) NULL,
  school_id CHAR(36) NOT NULL,
  academic_year_id CHAR(36) NULL,
  department_id CHAR(36) NULL,
  classroom_id CHAR(36) NULL,
  role_id CHAR(36) NOT NULL,
  position_title VARCHAR(255) NULL,
  membership_type VARCHAR(100) NOT NULL DEFAULT 'staff',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  start_date DATE NULL,
  end_date DATE NULL,
  UNIQUE KEY uq_membership_scope (person_id, school_id, academic_year_id, department_id, classroom_id, role_id),
  KEY idx_memberships_person_school_year (person_id, school_id, academic_year_id),
  KEY idx_memberships_school_role (school_id, role_id, status)
);
```

### user_area_assignments
```sql
CREATE TABLE user_area_assignments (
  id CHAR(36) PRIMARY KEY,
  person_id CHAR(36) NOT NULL,
  user_id CHAR(36) NULL,
  area_office_id CHAR(36) NOT NULL,
  role_code VARCHAR(100) NOT NULL,
  position_title VARCHAR(255) NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  start_date DATE NULL,
  end_date DATE NULL,
  UNIQUE KEY uq_area_assignment_scope (person_id, area_office_id, role_code)
);
```

---

## 4. Agent Layer

### agents
```sql
CREATE TABLE agents (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NULL,                 -- nullable เพื่อรองรับ area-level agent
  area_office_id CHAR(36) NULL,
  scope_level VARCHAR(50) NOT NULL DEFAULT 'school',
  agent_type VARCHAR(100) NOT NULL,        -- director_assistant/academic_lead/deputy_*/classroom_assistant/qa_sar/plc
  grade_level VARCHAR(50) NULL,            -- K2/K3/G1.../M3 (สำหรับ classroom_assistant)
  department_id CHAR(36) NULL,
  name VARCHAR(255) NOT NULL,
  system_prompt MEDIUMTEXT NOT NULL,
  model_provider VARCHAR(100) NOT NULL,    -- ollama/anthropic/openai/typhoon
  model_name VARCHAR(255) NOT NULL,
  temperature DECIMAL(3,2) NOT NULL DEFAULT 0.30,
  max_tokens INT NULL,
  monthly_token_budget BIGINT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_agents_school_scope (school_id, scope_level),
  KEY idx_agents_area_scope (area_office_id, scope_level)
);
```

### agent_scope_assignments
```sql
CREATE TABLE agent_scope_assignments (
  id CHAR(36) PRIMARY KEY,
  agent_id CHAR(36) NOT NULL,
  scope_level VARCHAR(50) NOT NULL,        -- system/area/network/school/academic_year/term/department/classroom/task
  area_office_id CHAR(36) NULL,
  school_network_id CHAR(36) NULL,
  school_id CHAR(36) NULL,
  academic_year_id CHAR(36) NULL,
  academic_term_id CHAR(36) NULL,
  department_id CHAR(36) NULL,
  classroom_id CHAR(36) NULL,
  role_description TEXT NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  KEY idx_agent_scope_school_dept (school_id, department_id, classroom_id)
);
```

### ai_conversations / ai_messages / ai_run_logs
```sql
CREATE TABLE ai_conversations (
  id CHAR(36) PRIMARY KEY,
  agent_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  school_id CHAR(36) NULL,
  title VARCHAR(255) NULL,
  task_id CHAR(36) NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_conv_user_agent (user_id, agent_id)
);

CREATE TABLE ai_messages (
  id CHAR(36) PRIMARY KEY,
  conversation_id CHAR(36) NOT NULL,
  role VARCHAR(20) NOT NULL,               -- system/user/assistant/tool
  content MEDIUMTEXT NOT NULL,
  attachments JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_msg_conv_created (conversation_id, created_at)
);

CREATE TABLE ai_run_logs (
  id CHAR(36) PRIMARY KEY,
  conversation_id CHAR(36) NOT NULL,
  agent_id CHAR(36) NOT NULL,
  school_id CHAR(36) NULL,
  model_provider VARCHAR(100) NOT NULL,
  model_name VARCHAR(255) NOT NULL,
  prompt_tokens INT NULL,
  completion_tokens INT NULL,
  total_tokens INT NULL,
  cost_usd DECIMAL(10,4) NULL,
  latency_ms INT NULL,
  status VARCHAR(50) NOT NULL,
  error_message TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_runlog_school_created (school_id, created_at)
);
```

---

## 5. Task / Workflow Layer

### tasks
```sql
CREATE TABLE tasks (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NOT NULL,
  area_office_id CHAR(36) NULL,
  school_network_id CHAR(36) NULL,
  academic_year_id CHAR(36) NOT NULL,
  academic_term_id CHAR(36) NULL,
  department_id CHAR(36) NULL,
  classroom_id CHAR(36) NULL,
  task_type VARCHAR(100) NOT NULL,         -- lesson_plan/worksheet/plc/sar_evidence/reflection/...
  scope_level VARCHAR(50) NOT NULL DEFAULT 'school',
  title VARCHAR(500) NOT NULL,
  description MEDIUMTEXT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
                                           -- draft/assigned/in_progress/submitted/
                                           -- ai_review/human_review/needs_revision/
                                           -- approved/completed/overdue/cancelled
  priority VARCHAR(20) NOT NULL DEFAULT 'normal',
  due_date DATETIME NULL,
  created_by_user_id CHAR(36) NOT NULL,
  created_by_agent_id CHAR(36) NULL,
  parent_task_id CHAR(36) NULL,
  metadata JSON NULL,
  deleted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_tasks_school_year_term (school_id, academic_year_id, academic_term_id),
  KEY idx_tasks_dept_status (department_id, status),
  KEY idx_tasks_due (due_date, status)
);
```

### task_assignees
```sql
CREATE TABLE task_assignees (
  id CHAR(36) PRIMARY KEY,
  task_id CHAR(36) NOT NULL,
  user_id CHAR(36) NULL,
  agent_id CHAR(36) NULL,
  role VARCHAR(50) NOT NULL,               -- responsible/reviewer/approver/observer
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_task_assignee (task_id, user_id, agent_id, role)
);
```

### task_outputs (ผลลัพธ์จาก AI หรือมนุษย์)
```sql
CREATE TABLE task_outputs (
  id CHAR(36) PRIMARY KEY,
  task_id CHAR(36) NOT NULL,
  produced_by_agent_id CHAR(36) NULL,
  produced_by_user_id CHAR(36) NULL,
  content MEDIUMTEXT NOT NULL,
  content_format VARCHAR(50) NOT NULL DEFAULT 'markdown',
  version INT NOT NULL DEFAULT 1,
  review_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  reviewed_by CHAR(36) NULL,
  reviewed_at DATETIME NULL,
  review_note TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### approval_routes
```sql
CREATE TABLE approval_routes (
  id CHAR(36) PRIMARY KEY,
  task_id CHAR(36) NOT NULL,
  step_order INT NOT NULL,
  approver_role_code VARCHAR(100) NOT NULL,
  approver_user_id CHAR(36) NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  decided_at DATETIME NULL,
  decision_note TEXT NULL,
  UNIQUE KEY uq_route_task_step (task_id, step_order)
);
```

### evidence_files
```sql
CREATE TABLE evidence_files (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NOT NULL,
  area_office_id CHAR(36) NULL,
  academic_year_id CHAR(36) NULL,
  academic_term_id CHAR(36) NULL,
  department_id CHAR(36) NULL,
  classroom_id CHAR(36) NULL,
  task_id CHAR(36) NULL,
  file_type VARCHAR(50) NOT NULL,          -- image/video/pdf/document/other
  file_url VARCHAR(1000) NOT NULL,
  file_size_bytes BIGINT NULL,
  mime_type VARCHAR(100) NULL,
  title VARCHAR(500) NULL,
  description TEXT NULL,
  uploaded_by_user_id CHAR(36) NOT NULL,
  tags JSON NULL,
  sar_status VARCHAR(50) NULL,             -- raw/ai_summarized/teacher_confirmed/sar_candidate/sar_selected
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
);
```

---

## 6. Module V3 — Daily Teacher Reflection

```sql
CREATE TABLE teacher_daily_reflections (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NOT NULL,
  area_office_id CHAR(36) NULL,
  school_network_id CHAR(36) NULL,
  academic_year_id CHAR(36) NOT NULL,
  academic_term_id CHAR(36) NULL,
  department_id CHAR(36) NULL,
  classroom_id CHAR(36) NULL,
  lesson_plan_id CHAR(36) NULL,
  task_id CHAR(36) NULL,
  teacher_user_id CHAR(36) NOT NULL,
  teacher_person_id CHAR(36) NULL,
  reflection_date DATE NOT NULL,
  period_no INT NULL,
  subject VARCHAR(255) NULL,
  topic VARCHAR(500) NULL,
  what_happened TEXT NULL,
  what_students_did TEXT NULL,
  successes TEXT NULL,
  problems TEXT NULL,
  next_improvement TEXT NULL,
  summary_short TEXT NULL,
  ai_summary MEDIUMTEXT NULL,
  ai_tags JSON NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
                                           -- draft/ai_summarized/teacher_confirmed/academic_reviewed
  is_sar_candidate TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_refl_teacher_date (teacher_user_id, reflection_date),
  KEY idx_refl_school_year (school_id, academic_year_id)
);

CREATE TABLE reflection_attachments (
  id CHAR(36) PRIMARY KEY,
  reflection_id CHAR(36) NOT NULL,
  evidence_file_id CHAR(36) NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE reflection_ai_summaries (
  id CHAR(36) PRIMARY KEY,
  reflection_id CHAR(36) NOT NULL,
  agent_id CHAR(36) NOT NULL,
  summary_text MEDIUMTEXT NOT NULL,
  tags JSON NULL,
  confidence DECIMAL(3,2) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reflection_sar_mappings (
  id CHAR(36) PRIMARY KEY,
  reflection_id CHAR(36) NOT NULL,
  sar_standard_code VARCHAR(100) NOT NULL,
  sar_topic VARCHAR(500) NULL,
  evidence_strength VARCHAR(50) NOT NULL DEFAULT 'medium',
  mapped_by_agent_id CHAR(36) NULL,
  mapped_by_user_id CHAR(36) NULL,
  approved TINYINT(1) NOT NULL DEFAULT 0
);
```

---

## 7. Module V4-A — Daily Duty Log

```sql
CREATE TABLE daily_duty_schedules (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NOT NULL,
  academic_year_id CHAR(36) NOT NULL,
  academic_term_id CHAR(36) NULL,
  duty_type VARCHAR(100) NOT NULL,
                                           -- front_gate_morning/morning_facility_care/
                                           -- daily_student_affairs/cafeteria_lunch_service/
                                           -- milk_service/safety_environment/other
  scheduled_date DATE NOT NULL,
  start_time TIME NULL,
  end_time TIME NULL,
  location VARCHAR(255) NULL,
  primary_user_id CHAR(36) NOT NULL,
  backup_user_id CHAR(36) NULL,
  notes TEXT NULL,
  KEY idx_duty_sched_user_date (primary_user_id, scheduled_date)
);

CREATE TABLE daily_duty_logs (
  id CHAR(36) PRIMARY KEY,
  schedule_id CHAR(36) NULL,
  school_id CHAR(36) NOT NULL,
  academic_year_id CHAR(36) NOT NULL,
  duty_type VARCHAR(100) NOT NULL,
  duty_date DATE NOT NULL,
  location VARCHAR(255) NULL,
  performed_by_user_id CHAR(36) NOT NULL,
  summary TEXT NULL,
  incidents TEXT NULL,
  actions_taken TEXT NULL,
  suggestions TEXT NULL,
  student_count INT NULL,
  ai_summary MEDIUMTEXT NULL,
  ai_tags JSON NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  is_sar_candidate TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_duty_log_attachments (
  id CHAR(36) PRIMARY KEY,
  log_id CHAR(36) NOT NULL,
  evidence_file_id CHAR(36) NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);
```

---

## 8. Module V4-B — Learning Observation Officer

```sql
CREATE TABLE learning_observation_rotation_rules (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NOT NULL,
  academic_year_id CHAR(36) NOT NULL,
  rotation_mode VARCHAR(50) NOT NULL,
                                           -- by_classroom/by_teacher/by_subject/by_focus_area/manual
  config JSON NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE learning_observation_assignments (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NOT NULL,
  academic_year_id CHAR(36) NOT NULL,
  rule_id CHAR(36) NULL,
  scheduled_date DATE NOT NULL,
  officer_user_id CHAR(36) NOT NULL,
  classroom_id CHAR(36) NULL,
  teacher_user_id CHAR(36) NULL,
  subject VARCHAR(255) NULL,
  focus_area VARCHAR(100) NULL,            -- jit_suksa/hots/active_learning/student_agency/
                                           -- collaboration/communication/creativity/
                                           -- local_context_learning/assessment_for_learning
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE learning_observation_records (
  id CHAR(36) PRIMARY KEY,
  assignment_id CHAR(36) NULL,
  school_id CHAR(36) NOT NULL,
  academic_year_id CHAR(36) NOT NULL,
  observed_at DATETIME NOT NULL,
  officer_user_id CHAR(36) NOT NULL,
  classroom_id CHAR(36) NULL,
  teacher_user_id CHAR(36) NULL,
  subject VARCHAR(255) NULL,
  focus_area VARCHAR(100) NOT NULL,
  observed_summary TEXT NULL,
  strengths TEXT NULL,
  improvement_points TEXT NULL,
  example_questions TEXT NULL,
  related_reflection_id CHAR(36) NULL,
  ai_summary MEDIUMTEXT NULL,
  ai_tags JSON NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  is_sar_candidate TINYINT(1) NOT NULL DEFAULT 0,
  is_plc_candidate TINYINT(1) NOT NULL DEFAULT 0
);

CREATE TABLE learning_observation_media (
  id CHAR(36) PRIMARY KEY,
  record_id CHAR(36) NOT NULL,
  evidence_file_id CHAR(36) NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);
```

---

## 9. Dashboard Layouts

```sql
CREATE TABLE dashboard_layouts (
  id CHAR(36) PRIMARY KEY,
  school_id CHAR(36) NULL,
  area_office_id CHAR(36) NULL,
  role_code VARCHAR(100) NOT NULL,
  dashboard_type VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  layout_json JSON NOT NULL,
  theme_json JSON NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  KEY idx_dashboard_scope (area_office_id, school_id, role_code, dashboard_type)
);
```

---

## 10. Recommended Indexes (รวม)

```sql
KEY idx_schools_area_network (area_office_id, school_network_id);
KEY idx_memberships_person_school_year (person_id, school_id, academic_year_id);
KEY idx_memberships_school_role (school_id, role_id, status);
KEY idx_tasks_area_school_status (area_office_id, school_id, status);
KEY idx_tasks_school_year_term (school_id, academic_year_id, academic_term_id);
KEY idx_tasks_dept_status (department_id, status);
KEY idx_agent_scope_school_dept (school_id, department_id, classroom_id);
KEY idx_evidence_school_year (school_id, academic_year_id);
KEY idx_evidence_task (task_id);
KEY idx_refl_teacher_date (teacher_user_id, reflection_date);
KEY idx_runlog_school_created (school_id, created_at);
```

---

## 11. Migration Order

```
1. Identity              persons / users / roles
2. Tenant                areas / networks / schools / years / terms / departments / classrooms
3. Memberships           user_school_memberships / user_area_assignments
4. Agents                agents / agent_scope_assignments / ai_conversations / ai_messages / ai_run_logs
5. Tasks                 tasks / task_assignees / task_outputs / approval_routes / evidence_files
6. Module V3             teacher_daily_reflections + 3 child tables
7. Module V4-A           daily_duty_schedules / daily_duty_logs / daily_duty_log_attachments
8. Module V4-B           learning_observation_* (4 tables)
9. Lesson Plan / PLC     ภายหลัง
10. Student Insight      ภายหลัง (PDPA)
11. SAR Pipeline         sar_standards / sar_evidence_packages / sar_evidence_items
12. Dashboard layouts
```

---

## 12. ข้อควรระวัง

1. **อย่าใส่ `school_id` ตรง ๆ ใน `users`** — ใช้ membership
2. **status เป็น VARCHAR** ไม่ใช่ ENUM — เพื่อเพิ่มสถานะได้
3. **utf8mb4** ทุกตาราง รองรับ emoji + เครื่องหมายภาษาไทยพิเศษ
4. **CHAR(36)** สำหรับ UUID v4 (ใช้ Prisma `@default(uuid())`)
5. **JSON columns** สำหรับ flexible metadata — แต่ห้ามใช้แทน normalized table ถ้าต้อง query บ่อย
6. **Soft delete** เฉพาะ table ที่จำเป็น (tasks, evidence_files) ไม่จำเป็นต้องทุกตาราง
7. **National ID hash เท่านั้น** — `national_id_hash` เก็บ bcrypt/argon2 hash ไม่เก็บเลขจริง
