import Encoding from "encoding-japanese";
import { Article } from "@/types/article";
import { ScheduleRow } from "@/types/schedule";

function getDateSuffix(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}


function downloadShiftJis(content: string, filename: string): void {
  const sjisArray = Encoding.convert(Encoding.stringToCode(content), {
    to: "SJIS",
    from: "UNICODE",
  });
  const blob = new Blob([new Uint8Array(sjisArray)], { type: "text/plain;charset=shift_jis;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── CSV（WP用・28列形式・WordPress用IDを使用） ────

const WP_TSV_HEADER = [
  "イベント種別", "イベントID", "イベントタイトル", "キャッチコピー", "開催日時", "開催時間",
  "強調テキスト", "画像", "サムネイル画像", "ゲスト画像", "詳細",
  "ゲスト名", "ゲスト詳細", "フリーHTML", "カテゴリー", "公開維持フラグ",
  "公開日時(始)", "公開日時(終)", "申込締切日時", "フォームID", "都道府県",
  "地域", "開催場所", "地図", "補足", "並び順", "表示フラグ", "登録フラグ",
].join("\t");

function buildTimeCell(rows: ScheduleRow[]): string {
  return rows.map((row) => row.time).filter(Boolean).join(", ");
}

function articlesToWpTsv(articles: Article[]): string {
  const dataRows = articles
    .filter((a) => a.rows.length > 0)
    .map((a) =>
      [
        a.eventType,                          // 1  イベント種別
        `00000${a.csvId}`,                    // 2  イベントID（WordPress用ID）
        a.title,                              // 3  イベントタイトル
        "",                                   // 4  キャッチコピー
        buildEventDateTimeCell(a.rows, false),// 5  開催日時
        buildTimeCell(a.rows),                // 6  開催時間
        "",                                   // 7  強調テキスト
        "",                                   // 8  画像
        "",                                   // 9  サムネイル画像
        "",                                   // 10 ゲスト画像
        "",                                   // 11 詳細
        "",                                   // 12 ゲスト名
        "",                                   // 13 ゲスト詳細
        "",                                   // 14 フリーHTML
        "",                                   // 15 カテゴリー
        "",                                   // 16 公開維持フラグ
        "",                                   // 17 公開日時(始)
        "",                                   // 18 公開日時(終)
        "",                                   // 19 申込締切日時
        "",                                   // 20 フォームID
        "",                                   // 21 都道府県
        "",                                   // 22 地域
        "",                                   // 23 開催場所
        "",                                   // 24 地図
        a.csvId,                              // 25 補足（WordPress用ID）
        "100",                                // 26 並び順
        "1",                                  // 27 表示フラグ
        "UPD",                                // 28 登録フラグ
      ].join("\t")
    );
  return [WP_TSV_HEADER, ...dataRows].join("\n");
}

export function exportCsv(articles: Article[]): void {
  const hasData = articles.some((a) => a.rows.length > 0);
  if (!hasData) {
    alert("エクスポートするデータがありません。");
    return;
  }
  downloadShiftJis(articlesToWpTsv(articles), `schedule_wp_${getDateSuffix()}.txt`);
}

// ── TSV（全記事） ────────────────────────────────────────────

// 正しいインポートファイルに合わせた27列ヘッダー
const TSV_HEADER = [
  "イベント種別", "イベントID", "イベントタイトル", "キャッチコピー", "開催日時",
  "強調テキスト", "画像", "サムネイル画像", "ゲスト画像", "詳細",
  "ゲスト名", "ゲスト詳細", "フリーHTML", "カテゴリー", "公開維持フラグ",
  "公開日時(始)", "公開日時(終)", "申込締切日時", "フォームID", "都道府県",
  "地域", "開催場所", "地図", "補足", "並び順", "表示フラグ", "登録フラグ",
].join("\t");

const MENU_KEYS = ["menu1", "menu2", "menu3", "menu4", "menu5"] as const;

/**
 * 「開催日時」セル値を生成する。
 *
 * 体験メニューなし → YYYY/MM/DD, YYYY/MM/DD, ...（カンマ区切り・クォートなし）
 * 体験メニューあり → 複数行形式（クォート付き）:
 *   "YYYY/MM/DD|
 *   メニューテキスト
 *   ,
 *   YYYY/MM/DD|
 *   ..."
 */
function buildEventDateTimeCell(rows: ScheduleRow[], includeMenus = true): string {
  const hasAnyMenu = includeMenus && rows.some((row) =>
    MENU_KEYS.some((k) => (row[k] ?? "").trim() !== "")
  );

  if (!hasAnyMenu) {
    return rows.map((row) => row.date.replace(/-/g, "/")).join(", ");
  }

  const inner = rows
    .map((row) => {
      const date = row.date.replace(/-/g, "/");
      const menus = MENU_KEYS
        .map((k) => (row[k] ?? "").trim())
        .filter(Boolean)
        .join("\n");
      return menus ? `${date}|\n${menus}` : `${date}|`;
    })
    .join("\n,\n");
  return `"${inner}"`;
}

function articlesToEventTsv(articles: Article[]): string {
  const dataRows = articles
    .filter((a) => a.rows.length > 0)
    .map((a) =>
      [
        a.eventType,                     // 1  イベント種別
        `00000${a.tsvId}`,               // 2  イベントID
        a.title,                         // 3  イベントタイトル
        "",                              // 4  キャッチコピー
        buildEventDateTimeCell(a.rows),  // 5  開催日時
        "",                              // 6  強調テキスト
        "",                              // 7  画像
        "",                              // 8  サムネイル画像
        "",                              // 9  ゲスト画像
        "",                              // 10 詳細
        "",                              // 11 ゲスト名
        "",                              // 12 ゲスト詳細
        "",                              // 13 フリーHTML
        "",                              // 14 カテゴリー
        "",                              // 15 公開維持フラグ
        "",                              // 16 公開日時(始)
        "",                              // 17 公開日時(終)
        "",                              // 18 申込締切日時
        "",                              // 19 フォームID
        "",                              // 20 都道府県
        "",                              // 21 地域
        "",                              // 22 開催場所
        "",                              // 23 地図
        "",                              // 24 補足
        "100",                           // 25 並び順
        "1",                             // 26 表示フラグ
        "UPD",                           // 27 登録フラグ
      ].join("\t")
    );
  return [TSV_HEADER, ...dataRows].join("\n");
}

export function exportTsv(articles: Article[]): void {
  const hasData = articles.some((a) => a.rows.length > 0);
  if (!hasData) {
    alert("エクスポートするデータがありません。");
    return;
  }
  downloadShiftJis(articlesToEventTsv(articles), `schedule_${getDateSuffix()}.txt`);
}
