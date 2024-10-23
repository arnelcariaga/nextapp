import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react";
import CustomReduxProvider from "./CustomReduxProvider";

import "./styles/globals.css";
import "react-day-picker/style.css";

export const metadata: Metadata = {
  title: "COIN | Centro de Orientación e Investigación Integral",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CustomReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider>
              {children}
            </SessionProvider>
            <Toaster />
          </ThemeProvider>
        </CustomReduxProvider>
      </body>
    </html>
  );
}
