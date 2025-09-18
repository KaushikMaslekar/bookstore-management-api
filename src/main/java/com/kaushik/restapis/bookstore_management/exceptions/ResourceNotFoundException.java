// filepath: d:\Spring Boot\bookstore-management\src\main\java\com\kaushik\restapis\bookstore_management\exceptions\ResourceNotFoundException.java
package com.kaushik.restapis.bookstore_management.exceptions;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
