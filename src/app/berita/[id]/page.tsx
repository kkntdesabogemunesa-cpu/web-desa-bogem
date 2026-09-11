import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchBeritaById, fetchBeritaList } from "@/services/beritaService";
import { formatDateIndonesian } from "@/utils/formatters";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Clock,
  Newspaper,
  ArrowRight,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import ShareButtons from "@/components/berita/ShareButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60; // Cache individual article for 60 seconds

export async function generateStaticParams() {
  try {
    const list = await fetchBeritaList();
    return list.map((item) => ({
      id: String(item.id),
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const berita = await fetchBeritaById(id);

  if (!berita) {
    return {
      title: "Warta Tidak Ditemukan | Desa Bogem",
      description: "Artikel warta atau pengumuman desa tidak ditemukan.",
    };
  }

  const cleanDescription = berita.ringkasan || berita.konten.slice(0, 160).replace(/\n/g, " ");

  return {
    title: `${berita.judul} | Desa Bogem`,
    description: cleanDescription,
    openGraph: {
      title: berita.judul,
      description: cleanDescription,
      type: "article",
      publishedTime: berita.created_at,
      authors: [berita.penulis || "Pemerintah Desa Bogem"],
      images: berita.gambar ? [{ url: berita.gambar, alt: berita.judul }] : [],
    },
  };
}

export default async function DetailBeritaPage({ params }: PageProps) {
  const { id } = await params;
  const [berita, allNews] = await Promise.all([
    fetchBeritaById(id),
    fetchBeritaList(),
  ]);

  if (!berita) {
    return (
      <main className="min-h-screen bg-slate-50/60 pb-28 pt-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8 sm:p-10 shadow-sm border-border/70 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
            <Newspaper className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Warta Tidak Ditemukan</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Berita atau pengumuman yang Anda cari mungkin telah diperbarui, dipindahkan, atau belum dipublikasikan.
          </p>
          <div className="pt-2">
            <Button asChild size="sm">
              <Link href="/berita" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Berita</span>
              </Link>
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  const otherNews = allNews
    .filter((item) => String(item.id) !== String(id))
    .slice(0, 3);

  // Calculate estimated reading time
  const wordCount = (berita.konten || "").split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const paragraphs = berita.konten
    ? berita.konten.split("\n").filter((p) => p.trim() !== "")
    : [];

  return (
    <main className="min-h-screen bg-slate-50/60 pb-28 pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          <Link href="/" className="hover:text-primary transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />
          <Link href="/berita" className="hover:text-primary transition-colors">
            Kabar Berita
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />
          <span className="text-foreground font-semibold truncate max-w-[160px] sm:max-w-md">
            {berita.judul}
          </span>
        </nav>

        {/* Back Link Button */}
        <div>
          <Button asChild variant="outline" size="sm" className="rounded-xl shadow-xs">
            <Link href="/berita" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Kabar Berita</span>
            </Link>
          </Button>
        </div>

        {/* Article Container */}
        <Card className="rounded-2xl sm:rounded-3xl border-border/70 shadow-sm overflow-hidden">
          <CardContent className="p-6 sm:p-10 lg:p-12 space-y-6">
            {/* Header & Meta */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-semibold text-xs py-1 px-3 bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-emerald-700" />
                  <span>{berita.kategori || "Pengumuman Resmi"}</span>
                </Badge>

                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{readTimeMinutes} menit baca</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-snug sm:leading-tight tracking-tight break-words">
                {berita.judul}
              </h1>

              {/* Author & Publish Info Bar */}
              <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                <Avatar className="w-9 h-9 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground truncate">
                    {berita.penulis || "Pemerintah Desa Bogem"}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{formatDateIndonesian(berita.created_at)}</span>
                  </div>
                </div>
              </div>
            </header>

            <Separator />

            {/* Banner Photo */}
            {berita.gambar && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-muted border border-border/60 shadow-xs">
                <Image
                  src={berita.gambar}
                  alt={berita.judul}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            )}

            {/* Lead Summary (if present) */}
            {berita.ringkasan && (
              <div className="bg-emerald-50/50 border-l-4 border-primary p-4 sm:p-5 rounded-r-2xl text-foreground text-xs sm:text-sm font-medium italic leading-relaxed break-words">
                &ldquo;{berita.ringkasan}&rdquo;
              </div>
            )}

            {/* Article Full Body */}
            <div className="space-y-4 sm:space-y-5 text-foreground/90 text-sm sm:text-base leading-relaxed sm:leading-loose">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="text-left font-normal break-words leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <Separator />

            {/* Footer of Article */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                Kategori: <strong className="text-foreground">{berita.kategori || "Pengumuman Resmi"}</strong>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
                <span className="text-xs font-semibold text-muted-foreground">Bagikan Warta Ini:</span>
                <ShareButtons title={berita.judul} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other Latest News Section */}
        {otherNews.length > 0 && (
          <section className="space-y-4 sm:space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                  Warta & Berita Desa Lainnya
                </h2>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary font-semibold text-xs">
                <Link href="/berita" className="inline-flex items-center gap-1">
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {otherNews.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-border/70 hover:border-primary/40 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                >
                  <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted border border-border/60 relative">
                        {item.gambar ? (
                          <Image
                            src={item.gambar}
                            alt={item.judul}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Newspaper className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          {item.kategori || "Warta Desa"}
                        </Badge>
                        <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {item.judul}
                        </h3>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-semibold text-primary">
                      <Link href={`/berita/${item.id}`} className="inline-flex items-center justify-between w-full">
                        <span>Baca Warta</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

