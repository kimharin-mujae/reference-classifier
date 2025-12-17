import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    console.log("ANTHROPIC_API_KEY exists:", !!process.env.ANTHROPIC_API_KEY);
    console.log("ANTHROPIC_API_KEY length:", process.env.ANTHROPIC_API_KEY?.length);

    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "이미지가 필요합니다" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    const result = await analyzeImage(base64, image.type);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "이미지 분석 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
