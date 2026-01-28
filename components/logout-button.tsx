"use client";

import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "./ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLoading } from "@/lib/loading-context";

export function LogoutButton() {
  // kelola status loading lokal biar button bisa berubah 
  const [loading, setLoading] = useState(false);
  
  // ambil fungsi buat nampilin overlay loading global
  const { startLoading } = useLoading();

  // fungsi buat proses logout
  const handleLogout = async () => {
    setLoading(true); // aktifin loading di tombol
    startLoading(); 
    
    // kasih notif sukses ke user 
    toast.success("Logged out successfully!");
    
    // panggil server action buat hapus session/cookie
    await logoutAction();
  };

  return (
    <form action={handleLogout} className="w-full">
      <Button 
        variant="ghost" 
        size="sm" 
        type="submit" 
        disabled={loading} // biar gabisa diclick pas lagi proses
        className="w-full justify-center group relative overflow-hidden border border-white/40 dark:border-indigo-500/20 hover:border-white/60 transition-all duration-300 shadow-sm bg-white/30 dark:bg-black/40 backdrop-blur-md"
      >
        {loading ? (
          // pas lg proses logut
          <div className="flex items-center text-indigo-950 dark:text-indigo-300 font-black">
            <Loader2 className="h-4 w-4 mr-2 animate-spin stroke-[3px]" />
            <span>Logging out...</span>
          </div>
        ) : (
          <div className="flex items-center text-indigo-950 dark:text-indigo-300 font-black">
            <LogOut className="h-4 w-4 mr-2 stroke-[3px] group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">Logout</span>
          </div>
        )}
      </Button>
    </form>
  );
}