# E-RM Portability Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BINPROFKES E-RM System                       │
│                    (Single Longitudinal Record)                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
    ┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
    │  RSAU Lanud A  │   │  RSAU Lanud B  │   │  Puskesau C    │
    │  (Admin/Op)    │   │  (Admin/Op)    │   │  (Puskesau)    │
    └───────┬────────┘   └───────┬────────┘   └───────┬────────┘
            │                       │                       │
            │                       │                       │
    ┌───────▼─────────────────────▼─────────────────────▼────────┐
    │              E-RM Data Layer (Identity-Based)                │
    └───────────────────────────────────────────────────────────────┘
            │                       │                       │
    ┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
    │ rekam_medis    │   │ rekam_rikkes   │   │ continuity_of_care│
    └────────────────┘   └────────────────┘   └────────────────┘
            │                       │                       │
            └───────────────────────┼───────────────────────┘
                                    │
                            ┌───────▼────────┐
                            │ audit_log      │
                            │ (Access Trail) │
                            └────────────────┘
```

## Data Flow: Cross-Facility Access

```
┌───────────────────────────────────────────────────────────────────────┐
│ 1. Puskesau User Searches Personnel                              │
│    Input: NRP or Name                                           │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 2. System Displays Personnel Record                               │
│    Shows: Name, NRP, Current Unit, Medical Stats                │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 3. User Clicks "Akses" (Cross-Facility Access)                │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 4. Access Justification Modal Opens                              │
│    Required Fields:                                              │
│    • Alasan Akses (Rikkes/Dikbangum/Rujukan/Lanjutan/Lainnya)  │
│    • Keterangan (Required if "Lainnya")                          │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 5. User Provides Justification                                  │
│    Selects reason, adds details if needed                        │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 6. System Logs Access to akses_fasilitas Table                 │
│    Recorded:                                                    │
│    • userId (who accessed)                                      │
│    • personelId (whose record)                                  │
│    • fasilitasAsal (Puskesau C)                               │
│    • fasilitasTujuan (RSAU A/B)                                │
│    • alasanAkses (Reason provided)                               │
│    • tanggalAkses (Timestamp)                                    │
│    • dataDiakses (What was viewed)                               │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 7. Access Granted - E-RM Viewer Opens                           │
│    Displays:                                                    │
│    • Complete medical timeline                                   │
│    • All facility records                                       │
│    • Diagnoses, procedures, test results                         │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow: Continuity of Care Export

```
┌───────────────────────────────────────────────────────────────────────┐
│ 1. Personnel Preparing for Transfer                              │
│    Moving from: RSAU Lanud A → RSAU Lanud B                     │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 2. User Clicks "Export" on Personnel Record                    │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 3. Continuity of Care Export Modal Opens                        │
│    Required Fields:                                              │
│    • Fasilitas Tujuan (Destination facility)                      │
│    • Catatan Pemindahan (Transfer notes - optional)               │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 4. User Completes Export Form                                   │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 5. System Aggregates All Medical Data                          │
│    Queries:                                                     │
│    • All rekam_medis for personelId                            │
│    • Latest rekam_rikkes                                         │
│    • All diagnoses, procedures, medications                       │
│    • Allergy information                                         │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 6. Generate Continuity of Care Summary                           │
│    Creates structured document with:                              │
│    • Header with patient info, source/destination facilities        │
│    • General health summary                                      │
│    • Last Rikkes results                                       │
│    • Diagnosis history (last 20)                                │
│    • Procedure history (last 20)                                 │
│    • Medication history                                         │
│    • Allergy information                                       │
│    • Transfer notes                                             │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 7. Save to continuity_of_care Table                             │
│    Recorded:                                                    │
│    • personelId                                                 │
│    • fasilitasAsal (Current facility)                            │
│    • fasilitasTujuan (Destination facility)                        │
│    • tanggalEkspor (Export timestamp)                            │
│    • ringkasanMedis (Generated summary)                          │
│    • riwayatDiagnosa (Diagnosis history JSON)                    │
│    • riwayatTindakan (Procedure history JSON)                    │
│    • riwayatObat (Medication history JSON)                        │
│    • alergi (Allergy text)                                      │
│    • hasilRikkesTerakhir (Last Rikkes JSON)                     │
│    • catatanPemindahan (Transfer notes)                          │
│    • userId (Who generated export)                                │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 8. Export Text Document                                        │
│    Formatted, printable summary document                          │
│    Personnel brings to new facility                                │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow: Rikkes (Periodic Health Examination)

```
┌───────────────────────────────────────────────────────────────────────┐
│ 1. Puskesau or RSAU User Initiates Rikkes                    │
│    Accessing: Rikkes Mode from E-RM page                         │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 2. Rikkes Modal Opens                                         │
│    Displays Personnel Information                                 │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 3. User Fills Rikkes Form                                     │
│    Sections:                                                    │
│    A. Tahun & Jenis Rikkes                                    │
│    B. Hasil Penunjang (Supporting Tests)                         │
│       • Lab Darah, Lab Urine, Rontgen, EKG, etc.               │
│    C. Status Kesehatan (5 Categories)                            │
│       • Umum, Mata, Gigi, THT, Jiwa                           │
│    D. Kesimpulan & Rekomendasi                                  │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 4. User Clicks "Generate Resume" (Optional)                     │
│    Auto-creates structured medical summary                         │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 5. User Clicks "Simpan Rikkes"                               │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 6. Save to rekam_rikkes Table                                 │
│    Recorded:                                                    │
│    • personelId                                                 │
│    • satuan (Facility where Rikkes conducted)                   │
│    • tahunRikkes (Year)                                       │
│    • jenisRikkes (Periodik/Dinas Luar/Lainnya)                  │
│    • hasilPenunjang (All test results JSON)                       │
│    • kesehatanUmum, mata, gigi, tht, jiwa (5 categories)     │
│    • kesimpulan (Layak/Tidak Layak/Perlu Observasi)             │
│    • rekomendasi (Recommendations)                               │
│    • resumeMedis (Auto-generated summary)                         │
│    • dokterId (Who performed exam)                              │
│    • status (Draft/Selesai)                                     │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│ 7. Audit Log Created                                           │
│    Logged:                                                      │
│    • userId (who created Rikkes)                                │
│    • action: 'create'                                          │
│    • entity: 'RekamMedis'                                      │
│    • entityId: rekam_rikkes.id                                │
│    • timestamp                                                  │
└───────────────────────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
personel
  │
  ├─ 1:N ──> rekam_medis
  │              (Medical records from all facilities)
  │
  ├─ 1:N ──> rekam_rikkes
  │              (Periodic health examinations)
  │
  ├─ 1:N ──> continuity_of_care
  │              (Exported medical summaries)
  │
  └─ 1:N ──> akses_fasilitas
                 (Cross-facility access logs)

users
  │
  ├─ 1:N ──> akses_fasilitas
  │              (Who accessed which records)
  │
  └─ 1:N ──> continuity_of_care
                 (Who generated which exports)

audit_log
  │
  └─ N:1 ──> users
              (Who performed action)

fasilitas
  │
  └─ Linked via 'satuan' field in:
      • rekam_medis
      • rekam_rikkes
      • continuity_of_care
      • akses_fasilitas
```

## Role-Based Access Matrix

```
┌──────────────────────────────────────────────────────────────────────┐
│                      Feature Access Matrix                         │
├──────────────────────────────────────────────────────────────────────┤
│ Feature          │ SA │ AS │ OP │ VI │ PU │                      │
├──────────────────────────────────────────────────────────────────────┤
│ Dashboard        │ ✓ │ ✓ │ ✓ │ ✓ │ ✓ │                      │
│ Personel        │ ✓ │ ✓ │ ✓ │ ✓ │ ✗ │                      │
│ Pelatihan      │ ✓ │ ✓ │ ✓ │ ✓ │ ✗ │                      │
│ Peta            │ ✓ │ ✓ │ ✓ │ ✓ │ ✗ │                      │
│ Peta Sebaran    │ ✓ │ ✓ │ ✓ │ ✓ │ ✗ │                      │
│ E-RM (View)     │ ✓ │ ✓ │ ✓ │ ✗ │ ✓* │                      │
│ E-RM (Create)  │ ✓ │ ✓ │ ✓ │ ✗ │ ✓**│                      │
│ Export CoC      │ ✓ │ ✓ │ ✓ │ ✗ │ ✓ │                      │
│ Cross-Facility  │ ✓ │ ✗ │ ✗ │ ✗ │ ✓***│                      │
│ Rikkes Mode     │ ✓ │ ✓ │ ✓ │ ✗ │ ✓ │                      │
│ Log Aktivitas   │ ✓ │ ✓ │ ✗ │ ✗ │ ✗ │                      │
│ Manajemen User  │ ✓ │ ✗ │ ✗ │ ✗ │ ✗ │                      │
└──────────────────────────────────────────────────────────────────────┘
│ SA=SuperAdmin AS=AdminSatuan OP=Operator VI=Viewer PU=Puskesau     │
│ * Requires justification                                            │
│ ** Rikkes only                                                   │
│ *** Requires justification + audit trail                             │
└──────────────────────────────────────────────────────────────────────┘
```

## Medical Record Timeline Visualization

```
┌──────────────────────────────────────────────────────────────────────┐
│              E-RM Timeline: Single Longitudinal Record              │
├──────────────────────────────────────────────────────────────────────┤
│                                                               │
│  2024-03-15                                                  │
│  ● ────────────────────┐                                      │
│  │ Umum                │ Lanud Hasanuddin                     │
│  │ "Check-up rutin"     │ [Badge]                             │
│  │                      │                                     │
│  └──────────────────────┘                                     │
│     │                                                          │
│     │                                                          │
│  2024-02-10                                                  │
│  ● ────────────────────┐                                      │
│  │ Rujukan             │ RSAU Esnawan                        │
│  │ "Sakit gigi"        │ [Badge]                             │
│  │ Diagnosa: Karies     │                                     │
│  │ ┌─────────────────┐ │                                     │
│  │ │ Gigi berlubang │ │                                     │
│  │ └─────────────────┘ │                                     │
│  └──────────────────────┘                                     │
│     │                                                          │
│     │                                                          │
│  2024-01-15                                                  │
│  ● ────────────────────┐                                      │
│  │ Umum                │ Lanud Halim                         │
│  │ "Sakit kepala"      │ [Badge]                             │
│  │ Diagnosa: ISPA      │                                     │
│  │ ┌─────────────────┐ │                                     │
│  │ │ Infeksi saluran │ │                                     │
│  │ │ napasan atas    │ │                                     │
│  │ └─────────────────┘ │                                     │
│  │ ┌─────────────────┐ │                                     │
│  │ │ Obat: Para-    │ │                                     │
│  │ │ cetamol 500mg  │ │                                     │
│  │ └─────────────────┘ │                                     │
│  └──────────────────────┘                                     │
│                                                               │
└──────────────────────────────────────────────────────────────────────┘

Legend:
● - Medical event
│ - Timeline connection
[Badge] - Facility where event occurred
┌─┐ - Diagnosa/Procedure details
```

## Security Layers

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Security Architecture                           │
└──────────────────────────────────────────────────────────────────────┘

Layer 1: Authentication
├─ Login required
└─ Session management

Layer 2: Authorization (Role-Based)
├─ SuperAdmin: Full access
├─ AdminSatuan: Unit-level access
├─ Operator: Unit-level operations
├─ Viewer: Read-only dashboard
└─ Puskesau: Controlled cross-facility access

Layer 3: Justification (Puskesau Only)
├─ Mandatory access reason selection
├─ Predefined reasons only
├─ "Other" requires explanation
└─ Cannot bypass justification

Layer 4: Audit Trail
├─ Every access logged
├─ Immutable records
├─ Complete metadata (who, what, when, why)
└─ Cannot be deleted

Layer 5: Data Segregation
├─ Personnel data not tied to location
├─ Records aggregated by identity (NRP)
├─ Access controlled at query level
└─ Privacy maintained
```

## System Flow: Complete Patient Journey

```
Patient (Personel)
  │
  ├─► First Visit: Lanud A
  │    └─ Create rekam_medis #1
  │    └─ Stored with satuan="Lanud A"
  │
  ├─► Transfer to: Lanud B
  │    └─ Export Continuity of Care
  │    └─ Save to continuity_of_care
  │    └─ Bring summary to new location
  │
  ├─► Second Visit: Lanud B
  │    └─ Create rekam_medis #2
  │    └─ Stored with satuan="Lanud B"
  │
  ├─► Rikkes at: Puskesau C
  │    └─ Puskesau justifies access (rikkes)
  │    └─ Log to akses_fasilitas
  │    └─ View complete timeline (from A & B)
  │    └─ Create rekam_rikkes
  │    └─ Stored with satuan="Puskesau C"
  │
  └─► Aggregate View
       └─ All 3 records visible in single timeline
       └─ Different facilities shown with badges
       └─ Complete medical history accessible anywhere
```
