"use client";

import { useTheme } from "@/lib/theme-provider";
import { useEffect, useState } from "react";

export function BackgroundEffects() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // pastiin komponen ini cuma jalan di browser 
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // logic buat nentuin pake light/dark mode
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <>
      {/* ganti suasana background tergantung tema yg dipilih user */}
      {isDark ? <DarkModeEffects /> : <LightModeEffects />}
    </>
  );
}

function DarkModeEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* background bintang */}
      <div className="stars-container">
        {[...Array(100)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* bintang jatuh*/}
      <div className="shooting-stars-container">
        {[...Array(5)].map((_, i) => (
          <div
            key={`shooting-star-${i}`}
            className="shooting-star"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.6}s`, 
            }}
          />
        ))}
      </div>

      {/* planet*/}
      <div className="planet planet-1">
        <div className="absolute rounded-full bg-purple-900/40" style={{ width: '15px', height: '15px', top: '20%', left: '25%' }} />
        <div className="absolute rounded-full bg-purple-900/40" style={{ width: '10px', height: '10px', top: '60%', left: '50%' }} />
        <div className="absolute rounded-full bg-purple-900/40" style={{ width: '12px', height: '12px', top: '40%', right: '20%' }} />
      </div>

      <div className="planet planet-2">
        <div className="absolute rounded-full bg-pink-900/40" style={{ width: '12px', height: '12px', top: '15%', left: '30%' }} />
        <div className="absolute rounded-full bg-pink-900/40" style={{ width: '8px', height: '8px', top: '55%', left: '45%' }} />
        <div className="absolute rounded-full bg-pink-900/40" style={{ width: '10px', height: '10px', bottom: '25%', right: '25%' }} />
      </div>

      <div className="planet planet-3">
        <div className="absolute rounded-full bg-cyan-900/40" style={{ width: '10px', height: '10px', top: '25%', left: '35%' }} />
        <div className="absolute rounded-full bg-cyan-900/40" style={{ width: '8px', height: '8px', top: '50%', right: '30%' }} />
      </div>

      {/* gradasi overlay*/}
      <div className="galaxy-gradient" />
    </div>
  );
}

function LightModeEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* background langit cerah */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50" />
      
      {/* matahari */}
      <div className="sun" />
      <div className="sun-rays" />
      
      {/* awan*/}
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />
      
      {/* sparkles */}
      <div className="sparkles-container">
        {[...Array(15)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}