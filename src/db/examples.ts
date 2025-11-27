/**
 * Database Usage Examples
 * 
 * This file demonstrates how to use Drizzle ORM with the database.
 * Import these patterns into your application components/services.
 */

import { db } from './index';
import { users, personel, pelatihan, fasilitas, notifikasi, auditLog } from './schema';
import { eq, and, like, gte, lte, desc, asc, count, sql } from 'drizzle-orm';

// ============================================================================
// SELECT QUERIES
// ============================================================================

/**
 * Get all users
 */
export async function getAllUsers() {
  return await db.select().from(users);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0]; // Returns first match or undefined
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: string) {
  return await db.select().from(users).where(eq(users.role, role));
}

/**
 * Get all active personel
 */
export async function getActivePersonel() {
  return await db.select().from(personel).where(eq(personel.status, 'Aktif'));
}

/**
 * Get personel by satuan (unit)
 */
export async function getPersonelBySatuan(satuan: string) {
  return await db.select().from(personel).where(eq(personel.satuan, satuan));
}

/**
 * Search personel by name (case-insensitive)
 */
export async function searchPersonelByName(searchTerm: string) {
  return await db
    .select()
    .from(personel)
    .where(like(personel.nama, `%${searchTerm}%`));
}

/**
 * Get personel with pagination
 */
export async function getPersonelPaginated(page: number = 1, pageSize: number = 10) {
  const offset = (page - 1) * pageSize;
  
  const [data, totalCount] = await Promise.all([
    db.select().from(personel).limit(pageSize).offset(offset),
    db.select({ count: count() }).from(personel)
  ]);
  
  return {
    data,
    total: totalCount[0].count,
    page,
    pageSize,
    totalPages: Math.ceil(Number(totalCount[0].count) / pageSize)
  };
}

// ============================================================================
// JOIN QUERIES
// ============================================================================

/**
 * Get personel with their training records
 */
export async function getPersonelWithTraining(personelId: string) {
  return await db
    .select()
    .from(personel)
    .leftJoin(pelatihan, eq(personel.id, pelatihan.personelId))
    .where(eq(personel.id, personelId));
}

/**
 * Get all personel with their training records
 */
export async function getAllPersonelWithTraining() {
  return await db
    .select({
      personel,
      pelatihan,
    })
    .from(personel)
    .leftJoin(pelatihan, eq(personel.id, pelatihan.personelId));
}

/**
 * Get training records with personel info
 */
export async function getTrainingWithPersonel() {
  return await db
    .select({
      trainingId: pelatihan.id,
      trainingType: pelatihan.jenis,
      startDate: pelatihan.tanggalMulai,
      endDate: pelatihan.tanggalSelesai,
      status: pelatihan.statusPelaksanaan,
      personelName: personel.nama,
      personelNrp: personel.nrp,
      personelRank: personel.pangkat,
    })
    .from(pelatihan)
    .innerJoin(personel, eq(pelatihan.personelId, personel.id));
}

// ============================================================================
// INSERT OPERATIONS
// ============================================================================

/**
 * Create new user
 */
export async function createUser(userData: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  satuan?: string;
}) {
  return await db.insert(users).values(userData).returning();
}

/**
 * Create new personel
 */
export async function createPersonel(personelData: {
  id: string;
  nrp: string;
  nama: string;
  pangkat: string;
  korps: string;
  satuan: string;
  status: string;
  jabatan: string;
  pekerjaan: string;
  keluhanBulanan?: any;
}) {
  return await db.insert(personel).values(personelData).returning();
}

/**
 * Create training record
 */
export async function createTraining(trainingData: {
  id: string;
  personelId: string;
  jenis: string;
  tanggalMulai?: Date;
  tanggalSelesai?: Date;
  sertifikatBerlakuHingga?: Date;
  statusPelaksanaan: string;
}) {
  return await db.insert(pelatihan).values(trainingData).returning();
}

/**
 * Create notification
 */
export async function createNotification(notifData: {
  id: string;
  kategori: string;
  judul: string;
  isi: string;
  dibaca?: boolean;
}) {
  return await db.insert(notifikasi).values(notifData).returning();
}

/**
 * Log audit event
 */
export async function logAudit(auditData: {
  id: string;
  userId: string;
  aksi: string;
  entitas: string;
  entitasId?: string;
  meta?: any;
}) {
  return await db.insert(auditLog).values(auditData).returning();
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update user
 */
export async function updateUser(userId: string, updates: Partial<{
  name: string;
  email: string;
  role: string;
  satuan: string;
  lastLoginAt: Date;
}>) {
  return await db
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
}

/**
 * Update personel
 */
export async function updatePersonel(personelId: string, updates: Partial<{
  nama: string;
  pangkat: string;
  korps: string;
  satuan: string;
  status: string;
  jabatan: string;
  pekerjaan: string;
  keluhanBulanan: any;
}>) {
  return await db
    .update(personel)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(personel.id, personelId))
    .returning();
}

/**
 * Update training status
 */
export async function updateTrainingStatus(
  trainingId: string, 
  status: string,
  dates?: {
    tanggalMulai?: Date;
    tanggalSelesai?: Date;
    sertifikatBerlakuHingga?: Date;
  }
) {
  return await db
    .update(pelatihan)
    .set({ 
      statusPelaksanaan: status,
      ...dates,
      updatedAt: new Date() 
    })
    .where(eq(pelatihan.id, trainingId))
    .returning();
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notifId: string) {
  return await db
    .update(notifikasi)
    .set({ dibaca: true })
    .where(eq(notifikasi.id, notifId))
    .returning();
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  return await db
    .update(notifikasi)
    .set({ dibaca: true })
    .where(eq(notifikasi.dibaca, false))
    .returning();
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete user (soft delete would be better in production)
 */
export async function deleteUser(userId: string) {
  return await db.delete(users).where(eq(users.id, userId)).returning();
}

/**
 * Delete personel (cascades to training records)
 */
export async function deletePersonel(personelId: string) {
  return await db.delete(personel).where(eq(personel.id, personelId)).returning();
}

/**
 * Delete notification
 */
export async function deleteNotification(notifId: string) {
  return await db.delete(notifikasi).where(eq(notifikasi.id, notifId)).returning();
}

// ============================================================================
// COMPLEX QUERIES
// ============================================================================

/**
 * Get statistics for dashboard
 */
export async function getDashboardStats() {
  const [
    totalPersonel,
    activePersonel,
    totalTraining,
    completedTraining,
    pendingTraining,
    totalFacilities,
    unreadNotifications,
  ] = await Promise.all([
    db.select({ count: count() }).from(personel),
    db.select({ count: count() }).from(personel).where(eq(personel.status, 'Aktif')),
    db.select({ count: count() }).from(pelatihan),
    db.select({ count: count() }).from(pelatihan).where(eq(pelatihan.statusPelaksanaan, 'Sudah Melaksanakan')),
    db.select({ count: count() }).from(pelatihan).where(eq(pelatihan.statusPelaksanaan, 'Belum Melaksanakan')),
    db.select({ count: count() }).from(fasilitas),
    db.select({ count: count() }).from(notifikasi).where(eq(notifikasi.dibaca, false)),
  ]);

  return {
    totalPersonel: Number(totalPersonel[0].count),
    activePersonel: Number(activePersonel[0].count),
    totalTraining: Number(totalTraining[0].count),
    completedTraining: Number(completedTraining[0].count),
    pendingTraining: Number(pendingTraining[0].count),
    totalFacilities: Number(totalFacilities[0].count),
    unreadNotifications: Number(unreadNotifications[0].count),
  };
}

/**
 * Get expiring certificates (within 90 days)
 */
export async function getExpiringCertificates(daysThreshold: number = 90) {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return await db
    .select({
      trainingId: pelatihan.id,
      jenis: pelatihan.jenis,
      expiryDate: pelatihan.sertifikatBerlakuHingga,
      personelId: personel.id,
      personelName: personel.nama,
      personelNrp: personel.nrp,
      satuan: personel.satuan,
    })
    .from(pelatihan)
    .innerJoin(personel, eq(pelatihan.personelId, personel.id))
    .where(
      and(
        eq(pelatihan.statusPelaksanaan, 'Sudah Melaksanakan'),
        lte(pelatihan.sertifikatBerlakuHingga, thresholdDate),
        gte(pelatihan.sertifikatBerlakuHingga, new Date())
      )
    )
    .orderBy(asc(pelatihan.sertifikatBerlakuHingga));
}

/**
 * Get personel by training type
 */
export async function getPersonelByTrainingType(trainingType: string) {
  return await db
    .select({
      personel,
      training: pelatihan,
    })
    .from(personel)
    .innerJoin(pelatihan, eq(personel.id, pelatihan.personelId))
    .where(eq(pelatihan.jenis, trainingType));
}

/**
 * Get recent audit logs with user info
 */
export async function getRecentAuditLogs(limit: number = 50) {
  return await db
    .select({
      auditId: auditLog.id,
      action: auditLog.aksi,
      entity: auditLog.entitas,
      entityId: auditLog.entitasId,
      timestamp: auditLog.timestamp,
      meta: auditLog.meta,
      userName: users.name,
      userEmail: users.email,
      userRole: users.role,
    })
    .from(auditLog)
    .innerJoin(users, eq(auditLog.userId, users.id))
    .orderBy(desc(auditLog.timestamp))
    .limit(limit);
}

/**
 * Get facilities with personel count
 */
export async function getFacilitiesWithPersonelCount() {
  return await db
    .select({
      facility: fasilitas,
      personelCount: count(personel.id),
    })
    .from(fasilitas)
    .leftJoin(personel, eq(fasilitas.satuan, personel.satuan))
    .groupBy(fasilitas.id);
}

/**
 * Get training completion rate by type
 */
export async function getTrainingCompletionRates() {
  return await db
    .select({
      jenis: pelatihan.jenis,
      total: count(),
      completed: sql<number>`count(case when ${pelatihan.statusPelaksanaan} = 'Sudah Melaksanakan' then 1 end)`,
    })
    .from(pelatihan)
    .groupBy(pelatihan.jenis);
}

// ============================================================================
// TRANSACTION EXAMPLE
// ============================================================================

/**
 * Create personel with training record (transaction)
 */
export async function createPersonelWithTraining(
  personelData: any,
  trainingData: any
) {
  return await db.transaction(async (tx) => {
    // Insert personel
    const [newPersonel] = await tx.insert(personel).values(personelData).returning();
    
    // Insert training with personel ID
    const [newTraining] = await tx.insert(pelatihan).values({
      ...trainingData,
      personelId: newPersonel.id,
    }).returning();
    
    return { personel: newPersonel, training: newTraining };
  });
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export const dbQueries = {
  // Select
  getAllUsers,
  getUserByEmail,
  getUsersByRole,
  getActivePersonel,
  getPersonelBySatuan,
  searchPersonelByName,
  getPersonelPaginated,
  
  // Joins
  getPersonelWithTraining,
  getAllPersonelWithTraining,
  getTrainingWithPersonel,
  
  // Insert
  createUser,
  createPersonel,
  createTraining,
  createNotification,
  logAudit,
  
  // Update
  updateUser,
  updatePersonel,
  updateTrainingStatus,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  
  // Delete
  deleteUser,
  deletePersonel,
  deleteNotification,
  
  // Complex
  getDashboardStats,
  getExpiringCertificates,
  getPersonelByTrainingType,
  getRecentAuditLogs,
  getFacilitiesWithPersonelCount,
  getTrainingCompletionRates,
  createPersonelWithTraining,
};
