import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldAlert, LogIn, UserPlus, Flame, Sun, Moon } from 'lucide-react';

export default function Login({ onToggleView, onBackToLanding }) {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || t('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Settings Panel (Theme & Language Toggle) */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-900/50 hover:bg-slate-900 text-slate-300 border border-slate-800/80 backdrop-blur-md rounded-2xl px-3 py-2 text-sm font-semibold outline-none cursor-pointer hover:text-indigo-500 transition-colors shadow-lg"
          title={t('language')}
        >
          <option value="vi" className="bg-slate-950 text-slate-300">Tiếng Việt</option>
          <option value="en" className="bg-slate-950 text-slate-300">English</option>
          <option value="zh" className="bg-slate-950 text-slate-300">简体中文</option>
        </select>

        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-indigo-500 border border-slate-800/80 backdrop-blur-md transition-colors flex items-center justify-center cursor-pointer shadow-lg"
          title={theme === 'light' ? t('theme_dark') : t('theme_light')}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-indigo-600" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          )}
        </button>
      </div>

      {/* Decorative gradient glowing balls */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md glass-panel glass-panel-glow rounded-3xl p-8 z-10 relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 animate-bounce-slow">
            <Flame className="w-8 h-8 text-white fill-white/20" />
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text-gradient-start to-text-gradient-end tracking-tight">
            {t('login_title')}
          </h2>
          <p className="text-slate-400 mt-2 text-sm text-center">
            {t('login_subtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 text-sm rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="ten@vi-du.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t('password')}
            </label>
            <input
              type="password"
              required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{t('login_btn')}</span>
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-900/50 flex flex-col gap-3 text-center text-sm text-slate-400">
          <div>
            {t('no_account')}{' '}
            <button
              onClick={onToggleView}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              {t('create_account')} <UserPlus className="w-4 h-4" />
            </button>
          </div>
          <div>
            <button
              onClick={onBackToLanding}
              className="text-slate-500 hover:text-slate-350 font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              &larr; {t('landing_back_to_home')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
