"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Fix: Menambahkan kurung siku <...> yang hilang pada forwardRef
export const AlertDialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ className, open, onOpenChange, children, ...props }, ref) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop dengan Blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => onOpenChange?.(false)}
      />
      
      {/* Dialog Body dengan sentuhan Glassmorphism */}
      <div
        ref={ref}
        className={cn(
          "relative z-50 w-full max-w-md bg-card/90 dark:bg-indigo-950/90 backdrop-blur-xl border border-white/20 dark:border-indigo-800/50 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Dekorasi Ungu Tua di pojok atas (opsional agar senada) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        {children}
      </div>
    </div>
  );
});
AlertDialog.displayName = "AlertDialog";

export const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 pb-2 text-center sm:text-left", className)}
    {...props}
  />
));
AlertDialogHeader.displayName = "AlertDialogHeader";

export const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-xl font-black tracking-tight bg-gradient-to-r from-indigo-950 to-purple-900 dark:from-indigo-300 dark:to-purple-200 bg-clip-text text-transparent", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

export const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-muted-foreground dark:text-indigo-200/70", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

export const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row justify-end gap-3 p-6 pt-4 bg-muted/30 dark:bg-indigo-900/10", className)}
    {...props}
  />
));
AlertDialogFooter.displayName = "AlertDialogFooter";
