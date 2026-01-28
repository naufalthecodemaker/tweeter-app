import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// buat gabungin class tailwind secara dinamis 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
