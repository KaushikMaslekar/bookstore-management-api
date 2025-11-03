// Utility functions for string operations

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts string to title case (each word capitalized)
 */
export const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Truncates a string to specified length with ellipsis
 */
export const truncate = (str: string, maxLength: number): string => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
};

/**
 * Removes all whitespace from a string
 */
export const removeWhitespace = (str: string): string => {
  return str.replace(/\s+/g, "");
};

/**
 * Normalizes whitespace (multiple spaces to single space)
 */
export const normalizeWhitespace = (str: string): string => {
  return str.trim().replace(/\s+/g, " ");
};

/**
 * Checks if string is empty or only whitespace
 */
export const isBlank = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Checks if string has content
 */
export const isNotBlank = (str: string | null | undefined): boolean => {
  return !isBlank(str);
};

/**
 * Returns string or default value if empty
 */
export const defaultIfBlank = (
  str: string | null | undefined,
  defaultValue: string
): string => {
  return isBlank(str) ? defaultValue : str!;
};

/**
 * Masks a string showing only first and last few characters
 */
export const maskString = (str: string, visibleChars: number = 2): string => {
  if (!str || str.length <= visibleChars * 2) return str;
  const start = str.substring(0, visibleChars);
  const end = str.substring(str.length - visibleChars);
  const maskLength = str.length - visibleChars * 2;
  return `${start}${"*".repeat(maskLength)}${end}`;
};

/**
 * Generates initials from a name
 */
export const getInitials = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Slugifies a string (converts to URL-friendly format)
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Extracts numbers from a string
 */
export const extractNumbers = (str: string): string => {
  return str.replace(/\D/g, "");
};

/**
 * Checks if string contains only digits
 */
export const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str);
};

/**
 * Checks if string contains only letters
 */
export const isAlpha = (str: string): boolean => {
  return /^[a-zA-Z]+$/.test(str);
};

/**
 * Checks if string contains only letters and numbers
 */
export const isAlphanumeric = (str: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates ISBN format
 */
export const isValidISBN = (isbn: string): boolean => {
  const cleanISBN = isbn.replace(/-/g, "");
  return /^\d{10}$/.test(cleanISBN) || /^\d{13}$/.test(cleanISBN);
};

/**
 * Highlights search terms in text
 */
export const highlightText = (
  text: string,
  searchTerm: string,
  className: string = "highlight"
): string => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, `<span class="${className}">$1</span>`);
};

/**
 * Pluralizes a word based on count
 */
export const pluralize = (
  word: string,
  count: number,
  plural?: string
): string => {
  if (count === 1) return word;
  return plural || `${word}s`;
};

/**
 * Formats a number with ordinal suffix (1st, 2nd, 3rd, etc.)
 */
export const toOrdinal = (num: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};
