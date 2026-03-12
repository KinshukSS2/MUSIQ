# 🚀 Render Backend Deployment - Environment Variables

⚠️ **SECURITY WARNING**: This is a template file. Never commit the actual `RENDER_ENV_VARS.md` file with real credentials!

---

## ✅ Your Frontend URL
```
https://your-app.vercel.app
```

---

## 📋 Complete Environment Variables for Render

After deploying from the Blueprint, add these environment variables in Render:

### 1. MongoDB
```
MONGO_URI=your_mongodb_connection_string_here
```

### 2. Frontend URL (Your Vercel App)
```
FRONTEND_URL=https://your-app.vercel.app
```

### 3. Spotify API
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 4. YouTube API
```
YOUTUBE_API_KEY=your_youtube_api_key
```

### 5. Gemini API
```
GEMINI_API_KEY=your_gemini_api_key
```

### 6. Firebase Admin SDK (Backend)
```
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_CLIENT_ID=your_firebase_client_id
```

### 7. MongoDB Atlas Auto IP Whitelist (Optional)
```
ATLAS_PUBLIC_KEY=your_atlas_public_key
ATLAS_PRIVATE_KEY=your_atlas_private_key
ATLAS_PROJECT_ID=your_atlas_project_id
```

---

## 🎯 Steps to Deploy on Render:

### 1. Deploy from Blueprint
1. Go to: https://dashboard.render.com/blueprints/new
2. Connect your GitHub repository
3. Render will detect `render.yaml`
4. Click "Apply"

### 2. Add Environment Variables
After the service is created:
1. Go to your service dashboard
2. Click "Environment" in the left sidebar
3. Add all the variables listed above with your actual values
4. Click "Save Changes"

### 3. Get Your Backend URL
After deployment completes, you'll get a URL like:
```
https://your-app-backend.onrender.com
```

### 4. Update Vercel Frontend
Go to Vercel → Your project → Settings → Environment Variables

Add/Update:
```
VITE_API_URL=https://your-app-backend.onrender.com
```

Then redeploy the frontend.

---

## ⚠️ Important Notes:

### For FIREBASE_PRIVATE_KEY on Render:
When pasting the private key, you have two options:

**Option 1: With newlines (Recommended)**
```
-----BEGIN PRIVATE KEY-----
(paste the full key with line breaks)
-----END PRIVATE KEY-----
```

**Option 2: With \n escape sequences**
```
-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

### MongoDB Atlas IP Whitelist:
Either:
- Add `0.0.0.0/0` to whitelist all IPs in MongoDB Atlas
- Or use the ATLAS variables for auto-whitelist

---

## ✅ Deployment Checklist:

- [ ] Render service deployed from blueprint
- [ ] All environment variables added
- [ ] Backend URL obtained
- [ ] Vercel VITE_API_URL updated with backend URL
- [ ] Frontend redeployed

---

## 🔒 Security Best Practices:

1. Never commit files with real credentials
2. Keep `RENDER_ENV_VARS.md` in `.gitignore`
3. Use `.env` files locally and add them to `.gitignore`
4. Store credentials securely in:
   - Render Environment Variables (for backend)
   - Vercel Environment Variables (for frontend)
5. Rotate API keys regularly
