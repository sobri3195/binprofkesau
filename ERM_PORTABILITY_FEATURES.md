# E-RM Portability & Cross-Facility Portal Features

## Overview

This document describes the Electronic Medical Record (E-RM) portability and cross-facility access features implemented for the BINPROFKES system, enabling seamless medical record continuity across RSAU and Puskesau facilities in the Indonesian Air Force (TNI AU).

## Features Implemented

### 1. E-RM Portability During Unit Transfer

#### Identity-Based Records (Not Location-Based)
- **File**: `src/pages/ElectronikRecordMedis.tsx`
- **Concept**: E-RM access remains active regardless of unit/satuan changes
- **Benefit**: Records are tied to patient identity (NRP), not current location
- **Implementation**: Medical records stored with `personelId` reference

#### Single Longitudinal Record Across Facilities
- **Service**: `src/services/erm.ts`
- **Feature**: Complete medical history from all RSAU/Puskesau facilities
- **Methods**:
  - `getByPersonelIdAcrossFacilities()` - Retrieves all records across facilities
  - `getTimeline()` - Generates chronological timeline of all medical events
  - `getDiagnosisHistory()` - Historical diagnoses from all facilities
  - `getProceduresHistory()` - Historical medical procedures from all facilities
  - `getSupportingResults()` - Lab/imaging results from all facilities

#### Continuity of Care Summary (CCS) Export
- **Service**: `src/services/continuityOfCare.ts`
- **Feature**: Portable medical summary for transfer to other facilities
- **Components**:
  - General health summary
  - Last 20 diagnoses
  - Last 20 medical procedures
  - Medication history
  - Last Rikkes (Periodic Health Exam) results
  - Allergy information
  - Transfer notes
- **Export Format**: Text document with standardized sections
- **Usage**: When personnel transfer between units or seek care at different facilities

### 2. Cross-Facility Portal for Puskesau & RSAU

#### Role-Based Access Control
- **File**: `src/types/models.ts`, `src/App.tsx`
- **New Role**: `Puskesau` - Limited to Puskesau personnel
- **Access Permissions**:
  - **SuperAdmin**: Full access
  - **AdminSatuan**: Full E-RM access within their unit
  - **Operator**: Full E-RM access within their unit
  - **Puskesau**: Controlled access with mandatory justification
  - **Viewer**: Read-only access to dashboard only

#### Controlled Patient Search
- **Search Methods**:
  - By NRP (Military Personnel Number) - Primary identifier
  - By Name - Secondary identifier
- **Access Control**: Puskesau users must provide justification before accessing records

#### Cross-Facility E-RM Viewer
- **Component**: `src/components/erm/ERMViewerModal.tsx`
- **Features**:
  - Timeline view of all medical visits across facilities
  - Filter by examination type (Umum, Rikkes, Dikbangum, Rujukan, Lanjutan)
  - Filter by facility
  - Show diagnosis, procedures, and supporting test results
  - Facility badges showing which facilities contributed to the record
- **Visual Elements**:
  - Timeline with colored dots and connecting lines
  - Card-based layout for each medical event
  - Color-coded sections for diagnosis (amber) and procedures (green)

### 3. Rikkes Mode (Periodic Health Examination)

#### Rikkes Template System
- **Component**: `src/components/erm/RikkesModal.tsx`
- **Service**: `src/services/rikkes.ts`
- **Features**:
  - Standardized Rikkes form
  - Types: Periodik, Dinas Luar, Lainnya
  - Comprehensive health assessments

#### Health Examination Categories
1. **Kesehatan Umum** (General Health)
2. **Kesehatan Mata** (Eye Health)
3. **Kesehatan Gigi** (Dental Health)
4. **Kesehatan THT** (ENT - Ear, Nose, Throat)
5. **Kesehatan Jiwa** (Mental Health)

#### Supporting Test Results
- Lab Darah (Blood Test)
- Lab Urine (Urine Test)
- Rontgen (X-Ray)
- EKG (Electrocardiogram)
- Audiometri (Hearing Test)
- Tes Narkoba (Drug Test)

#### Auto-Generate Resume
- **Method**: `generateResumeMedis()` in `rikkesService`
- **Output**: Structured text summary including:
  - Rikkes type and year
  - Health status for all categories
  - All supporting test results
  - Conclusion (Layak/Tidak Layak/Perlu Observasi)
  - Recommendations

### 4. Audit Trail & Access Justification

#### Mandatory Access Reason
- **File**: `src/components/erm/CrossFacilityAccessModal.tsx`
- **Required Fields**:
  - Alasan Akses (Access Reason):
    - Rikkes (Periodic Health Exam)
    - Dikbangum (Education & Training)
    - Rujukan (Referral)
    - Lanjutan (Follow-up Treatment)
    - Lainnya (Other - requires additional explanation)
  - Keterangan (Additional Details) - Required for "Lainnya"

#### Audit Logging
- **Service**: `src/services/fasilitasAccess.ts`
- **Logged Information**:
  - User ID accessing the record
  - Personnel ID being accessed
  - Source facility
  - Target facility
  - Access reason
  - Timestamp
  - Data accessed (timeline, supporting results, medical summary)

#### Access Statistics
- **Method**: `getAccessStats()` in `fasilitasAccessService`
- **Tracked Metrics**:
  - Total access count per patient
  - Access breakdown by reason type
  - Access breakdown by target facility
  - Most recent access

## Database Schema

### New Tables

#### `rekam_medis` (Medical Records)
```typescript
{
  id: string
  personelId: string        // Reference to personnel
  satuan: string            // Unit where record was created
  jenisPemeriksaan: 'Umum' | 'Rikkes' | 'Dikbangum' | 'Lanjutan' | 'Rujukan'
  diagnosa?: string
  tindakan?: string
  keluhan?: string
  hasilPenunjang?: Array<{jenis, hasil, tanggal}>
  obat?: Array<{nama, dosis, durasi}>
  dokterId?: string
  status: 'Draft' | 'Final' | 'Selesai'
  catatanTambahan?: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `akses_fasilitas` (Cross-Facility Access Log)
```typescript
{
  id: string
  userId: string
  personelId: string
  fasilitasAsal: string     // Original facility
  fasilitasTujuan: string   // Target facility being accessed
  alasanAkses: 'Rikkes' | 'Dikbangum' | 'Rujukan' | 'Lanjutan' | 'Lainnya'
  keteranganAlasan?: string
  tanggalAkses: timestamp
  dataDiakses?: {
    timeline?: boolean
    hasilPenunjang?: boolean
    resumeMedis?: boolean
  }
  createdAt: timestamp
}
```

#### `rekam_rikkes` (Periodic Health Exam Records)
```typescript
{
  id: string
  personelId: string
  satuan: string
  tahunRikkes: string
  jenisRikkes: 'Periodik' | 'Dinas Luar' | 'Lainnya'
  hasilPenunjang?: {
    labDarah?: string
    labUrine?: string
    rontgen?: string
    ekg?: string
    audiometri?: string
    tesNarkoba?: string
    lainnya?: Array<{jenis, hasil}>
  }
  kesehatanUmum?: 'Sehat' | 'Tidak Sehat' | 'Sehat dengan Catatan'
  kesehatanMata?: ...
  kesehatanGigi?: ...
  kesehatanTHT?: ...
  kesehatanJiwa?: ...
  kesimpulan?: 'Layak' | 'Tidak Layak' | 'Perlu Observasi'
  rekomendasi?: string
  dokterId?: string
  resumeMedis?: string       // Auto-generated summary
  status: 'Draft' | 'Selesai'
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `continuity_of_care` (Continuity of Care Exports)
```typescript
{
  id: string
  personelId: string
  fasilitasAsal: string
  fasilitasTujuan: string
  tanggalEkspor: timestamp
  ringkasanMedis: string
  riwayatDiagnosa?: Array<{diagnosa, tanggal, fasilitas}>
  riwayatTindakan?: Array<{tindakan, tanggal, fasilitas}>
  riwayatObat?: Array<{nama, dosis, periode}>
  alergi?: string
  hasilRikkesTerakhir?: {tahun, kesimpulan, rekomendasi}
  catatanPemindahan?: string
  userId: string
  createdAt: timestamp
}
```

## User Interface

### E-RM Page (`/app/erm`)

#### For RSAU Users (SuperAdmin, AdminSatuan, Operator)
1. **Search Personnel** - By NRP or name
2. **View Medical Records** - Timeline view across all facilities
3. **Export Continuity of Care** - Generate portable medical summary
4. **Statistics Display**:
   - Total visits
   - Number of facilities visited
   - Most recent visit

#### For Puskesau Users
1. **Same search interface** - Restricted access
2. **Access with Justification** - Must select reason before viewing records
3. **Rikkes Mode** - Specialized interface for periodic health exams
4. **Warning banner** - Reminds about audit trail requirements

### Modals

#### ERM Viewer Modal
- Timeline of all medical events
- Facility indicators
- Diagnosis and procedure cards
- Filtering options

#### Cross-Facility Access Modal
- Personnel information display
- Access reason dropdown (required)
- Additional details field (for "Lainnya" reason)
- Warning about audit logging

#### Continuity of Care Export Modal
- Facility destination input
- Transfer notes (optional)
- Summary of what will be exported

#### Rikkes Modal
- Year and type selection
- Supporting test result inputs
- Health status dropdowns for 5 categories
- Conclusion and recommendation inputs
- Auto-generate resume button

## Security Features

1. **Role-Based Access Control**
   - Different interface based on user role
   - Puskesau users have restricted view
   - All access is logged

2. **Mandatory Justification**
   - Puskesau users must provide access reason
   - Reasons are predefined for consistency
   - "Other" requires additional explanation

3. **Audit Trail**
   - Every cross-facility access is logged
   - Timestamp recorded
   - User who accessed is tracked
   - Data accessed is tracked

4. **Data Segregation**
   - Personnel data is location-agnostic
   - Medical records from all facilities are accessible
   - But access is controlled and logged

## Testing

### Seed Data
New seed accounts added in `src/data/seed.ts`:
- **Puskesau User**: `puskesau.jakarta@binprofkes.mil.id` / `puskesau123`

### Sample Medical Records
- 3 sample medical records across different facilities
- 1 sample Rikkes record

### Test Scenarios

1. **As RSAU User**:
   - Search personnel by NRP
   - View complete medical timeline
   - Filter by examination type
   - Export Continuity of Care summary
   - Create new Rikkes record

2. **As Puskesau User**:
   - Try to access medical records (should show justification modal)
   - Select access reason (Rikkes, Dikbangum, etc.)
   - View restricted E-RM data
   - Create Rikkes records

3. **Cross-Facility Access**:
   - Access records from personnel at different units
   - Verify audit log is created
   - Check access statistics

4. **Continuity of Care Export**:
   - Generate summary for transfer
   - Verify all medical history is included
   - Check format of exported document

## Key Benefits

1. **Portability**: Medical records travel with personnel, not tied to location
2. **Continuity**: Complete medical history always available across facilities
3. **Controlled Access**: Puskesau access is justified and audited
4. **Standardization**: Rikkes follows uniform template
5. **Auditability**: All cross-facility access is logged and traceable
6. **Efficiency**: Auto-generated summaries reduce documentation time

## Future Enhancements

Potential additions to consider:
- Integration with existing hospital information systems
- Digital signature for exported summaries
- Real-time sync across facilities
- Mobile app for field medical personnel
- Analytics dashboards for health trends
- Integration with personnel transfer systems
