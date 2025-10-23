// filepath: d:\Spring Boot\bookstore-management\src\main\java\com\kaushik\restapis\bookstore_management\repository\AuthorRepository.java
package com.kaushik.restapis.bookstore_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.kaushik.restapis.bookstore_management.entity.Author;

public interface AuthorRepository extends MongoRepository<Author, String> {

    // Check if author exists by name (case insensitive)
    boolean existsByNameIgnoreCase(String name);

    // Find By name 
    Optional<Author> findByNameIgnoreCase(String name);

    //Find author containing name (case insensitive)
    List<Author> findByNameContainingIgnoreCase(String name);

    //Find by nationality
    List<Author> findByNationalityIgnoreCase(String nationality);

    //Find authors by pagination
    Page<Author> findByNameContainingIgnoreCase(String name, Pageable pageable);

    //Custom query to find authors with book count
    @Query(value = "{$expr: {$gt: [{$size: '$books'}, ?0]}}")
    List<Author> findAuthorsWithMoreThanBooks(Integer bookCount);

    //Find all nationalities
    @Query(value = "{nationality: {$exists: true, $ne: null}}", fields = "{nationality: 1}")
    List<String> findAllNationalities();
}
