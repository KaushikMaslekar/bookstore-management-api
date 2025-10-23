import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { fetchAuthors } from "../authorsSlice";
import type { AuthorFilterParams } from "../../../types";

export const useAuthors = (filters: AuthorFilterParams) => {
  const dispatch = useAppDispatch();
  const { authors, loading, error, totalPages, currentPage, pageSize } =
    useAppSelector((state) => state.authors);

  useEffect(() => {
    dispatch(fetchAuthors(filters));
  }, [dispatch, filters]);

  return {
    authors,
    loading,
    error,
    totalPages,
    currentPage,
    pageSize,
  };
};
