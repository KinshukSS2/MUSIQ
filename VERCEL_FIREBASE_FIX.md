# 🔥 Vercel Firebase Environment Variables Setup

## ❌ Error: auth/invalid-api-key

This error means your Firebase environment variables are missing or incorrect on Vercel.

---

## ✅ How to Fix

### Step 1: Get Your Firebase Config

1. Go to **Firebase Console:** https://console.firebase.google.com
2. Select your project
3. Click the **gear icon** → **Project settings**
4. Scroll down to **"Your apps"**
5. Click on your **web app** or create one if you don't have it
6. Copy the **firebaseConfig** object values

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

### Step 2: Add to Vercel Environment Variables

1. **Go to your Vercel project:** https://vercel.com/dashboard
2. **Click on your project**
3. **Go to: Settings → Environment Variables**
4. **Add each variable individually:**

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` | Production, Preview, Development |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Production, Preview, Development |
| `VITE_FIREBASE_PROJECT_ID` | `your-project-id` | Production, Preview, Development |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.firebasestorage.app` | Production, Preview, Development |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` | Production, Preview, Development |
| `VITE_FIREBASE_APP_ID` | `1:123456789012:web:xxxxxxxxxxxxx` | Production, Preview, Development |

**Important:** 
- ✅ Make sure to select **ALL three environments** (Production, Preview, Development)
- ✅ Double-check for typos
- ✅ No quotes needed in Vercel's input fields

### Step 3: Also Add Backend URL

While you're there, add:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Production, Preview, Development |

Or use `http://localhost:5000` temporarily if backend isn't deployed yet.

---

## 🔄 Step 4: Redeploy

After adding all variables:

1. **Go to "Deployments" tab**
2. **Click the three dots (•••)** on your latest deployment
3. **Click "Redeploy"**
4. **Select "Use existing Build Cache"**
5. **Click "Redeploy"**

---

## ✅ Verify Variables Are Set

### Method 1: Check in Vercel Dashboard
- Go to Settings → Environment Variables
- You should see all 7 variables (6 Firebase + 1 API URL)

### Method 2: Check in Browser Console
After redeploying, open your site and check console:
```javascript
// Open browser console and type:
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
```

If it shows `undefined`, the variables aren't set correctly.

---

## 🚨 Common Mistakes

### ❌ Wrong: Using quotes in Vercel
```
"AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  // Don't do this
```

### ✅ Correct: No quotes
```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### ❌ Wrong: Missing VITE_ prefix
```
FIREBASE_API_KEY  // Won't work
```

### ✅ Correct: With VITE_ prefix
```
VITE_FIREBASE_API_KEY  // This works
```

### ❌ Wrong: Not selecting all environments
- Only selecting "Production" → Preview/Development won't work

### ✅ Correct: Select all three
- Production ✓
- Preview ✓
- Development ✓

---

## 📝 Your Current Firebase Config

Your code uses these in `client/src/config/firebase.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

All these `import.meta.env.VITE_*` values need to be set in Vercel!

---

## 🔍 Double Check Your .env.example

For reference, here's what your variables should look like (with your actual values):

```bash
# From client/.env.example
VITE_API_URL=https://your-backend.onrender.com

VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
```

---

## ✅ After Adding Variables

1. ✅ All 7 environment variables added
2. ✅ All environments selected (Production, Preview, Development)
3. ✅ Redeployed the site
4. ✅ Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
5. ✅ Test login/signup functionality

---

## 🎉 Success Indicators

After fixing, you should:
- ✅ No more `auth/invalid-api-key` error
- ✅ Login/Signup pages work
- ✅ Firebase authentication functional
- ✅ Can create/join rooms (after backend is deployed)

---

**Last Updated:** November 8, 2025
**Status:** ⚠️ Waiting for environment variables to be added
**Next Step:** Add Firebase env vars to Vercel → Redeploy
