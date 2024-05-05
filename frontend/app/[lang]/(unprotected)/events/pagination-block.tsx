import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PaginationBlockProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export function PaginationBlock({
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationBlockProps) {
  const [range, setRange] = useState<Array<number>>([1, 2, 3]);

  useEffect(() => {
    if (currentPage === 1) {
      setRange([1, 2, 3]);
    }
  }, [currentPage]);

  function handlePageClick(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    const clickedPage = parseInt(target?.getAttribute('aria-label') || '1');
    const label = target?.getAttribute('aria-label');

    if (
      [1, 2].includes(clickedPage) ||
      (totalPages < 4 && label !== 'next' && label !== 'prev')
    ) {
      setCurrentPage(clickedPage);
      setRange([1, 2, 3]);
      return;
    }
    if (clickedPage === totalPages) {
      setCurrentPage(totalPages);
      setRange([totalPages - 2, totalPages - 1, totalPages]);
      return;
    }
    if (label === 'prev') {
      if (currentPage === 2) {
        setCurrentPage(1);
        return;
      }
      setCurrentPage((currentPage) => currentPage - 1);
      setRange([currentPage - 2, currentPage - 1, currentPage]);
      return;
    }
    if (label === 'next') {
      if (currentPage === totalPages - 1) {
        setCurrentPage(totalPages);
        return;
      }
      setCurrentPage((currentPage) => currentPage + 1);
      setRange([currentPage, currentPage + 1, currentPage + 2]);
      return;
    }
    setCurrentPage(clickedPage);
    setRange([clickedPage - 1, clickedPage, clickedPage + 1]);
  }

  return (
    <Pagination className="flex justify-start">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={null}
            disabled={currentPage < 2}
            aria-label="prev"
            onClick={handlePageClick}
          >
            Предыдущая
          </Button>
        </PaginationItem>
        {range[0] > 3 && (
          <>
            <PaginationItem>
              <Button
                variant={currentPage === 1 ? 'ruchampDefault' : null}
                aria-label="1"
                onClick={handlePageClick}
              >
                1
              </Button>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {range.map((page) => (
          <PaginationItem key={page}>
            <Button
              variant={currentPage === page ? 'ruchampDefault' : null}
              aria-label={page.toString()}
              onClick={handlePageClick}
              disabled={page > totalPages}
            >
              {page}
            </Button>
          </PaginationItem>
        ))}
        {range[2] !== totalPages && totalPages > 3 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <Button
                variant={null}
                aria-label={totalPages.toString()}
                onClick={handlePageClick}
              >
                {totalPages}
              </Button>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <Button
            variant={null}
            disabled={currentPage > totalPages - 1}
            aria-label="next"
            onClick={handlePageClick}
          >
            Следующая
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
