// Utility functions for date operations
import {
  format,
  parse,
  isValid,
  differenceInDays,
  addDays,
  addMonths,
  addYears,
} from "date-fns";

/**
 * Formats a date to a specified format
 */
export const formatDate = (
  date: Date | string,
  formatStr: string = "MMM dd, yyyy"
): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!isValid(dateObj)) return "";
    return format(dateObj, formatStr);
  } catch {
    return "";
  }
};

/**
 * Formats a date for display (e.g., "Nov 03, 2025")
 */
export const formatDateForDisplay = (date: Date | string): string => {
  return formatDate(date, "MMM dd, yyyy");
};

/**
 * Formats a date for API (ISO format)
 */
export const formatDateForAPI = (date: Date | string): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!isValid(dateObj)) return "";
    return dateObj.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

/**
 * Formats a datetime for display
 */
export const formatDateTime = (
  date: Date | string,
  formatStr: string = "MMM dd, yyyy HH:mm"
): string => {
  return formatDate(date, formatStr);
};

/**
 * Parses a date string
 */
export const parseDate = (
  dateStr: string,
  formatStr: string = "yyyy-MM-dd"
): Date | null => {
  try {
    const parsed = parse(dateStr, formatStr, new Date());
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Checks if a date is in the past
 */
export const isPast = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Checks if a date is in the future
 */
export const isFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj > new Date();
};

/**
 * Checks if a date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Gets the number of days between two dates
 */
export const daysBetween = (
  date1: Date | string,
  date2: Date | string
): number => {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;
  return differenceInDays(d2, d1);
};

/**
 * Adds days to a date
 */
export const addDaysToDate = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return addDays(dateObj, days);
};

/**
 * Adds months to a date
 */
export const addMonthsToDate = (date: Date | string, months: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return addMonths(dateObj, months);
};

/**
 * Adds years to a date
 */
export const addYearsToDate = (date: Date | string, years: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return addYears(dateObj, years);
};

/**
 * Gets a relative time string (e.g., "2 days ago", "in 3 hours")
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return `${Math.floor(seconds / 31536000)} years ago`;
};

/**
 * Gets the start of day
 */
export const startOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Gets the end of day
 */
export const endOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Validates if a date string is valid
 */
export const isValidDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return isValid(date);
};

/**
 * Gets the current date as a string
 */
export const getCurrentDate = (): string => {
  return formatDateForAPI(new Date());
};

/**
 * Gets the current datetime as a string
 */
export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};
