export interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  books: Book[];
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  price: number;
  publicationDate: string;
  description: string;
  author: Author;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  books: Book[];
}

export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}
