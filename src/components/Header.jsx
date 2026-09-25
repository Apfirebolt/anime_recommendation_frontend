// components/Header.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  FilmIcon, 
  BookOpenIcon, 
  Bars3Icon, 
  XMarkIcon 
} from "@heroicons/react/24/outline";

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-anime-dark/90 backdrop-blur-md border-b border-anime-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold font-heading text-anime-sage tracking-wider">
            Anime<span className="text-anime-coral">Lounge</span> 
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-3 font-sans">
            <li>
              <Link 
                href="/" 
                className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
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
                className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                  pathname.startsWith('/anime') 
                    ? 'bg-anime-sage text-anime-dark' 
                    : 'text-anime-light/80 hover:text-anime-sage hover:bg-anime-sage/10'
                }`}
              >
                <FilmIcon className="h-4 w-4" />
                <span>Anime List</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/manga" 
                className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                  pathname.startsWith('/manga') 
                    ? 'bg-anime-sage text-anime-dark' 
                    : 'text-anime-light/80 hover:text-anime-sage hover:bg-anime-sage/10'
                }`}
              >
                <BookOpenIcon className="h-4 w-4" />
                <span>Manga List</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-anime-light hover:bg-anime-sage/10 focus:outline-none transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-anime-sage" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-anime-dark border-b border-anime-sage/20 px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
              pathname === '/' 
                ? 'bg-anime-sage text-anime-dark' 
                : 'text-anime-light/80 hover:bg-anime-sage/10 hover:text-anime-sage'
            }`}
          >
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          
          <Link
            href="/anime"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
              pathname.startsWith('/anime') 
                ? 'bg-anime-sage text-anime-dark' 
                : 'text-anime-light/80 hover:bg-anime-sage/10 hover:text-anime-sage'
            }`}
          >
            <FilmIcon className="h-5 w-5" />
            <span>Anime List</span>
          </Link>

          <Link
            href="/manga"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
              pathname.startsWith('/manga') 
                ? 'bg-anime-sage text-anime-dark' 
                : 'text-anime-light/80 hover:bg-anime-sage/10 hover:text-anime-sage'
            }`}
          >
            <BookOpenIcon className="h-5 w-5" />
            <span>Manga List</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;