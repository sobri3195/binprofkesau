# Quick Start - Database Setup

Get your database up and running in 5 minutes!

## Prerequisites

- Netlify account
- Netlify CLI installed globally: `npm install -g netlify-cli`

## Step-by-Step Setup

### 1. Login to Netlify

```bash
netlify login
```

This opens your browser to authenticate.

### 2. Link Your Project

Choose one option:

**Option A: Link to existing site**
```bash
netlify link
```

**Option B: Create new site**
```bash
netlify init
```

### 3. Initialize Database

```bash
npx netlify db init
```

When prompted:
- ✅ Set up Drizzle boilerplate? **Yes**

This command will:
- Create a Neon PostgreSQL database
- Configure DATABASE_URL automatically
- Set up connection

### 4. Get Database URL

```bash
netlify env:get DATABASE_URL
```

Copy the output (looks like: `postgres://user:pass@host/db?sslmode=require`)

### 5. Configure Local Environment

```bash
# Create .env file
cp .env.example .env
```

Edit `.env` and paste your database URL:

```env
VITE_DATABASE_URL=postgres://...your-url-here...
DATABASE_URL=postgres://...your-url-here...
```

### 6. Push Schema to Database

```bash
npm run db:push
```

This creates all tables in your Neon database.

### 7. Seed with Dummy Data

```bash
npm run db:seed
```

This populates your database with sample data:
- 5 users
- 10 personnel records
- 10 training records
- 6 facilities
- 5 notifications
- 5 audit logs

### 8. Start Development Server

```bash
# Option A: With Netlify environment
netlify dev

# Option B: Standard Vite dev server
npm run dev
```

## Verify Installation

### Open Drizzle Studio

```bash
npm run db:studio
```

Opens a browser-based database viewer at `https://local.drizzle.studio`

### Check Tables

You should see 6 tables:
- ✅ users
- ✅ personel
- ✅ pelatihan
- ✅ fasilitas
- ✅ notifikasi
- ✅ audit_log

## Test Login Credentials

Use these dummy accounts to test the application:

| Email | Password | Role |
|-------|----------|------|
| superadmin@binprofkes.mil.id | admin123 | SuperAdmin |
| admin.halim@binprofkes.mil.id | admin123 | AdminSatuan |
| operator@binprofkes.mil.id | operator123 | Operator |
| viewer@binprofkes.mil.id | viewer123 | Viewer |

**Note**: The seed data uses hashed passwords. Update the seed file with proper bcrypt hashing for production.

## Common Commands

```bash
# Generate new migration
npm run db:generate

# Push schema changes (skip migration)
npm run db:push

# Run migrations
npm run db:migrate

# Open database browser
npm run db:studio

# Seed/reseed database
npm run db:seed

# View Netlify env variables
netlify env:list
```

## Troubleshooting

### "Project must be linked"
→ Run `netlify link` first

### "DATABASE_URL not found"
→ Check your `.env` file exists and has the correct URL

### "Connection failed"
→ Verify `?sslmode=require` is at the end of your URL

### "Table already exists"
→ Drop tables in Drizzle Studio or use `npm run db:push --force`

## What's Next?

1. ✅ Explore data in Drizzle Studio
2. ✅ Test login with dummy accounts
3. ✅ Review database schema in `src/db/schema.ts`
4. ✅ Check seed data in `src/db/seed-data.ts`
5. ✅ Start building features!

## Need More Info?

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed documentation.

---

**Ready to build! 🚀**
