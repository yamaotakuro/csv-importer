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