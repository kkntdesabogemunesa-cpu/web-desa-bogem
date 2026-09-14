import { ImageResponse } from "next/og";

export const alt = "Website Resmi Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #042417 0%, #063321 40%, #083E28 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.15)",
            filter: "blur(90px)",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: "9999px",
                background: "rgba(16, 185, 129, 0.2)",
                border: "1px solid rgba(52, 211, 153, 0.4)",
                color: "#6ee7b7",
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              PORTAL RESMI PEMERINTAH DESA
            </div>
          </div>
          <div
            style={{
              color: "#93c5fd",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            KABUPATEN MAGETAN • JAWA TIMUR
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1px",
              color: "#ffffff",
            }}
          >
            DESA BOGEM
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 500,
              color: "#a7f3d0",
              lineHeight: 1.3,
            }}
          >
            Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#cbd5e1",
              marginTop: "8px",
              lineHeight: 1.4,
            }}
          >
            Layanan Surat Online • Profil & Infografis APBDes • Warta Desa • Etalase Produk UMKM Warga
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "16px",
              color: "#e2e8f0",
            }}
          >
            <span>Status: Desa Mandiri (IDM)</span>
            <span>•</span>
            <span>Bakti Mulya No. 241</span>
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#34d399",
            }}
          >
            desabogem.my.id
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
