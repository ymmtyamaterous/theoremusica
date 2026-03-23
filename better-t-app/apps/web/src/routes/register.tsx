import { Button } from "@better-t-app/ui/components/button";
import { Input } from "@better-t-app/ui/components/input";
import { Label } from "@better-t-app/ui/components/label";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/register")({
  component: RegisterComponent,
});

function RegisterComponent() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setIsLoading(false);

    if (result.error) {
      setError(result.error.message ?? "登録に失敗しました");
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
            𝄞 Theoremusica を始める
          </h1>
          <p className="text-sm text-[#6b6356]">
            無料アカウントを作成して音楽理論の学習を始めましょう
          </p>
        </div>

        <div className="rounded-2xl border border-[#2a2520] bg-[#13120f] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-[#f5f0e8]/70">
                お名前
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-[#2a2520] bg-[#0e0d0c] text-[#f5f0e8] placeholder:text-[#6b6356] focus:border-[#c9a84c]"
                placeholder="山田 太郎"
              />
            </div>

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
                minLength={8}
                className="border-[#2a2520] bg-[#0e0d0c] text-[#f5f0e8] placeholder:text-[#6b6356] focus:border-[#c9a84c]"
                placeholder="8文字以上"
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
              {isLoading ? "登録中..." : "アカウントを作成"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6b6356]">
            すでにアカウントをお持ちの方は{" "}
            <Link
              to="/login"
              className="text-[#c9a84c] transition-colors hover:text-[#e8cc87]"
            >
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
