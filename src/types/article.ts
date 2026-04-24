import { ScheduleRow } from "./schedule";

export type Article = {
  id: string;          // 内部管理用 UUID
  tsvId: string;       // TSV エクスポート用 ID（イベントID 列）
  csvId: string;       // CSV エクスポート用 ID（ID 列）
  eventType: string;   // イベント種別（TSV 第1列・CSV display 列）
  title: string;       // イベントタイトル（TSV 第3列）
  rows: ScheduleRow[];
};
