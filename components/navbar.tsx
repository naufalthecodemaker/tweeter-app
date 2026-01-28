import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "./theme-toggle";
import { LoadingLink } from "./loading-link"; // Sistem Loading Instant
import { Home, User, Users, PenSquare, Rocket } from "lucide-react";
import { Button } from "./ui/button";
import { MobileMenu } from "./mobile-menu";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <LoadingLink href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all duration-300">
              <Rocket className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Tweeter
            </div>
          </LoadingLink>

          {/* Desktop Navigation*/}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <LoadingLink href="/" loadingDuration={1000}>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    <Home className="h-4 w-4 mr-2 text-primary" />
                    Home
                  </Button>
                </LoadingLink>

                <LoadingLink href="/create" loadingDuration={1000}>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    <PenSquare className="h-4 w-4 mr-2 text-primary" />
                    Create
                  </Button>
                </LoadingLink>

                <LoadingLink href="/users" loadingDuration={1000}>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    Users
                  </Button>
                </LoadingLink>

                <LoadingLink href="/profile" loadingDuration={1000}>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    Profile
                  </Button>
                </LoadingLink>

                <div className="h-6 w-px bg-white/10 mx-1" />
                <ThemeToggle />
                <LogoutButton />
              </>
            ) : (
              <>
                <ThemeToggle />
                <LoadingLink href="/login" loadingDuration={1000}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:text-primary hover:font-bold transition-all duration-300"
                  >
                    Login
                  </Button>
                </LoadingLink>

                <LoadingLink href="/register" loadingDuration={1000}>
                  <Button 
                    size="sm" 
                    className="hover:text-primary hover:border-primary hover:font-bold transition-all duration-300"
                  >
                    Register
                  </Button>
                </LoadingLink>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileMenu user={user} />
        </div>
      </div>
    </nav>
  );
}