import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import type { Book } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import type { Theme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { createBook } from "./booksSlice";
import type { BookCreateDTO } from "../../types";
import { ErrorDisplay } from "../../shared/components";

export const BookForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.books);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BookCreateDTO>({
    defaultValues: {
      title: "",
      isbn: "",
      description: "",
      price: 0,
      publicationYear: new Date().getFullYear(),
      stockQuantity: 0,
      pages: 0,
      language: "English",
      authorId: "",
      categoryId: "",
    },
  });

  const onSubmit = async (data: BookCreateDTO) => {
    try {
      await dispatch(createBook(data)).unwrap();
      navigate("/books");
    } catch (err) {
      // Error is handled by the Redux state
      console.error("Failed to create book:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Book
      </Typography>

      {error && <ErrorDisplay error={error} />}

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid component="div" container spacing={3}>
            <Grid component="div" item xs={12} md={6}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="isbn"
                control={control}
                rules={{ required: "ISBN is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ISBN"
                    fullWidth
                    error={!!errors.isbn}
                    helperText={errors.isbn?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Price"
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="stockQuantity"
                control={control}
                rules={{
                  required: "Stock quantity is required",
                  min: { value: 0, message: "Stock quantity must be positive" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Stock Quantity"
                    fullWidth
                    error={!!errors.stockQuantity}
                    helperText={errors.stockQuantity?.message}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="publicationYear"
                control={control}
                rules={{
                  required: "Publication year is required",
                  min: { value: 1000, message: "Invalid year" },
                  max: {
                    value: new Date().getFullYear(),
                    message: "Year cannot be in the future",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Publication Year"
                    fullWidth
                    error={!!errors.publicationYear}
                    helperText={errors.publicationYear?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="pages"
                control={control}
                rules={{
                  required: "Number of pages is required",
                  min: { value: 1, message: "Pages must be positive" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Pages"
                    fullWidth
                    error={!!errors.pages}
                    helperText={errors.pages?.message}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="language"
                control={control}
                rules={{ required: "Language is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.language}>
                    <InputLabel>Language</InputLabel>
                    <Select {...field} label="Language">
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Spanish">Spanish</MenuItem>
                      <MenuItem value="French">French</MenuItem>
                      <MenuItem value="German">German</MenuItem>
                      <MenuItem value="Chinese">Chinese</MenuItem>
                      <MenuItem value="Japanese">Japanese</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* TODO: Add Author and Category selects once those features are implemented */}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => navigate("/books")}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "Creating..." : "Create Book"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
