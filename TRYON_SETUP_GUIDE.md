# 🛍️ StyleMart — Virtual Try-On Feature: Complete Setup Guide

## What Was Added

The **AI Virtual Try-On** feature lets shoppers:
1. Upload a photo of themselves
2. Pick any dress/clothing from the shop
3. See an AI-generated preview of that outfit on their photo
4. Add to cart if they like it

It uses **Hugging Face's free API** running the **IDM-VTON** model (same model used by major fashion apps).

---

## Files Changed / Added

### Backend
| File | What Changed |
|------|-------------|
| `backend/controllers/aiController.js` | **Fully rewritten** — now calls real Hugging Face IDM-VTON AI model |
| `backend/.env` | Added `HUGGINGFACE_API_TOKEN` (you must fill this in) |
| `backend/.env.example` | Updated with token example |

### Frontend
| File | What Changed |
|------|-------------|
| `frontend/src/pages/TryOn.jsx` | **Fully rewritten** — drag-and-drop upload, real product picker, AI loading state, before/after comparison |
| `frontend/src/pages/TryOn.css` | **Fully rewritten** — polished UI |
| `frontend/src/components/ProductCard.jsx` | Added **"👗 Try On" button** on each clothing card |
| `frontend/src/components/ProductCard.css` | Added badge styles |

---

## Step-by-Step Setup

### Step 1 — Get a Free Hugging Face Token

1. Go to **https://huggingface.co** and click **Sign Up** (free)
2. Verify your email
3. Go to **Settings → Access Tokens** (https://huggingface.co/settings/tokens)
4. Click **New token** → give it any name → select **Read** type → click **Create**
5. Copy the token (starts with `hf_...`)

### Step 2 — Add the Token to Your .env

Open `backend/.env` and replace the placeholder:

```
HUGGINGFACE_API_TOKEN=hf_YOUR_ACTUAL_TOKEN_HERE
```

### Step 3 — Install Dependencies & Run Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### Step 4 — Run Frontend

```bash
cd frontend
npm install
npm start
```

Opens at **http://localhost:3000**

### Step 5 — Seed Products (if not done already)

In a new terminal:
```bash
cd backend
node seedProducts.js
```

### Step 6 — Use the Try-On Feature

**Option A — From any product card:**
- Go to Shop → hover a clothing card → click **"👗 Try On"** button
- This takes you directly to Try-On with that item pre-selected

**Option B — Direct:**
- Click **"Try On"** in the Navbar
- Upload your photo (drag & drop or click)
- Pick a clothing item from your shop's products
- Click **"✨ Try On Now"**
- Wait 30–90 seconds (first request wakes the AI model)
- See the result + add to cart!

---

## Important Notes About Timing

| Situation | Time |
|-----------|------|
| First try-on of the day | ~60–90 seconds (model wakes up) |
| Subsequent try-ons | ~30–40 seconds |
| If you get "model warming up" error | Wait 30s, try again |

This is completely normal for free Hugging Face hosting.

---

## Troubleshooting

### "API token error"
→ Check your `HUGGINGFACE_API_TOKEN` in `backend/.env` — make sure it starts with `hf_`

### "No products found" in Try-On picker
→ Make sure backend is running on port 5000 and you've seeded products with `node seedProducts.js`

### "Network error" on Try-On
→ Backend not running. Run `npm run dev` in the `backend/` folder.

### Try-On result looks wrong
→ The AI works best with:
- Clear, well-lit frontal photos
- Plain background
- Full upper body visible
- Photo resolution at least 512×512

### CORS error in browser console
→ Backend already has CORS enabled. Make sure frontend is on port 3000 and backend on 5000.

---

## How the AI Works (Technical)

The backend calls **Hugging Face Inference API** with:
- Your uploaded person photo (sent as base64)
- The garment image from the selected product (fetched by URL, sent as base64)  
- A text description of the garment

The IDM-VTON model:
1. Detects your body pose and shape
2. Warps the garment to fit your body contours
3. Blends it realistically with your photo
4. Returns the composited result image

The result is saved to `backend/uploads/` and served as a static file.
User photos are **deleted after processing** for privacy.

---

## Project Structure Reference

```
StyleMart/
├── backend/
│   ├── controllers/
│   │   └── aiController.js       ← Real AI integration here
│   ├── routes/
│   │   └── aiRoutes.js           ← POST /api/tryon endpoint
│   ├── middleware/
│   │   └── uploadMiddleware.js   ← Multer file upload handling
│   ├── uploads/                  ← Try-on results stored here
│   └── .env                      ← YOUR HUGGINGFACE_API_TOKEN goes here
└── frontend/
    └── src/
        ├── pages/
        │   └── TryOn.jsx         ← Main try-on page
        └── components/
            └── ProductCard.jsx   ← Has "Try On" button on each card
```
