package com.kaushik.restapis.bookstore_management.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kaushik.restapis.bookstore_management.entity.Book;
import com.kaushik.restapis.bookstore_management.repository.BookRepository;
import com.kaushik.restapis.bookstore_management.service.BookService;
import com.kaushik.restapis.bookstore_management.service.ai.EmbeddingService;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private EmbeddingService embeddingService;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookService bookService;

    // Recompute embeddings for all books (synchronous PoC; careful on large DBs)
    @PostMapping("/embeddings/recompute")
    public ResponseEntity<Map<String, Object>> recomputeAllEmbeddings(@RequestParam(defaultValue = "false") boolean force) {
        try {
            List<Book> books = bookRepository.findAll();
            int updated = 0;
            for (Book b : books) {
                if (!force && b.getEmbedding() != null && b.getEmbeddingUpdatedAt() != null) {
                    continue;
                }
                String text = buildEmbeddingText(b);
                List<Double> emb = embeddingService.embedText(text);
                b.setEmbedding(emb);
                b.setEmbeddingUpdatedAt(LocalDateTime.now());
                bookRepository.save(b);
                updated++;
            }

            Map<String, Object> resp = new HashMap<>();
            resp.put("updated", updated);
            resp.put("total", books.size());
            resp.put("message", "Successfully computed embeddings for " + updated + " books");
            return ResponseEntity.ok(resp);
        } catch (IllegalStateException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Configuration Error");
            error.put("message", e.getMessage());
            error.put("hint", "Check that huggingface.api.key is set in application.properties");
            return ResponseEntity.status(500).body(error);
        } catch (IOException | InterruptedException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "API Error");
            error.put("message", e.getMessage());
            error.put("hint", "Check Hugging Face API status or your API key validity");
            return ResponseEntity.status(500).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Unexpected Error");
            error.put("message", e.getMessage());
            error.put("type", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(error);
        }
    }

    // Compute embedding for a single book
    @PostMapping("/embeddings/book/{bookId}")
    public ResponseEntity<Map<String, Object>> computeEmbeddingForBook(@PathVariable String bookId) throws IOException, InterruptedException {
        Book b = bookService.getBookEntityById(bookId);
        String text = buildEmbeddingText(b);
        List<Double> emb = embeddingService.embedText(text);
        b.setEmbedding(emb);
        b.setEmbeddingUpdatedAt(LocalDateTime.now());
        bookRepository.save(b);

        Map<String, Object> resp = new HashMap<>();
        resp.put("bookId", bookId);
        resp.put("ok", true);
        return ResponseEntity.ok(resp);
    }

    // Recommend similar books by embedding cosine similarity
    @GetMapping("/recommendations/book/{bookId}")
    public ResponseEntity<List<Map<String, Object>>> recommendByBook(@PathVariable String bookId, @RequestParam(defaultValue = "6") int size) {
        Book b = bookService.getBookEntityById(bookId);
        if (b.getEmbedding() == null) {
            return ResponseEntity.badRequest().body(List.of(Map.of("error", "embedding_missing")));
        }

        List<Book> candidates = bookRepository.findAll().stream()
                .filter(x -> x.getEmbedding() != null && !x.getId().equals(bookId))
                .collect(Collectors.toList());

        List<Map<String, Object>> scored = new ArrayList<>();
        for (Book c : candidates) {
            double score = cosineSimilarity(b.getEmbedding(), c.getEmbedding());
            Map<String, Object> m = new HashMap<>();
            m.put("bookId", c.getId());
            m.put("score", score);
            m.put("title", c.getTitle());
            scored.add(m);
        }

        scored.sort(Comparator.comparingDouble(m -> -((Number) m.get("score")).doubleValue()));
        List<Map<String, Object>> top = scored.stream().limit(size).collect(Collectors.toList());
        return ResponseEntity.ok(top);
    }

    // Simple semantic search: embed query and score all books
    @GetMapping("/semantic-search")
    public ResponseEntity<List<Map<String, Object>>> semanticSearch(@RequestParam String q, @RequestParam(defaultValue = "10") int size) throws IOException, InterruptedException {
        List<Double> qEmb = embeddingService.embedText(q);
        List<Book> candidates = bookRepository.findAll().stream().filter(x -> x.getEmbedding() != null).collect(Collectors.toList());

        List<Map<String, Object>> scored = new ArrayList<>();
        for (Book c : candidates) {
            double score = cosineSimilarity(qEmb, c.getEmbedding());
            Map<String, Object> m = new HashMap<>();
            m.put("bookId", c.getId());
            m.put("score", score);
            m.put("title", c.getTitle());
            scored.add(m);
        }

        scored.sort(Comparator.comparingDouble(m -> -((Number) m.get("score")).doubleValue()));
        List<Map<String, Object>> top = scored.stream().limit(size).collect(Collectors.toList());
        return ResponseEntity.ok(top);
    }

    private String buildEmbeddingText(Book b) {
        StringBuilder sb = new StringBuilder();
        if (b.getTitle() != null) {
            sb.append(b.getTitle()).append(". ");
        }
        if (b.getDescription() != null) {
            sb.append(b.getDescription()).append(". ");
        }
        if (b.getAuthor() != null && b.getAuthor().getName() != null) {
            sb.append("Author: ").append(b.getAuthor().getName()).append(". ");
        }
        if (b.getCategory() != null && b.getCategory().getName() != null) {
            sb.append("Category: ").append(b.getCategory().getName()).append(". ");
        }
        return sb.toString();
    }

    private double cosineSimilarity(List<Double> a, List<Double> b) {
        if (a == null || b == null || a.size() != b.size()) {
            return 0.0;
        }
        double dot = 0.0;
        double na = 0.0;
        double nb = 0.0;
        for (int i = 0; i < a.size(); i++) {
            double va  = a.get(i);
            double vb = b.get(i);
            dot += va  * vb;
            na += va  * va;
            nb += vb * vb;
        }
        if (na == 0 || nb == 0) {
            return 0.0;
        }
        return dot / (Math.sqrt(na) * Math.sqrt(nb));
    }
}
