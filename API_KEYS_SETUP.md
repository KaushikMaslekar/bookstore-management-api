# 🔐 API Keys Setup Guide

## Important: Protecting Your API Keys

⚠️ **Never commit API keys to Git!** GitHub will block pushes containing secrets.

## Setup Instructions

### 1. Get Your Hugging Face API Key (Free)

1. Go to [Hugging Face](https://huggingface.co/signup) and create a free account
2. Navigate to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
3. Click "New token"
4. Give it a name (e.g., "Bookstore App")
5. Select "Read" permission
6. Click "Generate"
7. Copy your token (starts with `hf_`)

### 2. Configure Your Application

Open `src/main/resources/application.properties` and replace the placeholder:

```properties
# Replace this line:
huggingface.api.key=YOUR_HUGGINGFACE_API_KEY_HERE

# With your actual key:
huggingface.api.key=hf_YourActualTokenHere
```

### 3. Keep Your Key Secure

**DO:**

- ✅ Keep your API key in `application.properties` locally
- ✅ Use environment variables in production
- ✅ Share `.env.example` (without actual keys)
- ✅ Add API key files to `.gitignore`

**DON'T:**

- ❌ Commit API keys to Git
- ❌ Share your API keys publicly
- ❌ Put API keys in documentation files
- ❌ Push secrets to GitHub

### 4. Optional: OpenAI Configuration (Backup)

If you want to use OpenAI instead of Hugging Face:

1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Uncomment and set in `application.properties`:
   ```properties
   openai.api.key=sk-YourActualKeyHere
   ```
3. Remove `@Primary` annotation from `HuggingFaceEmbeddingService`
4. Add `@Primary` to `OpenAiEmbeddingService`

## Production Deployment

### Using Environment Variables

Instead of hardcoding in `application.properties`, use environment variables:

```properties
huggingface.api.key=${HUGGINGFACE_API_KEY}
openai.api.key=${OPENAI_API_KEY}
```

Then set environment variables:

**Linux/Mac:**

```bash
export HUGGINGFACE_API_KEY=hf_YourKeyHere
```

**Windows PowerShell:**

```powershell
$env:HUGGINGFACE_API_KEY="hf_YourKeyHere"
```

**Docker:**

```yaml
environment:
  - HUGGINGFACE_API_KEY=hf_YourKeyHere
```

## Verifying Your Setup

1. Start your application
2. Check logs for: `"Hugging Face API key configured"`
3. Test the embeddings endpoint:
   ```bash
   curl -X POST "http://localhost:8080/api/ai/embeddings/recompute?force=true"
   ```
4. If successful, you'll see:
   ```json
   {
     "total": 6,
     "message": "Successfully computed embeddings for 6 books",
     "updated": 6
   }
   ```

## Troubleshooting

### Error: "API key not configured"

- Check `application.properties` has your key
- Make sure there's no extra spaces or quotes
- Restart the application

### Error: "HTTP 401 Unauthorized"

- Your API key is invalid or expired
- Generate a new token from Hugging Face
- Update `application.properties`

### Error: "HTTP 429 Too Many Requests"

- Free tier limit reached (30K requests/month)
- Wait for the rate limit to reset
- Consider upgrading to paid tier or using caching

## Need Help?

- [Hugging Face Documentation](https://huggingface.co/docs/api-inference/index)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- Check `AI_FEATURES_SUMMARY.md` for technical details
- See `POSTMAN_TESTING_GUIDE.md` for testing instructions
