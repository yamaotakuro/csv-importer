import { useMemo, useState } from "react";
import { ScheduleRow } from "@/types/schedule";

type UseScheduleReturn = {
  rows: ScheduleRow[];
  addRow: (date?: string) => void;
  updateRow: (id: string, field: keyof ScheduleRow, value: string | boolean) => void;
  deleteRow: (id: string) => void;
  clearAll: () => void;
  selectedDates: string[];
};

export function useSchedule(): UseScheduleReturn {
  const [rows, setRows] = useState<ScheduleRow[]>([]);

  const selectedDates = useMemo(() => rows.map((r) => r.date), [rows]);

  const addRow = (date?: string) => {
    if (date && rows.some((r) => r.date === date)) return;
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        date: date ?? "",
        time: "11:00",
        closed: false,
        url: "",
      },
    ]);
  };

  const updateRow = (id: string, field: keyof ScheduleRow, value: string | boolean) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const clearAll = () => setRows([]);

  return { rows, addRow, updateRow, deleteRow, clearAll, selectedDates };
}
