# Database Schema Documentation

## Overview

This document describes the database schema for the Bookstore Management System. The application uses **MongoDB**, a NoSQL document-oriented database, to store and manage data.

**Database Name:** `bookstore`  
**Database Type:** MongoDB (NoSQL)  
**Driver:** Spring Data MongoDB  
**Connection:** `mongodb://localhost:27017/bookstore`

---

## Table of Contents

- [Collections Overview](#collections-overview)
- [Authors Collection](#authors-collection)
- [Categories Collection](#categories-collection)
- [Books Collection](#books-collection)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Data Validation](#data-validation)
- [Sample Documents](#sample-documents)
- [Database Queries](#database-queries)
- [Migration Notes](#migration-notes)

---

## Collections Overview

The database consists of **3 main collections**:

| Collection   | Purpose                            | Relationships                         | Avg. Document Size        |
| ------------ | ---------------------------------- | ------------------------------------- | ------------------------- |
| `authors`    | Store author information           | One-to-Many with books                | ~500 bytes                |
| `categories` | Store book categories              | One-to-Many with books                | ~200 bytes                |
| `books`      | Store book details & AI embeddings | Many-to-One with authors & categories | ~3-5 KB (with embeddings) |

### Collection Statistics

```
Total Collections: 3
Estimated Total Documents: 100-10,000 (varies by deployment)
Total Storage: ~10 MB - 100 MB (depends on number of books)
AI Embeddings Storage: 384 floats × 8 bytes = ~3 KB per book
```

---

## Authors Collection

### Purpose

Stores information about book authors including biographical details and contact information.

### Collection Name

```
authors
```

### Schema Structure

```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "biography": String,
  "nationality": String,
  "_class": String
}
```

### Field Descriptions

| Field         | Type     | Required | Unique | Description                                     |
| ------------- | -------- | -------- | ------ | ----------------------------------------------- |
| `_id`         | ObjectId | Yes      | Yes    | MongoDB auto-generated unique identifier        |
| `name`        | String   | Yes      | Yes    | Full name of the author (1-100 chars)           |
| `email`       | String   | No       | No     | Contact email address (valid email format)      |
| `biography`   | String   | No       | No     | Brief biography or description (max 2000 chars) |
| `nationality` | String   | No       | No     | Author's nationality (max 50 chars)             |
| `_class`      | String   | Auto     | No     | Java class name (Spring Data MongoDB internal)  |

### Constraints

- **Name**: Required, unique, 1-100 characters
- **Email**: Optional, must be valid email format if provided
- **Biography**: Optional, max 2000 characters
- **Nationality**: Optional, max 50 characters

### Example Document

```json
{
  "_id": ObjectId("654a8b2c5f1d4e2a3c9b8d7e"),
  "name": "Robert C. Martin",
  "email": "uncle.bob@cleancoder.com",
  "biography": "Robert Cecil Martin, known as Uncle Bob, is an American software engineer and author. He is a co-author of the Agile Manifesto and has authored many books on software craftsmanship.",
  "nationality": "American",
  "_class": "com.kaushik.restapis.bookstore_management.entity.Author"
}
```

### Java Entity Mapping

```java
@Document(collection = "authors")
public class Author {
    @Id
    private String id;

    @NotBlank(message = "Author name is required")
    @Size(min = 1, max = 100)
    private String name;

    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 2000)
    private String biography;

    @Size(max = 50)
    private String nationality;

    // Getters, setters, constructors...
}
```

---

## Categories Collection

### Purpose

Stores book categories for classification and filtering purposes.

### Collection Name

```
categories
```

### Schema Structure

```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "_class": String
}
```

### Field Descriptions

| Field         | Type     | Required | Unique | Description                                    |
| ------------- | -------- | -------- | ------ | ---------------------------------------------- |
| `_id`         | ObjectId | Yes      | Yes    | MongoDB auto-generated unique identifier       |
| `name`        | String   | Yes      | Yes    | Category name (1-50 chars)                     |
| `description` | String   | No       | No     | Category description (max 500 chars)           |
| `_class`      | String   | Auto     | No     | Java class name (Spring Data MongoDB internal) |

### Constraints

- **Name**: Required, unique, 1-50 characters
- **Description**: Optional, max 500 characters

### Example Document

```json
{
  "_id": ObjectId("654a8b3d5f1d4e2a3c9b8d7f"),
  "name": "Software Engineering",
  "description": "Books about software development, design patterns, clean code, and engineering best practices.",
  "_class": "com.kaushik.restapis.bookstore_management.entity.Category"
}
```

### Java Entity Mapping

```java
@Document(collection = "categories")
public class Category {
    @Id
    private String id;

    @NotBlank(message = "Category name is required")
    @Size(min = 1, max = 50)
    private String name;

    @Size(max = 500)
    private String description;

    // Getters, setters, constructors...
}
```

---

## Books Collection

### Purpose

Stores comprehensive book information including metadata, pricing, and AI-generated embeddings for semantic search.

### Collection Name

```
books
```

### Schema Structure

```json
{
  "_id": ObjectId,
  "title": String,
  "isbn": String,
  "description": String,
  "price": Number,
  "publicationDate": ISODate,
  "author": DBRef,
  "category": DBRef,
  "embedding": [Number],
  "embeddingUpdatedAt": ISODate,
  "_class": String
}
```

### Field Descriptions

| Field                | Type          | Required | Unique | Description                                      |
| -------------------- | ------------- | -------- | ------ | ------------------------------------------------ |
| `_id`                | ObjectId      | Yes      | Yes    | MongoDB auto-generated unique identifier         |
| `title`              | String        | Yes      | No     | Book title (1-200 chars)                         |
| `isbn`               | String        | Yes      | Yes    | International Standard Book Number (10-17 chars) |
| `description`        | String        | Yes      | No     | Book description/summary (10-5000 chars)         |
| `price`              | Double        | Yes      | No     | Book price (must be > 0)                         |
| `publicationDate`    | ISODate       | Yes      | No     | Date when book was published                     |
| `author`             | DBRef         | Yes      | No     | Reference to author document                     |
| `category`           | DBRef         | Yes      | No     | Reference to category document                   |
| `embedding`          | Array[Double] | No       | No     | AI-generated 384-dimensional embedding vector    |
| `embeddingUpdatedAt` | ISODate       | No       | No     | Timestamp when embedding was last computed       |
| `_class`             | String        | Auto     | No     | Java class name (Spring Data MongoDB internal)   |

### Constraints

- **Title**: Required, 1-200 characters
- **ISBN**: Required, unique, 10-17 characters (format: XXX-X-XXX-XXXXX-X)
- **Description**: Required, 10-5000 characters
- **Price**: Required, must be greater than 0
- **Publication Date**: Required, valid date
- **Author**: Required, must reference existing author
- **Category**: Required, must reference existing category
- **Embedding**: Optional, exactly 384 floating-point numbers when present
- **Embedding Updated At**: Optional, set automatically when embedding computed

### Example Document (Without Embedding)

```json
{
  "_id": ObjectId("654a8b4e5f1d4e2a3c9b8d80"),
  "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
  "isbn": "978-0132350884",
  "description": "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
  "price": 45.99,
  "publicationDate": ISODate("2008-08-01T00:00:00.000Z"),
  "author": {
    "$ref": "authors",
    "$id": ObjectId("654a8b2c5f1d4e2a3c9b8d7e")
  },
  "category": {
    "$ref": "categories",
    "$id": ObjectId("654a8b3d5f1d4e2a3c9b8d7f")
  },
  "_class": "com.kaushik.restapis.bookstore_management.entity.Book"
}
```

### Example Document (With AI Embedding)

```json
{
  "_id": ObjectId("654a8b4e5f1d4e2a3c9b8d80"),
  "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
  "isbn": "978-0132350884",
  "description": "Even bad code can function. But if code isn't clean...",
  "price": 45.99,
  "publicationDate": ISODate("2008-08-01T00:00:00.000Z"),
  "author": {
    "$ref": "authors",
    "$id": ObjectId("654a8b2c5f1d4e2a3c9b8d7e")
  },
  "category": {
    "$ref": "categories",
    "$id": ObjectId("654a8b3d5f1d4e2a3c9b8d7f")
  },
  "embedding": [
    0.123456, -0.234567, 0.345678, -0.456789, 0.567890,
    // ... 379 more floating-point numbers (384 total)
    0.678901, -0.789012, 0.890123, -0.901234
  ],
  "embeddingUpdatedAt": ISODate("2025-11-03T10:30:00.000Z"),
  "_class": "com.kaushik.restapis.bookstore_management.entity.Book"
}
```

### Embedding Details

**What is it?**

- A 384-dimensional vector representation of the book's content
- Generated by Hugging Face BAAI/bge-small-en-v1.5 model
- Used for semantic search and similarity calculations

**How it's created:**

1. Combine: `title + description + author.name + category.name`
2. Send to Hugging Face API
3. Receive 384 floating-point numbers
4. Store in `embedding` array

**Storage size:**

- 384 doubles × 8 bytes = 3,072 bytes (~3 KB per book)

**When updated:**

- On demand via `/api/ai/embeddings/recompute` endpoint
- Can be set to auto-update when book content changes

### Java Entity Mapping

```java
@Document(collection = "books")
public class Book {
    @Id
    private String id;

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 200)
    private String title;

    @NotBlank(message = "ISBN is required")
    @Size(min = 10, max = 17)
    private String isbn;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 5000)
    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be positive")
    private Double price;

    @NotNull(message = "Publication date is required")
    private LocalDate publicationDate;

    @DBRef
    @NotNull(message = "Author is required")
    private Author author;

    @DBRef
    @NotNull(message = "Category is required")
    private Category category;

    private List<Double> embedding;

    private LocalDateTime embeddingUpdatedAt;

    // Getters, setters, constructors...
}
```

---

## Relationships

### Entity Relationship Diagram

```
┌─────────────────┐
│    AUTHORS      │
│─────────────────│
│ _id (PK)        │
│ name            │
│ email           │
│ biography       │
│ nationality     │
└────────┬────────┘
         │
         │ 1
         │
         │
         │ N
         ▼
┌─────────────────┐         ┌─────────────────┐
│     BOOKS       │    N    │   CATEGORIES    │
│─────────────────│◄────────┤─────────────────│
│ _id (PK)        │    1    │ _id (PK)        │
│ title           │         │ name            │
│ isbn (UNIQUE)   │         │ description     │
│ description     │         └─────────────────┘
│ price           │
│ publicationDate │
│ author (FK)     │
│ category (FK)   │
│ embedding[]     │
│ embeddingAt     │
└─────────────────┘
```

### Relationship Types

#### Books → Authors (Many-to-One)

- **Type**: DBRef (Database Reference)
- **Cardinality**: Many books can have the same author
- **Cascade**: Depends on business logic
  - Option A: Prevent author deletion if books exist
  - Option B: Set books' author to null
  - Option C: Delete all author's books (not recommended)

**MongoDB Representation:**

```json
"author": {
  "$ref": "authors",
  "$id": ObjectId("654a8b2c5f1d4e2a3c9b8d7e")
}
```

#### Books → Categories (Many-to-One)

- **Type**: DBRef (Database Reference)
- **Cardinality**: Many books can belong to the same category
- **Cascade**: Similar options as Books → Authors

**MongoDB Representation:**

```json
"category": {
  "$ref": "categories",
  "$id": ObjectId("654a8b3d5f1d4e2a3c9b8d7f")
}
```

### How Relationships are Loaded

**Spring Data MongoDB** automatically resolves DBRef relationships:

```java
// Fetch book
Book book = bookRepository.findById(bookId);

// Author and Category are automatically populated
String authorName = book.getAuthor().getName(); // Works!
String categoryName = book.getCategory().getName(); // Works!
```

---

## Indexes

### Purpose of Indexes

Indexes improve query performance by allowing MongoDB to quickly locate documents without scanning the entire collection.

### Recommended Indexes

#### Authors Collection

```javascript
// Unique index on name (prevents duplicate authors)
db.authors.createIndex({ name: 1 }, { unique: true });

// Index for email searches (if needed)
db.authors.createIndex({ email: 1 });
```

#### Categories Collection

```javascript
// Unique index on name (prevents duplicate categories)
db.categories.createIndex({ name: 1 }, { unique: true });
```

#### Books Collection

```javascript
// Unique index on ISBN (prevents duplicate books)
db.books.createIndex({ isbn: 1 }, { unique: true });

// Compound index for filtering and sorting
db.books.createIndex({ title: 1, price: 1 });

// Index for author reference (faster joins)
db.books.createIndex({ "author.$id": 1 });

// Index for category reference (faster joins)
db.books.createIndex({ "category.$id": 1 });

// Text index for full-text search
db.books.createIndex({
  title: "text",
  description: "text",
});

// Index for publication date queries
db.books.createIndex({ publicationDate: -1 });

// Index for embedding existence (AI features)
db.books.createIndex({ embedding: 1 });
```

### Index Performance Impact

| Index         | Query Time Without | Query Time With | Improvement |
| ------------- | ------------------ | --------------- | ----------- |
| ISBN lookup   | O(n) - 100ms       | O(1) - 5ms      | 20x faster  |
| Text search   | O(n) - 150ms       | O(log n) - 10ms | 15x faster  |
| Author filter | O(n) - 80ms        | O(log n) - 8ms  | 10x faster  |

### Spring Data MongoDB Auto-Indexing

Enable in `application.properties`:

```properties
spring.data.mongodb.auto-index-creation=true
```

This automatically creates indexes defined in Java entities:

```java
@Document(collection = "books")
@CompoundIndex(name = "title_price_idx", def = "{'title': 1, 'price': 1}")
public class Book {
    @Indexed(unique = true)
    private String isbn;
    // ...
}
```

---

## Data Validation

### Application-Level Validation (Spring Boot)

Validation happens before data reaches MongoDB using Bean Validation:

```java
@NotBlank(message = "Title is required")
@Size(min = 1, max = 200, message = "Title must be 1-200 characters")
private String title;

@NotNull(message = "Price is required")
@Min(value = 0, message = "Price must be positive")
private Double price;

@Email(message = "Invalid email format")
private String email;
```

### Database-Level Validation (MongoDB)

MongoDB schema validation (optional but recommended for production):

```javascript
// Books collection validation
db.createCollection("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "title",
        "isbn",
        "description",
        "price",
        "publicationDate",
        "author",
        "category",
      ],
      properties: {
        title: {
          bsonType: "string",
          minLength: 1,
          maxLength: 200,
          description: "Title must be a string between 1-200 characters",
        },
        isbn: {
          bsonType: "string",
          pattern: "^[0-9-]{10,17}$",
          description: "ISBN must be 10-17 characters",
        },
        price: {
          bsonType: "double",
          minimum: 0,
          description: "Price must be a positive number",
        },
        embedding: {
          bsonType: ["array", "null"],
          items: {
            bsonType: "double",
          },
          minItems: 384,
          maxItems: 384,
          description: "Embedding must be exactly 384 doubles if present",
        },
      },
    },
  },
  validationAction: "error",
});
```

---

## Sample Documents

### Complete Sample Dataset

#### Sample Authors

```json
[
  {
    "_id": ObjectId("673d1a2b5f8e9c1d2e3f4a5b"),
    "name": "Robert C. Martin",
    "email": "uncle.bob@cleancoder.com",
    "biography": "Software consultant, author, and speaker known for advocating clean code principles.",
    "nationality": "American"
  },
  {
    "_id": ObjectId("673d1a2b5f8e9c1d2e3f4a5c"),
    "name": "Martin Fowler",
    "email": "martin@martinfowler.com",
    "biography": "British software developer, author and international speaker on software development.",
    "nationality": "British"
  },
  {
    "_id": ObjectId("673d1a2b5f8e9c1d2e3f4a5d"),
    "name": "Eric Matthes",
    "email": "eric@pythoncrashcourse.com",
    "biography": "High school science and math teacher, author of Python Crash Course.",
    "nationality": "American"
  }
]
```

#### Sample Categories

```json
[
  {
    "_id": ObjectId("673d1a3c5f8e9c1d2e3f4a5e"),
    "name": "Software Engineering",
    "description": "Books about software development best practices, design patterns, and clean code."
  },
  {
    "_id": ObjectId("673d1a3c5f8e9c1d2e3f4a5f"),
    "name": "Programming Languages",
    "description": "Books focused on specific programming languages like Python, Java, C++."
  },
  {
    "_id": ObjectId("673d1a3c5f8e9c1d2e3f4a60"),
    "name": "Algorithms & Data Structures",
    "description": "Books covering algorithms, data structures, and computational theory."
  }
]
```

#### Sample Books

```json
[
  {
    "_id": ObjectId("673d1a4d5f8e9c1d2e3f4a61"),
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "isbn": "978-0132350884",
    "description": "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    "price": 45.99,
    "publicationDate": ISODate("2008-08-01T00:00:00Z"),
    "author": {
      "$ref": "authors",
      "$id": ObjectId("673d1a2b5f8e9c1d2e3f4a5b")
    },
    "category": {
      "$ref": "categories",
      "$id": ObjectId("673d1a3c5f8e9c1d2e3f4a5e")
    },
    "embedding": [0.123, -0.234, 0.345, /* ... 381 more numbers */],
    "embeddingUpdatedAt": ISODate("2025-11-03T10:30:00Z")
  },
  {
    "_id": ObjectId("673d1a4d5f8e9c1d2e3f4a62"),
    "title": "Python Crash Course, 3rd Edition",
    "isbn": "978-1593279288",
    "description": "A hands-on, project-based introduction to programming that teaches you Python fundamentals.",
    "price": 39.99,
    "publicationDate": ISODate("2023-01-10T00:00:00Z"),
    "author": {
      "$ref": "authors",
      "$id": ObjectId("673d1a2b5f8e9c1d2e3f4a5d")
    },
    "category": {
      "$ref": "categories",
      "$id": ObjectId("673d1a3c5f8e9c1d2e3f4a5f")
    },
    "embedding": [0.456, -0.567, 0.678, /* ... 381 more numbers */],
    "embeddingUpdatedAt": ISODate("2025-11-03T10:31:00Z")
  }
]
```

---

## Database Queries

### Common MongoDB Queries

#### Find all books with price > $40

```javascript
db.books.find({ price: { $gt: 40 } });
```

#### Find books by author name

```javascript
// First, find the author
var author = db.authors.findOne({ name: "Robert C. Martin" });

// Then find books by that author
db.books.find({ "author.$id": author._id });
```

#### Find books by category

```javascript
var category = db.categories.findOne({ name: "Software Engineering" });
db.books.find({ "category.$id": category._id });
```

#### Full-text search on title and description

```javascript
db.books.find({ $text: { $search: "programming python" } });
```

#### Find books published after 2020

```javascript
db.books.find({
  publicationDate: {
    $gte: ISODate("2020-01-01T00:00:00Z"),
  },
});
```

#### Find books with embeddings computed

```javascript
db.books.find({ embedding: { $exists: true, $ne: null } });
```

#### Count books by category

```javascript
db.books.aggregate([
  {
    $group: {
      _id: "$category.$id",
      count: { $sum: 1 },
    },
  },
]);
```

### Spring Data MongoDB Repository Queries

```java
public interface BookRepository extends MongoRepository<Book, String> {

    // Find by title (case-insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);

    // Find by ISBN
    Optional<Book> findByIsbn(String isbn);

    // Find by author
    List<Book> findByAuthor(Author author);

    // Find by category
    List<Book> findByCategory(Category category);

    // Find by price range
    List<Book> findByPriceBetween(Double minPrice, Double maxPrice);

    // Find by publication year
    List<Book> findByPublicationDateBetween(LocalDate startDate, LocalDate endDate);

    // Find books with embeddings
    List<Book> findByEmbeddingNotNull();

    // Custom query
    @Query("{ 'price': { $gte: ?0, $lte: ?1 } }")
    List<Book> findBooksInPriceRange(Double min, Double max);
}
```

---

## Migration Notes

### From SQL to MongoDB

If migrating from a relational database (MySQL, PostgreSQL):

#### Key Differences

| Aspect        | SQL                             | MongoDB                          |
| ------------- | ------------------------------- | -------------------------------- |
| Structure     | Tables with fixed schema        | Collections with flexible schema |
| Relationships | Foreign keys, joins             | DBRef or embedding               |
| Queries       | SQL language                    | MongoDB query language (MQL)     |
| Transactions  | ACID by default                 | ACID with replica sets           |
| Scaling       | Vertical (more powerful server) | Horizontal (add more servers)    |

#### Migration Steps

1. **Export SQL data to JSON**

   ```sql
   -- Export authors
   SELECT JSON_OBJECT(
     '_id', UUID(),
     'name', name,
     'email', email,
     'biography', biography,
     'nationality', nationality
   ) FROM authors;
   ```

2. **Import to MongoDB**

   ```bash
   mongoimport --db bookstore --collection authors --file authors.json --jsonArray
   ```

3. **Convert foreign keys to DBRefs**
   ```javascript
   // Update books to use DBRef instead of authorId
   db.books.find().forEach(function (book) {
     var author = db.authors.findOne({ _id: book.authorId });
     if (author) {
       db.books.updateOne(
         { _id: book._id },
         {
           $set: {
             author: { $ref: "authors", $id: author._id },
           },
           $unset: { authorId: "" },
         }
       );
     }
   });
   ```

### Backup and Restore

#### Backup entire database

```bash
mongodump --db bookstore --out /backup/bookstore-2025-11-03
```

#### Restore from backup

```bash
mongorestore --db bookstore /backup/bookstore-2025-11-03/bookstore
```

#### Export collection to JSON

```bash
mongoexport --db bookstore --collection books --out books.json --pretty
```

#### Import from JSON

```bash
mongoimport --db bookstore --collection books --file books.json --jsonArray
```

---

## Database Maintenance

### Monitoring Queries

```javascript
// Check database size
db.stats();

// Check collection sizes
db.books.stats();
db.authors.stats();
db.categories.stats();

// View all indexes
db.books.getIndexes();

// Check slow queries (if profiling enabled)
db.system.profile.find().limit(10).sort({ ts: -1 });
```

### Optimization Tips

1. **Use projections** - Only fetch needed fields

   ```javascript
   db.books.find({}, { title: 1, price: 1 });
   ```

2. **Limit results** - Use pagination

   ```javascript
   db.books.find().limit(20).skip(0);
   ```

3. **Use covered queries** - Query only indexed fields

   ```javascript
   db.books.find({ isbn: "978-0132350884" }, { isbn: 1, _id: 0 });
   ```

4. **Avoid large documents** - Embeddings are large, consider separate collection for very large datasets

5. **Regular index maintenance**
   ```javascript
   db.books.reIndex();
   ```

---

## Security Considerations

### Access Control

```javascript
// Create database user with specific permissions
use admin
db.createUser({
  user: "bookstore_app",
  pwd: "secure_password_here",
  roles: [
    { role: "readWrite", db: "bookstore" }
  ]
})

// Create read-only user for reporting
db.createUser({
  user: "bookstore_readonly",
  pwd: "another_secure_password",
  roles: [
    { role: "read", db: "bookstore" }
  ]
})
```

### Connection String with Authentication

```
mongodb://bookstore_app:secure_password_here@localhost:27017/bookstore
```

### Best Practices

- ✅ Enable authentication in production
- ✅ Use SSL/TLS for connections
- ✅ Regularly backup database
- ✅ Monitor slow queries
- ✅ Set appropriate indexes
- ✅ Limit user permissions (principle of least privilege)
- ✅ Keep MongoDB version updated

---

## Conclusion

This database schema provides:

- ✅ **Flexible structure** for storing books, authors, and categories
- ✅ **Relationships** using DBRef for referential integrity
- ✅ **AI embeddings** for semantic search capabilities
- ✅ **Proper indexing** for fast queries
- ✅ **Data validation** at application and database levels
- ✅ **Scalability** through MongoDB's horizontal scaling
- ✅ **Performance** optimized for common query patterns

The schema supports both traditional bookstore operations and advanced AI-powered features, making it suitable for modern applications requiring intelligent search and recommendation capabilities.
