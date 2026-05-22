import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: {
    type?: string;
    drug?: string;
    strength?: string;
    patient?: { name?: string; age?: number; conditions?: string[] };
    interactions?: { drugs: string; severity: string; effect: string }[];
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && body.type === "interaction" && body.interactions?.length) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          messages: [
            {
              role: "user",
              content: `As a clinical pharmacist, give a brief advisory (3-4 sentences) for dispensing ${body.drug} to ${body.patient?.name}, age ${body.patient?.age}, with interactions: ${JSON.stringify(body.interactions)}. Be direct and actionable.`,
            },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text;
        if (text) return Response.json({ message: text });
      }
    } catch {
      // fall through to static response
    }
  }

  if (body.type === "interaction") {
    const count = body.interactions?.length ?? 0;
    return Response.json({
      message:
        count > 0
          ? `Review ${count} interaction(s) for ${body.drug} before dispensing. Contact the prescriber if severity is HIGH or CONTRAINDICATED. Document counselling in the audit log.`
          : `No major interactions flagged for ${body.drug}. Proceed with standard verification and patient counselling.`,
    });
  }

  if (body.type === "counselling") {
    return Response.json({
      warnings: [
        `Take ${body.drug} ${body.strength ?? ""} exactly as prescribed`,
        "Report unusual side effects to your pharmacist or doctor promptly",
        "Do not share this medication with others",
        "Store according to label instructions; keep out of reach of children",
      ],
    });
  }

  return Response.json({ message: "AI advisory unavailable.", warnings: [] });
}
