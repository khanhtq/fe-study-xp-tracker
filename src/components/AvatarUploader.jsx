import React, { useState } from 'react';
import { Upload, User, RefreshCw, X, Check } from 'lucide-react';

// Cartoon & RPG Preset Avatars collection using SVG Data URIs / DiceBear collections
const CARTOON_PRESETS = [
  { id: 'wizard', name: 'Pháp Sư Tri Thức', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=WizardMind&backgroundColor=b6e3f4' },
  { id: 'knight', name: 'Hiệp Sĩ Tập Trung', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=FocusKnight&backgroundColor=ffdfbf' },
  { id: 'owl', name: 'Cú Đêm Học Nốt', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NightOwlStudy&backgroundColor=c0aede' },
  { id: 'cat_gamer', name: 'Mèo Học Thuật', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=GamerCat&backgroundColor=ffd5dc' },
  { id: 'ninja', name: 'Ninja Pomodoro', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=PomoNinja&backgroundColor=d1d4f9' },
  { id: 'fox_reader', name: 'Cáo Đọc Sách', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=FoxScholar&backgroundColor=b6e3f4' },
  { id: 'cyber_student', name: 'Cyberpunk Scholar', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberStudent&backgroundColor=ffdfbf' },
  { id: 'astro_pup', name: 'Phi Hành Gia XP', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AstroXP&backgroundColor=c0aede' },
  { id: 'dragon_master', name: 'Chủ Nhân Linh Thú', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DragonScholar&backgroundColor=d1d4f9' },
  { id: 'smart_bear', name: 'Gấu Thông Thái', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=SmartBear&backgroundColor=ffd5dc' },
  { id: 'anime_sage', name: 'Hiền Triết Anime', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=AnimeSage&backgroundColor=b6e3f4' },
  { id: 'pioneer', name: 'Tiên Phong Học Tập', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PioneerXP&backgroundColor=ffdfbf' },
];

const DICEBEAR_STYLES = [
  { id: 'adventurer', name: 'Phi Phiêu Lưu (Adventurer)' },
  { id: 'bottts', name: 'Robot Hoạt Hình (Bottts)' },
  { id: 'lorelei', name: 'Anime / Manga (Lorelei)' },
  { id: 'avataaars', name: 'Giao Diện Hiện Đại (Avataaars)' },
];

export default function AvatarUploader({ currentAvatarUrl, onUploadFile, onSelectPreset, isLoading }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'preset' | 'dicebear'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diceStyle, setDiceStyle] = useState('adventurer');
  const [diceSeed, setDiceSeed] = useState('StudyXP_' + Math.floor(Math.random() * 1000));
  const [dragActive, setDragActive] = useState(false);

  // Compress image on client canvas before sending
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            0.85
          );
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      setSelectedFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const compressed = await compressImage(file);
      setSelectedFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      onUploadFile(selectedFile);
    }
  };

  const generateRandomSeed = () => {
    setDiceSeed('StudyXP_' + Math.floor(Math.random() * 10000));
  };

  const diceBearUrl = `https://api.dicebear.com/7.x/${diceStyle}/svg?seed=${encodeURIComponent(diceSeed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  const getFullAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const backendOrigin = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8080';
    return `${backendOrigin}${url}`;
  };

  const displayAvatar = previewUrl || getFullAvatarUrl(currentAvatarUrl);

  return (
    <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        {/* Avatar Display Frame */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-full ring-4 ring-indigo-500/30 p-1 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=UserFallback`;
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>
          {previewUrl && (
            <button
              onClick={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
              }}
              className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md transition-all cursor-pointer"
              title="Hủy chọn file"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-slate-100 mb-1">Ảnh Đại Diện</h3>
          <p className="text-slate-400 text-sm mb-3">
            Tải ảnh từ thiết bị của bạn hoặc chọn nhanh từ kho Avatar Hoạt Hình RPG.
          </p>

          {/* Navigation Tabs */}
          <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Tải Ảnh Lên
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Kho Avatar RPG
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dicebear')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'dicebear'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Tạo Ngẫu Nhiên
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Upload File */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-800 hover:border-slate-600 bg-slate-950/50'
            }`}
          >
            <input
              type="file"
              id="avatar-file-input"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="avatar-file-input" className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="w-8 h-8 text-indigo-500 mb-2" />
              <p className="text-slate-100 text-sm font-semibold">
                {selectedFile ? selectedFile.name : 'Kéo thả file vào đây hoặc bấm để tải lên'}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Hỗ trợ PNG, JPG, WEBP (nén tự động dưới 5MB)
              </p>
            </label>
          </div>

          {selectedFile && (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
              >
                Hủy Chọn
              </button>
              <button
                type="button"
                onClick={handleConfirmUpload}
                disabled={isLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isLoading ? 'Đang lưu...' : 'Lưu Ảnh Đại Diện'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Cartoon RPG Presets */}
      {activeTab === 'preset' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">Chọn 1 avatar hoạt hình phong cách RPG dưới đây:</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {CARTOON_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.url)}
                disabled={isLoading}
                className="group relative p-2 bg-slate-950/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/60 rounded-2xl transition-all flex flex-col items-center gap-1.5 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-950 p-0.5 border border-slate-800 group-hover:scale-105 transition-transform">
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-[11px] font-semibold text-slate-300 group-hover:text-indigo-400 line-clamp-1">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: DiceBear Random Generator */}
      {activeTab === 'dicebear' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phong Cách (Style):</label>
              <select
                value={diceStyle}
                onChange={(e) => setDiceStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {DICEBEAR_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Từ Khóa (Seed / Tên):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={diceSeed}
                  onChange={(e) => setDiceSeed(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={generateRandomSeed}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                  title="Tạo từ khóa ngẫu nhiên"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tạo Mới</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <img src={diceBearUrl} alt="Generated Avatar" className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800" />
              <span className="text-xs text-slate-300 font-medium">Xem trước avatar tạo ra</span>
            </div>
            <button
              type="button"
              onClick={() => onSelectPreset(diceBearUrl)}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Chọn Avatar Này
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
