-- E-RM Portability & Cross-Facility Portal
-- Database Migration Script
-- PostgreSQL Schema Changes
-- Run this script to apply all schema changes

-- =====================================================
-- PART 1: Add fasilitasId to users table
-- =====================================================

-- Add facility ID column to track user's assigned facility
ALTER TABLE users
ADD COLUMN IF NOT EXISTS fasilitas_id TEXT;

-- =====================================================
-- PART 2: Create rekam_medis table (Medical Records)
-- =====================================================

-- Medical records - identity-based, not location-based
CREATE TABLE IF NOT EXISTS rekam_medis (
    id TEXT PRIMARY KEY,
    personel_id TEXT NOT NULL REFERENCES personel(id) ON DELETE CASCADE,
    satuan TEXT NOT NULL,
    jenis_pemeriksaan TEXT NOT NULL,
    diagnosa TEXT,
    tindakan TEXT,
    keluhan TEXT,
    hasil_penunjang JSONB,
    obat JSONB,
    dokter_id TEXT,
    status TEXT NOT NULL DEFAULT 'Draft',
    catatan_tambahan TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rekam_medis_personel ON rekam_medis(personel_id);
CREATE INDEX IF NOT EXISTS idx_rekam_medis_satuan ON rekam_medis(satuan);
CREATE INDEX IF NOT EXISTS idx_rekam_medis_jenis ON rekam_medis(jenis_pemeriksaan);
CREATE INDEX IF NOT EXISTS idx_rekam_medis_status ON rekam_medis(status);
CREATE INDEX IF NOT EXISTS idx_rekam_medis_created ON rekam_medis(created_at DESC);

-- =====================================================
-- PART 3: Create rekam_rikkes table (Periodic Health Exam)
-- =====================================================

-- Periodic health examination records (Rikkes)
CREATE TABLE IF NOT EXISTS rekam_rikkes (
    id TEXT PRIMARY KEY,
    personel_id TEXT NOT NULL REFERENCES personel(id) ON DELETE CASCADE,
    satuan TEXT NOT NULL,
    tahun_rikkes TEXT NOT NULL,
    jenis_rikkes TEXT NOT NULL,
    hasil_penunjang JSONB,
    kesehatan_umum TEXT,
    kesehatan_mata TEXT,
    kesehatan_gigi TEXT,
    kesehatan_tht TEXT,
    kesehatan_jiwa TEXT,
    kesimpulan TEXT,
    rekomendasi TEXT,
    dokter_id TEXT,
    resume_medis TEXT,
    status TEXT NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rekam_rikkes_personel ON rekam_rikkes(personel_id);
CREATE INDEX IF NOT EXISTS idx_rekam_rikkes_satuan ON rekam_rikkes(satuan);
CREATE INDEX IF NOT EXISTS idx_rekam_rikkes_tahun ON rekam_rikkes(tahun_rikkes);
CREATE INDEX IF NOT EXISTS idx_rekam_rikkes_jenis ON rekam_rikkes(jenis_rikkes);
CREATE INDEX IF NOT EXISTS idx_rekam_rikkes_status ON rekam_rikkes(status);
CREATE INDEX IF NOT EXISTS idx_rekam_rikkes_created ON rekam_rikkes(created_at DESC);

-- =====================================================
-- PART 4: Create akses_fasilitas table (Cross-Facility Access)
-- =====================================================

-- Cross-facility access logs for audit trail
CREATE TABLE IF NOT EXISTS akses_fasilitas (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    personel_id TEXT NOT NULL REFERENCES personel(id) ON DELETE CASCADE,
    fasilitas_asal TEXT NOT NULL,
    fasilitas_tujuan TEXT NOT NULL,
    alasan_akses TEXT NOT NULL,
    keterangan_alasan TEXT,
    tanggal_akses TIMESTAMP NOT NULL DEFAULT NOW(),
    data_diakses JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance and audit queries
CREATE INDEX IF NOT EXISTS idx_akses_fasilitas_personel ON akses_fasilitas(personel_id);
CREATE INDEX IF NOT EXISTS idx_akses_fasilitas_user ON akses_fasilitas(user_id);
CREATE INDEX IF NOT EXISTS idx_akses_fasilitas_alasan ON akses_fasilitas(alasan_akses);
CREATE INDEX IF NOT EXISTS idx_akses_fasilitas_tanggal ON akses_fasilitas(tanggal_akses DESC);
CREATE INDEX IF NOT EXISTS idx_akses_fasilitas_asal ON akses_fasilitas(fasilitas_asal);
CREATE INDEX IF NOT EXISTS idx_akses_fasilitas_tujuan ON akses_fasilitas(fasilitas_tujuan);

-- =====================================================
-- PART 5: Create continuity_of_care table (Medical Summary Exports)
-- =====================================================

-- Continuity of Care summary exports
CREATE TABLE IF NOT EXISTS continuity_of_care (
    id TEXT PRIMARY KEY,
    personel_id TEXT NOT NULL REFERENCES personel(id) ON DELETE CASCADE,
    fasilitas_asal TEXT NOT NULL,
    fasilitas_tujuan TEXT NOT NULL,
    tanggal_ekspor TIMESTAMP NOT NULL DEFAULT NOW(),
    ringkasan_medis TEXT NOT NULL,
    riwayat_diagnosa JSONB,
    riwayat_tindakan JSONB,
    riwayat_obat JSONB,
    alergi TEXT,
    hasil_rikkes_terakhir JSONB,
    catatan_pemindahan TEXT,
    user_id TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_continuity_personel ON continuity_of_care(personel_id);
CREATE INDEX IF NOT EXISTS idx_continuity_asal ON continuity_of_care(fasilitas_asal);
CREATE INDEX IF NOT EXISTS idx_continuity_tujuan ON continuity_of_care(fasilitas_tujuan);
CREATE INDEX IF NOT EXISTS idx_continuity_tanggal ON continuity_of_care(tanggal_ekspor DESC);
CREATE INDEX IF NOT EXISTS idx_continuity_user ON continuity_of_care(user_id);

-- =====================================================
-- PART 6: Add check constraints for data integrity
-- =====================================================

-- Ensure status has valid values
ALTER TABLE rekam_medis
ADD CONSTRAINT chk_rekam_medis_status
CHECK (status IN ('Draft', 'Final', 'Selesai'));

-- Ensure jenis_pemeriksaan has valid values
ALTER TABLE rekam_medis
ADD CONSTRAINT chk_rekam_medis_jenis
CHECK (jenis_pemeriksaan IN ('Umum', 'Rikkes', 'Dikbangum', 'Lanjutan', 'Rujukan'));

-- Ensure rikkes status has valid values
ALTER TABLE rekam_rikkes
ADD CONSTRAINT chk_rekam_rikkes_status
CHECK (status IN ('Draft', 'Selesai'));

-- Ensure jenis_rikkes has valid values
ALTER TABLE rekam_rikkes
ADD CONSTRAINT chk_rekam_rikkes_jenis
CHECK (jenis_rikkes IN ('Periodik', 'Dinas Luar', 'Lainnya'));

-- Ensure kesehatan fields have valid values
ALTER TABLE rekam_rikkes
ADD CONSTRAINT chk_rekam_rikkes_kesehatan
CHECK (
    kesehatan_umum IN ('Sehat', 'Tidak Sehat', 'Sehat dengan Catatan') AND
    kesehatan_mata IN ('Sehat', 'Tidak Sehat', 'Sehat dengan Catatan') AND
    kesehatan_gigi IN ('Sehat', 'Tidak Sehat', 'Sehat dengan Catatan') AND
    kesehatan_tht IN ('Sehat', 'Tidak Sehat', 'Sehat dengan Catatan') AND
    kesehatan_jiwa IN ('Sehat', 'Tidak Sehat', 'Sehat dengan Catatan')
);

-- Ensure kesimpulan has valid values
ALTER TABLE rekam_rikkes
ADD CONSTRAINT chk_rekam_rikkes_kesimpulan
CHECK (kesimpulan IN ('Layak', 'Tidak Layak', 'Perlu Observasi'));

-- Ensure alasan_akses has valid values
ALTER TABLE akses_fasilitas
ADD CONSTRAINT chk_akses_fasilitas_alasan
CHECK (alasan_akses IN ('Rikkes', 'Dikbangum', 'Rujukan', 'Lanjutan', 'Lainnya'));

-- =====================================================
-- PART 7: Create views for common queries
-- =====================================================

-- View: Medical records with personel information
CREATE OR REPLACE VIEW v_rekam_medis_personel AS
SELECT
    rm.id,
    rm.personel_id,
    p.nama AS personel_nama,
    p.nrp,
    p.pangkat,
    p.korps,
    rm.satuan,
    rm.jenis_pemeriksaan,
    rm.diagnosa,
    rm.tindakan,
    rm.keluhan,
    rm.hasil_penunjang,
    rm.obat,
    rm.dokter_id,
    u.name AS dokter_nama,
    rm.status,
    rm.catatan_tambahan,
    rm.created_at,
    rm.updated_at
FROM rekam_medis rm
LEFT JOIN personel p ON rm.personel_id = p.id
LEFT JOIN users u ON rm.dokter_id = u.id;

-- View: Rikkes records with personel information
CREATE OR REPLACE VIEW v_rekam_rikkes_personel AS
SELECT
    rr.id,
    rr.personel_id,
    p.nama AS personel_nama,
    p.nrp,
    p.pangkat,
    p.korps,
    rr.satuan,
    rr.tahun_rikkes,
    rr.jenis_rikkes,
    rr.hasil_penunjang,
    rr.kesehatan_umum,
    rr.kesehatan_mata,
    rr.kesehatan_gigi,
    rr.kesehatan_tht,
    rr.kesehatan_jiwa,
    rr.kesimpulan,
    rr.rekomendasi,
    rr.dokter_id,
    u.name AS dokter_nama,
    rr.resume_medis,
    rr.status,
    rr.created_at,
    rr.updated_at
FROM rekam_rikkes rr
LEFT JOIN personel p ON rr.personel_id = p.id
LEFT JOIN users u ON rr.dokter_id = u.id;

-- View: Cross-facility access with user and personel information
CREATE OR REPLACE VIEW v_akses_fasilitas_detail AS
SELECT
    af.id,
    af.user_id,
    u.name AS user_nama,
    u.role AS user_role,
    u.satuan AS user_satuan,
    af.personel_id,
    p.nama AS personel_nama,
    p.nrp,
    p.pangkat,
    af.fasilitas_asal,
    af.fasilitas_tujuan,
    af.alasan_akses,
    af.keterangan_alasan,
    af.tanggal_akses,
    af.data_diakses,
    af.created_at
FROM akses_fasilitas af
LEFT JOIN users u ON af.user_id = u.id
LEFT JOIN personel p ON af.personel_id = p.id;

-- View: Continuity of care exports with details
CREATE OR REPLACE VIEW v_continuity_of_care_detail AS
SELECT
    coc.id,
    coc.personel_id,
    p.nama AS personel_nama,
    p.nrp,
    p.pangkat,
    coc.fasilitas_asal,
    coc.fasilitas_tujuan,
    coc.tanggal_ekspor,
    coc.ringkasan_medis,
    coc.riwayat_diagnosa,
    coc.riwayat_tindakan,
    coc.riwayat_obat,
    coc.alergi,
    coc.hasil_rikkes_terakhir,
    coc.catatan_pemindahan,
    coc.user_id,
    u.name AS user_nama,
    u.role AS user_role,
    coc.created_at
FROM continuity_of_care coc
LEFT JOIN personel p ON coc.personel_id = p.id
LEFT JOIN users u ON coc.user_id = u.id;

-- =====================================================
-- PART 8: Create functions for common operations
-- =====================================================

-- Function: Get medical records count by personel
CREATE OR REPLACE FUNCTION get_medical_records_count(p_personel_id TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM rekam_medis
        WHERE personel_id = p_personel_id
    );
END;
$$ LANGUAGE plpgsql;

-- Function: Get unique facilities visited by personel
CREATE OR REPLACE FUNCTION get_facilities_visited(p_personel_id TEXT)
RETURNS JSONB AS $$
DECLARE
    facilities JSONB := '[]'::jsonb;
    facility_record RECORD;
BEGIN
    FOR facility_record IN
        SELECT DISTINCT satuan
        FROM rekam_medis
        WHERE personel_id = p_personel_id
    LOOP
        facilities := facilities || facility_record.satuan::jsonb;
    END LOOP;
    RETURN facilities;
END;
$$ LANGUAGE plpgsql;

-- Function: Get latest medical record for personel
CREATE OR REPLACE FUNCTION get_latest_medical_record(p_personel_id TEXT)
RETURNS rekam_medis AS $$
BEGIN
    RETURN (
        SELECT *
        FROM rekam_medis
        WHERE personel_id = p_personel_id
        ORDER BY created_at DESC
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 9: Grant permissions (adjust roles as needed)
-- =====================================================

-- Grant necessary permissions to application user
-- Replace 'binprofkes_user' with your actual database user
GRANT SELECT, INSERT, UPDATE, DELETE ON rekam_medis TO binprofkes_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON rekam_rikkes TO binprofkes_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON akses_fasilitas TO binprofkes_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON continuity_of_care TO binprofkes_user;

-- Grant usage on sequences (if any)
-- Note: Since we use TEXT IDs, sequences are not used
-- This is left for reference if you switch to auto-increment IDs

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_medical_records_count(TEXT) TO binprofkes_user;
GRANT EXECUTE ON FUNCTION get_facilities_visited(TEXT) TO binprofkes_user;
GRANT EXECUTE ON FUNCTION get_latest_medical_record(TEXT) TO binprofkes_user;

-- Grant select on views
GRANT SELECT ON v_rekam_medis_personel TO binprofkes_user;
GRANT SELECT ON v_rekam_rikkes_personel TO binprofkes_user;
GRANT SELECT ON v_akses_fasilitas_detail TO binprofkes_user;
GRANT SELECT ON v_continuity_of_care_detail TO binprofkes_user;

-- =====================================================
-- PART 10: Verification queries
-- =====================================================

-- Verify tables were created
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN (
        'rekam_medis',
        'rekam_rikkes',
        'akses_fasilitas',
        'continuity_of_care'
    )
ORDER BY table_name;

-- Verify indexes were created
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN (
        'rekam_medis',
        'rekam_rikkes',
        'akses_fasilitas',
        'continuity_of_care'
    )
ORDER BY tablename, indexname;

-- Verify constraints were created
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
    AND tc.table_name IN (
        'rekam_medis',
        'rekam_rikkes',
        'akses_fasilitas',
        'continuity_of_care'
    )
ORDER BY table_name, constraint_name;

-- =====================================================
-- Migration Complete
-- =====================================================
