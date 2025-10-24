"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex justify-center mt-6">
      <div className="btn-group flex space-x-1">
        <button
          className="btn"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          <ChevronLeft size={20} />
        </button>

        {pages.map((p, idx) => {
          const prev = pages[idx - 1];
          const showEllipsis = prev && p - prev > 1;
          return (
            <span key={p} className="flex items-center">
              {showEllipsis && <span className="px-2">…</span>}
              <button
                className={`btn ${page === p ? "btn-active btn-primary" : ""}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          className="btn"
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
