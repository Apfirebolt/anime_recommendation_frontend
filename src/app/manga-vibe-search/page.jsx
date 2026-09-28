// app/manga-vibe-search/page.jsx
import { Suspense } from 'react';
import VibeSearchClient from './VibeSearchClient';
import Loader from '@/components/Loader';

export const metadata = {
  title: 'AI Manga Vibe Search | AnimeLounge',
  description: 'Search manga using natural language semantics and sentence embeddings.',
};

export default function MangaVibeSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-anime-dark flex items-center justify-center">
        <Loader />
      </div>
    }>
      <VibeSearchClient />
    </Suspense>
  );
}