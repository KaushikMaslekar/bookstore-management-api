package com.kaushik.restapis.bookstore_management.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaushik.restapis.bookstore_management.dto.BookCreateDTO;
import com.kaushik.restapis.bookstore_management.dto.BookDTO;
import com.kaushik.restapis.bookstore_management.entity.Author;
import com.kaushik.restapis.bookstore_management.entity.Book;
import com.kaushik.restapis.bookstore_management.entity.Category;
import com.kaushik.restapis.bookstore_management.repository.BookRepository;

@Transactional
@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private AuthorService authorService;

    //Create a new book
    public BookDTO createBook(BookCreateDTO bookCreateDTO) {
        //check if ISBN already exists
        if (bookRepository.existsByIsbn(bookCreateDTO.getIsbn())) {
            throw new IllegalArgumentException("Book with ISBN " + bookCreateDTO.getIsbn() + " already exists.");
        }

        //get author and category
        Author author = authorService.getAuthorById(bookCreateDTO.getAuthorId());
        Category category = categoryService.getCategoryById(bookCreateDTO.getCategoryId());

        //create a book entity
        Book book = new Book();
        book.setTitle(bookCreateDTO.getTitle());
        book.setIsbn(bookCreateDTO.getIsbn());
        book.setDescription(bookCreateDTO.getDescription());
        book.setPrice(bookCreateDTO.getPrice());
        book.setStockQuantity(bookCreateDTO.getStockQuantity());
        book.setPublicationYear(bookCreateDTO.getPublicationYear());
        book.setPages(bookCreateDTO.getPages());
        book.setLanguage(bookCreateDTO.getLanguage());
        book.setAuthor(author);
        book.setCategory(category);

        Book savedBook = bookRepository.save(book);
        return convertToDTO(savedBook);
    }

    // Get all books
    @Transactional(readOnly = true)
    public List<BookDTO> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return books.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get books with pagination
    @Transactional(readOnly = true)
    public Page<BookDTO> getAllBooks(Pageable pageable) {
        Page<Book> books = bookRepository.findAll(pageable);
        return books.map(this::convertToDTO);
    }

    // Get book entity by id (for internal use)
    @Transactional(readOnly = true)
    public Book getBookEntityById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    // Update book
    public BookDTO updateBook(Long id, BookCreateDTO bookUpdateDTO) {
        Book book = getBookEntityById(id);

        // Check if new ISBN conflicts with existing book (excluding current one)
        if (!book.getIsbn().equals(bookUpdateDTO.getIsbn())
                && bookRepository.existsByIsbn(bookUpdateDTO.getIsbn())) {
            throw new IllegalArgumentException("Book with ISBN '" + bookUpdateDTO.getIsbn() + "' already exists");
        }

        // Get author and category
        Author author = authorService.getAuthorById(bookUpdateDTO.getAuthorId());
        Category category = categoryService.getCategoryById(bookUpdateDTO.getCategoryId());

        // Update book fields
        book.setTitle(bookUpdateDTO.getTitle());
        book.setIsbn(bookUpdateDTO.getIsbn());
        book.setDescription(bookUpdateDTO.getDescription());
        book.setPrice(bookUpdateDTO.getPrice());
        book.setStockQuantity(bookUpdateDTO.getStockQuantity());
        book.setPublicationYear(bookUpdateDTO.getPublicationYear());
        book.setPages(bookUpdateDTO.getPages());
        book.setLanguage(bookUpdateDTO.getLanguage());
        book.setAuthor(author);
        book.setCategory(category);

        Book savedBook = bookRepository.save(book);
        return convertToDTO(savedBook);
    }

    // Delete book
    public void deleteBook(Long id) {
        Book book = getBookEntityById(id);
        bookRepository.delete(book);
    }

    // Search books by title
    @Transactional(readOnly = true)
    public List<BookDTO> searchBooksByTitle(String title) {
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(title);
        return books.stream().map(this::convertToDTO).collect(Collectors.toList());// map to DTO
    }

    // Search books by title with pagination
    @Transactional(readOnly = true)
    public Page<BookDTO> searchBooksByTitle(String title, Pageable pageable) {
        Page<Book> books = bookRepository.findByTitleContainingIgnoreCase(title, pageable);
        return books.map(this::convertToDTO);
    }

    // Get books by author
    @Transactional(readOnly = true)
    public List<BookDTO> getBooksByAuthor(Long authorId) {
        List<Book> books = bookRepository.findByAuthorId(authorId);
        return books.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get books by author with pagination
    @Transactional(readOnly = true)
    public Page<BookDTO> getBooksByAuthor(Long authorId, Pageable pageable) {
        Page<Book> books = bookRepository.findByAuthorId(authorId, pageable);
        return books.map(this::convertToDTO);
    }

    // Get books by category
    @Transactional(readOnly = true)
    public List<BookDTO> getBooksByCategory(Long categoryId) {
        List<Book> books = bookRepository.findByCategoryId(categoryId);
        return books.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get books by category with pagination
    @Transactional(readOnly = true)
    public Page<BookDTO> getBooksByCategory(Long categoryId, Pageable pageable) {
        Page<Book> books = bookRepository.findByCategoryId(categoryId, pageable);
        return books.map(this::convertToDTO);
    }

    // Get books by price range
    @Transactional(readOnly = true)
    public List<BookDTO> getBooksByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<Book> books = bookRepository.findByPriceBetween(minPrice, maxPrice);
        return books.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get books with low stock
    @Transactional(readOnly = true)
    public List<BookDTO> getBooksWithLowStock(Integer stockThreshold) {
        List<Book> books = bookRepository.findByStockQuantityLessThanEqual(stockThreshold);
        return books.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Complex search
    @Transactional(readOnly = true)
    public Page<BookDTO> searchBooks(String title, Long authorId, Long categoryId,
            BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Page<Book> books = bookRepository.searchBooks(title, authorId, categoryId, minPrice, maxPrice, pageable);
        return books.map(this::convertToDTO);
    }

    // Update stock quantity
    public BookDTO updateBookStock(Long id, Integer newStockQuantity) {
        Book book = getBookEntityById(id);
        book.setStockQuantity(newStockQuantity);
        Book savedBook = bookRepository.save(book);
        return convertToDTO(savedBook);
    }

    // Get book by ISBN
    @Transactional(readOnly = true)
    public BookDTO getBookByIsbn(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new RuntimeException("Book not found with ISBN: " + isbn));
        return convertToDTO(book);
    }

    // Convert Book entity to BookDTO
    private BookDTO convertToDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setIsbn(book.getIsbn());
        dto.setDescription(book.getDescription());
        dto.setPrice(book.getPrice());
        dto.setStockQuantity(book.getStockQuantity());
        dto.setPublicationYear(book.getPublicationYear());
        dto.setPages(book.getPages());
        dto.setLanguage(book.getLanguage());
        dto.setCreatedAt(book.getCreatedAt());
        dto.setUpdatedAt(book.getUpdatedAt());
        dto.setAuthorName(book.getAuthor().getName());
        dto.setAuthorId(book.getAuthor().getId());
        dto.setCategoryName(book.getCategory().getName());
        dto.setCategoryId(book.getCategory().getId());
        return dto;
    }

    public BookDTO getBookById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getBookById'");
    }
}
