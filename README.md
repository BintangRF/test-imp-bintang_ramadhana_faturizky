# Fullstack Web App — Next.js + Hono.js + PostgreSQL

## Struktur Direktori

```
server/                   → Backend (Hono.js + Prisma)
client/                   → Frontend (Next.js + DaisyUI)
docker-compose.yml        → Menjalankan client, server, dan PostgreSQL sekaligus
```

- **Frontend (`client/`)**: Dipisahkan dari backend agar bisa berkembang secara independen, memudahkan deployment, dan memungkinkan penggunaan framework modern (Next.js + React Query + React Hook Form).
- **Backend (`server/`)**: Fokus pada API, logika bisnis, autentikasi, dan database. Menggunakan Hono.js karena ringan, cepat, dan mudah diintegrasikan dengan Node.js tanpa boilerplate berlebihan.
- **Database (PostgreSQL)**: Dijalankan terpisah agar bisa mudah di-scale, di-backup, atau diakses langsung dari client atau backend jika perlu.

---

## Teknologi Utama

| Komponen | Teknologi                      | Port |
| -------- | ------------------------------ | ---- |
| Frontend | Next.js (App Router) + DaisyUI | 3000 |
| Backend  | Hono.js                        | 3001 |
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
FE_URL=http://localhost:3000
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

## Project Structure

### Client

- **Next.js (App Router)**: Memungkinkan routing berbasis file dan server-side rendering bila diperlukan.
- **React Query (`@tanstack/react-query`)**: Untuk fetching, caching, dan state management data API secara efisien.
- **Axios**: HTTP client yang fleksibel untuk komunikasi dengan backend API.
- **React Hook Form**: Mengelola form state dengan ringan dan validasi mudah.
- **Lucide React**: Library ikon yang ringan, konsisten, dan customizable.
- **DaisyUI + TailwindCSS**: Mempercepat styling, responsive UI, dan konsistensi desain.

> Pemisahan frontend memudahkan testing, pengembangan fitur UI, dan skalabilitas proyek tanpa memengaruhi backend.

### Server

- **Hono.js**: Framework Node.js minimalis, cepat, dan ringan. Cocok untuk API CRUD sederhana sekaligus mendukung middleware seperti autentikasi JWT.
- **Bcrypt**: Untuk hashing password aman.
- **Dotenv**: Mengelola environment variables.
- **JSON Web Token (`jsonwebtoken`)**: Autentikasi stateless, mudah digunakan dengan frontend terpisah.
- **pg**: Driver PostgreSQL untuk Node.js, sederhana dan stabil.

> Backend modular memisahkan logika database dan API sehingga bisa di-scale atau di-refactor tanpa memengaruhi frontend.

---

## Menjalankan Proyek

### Opsi 1 — Jalankan dengan Docker (Disarankan)

Pastikan sudah menginstal **Docker** dan **Docker Compose**.

1. **Build dan jalankan container**

```bash
docker compose up --build
```

2. **Install dependency TypeScript dan types di folder `server`** (hanya pertama kali atau jika ada library baru)

```bash
cd server
npm install --save-dev typescript tsx @types/node @types/bcrypt @types/jsonwebtoken @types/pg
```

> Ini akan menginstal semua `devDependencies` yang dibutuhkan oleh TypeScript dan library project secara lokal di `server/node_modules`. Tidak perlu install global.

3. **Akses aplikasi**

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)
- Database: PostgreSQL di port `5432`

> Hot-reload tetap aktif karena source code di-mount dari host ke container.

4. **Hentikan container**

```bash
docker compose down
```

5. **Reset database** (hapus data lama)

```bash
docker compose down -v
```

> Volume database akan dihapus, sehingga PostgreSQL akan memulai dari state awal.

---

💡 **Tips untuk tim developer:**

- Jika hanya mengubah kode, cukup jalankan `docker compose up -d`.
- Jika menambah library baru di frontend/backend, jalankan `npm install` di container terkait.

---

### Opsi 2 — Non-Docker Setup

Pastikan Node.js dan PostgreSQL sudah terinstal.

#### Jalankan Database PostgreSQL

```bash
docker run --name local_postgres \
  -e POSTGRES_USER=hono_user \
  -e POSTGRES_PASSWORD=hono_password \
  -e POSTGRES_DB=hono_db \
  -p 5432:5432 -d postgres:15
```

#### Buat dan Isi Database

```bash
psql -U hono_user -d hono_db -h localhost
psql -U hono_user -d hono_db -h localhost -f ./BE/src/db/schema.sql
psql -U hono_user -d hono_db -h localhost -f ./BE/src/db/seed.sql
```

#### Jalankan Backend

```bash
cd server
npm install
npm run dev
```

Backend: [http://localhost:3001](http://localhost:3001)

#### Jalankan Frontend

```bash
cd client
npm install
npm run dev
```

Frontend: [http://localhost:3000](http://localhost:3000)

---

## Ringkasan Singkat

| Komponen   | Port | Fungsi                    |
| ---------- | ---- | ------------------------- |
| PostgreSQL | 5432 | Database                  |
| Hono.js    | 3001 | Backend API (Auth + CRUD) |
| Next.js    | 3000 | Frontend App              |
