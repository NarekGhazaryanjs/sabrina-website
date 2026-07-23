"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SiteSettings, SocialLink } from "@/lib/types/content";
import { adminRu as t } from "@/messages/admin.ru";

function newSocial(): SocialLink {
  return { id: crypto.randomUUID(), label: "", url: "" };
}

export function SettingsEditor({ settings }: { settings: SiteSettings }) {
  const [email, setEmail] = useState(settings.email);
  const [socials, setSocials] = useState<SocialLink[]>(settings.socials);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateSocial(id: string, field: "label" | "url", value: string) {
    setSocials((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function removeSocial(id: string) {
    setSocials((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload: SiteSettings = {
      email: email.trim(),
      socials: socials
        .map((s) => ({
          ...s,
          label: s.label.trim(),
          url: s.url.trim(),
        }))
        .filter((s) => s.label && s.url),
    };

    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSocials(payload.socials);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-2xl glass p-6">
        <label className="mb-1.5 block text-sm text-rose-300/70">
          {t.settings.email}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field w-full rounded-xl px-4 py-3 text-pearl"
        />
      </div>

      <div className="rounded-2xl glass p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-medium text-rose-200">{t.settings.socials}</h2>
          <button
            type="button"
            onClick={() => setSocials((prev) => [...prev, newSocial()])}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-400/10 px-3 py-1.5 text-sm text-rose-300 transition-colors hover:bg-rose-400/20"
          >
            <Plus className="h-4 w-4" />
            {t.settings.addSocial}
          </button>
        </div>

        {socials.length === 0 ? (
          <p className="text-center text-sm text-rose-300/45">
            {t.settings.noSocials}
          </p>
        ) : (
          <div className="space-y-4">
            {socials.map((social) => (
              <div
                key={social.id}
                className="grid gap-3 rounded-xl border border-rose-400/12 p-4 sm:grid-cols-[1fr_1.5fr_auto]"
              >
                <div>
                  <label className="mb-1 block text-xs text-rose-300/55">
                    {t.settings.socialLabel}
                  </label>
                  <input
                    type="text"
                    value={social.label}
                    onChange={(e) =>
                      updateSocial(social.id, "label", e.target.value)
                    }
                    placeholder="Telegram"
                    className="input-field w-full rounded-xl px-4 py-2.5 text-pearl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-rose-300/55">
                    {t.settings.socialUrl}
                  </label>
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) =>
                      updateSocial(social.id, "url", e.target.value)
                    }
                    placeholder="https://"
                    className="input-field w-full rounded-xl px-4 py-2.5 text-pearl"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSocial(social.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-300 transition-colors hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t.settings.removeSocial}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-xl px-6 py-2.5 text-sm font-medium text-pearl disabled:opacity-50"
        >
          {loading ? t.form.saving : t.form.saveSettings}
        </button>
        {saved && (
          <span className="text-sm text-rose-400/80">{t.form.saved}</span>
        )}
      </div>
    </form>
  );
}
