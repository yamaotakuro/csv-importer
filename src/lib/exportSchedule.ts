import { ScheduleRow } from "@/types/schedule";

function getDateSuffix(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function rowsToContent(rows: ScheduleRow[], separator: string): string {
  const header = ["date", "time", "closed", "url"].join(separator);
  const body = rows.map((row) =>
    [row.date, row.time, row.closed ? "1" : "0", row.url].join(separator)
  );
  return [header, ...body].join("\n");
}

function download(content: string, filename: string, mimeType: string): void {
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCsv(rows: ScheduleRow[]): void {
  if (rows.length === 0) {
    alert("エクスポートするデータがありません。");
    return;
  }
  const content = rowsToContent(rows, ",");
  download(content, `schedule_${getDateSuffix()}.csv`, "text/csv");
}

export function exportTsv(rows: ScheduleRow[]): void {
  if (rows.length === 0) {
    alert("エクスポートするデータがありません。");
    return;
  }
  const content = rowsToContent(rows, "\t");
  download(content, `schedule_${getDateSuffix()}.tsv`, "text/tab-separated-values");
}
