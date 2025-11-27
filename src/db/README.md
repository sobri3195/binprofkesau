# Database Module

This directory contains all database-related files for the BINPROFKES application.

## Directory Structure

```
src/db/
├── index.ts           # Database client and exports
├── schema.ts          # Drizzle ORM schema definitions
├── migrate.ts         # Migration runner script
├── seed-data.ts       # Database seeding script
├── examples.ts        # Query examples and patterns
├── migrations/        # SQL migration files (auto-generated)
│   ├── 0000_*.sql
│   └── meta/
└── README.md         # This file
```

## Files Overview

### `index.ts`
Main database client export. Import this in your application to access the database:

```typescript
import { db } from '@/db';
```

### `schema.ts`
Defines all database tables using Drizzle ORM. Contains:
- Table definitions
- Column types and constraints
- Relationships (foreign keys)
- Type exports for TypeScript

Tables:
- `users` - User accounts
- `personel` - Health personnel
- `pelatihan` - Training records
- `fasilitas` - Military facilities
- `notifikasi` - Notifications
- `auditLog` - Audit trail

### `migrate.ts`
Migration runner script. Applies SQL migrations to the database.

```bash
npm run db:migrate
```

### `seed-data.ts`
Database seeding script with dummy data. Populates the database with:
- 5 users (different roles)
- 10 personel records
- 10 training records
- 6 facilities
- 5 notifications
- 5 audit logs

```bash
npm run db:seed
```

### `examples.ts`
Comprehensive query examples showing how to:
- SELECT data (with filters, joins, pagination)
- INSERT new records
- UPDATE existing records
- DELETE records
- Run complex queries (statistics, aggregations)
- Use transactions

Import and use in your application:

```typescript
import { dbQueries } from '@/db/examples';

const users = await dbQueries.getAllUsers();
const stats = await dbQueries.getDashboardStats();
```

### `migrations/`
Auto-generated SQL migration files. Created by:

```bash
npm run db:generate
```

**DO NOT** edit these files manually. Always modify `schema.ts` and regenerate.

## Usage in Application

### Basic Query

```typescript
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Get user by email
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, 'admin@example.com'));
```

### Insert Data

```typescript
import { db } from '@/db';
import { personel } from '@/db/schema';

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
```

### Update Data

```typescript
import { db } from '@/db';
import { personel } from '@/db/schema';
import { eq } from 'drizzle-orm';

await db
  .update(personel)
  .set({ status: 'Non-Aktif', updatedAt: new Date() })
  .where(eq(personel.id, 'pers-0011'));
```

### Join Tables

```typescript
import { db } from '@/db';
import { personel, pelatihan } from '@/db/schema';
import { eq } from 'drizzle-orm';

const personelWithTraining = await db
  .select()
  .from(personel)
  .leftJoin(pelatihan, eq(personel.id, pelatihan.personelId));
```

### Use in React Component

```typescript
import { useEffect, useState } from 'react';
import { db } from '@/db';
import { users } from '@/db/schema';

function UsersList() {
  const [userList, setUserList] = useState([]);
  
  useEffect(() => {
    async function loadUsers() {
      const data = await db.select().from(users);
      setUserList(data);
    }
    loadUsers();
  }, []);
  
  return (
    <div>
      {userList.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Database Commands

All commands from project root:

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema directly (skip migrations)
npm run db:push

# Open database browser (Drizzle Studio)
npm run db:studio

# Seed database with dummy data
npm run db:seed
```

## Development Workflow

1. **Modify Schema**: Edit `src/db/schema.ts`
2. **Generate Migration**: Run `npm run db:generate`
3. **Review SQL**: Check generated SQL in `migrations/`
4. **Apply Changes**: Run `npm run db:migrate` or `npm run db:push`
5. **Test**: Verify changes in Drizzle Studio or application

## Best Practices

### 1. Always Use Transactions for Multiple Operations

```typescript
await db.transaction(async (tx) => {
  await tx.insert(personel).values(personelData);
  await tx.insert(pelatihan).values(trainingData);
});
```

### 2. Use Prepared Statements for Repeated Queries

```typescript
const getUserById = db
  .select()
  .from(users)
  .where(eq(users.id, placeholder('id')))
  .prepare('get_user_by_id');

const user = await getUserById.execute({ id: 'user-0001' });
```

### 3. Handle Errors Properly

```typescript
try {
  await db.insert(users).values(userData);
} catch (error) {
  if (error.code === '23505') { // Unique violation
    console.error('User already exists');
  }
  throw error;
}
```

### 4. Use TypeScript Types

```typescript
import type { User, Personel } from '@/db/schema';

function processUser(user: User) {
  // TypeScript knows all properties
  console.log(user.name, user.email);
}
```

### 5. Index Frequently Queried Columns

Add indexes in schema.ts:

```typescript
import { index } from 'drizzle-orm/pg-core';

export const personel = pgTable('personel', {
  // ... columns
}, (table) => ({
  nrpIdx: index('nrp_idx').on(table.nrp),
  satuanIdx: index('satuan_idx').on(table.satuan),
}));
```

## Drizzle ORM Operators

```typescript
import { 
  eq,      // Equal
  ne,      // Not equal
  lt,      // Less than
  lte,     // Less than or equal
  gt,      // Greater than
  gte,     // Greater than or equal
  like,    // LIKE pattern
  ilike,   // Case-insensitive LIKE
  and,     // AND condition
  or,      // OR condition
  not,     // NOT condition
  inArray, // IN array
  between, // BETWEEN values
  isNull,  // IS NULL
  isNotNull, // IS NOT NULL
} from 'drizzle-orm';
```

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Neon Docs](https://neon.tech/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## Troubleshooting

### Connection Issues
- Verify `DATABASE_URL` in `.env`
- Check network connectivity
- Ensure SSL mode is enabled

### Migration Conflicts
- Review migration SQL before applying
- Use `db:push` for quick iterations
- Reset migrations if needed (development only)

### Type Errors
- Regenerate types: `npm run db:generate`
- Check TypeScript version compatibility
- Verify schema definitions

---

For more information, see [DATABASE_SETUP.md](../../DATABASE_SETUP.md) in the project root.
