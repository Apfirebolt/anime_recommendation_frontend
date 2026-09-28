// app/anime/compare/page.jsx
import CompareClient from './CompareClient';

export const metadata = {
  title: 'Head-to-Head Anime & Manga Comparison Analytics | AnimeLounge',
  description: 'Compare two anime or manga titles side-by-side using multi-metric radar charts, statistical scorecards, community ratings, and popularity metrics.',
  openGraph: {
    title: 'Anime & Manga Comparison Analytics | AnimeLounge',
    description: 'Contrast scoring curves, episode lengths, member reach, and ratings head-to-head.',
    type: 'website',
  },
};

export default function ComparePageServer() {
  return <CompareClient />;
}