"use client";

import { useState } from "react";

type CalendarProps = {
  selectedDates: string[];
  onSelectDate: (date: string) => void;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function Calendar({ selectedDates, onSelectDate }: CalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayStr = toDateString(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 select-none">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="前の月"
        >
          ◀
        </button>
        <span className="font-semibold text-gray-800 text-lg">
          {currentYear}/{String(currentMonth + 1).padStart(2, "0")}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="次の月"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`text-center text-xs font-medium py-1 ${
              i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }
          const dateStr = toDateString(currentYear, currentMonth, day);
          const isSelected = selectedDates.includes(dateStr);
          const isToday = dateStr === todayStr;
          const col = idx % 7;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition-colors font-medium
                ${isSelected
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : isToday
                  ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  : "hover:bg-gray-100 text-gray-700"}
                ${col === 0 && !isSelected ? "text-red-500" : ""}
                ${col === 6 && !isSelected ? "text-blue-500" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
