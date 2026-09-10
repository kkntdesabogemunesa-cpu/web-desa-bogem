"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Landmark, ShoppingBag, Users, ChevronLeft, ChevronRight, FileText } from "lucide-react";

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: typeof Landmark;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Selamat Datang di Website Resmi Desa Bogem",
    subtitle: "Kecamatan Kawedanan, Kabupaten Magetan",
    description: "Pusat informasi publik terpadu, transparansi tata kelola pemerintahan desa, layanan administrasi surat online, dan etalase promosi karya UMKM warga.",
    badge: "Pemerintah Desa Bogem",
    icon: Landmark,
  },
  {
    title: "Tata Kelola Pemerintahan & Pelayanan Prima",
    subtitle: "Inklusif, Cepat & Melayani Sepenuh Hati",
    description: "Mewujudkan pelayanan masyarakat yang transparan, profesional, dan akuntabel didukung digitalisasi layanan persuratan warga.",
    badge: "SOTK & Aparatur Desa",
    icon: Users,
  },
  {
    title: "Potensi Desa & Produk Unggulan UMKM",
    subtitle: "Dukung Produk Buatan Warga Lokal",
    description: "Temukan beragam hasil bumi, kerajinan tangan khas, serta olahan kuliner berkualitas langsung dari para perajin dan pelaku usaha desa.",
    badge: "Etalase Beli Dari Desa",
    icon: ShoppingBag,
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const slide = HERO_SLIDES[currentSlide];
  const SlideIcon = slide.icon;

  return (
    <section
      className="relative overflow-hidden bg-[#05281a] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Background Image: Sawah Desa Bogem with cinematic overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-sawah.jpg"
          alt="Pemandangan Sawah Desa Bogem"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-105"
        />
        {/* Double-layer Emerald & Vignette Overlay for crisp text readability & rich depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#031d13]/95 via-[#063321]/88 to-[#073d28]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#042015] via-transparent to-black/40" />
      </div>

      {/* Ambient Decorative Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto pt-24 sm:pt-28 lg:pt-32 pb-20 sm:pb-24 lg:pb-28 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Main Hero Content */}
          <div className="max-w-2xl space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-800/70 border border-emerald-500/30 text-emerald-100 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm backdrop-blur-sm">
              <SlideIcon className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {slide.title}
            </h1>

            <p className="text-emerald-300 font-semibold text-sm sm:text-base lg:text-lg">
              {slide.subtitle}
            </p>

            <p className="text-emerald-100/90 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <Link
                href="/layanan-surat"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white text-[#063321] hover:bg-emerald-50 font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-black/10 hover:shadow-xl transition-all text-xs sm:text-sm active:scale-95"
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Ajukan Surat Online</span>
              </Link>
              <Link
                href="/potensi"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-800/40 hover:bg-emerald-800/70 text-white border border-emerald-500/40 font-semibold py-3.5 px-6 rounded-xl backdrop-blur-sm transition-all text-xs sm:text-sm active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-300" />
                <span>Produk UMKM Desa</span>
              </Link>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex lg:flex-col items-center justify-center gap-3 pt-2 lg:pt-0">
            <div className="flex items-center space-x-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? "w-7 bg-emerald-300" : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-90"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-90"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Curved Wave Bottom Divider */}
      <div className="absolute -bottom-0.5 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 md:h-16 text-[#F8FAFC]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C480,85 960,85 1440,20 L1440,80 L0,80 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
