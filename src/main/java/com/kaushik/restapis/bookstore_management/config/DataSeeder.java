package com.kaushik.restapis.bookstore_management.config;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class DataSeeder implements ApplicationListener<ApplicationReadyEvent> {

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private boolean seeded = false;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (seeded) {
            return;
        }
        try {
            String base = "http://localhost:8080/api";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 1) create author
            Map<String, Object> author = new HashMap<>();
            author.put("name", "Jane Doe");
            author.put("bio", "Seeded author");
            author.put("nationality", "USA");
            HttpEntity<Map<String, Object>> aReq = new HttpEntity<>(author, headers);
            rest.postForObject(base + "/authors", aReq, String.class);

            // 2) create category
            Map<String, Object> category = new HashMap<>();
            category.put("name", "Fiction");
            category.put("description", "Seeded category");
            HttpEntity<Map<String, Object>> cReq = new HttpEntity<>(category, headers);
            rest.postForObject(base + "/categories", cReq, String.class);

            // 3) fetch created author and category IDs via search endpoints
            String authorSearch = URLEncoder.encode("Jane Doe", StandardCharsets.UTF_8);
            String authorsJson = rest.getForObject(base + "/authors/search?name=" + authorSearch, String.class);
            JsonNode authorsNode = mapper.readTree(authorsJson);
            String authorId = authorsNode.isArray() && authorsNode.size() > 0 ? authorsNode.get(0).path("id").asText() : null;

            String catSearch = URLEncoder.encode("Fiction", StandardCharsets.UTF_8);
            String catsJson = rest.getForObject(base + "/categories/search?name=" + catSearch, String.class);
            JsonNode catsNode = mapper.readTree(catsJson);
            String categoryId = catsNode.isArray() && catsNode.size() > 0 ? catsNode.get(0).path("id").asText() : null;

            if (authorId != null && categoryId != null) {
                // 4) create a book with found ids
                Map<String, Object> book = new HashMap<>();
                book.put("title", "Seeded Book");
                book.put("isbn", "978-0000000001");
                book.put("description", "Sample seeded book via DataSeeder");
                book.put("price", 9.99);
                book.put("publicationYear", 2025);
                book.put("stockQuantity", 20);
                book.put("pages", 250);
                book.put("language", "English");
                book.put("authorId", authorId);
                book.put("categoryId", categoryId);
                HttpEntity<Map<String, Object>> bReq = new HttpEntity<>(book, headers);
                rest.postForObject(base + "/books", bReq, String.class);
            }

            seeded = true;
            System.out.println("DataSeeder: seeding complete.");
        } catch (Exception ex) {
            System.err.println("DataSeeder: failed to seed data: " + ex.getMessage());
        }
    }
}
