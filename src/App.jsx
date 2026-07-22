import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import SEO from './components/SEO';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function MainApp() {
  const { user, token, loading } = useAuth();
  const [view, setView] = useState('landing');
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <SEO view="landing" />
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">{t('loading_account')}</span>
        </div>
      </div>
    );
  }

  const activeView = token ? (view === 'admin' ? 'admin' : 'dashboard') : view;

  return (
    <>
      <SEO view={activeView} />
      {!token ? (
        view === 'login' ? (
          <Login 
            onToggleView={() => setView('register')} 
            onBackToLanding={() => setView('landing')} 
          />
        ) : view === 'register' ? (
          <Register 
            onToggleView={() => setView('login')} 
            onBackToLanding={() => setView('landing')} 
          />
        ) : (
          <Landing onNavigate={setView} />
        )
      ) : view === 'admin' && user?.role === 'ROLE_ADMIN' ? (
        <AdminDashboard onBackToDashboard={() => setView('dashboard')} />
      ) : (
        <Dashboard onNavigateAdmin={() => setView('admin')} />
      )}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
