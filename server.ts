import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK to prevent crashes on startup if key is missing as required by guidelines
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST APIs
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Parser: Accepts a custom paragraph or URL and extracts structured sentences, syntax pills, and vocabulary keywords.
app.post("/api/gemini/parse", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text prompt is required" });
  }

  try {
    const ai = getGenAI();
    const systemPrompt = `You are a high-end cognitive computational linguist specialized in the "Lingua AIOS" interface. 
You parse custom user inputs or short passages to build English learning chunks.
Break down the passage into 3-5 key natural English sentence lines.
For EACH sentence:
1. Translate it into highly natural Chinese.
2. Build an arrays of 'syntaxBlocks' where the sentence text is broken down into contiguous pills. Each pill MUST label its syntactic role from exactly: 'subject', 'verb', 'object', 'modifier', 'other'. Label the role in Chinese ('roleCn', e.g. '主语', '谓语', '宾语', '修饰语/前置介词', '其它'), and write a short, clear syntactic 'explanation' in Chinese.
And lastly, output 3 to 5 key vocabulary words from the passage, with phonetics, part of speech (e.g. 'v.', 'n.', 'adj.'), full English definition, Chinese definition, and an example sentence containing that word.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Parse the following English passage for learning purposes:\n\n"${text}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A elegant display title for this passage chunk (e.g. 'Steve Jobs Commencement CH.1' or summarized title)." },
            sentences: {
              type: Type.ARRAY,
              description: "Array of sentence lines parsed from the text.",
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "The full English sentence." },
                  translation: { type: Type.STRING, description: "Natural Chinese translation." },
                  syntaxBlocks: {
                    type: Type.ARRAY,
                    description: "Pills breaking down the sentence sentence tokens.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        token: { type: Type.STRING, description: "The English token/phrase chunk." },
                        role: { type: Type.STRING, description: "Must be one of: 'subject', 'verb', 'object', 'modifier', 'other'." },
                        roleCn: { type: Type.STRING },
                        explanation: { type: Type.STRING, description: "Short syntactic explanation." }
                      },
                      required: ["token", "role", "roleCn", "explanation"]
                    }
                  }
                },
                required: ["text", "translation", "syntaxBlocks"]
              }
            },
            vocabularies: {
              type: Type.ARRAY,
              description: "Key words extracted from the text.",
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  phonetic: { type: Type.STRING, description: "IPA phonetic transcription, eg. /ˈɡrædʒuət/" },
                  partOfSpeech: { type: Type.STRING, description: "eg. v., n., adj." },
                  definition: { type: Type.STRING, description: "Clear, simple English definition." },
                  definitionCn: { type: Type.STRING, description: "Matching concise Chinese definition." },
                  example: { type: Type.STRING, description: "Short natural usage sentence." }
                },
                required: ["word", "phonetic", "partOfSpeech", "definition", "definitionCn", "example"]
              }
            }
          },
          required: ["title", "sentences", "vocabularies"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("AI parse failure:", err);
    const msg = err.message || "";
    const isQuota = msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("limit") || msg.includes("RESOURCE_EXHAUSTED") || err.status === "RESOURCE_EXHAUSTED";
    res.status(500).json({
      error: isQuota 
        ? "Gemini API rate or daily quota limit exceeded. Translating offline via Local Guess matrix."
        : msg || "Gemini AI parsing failure. Check your API key setting in Secrets panel.",
      isApiLimit: true,
      isQuotaLimit: isQuota
    });
  }
});

// AI Definition API: Looks up definitions dynamically to support unlimited recursive lookup ("嵌套查词")
app.post("/api/gemini/define", async (req, res) => {
  const { word } = req.body;
  if (!word) {
    return res.status(400).json({ error: "Word is required" });
  }

  try {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Provide dictionary specs for the English word: "${word}"`,
      config: {
        systemInstruction: "You are the central dictionary server for Lingua AIOS. Provide phonetic sound notation (IPA), part of speech, simple prioritized English definition, Chinese translation, and a sample sentence. Keep answers crisp and formatted properly in JSON schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING },
            definition: { type: Type.STRING },
            definitionCn: { type: Type.STRING },
            example: { type: Type.STRING }
          },
          required: ["word", "phonetic", "partOfSpeech", "definition", "definitionCn", "example"]
        }
      }
    });

    const defData = JSON.parse(response.text || "{}");
    res.json(defData);
  } catch (err: any) {
    console.error("AI lookup failure:", err);
    const msg = err.message || "";
    const isQuota = msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("limit") || msg.includes("RESOURCE_EXHAUSTED") || err.status === "RESOURCE_EXHAUSTED";
    res.status(500).json({
      error: isQuota 
        ? "Gemini API rate or daily quota limit exceeded. Translating offline via Local Guess matrix."
        : msg || "Failed to look up word via Gemini API.",
      fallbackWord: word,
      isQuotaLimit: isQuota
    });
  }
});

// Vite & Static Asset integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
