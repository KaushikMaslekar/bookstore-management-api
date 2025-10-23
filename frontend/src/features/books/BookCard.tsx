import React from "react";
import { useNavigate } from "react-router-dom";
import type { Book } from "../../types";

interface BookCardProps {
  book: Book;
  onDelete: (id: string, title: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card h-100 shadow-sm" style={{ minHeight: "280px" }}>
      <div className="card-body d-flex flex-column">
        <h5
          className="card-title mb-2 text-truncate-2"
          style={{
            cursor: "pointer",
            minHeight: "48px",
            lineHeight: "1.5",
          }}
          onClick={() => navigate(`/books/${book.id}`)}
        >
          {book.title}
        </h5>
        <p className="card-subtitle mb-3 text-muted small">
          by {book.authorName}
        </p>

        <div className="mb-3">
          <p className="mb-1 small">
            <strong className="text-secondary">Category:</strong>
            <span className="badge bg-info text-dark ms-2">
              {book.categoryName}
            </span>
          </p>
          <p className="mb-0 small text-muted">
            <strong>ISBN:</strong> {book.isbn}
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto mb-3">
          <h4 className="text-primary mb-0 fw-bold">
            ${book.price.toFixed(2)}
          </h4>
          <span
            className={`badge ${
              book.stockQuantity > 0 ? "bg-success" : "bg-danger"
            }`}
          >
            {book.stockQuantity > 0
              ? `${book.stockQuantity} in stock`
              : "Out of stock"}
          </span>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate(`/books/${book.id}`)}
            title="Edit"
          >
            <i className="bi bi-pencil me-1"></i> Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(book.id, book.title)}
            title="Delete"
          >
            <i className="bi bi-trash me-1"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
};
