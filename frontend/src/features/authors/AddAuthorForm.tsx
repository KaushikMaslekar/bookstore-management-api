import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { createAuthor } from "./authorsSlice";
import type { AuthorCreateDTO } from "../../types";
import { ErrorDisplay } from "../../shared/components";

export const AddAuthorForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.authors);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthorCreateDTO>({
    defaultValues: {
      name: "",
      email: "",
      biography: "",
    },
  });

  const onSubmit = async (data: AuthorCreateDTO) => {
    try {
      await dispatch(createAuthor(data)).unwrap();
      navigate("/authors");
    } catch (err) {
      // Error is handled by the Redux state
      console.error("Failed to create author:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Author
      </Typography>

      {error && <ErrorDisplay error={error} />}

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  type="email"
                />
              )}
            />

            <Controller
              name="biography"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Biography"
                  fullWidth
                  multiline
                  rows={4}
                />
              )}
            />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => navigate("/authors")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Creating..." : "Create Author"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
