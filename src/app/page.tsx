"use client";

import { useArticles } from "@/hooks/useArticles";
import Calendar from "@/components/Calendar";
import ScheduleList from "@/components/ScheduleList";
import ExportButtons from "@/components/ExportButtons";
import ArticleTabs from "@/components/ArticleTabs";

export default function Home() {
  const {
    articles,
    activeId,
    activeArticle,
    setActiveId,
    addArticle,
    removeArticle,
    updateTsvId,
    updateCsvId,
    updateEventType,
    updateTitle,
    addRow,
    updateRow,
    deleteRow,
    clearRows,
    selectedDates,
  } = useArticles();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">日程入力ツール</h1>
        <p className="text-sm text-gray-500 mt-0.5">ACF Pro 日程ループ向け CSV / TSV エクスポート</p>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">

        {/* タブ */}
        <div className="border-b border-gray-200">
          <ArticleTabs
            articles={articles}
            activeId={activeId}
            onSelect={setActiveId}
            onAdd={addArticle}
            onRemove={removeArticle}
          />
        </div>

        {/* 記事設定 */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 w-full">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">イベントタイトル</label>
            <input
              type="text"
              value={activeArticle.title}
              onChange={(e) => updateTitle(activeId, e.target.value)}
              placeholder="例: 高校3年生の方へ 個別オンラインAO説明会"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Vista用ID</label>
            <input
              type="text"
              value={activeArticle.tsvId}
              onChange={(e) => updateTsvId(activeId, e.target.value)}
              placeholder="例: 0000052635"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600 whitespace-nowrap">WordPress用ID</label>
            <input
              type="text"
              value={activeArticle.csvId}
              onChange={(e) => updateCsvId(activeId, e.target.value)}
              placeholder="例: 896"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <select
              value={activeArticle.eventType}
              onChange={(e) => updateEventType(activeId, e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700"
            >
              <option value="">種別を選択</option>
              <option value="1">1：学校説明会</option>
              <option value="2">2：レギュラー</option>
              <option value="3">3：スペシャル</option>
              <option value="4">4：ガイダンス</option>
              <option value="5">5：フリー1(画像)</option>
              <option value="6">6：フリー2(HTML)</option>
              <option value="7">7：W体験</option>
              <option value="12">12：マイスクールレギュラー</option>
              <option value="13">13：マイスクールスペシャル</option>
            </select>
          </div>
        </div>

        {/* カレンダー + 日程リスト */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          <div>
            <Calendar selectedDates={selectedDates} onSelectDate={addRow} />
          </div>
          <div className="min-h-[400px]">
            <ScheduleList
              rows={activeArticle.rows}
              onUpdate={updateRow}
              onDelete={deleteRow}
              onAdd={() => addRow()}
            />
          </div>
        </div>

        {/* エクスポート */}
        <ExportButtons
          articles={articles}
          activeRowCount={activeArticle.rows.length}
          onClear={clearRows}
        />
      </main>
    </div>
  );
}
