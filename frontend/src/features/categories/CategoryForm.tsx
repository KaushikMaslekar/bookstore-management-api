import React from "react";
// ...existing code...
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { createCategory, updateCategory } from "./categoriesSlice";
import type { Category } from "../../types";

interface CategoryFormData {
  name: string;
  description: string;
}

interface CategoryFormProps {
  category?: Category | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  open,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.categories);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (category) {
        await dispatch(updateCategory({ id: category.id, ...data })).unwrap();
      } else {
        await dispatch(createCategory(data)).unwrap();
      }
      onSuccess();
      reset();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  return (
    <div
      className={`modal fade ${open ? "show d-block" : ""}`}
      tabIndex={-1}
      role="dialog"
      style={{ background: open ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {category ? "Edit Category" : "Add New Category"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Category name is required" }}
                  render={({ field }) => (
                    <>
                      <label className="form-label fw-semibold">
                        Category Name
                      </label>
                      <input
                        {...field}
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        placeholder="Enter category name"
                        autoFocus
                      />
                      <div className="invalid-feedback">
                        {errors.name?.message || "Enter a unique category name"}
                      </div>
                    </>
                  )}
                />
              </div>
              <div className="mb-3">
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <>
                      <label className="form-label fw-semibold">
                        Description
                      </label>
                      <textarea
                        {...field}
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        rows={3}
                        placeholder="Provide a clear description of this category"
                      />
                      <div className="invalid-feedback">
                        {errors.description?.message ||
                          "Provide a clear description of this category"}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                {category ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
