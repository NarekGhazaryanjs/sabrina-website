"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRu as t } from "@/messages/admin.ru";

export function LoginForm() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t.login.failed);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}
      <div>
        <label className="mb-1.5 block text-sm text-rose-300/70">
          {t.login.loginLabel}
        </label>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          className="input-field w-full rounded-xl px-4 py-3 text-pearl"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-rose-300/70">
          {t.login.passwordLabel}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field w-full rounded-xl px-4 py-3 text-pearl"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full rounded-xl py-3 font-medium text-pearl disabled:opacity-50"
      >
        {loading ? t.login.loading : t.login.submit}
      </button>
    </form>
  );
}
