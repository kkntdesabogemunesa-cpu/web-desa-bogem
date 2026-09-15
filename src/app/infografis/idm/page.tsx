"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, TrendingUp, CheckCircle, ArrowLeft, TreePine, Store } from "lucide-react";
import Link from "next/link";
import { defaultInfografisData, fetchInfografisData } from "@/services/infografisService";
import { StatIDM } from "@/types/infografis";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CreativeHeader from "@/components/common/CreativeHeader";

export default function IDMPage() {
  const [idmData, setIdmData] = useState<StatIDM>(defaultInfografisData.idm);

  useEffect(() => {
    async function load() {
      try {
        const remote = await fetchInfografisData();
        if (remote?.idm) {
          setIdmData(remote.idm);
        }
      } catch (err) {
        console.error("Failed to load IDM data:", err);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-background pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Banner Section with Subtle White Wave */}
        <CreativeHeader
          title="Indeks Desa Membangun"
          subtitle="Tolak ukur kemandirian Desa Bogem berdasarkan ketahanan sosial (IKS), ketahanan ekonomi (IKE), dan ketahanan lingkungan hidup (IKL)."
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Infografis", href: "/infografis" },
            { label: "Status IDM" },
          ]}
          rightContent={
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-center w-full sm:w-auto min-w-[240px] sm:min-w-[260px] shadow-xs space-y-2.5">
              <Badge className="bg-emerald-400 text-[#063321] font-extrabold text-xs uppercase tracking-wider shadow-xs border-0 px-3 py-1">
                {idmData.status}
              </Badge>
              <div className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
                {Number(idmData.skorTotal || 0).toFixed(4)}
              </div>
              <div className="text-xs text-emerald-200/90 font-medium">
                Skor IDM Tahun {idmData.tahun}
              </div>
            </div>
          }
        />

        {/* 3 Constituent Sub-Index Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* IKS */}
          <Card className="p-5 sm:p-6 border-border/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-4 flex flex-col justify-between bg-card">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center border border-emerald-100/80 dark:border-emerald-800/40">
                  <ShieldCheck className="size-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <Badge variant="secondary" className="text-xs font-bold bg-emerald-50 text-emerald-800 border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300">
                  {idmData.iks?.label || "Sangat Baik"}
                </Badge>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">IKS (Ketahanan Sosial)</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight tabular-nums mt-1">
                  {Number(idmData.iks?.skor || 0).toFixed(4)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pelayanan kesehatan, akses pendidikan dasar, pemukiman layak, dan modal sosial kebersamaan warga.
              </p>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, (idmData.iks?.skor || 0) * 100))}%` }}
                />
              </div>
            </div>
          </Card>

          {/* IKE */}
          <Card className="p-5 sm:p-6 border-border/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-4 flex flex-col justify-between bg-card">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center border border-emerald-100/80 dark:border-emerald-800/40">
                  <Store className="size-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <Badge variant="secondary" className="text-xs font-bold bg-emerald-50 text-emerald-800 border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300">
                  {idmData.ike?.label || "Baik (Berkembang)"}
                </Badge>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">IKE (Ketahanan Ekonomi)</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight tabular-nums mt-1">
                  {Number(idmData.ike?.skor || 0).toFixed(4)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Keragaman produksi ekonomi warga, sentra perdagangan lokal, akses perbankan, dan logistik desa.
              </p>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-700 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, (idmData.ike?.skor || 0) * 100))}%` }}
                />
              </div>
            </div>
          </Card>

          {/* IKL */}
          <Card className="p-5 sm:p-6 border-border/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-4 flex flex-col justify-between bg-card">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center border border-emerald-100/80 dark:border-emerald-800/40">
                  <TreePine className="size-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <Badge variant="secondary" className="text-xs font-bold bg-emerald-50 text-emerald-800 border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300">
                  {idmData.ikl?.label || "Sangat Baik"}
                </Badge>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">IKL (Ketahanan Lingkungan)</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight tabular-nums mt-1">
                  {Number(idmData.ikl?.skor || 0).toFixed(4)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kualitas kelestarian lingkungan hidup, kesiapsiagaan mitigasi bencana, dan keteraturan ruang desa.
              </p>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-800 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, (idmData.ikl?.skor || 0) * 100))}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Yearly Growth Timeline */}
        {idmData.riwayat && idmData.riwayat.length > 0 && (
          <Card className="p-5 sm:p-7 border-border/80 shadow-xs space-y-5 bg-card">
            <div className="flex items-center space-x-3">
              <div className="size-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-100/80 dark:border-emerald-800/40">
                <TrendingUp className="size-4 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
                  Perkembangan Status IDM Pertahun
                </h2>
                <p className="text-xs text-muted-foreground">Rekam jejak capaian kemandirian desa secara berkala.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {idmData.riwayat.map((item) => {
                const isMandiri = item.status.toLowerCase().includes("mandiri");

                return (
                  <div
                    key={item.tahun}
                    className="bg-muted/40 p-4 sm:p-5 rounded-2xl border border-border/80 space-y-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Tahun {item.tahun}
                      </span>
                      <Badge
                        variant={isMandiri ? "default" : "secondary"}
                        className={`text-[11px] font-bold ${
                          isMandiri ? "bg-emerald-600 text-white" : ""
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight tabular-nums">
                      {Number(item.skor || 0).toFixed(4)}
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-700 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, (item.skor || 0) * 100))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Indicators Checklist */}
        {idmData.faktor_pendukung && idmData.faktor_pendukung.length > 0 && (
          <Card className="p-5 sm:p-7 border-border/80 shadow-xs space-y-4 bg-card">
            <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center space-x-2">
              <CheckCircle className="size-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>Faktor Pendukung Status Kemandirian Desa</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-muted-foreground font-medium">
              {idmData.faktor_pendukung.map((point, idx) => (
                <li key={idx} className="flex items-center space-x-2.5 bg-muted/40 p-3 rounded-xl border border-border/80">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </main>
  );
}
