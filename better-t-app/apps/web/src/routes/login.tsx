import { Button } from "@better-t-app/ui/components/button";
import { Input } from "@better-t-app/ui/components/input";
import { Label } from "@better-t-app/ui/components/label";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await authClient.signIn.email({ email, password });

    setIsLoading(false);

    if (result.error) {
      setError(result.error.message ?? "ログインに失敗しました");
      return;
    }

    navigate({ to: "/dashboard" });
  };

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6"
      style={{ backgroundColor: "#0e0d0c" }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1
            className="mb-2 font-serif text-3xl font-bold text-[#f5f0e8]"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            𝄞 Theoremusica にログイン
          </h1>
          <p className="text-sm text-[#6b6356]">
            アカウントにサインインして学習を続けましょう
          </p>
        </div>

        <div className="rounded-2xl border border-[#2a2520] bg-[#13120f] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-[#f5f0e8]/70">
                メールアドレス
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#2a2520] bg-[#0e0d0c] text-[#f5f0e8] placeholder:text-[#6b6356] focus:border-[#c9a84c]"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-[#f5f0e8]/70">
                パスワード
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#2a2520] bg-[#0e0d0c] text-[#f5f0e8] placeholder:text-[#6b6356] focus:border-[#c9a84c]"
                placeholder="パスワードを入力"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-900/50 bg-red-950/50 px-4 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#c9a84c] py-2.5 font-medium text-[#0e0d0c] transition-colors hover:bg-[#e8cc87] disabled:opacity-50"
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6b6356]">
            アカウントをお持ちでない方は{" "}
            <Link
              to="/register"
              className="text-[#c9a84c] transition-colors hover:text-[#e8cc87]"
            >
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
