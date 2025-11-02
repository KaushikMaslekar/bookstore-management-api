package com.kaushik.restapis.bookstore_management.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Document(collection = "books")
public class Book {

    @Id
    private String id;

    @NotNull
    @Field("title")
    private String title;

    @NotNull
    @Indexed(unique = true)
    @Field("isbn")
    private String isbn;

    @Field("publication_year")
    private Integer publicationYear;

    @NotNull
    @Field("price")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    @Field("stock_quantity")
    private Integer stockQuantity;

    @Field("pages")
    private Integer pages;

    @Field("language")
    private String language;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    @DBRef
    private Author author;

    @DBRef
    private Category category;

    @org.springframework.data.mongodb.core.mapping.Field("embedding")
    private java.util.List<Double> embedding;

    @org.springframework.data.mongodb.core.mapping.Field("embedding_updated_at")
    private java.time.LocalDateTime embeddingUpdatedAt;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    @Field("description")
    private String description;

    public Book() {
    }

    public Book(String title, String isbn, String description, BigDecimal price, Integer stockQuantity, Author author, Category category) {
        this.title = title;
        this.isbn = isbn;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.author = author;
        this.category = category;
    }

    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Integer getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(Integer publicationYear) {
        this.publicationYear = publicationYear;
    }

    public Integer getPages() {
        return pages;
    }

    public void setPages(Integer pages) {
        this.pages = pages;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public java.util.List<Double> getEmbedding() {
        return embedding;
    }

    public void setEmbedding(java.util.List<Double> embedding) {
        this.embedding = embedding;
    }

    public java.time.LocalDateTime getEmbeddingUpdatedAt() {
        return embeddingUpdatedAt;
    }

    public void setEmbeddingUpdatedAt(java.time.LocalDateTime embeddingUpdatedAt) {
        this.embeddingUpdatedAt = embeddingUpdatedAt;
    }
}
