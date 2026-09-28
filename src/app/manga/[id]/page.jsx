// app/manga/[id]/page.jsx
import httpClient from '@/lib/api';
import MangaDetailClient from './MangaDetailClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { BookOpenIcon } from '@heroicons/react/24/outline';

// Dynamic metadata generation based on server-side fetched API data
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  try {
    const response = await httpClient.get(`/manga/${id}`);
    const manga = response.data;
    const title = manga?.title_english || manga?.title || 'Manga Detail';

    return {
      title: `${title} | AnimeLounge`,
      description: manga?.synopsis ? manga.synopsis.slice(0, 160) + '...' : 'Explore manga details and recommendations.',
      openGraph: {
        title: `${title} | AnimeLounge`,
        description: manga?.synopsis ? manga.synopsis.slice(0, 160) + '...' : '',
        images: manga?.image_url ? [manga.image_url] : [],
        type: 'website',
      },
    };
  } catch (err) {
    return {
      title: 'Manga Not Found | AnimeLounge',
      description: 'The requested manga could not be found.',
    };
  }
}

export default async function MangaDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  let manga = null;
  let error = false;

  try {
    const response = await httpClient.get(`/manga/${id}`);
    manga = response.data;
  } catch (err) {
    console.error('Failed to fetch manga details on server:', err);
    error = true;
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

  return <MangaDetailClient manga={manga} />;
}