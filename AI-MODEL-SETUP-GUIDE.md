# AI Virtual Try-On Model - Complete Setup Guide

## Overview
This guide will help you integrate a real AI Virtual Try-On model into your Dressify application using Hugging Face's free API.

---

## Prerequisites

1. **Node.js** installed (v14 or higher)
2. **Internet connection** for API calls
3. **Hugging Face account** (free)

---

## Step 1: Create Hugging Face Account

1. Go to: https://huggingface.co/join
2. Sign up with your email
3. Verify your email address
4. Login to your account

---

## Step 2: Generate API Token

1. Go to: https://huggingface.co/settings/tokens
2. Click "New token"
3. Give it a name: `dressify-tryon`
4. Select "Read" access
5. Click "Generate"
6. **Copy the token** (you won't see it again!)

---

## Step 3: Add API Token to Your Project

1. Open the `.env` file in the `backend` folder
2. Add this line:
   ```
   HUGGING_FACE_API_KEY=your_token_here
   ```
3. Replace `your_token_here` with your actual token
4. Save the file

---

## Step 4: Install Required Packages

Open terminal in the `backend` folder and run:

```bash
npm install axios form-data
```

---

## Step 5: Backend API Implementation

The backend code is already set up in `server.js`. The try-on endpoint uses:
- **Model**: `yisol/IDM-VTON` (Best free virtual try-on model)
- **API**: Hugging Face Inference API

---

## Step 6: Test the Integration

1. Start your backend server:
   ```bash
   cd backend
   node server.js
   ```

2. Start your frontend:
   ```bash
   cd frontend
   # Open index.html in browser or use live server
   ```

3. Try uploading:
   - A person photo (full body, front-facing works best)
   - A clothing item (clear image, no background preferred)
   - Click "Generate Result"

---

## Expected Behavior

✅ **Success**: 
- Processing animation shows
- Result image appears after 10-30 seconds
- You can save/download the result

❌ **If it fails**:
- Check API token is correct
- Check internet connection
- Check image formats (JPG/PNG only)
- Check image sizes (< 5MB recommended)

---

## API Limits (Free Tier)

- **Rate Limit**: ~1000 requests/month
- **Processing Time**: 10-30 seconds per image
- **Image Size**: Max 5MB
- **No credit card required**

---

## Alternative: Use Demo Mode

If you want to test without API:
1. The current code has a fallback demo mode
2. It shows a sample result for testing UI/UX
3. Replace with real API when ready

---

## Troubleshooting

### Error: "Invalid API Key"
- Check your token in `.env` file
- Make sure there are no extra spaces
- Regenerate token if needed

### Error: "Model loading"
- First request takes longer (model loads)
- Wait 30-60 seconds
- Try again

### Error: "Rate limit exceeded"
- You've used your monthly quota
- Wait for next month or upgrade plan
- Use demo mode temporarily

---

## Best Practices

1. **Image Quality**:
   - Use high-resolution images
   - Clear, well-lit photos
   - Front-facing poses work best

2. **Clothing Images**:
   - White/transparent background preferred
   - Full garment visible
   - No models wearing the clothes

3. **Performance**:
   - Cache results to avoid re-processing
   - Compress images before upload
   - Show loading indicators

---

## Upgrade Options

### Paid Plans (Optional):
- **Hugging Face Pro**: $9/month - Higher limits
- **Replicate API**: Pay-per-use - More reliable
- **Custom Model**: Host your own - Full control

---

## Support

- **Hugging Face Docs**: https://huggingface.co/docs
- **Model Page**: https://huggingface.co/yisol/IDM-VTON
- **Community**: https://huggingface.co/spaces

---

## Summary

✅ Your app is ready for AI integration!
✅ Just add your Hugging Face API key
✅ Everything else is configured
✅ Test with sample images first

**Good luck with your AI Virtual Try-On app!** 🚀
