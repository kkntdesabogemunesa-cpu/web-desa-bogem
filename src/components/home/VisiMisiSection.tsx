import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { ProfilDesaData } from "@/types/profil";
import { defaultProfilDesa } from "@/services/profilService";

interface VisiMisiSectionProps {
  profilData: ProfilDesaData;
}

export default function VisiMisiSection({ profilData }: VisiMisiSectionProps) {
  const visi = (profilData.visi || defaultProfilDesa.visi || "").replace(/Balerejo/gi, "Bogem");
  const misiList = profilData.misi && profilData.misi.length > 0 ? profilData.misi : defaultProfilDesa.misi;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[#004329] tracking-tight">
            Visi & Misi Pembangunan
          </h2>

          <Link
            href="/profil"
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
          >
            <span>Lihat Profil Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Visi Card - Clean & Inspiring */}
        <div className="bg-gradient-to-br from-emerald-50/80 via-emerald-50/40 to-teal-50/30 p-5 sm:p-6 rounded-2xl border border-emerald-100/80 space-y-2 relative overflow-hidden">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-700/10 text-emerald-800 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <Compass className="w-3 h-3 text-emerald-700" />
            <span>Visi Utama Desa</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-[#063321] leading-relaxed">
            &ldquo;{visi}&rdquo;
          </p>
        </div>

        {/* Misi Grid - Modern Numbered Cards */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Misi Strategis Desa
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {misiList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3.5 bg-slate-50/60 hover:bg-emerald-50/40 p-4 rounded-2xl border border-slate-200/60 hover:border-emerald-300 transition duration-200 group"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 group-hover:bg-[#063321] group-hover:text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-colors duration-200">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {item.replace(/Balerejo/gi, "Bogem")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile-only Link */}
        <div className="sm:hidden pt-1 text-right">
          <Link
            href="/profil"
            className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
          >
            <span>Lihat Profil Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
