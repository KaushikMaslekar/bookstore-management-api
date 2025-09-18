package com.kaushik.restapis.bookstore_management.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kaushik.restapis.bookstore_management.entity.Book;

public interface BookRepository extends JpaRepository<Book, Long> {

    //Find by International Standard Book Number
    Optional<Book> findByIsbn(String isbn);

    //Find by title containing (case insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);

    //Find by title containing with pagination
    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    //Find by author id
    List<Book> findByAuthorId(Long authorId);

    //Find by author id with pagination
    Page<Book> findByAuthorId(Long authorId, Pageable pageable);

    //Find by category id
    List<Book> findByCategoryId(Long categoryId);

    //Find by category id with pagination
    Page<Book> findByCategoryId(Long categoryId, Pageable pageable);

    //Find by price range
    List<Book> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    //Find by stock quantity greater than
    List<Book> findByStockQuantityGreaterThan(Integer stockQuantity);

    //Find by stock quantity less than or equal
    List<Book> findByStockQuantityLessThanEqual(Integer stockQuantity);

    //Complex query for advanced search
    @Query("SELECT b FROM Book b WHERE "
            + "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND "
            + "(:authorId IS NULL OR b.author.id = :authorId) AND "
            + "(:categoryId IS NULL OR b.category.id = :categoryId) AND "
            + "(:minPrice IS NULL OR b.price >= :minPrice) AND "
            + "(:maxPrice IS NULL OR b.price <= :maxPrice)")
    Page<Book> searchBooks(@Param("title") String title,
            @Param("authorId") Long authorId,
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    //Check book existence by isbn 
    boolean existsByIsbn(String isbn);

    //Check book by publication year
    List<Book> findByPublicationYear(Integer year);

    //Find book by language
    List<Book> findByLanguageIgnoreCase(String language);
}
