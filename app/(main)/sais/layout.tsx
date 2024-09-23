import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "COIN | SAIs",
  description: "",
};

export default function SaisLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children
}
