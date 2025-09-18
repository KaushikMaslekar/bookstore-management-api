# Bookstore Management System

A Spring Boot REST API project for managing a bookstore with books, authors, and categories.

## 🚧 Project Status

**Work in Progress** - This project is currently under development.

## 📋 Features (Planned/Completed)

### Completed ✅

- [x] Project structure setup
- [x] Entity models (Book, Author, Category)
- [x] Repository interfaces
- [x] Service layer implementation
- [x] Basic CRUD operations

### In Progress 🔄

- [ ] REST Controllers
- [ ] Validation implementation
- [ ] Error handling
- [ ] Unit tests

### Planned 📅

- [ ] Authentication & Authorization
- [ ] API documentation (Swagger)
- [ ] Database migration scripts
- [ ] Docker containerization
- [ ] Integration tests
- [ ] Frontend integration

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3.x
- **Database**: MySQL/H2 (for development)
- **Build Tool**: Maven
- **Java Version**: 17+

## 📁 Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/kaushik/restapis/bookstore_management/
│   │       ├── entity/          # JPA entities
│   │       ├── repository/      # Data access layer
│   │       ├── service/         # Business logic
│   │       ├── controller/      # REST controllers (planned)
│   │       └── dto/             # Data transfer objects
│   └── resources/
│       └── application.properties
└── test/
```

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL (optional, H2 for development)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/bookstore-management.git
cd bookstore-management
```

2. Build the project

```bash
mvn clean install
```

3. Run the application

```bash
mvn spring-boot:run
```

## 📝 Development Notes

This project is being developed incrementally. Check the commit history to see daily progress.

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## 📄 License

This project is for educational purposes.

---

**Last Updated**: September 18, 2025
