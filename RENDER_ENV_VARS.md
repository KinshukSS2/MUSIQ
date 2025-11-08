# 🚀 Render Backend Deployment - Environment Variables

## ✅ Your Frontend URL
```
https://musiq-uni.vercel.app
```

---

## 📋 Complete Environment Variables for Render

After deploying from the Blueprint, add these environment variables in Render:

### 1. MongoDB
```
MONGO_URI=mongodb+srv://kinshuklit2005_db_user:3xmna3oqH5Lu5BjH@cluster0.wsb6jwo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 2. Frontend URL (Your Vercel App)
```
FRONTEND_URL=https://musiq-uni.vercel.app
```

### 3. Spotify API
```
SPOTIFY_CLIENT_ID=bd828cb52e7d4557bda151e1ad356e98
SPOTIFY_CLIENT_SECRET=4c6d0925eb754e4ab8259370e7a9d401
```

### 4. YouTube API
```
YOUTUBE_API_KEY=AIzaSyBC1R6nqw2JOHa1tnZAw2SvAmmIyg08HY4
```

### 5. Gemini API
```
GEMINI_API_KEY=AIzaSyBtdmN_eOks3tFv9sVeWaG_Zv4ZVDQJ368
```

### 6. Firebase Admin SDK (Backend)
```
FIREBASE_PROJECT_ID=musiq-1f1f1
FIREBASE_PRIVATE_KEY_ID=f68abf64d867f46f18568a2177d27f6f2bcfb2dd
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCX8aIh5N+4jQ1h
z2P0/cRWz57+4EJUUJDVlNAlmWiLZnHhQ9ZMDnZSkq2UEDUYKdTeS8A5CKKfmAMF
18SliDN7BbhIS4qoH/4b3R1WYuquFuBjUnf0DDhY2mKb+6IL1jAB85uAgheh/SJl
2eIl1+Nf+L1MJMgqQ4C31z2/CKYStj/DFhBo75UTWOxySVBiFqMK27Gsj0Az6+n0
rP9jJ8zjQjIuIi4dfFSQgXD8TCaYLVeOCoTVKObIWgA1F4TMDcFHA7YPS1m8VI+3
9CKBWm52cfTIp5sLugmMqfeaiXhE5v1+VIUhsrP4+XjLtqShypRxyFM9fVwaNtpv
u69vDz2HAgMBAAECggEAHrxRSLvsiX926ocyOBexRMJA7lvc7wNRGPM+W6y5miFB
/ghj7ASs6K0lEaNpqhakKcd2/dKCWvg7/E2WSMnRaBxTF8S4KqQ2GdrTmWrvAAI+
p7jB7QsfxtF+SwFO2Ugdc/ecSBWIxErZT3MQrQkLxJkjaaizGOGIwyd2JRORzIzj
cLty9T+XmI2ei6pTmLb8bhe1RrAXKUq1N9g2Tiy7mgAuyDLehA3XWAHCSHxEPMcd
KmWKf50JLnxrcIQlrdKCC65dbHKZtkG+bvGOctvQ9vdnOClSyhMkEnr16MjWWiRo
lQhI1FUKsd2md+yUBjYNQdPlCj7lQdffgSI0RkK2CQKBgQDI/8YnTignCqfIeBOj
iPbMFjBPStf4bNvl2P97cwDApytS6MXUSGTGKEpMwCKCHfS43Tve8IEy+9Hm3NYo
IyYdZdV7gG099nSPkwyf15m5sTtyIcJ80RS/SGujJO7AnQGwQjB+r8eDbG4KG3e7
/l6BdD6a09IIj15utcb/P3P41QKBgQDBhXtdg7Oyi4RMrbQnfRksu1CAcMpXwmRV
27t0Z6owqNm9OBTyLMFJ0aYm/eAh7+537Kz0AFr8R9tFX8F7094BuanLgbd3CZGp
49P15oSYhfHHz7nwzY/LbEEaZcFa7U1t9TJCfSjxu8p5kYqCs7gDd470wWrqeot2
J2nlORuK6wKBgQCdRTx3nrjeK4Ey43mCWPW6pJXyRP6NvCenRc5JeqeZFnRYsBey
zV5Eilvwh9m4c9X7G+fvvcFp8g3AFQVgbHgzQm3y738Kn59+g7G6FAmNeTapS+8Q
mMwiC3llMs25WmBq2K93QPTcSWgkcm+SYiryIdGmdZz+46cg+wyUxcJpbQKBgDuS
6vJTy+rn9jdgtff+E9ToaRTRJAk2J4si1Kc2DndiU31jmVcgHfSqnHqeZvQrl37F
lkybG2dUe5T0sGx9QXfIfxPN//ueL4BcSXEGoMUPXuoC8ZvGvECEN9p3frmOGesC
s5EyVHtuMxuPiVNJHhm7IYAJVu+OAAbEhV3yYZ83AoGAR+u5GcznZlt3UOP5Xgac
j72//VLPni4B6tuUjOaCpL16/XBhZjZ5KEo8NINM8mHGNwbhWxOPd4T0LmaoZdlt
FnzEOY4+LzTajSfZdSPkb6NJkcGfgJQ3gh8IsmLAMaq9I7KhL6qGEmKeka00Vp4E
nw7SneJCjgKOgaPd2h9lSqY=
-----END PRIVATE KEY-----

FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@musiq-1f1f1.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=108048418769476093341
```

### 7. MongoDB Atlas Auto IP Whitelist (Optional)
```
ATLAS_PUBLIC_KEY=qeozdkum
ATLAS_PRIVATE_KEY=b32c14cb-912a-4533-b43b-3449ba63ac22
ATLAS_PROJECT_ID=68ebe3c7e1b0b935cb4bff3d
```

---

## 🎯 Steps to Deploy on Render:

### 1. Deploy from Blueprint
1. Go to: https://dashboard.render.com/blueprints/new
2. Connect your GitHub repository: `KinshukSS2/MUSIQ`
3. Render will detect `render.yaml`
4. Click "Apply"

### 2. Add Environment Variables
After the service is created:
1. Go to your service dashboard
2. Click "Environment" in the left sidebar
3. Add all the variables listed above (copy-paste them)
4. Click "Save Changes"

### 3. Get Your Backend URL
After deployment completes, you'll get a URL like:
```
https://musiq-backend-xxxx.onrender.com
```

### 4. Update Vercel Frontend
Go to Vercel → Your project → Settings → Environment Variables

Add/Update:
```
VITE_API_URL=https://musiq-backend-xxxx.onrender.com
```

Then redeploy the frontend.

---

## ⚠️ Important Notes:

### For FIREBASE_PRIVATE_KEY on Render:
When pasting the private key, you have two options:

**Option 1: With newlines (Recommended)**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEF...
(paste the full key with line breaks)
-----END PRIVATE KEY-----
```

**Option 2: With \n escape sequences**
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEF...\n-----END PRIVATE KEY-----\n
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
- [ ] Test login/signup on production
- [ ] Test creating/joining rooms

---

## 🎉 Final URLs:

- **Frontend:** https://musiq-uni.vercel.app
- **Backend:** https://musiq-backend-xxxx.onrender.com (get this after deployment)

---

**Ready to deploy!** Just follow the steps above. 🚀
