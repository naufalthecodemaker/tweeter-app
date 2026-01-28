"use client";

import { useTheme } from "@/lib/theme-provider";
import { useEffect, useState } from "react";

export function BackgroundEffects() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <>
      {isDark ? <DarkModeEffects isMobile={isMobile} /> : <LightModeEffects isMobile={isMobile} />}
    </>
  );
}

function DarkModeEffects({ isMobile }: { isMobile: boolean }) {
  const starCount = isMobile ? 30 : 100;
  const shootingStarCount = isMobile ? 2 : 5;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="stars-container">
        {[...Array(starCount)].map((_, i) => (
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

      <div className="shooting-stars-container">
        {[...Array(shootingStarCount)].map((_, i) => (
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

      <div className="galaxy-gradient" />
    </div>
  );
}

function LightModeEffects({ isMobile }: { isMobile: boolean }) {
  const sparkleCount = isMobile ? 5 : 15;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50" />
      
      <div className="sun" />
      <div className="sun-rays" />
      
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />
      
      <div className="sparkles-container">
        {[...Array(sparkleCount)].map((_, i) => (
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