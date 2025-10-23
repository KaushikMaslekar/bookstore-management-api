package com.kaushik.restapis.bookstore_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories("com.kaushik.restapis.bookstore_management.repository")
public class BookstoreManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookstoreManagementApplication.class, args);
    }
}
