"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Copy,
  Download,
  Send,
  Info,
  ShieldCheck,
  User,
  LogIn,
  UserPlus,
  RefreshCw,
  FolderOpen,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { OpsiSurat, PermohonanSurat, CreatePermohonanInput, defaultOpsiSuratList } from "@/types/surat";
import {
  fetchOpsiSuratList,
  createPermohonanSurat,
  searchSuratByTicket,
  fetchUserSuratList,
} from "@/services/suratService";
import { formatDateIndonesian } from "@/utils/formatters";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

function GoogleIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24">
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

export default function LayananSuratPage() {
  const { user, loginWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "lacak" | "saya">("form");
  const [opsiList, setOpsiList] = useState<OpsiSurat[]>(defaultOpsiSuratList);

  // Form State
  const [selectedOpsiId, setSelectedOpsiId] = useState<string>("");
  const [nik, setNik] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [noWhatsapp, setNoWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Dynamic Form Values
  const [dynamicValues, setDynamicValues] = useState<Record<string, unknown>>({});

  const [submitting, setSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<PermohonanSurat | null>(null);
  const [copied, setCopied] = useState(false);

  // Tracking State
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<PermohonanSurat[] | null>(null);

  // User's own letters state
  const [myLetters, setMyLetters] = useState<PermohonanSurat[]>([]);
  const [loadingMyLetters, setLoadingMyLetters] = useState(false);

  // Auto-fill user identity when logged in
  useEffect(() => {
    if (user) {
      if (user.nik) setNik(user.nik);
      if (user.name) setNamaLengkap(user.name);
      if (user.phone) setNoWhatsapp(user.phone);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  // Load My Letters for Logged in Citizen
  const loadMyLetters = async () => {
    if (!user) return;
    setLoadingMyLetters(true);
    try {
      const userLetters = await fetchUserSuratList(user.id, user.nik);
      setMyLetters(userLetters);
    } catch (err) {
      console.error("loadMyLetters error:", err);
    } finally {
      setLoadingMyLetters(false);
    }
  };

  useEffect(() => {
    if (activeTab === "saya" && user) {
      loadMyLetters();
    }
  }, [activeTab, user]);

  useEffect(() => {
    async function loadOpsi() {
      try {
        const remote = await fetchOpsiSuratList();
        if (remote && remote.length > 0) {
          setOpsiList(remote);
          setSelectedOpsiId((prev) => prev || remote[0].id);
        }
      } catch (err) {
        console.error("loadOpsi error:", err);
      }
    }
    loadOpsi();
  }, [user]);

  const selectedOpsi = opsiList.find((o) => o.id === selectedOpsiId) || opsiList[0];

  const handleDynamicChange = (fieldId: string, value: unknown) => {
    setDynamicValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik || !namaLengkap || !noWhatsapp || !selectedOpsi) {
      alert("Mohon lengkapi seluruh kolom wajib yang bertanda bintang (*).");
      return;
    }

    // Validate dynamic required fields
    if (selectedOpsi.custom_fields && selectedOpsi.custom_fields.length > 0) {
      for (const field of selectedOpsi.custom_fields) {
        if (field.wajib && (!dynamicValues[field.id] || String(dynamicValues[field.id]).trim() === "")) {
          alert(`Mohon lengkapi kolom "${field.label}" yang wajib diisi.`);
          return;
        }
      }
    }

    setSubmitting(true);
    const input: CreatePermohonanInput = {
      user_id: user?.id || undefined,
      opsi_surat_id: selectedOpsi.id,
      nik,
      nama_lengkap: namaLengkap,
      no_whatsapp: noWhatsapp,
      email: email || undefined,
      jenis_surat: selectedOpsi.nama_surat,
      data_formulir: dynamicValues,
    };

    const res = await createPermohonanSurat(input);
    setSubmitting(false);

    if (res.success && res.data) {
      setSuccessTicket(res.data);
      setDynamicValues({});
      if (user) {
        if (user.id && (!user.nik || user.nik !== nik)) {
          supabase
            .from("profiles")
            .upsert([
              {
                id: user.id,
                nik: nik.trim(),
                nama: namaLengkap,
                no_hp: noWhatsapp,
                email: user.email || email,
                updated_at: new Date().toISOString(),
              },
            ])
            .then(() => {});
        }
        loadMyLetters();
      }
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim();
    if (!clean) return;

    setSearching(true);
    if (/^[0-9]{16}$/.test(clean)) {
      const list = await fetchUserSuratList(undefined, clean);
      setSearchResult(list);
    } else {
      const res = await searchSuratByTicket(clean);
      setSearchResult(res ? [res] : []);
    }
    setSearching(false);
  };

  const handleCopyTicket = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <main className="min-h-screen bg-background pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Banner Section */}
        <div className="bg-[#073623] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white rounded-full text-xs font-semibold border-white/10 gap-1.5"
              >
                <Link href="/">
                  <ArrowLeft className="size-3.5" />
                  <span>Kembali ke Beranda</span>
                </Link>
              </Button>
              <Badge variant="outline" className="bg-emerald-800/80 border-emerald-500/40 text-emerald-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-300" />
                <span>Pelayanan Administrasi Warga</span>
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Layanan Pengajuan Surat Desa
            </h1>
            <p className="text-emerald-100/85 text-xs sm:text-sm lg:text-base leading-relaxed">
              Pilih jenis surat yang Anda butuhkan, isi data formulir permohonan sesuai persyaratan, dan pantau statusnya secara online. Dokumen surat resmi yang telah selesai dapat langsung diunduh di sini.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 bg-card p-1.5 rounded-2xl border border-border/80 shadow-xs">
          <Button
            variant={activeTab === "form" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("form")}
            className={`flex-1 min-w-[130px] rounded-xl text-xs sm:text-sm font-bold gap-2 ${
              activeTab === "form" ? "bg-[#063321] text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Send className="size-4" />
            <span>1. Ajukan Surat</span>
          </Button>

          <Button
            variant={activeTab === "lacak" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("lacak")}
            className={`flex-1 min-w-[130px] rounded-xl text-xs sm:text-sm font-bold gap-2 ${
              activeTab === "lacak" ? "bg-[#063321] text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="size-4" />
            <span>2. Lacak Surat</span>
          </Button>

          <Button
            variant={activeTab === "saya" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("saya")}
            className={`flex-1 min-w-[130px] rounded-xl text-xs sm:text-sm font-bold gap-2 ${
              activeTab === "saya" ? "bg-[#063321] text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="size-4" />
            <span>3. Surat Saya {user && myLetters.length > 0 && `(${myLetters.length})`}</span>
          </Button>
        </div>

        {/* TAB 1: FORMULIR PENGAJUAN SURAT */}
        {activeTab === "form" && (
          <div className="space-y-6">
            {!user ? (
              <Card className="p-6 sm:p-10 shadow-xs border-border/80 space-y-6 text-center animate-in fade-in duration-300 bg-card">
                <div className="size-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-[#004329] dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-200/60 dark:border-emerald-800/40">
                  <ShieldCheck className="size-8 text-emerald-700 dark:text-emerald-400" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <Badge variant="secondary" className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1">
                    Keamanan & Validasi NIK KTP
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    Masuk dengan Akun Warga
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Untuk mencegah permohonan fiktif dan memastikan dokumen resmi diterbitkan kepada warga yang berhak, silakan <strong>Masuk</strong> atau <strong>Daftar Akun</strong> menggunakan NIK KTP Anda.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-1/2 bg-[#004329] hover:bg-[#00321F] text-white font-bold text-xs rounded-xl shadow-xs gap-2"
                  >
                    <Link href="/login?redirect=/layanan-surat">
                      <LogIn className="size-4" />
                      <span>Masuk Akun Warga</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-1/2 rounded-xl text-xs font-bold gap-2"
                  >
                    <Link href="/register?redirect=/layanan-surat">
                      <UserPlus className="size-4 text-emerald-700" />
                      <span>Daftar Akun Baru</span>
                    </Link>
                  </Button>
                </div>

                {/* Direct Google 1-Click Button */}
                <div className="max-w-md mx-auto pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={async () => {
                      setGoogleLoading(true);
                      await loginWithGoogle("/layanan-surat");
                    }}
                    disabled={googleLoading}
                    className="w-full rounded-xl text-xs font-bold gap-2.5"
                  >
                    {googleLoading ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <GoogleIcon />
                    )}
                    <span>{googleLoading ? "Menghubungkan..." : "Atau Masuk Cepat dengan Akun Google"}</span>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Logged in Citizen Status Banner */}
                <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3 text-xs text-emerald-900 dark:text-emerald-200">
                    <div className="size-8 rounded-full bg-[#004329] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-extrabold block text-foreground">{user.name}</span>
                      <span className="text-emerald-800 dark:text-emerald-300 text-[11px]">
                        NIK KTP: <strong>{user.nik || "Belum diisi"}</strong> • {user.email}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-background self-start sm:self-auto">
                    ✓ Akun Warga Aktif
                  </Badge>
                </div>

                {/* Warning if NIK not filled yet */}
                {!user.nik && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-in fade-in">
                    <div className="flex items-center space-x-2.5 text-amber-900 dark:text-amber-200">
                      <AlertCircle className="size-5 text-amber-600 shrink-0" />
                      <span>
                        <strong>Profil belum lengkap:</strong> NIK KTP Anda belum terisi. Lengkapi profil Anda agar data surat tersimpan resmi.
                      </span>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shrink-0 self-end sm:self-auto text-xs"
                    >
                      <Link href="/lengkapi-profil?redirect=/layanan-surat">
                        Lengkapi NIK KTP →
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Modal Sukses Pengajuan */}
                {successTicket && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-600 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md animate-in zoom-in-95 duration-200">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="size-8 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-extrabold text-emerald-900 dark:text-emerald-200">
                          Permohonan Surat Berhasil Dikirim!
                        </h3>
                        <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                          Permohonan Anda telah diterima petugas Desa Bogem untuk diverifikasi dan diproses.
                        </p>
                      </div>
                    </div>

                    {/* Ticket Box */}
                    <Card className="p-4 sm:p-5 border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-card shadow-inner">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
                          Kode Tiket Pelacakan Anda
                        </span>
                        <span className="text-xl sm:text-2xl font-black font-mono text-[#004329] dark:text-emerald-400 tracking-wider">
                          {successTicket.id}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleCopyTicket(successTicket.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl gap-1.5 shadow-xs"
                      >
                        <Copy className="size-3.5" />
                        <span>{copied ? "Berhasil Disalin!" : "Salin Kode Tiket"}</span>
                      </Button>
                    </Card>

                    <div className="text-xs text-emerald-800/90 dark:text-emerald-300/90 space-y-1">
                      <p>• Surat ini juga otomatis tersimpan di tab <strong>Surat Saya</strong> pada akun Anda.</p>
                      <p>• Pemberitahuan juga akan dikirimkan ke WhatsApp Anda: <strong>{successTicket.no_whatsapp}</strong>.</p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setSuccessTicket(null)}
                        className="text-xs font-bold text-emerald-800 dark:text-emerald-300 underline p-0"
                      >
                        Tutup Notifikasi & Ajukan Surat Lain
                      </Button>
                    </div>
                  </div>
                )}

                {/* Main Dynamic Form */}
                <form onSubmit={handleSubmit}>
                  <Card className="p-6 sm:p-10 shadow-xs border-border/80 space-y-8 bg-card">
                    {/* Step 1: Pilih Jenis Surat */}
                    <div className="space-y-4">
                      <div className="border-b border-border/60 pb-3">
                        <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center space-x-2">
                          <span className="size-6 rounded-full bg-[#004329] text-white flex items-center justify-center text-xs font-extrabold">1</span>
                          <span>Pilih Jenis Surat yang Ingin Dibuat</span>
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground block">
                          Pilihan Surat Desa <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={selectedOpsiId}
                          onChange={(e) => {
                            setSelectedOpsiId(e.target.value);
                            setDynamicValues({});
                          }}
                          className="w-full px-4 py-2.5 rounded-xl border border-input bg-card text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {opsiList.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.nama_surat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedOpsi && (
                        <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 p-4 rounded-2xl space-y-1 text-xs text-emerald-900 dark:text-emerald-200">
                          <div className="flex items-center space-x-1.5 font-bold">
                            <Info className="size-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                            <span>{selectedOpsi.nama_surat}</span>
                          </div>
                          {selectedOpsi.deskripsi && (
                            <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed pl-5">
                              <strong>Keterangan:</strong> {selectedOpsi.deskripsi}
                            </p>
                          )}
                          {selectedOpsi.syarat && (
                            <p className="text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed pl-5">
                              <strong>Persyaratan Berkas:</strong> {selectedOpsi.syarat}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Step 2: Data Pemohon Umum */}
                    <div className="space-y-4">
                      <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                        <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center space-x-2">
                          <span className="size-6 rounded-full bg-[#004329] text-white flex items-center justify-center text-xs font-extrabold">2</span>
                          <span>Identitas Pemohon (Terisi Otomatis)</span>
                        </h3>
                        <Badge variant="secondary" className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">
                          ✓ Auto-fill
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground block">
                            NIK KTP <span className="text-rose-500">*</span>
                          </label>
                          <Input
                            type="text"
                            maxLength={16}
                            required
                            placeholder="16 Digit NIK KTP Anda"
                            value={nik}
                            onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, ""))}
                            className="font-mono font-bold text-xs sm:text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground block">
                            Nama Lengkap Pemohon <span className="text-rose-500">*</span>
                          </label>
                          <Input
                            type="text"
                            required
                            placeholder="Nama lengkap sesuai KTP"
                            value={namaLengkap}
                            onChange={(e) => setNamaLengkap(e.target.value)}
                            className="font-bold text-xs sm:text-sm"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground block">
                            Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                          </label>
                          <Input
                            type="text"
                            required
                            placeholder="08123456789"
                            value={noWhatsapp}
                            onChange={(e) => setNoWhatsapp(e.target.value)}
                            className="font-bold text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm"
                          />
                          <span className="text-[10px] text-muted-foreground block">Pemberitahuan surat selesai akan dikirimkan ke nomor ini.</span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground block">
                            Email
                          </label>
                          <Input
                            type="email"
                            placeholder="nama@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 3: DYNAMIC FORM FIELDS */}
                    {selectedOpsi && selectedOpsi.custom_fields && selectedOpsi.custom_fields.length > 0 && (
                      <div className="space-y-4">
                        <div className="border-b border-border/60 pb-3">
                          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center space-x-2">
                            <span className="size-6 rounded-full bg-[#004329] text-white flex items-center justify-center text-xs font-extrabold">3</span>
                            <span>Rincian Data Khusus ({selectedOpsi.nama_surat})</span>
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedOpsi.custom_fields.map((field) => {
                            const isFullWidth = field.tipe === "textarea";
                            const val = (dynamicValues[field.id] as string) || "";

                            return (
                              <div
                                key={field.id}
                                className={`space-y-1.5 ${isFullWidth ? "sm:col-span-2" : ""}`}
                              >
                                <label className="text-xs font-bold text-foreground block">
                                  {field.label} {field.wajib && <span className="text-rose-500">*</span>}
                                </label>

                                {field.tipe === "textarea" ? (
                                  <Textarea
                                    rows={3}
                                    required={field.wajib}
                                    placeholder={field.placeholder || `Masukkan ${field.label.toLowerCase()}...`}
                                    value={val}
                                    onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                                    className="text-xs sm:text-sm"
                                  />
                                ) : field.tipe === "date" ? (
                                  <Input
                                    type="date"
                                    required={field.wajib}
                                    value={val}
                                    onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                                    className="text-xs sm:text-sm font-semibold"
                                  />
                                ) : field.tipe === "number" ? (
                                  <Input
                                    type="number"
                                    required={field.wajib}
                                    placeholder={field.placeholder || "0"}
                                    value={val}
                                    onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                                    className="text-xs sm:text-sm font-mono"
                                  />
                                ) : (
                                  <Input
                                    type="text"
                                    required={field.wajib}
                                    placeholder={field.placeholder || `Masukkan ${field.label.toLowerCase()}...`}
                                    value={val}
                                    onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                                    className="text-xs sm:text-sm"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs text-muted-foreground">
                        Data yang Anda isi akan masuk ke antrean operator desa untuk diproses.
                      </p>
                      <Button
                        type="submit"
                        disabled={submitting}
                        size="lg"
                        className="w-full sm:w-auto bg-[#004329] hover:bg-[#00321F] text-white font-bold text-xs sm:text-sm rounded-xl gap-2 shadow-xs"
                      >
                        <Send className="size-4" />
                        <span>{submitting ? "Mengirim Permohonan..." : "Kirim Permohonan Surat"}</span>
                      </Button>
                    </div>
                  </Card>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LACAK & UNDUH SURAT */}
        {activeTab === "lacak" && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 shadow-xs border-border/80 space-y-4 bg-card">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Lacak Status & Unduh Surat Selesai
                </h3>
                <p className="text-xs text-muted-foreground">
                  Masukkan <strong>Kode Tiket</strong> (misal: <code>SRT-202508-4921</code>) atau <strong>NIK KTP</strong> pemohon.
                </p>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    required
                    placeholder="Contoh: SRT-202508-4921 atau NIK 16 digit"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 text-xs sm:text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={searching}
                  className="bg-[#004329] hover:bg-[#00321F] text-white font-bold text-xs sm:text-sm rounded-xl gap-2 shadow-xs"
                >
                  <Search className="size-4" />
                  <span>{searching ? "Mencari..." : "Lacak Status"}</span>
                </Button>
              </form>
            </Card>

            {/* Results Display */}
            {searchResult && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Hasil Pencarian ({searchResult.length} Permohonan)
                </h4>

                {searchResult.length === 0 ? (
                  <Card className="p-8 sm:p-12 text-center border-border/80 space-y-2">
                    <AlertCircle className="size-10 text-muted-foreground/60 mx-auto" />
                    <h3 className="text-base font-bold text-foreground">Permohonan Tidak Ditemukan</h3>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      Pastikan Kode Tiket atau NIK yang Anda masukkan sudah benar.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {searchResult.map((item) => (
                      <SuratCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SURAT SAYA */}
        {activeTab === "saya" && (
          <div className="space-y-6">
            {!user ? (
              <Card className="p-8 sm:p-12 text-center border-border/80 space-y-4 bg-card">
                <div className="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#004329] dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800/40">
                  <User className="size-7 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    Masuk untuk Melihat Riwayat Surat Anda
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Silakan login dengan NIK KTP Anda untuk melihat seluruh arsip permohonan surat dan mengunduh berkas selesai.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    asChild
                    className="bg-[#004329] hover:bg-[#00321F] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <Link href="/login?redirect=/layanan-surat">
                      Masuk Akun Warga
                    </Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      Riwayat Surat Saya ({myLetters.length})
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Daftar permohonan surat yang diajukan oleh akun NIK: <strong>{user.nik || user.email}</strong>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={loadMyLetters}
                    disabled={loadingMyLetters}
                    className="rounded-xl"
                    title="Muat Ulang"
                  >
                    <RefreshCw className={`size-4 ${loadingMyLetters ? "animate-spin text-[#004329]" : ""}`} />
                  </Button>
                </div>

                {loadingMyLetters ? (
                  <div className="py-16 text-center text-muted-foreground text-xs">
                    Memuat riwayat permohonan surat Anda...
                  </div>
                ) : myLetters.length === 0 ? (
                  <Card className="p-8 sm:p-12 text-center border-border/80 space-y-3 bg-card">
                    <FolderOpen className="size-12 text-muted-foreground/60 mx-auto" />
                    <h3 className="text-base font-bold text-foreground">Belum Ada Riwayat Surat</h3>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      Anda belum pernah mengajukan permohonan surat. Silakan buka tab <strong>Ajukan Surat</strong> untuk membuat permohonan baru.
                    </p>
                    <Button
                      onClick={() => setActiveTab("form")}
                      className="bg-[#004329] text-white text-xs font-bold rounded-xl hover:bg-[#00321F] shadow-xs"
                    >
                      Ajukan Surat Sekarang
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myLetters.map((item) => (
                      <SuratCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function SuratCard({ item }: { item: PermohonanSurat }) {
  const isSelesai = item.status === "SELESAI";
  const isDiproses = item.status === "DIPROSES";
  const isDitolak = item.status === "DITOLAK";

  const statusBadge = isSelesai ? (
    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 gap-1.5 font-bold text-xs py-1 px-3">
      <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>SELESAI (SIAP DIUNDUH)</span>
    </Badge>
  ) : isDiproses ? (
    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 gap-1.5 font-bold text-xs py-1 px-3">
      <Clock className="size-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
      <span>SEDANG DIPROSES</span>
    </Badge>
  ) : isDitolak ? (
    <Badge variant="destructive" className="gap-1.5 font-bold text-xs py-1 px-3">
      <XCircle className="size-3.5" />
      <span>DITOLAK</span>
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 gap-1.5 font-bold text-xs py-1 px-3">
      <Clock className="size-3.5 text-amber-600" />
      <span>MENUNGGU VERIFIKASI</span>
    </Badge>
  );

  return (
    <Card className="p-6 sm:p-8 shadow-xs border-border/80 space-y-4 transition hover:shadow-md bg-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-muted-foreground block uppercase">
            Kode Tiket: {item.id}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-foreground">
            {item.jenis_surat}
          </h3>
        </div>
        <div>{statusBadge}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-muted-foreground block">Nama Pemohon:</span>
          <span className="font-bold text-foreground">{item.nama_lengkap}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">NIK:</span>
          <span className="font-mono font-bold text-foreground">{item.nik}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Tanggal Pengajuan:</span>
          <span className="font-medium text-foreground/80">{formatDateIndonesian(item.created_at)}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">No. WhatsApp:</span>
          <span className="font-bold text-emerald-800 dark:text-emerald-400">{item.no_whatsapp}</span>
        </div>
      </div>

      {/* Dynamic Form Values Filled */}
      {item.data_formulir && Object.keys(item.data_formulir).length > 0 && (
        <div className="bg-muted/40 p-3.5 rounded-2xl border border-border/80 text-xs space-y-1.5">
          <span className="font-bold text-foreground block">Data Isian Formulir:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(item.data_formulir).map(([k, v]) => (
              <div key={k}>
                <span className="text-muted-foreground block capitalize">{k.replace(/_/g, " ")}:</span>
                <span className="font-semibold text-foreground">{String(v || "-")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catatan Petugas */}
      {item.catatan_admin && (
        <div className="bg-muted/40 p-3.5 rounded-2xl text-xs text-foreground border border-border/80">
          <strong>Catatan Petugas Desa:</strong> {item.catatan_admin}
        </div>
      )}

      {/* DOWNLOAD BUTTON IF FINISHED & FILE AVAILABLE */}
      {isSelesai && (
        <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-border/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 rounded-2xl">
          <div className="text-xs text-emerald-900 dark:text-emerald-200">
            <span className="font-bold block">Dokumen Surat Resmi Siap Diunduh</span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
              {item.nama_file_selesai || "Surat_Keterangan_Resmi.pdf"}
            </span>
          </div>

          {item.file_surat_selesai ? (
            <Button
              asChild
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl gap-2 shadow-xs"
            >
              <a
                href={item.file_surat_selesai}
                download={item.nama_file_selesai || "Surat_Desa_Bogem.pdf"}
              >
                <Download className="size-4" />
                <span>Unduh Surat Selesai</span>
              </a>
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Silakan ambil cetakan fisik surat di Balai Desa Bogem.
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
