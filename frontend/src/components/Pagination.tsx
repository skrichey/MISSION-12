// Define the PaginationProps interface
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination = ({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
  }: PaginationProps) => {
    return (
      <div className="pagination-container">
        <div className="pagination-buttons">
          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
  
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`btn ${
                currentPage === i + 1 ? 'btn-secondary' : 'btn-outline-secondary'
              }`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
  
          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
  
        <div className="d-flex align-items-center">
          <label className="me-2 fw-bold">Results per page:</label>
          <select
            className="form-select w-auto"
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
          >
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="18">18</option>
          </select>
        </div>
      </div>
    );
  };
  