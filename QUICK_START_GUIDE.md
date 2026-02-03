# E-RM Portability & Cross-Facility Portal - Quick Start Guide

## New Feature Overview

This implementation adds Electronic Medical Record (E-RM) portability and a cross-facility portal for BINPROFKES, enabling:

1. **Portable Medical Records** - Medical history travels with personnel, not tied to location
2. **Single Longitudinal Record** - Complete medical history across all RSAU/Puskesau facilities
3. **Continuity of Care** - Exportable medical summaries for transfers
4. **Cross-Facility Access** - Puskesau can access RSAU records with mandatory audit trail
5. **Rikkes Mode** - Standardized periodic health examination workflow

## Quick Start

### 1. Login as Different User Types

#### SuperAdmin / RSAU Staff
```
Email: superadmin@binprofkes.mil.id
Password: admin123
```
- Full access to all E-RM features
- Can view all medical records across facilities
- No audit requirement

#### Puskesau User
```
Email: puskesau.jakarta@binprofkes.mil.id
Password: puskesau123
```
- Controlled access with mandatory justification
- Must select access reason before viewing records
- All access is logged

### 2. Access E-RM Features

#### For RSAU Users
1. Login as SuperAdmin/Admin/Operator
2. Navigate to **"E-RM"** in sidebar (Activity icon)
3. Search personnel by NRP or Name
4. Click **"View Records"** (FileText icon) to see medical timeline
5. Click **"Export"** (Download icon) to generate Continuity of Care summary
6. See statistics: total visits, facilities visited, recent visits

#### For Puskesau Users
1. Login as Puskesau user
2. Navigate to **"Portal Faskes"** in sidebar (Shield icon)
3. Search personnel by NRP or Name
4. Click **"Akses"** (Shield icon) - This opens access justification modal
5. **Select Access Reason** (Mandatory):
   - Rikkes (Periodic Health Exam)
   - Dikbangum (Education & Training)
   - Rujukan (Referral)
   - Lanjutan (Follow-up Treatment)
   - Lainnya (Other - requires explanation)
6. View limited E-RM data after justification

### 3. Rikkes (Periodic Health Examination)

1. Access Rikkes mode from E-RM page
2. For Puskesau: Click **"Rikkes"** (Crosshair icon)
3. For RSAU: Access from personnel actions
4. Fill in:
   - **Tahun Rikkes**: Year of examination
   - **Jenis Rikkes**: Periodik / Dinas Luar / Lainnya
   - **Hasil Penunjang**: Lab, X-ray, EKG, Audiometry, Drug Test
   - **Kesehatan Categories**: Umum, Mata, Gigi, THT, Jiwa
   - **Kesimpulan**: Layak / Tidak Layak / Perlu Observasi
   - **Rekomendasi**: Treatment recommendations
5. Click **"Generate Resume"** to auto-create medical summary
6. Click **"Simpan Rikkes"** to save record

### 4. Export Continuity of Care

Used when personnel transfer to new unit or seek care at different facility.

1. From E-RM page, click **"Export"** for any personnel
2. Enter **Fasilitas Tujuan** (destination facility)
3. Add **Catatan Pemindahan** (transfer notes - optional)
4. Click **"Export Ringkasan"**
5. System generates complete medical summary including:
   - Recent Rikkes results
   - Diagnoses (last 20)
   - Procedures (last 20)
   - Medication history
   - Allergies
   - Transfer notes

## Key Concepts

### Identity-Based vs Location-Based Records

**Old Way**: Records tied to facility/hospital location
**New Way**: Records tied to patient identity (NRP)

**Benefits**:
- Records accessible from any facility
- No data loss during unit transfer
- Complete medical history always available
- Single longitudinal record

### Audit Trail & Justification

Puskesau users must justify every cross-facility access:

1. **Why Required**: Ensures privacy and prevents unauthorized access
2. **What's Logged**:
   - Who accessed (user ID)
   - Which patient (personel ID)
   - From where (source facility)
   - To where (target facility)
   - Why (access reason)
   - When (timestamp)
   - What data was accessed

3. **How to View**: Check "Log Aktivitas" page (if you have access)

### Single Longitudinal Record

All medical events from all facilities are aggregated:

- Chronological timeline
- Shows which facility each event occurred at
- Filter by examination type
- Filter by facility
- Complete history in one view

## Common Workflows

### Workflow 1: Personnel Transfer

**Scenario**: Personnel moves from Lanud Halim to Lanud Hasanuddin

1. Before transfer, access personnel in E-RM
2. Click "Export" to generate Continuity of Care
3. Enter new unit as destination
4. Save/export the summary document
5. Personnel brings summary to new facility
6. New facility can see complete history

### Workflow 2: Puskesau Rikkes

**Scenario**: Puskesau needs to conduct Rikkes for personnel

1. Login as Puskesau user
2. Go to Portal Faskes
3. Search personnel by NRP
4. Click "Akses" with reason "Rikkes"
5. View medical history to understand health status
6. Click "Rikkes" to conduct examination
7. Fill in Rikkes form
8. Generate resume
9. Save Rikkes record

### Workflow 3: Cross-Facility Referral

**Scenario**: Patient needs specialized care at different RSAU

1. Current facility generates Continuity of Care
2. Export includes current medications, allergies, recent procedures
3. Patient brings summary to new facility
4. New facility can quickly understand patient history
5. Treatment continues without data gaps

## User Interface Guide

### E-RM Page Elements

#### Search Bar
- Toggle between NRP and Name search
- NRP recommended for precise results

#### Personel List (Table on Desktop, Cards on Mobile)
- Shows: NRP, Name, Rank, Unit, Visits, Facilities
- Actions:
  - FileText icon: View medical records
  - Download icon: Export summary
  - Shield icon: Access with justification (Puskesau only)
  - Crosshair icon: Rikkes mode (Puskesau only)

#### Statistics Badges
- Total number of visits
- Number of different facilities visited
- Most recent visit date

### E-RM Viewer Modal

#### Summary Card (Blue)
- Total visits count
- Facilities count
- Examination types count
- Main facility

#### Timeline
- Chronological display of all medical events
- Blue dots: Event markers
- Connecting lines: Show timeline flow
- Facility badges: Where each event occurred

#### Event Cards
- Date and examination type badge
- Facility name
- Description
- Diagnosis (amber box)
- Procedures (green box)
- Supporting results

### Cross-Facility Access Modal (Puskesau Only)

#### Warning Banner (Amber)
- Reminds about mandatory audit trail
- Explains access logging

#### Personnel Info
- Read-only display of patient details
- Confirms correct patient

#### Access Reason Dropdown (Required)
- Select from predefined options
- Rikkes, Dikbangum, Rujukan, Lanjutan, Lainnya
- Must select before access granted

#### Additional Notes
- Required for "Lainnya" reason
- Optional for others

### Continuity of Care Export Modal

#### Warning Banner (Blue)
- Explains portable medical summary concept

#### Patient Info
- Read-only patient details

#### Destination Facility (Required)
- Where patient is going
- New unit or other facility

#### Transfer Notes (Optional)
- Special instructions for receiving facility
- Context for transfer

#### Summary Preview
- What will be included in export

### Rikkes Modal

#### Year & Type Selection
- Year of examination
- Type: Periodik, Dinas Luar, Lainnya

#### Supporting Tests (Lab Penunjang)
- Lab Darah (Blood Test)
- Lab Urine (Urine Test)
- Rontgen (X-Ray)
- EKG
- Audiometri (Hearing Test)
- Tes Narkoba (Drug Test)

#### Health Status Categories
- Kesehatan Umum (General Health)
- Kesehatan Mata (Eye Health)
- Kesehatan Gigi (Dental Health)
- Kesehatan THT (ENT)
- Kesehatan Jiwa (Mental Health)

Each has status dropdown:
- Sehat (Healthy)
- Tidak Sehat (Not Healthy)
- Sehat dengan Catatan (Healthy with Notes)

#### Conclusion & Recommendation
- Kesimpulan: Layak / Tidak Layak / Perlu Observasi
- Rekomendasi: Free text for recommendations

#### Actions
- Generate Resume: Auto-create summary text
- Save: Save Rikkes record

## Troubleshooting

### Can't Access Medical Records?

**Check**:
- Are you logged in?
- Do you have correct role? (Viewer cannot access E-RM)
- If Puskesau: Did you provide access reason?

### Can't See E-RM Page in Sidebar?

**Check**:
- Your role must be: SuperAdmin, AdminSatuan, Operator, or Puskesau
- Viewer role does not have E-RM access

### Cross-Facility Access Button Not Working?

**For Puskesau Users**:
- Must select access reason
- If "Lainnya", must provide explanation

### Records Not Showing Across Facilities?

**Check**:
- Records are created with different satuan values
- Records are linked to same personelId
- Check localStorage has `rekam_medis` data

## Data Structure

### Medical Record Flow

```
Personel (NRP) 
  ↓
Multiple Medical Records (rekam_medis)
  ├─ Record 1: Unit A, Umum, 2024-01-15
  ├─ Record 2: Unit B, Rujukan, 2024-02-10
  └─ Record 3: Unit C, Dikbangum, 2024-03-01
```

All records aggregated into single timeline view.

### Cross-Facility Access Flow

```
Puskesau User Request
  ↓
Select Access Reason (Mandatory)
  ↓
Provide Justification (if needed)
  ↓
Access Granted
  ↓
Audit Log Created (akses_fasilitas)
  ↓
Medical Records Displayed
```

## Security Notes

1. **All cross-facility access is logged**
2. **Puskesau users must justify access**
3. **Access reasons are predefined**
4. **Audit trail is immutable**
5. **No access deletion possible**

## Support

For issues or questions:
1. Check documentation: `ERM_PORTABILITY_FEATURES.md`
2. Review implementation: `IMPLEMENTATION_SUMMARY.md`
3. Check console for errors
4. Verify user permissions
5. Clear localStorage to reinitialize seed data

## Training Recommendations

### For RSAU Staff
1. Overview of E-RM portability concept
2. How to view cross-facility records
3. How to generate Continuity of Care
4. When to export medical summaries
5. Rikkes workflow

### For Puskesau Staff
1. Role limitations and access control
2. Mandatory audit trail requirements
3. How to justify access correctly
4. Selecting appropriate access reasons
5. Rikkes-specific workflows

### For Admins
1. Audit log review
2. Access pattern analysis
3. User permission management
4. System monitoring
