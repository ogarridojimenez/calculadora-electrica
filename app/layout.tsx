import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { HistoryProvider } from "@/components/HistoryProvider";
import { HistoryPanel } from "@/components/HistoryPanel";
import { PWAUpdater } from "@/components/PWAUpdater";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CalcEléc - Calculadora para Ingenieros Eléctricos",
  description: "Herramienta de cálculo eléctrico basada en normas cubanas (NC 800, NC 801, NC 802, NC 803, NC 804)",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CalcEléc",
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

export const viewport: Viewport = {
  themeColor: "#00d4ff",
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
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <PWAUpdater />
        <ThemeProvider>
          <ToastProvider>
            <HistoryProvider>
              {children}
              <HistoryPanel />
            </HistoryProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
