import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 my-8 select-none">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-surface-border bg-white text-zinc-700 hover:bg-surface-subtle disabled:opacity-40 disabled:pointer-events-none transition-all shadow-soft-sm"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
            currentPage === page
              ? 'bg-brand-800 text-white shadow-soft-sm'
              : 'border border-surface-border bg-white text-zinc-700 hover:bg-surface-subtle'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-surface-border bg-white text-zinc-700 hover:bg-surface-subtle disabled:opacity-40 disabled:pointer-events-none transition-all shadow-soft-sm"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
