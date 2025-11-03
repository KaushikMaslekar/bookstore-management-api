# Testing Documentation

## Table of Contents

- [Testing Overview](#testing-overview)
- [Testing Strategy](#testing-strategy)
- [Manual Testing](#manual-testing)
- [API Testing with Postman](#api-testing-with-postman)
- [Frontend Testing](#frontend-testing)
- [AI Features Testing](#ai-features-testing)
- [Test Scenarios](#test-scenarios)
- [Bug Tracking](#bug-tracking)
- [Test Results](#test-results)

---

## Testing Overview

### Purpose

This document outlines the testing procedures, test cases, and methodologies used to ensure the quality and reliability of the Bookstore Management System.

### Testing Types Implemented

1. **Manual Testing** - User interaction testing
2. **API Testing** - Backend endpoint validation
3. **Integration Testing** - Component interaction verification
4. **End-to-End Testing** - Complete user flow validation
5. **AI Feature Testing** - Semantic search and recommendations validation

### Testing Tools

- **Postman** - API endpoint testing
- **Browser DevTools** - Frontend debugging and network inspection
- **MongoDB Compass** - Database state verification
- **VS Code Debugger** - Backend debugging
- **React DevTools** - Component state inspection

---

## Testing Strategy

### 1. Unit Testing Goals

- Test individual components in isolation
- Validate business logic correctness
- Ensure proper error handling

### 2. Integration Testing Goals

- Verify component interactions
- Test API endpoints with database
- Validate frontend-backend communication

### 3. End-to-End Testing Goals

- Simulate real user workflows
- Test complete features from UI to database
- Verify data persistence and retrieval

### 4. Performance Testing Goals

- Measure response times
- Test pagination efficiency
- Validate AI search speed
- Monitor memory usage

---

## Manual Testing

### Test Environment Setup

#### Prerequisites

1. MongoDB running on localhost:27017
2. Backend running on localhost:8080
3. Frontend running on localhost:5173
4. Valid Hugging Face API key configured

#### Steps to Start Testing

```powershell
# 1. Start MongoDB
mongod --dbpath="path/to/data"

# 2. Start Backend
cd "bookstore-management with frontend AI Powered"
./mvnw spring-boot:run

# 3. Start Frontend
cd frontend
npm run dev
```

---

## API Testing with Postman

### Postman Collection Setup

#### Import Collection

1. Open Postman
2. Click **Import**
3. Select `postman_test_data.json` from project root
4. Collection loads with all endpoints

### Environment Variables

```json
{
  "baseUrl": "http://localhost:8080",
  "validBookId": "to-be-set-after-creation",
  "validAuthorId": "to-be-set-after-creation",
  "validCategoryId": "to-be-set-after-creation"
}
```

---

## Test Scenarios

### A. Books Management Testing

#### Test Case 1: Create New Book

**Endpoint:** `POST /api/books/create`

**Test Data:**

```json
{
  "title": "Clean Code",
  "isbn": "978-0132350884",
  "description": "A handbook of agile software craftsmanship",
  "price": 45.99,
  "publicationDate": "2008-08-01",
  "authorId": "{{validAuthorId}}",
  "categoryId": "{{validCategoryId}}"
}
```

**Expected Result:**

- Status: 201 Created
- Response contains all book fields
- Book has unique ID
- Book is persisted in database

**Validation Steps:**

1. Verify response status code is 201
2. Check response contains `id` field
3. Verify all input fields are in response
4. Confirm `publicationDate` is properly formatted
5. Open MongoDB Compass and verify book exists

**Edge Cases to Test:**

- Duplicate ISBN (should fail with 400)
- Missing required fields (should fail with 400)
- Invalid price (negative) (should fail with 400)
- Invalid author ID (should fail with 404)
- Invalid category ID (should fail with 404)

---

#### Test Case 2: Get All Books

**Endpoint:** `GET /api/books/all`

**Expected Result:**

- Status: 200 OK
- Response is array of books
- Each book has all required fields
- Books include author and category details

**Validation Steps:**

1. Verify response is JSON array
2. Check each book has `id`, `title`, `isbn`, etc.
3. Verify `author` and `category` are populated (not just IDs)
4. Confirm dates are properly formatted

---

#### Test Case 3: Get Book by ID

**Endpoint:** `GET /api/books/{id}`

**Test Data:**

- Use a valid book ID from previous test

**Expected Result:**

- Status: 200 OK
- Response contains complete book details
- Author and category are fully populated

**Validation Steps:**

1. Verify correct book is returned
2. Check all fields are present
3. Verify relationships are loaded

**Edge Cases:**

- Invalid ID format (should fail with 400)
- Non-existent ID (should fail with 404)

---

#### Test Case 4: Update Book

**Endpoint:** `PUT /api/books/{id}`

**Test Data:**

```json
{
  "title": "Clean Code - Updated Edition",
  "isbn": "978-0132350884",
  "description": "Updated description",
  "price": 49.99,
  "publicationDate": "2008-08-01",
  "authorId": "{{validAuthorId}}",
  "categoryId": "{{validCategoryId}}"
}
```

**Expected Result:**

- Status: 200 OK
- Response contains updated book
- Changes are persisted

**Validation Steps:**

1. Verify response reflects changes
2. Check database for updated values
3. Confirm unchanged fields remain the same

---

#### Test Case 5: Delete Book

**Endpoint:** `DELETE /api/books/{id}`

**Expected Result:**

- Status: 200 OK or 204 No Content
- Book is removed from database

**Validation Steps:**

1. Verify successful deletion response
2. Attempt to get deleted book (should return 404)
3. Check database - book should not exist

---

#### Test Case 6: Search Books

**Endpoint:** `GET /api/books/search?q={query}`

**Test Cases:**
| Query | Expected Results |
|-------|-----------------|
| "Java" | Books with "Java" in title/description |
| "978-0132350884" | Book with matching ISBN |
| "Clean" | Books with "Clean" in title |
| "NonExistent" | Empty array |

**Validation Steps:**

1. Verify results match search criteria
2. Check case-insensitive search works
3. Verify partial matches are found

---

### B. Authors Management Testing

#### Test Case 7: Create Author

**Endpoint:** `POST /api/authors/create`

**Test Data:**

```json
{
  "name": "Robert C. Martin",
  "email": "uncle.bob@example.com",
  "biography": "Software consultant and author",
  "nationality": "American"
}
```

**Expected Result:**

- Status: 201 Created
- Author saved with unique ID

**Edge Cases:**

- Duplicate name (should fail with 409 Conflict)
- Invalid email format (should fail with 400)
- Missing required name (should fail with 400)

---

#### Test Case 8: Get All Authors

**Endpoint:** `GET /api/authors/all`

**Expected Result:**

- Status: 200 OK
- Array of all authors
- Sorted alphabetically by name

---

#### Test Case 9: Update Author

**Endpoint:** `PUT /api/authors/{id}`

**Test Data:**

```json
{
  "name": "Robert C. Martin",
  "email": "updated.email@example.com",
  "biography": "Updated biography",
  "nationality": "American"
}
```

**Expected Result:**

- Status: 200 OK
- Author details updated

---

#### Test Case 10: Delete Author

**Endpoint:** `DELETE /api/authors/{id}`

**Expected Result:**

- Status: 200 OK
- Author removed from database

**Important:** Test cascading behavior

- If author has books, decide behavior:
  - Option A: Prevent deletion (return 409 Conflict)
  - Option B: Set books' author to null
  - Option C: Delete all author's books (dangerous)

---

### C. Categories Management Testing

#### Test Case 11: Create Category

**Endpoint:** `POST /api/categories/create`

**Test Data:**

```json
{
  "name": "Software Engineering",
  "description": "Books about software development"
}
```

**Expected Result:**

- Status: 201 Created
- Category saved successfully

**Edge Cases:**

- Duplicate category name (should fail with 409)
- Empty name (should fail with 400)

---

#### Test Case 12: Get All Categories

**Endpoint:** `GET /api/categories/all`

**Expected Result:**

- Status: 200 OK
- Array of all categories

---

#### Test Case 13: Update Category

**Endpoint:** `PUT /api/categories/{id}`

**Expected Result:**

- Status: 200 OK
- Category updated successfully

---

#### Test Case 14: Delete Category

**Endpoint:** `DELETE /api/categories/{id}`

**Expected Result:**

- Status: 200 OK
- Category removed

**Note:** Test behavior when category has associated books

---

### D. AI Features Testing

#### Test Case 15: Compute Book Embeddings

**Endpoint:** `POST /api/ai/embeddings/recompute?force=true`

**Prerequisites:**

- At least 5 books in database
- Valid Hugging Face API key configured

**Expected Result:**

- Status: 200 OK
- Response shows number of books processed

```json
{
  "total": 5,
  "updated": 5,
  "message": "Successfully computed embeddings for 5 books"
}
```

**Validation Steps:**

1. Check response counts are correct
2. Verify each book in database has `embedding` array (384 numbers)
3. Check `embeddingUpdatedAt` timestamp is recent
4. Verify embeddings are different for different books

**Performance Metrics:**

- Time per book: ~2-3 seconds
- Total time for 50 books: ~2-3 minutes

**Edge Cases:**

- API key invalid (should fail with 401)
- Model loading (HTTP 503) - should retry
- Rate limit exceeded (should handle gracefully)

---

#### Test Case 16: AI Semantic Search

**Endpoint:** `GET /api/ai/semantic-search?q={query}&size={n}`

**Test Scenarios:**

| Query                    | Size | Expected Behavior                       |
| ------------------------ | ---- | --------------------------------------- |
| "learn programming"      | 5    | Returns beginner programming books      |
| "software quality"       | 5    | Returns books about testing, clean code |
| "object oriented design" | 5    | Returns OOP-related books               |
| "database optimization"  | 5    | Returns database books                  |
| "nonsense gibberish xyz" | 5    | Returns books with low scores or empty  |

**Expected Result:**

- Status: 200 OK
- Array of BookRecommendation objects

```json
[
  {
    "bookId": "123",
    "title": "Python Crash Course",
    "score": 0.85
  }
]
```

**Validation Steps:**

1. Results are sorted by score (descending)
2. Scores are between 0 and 1
3. Only books with score > 0.5 are returned
4. Semantically similar books rank higher

**Quality Metrics:**

- Relevance: Do results match query intent?
- Ranking: Are most relevant books at the top?
- Coverage: Are all relevant books found?

---

#### Test Case 17: Book Recommendations

**Endpoint:** `GET /api/ai/recommendations/book/{bookId}?size=6`

**Test Scenarios:**

| Book Title                 | Expected Similar Books                             |
| -------------------------- | -------------------------------------------------- |
| Clean Code                 | Refactoring, Pragmatic Programmer, Design Patterns |
| Python Crash Course        | Learn Python 3, Python for Data Science            |
| Introduction to Algorithms | Data Structures, Algorithm Design                  |

**Expected Result:**

- Status: 200 OK
- Array of 6 (or fewer) similar books
- Books sorted by similarity score
- Current book NOT included in results

**Validation Steps:**

1. Verify recommendations make sense
2. Check scores are in descending order
3. Confirm current book is excluded
4. Test with different books

**Edge Cases:**

- Book has no embedding (should fail with 400)
- Only 1 book in database (should return empty array)
- Invalid book ID (should fail with 404)

---

## Frontend Testing

### Manual UI Testing Checklist

#### Navigation Testing

- [ ] All navigation links work
- [ ] Back button functions correctly
- [ ] URL updates on navigation
- [ ] Browser back/forward buttons work
- [ ] 404 page displays for invalid routes

#### Book List Page

- [ ] Books load and display correctly
- [ ] Pagination controls work
- [ ] Search functionality works
- [ ] AI search toggle functions
- [ ] Filter panel opens/closes
- [ ] Filter by author works
- [ ] Filter by category works
- [ ] Filter by price range works
- [ ] Clear filters button works
- [ ] Book cards are clickable
- [ ] Loading spinner displays during fetch

#### Book Detail Page

- [ ] Book information displays correctly
- [ ] Author name is shown
- [ ] Category name is shown
- [ ] Price is formatted properly
- [ ] Publication date is readable
- [ ] Edit button navigates to edit page
- [ ] Back button returns to previous page
- [ ] AI recommendations load
- [ ] Recommendation cards are clickable
- [ ] Match percentages display correctly
- [ ] Loading state for recommendations works

#### Add/Edit Book Page

- [ ] Form loads with empty fields (add) or populated fields (edit)
- [ ] All form fields are editable
- [ ] Author dropdown populates
- [ ] Category dropdown populates
- [ ] Date picker works
- [ ] Form validation triggers on submit
- [ ] Error messages display for invalid input
- [ ] Success message on successful save
- [ ] Redirect after successful save
- [ ] Cancel button returns to book list

#### Author Management

- [ ] Author list displays all authors
- [ ] Add author form works
- [ ] Edit author form works
- [ ] Delete author confirmation dialog appears
- [ ] Delete author removes from list
- [ ] Search authors works

#### Category Management

- [ ] Category list displays all categories
- [ ] Add category form works
- [ ] Edit category form works
- [ ] Delete category confirmation works
- [ ] Search categories works

#### Responsive Design Testing

- [ ] Desktop (1920x1080) - All elements visible
- [ ] Laptop (1366x768) - Layout adapts correctly
- [ ] Tablet (768x1024) - Mobile-friendly layout
- [ ] Mobile (375x667) - Single column, touch-friendly

#### Cross-Browser Testing

- [ ] Chrome - All features work
- [ ] Firefox - All features work
- [ ] Edge - All features work
- [ ] Safari - All features work (if available)

---

## Test Results Template

### Test Execution Record

**Test Date:** [Date]  
**Tested By:** [Name]  
**Environment:** [Dev/Staging/Prod]  
**Build Version:** [Version Number]

#### Test Summary

| Category       | Total Tests | Passed | Failed | Skipped |
| -------------- | ----------- | ------ | ------ | ------- |
| Books API      | 6           | 6      | 0      | 0       |
| Authors API    | 4           | 4      | 0      | 0       |
| Categories API | 4           | 4      | 0      | 0       |
| AI Features    | 3           | 3      | 0      | 0       |
| Frontend       | 45          | 43     | 2      | 0       |
| **Total**      | **62**      | **60** | **2**  | **0**   |

#### Failed Tests

| Test ID | Test Name             | Expected                 | Actual              | Severity | Status |
| ------- | --------------------- | ------------------------ | ------------------- | -------- | ------ |
| FE-12   | Filter by price range | Books filtered correctly | Filter not applying | Medium   | Open   |
| FE-23   | Mobile navbar toggle  | Menu opens on click      | Menu doesn't open   | Low      | Fixed  |

#### Performance Metrics

| Operation                 | Expected Time | Actual Time | Status  |
| ------------------------- | ------------- | ----------- | ------- |
| Load book list (50 items) | < 1s          | 0.8s        | ✅ Pass |
| AI semantic search        | < 3s          | 2.5s        | ✅ Pass |
| Get recommendations       | < 2s          | 1.8s        | ✅ Pass |
| Create book               | < 1s          | 0.6s        | ✅ Pass |
| Page load (first visit)   | < 3s          | 2.2s        | ✅ Pass |

---

## Bug Tracking

### Bug Report Template

```markdown
**Bug ID:** BUG-001
**Title:** Brief description of the bug
**Severity:** Critical / High / Medium / Low
**Status:** Open / In Progress / Fixed / Closed

**Environment:**

- OS: Windows 11
- Browser: Chrome 118
- Backend: localhost:8080
- Database: MongoDB 7.0

**Steps to Reproduce:**

1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
[Attach if applicable]

**Error Messages:**
```

Error message here

```

**Additional Notes:**
Any other relevant information
```

### Known Issues

#### Issue #1: Price Filter Not Working

**Status:** Open  
**Severity:** Medium  
**Description:** Price range filter on book list page doesn't filter books correctly  
**Workaround:** Use search instead

#### Issue #2: Slow Embedding Generation

**Status:** Won't Fix  
**Severity:** Low  
**Description:** Generating embeddings for 100+ books takes several minutes  
**Reason:** Hugging Face API rate limits - this is expected behavior

---

## Regression Testing Checklist

Before each release, verify:

### Core Functionality

- [ ] CRUD operations for books work
- [ ] CRUD operations for authors work
- [ ] CRUD operations for categories work
- [ ] Search functionality works
- [ ] AI semantic search works
- [ ] AI recommendations work

### Data Integrity

- [ ] Book-author relationships maintained
- [ ] Book-category relationships maintained
- [ ] No data loss on updates
- [ ] No duplicate entries created

### Performance

- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] No memory leaks in frontend
- [ ] Database queries optimized

### Security

- [ ] API keys not exposed
- [ ] Input validation works
- [ ] Error messages don't leak sensitive data
- [ ] CORS configured correctly

---

## Automated Testing (Future)

### Unit Tests (Backend)

```java
// Example test structure
@SpringBootTest
class BookServiceTest {

    @Test
    void testCreateBook() {
        // Arrange
        BookCreateDTO dto = new BookCreateDTO(...);

        // Act
        BookDTO result = bookService.createBook(dto);

        // Assert
        assertNotNull(result.getId());
        assertEquals(dto.getTitle(), result.getTitle());
    }
}
```

### Unit Tests (Frontend)

```typescript
// Example test structure
describe("BookList Component", () => {
  it("should render book cards", () => {
    // Arrange
    const books = [
      /* mock books */
    ];

    // Act
    render(<BookList books={books} />);

    // Assert
    expect(screen.getByText("Clean Code")).toBeInTheDocument();
  });
});
```

### Integration Tests

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class BookControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testCreateAndRetrieveBook() {
        // Create book
        BookCreateDTO createDTO = new BookCreateDTO(...);
        ResponseEntity<BookDTO> createResponse =
            restTemplate.postForEntity("/api/books/create", createDTO, BookDTO.class);

        assertEquals(HttpStatus.CREATED, createResponse.getStatusCode());

        // Retrieve book
        String bookId = createResponse.getBody().getId();
        ResponseEntity<BookDTO> getResponse =
            restTemplate.getForEntity("/api/books/" + bookId, BookDTO.class);

        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
    }
}
```

---

## Test Data Management

### Sample Test Data

#### Authors

```json
[
  {
    "name": "Robert C. Martin",
    "email": "uncle.bob@example.com",
    "nationality": "American"
  },
  {
    "name": "Martin Fowler",
    "email": "martin@example.com",
    "nationality": "British"
  }
]
```

#### Categories

```json
[
  {
    "name": "Software Engineering",
    "description": "Books about software development"
  },
  {
    "name": "Programming",
    "description": "Programming languages and techniques"
  }
]
```

#### Books

```json
[
  {
    "title": "Clean Code",
    "isbn": "978-0132350884",
    "description": "A handbook of agile software craftsmanship",
    "price": 45.99,
    "publicationDate": "2008-08-01"
  }
]
```

### Test Database Cleanup

```javascript
// MongoDB script to reset test data
use bookstore;
db.books.deleteMany({});
db.authors.deleteMany({});
db.categories.deleteMany({});
```

---

## Continuous Testing Strategy

### Daily Testing

- Smoke tests on critical paths
- API endpoint verification
- Frontend functionality check

### Weekly Testing

- Full regression suite
- Performance testing
- Cross-browser testing

### Before Release

- Complete test suite execution
- Security audit
- Performance benchmarking
- User acceptance testing

---

## Testing Best Practices

### DO:

✅ Test with realistic data  
✅ Test edge cases and boundary conditions  
✅ Document test results  
✅ Retest after bug fixes  
✅ Test on multiple browsers  
✅ Verify error handling  
✅ Check API response codes  
✅ Validate data persistence

### DON'T:

❌ Skip testing error scenarios  
❌ Test only happy paths  
❌ Use production database for testing  
❌ Ignore performance issues  
❌ Test without proper setup  
❌ Assume frontend changes don't affect backend  
❌ Forget to test on mobile devices

---

## Conclusion

This testing documentation provides a comprehensive guide for ensuring the quality and reliability of the Bookstore Management System. Regular testing following these guidelines will help maintain a stable, bug-free application.

**Remember:** Testing is an ongoing process, not a one-time activity!
