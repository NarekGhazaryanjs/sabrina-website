import { Sparkles } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminRu as t } from "@/messages/admin.ru";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl glass p-8">
        <div className="mb-8 text-center">
          <Sparkles className="mx-auto mb-3 h-7 w-7 text-rose-400/70" />
          <h1 className="font-display text-2xl font-bold gradient-text">
            {t.login.title}
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
