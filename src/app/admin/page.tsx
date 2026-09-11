"use client";

import Link from "next/link";
import {
  Newspaper,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Users,
  Target,
  ArrowLeft,
  Settings,
  PieChart,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const adminMenus = [
    {
      title: "Layanan Surat Online",
      desc: "Verifikasi permohonan surat warga (SKU, SKTM, Domisili, SKCK), buat draf cetak resmi, dan kirimkan via Email / WhatsApp.",
      href: "/admin/surat",
      icon: FileText,
      isHighlighted: true,
    },
    {
      title: "Infografis, APBDes & IDM",
      desc: "Ubah jumlah penduduk, rasio gender, kelembagaan organisasi desa, APBDes, dan Skor Status IDM desa.",
      href: "/admin/infografis",
      icon: PieChart,
    },
    {
      title: "Kelola SOTK & Aparatur",
      desc: "Tambah, edit nama, jabatan, foto potret resmi, nomor WhatsApp, dan susunan hierarki aparatur pemerintahan desa.",
      href: "/admin/sotk",
      icon: Users,
    },
    {
      title: "Profil, Kontak & Jam Layanan",
      desc: "Sesuaikan visi misi, sambutan kades, bagan organisasi, serta jam pelayanan kantor, alamat, email, dan nomor WhatsApp resmi desa.",
      href: "/admin/profil-desa",
      icon: Target,
    },
    {
      title: "Kelola & Terbitkan Berita",
      desc: "Publikasikan warta kegiatan kemasyarakatan baru, pengumuman pemerintah desa, atau kelola berita yang sudah terbit.",
      href: "/admin/berita",
      icon: Newspaper,
    },
    {
      title: "Kelola Produk UMKM Desa",
      desc: "Daftarkan produk karya warga lokal, foto produk, harga, deskripsi usaha, dan nomor pemesanan WhatsApp.",
      href: "/admin/umkm",
      icon: ShoppingBag,
    },
  ];

  return (
    <main className="min-h-screen bg-background pb-24 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 text-foreground">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="text-xs font-semibold gap-1.5 p-0 hover:bg-transparent text-emerald-800 dark:text-emerald-400">
            <Link href="/">
              <ArrowLeft className="size-4" />
              <span>Kembali ke Website Utama</span>
            </Link>
          </Button>
          <Badge variant="outline" className="gap-1.5 py-1 px-3 bg-card font-semibold text-xs shadow-2xs">
            <Settings className="size-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Mode Pengelola Desa</span>
          </Badge>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-br from-[#063321] via-[#083E28] to-[#0A4D33] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xs relative overflow-hidden border border-emerald-800/40">
          <div className="space-y-3 sm:space-y-4 max-w-2xl relative z-10">
            <Badge className="bg-emerald-800/80 border border-emerald-500/40 text-emerald-100 gap-1.5 uppercase tracking-wider text-xs font-bold">
              <ShieldCheck className="size-3.5 text-emerald-300" />
              <span>Panel Pengelola Desa Bogem</span>
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Portal Kelola Data Desa
            </h1>
            <p className="text-emerald-100/85 text-xs sm:text-sm leading-relaxed">
              Pusat pengelolaan mandiri data website Desa Bogem. Perubahan yang Anda simpan di sini akan langsung tampil pada website utama.
            </p>
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {adminMenus.map((menu, idx) => {
            const Icon = menu.icon;
            return (
              <Link key={idx} href={menu.href} className="group block focus-visible:outline-none">
                <Card
                  className={`p-6 transition-all duration-200 flex flex-col justify-between h-full group-hover:shadow-md group-hover:-translate-y-0.5 group-active:scale-98 bg-card ${
                    menu.isHighlighted
                      ? "border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-500/20"
                      : "border-border/80 group-hover:border-border"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform border border-emerald-100 dark:border-emerald-800/50">
                      <Icon className="size-6 text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition leading-snug">
                      {menu.title}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {menu.desc}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center text-xs font-bold text-emerald-800 dark:text-emerald-400 group-hover:translate-x-1 transition">
                    <span>Buka Kelola</span>
                    <ArrowRight className="size-3.5 ml-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
