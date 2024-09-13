import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "COIN | Usuarios",
  description: "",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children
}
