"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ResultEditor from "@/components/ResultEditor";
import { ReferenceData } from "@/lib/types";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ReferenceData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>("");

  const handleImageSelect = async (file: File, preview: string) => {
    setImage(file);
    setImagePreview(preview);
    setResult(null);
    setSaved(false);
    setError("");

    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("분석 실패");
      }

      const data: ReferenceData = await response.json();
      setResult(data);
    } catch (err) {
      setError("이미지 분석 중 오류가 발생했습니다");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!image || !result) return;

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("data", JSON.stringify(result));

      const response = await fetch("/api/save", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("저장 실패");
      }

      setSaved(true);

      setTimeout(() => {
        setImage(null);
        setImagePreview("");
        setResult(null);
        setSaved(false);
      }, 2000);
    } catch (err) {
      setError("Notion 저장 중 오류가 발생했습니다");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            레퍼런스 자동 분류 도우미
          </h1>
          <p className="text-gray-600">
            UI/UX 레퍼런스 이미지를 업로드하면 Claude가 자동으로 분류합니다
          </p>
        </div>

        <div className="space-y-8">
          <ImageUploader
            onImageSelect={handleImageSelect}
            imagePreview={imagePreview}
          />

          {analyzing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-700 font-medium">
                Claude가 이미지를 분석하고 있습니다...
              </p>
            </div>
          )}

          {result && !analyzing && (
            <>
              <ResultEditor data={result} onChange={setResult} />

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className={`
                    px-8 py-3 rounded-lg font-medium text-white transition-all
                    ${
                      saved
                        ? "bg-green-500"
                        : saving
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-95"
                    }
                  `}
                >
                  {saved ? "✓ 저장 완료!" : saving ? "저장 중..." : "Notion에 저장"}
                </button>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-medium">
                Notion에 성공적으로 저장되었습니다!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
