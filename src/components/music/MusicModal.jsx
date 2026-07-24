import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { useLanguage } from '../../context/LanguageContext';
import { searchMusicTracks } from '../../api';
import { X, Search, Music, Disc, Play, Pause, ListMusic, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicModal() {
  const {
    isModalOpen,
    setIsModalOpen,
    playlists,
    isLoadingPlaylists,
    playTrack,
    playPlaylist,
    currentTrack,
    isPlaying,
    togglePlay,
  } = useMusic();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('playlists'); // 'playlists' | 'search'
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isModalOpen) return null;

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchMusicTracks(searchQuery);
      setSearchResults(results || []);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return 'Live / N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
                <Disc className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  {t('music_title')}
                  <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                    {t('music_no_ads')}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">{t('music_subtitle')}</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center px-6 border-b border-slate-800/60 bg-slate-950/40">
            <button
              onClick={() => { setActiveTab('playlists'); setSelectedPlaylist(null); }}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'playlists' && !selectedPlaylist
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListMusic className="w-4 h-4" />
              {t('music_tab_playlists')}
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'search'
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-4 h-4" />
              {t('music_tab_search')}
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* TAB 1: PLAYLISTS */}
            {activeTab === 'playlists' && (
              <div>
                {selectedPlaylist ? (
                  /* Playlist Track List View */
                  <div>
                    <button
                      onClick={() => setSelectedPlaylist(null)}
                      className="mb-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-all"
                    >
                      {t('music_back_playlists')}
                    </button>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-5 p-5 bg-slate-800/40 border border-slate-800 rounded-xl mb-6">
                      <img
                        src={selectedPlaylist.coverUrl}
                        alt={selectedPlaylist.title}
                        className="w-24 h-24 rounded-lg object-cover shadow-lg border border-slate-700/50"
                      />
                      <div className="flex-1">
                        <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                          {selectedPlaylist.category}
                        </span>
                        <h3 className="text-xl font-bold text-slate-100 mt-1">{selectedPlaylist.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{selectedPlaylist.description}</p>
                      </div>
                      <button
                        onClick={() => playPlaylist(selectedPlaylist)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        {t('music_play_all')} ({selectedPlaylist.tracks.length})
                      </button>
                    </div>

                    {/* Track Table */}
                    <div className="space-y-2">
                      {selectedPlaylist.tracks.map((track, idx) => {
                        const isCurrent = currentTrack?.id === track.id;
                        return (
                          <div
                            key={track.id || idx}
                            onClick={() => playTrack(track, selectedPlaylist.tracks, idx)}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-indigo-600/15 border-indigo-500/40 text-slate-100'
                                : 'bg-slate-800/30 border-slate-800/60 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className="text-xs font-semibold text-slate-500 w-5 text-center">{idx + 1}</span>
                              <img
                                src={track.thumbnailUrl}
                                alt={track.title}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-700/50"
                              />
                              <div className="min-w-0">
                                <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-indigo-400' : 'text-slate-200'}`}>
                                  {track.title}
                                </h4>
                                <p className="text-xs text-slate-400 truncate">{track.uploader}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400">{formatDuration(track.durationSeconds)}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isCurrent) {
                                    togglePlay();
                                  } else {
                                    playTrack(track, selectedPlaylist.tracks, idx);
                                  }
                                }}
                                className={`p-2 rounded-lg transition-all ${
                                  isCurrent
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-slate-700/50 text-slate-300 hover:bg-indigo-600 hover:text-white'
                                }`}
                              >
                                {isCurrent && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Grid Playlists View */
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      {t('music_suggested_title')}
                    </h3>

                    {isLoadingPlaylists ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                        <p className="text-xs text-slate-400">{t('music_loading_playlists')}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {playlists.map((pl) => (
                          <div
                            key={pl.id}
                            onClick={() => setSelectedPlaylist(pl)}
                            className="group relative bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-4 transition-all duration-300 cursor-pointer flex gap-4"
                          >
                            <img
                              src={pl.coverUrl}
                              alt={pl.title}
                              className="w-24 h-24 rounded-lg object-cover shadow-md border border-slate-700/50 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                                  {pl.category}
                                </span>
                                <h4 className="text-sm font-bold text-slate-100 mt-1 truncate group-hover:text-indigo-400 transition-colors">
                                  {pl.title}
                                </h4>
                                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{pl.description}</p>
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium">{pl.tracks.length} {t('music_tracks_count')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SEARCH */}
            {activeTab === 'search' && (
              <div>
                <form onSubmit={handleSearchSubmit} className="mb-6">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('music_search_placeholder')}
                      className="w-full pl-12 pr-28 py-3.5 bg-slate-800/60 border border-slate-700/80 rounded-xl text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isSearching || !searchQuery.trim()}
                      className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-all"
                    >
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : t('music_search_btn')}
                    </button>
                  </div>
                </form>

                {/* Search Results */}
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                    <p className="text-xs text-slate-400">{t('music_searching')}</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      {t('music_search_results')} ({searchResults.length})
                    </h4>
                    {searchResults.map((track, idx) => {
                      const isCurrent = currentTrack?.id === track.id;
                      return (
                        <div
                          key={track.id || idx}
                          onClick={() => playTrack(track, searchResults, idx)}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-indigo-600/15 border-indigo-500/40 text-slate-100'
                              : 'bg-slate-800/30 border-slate-800/60 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={track.thumbnailUrl}
                              alt={track.title}
                              className="w-11 h-11 rounded-lg object-cover border border-slate-700/50"
                            />
                            <div className="min-w-0">
                              <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-indigo-400' : 'text-slate-200'}`}>
                                {track.title}
                              </h4>
                              <p className="text-xs text-slate-400 truncate">{track.uploader}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">{formatDuration(track.durationSeconds)}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isCurrent) {
                                  togglePlay();
                                } else {
                                  playTrack(track, searchResults, idx);
                                }
                              }}
                              className={`p-2 rounded-lg transition-all ${
                                isCurrent
                                  ? 'bg-indigo-600 text-white shadow-md'
                                  : 'bg-slate-700/50 text-slate-300 hover:bg-indigo-600 hover:text-white'
                              }`}
                            >
                              {isCurrent && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : hasSearched ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    {t('music_no_results')}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    {t('music_search_hint')}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
