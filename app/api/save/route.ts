import { NextRequest, NextResponse } from "next/server";
import { saveToNotion } from "@/lib/notion";
import { uploadToImgBB } from "@/lib/imgbb";
import { ReferenceData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const dataString = formData.get("data") as string;

    if (!image || !dataString) {
      return NextResponse.json(
        { error: "이미지와 데이터가 필요합니다" },
        { status: 400 }
      );
    }

    const data: ReferenceData = JSON.parse(dataString);

    console.log("Saving to Notion with data:", data);

    // Upload image to ImgBB
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    console.log("Uploading image to ImgBB...");
    const imageUrl = await uploadToImgBB(base64);
    console.log("Image uploaded:", imageUrl);

    const result = await saveToNotion(data, imageUrl);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: "Notion 저장 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
