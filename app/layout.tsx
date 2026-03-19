import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CalcEléc - Calculadora para Ingenieros Eléctricos",
  description: "Herramienta de cálculo eléctrico basada en normas cubanas (NC 800, NC 801, NC 802, NC 803, NC 804)",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "CalcEléc - Calculadora Eléctrica",
    description: "Herramienta profesional de cálculo eléctrico para ingenieros. Basada en normas cubanas NC 800, NC 801, NC 802.",
    type: "website",
    locale: "es_ES",
    siteName: "CalcEléc",
  },
  twitter: {
    card: "summary_large_image",
    title: "CalcEléc - Calculadora Eléctrica",
    description: "Herramienta profesional de cálculo eléctrico para ingenieros. Basada en normas cubanas.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
