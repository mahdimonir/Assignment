# Vehicle Rental System API

**Assignment 2 – Full-Stack Backend with PostgreSQL, Express, TypeScript & JWT**

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=for-the-badge&logo=typescript)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

**Live API URL** → https://vehicle-rental-system-ruddy.vercel.app  
**Swagger Documentation** → https://vehicle-rental-system-ruddy.vercel.app/api-docs  
**Health Check** → https://vehicle-rental-system-ruddy.vercel.app/health

---

### Features Implemented (100% Complete)

| Feature                            | Status | Details                              |
| ---------------------------------- | ------ | ------------------------------------ |
| User Registration & Login          | Done   | JWT Authentication                   |
| Role-Based Access (Admin/Customer) | Done   | Protected routes                     |
| Vehicle CRUD                       | Done   | Admin only (except GET)              |
| Booking System                     | Done   | Overlap detection, price calculation |
| Auto-return overdue bookings       | Done   | Runs on every GET /bookings          |
| Swagger/OpenAPI Documentation      | Done   | Interactive UI at `/api-docs`        |
| Professional Root & 404 Pages      | Done   | Clean JSON responses                 |
| Graceful Shutdown                  | Done   | No data loss on restart              |
| Production-Ready Structure         | Done   | Clean, modular, scalable             |

---

### API Endpoints

| Method | Endpoint               | Access         | Description                         |
| ------ | ---------------------- | -------------- | ----------------------------------- |
| POST   | `/api/v1/auth/signup`  | Public         | Register new user                   |
| POST   | `/api/v1/auth/signin`  | Public         | Login & get JWT                     |
| POST   | `/api/v1/vehicles`     | Admin          | Add new vehicle                     |
| GET    | `/api/v1/vehicles`     | Public         | List all vehicles                   |
| GET    | `/api/v1/vehicles/:id` | Public         | Get vehicle details                 |
| PUT    | `/api/v1/vehicles/:id` | Admin          | Update vehicle                      |
| DELETE | `/api/v1/vehicles/:id` | Admin          | Delete vehicle (no active bookings) |
| GET    | `/api/v1/users`        | Admin          | List all users                      |
| PUT    | `/api/v1/users/:id`    | Admin/Own      | Update profile                      |
| DELETE | `/api/v1/users/:id`    | Admin          | Delete user                         |
| POST   | `/api/v1/bookings`     | Customer/Admin | Create booking                      |
| GET    | `/api/v1/bookings`     | Role-based     | Admin → all, Customer → own         |
| PUT    | `/api/v1/bookings/:id` | Role-based     | Cancel or Return booking            |

---

### Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon / Supabase / Local)
- **Authentication**: JWT + bcryptjs
- **Deployment**: Vercel (Serverless)
- **Dev Tool**: `tsx` (run TypeScript directly)
- **Documentation**: Swagger UI + OpenAPI YAML

---

### Project Structure

```
src/
├── app.ts                 → Main Express app
├── server.ts              → Server startup + graceful shutdown
├── config/
│   ├── db.ts              → PostgreSQL pool + table init
│   └── index.ts           → Environment variables
├── modules/
│   ├── auth/
│   ├── vehicles/
│   ├── users/
│   └── bookings/
└── lib/
    └── utils/          → Helper functions
swagger.yaml               → Full API documentation
```

---

### How to Run Locally

# 1. Clone & install

```bash
git clone --branch assignment-2 https://github.com/mahdimonir/Assignment.git
cd Assignment
npm install
```

# 2. Create .env

```
.env.example .env
```

- Edit DATABASE_URL and JWT_SECRET

# 3. Run

```
npm run dev
```

Server will start at: **http://localhost:8000**

---

### Deployed Links

- API Base: https://vehicle-rental-system-ruddy.vercel.app
- Swagger UI: https://vehicle-rental-system-ruddy.vercel.app/api-docs
- Welcome Page: https://vehicle-rental-system-ruddy.vercel.app/
- Health Check: https://vehicle-rental-system-ruddy.vercel.app/health

---

### Author

**Mahdi Moniruzzaman**  
GitHub: [@mahdimonir](https://github.com/mahdimonir)  
Portfolio: [moniruzzaman-mahdi.dev](http://moniruzzaman-mahdi.vercel.app)

> This project is built with passion, clean code, and real-world production practices.  
> Not just for assignment — but to show I can build scalable backend systems.

**Thank you for checking my work!**  
Feel free to test, fork, or use as reference.
