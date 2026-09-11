"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading: authLoading, loginWithSupabase, logout } = useAuth();

  // Form states
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const cleanUser = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    try {
      const res = await loginWithSupabase(cleanUser, cleanPass);
      if (!res.success) {
        setErrorMsg(res.error || "Email atau kata sandi admin tidak sesuai. Silakan periksa kembali.");
      }
    } catch {
      setErrorMsg("Gagal memverifikasi akun admin. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Loading state while verifying auth session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-3">
        <Loader2 className="size-8 text-primary animate-spin" />
        <div className="text-muted-foreground text-xs font-semibold">
          Memverifikasi Hak Akses Pengelola Desa...
        </div>
      </div>
    );
  }

  // If user is not logged in or role is not admin, show Admin Login Gate
  if (!user || user.role !== "admin") {
    return (
      <main className="min-h-screen bg-[#063321] flex flex-col justify-center items-center p-4 sm:p-6 text-white relative overflow-hidden">
        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Back to Public Web */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold gap-1.5"
          >
            <Link href="/">
              <ArrowLeft className="size-3.5" />
              <span>Kembali ke Website Utama</span>
            </Link>
          </Button>

          {/* Login Card */}
          <Card className="p-6 sm:p-8 shadow-xl border-border space-y-6 animate-in fade-in zoom-in-95 duration-200 bg-card text-card-foreground">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-16 relative mx-auto flex items-center justify-center">
                <Image
                  src="/images/logo-magetan.png"
                  alt="Logo Kabupaten Magetan"
                  width={56}
                  height={64}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Login Pengelola Desa
              </h1>
              <p className="text-xs text-muted-foreground">
                Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan
              </p>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3.5 rounded-2xl flex items-start space-x-2.5">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {user && user.role !== "admin" && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs p-3.5 rounded-2xl flex items-start space-x-2.5">
                <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Akun Anda ({user.email}) terdaftar sebagai Warga, bukan Admin Desa. Silakan masuk menggunakan akun pengelola yang berwenang.</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block uppercase">
                  Email Admin
                </label>
                <Input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@desabogem.id"
                  className="rounded-xl h-10 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block uppercase">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="rounded-xl h-10 pl-3 pr-10 text-xs sm:text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle kata sandi"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-xl text-xs sm:text-sm font-bold gap-2 bg-[#063321] hover:bg-[#073d28] text-white shadow-xs"
              >
                <Lock className="size-4" />
                <span>{loading ? "Memverifikasi..." : "Masuk ke Panel Pengelola"}</span>
              </Button>
            </form>
          </Card>
        </div>
      </main>
    );
  }

  // If authenticated as admin, render Admin Layout with top control bar
  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Admin Top Sticky Bar */}
      <header className="bg-[#063321] text-white sticky top-0 z-40 shadow-xs border-b border-emerald-900/60 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin"
              className="flex items-center space-x-2.5 text-white font-bold text-xs sm:text-sm hover:text-emerald-200 transition"
            >
              <div className="w-6 h-7 shrink-0 relative flex items-center justify-center">
                <Image
                  src="/images/logo-magetan.png"
                  alt="Logo Magetan"
                  width={24}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="hidden sm:inline">Panel Pengelola Desa Bogem</span>
              <span className="sm:hidden">Panel Admin</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Badge variant="outline" className="hidden md:inline-flex text-xs text-emerald-200 border-emerald-700/60 bg-emerald-950/40 font-medium">
              {user.email}
            </Badge>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-[11px] sm:text-xs text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl border-white/10 gap-1"
            >
              <Link href="/" target="_blank">
                <span>Web Publik</span>
                <ExternalLink className="size-3" />
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="text-[11px] sm:text-xs rounded-xl gap-1"
              title="Keluar dari Panel Admin"
            >
              <LogOut className="size-3.5" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Content View */}
      <div className="flex-grow">{children}</div>
    </div>
  );
}
