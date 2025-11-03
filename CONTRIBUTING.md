# Contributing to Bookstore Management System

Thank you for considering contributing to the Bookstore Management System! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment. Please:

- ✅ Be respectful and inclusive
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the project
- ✅ Show empathy towards other contributors
- ❌ Don't use offensive language or personal attacks
- ❌ Don't spam or troll
- ❌ Don't share others' private information

---

## How to Contribute

### Ways to Contribute

1. **Report Bugs** - Found a bug? Let us know!
2. **Suggest Features** - Have an idea? We'd love to hear it!
3. **Fix Issues** - Pick an issue from the issue tracker
4. **Improve Documentation** - Help make our docs better
5. **Write Tests** - Increase code coverage
6. **Code Review** - Review pull requests from other contributors

### Getting Started

1. **Fork the Repository**

   ```bash
   # Click the "Fork" button on GitHub
   # Then clone your fork
   git clone https://github.com/YOUR_USERNAME/bookstore-management-api.git
   cd bookstore-management-api
   ```

2. **Add Upstream Remote**

   ```bash
   git remote add upstream https://github.com/KaushikMaslekar/bookstore-management-api.git
   ```

3. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Make Your Changes**

   - Write your code
   - Add tests if applicable
   - Update documentation
   - Follow our code style guidelines

5. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

6. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill in the PR template
   - Wait for review

---

## Development Setup

### Prerequisites

- **Java 17** or higher
- **Maven 3.6+** or use included Maven Wrapper
- **MongoDB 7.0+**
- **Node.js 18+** and **npm 9+** (for frontend)
- **Git**
- **Hugging Face API Key** (for AI features)

### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/KaushikMaslekar/bookstore-management-api.git
   cd bookstore-management-api
   ```

2. **Configure Database**

   ```bash
   # Start MongoDB
   mongod --dbpath="path/to/data"
   ```

3. **Configure API Keys**

   ```bash
   # Copy example file
   cp src/main/resources/application-local.properties.example src/main/resources/application-local.properties

   # Edit and add your Hugging Face API key
   # huggingface.api.key=YOUR_KEY_HERE
   ```

4. **Build and Run**

   ```bash
   # Using Maven Wrapper (recommended)
   ./mvnw clean install
   ./mvnw spring-boot:run

   # Or using installed Maven
   mvn clean install
   mvn spring-boot:run
   ```

5. **Verify Backend**
   - Backend runs on: `http://localhost:8080`
   - Test endpoint: `http://localhost:8080/api/test`

### Frontend Setup

1. **Navigate to Frontend**

   ```bash
   cd frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Verify Frontend**
   - Frontend runs on: `http://localhost:5173`
   - Hot reload enabled

### Running Tests

```bash
# Backend tests
./mvnw test

# Frontend tests (when available)
cd frontend
npm test
```

---

## Code Style

### Backend (Java/Spring Boot)

#### General Principles

- Follow **Clean Code** principles
- Write self-documenting code
- Keep methods small and focused (< 20 lines ideally)
- Use meaningful variable and method names
- Avoid magic numbers - use constants

#### Naming Conventions

```java
// Classes: PascalCase
public class BookController { }

// Methods: camelCase
public BookDTO getBookById(String id) { }

// Variables: camelCase
private String bookTitle;

// Constants: UPPER_SNAKE_CASE
private static final int MAX_PAGE_SIZE = 100;

// Packages: lowercase
package com.kaushik.restapis.bookstore_management.service;
```

#### Code Formatting

- **Indentation**: 4 spaces (no tabs)
- **Line Length**: Max 120 characters
- **Braces**: Opening brace on same line
- **Blank Lines**: One blank line between methods

```java
// Good Example
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public BookDTO createBook(BookCreateDTO dto) {
        // Validation
        if (dto.getTitle() == null || dto.getTitle().isEmpty()) {
            throw new ValidationException("Title is required");
        }

        // Create entity
        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setIsbn(dto.getIsbn());

        // Save
        Book savedBook = bookRepository.save(book);
        return convertToDTO(savedBook);
    }
}
```

#### Annotations

```java
// Controller
@RestController
@RequestMapping("/api/books")
public class BookController {

    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBook(@PathVariable String id) {
        // ...
    }

    @PostMapping("/create")
    public ResponseEntity<BookDTO> createBook(@Valid @RequestBody BookCreateDTO dto) {
        // ...
    }
}

// Service
@Service
public class BookService {
    // ...
}

// Repository
@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    // ...
}
```

#### Error Handling

```java
// Use custom exceptions
throw new ResourceNotFoundException("Book not found with id: " + id);

// Use try-catch for external API calls
try {
    List<Double> embedding = embeddingService.generateEmbedding(text);
} catch (ApiException e) {
    logger.error("Failed to generate embedding", e);
    throw new EmbeddingException("Embedding generation failed", e);
}
```

#### Comments

```java
// Use JavaDoc for public methods
/**
 * Retrieves a book by its ID.
 *
 * @param id the unique identifier of the book
 * @return BookDTO containing book details
 * @throws ResourceNotFoundException if book not found
 */
public BookDTO getBookById(String id) {
    // Implementation
}

// Use inline comments for complex logic only
// Calculate cosine similarity between two embedding vectors
double similarity = calculateCosineSimilarity(embedding1, embedding2);
```

---

### Frontend (React/TypeScript)

#### General Principles

- Use **functional components** with hooks
- Prefer **TypeScript** for type safety
- Keep components small and reusable
- Use **descriptive prop names**
- Extract complex logic to custom hooks

#### Naming Conventions

```typescript
// Components: PascalCase
const BookList: React.FC = () => {};

// Files: PascalCase for components, camelCase for utilities
BookList.tsx;
bookService.ts;

// Props interfaces: Component name + Props
interface BookListProps {
  books: Book[];
  onBookClick: (id: string) => void;
}

// Variables and functions: camelCase
const bookTitle = "Clean Code";
const fetchBooks = async () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_BOOKS_PER_PAGE = 20;

// Types/Interfaces: PascalCase
interface Book {
  id: string;
  title: string;
}
```

#### Code Formatting

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for JSX, single for JavaScript
- **Semicolons**: Use them
- **Line Length**: Max 100 characters

```typescript
// Good Example
import React, { useState, useEffect } from "react";
import { bookService } from "../../services/api";
import type { Book } from "../../shared/types";

interface BookListProps {
  categoryId?: string;
}

const BookList: React.FC<BookListProps> = ({ categoryId }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await bookService.getAllBooks();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [categoryId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
```

#### Component Structure

```typescript
// 1. Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // 4. Hooks
  const navigate = useNavigate();
  const [state, setState] = useState();

  // 5. Event handlers
  const handleClick = () => {
    // ...
  };

  // 6. Effects
  useEffect(() => {
    // ...
  }, []);

  // 7. Render helpers
  const renderItem = () => {
    // ...
  };

  // 8. Return JSX
  return <div>{/* JSX */}</div>;
};

// 9. Export
export default MyComponent;
```

#### State Management (Redux)

```typescript
// Slice structure
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBooks = createAsyncThunk("books/fetchAll", async () => {
  const response = await bookService.getAllBooks();
  return response;
});

const booksSlice = createSlice({
  name: "books",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBooks: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearBooks } = booksSlice.actions;
export default booksSlice.reducer;
```

---

## Commit Message Format

We follow the **Conventional Commits** specification for clear and consistent commit history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (no functional changes)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, build, etc.)
- **ci**: CI/CD changes
- **revert**: Reverting a previous commit

### Scope (Optional)

The scope specifies the affected area:

- `backend` - Backend changes
- `frontend` - Frontend changes
- `api` - API changes
- `ui` - UI changes
- `db` - Database changes
- `ai` - AI features
- `config` - Configuration changes

### Subject

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Max 50 characters

### Examples

```bash
# Feature
feat(ai): add semantic search functionality

# Bug fix
fix(backend): resolve null pointer in book service

# Documentation
docs: update API documentation with new endpoints

# Code style
style(frontend): format BookList component with prettier

# Refactoring
refactor(backend): extract embedding logic to separate service

# Performance
perf(ai): optimize cosine similarity calculation

# Tests
test(backend): add unit tests for BookService

# Chore
chore: update Spring Boot to version 3.2.0

# Multiple types (use most significant)
feat(ai): add book recommendations
- Add recommendation endpoint
- Implement cosine similarity
- Update frontend to display recommendations
```

### Good vs Bad Examples

#### ✅ Good

```bash
feat(ai): implement semantic search with embeddings
fix(frontend): correct pagination on book list page
docs: add architecture documentation
refactor(backend): simplify book repository queries
test(api): add integration tests for book endpoints
```

#### ❌ Bad

```bash
Added new feature  # Missing type and unclear
fix bug  # Too vague, no scope or description
Updated files  # No meaningful information
WIP  # Work in progress should not be committed
asdfgh  # Meaningless
Fixed everything  # Too vague
```

### Breaking Changes

If your commit introduces breaking changes, add `BREAKING CHANGE:` in the footer:

```bash
feat(api)!: change book API response structure

BREAKING CHANGE: Book API now returns nested author and category objects instead of IDs.
Migration guide available in MIGRATION.md
```

---

## Pull Request Process

### Before Creating a PR

1. ✅ **Update your branch** with latest changes

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. ✅ **Run tests** - Ensure all tests pass

   ```bash
   ./mvnw test
   npm test
   ```

3. ✅ **Build successfully** - No compilation errors

   ```bash
   ./mvnw clean install
   npm run build
   ```

4. ✅ **Code style** - Follow style guidelines

   ```bash
   # Format code
   ./mvnw spotless:apply  # If spotless configured
   npm run lint  # Frontend
   ```

5. ✅ **Update documentation** - If needed

### Creating a Pull Request

1. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open PR on GitHub**

   - Click "New Pull Request"
   - Select your branch
   - Fill in the template

3. **PR Title Format**

   ```
   [Type] Brief description

   Examples:
   [Feature] Add semantic search functionality
   [Fix] Resolve pagination bug in book list
   [Docs] Update API documentation
   ```

4. **PR Description Template**

   ```markdown
   ## Description

   Brief description of what this PR does.

   ## Type of Change

   - [ ] Bug fix (non-breaking change which fixes an issue)
   - [ ] New feature (non-breaking change which adds functionality)
   - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
   - [ ] Documentation update

   ## Related Issue

   Fixes #123

   ## Changes Made

   - Added semantic search endpoint
   - Implemented embedding generation
   - Updated frontend to use new search

   ## Testing Done

   - [ ] Unit tests added/updated
   - [ ] Integration tests added/updated
   - [ ] Manual testing completed
   - [ ] All tests pass

   ## Screenshots (if applicable)

   [Add screenshots here]

   ## Checklist

   - [ ] My code follows the project's style guidelines
   - [ ] I have performed a self-review of my code
   - [ ] I have commented my code where necessary
   - [ ] I have updated the documentation accordingly
   - [ ] My changes generate no new warnings
   - [ ] I have added tests that prove my fix is effective or that my feature works
   - [ ] New and existing unit tests pass locally with my changes
   ```

### PR Review Process

1. **Automated Checks**

   - CI/CD pipeline runs automatically
   - Code quality checks
   - Tests must pass

2. **Code Review**

   - At least 1 reviewer required
   - Address all feedback
   - Make requested changes

3. **Update PR**

   ```bash
   # Make changes based on feedback
   git add .
   git commit -m "fix: address review feedback"
   git push origin feature/your-feature-name
   ```

4. **Approval and Merge**
   - Once approved, maintainer will merge
   - PR branch will be deleted automatically

### PR Guidelines

#### ✅ DO

- Keep PRs small and focused (< 400 lines changed)
- Write clear PR descriptions
- Link related issues
- Add screenshots for UI changes
- Respond to feedback promptly
- Be respectful and professional
- Squash commits if requested

#### ❌ DON'T

- Submit PRs with failing tests
- Include unrelated changes
- Force push after reviews (unless requested)
- Ignore review feedback
- Submit large PRs (> 1000 lines)
- Leave debugging code or console.logs
- Commit sensitive information (API keys, passwords)

---

## Bug Reports

### Before Reporting

1. **Search existing issues** - Check if already reported
2. **Try latest version** - Bug might be fixed
3. **Check documentation** - Might be expected behavior

### Creating a Bug Report

Use the bug report template:

```markdown
**Bug Description**
A clear and concise description of the bug.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**

- OS: [e.g., Windows 11, macOS Sonoma]
- Browser: [e.g., Chrome 118, Firefox 119]
- Backend Version: [e.g., 1.0.0]
- Database: [e.g., MongoDB 7.0]

**Additional Context**
Any other information about the problem.

**Error Messages**
```

Paste error messages here

```

```

---

## Feature Requests

### Creating a Feature Request

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How do you think this should work?

**Alternatives Considered**
Have you considered any alternatives?

**Additional Context**
Screenshots, mockups, or examples.

**Priority**

- [ ] Critical
- [ ] High
- [ ] Medium
- [ ] Low
```

---

## Testing Guidelines

### Backend Testing

```java
@SpringBootTest
class BookServiceTest {

    @Autowired
    private BookService bookService;

    @MockBean
    private BookRepository bookRepository;

    @Test
    void testCreateBook() {
        // Arrange
        BookCreateDTO dto = new BookCreateDTO();
        dto.setTitle("Test Book");
        dto.setIsbn("978-0123456789");

        // Act
        BookDTO result = bookService.createBook(dto);

        // Assert
        assertNotNull(result.getId());
        assertEquals("Test Book", result.getTitle());
    }
}
```

### Frontend Testing

```typescript
import { render, screen } from "@testing-library/react";
import BookList from "./BookList";

describe("BookList", () => {
  it("renders book cards", () => {
    const books = [
      { id: "1", title: "Clean Code" },
      { id: "2", title: "Refactoring" },
    ];

    render(<BookList books={books} />);

    expect(screen.getByText("Clean Code")).toBeInTheDocument();
    expect(screen.getByText("Refactoring")).toBeInTheDocument();
  });
});
```

---

## Documentation

### What to Document

- Public APIs and methods
- Complex algorithms
- Configuration options
- Setup instructions
- Breaking changes
- Migration guides

### Documentation Style

```java
/**
 * Generates an embedding vector for the given text using Hugging Face API.
 *
 * The embedding is a 384-dimensional vector that captures the semantic
 * meaning of the text. These vectors can be compared using cosine similarity
 * to find similar content.
 *
 * @param text the input text to generate embedding for (max 512 tokens)
 * @return a list of 384 floating-point numbers representing the embedding
 * @throws ApiException if the Hugging Face API call fails
 * @throws IllegalArgumentException if text is null or empty
 *
 * @see <a href="https://huggingface.co/BAAI/bge-small-en-v1.5">Model Documentation</a>
 */
public List<Double> generateEmbedding(String text) {
    // Implementation
}
```

---

## Questions?

If you have questions about contributing:

1. **Check Documentation**: README.md, ARCHITECTURE.md, etc.
2. **Search Issues**: Someone might have asked already
3. **Ask on GitHub Discussions**: Start a discussion
4. **Contact Maintainers**: Create an issue with the "question" label

---

## Thank You! 🎉

Thank you for contributing to the Bookstore Management System! Your contributions help make this project better for everyone.

**Happy Coding!** 💻✨
