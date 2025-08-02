---
title: "初めてのブログ記事"
description: "Astro + React + TypeScriptで作成した個人サイトの最初のブログ記事です。"
pubDate: 2025-08-02
tags: ["Dev"]
---

# 個人サイトを作成しました

このサイトは **Astro** と **React** を使用してTypeScriptで構築されています。

## 技術スタック

- **Astro**: 静的サイトジェネレーター
- **React**: UIコンポーネント
- **TypeScript**: 型安全性
- **Markdown**: ブログ記事の執筆

## Astroの特徴

Astroは以下の特徴があります：

1. **Islands Architecture**: 必要な部分だけをクライアントサイドで実行
2. **Multiple Frameworks**: React、Vue、Svelteなどを同時に使用可能
3. **Zero JavaScript by Default**: デフォルトでJavaScriptを送信しない

## コード例

TypeScriptでReactコンポーネントを書く例：

```typescript
interface Props {
  title: string;
  description: string;
}

const Component: React.FC<Props> = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};
```

## まとめ

これからこのブログで技術的な内容や日常について書いていく予定です。