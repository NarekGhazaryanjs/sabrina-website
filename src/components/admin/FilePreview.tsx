"use client";

import { useEffect, useState } from "react";
import type { MediaType } from "@/lib/types/content";
import { adminRu as t } from "@/messages/admin.ru";

interface FilePreviewProps {
  file: File | null;
  url?: string;
  type: MediaType;
  className?: string;
}

export function FilePreview({ file, url, type, className = "" }: FilePreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const created = URL.createObjectURL(file);
    setObjectUrl(created);
    return () => URL.revokeObjectURL(created);
  }, [file]);

  const src = objectUrl ?? url;
  if (!src) return null;

  return (
    <div className={`overflow-hidden rounded-xl border border-rose-400/10 bg-plum-light/30 ${className}`}>
      <p className="border-b border-rose-400/8 px-3 py-1.5 text-xs text-rose-300/50">
        {t.form.preview}
      </p>
      {type === "photos" && (
        <img src={src} alt="" className="max-h-64 w-full object-contain" />
      )}
      {type === "videos" && (
        <video src={src} controls className="max-h-64 w-full" />
      )}
      {type === "audio" && (
        <div className="p-4">
          <audio src={src} controls className="w-full" />
        </div>
      )}
    </div>
  );
}
