'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import httpClient from '@/lib/api';
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  UserGroupIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

export default function CharactersClient() {
  const [characterList, setCharacterList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 12;

  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  // Fetch characters from the backend API
  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const response = await httpClient.get('/anime/characters', {
        params: {
          search: searchQuery.trim() || undefined,
          limit: pageSize,
          offset: offset,
        },
      });

      const result = response.data;
      setCharacterList(Array.isArray(result.characters) ? result.characters : []);
      if (typeof result.total === 'number') {
        setTotalRecords(result.total);
      }
    } catch (error) {
      console.error('Failed to fetch characters catalog:', error);
      setCharacterList([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page]);

  // Debounced trigger when search query or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCharacters();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchCharacters]);

  // Reset page to 1 whenever search query changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans selection:bg-anime-sage selection:text-anime-dark transition-colors duration-200">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-10">
        
        {/* Page Title & Search Bar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 dark:border-anime-sage/20 pb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Anime Characters</h1>
            <p className="text-sm text-gray-600 dark:text-anime-light/60 mt-1">
              Explore thousands of characters indexed with fuzzy search across names, aliases, and biographies.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-anime-light/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search characters by name, bio..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-anime-dark/50 border border-gray-300 dark:border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-gray-900 dark:text-anime-light placeholder-gray-400 dark:placeholder-anime-light/40 shadow-sm transition-colors"
            />
          </div>
        </div>

        {/* Content Section: Grid or Loader */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader />
          </div>
        ) : characterList.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-anime-light/30" />
            <p className="text-gray-600 dark:text-anime-light/60 text-lg">No characters found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {characterList.map((character) => (
              <div 
                key={character.character_id} 
                className="bg-white dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 rounded-2xl p-5 flex flex-col justify-between hover:border-anime-sage/60 hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-anime-light group-hover:text-anime-sage transition-colors truncate">
                        {character.name}
                      </h3>
                      {character.full_name && character.full_name !== character.name && (
                        <p className="text-xs text-gray-500 dark:text-anime-light/50 italic truncate">
                          {character.full_name}
                        </p>
                      )}
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-anime-sage/10 text-anime-sage font-medium whitespace-nowrap border border-anime-sage/20 font-mono shrink-0">
                      #{character.character_id}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-anime-light/60 line-clamp-3 leading-relaxed">
                    {character.description || 'No biography written.'}
                  </p>

                  {character.alternate_name && (
                    <div className="text-[11px] text-gray-500 dark:text-anime-light/50 truncate bg-gray-50 dark:bg-anime-dark/60 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-anime-sage/10">
                      <span className="font-semibold text-gray-600 dark:text-anime-light/70">Aliases:</span> {character.alternate_name}
                    </div>
                  )}
                </div>

                {/* Footer action buttons */}
                <div className="pt-5 mt-5 border-t border-gray-100 dark:border-anime-sage/10 flex items-center justify-between gap-2">
                  {/* View Details Button */}
                  <Link
                    href={`/characters/${character.character_id}`}
                    className="px-3.5 py-2 text-xs font-semibold font-heading rounded-lg bg-anime-sage/10 text-anime-sage hover:bg-anime-sage hover:text-anime-dark transition-all flex items-center gap-1.5 group/btn shadow-sm"
                  >
                    <EyeIcon className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
                    <span>View Details</span>
                  </Link>

                  {/* External MAL Link */}
                  {character.url ? (
                    <a
                      href={character.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-100 dark:bg-anime-dark text-gray-600 dark:text-anime-light/70 hover:text-anime-sage dark:hover:text-anime-sage hover:bg-anime-sage/10 transition-all border border-gray-200 dark:border-anime-sage/20"
                      title="View on MyAnimeList"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">No Link</span>
                  )}
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