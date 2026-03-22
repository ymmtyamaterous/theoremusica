# Teoria — データベース設計書

> 作成日: 2026-03-22  
> DBMS: SQLite (Drizzle ORM)

---

## 1. 設計方針

- ORM は Drizzle を使用し、スキーマは `packages/db/src/schema/` 配下に TypeScript で定義する
- テーブルは snake_case で命名する
- 主キーは `text` 型（認証系）または `integer` 型の自動インクリメント（コンテンツ系）を使用する
- タイムスタンプは `integer` (UNIX ミリ秒) で統一する（既存の auth テーブルに合わせる）
- `createdAt` / `updatedAt` はすべてのテーブルに付与する

---

## 2. テーブル一覧

| テーブル名 | 概要 | 種別 |
|------------|------|------|
| `user` | ユーザー | 既存 (better-auth) |
| `session` | セッション | 既存 (better-auth) |
| `account` | OAuth アカウント | 既存 (better-auth) |
| `verification` | メール検証トークン | 既存 (better-auth) |
| `course` | コース | 新規 |
| `lesson` | レッスン | 新規 |
| `enrollment` | 受講登録 | 新規 |
| `lesson_progress` | レッスン完了記録 | 新規 |

---

## 3. 既存テーブル (better-auth 管理)

> スキーマ定義は `packages/db/src/schema/auth.ts` を参照。  
> Teoria 側では直接変更しない。

---

## 4. 新規テーブル定義

### 4.1 `course` — コーステーブル

```ts
// packages/db/src/schema/courses.ts

export const course = sqliteTable("course", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level", {
    enum: ["beginner", "intermediate", "advanced"],
  }).notNull(),
  icon: text("icon").notNull(),                  // 絵文字または画像パス
  lessonCount: integer("lesson_count").notNull().default(0),
  durationHours: integer("duration_hours").notNull().default(0),
  order: integer("order").notNull().default(0),  // 表示順
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});
```

| カラム | 型 | 制約 | 説明 |
|--------|----|------|------|
| `id` | INTEGER | PK, AUTO INCREMENT | コース ID |
| `title` | TEXT | NOT NULL | コースタイトル |
| `description` | TEXT | NOT NULL | コース概要 |
| `level` | TEXT | NOT NULL, ENUM | 難易度 (`beginner` / `intermediate` / `advanced`) |
| `icon` | TEXT | NOT NULL | アイコン絵文字または画像パス |
| `lesson_count` | INTEGER | NOT NULL, DEFAULT 0 | レッスン総数（キャッシュ） |
| `duration_hours` | INTEGER | NOT NULL, DEFAULT 0 | 推定時間（時間単位） |
| `order` | INTEGER | NOT NULL, DEFAULT 0 | 表示順序 |
| `created_at` | INTEGER | NOT NULL | 作成日時 (ms) |
| `updated_at` | INTEGER | NOT NULL | 更新日時 (ms) |

---

### 4.2 `lesson` — レッスンテーブル

```ts
// packages/db/src/schema/lessons.ts

export const lesson = sqliteTable(
  "lesson",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    courseId: integer("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull(),           // Markdown
    order: integer("order").notNull().default(0), // コース内順序
    durationMinutes: integer("duration_minutes").notNull().default(15),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("lesson_courseId_order_idx").on(table.courseId, table.order),
  ],
);
```

| カラム | 型 | 制約 | 説明 |
|--------|----|------|------|
| `id` | INTEGER | PK, AUTO INCREMENT | レッスン ID |
| `course_id` | INTEGER | NOT NULL, FK → course.id | 所属コース |
| `title` | TEXT | NOT NULL | レッスンタイトル |
| `content` | TEXT | NOT NULL | 本文 (Markdown) |
| `order` | INTEGER | NOT NULL, DEFAULT 0 | コース内の順序 |
| `duration_minutes` | INTEGER | NOT NULL, DEFAULT 15 | 推定所要時間（分） |
| `created_at` | INTEGER | NOT NULL | 作成日時 (ms) |
| `updated_at` | INTEGER | NOT NULL | 更新日時 (ms) |

**インデックス**:
- `lesson_courseId_order_idx` — `(course_id, order)` : コース内レッスン一覧取得の高速化

---

### 4.3 `enrollment` — 受講登録テーブル

```ts
// packages/db/src/schema/enrollments.ts

export const enrollment = sqliteTable(
  "enrollment",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    enrolledAt: integer("enrolled_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    completedAt: integer("completed_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("enrollment_userId_idx").on(table.userId),
    index("enrollment_userId_courseId_idx").on(table.userId, table.courseId),
  ],
);
```

| カラム | 型 | 制約 | 説明 |
|--------|----|------|------|
| `id` | INTEGER | PK, AUTO INCREMENT | 受講登録 ID |
| `user_id` | TEXT | NOT NULL, FK → user.id | ユーザー |
| `course_id` | INTEGER | NOT NULL, FK → course.id | コース |
| `enrolled_at` | INTEGER | NOT NULL | 受講登録日時 (ms) |
| `completed_at` | INTEGER | NULLABLE | コース完了日時 (ms) |
| `created_at` | INTEGER | NOT NULL | 作成日時 (ms) |
| `updated_at` | INTEGER | NOT NULL | 更新日時 (ms) |

**インデックス**:
- `enrollment_userId_idx` — `(user_id)` : ユーザーの受講一覧取得
- `enrollment_userId_courseId_idx` — `(user_id, course_id)` : 受講済み確認

---

### 4.4 `lesson_progress` — レッスン完了記録テーブル

```ts
// packages/db/src/schema/lessonProgress.ts

export const lessonProgress = sqliteTable(
  "lesson_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: integer("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    completedAt: integer("completed_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("lesson_progress_userId_idx").on(table.userId),
    index("lesson_progress_userId_lessonId_idx").on(table.userId, table.lessonId),
  ],
);
```

| カラム | 型 | 制約 | 説明 |
|--------|----|------|------|
| `id` | INTEGER | PK, AUTO INCREMENT | 進捗 ID |
| `user_id` | TEXT | NOT NULL, FK → user.id | ユーザー |
| `lesson_id` | INTEGER | NOT NULL, FK → lesson.id | 完了したレッスン |
| `completed_at` | INTEGER | NOT NULL | 完了日時 (ms) |
| `created_at` | INTEGER | NOT NULL | 作成日時 (ms) |

**インデックス**:
- `lesson_progress_userId_idx` — `(user_id)` : ユーザーの完了一覧取得
- `lesson_progress_userId_lessonId_idx` — `(user_id, lesson_id)` : 完了済み確認（冪等制御）

---

## 5. ER 図（概略）

```
user (better-auth)
 ├─< enrollment >─── course
 │                      └─< lesson
 └─< lesson_progress >── lesson
```

---

## 6. スキーマファイル構成

```
packages/db/src/schema/
├── auth.ts           # 既存 (better-auth)
├── index.ts          # 全スキーマの再エクスポート
├── courses.ts        # course テーブル + リレーション  【新規】
├── lessons.ts        # lesson テーブル + リレーション  【新規】
├── enrollments.ts    # enrollment テーブル + リレーション 【新規】
└── lessonProgress.ts # lesson_progress テーブル + リレーション 【新規】
```

---

## 7. シードデータ

初期コースデータは DB マイグレーション後にシードスクリプトで投入する。

```
packages/db/src/seed.ts  【新規】
```

シード内容:
- 6コース（概要仕様書 §6 参照）
- 各コースのレッスン（タイトルのみでも可、本文は後から追加）
