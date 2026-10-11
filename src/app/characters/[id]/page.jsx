import httpClient from '@/lib/api';
import CharacterDetailClient from './CharacterDetailClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { UserGroupIcon } from '@heroicons/react/24/outline';

// Dynamic metadata generation based on character API data
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  try {
    const response = await httpClient.get(`/anime/characters/${id}`);
    const character = response.data;
    const name = character?.full_name || character?.name || 'Character Detail';

    return {
      title: `${name} | AnimeLounge`,
      description: character?.description ? character.description.slice(0, 160) + '...' : 'Explore character bio, attributes, and details.',
      openGraph: {
        title: `${name} | AnimeLounge`,
        description: character?.description ? character.description.slice(0, 160) + '...' : '',
        type: 'website',
      },
    };
  } catch (err) {
    return {
      title: 'Character Not Found | AnimeLounge',
      description: 'The requested anime character could not be found.',
    };
  }
}

export default async function CharacterDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  let character = null;
  let error = false;

  try {
    const response = await httpClient.get(`/anime/characters/${id}`);
    character = response.data;
  } catch (err) {
    console.error('Failed to fetch character details on server:', err);
    error = true;
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans transition-colors duration-200">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 px-6 text-center">
          <UserGroupIcon className="h-16 w-16 text-gray-400 dark:text-anime-light/30" />
          <h1 className="text-2xl font-bold font-heading">Character Not Found</h1>
          <p className="text-gray-600 dark:text-anime-light/60 text-sm max-w-md">
            We couldn't retrieve the details for this character. It might not exist in the database or the server is unreachable.
          </p>
          <Link
            href="/characters"
            className="px-6 py-2.5 rounded-xl bg-anime-sage text-anime-dark font-semibold font-heading hover:bg-anime-sage/90 transition-colors shadow-sm"
          >
            Back to Characters
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return <CharacterDetailClient character={character} />;
}