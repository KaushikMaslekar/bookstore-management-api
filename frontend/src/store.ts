import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./features/books/booksSlice";
import authorsReducer from "./features/authors/authorsSlice";
import categoriesReducer from "./features/categories/categoriesSlice";

export const store = configureStore({
  reducer: {
    books: booksReducer,
    authors: authorsReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
