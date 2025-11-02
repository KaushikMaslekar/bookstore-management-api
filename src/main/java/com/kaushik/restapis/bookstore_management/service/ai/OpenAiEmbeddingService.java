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
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OpenAiEmbeddingService implements EmbeddingService {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public List<Double> embedText(String text) throws IOException, InterruptedException {
        if (openaiApiKey == null || openaiApiKey.isBlank()) {
            throw new IllegalStateException("OPENAI API key not configured (openai.api.key)");
        }

        String endpoint = "https://api.openai.com/v1/embeddings";
        // model choice can be changed; use text-embedding-3-small for cost/size balance
        String payload = mapper.writeValueAsString(
                java.util.Map.of("model", "text-embedding-3-small", "input", text)
        );

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + openaiApiKey)
                .timeout(Duration.ofSeconds(30))
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        if (resp.statusCode() / 100 != 2) {
            throw new IOException("OpenAI embeddings request failed: " + resp.statusCode() + " " + resp.body());
        }

        JsonNode root = mapper.readTree(resp.body());
        JsonNode data = root.path("data");
        if (!data.isArray() || data.size() == 0) {
            throw new IOException("No embedding returned from provider");
        }

        JsonNode emb = data.get(0).path("embedding");
        List<Double> v = new ArrayList<>();
        for (JsonNode n : emb) {
            v.add(n.asDouble());
        }
        return v;
    }
}
