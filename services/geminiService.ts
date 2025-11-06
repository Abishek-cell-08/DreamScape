// geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DreamInsights } from "../types";

// ✅ Initialize Gemini client with your API key
// Make sure VITE_API_KEY is defined in your .env file (e.g., VITE_API_KEY="AIza...")
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY as string);

// 🔮 Generate Dream Insights using Gemini
export async function generateDreamInsights(
  dreamText: string
): Promise<DreamInsights | null> {
  try {
    // 🧠 Build a structured prompt for JSON output
    const prompt = `
      Analyze the following dream description and return a JSON response with this exact structure:

      {
        "summary": "1–2 sentence summary of the dream",
        "themes": ["list of 3–5 main themes"],
        "emotions": {
          "joy": 0.7,
          "fear": 0.2,
          "sadness": 0.1,
          "wonder": 0.4,
          "surprise": 0.3,
          "calm": 0.6
        },
        "entities": ["key people, places, or objects"],
        "lucidity": 0.8
      }

      Dream: "${dreamText}"

      Return only valid JSON — do not include any explanations, comments, or markdown formatting.
    `;

    // ✅ Use the stable and supported model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // 🧹 Step 1: Clean up markdown fences if Gemini adds them
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    // 🧠 Step 2: Try parsing the JSON safely
    let parsed: DreamInsights;
    try {
      parsed = JSON.parse(cleaned) as DreamInsights;
    } catch (parseErr) {
      console.warn("⚠️ Gemini returned non-JSON text. Using fallback format.");
      console.warn("Raw response:", rawText);
      parsed = {
        summary: "AI response could not be parsed into structured insights.",
        themes: [],
        emotions: {},
        entities: [],
        lucidity: 0,
      };
    }

    return parsed;
  } catch (error) {
    console.error("❌ Error generating dream insights:", error);

    // Return a safe fallback object instead of null (for frontend consistency)
    return {
      summary: "Could not generate AI insights for this dream.",
      themes: [],
      emotions: {},
      entities: [],
      lucidity: 0,
    };
  }
}

// 🎨 Generate Dream Image (placeholder for free users)
export async function generateDreamImage(dreamText: string): Promise<string> {
  try {
    // Placeholder random image generator using dream text as seed
    return `https://picsum.photos/seed/${encodeURIComponent(dreamText)}/400/400`;
  } catch (error) {
    console.error("❌ Error generating dream image:", error);
    return "https://via.placeholder.com/400?text=Dream+Image";
  }
}
