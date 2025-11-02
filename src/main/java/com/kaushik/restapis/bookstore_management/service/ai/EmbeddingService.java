package com.kaushik.restapis.bookstore_management.service.ai;

import java.io.IOException;
import java.util.List;

public interface EmbeddingService {

    // Return embedding vector as list of doubles
    List<Double> embedText(String text) throws IOException, InterruptedException;
}
