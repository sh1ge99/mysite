---
title: "Astroを使ったサイト構築のガイド"
description: "Astroの基本的な使い方とReactとの組み合わせについて解説します。"
pubDate: 2025-08-01
tags: ["Dev"]
---

# Astroを使ったサイト構築

Astroは現代的な静的サイトジェネレーターで、パフォーマンスとDXの両立を実現しています。

## プロジェクトの作成

```bash
npm create astro@latest my-site
cd my-site
npm run dev
```

## ファイル構造

```
src/
├── pages/          # ページファイル（ルーティング）
├── components/     # 再利用可能なコンポーネント
├── layouts/        # レイアウトコンポーネント
└── content/        # Markdownコンテンツ
```

## Reactの統合

Astroに Reactを追加する方法：

```bash
npx astro add react
```

### Hydration Directives

Reactコンポーネントをクライアントサイドで動作させるために、ディレクティブを使用します：

- `client:load` - ページロード時に即座にhydrate
- `client:idle` - ブラウザがアイドル状態になったらhydrate
- `client:visible` - 要素が見えるようになったらhydrate

```astro
---
import MyReactComponent from '../components/MyReactComponent';
---

<MyReactComponent client:load />
```

## Content Collections

ブログなどのコンテンツ管理には Content Collections を使用：

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

## まとめ

Astroは学習コストが低く、既存のスキルを活かしながら高性能なサイトを構築できる優れたツールです。