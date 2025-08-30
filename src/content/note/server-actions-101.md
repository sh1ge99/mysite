---
title: "Server Actionsについて"
pubDate: 2025-08-29
tags: ["Dev"]
---

Next.js を勉強していると Server Actions に遭遇した。
クライアント側でサーバー側の関数を直接実行できるみたい。
従来の手法とどんな違いがあるのか比較しながら理解を深めていく。

## Server Actions が出る前までの手法

前提として、ウェブアプリケーションでは、ブラウザ（クライアント）とサーバーは完全に分離されている。

```javascript
// 従来の方法：クライアントサイドでfetchを使う

// 1. サーバー側：API エンドポイントを作る
// pages/api/todos.js (または app/api/todos/route.js)
export async function POST(request: Request) {
  const { title } = await request.json();

  // データベースに保存
  await db.todo.create({ data: { title } });

  return Response.json({ success: true });
}

// 2. クライアント側：fetchでAPIを呼び出す
// pages/create-todo.js
import { useState } from "react";

export default function CreateTodo() {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ここでfetchを使ってサーバーのAPIを呼び出す
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        console.log("TODOが作成されました");
        setTitle("");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="TODOを入力"
      />
      <button type="submit">TODOを作成</button>
    </form>
  );
}
```

## なぜ fetch が必要だったのか？

### 1. ブラウザとサーバーは別世界

- ブラウザ（JavaScript）では直接サーバーの関数を呼び出せない
- 通信するには HTTP リクエスト(GET,POST 等)を送る必要がある
- `fetch()`はその HTTP リクエストを送るための JavaScript 関数

### 2.具体的な流れ

ユーザーがボタンクリック
↓
JavaScript の fetch() が実行される
↓
HTTP リクエストがサーバーに送信される (/api/todos)
↓
サーバーがリクエストを受信・処理
↓
サーバーが HTTP レスポンスを返す
↓
ブラウザがレスポンスを受信
↓
JavaScript が結果を処理

### 3.面倒だった点

- API エンドポイント(`/api/todos`)を作る必要がある
- エラーハンドリングを書く必要がある
- JSON の変換処理を書く必要がある　などなど

## でも Server Actions も通信はしている

従来の手法では HTTP 通信をするために fetch 関数を使用していると前述したが、Server Actions も内部的に HTTP 通信をしています。ただし、Next.js が自動で処理をしてくれている。

```typescript
// Server Actions：まるで魔法のような書き方

// 1. サーバー関数を直接定義
// app/actions.ts
"use server";

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;

  // 直接データベース操作ができる！
  await db.todo.create({ data: { title } });

  console.log("TODOが作成されました:", title);
}

// 2. クライアント側：まるでローカル関数のように呼び出し
// app/page.tsx
("use client");

import { createTodo } from "./actions";

export default function CreateTodo() {
  return (
    <form action={createTodo}>
      <input name="title" placeholder="TODOを入力" />
      <button type="submit">TODOを作成</button>
    </form>
  );
}

// 従来なら必要だった複雑な処理が一切不要！
// ❌ fetchを書く必要なし
// ❌ APIエンドポイントを作る必要なし
// ❌ JSONの変換処理なし
// ❌ 複雑なエラーハンドリングなし
```
