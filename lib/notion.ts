import { Client } from "@notionhq/client";
import { ReferenceData } from "./types";
import fs from "fs";
import path from "path";

// Manually load environment variables
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env");
    const envContent = fs.readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts.join("=");
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    console.error("Error loading .env file in notion.ts:", error);
  }
}

loadEnvFile();

export async function saveToNotion(
  data: ReferenceData,
  imageUrl: string
): Promise<{ success: boolean; pageId: string }> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  console.log("Notion API Key exists:", !!notionApiKey);
  console.log("Database ID:", databaseId);

  if (!notionApiKey) {
    throw new Error("NOTION_API_KEY is not set");
  }

  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set");
  }

  const notion = new Client({
    auth: notionApiKey,
  });

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: data.name,
            },
          },
        ],
      },
      Type: {
        select: {
          name: data.type,
        },
      },
      Platform: {
        select: {
          name: data.platform,
        },
      },
      Memo: {
        rich_text: [
          {
            text: {
              content: data.memo,
            },
          },
        ],
      },
      Image: {
        files: [
          {
            name: "reference.jpg",
            external: {
              url: imageUrl,
            },
          },
        ],
      },
    },
  });

  return {
    success: true,
    pageId: response.id,
  };
}
