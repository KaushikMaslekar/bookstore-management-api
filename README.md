# 📚 Bookstore Management API

A comprehensive RESTful API for managing a bookstore built with Spring Boot, MySQL, and JPA/Hibernate.

## ✅ Project Status

**Completed** - Full implementation with CRUD operations for authors, categories, and books.

## 🚀 Features

- **Complete CRUD Operations** for Authors, Categories, and Books
- **MySQL Database Integration** with proper entity relationships
- **Advanced Search & Filtering** capabilities
- **Pagination Support** for efficient data retrieval
- **Data Validation & Error Handling** with proper HTTP status codes
- **JSON Serialization** with Jackson annotations
- **Duplicate Prevention** for authors and categories

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.1.4
- **Database**: MongoDB
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven
- **Java Version**: 21
- **API Testing**: Postman

## � Project Structure

```
src/main/java/com/kaushik/restapis/bookstore_management/
├── controller/          # REST API Controllers
│   ├── AuthorController.java
│   ├── BookController.java
│   ├── CategoryController.java
│   └── TestController.java
├── dto/                 # Data Transfer Objects
│   ├── BookCreateDTO.java
│   └── BookDTO.java
├── entity/              # JPA Entities
│   ├── Author.java
│   ├── Book.java
│   └── Category.java
├── exceptions/          # Exception Handling
│   └── GlobalExceptionHandler.java
├── repository/          # JPA Repositories
│   ├── AuthorRepository.java
│   ├── BookRepository.java
│   └── CategoryRepository.java
└── service/             # Business Logic
    ├── AuthorService.java
    ├── BookService.java
    └── CategoryService.java
```

## 🗄️ Database Schema

### Authors

- id (Primary Key)
- name (Unique, Required)
- email (Optional)
- biography (Optional)
- nationality (Optional)

### Categories

- id (Primary Key)
- name (Unique, Required)
- description (Optional)

### Books

- id (Primary Key)
- title (Required)
- isbn (Unique, Required)
- description (Required)
- price (Required, > 0)
- stock_quantity (Required, >= 0)
- publication_year (Optional)
- pages (Optional)
- language (Optional)
- author_id (Foreign Key)
- category_id (Foreign Key)

## 🔗 API Endpoints

### Authors API

```
POST   /api/authors/create           # Create new author
GET    /api/authors/all              # Get all authors
GET    /api/authors/{id}             # Get author by ID
PUT    /api/authors/{id}             # Update author
DELETE /api/authors/{id}             # Delete author
GET    /api/authors/search?name=     # Search authors
```

### Categories API

```
POST   /api/categories               # Create new category
GET    /api/categories               # Get all categories
GET    /api/categories/{id}          # Get category by ID
PUT    /api/categories/{id}          # Update category
DELETE /api/categories/{id}          # Delete category
GET    /api/categories/search?name=  # Search categories
```

### Books API

```
POST   /api/books/create                    # Create new book
GET    /api/books                           # Get all books
GET    /api/books/{id}                      # Get book by ID
PUT    /api/books/{id}                      # Update book
DELETE /api/books/{id}                      # Delete book
GET    /api/books/search?title=             # Search books
GET    /api/books/author/{authorId}         # Get books by author
GET    /api/books/category/{categoryId}     # Get books by category
GET    /api/books/price-range?min=&max=     # Get books by price range
PATCH  /api/books/{id}/stock                # Update book stock
```

## 🚦 Getting Started

### Prerequisites

- Java 21 or higher
- MongoDB
- Maven 3.6+

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/KaushikMaslekar/bookstore-management-api.git
cd bookstore-management-api
```

2. **Setup MySQL Database**

```sql
CREATE DATABASE bookstore;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON bookstore.* TO 'root'@'localhost';
```

3. **Configure Application Properties**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bookstore
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

4. **Run the Application**

```bash
./mvnw spring-boot:run
```

5. **Access the API**

- Base URL: `http://localhost:8080`
- Test endpoint: `GET http://localhost:8080/api/test`

## 📝 Sample API Usage

### Create Author

```json
POST /api/authors/create
{
    "name": "J.K. Rowling",
    "email": "jk.rowling@example.com",
    "biography": "British author best known for the Harry Potter series"
}
```

### Create Category

```json
POST /api/categories
{
    "name": "Fantasy",
    "description": "Fiction set in magical worlds"
}
```

### Create Book

```json
POST /api/books/create
{
    "title": "Harry Potter and the Philosopher's Stone",
    "isbn": "978-0439708180",
    "description": "The first book in the Harry Potter series",
    "price": 12.99,
    "stockQuantity": 50,
    "publicationYear": 1997,
    "pages": 223,
    "language": "English",
    "authorId": 1,
    "categoryId": 1
}
```

## 🔍 Advanced Features

### Pagination & Sorting

```
GET /api/books?page=0&size=10&sortBy=title&sortDir=asc
```

### Filtering

```
GET /api/books?authorId=1&categoryId=2&minPrice=10&maxPrice=50
```

### Search

```
GET /api/authors/search?name=Rowling
GET /api/books/search?title=Harry
```

## 🛡️ Error Handling

The API provides comprehensive error handling with proper HTTP status codes:

- **200 OK** - Successful GET requests
- **201 Created** - Successful POST requests
- **400 Bad Request** - Validation errors, duplicate resources
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kaushik Maslekar**

- GitHub: [@KaushikMaslekar](https://github.com/KaushikMaslekar)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- MySQL team for the robust database system
- Java community for continuous support

---

**⭐ Star this repository if you find it helpful!**
