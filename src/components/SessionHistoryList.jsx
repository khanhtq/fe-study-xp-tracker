import React, { memo } from 'react';
import { History, Calendar, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import StudyCalendar from './StudyCalendar';

function SessionHistoryList({ sessions }) {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  
  const formatDuration = (secs) => {
    if (!secs) return '0s';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);
    
    return parts.join(' ');
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const localeMap = { vi: 'vi-VN', en: 'en-US', zh: 'zh-CN' };
      const locale = localeMap[language] || 'vi-VN';
      return date.toLocaleString(locale, {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Group by day for the chart data
  const getChartData = () => {
    const dailyData = {};
    
    // Process sessions in chronological order
    [...sessions].reverse().forEach(session => {
      if (!session.endedAt) return;
      const date = new Date(session.startedAt);
      const localeMap = { vi: 'vi-VN', en: 'en-US', zh: 'zh-CN' };
      const locale = localeMap[language] || 'vi-VN';
      const dayKey = date.toLocaleDateString(locale, { month: 'numeric', day: 'numeric' });
      
      const durationMins = Math.round(session.durationSeconds / 60);
      dailyData[dayKey] = (dailyData[dayKey] || 0) + durationMins;
    });

    return Object.entries(dailyData).map(([date, mins]) => ({
      date,
      [t('chart_minutes_label')]: mins,
    })).slice(-7); // Last 7 active days
  };

  const chartData = getChartData();

  return (
    <div className="w-full space-y-6">
      {/* Visual Chart Panel */}
      {sessions.length > 0 && chartData.length > 0 && (
        <div className="w-full glass-panel rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            {t('chart_title')}
          </h3>
          
          <div className="w-full h-48 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} unit="m" />
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                    borderColor: theme === 'dark' ? '#334155' : '#cbd5e1', 
                    borderRadius: '12px',
                    color: theme === 'dark' ? '#f1f5f9' : '#0f172a'
                  }}
                  labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#475569', fontWeight: 'bold' }}
                />
                <Bar dataKey={t('chart_minutes_label')} fill="url(#colorMinutes)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* GitHub-style Study Calendar */}
      <StudyCalendar sessions={sessions} />

      {/* History List Panel */}
      <div className="w-full glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-purple-400" />
          {t('history_title')}
        </h3>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium">{t('no_sessions')}</p>
            <p className="text-xs text-slate-600 mt-1">{t('no_sessions_subtitle')}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-slate-200 truncate">
                      {session.subject || t('timer_placeholder')}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      session.source === 'TIMER' 
                        ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' 
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    }`}>
                      {session.source === 'TIMER' ? t('source_timer') : t('source_manual')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(session.durationSeconds)}
                    </span>
                    <span>•</span>
                    <span>{formatDate(session.startedAt)}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {session.xpEarned !== null ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 font-extrabold text-sm border border-indigo-500/20">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      +{session.xpEarned} XP
                    </span>
                  ) : (
                    <span className="text-xs text-indigo-400 font-semibold animate-pulse">
                      {t('timer_counting')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SessionHistoryList);
