"use client";

import { ScheduleRow as ScheduleRowType } from "@/types/schedule";
import ScheduleRow from "./ScheduleRow";

type ScheduleListProps = {
  rows: ScheduleRowType[];
  onUpdate: (id: string, field: keyof ScheduleRowType, value: string | boolean) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
};

export default function ScheduleList({ rows, onUpdate, onDelete, onAdd }: ScheduleListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full">
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-gray-500 w-10">No</th>
              <th className="px-2 py-2.5 text-left text-xs font-semibold text-gray-500 w-36">日付</th>
              <th className="px-2 py-2.5 text-left text-xs font-semibold text-gray-500 w-28">時間</th>
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-gray-500 w-16">受付終了</th>
              <th className="px-2 py-2.5 text-left text-xs font-semibold text-gray-500">URL</th>
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-gray-500 w-12">削除</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                  カレンダーから日付を選択するか、「行を追加」ボタンで追加してください
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <ScheduleRow
                  key={row.id}
                  row={row}
                  index={index}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onAdd}
          className="w-full py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-sm hover:border-indigo-400 hover:text-indigo-500 transition-colors"
        >
          + 行を追加
        </button>
      </div>
    </div>
  );
}
