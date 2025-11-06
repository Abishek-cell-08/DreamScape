import type { Dream, TrendsData, User } from '../types';
import { generateDreamImage, generateDreamInsights } from './geminiService';

const BASE_URL = "http://localhost:8081/api";

// Utility for handling API errors
async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  // 🟢 SIGNUP (Register new user)
  signup: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    console.log("Signing up:", { name, email });
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(res);
  },

  // 🟣 LOGIN (Authenticate user)
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    console.log("Logging in:", { email });
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  // 🌙 GET ALL DREAMS (Authenticated)
  getDreams: async (token: string): Promise<Dream[]> => {
    const res = await fetch(`${BASE_URL}/dreams`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  },

  // 💭 ADD A NEW DREAM (with insights + image generation)
  addDream: async (
    dream: Omit<Dream, 'id' | 'insights' | 'image'>,
    token: string
  ): Promise<Dream> => {
    console.log("Adding dream:", dream);
    // Generate AI-based insights & image before sending to backend
    const [insights, imageUrl] = await Promise.all([
      generateDreamInsights(dream.text),
      generateDreamImage(dream.text),
    ]);

    const res = await fetch(`${BASE_URL}/dreams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...dream,
        insights: JSON.stringify(insights),
        image: imageUrl,
      }),
    });

    return handleResponse(res);
  },

  // 📊 GET TRENDS (Aggregated emotion & theme stats)
  getTrends: async (token: string): Promise<TrendsData> => {
    const res = await fetch(`${BASE_URL}/trends`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Backend returns JSON like:
    // { totalDreams: 5, emotionTrends: { joy: 2, peace: 3 }, themeTrends: { freedom: 4, love: 1 } }

    const data = await handleResponse(res);

    // 🔁 Transform backend format into frontend TrendsData type
    const trends: TrendsData = {
      emotions: Object.entries(data.emotionTrends || {}).map(([name, value]) => ({
        name,
        value: Number(value),
      })),
      themes: Object.entries(data.themeTrends || {}).map(([name, count]) => ({
        name,
        count: Number(count),
      })),
      lucidityTrend: [], // optional: could add if your insights include lucidity scores
    };

    return trends;
  },
};
