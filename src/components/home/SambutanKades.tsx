import { ProfilDesaData } from "@/types/profil";
import { PerangkatItem } from "@/types/perangkat";
import { defaultProfilDesa } from "@/services/profilService";
import { ShieldCheck, Building2, UserCheck, Quote, Landmark } from "lucide-react";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

interface SambutanKadesProps {
  profilData: ProfilDesaData;
  listPerangkat: PerangkatItem[];
}

export default function SambutanKades({ profilData, listPerangkat }: SambutanKadesProps) {
  const kadesFromSOTK = listPerangkat.find(
    (p) => p.jabatan.toLowerCase().includes("kepala desa") && !p.jabatan.toLowerCase().includes("dusun")
  );

  const displayKadesFoto =
    profilData.foto_kades && profilData.foto_kades !== "/images/kades.png"
      ? profilData.foto_kades
      : kadesFromSOTK?.foto || "";

  const displayKadesNama =
    profilData.nama_kades &&
    !profilData.nama_kades.toLowerCase().includes("balerejo") &&
    profilData.nama_kades !== "H. Suratno, S.Sos." &&
    profilData.nama_kades !== "Kepala Desa Bogem"
      ? profilData.nama_kades
      : (kadesFromSOTK?.nama || "Kepala Desa Bogem");

  const displaySambutan = (profilData.sambutan_kades || defaultProfilDesa.sambutan_kades || "")
    .replace(/Balerejo/gi, "Bogem")
    .replace(/Kebonsari/gi, "Kawedanan")
    .replace(/Madiun/gi, "Magetan");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 lg:gap-10">
          
          {/* Portrait Photo Frame */}
          <div className="w-44 sm:w-52 md:w-56 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex-shrink-0 relative group flex items-center justify-center">
            <ImageWithSkeleton
              src={displayKadesFoto}
              alt={displayKadesNama}
              priority={true}
              sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, 224px"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              fallbackIcon={<UserCheck className="w-14 h-14 text-slate-400" />}
            />

            {/* Official Badge Pill */}
            <div className="absolute top-2.5 left-2.5 bg-[#063321]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1.5 border border-emerald-500/30">
              <Landmark className="w-3 h-3 text-emerald-300 flex-shrink-0" />
              <span>Kepala Desa</span>
            </div>
          </div>

          {/* Speech & Identity */}
          <div className="flex-grow space-y-4 text-center md:text-left flex flex-col justify-between self-stretch">
            <div className="space-y-3">
              {/* Header Label */}
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <Quote className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Sambutan Kepala Desa</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
                Membangun Desa Bogem yang Maju, Transparan & Melayani
              </h3>

              {/* Sincere Quote Text */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal italic">
                &ldquo;{displaySambutan}&rdquo;
              </p>
            </div>

            {/* Signature & Attribution Block */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  {displayKadesNama}
                </h4>
                <p className="text-xs text-emerald-800 font-medium mt-0.5 flex items-center justify-center md:justify-start gap-1">
                  <span>Kepala Desa Bogem, Kec. Kawedanan</span>
                </p>
              </div>

              <div className="inline-flex items-center space-x-1.5 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/70 self-center md:self-auto">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pemerintah Desa Bogem</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
