package com.kaushik.restapis.bookstore_management.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.kaushik.restapis.bookstore_management.entity.Book;

public interface BookRepository extends MongoRepository<Book, String> {

    //Find by International Standard Book Number
    Optional<Book> findByIsbn(String isbn);

    //Find by title containing (case insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);

    //Find by title containing with pagination
    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    //Find by author id
    List<Book> findByAuthorId(String authorId);

    //Find by author id with pagination
    Page<Book> findByAuthorId(String authorId, Pageable pageable);

    //Find by category id
    List<Book> findByCategoryId(String categoryId);

    //Find by category id with pagination
    Page<Book> findByCategoryId(String categoryId, Pageable pageable);

    //Find by price range
    List<Book> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    //Find by stock quantity greater than
    List<Book> findByStockQuantityGreaterThan(Integer stockQuantity);

    //Find by stock quantity less than or equal
    List<Book> findByStockQuantityLessThanEqual(Integer stockQuantity);

    //Complex query for advanced search
    @Query("{$and: ["
            + "{$or: [{title: {$regex: ?0, $options: 'i'}}, {?0: null}]},"
            + "{$or: [{'author.$id': ?1}, {?1: null}]},"
            + "{$or: [{'category.$id': ?2}, {?2: null}]},"
            + "{$or: [{price: {$gte: ?3}}, {?3: null}]},"
            + "{$or: [{price: {$lte: ?4}}, {?4: null}]}"
            + "]}")
    Page<Book> searchBooks(String title,
            String authorId,
            String categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable);

    //Check book existence by isbn 
    boolean existsByIsbn(String isbn);

    //Check book by publication year
    List<Book> findByPublicationYear(Integer year);

    //Find book by language
    List<Book> findByLanguageIgnoreCase(String language);
}
