import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

let serviceAccount;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, 'firebase-adminsdk.json');
if (fs.existsSync(jsonPath)) {
  // If JSON service account exists, load it directly (preferred)
  const raw = fs.readFileSync(jsonPath, 'utf8');
  serviceAccount = JSON.parse(raw);
} else {
  // Fallback to env-driven module
  serviceAccount = (await import('./firebase-adminsdk.js')).default;
}

// Ensure private_key has real newlines (handle both JSON and env-driven cases)
if (serviceAccount && typeof serviceAccount.private_key === 'string') {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (token === "guest") {
      req.uid = "guest";
      return next();
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
