package com.kaushik.restapis.bookstore_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.kaushik.restapis.bookstore_management.entity")
@EnableJpaRepositories("com.kaushik.restapis.bookstore_management.repository")
public class BookstoreManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookstoreManagementApplication.class, args);
    }
}
