import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(), // SuperAdmin, AdminSatuan, Operator, Viewer
  satuan: text('satuan'),
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
  nomorHp: text('nomor_hp'), // Nomor handphone personel
  keluhanBulanan: jsonb('keluhan_bulanan'), // Array of { month: string, count: number }
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Riwayat Kedinasan (Service History)
export const riwayatKedinasan = pgTable('riwayat_kedinasan', {
  id: text('id').primaryKey(),
  personelId: text('personel_id').notNull().references(() => personel.id, { onDelete: 'cascade' }),
  periode: text('periode').notNull(), // Format: YYYY-MM sampai YYYY-MM
  satuan: text('satuan').notNull(),
  jabatan: text('jabatan').notNull(),
  ket: text('ket'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Riwayat Penghargaan (Awards History)
export const riwayatPenghargaan = pgTable('riwayat_penghargaan', {
  id: text('id').primaryKey(),
  personelId: text('personel_id').notNull().references(() => personel.id, { onDelete: 'cascade' }),
  jenis: text('jenis').notNull(), // Example: Satyalencana, Tanda Kehormatan, dll
  tanggalPemberian: timestamp('tanggal_pemberian'),
  pejabatPemberi: text('pejabat_pemberi'),
  ket: text('ket'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Riwayat Karya (Works/Publications History)
export const riwayatKarya = pgTable('riwayat_karya', {
  id: text('id').primaryKey(),
  personelId: text('personel_id').notNull().references(() => personel.id, { onDelete: 'cascade' }),
  jenis: text('jenis').notNull(), // Example: Artikel, Penelitian, Buku, dll
  judul: text('judul').notNull(),
  tanggal: timestamp('tanggal'),
  mediaPublikasi: text('media_publikasi'), // Jurnal, seminar, website, dll
  ket: text('ket'),
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
  entitas: text('entitas').notNull(), // Personel, Pelatihan, Fasilitas, User, Notifikasi
  entitasId: text('entitas_id'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  meta: jsonb('meta'), // Additional metadata
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

export type RiwayatKedinasan = typeof riwayatKedinasan.$inferSelect;
export type InsertRiwayatKedinasan = typeof riwayatKedinasan.$inferInsert;

export type RiwayatPenghargaan = typeof riwayatPenghargaan.$inferSelect;
export type InsertRiwayatPenghargaan = typeof riwayatPenghargaan.$inferInsert;

export type RiwayatKarya = typeof riwayatKarya.$inferSelect;
export type InsertRiwayatKarya = typeof riwayatKarya.$inferInsert;
