import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(), // SuperAdmin, AdminSatuan, Operator, Viewer, Puskesau
  satuan: text('satuan'),
  fasilitasId: text('fasilitas_id'), // ID of assigned facility (RSAU/Puskesau)
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Personel table
export const personel = pgTable('personel', {
  id: text('id').primaryKey(),
  nrp: text('nrp').notNull().unique(),
  nama: text('nama').notNull(),
  pangkat: text('pangkat').notNull(), // Tamtama, Bintara, Perwira
  korps: text('korps').notNull(),
  satuan: text('satuan').notNull(),
  status: text('status').notNull(),
  jabatan: text('jabatan').notNull(),
  pekerjaan: text('pekerjaan').notNull(),
  noHP: text('no_hp'),
  keluhanBulanan: jsonb('keluhan_bulanan'), // Array of { month: string, count: number }
  riwayatKedinasan: jsonb('riwayat_kedinasan'),
  riwayatPenghargaan: jsonb('riwayat_penghargaan'),
  riwayatKarya: jsonb('riwayat_karya'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Pelatihan table
export const pelatihan = pgTable('pelatihan', {
  id: text('id').primaryKey(),
  personelId: text('personel_id').notNull().references(() => personel.id, { onDelete: 'cascade' }),
  jenis: text('jenis').notNull(), // KIBI, SUSDOKBANG, SUSPAKES, SUSKESBANGAN, SEKKAU, SESKO, SES KOAU
  tanggalMulai: timestamp('tanggal_mulai'),
  tanggalSelesai: timestamp('tanggal_selesai'),
  sertifikatBerlakuHingga: timestamp('sertifikat_berlaku_hingga'),
  statusPelaksanaan: text('status_pelaksanaan').notNull(), // Sudah Melaksanakan, Belum Melaksanakan
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Fasilitas table
export const fasilitas = pgTable('fasilitas', {
  id: text('id').primaryKey(),
  nama: text('nama').notNull(),
  jenis: text('jenis').notNull(), // Lanud, RSAU, Kodau, Koopsau, Satrad
  komando: text('komando').notNull(),
  satuan: text('satuan'),
  koordinat: jsonb('koordinat').notNull(), // { lat: number, lng: number }
  ringkasan: jsonb('ringkasan').notNull(), // { total, dokter, dokterGigi, perawat, spesialis }
  dokterList: jsonb('dokter_list'), // Array of doctor objects
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Notifikasi table
export const notifikasi = pgTable('notifikasi', {
  id: text('id').primaryKey(),
  kategori: text('kategori').notNull(), // Informasi, Peringatan, Pembaruan, Belum sekolah, Belum pindah, Belum PPDS
  judul: text('judul').notNull(),
  isi: text('isi').notNull(),
  dibaca: boolean('dibaca').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Audit Log table
export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  aksi: text('aksi').notNull(), // login, create, update, delete
  entitas: text('entitas').notNull(), // Personel, Pelatihan, Fasilitas, User, Notifikasi, RekamMedis, AksesFasilitas
  entitasId: text('entitas_id'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  meta: jsonb('meta'), // Additional metadata
});

// E-RM (Rekam Medis) table
export const rekamMedis = pgTable('rekam_medis', {
  id: text('id').primaryKey(),
  personelId: text('personel_id').notNull().references(() => personel.id, { onDelete: 'cascade' }),
  satuan: text('satuan').notNull(), // Current unit where record was created
  jenisPemeriksaan: text('jenis_pemeriksaan').notNull(), // Umum, Rikkes, Dikbangum, Lanjutan, Rujukan
  diagnosa: text('diagnosa'),
  tindakan: text('tindakan'),
  keluhan: text('keluhan'),
  hasilPenunjang: jsonb('hasil_penunjang'), // Array of lab results, imaging, etc.
  obat: jsonb('obat'), // Array of prescribed medications
  dokterId: text('dokter_id'), // ID of doctor performing examination
  status: text('status').notNull().default('Draft'), // Draft, Final, Selesai
  catatanTambahan: text('catatan_tambahan'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Cross-facility access log (for Puskesau/RSAU cross-access)
export const aksesFasilitas = pgTable('akses_fasilitas', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  personelId: text('personel_id').notNull().references(() => personel.id, { onDelete: 'cascade' }),
  fasilitasAsal: text('fasilitas_asal').notNull(), // Original facility
  fasilitasTujuan: text('fasilitas_tujuan').notNull(), // Target facility being accessed
  alasanAkses: text('alasan_akses').notNull(), // Rikkes, Dikbangum, Rujukan, Lanjutan, Lainnya
  keteranganAlasan: text('keterangan_alasan'),
  tanggalAkses: timestamp('tanggal_akses').notNull().defaultNow(),
  dataDiakses: jsonb('data_diakses'), // What data was accessed (timeline, hasil penunjang, resume medis)
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Rikkes template and records
export const rekamRikkes = pgTable('rekam_rikkes', {
  id: text('id').primaryKey(),
  personelId: text('personel_id').notNull().references(() => personel.id, { onDelete: 'cascade' }),
  satuan: text('satuan').notNull(),
  tahunRikkes: text('tahun_rikkes').notNull(),
  jenisRikkes: text('jenis_rikkes').notNull(), // Periodik, Dinas Luar, Lainnya
  hasilPenunjang: jsonb('hasil_penunjang'), // Lab, Rontgen, EKG, Audiometri, etc.
  kesehatanUmum: text('kesehatan_umum'), // Sehat, Tidak Sehat, Sehat dengan Catatan
  kesehatanMata: text('kesehatan_mata'),
  kesehatanGigi: text('kesehatan_gigi'),
  kesehatanTHT: text('kesehatan_tht'),
  kesehatanJiwa: text('kesehatan_jiwa'),
  kesimpulan: text('kesimpulan'), // Layak, Tidak Layak, Perlu Observasi
  rekomendasi: text('rekomendasi'),
  dokterId: text('dokter_id'),
  resumeMedis: text('resume_medis'), // Auto-generated summary
  status: text('status').notNull().default('Draft'), // Draft, Selesai
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Continuity of Care Summary (CCS) exports
export const continuityOfCare = pgTable('continuity_of_care', {
  id: text('id').primaryKey(),
  personelId: text('personel_id').notNull().references(() => personel.id, { onDelete: 'cascade' }),
  fasilitasAsal: text('fasilitas_asal').notNull(),
  fasilitasTujuan: text('fasilitas_tujuan').notNull(),
  tanggalEkspor: timestamp('tanggal_ekspor').notNull().defaultNow(),
  ringkasanMedis: text('ringkasan_medis').notNull(),
  riwayatDiagnosa: jsonb('riwayat_diagnosa'),
  riwayatTindakan: jsonb('riwayat_tindakan'),
  riwayatObat: jsonb('riwayat_obat'),
  alergi: text('alergi'),
  hasilRikkesTerakhir: jsonb('hasil_rikkes_terakhir'),
  catatanPemindahan: text('catatan_pemindahan'),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Type exports for use in application
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Personel = typeof personel.$inferSelect;
export type InsertPersonel = typeof personel.$inferInsert;

export type Pelatihan = typeof pelatihan.$inferSelect;
export type InsertPelatihan = typeof pelatihan.$inferInsert;

export type Fasilitas = typeof fasilitas.$inferSelect;
export type InsertFasilitas = typeof fasilitas.$inferInsert;

export type Notifikasi = typeof notifikasi.$inferSelect;
export type InsertNotifikasi = typeof notifikasi.$inferInsert;

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

export type RekamMedis = typeof rekamMedis.$inferSelect;
export type InsertRekamMedis = typeof rekamMedis.$inferInsert;

export type AksesFasilitas = typeof aksesFasilitas.$inferSelect;
export type InsertAksesFasilitas = typeof aksesFasilitas.$inferInsert;

export type RekamRikkes = typeof rekamRikkes.$inferSelect;
export type InsertRekamRikkes = typeof rekamRikkes.$inferInsert;

export type ContinuityOfCare = typeof continuityOfCare.$inferSelect;
export type InsertContinuityOfCare = typeof continuityOfCare.$inferInsert;
