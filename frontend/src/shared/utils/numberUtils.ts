// Utility function for formatting numbers
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

// Utility function for formatting currency
export const formatCurrency = (
  amount: number,
  currency: string = "INR"
): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Utility function for formatting percentages
export const formatPercentage = (
  value: number,
  decimals: number = 0
): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Utility function for rounding numbers
export const roundTo = (num: number, decimals: number): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Utility function for clamping a number between min and max
export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

// Utility function for calculating percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Utility function for checking if a number is in range
export const isInRange = (num: number, min: number, max: number): boolean => {
  return num >= min && num <= max;
};
