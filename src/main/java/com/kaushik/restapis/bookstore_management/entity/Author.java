package com.kaushik.restapis.bookstore_management.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Document(collection = "authors")
public class Author {

    @Id
    private String id;

    @NotBlank(message = "Author name is required")
    @Size(min = 2, max = 100, message = "Author name must be between 2 and 100 characters")
    @Field("name")
    private String name;

    @Size(max = 1000, message = "Bio cannot exceed 1000 characters")
    @Field("bio")
    private String bio;

    @Size(max = 50, message = "Nationality cannot exceed 50 characters")
    @Field("nationality")
    private String nationality;

    @DBRef
    private List<Book> books;

    public Author() {

    }

    public Author(String name, String bio, String nationality) {
        this.name = name;
        this.bio = bio;
        this.nationality = nationality;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }
}
