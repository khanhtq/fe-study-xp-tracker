import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { sessionApi } from '../api';
import XpBar from '../components/XpBar';
import StudyTimer from '../components/StudyTimer';
import ManualSessionForm from '../components/ManualSessionForm';
import SessionHistoryList from '../components/SessionHistoryList';
import { LogOut, User, Flame, Sparkles, X, Sun, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const calculateXpEarned = (durationSeconds) => {
  const minutes = durationSeconds / 60;
  const baseXp = minutes * 10;
  if (durationSeconds >= 1500) {
    return Math.round(baseXp * 1.1);
  }
  return Math.round(baseXp);
};

export default function Dashboard() {
  const { user, progress, logout, refreshProgress, activeSession } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sessions, setSessions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sessionToast, setSessionToast] = useState(null);
  const [levelUpModal, setLevelUpModal] = useState(null);
  const [liveXpProgress, setLiveXpProgress] = useState(null);

  const fetchHistory = async () => {
    try {
      const data = await sessionApi.getHistory();
      setSessions(data);
    } catch (err) {
      console.error('Lỗi tải lịch sử:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!activeSession) {
      setLiveXpProgress(null);
      return;
    }

    const updateLiveXp = () => {
      const start = new Date(activeSession.startedAt);
      const now = new Date();
      const elapsedSeconds = Math.max(0, Math.floor((now - start) / 1000));
      const xpEarned = calculateXpEarned(elapsedSeconds);
      const currentXp = (progress?.currentXp ?? 0) + xpEarned;
      const currentLevel = progress?.currentLevel ?? 1;
      const xpRequiredForNextLevel = progress?.xpRequiredForNextLevel ?? 100;

      setLiveXpProgress({
        currentLevel,
        currentXp,
        xpRequiredForNextLevel,
        totalXp: (progress?.totalXp ?? 0) + xpEarned,
      });
    };

    updateLiveXp();
    const interval = setInterval(updateLiveXp, 1000);
    return () => clearInterval(interval);
  }, [activeSession, progress]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleStopResult = (result) => {
    // Show XP earned toast
    setSessionToast({
      subject: result.subject || 'Tự do / Khác',
      durationSeconds: result.durationSeconds,
      xpEarned: result.xpEarned,
    });

    // Refresh history
    fetchHistory();

    // Trigger level up modal & confetti
    if (result.leveledUp) {
      setLevelUpModal({
        levelBefore: result.levelBefore,
        levelAfter: result.levelAfter,
      });
      triggerConfetti();
    }

    // Auto-hide session toast after 5 seconds
    setTimeout(() => {
      setSessionToast(null);
    }, 5000);
  };

  const handleManualSuccess = (newSession) => {
    fetchHistory();
    setSessionToast({
      subject: newSession.subject || 'Tự do / Khác',
      durationSeconds: newSession.durationSeconds,
      xpEarned: newSession.xpEarned,
    });
    setTimeout(() => {
      setSessionToast(null);
    }, 5000);

    // If manual logging causes level up, user progress in AuthContext gets updated.
    // However, if we want to check if they leveled up from manual session, we can compare
    // current level in AuthContext before and after. For simplicity, just refresh progress.
    refreshProgress();
  };

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
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-1.5 text-sm">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300 font-semibold">{user?.displayName}</span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-500 border border-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              title={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-indigo-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              )}
            </button>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
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
          </div>

          {/* Right Column: Statistics & History */}
          <div className="lg:col-span-2">
            {loadingHistory ? (
              <div className="glass-panel rounded-3xl p-12 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : (
              <SessionHistoryList sessions={sessions} />
            )}
          </div>
        </div>
      </main>

      {/* Level Up Modal / Dialog */}
      <AnimatePresence>
        {levelUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass-panel glass-panel-glow rounded-3xl p-8 text-center relative overflow-hidden"
            >
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

              <button
                onClick={() => setLevelUpModal(null)}
                className="absolute top-4 right-4 p-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/25 relative animate-bounce">
                <Sparkles className="w-10 h-10 text-slate-950 fill-slate-950/20" />
              </div>

              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 tracking-tight">
                LEVEL UP!
              </h2>
              
              <p className="text-slate-400 mt-2 text-sm">
                Chúc mừng bạn đã thăng tiến thành công lên một đẳng cấp mới!
              </p>

              <div className="flex items-center justify-center gap-6 my-8">
                <div className="text-center">
                  <span className="text-slate-500 text-xs uppercase tracking-widest block mb-1">Cấp cũ</span>
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl font-bold text-slate-400">
                    {levelUpModal.levelBefore}
                  </div>
                </div>
                <div className="text-slate-600 text-2xl font-bold">➔</div>
                <div className="text-center">
                  <span className="text-indigo-400 text-xs uppercase tracking-widest block mb-1">Cấp mới</span>
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-2xl font-extrabold text-indigo-300 shadow-inner">
                    {levelUpModal.levelAfter}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setLevelUpModal(null)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
              >
                Tiếp tục học tập
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-wider block">Học tập hoàn thành</span>
                <span className="font-bold text-slate-200">{sessionToast.subject}</span>
                <span className="text-xs text-slate-400 ml-2">({Math.round(sessionToast.durationSeconds / 60)} phút)</span>
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
