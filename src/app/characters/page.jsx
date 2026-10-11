import CharactersClient from './CharactersClient';

export const metadata = {
  title: 'Characters Catalog & Fuzzy Search | AnimeLounge',
  description: 'Explore thousands of anime characters indexed with fuzzy search across names, aliases, and biographies.',
  openGraph: {
    title: 'Characters Catalog | AnimeLounge',
    description: 'Explore anime characters with multi-field fuzzy search.',
    type: 'website',
  },
};

export default function CharactersPage() {
  return <CharactersClient />;
}