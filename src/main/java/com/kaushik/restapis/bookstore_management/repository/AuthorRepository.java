// filepath: d:\Spring Boot\bookstore-management\src\main\java\com\kaushik\restapis\bookstore_management\repository\AuthorRepository.java
package com.kaushik.restapis.bookstore_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kaushik.restapis.bookstore_management.entity.Author;

public interface AuthorRepository extends JpaRepository<Author, Long> {

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
    @Query("SELECT a FROM Author a JOIN a.books b GROUP BY a.id HAVING COUNT(b) > :bookCount")
    List<Author> findAuthorsWithMoreThanBooks(@Param("bookCount") Long bookCount);

    //Find all nationalities
    @Query("SELECT DISTINCT a.nationality FROM Author a WHERE a.nationality IS NOT NULL ORDER BY a.nationality")
    List<String> findAllNationalities();
}
