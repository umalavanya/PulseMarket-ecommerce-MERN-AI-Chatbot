import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ pages, page, totalProducts, pageSize = 12, onPageChange, onPageSizeChange }) => {
  const [jumpPage, setJumpPage] = useState('');

  if (!pages || pages <= 0) return null;

  // Algorithm to calculate visible page numbers with dots (...)
  const getPageNumbers = () => {
    const delta = 2; // number of pages before & after current page
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= pages; i++) {
      if (
        i === 1 ||
        i === pages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      }
    }

    let last;
    for (let i of range) {
      if (last) {
        if (i - last === 2) {
          rangeWithDots.push(last + 1);
        } else if (i - last !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      last = i;
    }

    return rangeWithDots;
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (pageNum >= 1 && pageNum <= pages) {
      onPageChange(pageNum);
      setJumpPage('');
    }
  };

  const startItem = totalProducts === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalProducts);
  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-wrapper">
      {/* Summary Info */}
      <div className="pagination-info">
        Showing <strong>{startItem}-{endItem}</strong> of <strong>{totalProducts}</strong> products
        <span className="pagination-page-badge">Page {page} of {pages}</span>
      </div>

      {/* Main Pagination Controls */}
      {pages > 1 && (
        <div className="pagination">
          {/* Jump to First Page */}
          <button
            className="page-item"
            disabled={page === 1}
            onClick={() => onPageChange(1)}
            title="First Page"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Previous Page */}
          <button
            className="page-item"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Buttons & Ellipses */}
          {pageNumbers.map((item, index) => {
            if (item === '...') {
              return (
                <span key={`dots-${index}`} className="page-dots">
                  &hellip;
                </span>
              );
            }

            return (
              <button
                key={item}
                className={`page-item ${item === page ? 'active' : ''}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            className="page-item"
            disabled={page === pages}
            onClick={() => onPageChange(page + 1)}
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>

          {/* Jump to Last Page */}
          <button
            className="page-item"
            disabled={page === pages}
            onClick={() => onPageChange(pages)}
            title="Last Page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      )}

      {/* Page Size Selector & Quick Jump */}
      <div className="pagination-extra">
        {onPageSizeChange && (
          <div className="page-size-selector">
            <span>Show per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        )}

        {pages > 5 && (
          <form className="page-jump-form" onSubmit={handleJumpSubmit}>
            <span>Go to:</span>
            <input
              type="number"
              min={1}
              max={pages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="#"
            />
            <button type="submit" className="btn-jump">
              Go
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Pagination;
