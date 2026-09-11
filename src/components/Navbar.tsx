"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Newspaper,
  User,
  Home,
  ShoppingBag,
  PieChart,
  Award,
  FileText,
  LogIn,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    queueMicrotask(() => setIsOpen(false));
  }, [pathname]);

  // Hide public navbar inside admin panel
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isTransparent = isHomePage && !isScrolled && !isOpen;

  const headerClass = isHomePage
    ? `fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isTransparent
          ? "bg-transparent text-white border-b border-transparent shadow-none"
          : "bg-[#063321]/95 text-white backdrop-blur-md shadow-sm border-b border-emerald-900/40"
      }`
    : "sticky top-0 z-50 bg-[#063321] text-white shadow-xs border-b border-emerald-900/40";

  const navLinks = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Profil Desa", href: "/profil", icon: User },
    { name: "Infografis", href: "/infografis", icon: PieChart },
    { name: "Status IDM", href: "/infografis/idm", icon: Award },
    { name: "Kabar Berita", href: "/berita", icon: Newspaper },
    { name: "Potensi & Belanja", href: "/potensi", icon: ShoppingBag },
    { name: "Layanan Surat", href: "/layanan-surat", icon: FileText, isHighlighted: true },
  ];

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Brand Info */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-8 h-10 sm:w-9 sm:h-11 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/logo-magetan.png"
                alt="Logo Kabupaten Magetan"
                width={36}
                height={44}
                className="w-full h-full object-contain drop-shadow"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors leading-tight">
                Desa Bogem
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-200/80 font-medium">
                Kec. Kawedanan, Kab. Magetan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-xs"
                      : link.isHighlighted
                      ? "bg-emerald-700/60 text-emerald-100 hover:bg-emerald-700 hover:text-white border border-emerald-500/30"
                      : "text-emerald-100/90 hover:bg-emerald-800/40 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* User Profile Pill on Desktop */}
            <div className="pl-3 border-l border-emerald-800/60 ml-2 flex items-center space-x-2">
              {user ? (
                <>
                  {!user.isProfileComplete && (
                    <Link href="/lengkapi-profil">
                      <Badge
                        variant="outline"
                        className="bg-amber-500/20 text-amber-200 border-amber-400/40 hover:bg-amber-500/30 font-semibold text-[11px] gap-1 cursor-pointer"
                      >
                        <AlertCircle className="w-3 h-3 text-amber-300" />
                        <span>Lengkapi NIK</span>
                      </Badge>
                    </Link>
                  )}
                  <div className="flex items-center space-x-2 bg-emerald-950/70 px-2.5 py-1.5 rounded-xl border border-emerald-800/70 text-xs">
                    <Avatar className="size-6 bg-emerald-600 text-white text-[10px] font-bold">
                      <AvatarFallback className="bg-emerald-600 text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-white max-w-[100px] truncate leading-tight text-[11px]">
                        {user.name}
                      </span>
                      <span className="text-[9px] text-emerald-300/90 capitalize">{user.role}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => logout()}
                      className="text-emerald-300 hover:text-rose-300 hover:bg-rose-950/40 ml-0.5"
                      title="Keluar"
                    >
                      <LogOut className="size-3.5" />
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  <Link href="/login">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk</span>
                  </Link>
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile & Tablet Hamburger Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && (
              <Badge
                variant="outline"
                className="bg-emerald-950/60 text-emerald-200 border-emerald-800/60 text-[10px] font-semibold max-w-[80px] truncate"
              >
                {user.name}
              </Badge>
            )}
            {/* Minimalist 2-line Animated Toggle Button (Stays 100% static in place) */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-10 h-10 shrink-0 select-none rounded-xl flex items-center justify-center text-white hover:bg-emerald-800/40 focus:outline-none"
              aria-label="Toggle Navigation"
              aria-expanded={isOpen}
            >
              <div className="relative w-5 h-5 flex items-center justify-center pointer-events-none">
                {/* Line 1 (Top / Cross 1) */}
                <span
                  className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out origin-center ${
                    isOpen ? "translate-y-0 rotate-45" : "-translate-y-1"
                  }`}
                />
                {/* Line 2 (Bottom / Cross 2) */}
                <span
                  className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out origin-center ${
                    isOpen ? "translate-y-0 -rotate-45" : "translate-y-1"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay & Drawer Menu */}
      {isOpen && (
        <>
          {/* Backdrop overlay to keep focus and allow click outside to close */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 top-16 sm:top-20 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
            aria-hidden="true"
          />

          <div className="relative z-50 lg:hidden bg-[#063321] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 fade-in duration-200 border-b border-emerald-900/60 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto">
            {user ? (
              <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800/60 mb-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 text-xs">
                    <Avatar className="size-8 bg-emerald-700 text-white font-bold">
                      <AvatarFallback className="bg-emerald-700 text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-bold text-white block text-xs">{user.name}</span>
                      <span className="text-[10px] text-emerald-300/80 font-mono">
                        {user.nik ? `NIK: ${user.nik}` : user.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="font-bold text-xs gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Keluar</span>
                  </Button>
                </div>

                {!user.isProfileComplete && (
                  <Link
                    href="/lengkapi-profil"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold py-1.5 px-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Profil Belum Lengkap — Isi NIK</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl active:scale-95 shadow-xs"
                >
                  <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-white hover:bg-emerald-50 text-[#063321] font-bold rounded-xl shadow-xs border border-white active:scale-95 transition-all"
                >
                  <Link href="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-1.5 text-[#063321]">
                    <User className="w-3.5 h-3.5 text-[#063321]" />
                    <span className="font-bold text-[#063321]">Daftar</span>
                  </Link>
                </Button>
              </div>
            )}

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-emerald-800 text-white"
                      : link.isHighlighted
                      ? "bg-emerald-700/60 text-white hover:bg-emerald-700"
                      : "text-emerald-100/90 hover:text-white hover:bg-emerald-800/40"
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-300" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </header>
  );
}