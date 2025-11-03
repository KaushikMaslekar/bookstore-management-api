import axios from "axios";
import type {
  Book,
  BookCreateDTO,
  Author,
  AuthorCreateDTO,
  Category,
  CategoryCreateDTO,
  PaginatedResponse,
  PaginationParams,
  BookFilterParams,
  AuthorFilterParams,
  CategoryFilterParams,
} from "../types";

const BASE_URL = "http://localhost:8080/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };

// Helper function to build query string from params
const buildQueryString = (params: object): string => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");
  return query ? `?${query}` : "";
};

// Book Service
// Note: backend currently returns a plain array for some endpoints while the
// frontend expects PaginatedResponse<T>. Normalize here so the rest of the
// app can keep assuming the paginated shape.
const normalizePaginatedResponse = <T>(
  data: any,
  params?: any
): PaginatedResponse<T> => {
  // If backend already returns a paginated object with `content`, assume it's correct
  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "content" in data
  ) {
    return data as PaginatedResponse<T>;
  }

  // If backend returns an array, wrap it into a PaginatedResponse
  if (Array.isArray(data)) {
    return {
      content: data as T[],
      totalPages: 1,
      totalElements: (data as T[]).length,
      size: params?.size ?? (data as T[]).length,
      number: params?.page ?? 0,
      first: true,
      last: true,
      empty: (data as T[]).length === 0,
    };
  }

  // Fallback: empty paginated response
  return {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: params?.size ?? 0,
    number: params?.page ?? 0,
    first: true,
    last: true,
    empty: true,
  };
};

export const bookService = {
  getAllBooks: (params?: BookFilterParams) =>
    api
      .get<any>(`/books${buildQueryString(params || {})}`)
      .then((res) => normalizePaginatedResponse<Book>(res.data, params)),
  getBookById: (id: string) =>
    api.get<Book>(`/books/${id}`).then((res) => res.data),
  createBook: (book: BookCreateDTO) =>
    api.post<Book>("/books/create", book).then((res) => res.data),
  updateBook: (id: string, book: BookCreateDTO) =>
    api.put<Book>(`/books/${id}`, book).then((res) => res.data),
  deleteBook: (id: string) =>
    api.delete(`/books/${id}`).then((res) => res.data),
  searchBooks: (title: string, params?: PaginationParams) =>
    api
      .get<any>(`/books/search${buildQueryString({ ...params, title })}`)
      .then((res) => normalizePaginatedResponse<Book>(res.data, params)),
  getBooksByCategory: (categoryId: string, params?: PaginationParams) =>
    api
      .get<any>(`/books${buildQueryString({ ...params, categoryId })}`)
      .then((res) => normalizePaginatedResponse<Book>(res.data, params)),
  getBooksByAuthor: (authorId: string, params?: PaginationParams) =>
    api
      .get<any>(`/books${buildQueryString({ ...params, authorId })}`)
      .then((res) => normalizePaginatedResponse<Book>(res.data, params)),
  getBooksByPriceRange: (
    minPrice: number,
    maxPrice: number,
    params?: PaginationParams
  ) =>
    api
      .get<any>(`/books${buildQueryString({ ...params, minPrice, maxPrice })}`)
      .then((res) => normalizePaginatedResponse<Book>(res.data, params)),
  getBooksWithLowStock: (stockThreshold: number, params?: PaginationParams) =>
    api
      .get<any>(`/books${buildQueryString({ ...params, stockThreshold })}`)
      .then((res) => normalizePaginatedResponse<Book>(res.data, params)),
};

// Author Service
export const authorService = {
  getAllAuthors: (params?: AuthorFilterParams) =>
    api
      .get<PaginatedResponse<Author>>(
        `/authors${buildQueryString(params || {})}`
      )
      .then((res) => res.data),
  getAuthorById: (id: string) =>
    api.get<Author>(`/authors/${id}`).then((res) => res.data),
  createAuthor: (author: AuthorCreateDTO) =>
    api.post<Author>("/authors/create", author).then((res) => res.data),
  updateAuthor: (id: string, author: AuthorCreateDTO) =>
    api.put<Author>(`/authors/${id}`, author).then((res) => res.data),
  deleteAuthor: (id: string) =>
    api.delete(`/authors/${id}`).then((res) => res.data),
  searchAuthors: (name: string, params?: PaginationParams) =>
    api
      .get<PaginatedResponse<Author>>(
        `/authors/search${buildQueryString({ ...params, name })}`
      )
      .then((res) => res.data),
};

// Category Service
export const categoryService = {
  getAllCategories: (params?: CategoryFilterParams) =>
    api
      .get<PaginatedResponse<Category>>(
        `/categories${buildQueryString(params || {})}`
      )
      .then((res) => res.data),
  getCategoryById: (id: string) =>
    api.get<Category>(`/categories/${id}`).then((res) => res.data),
  createCategory: (category: CategoryCreateDTO) =>
    api.post<Category>("/categories", category).then((res) => res.data),
  updateCategory: (id: string, category: CategoryCreateDTO) =>
    api.put<Category>(`/categories/${id}`, category).then((res) => res.data),
  deleteCategory: (id: string) =>
    api.delete(`/categories/${id}`).then((res) => res.data),
  searchCategories: (name: string, params?: PaginationParams) =>
    api
      .get<PaginatedResponse<Category>>(
        `/categories/search${buildQueryString({ ...params, name })}`
      )
      .then((res) => res.data),
};

// AI Service
// AI Service Types
export interface BookRecommendation {
  bookId: string;
  title: string;
  score: number;
}

export interface SemanticSearchResult {
  bookId: string;
  title: string;
  score: number;
}

export const aiService = {
  // Get book recommendations based on similarity
  // Backend returns array directly, not wrapped in {value: [...]}
  getRecommendations: (bookId: string, size: number = 6) =>
    api
      .get<BookRecommendation[]>(
        `/ai/recommendations/book/${bookId}?size=${size}`
      )
      .then((res) => res.data),

  // Semantic search - understands meaning, not just keywords
  // Backend returns array directly, not wrapped in {value: [...]}
  semanticSearch: (query: string, size: number = 10) =>
    api
      .get<SemanticSearchResult[]>(
        `/ai/semantic-search?q=${encodeURIComponent(query)}&size=${size}`
      )
      .then((res) => res.data),

  // Recompute embeddings for all books
  recomputeEmbeddings: (force: boolean = false) =>
    api
      .post<{ total: number; message: string; updated: number }>(
        `/ai/embeddings/recompute?force=${force}`
      )
      .then((res) => res.data),

  // Update embedding for a single book
  updateBookEmbedding: (bookId: string) =>
    api
      .post<{ message: string; bookId: string }>(
        `/ai/embeddings/book/${bookId}`
      )
      .then((res) => res.data),
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = error.response?.data || {
      message: "An unexpected error occurred",
      status: 500,
      error: "Internal Server Error",
      path: error.config?.url,
      timestamp: new Date().toISOString(),
    };
    return Promise.reject(errorResponse);
  }
);

export default api;
