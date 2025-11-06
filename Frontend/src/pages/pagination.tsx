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
  // Calculate the range of records being shown
  const firstRecord = Math.min((currentPage - 1) * rowsPerPage + 1, totalRecords);
  const lastRecord = Math.min(currentPage * rowsPerPage, totalRecords);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= maxVisible; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...');
        for (let i = totalPages - (maxVisible - 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
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
        Showing {firstRecord.toLocaleString()} to {lastRecord.toLocaleString()} of {totalRecords.toLocaleString()} entries
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