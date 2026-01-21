export type Pangkat = "Tamtama" | "Bintara" | "Perwira";
export type StatusSertifikat = "Berlaku" | "Akan Berakhir" | "Kedaluwarsa";
export type StatusPelaksanaan = "Sudah Melaksanakan" | "Belum Melaksanakan";
export type KategoriNotifikasi = "Informasi" | "Peringatan" | "Pembaruan" | "Belum sekolah" | "Belum pindah" | "Belum PPDS";
export type JenisFasilitas = "Lanud" | "RSAU" | "Kodau" | "Koopsau" | "Satrad";
export type Role = "SuperAdmin" | "AdminSatuan" | "Operator" | "Viewer";
export type AksiAudit = "login" | "create" | "update" | "delete";
export type EntitasAudit = "Personel" | "Pelatihan" | "Fasilitas" | "User" | "Notifikasi";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  satuan?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiwayatKedinasan {
  id: string;
  jabatan: string;
  satuan: string;
  tanggalMulai: string;
  tanggalSelesai?: string;
}

export interface RiwayatPenghargaan {
  id: string;
  nama: string;
  pemberi: string;
  tanggal: string;
  keterangan?: string;
}

export interface RiwayatKarya {
  id: string;
  judul: string;
  jenis: string; // Penelitian, Publikasi, Karya Tulis, dll
  tahun: string;
  deskripsi?: string;
}

export interface Personel {
  id: string;
  nrp: string;
  nama: string;
  pangkat: Pangkat;
  korps: string;
  satuan: string;
  status: string;
  jabatan: string;
  pekerjaan: string;
  noHP?: string;
  keluhanBulanan?: Array<{ month: string; count: number }>;
  riwayatKedinasan?: RiwayatKedinasan[];
  riwayatPenghargaan?: RiwayatPenghargaan[];
  riwayatKarya?: RiwayatKarya[];
  createdAt: string;
  updatedAt: string;
}

export interface Pelatihan {
  id: string;
  personelId: string;
  jenis: "KIBI" | "SUSDOKBANG" | "SUSPAKES" | "SUSKESBANGAN" | "SEKKAU" | "SESKO" | "SES KOAU";
  tanggalMulai?: string;
  tanggalSelesai?: string;
  sertifikatBerlakuHingga?: string;
  statusPelaksanaan: StatusPelaksanaan;
  createdAt: string;
  updatedAt: string;
}

export interface Dokter {
  id: string;
  nama: string;
  spesialisasi?: string;
  aktif: boolean;
}

export interface Fasilitas {
  id: string;
  nama: string;
  jenis: JenisFasilitas;
  komando: "KOOPSAU I" | "KOOPSAU II" | "KOOPSAU III" | "KODAU I" | "KODAU II" | "KODAU III" | "Lanud" | "RSAU" | "Satrad";
  satuan?: string;
  koordinat: { lat: number; lng: number };
  ringkasan: { 
    total: number; 
    dokter: number; 
    dokterGigi: number; 
    perawat: number; 
    spesialis: number;
  };
  dokterList?: Dokter[];
  createdAt: string;
  updatedAt: string;
}

export interface Notifikasi {
  id: string;
  kategori: KategoriNotifikasi;
  judul: string;
  isi: string;
  dibaca: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  aksi: AksiAudit;
  entitas: EntitasAudit;
  entitasId?: string;
  timestamp: string;
  meta?: Record<string, any>;
}
