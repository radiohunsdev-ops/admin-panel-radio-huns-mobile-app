/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

import { COLORS } from "@/constants/colors";

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({
  value,
  onChange,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();


      if (!response.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      // 🔥 validate response exists
      if (!data?.url || typeof data.url !== "string") {
        throw new Error("Invalid image URL returned from server");
      }

      // 🔥 ensure absolute URL (fix Next/Image crash)
      const isValidUrl = data.url.startsWith("http");

      if (!isValidUrl) {
        throw new Error(
          "Server returned invalid URL (must be absolute http/https)"
        );
      }

      onChange(data.url);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
    } finally {
      setLoading(false);
      // reset input so same file can be re-uploaded
      e.target.value = "";
    }
  };

  return (
    <div className="w-full h-full">
      <label
        className="border-2 border-dashed rounded-2xl cursor-pointer flex items-center justify-center overflow-hidden aspect-square w-full h-full"
        style={{
          borderColor: COLORS.border,
          backgroundColor: COLORS.softCard,
        }}
      >
        {loading ? (
          <Loader2
            className="animate-spin"
            size={40}
            color={COLORS.primary}
          />
        ) : value ? (
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={40} color={COLORS.primary} />

            <p
              className="text-sm font-medium"
              style={{ color: COLORS.muted }}
            >
              Upload Image
            </p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleUpload}
        />
      </label>
    </div>
  );
}