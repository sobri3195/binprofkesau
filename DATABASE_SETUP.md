# Database Setup Guide - Neon/Netlify DB

This guide explains how to set up and use the Neon PostgreSQL database with Netlify DB for the BINPROFKES application.

## Overview

The application uses:
- **Neon**: Serverless PostgreSQL database
- **Netlify DB**: Integration layer for seamless Netlify deployment
- **Drizzle ORM**: TypeScript ORM for database operations
- **Drizzle Kit**: Database migration and management tool

## Prerequisites

- Node.js 20+ installed
- Netlify CLI installed (`npm install -g netlify-cli`)
- Netlify account with site configured

## Initial Setup

### 1. Link to Netlify (Required)

Before initializing the database, you need to link your local project to a Netlify site:

```bash
# Login to Netlify
netlify login

# Link to existing site OR create new site
netlify link

# Or create a new site
netlify init
```

### 2. Initialize Netlify DB with Neon

Once linked, initialize the database:

```bash
npx netlify db init
```

This will:
- Create a new Neon database
- Link it to your Netlify site
- Set up the `DATABASE_URL` environment variable
- Configure Drizzle boilerplate (if selected)

### 3. Get Database Connection String

Retrieve your database URL:

```bash
# Get the database URL
netlify env:get DATABASE_URL

# Or list all environment variables
netlify env:list
```

### 4. Create Local .env File

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your database URL:

```env
VITE_DATABASE_URL=postgres://[user]:[password]@[host]/[database]?sslmode=require
DATABASE_URL=postgres://[user]:[password]@[host]/[database]?sslmode=require
```

## Database Schema

The application includes the following tables:

### Tables

1. **users** - User accounts with role-based access
   - Roles: SuperAdmin, AdminSatuan, Operator, Viewer
   - Fields: id, name, email, password, role, satuan, lastLoginAt, createdAt, updatedAt

2. **personel** - Health personnel records
   - Fields: id, nrp, nama, pangkat, korps, satuan, status, jabatan, pekerjaan, keluhanBulanan, createdAt, updatedAt

3. **pelatihan** - Training/education records
   - Types: KIBI, SUSDOKBANG, SUSPAKES, SUSKESBANGAN, SEKKAU, SESKO, SES KOAU
   - Fields: id, personelId, jenis, tanggalMulai, tanggalSelesai, sertifikatBerlakuHingga, statusPelaksanaan, createdAt, updatedAt

4. **fasilitas** - Military facilities (bases, hospitals)
   - Types: Lanud, RSAU, Kodau, Koopsau, Satrad
   - Fields: id, nama, jenis, komando, satuan, koordinat, ringkasan, dokterList, createdAt, updatedAt

5. **notifikasi** - System notifications
   - Categories: Informasi, Peringatan, Pembaruan, Belum sekolah, Belum pindah, Belum PPDS
   - Fields: id, kategori, judul, isi, dibaca, createdAt

6. **audit_log** - System audit trail
   - Actions: login, create, update, delete
   - Fields: id, userId, aksi, entitas, entitasId, timestamp, meta

## Database Commands

### Generate Migrations

Generate migration files from schema changes:

```bash
npm run db:generate
```

This creates migration SQL files in `src/db/migrations/`

### Push Schema to Database

Push schema changes directly to database (development):

```bash
npm run db:push
```

⚠️ **Warning**: This skips migration files. Use for rapid development only.

### Run Migrations

Apply migrations to database:

```bash
npm run db:migrate
```

### Seed Database with Dummy Data

Populate the database with sample data:

```bash
npm run db:seed
```

This will insert:
- 5 users (SuperAdmin, AdminSatuan, Operator, Viewer)
- 10 personel records
- 10 training records
- 6 facilities (Lanud, RSAU)
- 5 notifications
- 5 audit log entries

### Open Drizzle Studio

Interactive database browser:

```bash
npm run db:studio
```

Opens at `https://local.drizzle.studio`

## Usage in Application

### Import Database Client

```typescript
import { db } from '@/db';
import { users, personel, pelatihan } from '@/db/schema';
```

### Query Examples

```typescript
// Select all users
const allUsers = await db.select().from(users);

// Select with filter
import { eq } from 'drizzle-orm';
const admin = await db.select().from(users).where(eq(users.role, 'SuperAdmin'));

// Insert
await db.insert(personel).values({
  id: 'pers-0011',
  nrp: '534000',
  nama: 'dr. New Doctor',
  pangkat: 'Perwira',
  korps: 'Kesehatan',
  satuan: 'Lanud Halim',
  status: 'Aktif',
  jabatan: 'Dokter',
  pekerjaan: 'Dokter',
});

// Update
await db.update(personel)
  .set({ status: 'Non-Aktif' })
  .where(eq(personel.id, 'pers-0011'));

// Delete
await db.delete(personel).where(eq(personel.id, 'pers-0011'));
```

### Joins

```typescript
// Get personel with their training records
const personelWithTraining = await db
  .select()
  .from(personel)
  .leftJoin(pelatihan, eq(personel.id, pelatihan.personelId));
```

## Dummy Data Overview

### Users (5 records)
- superadmin@binprofkes.mil.id (SuperAdmin)
- admin.halim@binprofkes.mil.id (AdminSatuan - Lanud Halim)
- admin.rsau@binprofkes.mil.id (AdminSatuan - RSAU)
- operator@binprofkes.mil.id (Operator)
- viewer@binprofkes.mil.id (Viewer)

All passwords are hashed equivalent of common test passwords.

### Personel (10 records)
- 3 Doctors (Perwira)
- 2 Dentists (Perwira)
- 3 Specialists (Perwira)
- 2 Nurses (Bintara/Tamtama)

Distributed across multiple facilities (Lanud Halim, RSAU Esnawan, Lanud Hasanuddin, etc.)

### Pelatihan (10 records)
- Mix of completed and pending training
- Various training types (KIBI, SUSDOKBANG, SUSPAKES, SEKKAU, SESKO, SES KOAU)
- Some with certificates expiring soon

### Fasilitas (6 records)
- 2 RSAU (hospitals)
- 4 Lanud (air bases)
- Spread across 3 operational commands (KOOPSAU I, II, III)
- Complete with coordinates for map display

### Notifikasi (5 records)
- Mix of read and unread
- Various categories (Informasi, Peringatan, Pembaruan)
- Recent timestamps

### Audit Logs (5 records)
- Login activities
- CRUD operations
- User actions tracked

## Deployment

### Netlify Deployment

When you deploy to Netlify:

1. Database URL is automatically available via environment variables
2. No need to manually configure database connection
3. Use Netlify CLI for local development:

```bash
netlify dev
```

This runs the dev server with access to Netlify environment variables.

### Environment Variables in Netlify

Set in Netlify Dashboard:
1. Go to Site Settings > Environment Variables
2. Add `DATABASE_URL` (auto-set by Netlify DB)
3. Add `VITE_DATABASE_URL` with same value

Or use CLI:

```bash
netlify env:set VITE_DATABASE_URL "your-database-url"
```

## Troubleshooting

### Error: "The project must be linked"

Run `netlify link` before `npx netlify db init`

### Error: "DATABASE_URL not found"

1. Check `.env` file exists
2. Verify `DATABASE_URL` is set
3. Restart dev server

### Connection Issues

1. Check database URL format
2. Ensure `?sslmode=require` is at the end
3. Verify network access to Neon

### Migration Conflicts

```bash
# Reset migrations (WARNING: loses data)
rm -rf src/db/migrations/*
npm run db:generate
npm run db:push
```

## Resources

- [Neon Documentation](https://neon.tech/docs)
- [Netlify DB Documentation](https://docs.netlify.com/database/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never commit** `.env` files to version control
2. **Never hardcode** database credentials
3. **Use environment variables** for all secrets
4. **Rotate credentials** regularly
5. **Use read-only credentials** for viewer roles
6. **Enable SSL** for all database connections

## Next Steps

1. ✅ Install dependencies
2. ✅ Link to Netlify site
3. ✅ Initialize database with `npx netlify db init`
4. ✅ Generate migrations with `npm run db:generate`
5. ✅ Push schema with `npm run db:push`
6. ✅ Seed data with `npm run db:seed`
7. ✅ Start development with `netlify dev`

---

**Need Help?**

Contact the development team or check the official documentation links above.
