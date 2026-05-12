# Module Specifications

รายละเอียดของ module ที่อยู่นอก core. Core (Auth / Tenant / Tasks / Agents) อ่านใน `prd.md` §5 และ `docs/architecture.md`

---

## 1. Lesson Plan Studio

**Purpose:** ลดภาระเอกสารครู ทำแผนสอน/ใบงาน/Rubric ได้ในระบบเดียว + AI Academic Lead ตรวจ

### Features
- สร้างแผนรายคาบ / หน่วยการเรียนรู้ / กิจกรรม Active Learning / กิจกรรมจิตศึกษา
- สร้างใบงาน 3 ระดับ (ง่าย/กลาง/ท้าทาย) + เฉลย + คำแนะนำสำหรับครู
- Rubric builder (criteria × levels)
- ตรวจความสอดคล้องหลักสูตร (AI Academic Lead)
- Export PDF / Word

### Workflow
```
Teacher draft
  → AI Classroom Agent ช่วยร่าง (optional)
  → AI Academic Lead ตรวจ → comment inline
  → Teacher แก้ → submit
  → Deputy Academic approve
  → published
  → ใช้สอนจริง
  → ครูบันทึก Daily Reflection หลังสอน
```

---

## 2. Daily Teacher Reflection (Module V3)

**Purpose:** เก็บหลักฐานคุณภาพการสอนรายวัน เพื่อรวมเป็น SAR ท้ายปี โดยไม่เป็นภาระครู

### Required Fields
- วันที่สอน
- ครูผู้บันทึก
- ชั้นเรียน
- รายวิชา/กิจกรรม
- หัวข้อ/หน่วยการเรียนรู้
- ผลการสะท้อนสั้น ๆ
- สถานะบันทึก

### Optional Fields
คาบเรียน · แผนการสอนที่เกี่ยวข้อง · จำนวนนักเรียน · เป้าหมายการเรียนรู้ · สิ่งที่นักเรียนทำได้ดี · ปัญหาที่พบ · แนวทางปรับปรุง · ความต้องการสนับสนุน · แนบรูป · แนบคลิปสั้น · แนบ PDF · แนบไฟล์อื่น · เชื่อม PLC · เชื่อม SAR

### 6 คำถามหลักของ Reflection
1. วันนี้จัดการเรียนรู้อะไร
2. นักเรียนเรียนรู้หรือแสดงพฤติกรรมอย่างไร
3. สิ่งที่สำเร็จคืออะไร
4. ปัญหาหรืออุปสรรคคืออะไร
5. ครูจะปรับปรุงอย่างไรในครั้งต่อไป
6. มีหลักฐานประกอบหรือไม่ (optional)

### Attachment Policy
| Type | Examples | Max Size |
|---|---|---|
| Image | jpg, png, webp | 10 MB |
| Video Clip | mp4, mov, webm | 100 MB |
| PDF | pdf | 25 MB |
| Document | docx, xlsx, pptx | 25 MB |

วิดีโอควรเป็นคลิปสั้น (บรรยากาศกิจกรรม / ชิ้นงาน / การนำเสนอ / การทดลอง / จิตศึกษา / Active Learning)

**ระบบต้องเตือนก่อนอัปโหลด:** "โปรดหลีกเลี่ยงการเผยแพร่ข้อมูลส่วนบุคคลของนักเรียนโดยไม่จำเป็น"

### AI Assistance
**ทำได้:** ปรับภาษาให้เป็นทางการ · สรุปสั้น · แนะนำแนวทางปรับการสอน · สร้างประเด็น PLC · แนะนำหลักฐาน · จัดหมวด SAR · สร้าง tag (อ่านออกเขียนได้, Active Learning, จิตศึกษา, ทักษะชีวิต)

**ห้าม:** สร้างเหตุการณ์ที่ไม่ได้เกิด · ตีตรานักเรียน · สรุปข้อมูลอ่อนไหวแบบเปิดเผย · ใช้ภาพ/คลิปนักเรียนเผยแพร่โดยไม่มีคนอนุมัติ · ตัดสินคุณภาพครูแทนผู้บริหาร

### SAR Pipeline
```
Daily Teacher Reflection
  → AI Summary
  → SAR Tagging
  → Evidence Mapping
  → Monthly Academic Summary
  → Semester QA Review
  → Annual SAR Evidence Package
```

### Status Flow
`raw_reflection → ai_summarized → teacher_confirmed → academic_reviewed → sar_candidate → sar_selected → sar_exported`

### UI Pages
- `/teacher/reflections` — รายการของฉัน + timeline
- `/teacher/reflections/new` — quick form (target: 3–5 นาที)
- `/teacher/reflections/:id` — detail + AI summary panel + SAR mapping
- `/departments/academic/reflections` — มุมมองวิชาการ
- `/school/sar-evidence` — overall readiness
- `/school/sar-evidence/reflections` — รวม reflection ที่เป็น sar_candidate

### Components
`DailyReflectionCard` · `ReflectionQuickForm` · `ReflectionAttachmentUploader` · `ReflectionAISummaryPanel` · `ReflectionTimeline` · `ReflectionSARMappingPanel` · `SAREvidenceReadinessCard` · `ReflectionInsightCloud` · `ReflectionToPLCButton` · `ReflectionExportPanel`

---

## 3. Daily Duty Log (Module V4-A)

**Purpose:** บันทึกเวรประจำวันของครู เป็นหลักฐานฝ่ายบริหารทั่วไป + วPA + SAR

### Duty Types (7)
- `front_gate_morning` — เวรหน้าโรงเรียนตอนเช้า
- `morning_facility_care` — เวรช่วยดูแลสถานที่/ความสะอาดตอนเช้า
- `daily_student_affairs` — เวรประจำวันดูแลนักเรียนทั่วไป
- `cafeteria_lunch_service` — เวรโรงอาหาร/ตักอาหาร/ดูแลอาหารกลางวัน
- `milk_service` — เวรอาหารเสริมนม
- `safety_environment` — เวรความปลอดภัยและสิ่งแวดล้อม
- `other` — เวรอื่น ๆ

### Required Fields
วันที่ปฏิบัติหน้าที่ · ประเภทเวร · ช่วงเวลา · สถานที่ · ผู้ปฏิบัติหน้าที่ · สรุปการปฏิบัติงาน · สถานะการส่ง

### Optional Fields
รูปภาพ · คลิปสั้น · PDF · เหตุการณ์สำคัญ · ปัญหาที่พบ · การแก้ไขเบื้องต้น · ผู้เกี่ยวข้อง · ข้อเสนอแนะ · จำนวนผู้เรียน · รายการอาหาร · ความสะอาด/ปลอดภัย · หมายเหตุสำหรับผู้บริหาร

### Flow
```
ระบบสร้างตารางเวร
  → ครูเวรได้รับแจ้งเตือน
  → ครูปฏิบัติหน้าที่
  → เปิดหน้า Daily Duty Log
  → เลือกประเภทเวร
  → บันทึกข้อความสั้น
  → แนบรูป/คลิป/PDF (optional)
  → AI ช่วยสรุป/จัดหมวด
  → ครูตรวจและยืนยัน
  → ส่งบันทึก
  → หัวหน้าบริหารทั่วไป/บุคคล ตรวจภาพรวม
  → เก็บเข้า Evidence Center + SAR Candidate (ถ้าเหมาะสม)
```

### Dashboard Integration
- **Teacher:** widget "เวรของฉันวันนี้"
- **General Affairs:** Daily Duty Monitoring (ครูเวรวันนี้, เวรหน้าโรงเรียน, โรงอาหาร, สถานที่, บันทึกที่ยังไม่ส่ง, เหตุการณ์ที่ต้องติดตาม)
- **HR:** Workload — จำนวนเวรต่อครู, ความสมดุลภาระเวร, เวรที่ไม่ได้บันทึก, ประวัติ
- **Director:** เวรครบถ้วนรายวัน, เหตุการณ์สำคัญ, ความปลอดภัย, โภชนาการ

---

## 4. Learning Observation Officer (Module V4-B)

**Purpose:** เจ้าหน้าที่ติดตามการจัดการเรียนรู้ที่ได้รับแต่งตั้งพิเศษ บันทึกหลักฐานคุณภาพการสอนแบบหมุนเวียน

### Focus Areas
- `jit_suksa` — จิตศึกษา / พัฒนาปัญญาภายใน
- `hots` — ทักษะการคิดวิเคราะห์ขั้นสูง
- `active_learning` — Active Learning
- `student_agency` — ผู้เรียนมีส่วนร่วม/เป็นเจ้าของการเรียนรู้
- `collaboration` — การทำงานร่วมกัน
- `communication` — การสื่อสาร
- `creativity` — ความคิดสร้างสรรค์
- `local_context_learning` — เชื่อมโยงบริบทท้องถิ่น
- `assessment_for_learning` — การประเมินเพื่อพัฒนา

### Rotation Modes
- `by_classroom` — หมุนตามชั้นเรียน
- `by_teacher` — หมุนตามครู
- `by_subject` — หมุนตามรายวิชา
- `by_focus_area` — หมุนตามประเด็น
- `manual` — ผู้บริหารกำหนดเอง

### Flow
```
ระบบสร้างแผนหมุนเวียนรายวัน
  → แจ้งเจ้าหน้าที่ติดตาม
  → เจ้าหน้าที่เข้าห้องเรียน/กิจกรรม
  → บันทึกภาพ/คลิป/บันทึกสั้น
  → เลือก Focus Area
  → AI ช่วยสรุปพฤติกรรมการเรียนรู้
  → AI เสนอ tag
  → เจ้าหน้าที่ตรวจและยืนยัน
  → ครูผู้สอนดู + เพิ่ม Reflection ได้
  → ฝ่ายวิชาการนำไปใช้ใน PLC / นิเทศ / SAR
```

### UI Pages
- `/learning-observations` — รายการที่ฉันบันทึก
- `/learning-observations/schedule` — schedule + rotation rules
- `/learning-observations/new` — capture page (mobile-first)
- `/departments/academic/learning-observations` — มุมมองวิชาการ
- `/school/sar-evidence/learning-observations` — รวมเป็น SAR candidate

---

## 5. PLC Studio

**Purpose:** เปลี่ยน PLC จากเอกสารหลังบ้านเป็นวงจรพัฒนาคุณภาพจริง

### Workflow
```
1. ครูกรอกปัญหาการเรียนรู้รายชั้น (ผ่าน Reflection หรือ direct)
2. AI ประจำชั้นสรุปประเด็น
3. AI หัวหน้าวิชาการรวมประเด็นทุกชั้น
4. ระบบเสนอวาระ PLC
5. ประชุม → ครูกรอกบันทึกสั้น ๆ
6. AI สรุปรายงาน PLC
7. ระบบเชื่อมกลับไปยังแผนสอน/แผนซ่อมเสริม
```

### ตัวอย่าง Auto-Aggregation
ครูหลายชั้นบันทึกว่าเด็กอ่านจับใจความไม่ได้:
```
ป.3 มีปัญหาอ่านคำถามไม่เข้าใจ
ป.4 อ่านได้แต่สรุปไม่ได้
ป.5 เขียนตอบไม่เป็นประโยค
ป.6 วิเคราะห์เหตุผลไม่ได้
```
→ AI หัวหน้าวิชาการเสนอวาระ PLC: **"การพัฒนาการอ่านจับใจความแบบไต่ระดับ ป.3–ป.6"** + แผน PLC 4 สัปดาห์

---

## 6. Knowledge Base (RAG)

**Purpose:** ให้ AI ตอบจากบริบทโรงเรียน ไม่ใช่ความรู้ทั่วไปลอย ๆ

### เอกสารที่ควรอัปโหลด
- หลักสูตรสถานศึกษา
- โครงสร้างเวลาเรียน
- แผนพัฒนาคุณภาพการศึกษา
- SAR ปีที่ผ่านมา
- ผล NT / RT / O-NET (ถ้ามี — anonymized)
- แผน PLC
- คู่มือจิตศึกษา
- แนวทาง Active Learning ของโรงเรียน
- โครงการ/กิจกรรมประจำปี
- Rubric ที่ใช้ในโรงเรียน

### Pipeline
```
Upload (PDF/Word/รูป)
  → Extract text (pdf-parse / Tika / OCR)
  → Chunk (~500-800 tokens, overlap ~50)
  → Embed (Ollama nomic-embed-text หรือ Cloud)
  → Store ใน vector DB (pgvector / Qdrant)
  → ตอน user คุย agent: retrieve top-k chunks → inject ใน prompt
```

---

## 7. Student Insight (เฟสหลัง — ระวัง PDPA)

**Purpose:** วิเคราะห์เด็กที่ต้องการความช่วยเหลือ + เสนอแผนซ่อมเสริม

### ข้อมูลที่ใช้ได้
ผลอ่านเขียน · ผลแบบฝึก · พฤติกรรมการเข้าเรียน · บันทึกครู · ผลประเมินสมรรถนะ · Portfolio · ความต้องการพิเศษ

### Developmental Grouping (ห้ามตีตรา)
- ต้องช่วยเร่งด่วน
- ต้องเสริม
- ปกติ
- ส่งเสริมพิเศษ

**ห้ามคำว่า:** อ่อน / แย่ / ไม่มีศักยภาพ / ตามไม่ทัน (ในความหมายลบ)

### ข้อห้าม
- AI ห้ามตัดสินเด็กแบบตีตรา
- ห้ามสรุปว่าเด็ก "แย่" หรือ "ไม่มีศักยภาพ"
- ต้องใช้ภาษาส่งเสริมพัฒนาเสมอ
- ห้ามเปิดเผยข้อมูลส่วนบุคคลเกินจำเป็น

---

## 8. SAR Evidence Package (Annual Export)

**Purpose:** แทนการไล่หาเอกสาร SAR ตอนปลายปี ระบบมีหลักฐานจริงตลอดปีอยู่แล้ว

### Pipeline
```
ตลอดปี:
  Daily Reflection + Duty Log + Observation
  → AI Summary + Tagging
  → SAR Mapping (มาตรฐาน / ประเด็น / ฝ่าย / ระดับชั้น)
  → Monthly Academic Summary
  → Term-end QA Review
  → SAR Candidate selection
  → Director approval → SAR Selected
  → Annual SAR Export

ปลายปี Export:
  - SAR Evidence Index (รวมรายการหลักฐาน)
  - Reflection Summary by Standard
  - Reflection Summary by Grade Level
  - Reflection Summary by Department
  - Selected Evidence Attachments (zip)
  - AI Draft Paragraphs for SAR (ต้องมนุษย์ตรวจ)
  - Monthly/Term Reports
```

### Director Dashboard Widget — SAR Evidence Readiness
- Reflection ทั้งปี
- Reflection ที่ AI สรุปแล้ว
- Reflection ที่ผ่านการตรวจวิชาการ
- Reflection ที่เลือกเป็น SAR Candidate
- มาตรฐานใดมีหลักฐานน้อย
- ครู/ชั้นเรียนที่ต้องสนับสนุน

---

## 9. Report Center

ครอบคลุม:
- รายงานรายชั้น
- รายงานรายเดือน
- รายงานผล PLC
- รายงานเด็กกลุ่มเสี่ยง (anonymized)
- รายงานความก้าวหน้าตามเป้าหมาย
- รายงานสำหรับ ผอ.
- รายงานสำหรับเขตพื้นที่
- Export PDF รูปแบบราชการ
