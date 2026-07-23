"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });

    setLoading(false);

    if (!res.ok) {
      setError(t("sendError"));
      return;
    }

    setName("");
    setMessage("");
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 px-6 py-6">
      <h2 className="text-center font-display text-xl font-bold gradient-text">
        {t("formTitle")}
      </h2>

      <div>
        <label className="mb-1.5 block text-sm text-rose-300/70">
          {t("name")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          className="input-field w-full rounded-xl px-4 py-3 text-pearl"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-rose-300/70">
          {t("message")}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={2000}
          rows={5}
          className="input-field w-full resize-y rounded-xl px-4 py-3 text-pearl"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full rounded-xl py-3.5 text-base font-semibold text-white disabled:opacity-50"
      >
        {loading ? t("sending") : t("send")}
      </button>

      {sent && (
        <p className="text-center text-sm text-rose-400/90">{t("sent")}</p>
      )}
      {error && (
        <p className="text-center text-sm text-red-400/90">{error}</p>
      )}
    </form>
  );
}
