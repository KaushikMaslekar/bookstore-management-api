# Postman Testing Guide - AI Features

## 🚀 Prerequisites

- ✅ Server is running on `http://localhost:8080`
- ✅ MongoDB has books with data
- ✅ Hugging Face API key is configured

---

## Step 1️⃣: Compute Book Embeddings

### Request Details

- **Method**: `POST`
- **URL**: `http://localhost:8080/api/ai/embeddings/recompute?force=true`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**: None (leave empty)

### Steps in Postman:

1. Create a new request
2. Set method to **POST**
3. Enter URL: `http://localhost:8080/api/ai/embeddings/recompute?force=true`
4. Go to **Headers** tab
5. Add: `Content-Type` = `application/json`
6. Click **Send**

### ✅ Expected Response (Success):

```json
{
  "total": 6,
  "message": "Successfully computed embeddings for 6 books",
  "updated": 6
}
```

### Parameters Explained:

- `force=true` - Recomputes embeddings even if they already exist
- `force=false` - Only computes embeddings for books that don't have them yet

### ⚠️ Possible Errors:

- **500 Internal Server Error**: Check server logs, might be API key issue
- **Timeout**: First request may take 20-30 seconds (Hugging Face model loading)

---

## Step 2️⃣: Get All Books (to find Book IDs)

### Request Details

- **Method**: `GET`
- **URL**: `http://localhost:8080/api/books`
- **Headers**: None required

### Steps in Postman:

1. Create a new request
2. Set method to **GET**
3. Enter URL: `http://localhost:8080/api/books`
4. Click **Send**

### ✅ Expected Response:

```json
{
    "content": [
        {
            "id": "68e7db2997e8484ea7fcddd7",
            "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
            "isbn": "9780132350884",
            "description": "...",
            "price": 39.99,
            "authorName": "Robert C. Martin",
            "categoryName": "Software Engineering"
        },
        // ... more books
    ],
    "pageable": { ... },
    "totalPages": 1,
    "totalElements": 6
}
```

### 📝 Action Required:

**Copy a book ID** from the response (e.g., `68e7db2997e8484ea7fcddd7`) for the next steps!

---

## Step 3️⃣: Get Book Recommendations

### Request Details

- **Method**: `GET`
- **URL**: `http://localhost:8080/api/ai/recommendations/book/{bookId}?size=4`
- **Headers**: None required

### Steps in Postman:

1. Create a new request
2. Set method to **GET**
3. Enter URL: `http://localhost:8080/api/ai/recommendations/book/68e7db2997e8484ea7fcddd7?size=4`
   - Replace `68e7db2997e8484ea7fcddd7` with an actual book ID from Step 2
4. Click **Send**

### ✅ Expected Response:

```json
{
  "value": [
    {
      "bookId": "68e7dbf797e8484ea7fcddda",
      "title": "The Pragmatic Programmer",
      "score": 0.6826509153975329
    },
    {
      "bookId": "69074a0435347d1bcf0431d8",
      "title": "Advanced C++ Patterns",
      "score": 0.6302555259932778
    },
    {
      "bookId": "68ec47deeb48604bc120b6e1",
      "title": "C++ crash course",
      "score": 0.6158021027339557
    },
    {
      "bookId": "68e7dc7f97e8484ea7fcdde0",
      "title": "Python Crash Course",
      "score": 0.6024356186115912
    }
  ],
  "Count": 4
}
```

### Parameters Explained:

- `{bookId}` - The book you want recommendations for (path parameter)
- `size` - Number of recommendations to return (query parameter, default: 5, max: 20)

### Understanding the Response:

- **score**: Cosine similarity (0-1 range)
  - 1.0 = Identical content
  - 0.7-0.9 = Very similar
  - 0.5-0.7 = Moderately similar
  - 0.3-0.5 = Somewhat related
  - <0.3 = Not very related

### 💡 Try Different Books:

Test with different book IDs to see how recommendations vary!

---

## Step 4️⃣: Semantic Search

### Request Details

- **Method**: `GET`
- **URL**: `http://localhost:8080/api/ai/semantic-search?q={query}&size=3`
- **Headers**: None required

### Steps in Postman:

1. Create a new request
2. Set method to **GET**
3. Enter URL with your search query
4. Click **Send**

### Example Queries to Try:

#### Query 1: "software engineering best practices"

```
http://localhost:8080/api/ai/semantic-search?q=software engineering best practices&size=3
```

#### Query 2: "programming languages"

```
http://localhost:8080/api/ai/semantic-search?q=programming languages&size=5
```

#### Query 3: "clean code principles"

```
http://localhost:8080/api/ai/semantic-search?q=clean code principles&size=4
```

### ✅ Expected Response:

```json
{
  "value": [
    {
      "bookId": "68e7dbf797e8484ea7fcddda",
      "title": "The Pragmatic Programmer",
      "score": 0.6575637509789075
    },
    {
      "bookId": "68e7db2997e8484ea7fcddd7",
      "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
      "score": 0.6354684858103876
    },
    {
      "bookId": "69074a0435347d1bcf0431d8",
      "title": "Advanced C++ Patterns",
      "score": 0.5850943670268804
    }
  ],
  "Count": 3
}
```

### Parameters Explained:

- `q` - Search query (natural language text)
- `size` - Number of results to return (query parameter, default: 10, max: 50)

### 💡 Semantic vs Keyword Search:

**Semantic Search** understands meaning:

- Query: "beginner friendly python tutorial"
- Finds: "Python Crash Course" (even if description doesn't contain exact words)

**Traditional Keyword Search**:

- Would only match if exact words appear in title/description

---

## Step 5️⃣: Update Single Book Embedding

### Request Details

- **Method**: `POST`
- **URL**: `http://localhost:8080/api/ai/embeddings/book/{bookId}`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**: None

### Steps in Postman:

1. Create a new request
2. Set method to **POST**
3. Enter URL: `http://localhost:8080/api/ai/embeddings/book/68e7db2997e8484ea7fcddd7`
   - Replace with actual book ID
4. Go to **Headers** tab
5. Add: `Content-Type` = `application/json`
6. Click **Send**

### ✅ Expected Response:

```json
{
  "message": "Successfully updated embedding for book: Clean Code: A Handbook of Agile Software Craftsmanship",
  "bookId": "68e7db2997e8484ea7fcddd7"
}
```

### Use Case:

- Use this when you edit a book's description and want to update just that book's embedding
- More efficient than recomputing all embeddings

---

## 📊 Testing Checklist

### Basic Flow:

- [ ] **Step 1**: Compute embeddings for all books
- [ ] **Step 2**: Get list of books and copy a book ID
- [ ] **Step 3**: Test recommendations for that book
- [ ] **Step 4**: Test semantic search with various queries
- [ ] **Step 5**: Update single book embedding

### Advanced Testing:

- [ ] Try recommendations for different book IDs (compare results)
- [ ] Test semantic search with different query types:
  - [ ] Technical terms: "design patterns", "algorithms"
  - [ ] Concepts: "learning programming", "software craftsmanship"
  - [ ] Programming languages: "python", "C++", "java"
- [ ] Test with different `size` parameters (1, 5, 10, 20)
- [ ] Recompute embeddings with `force=false` (should show 0 updated)
- [ ] Recompute embeddings with `force=true` (should show all updated)

---

## 🐛 Troubleshooting

### Problem: "Unable to connect" error

**Solution**: Check if server is running

```powershell
Get-NetTCPConnection -LocalPort 8080
```

### Problem: Timeout on first request

**Solution**: Normal! Hugging Face loads model on first request (20-30 seconds)

- Wait and try again
- Subsequent requests will be fast

### Problem: HTTP 500 "API key not configured"

**Solution**: Check `application.properties`

```properties
huggingface.api.key=YOUR_HUGGINGFACE_API_KEY_HERE
```

### Problem: HTTP 500 "Hugging Face API failed"

**Solution**: Check your API key is valid

- Go to: https://huggingface.co/settings/tokens
- Verify token is active
- Check free tier limits (30K requests/month)

### Problem: Recommendations return empty array

**Solution**: Embeddings not computed yet

- Run Step 1 first (compute embeddings)
- Wait for success response

### Problem: Semantic search returns incorrect results

**Solution**:

- Make sure embeddings are up-to-date
- Try recomputing with `force=true`
- Check book descriptions have meaningful content

---

## 💾 Save Postman Collection

### Steps to Save:

1. Click on collection name in Postman
2. Right-click → **Export**
3. Choose **Collection v2.1**
4. Save as `Bookstore_AI_API.postman_collection.json`

### Collection Structure:

```
📁 Bookstore AI API
├── 1️⃣ Compute All Embeddings
├── 2️⃣ Get All Books
├── 3️⃣ Get Recommendations
├── 4️⃣ Semantic Search
└── 5️⃣ Update Single Book Embedding
```

---

## 🎯 Quick Test URLs (Copy-Paste Ready)

### Compute Embeddings:

```
POST http://localhost:8080/api/ai/embeddings/recompute?force=true
```

### Get Books:

```
GET http://localhost:8080/api/books
```

### Recommendations (replace {bookId}):

```
GET http://localhost:8080/api/ai/recommendations/book/{bookId}?size=5
```

### Semantic Search Examples:

```
GET http://localhost:8080/api/ai/semantic-search?q=software engineering&size=5
GET http://localhost:8080/api/ai/semantic-search?q=programming tutorial&size=3
GET http://localhost:8080/api/ai/semantic-search?q=clean code&size=4
```

---

## 📈 Performance Notes

- **Embedding computation**: ~3-5 seconds for 6 books
- **Recommendations**: <500ms (after embeddings are computed)
- **Semantic search**: ~1-2 seconds (includes query embedding generation)
- **First request**: 20-30 seconds (model loading on Hugging Face)

---

**Happy Testing! 🎉**

If you encounter any issues, check the server logs for detailed error messages.
