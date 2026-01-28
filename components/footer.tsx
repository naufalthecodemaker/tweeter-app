import { Rocket, Github, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/20 dark:border-white/10 overflow-hidden">
      {/* Background Glassmorphism */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20 -z-10 backdrop-blur-[30px] dark:backdrop-blur-[40px] saturate-[150%]" />
      
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          
          {/* Section 1: Branding */}
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center justify-center gap-3 group">
              <div className="p-1.5 bg-white/20 dark:bg-black/40 rounded-lg border border-white/30 transition-transform group-hover:scale-110 shadow-lg">
                <Rocket className="h-5 w-5 text-primary stroke-[2.5px]" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Tweeter
              </span>
            </div>
            <p className="text-sm font-medium text-indigo-950/70 dark:text-white/60 max-w-[600px]">
              Explore the social space and connect with creators across the galaxy.
            </p>
          </div>

          {/* Section 2: GitHub & WhatsApp (Original Logos) */}
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/naufal-rahman" 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-primary/20 hover:border-primary/50 transition-all group"
            >
              <Github className="h-5 w-5 text-indigo-950/70 dark:text-white/70 group-hover:text-primary" />
              <span className="text-xs font-bold text-indigo-950/70 dark:text-white/70 group-hover:text-primary tracking-wide">GitHub</span>
            </a>

            <a 
              href="https://wa.me/6281584855811" 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-green-500/20 hover:border-green-500/50 transition-all group"
            >
              {/* WhatsApp Original SVG Logo */}
              <svg 
                viewBox="0 0 24 24" 
                className="h-5 w-5 fill-indigo-950/70 dark:fill-white/70 group-hover:fill-green-500 transition-colors"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="text-xs font-bold text-indigo-950/70 dark:text-white/70 group-hover:text-green-500 tracking-wide">WhatsApp</span>
            </a>
          </div>

          {/* Section 3: Copyright & Developed By (Style Lama) */}
          <div className="flex flex-col items-center space-y-5">
            <div className="space-y-2 text-center">
              <p className="text-[10px] md:text-xs font-black text-indigo-950/50 dark:text-white/40 tracking-widest uppercase flex flex-wrap justify-center gap-2">
                <span>© 2026 Tweeter</span>
                <span className="hidden md:inline text-indigo-300 dark:text-indigo-800">|</span>
                <span>Built with Next.js, React, & Tailwind CSS</span>
                <span className="hidden md:inline text-indigo-300 dark:text-indigo-800">|</span>
                <span>DEVELOPED BY NAUFAL RAHMAN</span>
              </p>
              <p className="text-[9px] font-bold text-indigo-950/30 dark:text-white/35 tracking-[0.3em] uppercase flex items-center justify-center gap-2">
                <Code2 className="h-3 w-3" />
                <span>All Rights Reserved</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}