import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authorService } from "../../services/api";
import type {
  Author,
  AuthorCreateDTO,
  PaginatedResponse,
  AuthorFilterParams,
  ErrorResponse,
} from "../../types";

interface AuthorState {
  authors: Author[];
  selectedAuthor: Author | null;
  loading: boolean;
  error: ErrorResponse | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

const initialState: AuthorState = {
  authors: [],
  selectedAuthor: null,
  loading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  pageSize: 10,
};

// Async Thunks
export const fetchAuthors = createAsyncThunk<
  PaginatedResponse<Author>,
  AuthorFilterParams | undefined,
  { rejectValue: ErrorResponse }
>("authors/fetchAuthors", async (params, { rejectWithValue }) => {
  try {
    return await authorService.getAllAuthors(params);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

export const fetchAuthorById = createAsyncThunk<
  Author,
  string,
  { rejectValue: ErrorResponse }
>("authors/fetchAuthorById", async (id, { rejectWithValue }) => {
  try {
    return await authorService.getAuthorById(id);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

export const createAuthor = createAsyncThunk<
  Author,
  AuthorCreateDTO,
  { rejectValue: ErrorResponse }
>("authors/createAuthor", async (author, { rejectWithValue }) => {
  try {
    return await authorService.createAuthor(author);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

export const updateAuthor = createAsyncThunk<
  Author,
  { id: string; author: AuthorCreateDTO },
  { rejectValue: ErrorResponse }
>("authors/updateAuthor", async ({ id, author }, { rejectWithValue }) => {
  try {
    return await authorService.updateAuthor(id, author);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

export const deleteAuthor = createAsyncThunk<
  void,
  string,
  { rejectValue: ErrorResponse }
>("authors/deleteAuthor", async (id, { rejectWithValue }) => {
  try {
    await authorService.deleteAuthor(id);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

export const searchAuthors = createAsyncThunk<
  PaginatedResponse<Author>,
  { name: string; params?: AuthorFilterParams },
  { rejectValue: ErrorResponse }
>("authors/searchAuthors", async ({ name, params }, { rejectWithValue }) => {
  try {
    return await authorService.searchAuthors(name, params);
  } catch (err) {
    return rejectWithValue(err as unknown as ErrorResponse);
  }
});

const authorSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {
    clearSelectedAuthor: (state) => {
      state.selectedAuthor = null;
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
      // Fetch Authors
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch authors",
          status: 500,
          error: "Unknown Error",
          path: "/authors",
          timestamp: new Date().toISOString(),
        };
      })

      // Fetch Author by ID
      .addCase(fetchAuthorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAuthor = action.payload;
      })
      .addCase(fetchAuthorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch author",
          status: 500,
          error: "Unknown Error",
          path: "/authors",
          timestamp: new Date().toISOString(),
        };
      })

      // Create Author
      .addCase(createAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = [...state.authors, action.payload];
      })
      .addCase(createAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to create author",
          status: 500,
          error: "Unknown Error",
          path: "/authors",
          timestamp: new Date().toISOString(),
        };
      })

      // Update Author
      .addCase(updateAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = state.authors.map((author) =>
          author.id === action.payload.id ? action.payload : author
        );
        state.selectedAuthor = action.payload;
      })
      .addCase(updateAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to update author",
          status: 500,
          error: "Unknown Error",
          path: "/authors",
          timestamp: new Date().toISOString(),
        };
      })

      // Delete Author
      .addCase(deleteAuthor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthor.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to delete author",
          status: 500,
          error: "Unknown Error",
          path: "/authors",
          timestamp: new Date().toISOString(),
        };
      })

      // Search Authors
      .addCase(searchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(searchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to search authors",
          status: 500,
          error: "Unknown Error",
          path: "/authors",
          timestamp: new Date().toISOString(),
        };
      });
  },
});

export const { clearSelectedAuthor, clearError, setPageSize } =
  authorSlice.actions;

export default authorSlice.reducer;
