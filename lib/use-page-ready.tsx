"use client";

import { useEffect } from "react";
import { useLoading } from "./loading-context";

// hook buat ngasih tau sistem kalau halaman udh selesai dimuat
export function usePageReady() {
  // ambil fungsi stopLoading dari koteks global
  const { stopLoading } = useLoading();

  useEffect(() => {
    // komponen siap render)
    const timeout = setTimeout(() => {
      stopLoading(); 
    }, 150); // delay biar transisinya halus

    // bersiin memori klo user udh pindah halaman sblm 150ms
    return () => clearTimeout(timeout);
  }, [stopLoading]);
}