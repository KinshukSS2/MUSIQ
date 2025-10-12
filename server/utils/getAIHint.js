import { GoogleGenerativeAI } from "@google/generative-ai";

export const getAIHint = async (songName) => {
  try {
    // Initialize the Gemini AI model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Give me a fun, creative, and helpful hint for the song "${songName}".
    
Rules:
- Don't mention the exact title or give it away directly
- Make it creative and engaging
- Include clues about the mood, genre, or era if helpful
- Keep it under 50 words
- Make it challenging but fair

Example: "This upbeat track from the 90s will make you want to dance all night. The artist was known for their powerful vocals and this became their signature anthem."

Song: "${songName}"
Hint:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const hint = response.text();

    return hint.trim();
  } catch (err) {
    console.error("Error generating AI hint:", err);
    // Fallback to basic hints
    const fallbackHints = [
      "This song is a real crowd-pleaser!",
      "You've probably heard this one on the radio.",
      "This track has an amazing beat!",
      "A classic that never gets old.",
      "This song always gets people singing along!"
    ];
    return fallbackHints[Math.floor(Math.random() * fallbackHints.length)];
  }
};