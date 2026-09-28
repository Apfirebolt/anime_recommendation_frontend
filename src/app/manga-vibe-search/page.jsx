// app/manga/vibe-search/page.jsx
import VibeSearchClient from './VibeSearchClient';

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q;

  if (query) {
    return {
      title: `Manga Vibe Search: "${query}" | AnimeLounge`,
      description: `Explore AI-recommended manga matching the vibe: "${query}" using semantic similarity vectors.`,
      openGraph: {
        title: `Manga Vibe Search: "${query}" | AnimeLounge`,
        description: `Explore AI-recommended manga matching the vibe: "${query}".`,
        type: 'website',
      },
    };
  }

  return {
    title: 'AI Manga Vibe Search - Describe & Discover Manga | AnimeLounge',
    description: 'Use our AI semantic vector search engine to find manga matching any plot, mood, or character trope you describe in plain English.',
    openGraph: {
      title: 'AI Manga Vibe Search | AnimeLounge',
      description: 'Discover manga matching your custom descriptions using sentence embeddings and cosine similarity.',
      type: 'website',
    },
  };
}

export default function VibeSearchPage() {
  return <VibeSearchClient />;
}