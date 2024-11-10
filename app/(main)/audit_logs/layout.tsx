import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "COIN | Registros de auditoría",
  description: "",
};

export default function AuditLogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children
}
