import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { fetchCategories, deleteCategory } from "./categoriesSlice";
import { CategoryForm } from "./CategoryForm";
import type { Category } from "../../types";
import { ErrorDisplay, LoadingSpinner } from "../../shared/components";
import { ConfirmationDialog } from "../../shared/components/ConfirmationDialog";

export const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(
    (state) => state.categories
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    categoryId: string | null;
    categoryName: string;
  }>({
    open: false,
    categoryId: null,
    categoryName: "",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (categoryId: string, categoryName: string) => {
    setDeleteDialog({
      open: true,
      categoryId,
      categoryName,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.categoryId) {
      await dispatch(deleteCategory(deleteDialog.categoryId));
      setDeleteDialog({
        open: false,
        categoryId: null,
        categoryName: "",
      });
      dispatch(fetchCategories());
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Categories
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage book categories and classifications
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            height: { xs: 48, sm: 40 },
          }}
        >
          Add Category
        </Button>
      </Box>

      {error && <ErrorDisplay error={error} />}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Books Count</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category: Category) => (
              <TableRow key={category.id} hover>
                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.booksCount || 0}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit category">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(category)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete category">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(category.id, category.name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ py: 4 }}
                  >
                    No categories found. Click "Add Category" to create one.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {isFormOpen && (
        <CategoryForm
          category={selectedCategory}
          open={isFormOpen}
          onClose={handleCloseForm}
          onSuccess={() => {
            handleCloseForm();
            dispatch(fetchCategories());
          }}
        />
      )}

      <ConfirmationDialog
        open={deleteDialog.open}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteDialog.categoryName}"? This will affect all books in this category.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteDialog({ open: false, categoryId: null, categoryName: "" })
        }
        severity="error"
      />
    </Box>
  );
};

export default CategoryList;
