import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  vi: {
    // auth / login / register
    login_title: "Study XP Tracker",
    login_subtitle: "Đăng nhập để tiếp tục cày cuốc học tập và thăng cấp!",
    email: "Email",
    password: "Mật khẩu",
    login_btn: "Đăng nhập",
    logging_in: "Đang đăng nhập...",
    no_account: "Chưa có tài khoản?",
    create_account: "Tạo tài khoản mới",
    register_title: "Đăng ký tài khoản",
    register_subtitle: "Bắt đầu hành trình theo dõi học tập và thăng cấp XP!",
    display_name: "Tên hiển thị",
    confirm_password: "Xác nhận mật khẩu",
    register_btn: "Đăng ký",
    already_have_account: "Đã có tài khoản?",
    login_now: "Đăng nhập ngay",
    passwords_dont_match: "Mật khẩu xác nhận không khớp.",
    register_failed: "Đăng ký thất bại. Vui lòng thử lại.",
    login_failed: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
    loading_account: "Đang tải tài khoản...",

    // dashboard layout & navbar
    logout: "Đăng xuất",
    theme_light: "Chế độ sáng",
    theme_dark: "Chế độ tối",
    language: "Ngôn ngữ",

    // xp bar
    level: "Cấp",
    study_progress: "Tiến Trình Học Tập",
    total_xp: "Tổng XP tích lũy",
    xp_to_next: "cần thiết để lên cấp",
    session_active: "Mức XP Ước Tính (Đang học)",
    session_saved: "Mức XP Hiện Tại",

    // study timer
    timer_title: "Đồng Hồ Học Tập",
    select_subject: "Chọn môn học",
    timer_active_desc: "Bạn đang tập trung học",
    timer_stopped_desc: "Đồng hồ đang dừng",
    timer_placeholder: "Tự do / Khác",
    btn_start: "Bắt đầu tập trung",
    btn_pause: "Tạm dừng",
    btn_resume: "Tiếp tục",
    btn_stop: "Kết thúc & Nhận XP",
    session_completed: "Học tập hoàn thành",
    minutes: "phút",
    timer_start_error: "Không thể bắt đầu học tập.",
    timer_stop_error: "Không thể dừng học tập.",
    timer_counting: "Đang đếm giờ...",
    timer_ready: "Sẵn sàng",
    timer_input_placeholder: "Môn học / Chủ đề (ví dụ: Toán, Lập trình...)",
    timer_btn_start: "Bắt đầu học ngay",

    // manual session
    manual_title: "Tự Ghi Nhận Buổi Học",
    subject: "Môn học",
    duration: "Thời gian học (phút)",
    btn_log: "Ghi nhận buổi học",
    log_success: "Đã ghi nhận buổi học thành công!",
    log_error: "Ghi nhận thất bại. Vui lòng thử lại.",
    hour: "giờ",
    minute: "phút",
    second: "giây",
    goal_log_error: "Không thể tự động ghi nhận buổi học",
    goal_duration_error: "Thời lượng mục tiêu phải lớn hơn 0 giây.",
    goal_countdown_title: "Đặt Mục Tiêu Đếm Ngược",
    goal_subject_placeholder: "Toán, Lý, Lập trình...",
    goal_duration_label: "Thời gian học mục tiêu",
    goal_btn_add: "Thêm mục tiêu mới",
    goal_list_title: "Mục Tiêu Đã Đặt Ra",
    goal_no_goals: "Chưa có mục tiêu học tập nào được đặt.",
    goal_status_completed: "Đã hoàn thành",
    goal_status_running: "Đang chạy",
    goal_status_paused: "Tạm dừng",
    goal_set_label: "Đặt ra:",
    goal_btn_start: "Bắt đầu",
    goal_btn_delete: "Xóa mục tiêu",
    goal_completed_title: "Hoàn Thành Mục Tiêu! 🎉",
    goal_completed_desc: "Chúc mừng bạn đã hoàn thành xuất sắc mục tiêu học tập môn",
    goal_completed_in: "trong",
    goal_btn_ok: "Tuyệt vời!",

    // online users
    online_title: "Đang Học Cùng Bạn",
    online_users: "Người dùng trực tuyến",
    no_online_users: "Không có ai khác đang học trực tuyến lúc này.",
    level_short: "Cấp",
    total_xp_short: "Tổng XP",
    studying_subject: "Đang học",
    status_active_idle: "Đang hoạt động (Rảnh)",
    no_online_short: "Không có ai online",

    // session history
    history_title: "Lịch Sử Học Tập",
    no_sessions: "Chưa có buổi học nào được ghi nhận.",
    delete_confirm: "Bạn có chắc chắn muốn xóa buổi học này?",
    source_timer: "Đồng hồ",
    source_manual: "Tự ghi",
    chart_minutes_label: "Số phút học",
    chart_title: "Thống Kê 7 Ngày Gần Nhất",
    no_sessions_subtitle: "Hãy khởi động timer hoặc nhập thủ công để bắt đầu cày XP!",

    // study calendar
    calendar_title: "Lịch Học Tập",
    one_year_past: "Một năm qua",
    total_active_days: "Tổng ngày học",
    current_streak: "Chuỗi hiện tại",
    longest_streak: "Chuỗi dài nhất",
    longest_streak_year: "Chuỗi dài nhất năm",
    total_duration: "Tổng thời gian",
    days: "ngày",
    hours: "giờ",
    no_study_time: "Chưa ghi nhận thời gian học",
    hover_tip: "Di chuột lên các ô để xem chi tiết buổi học",
    legend_less: "Ít",
    legend_more: "Nhiều",
    weekdays: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  },
  en: {
    // auth / login / register
    login_title: "Study XP Tracker",
    login_subtitle: "Log in to continue grinding and leveling up!",
    email: "Email",
    password: "Password",
    login_btn: "Log In",
    logging_in: "Logging in...",
    no_account: "Don't have an account?",
    create_account: "Create new account",
    register_title: "Create Account",
    register_subtitle: "Start your journey to track study and level up!",
    display_name: "Display Name",
    confirm_password: "Confirm Password",
    register_btn: "Register",
    already_have_account: "Already have an account?",
    login_now: "Log In Now",
    passwords_dont_match: "Passwords do not match.",
    register_failed: "Registration failed. Please try again.",
    login_failed: "Login failed. Please check your credentials.",
    loading_account: "Loading account...",

    // dashboard layout & navbar
    logout: "Log Out",
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
    language: "Language",

    // xp bar
    level: "Lvl",
    study_progress: "Study Progress",
    total_xp: "Total XP accumulated",
    xp_to_next: "needed to level up",
    session_active: "Estimated XP (Active Session)",
    session_saved: "Current XP",

    // study timer
    timer_title: "Study Timer",
    select_subject: "Select subject",
    timer_active_desc: "You are focusing on",
    timer_stopped_desc: "Timer is stopped",
    timer_placeholder: "Free / Other",
    btn_start: "Start Focus",
    btn_pause: "Pause",
    btn_resume: "Resume",
    btn_stop: "End & Claim XP",
    session_completed: "Session Completed",
    minutes: "mins",
    timer_start_error: "Could not start study session.",
    timer_stop_error: "Could not stop study session.",
    timer_counting: "Counting...",
    timer_ready: "Ready",
    timer_input_placeholder: "Subject / Topic (e.g. Math, Coding...)",
    timer_btn_start: "Start Focus",

    // manual session
    manual_title: "Manual Session Log",
    subject: "Subject",
    duration: "Duration (minutes)",
    btn_log: "Log Session",
    log_success: "Session logged successfully!",
    log_error: "Logging failed. Please try again.",
    hour: "hour",
    minute: "minute",
    second: "second",
    goal_log_error: "Could not automatically log study session",
    goal_duration_error: "Target duration must be greater than 0 seconds.",
    goal_countdown_title: "Set Countdown Goal",
    goal_subject_placeholder: "Math, Physics, Coding...",
    goal_duration_label: "Target Study Time",
    goal_btn_add: "Add New Goal",
    goal_list_title: "Set Goals",
    goal_no_goals: "No study goals set yet.",
    goal_status_completed: "Completed",
    goal_status_running: "Running",
    goal_status_paused: "Paused",
    goal_set_label: "Target:",
    goal_btn_start: "Start",
    goal_btn_delete: "Delete Goal",
    goal_completed_title: "Goal Completed! 🎉",
    goal_completed_desc: "Congratulations on successfully completing your study goal for",
    goal_completed_in: "in",
    goal_btn_ok: "Awesome!",

    // online users
    online_title: "Studying with You",
    online_users: "Online Users",
    no_online_users: "No one else is online studying right now.",
    level_short: "Lvl",
    total_xp_short: "Total XP",
    studying_subject: "Studying",
    status_active_idle: "Active (Idle)",
    no_online_short: "No one is online",

    // session history
    history_title: "Study History",
    no_sessions: "No sessions logged yet.",
    delete_confirm: "Are you sure you want to delete this session?",
    source_timer: "Timer",
    source_manual: "Manual",
    chart_minutes_label: "Minutes studied",
    chart_title: "Last 7 Days Statistics",
    no_sessions_subtitle: "Start the timer or add goals to begin grinding XP!",

    // study calendar
    calendar_title: "Study Calendar",
    one_year_past: "Past year",
    total_active_days: "Total study days",
    current_streak: "Current streak",
    longest_streak: "Longest streak",
    longest_streak_year: "Longest streak of year",
    total_duration: "Total duration",
    days: "days",
    hours: "hours",
    no_study_time: "No study time recorded",
    hover_tip: "Hover over cells to see session details",
    legend_less: "Less",
    legend_more: "More",
    weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  },
  zh: {
    // auth / login / register
    login_title: "学习经验值追踪器",
    login_subtitle: "登录以继续努力学习并升级！",
    email: "电子邮件",
    password: "密码",
    login_btn: "登录",
    logging_in: "正在登录...",
    no_account: "还没有账户？",
    create_account: "创建新账户",
    register_title: "创建账户",
    register_subtitle: "开始您的学习追踪和升级之旅！",
    display_name: "显示名称",
    confirm_password: "确认密码",
    register_btn: "注册",
    already_have_account: "已有账户？",
    login_now: "立即登录",
    passwords_dont_match: "密码不匹配。",
    register_failed: "注册失败。请重试。",
    login_failed: "登录失败。请检查您的凭据。",
    loading_account: "正在加载账户...",

    // dashboard layout & navbar
    logout: "退出登录",
    theme_light: "浅色模式",
    theme_dark: "深色模式",
    language: "语言",

    // xp bar
    level: "等级",
    study_progress: "学习进度",
    total_xp: "累计总经验值",
    xp_to_next: "升级所需",
    session_active: "预估经验值 (正在学习)",
    session_saved: "当前经验值",

    // study timer
    timer_title: "学习计时器",
    select_subject: "选择科目",
    timer_active_desc: "您正在专注于",
    timer_stopped_desc: "计时器已停止",
    timer_placeholder: "自由 / 其他",
    btn_start: "开始专注",
    btn_pause: "暂停",
    btn_resume: "继续",
    btn_stop: "结束并领取经验值",
    session_completed: "学习已完成",
    minutes: "分钟",
    timer_start_error: "无法开始学习。",
    timer_stop_error: "无法停止学习。",
    timer_counting: "正在计时...",
    timer_ready: "准备就绪",
    timer_input_placeholder: "科目 / 主题 (例如: 数学, 编程...)",
    timer_btn_start: "开始学习",

    // manual session
    manual_title: "手动记录学习",
    subject: "科目",
    duration: "学习时长 (分钟)",
    btn_log: "记录学习",
    log_success: "学习记录成功！",
    log_error: "记录失败。请重试。",
    hour: "小时",
    minute: "分钟",
    second: "秒",
    goal_log_error: "无法自动记录学习",
    goal_duration_error: "目标时长必须大于0秒。",
    goal_countdown_title: "设置倒计时目标",
    goal_subject_placeholder: "数学, 物理, 编程...",
    goal_duration_label: "目标学习时间",
    goal_btn_add: "添加新目标",
    goal_list_title: "已设定的目标",
    goal_no_goals: "尚未设定学习目标。",
    goal_status_completed: "已完成",
    goal_status_running: "正在进行",
    goal_status_paused: "已暂停",
    goal_set_label: "设定目标:",
    goal_btn_start: "开始",
    goal_btn_delete: "删除目标",
    goal_completed_title: "目标已完成！🎉",
    goal_completed_desc: "恭喜您成功完成了学习目标：",
    goal_completed_in: "用时",
    goal_btn_ok: "太棒了！",

    // online users
    online_title: "正在和你一起学习",
    online_users: "在线用户",
    no_online_users: "目前没有其他人在在线学习。",
    level_short: "等级",
    total_xp_short: "总经验",
    studying_subject: "正在学习",
    status_active_idle: "活跃 (空闲)",
    no_online_short: "没有在线用户",

    // session history
    history_title: "学习历史",
    no_sessions: "尚无学习记录。",
    delete_confirm: "您确定要删除此学习记录吗？",
    source_timer: "计时器",
    source_manual: "手动",
    chart_minutes_label: "学习分钟数",
    chart_title: "最近7天统计",
    no_sessions_subtitle: "启动计时器或添加目标以开始积累经验值！",

    // study calendar
    calendar_title: "学习日历",
    one_year_past: "过去一年",
    total_active_days: "总学习天数",
    current_streak: "当前连续天数",
    longest_streak: "最长连续天数",
    longest_streak_year: "年度最长连续天数",
    total_duration: "总时长",
    days: "天",
    hours: "小时",
    no_study_time: "未记录学习时间",
    hover_tip: "将鼠标悬停在单元格上以查看学习详情",
    legend_less: "少",
    legend_more: "多",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    if (saved && (saved === 'vi' || saved === 'en' || saved === 'zh')) {
      return saved;
    }
    // Default to Vietnamese since previous app was in Vietnamese
    return 'vi';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
