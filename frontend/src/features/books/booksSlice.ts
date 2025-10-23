import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { bookService } from "../../services/api";
import type {
  Book,
  BookCreateDTO,
  PaginatedResponse,
  BookFilterParams,
  ErrorResponse,
} from "../../types";

interface BookState {
  books: Book[];
  selectedBook: Book | null;
  loading: boolean;
  error: ErrorResponse | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

const initialState: BookState = {
  books: [],
  selectedBook: null,
  loading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  pageSize: 10,
};

// Async Thunks
export const fetchBooks = createAsyncThunk<
  PaginatedResponse<Book>,
  BookFilterParams | undefined,
  { rejectValue: ErrorResponse }
>("books/fetchBooks", async (params, { rejectWithValue }) => {
  try {
    return await bookService.getAllBooks(params);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

export const fetchBookById = createAsyncThunk<
  Book,
  string,
  { rejectValue: ErrorResponse }
>("books/fetchBookById", async (id, { rejectWithValue }) => {
  try {
    return await bookService.getBookById(id);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

export const createBook = createAsyncThunk<
  Book,
  BookCreateDTO,
  { rejectValue: ErrorResponse }
>("books/createBook", async (book, { rejectWithValue }) => {
  try {
    return await bookService.createBook(book);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

export const updateBook = createAsyncThunk<
  Book,
  { id: string; book: BookCreateDTO },
  { rejectValue: ErrorResponse }
>("books/updateBook", async ({ id, book }, { rejectWithValue }) => {
  try {
    return await bookService.updateBook(id, book);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

export const deleteBook = createAsyncThunk<
  void,
  string,
  { rejectValue: ErrorResponse }
>("books/deleteBook", async (id, { rejectWithValue }) => {
  try {
    await bookService.deleteBook(id);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

export const searchBooks = createAsyncThunk<
  PaginatedResponse<Book>,
  { title: string; params?: BookFilterParams },
  { rejectValue: ErrorResponse }
>("books/searchBooks", async ({ title, params }, { rejectWithValue }) => {
  try {
    return await bookService.searchBooks(title, params);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch books",
          status: 500,
          error: "Unknown Error",
          path: "/books",
          timestamp: new Date().toISOString(),
        };
      })

      // Fetch Book by ID
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch book",
          status: 500,
          error: "Unknown Error",
          path: "/books",
          timestamp: new Date().toISOString(),
        };
      })

      // Create Book
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to create book",
          status: 500,
          error: "Unknown Error",
          path: "/books",
          timestamp: new Date().toISOString(),
        };
      })

      // Update Book
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex(
          (book) => book.id === action.payload.id
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        if (state.selectedBook?.id === action.payload.id) {
          state.selectedBook = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to update book",
          status: 500,
          error: "Unknown Error",
          path: "/books",
          timestamp: new Date().toISOString(),
        };
      })

      // Delete Book
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book.id !== action.meta.arg);
        if (state.selectedBook?.id === action.meta.arg) {
          state.selectedBook = null;
        }
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to delete book",
          status: 500,
          error: "Unknown Error",
          path: "/books",
          timestamp: new Date().toISOString(),
        };
      })

      // Search Books
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to search books",
          status: 500,
          error: "Unknown Error",
          path: "/books",
          timestamp: new Date().toISOString(),
        };
      });
  },
});

export const { clearSelectedBook, clearError, setPageSize } = bookSlice.actions;
export default bookSlice.reducer;
