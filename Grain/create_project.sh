#!/bin/bash

# Xcodeプロジェクトの初期化
# Note: xcodeproj はコマンドラインから完全に作成できないため、
# 基本的なディレクトリ構造を作成し、Xcodeで開くための準備をします

echo "Grainプロジェクトのディレクトリ構造を作成中..."

# ソースコードディレクトリ
mkdir -p Grain/Views/Timeline
mkdir -p Grain/Views/EntryDetail
mkdir -p Grain/Views/Camera
mkdir -p Grain/Views/Settings
mkdir -p Grain/Views/Common
mkdir -p Grain/Views/Onboarding

mkdir -p Grain/ViewModels

mkdir -p Grain/Models

mkdir -p Grain/Services/Data
mkdir -p Grain/Services/Storage
mkdir -p Grain/Services/Camera

mkdir -p Grain/UseCases

mkdir -p Grain/DesignSystem

mkdir -p Grain/Resources/Assets.xcassets

mkdir -p GrainTests
mkdir -p GrainUITests

echo "✅ ディレクトリ構造作成完了"
echo ""
echo "次のステップ:"
echo "1. Xcodeを開く"
echo "2. File > New > Project..."
echo "3. iOS > App を選択"
echo "4. プロジェクト名: Grain"
echo "5. Organization Identifier: com.yourname（あなたの名前に変更）"
echo "6. Interface: SwiftUI"
echo "7. Language: Swift"
echo "8. Storage: なし（後で SwiftData を追加）"
echo "9. このディレクトリに保存"
echo ""
echo "または、自動作成を試みます..."

