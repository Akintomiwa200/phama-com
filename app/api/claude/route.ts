import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) return "";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    console.error("Gemini API error:", err);
    return "";
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type } = body;

  let prompt = "";

  if (type === "interaction") {
    const { drug, strength, patient, interactions } = body;
    prompt = `You are a clinical pharmacist AI advisor. A pharmacist needs clinical advice on the following drug interaction situation.

Patient: ${patient.name}, ${patient.age} years old
Conditions: ${patient.conditions.join(", ")}
New prescription: ${drug} ${strength}
Interactions detected:
${interactions.map((i: any) => `- ${i.drugs} (${i.severity}): ${i.effect}`).join("\n")}

Provide a concise 2-3 sentence clinical advisory covering:
1. The most important clinical risk
2. A specific alternative drug or management strategy
3. What to tell the prescriber

Respond in plain text only. No bullet points, no headers.`;
  } else if (type === "counselling") {
    const { drug, strength, patient } = body;
    prompt = `You are a clinical pharmacist. Generate exactly 5 patient counselling points for:
Drug: ${drug} ${strength}
Patient: ${patient.name}, ${patient.age} years old, conditions: ${patient.conditions?.join(", ")}

Return ONLY a JSON object with a "warnings" array of exactly 5 short strings (max 12 words each).
Example format: {"warnings": ["Take once daily at the same time", "Do not crush or chew tablets", ...]}
No other text.`;
  } else {
    return NextResponse.json({ message: "Unknown request type" }, { status: 400 });
  }

  try {
    const text = await callGemini(prompt);

    if (!text) {
      if (type === "counselling") {
        return NextResponse.json({
          warnings: [
            `Take ${body.drug} exactly as prescribed`,
            "Do not stop medication without medical advice",
            "Keep out of reach of children",
            "Store below 25°C away from sunlight",
            "Report any unusual side effects to your pharmacist",
          ]
        });
      }
      return NextResponse.json({ message: "AI service unavailable. Consult BNF and senior pharmacist." });
    }

    if (type === "counselling") {
      try {
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({
          warnings: [
            `Take ${body.drug} exactly as prescribed`,
            "Do not stop medication without medical advice",
            "Keep out of reach of children",
            "Store below 25°C away from sunlight",
            "Report any unusual side effects to your pharmacist",
          ]
        });
      }
    }

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ message: "AI advisory unavailable. Please consult the BNF and a senior pharmacist." });
  }
}
