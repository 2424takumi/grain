import { getDatabase } from './db';
import type { DailyEntry } from '@/types';

export const fetchAllEntries = async (): Promise<DailyEntry[]> => {
  const db = await getDatabase();

  const rows = await db.getAllAsync<any>(
    `SELECT * FROM daily_entries
     WHERE is_deleted = 0
     ORDER BY entry_date DESC`
  );

  return rows.map(row => ({
    id: row.id,
    entryDate: row.entry_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    journalText: row.journal_text,
    originalPhotoPath: row.original_photo_path,
    thumbnailPhotoPath: row.thumbnail_photo_path,
    photoFileSize: row.photo_file_size,
    photoWidth: row.photo_width,
    photoHeight: row.photo_height,
    latitude: row.latitude,
    longitude: row.longitude,
    photoCaptureDate: row.photo_capture_date,
    isDeleted: Boolean(row.is_deleted),
    deletedAt: row.deleted_at,
  }));
};

export const fetchEntryByDate = async (date: string): Promise<DailyEntry | null> => {
  const db = await getDatabase();

  const row = await db.getFirstAsync<any>(
    `SELECT * FROM daily_entries
     WHERE entry_date = ? AND is_deleted = 0`,
    [date]
  );

  if (!row) return null;

  return {
    id: row.id,
    entryDate: row.entry_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    journalText: row.journal_text,
    originalPhotoPath: row.original_photo_path,
    thumbnailPhotoPath: row.thumbnail_photo_path,
    photoFileSize: row.photo_file_size,
    photoWidth: row.photo_width,
    photoHeight: row.photo_height,
    latitude: row.latitude,
    longitude: row.longitude,
    photoCaptureDate: row.photo_capture_date,
    isDeleted: Boolean(row.is_deleted),
    deletedAt: row.deleted_at,
  };
};

export const createEntry = async (entry: DailyEntry): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO daily_entries (
      id, entry_date, created_at, updated_at,
      journal_text, original_photo_path, thumbnail_photo_path,
      photo_file_size, photo_width, photo_height,
      latitude, longitude, photo_capture_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.entryDate,
      entry.createdAt,
      entry.updatedAt,
      entry.journalText || null,
      entry.originalPhotoPath,
      entry.thumbnailPhotoPath,
      entry.photoFileSize,
      entry.photoWidth,
      entry.photoHeight,
      entry.latitude || null,
      entry.longitude || null,
      entry.photoCaptureDate || null,
    ]
  );
};

export const updateEntryText = async (id: string, journalText: string): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `UPDATE daily_entries
     SET journal_text = ?, updated_at = ?
     WHERE id = ?`,
    [journalText, new Date().toISOString(), id]
  );
};

export const deleteEntry = async (id: string): Promise<void> => {
  const db = await getDatabase();

  await db.runAsync(
    `UPDATE daily_entries
     SET is_deleted = 1, deleted_at = ?
     WHERE id = ?`,
    [new Date().toISOString(), id]
  );
};
