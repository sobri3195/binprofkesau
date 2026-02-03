export type Pangkat = "Tamtama" | "Bintara" | "Perwira";
export type StatusSertifikat = "Berlaku" | "Akan Berakhir" | "Kedaluwarsa";
export type StatusPelaksanaan = "Sudah Melaksanakan" | "Belum Melaksanakan";
export type KategoriNotifikasi = "Informasi" | "Peringatan" | "Pembaruan" | "Belum sekolah" | "Belum pindah" | "Belum PPDS";
export type JenisFasilitas = "Lanud" | "RSAU" | "Kodau" | "Koopsau" | "Satrad" | "Puskesau";
export type Role = "SuperAdmin" | "AdminSatuan" | "Operator" | "Viewer" | "Puskesau";
export type AksiAudit = "login" | "create" | "update" | "delete";
export type EntitasAudit = "Personel" | "Pelatihan" | "Fasilitas" | "User" | "Notifikasi" | "RekamMedis" | "AksesFasilitas";

export type JenisPemeriksaan = "Umum" | "Rikkes" | "Dikbangum" | "Lanjutan" | "Rujukan";
export type StatusRekamMedis = "Draft" | "Final" | "Selesai";
export type AlasanAkses = "Rikkes" | "Dikbangum" | "Rujukan" | "Lanjutan" | "Lainnya";
export type JenisRikkes = "Periodik" | "Dinas Luar" | "Lainnya";
export type StatusRikkes = "Draft" | "Selesai";
export type HasilKesehatan = "Sehat" | "Tidak Sehat" | "Sehat dengan Catatan";
export type KesimpulanRikkes = "Layak" | "Tidak Layak" | "Perlu Observasi";

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

export interface RekamMedis {
  id: string;
  personelId: string;
  satuan: string;
  jenisPemeriksaan: JenisPemeriksaan;
  diagnosa?: string;
  tindakan?: string;
  keluhan?: string;
  hasilPenunjang?: Array<{
    jenis: string;
    hasil: string;
    tanggal: string;
  }>;
  obat?: Array<{
    nama: string;
    dosis: string;
    durasi: string;
  }>;
  dokterId?: string;
  status: StatusRekamMedis;
  catatanTambahan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AksesFasilitas {
  id: string;
  userId: string;
  personelId: string;
  fasilitasAsal: string;
  fasilitasTujuan: string;
  alasanAkses: AlasanAkses;
  keteranganAlasan?: string;
  tanggalAkses: string;
  dataDiakses?: {
    timeline?: boolean;
    hasilPenunjang?: boolean;
    resumeMedis?: boolean;
  };
  createdAt: string;
}

export interface RekamRikkes {
  id: string;
  personelId: string;
  satuan: string;
  tahunRikkes: string;
  jenisRikkes: JenisRikkes;
  hasilPenunjang?: {
    labDarah?: string;
    labUrine?: string;
    rontgen?: string;
    ekg?: string;
    audiometri?: string;
    tesNarkoba?: string;
    lainnya?: Array<{ jenis: string; hasil: string }>;
  };
  kesehatanUmum?: HasilKesehatan;
  kesehatanMata?: HasilKesehatan;
  kesehatanGigi?: HasilKesehatan;
  kesehatanTHT?: HasilKesehatan;
  kesehatanJiwa?: HasilKesehatan;
  kesimpulan?: KesimpulanRikkes;
  rekomendasi?: string;
  dokterId?: string;
  resumeMedis?: string;
  status: StatusRikkes;
  createdAt: string;
  updatedAt: string;
}

export interface ContinuityOfCare {
  id: string;
  personelId: string;
  fasilitasAsal: string;
  fasilitasTujuan: string;
  tanggalEkspor: string;
  ringkasanMedis: string;
  riwayatDiagnosa?: Array<{
    diagnosa: string;
    tanggal: string;
    fasilitas: string;
  }>;
  riwayatTindakan?: Array<{
    tindakan: string;
    tanggal: string;
    fasilitas: string;
  }>;
  riwayatObat?: Array<{
    nama: string;
    dosis: string;
    periode: string;
  }>;
  alergi?: string;
  hasilRikkesTerakhir?: {
    tahun: string;
    kesimpulan: string;
    rekomendasi: string;
  };
  catatanPemindahan?: string;
  userId: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  tanggal: string;
  jenis: JenisPemeriksaan;
  fasilitas: string;
  deskripsi: string;
  diagnosa?: string;
  tindakan?: string;
}
