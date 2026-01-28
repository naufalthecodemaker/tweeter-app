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
  const { startLoading, stopLoading } = useLoading();

  // fungsi buat proses logout
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // cegah aksi bawaan dri browser
    
    setLoading(true); // aktifin loading di tombol
    startLoading(); 
    
    try {
      // manggil server action buat hapus session
      await logoutAction();
      
      // notif sukses
      toast.success("Logged out successfully!");
      
      // jeda dikit biar notifnyanya kebaca user
      setTimeout(() => {
        window.location.href = "/"; 
      }, 400);

    } catch (error) {
      toast.success("Logged out successfully!");

      setTimeout(() => {
        window.location.href = "/"; 
      }, 400);
    }
  };

  return (
    <div className="w-full">
      <Button 
        variant="ghost" 
        size="sm" 
        type="button" 
        onClick={handleLogout}
        disabled={loading}
        className="w-full justify-center group relative overflow-hidden border border-white/40 dark:border-indigo-500/20 hover:border-white/60 transition-all duration-300 shadow-sm bg-white/30 dark:bg-black/40 backdrop-blur-md"
      >
        {loading ? (
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
    </div>
  );
}