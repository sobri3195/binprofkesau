import { db } from './index';
import { users, personel, pelatihan, fasilitas, notifikasi, auditLog } from './schema';

// Users dummy data
const usersData = [
  {
    id: 'user-0001',
    name: 'Super Admin',
    email: 'superadmin@binprofkes.mil.id',
    password: '$2a$10$rQZX9kVQ9wP4KvqF5ZPUqeZQ4pqFJzYHqQZX9kVQ9wP4KvqF5ZPUqe', // hashed: admin123
    role: 'SuperAdmin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-0002',
    name: 'Admin Lanud Halim',
    email: 'admin.halim@binprofkes.mil.id',
    password: '$2a$10$rQZX9kVQ9wP4KvqF5ZPUqeZQ4pqFJzYHqQZX9kVQ9wP4KvqF5ZPUqe',
    role: 'AdminSatuan',
    satuan: 'Lanud Halim Perdanakusuma',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-0003',
    name: 'Admin RSAU Jakarta',
    email: 'admin.rsau@binprofkes.mil.id',
    password: '$2a$10$rQZX9kVQ9wP4KvqF5ZPUqeZQ4pqFJzYHqQZX9kVQ9wP4KvqF5ZPUqe',
    role: 'AdminSatuan',
    satuan: 'RSAU dr. Esnawan Antariksa',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-0004',
    name: 'Operator Kesehatan',
    email: 'operator@binprofkes.mil.id',
    password: '$2a$10$rQZX9kVQ9wP4KvqF5ZPUqeZQ4pqFJzYHqQZX9kVQ9wP4KvqF5ZPUqe',
    role: 'Operator',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'user-0005',
    name: 'Viewer Dashboard',
    email: 'viewer@binprofkes.mil.id',
    password: '$2a$10$rQZX9kVQ9wP4KvqF5ZPUqeZQ4pqFJzYHqQZX9kVQ9wP4KvqF5ZPUqe',
    role: 'Viewer',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Personel dummy data
const personelData = [
  {
    id: 'pers-0001',
    nrp: '531234',
    nama: 'dr. Ahmad Yani',
    pangkat: 'Perwira',
    korps: 'Kesehatan',
    satuan: 'Lanud Halim Perdanakusuma',
    status: 'Aktif',
    jabatan: 'Kepala Klinik',
    pekerjaan: 'Dokter',
    keluhanBulanan: [
      { month: '2024-01', count: 45 },
      { month: '2024-02', count: 52 },
      { month: '2024-03', count: 48 },
      { month: '2024-04', count: 51 },
      { month: '2024-05', count: 47 },
      { month: '2024-06', count: 55 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pers-0002',
    nrp: '531567',
    nama: 'drg. Siti Nurhaliza',
    pangkat: 'Perwira',
    korps: 'Kesehatan',
    satuan: 'RSAU dr. Esnawan Antariksa',
    status: 'Aktif',
    jabatan: 'Dokter Gigi',
    pekerjaan: 'Dokter Gigi',
    keluhanBulanan: [
      { month: '2024-01', count: 30 },
      { month: '2024-02', count: 35 },
      { month: '2024-03', count: 32 },
      { month: '2024-04', count: 38 },
      { month: '2024-05', count: 33 },
      { month: '2024-06', count: 40 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pers-0003',
    nrp: '531890',
    nama: 'Budi Santoso',
    pangkat: 'Bintara',
    korps: 'Kesehatan',
    satuan: 'Lanud Sultan Hasanuddin',
    status: 'Aktif',
    jabatan: 'Perawat',
    pekerjaan: 'Perawat',
    keluhanBulanan: [
      { month: '2024-01', count: 60 },
      { month: '2024-02', count: 65 },
      { month: '2024-03', count: 58 },
      { month: '2024-04', count: 62 },
      { month: '2024-05', count: 59 },
      { month: '2024-06', count: 67 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pers-0004',
    nrp: '532100',
    nama: 'dr. Budi Hartono, Sp.PD',
    pangkat: 'Perwira',
    korps: 'Kesehatan',
    satuan: 'RSAU dr. Esnawan Antariksa',
    status: 'Aktif',
    jabatan: 'Dokter Spesialis Penyakit Dalam',
    pekerjaan: 'Dokter Spesialis',
    keluhanBulanan: [
      { month: '2024-01', count: 40 },
      { month: '2024-02', count: 45 },
      { month: '2024-03', count: 42 },
      { month: '2024-04', count: 48 },
      { month: '2024-05', count: 44 },
      { month: '2024-06', count: 50 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pers-0005',
    nrp: '532345',
    nama: 'Rina Marlina',
    pangkat: 'Bintara',
    korps: 'Kesehatan',
    satuan: 'Lanud Halim Perdanakusuma',
    status: 'Aktif',
    jabatan: 'Perawat',
    pekerjaan: 'Perawat',
    keluhanBulanan: [
      { month: '2024-01', count: 55 },
      { month: '2024-02', count: 60 },
      { month: '2024-03', count: 52 },
      { month: '2024-04', count: 58 },
      { month: '2024-05', count: 54 },
      { month: '2024-06', count: 62 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pers-0006',
    nrp: '532678',
    nama: 'dr. Rizki Pratama, Sp.B',
    pangkat: 'Perwira',
    korps: 'Kesehatan',
    satuan: 'RSAU dr. Esnawan Antariksa',
    status: 'Aktif',
    jabatan: 'Dokter Spesialis Bedah',
    pekerjaan: 'Dokter Spesialis',
    keluhanBulanan: [
      { month: '2024-01', count: 35 },
      { month: '2024-02', count: 40 },
      { month: '2024-03', count: 38 },
      { month: '2024-04', count: 42 },
      { month: '2024-05', count: 39 },
      { month: '2024-06', count: 45 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pers-0007',
    nrp: '532900',
    nama: 'Dewi Anggraini',
    pangkat: 'Tamtama',
    korps: 'Kesehatan',
    satuan: 'Lanud Supadio',
    status: 'Aktif',
    jabatan: 'Perawat',
    pekerjaan: 'Perawat',
    keluhanBulanan: [
      { month: '2024-01', count: 50 },
      { month: '2024-02', count: 55 },
      { month: '2024-03', count: 48 },
      { month: '2024-04', count: 52 },
      { month: '2024-05', count: 49 },
      { month: '2024-06', count: 57 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pers-0008',
    nrp: '533123',
    nama: 'drg. Andi Wijaya',
    pangkat: 'Perwira',
    korps: 'Kesehatan',
    satuan: 'Lanud Halim Perdanakusuma',
    status: 'Aktif',
    jabatan: 'Dokter Gigi',
    pekerjaan: 'Dokter Gigi',
    keluhanBulanan: [
      { month: '2024-01', count: 28 },
      { month: '2024-02', count: 32 },
      { month: '2024-03', count: 30 },
      { month: '2024-04', count: 35 },
      { month: '2024-05', count: 31 },
      { month: '2024-06', count: 38 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pers-0009',
    nrp: '533456',
    nama: 'dr. Maya Sari, Sp.A',
    pangkat: 'Perwira',
    korps: 'Kesehatan',
    satuan: 'RSAU dr. Esnawan Antariksa',
    status: 'Aktif',
    jabatan: 'Dokter Spesialis Anak',
    pekerjaan: 'Dokter Spesialis',
    keluhanBulanan: [
      { month: '2024-01', count: 70 },
      { month: '2024-02', count: 75 },
      { month: '2024-03', count: 72 },
      { month: '2024-04', count: 78 },
      { month: '2024-05', count: 74 },
      { month: '2024-06', count: 80 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pers-0010',
    nrp: '533789',
    nama: 'Agus Setiawan',
    pangkat: 'Bintara',
    korps: 'Kesehatan',
    satuan: 'Lanud Iswahjudi',
    status: 'Aktif',
    jabatan: 'Perawat',
    pekerjaan: 'Perawat',
    keluhanBulanan: [
      { month: '2024-01', count: 58 },
      { month: '2024-02', count: 62 },
      { month: '2024-03', count: 60 },
      { month: '2024-04', count: 65 },
      { month: '2024-05', count: 61 },
      { month: '2024-06', count: 68 },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Pelatihan dummy data
const pelatihanData = [
  {
    id: 'pel-0001',
    personelId: 'pers-0001',
    jenis: 'KIBI',
    tanggalMulai: new Date('2023-01-15'),
    tanggalSelesai: new Date('2023-03-15'),
    sertifikatBerlakuHingga: new Date('2028-03-15'),
    statusPelaksanaan: 'Sudah Melaksanakan',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: 'pel-0002',
    personelId: 'pers-0002',
    jenis: 'SUSDOKBANG',
    tanggalMulai: new Date('2023-06-01'),
    tanggalSelesai: new Date('2023-08-30'),
    sertifikatBerlakuHingga: new Date('2028-08-30'),
    statusPelaksanaan: 'Sudah Melaksanakan',
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-05-01'),
  },
  {
    id: 'pel-0003',
    personelId: 'pers-0003',
    jenis: 'SUSPAKES',
    statusPelaksanaan: 'Belum Melaksanakan',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pel-0004',
    personelId: 'pers-0004',
    jenis: 'SEKKAU',
    tanggalMulai: new Date('2022-09-01'),
    tanggalSelesai: new Date('2023-06-30'),
    sertifikatBerlakuHingga: new Date('2028-06-30'),
    statusPelaksanaan: 'Sudah Melaksanakan',
    createdAt: new Date('2022-08-01'),
    updatedAt: new Date('2022-08-01'),
  },
  {
    id: 'pel-0005',
    personelId: 'pers-0005',
    jenis: 'SUSKESBANGAN',
    statusPelaksanaan: 'Belum Melaksanakan',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pel-0006',
    personelId: 'pers-0006',
    jenis: 'SESKO',
    tanggalMulai: new Date('2021-08-01'),
    tanggalSelesai: new Date('2022-07-31'),
    sertifikatBerlakuHingga: new Date('2027-07-31'),
    statusPelaksanaan: 'Sudah Melaksanakan',
    createdAt: new Date('2021-07-01'),
    updatedAt: new Date('2021-07-01'),
  },
  {
    id: 'pel-0007',
    personelId: 'pers-0007',
    jenis: 'KIBI',
    statusPelaksanaan: 'Belum Melaksanakan',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pel-0008',
    personelId: 'pers-0008',
    jenis: 'SUSDOKBANG',
    tanggalMulai: new Date('2023-02-01'),
    tanggalSelesai: new Date('2023-04-30'),
    sertifikatBerlakuHingga: new Date('2028-04-30'),
    statusPelaksanaan: 'Sudah Melaksanakan',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: 'pel-0009',
    personelId: 'pers-0009',
    jenis: 'SES KOAU',
    tanggalMulai: new Date('2020-09-01'),
    tanggalSelesai: new Date('2021-08-31'),
    sertifikatBerlakuHingga: new Date('2026-08-31'),
    statusPelaksanaan: 'Sudah Melaksanakan',
    createdAt: new Date('2020-08-01'),
    updatedAt: new Date('2020-08-01'),
  },
  {
    id: 'pel-0010',
    personelId: 'pers-0010',
    jenis: 'SUSPAKES',
    tanggalMulai: new Date('2023-10-01'),
    tanggalSelesai: new Date('2023-12-31'),
    sertifikatBerlakuHingga: new Date('2028-12-31'),
    statusPelaksanaan: 'Sudah Melaksanakan',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-09-01'),
  },
];

// Fasilitas dummy data
const fasilitasData = [
  {
    id: 'fas-0001',
    nama: 'Lanud Halim Perdanakusuma',
    jenis: 'Lanud',
    komando: 'KOOPSAU I',
    satuan: 'Lanud Halim Perdanakusuma',
    koordinat: { lat: -6.2665, lng: 106.8907 },
    ringkasan: { total: 45, dokter: 12, dokterGigi: 5, perawat: 25, spesialis: 3 },
    dokterList: [
      { id: 'd1', nama: 'dr. Ahmad Yani', spesialisasi: 'Umum', aktif: true },
      { id: 'd2', nama: 'drg. Andi Wijaya', spesialisasi: 'Gigi', aktif: true },
      { id: 'd3', nama: 'dr. Siti Rahayu', spesialisasi: 'Umum', aktif: true },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'fas-0002',
    nama: 'RSAU dr. Esnawan Antariksa',
    jenis: 'RSAU',
    komando: 'KOOPSAU I',
    satuan: 'RSAU dr. Esnawan Antariksa',
    koordinat: { lat: -6.2616, lng: 106.8930 },
    ringkasan: { total: 120, dokter: 35, dokterGigi: 8, perawat: 65, spesialis: 12 },
    dokterList: [
      { id: 'd4', nama: 'dr. Budi Hartono, Sp.PD', spesialisasi: 'Penyakit Dalam', aktif: true },
      { id: 'd5', nama: 'dr. Rizki Pratama, Sp.B', spesialisasi: 'Bedah', aktif: true },
      { id: 'd6', nama: 'dr. Maya Sari, Sp.A', spesialisasi: 'Anak', aktif: true },
      { id: 'd7', nama: 'drg. Siti Nurhaliza', spesialisasi: 'Gigi', aktif: true },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'fas-0003',
    nama: 'Lanud Sultan Hasanuddin',
    jenis: 'Lanud',
    komando: 'KOOPSAU III',
    satuan: 'Lanud Sultan Hasanuddin',
    koordinat: { lat: -5.0619, lng: 119.5540 },
    ringkasan: { total: 38, dokter: 10, dokterGigi: 4, perawat: 22, spesialis: 2 },
    dokterList: [
      { id: 'd8', nama: 'dr. Andi Maulana', spesialisasi: 'Umum', aktif: true },
      { id: 'd9', nama: 'drg. Nur Aisyah', spesialisasi: 'Gigi', aktif: true },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'fas-0004',
    nama: 'Lanud Supadio',
    jenis: 'Lanud',
    komando: 'KOOPSAU II',
    satuan: 'Lanud Supadio',
    koordinat: { lat: -0.1552, lng: 109.4042 },
    ringkasan: { total: 32, dokter: 8, dokterGigi: 3, perawat: 19, spesialis: 2 },
    dokterList: [
      { id: 'd10', nama: 'dr. Agus Firmansyah', spesialisasi: 'Umum', aktif: true },
      { id: 'd11', nama: 'drg. Lina Marlina', spesialisasi: 'Gigi', aktif: true },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'fas-0005',
    nama: 'Lanud Iswahjudi',
    jenis: 'Lanud',
    komando: 'KOOPSAU II',
    satuan: 'Lanud Iswahjudi',
    koordinat: { lat: -7.6269, lng: 111.4531 },
    ringkasan: { total: 40, dokter: 11, dokterGigi: 4, perawat: 23, spesialis: 2 },
    dokterList: [
      { id: 'd12', nama: 'dr. Bambang Sutrisno', spesialisasi: 'Umum', aktif: true },
      { id: 'd13', nama: 'drg. Ratna Dewi', spesialisasi: 'Gigi', aktif: true },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'fas-0006',
    nama: 'Lanud Abdulrachman Saleh',
    jenis: 'Lanud',
    komando: 'KOOPSAU II',
    satuan: 'Lanud Abdulrachman Saleh',
    koordinat: { lat: -7.9265, lng: 112.7148 },
    ringkasan: { total: 35, dokter: 9, dokterGigi: 4, perawat: 20, spesialis: 2 },
    dokterList: [
      { id: 'd14', nama: 'dr. Rudi Hermawan', spesialisasi: 'Umum', aktif: true },
      { id: 'd15', nama: 'drg. Sari Wulandari', spesialisasi: 'Gigi', aktif: true },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Notifikasi dummy data
const notifikasiData = [
  {
    id: 'notif-0001',
    kategori: 'Peringatan',
    judul: 'Sertifikat akan berakhir',
    isi: 'Sertifikat KIBI dr. Ahmad Yani akan berakhir dalam 90 hari',
    dibaca: false,
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'notif-0002',
    kategori: 'Informasi',
    judul: 'Jadwal Pelatihan SUSDOKBANG',
    isi: 'Pelatihan SUSDOKBANG batch 5 akan dimulai pada tanggal 1 Agustus 2024',
    dibaca: true,
    createdAt: new Date('2024-05-15'),
  },
  {
    id: 'notif-0003',
    kategori: 'Belum sekolah',
    judul: 'Perawat belum mengikuti SUSPAKES',
    isi: '5 personel perawat belum mengikuti pelatihan SUSPAKES',
    dibaca: false,
    createdAt: new Date('2024-06-10'),
  },
  {
    id: 'notif-0004',
    kategori: 'Pembaruan',
    judul: 'Data personel diperbarui',
    isi: 'Data personel telah diperbarui untuk periode Juni 2024',
    dibaca: true,
    createdAt: new Date('2024-06-05'),
  },
  {
    id: 'notif-0005',
    kategori: 'Peringatan',
    judul: 'Kelengkapan dokumen',
    isi: '3 personel belum melengkapi dokumen kesehatan',
    dibaca: false,
    createdAt: new Date('2024-06-12'),
  },
];

// Audit log dummy data
const auditLogData = [
  {
    id: 'audit-0001',
    userId: 'user-0001',
    aksi: 'login',
    entitas: 'User',
    timestamp: new Date('2024-06-15T08:00:00'),
    meta: { ipAddress: '192.168.1.100' },
  },
  {
    id: 'audit-0002',
    userId: 'user-0002',
    aksi: 'create',
    entitas: 'Personel',
    entitasId: 'pers-0010',
    timestamp: new Date('2024-06-15T09:30:00'),
    meta: { action: 'created new personel' },
  },
  {
    id: 'audit-0003',
    userId: 'user-0001',
    aksi: 'update',
    entitas: 'Fasilitas',
    entitasId: 'fas-0001',
    timestamp: new Date('2024-06-15T10:15:00'),
    meta: { field: 'ringkasan', oldValue: 44, newValue: 45 },
  },
  {
    id: 'audit-0004',
    userId: 'user-0003',
    aksi: 'login',
    entitas: 'User',
    timestamp: new Date('2024-06-15T11:00:00'),
    meta: { ipAddress: '192.168.1.105' },
  },
  {
    id: 'audit-0005',
    userId: 'user-0002',
    aksi: 'update',
    entitas: 'Pelatihan',
    entitasId: 'pel-0003',
    timestamp: new Date('2024-06-15T14:20:00'),
    meta: { field: 'statusPelaksanaan', oldValue: 'Belum Melaksanakan', newValue: 'Sudah Melaksanakan' },
  },
];

// Main seed function
export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert users
    console.log('👤 Inserting users...');
    await db.insert(users).values(usersData);
    console.log(`✅ Inserted ${usersData.length} users`);

    // Insert personel
    console.log('👨‍⚕️ Inserting personel...');
    await db.insert(personel).values(personelData);
    console.log(`✅ Inserted ${personelData.length} personel`);

    // Insert pelatihan
    console.log('📚 Inserting pelatihan...');
    await db.insert(pelatihan).values(pelatihanData);
    console.log(`✅ Inserted ${pelatihanData.length} pelatihan records`);

    // Insert fasilitas
    console.log('🏥 Inserting fasilitas...');
    await db.insert(fasilitas).values(fasilitasData);
    console.log(`✅ Inserted ${fasilitasData.length} fasilitas`);

    // Insert notifikasi
    console.log('🔔 Inserting notifikasi...');
    await db.insert(notifikasi).values(notifikasiData);
    console.log(`✅ Inserted ${notifikasiData.length} notifikasi`);

    // Insert audit logs
    console.log('📝 Inserting audit logs...');
    await db.insert(auditLog).values(auditLogData);
    console.log(`✅ Inserted ${auditLogData.length} audit logs`);

    console.log('✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Database seeded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
