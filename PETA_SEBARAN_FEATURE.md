# Fitur Peta Sebaran - Dokumentasi

## Gambaran Umum

Halaman **Peta Sebaran** adalah fitur interaktif untuk memvisualisasikan distribusi fasilitas kesehatan TNI AU di seluruh Indonesia. Fitur ini dilengkapi dengan kemampuan pencarian, filter, dan clustering marker otomatis.

## Fitur Utama

### 1. Peta Interaktif (Leaflet)

- **Tile OSM Default**: Menggunakan OpenStreetMap sebagai base map
- **Custom Marker Icons**: Setiap jenis fasilitas memiliki ikon dan warna berbeda:
  - 🔵 **Lanud** - Biru
  - 🔴 **RSAU** - Merah  
  - 🟣 **Kodau** - Ungu
  - 🟢 **Koopsau** - Hijau
  - 🟠 **Satrad** - Oranye
- **Cluster Marker Otomatis**: Marker secara otomatis mengelompok saat banyak titik di area yang sama
- **Fit Bounds**: Peta otomatis menyesuaikan zoom berdasarkan hasil filter/pencarian
- **Kontrol Zoom**: Tombol zoom (+/-) dan reset view tersedia

### 2. Popup Marker Kaya Informasi

Setiap marker menampilkan popup dengan informasi lengkap:

#### Header
- Nama fasilitas
- Badge jenis fasilitas
- Badge komando

#### Ringkasan Angka
- Total Personel
- Dokter
- Dokter Gigi
- Perawat
- Spesialis

#### Daftar Dokter
- Scrollable list (max tinggi 200px)
- Setiap item menampilkan:
  - Nama (tebal)
  - Spesialisasi (kecil)
  - Badge "Aktif" bila aktif
  - Highlight kuning untuk dokter yang cocok dengan pencarian

#### Tombol Aksi
- **"Lihat detail"** (placeholder untuk fitur future)

### 3. Sidebar Pencarian & Filter

#### Search Bar Global
- Mencari teks di **nama fasilitas**, **komando**, dan **nama dokter** sekaligus
- Contoh query yang didukung:
  - `"Esnawan"` - mencari fasilitas RSAU dr. Esnawan
  - `"Halim"` - mencari Lanud Halim
  - `"KOOPSAU I"` - mencari semua fasilitas KOOPSAU I
  - `"drg."` - mencari semua dokter gigi
  - `"Penyakit Dalam"` - mencari dokter spesialis penyakit dalam

#### Filter Cepat

**Jenis Fasilitas** (Checkbox Multi-select):
- ☑️ Klinik Lanud
- ☑️ RSAU
- ☑️ Koopsau
- ☑️ Kodau
- ☑️ Kosek
- ☑️ Satrad

**Komando** (Multi-select):
- KOOPSAU I / II / III
- KODAU I / II / III
- Kosek
- Satrad

**Spesialisasi Dokter**:
- Input bebas dengan autocomplete dari data existing
- Multiple selection
- Badge removable untuk setiap spesialisasi terpilih

#### Mode Tampilan
Tiga mode tampilan tersedia:
1. **Peta** - Hanya tampilan peta
2. **List** - Hanya tampilan tabel
3. **Kedua** - Split view (peta + tabel)

#### Hasil Sebagai List
- Tabel ringkas menampilkan:
  - Nama Fasilitas
  - Jenis
  - Komando  
  - Jumlah Dokter
- Tombol **"Focus"** untuk pan ke marker & open popup
- Click pada row untuk langsung pan ke fasilitas

### 4. Highlight Hasil Pencarian

- **Ring Marker**: Marker yang match diberi stroke tebal warna emas
- **Match Badge**: Jika query cocok ke nama dokter, tampilkan badge "Cocok: dr. Andi, Sp.PD" di popup

### 5. Persistensi Data

Menggunakan LocalStorage dengan key:

- `binprofkes:fasilitas` - Data fasilitas + dokterList
- `binprofkes:map:ui` - Preferensi UI (mode view, filter terakhir, sidebar state)

Data otomatis tersimpan saat:
- Filter berubah
- Mode view berubah  
- Sidebar dibuka/tutup

### 6. Akses & Peran

- **Viewer+**: Semua role dapat mengakses halaman ini (read-only view)
- **SuperAdmin/AdminSatuan**: Aksi CRUD fasilitas/dokter via tombol "Kelola" (drawer form - future feature)

## Struktur File

```
src/
├── pages/
│   └── PetaSebaran.tsx              # Main page component
├── components/
│   └── map/
│       ├── MapView.tsx              # Map component with clustering
│       └── MapSidebar.tsx           # Sidebar with search & filters
├── store/
│   └── mapStore.ts                  # Zustand store untuk map state
├── utils/
│   └── mapIcons.ts                  # Custom marker icons & cluster icons
├── types/
│   └── models.ts                    # TypeScript interfaces (Fasilitas, Dokter)
└── data/
    └── seed.ts                      # Seed data dengan dokterList
```

## Cara Menggunakan

### Navigasi
1. Login ke aplikasi
2. Klik menu **"Peta Sebaran"** di sidebar kiri

### Pencarian
1. Ketik query di search bar atas sidebar
2. Hasil akan langsung terfilter di peta dan list

### Filter
1. Klik toggle **"Filter"** di sidebar
2. Pilih checkbox untuk jenis fasilitas
3. Pilih checkbox untuk komando
4. Tambah spesialisasi dengan mengetik dan klik tombol "+"

### Focus ke Fasilitas
1. **Dari List**: Click tombol "Focus" pada row
2. **Dari Peta**: Click marker langsung
3. Peta akan zoom dan pan ke fasilitas yang dipilih

### Reset Filter
1. Klik tombol **"Reset"** di sebelah toggle Filter
2. Semua filter akan dikembalikan ke default

### Toggle Sidebar
1. Klik tombol panah di sisi kiri layar
2. Sidebar akan slide in/out

## Dependencies

Package yang digunakan:

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "leaflet.markercluster": "^1.5.3",
  "@types/leaflet.markercluster": "^1.5.4"
}
```

## Teknologi

- **React 18** - UI library
- **TypeScript** - Type safety
- **Zustand** - State management dengan persist middleware
- **Leaflet** - Interactive maps
- **Leaflet.markercluster** - Marker clustering
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Future Enhancements

Fitur yang akan ditambahkan:

1. **CRUD Fasilitas**: Form drawer untuk tambah/edit/hapus fasilitas (admin only)
2. **CRUD Dokter**: Manage dokter di setiap fasilitas
3. **Export Data**: Export list fasilitas ke PDF/Excel
4. **Routing**: Tampilkan rute antara fasilitas
5. **Heat Map**: Visualisasi density fasilitas per area
6. **Filter Tambahan**: Filter by jumlah dokter, jumlah personel, dll
7. **Search History**: Simpan history pencarian terakhir
8. **Bookmark**: Bookmark fasilitas favorit

## Troubleshooting

### Marker tidak muncul
- Pastikan data fasilitas sudah di-seed dengan `seedData()`
- Check console untuk error
- Refresh halaman

### Cluster tidak bekerja
- Pastikan `leaflet.markercluster` sudah terinstall
- Import CSS cluster di `MapView.tsx` sudah benar

### Popup tidak muncul
- Click marker langsung (bukan area sekitar)
- Zoom lebih dekat jika marker ter-cluster

### Filter tidak bekerja
- Check store state dengan React DevTools
- Pastikan `getFilteredFasilitas()` logic sudah benar

## Kontributor

- **Developer**: AI Assistant
- **Framework**: React + TypeScript
- **Tanggal**: November 2024

## Lisensi

Internal use only - BINPROFKES TNI AU
