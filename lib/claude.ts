import Anthropic from "@anthropic-ai/sdk";
import { ReferenceData } from "./types";
import fs from "fs";
import path from "path";

// Manually load environment variables from .env file
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env");
    console.log("Loading .env from:", envPath);
    const envContent = fs.readFileSync(envPath, "utf-8");
    console.log(".env content length:", envContent.length);
    const lines = envContent.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts.join("=");
        console.log(`Setting ${key}:`, value ? `${value.substring(0, 10)}...` : "empty");
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
    console.log("After loading, ANTHROPIC_API_KEY exists:", !!process.env.ANTHROPIC_API_KEY);
    console.log("After loading, ANTHROPIC_API_KEY value:", process.env.ANTHROPIC_API_KEY?.substring(0, 20));
  } catch (error) {
    console.error("Error loading .env file:", error);
  }
}

loadEnvFile();

export async function analyzeImage(imageBase64: string, mimeType: string): Promise<ReferenceData> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: `이 UI/UX 레퍼런스 이미지를 분석해주세요.

다음 JSON 형식으로만 응답하세요:
{
  "name": "이미지를 설명하는 짧은 제목 (한글)",
  "type": "Hero | Card | Button | Layout | Form | Navigation | Other 중 하나",
  "platform": "Web | App 중 하나",
  "memo": "디자이너가 참고할 수 있는 핵심 포인트 1-2문장 (한글)"
}`,
          },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from Claude response");
  }

  const result = JSON.parse(jsonMatch[0]) as ReferenceData;
  return result;
}
