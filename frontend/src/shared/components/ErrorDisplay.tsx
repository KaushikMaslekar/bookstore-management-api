import React from "react";
import { Alert, AlertTitle, Box } from "@mui/material";
import type { ErrorResponse } from "../../types";

interface ErrorDisplayProps {
  error: ErrorResponse;
  onClose?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onClose,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error" onClose={onClose}>
        <AlertTitle>Error {error.status}</AlertTitle>
        {error.message}
      </Alert>
    </Box>
  );
};
