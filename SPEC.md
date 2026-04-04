# 日程入力ツール 仕様書（Next.js + Vercel）

## 概要

ACF Pro の「日程ループ」フィールドに対応したデータをカレンダーUIで作成し、CSV / TSV 形式でエクスポートするWebアプリ。Next.js で実装し Vercel にデプロイする。エクスポートしたファイルは WP All Import でインポートして使用する。

---

## 技術スタック

| 項目                 | 採用技術                                         |
| -------------------- | ------------------------------------------------ |
| フレームワーク       | Next.js 15（App Router）                         |
| 言語                 | TypeScript                                       |
| スタイリング         | Tailwind CSS v4                                  |
| 状態管理             | React useState（サーバー不要のためローカルのみ） |
| デプロイ             | Vercel                                           |
| パッケージマネージャ | pnpm                                             |

---

## ディレクトリ構成

```
schedule-tool/
├── CLAUDE.md                        # Claude Code 用の指示ファイル
├── SPEC.md                          # 本仕様書
├── .claude/
│   └── settings.json                # Claude Code 権限設定
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── .gitignore
├── .env.local                       # 環境変数（必要な場合）
├── public/
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── layout.tsx               # ルートレイアウト
    │   ├── page.tsx                 # メインページ（/ ルート）
    │   └── globals.css
    ├── components/
    │   ├── Calendar.tsx             # カレンダーUI
    │   ├── ScheduleList.tsx         # 日程リストテーブル
    │   ├── ScheduleRow.tsx          # 日程リストの1行
    │   └── ExportButtons.tsx        # CSV / TSV エクスポートボタン群
    ├── hooks/
    │   └── useSchedule.ts           # 日程データの状態管理カスタムフック
    ├── lib/
    │   └── exportSchedule.ts        # CSV / TSV 生成ロジック
    └── types/
        └── schedule.ts              # 型定義
```

---

## 型定義（src/types/schedule.ts）

```ts
export type ScheduleRow = {
  id: string; // crypto.randomUUID() で生成
  date: string; // "YYYY-MM-DD"
  time: string; // 例: "11:00~"
  closed: boolean; // 受付終了フラグ
  url: string; // 任意URL
};
```

---

## コンポーネント仕様

### page.tsx

- `useSchedule` フックから状態・操作関数を受け取り、各コンポーネントに props として渡す
- レイアウト: 左カラム（カレンダー） + 右カラム（日程リスト） + 下部（エクスポートエリア）
- `"use client"` ディレクティブを付与（状態を持つため）

```
┌──────────────────────────────────────────────────────┐
│  ヘッダー（タイトル）                                  │
├──────────────────────────┬───────────────────────────┤
│  <Calendar />            │  <ScheduleList />         │
│                          │                           │
│  月ナビ ◀ YYYY/MM ▶      │  No | 日付 | 時間 |       │
│                          │  受付終了 | URL | 削除    │
│  カレンダーグリッド       │                           │
│  （選択済み日付ハイライト）│  [行を追加]               │
└──────────────────────────┴───────────────────────────┘
│  <ExportButtons />                                    │
│  [CSVエクスポート] [TSVエクスポート] [クリア]          │
└──────────────────────────────────────────────────────┘
```

### Calendar.tsx

| Props         | 型                     | 説明                               |
| ------------- | ---------------------- | ---------------------------------- |
| selectedDates | string[]               | 選択済み日付リスト（"YYYY-MM-DD"） |
| onSelectDate  | (date: string) => void | 日付クリック時のコールバック       |

- 表示: 1ヶ月分のグリッド（日曜始まり）
- 月ナビ: ◀ / ▶ ボタンで useState で管理する currentMonth を変更
- 選択済み日付は背景色を変えてハイライト
- 同じ日付を再クリックしても重複追加しない（リストに既存の場合は何もしない）

### ScheduleList.tsx

| Props    | 型                                                                       | 説明           |
| -------- | ------------------------------------------------------------------------ | -------------- |
| rows     | ScheduleRow[]                                                            | 日程データ配列 |
| onUpdate | (id: string, field: keyof ScheduleRow, value: string \| boolean) => void | 行データ更新   |
| onDelete | (id: string) => void                                                     | 行削除         |
| onAdd    | () => void                                                               | 空行追加       |

### ScheduleRow.tsx

- 1行分の入力UI（日付・時間・受付終了・URL・削除ボタン）
- 各フィールドは `<input>` で直接編集可能
- 受付終了は `<input type="checkbox">` で表示

### ExportButtons.tsx

| Props   | 型            | 説明                   |
| ------- | ------------- | ---------------------- |
| rows    | ScheduleRow[] | エクスポート対象データ |
| onClear | () => void    | 全クリア               |

---

## カスタムフック（src/hooks/useSchedule.ts）

```ts
// 返却する状態と操作
type UseScheduleReturn = {
  rows: ScheduleRow[];
  addRow: (date?: string) => void; // カレンダー選択 or 手動追加
  updateRow: (id: string, field: keyof ScheduleRow, value: string | boolean) => void;
  deleteRow: (id: string) => void;
  clearAll: () => void;
  selectedDates: string[]; // Calendar のハイライト用
};
```

- 状態は `useState<ScheduleRow[]>` で管理
- `addRow(date)` : 既に同じ日付が存在する場合は追加しない
- `selectedDates` : rows から date のみを抽出した派生値（useMemo）

---

## エクスポートロジック（src/lib/exportSchedule.ts）

### 出力カラム順

```
date,time,closed,url
```

### 値の変換

| フィールド | 変換ルール                       |
| ---------- | -------------------------------- |
| closed     | `true` → `"1"` / `false` → `"0"` |
| url        | 空の場合は空文字のまま           |

### ファイル生成

```ts
// BOM付きUTF-8でダウンロード
const BOM = "\uFEFF";
const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8;" });
const url = URL.createObjectURL(blob);
// <a> タグを動的生成してクリック → revokeObjectURL
```

### ファイル名

| 形式 | ファイル名              |
| ---- | ----------------------- |
| CSV  | `schedule_YYYYMMDD.csv` |
| TSV  | `schedule_YYYYMMDD.tsv` |

---

## WP All Import 連携仕様

### 必要プラグイン

- WP All Import Pro
- WP All Import – ACF Add-On

### ACF フィールド構造（想定）

```
投稿タイプ
└── 日程ループ（Repeater フィールド）
    ├── 日付（date または text）
    ├── 時間（text）
    ├── 受付終了（true_false）
    └── URL（url または text）
```

### CSV → ACF マッピング（WP All Import 側で設定）

| CSVカラム | ACF フィールドキー例 | 備考                |
| --------- | -------------------- | ------------------- |
| `date`    | `schedule_0_date`    | Repeater 構文に従う |
| `time`    | `schedule_0_time`    |                     |
| `closed`  | `schedule_0_closed`  | `1` / `0`           |
| `url`     | `schedule_0_url`     |                     |

> ※ 実際のフィールドキーは ACF の設定画面で確認すること

---

## バリデーション

| 項目           | ルール                                                      |
| -------------- | ----------------------------------------------------------- |
| 日付           | `YYYY-MM-DD` 形式（カレンダーから自動入力のため基本正常値） |
| 時間           | バリデーションなし（自由テキスト）                          |
| URL            | バリデーションなし（自由テキスト）                          |
| エクスポート時 | rows が 0件の場合は `alert()` を表示して中断                |

---

## Vercel デプロイ設定

### next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 静的エクスポート（サーバー不要のため）
};

export default nextConfig;
```

> サーバーサイド処理が不要なため Static Export を使用。Vercel 上でも問題なく動作する。

### デプロイ手順

1. GitHub リポジトリを作成してプッシュ
2. Vercel ダッシュボードで「Add New Project」→ リポジトリを選択
3. Framework Preset: `Next.js`（自動検出）
4. Build Command: `pnpm build`
5. Output Directory: `out`（Static Export のため）
6. Deploy

### .gitignore（最低限）

```
node_modules/
.next/
out/
.env.local
```

---

## CLAUDE.md の内容

```markdown
# Schedule Tool

## 概要

ACF Pro の日程ループフィールド向けデータ入力ツール。
詳細は SPEC.md を参照すること。

## 実装ルール

- SPEC.md を必ず読んでから実装を開始すること
- Next.js 15 App Router + TypeScript + Tailwind CSS v4 で実装すること
- パッケージマネージャは pnpm を使用すること
- サーバーサイド処理は不要。全て Client Component で実装すること
- `next.config.ts` に `output: 'export'` を設定すること（Vercel Static Export）
- コンポーネントは src/components/ に分割すること（SPEC.md のディレクトリ構成に従う）
- 状態管理は useSchedule カスタムフックに集約すること

## 開発フロー

1. SPEC.md を読む
2. `pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"` でプロジェクトを初期化
3. 型定義（types/schedule.ts）を実装
4. カスタムフック（hooks/useSchedule.ts）を実装
5. エクスポートロジック（lib/exportSchedule.ts）を実装
6. 各コンポーネントを実装
7. page.tsx で組み合わせる
8. `pnpm dev` で動作確認
9. `pnpm build` でビルドエラーがないことを確認
```

---

## .claude/settings.json の内容

```json
{
  "permissions": {
    "allow": ["Bash(pnpm install)", "Bash(pnpm dev)", "Bash(pnpm build)", "Bash(pnpm lint)", "Write(src/**)", "Write(public/**)", "Write(next.config.ts)", "Write(tailwind.config.ts)", "Write(tsconfig.json)", "Write(package.json)", "Write(.gitignore)"]
  }
}
```

---

## 優先実装順

1. 型定義（ScheduleRow）
2. カスタムフック（useSchedule）
3. エクスポートロジック（exportSchedule）
4. Calendar コンポーネント
5. ScheduleRow コンポーネント
6. ScheduleList コンポーネント
7. ExportButtons コンポーネント
8. page.tsx での組み合わせ
9. スタイリング調整
10. ビルド確認 → Vercel デプロイ
