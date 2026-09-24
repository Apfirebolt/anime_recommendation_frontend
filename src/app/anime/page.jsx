// app/anime/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import httpClient from '@/lib/api';
import { 
  MagnifyingGlassIcon, 
  SparklesIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  XMarkIcon,
  FilmIcon
} from '@heroicons/react/24/outline';

export default function AnimeCatalogPage() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State for "Show similar entities"
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch anime list with search and pagination parameters
  const fetchAnime = useCallback(async (search = '', pageNum = 1) => {
    setLoading(true);
    try {
      const response = await httpClient.get('/anime', {
        params: {
          search: search || undefined,
          page: pageNum,
          size: 12, // matches your backend size parameter
        },
      });

      // Safely extract the items array and total pages from your FastAPI response structure
      const result = response.data;
      
      setAnimeList(Array.isArray(result.items) ? result.items : []);
      
      if (typeof result.pages === 'number') {
        setTotalPages(result.pages);
      }
    } catch (error) {
      console.error('Failed to fetch anime catalog:', error);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and search triggers
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnime(searchQuery, page);
    }, 300); // 300ms debounce for typing search

    return () => clearTimeout(timer);
  }, [searchQuery, page, fetchAnime]);

  // Fetch top 10 similar entities when modal opens
  const handleOpenSimilarModal = async (anime) => {
    setSelectedAnime(anime);
    setModalLoading(true);
    try {
      // Calls your precomputed relational table endpoint (e.g., /anime/{id}/similar)
      const response = await httpClient.get(`/anime/${anime.mal_id}/similar`);
      setSimilarItems(response.data);
    } catch (error) {
      console.error('Failed to fetch similar entities:', error);
      setSimilarItems([]); // Fallback empty array
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedAnime(null);
    setSimilarItems([]);
  };

  return (
    <div className="min-h-screen bg-anime-dark text-anime-light flex flex-col font-sans selection:bg-anime-sage selection:text-anime-dark">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-10">
        
        {/* Page Title & Search Bar Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-anime-sage/20 pb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading text-anime-light">Anime Catalog</h1>
            <p className="text-sm text-anime-light/60 mt-1">
              Explore 50k+ titles indexed by our content-based similarity engine.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-anime-light/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Reset to page 1 on new search
              }}
              placeholder="Search by title, genre, studio..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-anime-dark/50 border border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-anime-light placeholder-anime-light/40 transition-colors"
            />
          </div>
        </div>

        {/* Content Section: Grid or Loader */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-12 h-12 border-4 border-anime-sage/20 border-t-anime-sage rounded-full animate-spin"></div>
          </div>
        ) : animeList.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <FilmIcon className="mx-auto h-12 w-12 text-anime-light/30" />
            <p className="text-anime-light/60 text-lg">No anime found matching your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {animeList.map((anime) => (
              <div 
                key={anime.mal_id || anime.id} 
                className="bg-anime-dark/40 border border-anime-sage/20 rounded-2xl p-5 flex flex-col justify-between hover:border-anime-sage/50 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-lg text-anime-light group-hover:text-anime-sage transition-colors line-clamp-1">
                      {anime.title_english || anime.title}
                    </h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-anime-sage/10 text-anime-sage font-medium whitespace-nowrap border border-anime-sage/20">
                      {anime.type || 'TV'}
                    </span>
                  </div>

                  <p className="text-xs text-anime-light/60 line-clamp-3 leading-relaxed">
                    {anime.synopsis || 'No synopsis available for this title.'}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {anime.genres && typeof anime.genres === 'string' && 
                      anime.genres.split(',').slice(0, 3).map((genre, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-anime-dark border border-anime-sage/20 text-anime-light/70">
                          {genre.trim()}
                        </span>
                      ))
                    }
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="pt-6 mt-4 border-t border-anime-sage/10 flex items-center justify-between">
                  <span className="text-xs text-anime-light/50 font-mono">
                    Score: {anime.score || 'N/A'}
                  </span>
                  
                  <button
                    onClick={() => handleOpenSimilarModal(anime)}
                    className="px-3.5 py-2 text-xs font-semibold font-heading rounded-lg bg-anime-sage/10 text-anime-sage hover:bg-anime-sage hover:text-anime-dark transition-all flex items-center gap-1.5"
                  >
                    <SparklesIcon className="h-4 w-4" />
                    <span>Show Similar</span>
                  </button>
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
              className="p-2 rounded-xl bg-anime-dark/50 border border-anime-sage/20 text-anime-light disabled:opacity-30 disabled:cursor-not-allowed hover:bg-anime-sage/10 transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-anime-light/80">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 rounded-xl bg-anime-dark/50 border border-anime-sage/20 text-anime-light disabled:opacity-30 disabled:cursor-not-allowed hover:bg-anime-sage/10 transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </main>

      {/* Similar Entities Modal */}
      {selectedAnime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-anime-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-anime-dark border border-anime-sage/30 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-anime-sage/20 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-anime-sage font-semibold">Top 10 Similar Matches</span>
                <h2 className="text-xl font-bold font-heading text-anime-light mt-1">
                  {selectedAnime.title_english || selectedAnime.title}
                </h2>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-anime-light/60 hover:text-anime-light hover:bg-anime-sage/10 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body: Similar List */}
            <div className="overflow-y-auto space-y-3 pr-2 flex-grow">
              {modalLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-anime-sage/20 border-t-anime-sage rounded-full animate-spin"></div>
                </div>
              ) : similarItems.length === 0 ? (
                <p className="text-center text-sm text-anime-light/50 py-8">
                  No precomputed similar entries found for this title.
                </p>
              ) : (
                similarItems.map((item, index) => (
                  <div 
                    key={item.mal_id || index}
                    className="p-3.5 rounded-xl bg-anime-dark/40 border border-anime-sage/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-sm font-mono font-bold text-anime-sage">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-anime-light">
                          {item.title_english || item.title}
                        </h4>
                        <p className="text-xs text-anime-light/50 line-clamp-1">
                          {item.genres || 'Genres unavailable'}
                        </p>
                      </div>
                    </div>
                    {item.similarity_score && (
                      <span className="text-xs font-mono text-anime-coral px-2.5 py-1 rounded bg-anime-coral/10">
                        {(item.similarity_score * 100).toFixed(1)}% match
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-anime-sage/20 pt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 text-xs font-semibold font-heading rounded-lg bg-anime-sage text-anime-dark hover:bg-anime-sage/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}