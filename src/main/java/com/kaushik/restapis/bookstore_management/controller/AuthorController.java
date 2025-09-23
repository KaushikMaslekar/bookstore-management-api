// AuthorController
package com.kaushik.restapis.bookstore_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kaushik.restapis.bookstore_management.entity.Author;
import com.kaushik.restapis.bookstore_management.service.AuthorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/authors")
@CrossOrigin(origins = "*")
public class AuthorController {

    @Autowired
    private AuthorService authorService;

    // Create a new author
    @PostMapping("/create")
    public ResponseEntity<Author> createAuthor(@Valid @RequestBody Author author) {
        Author savedAuthor = authorService.createAuthor(author);
        return new ResponseEntity<>(savedAuthor, HttpStatus.CREATED);
    }

    // Get all authors
    @GetMapping("/all")
    public ResponseEntity<List<Author>> getAllAuthors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String nationality,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        if (nationality != null && !nationality.trim().isEmpty()) {
            List<Author> authors = authorService.getAuthorsByNationality(nationality);
            return ResponseEntity.ok(authors);
        } else if (search != null && !search.trim().isEmpty()) {
            if (page >= 0 && size > 0) {
                Sort sort = sortDir.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
                Pageable pageable = PageRequest.of(page, size, sort);
                Page<Author> authorPage = authorService.searchAuthorsByName(search, pageable);
                return ResponseEntity.ok(authorPage.getContent());
            } else {
                List<Author> authors = authorService.searchAuthorsByName(search);
                return ResponseEntity.ok(authors);
            }
        } else {
            if (page >= 0 && size > 0) {
                Sort sort = sortDir.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
                Pageable pageable = PageRequest.of(page, size, sort);
                Page<Author> authorPage = authorService.getAllAuthors(pageable);
                return ResponseEntity.ok(authorPage.getContent());
            } else {
                List<Author> authors = authorService.getAllAuthors();
                return ResponseEntity.ok(authors);
            }
        }
    }

    // Get author by id
    @GetMapping("/{id}")
    public ResponseEntity<Author> getAuthorById(@PathVariable Long id) {
        Author author = authorService.getAuthorById(id);
        return ResponseEntity.ok(author);
    }

    // Update author
    @PutMapping("/{id}")
    public ResponseEntity<Author> updateAuthor(@PathVariable Long id,
            @Valid @RequestBody Author authorDetails) {
        Author updatedAuthor = authorService.updateAuthor(id, authorDetails);
        return ResponseEntity.ok(updatedAuthor);
    }

    // Delete author
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.noContent().build();
    }

    // Search authors
    @GetMapping("/search")
    public ResponseEntity<List<Author>> searchAuthors(@RequestParam String name) {
        List<Author> authors = authorService.searchAuthorsByName(name);
        return ResponseEntity.ok(authors);
    }

    // Get all nationalities
    @GetMapping("/nationalities")
    public ResponseEntity<List<String>> getAllNationalities() {
        List<String> nationalities = authorService.getAllNationalities();
        return ResponseEntity.ok(nationalities);
    }
}
