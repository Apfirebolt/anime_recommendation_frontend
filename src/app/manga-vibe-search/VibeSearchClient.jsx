// app/manga/vibe-search/VibeSearchClient.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import httpClient from "@/lib/api";
import Link from "next/link";
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  StarIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function VibeSearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialLimit = searchParams.get("limit") || "12";

  const [query, setQuery] = useState(initialQuery);
  const [limit, setLimit] = useState(initialLimit);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Trigger search when query or limit is present in URL
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      executeSearch(initialQuery, initialLimit);
    }
  }, [initialQuery, initialLimit]);

  const executeSearch = async (searchQuery, searchLimit) => {
    // Guard clause: prevent sending empty or whitespace-only queries
    if (!searchQuery || !searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await httpClient.get("/manga/vibe-search", {
        params: { q: searchQuery.trim(), limit: Number(searchLimit) || 12 },
      });
      setResults(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || [],
      );
    } catch (err) {
      console.error("Vibe search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query || !query.trim()) return;

    // Update URL query params so it matches the search state and limit
    router.push(`/manga-vibe-search?q=${encodeURIComponent(query.trim())}&limit=${limit}`);
    executeSearch(query, limit);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans selection:bg-anime-sage selection:text-anime-dark transition-colors duration-200">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Vibe Search Hero Input Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-anime-sage/10 border border-anime-sage/20 text-anime-sage text-sm font-medium">
            <SparklesIcon className="h-4 w-4" />
            <span>AI Semantic Vector Search</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight">
            Manga <span className="text-anime-sage">Vibe Search</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-anime-light/60">
            Describe a plot, setting, character dynamic, or vibe in plain
            English, and let our ML model find matching manga.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto pt-2"
          >
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-anime-light/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., A brooding protagonist who inherits a magical artifact..."
                className="w-full pl-12 pr-4 py-3.5 text-sm bg-gray-50 dark:bg-anime-dark/50 border border-gray-300 dark:border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-gray-900 dark:text-anime-light placeholder-gray-400 dark:placeholder-anime-light/40 shadow-sm transition-colors"
              />
            </div>

            {/* Limit Selector Dropdown */}
            <select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              aria-label="Number of results to show"
              className="px-4 py-3.5 text-sm bg-gray-50 dark:bg-anime-dark/50 border border-gray-300 dark:border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-gray-900 dark:text-anime-light shadow-sm cursor-pointer shrink-0"
            >
              <option value="10">10 results</option>
              <option value="20">20 results</option>
              <option value="30">30 results</option>
              <option value="40">40 results</option>
              <option value="50">50 results</option>
            </select>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3.5 text-sm font-semibold font-heading rounded-xl bg-anime-sage text-anime-dark hover:bg-anime-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>{loading ? "Searching..." : "Search Vibe"}</span>
            </button>
          </form>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <Loader />
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-anime-light/30" />
            <p className="text-gray-600 dark:text-anime-light/60 text-lg">
              No matching manga vibes found for &quot;{initialQuery}&quot;.
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-anime-sage/20 pb-4">
              <h2 className="text-xl font-bold font-heading">
                Semantic Matches
              </h2>
              <span className="text-xs font-mono text-gray-500 dark:text-anime-light/50">
                Found {results.length} results
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((manga) => (
                <div
                  key={manga.mal_id}
                  className="bg-white dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 rounded-2xl p-5 flex flex-col justify-between hover:border-anime-sage/55 transition-all shadow-sm group"
                >
                  <div className="flex items-start gap-4 flex-grow min-w-0">
                    {/* Medium Sized Poster Thumbnail Image */}
                    <div className="relative w-24 h-36 shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-anime-sage/20 bg-gray-100 dark:bg-anime-dark shadow-md">
                      {manga.image_url ? (
                        <img
                          src={manga.image_url}
                          alt={manga.title_english || manga.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 dark:text-anime-light/40 text-center">
                          No Image
                        </div>
                      )}

                      {/* Vibe Match Badge Overlay (if available) */}
                      {manga.vibe_match_score !== undefined &&
                        manga.vibe_match_score !== null && (
                          <span className="absolute top-1 right-1 text-[10px] font-mono font-bold text-white bg-anime-coral px-2 py-0.5 rounded-md shadow-md">
                            {manga.vibe_match_score}%
                          </span>
                        )}
                    </div>

                    {/* Content Details */}
                    <div className="space-y-2 flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading font-bold text-gray-900 dark:text-anime-light group-hover:text-anime-sage transition-colors line-clamp-1 text-base">
                          {manga.title_english || manga.title}
                        </h3>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-anime-light/60 line-clamp-3 leading-relaxed">
                        {manga.synopsis || "No synopsis available."}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-500 dark:text-anime-light/50 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-anime-coral">
                          <StarIcon className="h-3.5 w-3.5" />{" "}
                          {manga.score || "N/A"}
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[160px]">
                          {manga.genres
                            ? manga.genres.replaceAll("|", ", ")
                            : "Manga"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-anime-sage/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-anime-light/40 font-mono">
                      Type: {manga.type || "Manga"} ({manga.chapters || "?"} ch)
                    </span>

                    <Link
                      href={`/manga/${manga.mal_id}`}
                      className="px-3.5 py-1.5 text-xs font-semibold font-heading rounded-lg bg-anime-sage/10 text-anime-sage hover:bg-anime-sage hover:text-anime-dark transition-all flex items-center gap-1.5 group/btn"
                    >
                      <EyeIcon className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}