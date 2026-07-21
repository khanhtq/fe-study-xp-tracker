import React, { useState, useEffect, memo } from 'react';
import { userApi } from '../api';
import { Users, BookOpen, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function OnlineUserRow({ user }) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    if (!user.isStudying || !user.studyStartedAt) {
      setElapsed('');
      return;
    }

    const calculateElapsed = () => {
      const start = new Date(user.studyStartedAt).getTime();
      const now = Date.now();
      const diffSeconds = Math.max(0, Math.floor((now - start) / 1000));

      const hrs = Math.floor(diffSeconds / 3600);
      const mins = Math.floor((diffSeconds % 3600) / 60);
      const secs = diffSeconds % 60;

      if (hrs > 0) {
        setElapsed(`${hrs}h ${mins}m ${secs}s`);
      } else {
        setElapsed(`${mins}m ${secs}s`);
      }
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [user.isStudying, user.studyStartedAt]);

  const initials = user.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-800/40 hover:border-slate-700/60 transition-all gap-3">
      <div className="flex items-center gap-3">
        {/* Avatar with status indicator */}
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-indigo-950 border border-slate-700/50 flex items-center justify-center font-bold text-sm text-indigo-300">
            {initials}
          </div>
          {/* Status Dot */}
          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
            user.isStudying
              ? 'bg-emerald-500 animate-[pulse_1.5s_infinite]'
              : 'bg-indigo-400'
          }`} />
        </div>

        <div>
          <span className="font-semibold text-sm text-slate-200 flex items-center gap-1.5">
            <span>{user.displayName}</span>
            {user.currentLevel && (
              <span className="px-1.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-extrabold text-[10px] border border-indigo-500/20">
                Lv.{user.currentLevel}
              </span>
            )}
          </span>
          {user.isStudying ? (
            <span className="text-[11px] text-indigo-300 font-medium flex items-center gap-1 mt-0.5">
              <BookOpen className="w-3 h-3 text-indigo-400" />
              Đang học: {user.currentSubject || 'Tự do / Khác'}
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              Đang hoạt động (Rảnh)
            </span>
          )}
        </div>
      </div>

      {user.isStudying && elapsed && (
        <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black tracking-tight tabular-nums">
          <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
          {elapsed}
        </div>
      )}
    </div>
  );
}

function OnlineUsersList() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOnlineUsers = async () => {
    try {
      const data = await userApi.getOnline();
      // Sort users: studying first, then by name
      const sorted = [...data].sort((a, b) => {
        if (a.isStudying && !b.isStudying) return -1;
        if (!a.isStudying && b.isStudying) return 1;
        return a.displayName.localeCompare(b.displayName);
      });
      setOnlineUsers(sorted);
    } catch (err) {
      console.error('Lỗi tải danh sách online:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-xl font-bold text-slate-100 flex items-center justify-between mb-4">
        <span className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          Bạn Bè Học Tập
        </span>
        <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-900 border border-slate-800 rounded-full text-slate-400">
          {onlineUsers.length} Online
        </span>
      </h3>

      {loading && onlineUsers.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : onlineUsers.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          Không có ai online
        </div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
          <AnimatePresence initial={false}>
            {onlineUsers.map(user => (
              <motion.div
                key={user.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <OnlineUserRow user={user} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default memo(OnlineUsersList);
