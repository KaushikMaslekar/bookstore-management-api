import React, { useState, useCallback, useRef } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
  debounceMs = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const timeoutRef = useRef<number>();

  // Debounce the search callback
  const debouncedSearch = useCallback(
    (query: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        onSearch(query);
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="input-group input-group-lg">
      <span className="input-group-text bg-white border-end-0">
        <i className="bi bi-search"></i>
      </span>
      <input
        type="text"
        className="form-control border-start-0 ps-0"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        aria-label="search"
        style={{
          boxShadow: "none",
          borderLeft: "none",
        }}
      />
      {searchTerm && (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handleClear}
          aria-label="clear"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
};
