// app/anime/compare/CompareClient.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import httpClient from '@/lib/api';
import { 
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ArrowsRightLeftIcon, 
  FilmIcon, 
  BookOpenIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function CompareClient() {
  const [contentType, setContentType] = useState(null); // 'anime' or 'manga'
  
  const [item1, setItem1] = useState(null);
  const [item2, setItem2] = useState(null);

  const [search1, setSearch1] = useState('');
  const [results1, setResults1] = useState([]);
  const [loading1, setLoading1] = useState(false);

  const [search2, setSearch2] = useState('');
  const [results2, setResults2] = useState([]);
  const [loading2, setLoading2] = useState(false);

  const fetchSearch1 = useCallback(async (query) => {
    if (!query.trim()) { setResults1([]); return; }
    setLoading1(true);
    try {
      const endpoint = contentType === 'anime' ? '/anime' : '/manga';
      const response = await httpClient.get(endpoint, { params: { search: query, size: 5 } });
      const items = response.data.items || response.data;
      setResults1(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Search error:', err);
      setResults1([]);
    } finally {
      setLoading1(false);
    }
  }, [contentType]);

  const fetchSearch2 = useCallback(async (query) => {
    if (!query.trim()) { setResults2([]); return; }
    setLoading2(true);
    try {
      const endpoint = contentType === 'anime' ? '/anime' : '/manga';
      const response = await httpClient.get(endpoint, { params: { search: query, size: 5 } });
      const items = response.data.items || response.data;
      setResults2(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Search error:', err);
      setResults2([]);
    } finally {
      setLoading2(false);
    }
  }, [contentType]);

  useEffect(() => {
    const timer = setTimeout(() => { if (search1) fetchSearch1(search1); }, 300);
    return () => clearTimeout(timer);
  }, [search1, fetchSearch1]);

  useEffect(() => {
    const timer = setTimeout(() => { if (search2) fetchSearch2(search2); }, 300);
    return () => clearTimeout(timer);
  }, [search2, fetchSearch2]);

  const handleTypeSelect = (type) => {
    setContentType(type);
    setItem1(null);
    setItem2(null);
    setSearch1('');
    setSearch2('');
  };

  const radarData = item1 && item2 ? {
    labels: ['Score', 'Popularity Index', 'Member Reach', 'Favorites Ratio', 'Rank Standing'],
    datasets: [
      {
        label: item1.title_english || item1.title,
        data: [
          item1.score || 0,
          item1.popularity ? Math.max(0, 10 - (item1.popularity / 1500)) : 0,
          item1.members ? Math.min(10, Math.log10(item1.members) * 1.8) : 0,
          item1.favorites ? Math.min(10, Math.log10(item1.favorites + 1) * 2.2) : 0,
          item1.rank ? Math.max(0, 10 - (item1.rank / 1500)) : 0,
        ],
        backgroundColor: 'rgba(125, 157, 134, 0.25)',
        borderColor: '#7D9D86',
        borderWidth: 2.5,
        pointBackgroundColor: '#7D9D86',
      },
      {
        label: item2.title_english || item2.title,
        data: [
          item2.score || 0,
          item2.popularity ? Math.max(0, 10 - (item2.popularity / 1500)) : 0,
          item2.members ? Math.min(10, Math.log10(item2.members) * 1.8) : 0,
          item2.favorites ? Math.min(10, Math.log10(item2.favorites + 1) * 2.2) : 0,
          item2.rank ? Math.max(0, 10 - (item2.rank / 1500)) : 0,
        ],
        backgroundColor: 'rgba(235, 129, 103, 0.25)',
        borderColor: '#EB8167',
        borderWidth: 2.5,
        pointBackgroundColor: '#EB8167',
      },
    ],
  } : null;

  const barData = item1 && item2 ? {
    labels: ['Total Members', 'Favorites', contentType === 'anime' ? 'Episodes' : 'Chapters', 'Scored By (k)'],
    datasets: [
      {
        label: item1.title_english || item1.title,
        data: [
          item1.members || 0,
          item1.favorites || 0,
          contentType === 'anime' ? (item1.episodes || 0) : (item1.chapters || 0),
          item1.scored_by ? Math.round(item1.scored_by / 1000) : 0,
        ],
        backgroundColor: '#7D9D86',
        borderRadius: 8,
      },
      {
        label: item2.title_english || item2.title,
        data: [
          item2.members || 0,
          item2.favorites || 0,
          contentType === 'anime' ? (item2.episodes || 0) : (item2.chapters || 0),
          item2.scored_by ? Math.round(item2.scored_by / 1000) : 0,
        ],
        backgroundColor: '#EB8167',
        borderRadius: 8,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: 'currentColor', font: { family: 'sans-serif' } } }
    },
    scales: {
      r: {
        grid: { color: 'rgba(125, 157, 134, 0.2)' },
        angleLines: { color: 'rgba(125, 157, 134, 0.2)' },
        ticks: { display: false }
      },
      x: { grid: { display: false }, ticks: { color: 'currentColor' } },
      y: { grid: { color: 'rgba(125, 157, 134, 0.1)' }, ticks: { color: 'currentColor' } }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-anime-dark dark:text-anime-light flex flex-col font-sans selection:bg-anime-sage selection:text-anime-dark transition-colors duration-200">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-anime-sage/10 border border-anime-sage/20 text-anime-sage text-sm font-medium">
            <ArrowsRightLeftIcon className="h-4 w-4" />
            <span>Advanced Head-to-Head Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight">
            Compare <span className="text-anime-sage">Titles</span> with Multi-Metric Charts
          </h1>
          <p className="text-sm text-gray-600 dark:text-anime-light/60">
            Select two anime or manga titles to contrast their scoring curves, length/episodes, and audience engagement.
          </p>
        </div>

        {!contentType ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto pt-8">
            <button
              onClick={() => handleTypeSelect('anime')}
              className="p-8 rounded-2xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 hover:border-anime-sage transition-all flex flex-col items-center text-center space-y-4 group shadow-sm"
            >
              <div className="w-14 h-14 rounded-xl bg-anime-sage/10 flex items-center justify-center text-anime-sage group-hover:scale-110 transition-transform">
                <FilmIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-heading">Compare Anime</h3>
              <p className="text-xs text-gray-500 dark:text-anime-light/60">TV series, movies, and episode analytics.</p>
            </button>

            <button
              onClick={() => handleTypeSelect('manga')}
              className="p-8 rounded-2xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/20 hover:border-anime-sage transition-all flex flex-col items-center text-center space-y-4 group shadow-sm"
            >
              <div className="w-14 h-14 rounded-xl bg-anime-coral/10 flex items-center justify-center text-anime-coral group-hover:scale-110 transition-transform">
                <BookOpenIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-heading">Compare Manga</h3>
              <p className="text-xs text-gray-500 dark:text-anime-light/60">Chapters, authors, and readership stats.</p>
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-anime-dark/40 px-6 py-4 rounded-2xl border border-gray-200 dark:border-anime-sage/25 shadow-sm">
              <span className="text-sm text-gray-700 dark:text-anime-light/70">
                Active Category: <strong className="text-anime-sage uppercase font-mono">{contentType}</strong>
              </span>
              <button
                onClick={() => setContentType(null)}
                className="text-xs text-anime-coral hover:underline font-semibold"
              >
                Switch Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/25 space-y-4 relative shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-anime-sage">Title A</h3>
                  {item1 && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-anime-sage/10 text-anime-sage">Selected</span>}
                </div>
                
                {!item1 ? (
                  <div className="space-y-3 relative">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-anime-light/40" />
                      <input
                        type="text"
                        value={search1}
                        onChange={(e) => setSearch1(e.target.value)}
                        placeholder={`Search ${contentType}...`}
                        className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-anime-dark/60 border border-gray-300 dark:border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-gray-900 dark:text-anime-light shadow-sm"
                      />
                    </div>

                    {results1.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-anime-dark border border-gray-200 dark:border-anime-sage/30 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-anime-sage/10">
                        {results1.map((item) => (
                          <button
                            key={item.mal_id}
                            onClick={() => { setItem1(item); setSearch1(''); setResults1([]); }}
                            className="w-full p-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-anime-sage/10 transition-colors"
                          >
                            <img src={item.image_url} alt="" className="w-10 h-14 object-cover rounded" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 dark:text-anime-light truncate">{item.title_english || item.title}</p>
                              <p className="text-[10px] text-gray-500 dark:text-anime-light/50">Score: {item.score || 'N/A'}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-anime-dark/60 border border-gray-200 dark:border-anime-sage/30 shadow-sm">
                    <div className="flex items-center gap-3.5">
                      <img src={item1.image_url} alt="" className="w-12 h-16 object-cover rounded-lg shadow-md" />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-anime-light line-clamp-1">{item1.title_english || item1.title}</h4>
                        <p className="text-xs text-anime-sage font-mono">Score: {item1.score || 'N/A'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setItem1(null)} 
                      className="p-1.5 rounded-lg bg-anime-coral/10 text-anime-coral hover:bg-anime-coral/20 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/25 space-y-4 relative shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-anime-coral">Title B</h3>
                  {item2 && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-anime-coral/10 text-anime-coral">Selected</span>}
                </div>
                
                {!item2 ? (
                  <div className="space-y-3 relative">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-anime-light/40" />
                      <input
                        type="text"
                        value={search2}
                        onChange={(e) => setSearch2(e.target.value)}
                        placeholder={`Search ${contentType}...`}
                        className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-anime-dark/60 border border-gray-300 dark:border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-gray-900 dark:text-anime-light shadow-sm"
                      />
                    </div>

                    {results2.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-anime-dark border border-gray-200 dark:border-anime-sage/30 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-anime-sage/10">
                        {results2.map((item) => (
                          <button
                            key={item.mal_id}
                            onClick={() => { setItem2(item); setSearch2(''); setResults2([]); }}
                            className="w-full p-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-anime-sage/10 transition-colors"
                          >
                            <img src={item.image_url} alt="" className="w-10 h-14 object-cover rounded" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 dark:text-anime-light truncate">{item.title_english || item.title}</p>
                              <p className="text-[10px] text-gray-500 dark:text-anime-light/50">Score: {item.score || 'N/A'}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-anime-dark/60 border border-gray-200 dark:border-anime-sage/30 shadow-sm">
                    <div className="flex items-center gap-3.5">
                      <img src={item2.image_url} alt="" className="w-12 h-16 object-cover rounded-lg shadow-md" />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-anime-light line-clamp-1">{item2.title_english || item2.title}</h4>
                        <p className="text-xs text-anime-coral font-mono">Score: {item2.score || 'N/A'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setItem2(null)} 
                      className="p-1.5 rounded-lg bg-anime-coral/10 text-anime-coral hover:bg-anime-coral/20 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {item1 && item2 && (
              <div className="space-y-10 pt-6 border-t border-gray-200 dark:border-anime-sage/25 animate-fade-in">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading">Statistical Breakdown</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-anime-light/60">Comparing multi-dimensional performance profiles and community engagement metrics.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/25 shadow-sm space-y-4">
                    <h3 className="font-heading font-bold text-base text-gray-900 dark:text-anime-light text-center">Holistic Vibe Shape (Normalized)</h3>
                    <div className="w-full max-w-md mx-auto aspect-square flex items-center justify-center">
                      <Radar data={radarData} options={chartOptions} />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-anime-dark/40 border border-gray-200 dark:border-anime-sage/25 shadow-sm space-y-4">
                    <h3 className="font-heading font-bold text-base text-gray-900 dark:text-anime-light text-center">Community Reach, Length & Favorites</h3>
                    <div className="w-full max-w-md mx-auto aspect-square flex items-center justify-center">
                      <Bar data={barData} options={chartOptions} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-anime-sage/25 bg-gray-50 dark:bg-anime-dark/40 shadow-sm">
                  <div className="p-4 bg-gray-100 dark:bg-anime-dark/60 border-b border-gray-200 dark:border-anime-sage/20 flex items-center gap-2 text-anime-sage text-sm font-bold font-heading">
                    <TrophyIcon className="h-5 w-5" />
                    <span>Head-to-Head Scorecard</span>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-anime-sage/10 bg-gray-100/50 dark:bg-anime-dark/30 text-xs font-mono text-gray-500 dark:text-anime-light/50 uppercase">
                        <th className="p-4">{item1.title_english || item1.title}</th>
                        <th className="p-4 text-center">Metric Attribute</th>
                        <th className="p-4 text-right">{item2.title_english || item2.title}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-anime-sage/10 text-sm">
                      <tr>
                        <td className={`p-4 font-bold flex items-center gap-2 ${item1.score > item2.score ? 'text-anime-sage' : 'text-gray-900 dark:text-anime-light'}`}>
                          {item1.score ?? 'N/A'} {item1.score > item2.score && <span className="text-[10px] bg-anime-sage/20 px-2 py-0.5 rounded text-anime-sage">Winner</span>}
                        </td>
                        <td className="p-4 text-center text-gray-500 dark:text-anime-light/50">Score Rating</td>
                        <td className={`p-4 text-right font-bold ${item2.score > item1.score ? 'text-anime-coral' : 'text-gray-900 dark:text-anime-light'}`}>
                          {item2.score > item1.score && <span className="text-[10px] bg-anime-coral/20 px-2 py-0.5 rounded mr-2 text-anime-coral">Winner</span>}
                          {item2.score ?? 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className={`p-4 font-mono ${item1.rank && item2.rank && item1.rank < item2.rank ? 'text-anime-sage font-bold' : ''}`}>
                          #{item1.rank ?? 'N/A'}
                        </td>
                        <td className="p-4 text-center text-gray-500 dark:text-anime-light/50">MAL Standing Rank</td>
                        <td className={`p-4 text-right font-mono ${item1.rank && item2.rank && item2.rank < item1.rank ? 'text-anime-coral font-bold' : ''}`}>
                          #{item2.rank ?? 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className={`p-4 font-mono ${item1.popularity && item2.popularity && item1.popularity < item2.popularity ? 'text-anime-sage font-bold' : ''}`}>
                          #{item1.popularity ?? 'N/A'}
                        </td>
                        <td className="p-4 text-center text-gray-500 dark:text-anime-light/50">Popularity Position</td>
                        <td className={`p-4 text-right font-mono ${item1.popularity && item2.popularity && item2.popularity < item1.popularity ? 'text-anime-coral font-bold' : ''}`}>
                          #{item2.popularity ?? 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4">{item1.members?.toLocaleString() ?? 'N/A'}</td>
                        <td className="p-4 text-center text-gray-500 dark:text-anime-light/50">Total Members</td>
                        <td className="p-4 text-right">{item2.members?.toLocaleString() ?? 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="p-4">{contentType === 'anime' ? (item1.episodes ?? 'Ongoing') : (item1.chapters ?? 'Ongoing')}</td>
                        <td className="p-4 text-center text-gray-500 dark:text-anime-light/50">{contentType === 'anime' ? 'Total Episodes' : 'Total Chapters'}</td>
                        <td className="p-4 text-right">{contentType === 'anime' ? (item2.episodes ?? 'Ongoing') : (item2.chapters ?? 'Ongoing')}</td>
                      </tr>
                      <tr>
                        <td className="p-4 truncate max-w-xs">{item1.genres?.replaceAll('|', ', ') ?? 'N/A'}</td>
                        <td className="p-4 text-center text-gray-500 dark:text-anime-light/50">Genres</td>
                        <td className="p-4 text-right truncate max-w-xs">{item2.genres?.replaceAll('|', ', ') ?? 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}