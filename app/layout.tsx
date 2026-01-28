import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/lib/theme-provider";
import { BackgroundEffects } from "@/components/background-effects";
import { ToastProvider } from "@/components/toast-provider";
import { LoadingOverlay } from "@/components/loading-overlay";
import { LoadingProvider } from "@/lib/loading-context"; 
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tweeter - Your Social Space",
  description: "A modern Twitter-like social media platform built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="socialhub-theme">
          <LoadingProvider>
            <ToastProvider />

            {/* suspense utk handle useSearchParams di dalam LoadingOverlay */}
            <Suspense fallback={null}>
              <LoadingOverlay />
            </Suspense>

            <BackgroundEffects />
            <Navbar />

            <main className="min-h-screen relative flex flex-col">
              <div className="flex-grow">
                {children}
              </div>
            </main>

            <ScrollToTop />
            <Footer />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}