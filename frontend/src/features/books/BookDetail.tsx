import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { bookService, aiService } from "../../services/api";
import type { Book } from "../../shared/types";
import type { BookRecommendation } from "../../services/api";
import { LoadingSpinner } from "../../shared/components";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>(
    []
  );
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBookAndRecommendations = async () => {
      try {
        setLoading(true);
        // Fetch book details
        const bookData = await bookService.getBookById(id);
        setBook(bookData);

        // Fetch AI recommendations
        setRecLoading(true);
        try {
          const recResponse = await aiService.getRecommendations(id, 6);
          setRecommendations(recResponse.value || []);
        } catch (recError) {
          console.error("Failed to load recommendations:", recError);
          // Don't block the main content if recommendations fail
        } finally {
          setRecLoading(false);
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load book details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndRecommendations();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="alert alert-warning" role="alert">
        <i className="bi bi-info-circle me-2"></i>
        Book not found
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header with back button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
        <Link to={`/books/edit/${book.id}`} className="btn btn-primary">
          <i className="bi bi-pencil me-2"></i>
          Edit Book
        </Link>
      </div>

      {/* Book Details Card */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div
                className="bg-secondary rounded d-flex align-items-center justify-content-center"
                style={{ height: "400px" }}
              >
                <i
                  className="bi bi-book"
                  style={{ fontSize: "4rem", color: "white" }}
                ></i>
              </div>
            </div>
            <div className="col-md-9">
              <h1 className="display-5 fw-bold mb-3">{book.title}</h1>

              <div className="mb-3">
                <span className="badge bg-primary me-2">
                  <i className="bi bi-person me-1"></i>
                  {book.author?.name || "Unknown Author"}
                </span>
                <span className="badge bg-info me-2">
                  <i className="bi bi-tag me-1"></i>
                  {book.category?.name || "Uncategorized"}
                </span>
                <span className="badge bg-secondary">
                  <i className="bi bi-upc me-1"></i>
                  ISBN: {book.isbn}
                </span>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h3 className="text-success mb-0">
                        ₹{book.price.toFixed(2)}
                      </h3>
                      <small className="text-muted">Price</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h3 className="mb-0">
                        {new Date(book.publicationDate).getFullYear()}
                      </h3>
                      <small className="text-muted">Published</small>
                    </div>
                  </div>
                </div>
              </div>

              {book.description && (
                <div className="mb-3">
                  <h5 className="fw-bold">📖 Description</h5>
                  <p className="text-muted">{book.description}</p>
                </div>
              )}

              <div className="d-flex gap-2">
                <button className="btn btn-success">
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </button>
                <button className="btn btn-outline-danger">
                  <i className="bi bi-heart me-2"></i>
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-magic me-2"></i>
            Similar Books You Might Like
            <span className="badge bg-light text-primary ms-2">AI Powered</span>
          </h4>
        </div>
        <div className="card-body">
          {recLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">
                  Loading recommendations...
                </span>
              </div>
              <p className="text-muted mt-2">Finding similar books...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              {recommendations.map((rec) => (
                <div key={rec.bookId} className="col">
                  <Link
                    to={`/books/${rec.bookId}`}
                    className="text-decoration-none"
                  >
                    <div className="card h-100 hover-shadow">
                      <div className="card-body">
                        <h6
                          className="card-title text-truncate"
                          title={rec.title}
                        >
                          {rec.title}
                        </h6>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="badge bg-success">
                            {(rec.score * 100).toFixed(0)}% Match
                          </span>
                          <small className="text-muted">
                            <i className="bi bi-arrow-right"></i>
                          </small>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-info-circle" style={{ fontSize: "2rem" }}></i>
              <p className="mt-2">No similar books found at the moment.</p>
              <small>
                Make sure book embeddings are computed using the AI admin panel.
              </small>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hover-shadow {
          transition: box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default BookDetail;
