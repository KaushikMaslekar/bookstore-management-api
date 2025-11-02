package com.kaushik.restapis.bookstore_management.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaushik.restapis.bookstore_management.entity.Author;
import com.kaushik.restapis.bookstore_management.entity.Book;
import com.kaushik.restapis.bookstore_management.entity.Category;
import com.kaushik.restapis.bookstore_management.repository.AuthorRepository;
import com.kaushik.restapis.bookstore_management.repository.BookRepository;
import com.kaushik.restapis.bookstore_management.repository.CategoryRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookRepository bookRepository;

    // Insert 10 sample books (non-destructive: will not duplicate by ISBN)
    @PostMapping("/seed-ten-books")
    public ResponseEntity<Map<String, Object>> seedTenBooks() {
        List<Book> added = new ArrayList<>();

        String[][] samples = new String[][]{
            {"Intro to Algorithms - Pocket Edition", "Algorithms", "Thomas H. Cormen", "2009"},
            {"Practical Machine Learning", "Machine Learning", "Ian Goodfellow", "2018"},
            {"Networking Essentials", "Computer Networks", "W. Richard Stevens", "2012"},
            {"Modern Databases", "Databases", "Michael Stonebraker", "2017"},
            {"Operating Systems in Practice", "Operating Systems", "Andrew S. Tanenbaum", "2015"},
            {"Clean Architecture", "Software Engineering", "Robert C. Martin", "2017"},
            {"Hands-On Cloud", "Cloud Computing", "Tim Berners-Lee", "2020"},
            {"Security Principles", "Security", "Ross Anderson", "2014"},
            {"Compiler Construction Guide", "Compilers", "Alfred Aho", "2011"},
            {"Design Patterns Explained", "Software Engineering", "Erich Gamma", "2002"}
        };

        int isbnCounter = 9000;
        for (String[] s : samples) {
            String title = s[0];
            String categoryName = s[1];
            String authorName = s[2];
            int year = Integer.parseInt(s[3]);

            // find or create author by exact name (case-insensitive)
            Author author = authorRepository.findByNameIgnoreCase(authorName).orElse(null);
            if (author == null) {
                author = new Author(authorName, "Auto-seeded author", "Unknown");
                author = authorRepository.save(author);
            }

            // find or create category by name (case-insensitive)
            Category category = categoryRepository.findByNameIgnoreCase(categoryName).orElse(null);
            if (category == null) {
                category = new Category(categoryName, categoryName + " books");
                category = categoryRepository.save(category);
            }

            String isbn = "978-1-" + (isbnCounter++);
            // skip if ISBN already exists
            if (bookRepository.existsByIsbn(isbn)) {
                continue;
            }

            Book book = new Book(title, isbn, "Seeded: " + title, new BigDecimal("34.99"), 20, author, category);
            book.setPublicationYear(year);
            book.setPages(180);
            book.setLanguage("English");

            added.add(bookRepository.save(book));
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("added", added.size());
        resp.put("titles", added.stream().map(Book::getTitle).toArray());

        return ResponseEntity.ok(resp);
    }
}
