import React, { useState } from 'react';
import { sessionApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Plus, BookOpen, Clock, Loader2 } from 'lucide-react';

export default function ManualSessionForm({ onSuccess }) {
  const { refreshProgress } = useAuth();
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [startedAt, setStartedAt] = useState(() => {
    // Default to current date/time formatted for datetime-local input
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const h = parseInt(hours || '0', 10);
    const m = parseInt(minutes || '0', 10);
    const durationSeconds = (h * 3600) + (m * 60);

    if (durationSeconds <= 0) {
      setError('Thời gian học phải lớn hơn 0 phút.');
      return;
    }

    setLoading(true);
    try {
      // API expects ISO string format. E.g. "2026-07-20T19:00:00"
      const session = await sessionApi.createManual(subject, durationSeconds, startedAt);
      setSubject('');
      setHours('');
      setMinutes('');
      await refreshProgress();
      if (onSuccess) {
        onSuccess(session);
      }
    } catch (err) {
      setError(err.message || 'Không thể lưu buổi học.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6">
        <Plus className="w-5 h-5 text-indigo-400" />
        Nhập Thời Gian Học Thủ Công
      </h3>

      {error && (
        <div className="mb-4 text-xs bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl p-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Môn học / Chủ đề
          </label>
          <div className="relative">
            <BookOpen className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Toán, Lý, Lập trình..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>

        {/* Duration (Hours & Minutes) */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Thời lượng đã học
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Clock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="number"
                min="0"
                placeholder="Giờ"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div className="relative">
              <Clock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="number"
                min="0"
                max="59"
                placeholder="Phút"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Thời điểm bắt đầu
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="datetime-local"
              required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-2xl transition-all border border-slate-700/50 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5 text-indigo-400" />
              <span>Ghi nhận thời gian học</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
