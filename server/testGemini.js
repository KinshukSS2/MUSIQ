import { getAIHint } from "./utils/getAIHint.js";
import GeminiEnhanced from "./utils/geminiEnhanced.js";

// Test the improved Gemini integration
async function testGemini() {
  console.log("🧪 Testing Gemini AI Integration...\n");

  // Test 1: Basic hint generation
  console.log("1️⃣ Testing basic hint generation:");
  try {
    const hint = await getAIHint("Shape of You");
    console.log("✅ Basic hint:", hint);
  } catch (error) {
    console.log("❌ Basic hint failed:", error.message);
  }

  // Test 2: Enhanced Gemini features
  console.log("\n2️⃣ Testing enhanced Gemini features:");
  const gemini = new GeminiEnhanced();
  
  try {
    console.log("🎯 Smart hint (easy):");
    const easyHint = await gemini.getSmartHint("Despacito", "Luis Fonsi", "easy");
    console.log("✅", easyHint);

    console.log("\n🎯 Smart hint (hard):");
    const hardHint = await gemini.getSmartHint("Bohemian Rhapsody", "Queen", "hard");
    console.log("✅", hardHint);

    console.log("\n📚 Song fact:");
    const fact = await gemini.getSongFact("Imagine", "John Lennon");
    console.log("✅", fact);

    console.log("\n💭 Guess analysis:");
    const analysis = await gemini.analyzeGuess("Hotel California", "Sweet Child O' Mine", false);
    console.log("✅", analysis);

  } catch (error) {
    console.log("❌ Enhanced features failed:", error.message);
  }

  console.log("\n🎉 Gemini testing complete!");
}

testGemini();