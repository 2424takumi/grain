# Grain - React Native/Expo 技術仕様書

## 技術スタック概要

### フレームワーク
- **React Native**: 0.73+
- **Expo**: SDK 50+（Expo Router使用）
- **言語**: TypeScript

### 主要ライブラリ

#### ナビゲーション
- **expo-router**: ファイルベースルーティング

#### データ管理
- **expo-sqlite**: ローカルデータベース
- **@tanstack/react-query**: データフェッチング・キャッシュ
- **zustand**: 軽量な状態管理（グローバルステート用）

#### カメラ・メディア
- **expo-camera**: カメラアクセス
- **expo-image-picker**: 画像選択（バックアップ用）
- **expo-image-manipulator**: 画像リサイズ・圧縮
- **expo-file-system**: ファイル保存・読み込み

#### UI/スタイリング
- **NativeWind**: Tailwind CSS for React Native
- **react-native-reanimated**: アニメーション
- **react-native-gesture-handler**: ジェスチャー

#### その他
- **expo-haptics**: ハプティックフィードバック
- **expo-sharing**: ファイル共有（エクスポート機能）
- **date-fns**: 日付操作

---

## プロジェクト構造

```
grain/
├── app/                          # Expo Router (ファイルベースルーティング)
│   ├── (tabs)/                   # タブナビゲーション
│   │   ├── index.tsx            # タイムライン画面
│   │   └── settings.tsx         # 設定画面
│   ├── entry/[id].tsx           # エントリー詳細画面
│   ├── camera.tsx               # カメラ画面（モーダル）
│   ├── onboarding.tsx           # オンボーディング
│   └── _layout.tsx              # ルートレイアウト
├── components/                   # 共通コンポーネント
│   ├── EntryCard.tsx
│   ├── StreakBadge.tsx
│   ├── Button.tsx
│   └── LoadingView.tsx
├── hooks/                        # カスタムフック
│   ├── useEntries.ts
│   ├── useCamera.ts
│   └── useSettings.ts
├── services/                     # ビジネスロジック
│   ├── database/
│   │   ├── db.ts                # SQLite初期化
│   │   ├── schema.ts            # テーブル定義
│   │   └── queries.ts           # SQL クエリ
│   ├── storage/
│   │   └── photoStorage.ts      # 写真保存・読み込み
│   └── camera/
│       └── cameraService.ts     # カメラ操作
├── stores/                       # Zustandストア
│   └── appStore.ts              # アプリ全体の状態
├── types/                        # TypeScript型定義
│   └── index.ts
├── constants/                    # 定数
│   ├── Colors.ts
│   └── Typography.ts
├── utils/                        # ユーティリティ
│   └── dateUtils.ts
├── app.json                      # Expo設定
├── package.json
├── tsconfig.json
└── tailwind.config.js           # NativeWind設定
```

---

## データベース設計（SQLite）

### テーブル: daily_entries

```sql
CREATE TABLE IF NOT EXISTS daily_entries (
    id TEXT PRIMARY KEY,
    entry_date TEXT NOT NULL UNIQUE,  -- YYYY-MM-DD形式、1日1エントリー制約
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,

    journal_text TEXT,  -- 最大5000文字

    -- 写真関連
    original_photo_path TEXT NOT NULL,
    thumbnail_photo_path TEXT NOT NULL,
    photo_file_size INTEGER NOT NULL,
    photo_width INTEGER NOT NULL,
    photo_height INTEGER NOT NULL,

    -- メタデータ（任意）
    latitude REAL,
    longitude REAL,
    photo_capture_date TEXT,

    -- ソフトデリート
    is_deleted INTEGER DEFAULT 0,  -- 0: false, 1: true
    deleted_at TEXT
);

CREATE INDEX idx_entry_date ON daily_entries(entry_date);
CREATE INDEX idx_is_deleted ON daily_entries(is_deleted);
```

### テーブル: app_settings

```sql
CREATE TABLE IF NOT EXISTS app_settings (
    id TEXT PRIMARY KEY,

    -- アプリ設定
    is_dark_mode_enabled INTEGER DEFAULT 0,
    selected_app_icon TEXT DEFAULT 'Default',
    is_premium_user INTEGER DEFAULT 0,

    -- 統計
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_entries INTEGER DEFAULT 0,
    last_streak_update_date TEXT,

    -- オンボーディング
    has_completed_onboarding INTEGER DEFAULT 0,
    onboarding_version INTEGER DEFAULT 1
);
```

---

## TypeScript型定義

### types/index.ts

```typescript
export interface DailyEntry {
  id: string;
  entryDate: string;  // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;

  journalText?: string;

  originalPhotoPath: string;
  thumbnailPhotoPath: string;
  photoFileSize: number;
  photoWidth: number;
  photoHeight: number;

  latitude?: number;
  longitude?: number;
  photoCaptureDate?: string;

  isDeleted: boolean;
  deletedAt?: string;
}

export interface AppSettings {
  id: string;

  isDarkModeEnabled: boolean;
  selectedAppIcon: string;
  isPremiumUser: boolean;

  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  lastStreakUpdateDate?: string;

  hasCompletedOnboarding: boolean;
  onboardingVersion: number;
}

export interface CreateEntryInput {
  entryDate: string;
  photoUri: string;
  journalText?: string;
  latitude?: number;
  longitude?: number;
}
```

---

## ファイルストレージ構造

```
FileSystem.documentDirectory/
├── photos/
│   ├── original/
│   │   └── {uuid}.jpg          // JPEG、品質0.8
│   └── thumbnails/
│       └── {uuid}_thumb.jpg    // JPEG、300x300px
└── database/
    └── grain.db                // SQLiteデータベース
```

**注意**:
- iOS: `FileSystem.documentDirectory` → `~/Library/Application Support/`
- Android: `FileSystem.documentDirectory` → `/data/data/{package}/files/`

---

## コンポーネント実装例

### EntryCard.tsx

```typescript
import { View, Text, Image, Pressable } from 'react-native';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { DailyEntry } from '@/types';

interface EntryCardProps {
  entry: DailyEntry;
  onPress: () => void;
}

export function EntryCard({ entry, onPress }: EntryCardProps) {
  return (
    <Pressable onPress={onPress} className="mb-6">
      {/* 日付ヘッダー */}
      <Text className="text-xs text-gray-500 mb-2 px-4">
        {format(new Date(entry.entryDate), 'M月d日(E)', { locale: ja })}
      </Text>

      {/* 写真（フルブリード） */}
      <Image
        source={{ uri: entry.originalPhotoPath }}
        className="w-full aspect-square"
        resizeMode="cover"
      />

      {/* ジャーナルテキスト */}
      {entry.journalText && (
        <Text
          className="text-sm text-gray-500 mt-2 px-4"
          numberOfLines={1}
        >
          {entry.journalText}
        </Text>
      )}
    </Pressable>
  );
}
```

---

## データベース操作例

### services/database/queries.ts

```typescript
import * as SQLite from 'expo-sqlite';
import type { DailyEntry } from '@/types';

const db = SQLite.openDatabase('grain.db');

export const createEntry = async (entry: DailyEntry): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
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
        ],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const fetchAllEntries = async (): Promise<DailyEntry[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM daily_entries
         WHERE is_deleted = 0
         ORDER BY entry_date DESC`,
        [],
        (_, { rows }) => {
          const entries = rows._array.map(row => ({
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
          resolve(entries);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
```

---

## React Query の活用

### hooks/useEntries.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllEntries, createEntry, deleteEntry } from '@/services/database/queries';
import type { DailyEntry, CreateEntryInput } from '@/types';

export function useEntries() {
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ['entries'],
    queryFn: fetchAllEntries,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateEntryInput) => {
      // 写真を保存 → エントリー作成
      // 実装は後述
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
  });

  return {
    entries: entries || [],
    isLoading,
    createEntry: createMutation.mutate,
    deleteEntry: deleteMutation.mutate,
  };
}
```

---

## NativeWind スタイリング

### tailwind.config.js

```javascript
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'grain-black': '#000000',
        'grain-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
};
```

### 使用例

```typescript
// ミニマルなデザイン
<View className="bg-white dark:bg-black">
  <Text className="text-black dark:text-white text-lg font-bold">
    Grain
  </Text>
</View>
```

---

## カメラ実装

### app/camera.tsx

```typescript
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>カメラへのアクセス許可が必要です</Text>
        <Pressable onPress={requestPermission}>
          <Text>許可する</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    // カメラで撮影 → 写真保存 → エントリー作成
    // 実装は後述
  };

  return (
    <View className="flex-1">
      <CameraView className="flex-1" facing={facing}>
        {/* シャッターボタンなどのUI */}
      </CameraView>
    </View>
  );
}
```

---

## 開発環境要件

### 必須
- **Node.js**: 18.0+
- **npm/yarn/pnpm**: 最新版
- **Expo CLI**: `npm install -g expo-cli`

### iOS開発（任意、Expoで開発可能）
- **macOS**: 14.0+
- **Xcode**: 15.0+
- **iOS Simulator**

### Android開発（任意）
- **Android Studio**
- **Android SDK**: API 21+（Android 5.0+）

---

## 次のステップ

1. **Expoプロジェクト初期化**
   ```bash
   npx create-expo-app@latest grain --template blank-typescript
   ```

2. **必要なパッケージインストール**
   ```bash
   npx expo install expo-router expo-sqlite expo-camera expo-image-manipulator
   npm install @tanstack/react-query zustand nativewind date-fns
   ```

3. **データベース初期化**
4. **画面実装開始**

---

**作成日**: 2026年2月8日
**最終更新**: 2026年2月8日
