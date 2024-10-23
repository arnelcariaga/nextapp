import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "COIN | Pacientes",
  description: "",
};

export default function PatientsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children
}
