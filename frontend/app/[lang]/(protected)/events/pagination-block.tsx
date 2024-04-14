import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';

type TypePaginationBlockProps = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};

export function PaginationBlock({
  totalPages,
  currentPage,
  setCurrentPage,
}: TypePaginationBlockProps) {
  const [range, setRange] = useState<Array<number>>([1, 2, 3]);

  function handlePageClick(e: any) {
    // fix "any" type
    e.preventDefault();
    const clickedPage = +e.currentTarget.ariaLabel;
    const label = e.currentTarget.ariaLabel;

    if (clickedPage === 1) {
      setCurrentPage(1);
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
              <Button variant={null} aria-label="1" onClick={handlePageClick}>
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
            >
              {page}
            </Button>
          </PaginationItem>
        ))}
        {range[2] !== totalPages && (
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
