import { BOGEM_BOUNDARY_COORDINATES } from "./bogemBoundaryOfficial";

export interface VillageGeoData {
  center: [number, number]; // [lat, lng]
  initialZoomOut: [number, number]; // [lat, lng] untuk animasi awal zoom dari arah Magetan
  kantorDesa: [number, number];
  batas: {
    utara: string;
    timur: string;
    selatan: string;
    barat: string;
  };
  luasWilayah: string;
  luasMeterPersegi: string;
  jumlahPenduduk: string;
  polygonCoordinates: [number, number][]; // [lat, lng] koordinat batas teritorial presisi resmi BIG
}

export const BOGEM_LOCATION: VillageGeoData = {
  center: [-7.6853118, 111.4075610],
  initialZoomOut: [-7.6580, 111.3850], // Sudut pandang luas Kabupaten Magetan
  kantorDesa: [-7.6843086, 111.4087483], // Jl. Bakti Mulya No. 241, Desa Bogem
  batas: {
    utara: "Desa Karangrejo, Kec. Kawedanan",
    timur: "Kelurahan Sampung, Kec. Kawedanan",
    selatan: "Kelurahan Sampung, Kec. Kawedanan",
    barat: "Desa Jambangan, Kec. Kawedanan",
  },
  luasWilayah: "101,03 Ha",
  luasMeterPersegi: "1.010.300 m²",
  jumlahPenduduk: "1.615 Jiwa",
  // Polygon batas administratif resmi Desa Bogem (Badan Informasi Geospasial / BIG)
  polygonCoordinates: BOGEM_BOUNDARY_COORDINATES,
};
