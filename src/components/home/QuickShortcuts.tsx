import Link from "next/link";
import {
  UserCheck,
  Users,
  PieChart,
  ShoppingBag,
  Newspaper,
  FileText,
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface ShortcutItem {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  isSpecial?: boolean;
}

const QUICK_SHORTCUTS: ShortcutItem[] = [
  {
    title: "Layanan Surat",
    desc: "Pengajuan Online",
    href: "/layanan-surat",
    icon: FileText,
    isSpecial: true,
  },
  {
    title: "Profil Desa",
    desc: "Sejarah & Wilayah",
    href: "/profil",
    icon: UserCheck,
  },
  {
    title: "Struktur SOTK",
    desc: "Aparatur Desa",
    href: "/profil?tab=bagan",
    icon: Users,
  },
  {
    title: "Infografis",
    desc: "Data & APBDes",
    href: "/infografis",
    icon: PieChart,
  },
  {
    title: "Beli Dari Desa",
    desc: "Etalase UMKM",
    href: "/potensi",
    icon: ShoppingBag,
  },
  {
    title: "Kabar Berita",
    desc: "Warta Terkini",
    href: "/berita",
    icon: Newspaper,
  },
];

export default function QuickShortcuts() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 sm:pb-16 relative z-10">
      {/* Section Header */}
      <div className="mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#004329] tracking-tight">
          Layanan Utama Desa Bogem
        </h2>
      </div>

      {/* Shortcuts Grid using shadcn Card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {QUICK_SHORTCUTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} href={item.href} className="group block focus-visible:outline-none">
              <Card
                className={`p-4 sm:p-5 transition-all duration-200 flex flex-col items-center text-center space-y-3 cursor-pointer group-hover:shadow-md group-hover:-translate-y-0.5 group-active:scale-95 ${
                  item.isSpecial
                    ? "bg-gradient-to-br from-[#063321] to-[#0b482f] text-white border-emerald-700/80 shadow-xs"
                    : "bg-card hover:border-emerald-500/40 hover:bg-muted/30 border-border/80"
                }`}
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
                    item.isSpecial
                      ? "bg-emerald-700/60 text-emerald-200 border border-emerald-500/30"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-100/80 group-hover:bg-[#063321] group-hover:text-white group-hover:border-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 w-full">
                  <h3
                    className={`text-xs sm:text-sm font-bold truncate ${
                      item.isSpecial ? "text-white" : "text-foreground group-hover:text-emerald-800"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-[11px] font-normal truncate mt-0.5 ${
                      item.isSpecial ? "text-emerald-200/90" : "text-muted-foreground"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
