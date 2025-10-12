import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiEnhanced {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  // Generate smart hints for songs
  async getSmartHint(songName, artist, difficulty = 'medium') {
    try {
      const difficultyPrompts = {
        easy: "Make the hint quite obvious and helpful",
        medium: "Make the hint moderately challenging but fair", 
        hard: "Make the hint cryptic and challenging for expert players"
      };

      const prompt = `Generate a ${difficulty} hint for this song:
Song: "${songName}"
Artist: "${artist}"

${difficultyPrompts[difficulty]}

Rules:
- Never mention the exact song title
- Don't mention the artist name directly
- Be creative and engaging
- Include musical style, era, or cultural context clues
- Keep it under 40 words
- Make it fun!

Example hints:
Easy: "This 90s pop anthem about empowerment became a karaoke favorite worldwide"
Medium: "A melancholic ballad from the king of pop that questions human nature"  
Hard: "Bohemian rhapsody meets rock opera in this 6-minute masterpiece"

Hint:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();

    } catch (error) {
      console.error("Error generating smart hint:", error);
      return this.getFallbackHint(difficulty);
    }
  }

  // Generate fun facts about songs after they're guessed
  async getSongFact(songName, artist) {
    try {
      const prompt = `Share an interesting, fun fact about this song:
Song: "${songName}" by ${artist}

Make it:
- Surprising or little-known
- Engaging for music lovers
- Under 30 words
- Factual and accurate

Examples:
"This song was written in just 10 minutes and became the artist's biggest hit"
"The iconic guitar riff was played on a homemade instrument"
"This track was originally meant for another famous artist"

Fun fact:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();

    } catch (error) {
      console.error("Error generating song fact:", error);
      return "This song has an interesting history!";
    }
  }

  // Analyze user's guess and provide feedback
  async analyzeGuess(userGuess, correctSong, isCorrect) {
    try {
      if (isCorrect) {
        return this.getSuccessMessage();
      }

      const prompt = `The user guessed "${userGuess}" but the correct answer is "${correctSong}".
Provide encouraging feedback in under 20 words that:
- Acknowledges their guess
- Gives them motivation to keep trying
- Is positive and supportive

Examples:
"Close guess! You're thinking in the right direction!"
"Good try! The actual song has a similar vibe!"
"Not quite, but your musical intuition is on point!"

Feedback:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();

    } catch (error) {
      console.error("Error analyzing guess:", error);
      return "Good try! Keep guessing!";
    }
  }

  // Generate success messages
  getSuccessMessage() {
    const messages = [
      "🎉 Brilliant! You nailed it!",
      "🔥 Perfect guess! You know your music!",
      "⭐ Amazing! You're a music master!",
      "🎵 Correct! That was impressive!",
      "🏆 Excellent! You've got great musical taste!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Fallback hints when AI fails
  getFallbackHint(difficulty) {
    const hints = {
      easy: [
        "This song is a real crowd-pleaser!",
        "You've definitely heard this on the radio!",
        "A popular track that everyone knows!",
        "This one's a classic favorite!"
      ],
      medium: [
        "This track has an amazing beat!",
        "The artist is known for their unique style!",
        "This song tells an interesting story!",
        "A memorable melody that sticks with you!"
      ],
      hard: [
        "This track showcases incredible musical craftsmanship!",
        "A deep cut that true music fans appreciate!",
        "This song influenced many other artists!",
        "Complex composition with layered meanings!"
      ]
    };

    const difficultyHints = hints[difficulty] || hints.medium;
    return difficultyHints[Math.floor(Math.random() * difficultyHints.length)];
  }
}

export default GeminiEnhanced;