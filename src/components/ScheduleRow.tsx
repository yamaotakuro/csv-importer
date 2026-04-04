"use client";

import { ScheduleRow as ScheduleRowType } from "@/types/schedule";

type ScheduleRowProps = {
  row: ScheduleRowType;
  index: number;
  onUpdate: (id: string, field: keyof ScheduleRowType, value: string | boolean) => void;
  onDelete: (id: string) => void;
};

export default function ScheduleRow({ row, index, onUpdate, onDelete }: ScheduleRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-3 py-2 text-center text-sm text-gray-500 w-10">{index + 1}</td>
      <td className="px-2 py-2 w-36">
        <input
          type="date"
          value={row.date}
          onChange={(e) => onUpdate(row.id, "date", e.target.value)}
          className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </td>
      <td className="px-2 py-2 w-28">
        <input
          type="text"
          value={row.time}
          placeholder="例: 11:00~"
          onChange={(e) => onUpdate(row.id, "time", e.target.value)}
          className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </td>
      <td className="px-2 py-2 text-center w-16">
        <input
          type="checkbox"
          checked={row.closed}
          onChange={(e) => onUpdate(row.id, "closed", e.target.checked)}
          className="w-4 h-4 accent-indigo-500 cursor-pointer"
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="text"
          value={row.url}
          placeholder="https://..."
          onChange={(e) => onUpdate(row.id, "url", e.target.value)}
          className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </td>
      <td className="px-2 py-2 text-center w-12">
        <button
          onClick={() => onDelete(row.id)}
          className="text-red-400 hover:text-red-600 transition-colors text-lg leading-none"
          aria-label="削除"
        >
          ×
        </button>
      </td>
    </tr>
  );
}
