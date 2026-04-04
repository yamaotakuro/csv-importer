"use client";

import { ScheduleRow } from "@/types/schedule";
import { exportCsv, exportTsv } from "@/lib/exportSchedule";

type ExportButtonsProps = {
  rows: ScheduleRow[];
  onClear: () => void;
};

export default function ExportButtons({ rows, onClear }: ExportButtonsProps) {
  const handleClear = () => {
    if (rows.length === 0) return;
    if (confirm("全てのデータをクリアしますか？")) {
      onClear();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
      <span className="text-sm text-gray-500 mr-2">
        {rows.length} 件
      </span>
      <button
        onClick={() => exportCsv(rows)}
        className="px-5 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
      >
        CSV エクスポート
      </button>
      <button
        onClick={() => exportTsv(rows)}
        className="px-5 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
      >
        TSV エクスポート
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
