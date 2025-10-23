import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PAGE_SIZES = [10, 20, 50, 100];

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 2,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          displayEmpty
        >
          {PAGE_SIZES.map((size) => (
            <MenuItem key={size} value={size}>
              {size} per page
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ButtonGroup>
        <Button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          title="First Page"
        >
          <FirstPage />
        </Button>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          title="Previous Page"
        >
          <ChevronLeft />
        </Button>
        <Button disabled>
          Page {currentPage + 1} of {totalPages}
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          title="Next Page"
        >
          <ChevronRight />
        </Button>
        <Button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          title="Last Page"
        >
          <LastPage />
        </Button>
      </ButtonGroup>
    </Box>
  );
};
