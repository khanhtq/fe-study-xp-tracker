import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { userApi, getErrorMessage } from '../api';
import AvatarUploader from '../components/AvatarUploader';
import SEO from '../components/SEO';
import { Sun, Moon, ArrowLeft, User, Shield, Trophy, Settings, Lock, Check } from 'lucide-react';

export default function Profile({ onBackToDashboard }) {
  const { user, progress, refreshUserProgress } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'titles' | 'preferences'

  // Profile Form state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(60);
  const [favoriteSubjects, setFavoriteSubjects] = useState('');

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences & RPG Titles state
  const [selectedTitle, setSelectedTitle] = useState('Tân Binh Tập Trung');
  const [themeAccent, setThemeAccent] = useState('indigo');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [availableTitles, setAvailableTitles] = useState([]);

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
      setDailyGoalMinutes(user.dailyGoalMinutes || 60);
      setFavoriteSubjects(user.favoriteSubjects || '');
      setSelectedTitle(user.selectedTitle || 'Tân Binh Tập Trung');
      setThemeAccent(user.themeAccent || 'indigo');
      setSoundEnabled(user.soundEnabled !== undefined ? user.soundEnabled : true);
    }
  }, [user]);

  useEffect(() => {
    userApi
      .getAvailableTitles()
      .then((titles) => setAvailableTitles(titles))
      .catch((err) => console.warn('Could not load titles:', err));
  }, []);

  const handleUpdateProfile = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await userApi.updateProfile({
        displayName,
        bio,
        dailyGoalMinutes: parseInt(dailyGoalMinutes, 10),
        favoriteSubjects,
        selectedTitle,
        themeAccent,
        soundEnabled,
      });
      await refreshUserProgress();
      setSuccessMsg('Đã cập nhật thông tin cá nhân thành công.');
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'error_unknown', t));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAvatarFile = async (file) => {
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await userApi.uploadAvatar(file);
      await refreshUserProgress();
      setSuccessMsg('Đã cập nhật ảnh đại diện mới thành công.');
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'error_unknown', t));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPresetAvatar = async (avatarUrl) => {
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await userApi.updateProfile({ avatarUrl });
      await refreshUserProgress();
      setSuccessMsg('Đã thay đổi Avatar thành công.');
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'error_unknown', t));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await userApi.changePassword(currentPassword, newPassword, confirmPassword);
      setSuccessMsg('Đã đổi mật khẩu thành công. Vui lòng ghi nhớ mật khẩu mới.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'error_unknown', t));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTitle = async (titleName) => {
    setSelectedTitle(titleName);
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await userApi.updateProfile({ selectedTitle: titleName });
      await refreshUserProgress();
      setSuccessMsg(`Đã trang bị danh hiệu "${titleName}".`);
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'error_unknown', t));
    } finally {
      setIsLoading(false);
    }
  };

  const getFullAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const backendOrigin = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8080';
    return `${backendOrigin}${url}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <SEO title="Trang Cá Nhân & Cài Đặt - Study XP Tracker" description="Quản lý thông tin tài khoản, avatar, danh hiệu và tùy chỉnh trải nghiệm học tập." />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Back & Theme Navigation */}
        <div className="flex items-center justify-between gap-4">
          {onBackToDashboard ? (
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-indigo-400 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Dashboard</span>
            </button>
          ) : <div />}

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-500 border border-slate-800 transition-all flex items-center justify-center cursor-pointer shadow-md"
            title={theme === 'light' ? t('theme_dark') : t('theme_light')}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-indigo-600" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            )}
          </button>
        </div>

        {/* Header Profile Summary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-indigo-500/30 overflow-hidden bg-slate-950 shadow-xl flex items-center justify-center text-slate-400">
                {user?.avatarUrl ? (
                  <img
                    src={getFullAvatarUrl(user.avatarUrl)}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.displayName || 'User'}`;
                    }}
                  />
                ) : (
                  <User className="w-12 h-12" />
                )}
              </div>
              <span className="absolute bottom-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-950 shadow">
                Lvl {progress?.currentLevel ?? user?.currentLevel ?? 1}
              </span>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{user?.displayName || 'Người dùng'}</h1>
                {user?.selectedTitle && (
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {user.selectedTitle}
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm mt-1 font-medium">{user?.email}</p>
              {user?.bio && <p className="text-slate-300 text-xs mt-2 italic">"{user.bio}"</p>}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 text-xs">
                <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                  Tổng XP: <strong className="text-amber-400">{(progress?.totalXp ?? user?.totalXp ?? 0).toLocaleString()} XP</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                  Mục tiêu ngày: <strong className="text-indigo-400">{user?.dailyGoalMinutes || 60} phút</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Success / Error Toast Messages */}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-4 py-3 rounded-2xl flex items-center justify-between text-sm shadow-lg">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-slate-100 font-bold ml-2 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/40 text-rose-400 px-4 py-3 rounded-2xl flex items-center justify-between text-sm shadow-lg">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-slate-100 font-bold ml-2 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-2 sm:gap-4 pb-2">
          {[
            { id: 'profile', label: 'Hồ Sơ Cá Nhân', icon: User },
            { id: 'security', label: 'Bảo Mật & Mật Khẩu', icon: Lock },
            { id: 'titles', label: 'Danh Hiệu RPG', icon: Trophy },
            { id: 'preferences', label: 'Cài Đặt Trải Nghiệm', icon: Settings },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSuccessMsg('');
                  setErrorMsg('');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Profile Information & Avatar */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <AvatarUploader
              currentAvatarUrl={user?.avatarUrl}
              onUploadFile={handleUploadAvatarFile}
              onSelectPreset={handleSelectPresetAvatar}
              isLoading={isLoading}
            />

            <form onSubmit={handleUpdateProfile} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                <span>Chỉnh Sửa Thông Tin Cá Nhân</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Tên Hiển Thị (Display Name):</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Mục Tiêu Học Tập Hàng Ngày (Phút):</label>
                  <select
                    value={dailyGoalMinutes}
                    onChange={(e) => setDailyGoalMinutes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={30}>30 phút / ngày (Cơ bản)</option>
                    <option value={60}>60 phút / ngày (Tiêu chuẩn)</option>
                    <option value={90}>90 phút / ngày (Tăng tốc)</option>
                    <option value={120}>120 phút / ngày (Chăm chỉ)</option>
                    <option value={180}>180 phút / ngày (Siêu luyện)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Môn Học / Chủ Đề Ưu Thích:</label>
                <input
                  type="text"
                  value={favoriteSubjects}
                  onChange={(e) => setFavoriteSubjects(e.target.value)}
                  placeholder="Ví dụ: Lập trình Java, Tiếng Anh, Toán Cao Cấp..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Tiểu Sử / Câu Trích Dẫn Yêu Thích (Bio):</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={255}
                  placeholder="Chia sẻ mục tiêu học tập hoặc phương châm cá nhân..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <span className="text-[10px] text-slate-400 float-right mt-1">{bio.length}/255 ký tự</span>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: Security & Password Management */}
        {activeTab === 'security' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-500" />
              <span>Quản Lý Bảo Mật & Mật Khẩu</span>
            </h3>

            {user?.authProvider === 'GOOGLE' ? (
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-6 text-center space-y-3">
                <Shield className="w-10 h-10 text-indigo-400 mx-auto" />
                <h4 className="text-slate-100 font-bold text-base">Đăng Nhập Bằng Google</h4>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  Tài khoản này được liên kết và đăng nhập thông qua Google OAuth2. Mật khẩu của bạn được bảo mật tuyệt đối bởi Google.
                </p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Mật Khẩu Hiện Tại:</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Mật Khẩu Mới (Tối thiểu 6 ký tự):</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Xác Nhận Mật Khẩu Mới:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg transition-all cursor-pointer"
                >
                  {isLoading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: RPG Titles & Badges */}
        {activeTab === 'titles' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-500" />
                <span>Danh Hiệu RPG Học Tập</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tăng Level học tập của bạn để mở khóa các danh hiệu độc quyền và trang bị danh hiệu hiển thị công khai!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availableTitles.map((tItem) => {
                const isSelected = selectedTitle === tItem.title;
                return (
                  <div
                    key={tItem.title}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      tItem.unlocked
                        ? isSelected
                          ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/30 border-slate-900 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-100">{tItem.title}</span>
                        {tItem.unlocked ? (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Đã Mở
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-400 font-medium">Cần Lvl {tItem.minLevelRequired}</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mb-4">{tItem.description}</p>
                    </div>

                    {tItem.unlocked && (
                      <button
                        onClick={() => handleSelectTitle(tItem.title)}
                        disabled={isSelected || isLoading}
                        className={`w-full py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white cursor-default'
                            : 'bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Đang Trang Bị' : 'Trang Bị Danh Hiệu'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: UI Preferences */}
        {activeTab === 'preferences' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              <span>Cài Đặt Trải Nghiệm & Giao Diện</span>
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-3">Tông Màu Nổi Bật (Theme Accent):</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: 'indigo', name: 'Indigo (Mặc định)', bg: 'bg-indigo-600' },
                    { id: 'emerald', name: 'Emerald Green', bg: 'bg-emerald-600' },
                    { id: 'rose', name: 'Rose Red', bg: 'bg-rose-600' },
                    { id: 'amber', name: 'Amber Gold', bg: 'bg-amber-600' },
                    { id: 'purple', name: 'Royal Purple', bg: 'bg-purple-600' },
                  ].map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setThemeAccent(color.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        themeAccent === color.id
                          ? 'border-indigo-500 bg-slate-800 text-slate-100 shadow-lg ring-2 ring-indigo-500/50'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${color.bg}`} />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">Hiệu Ứng Âm Thanh (Sound FX)</h4>
                  <p className="text-xs text-slate-400">Phát âm thanh chúc mừng khi hoàn thành Pomodoro hoặc Level Up.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl transition-all cursor-pointer"
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu Cài Đặt'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
