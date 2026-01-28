"use client";

import { useLoading } from "@/lib/loading-context";
import { useRouter } from "next/navigation";
import { ReactNode, MouseEvent } from "react";

interface LoadingLinkProps {
  href: string; // alamat tujuan navigasi
  children: ReactNode; // isi komponen 
  className?: string; // style tambahan dari luar
  prefetch?: boolean; // optimasi buat load page di background
  loadingDuration?: number; // durasi loading custom tiap link (default 800ms)
  onClick?: () => void; // fungsi tambahan pas diklik (misal: tutup sidebar)
}

export function LoadingLink({ 
  href, 
  children, 
  className, 
  loadingDuration = 800,
  onClick 
}: LoadingLinkProps) {
  // ambil fungsi buat nyalain loading dari context global
  const { startLoading } = useLoading();
  const router = useRouter();

  // kelola klik user secara manual
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // berhentiin navigasi bawaan browser biar gak refresh
    e.preventDefault();
    
    // jalanin fungsi tambahan klo ada 
    if (onClick) onClick();
    
    // nyalain overlay loading instant dengan durasi pilihan
    startLoading(loadingDuration);
    
    // pindah halaman pake router 
    router.push(href as any);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}