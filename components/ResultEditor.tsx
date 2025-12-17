"use client";

import { ReferenceData, REFERENCE_TYPES, PLATFORMS } from "@/lib/types";
import { ChangeEvent } from "react";

interface ResultEditorProps {
  data: ReferenceData;
  onChange: (data: ReferenceData) => void;
}

export default function ResultEditor({ data, onChange }: ResultEditorProps) {
  const handleChange = (
    field: keyof ReferenceData,
    value: string
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이미지 제목
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="이미지 제목을 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          타입
        </label>
        <select
          value={data.type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange("type", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {REFERENCE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          플랫폼
        </label>
        <select
          value={data.platform}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange("platform", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {PLATFORMS.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          메모
        </label>
        <textarea
          value={data.memo}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange("memo", e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="디자이너가 참고할 수 있는 핵심 포인트를 입력하세요"
        />
      </div>
    </div>
  );
}
