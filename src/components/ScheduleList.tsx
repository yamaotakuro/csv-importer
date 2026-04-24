"use client";

import { useState } from "react";
import { ScheduleRow as ScheduleRowType } from "@/types/schedule";
import ScheduleRow from "./ScheduleRow";

const MAX_MENUS = 5;

type ScheduleListProps = {
  rows: ScheduleRowType[];
  onUpdate: (id: string, field: keyof ScheduleRowType, value: string | boolean) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
};

export default function ScheduleList({ rows, onUpdate, onDelete, onAdd }: ScheduleListProps) {
  const [menuCount, setMenuCount] = useState(0);

  const totalCols = 3 + menuCount + 1; // No + 日付 + 時間 + menus + 削除

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full">
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-gray-500 w-10">No</th>
              <th className="px-2 py-2.5 text-left text-xs font-semibold text-gray-500 w-36">日付</th>
              <th className="px-2 py-2.5 text-left text-xs font-semibold text-gray-500 w-28">時間</th>
              {Array.from({ length: menuCount }, (_, i) => (
                <th key={i + 1} className="px-2 py-2.5 text-left text-xs font-semibold text-gray-500 w-32">
                  体験メニュー{i + 1}
                </th>
              ))}
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-gray-500 w-16">
                <div className="flex items-center justify-center gap-1">
                  {menuCount > 0 && (
                    <button
                      onClick={() => setMenuCount((c) => Math.max(c - 1, 0))}
                      className="w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors font-bold leading-none"
                      title="体験メニューを削除"
                    >
                      −
                    </button>
                  )}
                  {menuCount < MAX_MENUS && (
                    <button
                      onClick={() => setMenuCount((c) => Math.min(c + 1, MAX_MENUS))}
                      className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors font-bold leading-none"
                      title="体験メニューを追加"
                    >
                      +
                    </button>
                  )}
                </div>
              </th>
              <th className="px-2 py-2.5 text-center text-xs font-semibold text-gray-500 w-12">削除</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={totalCols} className="px-4 py-8 text-center text-gray-400 text-sm">
                  カレンダーから日付を選択するか、「行を追加」ボタンで追加してください
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <ScheduleRow
                  key={row.id}
                  row={row}
                  index={index}
                  menuCount={menuCount}
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
