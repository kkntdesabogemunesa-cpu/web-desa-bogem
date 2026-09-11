"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { isValidNIK, isValidPhone } from "@/utils/validators";
import {
  CreditCard,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function LengkapiProfilForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/layanan-surat";
  const { user, updateProfile, logout, loading: authLoading } = useAuth();

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    name: string;
  } | null>(null);

  const [checkingSession, setCheckingSession] = useState(true);
  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [phone, setPhone] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 1. Initial Session Check: Fetch directly from Supabase session
  useEffect(() => {
    let isMounted = true;

    async function checkCurrentSession() {
      try {
        if (!supabase) {
          if (isMounted) setCheckingSession(false);
          return;
        }

        const { data: sessionData } = await supabase.auth.getSession();
        const activeUser = sessionData.session?.user;

        if (!activeUser) {
          if (!authLoading && isMounted) {
            router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
          }
          if (isMounted) setCheckingSession(false);
          return;
        }

        // Active user found
        const meta = activeUser.user_metadata || {};
        const googleName =
          meta.full_name ||
          meta.name ||
          meta.nama ||
          activeUser.email?.split("@")[0] ||
          "Warga Desa";
        if (isMounted) {
          setCurrentUser({
            id: activeUser.id,
            email: activeUser.email || "",
            name: googleName,
          });
        }

        // Fetch existing database profile if any
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", activeUser.id)
          .maybeSingle();

        if (isMounted) {
          if (profile?.nama) setNama(profile.nama);
          else setNama(googleName);

          if (profile?.nik) setNik(profile.nik);
          if (profile?.no_hp) setPhone(profile.no_hp);

          // If the profile is ALREADY completely filled with valid 16-digit NIK and phone, redirect forward
          const isComplete = Boolean(
            profile?.nik &&
            /^[0-9]{16}$/.test(profile.nik.trim()) &&
            profile?.no_hp &&
            profile.no_hp.trim().length >= 9
          );

          if (isComplete) {
            router.replace(redirectPath);
            return;
          }

          setCheckingSession(false);
        }
      } catch (err) {
        console.warn("LengkapiProfil init error:", err);
        if (isMounted) setCheckingSession(false);
      }
    }

    checkCurrentSession();

    return () => {
      isMounted = false;
    };
  }, [authLoading, redirectPath, router]);

  // Sync from AuthContext user if available
  useEffect(() => {
    if (user) {
      if (!currentUser) {
        setCurrentUser({
          id: user.id || "",
          email: user.email,
          name: user.name,
        });
      }
      if (!nama && user.name && user.name !== "Warga Desa" && user.name !== "User Desa") {
        setNama(user.name);
      }
      if (!phone && user.phone) {
        setPhone(user.phone);
      }
      if (!nik && user.nik) {
        setNik(user.nik);
      }
    }
  }, [user, currentUser, nama, phone, nik]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanNik = nik.replace(/[^0-9]/g, "").trim();

    if (!isValidNIK(cleanNik)) {
      setError("NIK wajib 16 digit angka sesuai KTP Anda.");
      return;
    }

    if (!nama || nama.trim().length < 2) {
      setError("Silakan masukkan nama lengkap yang valid sesuai KTP.");
      return;
    }

    if (!isValidPhone(phone)) {
      setError("Nomor WhatsApp / HP tidak valid. Contoh: 081234567890");
      return;
    }

    setSaving(true);

    const res = await updateProfile({
      nik: cleanNik,
      nama: nama.trim(),
      phone: phone.trim(),
    });

    setSaving(false);

    if (!res.success) {
      setError(res.error || "Gagal menyimpan data profil warga.");
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.replace(redirectPath);
      }, 1000);
    }
  };

  if (checkingSession && authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#004329]" />
        <span className="text-xs font-bold text-slate-600">Menyiapkan Form Data Warga...</span>
      </div>
    );
  }

  const activeEmail = currentUser?.email || user?.email || "";
  const activeName = currentUser?.name || user?.name || "Akun Google";

  return (
    <main className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-flex items-center justify-center group">
            <div className="relative w-12 h-14 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/logo-magetan.png"
                alt="Logo Kabupaten Magetan"
                width={48}
                height={56}
                className="w-full h-full object-contain drop-shadow"
                priority
              />
            </div>
          </Link>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Tahap 2: Data Kependudukan Warga</span>
          </Badge>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Lengkapi Data Profil</h1>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Email Anda telah terverifikasi. Masukkan NIK KTP Anda untuk mengaktifkan akses Layanan Surat Mandiri Desa Bogem secara resmi.
            </p>
          </div>
        </div>

        <Card className="rounded-2xl sm:rounded-3xl border-border/70 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Email Verified Badge Card */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <Avatar className="w-9 h-9 border border-emerald-300/60">
                  <AvatarFallback className="bg-emerald-700 text-white font-bold text-xs">
                    {activeName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <span className="font-bold text-emerald-950 block truncate">{activeName}</span>
                  <span className="text-[11px] text-emerald-700 font-mono block truncate">{activeEmail}</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border-emerald-200 flex items-center gap-1 flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Email Terverifikasi</span>
              </Badge>
            </div>

            {success && (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Data profil berhasil disimpan! Mengalihkan ke layanan surat...</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NIK Input */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1.5 flex items-center justify-between">
                  <span>NIK KTP (16 Digit)</span>
                  <Badge variant="secondary" className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 border-emerald-200/80">
                    Wajib Sesuai KTP
                  </Badge>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Contoh: 3520xxxxxxxxxxxx"
                    className="pl-10 text-xs rounded-xl bg-muted/40 font-bold tracking-wider font-mono"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground block mt-1">NIK diperlukan untuk validasi legalitas dokumen permohonan surat warga.</span>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1.5">
                  Nama Lengkap (Sesuai KTP)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="pl-10 text-xs rounded-xl bg-muted/40 font-medium"
                  />
                </div>
              </div>

              {/* No. WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1.5 flex items-center justify-between">
                  <span>No. WhatsApp / HP Aktif</span>
                  <Badge variant="secondary" className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 border-emerald-200/80">
                    Untuk Notifikasi Surat
                  </Badge>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="pl-10 text-xs rounded-xl bg-muted/40 font-mono"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={saving || success}
                className="w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-sm mt-2 active:scale-95"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Data Profil...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Simpan Data Profil & Lanjutkan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <Separator />

            {/* Switch Account / Logout option */}
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await logout();
                  router.replace("/login");
                }}
                className="text-muted-foreground hover:text-destructive text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                <span>Gunakan Akun Google Lain / Keluar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function LengkapiProfilPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#004329]" />
        </div>
      }
    >
      <LengkapiProfilForm />
    </Suspense>
  );
}
