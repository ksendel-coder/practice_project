import { memo } from "react";
import styles from './Styles.module.scss';
import { Button } from "../Button";


interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onChange: (page: number) => void;
}

function PaginationComponent({ 
  currentPage, 
  totalPage, 
  onChange, 
}: PaginationProps) {
  
  const getNumberPage = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPage <= 1) {
    return null;
  }
  
  return (
    <nav className={styles.pagination}>
      {getNumberPage().map((page) => {
        const isActive = currentPage === page;
        
        return (
          <Button
            key={page}
            size="min"
            color={isActive ? 'primary' : 'transparent'}  
            onClick={() => onChange(page)}
            radius={5}>
            {page}
          </Button>
        );
      })}
    </nav>
  );
}

export const Pagination = memo(PaginationComponent);