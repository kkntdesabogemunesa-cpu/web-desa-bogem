"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BOGEM_LOCATION } from "@/data/bogemGeoJson";
import { RefreshCw } from "lucide-react";

export default function InteractiveBogemMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const isZoomingRef = useRef(false);
  const hasAnimatedRef = useRef(false);
  const [isZooming, setIsZooming] = useState(false);

  // Animasi Zoom Mulus: Menghilangkan getar dan mengalir sinematik ke kotak poligon Bogem
  const triggerZoomAnimation = useCallback((targetMap?: L.Map, fromFar = false) => {
    const map = targetMap || mapInstanceRef.current;
    if (!map || isZoomingRef.current) return;

    isZoomingRef.current = true;
    setIsZooming(true);

    const bounds = L.latLngBounds(BOGEM_LOCATION.polygonCoordinates);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const padding: [number, number] = isMobile ? [16, 16] : [24, 24];

    if (fromFar) {
      // Zoom out dulu ke pandangan jauh regional Magetan (zoom 11), lalu meluncur masuk
      map.flyTo(BOGEM_LOCATION.initialZoomOut, 11, {
        duration: 1.2,
        easeLinearity: 0.3,
      });

      setTimeout(() => {
        if (!mapInstanceRef.current) return;
        map.flyToBounds(bounds, {
          duration: 2.2,
          easeLinearity: 0.25,
          padding,
          maxZoom: 15.5,
        });

        map.once("moveend", () => {
          isZoomingRef.current = false;
          setIsZooming(false);
        });
      }, 1300);
    } else {
      // Zoom mulus langsung ke batas poligon Desa Bogem
      map.flyToBounds(bounds, {
        duration: 2.3,
        easeLinearity: 0.25,
        padding,
        maxZoom: 15.5,
      });

      map.once("moveend", () => {
        isZoomingRef.current = false;
        setIsZooming(false);
      });
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // 1. Tampilan Awal Jauh dari Lokasi (Zoom 11 - Lanskap Luas Kawasan)
    const map = L.map(mapContainerRef.current, {
      center: BOGEM_LOCATION.initialZoomOut,
      zoom: 11,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    // Kontrol zoom di pojok kanan bawah
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // 2. Basemap Citra Satelit Esri dengan pengaturan stabil agar tidak bergetar saat zoom
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles © Esri — Source: Esri, Maxar",
        maxZoom: 18,
        updateWhenZooming: false, // Kunci: jangan me-reload tile saat animasi bergerak agar tidak geter
        updateWhenIdle: true,
        keepBuffer: 8,
      }
    ).addTo(map);

    // 3. Highlight Poligon Wilayah Desa Bogem (Tetap batas resmi BIG tanpa diubah)
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

    // 4. Pin Marker Kantor Desa Bogem
    const customPinIcon = L.divIcon({
      className: "custom-bogem-pin",
      html: `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        ">
          <div style="
            background: #004329;
            color: #ffffff;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
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

    // ResizeObserver yang aman tanpa menginterupsi animasi zoom
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current && !isZoomingRef.current) {
          mapInstanceRef.current.invalidateSize({ pan: false });
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    const handleWindowResize = () => {
      if (mapInstanceRef.current && !isZoomingRef.current) {
        mapInstanceRef.current.invalidateSize({ pan: false });
      }
    };
    window.addEventListener("resize", handleWindowResize);

    // IntersectionObserver untuk memicu animasi zoom saat user scroll mendekati peta
    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && mapContainerRef.current) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && mapInstanceRef.current && !isZoomingRef.current) {
              mapInstanceRef.current.invalidateSize({ pan: false });

              // Ketika user scroll mendekati peta, baru mulai animasi zoom halus dari jauh ke kotak Bogem
              if (!hasAnimatedRef.current) {
                hasAnimatedRef.current = true;
                setTimeout(() => {
                  if (mapInstanceRef.current) {
                    triggerZoomAnimation(mapInstanceRef.current, false);
                  }
                }, 250);
              }
            }
          });
        },
        {
          rootMargin: "0px 0px -40px 0px",
          threshold: 0.2,
        }
      );
      intersectionObserver.observe(mapContainerRef.current);
    } else {
      // Fallback jika IntersectionObserver tidak tersedia
      const timer = setTimeout(() => {
        triggerZoomAnimation(map, false);
      }, 700);
      return () => clearTimeout(timer);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [triggerZoomAnimation]);

  return (
    <div className="relative isolate z-0 w-full h-[380px] sm:h-[440px] lg:h-[480px] min-h-[380px] rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100">
      {/* Container Leaflet Map */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] z-0" />

      {/* Floating Header Pill - Simpel & Minimalis */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xs border border-slate-200/70 flex items-center space-x-2 text-xs pointer-events-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-bold text-slate-800">Desa Bogem</span>
        <span className="text-slate-400">·</span>
        <span className="text-[11px] text-slate-600 font-medium">Kec. Kawedanan</span>
      </div>

      {/* Tombol Ulangi Zoom - Halus & Ramping */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <button
          type="button"
          onClick={() => triggerZoomAnimation(undefined, true)}
          disabled={isZooming}
          className="bg-white/90 hover:bg-white backdrop-blur-md text-emerald-950 font-bold text-xs px-3 py-1.5 rounded-full shadow-xs border border-slate-200/70 flex items-center space-x-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          title="Ulangi Animasi Zoom dari Jauh"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isZooming ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Ulangi Zoom</span>
        </button>
      </div>
    </div>
  );
}
