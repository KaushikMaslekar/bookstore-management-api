import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmationDialog } from "../../shared/components/ConfirmationDialog";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchBooks, deleteBook, searchBooks, setPageSize } from "./booksSlice";
import type { BookFilterParams } from "../../types";
import {
  SearchBar,
  FilterPanel,
  Pagination,
  ErrorDisplay,
  LoadingSpinner,
} from "../../shared/components";
import { BookCard } from "./BookCard";
import type { FilterConfig } from "../../shared/components/types";

export const BookList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { books, loading, error, totalPages, currentPage, pageSize } =
    useAppSelector((state) => state.books);

  const [filters, setFilters] = useState<BookFilterParams>({
    page: 0,
    size: pageSize,
    sortBy: "title",
    sortDir: "asc",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    bookId: string | null;
    bookTitle: string;
  }>({
    open: false,
    bookId: null,
    bookTitle: "",
  });

  const filterConfig: Record<string, FilterConfig> = {
    sortBy: {
      type: "select",
      label: "Sort By",
      value: filters.sortBy || "title",
      options: [
        { label: "Title", value: "title" },
        { label: "Author", value: "authorName" },
        { label: "Category", value: "categoryName" },
        { label: "Price", value: "price" },
      ],
    },
    sortDir: {
      type: "select",
      label: "Sort Direction",
      value: filters.sortDir || "asc",
      options: [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
      ],
    },
    minPrice: {
      type: "number",
      label: "Minimum Price",
      value: filters.minPrice || "",
      placeholder: "Enter minimum price",
    },
    maxPrice: {
      type: "number",
      label: "Maximum Price",
      value: filters.maxPrice || "",
      placeholder: "Enter maximum price",
    },
  };

  useEffect(() => {
    dispatch(fetchBooks(filters));
  }, [dispatch, filters]);

  const handleSearch = (query: string) => {
    if (query) {
      dispatch(searchBooks({ title: query, params: filters }));
    } else {
      dispatch(fetchBooks(filters));
    }
  };

  const handleFilterChange = (filterKey: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
      page: 0, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    setFilters((prev) => ({
      ...prev,
      size,
      page: 0, // Reset to first page when page size changes
    }));
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteDialog({
      open: true,
      bookId: id,
      bookTitle: title,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.bookId) {
      await dispatch(deleteBook(deleteDialog.bookId));
      dispatch(fetchBooks(filters));
      setDeleteDialog({
        open: false,
        bookId: null,
        bookTitle: "",
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="display-5 fw-bold mb-2">📚 Books Management</h1>
          <p className="text-muted mb-0">
            Manage your book inventory, prices, and stock levels
          </p>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/books/new")}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Book
        </button>
      </div>

      {error && <ErrorDisplay error={error} />}

      {/* Search & Filter Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">🔍 Search & Filters</h5>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search books by title, author, or ISBN..."
          />
          <div className="mt-3">
            <FilterPanel
              filters={filterConfig}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mb-4">
        {books.map((book) => (
          <div key={book.id} className="col">
            <BookCard book={book} onDelete={handleDelete} />
          </div>
        ))}
      </div>

      {/* No Books Message */}
      {books.length === 0 && !loading && (
        <div className="card text-center py-5">
          <div className="card-body">
            <h4 className="card-title mb-3">📚 No Books Found</h4>
            <p className="card-text text-muted mb-4">
              {filters.title
                ? "No books match your search criteria. Try adjusting your filters or search terms."
                : "Your book collection is empty. Start by adding your first book!"}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/books/new")}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Your First Book
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {books.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteDialog.bookTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteDialog({ open: false, bookId: null, bookTitle: "" })
        }
        severity="error"
      />
    </div>
  );
};
