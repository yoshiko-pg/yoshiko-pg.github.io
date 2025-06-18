#!/bin/bash

echo "不要なTalks関連ファイルを削除します..."

# Talks.tsxを削除
if [ -f "src/pages/Talks.tsx" ]; then
    rm "src/pages/Talks.tsx"
    echo "✓ src/pages/Talks.tsx を削除しました"
else
    echo "- src/pages/Talks.tsx は既に存在しません"
fi

# Talks.module.cssを削除
if [ -f "src/pages/Talks.module.css" ]; then
    rm "src/pages/Talks.module.css"
    echo "✓ src/pages/Talks.module.css を削除しました"
else
    echo "- src/pages/Talks.module.css は既に存在しません"
fi

echo ""
echo "削除完了！現在のpagesディレクトリ:"
ls -la src/pages/