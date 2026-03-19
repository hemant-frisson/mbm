"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[rgba(201,168,124,0.12)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-[#c9a87c] flex items-center justify-center group-hover:border-[#e8d5b7] transition-colors duration-300">
              <span className="text-sm font-bold tracking-wider text-[#c9a87c] group-hover:text-[#e8d5b7] transition-colors duration-300">
                M
              </span>
            </div>
            <div className="absolute -inset-1 rounded-full bg-[#c9a87c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-[0.2em] text-[#f5f0eb]">
              MBM
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#a8a29e] uppercase">
              Meena Bisht
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm text-[#a8a29e] hover:text-[#f5f0eb] transition-colors duration-300 tracking-wide group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c9a87c] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <Link
            href="#contact"
            className="px-5 py-2 text-sm border border-[#c9a87c]/50 text-[#c9a87c] rounded-full hover:bg-[#c9a87c]/10 hover:border-[#c9a87c] transition-all duration-300"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span
              className={`w-full h-[1.5px] bg-[#f5f0eb] transition-all duration-300 origin-center ${
                mobileMenuOpen ? "rotate-45 translate-y-[9px]" : ""
              }`}
            />
            <span
              className={`w-full h-[1.5px] bg-[#f5f0eb] transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`w-full h-[1.5px] bg-[#f5f0eb] transition-all duration-300 origin-center ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[rgba(201,168,124,0.08)] px-6 py-6">
          <div className="flex flex-col gap-5">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#a8a29e] hover:text-[#f5f0eb] font-medium tracking-wide transition-colors duration-300"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 px-6 py-3 text-center border border-[#c9a87c]/50 text-[#c9a87c] rounded-full hover:bg-[#c9a87c]/10 transition-all duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
