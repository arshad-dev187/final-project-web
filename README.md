# Green Grounds Cafe

A full-stack cafe website for Green Grounds Cafe in Winder, Balochistan.

## Stack

- Client: React, Vite, React Router, Framer Motion, Three.js
- Server: Node.js, Express, MySQL, JWT, bcrypt, Multer

## Setup

1. Copy `.env.example` to `.env` at the project root and set the MySQL values and a strong `JWT_SECRET`:

```powershell
Copy-Item .env.example .env
```

2. Create the database by running `database/schema.sql` in MySQL. The schema creates the related tables, categories, and sample products.
3. Create the admin account after the database exists:

```powershell
cd server
npm.cmd run seed-admin -- "choose-a-password-of-8-or-more-characters"
```

Use `admin@greengroundscafe.com` to sign in at `/admin/login`.

4. Install and run the client:

```powershell
cd client
npm install
npm run dev
```

5. In another terminal, install and run the server:

```powershell
cd server
npm install
npm run dev
```

The client runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

The first admin account is created through the server seed command documented with the authentication phase. Passwords are never stored in frontend code.
