// components/Footer.tsx
'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-anime-dark border-t border-anime-sage/20 text-anime-light/80 transition-colors">
      <div className="container mx-auto px-6 pt-12 pb-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Description */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold font-heading text-anime-sage tracking-wider">
                Anime<span className="text-anime-coral">Lounge</span>
              </span>
            </Link>
            <p className="text-sm text-anime-light/60 leading-relaxed font-sans">
              A modern multi-domain recommendation platform for anime, games, and books powered by intelligent similarity vectors.
            </p>
          </div>

          {/* Discovery Links */}
          <div className="space-y-3 font-sans">
            <h3 className="text-sm font-semibold font-heading text-anime-light uppercase tracking-wider">
              Discover
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/anime" className="hover:text-anime-sage transition-colors">
                  Anime Catalog
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-anime-sage transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-anime-sage transition-colors">
                  Books
                </Link>
              </li>
            </ul>
          </div>

          {/* System & API Links */}
          <div className="space-y-3 font-sans">
            <h3 className="text-sm font-semibold font-heading text-anime-light uppercase tracking-wider">
              System
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="hover:text-anime-sage transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/algorithm" className="hover:text-anime-sage transition-colors">
                  Similarity Engine
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-anime-sage transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          {/* Connect / Newsletter */}
          <div className="space-y-3 font-sans">
            <h3 className="text-sm font-semibold font-heading text-anime-light uppercase tracking-wider">
              Stay Updated
            </h3>
            <p className="text-sm text-anime-light/60">
              Get notified when new features and datasets are indexed.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm bg-anime-dark/50 border border-anime-sage/30 rounded-md focus:outline-none focus:border-anime-sage text-anime-light placeholder-anime-light/40"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium font-semibold text-anime-dark bg-anime-sage hover:bg-anime-sage/90 rounded-md transition-colors"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-anime-sage/20 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-xs text-anime-light/50 font-sans gap-4">
          <p>&copy; {new Date().getFullYear()} AnimeLounge Platform. All rights reserved.</p>
          
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-anime-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-anime-light transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;