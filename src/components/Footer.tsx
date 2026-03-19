import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#080808] border-t border-[rgba(201,168,124,0.08)] overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a87c]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full border-2 border-[#c9a87c]/60 flex items-center justify-center">
                <span className="text-xs font-bold tracking-wider text-[#c9a87c]">
                  M
                </span>
              </div>
              <div>
                <div className="text-base font-semibold tracking-[0.15em] text-[#f5f0eb]">
                  MBM
                </div>
                <div className="text-[9px] tracking-[0.2em] text-[#6b6560] uppercase">
                  Meena Bisht Makeup
                </div>
              </div>
            </div>
            <p className="text-sm text-[#6b6560] leading-relaxed max-w-xs">
              Premium makeup artistry for brides, parties, and every celebration.
              Crafting timeless beauty across India.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-[#c9a87c] uppercase font-medium mb-5">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: "/", label: "Home" },
                { href: "#services", label: "Services" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#6b6560] hover:text-[#a8a29e] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social / Contact */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-[#c9a87c] uppercase font-medium mb-5">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:meena@mbmmakeup.com"
                className="text-sm text-[#6b6560] hover:text-[#a8a29e] transition-colors duration-300"
              >
                meena@mbmmakeup.com
              </a>
              <a
                href="tel:+919876543210"
                className="text-sm text-[#6b6560] hover:text-[#a8a29e] transition-colors duration-300"
              >
                +91 98765 43210
              </a>
            </div>

            {/* Social icons */}
            <div className="flex gap-4 mt-6">
              {[
                {
                  label: "Instagram",
                  href: "#",
                  path: "M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z",
                },
                {
                  label: "Facebook",
                  href: "#",
                  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                },
                {
                  label: "YouTube",
                  href: "#",
                  path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#6b6560] hover:text-[#c9a87c] hover:border-[#c9a87c]/30 transition-all duration-300"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-[rgba(255,255,255,0.04)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6b6560]/60">
              © {currentYear} MBM — Meena Bisht Makeup. All rights reserved.
            </p>
            <p className="text-xs text-[#6b6560]/40">
              Crafted with ♥ for beauty
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
