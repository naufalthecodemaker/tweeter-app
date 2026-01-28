"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 transition-all duration-500 shadow-2xl",
        "border border-white/40 dark:border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-xl",
        "hover:scale-110 hover:border-primary/50 group active:scale-95",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      <ChevronUp className="h-6 w-6 text-indigo-950 dark:text-white stroke-[3px] group-hover:-translate-y-1 transition-transform" />
      
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-md -z-10 group-hover:bg-primary/20 transition-colors" />
    </Button>
  );
}