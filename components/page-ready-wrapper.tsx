"use client";

import { usePageReady } from "@/lib/use-page-ready";
import { ReactNode } from "react";

// utk ngebungkus page yang banyak datanya 
// biar overlay loading global berhenti otomatis 
// pas konten kelar dirender (hrsnya wkkwk)

export function PageReadyWrapper({ children }: { children: ReactNode }) {
  // panggil custom hook buat kirim sinyal 'Stop Loading' ke provider
  usePageReady();
  
  // ngerender isi konten halamannya secara normal
  return <>{children}</>;
}