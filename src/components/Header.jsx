// components/Header.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, FilmIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-anime-dark/90 backdrop-blur-md border-b border-anime-sage/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-heading text-anime-sage tracking-wider">
            Anime<span className="text-anime-coral">Lounge</span> 
          </span>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="flex items-center gap-4 font-sans">
            <li>
              <Link 
                href="/" 
                className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-2 transition-colors ${
                  pathname === '/' 
                    ? 'bg-anime-sage text-anime-dark' 
                    : 'text-anime-light/80 hover:text-anime-sage hover:bg-anime-sage/10'
                }`}
              >
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/anime" 
                className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-2 transition-colors ${
                  pathname.startsWith('/anime') 
                    ? 'bg-anime-sage text-anime-dark' 
                    : 'text-anime-light/80 hover:text-anime-sage hover:bg-anime-sage/10'
                }`}
              >
                <FilmIcon className="h-4 w-4" />
                <span>Anime Catalog</span>
              </Link>
            </li>
          </ul>
        </nav>
        
      </div>
    </header>
  );
};

export default Header;