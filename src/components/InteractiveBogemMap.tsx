"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BOGEM_LOCATION } from "@/data/bogemGeoJson";
import { RefreshCw } from "lucide-react";

export default function InteractiveBogemMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isZooming, setIsZooming] = useState(false);

  const triggerZoomAnimation = useCallback((targetMap?: L.Map) => {
    const map = targetMap || mapInstanceRef.current;
    if (!map) return;

    map.invalidateSize();
    setIsZooming(true);

    // Padding adaptif: lebih ramping di mobile agar polygon tidak terhimpit
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const padding: [number, number] = isMobile ? [12, 12] : [24, 24];

    // Gunakan bounds resmi 215 titik agar seluruh polygon tampil penuh dan presisi di tengah viewport
    const bounds = L.latLngBounds(BOGEM_LOCATION.polygonCoordinates);
    map.flyToBounds(bounds, {
      duration: 2.8,
      easeLinearity: 0.18,
      padding,
    });

    setTimeout(() => {
      setIsZooming(false);
    }, 2900);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Inisialisasi peta pada koordinat regional untuk efek fly-in
    const map = L.map(mapContainerRef.current, {
      center: BOGEM_LOCATION.initialZoomOut,
      zoom: 12,
      zoomControl: false,
      scrollWheelZoom: false, // Hindari scroll liar saat user scrolling halaman
    });

    // Kontrol zoom pojok kanan bawah
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Basemap Citra Satelit Esri World Imagery resolusi tinggi
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        maxZoom: 18,
      }
    ).addTo(map);

    // Highlight Polygon Wilayah Desa Bogem (Batas resmi BIG 215 titik koordinat presisi)
    const polygon = L.polygon(BOGEM_LOCATION.polygonCoordinates, {
      color: "#22c55e",
      weight: 2.5,
      opacity: 0.95,
      fillColor: "#10b981",
      fillOpacity: 0.2,
      className: "bogem-polygon-highlight",
    }).addTo(map);

    polygon.bindTooltip(
      "<div style='font-family: inherit; font-size: 11px; font-weight: 700; color: #064e3b;'>Wilayah Administratif Desa Bogem</div>",
      { sticky: true, direction: "top" }
    );

    // Custom Icon Pin Marker untuk Kantor Desa Bogem
    const customPinIcon = L.divIcon({
      className: "custom-bogem-pin",
      html: `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
        ">
          <div style="
            position: relative;
            background: #004329;
            color: #ffffff;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2.5px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const marker = L.marker(BOGEM_LOCATION.kantorDesa, { icon: customPinIcon }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: inherit; padding: 4px;">
        <h4 style="font-weight: 800; font-size: 13px; color: #0f172a; margin: 0 0 3px 0;">Kantor Desa Bogem</h4>
        <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">Jl. Bakti Mulya No. 241, Kec. Kawedanan, Kab. Magetan</p>
        <span style="display: inline-block; background: #ecfdf5; color: #047857; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; border: 1px solid #a7f3d0;">Pusat Administrasi & Pelayanan</span>
      </div>
    `);

    mapInstanceRef.current = map;

    // Listener perubahan ukuran container dan window agar Leaflet map otomatis re-render ukurannya
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    // IntersectionObserver untuk memicu invalidateSize saat container masuk viewport (misal saat scroll atau tab aktif)
    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && mapContainerRef.current) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
            }
          });
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(mapContainerRef.current);
    }

    const handleWindowResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleWindowResize);

    // Animasi Zoom Sinematik Otomatis dari Magetan ke Desa Bogem
    const timer = setTimeout(() => {
      triggerZoomAnimation(map);
    }, 600);

    return () => {
      clearTimeout(timer);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      window.removeEventListener("resize", handleWindowResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [triggerZoomAnimation]);

  return (
    <div className="relative isolate z-0 w-full h-[380px] sm:h-[440px] lg:h-[480px] min-h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
      {/* Container Leaflet Map */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] z-0" />

      {/* Floating Header Info Badge */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-white/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-md border border-slate-200/80 flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs pointer-events-auto">
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500" />
        <div className="font-bold text-slate-800 flex items-center gap-1 sm:gap-1.5">
          <span>Wilayah Desa Bogem</span>
          <span className="text-[9px] sm:text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full">
            Kec. Kawedanan
          </span>
        </div>
      </div>

      {/* Tombol Ulangi Animasi Zoom */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center space-x-2">
        <button
          type="button"
          onClick={() => triggerZoomAnimation()}
          disabled={isZooming}
          className="bg-white/95 hover:bg-white text-[#004329] font-bold text-[11px] sm:text-xs px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-md border border-slate-200/80 flex items-center space-x-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          title="Ulangi Efek Zoom ke Desa Bogem"
        >
          <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 ${isZooming ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Ulangi Zoom</span>
        </button>
      </div>

      {/* Legend Badge di Sudut Kiri Bawah */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 bg-white/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-md border border-slate-200/80 flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-[11px]">
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded bg-emerald-500/25 border-2 border-emerald-500 flex-shrink-0" />
        <span className="text-slate-700 font-medium">Batas Administratif Desa</span>
      </div>
    </div>
  );
}
