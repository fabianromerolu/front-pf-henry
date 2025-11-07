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
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <DarkButton
        onClick={onPrevPage}
        disabled={currentPage === 1}
        size="sm"
        text="anterior"
      />

      <span className="hind text-lg font-base">
        Página {currentPage} de {totalPages}
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
