"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isValidGmail } from "@/utils/validators";
import { User, Lock, Mail, ArrowRight, Store, AlertCircle, Eye, EyeOff, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "";
  const { loginWithSupabase, loginWithGoogle, resendVerificationEmail, user } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [unconfirmedEmail, setUnconfirmedEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // If already logged in, redirect safely via useEffect
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.isProfileComplete === false) {
        router.replace(`/lengkapi-profil${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`);
      } else {
        router.replace(redirectPath || "/");
      }
    }
  }, [user, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnconfirmedEmail("");
    setResendMessage("");

    const clean = identifier.trim();
    const isNik = /^[0-9]{16}$/.test(clean);

    if (!isNik && !isValidGmail(clean) && !clean.includes("@")) {
      setError("Masukkan 16 digit NIK KTP atau Alamat Email yang valid.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    const res = await loginWithSupabase(clean, password);

    if (!res.success) {
      setError(res.error || "Gagal masuk. Silakan periksa kembali data Anda.");
      if (res.emailNotConfirmed && res.email) {
        setUnconfirmedEmail(res.email);
      }
      setLoading(false);
    } else {
      setLoading(false);
      router.push(redirectPath || "/");
    }
  };

  const handleResendFromLogin = async () => {
    if (!unconfirmedEmail) return;
    setResending(true);
    setResendMessage("");
    const res = await resendVerificationEmail(unconfirmedEmail);
    setResending(false);
    if (!res.success) {
      setResendMessage(`Gagal: ${res.error}`);
    } else {
      setResendMessage("✓ Tautan aktivasi baru telah dikirimkan ke Gmail Anda. Silakan periksa kotak masuk/spam.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    const res = await loginWithGoogle(redirectPath);
    if (!res.success) {
      setError(res.error || "Gagal masuk dengan akun Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center group mb-1">
            <div className="relative w-12 h-14 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <img
                src="/images/logo-magetan.png"
                alt="Logo Kabupaten Magetan"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Masuk Akun Warga</h1>
          <p className="text-xs text-muted-foreground">
            Masuk dengan Akun Google atau NIK KTP (16 Digit) & Email
          </p>
        </div>

        <Card className="rounded-2xl sm:rounded-3xl border-border/70 shadow-sm overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* 1-Click Google Sign In */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-2.5 rounded-xl border-border/80 flex items-center justify-center gap-3 text-xs font-semibold shadow-xs active:scale-95"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <GoogleIcon />
              )}
              <span>{googleLoading ? "Menghubungkan ke Google..." : "Masuk Cepat dengan Akun Google"}</span>
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <Separator />
              <span className="absolute bg-card px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                atau via NIK / Email
              </span>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs font-medium flex flex-col space-y-2 animate-in fade-in">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
                {unconfirmedEmail && (
                  <div className="pt-1 border-t border-rose-200/60 flex flex-col space-y-1.5">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleResendFromLogin}
                      disabled={resending}
                      className="self-start text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 h-8 rounded-lg"
                    >
                      {resending ? "Mengirim Ulang..." : "Kirim Ulang Email Aktivasi ke Gmail"}
                    </Button>
                    {resendMessage && (
                      <span className="text-[11px] font-semibold text-emerald-900">{resendMessage}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1.5 flex items-center justify-between">
                  <span>NIK KTP atau Alamat Email</span>
                  <Badge variant="secondary" className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 border-emerald-200/80">
                    16 Digit / Email
                  </Badge>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: 3520xxxxxxxxxxxx atau budi@gmail.com"
                    className="pl-10 text-xs rounded-xl bg-muted/40"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-foreground uppercase">
                    Kata Sandi
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 text-xs rounded-xl bg-muted/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-sm mt-2 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memeriksa Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun Warga</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <Separator />

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Belum punya akun warga?{" "}
                <Link href={`/register${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`} className="font-bold text-primary hover:underline">
                  Daftar Akun Baru
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#004329]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
