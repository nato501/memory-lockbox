# Our Love Space Backend

Node.js API สำหรับเชื่อม MongoDB Atlas แยกจาก frontend ที่อยู่ใน `public/`

## เริ่มใช้งาน

1. คัดลอก `.env.example` เป็น `.env`
2. ใส่ค่า `MONGODB_URI` จาก MongoDB Atlas
3. ติดตั้งแพ็กเกจด้วย `npm install`
4. รันด้วย `npm run dev`

ตรวจสอบ API ได้ที่ `GET /api/health` และ `GET /api/status`
