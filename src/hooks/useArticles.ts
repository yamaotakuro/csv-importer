import { useMemo, useState } from "react";
import { Article } from "@/types/article";
import { ScheduleRow } from "@/types/schedule";

function newArticle(): Article {
  return { id: crypto.randomUUID(), tsvId: "", csvId: "", eventType: "", title: "", rows: [] };
}

type UseArticlesReturn = {
  articles: Article[];
  activeId: string;
  activeArticle: Article;
  setActiveId: (id: string) => void;
  addArticle: () => void;
  removeArticle: (id: string) => void;
  updateTsvId: (id: string, tsvId: string) => void;
  updateCsvId: (id: string, csvId: string) => void;
  updateEventType: (id: string, eventType: string) => void;
  updateTitle: (id: string, title: string) => void;
  addRow: (date?: string) => void;
  updateRow: (rowId: string, field: keyof ScheduleRow, value: string | boolean) => void;
  deleteRow: (rowId: string) => void;
  clearRows: () => void;
  selectedDates: string[];
};

export function useArticles(): UseArticlesReturn {
  const initial = newArticle();
  const [articles, setArticles] = useState<Article[]>([initial]);
  const [activeId, setActiveId] = useState<string>(initial.id);

  const activeArticle = articles.find((a) => a.id === activeId) ?? articles[0];

  const selectedDates = useMemo(
    () => activeArticle.rows.map((r) => r.date),
    [activeArticle.rows]
  );

  const addArticle = () => {
    const next = newArticle();
    setArticles((prev) => [...prev, next]);
    setActiveId(next.id);
  };

  const removeArticle = (id: string) => {
    setArticles((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (next.length === 0) {
        const fresh = newArticle();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (activeId === id) {
        setActiveId(next[Math.max(0, prev.findIndex((a) => a.id === id) - 1)].id);
      }
      return next;
    });
  };

  const updateTsvId = (id: string, tsvId: string) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, tsvId } : a)));
  };

  const updateCsvId = (id: string, csvId: string) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, csvId } : a)));
  };

  const updateEventType = (id: string, eventType: string) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, eventType } : a)));
  };

  const updateTitle = (id: string, title: string) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, title } : a)));
  };

  const addRow = (date?: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== activeId) return a;
        if (date && a.rows.some((r) => r.date === date)) return a;
        return {
          ...a,
          rows: [
            ...a.rows,
            {
              id: crypto.randomUUID(),
              date: date ?? "",
              time: "11:00",
              menu1: "",
              menu2: "",
              menu3: "",
              menu4: "",
              menu5: "",
            },
          ],
        };
      })
    );
  };

  const updateRow = (rowId: string, field: keyof ScheduleRow, value: string | boolean) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== activeId) return a;
        return {
          ...a,
          rows: a.rows.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
        };
      })
    );
  };

  const deleteRow = (rowId: string) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== activeId) return a;
        return { ...a, rows: a.rows.filter((r) => r.id !== rowId) };
      })
    );
  };

  const clearRows = () => {
    setArticles((prev) =>
      prev.map((a) => (a.id === activeId ? { ...a, rows: [] } : a))
    );
  };

  return {
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
  };
}
