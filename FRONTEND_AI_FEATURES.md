# Frontend AI Features Documentation

## Overview

This document describes the AI-powered features implemented in the React frontend of the Bookstore Management application.

## Features Implemented

### 1. Semantic Search (BookList Component)

**Location**: `frontend/src/features/books/BookList.tsx`

**Description**: AI-powered search that understands the meaning and context of search queries, not just exact keyword matches.

#### How It Works

- Toggle switch allows users to switch between traditional keyword search and AI semantic search
- When enabled, search queries are sent to the backend AI semantic search endpoint
- Backend uses BAAI/bge-small-en-v1.5 model to generate embeddings
- Returns books ranked by semantic similarity (0-1 score)

#### User Interface

```
┌─────────────────────────────────────────────────────────┐
│ 📚 Books Management                    [+ Add New Book] │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔍 Search & Filters          [⚡ AI Semantic Search] ☑️  │
├─────────────────────────────────────────────────────────┤
│ ℹ️ AI Search Active: Searches understand meaning...     │
│                                                          │
│ [🤖 AI Search: Try 'learn programming' or 'code quality'] │
└─────────────────────────────────────────────────────────┘
```

#### Features

- **Toggle Switch**: Enables/disables AI semantic search
- **Info Banner**: Appears when AI search is active with usage hints
- **Smart Placeholder**: Changes based on search mode
- **Filter Panel**: Hidden during AI search (semantic search ignores filters)
- **Results Display**: Shows semantically similar books ranked by relevance
- **Loading State**: Displays spinner during AI processing
- **Error Handling**: Shows user-friendly error messages if AI search fails

#### Example Queries

Traditional search requires exact keywords:

- "Java" → Only finds books with "Java" in title/description

AI semantic search understands concepts:

- "learn programming" → Finds beginner programming books
- "software engineering best practices" → Finds Clean Code, Refactoring, Design Patterns
- "object oriented design" → Finds OOP books even without exact phrase
- "code quality" → Finds books about testing, refactoring, clean code

### 2. Similar Books Recommendations (BookDetail Component)

**Location**: `frontend/src/features/books/BookDetail.tsx`

**Description**: Shows AI-powered recommendations of similar books based on content similarity.

#### How It Works

- When viewing a book, automatically fetches up to 6 similar books
- Uses cosine similarity between book embeddings (0-1 score)
- Displays similarity percentage to help users understand relevance
- Recommendations are clickable and navigate to recommended book

#### User Interface

```
┌─────────────────────────────────────────────────────────┐
│ 🪄 Similar Books You Might Like       [AI Powered]      │
├─────────────────────────────────────────────────────────┤
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐│
│ │ Effective Java │ │ Head First     │ │ Thinking in    ││
│ │                │ │ Design Patterns│ │ Java           ││
│ │ [95% Match] →  │ │ [88% Match] →  │ │ [82% Match] →  ││
│ └────────────────┘ └────────────────┘ └────────────────┘│
└─────────────────────────────────────────────────────────┘
```

#### Features

- **AI Badge**: Indicates recommendations are AI-powered
- **Match Percentage**: Shows similarity score (0-100%)
- **Grid Layout**: Responsive 1-3 columns based on screen size
- **Hover Effects**: Cards elevate on hover for better UX
- **Loading State**: Shows spinner while fetching recommendations
- **Empty State**: Helpful message if no similar books found
- **Click Navigation**: Clicking a recommendation navigates to that book

## Technical Implementation

### API Service Layer

**File**: `frontend/src/services/api.ts`

Added AI service with TypeScript types:

```typescript
// Types
export interface BookRecommendation {
  bookId: string;
  title: string;
  score: number;
}

export interface RecommendationsResponse {
  value: BookRecommendation[];
}

export interface SemanticSearchResult {
  bookId: string;
  title: string;
  score: number;
}

export interface SemanticSearchResponse {
  value: SemanticSearchResult[];
}

// AI Service Methods
export const aiService = {
  // Get similar books by bookId
  getRecommendations: (bookId: string, size: number = 6) =>
    GET(`/ai/recommendations/book/${bookId}?size=${size}`),

  // Semantic search for books
  semanticSearch: (query: string, size: number = 20) =>
    GET(`/ai/semantic-search?q=${encodeURIComponent(query)}&size=${size}`),

  // Recompute all book embeddings (admin)
  recomputeEmbeddings: (force: boolean = false) =>
    POST(`/ai/embeddings/recompute?force=${force}`),

  // Update single book embedding (admin)
  updateBookEmbedding: (bookId: string) =>
    POST(`/ai/embeddings/book/${bookId}`),
};
```

### BookList State Management

Added state variables for AI search:

```typescript
const [useSemanticSearch, setUseSemanticSearch] = useState(false);
const [semanticResults, setSemanticResults] = useState<Book[]>([]);
const [semanticLoading, setSemanticLoading] = useState(false);
const [semanticError, setSemanticError] = useState<string | null>(null);
```

### Search Logic

Modified `handleSearch` to support both modes:

```typescript
const handleSearch = async (query: string) => {
  if (!query) {
    // Reset to traditional search
    setUseSemanticSearch(false);
    setSemanticResults([]);
    dispatch(fetchBooks(filters));
    return;
  }

  if (useSemanticSearch) {
    try {
      setSemanticLoading(true);
      setSemanticError(null);

      // Call AI semantic search
      const results = await aiService.semanticSearch(query, 20);

      // Fetch full book details
      const bookIds = results.value.map((r) => r.bookId);
      const booksData = await Promise.all(
        bookIds.map((id) => bookService.getBookById(id))
      );

      setSemanticResults(booksData);
    } catch (error) {
      setSemanticError("AI search failed. Please try again.");
      console.error("Semantic search error:", error);
    } finally {
      setSemanticLoading(false);
    }
  } else {
    // Traditional keyword search
    dispatch(searchBooks({ title: query, params: filters }));
  }
};
```

### BookDetail Recommendations

Uses `useEffect` to automatically fetch recommendations:

```typescript
useEffect(() => {
  if (!id) return;

  const fetchBookAndRecommendations = async () => {
    try {
      // Fetch book details
      const bookData = await bookService.getBookById(id);
      setBook(bookData);

      // Fetch AI recommendations
      setRecLoading(true);
      const recResponse = await aiService.getRecommendations(id, 6);
      setRecommendations(recResponse.value || []);
    } catch (recError) {
      console.error("Failed to load recommendations:", recError);
      // Don't block main content if recommendations fail
    } finally {
      setRecLoading(false);
    }
  };

  fetchBookAndRecommendations();
}, [id]);
```

## Backend Integration

### Required Backend Endpoints

The frontend expects these AI endpoints (already implemented):

1. **GET** `/api/ai/semantic-search?q={query}&size={int}`

   - Returns semantically similar books for search query
   - Response: `{ value: [{ bookId, title, score }] }`

2. **GET** `/api/ai/recommendations/book/{bookId}?size={int}`

   - Returns similar books based on content
   - Response: `{ value: [{ bookId, title, score }] }`

3. **POST** `/api/ai/embeddings/recompute?force={boolean}`

   - Recomputes embeddings for all books (admin)
   - Response: `{ message, updatedCount }`

4. **POST** `/api/ai/embeddings/book/{bookId}`
   - Updates embedding for specific book (admin)
   - Response: `{ message, bookId }`

## User Experience

### Semantic Search Flow

1. User navigates to Books page
2. User enables "AI Semantic Search" toggle
3. Info banner appears explaining the feature
4. User types conceptual query (e.g., "beginner programming")
5. Frontend shows loading spinner
6. AI processes query and returns ranked results
7. Results appear ordered by relevance percentage
8. User clicks book to view details

### Recommendations Flow

1. User clicks on any book from search/list
2. Book details page loads
3. Recommendations section shows loading state
4. AI fetches top 6 similar books in background
5. Recommendations appear with match percentages
6. User clicks recommendation to view that book
7. New recommendations load for the clicked book

## Error Handling

### Semantic Search Errors

- API failure → Shows alert: "AI search failed. Please try again."
- No results → Shows: "No books match your semantic search..."
- Network timeout → Falls back to error state with retry option

### Recommendations Errors

- API failure → Logs error but doesn't block main content
- No recommendations → Shows: "No similar books found at the moment."
- Embedding not computed → Shows helpful message to use admin panel

## Performance Considerations

### Optimizations Implemented

1. **Async Loading**: Recommendations load after book details
2. **Error Isolation**: Recommendation failures don't break book view
3. **Loading States**: Clear feedback during AI processing
4. **Result Caching**: Results stored in state to avoid re-fetching
5. **Pagination Control**: Limited to 6 recommendations for performance

### Backend Performance

- Embeddings are pre-computed and stored in MongoDB
- Cosine similarity calculated on-demand (fast operation)
- Results limited by `size` parameter (default 6-20)

## Testing

### Manual Testing Steps

#### Test Semantic Search

1. Start backend server: `mvn spring-boot:run`
2. Start frontend dev server: `npm run dev`
3. Navigate to Books page (`/books`)
4. Enable "AI Semantic Search" toggle
5. Try these queries:
   - "learn programming" → Should find beginner books
   - "software engineering practices" → Should find Clean Code, Refactoring
   - "design patterns" → Should find GOF Design Patterns book
   - "python tutorial" → Should find Python books
6. Verify results are relevant to query meaning
7. Toggle off and verify traditional search still works

#### Test Recommendations

1. Navigate to any book detail page
2. Wait for recommendations to load
3. Verify 6 (or fewer) similar books appear
4. Check match percentages are between 0-100%
5. Click a recommendation
6. Verify navigation works
7. Verify new recommendations load for new book

### Expected Behavior

- ✅ Toggle switch enables/disables AI search
- ✅ Info banner appears when AI search active
- ✅ Loading spinner shows during processing
- ✅ Results are relevant to query meaning
- ✅ Recommendations show on book detail page
- ✅ Match percentages display correctly
- ✅ Clicking recommendations navigates properly
- ✅ Errors display user-friendly messages

## Future Enhancements

### Possible Improvements

1. **Search History**: Save recent semantic searches
2. **Feedback Loop**: Let users rate recommendation quality
3. **Filters with AI**: Combine filters with semantic search
4. **Sorting Options**: Sort by relevance, date, price
5. **More Recommendations**: Load more similar books on demand
6. **Explain Results**: Show why books were recommended
7. **Admin Panel**: Add UI for recomputing embeddings
8. **Similarity Badges**: Visual indicators for very high matches
9. **Recommendation Cards**: Show book covers and prices
10. **A/B Testing**: Compare AI vs traditional search effectiveness

## Troubleshooting

### Common Issues

**Q: Semantic search returns no results**

- Ensure backend is running on `localhost:8080`
- Check API key is configured: `huggingface.api.key=hf_xxx`
- Verify embeddings computed: POST `/api/ai/embeddings/recompute`
- Check browser console for error messages

**Q: Recommendations not showing**

- Verify book embeddings exist in database
- Check network tab for failed API calls
- Ensure bookId is valid
- Try recomputing embeddings for that book

**Q: AI search is slow**

- First search may be slower (model loading)
- Check Hugging Face API quota (30K req/month)
- Verify network connection is stable
- Consider reducing `size` parameter

**Q: Match percentages seem wrong**

- Scores are cosine similarity (0-1 converted to 0-100%)
- Lower scores (50-70%) indicate weak similarity
- High scores (85-100%) indicate strong similarity
- Scores depend on book description quality

## Resources

- **Backend AI Documentation**: `AI_FEATURES_SUMMARY.md`
- **Postman Testing Guide**: `POSTMAN_TESTING_GUIDE.md`
- **API Keys Setup**: `API_KEYS_SETUP.md`
- **Test Data**: `postman_test_data.json`
- **Hugging Face Model**: [BAAI/bge-small-en-v1.5](https://huggingface.co/BAAI/bge-small-en-v1.5)

## Summary

The frontend AI features provide:

- ✅ Semantic search that understands query meaning
- ✅ Similar book recommendations based on content
- ✅ Smooth user experience with loading states
- ✅ Error handling and fallback behavior
- ✅ Responsive design for all screen sizes
- ✅ TypeScript type safety throughout
- ✅ Clean integration with existing Redux state

Users can now discover books based on concepts rather than just keywords, and explore similar books automatically when viewing any book in the catalog.
