import { memo } from "react";
import styles from "./Styles.module.scss";
import { Button } from "../Button";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onChange: (page: number) => void;
}

function PaginationComponent({ currentPage, totalPage, onChange, }: PaginationProps) {
  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    const pagesAround = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - pagesAround);
    let end = Math.min(totalPage, currentPage + pagesAround);

    if (currentPage - pagesAround < 1) {
      end = Math.min(totalPage, maxVisible);
    }
    if (currentPage + pagesAround > totalPage) {
      start = Math.max(1, totalPage - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPage) {
      onChange(page);
    }
  };

  if (totalPage <= 1) return null;

  return (
    <nav className={styles.pagination}>
      <Button
        size="min"
        color="transparent"
        onClick={() => changePage(1)}
        disabled={currentPage === 1}
        radius={5}
      >
        «
      </Button>
      <Button
        size="min"
        color="transparent"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        radius={5}
      >
        ‹
      </Button>

      {getVisiblePages().map((page) => (
        <Button
          key={page}
          size="min"
          color={currentPage === page ? "primary" : "transparent"}
          onClick={() => changePage(page)}
          radius={5}
        >
          {page}
        </Button>
      ))}

      <Button
        size="min"
        color="transparent"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPage}
        radius={5}
      >
        ›
      </Button>
      <Button
        size="min"
        color="transparent"
        onClick={() => changePage(totalPage)}
        disabled={currentPage === totalPage}
        radius={5}
      >
        »
      </Button>
    </nav>
  );
}

export const Pagination = memo(PaginationComponent);
