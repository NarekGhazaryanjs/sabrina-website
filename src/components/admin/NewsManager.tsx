"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BilingualInput } from "./BilingualInput";
import type { NewsItem } from "@/lib/types/content";
import { Pencil, Trash2 } from "lucide-react";
import { adminRu as t } from "@/messages/admin.ru";

export function NewsManager({ items }: { items: NewsItem[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [titleEn, setTitleEn] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentRu, setContentRu] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [editTitleEn, setEditTitleEn] = useState("");
  const [editTitleRu, setEditTitleRu] = useState("");
  const [editContentEn, setEditContentEn] = useState("");
  const [editContentRu, setEditContentRu] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | undefined>();

  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => {
    if (!editImage) {
      setEditImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(editImage);
    setEditImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [editImage]);

  function startEdit(item: NewsItem) {
    setEditingId(item.id);
    setEditTitleEn(item.title_en);
    setEditTitleRu(item.title_ru);
    setEditContentEn(item.content_en);
    setEditContentRu(item.content_ru);
    setEditImage(null);
    setCurrentImage(item.featured_image);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditImage(null);
    setError("");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData();
    form.append("title_en", titleEn);
    form.append("title_ru", titleRu);
    form.append("content_en", contentEn);
    form.append("content_ru", contentRu);
    if (image) form.append("image", image);

    const res = await fetch("/api/admin/news", { method: "POST", body: form });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t.errors.uploadFailed);
      setLoading(false);
      return;
    }

    setTitleEn("");
    setTitleRu("");
    setContentEn("");
    setContentRu("");
    setImage(null);
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
    form.append("content_en", editContentEn);
    form.append("content_ru", editContentRu);
    if (editImage) form.append("image", editImage);

    const res = await fetch(`/api/admin/news?id=${editingId}`, {
      method: "PUT",
      body: form,
    });

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
    if (!confirm(t.form.deleteNewsConfirm)) return;
    await fetch(`/api/admin/news?id=${id}`, { method: "DELETE" });
    if (editingId === id) cancelEdit();
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="space-y-4 rounded-2xl glass p-6">
        <h2 className="font-medium text-rose-200">{t.form.addNews}</h2>
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

        <BilingualInput
          labelEn={t.form.contentEn}
          labelRu={t.form.contentRu}
          nameEn="content_en"
          nameRu="content_ru"
          valueEn={contentEn}
          valueRu={contentRu}
          onChangeEn={setContentEn}
          onChangeRu={setContentRu}
          multiline
        />

        <div>
          <label className="mb-1.5 block text-sm text-rose-300/70">
            {t.form.imageOptional}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-rose-300/60 file:mr-4 file:rounded-lg file:border-0 file:bg-rose-400/10 file:px-4 file:py-2 file:text-rose-200"
          />
        </div>

        {imagePreview && (
          <div className="overflow-hidden rounded-xl border border-rose-400/10">
            <p className="border-b border-rose-400/8 px-3 py-1.5 text-xs text-rose-300/50">
              {t.form.preview}
            </p>
            <img src={imagePreview} alt="" className="max-h-48 w-full object-contain" />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-xl px-6 py-2.5 text-sm font-medium text-pearl disabled:opacity-50"
        >
          {loading ? t.form.saving : t.form.addNews}
        </button>
      </form>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-rose-300/40">{t.form.nothingYet}</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="rounded-xl glass p-4">
            {editingId === item.id ? (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <h3 className="font-medium text-rose-200">{t.form.editNews}</h3>
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

                <BilingualInput
                  labelEn={t.form.contentEn}
                  labelRu={t.form.contentRu}
                  nameEn="edit_content_en"
                  nameRu="edit_content_ru"
                  valueEn={editContentEn}
                  valueRu={editContentRu}
                  onChangeEn={setEditContentEn}
                  onChangeRu={setEditContentRu}
                  multiline
                />

                {currentImage && !editImagePreview && (
                  <div>
                    <p className="mb-2 text-sm text-rose-300/50">
                      {t.form.currentFile}
                    </p>
                    <img
                      src={currentImage}
                      alt=""
                      className="max-h-48 rounded-lg object-contain"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm text-rose-300/70">
                    {t.form.replaceFile}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImage(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-rose-300/60 file:mr-4 file:rounded-lg file:border-0 file:bg-rose-400/10 file:px-4 file:py-2 file:text-rose-200"
                  />
                </div>

                {editImagePreview && (
                  <img
                    src={editImagePreview}
                    alt=""
                    className="max-h-48 rounded-lg object-contain"
                  />
                )}

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
                    className="rounded-xl border border-rose-400/10 px-6 py-2.5 text-sm text-rose-300/70"
                  >
                    {t.form.cancel}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex gap-4">
                {item.featured_image && (
                  <img
                    src={item.featured_image}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-rose-200">{item.title_en}</p>
                  <p className="text-sm text-rose-300/50">{item.title_ru}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded-lg p-2 text-rose-400/60 hover:bg-rose-400/10"
                    title={t.form.edit}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-2 text-rose-400/60 hover:bg-rose-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
