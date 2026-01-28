"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/lib/loading-context";
import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  // ambil state loading, fungsi stop, ama durasi dari context global
  const { isLoading, stopLoading, loadingDuration } = useLoading();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // useEffect buat mantau perubahan URL atau status loading
  useEffect(() => {
    if (isLoading) {
      // pake requestAnimationFrame biar animasi stop loading-nya sinkron ama refresh rate layar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            stopLoading(); // matiin loading sesuai durasi
          }, loadingDuration); 
        });
      });
    }
    // gerak tiap kli pindah pathname ato ganti filter (searchParams)
  }, [pathname, searchParams, isLoading, stopLoading, loadingDuration]);

  if (!isLoading) return null;

  return (
    // overlay gelap transparan
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="flex flex-col items-center gap-4 p-8 bg-card/90 backdrop-blur-sm rounded-2xl border-2 shadow-2xl">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" strokeWidth={2.5} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Loading...
          </p>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}