package com.kaushik.restapis.bookstore_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.kaushik.restapis.bookstore_management.entity.Category;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {

    // Check if category exists by name (case insensitive)
    boolean existsByNameIgnoreCase(String name);

    // Find category by name (case insensitive)
    Optional<Category> findByNameIgnoreCase(String name);

    // Find categories by name containing (case insensitive)
    List<Category> findByNameContainingIgnoreCase(String name);

    // Find categories by name containing with pagination
    Page<Category> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("{ 'books': { $exists: true, $ne: [] }, $expr: { $gt: [ { $size: '$books' }, ?0 ] } }")
    List<Category> findCategoriesWithBooks(Integer bookCount);
}
