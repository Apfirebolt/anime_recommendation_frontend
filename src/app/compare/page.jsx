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
  BarElement
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ArrowsRightLeftIcon, 
  FilmIcon, 
  BookOpenIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function ComparePage() {
  const [contentType, setContentType] = useState(null); // 'anime' or 'manga'
  
  // Selection states
  const [item1, setItem1] = useState(null);
  const [item2, setItem2] = useState(null);

  // Search states for Side 1
  const [search1, setSearch1] = useState('');
  const [results1, setResults1] = useState([]);
  const [loading1, setLoading1] = useState(false);

  // Search states for Side 2
  const [search2, setSearch2] = useState('');
  const [results2, setResults2] = useState([]);
  const [loading2, setLoading2] = useState(false);

  // Fetch function for Side 1 search
  const fetchSearch1 = useCallback(async (query) => {
    if (!query.trim()) {
      setResults1([]);
      return;
    }
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

  // Fetch function for Side 2 search
  const fetchSearch2 = useCallback(async (query) => {
    if (!query.trim()) {
      setResults2([]);
      return;
    }
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

  // Debounce search 1
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search1) fetchSearch1(search1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search1, fetchSearch1]);

  // Debounce search 2
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search2) fetchSearch2(search2);
    }, 300);
    return () => clearTimeout(timer);
  }, [search2, fetchSearch2]);

  // Reset choices if content type changes
  const handleTypeSelect = (type) => {
    setContentType(type);
    setItem1(null);
    setItem2(null);
    setSearch1('');
    setSearch2('');
  };

  // Prepare chart data if both items are selected
  const radarData = item1 && item2 ? {
    labels: ['Score (x10)', 'Popularity (Inverted)', 'Members (Scaled)', 'Favorites (Scaled)', 'Rank (Inverted)'],
    datasets: [
      {
        label: item1.title_english || item1.title,
        data: [
          (item1.score || 0),
          item1.popularity ? Math.max(0, 100 - (item1.popularity / 200)) : 50,
          item1.members ? Math.min(10, Math.log10(item1.members) * 2) : 0,
          item1.favorites ? Math.min(10, Math.log10(item1.favorites + 1) * 2.5) : 0,
          item1.rank ? Math.max(0, 100 - (item1.rank / 200)) : 50,
        ],
        backgroundColor: 'rgba(125, 157, 134, 0.2)', // anime-sage transparent
        borderColor: '#7D9D86',
        borderWidth: 2,
      },
      {
        label: item2.title_english || item2.title,
        data: [
          (item2.score || 0),
          item2.popularity ? Math.max(0, 100 - (item2.popularity / 200)) : 50,
          item2.members ? Math.min(10, Math.log10(item2.members) * 2) : 0,
          item2.favorites ? Math.min(10, Math.log10(item2.favorites + 1) * 2.5) : 0,
          item2.rank ? Math.max(0, 100 - (item2.rank / 200)) : 50,
        ],
        backgroundColor: 'rgba(235, 129, 103, 0.2)', // anime-coral transparent
        borderColor: '#EB8167',
        borderWidth: 2,
      },
    ],
  } : null;

  return (
    <div className="min-h-screen bg-anime-dark text-anime-light flex flex-col font-sans selection:bg-anime-sage selection:text-anime-dark">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-anime-sage/10 border border-anime-sage/20 text-anime-sage text-sm font-medium">
            <ArrowsRightLeftIcon className="h-4 w-4" />
            <span>Head-to-Head Comparison</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight">
            Compare <span className="text-anime-sage">Titles</span> Side-by-Side
          </h1>
          <p className="text-sm text-anime-light/60">
            Select two anime or manga titles to evaluate scores, popularity rankings, and statistical performance metrics.
          </p>
        </div>

        {/* Step 1: Choose Type if not selected */}
        {!contentType ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto pt-8">
            <button
              onClick={() => handleTypeSelect('anime')}
              className="p-8 rounded-2xl bg-anime-dark/40 border border-anime-sage/20 hover:border-anime-sage transition-all flex flex-col items-center text-center space-y-4 group"
            >
              <div className="w-14 h-14 rounded-xl bg-anime-sage/10 flex items-center justify-center text-anime-sage group-hover:scale-110 transition-transform">
                <FilmIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-heading">Compare Anime</h3>
              <p className="text-xs text-anime-light/60">Evaluate TV series, movies, and OVAs head-to-head.</p>
            </button>

            <button
              onClick={() => handleTypeSelect('manga')}
              className="p-8 rounded-2xl bg-anime-dark/40 border border-anime-sage/20 hover:border-anime-sage transition-all flex flex-col items-center text-center space-y-4 group"
            >
              <div className="w-14 h-14 rounded-xl bg-anime-coral/10 flex items-center justify-center text-anime-coral group-hover:scale-110 transition-transform">
                <BookOpenIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold font-heading">Compare Manga</h3>
              <p className="text-xs text-anime-light/60">Compare chapters, authors, and reader ratings.</p>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Switch Mode Bar */}
            <div className="flex items-center justify-between bg-anime-dark/40 p-4 rounded-xl border border-anime-sage/20">
              <span className="text-sm text-anime-light/70">
                Comparing: <strong className="text-anime-sage uppercase font-mono">{contentType}</strong>
              </span>
              <button
                onClick={() => setContentType(null)}
                className="text-xs text-anime-coral hover:underline font-medium"
              >
                Change Category
              </button>
            </div>

            {/* Step 2: Split Screen Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SIDE 1 */}
              <div className="p-6 rounded-2xl bg-anime-dark/40 border border-anime-sage/20 space-y-4 relative">
                <h3 className="font-heading font-bold text-lg text-anime-sage">Title A</h3>
                
                {!item1 ? (
                  <div className="space-y-3 relative">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-anime-light/40" />
                      <input
                        type="text"
                        value={search1}
                        onChange={(e) => setSearch1(e.target.value)}
                        placeholder={`Search ${contentType}...`}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-anime-dark/60 border border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-anime-light"
                      />
                    </div>

                    {/* Search Results Dropdown */}
                    {results1.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-anime-dark border border-anime-sage/30 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-anime-sage/10">
                        {results1.map((item) => (
                          <button
                            key={item.mal_id}
                            onClick={() => { setItem1(item); setSearch1(''); setResults1([]); }}
                            className="w-full p-3 text-left flex items-center gap-3 hover:bg-anime-sage/10 transition-colors"
                          >
                            <img src={item.image_url} alt="" className="w-10 h-14 object-cover rounded" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-anime-light truncate">{item.title_english || item.title}</p>
                              <p className="text-[10px] text-anime-light/50">Score: {item.score || 'N/A'}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-anime-dark/60 border border-anime-sage/30">
                    <div className="flex items-center gap-3">
                      <img src={item1.image_url} alt="" className="w-12 h-16 object-cover rounded-lg" />
                      <div>
                        <h4 className="font-bold text-sm text-anime-light line-clamp-1">{item1.title_english || item1.title}</h4>
                        <p className="text-xs text-anime-sage">Score: {item1.score || 'N/A'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setItem1(null)} 
                      className="p-1 rounded-lg bg-anime-coral/10 text-anime-coral hover:bg-anime-coral/20"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* SIDE 2 */}
              <div className="p-6 rounded-2xl bg-anime-dark/40 border border-anime-sage/20 space-y-4 relative">
                <h3 className="font-heading font-bold text-lg text-anime-coral">Title B</h3>
                
                {!item2 ? (
                  <div className="space-y-3 relative">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-anime-light/40" />
                      <input
                        type="text"
                        value={search2}
                        onChange={(e) => setSearch2(e.target.value)}
                        placeholder={`Search ${contentType}...`}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-anime-dark/60 border border-anime-sage/30 rounded-xl focus:outline-none focus:border-anime-sage text-anime-light"
                      />
                    </div>

                    {/* Search Results Dropdown */}
                    {results2.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-anime-dark border border-anime-sage/30 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-anime-sage/10">
                        {results2.map((item) => (
                          <button
                            key={item.mal_id}
                            onClick={() => { setItem2(item); setSearch2(''); setResults2([]); }}
                            className="w-full p-3 text-left flex items-center gap-3 hover:bg-anime-sage/10 transition-colors"
                          >
                            <img src={item.image_url} alt="" className="w-10 h-14 object-cover rounded" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-anime-light truncate">{item.title_english || item.title}</p>
                              <p className="text-[10px] text-anime-light/50">Score: {item.score || 'N/A'}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-anime-dark/60 border border-anime-sage/30">
                    <div className="flex items-center gap-3">
                      <img src={item2.image_url} alt="" className="w-12 h-16 object-cover rounded-lg" />
                      <div>
                        <h4 className="font-bold text-sm text-anime-light line-clamp-1">{item2.title_english || item2.title}</h4>
                        <p className="text-xs text-anime-coral">Score: {item2.score || 'N/A'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setItem2(null)} 
                      className="p-1 rounded-lg bg-anime-coral/10 text-anime-coral hover:bg-anime-coral/20"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Step 3: Comparison Dashboard (Visible when both items selected) */}
            {item1 && item2 && (
              <div className="space-y-8 pt-6 border-t border-anime-sage/20 animate-fade-in">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold font-heading">Performance Radar Analysis</h2>
                  <p className="text-xs text-anime-light/60">Multi-variable evaluation across score, popularity, members, and rankings.</p>
                </div>

                {/* Radar Chart Container */}
                <div className="max-w-xl mx-auto p-6 rounded-2xl bg-anime-dark/40 border border-anime-sage/20 shadow-xl">
                  <Radar data={radarData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                </div>

                {/* Side-by-Side Metric Table */}
                <div className="rounded-2xl overflow-hidden border border-anime-sage/20 bg-anime-dark/40">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-anime-sage/20 bg-anime-dark/60 text-xs font-mono text-anime-light/60 uppercase">
                        <th className="p-4">{item1.title_english || item1.title}</th>
                        <th className="p-4 text-center">Metric</th>
                        <th className="p-4 text-right">{item2.title_english || item2.title}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-anime-sage/10 text-sm">
                      <tr>
                        <td className="p-4 font-bold text-anime-sage">{item1.score ?? 'N/A'}</td>
                        <td className="p-4 text-center text-anime-light/60">Score</td>
                        <td className="p-4 text-right font-bold text-anime-coral">{item2.score ?? 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono">#{item1.rank ?? 'N/A'}</td>
                        <td className="p-4 text-center text-anime-light/60">MAL Rank</td>
                        <td className="p-4 text-right font-mono">#{item2.rank ?? 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono">#{item1.popularity ?? 'N/A'}</td>
                        <td className="p-4 text-center text-anime-light/60">Popularity</td>
                        <td className="p-4 text-right font-mono">#{item2.popularity ?? 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="p-4">{item1.members?.toLocaleString() ?? 'N/A'}</td>
                        <td className="p-4 text-center text-anime-light/60">Members</td>
                        <td className="p-4 text-right">{item2.members?.toLocaleString() ?? 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="p-4">{contentType === 'anime' ? (item1.episodes ?? 'Ongoing') : (item1.chapters ?? 'Ongoing')}</td>
                        <td className="p-4 text-center text-anime-light/60">{contentType === 'anime' ? 'Episodes' : 'Chapters'}</td>
                        <td className="p-4 text-right">{contentType === 'anime' ? (item2.episodes ?? 'Ongoing') : (item2.chapters ?? 'Ongoing')}</td>
                      </tr>
                      <tr>
                        <td className="p-4 truncate max-w-xs">{item1.genres?.replaceAll('|', ', ') ?? 'N/A'}</td>
                        <td className="p-4 text-center text-anime-light/60">Genres</td>
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