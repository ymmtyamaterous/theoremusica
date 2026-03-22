import { env } from "@better-t-app/env/server";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const client = createClient({
  url: env.DATABASE_URL,
});

const db = drizzle({ client, schema });

const courses = [
  {
    title: "楽譜の読み方",
    description:
      "音符・休符・拍子記号・調号など、楽譜を読むための基礎知識をゼロから習得します。",
    level: "beginner" as const,
    icon: "🎼",
    lessonCount: 12,
    durationHours: 4,
    order: 1,
  },
  {
    title: "スケールと調性",
    description:
      "長音階・短音階・各種モードを理解し、調性感を身につけます。",
    level: "intermediate" as const,
    icon: "🎵",
    lessonCount: 18,
    durationHours: 7,
    order: 2,
  },
  {
    title: "和音と和声進行",
    description:
      "トライアド・セブンスコードから機能和声まで、実践的な和声進行を学びます。",
    level: "intermediate" as const,
    icon: "🎹",
    lessonCount: 22,
    durationHours: 9,
    order: 3,
  },
  {
    title: "対位法",
    description:
      "バッハの時代から続く対位法の原則を学び、多声音楽の作曲技法を習得します。",
    level: "advanced" as const,
    icon: "📜",
    lessonCount: 30,
    durationHours: 14,
    order: 4,
  },
  {
    title: "リズムと拍子",
    description:
      "様々な拍子・リズムパターンを学び、音楽の時間的構造を深く理解します。",
    level: "beginner" as const,
    icon: "🥁",
    lessonCount: 10,
    durationHours: 3,
    order: 5,
  },
  {
    title: "ジャズ和声",
    description:
      "テンションコード・代理和音・モーダルインターチェンジなど、ジャズ特有の和声技法を学びます。",
    level: "advanced" as const,
    icon: "🎷",
    lessonCount: 28,
    durationHours: 12,
    order: 6,
  },
];

const lessonTemplates: Record<
  string,
  Array<{ title: string; durationMinutes: number }>
> = {
  "楽譜の読み方": [
    { title: "音部記号とは何か", durationMinutes: 15 },
    { title: "ト音記号の音符を読む", durationMinutes: 20 },
    { title: "ヘ音記号の音符を読む", durationMinutes: 20 },
    { title: "音符の種類と長さ", durationMinutes: 15 },
    { title: "休符の種類と長さ", durationMinutes: 15 },
    { title: "拍子記号の読み方", durationMinutes: 20 },
    { title: "4分の4拍子を理解する", durationMinutes: 20 },
    { title: "4分の3拍子と4分の2拍子", durationMinutes: 20 },
    { title: "付点音符とタイ", durationMinutes: 20 },
    { title: "調号とシャープ・フラット", durationMinutes: 25 },
    { title: "強弱記号と発想記号", durationMinutes: 15 },
    { title: "楽譜読み総合演習", durationMinutes: 30 },
  ],
  "スケールと調性": [
    { title: "全音と半音を理解する", durationMinutes: 15 },
    { title: "長音階（メジャースケール）", durationMinutes: 20 },
    { title: "自然短音階（ナチュラルマイナー）", durationMinutes: 20 },
    { title: "和声短音階（ハーモニックマイナー）", durationMinutes: 25 },
    { title: "旋律短音階（メロディックマイナー）", durationMinutes: 25 },
    { title: "五度圏と調号の関係", durationMinutes: 25 },
    { title: "平行長短調", durationMinutes: 20 },
    { title: "同主長短調", durationMinutes: 20 },
    { title: "ドリアンモード", durationMinutes: 20 },
    { title: "フリジアンモード", durationMinutes: 20 },
    { title: "リディアンモード", durationMinutes: 20 },
    { title: "ミクソリディアンモード", durationMinutes: 20 },
    { title: "ロクリアンモード", durationMinutes: 20 },
    { title: "ペンタトニックスケール", durationMinutes: 25 },
    { title: "ブルーススケール", durationMinutes: 25 },
    { title: "全音音階（ホールトーン）", durationMinutes: 20 },
    { title: "減音階（ディミニッシュ）", durationMinutes: 20 },
    { title: "スケールと調性の総合演習", durationMinutes: 30 },
  ],
  "和音と和声進行": [
    { title: "音程（インターバル）の基礎", durationMinutes: 20 },
    { title: "三和音（トライアド）の構造", durationMinutes: 20 },
    { title: "長三和音と短三和音", durationMinutes: 20 },
    { title: "減三和音と増三和音", durationMinutes: 20 },
    { title: "和音の転回形", durationMinutes: 25 },
    { title: "七の和音（セブンスコード）", durationMinutes: 25 },
    { title: "属七の和音（V7）", durationMinutes: 25 },
    { title: "調における和音の機能", durationMinutes: 25 },
    { title: "T・D・S 機能", durationMinutes: 20 },
    { title: "カデンツ（終止形）", durationMinutes: 25 },
    { title: "I-IV-V-I 進行", durationMinutes: 20 },
    { title: "II-V-I 進行", durationMinutes: 25 },
    { title: "借用和音（準固有和音）", durationMinutes: 25 },
    { title: "転調の基礎", durationMinutes: 30 },
    { title: "半音階的転調", durationMinutes: 25 },
    { title: "ナポリの六度", durationMinutes: 25 },
    { title: "増六の和音", durationMinutes: 25 },
    { title: "ペダルポイント", durationMinutes: 20 },
    { title: "和声分析の実践（バッハ）", durationMinutes: 30 },
    { title: "和声分析の実践（ベートーヴェン）", durationMinutes: 30 },
    { title: "ポップス・ロックの和声進行", durationMinutes: 25 },
    { title: "和声進行総合演習", durationMinutes: 30 },
  ],
  対位法: [
    { title: "対位法とは何か", durationMinutes: 15 },
    { title: "1種対位法（音対音）", durationMinutes: 25 },
    { title: "協和音程と不協和音程", durationMinutes: 20 },
    { title: "禁則：平行5度・8度", durationMinutes: 25 },
    { title: "声部の動き（同方向・反行・斜行）", durationMinutes: 20 },
    { title: "2種対位法（2音対1音）", durationMinutes: 25 },
    { title: "経過音と刺繍音", durationMinutes: 25 },
    { title: "3種対位法（4音対1音）", durationMinutes: 25 },
    { title: "4種対位法（シンコペーション）", durationMinutes: 25 },
    { title: "懸留音と解決", durationMinutes: 25 },
    { title: "5種対位法（自由対位）", durationMinutes: 30 },
    { title: "2声のインベンション分析", durationMinutes: 30 },
    { title: "3声対位法の基礎", durationMinutes: 30 },
    { title: "カノンの作り方", durationMinutes: 25 },
    { title: "フーガの構造", durationMinutes: 30 },
    { title: "主題とその応答", durationMinutes: 25 },
    { title: "カウンターサブジェクト", durationMinutes: 25 },
    { title: "エピソードとストレッタ", durationMinutes: 30 },
    { title: "バッハのフーガ分析 BWV 846", durationMinutes: 35 },
    { title: "バッハのフーガ分析 BWV 847", durationMinutes: 35 },
    { title: "現代的対位法への応用", durationMinutes: 25 },
    { title: "対位法総合演習 I", durationMinutes: 35 },
    { title: "対位法総合演習 II", durationMinutes: 35 },
    { title: "対位法総合演習 III", durationMinutes: 35 },
    { title: "対位法総合演習 IV", durationMinutes: 35 },
    { title: "対位法総合演習 V", durationMinutes: 35 },
    { title: "対位法総合演習 VI", durationMinutes: 35 },
    { title: "対位法総合演習 VII", durationMinutes: 35 },
    { title: "対位法総合演習 VIII", durationMinutes: 35 },
    { title: "対位法最終演習", durationMinutes: 40 },
  ],
  "リズムと拍子": [
    { title: "拍とリズムの基礎", durationMinutes: 15 },
    { title: "単純拍子（2拍子・3拍子・4拍子）", durationMinutes: 20 },
    { title: "複合拍子（6拍子・9拍子・12拍子）", durationMinutes: 20 },
    { title: "混合拍子（5拍子・7拍子）", durationMinutes: 20 },
    { title: "シンコペーションとオフビート", durationMinutes: 25 },
    { title: "三連符と連符", durationMinutes: 20 },
    { title: "ポリリズムとポリメトリー", durationMinutes: 25 },
    { title: "世界の音楽のリズム", durationMinutes: 20 },
    { title: "グルーヴとスウィング", durationMinutes: 25 },
    { title: "リズム総合演習", durationMinutes: 30 },
  ],
  ジャズ和声: [
    { title: "ジャズ和声の歴史と概要", durationMinutes: 15 },
    { title: "テンションコードの基礎（9th, 11th, 13th）", durationMinutes: 25 },
    { title: "II-V-I（長調）", durationMinutes: 25 },
    { title: "II-V-I（短調）", durationMinutes: 25 },
    { title: "ターンバック進行", durationMinutes: 20 },
    { title: "コードサブスティテューション", durationMinutes: 30 },
    { title: "トライトーンサブスティテューション", durationMinutes: 30 },
    { title: "モーダルインターチェンジ", durationMinutes: 30 },
    { title: "リハーモナイゼーション入門", durationMinutes: 30 },
    { title: "ブルース進行", durationMinutes: 25 },
    { title: "リズムチェンジ", durationMinutes: 25 },
    { title: "コードスケール理論", durationMinutes: 30 },
    { title: "アウトサイドプレイの基礎", durationMinutes: 25 },
    { title: "ペダルポイントとオスティナート", durationMinutes: 20 },
    { title: "サイドスリッピング", durationMinutes: 25 },
    { title: "カミングフロムアウト", durationMinutes: 25 },
    { title: "スタンダード曲の和声分析 I（Autumn Leaves）", durationMinutes: 35 },
    { title: "スタンダード曲の和声分析 II（All The Things You Are）", durationMinutes: 35 },
    { title: "スタンダード曲の和声分析 III（Giant Steps）", durationMinutes: 40 },
    { title: "コルトレーンチェンジ", durationMinutes: 35 },
    { title: "モードジャズの基礎（So What）", durationMinutes: 30 },
    { title: "フリージャズの和声概念", durationMinutes: 25 },
    { title: "コンテンポラリージャズ和声", durationMinutes: 30 },
    { title: "ボイシング技法 I（クローズドボイシング）", durationMinutes: 25 },
    { title: "ボイシング技法 II（オープンボイシング）", durationMinutes: 25 },
    { title: "ガイドトーンと声部進行", durationMinutes: 25 },
    { title: "ジャズ和声総合演習 I", durationMinutes: 35 },
    { title: "ジャズ和声総合演習 II", durationMinutes: 35 },
  ],
};

const lessonContentTemplate = (title: string, courseTitle: string) => `# ${title}

## このレッスンについて

このレッスンでは **${title}** について学習します。「${courseTitle}」コースの重要なトピックの一つです。

## 学習目標

このレッスンを完了すると、以下のことができるようになります:

- ${title}の基本概念を説明できる
- 実際の楽譜や音楽でこの概念を識別できる
- 演習問題を通じて理解を深める

## 解説

音楽理論は、音楽を体系的に理解するための学問です。${title}は音楽を深く理解するうえで欠かせない要素です。

### 基本概念

まず基本的な定義から始めましょう。この概念は古くから音楽家たちが実践の中で発見し、体系化してきたものです。

### 具体例

以下の例を通じて理解を深めましょう。実際の楽曲を参照しながら学ぶことで、より直感的に理解できます。

### 練習方法

1. まず概念をしっかりと理解する
2. 簡単な例から練習を始める
3. 徐々に複雑な例に挑戦する
4. 実際の楽曲で確認する

## まとめ

${title}は音楽理論の中でも特に重要なトピックです。このレッスンで学んだことを実際の音楽演奏や作曲に活用してください。

次のレッスンでは、さらに発展的な内容を学習します。
`;

async function seed() {
  console.log("🌱 シードデータの投入を開始します...");

  // 既存データを削除
  await db.delete(schema.lessonProgress);
  await db.delete(schema.enrollment);
  await db.delete(schema.lesson);
  await db.delete(schema.course);

  console.log("🗑️  既存データを削除しました");

  // コースを挿入
  for (const courseData of courses) {
    const [insertedCourse] = await db
      .insert(schema.course)
      .values(courseData)
      .returning();

    if (!insertedCourse) {
      throw new Error(`コースの挿入に失敗しました: ${courseData.title}`);
    }

    console.log(`📚 コースを作成: ${insertedCourse.title}`);

    const lessonList = lessonTemplates[insertedCourse.title] ?? [];
    for (let i = 0; i < lessonList.length; i++) {
      const lessonData = lessonList[i];
      if (!lessonData) continue;
      await db.insert(schema.lesson).values({
        courseId: insertedCourse.id,
        title: lessonData.title,
        content: lessonContentTemplate(lessonData.title, insertedCourse.title),
        order: i + 1,
        durationMinutes: lessonData.durationMinutes,
      });
    }

    console.log(`  ✅ ${lessonList.length} レッスンを作成しました`);
  }

  console.log("✨ シード完了!");
}

seed().catch((err) => {
  console.error("シードに失敗しました:", err);
  process.exit(1);
});
