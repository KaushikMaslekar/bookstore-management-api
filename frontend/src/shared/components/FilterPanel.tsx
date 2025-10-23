import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  filters: {
    [key: string]: {
      type: "select" | "text" | "number";
      label: string;
      value: string | number;
      options?: FilterOption[];
      placeholder?: string;
    };
  };
  onFilterChange: (filterKey: string, value: string | number) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleSelectChange =
    (filterKey: string) => (event: SelectChangeEvent) => {
      onFilterChange(filterKey, event.target.value);
    };

  const handleTextChange =
    (filterKey: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange(filterKey, event.target.value);
    };

  return (
    <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 1.5, sm: 2 },
          alignItems: "flex-start",
        }}
      >
        {Object.entries(filters).map(([key, filter]) => (
          <FormControl
            key={key}
            size="small"
            sx={{
              minWidth: filter.type === "number" ? 120 : "100%",
              width: "100%",
            }}
          >
            <InputLabel id={`${key}-label`}>{filter.label}</InputLabel>
            {filter.type === "select" && filter.options ? (
              <Select
                labelId={`${key}-label`}
                value={String(filter.value)}
                label={filter.label}
                onChange={handleSelectChange(key)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {filter.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <TextField
                type={filter.type}
                label={filter.label}
                value={filter.value}
                onChange={handleTextChange(key)}
                size="small"
                placeholder={filter.placeholder}
              />
            )}
          </FormControl>
        ))}
      </Box>
    </Paper>
  );
};
