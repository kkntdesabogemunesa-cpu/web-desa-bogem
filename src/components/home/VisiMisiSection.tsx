import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { ProfilDesaData } from "@/types/profil";
import { defaultProfilDesa } from "@/services/profilService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VisiMisiSectionProps {
  profilData: ProfilDesaData;
}

export default function VisiMisiSection({ profilData }: VisiMisiSectionProps) {
  const visi = (profilData.visi || defaultProfilDesa.visi || "").replace(/Balerejo/gi, "Bogem");
  const misiList = profilData.misi && profilData.misi.length > 0 ? profilData.misi : defaultProfilDesa.misi;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
      <Card className="p-6 sm:p-8 lg:p-10 shadow-xs border-border/80 space-y-6 bg-card">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[#004329] dark:text-emerald-400 tracking-tight">
            Visi & Misi Pembangunan
          </h2>

          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-xs font-bold text-emerald-800 dark:text-emerald-400 gap-1.5 hover:text-emerald-950">
            <Link href="/profil">
              <span>Lihat Profil Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        {/* Visi Card - Clean & Inspiring */}
        <div className="bg-gradient-to-br from-emerald-50/80 via-emerald-50/40 to-teal-50/30 dark:from-emerald-950/40 dark:to-teal-950/20 p-5 sm:p-6 rounded-2xl border border-emerald-100/80 dark:border-emerald-800/40 space-y-2 relative overflow-hidden">
          <Badge variant="secondary" className="gap-1 bg-emerald-700/10 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px] font-bold">
            <Compass className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
            <span>Visi Utama Desa</span>
          </Badge>
          <p className="text-sm sm:text-base font-bold text-[#063321] dark:text-emerald-100 leading-relaxed">
            &ldquo;{visi}&rdquo;
          </p>
        </div>

        {/* Misi Grid - Modern Numbered Cards */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Misi Strategis Desa
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {misiList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3.5 bg-muted/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 p-4 rounded-2xl border border-border/80 hover:border-emerald-300 dark:hover:border-emerald-700 transition duration-200 group"
              >
                <Badge
                  variant="default"
                  className="size-7 rounded-xl bg-emerald-100 text-emerald-800 group-hover:bg-[#063321] group-hover:text-white dark:bg-emerald-900 dark:text-emerald-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors p-0"
                >
                  {idx + 1}
                </Badge>
                <span className="text-xs sm:text-sm text-foreground/80 font-medium leading-relaxed">
                  {item.replace(/Balerejo/gi, "Bogem")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile-only Link */}
        <div className="sm:hidden pt-1 text-right">
          <Button asChild variant="link" size="sm" className="text-xs font-bold text-emerald-800 dark:text-emerald-400 gap-1 p-0">
            <Link href="/profil">
              <span>Lihat Profil Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
