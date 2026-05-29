"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { signIn } from "@/lib/auth/actions";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginForm({
  redirectTo,
  unauthorized,
}: {
  redirectTo: string;
  unauthorized: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    toast.success("Đăng nhập thành công!");

    // Cập nhật lại state của AuthProvider ngay lập tức
    await refreshUser();

    // Redirect theo role
    if (result.role === "admin") {
      router.push("/admin");
    } else {
      router.push(redirectTo);
    }
    // Force server re-render to update header auth state
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-surface via-background to-surface/50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Unauthorized Warning */}
        {unauthorized && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
            <AlertCircle className="w-5 h-5 shrink-0 text-yellow-600" />
            <span>Bạn cần đăng nhập với tài khoản admin để truy cập trang quản trị.</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Đăng nhập</h1>
          <p className="text-sm text-muted">
            Chào mừng bạn quay lại Dalat Lookbook
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  className="input-field !pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-foreground block mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-field !pl-10 !pr-10"
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted mt-6">
          Chưa có tài khoản?{" "}
          <Link href={redirectTo && redirectTo !== "/" ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"} className="font-semibold text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
