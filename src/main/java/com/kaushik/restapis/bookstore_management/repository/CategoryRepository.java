package com.kaushik.restapis.bookstore_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kaushik.restapis.bookstore_management.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Check if category exists by name (case insensitive)
    boolean existsByNameIgnoreCase(String name);

    // Find category by name (case insensitive) - ADD THIS IF MISSING
    Optional<Category> findByNameIgnoreCase(String name);

    // Find categories by name containing (case insensitive)
    List<Category> findByNameContainingIgnoreCase(String name);

    // Find categories by name containing with pagination
    Page<Category> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT DISTINCT c FROM Category c JOIN c.books b GROUP BY c.id HAVING COUNT(b) > :bookCount")
    List<Category> findCategoriesWithBooks(@Param("bookCount") Long bookCount);
}


/*Selects unique Category entities 
    From the Category table (aliased as 'c')
    Joins with the books collection in Category entity (aliased as 'b')
    Groups results by category ID
    Filters groups where the count of books is greater
 */
