import React, { useState, useEffect } from 'react';
import { userApi } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { X, Award, Flame, Clock, CheckCircle2, BookOpen, Loader2, Sparkles, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getFullAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const backendOrigin = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8080';
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${backendOrigin}${cleanUrl}`;
};

export default function PublicProfileModal({ userId, onClose }) {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setImgErr(false);

    userApi.getPublicProfile(userId)
      .then((data) => {
        if (isMounted) {
          setProfile(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Lỗi tải hồ sơ công khai:', err);
          setError(err.message || 'Không thể tải thông tin hồ sơ.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (!userId) return null;

  const initials = profile?.displayName
    ? profile.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  const formatHours = (minutes) => {
    if (!minutes) return `0 ${t('minutes')}`;
    const hrs = (minutes / 60).toFixed(1);
    return `${hrs} ${t('hour')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto scrollbar-thin">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-lg glass-panel rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden relative my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-all border border-white/20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-indigo-500 dark:text-indigo-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">{t('loading_account')}</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6" />
              </div>
              <p className="text-slate-100 font-semibold mb-2">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-100 text-sm font-medium hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          ) : profile ? (
            <div>
              {/* Header Cover Banner */}
              <div className="h-28 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-900 relative border-b border-slate-800/80 overflow-hidden">
                <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 dark:bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 dark:bg-purple-500/15 rounded-full blur-3xl" />
              </div>

              {/* User Identity Section */}
              <div className="px-6 pb-6 pt-0 relative">
                <div className="flex justify-between items-end -mt-12 mb-4">
                  {/* Avatar */}
                  <div className="relative">
                    {profile.avatarUrl && !imgErr ? (
                      <img
                        src={getFullAvatarUrl(profile.avatarUrl)}
                        alt={profile.displayName}
                        onError={() => setImgErr(true)}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-900 shadow-xl bg-slate-800"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-800 dark:from-indigo-900 dark:to-purple-950 border-4 border-slate-900 shadow-xl flex items-center justify-center font-black text-2xl text-white dark:text-indigo-200">
                        {initials}
                      </div>
                    )}

                    {/* Online status indicator */}
                    <div
                      className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-[10px] font-black border-2 border-slate-900 flex items-center gap-1 shadow-md ${
                        profile.isStudying
                          ? 'bg-emerald-500 text-emerald-950 animate-pulse'
                          : profile.isOnline
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-600 text-slate-100'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {profile.isStudying
                        ? t('member_status_studying')
                        : profile.isOnline
                        ? t('member_status_online')
                        : t('member_status_offline')}
                    </div>
                  </div>

                  {/* Level Pill */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-3.5 py-1 rounded-xl bg-amber-500/10 dark:bg-gradient-to-r dark:from-amber-500/20 dark:to-indigo-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-extrabold text-xs flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('level_short')} {profile.currentLevel || 1}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {profile.currentXp || 0} / {profile.xpRequiredForNextLevel || 100} XP
                    </span>
                  </div>
                </div>

                {/* Display Name & Selected Title */}
                <div className="mb-4">
                  <h3 className="text-2xl font-black text-slate-100 flex items-center gap-2">
                    <span>{profile.displayName}</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{t('title_' + (profile.selectedTitle || 'Tân Binh Tập Trung')) || profile.selectedTitle || 'Tân Binh Tập Trung'}</span>
                  </div>
                </div>

                {/* Active Session Alert (If currently studying) */}
                {profile.isStudying && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {t('member_status_studying')}
                      </p>
                      <p className="text-sm font-semibold text-slate-100">
                        {profile.currentSubject || t('timer_placeholder')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3.5 rounded-2xl bg-slate-950/40 dark:bg-slate-950/50 border border-slate-800/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        {t('member_total_time')}
                      </span>
                      <span className="text-sm font-black text-slate-100">
                        {formatHours(profile.totalStudyTimeMinutes)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/40 dark:bg-slate-950/50 border border-slate-800/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        {t('member_streak')}
                      </span>
                      <span className="text-sm font-black text-amber-700 dark:text-amber-400">
                        {profile.streakDays || 0} {t('days')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/40 dark:bg-slate-950/50 border border-slate-800/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        {t('member_total_sessions')}
                      </span>
                      <span className="text-sm font-black text-slate-100">
                        {profile.totalSessionsCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/40 dark:bg-slate-950/50 border border-slate-800/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        {t('total_xp')}
                      </span>
                      <span className="text-sm font-black text-slate-100">
                        {profile.totalXp || 0} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio / Goal */}
                <div className="p-4 rounded-2xl bg-slate-950/30 dark:bg-slate-950/40 border border-slate-800/60">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    {t('member_bio_title')}
                  </h4>
                  <p className="text-sm text-slate-100 leading-relaxed italic">
                    {profile.studyGoal ? `"${profile.studyGoal}"` : t('member_no_bio')}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
