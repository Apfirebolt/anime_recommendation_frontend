'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import httpClient from '@/lib/api';
import Link from 'next/link';
import { 
  FilmIcon, 
  BookOpenIcon, 
  CalendarDaysIcon, 
  TrophyIcon,
  EyeIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function TopByYearClient() {
  const [contentType, setContentType] = useState('anime'); // 'anime' or 'manga'
  
  // Generate dynamic year options ranging from 1970 up to the current year (2026)
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => currentYear - i);
  
  const [selectedYear, setSelectedYear] = useState(2024);
  const [sortBy, setSortBy] = useState('highest_voted');
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch top titles for the selected year and criteria
  const fetchTopByYear = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = contentType === 'anime' ? '/anime' : '/manga';
      
      // Construct date boundaries for the selected year (YYYY-01-01 to YYYY-12-31)
      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;

      const params = {
        size: 20,
        sort_by: sortBy,
      };

      if (contentType === 'anime') {
        params.aired_after = startDate;
        params.aired_before = endDate;
      } else {
        params.published_after = startDate;
        params.published_before = endDate;
      }

      const response = await httpClient.get(endpoint, { params });
      const result = response.data;
      setItemsList(Array.isArray(result.items) ? result.items : (Array.isArray(result) ? result : []));
    } catch (error) {
      console.error('Failed to fetch top list by year:', error);
      setItemsList([]);
    } finally {
      setLoading(false);
    }
  }, [contentType, selectedYear, sortBy]);

  useEffect(() => {
    fetchTopByYear();
  }, [fetchTopByYear]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans selection:bg-anime-sage selection:text-anime-dark transition-colors duration-200">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-10">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-anime-sage/10 border border-anime-sage/20 text-anime-sage text-sm font-medium">
            <TrophyIcon className="h-4 w-4" />
            <span>Annual Leaderboards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight">
            Top <span className="text-anime-sage">Rankings</span> by Year
          </h1>
          <p className="text-sm text-gray-600 dark:text-anime-light/60">
            Explore the highest-rated and most popular anime and manga released during any specific calendar year.
          </p>
        </div>

        {/* Controls Toolbar (Domain, Year, Sort) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/25 shadow-sm">
          
          {/* Domain Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-anime-light/60 uppercase tracking-wider">Choose Anime/Manga</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setContentType('anime')}
                className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  contentType === 'anime' 
                    ? 'bg-anime-sage text-anime-dark shadow-md' 
                    : 'bg-white dark:bg-anime-dark border border-gray-300 dark:border-anime-sage/30 text-gray-700 dark:text-anime-light hover:border-anime-sage'
                }`}
              >
                <FilmIcon className="h-4 w-4" />
                <span>Anime</span>
              </button>
              <button
                onClick={() => setContentType('manga')}
                className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  contentType === 'manga' 
                    ? 'bg-anime-sage text-anime-dark shadow-md' 
                    : 'bg-white dark:bg-anime-dark border border-gray-300 dark:border-anime-sage/30 text-gray-700 dark:text-anime-light hover:border-anime-sage'
                }`}
              >
                <BookOpenIcon className="h-4 w-4" />
                <span>Manga</span>
              </button>
            </div>
          </div>

          {/* Year Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-anime-light/60 uppercase tracking-wider">Select Year</label>
            <div className="relative">
              <CalendarDaysIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-anime-sage pointer-events-none" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-anime-dark border border-gray-300 dark:border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-gray-900 dark:text-anime-light"
              >
                {yearsList.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort By Criteria */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-anime-light/60 uppercase tracking-wider">Sort Metric</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white dark:bg-anime-dark border border-gray-300 dark:border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-gray-900 dark:text-anime-light"
            >
              <option value="highest_voted">Highest Voted / Score</option>
              <option value="popularity">Most Popular</option>
              <option value="favorites">Most Favorites</option>
              <option value="rank">MAL Standing Rank</option>
              {contentType === 'anime' ? (
                <option value="most_episodes">Most Episodes</option>
              ) : (
                <>
                  <option value="most_chapters">Most Chapters</option>
                  <option value="most_volumes">Most Volumes</option>
                </>
              )}
            </select>
          </div>

        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader />
          </div>
        ) : itemsList.length === 0 ? (
          <div className="text-center py-24 space-y-4 rounded-2xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20">
            <SparklesIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-anime-light/30" />
            <h3 className="font-heading font-bold text-lg">No records found for {selectedYear}</h3>
            <p className="text-xs text-gray-500 dark:text-anime-light/60">Try selecting a different year or sorting criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsList.map((item, index) => (
              <div 
                key={item.mal_id} 
                className="bg-white dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/25 rounded-2xl p-4 flex gap-4 hover:border-anime-sage transition-all shadow-sm group relative overflow-hidden"
              >
                {/* Poster Image Container */}
                <div className="relative shrink-0 w-24 sm:w-28 h-36 sm:h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-anime-dark/80 border border-gray-200 dark:border-anime-sage/20 shadow-inner">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.title_english || item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FilmIcon className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                  {/* Leaderboard Position Badge */}
                  <div className="absolute top-0 left-0 bg-anime-sage text-anime-dark font-mono font-bold text-[11px] px-2 py-0.5 rounded-br-lg shadow">
                    #{index + 1}
                  </div>
                </div>

                {/* Details Container */}
                <div className="flex flex-col justify-between flex-grow min-w-0">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-anime-light group-hover:text-anime-sage transition-colors line-clamp-2">
                        {item.title_english || item.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-anime-light/60">
                      <span className="flex items-center gap-1 text-anime-coral font-semibold">
                        <StarIcon className="h-3.5 w-3.5 fill-anime-coral" />
                        {item.score || 'N/A'}
                      </span>
                      <span>•</span>
                      <span className="uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-anime-dark text-[10px] border border-gray-200 dark:border-anime-sage/20">
                        {item.type || (contentType === 'anime' ? 'TV' : 'Manga')}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-600 dark:text-anime-light/60 line-clamp-2 leading-relaxed">
                      {item.synopsis || 'No synopsis available.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-anime-sage/10 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                      {item.genres && typeof item.genres === 'string' && 
                        item.genres.split('|').slice(0, 1).map((genre, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-anime-sage/10 text-anime-sage truncate max-w-full">
                            {genre.trim()}
                          </span>
                        ))
                      }
                    </div>
                    
                    <Link
                      href={`/${contentType}/${item.mal_id}`}
                      className="px-3 py-1.5 text-[11px] font-semibold font-heading rounded-lg bg-anime-sage/10 text-anime-sage hover:bg-anime-sage hover:text-anime-dark transition-all flex items-center gap-1 group/btn shrink-0"
                    >
                      <EyeIcon className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      <span>View</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}