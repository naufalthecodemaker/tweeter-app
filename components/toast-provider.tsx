"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/lib/theme-provider";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster 
      theme={theme as "light" | "dark" | "system"}
      position="top-center"
      expand={false}
      richColors
      closeButton
    />
  );
}