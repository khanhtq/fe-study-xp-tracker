import React, { useState, useEffect, useRef, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { sessionApi, getServerClientOffset } from '../api';
import { Play, Square, BookOpen, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function StudyTimer({ onStopResult }) {
  const { activeSession, setActiveSession, refreshProgress } = useAuth();
  const { t } = useLanguage();
  const [subject, setSubject] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const timerRef = useRef(null);

  const [localOffset, setLocalOffset] = useState(0);

  // Resume or start timer based on activeSession in AuthContext
  useEffect(() => {
    if (activeSession) {
      setSubject(activeSession.subject || '');
      
      const getOffset = () => {
        return localOffset !== 0 ? localOffset : getServerClientOffset();
      };

      // Calculate elapsed time from server start time adjusted for server-client clock drift
      const calculateElapsed = () => {
        const start = new Date(activeSession.startedAt).getTime();
        const now = Date.now() - getOffset();
        const diff = Math.max(0, Math.floor((now - start) / 1000));
        setSeconds(diff);
      };

      calculateElapsed();
      
      // Update timer every second
      timerRef.current = setInterval(() => {
        const start = new Date(activeSession.startedAt).getTime();
        const now = Date.now() - getOffset();
        setSeconds(Math.max(0, Math.floor((now - start) / 1000)));
      }, 1000);
    } else {
      setSeconds(0);
      setLocalOffset(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeSession, localOffset]);

  const handleStart = async (e) => {
    e.preventDefault();
    setIsStarting(true);
    try {
      const clientStartTime = Date.now();
      const session = await sessionApi.start(subject);
      
      // Calculate start offset to avoid latency/clock drift issues when starting in current browser tab
      const serverStartTime = new Date(session.startedAt).getTime();
      const offset = clientStartTime - serverStartTime;
      setLocalOffset(offset);
      
      setActiveSession(session);
    } catch (err) {
      console.error(err);
      alert(err.message || t('timer_start_error'));
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async () => {
    if (!activeSession) return;
    setIsStopping(true);
    try {
      const result = await sessionApi.stop(activeSession.id);
      setActiveSession(null);
      setSubject('');
      await refreshProgress();
      if (onStopResult) {
        onStopResult(result);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || t('timer_stop_error'));
    } finally {
      setIsStopping(false);
    }
  };

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6 self-start">
        <Clock className="w-5 h-5 text-purple-400" />
        {t('timer_title')}
      </h3>

      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Animated ticking display */}
        <div className="relative w-64 h-64 rounded-full border-4 border-slate-800/80 bg-slate-950 flex flex-col items-center justify-center mb-8 shadow-inner">
          {/* Glowing pulse rings when active */}
          {activeSession && (
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full border border-purple-500/50 pointer-events-none"
            />
          )}

          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-indigo-200 tracking-tight tabular-nums">
            {formatTime(seconds)}
          </span>
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-2">
            {activeSession ? t('timer_counting') : t('timer_ready')}
          </span>
        </div>

        {/* Input Subject Form or Label */}
        <AnimatePresence mode="wait">
          {!activeSession ? (
            <motion.form
              key="start-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleStart}
              className="w-full space-y-4"
            >
              <div className="relative">
                <BookOpen className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder={t('timer_input_placeholder')}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isStarting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isStarting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Play className="w-5 h-5 text-white fill-white" />
                    <span>{t('timer_btn_start')}</span>
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="stop-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full text-center space-y-4"
            >
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 inline-block w-full">
                <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">{t('timer_active_desc')}</span>
                <span className="text-lg font-bold text-indigo-300">
                  {activeSession.subject || t('timer_placeholder')}
                </span>
              </div>

              <button
                onClick={handleStop}
                disabled={isStopping}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-red-500/10 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isStopping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Square className="w-4 h-4 text-white fill-white" />
                    <span>{t('btn_stop')}</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(StudyTimer);
