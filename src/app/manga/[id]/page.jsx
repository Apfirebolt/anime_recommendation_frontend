'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import httpClient from '@/lib/api';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  SparklesIcon, 
  StarIcon, 
  BookOpenIcon, 
  UserIcon, 
  CalendarDaysIcon,
  BookmarkSquareIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function MangaDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMangaDetail = async () => {
      setLoading(true);
      try {
        const response = await httpClient.get(`/manga/${id}`);
        setManga(response.data);
      } catch (err) {
        console.error('Failed to fetch manga details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans transition-colors duration-200">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans transition-colors duration-200">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 px-6 text-center">
          <BookOpenIcon className="h-16 w-16 text-gray-400 dark:text-anime-light/30" />
          <h1 className="text-2xl font-bold font-heading">Manga Not Found</h1>
          <p className="text-gray-600 dark:text-anime-light/60 text-sm max-w-md">
            We couldn't retrieve the details for this title. It might not exist in the database or the server is unreachable.
          </p>
          <Link
            href="/manga"
            className="px-6 py-2.5 rounded-xl bg-anime-sage text-anime-dark font-semibold font-heading hover:bg-anime-sage/90 transition-colors shadow-sm"
          >
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans selection:bg-anime-sage selection:text-anime-dark transition-colors duration-200">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
        
        {/* Back Navigation */}
        <div>
          <Link
            href="/manga"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-anime-light/70 hover:text-anime-sage dark:hover:text-anime-sage transition-colors group font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* Main Hero Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Poster Image */}
          <div className="lg:col-span-1 rounded-2xl overflow-hidden border border-gray-200 dark:border-anime-sage/20 bg-gray-50 dark:bg-anime-dark/40 shadow-xl">
            {manga.image_url ? (
              <img 
                src={manga.image_url} 
                alt={manga.title_english || manga.title}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-100 dark:bg-anime-dark/80 text-gray-400 dark:text-anime-light/40">
                No Image Available
              </div>
            )}
          </div>

          {/* Core Metadata & Synopsis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs px-3 py-1 rounded-full bg-anime-sage/10 text-anime-sage font-semibold border border-anime-sage/20">
                  {manga.type || 'Manga'}
                </span>
                {manga.status && (
                  <span className="text-xs px-3 py-1 rounded-full bg-anime-coral/10 text-anime-coral font-semibold border border-anime-coral/20">
                    {manga.status}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight">
                {manga.title_english || manga.title}
              </h1>
              {manga.title_japanese && (
                <p className="text-sm font-heading text-gray-500 dark:text-anime-light/50">{manga.title_japanese}</p>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/10 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs text-gray-500 dark:text-anime-light/50 flex items-center gap-1">
                  <StarIcon className="h-3.5 w-3.5 text-anime-coral" /> Score
                </span>
                <p className="text-lg font-bold font-heading">{manga.score || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 dark:text-anime-light/50 flex items-center gap-1">
                  <BookOpenIcon className="h-3.5 w-3.5 text-anime-sage" /> Chapters
                </span>
                <p className="text-lg font-bold font-heading">{manga.chapters || 'Ongoing'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 dark:text-anime-light/50 flex items-center gap-1">
                  <BookmarkSquareIcon className="h-3.5 w-3.5 text-anime-sage" /> Volumes
                </span>
                <p className="text-lg font-bold font-heading">{manga.volumes || 'Ongoing'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 dark:text-anime-light/50 flex items-center gap-1">
                  <UserIcon className="h-3.5 w-3.5 text-anime-sage" /> Authors
                </span>
                <p className="text-sm font-bold font-heading truncate" title={manga.authors || 'Unknown'}>
                  {manga.authors || 'Unknown'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 dark:text-anime-light/50 flex items-center gap-1">
                  <CalendarDaysIcon className="h-3.5 w-3.5 text-anime-coral" /> Published From
                </span>
                <p className="text-sm font-bold font-heading">
                  {manga.published_from ? new Date(manga.published_from).getFullYear() : 'N/A'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-500 dark:text-anime-light/50 flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5 text-anime-coral" /> Serialized In
                </span>
                <p className="text-sm font-bold font-heading truncate" title={manga.serializations || 'N/A'}>
                  {manga.serializations || 'N/A'}
                </p>
              </div>
            </div>

            {/* Genres & Tags */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-anime-light/60">Genres & Tags</h3>
              <div className="flex flex-wrap gap-2">
                {manga.genres && manga.genres.split('|').map((genre, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-anime-dark border border-gray-200 dark:border-anime-sage/20 text-gray-700 dark:text-anime-light/80 font-medium">
                    {genre.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Themes */}
            {manga.themes?.trim() && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-anime-light/60">Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {manga.themes.split('|').map((theme, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-anime-dark border border-gray-200 dark:border-anime-sage/20 text-gray-700 dark:text-anime-light/80 font-medium">
                      {theme.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-anime-light/60">Synopsis</h3>
              <p className="text-sm text-gray-700 dark:text-anime-light/80 leading-relaxed bg-gray-50 dark:bg-anime-dark/30 p-4 rounded-xl border border-gray-200 dark:border-anime-sage/10 shadow-sm">
                {manga.synopsis || 'No synopsis available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Precomputed Similar Manga Section */}
        <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-anime-sage/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-anime-sage/10 flex items-center justify-center text-anime-sage">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading">Similar Recommendations</h2>
              <p className="text-xs text-gray-500 dark:text-anime-light/60">Top 10 similar manga to <span className="font-semibold text-anime-coral">{manga.title}</span></p>
            </div>
          </div>

          {!manga.similar_manga || manga.similar_manga.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-anime-light/50 py-8 text-center bg-gray-50 dark:bg-anime-dark/40 rounded-xl border border-gray-200 dark:border-anime-sage/10 shadow-sm">
              No precomputed similarity matches found for this title.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {manga.similar_manga.map((sim, index) => (
                <Link
                  key={sim.mal_id}
                  href={`/manga/${sim.mal_id}`}
                  className="p-4 rounded-2xl bg-white dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 hover:border-anime-sage/50 transition-all flex items-start justify-between gap-4 group shadow-sm"
                >
                  <div className="flex items-start gap-4 flex-grow min-w-0">
                    {/* Thumbnail Image with Rank Badge Overlay */}
                    <div className="relative w-20 h-28 shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-anime-sage/20 bg-gray-100 dark:bg-anime-dark">
                      {sim.image_url ? (
                        <img 
                          src={sim.image_url} 
                          alt={sim.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 dark:text-anime-light/40 text-center">
                          No Image
                        </div>
                      )}
                      <span className="absolute top-1 left-1 w-6 h-6 rounded-md bg-white/90 dark:bg-anime-dark/80 backdrop-blur-md flex items-center justify-center text-[10px] font-mono font-bold text-anime-sage border border-gray-200 dark:border-anime-sage/20 shadow-sm">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="space-y-1.5 flex-grow min-w-0">
                      <h4 className="font-heading font-bold group-hover:text-anime-sage transition-colors line-clamp-1 text-base">
                        {sim.title}
                      </h4>
                      <p className="text-[10px] text-gray-600 dark:text-anime-light/60 line-clamp-2 leading-relaxed">
                        {sim.synopsis || 'No synopsis available.'}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-gray-500 dark:text-anime-light/50 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-anime-coral">
                          <StarIcon className="h-3 w-3" /> {sim.score || 'N/A'}
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[160px]">{sim.genres}</span>
                      </div>
                    </div>
                  </div>

                  {/* Similarity Badge */}
                  {sim.similarity_score && (
                    <span className="text-xs font-mono text-anime-coral px-2.5 py-1 rounded-full bg-anime-coral/10 shrink-0 border border-anime-coral/20 self-start">
                      {(sim.similarity_score * 100).toFixed(1)}%
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}