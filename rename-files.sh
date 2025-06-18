#!/bin/bash

# ファイル名を正規化するスクリプト
# YYYYMMDD_EVENT_NAME.ext 形式に変更

echo "ファイル名の正規化を開始します..."

# PDFファイルの正規化
cd public/slides

echo "=== PDFファイルの正規化 ==="

# norents.pdf → 20250613_norents.pdf
if [ -f "norents.pdf" ]; then
    mv "norents.pdf" "20250613_norents.pdf"
    echo "✓ norents.pdf → 20250613_norents.pdf"
fi

# 20250512-ui-mcp.pdf → 20250512_UIExperts.pdf
if [ -f "20250512-ui-mcp.pdf" ]; then
    mv "20250512-ui-mcp.pdf" "20250512_UIExperts.pdf"
    echo "✓ 20250512-ui-mcp.pdf → 20250512_UIExperts.pdf"
fi

# 4年間でのフロントエンド リアーキテクチャの変遷と進め方.pdf → 20241212_TechFrontMeetup.pdf
if [ -f "4年間でのフロントエンド リアーキテクチャの変遷と進め方.pdf" ]; then
    mv "4年間でのフロントエンド リアーキテクチャの変遷と進め方.pdf" "20241212_TechFrontMeetup.pdf"
    echo "✓ 4年間でのフロントエンド リアーキテクチャの変遷と進め方.pdf → 20241212_TechFrontMeetup.pdf"
fi

# コンパウンド戦略を支えるフロントエンド基盤設計.pdf → 20241108_WebFrontendStudy.pdf
if [ -f "コンパウンド戦略を支えるフロントエンド基盤設計.pdf" ]; then
    mv "コンパウンド戦略を支えるフロントエンド基盤設計.pdf" "20241108_WebFrontendStudy.pdf"
    echo "✓ コンパウンド戦略を支えるフロントエンド基盤設計.pdf → 20241108_WebFrontendStudy.pdf"
fi

# 腐敗防止層によるスムーズなライブラリ移行.pdf → 20240824_FrontendConfHokkaido.pdf
if [ -f "腐敗防止層によるスムーズなライブラリ移行.pdf" ]; then
    mv "腐敗防止層によるスムーズなライブラリ移行.pdf" "20240824_FrontendConfHokkaido.pdf"
    echo "✓ 腐敗防止層によるスムーズなライブラリ移行.pdf → 20240824_FrontendConfHokkaido.pdf"
fi

# Encraft #12 DOMクイズ！ のコピー.pdf → 20240328_Encraft12.pdf
if [ -f "Encraft #12 DOMクイズ！ のコピー.pdf" ]; then
    mv "Encraft #12 DOMクイズ！ のコピー.pdf" "20240328_Encraft12.pdf"
    echo "✓ Encraft #12 DOMクイズ！ のコピー.pdf → 20240328_Encraft12.pdf"
fi

# ButtonとLink、どう実装する？ のコピー.pdf → 20230830_Encraft6.pdf
if [ -f "ButtonとLink、どう実装する？ のコピー.pdf" ]; then
    mv "ButtonとLink、どう実装する？ のコピー.pdf" "20230830_Encraft6.pdf"
    echo "✓ ButtonとLink、どう実装する？ のコピー.pdf → 20230830_Encraft6.pdf"
fi

# Suspense Fetchを3年実用してみて - Encraft#4 のコピー.pdf → 20230629_Encraft4.pdf
if [ -f "Suspense Fetchを3年実用してみて - Encraft#4 のコピー.pdf" ]; then
    mv "Suspense Fetchを3年実用してみて - Encraft#4 のコピー.pdf" "20230629_Encraft4.pdf"
    echo "✓ Suspense Fetchを3年実用してみて - Encraft#4 のコピー.pdf → 20230629_Encraft4.pdf"
fi

# 20230120-Recoil勉強会 のコピー.pdf → 20230120_HarajukuJsMeetup.pdf
if [ -f "20230120-Recoil勉強会 のコピー.pdf" ]; then
    mv "20230120-Recoil勉強会 のコピー.pdf" "20230120_HarajukuJsMeetup.pdf"
    echo "✓ 20230120-Recoil勉強会 のコピー.pdf → 20230120_HarajukuJsMeetup.pdf"
fi

# 20221216_DevFest 2022 Web Session.pdf → 20221216_DevFest2022.pdf
if [ -f "20221216_DevFest 2022 Web Session.pdf" ]; then
    mv "20221216_DevFest 2022 Web Session.pdf" "20221216_DevFest2022.pdf"
    echo "✓ 20221216_DevFest 2022 Web Session.pdf → 20221216_DevFest2022.pdf"
fi

# 20211211_DevFest 2021 Web Session.pdf → 20211211_DevFest2021.pdf
if [ -f "20211211_DevFest 2021 Web Session.pdf" ]; then
    mv "20211211_DevFest 2021 Web Session.pdf" "20211211_DevFest2021.pdf"
    echo "✓ 20211211_DevFest 2021 Web Session.pdf → 20211211_DevFest2021.pdf"
fi

cd ../../

echo ""
echo "=== サムネイル画像の正規化 ==="

cd public/thumbnails

# norents.png → 20250613_norents.png
if [ -f "norents.png" ]; then
    mv "norents.png" "20250613_norents.png"
    echo "✓ norents.png → 20250613_norents.png"
fi

# 20250512-ui-mcp.png → 20250512_UIExperts.png
if [ -f "20250512-ui-mcp.png" ]; then
    mv "20250512-ui-mcp.png" "20250512_UIExperts.png"
    echo "✓ 20250512-ui-mcp.png → 20250512_UIExperts.png"
fi

# 4年間でのフロントエンド リアーキテクチャの変遷と進め方.png → 20241212_TechFrontMeetup.png
if [ -f "4年間でのフロントエンド リアーキテクチャの変遷と進め方.png" ]; then
    mv "4年間でのフロントエンド リアーキテクチャの変遷と進め方.png" "20241212_TechFrontMeetup.png"
    echo "✓ 4年間でのフロントエンド リアーキテクチャの変遷と進め方.png → 20241212_TechFrontMeetup.png"
fi

# コンパウンド戦略を支えるフロントエンド基盤設計.png → 20241108_WebFrontendStudy.png
if [ -f "コンパウンド戦略を支えるフロントエンド基盤設計.png" ]; then
    mv "コンパウンド戦略を支えるフロントエンド基盤設計.png" "20241108_WebFrontendStudy.png"
    echo "✓ コンパウンド戦略を支えるフロントエンド基盤設計.png → 20241108_WebFrontendStudy.png"
fi

# 腐敗防止層によるスムーズなライブラリ移行.png → 20240824_FrontendConfHokkaido.png
if [ -f "腐敗防止層によるスムーズなライブラリ移行.png" ]; then
    mv "腐敗防止層によるスムーズなライブラリ移行.png" "20240824_FrontendConfHokkaido.png"
    echo "✓ 腐敗防止層によるスムーズなライブラリ移行.png → 20240824_FrontendConfHokkaido.png"
fi

# Encraft #12 DOMクイズ！ のコピー.png → 20240328_Encraft12.png
if [ -f "Encraft #12 DOMクイズ！ のコピー.png" ]; then
    mv "Encraft #12 DOMクイズ！ のコピー.png" "20240328_Encraft12.png"
    echo "✓ Encraft #12 DOMクイズ！ のコピー.png → 20240328_Encraft12.png"
fi

# ButtonとLink、どう実装する？ のコピー.png → 20230830_Encraft6.png
if [ -f "ButtonとLink、どう実装する？ のコピー.png" ]; then
    mv "ButtonとLink、どう実装する？ のコピー.png" "20230830_Encraft6.png"
    echo "✓ ButtonとLink、どう実装する？ のコピー.png → 20230830_Encraft6.png"
fi

# Suspense Fetchを3年実用してみて - Encraft#4 のコピー.png → 20230629_Encraft4.png
if [ -f "Suspense Fetchを3年実用してみて - Encraft#4 のコピー.png" ]; then
    mv "Suspense Fetchを3年実用してみて - Encraft#4 のコピー.png" "20230629_Encraft4.png"
    echo "✓ Suspense Fetchを3年実用してみて - Encraft#4 のコピー.png → 20230629_Encraft4.png"
fi

# 20230120-Recoil勉強会 のコピー.png → 20230120_HarajukuJsMeetup.png
if [ -f "20230120-Recoil勉強会 のコピー.png" ]; then
    mv "20230120-Recoil勉強会 のコピー.png" "20230120_HarajukuJsMeetup.png"
    echo "✓ 20230120-Recoil勉強会 のコピー.png → 20230120_HarajukuJsMeetup.png"
fi

# 20221216_DevFest 2022 Web Session.png → 20221216_DevFest2022.png
if [ -f "20221216_DevFest 2022 Web Session.png" ]; then
    mv "20221216_DevFest 2022 Web Session.png" "20221216_DevFest2022.png"
    echo "✓ 20221216_DevFest 2022 Web Session.png → 20221216_DevFest2022.png"
fi

# 20211211_DevFest 2021 Web Session.png → 20211211_DevFest2021.png
if [ -f "20211211_DevFest 2021 Web Session.png" ]; then
    mv "20211211_DevFest 2021 Web Session.png" "20211211_DevFest2021.png"
    echo "✓ 20211211_DevFest 2021 Web Session.png → 20211211_DevFest2021.png"
fi

cd ../../

echo ""
echo "ファイル名の正規化が完了しました！"
echo ""
echo "=== 結果確認 ==="
echo "PDFファイル:"
ls -la public/slides/
echo ""
echo "サムネイル画像:"
ls -la public/thumbnails/