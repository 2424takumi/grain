import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';
import { createEntry } from './queries';
import { format, subDays } from 'date-fns';

const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;
const ORIGINAL_DIR = `${PHOTOS_DIR}original/`;
const THUMBNAIL_DIR = `${PHOTOS_DIR}thumbnails/`;

// ダミー画像を作成（単色の画像）
const createDummyImage = async (color: string): Promise<string> => {
  // SVGで単色画像を生成
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${color}"/>
      <text x="200" y="200" font-size="40" text-anchor="middle" fill="white">
        Dummy Photo
      </text>
    </svg>
  `;

  const photoId = Crypto.randomUUID();
  const path = `${ORIGINAL_DIR}${photoId}.jpg`;

  // SVGをbase64エンコード
  const base64 = Buffer.from(svg).toString('base64');
  const dataUri = `data:image/svg+xml;base64,${base64}`;

  // ファイルとして保存
  await FileSystem.writeAsStringAsync(path, svg, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return path;
};

// テスト用エントリーを作成
export const createTestEntries = async (count: number = 7): Promise<void> => {
  try {
    // ディレクトリが存在するか確認
    await FileSystem.makeDirectoryAsync(ORIGINAL_DIR, { intermediates: true });
    await FileSystem.makeDirectoryAsync(THUMBNAIL_DIR, { intermediates: true });

    const colors = [
      '#FF6B6B', // 赤
      '#4ECDC4', // シアン
      '#45B7D1', // 青
      '#FFA07A', // オレンジ
      '#98D8C8', // 緑
      '#F7DC6F', // 黄色
      '#BB8FCE', // 紫
    ];

    for (let i = 0; i < count; i++) {
      const date = subDays(new Date(), i);
      const dateString = format(date, 'yyyy-MM-dd');

      // ダミー画像を作成
      const color = colors[i % colors.length];
      const photoId = Crypto.randomUUID();
      const originalPath = `${ORIGINAL_DIR}${photoId}.jpg`;
      const thumbnailPath = `${THUMBNAIL_DIR}${photoId}_thumb.jpg`;

      // プレースホルダーファイルを作成（実際には空のファイル）
      await FileSystem.writeAsStringAsync(originalPath, '', {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await FileSystem.writeAsStringAsync(thumbnailPath, '', {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // エントリーを作成
      await createEntry({
        id: Crypto.randomUUID(),
        entryDate: dateString,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        journalText: `テストエントリー ${i + 1}: ${format(date, 'M月d日')}の記録`,
        originalPhotoPath: originalPath,
        thumbnailPhotoPath: thumbnailPath,
        photoFileSize: 1024,
        photoWidth: 400,
        photoHeight: 400,
        isDeleted: false,
      });
    }

    console.log(`✅ ${count}件のテストエントリーを作成しました`);
  } catch (error) {
    console.error('テストデータ作成エラー:', error);
    throw error;
  }
};

// すべてのエントリーを削除（テスト用）
export const clearAllEntries = async (): Promise<void> => {
  try {
    // 写真ディレクトリを削除
    const originalExists = await FileSystem.getInfoAsync(ORIGINAL_DIR);
    if (originalExists.exists) {
      await FileSystem.deleteAsync(ORIGINAL_DIR, { idempotent: true });
    }

    const thumbnailExists = await FileSystem.getInfoAsync(THUMBNAIL_DIR);
    if (thumbnailExists.exists) {
      await FileSystem.deleteAsync(THUMBNAIL_DIR, { idempotent: true });
    }

    // ディレクトリを再作成
    await FileSystem.makeDirectoryAsync(ORIGINAL_DIR, { intermediates: true });
    await FileSystem.makeDirectoryAsync(THUMBNAIL_DIR, { intermediates: true });

    console.log('✅ すべてのエントリーを削除しました');
  } catch (error) {
    console.error('エントリー削除エラー:', error);
    throw error;
  }
};
