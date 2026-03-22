# Teoria — API 設計書

> 作成日: 2026-03-22  
> 方式: oRPC (over TanStack Query / Hono)

---

## 1. 基本方針

- すべての API は oRPC プロシージャとして `packages/api/src/routers/` 配下に定義する
- 認証が必要なプロシージャは `protectedProcedure` を使用する
- 公開プロシージャは `publicProcedure` を使用する
- バリデーションは [Zod](https://zod.dev/) を使用する
- エラーは oRPC 標準のエラーハンドリングに従う

---

## 2. ルーター構成

```
packages/api/src/routers/
├── index.ts          # appRouter のルート集約
├── courses.ts        # コース関連
├── lessons.ts        # レッスン関連
├── progress.ts       # 進捗関連
└── users.ts          # ユーザー関連
```

---

## 3. エンドポイント一覧

### 3.1 既存エンドポイント

| プロシージャ名 | 種別 | 概要 |
|--------------|------|------|
| `healthCheck` | public | サーバー疎通確認 |
| `privateData` | protected | 認証済みユーザーデータ取得（デモ用） |

---

### 3.2 courses ルーター

#### `courses.list` — コース一覧取得

- **種別**: public
- **入力**: なし（任意フィルタ: `level?: "beginner" | "intermediate" | "advanced"`）
- **出力**: `Course[]`

```ts
// 出力型イメージ
type Course = {
  id: number;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  icon: string;
  lessonCount: number;
  durationHours: number;
  order: number;
};
```

---

#### `courses.getById` — コース詳細取得

- **種別**: public
- **入力**: `{ courseId: number }`
- **出力**: `Course & { lessons: LessonSummary[] }`

```ts
type LessonSummary = {
  id: number;
  title: string;
  order: number;
  durationMinutes: number;
};
```

---

### 3.3 lessons ルーター

#### `lessons.getById` — レッスン詳細取得

- **種別**: public
- **入力**: `{ lessonId: number }`
- **出力**:

```ts
type Lesson = {
  id: number;
  courseId: number;
  title: string;
  content: string;   // Markdown テキスト
  order: number;
  durationMinutes: number;
  prevLessonId: number | null;
  nextLessonId: number | null;
};
```

---

#### `lessons.complete` — レッスン完了マーク

- **種別**: protected
- **入力**: `{ lessonId: number }`
- **出力**: `{ success: boolean; completedAt: Date }`
- **備考**: 既に完了済みの場合はそのまま成功を返す（冪等性あり）

---

### 3.4 progress ルーター

#### `progress.getMine` — ログインユーザーの進捗取得

- **種別**: protected
- **入力**: なし
- **出力**:

```ts
type UserProgress = {
  totalCompletedLessons: number;
  enrolledCourses: number;
  completedCourses: number;
  courseProgress: {
    courseId: number;
    courseTitle: string;
    completedLessons: number;
    totalLessons: number;
    percentComplete: number;
    enrolledAt: Date;
    completedAt: Date | null;
  }[];
};
```

---

#### `progress.getCompletedLessonIds` — 完了済みレッスン ID 一覧取得

- **種別**: protected
- **入力**: `{ courseId?: number }` (省略時は全コース)
- **出力**: `{ completedLessonIds: number[] }`

---

### 3.5 users ルーター

#### `users.getMe` — ログインユーザー情報取得

- **種別**: protected
- **入力**: なし
- **出力**:

```ts
type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
};
```

---

### 3.6 enrollments ルーター

#### `enrollments.enroll` — コース受講登録

- **種別**: protected
- **入力**: `{ courseId: number }`
- **出力**: `{ success: boolean; enrolledAt: Date }`
- **備考**: 既に受講済みの場合は `success: true` を返す（冪等性あり）

---

#### `enrollments.getMyEnrollments` — 受講中コース一覧取得

- **種別**: protected
- **入力**: なし
- **出力**: `Enrollment[]`

```ts
type Enrollment = {
  courseId: number;
  courseTitle: string;
  enrolledAt: Date;
  completedAt: Date | null;
};
```

---

## 4. エラーハンドリング

| ケース | エラーコード | HTTP ステータス |
|--------|------------|----------------|
| 未認証でprotected手続きを呼び出し | `UNAUTHORIZED` | 401 |
| 存在しないリソースへのアクセス | `NOT_FOUND` | 404 |
| バリデーションエラー | `BAD_REQUEST` | 400 |
| サーバー内部エラー | `INTERNAL_SERVER_ERROR` | 500 |

---

## 5. appRouter 集約イメージ

```ts
// packages/api/src/routers/index.ts
export const appRouter = {
  healthCheck: publicProcedure.handler(...),
  privateData: protectedProcedure.handler(...),
  courses: coursesRouter,
  lessons: lessonsRouter,
  progress: progressRouter,
  users: usersRouter,
  enrollments: enrollmentsRouter,
};
```

---

## 6. クライアント側利用例

```ts
// TanStack Query との統合
const courseList = useQuery(orpc.courses.list.queryOptions({ input: {} }));
const lessonDetail = useQuery(orpc.lessons.getById.queryOptions({ input: { lessonId: 1 } }));

// mutation
const completeMutation = useMutation(orpc.lessons.complete.mutationOptions());
completeMutation.mutate({ lessonId: 1 });
```
