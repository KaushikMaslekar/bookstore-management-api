package com.kaushik.restapis.bookstore_management.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kaushik.restapis.bookstore_management.dto.BookCreateDTO;
import com.kaushik.restapis.bookstore_management.dto.BookDTO;
import com.kaushik.restapis.bookstore_management.service.BookService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookService bookService;

    // Create a new book
    @PostMapping
    public ResponseEntity<BookDTO> createBook(@Valid @RequestBody BookCreateDTO bookCreateDTO) {
        BookDTO savedBook = bookService.createBook(bookCreateDTO);
        return new ResponseEntity<>(savedBook, HttpStatus.CREATED);
    }

    // Get all books with various filters
    @GetMapping
    public ResponseEntity<List<BookDTO>> getAllBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long authorId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        if (title != null || authorId != null || categoryId != null || minPrice != null || maxPrice != null) {
            Page<BookDTO> bookPage = bookService.searchBooks(title, authorId, categoryId, minPrice, maxPrice, pageable);
            return ResponseEntity.ok(bookPage.getContent());
        } else {
            if (page >= 0 && size > 0) {
                Page<BookDTO> bookPage = bookService.getAllBooks(pageable);
                return ResponseEntity.ok(bookPage.getContent());
            } else {
                List<BookDTO> books = bookService.getAllBooks();
                return ResponseEntity.ok(books);
            }
        }
    }

    // Get book by id
    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
        BookDTO book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    // Get book by ISBN
    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<BookDTO> getBookByIsbn(@PathVariable String isbn) {
        BookDTO book = bookService.getBookByIsbn(isbn);
        return ResponseEntity.ok(book);
    }

    // Update book
    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(@PathVariable Long id,
            @Valid @RequestBody BookCreateDTO bookUpdateDTO) {
        BookDTO updatedBook = bookService.updateBook(id, bookUpdateDTO);
        return ResponseEntity.ok(updatedBook);
    }

    // Delete book
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    // Search books by title
    @GetMapping("/search")
    public ResponseEntity<List<BookDTO>> searchBooks(@RequestParam String title) {
        List<BookDTO> books = bookService.searchBooksByTitle(title);
        return ResponseEntity.ok(books);
    }

    // Get books by author
    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<BookDTO>> getBooksByAuthor(@PathVariable Long authorId) {
        List<BookDTO> books = bookService.getBooksByAuthor(authorId);
        return ResponseEntity.ok(books);
    }

    // Get books by category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BookDTO>> getBooksByCategory(@PathVariable Long categoryId) {
        List<BookDTO> books = bookService.getBooksByCategory(categoryId);
        return ResponseEntity.ok(books);
    }

    // Get books by price range
    @GetMapping("/price-range")
    public ResponseEntity<List<BookDTO>> getBooksByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<BookDTO> books = bookService.getBooksByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(books);
    }

    // Get books with low stock
    @GetMapping("/low-stock")
    public ResponseEntity<List<BookDTO>> getBooksWithLowStock(@RequestParam Integer threshold) {
        List<BookDTO> books = bookService.getBooksWithLowStock(threshold);
        return ResponseEntity.ok(books);
    }

    // Update book stock
    @PatchMapping("/{id}/stock")
    public ResponseEntity<BookDTO> updateBookStock(@PathVariable Long id,
            @RequestBody Map<String, Integer> stockData) {
        Integer newStock = stockData.get("stockQuantity");
        BookDTO updatedBook = bookService.updateBookStock(id, newStock);
        return ResponseEntity.ok(updatedBook);
    }
}
