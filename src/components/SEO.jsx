import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const DOMAIN = 'https://ax-study.vercel.app';

const metaContentByView = {
  landing: {
    vi: {
      title: 'Study XP Tracker - Hệ Thống Theo Dõi Học Tập & Thăng Cấp XP',
      description: 'Study XP Tracker giúp bạn theo dõi thời gian học tập, tích lũy điểm kinh nghiệm (XP), thăng cấp kiểu RPG và duy trì chuỗi học tập hàng ngày. Học tập hiệu quả hơn cùng bạn bè.',
      keywords: 'study tracker, study xp tracker, pomodoro, gamify study, gamification, học tập, theo dõi học tập, thăng cấp học tập, xp tracker, học cùng bạn bè, ax study',
    },
    en: {
      title: 'Study XP Tracker - Gamified Study Tracking & Level Up',
      description: 'Track your study hours, earn XP, level up like an RPG, and maintain daily study streaks with Study XP Tracker. Boost your learning productivity today.',
      keywords: 'study tracker, study xp tracker, pomodoro, gamify study, gamification, learning tracker, study streak, level up study, ax study',
    },
    zh: {
      title: 'Study XP Tracker - 游戏化学习追踪与等级提升',
      description: '使用 Study XP Tracker 记录学习时间、获取经验值 (XP)、像 RPG 游戏一样升级并保持每日学习连续记录。',
      keywords: '学习追踪, 游戏化学习, 番茄钟, 学习 XP, 学习打卡, ax study',
    },
  },
  login: {
    vi: {
      title: 'Đăng Nhập | Study XP Tracker',
      description: 'Đăng nhập vào tài khoản Study XP Tracker để tiếp tục chuỗi học tập và tích lũy XP của bạn.',
      keywords: 'đăng nhập study xp tracker, login study xp',
    },
    en: {
      title: 'Log In | Study XP Tracker',
      description: 'Log in to your Study XP Tracker account to continue your study streak and earn XP.',
      keywords: 'login study xp tracker, sign in study tracker',
    },
    zh: {
      title: '登录 | Study XP Tracker',
      description: '登录您的 Study XP Tracker 账户，继续保持学习连续记录并赚取经验值。',
      keywords: '登录 study xp tracker',
    },
  },
  register: {
    vi: {
      title: 'Đăng Ký Tài Khoản | Study XP Tracker',
      description: 'Tạo tài khoản Study XP Tracker miễn phí để bắt đầu hành trình biến việc học thành trò chơi thăng cấp hấp dẫn.',
      keywords: 'đăng ký study xp tracker, tạo tài khoản học tập',
    },
    en: {
      title: 'Sign Up | Study XP Tracker',
      description: 'Create a free Study XP Tracker account to turn your learning into an exciting RPG level-up journey.',
      keywords: 'register study xp tracker, create account study tracker',
    },
    zh: {
      title: '注册账户 | Study XP Tracker',
      description: '免费创建 Study XP Tracker 账户，开启游戏化升级的学习之旅。',
      keywords: '注册 study xp tracker',
    },
  },
  dashboard: {
    vi: {
      title: 'Bảng Điều Khiển Học Tập | Study XP Tracker',
      description: 'Theo dõi thời gian học, đếm ngược Pomodoro, kiểm tra XP hiện tại và bảng xếp hạng cấp độ của bạn.',
      keywords: 'bảng điều khiển study xp, dashboard học tập, pomodoro timer',
    },
    en: {
      title: 'Study Dashboard | Study XP Tracker',
      description: 'Track your live study sessions, manage Pomodoro timer, view your level progress and study statistics.',
      keywords: 'study dashboard, study tracker live, pomodoro timer dashboard',
    },
    zh: {
      title: '学习仪表板 | Study XP Tracker',
      description: '实时追踪学习时间，使用番茄钟，查看当前等级进度和学习统计。',
      keywords: '学习仪表板, 番茄钟, 学习统计',
    },
  },
  admin: {
    vi: {
      title: 'Admin Dashboard | Study XP Tracker',
      description: 'Trang quản trị hệ thống, theo dõi người dùng đang online realtime và thống kê lịch sử học tập.',
      keywords: 'admin study xp, trang quan tri study xp, online user tracking',
    },
    en: {
      title: 'Admin Dashboard | Study XP Tracker',
      description: 'System administration dashboard for realtime online user tracking and detailed study session logs.',
      keywords: 'admin dashboard, study tracker admin, user study analytics',
    },
    zh: {
      title: '管理员仪表板 | Study XP Tracker',
      description: '系统管理仪表板，用于实时在线用户追踪和详细学习记录统计。',
      keywords: '管理员仪表板, 在线用户追踪',
    },
  },
};

export default function SEO({ view = 'landing' }) {
  const { language } = useLanguage();
  const currentLang = language || 'vi';

  useEffect(() => {
    const langData = metaContentByView[view]?.[currentLang] || metaContentByView.landing.vi;
    const pageUrl = view === 'landing' ? `${DOMAIN}/` : `${DOMAIN}/#${view}`;

    // Update document title
    document.title = langData.title;

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector, attributeName, attributeValue, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper function to update link tag
    const updateLinkTag = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Primary meta tags
    updateMetaTag('meta[name="title"]', 'name', 'title', langData.title);
    updateMetaTag('meta[name="description"]', 'name', 'description', langData.description);
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', langData.keywords);

    // Open Graph
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', langData.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', langData.description);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    updateMetaTag('meta[property="og:locale"]', 'property', 'og:locale', currentLang === 'vi' ? 'vi_VN' : currentLang === 'zh' ? 'zh_CN' : 'en_US');

    // Twitter
    updateMetaTag('meta[property="twitter:title"]', 'property', 'twitter:title', langData.title);
    updateMetaTag('meta[property="twitter:description"]', 'property', 'twitter:description', langData.description);
    updateMetaTag('meta[property="twitter:url"]', 'property', 'twitter:url', pageUrl);

    // Canonical
    updateLinkTag('canonical', pageUrl);
  }, [view, currentLang]);

  return null;
}
