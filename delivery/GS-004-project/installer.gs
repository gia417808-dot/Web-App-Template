/**
 * ============================================================================
 * GS-004: QUẢN LÝ DỰ ÁN, CRM, GIAO VIỆC KANBAN/GANTT, KPI & BOT NHẮC VIỆC v4.0 PRO
 * FILE 2/4: installer.gs (Trình Khởi Tạo Hệ Thống 8 Tab Chuẩn Doanh Nghiệp)
 * ============================================================================
 * LƯU Ý QUAN TRỌNG:
 * - File này KHÔNG chứa hàm onOpen() để tránh xung đột với Code.gs.
 * - Chạy hàm install_PROJECT_SHEET() hoặc bấm từ Menu trên Google Sheets để khởi tạo 8 tab.
 */

function install_PROJECT_SHEET() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = null;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {}

  var THEME = {
    primary: '#1E1B4B',     // Indigo 950
    secondary: '#4338CA',   // Indigo 700
    accent: '#0EA5E9',      // Sky 500
    crmHeader: '#0F766E',   // Teal 700
    taskHeader: '#4F46E5',  // Indigo 600
    botHeader: '#B45309',   // Amber 700
    bgLight: '#F8FAFC',
    border: '#CBD5E1'
  };

  var sheetsSpec = [
    { name: 'DASHBOARD', color: '#4F46E5' },
    { name: 'KHACH_HANG_CRM', color: '#0D9488' },
    { name: 'DU_AN', color: '#2563EB' },
    { name: 'CONG_VIEC', color: '#7C3AED' },
    { name: 'LICH_NHAC_TUDONG', color: '#D97706' },
    { name: 'PHAN_QUYEN', color: '#DC2626' },
    { name: 'CAU_HINH', color: '#475569' },
    { name: 'NHAT_KY', color: '#64748B' }
  ];

  sheetsSpec.forEach(function(spec) {
    var sh = ss.getSheetByName(spec.name);
    if (!sh) {
      sh = ss.insertSheet(spec.name);
    } else {
      sh.clear();
      sh.clearFormats();
    }
    sh.setTabColor(spec.color);
  });

  // =========================================================================
  // 1. TAB CAU_HINH
  // =========================================================================
  var shCfg = ss.getSheetByName('CAU_HINH');
  shCfg.getRange('A1:D1').merge().setValue('⚙️ CẤU HÌNH HỆ THỐNG DỰ ÁN, CRM, KPI & BOT NHẮC VIỆC TỰ ĐỘNG (GS-004 v4.0 PRO)')
    .setBackground(THEME.primary).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shCfg.setRowHeight(1, 36);

  var cfgHeaders = [['MÃ CẤU HÌNH (KEY)', 'GIÁ TRỊ CẤU HÌNH (VALUE)', 'NHóm THIẾT LẬP', 'MÔ TẢ / HƯỚNG DẪN SỬ DỤNG']];
  shCfg.getRange('A2:D2').setValues(cfgHeaders).setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold');

  var cfgData = [
    ['COMPANY_NAME', 'CÔNG TY TNHH GIẢI PHÁP SỐ & DỰ ÁN NOVA-CRM', 'THONG_TIN', 'Tên doanh nghiệp hiển thị trên Web App & Báo cáo A4'],
    ['COMPANY_HOTLINE', '0909.888.999', 'THONG_TIN', 'Số hotline hiển thị trên báo cáo và tin nhắn nhắc việc'],
    ['ADMIN_EMAIL', 'pmo.admin@novacrm.vn', 'NHAC_VIEC', 'Email quản trị nhận báo cáo tổng hợp nhắc việc mỗi sáng'],
    ['ENABLE_EMAIL_REMINDER', 'TRUE', 'NHAC_VIEC', 'Bật (TRUE) / Tắt (FALSE) gửi Email nhắc việc tự động qua Gmail (MailApp)'],
    ['ENABLE_ZALO_REMINDER', 'TRUE', 'NHAC_VIEC', 'Bật (TRUE) / Tắt (FALSE) gửi thông báo qua Webhook Bot Zalo / ZNS / n8n / Make'],
    ['ZALO_BOT_WEBHOOK_URL', 'https://webhook.site/zalo-bot-demo-endpoint', 'NHAC_VIEC', 'URL Webhook nhận JSON bắn tin nhắn Zalo OA / Zalo Bot tự động'],
    ['ZALO_OA_ACCESS_TOKEN', 'ZALO_OA_TOKEN_DEMO_2025', 'NHAC_VIEC', 'Access Token Zalo OA (tùy chọn nếu kết nối trực tiếp Zalo API)'],
    ['ENABLE_TELEGRAM_REMINDER', 'TRUE', 'NHAC_VIEC', 'Bật (TRUE) / Tắt (FALSE) gửi thông báo qua Telegram Bot API'],
    ['TELEGRAM_BOT_TOKEN', '', 'NHAC_VIEC', 'Bot Token Telegram (Lấy từ @BotFather, ví dụ: 123456:ABC-DEF...)'],
    ['TELEGRAM_CHAT_ID', '', 'NHAC_VIEC', 'Chat ID nhóm hoặc cá nhân nhận cảnh báo Telegram'],
    ['AUTO_REMINDER_HOUR', '8', 'NHAC_VIEC', 'Giờ chạy Trigger quét và gửi nhắc việc tự động mỗi ngày (0 - 23h, mặc định 8h sáng)'],
    ['REMIND_BEFORE_DAYS', '2', 'NHAC_VIEC', 'Số ngày cảnh báo sớm trước hạn chót (Deadline) của công việc & lịch hẹn CRM'],
    ['KPI_BASE_HIGH', '30', 'KPI', 'Điểm KPI chuẩn khi hoàn thành 1 việc Ưu tiên Cao (Khẩn cấp)'],
    ['KPI_BASE_MEDIUM', '20', 'KPI', 'Điểm KPI chuẩn khi hoàn thành 1 việc Ưu tiên Trung bình'],
    ['KPI_BASE_LOW', '10', 'KPI', 'Điểm KPI chuẩn khi hoàn thành 1 việc Ưu tiên Thấp'],
    ['KPI_OVERDUE_PENALTY', '5', 'KPI', 'Điểm trừ KPI nếu công việc bị trễ hạn chót (Quá hạn)']
  ];
  shCfg.getRange(3, 1, cfgData.length, 4).setValues(cfgData);
  shCfg.setColumnWidth(1, 230);
  shCfg.setColumnWidth(2, 340);
  shCfg.setColumnWidth(3, 150);
  shCfg.setColumnWidth(4, 420);

  // =========================================================================
  // 2. TAB PHAN_QUYEN (RBAC)
  // =========================================================================
  var shAuth = ss.getSheetByName('PHAN_QUYEN');
  shAuth.getRange('A1:I1').merge().setValue('🔐 DANH SÁCH TÀI KHOẢN & PHÂN QUYỀN TRUY CẬP (RBAC)')
    .setBackground('#991B1B').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shAuth.setRowHeight(1, 36);

  var authHeaders = [['USERNAME', 'MẬT KHẨU / PIN', 'HỌ VÀ TÊN', 'VAI TRÒ (ROLE)', 'PHÒNG BAN / CHỨC VỤ', 'EMAIL NHẬN NHẮC VIỆC', 'SĐT ZALO (CHUẨN 09xx)', 'TRẠNG THÁI', 'GHI CHÚ QUYỀN HẠN']];
  shAuth.getRange('A2:I2').setValues(authHeaders).setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold');

  var authData = [
    ['admin', '123456', 'Nguyễn Quản Trị (CEO/PMO)', 'ADMIN', 'Ban Giám Đốc', 'ceo@novacrm.vn', '0901234567', 'Hoạt động', 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM,MANAGE_PROJECT'],
    ['pm_duan', '123456', 'Trần Hoàng Nam (PM)', 'MANAGER', 'Phòng Quản Lý Dự Án', 'nam.pm@novacrm.vn', '0902345678', 'Hoạt động', 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM,MANAGE_PROJECT'],
    ['sale_crm', '123456', 'Lê Minh Thư (Leader CRM)', 'LEADER', 'Phòng Kinh Doanh & CRM', 'thu.crm@novacrm.vn', '0903456789', 'Hoạt động', 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM'],
    ['dev_lead', '123456', 'Phạm Tuấn Kiệt (Tech Lead)', 'LEADER', 'Khối Kỹ Thuật', 'kiet.dev@novacrm.vn', '0904567890', 'Hoạt động', 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK'],
    ['designer', '123456', 'Võ Ngọc Ánh (UI/UX & Media)', 'STAFF', 'Khối Sáng Tạo', 'anh.design@novacrm.vn', '0905678901', 'Hoạt động', 'SELF_CREATE_TASK,VIEW_TEAM'],
    ['sale_moi', '666666', 'Hoang Minh', 'STAFF', 'Phòng Kinh Doanh & CRM', 'minh.sale@novacrm.vn', '0906789012', 'Hoạt động', 'SELF_CREATE_TASK,VIEW_TEAM,ACCESS_CRM']
  ];
  shAuth.getRange(3, 1, authData.length, 9).setValues(authData);
  shAuth.getRange(3, 2, authData.length, 1).setNumberFormat('@');
  shAuth.getRange(3, 7, authData.length, 1).setNumberFormat('@');
  for (var c = 1; c <= 9; c++) shAuth.setColumnWidth(c, 165);

  // =========================================================================
  // 3. TAB KHACH_HANG_CRM (CRM PIPELINE & LỊCH CHĂM SÓC)
  // =========================================================================
  var shCrm = ss.getSheetByName('KHACH_HANG_CRM');
  shCrm.getRange('A1:N1').merge().setValue('🤝 QUẢN LÝ KHÁCH HÀNG CRM, PHỄU BÁN HÀNG (PIPELINE) & LỊCH HẸN CHĂM SÓC TỰ ĐỘNG')
    .setBackground(THEME.crmHeader).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shCrm.setRowHeight(1, 36);

  var crmHeaders = [[
    'MÃ KH', 'TÊN KHÁCH HÀNG / DOANH NGHIỆP', 'NGƯỜI LIÊN HỆ', 'SĐT ZALO', 'EMAIL KHÁCH HÀNG',
    'NGUỒN KHÁCH', 'GIAI ĐOẠN PHỄU (PIPELINE)', 'GIÁ TRỊ DEAL DỰ KIẾN (VNĐ)', 'NHÂN SỰ PHỤ TRÁCH',
    'NGÀY LIÊN HỆ GẦN NHẤT', 'NGÀY HẸN GỌI LẠI / FOLLOW-UP', 'NỘI DUNG CẦN CHĂM SÓC / GHI CHÚ',
    'MỨC ĐỘ TIỀM NĂNG', 'TRẠNG THÁI NHẮC LỊCH'
  ]];
  shCrm.getRange('A2:N2').setValues(crmHeaders).setBackground('#115E59').setFontColor('#FFFFFF').setFontWeight('bold');

  var today = new Date();
  function fmtDateOffset(days) {
    var d = new Date(today.getTime() + days * 86400000);
    return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }

  var crmData = [
    ['KH-001', 'Tập đoàn Bất Động Sản SunLand', 'Anh Minh (GĐ Marketing)', '0912345678', 'minh.gd@sunland.vn', 'Giới thiệu B2B', 'Đã Ký HĐ / Triển Khai', 185000000, 'Lê Minh Thư (Leader CRM)', fmtDateOffset(-5), fmtDateOffset(1), 'Họp nghiệm thu giai đoạn 1 dự án Portal BĐS & thu đợt 2', 'VIP - Rất Cao', 'Chưa nhắc'],
    ['KH-002', 'Chuỗi Thẩm Mỹ Viện Aura Beauty', 'Chị Lan (Founder)', '0987654321', 'lan.founder@aurabeauty.vn', 'Facebook Ads', 'Đã Ký HĐ / Triển Khai', 95000000, 'Lê Minh Thư (Leader CRM)', fmtDateOffset(-3), fmtDateOffset(0), 'Gửi kịch bản Chatbot Zalo OA & xác nhận lịch đào tạo nhân sự', 'VIP - Rất Cao', 'Chưa nhắc'],
    ['KH-003', 'Công ty Logistics Đại Dương Xanh', 'Anh Hùng (GĐ Vận Hành)', '0933445566', 'hung.ops@daiduongxanh.vn', 'Website Inbound', 'Đàm Phán Hợp Đồng', 140000000, 'Trần Hoàng Nam (PM)', fmtDateOffset(-2), fmtDateOffset(0), 'Gửi lại bảng báo giá điều chỉnh module điều phối xe tải', 'Cao (Hot Lead)', 'Chưa nhắc'],
    ['KH-004', 'Hệ thống Nha Khoa Quốc Tế SmileCare', 'BS. Tuấn (Giám Đốc)', '0944556677', 'tuan.dr@smilecare.vn', 'Sự kiện / Hội thảo', 'Gửi Báo Giá / Demo', 68000000, 'Lê Minh Thư (Leader CRM)', fmtDateOffset(-1), fmtDateOffset(2), 'Demo trực tiếp hệ thống đặt lịch hẹn & nhắc lịch tái khám Zalo', 'Cao (Hot Lead)', 'Chưa nhắc'],
    ['KH-005', 'Nhà Máy Sản Xuất Nội Thất Mộc Việt', 'Anh Quang (Trưởng Phòng Mua)', '0977889900', 'quang.mocviet@gmail.com', 'Zalo OA', 'Đang Tư Vấn', 110000000, 'Lê Minh Thư (Leader CRM)', fmtDateOffset(-4), fmtDateOffset(-1), 'Quá hạn gọi lại tư vấn gói ERP Quản lý xưởng & kho vật tư', 'Trung Bình (Warm)', 'Quá hạn cần gọi ngay'],
    ['KH-006', 'Học Viện Anh Ngữ Global Edu', 'Cô Thảo (Hiệu Trưởng)', '0966112233', 'thao.edu@globaledu.vn', 'Google Search', 'Chăm Sóc Tái Ký', 75000000, 'Trần Hoàng Nam (PM)', fmtDateOffset(-7), fmtDateOffset(3), 'Chăm sóc gia hạn hợp đồng bảo trì năm thứ 2 & nâng cấp CRM', 'VIP - Rất Cao', 'Đã nhắc Email/Zalo']
  ];
  shCrm.getRange(3, 1, crmData.length, 14).setValues(crmData);
  shCrm.getRange(3, 4, crmData.length, 1).setNumberFormat('@');
  shCrm.getRange(3, 8, crmData.length, 1).setNumberFormat('#,##0');
  shCrm.getRange(3, 10, crmData.length, 2).setNumberFormat('@');
  for (var c2 = 1; c2 <= 14; c2++) shCrm.setColumnWidth(c2, 165);
  shCrm.setColumnWidth(2, 240);
  shCrm.setColumnWidth(12, 320);

  // =========================================================================
  // 4. TAB DU_AN (PROJECT PORTFOLIO)
  // =========================================================================
  var shPrj = ss.getSheetByName('DU_AN');
  shPrj.getRange('A1:N1').merge().setValue('🚀 DANH MỤC DỰ ÁN TRIỂN KHAI, TIẾN ĐỘ & NGÂN SÁCH (PROJECT PORTFOLIO)')
    .setBackground('#1D4ED8').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shPrj.setRowHeight(1, 36);

  var prjHeaders = [[
    'MÃ DỰ ÁN', 'TÊN DỰ ÁN TRIỂN KHAI', 'MÃ KH CRM', 'KHÁCH HÀNG / ĐỐI TÁC', 'QUẢN LÝ DỰ ÁN (PM)',
    'LOẠI DỰ ÁN', 'MỨC ĐỘ ƯU TIÊN', 'NGÀY BẮT ĐẦU', 'HẠN BÀN GIAO (DEADLINE)', 'TRẠNG THÁI DỰ ÁN',
    '% TIẾN ĐỘ', 'NGÂN SÁCH HỢP ĐỒNG (VNĐ)', 'CHI PHÍ THỰC TẾ (VNĐ)', 'GHI CHÚ / MỤC TIÊU DỰ ÁN'
  ]];
  shPrj.getRange('A2:N2').setValues(prjHeaders).setBackground('#1E40AF').setFontColor('#FFFFFF').setFontWeight('bold');

  var prjData = [
    ['DA-001', 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', 'KH-001', 'Tập đoàn Bất Động Sản SunLand', 'Trần Hoàng Nam (PM)', 'Phần mềm & CRM', 'Cao', fmtDateOffset(-20), fmtDateOffset(10), 'Đang thực hiện', 65, 185000000, 92000000, 'Hoàn thiện phân hệ giỏ hàng BĐS, phân quyền sàn và Bot nhắc lịch hẹn khách'],
    ['DA-002', 'Xây dựng Hệ thống Đặt Lịch & Tự Động Hóa Zalo OA Aura Beauty', 'KH-002', 'Chuỗi Thẩm Mỹ Viện Aura Beauty', 'Trần Hoàng Nam (PM)', 'Automation & POS', 'Cao', fmtDateOffset(-14), fmtDateOffset(5), 'Đang thực hiện', 80, 95000000, 48000000, 'Tích hợp thẻ liệu trình VIP, nhắc lịch tái khám qua Zalo & Email tự động'],
    ['DA-003', 'Nâng cấp Cổng Học Viên & Quản Lý Lớp Học Global Edu v2.0', 'KH-006', 'Học Viện Anh Ngữ Global Edu', 'Nguyễn Quản Trị (CEO/PMO)', 'EdTech Platform', 'Trung bình', fmtDateOffset(-30), fmtDateOffset(-2), 'Hoàn thành', 100, 75000000, 41000000, 'Đã bàn giao nghiệm thu 100%, chuyển sang giai đoạn bảo hành & chăm sóc tái ký'],
    ['DA-004', 'Thiết kế Prototype Điều Phối Vận Tải Đại Dương Xanh', 'KH-003', 'Công ty Logistics Đại Dương Xanh', 'Phạm Tuấn Kiệt (Tech Lead)', 'Tư vấn & Prototype', 'Cao', fmtDateOffset(-5), fmtDateOffset(7), 'Chờ duyệt', 45, 140000000, 25000000, 'Đang chờ khách hàng duyệt bản mẫu UI/UX Dashboard theo dõi đội xe']
  ];
  shPrj.getRange(3, 1, prjData.length, 14).setValues(prjData);
  shPrj.getRange(3, 8, prjData.length, 2).setNumberFormat('@');
  shPrj.getRange(3, 12, prjData.length, 2).setNumberFormat('#,##0');
  for (var c3 = 1; c3 <= 14; c3++) shPrj.setColumnWidth(c3, 160);
  shPrj.setColumnWidth(2, 280);
  shPrj.setColumnWidth(14, 300);

  // =========================================================================
  // 5. TAB CONG_VIEC (KANBAN / GANTT / KPI / RACI ĐA BỘ PHẬN / FILE ĐÍNH KÈM)
  // =========================================================================
  var shTask = ss.getSheetByName('CONG_VIEC');
  // 5. TAB CONG_VIEC (KANBAN / GANTT / KPI / RACI ĐA BỘ PHẬN / FILE ĐÍNH KÈM)
  // =========================================================================
  var shTask = ss.getSheetByName('CONG_VIEC');
  shTask.getRange('A1:T1').merge().setValue('📋 BẢNG GIAO VIỆC KANBAN, TIMELINE GANTT, RACI ĐA BỘ PHẬN & FILE ĐÍNH KÈM (v4.4 PRO)')
    .setBackground(THEME.taskHeader).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shTask.setRowHeight(1, 36);

  var taskHeaders = [[
    'MÃ CV', 'TÊN CÔNG VIỆC / HẠNG MỤC', 'MÃ DỰ ÁN', 'TÊN DỰ ÁN', 'KHÁCH HÀNG CRM',
    'NGƯỜI CHỦ TRÌ (MAIN PIC)', 'EMAIL NHẬN NHẮC VIỆC', 'SĐT ZALO NHẬN NHẮC', 'TRẠNG THÁI KANBAN',
    'MỨC ĐỘ ƯU TIÊN', 'NGÀY BẮT ĐẦU (GANTT)', 'HẠN CHÓT (DEADLINE)', 'SỐ GIỜ ƯỚC TÍNH',
    '% HOÀN THÀNH', 'ĐIỂM KPI ĐẠT ĐƯỢC', 'TRẠNG THÁI NHẮC VIỆC', 'GHI CHÚ / LINK BÀN GIAO',
    'BỘ PHẬN & NGƯỜI PHỐI HỢP (RACI)', 'CHECKLIST ĐẦU VIỆC CON (SUBTASKS)', 'TỆP ĐÍNH KÈM BÀN GIAO (WORD/EXCEL/PPT/PDF)'
  ]];
  shTask.getRange('A2:T2').setValues(taskHeaders).setBackground('#3730A3').setFontColor('#FFFFFF').setFontWeight('bold');

  var sampleTasks = [
    [
      'CV-101', 'Thiết kế Database & Phân quyền RBAC cho SunLand Portal', 'DA-001', 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', 'Tập đoàn Bất Động Sản SunLand',
      'Phạm Tuấn Kiệt (Tech Lead)', 'kiet.dev@novacrm.vn', '0904567890', 'Hoàn thành', 'Cao', fmtDateOffset(-18), fmtDateOffset(-10), 24, 100, 30, 'Đã nhắc Email/Zalo', 'Đã hoàn tất schema 8 bảng dữ liệu chuẩn',
      JSON.stringify({ departments: ['Khối Kỹ Thuật', 'Phòng Quản Lý Dự Án'], coAssignees: ['Trần Hoàng Nam (PM)'] }),
      JSON.stringify([
        { id: 'ST-1', title: 'Thiết kế ERD & Schema 8 bảng', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: true },
        { id: 'ST-2', title: 'Phê duyệt ma trận phân quyền RBAC', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true }
      ]),
      JSON.stringify([
        { id: 'ATT-101', name: 'Dac_Ta_Database_SunLand_v2.docx', ext: 'docx', size: '420 KB', url: 'https://docs.google.com/document', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: fmtDateOffset(-11) },
        { id: 'ATT-102', name: 'Ma_Tran_Phan_Quyen_RBAC.xlsx', ext: 'xlsx', size: '185 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: fmtDateOffset(-10) }
      ])
    ],
    [
      'CV-102', 'Xây dựng giao diện Mobile-First Bảng hàng & Giỏ căn hộ', 'DA-001', 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', 'Tập đoàn Bất Động Sản SunLand',
      'Võ Ngọc Ánh (UI/UX & Media)', 'anh.design@novacrm.vn', '0905678901', 'Đang làm', 'Cao', fmtDateOffset(-8), fmtDateOffset(1), 32, 75, 22, 'Chưa nhắc', 'Đang tối ưu thanh điều hướng dưới cùng trên iPhone/Android',
      JSON.stringify({ departments: ['Khối Sáng Tạo', 'Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'], coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)', 'Lê Minh Thư (Leader CRM)'] }),
      JSON.stringify([
        { id: 'ST-3', title: 'Thiết kế UI/UX & Slide thuyết trình khách hàng', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true },
        { id: 'ST-4', title: 'Chuẩn hóa trường dữ liệu giỏ căn hộ VIP', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
        { id: 'ST-5', title: 'Ghép API Realtime vào giao diện Mobile', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
      ]),
      JSON.stringify([
        { id: 'ATT-103', name: 'Slide_Trinh_Chieu_UIUX_SunLand.pptx', ext: 'pptx', size: '3.4 MB', url: 'https://docs.google.com/presentation', uploadedBy: 'Võ Ngọc Ánh (UI/UX & Media)', uploadedAt: fmtDateOffset(-2) },
        { id: 'ATT-104', name: 'Checklist_Nghiem_Thu_Giao_Dien.pdf', ext: 'pdf', size: '890 KB', url: 'https://drive.google.com', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: fmtDateOffset(-1) }
      ])
    ],
    [
      'CV-103', 'Tích hợp Webhook Bot Zalo & Gmail tự động báo khách mới cho Sale', 'DA-001', 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', 'Tập đoàn Bất Động Sản SunLand',
      'Phạm Tuấn Kiệt (Tech Lead)', 'kiet.dev@novacrm.vn', '0904567890', 'Đang làm', 'Cao', fmtDateOffset(-5), fmtDateOffset(0), 16, 60, 18, 'Chưa nhắc', 'Đến hạn hôm nay: Cần test kỹ luồng bắn tin nhắn Zalo OA',
      JSON.stringify({ departments: ['Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'], coAssignees: ['Lê Minh Thư (Leader CRM)'] }),
      JSON.stringify([
        { id: 'ST-6', title: 'Viết mẫu nội dung Template Zalo ZNS & Email', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
        { id: 'ST-7', title: 'Kết nối Webhook Zalo OA & Test bắn tin tự động', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
      ]),
      JSON.stringify([
        { id: 'ATT-105', name: 'Kich_Ban_Zalo_ZNS_SunLand.docx', ext: 'docx', size: '310 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: fmtDateOffset(-2) }
      ])
    ],
    [
      'CV-104', 'Soạn kịch bản chăm sóc khách hàng VIP sau liệu trình Aura Beauty', 'DA-002', 'Xây dựng Hệ thống Đặt Lịch & Tự Động Hóa Zalo OA Aura Beauty', 'Chuỗi Thẩm Mỹ Viện Aura Beauty',
      'Lê Minh Thư (Leader CRM)', 'thu.crm@novacrm.vn', '0903456789', 'Chờ duyệt', 'Trung bình', fmtDateOffset(-6), fmtDateOffset(1), 12, 90, 18, 'Chưa nhắc', 'Chờ Chị Lan Founder duyệt câu từ tin nhắn ZNS',
      JSON.stringify({ departments: ['Phòng Kinh Doanh & CRM', 'Khối Sáng Tạo'], coAssignees: ['Võ Ngọc Ánh (UI/UX & Media)'] }),
      JSON.stringify([
        { id: 'ST-8', title: 'Soạn thảo quy trình 7 ngày chăm sóc sau liệu trình (Word)', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
        { id: 'ST-9', title: 'Thiết kế Banner & E-voucher đính kèm tin nhắn Zalo', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true }
      ]),
      JSON.stringify([
        { id: 'ATT-106', name: 'Quy_Trinh_CSKH_VIP_AuraBeauty.docx', ext: 'docx', size: '540 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: fmtDateOffset(-1) },
        { id: 'ATT-107', name: 'Bang_Tinh_Chi_Phi_Chien_Dich_ZNS.xlsx', ext: 'xlsx', size: '240 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: fmtDateOffset(-1) }
      ])
    ],
    [
      'CV-105', 'Cấu hình Trigger nhắc lịch tái khám tự động 8h sáng hàng ngày', 'DA-002', 'Xây dựng Hệ thống Đặt Lịch & Tự Động Hóa Zalo OA Aura Beauty', 'Chuỗi Thẩm Mỹ Viện Aura Beauty',
      'Trần Hoàng Nam (PM)', 'nam.pm@novacrm.vn', '0902345678', 'Cần làm', 'Cao', fmtDateOffset(-2), fmtDateOffset(-1), 8, 20, 5, 'Quá hạn cần nhắc ngay', 'Quá hạn 1 ngày: Cần bàn giao gấp trước buổi nghiệm thu',
      JSON.stringify({ departments: ['Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật'], coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)'] }),
      JSON.stringify([
        { id: 'ST-10', title: 'Rà soát danh sách khách hàng tái khám đợt 1', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true },
        { id: 'ST-11', title: 'Bật Cron Trigger 8h sáng & kiểm tra nhật ký gửi', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
      ]),
      JSON.stringify([
        { id: 'ATT-108', name: 'Huong_Dan_Van_Hanh_Trigger_Aura.pdf', ext: 'pdf', size: '1.1 MB', url: 'https://drive.google.com', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: fmtDateOffset(-1) }
      ])
    ],
    [
      'CV-106', 'Thiết kế Mockup Bản đồ GPS & Bảng điều phối chuyến xe tải', 'DA-004', 'Thiết kế Prototype Điều Phối Vận Tải Đại Dương Xanh', 'Công ty Logistics Đại Dương Xanh',
      'Võ Ngọc Ánh (UI/UX & Media)', 'anh.design@novacrm.vn', '0905678901', 'Chờ duyệt', 'Cao', fmtDateOffset(-4), fmtDateOffset(2), 20, 85, 25, 'Đã nhắc Email/Zalo', 'Đã gửi link Figma & Slide PowerPoint cho Anh Hùng xem trước',
      JSON.stringify({ departments: ['Khối Sáng Tạo', 'Phòng Quản Lý Dự Án'], coAssignees: ['Trần Hoàng Nam (PM)'] }),
      JSON.stringify([
        { id: 'ST-12', title: 'Vẽ Prototype màn hình điều phối xe tải', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true },
        { id: 'ST-13', title: 'Xuất file PowerPoint thuyết trình Ban Giám Đốc', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true }
      ]),
      JSON.stringify([
        { id: 'ATT-109', name: 'Demo_Dieu_Phoi_Xe_Tai_DaiDuongXanh.pptx', ext: 'pptx', size: '4.8 MB', url: 'https://docs.google.com/presentation', uploadedBy: 'Võ Ngọc Ánh (UI/UX & Media)', uploadedAt: fmtDateOffset(0) }
      ])
    ],
    [
      'CV-107', 'Lập báo giá chi tiết & Hợp đồng triển khai ERP Đại Dương Xanh', 'DA-004', 'Thiết kế Prototype Điều Phối Vận Tải Đại Dương Xanh', 'Công ty Logistics Đại Dương Xanh',
      'Lê Minh Thư (Leader CRM)', 'thu.crm@novacrm.vn', '0903456789', 'Cần làm', 'Trung bình', fmtDateOffset(0), fmtDateOffset(3), 10, 50, 10, 'Chưa nhắc', 'Chuẩn bị phụ lục SLA cam kết tiến độ cùng Kỹ thuật & PM',
      JSON.stringify({ departments: ['Phòng Kinh Doanh & CRM', 'Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật'], coAssignees: ['Trần Hoàng Nam (PM)', 'Phạm Tuấn Kiệt (Tech Lead)'] }),
      JSON.stringify([
        { id: 'ST-14', title: 'Bóc tách bảng tính chi phí nhân công & Server (Excel)', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: true },
        { id: 'ST-15', title: 'Soạn dự thảo Hợp đồng kinh tế & Phụ lục SLA (Word/PDF)', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: false }
      ]),
      JSON.stringify([
        { id: 'ATT-110', name: 'Bang_Bao_Gia_ERP_DaiDuongXanh_2025.xlsx', ext: 'xlsx', size: '615 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: fmtDateOffset(0) },
        { id: 'ATT-111', name: 'Du_Thao_Hop_Dong_ERP_SLA.docx', ext: 'docx', size: '780 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: fmtDateOffset(0) }
      ])
    ],
    [
      'CV-108', 'Nghiệm thu & Bàn giao tài liệu hướng dẫn quản trị Global Edu', 'DA-003', 'Nâng cấp Cổng Học Viên & Quản Lý Lớp Học Global Edu v2.0', 'Học Viện Anh Ngữ Global Edu',
      'Trần Hoàng Nam (PM)', 'nam.pm@novacrm.vn', '0902345678', 'Hoàn thành', 'Trung bình', fmtDateOffset(-12), fmtDateOffset(-3), 14, 100, 20, 'Đã nhắc Email/Zalo', 'Khách hàng đánh giá 5 sao, đã ký biên bản nghiệm thu PDF & thanh toán 100%',
      JSON.stringify({ departments: ['Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'], coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)', 'Lê Minh Thư (Leader CRM)'] }),
      JSON.stringify([
        { id: 'ST-16', title: 'Đào tạo hướng dẫn sử dụng & bàn giao tài liệu PDF', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true },
        { id: 'ST-17', title: 'Ký biên bản nghiệm thu & tất toán hợp đồng', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true }
      ]),
      JSON.stringify([
        { id: 'ATT-112', name: 'Bien_Ban_Nghiem_Thu_GlobalEdu_Signed.pdf', ext: 'pdf', size: '1.6 MB', url: 'https://drive.google.com', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: fmtDateOffset(-3) },
        { id: 'ATT-113', name: 'Tai_Lieu_Huong_Dan_Quan_Tri_v2.docx', ext: 'docx', size: '2.1 MB', url: 'https://docs.google.com/document', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: fmtDateOffset(-4) }
      ])
    ]
  ];
  shTask.getRange(3, 1, sampleTasks.length, 20).setValues(sampleTasks);
  shTask.getRange(3, 8, sampleTasks.length, 1).setNumberFormat('@');
  shTask.getRange(3, 11, sampleTasks.length, 2).setNumberFormat('@');
  for (var c4 = 1; c4 <= 20; c4++) shTask.setColumnWidth(c4, 155);
  shTask.setColumnWidth(2, 270);
  shTask.setColumnWidth(4, 230);
  shTask.setColumnWidth(17, 260);
  shTask.setColumnWidth(18, 260);
  shTask.setColumnWidth(19, 280);
  shTask.setColumnWidth(20, 280);

  // =========================================================================
  // 6. TAB LICH_NHAC_TUDONG (AUTOMATED REMINDER LOGS & QUEUE)
  // =========================================================================
  var shRem = ss.getSheetByName('LICH_NHAC_TUDONG');
  shRem.getRange('A1:K1').merge().setValue('🔔 NHẬT KÝ & HÀNG ĐỢI NHẮC VIỆC TỰ ĐỘNG QUA EMAIL, BOT ZALO & TELEGRAM')
    .setBackground(THEME.botHeader).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shRem.setRowHeight(1, 36);

  var remHeaders = [[
    'MÃ NHẮC', 'THỜI GIAN GỬI', 'LOẠI NHẮC VIỆC', 'MÃ THAM CHIẾU (CV/KH)', 'TIÊU ĐỀ CÔNG VIỆC / KHÁCH HÀNG',
    'NGƯỜI NHẬN', 'EMAIL NGƯỜI NHẬN', 'SĐT ZALO NHẬN', 'KÊNH GỬI (EMAIL / ZALO / TELEGRAM)',
    'TRẠNG THÁI GỬI', 'NỘI DUNG TIN NHẮN ĐÃ GỬI'
  ]];
  shRem.getRange('A2:K2').setValues(remHeaders).setBackground('#92400E').setFontColor('#FFFFFF').setFontWeight('bold');

  var nowStr = Utilities.formatDate(today, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
  var remData = [
    ['RM-1001', nowStr, 'NHẮC DEADLINE CÔNG VIỆC', 'CV-105', 'Cấu hình Trigger nhắc lịch tái khám tự động 8h sáng hàng ngày', 'Trần Hoàng Nam (PM)', 'nam.pm@novacrm.vn', '0902345678', 'EMAIL + BOT ZALO', 'Thành công', '[CẢNH BÁO QUÁ HẠN] Công việc CV-105 thuộc dự án DA-002 đã đến hạn. Vui lòng cập nhật tiến độ!'],
    ['RM-1002', nowStr, 'NHẮC LỊCH HẸN CRM', 'KH-002', 'Chuỗi Thẩm Mỹ Viện Aura Beauty - Chị Lan (Founder)', 'Lê Minh Thư (Leader CRM)', 'thu.crm@novacrm.vn', '0903456789', 'BOT ZALO + EMAIL', 'Thành công', '[NHẮC LỊCH CRM HÔM NAY] Đến lịch chăm sóc khách hàng KH-002 (Aura Beauty): Gửi kịch bản Chatbot Zalo OA.'],
    ['RM-1003', nowStr, 'NHẮC DEADLINE CÔNG VIỆC', 'CV-103', 'Tích hợp Webhook Bot Zalo & Gmail tự động báo khách mới cho Sale', 'Phạm Tuấn Kiệt (Tech Lead)', 'kiet.dev@novacrm.vn', '0904567890', 'EMAIL + BOT ZALO', 'Thành công', '[NHẮC VIỆC HÔM NAY] Công việc CV-103 đến hạn chót hôm nay. Tiến độ hiện tại: 60%.']
  ];
  shRem.getRange(3, 1, remData.length, 11).setValues(remData);
  shRem.getRange(3, 8, remData.length, 1).setNumberFormat('@');
  for (var c5 = 1; c5 <= 11; c5++) shRem.setColumnWidth(c5, 165);
  shRem.setColumnWidth(5, 250);
  shRem.setColumnWidth(11, 360);

  // =========================================================================
  // 7. TAB NHAT_KY (AUDIT LOGS)
  // =========================================================================
  var shLog = ss.getSheetByName('NHAT_KY');
  shLog.getRange('A1:F1').merge().setValue('📜 NHẬT KÝ HOẠT ĐỘNG HỆ THỐNG (SYSTEM AUDIT TRAIL)')
    .setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shLog.setRowHeight(1, 36);
  shLog.getRange('A2:F2').setValues([['THỜI GIAN', 'NGƯỜI THỰC HIỆN', 'VAI TRÒ', 'HÀNH ĐỘNG', 'ĐỐI TƯỢNG', 'CHI TIẾT THAO TÁC']])
    .setBackground('#475569').setFontColor('#FFFFFF').setFontWeight('bold');
  shLog.getRange(3, 1, 1, 6).setValues([[nowStr, 'admin', 'ADMIN', 'INSTALL_SYSTEM', 'GS-004 v4.0 Pro', 'Khởi tạo thành công 8 tab Hệ thống Quản lý Dự án, CRM, Kanban/Gantt, KPI & Bot Nhắc Việc Tự Động']]);
  shLog.setColumnWidth(1, 170);
  shLog.setColumnWidth(2, 160);
  shLog.setColumnWidth(3, 120);
  shLog.setColumnWidth(4, 170);
  shLog.setColumnWidth(5, 160);
  shLog.setColumnWidth(6, 420);

  // =========================================================================
  // 8. TAB DASHBOARD (EXECUTIVE SUMMARY FORMULAS)
  // =========================================================================
  var shDash = ss.getSheetByName('DASHBOARD');
  shDash.getRange('A1:H1').merge().setValue('📊 BẢNG ĐIỀU HÀNH TỔNG HỢP DỰ ÁN, CRM PIPELINE, KANBAN & KPI (GS-004 v4.0 COMMERCIAL PRO)')
    .setBackground(THEME.primary).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
  shDash.setRowHeight(1, 42);

  shDash.getRange('A3:B3').merge().setValue('CHỈ SỐ ĐIỀU HÀNH (KPI METRICS)').setBackground(THEME.secondary).setFontColor('#FFFFFF').setFontWeight('bold');
  shDash.getRange('C3').setValue('GIÁ TRỊ HIỆN TẠI').setBackground(THEME.secondary).setFontColor('#FFFFFF').setFontWeight('bold');
  shDash.getRange('D3:H3').merge().setValue('DIỄN GIẢI / CÔNG THỨC TỰ ĐỘNG').setBackground(THEME.secondary).setFontColor('#FFFFFF').setFontWeight('bold');

  var dashRows = [
    ['1. Tổng số Dự án đang quản lý', '', '=COUNTA(DU_AN!A3:A200)', 'Đếm tự động từ tab DU_AN'],
    ['2. Tiến độ hoàn thành Dự án trung bình (%)', '', '=IFERROR(ROUND(AVERAGE(DU_AN!K3:K200),1),0)', 'Trung bình cộng % Tiến độ các dự án'],
    ['3. Tổng ngân sách Hợp đồng Dự án (VNĐ)', '', '=SUM(DU_AN!L3:L200)', 'Tổng giá trị hợp đồng các dự án đang triển khai'],
    ['4. Tổng số Công việc trên bảng Kanban', '', '=COUNTA(CONG_VIEC!A3:A500)', 'Tổng số đầu việc đã giao trên toàn hệ thống'],
    ['5. Số Công việc Đã hoàn thành (Done)', '', '=COUNTIF(CONG_VIEC!I3:I500, "Hoàn thành")', 'Số công việc ở cột Hoàn thành'],
    ['6. Số Công việc Đang thực hiện (In Progress)', '', '=COUNTIF(CONG_VIEC!I3:I500, "Đang làm")', 'Số công việc đang triển khai'],
    ['7. Tổng số Khách hàng & Cơ hội trong Phễu CRM', '', '=COUNTA(KHACH_HANG_CRM!A3:A500)', 'Tổng số khách hàng & Lead trong tab KHACH_HANG_CRM'],
    ['8. Tổng giá trị Deal dự kiến trong Phễu CRM (VNĐ)', '', '=SUM(KHACH_HANG_CRM!H3:H500)', 'Tổng doanh thu kỳ vọng từ Phễu bán hàng CRM'],
    ['9. Tổng điểm KPI nhân sự đã tích lũy', '', '=SUM(CONG_VIEC!O3:O500)', 'Tổng điểm KPI đạt được của toàn đội ngũ'],
    ['10. Tổng lượt Nhắc việc Tự động đã gửi (Email/Zalo)', '', '=COUNTA(LICH_NHAC_TUDONG!A3:A1000)', 'Số thông báo đã bắn qua Email & Bot Zalo/Telegram']
  ];

  dashRows.forEach(function(r, idx) {
    var rowNum = 4 + idx;
    shDash.getRange(rowNum, 1, 1, 2).merge().setValue(r[0]).setFontWeight('bold');
    shDash.getRange(rowNum, 3).setFormula(r[2]).setFontWeight('bold').setFontColor('#1D4ED8').setHorizontalAlignment('right');
    shDash.getRange(rowNum, 4, 1, 5).merge().setValue(r[3]).setFontColor('#475569');
    if (idx === 2 || idx === 7) {
      shDash.getRange(rowNum, 3).setNumberFormat('#,##0');
    }
  });

  shDash.setColumnWidth(1, 180);
  shDash.setColumnWidth(2, 180);
  shDash.setColumnWidth(3, 180);
  for (var c6 = 4; c6 <= 8; c6++) shDash.setColumnWidth(c6, 140);

  SpreadsheetApp.flush();

  if (ui) {
    ui.alert(
      '✅ KHỞI TẠO HỆ THỐNG GS-004 v4.0 PRO THÀNH CÔNG!',
      'Đã tạo đầy đủ 8 Tab chuẩn:\n' +
      '1. DASHBOARD (Chỉ số tổng hợp)\n' +
      '2. KHACH_HANG_CRM (Phễu CRM & Lịch hẹn chăm sóc)\n' +
      '3. DU_AN (Danh mục dự án & Ngân sách)\n' +
      '4. CONG_VIEC (Kanban 4 cột, Gantt Timeline & Điểm KPI)\n' +
      '5. LICH_NHAC_TUDONG (Nhật ký Bot nhắc việc Email/Zalo/Telegram)\n' +
      '6. PHAN_QUYEN (Tài khoản RBAC)\n' +
      '7. CAU_HINH (Cấu hình Webhook Zalo, Email, Giờ chạy tự động)\n' +
      '8. NHAT_KY (Audit Trail)\n\n' +
      '👉 Hãy bấm menu "🎯 DỰ ÁN, CRM, KANBAN & NHẮC VIỆC PRO (v4.0)" ➔ "🚀 1. Mở Web App..." để trải nghiệm ngay!',
      ui.ButtonSet.OK
    );
  }
  return { ok: true, message: 'Khởi tạo thành công 8 tab GS-004 v4.0 Commercial Pro!' };
}
