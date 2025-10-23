# Fullstack Web App — Next.js + Hono.js + PostgreSQL

## Struktur Direktori

```
server/                   → Backend (Hono.js + Prisma)
client/                   → Frontend (Next.js + DaisyUI)
docker-compose.yml    → Menjalankan client, server, dan PostgreSQL sekaligus
```

---

## Teknologi Utama

| Komponen | Teknologi                      | Port |
| -------- | ------------------------------ | ---- |
| Frontend | Next.js (App Router) + DaisyUI | 3000 |
| Backend  | Hono.js + Prisma ORM           | 3001 |
| Database | PostgreSQL (Docker)            | 5432 |

---

## Fitur

- **Authentication:** Sign Up, Sign In, Sign Out
- **Post Management (CRUD):** Create, Read, Update, Delete
- **UI:** DaisyUI dengan TailwindCSS
- **Clean Modular Architecture:** Frontend dan Backend terpisah
- **Docker Support:** Semua komponen bisa dijalankan lewat Docker

---

## Environment Variables

### server/.env

```env
# DATABASE CONFIG
DATABASE_URL=postgresql://hono_user:hono_password@db:5432/hono_db

# APP CONFIG
PORT=3001
NODE_ENV=development

# JWT CONFIG
JWT_SECRET=supersecretkey
APP_NAME=Hono Backend

```

> Jika menjalankan tanpa Docker, ubah `db` menjadi `localhost`:
>
> ```
> DATABASE_URL=postgresql://hono_user:hono_password@localhost:5432/hono_db
> ```

---

### client/.env.local

```env
# Backend API endpoint
NEXT_PUBLIC_API_URL=http://localhost:3001

NEXT_PUBLIC_APP_NAME=Next.js Client
NEXT_PUBLIC_ENV=development

```

---

## Menjalankan Proyek

### Opsi 1 — Jalankan dengan Docker (Disarankan)

Pastikan sudah menginstal **Docker** dan **Docker Compose**.

1. Jalankan semua service:

   ```bash
   docker compose up --build
   ```

2. Setelah semua container aktif:

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:3001](http://localhost:3001)
   - Database: PostgreSQL di port `5432`

3. Untuk menghentikan container:

   ```bash
   docker compose down
   ```

4. Untuk reset database:

   ```bash
   docker compose down -v
   ```

---

## Opsi 2 — Non-Docker Setup

Langkah-langkah berikut untuk menjalankan proyek **tanpa Docker**.
Pastikan kamu sudah menginstal:

- **Node.js** (versi 18 atau lebih baru)
- **PostgreSQL** (CLI `psql` harus bisa dijalankan di terminal)

---

### Jalankan Database PostgreSQL

Kamu bisa pakai database lokal, atau jalankan container PostgreSQL sederhana:

```bash
docker run --name local_postgres \
  -e POSTGRES_USER=hono_user \
  -e POSTGRES_PASSWORD=hono_password \
  -e POSTGRES_DB=hono_db \
  -p 5432:5432 -d postgres:15
```

---

### Buat dan Isi Database

Masuk ke PostgreSQL lewat CLI:

```bash
psql -U hono_user -d hono_db -h localhost
```

Lalu jalankan file schema dan seed (dari root project):

```bash
psql -U hono_user -d hono_db -h localhost -f ./BE/src/db/schema.sql
psql -U hono_user -d hono_db -h localhost -f ./BE/src/db/seed.sql
```

Jika muncul pesan `CREATE TABLE` dan `INSERT 0 1`, berarti berhasil.

---

### Jalankan Backend

```bash
cd server
npm install
npm run dev
```

Backend akan berjalan di:
[http://localhost:3001](http://localhost:3001)

---

### Jalankan Frontend

```bash
cd client
npm install
npm run dev
```

Frontend akan berjalan di:
[http://localhost:3000](http://localhost:3000)

---

## Ringkasan Singkat

| Komponen   | Port | Fungsi                    |
| ---------- | ---- | ------------------------- |
| PostgreSQL | 5432 | Database                  |
| Hono.js    | 3001 | Backend API (Auth + CRUD) |
| Next.js    | 3000 | Frontend App              |
