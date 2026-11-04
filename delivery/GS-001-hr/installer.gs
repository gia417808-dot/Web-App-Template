/**
 * ============================================================================
 * GS-001: HỆ THỐNG QUẢN LÝ NHÂN SỰ, CHẤM CÔNG, ĐƠN TỪ, KPI & TÍNH LƯƠNG TỰ ĐỘNG
 * Phiên bản: v4.0 Commercial Pro (Full-Screen, Multi-Tier RBAC, File Upload & Auto Payslip Bot)
 * File: installer.gs — Khởi tạo tự động 8 Bảng Dữ Liệu Chuẩn Doanh Nghiệp
 * ============================================================================
 */

function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('👥 HỆ THỐNG NHÂN SỰ & TIỀN LƯƠNG (GS-001 PRO)')
      .addItem('🚀 1. Khởi tạo / Làm mới Database Nhân Sự & Bảng Lương (8 Sheets)', 'setupHrDatabase')
      .addSeparator()
      .addItem('💰 2. Tính lại Bảng Lương Tháng Hiện Tại Tự Động', 'recalculateCurrentMonthPayroll')
      .addItem('📨 3. Gửi Phiếu Lương (Payslip) Hàng Loạt Qua Email & Bot Zalo', 'sendBatchPayslipNotifications')
      .addToUi();
  } catch (e) {}
}

function setupHrDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Không tìm thấy Google Sheets đang mở!');

  var requiredTabs = [
    'CAU_HINH',
    'PHAN_QUYEN',
    'HO_SO_NHAN_SU',
    'CHAM_CONG',
    'DON_TU_NGHI_PHEP',
    'BANG_LUONG_THANG',
    'DANH_GIA_KPI',
    'NHAT_KY_HE_THONG'
  ];

  requiredTabs.forEach(function(tabName) {
    var sh = ss.getSheetByName(tabName);
    if (!sh) {
      sh = ss.insertSheet(tabName);
    } else {
      sh.clear();
    }
  });

  var today = new Date();
  var curMonthStr = Utilities.formatDate(today, 'Asia/Ho_Chi_Minh', 'yyyy-MM');
  function fmtDateOffset(days) {
    var d = new Date(today.getTime() + days * 86400000);
    return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }

  // =========================================================================
  // 1. TAB CAU_HINH (CẤU HÌNH CÔNG TY, ĐỊNH MỨC BHXH/THUẾ & BOT EMAIL/ZALO)
  // =========================================================================
  var shCfg = ss.getSheetByName('CAU_HINH');
  shCfg.getRange('A1:D1').merge().setValue('⚙️ CẤU HÌNH HỆ THỐNG NHÂN SỰ, CHẤM CÔNG, ĐỊNH MỨC BHXH/THUẾ & BOT GỬI PHIẾU LƯƠNG (v4.0 PRO)')
    .setBackground('#0F172A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shCfg.setRowHeight(1, 36);

  var cfgHeaders = [['MÃ THAM SỐ (KEY)', 'GIÁ TRỊ CÀI ĐẶT (VALUE)', 'NHÓM CẤU HÌNH', 'MÔ TẢ CHI TIẾT']];
  shCfg.getRange('A2:D2').setValues(cfgHeaders).setBackground('#1E293B').setFontColor('#FFFFFF').setFontWeight('bold');

  var cfgData = [
    ['COMPANY_NAME', 'CÔNG TY CỔ PHẦN CÔNG NGHỆ & GIẢI PHÁP SỐ NOVA-HR', 'DOANH_NGHIEP', 'Tên doanh nghiệp hiển thị trên Topbar và Phiếu lương A4'],
    ['COMPANY_TAX_CODE', '0316889900', 'DOANH_NGHIEP', 'Mã số thuế doanh nghiệp'],
    ['COMPANY_HOTLINE', '0909.888.999', 'DOANH_NGHIEP', 'Số điện thoại Phòng Hành chính - Nhân sự (HR)'],
    ['ADMIN_EMAIL', 'hr.admin@novahr.vn', 'DOANH_NGHIEP', 'Email Trưởng phòng Nhân sự / Ban Giám Đốc nhận báo cáo'],
    ['CURRENT_PAYROLL_PERIOD', curMonthStr, 'CHAM_CONG_LUONG', 'Kỳ tính lương hiện tại (Định dạng YYYY-MM)'],
    ['STANDARD_WORK_DAYS', '26', 'CHAM_CONG_LUONG', 'Số ngày công chuẩn trong tháng (Mặc định: 26 công)'],
    ['BHXH_EMP_RATE', '10.5', 'CHAM_CONG_LUONG', 'Tỷ lệ trích BHXH + BHYT + BHTN người lao động đóng (10.5%)'],
    ['BHXH_COMP_RATE', '21.5', 'CHAM_CONG_LUONG', 'Tỷ lệ BHXH + BHYT + BHTN doanh nghiệp đóng (21.5%)'],
    ['PERSONAL_DEDUCTION', '11000000', 'CHAM_CONG_LUONG', 'Mức giảm trừ gia cảnh bản thân tính thuế TNCN (11.000.000đ)'],
    ['DEPENDENT_DEDUCTION', '4400000', 'CHAM_CONG_LUONG', 'Mức giảm trừ mỗi người phụ thuộc (4.400.000đ/người)'],
    ['OT_HOURLY_RATE_MULTIPLIER', '1.5', 'CHAM_CONG_LUONG', 'Hệ số nhân lương làm thêm giờ (Tăng ca OT ngày thường: 150%)'],
    ['ENABLE_EMAIL_NOTIFICATION', 'TRUE', 'BOT_THONG_BAO', 'Bật gửi Phiếu lương & Thông báo duyệt đơn qua Gmail (TRUE/FALSE)'],
    ['ENABLE_ZALO_BOT', 'TRUE', 'BOT_THONG_BAO', 'Bật bắn thông báo qua Webhook Bot Zalo OA / ZNS (TRUE/FALSE)'],
    ['ZALO_BOT_WEBHOOK_URL', 'https://webhook.site/zalo-hr-payslip-demo', 'BOT_THONG_BAO', 'URL Webhook nhận sự kiện gửi Phiếu lương & Duyệt đơn từ Zalo'],
    ['ENABLE_TELEGRAM_BOT', 'TRUE', 'BOT_THONG_BAO', 'Bật bắn thông báo qua Telegram Bot (TRUE/FALSE)'],
    ['TELEGRAM_BOT_TOKEN', '', 'BOT_THONG_BAO', 'Token Bot Telegram nhận thông báo HR'],
    ['TELEGRAM_CHAT_ID', '', 'BOT_THONG_BAO', 'Chat ID nhóm HR / Quản lý trên Telegram']
  ];
  shCfg.getRange(3, 1, cfgData.length, 4).setValues(cfgData);
  shCfg.setColumnWidth(1, 240);
  shCfg.setColumnWidth(2, 340);
  shCfg.setColumnWidth(3, 160);
  shCfg.setColumnWidth(4, 420);

  // =========================================================================
  // 2. TAB PHAN_QUYEN (RBAC 4 CẤP: ADMIN / HR_MANAGER / LEADER / STAFF)
  // =========================================================================
  var shAuth = ss.getSheetByName('PHAN_QUYEN');
  shAuth.getRange('A1:J1').merge().setValue('🔐 DANH SÁCH TÀI KHOẢN ĐĂNG NHẬP & MA TRẬN PHÂN QUYỀN THAO TÁC TRÊN APP (RBAC v4.0)')
    .setBackground('#991B1B').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shAuth.setRowHeight(1, 36);

  var authHeaders = [[
    'USERNAME', 'MẬT KHẨU / PIN', 'MÃ NV LIÊN KẾT', 'HỌ VÀ TÊN', 'VAI TRÒ (ROLE)',
    'PHÒNG BAN TRỰC THUỘC', 'EMAIL NHẬN PHIẾU LƯƠNG', 'SĐT ZALO', 'TRẠNG THÁI', 'QUYỀN HẠN APP (PERMISSIONS)'
  ]];
  shAuth.getRange('A2:J2').setValues(authHeaders).setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold');

  var authData = [
    ['admin', '123456', 'NV-001', 'Nguyễn Quản Trị (CEO)', 'ADMIN', 'Ban Giám Đốc', 'ceo@novahr.vn', '0901234567', 'Hoạt động', 'MANAGE_HR,APPROVE_LEAVE_OT,MANAGE_PAYROLL,EVALUATE_KPI,VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE'],
    ['hr_mgr', '123456', 'NV-002', 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', 'HR_MANAGER', 'Phòng Hành Chính - Nhân Sự', 'ha.hr@novahr.vn', '0902345678', 'Hoạt động', 'MANAGE_HR,APPROVE_LEAVE_OT,MANAGE_PAYROLL,EVALUATE_KPI,VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE'],
    ['tech_lead', '123456', 'NV-003', 'Phạm Tuấn Kiệt (Tech Lead)', 'LEADER', 'Khối Kỹ Thuật & Công Nghệ', 'kiet.dev@novahr.vn', '0903456789', 'Hoạt động', 'APPROVE_LEAVE_OT,EVALUATE_KPI,VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE'],
    ['sale_lead', '123456', 'NV-004', 'Lê Minh Thư (Leader Kinh Doanh)', 'LEADER', 'Phòng Kinh Doanh & CRM', 'thu.sale@novahr.vn', '0904567890', 'Hoạt động', 'APPROVE_LEAVE_OT,EVALUATE_KPI,VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE'],
    ['nv_anh', '123456', 'NV-005', 'Võ Ngọc Ánh (Chuyên viên UI/UX)', 'STAFF', 'Khối Kỹ Thuật & Công Nghệ', 'anh.design@novahr.vn', '0905678901', 'Hoạt động', 'VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE'],
    ['nv_minh', '666666', 'NV-006', 'Hoàng Minh (Chuyên viên Sale)', 'STAFF', 'Phòng Kinh Doanh & CRM', 'minh.sale@novahr.vn', '0906789012', 'Hoạt động', 'VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE']
  ];
  shAuth.getRange(3, 1, authData.length, 10).setValues(authData);
  shAuth.getRange(3, 2, authData.length, 1).setNumberFormat('@');
  shAuth.getRange(3, 8, authData.length, 1).setNumberFormat('@');
  for (var ca = 1; ca <= 10; ca++) shAuth.setColumnWidth(ca, 165);

  // =========================================================================
  // 3. TAB HO_SO_NHAN_SU (DANH BẠ NHÂN SỰ, HỢP ĐỒNG, MỨC LƯƠNG & FILE HỒ SƠ)
  // =========================================================================
  var shEmp = ss.getSheetByName('HO_SO_NHAN_SU');
  shEmp.getRange('A1:Q1').merge().setValue('👥 DANH SÁCH HỒ SƠ NHÂN SỰ, HỢP ĐỒNG LAO ĐỘNG, ĐỊNH MỨC LƯƠNG & TÀI LIỆU ĐÍNH KÈM')
    .setBackground('#1E3A8A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shEmp.setRowHeight(1, 36);

  var empHeaders = [[
    'MÃ NV', 'HỌ VÀ TÊN', 'PHÒNG BAN', 'CHỨC VỤ', 'CẤP BẬC (ROLE)',
    'SĐT ZALO', 'EMAIL CÁ NHÂN / CÔNG TY', 'NGÀY VÀO LÀM', 'LOẠI HỢP ĐỒNG', 'HẠN HỢP ĐỒNG',
    'LƯƠNG CƠ BẢN (VNĐ)', 'LƯƠNG ĐÓNG BHXH (VNĐ)', 'PHỤ CẤP ĐỊNH MỨC (ĂN/XĂNG/ĐT)', 'SỐ NGƯỜI PHỤ THUỘC',
    'SỐ TK NGÂN HÀNG', 'TRẠNG THÁI LÀM VIỆC', 'HỒ SƠ ĐÍNH KÈM (WORD/EXCEL/PDF/CCCD)'
  ]];
  shEmp.getRange('A2:Q2').setValues(empHeaders).setBackground('#1D4ED8').setFontColor('#FFFFFF').setFontWeight('bold');

  var empData = [
    [
      'NV-001', 'Nguyễn Quản Trị (CEO)', 'Ban Giám Đốc', 'Tổng Giám Đốc (CEO)', 'ADMIN',
      '0901234567', 'ceo@novahr.vn', '2021-01-10', 'Không xác định thời hạn', '2099-12-31',
      45000000, 20000000, 5000000, 2, '1903888999901 - Techcombank', 'Đang làm việc',
      JSON.stringify([
        { id: 'DOC-01', name: 'Quyet_Dinh_Bo_Nhiem_CEO.pdf', ext: 'pdf', size: '1.2 MB', url: 'https://drive.google.com', uploadedBy: 'HR Admin', uploadedAt: fmtDateOffset(-90) }
      ])
    ],
    [
      'NV-002', 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', 'Phòng Hành Chính - Nhân Sự', 'Giám Đốc Nhân Sự (HRD)', 'HR_MANAGER',
      '0902345678', 'ha.hr@novahr.vn', '2022-03-01', 'Hợp đồng 36 tháng', fmtDateOffset(180),
      28000000, 15000000, 3000000, 1, '1903888999902 - Techcombank', 'Đang làm việc',
      JSON.stringify([
        { id: 'DOC-02', name: 'Hop_Dong_Lao_Dong_NV002_Signed.pdf', ext: 'pdf', size: '950 KB', url: 'https://drive.google.com', uploadedBy: 'Trần Thanh Hà', uploadedAt: fmtDateOffset(-60) },
        { id: 'DOC-03', name: 'Quy_Che_Luong_Thuong_KPI_2025.docx', ext: 'docx', size: '480 KB', url: 'https://docs.google.com/document', uploadedBy: 'Trần Thanh Hà', uploadedAt: fmtDateOffset(-30) }
      ])
    ],
    [
      'NV-003', 'Phạm Tuấn Kiệt (Tech Lead)', 'Khối Kỹ Thuật & Công Nghệ', 'Trưởng Nhóm Kỹ Thuật (Tech Lead)', 'LEADER',
      '0903456789', 'kiet.dev@novahr.vn', '2022-06-15', 'Hợp đồng 24 tháng', fmtDateOffset(15),
      26000000, 14000000, 2500000, 1, '0071000888903 - Vietcombank', 'Đang làm việc',
      JSON.stringify([
        { id: 'DOC-04', name: 'HDLD_PhamTuanKiet_TechLead.pdf', ext: 'pdf', size: '1.1 MB', url: 'https://drive.google.com', uploadedBy: 'Trần Thanh Hà', uploadedAt: fmtDateOffset(-40) },
        { id: 'DOC-05', name: 'Bang_Mo_Ta_Cong_Viec_TechLead.docx', ext: 'docx', size: '310 KB', url: 'https://docs.google.com/document', uploadedBy: 'Trần Thanh Hà', uploadedAt: fmtDateOffset(-40) }
      ])
    ],
    [
      'NV-004', 'Lê Minh Thư (Leader Kinh Doanh)', 'Phòng Kinh Doanh & CRM', 'Trưởng Nhóm Kinh Doanh (Sales Lead)', 'LEADER',
      '0904567890', 'thu.sale@novahr.vn', '2022-08-01', 'Hợp đồng 24 tháng', fmtDateOffset(120),
      22000000, 12000000, 2500000, 1, '10288899904 - VietinBank', 'Đang làm việc',
      JSON.stringify([
        { id: 'DOC-06', name: 'HDLD_LeMinhThu_SalesLead.pdf', ext: 'pdf', size: '880 KB', url: 'https://drive.google.com', uploadedBy: 'Trần Thanh Hà', uploadedAt: fmtDateOffset(-50) }
      ])
    ],
    [
      'NV-005', 'Võ Ngọc Ánh (Chuyên viên UI/UX)', 'Khối Kỹ Thuật & Công Nghệ', 'Chuyên Viên Thiết Kế UI/UX', 'STAFF',
      '0905678901', 'anh.design@novahr.vn', '2023-04-10', 'Hợp đồng 12 tháng', fmtDateOffset(10),
      16500000, 10000000, 1800000, 0, '88899905 - ACB', 'Đang làm việc',
      JSON.stringify([
        { id: 'DOC-07', name: 'CV_Portfolio_VoNgocAnh.pdf', ext: 'pdf', size: '2.4 MB', url: 'https://drive.google.com', uploadedBy: 'Võ Ngọc Ánh', uploadedAt: fmtDateOffset(-20) }
      ])
    ],
    [
      'NV-006', 'Hoàng Minh (Chuyên viên Sale)', 'Phòng Kinh Doanh & CRM', 'Chuyên Viên Tư Vấn B2B', 'STAFF',
      '0906789012', 'minh.sale@novahr.vn', '2024-02-01', 'Hợp đồng 12 tháng', fmtDateOffset(90),
      14000000, 9000000, 1500000, 0, '88899906 - MB Bank', 'Đang làm việc',
      JSON.stringify([
        { id: 'DOC-08', name: 'Ho_So_Nhan_Su_HoangMinh.docx', ext: 'docx', size: '390 KB', url: 'https://docs.google.com/document', uploadedBy: 'Hoàng Minh', uploadedAt: fmtDateOffset(-10) }
      ])
    ]
  ];
  shEmp.getRange(3, 1, empData.length, 17).setValues(empData);
  shEmp.getRange(3, 6, empData.length, 1).setNumberFormat('@');
  shEmp.getRange(3, 11, empData.length, 3).setNumberFormat('#,##0');
  for (var ce = 1; ce <= 17; ce++) shEmp.setColumnWidth(ce, 160);
  shEmp.setColumnWidth(2, 220);
  shEmp.setColumnWidth(17, 280);

  // =========================================================================
  // 4. TAB CHAM_CONG (NHẬT KÝ CHẤM CÔNG VÀO/RA CA, OT & HÌNH THỨC LÀM VIỆC)
  // =========================================================================
  var shAtt = ss.getSheetByName('CHAM_CONG');
  shAtt.getRange('A1:M1').merge().setValue('🕒 NHẬT KÝ CHẤM CÔNG HÀNG NGÀY, CA LÀM VIỆC, GIỜ TĂNG CA (OT) & VỊ TRÍ LÀM VIỆC')
    .setBackground('#0F766E').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shAtt.setRowHeight(1, 36);

  var attHeaders = [[
    'MÃ CC', 'NGÀY CHẤM CÔNG', 'MÃ NV', 'HỌ VÀ TÊN', 'PHÒNG BAN',
    'CA LÀM VIỆC', 'GIỜ VÀO (CHECK-IN)', 'GIỜ RA (CHECK-OUT)', 'SỐ CÔNG TÍNH LƯƠNG',
    'SỐ GIỜ TĂNG CA (OT)', 'HÌNH THỨC LÀM VIỆC', 'TRẠNG THÁI CHẤM CÔNG', 'GHI CHÚ / ĐỊA ĐIỂM'
  ]];
  shAtt.getRange('A2:M2').setValues(attHeaders).setBackground('#115E59').setFontColor('#FFFFFF').setFontWeight('bold');

  var attData = [
    ['CC-1001', fmtDateOffset(0), 'NV-001', 'Nguyễn Quản Trị (CEO)', 'Ban Giám Đốc', 'Ca Hành Chính (08:00 - 17:30)', '07:50', '18:00', 1.0, 0, 'Văn phòng Công ty', 'Đúng giờ (Đủ công)', 'Điều hành họp giao ban đầu tuần'],
    ['CC-1002', fmtDateOffset(0), 'NV-002', 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', 'Phòng Hành Chính - Nhân Sự', 'Ca Hành Chính (08:00 - 17:30)', '07:55', '17:45', 1.0, 1.5, 'Văn phòng Công ty', 'Đúng giờ + Tăng ca', 'Chốt bảng lương & rà soát hợp đồng nhân sự'],
    ['CC-1003', fmtDateOffset(0), 'NV-003', 'Phạm Tuấn Kiệt (Tech Lead)', 'Khối Kỹ Thuật & Công Nghệ', 'Ca Hành Chính (08:00 - 17:30)', '08:00', '19:30', 1.0, 2.0, 'Văn phòng Công ty', 'Đúng giờ + Tăng ca', 'Release bản cập nhật hệ thống Web App v4.0'],
    ['CC-1004', fmtDateOffset(0), 'NV-004', 'Lê Minh Thư (Leader Kinh Doanh)', 'Phòng Kinh Doanh & CRM', 'Ca Hành Chính (08:00 - 17:30)', '07:58', '18:30', 1.0, 1.0, 'Đi gặp Khách hàng (Thị trường)', 'Đúng giờ + Công tác', 'Họp ký hợp đồng cùng đối tác B2B SunLand'],
    ['CC-1005', fmtDateOffset(0), 'NV-005', 'Võ Ngọc Ánh (Chuyên viên UI/UX)', 'Khối Kỹ Thuật & Công Nghệ', 'Ca Hành Chính (08:00 - 17:30)', '08:05', '17:35', 1.0, 1.5, 'Văn phòng Công ty', 'Đúng giờ + Tăng ca', 'Thiết kế bộ giao diện Mobile HR Portal'],
    ['CC-1006', fmtDateOffset(0), 'NV-006', 'Hoàng Minh (Chuyên viên Sale)', 'Phòng Kinh Doanh & CRM', 'Ca Hành Chính (08:00 - 17:30)', '08:02', '17:30', 1.0, 1.0, 'Văn phòng Công ty', 'Đúng giờ (Đủ công)', 'Gọi tư vấn 15 khách hàng tiềm năng mới'],
    ['CC-1007', fmtDateOffset(-1), 'NV-003', 'Phạm Tuấn Kiệt (Tech Lead)', 'Khối Kỹ Thuật & Công Nghệ', 'Ca Hành Chính (08:00 - 17:30)', '07:55', '20:00', 1.0, 2.5, 'Văn phòng Công ty', 'Đúng giờ + Tăng ca', 'Tối ưu hiệu năng Database & bảo mật phân quyền'],
    ['CC-1008', fmtDateOffset(-1), 'NV-005', 'Võ Ngọc Ánh (Chuyên viên UI/UX)', 'Khối Kỹ Thuật & Công Nghệ', 'Ca Linh Hoạt / WFH', '08:00', '17:30', 1.0, 0, 'Làm việc từ xa (WFH)', 'Đúng giờ (Đủ công)', 'Hoàn thiện Prototype Figma & xuất tài liệu PDF'],
    ['CC-1009', fmtDateOffset(-1), 'NV-006', 'Hoàng Minh (Chuyên viên Sale)', 'Phòng Kinh Doanh & CRM', 'Ca Hành Chính (08:00 - 17:30)', '07:59', '18:30', 1.0, 1.0, 'Đi gặp Khách hàng (Thị trường)', 'Đúng giờ + Tăng ca', 'Demo giải pháp trực tiếp tại văn phòng khách hàng']
  ];
  shAtt.getRange(3, 1, attData.length, 13).setValues(attData);
  shAtt.getRange(3, 2, attData.length, 1).setNumberFormat('@');
  for (var ct = 1; ct <= 13; ct++) shAtt.setColumnWidth(ct, 155);

  // =========================================================================
  // 5. TAB DON_TU_NGHI_PHEP (ĐƠN XIN NGHỈ PHÉP, ĐĂNG KÝ TĂNG CA OT, GIẢI TRÌNH)
  // =========================================================================
  var shLeave = ss.getSheetByName('DON_TU_NGHI_PHEP');
  shLeave.getRange('A1:N1').merge().setValue('📝 QUẢN LÝ & PHÊ DUYỆT ĐƠN TỪ (XIN NGHỈ PHÉP, ĐĂNG KÝ TĂNG CA OT, CÔNG TÁC, GIẢI TRÌNH CÔNG)')
    .setBackground('#7C2D12').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shLeave.setRowHeight(1, 36);

  var leaveHeaders = [[
    'MÃ ĐƠN', 'NGÀY GỬI ĐƠN', 'MÃ NV', 'HỌ VÀ TÊN', 'PHÒNG BAN',
    'LOẠI ĐƠN TỪ', 'TỪ NGÀY', 'ĐẾN NGÀY', 'SỐ NGÀY NGHỈ / GIỜ OT',
    'LÝ DO & NỘI DUNG BÀN GIAO', 'TRẠNG THÁI DUYỆT', 'NGƯỜI PHÊ DUYỆT',
    'GHI CHÚ PHÊ DUYỆT', 'TỆP CHỨNG TỪ ĐÍNH KÈM (WORD/PDF/ẢNH)'
  ]];
  shLeave.getRange('A2:N2').setValues(leaveHeaders).setBackground('#9A3412').setFontColor('#FFFFFF').setFontWeight('bold');

  var leaveData = [
    [
      'DT-201', fmtDateOffset(-2), 'NV-005', 'Võ Ngọc Ánh (Chuyên viên UI/UX)', 'Khối Kỹ Thuật & Công Nghệ',
      'Đăng ký Tăng ca (OT)', fmtDateOffset(0), fmtDateOffset(0), 3.0,
      'Đăng ký làm thêm 3 giờ tối để hoàn tất bộ tài liệu UI/UX bàn giao khách hàng', 'Chờ duyệt', 'Phạm Tuấn Kiệt (Tech Lead)',
      'Đang chờ Tech Lead hoặc HR phê duyệt',
      JSON.stringify([
        { id: 'ATT-L1', name: 'Ke_Hoach_Tang_Ca_UIUX.docx', ext: 'docx', size: '240 KB', url: 'https://docs.google.com/document', uploadedBy: 'Võ Ngọc Ánh', uploadedAt: fmtDateOffset(-2) }
      ])
    ],
    [
      'DT-202', fmtDateOffset(-1), 'NV-006', 'Hoàng Minh (Chuyên viên Sale)', 'Phòng Kinh Doanh & CRM',
      'Đơn xin Nghỉ phép năm (Có hưởng lương)', fmtDateOffset(2), fmtDateOffset(2), 1.0,
      'Xin nghỉ phép năm 1 ngày giải quyết việc gia đình, đã bàn giao giỏ khách hàng cho chị Lê Minh Thư', 'Chờ duyệt', 'Lê Minh Thư (Leader Kinh Doanh)',
      'Đang chờ Leader Kinh Doanh hoặc HR duyệt',
      JSON.stringify([
        { id: 'ATT-L2', name: 'Bien_Ban_Ban_Giao_Khach_Hang_Tam_Thoi.xlsx', ext: 'xlsx', size: '195 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Hoàng Minh', uploadedAt: fmtDateOffset(-1) }
      ])
    ],
    [
      'DT-203', fmtDateOffset(-5), 'NV-003', 'Phạm Tuấn Kiệt (Tech Lead)', 'Khối Kỹ Thuật & Công Nghệ',
      'Đăng ký Tăng ca (OT)', fmtDateOffset(-4), fmtDateOffset(-3), 6.0,
      'Trực nâng cấp Server & triển khai hệ thống bảo mật dữ liệu ca tối', 'Đã duyệt', 'Trần Thanh Hà (GĐ Nhân Sự - HRD)',
      'Đã nghiệm thu hoàn thành tốt, tính 150% lương OT vào kỳ lương tháng',
      JSON.stringify([
        { id: 'ATT-L3', name: 'Bao_Cao_Nghiem_Thu_Server_OT.pdf', ext: 'pdf', size: '680 KB', url: 'https://drive.google.com', uploadedBy: 'Phạm Tuấn Kiệt', uploadedAt: fmtDateOffset(-3) }
      ])
    ],
    [
      'DT-204', fmtDateOffset(-6), 'NV-004', 'Lê Minh Thư (Leader Kinh Doanh)', 'Phòng Kinh Doanh & CRM',
      'Đơn đăng ký Đi công tác / Gặp khách B2B', fmtDateOffset(-5), fmtDateOffset(-4), 2.0,
      'Công tác làm việc trực tiếp và ký hợp đồng với Tập đoàn SunLand', 'Đã duyệt', 'Nguyễn Quản Trị (CEO)',
      'Duyệt 100% công chính thức + phụ cấp công tác phí',
      JSON.stringify([])
    ]
  ];
  shLeave.getRange(3, 1, leaveData.length, 14).setValues(leaveData);
  for (var cl = 1; cl <= 14; cl++) shLeave.setColumnWidth(cl, 160);
  shLeave.setColumnWidth(10, 260);

  // =========================================================================
  // 6. TAB DANH_GIA_KPI (ĐÁNH GIÁ HIỆU SUẤT KPI & THƯỞNG NĂNG SUẤT)
  // =========================================================================
  var shKpi = ss.getSheetByName('DANH_GIA_KPI');
  shKpi.getRange('A1:M1').merge().setValue('🏆 BẢNG ĐÁNH GIÁ HIỆU SUẤT KPI / OKR CÁ NHÂN & TÍNH THƯỞNG NĂNG SUẤT THÁNG')
    .setBackground('#4C1D95').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shKpi.setRowHeight(1, 36);

  var kpiHeaders = [[
    'MÃ KPI', 'KỲ ĐÁNH GIÁ', 'MÃ NV', 'HỌ VÀ TÊN', 'PHÒNG BAN',
    'CHỈ TIÊU / HẠNG MỤC KPI', 'TRỌNG SỐ (%)', 'TIẾN ĐỘ ĐẠT ĐƯỢC (%)', 'ĐIỂM KPI QUY ĐỔI',
    'XẾP LOẠI KPI', 'MỨC THƯỞNG KPI (VNĐ)', 'TRẠNG THÁI NGHIỆM THU', 'GHI CHÚ & FILE BÁO CÁO ĐÍNH KÈM'
  ]];
  shKpi.getRange('A2:M2').setValues(kpiHeaders).setBackground('#5B21B6').setFontColor('#FFFFFF').setFontWeight('bold');

  var kpiData = [
    [
      'KPI-301', curMonthStr, 'NV-001', 'Nguyễn Quản Trị (CEO)', 'Ban Giám Đốc',
      'Điều hành hoàn thành 100% mục tiêu doanh thu & lợi nhuận quý', 100, 100, 100,
      'Xuất sắc (A+)', 8000000, 'Đã duyệt',
      JSON.stringify({ notes: 'Vượt 115% kế hoạch doanh thu toàn công ty', attachments: [] })
    ],
    [
      'KPI-302', curMonthStr, 'NV-002', 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', 'Phòng Hành Chính - Nhân Sự',
      'Chuẩn hóa hệ thống HRIS, 100% hồ sơ hợp đồng số hóa & tự động tính lương', 100, 100, 98,
      'Xuất sắc (A+)', 4500000, 'Đã duyệt',
      JSON.stringify({ notes: 'Đã hoàn tất số hóa 100% quy trình chấm công - tính lương', attachments: [{ id: 'AK-1', name: 'Bao_Cao_Nhan_Su_Thang.xlsx', ext: 'xlsx', size: '310 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Trần Thanh Hà', uploadedAt: fmtDateOffset(-2) }] })
    ],
    [
      'KPI-303', curMonthStr, 'NV-003', 'Phạm Tuấn Kiệt (Tech Lead)', 'Khối Kỹ Thuật & Công Nghệ',
      'Đảm bảo tiến độ bàn giao 5 phân hệ Web App Commercial Pro đúng hạn 100%', 100, 95, 95,
      'Xuất sắc (A+)', 5000000, 'Đã duyệt',
      JSON.stringify({ notes: 'Hệ thống vận hành ổn định, đạt chuẩn Golden Master', attachments: [{ id: 'AK-2', name: 'Bien_Ban_Nghiem_Thu_Ky_Thuat.pdf', ext: 'pdf', size: '780 KB', url: 'https://drive.google.com', uploadedBy: 'Phạm Tuấn Kiệt', uploadedAt: fmtDateOffset(-1) }] })
    ],
    [
      'KPI-304', curMonthStr, 'NV-004', 'Lê Minh Thư (Leader Kinh Doanh)', 'Phòng Kinh Doanh & CRM',
      'Đạt chỉ tiêu doanh số B2B 450 triệu/tháng & tỷ lệ tái ký > 85%', 100, 92, 92,
      'Xuất sắc (A+)', 6000000, 'Đã duyệt',
      JSON.stringify({ notes: 'Chốt thành công 3 hợp đồng lớn (SunLand, Aura Beauty, Global Edu)', attachments: [] })
    ],
    [
      'KPI-305', curMonthStr, 'NV-005', 'Võ Ngọc Ánh (Chuyên viên UI/UX)', 'Khối Kỹ Thuật & Công Nghệ',
      'Thiết kế hoàn chỉnh giao diện Mobile-First & bộ tài liệu hướng dẫn người dùng', 100, 88, 88,
      'Tốt (A)', 2500000, 'Chờ duyệt',
      JSON.stringify({ notes: 'Đã gửi link Figma và file PDF hướng dẫn chờ Tech Lead duyệt', attachments: [{ id: 'AK-3', name: 'UI_StyleGuide_v4.pptx', ext: 'pptx', size: '2.8 MB', url: 'https://docs.google.com/presentation', uploadedBy: 'Võ Ngọc Ánh', uploadedAt: fmtDateOffset(0) }] })
    ],
    [
      'KPI-306', curMonthStr, 'NV-006', 'Hoàng Minh (Chuyên viên Sale)', 'Phòng Kinh Doanh & CRM',
      'Phát triển 30 khách hàng tiềm năng mới (Leads) & ký mới tối thiểu 2 hợp đồng', 100, 85, 85,
      'Tốt (A)', 3000000, 'Chờ duyệt',
      JSON.stringify({ notes: 'Đã đạt 28/30 Leads và ký 2 hợp đồng mới', attachments: [{ id: 'AK-4', name: 'Danh_Sach_Hop_Dong_Moi_HoangMinh.xlsx', ext: 'xlsx', size: '220 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Hoàng Minh', uploadedAt: fmtDateOffset(0) }] })
    ]
  ];
  shKpi.getRange(3, 1, kpiData.length, 13).setValues(kpiData);
  shKpi.getRange(3, 11, kpiData.length, 1).setNumberFormat('#,##0');
  for (var ck = 1; ck <= 13; ck++) shKpi.setColumnWidth(ck, 155);
  shKpi.setColumnWidth(6, 280);

  // =========================================================================
  // 7. TAB BANG_LUONG_THANG (TÍNH LƯƠNG TỰ ĐỘNG: CÔNG + OT + PHỤ CẤP + KPI - BHXH - THUẾ)
  // =========================================================================
  var shPay = ss.getSheetByName('BANG_LUONG_THANG');
  shPay.getRange('A1:S1').merge().setValue('💰 BẢNG TÍNH LƯƠNG TỰ ĐỘNG, PHỤ CẤP, THƯỞNG KPI, TRÍCH NỘP BHXH (10.5%), THUẾ TNCN & THỰC LĨNH (NET PAY)')
    .setBackground('#065F46').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shPay.setRowHeight(1, 36);

  var payHeaders = [[
    'MÃ PHIẾU LƯƠNG', 'KỲ LƯƠNG', 'MÃ NV', 'HỌ VÀ TÊN', 'PHÒNG BAN', 'CHỨC VỤ',
    'LƯƠNG CƠ BẢN', 'CÔNG CHUẨN', 'CÔNG THỰC TẾ', 'LƯƠNG NGÀY CÔNG',
    'GIỜ TĂNG CA (OT)', 'LƯƠNG TĂNG CA (OT)', 'PHỤ CẤP ĐỊNH MỨC', 'THƯỞNG KPI & DOANH SỐ',
    'TỔNG THU NHẬP (GROSS)', 'TRỪ BHXH (10.5%)', 'THUẾ TNCN / KHẤU TRỪ',
    'THỰC LĨNH (NET PAY)', 'TRẠNG THÁI GỬI PAYSLIP'
  ]];
  shPay.getRange('A2:S2').setValues(payHeaders).setBackground('#047857').setFontColor('#FFFFFF').setFontWeight('bold');

  var samplePayrolls = [
    ['PL-' + curMonthStr.replace('-', '') + '-01', curMonthStr, 'NV-001', 'Nguyễn Quản Trị (CEO)', 'Ban Giám Đốc', 'Tổng Giám Đốc (CEO)', 45000000, 26, 26, 45000000, 0, 0, 5000000, 8000000, 58000000, 2100000, 3850000, 52050000, 'Đã gửi Email/Zalo'],
    ['PL-' + curMonthStr.replace('-', '') + '-02', curMonthStr, 'NV-002', 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', 'Phòng Hành Chính - Nhân Sự', 'Giám Đốc Nhân Sự (HRD)', 28000000, 26, 26, 28000000, 4.5, 908654, 3000000, 4500000, 36408654, 1575000, 1420000, 33413654, 'Đã gửi Email/Zalo'],
    ['PL-' + curMonthStr.replace('-', '') + '-03', curMonthStr, 'NV-003', 'Phạm Tuấn Kiệt (Tech Lead)', 'Khối Kỹ Thuật & Công Nghệ', 'Trưởng Nhóm Kỹ Thuật (Tech Lead)', 26000000, 26, 26, 26000000, 10.5, 1968750, 2500000, 5000000, 35468750, 1470000, 1280000, 32718750, 'Đã duyệt chốt lương'],
    ['PL-' + curMonthStr.replace('-', '') + '-04', curMonthStr, 'NV-004', 'Lê Minh Thư (Leader Kinh Doanh)', 'Phòng Kinh Doanh & CRM', 'Trưởng Nhóm Kinh Doanh (Sales Lead)', 22000000, 26, 26, 22000000, 4.0, 634615, 2500000, 6000000, 31134615, 1260000, 720000, 29154615, 'Đã duyệt chốt lương'],
    ['PL-' + curMonthStr.replace('-', '') + '-05', curMonthStr, 'NV-005', 'Võ Ngọc Ánh (Chuyên viên UI/UX)', 'Khối Kỹ Thuật & Công Nghệ', 'Chuyên Viên Thiết Kế UI/UX', 16500000, 26, 25.5, 16182692, 4.5, 535096, 1800000, 2500000, 21017788, 1050000, 448389, 19519399, 'Chờ gửi Payslip'],
    ['PL-' + curMonthStr.replace('-', '') + '-06', curMonthStr, 'NV-006', 'Hoàng Minh (Chuyên viên Sale)', 'Phòng Kinh Doanh & CRM', 'Chuyên Viên Tư Vấn B2B', 14000000, 26, 25.0, 13461538, 3.0, 302885, 1500000, 3000000, 18264423, 945000, 315971, 17003452, 'Chờ gửi Payslip']
  ];
  shPay.getRange(3, 1, samplePayrolls.length, 19).setValues(samplePayrolls);
  shPay.getRange(3, 2, samplePayrolls.length, 1).setNumberFormat('@');
  shPay.getRange(3, 7, samplePayrolls.length, 1).setNumberFormat('#,##0');
  shPay.getRange(3, 10, samplePayrolls.length, 1).setNumberFormat('#,##0');
  shPay.getRange(3, 12, samplePayrolls.length, 7).setNumberFormat('#,##0');
  for (var cp = 1; cp <= 19; cp++) shPay.setColumnWidth(cp, 150);

  // =========================================================================
  // 8. TAB NHAT_KY_HE_THONG (AUDIT LOGS & LỊCH SỬ GỬI PHIẾU LƯƠNG)
  // =========================================================================
  var shLog = ss.getSheetByName('NHAT_KY_HE_THONG');
  shLog.getRange('A1:F1').merge().setValue('🛡️ NHẬT KÝ HOẠT ĐỘNG HỆ THỐNG, PHÊ DUYỆT ĐƠN TỪ & LỊCH SỬ BẮN PHIẾU LƯƠNG EMAIL/ZALO')
    .setBackground('#1E293B').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shLog.setRowHeight(1, 36);

  var logHeaders = [['THỜI GIAN', 'TÀI KHOẢN THỰC HIỆN', 'VAI TRÒ', 'HÀNH ĐỘNG', 'MÃ ĐỐI TƯỢNG', 'NỘI DUNG CHI TIẾT']];
  shLog.getRange('A2:F2').setValues(logHeaders).setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold');
  shLog.getRange(3, 1, 2, 6).setValues([
    [fmtDateOffset(0) + ' 08:00:00', 'admin', 'ADMIN', 'INIT_DATABASE', 'SYSTEM', 'Khởi tạo hệ thống Quản lý Nhân sự, Chấm công, KPI & Tiền lương GS-001 v4.0 Commercial Pro'],
    [fmtDateOffset(0) + ' 08:15:00', 'hr_mgr', 'HR_MANAGER', 'CALC_PAYROLL', curMonthStr, 'Tính tự động bảng lương tháng ' + curMonthStr + ' cho 6 nhân sự (Quỹ lương Net: 183.860.000 đ)']
  ]);
  for (var cg = 1; cg <= 6; cg++) shLog.setColumnWidth(cg, 180);
  shLog.setColumnWidth(6, 420);

  SpreadsheetApp.flush();
  return { ok: true, message: '🎉 Đã khởi tạo thành công 8 Sheet chuẩn cho Hệ thống Nhân Sự & Tiền Lương GS-001 v4.0 Commercial Pro!' };
}
