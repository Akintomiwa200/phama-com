import { NextRequest, NextResponse } from "next/server";

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
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json({ message: "AI service unavailable. Consult BNF and senior pharmacist." }, { status: 200 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

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
    return NextResponse.json({ message: "AI advisory unavailable. Please consult the BNF and a senior pharmacist." }, { status: 200 });
  }
}
