# Modul Pendidikan & Pelatihan BINPROFKES – TNI AU

## 📘 Deskripsi Umum

Modul Pendidikan & Pelatihan adalah fitur lengkap untuk mengelola data pendidikan dan pelatihan tenaga kesehatan di lingkungan TNI Angkatan Udara. Modul ini memungkinkan tracking status pelaksanaan pelatihan dengan klasifikasi yang sederhana namun efektif: **"Sudah Melaksanakan"** atau **"Belum Melaksanakan"**.

## 🎯 Tujuan Utama

1. **Akurasi Data**: Menyediakan data pelatihan yang akurat dan mudah diperbarui
2. **Monitoring**: Memastikan setiap tenaga kesehatan mengikuti pelatihan wajib sesuai jenjangnya
3. **Status Tracking**: Memberikan gambaran status pelatihan dengan klasifikasi yang jelas
4. **Administrasi**: Memudahkan pencarian, filter, dan ekspor data untuk laporan

## 🗂️ Fitur-Fitur Utama

### 1. CRUD (Create, Read, Update, Delete) Data Pelatihan

#### ➕ Tambah Data
- Form modal dengan validasi lengkap
- Field yang tersedia:
  - **Personel** (Required): Dropdown dari daftar personel aktif
  - **Jenis Pelatihan** (Required): KIBI, SUSDOKBANG, SUSPAKES, SUSKESBANGAN, SEKKAU, SESKO, SES KOAU
  - **Tanggal Mulai** (Optional): Tanggal dimulainya pelatihan
  - **Tanggal Selesai** (Optional): Tanggal selesai pelatihan
  - **Berlaku Hingga** (Optional): Masa berlaku sertifikat
  - **Status Pelaksanaan** (Required): Sudah Melaksanakan / Belum Melaksanakan

#### ✏️ Edit Data
- Modal form yang sama dengan mode edit
- Pre-filled dengan data yang ada
- Update real-time setelah save

#### 🗑️ Hapus Data
- Konfirmasi dialog sebelum hapus
- Tidak dapat dibatalkan (warning jelas)
- Audit log otomatis

#### 👁️ Tampilan Data
Tabel responsive dengan kolom:
- **Personel**: Nama & NRP
- **Jenis Pelatihan**: Jenis pelatihan yang diikuti
- **Tanggal Mulai**: Tanggal mulai pelatihan (atau "-")
- **Tanggal Selesai**: Tanggal selesai pelatihan (atau "-")
- **Berlaku Hingga**: Masa berlaku sertifikat (atau "-")
- **Status**: Badge dengan icon ✅ (Sudah) atau ⚪ (Belum)
- **Aksi**: Tombol Edit & Hapus (sesuai role)

### 2. Klasifikasi Status Pelatihan

| Status | Deskripsi | Visual |
|--------|-----------|--------|
| **Sudah Melaksanakan** | Personel telah menyelesaikan pelatihan atau memiliki jadwal pelatihan yang telah dimulai | ✅ Badge hijau |
| **Belum Melaksanakan** | Personel belum mengikuti pelatihan apapun atau belum memiliki jadwal pelatihan aktif | ⚪ Badge abu-abu |

Status dapat diubah melalui:
- Form Edit: Radio button untuk memilih status
- Manual Update: Petugas dapat mengubah status sesuai kondisi terkini

### 3. Pencarian & Filter Data

#### 🔍 Pencarian Cepat
- Search bar dengan icon
- Pencarian berdasarkan:
  - Nama personel
  - NRP personel
  - Jenis pelatihan
- Real-time search (instant results)

#### 🔽 Filter Lanjutan
Toggle-able filter panel dengan:
- **Jenis Pelatihan**: Dropdown dengan semua jenis
- **Status Pelaksanaan**: Dropdown (Semua/Sudah/Belum)
- Filter dapat dikombinasikan dengan search

### 4. Ekspor Data

#### 📄 Format CSV
- Comma-separated values
- Compatible dengan Excel, Google Sheets
- Encoding UTF-8

#### 📊 Format Excel (XLSX)
- Native Excel format
- Multiple columns dengan formatting
- Ready untuk analisis

#### 📑 Format PDF
- Professional layout dengan header
- Tabel format dengan auto-sizing
- Brand: BINPROFKES TNI AU
- Timestamp pada dokumen

**Fitur Ekspor**:
- Hanya data yang terfilter yang diekspor
- Filename dengan timestamp (e.g., `pelatihan_20241215.pdf`)
- Kolom lengkap termasuk satuan

### 5. Dashboard Statistik

3 Card KPI di bagian atas:

1. **Total Pelatihan**
   - Icon: FileText biru
   - Menghitung semua data pelatihan

2. **Sudah Melaksanakan**
   - Icon: FileText hijau
   - Count status "Sudah Melaksanakan"

3. **Belum Melaksanakan**
   - Icon: FileText abu-abu
   - Count status "Belum Melaksanakan"

### 6. Role-Based Access Control (RBAC)

| Role | Permissions | Deskripsi |
|------|------------|-----------|
| **SuperAdmin** | Full CRUD + Export | Akses penuh untuk semua satuan |
| **AdminSatuan** | CRUD + Export (satuan sendiri) | Hanya data personel di satuannya |
| **Operator** | Create Only | Hanya bisa menambah data baru |
| **Viewer** | Read Only | Hanya melihat data |

**Implementasi**:
- Tombol "Tambah" hanya muncul untuk roles yang bisa create
- Kolom "Aksi" (Edit/Hapus) conditional berdasarkan role
- Export buttons hanya untuk SuperAdmin & AdminSatuan
- Filter personel otomatis berdasarkan satuan (AdminSatuan)

## 🔄 Alur Pengelolaan Data

### Skenario 1: Menambah Data Pelatihan Baru

1. User klik tombol **"Tambah Pelatihan"** (biru, top-right)
2. Modal form terbuka
3. User mengisi:
   - Pilih personel dari dropdown
   - Pilih jenis pelatihan
   - Isi tanggal (optional)
   - Pilih status pelaksanaan
4. Klik **"Tambah Pelatihan"**
5. Data tersimpan, modal tertutup
6. Tabel refresh otomatis dengan data baru
7. Audit log tercatat

### Skenario 2: Edit Data Pelatihan

1. User klik icon **Edit** (pensil) pada baris data
2. Modal form terbuka dengan data pre-filled
3. User mengubah field yang diperlukan
4. Klik **"Simpan Perubahan"**
5. Data terupdate di tabel
6. Audit log tercatat

### Skenario 3: Hapus Data Pelatihan

1. User klik icon **Hapus** (trash) pada baris data
2. Dialog konfirmasi muncul dengan warning
3. User klik **"Hapus"** untuk konfirmasi
4. Data terhapus dari sistem
5. Tabel refresh otomatis
6. Audit log tercatat

### Skenario 4: Mencari & Filter Data

1. User ketik di search bar
2. Tabel filter otomatis (real-time)
3. User klik tombol **"Filter"**
4. Panel filter muncul
5. User pilih filter (jenis/status)
6. Tabel update sesuai filter
7. Info jumlah data ditampilkan di bawah

### Skenario 5: Ekspor Data

1. User klik salah satu tombol: **CSV**, **Excel**, atau **PDF**
2. Browser download file otomatis
3. Filename: `pelatihan_YYYYMMDD.ext`
4. File berisi data yang terfilter saat itu

## 📊 Contoh Data

### Data dengan Status "Sudah Melaksanakan"

| Personel | Jenis Pelatihan | Tanggal Mulai | Tanggal Selesai | Berlaku Hingga | Status |
|----------|----------------|---------------|-----------------|----------------|--------|
| dr. Ahmad Yani | KIBI | 15 Jan 2023 | 15 Mar 2023 | 15 Mar 2025 | ✅ Sudah Melaksanakan |
| drg. Siti Nurhaliza | SUSDOKBANG | 01 Jun 2022 | 01 Des 2022 | 01 Des 2024 | ✅ Sudah Melaksanakan |

### Data dengan Status "Belum Melaksanakan"

| Personel | Jenis Pelatihan | Tanggal Mulai | Tanggal Selesai | Berlaku Hingga | Status |
|----------|----------------|---------------|-----------------|----------------|--------|
| Dewi Lestari | SUSPAKES | - | - | - | ⚪ Belum Melaksanakan |
| drg. Kartika Putri | SEKKAU | - | - | - | ⚪ Belum Melaksanakan |

## 🔐 Integrasi dengan Modul Lain

### ✅ Modul Personel
- Data personel otomatis ter-load di dropdown
- Filter berdasarkan satuan (untuk AdminSatuan)
- Menampilkan NRP dan nama lengkap

### 📢 Modul Notifikasi
- **(Future)** Notifikasi otomatis jika personel belum melaksanakan pelatihan
- **(Future)** Reminder untuk pelatihan wajib

### 📝 Modul Log Aktivitas
- Setiap aksi (create, update, delete) tercatat
- Timestamp dan user ID tersimpan
- Dapat diaudit oleh SuperAdmin

## 💻 Implementasi Teknis

### File Structure

```
src/
├── pages/
│   └── PendidikanPelatihan.tsx         # Main page component (490 lines)
├── components/
│   └── pelatihan/
│       ├── PelatihanFormModal.tsx      # Form modal for add/edit
│       └── DeleteConfirmDialog.tsx     # Delete confirmation dialog
├── types/
│   └── models.ts                       # Updated with StatusPelaksanaan
├── data/
│   └── seed.ts                         # Updated seed data
└── App.tsx                             # Updated routing
```

### Key Technologies

- **React 18**: Functional components with hooks
- **TypeScript**: Full type safety
- **Zustand**: State management (auth, UI)
- **React Router**: Client-side routing
- **date-fns**: Date formatting
- **jsPDF + autoTable**: PDF export
- **XLSX**: Excel export
- **LocalStorage**: Data persistence via Repository pattern

### Data Model

```typescript
interface Pelatihan {
  id: string;
  personelId: string;
  jenis: "KIBI" | "SUSDOKBANG" | "SUSPAKES" | 
         "SUSKESBANGAN" | "SEKKAU" | "SESKO" | "SES KOAU";
  tanggalMulai?: string;
  tanggalSelesai?: string;
  sertifikatBerlakuHingga?: string;
  statusPelaksanaan: "Sudah Melaksanakan" | "Belum Melaksanakan";
  createdAt: string;
  updatedAt: string;
}
```

### API Pattern (Repository)

```typescript
const pelatihanRepo = new Repository<Pelatihan>('pelatihan', 'Pelatihan');

// Read
const data = pelatihanRepo.getAll();
const item = pelatihanRepo.getById(id);

// Create
pelatihanRepo.create(data, userId);

// Update
pelatihanRepo.update(id, updates, userId);

// Delete
pelatihanRepo.delete(id, userId);
```

## 🎨 UI/UX Highlights

### Responsive Design
- **Mobile**: Single column, stacked buttons
- **Tablet**: 2-column layout
- **Desktop**: Full table with all columns visible

### Color Scheme (AdminLTE)
- **Primary**: #3c8dbc (Blue) - Primary actions
- **Success**: #00a65a (Green) - "Sudah Melaksanakan"
- **Secondary**: #6c757d (Gray) - "Belum Melaksanakan"
- **Danger**: #dd4b39 (Red) - Delete action

### Accessibility
- Clear button labels
- Icon + text buttons
- High contrast badges
- Modal keyboard navigation (ESC to close)

## 🧾 Manfaat Sistem

1. ✅ **Pelacakan Mudah**: Status pelatihan clear & simple
2. 📊 **Laporan Siap**: Export dalam 1 klik
3. 🔒 **Aman**: Role-based access control
4. 📱 **Responsive**: Bekerja di mobile & desktop
5. ⚡ **Cepat**: Real-time search & filter
6. 📝 **Audit Trail**: Semua perubahan tercatat
7. 🎯 **Perencanaan**: Basis data untuk pelatihan berikutnya

## 🚀 Cara Menggunakan

### Login
```
URL: http://localhost:5173/login

Akun Test:
- SuperAdmin: superadmin@binprofkes.mil.id / admin123
- AdminSatuan: admin.halim@binprofkes.mil.id / admin123
- Operator: operator@binprofkes.mil.id / operator123
- Viewer: viewer@binprofkes.mil.id / viewer123
```

### Navigasi
1. Klik **"Pendidikan & Pelatihan"** di sidebar
2. Dashboard statistik muncul di atas
3. Tabel data di bawah
4. Gunakan search/filter sesuai kebutuhan

### Akses Berdasarkan Role
- **SuperAdmin**: Lihat semua data, full CRUD
- **AdminSatuan**: Lihat & kelola data satuan sendiri
- **Operator**: Lihat semua, tambah baru saja
- **Viewer**: Lihat saja, tanpa edit/hapus

## 📚 Dokumentasi Tambahan

- **Type Definitions**: `src/types/models.ts`
- **Seed Data**: `src/data/seed.ts`
- **Repository Pattern**: `src/services/repository.ts`
- **Main Page**: `src/pages/PendidikanPelatihan.tsx`

## 🔮 Future Enhancements

- [ ] Bulk upload via Excel
- [ ] Automatic certificate expiry notifications
- [ ] Training calendar view
- [ ] Training statistics dashboard
- [ ] Integration with external training systems
- [ ] Certificate file upload & storage
- [ ] Training history timeline per personnel
- [ ] Advanced reporting (by satuan, by type, by year)

## 🎉 Kesimpulan

Modul Pendidikan & Pelatihan telah diimplementasikan dengan lengkap sesuai spesifikasi. Sistem menyediakan antarmuka yang user-friendly, fitur CRUD yang robust, sistem filtering yang powerful, dan export multi-format. Dengan role-based access control yang ketat dan audit logging yang comprehensive, modul ini siap digunakan untuk mengelola data pelatihan tenaga kesehatan TNI AU secara efektif dan efisien.

---

**Developed for**: BINPROFKES TNI AU  
**Module**: Pendidikan & Pelatihan  
**Version**: 1.0.0  
**Date**: December 2024
