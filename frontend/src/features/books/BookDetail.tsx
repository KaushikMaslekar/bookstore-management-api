import React from "react";
import { useParams } from "react-router-dom";
import { Paper, Typography } from "@mui/material";

const BookDetail: React.FC = () => {
  const { id } = useParams();
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Book Detail</Typography>
      <Typography variant="body2">Book ID: {id}</Typography>
    </Paper>
  );
};

export default BookDetail;
