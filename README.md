# 🌌 hackX Jr. 9.0 — Event Registration Portal

> **A high-performance, glassmorphic registration gateway and administrative portal built for the hackX Jr. 9.0 national hackathon series.**

This portal features a fluid public registration system and a secure administrator dashboard for stats auditing, record searches, filtering, CSV spreadsheet exports, status audits, and credentials management.

---

## 🚀 Key Features

### 1. Public Registration Portal (`/register`)

- **Modern UI / UX**: A fully glassmorphic deep space theme using local `TT Hoves Pro` fonts, fluid neon glow accents, and custom background particle animations.
- **Conditional Fields**: Seamless form fields requesting grades (8 to 13, and other) for student participants, hiding unnecessary prompts for teachers and principals.
- **Uniqueness Safeguards**: Pre-insertion validations preventing duplicate mobile numbers or email registrations.

### 2. Secure Admin Authentication (`/admin/login`, `/admin/register`)

- **Cookie Session Management**: Secure `HttpOnly` session tracking backed by a database session pool with automated middleware checking (`src/proxy.ts`).
- **Hashing Security**: Passwords are securely hashed using WASM-backed **Argon2id** (`hash-wasm`).
- **Bot Protection**: Login and registration endpoints are protected via **Cloudflare Turnstile** captcha token verification.
- **Auto Redirection Routing**: Navigating to `/admin` automatically determines authentication state server-side, routing active sessions to the dashboard or anonymous requests to the login gateway.

### 3. Administrator Dashboard (`/admin/dashboard`)

- **Key Metrics & Statistics**: Pulsing statistics cards displaying total registrations, student percentages, teacher metrics, and principal counts.
- **Advanced Sorting & Filtering**:
  - Multi-column sorting (Date Registered, Full Name, School Name).
  - Dynamic filtering (via unique school names parsed from registration data).
- **Super Admin Audit Portal**:
  - View all administrative accounts.
  - Update admin account approvals (`PENDING`, `APPROVED`, `REJECTED`) inline.
  - Perform inline password resets with active session revocation.
- **Normal Admin Restraints**: Non-super admins get a clean registrations table with the stats toggles and audit controls hidden.
- **Sticky Blur Headers & Custom Scrollbars**:
  - Viewing panels scroll inside a `60vh` box with sticky table headers that blur contents rolling underneath them.
  - Custom glowing scrollbars matching the color scheme.
- **Skeleton Loader Screen**: Instantly displays a pulsing glass layout during server-side database queries.
- **Secure CSV Export**: Export all matching rows with cell escaping to prevent formula injection.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16.2](https://nextjs.org/) (App Router, dynamic pre-rendering)
- **Database ORM**: [Prisma Client 6.2](https://www.prisma.io/) (PostgreSQL client)
- **Database Host**: [Supabase PostgreSQL](https://supabase.com/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & Vanilla CSS variables
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

---

## 📂 Database Schema

The database uses integer autoincrementing primary keys (`1, 2, 3...`):

### 1. `Registration`

- `id`: `Int` autoincrement primary key.
- `fullName`: `String` (Participant name).
- `mobileNumber`: `String` (Unique normalized number).
- `email`: `String?` (Unique normalized lowercase, optional).
- `participantType`: `STUDENT` | `TEACHER` | `PRINCIPAL`
- `school`: `String` (School name).
- `grade`: `String?` (Selected student grade).
- `awarenessSource`: `String` (Source of information).
- `createdAt`: `DateTime` (Timestamp).

### 2. `AdminUser`

- `id`: `Int` autoincrement primary key.
- `fullName`: `String`.
- `username`: `String` (Unique lowercase).
- `passwordHash`: `String` (Argon2id hash).
- `role`: `ADMIN` | `SUPER_ADMIN`
- `status`: `PENDING` | `APPROVED` | `REJECTED`
- `createdAt`: `DateTime`.

### 3. `Session`

- `id`: `String` UUID primary key.
- `userId`: `Int` (Foreign key to `AdminUser`).
- `sessionTokenHash`: `String` (Unique hashed token).
- `expiresAt`: `DateTime` (Session lifespan).

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of the project with the following parameters:

```env
# Database Connections (Supabase Pooler & Direct Connection)
DATABASE_URL="postgresql://postgres.xxxxxx:password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxxx:password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# JWT / Cookie Encryption Keys
SESSION_SECRET="your_long_session_cookie_secret_key"

# Cloudflare Turnstile Keys
NEXT_PUBLIC_TURNSTILE_SITE_KEY="1x00000000000000000000AA" # Dev Dummy Site Key
TURNSTILE_SECRET_KEY="1x00000000000000000000000000000000" # Dev Dummy Secret Key

# Default Seed Super Admin Credentials
SUPER_ADMIN_NAME="Super Admin"
SUPER_ADMIN_USERNAME="admin"
SUPER_ADMIN_PASSWORD="securepassword123"
```

---

## 🛠️ Getting Started & Commands

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Apply Database Migrations

```bash
pnpm prisma db push
```

### 3. Seed Super Admin

```bash
pnpm db:seed
```

### 4. Run Development Server

```bash
pnpm dev
```

### 5. Format Codebase

```bash
pnpm format
```

### 6. Run Quality Checks

```bash
pnpm lint      # ESLint static analysis
pnpm typecheck # Strict TypeScript compiler verification
pnpm build     # Next.js production build check
```

---

## 📦 Deployment on Vercel

The project compiles on Vercel using the configured build script command:

```bash
prisma generate && next build
```

This ensures the database bindings compile cleanly before Next.js begins static type audits!
