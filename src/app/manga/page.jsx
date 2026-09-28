// app/manga/page.jsx
import MangaCatalogClient from './MangaCatalogClient';

export const metadata = {
  title: 'Manga Catalog | AnimeLounge',
  description: 'Explore manga, manhwa, and novels indexed by our similarity engine with advanced filtering and semantic discovery.',
  openGraph: {
    title: 'Manga Catalog | AnimeLounge',
    description: 'Explore manga, manhwa, and novels indexed by our similarity engine.',
    type: 'website',
  },
};

export default function MangaCatalogPage() {
  return <MangaCatalogClient />;
}