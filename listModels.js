// listModels.js
import fetch from "node-fetch";  // If Node <18; else native fetch works fine

// 🗝️ Replace this with your actual Gemini API key
const apiKey = "AIzaSyDUYwj-n5IOqyBNrFp8azmAkWFys0UceuA";

async function listModels() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log("✅ Available Models:\n");
    data.models.forEach((model) => {
      console.log(`• ${model.name}`);
      console.log(`  Description: ${model.description}`);
      console.log(`  Supported: ${model.supportedGenerationMethods.join(", ")}`);
      console.log("--------------------------------------------");
    });
  } catch (err) {
    console.error("❌ Failed to list models:", err);
  }
}

listModels();
