# Grain アプリ - 開発環境セットアップガイド

このガイドでは、Grainアプリの開発を始めるための環境セットアップ手順を説明します。

---

## 前提条件

### 必須

- **macOS**: 14.0 (Sonoma) 以降
- **Xcode**: 15.0 以降（現在のバージョン: 16.4 ✅）
- **Apple Developer アカウント**: 年間 $99
  - 登録: https://developer.apple.com

### 推奨

- **Git**: バージョン管理（すでにインストール済み ✅）
- **GitHub アカウント**: コード管理（リポジトリ: https://github.com/2424takumi/grain.git ✅）

---

## ステップ1: Apple Developer アカウント登録

1. **Apple Developer Program に登録**
   - URL: https://developer.apple.com/programs/
   - 料金: $99/年
   - 登録には Apple ID が必要

2. **登録完了の確認**
   - App Store Connect にアクセス可能か確認
   - URL: https://appstoreconnect.apple.com

---

## ステップ2: Xcodeプロジェクト作成

### 方法1: Xcode GUIで作成（推奨）

1. **Xcodeを起動**
   ```bash
   open -a Xcode
   ```

2. **新規プロジェクト作成**
   - `File` > `New` > `Project...`
   - または起動画面で `Create New Project` をクリック

3. **テンプレート選択**
   - `iOS` タブを選択
   - `App` を選択
   - `Next` をクリック

4. **プロジェクト設定**
   - **Product Name**: `Grain`
   - **Team**: あなたの Apple Developer チームを選択
   - **Organization Identifier**: `com.yourname`（例: `com.takumi`）
   - **Bundle Identifier**: 自動生成される（例: `com.takumi.Grain`）
   - **Interface**: `SwiftUI`
   - **Language**: `Swift`
   - **Storage**: `None`（後で SwiftData を手動追加）
   - **Include Tests**: ✅ チェックを入れる

5. **保存場所**
   - プロジェクトディレクトリ: `/Users/a2424/Documents/grain/Grain`
   - `Create Git repository on my Mac`: ✅ チェックを入れる
   - `Create` をクリック

### 方法2: コマンドラインで作成（上級者向け）

```bash
cd /Users/a2424/Documents/grain

# xcodeproj gem をインストール（初回のみ）
sudo gem install xcodeproj

# プロジェクト作成スクリプト実行
# （手動でXcodeを開く方が確実です）
```

**注意**: コマンドラインからの完全な Xcode プロジェクト作成は複雑なため、GUI での作成を推奨します。

---

## ステップ3: SwiftData の追加

### 1. GrainApp.swift を編集

プロジェクトを作成すると、`GrainApp.swift` というファイルが生成されます。これを以下のように編集します:

```swift
import SwiftUI
import SwiftData

@main
struct GrainApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [DailyEntry.self, AppSettings.self])
    }
}
```

### 2. データモデルの作成

`Models` フォルダを作成し、`DailyEntry.swift` を追加:

**ファイル**: `Grain/Models/DailyEntry.swift`

```swift
import Foundation
import SwiftData

@Model
final class DailyEntry {
    @Attribute(.unique) var id: UUID
    @Attribute(.unique) var entryDate: Date  // 1日1エントリー制約
    var createdAt: Date
    var updatedAt: Date

    var journalText: String?  // 最大5000文字

    // 写真関連
    var originalPhotoPath: String  // "Photos/Original/{uuid}.heic"
    var thumbnailPhotoPath: String  // "Photos/Thumbnails/{uuid}.jpg"
    var photoFileSize: Int64
    var photoWidth: Int
    var photoHeight: Int

    // メタデータ（任意）
    var latitude: Double?
    var longitude: Double?
    var photoCaptureDate: Date?

    // ソフトデリート
    var isDeleted: Bool
    var deletedAt: Date?

    init(
        id: UUID = UUID(),
        entryDate: Date,
        createdAt: Date = Date(),
        updatedAt: Date = Date(),
        journalText: String? = nil,
        originalPhotoPath: String,
        thumbnailPhotoPath: String,
        photoFileSize: Int64,
        photoWidth: Int,
        photoHeight: Int,
        latitude: Double? = nil,
        longitude: Double? = nil,
        photoCaptureDate: Date? = nil,
        isDeleted: Bool = false,
        deletedAt: Date? = nil
    ) {
        self.id = id
        self.entryDate = entryDate
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.journalText = journalText
        self.originalPhotoPath = originalPhotoPath
        self.thumbnailPhotoPath = thumbnailPhotoPath
        self.photoFileSize = photoFileSize
        self.photoWidth = photoWidth
        self.photoHeight = photoHeight
        self.latitude = latitude
        self.longitude = longitude
        self.photoCaptureDate = photoCaptureDate
        self.isDeleted = isDeleted
        self.deletedAt = deletedAt
    }
}

// プレビュー用
extension DailyEntry {
    static var preview: DailyEntry {
        DailyEntry(
            entryDate: Date(),
            originalPhotoPath: "preview.heic",
            thumbnailPhotoPath: "preview_thumb.jpg",
            photoFileSize: 1024000,
            photoWidth: 2000,
            photoHeight: 2000
        )
    }
}
```

**ファイル**: `Grain/Models/AppSettings.swift`

```swift
import Foundation
import SwiftData

@Model
final class AppSettings {
    @Attribute(.unique) var id: UUID

    // アプリ設定
    var isDarkModeEnabled: Bool
    var selectedAppIcon: String
    var isPremiumUser: Bool

    // 統計
    var currentStreak: Int
    var longestStreak: Int
    var totalEntries: Int
    var lastStreakUpdateDate: Date?

    // オンボーディング
    var hasCompletedOnboarding: Bool
    var onboardingVersion: Int

    init(
        id: UUID = UUID(),
        isDarkModeEnabled: Bool = false,
        selectedAppIcon: String = "Default",
        isPremiumUser: Bool = false,
        currentStreak: Int = 0,
        longestStreak: Int = 0,
        totalEntries: Int = 0,
        lastStreakUpdateDate: Date? = nil,
        hasCompletedOnboarding: Bool = false,
        onboardingVersion: Int = 1
    ) {
        self.id = id
        self.isDarkModeEnabled = isDarkModeEnabled
        self.selectedAppIcon = selectedAppIcon
        self.isPremiumUser = isPremiumUser
        self.currentStreak = currentStreak
        self.longestStreak = longestStreak
        self.totalEntries = totalEntries
        self.lastStreakUpdateDate = lastStreakUpdateDate
        self.hasCompletedOnboarding = hasCompletedOnboarding
        self.onboardingVersion = onboardingVersion
    }
}
```

---

## ステップ4: デザインシステムの構築

### カラー定義

**ファイル**: `Grain/DesignSystem/Colors.swift`

```swift
import SwiftUI

extension Color {
    // ライトモード（ミニマル）
    static let grainBackground = Color.white
    static let grainPrimary = Color.black
    static let grainSecondary = Color.gray
    static let grainAccent = Color.black
    static let grainDivider = Color(hex: "#F0F0F0")

    // ダークモード対応は自動（.primary, .secondary を使用）
}

// Hexカラー初期化
extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        scanner.currentIndex = hex.hasPrefix("#") ? hex.index(after: hex.startIndex) : hex.startIndex

        var rgbValue: UInt64 = 0
        scanner.scanHexInt64(&rgbValue)

        let r = Double((rgbValue & 0xFF0000) >> 16) / 255.0
        let g = Double((rgbValue & 0x00FF00) >> 8) / 255.0
        let b = Double(rgbValue & 0x0000FF) / 255.0

        self.init(red: r, green: g, blue: b)
    }
}
```

### タイポグラフィ定義

**ファイル**: `Grain/DesignSystem/Typography.swift`

```swift
import SwiftUI

struct Typography {
    // ヘッドライン
    static let largeTitle = Font.system(size: 34, weight: .bold)
    static let title1 = Font.system(size: 28, weight: .bold)
    static let title2 = Font.system(size: 22, weight: .bold)
    static let title3 = Font.system(size: 20, weight: .semibold)

    // ボディ
    static let body = Font.system(size: 17, weight: .regular)
    static let bodyBold = Font.system(size: 17, weight: .semibold)
    static let callout = Font.system(size: 16, weight: .regular)

    // サブテキスト
    static let subheadline = Font.system(size: 15, weight: .regular)
    static let footnote = Font.system(size: 13, weight: .regular)
    static let caption1 = Font.system(size: 12, weight: .regular)
    static let caption2 = Font.system(size: 11, weight: .regular)

    // 特殊用途
    static let dateLabel = Font.system(size: 15, weight: .medium)
}
```

---

## ステップ5: ビルド確認

### 1. ビルドターゲット設定

- Xcodeのツールバーで、ターゲットを選択
- `Grain` > `iPhone 15 Pro`（または任意のシミュレーター）

### 2. ビルド実行

```
⌘ + B（Command + B）
```

または

- `Product` > `Build`

### 3. エラーがないか確認

初回ビルドは成功するはずです。エラーが出た場合:
- Swift のバージョン確認
- iOS Deployment Target が 17.0 以上か確認

### 4. シミュレーターで実行

```
⌘ + R（Command + R）
```

または

- `Product` > `Run`

デフォルトの "Hello, World!" 画面が表示されれば成功です。

---

## ステップ6: Git リポジトリとの統合

### Xcodeで作成したプロジェクトを既存のリポジトリに統合

```bash
cd /Users/a2424/Documents/grain

# Xcodeプロジェクトを Grain ディレクトリに作成した場合
git add Grain/
git commit -m "Add Xcode project setup

- SwiftUI + SwiftData プロジェクト作成
- データモデル（DailyEntry, AppSettings）追加
- デザインシステム（Colors, Typography）追加

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

### .gitignore の追加

**ファイル**: `/Users/a2424/Documents/grain/.gitignore`

```gitignore
# Xcode
*.xcodeproj/*
!*.xcodeproj/project.pbxproj
!*.xcodeproj/xcshareddata/
!*.xcworkspace/contents.xcworkspacedata
*.xcworkspace/*
!*.xcworkspace/xcshareddata/

# Build
build/
DerivedData/
*.ipa
*.dSYM.zip
*.dSYM

# Swift Package Manager
.build/
Packages/
*.xcodeproj

# CocoaPods
Pods/

# fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots/**/*.png
fastlane/test_output

# macOS
.DS_Store

# User-specific
*.xcuserstate
*.xcuserdatad/
xcuserdata/

# Swift
*.swiftpm
.swiftpm/
```

---

## ステップ7: 次のステップ

環境セットアップが完了しました！次は:

1. **タイムラインビューの実装** → `WEEK_1_QUICK_START.md` を参照
2. **カメラ統合** → Week 1 Day 2-3
3. **データ管理** → Week 1 Day 4-5

---

## トラブルシューティング

### ビルドエラー: "No such module 'SwiftData'"

**原因**: iOS Deployment Target が古い

**解決策**:
1. プロジェクトナビゲーターで `Grain` を選択
2. `TARGETS` > `Grain` を選択
3. `General` タブ
4. `Minimum Deployments` > `iOS 17.0` に設定

### シミュレーターが起動しない

**解決策**:
```bash
# シミュレーターをリセット
xcrun simctl shutdown all
xcrun simctl erase all
```

### Apple Developer Team が表示されない

**解決策**:
1. `Xcode` > `Settings...`
2. `Accounts` タブ
3. `+` ボタンで Apple ID を追加
4. サインイン後、チームが表示される

---

## 便利なショートカット

| ショートカット | 機能 |
|--------------|------|
| ⌘ + B | ビルド |
| ⌘ + R | 実行 |
| ⌘ + . | 停止 |
| ⌘ + Shift + K | クリーンビルド |
| ⌘ + Option + P | Resumeプレビュー（SwiftUI） |
| ⌘ + / | コメントトグル |

---

**作成日**: 2026年2月8日
**最終更新**: 2026年2月8日
