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
import { aiService } from "../../services/api";
import { bookService } from "../../services/api";

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

  const [useSemanticSearch, setUseSemanticSearch] = useState(false);
  const [semanticResults, setSemanticResults] = useState<any[]>([]);
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [semanticError, setSemanticError] = useState<string | null>(null);

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
    if (!useSemanticSearch) {
      dispatch(fetchBooks(filters));
    }
  }, [dispatch, filters, useSemanticSearch]);

  const handleSearch = async (query: string) => {
    if (!query) {
      setUseSemanticSearch(false);
      setSemanticResults([]);
      dispatch(fetchBooks(filters));
      return;
    }

    if (useSemanticSearch) {
      // AI Semantic Search
      try {
        setSemanticLoading(true);
        setSemanticError(null);
        const results = await aiService.semanticSearch(query, 20);

        // Fetch full book details for each result
        const bookIds = results.value.map((r) => r.bookId);
        const booksPromises = bookIds.map((id) => bookService.getBookById(id));
        const booksData = await Promise.all(booksPromises);

        setSemanticResults(booksData);
      } catch (err: any) {
        setSemanticError(err.message || "Failed to perform semantic search");
        setSemanticResults([]);
      } finally {
        setSemanticLoading(false);
      }
    } else {
      // Traditional keyword search
      dispatch(searchBooks({ title: query, params: filters }));
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

  const displayLoading = useSemanticSearch ? semanticLoading : loading;
  const displayError = useSemanticSearch ? semanticError : error;
  const displayBooks = useSemanticSearch ? semanticResults : books;

  if (displayLoading) return <LoadingSpinner />;

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

      {displayError &&
        (typeof displayError === "string" ? (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {displayError}
          </div>
        ) : (
          <ErrorDisplay error={displayError} />
        ))}

      {/* Search & Filter Section */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">🔍 Search & Filters</h5>

            {/* AI Search Toggle */}
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="semanticSearchToggle"
                checked={useSemanticSearch}
                onChange={(e) => setUseSemanticSearch(e.target.checked)}
              />
              <label
                className="form-check-label"
                htmlFor="semanticSearchToggle"
              >
                <i className="bi bi-magic me-1"></i>
                <strong>AI Semantic Search</strong>
              </label>
            </div>
          </div>

          {/* AI Search Info Banner */}
          {useSemanticSearch && (
            <div className="alert alert-info mb-3" role="alert">
              <i className="bi bi-lightbulb-fill me-2"></i>
              <strong>AI Search Active:</strong> Searches understand meaning,
              not just keywords. Try "beginner python tutorial" or "software
              engineering best practices"
            </div>
          )}

          <SearchBar
            onSearch={handleSearch}
            placeholder={
              useSemanticSearch
                ? "🤖 AI Search: Try 'learn programming' or 'code quality books'..."
                : "Search books by title, author, or ISBN..."
            }
          />

          {!useSemanticSearch && (
            <div className="mt-3">
              <FilterPanel
                filters={filterConfig}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mb-4">
        {displayBooks.map((book) => (
          <div key={book.id} className="col">
            <BookCard book={book} onDelete={handleDelete} />
          </div>
        ))}
      </div>

      {/* No Books Message */}
      {displayBooks.length === 0 && !displayLoading && (
        <div className="card text-center py-5">
          <div className="card-body">
            <h4 className="card-title mb-3">
              {useSemanticSearch
                ? "🤖 No AI Results Found"
                : "📚 No Books Found"}
            </h4>
            <p className="card-text text-muted mb-4">
              {useSemanticSearch
                ? "No books match your semantic search. Try different keywords or phrases that describe what you're looking for."
                : filters.title
                ? "No books match your search criteria. Try adjusting your filters or search terms."
                : "Your book collection is empty. Start by adding your first book!"}
            </p>
            {!useSemanticSearch && (
              <button
                className="btn btn-primary"
                onClick={() => navigate("/books/new")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Your First Book
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pagination - Hide for semantic search */}
      {displayBooks.length > 0 && !useSemanticSearch && (
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
