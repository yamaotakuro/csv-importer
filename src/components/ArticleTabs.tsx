"use client";

import { Article } from "@/types/article";

type ArticleTabsProps = {
  articles: Article[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
};

function tabLabel(article: Article, index: number): string {
  return article.title.trim() || `記事${index + 1}`;
}

export default function ArticleTabs({
  articles,
  activeId,
  onSelect,
  onAdd,
  onRemove,
}: ArticleTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {articles.map((article, index) => {
        const isActive = article.id === activeId;
        const count = article.rows.length;
        return (
          <div
            key={article.id}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-t-lg border text-sm font-medium
              cursor-pointer whitespace-nowrap transition-colors flex-shrink-0
              ${isActive
                ? "bg-white border-gray-200 border-b-white text-gray-800 -mb-px z-10 relative"
                : "bg-gray-50 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }
            `}
            onClick={() => onSelect(article.id)}
          >
            <span>{tabLabel(article, index)}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              isActive ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-500"
            }`}>
              {count}件
            </span>
            {articles.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(article.id);
                }}
                className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-500 text-gray-400 transition-colors text-xs leading-none"
                aria-label="記事を削除"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
      <button
        onClick={onAdd}
        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex-shrink-0"
        aria-label="記事を追加"
      >
        + 追加
      </button>
    </div>
  );
}
