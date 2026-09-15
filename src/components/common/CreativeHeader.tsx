"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface CreativeHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
}

export const CreativeHeader: React.FC<CreativeHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: "Profil Desa" },
  ],
  children,
  rightContent,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063321] via-[#083E28] to-[#0A4D33] border border-emerald-800/40 shadow-xs text-white",
        "p-6 sm:p-8 lg:p-10 pb-12 sm:pb-14 lg:pb-16",
        rightContent ? "flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8" : "",
        className
      )}
    >
      {/* 1. Subtle Ambient Glows (GPU-accelerated) */}
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none transform-gpu"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none transform-gpu"
      />

      {/* 2. Subtle Micro-Dot Texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 3. Main Text Content */}
      <div className={cn("relative z-10 space-y-3 sm:space-y-4 max-w-3xl", rightContent ? "max-w-2xl text-center md:text-left" : "")}>
        {/* Simple & Clean Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className={cn(
            "flex items-center space-x-2 text-xs text-emerald-200/80 font-medium",
            rightContent ? "justify-center md:justify-start" : ""
          )}
        >
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-emerald-500/60">/</span>}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    {idx === 0 && (
                      <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="text-white font-medium">{item.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Optional Extra Elements (e.g. Badges/Tags) */}
        {children && <div className="pt-1">{children}</div>}
      </div>

      {/* 4. Optional Right Side Box (e.g. IDM Score Box) */}
      {rightContent && <div className="relative z-10 shrink-0 w-full sm:w-auto">{rightContent}</div>}

      {/* 5. Subtle White Wave at the Bottom (Gelombang Halus di Bagian Bawah) */}
      <div className="absolute -bottom-0.5 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
        <svg
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          className="relative block w-full h-5 sm:h-7 md:h-10 text-background"
        >
          {/* Layer 1: Aksen Gelombang Putih Transparan (Soft White Accent Wave) */}
          <path
            d="M0,32 C200,62 420,15 660,42 C900,68 1060,22 1200,38 L1200,80 L0,80 Z"
            fill="rgba(255, 255, 255, 0.14)"
          />
          {/* Layer 2: Gelombang Putih Menyatu dengan Background Halaman */}
          <path
            d="M0,46 C240,20 480,66 740,32 C1000,-2 1110,48 1200,36 L1200,80 L0,80 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default CreativeHeader;
