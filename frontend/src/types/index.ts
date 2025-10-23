// API Response Types
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  description: string;
  price: number;
  publicationYear: number;
  stockQuantity: number;
  pages: number;
  language: string;
  createdAt?: string;
  updatedAt?: string;
  authorName: string;
  authorId: string;
  categoryName: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookCreateDTO {
  title: string;
  isbn: string;
  description?: string;
  price: number;
  publicationYear: number;
  stockQuantity: number;
  pages: number;
  language: string;
  authorId: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  booksCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  biography?: string;
  books?: Book[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthorCreateDTO {
  name: string;
  email: string;
  biography?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  books?: Book[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateDTO {
  name: string;
  description?: string;
}

// Query Parameters Types
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface BookFilterParams extends PaginationParams {
  authorId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  title?: string;
}

export interface AuthorFilterParams extends PaginationParams {
  name?: string;
}

export interface CategoryFilterParams extends PaginationParams {
  name?: string;
}

// Error Response Type
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
