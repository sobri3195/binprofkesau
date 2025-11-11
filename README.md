# BINPROFKES - Admin Panel

Sistem Informasi Bina Profesional Kesehatan TNI Angkatan Udara.

## Fitur Utama

- ✅ **Dashboard** dengan KPI, grafik distribusi, dan tren keluhan
- ✅ **Manajemen Personel** dengan CRUD, pencarian, filter, dan ekspor (CSV/Excel/PDF)
- ✅ **Pendidikan & Pelatihan** dengan tracking sertifikat dan peringatan masa berlaku
- ✅ **Peta Sebaran** interaktif dengan React Leaflet
- ✅ **Notifikasi** dengan kategorisasi dan status baca
- ✅ **Log Aktivitas** (audit trail) untuk tracking semua aksi pengguna
- ✅ **Manajemen User** dengan RBAC (Role-Based Access Control)
- ✅ **Persistensi LocalStorage** - data tersimpan otomatis
- ✅ **Dark Mode** support
- ✅ **Responsive Design**

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Maps**: React Leaflet
- **Export**: PapaParse (CSV), SheetJS (Excel), jsPDF (PDF)
- **Date**: date-fns

## Role-Based Access Control

### SuperAdmin
- Akses penuh ke semua fitur
- Dapat mengelola semua data
- Dapat mengelola user dan role

### AdminSatuan
- CRUD personel pada satuannya
- Read-only untuk satuan lain
- Akses log aktivitas
- Tidak dapat mengelola user

### Operator
- Hanya dapat menambah (create) data personel
- Tidak dapat edit atau delete
- Read-only untuk fitur lainnya

### Viewer
- Read-only untuk semua fitur
- Dapat melihat dashboard, peta, dan laporan
- Tidak dapat mengubah data

## Demo Akun

Gunakan kredensial berikut untuk login:

| Role | Email | Password |
|------|-------|----------|
| SuperAdmin | superadmin@binprofkes.mil.id | admin123 |
| AdminSatuan | admin.halim@binprofkes.mil.id | admin123 |
| Operator | operator@binprofkes.mil.id | operator123 |
| Viewer | viewer@binprofkes.mil.id | viewer123 |

## Instalasi & Menjalankan

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Aplikasi akan berjalan di `http://localhost:5173`

## Struktur Project

```
src/
├── components/          # Komponen UI reusable
│   ├── ui/             # Base UI components (Button, Card, Input, Badge)
│   └── layout/         # Layout components (Sidebar, Topbar, AppLayout)
├── pages/              # Halaman aplikasi
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Personel.tsx
│   ├── Pelatihan.tsx
│   ├── Peta.tsx
│   ├── Notifikasi.tsx
│   ├── LogAktivitas.tsx
│   └── Users.tsx
├── services/           # Services & utilities
│   ├── storage.ts     # LocalStorage service
│   ├── repository.ts  # Generic CRUD repository
│   ├── audit.ts       # Audit logging service
│   ├── export.ts      # Export (CSV/Excel/PDF) service
│   └── uuid.ts        # UUID generator
├── store/             # Zustand stores
│   ├── authStore.ts   # Authentication state
│   └── uiStore.ts     # UI state (sidebar, theme)
├── types/             # TypeScript types
│   └── models.ts      # Data models
├── data/              # Seed data
│   └── seed.ts        # Demo data
├── lib/               # Utilities
│   └── utils.ts       # Helper functions (cn)
├── App.tsx            # Main app component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Fitur Export

Semua tabel data dapat diekspor ke:
- **CSV** - Format teks untuk spreadsheet
- **Excel (XLSX)** - Format Microsoft Excel
- **PDF** - Format dokumen dengan autoTable

## Data Persistence

Semua data disimpan di LocalStorage dengan namespace `binprofkes:*`

Keys yang digunakan:
- `binprofkes:users` - Data pengguna
- `binprofkes:personel` - Data personel
- `binprofkes:pelatihan` - Data pelatihan
- `binprofkes:fasilitas` - Data fasilitas
- `binprofkes:notifikasi` - Notifikasi
- `binprofkes:audit` - Audit log
- `binprofkes:currentUser` - User yang sedang login

## Peta Interaktif

Peta menggunakan OpenStreetMap tiles dan menampilkan:
- Marker untuk setiap fasilitas kesehatan
- Popup dengan detail personel per fasilitas
- Filter berdasarkan jenis fasilitas
- Auto-center berdasarkan data yang ditampilkan

## Audit Trail

Sistem mencatat semua aktivitas pengguna:
- Login
- Create, Update, Delete data
- Timestamp dan metadata lengkap
- Dapat diekspor untuk analisis

## Grafik & Visualisasi

Dashboard menampilkan:
- **Bar Chart**: Distribusi per pangkat (Tamtama/Bintara/Perwira)
- **Pie Chart**: Distribusi per satuan (Top 5)
- **Line Chart**: Tren keluhan kesehatan bulanan

## Future Enhancements

- [ ] Integrasi dengan REST API backend
- [ ] Import data dari CSV/Excel
- [ ] Advanced filtering dengan saved views
- [ ] Print-friendly reports
- [ ] Real-time notifications via WebSocket
- [ ] Multi-language support (i18n)
- [ ] Unit tests dengan Vitest
- [ ] E2E tests dengan Playwright

## License

Proprietary - TNI Angkatan Udara

## Contact

Untuk pertanyaan dan support, hubungi tim BINPROFKES TNI AU.
