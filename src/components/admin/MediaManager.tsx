"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BilingualInput } from "./BilingualInput";
import { FilePreview } from "./FilePreview";
import type { MediaItem, MediaType } from "@/lib/types/content";
import { Pencil, Trash2 } from "lucide-react";
import { adminRu as t } from "@/messages/admin.ru";

interface MediaManagerProps {
  type: MediaType;
  label: string;
  pluralLabel: string;
  accept: string;
  items: MediaItem[];
  showDescription?: boolean;
}

function MediaThumb({ type, url }: { type: MediaType; url: string }) {
  if (type === "photos") {
    return (
      <img src={url} alt="" className="h-24 w-24 shrink-0 rounded-lg object-cover" />
    );
  }
  if (type === "videos") {
    return (
      <video
        src={url}
        controls
        className="h-24 w-40 shrink-0 rounded-lg object-cover"
      />
    );
  }
  return (
    <div className="w-40 shrink-0 rounded-lg bg-rose-400/10 p-2">
      <audio src={url} controls className="w-full" />
    </div>
  );
}

export function MediaManager({
  type,
  label,
  pluralLabel,
  accept,
  items,
  showDescription = true,
}: MediaManagerProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add form state
  const [titleEn, setTitleEn] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descRu, setDescRu] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Edit form state
  const [editTitleEn, setEditTitleEn] = useState("");
  const [editTitleRu, setEditTitleRu] = useState("");
  const [editDescEn, setEditDescEn] = useState("");
  const [editDescRu, setEditDescRu] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editMediaUrl, setEditMediaUrl] = useState("");

  function startEdit(item: MediaItem) {
    setEditingId(item.id);
    setEditTitleEn(item.title_en);
    setEditTitleRu(item.title_ru);
    setEditDescEn(item.description_en);
    setEditDescRu(item.description_ru);
    setEditFile(null);
    setEditMediaUrl(item.media_url);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditFile(null);
    setError("");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError(t.errors.fileRequired);
      return;
    }
    setLoading(true);
    setError("");

    const form = new FormData();
    form.append("file", file);
    form.append("title_en", titleEn);
    form.append("title_ru", titleRu);
    form.append("description_en", descEn);
    form.append("description_ru", descRu);

    const res = await fetch(`/api/admin/media?type=${type}`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t.errors.uploadFailed);
      setLoading(false);
      return;
    }

    setTitleEn("");
    setTitleRu("");
    setDescEn("");
    setDescRu("");
    setFile(null);
    setLoading(false);
    router.refresh();
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    setError("");

    const form = new FormData();
    form.append("title_en", editTitleEn);
    form.append("title_ru", editTitleRu);
    form.append("description_en", editDescEn);
    form.append("description_ru", editDescRu);
    if (editFile) form.append("file", editFile);

    const res = await fetch(
      `/api/admin/media?type=${type}&id=${editingId}`,
      { method: "PUT", body: form }
    );

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t.errors.uploadFailed);
      setLoading(false);
      return;
    }

    setLoading(false);
    cancelEdit();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm(t.form.deleteConfirm)) return;
    await fetch(`/api/admin/media?type=${type}&id=${id}`, { method: "DELETE" });
    if (editingId === id) cancelEdit();
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="space-y-4 rounded-2xl glass p-6">
        <h2 className="font-medium text-rose-200">
          {t.form.add} {label}
        </h2>
        {error && !editingId && <p className="text-sm text-rose-400">{error}</p>}

        <BilingualInput
          labelEn={t.form.titleEn}
          labelRu={t.form.titleRu}
          nameEn="title_en"
          nameRu="title_ru"
          valueEn={titleEn}
          valueRu={titleRu}
          onChangeEn={setTitleEn}
          onChangeRu={setTitleRu}
          required
        />

        {showDescription && (
          <BilingualInput
            labelEn={t.form.descEn}
            labelRu={t.form.descRu}
            nameEn="description_en"
            nameRu="description_ru"
            valueEn={descEn}
            valueRu={descRu}
            onChangeEn={setDescEn}
            onChangeRu={setDescRu}
            multiline
          />
        )}

        <div>
          <label className="mb-1.5 block text-sm text-rose-300/70">
            {t.form.file} <span className="text-rose-400">*</span>
          </label>
          <input
            type="file"
            accept={accept}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className="w-full text-sm text-rose-300/60 file:mr-4 file:rounded-lg file:border-0 file:bg-rose-400/10 file:px-4 file:py-2 file:text-rose-200"
          />
        </div>

        <FilePreview file={file} type={type} />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-xl px-6 py-2.5 text-sm font-medium text-pearl disabled:opacity-50"
        >
          {loading ? t.form.upload : `${t.form.add} ${label}`}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="font-medium text-rose-200">
          {pluralLabel} ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-rose-300/40">{t.form.nothingYet}</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl glass p-4">
              {editingId === item.id ? (
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <h3 className="font-medium text-rose-200">
                    {t.form.edit} {label}
                  </h3>
                  {error && <p className="text-sm text-rose-400">{error}</p>}

                  <BilingualInput
                    labelEn={t.form.titleEn}
                    labelRu={t.form.titleRu}
                    nameEn="edit_title_en"
                    nameRu="edit_title_ru"
                    valueEn={editTitleEn}
                    valueRu={editTitleRu}
                    onChangeEn={setEditTitleEn}
                    onChangeRu={setEditTitleRu}
                    required
                  />

                  {showDescription && (
                    <BilingualInput
                      labelEn={t.form.descEn}
                      labelRu={t.form.descRu}
                      nameEn="edit_desc_en"
                      nameRu="edit_desc_ru"
                      valueEn={editDescEn}
                      valueRu={editDescRu}
                      onChangeEn={setEditDescEn}
                      onChangeRu={setEditDescRu}
                      multiline
                    />
                  )}

                  <p className="text-sm text-rose-300/50">{t.form.currentFile}</p>
                  <MediaThumb type={type} url={editMediaUrl} />

                  <div>
                    <label className="mb-1.5 block text-sm text-rose-300/70">
                      {t.form.replaceFile}
                    </label>
                    <input
                      type="file"
                      accept={accept}
                      onChange={(e) =>
                        setEditFile(e.target.files?.[0] ?? null)
                      }
                      className="w-full text-sm text-rose-300/60 file:mr-4 file:rounded-lg file:border-0 file:bg-rose-400/10 file:px-4 file:py-2 file:text-rose-200"
                    />
                  </div>

                  <FilePreview file={editFile} type={type} />

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary rounded-xl px-6 py-2.5 text-sm font-medium text-pearl disabled:opacity-50"
                    >
                      {loading ? t.form.saving : t.form.saveChanges}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-xl border border-rose-400/10 px-6 py-2.5 text-sm text-rose-300/70 hover:bg-rose-400/5"
                    >
                      {t.form.cancel}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <MediaThumb type={type} url={item.media_url} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-rose-200">{item.title_en}</p>
                    <p className="text-sm text-rose-300/50">{item.title_ru}</p>
                    {showDescription && item.description_ru && (
                      <p className="mt-2 line-clamp-2 text-sm text-rose-300/40">
                        {item.description_ru}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="rounded-lg p-2 text-rose-400/60 hover:bg-rose-400/10 hover:text-rose-400"
                      title={t.form.edit}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-2 text-rose-400/60 hover:bg-rose-400/10 hover:text-rose-400"
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
