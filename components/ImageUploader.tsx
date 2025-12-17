"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  imagePreview: string;
}

export default function ImageUploader({ onImageSelect, imagePreview }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      alert("JPG, PNG, WEBP 형식만 지원합니다");
      return;
    }

    // Compress image if larger than 2MB
    const maxSize = 2 * 1024 * 1024; // 2MB
    let processedFile = file;

    if (file.size > maxSize) {
      processedFile = await compressImage(file);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageSelect(processedFile, preview);
    };
    reader.readAsDataURL(processedFile);
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Resize if larger than 1920px
          const maxDimension = 1920;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              }
            },
            "image/jpeg",
            0.85
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
      />

      {!imagePreview ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-colors
            ${isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }
          `}
        >
          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <div className="text-lg font-medium text-gray-700">
              이미지를 드래그하거나 클릭하세요
            </div>
            <div className="text-sm text-gray-500">
              JPG, PNG, WEBP 형식 지원
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full rounded-lg shadow-lg"
          />
          <button
            onClick={handleClick}
            className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            이미지 변경
          </button>
        </div>
      )}
    </div>
  );
}
