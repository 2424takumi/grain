import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('grain.db');
  return db;
};

export const initDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  // daily_entries テーブル
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_entries (
      id TEXT PRIMARY KEY,
      entry_date TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,

      journal_text TEXT,

      original_photo_path TEXT NOT NULL,
      thumbnail_photo_path TEXT NOT NULL,
      photo_file_size INTEGER NOT NULL,
      photo_width INTEGER NOT NULL,
      photo_height INTEGER NOT NULL,

      latitude REAL,
      longitude REAL,
      photo_capture_date TEXT,

      is_deleted INTEGER DEFAULT 0,
      deleted_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_entry_date ON daily_entries(entry_date);
    CREATE INDEX IF NOT EXISTS idx_is_deleted ON daily_entries(is_deleted);
  `);

  // app_settings テーブル
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS app_settings (
      id TEXT PRIMARY KEY,

      is_dark_mode_enabled INTEGER DEFAULT 0,
      selected_app_icon TEXT DEFAULT 'Default',
      is_premium_user INTEGER DEFAULT 0,

      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      total_entries INTEGER DEFAULT 0,
      last_streak_update_date TEXT,

      has_completed_onboarding INTEGER DEFAULT 0,
      onboarding_version INTEGER DEFAULT 1
    );
  `);

  // 初期設定データを挿入（存在しない場合）
  const settings = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM app_settings'
  );

  if (settings && settings.count === 0) {
    await database.runAsync(
      `INSERT INTO app_settings (
        id, is_dark_mode_enabled, selected_app_icon, is_premium_user,
        current_streak, longest_streak, total_entries,
        has_completed_onboarding, onboarding_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'default',
        0, // false
        'Default',
        0, // false
        0,
        0,
        0,
        0, // false
        1,
      ]
    );
  }

  console.log('✅ Database initialized');
};
