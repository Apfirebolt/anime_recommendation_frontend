'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import httpClient from '@/lib/api';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  BookOpenIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function MangaCatalogPage() {
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch manga list with search and pagination parameters
  const fetchManga = useCallback(async (search = '', pageNum = 1) => {
    setLoading(true);
    try {
      const response = await httpClient.get('/manga', {
        params: {
          search: search.trim() || undefined, // Trim whitespace and omit if empty
          page: pageNum,
          size: 12, // matches backend size parameter
        },
      });

      // Safely extract items array and total pages from FastAPI response structure
      const result = response.data;
      
      setMangaList(Array.isArray(result.items) ? result.items : []);
      
      if (typeof result.pages === 'number') {
        setTotalPages(result.pages);
      }
    } catch (error) {
      console.error('Failed to fetch manga catalog:', error);
      setMangaList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and search triggers with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchManga(searchQuery, page);
    }, 300); // 300ms debounce for typing search

    return () => clearTimeout(timer);
  }, [searchQuery, page, fetchManga]);

  // Handler to reset pagination back to page 1 whenever search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); 
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans selection:bg-anime-sage selection:text-anime-dark transition-colors duration-200">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-10">
        
        {/* Page Title & Search Bar Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 dark:border-anime-sage/20 pb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Manga Catalog</h1>
            <p className="text-sm text-gray-600 dark:text-anime-light/60 mt-1">
              Explore manga, manhwa, and novels indexed by our similarity engine.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-anime-light/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title, genre, author..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-anime-dark/50 border border-gray-300 dark:border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-gray-900 dark:text-anime-light placeholder-gray-400 dark:placeholder-anime-light/40 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Content Section: Grid or Loader */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader />
          </div>
        ) : mangaList.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-anime-light/30" />
            <p className="text-gray-600 dark:text-anime-light/60 text-lg">No manga found matching your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mangaList.map((manga) => (
              <div 
                key={manga.mal_id || manga.id} 
                className="bg-white dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 rounded-2xl p-5 flex flex-col justify-between hover:border-anime-sage/50 transition-all shadow-sm group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-anime-light group-hover:text-anime-sage transition-colors line-clamp-1">
                      {manga.title_english || manga.title}
                    </h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-anime-sage/10 text-anime-sage font-medium whitespace-nowrap border border-anime-sage/20">
                      {manga.type || 'Manga'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-anime-light/60 line-clamp-3 leading-relaxed">
                    {manga.synopsis || 'No synopsis available for this title.'}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {manga.genres && typeof manga.genres === 'string' && 
                      manga.genres.split('|').slice(0, 3).map((genre, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-anime-dark border border-gray-200 dark:border-anime-sage/20 text-gray-700 dark:text-anime-light/70">
                          {genre.trim()}
                        </span>
                      ))
                    }
                  </div>
                </div>

                {/* Action Trigger -> Direct Link to Detail Page */}
                <div className="pt-6 mt-4 border-t border-gray-100 dark:border-anime-sage/10 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-anime-light/50 font-mono">
                    Score: {manga.score || 'N/A'}
                  </span>
                  
                  <Link
                    href={`/manga/${manga.mal_id}`}
                    className="px-3.5 py-2 text-xs font-semibold font-heading rounded-lg bg-anime-sage/10 text-anime-sage hover:bg-anime-sage hover:text-anime-dark transition-all flex items-center gap-1.5 group/btn"
                  >
                    <EyeIcon className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    <span>View</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-white dark:bg-anime-dark/50 border border-gray-200 dark:border-anime-sage/20 text-gray-800 dark:text-anime-light disabled:opacity-30 disabled:cursor-not-allowed hover:bg-anime-sage/10 transition-colors shadow-sm"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-anime-light/80">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 rounded-xl bg-white dark:bg-anime-dark/50 border border-gray-200 dark:border-anime-sage/20 text-gray-800 dark:text-anime-light disabled:opacity-30 disabled:cursor-not-allowed hover:bg-anime-sage/10 transition-colors shadow-sm"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}