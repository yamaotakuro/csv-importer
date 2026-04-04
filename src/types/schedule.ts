export type ScheduleRow = {
  id: string;
  date: string; // "YYYY-MM-DD"
  time: string; // 例: "11:00~"
  closed: boolean;
  url: string;
};
