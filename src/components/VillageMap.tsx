"use client";

import dynamic from "next/dynamic";
import { Layers } from "lucide-react";

// Load Leaflet map strictly on client side to prevent SSR issues
const InteractiveBogemMap = dynamic(
  () => import("@/components/InteractiveBogemMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] sm:h-[440px] lg:h-[480px] min-h-[380px] rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <Layers className="w-6 h-6 animate-pulse text-emerald-700" />
        </div>
        <span className="text-xs font-semibold text-slate-600">
          Memuat Peta Interaktif & Tapal Batas Desa Bogem...
        </span>
      </div>
    ),
  }
);

export default function VillageMap() {
  return <InteractiveBogemMap />;
}
