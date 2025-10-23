import axios, { AxiosError } from "axios";
import type { Author, Book, Category, ApiError } from "../types";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || "An unexpected error occurred",
      status: error.response?.status || 500,
      timestamp: error.response?.data?.timestamp,
    };
    return Promise.reject(apiError);
  }
);

// Authors API
export const authorApi = {
  getAll: () => api.get<Author[]>("/authors").then((res) => res.data),
  getById: (id: string) =>
    api.get<Author>(`/authors/${id}`).then((res) => res.data),
  create: (author: Omit<Author, "id" | "books">) =>
    api.post<Author>("/authors", author).then((res) => res.data),
  update: (id: string, author: Omit<Author, "id" | "books">) =>
    api.put<Author>(`/authors/${id}`, author).then((res) => res.data),
  delete: (id: string) => api.delete(`/authors/${id}`),
};

// Books API
export const bookApi = {
  getAll: () => api.get<Book[]>("/books").then((res) => res.data),
  getById: (id: string) =>
    api.get<Book>(`/books/${id}`).then((res) => res.data),
  create: (book: Omit<Book, "id">) =>
    api.post<Book>("/books", book).then((res) => res.data),
  update: (id: string, book: Omit<Book, "id">) =>
    api.put<Book>(`/books/${id}`, book).then((res) => res.data),
  delete: (id: string) => api.delete(`/books/${id}`),
};

// Categories API
export const categoryApi = {
  getAll: () => api.get<Category[]>("/categories").then((res) => res.data),
  getById: (id: string) =>
    api.get<Category>(`/categories/${id}`).then((res) => res.data),
  create: (category: Omit<Category, "id" | "books">) =>
    api.post<Category>("/categories", category).then((res) => res.data),
  update: (id: string, category: Omit<Category, "id" | "books">) =>
    api.put<Category>(`/categories/${id}`, category).then((res) => res.data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};
