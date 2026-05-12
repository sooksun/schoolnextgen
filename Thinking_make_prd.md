ผมต้องการให้คุณช่วยวางแผนใช้ ai เพื่อสร้างศัพท์เอเจนต์หลายหลายตัวเพื่อช่วยงานเป็นผู้ช่วยครูชั้นอนุบาลสองอนุบาลสามป. 1 ป. 2 ป. 3 ป. 4 ป. 5 ป. 6 จนถึงมัธยมศึกษาปีที่ 123 ให้มี ai ช่วยชั้นละหนึ่งเอเจนต์แล้วก็มีหัวหน้าฝ่ายวิชาการ ของ ai เป็นผู้ช่วยผู้อำนวยการโรงเรียนและท้ายที่สุดก็มี ai ผู้ช่วยผู้อำนวยการโรงเรียนคอยประสานงานกับผู้อำนวยการโรงเรียนเพื่อแจกแจงงานไปยังครูประจำชั้นต่างๆให้คุณช่วยโครงสร้างและออกแบบโปรแกรมเพื่อใช้เป็นเครื่องมือเว็บแอปพลิเคชั่นประสานงานระหว่างผู้ช่วยครูทุกชั้นเรียนรองผู้อำนวยการโรงเรียนและผู้อำนวยการโรงเรียน ให้ทำงานผ่าน ai ทีมเอเจนต์ได้อย่างมีประสิทธิภาพมากที่สุดให้โอกาสคุณคิด 10 รอบโดยแต่ละรอบมีการอัปเกรดเวอร์ชันให้ดีขึ้นเรื่อยเรื่อยดำเนินการได้

ผมจะออกแบบให้เป็น “โรงเรียนจำลองแบบมีทีม AI” ไม่ใช่แค่แชตบอตหลายตัวแยกกัน แล้วไล่อัปเกรด 10 รอบจนได้โครงสร้างเว็บแอปที่นำไปพัฒนาต่อได้จริงครับ

Thought for 14s

ครูใหญ่กำลังคิดถูกทางมากครับ แต่หัวใจสำคัญคือ อย่าสร้าง AI หลายตัวให้กลายเป็น “ห้องพักครูที่คุยกันเสียงดังแต่ไม่มีใครรับผิดชอบ” 😄
ต้องออกแบบให้เป็น ระบบบัญชาการงานวิชาการ + ทีมผู้ช่วยครูรายชั้น + มนุษย์อนุมัติขั้นสุดท้าย

ผมขอเสนอชื่อระบบชั่วคราวว่า

School Agent Command Center

หรือชื่อไทย: ศูนย์บัญชาการผู้ช่วยครู AI

แนวคิดหลักคือ

ผู้อำนวยการโรงเรียนกำหนดเป้าหมาย → AI ผู้ช่วยผู้อำนวยการแปลงเป็นภารกิจ → AI หัวหน้าวิชาการตรวจคุณภาพ → AI ประจำชั้นช่วยครูแต่ละระดับ → ครูจริงตรวจ/ปรับ/ใช้ → ระบบสรุปกลับมาหาผู้บริหาร

1. โครงสร้างทีม AI Agent
ระดับบนสุด: ผู้อำนวยการโรงเรียน

ผู้ใช้หลักคือครูใหญ่ ทำหน้าที่กำหนดทิศทาง เช่น

ต้องการยกระดับการอ่านออกเขียนได้
ต้องการลดภาระเอกสารครู
ต้องการให้ทุกชั้นทำแผน Active Learning
ต้องการสรุปผล PLC รายเดือน
ต้องการติดตามเด็กเสี่ยงรายบุคคล
ต้องการรายงานผลการพัฒนาโรงเรียน

ผู้อำนวยการไม่ต้องสั่งครูทีละคน แต่สั่งผ่านระบบกลาง

Agent 1: AI ผู้ช่วยผู้อำนวยการโรงเรียน

บทบาทคือ Chief School AI Assistant

หน้าที่หลัก:

รับคำสั่งจากผู้อำนวยการ
แปลงคำสั่งกว้าง ๆ ให้เป็นงานย่อย
ส่งต่องานให้ AI หัวหน้าวิชาการ
ประสานงานกับ Agent รายชั้น
ตรวจดูว่างานครบทุกชั้นหรือยัง
สรุปรายงานกลับมาเป็นภาษาผู้บริหาร
เตือนงานที่ค้าง/ล่าช้า
เสนอทางเลือกเชิงนโยบาย

ตัวอย่างคำสั่งจาก ผอ.

“ช่วยให้ทุกชั้นออกแบบกิจกรรมอ่านออกเขียนได้ 4 สัปดาห์”

AI ผู้ช่วย ผอ. จะแตกเป็น

อนุบาล 2–3: กิจกรรมฟัง พูด เล่นเสียง
ป.1–ป.3: อ่านคำพื้นฐาน เขียนประโยค
ป.4–ป.6: อ่านจับใจความ เขียนสื่อสาร
ม.1–ม.3: อ่านวิเคราะห์ เขียนสะท้อนคิด
หัวหน้าวิชาการ: ตรวจความสอดคล้องหลักสูตร/ตัวชี้วัด/สมรรถนะ
Agent 2: AI หัวหน้าฝ่ายวิชาการ

บทบาทคือ Academic Quality Controller

หน้าที่หลัก:

ตรวจแผนการสอนของแต่ละชั้น
เช็กความสอดคล้องกับหลักสูตร
ช่วยทำหน่วยการเรียนรู้
ช่วยทำแผน Active Learning
ช่วยออกแบบการวัดผล
ช่วยทำ Rubric
วิเคราะห์ผลสัมฤทธิ์รายชั้น
เชื่อมโยง PLC กับการพัฒนาการเรียนรู้
ตรวจว่างานของ AI รายชั้น “ไม่หลุดเป้า”

Agent นี้สำคัญมาก เพราะถ้ามีแต่ AI ประจำชั้น ระบบจะกระจายเก่งแต่ขาดมาตรฐานกลาง

2. AI ประจำชั้นเรียน

ควรมีอย่างน้อย 11 ตัว

AI ผู้ช่วยครู อนุบาล 2
AI ผู้ช่วยครู อนุบาล 3
AI ผู้ช่วยครู ป.1
AI ผู้ช่วยครู ป.2
AI ผู้ช่วยครู ป.3
AI ผู้ช่วยครู ป.4
AI ผู้ช่วยครู ป.5
AI ผู้ช่วยครู ป.6
AI ผู้ช่วยครู ม.1
AI ผู้ช่วยครู ม.2
AI ผู้ช่วยครู ม.3

แต่ละตัวไม่ควรใช้ Prompt เดียวกันทั้งหมด ต้องมี บุคลิกตามช่วงวัย

กลุ่มปฐมวัย: อนุบาล 2–3

AI กลุ่มนี้ต้องถนัด

จิตศึกษา
กิจกรรมเคลื่อนไหว
นิทาน
เกม
ศิลปะ
พัฒนากล้ามเนื้อมัดเล็ก/มัดใหญ่
ภาษาแบบธรรมชาติ
การสังเกตพฤติกรรม
พัฒนาการ 4 ด้าน
บันทึกหลังจัดประสบการณ์

ตัวอย่างงาน:

ช่วยออกแบบกิจกรรมวงกลมตอนเช้า
ช่วยแต่งนิทานสั้น
ช่วยออกแบบเกมฝึกฟังเสียง
ช่วยสรุปพฤติกรรมเด็กจากบันทึกครู
ช่วยทำแบบสังเกตพัฒนาการ
กลุ่มต้นประถม: ป.1–ป.3

AI กลุ่มนี้ต้องถนัด

อ่านออกเขียนได้
คณิตพื้นฐาน
ภาษาไทยสำหรับเด็กหลายภาษาแม่
แบบฝึกสั้น ๆ
เกมการเรียนรู้
การบ้านที่ไม่หนักเกินไป
การติดตามเด็กอ่านไม่คล่อง
แผนซ่อมเสริมรายบุคคล

ตัวอย่างงาน:

สร้างแบบฝึกอ่านคำพื้นฐาน
ออกแบบกิจกรรมแจกลูกสะกดคำ
สรุปเด็กที่ต้องซ่อมเสริม
ทำใบงานระดับง่าย/กลาง/ท้าทาย
แนะนำกิจกรรมให้ผู้ปกครองช่วยที่บ้าน
กลุ่มปลายประถม: ป.4–ป.6

AI กลุ่มนี้ต้องถนัด

อ่านจับใจความ
เขียนสื่อสาร
คิดวิเคราะห์
โครงงานเล็ก
STEM/Active Learning
แบบทดสอบตามตัวชี้วัด
Portfolio
การประเมินสมรรถนะ

ตัวอย่างงาน:

สร้างกิจกรรมอ่านข่าวแล้วสรุปใจความ
ออกแบบโจทย์คณิตจากชีวิตจริง
ทำ Rubric งานกลุ่ม
วิเคราะห์ผลสอบรายห้อง
เสนอแนวทางช่วยเด็กอ่อน/เด็กเก่ง
กลุ่มมัธยมต้น: ม.1–ม.3

AI กลุ่มนี้ต้องถนัด

การคิดเชิงระบบ
การอ่านวิเคราะห์
การเขียนอธิบายเหตุผล
โครงงาน
แนะแนวชีวิต/อาชีพเบื้องต้น
ทักษะดิจิทัล
การประเมินตนเอง
การสะท้อนคิด

ตัวอย่างงาน:

ช่วยออกแบบโครงงานท้องถิ่น
ช่วยทำใบกิจกรรมวิเคราะห์ปัญหาชุมชน
ช่วยสร้างแบบประเมินทักษะชีวิต
ช่วยทำแผนซ่อมเสริมรายวิชา
ช่วยสรุปพฤติกรรมการเรียนรู้รายบุคคล
3. คิดอัปเกรด 10 รอบ
รอบที่ 1: จาก Chatbot เป็น Agent รายชั้น

เริ่มจาก AI แต่ละชั้นมีหน้าที่ชัดเจน ไม่ใช่ถามอะไรก็ตอบหมด

ผลลัพธ์:

มี Agent ประจำ อ.2 ถึง ม.3
แต่ละ Agent มี Prompt เฉพาะช่วงวัย
ครูเลือกชั้นตัวเองแล้วคุยกับ AI ได้ทันที

ข้อจำกัด:

ยังเป็นระบบแชต
ยังไม่มีการมอบหมายงานข้ามชั้น
ยังไม่มีระบบติดตามผล
รอบที่ 2: เพิ่ม AI หัวหน้าวิชาการ

เพิ่ม Agent กลางที่ตรวจคุณภาพงานวิชาการ

ผลลัพธ์:

แผนการสอนถูกตรวจโดย AI หัวหน้าวิชาการ
ตรวจความสอดคล้องหลักสูตร
ตรวจระดับความยากง่ายตามช่วงวัย
ตรวจว่ากิจกรรมวัดผลได้จริงไหม

จุดที่ดีขึ้น:

ลดปัญหา AI รายชั้นตอบมั่วคนละทิศ
มีมาตรฐานกลางของโรงเรียน
รอบที่ 3: เพิ่ม AI ผู้ช่วยผู้อำนวยการ

เพิ่ม Agent ระดับบัญชาการ

ผลลัพธ์:

ผอ. สั่งงานครั้งเดียว ระบบกระจายให้แต่ละชั้น
สรุปผลกลับมาเป็นภาพรวม
เห็นงานค้าง งานเสร็จ งานต้องแก้
สร้างรายงานเชิงบริหารได้

ตัวอย่าง:

“เดือนนี้อยากเน้นอ่านออกเขียนได้”

ระบบจะแปลงเป็นแผนรายชั้น พร้อมมอบหมายให้ Agent แต่ละชั้นช่วยครูทำ

รอบที่ 4: เพิ่ม Workflow งานโรงเรียน

จากคุยเฉย ๆ เป็น “งานจริงที่มีสถานะ”

สถานะงานควรมี:

ร่างงาน
รอครูตรวจ
รอหัวหน้าวิชาการตรวจ
ส่งแก้ไข
อนุมัติแล้ว
ใช้งานแล้ว
สรุปผลแล้ว

ผลลัพธ์:

ไม่ใช่แค่แชตแล้วหาย
ทุกงานมีเจ้าของ
ตรวจสอบย้อนหลังได้
ผอ. เห็นภาพรวมทั้งโรงเรียน
รอบที่ 5: เพิ่มฐานความรู้โรงเรียน

ให้ AI ไม่ตอบจากความรู้ทั่วไปอย่างเดียว แต่ตอบจากบริบทโรงเรียน

ฐานข้อมูลที่ควรใส่:

หลักสูตรสถานศึกษา
โครงสร้างเวลาเรียน
แผนพัฒนาคุณภาพการศึกษา
SAR
ผล NT / RT / O-NET ถ้ามี
ข้อมูลพื้นฐานนักเรียนแบบไม่เปิดเผยเกินจำเป็น
แผน PLC
คู่มือจิตศึกษา
แนวทาง Active Learning ของโรงเรียน
โครงการ/กิจกรรมประจำปี

ผลลัพธ์:

AI เข้าใจบริบทโรงเรียนมากขึ้น
ตอบไม่ลอย
แนะนำงานได้ตรงกับโรงเรียนชายขอบ/พื้นที่สูง/เด็กหลายภาษาแม่มากขึ้น
รอบที่ 6: เพิ่มระบบวิเคราะห์นักเรียนรายบุคคล

Agent รายชั้นควรช่วยครูวิเคราะห์นักเรียนได้ แต่ต้องระวังข้อมูลส่วนบุคคล

ข้อมูลที่ใช้ได้:

ผลอ่านเขียน
ผลแบบฝึก
พฤติกรรมการเข้าเรียน
บันทึกครู
ผลประเมินสมรรถนะ
Portfolio
ความต้องการช่วยเหลือพิเศษด้านการเรียน

AI ช่วยได้ เช่น

แยกกลุ่มเด็กเป็น ต้องช่วยเร่งด่วน / ต้องเสริม / ปกติ / ส่งเสริมพิเศษ
แนะนำกิจกรรมซ่อมเสริม
สร้างใบงานตามระดับ
สรุปความก้าวหน้า
แจ้งเตือนครูประจำชั้น

ข้อห้ามสำคัญ:

AI ห้ามตัดสินเด็กแบบตีตรา
ห้ามสรุปว่าเด็ก “แย่” หรือ “ไม่มีศักยภาพ”
ต้องใช้ภาษาส่งเสริมพัฒนาเสมอ
รอบที่ 7: เพิ่ม Human-in-the-loop

ทุกงานสำคัญต้องมีมนุษย์ตรวจ

กติกา:

AI เสนอได้
ครูแก้ได้
หัวหน้าวิชาการอนุมัติได้
ผอ. เห็นภาพรวมและสั่งปรับทิศทางได้
AI ห้ามส่งเอกสารราชการ/รายงานสำคัญโดยไม่มีคนตรวจ

นี่คือจุดที่ทำให้ระบบปลอดภัยและน่าใช้ ไม่ใช่ “AI ยึดโรงเรียน” — อันนั้นน่ากลัวกว่าเด็กไม่ส่งการบ้านอีกครับ

รอบที่ 8: เพิ่ม Dashboard ผู้บริหาร

หน้า Dashboard ของ ผอ. ควรเห็น

งานวิชาการรายชั้น
แผนที่เสร็จแล้ว/ค้าง/รออนุมัติ
เด็กกลุ่มเสี่ยงด้านการเรียนรู้
ความก้าวหน้าอ่านออกเขียนได้
PLC ที่ดำเนินการแล้ว
ครูที่ต้องการความช่วยเหลือ
ข้อเสนอแนะจาก AI
รายงานรายสัปดาห์/รายเดือน

ตัวอย่างการ์ดใน Dashboard:

ป.1 มีเด็กอ่านคำพื้นฐานต่ำกว่าเกณฑ์ 8 คน
ป.3 ส่งแผนซ่อมเสริมครบแล้ว
ม.2 ยังไม่ส่งผลสะท้อนคิดหลังโครงงาน
อนุบาล 3 มีบันทึกพัฒนาการครบ 92%
PLC เดือนนี้เสนอประเด็น “ภาษาไทยสำหรับเด็กสองภาษา”
รอบที่ 9: เพิ่มระบบประชุมและ PLC อัตโนมัติ

AI ช่วยเตรียม PLC ได้มาก

Workflow:

ครูกรอกปัญหาการเรียนรู้รายชั้น
AI ประจำชั้นสรุปประเด็น
AI หัวหน้าวิชาการรวมประเด็นทุกชั้น
ระบบเสนอวาระ PLC
หลังประชุม ครูกรอกบันทึกสั้น ๆ
AI สรุปรายงาน PLC
ระบบเชื่อมกลับไปยังแผนสอน/แผนซ่อมเสริม

ผลลัพธ์:

PLC ไม่ใช่เอกสารหลังบ้าน
กลายเป็นวงจรพัฒนาคุณภาพจริง
เชื่อมจากปัญหา → แผน → ทดลอง → สรุป → ปรับปรุง
รอบที่ 10: กลายเป็นระบบ School AI Operating System

เวอร์ชันสูงสุดควรเป็นระบบปฏิบัติการงานโรงเรียนขนาดย่อม

ประกอบด้วย:

Agent รายชั้น
Agent หัวหน้าวิชาการ
Agent ผู้ช่วย ผอ.
ระบบมอบหมายงาน
ระบบตรวจแผน
ระบบวิเคราะห์นักเรียน
ระบบ PLC
ระบบรายงาน
ระบบเอกสาร
ระบบแจ้งเตือน
ระบบฐานความรู้โรงเรียน
ระบบอนุมัติ
ระบบวัดผลการทำงานของ AI

เป้าหมายสุดท้าย:

AI ไม่ได้มาแทนครู แต่มาช่วยให้ครูมีเวลามองตาเด็กมากขึ้น
งานเอกสารลดลง งานคิดเชิงคุณภาพเพิ่มขึ้น

4. โครงสร้างเว็บแอปพลิเคชัน
เมนูหลักของระบบ
1. Command Center

หน้าสั่งงานกลางของผู้อำนวยการ

ฟีเจอร์:

สั่งงานด้วยภาษาธรรมชาติ
เลือกเป้าหมาย เช่น ทุกชั้น / ปฐมวัย / ประถม / มัธยม / รายชั้น
เลือกประเภทงาน
กำหนดวันส่ง
ให้ AI แตกงานอัตโนมัติ
ติดตามสถานะงาน
2. Agent Room

ห้องรวม AI Agent

ประกอบด้วย:

ผู้ช่วย ผอ.
หัวหน้าวิชาการ AI
อ.2 Agent
อ.3 Agent
ป.1 Agent
ป.2 Agent
ป.3 Agent
ป.4 Agent
ป.5 Agent
ป.6 Agent
ม.1 Agent
ม.2 Agent
ม.3 Agent

ผู้ใช้สามารถเข้าไปคุยกับ Agent แต่ละตัวได้โดยตรง

3. Task Board

บอร์ดติดตามงาน

มุมมองแบบ Kanban:

ร่างโดย AI
รอครูตรวจ
รอหัวหน้าวิชาการ
ต้องแก้ไข
อนุมัติแล้ว
ใช้งานแล้ว
สรุปผลแล้ว
4. Lesson Plan Studio

พื้นที่สร้างแผนการสอน

ฟีเจอร์:

สร้างแผนรายคาบ
สร้างหน่วยการเรียนรู้
สร้างกิจกรรม Active Learning
สร้างกิจกรรมจิตศึกษา
สร้างใบงาน
สร้าง Rubric
ตรวจความสอดคล้องหลักสูตร
Export เป็น PDF/Word
5. Student Insight

วิเคราะห์นักเรียน

ฟีเจอร์:

ดูภาพรวมนักเรียนรายชั้น
บันทึกผลอ่าน/เขียน/คำนวณ
บันทึกพฤติกรรมการเรียนรู้
สรุปเด็กที่ต้องช่วยเหลือ
ให้ AI เสนอแผนซ่อมเสริม
ติดตามความก้าวหน้า
6. PLC Studio

ระบบช่วยงาน PLC

ฟีเจอร์:

เสนอประเด็น PLC จากข้อมูลจริง
สร้างวาระประชุม
บันทึกการประชุม
สรุปมติ
แปลงมติเป็นงาน
ติดตามผลหลัง PLC
7. Knowledge Base

ฐานความรู้โรงเรียน

ใช้เก็บ:

หลักสูตร
SAR
แผนพัฒนาโรงเรียน
คู่มือ
เอกสารนโยบาย
ตัวอย่างแผนดี
Rubric
โครงการ
รายงานผล
8. Report Center

ศูนย์รายงาน

ฟีเจอร์:

รายงานรายชั้น
รายงานรายเดือน
รายงานผล PLC
รายงานเด็กกลุ่มเสี่ยง
รายงานความก้าวหน้าตามเป้าหมาย
รายงานสำหรับ ผอ.
รายงานสำหรับเขตพื้นที่
Export PDF รูปแบบราชการ
5. Flow การทำงานตัวอย่าง
กรณีที่ 1: ผอ. สั่งงานทั้งโรงเรียน

คำสั่ง:

“ช่วยให้ทุกชั้นออกแบบกิจกรรมพัฒนาการอ่าน 1 เดือน”

ระบบทำงานแบบนี้:

AI ผู้ช่วย ผอ. รับคำสั่ง
แตกเป้าหมายเป็นรายช่วงวัย
ส่งให้ AI หัวหน้าวิชาการกำหนดกรอบ
ส่งต่อให้ Agent รายชั้น
Agent รายชั้นสร้างกิจกรรม
ครูประจำชั้นตรวจและปรับ
หัวหน้าวิชาการตรวจภาพรวม
ผอ. ดู Dashboard
ใช้งานจริง
ครูบันทึกผล
AI สรุปผลและเสนอรอบถัดไป
กรณีที่ 2: ครู ป.2 ขอใบงาน

ครูพิมพ์:

“ช่วยทำใบงานคำควบกล้ำสำหรับเด็ก ป.2 มี 3 ระดับ”

AI ป.2 ทำให้:

ใบงานระดับง่าย
ใบงานระดับกลาง
ใบงานระดับท้าทาย
เฉลย
คำแนะนำสำหรับครู
วิธีสังเกตเด็กที่ยังไม่เข้าใจ

จากนั้นส่งให้หัวหน้าวิชาการ AI ตรวจความเหมาะสม

กรณีที่ 3: PLC จากปัญหาจริง

ครูหลายชั้นบันทึกว่าเด็กอ่านจับใจความไม่ได้

ระบบจะสรุปว่า:

ป.3 มีปัญหาอ่านคำถามไม่เข้าใจ
ป.4 อ่านได้แต่สรุปไม่ได้
ป.5 เขียนตอบไม่เป็นประโยค
ป.6 วิเคราะห์เหตุผลไม่ได้

AI หัวหน้าวิชาการเสนอวาระ PLC:

“การพัฒนาการอ่านจับใจความแบบไต่ระดับ ป.3–ป.6”

พร้อมเสนอแผน PLC 4 สัปดาห์

6. สถาปัตยกรรมระบบที่แนะนำ

เหมาะกับแนวทางที่ครูใหญ่ใช้บ่อย:

Frontend

ใช้:

Next.js
Tailwind CSS
shadcn/ui
TanStack Table
Zustand หรือ Redux Toolkit
React Flow สำหรับแสดงโครงสร้าง Agent

หน้าสำคัญ:

Dashboard
Agent Chat
Task Board
Lesson Plan Studio
Student Insight
PLC Studio
Knowledge Base
Report Center
Backend

ใช้:

NestJS
Prisma
MariaDB
Redis
Qdrant หรือ pgvector สำหรับ RAG
BullMQ สำหรับ Queue งาน AI
WebSocket สำหรับสถานะงานแบบ real-time
AI Layer

ควรแยกเป็น AI Gateway

หน้าที่:

เลือกโมเดล
ส่ง Prompt
เก็บ Log
คุม Token
ทำ Rate Limit
ทำ Fallback ระหว่าง Local AI กับ Cloud AI
ตรวจคุณภาพคำตอบ
ส่งงานไปยัง Agent ที่ถูกต้อง

โมเดลที่ใช้ได้:

Local Ollama สำหรับงานทั่วไป/ร่างเอกสาร
Cloud API สำหรับงานยาก เช่น วิเคราะห์เอกสารยาว ตรวจคุณภาพสูง
Embedding model สำหรับค้นฐานความรู้
OCR model สำหรับอ่าน PDF/ภาพ
7. โครงสร้างฐานข้อมูลเบื้องต้น

ตารางหลักที่ควรมี:

users

เก็บผู้ใช้ระบบ

id
name
role
email
password_hash
school_id
class_id
status

บทบาท:

director
academic_head
teacher
admin
agents

เก็บข้อมูล AI Agent

id
name
agent_type
grade_level
system_prompt
model_provider
model_name
temperature
status

ตัวอย่าง agent_type:

director_assistant
academic_lead
classroom_assistant
classrooms

เก็บชั้นเรียน

id
name
level
homeroom_teacher_id
academic_year
tasks

เก็บงานที่มอบหมาย

id
title
description
task_type
assigned_to_user_id
assigned_to_agent_id
created_by
status
due_date
priority
task_outputs

เก็บผลลัพธ์จาก AI

id
task_id
agent_id
content
version
review_status
reviewed_by
created_at
lesson_plans

เก็บแผนการสอน

id
classroom_id
subject
unit_name
learning_objective
activity
assessment
ai_generated
approved_status
students

เก็บข้อมูลนักเรียนเท่าที่จำเป็น

id
classroom_id
student_code
nickname
status

ควรหลีกเลี่ยงการเก็บข้อมูลอ่อนไหวเกินจำเป็น

student_observations

เก็บบันทึกครู

id
student_id
observation_type
note
recorded_by
recorded_at
knowledge_documents

เก็บเอกสารฐานความรู้

id
title
document_type
file_url
extracted_text
embedding_status
uploaded_by
plc_sessions

เก็บการประชุม PLC

id
title
issue
date
summary
action_plan
status
8. Agent Communication Protocol

ควรกำหนดรูปแบบการสื่อสารระหว่าง Agent ให้ชัด

ตัวอย่างโครงสร้างคำสั่งภายใน:

{
  "mission": "พัฒนาการอ่านออกเขียนได้",
  "target_group": ["ป.1", "ป.2", "ป.3"],
  "task_type": "lesson_activity_plan",
  "expected_output": [
    "แผนกิจกรรม 4 สัปดาห์",
    "ใบงาน",
    "แบบประเมิน",
    "ข้อเสนอซ่อมเสริม"
  ],
  "review_required": true,
  "reviewer_agent": "academic_lead_ai",
  "human_approval": "required"
}

การทำแบบนี้จะช่วยให้ระบบไม่มั่ว และสามารถ Debug ได้ง่าย

9. Prompt หลักของ Agent แต่ละระดับ
Prompt สำหรับ AI ผู้ช่วย ผอ.
คุณคือ AI ผู้ช่วยผู้อำนวยการโรงเรียน มีหน้าที่ช่วยวางแผน ประสานงาน มอบหมายงาน ติดตามงาน และสรุปรายงานเชิงบริหาร

หลักการทำงาน:
1. รับเป้าหมายจากผู้อำนวยการ
2. แปลงเป้าหมายเป็นภารกิจย่อย
3. ส่งต่อให้ AI หัวหน้าวิชาการตรวจกรอบงาน
4. กระจายงานให้ AI ประจำชั้นที่เกี่ยวข้อง
5. ติดตามสถานะงาน
6. สรุปผลกลับมาเป็นภาษาผู้บริหาร
7. ทุกข้อเสนอสำคัญต้องให้มนุษย์ตรวจและอนุมัติก่อนใช้งานจริง

ห้าม:
- ตัดสินแทนครูหรือผู้บริหาร
- สร้างข้อมูลนักเรียนที่ไม่มีอยู่จริง
- อนุมัติงานสำคัญโดยไม่มีมนุษย์ตรวจ
Prompt สำหรับ AI หัวหน้าวิชาการ
คุณคือ AI หัวหน้าฝ่ายวิชาการ มีหน้าที่ตรวจคุณภาพงานวิชาการของโรงเรียน

หน้าที่:
1. ตรวจความสอดคล้องกับหลักสูตร
2. ตรวจความเหมาะสมตามวัย
3. ตรวจเป้าหมายการเรียนรู้
4. ตรวจวิธีวัดและประเมินผล
5. เสนอการปรับปรุงแผนการสอน
6. เชื่อมโยงข้อมูลจาก PLC กับการพัฒนาการเรียนรู้
7. สรุปข้อเสนอเชิงวิชาการให้ผู้บริหาร

แนวทาง:
- ใช้ภาษาสร้างสรรค์
- ไม่ตำหนิครู
- เสนอทางเลือกที่ทำได้จริง
- ให้ความสำคัญกับเด็กในบริบทโรงเรียนพื้นที่สูงและเด็กหลายภาษาแม่
Prompt สำหรับ AI ผู้ช่วยครูรายชั้น
คุณคือ AI ผู้ช่วยครูประจำชั้น [ระดับชั้น] มีหน้าที่ช่วยครูออกแบบการเรียนรู้ บันทึก วิเคราะห์ และสร้างสื่อการเรียนรู้ที่เหมาะสมกับผู้เรียน

หน้าที่:
1. ช่วยออกแบบกิจกรรมการเรียนรู้
2. ช่วยสร้างใบงาน
3. ช่วยสร้างแบบประเมิน
4. ช่วยวิเคราะห์ปัญหาการเรียนรู้
5. ช่วยออกแบบกิจกรรมซ่อมเสริม
6. ช่วยสรุปบันทึกหลังสอน
7. ช่วยเตรียมข้อมูลสำหรับ PLC

ข้อควรระวัง:
- ห้ามตีตรานักเรียน
- ห้ามเปิดเผยข้อมูลส่วนบุคคลเกินจำเป็น
- ห้ามสรุปผลแทนครูโดยไม่มีข้อมูล
- ทุกผลลัพธ์ต้องให้ครูตรวจและปรับก่อนใช้จริง
10. สิทธิ์การใช้งาน
ผู้อำนวยการ

ทำได้:

เห็นทุกชั้น
สั่งงานทั้งโรงเรียน
ดู Dashboard
อนุมัติรายงาน
ดูสรุประดับโรงเรียน
ตั้งค่าเป้าหมายเชิงนโยบาย
หัวหน้าวิชาการ

ทำได้:

ตรวจแผนทุกชั้น
ให้ข้อเสนอแนะ
อนุมัติงานวิชาการ
สร้าง PLC
ดูข้อมูลภาพรวมด้านการเรียนรู้
ครูประจำชั้น

ทำได้:

ใช้ Agent ชั้นตนเอง
สร้างแผน/ใบงาน/แบบประเมิน
บันทึกข้อมูลนักเรียนในชั้น
ส่งงานให้ตรวจ
ดูผลวิเคราะห์เฉพาะชั้นตนเอง
Admin ระบบ

ทำได้:

จัดการผู้ใช้
จัดการ Agent
อัปโหลดเอกสารฐานความรู้
ตั้งค่าโมเดล AI
ดู Log การใช้งาน
11. MVP แรกที่ควรทำก่อน

อย่าเริ่มใหญ่เกินไปครับ ไม่งั้นระบบจะกลายเป็น “จักรวาลมาร์เวลเวอร์ชันครูธุรการ” 😄

MVP Version 1 ควรมีแค่นี้ก่อน
Login แยกบทบาท
Agent รายชั้น อ.2–ม.3
AI หัวหน้าวิชาการ
AI ผู้ช่วย ผอ.
หน้า Chat กับ Agent
หน้า Task Board
สร้างแผนการสอน/ใบงาน
ส่งให้หัวหน้าวิชาการ AI ตรวจ
ครูแก้ไขและบันทึก
ผอ. ดู Dashboard สถานะงาน

ยังไม่ต้องทำระบบนักเรียนรายบุคคลเต็มรูปแบบในรอบแรก เพราะเสี่ยงเรื่องข้อมูลและซับซ้อนเกินไป

12. Roadmap การพัฒนา
Phase 1: Agent Foundation

ระยะเริ่มต้น

สร้างระบบผู้ใช้
สร้าง Agent รายชั้น
สร้าง AI หัวหน้าวิชาการ
สร้าง AI ผู้ช่วย ผอ.
ทำหน้า Chat
เก็บประวัติการสนทนา

ผลลัพธ์: ครูเริ่มใช้ AI ช่วยงานรายชั้นได้

Phase 2: Task & Workflow
เพิ่มระบบมอบหมายงาน
เพิ่มสถานะงาน
เพิ่มการตรวจ/อนุมัติ
เพิ่ม Dashboard ผู้บริหาร

ผลลัพธ์: ผอ. สั่งงานและติดตามงานได้

Phase 3: Lesson Plan Studio
สร้างแผนการสอน
สร้างใบงาน
สร้าง Rubric
ตรวจคุณภาพโดย AI หัวหน้าวิชาการ
Export PDF/Word

ผลลัพธ์: ลดภาระเอกสารครูได้ชัดเจน

Phase 4: Knowledge Base + RAG
อัปโหลดหลักสูตร
อัปโหลด SAR
อัปโหลดคู่มือโรงเรียน
ให้ AI อ้างอิงเอกสารโรงเรียน
ค้นเอกสารด้วย Semantic Search

ผลลัพธ์: AI ตอบตรงบริบทโรงเรียน

Phase 5: Student Insight
บันทึกผลรายบุคคล
วิเคราะห์เด็กที่ต้องช่วยเหลือ
สร้างแผนซ่อมเสริม
เชื่อมกับ PLC

ผลลัพธ์: ระบบช่วยดูแลเด็กจริง ไม่ใช่แค่ช่วยทำเอกสาร

13. สูตรการทำงานที่ผมแนะนำ

ระบบนี้ควรยึดสูตรนี้:

Director Command

Academic AI Review
Classroom AI Agents
Teacher Human Approval
Evidence-Based Dashboard
= โรงเรียนที่ใช้ AI อย่างมีคุณภาพ

หรือเขียนเป็นภาษาโปรแกรมได้ว่า

เป้าหมายโรงเรียน
→ แตกเป็นภารกิจ
→ ตรวจกรอบวิชาการ
→ ส่งให้ Agent รายชั้น
→ ครูตรวจและใช้จริง
→ เก็บหลักฐาน
→ วิเคราะห์ผล
→ รายงานผู้บริหาร
→ ปรับปรุงรอบถัดไป
14. ข้อเสนอเชิงออกแบบที่สำคัญที่สุด

ผมแนะนำให้ครูใหญ่คิดระบบนี้เป็น 3 ชั้น

ชั้นที่ 1: AI ช่วยคิด
คิดแผน
คิดกิจกรรม
คิดใบงาน
คิดแบบประเมิน
คิดแนวทางแก้ปัญหา
ชั้นที่ 2: มนุษย์ตรวจและตัดสินใจ
ครูเลือกใช้
หัวหน้าวิชาการตรวจ
ผอ. กำหนดทิศทาง
ชั้นที่ 3: ระบบเรียนรู้จากหลักฐาน
เก็บผลการใช้
วิเคราะห์ความก้าวหน้า
สรุปผล
ปรับปรุงแผนรอบใหม่

ถ้ามีครบ 3 ชั้นนี้ ระบบจะไม่ใช่แค่ “AI ตอบคำถาม” แต่จะเป็น เครื่องมือพัฒนาโรงเรียนทั้งระบบ

15. เวอร์ชันที่ดีที่สุดหลังคิดครบ 10 รอบ

ภาพสุดท้ายของระบบควรเป็นแบบนี้:

ผู้อำนวยการโรงเรียน
        ↓
AI ผู้ช่วยผู้อำนวยการ
        ↓
AI หัวหน้าฝ่ายวิชาการ
        ↓
┌───────────────┬───────────────┬───────────────┐
AI อนุบาล       AI ประถมต้น     AI ประถมปลาย/มัธยม
อ.2 อ.3         ป.1 ป.2 ป.3     ป.4 ป.5 ป.6 ม.1 ม.2 ม.3
        ↓
ครูประจำชั้นตรวจ/ปรับ/ใช้
        ↓
บันทึกผลการเรียนรู้
        ↓
AI วิเคราะห์และสรุป
        ↓
Dashboard ผู้บริหาร
        ↓
ปรับแผนพัฒนารอบใหม่

นี่คือระบบแบบ School AI Team Agent ที่เหมาะกับโรงเรียนจริงมากที่สุดครับ

แก่นสำคัญคือ
AI รายชั้นช่วยครูทำงานละเอียด
AI หัวหน้าวิชาการคุมคุณภาพ
AI ผู้ช่วย ผอ. คุมภาพรวมและประสานงาน
ผอ. เป็นคนกำหนดวิสัยทัศน์และตัดสินใจสุดท้าย
ita_85100663_1_20230817-101526.pdf
PDF
ให้ใช้กรอบการบริหารงานสี่ฝ่ายในโรงเรียนเพื่อเป็นแนวทางในการบริหารงานและเพิ่มตำแหน่งของรองผู้อำนวยการโรงเรียนทั้งสี่ฝ่ายตามงานเพื่อจะได้แจกแจงงานมอบหมายให้กับครูได้อย่างถูกต้อง

ต่อครับครูใหญ่ ผมจะสร้างไฟล์ออกมาเป็นชุดเดียวกัน: เอกสารฐานข้อมูล V2, SQL migration สำหรับหลายโรงเรียน/หลายปีการศึกษา, และ PRD สำหรับ Claude Design โดยเฉพาะครับ

Analyzed
from pathlib import Path

base = Path("/mnt/data")
base.mkdir(parents=True, exist_ok=True)

db_v2_md = """# Database Design V2: Multi-School / Multi-Area / Multi-Year School AI Agent System

**Target DB:** MariaDB 11.x  
**Version:** 2.0  
**Purpose:** ปรับฐานข้อมูลจากระบบโรงเรียนเดี่ยว ให้รองรับหลายโรงเรียน หลายเขตพื้นที่ และหลายปีการศึกษา  
**Important Design Decision:** แยก “ตัวบุคคล/บัญชีผู้ใช้” ออกจาก “สิทธิ์และบทบาทในโรงเรียน/เขตพื้นที่/ปีการศึกษา”

---

## 1. Pain Point ของ Schema V1

Schema V1 รองรับโรงเรียนเดียวหรือหลายโรงเรียนแบบพื้นฐาน เพราะหลายตารางมี `school_id` แล้ว แต่ยังมีข้อจำกัดสำคัญ:

1. `users.school_id` ทำให้ผู้ใช้ 1 คนถูกผูกกับโรงเรียนเดียว
2. ยังไม่มีตาราง `education_area_offices` สำหรับเขตพื้นที่การศึกษา
3. ยังไม่มี `school_networks` หรือกลุ่มโรงเรียน/เครือข่ายสถานศึกษา
4. `roles` และ `user_roles` ยังไม่รองรับ scope แบบเขตพื้นที่/โรงเรียน/ปีการศึกษา/ฝ่าย/ห้องเรียน
5. ปีการศึกษามีแล้ว แต่ยังไม่แยกภาคเรียน/ช่วงเวลา/บริบท Dashboard ให้ชัด
6. Agent ยังผูกกับโรงเรียนเดียวเป็นหลัก
7. Dashboard ยังไม่ได้ออกแบบตามมุมมองหลายระดับ เช่น เขตพื้นที่ → โรงเรียน → ฝ่าย → ชั้นเรียน → ครู

---

## 2. หลักการออกแบบ V2

### 2.1 Multi-Tenant Hierarchy

```text
ระดับระบบกลาง
        ↓
เขตพื้นที่การศึกษา
        ↓
กลุ่มโรงเรียน / เครือข่ายโรงเรียน
        ↓
โรงเรียน
        ↓
ปีการศึกษา / ภาคเรียน
        ↓
ฝ่าย 4 ฝ่าย
        ↓
ห้องเรียน / ครู / นักเรียน / งาน / หลักฐาน
2.2 Identity Separation
persons
  = ตัวบุคคลจริง เช่น ผู้อำนวยการ ครู เจ้าหน้าที่ ศึกษานิเทศก์

users
  = บัญชีเข้าสู่ระบบ อาจผูกกับ person

user_school_memberships
  = บุคคลนี้มีบทบาทอะไรในโรงเรียนใด ปีการศึกษาใด ฝ่ายใด ห้องใด

user_area_assignments
  = บุคคลนี้มีบทบาทอะไรในเขตพื้นที่ใด

วิธีนี้ทำให้คนคนเดียวเป็นได้หลายบทบาท เช่น

เป็น ผอ. โรงเรียน A
เป็นผู้ดูแลระบบระดับเครือข่าย
เป็นผู้ประเมินจากเขตพื้นที่
เป็นกรรมการวิชาการหลายโรงเรียน
3. ตารางใหม่ที่เพิ่มใน V2
3.1 education_area_offices

เก็บเขตพื้นที่การศึกษา เช่น

สพป.เชียงราย เขต 3
สพม.เชียงราย
สพป.ระนอง
3.2 school_networks

เก็บกลุ่มโรงเรียน/เครือข่ายโรงเรียนภายในเขตพื้นที่ เช่น

กลุ่มโรงเรียนดอยตุง
กลุ่มโรงเรียนชายแดน
กลุ่มโรงเรียนพื้นที่สูง
3.3 persons

เก็บตัวบุคคลกลาง ไม่ผูกกับโรงเรียนใดโรงเรียนหนึ่ง

3.4 user_school_memberships

เก็บบทบาทผู้ใช้ในแต่ละโรงเรียน แยกตามปีการศึกษา/ฝ่าย/ห้องเรียนได้

3.5 user_area_assignments

เก็บบทบาทระดับเขตพื้นที่ เช่น ศึกษานิเทศก์ ผู้ดูแลเขต ผู้บริหารเขต

3.6 academic_terms

แยกภาคเรียน/ช่วงเวลาออกจาก academic_years

3.7 agent_scope_assignments

กำหนดว่า AI Agent ตัวหนึ่งทำงานใน scope ใด เช่น

ทั้งเขตพื้นที่
เฉพาะโรงเรียน
เฉพาะปีการศึกษา
เฉพาะฝ่าย
เฉพาะห้องเรียน
3.8 dashboard_layouts

กำหนด Dashboard ตามบทบาทและ scope

4. ERD ระดับ Multi-School
education_area_offices
 ├── school_networks
 │    └── schools
 │         ├── academic_years
 │         │    └── academic_terms
 │         ├── departments
 │         ├── classrooms
 │         ├── tasks
 │         ├── agents
 │         └── evidence_files
 │
persons
 ├── users
 ├── user_school_memberships
 └── user_area_assignments

agents
 └── agent_scope_assignments

tasks
 ├── task_departments
 ├── task_assignees
 ├── approval_routes
 └── evidence_files
5. ตารางหลักหลังปรับเป็น V2
5.1 education_area_offices
CREATE TABLE education_area_offices (
  id CHAR(36) PRIMARY KEY,
  code VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  office_type VARCHAR(100) NULL,
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
5.2 school_networks
CREATE TABLE school_networks (
  id CHAR(36) PRIMARY KEY,
  area_office_id CHAR(36) NOT NULL,
  code VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_school_network_area_code (area_office_id, code)
);
5.3 persons
CREATE TABLE persons (
  id CHAR(36) PRIMARY KEY,
  national_id_hash VARCHAR(255) NULL,
  display_name VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NULL,
  last_name VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  profile JSON NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
5.4 user_school_memberships
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
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
5.5 user_area_assignments
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
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
5.6 academic_terms
CREATE TABLE academic_terms (
  id CHAR(36) PRIMARY KEY,
  academic_year_id CHAR(36) NOT NULL,
  term_no TINYINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  is_current TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_academic_terms_year_term (academic_year_id, term_no)
);
5.7 agent_scope_assignments
CREATE TABLE agent_scope_assignments (
  id CHAR(36) PRIMARY KEY,
  agent_id CHAR(36) NOT NULL,
  scope_level VARCHAR(50) NOT NULL,
  area_office_id CHAR(36) NULL,
  school_network_id CHAR(36) NULL,
  school_id CHAR(36) NULL,
  academic_year_id CHAR(36) NULL,
  academic_term_id CHAR(36) NULL,
  department_id CHAR(36) NULL,
  classroom_id CHAR(36) NULL,
  role_description TEXT NULL,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ค่า scope_level ที่แนะนำ:

system
area
network
school
academic_year
term
department
classroom
task
5.8 dashboard_layouts
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
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
6. ตารางเดิมที่ต้องปรับ
6.1 schools

เพิ่ม field:

area_office_id
school_network_id
province
district
subdistrict
school_size
school_type
6.2 users

แนวทางแนะนำ:

เพิ่ม person_id
ค่อย ๆ ลดการพึ่งพา users.school_id
ใช้ user_school_memberships แทนการตรวจสิทธิ์หลัก
6.3 agents

แนวทางแนะนำ:

ให้ school_id เป็น nullable
เพิ่ม area_office_id
เพิ่ม scope_level
ใช้ agent_scope_assignments เป็นตัวกำหนด scope จริง
6.4 tasks

ควรเพิ่ม:

area_office_id
school_network_id
academic_term_id
scope_level

เหตุผล:

งานระดับเขต เช่น “ให้ทุกโรงเรียนส่ง SAR”
งานระดับกลุ่มโรงเรียน เช่น “กลุ่มดอยตุงจัด PLC ร่วม”
งานระดับโรงเรียน
งานระดับฝ่าย
งานระดับห้องเรียน
7. Logic การตรวจสิทธิ์แบบใหม่
7.1 Scope
Area Officer:
เห็นทุกโรงเรียนใน area_office_id ของตน

Network Admin:
เห็นทุกโรงเรียนใน school_network_id ของตน

School Director:
เห็นทุกข้อมูลใน school_id ของตน

Deputy:
เห็นข้อมูลใน school_id + department_id ของตน

Teacher:
เห็นข้อมูลใน classroom_id / tasks ที่ตนรับผิดชอบ

IT Admin:
เห็นตาม scope ที่ได้รับ
7.2 Pseudo Logic
function canAccessTask(user, task) {
  const memberships = getUserMemberships(user.personId)

  return memberships.some(m => {
    if (m.role === 'area_admin' && m.areaOfficeId === task.areaOfficeId) return true
    if (m.role === 'school_director' && m.schoolId === task.schoolId) return true
    if (m.role.startsWith('deputy') && m.schoolId === task.schoolId && m.departmentId === task.departmentId) return true
    if (m.role === 'teacher' && task.assignees.includes(user.id)) return true
    return false
  })
}
8. Dashboard Scope

ระบบต้องรองรับ Dashboard 5 ระดับ

8.1 Area Dashboard

สำหรับเขตพื้นที่

จำนวนโรงเรียนในเขต
งานที่มอบหมายข้ามโรงเรียน
โรงเรียนที่ส่งงานครบ/ไม่ครบ
สถานะ SAR/ITA/PLC/โครงการ
AI usage รวมตามโรงเรียน
Risk Map รายโรงเรียน
8.2 Network Dashboard

สำหรับกลุ่มโรงเรียน

งานร่วมของกลุ่ม
PLC เครือข่าย
การเปรียบเทียบสถานะงานระหว่างโรงเรียน
ทรัพยากรและสื่อร่วม
8.3 School Director Dashboard

สำหรับ ผอ.

สถานะ 4 ฝ่าย
งานรออนุมัติ
งานค้าง
หลักฐานขาด
AI usage
ความเสี่ยงรายฝ่าย
สรุปรายปี/ภาคเรียน
8.4 Department Dashboard

สำหรับรอง ผอ./หัวหน้าฝ่าย

งานของฝ่าย
งานค้าง
งานรอครูส่ง
งานรอ AI Review
งานรอ Human Review
หลักฐานของฝ่าย
รายงานเฉพาะฝ่าย
8.5 Teacher Dashboard

สำหรับครู

งานของฉัน
งานประจำชั้น
งานใกล้ครบกำหนด
AI ผู้ช่วยประจำชั้น
หลักฐานที่ต้องส่ง
บันทึก/แผน/ใบงานล่าสุด
9. Migration Strategy
Phase A: Add Area/Network Tables
สร้าง education_area_offices
สร้าง school_networks
เพิ่ม foreign key ใน schools
Phase B: Add Identity Layer
สร้าง persons
เพิ่ม person_id ใน users
backfill persons จาก users เดิม
สร้าง user_school_memberships
ย้าย role เดิมเข้า memberships
Phase C: Add Academic Term
สร้าง academic_terms
เพิ่ม academic_term_id ใน tasks/modules ที่ต้องการ
ใช้ academic_year_id + academic_term_id เป็น context หลัก
Phase D: Add Agent Scope
เพิ่ม area_office_id, scope_level ใน agents
สร้าง agent_scope_assignments
sync Paperclip ใหม่ตาม scope
Phase E: Dashboard
สร้าง dashboard_layouts
สร้าง view / API แยกตาม area/school/department/teacher
10. Recommended Indexes
KEY idx_schools_area_network (area_office_id, school_network_id)
KEY idx_memberships_person_school_year (person_id, school_id, academic_year_id)
KEY idx_memberships_school_role (school_id, role_id, status)
KEY idx_area_assignments_person_area (person_id, area_office_id)
KEY idx_tasks_area_school_status (area_office_id, school_id, status)
KEY idx_tasks_school_year_term (school_id, academic_year_id, academic_term_id)
KEY idx_agent_scope_school_dept (school_id, department_id, classroom_id)
11. Recommended Prisma Model Direction

ใน Prisma ควรคิดเป็น 4 layers:

Tenant Layer:
AreaOffice, SchoolNetwork, School, AcademicYear, AcademicTerm

Identity Layer:
Person, User, Role, UserSchoolMembership, UserAreaAssignment

Operation Layer:
Department, WorkCategory, Classroom, Task, EvidenceFile, ApprovalRoute

AI Layer:
Agent, AgentScopeAssignment, AiConversation, AiRunLog, PaperclipMapping
12. Final V2 Formula
education_area_offices
+ school_networks
+ schools
+ academic_years / academic_terms
+ persons / memberships
+ departments 4 ฝ่าย
+ scoped agents
+ scoped tasks
+ scoped dashboards
= ระบบ AI Agent ที่ใช้ได้หลายโรงเรียน หลายเขตพื้นที่ และหลายปีการศึกษา

"""

migration_sql = """-- ============================================================
-- Migration V2: Multi-School / Multi-Area / Multi-Year Upgrade
-- Target: Existing school_agent_db from V1
-- DB: MariaDB 11.x
-- Notes:
-- 1) Run after backup.
-- 2) This migration keeps existing tables and adds multi-tenant capability.
-- 3) MariaDB version must support ADD COLUMN IF NOT EXISTS.
-- ============================================================

USE school_agent_db;

-- ============================================================
-- 1. AREA OFFICE / SCHOOL NETWORK
-- ============================================================

CREATE TABLE IF NOT EXISTS education_area_offices (
id CHAR(36) PRIMARY KEY,
code VARCHAR(100) NOT NULL,
name VARCHAR(255) NOT NULL,
office_type VARCHAR(100) NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS school_networks (
id CHAR(36) PRIMARY KEY,
area_office_id CHAR(36) NOT NULL,
code VARCHAR(100) NOT NULL,
name VARCHAR(255) NOT NULL,
description TEXT NULL,
is_active TINYINT(1) NOT NULL DEFAULT 1,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_school_networks_area FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
UNIQUE KEY uq_school_network_area_code (area_office_id, code),
KEY idx_school_networks_area (area_office_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE schools
ADD COLUMN IF NOT EXISTS area_office_id CHAR(36) NULL AFTER id,
ADD COLUMN IF NOT EXISTS school_network_id CHAR(36) NULL AFTER area_office_id,
ADD COLUMN IF NOT EXISTS province VARCHAR(255) NULL AFTER address,
ADD COLUMN IF NOT EXISTS district VARCHAR(255) NULL AFTER province,
ADD COLUMN IF NOT EXISTS subdistrict VARCHAR(255) NULL AFTER district,
ADD COLUMN IF NOT EXISTS school_size VARCHAR(100) NULL AFTER subdistrict,
ADD COLUMN IF NOT EXISTS school_type VARCHAR(100) NULL AFTER school_size,
ADD KEY IF NOT EXISTS idx_schools_area_network (area_office_id, school_network_id);

-- If FK constraint names already exist, run these manually after checking SHOW CREATE TABLE schools.
ALTER TABLE schools
ADD CONSTRAINT fk_schools_area_office FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
ADD CONSTRAINT fk_schools_network FOREIGN KEY (school_network_id) REFERENCES school_networks(id);

-- ============================================================
-- 2. IDENTITY LAYER
-- ============================================================

CREATE TABLE IF NOT EXISTS persons (
id CHAR(36) PRIMARY KEY,
national_id_hash VARCHAR(255) NULL,
display_name VARCHAR(255) NOT NULL,
first_name VARCHAR(255) NULL,
last_name VARCHAR(255) NULL,
email VARCHAR(255) NULL,
phone VARCHAR(50) NULL,
profile JSON NULL,
status VARCHAR(50) NOT NULL DEFAULT 'active',
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
KEY idx_persons_email (email),
KEY idx_persons_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS person_id CHAR(36) NULL AFTER id,
ADD KEY IF NOT EXISTS idx_users_person (person_id);

ALTER TABLE users
ADD CONSTRAINT fk_users_person FOREIGN KEY (person_id) REFERENCES persons(id);

-- Optional backfill persons from existing users.
INSERT INTO persons (id, display_name, email, phone, status, created_at, updated_at)
SELECT UUID(), u.name, u.email, u.phone, u.status, NOW(), NOW()
FROM users u
WHERE u.person_id IS NULL;

UPDATE users u
JOIN persons p
ON (p.email = u.email OR (p.email IS NULL AND p.display_name = u.name))
SET u.person_id = p.id
WHERE u.person_id IS NULL;

CREATE TABLE IF NOT EXISTS user_school_memberships (
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
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_memberships_person FOREIGN KEY (person_id) REFERENCES persons(id),
CONSTRAINT fk_memberships_user FOREIGN KEY (user_id) REFERENCES users(id),
CONSTRAINT fk_memberships_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_memberships_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
CONSTRAINT fk_memberships_department FOREIGN KEY (department_id) REFERENCES departments(id),
CONSTRAINT fk_memberships_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
CONSTRAINT fk_memberships_role FOREIGN KEY (role_id) REFERENCES roles(id),
UNIQUE KEY uq_membership_scope (person_id, school_id, academic_year_id, department_id, classroom_id, role_id),
KEY idx_memberships_person_school_year (person_id, school_id, academic_year_id),
KEY idx_memberships_school_role (school_id, role_id, status),
KEY idx_memberships_department (department_id),
KEY idx_memberships_classroom (classroom_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_area_assignments (
id CHAR(36) PRIMARY KEY,
person_id CHAR(36) NOT NULL,
user_id CHAR(36) NULL,
area_office_id CHAR(36) NOT NULL,
role_code VARCHAR(100) NOT NULL,
position_title VARCHAR(255) NULL,
status VARCHAR(50) NOT NULL DEFAULT 'active',
start_date DATE NULL,
end_date DATE NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_area_assignments_person FOREIGN KEY (person_id) REFERENCES persons(id),
CONSTRAINT fk_area_assignments_user FOREIGN KEY (user_id) REFERENCES users(id),
CONSTRAINT fk_area_assignments_area FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
UNIQUE KEY uq_area_assignment_scope (person_id, area_office_id, role_code),
KEY idx_area_assignments_person_area (person_id, area_office_id),
KEY idx_area_assignments_area_role (area_office_id, role_code, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Backfill memberships from existing user_roles.
INSERT IGNORE INTO user_school_memberships (
id, person_id, user_id, school_id, academic_year_id, department_id, classroom_id,
role_id, position_title, membership_type, status, created_at, updated_at
)
SELECT
UUID(), u.person_id, u.id, u.school_id, NULL, ur.department_id, NULL,
ur.role_id, u.position_title, 'staff', u.status, NOW(), NOW()
FROM user_roles ur
JOIN users u ON u.id = ur.user_id
WHERE u.person_id IS NOT NULL;

-- ============================================================
-- 3. ACADEMIC TERMS
-- ============================================================

CREATE TABLE IF NOT EXISTS academic_terms (
id CHAR(36) PRIMARY KEY,
academic_year_id CHAR(36) NOT NULL,
term_no TINYINT NOT NULL,
name VARCHAR(100) NOT NULL,
start_date DATE NULL,
end_date DATE NULL,
is_current TINYINT(1) NOT NULL DEFAULT 0,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_academic_terms_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
UNIQUE KEY uq_academic_terms_year_term (academic_year_id, term_no),
KEY idx_academic_terms_current (academic_year_id, is_current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS area_office_id CHAR(36) NULL AFTER school_id,
ADD COLUMN IF NOT EXISTS school_network_id CHAR(36) NULL AFTER area_office_id,
ADD COLUMN IF NOT EXISTS academic_term_id CHAR(36) NULL AFTER academic_year_id,
ADD COLUMN IF NOT EXISTS scope_level VARCHAR(50) NOT NULL DEFAULT 'school' AFTER task_type,
ADD KEY IF NOT EXISTS idx_tasks_area_school_status (area_office_id, school_id, status),
ADD KEY IF NOT EXISTS idx_tasks_school_year_term (school_id, academic_year_id, academic_term_id);

ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_area_office FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
ADD CONSTRAINT fk_tasks_school_network FOREIGN KEY (school_network_id) REFERENCES school_networks(id),
ADD CONSTRAINT fk_tasks_academic_term FOREIGN KEY (academic_term_id) REFERENCES academic_terms(id);

UPDATE tasks t
JOIN schools s ON s.id = t.school_id
SET
t.area_office_id = s.area_office_id,
t.school_network_id = s.school_network_id
WHERE t.area_office_id IS NULL;

-- ============================================================
-- 4. AGENT SCOPE
-- ============================================================

ALTER TABLE agents
ADD COLUMN IF NOT EXISTS area_office_id CHAR(36) NULL AFTER school_id,
ADD COLUMN IF NOT EXISTS scope_level VARCHAR(50) NOT NULL DEFAULT 'school' AFTER agent_type,
ADD KEY IF NOT EXISTS idx_agents_area_scope (area_office_id, scope_level),
ADD KEY IF NOT EXISTS idx_agents_school_scope (school_id, scope_level);

ALTER TABLE agents
ADD CONSTRAINT fk_agents_area_office FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id);

-- Optional: allow area-level agents by making school_id nullable.
ALTER TABLE agents MODIFY COLUMN school_id CHAR(36) NULL;

CREATE TABLE IF NOT EXISTS agent_scope_assignments (
id CHAR(36) PRIMARY KEY,
agent_id CHAR(36) NOT NULL,
scope_level VARCHAR(50) NOT NULL,
area_office_id CHAR(36) NULL,
school_network_id CHAR(36) NULL,
school_id CHAR(36) NULL,
academic_year_id CHAR(36) NULL,
academic_term_id CHAR(36) NULL,
department_id CHAR(36) NULL,
classroom_id CHAR(36) NULL,
role_description TEXT NULL,
is_primary TINYINT(1) NOT NULL DEFAULT 0,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_agent_scope_agent FOREIGN KEY (agent_id) REFERENCES agents(id),
CONSTRAINT fk_agent_scope_area FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
CONSTRAINT fk_agent_scope_network FOREIGN KEY (school_network_id) REFERENCES school_networks(id),
CONSTRAINT fk_agent_scope_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_agent_scope_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
CONSTRAINT fk_agent_scope_term FOREIGN KEY (academic_term_id) REFERENCES academic_terms(id),
CONSTRAINT fk_agent_scope_department FOREIGN KEY (department_id) REFERENCES departments(id),
CONSTRAINT fk_agent_scope_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
KEY idx_agent_scope_agent (agent_id),
KEY idx_agent_scope_area_school (area_office_id, school_id),
KEY idx_agent_scope_school_dept (school_id, department_id, classroom_id),
KEY idx_agent_scope_year_term (academic_year_id, academic_term_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO agent_scope_assignments (
id, agent_id, scope_level, area_office_id, school_id, department_id, classroom_id,
role_description, is_primary, created_at
)
SELECT
UUID(), a.id, COALESCE(a.scope_level, 'school'), s.area_office_id, a.school_id, a.department_id, NULL,
CONCAT('Initial scope for ', a.name), 1, NOW()
FROM agents a
LEFT JOIN schools s ON s.id = a.school_id;

-- ============================================================
-- 5. DASHBOARD LAYOUTS
-- ============================================================

CREATE TABLE IF NOT EXISTS dashboard_layouts (
id CHAR(36) PRIMARY KEY,
school_id CHAR(36) NULL,
area_office_id CHAR(36) NULL,
role_code VARCHAR(100) NOT NULL,
dashboard_type VARCHAR(100) NOT NULL,
name VARCHAR(255) NOT NULL,
layout_json JSON NOT NULL,
theme_json JSON NULL,
is_default TINYINT(1) NOT NULL DEFAULT 0,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_dashboard_layouts_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_dashboard_layouts_area FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
KEY idx_dashboard_scope (area_office_id, school_id, role_code, dashboard_type),
KEY idx_dashboard_default (role_code, dashboard_type, is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. MULTI-SCHOOL DASHBOARD VIEWS
-- ============================================================

CREATE OR REPLACE VIEW v_school_task_summary AS
SELECT
s.area_office_id,
s.school_network_id,
t.school_id,
t.academic_year_id,
t.academic_term_id,
t.department_id,
t.status,
COUNT(*) AS task_count,
SUM(CASE WHEN t.due_date IS NOT NULL AND t.due_date < NOW()
AND t.status NOT IN ('completed','archived','cancelled') THEN 1 ELSE 0 END) AS overdue_count
FROM tasks t
JOIN schools s ON s.id = t.school_id
WHERE t.deleted_at IS NULL
GROUP BY
s.area_office_id,
s.school_network_id,
t.school_id,
t.academic_year_id,
t.academic_term_id,
t.department_id,
t.status;

CREATE OR REPLACE VIEW v_area_school_progress AS
SELECT
s.area_office_id,
s.school_network_id,
s.id AS school_id,
s.name AS school_name,
COUNT(t.id) AS total_tasks,
SUM(CASE WHEN t.status IN ('completed','approved','archived') THEN 1 ELSE 0 END) AS completed_tasks,
SUM(CASE WHEN t.status NOT IN ('completed','approved','archived','cancelled') THEN 1 ELSE 0 END) AS active_tasks,
SUM(CASE WHEN t.due_date IS NOT NULL AND t.due_date < NOW()
AND t.status NOT IN ('completed','approved','archived','cancelled') THEN 1 ELSE 0 END) AS overdue_tasks
FROM schools s
LEFT JOIN tasks t ON t.school_id = s.id AND t.deleted_at IS NULL
GROUP BY s.area_office_id, s.school_network_id, s.id, s.name;

-- ============================================================
-- 7. SEED EXAMPLE
-- ============================================================

-- SET @area_id = UUID();
-- INSERT INTO education_area_offices (id, code, name, office_type, province)
-- VALUES (@area_id, 'CRI3', 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาเชียงราย เขต 3', 'primary', 'เชียงราย');

-- UPDATE schools SET area_office_id = @area_id WHERE code = 'BPP';

-- ============================================================
-- End Migration V2
-- ============================================================
"""

design_prd = """# PRD Handoff to Claude Design: School AI Agent Command Center UI

File: prd-claude-design-teacher-agent-ui.md
Version: 1.0
Target: Claude Design / Claude Code UI Implementation
Frontend Stack: Next.js + TypeScript + Tailwind CSS + shadcn/ui
Theme: ไล่เฉดสี ม่วง-ฟ้า-ขาว พร้อม Dark Mode / Light Mode
Product: ระบบบริหารโรงเรียนด้วย AI Agent หลายโรงเรียน หลายเขตพื้นที่ หลายปีการศึกษา
Core Concept: Dashboard แยกตามภาระหน้าที่ 4 ฝ่าย + ผู้บริหาร + ครู + เขตพื้นที่

1. Design Goal

ออกแบบ UI เว็บแอปสำหรับระบบ School AI Agent Command Center ที่ใช้บริหารงานโรงเรียนด้วย AI Agent ตามกรอบ 4 ฝ่าย ได้แก่

ฝ่ายวิชาการ
ฝ่ายงบประมาณ
ฝ่ายบริหารงานบุคคล
ฝ่ายบริหารทั่วไป

ระบบต้องรองรับ

หลายเขตพื้นที่
หลายโรงเรียน
หลายปีการศึกษา
หลายภาคเรียน
หลายบทบาทผู้ใช้
AI Agent หลายระดับ
Dashboard แยกตามภาระหน้าที่
Light Mode และ Dark Mode
2. Visual Direction
2.1 Mood
Modern
Trustworthy
Academic
Soft but professional
AI-assisted but not sci-fi too much

บรรยากาศควรเหมือน “ศูนย์บัญชาการโรงเรียนยุคใหม่” มากกว่า “ระบบราชการสีเทา”

2.2 Color Palette

ใช้ Tailwind CSS เป็นหลัก

Light Mode
Background:
- white
- slate-50
- violet-50
- sky-50

Primary:
- violet-600
- violet-700

Secondary:
- sky-500
- blue-600

Accent:
- fuchsia-500
- cyan-400

Text:
- slate-900
- slate-700
- slate-500

Border:
- slate-200
- violet-100
Dark Mode
Background:
- slate-950
- slate-900
- indigo-950

Primary:
- violet-400
- violet-500

Secondary:
- sky-400
- cyan-300

Text:
- slate-50
- slate-200
- slate-400

Border:
- slate-800
- violet-900
2.3 Gradient Style

ใช้ gradient หลัก:

bg-gradient-to-br from-violet-600 via-blue-500 to-sky-400

สำหรับ light hero/card:

bg-gradient-to-br from-violet-50 via-white to-sky-50

สำหรับ dark hero/card:

dark:bg-gradient-to-br dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900
2.4 Rounded & Shadow
rounded-2xl
shadow-sm
shadow-lg เฉพาะ card สำคัญ
border border-slate-200/70
dark:border-slate-800
3. Layout System
3.1 App Shell

ทุกหน้าหลักใช้โครงสร้างเดียวกัน

┌─────────────────────────────────────────────┐
│ Top Bar: School / Area / Year Switcher       │
├───────────────┬─────────────────────────────┤
│ Sidebar       │ Main Content                 │
│ Navigation    │ Dashboard / Module           │
└───────────────┴─────────────────────────────┘
3.2 Top Bar Components

Top Bar ต้องมี

Area Office Switcher
School Switcher
Academic Year Switcher
Academic Term Switcher
Role Switcher
Search
Notification Bell
Theme Toggle
User Menu

ตัวอย่าง UI:

[สพป.เชียงราย เขต 3 ▼] [โรงเรียนบ้านพญาไพร ▼] [2569 / ภาคเรียน 1 ▼]
                                                [ค้นหา...] [🔔] [🌙] [ครูใหญ่]
3.3 Sidebar Navigation

Main Sidebar

Dashboard
Command Center
งานของโรงเรียน
AI Agent Room
4 ฝ่าย
  - วิชาการ
  - งบประมาณ
  - บุคคล
  - บริหารทั่วไป
ครูและชั้นเรียน
หลักฐาน
PLC
รายงาน
ตั้งค่า
4. Information Architecture
4.1 Routes
/login
/select-context

/area/dashboard
/area/schools
/area/tasks
/area/reports

/school/dashboard
/school/command-center
/school/tasks
/school/agents
/school/evidence
/school/reports

/departments/academic
/departments/budget
/departments/hr
/departments/general-affairs

/teacher/workbench
/teacher/classroom
/teacher/tasks
/teacher/lesson-plans

/agents
/agents/:agentId
/agents/:agentId/chat

/tasks
/tasks/:taskId

/evidence
/evidence/:evidenceId

/settings/theme
/settings/agents
/settings/paperclip
/settings/schools
/settings/roles
5. Dashboard Types

ระบบต้องมี Dashboard แยกตามภาระหน้าที่ ไม่ใช่ Dashboard เดียวที่อัดทุกอย่างรวมกันจนผู้ใช้มึนเหมือนเปิดแฟ้มประเมินวันสุดท้าย

5.1 Area Office Dashboard
ผู้ใช้
ผู้ดูแลระดับเขตพื้นที่
ศึกษานิเทศก์
ผู้บริหารที่ดูหลายโรงเรียน
Objective

เห็นภาพรวมทุกโรงเรียนในเขตพื้นที่

Main Cards
จำนวนโรงเรียนทั้งหมด
โรงเรียนที่ส่งงานครบ
โรงเรียนที่มีงานค้าง
โรงเรียนที่เสี่ยงล่าช้า
งานระดับเขตที่กำลังดำเนินการ
AI Usage รวมทั้งเขต
SAR/ITA/PLC Progress
Main Widgets
School Progress Table

Column:

โรงเรียน | งานทั้งหมด | เสร็จแล้ว | ค้าง | เกินกำหนด | ความเสี่ยง | เปิดดู
Risk Map

แสดงโรงเรียนตามสถานะ

เขียว = ปกติ
เหลือง = ต้องติดตาม
แดง = เสี่ยงล่าช้า
Area Command Panel

ช่องสั่งงานระดับเขต เช่น

“ให้ทุกโรงเรียนส่งรายงาน PLC ภายในวันที่ 30”
5.2 School Director Dashboard
ผู้ใช้
ผู้อำนวยการโรงเรียน
Objective

เห็นภาพรวมโรงเรียนทั้งหมด แยกตาม 4 ฝ่าย

Hero Section
สวัสดีครับ/ค่ะ ครูใหญ่
ภาพรวมโรงเรียนประจำปีการศึกษา 2569 ภาคเรียนที่ 1

ใช้ card ไล่เฉดสีม่วง-ฟ้า

Main Cards
งานทั้งหมด
งานรออนุมัติ
งานค้าง
งานเกินกำหนด
หลักฐานที่ยังขาด
การใช้ AI เดือนนี้
4-Division Dashboard Cards
ฝ่ายวิชาการ

Icon: BookOpen
Color: violet/blue
Metrics:

แผนการสอนรอตรวจ
PLC ที่ดำเนินการแล้ว
งานวัดผล
SAR Evidence
ฝ่ายงบประมาณ

Icon: Wallet / Receipt
Color: blue/cyan
Metrics:

คำขอใช้งบ
เอกสารพัสดุรอตรวจ
โครงการที่ยังไม่สรุป
หลักฐานการเงินที่ขาด
ฝ่ายบุคคล

Icon: Users
Color: violet/fuchsia
Metrics:

งานภาระครู
การลา/ลงเวลา
วPA/แฟ้มพัฒนาครู
อบรม/พัฒนาครู
ฝ่ายบริหารทั่วไป

Icon: Building / Megaphone
Color: sky/indigo
Metrics:

งานธุรการ
อาคารสถานที่
กิจการนักเรียน
อนามัย/โภชนาการ/ประชาสัมพันธ์
Required Chart
Task Status Donut
Tasks by Department Bar Chart
Overdue Task Trend
AI Usage by Agent
5.3 Deputy Academic Dashboard
ผู้ใช้
รอง ผอ./หัวหน้าฝ่ายวิชาการ
หัวหน้างานวิชาการ
Objective

ติดตามงานหลักสูตร การสอน วัดผล PLC นิเทศ และประกันคุณภาพ

Cards
แผนการสอนรอตรวจ
ใบงาน/แบบประเมินรอตรวจ
PLC รอดำเนินการ
SAR Evidence วิชาการ
งานซ่อมเสริมรายชั้น
Agent รายชั้นที่ใช้งานบ่อย
Widgets
Classroom Academic Matrix
ชั้น | แผนการสอน | แบบประเมิน | PLC | ซ่อมเสริม | สถานะ
อ.2
อ.3
ป.1
...
ม.3
Academic AI Panel

ปุ่มลัด:

สร้างแผนการสอน
ตรวจแผน
สร้างใบงาน
สรุป PLC
วิเคราะห์ผลผู้เรียน
เตรียม SAR
5.4 Deputy Budget Dashboard
Objective

ติดตามงานงบประมาณ การเงิน พัสดุ โครงการ และหลักฐาน

Cards
คำขอใช้งบรอตรวจ
โครงการที่ยังไม่สรุป
เอกสารพัสดุที่ขาด
ครุภัณฑ์ต้องตรวจ
งบประมาณที่ใช้ไป
งานจัดซื้อจัดจ้างรอดำเนินการ
Widgets
Budget Request Table
เรื่อง | ผู้ขอ | จำนวนเงิน | โครงการ | สถานะ | เอกสารครบไหม
Procurement Checklist

ใช้ checklist UI ที่ชัดเจน

[✓] ใบเสนอราคา
[ ] บันทึกขอซื้อ
[ ] คำสั่งแต่งตั้งกรรมการ
[✓] หลักฐานรับของ
5.5 Deputy HR Dashboard
Objective

ติดตามงานบุคคล ภาระงานครู การลา การลงเวลา วPA และพัฒนาครู

Cards
ครูทั้งหมด
ภาระงานเกินเกณฑ์
ใบลารอตรวจ
วPA รอหลักฐาน
การอบรม/พัฒนาครู
งานประเมินผลการปฏิบัติงาน
Widgets
Teacher Workload Balance
ครู | งานวิชาการ | งานโครงการ | งานเวร | งานอื่น | ภาระรวม
PA Portfolio Progress
ครู | ข้อตกลง PA | หลักฐาน | PLC | ผลงาน | สถานะ
5.6 Deputy General Affairs Dashboard
Objective

ติดตามธุรการ อาคารสถานที่ กิจการนักเรียน อนามัย โภชนาการ ห้องสมุด ประชาสัมพันธ์ และชุมชนสัมพันธ์

Cards
หนังสือราชการรอดำเนินการ
งานอาคารสถานที่
งานกิจการนักเรียน
งานอนามัย/โภชนาการ
งานประชาสัมพันธ์
งานเวรประจำวัน
Widgets
General Affairs Kanban
รับเรื่อง → กำลังดำเนินการ → รอตรวจ → เสร็จสิ้น
Facility Issues
อาคาร/พื้นที่ | ปัญหา | ความเร่งด่วน | ผู้รับผิดชอบ | สถานะ
5.7 Teacher Dashboard
Objective

ให้ครูเห็นเฉพาะงานที่ตนต้องทำและ AI ที่ช่วยได้ทันที

Cards
งานของฉัน
งานใกล้ครบกำหนด
งานที่ต้องแก้ไข
งานที่ AI ร่างให้แล้ว
หลักฐานที่ต้องส่ง
แผนการสอนล่าสุด
Widgets
My Tasks
งาน | ฝ่าย | วันครบกำหนด | สถานะ | ปุ่มให้ AI ช่วย
Classroom Agent Card
AI ผู้ช่วยครู ป.2
[สร้างใบงาน] [สร้างแผน] [บันทึกหลังสอน] [สรุป PLC]
6. Core Components
6.1 ContextSwitcher
type ContextSwitcherProps = {
  areaOffices: AreaOffice[]
  schools: School[]
  academicYears: AcademicYear[]
  academicTerms: AcademicTerm[]
  selectedAreaId?: string
  selectedSchoolId?: string
  selectedYearId?: string
  selectedTermId?: string
}
6.2 DepartmentStatusCard

แสดง:

Gradient icon bubble
Department name
Main status
3-4 metrics
CTA button
6.3 DutyDashboardSection

ใช้ซ้ำกับ 4 ฝ่าย

6.4 AgentCard

แสดง:

ชื่อ Agent
ฝ่าย/ชั้น
สถานะ
Model
Monthly Budget
Last Run
ปุ่ม Chat / Run Task
6.5 TaskStatusBadge

สถานะและสี:

draft: slate
assigned: blue
in_progress: sky
submitted: violet
ai_review: purple
human_review: amber
needs_revision: orange
approved: emerald
completed: green
overdue: red
cancelled: slate
6.6 EvidenceChecklist

แสดงหลักฐานที่ต้องส่ง

required / optional
uploaded / missing
AI summary available / not available
7. UI States

ทุกหน้า/Component ต้องออกแบบ 5 state

Loading
Empty
Normal
Error
Permission Denied

ตัวอย่าง Empty State:

ยังไม่มีงานในฝ่ายวิชาการ
เริ่มจากการสั่งงานหรือให้ AI ช่วยสร้างแผนงานแรก
[สร้างงานใหม่]
8. Dark Mode Requirements
8.1 Theme Toggle

ต้องมีปุ่มเปลี่ยน theme ที่ Top Bar

ค่า:

light
dark
system
8.2 Dark Mode Design

ห้ามใช้สีดำสนิทล้วนเต็มหน้าจอ ให้ใช้

slate-950
slate-900
indigo-950
violet-950

Card:

bg-slate-900/70
border-slate-800
text-slate-100

Gradient ใน dark mode:

dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950 dark:to-violet-950
9. Tailwind Design Tokens

เพิ่มใน tailwind.config.ts

const config = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        school: {
          purple: "#7C3AED",
          blue: "#2563EB",
          sky: "#38BDF8",
          ink: "#0F172A",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        glow: "0 0 40px rgba(124, 58, 237, 0.18)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
}
export default config
10. Page-Specific Design Briefs
10.1 /school/dashboard

Layout:

Hero
Metric Cards 6 ใบ
4-Division Cards
Charts
Recent Tasks
Approval Queue
10.2 /school/command-center

Design:

Left: Natural language command box
Right: AI task breakdown preview
Bottom: Approval route + evidence checklist

Command Box Placeholder:

พิมพ์คำสั่ง เช่น “ให้ทุกชั้นจัดทำแผนพัฒนาการอ่าน 1 เดือน”
10.3 /departments/academic

Design:

Header with violet-blue gradient
Academic metrics
Classroom matrix
Lesson plan review queue
PLC action queue
Agent shortcuts
10.4 /departments/budget

Design:

Blue-cyan gradient
Budget metrics
Budget request table
Procurement checklist
Evidence missing list
10.5 /departments/hr

Design:

Violet-fuchsia gradient
Teacher workload visual
Leave request table
PA portfolio progress
Development record chart
10.6 /departments/general-affairs

Design:

Sky-indigo gradient
Admin document queue
Facility issue board
Student affairs cases
Nutrition/health widgets
PR activity list
10.7 /teacher/workbench

Design:

Simple and friendly
Less chart, more action
Big “Ask Classroom Agent” card
My tasks
My evidence
My lesson drafts
11. Accessibility
Contrast ต้องผ่าน WCAG AA
ใช้ focus-visible
ปุ่มต้องมี text หรือ aria-label
สีสถานะต้องมี text label ไม่ใช้สีอย่างเดียว
Font size body อย่างน้อย 14px
รองรับ keyboard navigation
Table ต้อง responsive
12. Responsive Design
Desktop
Sidebar คงที่
Dashboard 3-4 columns
Charts full width
Tablet
Sidebar ย่อเป็น icon
Dashboard 2 columns
Mobile
Bottom nav หรือ drawer
Cards 1 column
Tables กลายเป็น card list
Command Center ใช้ stacked layout
13. Mock Data Required

Claude Design ควรสร้าง mock data สำหรับ

1 เขตพื้นที่
3 โรงเรียน
4 ฝ่าย
11 classroom agents
5 deputy agents
20 tasks
8 evidence files
6 approval items
5 teachers
14. Deliverables for Claude Design

ให้ Claude Design สร้าง

Design System Tokens
App Shell
Context Switcher
Director Dashboard
Area Dashboard
Department Dashboard 4 ฝ่าย
Teacher Dashboard
Command Center Page
Task Board Page
Agent Room Page
Evidence Center Page
Dark Mode / Light Mode
Responsive states
Component library examples
15. Claude Design Prompt
You are a senior product designer and frontend architect.

Design a modern school administration AI command center web application using Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

The system supports multiple education area offices, multiple schools, multiple academic years, and multiple academic terms.

The product is called “School AI Agent Command Center”.

Core concept:
- A school director can command and monitor work.
- AI Director Assistant coordinates tasks.
- Four Deputy AI Agents manage the 4 school administration divisions:
  1. Academic
  2. Budget
  3. Human Resource
  4. General Affairs
- Classroom AI Agents support teachers from Kindergarten 2 to Grade 9.
- Dashboards must be separated by responsibility and duty.

Visual style:
- Use Tailwind CSS.
- Use a purple-blue-white gradient theme.
- Support dark mode and light mode.
- Modern, clean, trustworthy, academic, warm.
- Use rounded-2xl cards, soft shadows, subtle glass-like surfaces.
- Avoid clutter.
- The UI must feel like a calm school command center, not a noisy enterprise dashboard.

Required pages:
1. App Shell with sidebar and top context switcher
2. Area Office Dashboard
3. School Director Dashboard
4. Academic Department Dashboard
5. Budget Department Dashboard
6. HR Department Dashboard
7. General Affairs Department Dashboard
8. Teacher Workbench
9. Command Center
10. Task Board
11. AI Agent Room
12. Evidence Center
13. Reports page
14. Settings page

Top bar must include:
- Area Office switcher
- School switcher
- Academic Year switcher
- Academic Term switcher
- Role switcher
- Search
- Notifications
- Dark/light mode toggle
- User menu

Dashboard requirements:
- Area Office dashboard: compare multiple schools.
- School Director dashboard: show 4-division overview.
- Department dashboards: show workload and evidence by duty.
- Teacher dashboard: show only my tasks and classroom AI tools.

Use mock data:
- 1 education area office
- 3 schools
- 4 departments
- 11 classroom agents
- 5 executive/deputy agents
- 20 tasks
- 8 evidence files
- 6 approval items

Create reusable components:
- ContextSwitcher
- DepartmentStatusCard
- DutyDashboardSection
- AgentCard
- TaskStatusBadge
- EvidenceChecklist
- ApprovalQueue
- MetricCard
- GradientHero
- ResponsiveDataTable

Output:
- High-fidelity UI implementation
- Tailwind class names included
- Components organized cleanly
- Dark mode and light mode fully supported
- Responsive design for desktop, tablet, and mobile
16. Acceptance Criteria

Claude Design output ถือว่าผ่านเมื่อ

มี UI ครบทุก Dashboard ตามบทบาท
Dashboard แยกตามภาระหน้าที่ 4 ฝ่ายชัดเจน
มีตัวเลือกเขตพื้นที่/โรงเรียน/ปีการศึกษา/ภาคเรียน
ใช้ Tailwind CSS จริง
โทนสีหลักเป็นม่วง ฟ้า ขาว
มี dark mode และ light mode
Responsive
มี component reusable
มี mock data หลายโรงเรียน
ผู้ใช้เข้าใจทันทีว่างานใดอยู่ฝ่ายใด ใครรับผิดชอบ และสถานะเป็นอย่างไร
17. Final Design Formula
Multi-school context switcher
+ 4-duty dashboards
+ Purple-blue-white gradient
+ Dark/light mode
+ AI Agent cards
+ Task/evidence visibility
= UI ที่ผู้บริหารใช้คุมภาพรวมได้ ครูใช้แล้วไม่กลัว และระบบพร้อมขยายระดับเขตพื้นที่

"""

(base / "database-school-agent-v2-multitenant.md").write_text(db_v2_md, encoding="utf-8")
(base / "migration-v2-multischool-multiyear.sql").write_text(migration_sql, encoding="utf-8")
(base / "prd-claude-design-teacher-agent-ui.md").write_text(design_prd, encoding="utf-8")

print("created:")
print(base / "database-school-agent-v2-multitenant.md")
print(base / "migration-v2-multischool-multiyear.sql")
print(base / "prd-claude-design-teacher-agent-ui.md")

STDOUT/STDERR
created:
/mnt/data/database-school-agent-v2-multitenant.md
/mnt/data/migration-v2-multischool-multiyear.sql
/mnt/data/prd-claude-design-teacher-agent-ui.md


ดำเนินการต่อและสร้างไฟล์เรียบร้อยแล้วครับครูใหญ่

ไฟล์ที่ได้
ดาวน์โหลด database-school-agent-v2-multitenant.md
เอกสารออกแบบฐานข้อมูล V2 สำหรับ หลายโรงเรียน หลายเขตพื้นที่ หลายปีการศึกษา/ภาคเรียน
ดาวน์โหลด migration-v2-multischool-multiyear.sql
SQL migration สำหรับอัปเกรด schema เดิมให้รองรับ multi-school / multi-area / multi-year
ดาวน์โหลด prd-claude-design-teacher-agent-ui.md
PRD handoff สำหรับ Claude Design ใช้ Tailwind CSS, โทนม่วง-ฟ้า-ขาว, รองรับ dark/light mode และ Dashboard แยกตามภาระหน้าที่
สิ่งที่เพิ่มจากเวอร์ชันเดิม
เพิ่ม education_area_offices สำหรับเขตพื้นที่
เพิ่ม school_networks สำหรับกลุ่มโรงเรียน
เพิ่ม persons เพื่อแยกตัวบุคคลออกจากบัญชีผู้ใช้
เพิ่ม user_school_memberships เพื่อให้คนเดียวมีหลายบทบาท หลายโรงเรียน หลายปีการศึกษาได้
เพิ่ม user_area_assignments สำหรับบทบาทระดับเขตพื้นที่
เพิ่ม academic_terms สำหรับภาคเรียน
เพิ่ม agent_scope_assignments เพื่อกำหนดขอบเขตของ AI Agent
เพิ่ม dashboard_layouts เพื่อรองรับ Dashboard ตามบทบาท

จุดที่ผมตั้งใจแก้ให้สำคัญที่สุดคือ ไม่ผูก users กับโรงเรียนเดียวแบบตายตัว เพราะถ้าระบบโตไปถึงหลายโรงเรียน/หลายเขต จะติดเพดานทันที เหมือนสร้างอาคารสามชั้นแต่ลงเสาเข็มบ้านชั้นเดียวครับ 😄 

ผมต้องการให้เพิ่มการ Reflex ผลการการเรียนรู้ของคุณครูเพื่อบันทึกลงไปทุกวันเปิดโอกาสให้แนบคลิปสั้นหรือรูปภาพไฟล์ PDF หรือไม่แนบก็ได้โดยผลการ Reflex ของคุณครูจะเก็บไปรวมเป็นไฟล์เอสเออาร์ของโรงเรียนในท้ายปีการศึกษาด้วย

ผมจะเพิ่มเป็นโมดูล “Daily Teacher Reflection” ให้เข้ากับระบบเดิม ไม่ใช่แค่ช่องบันทึกธรรมดา แต่เป็นหลักฐานรายวันที่รวมเป็นคลัง SAR ตอนสิ้นปีได้ครับ

แนวคิดสำคัญคือ Reflection รายวันต้องเบา ครูกรอกได้ใน 3–5 นาที และ AI ช่วยสรุป/จัดหมวดตามมาตรฐาน SAR ภายหลัง ไม่ใช่บังคับครูเขียนเรียงความทุกวัน—เดี๋ยว AI ยังไม่ทันช่วย ครูลาออกก่อนครับ 😄

Thought for 25s
Analyzed
from pathlib import Path

base = Path("/mnt/data")
base.mkdir(parents=True, exist_ok=True)

prd_reflection = """# PRD Addendum: Daily Teacher Reflection & SAR Evidence Collector

**File:** `prd-addendum-daily-teacher-reflection-sar.md`  
**Version:** 1.0  
**Related System:** School AI Agent Command Center / Teacher Agent System  
**Purpose:** เพิ่มระบบบันทึก Reflex/Reflection ผลการจัดการเรียนรู้ของครูรายวัน พร้อมแนบหลักฐาน และรวบรวมเป็นข้อมูลสนับสนุน SAR โรงเรียนท้ายปีการศึกษา

---

## 1. แนวคิดหลัก

เพิ่มโมดูล **Daily Teacher Reflection** หรือ **บันทึกสะท้อนผลการเรียนรู้รายวันของครู** เพื่อให้ครูบันทึกผลหลังจัดการเรียนรู้แบบสั้น กระชับ และใช้เป็นหลักฐานสะสมตลอดปีการศึกษา

ระบบต้องรองรับการแนบหลักฐานได้หลายแบบ:

1. คลิปวิดีโอสั้น
2. รูปภาพ
3. ไฟล์ PDF
4. ไฟล์เอกสารอื่น
5. ไม่แนบไฟล์ก็ได้

ข้อมูล Reflection รายวันจะถูกนำไปจัดหมวด สรุป วิเคราะห์ และเชื่อมโยงกับ

- แผนการสอน
- ห้องเรียน
- รายวิชา
- กิจกรรมการเรียนรู้
- PLC
- หลักฐาน SAR
- Dashboard ผู้บริหาร
- รายงานท้ายปีการศึกษา

---

## 2. Product Goal

1. ให้ครูบันทึกผลหลังสอนได้ง่ายภายใน 3–5 นาที
2. ให้ AI ช่วยสรุป Reflection เป็นภาษาวิชาการ
3. ให้ AI ช่วยจัดหมวด Reflection เข้ากับมาตรฐาน/ประเด็น SAR
4. สะสมหลักฐานตลอดปีการศึกษาโดยไม่ต้องไล่หาเอกสารท้ายปี
5. ช่วยผู้บริหารเห็นภาพรวมคุณภาพการจัดการเรียนรู้จริงจากชั้นเรียน
6. ใช้ Reflection เป็นข้อมูลตั้งต้นสำหรับ PLC และการนิเทศภายใน
7. ลดภาระการเขียน SAR ช่วงท้ายปี

---

## 3. User Roles

### 3.1 Teacher

ครูสามารถ

- บันทึก Reflection รายวัน
- เลือกชั้นเรียน/รายวิชา/คาบเรียน
- แนบรูป/คลิป/PDF หรือไม่แนบก็ได้
- ให้ AI ช่วยปรับภาษาสรุป
- ส่งบันทึกเป็นหลักฐาน
- ดูประวัติ Reflection ของตนเอง
- ค้น Reflection ย้อนหลัง

### 3.2 Deputy Academic / Academic Lead

ฝ่ายวิชาการสามารถ

- ดู Reflection ตามชั้นเรียน
- ดู Reflection ตามกลุ่มสาระ/รายวิชา
- ดูประเด็นปัญหาการเรียนรู้ที่เกิดซ้ำ
- เลือก Reflection ไปใช้เป็นประเด็น PLC
- ตรวจคุณภาพ Reflection เบื้องต้น
- ใช้เป็นข้อมูลนิเทศภายใน

### 3.3 Director

ผู้อำนวยการสามารถ

- ดู Dashboard ภาพรวม Reflection ทั้งโรงเรียน
- เห็นจำนวน Reflection ต่อวัน/สัปดาห์/เดือน
- เห็นห้องเรียนที่มีหลักฐานต่อเนื่อง
- เห็นประเด็นเด่น/ประเด็นต้องพัฒนา
- เห็น SAR Evidence Readiness
- สั่งให้ AI สรุปเป็นรายงานรายเดือน/รายภาคเรียน/รายปี

### 3.4 SAR / QA Agent

AI Agent ด้านประกันคุณภาพสามารถ

- อ่าน Reflection ที่ได้รับอนุญาต
- จัดหมวดตามมาตรฐาน SAR
- สรุปประเด็นเชิงคุณภาพ
- คัดเลือกหลักฐานเด่น
- เสนอข้อความร่างสำหรับรายงาน SAR
- สร้าง Evidence Index ท้ายปี

---

## 4. Reflection Data Model Concept

Reflection 1 รายการควรตอบคำถามหลัก 6 ข้อ

1. วันนี้จัดการเรียนรู้อะไร
2. นักเรียนเรียนรู้หรือแสดงพฤติกรรมอย่างไร
3. สิ่งที่สำเร็จคืออะไร
4. ปัญหาหรืออุปสรรคคืออะไร
5. ครูจะปรับปรุงอย่างไรในครั้งต่อไป
6. มีหลักฐานประกอบหรือไม่

---

## 5. Reflection Form

### 5.1 Required Fields

- วันที่สอน
- ครูผู้บันทึก
- ชั้นเรียน
- รายวิชา/กิจกรรม
- หัวข้อ/หน่วยการเรียนรู้
- ผลการสะท้อนสั้น ๆ
- สถานะบันทึก

### 5.2 Optional Fields

- คาบเรียน
- แผนการสอนที่เกี่ยวข้อง
- จำนวนนักเรียน
- เป้าหมายการเรียนรู้
- สิ่งที่นักเรียนทำได้ดี
- ปัญหาที่พบ
- แนวทางปรับปรุง
- ความต้องการสนับสนุน
- แนบรูปภาพ
- แนบคลิปสั้น
- แนบ PDF
- แนบไฟล์อื่น
- เชื่อมกับ PLC
- เชื่อมกับ SAR Standard

---

## 6. Attachment Policy

### 6.1 Supported Files

| Type | Examples | Max Size Recommendation |
|---|---|---|
| Image | jpg, jpeg, png, webp | 10 MB |
| Video Clip | mp4, mov, webm | 100 MB |
| PDF | pdf | 25 MB |
| Document | docx, xlsx, pptx | 25 MB |

### 6.2 Video Policy

วิดีโอควรเป็นคลิปสั้น เช่น

- บรรยากาศกิจกรรม
- ชิ้นงานนักเรียน
- การนำเสนอ
- การทดลอง
- กิจกรรมจิตศึกษา
- กิจกรรม Active Learning

ระบบควรมีข้อความเตือนก่อนอัปโหลด:

```text
โปรดหลีกเลี่ยงการเผยแพร่ข้อมูลส่วนบุคคลของนักเรียนโดยไม่จำเป็น และตรวจสอบความเหมาะสมก่อนใช้เป็นหลักฐานสาธารณะ
6.3 Attachment Optional

ครูสามารถบันทึก Reflection ได้แม้ไม่แนบไฟล์ เพื่อไม่ให้ระบบกลายเป็นภาระ

7. AI Assistance
7.1 AI ช่วยครูได้
ปรับภาษาบันทึกให้เป็นทางการขึ้น
สรุป Reflection แบบสั้น
แนะนำแนวทางปรับการสอนครั้งต่อไป
สร้างประเด็น PLC จาก Reflection
แนะนำหลักฐานที่ควรแนบ
จัดหมวดตามฝ่ายวิชาการ/SAR
สร้าง tag อัตโนมัติ เช่น อ่านออกเขียนได้, Active Learning, จิตศึกษา, ทักษะชีวิต
7.2 AI ห้ามทำ
สร้างเหตุการณ์การสอนที่ไม่ได้เกิดขึ้น
ตีตรานักเรียน
สรุปข้อมูลอ่อนไหวแบบเปิดเผย
ใช้ภาพ/คลิปนักเรียนเพื่อเผยแพร่โดยไม่มีมนุษย์อนุมัติ
ตัดสินคุณภาพครูแทนผู้บริหาร
8. SAR Integration
8.1 SAR Evidence Pipeline
Daily Teacher Reflection
        ↓
AI Summary
        ↓
SAR Tagging
        ↓
Evidence Mapping
        ↓
Monthly Academic Summary
        ↓
Semester QA Review
        ↓
Annual SAR Evidence Package
8.2 SAR Mapping Fields

Reflection ควรเชื่อมกับ

มาตรฐานการศึกษาของสถานศึกษา
ประเด็นพิจารณา
โครงการ/กิจกรรม
ฝ่ายที่เกี่ยวข้อง
ห้องเรียน/ระดับชั้น
ผลลัพธ์ของผู้เรียน
หลักฐานประกอบ
8.3 SAR Evidence Status

สถานะหลักฐาน:

raw_reflection
ai_summarized
teacher_confirmed
academic_reviewed
sar_candidate
sar_selected
sar_exported
8.4 Annual SAR Export

ปลายปีระบบต้อง Export ได้

SAR Evidence Index
Reflection Summary by Standard
Reflection Summary by Grade Level
Reflection Summary by Department
Selected Evidence Attachments
AI Draft Paragraphs for SAR
Monthly/Term Reflection Report
9. Dashboard Requirements
9.1 Teacher Dashboard

เพิ่ม widget:

Daily Reflection Today

แสดง

วันนี้บันทึกแล้วหรือยัง
ปุ่ม “บันทึก Reflection”
ปุ่ม “ให้ AI ช่วยสรุป”
Reflection ล่าสุด
หลักฐานที่แนบล่าสุด
9.2 Academic Dashboard

เพิ่ม widget:

Reflection Learning Insights

แสดง

จำนวน Reflection เดือนนี้
ชั้นที่บันทึกต่อเนื่อง
ประเด็นปัญหาที่พบซ้ำ
กิจกรรมที่เป็นตัวอย่างดี
Reflection ที่ควรนำเข้า PLC
Reflection ที่เป็นหลักฐาน SAR Candidate
9.3 Director Dashboard

เพิ่ม widget:

SAR Evidence Readiness

แสดง

Reflection ทั้งปี
Reflection ที่ AI สรุปแล้ว
Reflection ที่ผ่านการตรวจวิชาการ
Reflection ที่เลือกเป็น SAR Candidate
มาตรฐานใดมีหลักฐานน้อย
ครู/ชั้นเรียนที่ต้องสนับสนุน
10. UI Flow
10.1 Quick Daily Reflection
Teacher Dashboard
→ กด “บันทึก Reflection วันนี้”
→ เลือกชั้น/รายวิชา
→ พิมพ์บันทึกสั้น ๆ
→ แนบไฟล์หรือไม่แนบก็ได้
→ กด “ให้ AI ช่วยสรุป”
→ ครูตรวจ/แก้
→ บันทึก
10.2 Reflection to PLC
Reflection หลายรายการพบปัญหาคล้ายกัน
→ Academic Agent สรุปประเด็น
→ เสนอเข้าวาระ PLC
→ สร้าง PLC Session
→ ผูก Reflection เป็นหลักฐาน
10.3 Reflection to SAR
Reflection ทั้งปี
→ QA/SAR Agent จัดหมวด
→ Deputy Academic ตรวจ
→ Director เลือกใช้
→ Export Evidence Package
11. Required Pages

เพิ่มหน้าใหม่

/teacher/reflections
/teacher/reflections/new
/teacher/reflections/:id
/departments/academic/reflections
/school/sar-evidence
/school/sar-evidence/reflections
12. Required Components
DailyReflectionCard
ReflectionQuickForm
ReflectionAttachmentUploader
ReflectionAISummaryPanel
ReflectionTimeline
ReflectionSARMappingPanel
SAREvidenceReadinessCard
ReflectionInsightCloud
ReflectionToPLCButton
ReflectionExportPanel
13. Acceptance Criteria

ระบบถือว่าผ่านเมื่อ

ครูบันทึก Reflection รายวันได้
ครูแนบรูป/คลิป/PDF หรือไม่แนบก็ได้
AI ช่วยสรุป Reflection ได้
ครูต้องตรวจ/ยืนยันก่อนบันทึกเป็นหลักฐาน
Reflection เชื่อมกับชั้นเรียน รายวิชา ปีการศึกษา และภาคเรียนได้
Reflection เชื่อมกับ Evidence Center ได้
Reflection ถูกจัด tag เพื่อใช้ใน SAR ได้
ฝ่ายวิชาการดูภาพรวม Reflection ได้
ผอ. ดู SAR Evidence Readiness ได้
ปลายปี Export Reflection Summary เพื่อประกอบ SAR ได้
14. Database Impact Summary

เพิ่มตารางหลัก:

teacher_daily_reflections
reflection_attachments
reflection_ai_summaries
reflection_sar_mappings
sar_evidence_packages
sar_evidence_items

ปรับตารางเดิม:

evidence_files
tasks
lesson_plans
plc_sessions

โดยควรให้ teacher_daily_reflections เชื่อมกับ evidence_files ได้ เพื่อใช้หลักฐานร่วมกันทั้งระบบ

15. Final Formula
Daily Teacher Reflection
+ Optional Media Evidence
+ AI Summary
+ SAR Tagging
+ Academic Review
+ Annual Evidence Export
= SAR ที่เกิดจากชีวิตจริงในห้องเรียน ไม่ใช่การไล่หาไฟล์ตอนปลายปี

"""

migration_v3 = """-- ============================================================
-- Migration V3: Daily Teacher Reflection & SAR Evidence Collector
-- Target: Existing school_agent_db V2
-- DB: MariaDB 11.x
-- ============================================================

USE school_agent_db;

-- ============================================================
-- 1. DAILY TEACHER REFLECTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS teacher_daily_reflections (
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
period_label VARCHAR(100) NULL,
subject_name VARCHAR(255) NULL,
activity_title VARCHAR(500) NULL,
learning_objective TEXT NULL,

reflection_text LONGTEXT NOT NULL,
what_worked TEXT NULL,
learner_response TEXT NULL,
problem_found TEXT NULL,
next_improvement TEXT NULL,
support_needed TEXT NULL,

student_count INT NULL,
absent_count INT NULL,

ai_summary TEXT NULL,
ai_tags JSON NULL,
ai_sar_suggestions JSON NULL,
teacher_confirmed_summary TINYINT(1) NOT NULL DEFAULT 0,

reflection_status VARCHAR(50) NOT NULL DEFAULT 'draft',
sar_evidence_status VARCHAR(50) NOT NULL DEFAULT 'raw_reflection',
privacy_level VARCHAR(50) NOT NULL DEFAULT 'internal',
quality_review_status VARCHAR(50) NOT NULL DEFAULT 'not_reviewed',

reviewed_by_user_id CHAR(36) NULL,
reviewed_at DATETIME NULL,
submitted_at DATETIME NULL,

created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at DATETIME NULL,

CONSTRAINT fk_reflections_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_reflections_area FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
CONSTRAINT fk_reflections_network FOREIGN KEY (school_network_id) REFERENCES school_networks(id),
CONSTRAINT fk_reflections_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
CONSTRAINT fk_reflections_term FOREIGN KEY (academic_term_id) REFERENCES academic_terms(id),
CONSTRAINT fk_reflections_department FOREIGN KEY (department_id) REFERENCES departments(id),
CONSTRAINT fk_reflections_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
CONSTRAINT fk_reflections_lesson_plan FOREIGN KEY (lesson_plan_id) REFERENCES lesson_plans(id),
CONSTRAINT fk_reflections_task FOREIGN KEY (task_id) REFERENCES tasks(id),
CONSTRAINT fk_reflections_teacher_user FOREIGN KEY (teacher_user_id) REFERENCES users(id),
CONSTRAINT fk_reflections_teacher_person FOREIGN KEY (teacher_person_id) REFERENCES persons(id),
CONSTRAINT fk_reflections_reviewed_by FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id),

KEY idx_reflections_school_date (school_id, reflection_date),
KEY idx_reflections_teacher_date (teacher_user_id, reflection_date),
KEY idx_reflections_classroom_date (classroom_id, reflection_date),
KEY idx_reflections_year_term_status (academic_year_id, academic_term_id, reflection_status),
KEY idx_reflections_sar_status (school_id, academic_year_id, sar_evidence_status),
FULLTEXT KEY ft_reflections_text (reflection_text, ai_summary, what_worked, problem_found, next_improvement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. REFLECTION ATTACHMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS reflection_attachments (
id CHAR(36) PRIMARY KEY,
reflection_id CHAR(36) NOT NULL,
evidence_file_id CHAR(36) NULL,

attachment_type VARCHAR(50) NOT NULL,
title VARCHAR(500) NULL,
file_url TEXT NOT NULL,
file_name VARCHAR(500) NULL,
mime_type VARCHAR(255) NULL,
file_size_bytes BIGINT NULL,
duration_seconds INT NULL,

ai_description TEXT NULL,
privacy_checked TINYINT(1) NOT NULL DEFAULT 0,
include_in_sar TINYINT(1) NOT NULL DEFAULT 0,

uploaded_by_user_id CHAR(36) NOT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
deleted_at DATETIME NULL,

CONSTRAINT fk_reflection_attachments_reflection FOREIGN KEY (reflection_id) REFERENCES teacher_daily_reflections(id),
CONSTRAINT fk_reflection_attachments_evidence FOREIGN KEY (evidence_file_id) REFERENCES evidence_files(id),
CONSTRAINT fk_reflection_attachments_uploaded_by FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id),

KEY idx_reflection_attachments_reflection (reflection_id),
KEY idx_reflection_attachments_evidence (evidence_file_id),
KEY idx_reflection_attachments_type (attachment_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. AI SUMMARIES FOR REFLECTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS reflection_ai_summaries (
id CHAR(36) PRIMARY KEY,
reflection_id CHAR(36) NOT NULL,
agent_id CHAR(36) NULL,
ai_run_log_id CHAR(36) NULL,
summary_type VARCHAR(100) NOT NULL DEFAULT 'teacher_reflection_summary',

original_text_hash VARCHAR(255) NULL,
summary_text TEXT NOT NULL,
suggested_tags JSON NULL,
suggested_sar_mapping JSON NULL,
suggested_next_actions JSON NULL,
risk_level VARCHAR(50) NOT NULL DEFAULT 'low',

teacher_confirmed TINYINT(1) NOT NULL DEFAULT 0,
confirmed_by_user_id CHAR(36) NULL,
confirmed_at DATETIME NULL,

created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_reflection_ai_summary_reflection FOREIGN KEY (reflection_id) REFERENCES teacher_daily_reflections(id),
CONSTRAINT fk_reflection_ai_summary_agent FOREIGN KEY (agent_id) REFERENCES agents(id),
CONSTRAINT fk_reflection_ai_summary_run FOREIGN KEY (ai_run_log_id) REFERENCES ai_run_logs(id),
CONSTRAINT fk_reflection_ai_summary_confirmed_by FOREIGN KEY (confirmed_by_user_id) REFERENCES users(id),

KEY idx_reflection_ai_summary_reflection (reflection_id),
KEY idx_reflection_ai_summary_agent (agent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. SAR STANDARDS AND MAPPING
-- ============================================================

CREATE TABLE IF NOT EXISTS sar_standards (
id CHAR(36) PRIMARY KEY,
school_id CHAR(36) NOT NULL,
academic_year_id CHAR(36) NOT NULL,
code VARCHAR(100) NOT NULL,
name VARCHAR(500) NOT NULL,
education_level VARCHAR(100) NULL,
description TEXT NULL,
sort_order INT NOT NULL DEFAULT 0,
is_active TINYINT(1) NOT NULL DEFAULT 1,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

CONSTRAINT fk_sar_standards_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_sar_standards_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),

UNIQUE KEY uq_sar_standard_school_year_code (school_id, academic_year_id, code),
KEY idx_sar_standards_school_year (school_id, academic_year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sar_indicators (
id CHAR(36) PRIMARY KEY,
sar_standard_id CHAR(36) NOT NULL,
code VARCHAR(100) NOT NULL,
name VARCHAR(500) NOT NULL,
description TEXT NULL,
sort_order INT NOT NULL DEFAULT 0,
is_active TINYINT(1) NOT NULL DEFAULT 1,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

CONSTRAINT fk_sar_indicators_standard FOREIGN KEY (sar_standard_id) REFERENCES sar_standards(id),

UNIQUE KEY uq_sar_indicator_standard_code (sar_standard_id, code),
KEY idx_sar_indicators_standard (sar_standard_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reflection_sar_mappings (
id CHAR(36) PRIMARY KEY,
reflection_id CHAR(36) NOT NULL,
sar_standard_id CHAR(36) NULL,
sar_indicator_id CHAR(36) NULL,

mapping_source VARCHAR(50) NOT NULL DEFAULT 'ai',
confidence_score DECIMAL(5,2) NULL,
rationale TEXT NULL,
status VARCHAR(50) NOT NULL DEFAULT 'suggested',

reviewed_by_user_id CHAR(36) NULL,
reviewed_at DATETIME NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_reflection_sar_mapping_reflection FOREIGN KEY (reflection_id) REFERENCES teacher_daily_reflections(id),
CONSTRAINT fk_reflection_sar_mapping_standard FOREIGN KEY (sar_standard_id) REFERENCES sar_standards(id),
CONSTRAINT fk_reflection_sar_mapping_indicator FOREIGN KEY (sar_indicator_id) REFERENCES sar_indicators(id),
CONSTRAINT fk_reflection_sar_mapping_reviewed_by FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id),

KEY idx_reflection_sar_mapping_reflection (reflection_id),
KEY idx_reflection_sar_mapping_standard (sar_standard_id),
KEY idx_reflection_sar_mapping_indicator (sar_indicator_id),
KEY idx_reflection_sar_mapping_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. SAR EVIDENCE PACKAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS sar_evidence_packages (
id CHAR(36) PRIMARY KEY,
school_id CHAR(36) NOT NULL,
academic_year_id CHAR(36) NOT NULL,
created_by_user_id CHAR(36) NOT NULL,

title VARCHAR(500) NOT NULL,
package_type VARCHAR(100) NOT NULL DEFAULT 'annual_sar',
education_level VARCHAR(100) NULL,
status VARCHAR(50) NOT NULL DEFAULT 'draft',

ai_summary LONGTEXT NULL,
human_summary LONGTEXT NULL,
exported_file_url TEXT NULL,
exported_at DATETIME NULL,

created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

CONSTRAINT fk_sar_packages_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_sar_packages_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
CONSTRAINT fk_sar_packages_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id),

KEY idx_sar_packages_school_year (school_id, academic_year_id),
KEY idx_sar_packages_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sar_evidence_items (
id CHAR(36) PRIMARY KEY,
package_id CHAR(36) NOT NULL,
reflection_id CHAR(36) NULL,
evidence_file_id CHAR(36) NULL,
sar_standard_id CHAR(36) NULL,
sar_indicator_id CHAR(36) NULL,

title VARCHAR(500) NOT NULL,
evidence_type VARCHAR(100) NOT NULL DEFAULT 'reflection',
summary TEXT NULL,
sort_order INT NOT NULL DEFAULT 0,
include_attachment TINYINT(1) NOT NULL DEFAULT 1,

selected_by_user_id CHAR(36) NULL,
selected_at DATETIME NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_sar_items_package FOREIGN KEY (package_id) REFERENCES sar_evidence_packages(id),
CONSTRAINT fk_sar_items_reflection FOREIGN KEY (reflection_id) REFERENCES teacher_daily_reflections(id),
CONSTRAINT fk_sar_items_evidence FOREIGN KEY (evidence_file_id) REFERENCES evidence_files(id),
CONSTRAINT fk_sar_items_standard FOREIGN KEY (sar_standard_id) REFERENCES sar_standards(id),
CONSTRAINT fk_sar_items_indicator FOREIGN KEY (sar_indicator_id) REFERENCES sar_indicators(id),
CONSTRAINT fk_sar_items_selected_by FOREIGN KEY (selected_by_user_id) REFERENCES users(id),

KEY idx_sar_items_package (package_id),
KEY idx_sar_items_reflection (reflection_id),
KEY idx_sar_items_standard (sar_standard_id, sar_indicator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. OPTIONAL COLUMNS FOR EVIDENCE_FILES
-- ============================================================

ALTER TABLE evidence_files
ADD COLUMN IF NOT EXISTS source_type VARCHAR(100) NULL AFTER visibility,
ADD COLUMN IF NOT EXISTS source_id CHAR(36) NULL AFTER source_type,
ADD COLUMN IF NOT EXISTS sar_candidate TINYINT(1) NOT NULL DEFAULT 0 AFTER source_id,
ADD COLUMN IF NOT EXISTS sar_selected TINYINT(1) NOT NULL DEFAULT 0 AFTER sar_candidate,
ADD KEY IF NOT EXISTS idx_evidence_source (source_type, source_id),
ADD KEY IF NOT EXISTS idx_evidence_sar_candidate (school_id, sar_candidate, sar_selected);

-- ============================================================
-- 7. VIEWS
-- ============================================================

CREATE OR REPLACE VIEW v_reflection_daily_status AS
SELECT
r.school_id,
r.academic_year_id,
r.academic_term_id,
r.classroom_id,
r.teacher_user_id,
r.reflection_date,
COUNT(*) AS reflection_count,
SUM(CASE WHEN r.reflection_status IN ('submitted','reviewed','approved') THEN 1 ELSE 0 END) AS submitted_count,
SUM(CASE WHEN r.sar_evidence_status IN ('sar_candidate','sar_selected','sar_exported') THEN 1 ELSE 0 END) AS sar_candidate_count
FROM teacher_daily_reflections r
WHERE r.deleted_at IS NULL
GROUP BY
r.school_id,
r.academic_year_id,
r.academic_term_id,
r.classroom_id,
r.teacher_user_id,
r.reflection_date;

CREATE OR REPLACE VIEW v_sar_reflection_readiness AS
SELECT
r.school_id,
r.academic_year_id,
ss.id AS sar_standard_id,
ss.code AS sar_standard_code,
ss.name AS sar_standard_name,
COUNT(DISTINCT r.id) AS reflection_count,
SUM(CASE WHEN r.sar_evidence_status = 'sar_candidate' THEN 1 ELSE 0 END) AS candidate_count,
SUM(CASE WHEN r.sar_evidence_status = 'sar_selected' THEN 1 ELSE 0 END) AS selected_count
FROM sar_standards ss
LEFT JOIN reflection_sar_mappings m ON m.sar_standard_id = ss.id
LEFT JOIN teacher_daily_reflections r ON r.id = m.reflection_id AND r.deleted_at IS NULL
GROUP BY
r.school_id,
r.academic_year_id,
ss.id,
ss.code,
ss.name;

-- ============================================================
-- 8. DEFAULT WORK CATEGORY: DAILY REFLECTION
-- ============================================================

-- Insert this in application seed after resolving school_id and academic department_id.
-- INSERT INTO work_categories (id, school_id, department_id, code, name, description, default_evidence)
-- VALUES (UUID(), @school_id, @academic_department_id, 'daily_teacher_reflection',
-- 'บันทึกสะท้อนผลการเรียนรู้รายวัน',
-- 'บันทึก Reflection หลังจัดการเรียนรู้ของครู เพื่อใช้สะสมเป็นหลักฐาน SAR',
-- JSON_ARRAY('reflection_text', 'optional_image', 'optional_video', 'optional_pdf'));

-- ============================================================
-- End Migration V3
-- ============================================================
"""

design_addendum = """# Claude Design Addendum: Daily Teacher Reflection & SAR Evidence UI

File: prd-claude-design-addendum-daily-reflection.md
Related PRD: prd-claude-design-teacher-agent-ui.md
Theme: Purple / Blue / White Gradient + Dark Mode / Light Mode
Purpose: เพิ่ม UI สำหรับครูบันทึก Reflection รายวัน พร้อมแนบรูป/คลิป/PDF และสะสมเป็นหลักฐาน SAR

1. New Navigation Items

เพิ่มเมนู

Teacher
  - Daily Reflection
  - My Reflection Timeline

Academic
  - Reflection Insights
  - Reflection for PLC

School
  - SAR Evidence
  - SAR Reflection Package
2. New Pages
/teacher/reflections
/teacher/reflections/new
/teacher/reflections/:id

/departments/academic/reflections
/departments/academic/reflections/insights

/school/sar-evidence
/school/sar-evidence/reflections
/school/sar-evidence/packages
3. Teacher Reflection Page
3.1 Page Goal

ให้ครูบันทึก Reflection ได้เร็วที่สุดภายใน 3–5 นาที

3.2 Layout
Header: Daily Reflection
Quick Stats Cards
Reflection Quick Form
Attachment Uploader
AI Summary Panel
Recent Reflection Timeline
3.3 Quick Form Fields
วันที่
ชั้นเรียน
รายวิชา/กิจกรรม
หัวข้อ/หน่วย
Reflection สั้น ๆ
สิ่งที่สำเร็จ
ปัญหาที่พบ
แนวทางปรับครั้งต่อไป
ต้องการความช่วยเหลือหรือไม่
3.4 Attachment Uploader

รองรับ

Image
Short Video
PDF
Other document
No attachment

UI ต้องแสดงข้อความ:

แนบหลักฐานได้ถ้ามี ไม่บังคับแนบทุกครั้ง
4. Reflection AI Summary Panel

แสดงเป็น card ด้านขวา

ปุ่ม:

[ให้ AI ช่วยสรุป]
[ปรับภาษาให้เป็นทางการ]
[เสนอประเด็น PLC]
[จัดหมวด SAR]

AI Output ต้องอยู่ในกล่องสถานะ:

AI Draft — กรุณาตรวจและยืนยันก่อนใช้เป็นหลักฐาน
5. Reflection Timeline

แสดงบันทึกย้อนหลัง

Card แต่ละรายการมี

วันที่
ชั้นเรียน
รายวิชา
summary
attachment badges
SAR status badge
Review status badge

สถานะ SAR:

Raw
AI Summarized
Teacher Confirmed
Academic Reviewed
SAR Candidate
SAR Selected
SAR Exported
6. Academic Reflection Insights

สำหรับฝ่ายวิชาการ

Cards
Reflection เดือนนี้
ครูที่บันทึกต่อเนื่อง
ชั้นเรียนที่มีหลักฐานมาก
ประเด็นปัญหาซ้ำ
SAR Candidate
Reflection ที่ควรเข้า PLC
Widgets
Reflection by Grade
Reflection by Subject
Common Learning Issues
Good Practice Highlights
PLC Candidate List
SAR Candidate List
7. SAR Evidence Page

สำหรับ ผอ./ฝ่ายวิชาการ

Layout
SAR Evidence Readiness Hero
Standard Coverage Cards
Reflection Evidence Table
Selected Evidence Basket
AI SAR Draft Panel
Export Panel
Standard Coverage Card

แสดงแต่ละมาตรฐาน

มาตรฐาน | จำนวน Reflection | หลักฐานเด่น | ยังขาดอะไร | สถานะ
Selected Evidence Basket

ให้เลือก Reflection เข้าแฟ้ม SAR

[ ] ใช้ใน SAR
[ ] แนบรูป/คลิป
[ ] ใช้ข้อความสรุป AI
[ ] ส่งให้ ผอ. ตรวจ
8. Components

สร้าง component เพิ่ม

DailyReflectionCard
ReflectionQuickForm
ReflectionAttachmentUploader
ReflectionAISummaryPanel
ReflectionTimeline
ReflectionStatusBadge
SAREvidenceReadinessCard
SARStandardCoverageCard
ReflectionInsightCloud
ReflectionToPLCButton
ReflectionExportPanel
SelectedEvidenceBasket
9. Visual Style

ใช้ gradient เบา ๆ เพื่อไม่ให้ครูรู้สึกว่ากำลังกรอกระบบประเมินหนัก

Light Mode
bg-gradient-to-br from-violet-50 via-white to-sky-50
Dark Mode
dark:bg-gradient-to-br dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900

Reflection Form Card:

rounded-2xl border border-violet-100 bg-white/80 shadow-soft
dark:border-slate-800 dark:bg-slate-900/70

AI Summary Card:

rounded-2xl border border-sky-200 bg-sky-50/70
dark:border-sky-900 dark:bg-sky-950/30
10. Empty States
Teacher has no reflection today
วันนี้ยังไม่มี Reflection
ใช้เวลาเพียง 3 นาทีเพื่อเก็บหลักฐานการเรียนรู้ของวันนี้
[บันทึก Reflection]
No SAR candidate
ยังไม่มี Reflection ที่ถูกเลือกเป็นหลักฐาน SAR
ให้ AI ช่วยจัดหมวดจาก Reflection ที่บันทึกไว้ได้
[จัดหมวด SAR ด้วย AI]
11. Mobile First Requirement

หน้า Reflection ต้องใช้บนมือถือได้ดี เพราะครูอาจบันทึกหลังสอนทันที

Mobile Layout:

1 column
Big textarea
Attachment button large enough
AI summary collapsible
Save button fixed bottom
12. Acceptance Criteria
ครูสร้าง Reflection ได้จาก Teacher Dashboard
แนบรูป/คลิป/PDF หรือไม่แนบได้
AI Summary แสดงเป็น Draft
มีปุ่มครูยืนยัน Summary
ฝ่ายวิชาการดู Reflection รวมได้
ผอ. ดู SAR Evidence Readiness ได้
Reflection เลือกเข้า SAR Package ได้
UI รองรับ dark/light mode
ใช้โทนม่วง-ฟ้า-ขาว
ใช้งานบนมือถือได้ดี
13. Claude Design Prompt Add-on
Extend the School AI Agent Command Center UI with a Daily Teacher Reflection and SAR Evidence Collector module.

Add pages:
- /teacher/reflections
- /teacher/reflections/new
- /teacher/reflections/:id
- /departments/academic/reflections
- /school/sar-evidence/reflections
- /school/sar-evidence/packages

Design a mobile-friendly daily reflection flow where teachers can record a short reflection after teaching, optionally attach images, short video clips, PDFs, or no attachment, then ask AI to summarize and tag the reflection for SAR evidence.

Use the existing purple-blue-white gradient theme with full dark mode and light mode support.

Important:
- Reflection must feel lightweight, not bureaucratic.
- Attachment is optional.
- AI output must be shown as “AI Draft” and require teacher confirmation.
- Academic dashboard must show reflection insights.
- Director dashboard must show SAR Evidence Readiness.
- SAR evidence page must let users select reflections into an annual SAR package.

"""

write files

(base / "prd-addendum-daily-teacher-reflection-sar.md").write_text(prd_reflection, encoding="utf-8")
(base / "migration-v3-daily-reflection-sar.sql").write_text(migration_v3, encoding="utf-8")
(base / "prd-claude-design-addendum-daily-reflection.md").write_text(design_addendum, encoding="utf-8")

print("created")
print("/mnt/data/prd-addendum-daily-teacher-reflection-sar.md")
print("/mnt/data/migration-v3-daily-reflection-sar.sql")
print("/mnt/data/prd-claude-design-addendum-daily-reflection.md")

STDOUT/STDERR
created
/mnt/data/prd-addendum-daily-teacher-reflection-sar.md
/mnt/data/migration-v3-daily-reflection-sar.sql
/mnt/data/prd-claude-design-addendum-daily-reflection.md


เพิ่มโมดูล Daily Teacher Reflection / Reflex รายวันของครู เรียบร้อยแล้วครับ

ไฟล์ที่สร้างเพิ่ม
ดาวน์โหลด prd-addendum-daily-teacher-reflection-sar.md
PRD Addendum สำหรับเพิ่มระบบบันทึก Reflection รายวันของครู และรวบรวมเป็นหลักฐาน SAR ท้ายปี
ดาวน์โหลด migration-v3-daily-reflection-sar.sql
SQL Migration สำหรับเพิ่มตาราง Reflection, Attachment, AI Summary, SAR Mapping และ SAR Evidence Package
ดาวน์โหลด prd-claude-design-addendum-daily-reflection.md
PRD Handoff เพิ่มเติมสำหรับ Claude Design ให้ออกแบบหน้า Reflection รายวันและ SAR Evidence UI
สิ่งที่เพิ่มเข้าไป

เพิ่มระบบให้ครูบันทึกหลังสอนทุกวันแบบสั้น ๆ ได้ โดยมีหรือไม่มีไฟล์แนบก็ได้

รองรับไฟล์แนบ:

รูปภาพ
คลิปวิดีโอสั้น
PDF
เอกสารอื่น
หรือไม่แนบไฟล์ก็ได้
Flow ใหม่
ครูบันทึก Reflection รายวัน
        ↓
แนบหลักฐานหรือไม่แนบก็ได้
        ↓
AI ช่วยสรุป / จัด tag / เสนอหมวด SAR
        ↓
ครูตรวจและยืนยัน
        ↓
ฝ่ายวิชาการตรวจภาพรวม
        ↓
ระบบเลือก Reflection เป็น SAR Candidate
        ↓
ปลายปีรวมเป็น SAR Evidence Package
ตารางฐานข้อมูลที่เพิ่ม
teacher_daily_reflections
reflection_attachments
reflection_ai_summaries
sar_standards
sar_indicators
reflection_sar_mappings
sar_evidence_packages
sar_evidence_items
Dashboard ที่เพิ่ม

สำหรับครู:

วันนี้บันทึก Reflection แล้วหรือยัง
Reflection ล่าสุด
ปุ่มให้ AI ช่วยสรุป
หลักฐานที่แนบล่าสุด

สำหรับฝ่ายวิชาการ:

จำนวน Reflection รายเดือน
ปัญหาการเรียนรู้ที่พบซ้ำ
Reflection ที่ควรเข้า PLC
Reflection ที่เป็น SAR Candidate

สำหรับ ผอ.:

SAR Evidence Readiness
มาตรฐานใดมีหลักฐานครบ
มาตรฐานใดยังมีหลักฐานน้อย
Reflection ทั้งปี
Reflection ที่เลือกใช้ใน SAR

แก่นของโมดูลนี้คือทำให้ SAR ท้ายปีไม่ใช่ “มหกรรมขุดไฟล์โบราณ” แต่เป็นการสะสมหลักฐานจากชีวิตจริงในห้องเรียนทุกวันครับ 

และผมยังอยากจะเพิ่มฟังก์ชันให้ครูเวรประจำวันได้ลงบันทึกการอยู่เวรประจำวันที่หน้าโรงเรียนการปฏิบัติหน้าที่เวรประจำวันในการช่วยปรนนิบัติสถานที่ในตอนเช้าและการอยู่ประจำวันในการตักอาหารให้นักเรียนรับประทานที่โรงอาหารด้วย
อีกทั้งผมอยากจะเพิ่มฟังก์ชันของเจ้าหน้าที่ติดตามการจัดการเรียนรู้ซึ่งผมแต่งตั้งไว้เป็นพิเศษให้ไปทำหน้าที่ในการบันทึกภาพและคลิปวิดีโอการจัดการเรียนรู้เพื่อส่งเสริมคุณลักษณะทักษะการคิดวิเคราะห์ขั้นสูงด้วยกระบวนการจัดการเรียนรู้ด้วยจิตศึกษาโดยจะบันทึกทุกวันหมุนเวียนเปลี่ยนกันไปสลับฉันไปเรื่อยเรื่อย

ผมจะเพิ่มเป็น 2 โมดูลคู่กันครับ: บันทึกเวรประจำวัน สำหรับภาระงานทั่วไป/โรงอาหาร/หน้าโรงเรียน และ Learning Observation Officer สำหรับผู้ติดตามถ่ายภาพ–คลิปการเรียนรู้เชิงจิตศึกษา/HOTS แบบหมุนเวียนทุกวัน.

Thought for 14s
Analyzed
from pathlib import Path

base = Path("/mnt/data")
base.mkdir(parents=True, exist_ok=True)

prd_v4 = """# PRD Addendum: Daily Duty Log & Learning Observation Officer

**File:** `prd-addendum-duty-log-learning-observation.md`  
**Version:** 1.0  
**Related System:** School AI Agent Command Center / Teacher Agent System  
**Purpose:** เพิ่มฟังก์ชันบันทึกเวรประจำวันของครูเวร และฟังก์ชันเจ้าหน้าที่ติดตามการจัดการเรียนรู้เพื่อบันทึกภาพ/คลิปวิดีโอหลักฐานการเรียนรู้ด้วยจิตศึกษาและทักษะคิดวิเคราะห์ขั้นสูง

---

## 1. Executive Summary

เพิ่ม 2 โมดูลใหม่ในระบบ

1. **Daily Duty Log Module**  
   สำหรับครูเวรประจำวันบันทึกการปฏิบัติหน้าที่ เช่น เวรหน้าโรงเรียน เวรดูแลความเรียบร้อยตอนเช้า เวรช่วยดูแลสถานที่ และเวรตักอาหาร/ดูแลนักเรียนที่โรงอาหาร

2. **Learning Observation Officer Module**  
   สำหรับเจ้าหน้าที่ติดตามการจัดการเรียนรู้ที่ได้รับแต่งตั้งเป็นพิเศษ ให้บันทึกภาพ คลิปวิดีโอ และบันทึกการสังเกตการจัดการเรียนรู้ทุกวัน โดยหมุนเวียนชั้นเรียน/ครู/กิจกรรม เพื่อส่งเสริมคุณลักษณะ ทักษะการคิดวิเคราะห์ขั้นสูง และกระบวนการเรียนรู้ด้วยจิตศึกษา

ทั้งสองโมดูลจะเชื่อมกับ

- Evidence Center
- SAR Evidence Package
- PLC Studio
- Dashboard 4 ฝ่าย
- Teacher Reflection
- AI Summary / AI Tagging
- ระบบบันทึกงานตามภาระหน้าที่

---

## 2. Why This Matters

งานเวรประจำวันและการติดตามการจัดการเรียนรู้เป็น “หลักฐานชีวิตจริงของโรงเรียน” ที่มักเกิดขึ้นทุกวัน แต่ไม่ได้ถูกเก็บอย่างเป็นระบบ

ถ้าระบบเก็บได้ดี จะช่วยให้โรงเรียนมีหลักฐานด้าน

- ความปลอดภัย
- สุขภาวะและโภชนาการ
- กิจการนักเรียน
- บรรยากาศสถานศึกษา
- คุณภาพการจัดการเรียนรู้
- Active Learning
- จิตศึกษา
- ทักษะคิดวิเคราะห์ขั้นสูง
- การนิเทศภายใน
- SAR/ประกันคุณภาพ

---

## 3. Module A: Daily Duty Log

### 3.1 ผู้ใช้หลัก

- ครูเวรประจำวัน
- หัวหน้าฝ่ายบริหารทั่วไป
- ฝ่ายบุคคล
- ผู้อำนวยการ
- เจ้าหน้าที่โภชนาการ/ผู้รับผิดชอบอาหารกลางวัน
- AI ฝ่ายบริหารทั่วไป
- AI ฝ่ายบุคคล

### 3.2 ประเภทเวรที่ต้องรองรับ

```text
front_gate_morning
= เวรหน้าโรงเรียนตอนเช้า

morning_facility_care
= เวรช่วยดูแลสถานที่/ความสะอาด/ความเรียบร้อยตอนเช้า

daily_student_affairs
= เวรประจำวันดูแลนักเรียนทั่วไป

cafeteria_lunch_service
= เวรโรงอาหาร/ตักอาหาร/ดูแลอาหารกลางวัน

milk_service
= เวรอาหารเสริมนม

safety_environment
= เวรความปลอดภัยและสิ่งแวดล้อม

other
= เวรอื่น ๆ
3.3 สิ่งที่ครูเวรบันทึก
Required
วันที่ปฏิบัติหน้าที่
ประเภทเวร
ช่วงเวลา
สถานที่
ผู้ปฏิบัติหน้าที่
สรุปการปฏิบัติงาน
สถานะการส่งบันทึก
Optional
รูปภาพ
คลิปสั้น
PDF/เอกสาร
เหตุการณ์สำคัญ
ปัญหาที่พบ
การแก้ไขเบื้องต้น
ผู้ที่เกี่ยวข้อง
ข้อเสนอแนะ
จำนวนผู้เรียนโดยประมาณที่ดูแล
รายการอาหาร/เมนูที่เกี่ยวข้อง
ความสะอาด/ความปลอดภัย
หมายเหตุสำหรับผู้บริหาร
4. Daily Duty Log Flow
ระบบสร้างตารางเวร
        ↓
ครูเวรได้รับแจ้งเตือน
        ↓
ครูปฏิบัติหน้าที่
        ↓
เปิดหน้า Daily Duty Log
        ↓
เลือกประเภทเวร
        ↓
บันทึกข้อความสั้น ๆ
        ↓
แนบรูป/คลิป/PDF หรือไม่แนบก็ได้
        ↓
AI ช่วยสรุป/จัดหมวด
        ↓
ครูตรวจและยืนยัน
        ↓
ส่งบันทึก
        ↓
หัวหน้าฝ่ายบริหารทั่วไป/ฝ่ายบุคคลตรวจภาพรวม
        ↓
เก็บเข้า Evidence Center และ SAR Candidate ถ้าเหมาะสม
5. Daily Duty Log Dashboard
5.1 Teacher Dashboard

เพิ่ม widget:

เวรของฉันวันนี้

แสดง

วันนี้มีเวรหรือไม่
เวรประเภทใด
ช่วงเวลา
สถานที่
สถานะ: ยังไม่บันทึก / บันทึกแล้ว / ส่งแล้ว / ต้องแก้ไข
ปุ่ม “บันทึกเวรวันนี้”
5.2 General Affairs Dashboard

เพิ่ม widget:

Daily Duty Monitoring

แสดง

ครูเวรวันนี้
เวรหน้าโรงเรียน
เวรโรงอาหาร
เวรสถานที่
บันทึกที่ยังไม่ส่ง
เหตุการณ์ที่ต้องติดตาม
หลักฐานเวรประจำวัน
5.3 HR Dashboard

ใช้ดูภาระงานเวร

จำนวนเวรต่อครู
ความสมดุลของภาระเวร
เวรที่ไม่ได้บันทึก
ประวัติการปฏิบัติหน้าที่
5.4 Director Dashboard

แสดงภาพรวม

เวรครบถ้วนรายวัน
เหตุการณ์สำคัญ
ความปลอดภัยหน้าโรงเรียน
งานโรงอาหาร/โภชนาการ
หลักฐานกิจการนักเรียน/บริหารทั่วไป
6. Module B: Learning Observation Officer
6.1 แนวคิด

เพิ่มบทบาท เจ้าหน้าที่ติดตามการจัดการเรียนรู้ ที่ได้รับแต่งตั้งเป็นพิเศษ เพื่อเข้าไปบันทึกภาพ คลิปวิดีโอ และบันทึกการสังเกตการจัดการเรียนรู้ทุกวัน โดยหมุนเวียนไปตามชั้นเรียน/ครู/กิจกรรม

เน้นหลักฐานด้าน

จิตศึกษา
พัฒนาปัญญาภายใน
Active Learning
Higher Order Thinking Skills
การคิดวิเคราะห์ขั้นสูง
การสื่อสาร
การทำงานร่วมกัน
คุณลักษณะอันพึงประสงค์
สมรรถนะผู้เรียน
บรรยากาศชั้นเรียน
6.2 ผู้ใช้หลัก
เจ้าหน้าที่ติดตามการจัดการเรียนรู้
ครูผู้สอน
หัวหน้าฝ่ายวิชาการ
ผู้อำนวยการ
AI ฝ่ายวิชาการ
QA/SAR Agent
PLC Agent
6.3 วิธีหมุนเวียน

ระบบต้องรองรับการหมุนเวียนได้หลายแบบ

by_classroom
= หมุนเวียนตามชั้นเรียน

by_teacher
= หมุนเวียนตามครูผู้สอน

by_subject
= หมุนเวียนตามรายวิชา/กลุ่มสาระ

by_focus_area
= หมุนเวียนตามประเด็น เช่น จิตศึกษา, HOTS, Active Learning

manual
= ผู้บริหารกำหนดเอง
6.4 Focus Areas

ค่าตั้งต้น

jit_suksa
= จิตศึกษา / พัฒนาปัญญาภายใน

hots
= ทักษะการคิดวิเคราะห์ขั้นสูง

active_learning
= Active Learning

student_agency
= ผู้เรียนมีส่วนร่วมและเป็นเจ้าของการเรียนรู้

collaboration
= การทำงานร่วมกัน

communication
= การสื่อสาร

creativity
= ความคิดสร้างสรรค์

local_context_learning
= การเรียนรู้เชื่อมโยงบริบทท้องถิ่น

assessment_for_learning
= การประเมินเพื่อพัฒนา
7. Learning Observation Flow
ระบบสร้างแผนหมุนเวียนรายวัน
        ↓
แจ้งเจ้าหน้าที่ติดตามการจัดการเรียนรู้
        ↓
เจ้าหน้าที่เข้าห้องเรียน/กิจกรรม
        ↓
บันทึกภาพ/คลิป/บันทึกสั้น
        ↓
เลือก Focus Area
        ↓
AI ช่วยสรุปพฤติกรรมการเรียนรู้
        ↓
AI เสนอ tag: จิตศึกษา / HOTS / Active Learning / สมรรถนะ
        ↓
เจ้าหน้าที่ตรวจและยืนยัน
        ↓
ครูผู้สอนดูและเพิ่ม Reflection ได้
        ↓
ฝ่ายวิชาการนำไปใช้ใน PLC/Nิเทศ/SAR
8. Learning Observation Record
8.1 Required Fields
วันที่สังเกต
เจ้าหน้าที่ผู้บันทึก
ชั้นเรียน
ครูผู้สอน
รายวิชา/กิจกรรม
Focus Area
สรุปสิ่งที่สังเกต
สถานะบันทึก
8.2 Optional Fields
คลิปวิดีโอสั้น
รูปภาพ
PDF/เอกสาร
แผนการสอนที่เกี่ยวข้อง
Reflection ของครูที่เกี่ยวข้อง
ประเด็นที่ควรเข้า PLC
จุดแข็งของการจัดการเรียนรู้
สิ่งที่ควรพัฒนา
ตัวอย่างคำถามกระตุ้นคิด
พฤติกรรมผู้เรียนที่สะท้อน HOTS
พฤติกรรมผู้เรียนที่สะท้อนจิตศึกษา
ข้อเสนอแนะเชิงบวก
9. AI Assistance
9.1 AI ช่วยได้
สรุปบันทึกการสังเกต
สร้าง tag อัตโนมัติ
จัดหมวดตาม Focus Area
เสนอประเด็น PLC
เสนอข้อความเชิงชื่นชม/เสริมพลังให้ครู
จัดหมวดเป็นหลักฐาน SAR
สรุปแนวโน้มรายเดือน
เชื่อมโยงกับ Teacher Reflection
9.2 AI ต้องระวัง
ห้ามใช้ภาษาเหมือนประเมินจับผิดครู
ห้ามสรุปคุณภาพครูโดยไม่มีมนุษย์ตรวจ
ห้ามตีตรานักเรียน
ห้ามเผยแพร่ภาพ/คลิปโดยไม่มีการตรวจอนุญาต
ใช้ภาษาพัฒนาเชิงบวก
10. Integration with Teacher Reflection

เมื่อมี Learning Observation Record ที่เกี่ยวข้องกับครูคนใด ระบบควรเปิดให้ครู

เห็นหลักฐานที่เจ้าหน้าที่บันทึก
เพิ่ม Reflection ของตนเองต่อจากหลักฐานนั้น
เชื่อม Observation กับ Daily Teacher Reflection
ใช้ร่วมกันเป็นหลักฐาน PLC/SAR

Flow:

Observation Officer บันทึกหลักฐาน
        ↓
ครูผู้สอนได้รับแจ้งเตือน
        ↓
ครูเพิ่ม Reflection / ความเห็นเพิ่มเติม
        ↓
Academic Agent สรุปเป็นหลักฐานการพัฒนา
        ↓
เข้า PLC/SAR Candidate
11. SAR Integration
11.1 Duty Log to SAR

Daily Duty Log ใช้เป็นหลักฐานด้าน

บริหารทั่วไป
กิจการนักเรียน
สุขภาวะ/โภชนาการ
ความปลอดภัย
สภาพแวดล้อม
ระบบดูแลช่วยเหลือนักเรียน
11.2 Learning Observation to SAR

Learning Observation ใช้เป็นหลักฐานด้าน

คุณภาพการจัดการเรียนรู้
ผู้เรียนมีทักษะคิดวิเคราะห์
Active Learning
จิตศึกษาและคุณลักษณะ
การนิเทศภายใน
PLC
การพัฒนาครู
สมรรถนะผู้เรียน
12. Required Pages

เพิ่มหน้าใหม่

/teacher/daily-duty
/teacher/daily-duty/new
/teacher/daily-duty/:id

/departments/general-affairs/duty-logs
/departments/hr/duty-workload

/learning-observations
/learning-observations/schedule
/learning-observations/new
/learning-observations/:id

/departments/academic/learning-observations
/school/sar-evidence/duty-logs
/school/sar-evidence/learning-observations
13. Required Components
DailyDutyCard
DailyDutyQuickForm
DutyAttachmentUploader
DutyScheduleCalendar
DutyCompletionMatrix
CafeteriaDutyLogSection
FrontGateDutyLogSection
DutyIncidentAlert

LearningObservationCard
ObservationScheduleCalendar
ObservationRotationPlanner
ObservationQuickCaptureForm
ObservationMediaUploader
ObservationFocusAreaSelector
ObservationAISummaryPanel
ObservationToReflectionLink
ObservationToPLCButton
ObservationSAREvidenceCard
14. Database Impact Summary

เพิ่มตารางหลัก:

daily_duty_schedules
daily_duty_logs
daily_duty_log_attachments
learning_observation_rotation_rules
learning_observation_assignments
learning_observation_records
learning_observation_media
learning_observation_ai_summaries
learning_observation_focus_tags

ปรับตารางเดิม:

evidence_files
sar_evidence_items
teacher_daily_reflections
plc_sessions
tasks
15. Acceptance Criteria
Daily Duty Log
ระบบสร้างตารางเวรประจำวันได้
ครูเวรเห็นเวรของตนเองวันนี้
ครูเวรบันทึกเวรหน้าโรงเรียนได้
ครูเวรบันทึกเวรดูแลสถานที่ตอนเช้าได้
ครูเวรบันทึกเวรโรงอาหาร/ตักอาหารได้
แนบรูป/คลิป/PDF หรือไม่แนบได้
AI ช่วยสรุปบันทึกได้
ฝ่ายบริหารทั่วไปดูภาพรวมเวรได้
ฝ่ายบุคคลดูภาระงานเวรได้
หลักฐานเวรส่งเข้า Evidence/SAR ได้
Learning Observation Officer
ระบบสร้างตารางหมุนเวียนการติดตามการจัดการเรียนรู้ได้
เจ้าหน้าที่ได้รับมอบหมายรายวัน
เจ้าหน้าที่บันทึกภาพ/คลิป/บันทึกสั้นได้
เลือก Focus Area ได้ เช่น จิตศึกษา/HOTS/Active Learning
AI ช่วยสรุปและจัด tag ได้
ครูผู้สอนสามารถดูและเพิ่ม Reflection ได้
ฝ่ายวิชาการดูภาพรวมได้
นำ Observation เข้า PLC ได้
นำ Observation เป็น SAR Candidate ได้
ผอ. เห็นภาพรวมคุณภาพการเรียนรู้เชิงหลักฐานได้
16. Final Formula
Daily Duty Log
+ Learning Observation Officer
+ Optional Media Evidence
+ AI Summary
+ PLC/SAR Mapping
+ Human Review
= หลักฐานรายวันที่สะท้อนทั้งการดูแลโรงเรียนและคุณภาพการเรียนรู้จริง

"""

migration_v4 = """-- ============================================================
-- Migration V4: Daily Duty Log & Learning Observation Officer
-- Target: Existing school_agent_db V3
-- DB: MariaDB 11.x
-- ============================================================

USE school_agent_db;

-- ============================================================
-- 1. DAILY DUTY SCHEDULES
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_duty_schedules (
id CHAR(36) PRIMARY KEY,
school_id CHAR(36) NOT NULL,
area_office_id CHAR(36) NULL,
school_network_id CHAR(36) NULL,
academic_year_id CHAR(36) NOT NULL,
academic_term_id CHAR(36) NULL,
department_id CHAR(36) NULL,

duty_date DATE NOT NULL,
duty_type VARCHAR(100) NOT NULL,
duty_period VARCHAR(100) NULL,
location_name VARCHAR(255) NULL,

assigned_user_id CHAR(36) NOT NULL,
assigned_person_id CHAR(36) NULL,
assigned_by_user_id CHAR(36) NULL,

status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
note TEXT NULL,

created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

CONSTRAINT fk_duty_schedules_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_duty_schedules_area FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
CONSTRAINT fk_duty_schedules_network FOREIGN KEY (school_network_id) REFERENCES school_networks(id),
CONSTRAINT fk_duty_schedules_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
CONSTRAINT fk_duty_schedules_term FOREIGN KEY (academic_term_id) REFERENCES academic_terms(id),
CONSTRAINT fk_duty_schedules_department FOREIGN KEY (department_id) REFERENCES departments(id),
CONSTRAINT fk_duty_schedules_user FOREIGN KEY (assigned_user_id) REFERENCES users(id),
CONSTRAINT fk_duty_schedules_person FOREIGN KEY (assigned_person_id) REFERENCES persons(id),
CONSTRAINT fk_duty_schedules_assigned_by FOREIGN KEY (assigned_by_user_id) REFERENCES users(id),

UNIQUE KEY uq_duty_schedule_user_date_type (assigned_user_id, duty_date, duty_type, duty_period),
KEY idx_duty_schedules_school_date (school_id, duty_date),
KEY idx_duty_schedules_user_date (assigned_user_id, duty_date),
KEY idx_duty_schedules_type_status (duty_type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. DAILY DUTY LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_duty_logs (
id CHAR(36) PRIMARY KEY,
schedule_id CHAR(36) NULL,
task_id CHAR(36) NULL,

school_id CHAR(36) NOT NULL,
area_office_id CHAR(36) NULL,
school_network_id CHAR(36) NULL,
academic_year_id CHAR(36) NOT NULL,
academic_term_id CHAR(36) NULL,
department_id CHAR(36) NULL,

duty_date DATE NOT NULL,
duty_type VARCHAR(100) NOT NULL,
duty_period VARCHAR(100) NULL,
location_name VARCHAR(255) NULL,

duty_user_id CHAR(36) NOT NULL,
duty_person_id CHAR(36) NULL,

start_time TIME NULL,
end_time TIME NULL,

summary_text LONGTEXT NOT NULL,
activities_done TEXT NULL,
student_support_note TEXT NULL,
facility_care_note TEXT NULL,
cafeteria_service_note TEXT NULL,
menu_note VARCHAR(500) NULL,
safety_note TEXT NULL,
incident_note TEXT NULL,
problem_found TEXT NULL,
action_taken TEXT NULL,
suggestion TEXT NULL,

estimated_student_count INT NULL,
meal_served_count INT NULL,

ai_summary TEXT NULL,
ai_tags JSON NULL,
ai_sar_suggestions JSON NULL,
teacher_confirmed_summary TINYINT(1) NOT NULL DEFAULT 0,

log_status VARCHAR(50) NOT NULL DEFAULT 'draft',
sar_evidence_status VARCHAR(50) NOT NULL DEFAULT 'raw_log',
privacy_level VARCHAR(50) NOT NULL DEFAULT 'internal',
reviewed_by_user_id CHAR(36) NULL,
reviewed_at DATETIME NULL,
submitted_at DATETIME NULL,

created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at DATETIME NULL,

CONSTRAINT fk_duty_logs_schedule FOREIGN KEY (schedule_id) REFERENCES daily_duty_schedules(id),
CONSTRAINT fk_duty_logs_task FOREIGN KEY (task_id) REFERENCES tasks(id),
CONSTRAINT fk_duty_logs_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_duty_logs_area FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
CONSTRAINT fk_duty_logs_network FOREIGN KEY (school_network_id) REFERENCES school_networks(id),
CONSTRAINT fk_duty_logs_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
CONSTRAINT fk_duty_logs_term FOREIGN KEY (academic_term_id) REFERENCES academic_terms(id),
CONSTRAINT fk_duty_logs_department FOREIGN KEY (department_id) REFERENCES departments(id),
CONSTRAINT fk_duty_logs_user FOREIGN KEY (duty_user_id) REFERENCES users(id),
CONSTRAINT fk_duty_logs_person FOREIGN KEY (duty_person_id) REFERENCES persons(id),
CONSTRAINT fk_duty_logs_reviewed_by FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id),

KEY idx_duty_logs_school_date (school_id, duty_date),
KEY idx_duty_logs_user_date (duty_user_id, duty_date),
KEY idx_duty_logs_type_date (duty_type, duty_date),
KEY idx_duty_logs_status (log_status),
KEY idx_duty_logs_sar_status (school_id, academic_year_id, sar_evidence_status),
FULLTEXT KEY ft_duty_logs_text (summary_text, activities_done, incident_note, suggestion, ai_summary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. DAILY DUTY LOG ATTACHMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_duty_log_attachments (
id CHAR(36) PRIMARY KEY,
duty_log_id CHAR(36) NOT NULL,
evidence_file_id CHAR(36) NULL,

attachment_type VARCHAR(50) NOT NULL,
title VARCHAR(500) NULL,
file_url TEXT NOT NULL,
file_name VARCHAR(500) NULL,
mime_type VARCHAR(255) NULL,
file_size_bytes BIGINT NULL,
duration_seconds INT NULL,

ai_description TEXT NULL,
privacy_checked TINYINT(1) NOT NULL DEFAULT 0,
include_in_sar TINYINT(1) NOT NULL DEFAULT 0,

uploaded_by_user_id CHAR(36) NOT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
deleted_at DATETIME NULL,

CONSTRAINT fk_duty_attachments_log FOREIGN KEY (duty_log_id) REFERENCES daily_duty_logs(id),
CONSTRAINT fk_duty_attachments_evidence FOREIGN KEY (evidence_file_id) REFERENCES evidence_files(id),
CONSTRAINT fk_duty_attachments_uploaded_by FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id),

KEY idx_duty_attachments_log (duty_log_id),
KEY idx_duty_attachments_evidence (evidence_file_id),
KEY idx_duty_attachments_type (attachment_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. LEARNING OBSERVATION ROTATION RULES
-- ============================================================

CREATE TABLE IF NOT EXISTS learning_observation_rotation_rules (
id CHAR(36) PRIMARY KEY,
school_id CHAR(36) NOT NULL,
academic_year_id CHAR(36) NOT NULL,
academic_term_id CHAR(36) NULL,

name VARCHAR(500) NOT NULL,
rotation_type VARCHAR(100) NOT NULL DEFAULT 'by_classroom',
focus_areas JSON NULL,
observer_user_ids JSON NULL,
classroom_ids JSON NULL,
teacher_user_ids JSON NULL,

frequency VARCHAR(100) NOT NULL DEFAULT 'daily',
start_date DATE NULL,
end_date DATE NULL,
is_active TINYINT(1) NOT NULL DEFAULT 1,

created_by_user_id CHAR(36) NOT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

CONSTRAINT fk_obs_rules_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_obs_rules_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
CONSTRAINT fk_obs_rules_term FOREIGN KEY (academic_term_id) REFERENCES academic_terms(id),
CONSTRAINT fk_obs_rules_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id),

KEY idx_obs_rules_school_year (school_id, academic_year_id),
KEY idx_obs_rules_active (school_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. LEARNING OBSERVATION ASSIGNMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS learning_observation_assignments (
id CHAR(36) PRIMARY KEY,
rotation_rule_id CHAR(36) NULL,
task_id CHAR(36) NULL,

school_id CHAR(36) NOT NULL,
area_office_id CHAR(36) NULL,
school_network_id CHAR(36) NULL,
academic_year_id CHAR(36) NOT NULL,
academic_term_id CHAR(36) NULL,

observation_date DATE NOT NULL,
observer_user_id CHAR(36) NOT NULL,
observer_person_id CHAR(36) NULL,

classroom_id CHAR(36) NULL,
teacher_observed_user_id CHAR(36) NULL,
lesson_plan_id CHAR(36) NULL,

focus_area VARCHAR(100) NOT NULL,
focus_tags JSON NULL,
note TEXT NULL,
status VARCHAR(50) NOT NULL DEFAULT 'assigned',

assigned_by_user_id CHAR(36) NULL,

created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

CONSTRAINT fk_obs_assign_rule FOREIGN KEY (rotation_rule_id) REFERENCES learning_observation_rotation_rules(id),
CONSTRAINT fk_obs_assign_task FOREIGN KEY (task_id) REFERENCES tasks(id),
CONSTRAINT fk_obs_assign_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_obs_assign_area FOREIGN KEY (area_office_id) REFERENCES education_area_offices(id),
CONSTRAINT fk_obs_assign_network FOREIGN KEY (school_network_id) REFERENCES school_networks(id),
CONSTRAINT fk_obs_assign_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
CONSTRAINT fk_obs_assign_term FOREIGN KEY (academic_term_id) REFERENCES academic_terms(id),
CONSTRAINT fk_obs_assign_observer_user FOREIGN KEY (observer_user_id) REFERENCES users(id),
CONSTRAINT fk_obs_assign_observer_person FOREIGN KEY (observer_person_id) REFERENCES persons(id),
CONSTRAINT fk_obs_assign_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
CONSTRAINT fk_obs_assign_teacher FOREIGN KEY (teacher_observed_user_id) REFERENCES users(id),
CONSTRAINT fk_obs_assign_lesson FOREIGN KEY (lesson_plan_id) REFERENCES lesson_plans(id),
CONSTRAINT fk_obs_assign_assigned_by FOREIGN KEY (assigned_by_user_id) REFERENCES users(id),

UNIQUE KEY uq_obs_assignment_observer_date_class_focus (observer_user_id, observation_date, classroom_id, focus_area),
KEY idx_obs_assign_school_date (school_id, observation_date),
KEY idx_obs_assign_observer_date (observer_user_id, observation_date),
KEY idx_obs_assign_classroom_date (classroom_id, observation_date),
KEY idx_obs_assign_focus_status (focus_area, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. LEARNING OBSERVATION RECORDS
-- ============================================================

CREATE TABLE IF NOT EXISTS learning_observation_records (
id CHAR(36) PRIMARY KEY,
assignment_id CHAR(36) NULL,
task_id CHAR(36) NULL,

school_id CHAR(36) NOT NULL,
academic_year_id CHAR(36) NOT NULL,
academic_term_id CHAR(36) NULL,
classroom_id CHAR(36) NULL,
lesson_plan_id CHAR(36) NULL,
teacher_reflection_id CHAR(36) NULL,

observation_date DATE NOT NULL,
observer_user_id CHAR(36) NOT NULL,
teacher_observed_user_id CHAR(36) NULL,

subject_name VARCHAR(255) NULL,
activity_title VARCHAR(500) NULL,
focus_area VARCHAR(100) NOT NULL,
focus_tags JSON NULL,

observation_text LONGTEXT NOT NULL,
evidence_summary TEXT NULL,
learner_behavior_note TEXT NULL,
teacher_practice_note TEXT NULL,
jit_suksa_note TEXT NULL,
hots_note TEXT NULL,
active_learning_note TEXT NULL,
good_practice_note TEXT NULL,
development_suggestion TEXT NULL,
plc_candidate_note TEXT NULL,

ai_summary TEXT NULL,
ai_tags JSON NULL,
ai_sar_suggestions JSON NULL,
teacher_visible TINYINT(1) NOT NULL DEFAULT 1,
teacher_acknowledged TINYINT(1) NOT NULL DEFAULT 0,
teacher_acknowledged_at DATETIME NULL,

record_status VARCHAR(50) NOT NULL DEFAULT 'draft',
sar_evidence_status VARCHAR(50) NOT NULL DEFAULT 'raw_observation',
plc_candidate TINYINT(1) NOT NULL DEFAULT 0,
privacy_level VARCHAR(50) NOT NULL DEFAULT 'internal',

reviewed_by_user_id CHAR(36) NULL,
reviewed_at DATETIME NULL,
submitted_at DATETIME NULL,

created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at DATETIME NULL,

CONSTRAINT fk_obs_records_assignment FOREIGN KEY (assignment_id) REFERENCES learning_observation_assignments(id),
CONSTRAINT fk_obs_records_task FOREIGN KEY (task_id) REFERENCES tasks(id),
CONSTRAINT fk_obs_records_school FOREIGN KEY (school_id) REFERENCES schools(id),
CONSTRAINT fk_obs_records_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
CONSTRAINT fk_obs_records_term FOREIGN KEY (academic_term_id) REFERENCES academic_terms(id),
CONSTRAINT fk_obs_records_classroom FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
CONSTRAINT fk_obs_records_lesson FOREIGN KEY (lesson_plan_id) REFERENCES lesson_plans(id),
CONSTRAINT fk_obs_records_teacher_reflection FOREIGN KEY (teacher_reflection_id) REFERENCES teacher_daily_reflections(id),
CONSTRAINT fk_obs_records_observer FOREIGN KEY (observer_user_id) REFERENCES users(id),
CONSTRAINT fk_obs_records_teacher FOREIGN KEY (teacher_observed_user_id) REFERENCES users(id),
CONSTRAINT fk_obs_records_reviewed_by FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id),

KEY idx_obs_records_school_date (school_id, observation_date),
KEY idx_obs_records_observer_date (observer_user_id, observation_date),
KEY idx_obs_records_teacher_date (teacher_observed_user_id, observation_date),
KEY idx_obs_records_classroom_date (classroom_id, observation_date),
KEY idx_obs_records_focus (focus_area),
KEY idx_obs_records_sar_status (school_id, academic_year_id, sar_evidence_status),
FULLTEXT KEY ft_obs_records_text (observation_text, evidence_summary, ai_summary, good_practice_note, development_suggestion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. LEARNING OBSERVATION MEDIA
-- ============================================================

CREATE TABLE IF NOT EXISTS learning_observation_media (
id CHAR(36) PRIMARY KEY,
observation_record_id CHAR(36) NOT NULL,
evidence_file_id CHAR(36) NULL,

media_type VARCHAR(50) NOT NULL,
title VARCHAR(500) NULL,
file_url TEXT NOT NULL,
file_name VARCHAR(500) NULL,
mime_type VARCHAR(255) NULL,
file_size_bytes BIGINT NULL,
duration_seconds INT NULL,

ai_description TEXT NULL,
privacy_checked TINYINT(1) NOT NULL DEFAULT 0,
include_in_sar TINYINT(1) NOT NULL DEFAULT 0,
include_in_plc TINYINT(1) NOT NULL DEFAULT 0,

uploaded_by_user_id CHAR(36) NOT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
deleted_at DATETIME NULL,

CONSTRAINT fk_obs_media_record FOREIGN KEY (observation_record_id) REFERENCES learning_observation_records(id),
CONSTRAINT fk_obs_media_evidence FOREIGN KEY (evidence_file_id) REFERENCES evidence_files(id),
CONSTRAINT fk_obs_media_uploaded_by FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id),

KEY idx_obs_media_record (observation_record_id),
KEY idx_obs_media_evidence (evidence_file_id),
KEY idx_obs_media_type (media_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. LEARNING OBSERVATION AI SUMMARIES
-- ============================================================

CREATE TABLE IF NOT EXISTS learning_observation_ai_summaries (
id CHAR(36) PRIMARY KEY,
observation_record_id CHAR(36) NOT NULL,
agent_id CHAR(36) NULL,
ai_run_log_id CHAR(36) NULL,

summary_type VARCHAR(100) NOT NULL DEFAULT 'learning_observation_summary',
original_text_hash VARCHAR(255) NULL,
summary_text TEXT NOT NULL,
suggested_tags JSON NULL,
suggested_sar_mapping JSON NULL,
suggested_plc_actions JSON NULL,
risk_level VARCHAR(50) NOT NULL DEFAULT 'low',

confirmed_by_user_id CHAR(36) NULL,
confirmed_at DATETIME NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_obs_ai_summary_record FOREIGN KEY (observation_record_id) REFERENCES learning_observation_records(id),
CONSTRAINT fk_obs_ai_summary_agent FOREIGN KEY (agent_id) REFERENCES agents(id),
CONSTRAINT fk_obs_ai_summary_run FOREIGN KEY (ai_run_log_id) REFERENCES ai_run_logs(id),
CONSTRAINT fk_obs_ai_summary_confirmed_by FOREIGN KEY (confirmed_by_user_id) REFERENCES users(id),

KEY idx_obs_ai_summary_record (observation_record_id),
KEY idx_obs_ai_summary_agent (agent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. FOCUS TAGS
-- ============================================================

CREATE TABLE IF NOT EXISTS learning_observation_focus_tags (
id CHAR(36) PRIMARY KEY,
school_id CHAR(36) NULL,
code VARCHAR(100) NOT NULL,
name VARCHAR(255) NOT NULL,
description TEXT NULL,
category VARCHAR(100) NULL,
is_system_default TINYINT(1) NOT NULL DEFAULT 0,
is_active TINYINT(1) NOT NULL DEFAULT 1,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_focus_tags_school FOREIGN KEY (school_id) REFERENCES schools(id),
UNIQUE KEY uq_focus_tags_school_code (school_id, code),
KEY idx_focus_tags_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- System default focus tags. NULL school_id means global defaults.
INSERT IGNORE INTO learning_observation_focus_tags
(id, school_id, code, name, description, category, is_system_default, is_active)
VALUES
(UUID(), NULL, 'jit_suksa', 'จิตศึกษา / พัฒนาปัญญาภายใน', 'หลักฐานกระบวนการจิตศึกษาและการพัฒนาปัญญาภายใน', 'learning_process', 1, 1),
(UUID(), NULL, 'hots', 'ทักษะการคิดวิเคราะห์ขั้นสูง', 'หลักฐานพฤติกรรมการคิดวิเคราะห์ สังเคราะห์ ประเมินค่า และสร้างสรรค์', 'learning_process', 1, 1),
(UUID(), NULL, 'active_learning', 'Active Learning', 'หลักฐานการเรียนรู้แบบผู้เรียนมีส่วนร่วม', 'pedagogy', 1, 1),
(UUID(), NULL, 'student_agency', 'ผู้เรียนเป็นเจ้าของการเรียนรู้', 'หลักฐานการตั้งคำถาม เลือกวิธีเรียน และสะท้อนคิดของผู้เรียน', 'learner_attribute', 1, 1),
(UUID(), NULL, 'collaboration', 'การทำงานร่วมกัน', 'หลักฐานการเรียนรู้แบบร่วมมือ', 'learner_attribute', 1, 1),
(UUID(), NULL, 'communication', 'การสื่อสาร', 'หลักฐานการฟัง พูด นำเสนอ อธิบาย และแลกเปลี่ยนความคิดเห็น', 'learner_attribute', 1, 1),
(UUID(), NULL, 'creativity', 'ความคิดสร้างสรรค์', 'หลักฐานการสร้างผลงาน แนวคิด หรือทางเลือกใหม่', 'learner_attribute', 1, 1),
(UUID(), NULL, 'local_context_learning', 'การเรียนรู้เชื่อมโยงบริบทท้องถิ่น', 'หลักฐานการเชื่อมโยงบทเรียนกับชุมชนและชีวิตจริง', 'context', 1, 1),
(UUID(), NULL, 'assessment_for_learning', 'การประเมินเพื่อพัฒนา', 'หลักฐานการใช้การประเมินเพื่อปรับการเรียนรู้', 'assessment', 1, 1);

-- ============================================================
-- 10. EXTEND SAR EVIDENCE ITEMS
-- ============================================================

ALTER TABLE sar_evidence_items
ADD COLUMN IF NOT EXISTS duty_log_id CHAR(36) NULL AFTER reflection_id,
ADD COLUMN IF NOT EXISTS learning_observation_record_id CHAR(36) NULL AFTER duty_log_id,
ADD KEY IF NOT EXISTS idx_sar_items_duty_log (duty_log_id),
ADD KEY IF NOT EXISTS idx_sar_items_observation (learning_observation_record_id);

ALTER TABLE sar_evidence_items
ADD CONSTRAINT fk_sar_items_duty_log FOREIGN KEY (duty_log_id) REFERENCES daily_duty_logs(id),
ADD CONSTRAINT fk_sar_items_learning_observation FOREIGN KEY (learning_observation_record_id) REFERENCES learning_observation_records(id);

-- ============================================================
-- 11. EXTEND EVIDENCE FILES
-- ============================================================

ALTER TABLE evidence_files
ADD COLUMN IF NOT EXISTS duty_log_id CHAR(36) NULL AFTER source_id,
ADD COLUMN IF NOT EXISTS learning_observation_record_id CHAR(36) NULL AFTER duty_log_id,
ADD KEY IF NOT EXISTS idx_evidence_duty_log (duty_log_id),
ADD KEY IF NOT EXISTS idx_evidence_learning_observation (learning_observation_record_id);

ALTER TABLE evidence_files
ADD CONSTRAINT fk_evidence_duty_log FOREIGN KEY (duty_log_id) REFERENCES daily_duty_logs(id),
ADD CONSTRAINT fk_evidence_learning_observation FOREIGN KEY (learning_observation_record_id) REFERENCES learning_observation_records(id);

-- ============================================================
-- 12. VIEWS
-- ============================================================

CREATE OR REPLACE VIEW v_daily_duty_completion AS
SELECT
s.school_id,
s.academic_year_id,
s.academic_term_id,
s.duty_date,
s.duty_type,
COUNT(s.id) AS scheduled_count,
COUNT(l.id) AS submitted_log_count,
SUM(CASE WHEN l.log_status IN ('submitted','reviewed','approved') THEN 1 ELSE 0 END) AS completed_count
FROM daily_duty_schedules s
LEFT JOIN daily_duty_logs l ON l.schedule_id = s.id AND l.deleted_at IS NULL
GROUP BY
s.school_id,
s.academic_year_id,
s.academic_term_id,
s.duty_date,
s.duty_type;

CREATE OR REPLACE VIEW v_learning_observation_progress AS
SELECT
a.school_id,
a.academic_year_id,
a.academic_term_id,
a.observation_date,
a.focus_area,
COUNT(a.id) AS assignment_count,
COUNT(r.id) AS record_count,
SUM(CASE WHEN r.record_status IN ('submitted','reviewed','approved') THEN 1 ELSE 0 END) AS completed_count,
SUM(CASE WHEN r.plc_candidate = 1 THEN 1 ELSE 0 END) AS plc_candidate_count,
SUM(CASE WHEN r.sar_evidence_status IN ('sar_candidate','sar_selected','sar_exported') THEN 1 ELSE 0 END) AS sar_candidate_count
FROM learning_observation_assignments a
LEFT JOIN learning_observation_records r ON r.assignment_id = a.id AND r.deleted_at IS NULL
GROUP BY
a.school_id,
a.academic_year_id,
a.academic_term_id,
a.observation_date,
a.focus_area;

-- ============================================================
-- End Migration V4
-- ============================================================
"""

design_v4 = """# Claude Design Addendum: Daily Duty Log & Learning Observation Officer UI

File: prd-claude-design-addendum-duty-observation.md
Related UI PRD: prd-claude-design-teacher-agent-ui.md
Theme: Purple / Blue / White Gradient + Dark Mode / Light Mode
Purpose: เพิ่ม UI สำหรับครูเวรประจำวัน และเจ้าหน้าที่ติดตามการจัดการเรียนรู้ด้วยภาพ/คลิป/หลักฐานรายวัน

1. New Navigation

เพิ่มเมนู

Teacher
  - เวรของฉันวันนี้
  - บันทึกเวรประจำวัน

General Affairs
  - Daily Duty Logs
  - Front Gate Duty
  - Cafeteria Duty
  - Facility Morning Care

Academic
  - Learning Observations
  - Observation Schedule
  - Observation Insights

SAR Evidence
  - Duty Logs Evidence
  - Learning Observation Evidence
2. New Routes
/teacher/daily-duty
/teacher/daily-duty/new
/teacher/daily-duty/:id

/departments/general-affairs/duty-logs
/departments/general-affairs/duty-schedule

/departments/hr/duty-workload

/learning-observations
/learning-observations/schedule
/learning-observations/new
/learning-observations/:id

/departments/academic/learning-observations
/school/sar-evidence/duty-logs
/school/sar-evidence/learning-observations
3. Daily Duty UI
3.1 Teacher Daily Duty Card

Card บน Teacher Dashboard

เวรของฉันวันนี้
- เวรหน้าโรงเรียน 07:00–08:00
- เวรโรงอาหาร 11:30–12:30
สถานะ: ยังไม่บันทึก
[บันทึกเวร]
3.2 Daily Duty Quick Form

Form ต้องเบาและเร็ว

Fields:

วันที่
ประเภทเวร
ช่วงเวลา
สถานที่
สรุปการปฏิบัติหน้าที่
เหตุการณ์สำคัญ
ปัญหาที่พบ
การแก้ไขเบื้องต้น
ข้อเสนอแนะ
แนบรูป/คลิป/PDF หรือไม่แนบก็ได้
3.3 Duty Type Cards

ใช้ card แยกประเภท

หน้าโรงเรียน
ดูแลสถานที่ตอนเช้า
กิจการนักเรียน
โรงอาหาร/ตักอาหาร
อาหารเสริมนม
ความปลอดภัย
อื่น ๆ
3.4 Cafeteria Duty Section

เฉพาะเวรโรงอาหาร

Fields:

เมนูวันนี้
จำนวนโดยประมาณ
ความเรียบร้อย
ความสะอาด
ปัญหา/ข้อเสนอแนะ
3.5 Front Gate Duty Section

เฉพาะเวรหน้าโรงเรียน

Fields:

การรับนักเรียน
ความปลอดภัยหน้าโรงเรียน
การแต่งกาย/ระเบียบเบื้องต้น
เหตุการณ์ที่ควรติดตาม
4. General Affairs Duty Dashboard
Cards
ครูเวรวันนี้
บันทึกเวรที่ส่งแล้ว
บันทึกเวรที่ยังไม่ส่ง
เหตุการณ์ที่ต้องติดตาม
เวรโรงอาหาร
เวรหน้าโรงเรียน
Widgets
Duty Completion Matrix
Duty Schedule Calendar
Incident Alert List
Cafeteria Duty Log Table
Front Gate Duty Log Table
5. HR Duty Workload Dashboard
Cards
จำนวนเวรต่อครู
ครูที่มีเวรมาก
ครูที่มีเวรน้อย
เวรที่ยังไม่บันทึก
สถิติการปฏิบัติหน้าที่
Widget
Teacher Duty Balance Table
ครู | หน้าโรงเรียน | โรงอาหาร | สถานที่ | อื่น ๆ | รวม
6. Learning Observation Officer UI
6.1 Observation Today Card

สำหรับเจ้าหน้าที่ติดตามการเรียนรู้

ภารกิจติดตามวันนี้
ชั้น ป.4
ครูผู้สอน: ...
Focus: จิตศึกษา + HOTS
[เริ่มบันทึก]
6.2 Observation Quick Capture Form

Fields:

วันที่
ชั้นเรียน
ครูผู้สอน
รายวิชา/กิจกรรม
Focus Area
สรุปสิ่งที่สังเกต
จุดเด่น
พฤติกรรมผู้เรียน
จิตศึกษา / พัฒนาปัญญาภายใน
ทักษะคิดวิเคราะห์ขั้นสูง
Active Learning
สิ่งที่ควรพัฒนา
ข้อเสนอแนะเชิงบวก
แนบรูป/คลิป/PDF
6.3 Focus Area Selector

ใช้ pill/multi-select

จิตศึกษา
HOTS
Active Learning
ผู้เรียนเป็นเจ้าของการเรียนรู้
การทำงานร่วมกัน
การสื่อสาร
ความคิดสร้างสรรค์
บริบทท้องถิ่น
Assessment for Learning
6.4 Media Capture UI

Mobile-friendly

[ถ่ายภาพ]
[อัปโหลดคลิปสั้น]
[แนบ PDF]
[บันทึกข้อความอย่างเดียว]

ต้องมี note:

ตรวจสอบความเหมาะสมและข้อมูลส่วนบุคคลก่อนใช้เป็นหลักฐานเผยแพร่
7. Academic Learning Observation Dashboard
Cards
Observation เดือนนี้
Focus จิตศึกษา
Focus HOTS
Focus Active Learning
PLC Candidate
SAR Candidate
Widgets
Observation Schedule Calendar
Focus Area Distribution
Classroom Observation Matrix
Good Practice Highlights
PLC Candidate List
SAR Candidate List
Classroom Observation Matrix
ชั้น | ครั้งที่สังเกต | Focus ล่าสุด | หลักฐาน | PLC | SAR
อ.2
อ.3
ป.1
...
ม.3
8. Observation to Teacher Reflection Flow

หน้า Observation Detail ต้องมีปุ่ม

[แจ้งครูผู้สอน]
[เชื่อมกับ Reflection ของครู]
[สร้าง Reflection Draft ให้ครูตรวจ]
[ส่งเข้า PLC]
[เลือกเป็น SAR Candidate]

ครูเห็นใน Teacher Dashboard:

มีหลักฐานการจัดการเรียนรู้ที่บันทึกวันนี้
[ดูหลักฐาน] [เพิ่ม Reflection]
9. SAR Evidence UI

เพิ่ม tab ใน SAR Evidence

Teacher Reflection
Daily Duty Log
Learning Observation
PLC Evidence
Project Evidence
Duty Evidence Card
เวรหน้าโรงเรียน / โรงอาหาร / สถานที่
จำนวนหลักฐาน
เหตุการณ์สำคัญ
สถานะการตรวจ
Learning Observation Evidence Card
จิตศึกษา
HOTS
Active Learning
Good Practice
PLC Candidate
SAR Candidate
10. Components

สร้าง components เพิ่ม

DailyDutyCard
DailyDutyQuickForm
DutyTypeSelector
DutyAttachmentUploader
DutyCompletionMatrix
CafeteriaDutySection
FrontGateDutySection
DutyIncidentAlert

ObservationTodayCard
ObservationScheduleCalendar
ObservationRotationPlanner
ObservationQuickCaptureForm
ObservationMediaUploader
ObservationFocusAreaSelector
ObservationAISummaryPanel
ObservationToReflectionLink
ObservationToPLCButton
ObservationSAREvidenceCard
FocusAreaDistributionChart
ClassroomObservationMatrix
11. Visual Direction
Daily Duty

โทนฟ้า/ขาว/ม่วงอ่อน ให้รู้สึกเป็นงานดูแลระบบโรงเรียน

bg-gradient-to-br from-sky-50 via-white to-violet-50
dark:from-slate-950 dark:via-sky-950 dark:to-violet-950
Learning Observation

โทนม่วง/ฟ้า/คราม ให้รู้สึกเป็นงานวิชาการเชิงลึก

bg-gradient-to-br from-violet-50 via-white to-blue-50
dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950
12. Mobile Requirements

สำคัญมาก เพราะทั้งเวรและการสังเกตมักบันทึกจากมือถือ

Mobile must support:

large buttons
camera upload
video upload
quick textarea
save draft
submit later
offline-friendly draft concept
13. Acceptance Criteria
ครูเห็นเวรของตนเองวันนี้
ครูบันทึกเวรหน้าโรงเรียนได้
ครูบันทึกเวรโรงอาหาร/ตักอาหารได้
ครูบันทึกเวรดูแลสถานที่ตอนเช้าได้
แนบรูป/คลิป/PDF หรือไม่แนบได้
ฝ่ายบริหารทั่วไปดูภาพรวมเวรได้
ฝ่ายบุคคลดูภาระเวรต่อครูได้
เจ้าหน้าที่ติดตามเห็นภารกิจสังเกตวันนี้
เจ้าหน้าที่บันทึกภาพ/คลิปการเรียนรู้ได้
เลือก Focus Area เช่น จิตศึกษา/HOTS ได้
AI Summary แสดงเป็น Draft
Observation เชื่อมกับ Teacher Reflection ได้
Observation ส่งเข้า PLC/SAR Candidate ได้
UI ใช้งานมือถือได้ดี
Dark/light mode ครบ
14. Claude Design Prompt Add-on
Extend the School AI Agent Command Center UI with two modules:

1. Daily Duty Log
Teachers on daily duty must be able to record front gate duty, morning facility care, daily student affairs, cafeteria/lunch service, milk service, safety/environment duty, and other duty logs. Attachments are optional and may include images, short video clips, PDFs, or no files.

2. Learning Observation Officer
Specially appointed learning observation officers must record daily rotating observations of classroom learning. They capture images, short videos, and notes focused on Jit Suksa, inner wisdom development, Higher Order Thinking Skills, Active Learning, student agency, collaboration, communication, creativity, local context learning, and assessment for learning.

Design new pages:
- /teacher/daily-duty
- /teacher/daily-duty/new
- /departments/general-affairs/duty-logs
- /departments/hr/duty-workload
- /learning-observations
- /learning-observations/schedule
- /learning-observations/new
- /departments/academic/learning-observations
- /school/sar-evidence/duty-logs
- /school/sar-evidence/learning-observations

Use the existing purple-blue-white gradient theme, with full dark mode and light mode. Prioritize mobile-first usage for quick capture. AI outputs must be shown as draft and require human confirmation. Evidence must be able to flow into PLC and SAR.

"""

(base / "prd-addendum-duty-log-learning-observation.md").write_text(prd_v4, encoding="utf-8")
(base / "migration-v4-duty-log-learning-observation.sql").write_text(migration_v4, encoding="utf-8")
(base / "prd-claude-design-addendum-duty-observation.md").write_text(design_v4, encoding="utf-8")

print("created")
print("/mnt/data/prd-addendum-duty-log-learning-observation.md")
print("/mnt/data/migration-v4-duty-log-learning-observation.sql")
print("/mnt/data/prd-claude-design-addendum-duty-observation.md")

STDOUT/STDERR
created
/mnt/data/prd-addendum-duty-log-learning-observation.md
/mnt/data/migration-v4-duty-log-learning-observation.sql
/mnt/data/prd-claude-design-addendum-duty-observation.md


เพิ่มให้เรียบร้อยแล้วครับครูใหญ่ เป็น V4 Addendum สำหรับ 2 โมดูลใหม่:

Daily Duty Log
สำหรับครูเวรประจำวัน เช่น หน้าโรงเรียน ดูแลสถานที่ตอนเช้า เวรประจำวัน โรงอาหาร/ตักอาหาร อาหารเสริมนม และความปลอดภัย
Learning Observation Officer
สำหรับเจ้าหน้าที่ติดตามการจัดการเรียนรู้ที่ได้รับแต่งตั้งเป็นพิเศษ เพื่อบันทึกภาพ/คลิป/หลักฐานการเรียนรู้รายวันแบบหมุนเวียน โดยเน้น จิตศึกษา, พัฒนาปัญญาภายใน, HOTS, Active Learning, คุณลักษณะ และสมรรถนะผู้เรียน
ไฟล์ที่สร้างเพิ่ม
ดาวน์โหลด prd-addendum-duty-log-learning-observation.md
PRD Addendum สำหรับฟังก์ชันครูเวรและเจ้าหน้าที่ติดตามการเรียนรู้
ดาวน์โหลด migration-v4-duty-log-learning-observation.sql
SQL Migration เพิ่มตารางเวรประจำวัน ตารางบันทึกเวร ตารางหมุนเวียนสังเกตการเรียนรู้ และหลักฐานภาพ/คลิป
ดาวน์โหลด prd-claude-design-addendum-duty-observation.md
PRD Handoff สำหรับ Claude Design ให้ออกแบบ UI เพิ่มเติม
Flow ที่เพิ่ม
ครูเวรประจำวัน
→ เห็นเวรของตนเองวันนี้
→ บันทึกหน้าโรงเรียน / โรงอาหาร / สถานที่
→ แนบรูป คลิป PDF หรือไม่แนบก็ได้
→ AI ช่วยสรุป
→ ส่งเข้า Evidence Center / SAR Candidate
เจ้าหน้าที่ติดตามการจัดการเรียนรู้
→ ระบบจัดตารางหมุนเวียนรายวัน
→ บันทึกภาพ/คลิป/ข้อสังเกต
→ เลือก Focus Area เช่น จิตศึกษา / HOTS / Active Learning
→ AI ช่วยสรุปและจัด tag
→ ครูผู้สอนเพิ่ม Reflection ได้
→ ส่งต่อ PLC / SAR Candidate
ตารางหลักที่เพิ่ม
daily_duty_schedules
daily_duty_logs
daily_duty_log_attachments

learning_observation_rotation_rules
learning_observation_assignments
learning_observation_records
learning_observation_media
learning_observation_ai_summaries
learning_observation_focus_tags