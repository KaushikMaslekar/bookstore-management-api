package com.kaushik.restapis.bookstore_management.util;

import java.util.Collection;

/**
 * Utility class for string operations. Provides common string validation and
 * manipulation methods.
 *
 * @author Teammate Name
 * @version 1.0
 */
public class StringUtils {

    private StringUtils() {
        // Private constructor to prevent instantiation
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Checks if a string is null or empty.
     *
     * @param str the string to check
     * @return true if string is null or empty
     */
    public static boolean isEmpty(String str) {
        return str == null || str.isEmpty();
    }

    /**
     * Checks if a string is null, empty, or contains only whitespace.
     *
     * @param str the string to check
     * @return true if string is null, empty, or whitespace only
     */
    public static boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    /**
     * Checks if a string is not null and not empty.
     *
     * @param str the string to check
     * @return true if string has content
     */
    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }

    /**
     * Checks if a string is not blank.
     *
     * @param str the string to check
     * @return true if string has non-whitespace content
     */
    public static boolean isNotBlank(String str) {
        return !isBlank(str);
    }

    /**
     * Returns the string or a default value if null or empty.
     *
     * @param str the string to check
     * @param defaultValue the default value to return
     * @return the string if not empty, otherwise default value
     */
    public static String defaultIfEmpty(String str, String defaultValue) {
        return isEmpty(str) ? defaultValue : str;
    }

    /**
     * Returns the string or a default value if blank.
     *
     * @param str the string to check
     * @param defaultValue the default value to return
     * @return the string if not blank, otherwise default value
     */
    public static String defaultIfBlank(String str, String defaultValue) {
        return isBlank(str) ? defaultValue : str;
    }

    /**
     * Capitalizes the first letter of a string.
     *
     * @param str the string to capitalize
     * @return string with first letter capitalized
     */
    public static String capitalize(String str) {
        if (isEmpty(str)) {
            return str;
        }
        if (str.length() == 1) {
            return str.toUpperCase();
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    /**
     * Converts a string to title case (first letter of each word capitalized).
     *
     * @param str the string to convert
     * @return string in title case
     */
    public static String toTitleCase(String str) {
        if (isEmpty(str)) {
            return str;
        }

        String[] words = str.split("\\s+");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(capitalize(word.toLowerCase())).append(" ");
            }
        }

        return result.toString().trim();
    }

    /**
     * Truncates a string to a specified length.
     *
     * @param str the string to truncate
     * @param maxLength the maximum length
     * @return truncated string
     */
    public static String truncate(String str, int maxLength) {
        if (isEmpty(str) || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength);
    }

    /**
     * Truncates a string and adds ellipsis.
     *
     * @param str the string to truncate
     * @param maxLength the maximum length (including ellipsis)
     * @return truncated string with "..."
     */
    public static String truncateWithEllipsis(String str, int maxLength) {
        if (isEmpty(str) || str.length() <= maxLength) {
            return str;
        }
        if (maxLength <= 3) {
            return truncate(str, maxLength);
        }
        return str.substring(0, maxLength - 3) + "...";
    }

    /**
     * Removes all whitespace from a string.
     *
     * @param str the string to process
     * @return string without whitespace
     */
    public static String removeWhitespace(String str) {
        if (isEmpty(str)) {
            return str;
        }
        return str.replaceAll("\\s+", "");
    }

    /**
     * Normalizes whitespace in a string (converts multiple spaces to single
     * space).
     *
     * @param str the string to normalize
     * @return string with normalized whitespace
     */
    public static String normalizeWhitespace(String str) {
        if (isEmpty(str)) {
            return str;
        }
        return str.trim().replaceAll("\\s+", " ");
    }

    /**
     * Checks if a string contains only digits.
     *
     * @param str the string to check
     * @return true if string contains only digits
     */
    public static boolean isNumeric(String str) {
        if (isEmpty(str)) {
            return false;
        }
        return str.matches("\\d+");
    }

    /**
     * Checks if a string contains only letters.
     *
     * @param str the string to check
     * @return true if string contains only letters
     */
    public static boolean isAlpha(String str) {
        if (isEmpty(str)) {
            return false;
        }
        return str.matches("[a-zA-Z]+");
    }

    /**
     * Checks if a string contains only letters and digits.
     *
     * @param str the string to check
     * @return true if string contains only letters and digits
     */
    public static boolean isAlphanumeric(String str) {
        if (isEmpty(str)) {
            return false;
        }
        return str.matches("[a-zA-Z0-9]+");
    }

    /**
     * Reverses a string.
     *
     * @param str the string to reverse
     * @return reversed string
     */
    public static String reverse(String str) {
        if (isEmpty(str)) {
            return str;
        }
        return new StringBuilder(str).reverse().toString();
    }

    /**
     * Counts occurrences of a substring in a string.
     *
     * @param str the string to search in
     * @param substr the substring to count
     * @return number of occurrences
     */
    public static int countOccurrences(String str, String substr) {
        if (isEmpty(str) || isEmpty(substr)) {
            return 0;
        }

        int count = 0;
        int index = 0;

        while ((index = str.indexOf(substr, index)) != -1) {
            count++;
            index += substr.length();
        }

        return count;
    }

    /**
     * Masks a string, showing only first and last few characters. Useful for
     * displaying sensitive information like emails.
     *
     * @param str the string to mask
     * @param visibleChars number of characters to show at start and end
     * @return masked string
     */
    public static String mask(String str, int visibleChars) {
        if (isEmpty(str) || str.length() <= visibleChars * 2) {
            return str;
        }

        String start = str.substring(0, visibleChars);
        String end = str.substring(str.length() - visibleChars);
        int maskLength = str.length() - (visibleChars * 2);

        return start + "*".repeat(maskLength) + end;
    }

    /**
     * Validates if a string is a valid email format.
     *
     * @param email the email to validate
     * @return true if valid email format
     */
    public static boolean isValidEmail(String email) {
        if (isEmpty(email)) {
            return false;
        }
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }

    /**
     * Validates if a string is a valid ISBN format (10 or 13 digits with
     * optional hyphens).
     *
     * @param isbn the ISBN to validate
     * @return true if valid ISBN format
     */
    public static boolean isValidISBN(String isbn) {
        if (isEmpty(isbn)) {
            return false;
        }
        // Remove hyphens for validation
        String cleanISBN = isbn.replaceAll("-", "");
        // Check if it's 10 or 13 digits
        return cleanISBN.matches("\\d{10}") || cleanISBN.matches("\\d{13}");
    }

    /**
     * Joins a collection of strings with a delimiter.
     *
     * @param collection the collection to join
     * @param delimiter the delimiter to use
     * @return joined string
     */
    public static String join(Collection<?> collection, String delimiter) {
        if (collection == null || collection.isEmpty()) {
            return "";
        }
        return String.join(delimiter, collection.stream().map(Object::toString).toArray(String[]::new));
    }

    /**
     * Pads a string on the left with a specified character to reach a target
     * length.
     *
     * @param str the string to pad
     * @param length the target length
     * @param padChar the character to use for padding
     * @return padded string
     */
    public static String padLeft(String str, int length, char padChar) {
        if (str == null) {
            str = "";
        }
        if (str.length() >= length) {
            return str;
        }
        return String.valueOf(padChar).repeat(length - str.length()) + str;
    }

    /**
     * Pads a string on the right with a specified character to reach a target
     * length.
     *
     * @param str the string to pad
     * @param length the target length
     * @param padChar the character to use for padding
     * @return padded string
     */
    public static String padRight(String str, int length, char padChar) {
        if (str == null) {
            str = "";
        }
        if (str.length() >= length) {
            return str;
        }
        return str + String.valueOf(padChar).repeat(length - str.length());
    }
}
