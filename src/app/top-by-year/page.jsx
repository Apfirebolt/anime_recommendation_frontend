import TopByYearClient from './TopByYearClient';

export const metadata = {
  title: 'Annual Leaderboards & Top Rankings by Year | AnimeLounge',
  description: 'Explore the highest-rated and most popular anime and manga releases categorized by calendar years from vintage classics to modern hits.',
  openGraph: {
    title: 'Top Rankings by Year | AnimeLounge',
    description: 'Explore top-rated anime and manga filtered by release year and custom sorting leaderboards.',
    type: 'website',
  },
};

export default function TopByYearPage() {
  return <TopByYearClient />;
}