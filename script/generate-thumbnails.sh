#!/bin/bash

# PDFの1ページ目をサムネイル画像に変換するスクリプト
# macOSのsipsコマンドを使用

SLIDES_DIR="slides"
THUMBNAILS_DIR="public/thumbnails"

# サムネイル用ディレクトリが存在しない場合は作成
mkdir -p "$THUMBNAILS_DIR"

# 引数チェック
if [ $# -eq 0 ]; then
    echo "PDFサムネイル生成を開始します..."
    echo "すべてのPDFファイルを処理します"
    
    # slides ディレクトリ内のすべてのPDFファイルを処理
    for pdf_file in "$SLIDES_DIR"/*.pdf; do
        # ファイルが存在するかチェック
        if [ ! -f "$pdf_file" ]; then
            echo "PDFファイルが見つかりません: $pdf_file"
            continue
        fi
        
        # ファイル名（拡張子なし）を取得
        filename=$(basename "$pdf_file" .pdf)
        
        # 出力画像パス
        output_image="$THUMBNAILS_DIR/${filename}.png"
        
        echo "処理中: $pdf_file -> $output_image"
        
        # sipsコマンドでPDFの1ページ目をPNGに変換
        # --resampleWidth 800: 幅を800pxにリサイズ（適切なサイズ）
        # --setProperty dpiWidth 288 --setProperty dpiHeight 288: 超高DPI設定（文字の鮮明さ向上）
        # --setProperty format png: PNG形式で出力
        sips -s format png --resampleWidth 800 --setProperty dpiWidth 288 --setProperty dpiHeight 288 "$pdf_file" --out "$output_image" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✓ 成功: $output_image"
        else
            echo "✗ 失敗: $pdf_file の変換に失敗しました"
        fi
    done
    
    echo "サムネイル生成完了！"
    echo "生成されたサムネイル:"
    ls -la "$THUMBNAILS_DIR"
else
    # 引数で指定されたPDFファイルのみ処理
    pdf_file="$1"
    
    # ファイルが存在するかチェック
    if [ ! -f "$pdf_file" ]; then
        echo "PDFファイルが見つかりません: $pdf_file"
        exit 1
    fi
    
    echo "PDFサムネイル生成を開始します..."
    echo "処理対象: $pdf_file"
    
    # ファイル名（拡張子なし）を取得
    filename=$(basename "$pdf_file" .pdf)
    
    # 出力画像パス
    output_image="$THUMBNAILS_DIR/${filename}.png"
    
    echo "処理中: $pdf_file -> $output_image"
    
    # sipsコマンドでPDFの1ページ目をPNGに変換
    sips -s format png --resampleWidth 800 --setProperty dpiWidth 288 --setProperty dpiHeight 288 "$pdf_file" --out "$output_image" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✓ 成功: $output_image"
    else
        echo "✗ 失敗: $pdf_file の変換に失敗しました"
        exit 1
    fi
    
    echo "サムネイル生成完了！"
fi