# Paket Upload Google Apps Script (GAS)

Folder ini disiapkan supaya bisa langsung dipakai untuk deploy backend sinkronisasi BINPROFKES ke Google Sheets.

## Isi Folder

- `Code.gs` → script utama Web App (endpoint `doGet` dan `doPost`).
- `appsscript.json` → manifest project GAS (siap upload via editor atau CLASP).
- `templates/binprofkes_db_template.csv` → template spreadsheet (format CSV).
- `templates/binprofkes_seed_payload.json` → contoh payload data awal untuk sinkronisasi.
- `templates/generate-xlsx.mjs` → script pembuat template Excel (`.xlsx`) dari CSV.

## Cara Upload ke Google Apps Script (Manual)

1. Buat **Google Spreadsheet** baru.
2. Buka **Extensions → Apps Script**.
3. Hapus isi file `Code.gs` default, lalu salin isi `Code.gs` dari folder ini.
4. Buka **Project Settings → Show "appsscript.json" manifest file in editor**.
5. Salin isi `appsscript.json` dari folder ini.
6. Klik **Deploy → New deployment → Web app**:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (atau sesuai kebutuhan)
7. Simpan URL Web App, lalu masukkan ke `.env` frontend:

```bash
VITE_GAS_WEB_APP_URL=https://script.google.com/macros/s/AKfycb.../exec
```

## Cara Upload via CLASP (Opsional)

Jika ingin upload dari lokal:

```bash
npm i -g @google/clasp
clasp login
clasp create --type sheets --title "BINPROFKES GAS"
clasp push
clasp deploy --description "initial web app"
```

> Pastikan file `Code.gs` dan `appsscript.json` ada di root project CLASP saat `clasp push`.

## Struktur Sheet yang Dibutuhkan

Nama sheet yang dipakai script: `binprofkes_db`.

Kolom wajib:

- `key`
- `value`

Template `.csv` sudah menyiapkan struktur ini.

## Generate file Excel (.xlsx)

Karena repository ini tidak menyimpan file biner, file `.xlsx` digenerate dari template CSV:

```bash
node docs/google-apps-script/templates/generate-xlsx.mjs
```

Output:

- `docs/google-apps-script/templates/binprofkes_db_template.xlsx`

## Contoh Isi Data

- `binprofkes:users`
- `binprofkes:personel`
- `binprofkes:pelatihan`
- `binprofkes:fasilitas`

Nilai kolom `value` disimpan dalam bentuk string JSON.
