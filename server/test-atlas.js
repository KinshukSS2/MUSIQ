import dotenv from 'dotenv';
import MongoAtlasIPManager from './utils/mongoIPManager.js';

dotenv.config();

async function testAtlasConnection() {
  console.log('🧪 Testing MongoDB Atlas API connection...\n');
  
  // Check if we have the required environment variables
  const publicKey = process.env.ATLAS_PUBLIC_KEY;
  const privateKey = process.env.ATLAS_PRIVATE_KEY;
  const projectId = process.env.ATLAS_PROJECT_ID;
  
  console.log('📋 Configuration check:');
  console.log(`   ATLAS_PUBLIC_KEY: ${publicKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`   ATLAS_PRIVATE_KEY: ${privateKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`   ATLAS_PROJECT_ID: ${projectId ? '✅ Set' : '❌ Missing'}\n`);
  
  if (!publicKey || !privateKey || !projectId) {
    console.log('❌ Please set all required Atlas API credentials in your .env file');
    process.exit(1);
  }
  
  // Test the IP manager
  const ipManager = new MongoAtlasIPManager(publicKey, privateKey, projectId);
  
  try {
    const result = await ipManager.ensureIPWhitelisted();
    
    if (result.success) {
      console.log('\n🎉 Atlas API test successful!');
      console.log(`   Action: ${result.action}`);
      console.log(`   IP: ${result.ip}`);
    } else {
      console.log('\n❌ Atlas API test failed:', result.error);
    }
  } catch (error) {
    console.log('\n❌ Unexpected error:', error.message);
  }
}

testAtlasConnection();