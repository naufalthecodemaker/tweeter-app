"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle, 
  SheetHeader 
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu, Home, User, Users, PenSquare, Rocket } from "lucide-react";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";
import { LoadingLink } from "./loading-link";
import { PageReadyWrapper } from "./page-ready-wrapper";

interface MobileMenuProps {
  user: any; // data user buat nentuin menu apa aja yg muncul
}

export function MobileMenu({ user }: MobileMenuProps) {
  // state buat buka-tutup sidebar 
  const [isOpen, setIsOpen] = useState(false);

  // style tombol pake efek glassmorphism
  const navButtonStyle = "w-full justify-center group relative overflow-hidden border border-white/30 dark:border-white/20 hover:border-white/50 transition-all duration-300 shadow-xl bg-white/10 dark:bg-white/5 backdrop-blur-[30px]";

  return (
    <PageReadyWrapper>
      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        
        {/* kontrol sheet pake state 'isOpen' biar sinkron ama klik link */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-primary/10 transition-all duration-300 z-50 focus:ring-0"
            >
              <Menu className="h-6 w-6 text-primary stroke-[3px]" />
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="right" 
            className="w-[200px] border-l border-white/30 p-0 overflow-hidden outline-none [&>button]:hidden bg-transparent"
          >
            <div className="absolute inset-0 bg-white/[0.12] dark:bg-white/[0.08] -z-20 backdrop-blur-[35px] saturate-[160%] brightness-165" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none -z-10" />

            <SheetHeader className="p-4 border-b border-white/20 relative overflow-hidden bg-transparent">
              <SheetTitle className="flex items-center gap-2 relative z-10">
                <div className="p-1.5 bg-white/20 dark:bg-white/10 rounded-lg border border-white/30">
                  <Rocket className="h-4 w-4 text-primary stroke-[3px]" />
                </div>
                <span className="text-lg font-black bg-gradient-to-r from-indigo-950 to-purple-800 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
                  Menu
                </span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col h-[calc(100vh-64px)] justify-between p-4 relative bg-transparent">
              <nav className="flex flex-col space-y-3 relative z-10">
                {[
                  { href: "/", label: "Home", icon: Home },
                  ...(user ? [
                    { href: "/create", label: "Create", icon: PenSquare },
                    { href: "/users", label: "Users", icon: Users },
                    { href: "/profile", label: "Profile", icon: User },
                  ] : [])
                ].map((item) => (
                  // onClick dipanggil buat nutup sidebar INSTAN pas link diklik
                  <LoadingLink key={item.href} href={item.href as any} onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className={navButtonStyle}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <item.icon className="h-4 w-4 mr-2 text-indigo-950 dark:text-white stroke-[3.5px] group-hover:scale-110 transition-transform" />
                      <span className="relative text-sm font-black tracking-wide text-indigo-950 dark:text-white">
                        {item.label}
                      </span>
                    </Button>
                  </LoadingLink>
                ))}
              </nav>

              <div className="pb-8 space-y-3 relative z-10">
                {user ? (
                  <div className="pt-4 border-t border-white/20">
                    <div onClick={() => setIsOpen(false)}>
                      <LogoutButton />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-4 border-t border-white/20">
                    <LoadingLink href={"/login" as any} className="w-full" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className={navButtonStyle}>
                        <span className="text-indigo-950 dark:text-white font-black tracking-wider text-sm">
                          Login
                        </span>
                      </Button>
                    </LoadingLink>
                    
                    <LoadingLink href={"/register" as any} className="w-full" onClick={() => setIsOpen(false)}>
                      <Button 
                        className="w-full shadow-2xl shadow-primary/20 text-sm font-black tracking-widest text-white border border-white/30"
                        style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)' }}
                      >
                        Register
                      </Button>
                    </LoadingLink>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </PageReadyWrapper>
  );
}