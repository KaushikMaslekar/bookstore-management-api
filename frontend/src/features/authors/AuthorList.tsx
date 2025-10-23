import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchAuthors, deleteAuthor } from "./authorsSlice";
import type { Author, AuthorFilterParams } from "../../types";
import {
  SearchBar,
  Pagination,
  ErrorDisplay,
  LoadingSpinner,
} from "../../shared/components";

export const AuthorList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authors, loading, error, totalPages, currentPage, pageSize } =
    useAppSelector((state) => state.authors);

  const [filters, setFilters] = useState<AuthorFilterParams>({
    page: 0,
    size: pageSize,
    sortBy: "name",
    sortDir: "asc",
  });

  useEffect(() => {
    dispatch(fetchAuthors(filters));
  }, [dispatch, filters]);

  const handleSearch = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      name: query || undefined,
      page: 0,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilters((prev) => ({
      ...prev,
      size,
      page: 0,
    }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      await dispatch(deleteAuthor(id));
      dispatch(fetchAuthors(filters));
    }
  };

  if (loading) return <LoadingSpinner />;

  const hasAuthors = authors && authors.length > 0;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Authors
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/authors/new")}
        >
          Add Author
        </Button>
      </Box>

      {error && <ErrorDisplay error={error} />}

      <SearchBar
        onSearch={handleSearch}
        placeholder="Search authors by name..."
      />

      <Paper sx={{ mt: 3 }}>
        <List>
          {hasAuthors &&
            authors.map((author: Author) => (
              <ListItem key={author.id} divider>
                <ListItemText
                  primary={author.name}
                  secondary={author.email}
                  onClick={() => navigate(`/authors/${author.id}`)}
                  sx={{ cursor: "pointer" }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => navigate(`/authors/${author.id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(author.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
      </Paper>

      {!loading && !hasAuthors && (
        <Paper sx={{ p: 3, textAlign: "center", mt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No authors found
          </Typography>
        </Paper>
      )}

      {hasAuthors && (
        <Box sx={{ mt: 3 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </Box>
      )}
    </Box>
  );
};
