import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { BookList } from "../../features/books/BookList";
import NewBook from "../../features/books/NewBook";
import BookDetail from "../../features/books/BookDetail";
import { AuthorList } from "../../features/authors/AuthorList";
import NewAuthor from "../../features/authors/NewAuthor";
import { CategoryList } from "../../features/categories/CategoryList";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/new" element={<NewBook />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/authors" element={<AuthorList />} />
          <Route path="/authors/new" element={<NewAuthor />} />
          <Route path="/categories" element={<CategoryList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
