"use client";

import { adminRu as t } from "@/messages/admin.ru";

interface BilingualInputProps {
  labelEn: string;
  labelRu: string;
  nameEn: string;
  nameRu: string;
  valueEn: string;
  valueRu: string;
  onChangeEn: (v: string) => void;
  onChangeRu: (v: string) => void;
  multiline?: boolean;
  required?: boolean;
}

const fieldClass = "input-field w-full rounded-xl px-4 py-3 text-pearl";

export function BilingualInput({
  labelEn,
  labelRu,
  valueEn,
  valueRu,
  onChangeEn,
  onChangeRu,
  multiline,
  required,
}: BilingualInputProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm text-rose-300/70">
          {labelEn}{" "}
          {required && <span className="text-rose-400">*</span>}
        </label>
        {multiline ? (
          <textarea
            rows={4}
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            required={required}
            className={`${fieldClass} resize-none`}
          />
        ) : (
          <input
            type="text"
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            required={required}
            className={fieldClass}
          />
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-rose-300/70">
          {labelRu}{" "}
          {required && <span className="text-rose-400">*</span>}
        </label>
        {multiline ? (
          <textarea
            rows={4}
            value={valueRu}
            onChange={(e) => onChangeRu(e.target.value)}
            required={required}
            className={`${fieldClass} resize-none`}
          />
        ) : (
          <input
            type="text"
            value={valueRu}
            onChange={(e) => onChangeRu(e.target.value)}
            required={required}
            className={fieldClass}
          />
        )}
      </div>
    </div>
  );
}
