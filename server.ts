import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "dummy-key",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint to generate app ideas using Gemini
app.post("/api/generate-ideas", async (req, res) => {
  try {
    const { budget, timeCommitment, skills, niche, monetization } = req.body;

    const prompt = `Sei un analista di mercato senior ed esperto di strategie per app mobile e web.
Basandoti sui seguenti parametri utente:
- Budget iniziale: ${budget}
- Tempo disponibile: ${timeCommitment}
- Skill tecniche: ${skills}
- Nicchia preferita: ${niche}
- Modello di monetizzazione preferito: ${monetization}

Genera esattamente 5 idee di app innovative, realistiche e ad alto potenziale di profitto per il mercato attuale.
Rispondi esclusivamente in formato JSON valido (senza blocchi di codice markdown aggiuntivi se possibile, o dentro un blocco json standard) attenendoti rigorosamente a questo schema:
[
  {
    "id": "string (univoco, es. idea-1)",
    "title": "Nome accattivante dell'app",
    "tagline": "Una frase d'impatto che spiega la value proposition",
    "category": "AI | Fintech | Health | Produttività | Gaming | E-commerce | Education | Social",
    "problem": "Il problema specifico non risolto o migliorabile nel mercato",
    "targetAudience": "Il target di utenti ideale (es. freelancer, studenti, PMI)",
    "usp": "Unique Selling Proposition (perché batte i competitor)",
    "businessModel": "Spiegazione del modello di monetizzazione scelto",
    "estimatedMRR": "Stima del fatturato mensile a 12 mesi (es. €3.000 - €12.000)",
    "mvpTimeWeeks": 4, // numero di settimane stimate per il MVP
    "competitors": ["Competitor 1", "Competitor 2"],
    "difficultyLevel": 3, // numero da 1 a 5
    "techStack": ["React", "Node.js", "Tailwind", "Gemini API"],
    "marketValidationScore": 88 // punteggio da 0 a 100
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "Sei un assistente di business intelligence ed esperto di startup digitali.",
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Nessuna risposta ricevuta da Gemini.");
    }

    // Clean up potential markdown formatting if present
    let cleanJson = text.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const ideas = JSON.parse(cleanJson);
    res.json({ success: true, ideas });
  } catch (error: any) {
    console.error("Error generating ideas:", error);
    res.status(500).json({ success: false, error: error.message || "Errore durante la generazione delle idee." });
  }
});

// API endpoint for competitor & market gap analysis
app.post("/api/competitor-analysis", async (req, res) => {
  try {
    const { category, query } = req.body;

    const prompt = `Analizza il mercato per la categoria "${category}" e la specifica richiesta o competitor "${query}".
Fornisci un'analisi dettagliata in formato JSON con la seguente struttura:
{
  "marketOverview": "Panoramica sintetica dello stato di mercato attuale, trend di crescita e barriere d'ingresso.",
  "topCompetitors": [
    {
      "name": "Nome del Competitor",
      "pricing": "Modello di prezzo (es. Freemium €9/mese)",
      "strengths": ["Punto di forza 1", "Punto di forza 2"],
      "weaknesses": ["Debolezza 1", "Debolezza 2"],
      "marketShare": "Stima (es. 28%)"
    }
  ],
  "marketGaps": [
    {
      "gapTitle": "Titolo del Gap di Mercato",
      "description": "Spiegazione di quale esigenza non è soddisfatta dai competitor attuali",
      "opportunityScore": 92
    }
  ],
  "strategicAdvice": "Consiglio strategico actionable per entrare in questo mercato con successo."
}
Rispondi SOLO in JSON valido.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    let cleanJson = response.text?.trim() || "{}";
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const analysis = JSON.parse(cleanJson);
    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error("Competitor analysis error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint for AI Market Advisor chat
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { messages } = req.body;
    // messages is array of { role: 'user'|'model', content: string }

    const formattedHistory = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const chat = ai.chats.create({
      model: "gemini-3.8-flash",
      history: formattedHistory.slice(0, -1),
      config: {
        systemInstruction: "Sei TrendHunter AI Advisor, un consulente di venture building ed esperto di monetizzazione di app mobile e web. Fornisci risposte pratiche, orientate al ROI, strategiche e in italiano.",
      },
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage({ message: lastMessage });

    res.json({ success: true, reply: result.text });
  } catch (error: any) {
    console.error("AI chat error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint for manual custom sector trend and idea research
app.post("/api/custom-sector-research", async (req, res) => {
  try {
    const { sector } = req.body;
    if (!sector || !sector.trim()) {
      return res.status(400).json({ success: false, error: "Specifica un settore valido." });
    }

    const prompt = `Sei un analista di mercato senior e venture capitalist specializzato in app mobile e web.
L'utente ha inserito manualmente il seguente settore o nicchia di mercato da analizzare: "${sector}".

Fornisci un'analisi approfondita e realistica in formato JSON puro (senza markdown aggiuntivi se possibile) con la seguente struttura esatta:
{
  "sectorName": "${sector}",
  "marketOverview": "Panoramica dettagliata dello stato di mercato, trend attuali e opportunità in questo settore.",
  "aiFeasibilityScore": 85,
  "growthRate": "+120% YoY",
  "searchVolume": "2.4M/mo",
  "competitionLevel": "Media",
  "monetizationBreakdown": {
    "primaryModel": "Abbonamento mensile (SaaS / Freemium)",
    "recommendedPricing": "€9.99/mese o €79/anno",
    "arpuEstimate": "€45 / utente anno",
    "notes": "Spiegazione sintetica del perché questo modello funziona in questo settore."
  },
  "topCompetitors": ["Competitor A", "Competitor B", "Competitor C"],
  "marketGap": "Il principale gap o inefficienza non ancora risolta dai leader attuali.",
  "ideas": [
    {
      "id": "custom-idea-1",
      "title": "Nome accattivante dell'app",
      "tagline": "Value proposition d'impatto",
      "category": "AI",
      "problem": "Problema specifico affrontato",
      "targetAudience": "Target ideale",
      "usp": "Unique Selling Proposition",
      "businessModel": "Modello di ricavo",
      "estimatedMRR": "€3.000 - €8.000",
      "mvpTimeWeeks": 4,
      "competitors": ["Competitor 1", "Competitor 2"],
      "difficultyLevel": 3,
      "techStack": ["React", "Node.js", "Tailwind", "Gemini API"],
      "marketValidationScore": 90
    },
    {
      "id": "custom-idea-2",
      "title": "Secondo nome app",
      "tagline": "Value proposition alternativa",
      "category": "Produttività",
      "problem": "Problema specifico affrontato",
      "targetAudience": "Target ideale",
      "usp": "Unique Selling Proposition",
      "businessModel": "Modello di ricavo",
      "estimatedMRR": "€4.000 - €10.000",
      "mvpTimeWeeks": 6,
      "competitors": ["Competitor X"],
      "difficultyLevel": 4,
      "techStack": ["React Native", "TypeScript", "OpenAI/Gemini"],
      "marketValidationScore": 85
    }
  ]
}
Rispondi SOLO in JSON valido.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    let cleanJson = response.text?.trim() || "{}";
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const data = JSON.parse(cleanJson);
    res.json({ success: true, research: data });
  } catch (error: any) {
    console.error("Custom sector research error:", error);
    res.status(500).json({ success: false, error: error.message || "Errore durante l'analisi del settore." });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  const port = process.env.PORT || 3000;

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(port, () => {
    console.log(`TrendHunter AI running on http://localhost:${port}`);
  });
}

startServer();
