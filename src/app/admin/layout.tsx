import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | MBM",
  description: "Admin portal for MBM — Meena Bisht Makeup",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {children}
    </div>
  );
}
