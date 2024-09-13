import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "COIN | Panel de control",
  description: "",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children
}
