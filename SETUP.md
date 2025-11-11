# Quick Setup Guide - BINPROFKES

## Prerequisites

- Node.js 18+ 
- npm 9+

## Installation Steps

### 1. Clone & Install
```bash
# Clone repository
git clone <repository-url>
cd binprofkes-admin

# Install dependencies
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Login with Demo Accounts

The application comes with pre-seeded demo accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **SuperAdmin** | superadmin@binprofkes.mil.id | admin123 | Full access to all features |
| **AdminSatuan** | admin.halim@binprofkes.mil.id | admin123 | Manage unit personnel |
| **Operator** | operator@binprofkes.mil.id | operator123 | Create personnel only |
| **Viewer** | viewer@binprofkes.mil.id | viewer123 | Read-only access |

### 4. Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

## Project Structure

```
binprofkes-admin/
├── src/
│   ├── components/       # UI components
│   │   ├── ui/          # Base components (Button, Card, etc.)
│   │   └── layout/      # Layout components (Sidebar, Topbar)
│   ├── pages/           # Route pages
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Personel.tsx
│   │   ├── Pelatihan.tsx
│   │   ├── Peta.tsx
│   │   ├── Notifikasi.tsx
│   │   ├── LogAktivitas.tsx
│   │   └── Users.tsx
│   ├── services/        # Business logic
│   │   ├── storage.ts   # LocalStorage wrapper
│   │   ├── repository.ts # Generic CRUD
│   │   ├── audit.ts     # Audit logging
│   │   └── export.ts    # CSV/Excel/PDF export
│   ├── store/           # State management
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── types/           # TypeScript definitions
│   │   └── models.ts
│   ├── data/            # Seed data
│   │   └── seed.ts
│   └── lib/             # Utilities
│       └── utils.ts
├── public/              # Static assets
├── README.md
├── CONTRIBUTING.md
├── SETUP.md (this file)
└── package.json
```

## Features Overview

### 1. Dashboard
- KPI cards (Total Personnel, Doctors, Nurses, Specialists)
- Bar chart: Distribution by rank
- Pie chart: Distribution by unit (top 5)
- Line chart: Monthly health complaints trend
- Link to interactive map

### 2. Personnel Management
- Full CRUD operations (role-based)
- Real-time search (name, NRP)
- Multi-criteria filtering (rank, unit, corps)
- Export to CSV, Excel, PDF
- Role-based access control

### 3. Training & Education
- Training records per personnel
- Certificate status tracking
- Expiry warnings (≤30 days)
- Badge indicators for status

### 4. Interactive Map
- Facility markers on map
- Popup with personnel summary
- Filter by facility type
- Auto-center to filtered data

### 5. Notifications
- Categorized notifications
- Read/unread status
- Filter by category
- Mark all as read

### 6. Activity Log
- Audit trail of all user actions
- Filter by user, action, date
- Export to CSV

### 7. User Management (SuperAdmin only)
- CRUD users
- Assign roles
- Track last login
- Unit assignment

## Data Persistence

All data is stored in LocalStorage with the prefix `binprofkes:*`

Keys used:
- `binprofkes:users` - User accounts
- `binprofkes:personel` - Personnel data
- `binprofkes:pelatihan` - Training records
- `binprofkes:fasilitas` - Facilities
- `binprofkes:notifikasi` - Notifications
- `binprofkes:audit` - Audit logs
- `binprofkes:currentUser` - Current logged-in user

### Clear All Data
Open browser console and run:
```javascript
Object.keys(localStorage)
  .filter(key => key.startsWith('binprofkes:'))
  .forEach(key => localStorage.removeItem(key));
location.reload();
```

## Troubleshooting

### Port 5173 already in use
```bash
# Kill the process using the port
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies installation fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Check TypeScript errors
npm run build

# Run type checking only
npx tsc --noEmit
```

### Map not showing
Make sure you have internet connection for OpenStreetMap tiles.

### Data not persisting
Check browser LocalStorage is enabled and not full.

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR. Changes to components will reflect immediately without full page reload.

### Dark Mode
Click the moon/sun icon in the topbar to toggle dark mode.

### Sidebar Collapse
Click the menu icon to collapse/expand the sidebar.

### Export Data
Use the Download buttons on data tables to export to CSV, Excel, or PDF.

### Role Testing
Login with different demo accounts to test RBAC:
1. Logout (click logout icon in topbar)
2. Login with different account
3. Observe different access levels

## Next Steps

1. ✅ Install and run the app
2. ✅ Login with SuperAdmin account
3. ✅ Explore all features
4. ✅ Check RBAC with different roles
5. ✅ Test export functionality
6. ✅ Review code structure
7. 📝 Read CONTRIBUTING.md for development guidelines
8. 🚀 Start building!

## Support

For issues or questions, contact the BINPROFKES development team.

---

**Happy coding! 🚀**
