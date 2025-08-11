Backend API (Node.js + Express + Sequelize)

Env
Create `.env` in `backend/`:

PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dacn_nhatro
DB_USER=root
DB_PASSWORD=
JWT_SECRET=supersecret
DB_SYNC=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=System Admin

Run

cd backend
npm i
npm run dev

Routes
- Auth: POST /api/auth/login, POST /api/auth/admin/create-tenant
- Public: GET /api/public/featured, GET /api/public/rooms, GET /api/public/rooms/:id, GET /api/public/properties
- Admin: GET /api/admin/dashboard, CRUD for properties, rooms, assets, invoices, payments, reports
- Tenant: GET /api/tenant/dashboard, GET /api/tenant/contracts, GET /api/tenant/invoices, POST /api/tenant/reports, GET /api/tenant/reports


