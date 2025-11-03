package com.kaushik.restapis.bookstore_management.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Utility class for validation operations. Provides common validation methods
 * for business logic.
 *
 * @author Teammate Name
 * @version 1.0
 */
public class ValidationUtils {

    private ValidationUtils() {
        // Private constructor to prevent instantiation
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Validates that an object is not null.
     *
     * @param obj the object to validate
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if object is null
     */
    public static void requireNonNull(Object obj, String fieldName) {
        if (obj == null) {
            throw new IllegalArgumentException(fieldName + " cannot be null");
        }
    }

    /**
     * Validates that a string is not null or empty.
     *
     * @param str the string to validate
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if string is null or empty
     */
    public static void requireNonEmpty(String str, String fieldName) {
        if (str == null || str.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " cannot be null or empty");
        }
    }

    /**
     * Validates that a string is not blank (null, empty, or whitespace only).
     *
     * @param str the string to validate
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if string is blank
     */
    public static void requireNonBlank(String str, String fieldName) {
        if (str == null || str.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " cannot be blank");
        }
    }

    /**
     * Validates that a collection is not null or empty.
     *
     * @param collection the collection to validate
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if collection is null or empty
     */
    public static void requireNonEmpty(Collection<?> collection, String fieldName) {
        if (collection == null || collection.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " cannot be null or empty");
        }
    }

    /**
     * Validates that a number is positive (greater than 0).
     *
     * @param number the number to validate
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if number is not positive
     */
    public static void requirePositive(Number number, String fieldName) {
        if (number == null || number.doubleValue() <= 0) {
            throw new IllegalArgumentException(fieldName + " must be positive");
        }
    }

    /**
     * Validates that a number is non-negative (greater than or equal to 0).
     *
     * @param number the number to validate
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if number is negative
     */
    public static void requireNonNegative(Number number, String fieldName) {
        if (number == null || number.doubleValue() < 0) {
            throw new IllegalArgumentException(fieldName + " cannot be negative");
        }
    }

    /**
     * Validates that a number is within a specified range.
     *
     * @param number the number to validate
     * @param min the minimum value (inclusive)
     * @param max the maximum value (inclusive)
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if number is outside range
     */
    public static void requireInRange(Number number, double min, double max, String fieldName) {
        if (number == null) {
            throw new IllegalArgumentException(fieldName + " cannot be null");
        }
        double value = number.doubleValue();
        if (value < min || value > max) {
            throw new IllegalArgumentException(
                    fieldName + " must be between " + min + " and " + max + " (got " + value + ")"
            );
        }
    }

    /**
     * Validates that a string's length is within a specified range.
     *
     * @param str the string to validate
     * @param minLength the minimum length (inclusive)
     * @param maxLength the maximum length (inclusive)
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if string length is outside range
     */
    public static void requireLengthInRange(String str, int minLength, int maxLength, String fieldName) {
        if (str == null) {
            throw new IllegalArgumentException(fieldName + " cannot be null");
        }
        int length = str.length();
        if (length < minLength || length > maxLength) {
            throw new IllegalArgumentException(
                    fieldName + " length must be between " + minLength + " and " + maxLength
                    + " characters (got " + length + ")"
            );
        }
    }

    /**
     * Validates that a string matches a specified pattern.
     *
     * @param str the string to validate
     * @param pattern the regex pattern to match
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if string doesn't match pattern
     */
    public static void requirePattern(String str, String pattern, String fieldName) {
        if (str == null || !str.matches(pattern)) {
            throw new IllegalArgumentException(fieldName + " does not match required pattern");
        }
    }

    /**
     * Validates email format.
     *
     * @param email the email to validate
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if email format is invalid
     */
    public static void requireValidEmail(String email, String fieldName) {
        String emailPattern = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        if (email == null || !email.matches(emailPattern)) {
            throw new IllegalArgumentException(fieldName + " must be a valid email address");
        }
    }

    /**
     * Validates ISBN format (10 or 13 digits with optional hyphens).
     *
     * @param isbn the ISBN to validate
     * @param fieldName the name of the field (for error message)
     * @throws IllegalArgumentException if ISBN format is invalid
     */
    public static void requireValidISBN(String isbn, String fieldName) {
        if (isbn == null) {
            throw new IllegalArgumentException(fieldName + " cannot be null");
        }
        String cleanISBN = isbn.replaceAll("-", "");
        if (!cleanISBN.matches("\\d{10}") && !cleanISBN.matches("\\d{13}")) {
            throw new IllegalArgumentException(fieldName + " must be a valid ISBN (10 or 13 digits)");
        }
    }

    /**
     * Validates that a condition is true.
     *
     * @param condition the condition to validate
     * @param message the error message if condition is false
     * @throws IllegalArgumentException if condition is false
     */
    public static void requireTrue(boolean condition, String message) {
        if (!condition) {
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Validates that a condition is false.
     *
     * @param condition the condition to validate
     * @param message the error message if condition is true
     * @throws IllegalArgumentException if condition is true
     */
    public static void requireFalse(boolean condition, String message) {
        if (condition) {
            throw new IllegalArgumentException(message);
        }
    }

    /**
     * Validates multiple conditions and collects all errors. Useful for
     * validating entire objects with multiple fields.
     *
     * @param validations list of validation suppliers
     * @throws IllegalArgumentException with combined error messages if any
     * validation fails
     */
    public static void validateAll(List<ValidationSupplier> validations) {
        List<String> errors = new ArrayList<>();

        for (ValidationSupplier validation : validations) {
            try {
                validation.validate();
            } catch (IllegalArgumentException e) {
                errors.add(e.getMessage());
            }
        }

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Validation failed: " + String.join("; ", errors));
        }
    }

    /**
     * Functional interface for validation suppliers.
     */
    @FunctionalInterface
    public interface ValidationSupplier {

        void validate() throws IllegalArgumentException;
    }
}
