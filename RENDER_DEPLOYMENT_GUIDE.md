# 🚀 Quick Render.com Deployment Guide

## ✅ Step-by-Step Instructions

Your `render.yaml` file has been created and pushed to GitHub. Follow these steps:

---

## 1️⃣ Go to Render Dashboard

Visit: https://dashboard.render.com/blueprints/new

---

## 2️⃣ Deploy from Blueprint

1. **Connect your GitHub repository**
   - If not connected, click "Connect Account" and authorize Render
   - Search for: `KinshukSS2/MUSIQ`
   - Click "Connect"

2. **Render will detect the render.yaml file automatically**
   - Blueprint Name: `musiq-backend` (auto-filled)
   - Click "Apply"

---

## 3️⃣ Configure Environment Variables

After the service is created, you MUST add these environment variables:

### Required Variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/musiq?retryWrites=true&w=majority
FRONTEND_URL=https://your-netlify-app.netlify.app
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_firebase_client_id
```

### Optional Variables (for MongoDB Atlas auto IP whitelist):
```
ATLAS_PUBLIC_KEY=your_atlas_public_key
ATLAS_PRIVATE_KEY=your_atlas_private_key
ATLAS_PROJECT_ID=your_atlas_project_id
```

---

## 4️⃣ Get Your Backend URL

Once deployed, Render will give you a URL like:
```
https://musiq-backend.onrender.com
```

Copy this URL - you'll need it for the frontend!

---

## 5️⃣ Update Frontend Environment Variable

On **Netlify**, set:
```
VITE_API_URL=https://musiq-backend.onrender.com
```

---

## 6️⃣ Update CORS in Backend

Make sure your backend's `server/server.js` includes your Netlify URL in the CORS configuration:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,  // This should be your Netlify URL
  'https://your-app.netlify.app'  // Add this explicitly
].filter(Boolean);
```

---

## 🎉 Done!

Your backend will be deployed on Render's free tier with:
- ✅ Automatic deploys on git push
- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ Node.js 18 runtime
- ✅ Located in Oregon region

---

## 📝 Important Notes:

1. **Free Tier Limitations:**
   - Service spins down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - 750 hours/month free (enough for 1 service running 24/7)

2. **MongoDB Atlas:**
   - Make sure to whitelist Render's IP: `0.0.0.0/0` (allow all)
   - Or use the auto-whitelist scripts in your project

3. **Logs:**
   - View logs in Render dashboard → Your Service → Logs
   - Monitor for any startup errors

---

## 🔄 Redeploying

To redeploy after code changes:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically detect the push and redeploy!

---

## 🆘 Troubleshooting

**Service won't start?**
- Check the Logs tab in Render dashboard
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct

**CORS errors?**
- Add your Netlify URL to FRONTEND_URL env variable
- Update allowedOrigins in server.js

**Can't connect to MongoDB?**
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Or add Render's outbound IPs

---

**Last Updated:** November 8, 2025
