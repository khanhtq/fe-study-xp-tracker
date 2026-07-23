import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { sessionApi } from '../api';
import XpBar from '../components/XpBar';
import StudyTimer from '../components/StudyTimer';
import ManualSessionForm from '../components/ManualSessionForm';
import SessionHistoryList from '../components/SessionHistoryList';
import OnlineUsersList from '../components/OnlineUsersList';
import Footer from '../components/Footer';
import { LogOut, User, Flame, X, Sun, Moon, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const calculateXpEarned = (durationSeconds) => {
  const minutes = durationSeconds / 60;
  const baseXp = minutes * 10;
  if (durationSeconds >= 1500) {
    return Math.round(baseXp * 1.1);
  }
  return Math.round(baseXp);
};

export default function Dashboard({ onNavigateAdmin, onNavigateRegister }) {
  const { user, progress, logout, refreshProgress, activeSession } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sessionToast, setSessionToast] = useState(null);
  const [liveXpProgress, setLiveXpProgress] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await sessionApi.getHistory();
      setSessions(data);
    } catch (err) {
      console.error('Lỗi tải lịch sử:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (!activeSession) {
      setLiveXpProgress(null);
      return;
    }

    const getXpRequiredForNextLevel = (level) => {
      return Math.round(100 * Math.pow(level, 1.5));
    };

    const updateLiveXp = () => {
      const start = new Date(activeSession.startedAt);
      const now = new Date();
      const elapsedSeconds = Math.max(0, Math.floor((now - start) / 1000));
      const xpEarned = calculateXpEarned(elapsedSeconds);
      
      let tempXp = (progress?.currentXp ?? 0) + xpEarned;
      let tempLevel = progress?.currentLevel ?? 1;
      
      while (true) {
        const xpRequired = getXpRequiredForNextLevel(tempLevel);
        if (tempXp >= xpRequired) {
          tempXp -= xpRequired;
          tempLevel++;
        } else {
          break;
        }
      }

      const xpRequiredForNextLevel = getXpRequiredForNextLevel(tempLevel);

      setLiveXpProgress({
        currentLevel: tempLevel,
        currentXp: tempXp,
        xpRequiredForNextLevel,
        totalXp: (progress?.totalXp ?? 0) + xpEarned,
      });
    };

    updateLiveXp();
    const interval = setInterval(updateLiveXp, 1000);
    return () => clearInterval(interval);
  }, [activeSession, progress]);

  const handleStopResult = useCallback((result) => {
    // Show XP earned toast
    setSessionToast({
      subject: result.subject || t('timer_placeholder'),
      durationSeconds: result.durationSeconds,
      xpEarned: result.xpEarned,
    });

    // Refresh history
    fetchHistory();

    // Auto-hide session toast after 5 seconds
    setTimeout(() => {
      setSessionToast(null);
    }, 5000);
  }, [fetchHistory, t]);

  const handleManualSuccess = useCallback((newSession) => {
    fetchHistory();
    setSessionToast({
      subject: newSession.subject || t('timer_placeholder'),
      durationSeconds: newSession.durationSeconds,
      xpEarned: newSession.xpEarned,
    });
    setTimeout(() => {
      setSessionToast(null);
    }, 5000);

    refreshProgress();
  }, [fetchHistory, refreshProgress, t]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12 relative overflow-hidden">
      {/* Decorative gradient glowing balls */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Flame className="w-5 h-5 text-white fill-white/20" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-text-gradient-start to-text-gradient-end">
              Study XP Tracker
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user?.role === 'ROLE_ADMIN' && (
              <button
                onClick={onNavigateAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin</span>
              </button>
            )}

            {user?.isGuest && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  {t('guest_badge')}
                </span>
                <button
                  onClick={onNavigateRegister}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  <span>{t('guest_register_cta')}</span>
                </button>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-1.5 text-sm">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300 font-semibold">{user?.displayName}</span>
            </div>

            {/* Language Selector Dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-2xl px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer hover:text-indigo-500 transition-colors"
              title={t('language')}
            >
              <option value="vi" className="bg-slate-950 text-slate-300">Tiếng Việt</option>
              <option value="en" className="bg-slate-950 text-slate-300">English</option>
              <option value="zh" className="bg-slate-950 text-slate-300">简体中文</option>
            </select>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-500 border border-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              title={theme === 'light' ? t('theme_dark') : t('theme_light')}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-indigo-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              )}
            </button>
            
            <button
              onClick={async () => {
                setIsLoggingOut(true);
                await logout();
              }}
              disabled={isLoggingOut}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{isLoggingOut ? t('loading') || '...' : t('logout')}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* XP Progress Bar */}
        {(liveXpProgress || progress) && (
          <XpBar
            currentLevel={liveXpProgress?.currentLevel ?? progress.currentLevel}
            currentXp={liveXpProgress?.currentXp ?? progress.currentXp}
            xpRequiredForNextLevel={liveXpProgress?.xpRequiredForNextLevel ?? progress.xpRequiredForNextLevel}
            totalXp={liveXpProgress?.totalXp ?? progress.totalXp}
          />
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Timer & Manual Log */}
          <div className="lg:col-span-1 space-y-8">
            <StudyTimer onStopResult={handleStopResult} />
            <ManualSessionForm onSuccess={handleManualSuccess} />
            <OnlineUsersList />
          </div>

          {/* Right Column: Statistics & History */}
          <div className="lg:col-span-2">
            {loadingHistory ? (
              <div className="glass-panel rounded-3xl p-12 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : (
              <SessionHistoryList 
                sessions={sessions} 
                isGuest={user?.isGuest} 
                onNavigateRegister={onNavigateRegister} 
              />
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Session Result Toast */}
      <AnimatePresence>
        {sessionToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
          >
            <div className="glass-panel glass-panel-glow border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-wider block">{t('session_completed')}</span>
                <span className="font-bold text-slate-200">{sessionToast.subject}</span>
                <span className="text-xs text-slate-400 ml-2">({Math.round(sessionToast.durationSeconds / 60)} {t('minutes')})</span>
              </div>
              
              <div className="shrink-0 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 font-black text-sm border border-indigo-500/20">
                  +{sessionToast.xpEarned} XP
                </span>
                <button
                  onClick={() => setSessionToast(null)}
                  className="p-1 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
