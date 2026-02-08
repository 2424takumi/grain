import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Crypto from 'expo-crypto';

const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;
const ORIGINAL_DIR = `${PHOTOS_DIR}original/`;
const THUMBNAIL_DIR = `${PHOTOS_DIR}thumbnails/`;

// ディレクトリ初期化
export const initPhotoStorage = async (): Promise<void> => {
  try {
    // ディレクトリ作成
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
    await FileSystem.makeDirectoryAsync(ORIGINAL_DIR, { intermediates: true });
    await FileSystem.makeDirectoryAsync(THUMBNAIL_DIR, { intermediates: true });

    console.log('✅ Photo storage initialized');
  } catch (error) {
    console.error('Photo storage initialization error:', error);
  }
};

interface SavePhotoResult {
  originalPath: string;
  thumbnailPath: string;
  fileSize: number;
  width: number;
  height: number;
}

export const savePhoto = async (photoUri: string): Promise<SavePhotoResult> => {
  const photoId = Crypto.randomUUID();

  // オリジナル写真を保存
  const originalPath = `${ORIGINAL_DIR}${photoId}.jpg`;
  await FileSystem.copyAsync({
    from: photoUri,
    to: originalPath,
  });

  // 写真情報を取得
  const fileInfo = await FileSystem.getInfoAsync(originalPath);
  const fileSize = (fileInfo as any).size || 0;

  // サムネイル作成（300x300px）
  const thumbnail = await ImageManipulator.manipulateAsync(
    originalPath,
    [{ resize: { width: 300, height: 300 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );

  const thumbnailPath = `${THUMBNAIL_DIR}${photoId}_thumb.jpg`;
  await FileSystem.moveAsync({
    from: thumbnail.uri,
    to: thumbnailPath,
  });

  // 画像サイズを取得（オリジナル）
  // 注：expo-image-manipulatorからサイズを取得
  const image = await ImageManipulator.manipulateAsync(originalPath, []);

  return {
    originalPath,
    thumbnailPath,
    fileSize,
    width: image.width,
    height: image.height,
  };
};

export const deletePhoto = async (originalPath: string, thumbnailPath: string): Promise<void> => {
  try {
    // オリジナルを削除
    const originalExists = await FileSystem.getInfoAsync(originalPath);
    if (originalExists.exists) {
      await FileSystem.deleteAsync(originalPath);
    }

    // サムネイルを削除
    const thumbnailExists = await FileSystem.getInfoAsync(thumbnailPath);
    if (thumbnailExists.exists) {
      await FileSystem.deleteAsync(thumbnailPath);
    }
  } catch (error) {
    console.error('Photo deletion error:', error);
  }
};

export const getPhotoUri = (path: string): string => {
  return path;
};
