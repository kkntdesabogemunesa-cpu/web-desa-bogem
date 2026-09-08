"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [igNotice, setIgNotice] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWA = () => {
    if (typeof window !== "undefined") {
      const text = encodeURIComponent(
        `*${title}*\n\nBaca selengkapnya di Website Resmi Desa Bogem:\n${window.location.href}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    }
  };

  const handleShareFB = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        "_blank",
        "noopener,noreferrer,width=600,height=500"
      );
    }
  };

  const handleShareIG = async () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      // If Web Share API is available (e.g. mobile browser), try native sharing
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: `${title} - Website Resmi Desa Bogem`,
            url: url,
          });
          return;
        } catch {
          // User cancelled or unsupported, fallback to copy & open
        }
      }

      await navigator.clipboard.writeText(url);
      setIgNotice(true);
      setTimeout(() => setIgNotice(false), 3500);
      window.open("https://www.instagram.com/", "_blank");
    }
  };

  return (
    <div className="relative grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
      {/* WhatsApp */}
      <button
        type="button"
        onClick={handleShareWA}
        className="inline-flex items-center justify-center space-x-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] border border-[#25D366]/30 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm"
        title="Bagikan ke WhatsApp"
      >
        <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        <span>WhatsApp</span>
      </button>

      {/* Facebook */}
      <button
        type="button"
        onClick={handleShareFB}
        className="inline-flex items-center justify-center space-x-1.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm"
        title="Bagikan ke Facebook"
      >
        <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>Facebook</span>
      </button>

      {/* Instagram */}
      <button
        type="button"
        onClick={handleShareIG}
        className="inline-flex items-center justify-center space-x-1.5 bg-[#E1306C]/10 hover:bg-[#E1306C]/20 text-[#E1306C] border border-[#E1306C]/30 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm"
        title="Bagikan ke Instagram (Salin link & buka Instagram)"
      >
        <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
        <span>{igNotice ? "Tautan Disalin!" : "Instagram"}</span>
      </button>

      {/* Salin Link */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm"
        title="Salin Tautan Artikel"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        ) : (
          <LinkIcon className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
        )}
        <span>{copied ? "Tersalin!" : "Salin Link"}</span>
      </button>

      {/* Tooltip feedback for Instagram */}
      {igNotice && (
        <div className="col-span-2 sm:absolute sm:-top-10 sm:left-0 bg-slate-900 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-lg flex items-center justify-center space-x-1.5 z-20 whitespace-nowrap">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tautan artikel disalin! Siap dibagikan.</span>
        </div>
      )}
    </div>
  );
}
