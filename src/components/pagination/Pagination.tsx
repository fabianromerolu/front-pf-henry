"use client";

import DarkButton from "../Buttoms/DarkButtom";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  hasNextPage,
  onNextPage,
  onPrevPage,
  onGoToPage,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasPrevPage = currentPage > 1;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <DarkButton
        onClick={onPrevPage}
        disabled={!hasPrevPage}
        size="sm"
        text="anterior"
      />

      <div className="flex items-center gap-2">
        {getPageNumbers().map((pageNum, index) => (
          <button
            key={index}
            onClick={() => typeof pageNum === "number" && onGoToPage(pageNum)}
            disabled={pageNum === currentPage || pageNum === "..."}
            className={`
              px-3 py-1 rounded-md hind text-sm font-medium transition-colors
              ${
                pageNum === currentPage
                  ? "bg-custume-blue text-white"
                  : pageNum === "..."
                  ? "cursor-default text-custume-gray"
                  : "bg-gray-200 text-custume-blue hover:bg-custume-blue hover:text-white"
              }
              ${pageNum === "..." ? "" : "min-w-[40px]"}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <span className="hind text-lg font-base text-custume-blue">
        de {totalPages}
      </span>

      <DarkButton
        onClick={onNextPage}
        disabled={!hasNextPage}
        size="sm"
        text="siguiente"
      />
    </div>
  );
}
