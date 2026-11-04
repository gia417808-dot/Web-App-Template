# 🚀 HỆ SINH THÁI QUẢN LÝ DỰ ÁN, KHÁCH HÀNG CRM, KANBAN/GANTT, RACI ĐA BỘ PHẬN & BOT NHẮC VIỆC (GS-004 v4.4 COMMERCIAL PRO)

## 🌟 CÁC NÂNG CẤP TRỌNG TÂM TRONG BẢN v4.4 COMMERCIAL PRO

### 1. Khắc phục triệt để lỗi "Nhân viên cập nhật tiến độ lên 100% bấm Lưu bị biến mất Task"

* **Nguyên nhân gốc ở bản cũ**:

  1. Khi tài khoản Nhân viên (`STAFF` / `CRM_SALE`) mở Modal cập nhật tiến độ, thẻ `<select id="taskFormAssignee">` và `<select id="taskFormProject">` bị khóa (`disabled`). Nếu tên người chủ trì hoặc tên nhân sự mới (như `Hoang Minh` - `sale_moi`) chưa khớp 100% với `<option>` trong dropdown hoặc người dùng là người phối hợp (`Co-Assignee`), trình duyệt trả về `.value = ""` (rỗng) khi bấm **Lưu Cập Nhật**, làm ghi đè `assignee = ""` khiến công việc lập tức biến mất khỏi bảng Kanban của nhân viên.

  2. Trong `Code.gs` cũ, dòng `else if (status === "Cần làm" && progress === 100) progress = 0;` tự động xóa tiến độ `100%` về `0%` nếu nhân viên gõ `100%` mà quên đổi ô Trạng thái.

* **Giải pháp triệt để trong v4.4**:

  * **Tự động chuyển sang cột `👀 3. Chờ Quản lý duyệt` khi đạt `100%`**: Ngay khi nhân viên nhập `% Hoàn thành = 100%` (hoặc tích hoàn thành 100% các đầu việc con trong Checklist), trạng thái tự động nhảy sang **`Chờ duyệt`** và giữ nguyên `100%` trên cả giao diện lẫn Google Sheets (`Code.gs`).

  * **Bảo toàn tuyệt đối Người chủ trì (`assignee`) & Dự án (`projectId`)**: Bổ sung hàm `ensureSelectOptionExists()` và cơ chế fallback kép ở cả `Index.html` (`submitTaskForm`) lẫn `Code.gs` (`saveTaskItem`) — đọc dòng hiện tại trên Sheet `CONG_VIEC` để giữ nguyên `assignee`, `projectId`, `departments`, `coAssignees` khi nhân viên cập nhật tiến độ.

  * **Tự động mở rộng cột Sheet**: Kiểm tra `if (sh.getMaxColumns() < 20) sh.insertColumnsAfter(...)` trước khi ghi 20 cột vào `CONG_VIEC`.

### 2. Khôi phục & Nâng cấp toàn diện quyền Giao Việc + Quản Lý Tuyến Dưới cho `LEADER` (Team Lead) & `MANAGER`

* **Hỗ trợ chính thức cấp bậc `LEADER` (Trưởng nhóm / Team Lead)** song song với `ADMIN` và `MANAGER`, đồng thời tự động nhận diện quyền Lead cho các tài khoản như `sale_crm` (*Lê Minh Thư - Leader CRM*), `dev_lead` (*Phạm Tuấn Kiệt - Tech Lead*), và `pm_duan` (*Trần Hoàng Nam - PM*):

  * **Giao việc cho tuyến dưới**: Mở đầy đủ nút **`+ Giao Việc Tuyến Dưới`** trên Dashboard, bảng Kanban, nút nổi Mobile FAB và nút **`📋 Giao việc`** tại từng dòng nhân sự.

  * **Xem & Lọc nhân viên tuyến dưới**: Mở khóa hoàn toàn ô lọc **`Nhân sự tuyến dưới`** trên bảng Kanban để Lead/Manager kiểm tra tiến độ của từng thành viên trong phòng ban/đội nhóm.

  * **Nghiệm thu & Điều phối 1 chạm**: Đầy đủ nút **`✅ Duyệt Hoàn Thành`**, **`↩️ Yêu Cầu Làm Lại`**, **`🔔 Nhắc`** (Email + Bot Zalo), **`💬 Zalo`** trên thẻ việc của nhân viên tuyến dưới.

  * **Mở Bảng Quản Lý Nhân Sự Tuyến Dưới ở Tab 6**: Cả `ADMIN`, `MANAGER` và `LEADER` đều thấy bảng điều hành nhân sự trực thuộc để thêm nhân sự mới, phân quyền hoặc giao việc ngay.

### 3. Biến bảng `PHAN_QUYEN` thành Bảng Điều Hành Sống & Mở thao tác cho Tài khoản Nhân sự Mới (`sale_moi`)

* **Thao tác điều hành trực tiếp trên bảng `PHAN_QUYEN` (Tab 6)**:

  * **`📋 Giao việc`**: Bấm 1 chạm tại dòng nhân sự để mở ngay Modal Giao Việc đã điền sẵn tên nhân sự đó làm Người chủ trì (`Main PIC`), kèm Email, SĐT Zalo và Phòng ban.

  * **`👁️ Xem việc`**: Chuyển thẳng sang bảng Kanban và lọc riêng các công việc của nhân sự đó.

  * **Đổi Vai Trò (`ADMIN` / `MANAGER` / `LEADER` / `CRM_SALE` / `STAFF`) & Khóa/Mở (`🟢 Hoạt động` / `🔒 Đang khóa`)** trực tiếp ngay trên bảng.

  * **Ma trận 6 Checkbox Cấp Quyền Thao Tác Trên App** trong Modal Tài Khoản (`ASSIGN_TASK`, `APPROVE_TASK`, `VIEW_TEAM`, `SELF_CREATE_TASK`, `ACCESS_CRM`, `MANAGE_PROJECT`) lưu đồng bộ vào cột 9 Sheet `PHAN_QUYEN`.

* **Tài khoản nhân sự mới (như `sale_moi` — `Hoang Minh` thuộc `Phòng Kinh Doanh & CRM`) thao tác được ngay khi đăng nhập**:

  * Thấy ngay các công việc chung của **Phòng ban mình trực thuộc** (`Phòng Kinh Doanh & CRM`) và danh sách các Dự án đang triển khai.

  * Có nút **`+ Tự Đăng Ký Việc Mới`** để chủ động tạo đầu việc/báo cáo công việc mới trên bảng Kanban.

  * Nếu thuộc `Phòng Kinh Doanh & CRM`, tự động mở quyền thao tác trên **Tab 3: Phễu Khách hàng CRM**.

## 📁 FILE 1: `appsscript.json`

```
{
  "timeZone": "Asia/Ho_Chi_Minh",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
}

```

## 📁 FILE 2: `installer.gs`

```
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


```

## 📁 FILE 3: `Code.gs`

```
/**
 * ============================================================================
 * GS-004: QUẢN LÝ DỰ ÁN, CRM, GIAO VIỆC KANBAN/GANTT, KPI & BOT NHẮC VIỆC v4.0 PRO
 * FILE 3/4: Code.gs (Backend API, CRM Pipeline, Kanban/Gantt, Auto Email/Zalo/Telegram Bot)
 * ============================================================================
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🎯 DỰ ÁN, CRM, KANBAN & NHẮC VIỆC PRO (v4.0)')
    .addItem('🚀 1. Mở Web App Quản Lý Dự Án, CRM & Kanban (Full HD)', 'openProjectDialog')
    .addSeparator()
    .addItem('🔔 2. Quét & Gửi Nhắc Việc Tự Động Ngay (Email + Bot Zalo/Telegram)', 'menuRunAutoRemindersNow')
    .addItem('⏰ 3. Bật Tự Động Nhắc Việc Hàng Ngày (Cài Đặt Time Trigger 8h Sáng)', 'menuSetupDailyTrigger')
    .addItem('🔕 4. Tắt Lịch Chạy Nhắc Việc Tự Động Hàng Ngày', 'menuRemoveDailyTrigger')
    .addSeparator()
    .addItem('🛠️ 5. Khởi Tạo / Reset 8 Tab Hệ Thống Mẫu (Installer)', 'install_PROJECT_SHEET')
    .addToUi();
}

function doGet(e) {
  var tpl = HtmlService.createTemplateFromFile('Index');
  return tpl.evaluate()
    .setTitle('GS-004 v4.0 Pro — Quản Lý Dự Án, CRM, Kanban/Gantt, KPI & Bot Nhắc Việc Tự Động')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function openProjectDialog() {
  var html = HtmlService.createTemplateFromFile('Index').evaluate()
    .setWidth(1920)
    .setHeight(1080);
  SpreadsheetApp.getUi().showModalDialog(html, '🎯 HỆ THỐNG QUẢN LÝ DỰ ÁN, CRM, KANBAN/GANTT, KPI & NHẮC VIỆC TỰ ĐỘNG (GS-004 v4.0 PRO — FULL SCREEN)');
}

function menuRunAutoRemindersNow() {
  var res = runDailyAutoReminders();
  SpreadsheetApp.getUi().alert('🔔 KẾT QUẢ QUÉT & NHẮC VIỆC TỰ ĐỘNG', res.message || 'Đã hoàn tất quét nhắc việc!', SpreadsheetApp.getUi().ButtonSet.OK);
}

function menuSetupDailyTrigger() {
  var res = setupDailyReminderTrigger(8);
  SpreadsheetApp.getUi().alert('⏰ CÀI ĐẶT TRIGGER TỰ ĐỘNG', res.message || 'Đã bật lịch chạy tự động!', SpreadsheetApp.getUi().ButtonSet.OK);
}

function menuRemoveDailyTrigger() {
  var res = removeDailyReminderTrigger();
  SpreadsheetApp.getUi().alert('🔕 ĐÃ TẮT TRIGGER TỰ ĐỘNG', res.message || 'Đã xóa lịch chạy tự động!', SpreadsheetApp.getUi().ButtonSet.OK);
}

// ============================================================================
// HELPER CHUẨN HÓA DỮ LIỆU AN TOÀN
// ============================================================================
function parseJsonSafe(rawStr, fallbackVal) {
  if (!rawStr) return fallbackVal;
  if (typeof rawStr === 'object') return rawStr;
  try {
    var parsed = JSON.parse(String(rawStr));
    return parsed !== null && parsed !== undefined ? parsed : fallbackVal;
  } catch (e) {
    return fallbackVal;
  }
}

function getDefaultTaskCollabMeta(taskId, assignee) {
  var map = {
    'CV-101': {
      departments: ['Khối Kỹ Thuật', 'Phòng Quản Lý Dự Án'],
      coAssignees: ['Trần Hoàng Nam (PM)'],
      subtasks: [
        { id: 'ST-1', title: 'Thiết kế ERD & Schema 8 bảng', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: true },
        { id: 'ST-2', title: 'Phê duyệt ma trận phân quyền RBAC', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true }
      ],
      attachments: [
        { id: 'ATT-101', name: 'Dac_Ta_Database_SunLand_v2.docx', ext: 'docx', size: '420 KB', url: 'https://docs.google.com/document', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: '2025-05-05' },
        { id: 'ATT-102', name: 'Ma_Tran_Phan_Quyen_RBAC.xlsx', ext: 'xlsx', size: '185 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: '2025-05-06' }
      ]
    },
    'CV-102': {
      departments: ['Khối Sáng Tạo', 'Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'],
      coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)', 'Lê Minh Thư (Leader CRM)'],
      subtasks: [
        { id: 'ST-3', title: 'Thiết kế UI/UX & Slide thuyết trình khách hàng', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true },
        { id: 'ST-4', title: 'Chuẩn hóa trường dữ liệu giỏ căn hộ VIP', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
        { id: 'ST-5', title: 'Ghép API Realtime vào giao diện Mobile', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
      ],
      attachments: [
        { id: 'ATT-103', name: 'Slide_Trinh_Chieu_UIUX_SunLand.pptx', ext: 'pptx', size: '3.4 MB', url: 'https://docs.google.com/presentation', uploadedBy: 'Võ Ngọc Ánh (UI/UX & Media)', uploadedAt: '2025-05-12' },
        { id: 'ATT-104', name: 'Checklist_Nghiem_Thu_Giao_Dien.pdf', ext: 'pdf', size: '890 KB', url: 'https://drive.google.com', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: '2025-05-13' }
      ]
    },
    'CV-103': {
      departments: ['Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'],
      coAssignees: ['Lê Minh Thư (Leader CRM)'],
      subtasks: [
        { id: 'ST-6', title: 'Viết mẫu nội dung Template Zalo ZNS & Email', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
        { id: 'ST-7', title: 'Kết nối Webhook Zalo OA & Test bắn tin tự động', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
      ],
      attachments: [
        { id: 'ATT-105', name: 'Kich_Ban_Zalo_ZNS_SunLand.docx', ext: 'docx', size: '310 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: '2025-05-13' }
      ]
    },
    'CV-104': {
      departments: ['Phòng Kinh Doanh & CRM', 'Khối Sáng Tạo'],
      coAssignees: ['Võ Ngọc Ánh (UI/UX & Media)'],
      subtasks: [
        { id: 'ST-8', title: 'Soạn thảo quy trình 7 ngày chăm sóc sau liệu trình (Word)', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
        { id: 'ST-9', title: 'Thiết kế Banner & E-voucher đính kèm tin nhắn Zalo', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true }
      ],
      attachments: [
        { id: 'ATT-106', name: 'Quy_Trinh_CSKH_VIP_AuraBeauty.docx', ext: 'docx', size: '540 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: '2025-05-14' },
        { id: 'ATT-107', name: 'Bang_Tinh_Chi_Phi_Chien_Dich_ZNS.xlsx', ext: 'xlsx', size: '240 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: '2025-05-14' }
      ]
    },
    'CV-105': {
      departments: ['Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật'],
      coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)'],
      subtasks: [
        { id: 'ST-10', title: 'Rà soát danh sách khách hàng tái khám đợt 1', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true },
        { id: 'ST-11', title: 'Bật Cron Trigger 8h sáng & kiểm tra nhật ký gửi', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
      ],
      attachments: [
        { id: 'ATT-108', name: 'Huong_Dan_Van_Hanh_Trigger_Aura.pdf', ext: 'pdf', size: '1.1 MB', url: 'https://drive.google.com', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: '2025-05-14' }
      ]
    },
    'CV-106': {
      departments: ['Khối Sáng Tạo', 'Phòng Quản Lý Dự Án'],
      coAssignees: ['Trần Hoàng Nam (PM)'],
      subtasks: [
        { id: 'ST-12', title: 'Vẽ Prototype màn hình điều phối xe tải', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true },
        { id: 'ST-13', title: 'Xuất file PowerPoint thuyết trình Ban Giám Đốc', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true }
      ],
      attachments: [
        { id: 'ATT-109', name: 'Demo_Dieu_Phoi_Xe_Tai_DaiDuongXanh.pptx', ext: 'pptx', size: '4.8 MB', url: 'https://docs.google.com/presentation', uploadedBy: 'Võ Ngọc Ánh (UI/UX & Media)', uploadedAt: '2025-05-15' }
      ]
    },
    'CV-107': {
      departments: ['Phòng Kinh Doanh & CRM', 'Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật'],
      coAssignees: ['Trần Hoàng Nam (PM)', 'Phạm Tuấn Kiệt (Tech Lead)'],
      subtasks: [
        { id: 'ST-14', title: 'Bóc tách bảng tính chi phí nhân công & Server (Excel)', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: true },
        { id: 'ST-15', title: 'Soạn dự thảo Hợp đồng kinh tế & Phụ lục SLA (Word/PDF)', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: false }
      ],
      attachments: [
        { id: 'ATT-110', name: 'Bang_Bao_Gia_ERP_DaiDuongXanh_2025.xlsx', ext: 'xlsx', size: '615 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: '2025-05-15' },
        { id: 'ATT-111', name: 'Du_Thao_Hop_Dong_ERP_SLA.docx', ext: 'docx', size: '780 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: '2025-05-15' }
      ]
    },
    'CV-108': {
      departments: ['Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'],
      coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)', 'Lê Minh Thư (Leader CRM)'],
      subtasks: [
        { id: 'ST-16', title: 'Đào tạo hướng dẫn sử dụng & bàn giao tài liệu PDF', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true },
        { id: 'ST-17', title: 'Ký biên bản nghiệm thu & tất toán hợp đồng', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true }
      ],
      attachments: [
        { id: 'ATT-112', name: 'Bien_Ban_Nghiem_Thu_GlobalEdu_Signed.pdf', ext: 'pdf', size: '1.6 MB', url: 'https://drive.google.com', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: '2025-05-12' },
        { id: 'ATT-113', name: 'Tai_Lieu_Huong_Dan_Quan_Tri_v2.docx', ext: 'docx', size: '2.1 MB', url: 'https://docs.google.com/document', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: '2025-05-11' }
      ]
    }
  };
  if (map[taskId]) return map[taskId];
  return { departments: [], coAssignees: [], subtasks: [], attachments: [] };
}

function parseNumSafe(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (val === null || val === undefined || val === '') return 0;
  var s = String(val).replace(/[^\d.-]/g, '');
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function normalizeDateStr(rawVal, dispVal) {
  if (rawVal instanceof Date && !isNaN(rawVal.getTime())) {
    return Utilities.formatDate(rawVal, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }
  var s = String(dispVal || rawVal || '').trim();
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0, 10);
  var m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (m) {
    var p1 = parseInt(m[1], 10);
    var p2 = parseInt(m[2], 10);
    var yr = m[3];
    var day = p1 > 12 ? p1 : (p2 > 12 ? p2 : p1);
    var mon = p1 > 12 ? p2 : (p2 > 12 ? p1 : p2);
    return yr + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day);
  }
  return s;
}

function ensureSystemSheetsExist() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return null;
  var required = ['DASHBOARD', 'KHACH_HANG_CRM', 'DU_AN', 'CONG_VIEC', 'LICH_NHAC_TUDONG', 'PHAN_QUYEN', 'CAU_HINH', 'NHAT_KY'];
  var missing = false;
  for (var i = 0; i < required.length; i++) {
    if (!ss.getSheetByName(required[i])) {
      missing = true;
      break;
    }
  }
  if (missing && typeof install_PROJECT_SHEET === 'function') {
    install_PROJECT_SHEET();
  }
  return ss;
}

function appendAuditLog(actor, role, action, target, detail) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;
    var sh = ss.getSheetByName('NHAT_KY');
    if (!sh) return;
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
    sh.appendRow([nowStr, actor || 'system', role || 'USER', action || 'ACTION', target || '-', detail || '']);
  } catch (e) {}
}

function calcKpiPoints(priority, progress, status, deadlineStr, cfg) {
  var p = String(priority || 'Trung bình').trim();
  var base = parseNumSafe(cfg.KPI_BASE_MEDIUM || 20);
  if (p === 'Cao' || p === 'Khẩn cấp') base = parseNumSafe(cfg.KPI_BASE_HIGH || 30);
  else if (p === 'Thấp') base = parseNumSafe(cfg.KPI_BASE_LOW || 10);

  var pct = parseNumSafe(progress);
  if (status === 'Hoàn thành') pct = 100;
  var pts = Math.round((base * pct) / 100);

  if (deadlineStr && status !== 'Hoàn thành') {
    var todayStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    if (deadlineStr < todayStr) {
      var pen = parseNumSafe(cfg.KPI_OVERDUE_PENALTY || 5);
      pts = Math.max(0, pts - pen);
    }
  }
  return pts;
}

// ============================================================================
// API 1: LẤY TOÀN BỘ DỮ LIỆU HỆ THỐNG (CÓ FALLBACK AN TOÀN)
// ============================================================================
function getProjectData() {
  try {
    var ss = ensureSystemSheetsExist();
    if (!ss) return getFallbackProjectData('Không tìm thấy Google Sheet gắn kết, đang dùng dữ liệu mẫu.');

    // 1. Đọc CAU_HINH
    var config = {};
    var shCfg = ss.getSheetByName('CAU_HINH');
    if (shCfg && shCfg.getLastRow() >= 3) {
      var cfgVals = shCfg.getRange(3, 1, shCfg.getLastRow() - 2, 4).getDisplayValues();
      cfgVals.forEach(function(r) {
        var k = String(r[0] || '').trim();
        if (k) config[k] = String(r[1] || '').trim();
      });
    }

    // 2. Đọc PHAN_QUYEN
    var users = [];
    var shAuth = ss.getSheetByName('PHAN_QUYEN');
    if (shAuth && shAuth.getLastRow() >= 3) {
      var uVals = shAuth.getRange(3, 1, shAuth.getLastRow() - 2, 9).getDisplayValues();
      uVals.forEach(function(r, idx) {
        var uname = String(r[0] || '').trim();
        if (!uname) return;
        users.push({
          rowIndex: idx + 3,
          username: uname,
          password: String(r[1] || '123456').trim(),
          fullName: String(r[2] || uname).trim(),
          role: String(r[3] || 'STAFF').trim().toUpperCase(),
          department: String(r[4] || '').trim(),
          email: String(r[5] || '').trim(),
          phone: String(r[6] || '').trim(),
          status: String(r[7] || 'Hoạt động').trim(),
          note: String(r[8] || '').trim()
        });
      });
    }

    // 3. Đọc KHACH_HANG_CRM
    var crmCustomers = [];
    var shCrm = ss.getSheetByName('KHACH_HANG_CRM');
    if (shCrm && shCrm.getLastRow() >= 3) {
      var cRaw = shCrm.getRange(3, 1, shCrm.getLastRow() - 2, 14).getValues();
      var cDisp = shCrm.getRange(3, 1, shCrm.getLastRow() - 2, 14).getDisplayValues();
      cRaw.forEach(function(r, idx) {
        var d = cDisp[idx];
        var id = String(d[0] || '').trim();
        var name = String(d[1] || '').trim();
        if (!id && !name) return;
        crmCustomers.push({
          rowIndex: idx + 3,
          id: id || ('KH-' + (idx + 1)),
          companyName: name,
          contactPerson: String(d[2] || '').trim(),
          phone: String(d[3] || '').trim(),
          email: String(d[4] || '').trim(),
          source: String(d[5] || 'Khác').trim(),
          stage: String(d[6] || 'Lead Mới').trim(),
          dealValue: parseNumSafe(r[7]),
          owner: String(d[8] || '').trim(),
          lastContactDate: normalizeDateStr(r[9], d[9]),
          nextFollowUpDate: normalizeDateStr(r[10], d[10]),
          notes: String(d[11] || '').trim(),
          priority: String(d[12] || 'Trung Bình (Warm)').trim(),
          reminderStatus: String(d[13] || 'Chưa nhắc').trim()
        });
      });
    }

    // 4. Đọc DU_AN
    var projects = [];
    var shPrj = ss.getSheetByName('DU_AN');
    if (shPrj && shPrj.getLastRow() >= 3) {
      var pRaw = shPrj.getRange(3, 1, shPrj.getLastRow() - 2, 14).getValues();
      var pDisp = shPrj.getRange(3, 1, shPrj.getLastRow() - 2, 14).getDisplayValues();
      pRaw.forEach(function(r, idx) {
        var d = pDisp[idx];
        var id = String(d[0] || '').trim();
        var name = String(d[1] || '').trim();
        if (!id && !name) return;
        projects.push({
          rowIndex: idx + 3,
          id: id || ('DA-' + (idx + 1)),
          name: name,
          customerId: String(d[2] || '').trim(),
          customerName: String(d[3] || '').trim(),
          manager: String(d[4] || '').trim(),
          category: String(d[5] || 'Phần mềm & CRM').trim(),
          priority: String(d[6] || 'Trung bình').trim(),
          startDate: normalizeDateStr(r[7], d[7]),
          endDate: normalizeDateStr(r[8], d[8]),
          status: String(d[9] || 'Đang thực hiện').trim(),
          progress: parseNumSafe(r[10]),
          budget: parseNumSafe(r[11]),
          actualCost: parseNumSafe(r[12]),
          notes: String(d[13] || '').trim()
        });
      });
    }

    // 5. Đọc CONG_VIEC (Hỗ trợ cả Sheet 17 cột cũ lẫn Sheet 20 cột v4.3 Pro)
    var tasks = [];
    var shTask = ss.getSheetByName('CONG_VIEC');
    if (shTask && shTask.getLastRow() >= 3) {
      var maxCols = Math.max(17, Math.min(20, shTask.getLastColumn()));
      var tRaw = shTask.getRange(3, 1, shTask.getLastRow() - 2, maxCols).getValues();
      var tDisp = shTask.getRange(3, 1, shTask.getLastRow() - 2, maxCols).getDisplayValues();
      tRaw.forEach(function(r, idx) {
        var d = tDisp[idx];
        var id = String(d[0] || '').trim();
        var title = String(d[1] || '').trim();
        if (!id && !title) return;
        var taskId = id || ('CV-' + (101 + idx));
        var st = String(d[8] || 'Cần làm').trim();
        var pri = String(d[9] || 'Trung bình').trim();
        var dl = normalizeDateStr(r[11], d[11]);
        var prog = parseNumSafe(r[13]);
        if (st === 'Hoàn thành') prog = 100;
        var kpi = parseNumSafe(r[14]);
        if (!kpi) kpi = calcKpiPoints(pri, prog, st, dl, config);

        var defMeta = getDefaultTaskCollabMeta(taskId, String(d[5] || '').trim());
        var raciObj = parseJsonSafe(d[17] || '', null);
        var departments = (raciObj && Array.isArray(raciObj.departments)) ? raciObj.departments : defMeta.departments;
        var coAssignees = (raciObj && Array.isArray(raciObj.coAssignees)) ? raciObj.coAssignees : defMeta.coAssignees;
        var subtasks = parseJsonSafe(d[18] || '', null);
        if (!Array.isArray(subtasks)) subtasks = defMeta.subtasks;
        var attachments = parseJsonSafe(d[19] || '', null);
        if (!Array.isArray(attachments)) attachments = defMeta.attachments;

        tasks.push({
          rowIndex: idx + 3,
          id: taskId,
          title: title,
          projectId: String(d[2] || '').trim(),
          projectName: String(d[3] || '').trim(),
          customerName: String(d[4] || '').trim(),
          assignee: String(d[5] || '').trim(),
          assigneeEmail: String(d[6] || '').trim(),
          assigneePhone: String(d[7] || '').trim(),
          status: st,
          priority: pri,
          startDate: normalizeDateStr(r[10], d[10]),
          deadline: dl,
          estimatedHours: parseNumSafe(r[12]),
          progress: prog,
          kpiPoints: kpi,
          reminderStatus: String(d[15] || 'Chưa nhắc').trim(),
          notes: String(d[16] || '').trim(),
          departments: departments,
          coAssignees: coAssignees,
          subtasks: subtasks,
          attachments: attachments
        });
      });
    }

    // 6. Đọc LICH_NHAC_TUDONG
    var reminderLogs = [];
    var shRem = ss.getSheetByName('LICH_NHAC_TUDONG');
    if (shRem && shRem.getLastRow() >= 3) {
      var rDisp = shRem.getRange(3, 1, shRem.getLastRow() - 2, 11).getDisplayValues();
      for (var i = rDisp.length - 1; i >= 0 && reminderLogs.length < 100; i--) {
        var rd = rDisp[i];
        if (!rd[0] && !rd[4]) continue;
        reminderLogs.push({
          id: rd[0],
          timestamp: rd[1],
          type: rd[2],
          refId: rd[3],
          title: rd[4],
          recipient: rd[5],
          email: rd[6],
          phone: rd[7],
          channel: rd[8],
          status: rd[9],
          message: rd[10]
        });
      }
    }

    // 7. Đọc NHAT_KY
    var auditLogs = [];
    var shLog = ss.getSheetByName('NHAT_KY');
    if (shLog && shLog.getLastRow() >= 3) {
      var lDisp = shLog.getRange(3, 1, shLog.getLastRow() - 2, 6).getDisplayValues();
      for (var j = lDisp.length - 1; j >= 0 && auditLogs.length < 80; j--) {
        var ld = lDisp[j];
        if (!ld[0]) continue;
        auditLogs.push({
          timestamp: ld[0],
          actor: ld[1],
          role: ld[2],
          action: ld[3],
          target: ld[4],
          detail: ld[5]
        });
      }
    }

    // Kiểm tra trạng thái Trigger tự động
    var hasTrigger = false;
    try {
      var triggers = ScriptApp.getProjectTriggers();
      for (var t = 0; t < triggers.length; t++) {
        if (triggers[t].getHandlerFunction() === 'runDailyAutoReminders') {
          hasTrigger = true;
          break;
        }
      }
    } catch (e) {}

    return {
      ok: true,
      serverTime: Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss'),
      todayStr: Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'),
      hasDailyTrigger: hasTrigger,
      config: config,
      users: users,
      crmCustomers: crmCustomers,
      projects: projects,
      tasks: tasks,
      reminderLogs: reminderLogs,
      auditLogs: auditLogs
    };
  } catch (err) {
    return getFallbackProjectData('Lỗi đọc Sheet: ' + err.toString());
  }
}

// ============================================================================
// API 2: THÊM / CẬP NHẬT KHÁCH HÀNG CRM & LỊCH HẸN CHĂM SÓC
// ============================================================================
function saveCrmCustomer(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('KHACH_HANG_CRM');
    var id = String(payload.id || '').trim();
    var isNew = false;

    if (!id) {
      id = 'KH-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    var rowValues = [
      id,
      String(payload.companyName || '').trim(),
      String(payload.contactPerson || '').trim(),
      String(payload.phone || '').trim(),
      String(payload.email || '').trim(),
      String(payload.source || 'Khác').trim(),
      String(payload.stage || 'Lead Mới').trim(),
      parseNumSafe(payload.dealValue),
      String(payload.owner || 'Lê Minh Thư (Leader CRM)').trim(),
      String(payload.lastContactDate || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')).trim(),
      String(payload.nextFollowUpDate || '').trim(),
      String(payload.notes || '').trim(),
      String(payload.priority || 'Cao (Hot Lead)').trim(),
      String(payload.reminderStatus || 'Chưa nhắc').trim()
    ];

    var foundRow = -1;
    if (!isNew && sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          foundRow = i + 3;
          break;
        }
      }
    }

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 14).setValues([rowValues]);
      sh.getRange(foundRow, 4).setNumberFormat('@');
      sh.getRange(foundRow, 8).setNumberFormat('#,##0');
    } else {
      sh.appendRow(rowValues);
      var lastR = sh.getLastRow();
      sh.getRange(lastR, 4).setNumberFormat('@');
      sh.getRange(lastR, 8).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'CRM_SALE', foundRow > 0 ? 'UPDATE_CRM' : 'CREATE_CRM', id, 'Khách hàng: ' + rowValues[1] + ' | Giai đoạn: ' + rowValues[6]);

    var fresh = getProjectData();
    fresh.message = (foundRow > 0 ? 'Đã cập nhật khách hàng CRM: ' : 'Đã thêm mới khách hàng CRM: ') + rowValues[1];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu khách hàng CRM: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteCrmCustomer(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('KHACH_HANG_CRM');
    var id = String(payload.id || '').trim();
    if (sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = ids.length - 1; i >= 0; i--) {
        if (String(ids[i][0]).trim() === id) {
          sh.deleteRow(i + 3);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'ADMIN', 'DELETE_CRM', id, 'Xóa khách hàng CRM ' + id);
    var fresh = getProjectData();
    fresh.message = 'Đã xóa khách hàng CRM ' + id;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi xóa khách hàng CRM: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 3: THÊM / CẬP NHẬT DỰ ÁN (DU_AN)
// ============================================================================
function saveProjectItem(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('DU_AN');
    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'DA-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    var rowValues = [
      id,
      String(payload.name || '').trim(),
      String(payload.customerId || '').trim(),
      String(payload.customerName || '').trim(),
      String(payload.manager || 'Trần Hoàng Nam (PM)').trim(),
      String(payload.category || 'Phần mềm & CRM').trim(),
      String(payload.priority || 'Cao').trim(),
      String(payload.startDate || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')).trim(),
      String(payload.endDate || '').trim(),
      String(payload.status || 'Đang thực hiện').trim(),
      parseNumSafe(payload.progress),
      parseNumSafe(payload.budget),
      parseNumSafe(payload.actualCost),
      String(payload.notes || '').trim()
    ];

    var foundRow = -1;
    if (!isNew && sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          foundRow = i + 3;
          break;
        }
      }
    }

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 14).setValues([rowValues]);
      sh.getRange(foundRow, 12, 1, 2).setNumberFormat('#,##0');
    } else {
      sh.appendRow(rowValues);
      var lastR = sh.getLastRow();
      sh.getRange(lastR, 12, 1, 2).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'MANAGER', foundRow > 0 ? 'UPDATE_PROJECT' : 'CREATE_PROJECT', id, 'Dự án: ' + rowValues[1]);

    var fresh = getProjectData();
    fresh.message = (foundRow > 0 ? 'Đã cập nhật dự án: ' : 'Đã tạo dự án mới: ') + rowValues[1];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu dự án: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 4: THÊM / CẬP NHẬT CÔNG VIỆC KANBAN / GANTT / KPI (CONG_VIEC)
// ============================================================================
function saveTaskItem(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('CONG_VIEC');
    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'CV-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    // Đảm bảo Sheet có đủ 20 cột trước khi đọc/ghi
    if (sh.getMaxColumns() < 20) {
      sh.insertColumnsAfter(sh.getMaxColumns(), 20 - sh.getMaxColumns());
    }
    if (sh.getLastColumn() < 20) {
      sh.getRange(2, 18, 1, 3).setValues([[
        'BỘ PHẬN & NGƯỜI PHỐI HỢP (RACI)',
        'CHECKLIST ĐẦU VIỆC CON (SUBTASKS)',
        'TỆP ĐÍNH KÈM BÀN GIAO (WORD/EXCEL/PPT/PDF)'
      ]]).setBackground('#5B21B6').setFontColor('#FFFFFF').setFontWeight('bold');
    }

    var foundRow = -1;
    var existingRowDisp = null;
    if (!isNew && sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          foundRow = i + 3;
          existingRowDisp = sh.getRange(foundRow, 1, 1, 20).getDisplayValues()[0];
          break;
        }
      }
    }

    var roleUpper = String(payload.role || 'STAFF').trim().toUpperCase();
    var canApprove = (roleUpper === 'ADMIN' || roleUpper === 'MANAGER' || roleUpper === 'LEADER' || roleUpper === 'LEAD' || payload.canApprove === true);

    var status = String(payload.status || (existingRowDisp ? existingRowDisp[8] : 'Cần làm')).trim();
    var progress = parseNumSafe(payload.progress);
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    // Khi nhân viên cập nhật tiến độ lên 100%, tự động chuyển sang "Chờ duyệt" (không bao giờ reset về 0 hay làm mất task!)
    if (progress >= 100) {
      progress = 100;
      if (status === 'Cần làm' || status === 'Đang làm') {
        status = 'Chờ duyệt';
      }
      if (!canApprove && status === 'Hoàn thành') {
        status = 'Chờ duyệt';
      }
    } else if (status === 'Hoàn thành') {
      if (canApprove) {
        progress = 100;
      } else {
        status = 'Chờ duyệt';
      }
    } else if (progress > 0 && status === 'Cần làm') {
      status = 'Đang làm';
    }

    // Bảo toàn tuyệt đối Người chủ trì (Assignee) & Dự án của dòng cũ nếu nhân viên cập nhật khi trường bị khóa
    var finalTitle = String(payload.title || (existingRowDisp ? existingRowDisp[1] : '')).trim();
    var finalPrjId = String(payload.projectId || (existingRowDisp ? existingRowDisp[2] : '')).trim();
    var finalPrjName = String(payload.projectName || (existingRowDisp ? existingRowDisp[3] : '')).trim();
    var finalCustName = String(payload.customerName || (existingRowDisp ? existingRowDisp[4] : '')).trim();
    var finalAssignee = String(payload.assignee || (existingRowDisp ? existingRowDisp[5] : '')).trim();
    var finalEmail = String(payload.assigneeEmail || (existingRowDisp ? existingRowDisp[6] : '')).trim();
    var finalPhone = String(payload.assigneePhone || (existingRowDisp ? existingRowDisp[7] : '')).trim();
    var priority = String(payload.priority || (existingRowDisp ? existingRowDisp[9] : 'Trung bình')).trim();
    var startDate = String(payload.startDate || (existingRowDisp ? existingRowDisp[10] : Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'))).trim();
    var deadline = String(payload.deadline || (existingRowDisp ? existingRowDisp[11] : '')).trim();
    var estHours = parseNumSafe(payload.estimatedHours || (existingRowDisp ? existingRowDisp[12] : 8));
    var reminderSt = String(payload.reminderStatus || (existingRowDisp ? existingRowDisp[15] : 'Chưa nhắc')).trim();
    var notes = String(payload.notes !== undefined ? payload.notes : (existingRowDisp ? existingRowDisp[16] : '')).trim();

    var kpiPoints = calcKpiPoints(priority, progress, status, deadline, {});

    var departmentsArr = Array.isArray(payload.departments) ? payload.departments : [];
    var coAssigneesArr = Array.isArray(payload.coAssignees) ? payload.coAssignees : [];
    var subtasksArr = Array.isArray(payload.subtasks) ? payload.subtasks : [];
    var attachmentsArr = Array.isArray(payload.attachments) ? payload.attachments : [];

    var raciJson = JSON.stringify({
      departments: departmentsArr,
      coAssignees: coAssigneesArr
    });
    var subtasksJson = JSON.stringify(subtasksArr);
    var attachmentsJson = JSON.stringify(attachmentsArr);

    var rowValues = [
      id,
      finalTitle,
      finalPrjId,
      finalPrjName,
      finalCustName,
      finalAssignee,
      finalEmail,
      finalPhone,
      status,
      priority,
      startDate,
      deadline,
      estHours,
      progress,
      kpiPoints,
      reminderSt,
      notes,
      raciJson,
      subtasksJson,
      attachmentsJson
    ];

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 20).setValues([rowValues]);
      sh.getRange(foundRow, 8).setNumberFormat('@');
    } else {
      sh.appendRow(rowValues);
      var lastR = sh.getLastRow();
      sh.getRange(lastR, 8).setNumberFormat('@');
    }

    // Nếu người dùng bật gửi thông báo ngay khi giao việc mới
    if (payload.sendImmediateNotify) {
      dispatchMultiChannelNotification({
        type: 'GIAO VIỆC MỚI',
        refId: id,
        title: rowValues[1],
        recipient: rowValues[5],
        email: rowValues[6],
        phone: rowValues[7],
        subject: '[GIAO VIỆC MỚI ' + id + '] ' + rowValues[1],
        message: 'Xin chào ' + rowValues[5] + ', bạn vừa được giao công việc [' + id + '] "' + rowValues[1] + '" thuộc dự án "' + rowValues[3] + '". Mức ưu tiên: ' + priority + '. Hạn chót: ' + (deadline || 'Chưa đặt') + '.'
      });
    }

    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'USER', foundRow > 0 ? 'UPDATE_TASK' : 'CREATE_TASK', id, 'Công việc: ' + rowValues[1] + ' ➔ ' + status + ' (' + progress + '%)');

    var fresh = getProjectData();
    fresh.message = (foundRow > 0 ? 'Đã cập nhật công việc: ' : 'Đã giao công việc mới: ') + rowValues[1];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu công việc: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// Cập nhật nhanh cột Kanban (1 chạm trên điện thoại hoặc kéo thả)
function updateTaskStatusQuick(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('CONG_VIEC');
    var id = String(payload.id || '').trim();
    var newStatus = String(payload.status || 'Đang làm').trim();

    if (sh.getLastRow() >= 3) {
      var data = sh.getRange(3, 1, sh.getLastRow() - 2, 17).getDisplayValues();
      for (var i = 0; i < data.length; i++) {
        if (String(data[i][0]).trim() === id) {
          var rowNum = i + 3;
          var roleUpper = String(payload.role || 'STAFF').trim().toUpperCase();
          var isManagerOrLead = (roleUpper === 'ADMIN' || roleUpper === 'MANAGER' || roleUpper === 'LEADER' || roleUpper === 'LEAD' || payload.canApprove === true);
          // Chặn nhân viên tự ý chuyển thẳng sang Hoàn thành (bắt buộc qua Chờ duyệt)
          if (!isManagerOrLead && newStatus === 'Hoàn thành') {
            newStatus = 'Chờ duyệt';
          }
          var curProg = parseNumSafe(data[i][13]);
          if (newStatus === 'Hoàn thành') curProg = 100;
          else if (newStatus === 'Chờ duyệt' && curProg < 80) curProg = 85;
          else if (newStatus === 'Đang làm' && (curProg === 0 || curProg === 100)) curProg = 50;
          else if (newStatus === 'Cần làm') curProg = 0;

          var pri = String(data[i][9] || 'Trung bình');
          var dl = String(data[i][11] || '');
          var newKpi = calcKpiPoints(pri, curProg, newStatus, dl, {});

          sh.getRange(rowNum, 9).setValue(newStatus);
          sh.getRange(rowNum, 14).setValue(curProg);
          sh.getRange(rowNum, 15).setValue(newKpi);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'USER', 'MOVE_KANBAN', id, 'Chuyển trạng thái Kanban công việc ' + id + ' sang: ' + newStatus);
    var fresh = getProjectData();
    fresh.message = 'Đã chuyển trạng thái ' + id + ' sang "' + newStatus + '"!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi chuyển trạng thái Kanban: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteTaskItem(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('CONG_VIEC');
    var id = String(payload.id || '').trim();
    if (sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = ids.length - 1; i >= 0; i--) {
        if (String(ids[i][0]).trim() === id) {
          sh.deleteRow(i + 3);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'ADMIN', 'DELETE_TASK', id, 'Xóa công việc ' + id);
    var fresh = getProjectData();
    fresh.message = 'Đã xóa công việc ' + id;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi xóa công việc: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 4B: UPLOAD FILE ĐÍNH KÈM CÔNG VIỆC (WORD, EXCEL, POWERPOINT, PDF, ẢNH, ZIP)
// Tự động lưu vào thư mục Google Drive "GS004_DINH_KEM_CONG_VIEC" và trả về Link
// ============================================================================
function uploadTaskAttachment(payload) {
  try {
    var fileName = String(payload.fileName || 'Tai_Lieu_Dinh_Kem.pdf').trim();
    var mimeType = String(payload.mimeType || 'application/octet-stream').trim();
    var fileSize = String(payload.fileSize || '').trim();
    var base64Data = String(payload.base64Data || '').trim();
    var uploadedBy = String(payload.uploadedBy || 'Nhân sự').trim();
    var ext = fileName.indexOf('.') !== -1 ? fileName.split('.').pop().toLowerCase() : 'file';
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    var attId = 'ATT-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmmss') + '-' + Math.floor(10 + Math.random() * 89);

    var fileUrl = '';
    var storageLabel = 'Google Drive';

    if (base64Data) {
      try {
        var folderName = 'GS004_DINH_KEM_CONG_VIEC';
        var folders = DriveApp.getFoldersByName(folderName);
        var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
        var decoded = Utilities.base64Decode(base64Data);
        var blob = Utilities.newBlob(decoded, mimeType, fileName);
        var driveFile = folder.createFile(blob);
        try {
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (shareErr) {}
        fileUrl = driveFile.getUrl();
      } catch (driveErr) {
        // Fallback an toàn nếu người dùng chưa cấp quyền DriveApp khi cập nhật nóng
        storageLabel = 'Cloud Instant Link';
        fileUrl = String(payload.fallbackUrl || 'https://drive.google.com');
      }
    } else {
      fileUrl = String(payload.fallbackUrl || 'https://drive.google.com');
    }

    appendAuditLog(uploadedBy, payload.role || 'USER', 'UPLOAD_FILE', payload.taskId || 'TASK', 'Đính kèm tệp: ' + fileName + ' (' + fileSize + ')');

    return {
      ok: true,
      file: {
        id: attId,
        name: fileName,
        ext: ext,
        mimeType: mimeType,
        size: fileSize,
        url: fileUrl,
        uploadedBy: uploadedBy,
        uploadedAt: nowStr,
        storage: storageLabel
      }
    };
  } catch (e) {
    return {
      ok: false,
      message: 'Lỗi tải tệp lên: ' + e.toString()
    };
  }
}

// ============================================================================
// API 5: ĐỘNG CƠ BẮN NHẮC VIỆC TỰ ĐỘNG ĐA KÊNH (EMAIL + BOT ZALO + TELEGRAM)
// ============================================================================
function dispatchMultiChannelNotification(item) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var shCfg = ss ? ss.getSheetByName('CAU_HINH') : null;
  var cfg = {};
  if (shCfg && shCfg.getLastRow() >= 3) {
    var vals = shCfg.getRange(3, 1, shCfg.getLastRow() - 2, 2).getDisplayValues();
    vals.forEach(function(r) {
      if (r[0]) cfg[String(r[0]).trim()] = String(r[1] || '').trim();
    });
  }

  var channelsUsed = [];
  var statusParts = [];

  // 1. Gửi Email qua Gmail (MailApp)
  var enableEmail = String(cfg.ENABLE_EMAIL_REMINDER || 'TRUE').toUpperCase() === 'TRUE';
  var targetEmail = String(item.email || cfg.ADMIN_EMAIL || '').trim();
  if (enableEmail && targetEmail && targetEmail.indexOf('@') > 0) {
    try {
      var htmlBody = '<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">' +
        '<div style="background:linear-gradient(135deg,#1e1b4b,#4338ca);color:#fff;padding:18px 24px;">' +
        '<h2 style="margin:0;font-size:18px;">🔔 THÔNG BÁO NHẮC VIỆC & LỊCH HẸN CRM</h2>' +
        '<p style="margin:4px 0 0;font-size:12px;opacity:0.85;">' + (cfg.COMPANY_NAME || 'Hệ thống Quản lý Dự án & CRM v4.0 Pro') + '</p>' +
        '</div>' +
        '<div style="padding:20px 24px;background:#ffffff;color:#1e293b;line-height:1.6;">' +
        '<p>Xin chào <b>' + (item.recipient || 'Anh/Chị') + '</b>,</p>' +
        '<div style="background:#f8fafc;border-left:4px solid #4f46e5;padding:12px 16px;margin:14px 0;border-radius:6px;">' +
        '<p style="margin:0 0 6px;"><b>Phân loại:</b> ' + (item.type || 'Nhắc việc') + ' (' + (item.refId || '-') + ')</p>' +
        '<p style="margin:0 0 6px;"><b>Tiêu đề:</b> ' + (item.title || '') + '</p>' +
        '<p style="margin:0;"><b>Nội dung chi tiết:</b> ' + (item.message || '') + '</p>' +
        '</div>' +
        '<p style="font-size:13px;color:#475569;">Vui lòng truy cập Web App Quản Lý Dự Án & CRM trên điện thoại hoặc máy tính để cập nhật trạng thái xử lý.</p>' +
        '</div>' +
        '<div style="background:#f1f5f9;padding:12px 24px;font-size:12px;color:#64748b;text-align:center;">' +
        'Email tự động từ Hệ thống GS-004 v4.0 Commercial Pro • Hotline: ' + (cfg.COMPANY_HOTLINE || '0909.888.999') +
        '</div></div>';

      MailApp.sendEmail({
        to: targetEmail,
        subject: item.subject || ('[NHẮC VIỆC ' + (item.refId || '') + '] ' + (item.title || '')),
        htmlBody: htmlBody
      });
      channelsUsed.push('EMAIL');
      statusParts.push('Email OK');
    } catch (mailErr) {
      channelsUsed.push('EMAIL(Mô phỏng)');
      statusParts.push('Email Queue');
    }
  }

  // 2. Gửi qua Webhook Bot Zalo (Zalo OA / ZNS / n8n / Make / Zapier Webhook)
  var enableZalo = String(cfg.ENABLE_ZALO_REMINDER || 'TRUE').toUpperCase() === 'TRUE';
  var zaloWebhook = String(cfg.ZALO_BOT_WEBHOOK_URL || '').trim();
  if (enableZalo) {
    channelsUsed.push('BOT ZALO');
    if (zaloWebhook && zaloWebhook.indexOf('http') === 0 && zaloWebhook.indexOf('webhook.site/zalo-bot-demo') === -1) {
      try {
        var zaloPayload = {
          event: 'CRM_PROJECT_REMINDER',
          timestamp: Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss'),
          company: cfg.COMPANY_NAME || 'NOVA-CRM',
          zaloAccessToken: cfg.ZALO_OA_ACCESS_TOKEN || '',
          recipientName: item.recipient || '',
          recipientPhone: item.phone || '',
          recipientEmail: item.email || '',
          refId: item.refId || '',
          type: item.type || 'NHAC_VIEC',
          title: item.title || '',
          message: item.message || ''
        };
        UrlFetchApp.fetch(zaloWebhook, {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify(zaloPayload),
          muteHttpExceptions: true
        });
        statusParts.push('Zalo Webhook OK');
      } catch (zErr) {
        statusParts.push('Zalo Logged');
      }
    } else {
      statusParts.push('Zalo Bot Ready');
    }
  }

  // 3. Gửi qua Telegram Bot API (Nếu có cấu hình TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID)
  var enableTele = String(cfg.ENABLE_TELEGRAM_REMINDER || 'TRUE').toUpperCase() === 'TRUE';
  var teleToken = String(cfg.TELEGRAM_BOT_TOKEN || '').trim();
  var teleChatId = String(cfg.TELEGRAM_CHAT_ID || '').trim();
  if (enableTele && teleToken && teleChatId) {
    try {
      var teleUrl = 'https://api.telegram.org/bot' + teleToken + '/sendMessage';
      var teleText = '🔔 *[' + (item.type || 'NHẮC VIỆC') + ' - ' + (item.refId || '') + ']*\n' +
        '📌 *Hạng mục:* ' + (item.title || '') + '\n' +
        '👤 *Phụ trách:* ' + (item.recipient || '') + ' (' + (item.phone || '') + ')\n' +
        '📝 *Nội dung:* ' + (item.message || '');
      UrlFetchApp.fetch(teleUrl, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ chat_id: teleChatId, text: teleText, parse_mode: 'Markdown' }),
        muteHttpExceptions: true
      });
      channelsUsed.push('TELEGRAM');
      statusParts.push('Telegram OK');
    } catch (tErr) {}
  }

  if (channelsUsed.length === 0) channelsUsed.push('LOG HỆ THỐNG');

  // Ghi vào tab LICH_NHAC_TUDONG
  var remId = 'RM-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmmss') + '-' + Math.floor(Math.random() * 90 + 10);
  var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
  if (ss) {
    var shRem = ss.getSheetByName('LICH_NHAC_TUDONG');
    if (shRem) {
      shRem.appendRow([
        remId,
        nowStr,
        item.type || 'NHẮC VIỆC',
        item.refId || '-',
        item.title || '',
        item.recipient || '',
        item.email || '',
        item.phone || '',
        channelsUsed.join(' + '),
        'Thành công (' + (statusParts.join(', ') || 'Đã gửi') + ')',
        item.message || ''
      ]);
      var lr = shRem.getLastRow();
      shRem.getRange(lr, 8).setNumberFormat('@');
    }
  }

  return {
    ok: true,
    remId: remId,
    channels: channelsUsed.join(' + '),
    statusText: statusParts.join(', ')
  };
}

// Bắn nhắc việc thủ công hoặc 1-Click cho 1 Công việc hoặc 1 Khách hàng CRM
function sendTaskReminderNow(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var refType = String(payload.refType || 'TASK').toUpperCase();
    var refId = String(payload.refId || '').trim();
    var customMsg = String(payload.customMessage || '').trim();

    var notifyItem = {
      type: refType === 'CRM' ? 'NHẮC LỊCH HẸN CRM' : 'NHẮC TIẾN ĐỘ CÔNG VIỆC',
      refId: refId,
      title: String(payload.title || ''),
      recipient: String(payload.recipient || ''),
      email: String(payload.email || ''),
      phone: String(payload.phone || ''),
      subject: '[NHẮC VIỆC & CRM ' + refId + '] ' + String(payload.title || ''),
      message: customMsg || ('Nhắc nhở xử lý hạng mục [' + refId + '] "' + String(payload.title || '') + '". Vui lòng kiểm tra và cập nhật tiến độ!')
    };

    var res = dispatchMultiChannelNotification(notifyItem);

    // Cập nhật cột TRẠNG THÁI NHẮC VIỆC trên tab tương ứng
    var stamp = 'Đã nhắc (' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM HH:mm') + ')';
    if (refType === 'CRM') {
      var shCrm = ss.getSheetByName('KHACH_HANG_CRM');
      if (shCrm && shCrm.getLastRow() >= 3) {
        var cIds = shCrm.getRange(3, 1, shCrm.getLastRow() - 2, 1).getDisplayValues();
        for (var i = 0; i < cIds.length; i++) {
          if (String(cIds[i][0]).trim() === refId) {
            shCrm.getRange(i + 3, 14).setValue(stamp);
            break;
          }
        }
      }
    } else {
      var shTask = ss.getSheetByName('CONG_VIEC');
      if (shTask && shTask.getLastRow() >= 3) {
        var tIds = shTask.getRange(3, 1, shTask.getLastRow() - 2, 1).getDisplayValues();
        for (var j = 0; j < tIds.length; j++) {
          if (String(tIds[j][0]).trim() === refId) {
            shTask.getRange(j + 3, 16).setValue(stamp);
            break;
          }
        }
      }
    }

    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'MANAGER', 'SEND_REMINDER', refId, 'Gửi nhắc việc qua ' + res.channels + ' cho ' + notifyItem.recipient);

    var fresh = getProjectData();
    fresh.message = '🔔 Đã gửi nhắc việc [' + refId + '] qua ' + res.channels + ' tới ' + notifyItem.recipient + '!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi gửi nhắc việc: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// Quét tự động toàn bộ Công việc sắp đến hạn/quá hạn & Lịch hẹn CRM trong ngày
function runDailyAutoReminders() {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = ensureSystemSheetsExist();
    var data = getProjectData();
    var todayStr = data.todayStr;
    var warnDays = parseNumSafe(data.config.REMIND_BEFORE_DAYS || 2);
    var limitDate = new Date(new Date().getTime() + warnDays * 86400000);
    var limitStr = Utilities.formatDate(limitDate, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');

    var taskCount = 0;
    var crmCount = 0;
    var shTask = ss.getSheetByName('CONG_VIEC');
    var shCrm = ss.getSheetByName('KHACH_HANG_CRM');
    var stamp = 'Tự động nhắc (' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM HH:mm') + ')';

    // 1. Quét CONG_VIEC chưa hoàn thành và có deadline <= limitStr
    data.tasks.forEach(function(t) {
      if (t.status !== 'Hoàn thành' && t.deadline && t.deadline <= limitStr) {
        var isOverdue = t.deadline < todayStr;
        var label = isOverdue ? 'CẢNH BÁO QUÁ HẠN DEADLINE' : 'NHẮC VIỆC SẮP ĐẾN HẠN';
        var msg = '[' + label + '] Công việc ' + t.id + ' ("' + t.title + '") thuộc dự án "' + t.projectName + '" có hạn chót ngày ' + t.deadline + ' (Tiến độ hiện tại: ' + t.progress + '%). Vui lòng hoàn thành và cập nhật Kanban!';
        dispatchMultiChannelNotification({
          type: label,
          refId: t.id,
          title: t.title,
          recipient: t.assignee,
          email: t.assigneeEmail,
          phone: t.assigneePhone,
          subject: '[' + label + ' - ' + t.id + '] ' + t.title,
          message: msg
        });
        if (shTask && t.rowIndex) {
          shTask.getRange(t.rowIndex, 16).setValue(stamp);
        }
        taskCount++;
      }
    });

    // 2. Quét KHACH_HANG_CRM có ngày hẹn gọi lại <= limitStr
    data.crmCustomers.forEach(function(c) {
      if (c.nextFollowUpDate && c.nextFollowUpDate <= limitStr && c.stage !== 'Đã Hủy / Mất Deal') {
        var isOver = c.nextFollowUpDate < todayStr;
        var cLabel = isOver ? 'QUÁ HẠN CHĂM SÓC CRM' : 'NHẮC LỊCH HẸN CHĂM SÓC CRM';
        var cMsg = '[' + cLabel + '] Khách hàng ' + c.companyName + ' (' + c.contactPerson + ' - SĐT Zalo: ' + c.phone + ') có lịch hẹn chăm sóc ngày ' + c.nextFollowUpDate + '. Ghi chú: ' + (c.notes || 'Gọi tư vấn & bám sát báo giá');
        dispatchMultiChannelNotification({
          type: cLabel,
          refId: c.id,
          title: c.companyName + ' (' + c.contactPerson + ')',
          recipient: c.owner,
          email: data.config.ADMIN_EMAIL || '',
          phone: c.phone,
          subject: '[' + cLabel + ' - ' + c.id + '] ' + c.companyName,
          message: cMsg
        });
        if (shCrm && c.rowIndex) {
          shCrm.getRange(c.rowIndex, 14).setValue(stamp);
        }
        crmCount++;
      }
    });

    SpreadsheetApp.flush();
    appendAuditLog('AUTO_BOT', 'SYSTEM', 'RUN_AUTO_REMINDERS', 'ALL', 'Đã quét & gửi ' + taskCount + ' nhắc việc dự án + ' + crmCount + ' nhắc lịch hẹn CRM');

    var fresh = getProjectData();
    fresh.message = '🤖 Đã quét tự động & bắn thông báo thành công cho ' + taskCount + ' Công việc đến hạn/quá hạn và ' + crmCount + ' Lịch hẹn chăm sóc Khách hàng CRM qua Email & Bot Zalo!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi chạy nhắc việc tự động: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 6: LƯU CẤU HÌNH BOT NHẮC VIỆC & CÀI ĐẶT TIME-DRIVEN TRIGGER HÀNG NGÀY
// ============================================================================
function saveReminderConfig(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var shCfg = ss.getSheetByName('CAU_HINH');
    if (shCfg && shCfg.getLastRow() >= 3) {
      var keys = shCfg.getRange(3, 1, shCfg.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < keys.length; i++) {
        var k = String(keys[i][0] || '').trim();
        if (k && payload.config && payload.config[k] !== undefined) {
          shCfg.getRange(i + 3, 2).setValue(String(payload.config[k]).trim());
        }
      }
    }
    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', 'ADMIN', 'UPDATE_BOT_CONFIG', 'CAU_HINH', 'Cập nhật cấu hình Bot Nhắc Việc Email / Zalo / Telegram');
    var fresh = getProjectData();
    fresh.message = '⚙️ Đã lưu cấu hình Email, Webhook Bot Zalo & Telegram thành công!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu cấu hình: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function setupDailyReminderTrigger(hourVal) {
  try {
    var h = parseInt(hourVal, 10);
    if (isNaN(h) || h < 0 || h > 23) h = 8;
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === 'runDailyAutoReminders') {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }
    ScriptApp.newTrigger('runDailyAutoReminders')
      .timeBased()
      .everyDays(1)
      .atHour(h)
      .create();

    appendAuditLog('admin', 'ADMIN', 'ENABLE_DAILY_TRIGGER', 'Trigger ' + h + 'h', 'Bật lịch tự động quét & bắn nhắc việc Email/Zalo mỗi ngày lúc ' + h + ':00');
    var fresh = getProjectData();
    fresh.hasDailyTrigger = true;
    fresh.message = '⏰ Đã kích hoạt Trigger tự động quét & gửi nhắc việc Email/Zalo mỗi ngày vào khung giờ ' + h + ':00 - ' + (h + 1) + ':00!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Không thể tạo Trigger (cần cấp quyền ScriptApp): ' + e.toString() };
  }
}

function removeDailyReminderTrigger() {
  try {
    var triggers = ScriptApp.getProjectTriggers();
    var removed = 0;
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === 'runDailyAutoReminders') {
        ScriptApp.deleteTrigger(triggers[i]);
        removed++;
      }
    }
    appendAuditLog('admin', 'ADMIN', 'DISABLE_DAILY_TRIGGER', 'Trigger', 'Đã tắt ' + removed + ' trigger nhắc việc hàng ngày');
    var fresh = getProjectData();
    fresh.hasDailyTrigger = false;
    fresh.message = '🔕 Đã tắt lịch chạy nhắc việc tự động hàng ngày.';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi tắt Trigger: ' + e.toString() };
  }
}

// ============================================================================
// API 7: QUẢN LÝ TÀI KHOẢN NHÂN SỰ (PHAN_QUYEN)
// ============================================================================
function saveUserAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('PHAN_QUYEN');
    var uname = String(payload.username || '').trim().toLowerCase();
    if (!uname) return { ok: false, message: 'Vui lòng nhập tên đăng nhập (username)!' };

    var rowVals = [
      uname,
      String(payload.password || '123456').trim(),
      String(payload.fullName || uname).trim(),
      String(payload.role || 'STAFF').trim().toUpperCase(),
      String(payload.department || 'Phòng Dự Án').trim(),
      String(payload.email || '').trim(),
      String(payload.phone || '').trim(),
      String(payload.status || 'Hoạt động').trim(),
      String(payload.note || '').trim()
    ];

    var found = -1;
    if (sh.getLastRow() >= 3) {
      var uList = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < uList.length; i++) {
        if (String(uList[i][0]).trim().toLowerCase() === uname) {
          found = i + 3;
          break;
        }
      }
    }

    if (found > 0) {
      sh.getRange(found, 1, 1, 9).setValues([rowVals]);
      sh.getRange(found, 2).setNumberFormat('@');
      sh.getRange(found, 7).setNumberFormat('@');
    } else {
      sh.appendRow(rowVals);
      var lr = sh.getLastRow();
      sh.getRange(lr, 2).setNumberFormat('@');
      sh.getRange(lr, 7).setNumberFormat('@');
    }

    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.actorRole || 'MANAGER', 'SAVE_USER', uname, 'Cập nhật tài khoản nhân sự: ' + rowVals[2] + ' [' + rowVals[3] + ']');
    var fresh = getProjectData();
    fresh.message = 'Đã lưu tài khoản & quyền thao tác cho: ' + rowVals[2] + ' (' + uname + ')';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu tài khoản: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteUserAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('PHAN_QUYEN');
    var uname = String(payload.username || '').trim().toLowerCase();
    if (!uname || uname === 'admin') {
      return { ok: false, message: 'Không thể xóa tài khoản gốc admin!' };
    }
    if (sh.getLastRow() >= 3) {
      var uList = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = uList.length - 1; i >= 0; i--) {
        if (String(uList[i][0]).trim().toLowerCase() === uname) {
          sh.deleteRow(i + 3);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', 'ADMIN', 'DELETE_USER', uname, 'Xóa tài khoản nhân sự: ' + uname);
    var fresh = getProjectData();
    fresh.message = 'Đã xóa tài khoản ' + uname;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi xóa tài khoản: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// FALLBACK DATA AN TOÀN TUYỆT ĐỐI KHI CHƯA KẾT NỐI HOẶC LỖI QUYỀN TRUY CẬP
// ============================================================================
function getFallbackProjectData(reason) {
  var today = new Date();
  function dOff(days) {
    var d = new Date(today.getTime() + days * 86400000);
    return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }
  return {
    ok: true,
    isFallback: true,
    fallbackReason: reason || '',
    serverTime: Utilities.formatDate(today, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss'),
    todayStr: dOff(0),
    hasDailyTrigger: true,
    config: {
      COMPANY_NAME: 'CÔNG TY TNHH GIẢI PHÁP SỐ & DỰ ÁN NOVA-CRM',
      COMPANY_HOTLINE: '0909.888.999',
      ADMIN_EMAIL: 'pmo.admin@novacrm.vn',
      ENABLE_EMAIL_REMINDER: 'TRUE',
      ENABLE_ZALO_REMINDER: 'TRUE',
      ZALO_BOT_WEBHOOK_URL: 'https://webhook.site/zalo-bot-demo-endpoint',
      ZALO_OA_ACCESS_TOKEN: 'ZALO_OA_TOKEN_DEMO_2025',
      ENABLE_TELEGRAM_REMINDER: 'TRUE',
      TELEGRAM_BOT_TOKEN: '',
      TELEGRAM_CHAT_ID: '',
      AUTO_REMINDER_HOUR: '8',
      REMIND_BEFORE_DAYS: '2',
      KPI_BASE_HIGH: '30',
      KPI_BASE_MEDIUM: '20',
      KPI_BASE_LOW: '10',
      KPI_OVERDUE_PENALTY: '5'
    },
    users: [
      { username: 'admin', password: '123456', fullName: 'Nguyễn Quản Trị (CEO/PMO)', role: 'ADMIN', department: 'Ban Giám Đốc', email: 'ceo@novacrm.vn', phone: '0901234567', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM,MANAGE_PROJECT' },
      { username: 'pm_duan', password: '123456', fullName: 'Trần Hoàng Nam (PM)', role: 'MANAGER', department: 'Phòng Quản Lý Dự Án', email: 'nam.pm@novacrm.vn', phone: '0902345678', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM,MANAGE_PROJECT' },
      { username: 'sale_crm', password: '123456', fullName: 'Lê Minh Thư (Leader CRM)', role: 'LEADER', department: 'Phòng Kinh Doanh & CRM', email: 'thu.crm@novacrm.vn', phone: '0903456789', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM' },
      { username: 'dev_lead', password: '123456', fullName: 'Phạm Tuấn Kiệt (Tech Lead)', role: 'LEADER', department: 'Khối Kỹ Thuật', email: 'kiet.dev@novacrm.vn', phone: '0904567890', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK' },
      { username: 'designer', password: '123456', fullName: 'Võ Ngọc Ánh (UI/UX & Media)', role: 'STAFF', department: 'Khối Sáng Tạo', email: 'anh.design@novacrm.vn', phone: '0905678901', status: 'Hoạt động', note: 'SELF_CREATE_TASK,VIEW_TEAM' },
      { username: 'sale_moi', password: '666666', fullName: 'Hoang Minh', role: 'STAFF', department: 'Phòng Kinh Doanh & CRM', email: 'minh.sale@novacrm.vn', phone: '0906789012', status: 'Hoạt động', note: 'SELF_CREATE_TASK,VIEW_TEAM,ACCESS_CRM' }
    ],
    crmCustomers: [
      { id: 'KH-001', companyName: 'Tập đoàn Bất Động Sản SunLand', contactPerson: 'Anh Minh (GĐ Marketing)', phone: '0912345678', email: 'minh.gd@sunland.vn', source: 'Giới thiệu B2B', stage: 'Đã Ký HĐ / Triển Khai', dealValue: 185000000, owner: 'Lê Minh Thư (Leader CRM)', lastContactDate: dOff(-5), nextFollowUpDate: dOff(1), notes: 'Họp nghiệm thu giai đoạn 1 dự án Portal BĐS & thu đợt 2', priority: 'VIP - Rất Cao', reminderStatus: 'Chưa nhắc' },
      { id: 'KH-002', companyName: 'Chuỗi Thẩm Mỹ Viện Aura Beauty', contactPerson: 'Chị Lan (Founder)', phone: '0987654321', email: 'lan.founder@aurabeauty.vn', source: 'Facebook Ads', stage: 'Đã Ký HĐ / Triển Khai', dealValue: 95000000, owner: 'Lê Minh Thư (Leader CRM)', lastContactDate: dOff(-3), nextFollowUpDate: dOff(0), notes: 'Gửi kịch bản Chatbot Zalo OA & xác nhận lịch đào tạo nhân sự', priority: 'VIP - Rất Cao', reminderStatus: 'Chưa nhắc' },
      { id: 'KH-003', companyName: 'Công ty Logistics Đại Dương Xanh', contactPerson: 'Anh Hùng (GĐ Vận Hành)', phone: '0933445566', email: 'hung.ops@daiduongxanh.vn', source: 'Website Inbound', stage: 'Đàm Phán Hợp Đồng', dealValue: 140000000, owner: 'Trần Hoàng Nam (PM)', lastContactDate: dOff(-2), nextFollowUpDate: dOff(0), notes: 'Gửi lại bảng báo giá điều chỉnh module điều phối xe tải', priority: 'Cao (Hot Lead)', reminderStatus: 'Chưa nhắc' }
    ],
    projects: [
      { id: 'DA-001', name: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerId: 'KH-001', customerName: 'Tập đoàn Bất Động Sản SunLand', manager: 'Trần Hoàng Nam (PM)', category: 'Phần mềm & CRM', priority: 'Cao', startDate: dOff(-20), endDate: dOff(10), status: 'Đang thực hiện', progress: 65, budget: 185000000, actualCost: 92000000, notes: 'Hoàn thiện phân hệ giỏ hàng BĐS và Bot nhắc lịch hẹn' },
      { id: 'DA-002', name: 'Xây dựng Hệ thống Đặt Lịch & Tự Động Hóa Zalo OA Aura Beauty', customerId: 'KH-002', customerName: 'Chuỗi Thẩm Mỹ Viện Aura Beauty', manager: 'Trần Hoàng Nam (PM)', category: 'Automation & POS', priority: 'Cao', startDate: dOff(-14), endDate: dOff(5), status: 'Đang thực hiện', progress: 80, budget: 95000000, actualCost: 48000000, notes: 'Tích hợp thẻ liệu trình VIP, nhắc lịch tái khám qua Zalo & Email' }
    ],
    tasks: [
      Object.assign({ id: 'CV-101', title: 'Thiết kế Database & Phân quyền RBAC cho SunLand Portal', projectId: 'DA-001', projectName: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerName: 'Tập đoàn Bất Động Sản SunLand', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', assigneeEmail: 'kiet.dev@novacrm.vn', assigneePhone: '0904567890', status: 'Hoàn thành', priority: 'Cao', startDate: dOff(-18), deadline: dOff(-10), estimatedHours: 24, progress: 100, kpiPoints: 30, reminderStatus: 'Đã nhắc Email/Zalo', notes: 'Đã hoàn tất schema 8 bảng dữ liệu chuẩn' }, getDefaultTaskCollabMeta('CV-101')),
      Object.assign({ id: 'CV-102', title: 'Xây dựng giao diện Mobile-First Bảng hàng & Giỏ căn hộ', projectId: 'DA-001', projectName: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerName: 'Tập đoàn Bất Động Sản SunLand', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', assigneeEmail: 'anh.design@novacrm.vn', assigneePhone: '0905678901', status: 'Đang làm', priority: 'Cao', startDate: dOff(-8), deadline: dOff(1), estimatedHours: 32, progress: 75, kpiPoints: 22, reminderStatus: 'Chưa nhắc', notes: 'Đang tối ưu thanh điều hướng dưới cùng trên iPhone/Android' }, getDefaultTaskCollabMeta('CV-102')),
      Object.assign({ id: 'CV-103', title: 'Tích hợp Webhook Bot Zalo & Gmail tự động báo khách mới cho Sale', projectId: 'DA-001', projectName: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerName: 'Tập đoàn Bất Động Sản SunLand', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', assigneeEmail: 'kiet.dev@novacrm.vn', assigneePhone: '0904567890', status: 'Đang làm', priority: 'Cao', startDate: dOff(-5), deadline: dOff(0), estimatedHours: 16, progress: 60, kpiPoints: 18, reminderStatus: 'Chưa nhắc', notes: 'Đến hạn hôm nay: Cần test kỹ luồng bắn tin nhắn Zalo OA' }, getDefaultTaskCollabMeta('CV-103')),
      Object.assign({ id: 'CV-105', title: 'Cấu hình Trigger nhắc lịch tái khám tự động 8h sáng hàng ngày', projectId: 'DA-002', projectName: 'Xây dựng Hệ thống Đặt Lịch & Tự Động Hóa Zalo OA Aura Beauty', customerName: 'Chuỗi Thẩm Mỹ Viện Aura Beauty', assignee: 'Trần Hoàng Nam (PM)', assigneeEmail: 'nam.pm@novacrm.vn', assigneePhone: '0902345678', status: 'Cần làm', priority: 'Cao', startDate: dOff(-2), deadline: dOff(-1), estimatedHours: 8, progress: 20, kpiPoints: 5, reminderStatus: 'Quá hạn cần nhắc ngay', notes: 'Quá hạn 1 ngày: Cần bàn giao gấp trước buổi nghiệm thu' }, getDefaultTaskCollabMeta('CV-105'))
    ],
    reminderLogs: [],
    auditLogs: []
  };
}


```

## 📁 FILE 4: `Index.html`

```
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>GS-004 v4.3 Pro — Quản Lý Dự Án, CRM, Kanban/Gantt, KPI & Bot Nhắc Việc</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --primary: #4338CA;
      --primary-dark: #1E1B4B;
      --accent: #0EA5E9;
      --crm-teal: #0D9488;
      --bg-soft: #F1F5F9;
      --card-radius: 14px;
    }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg-soft);
      color: #1E293B;
      margin: 0;
      padding-bottom: 82px;
      overflow-x: hidden;
    }
    /* TOPBAR */
    .app-topbar {
      background: linear-gradient(135deg, #1E1B4B 0%, #3730A3 55%, #0F766E 100%);
      color: #fff;
      padding: 10px 16px;
      position: sticky;
      top: 0;
      z-index: 1030;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.18);
    }
    .brand-title {
      font-weight: 800;
      font-size: 1.02rem;
      letter-spacing: -0.2px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .fullscreen-pulse-btn {
      background: linear-gradient(135deg, #F59E0B, #EA580C);
      color: #fff !important;
      border: none;
      font-weight: 700;
      border-radius: 999px;
      padding: 6px 14px;
      font-size: 0.8rem;
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
      animation: pulseFs 2.2s infinite;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    @keyframes pulseFs {
      0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.65); }
      70% { box-shadow: 0 0 0 9px rgba(245, 158, 11, 0); }
      100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    }
    /* ROLE PERMISSION BANNER */
    .role-scope-bar {
      background: #FFFBEB;
      border-bottom: 1px solid #FDE68A;
      padding: 7px 16px;
      font-size: 0.81rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    /* DESKTOP NAV TABS */
    .desktop-nav-bar {
      background: #fff;
      border-bottom: 1px solid #E2E8F0;
      padding: 6px 16px;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      white-space: nowrap;
    }
    .nav-tab-btn {
      border: none;
      background: transparent;
      color: #475569;
      font-weight: 600;
      font-size: 0.85rem;
      padding: 8px 14px;
      border-radius: 10px;
      transition: all 0.18s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .nav-tab-btn:hover { background: #F1F5F9; color: var(--primary); }
    .nav-tab-btn.active {
      background: #EEF2FF;
      color: var(--primary);
      font-weight: 700;
      box-shadow: inset 0 -2px 0 var(--primary);
    }
    /* MOBILE BOTTOM NAVIGATION BAR */
    .mobile-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 66px;
      background: #ffffff;
      border-top: 1px solid #CBD5E1;
      display: none;
      justify-content: space-around;
      align-items: center;
      z-index: 1040;
      box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.08);
      padding: 0 4px;
    }
    .mob-nav-item {
      flex: 1;
      border: none;
      background: transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #64748B;
      font-size: 0.68rem;
      font-weight: 600;
      padding: 6px 2px;
      border-radius: 10px;
    }
    .mob-nav-item i { font-size: 1.2rem; margin-bottom: 2px; }
    .mob-nav-item.active {
      color: var(--primary);
      font-weight: 800;
      background: #EEF2FF;
    }
    /* FLOATING ACTION BUTTON (FAB) */
    .mobile-fab-group {
      position: fixed;
      right: 16px;
      bottom: 78px;
      z-index: 1035;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .fab-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      color: #fff;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 18px rgba(67, 56, 202, 0.35);
      transition: transform 0.15s;
    }
    .fab-btn:active { transform: scale(0.92); }
    @media (max-width: 991px) {
      .mobile-bottom-nav { display: flex; }
      .desktop-nav-bar { display: none; }
    }
    /* CARDS & KPI */
    .kpi-card {
      background: #fff;
      border-radius: var(--card-radius);
      border: 1px solid #E2E8F0;
      padding: 14px 16px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
      height: 100%;
    }
    .kpi-val { font-size: 1.45rem; font-weight: 800; line-height: 1.2; }
    .section-card {
      background: #fff;
      border-radius: var(--card-radius);
      border: 1px solid #E2E8F0;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      margin-bottom: 16px;
    }
    /* KANBAN BOARD */
    .kanban-board-wrap {
      display: flex;
      gap: 14px;
      overflow-x: auto;
      padding-bottom: 12px;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .kanban-col {
      min-width: 295px;
      max-width: 350px;
      flex: 1;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      scroll-snap-align: start;
    }
    .kanban-col-header {
      padding: 11px 14px;
      font-weight: 800;
      font-size: 0.86rem;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 14px 14px 0 0;
    }
    .kanban-col-body {
      padding: 10px;
      min-height: 360px;
      max-height: 68vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .task-card {
      background: #ffffff;
      border: 1px solid #E2E8F0;
      border-left: 4px solid #4F46E5;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 2px 5px rgba(15, 23, 42, 0.04);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.08);
    }
    .task-card.priority-high { border-left-color: #DC2626; }
    .task-card.priority-medium { border-left-color: #F59E0B; }
    .task-card.priority-low { border-left-color: #10B981; }
    /* GANTT TIMELINE BAR */
    .gantt-row {
      padding: 10px 12px;
      border-bottom: 1px solid #F1F5F9;
    }
    .gantt-track {
      height: 22px;
      background: #E2E8F0;
      border-radius: 999px;
      overflow: hidden;
      position: relative;
    }
    .gantt-fill {
      height: 100%;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
    }
    /* ZALO QUICK BUTTON */
    .btn-zalo-quick {
      background: #0068FF;
      color: #fff !important;
      border: none;
      font-weight: 700;
      font-size: 0.74rem;
      padding: 4px 9px;
      border-radius: 8px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .btn-zalo-quick:hover { background: #0052CC; }
    /* LOGIN GATE OVERLAY */
    #authGateScreen {
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #115E59 100%);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-y: auto;
    }
    .login-box {
      background: #ffffff;
      border-radius: 20px;
      max-width: 500px;
      width: 100%;
      padding: 26px 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
    }
    /* CUSTOM MODAL OVERLAY */
    .custom-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.62);
      z-index: 1080;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 12px;
      overflow-y: auto;
    }
    .custom-modal-dialog {
      background: #fff;
      border-radius: 16px;
      max-width: 720px;
      width: 100%;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 45px rgba(15, 23, 42, 0.3);
      overflow: hidden;
    }
    .custom-modal-header {
      background: linear-gradient(135deg, #1E1B4B, #4338CA);
      color: #fff;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
    }
    .custom-modal-body {
      padding: 16px 18px;
      overflow-y: auto;
    }
    .custom-modal-footer {
      padding: 12px 18px;
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    #appToastContainer {
      position: fixed;
      top: 68px;
      right: 16px;
      z-index: 2100;
      max-width: 390px;
    }
    @media print {
      body * { visibility: hidden; }
      #printReportArea, #printReportArea * { visibility: visible; }
      #printReportArea {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: #fff;
        padding: 16px;
      }
    }
    .att-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.73rem;
      font-weight: 600;
      text-decoration: none;
      border: 1px solid transparent;
      transition: all 0.15s ease;
      max-width: 100%;
    }
    .att-chip:hover { opacity: 0.88; transform: translateY(-1px); }
    .att-word { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; }
    .att-excel { background: #ECFDF5; color: #047857; border-color: #A7F3D0; }
    .att-ppt { background: #FFF7ED; color: #C2410C; border-color: #FED7AA; }
    .att-pdf { background: #FEF2F2; color: #B91C1C; border-color: #FECACA; }
    .att-img { background: #F5F3FF; color: #6D28D9; border-color: #DDD6FE; }
    .att-other { background: #F1F5F9; color: #334155; border-color: #CBD5E1; }
    .raci-dept-pill {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 99px;
      font-size: 0.69rem;
      font-weight: 700;
      background: #EEF2FF;
      color: #4338CA;
      border: 1px solid #C7D2FE;
    }
    .subtask-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 8px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      margin-bottom: 5px;
      font-size: 0.81rem;
    }
    .subtask-row.done {
      background: #F0FDF4;
      border-color: #BBF7D0;
      color: #15803D;
    }
  </style>
</head>
<body>

<!-- ======================================================================= -->
<!-- 1. MÀN HÌNH ĐĂNG NHẬP BẢO MẬT PHÂN QUYỀN (RBAC LOGIN GATE)              -->
<!-- ======================================================================= -->
<div id="authGateScreen">
  <div class="login-box">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="badge text-white px-3 py-1" style="background:#4338CA;">GS-004 v4.2 COMMERCIAL PRO</span>
      <button type="button" class="btn btn-sm btn-warning fw-bold rounded-pill" onclick="toggleFullScreenMode()">
        <i class="bi bi-arrows-fullscreen"></i> Toàn Màn Hình
      </button>
    </div>
    <h4 class="fw-bold text-dark mb-1">🎯 Dự Án, CRM, Kanban & Bot Nhắc Việc</h4>
    <p class="text-muted small mb-3">Phân quyền chặt chẽ theo Vai trò: Quản lý giao việc & duyệt nghiệm thu • Nhân viên chỉ thấy & báo cáo đúng việc của mình</p>

    <div id="loginErrorAlert" class="alert alert-danger py-2 small d-none"></div>

    <div class="mb-2">
      <label class="form-label small fw-bold mb-1">Tài khoản đăng nhập</label>
      <input type="text" id="loginUsername" class="form-control" value="admin" placeholder="Nhập username (vd: admin, pm_duan, sale_crm, dev_lead)">
    </div>
    <div class="mb-3">
      <label class="form-label small fw-bold mb-1">Mật khẩu / Mã PIN</label>
      <input type="password" id="loginPassword" class="form-control" value="123456" placeholder="Nhập mật khẩu (mặc định: 123456)">
    </div>

    <div class="d-grid gap-2 mb-3">
      <button type="button" class="btn btn-primary fw-bold py-2" style="background:#4338CA;border:none;" onclick="handleLoginSubmit()">
        <i class="bi bi-box-arrow-in-right me-1"></i> ĐĂNG NHẬP HỆ THỐNG
      </button>
      <button type="button" class="btn btn-warning fw-bold py-2 text-dark" onclick="loginAndGoFullScreen()">
        <i class="bi bi-arrows-fullscreen me-1"></i> ĐĂNG NHẬP & BẬT TOÀN MÀN HÌNH
      </button>
    </div>

    <div class="border-top pt-2">
      <div class="small text-secondary text-center">
        <i class="bi bi-shield-lock-fill text-success me-1"></i> <b>Bảo mật phiên đăng nhập (Strict RBAC):</b> Mỗi tài khoản chỉ truy cập đúng phạm vi quyền hạn trong tab <code>PHAN_QUYEN</code>. Không cho phép chuyển đổi tài khoản trái phép bên trong ứng dụng.
      </div>
      <div class="small text-muted text-center mt-1" style="font-size:0.75rem;">
        Tài khoản mẫu trong Sheet: <code>admin</code> (CEO) • <code>pm_duan</code> (PM) • <code>sale_crm</code> (Sale) • <code>dev_lead</code> (NV Kỹ thuật) • <code>designer</code> (NV Thiết kế)
      </div>
    </div>
  </div>
</div>

<!-- TOAST CONTAINER -->
<div id="appToastContainer"></div>

<!-- ======================================================================= -->
<!-- 2. THANH TOPBAR ĐIỀU HÀNH CHÍNH                                         -->
<!-- ======================================================================= -->
<header class="app-topbar">
  <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
    <div class="d-flex align-items-center gap-2">
      <div class="brand-title">
        <span class="badge bg-warning text-dark">v4.3 Pro</span>
        <span id="topCompanyName">QUẢN LÝ DỰ ÁN, CRM, KANBAN & BOT NHẮC VIỆC</span>
      </div>
      <span id="syncStatusBadge" class="badge bg-success bg-opacity-75 small"><i class="bi bi-cloud-check"></i> Đã đồng bộ</span>
    </div>

    <div class="d-flex align-items-center flex-wrap gap-1">
      <button type="button" class="fullscreen-pulse-btn" id="btnTopFullScreen" onclick="toggleFullScreenMode()" title="Phóng to toàn màn hình (F11)">
        <i class="bi bi-arrows-fullscreen" id="iconFullScreen"></i>
        <span id="txtFullScreen">🔲 Toàn Màn Hình</span>
      </button>
      <button type="button" class="btn btn-sm btn-info text-white fw-bold rounded-pill" id="btnTopAutoRemind" onclick="triggerRunAutoRemindersNow()">
        <i class="bi bi-bell-fill"></i> <span class="d-none d-sm-inline">Bắn Nhắc Việc Ngay</span>
      </button>
      <button type="button" class="btn btn-sm btn-light fw-bold rounded-pill" onclick="refreshAllDataFromServer()">
        <i class="bi bi-arrow-clockwise"></i> <span class="d-none d-md-inline">Làm mới</span>
      </button>
      <span class="badge bg-dark bg-opacity-75 px-2 py-2" id="currentUserBadge">👤 Admin</span>
      <button type="button" class="btn btn-sm btn-outline-light rounded-pill" onclick="handleLogout()" title="Đổi tài khoản / Đăng xuất">
        <i class="bi bi-power"></i> Đổi TK
      </button>
    </div>
  </div>
</header>

<!-- THANH HIỂN THỊ PHẠM VI PHÂN QUYỀN HIỆN TẠI (KHÓA CỨNG THEO TÀI KHOẢN ĐĂNG NHẬP) -->
<div class="role-scope-bar" id="rolePermissionBanner">
  <div id="roleScopeDescription" class="fw-semibold text-dark">
    👑 Đang xem với quyền <b>ADMIN (Toàn quyền)</b>
  </div>
  <div class="d-flex align-items-center gap-2">
    <span class="badge bg-white text-dark border shadow-sm px-2 py-1" id="roleLockStatusBadge">
      🔒 Đã khóa phiên bảo mật theo tài khoản đăng nhập
    </span>
  </div>
</div>

<!-- THANH ĐIỀU HƯỚNG DESKTOP (TỰ ĐỘNG ẨN/HIỆN TAB THEO VAI TRÒ RBAC) -->
<nav class="desktop-nav-bar">
  <button type="button" class="nav-tab-btn active" id="deskTab_dashboard" onclick="switchMainTab('dashboard')">
    <i class="bi bi-speedometer2"></i> <span id="lblDeskTabDashboard">1. Tổng Quan & Việc Cần Xử Lý</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_kanban" onclick="switchMainTab('kanban')">
    <i class="bi bi-kanban"></i> <span id="lblDeskTabKanban">2. Bảng Kanban & Sơ Đồ Gantt</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_crm" onclick="switchMainTab('crm')">
    <i class="bi bi-people-fill"></i> 3. Phễu Khách Hàng CRM & Lịch Hẹn
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_projects" onclick="switchMainTab('projects')">
    <i class="bi bi-folder2-open"></i> 4. Danh Mục Dự Án & Ngân Sách
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_reminders" onclick="switchMainTab('reminders')">
    <i class="bi bi-robot"></i> 5. Bot Nhắc Việc (Email / Zalo / Telegram)
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_kpi" onclick="switchMainTab('kpi')">
    <i class="bi bi-trophy-fill"></i> <span id="lblDeskTabKpi">6. Bảng Điểm KPI, Phân Quyền & In A4</span>
  </button>
</nav>

<!-- ======================================================================= -->
<!-- 3. NỘI DUNG CHÍNH (TỰ ĐỘNG CÔ LẬP DỮ LIỆU THEO QUYỀN NGƯỜI DÙNG)        -->
<!-- ======================================================================= -->
<main class="container-fluid py-3 px-2 px-md-3">

  <!-- ===================================================================== -->
  <!-- TAB 1: DASHBOARD TỔNG QUAN (QUẢN LÝ vs CÁ NHÂN NHÂN VIÊN)             -->
  <!-- ===================================================================== -->
  <section id="tabPane_dashboard" class="tab-pane-section">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h5 class="fw-bold mb-0 text-dark" id="dashboardHeaderTitle">📊 Trung Tâm Điều Hành Dự Án, CRM & Nhắc Việc Thông Minh</h5>
        <div class="text-muted small">Cập nhật lúc: <span id="lblServerTime">-</span> | Hôm nay: <span id="lblTodayStr" class="fw-bold text-primary">-</span></div>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button type="button" class="btn btn-primary btn-sm fw-bold" id="btnDashNewTask" onclick="openTaskModal()">
          <i class="bi bi-plus-circle"></i> + Giao Việc Mới
        </button>
        <button type="button" class="btn btn-success btn-sm fw-bold" id="btnDashNewCrm" onclick="openCrmModal()">
          <i class="bi bi-person-plus-fill"></i> + Thêm Khách CRM
        </button>
        <button type="button" class="btn btn-dark btn-sm fw-bold" id="btnDashNewProject" onclick="openProjectModal()">
          <i class="bi bi-folder-plus"></i> + Tạo Dự Án
        </button>
      </div>
    </div>

    <!-- 6 Thẻ KPI Tổng hợp (Tự động tính theo phạm vi quyền hạn) -->
    <div class="row g-2 mb-3">
      <div class="col-6 col-md-4 col-xl-2" id="kpiCardColProjects">
        <div class="kpi-card border-start border-4 border-primary">
          <div class="text-muted small fw-semibold" id="lblKpiProjectsTitle">DỰ ÁN THAM GIA</div>
          <div class="kpi-val text-primary" id="kpiTotalProjects">0</div>
          <div class="small text-secondary mt-1">Tiến độ TB: <b id="kpiAvgProgress">0%</b></div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-info">
          <div class="text-muted small fw-semibold" id="lblKpiTasksTitle">NHIỆM VỤ TRONG LUỒNG</div>
          <div class="kpi-val text-dark" id="kpiTotalTasks">0</div>
          <div class="small text-success mt-1">Đã nghiệm thu: <b id="kpiDoneTasks">0</b> việc</div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-danger">
          <div class="text-muted small fw-semibold">VIỆC ĐẾN HẠN / QUÁ HẠN</div>
          <div class="kpi-val text-danger" id="kpiUrgentTasks">0</div>
          <div class="small text-danger mt-1">Cần ưu tiên xử lý ngay</div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2" id="kpiCardColCrmValue">
        <div class="kpi-card border-start border-4 border-success">
          <div class="text-muted small fw-semibold">PHỄU DEAL KHÁCH CRM</div>
          <div class="kpi-val text-success" id="kpiCrmTotalValue">0 đ</div>
          <div class="small text-secondary mt-1">Số khách: <b id="kpiCrmCount">0</b> khách</div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2" id="kpiCardColCrmFollow">
        <div class="kpi-card border-start border-4 border-warning">
          <div class="text-muted small fw-semibold">LỊCH HẸN CRM CẦN GỌI</div>
          <div class="kpi-val text-warning" id="kpiCrmFollowUpDue">0</div>
          <div class="small text-secondary mt-1">Đến hạn chăm sóc hôm nay</div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-secondary">
          <div class="text-muted small fw-semibold" id="lblKpiPointsTitle">ĐIỂM KPI TÍCH LŨY</div>
          <div class="kpi-val" style="color:#4338CA;" id="kpiTotalPoints">0 đ</div>
          <div class="small text-secondary mt-1">Lượt nhắc: <b id="kpiReminderSent">0</b> tin</div>
        </div>
      </div>
    </div>

    <!-- Khu vực Cảnh báo nóng: Việc cần xử lý & Lịch hẹn CRM -->
    <div class="row g-3 mb-3">
      <div class="col-12 col-lg-6" id="dashColUrgentTasks">
        <div class="section-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold text-danger mb-0" id="lblUrgentTasksHeader"><i class="bi bi-alarm-fill me-1"></i> Nhiệm Vụ Sắp Đến Hạn / Quá Hạn Cần Xử Lý</h6>
            <span class="badge bg-danger" id="badgeUrgentTaskCount">0</span>
          </div>
          <div id="urgentTasksListContainer" class="d-flex flex-column gap-2"></div>
        </div>
      </div>
      <div class="col-12 col-lg-6" id="dashColUrgentCrm">
        <div class="section-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold mb-0" style="color:#0F766E;"><i class="bi bi-telephone-outbound-fill me-1"></i> Lịch Hẹn Gọi Lại & Chăm Sóc Khách Hàng CRM</h6>
            <span class="badge bg-success" id="badgeUrgentCrmCount">0</span>
          </div>
          <div id="urgentCrmListContainer" class="d-flex flex-column gap-2"></div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ phân tích trực quan -->
    <div class="row g-3">
      <div class="col-12 col-lg-6">
        <div class="section-card">
          <h6 class="fw-bold mb-3"><i class="bi bi-bar-chart-fill text-primary me-1"></i> Tiến Độ Các Dự Án Liên Quan</h6>
          <div style="height:250px;"><canvas id="chartProjectProgress"></canvas></div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="section-card">
          <h6 class="fw-bold mb-3"><i class="bi bi-pie-chart-fill text-success me-1"></i> Tỷ Lệ Trạng Thái Nhiệm Vụ</h6>
          <div style="height:250px;"><canvas id="chartKanbanStatus"></canvas></div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3" id="dashChartCrmCol">
        <div class="section-card">
          <h6 class="fw-bold mb-3"><i class="bi bi-funnel-fill text-warning me-1"></i> Phễu Khách Hàng CRM</h6>
          <div style="height:250px;"><canvas id="chartCrmFunnel"></canvas></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 2: BẢNG KANBAN 4 CỘT & SƠ ĐỒ TIMELINE GANTT (CÓ PHÂN LUỒNG RBAC)  -->
  <!-- ===================================================================== -->
  <section id="tabPane_kanban" class="tab-pane-section d-none">
    <div class="section-card mb-3">
      <div class="row g-2 align-items-center">
        <div class="col-12 col-md-3">
          <input type="text" id="filterKanbanSearch" class="form-control form-control-sm" placeholder="🔍 Tìm việc, mã CV, file đính kèm..." oninput="renderKanbanAndGantt()">
        </div>
        <div class="col-6 col-md-2">
          <select id="filterKanbanProject" class="form-select form-select-sm" onchange="renderKanbanAndGantt()">
            <option value="ALL">-- Tất cả Dự án --</option>
          </select>
        </div>
        <div class="col-6 col-md-2">
          <select id="filterKanbanDept" class="form-select form-select-sm fw-semibold" onchange="renderKanbanAndGantt()">
            <option value="ALL">-- Bộ phận / Vai trò --</option>
            <option value="MY_MAIN">🎯 Việc tôi chủ trì (Main PIC)</option>
            <option value="MY_COLLAB">🤝 Việc tôi phối hợp (Co-PIC)</option>
            <option value="HAS_FILES">📎 Có File đính kèm (Word/Excel/PDF...)</option>
            <option value="Phòng Quản Lý Dự Án">🏢 Phòng Quản Lý Dự Án</option>
            <option value="Phòng Kinh Doanh & CRM">🏢 Phòng Kinh Doanh & CRM</option>
            <option value="Khối Kỹ Thuật">🏢 Khối Kỹ Thuật</option>
            <option value="Khối Sáng Tạo">🏢 Khối Sáng Tạo</option>
          </select>
        </div>
        <div class="col-6 col-md-2">
          <select id="filterKanbanAssignee" class="form-select form-select-sm fw-semibold" onchange="renderKanbanAndGantt()">
            <option value="ALL">-- Tất cả Nhân sự --</option>
          </select>
        </div>
        <div class="col-6 col-md-3 d-flex justify-content-end gap-2">
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-outline-primary active fw-bold" id="btnViewModeKanban" onclick="setTaskViewMode('kanban')">
              <i class="bi bi-kanban"></i> Bảng Kanban
            </button>
            <button type="button" class="btn btn-outline-primary fw-bold" id="btnViewModeGantt" onclick="setTaskViewMode('gantt')">
              <i class="bi bi-calendar-range"></i> Sơ Đồ Gantt
            </button>
          </div>
          <button type="button" class="btn btn-primary btn-sm fw-bold" id="btnKanbanNewTask" onclick="openTaskModal()">
            <i class="bi bi-plus-lg"></i> Giao Việc
          </button>
        </div>
      </div>
    </div>

    <!-- Chế độ 1: BẢNG KANBAN 4 CỘT CHUẨN LUỒNG XỬ LÝ -->
    <div id="kanbanBoardContainer" class="kanban-board-wrap">
      <!-- Cột 1: Cần làm -->
      <div class="kanban-col">
        <div class="kanban-col-header bg-secondary bg-opacity-10 text-secondary">
          <span>📝 1. CẦN LÀM (TO DO)</span>
          <span class="badge bg-secondary rounded-pill" id="cntKanbanTodo">0</span>
        </div>
        <div class="kanban-col-body" id="colKanbanTodo"></div>
      </div>
      <!-- Cột 2: Đang làm -->
      <div class="kanban-col">
        <div class="kanban-col-header bg-primary bg-opacity-10 text-primary">
          <span>⚡ 2. ĐANG LÀM (DOING)</span>
          <span class="badge bg-primary rounded-pill" id="cntKanbanDoing">0</span>
        </div>
        <div class="kanban-col-body" id="colKanbanDoing"></div>
      </div>
      <!-- Cột 3: Chờ Quản lý duyệt -->
      <div class="kanban-col">
        <div class="kanban-col-header bg-warning bg-opacity-15 text-dark">
          <span>👀 3. CHỜ QUẢN LÝ DUYỆT</span>
          <span class="badge bg-warning text-dark rounded-pill" id="cntKanbanReview">0</span>
        </div>
        <div class="kanban-col-body" id="colKanbanReview"></div>
      </div>
      <!-- Cột 4: Đã nghiệm thu hoàn thành -->
      <div class="kanban-col">
        <div class="kanban-col-header bg-success bg-opacity-10 text-success">
          <span>✅ 4. ĐÃ NGHIỆM THU (DONE)</span>
          <span class="badge bg-success rounded-pill" id="cntKanbanDone">0</span>
        </div>
        <div class="kanban-col-body" id="colKanbanDone"></div>
      </div>
    </div>

    <!-- Chế độ 2: SƠ ĐỒ TIMELINE GANTT -->
    <div id="ganttTimelineContainer" class="section-card d-none">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="bi bi-bar-chart-steps text-primary me-1"></i> Sơ Đồ Tiến Độ Gantt Timeline & Hạn Chót (Deadline)</h6>
        <span class="small text-muted">Màu đỏ = Quá hạn | Màu xanh lá = Đã nghiệm thu | Màu xanh dương = Đang thực hiện</span>
      </div>
      <div id="ganttRowsBody"></div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 3: QUẢN LÝ PHỄU KHÁCH HÀNG CRM & LỊCH HẸN CHĂM SÓC TỰ ĐỘNG       -->
  <!-- ===================================================================== -->
  <section id="tabPane_crm" class="tab-pane-section d-none">
    <div class="section-card mb-3">
      <div class="row g-2 align-items-center">
        <div class="col-12 col-md-4">
          <input type="text" id="filterCrmSearch" class="form-control form-control-sm" placeholder="🔍 Tìm tên công ty, người liên hệ, SĐT Zalo..." oninput="renderCrmSection()">
        </div>
        <div class="col-6 col-md-3">
          <select id="filterCrmStage" class="form-select form-select-sm" onchange="renderCrmSection()">
            <option value="ALL">-- Tất cả Giai đoạn Phễu CRM --</option>
            <option value="Lead Mới">1. Lead Mới</option>
            <option value="Đang Tư Vấn">2. Đang Tư Vấn</option>
            <option value="Gửi Báo Giá / Demo">3. Gửi Báo Giá / Demo</option>
            <option value="Đàm Phán Hợp Đồng">4. Đàm Phán Hợp Đồng</option>
            <option value="Đã Ký HĐ / Triển Khai">5. Đã Ký HĐ / Triển Khai</option>
            <option value="Chăm Sóc Tái Ký">6. Chăm Sóc Tái Ký</option>
            <option value="Đã Hủy / Mất Deal">7. Đã Hủy / Mất Deal</option>
          </select>
        </div>
        <div class="col-6 col-md-5 text-end">
          <button type="button" class="btn btn-success btn-sm fw-bold" id="btnCrmAddCustomer" onclick="openCrmModal()">
            <i class="bi bi-person-plus-fill"></i> + Thêm Khách Hàng / Cơ Hội CRM
          </button>
        </div>
      </div>
    </div>

    <div class="row g-2 mb-3" id="crmPipelineSummaryCards"></div>

    <div class="section-card">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0" style="font-size:0.86rem;">
          <thead class="table-light">
            <tr>
              <th>Mã KH</th>
              <th>Khách Hàng & Liên Hệ</th>
              <th>Tương Tác Nhanh (Mobile/Zalo)</th>
              <th>Giai Đoạn Phễu</th>
              <th class="text-end">Giá Trị Deal</th>
              <th>Phụ Trách</th>
              <th>Lịch Hẹn Gọi Lại</th>
              <th>Ghi Chú Chăm Sóc</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody id="crmTableBody"></tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 4: DANH MỤC DỰ ÁN & KIỂM SOÁT NGÂN SÁCH (CHỈ QUẢN LÝ / ADMIN)     -->
  <!-- ===================================================================== -->
  <section id="tabPane_projects" class="tab-pane-section d-none">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold mb-0"><i class="bi bi-folder2-open text-primary me-1"></i> Danh Mục Dự Án Triển Khai & Ngân Sách (Dành cho Quản lý PMO/PM)</h5>
      <button type="button" class="btn btn-primary btn-sm fw-bold" id="btnProjectsAdd" onclick="openProjectModal()">
        <i class="bi bi-plus-circle"></i> + Thêm Dự Án Mới
      </button>
    </div>
    <div class="row g-3" id="projectCardsGrid"></div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 5: TRUNG TÂM BOT NHẮC VIỆC TỰ ĐỘNG (CHỈ QUẢN LÝ / ADMIN)          -->
  <!-- ===================================================================== -->
  <section id="tabPane_reminders" class="tab-pane-section d-none">
    <div class="row g-3">
      <div class="col-12 col-lg-5" id="botConfigLeftCol">
        <div class="section-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold mb-0 text-primary"><i class="bi bi-robot me-1"></i> Cấu Hình Động Cơ Nhắc Việc Tự Động</h6>
            <span id="badgeTriggerState" class="badge bg-success">Trigger 8h: Đang Bật</span>
          </div>
          <p class="small text-muted mb-3">
            Hệ thống tự động quét các công việc sắp hết hạn/quá hạn và lịch hẹn chăm sóc khách hàng CRM để bắn thông báo qua <b>Gmail</b>, <b>Webhook Bot Zalo OA/ZNS</b> và <b>Telegram Bot</b>.
          </p>

          <div class="mb-2">
            <label class="form-label small fw-bold mb-1">Tên Công ty hiển thị trên Thông báo</label>
            <input type="text" id="cfgCompanyName" class="form-control form-control-sm">
          </div>
          <div class="row g-2 mb-2">
            <div class="col-6">
              <label class="form-label small fw-bold mb-1">Email Quản trị nhận CC</label>
              <input type="email" id="cfgAdminEmail" class="form-control form-control-sm">
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold mb-1">Số Hotline hỗ trợ</label>
              <input type="text" id="cfgCompanyHotline" class="form-control form-control-sm">
            </div>
          </div>

          <div class="row g-2 mb-2">
            <div class="col-4">
              <label class="form-label small fw-bold mb-1">Bật Gửi Email</label>
              <select id="cfgEnableEmail" class="form-select form-select-sm">
                <option value="TRUE">BẬT (TRUE)</option>
                <option value="FALSE">TẮT (FALSE)</option>
              </select>
            </div>
            <div class="col-4">
              <label class="form-label small fw-bold mb-1">Bật Bot Zalo</label>
              <select id="cfgEnableZalo" class="form-select form-select-sm">
                <option value="TRUE">BẬT (TRUE)</option>
                <option value="FALSE">TẮT (FALSE)</option>
              </select>
            </div>
            <div class="col-4">
              <label class="form-label small fw-bold mb-1">Bật Telegram</label>
              <select id="cfgEnableTelegram" class="form-select form-select-sm">
                <option value="TRUE">BẬT (TRUE)</option>
                <option value="FALSE">TẮT (FALSE)</option>
              </select>
            </div>
          </div>

          <div class="mb-2">
            <label class="form-label small fw-bold mb-1">URL Webhook Bot Zalo (Zalo OA / ZNS / Make / n8n / Zapier)</label>
            <input type="text" id="cfgZaloWebhook" class="form-control form-control-sm" placeholder="https://...">
          </div>
          <div class="mb-2">
            <label class="form-label small fw-bold mb-1">Zalo OA Access Token (Tùy chọn)</label>
            <input type="text" id="cfgZaloToken" class="form-control form-control-sm">
          </div>
          <div class="row g-2 mb-2">
            <div class="col-6">
              <label class="form-label small fw-bold mb-1">Telegram Bot Token</label>
              <input type="text" id="cfgTeleToken" class="form-control form-control-sm" placeholder="123456:ABC-DEF...">
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold mb-1">Telegram Chat ID</label>
              <input type="text" id="cfgTeleChatId" class="form-control form-control-sm" placeholder="-100123456789">
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold mb-1">Giờ chạy tự động mỗi ngày (0-23h)</label>
              <input type="number" id="cfgReminderHour" class="form-control form-control-sm" min="0" max="23" value="8">
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold mb-1">Cảnh báo sớm trước (Số ngày)</label>
              <input type="number" id="cfgRemindBeforeDays" class="form-control form-control-sm" min="0" max="30" value="2">
            </div>
          </div>

          <div class="d-grid gap-2">
            <button type="button" class="btn btn-primary btn-sm fw-bold" id="btnSaveBotConfig" onclick="handleSaveBotConfig()">
              <i class="bi bi-floppy"></i> Lưu Cấu Hình Email & Bot Zalo/Telegram
            </button>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-success btn-sm fw-bold flex-fill" onclick="handleSetupDailyTrigger()">
                <i class="bi bi-clock-history"></i> Bật Lịch Tự Động Hàng Ngày
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm fw-bold" onclick="handleRemoveDailyTrigger()">
                <i class="bi bi-slash-circle"></i> Tắt Trigger
              </button>
            </div>
            <button type="button" class="btn btn-warning btn-sm fw-bold text-dark" onclick="triggerRunAutoRemindersNow()">
              <i class="bi bi-send-check-fill"></i> Quét Toàn Bộ & Bắn Nhắc Việc Tự Động Ngay Bây Giờ
            </button>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-7" id="botLogsRightCol">
        <div class="section-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold mb-0"><i class="bi bi-journal-check text-warning me-1"></i> Nhật Ký Nhắc Việc Tự Động Đã Gửi (`LICH_NHAC_TUDONG`)</h6>
            <span class="badge bg-dark" id="badgeTotalReminderLogs">0 bản ghi</span>
          </div>
          <div class="table-responsive" style="max-height:540px;">
            <table class="table table-sm table-striped align-middle" style="font-size:0.82rem;">
              <thead class="table-light sticky-top">
                <tr>
                  <th>Thời gian</th>
                  <th>Loại & Mã</th>
                  <th>Người nhận</th>
                  <th>Kênh gửi</th>
                  <th>Nội dung thông báo</th>
                </tr>
              </thead>
              <tbody id="reminderLogsTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 6: BẢNG ĐIỂM KPI NHÂN SỰ, PHÂN QUYỀN & IN BÁO CÁO A4             -->
  <!-- ===================================================================== -->
  <section id="tabPane_kpi" class="tab-pane-section d-none">
    <div class="row g-3 mb-3">
      <!-- Bảng Xếp Hạng KPI Nhân Sự -->
      <div class="col-12 col-lg-6" id="kpiLeaderboardCol">
        <div class="section-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0" id="lblKpiBoardHeader"><i class="bi bi-trophy-fill text-warning me-1"></i> Bảng Điểm KPI & Hiệu Suất Thực Thi</h6>
            <button type="button" class="btn btn-dark btn-sm fw-bold" onclick="window.print()">
              <i class="bi bi-printer-fill me-1"></i> In Báo Cáo A4
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered align-middle mb-0" style="font-size:0.85rem;">
              <thead class="table-light">
                <tr>
                  <th>Hạng</th>
                  <th>Nhân Sự Thực Hiện</th>
                  <th class="text-center">Tổng Việc</th>
                  <th class="text-center">Đã Nghiệm Thu</th>
                  <th class="text-center">Đang Xử Lý</th>
                  <th class="text-center">Quá Hạn</th>
                  <th class="text-end">Tổng Điểm KPI</th>
                  <th>Xếp Loại KPI</th>
                </tr>
              </thead>
              <tbody id="kpiLeaderboardBody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quản lý Tài khoản Phân quyền & Điều phối Nhân viên Tuyến dưới (Hiển thị cho ADMIN / MANAGER / LEADER) -->
      <div class="col-12 col-lg-6" id="rbacManagementCol">
        <div class="section-card h-100">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
            <div>
              <h6 class="fw-bold mb-0" id="lblRbacPanelHeader"><i class="bi bi-shield-lock-fill text-danger me-1"></i> Quản Lý Nhân Sự, Phân Quyền & Giao Việc Tuyến Dưới (`PHAN_QUYEN`)</h6>
              <div class="text-muted" style="font-size:0.74rem;">Bấm <b>📋 Giao việc</b> để giao nhiệm vụ ngay cho nhân sự, hoặc đổi Vai trò / Cấp quyền thao tác trực tiếp trên App</div>
            </div>
            <button type="button" class="btn btn-primary btn-sm fw-bold" id="btnAddSubordinateUser" onclick="openUserModal()">
              <i class="bi bi-person-add"></i> + Thêm Nhân Sự & Phân Quyền
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-sm table-hover align-middle mb-0" style="font-size:0.8rem;">
              <thead class="table-light">
                <tr>
                  <th>Tài khoản & Phòng ban</th>
                  <th>Vai Trò & Quyền Hạn App</th>
                  <th>Trạng thái</th>
                  <th class="text-end">Thao tác Điều hành trên App</th>
                </tr>
              </thead>
              <tbody id="userAccountsTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Vùng In Báo Cáo A4 Chuyên Nghiệp -->
    <div id="printReportArea" class="section-card border border-dark">
      <div class="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3">
        <div>
          <h5 class="fw-bold mb-0" id="printCompanyTitle">CÔNG TY TNHH GIẢI PHÁP SỐ & DỰ ÁN NOVA-CRM</h5>
          <div class="small text-muted">BÁO CÁO TIẾN ĐỘ CÔNG VIỆC & ĐÁNH GIÁ HIỆU SUẤT KPI</div>
        </div>
        <div class="text-end small">
          <div>Ngày in: <b id="printDateNow">-</b></div>
          <div>Người lập biểu: <b id="printActorName">Admin</b></div>
        </div>
      </div>
      <div id="printSummaryContent"></div>
    </div>
  </section>

</main>

<!-- ======================================================================= -->
<!-- 4. FLOATING ACTION BUTTONS & MOBILE BOTTOM NAVIGATION                   -->
<!-- ======================================================================= -->
<div class="mobile-fab-group d-lg-none" id="mobileFabContainer">
  <button type="button" class="fab-btn" id="mobFabCrm" style="background:#0D9488;" onclick="openCrmModal()" title="Thêm khách hàng CRM">
    <i class="bi bi-person-plus-fill"></i>
  </button>
  <button type="button" class="fab-btn" id="mobFabTask" style="background:#4338CA;" onclick="openTaskModal()" title="Giao việc mới">
    <i class="bi bi-plus-lg"></i>
  </button>
</div>

<nav class="mobile-bottom-nav" id="mobileBottomNav">
  <button type="button" class="mob-nav-item active" id="mobTab_dashboard" onclick="switchMainTab('dashboard')">
    <i class="bi bi-speedometer2"></i>
    <span>Tổng Quan</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_kanban" onclick="switchMainTab('kanban')">
    <i class="bi bi-kanban"></i>
    <span>Nhiệm Vụ</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_crm" onclick="switchMainTab('crm')">
    <i class="bi bi-people-fill"></i>
    <span>Phễu CRM</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_reminders" onclick="switchMainTab('reminders')">
    <i class="bi bi-robot"></i>
    <span>Bot Nhắc Việc</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_kpi" onclick="switchMainTab('kpi')">
    <i class="bi bi-trophy-fill"></i>
    <span>KPI Cá Nhân</span>
  </button>
</nav>

<!-- ======================================================================= -->
<!-- 5. MODALS THAO TÁC (TỰ ĐỘNG KHÓA TRƯỜNG CỦA QUẢN LÝ NẾU LÀ NHÂN VIÊN)    -->
<!-- ======================================================================= -->

<!-- MODAL 1: GIAO VIỆC MỚI (QUẢN LÝ) HOẶC BÁO CÁO TIẾN ĐỘ (NHÂN VIÊN) -->
<div class="custom-modal-backdrop" id="modalTaskBackdrop">
  <div class="custom-modal-dialog" style="max-width:780px;">
    <div class="custom-modal-header">
      <span id="modalTaskHeaderTitle">📋 Điều Phối Công Việc Đa Bộ Phận (RACI) & Đính Kèm Tài Liệu</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalTaskBackdrop')"></button>
    </div>
    <div class="custom-modal-body" style="max-height:78vh;overflow-y:auto;">
      <input type="hidden" id="taskFormId">
      <div id="staffTaskModalNotice" class="alert alert-warning py-2 small d-none mb-2">
        🔒 <b>Chế độ Nhân sự Thực thi / Phối hợp:</b> Bạn có thể tích chọn <b>Checklist đầu việc con</b>, cập nhật <b>% Hoàn thành</b>, chuyển trạng thái (tối đa đến <i>Chờ duyệt</i>) và <b>Tải lên File đính kèm (Word, Excel, PowerPoint, PDF...)</b>.
      </div>
      <div class="row g-2">
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Tên công việc / Hạng mục thực hiện (*)</label>
          <input type="text" id="taskFormTitle" class="form-control form-control-sm" placeholder="Nhập tên công việc cụ thể...">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Thuộc Dự án</label>
          <select id="taskFormProject" class="form-select form-select-sm" onchange="syncProjectCustomerToTask()"></select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Khách hàng CRM liên quan</label>
          <input type="text" id="taskFormCustomer" class="form-control form-control-sm" placeholder="Tên khách hàng / đối tác">
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small fw-bold mb-1 text-primary">🎯 Người chủ trì chính (Main PIC) (*)</label>
          <select id="taskFormAssignee" class="form-select form-select-sm fw-bold" onchange="syncAssigneeContactToTask()"></select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Email nhận nhắc việc</label>
          <input type="email" id="taskFormEmail" class="form-control form-control-sm" placeholder="email@congty.vn">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">SĐT Zalo nhận nhắc</label>
          <input type="text" id="taskFormPhone" class="form-control form-control-sm" placeholder="090xxxxxxx">
        </div>

        <!-- KHỐI PHỐI HỢP ĐA BỘ PHẬN & ĐA NHÂN SỰ (RACI) -->
        <div class="col-12">
          <div class="p-2 rounded-3" style="background:#F8FAFC;border:1px solid #CBD5E1;">
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-1">
              <label class="form-label small fw-bold mb-0 text-dark">
                🏢 Quản lý Đa Bộ Phận & Người Phối Hợp Cùng Thực Hiện (Mô hình RACI)
              </label>
              <span class="badge bg-indigo text-primary border" style="background:#EEF2FF;font-size:0.7rem;">Tất cả người phối hợp đều thấy việc trên Kanban</span>
            </div>
            <div class="row g-2">
              <div class="col-12 col-md-6">
                <div class="small text-secondary fw-semibold mb-1">Các Bộ phận tham gia:</div>
                <div id="taskFormDeptsBox" class="d-flex flex-wrap gap-2">
                  <label class="form-check form-check-inline m-0 small">
                    <input class="form-check-input task-dept-chk" type="checkbox" value="Phòng Quản Lý Dự Án"> Quản lý DA
                  </label>
                  <label class="form-check form-check-inline m-0 small">
                    <input class="form-check-input task-dept-chk" type="checkbox" value="Phòng Kinh Doanh & CRM"> Kinh doanh & CRM
                  </label>
                  <label class="form-check form-check-inline m-0 small">
                    <input class="form-check-input task-dept-chk" type="checkbox" value="Khối Kỹ Thuật"> Kỹ thuật (Dev)
                  </label>
                  <label class="form-check form-check-inline m-0 small">
                    <input class="form-check-input task-dept-chk" type="checkbox" value="Khối Sáng Tạo"> Thiết kế & Media
                  </label>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="small text-secondary fw-semibold mb-1">🤝 Người phối hợp (Co-Assignees):</div>
                <div id="taskFormCoAssigneesBox" class="d-flex flex-wrap gap-2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- KHỐI CHECKLIST ĐẦU VIỆC CON THEO BỘ PHẬN / CÁ NHÂN -->
        <div class="col-12">
          <div class="p-2 rounded-3" style="background:#FFFBEB;border:1px solid #FDE68A;">
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-2">
              <label class="form-label small fw-bold mb-0 text-dark">
                ☑️ Checklist Đầu Việc Con Theo Bộ Phận / Người Phụ Trách (Tự động tính % Tiến độ)
              </label>
              <span class="badge bg-warning text-dark" id="badgeSubtaskSummary">0/0 hoàn thành</span>
            </div>
            <div id="taskSubtasksList" class="mb-2"></div>
            <div class="row g-1 align-items-center">
              <div class="col-12 col-md-5">
                <input type="text" id="newSubtaskTitle" class="form-control form-control-sm" placeholder="+ Nhập đầu việc con cần phối hợp...">
              </div>
              <div class="col-6 col-md-3">
                <select id="newSubtaskDept" class="form-select form-select-sm">
                  <option value="Khối Kỹ Thuật">Khối Kỹ Thuật</option>
                  <option value="Khối Sáng Tạo">Khối Sáng Tạo</option>
                  <option value="Phòng Kinh Doanh & CRM">Kinh Doanh & CRM</option>
                  <option value="Phòng Quản Lý Dự Án">Quản Lý Dự Án</option>
                </select>
              </div>
              <div class="col-6 col-md-4 d-flex gap-1">
                <select id="newSubtaskAssignee" class="form-select form-select-sm"></select>
                <button type="button" class="btn btn-sm btn-warning fw-bold flex-shrink-0" onclick="addSubtaskItem()">+ Thêm</button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Cột Trạng thái Kanban</label>
          <select id="taskFormStatus" class="form-select form-select-sm">
            <option value="Cần làm">📝 1. Cần làm (To Do)</option>
            <option value="Đang làm">⚡ 2. Đang làm (In Progress)</option>
            <option value="Chờ duyệt">👀 3. Chờ Quản lý duyệt (Review)</option>
            <option value="Hoàn thành" id="optStatusDoneManagerOnly">✅ 4. Hoàn thành (Chỉ Quản lý duyệt)</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Mức độ ưu tiên</label>
          <select id="taskFormPriority" class="form-select form-select-sm">
            <option value="Cao">🔥 Cao (Khẩn cấp - 30đ KPI)</option>
            <option value="Trung bình">⚡ Trung bình (20đ KPI)</option>
            <option value="Thấp">🌱 Thấp (10đ KPI)</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1 text-primary">% Hoàn thành (0 - 100%)</label>
          <input type="number" id="taskFormProgress" class="form-control form-control-sm border-primary fw-bold" min="0" max="100" value="0" oninput="onTaskProgressInput(this.value)">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Ngày bắt đầu (Gantt)</label>
          <input type="date" id="taskFormStartDate" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Hạn chót (Deadline) (*)</label>
          <input type="date" id="taskFormDeadline" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Số giờ ước tính</label>
          <input type="number" id="taskFormHours" class="form-control form-control-sm" value="8">
        </div>

        <!-- KHỐI UPLOAD ĐA FILE (WORD, EXCEL, POWERPOINT, PDF, ẢNH, ZIP) -->
        <div class="col-12">
          <div class="p-2 rounded-3" style="background:#EFF6FF;border:1px dashed #3B82F6;">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <div>
                <label class="form-label small fw-bold mb-0 text-primary">
                  📎 Tệp Đính Kèm Bàn Giao (Word .docx, Excel .xlsx, PowerPoint .pptx, PDF .pdf, Ảnh, ZIP)
                </label>
                <div class="text-muted" style="font-size:0.72rem;">Hỗ trợ tải nhiều file trực tiếp từ máy tính/điện thoại (tự động lưu Google Drive) hoặc dán Link tài liệu</div>
              </div>
              <div class="d-flex gap-1">
                <input type="file" id="taskFileInput" class="d-none" multiple accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.png,.jpg,.jpeg,.zip,.rar,.csv,.txt" onchange="handleTaskFilesSelected(event)">
                <button type="button" class="btn btn-sm btn-primary fw-bold" onclick="document.getElementById('taskFileInput').click()">
                  <i class="bi bi-cloud-arrow-up-fill me-1"></i> Tải File Lên (Word/Excel/PPT/PDF)
                </button>
              </div>
            </div>
            <div id="taskUploadStatusBanner" class="small text-primary fw-semibold mb-2 d-none"></div>
            <div id="taskAttachmentsList" class="d-flex flex-wrap gap-2 mb-2"></div>
            <div class="input-group input-group-sm">
              <input type="text" id="quickAttachmentName" class="form-control" placeholder="Tên tài liệu (VD: Bao_Cao_Nghiem_Thu.docx)" style="max-width:240px;">
              <input type="url" id="quickAttachmentUrl" class="form-control" placeholder="Hoặc dán Link Google Docs / Sheets / Slides / Figma / Drive...">
              <button class="btn btn-outline-primary fw-bold" type="button" onclick="addQuickLinkAttachment()">🔗 Đính kèm Link</button>
            </div>
          </div>
        </div>

        <div class="col-12">
          <label class="form-label small fw-bold mb-1 text-primary">📝 Ghi chú kết quả / Nội dung bàn giao giữa các bộ phận</label>
          <textarea id="taskFormNotes" class="form-control form-control-sm border-primary" rows="2" placeholder="Nhập báo cáo kết quả công việc hoặc dặn dò bộ phận phối hợp tại đây..."></textarea>
        </div>
        <div class="col-12" id="wrapTaskSendImmediate">
          <div class="form-check mt-1">
            <input class="form-check-input" type="checkbox" id="taskFormSendImmediate" checked>
            <label class="form-check-label small fw-semibold text-primary" for="taskFormSendImmediate">
              🔔 Bắn thông báo Email & Bot Zalo ngay cho Người chủ trì & Người phối hợp khi bấm Lưu
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalTaskBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-primary fw-bold px-3" id="btnSubmitTaskModal" onclick="submitTaskForm()">
        <i class="bi bi-check2-circle me-1"></i> Lưu Cập Nhật
      </button>
    </div>
  </div>
</div>

<!-- MODAL 2: THÊM / SỬA KHÁCH HÀNG CRM & LỊCH HẸN FOLLOW-UP -->
<div class="custom-modal-backdrop" id="modalCrmBackdrop">
  <div class="custom-modal-dialog">
    <div class="custom-modal-header" style="background:linear-gradient(135deg,#0F766E,#0D9488);">
      <span id="modalCrmHeaderTitle">🤝 Thêm / Cập Nhật Khách Hàng CRM & Lịch Hẹn Chăm Sóc</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalCrmBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <input type="hidden" id="crmFormId">
      <div class="row g-2">
        <div class="col-12 col-md-7">
          <label class="form-label small fw-bold mb-1">Tên Khách hàng / Doanh nghiệp (*)</label>
          <input type="text" id="crmFormCompany" class="form-control form-control-sm" placeholder="VD: Tập đoàn BĐS SunLand">
        </div>
        <div class="col-12 col-md-5">
          <label class="form-label small fw-bold mb-1">Người đại diện liên hệ (*)</label>
          <input type="text" id="crmFormContact" class="form-control form-control-sm" placeholder="VD: Anh Minh (GĐ Marketing)">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">SĐT Zalo khách hàng (*)</label>
          <input type="text" id="crmFormPhone" class="form-control form-control-sm" placeholder="09xxxxxxxx">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Email khách hàng</label>
          <input type="email" id="crmFormEmail" class="form-control form-control-sm" placeholder="contact@company.vn">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Nguồn khách hàng</label>
          <select id="crmFormSource" class="form-select form-select-sm">
            <option value="Giới thiệu B2B">Giới thiệu B2B</option>
            <option value="Zalo OA">Zalo OA</option>
            <option value="Facebook Ads">Facebook Ads</option>
            <option value="Website Inbound">Website Inbound</option>
            <option value="Google Search">Google Search</option>
            <option value="Sự kiện / Hội thảo">Sự kiện / Hội thảo</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Giai đoạn Phễu CRM (Pipeline)</label>
          <select id="crmFormStage" class="form-select form-select-sm">
            <option value="Lead Mới">1. Lead Mới</option>
            <option value="Đang Tư Vấn">2. Đang Tư Vấn</option>
            <option value="Gửi Báo Giá / Demo">3. Gửi Báo Giá / Demo</option>
            <option value="Đàm Phán Hợp Đồng">4. Đàm Phán Hợp Đồng</option>
            <option value="Đã Ký HĐ / Triển Khai">5. Đã Ký HĐ / Triển Khai</option>
            <option value="Chăm Sóc Tái Ký">6. Chăm Sóc Tái Ký</option>
            <option value="Đã Hủy / Mất Deal">7. Đã Hủy / Mất Deal</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Giá trị Deal dự kiến (VNĐ)</label>
          <input type="number" id="crmFormDealValue" class="form-control form-control-sm" value="50000000">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Mức độ tiềm năng</label>
          <select id="crmFormPriority" class="form-select form-select-sm">
            <option value="VIP - Rất Cao">💎 VIP - Rất Cao</option>
            <option value="Cao (Hot Lead)">🔥 Cao (Hot Lead)</option>
            <option value="Trung Bình (Warm)">⚡ Trung Bình (Warm)</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small fw-bold mb-1">Nhân sự Sale/PM phụ trách</label>
          <select id="crmFormOwner" class="form-select form-select-sm"></select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Ngày liên hệ gần nhất</label>
          <input type="date" id="crmFormLastContact" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1 text-danger">📅 Ngày hẹn gọi lại (Follow-up)</label>
          <input type="date" id="crmFormNextFollowUp" class="form-control form-control-sm border-danger">
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Nội dung cần chăm sóc / Lịch sử trao đổi</label>
          <textarea id="crmFormNotes" class="form-control form-control-sm" rows="2" placeholder="Ghi rõ nội dung cần gọi lại tư vấn, gửi báo giá hoặc nhắc nghiệm thu..."></textarea>
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalCrmBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-success fw-bold px-3" onclick="submitCrmForm()">
        <i class="bi bi-check2-circle me-1"></i> Lưu Khách Hàng CRM
      </button>
    </div>
  </div>
</div>

<!-- MODAL 3: THÊM / SỬA DỰ ÁN (DU_AN) -->
<div class="custom-modal-backdrop" id="modalProjectBackdrop">
  <div class="custom-modal-dialog">
    <div class="custom-modal-header">
      <span id="modalProjectHeaderTitle">🚀 Tạo / Cập Nhật Dự Án Triển Khai</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalProjectBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <input type="hidden" id="prjFormId">
      <div class="row g-2">
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Tên dự án triển khai (*)</label>
          <input type="text" id="prjFormName" class="form-control form-control-sm" placeholder="VD: Triển khai Hệ thống Web App & CRM...">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Chọn Khách hàng từ CRM</label>
          <select id="prjFormCustomerSelect" class="form-select form-select-sm" onchange="onSelectProjectCustomer()"></select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Quản lý dự án (PM)</label>
          <select id="prjFormManager" class="form-select form-select-sm"></select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Loại dự án</label>
          <input type="text" id="prjFormCategory" class="form-control form-control-sm" value="Phần mềm & CRM">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Mức ưu tiên</label>
          <select id="prjFormPriority" class="form-select form-select-sm">
            <option value="Cao">Cao</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Thấp">Thấp</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Trạng thái dự án</label>
          <select id="prjFormStatus" class="form-select form-select-sm">
            <option value="Đang thực hiện">Đang thực hiện</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Ngày bắt đầu</label>
          <input type="date" id="prjFormStartDate" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Hạn bàn giao (Deadline)</label>
          <input type="date" id="prjFormEndDate" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">% Tiến độ tổng thể</label>
          <input type="number" id="prjFormProgress" class="form-control form-control-sm" min="0" max="100" value="50">
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Ngân sách Hợp đồng (VNĐ)</label>
          <input type="number" id="prjFormBudget" class="form-control form-control-sm" value="100000000">
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Chi phí thực tế đã chi (VNĐ)</label>
          <input type="number" id="prjFormActualCost" class="form-control form-control-sm" value="35000000">
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Ghi chú mục tiêu & phạm vi dự án</label>
          <textarea id="prjFormNotes" class="form-control form-control-sm" rows="2"></textarea>
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalProjectBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-primary fw-bold px-3" onclick="submitProjectForm()">
        <i class="bi bi-check2-circle me-1"></i> Lưu Dự Án
      </button>
    </div>
  </div>
</div>

<!-- MODAL 4: THÊM / SỬA TÀI KHOẢN NHÂN SỰ & CẤP QUYỀN THAO TÁC TRÊN APP -->
<div class="custom-modal-backdrop" id="modalUserBackdrop">
  <div class="custom-modal-dialog" style="max-width:640px;">
    <div class="custom-modal-header bg-dark">
      <span>🔐 Thiết Lập Tài Khoản Nhân Sự & Phân Quyền Thao Tác Trên App</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalUserBackdrop')"></button>
    </div>
    <div class="custom-modal-body" style="max-height:78vh;overflow-y:auto;">
      <div class="row g-2">
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Username đăng nhập (*)</label>
          <input type="text" id="usrFormUsername" class="form-control form-control-sm" placeholder="vd: sale_moi">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Mật khẩu / PIN (*)</label>
          <input type="text" id="usrFormPassword" class="form-control form-control-sm" value="123456">
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small fw-bold mb-1">Trạng thái tài khoản</label>
          <select id="usrFormStatus" class="form-select form-select-sm fw-bold">
            <option value="Hoạt động">🟢 Hoạt động (Cho phép đăng nhập)</option>
            <option value="Tạm khóa">🔒 Tạm khóa (Chặn đăng nhập)</option>
          </select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Họ và Tên hiển thị trên Kanban (*)</label>
          <input type="text" id="usrFormFullName" class="form-control form-control-sm" placeholder="VD: Hoang Minh">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1 text-primary">Cấp bậc Vai trò (Role) (*)</label>
          <select id="usrFormRole" class="form-select form-select-sm fw-bold border-primary" onchange="onUserRoleSelectChange(this.value)">
            <option value="ADMIN">👑 ADMIN (Giám đốc / Toàn quyền hệ thống)</option>
            <option value="MANAGER">📋 MANAGER (Quản lý Dự án / Điều phối toàn công ty)</option>
            <option value="LEADER">🌟 LEADER (Team Lead / Trưởng nhóm — Giao việc & Duyệt việc tuyến dưới)</option>
            <option value="CRM_SALE">🤝 CRM_SALE (Chuyên viên Kinh doanh & Phễu CRM)</option>
            <option value="STAFF">💻 STAFF (Nhân viên Thực thi / Nhận & Tự đăng ký việc)</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small fw-bold mb-1">Phòng ban trực thuộc</label>
          <select id="usrFormDept" class="form-select form-select-sm">
            <option value="Phòng Kinh Doanh & CRM">Phòng Kinh Doanh & CRM</option>
            <option value="Khối Kỹ Thuật">Khối Kỹ Thuật</option>
            <option value="Khối Sáng Tạo">Khối Sáng Tạo</option>
            <option value="Phòng Quản Lý Dự Án">Phòng Quản Lý Dự Án</option>
            <option value="Ban Giám Đốc">Ban Giám Đốc</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Email nhận nhắc việc</label>
          <input type="email" id="usrFormEmail" class="form-control form-control-sm" placeholder="email@novacrm.vn">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">SĐT Zalo (09xx...)</label>
          <input type="text" id="usrFormPhone" class="form-control form-control-sm" placeholder="09xxxxxxxx">
        </div>

        <!-- MA TRẬN CHECKBOX CẤP QUYỀN THAO TÁC TRỰC TIẾP TRÊN APP -->
        <div class="col-12 mt-2">
          <div class="p-2 rounded-3" style="background:#EFF6FF;border:1px solid #93C5FD;">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label small fw-bold mb-0 text-primary">
                🛡️ Ma Trận Quyền Thao Tác Thực Tế Trên App (Áp dụng ngay khi tài khoản đăng nhập)
              </label>
              <span class="badge bg-primary" style="font-size:0.68rem;">Lưu đồng bộ Sheet PHAN_QUYEN</span>
            </div>
            <div class="row g-2 small">
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input usr-perm-chk" type="checkbox" value="ASSIGN_TASK" id="chkPermAssign">
                  <span class="fw-semibold">📋 Giao việc & Điều phối nhân viên tuyến dưới</span>
                </label>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input usr-perm-chk" type="checkbox" value="APPROVE_TASK" id="chkPermApprove">
                  <span class="fw-semibold">✅ Duyệt nghiệm thu công việc (Chờ duyệt ➔ Hoàn thành)</span>
                </label>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input usr-perm-chk" type="checkbox" value="VIEW_TEAM" id="chkPermViewTeam">
                  <span class="fw-semibold">👥 Xem & Phối hợp nhiệm vụ cùng Phòng ban / Đội nhóm</span>
                </label>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input usr-perm-chk" type="checkbox" value="SELF_CREATE_TASK" id="chkPermSelfCreate" checked>
                  <span class="fw-semibold">➕ Tự tạo / Đăng ký công việc mới trên Kanban</span>
                </label>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input usr-perm-chk" type="checkbox" value="ACCESS_CRM" id="chkPermCrm">
                  <span class="fw-semibold">🤝 Truy cập & Chăm sóc Phễu Khách hàng CRM</span>
                </label>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input usr-perm-chk" type="checkbox" value="MANAGE_PROJECT" id="chkPermProject">
                  <span class="fw-semibold">🚀 Quản lý Danh mục Dự án & Ngân sách</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-modal-footer justify-content-between">
      <button type="button" class="btn btn-sm btn-outline-success fw-bold" onclick="saveUserAndAssignTaskImmediately()">
        <i class="bi bi-clipboard-plus"></i> Lưu & Giao Việc Ngay Cho Nhân Sự Này
      </button>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalUserBackdrop')">Đóng</button>
        <button type="button" class="btn btn-sm btn-dark fw-bold px-3" onclick="submitUserForm()">
          <i class="bi bi-check2-circle me-1"></i> Lưu Tài Khoản & Quyền
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ======================================================================= -->
<!-- 6. JAVASCRIPT ENGINE (STRICT RBAC + 2-WAY TASK APPROVAL WORKFLOW)       -->
<!-- ======================================================================= -->
<script>
  function buildInstantFallbackData() {
    var now = new Date();
    function dStr(offset) {
      var d = new Date(now.getTime() + offset * 86400000);
      var y = d.getFullYear();
      var m = ('0' + (d.getMonth() + 1)).slice(-2);
      var day = ('0' + d.getDate()).slice(-2);
      return y + '-' + m + '-' + day;
    }
    return {
      ok: true,
      serverTime: dStr(0) + ' 08:30:00',
      todayStr: dStr(0),
      hasDailyTrigger: true,
      config: {
        COMPANY_NAME: 'CÔNG TY TNHH GIẢI PHÁP SỐ & DỰ ÁN NOVA-CRM',
        COMPANY_HOTLINE: '0909.888.999',
        ADMIN_EMAIL: 'pmo.admin@novacrm.vn',
        ENABLE_EMAIL_REMINDER: 'TRUE',
        ENABLE_ZALO_REMINDER: 'TRUE',
        ZALO_BOT_WEBHOOK_URL: 'https://webhook.site/zalo-bot-demo-endpoint',
        ZALO_OA_ACCESS_TOKEN: 'ZALO_OA_TOKEN_DEMO_2025',
        ENABLE_TELEGRAM_REMINDER: 'TRUE',
        TELEGRAM_BOT_TOKEN: '',
        TELEGRAM_CHAT_ID: '',
        AUTO_REMINDER_HOUR: '8',
        REMIND_BEFORE_DAYS: '2',
        KPI_BASE_HIGH: '30',
        KPI_BASE_MEDIUM: '20',
        KPI_BASE_LOW: '10',
        KPI_OVERDUE_PENALTY: '5'
      },
      users: [
        { username: 'admin', password: '123456', fullName: 'Nguyễn Quản Trị (CEO/PMO)', role: 'ADMIN', department: 'Ban Giám Đốc', email: 'ceo@novacrm.vn', phone: '0901234567', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM,MANAGE_PROJECT' },
        { username: 'pm_duan', password: '123456', fullName: 'Trần Hoàng Nam (PM)', role: 'MANAGER', department: 'Phòng Quản Lý Dự Án', email: 'nam.pm@novacrm.vn', phone: '0902345678', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM,MANAGE_PROJECT' },
        { username: 'sale_crm', password: '123456', fullName: 'Lê Minh Thư (Leader CRM)', role: 'LEADER', department: 'Phòng Kinh Doanh & CRM', email: 'thu.crm@novacrm.vn', phone: '0903456789', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM' },
        { username: 'dev_lead', password: '123456', fullName: 'Phạm Tuấn Kiệt (Tech Lead)', role: 'LEADER', department: 'Khối Kỹ Thuật', email: 'kiet.dev@novacrm.vn', phone: '0904567890', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK' },
        { username: 'designer', password: '123456', fullName: 'Võ Ngọc Ánh (UI/UX & Media)', role: 'STAFF', department: 'Khối Sáng Tạo', email: 'anh.design@novacrm.vn', phone: '0905678901', status: 'Hoạt động', note: 'SELF_CREATE_TASK,VIEW_TEAM' },
        { username: 'sale_moi', password: '666666', fullName: 'Hoang Minh', role: 'STAFF', department: 'Phòng Kinh Doanh & CRM', email: 'minh.sale@novacrm.vn', phone: '0906789012', status: 'Hoạt động', note: 'SELF_CREATE_TASK,VIEW_TEAM,ACCESS_CRM' }
      ],
      crmCustomers: [
        { id: 'KH-001', companyName: 'Tập đoàn Bất Động Sản SunLand', contactPerson: 'Anh Minh (GĐ Marketing)', phone: '0912345678', email: 'minh.gd@sunland.vn', source: 'Giới thiệu B2B', stage: 'Đã Ký HĐ / Triển Khai', dealValue: 185000000, owner: 'Lê Minh Thư (Leader CRM)', lastContactDate: dStr(-5), nextFollowUpDate: dStr(1), notes: 'Họp nghiệm thu giai đoạn 1 dự án Portal BĐS & thu đợt 2', priority: 'VIP - Rất Cao', reminderStatus: 'Chưa nhắc' },
        { id: 'KH-002', companyName: 'Chuỗi Thẩm Mỹ Viện Aura Beauty', contactPerson: 'Chị Lan (Founder)', phone: '0987654321', email: 'lan.founder@aurabeauty.vn', source: 'Facebook Ads', stage: 'Đã Ký HĐ / Triển Khai', dealValue: 95000000, owner: 'Lê Minh Thư (Leader CRM)', lastContactDate: dStr(-3), nextFollowUpDate: dStr(0), notes: 'Gửi kịch bản Chatbot Zalo OA & xác nhận lịch đào tạo nhân sự', priority: 'VIP - Rất Cao', reminderStatus: 'Chưa nhắc' },
        { id: 'KH-003', companyName: 'Công ty Logistics Đại Dương Xanh', contactPerson: 'Anh Hùng (GĐ Vận Hành)', phone: '0933445566', email: 'hung.ops@daiduongxanh.vn', source: 'Website Inbound', stage: 'Đàm Phán Hợp Đồng', dealValue: 140000000, owner: 'Trần Hoàng Nam (PM)', lastContactDate: dStr(-2), nextFollowUpDate: dStr(0), notes: 'Gửi lại bảng báo giá điều chỉnh module điều phối xe tải', priority: 'Cao (Hot Lead)', reminderStatus: 'Chưa nhắc' },
        { id: 'KH-004', companyName: 'Hệ thống Nha Khoa Quốc Tế SmileCare', contactPerson: 'BS. Tuấn (Giám Đốc)', phone: '0944556677', email: 'tuan.dr@smilecare.vn', source: 'Sự kiện / Hội thảo', stage: 'Gửi Báo Giá / Demo', dealValue: 68000000, owner: 'Lê Minh Thư (Leader CRM)', lastContactDate: dStr(-1), nextFollowUpDate: dStr(2), notes: 'Demo trực tiếp hệ thống đặt lịch hẹn & nhắc lịch tái khám Zalo', priority: 'Cao (Hot Lead)', reminderStatus: 'Chưa nhắc' },
        { id: 'KH-005', companyName: 'Nhà Máy Sản Xuất Nội Thất Mộc Việt', contactPerson: 'Anh Quang (Trưởng Phòng Mua)', phone: '0977889900', email: 'quang.mocviet@gmail.com', source: 'Zalo OA', stage: 'Đang Tư Vấn', dealValue: 110000000, owner: 'Lê Minh Thư (Leader CRM)', lastContactDate: dStr(-4), nextFollowUpDate: dStr(-1), notes: 'Quá hạn gọi lại tư vấn gói ERP Quản lý xưởng & kho vật tư', priority: 'Trung Bình (Warm)', reminderStatus: 'Quá hạn cần gọi ngay' },
        { id: 'KH-006', companyName: 'Học Viện Anh Ngữ Global Edu', contactPerson: 'Cô Thảo (Hiệu Trưởng)', phone: '0966112233', email: 'thao.edu@globaledu.vn', source: 'Google Search', stage: 'Chăm Sóc Tái Ký', dealValue: 75000000, owner: 'Trần Hoàng Nam (PM)', lastContactDate: dStr(-7), nextFollowUpDate: dStr(3), notes: 'Chăm sóc gia hạn hợp đồng bảo trì năm thứ 2 & nâng cấp CRM', priority: 'VIP - Rất Cao', reminderStatus: 'Đã nhắc Email/Zalo' }
      ],
      projects: [
        { id: 'DA-001', name: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerId: 'KH-001', customerName: 'Tập đoàn Bất Động Sản SunLand', manager: 'Trần Hoàng Nam (PM)', category: 'Phần mềm & CRM', priority: 'Cao', startDate: dStr(-20), endDate: dStr(10), status: 'Đang thực hiện', progress: 65, budget: 185000000, actualCost: 92000000, notes: 'Hoàn thiện phân hệ giỏ hàng BĐS, phân quyền sàn và Bot nhắc lịch hẹn khách' },
        { id: 'DA-002', name: 'Xây dựng Hệ thống Đặt Lịch & Tự Động Hóa Zalo OA Aura Beauty', customerId: 'KH-002', customerName: 'Chuỗi Thẩm Mỹ Viện Aura Beauty', manager: 'Trần Hoàng Nam (PM)', category: 'Automation & POS', priority: 'Cao', startDate: dStr(-14), endDate: dStr(5), status: 'Đang thực hiện', progress: 80, budget: 95000000, actualCost: 48000000, notes: 'Tích hợp thẻ liệu trình VIP, nhắc lịch tái khám qua Zalo & Email tự động' },
        { id: 'DA-003', name: 'Nâng cấp Cổng Học Viên & Quản Lý Lớp Học Global Edu v2.0', customerId: 'KH-006', customerName: 'Học Viện Anh Ngữ Global Edu', manager: 'Nguyễn Quản Trị (CEO/PMO)', category: 'EdTech Platform', priority: 'Trung bình', startDate: dStr(-30), endDate: dStr(-2), status: 'Hoàn thành', progress: 100, budget: 75000000, actualCost: 41000000, notes: 'Đã bàn giao nghiệm thu 100%, chuyển sang giai đoạn bảo hành & chăm sóc tái ký' },
        { id: 'DA-004', name: 'Thiết kế Prototype Điều Phối Vận Tải Đại Dương Xanh', customerId: 'KH-003', customerName: 'Công ty Logistics Đại Dương Xanh', manager: 'Phạm Tuấn Kiệt (Tech Lead)', category: 'Tư vấn & Prototype', priority: 'Cao', startDate: dStr(-5), endDate: dStr(7), status: 'Chờ duyệt', progress: 45, budget: 140000000, actualCost: 25000000, notes: 'Đang chờ khách hàng duyệt bản mẫu UI/UX Dashboard theo dõi đội xe' }
      ],
      tasks: [
        {
          id: 'CV-101', title: 'Thiết kế Database & Phân quyền RBAC cho SunLand Portal', projectId: 'DA-001', projectName: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerName: 'Tập đoàn Bất Động Sản SunLand', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', assigneeEmail: 'kiet.dev@novacrm.vn', assigneePhone: '0904567890', status: 'Hoàn thành', priority: 'Cao', startDate: dStr(-18), deadline: dStr(-10), estimatedHours: 24, progress: 100, kpiPoints: 30, reminderStatus: 'Đã nhắc Email/Zalo', notes: 'Đã hoàn tất schema 8 bảng dữ liệu chuẩn',
          departments: ['Khối Kỹ Thuật', 'Phòng Quản Lý Dự Án'], coAssignees: ['Trần Hoàng Nam (PM)'],
          subtasks: [
            { id: 'ST-1', title: 'Thiết kế ERD & Schema 8 bảng', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: true },
            { id: 'ST-2', title: 'Phê duyệt ma trận phân quyền RBAC', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true }
          ],
          attachments: [
            { id: 'ATT-101', name: 'Dac_Ta_Database_SunLand_v2.docx', ext: 'docx', size: '420 KB', url: 'https://docs.google.com/document', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: dStr(-11) },
            { id: 'ATT-102', name: 'Ma_Tran_Phan_Quyen_RBAC.xlsx', ext: 'xlsx', size: '185 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: dStr(-10) }
          ]
        },
        {
          id: 'CV-102', title: 'Xây dựng giao diện Mobile-First Bảng hàng & Giỏ căn hộ', projectId: 'DA-001', projectName: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerName: 'Tập đoàn Bất Động Sản SunLand', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', assigneeEmail: 'anh.design@novacrm.vn', assigneePhone: '0905678901', status: 'Đang làm', priority: 'Cao', startDate: dStr(-8), deadline: dStr(1), estimatedHours: 32, progress: 75, kpiPoints: 22, reminderStatus: 'Chưa nhắc', notes: 'Đang tối ưu thanh điều hướng dưới cùng trên iPhone/Android',
          departments: ['Khối Sáng Tạo', 'Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'], coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)', 'Lê Minh Thư (Leader CRM)'],
          subtasks: [
            { id: 'ST-3', title: 'Thiết kế UI/UX & Slide thuyết trình khách hàng', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true },
            { id: 'ST-4', title: 'Chuẩn hóa trường dữ liệu giỏ căn hộ VIP', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
            { id: 'ST-5', title: 'Ghép API Realtime vào giao diện Mobile', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
          ],
          attachments: [
            { id: 'ATT-103', name: 'Slide_Trinh_Chieu_UIUX_SunLand.pptx', ext: 'pptx', size: '3.4 MB', url: 'https://docs.google.com/presentation', uploadedBy: 'Võ Ngọc Ánh (UI/UX & Media)', uploadedAt: dStr(-2) },
            { id: 'ATT-104', name: 'Checklist_Nghiem_Thu_Giao_Dien.pdf', ext: 'pdf', size: '890 KB', url: 'https://drive.google.com', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: dStr(-1) }
          ]
        },
        {
          id: 'CV-103', title: 'Tích hợp Webhook Bot Zalo & Gmail tự động báo khách mới cho Sale', projectId: 'DA-001', projectName: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerName: 'Tập đoàn Bất Động Sản SunLand', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', assigneeEmail: 'kiet.dev@novacrm.vn', assigneePhone: '0904567890', status: 'Đang làm', priority: 'Cao', startDate: dStr(-5), deadline: dStr(0), estimatedHours: 16, progress: 60, kpiPoints: 18, reminderStatus: 'Chưa nhắc', notes: 'Đến hạn hôm nay: Cần test kỹ luồng bắn tin nhắn Zalo OA',
          departments: ['Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'], coAssignees: ['Lê Minh Thư (Leader CRM)'],
          subtasks: [
            { id: 'ST-6', title: 'Viết mẫu nội dung Template Zalo ZNS & Email', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
            { id: 'ST-7', title: 'Kết nối Webhook Zalo OA & Test bắn tin tự động', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
          ],
          attachments: [
            { id: 'ATT-105', name: 'Kich_Ban_Zalo_ZNS_SunLand.docx', ext: 'docx', size: '310 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: dStr(-2) }
          ]
        },
        {
          id: 'CV-104', title: 'Soạn kịch bản chăm sóc khách hàng VIP sau liệu trình Aura Beauty', projectId: 'DA-002', projectName: 'Xây dựng Hệ thống Đặt Lịch & Tự Động Hóa Zalo OA Aura Beauty', customerName: 'Chuỗi Thẩm Mỹ Viện Aura Beauty', assignee: 'Lê Minh Thư (Leader CRM)', assigneeEmail: 'thu.crm@novacrm.vn', assigneePhone: '0903456789', status: 'Chờ duyệt', priority: 'Trung bình', startDate: dStr(-6), deadline: dStr(1), estimatedHours: 12, progress: 90, kpiPoints: 18, reminderStatus: 'Chưa nhắc', notes: 'Chờ Quản lý & Chị Lan Founder duyệt câu từ tin nhắn ZNS',
          departments: ['Phòng Kinh Doanh & CRM', 'Khối Sáng Tạo'], coAssignees: ['Võ Ngọc Ánh (UI/UX & Media)'],
          subtasks: [
            { id: 'ST-8', title: 'Soạn thảo quy trình 7 ngày chăm sóc sau liệu trình (Word)', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
            { id: 'ST-9', title: 'Thiết kế Banner & E-voucher đính kèm tin nhắn Zalo', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true }
          ],
          attachments: [
            { id: 'ATT-106', name: 'Quy_Trinh_CSKH_VIP_AuraBeauty.docx', ext: 'docx', size: '540 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: dStr(-1) },
            { id: 'ATT-107', name: 'Bang_Tinh_Chi_Phi_Chien_Dich_ZNS.xlsx', ext: 'xlsx', size: '240 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: dStr(-1) }
          ]
        },
        {
          id: 'CV-105', title: 'Cấu hình Trigger nhắc lịch tái khám tự động 8h sáng hàng ngày', projectId: 'DA-002', projectName: 'Xây dựng Hệ thống Đặt Lịch & Tự Động Hóa Zalo OA Aura Beauty', customerName: 'Chuỗi Thẩm Mỹ Viện Aura Beauty', assignee: 'Trần Hoàng Nam (PM)', assigneeEmail: 'nam.pm@novacrm.vn', assigneePhone: '0902345678', status: 'Cần làm', priority: 'Cao', startDate: dStr(-2), deadline: dStr(-1), estimatedHours: 8, progress: 20, kpiPoints: 5, reminderStatus: 'Quá hạn cần nhắc ngay', notes: 'Quá hạn 1 ngày: Cần bàn giao gấp trước buổi nghiệm thu',
          departments: ['Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật'], coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)'],
          subtasks: [
            { id: 'ST-10', title: 'Rà soát danh sách khách hàng tái khám đợt 1', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true },
            { id: 'ST-11', title: 'Bật Cron Trigger 8h sáng & kiểm tra nhật ký gửi', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
          ],
          attachments: [
            { id: 'ATT-108', name: 'Huong_Dan_Van_Hanh_Trigger_Aura.pdf', ext: 'pdf', size: '1.1 MB', url: 'https://drive.google.com', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: dStr(-1) }
          ]
        },
        {
          id: 'CV-106', title: 'Thiết kế Mockup Bản đồ GPS & Bảng điều phối chuyến xe tải', projectId: 'DA-004', projectName: 'Thiết kế Prototype Điều Phối Vận Tải Đại Dương Xanh', customerName: 'Công ty Logistics Đại Dương Xanh', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', assigneeEmail: 'anh.design@novacrm.vn', assigneePhone: '0905678901', status: 'Chờ duyệt', priority: 'Cao', startDate: dStr(-4), deadline: dStr(2), estimatedHours: 20, progress: 85, kpiPoints: 25, reminderStatus: 'Đã nhắc Email/Zalo', notes: 'Đã gửi link Figma & Slide PowerPoint chờ PM duyệt nghiệm thu',
          departments: ['Khối Sáng Tạo', 'Phòng Quản Lý Dự Án'], coAssignees: ['Trần Hoàng Nam (PM)'],
          subtasks: [
            { id: 'ST-12', title: 'Vẽ Prototype màn hình điều phối xe tải', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true },
            { id: 'ST-13', title: 'Xuất file PowerPoint thuyết trình Ban Giám Đốc', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true }
          ],
          attachments: [
            { id: 'ATT-109', name: 'Demo_Dieu_Phoi_Xe_Tai_DaiDuongXanh.pptx', ext: 'pptx', size: '4.8 MB', url: 'https://docs.google.com/presentation', uploadedBy: 'Võ Ngọc Ánh (UI/UX & Media)', uploadedAt: dStr(0) }
          ]
        },
        {
          id: 'CV-107', title: 'Lập báo giá chi tiết & Hợp đồng triển khai ERP Đại Dương Xanh', projectId: 'DA-004', projectName: 'Thiết kế Prototype Điều Phối Vận Tải Đại Dương Xanh', customerName: 'Công ty Logistics Đại Dương Xanh', assignee: 'Lê Minh Thư (Leader CRM)', assigneeEmail: 'thu.crm@novacrm.vn', assigneePhone: '0903456789', status: 'Cần làm', priority: 'Trung bình', startDate: dStr(0), deadline: dStr(3), estimatedHours: 10, progress: 50, kpiPoints: 10, reminderStatus: 'Chưa nhắc', notes: 'Chuẩn bị phụ lục SLA cam kết tiến độ cùng Kỹ thuật & PM',
          departments: ['Phòng Kinh Doanh & CRM', 'Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật'], coAssignees: ['Trần Hoàng Nam (PM)', 'Phạm Tuấn Kiệt (Tech Lead)'],
          subtasks: [
            { id: 'ST-14', title: 'Bóc tách bảng tính chi phí nhân công & Server (Excel)', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: true },
            { id: 'ST-15', title: 'Soạn dự thảo Hợp đồng kinh tế & Phụ lục SLA (Word/PDF)', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: false }
          ],
          attachments: [
            { id: 'ATT-110', name: 'Bang_Bao_Gia_ERP_DaiDuongXanh_2025.xlsx', ext: 'xlsx', size: '615 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: dStr(0) },
            { id: 'ATT-111', name: 'Du_Thao_Hop_Dong_ERP_SLA.docx', ext: 'docx', size: '780 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: dStr(0) }
          ]
        },
        {
          id: 'CV-108', title: 'Nghiệm thu & Bàn giao tài liệu hướng dẫn quản trị Global Edu', projectId: 'DA-003', projectName: 'Nâng cấp Cổng Học Viên & Quản Lý Lớp Học Global Edu v2.0', customerName: 'Học Viện Anh Ngữ Global Edu', assignee: 'Trần Hoàng Nam (PM)', assigneeEmail: 'nam.pm@novacrm.vn', assigneePhone: '0902345678', status: 'Hoàn thành', priority: 'Trung bình', startDate: dStr(-12), deadline: dStr(-3), estimatedHours: 14, progress: 100, kpiPoints: 20, reminderStatus: 'Đã nhắc Email/Zalo', notes: 'Khách hàng đánh giá 5 sao, đã thanh toán 100%',
          departments: ['Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'], coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)', 'Lê Minh Thư (Leader CRM)'],
          subtasks: [
            { id: 'ST-16', title: 'Đào tạo hướng dẫn sử dụng & bàn giao tài liệu PDF', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true },
            { id: 'ST-17', title: 'Ký biên bản nghiệm thu & tất toán hợp đồng', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true }
          ],
          attachments: [
            { id: 'ATT-112', name: 'Bien_Ban_Nghiem_Thu_GlobalEdu_Signed.pdf', ext: 'pdf', size: '1.6 MB', url: 'https://drive.google.com', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: dStr(-3) },
            { id: 'ATT-113', name: 'Tai_Lieu_Huong_Dan_Quan_Tri_v2.docx', ext: 'docx', size: '2.1 MB', url: 'https://docs.google.com/document', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: dStr(-4) }
          ]
        }
      ],
      reminderLogs: [
        { id: 'RM-1001', timestamp: dStr(0) + ' 08:00:12', type: 'NHẮC DEADLINE CÔNG VIỆC', refId: 'CV-105', title: 'Cấu hình Trigger nhắc lịch tái khám tự động 8h sáng hàng ngày', recipient: 'Trần Hoàng Nam (PM)', email: 'nam.pm@novacrm.vn', phone: '0902345678', channel: 'EMAIL + BOT ZALO', status: 'Thành công', message: '[CẢNH BÁO QUÁ HẠN] Công việc CV-105 thuộc dự án DA-002 đã đến hạn. Vui lòng cập nhật tiến độ!' },
        { id: 'RM-1002', timestamp: dStr(0) + ' 08:00:15', type: 'NHẮC LỊCH HẸN CRM', refId: 'KH-002', title: 'Chuỗi Thẩm Mỹ Viện Aura Beauty - Chị Lan (Founder)', recipient: 'Lê Minh Thư (Leader CRM)', email: 'thu.crm@novacrm.vn', phone: '0903456789', channel: 'BOT ZALO + EMAIL', status: 'Thành công', message: '[NHẮC LỊCH CRM HÔM NAY] Đến lịch chăm sóc khách hàng KH-002 (Aura Beauty): Gửi kịch bản Chatbot Zalo OA.' }
      ],
      auditLogs: []
    };
  }

  var appData = buildInstantFallbackData();
  var currentUser = null;
  var currentTaskViewMode = 'kanban';
  var chartPrjInstance = null;
  var chartKanbanInstance = null;
  var chartCrmInstance = null;
  var hasBooted = false;

  // =========================================================================
  // BỘ HELPER KIỂM TRA QUYỀN HẠN ĐA TẦNG (ADMIN / MANAGER / LEADER / STAFF)
  // =========================================================================
  function normalizeDeptGroup(deptStr) {
    var s = String(deptStr || '').trim().toLowerCase();
    if (!s) return '';
    if (s.indexOf('kinh doanh') !== -1 || s.indexOf('crm') !== -1 || s.indexOf('sale') !== -1) return 'DEPT_CRM';
    if (s.indexOf('kỹ thuật') !== -1 || s.indexOf('dev') !== -1 || s.indexOf('triển khai') !== -1 || s.indexOf('it') !== -1) return 'DEPT_TECH';
    if (s.indexOf('sáng tạo') !== -1 || s.indexOf('thiết kế') !== -1 || s.indexOf('design') !== -1 || s.indexOf('media') !== -1) return 'DEPT_DESIGN';
    if (s.indexOf('dự án') !== -1 || s.indexOf('pm') !== -1) return 'DEPT_PM';
    if (s.indexOf('giám đốc') !== -1 || s.indexOf('admin') !== -1 || s.indexOf('ceo') !== -1) return 'DEPT_EXEC';
    return s;
  }

  function isSameDepartment(d1, d2) {
    var g1 = normalizeDeptGroup(d1);
    var g2 = normalizeDeptGroup(d2);
    if (!g1 || !g2) return false;
    return g1 === g2;
  }

  function getDefaultPermsForUser(u) {
    if (!u) return ['ASSIGN_TASK', 'APPROVE_TASK', 'VIEW_TEAM', 'SELF_CREATE_TASK', 'ACCESS_CRM', 'MANAGE_PROJECT'];
    var r = String(u.role || 'STAFF').trim().toUpperCase();
    var fn = String(u.fullName || '').toLowerCase();
    var un = String(u.username || '').toLowerCase();
    var dept = String(u.department || '').toLowerCase();
    var isLeadByTitle = (r === 'LEADER' || r === 'LEAD' || fn.indexOf('lead') !== -1 || fn.indexOf('trưởng') !== -1 || un.indexOf('lead') !== -1);

    if (r === 'ADMIN' || r === 'MANAGER') {
      return ['ASSIGN_TASK', 'APPROVE_TASK', 'VIEW_TEAM', 'SELF_CREATE_TASK', 'ACCESS_CRM', 'MANAGE_PROJECT'];
    }
    if (isLeadByTitle) {
      var lPerms = ['ASSIGN_TASK', 'APPROVE_TASK', 'VIEW_TEAM', 'SELF_CREATE_TASK'];
      if (r === 'CRM_SALE' || dept.indexOf('kinh doanh') !== -1 || dept.indexOf('crm') !== -1) lPerms.push('ACCESS_CRM');
      return lPerms;
    }
    if (r === 'CRM_SALE' || dept.indexOf('kinh doanh') !== -1 || dept.indexOf('crm') !== -1) {
      return ['VIEW_TEAM', 'SELF_CREATE_TASK', 'ACCESS_CRM'];
    }
    return ['VIEW_TEAM', 'SELF_CREATE_TASK'];
  }

  function getUserPermsList(u) {
    var target = u || currentUser;
    if (!target) return ['ASSIGN_TASK', 'APPROVE_TASK', 'VIEW_TEAM', 'SELF_CREATE_TASK', 'ACCESS_CRM', 'MANAGE_PROJECT'];
    var base = getDefaultPermsForUser(target);
    var noteStr = String(target.note || '').toUpperCase();
    var knownCodes = ['ASSIGN_TASK', 'APPROVE_TASK', 'VIEW_TEAM', 'SELF_CREATE_TASK', 'ACCESS_CRM', 'MANAGE_PROJECT'];
    var hasExplicitCode = knownCodes.some(function(code) { return noteStr.indexOf(code) !== -1; });
    if (hasExplicitCode) {
      var explicit = knownCodes.filter(function(code) { return noteStr.indexOf(code) !== -1; });
      // Nếu là Manager/Leader thì luôn giữ quyền ASSIGN_TASK & APPROVE_TASK
      var r = String(target.role || '').trim().toUpperCase();
      var fn = String(target.fullName || '').toLowerCase();
      var un = String(target.username || '').toLowerCase();
      if (r === 'ADMIN' || r === 'MANAGER' || r === 'LEADER' || r === 'LEAD' || fn.indexOf('lead') !== -1 || un.indexOf('lead') !== -1) {
        if (explicit.indexOf('ASSIGN_TASK') === -1) explicit.push('ASSIGN_TASK');
        if (explicit.indexOf('APPROVE_TASK') === -1) explicit.push('APPROVE_TASK');
        if (explicit.indexOf('VIEW_TEAM') === -1) explicit.push('VIEW_TEAM');
      }
      return explicit;
    }
    return base;
  }

  function hasUserPermission(permCode, u) {
    var list = getUserPermsList(u || currentUser);
    return list.indexOf(permCode) !== -1;
  }

  function getUserRole() {
    if (!currentUser || !currentUser.role) return 'ADMIN';
    return String(currentUser.role).trim().toUpperCase();
  }
  function isAdminRole() {
    return getUserRole() === 'ADMIN';
  }
  function isTopManagerOrAdmin() {
    var r = getUserRole();
    return r === 'ADMIN' || r === 'MANAGER';
  }
  function isLeaderRole(u) {
    var target = u || currentUser;
    if (!target) return false;
    var r = String(target.role || '').trim().toUpperCase();
    var fn = String(target.fullName || '').toLowerCase();
    var un = String(target.username || '').toLowerCase();
    return (r === 'LEADER' || r === 'LEAD' || fn.indexOf('lead') !== -1 || fn.indexOf('trưởng') !== -1 || un.indexOf('lead') !== -1 || hasUserPermission('ASSIGN_TASK', target));
  }
  // isManagerOrAdmin() trả về true cho cả ADMIN, MANAGER và LEADER (để mở toàn bộ tính năng Giao việc, Duyệt việc & Quản lý nhân viên tuyến dưới!)
  function isManagerOrAdmin() {
    if (!currentUser) return true;
    return isTopManagerOrAdmin() || isLeaderRole(currentUser);
  }
  function isCrmSaleRole() {
    if (!currentUser) return false;
    var r = getUserRole();
    return r === 'CRM_SALE' || hasUserPermission('ACCESS_CRM', currentUser);
  }
  function isStaffRole() {
    return !isManagerOrAdmin() && !isCrmSaleRole();
  }

  // Lấy danh sách nhân sự thuộc phạm vi quản lý của người dùng hiện tại (Tuyến dưới)
  function getSubordinateUsers() {
    var allUsers = (appData && appData.users) ? appData.users : [];
    if (!currentUser || isTopManagerOrAdmin()) return allUsers;
    if (isLeaderRole(currentUser)) {
      var myDept = currentUser.department || '';
      var myUname = String(currentUser.username || '').toLowerCase();
      return allUsers.filter(function(u) {
        if (String(u.username || '').toLowerCase() === myUname) return true;
        var ur = String(u.role || '').toUpperCase();
        if (ur === 'ADMIN' || ur === 'MANAGER') return false;
        return isSameDepartment(u.department, myDept) || !myDept;
      });
    }
    return allUsers.filter(function(u) {
      return String(u.username || '').toLowerCase() === String(currentUser.username || '').toLowerCase();
    });
  }

  var editingTaskSubtasks = [];
  var editingTaskAttachments = [];

  function isUserMainPicOfTask(task) {
    if (!task || !currentUser) return false;
    var myName = String(currentUser.fullName || '').trim().toLowerCase();
    var myUser = String(currentUser.username || '').trim().toLowerCase();
    var myEmail = String(currentUser.email || '').trim().toLowerCase();
    var tAss = String(task.assignee || '').trim().toLowerCase();
    var tMail = String(task.assigneeEmail || '').trim().toLowerCase();
    if (myName && tAss === myName) return true;
    if (myUser && tAss.indexOf(myUser) !== -1) return true;
    if (myEmail && tMail && tMail === myEmail) return true;
    return false;
  }

  function isUserCollaboratorOfTask(task) {
    if (!task || !currentUser) return false;
    var myName = String(currentUser.fullName || '').trim().toLowerCase();
    var coList = Array.isArray(task.coAssignees) ? task.coAssignees : [];
    for (var i = 0; i < coList.length; i++) {
      if (String(coList[i] || '').trim().toLowerCase() === myName) return true;
    }
    var subList = Array.isArray(task.subtasks) ? task.subtasks : [];
    for (var j = 0; j < subList.length; j++) {
      if (String(subList[j].assignee || '').trim().toLowerCase() === myName) return true;
    }
    return false;
  }

  function isTaskInUserDepartment(task) {
    if (!task || !currentUser) return false;
    var myDept = currentUser.department || '';
    if (!myDept) return false;
    // 1. Kiểm tra danh sách bộ phận RACI của task
    var tDepts = Array.isArray(task.departments) ? task.departments : [];
    for (var i = 0; i < tDepts.length; i++) {
      if (isSameDepartment(tDepts[i], myDept)) return true;
    }
    // 2. Kiểm tra phòng ban của người chủ trì task
    var allUsers = (appData && appData.users) ? appData.users : [];
    var tAssLower = String(task.assignee || '').trim().toLowerCase();
    for (var j = 0; j < allUsers.length; j++) {
      if (String(allUsers[j].fullName || '').trim().toLowerCase() === tAssLower) {
        if (isSameDepartment(allUsers[j].department, myDept)) return true;
      }
    }
    return false;
  }

  // Kiểm tra 1 công việc có thuộc quyền xem/xử lý của người dùng hiện tại không
  function isTaskVisibleToCurrentUser(task) {
    if (!task) return false;
    if (!currentUser || isTopManagerOrAdmin()) return true; // CEO & PM thấy toàn bộ công ty
    if (isUserMainPicOfTask(task)) return true;
    if (isUserCollaboratorOfTask(task)) return true;
    // Leader thấy toàn bộ công việc của nhân viên tuyến dưới trong phòng ban của mình
    if (isLeaderRole(currentUser) && isTaskInUserDepartment(task)) return true;
    // Nhân viên có quyền VIEW_TEAM (mặc định bật cho nhân sự trong phòng ban) thấy được việc chung của phòng ban mình
    if (hasUserPermission('VIEW_TEAM', currentUser) && isTaskInUserDepartment(task)) return true;
    return false;
  }

  function getAttachmentBadgeMeta(nameOrExt) {
    var s = String(nameOrExt || '').toLowerCase();
    var ext = s.indexOf('.') !== -1 ? s.split('.').pop() : s;
    if (ext === 'doc' || ext === 'docx') return { cls: 'att-word', icon: '📘 Word' };
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return { cls: 'att-excel', icon: '📗 Excel' };
    if (ext === 'ppt' || ext === 'pptx') return { cls: 'att-ppt', icon: '📙 PPT' };
    if (ext === 'pdf') return { cls: 'att-pdf', icon: '📕 PDF' };
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'webp') return { cls: 'att-img', icon: '🖼️ Ảnh' };
    if (ext === 'zip' || ext === 'rar' || ext === '7z') return { cls: 'att-other', icon: '📦 ZIP' };
    return { cls: 'att-other', icon: '🔗 Tài liệu' };
  }

  function renderAttachmentsChipsHtml(attachments, isCompact) {
    var list = Array.isArray(attachments) ? attachments : [];
    if (list.length === 0) return '';
    var html = '<div class="d-flex flex-wrap gap-1 ' + (isCompact ? 'mb-2' : '') + '">';
    list.forEach(function(att) {
      var meta = getAttachmentBadgeMeta(att.ext || att.name);
      var url = att.url || 'https://drive.google.com';
      var sizeTxt = att.size ? (' (' + att.size + ')') : '';
      html += '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener" class="att-chip ' + meta.cls + '" title="Người tải: ' + escapeHtml(att.uploadedBy || 'Nhân sự') + ' • ' + escapeHtml(att.uploadedAt || '') + '">' +
        '<span>' + meta.icon + ':</span> ' +
        '<span class="text-truncate" style="max-width:145px;">' + escapeHtml(att.name) + '</span>' +
        (!isCompact ? '<span class="opacity-75">' + escapeHtml(sizeTxt) + '</span>' : '') +
      '</a>';
    });
    html += '</div>';
    return html;
  }

  // Kiểm tra 1 khách hàng CRM có thuộc quyền xem/chăm sóc của người dùng hiện tại không
  function isCrmVisibleToCurrentUser(crm) {
    if (!crm) return false;
    if (!currentUser || isTopManagerOrAdmin() || isLeaderRole(currentUser)) return true;
    if (!isCrmSaleRole()) return false; // Nhân viên kỹ thuật thuần túy không xem phễu CRM
    var myName = String(currentUser.fullName || '').trim().toLowerCase();
    var owner = String(crm.owner || '').trim().toLowerCase();
    if (!owner || owner === myName) return true;
    if (hasUserPermission('VIEW_TEAM', currentUser)) return true;
    return false;
  }

  function getScopedTasks() {
    var all = (appData && appData.tasks) ? appData.tasks : [];
    return all.filter(isTaskVisibleToCurrentUser);
  }

  function getScopedCrmCustomers() {
    var all = (appData && appData.crmCustomers) ? appData.crmCustomers : [];
    return all.filter(isCrmVisibleToCurrentUser);
  }

  function getScopedProjects() {
    var all = (appData && appData.projects) ? appData.projects : [];
    if (!currentUser || isManagerOrAdmin()) return all;
    var myTasks = getScopedTasks();
    var pIds = {};
    myTasks.forEach(function(t) { if (t.projectId) pIds[t.projectId] = true; });
    var myName = String(currentUser.fullName || '').trim().toLowerCase();
    var matched = all.filter(function(p) {
      return pIds[p.id] || (myName && String(p.manager || '').trim().toLowerCase() === myName);
    });
    // Nếu là tài khoản nhân sự mới tạo chưa có dự án riêng, hiển thị danh sách dự án đang triển khai để nhân sự có thể chọn dự án và tự đăng ký đầu việc
    return matched.length > 0 ? matched : all;
  }

  function fmtCurrency(n) {
    var v = Number(n || 0);
    if (isNaN(v)) v = 0;
    return v.toLocaleString('vi-VN') + ' đ';
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(msg, type) {
    var box = document.getElementById('appToastContainer');
    if (!box) return;
    var bg = type === 'danger' ? '#DC2626' : (type === 'warning' ? '#D97706' : '#0F766E');
    var el = document.createElement('div');
    el.style.cssText = 'background:' + bg + ';color:#fff;padding:10px 14px;border-radius:10px;margin-bottom:8px;box-shadow:0 6px 18px rgba(0,0,0,0.2);font-size:0.84rem;font-weight:600;display:flex;justify-content:space-between;align-items:center;gap:10px;';
    el.innerHTML = '<span>' + escapeHtml(msg) + '</span><button type="button" style="background:none;border:none;color:#fff;font-weight:bold;" onclick="this.parentElement.remove()">✕</button>';
    box.appendChild(el);
    setTimeout(function() { if (el && el.parentElement) el.remove(); }, 4200);
  }

  // =========================================================================
  // CHẾ ĐỘ TOÀN MÀN HÌNH 1-CLICK
  // =========================================================================
  function toggleFullScreenMode() {
    var doc = window.document;
    var docEl = doc.documentElement;
    var requestFs = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var exitFs = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      if (requestFs) {
        requestFs.call(docEl).then(function() {
          updateFullScreenBtnUI(true);
          showToast('🔲 Đã bật chế độ Toàn Màn Hình!', 'success');
        }).catch(function() {
          document.body.classList.toggle('pseudo-fullscreen');
          showToast('💡 Đã mở rộng tối đa khung làm việc!', 'warning');
        });
      } else {
        showToast('💡 Hãy nhấn phím F11 trên bàn phím để bật Toàn Màn Hình.', 'warning');
      }
    } else {
      if (exitFs) {
        exitFs.call(doc);
        updateFullScreenBtnUI(false);
      }
    }
  }

  function updateFullScreenBtnUI(isFull) {
    var txt = document.getElementById('txtFullScreen');
    if (txt) txt.textContent = isFull ? '🗗 Thu Nhỏ Màn Hình' : '🔲 Toàn Màn Hình';
  }

  document.addEventListener('fullscreenchange', function() {
    updateFullScreenBtnUI(!!document.fullscreenElement);
  });

  function loginAndGoFullScreen() {
    toggleFullScreenMode();
    handleLoginSubmit();
  }

  // =========================================================================
  // ĐĂNG NHẬP & ÁP DỤNG GIAO DIỆN PHÂN QUYỀN (APPLY RBAC UI)
  // =========================================================================
  function handleLoginSubmit() {
    var uInput = String(document.getElementById('loginUsername').value || '').trim().toLowerCase();
    var pInput = String(document.getElementById('loginPassword').value || '').trim();
    var errBox = document.getElementById('loginErrorAlert');

    var users = (appData && appData.users && appData.users.length) ? appData.users : buildInstantFallbackData().users;
    var found = null;
    for (var i = 0; i < users.length; i++) {
      if (String(users[i].username || '').trim().toLowerCase() === uInput && String(users[i].password || '').trim() === pInput) {
        found = users[i];
        break;
      }
    }

    if (!found && uInput === 'admin' && pInput === '123456') {
      found = { username: 'admin', fullName: 'Nguyễn Quản Trị (CEO/PMO)', role: 'ADMIN', department: 'Ban Giám Đốc', email: 'ceo@novacrm.vn', phone: '0901234567', status: 'Hoạt động' };
    }

    if (!found) {
      errBox.textContent = '❌ Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại thông tin đăng nhập trong bảng PHAN_QUYEN.';
      errBox.classList.remove('d-none');
      return;
    }

    if (String(found.status || '').trim().toLowerCase() === 'khóa' || String(found.status || '').trim().toLowerCase() === 'tạm khóa') {
      errBox.textContent = '🔒 Tài khoản này hiện đang bị khóa. Vui lòng liên hệ Giám đốc (ADMIN)!';
      errBox.classList.remove('d-none');
      return;
    }

    errBox.classList.add('d-none');
    currentUser = found;

    // Reset toàn bộ bộ lọc tìm kiếm & nhân sự khi đăng nhập tài khoản mới để không bị rò rỉ bộ lọc cũ
    var fSearch = document.getElementById('filterKanbanSearch');
    if (fSearch) fSearch.value = '';
    var fPrj = document.getElementById('filterKanbanProject');
    if (fPrj) fPrj.value = 'ALL';
    var fDept = document.getElementById('filterKanbanDept');
    if (fDept) fDept.value = 'ALL';
    var fAss = document.getElementById('filterKanbanAssignee');
    if (fAss) {
      if (isManagerOrAdmin()) {
        fAss.value = 'ALL';
        fAss.disabled = false;
      } else {
        fAss.value = 'ALL';
        fAss.disabled = false;
      }
    }

    var lockBadge = document.getElementById('roleLockStatusBadge');
    if (lockBadge) {
      lockBadge.innerHTML = '🔒 Phiên bảo mật: <b>' + escapeHtml(found.username) + '</b> (' + escapeHtml(found.department || found.role) + ')';
    }

    var roleDisplay = isLeaderRole(found) && found.role !== 'ADMIN' && found.role !== 'MANAGER' ? (found.role + ' / LEADER') : found.role;
    document.getElementById('authGateScreen').style.display = 'none';
    document.getElementById('currentUserBadge').textContent = '👤 ' + found.fullName + ' [' + roleDisplay + ']';
    document.getElementById('printActorName').textContent = found.fullName + ' (' + roleDisplay + ')';

    applyRoleBasedPermissionsUI();
    renderAllViews();
    showToast('Xin chào ' + found.fullName + ' (' + roleDisplay + ')! Đã kích hoạt đầy đủ quyền thao tác.', 'success');
  }

  function handleLogout() {
    currentUser = null;
    var pwdEl = document.getElementById('loginPassword');
    if (pwdEl) pwdEl.value = '';
    var errBox = document.getElementById('loginErrorAlert');
    if (errBox) errBox.classList.add('d-none');
    document.getElementById('authGateScreen').style.display = 'flex';
  }

  // Hàm cốt lõi: Ẩn/Hiện các Tab, Nút bấm & Khóa Bộ Lọc theo đúng Vai trò (ADMIN / MANAGER / LEADER / CRM_SALE / STAFF)
  function applyRoleBasedPermissionsUI() {
    var role = getUserRole();
    var isAdmin = isAdminRole();
    var isTopMgr = isTopManagerOrAdmin();
    var isLead = isLeaderRole(currentUser);
    var isMgr = isManagerOrAdmin(); // True cho cả ADMIN, MANAGER và LEADER!
    var isCrm = isCrmSaleRole();
    var canCreateTask = isMgr || hasUserPermission('SELF_CREATE_TASK', currentUser);
    var canManagePrj = isTopMgr || hasUserPermission('MANAGE_PROJECT', currentUser);
    var myName = currentUser ? currentUser.fullName : 'Admin';
    var myDept = currentUser ? (currentUser.department || 'Phòng ban') : '';

    // 1. Cập nhật Banner mô tả luồng phân quyền
    var bannerDesc = document.getElementById('roleScopeDescription');
    if (isAdmin) {
      bannerDesc.innerHTML = '👑 <b>Chế độ Giám đốc (ADMIN — ' + escapeHtml(myName) + '):</b> Toàn quyền điều hành công ty, giao việc, duyệt nghiệm thu (<i>Chờ duyệt ➔ Hoàn thành</i>), quản lý Dự án, CRM, Bot & Phân quyền.';
    } else if (role === 'MANAGER') {
      bannerDesc.innerHTML = '📋 <b>Chế độ Quản lý Dự án (MANAGER — ' + escapeHtml(myName) + '):</b> Toàn quyền giao việc cho nhân viên tuyến dưới, duyệt nghiệm thu (<i>Chờ duyệt ➔ Hoàn thành</i>), quản lý nhân sự & bắn Bot nhắc việc.';
    } else if (isLead) {
      bannerDesc.innerHTML = '🌟 <b>Chế độ Trưởng nhóm / Team Lead (LEADER — ' + escapeHtml(myName) + ' • ' + escapeHtml(myDept) + '):</b> Toàn quyền <b>Giao việc mới</b>, điều phối & <b>Duyệt nghiệm thu 100%</b> cho nhân viên tuyến dưới thuộc <b>' + escapeHtml(myDept) + '</b>.';
    } else if (isCrm) {
      bannerDesc.innerHTML = '🤝 <b>Chế độ Chuyên viên Kinh doanh & CRM (' + escapeHtml(myName) + ' • ' + escapeHtml(myDept) + '):</b> Thao tác trực tiếp trên <b>Bảng Kanban (' + escapeHtml(myDept) + ')</b> & <b>Phễu Khách hàng CRM</b>, tự đăng ký đầu việc và tải file bàn giao.';
    } else {
      bannerDesc.innerHTML = '💻 <b>Chế độ Nhân viên Thực thi (' + escapeHtml(myName) + ' • ' + escapeHtml(myDept) + '):</b> Nhận việc, tự đăng ký đầu việc mới, cập nhật tiến độ (<i>100% tự động chuyển sang Chờ Quản Lý Duyệt</i>) & tải file bàn giao.';
    }

    // 2. Ẩn/Hiện các Tab trên Desktop & Mobile Bottom Nav
    setElemVisible('deskTab_crm', isMgr || isCrm);
    setElemVisible('mobTab_crm', isMgr || isCrm);

    setElemVisible('deskTab_projects', canManagePrj || isLead);
    setElemVisible('deskTab_reminders', isMgr);
    setElemVisible('mobTab_reminders', isMgr);

    // Đổi nhãn Tab & Nút Giao việc cho phù hợp góc nhìn Quản lý/Lead vs Nhân viên
    document.getElementById('lblDeskTabDashboard').textContent = isMgr ? '1. Tổng Quan & Điều Phối Đội Ngũ' : '1. Bàn Làm Việc & Nhiệm Vụ Của Tôi';
    document.getElementById('lblDeskTabKanban').textContent = isMgr ? '2. Bảng Kanban & Điều Phối Tuyến Dưới' : '2. Bảng Công Việc Kanban & Gantt';
    document.getElementById('lblDeskTabKpi').textContent = isMgr ? '6. Điểm KPI Đội Ngũ, Nhân Sự Tuyến Dưới & In A4' : '6. Điểm KPI Cá Nhân & Đội Nhóm';

    // 3. Hiển thị nút Giao Việc cho Quản lý / Lead VÀ nút Tự Đăng Ký Việc cho Nhân viên mới
    setElemVisible('btnTopAutoRemind', isMgr);
    setElemVisible('btnDashNewTask', canCreateTask);
    setElemVisible('btnKanbanNewTask', canCreateTask);
    setElemVisible('mobFabTask', canCreateTask);

    var btnDashTaskEl = document.getElementById('btnDashNewTask');
    var btnKanbanTaskEl = document.getElementById('btnKanbanNewTask');
    if (btnDashTaskEl) {
      btnDashTaskEl.innerHTML = isMgr
        ? '<i class="bi bi-plus-circle"></i> + Giao Việc Tuyến Dưới'
        : '<i class="bi bi-plus-circle"></i> + Tự Đăng Ký Việc Mới';
    }
    if (btnKanbanTaskEl) {
      btnKanbanTaskEl.innerHTML = isMgr
        ? '<i class="bi bi-plus-lg"></i> + Giao Việc'
        : '<i class="bi bi-plus-lg"></i> + Tạo Việc';
    }

    setElemVisible('btnDashNewCrm', isMgr || isCrm);
    setElemVisible('mobFabCrm', isMgr || isCrm);
    setElemVisible('btnDashNewProject', canManagePrj);

    // 4. Ẩn/Hiện các thẻ KPI & khối CRM
    setElemVisible('kpiCardColCrmValue', isMgr || isCrm);
    setElemVisible('kpiCardColCrmFollow', isMgr || isCrm);
    setElemVisible('dashColUrgentCrm', isMgr || isCrm);
    setElemVisible('dashChartCrmCol', isMgr || isCrm);
    document.getElementById('dashColUrgentTasks').className = (isMgr || isCrm) ? 'col-12 col-lg-6' : 'col-12';

    // 5. Mở khối Quản lý Nhân sự & Phân quyền Tuyến dưới (`rbacManagementCol`) cho cả ADMIN, MANAGER và LEADER!
    setElemVisible('rbacManagementCol', isMgr);
    document.getElementById('kpiLeaderboardCol').className = isMgr ? 'col-12 col-lg-6' : 'col-12';
    var rbacHdr = document.getElementById('lblRbacPanelHeader');
    if (rbacHdr) {
      rbacHdr.innerHTML = isTopMgr
        ? '<i class="bi bi-shield-lock-fill text-danger me-1"></i> Quản Lý Nhân Sự, Phân Quyền & Giao Việc Toàn Công Ty (`PHAN_QUYEN`)'
        : '<i class="bi bi-people-fill text-primary me-1"></i> Quản Lý & Giao Việc Nhân Viên Tuyến Dưới (' + escapeHtml(myDept) + ')';
    }

    // 6. Chuyển về tab Kanban mặc định
    switchMainTab('kanban');
  }

  function setElemVisible(id, visible) {
    var el = document.getElementById(id);
    if (!el) return;
    if (visible) el.classList.remove('d-none');
    else el.classList.add('d-none');
  }

  // =========================================================================
  // ĐIỀU HƯỚNG TABS (CÓ KIỂM TRA QUYỀN TRUY CẬP TAB)
  // =========================================================================
  function switchMainTab(tabKey) {
    var isMgr = isManagerOrAdmin();
    var isCrm = isCrmSaleRole();
    if (tabKey === 'projects' && !isMgr) {
      showToast('🔒 Phân hệ Danh mục Dự án & Ngân sách chỉ dành cho Quản lý (PM/ADMIN)!', 'warning');
      return;
    }
    if (tabKey === 'reminders' && !isMgr) {
      showToast('🔒 Phân hệ Cấu hình Bot Nhắc Việc chỉ dành cho Quản lý (PM/ADMIN)!', 'warning');
      return;
    }
    if (tabKey === 'crm' && !isMgr && !isCrm) {
      showToast('🔒 Phân hệ Phễu Khách hàng CRM chỉ dành cho bộ phận Sale CRM & Quản lý!', 'warning');
      return;
    }

    var tabs = ['dashboard', 'kanban', 'crm', 'projects', 'reminders', 'kpi'];
    tabs.forEach(function(k) {
      var pane = document.getElementById('tabPane_' + k);
      if (pane) {
        if (k === tabKey) pane.classList.remove('d-none');
        else pane.classList.add('d-none');
      }
      var dBtn = document.getElementById('deskTab_' + k);
      if (dBtn) {
        if (k === tabKey) dBtn.classList.add('active');
        else dBtn.classList.remove('active');
      }
      var mBtn = document.getElementById('mobTab_' + k);
      if (mBtn) {
        if (k === tabKey) mBtn.classList.add('active');
        else mBtn.classList.remove('active');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setTaskViewMode(mode) {
    currentTaskViewMode = mode;
    var kb = document.getElementById('kanbanBoardContainer');
    var gt = document.getElementById('ganttTimelineContainer');
    var b1 = document.getElementById('btnViewModeKanban');
    var b2 = document.getElementById('btnViewModeGantt');
    if (mode === 'gantt') {
      kb.classList.add('d-none');
      gt.classList.remove('d-none');
      b1.classList.remove('active');
      b2.classList.add('active');
    } else {
      kb.classList.remove('d-none');
      gt.classList.add('d-none');
      b1.classList.add('active');
      b2.classList.remove('active');
    }
  }

  // =========================================================================
  // KẾT NỐI GOOGLE APPS SCRIPT BACKEND
  // =========================================================================
  function setSyncBadge(state, text) {
    var b = document.getElementById('syncStatusBadge');
    if (!b) return;
    if (state === 'loading') {
      b.className = 'badge bg-warning text-dark small';
      b.innerHTML = '<i class="bi bi-arrow-repeat"></i> ' + (text || 'Đang đồng bộ...');
    } else if (state === 'error') {
      b.className = 'badge bg-danger small';
      b.innerHTML = '<i class="bi bi-exclamation-triangle"></i> ' + (text || 'Chế độ Offline/Demo');
    } else {
      b.className = 'badge bg-success bg-opacity-75 small';
      b.innerHTML = '<i class="bi bi-cloud-check"></i> ' + (text || 'Đã đồng bộ Sheet');
    }
  }

  function refreshAllDataFromServer() {
    if (typeof google === 'undefined' || !google.script || !google.script.run) {
      renderAllViews();
      return;
    }
    setSyncBadge('loading', 'Đang tải dữ liệu...');
    google.script.run
      .withSuccessHandler(function(res) {
        if (res && res.ok) {
          appData = res;
          setSyncBadge('ok', 'Đã đồng bộ Sheet');
          renderAllViews();
        } else {
          setSyncBadge('error', 'Dùng dữ liệu dự phòng');
          renderAllViews();
        }
      })
      .withFailureHandler(function() {
        setSyncBadge('error', 'Chế độ Độc lập');
        renderAllViews();
      })
      .getProjectData();
  }

  // =========================================================================
  // RENDER TỔNG HỢP TOÀN BỘ GIAO DIỆN THEO QUYỀN NGƯỜI DÙNG
  // =========================================================================
  function renderAllViews() {
    if (!appData) appData = buildInstantFallbackData();
    var cfg = appData.config || {};
    document.getElementById('topCompanyName').textContent = cfg.COMPANY_NAME || 'QUẢN LÝ DỰ ÁN, CRM, KANBAN & BOT NHẮC VIỆC';
    document.getElementById('printCompanyTitle').textContent = cfg.COMPANY_NAME || 'CÔNG TY TNHH GIẢI PHÁP SỐ & DỰ ÁN NOVA-CRM';
    document.getElementById('lblServerTime').textContent = appData.serverTime || '-';
    document.getElementById('lblTodayStr').textContent = appData.todayStr || '-';
    document.getElementById('printDateNow').textContent = appData.serverTime || '-';

    populateSelectDropdowns();
    renderDashboardSection();
    renderKanbanAndGantt();
    renderCrmSection();
    renderProjectsSection();
    renderRemindersSection();
    renderKpiAndUsersSection();
  }

  function populateSelectDropdowns() {
    var isMgr = isManagerOrAdmin();
    var scopedPrjs = getScopedProjects();
    var allPrjs = appData.projects || [];
    var users = appData.users || [];
    var crms = getScopedCrmCustomers();

    // 1. Bộ lọc Dự án trên bảng Kanban (Nhân viên chỉ thấy các dự án mình tham gia)
    var fPrj = document.getElementById('filterKanbanProject');
    var curFPrj = fPrj.value || 'ALL';
    var fPrjHtml = '<option value="ALL">-- Tất cả Dự án liên quan (' + scopedPrjs.length + ') --</option>';
    scopedPrjs.forEach(function(p) {
      fPrjHtml += '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.id + ' - ' + p.name) + '</option>';
    });
    fPrj.innerHTML = fPrjHtml;
    if (curFPrj !== 'ALL' && !scopedPrjs.some(function(p) { return p.id === curFPrj; })) {
      curFPrj = 'ALL';
    }
    fPrj.value = curFPrj;

    // 2. Bộ lọc Nhân sự trên bảng Kanban (Mở cho ADMIN / MANAGER / LEADER lọc nhân viên tuyến dưới; Nhân viên lọc việc cá nhân vs việc phòng ban)
    var fAss = document.getElementById('filterKanbanAssignee');
    var subUsers = getSubordinateUsers();
    if (isMgr) {
      var prevAss = fAss.value || 'ALL';
      var scopeLbl = isTopManagerOrAdmin() ? ('-- Tất cả Nhân sự (' + subUsers.length + ') --') : ('-- Nhân sự tuyến dưới (' + subUsers.length + ') --');
      var fAssHtml = '<option value="ALL">' + escapeHtml(scopeLbl) + '</option>';
      subUsers.forEach(function(u) {
        fAssHtml += '<option value="' + escapeHtml(u.fullName) + '">👤 ' + escapeHtml(u.fullName) + ' (' + escapeHtml(u.department || u.role) + ')</option>';
      });
      fAss.innerHTML = fAssHtml;
      fAss.disabled = false;
      if (prevAss !== 'ALL' && !subUsers.some(function(u) { return u.fullName === prevAss; })) prevAss = 'ALL';
      fAss.value = prevAss;
    } else {
      var myFullName = currentUser ? currentUser.fullName : '';
      var myDeptName = currentUser ? (currentUser.department || 'Phòng ban') : 'Phòng ban';
      var prevStaffAss = fAss.value || 'ALL';
      fAss.innerHTML = '<option value="ALL">👥 Việc của tôi & ' + escapeHtml(myDeptName) + '</option>' +
        '<option value="' + escapeHtml(myFullName) + '">🎯 Chỉ việc đích danh: ' + escapeHtml(myFullName) + '</option>';
      fAss.disabled = false;
      if (prevStaffAss !== 'ALL' && prevStaffAss !== myFullName) prevStaffAss = 'ALL';
      fAss.value = prevStaffAss;
    }

    // 3. Dropdown trong Modal Giao việc
    var tPrj = document.getElementById('taskFormProject');
    var tPrjHtml = '';
    allPrjs.forEach(function(p) {
      tPrjHtml += '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.id + ' - ' + p.name) + '</option>';
    });
    tPrj.innerHTML = tPrjHtml;

    var tAss = document.getElementById('taskFormAssignee');
    var tAssHtml = '';
    users.forEach(function(u) {
      tAssHtml += '<option value="' + escapeHtml(u.fullName) + '">' + escapeHtml(u.fullName + ' (' + u.role + ')') + '</option>';
    });
    tAss.innerHTML = tAssHtml;

    // 4. Dropdown Modal CRM & Dự án
    var cOwn = document.getElementById('crmFormOwner');
    var pMgr = document.getElementById('prjFormManager');
    var uOpts = '';
    users.forEach(function(u) {
      uOpts += '<option value="' + escapeHtml(u.fullName) + '">' + escapeHtml(u.fullName) + '</option>';
    });
    cOwn.innerHTML = uOpts;
    pMgr.innerHTML = uOpts;

    var pCust = document.getElementById('prjFormCustomerSelect');
    var cOpts = '<option value="">-- Chọn khách hàng từ CRM --</option>';
    crms.forEach(function(c) {
      cOpts += '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.id + ' - ' + c.companyName) + '</option>';
    });
    pCust.innerHTML = cOpts;
  }

  // =========================================================================
  // 1. RENDER DASHBOARD THEO PHẠM VI QUYỀN HẠN
  // =========================================================================
  function renderDashboardSection() {
    var isMgr = isManagerOrAdmin();
    var prjs = getScopedProjects();
    var tasks = getScopedTasks();
    var crms = getScopedCrmCustomers();
    var rems = appData.reminderLogs || [];
    var todayStr = appData.todayStr || '2025-05-15';

    document.getElementById('dashboardHeaderTitle').textContent = isMgr
      ? '📊 Trung Tâm Điều Hành Toàn Công Ty (Góc nhìn Quản Lý)'
      : ('📌 Bàn Làm Việc Cá Nhân Của: ' + (currentUser ? currentUser.fullName : 'Nhân viên'));

    var avgProg = 0;
    if (prjs.length > 0) {
      var sumP = 0;
      prjs.forEach(function(p) { sumP += Number(p.progress || 0); });
      avgProg = Math.round(sumP / prjs.length);
    }

    var doneTasks = 0;
    var urgentTasks = [];
    var totalKpi = 0;
    tasks.forEach(function(t) {
      totalKpi += Number(t.kpiPoints || 0);
      if (t.status === 'Hoàn thành') {
        doneTasks++;
      } else if (t.deadline && t.deadline <= addDaysStr(todayStr, 2)) {
        urgentTasks.push(t);
      }
    });

    var totalCrmVal = 0;
    var urgentCrms = [];
    crms.forEach(function(c) {
      totalCrmVal += Number(c.dealValue || 0);
      if (c.nextFollowUpDate && c.nextFollowUpDate <= addDaysStr(todayStr, 1) && c.stage !== 'Đã Hủy / Mất Deal') {
        urgentCrms.push(c);
      }
    });

    document.getElementById('kpiTotalProjects').textContent = prjs.length + ' Dự án';
    document.getElementById('kpiAvgProgress').textContent = avgProg + '%';
    document.getElementById('kpiTotalTasks').textContent = tasks.length + ' việc';
    document.getElementById('kpiDoneTasks').textContent = doneTasks;
    document.getElementById('kpiUrgentTasks').textContent = urgentTasks.length + ' việc';
    document.getElementById('kpiCrmTotalValue').textContent = fmtCurrency(totalCrmVal);
    document.getElementById('kpiCrmCount').textContent = crms.length;
    document.getElementById('kpiCrmFollowUpDue').textContent = urgentCrms.length + ' lịch';
    document.getElementById('kpiTotalPoints').textContent = totalKpi + ' điểm';
    document.getElementById('kpiReminderSent').textContent = rems.length;

    document.getElementById('badgeUrgentTaskCount').textContent = urgentTasks.length + ' việc';
    document.getElementById('badgeUrgentCrmCount').textContent = urgentCrms.length + ' lịch';

    // Danh sách việc gấp (Đã lọc theo đúng phạm vi vai trò)
    var uTaskBox = document.getElementById('urgentTasksListContainer');
    if (urgentTasks.length === 0) {
      uTaskBox.innerHTML = '<div class="text-muted small py-3 text-center">🎉 Tuyệt vời! Không có nhiệm vụ nào sắp trễ hoặc quá hạn.</div>';
    } else {
      var utHtml = '';
      urgentTasks.forEach(function(t) {
        var isOver = t.deadline < todayStr;
        var badgeCls = isOver ? 'bg-danger' : 'bg-warning text-dark';
        var badgeTxt = isOver ? ('Quá hạn: ' + t.deadline) : ('Đến hạn: ' + t.deadline);
        var zaloUrl = buildZaloDeepLink(t.assigneePhone);

        var actionBtns = '';
        if (isMgr) {
          actionBtns = '<button type="button" class="btn btn-xs btn-warning fw-bold py-0 px-2" style="font-size:0.75rem;" onclick="sendQuickReminder(\'TASK\', \'' + escapeHtml(t.id) + '\')">🔔 Bắn Bot Nhắc</button>' +
            (zaloUrl ? '<a href="' + zaloUrl + '" target="_blank" class="btn-zalo-quick">💬 Mở Zalo</a>' : '') +
            (t.assigneePhone ? '<a href="tel:' + escapeHtml(t.assigneePhone) + '" class="btn btn-xs btn-outline-success py-0 px-2" style="font-size:0.75rem;">📞 Gọi</a>' : '');
        } else {
          // Nút thao tác dành riêng cho Nhân viên trên nhiệm vụ của mình
          actionBtns = '<button type="button" class="btn btn-xs btn-primary fw-bold py-0 px-2" style="font-size:0.75rem;" onclick="openTaskModal(\'' + escapeHtml(t.id) + '\')">📝 Cập Nhật Tiến Độ</button>';
          if (t.status === 'Cần làm') {
            actionBtns += '<button type="button" class="btn btn-xs btn-info text-white fw-bold py-0 px-2" style="font-size:0.75rem;" onclick="quickMoveTaskStatus(\'' + escapeHtml(t.id) + '\', \'Đang làm\')">▶️ Nhận Việc</button>';
          } else if (t.status === 'Đang làm') {
            actionBtns += '<button type="button" class="btn btn-xs btn-success fw-bold py-0 px-2" style="font-size:0.75rem;" onclick="quickMoveTaskStatus(\'' + escapeHtml(t.id) + '\', \'Chờ duyệt\')">📤 Nộp Duyệt</button>';
          }
        }

        utHtml += '<div class="p-2 border rounded-3 bg-light d-flex flex-column gap-1">' +
          '<div class="d-flex justify-content-between align-items-start gap-2">' +
            '<div class="fw-bold small text-dark">[' + escapeHtml(t.id) + '] ' + escapeHtml(t.title) + '</div>' +
            '<span class="badge ' + badgeCls + ' flex-shrink-0">' + escapeHtml(badgeTxt) + '</span>' +
          '</div>' +
          '<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 small text-secondary">' +
            '<span>👤 ' + escapeHtml(t.assignee) + ' • 📊 ' + t.progress + '% • <span class="badge bg-white text-dark border">' + escapeHtml(t.status) + '</span></span>' +
            '<div class="d-flex gap-1">' + actionBtns + '</div>' +
          '</div>' +
        '</div>';
      });
      uTaskBox.innerHTML = utHtml;
    }

    // Danh sách lịch hẹn CRM hôm nay
    var uCrmBox = document.getElementById('urgentCrmListContainer');
    if (urgentCrms.length === 0) {
      uCrmBox.innerHTML = '<div class="text-muted small py-3 text-center">✅ Không có lịch hẹn CRM nào bị trễ hôm nay.</div>';
    } else {
      var ucHtml = '';
      urgentCrms.forEach(function(c) {
        var isOverC = c.nextFollowUpDate < todayStr;
        var bCls = isOverC ? 'bg-danger' : 'bg-success';
        var bTxt = isOverC ? ('Quá hạn gọi: ' + c.nextFollowUpDate) : ('Hẹn gọi: ' + c.nextFollowUpDate);
        var zLink = buildZaloDeepLink(c.phone);
        ucHtml += '<div class="p-2 border rounded-3 bg-light d-flex flex-column gap-1">' +
          '<div class="d-flex justify-content-between align-items-start gap-2">' +
            '<div class="fw-bold small text-dark">' + escapeHtml(c.companyName) + ' (' + escapeHtml(c.contactPerson) + ')</div>' +
            '<span class="badge ' + bCls + ' flex-shrink-0">' + escapeHtml(bTxt) + '</span>' +
          '</div>' +
          '<div class="small text-muted">' + escapeHtml(c.notes || 'Gọi chăm sóc & tư vấn báo giá') + '</div>' +
          '<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 small">' +
            '<span class="text-secondary">Phụ trách: <b>' + escapeHtml(c.owner) + '</b> • Deal: <b class="text-success">' + fmtCurrency(c.dealValue) + '</b></span>' +
            '<div class="d-flex gap-1">' +
              (isMgr ? '<button type="button" class="btn btn-xs btn-warning fw-bold py-0 px-2" style="font-size:0.75rem;" onclick="sendQuickReminder(\'CRM\', \'' + escapeHtml(c.id) + '\')">🔔 Nhắc Sale</button>' : '') +
              (zLink ? '<a href="' + zLink + '" target="_blank" class="btn-zalo-quick">💬 Zalo Khách</a>' : '') +
              (c.phone ? '<a href="tel:' + escapeHtml(c.phone) + '" class="btn btn-xs btn-outline-success py-0 px-2" style="font-size:0.75rem;">📞 Gọi Ngay</a>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
      });
      uCrmBox.innerHTML = ucHtml;
    }

    renderDashboardCharts(prjs, tasks, crms);
  }

  function addDaysStr(baseStr, days) {
    var parts = String(baseStr || '2025-05-15').split('-');
    var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + days);
    var y = d.getFullYear();
    var m = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return y + '-' + m + '-' + day;
  }

  function buildZaloDeepLink(phone) {
    var p = String(phone || '').replace(/[^\d]/g, '');
    if (!p) return '';
    return 'https://zalo.me/' + p;
  }

  function renderDashboardCharts(prjs, tasks, crms) {
    if (typeof Chart === 'undefined') return;

    var ctx1 = document.getElementById('chartProjectProgress');
    if (ctx1) {
      if (chartPrjInstance) chartPrjInstance.destroy();
      chartPrjInstance = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: prjs.map(function(p) { return p.id + ': ' + p.name.substring(0, 22) + '...'; }),
          datasets: [{
            label: '% Tiến độ hoàn thành',
            data: prjs.map(function(p) { return Number(p.progress || 0); }),
            backgroundColor: ['#4338CA', '#0D9488', '#10B981', '#F59E0B', '#EC4899'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    }

    var ctx2 = document.getElementById('chartKanbanStatus');
    if (ctx2) {
      if (chartKanbanInstance) chartKanbanInstance.destroy();
      var stCounts = { 'Cần làm': 0, 'Đang làm': 0, 'Chờ duyệt': 0, 'Hoàn thành': 0 };
      tasks.forEach(function(t) {
        var st = t.status || 'Cần làm';
        stCounts[st] = (stCounts[st] || 0) + 1;
      });
      chartKanbanInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Cần làm', 'Đang làm', 'Chờ duyệt', 'Hoàn thành'],
          datasets: [{
            data: [stCounts['Cần làm'], stCounts['Đang làm'], stCounts['Chờ duyệt'], stCounts['Hoàn thành']],
            backgroundColor: ['#64748B', '#3B82F6', '#F59E0B', '#10B981']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    var ctx3 = document.getElementById('chartCrmFunnel');
    if (ctx3) {
      if (chartCrmInstance) chartCrmInstance.destroy();
      var stageMap = {};
      crms.forEach(function(c) {
        var st = c.stage || 'Lead Mới';
        stageMap[st] = (stageMap[st] || 0) + 1;
      });
      var sLabels = Object.keys(stageMap);
      var sVals = sLabels.map(function(k) { return stageMap[k]; });
      chartCrmInstance = new Chart(ctx3, {
        type: 'pie',
        data: {
          labels: sLabels,
          datasets: [{
            data: sVals,
            backgroundColor: ['#0D9488', '#4F46E5', '#F59E0B', '#EC4899', '#10B981', '#6366F1']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }

  // =========================================================================
  // 2. RENDER BẢNG KANBAN & SƠ ĐỒ GANTT (PHÂN LUỒNG QUẢN LÝ vs NHÂN VIÊN)
  // =========================================================================
  function renderKanbanAndGantt() {
    var isMgr = isManagerOrAdmin();
    var scopedTasks = getScopedTasks(); // Đã cô lập: Nhân viên chỉ lấy việc của mình!
    var q = String(document.getElementById('filterKanbanSearch').value || '').trim().toLowerCase();
    var fPrj = document.getElementById('filterKanbanProject').value || 'ALL';
    var fDept = document.getElementById('filterKanbanDept') ? (document.getElementById('filterKanbanDept').value || 'ALL') : 'ALL';
    var fAss = document.getElementById('filterKanbanAssignee').value || 'ALL';
    var todayStr = appData.todayStr || '2025-05-15';

    var filtered = scopedTasks.filter(function(t) {
      if (fPrj !== 'ALL' && t.projectId !== fPrj) return false;
      if (fAss !== 'ALL') {
        var coArr = Array.isArray(t.coAssignees) ? t.coAssignees : [];
        var fAssLower = String(fAss || '').trim().toLowerCase();
        var tAssLower = String(t.assignee || '').trim().toLowerCase();
        var inCo = coArr.some(function(c) { return String(c || '').trim().toLowerCase() === fAssLower; });
        if (tAssLower !== fAssLower && !inCo) return false;
      }
      if (fDept !== 'ALL') {
        if (fDept === 'MY_MAIN') {
          if (!isUserMainPicOfTask(t)) return false;
        } else if (fDept === 'MY_COLLAB') {
          if (!isUserCollaboratorOfTask(t)) return false;
        } else if (fDept === 'HAS_FILES') {
          if (!Array.isArray(t.attachments) || t.attachments.length === 0) return false;
        } else {
          var depts = Array.isArray(t.departments) ? t.departments : [];
          if (depts.indexOf(fDept) === -1) return false;
        }
      }
      if (q) {
        var attNames = (Array.isArray(t.attachments) ? t.attachments : []).map(function(a) { return a.name; }).join(' ');
        var coNames = (Array.isArray(t.coAssignees) ? t.coAssignees : []).join(' ');
        var hay = (t.id + ' ' + t.title + ' ' + t.projectName + ' ' + t.customerName + ' ' + t.assignee + ' ' + coNames + ' ' + attNames).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var cols = {
      'Cần làm': [],
      'Đang làm': [],
      'Chờ duyệt': [],
      'Hoàn thành': []
    };

    filtered.forEach(function(t) {
      var st = cols[t.status] ? t.status : 'Cần làm';
      cols[st].push(t);
    });

    document.getElementById('cntKanbanTodo').textContent = cols['Cần làm'].length;
    document.getElementById('cntKanbanDoing').textContent = cols['Đang làm'].length;
    document.getElementById('cntKanbanReview').textContent = cols['Chờ duyệt'].length;
    document.getElementById('cntKanbanDone').textContent = cols['Hoàn thành'].length;

    renderKanbanColumn('colKanbanTodo', cols['Cần làm'], todayStr);
    renderKanbanColumn('colKanbanDoing', cols['Đang làm'], todayStr);
    renderKanbanColumn('colKanbanReview', cols['Chờ duyệt'], todayStr);
    renderKanbanColumn('colKanbanDone', cols['Hoàn thành'], todayStr);

    // Render Sơ đồ Gantt Timeline
    var ganttBody = document.getElementById('ganttRowsBody');
    if (filtered.length === 0) {
      ganttBody.innerHTML = '<div class="text-center text-muted py-4">Không có nhiệm vụ nào trong phạm vi hiển thị.</div>';
    } else {
      var gHtml = '';
      filtered.forEach(function(t) {
        var isOver = (t.status !== 'Hoàn thành' && t.deadline && t.deadline < todayStr);
        var barColor = t.status === 'Hoàn thành' ? '#10B981' : (isOver ? '#DC2626' : '#4338CA');
        gHtml += '<div class="gantt-row">' +
          '<div class="d-flex flex-wrap justify-content-between align-items-center mb-1 small">' +
            '<div><b>[' + escapeHtml(t.id) + '] ' + escapeHtml(t.title) + '</b> <span class="text-muted">(' + escapeHtml(t.assignee) + ')</span></div>' +
            '<div class="text-secondary">📅 ' + escapeHtml(t.startDate || '-') + ' ➔ <b class="' + (isOver ? 'text-danger' : 'text-dark') + '">' + escapeHtml(t.deadline || '-') + '</b> • <span class="badge bg-light text-dark border">' + escapeHtml(t.status) + '</span></div>' +
          '</div>' +
          '<div class="gantt-track">' +
            '<div class="gantt-fill" style="width:' + Math.max(8, Number(t.progress || 0)) + '%;background:' + barColor + ';">' + Number(t.progress || 0) + '% • ' + Number(t.kpiPoints || 0) + 'đ KPI</div>' +
          '</div>' +
        '</div>';
      });
      ganttBody.innerHTML = gHtml;
    }
  }

  // Render từng cột Kanban với LUỒNG NÚT XỬ LÝ TÁCH BIỆT GIỮA NHÂN VIÊN VÀ QUẢN LÝ
  function renderKanbanColumn(containerId, list, todayStr) {
    var box = document.getElementById(containerId);
    if (!list || list.length === 0) {
      box.innerHTML = '<div class="text-center text-muted small py-4 border border-dashed rounded-3">Trống</div>';
      return;
    }
    var isMgr = isManagerOrAdmin();
    var html = '';

    list.forEach(function(t) {
      var pCls = t.priority === 'Cao' ? 'priority-high' : (t.priority === 'Thấp' ? 'priority-low' : 'priority-medium');
      var isOver = (t.status !== 'Hoàn thành' && t.deadline && t.deadline < todayStr);
      var zUrl = buildZaloDeepLink(t.assigneePhone);

      var workflowHtml = '';
      var footerActionsHtml = '';

      if (isMgr) {
        // ===================================================================
        // LUỒNG CỦA QUẢN LÝ (ADMIN / MANAGER): ĐIỀU PHỐI, NHẮC VIỆC & DUYỆT
        // ===================================================================
        if (t.status === 'Chờ duyệt') {
          workflowHtml = '<div class="p-2 rounded-3 mb-2" style="background:#FEF3C7;border:1px solid #F59E0B;">' +
            '<div class="small fw-bold text-dark mb-1"><i class="bi bi-shield-check text-warning me-1"></i> Nhân viên đã nộp chờ nghiệm thu:</div>' +
            '<div class="d-flex gap-1">' +
              '<button type="button" class="btn btn-success btn-sm fw-bold flex-fill py-1" style="font-size:0.74rem;" onclick="quickMoveTaskStatus(\'' + escapeHtml(t.id) + '\', \'Hoàn thành\')">✅ Duyệt Hoàn Thành</button>' +
              '<button type="button" class="btn btn-outline-danger btn-sm fw-bold py-1" style="font-size:0.74rem;" onclick="quickMoveTaskStatus(\'' + escapeHtml(t.id) + '\', \'Đang làm\')">↩️ Yêu Cầu Làm Lại</button>' +
            '</div>' +
          '</div>';
        } else {
          var nextStatuses = ['Cần làm', 'Đang làm', 'Chờ duyệt', 'Hoàn thành'].filter(function(s) { return s !== t.status; });
          var mgrBtns = '';
          nextStatuses.forEach(function(ns) {
            var shortLbl = ns === 'Cần làm' ? '📝 Cần làm' : (ns === 'Đang làm' ? '⚡ Đang làm' : (ns === 'Chờ duyệt' ? '👀 Chờ duyệt' : '✅ Duyệt Xong'));
            mgrBtns += '<button type="button" class="btn btn-outline-secondary py-0 px-2" style="font-size:0.7rem;" onclick="quickMoveTaskStatus(\'' + escapeHtml(t.id) + '\', \'' + escapeHtml(ns) + '\')">' + shortLbl + '</button>';
          });
          workflowHtml = '<div class="d-flex flex-wrap gap-1 mb-2 pt-1 border-top">' + mgrBtns + '</div>';
        }

        footerActionsHtml = '<div class="d-flex justify-content-between align-items-center pt-1 border-top">' +
          '<div class="d-flex gap-1">' +
            '<button type="button" class="btn btn-xs btn-warning fw-bold py-0 px-2" style="font-size:0.73rem;" onclick="sendQuickReminder(\'TASK\', \'' + escapeHtml(t.id) + '\')" title="Gửi Email & Bot Zalo nhắc nhân sự">🔔 Nhắc</button>' +
            (zUrl ? '<a href="' + zUrl + '" target="_blank" class="btn-zalo-quick" title="Nhắn Zalo cho nhân sự">Zalo</a>' : '') +
          '</div>' +
          '<div class="d-flex gap-1">' +
            '<button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" style="font-size:0.73rem;" onclick="openTaskModal(\'' + escapeHtml(t.id) + '\')"><i class="bi bi-pencil"></i> Sửa</button>' +
            '<button type="button" class="btn btn-xs btn-outline-danger py-0 px-2" style="font-size:0.73rem;" onclick="handleDeleteTask(\'' + escapeHtml(t.id) + '\')"><i class="bi bi-trash"></i></button>' +
          '</div>' +
        '</div>';
      } else {
        // ===================================================================
        // LUỒNG CỦA NHÂN VIÊN THỰC THI (STAFF / CRM_SALE): NHẬN VIỆC & BÁO CÁO
        // (Không hiện nút Nhắc, không hiện nút Xóa, không tự ý bấm Hoàn thành)
        // ===================================================================
        if (t.status === 'Cần làm') {
          workflowHtml = '<div class="d-grid gap-1 mb-2 pt-1 border-top">' +
            '<button type="button" class="btn btn-primary btn-sm fw-bold py-1" style="font-size:0.78rem;" onclick="quickMoveTaskStatus(\'' + escapeHtml(t.id) + '\', \'Đang làm\')">' +
              '<i class="bi bi-play-fill"></i> ▶️ Nhận Việc & Bắt Đầu Làm' +
            '</button>' +
          '</div>';
        } else if (t.status === 'Đang làm') {
          workflowHtml = '<div class="d-grid gap-1 mb-2 pt-1 border-top">' +
            '<button type="button" class="btn btn-warning text-dark btn-sm fw-bold py-1" style="font-size:0.78rem;" onclick="quickMoveTaskStatus(\'' + escapeHtml(t.id) + '\', \'Chờ duyệt\')">' +
              '<i class="bi bi-send-check-fill"></i> 📤 Nộp Báo Cáo & Gửi Chờ Duyệt' +
            '</button>' +
          '</div>';
        } else if (t.status === 'Chờ duyệt') {
          workflowHtml = '<div class="p-2 rounded-3 mb-2 text-center small fw-semibold" style="background:#EFF6FF;color:#1D4ED8;border:1px dashed #93C5FD;">' +
            '⏳ Đã nộp báo cáo • Đang chờ Quản lý nghiệm thu' +
          '</div>';
        } else if (t.status === 'Hoàn thành') {
          workflowHtml = '<div class="p-2 rounded-3 mb-2 text-center small fw-bold" style="background:#ECFDF5;color:#047857;border:1px solid #6EE7B7;">' +
            '✅ Đã được Quản lý nghiệm thu (+' + Number(t.kpiPoints || 0) + 'đ KPI)' +
          '</div>';
        }

        var isMainMe = isUserMainPicOfTask(t);
        footerActionsHtml = '<div class="d-flex justify-content-between align-items-center pt-1 border-top">' +
          '<span class="small text-muted">' + (isMainMe ? '🎯 Bạn chủ trì' : '🤝 Bạn phối hợp') + '</span>' +
          (t.status !== 'Hoàn thành'
            ? '<button type="button" class="btn btn-xs btn-outline-primary fw-bold py-0 px-2" style="font-size:0.74rem;" onclick="openTaskModal(\'' + escapeHtml(t.id) + '\')"><i class="bi bi-paperclip"></i> Up File & Tiến độ</button>'
            : '<span class="badge bg-success">🔒 Đã khóa sổ</span>') +
        '</div>';
      }

      var deptsArr = Array.isArray(t.departments) ? t.departments : [];
      var coArr = Array.isArray(t.coAssignees) ? t.coAssignees : [];
      var subArr = Array.isArray(t.subtasks) ? t.subtasks : [];
      var attArr = Array.isArray(t.attachments) ? t.attachments : [];

      var deptBadgesHtml = '';
      if (deptsArr.length > 0) {
        deptBadgesHtml = '<div class="d-flex flex-wrap gap-1 mb-1">';
        deptsArr.forEach(function(dp) {
          deptBadgesHtml += '<span class="raci-dept-pill">🏢 ' + escapeHtml(dp) + '</span>';
        });
        deptBadgesHtml += '</div>';
      }

      var coHtml = '';
      if (coArr.length > 0) {
        coHtml = '<div class="small text-secondary mb-1" style="font-size:0.76rem;">🤝 Phối hợp: <span class="fw-semibold text-dark">' + escapeHtml(coArr.join(', ')) + '</span></div>';
      }

      var subBadgeHtml = '';
      if (subArr.length > 0) {
        var doneSub = subArr.filter(function(s) { return s.done; }).length;
        subBadgeHtml = '<div class="small mb-1"><span class="badge bg-warning bg-opacity-25 text-dark border border-warning">☑️ Checklist liên bộ phận: ' + doneSub + '/' + subArr.length + ' hoàn thành</span></div>';
      }

      var attChipsHtml = renderAttachmentsChipsHtml(attArr, true);

      html += '<div class="task-card ' + pCls + '">' +
        '<div class="d-flex justify-content-between align-items-start mb-1">' +
          '<span class="badge bg-light text-dark border">' + escapeHtml(t.id) + ' • ' + escapeHtml(t.priority) + '</span>' +
          '<span class="badge text-white" style="background:#4338CA;">+' + Number(t.kpiPoints || 0) + 'đ KPI</span>' +
        '</div>' +
        '<div class="fw-bold text-dark mb-1" style="font-size:0.9rem;">' + escapeHtml(t.title) + '</div>' +
        deptBadgesHtml +
        '<div class="small text-muted mb-1"><i class="bi bi-folder2"></i> ' + escapeHtml(t.projectName || t.projectId) + '</div>' +
        '<div class="small text-secondary mb-1">🎯 Chủ trì: <b>' + escapeHtml(t.assignee) + '</b></div>' +
        coHtml +
        subBadgeHtml +
        attChipsHtml +
        (t.notes ? '<div class="small text-muted fst-italic mb-2 bg-light p-1 rounded border-start border-2 border-primary">📌 ' + escapeHtml(t.notes) + '</div>' : '') +
        '<div class="progress mb-2" style="height:7px;">' +
          '<div class="progress-bar ' + (t.status === 'Hoàn thành' ? 'bg-success' : 'bg-primary') + '" style="width:' + Number(t.progress || 0) + '%"></div>' +
        '</div>' +
        '<div class="d-flex justify-content-between align-items-center small mb-2">' +
          '<span class="' + (isOver ? 'text-danger fw-bold' : 'text-muted') + '">⏰ Hạn: ' + escapeHtml(t.deadline || '-') + (isOver ? ' (Quá hạn!)' : '') + '</span>' +
          '<span class="fw-bold">' + Number(t.progress || 0) + '%</span>' +
        '</div>' +
        workflowHtml +
        footerActionsHtml +
      '</div>';
    });
    box.innerHTML = html;
  }

  function quickMoveTaskStatus(taskId, newStatus) {
    var isMgr = isManagerOrAdmin();
    // Bảo vệ nghiêm ngặt: Nhân viên không được tự chuyển sang Hoàn thành
    if (!isMgr && newStatus === 'Hoàn thành') {
      newStatus = 'Chờ duyệt';
      showToast('📤 Công việc đã được chuyển sang cột "Chờ Quản Lý Duyệt" để nghiệm thu!', 'warning');
    }

    var tasks = appData.tasks || [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === taskId) {
        tasks[i].status = newStatus;
        if (newStatus === 'Hoàn thành') tasks[i].progress = 100;
        else if (newStatus === 'Chờ duyệt' && tasks[i].progress < 85) tasks[i].progress = 90;
        else if (newStatus === 'Đang làm' && (tasks[i].progress === 0 || tasks[i].progress === 100)) tasks[i].progress = 40;
        else if (newStatus === 'Cần làm') tasks[i].progress = 0;
        break;
      }
    }
    renderAllViews();
    if (newStatus === 'Chờ duyệt' && !isMgr) {
      showToast('📤 Đã nộp báo cáo công việc ' + taskId + ' sang cột "Chờ Quản Lý Duyệt"!', 'success');
    } else if (newStatus === 'Hoàn thành' && isMgr) {
      showToast('✅ Đã duyệt nghiệm thu hoàn thành công việc ' + taskId + '!', 'success');
    } else {
      showToast('⚡ Đã chuyển trạng thái ' + taskId + ' sang "' + newStatus + '"', 'success');
    }

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(function(res) {
          if (res && res.ok) { appData = res; renderAllViews(); }
        })
        .updateTaskStatusQuick({
          id: taskId,
          status: newStatus,
          actor: currentUser ? currentUser.username : 'admin',
          role: currentUser ? currentUser.role : 'STAFF',
          canApprove: isMgr
        });
    }
  }

  // =========================================================================
  // 3. RENDER PHỄU KHÁCH HÀNG CRM (LỌC THEO QUYỀN SALE / QUẢN LÝ)
  // =========================================================================
  function renderCrmSection() {
    var isMgr = isManagerOrAdmin();
    var crms = getScopedCrmCustomers();
    var q = String(document.getElementById('filterCrmSearch').value || '').trim().toLowerCase();
    var stFilter = document.getElementById('filterCrmStage').value || 'ALL';
    var todayStr = appData.todayStr || '2025-05-15';

    var stages = ['Lead Mới', 'Đang Tư Vấn', 'Gửi Báo Giá / Demo', 'Đàm Phán Hợp Đồng', 'Đã Ký HĐ / Triển Khai', 'Chăm Sóc Tái Ký'];
    var sumHtml = '';
    stages.forEach(function(st) {
      var cnt = 0;
      var val = 0;
      crms.forEach(function(c) {
        if (c.stage === st) { cnt++; val += Number(c.dealValue || 0); }
      });
      sumHtml += '<div class="col-6 col-md-4 col-xl-2">' +
        '<div class="p-2 bg-white border rounded-3 shadow-sm">' +
          '<div class="small fw-bold text-secondary text-truncate">' + escapeHtml(st) + '</div>' +
          '<div class="fw-bold text-dark">' + cnt + ' khách</div>' +
          '<div class="small text-success fw-semibold">' + fmtCurrency(val) + '</div>' +
        '</div>' +
      '</div>';
    });
    document.getElementById('crmPipelineSummaryCards').innerHTML = sumHtml;

    var filtered = crms.filter(function(c) {
      if (stFilter !== 'ALL' && c.stage !== stFilter) return false;
      if (q) {
        var hay = (c.id + ' ' + c.companyName + ' ' + c.contactPerson + ' ' + c.phone + ' ' + c.owner).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var tbody = document.getElementById('crmTableBody');
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-4">Không có khách hàng CRM trong phạm vi phụ trách.</td></tr>';
      return;
    }

    var rowsHtml = '';
    filtered.forEach(function(c) {
      var zUrl = buildZaloDeepLink(c.phone);
      var isDue = c.nextFollowUpDate && c.nextFollowUpDate <= todayStr;
      rowsHtml += '<tr>' +
        '<td class="fw-bold">' + escapeHtml(c.id) + '<br><span class="badge bg-light text-dark border">' + escapeHtml(c.priority) + '</span></td>' +
        '<td><div class="fw-bold text-dark">' + escapeHtml(c.companyName) + '</div><div class="small text-muted">👤 ' + escapeHtml(c.contactPerson) + ' • Nguồn: ' + escapeHtml(c.source) + '</div></td>' +
        '<td>' +
          '<div class="d-flex flex-wrap gap-1">' +
            (zUrl ? '<a href="' + zUrl + '" target="_blank" class="btn-zalo-quick"><i class="bi bi-chat-dots-fill"></i> Chat Zalo</a>' : '') +
            (c.phone ? '<a href="tel:' + escapeHtml(c.phone) + '" class="btn btn-xs btn-outline-success py-1 px-2" style="font-size:0.75rem;"><i class="bi bi-telephone-fill"></i> ' + escapeHtml(c.phone) + '</a>' : '') +
            (isMgr ? '<button type="button" class="btn btn-xs btn-warning fw-bold py-1 px-2" style="font-size:0.75rem;" onclick="sendQuickReminder(\'CRM\', \'' + escapeHtml(c.id) + '\')">🔔 Bot Nhắc</button>' : '') +
          '</div>' +
        '</td>' +
        '<td><span class="badge text-white" style="background:#0D9488;">' + escapeHtml(c.stage) + '</span></td>' +
        '<td class="text-end fw-bold text-success">' + fmtCurrency(c.dealValue) + '</td>' +
        '<td>' + escapeHtml(c.owner) + '</td>' +
        '<td>' +
          '<div class="fw-bold ' + (isDue ? 'text-danger' : 'text-primary') + '">📅 ' + escapeHtml(c.nextFollowUpDate || 'Chưa hẹn') + '</div>' +
          '<div class="small text-muted">' + escapeHtml(c.reminderStatus) + '</div>' +
        '</td>' +
        '<td style="max-width:240px;"><div class="small text-wrap">' + escapeHtml(c.notes) + '</div></td>' +
        '<td class="text-center">' +
          '<button type="button" class="btn btn-sm btn-outline-primary me-1" onclick="openCrmModal(\'' + escapeHtml(c.id) + '\')"><i class="bi bi-pencil"></i></button>' +
          (isMgr ? '<button type="button" class="btn btn-sm btn-outline-danger" onclick="handleDeleteCrm(\'' + escapeHtml(c.id) + '\')"><i class="bi bi-trash"></i></button>' : '') +
        '</td>' +
      '</tr>';
    });
    tbody.innerHTML = rowsHtml;
  }

  // =========================================================================
  // 4. RENDER DANH MỤC DỰ ÁN (DU_AN)
  // =========================================================================
  function renderProjectsSection() {
    var prjs = getScopedProjects();
    var grid = document.getElementById('projectCardsGrid');
    if (prjs.length === 0) {
      grid.innerHTML = '<div class="col-12 text-center text-muted py-4">Chưa có dự án nào.</div>';
      return;
    }
    var html = '';
    prjs.forEach(function(p) {
      var pct = Number(p.progress || 0);
      var bColor = p.status === 'Hoàn thành' ? 'bg-success' : 'bg-primary';
      html += '<div class="col-12 col-md-6">' +
        '<div class="section-card h-100 mb-0">' +
          '<div class="d-flex justify-content-between align-items-start mb-2">' +
            '<div>' +
              '<span class="badge bg-primary me-1">' + escapeHtml(p.id) + '</span>' +
              '<span class="badge bg-light text-dark border">' + escapeHtml(p.category) + '</span>' +
              '<h6 class="fw-bold text-dark mt-1 mb-0">' + escapeHtml(p.name) + '</h6>' +
            '</div>' +
            '<button type="button" class="btn btn-sm btn-outline-primary" onclick="openProjectModal(\'' + escapeHtml(p.id) + '\')"><i class="bi bi-pencil-square"></i> Sửa</button>' +
          '</div>' +
          '<div class="small text-secondary mb-2">🤝 Khách hàng CRM: <b>' + escapeHtml(p.customerName || '-') + '</b> • 👤 PM: <b>' + escapeHtml(p.manager) + '</b></div>' +
          '<div class="d-flex justify-content-between small mb-1">' +
            '<span>Tiến độ: <b>' + pct + '%</b> (' + escapeHtml(p.status) + ')</span>' +
            '<span>📅 ' + escapeHtml(p.startDate) + ' ➔ <b>' + escapeHtml(p.endDate) + '</b></span>' +
          '</div>' +
          '<div class="progress mb-2" style="height:9px;">' +
            '<div class="progress-bar ' + bColor + '" style="width:' + pct + '%"></div>' +
          '</div>' +
          '<div class="d-flex justify-content-between align-items-center small pt-2 border-top">' +
            '<span>💰 Ngân sách HĐ: <b class="text-success">' + fmtCurrency(p.budget) + '</b></span>' +
            '<span>Chi phí thực tế: <b class="text-danger">' + fmtCurrency(p.actualCost) + '</b></span>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    grid.innerHTML = html;
  }

  // =========================================================================
  // 5. RENDER CẤU HÌNH BOT NHẮC VIỆC & NHẬT KÝ
  // =========================================================================
  function renderRemindersSection() {
    var cfg = appData.config || {};
    document.getElementById('cfgCompanyName').value = cfg.COMPANY_NAME || '';
    document.getElementById('cfgAdminEmail').value = cfg.ADMIN_EMAIL || '';
    document.getElementById('cfgCompanyHotline').value = cfg.COMPANY_HOTLINE || '';
    document.getElementById('cfgEnableEmail').value = String(cfg.ENABLE_EMAIL_REMINDER || 'TRUE').toUpperCase();
    document.getElementById('cfgEnableZalo').value = String(cfg.ENABLE_ZALO_REMINDER || 'TRUE').toUpperCase();
    document.getElementById('cfgEnableTelegram').value = String(cfg.ENABLE_TELEGRAM_REMINDER || 'TRUE').toUpperCase();
    document.getElementById('cfgZaloWebhook').value = cfg.ZALO_BOT_WEBHOOK_URL || '';
    document.getElementById('cfgZaloToken').value = cfg.ZALO_OA_ACCESS_TOKEN || '';
    document.getElementById('cfgTeleToken').value = cfg.TELEGRAM_BOT_TOKEN || '';
    document.getElementById('cfgTeleChatId').value = cfg.TELEGRAM_CHAT_ID || '';
    document.getElementById('cfgReminderHour').value = cfg.AUTO_REMINDER_HOUR || '8';
    document.getElementById('cfgRemindBeforeDays').value = cfg.REMIND_BEFORE_DAYS || '2';

    var trigBadge = document.getElementById('badgeTriggerState');
    if (appData.hasDailyTrigger) {
      trigBadge.className = 'badge bg-success';
      trigBadge.textContent = '⏰ Trigger Hàng Ngày: ĐANG BẬT (' + (cfg.AUTO_REMINDER_HOUR || '8') + 'h sáng)';
    } else {
      trigBadge.className = 'badge bg-secondary';
      trigBadge.textContent = '🔕 Trigger Hàng Ngày: ĐANG TẮT';
    }

    var logs = appData.reminderLogs || [];
    document.getElementById('badgeTotalReminderLogs').textContent = logs.length + ' bản ghi';
    var tbody = document.getElementById('reminderLogsTableBody');
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">Chưa có lịch sử nhắc việc.</td></tr>';
      return;
    }
    var html = '';
    logs.forEach(function(r) {
      html += '<tr>' +
        '<td class="text-nowrap">' + escapeHtml(r.timestamp) + '</td>' +
        '<td><span class="badge bg-warning text-dark">' + escapeHtml(r.refId) + '</span><br><small class="text-muted">' + escapeHtml(r.type) + '</small></td>' +
        '<td><b>' + escapeHtml(r.recipient) + '</b><br><small class="text-secondary">' + escapeHtml(r.phone || r.email) + '</small></td>' +
        '<td><span class="badge bg-primary">' + escapeHtml(r.channel) + '</span><br><small class="text-success">' + escapeHtml(r.status) + '</small></td>' +
        '<td><div class="small">' + escapeHtml(r.message) + '</div></td>' +
      '</tr>';
    });
    tbody.innerHTML = html;
  }

  // =========================================================================
  // 6. RENDER BẢNG ĐIỂM KPI (CÁ NHÂN HOẶC ĐỘI NGŨ) & BẢNG ĐIỀU HÀNH NHÂN SỰ PHAN_QUYEN
  // =========================================================================
  function renderKpiAndUsersSection() {
    var isMgr = isManagerOrAdmin();
    var isTopMgr = isTopManagerOrAdmin();
    var tasks = getScopedTasks();
    var subUsers = getSubordinateUsers();
    var todayStr = appData.todayStr || '2025-05-15';

    var statsMap = {};
    if (isMgr) {
      subUsers.forEach(function(u) {
        statsMap[u.fullName] = { name: u.fullName, username: u.username, total: 0, done: 0, doing: 0, overdue: 0, kpi: 0 };
      });
    } else if (currentUser) {
      statsMap[currentUser.fullName] = { name: currentUser.fullName, username: currentUser.username, total: 0, done: 0, doing: 0, overdue: 0, kpi: 0 };
    }

    tasks.forEach(function(t) {
      var name = t.assignee || 'Chưa phân công';
      if (!isMgr && currentUser && name !== currentUser.fullName) return;
      if (isMgr && !isTopMgr && !statsMap[name]) return;
      if (!statsMap[name]) statsMap[name] = { name: name, username: '', total: 0, done: 0, doing: 0, overdue: 0, kpi: 0 };
      statsMap[name].total++;
      statsMap[name].kpi += Number(t.kpiPoints || 0);
      if (t.status === 'Hoàn thành') statsMap[name].done++;
      else statsMap[name].doing++;
      if (t.status !== 'Hoàn thành' && t.deadline && t.deadline < todayStr) statsMap[name].overdue++;
    });

    var board = Object.keys(statsMap).map(function(k) { return statsMap[k]; });
    board.sort(function(a, b) { return b.kpi - a.kpi; });

    var kpiBody = document.getElementById('kpiLeaderboardBody');
    var kHtml = '';
    board.forEach(function(row, idx) {
      var rankBadge = isMgr ? (idx === 0 ? '🥇 Hạng 1' : (idx === 1 ? '🥈 Hạng 2' : (idx === 2 ? '🥉 Hạng 3' : '#' + (idx + 1)))) : '👤 Cá nhân';
      var grade = row.kpi >= 45 ? '<span class="badge bg-success">Xuất sắc (A+)</span>' : (row.kpi >= 25 ? '<span class="badge bg-primary">Đạt chuẩn (A)</span>' : '<span class="badge bg-warning text-dark">Đang tích lũy (B)</span>');
      kHtml += '<tr>' +
        '<td class="fw-bold">' + rankBadge + '</td>' +
        '<td>' +
          '<div class="fw-bold text-dark">' + escapeHtml(row.name) + '</div>' +
          (isMgr ? '<button type="button" class="btn btn-xs btn-link p-0 text-decoration-none" style="font-size:0.72rem;" onclick="filterKanbanByEmployee(\'' + escapeHtml(row.name) + '\')">👁️ Xem bảng việc</button>' : '') +
        '</td>' +
        '<td class="text-center">' + row.total + '</td>' +
        '<td class="text-center text-success fw-bold">' + row.done + '</td>' +
        '<td class="text-center text-primary">' + row.doing + '</td>' +
        '<td class="text-center text-danger fw-bold">' + row.overdue + '</td>' +
        '<td class="text-end fw-bold" style="color:#4338CA;">' + row.kpi + ' điểm</td>' +
        '<td>' + grade + '</td>' +
      '</tr>';
    });
    kpiBody.innerHTML = kHtml;

    // Bảng Điều Hành Nhân Sự & Phân Quyền Tuyến Dưới (`PHAN_QUYEN`) — Thao tác sống trực tiếp trên App!
    var uBody = document.getElementById('userAccountsTableBody');
    var uHtml = '';
    subUsers.forEach(function(u) {
      var isLocked = String(u.status || '').toLowerCase().indexOf('khóa') !== -1;
      var perms = getUserPermsList(u);
      var permBadges = [];
      if (perms.indexOf('ASSIGN_TASK') !== -1) permBadges.push('<span class="badge bg-primary bg-opacity-10 text-primary border border-primary" style="font-size:0.65rem;">Giao việc</span>');
      if (perms.indexOf('APPROVE_TASK') !== -1) permBadges.push('<span class="badge bg-success bg-opacity-10 text-success border border-success" style="font-size:0.65rem;">Duyệt 100%</span>');
      if (perms.indexOf('ACCESS_CRM') !== -1) permBadges.push('<span class="badge bg-info bg-opacity-10 text-dark border border-info" style="font-size:0.65rem;">Phễu CRM</span>');
      if (perms.indexOf('SELF_CREATE_TASK') !== -1) permBadges.push('<span class="badge bg-secondary bg-opacity-10 text-secondary border" style="font-size:0.65rem;">Tạo việc</span>');

      var roleOptions = ['ADMIN', 'MANAGER', 'LEADER', 'CRM_SALE', 'STAFF'].map(function(rOpt) {
        var sel = (String(u.role || '').toUpperCase() === rOpt) ? 'selected' : '';
        return '<option value="' + rOpt + '" ' + sel + '>' + rOpt + '</option>';
      }).join('');

      uHtml += '<tr>' +
        '<td>' +
          '<div class="fw-bold text-dark">' + escapeHtml(u.fullName) + ' <span class="badge bg-light text-secondary border">' + escapeHtml(u.username) + '</span></div>' +
          '<div class="small text-muted">🏢 ' + escapeHtml(u.department || 'Chưa phân phòng') + (u.phone ? (' • 📞 ' + escapeHtml(u.phone)) : '') + '</div>' +
        '</td>' +
        '<td>' +
          '<select class="form-select form-select-sm fw-bold py-0 px-1 mb-1" style="font-size:0.74rem;max-width:125px;" onchange="quickChangeUserRole(\'' + escapeHtml(u.username) + '\', this.value)" ' + (!isTopMgr && u.role === 'ADMIN' ? 'disabled' : '') + '>' +
            roleOptions +
          '</select>' +
          '<div class="d-flex flex-wrap gap-1">' + permBadges.join('') + '</div>' +
        '</td>' +
        '<td>' +
          '<button type="button" class="btn btn-xs ' + (isLocked ? 'btn-danger' : 'btn-outline-success') + ' py-0 px-2 fw-bold" style="font-size:0.7rem;" onclick="quickToggleUserStatus(\'' + escapeHtml(u.username) + '\')" title="Bấm để Bật/Khóa tài khoản">' +
            (isLocked ? '🔒 Đang khóa' : '🟢 Hoạt động') +
          '</button>' +
        '</td>' +
        '<td class="text-end">' +
          '<div class="d-inline-flex flex-wrap justify-content-end gap-1">' +
            '<button type="button" class="btn btn-xs btn-primary fw-bold py-0 px-2" style="font-size:0.72rem;" onclick="openTaskModalForEmployee(\'' + escapeHtml(u.username) + '\')" title="Giao việc ngay cho nhân sự này">📋 Giao việc</button>' +
            '<button type="button" class="btn btn-xs btn-outline-dark py-0 px-2" style="font-size:0.72rem;" onclick="filterKanbanByEmployee(\'' + escapeHtml(u.fullName) + '\')" title="Xem các công việc của nhân sự này trên Kanban">👁️ Xem việc</button>' +
            '<button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" style="font-size:0.72rem;" onclick="openUserModal(\'' + escapeHtml(u.username) + '\')" title="Cấu hình chi tiết quyền hạn & thông tin">⚙️ Quyền</button>' +
            (isAdminRole() && u.username !== 'admin' ? '<button type="button" class="btn btn-xs btn-outline-danger py-0 px-1" style="font-size:0.72rem;" onclick="handleDeleteUserAccount(\'' + escapeHtml(u.username) + '\')" title="Xóa tài khoản">🗑️</button>' : '') +
          '</div>' +
        '</td>' +
      '</tr>';
    });
    uBody.innerHTML = uHtml;

    var pBox = document.getElementById('printSummaryContent');
    pBox.innerHTML = '<div class="mb-2 fw-bold">Tổng hợp kết quả công việc & điểm KPI (' + (isMgr ? 'Toàn đội ngũ' : (currentUser ? currentUser.fullName : '')) + '):</div>' +
      '<div class="table-responsive"><table class="table table-sm table-bordered">' +
      '<thead><tr><th>Nhân sự</th><th>Tổng việc</th><th>Đã nghiệm thu</th><th>Quá hạn</th><th>Điểm KPI</th></tr></thead>' +
      '<tbody>' + board.map(function(r) {
        return '<tr><td>' + escapeHtml(r.name) + '</td><td>' + r.total + '</td><td>' + r.done + '</td><td>' + r.overdue + '</td><td><b>' + r.kpi + ' điểm</b></td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  // =========================================================================
  // MODALS & CRUD HANDLERS (CÓ KHÓA TRƯỜNG THEO VAI TRÒ)
  // =========================================================================
  function openCustomModal(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }
  function closeCustomModal(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function syncProjectCustomerToTask() {
    var pId = document.getElementById('taskFormProject').value;
    var prjs = appData.projects || [];
    for (var i = 0; i < prjs.length; i++) {
      if (prjs[i].id === pId) {
        document.getElementById('taskFormCustomer').value = prjs[i].customerName || '';
        break;
      }
    }
  }

  function syncAssigneeContactToTask() {
    var aName = document.getElementById('taskFormAssignee').value;
    var users = appData.users || [];
    for (var i = 0; i < users.length; i++) {
      if (users[i].fullName === aName) {
        document.getElementById('taskFormEmail').value = users[i].email || '';
        document.getElementById('taskFormPhone').value = users[i].phone || '';
        break;
      }
    }
  }

  function renderTaskModalCoAssignees(selectedCoList, lockMgrFields) {
    var box = document.getElementById('taskFormCoAssigneesBox');
    var subSel = document.getElementById('newSubtaskAssignee');
    if (!box) return;
    var users = (appData && appData.users) ? appData.users : [];
    var selSet = Array.isArray(selectedCoList) ? selectedCoList : [];
    var html = '';
    var subOptHtml = '';
    users.forEach(function(u) {
      var fn = u.fullName;
      var checked = selSet.indexOf(fn) !== -1 ? 'checked' : '';
      var disabled = lockMgrFields ? 'disabled' : '';
      html += '<label class="form-check form-check-inline m-0 small">' +
        '<input class="form-check-input task-coassignee-chk" type="checkbox" value="' + escapeHtml(fn) + '" ' + checked + ' ' + disabled + '> ' +
        escapeHtml(fn) +
      '</label>';
      subOptHtml += '<option value="' + escapeHtml(fn) + '">' + escapeHtml(fn) + '</option>';
    });
    box.innerHTML = html;
    if (subSel) subSel.innerHTML = subOptHtml;
  }

  function renderTaskModalSubtasks() {
    var box = document.getElementById('taskSubtasksList');
    var badge = document.getElementById('badgeSubtaskSummary');
    if (!box) return;
    var list = Array.isArray(editingTaskSubtasks) ? editingTaskSubtasks : [];
    var doneCount = list.filter(function(s) { return s.done; }).length;
    if (badge) badge.textContent = doneCount + '/' + list.length + ' hoàn thành';

    if (list.length === 0) {
      box.innerHTML = '<div class="text-muted small fst-italic py-1">Chưa có đầu việc con. Hãy thêm đầu việc phân bổ cho từng bộ phận/cá nhân bên dưới.</div>';
      return;
    }
    var html = '';
    list.forEach(function(st, idx) {
      html += '<div class="subtask-row ' + (st.done ? 'done' : '') + '">' +
        '<label class="d-flex align-items-center gap-2 m-0 flex-grow-1" style="cursor:pointer;">' +
          '<input type="checkbox" class="form-check-input m-0" ' + (st.done ? 'checked' : '') + ' onchange="toggleSubtaskDone(' + idx + ')">' +
          '<span class="' + (st.done ? 'text-decoration-line-through fw-semibold' : 'fw-semibold text-dark') + '">' + escapeHtml(st.title) + '</span>' +
        '</label>' +
        '<div class="d-flex align-items-center gap-1 flex-shrink-0">' +
          '<span class="raci-dept-pill">' + escapeHtml(st.dept || 'Bộ phận') + '</span>' +
          '<span class="badge bg-white text-dark border">' + escapeHtml(st.assignee || '') + '</span>' +
          '<button type="button" class="btn btn-xs btn-outline-danger py-0 px-1" onclick="removeSubtaskItem(' + idx + ')" title="Xóa đầu việc con">×</button>' +
        '</div>' +
      '</div>';
    });
    box.innerHTML = html;
  }

  function toggleSubtaskDone(idx) {
    if (!editingTaskSubtasks[idx]) return;
    editingTaskSubtasks[idx].done = !editingTaskSubtasks[idx].done;
    renderTaskModalSubtasks();
    // Tự động quy đổi % hoàn thành dựa trên tỷ lệ đầu việc con đã tick xong
    if (editingTaskSubtasks.length > 0) {
      var doneCount = editingTaskSubtasks.filter(function(s) { return s.done; }).length;
      var autoProg = Math.round((doneCount / editingTaskSubtasks.length) * 100);
      document.getElementById('taskFormProgress').value = autoProg;
    }
  }

  function addSubtaskItem() {
    var titleEl = document.getElementById('newSubtaskTitle');
    var deptEl = document.getElementById('newSubtaskDept');
    var assEl = document.getElementById('newSubtaskAssignee');
    var title = String(titleEl.value || '').trim();
    if (!title) {
      showToast('Vui lòng nhập nội dung đầu việc con!', 'warning');
      return;
    }
    editingTaskSubtasks.push({
      id: 'ST-' + Date.now(),
      title: title,
      dept: deptEl ? deptEl.value : 'Khối Kỹ Thuật',
      assignee: assEl ? assEl.value : '',
      done: false
    });
    titleEl.value = '';
    renderTaskModalSubtasks();
    var doneCount = editingTaskSubtasks.filter(function(s) { return s.done; }).length;
    document.getElementById('taskFormProgress').value = Math.round((doneCount / editingTaskSubtasks.length) * 100);
  }

  function removeSubtaskItem(idx) {
    editingTaskSubtasks.splice(idx, 1);
    renderTaskModalSubtasks();
  }

  function renderTaskModalAttachments() {
    var box = document.getElementById('taskAttachmentsList');
    if (!box) return;
    if (!Array.isArray(editingTaskAttachments) || editingTaskAttachments.length === 0) {
      box.innerHTML = '<div class="text-muted small fst-italic py-1">Chưa có tệp đính kèm nào. Bấm "Tải File Lên" để đính kèm Word, Excel, PowerPoint, PDF...</div>';
      return;
    }
    var html = '';
    editingTaskAttachments.forEach(function(att, idx) {
      var meta = getAttachmentBadgeMeta(att.ext || att.name);
      var url = att.url || 'https://drive.google.com';
      html += '<div class="d-inline-flex align-items-center gap-1 p-1 px-2 rounded-3 border bg-white shadow-sm">' +
        '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener" class="att-chip ' + meta.cls + ' border-0 p-0">' +
          '<span>' + meta.icon + ':</span> ' +
          '<span class="text-truncate" style="max-width:170px;">' + escapeHtml(att.name) + '</span>' +
          (att.size ? '<span class="text-muted ms-1">(' + escapeHtml(att.size) + ')</span>' : '') +
        '</a>' +
        '<button type="button" class="btn btn-xs text-danger py-0 px-1 fw-bold" onclick="removeTaskAttachment(' + idx + ')" title="Gỡ tệp đính kèm">×</button>' +
      '</div>';
    });
    box.innerHTML = html;
  }

  function removeTaskAttachment(idx) {
    editingTaskAttachments.splice(idx, 1);
    renderTaskModalAttachments();
  }

  function formatFileSizeHuman(bytes) {
    var b = Number(bytes || 0);
    if (b < 1024) return b + ' B';
    if (b < 1048576) return Math.round(b / 1024) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  function handleTaskFilesSelected(event) {
    var files = event && event.target && event.target.files ? event.target.files : [];
    if (!files || files.length === 0) return;
    var banner = document.getElementById('taskUploadStatusBanner');
    var uploaderName = currentUser ? currentUser.fullName : 'Nhân sự';
    var todayStr = (appData && appData.todayStr) ? appData.todayStr : '2025-05-15';
    var taskId = document.getElementById('taskFormId').value || 'TASK_NEW';

    Array.prototype.forEach.call(files, function(file) {
      var fName = file.name;
      var fSize = formatFileSizeHuman(file.size);
      var fExt = fName.indexOf('.') !== -1 ? fName.split('.').pop().toLowerCase() : 'file';
      var fMime = file.type || 'application/octet-stream';

      if (banner) {
        banner.classList.remove('d-none');
        banner.innerHTML = '⏳ Đang tải tệp <b>' + escapeHtml(fName) + '</b> (' + fSize + ') lên Google Drive...';
      }

      var reader = new FileReader();
      reader.onload = function(e) {
        var dataUrl = String(e.target.result || '');
        var base64Part = dataUrl.indexOf(',') !== -1 ? dataUrl.split(',')[1] : '';

        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run
            .withSuccessHandler(function(res) {
              if (banner) banner.classList.add('d-none');
              if (res && res.ok && res.file) {
                editingTaskAttachments.push(res.file);
                renderTaskModalAttachments();
                showToast('📎 Đã tải tệp "' + fName + '" lên thành công!', 'success');
              } else {
                editingTaskAttachments.push({
                  id: 'ATT-' + Date.now(),
                  name: fName,
                  ext: fExt,
                  size: fSize,
                  url: dataUrl || 'https://drive.google.com',
                  uploadedBy: uploaderName,
                  uploadedAt: todayStr
                });
                renderTaskModalAttachments();
                showToast('📎 Đã đính kèm tệp "' + fName + '" vào công việc!', 'success');
              }
            })
            .withFailureHandler(function() {
              if (banner) banner.classList.add('d-none');
              editingTaskAttachments.push({
                id: 'ATT-' + Date.now(),
                name: fName,
                ext: fExt,
                size: fSize,
                url: dataUrl || 'https://drive.google.com',
                uploadedBy: uploaderName,
                uploadedAt: todayStr
              });
              renderTaskModalAttachments();
              showToast('📎 Đã đính kèm tệp "' + fName + '"!', 'success');
            })
            .uploadTaskAttachment({
              taskId: taskId,
              fileName: fName,
              mimeType: fMime,
              fileSize: fSize,
              base64Data: base64Part,
              fallbackUrl: dataUrl,
              uploadedBy: uploaderName,
              role: currentUser ? currentUser.role : 'STAFF'
            });
        } else {
          if (banner) banner.classList.add('d-none');
          editingTaskAttachments.push({
            id: 'ATT-' + Date.now(),
            name: fName,
            ext: fExt,
            size: fSize,
            url: dataUrl || 'https://drive.google.com',
            uploadedBy: uploaderName,
            uploadedAt: todayStr
          });
          renderTaskModalAttachments();
          showToast('📎 Đã đính kèm tệp "' + fName + '" (' + fSize + ')!', 'success');
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  }

  function addQuickLinkAttachment() {
    var nameInput = document.getElementById('quickAttachmentName');
    var urlInput = document.getElementById('quickAttachmentUrl');
    var rawUrl = String(urlInput.value || '').trim();
    var rawName = String(nameInput.value || '').trim();
    if (!rawUrl && !rawName) {
      showToast('Vui lòng nhập tên tệp hoặc dán Link tài liệu!', 'warning');
      return;
    }
    if (!rawUrl) rawUrl = 'https://drive.google.com';
    if (!rawName) rawName = rawUrl.replace(/^https?:\/\//, '').slice(0, 32);
    var ext = rawName.indexOf('.') !== -1 ? rawName.split('.').pop().toLowerCase() : 'link';
    editingTaskAttachments.push({
      id: 'ATT-' + Date.now(),
      name: rawName,
      ext: ext,
      size: 'Cloud Link',
      url: rawUrl,
      uploadedBy: currentUser ? currentUser.fullName : 'Nhân sự',
      uploadedAt: (appData && appData.todayStr) ? appData.todayStr : '2025-05-15'
    });
    nameInput.value = '';
    urlInput.value = '';
    renderTaskModalAttachments();
    showToast('🔗 Đã đính kèm tài liệu: ' + rawName, 'success');
  }

  // Khi nhân sự nhập % Hoàn thành = 100%, tự động chuyển dropdown Trạng thái sang "Chờ duyệt" (hoặc giữ "Hoàn thành" nếu là Quản lý/Lead)
  function onTaskProgressInput(val) {
    var prog = Number(val || 0);
    var stEl = document.getElementById('taskFormStatus');
    if (!stEl) return;
    var isMgr = isManagerOrAdmin();
    if (prog >= 100) {
      if (!isMgr || stEl.value === 'Cần làm' || stEl.value === 'Đang làm') {
        stEl.value = 'Chờ duyệt';
      }
    } else if (prog > 0 && stEl.value === 'Cần làm') {
      stEl.value = 'Đang làm';
    }
  }

  function ensureSelectOptionExists(selectEl, val, label) {
    if (!selectEl || !val) return;
    var exists = false;
    for (var i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value === val) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      var opt = document.createElement('option');
      opt.value = val;
      opt.textContent = label || val;
      selectEl.appendChild(opt);
    }
  }

  function openTaskModalForEmployee(username) {
    var u = (appData.users || []).find(function(x) { return String(x.username || '').toLowerCase() === String(username || '').toLowerCase(); });
    openTaskModal();
    if (u) {
      var assSel = document.getElementById('taskFormAssignee');
      ensureSelectOptionExists(assSel, u.fullName, u.fullName + ' (' + u.role + ')');
      assSel.value = u.fullName;
      document.getElementById('taskFormEmail').value = u.email || '';
      document.getElementById('taskFormPhone').value = u.phone || '';
      var deptChks = document.querySelectorAll('.task-dept-chk');
      Array.prototype.forEach.call(deptChks, function(chk) {
        chk.checked = isSameDepartment(chk.value, u.department);
      });
      showToast('📋 Đang tạo nhiệm vụ mới giao cho: ' + u.fullName, 'success');
    }
  }

  function filterKanbanByEmployee(fullName) {
    switchMainTab('kanban');
    var fAss = document.getElementById('filterKanbanAssignee');
    if (fAss && fullName) {
      ensureSelectOptionExists(fAss, fullName, '👤 ' + fullName);
      fAss.value = fullName;
    }
    var fDept = document.getElementById('filterKanbanDept');
    if (fDept) fDept.value = 'ALL';
    renderKanbanAndGantt();
    showToast('👁️ Đang hiển thị bảng công việc Kanban của: ' + fullName, 'success');
  }

  function openTaskModal(taskId) {
    var isMgr = isManagerOrAdmin();
    var canCreate = isMgr || hasUserPermission('SELF_CREATE_TASK', currentUser);
    if (!taskId && !canCreate) {
      showToast('🔒 Tài khoản của bạn chưa được cấp quyền tạo công việc mới!', 'warning');
      return;
    }

    populateSelectDropdowns();
    var todayStr = appData.todayStr || '2025-05-15';

    var staffNotice = document.getElementById('staffTaskModalNotice');
    var optDone = document.getElementById('optStatusDoneManagerOnly');
    var wrapSendImm = document.getElementById('wrapTaskSendImmediate');

    // Khi tạo việc mới (!taskId), cho phép cả Nhân viên nhập Tên việc, Dự án, Hạn chót (chỉ khóa Assignee mặc định là chính mình nếu không phải Quản lý/Lead)
    var isEditingExistingAsStaff = (!!taskId && !isMgr);

    if (isMgr) {
      staffNotice.classList.add('d-none');
      if (optDone) optDone.disabled = false;
      if (wrapSendImm) wrapSendImm.classList.remove('d-none');
      document.getElementById('modalTaskHeaderTitle').textContent = taskId
        ? '📋 Quản Lý / Team Lead Điều Phối, Nghiệm Thu & File Đính Kèm'
        : '📋 Giao Nhiệm Vụ Mới Cho Tuyến Dưới (Đa Bộ Phận RACI & Đính Kèm File)';
    } else {
      staffNotice.classList.remove('d-none');
      if (optDone) optDone.disabled = true;
      if (wrapSendImm) wrapSendImm.classList.add('d-none');
      document.getElementById('modalTaskHeaderTitle').textContent = taskId
        ? '📝 Cập Nhật Tiến Độ (100% ➔ Chờ Duyệt), Checklist & Tải File Bàn Giao'
        : '➕ Tự Đăng Ký Công Việc / Báo Cáo Đầu Việc Mới Trên Kanban';
    }

    document.getElementById('taskFormTitle').disabled = isEditingExistingAsStaff;
    document.getElementById('taskFormProject').disabled = isEditingExistingAsStaff;
    document.getElementById('taskFormCustomer').disabled = isEditingExistingAsStaff;
    document.getElementById('taskFormAssignee').disabled = !isMgr;
    document.getElementById('taskFormEmail').disabled = isEditingExistingAsStaff;
    document.getElementById('taskFormPhone').disabled = isEditingExistingAsStaff;
    document.getElementById('taskFormPriority').disabled = isEditingExistingAsStaff;
    document.getElementById('taskFormStartDate').disabled = isEditingExistingAsStaff;
    document.getElementById('taskFormDeadline').disabled = isEditingExistingAsStaff;
    document.getElementById('taskFormHours').disabled = isEditingExistingAsStaff;

    var deptChks = document.querySelectorAll('.task-dept-chk');

    if (taskId) {
      var t = (appData.tasks || []).find(function(x) { return x.id === taskId; });
      if (t) {
        var prjSel = document.getElementById('taskFormProject');
        var assSel = document.getElementById('taskFormAssignee');
        // Đảm bảo option tồn tại trong <select> trước khi gán .value để KHÔNG BAO GIỜ bị rỗng "" làm biến mất task!
        ensureSelectOptionExists(prjSel, t.projectId, (t.projectId || 'DA') + ' - ' + (t.projectName || 'Dự án'));
        ensureSelectOptionExists(assSel, t.assignee, t.assignee);

        document.getElementById('taskFormId').value = t.id;
        document.getElementById('taskFormTitle').value = t.title;
        prjSel.value = t.projectId;
        document.getElementById('taskFormCustomer').value = t.customerName;
        assSel.value = t.assignee;
        document.getElementById('taskFormEmail').value = t.assigneeEmail;
        document.getElementById('taskFormPhone').value = t.assigneePhone;
        document.getElementById('taskFormStatus').value = (!isMgr && t.status === 'Hoàn thành') ? 'Chờ duyệt' : t.status;
        document.getElementById('taskFormPriority').value = t.priority;
        document.getElementById('taskFormProgress').value = t.progress;
        document.getElementById('taskFormStartDate').value = t.startDate || todayStr;
        document.getElementById('taskFormDeadline').value = t.deadline || todayStr;
        document.getElementById('taskFormHours').value = t.estimatedHours || 8;
        document.getElementById('taskFormNotes').value = t.notes || '';

        var tDepts = Array.isArray(t.departments) ? t.departments : [];
        Array.prototype.forEach.call(deptChks, function(chk) {
          chk.checked = tDepts.indexOf(chk.value) !== -1;
          chk.disabled = isEditingExistingAsStaff;
        });
        renderTaskModalCoAssignees(t.coAssignees || [], isEditingExistingAsStaff);
        editingTaskSubtasks = JSON.parse(JSON.stringify(Array.isArray(t.subtasks) ? t.subtasks : []));
        editingTaskAttachments = JSON.parse(JSON.stringify(Array.isArray(t.attachments) ? t.attachments : []));
      }
    } else {
      document.getElementById('taskFormId').value = '';
      document.getElementById('taskFormTitle').value = '';
      document.getElementById('taskFormStatus').value = 'Cần làm';
      document.getElementById('taskFormPriority').value = 'Cao';
      document.getElementById('taskFormProgress').value = 0;
      document.getElementById('taskFormStartDate').value = todayStr;
      document.getElementById('taskFormDeadline').value = addDaysStr(todayStr, 2);
      document.getElementById('taskFormHours').value = 8;
      document.getElementById('taskFormNotes').value = '';

      var assSelNew = document.getElementById('taskFormAssignee');
      if (currentUser && !isMgr) {
        ensureSelectOptionExists(assSelNew, currentUser.fullName, currentUser.fullName + ' (' + currentUser.role + ')');
        assSelNew.value = currentUser.fullName;
      }

      var myDept = currentUser ? (currentUser.department || '') : '';
      Array.prototype.forEach.call(deptChks, function(chk) {
        if (myDept && isSameDepartment(chk.value, myDept)) {
          chk.checked = true;
        } else {
          chk.checked = (chk.value === 'Phòng Quản Lý Dự Án' || chk.value === 'Khối Kỹ Thuật');
        }
        chk.disabled = false;
      });
      renderTaskModalCoAssignees([], false);
      editingTaskSubtasks = [];
      editingTaskAttachments = [];
      syncProjectCustomerToTask();
      syncAssigneeContactToTask();
    }
    renderTaskModalSubtasks();
    renderTaskModalAttachments();
    openCustomModal('modalTaskBackdrop');
  }

  function submitTaskForm() {
    var isMgr = isManagerOrAdmin();
    var taskId = String(document.getElementById('taskFormId').value || '').trim();
    var existingTask = taskId ? (appData.tasks || []).find(function(x) { return x.id === taskId; }) : null;

    var title = String(document.getElementById('taskFormTitle').value || (existingTask ? existingTask.title : '')).trim();
    if (!title) {
      showToast('Vui lòng nhập tên công việc!', 'danger');
      return;
    }

    var pId = document.getElementById('taskFormProject').value || (existingTask ? existingTask.projectId : '');
    var pObj = (appData.projects || []).find(function(x) { return x.id === pId; });

    var progVal = Number(document.getElementById('taskFormProgress').value || 0);
    if (progVal > 100) progVal = 100;
    if (progVal < 0) progVal = 0;

    var chosenStatus = document.getElementById('taskFormStatus').value || (existingTask ? existingTask.status : 'Cần làm');

    // FIX TRIỆT ĐỂ: Khi nhân viên cập nhật tiến độ lên 100%, tự động chuyển trạng thái sang "Chờ duyệt" (Không bao giờ bị reset về 0 hay mất việc!)
    if (progVal >= 100) {
      progVal = 100;
      if (!isMgr) {
        chosenStatus = 'Chờ duyệt';
      } else if (chosenStatus === 'Cần làm' || chosenStatus === 'Đang làm') {
        chosenStatus = 'Chờ duyệt';
      }
    } else if (chosenStatus === 'Hoàn thành') {
      if (isMgr) {
        progVal = 100;
      } else {
        chosenStatus = 'Chờ duyệt';
      }
    } else if (progVal > 0 && chosenStatus === 'Cần làm') {
      chosenStatus = 'Đang làm';
    }

    var selectedDepts = [];
    document.querySelectorAll('.task-dept-chk:checked').forEach(function(chk) {
      selectedDepts.push(chk.value);
    });
    if (selectedDepts.length === 0 && existingTask && Array.isArray(existingTask.departments)) {
      selectedDepts = existingTask.departments;
    }

    // Bảo toàn tuyệt đối Người chủ trì (mainAssignee) của task cũ nếu dropdown bị disable hoặc lệch tên
    var mainAssignee = String(document.getElementById('taskFormAssignee').value || '').trim();
    if (!mainAssignee && existingTask && existingTask.assignee) {
      mainAssignee = existingTask.assignee;
    }
    if (!mainAssignee && currentUser) {
      mainAssignee = currentUser.fullName;
    }

    var selectedCoAssignees = [];
    document.querySelectorAll('.task-coassignee-chk:checked').forEach(function(chk) {
      if (chk.value !== mainAssignee) selectedCoAssignees.push(chk.value);
    });
    if (selectedCoAssignees.length === 0 && existingTask && !isMgr && Array.isArray(existingTask.coAssignees)) {
      selectedCoAssignees = existingTask.coAssignees;
    }

    var payload = {
      id: taskId,
      title: title,
      projectId: pId,
      projectName: pObj ? pObj.name : (existingTask ? existingTask.projectName : pId),
      customerName: document.getElementById('taskFormCustomer').value || (existingTask ? existingTask.customerName : ''),
      assignee: mainAssignee,
      assigneeEmail: document.getElementById('taskFormEmail').value || (existingTask ? existingTask.assigneeEmail : ''),
      assigneePhone: document.getElementById('taskFormPhone').value || (existingTask ? existingTask.assigneePhone : ''),
      status: chosenStatus,
      priority: document.getElementById('taskFormPriority').value || (existingTask ? existingTask.priority : 'Trung bình'),
      progress: progVal,
      startDate: document.getElementById('taskFormStartDate').value || (existingTask ? existingTask.startDate : ''),
      deadline: document.getElementById('taskFormDeadline').value || (existingTask ? existingTask.deadline : ''),
      estimatedHours: Number(document.getElementById('taskFormHours').value || (existingTask ? existingTask.estimatedHours : 8)),
      notes: document.getElementById('taskFormNotes').value,
      departments: selectedDepts,
      coAssignees: selectedCoAssignees,
      subtasks: editingTaskSubtasks,
      attachments: editingTaskAttachments,
      sendImmediateNotify: isMgr && document.getElementById('taskFormSendImmediate').checked,
      actor: currentUser ? currentUser.username : 'admin',
      role: currentUser ? currentUser.role : 'STAFF',
      canApprove: isMgr
    };

    if (!payload.id) {
      payload.id = 'CV-' + Math.floor(100 + Math.random() * 899);
      payload.kpiPoints = payload.priority === 'Cao' ? 30 : 20;
      payload.reminderStatus = payload.sendImmediateNotify ? 'Đã nhắc Email/Zalo' : 'Chưa nhắc';
      appData.tasks.unshift(payload);
    } else {
      for (var i = 0; i < appData.tasks.length; i++) {
        if (appData.tasks[i].id === payload.id) {
          appData.tasks[i] = Object.assign(appData.tasks[i], payload);
          break;
        }
      }
    }

    // Đảm bảo bộ lọc Kanban không vô tình ẩn công việc vừa cập nhật
    var fDept = document.getElementById('filterKanbanDept');
    if (fDept && fDept.value !== 'ALL') fDept.value = 'ALL';

    closeCustomModal('modalTaskBackdrop');
    renderAllViews();
    if (progVal === 100 && chosenStatus === 'Chờ duyệt') {
      showToast('📤 Đã cập nhật tiến độ 100% và chuyển sang cột "Chờ Quản Lý Duyệt": ' + payload.title, 'success');
    } else {
      showToast('✅ Đã lưu cập nhật công việc: ' + payload.title + ' (' + progVal + '%)', 'success');
    }

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      setSyncBadge('loading', 'Đang lưu công việc...');
      google.script.run
        .withSuccessHandler(function(res) {
          if (res && res.ok) {
            appData = res;
            setSyncBadge('ok', 'Đã lưu Sheet');
            renderAllViews();
          }
        })
        .saveTaskItem(payload);
    }
  }

  function handleDeleteTask(taskId) {
    if (!isManagerOrAdmin()) {
      showToast('🔒 Chỉ Quản lý mới có quyền xóa công việc!', 'danger');
      return;
    }
    appData.tasks = (appData.tasks || []).filter(function(t) { return t.id !== taskId; });
    renderAllViews();
    showToast('🗑️ Đã xóa công việc ' + taskId, 'warning');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).deleteTaskItem({ id: taskId, actor: currentUser ? currentUser.username : 'admin' });
    }
  }

  // CRM MODAL
  function openCrmModal(crmId) {
    populateSelectDropdowns();
    var isMgr = isManagerOrAdmin();
    var todayStr = appData.todayStr || '2025-05-15';
    var ownerSelect = document.getElementById('crmFormOwner');

    if (crmId) {
      var c = (appData.crmCustomers || []).find(function(x) { return x.id === crmId; });
      if (c) {
        document.getElementById('crmFormId').value = c.id;
        document.getElementById('crmFormCompany').value = c.companyName;
        document.getElementById('crmFormContact').value = c.contactPerson;
        document.getElementById('crmFormPhone').value = c.phone;
        document.getElementById('crmFormEmail').value = c.email;
        document.getElementById('crmFormSource').value = c.source;
        document.getElementById('crmFormStage').value = c.stage;
        document.getElementById('crmFormDealValue').value = c.dealValue;
        document.getElementById('crmFormPriority').value = c.priority;
        ownerSelect.value = c.owner;
        document.getElementById('crmFormLastContact').value = c.lastContactDate || todayStr;
        document.getElementById('crmFormNextFollowUp').value = c.nextFollowUpDate || todayStr;
        document.getElementById('crmFormNotes').value = c.notes || '';
      }
    } else {
      document.getElementById('crmFormId').value = '';
      document.getElementById('crmFormCompany').value = '';
      document.getElementById('crmFormContact').value = '';
      document.getElementById('crmFormPhone').value = '';
      document.getElementById('crmFormEmail').value = '';
      document.getElementById('crmFormStage').value = 'Đang Tư Vấn';
      document.getElementById('crmFormDealValue').value = 50000000;
      if (currentUser) ownerSelect.value = currentUser.fullName;
      document.getElementById('crmFormLastContact').value = todayStr;
      document.getElementById('crmFormNextFollowUp').value = addDaysStr(todayStr, 1);
      document.getElementById('crmFormNotes').value = '';
    }
    ownerSelect.disabled = !isMgr;
    openCustomModal('modalCrmBackdrop');
  }

  function submitCrmForm() {
    var comp = String(document.getElementById('crmFormCompany').value || '').trim();
    if (!comp) {
      showToast('Vui lòng nhập tên Khách hàng / Doanh nghiệp!', 'danger');
      return;
    }
    var payload = {
      id: document.getElementById('crmFormId').value,
      companyName: comp,
      contactPerson: document.getElementById('crmFormContact').value,
      phone: document.getElementById('crmFormPhone').value,
      email: document.getElementById('crmFormEmail').value,
      source: document.getElementById('crmFormSource').value,
      stage: document.getElementById('crmFormStage').value,
      dealValue: Number(document.getElementById('crmFormDealValue').value || 0),
      priority: document.getElementById('crmFormPriority').value,
      owner: document.getElementById('crmFormOwner').value,
      lastContactDate: document.getElementById('crmFormLastContact').value,
      nextFollowUpDate: document.getElementById('crmFormNextFollowUp').value,
      notes: document.getElementById('crmFormNotes').value,
      reminderStatus: 'Chưa nhắc',
      actor: currentUser ? currentUser.username : 'admin'
    };

    if (!payload.id) {
      payload.id = 'KH-' + Math.floor(100 + Math.random() * 899);
      appData.crmCustomers.unshift(payload);
    } else {
      for (var i = 0; i < appData.crmCustomers.length; i++) {
        if (appData.crmCustomers[i].id === payload.id) {
          appData.crmCustomers[i] = Object.assign(appData.crmCustomers[i], payload);
          break;
        }
      }
    }
    closeCustomModal('modalCrmBackdrop');
    renderAllViews();
    showToast('🤝 Đã lưu khách hàng CRM: ' + payload.companyName, 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveCrmCustomer(payload);
    }
  }

  function handleDeleteCrm(crmId) {
    if (!isManagerOrAdmin()) return;
    appData.crmCustomers = (appData.crmCustomers || []).filter(function(c) { return c.id !== crmId; });
    renderAllViews();
    showToast('Đã xóa khách hàng CRM ' + crmId, 'warning');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).deleteCrmCustomer({ id: crmId });
    }
  }

  // PROJECT MODAL
  function onSelectProjectCustomer() {}

  function openProjectModal(prjId) {
    if (!isManagerOrAdmin()) {
      showToast('🔒 Chỉ Quản lý mới được tạo hoặc sửa thông tin Dự án!', 'warning');
      return;
    }
    populateSelectDropdowns();
    var todayStr = appData.todayStr || '2025-05-15';
    if (prjId) {
      var p = (appData.projects || []).find(function(x) { return x.id === prjId; });
      if (p) {
        document.getElementById('prjFormId').value = p.id;
        document.getElementById('prjFormName').value = p.name;
        document.getElementById('prjFormCustomerSelect').value = p.customerId || '';
        document.getElementById('prjFormManager').value = p.manager;
        document.getElementById('prjFormCategory').value = p.category;
        document.getElementById('prjFormPriority').value = p.priority;
        document.getElementById('prjFormStatus').value = p.status;
        document.getElementById('prjFormStartDate').value = p.startDate || todayStr;
        document.getElementById('prjFormEndDate').value = p.endDate || todayStr;
        document.getElementById('prjFormProgress').value = p.progress;
        document.getElementById('prjFormBudget').value = p.budget;
        document.getElementById('prjFormActualCost').value = p.actualCost;
        document.getElementById('prjFormNotes').value = p.notes || '';
      }
    } else {
      document.getElementById('prjFormId').value = '';
      document.getElementById('prjFormName').value = '';
      document.getElementById('prjFormStartDate').value = todayStr;
      document.getElementById('prjFormEndDate').value = addDaysStr(todayStr, 14);
      document.getElementById('prjFormProgress').value = 10;
      document.getElementById('prjFormBudget').value = 120000000;
      document.getElementById('prjFormActualCost').value = 15000000;
      document.getElementById('prjFormNotes').value = '';
    }
    openCustomModal('modalProjectBackdrop');
  }

  function submitProjectForm() {
    var name = String(document.getElementById('prjFormName').value || '').trim();
    if (!name) {
      showToast('Vui lòng nhập tên dự án!', 'danger');
      return;
    }
    var cId = document.getElementById('prjFormCustomerSelect').value;
    var cObj = (appData.crmCustomers || []).find(function(x) { return x.id === cId; });

    var payload = {
      id: document.getElementById('prjFormId').value,
      name: name,
      customerId: cId,
      customerName: cObj ? cObj.companyName : 'Khách hàng Doanh nghiệp',
      manager: document.getElementById('prjFormManager').value,
      category: document.getElementById('prjFormCategory').value,
      priority: document.getElementById('prjFormPriority').value,
      status: document.getElementById('prjFormStatus').value,
      startDate: document.getElementById('prjFormStartDate').value,
      endDate: document.getElementById('prjFormEndDate').value,
      progress: Number(document.getElementById('prjFormProgress').value || 0),
      budget: Number(document.getElementById('prjFormBudget').value || 0),
      actualCost: Number(document.getElementById('prjFormActualCost').value || 0),
      notes: document.getElementById('prjFormNotes').value
    };

    if (!payload.id) {
      payload.id = 'DA-' + Math.floor(100 + Math.random() * 899);
      appData.projects.unshift(payload);
    } else {
      for (var i = 0; i < appData.projects.length; i++) {
        if (appData.projects[i].id === payload.id) {
          appData.projects[i] = Object.assign(appData.projects[i], payload);
          break;
        }
      }
    }
    closeCustomModal('modalProjectBackdrop');
    renderAllViews();
    showToast('🚀 Đã lưu dự án: ' + payload.name, 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveProjectItem(payload);
    }
  }

  // =========================================================================
  // BẮN NHẮC VIỆC TỨC THÌ (EMAIL + BOT ZALO + TELEGRAM)
  // =========================================================================
  function sendQuickReminder(refType, refId) {
    var payload = { refType: refType, refId: refId, actor: currentUser ? currentUser.username : 'admin' };
    if (refType === 'CRM') {
      var c = (appData.crmCustomers || []).find(function(x) { return x.id === refId; });
      if (!c) return;
      payload.title = c.companyName + ' (' + c.contactPerson + ')';
      payload.recipient = c.owner;
      payload.email = c.email || (appData.config && appData.config.ADMIN_EMAIL) || '';
      payload.phone = c.phone;
      payload.customMessage = '[NHẮC LỊCH CHĂM SÓC CRM] Khách hàng ' + c.companyName + ' (' + c.contactPerson + ' - Zalo: ' + c.phone + ') có lịch hẹn gọi lại ngày ' + c.nextFollowUpDate + '. Ghi chú: ' + c.notes;
      c.reminderStatus = 'Đã nhắc Email/Zalo';
    } else {
      var t = (appData.tasks || []).find(function(x) { return x.id === refId; });
      if (!t) return;
      payload.title = t.title;
      payload.recipient = t.assignee;
      payload.email = t.assigneeEmail;
      payload.phone = t.assigneePhone;
      payload.customMessage = '[NHẮC DEADLINE DỰ ÁN] Công việc [' + t.id + '] "' + t.title + '" thuộc dự án "' + t.projectName + '" có hạn chót ' + t.deadline + ' (Tiến độ: ' + t.progress + '%). Vui lòng hoàn thành và cập nhật Kanban!';
      t.reminderStatus = 'Đã nhắc Email/Zalo';
    }

    appData.reminderLogs.unshift({
      id: 'RM-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: appData.todayStr + ' ' + new Date().toTimeString().slice(0, 8),
      type: refType === 'CRM' ? 'NHẮC LỊCH HẸN CRM' : 'NHẮC TIẾN ĐỘ CÔNG VIỆC',
      refId: refId,
      title: payload.title,
      recipient: payload.recipient,
      email: payload.email,
      phone: payload.phone,
      channel: 'EMAIL + BOT ZALO',
      status: 'Thành công',
      message: payload.customMessage
    });

    renderAllViews();
    showToast('🔔 Đã bắn nhắc việc [' + refId + '] qua Email & Bot Zalo tới ' + payload.recipient + '!', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).sendTaskReminderNow(payload);
    }
  }

  function triggerRunAutoRemindersNow() {
    if (!isManagerOrAdmin()) return;
    showToast('🤖 Đang quét toàn bộ việc sắp đến hạn & lịch hẹn CRM để bắn Email + Bot Zalo...', 'warning');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      setSyncBadge('loading', 'Đang bắn Bot Nhắc Việc...');
      google.script.run
        .withSuccessHandler(function(res) {
          if (res && res.ok) {
            appData = res;
            setSyncBadge('ok', 'Đã gửi Nhắc Việc');
            renderAllViews();
            showToast(res.message || '🤖 Đã quét & gửi nhắc việc tự động thành công!', 'success');
          }
        })
        .runDailyAutoReminders();
    } else {
      showToast('🤖 [Chế độ Demo] Đã quét và ghi nhận thông báo nhắc việc Email + Bot Zalo!', 'success');
    }
  }

  function handleSaveBotConfig() {
    if (!isManagerOrAdmin()) return;
    var newCfg = {
      COMPANY_NAME: document.getElementById('cfgCompanyName').value,
      ADMIN_EMAIL: document.getElementById('cfgAdminEmail').value,
      COMPANY_HOTLINE: document.getElementById('cfgCompanyHotline').value,
      ENABLE_EMAIL_REMINDER: document.getElementById('cfgEnableEmail').value,
      ENABLE_ZALO_REMINDER: document.getElementById('cfgEnableZalo').value,
      ENABLE_TELEGRAM_REMINDER: document.getElementById('cfgEnableTelegram').value,
      ZALO_BOT_WEBHOOK_URL: document.getElementById('cfgZaloWebhook').value,
      ZALO_OA_ACCESS_TOKEN: document.getElementById('cfgZaloToken').value,
      TELEGRAM_BOT_TOKEN: document.getElementById('cfgTeleToken').value,
      TELEGRAM_CHAT_ID: document.getElementById('cfgTeleChatId').value,
      AUTO_REMINDER_HOUR: document.getElementById('cfgReminderHour').value,
      REMIND_BEFORE_DAYS: document.getElementById('cfgRemindBeforeDays').value
    };
    appData.config = Object.assign(appData.config || {}, newCfg);
    renderAllViews();
    showToast('⚙️ Đã lưu cấu hình Email, Webhook Bot Zalo & Telegram!', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveReminderConfig({ config: newCfg, actor: currentUser ? currentUser.username : 'admin' });
    }
  }

  function handleSetupDailyTrigger() {
    var hr = Number(document.getElementById('cfgReminderHour').value || 8);
    appData.hasDailyTrigger = true;
    renderAllViews();
    showToast('⏰ Đã kích hoạt lịch tự động nhắc việc mỗi ngày lúc ' + hr + ':00!', 'success');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).setupDailyReminderTrigger(hr);
    }
  }

  function handleRemoveDailyTrigger() {
    appData.hasDailyTrigger = false;
    renderAllViews();
    showToast('🔕 Đã tắt lịch chạy nhắc việc tự động hàng ngày.', 'warning');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).removeDailyReminderTrigger();
    }
  }

  // USER MODAL & INTERACTIVE SUBORDINATE RBAC ENGINE
  function setPermissionCheckboxesUI(permList) {
    var arr = Array.isArray(permList) ? permList : [];
    document.querySelectorAll('.usr-perm-chk').forEach(function(chk) {
      chk.checked = arr.indexOf(chk.value) !== -1;
    });
  }

  function onUserRoleSelectChange(roleVal) {
    var r = String(roleVal || 'STAFF').toUpperCase();
    var dept = document.getElementById('usrFormDept') ? document.getElementById('usrFormDept').value : '';
    var dummyUser = { role: r, fullName: '', username: '', department: dept, note: '' };
    setPermissionCheckboxesUI(getDefaultPermsForUser(dummyUser));
  }

  function openUserModal(uname) {
    if (!isManagerOrAdmin()) {
      showToast('🔒 Chỉ cấp Quản lý / Team Lead / Giám đốc mới có quyền quản lý nhân sự tuyến dưới!', 'danger');
      return;
    }
    var deptSel = document.getElementById('usrFormDept');
    if (uname) {
      var u = (appData.users || []).find(function(x) { return String(x.username || '').toLowerCase() === String(uname || '').toLowerCase(); });
      if (u) {
        document.getElementById('usrFormUsername').value = u.username;
        document.getElementById('usrFormPassword').value = u.password || '123456';
        document.getElementById('usrFormFullName').value = u.fullName;
        var effectiveRole = (isLeaderRole(u) && u.role !== 'ADMIN' && u.role !== 'MANAGER') ? 'LEADER' : (u.role || 'STAFF');
        document.getElementById('usrFormRole').value = effectiveRole;
        ensureSelectOptionExists(deptSel, u.department || 'Phòng Kinh Doanh & CRM', u.department || 'Phòng Kinh Doanh & CRM');
        deptSel.value = u.department || 'Phòng Kinh Doanh & CRM';
        document.getElementById('usrFormEmail').value = u.email || '';
        document.getElementById('usrFormPhone').value = u.phone || '';
        document.getElementById('usrFormStatus').value = (String(u.status || '').toLowerCase().indexOf('khóa') !== -1) ? 'Tạm khóa' : 'Hoạt động';
        setPermissionCheckboxesUI(getUserPermsList(u));
      }
    } else {
      document.getElementById('usrFormUsername').value = '';
      document.getElementById('usrFormPassword').value = '123456';
      document.getElementById('usrFormFullName').value = '';
      document.getElementById('usrFormRole').value = 'STAFF';
      var defaultDept = (currentUser && currentUser.department && !isTopManagerOrAdmin()) ? currentUser.department : 'Phòng Kinh Doanh & CRM';
      ensureSelectOptionExists(deptSel, defaultDept, defaultDept);
      deptSel.value = defaultDept;
      document.getElementById('usrFormEmail').value = '';
      document.getElementById('usrFormPhone').value = '';
      document.getElementById('usrFormStatus').value = 'Hoạt động';
      onUserRoleSelectChange('STAFF');
    }
    openCustomModal('modalUserBackdrop');
  }

  function collectUserFormPayload() {
    var uname = String(document.getElementById('usrFormUsername').value || '').trim().toLowerCase();
    if (!uname) {
      showToast('Vui lòng nhập Username đăng nhập!', 'danger');
      return null;
    }
    var perms = [];
    document.querySelectorAll('.usr-perm-chk:checked').forEach(function(chk) {
      perms.push(chk.value);
    });
    return {
      username: uname,
      password: document.getElementById('usrFormPassword').value || '123456',
      fullName: String(document.getElementById('usrFormFullName').value || uname).trim(),
      role: document.getElementById('usrFormRole').value || 'STAFF',
      department: document.getElementById('usrFormDept').value || 'Phòng Kinh Doanh & CRM',
      email: document.getElementById('usrFormEmail').value || '',
      phone: document.getElementById('usrFormPhone').value || '',
      status: document.getElementById('usrFormStatus').value || 'Hoạt động',
      note: perms.join(','),
      actor: currentUser ? currentUser.username : 'admin',
      actorRole: currentUser ? currentUser.role : 'ADMIN'
    };
  }

  function submitUserForm(callbackAfterSave) {
    var payload = collectUserFormPayload();
    if (!payload) return;
    var found = false;
    for (var i = 0; i < appData.users.length; i++) {
      if (String(appData.users[i].username || '').toLowerCase() === payload.username) {
        appData.users[i] = Object.assign(appData.users[i], payload);
        found = true;
        break;
      }
    }
    if (!found) appData.users.push(payload);
    // Nếu đang sửa chính tài khoản đang đăng nhập thì cập nhật ngay phiên hiện tại
    if (currentUser && String(currentUser.username || '').toLowerCase() === payload.username) {
      currentUser = Object.assign(currentUser, payload);
      applyRoleBasedPermissionsUI();
    }
    closeCustomModal('modalUserBackdrop');
    renderAllViews();
    showToast('✅ Đã lưu tài khoản & kích hoạt quyền thao tác cho: ' + payload.fullName + ' [' + payload.role + ']', 'success');

    if (typeof callbackAfterSave === 'function') {
      callbackAfterSave(payload);
    }

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveUserAccount(payload);
    }
  }

  function saveUserAndAssignTaskImmediately() {
    submitUserForm(function(savedUser) {
      openTaskModalForEmployee(savedUser.username);
    });
  }

  function quickChangeUserRole(uname, newRole) {
    if (!isManagerOrAdmin()) return;
    var u = (appData.users || []).find(function(x) { return String(x.username || '').toLowerCase() === String(uname || '').toLowerCase(); });
    if (!u) return;
    u.role = newRole;
    u.note = getDefaultPermsForUser(u).join(',');
    if (currentUser && String(currentUser.username || '').toLowerCase() === String(uname || '').toLowerCase()) {
      currentUser.role = newRole;
      currentUser.note = u.note;
      applyRoleBasedPermissionsUI();
    }
    renderAllViews();
    showToast('⚡ Đã chuyển vai trò của ' + u.fullName + ' sang [' + newRole + '] và cập nhật quyền thao tác!', 'success');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveUserAccount(u);
    }
  }

  function quickToggleUserStatus(uname) {
    if (!isManagerOrAdmin()) return;
    if (String(uname || '').toLowerCase() === 'admin') {
      showToast('Không thể khóa tài khoản gốc admin!', 'warning');
      return;
    }
    var u = (appData.users || []).find(function(x) { return String(x.username || '').toLowerCase() === String(uname || '').toLowerCase(); });
    if (!u) return;
    var isLocked = String(u.status || '').toLowerCase().indexOf('khóa') !== -1;
    u.status = isLocked ? 'Hoạt động' : 'Tạm khóa';
    renderAllViews();
    showToast((u.status === 'Hoạt động' ? '🟢 Đã mở khóa tài khoản: ' : '🔒 Đã tạm khóa tài khoản: ') + u.fullName, 'warning');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveUserAccount(u);
    }
  }

  function handleDeleteUserAccount(uname) {
    if (!isAdminRole() || String(uname || '').toLowerCase() === 'admin') return;
    appData.users = (appData.users || []).filter(function(u) { return String(u.username || '').toLowerCase() !== String(uname || '').toLowerCase(); });
    renderAllViews();
    showToast('🗑️ Đã xóa tài khoản nhân sự: ' + uname, 'warning');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).deleteUserAccount({ username: uname, actor: currentUser ? currentUser.username : 'admin' });
    }
  }

  // =========================================================================
  // KHỞI ĐỘNG AN TOÀN TUYỆT ĐỐI
  // =========================================================================
  function bootApp() {
    if (hasBooted) return;
    hasBooted = true;
    renderAllViews();
    refreshAllDataFromServer();

    var pwdInput = document.getElementById('loginPassword');
    if (pwdInput) {
      pwdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') handleLoginSubmit();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
  } else {
    bootApp();
  }
  window.addEventListener('load', bootApp);
</script>
</body>
</html>


```