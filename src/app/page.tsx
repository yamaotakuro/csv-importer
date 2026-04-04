"use client";

import { useSchedule } from "@/hooks/useSchedule";
import Calendar from "@/components/Calendar";
import ScheduleList from "@/components/ScheduleList";
import ExportButtons from "@/components/ExportButtons";

export default function Home() {
  const { rows, addRow, updateRow, deleteRow, clearAll, selectedDates } = useSchedule();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">日程入力ツール</h1>
        <p className="text-sm text-gray-500 mt-0.5">ACF Pro 日程ループ向け CSV / TSV エクスポート</p>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          <div>
            <Calendar selectedDates={selectedDates} onSelectDate={addRow} />
          </div>
          <div className="min-h-[400px]">
            <ScheduleList
              rows={rows}
              onUpdate={updateRow}
              onDelete={deleteRow}
              onAdd={() => addRow()}
            />
          </div>
        </div>

        <ExportButtons rows={rows} onClear={clearAll} />
      </main>
    </div>
  );
}
