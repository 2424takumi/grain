# Grain v1.0 - UI/UX詳細デザイン仕様書

## 目次
1. [デザイン哲学](#デザイン哲学)
2. [カラーシステム](#カラーシステム)
3. [タイポグラフィ](#タイポグラフィ)
4. [画面設計詳細](#画面設計詳細)
5. [コンポーネント仕様](#コンポーネント仕様)
6. [アニメーション・トランジション](#アニメーショントランジション)
7. [アクセシビリティ](#アクセシビリティ)
8. [実装ガイドライン](#実装ガイドライン)

---

## デザイン哲学

### コアプリンシパル

**1. ミニマリズム × 深み**
- 視覚的ノイズを最小限に抑え、写真とコンテンツに集中
- シンプルな見た目の裏に、思慮深い機能設計
- 「引き算のデザイン」で本質的な価値を際立たせる

**2. 時間の可視化**
- 縦スクロールタイムライン = 時間の流れを直感的に表現
- 写真の変化でユーザー自身の変化を感じさせる
- 「今日」と「過去」の視覚的な境界を明確に

**3. プライバシー第一のUI**
- ログイン画面なし（アプリ起動 = 即タイムライン）
- クラウド同期の設定項目なし（混乱を避ける）
- シンプルさがプライバシー保護の証明

**4. 習慣形成をサポート**
- カメラへの導線を最短に（1タップで撮影画面）
- ストリークの可視化でモチベーション維持
- 完了後の達成感を演出（サブトルなアニメーション）

---

## カラーシステム

### プライマリカラー（シンプル・現代的）

```swift
// ライトモード - ミニマルでクリーン
struct LightColors {
    static let background = Color.white                // 純白背景
    static let primary = Color.black                   // 純黒テキスト
    static let secondary = Color.gray                  // グレーテキスト
    static let accent = Color.black                    // アクセントも黒（ミニマル）
    static let divider = Color(hex: "#F0F0F0")         // ほぼ見えない薄いグレー
}

// ダークモード - OLED対応
struct DarkColors {
    static let background = Color.black                // 純黒背景
    static let primary = Color.white                   // 純白テキスト
    static let secondary = Color.gray                  // グレーテキスト
    static let accent = Color.white                    // アクセントも白
    static let divider = Color(hex: "#1A1A1A")         // ダークグレー
}

// Note: カード、ボタン、境界線などの装飾を最小限に。
// 写真とテキストだけが際立つデザイン。
```

### セマンティックカラー（最小限）

```swift
struct SemanticColors {
    // ストリーク - シンプルに黒/白のみ
    static let streakText = Color.primary              // 黒/白（モードに応じて）

    // ステータス - iOSシステムカラーをそのまま使用
    static let success = Color.green
    static let error = Color.red

    // ゴーストオーバーレイ - 控えめに
    static let ghostOverlay = Color.white.opacity(0.2) // より透明に
}
```

---

## タイポグラフィ

### フォントシステム

```swift
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
    static let streakNumber = Font.system(size: 48, weight: .heavy, design: .rounded)
    static let dateLabel = Font.system(size: 15, weight: .medium, design: .default)
}
```

### 日本語対応

- システムフォント（San Francisco）の日本語フォールバック（Hiragino Sans）を活用
- 行間: 1.4〜1.6（日本語の可読性を考慮）
- 文字間隔: デフォルト（-0.5pt 〜 0pt、状況に応じて調整）

---

## 画面設計詳細

### 1. タイムライン画面（Timeline View）

#### レイアウト構造

```
┌─────────────────────────────────┐
│                                 │
│  Grain          [+]             │ ← シンプルなヘッダー（設定は省略）
│                                 │
├─────────────────────────────────┤
│                                 │
│  2月8日（土）                    │ ← 日付のみ（時刻は省略）
│                                 │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │      写真（1:1正方形）        │ │ ← 画面幅いっぱい（余白なし）
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│  今日も同じ場所から...           │ ← テキスト（1行のみ、余白16pt）
│                                 │
│                                 │ ← 余白のみ（ディバイダーなし）
│  2月7日（金）                    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │      写真（1:1正方形）        │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│  昨日と少し角度が...             │
│                                 │
└─────────────────────────────────┘
```

#### コンポーネント詳細

**ヘッダー（超シンプル）**
- 高さ: 44pt + Safe Area
- 背景: なし（透明）
- 左: "Grain"（テキストのみ、SF Pro Display, 20pt, Bold）
- 右: "+"（テキストのみ、24pt、タップでカメラ）
- 設定ボタン: なし（長押しで設定を表示、またはジェスチャー）

**エントリー表示（カードなし）**
- カード背景: なし（フラットデザイン）
- 角丸: なし
- シャドウ: なし
- 余白: 写真間のみ24pt

**日付ヘッダー（最小限）**
- フォーマット: "M月d日（E）"（例: 2月8日（土））
- フォント: `Typography.caption1`（小さく控えめに）
- カラー: `secondary`（グレー）
- 撮影時刻: 表示しない（詳細画面で確認可能）
- 余白: 左右16pt

**写真表示（フルブリード）**
- アスペクト比: 1:1（正方形、固定）
- 幅: 画面幅いっぱい（余白0pt）
- 角丸: なし（四角いまま）
- 読み込み中: シンプルなグレー背景のみ
- タップ: エントリー詳細画面へ遷移

**ジャーナルテキスト（控えめ）**
- フォント: `Typography.callout`（やや小さめ）
- カラー: `secondary`（グレー、控えめ）
- 行数制限: 1行のみ（`lineLimit(1)`）
- 省略: `...`で末尾を省略
- 余白: 写真下8pt、左右16pt

**空状態（Empty State）**
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│         +                       │ ← シンプルな+記号のみ（80pt）
│                                 │
│   タップして最初の1枚を撮影       │ ← 小さなテキスト（caption）
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

#### インタラクション

**スクロール動作**
- スクロール方向: 縦（最新が上）
- スクロールインジケーター: 表示（iOS標準）
- プルトゥリフレッシュ: なし（リアルタイム更新）
- ページング: なし（連続スクロール）

**タップ領域**
- エントリーカード全体: エントリー詳細画面へ
- カメラボタン: カメラ画面へ（今日のエントリーがない場合）
- カメラボタン（今日のエントリーあり）: 今日のエントリー詳細画面へ

---

### 2. カメラ画面（Camera View）

#### レイアウト構造

```
┌─────────────────────────────────┐
│ [×]                             │ ← 閉じるボタン（左上）
│                                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │                         │   │
│  │    カメラプレビュー      │   │ ← 1:1正方形
│  │    （ゴーストオーバーレイ）│   │
│  │                         │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│      前日と同じ構図で撮ろう       │ ← ヒントテキスト
│                                 │
│          ⚪️  🔄               │ ← シャッターボタン、カメラ切替
│                                 │
└─────────────────────────────────┘
```

#### コンポーネント詳細

**カメラプレビュー**
- アスペクト比: 1:1（正方形）
- 幅: `UIScreen.main.bounds.width`（フルスクリーン）
- 背景: 黒
- オーバーレイ: 前日の写真を30%透過で重ねる（初回撮影時は非表示）

**ゴーストオーバーレイ（Ghost Overlay）**
```swift
// 前日の写真を透過表示
Image(uiImage: previousPhoto)
    .resizable()
    .scaledToFill()
    .frame(width: previewWidth, height: previewWidth)
    .opacity(0.3)
    .allowsHitTesting(false)
    .blendMode(.normal)
```

**閉じるボタン**
- 位置: 左上（Safe Area + 16pt）
- アイコン: SF Symbol `xmark`
- サイズ: 44x44pt（タップ領域）
- 背景: 半透明の黒（`Color.black.opacity(0.3)`）
- アクション: モーダルを閉じる

**シャッターボタン**
- サイズ: 72x72pt
- デザイン: 白い外側リング（4pt太さ）+ 白い内側円（60pt直径）
- 配置: 画面下部中央（Safe Area + 32pt）
- アニメーション: タップ時に0.8倍にスケール
- アクション: 写真撮影

**カメラ切り替えボタン**
- 位置: シャッターボタン右側（右に80pt）
- アイコン: SF Symbol `arrow.triangle.2.circlepath.camera`
- サイズ: 44x44pt
- カラー: 白
- アクション: フロント/リアカメラ切り替え

**ヒントテキスト**
- フォント: `Typography.callout`
- カラー: 白（`Color.white`）
- 背景: 半透明の黒（`Color.black.opacity(0.5)`）
- パディング: 8pt（上下）、12pt（左右）
- 角丸: 8pt
- 配置: プレビュー下部、シャッターボタン上部
- テキスト: "前日と同じ構図で撮ろう"（初回は"最初の1枚を撮影しよう"）

#### 撮影フロー

1. **カメラ画面表示**
   - モーダルプレゼンテーション（`.fullScreenCover`）
   - カメラ権限チェック → 未許可なら設定画面へ誘導

2. **シャッター押下**
   - ハプティックフィードバック（`.impact(.medium)`）
   - シャッター音（システム標準）
   - プレビュー画像を一瞬フラッシュ表示（白い全画面を0.1秒）

3. **写真保存 & 画面遷移**
   - ローディングインジケーター表示（0.5秒程度）
   - エントリー作成完了後、エントリー詳細画面へ自動遷移
   - カメラ画面は自動的に閉じる

---

### 3. エントリー詳細画面（Entry Detail View）

#### レイアウト構造

```
┌─────────────────────────────────┐
│ [<]  2026年2月8日（土）  [•••]   │ ← ナビゲーションバー
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │                             │ │
│ │      写真（1:1正方形）        │ │ ← ピンチズーム可能
│ │                             │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│  📍 東京都渋谷区                 │ ← 位置情報（optional）
│  📷 15:24撮影                   │ ← 撮影時刻
│                                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ← ディバイダー
│                                 │
│  今日も同じ場所から。朝日が       │
│  きれいで、思わずシャッターを     │ ← ジャーナルテキスト（全文表示）
│  切った。明日も晴れるといいな。   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  メモを編集...              │   │ ← テキストフィールド（タップで編集モード）
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

#### コンポーネント詳細

**ナビゲーションバー**
- 左ボタン: 戻る（`<`、SF Symbol: `chevron.left`）
- タイトル: 日付（"yyyy年M月d日（E）"）
- 右ボタン: メニュー（`•••`、SF Symbol: `ellipsis.circle`）
  - メニュー項目:
    - 📤 写真をエクスポート
    - 🗑️ このエントリーを削除（赤文字、破壊的アクション）

**写真表示**
- アスペクト比: 1:1（正方形）
- 幅: 画面幅いっぱい（余白なし）
- ピンチズーム: 可能（`MagnificationGesture`）
- ズーム範囲: 1.0x 〜 3.0x
- ダブルタップ: 2.0xズーム（再度タップで1.0xに戻る）

**メタ情報セクション**
- 余白: 左右16pt、上下12pt
- フォント: `Typography.subheadline`
- カラー: `secondary`
- アイコン + テキスト形式:
  ```swift
  HStack(spacing: 4) {
      Image(systemName: "location.fill")
          .foregroundColor(.secondary)
      Text("東京都渋谷区")
  }
  ```

**ジャーナルテキストフィールド**
- 背景: `surface` color
- 境界線: `divider` color、1pt
- 角丸: 8pt
- パディング: 12pt
- フォント: `Typography.body`
- プレースホルダー: "メモを編集..."（`placeholder` color）
- 最大文字数: 5000文字
- 自動保存: 編集終了時（`onEditingChanged`）
- アニメーション: フォーカス時に境界線を`accent` colorに変更

#### インタラクション

**編集モード**
1. テキストフィールドタップ → キーボード表示
2. 編集中はナビゲーションバー右ボタンが「完了」に変化
3. 「完了」タップ or キーボード外タップ → 自動保存 & 編集終了

**削除フロー**
1. メニュー → "このエントリーを削除"タップ
2. アクションシート表示:
   ```
   このエントリーを削除しますか？
   写真とメモは完全に削除されます。

   [キャンセル]
   [削除]（赤文字）
   ```
3. "削除"タップ → エントリー削除 → タイムライン画面に戻る

---

### 4. 設定画面（Settings View）

#### レイアウト構造

```
┌─────────────────────────────────┐
│ [<]        設定                  │ ← ナビゲーションバー
├─────────────────────────────────┤
│                                 │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  🔥 15日連続                 ┃ │ ← ストリークカード
│ ┃  最長記録: 22日               ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                 │
│ 一般                            │
│  📱 アプリアイコン           >   │
│  🌓 外観モード               >   │
│                                 │
│ データ                          │
│  📤 すべてのエントリーをエクスポート │
│  💾 ストレージ使用量: 245 MB     │
│                                 │
│ アップグレード                   │
│  ⭐️ プレミアム版を購入       >   │
│  （無制限の履歴・テーマ・エクスポート）│
│                                 │
│ サポート                        │
│  ❓ ヘルプ & FAQ             >   │
│  📧 フィードバックを送る       >   │
│  ℹ️  アプリについて           >   │
│                                 │
└─────────────────────────────────┘
```

#### コンポーネント詳細

**ストリーク表示（ミニマル）**
- 背景: なし（透明）
- 角丸: なし
- パディング: 16pt
- シャドウ: なし
- ボーダー: 1pt、黒/白（モードに応じて）
- テキストカラー: 黒/白
- フォント:
  - ストリーク数: `Typography.largeTitle`（シンプルに）
  - "日連続": `Typography.body`
  - "最長記録": `Typography.caption1`
- 絵文字: なし（テキストのみ）

**セクションヘッダー**
- フォント: `Typography.footnote`
- カラー: `secondary`
- テキスト変換: `.uppercased()`（英語の場合）
- 余白: 左16pt、上24pt、下8pt

**リスト項目**
- 高さ: 44pt（最小タップ領域）
- 背景: `surface` color
- ディバイダー: `divider` color、0.5pt
- レイアウト: `HStack(spacing: 12)`
  - アイコン（SF Symbol、20pt）
  - タイトル（`Typography.body`、`primary`）
  - Spacer()
  - 詳細テキスト（optional、`secondary`）
  - 右矢印（`chevron.right`、`tertiary`）

**購入ボタン**
- 背景: `accent` color
- テキストカラー: 白
- フォント: `Typography.bodyBold`
- 角丸: 12pt
- パディング: 16pt（上下）
- シャドウ: `Color.accent.opacity(0.3)`, radius: 8, y: 4
- アニメーション: タップ時に0.95倍スケール

---

## コンポーネント仕様

### 共通コンポーネント

#### 1. PrimaryButton

```swift
struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    @Environment(\.isEnabled) var isEnabled

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(Typography.bodyBold)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(isEnabled ? Color.accent : Color.secondary)
                .cornerRadius(12)
        }
        .scaleEffect(isPressed ? 0.95 : 1.0)
        .animation(.spring(response: 0.3), value: isPressed)
    }
}
```

#### 2. EntryCard（超シンプル版）

```swift
struct EntryCard: View {
    let entry: DailyEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // 日付ヘッダー（小さく控えめ）
            Text(entry.entryDate, format: .dateTime.month().day().weekday())
                .font(Typography.caption1)
                .foregroundColor(.secondary)
                .padding(.horizontal, 16)

            // 写真（フルブリード、角丸なし）
            AsyncImage(url: entry.photoURL) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .scaledToFill()
                case .empty:
                    Color.gray.opacity(0.1) // シンプルなグレー背景
                case .failure:
                    Color.gray.opacity(0.1)
                @unknown default:
                    EmptyView()
                }
            }
            .frame(width: screenWidth, height: screenWidth)
            .clipped()
            // 角丸なし、シャドウなし

            // ジャーナルテキスト（1行のみ、控えめ）
            if let text = entry.journalText, !text.isEmpty {
                Text(text)
                    .font(Typography.callout)
                    .foregroundColor(.secondary)
                    .lineLimit(1)
                    .padding(.horizontal, 16)
            }
        }
        // 背景なし、シャドウなし、カード感なし
    }
}
```

#### 3. StreakBadge（ミニマル版）

```swift
struct StreakBadge: View {
    let currentStreak: Int
    let longestStreak: Int

    var body: some View {
        VStack(spacing: 12) {
            // 大きな数字のみ
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text("\(currentStreak)")
                    .font(Typography.largeTitle)
                    .foregroundColor(.primary)

                Text("日連続")
                    .font(Typography.body)
                    .foregroundColor(.secondary)
            }

            // 最長記録（控えめ）
            Text("最長記録: \(longestStreak)日")
                .font(Typography.caption1)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(16)
        .overlay(
            RoundedRectangle(cornerRadius: 0)
                .stroke(Color.primary, lineWidth: 1)
        )
        // グラデーション、シャドウ、絵文字なし
    }
}
```

---

## アニメーション・トランジション

### 画面遷移

**タイムライン → エントリー詳細**
```swift
.navigationDestination(for: DailyEntry.self) { entry in
    EntryDetailView(entry: entry)
}
// デフォルトのpush遷移（右からスライドイン）
```

**カメラモーダル表示**
```swift
.fullScreenCover(isPresented: $showCamera) {
    CameraView()
}
// フルスクリーンモーダル（下から上へスライドアップ）
```

### マイクロインタラクション

**ボタンタップ**
```swift
.scaleEffect(isPressed ? 0.95 : 1.0)
.animation(.spring(response: 0.3, dampingFraction: 0.6), value: isPressed)
```

**写真撮影時のフラッシュ**
```swift
// 白い全画面オーバーレイを0.1秒表示
Color.white
    .opacity(showFlash ? 1.0 : 0.0)
    .animation(.easeOut(duration: 0.1), value: showFlash)
    .ignoresSafeArea()
```

**エントリー追加時**
```swift
// タイムラインの一番上に新しいカードが挿入される
.transition(.asymmetric(
    insertion: .move(edge: .top).combined(with: .opacity),
    removal: .opacity
))
.animation(.spring(response: 0.5), value: entries)
```

**ストリーク更新時**
```swift
// 数字が変わる時に軽くバウンス
Text("\(currentStreak)")
    .contentTransition(.numericText())
    .animation(.spring(response: 0.4, dampingFraction: 0.7), value: currentStreak)
```

---

## アクセシビリティ

### VoiceOver対応

**画像の代替テキスト**
```swift
Image(uiImage: photo)
    .accessibilityLabel("2026年2月8日の写真")
    .accessibilityHint("タップして詳細を表示")
```

**ボタンのラベル**
```swift
Button(action: openCamera) {
    Image(systemName: "camera.fill")
}
.accessibilityLabel("カメラを開く")
.accessibilityHint("今日の写真を撮影します")
```

### Dynamic Type対応

- すべてのテキストでシステムフォント（`.system`）を使用
- `lineLimit`の代わりに`.fixedSize(horizontal: false, vertical: true)`を併用
- 最小タップ領域: 44x44pt（Apple Human Interface Guidelines準拠）

### カラーコントラスト

- WCAG AA基準（4.5:1以上）を遵守
- テキスト vs 背景:
  - ライトモード: `#2C2C2C` vs `#FAFAFA` = 12.6:1 ✅
  - ダークモード: `#FFFFFF` vs `#000000` = 21:1 ✅

---

## 実装ガイドライン

### ファイル構造

```
Grain/
├── Views/
│   ├── Timeline/
│   │   ├── TimelineView.swift
│   │   ├── EntryCard.swift
│   │   └── EmptyStateView.swift
│   ├── EntryDetail/
│   │   ├── EntryDetailView.swift
│   │   └── PhotoZoomView.swift
│   ├── Camera/
│   │   ├── CameraView.swift
│   │   └── GhostOverlayView.swift
│   ├── Settings/
│   │   ├── SettingsView.swift
│   │   ├── StreakBadge.swift
│   │   └── PurchaseButton.swift
│   └── Common/
│       ├── PrimaryButton.swift
│       └── LoadingView.swift
├── DesignSystem/
│   ├── Colors.swift
│   ├── Typography.swift
│   ├── Spacing.swift
│   └── Animations.swift
└── Resources/
    └── Assets.xcassets
```

### デザイントークンの管理

```swift
// Colors.swift
extension Color {
    static let grainBackground = Color("Background")
    static let grainSurface = Color("Surface")
    static let grainPrimary = Color("Primary")
    // ... (Assets.xcassetsで色を管理)
}

// Typography.swift
struct Typography {
    // フォント定義（前述）
}

// Spacing.swift
enum Spacing {
    static let xxs: CGFloat = 4
    static let xs: CGFloat = 8
    static let sm: CGFloat = 12
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
}
```

### プレビュー用サンプルデータ

```swift
extension DailyEntry {
    static var preview: DailyEntry {
        let entry = DailyEntry(
            id: UUID(),
            entryDate: Date(),
            createdAt: Date(),
            updatedAt: Date(),
            journalText: "今日も同じ場所から。朝日がきれいで、思わずシャッターを切った。",
            originalPhotoPath: "preview_photo.jpg",
            thumbnailPhotoPath: "preview_thumb.jpg",
            photoFileSize: 1024000,
            photoWidth: 2000,
            photoHeight: 2000
        )
        return entry
    }
}

// プレビュー
#Preview {
    TimelineView()
        .modelContainer(previewContainer)
}
```

---

## チェックリスト

### デザイン実装完了基準

- [ ] すべての画面がライト/ダークモード対応
- [ ] Dynamic Type（文字サイズ変更）で表示崩れなし
- [ ] VoiceOver使用時にすべての要素が読み上げられる
- [ ] 最小タップ領域44x44ptを満たしている
- [ ] カラーコントラストがWCAG AA基準を満たす
- [ ] アニメーションが0.3秒以内（マイクロインタラクション）
- [ ] ローディング状態が明確に表示される
- [ ] エラー状態が適切にハンドリングされる
- [ ] 各画面のプレビューが正しく動作する

---

**作成日**: 2026年2月8日
**バージョン**: v1.0
**最終更新**: 2026年2月8日
