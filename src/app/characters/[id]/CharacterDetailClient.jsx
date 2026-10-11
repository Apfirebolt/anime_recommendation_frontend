'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  UserIcon, 
  TagIcon, 
  BookmarkSquareIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

export default function CharacterDetailClient({ character }) {
  // Safely parse attributes if they are stored as a JSON string
  let parsedAttributes = [];
  try {
    if (character.attributes) {
      parsedAttributes = typeof character.attributes === 'string' 
        ? JSON.parse(character.attributes) 
        : character.attributes;
    }
  } catch (e) {
    console.error('Failed to parse character attributes:', e);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans selection:bg-anime-sage selection:text-anime-dark transition-colors duration-200">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
        
        {/* Back Navigation */}
        <div>
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-anime-light/70 hover:text-anime-sage dark:hover:text-anime-sage transition-colors group font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Characters</span>
          </Link>
        </div>

        {/* Main Hero & Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-anime-sage/20 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs px-3 py-1 rounded-full bg-anime-sage/10 text-anime-sage font-mono font-semibold border border-anime-sage/20">
                  ID #{character.character_id}
                </span>
                {character.alternate_name && (
                  <span className="text-xs px-3 py-1 rounded-full bg-anime-coral/10 text-anime-coral font-semibold border border-anime-coral/20">
                    {character.alternate_name}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight">
                {character.full_name || character.name}
              </h1>
              {character.full_name && character.full_name !== character.name && (
                <p className="text-sm text-gray-500 dark:text-anime-light/60 font-medium">
                  Listing Name: <span className="text-anime-sage">{character.name}</span>
                </p>
              )}
            </div>

            {character.url && (
              <div className="shrink-0">
                <a
                  href={character.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-anime-sage text-anime-dark font-semibold font-heading hover:bg-anime-sage/90 transition-all shadow-sm flex items-center gap-2 text-sm group"
                >
                  <span>View on MyAnimeList</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Content Layout: Attributes Sidebar + Description Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Attributes Card Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-200 dark:border-anime-sage/10 pb-3">
                <TagIcon className="h-5 w-5 text-anime-sage" />
                <h3 className="font-heading font-bold text-base">Character Attributes</h3>
              </div>

              {parsedAttributes.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-anime-light/50 py-4 text-center">
                  No attributes recorded.
                </p>
              ) : (
                <div className="space-y-3">
                  {parsedAttributes.map((attr, idx) => (
                    <div key={idx} className="space-y-0.5 text-xs">
                      <span className="font-semibold text-gray-500 dark:text-anime-light/50 uppercase tracking-wider block">
                        {attr.name}
                      </span>
                      <p className="font-medium text-gray-800 dark:text-anime-light/90">
                        {attr.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Biography / Description Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-200 dark:border-anime-sage/10 pb-3">
                <BookmarkSquareIcon className="h-5 w-5 text-anime-coral" />
                <h3 className="font-heading font-bold text-lg">Biography & Background</h3>
              </div>

              <div className="text-sm text-gray-700 dark:text-anime-light/85 leading-relaxed space-y-4">
                {character.description ? (
                  character.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-anime-light/50 italic">No biography written for this character.</p>
                )}
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}