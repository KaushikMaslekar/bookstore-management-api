// Types
export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  type: "select" | "text" | "number";
  label: string;
  value: string | number;
  options?: FilterOption[];
  placeholder?: string;
}
