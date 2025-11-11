# BINPROFKES - Quick Start Guide ⚡

## Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Run Development Server
```bash
npm run dev
```

### 3️⃣ Open Browser
Navigate to: **http://localhost:5173**

---

## 🔐 Login Credentials

Try any of these demo accounts:

```
Email: superadmin@binprofkes.mil.id
Password: admin123
Role: SuperAdmin (Full Access)
```

```
Email: admin.halim@binprofkes.mil.id
Password: admin123
Role: AdminSatuan (Unit Manager)
```

```
Email: operator@binprofkes.mil.id
Password: operator123
Role: Operator (Create Only)
```

```
Email: viewer@binprofkes.mil.id
Password: viewer123
Role: Viewer (Read Only)
```

---

## 🎯 What to Try

### As SuperAdmin:
1. **Dashboard** - View KPIs, charts, and statistics
2. **Personel** - Add, edit, or delete personnel (try exporting to CSV/Excel/PDF)
3. **Pelatihan** - See training records with expiry warnings
4. **Peta** - Explore interactive map with facility markers
5. **Notifikasi** - Check notifications (mark as read)
6. **Log Aktivitas** - View audit trail of all actions
7. **Manajemen User** - Manage user accounts

### Test RBAC:
1. Logout (click logout icon in topbar)
2. Login as different role
3. Notice different menu items and permissions

### Try Features:
- 🌓 Toggle dark/light theme (moon/sun icon)
- 📊 Export data to CSV, Excel, or PDF
- 🗺️ Click facility markers on map
- 🔍 Search and filter personnel
- 📱 Resize browser to see responsive design

---

## 📁 Project Structure

```
src/
├── pages/          → All application pages
├── components/     → Reusable UI components
├── services/       → Business logic & data
├── store/          → State management (Zustand)
├── types/          → TypeScript definitions
└── data/           → Seed/demo data
```

---

## 🛠️ Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🚀 Production Build

```bash
# Build
npm run build

# Output will be in dist/ directory
# Deploy dist/ folder to your hosting
```

---

## 📚 More Documentation

- **README.md** - Complete project overview
- **SETUP.md** - Detailed setup guide
- **CONTRIBUTING.md** - Development guidelines
- **CHANGELOG.md** - Version history
- **PROJECT_SUMMARY.md** - Implementation details

---

## 🆘 Need Help?

**Build not working?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Port already in use?**
```bash
npm run dev -- --port 3000
```

**Data not showing?**
Refresh the page - seed data loads automatically on first run.

---

## ✨ Features Highlight

✅ Role-Based Access Control (RBAC)  
✅ Interactive Dashboard with Charts  
✅ Personnel Management (CRUD)  
✅ Training Records with Expiry Tracking  
✅ Interactive Map (React Leaflet)  
✅ Notification Center  
✅ Activity Audit Log  
✅ Export to CSV/Excel/PDF  
✅ Dark Mode  
✅ Responsive Design  
✅ LocalStorage Persistence  

---

**Built for TNI Angkatan Udara 🇮🇩**

*Ready to explore? Run `npm install` and `npm run dev` now!*
