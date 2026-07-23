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
    passwords_dont_match: "Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.",
    register_failed: "Đăng ký thất bại. Vui lòng thử lại.",
    login_failed: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
    loading_account: "Đang tải tài khoản...",

    // validation error messages
    error_email_required: "Vui lòng nhập địa chỉ email.",
    error_email_invalid: "Email không đúng định dạng. (ví dụ: ten@vi-du.com)",
    error_password_required: "Vui lòng nhập mật khẩu.",
    error_password_min_length: "Mật khẩu phải có ít nhất 6 ký tự.",
    error_confirm_password_required: "Vui lòng xác nhận lại mật khẩu.",
    error_confirm_password_mismatch: "Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.",
    error_display_name_required: "Vui lòng nhập tên hiển thị.",
    error_display_name_length: "Tên hiển thị phải từ 2 đến 50 ký tự.",
    error_otp_required: "Vui lòng nhập đầy đủ 4 chữ số mã OTP.",
    error_otp_expired: "Mã OTP đã hết hạn (quá 5 phút). Vui lòng bấm 'Gửi lại mã' hoặc thực hiện đăng ký lại.",

    // friendly error messages (mapped from API error codes)
    error_invalid_credentials: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
    error_account_not_found: "Không tìm thấy tài khoản với email này.",
    error_email_already_exists: "Email này đã được sử dụng. Vui lòng dùng email khác hoặc đăng nhập.",
    error_invalid_input: "Thông tin nhập vào không hợp lệ. Vui lòng kiểm tra lại các trường.",
    error_session_already_active: "Bạn đang có một phiên học chưa kết thúc.",
    error_session_not_found: "Không tìm thấy phiên học này.",
    error_bad_request: "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.",
    error_unauthorized: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    error_forbidden: "Bạn không có quyền thực hiện hành động này.",
    error_not_found: "Không tìm thấy tài nguyên yêu cầu.",
    error_too_many_requests: "Bạn đã thử quá nhiều lần. Vui lòng chờ một lúc rồi thử lại.",
    error_server: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.",
    error_unknown: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",


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
    online_title: "Study Room",
    online_users: "Online",
    no_online_users: "No one else is online right now.",
    level_short: "Lv",
    total_xp_short: "XP",
    studying_subject: "Studying",
    status_active_idle: "Online · Idle",
    no_online_short: "No one online",

    // session history
    history_title: "Study History",
    no_sessions: "No sessions logged yet.",
    delete_confirm: "Delete this session?",
    source_timer: "Timer",
    source_manual: "Manual",
    chart_minutes_label: "Minutes",
    chart_title: "Last 7 Days",
    no_sessions_subtitle: "Start the timer or log a session to earn XP!",

    // study calendar
    calendar_title: "Study Calendar",
    one_year_past: "Past Year",
    total_active_days: "Study Days",
    current_streak: "Streak",
    longest_streak: "Best Streak",
    longest_streak_year: "Best This Year",
    total_duration: "Total Time",
    days: "d",
    hours: "h",
    no_study_time: "No study time yet",
    hover_tip: "Hover cells to see session details",
    legend_less: "Less",
    legend_more: "More",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

    // landing page
    landing_slogan: "Thăng Cấp Hành Trình Học Tập Của Bạn",
    landing_sub: "Biến mỗi phút học tập thành điểm kinh nghiệm (XP), thăng cấp như trong game RPG và cày cuốc cùng bạn bè trực tuyến trong thời gian thực.",
    landing_cta_get_started: "Bắt đầu cày cuốc",
    landing_cta_login: "Đăng nhập",
    landing_cta_features: "Khám phá tính năng",
    landing_mock_timer_title: "Chạy thử đồng hồ & Nhận XP",

    // member search & public profile
    search_members: "Tìm kiếm thành viên",
    search_members_placeholder: "Nhập tên hiển thị hoặc email...",
    no_members_found: "Không tìm thấy thành viên nào phù hợp.",
    view_profile: "Xem hồ sơ",
    public_profile_title: "Hồ Sơ Thành Viên",
    member_level: "Cấp độ",
    member_streak: "Chuỗi học tập",
    member_total_time: "Tổng thời gian học",
    member_total_sessions: "Tổng số buổi học",
    member_status_online: "Trực tuyến",
    member_status_offline: "Ngoại tuyến",
    member_status_studying: "Đang tập trung học",
    member_bio_title: "Mục tiêu & Giới thiệu",
    member_no_bio: "Thành viên này chưa cập nhật giới thiệu.",
    close: "Đóng",
    landing_mock_timer_desc: "Nhấn nút dưới để bắt đầu mô phỏng phiên học thực tế.",
    landing_mock_btn_start: "Bắt đầu học thử",
    landing_mock_btn_stop: "Dừng & Claim XP!",
    landing_mock_level_up: "THĂNG CẤP! 🎉",
    landing_mock_xp_gained: "Bạn đã nhận được",
    landing_mock_total_xp: "Tổng XP giả lập",
    landing_feature_title: "Các tính năng nổi bật",
    landing_feature_timer_title: "Đồng hồ Pomodoro chống gian lận",
    landing_feature_timer_desc: "Theo dõi thời gian học từng giây. Đảm bảo chống gian lận thông qua tính toán trực tiếp từ máy chủ.",
    landing_feature_rpg_title: "Cơ chế game nhập vai RPG",
    landing_feature_rpg_desc: "Công thức thăng cấp thú vị, tặng thêm 10% XP cho các buổi học tập trung chất lượng cao trên 25 phút.",
    landing_feature_coop_title: "Phòng học trực tuyến cùng bạn bè",
    landing_feature_coop_desc: "Nhìn thấy danh sách những người học trực tuyến khác cùng với trạng thái và cấp độ của họ để duy trì động lực.",
    landing_feature_heatmap_title: "Lịch học & Chuỗi ngày (Streaks)",
    landing_feature_heatmap_desc: "Lịch đóng góp giống Github và thống kê chi tiết giúp bạn theo dõi sát sao tiến độ học tập hàng tuần.",
    landing_back_to_home: "Trở về Trang chủ",
    landing_showcase_title: "Theo dõi trực quan tiến độ học tập",
    landing_showcase_desc: "Website cung cấp hệ thống lịch học (Contribution Map) giống phong cách GitHub, tự động lưu lại tất cả chuỗi ngày liên tiếp bạn học tập (Streaks). Ngoài ra còn tích hợp biểu đồ thống kê 7 ngày gần nhất sử dụng thư viện Recharts để bạn dễ dàng đánh giá sự tập trung của bản thân.",
    landing_showcase_item1: "Thống kê chi tiết số phút học mỗi ngày",
    landing_showcase_item2: "Theo dõi chuỗi ngày học hiện tại và chuỗi dài nhất để kích hoạt động lực cày cuốc",
    landing_showcase_item3: "Dễ dàng ghi nhận thủ công nếu học ngoại tuyến hoặc quên chạy đồng hồ",
    landing_showcase_btn: "Trải nghiệm ngay",
    landing_mock_streak: "Chuỗi Ngày",
    landing_mock_level: "Cấp Độ",
    landing_mock_duration: "Thời Gian Học",
    landing_mock_heatmap_title: "Lịch học đóng góp (Heatmap)",
    landing_mock_coop_title: "Đang Học Cùng Bạn",
    landing_mock_user1_subject: "Đang học Toán Giải Tích",
    landing_mock_user2_subject: "Đang học Lập Trình Java",

    // guest mode
    guest_login: "Đăng nhập Khách",
    guest_login_btn: "Vào học ngay",
    guest_login_subtitle: "Chỉ cần nhập tên hiển thị để trải nghiệm ngay hệ thống!",
    guest_name_label: "Tên hiển thị của bạn",
    guest_name_placeholder: "Ví dụ: Khách Cần Mẫn...",
    guest_badge: "Tài khoản Khách",
    guest_overlay_title: "Tạo tài khoản để lưu lịch sử học tập",
    guest_overlay_desc: "Bạn đang dùng tài khoản khách. Đăng ký ngay để mở khóa Thống kê 7 ngày, Heatmap và lưu giữ toàn bộ dữ liệu học tập!",
    guest_register_cta: "Đăng ký lưu dữ liệu",

    // footer author info
    footer_author_title: "Thông tin tác giả",
    footer_author_name: "Tác giả",
    footer_contact_email: "Email liên hệ",
    footer_address: "Địa chỉ",
    footer_copyright: "Ứng dụng gamification hỗ trợ theo dõi thời gian học tập, thăng cấp XP và duy trì thói quen học tập hiệu quả.",
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

    // friendly error messages (mapped from API error codes)
    error_invalid_credentials: "Incorrect email or password. Please try again.",
    error_account_not_found: "No account found with this email address.",
    error_email_already_exists: "This email is already in use. Please use a different email or log in.",
    error_invalid_input: "Invalid input. Please check your details and try again.",
    error_session_already_active: "You already have an active study session.",
    error_session_not_found: "Study session not found.",
    error_bad_request: "Invalid request. Please check your input.",
    error_unauthorized: "Your session has expired. Please log in again.",
    error_forbidden: "You do not have permission to perform this action.",
    error_not_found: "The requested resource was not found.",
    error_too_many_requests: "Too many attempts. Please wait a moment and try again.",
    error_server: "The server is experiencing issues. Please try again later.",
    error_unknown: "An unexpected error occurred. Please try again.",

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

    // admin dashboard vi
    admin_dashboard: "Admin Dashboard",
    admin_subtitle: "Quản trị hệ thống, theo dõi online thời gian thực và thống kê học tập người dùng",
    admin_tab_online: "Đang Online (Realtime)",
    admin_tab_users_stats: "Thống Kê Task & Lịch Sử User",
    admin_stat_total_users: "Tổng Số Người Dùng",
    admin_stat_online_now: "Đang Online",
    admin_stat_studying_now: "Đang Học Tập",
    admin_stat_total_sessions: "Tổng Task/Session Hoàn Thành",
    admin_stat_total_hours: "Tổng Giờ Học Hệ Thống",
    admin_stat_total_xp: "Tổng XP Đã Phát",
    admin_search_placeholder: "Tìm kiếm theo tên hoặc email...",
    admin_status_filter_all: "Tất cả trạng thái",
    admin_status_filter_studying: "Đang học tập",
    admin_status_filter_idle: "Đang rảnh / Online",
    admin_period_all: "Tất cả thời gian",
    admin_period_today: "Hôm nay",
    admin_period_7d: "7 ngày qua",
    admin_period_30d: "30 ngày qua",
    admin_user_col_user: "Người dùng",
    admin_user_col_status: "Trạng thái",
    admin_user_col_level: "Level / XP",
    admin_user_col_sessions: "Số Sessions",
    admin_user_col_hours: "Tổng Giờ Học",
    admin_user_col_xp_period: "XP Tích Lũy",
    admin_user_col_last_active: "Hoạt Động Gần Nhất",
    admin_user_col_action: "Hành động",
    admin_view_history: "Xem Lịch Sử Task",
    admin_modal_history_title: "Chi Tiết Lịch Sử Task & Session Học Tập",
    admin_modal_no_sessions: "Người dùng này chưa có phiên học nào.",
    admin_session_col_subject: "Môn Học / Chủ Đề",
    admin_session_col_duration: "Thời Lượng",
    admin_session_col_xp: "XP Kiếm Được",
    admin_session_col_source: "Loại Session",
    admin_session_col_started: "Thời Gian Bắt Đầu",
    admin_session_source_timer: "Bấm giờ Timer",
    admin_session_source_manual: "Nhập thủ công",
    admin_role_admin: "Quản trị viên",
    admin_role_user: "Học viên",

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

    // landing page
    landing_slogan: "Level Up Your Learning Journey",
    landing_sub: "Convert every minute of studying into Experience Points (XP), level up like an RPG character, and grind together with online study companions.",
    landing_cta_get_started: "Get Started",
    landing_cta_login: "Log In",
    landing_cta_features: "Explore Features",
    landing_mock_timer_title: "Test Drive the Timer & Claim XP",

    // member search & public profile
    search_members: "Search Members",
    search_members_placeholder: "Enter display name or email...",
    no_members_found: "No members found.",
    view_profile: "View Profile",
    public_profile_title: "Member Profile",
    member_level: "Level",
    member_streak: "Study Streak",
    member_total_time: "Total Study Time",
    member_total_sessions: "Completed Sessions",
    member_status_online: "Online",
    member_status_offline: "Offline",
    member_status_studying: "Currently Studying",
    member_bio_title: "Goal & Bio",
    member_no_bio: "This member has not set a bio yet.",
    close: "Close",
    landing_mock_timer_desc: "Click the button below to simulate a real study session.",
    landing_mock_btn_start: "Start Free Trial",
    landing_mock_btn_stop: "Stop & Claim XP!",
    landing_mock_level_up: "LEVEL UP! 🎉",
    landing_mock_xp_gained: "You gained",
    landing_mock_total_xp: "Mock Total XP",
    landing_feature_title: "Key Features",
    landing_feature_timer_title: "Anti-Cheat Pomodoro Timer",
    landing_feature_timer_desc: "Track study time down to the second. Built-in anti-cheat prevents time tampering via server-side verification.",
    landing_feature_rpg_title: "RPG Leveling Mechanics",
    landing_feature_rpg_desc: "Exciting level-up formula. Earn +10% bonus XP for high-focus sessions of 25 minutes or more.",
    landing_feature_coop_title: "Realtime Co-studying Room",
    landing_feature_coop_desc: "See other online users, their levels, and what they are studying in real-time to keep your fire burning.",
    landing_feature_heatmap_title: "Study Calendar & Streaks",
    landing_feature_heatmap_desc: "GitHub-style contribution heatmap and detailed charts to help you monitor your weekly progress.",
    landing_back_to_home: "Back to Home",
    landing_showcase_title: "Visually track your study progress",
    landing_showcase_desc: "The website provides a GitHub-style contribution calendar to automatically log your study streaks. It also integrates detailed 7-day charts using Recharts to help you easily evaluate your focus.",
    landing_showcase_item1: "Detailed daily stats of minutes studied",
    landing_showcase_item2: "Track current and longest streaks to keep your momentum going",
    landing_showcase_item3: "Easily log sessions manually if studying offline or forgot the timer",
    landing_showcase_btn: "Try It Now",
    landing_mock_streak: "Streaks",
    landing_mock_level: "Level",
    landing_mock_duration: "Hours Studied",
    landing_mock_heatmap_title: "Study Contribution Map (Heatmap)",
    landing_mock_coop_title: "Studying with You",
    landing_mock_user1_subject: "Studying Calculus",
    landing_mock_user2_subject: "Studying Java Programming",

    // admin dashboard en
    admin_dashboard: "Admin Dashboard",
    admin_subtitle: "System management, realtime online tracking, and user study statistics",
    admin_tab_online: "Realtime Online",
    admin_tab_users_stats: "User Task & History Stats",
    admin_stat_total_users: "Total Registered Users",
    admin_stat_online_now: "Online Right Now",
    admin_stat_studying_now: "Currently Studying",
    admin_stat_total_sessions: "Total Completed Tasks/Sessions",
    admin_stat_total_hours: "Total System Study Hours",
    admin_stat_total_xp: "Total Distributed XP",
    admin_search_placeholder: "Search by name or email...",
    admin_status_filter_all: "All statuses",
    admin_status_filter_studying: "Studying",
    admin_status_filter_idle: "Active / Idle",
    admin_period_all: "All Time",
    admin_period_today: "Today",
    admin_period_7d: "Last 7 Days",
    admin_period_30d: "Last 30 Days",
    admin_user_col_user: "User",
    admin_user_col_status: "Status",
    admin_user_col_level: "Level / XP",
    admin_user_col_sessions: "Sessions",
    admin_user_col_hours: "Total Study Time",
    admin_user_col_xp_period: "Earned XP",
    admin_user_col_last_active: "Last Active",
    admin_user_col_action: "Action",
    admin_view_history: "View Task History",
    admin_modal_history_title: "Detailed Task & Session History",
    admin_modal_no_sessions: "This user has not logged any study sessions yet.",
    admin_session_col_subject: "Subject / Topic",
    admin_session_col_duration: "Duration",
    admin_session_col_xp: "Earned XP",
    admin_session_col_source: "Session Source",
    admin_session_col_started: "Started At",
    admin_session_source_timer: "Timer Mode",
    admin_session_source_manual: "Manual Mode",
    admin_role_admin: "Administrator",
    admin_role_user: "Learner",

    // guest mode
    guest_login: "Guest Login",
    guest_login_btn: "Enter as Guest",
    guest_login_subtitle: "Enter a display name to try out the app instantly!",
    guest_name_label: "Your Display Name",
    guest_name_placeholder: "e.g., Diligent Guest...",
    guest_badge: "Guest Account",
    guest_overlay_title: "Create an account to save study history",
    guest_overlay_desc: "You are currently in Guest mode. Register now to unlock 7-Day Stats, Heatmap, and save all your study progress!",
    guest_register_cta: "Register & Save Progress",

    // footer author info
    footer_author_title: "Author Information",
    footer_author_name: "Author",
    footer_contact_email: "Contact Email",
    footer_address: "Address",
    footer_copyright: "Gamified learning application to track study hours, level up XP, and build long-term study habits.",
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

    // friendly error messages (mapped from API error codes)
    error_invalid_credentials: "电子邮件或密码不正确，请重试。",
    error_account_not_found: "未找到使用此电子邮件的账户。",
    error_email_already_exists: "此电子邮件已被使用。请使用其他邮件或直接登录。",
    error_invalid_input: "输入无效，请检查您的信息后重试。",
    error_session_already_active: "您已有一个正在进行的学习会话。",
    error_session_not_found: "未找到该学习会话。",
    error_bad_request: "请求无效，请检查您的输入。",
    error_unauthorized: "您的登录会话已过期，请重新登录。",
    error_forbidden: "您没有权限执行此操作。",
    error_not_found: "未找到所请求的资源。",
    error_too_many_requests: "尝试次数过多，请稍等片刻后再试。",
    error_server: "服务器遇到问题，请稍后重试。",
    error_unknown: "发生了未知错误，请重试。",

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

    // landing page
    landing_slogan: "提升您的学习之旅",
    landing_sub: "将您学习的每一分钟转化为经验值（XP），像RPG角色一样升级，并与在线学习伙伴一起奋斗。",
    landing_cta_get_started: "开始挑战",
    landing_cta_login: "登录",
    landing_cta_features: "探索功能",
    landing_mock_timer_title: "试用计时器并领取经验值",
    landing_mock_timer_desc: "点击下方按钮模拟真实的学习过程。",
    landing_mock_btn_start: "开始试用",
    landing_mock_btn_stop: "停止并领取经验值！",
    landing_mock_level_up: "恭喜升级！🎉",
    landing_mock_xp_gained: "您获得了",
    landing_mock_total_xp: "模拟总经验",
    landing_feature_title: "主要功能",
    landing_feature_timer_title: "防作弊番茄计时器",
    landing_feature_timer_desc: "精确记录每一秒的学习时间。通过服务器端验证防止篡改时间，内置防作弊机制。",
    landing_feature_rpg_title: "RPG 游戏升级机制",
    landing_feature_rpg_desc: "有趣的升级公式。专注学习25分钟或以上，可额外获得10%的经验值奖励。",
    landing_feature_coop_title: "实时协同学习",
    landing_feature_coop_desc: "实时查看其他在线用户、他们的等级以及他们正在学习的内容，保持学习热情。",
    landing_feature_heatmap_title: "学习日历与连续天数",
    landing_feature_heatmap_desc: "类 GitHub 贡献热力图和详细的统计图表，帮助您监控每周的学习进度。",
    landing_back_to_home: "返回主页",
    landing_showcase_title: "直观地追踪您的学习进度",
    landing_showcase_desc: "网站提供类似 GitHub 的学习日历，自动记录您的连续学习天数。它还集成基于 Recharts 的 7 天统计图表，帮助您轻松评估专注度。",
    landing_showcase_item1: "每日学习分钟数的详细统计",
    landing_showcase_item2: "追踪当前和最长连续学习天数，保持奋斗动力",
    landing_showcase_item3: "离线学习或忘记启动计时器时，轻松手动记录",
    landing_showcase_btn: "立即体验",
    landing_mock_streak: "连续天数",
    landing_mock_level: "等级",
    landing_mock_duration: "学习时长",
    landing_mock_heatmap_title: "学习贡献图 (热力图)",
    landing_mock_coop_title: "正在和你一同学习",
    landing_mock_user1_subject: "正在学习微积分",
    landing_mock_user2_subject: "正在学习 Java 编程",

    // guest mode
    guest_login: "游客登录",
    guest_login_btn: "以游客身份进入",
    guest_login_subtitle: "只需输入显示名称即可立即体验！",
    guest_name_label: "您的显示名称",
    guest_name_placeholder: "例如: 勤奋的游客...",
    guest_badge: "游客账户",
    guest_overlay_title: "创建账户以保存学习记录",
    guest_overlay_desc: "您目前正在使用游客账户。立即注册账户以解锁7天统计、热力图并保存全部学习进度！",
    guest_register_cta: "注册并保存进度",

    // footer author info
    footer_author_title: "作者信息",
    footer_author_name: "作者",
    footer_contact_email: "联系邮箱",
    footer_address: "地址",
    footer_copyright: "游戏化学习应用，用于跟踪学习时间、提升 XP 等级并建立长期学习习惯。",
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
    
    // SEO Dynamic Update
    document.documentElement.lang = language;
    
    let title = "Study XP Tracker - Hệ thống theo dõi học tập và thăng cấp XP";
    let description = "Study XP Tracker giúp bạn theo dõi thời gian học tập, tích lũy điểm kinh nghiệm (XP), thăng cấp và duy trì chuỗi học tập hàng ngày. Học tập hiệu quả hơn cùng bạn bè.";
    
    if (language === 'en') {
      title = "Study XP Tracker - Level up your study routine";
      description = "Study XP Tracker helps you track your study time, accumulate Experience Points (XP), level up, and maintain daily study streaks. Study better with friends.";
    } else if (language === 'zh') {
      title = "Study XP Tracker - 追踪学习进度，提升等级";
      description = "Study XP Tracker 帮助您跟踪学习时间，累积经验值（XP），提升等级，并保持每日学习习惯。与朋友一起更高效地学习。";
    }
    
    document.title = title;
    
    // Update meta title tag
    let metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) metaTitle.setAttribute('content', title);
    
    // Update description tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
    
    // Update Open Graph (og:) tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      const locales = { vi: 'vi_VN', en: 'en_US', zh: 'zh_CN' };
      ogLocale.setAttribute('content', locales[language] || 'vi_VN');
    }
    
    // Update Twitter tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    
    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', description);
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
