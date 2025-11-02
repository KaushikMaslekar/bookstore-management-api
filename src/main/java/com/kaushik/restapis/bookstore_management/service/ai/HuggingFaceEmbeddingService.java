package com.kaushik.restapis.bookstore_management.service.ai;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Hugging Face Inference API implementation for embeddings. Uses
 * BAAI/bge-small-en-v1.5 model (384 dimensions). Free tier: 30,000
 * requests/month Signup: https://huggingface.co/settings/tokens
 */
@Service
@Primary // This will be used instead of OpenAI service
public class HuggingFaceEmbeddingService implements EmbeddingService {

    @Value("${huggingface.api.key:}")
    private String huggingfaceApiKey;

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper mapper = new ObjectMapper();

    // Using BAAI BGE embedding model - works with feature extraction
    private static final String MODEL_ID = "BAAI/bge-small-en-v1.5";
    // Correct Hugging Face Inference API endpoint
    private static final String API_URL = "https://api-inference.huggingface.co/models/" + MODEL_ID;

    @Override
    public List<Double> embedText(String text) throws IOException, InterruptedException {
        if (huggingfaceApiKey == null || huggingfaceApiKey.isBlank()) {
            throw new IllegalStateException("Hugging Face API key not configured (huggingface.api.key)");
        }

        // BAAI/bge-small-en-v1.5 expects JSON with "inputs" field as a string
        String payload = mapper.writeValueAsString(
                java.util.Map.of("inputs", text)
        );

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + huggingfaceApiKey)
                .timeout(Duration.ofSeconds(30))
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                .build();

        // Retry logic for model loading (503 errors)
        HttpResponse<String> resp = null;
        int maxRetries = 3;
        int retryDelayMs = 3000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            resp = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            System.out.println("DEBUG [Attempt " + attempt + "]: Status=" + resp.statusCode());
            System.out.println("DEBUG [Attempt " + attempt + "]: Body=" + resp.body());

            // Success - break out
            if (resp.statusCode() == 200) {
                break;
            }

            // Model loading (503) - retry if attempts remain
            if (resp.statusCode() == 503 && attempt < maxRetries) {
                System.out.println("DEBUG: Model loading, waiting " + retryDelayMs + "ms before retry " + (attempt + 1));
                Thread.sleep(retryDelayMs);
                retryDelayMs *= 2; // Exponential backoff
                continue;
            }

            // Any other error or final attempt - throw
            String errorDetails = String.format(
                    "Hugging Face API failed (attempt %d/%d): HTTP %d - %s",
                    attempt, maxRetries, resp.statusCode(), resp.body()
            );
            System.err.println("ERROR: " + errorDetails);
            throw new IOException(errorDetails);
        }

        if (resp.statusCode() / 100 != 2) {
            throw new IOException("Hugging Face embeddings request failed: " + resp.statusCode() + " " + resp.body());
        }

        // BAAI/bge-small-en-v1.5 returns embeddings as a flat array of numbers
        JsonNode root = mapper.readTree(resp.body());

        // The response is a direct array of embedding values
        if (!root.isArray() || root.size() == 0) {
            throw new IOException("Unexpected Hugging Face response format (expected array): " + resp.body());
        }

        List<Double> embedding = new ArrayList<>();
        for (JsonNode n : root) {
            embedding.add(n.asDouble());
        }

        if (embedding.isEmpty()) {
            throw new IOException("No embedding returned from Hugging Face");
        }

        System.out.println("DEBUG: Successfully extracted embedding with " + embedding.size() + " dimensions");
        return embedding;
    }
}
