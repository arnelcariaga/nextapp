import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "COIN | Roles",
  description: "",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children
}
