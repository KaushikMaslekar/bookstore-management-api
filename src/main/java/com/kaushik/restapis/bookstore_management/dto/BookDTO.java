package com.kaushik.restapis.bookstore_management.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookDTO {

    private Long id;
    private String title;
    private String isbn;
    private String description;
    private BigDecimal price;
    private Integer publicationYear;
    private Integer stockQuantity;
    private Integer pages;
    private String language;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String authorName;
    private Long authorId;
    private String categoryName;
    private Long categoryId;

    public BookDTO() {

    }

    public BookDTO(Long id, String title, String isbn, String description,
            BigDecimal price, Integer publicationYear, Integer stockQuantity,
            Integer pages, String language, LocalDateTime createdAt, LocalDateTime updatedAt,
            String authorName, Long authorId, String categoryName, Long categoryId
    ) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.description = description;
        this.price = price;
        this.publicationYear = publicationYear;
        this.stockQuantity = stockQuantity;
        this.pages = pages;
        this.language = language;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.authorName = authorName;
        this.authorId = authorId;
        this.categoryName = categoryName;
        this.categoryId = categoryId;
    }

    //Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(Integer publicationYear) {
        this.publicationYear = publicationYear;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
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

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

}
