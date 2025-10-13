import dotenv from 'dotenv';
dotenv.config();

console.log('Testing Firebase private key format...');
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (privateKey) {
  console.log('Private key length:', privateKey.length);
  console.log('Private key starts with:', privateKey.substring(0, 50));
  
  // Fix the newlines
  const fixedKey = privateKey.replace(/\\n/g, '\n');
  console.log('Fixed key starts with:', fixedKey.substring(0, 50));
  console.log('Fixed key ends with:', fixedKey.substring(fixedKey.length - 50));
  
  // Test if it looks like valid PEM
  if (fixedKey.includes('-----BEGIN PRIVATE KEY-----') && fixedKey.includes('-----END PRIVATE KEY-----')) {
    console.log('✅ Private key format looks correct');
  } else {
    console.log('❌ Private key format is invalid');
  }
} else {
  console.log('❌ No private key found in environment');
}