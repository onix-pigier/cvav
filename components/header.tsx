"use client";
import type React from "react";
import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

// Smooth anchor scrolling hook
function useSmoothScroll() {
  return useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, []);
}

export default function Header() {
  const scroll = useSmoothScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "#about", id: "about", label: "À propos" },
    { href: "#team", id: "team", label: "Équipe" },
    { href: "#events", id: "events", label: "Événements" },
    { href: "#contact", id: "contact", label: "Contact" },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled 
        ? 'border-slate-200 bg-white/95 backdrop-blur-lg shadow-sm' 
        : 'border-transparent bg-transparent'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Section gauche UNIQUEMENT pour le logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center cursor-pointer"
        >
          {/* Logo photo1.png - Toute la section gauche */}
          <div className="flex items-center justify-center">
            <Image
              src="/photo1.png"
              alt="CVAV Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                scroll(e, item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`relative text-sm font-medium transition-all duration-300 group ${
                isScrolled 
                  ? 'text-slate-700 hover:text-amber-600' 
                  : 'text-white hover:text-amber-300'
              }`}
            >
              {item.label}
              {/* Underline animation avec linear*/}
              <span className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-amber-500 to-blue-500 transition-all duration-300 group-hover:w-full ${
                isScrolled ? 'opacity-100' : 'opacity-90'
              }`}></span>
            </a>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Button
            asChild
            className={`bg-linear-to-r from-amber-500 to-amber-600 text-white transition-all duration-300 hover:from-amber-600 hover:to-amber-700 hover:scale-105 shadow-lg hover:shadow-amber-500/25 ${
              !isScrolled && 'bg-linear-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/30'
            }`}
          >
            <a href="#events" onClick={(e) => scroll(e, "events")}>
              Nous Rejoindre
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
            isScrolled 
              ? 'text-slate-700 hover:bg-amber-50 hover:text-amber-600' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-lg border-b shadow-xl transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 border-slate-200' 
            : 'bg-slate-900/95 border-slate-700'
        }`}>
          <div className="px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  scroll(e, item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left font-medium transition-all duration-300 py-3 px-4 rounded-lg text-sm ${
                  isScrolled
                    ? 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                    : 'text-white hover:text-amber-300 hover:bg-white/10'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-200/60">
              <Button
                asChild
                className={`w-full transition-all duration-300 ${
                  isScrolled
                    ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                    : 'bg-linear-to-r from-amber-500 to-blue-500 text-white hover:from-amber-600 hover:to-blue-600'
                }`}
              >
                <a href="#events" onClick={(e) => {
                  scroll(e, "events");
                  setIsMobileMenuOpen(false);
                }}>
                  Nous Rejoindre
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}