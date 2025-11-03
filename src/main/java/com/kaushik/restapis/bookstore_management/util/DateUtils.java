package com.kaushik.restapis.bookstore_management.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Utility class for date and time operations. Provides common date formatting
 * and manipulation methods.
 *
 * @author Teammate Name
 * @version 1.0
 */
public class DateUtils {

    private static final DateTimeFormatter DEFAULT_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DEFAULT_DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DISPLAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");
    private static final DateTimeFormatter DISPLAY_DATETIME_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm:ss");

    private DateUtils() {
        // Private constructor to prevent instantiation
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Formats a LocalDate to default format (yyyy-MM-dd).
     *
     * @param date the date to format
     * @return formatted date string
     */
    public static String formatDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DEFAULT_DATE_FORMATTER);
    }

    /**
     * Formats a LocalDateTime to default format (yyyy-MM-dd HH:mm:ss).
     *
     * @param dateTime the datetime to format
     * @return formatted datetime string
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DEFAULT_DATETIME_FORMATTER);
    }

    /**
     * Formats a LocalDate to display format (MMM dd, yyyy). Example: Nov 03,
     * 2025
     *
     * @param date the date to format
     * @return formatted date string for display
     */
    public static String formatDateForDisplay(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DISPLAY_DATE_FORMATTER);
    }

    /**
     * Formats a LocalDateTime to display format (MMM dd, yyyy HH:mm:ss).
     * Example: Nov 03, 2025 10:30:45
     *
     * @param dateTime the datetime to format
     * @return formatted datetime string for display
     */
    public static String formatDateTimeForDisplay(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DISPLAY_DATETIME_FORMATTER);
    }

    /**
     * Parses a date string in default format (yyyy-MM-dd).
     *
     * @param dateStr the date string to parse
     * @return LocalDate object
     * @throws java.time.format.DateTimeParseException if the string cannot be
     * parsed
     */
    public static LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        return LocalDate.parse(dateStr, DEFAULT_DATE_FORMATTER);
    }

    /**
     * Parses a datetime string in default format (yyyy-MM-dd HH:mm:ss).
     *
     * @param dateTimeStr the datetime string to parse
     * @return LocalDateTime object
     * @throws java.time.format.DateTimeParseException if the string cannot be
     * parsed
     */
    public static LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.trim().isEmpty()) {
            return null;
        }
        return LocalDateTime.parse(dateTimeStr, DEFAULT_DATETIME_FORMATTER);
    }

    /**
     * Checks if a date is in the past.
     *
     * @param date the date to check
     * @return true if date is before today, false otherwise
     */
    public static boolean isPast(LocalDate date) {
        if (date == null) {
            return false;
        }
        return date.isBefore(LocalDate.now());
    }

    /**
     * Checks if a date is in the future.
     *
     * @param date the date to check
     * @return true if date is after today, false otherwise
     */
    public static boolean isFuture(LocalDate date) {
        if (date == null) {
            return false;
        }
        return date.isAfter(LocalDate.now());
    }

    /**
     * Checks if a date is today.
     *
     * @param date the date to check
     * @return true if date is today, false otherwise
     */
    public static boolean isToday(LocalDate date) {
        if (date == null) {
            return false;
        }
        return date.isEqual(LocalDate.now());
    }

    /**
     * Gets the current date as a formatted string.
     *
     * @return current date in default format
     */
    public static String getCurrentDate() {
        return formatDate(LocalDate.now());
    }

    /**
     * Gets the current datetime as a formatted string.
     *
     * @return current datetime in default format
     */
    public static String getCurrentDateTime() {
        return formatDateTime(LocalDateTime.now());
    }

    /**
     * Calculates the number of days between two dates.
     *
     * @param startDate the start date
     * @param endDate the end date
     * @return number of days between the dates
     */
    public static long daysBetween(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
    }

    /**
     * Adds days to a date.
     *
     * @param date the base date
     * @param days number of days to add (can be negative)
     * @return new date with days added
     */
    public static LocalDate addDays(LocalDate date, long days) {
        if (date == null) {
            return null;
        }
        return date.plusDays(days);
    }

    /**
     * Adds months to a date.
     *
     * @param date the base date
     * @param months number of months to add (can be negative)
     * @return new date with months added
     */
    public static LocalDate addMonths(LocalDate date, long months) {
        if (date == null) {
            return null;
        }
        return date.plusMonths(months);
    }

    /**
     * Adds years to a date.
     *
     * @param date the base date
     * @param years number of years to add (can be negative)
     * @return new date with years added
     */
    public static LocalDate addYears(LocalDate date, long years) {
        if (date == null) {
            return null;
        }
        return date.plusYears(years);
    }

    /**
     * Gets the start of day for a given date.
     *
     * @param date the date
     * @return LocalDateTime at 00:00:00
     */
    public static LocalDateTime startOfDay(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.atStartOfDay();
    }

    /**
     * Gets the end of day for a given date.
     *
     * @param date the date
     * @return LocalDateTime at 23:59:59
     */
    public static LocalDateTime endOfDay(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.atTime(23, 59, 59);
    }
}
