# AxisCloud

واجهة + API بسيطة لإدارة المستخدمين (JWT) مع نظام Uptime Monitors حسب الخطة (Free/Pro/Business).

## الجديد (آخر إضافات)
- **Frontend (React + TS + Vite + Tailwind)**
  - صفحات: Home / Login / Register / Forgot Password / Reset Password / Dashboard / Create Monitor.
  - ربط API جاهز عبر `VITE_API_URL`.
  - تخزين التوكن واليوزر والـplan في `localStorage`.
  - تحذيرات داخل صفحة إنشاء المونيتور بناءً على حدود الخطة (methods/interval/timeout/headers).
- **Backend (Node + TypeScript + Express + MongoDB)**
  - نظام مستخدمين: إنشاء حساب، تسجيل دخول، JWT.
  - Forgot Password: إنشاء كود/توكن وإرساله بالإيميل، التحقق منه، تحديث كلمة المرور.
  - Uptime Monitors: إنشاء Monitor مع التحقق من صلاحيات/حدود الخطة + التحقق من الهيدرز.
  - Endpoint لاختبار Uptime (`/testUpTime`).

## هيكل المشروع
- `Backend/` : السيرفر والـAPI
- `Frontend/` : واجهة المستخدم

## التشغيل (Development)

### 1) Backend
1. ادخل على مجلد `Backend` وثبّت الحزم:
   ```bash
   npm install
   ```
2. جهّز ملف البيئة `Backend/.env` (مثال موجود عندك بالفعل) وتأكد من القيم الأساسية:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `user_email` / `user_pass` (لإرسال رسائل إعادة تعيين كلمة المرور)
3. شغّل السيرفر:
   ```bash
   npm run dev
   ```
   الافتراضي حسب الإعدادات هو `http://localhost:3000`.

### 2) Frontend
1. ادخل على `Frontend` وثبّت الحزم:
   ```bash
   npm install
   ```
2. تأكد من `Frontend/.env`:
   - `VITE_API_URL=http://localhost:3000`
3. شغّل الواجهة:
   ```bash
   npm run dev
   ```

## API Endpoints (Backend)
> ملاحظة: الـroutes متسجلة بدون prefix (يعني مباشرة على `/...`).

### Auth / Users
- `POST /CreateUser`
  - Body: `{ "username": string, "email": string, "password": string }`
- `POST /Login`
  - Body: `{ "email": string, "password": string }`
- `POST /CreateCode` (Forgot Password: إرسال كود/توكن)
  - Body: `{ "email": string }`
- `POST /CheckCode?token=...` (التحقق من صلاحية التوكن)
- `POST /UpdatePassword?token=...`
  - Body: `{ "password": string }`

### Uptime / Monitors
- `POST /CreateMontior`
  - Auth: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
      "url": "https://example.com/health",
      "method": "GET",
      "requestTime": 5,
      "checkInterval": 10,
      "headers": {"Accept": "application/json"}
    }
    ```
- `POST /testUpTime`
  - (موجود كـroute للاختبار)

## Notes
- الـFrontend بيقرأ الـplan من `localStorage` أو من payload بتاع الـJWT (لو موجود `plan`).
- صفحة إنشاء المونيتور بتعرض تحذيرات إذا إعداداتك خارج حدود الخطة، والـBackend بيعمل Validation نهائي قبل الإنشاء.
