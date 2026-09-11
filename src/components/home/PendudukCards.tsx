"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useCountUp } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PendudukCardsProps {
  totalPenduduk?: number;
  kepalaKeluarga?: number;
  perempuan?: number;
  lakiLaki?: number;
}

export default function PendudukCards({
  totalPenduduk = 1615,
  kepalaKeluarga = 1080,
  perempuan = 815,
  lakiLaki = 800,
}: PendudukCardsProps) {
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const animatedTotal = useCountUp(totalPenduduk, 1400, hasEnteredView);
  const animatedKk = useCountUp(kepalaKeluarga, 1200, hasEnteredView);
  const animatedPerempuan = useCountUp(perempuan, 1300, hasEnteredView);
  const animatedLaki = useCountUp(lakiLaki, 1300, hasEnteredView);

  const stats = [
    {
      label: "TOTAL PENDUDUK",
      value: animatedTotal,
      img: "/images/penduduk/total-penduduk.png",
      alt: "Total Penduduk",
      badge: "Kependudukan",
    },
    {
      label: "KEPALA KELUARGA",
      value: animatedKk,
      img: "/images/penduduk/kepala-keluarga.png",
      alt: "Kepala Keluarga",
      badge: "Kartu Keluarga",
    },
    {
      label: "PEREMPUAN",
      value: animatedPerempuan,
      img: "/images/penduduk/perempuan.png",
      alt: "Perempuan",
      badge: "Warga",
    },
    {
      label: "LAKI-LAKI",
      value: animatedLaki,
      img: "/images/penduduk/laki-laki.png",
      alt: "Laki-Laki",
      badge: "Warga",
    },
  ];

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-[#004329] dark:text-emerald-400 tracking-tight">
        Jumlah Penduduk dan Kepala Keluarga
      </h3>

      {/* Grid 4 Kartu Kependudukan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {stats.map((item, idx) => (
          <Card
            key={idx}
            className="p-4 sm:p-5 border-border/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 hover:-translate-y-0.5 transition-all duration-200 flex flex-row items-center space-x-4 sm:space-x-5 group"
          >
            {/* Avatar image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image
                src={item.img}
                alt={item.alt}
                width={96}
                height={96}
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-[13px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  {item.label}
                </span>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 font-normal">
                  {item.badge}
                </Badge>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0D6E4A] dark:text-emerald-400 tracking-tight">
                {item.value.toLocaleString("id-ID")}{" "}
                <span className="text-base sm:text-lg font-semibold text-muted-foreground">Jiwa</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
