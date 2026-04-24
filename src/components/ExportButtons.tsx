"use client";

import { Article } from "@/types/article";
import { exportCsv, exportTsv } from "@/lib/exportSchedule";

type ExportButtonsProps = {
  articles: Article[];
  activeRowCount: number;
  onClear: () => void;
};

export default function ExportButtons({ articles, activeRowCount, onClear }: ExportButtonsProps) {
  const totalRows = articles.reduce((sum, a) => sum + a.rows.length, 0);
  const articleCount = articles.filter((a) => a.rows.length > 0).length;

  const handleClear = () => {
    if (activeRowCount === 0) return;
    if (confirm("現在の記事の日程をすべてクリアしますか？")) {
      onClear();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
      <span className="text-sm text-gray-500 mr-1">
        {articleCount} 記事 / 合計 {totalRows} 件
      </span>
      <button
        onClick={() => exportTsv(articles)}
        className="px-5 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
      >
        Vista用エクスポート
      </button>
      <button
        onClick={() => exportCsv(articles)}
        className="px-5 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
      >
        WP用エクスポート
      </button>
      <button
        onClick={handleClear}
        className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        クリア
      </button>
    </div>
  );
}
