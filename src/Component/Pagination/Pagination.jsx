import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PropTypes from "prop-types";

const Pagination = ({ totalItems, itemsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}          
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const renderPrevArrow = () => {
    return (
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>
    );
  };

  const renderNextArrow = () => {
    return (
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    );
  };

  return (
    <div className="pagination">
      {renderPrevArrow()}
      {renderPageNumbers()}
      {renderNextArrow()}
    </div>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
