
import './pagination.css';

type Props = {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export default function CustomPagination({ 
  currentPage, 
  totalPages, 
  totalRecords,
  rowsPerPage,
  onPageChange, 
  disabled = false 
}: Props) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {

      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      
      pages.push(1);
      
      if (currentPage <= 3) {
 
        for (let i = 2; i <= maxVisible; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
       
        pages.push('...');
        for (let i = totalPages - (maxVisible - 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
       
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && !disabled) {
      onPageChange(page);
    }
  };

  return (
    <div className="custom-pagination">
      <div className="pagination-info">
        Showing 1 to 2 of {totalPages.toLocaleString()} entries
      </div>
      
      <div className="pagination-controls">
        <button
          className="pagination-btn pagination-prev"
          onClick={handlePrevious}
          disabled={currentPage === 1 || disabled}
        >
          Previous
        </button>
        
        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination-number ${page === currentPage ? 'active' : ''} ${typeof page === 'string' ? 'ellipsis' : ''}`}
              onClick={() => handlePageClick(page)}
              disabled={typeof page === 'string' || disabled}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          className="pagination-btn pagination-next"
          onClick={handleNext}
          disabled={currentPage === totalPages || disabled}
        >
          Next
        </button>
      </div>
    </div>
  );
}