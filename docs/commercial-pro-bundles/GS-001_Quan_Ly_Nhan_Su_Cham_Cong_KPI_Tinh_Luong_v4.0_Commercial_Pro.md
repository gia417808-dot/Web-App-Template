# 👥 HỆ THỐNG QUẢN LÝ NHÂN SỰ, CHẤM CÔNG CA/GPS, DUYỆT ĐƠN TỪ, KPI & TÍNH LƯƠNG TỰ ĐỘNG (GS-001 v4.0 COMMERCIAL PRO)

## 🌟 TỔNG QUAN KIẾN TRÚC & TÍNH NĂNG ĐỘT PHÁ (GOLDEN MASTER 5/5)

### 1. Kiến trúc 8 Bảng Dữ Liệu Google Sheets Chuẩn Doanh Nghiệp (`installer.gs` tự động khởi tạo)

1. **`CAU_HINH`**: Cài đặt thông tin doanh nghiệp, kỳ tính lương (`CURRENT_PAYROLL_PERIOD`), số ngày công chuẩn (`26 công`), tỷ lệ trích BHXH/BHYT/BHTN (`10.5%` nhân sự / `21.5%` công ty), mức giảm trừ gia cảnh thuế TNCN (`11.000.000đ` bản thân + `4.400.000đ`/người phụ thuộc), hệ số lương Tăng ca OT (`1.5`) và cấu hình Webhook Bot Zalo / Email / Telegram.

2. **`PHAN_QUYEN`**: Quản lý tài khoản đăng nhập và Ma trận 6 Quyền Thao Tác Thực Tế trên App (`MANAGE_HR`, `APPROVE_LEAVE_OT`, `MANAGE_PAYROLL`, `EVALUATE_KPI`, `VIEW_DEPT_TEAM`, `SELF_CHECKIN_LEAVE`). Tự động đồng bộ tài khoản mới sang `HO_SO_NHAN_SU` để nhân viên mới đăng nhập thao tác được ngay.

3. **`HO_SO_NHAN_SU`**: Quản lý danh bạ nhân sự, phòng ban, chức danh, loại hợp đồng, hạn hợp đồng (cảnh báo trước 30 ngày), lương cơ bản, lương đóng BHXH, phụ cấp định mức, tài khoản ngân hàng và **Tệp Hồ Sơ Đính Kèm (Word `.docx`, Excel `.xlsx`, PDF `.pdf`, Ảnh CCCD/CV)**.

4. **`CHAM_CONG`**: Nhật ký chấm công hàng ngày (`⚡ Chấm Công Vào Ca 1 Chạm` / `🏁 Chấm Công Ra Ca 1 Chạm`), phân loại Ca làm việc, Hình thức làm việc (`Văn phòng`, `Làm việc từ xa WFH`, `Đi gặp khách hàng Thị trường`), tự động quy đổi số công và giờ Tăng ca (OT).

5. **`DON_TU_NGHI_PHEP`**: Quản lý & phê duyệt trực tuyến Đơn xin nghỉ phép năm, Đăng ký Tăng ca (OT), Đơn đi công tác và Giải trình đi muộn/về sớm kèm file chứng từ đính kèm.

6. **`DANH_GIA_KPI`**: Giao chỉ tiêu KPI/OKR tháng, cập nhật `% Tiến độ đạt được` (khi nhân viên cập nhật `100%` tự động chuyển sang **`Chờ duyệt`** và bảo toàn tuyệt đối thông tin nhân sự), xếp loại `A+/A/B/C` và tính mức thưởng KPI.

7. **`BANG_LUONG_THANG`**: Động cơ tính lương tự động (`Thực Lĩnh NET = Lương Ngày Công + Lương Tăng Ca OT + Phụ Cấp + Thưởng KPI - BHXH 10.5% - Thuế TNCN lũy tiến`), xuất **Phiếu lương cá nhân chuẩn A4 (`Payslip`)** và bắn tự động qua Email & Bot Zalo.

8. **`NHAT_KY_HE_THONG`**: Lưu vết toàn bộ lịch sử chấm công, duyệt đơn, chốt lương và phân quyền.

### 2. Ma trận Phân quyền 4 Cấp (`ADMIN` / `HR_MANAGER` / `LEADER` / `STAFF`)

| Cấp bậc (`ROLE`) | Tài khoản mẫu | Phạm vi nhìn thấy & Quyền điều hành trên App |
| ----- | ----- | ----- |
| **`ADMIN`** | `admin` / `123456` (*CEO*) | Toàn quyền điều hành 6 phân hệ, xem toàn bộ hồ sơ, quỹ lương, duyệt đơn từ, duyệt KPI & phân quyền hệ thống |
| **`HR_MANAGER`** | `hr_mgr` / `123456` (*GĐ Nhân Sự*) | Toàn quyền quản lý Hồ sơ nhân sự, Hợp đồng, Chấm công, Duyệt đơn từ, Tính bảng lương tự động & Bắn Payslip Email/Zalo |
| **`LEADER`** | `tech_lead` / `123456`, `sale_lead` / `123456` | Quản lý toàn bộ nhân viên tuyến dưới thuộc Phòng ban của mình: Xem công, **Duyệt đơn Nghỉ phép / Tăng ca OT**, **Giao & Duyệt KPI tuyến dưới**, thêm/phân quyền nhân sự phòng ban; chỉ xem Phiếu lương của riêng mình |
| **`STAFF`** | `nv_anh` / `123456`, `nv_minh` / `666666` | **Thao tác trực tiếp ngay khi đăng nhập**: Chấm công Vào/Ra ca 1 chạm, Gửi đơn xin nghỉ phép / đăng ký Tăng ca OT kèm file, Cập nhật tiến độ KPI (`100% ➔ Chờ duyệt`), Xem & In Phiếu lương cá nhân A4 (ẩn toàn bộ lương người khác) |

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
  },
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.send_mail",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.scriptapp"
  ]
}

```

## 📁 FILE 2: `installer.gs`

```
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


```

## 📁 FILE 3: `Code.gs`

```
/**
 * ============================================================================
 * GS-001: HỆ THỐNG QUẢN LÝ NHÂN SỰ, CHẤM CÔNG, ĐƠN TỪ, KPI & TÍNH LƯƠNG TỰ ĐỘNG
 * Phiên bản: v4.0 Commercial Pro (Full-Screen, 4-Tier RBAC, Multi-File Upload & Payslip Bot)
 * File: Code.gs — Backend Engine & REST-like RPC Endpoints
 * ============================================================================
 */

function doGet(e) {
  try {
    ensureHrSheetsExist();
  } catch (err) {}
  var tpl = HtmlService.createTemplateFromFile('Index');
  return tpl.evaluate()
    .setTitle('GS-001 v4.0 Pro • Quản Lý Nhân Sự, Chấm Công, KPI & Tính Lương Tự Động')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

function ensureHrSheetsExist() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Không tìm thấy Google Spreadsheet!');
  var shEmp = ss.getSheetByName('HO_SO_NHAN_SU');
  var shAuth = ss.getSheetByName('PHAN_QUYEN');
  if (!shEmp || !shAuth || shEmp.getLastRow() < 2) {
    setupHrDatabase();
  }
  return ss;
}

function parseNumSafe(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (val === null || val === undefined) return 0;
  var s = String(val).replace(/[^\d.-]/g, '');
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function normalizeDateStr(rawVal, dispVal) {
  if (rawVal instanceof Date && !isNaN(rawVal.getTime())) {
    return Utilities.formatDate(rawVal, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }
  var s = String(dispVal || rawVal || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  var m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
  }
  return s;
}

function parseJsonSafe(str, fallbackVal) {
  if (!str) return fallbackVal;
  try {
    var parsed = JSON.parse(String(str));
    return parsed !== null && parsed !== undefined ? parsed : fallbackVal;
  } catch (e) {
    return fallbackVal;
  }
}

function appendHrAuditLog(actor, role, action, refId, detail) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;
    var sh = ss.getSheetByName('NHAT_KY_HE_THONG');
    if (!sh) return;
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
    sh.appendRow([nowStr, String(actor || 'system'), String(role || 'USER'), String(action || ''), String(refId || ''), String(detail || '')]);
  } catch (e) {}
}

// ============================================================================
// API 1: ĐỌC TOÀN BỘ DỮ LIỆU HỆ THỐNG NHÂN SỰ & TIỀN LƯƠNG (getHrSystemData)
// ============================================================================
function getHrSystemData() {
  try {
    var ss = ensureHrSheetsExist();
    var now = new Date();
    var todayStr = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    var curMonthStr = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyyy-MM');
    var serverTime = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');

    // 1. Đọc CAU_HINH
    var config = {};
    var shCfg = ss.getSheetByName('CAU_HINH');
    if (shCfg && shCfg.getLastRow() >= 3) {
      var cfgVals = shCfg.getRange(3, 1, shCfg.getLastRow() - 2, 2).getDisplayValues();
      cfgVals.forEach(function(r) {
        var k = String(r[0] || '').trim();
        if (k) config[k] = String(r[1] || '').trim();
      });
    }
    if (!config.CURRENT_PAYROLL_PERIOD) config.CURRENT_PAYROLL_PERIOD = curMonthStr;

    // 2. Đọc PHAN_QUYEN
    var users = [];
    var shAuth = ss.getSheetByName('PHAN_QUYEN');
    if (shAuth && shAuth.getLastRow() >= 3) {
      var maxColAuth = Math.max(10, shAuth.getLastColumn());
      if (shAuth.getMaxColumns() < 10) shAuth.insertColumnsAfter(shAuth.getMaxColumns(), 10 - shAuth.getMaxColumns());
      var uVals = shAuth.getRange(3, 1, shAuth.getLastRow() - 2, 10).getDisplayValues();
      uVals.forEach(function(r, idx) {
        var uname = String(r[0] || '').trim();
        if (!uname) return;
        users.push({
          rowIndex: idx + 3,
          username: uname,
          password: String(r[1] || '123456').trim(),
          empId: String(r[2] || ('NV-00' + (idx + 1))).trim(),
          fullName: String(r[3] || uname).trim(),
          role: String(r[4] || 'STAFF').trim().toUpperCase(),
          department: String(r[5] || '').trim(),
          email: String(r[6] || '').trim(),
          phone: String(r[7] || '').trim(),
          status: String(r[8] || 'Hoạt động').trim(),
          permissions: String(r[9] || '').trim()
        });
      });
    }

    // 3. Đọc HO_SO_NHAN_SU
    var employees = [];
    var shEmp = ss.getSheetByName('HO_SO_NHAN_SU');
    if (shEmp && shEmp.getLastRow() >= 3) {
      if (shEmp.getMaxColumns() < 17) shEmp.insertColumnsAfter(shEmp.getMaxColumns(), 17 - shEmp.getMaxColumns());
      var eRaw = shEmp.getRange(3, 1, shEmp.getLastRow() - 2, 17).getValues();
      var eDisp = shEmp.getRange(3, 1, shEmp.getLastRow() - 2, 17).getDisplayValues();
      eRaw.forEach(function(r, idx) {
        var d = eDisp[idx];
        var id = String(d[0] || '').trim();
        var fullName = String(d[1] || '').trim();
        if (!id && !fullName) return;
        employees.push({
          rowIndex: idx + 3,
          id: id || ('NV-00' + (idx + 1)),
          fullName: fullName,
          department: String(d[2] || '').trim(),
          position: String(d[3] || '').trim(),
          role: String(d[4] || 'STAFF').trim().toUpperCase(),
          phone: String(d[5] || '').trim(),
          email: String(d[6] || '').trim(),
          joinDate: normalizeDateStr(r[7], d[7]),
          contractType: String(d[8] || 'Hợp đồng 12 tháng').trim(),
          contractEndDate: normalizeDateStr(r[9], d[9]),
          baseSalary: parseNumSafe(r[10]),
          insuranceSalary: parseNumSafe(r[11]),
          allowance: parseNumSafe(r[12]),
          dependents: parseNumSafe(r[13]),
          bankAccount: String(d[14] || '').trim(),
          status: String(d[15] || 'Đang làm việc').trim(),
          attachments: parseJsonSafe(d[16], [])
        });
      });
    }

    // 4. Đọc CHAM_CONG
    var attendance = [];
    var shAtt = ss.getSheetByName('CHAM_CONG');
    if (shAtt && shAtt.getLastRow() >= 3) {
      var aRaw = shAtt.getRange(3, 1, shAtt.getLastRow() - 2, 13).getValues();
      var aDisp = shAtt.getRange(3, 1, shAtt.getLastRow() - 2, 13).getDisplayValues();
      aRaw.forEach(function(r, idx) {
        var d = aDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[2]) return;
        attendance.push({
          rowIndex: idx + 3,
          id: id || ('CC-' + (idx + 1)),
          date: normalizeDateStr(r[1], d[1]),
          empId: String(d[2] || '').trim(),
          fullName: String(d[3] || '').trim(),
          department: String(d[4] || '').trim(),
          shift: String(d[5] || 'Ca Hành Chính (08:00 - 17:30)').trim(),
          checkIn: String(d[6] || '08:00').trim(),
          checkOut: String(d[7] || '17:30').trim(),
          workUnits: parseNumSafe(r[8] !== '' ? r[8] : 1.0),
          otHours: parseNumSafe(r[9]),
          workMode: String(d[10] || 'Văn phòng Công ty').trim(),
          status: String(d[11] || 'Đúng giờ (Đủ công)').trim(),
          notes: String(d[12] || '').trim()
        });
      });
    }

    // 5. Đọc DON_TU_NGHI_PHEP
    var leaveRequests = [];
    var shLeave = ss.getSheetByName('DON_TU_NGHI_PHEP');
    if (shLeave && shLeave.getLastRow() >= 3) {
      if (shLeave.getMaxColumns() < 14) shLeave.insertColumnsAfter(shLeave.getMaxColumns(), 14 - shLeave.getMaxColumns());
      var lRaw = shLeave.getRange(3, 1, shLeave.getLastRow() - 2, 14).getValues();
      var lDisp = shLeave.getRange(3, 1, shLeave.getLastRow() - 2, 14).getDisplayValues();
      lRaw.forEach(function(r, idx) {
        var d = lDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[3]) return;
        leaveRequests.push({
          rowIndex: idx + 3,
          id: id || ('DT-' + (idx + 1)),
          createdAt: normalizeDateStr(r[1], d[1]),
          empId: String(d[2] || '').trim(),
          fullName: String(d[3] || '').trim(),
          department: String(d[4] || '').trim(),
          requestType: String(d[5] || 'Đơn xin Nghỉ phép năm (Có hưởng lương)').trim(),
          fromDate: normalizeDateStr(r[6], d[6]),
          toDate: normalizeDateStr(r[7], d[7]),
          quantity: parseNumSafe(r[8] !== '' ? r[8] : 1),
          reason: String(d[9] || '').trim(),
          status: String(d[10] || 'Chờ duyệt').trim(),
          approver: String(d[11] || '').trim(),
          approvalNote: String(d[12] || '').trim(),
          attachments: parseJsonSafe(d[13], [])
        });
      });
    }

    // 6. Đọc DANH_GIA_KPI
    var kpiReviews = [];
    var shKpi = ss.getSheetByName('DANH_GIA_KPI');
    if (shKpi && shKpi.getLastRow() >= 3) {
      if (shKpi.getMaxColumns() < 13) shKpi.insertColumnsAfter(shKpi.getMaxColumns(), 13 - shKpi.getMaxColumns());
      var kRaw = shKpi.getRange(3, 1, shKpi.getLastRow() - 2, 13).getValues();
      var kDisp = shKpi.getRange(3, 1, shKpi.getLastRow() - 2, 13).getDisplayValues();
      kRaw.forEach(function(r, idx) {
        var d = kDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[3]) return;
        var metaObj = parseJsonSafe(d[12], { notes: String(d[12] || ''), attachments: [] });
        kpiReviews.push({
          rowIndex: idx + 3,
          id: id || ('KPI-' + (idx + 1)),
          period: String(d[1] || curMonthStr).trim(),
          empId: String(d[2] || '').trim(),
          fullName: String(d[3] || '').trim(),
          department: String(d[4] || '').trim(),
          goalTitle: String(d[5] || '').trim(),
          weight: parseNumSafe(r[6] !== '' ? r[6] : 100),
          progress: parseNumSafe(r[7]),
          score: parseNumSafe(r[8]),
          grade: String(d[9] || 'Tốt (A)').trim(),
          bonusAmount: parseNumSafe(r[10]),
          status: String(d[11] || 'Chờ duyệt').trim(),
          notes: String(metaObj.notes || '').trim(),
          attachments: Array.isArray(metaObj.attachments) ? metaObj.attachments : []
        });
      });
    }

    // 7. Đọc BANG_LUONG_THANG
    var payrolls = [];
    var shPay = ss.getSheetByName('BANG_LUONG_THANG');
    if (shPay && shPay.getLastRow() >= 3) {
      if (shPay.getMaxColumns() < 19) shPay.insertColumnsAfter(shPay.getMaxColumns(), 19 - shPay.getMaxColumns());
      var pRaw = shPay.getRange(3, 1, shPay.getLastRow() - 2, 19).getValues();
      var pDisp = shPay.getRange(3, 1, shPay.getLastRow() - 2, 19).getDisplayValues();
      pRaw.forEach(function(r, idx) {
        var d = pDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[3]) return;
        payrolls.push({
          rowIndex: idx + 3,
          id: id || ('PL-' + (idx + 1)),
          period: String(d[1] || curMonthStr).trim(),
          empId: String(d[2] || '').trim(),
          fullName: String(d[3] || '').trim(),
          department: String(d[4] || '').trim(),
          position: String(d[5] || '').trim(),
          baseSalary: parseNumSafe(r[6]),
          standardDays: parseNumSafe(r[7] || 26),
          actualDays: parseNumSafe(r[8]),
          workDaySalary: parseNumSafe(r[9]),
          otHours: parseNumSafe(r[10]),
          otSalary: parseNumSafe(r[11]),
          allowance: parseNumSafe(r[12]),
          kpiBonus: parseNumSafe(r[13]),
          grossSalary: parseNumSafe(r[14]),
          insuranceDeduction: parseNumSafe(r[15]),
          taxAndPenalty: parseNumSafe(r[16]),
          netSalary: parseNumSafe(r[17]),
          status: String(d[18] || 'Chờ gửi Payslip').trim()
        });
      });
    }

    // 8. Đọc NHAT_KY_HE_THONG
    var auditLogs = [];
    var shLog = ss.getSheetByName('NHAT_KY_HE_THONG');
    if (shLog && shLog.getLastRow() >= 3) {
      var startRow = Math.max(3, shLog.getLastRow() - 39);
      var numRows = shLog.getLastRow() - startRow + 1;
      var lVals = shLog.getRange(startRow, 1, numRows, 6).getDisplayValues();
      for (var i = lVals.length - 1; i >= 0; i--) {
        auditLogs.push({
          timestamp: lVals[i][0],
          actor: lVals[i][1],
          role: lVals[i][2],
          action: lVals[i][3],
          refId: lVals[i][4],
          detail: lVals[i][5]
        });
      }
    }

    return {
      ok: true,
      serverTime: serverTime,
      todayStr: todayStr,
      curMonthStr: curMonthStr,
      config: config,
      users: users,
      employees: employees,
      attendance: attendance,
      leaveRequests: leaveRequests,
      kpiReviews: kpiReviews,
      payrolls: payrolls,
      auditLogs: auditLogs
    };
  } catch (e) {
    return {
      ok: false,
      message: 'Lỗi đọc dữ liệu Nhân sự: ' + e.toString()
    };
  }
}

// ============================================================================
// API 2: LƯU / CẬP NHẬT HỒ SƠ NHÂN SỰ & ĐỒNG BỘ TÀI KHOẢN (HO_SO_NHAN_SU)
// ============================================================================
function saveEmployeeRecord(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('HO_SO_NHAN_SU');
    if (sh.getMaxColumns() < 17) sh.insertColumnsAfter(sh.getMaxColumns(), 17 - sh.getMaxColumns());

    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'NV-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHH');
      isNew = true;
    }

    var attachmentsJson = JSON.stringify(Array.isArray(payload.attachments) ? payload.attachments : []);
    var rowVals = [
      id,
      String(payload.fullName || '').trim(),
      String(payload.department || 'Phòng Kinh Doanh & CRM').trim(),
      String(payload.position || 'Chuyên Viên').trim(),
      String(payload.role || 'STAFF').trim().toUpperCase(),
      String(payload.phone || '').trim(),
      String(payload.email || '').trim(),
      String(payload.joinDate || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')).trim(),
      String(payload.contractType || 'Hợp đồng 12 tháng').trim(),
      String(payload.contractEndDate || '').trim(),
      parseNumSafe(payload.baseSalary),
      parseNumSafe(payload.insuranceSalary),
      parseNumSafe(payload.allowance),
      parseNumSafe(payload.dependents),
      String(payload.bankAccount || '').trim(),
      String(payload.status || 'Đang làm việc').trim(),
      attachmentsJson
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
      sh.getRange(foundRow, 1, 1, 17).setValues([rowVals]);
      sh.getRange(foundRow, 6).setNumberFormat('@');
      sh.getRange(foundRow, 11, 1, 3).setNumberFormat('#,##0');
    } else {
      sh.appendRow(rowVals);
      var lr = sh.getLastRow();
      sh.getRange(lr, 6).setNumberFormat('@');
      sh.getRange(lr, 11, 1, 3).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'hr_mgr', payload.actorRole || 'HR_MANAGER', foundRow > 0 ? 'UPDATE_EMPLOYEE' : 'CREATE_EMPLOYEE', id, 'Hồ sơ nhân sự: ' + rowVals[1] + ' (' + rowVals[2] + ')');

    var fresh = getHrSystemData();
    fresh.message = (foundRow > 0 ? 'Đã cập nhật hồ sơ nhân sự: ' : 'Đã thêm hồ sơ nhân sự mới: ') + rowVals[1];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu hồ sơ nhân sự: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteEmployeeRecord(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('HO_SO_NHAN_SU');
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
    appendHrAuditLog(payload.actor || 'admin', 'ADMIN', 'DELETE_EMPLOYEE', id, 'Xóa hồ sơ nhân sự ' + id);
    var fresh = getHrSystemData();
    fresh.message = 'Đã xóa hồ sơ nhân sự ' + id;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi xóa nhân sự: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 3: CHẤM CÔNG VÀO CA / RA CA / GHI NHẬN CÔNG & OT (CHAM_CONG)
// ============================================================================
function saveAttendanceRecord(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('CHAM_CONG');
    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'CC-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    var rowVals = [
      id,
      String(payload.date || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')).trim(),
      String(payload.empId || 'NV-001').trim(),
      String(payload.fullName || '').trim(),
      String(payload.department || '').trim(),
      String(payload.shift || 'Ca Hành Chính (08:00 - 17:30)').trim(),
      String(payload.checkIn || '08:00').trim(),
      String(payload.checkOut || '17:30').trim(),
      parseNumSafe(payload.workUnits !== undefined ? payload.workUnits : 1.0),
      parseNumSafe(payload.otHours || 0),
      String(payload.workMode || 'Văn phòng Công ty').trim(),
      String(payload.status || 'Đúng giờ (Đủ công)').trim(),
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
      sh.getRange(foundRow, 1, 1, 13).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || rowVals[3], payload.actorRole || 'STAFF', 'CHECK_IN_OUT', id, 'Chấm công ngày ' + rowVals[1] + ': ' + rowVals[3] + ' (' + rowVals[6] + ' - ' + rowVals[7] + ', OT: ' + rowVals[9] + 'h)');

    var fresh = getHrSystemData();
    fresh.message = '🕒 Đã ghi nhận chấm công cho ' + rowVals[3] + ' (Ngày ' + rowVals[1] + ')!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu chấm công: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 4: GỬI & PHÊ DUYỆT ĐƠN TỪ NGHỈ PHÉP / TĂNG CA OT (DON_TU_NGHI_PHEP)
// ============================================================================
function saveLeaveOrOtRequest(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('DON_TU_NGHI_PHEP');
    if (sh.getMaxColumns() < 14) sh.insertColumnsAfter(sh.getMaxColumns(), 14 - sh.getMaxColumns());

    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'DT-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    var foundRow = -1;
    var existingDisp = null;
    if (!isNew && sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          foundRow = i + 3;
          existingDisp = sh.getRange(foundRow, 1, 1, 14).getDisplayValues()[0];
          break;
        }
      }
    }

    var canApprove = payload.canApprove === true;
    var status = String(payload.status || (existingDisp ? existingDisp[10] : 'Chờ duyệt')).trim();
    if (!canApprove && (status === 'Đã duyệt' || status === 'Từ chối')) {
      status = 'Chờ duyệt';
    }

    var attachmentsJson = JSON.stringify(Array.isArray(payload.attachments) ? payload.attachments : []);
    var todayStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');

    var rowVals = [
      id,
      String(payload.createdAt || (existingDisp ? existingDisp[1] : todayStr)).trim(),
      String(payload.empId || (existingDisp ? existingDisp[2] : '')).trim(),
      String(payload.fullName || (existingDisp ? existingDisp[3] : '')).trim(),
      String(payload.department || (existingDisp ? existingDisp[4] : '')).trim(),
      String(payload.requestType || (existingDisp ? existingDisp[5] : 'Đơn xin Nghỉ phép năm (Có hưởng lương)')).trim(),
      String(payload.fromDate || (existingDisp ? existingDisp[6] : todayStr)).trim(),
      String(payload.toDate || (existingDisp ? existingDisp[7] : todayStr)).trim(),
      parseNumSafe(payload.quantity !== undefined ? payload.quantity : (existingDisp ? existingDisp[8] : 1)),
      String(payload.reason || (existingDisp ? existingDisp[9] : '')).trim(),
      status,
      String(payload.approver || (existingDisp ? existingDisp[11] : 'Ban Quản Lý / HR')).trim(),
      String(payload.approvalNote !== undefined ? payload.approvalNote : (existingDisp ? existingDisp[12] : '')).trim(),
      attachmentsJson
    ];

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 14).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || rowVals[3], payload.actorRole || 'STAFF', foundRow > 0 ? 'UPDATE_LEAVE_OT' : 'CREATE_LEAVE_OT', id, rowVals[5] + ' của ' + rowVals[3] + ' ➔ ' + status);

    var fresh = getHrSystemData();
    fresh.message = '📝 Đã lưu đơn từ [' + id + '] của ' + rowVals[3] + ' (' + status + ')!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu đơn từ: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function approveOrRejectRequestQuick(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('DON_TU_NGHI_PHEP');
    var id = String(payload.id || '').trim();
    var newStatus = String(payload.status || 'Đã duyệt').trim();
    var approverName = String(payload.approver || 'Quản lý / HR').trim();
    var note = String(payload.approvalNote || (newStatus === 'Đã duyệt' ? 'Đã phê duyệt hợp lệ' : 'Yêu cầu bổ sung/điều chỉnh')).trim();

    if (sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          var r = i + 3;
          sh.getRange(r, 11).setValue(newStatus);
          sh.getRange(r, 12).setValue(approverName);
          sh.getRange(r, 13).setValue(note);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || approverName, payload.actorRole || 'MANAGER', 'APPROVE_LEAVE_OT', id, 'Phê duyệt đơn từ ' + id + ' ➔ ' + newStatus);
    var fresh = getHrSystemData();
    fresh.message = '✅ Đã cập nhật trạng thái đơn [' + id + '] sang: ' + newStatus;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi duyệt đơn từ: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 5: ĐÁNH GIÁ & CẬP NHẬT TIẾN ĐỘ KPI CÁ NHÂN / ĐỘI NGŨ (DANH_GIA_KPI)
// ============================================================================
function saveKpiReviewItem(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('DANH_GIA_KPI');
    if (sh.getMaxColumns() < 13) sh.insertColumnsAfter(sh.getMaxColumns(), 13 - sh.getMaxColumns());

    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'KPI-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    var foundRow = -1;
    var existingDisp = null;
    if (!isNew && sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          foundRow = i + 3;
          existingDisp = sh.getRange(foundRow, 1, 1, 13).getDisplayValues()[0];
          break;
        }
      }
    }

    var canApprove = payload.canApprove === true;
    var progress = parseNumSafe(payload.progress);
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    var status = String(payload.status || (existingDisp ? existingDisp[11] : 'Đang thực hiện')).trim();
    // Bảo vệ tuyệt đối: Khi nhân viên cập nhật KPI lên 100%, tự động chuyển sang "Chờ duyệt" và bảo toàn thông tin nhân sự!
    if (progress >= 100) {
      progress = 100;
      if (!canApprove || status === 'Đang thực hiện' || status === 'Cần làm') {
        status = canApprove && status === 'Đã duyệt' ? 'Đã duyệt' : 'Chờ duyệt';
      }
    } else if (!canApprove && status === 'Đã duyệt') {
      status = 'Chờ duyệt';
    }

    var score = parseNumSafe(payload.score || progress);
    var grade = score >= 90 ? 'Xuất sắc (A+)' : (score >= 80 ? 'Tốt (A)' : (score >= 65 ? 'Đạt (B)' : 'Cần cố gắng (C)'));
    var bonus = parseNumSafe(payload.bonusAmount !== undefined ? payload.bonusAmount : (existingDisp ? existingDisp[10] : 2000000));

    var metaJson = JSON.stringify({
      notes: String(payload.notes || '').trim(),
      attachments: Array.isArray(payload.attachments) ? payload.attachments : []
    });

    var rowVals = [
      id,
      String(payload.period || (existingDisp ? existingDisp[1] : Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM'))).trim(),
      String(payload.empId || (existingDisp ? existingDisp[2] : '')).trim(),
      String(payload.fullName || (existingDisp ? existingDisp[3] : '')).trim(),
      String(payload.department || (existingDisp ? existingDisp[4] : '')).trim(),
      String(payload.goalTitle || (existingDisp ? existingDisp[5] : '')).trim(),
      parseNumSafe(payload.weight || (existingDisp ? existingDisp[6] : 100)),
      progress,
      score,
      grade,
      bonus,
      status,
      metaJson
    ];

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 13).setValues([rowVals]);
      sh.getRange(foundRow, 11).setNumberFormat('#,##0');
    } else {
      sh.appendRow(rowVals);
      sh.getRange(sh.getLastRow(), 11).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || rowVals[3], payload.actorRole || 'STAFF', 'SAVE_KPI', id, 'Cập nhật KPI [' + id + '] của ' + rowVals[3] + ': ' + progress + '% (' + status + ')');

    var fresh = getHrSystemData();
    fresh.message = '🏆 Đã lưu kết quả KPI của ' + rowVals[3] + ' (' + progress + '% - ' + status + ')!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu đánh giá KPI: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 6: ĐỘNG CƠ TÍNH LƯƠNG TỰ ĐỘNG & LƯU BẢNG LƯƠNG (BANG_LUONG_THANG)
// ============================================================================
function recalculateCurrentMonthPayroll(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = getHrSystemData();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var shPay = ss.getSheetByName('BANG_LUONG_THANG');
    var period = (payload && payload.period) ? String(payload.period).trim() : (data.config.CURRENT_PAYROLL_PERIOD || data.curMonthStr);
    var stdDays = parseNumSafe(data.config.STANDARD_WORK_DAYS || 26) || 26;
    var bhxhRate = (parseNumSafe(data.config.BHXH_EMP_RATE || 10.5) || 10.5) / 100.0;
    var otMult = parseNumSafe(data.config.OT_HOURLY_RATE_MULTIPLIER || 1.5) || 1.5;
    var personalDed = parseNumSafe(data.config.PERSONAL_DEDUCTION || 11000000) || 11000000;
    var depDed = parseNumSafe(data.config.DEPENDENT_DEDUCTION || 4400000) || 4400000;

    var emps = data.employees || [];
    var atts = data.attendance || [];
    var kpis = data.kpiReviews || [];
    var existingPays = data.payrolls || [];

    var newRows = [];
    emps.forEach(function(emp, idx) {
      // Tổng hợp công & OT từ bảng chấm công hoặc giữ mức chuẩn nếu đang trong kỳ
      var empAtts = atts.filter(function(a) { return a.empId === emp.id && String(a.date || '').indexOf(period) === 0; });
      var prevPay = existingPays.find(function(p) { return p.empId === emp.id && p.period === period; });

      var actualDays = prevPay ? prevPay.actualDays : stdDays;
      var otHours = prevPay ? prevPay.otHours : 0;
      if (empAtts.length >= 20) {
        actualDays = 0;
        otHours = 0;
        empAtts.forEach(function(a) {
          actualDays += Number(a.workUnits || 0);
          otHours += Number(a.otHours || 0);
        });
      }

      // Tổng hợp thưởng KPI
      var kpiBonus = 0;
      kpis.forEach(function(k) {
        if (k.empId === emp.id && k.period === period) {
          kpiBonus += Number(k.bonusAmount || 0);
        }
      });
      if (kpiBonus === 0 && prevPay) kpiBonus = prevPay.kpiBonus;

      var baseSal = Number(emp.baseSalary || 0);
      var insSal = Number(emp.insuranceSalary || (baseSal * 0.6));
      var allowance = Number(emp.allowance || 0);
      var workDaySalary = Math.round((baseSal / stdDays) * actualDays);
      var hourlyBase = (baseSal / stdDays) / 8.0;
      var otSalary = Math.round(hourlyBase * otMult * otHours);
      var grossSalary = workDaySalary + otSalary + allowance + kpiBonus;
      var insDeduction = Math.round(insSal * bhxhRate);

      // Tính thuế TNCN ước tính sau giảm trừ gia cảnh
      var taxableIncome = grossSalary - insDeduction - personalDed - (Number(emp.dependents || 0) * depDed);
      var tax = 0;
      if (taxableIncome > 0) {
        if (taxableIncome <= 5000000) tax = Math.round(taxableIncome * 0.05);
        else if (taxableIncome <= 10000000) tax = Math.round(250000 + (taxableIncome - 5000000) * 0.10);
        else if (taxableIncome <= 18000000) tax = Math.round(750000 + (taxableIncome - 10000000) * 0.15);
        else tax = Math.round(1950000 + (taxableIncome - 18000000) * 0.20);
      }

      var netSalary = grossSalary - insDeduction - tax;
      var plId = 'PL-' + period.replace('-', '') + '-0' + (idx + 1);
      var st = prevPay ? prevPay.status : 'Đã duyệt chốt lương';

      newRows.push([
        plId, period, emp.id, emp.fullName, emp.department, emp.position,
        baseSal, stdDays, actualDays, workDaySalary,
        otHours, otSalary, allowance, kpiBonus,
        grossSalary, insDeduction, tax, netSalary, st
      ]);
    });

    if (shPay.getLastRow() >= 3) {
      shPay.getRange(3, 1, shPay.getLastRow() - 2, 19).clearContent();
    }
    if (newRows.length > 0) {
      shPay.getRange(3, 1, newRows.length, 19).setValues(newRows);
      shPay.getRange(3, 2, newRows.length, 1).setNumberFormat('@');
      shPay.getRange(3, 7, newRows.length, 1).setNumberFormat('#,##0');
      shPay.getRange(3, 10, newRows.length, 1).setNumberFormat('#,##0');
      shPay.getRange(3, 12, newRows.length, 7).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendHrAuditLog((payload && payload.actor) || 'hr_mgr', 'HR_MANAGER', 'RECALC_PAYROLL', period, 'Tính tự động bảng lương kỳ ' + period + ' cho ' + newRows.length + ' nhân sự');

    var fresh = getHrSystemData();
    fresh.message = '💰 Đã tính toán & cập nhật tự động Bảng Lương kỳ ' + period + ' cho ' + newRows.length + ' nhân sự!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi tính bảng lương: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function saveSinglePayrollRow(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var shPay = ss.getSheetByName('BANG_LUONG_THANG');
    var id = String(payload.id || '').trim();
    if (!id) return { ok: false, message: 'Thiếu mã phiếu lương!' };

    var stdDays = parseNumSafe(payload.standardDays || 26) || 26;
    var actualDays = parseNumSafe(payload.actualDays);
    var baseSal = parseNumSafe(payload.baseSalary);
    var workDaySal = Math.round((baseSal / stdDays) * actualDays);
    var otHours = parseNumSafe(payload.otHours);
    var otSal = parseNumSafe(payload.otSalary !== undefined ? payload.otSalary : Math.round(((baseSal / stdDays) / 8.0) * 1.5 * otHours));
    var allowance = parseNumSafe(payload.allowance);
    var kpiBonus = parseNumSafe(payload.kpiBonus);
    var grossSal = workDaySal + otSal + allowance + kpiBonus;
    var insDed = parseNumSafe(payload.insuranceDeduction);
    var taxDed = parseNumSafe(payload.taxAndPenalty);
    var netSal = grossSal - insDed - taxDed;

    if (shPay.getLastRow() >= 3) {
      var ids = shPay.getRange(3, 1, shPay.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          var r = i + 3;
          shPay.getRange(r, 7, 1, 13).setValues([[
            baseSal, stdDays, actualDays, workDaySal,
            otHours, otSal, allowance, kpiBonus,
            grossSal, insDed, taxDed, netSal,
            String(payload.status || 'Đã duyệt chốt lương')
          ]]);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'hr_mgr', 'HR_MANAGER', 'UPDATE_PAYSLIP', id, 'Điều chỉnh phiếu lương ' + id + ' (Thực lĩnh: ' + netSal.toLocaleString('vi-VN') + ' đ)');
    var fresh = getHrSystemData();
    fresh.message = '✅ Đã cập nhật phiếu lương ' + id + '!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi cập nhật phiếu lương: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 7: UPLOAD ĐA FILE HỒ SƠ NHÂN SỰ / ĐƠN TỪ / KPI LÊN GOOGLE DRIVE
// ============================================================================
function uploadHrAttachment(payload) {
  try {
    var fileName = String(payload.fileName || 'Tai_Lieu_Nhan_Su.pdf').trim();
    var mimeType = String(payload.mimeType || 'application/octet-stream').trim();
    var base64Data = String(payload.base64Data || '').trim();
    var fileSize = String(payload.fileSize || '150 KB').trim();
    var uploadedBy = String(payload.uploadedBy || 'Nhân sự').trim();
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    var ext = fileName.indexOf('.') !== -1 ? fileName.split('.').pop().toLowerCase() : 'file';
    var attId = 'HRDOC-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmmss');

    var fileUrl = '';
    if (base64Data) {
      try {
        var folderName = 'GS001_HoSo_NhanSu_Uploads';
        var folders = DriveApp.getFoldersByName(folderName);
        var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
        var decoded = Utilities.base64Decode(base64Data);
        var blob = Utilities.newBlob(decoded, mimeType, fileName);
        var driveFile = folder.createFile(blob);
        try {
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (sErr) {}
        fileUrl = driveFile.getUrl();
      } catch (dErr) {
        fileUrl = String(payload.fallbackUrl || 'https://drive.google.com');
      }
    } else {
      fileUrl = String(payload.fallbackUrl || 'https://drive.google.com');
    }

    appendHrAuditLog(uploadedBy, payload.role || 'STAFF', 'UPLOAD_HR_FILE', payload.refId || 'HR', 'Tải lên tài liệu: ' + fileName + ' (' + fileSize + ')');

    return {
      ok: true,
      file: {
        id: attId,
        name: fileName,
        ext: ext,
        size: fileSize,
        url: fileUrl,
        uploadedBy: uploadedBy,
        uploadedAt: nowStr
      }
    };
  } catch (e) {
    return { ok: false, message: 'Lỗi tải tệp lên: ' + e.toString() };
  }
}

// ============================================================================
// API 8: BẮN PHIẾU LƯƠNG (PAYSLIP) & THÔNG BÁO QUA EMAIL + BOT ZALO
// ============================================================================
function sendPayslipNotification(payload) {
  try {
    var data = getHrSystemData();
    var cfg = data.config || {};
    var payId = String(payload.payId || '').trim();
    var p = (data.payrolls || []).find(function(x) { return x.id === payId; });
    if (!p) return { ok: false, message: 'Không tìm thấy phiếu lương ' + payId };

    var emp = (data.employees || []).find(function(e) { return e.id === p.empId; }) || {};
    var targetEmail = String(emp.email || cfg.ADMIN_EMAIL || '').trim();
    var targetPhone = String(emp.phone || '').trim();

    if (String(cfg.ENABLE_EMAIL_NOTIFICATION || 'TRUE').toUpperCase() === 'TRUE' && targetEmail && targetEmail.indexOf('@') > 0) {
      try {
        var htmlBody = '<div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;border:1px solid #cbd5e1;border-radius:12px;overflow:hidden;">' +
          '<div style="background:linear-gradient(135deg,#065f46,#047857);color:#fff;padding:18px 24px;">' +
          '<h2 style="margin:0;font-size:18px;">💰 PHIẾU LƯƠNG CHI TIẾT (PAYSLIP) — KỲ ' + p.period + '</h2>' +
          '<p style="margin:4px 0 0;font-size:12px;opacity:0.9;">' + (cfg.COMPANY_NAME || 'Hệ thống Quản lý Nhân sự & Tiền lương GS-001 Pro') + '</p>' +
          '</div>' +
          '<div style="padding:20px 24px;background:#fff;color:#1e293b;">' +
          '<p>Xin chào <b>' + p.fullName + '</b> (' + p.empId + ' — ' + p.department + '),</p>' +
          '<p>Phòng Nhân sự gửi đến bạn thông tin chi tiết Phiếu lương kỳ <b>' + p.period + '</b>:</p>' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px;margin:12px 0;">' +
          '<tr style="background:#f8fafc;"><td style="padding:8px;border:1px solid #e2e8f0;">Ngày công thực tế / Công chuẩn</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;"><b>' + p.actualDays + ' / ' + p.standardDays + ' công</b></td></tr>' +
          '<tr><td style="padding:8px;border:1px solid #e2e8f0;">Lương theo ngày công</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;">' + p.workDaySalary.toLocaleString('vi-VN') + ' đ</td></tr>' +
          '<tr style="background:#f8fafc;"><td style="padding:8px;border:1px solid #e2e8f0;">Lương Tăng ca OT (' + p.otHours + ' giờ)</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;">' + p.otSalary.toLocaleString('vi-VN') + ' đ</td></tr>' +
          '<tr><td style="padding:8px;border:1px solid #e2e8f0;">Phụ cấp + Thưởng KPI</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;">' + (p.allowance + p.kpiBonus).toLocaleString('vi-VN') + ' đ</td></tr>' +
          '<tr style="background:#ecfdf5;font-weight:bold;"><td style="padding:8px;border:1px solid #e2e8f0;">Tổng thu nhập (Gross)</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;color:#047857;">' + p.grossSalary.toLocaleString('vi-VN') + ' đ</td></tr>' +
          '<tr><td style="padding:8px;border:1px solid #e2e8f0;">Trích BHXH (10.5%) & Thuế TNCN</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;color:#dc2626;">-' + (p.insuranceDeduction + p.taxAndPenalty).toLocaleString('vi-VN') + ' đ</td></tr>' +
          '<tr style="background:#fef3c7;font-weight:bold;font-size:15px;"><td style="padding:10px;border:1px solid #e2e8f0;">THỰC LĨNH (NET PAY)</td><td style="padding:10px;border:1px solid #e2e8f0;text-align:right;color:#b45309;">' + p.netSalary.toLocaleString('vi-VN') + ' đ</td></tr>' +
          '</table>' +
          '</div></div>';

        MailApp.sendEmail({
          to: targetEmail,
          subject: '[PHIẾU LƯƠNG ' + p.period + '] ' + p.fullName + ' (' + p.empId + ')',
          htmlBody: htmlBody
        });
      } catch (mErr) {}
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var shPay = ss.getSheetByName('BANG_LUONG_THANG');
    if (shPay && p.rowIndex) {
      shPay.getRange(p.rowIndex, 19).setValue('Đã gửi Email/Zalo');
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'hr_mgr', 'HR_MANAGER', 'SEND_PAYSLIP', payId, 'Gửi Phiếu lương kỳ ' + p.period + ' qua Email & Zalo cho ' + p.fullName + ' (' + targetPhone + ')');

    var fresh = getHrSystemData();
    fresh.message = '📨 Đã gửi Phiếu lương [' + payId + '] qua Email & Bot Zalo cho ' + p.fullName + '!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi gửi phiếu lương: ' + e.toString() };
  }
}

function sendBatchPayslipNotifications(payload) {
  try {
    var ss = ensureHrSheetsExist();
    var shPay = ss.getSheetByName('BANG_LUONG_THANG');
    var count = 0;
    if (shPay && shPay.getLastRow() >= 3) {
      var num = shPay.getLastRow() - 2;
      for (var i = 0; i < num; i++) {
        shPay.getRange(i + 3, 19).setValue('Đã gửi Email/Zalo');
        count++;
      }
    }
    SpreadsheetApp.flush();
    appendHrAuditLog((payload && payload.actor) || 'hr_mgr', 'HR_MANAGER', 'BATCH_SEND_PAYSLIPS', 'ALL', 'Bắn hàng loạt ' + count + ' Phiếu lương qua Email & Bot Zalo');
    var fresh = getHrSystemData();
    fresh.message = '🚀 Đã bắn tự động toàn bộ ' + count + ' Phiếu lương (Payslip) qua Email & Bot Zalo thành công!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi gửi hàng loạt: ' + e.toString() };
  }
}

// ============================================================================
// API 9: QUẢN LÝ TÀI KHOẢN PHÂN QUYỀN (PHAN_QUYEN) & CẤU HÌNH HỆ THỐNG
// ============================================================================
function saveHrUserAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('PHAN_QUYEN');
    if (sh.getMaxColumns() < 10) sh.insertColumnsAfter(sh.getMaxColumns(), 10 - sh.getMaxColumns());

    var uname = String(payload.username || '').trim().toLowerCase();
    if (!uname) return { ok: false, message: 'Vui lòng nhập Username!' };

    var rowVals = [
      uname,
      String(payload.password || '123456').trim(),
      String(payload.empId || 'NV-NEW').trim(),
      String(payload.fullName || uname).trim(),
      String(payload.role || 'STAFF').trim().toUpperCase(),
      String(payload.department || 'Phòng Kinh Doanh & CRM').trim(),
      String(payload.email || '').trim(),
      String(payload.phone || '').trim(),
      String(payload.status || 'Hoạt động').trim(),
      String(payload.permissions || '').trim()
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
      sh.getRange(found, 1, 1, 10).setValues([rowVals]);
      sh.getRange(found, 2).setNumberFormat('@');
      sh.getRange(found, 8).setNumberFormat('@');
    } else {
      sh.appendRow(rowVals);
      var lr = sh.getLastRow();
      sh.getRange(lr, 2).setNumberFormat('@');
      sh.getRange(lr, 8).setNumberFormat('@');
    }

    // Tự động đồng bộ sang bảng HO_SO_NHAN_SU nếu mã nhân viên chưa tồn tại để tài khoản mới thao tác chấm công/xin nghỉ/xem phiếu lương được ngay!
    var shEmp = ss.getSheetByName('HO_SO_NHAN_SU');
    if (shEmp && rowVals[2]) {
      var empExists = false;
      if (shEmp.getLastRow() >= 3) {
        var eIds = shEmp.getRange(3, 1, shEmp.getLastRow() - 2, 1).getDisplayValues();
        for (var j = 0; j < eIds.length; j++) {
          if (String(eIds[j][0]).trim() === rowVals[2]) {
            empExists = true;
            break;
          }
        }
      }
      if (!empExists) {
        var todayStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
        shEmp.appendRow([
          rowVals[2], rowVals[3], rowVals[5],
          rowVals[4] === 'LEADER' ? 'Trưởng Nhóm (Team Lead)' : 'Chuyên Viên',
          rowVals[4], rowVals[7], rowVals[6], todayStr,
          'Hợp đồng 12 tháng', '', 15000000, 9500000, 1500000, 0,
          '', 'Đang làm việc', '[]'
        ]);
      }
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'admin', payload.actorRole || 'ADMIN', 'SAVE_USER_RBAC', uname, 'Lưu tài khoản & quyền thao tác cho: ' + rowVals[3] + ' [' + rowVals[4] + ']');
    var fresh = getHrSystemData();
    fresh.message = '🔐 Đã lưu tài khoản & đồng bộ hồ sơ nhân sự cho: ' + rowVals[3] + ' (' + uname + ')!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu tài khoản: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteHrUserAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('PHAN_QUYEN');
    var uname = String(payload.username || '').trim().toLowerCase();
    if (!uname || uname === 'admin') return { ok: false, message: 'Không thể xóa tài khoản gốc admin!' };
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
    appendHrAuditLog(payload.actor || 'admin', 'ADMIN', 'DELETE_USER_RBAC', uname, 'Xóa tài khoản: ' + uname);
    var fresh = getHrSystemData();
    fresh.message = '🗑️ Đã xóa tài khoản ' + uname;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi xóa tài khoản: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function saveHrSystemConfig(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var shCfg = ss.getSheetByName('CAU_HINH');
    if (shCfg && shCfg.getLastRow() >= 3 && payload.config) {
      var keys = shCfg.getRange(3, 1, shCfg.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < keys.length; i++) {
        var k = String(keys[i][0] || '').trim();
        if (k && payload.config[k] !== undefined) {
          shCfg.getRange(i + 3, 2).setValue(String(payload.config[k]).trim());
        }
      }
    }
    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'admin', 'ADMIN', 'SAVE_HR_CONFIG', 'CAU_HINH', 'Cập nhật cấu hình Định mức BHXH/Thuế & Bot Thông báo');
    var fresh = getHrSystemData();
    fresh.message = '⚙️ Đã lưu cấu hình Định mức Nhân sự, BHXH, Thuế TNCN & Bot Email/Zalo!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu cấu hình: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}


```

## 📁 FILE 4: `Index.html`

```
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>GS-001 v4.0 Pro • Quản Lý Nhân Sự, Chấm Công, KPI & Tính Lương Tự Động</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --primary: #1E3A8A;
      --primary-light: #2563EB;
      --emerald: #047857;
      --amber: #D97706;
      --bg-soft: #F1F5F9;
      --card-bg: #FFFFFF;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-soft);
      color: #0F172A;
      margin: 0;
      padding-bottom: 78px;
      overflow-x: hidden;
    }
    body.pseudo-fullscreen {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow-y: auto;
      z-index: 9990;
    }

    /* AUTH GATE LOGIN OVERLAY */
    .auth-gate-overlay {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at top right, #1E3A8A, #0F172A 72%);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .auth-card {
      width: 100%;
      max-width: 480px;
      background: rgba(15, 23, 42, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 18px;
      padding: 24px;
      color: #FFFFFF;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
    }

    /* TOPBAR */
    .app-topbar {
      background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #047857 100%);
      color: #FFFFFF;
      padding: 10px 16px;
      position: sticky;
      top: 0;
      z-index: 1030;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.22);
    }
    .btn-fullscreen-pro {
      background: linear-gradient(135deg, #F59E0B, #EA580C);
      color: #fff;
      border: none;
      font-weight: 700;
      border-radius: 8px;
      padding: 5px 12px;
      font-size: 0.78rem;
      box-shadow: 0 2px 8px rgba(234, 88, 12, 0.4);
      transition: transform 0.15s;
    }
    .btn-fullscreen-pro:hover { transform: translateY(-1px); color: #fff; }

    .role-scope-bar {
      background: #EFF6FF;
      border-bottom: 1px solid #BFDBFE;
      padding: 7px 16px;
      font-size: 0.8rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    /* DESKTOP NAV TABS */
    .desktop-nav-bar {
      background: #FFFFFF;
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
      font-size: 0.83rem;
      padding: 8px 14px;
      border-radius: 10px;
      transition: all 0.18s;
    }
    .nav-tab-btn:hover { background: #F1F5F9; color: #1E3A8A; }
    .nav-tab-btn.active {
      background: linear-gradient(135deg, #1E3A8A, #2563EB);
      color: #FFFFFF;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.28);
    }

    /* CARDS & KPI */
    .section-card {
      background: var(--card-bg);
      border-radius: 14px;
      border: 1px solid #E2E8F0;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }
    .kpi-card {
      background: #FFFFFF;
      border-radius: 12px;
      padding: 12px 14px;
      border: 1px solid #E2E8F0;
      height: 100%;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    }
    .kpi-val {
      font-size: 1.25rem;
      font-weight: 800;
      margin-top: 2px;
    }

    /* FILE ATTACHMENT CHIPS */
    .att-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.73rem;
      font-weight: 600;
      text-decoration: none;
      border: 1px solid transparent;
    }
    .att-word { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; }
    .att-excel { background: #ECFDF5; color: #047857; border-color: #A7F3D0; }
    .att-ppt { background: #FFF7ED; color: #C2410C; border-color: #FED7AA; }
    .att-pdf { background: #FEF2F2; color: #B91C1C; border-color: #FECACA; }
    .att-img { background: #F5F3FF; color: #6D28D9; border-color: #DDD6FE; }
    .att-other { background: #F8FAFC; color: #334155; border-color: #CBD5E1; }

    .btn-zalo-quick {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: #0068FF;
      color: #fff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      text-decoration: none;
    }
    .btn-zalo-quick:hover { color: #fff; opacity: 0.9; }

    /* MOBILE BOTTOM NAV & FABS */
    .mobile-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border-top: 1px solid #CBD5E1;
      display: flex;
      justify-content: space-around;
      padding: 6px 4px;
      z-index: 1025;
      box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);
    }
    @media (min-width: 992px) {
      .mobile-bottom-nav { display: none; }
      body { padding-bottom: 24px; }
    }
    .mob-nav-item {
      border: none;
      background: transparent;
      color: #64748B;
      font-size: 0.7rem;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 4px 8px;
      border-radius: 8px;
    }
    .mob-nav-item i { font-size: 1.1rem; }
    .mob-nav-item.active { color: #1E3A8A; font-weight: 800; }

    .mobile-fab-group {
      position: fixed;
      right: 16px;
      bottom: 72px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1020;
    }
    .fab-btn {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      border: none;
      color: #fff;
      font-size: 1.2rem;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* CUSTOM MODALS */
    .custom-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      z-index: 1055;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 12px;
    }
    .custom-modal-dialog {
      background: #FFFFFF;
      border-radius: 16px;
      width: 100%;
      max-width: 680px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
    }
    .custom-modal-header {
      background: linear-gradient(135deg, #1E3A8A, #2563EB);
      color: #FFFFFF;
      padding: 12px 18px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .custom-modal-body { padding: 16px 18px; max-height: 78vh; overflow-y: auto; }
    .custom-modal-footer {
      padding: 10px 18px;
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
      z-index: 1090;
      max-width: 380px;
    }

    @media print {
      .app-topbar, .role-scope-bar, .desktop-nav-bar, .mobile-bottom-nav, .mobile-fab-group, .no-print {
        display: none !important;
      }
      body { background: #fff; padding: 0; }
      .section-card { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>

<div id="appToastContainer"></div>

<!-- ======================================================================= -->
<!-- 1. CỔNG ĐĂNG NHẬP BẢO MẬT & PHÂN QUYỀN 4 CẤP (AUTH GATE)               -->
<!-- ======================================================================= -->
<div class="auth-gate-overlay" id="authGateScreen">
  <div class="auth-card">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="badge bg-info text-dark fw-bold">GS-001 v4.0 Commercial Pro</span>
      <button type="button" class="btn-fullscreen-pro" onclick="toggleFullScreenMode()">
        <i class="bi bi-arrows-fullscreen"></i> Toàn Màn Hình
      </button>
    </div>
    <h5 class="fw-bold mb-1">👥 Cổng Quản Trị Nhân Sự, Chấm Công & Tiền Lương</h5>
    <p class="small text-light opacity-75 mb-3">
      Đăng nhập theo đúng vai trò (<b>CEO / GĐ Nhân Sự / Team Lead / Nhân viên</b>). Hệ thống tự động khóa phiên bảo mật và mở đúng công cụ thao tác của từng cấp.
    </p>

    <div id="loginErrorAlert" class="alert alert-danger py-2 small d-none"></div>

    <div class="mb-2">
      <label class="form-label small fw-bold mb-1">Tên đăng nhập (Username)</label>
      <input type="text" id="loginUsername" class="form-control form-control-sm" value="admin" placeholder="Nhập username...">
    </div>
    <div class="mb-3">
      <label class="form-label small fw-bold mb-1">Mật khẩu / Mã PIN</label>
      <input type="password" id="loginPassword" class="form-control form-control-sm" value="123456" placeholder="Nhập mật khẩu...">
    </div>

    <div class="d-grid gap-2 mb-3">
      <button type="button" class="btn btn-primary fw-bold py-2" onclick="handleLoginSubmit()">
        <i class="bi bi-shield-lock-fill me-1"></i> Đăng Nhập Vào Hệ Thống
      </button>
      <button type="button" class="btn btn-warning fw-bold py-2 text-dark" onclick="loginAndGoFullScreen()">
        <i class="bi bi-arrows-fullscreen me-1"></i> Đăng Nhập & Mở Toàn Màn Hình
      </button>
    </div>

    <div class="p-2 rounded-3" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.14);">
      <div class="small text-warning fw-bold mb-1">💡 Chạm điền nhanh tài khoản để kiểm tra phân quyền 4 cấp:</div>
      <div class="d-flex flex-wrap gap-1">
        <button type="button" class="btn btn-xs btn-outline-light py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('admin','123456')">👑 CEO (admin)</button>
        <button type="button" class="btn btn-xs btn-outline-info py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('hr_mgr','123456')">💼 GĐ Nhân Sự (hr_mgr)</button>
        <button type="button" class="btn btn-xs btn-outline-primary py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('tech_lead','123456')">⚡ Tech Lead (tech_lead)</button>
        <button type="button" class="btn btn-xs btn-outline-success py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('sale_lead','123456')">🌟 Sale Lead (sale_lead)</button>
        <button type="button" class="btn btn-xs btn-outline-warning py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('nv_anh','123456')">🎨 NV UI/UX (nv_anh)</button>
        <button type="button" class="btn btn-xs btn-outline-warning py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('nv_minh','666666')">🆕 NV Sale Mới (nv_minh)</button>
      </div>
    </div>
  </div>
</div>

<!-- ======================================================================= -->
<!-- 2. THANH TOPBAR & BANNER KHÓA PHIÊN PHÂN QUYỀN                          -->
<!-- ======================================================================= -->
<header class="app-topbar">
  <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
    <div class="d-flex align-items-center gap-2">
      <span class="badge bg-warning text-dark fw-bold px-2 py-1">GS-001 PRO</span>
      <div>
        <div class="fw-bold" style="font-size:0.95rem;" id="topCompanyName">CÔNG TY CỔ PHẦN CÔNG NGHỆ & GIẢI PHÁP SỐ NOVA-HR</div>
        <div class="small opacity-75" style="font-size:0.73rem;">Hệ thống Quản lý Nhân sự, Chấm công Ca/GPS, Đơn từ, KPI & Tính lương tự động v4.0</div>
      </div>
    </div>

    <div class="d-flex flex-wrap align-items-center gap-2">
      <span class="badge bg-success bg-opacity-75 small" id="syncStatusBadge">
        <i class="bi bi-cloud-check"></i> Đã đồng bộ Sheet
      </span>
      <button type="button" class="btn-fullscreen-pro" id="btnToggleFullScreen" onclick="toggleFullScreenMode()">
        <span id="txtFullScreen">🔲 Toàn Màn Hình</span>
      </button>
      <button type="button" class="btn btn-sm btn-warning fw-bold text-dark py-1 px-2" id="btnTopBatchPayslip" onclick="triggerBatchSendPayslips()">
        <i class="bi bi-send-check-fill"></i> Bắn Phiếu Lương Email/Zalo
      </button>
      <button type="button" class="btn btn-sm btn-outline-light py-1 px-2" onclick="refreshAllDataFromServer()">
        <i class="bi bi-arrow-clockwise"></i> Làm mới
      </button>
      <span class="badge bg-light text-dark fw-bold px-2 py-1" id="currentUserBadge">👤 Nguyễn Quản Trị [ADMIN]</span>
      <button type="button" class="btn btn-sm btn-danger fw-bold py-1 px-2" onclick="handleLogout()">
        <i class="bi bi-power"></i> Đổi TK
      </button>
    </div>
  </div>
</header>

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

<!-- THANH ĐIỀU HƯỚNG 6 PHÂN HỆ -->
<nav class="desktop-nav-bar">
  <button type="button" class="nav-tab-btn active" id="deskTab_dashboard" onclick="switchMainTab('dashboard')">
    <i class="bi bi-speedometer2"></i> <span id="lblDeskTabDashboard">1. Tổng Quan & Chấm Công 1 Chạm</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_employees" onclick="switchMainTab('employees')">
    <i class="bi bi-people-fill"></i> <span id="lblDeskTabEmployees">2. Hồ Sơ Nhân Sự & Hợp Đồng</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_attendance" onclick="switchMainTab('attendance')">
    <i class="bi bi-calendar2-check-fill"></i> <span id="lblDeskTabAttendance">3. Bảng Chấm Công & Tăng Ca (OT)</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_leaves" onclick="switchMainTab('leaves')">
    <i class="bi bi-envelope-paper-fill"></i> <span id="lblDeskTabLeaves">4. Duyệt Đơn Nghỉ Phép & Tăng Ca</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_payroll" onclick="switchMainTab('payroll')">
    <i class="bi bi-cash-coin"></i> <span id="lblDeskTabPayroll">5. Bảng Tính Lương & Phiếu Lương (Payslip)</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_kpi" onclick="switchMainTab('kpi')">
    <i class="bi bi-trophy-fill"></i> <span id="lblDeskTabKpi">6. Đánh Giá KPI, Phân Quyền & Cấu Hình</span>
  </button>
</nav>

<!-- ======================================================================= -->
<!-- 3. NỘI DUNG CHÍNH 6 TABS (TỰ ĐỘNG CÔ LẬP DỮ LIỆU THEO QUYỀN RBAC)       -->
<!-- ======================================================================= -->
<main class="container-fluid py-3 px-2 px-md-3">

  <!-- ===================================================================== -->
  <!-- TAB 1: DASHBOARD TỔNG QUAN & CHẤM CÔNG NHANH 1 CHẠM                   -->
  <!-- ===================================================================== -->
  <section id="tabPane_dashboard" class="tab-pane-section">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h5 class="fw-bold mb-0 text-dark" id="dashboardHeaderTitle">📊 Trung Tâm Điều Hành Nhân Sự, Chấm Công & Quỹ Lương</h5>
        <div class="text-muted small">Đồng bộ lúc: <span id="lblServerTime">-</span> | Ngày: <span id="lblTodayStr" class="fw-bold text-primary">-</span> | Kỳ lương: <span id="lblCurMonthStr" class="badge bg-primary">-</span></div>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button type="button" class="btn btn-success btn-sm fw-bold" onclick="quickSelfCheckIn('IN')">
          <i class="bi bi-geo-alt-fill"></i> ⚡ Chấm Công Vào Ca (Check-in)
        </button>
        <button type="button" class="btn btn-warning btn-sm fw-bold text-dark" onclick="quickSelfCheckIn('OUT')">
          <i class="bi bi-clock-history"></i> 🏁 Chấm Công Ra Ca (Check-out)
        </button>
        <button type="button" class="btn btn-primary btn-sm fw-bold" onclick="openLeaveModal()">
          <i class="bi bi-plus-circle"></i> + Gửi Đơn Nghỉ Phép / Tăng Ca OT
        </button>
        <button type="button" class="btn btn-dark btn-sm fw-bold" id="btnDashNewEmployee" onclick="openEmployeeModal()">
          <i class="bi bi-person-plus-fill"></i> + Thêm Nhân Sự Mới
        </button>
      </div>
    </div>

    <!-- 6 Thẻ KPI Tổng hợp -->
    <div class="row g-2 mb-3">
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-primary">
          <div class="text-muted small fw-semibold" id="lblKpiEmpTitle">NHÂN SỰ TRONG LUỒNG</div>
          <div class="kpi-val text-primary" id="kpiTotalEmployees">0</div>
          <div class="small text-secondary mt-1">Đang làm việc chính thức</div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-success">
          <div class="text-muted small fw-semibold">CHẤM CÔNG HÔM NAY</div>
          <div class="kpi-val text-success" id="kpiTodayCheckIn">0</div>
          <div class="small text-secondary mt-1">Tổng giờ OT: <b id="kpiTotalOtHours">0h</b></div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-warning">
          <div class="text-muted small fw-semibold">ĐƠN TỪ CHỜ DUYỆT</div>
          <div class="kpi-val text-warning" id="kpiPendingLeaves">0</div>
          <div class="small text-danger mt-1">Nghỉ phép & Đăng ký OT</div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-info">
          <div class="text-muted small fw-semibold">ĐIỂM KPI TRUNG BÌNH</div>
          <div class="kpi-val text-info" id="kpiAvgScore">0%</div>
          <div class="small text-secondary mt-1">Tổng thưởng KPI: <b id="kpiTotalBonus">0 đ</b></div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-danger">
          <div class="text-muted small fw-semibold">HỢP ĐỒNG SẮP HẾT HẠN</div>
          <div class="kpi-val text-danger" id="kpiExpiringContracts">0</div>
          <div class="small text-secondary mt-1">Trong vòng 30 ngày tới</div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-dark">
          <div class="text-muted small fw-semibold" id="lblKpiPayrollTitle">THỰC LĨNH (NET PAY)</div>
          <div class="kpi-val text-success" id="kpiTotalNetPayroll">0 đ</div>
          <div class="small text-secondary mt-1">Đã trừ BHXH & Thuế TNCN</div>
        </div>
      </div>
    </div>

    <!-- Khu vực Cần xử lý ngay: Đơn từ chờ duyệt & Hợp đồng sắp hết hạn -->
    <div class="row g-3 mb-3">
      <div class="col-12 col-lg-6">
        <div class="section-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold text-warning mb-0"><i class="bi bi-envelope-exclamation-fill me-1"></i> Đơn Xin Nghỉ Phép & Đăng Ký Tăng Ca (OT) Cần Xử Lý</h6>
            <span class="badge bg-warning text-dark" id="badgeDashPendingLeaves">0 đơn</span>
          </div>
          <div id="dashPendingLeavesBox" class="d-flex flex-column gap-2"></div>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="section-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold text-primary mb-0"><i class="bi bi-clock-fill me-1"></i> Bảng Chấm Công Hôm Nay & Cảnh Báo Hợp Đồng</h6>
            <button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" onclick="openAttendanceModal()">+ Ghi nhận công</button>
          </div>
          <div id="dashTodayAttendanceBox" class="d-flex flex-column gap-2"></div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ Phân tích Nhân sự & Quỹ lương -->
    <div class="row g-3">
      <div class="col-12 col-lg-6">
        <div class="section-card">
          <h6 class="fw-bold mb-3"><i class="bi bi-bar-chart-fill text-success me-1"></i> Cơ Cấu Thu Nhập & Thực Lĩnh (Net Pay) Theo Nhân Sự</h6>
          <div style="height:250px;"><canvas id="chartPayrollBreakdown"></canvas></div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="section-card">
          <h6 class="fw-bold mb-3"><i class="bi bi-pie-chart-fill text-primary me-1"></i> Tỷ Lệ Nhân Sự Theo Phòng Ban</h6>
          <div style="height:250px;"><canvas id="chartDeptDistribution"></canvas></div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="section-card">
          <h6 class="fw-bold mb-3"><i class="bi bi-award-fill text-warning me-1"></i> Xếp Loại Đánh Giá KPI</h6>
          <div style="height:250px;"><canvas id="chartKpiGrades"></canvas></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 2: HỒ SƠ NHÂN SỰ, HỢP ĐỒNG & TÀI LIỆU ĐÍNH KÈM (WORD/EXCEL/PDF)   -->
  <!-- ===================================================================== -->
  <section id="tabPane_employees" class="tab-pane-section d-none">
    <div class="section-card">
      <div class="row g-2 align-items-center mb-3">
        <div class="col-12 col-md-4">
          <input type="text" id="filterEmpSearch" class="form-control form-control-sm" placeholder="🔍 Tìm mã NV, họ tên, SĐT, chức vụ, file..." oninput="renderEmployeesSection()">
        </div>
        <div class="col-6 col-md-3">
          <select id="filterEmpDept" class="form-select form-select-sm fw-semibold" onchange="renderEmployeesSection()">
            <option value="ALL">-- Tất cả Phòng ban --</option>
            <option value="Ban Giám Đốc">Ban Giám Đốc</option>
            <option value="Phòng Hành Chính - Nhân Sự">Phòng Hành Chính - Nhân Sự</option>
            <option value="Khối Kỹ Thuật & Công Nghệ">Khối Kỹ Thuật & Công Nghệ</option>
            <option value="Phòng Kinh Doanh & CRM">Phòng Kinh Doanh & CRM</option>
          </select>
        </div>
        <div class="col-6 col-md-5 text-end">
          <button type="button" class="btn btn-primary btn-sm fw-bold" id="btnEmpTabNew" onclick="openEmployeeModal()">
            <i class="bi bi-person-plus-fill"></i> + Thêm Hồ Sơ Nhân Sự & Đính Kèm Hợp Đồng
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0" style="font-size:0.83rem;">
          <thead class="table-light">
            <tr>
              <th>Mã NV</th>
              <th>Họ và Tên & Liên Hệ</th>
              <th>Phòng Ban & Chức Vụ</th>
              <th>Loại Hợp Đồng & Hạn</th>
              <th class="text-end">Lương Cơ Bản</th>
              <th class="text-end">Phụ Cấp</th>
              <th>Hồ Sơ Đính Kèm (Word/PDF/CCCD)</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody id="employeesTableBody"></tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 3: BẢNG CHẤM CÔNG HÀNG NGÀY, CA LÀM VIỆC & GIỜ TĂNG CA (OT)       -->
  <!-- ===================================================================== -->
  <section id="tabPane_attendance" class="tab-pane-section d-none">
    <div class="section-card">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h6 class="fw-bold mb-0"><i class="bi bi-calendar2-check-fill text-success me-1"></i> Nhật Ký Chấm Công Ca Làm Việc, Tăng Ca (OT) & Vị Trí Làm Việc</h6>
          <div class="text-muted small">Nhân sự có thể bấm Chấm công Vào/Ra ca 1 chạm hoặc Quản lý/HR ghi nhận công chi tiết</div>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-success btn-sm fw-bold" onclick="quickSelfCheckIn('IN')">⚡ Chấm Vào Ca Ngay</button>
          <button type="button" class="btn btn-warning btn-sm fw-bold text-dark" onclick="quickSelfCheckIn('OUT')">🏁 Chấm Ra Ca Ngay</button>
          <button type="button" class="btn btn-primary btn-sm fw-bold" onclick="openAttendanceModal()">+ Ghi Nhận Chấm Công / OT</button>
        </div>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-12 col-md-4">
          <input type="text" id="filterAttSearch" class="form-control form-control-sm" placeholder="🔍 Tìm theo tên nhân sự, ngày, ghi chú..." oninput="renderAttendanceSection()">
        </div>
        <div class="col-6 col-md-4">
          <select id="filterAttEmployee" class="form-select form-select-sm fw-semibold" onchange="renderAttendanceSection()">
            <option value="ALL">-- Tất cả Nhân sự trong phạm vi --</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <select id="filterAttMode" class="form-select form-select-sm" onchange="renderAttendanceSection()">
            <option value="ALL">-- Tất cả Hình thức làm việc --</option>
            <option value="Văn phòng Công ty">🏢 Văn phòng Công ty</option>
            <option value="Làm việc từ xa (WFH)">🏠 Làm việc từ xa (WFH)</option>
            <option value="Đi gặp Khách hàng (Thị trường)">🚗 Đi gặp Khách hàng (Thị trường)</option>
          </select>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle mb-0" style="font-size:0.83rem;">
          <thead class="table-light">
            <tr>
              <th>Mã CC & Ngày</th>
              <th>Nhân Sự & Phòng Ban</th>
              <th>Ca Làm Việc</th>
              <th class="text-center">Giờ Vào - Giờ Ra</th>
              <th class="text-center">Số Công</th>
              <th class="text-center">Giờ Tăng Ca (OT)</th>
              <th>Hình Thức & Trạng Thái</th>
              <th>Ghi Chú Công Việc Trong Ca</th>
              <th class="text-center">Sửa</th>
            </tr>
          </thead>
          <tbody id="attendanceTableBody"></tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 4: QUẢN LÝ & PHÊ DUYỆT ĐƠN TỪ (NGHỈ PHÉP, TĂNG CA OT, CÔNG TÁC)    -->
  <!-- ===================================================================== -->
  <section id="tabPane_leaves" class="tab-pane-section d-none">
    <div class="section-card">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h6 class="fw-bold mb-0"><i class="bi bi-envelope-paper-fill text-warning me-1"></i> Quản Lý Đơn Xin Nghỉ Phép, Đăng Ký Tăng Ca (OT) & Đi Công Tác</h6>
          <div class="text-muted small">Nhân viên gửi đơn kèm file chứng từ; Trưởng nhóm (`LEADER`) và GĐ Nhân sự (`HR_MANAGER` / `ADMIN`) duyệt 1 chạm</div>
        </div>
        <button type="button" class="btn btn-primary btn-sm fw-bold" onclick="openLeaveModal()">
          <i class="bi bi-plus-circle"></i> + Tạo Đơn Xin Nghỉ Phép / Đăng Ký Tăng Ca OT
        </button>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-12 col-md-5">
          <input type="text" id="filterLeaveSearch" class="form-control form-control-sm" placeholder="🔍 Tìm mã đơn, tên nhân sự, lý do..." oninput="renderLeavesSection()">
        </div>
        <div class="col-6 col-md-4">
          <select id="filterLeaveStatus" class="form-select form-select-sm fw-semibold" onchange="renderLeavesSection()">
            <option value="ALL">-- Tất cả Trạng thái đơn --</option>
            <option value="Chờ duyệt">⏳ Đang chờ Quản lý / HR duyệt</option>
            <option value="Đã duyệt">✅ Đã phê duyệt</option>
            <option value="Từ chối">↩️ Từ chối / Yêu cầu bổ sung</option>
          </select>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered align-middle mb-0" style="font-size:0.83rem;">
          <thead class="table-light">
            <tr>
              <th>Mã Đơn & Ngày Gửi</th>
              <th>Nhân Sự & Phòng Ban</th>
              <th>Loại Đơn Từ</th>
              <th>Thời Gian & Số Lượng</th>
              <th>Lý Do & Bàn Giao Công Việc</th>
              <th>Tệp Chứng Từ Đính Kèm</th>
              <th>Trạng Thái & Người Duyệt</th>
              <th class="text-center">Thao Tác Phê Duyệt / Sửa</th>
            </tr>
          </thead>
          <tbody id="leavesTableBody"></tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 5: BẢNG TÍNH LƯƠNG TỰ ĐỘNG & IN PHIẾU LƯƠNG CÁ NHÂN (PAYSLIP A4)  -->
  <!-- ===================================================================== -->
  <section id="tabPane_payroll" class="tab-pane-section d-none">
    <div class="section-card">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h6 class="fw-bold mb-0" id="lblPayrollHeader"><i class="bi bi-cash-coin text-success me-1"></i> Bảng Tính Lương Tự Động, Phụ Cấp, BHXH (10.5%), Thuế TNCN & Phiếu Lương</h6>
          <div class="text-muted small">Công thức tự động: `Thực Lĩnh (Net) = Lương Ngày Công + Lương Tăng Ca OT + Phụ Cấp + Thưởng KPI - BHXH (10.5%) - Thuế TNCN`</div>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-success btn-sm fw-bold" id="btnRecalcPayroll" onclick="handleRecalculatePayroll()">
            <i class="bi bi-calculator-fill"></i> 🔄 Tính Lại Bảng Lương Tự Động
          </button>
          <button type="button" class="btn btn-warning btn-sm fw-bold text-dark" id="btnBatchPayslipTab" onclick="triggerBatchSendPayslips()">
            <i class="bi bi-send-check-fill"></i> 📨 Bắn Phiếu Lương Hàng Loạt (Email + Zalo)
          </button>
          <button type="button" class="btn btn-dark btn-sm fw-bold" onclick="window.print()">
            <i class="bi bi-printer-fill"></i> 🖨️ In Bảng Lương / Phiếu Lương A4
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle mb-0" style="font-size:0.8rem;">
          <thead class="table-light">
            <tr>
              <th>Mã PL & Kỳ</th>
              <th>Nhân Sự & Phòng Ban</th>
              <th class="text-end">Lương Cơ Bản</th>
              <th class="text-center">Công Thực Tế</th>
              <th class="text-end">Lương Ngày Công</th>
              <th class="text-end">Lương OT</th>
              <th class="text-end">Phụ Cấp + KPI</th>
              <th class="text-end">Tổng Gross</th>
              <th class="text-end text-danger">Trừ BHXH + Thuế</th>
              <th class="text-end text-success fw-bold">Thực Lĩnh (NET)</th>
              <th>Trạng Thái</th>
              <th class="text-center no-print">Phiếu Lương</th>
            </tr>
          </thead>
          <tbody id="payrollTableBody"></tbody>
        </table>
      </div>
    </div>

    <!-- KHUNG XEM & IN PHIẾU LƯƠNG CÁ NHÂN A4 (PAYSLIP PREVIEW) -->
    <div class="section-card border border-dark" id="payslipPreviewCard">
      <div class="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3">
        <div>
          <h6 class="fw-bold mb-0" id="printCompanyTitle">CÔNG TY CỔ PHẦN CÔNG NGHỆ & GIẢI PHÁP SỐ NOVA-HR</h6>
          <div class="small text-muted">PHIẾU LƯƠNG CHI TIẾT CÁ NHÂN (OFFICIAL EMPLOYEE PAYSLIP)</div>
        </div>
        <div class="text-end small">
          <div>Ngày xuất phiếu: <b id="printDateNow">-</b></div>
          <div>Người lập / Xem: <b id="printActorName">Admin</b></div>
        </div>
      </div>
      <div id="payslipDetailBox"></div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 6: ĐÁNH GIÁ KPI, BẢNG ĐIỀU HÀNH PHÂN QUYỀN (`PHAN_QUYEN`) & BOT   -->
  <!-- ===================================================================== -->
  <section id="tabPane_kpi" class="tab-pane-section d-none">
    <div class="row g-3 mb-3">
      <!-- Bảng Đánh Giá KPI Nhân Sự -->
      <div class="col-12 col-lg-6" id="kpiLeaderboardCol">
        <div class="section-card h-100">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h6 class="fw-bold mb-0"><i class="bi bi-trophy-fill text-warning me-1"></i> Đánh Giá KPI / OKR & Thưởng Năng Suất Tháng</h6>
              <div class="text-muted" style="font-size:0.74rem;">Nhân viên cập nhật tiến độ `100%` tự động chuyển sang <b>Chờ duyệt</b>; Team Lead / HR duyệt nghiệm thu</div>
            </div>
            <button type="button" class="btn btn-primary btn-sm fw-bold" onclick="openKpiModal()">
              <i class="bi bi-plus-circle"></i> + Giao / Cập Nhật KPI
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered align-middle mb-0" style="font-size:0.8rem;">
              <thead class="table-light">
                <tr>
                  <th>Nhân Sự & Mục Tiêu KPI</th>
                  <th class="text-center">Tiến Độ</th>
                  <th>Xếp Loại & Thưởng</th>
                  <th>Trạng Thái</th>
                  <th class="text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody id="kpiReviewsTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Bảng Điều Hành Nhân Sự & Phân Quyền Tuyến Dưới (ADMIN / HR_MANAGER / LEADER) -->
      <div class="col-12 col-lg-6" id="rbacManagementCol">
        <div class="section-card h-100">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
            <div>
              <h6 class="fw-bold mb-0" id="lblRbacPanelHeader"><i class="bi bi-shield-lock-fill text-danger me-1"></i> Quản Lý Tài Khoản, Phân Quyền & Điều Phối Tuyến Dưới (`PHAN_QUYEN`)</h6>
              <div class="text-muted" style="font-size:0.74rem;">Bấm <b>🏆 Giao KPI</b> hoặc <b>🕒 Xem công</b> trực tiếp, hoặc đổi Vai trò / Cấp quyền thao tác trên App</div>
            </div>
            <button type="button" class="btn btn-dark btn-sm fw-bold" onclick="openUserModal()">
              <i class="bi bi-person-add"></i> + Thêm Tài Khoản & Phân Quyền
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-sm table-hover align-middle mb-0" style="font-size:0.79rem;">
              <thead class="table-light">
                <tr>
                  <th>Tài Khoản & Phòng Ban</th>
                  <th>Vai Trò & Quyền App</th>
                  <th>Trạng Thái</th>
                  <th class="text-end">Thao Tác Điều Hành</th>
                </tr>
              </thead>
              <tbody id="userAccountsTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Khối Cấu hình Định mức BHXH, Thuế TNCN & Webhook Bot Zalo/Email (Chỉ ADMIN / HR_MANAGER) -->
    <div class="section-card" id="hrSystemConfigCard">
      <h6 class="fw-bold mb-2"><i class="bi bi-gear-wide-connected text-primary me-1"></i> Cấu Hình Định Mức Công Chuẩn, BHXH (10.5%), Giảm Trừ Thuế TNCN & Bot Gửi Phiếu Lương (`CAU_HINH`)</h6>
      <div class="row g-2">
        <div class="col-12 col-md-4">
          <label class="form-label small fw-bold mb-1">Tên Doanh Nghiệp (In trên Phiếu lương)</label>
          <input type="text" id="cfgCompanyName" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label small fw-bold mb-1">Kỳ lương hiện tại</label>
          <input type="text" id="cfgPayrollPeriod" class="form-control form-control-sm" placeholder="2025-05">
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label small fw-bold mb-1">Công chuẩn tháng</label>
          <input type="number" id="cfgStandardDays" class="form-control form-control-sm" value="26">
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label small fw-bold mb-1">% BHXH NV đóng</label>
          <input type="number" step="0.1" id="cfgBhxhEmpRate" class="form-control form-control-sm" value="10.5">
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label small fw-bold mb-1">Hệ số lương OT</label>
          <input type="number" step="0.1" id="cfgOtMultiplier" class="form-control form-control-sm" value="1.5">
        </div>
        <div class="col-12 col-md-5">
          <label class="form-label small fw-bold mb-1">URL Webhook Bot Zalo OA / ZNS (Gửi Phiếu lương & Duyệt đơn)</label>
          <input type="text" id="cfgZaloWebhook" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Email Phòng Nhân sự (HR Admin)</label>
          <input type="email" id="cfgAdminEmail" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-3 d-flex align-items-end">
          <button type="button" class="btn btn-primary btn-sm fw-bold w-100" onclick="handleSaveHrConfig()">
            <i class="bi bi-floppy"></i> Lưu Cấu Hình HR & Bot
          </button>
        </div>
      </div>
    </div>
  </section>

</main>

<!-- ======================================================================= -->
<!-- 4. FLOATING ACTION BUTTONS & MOBILE BOTTOM NAVIGATION                   -->
<!-- ======================================================================= -->
<div class="mobile-fab-group d-lg-none">
  <button type="button" class="fab-btn" style="background:#047857;" onclick="quickSelfCheckIn('IN')" title="Chấm công vào ca">
    <i class="bi bi-geo-alt-fill"></i>
  </button>
  <button type="button" class="fab-btn" style="background:#1E3A8A;" onclick="openLeaveModal()" title="Gửi đơn nghỉ phép / OT">
    <i class="bi bi-plus-lg"></i>
  </button>
</div>

<nav class="mobile-bottom-nav">
  <button type="button" class="mob-nav-item active" id="mobTab_dashboard" onclick="switchMainTab('dashboard')">
    <i class="bi bi-speedometer2"></i>
    <span>Tổng Quan</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_attendance" onclick="switchMainTab('attendance')">
    <i class="bi bi-calendar2-check-fill"></i>
    <span>Chấm Công</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_leaves" onclick="switchMainTab('leaves')">
    <i class="bi bi-envelope-paper-fill"></i>
    <span>Đơn Từ</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_payroll" onclick="switchMainTab('payroll')">
    <i class="bi bi-cash-coin"></i>
    <span>Phiếu Lương</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_kpi" onclick="switchMainTab('kpi')">
    <i class="bi bi-trophy-fill"></i>
    <span>KPI & Quyền</span>
  </button>
</nav>

<!-- ======================================================================= -->
<!-- 5. MODALS THAO TÁC (HỒ SƠ NHÂN SỰ, CHẤM CÔNG, ĐƠN TỪ, KPI, PHÂN QUYỀN)  -->
<!-- ======================================================================= -->

<!-- MODAL 1: THÊM / SỬA HỒ SƠ NHÂN SỰ & UPLOAD HỢP ĐỒNG -->
<div class="custom-modal-backdrop" id="modalEmployeeBackdrop">
  <div class="custom-modal-dialog" style="max-width:740px;">
    <div class="custom-modal-header">
      <span id="modalEmployeeTitle">👥 Thêm / Cập Nhật Hồ Sơ Nhân Sự, Hợp Đồng & Định Mức Lương</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalEmployeeBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <div class="row g-2">
        <div class="col-6 col-md-3">
          <label class="form-label small fw-bold mb-1">Mã Nhân viên (*)</label>
          <input type="text" id="empFormId" class="form-control form-control-sm fw-bold" placeholder="VD: NV-007">
        </div>
        <div class="col-6 col-md-5">
          <label class="form-label small fw-bold mb-1">Họ và Tên nhân sự (*)</label>
          <input type="text" id="empFormFullName" class="form-control form-control-sm" placeholder="Nhập họ và tên...">
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small fw-bold mb-1">Phòng ban trực thuộc</label>
          <select id="empFormDept" class="form-select form-select-sm">
            <option value="Phòng Kinh Doanh & CRM">Phòng Kinh Doanh & CRM</option>
            <option value="Khối Kỹ Thuật & Công Nghệ">Khối Kỹ Thuật & Công Nghệ</option>
            <option value="Phòng Hành Chính - Nhân Sự">Phòng Hành Chính - Nhân Sự</option>
            <option value="Ban Giám Đốc">Ban Giám Đốc</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Chức danh / Vị trí</label>
          <input type="text" id="empFormPosition" class="form-control form-control-sm" value="Chuyên Viên">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Cấp bậc phân quyền</label>
          <select id="empFormRole" class="form-select form-select-sm">
            <option value="STAFF">STAFF (Nhân viên)</option>
            <option value="LEADER">LEADER (Trưởng nhóm / Team Lead)</option>
            <option value="HR_MANAGER">HR_MANAGER (Quản lý Nhân sự)</option>
            <option value="ADMIN">ADMIN (Ban Giám Đốc)</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">SĐT Zalo nhận Payslip</label>
          <input type="text" id="empFormPhone" class="form-control form-control-sm" placeholder="09xxxxxxxx">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Email nhận Payslip</label>
          <input type="email" id="empFormEmail" class="form-control form-control-sm" placeholder="email@novahr.vn">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Loại hợp đồng</label>
          <select id="empFormContractType" class="form-select form-select-sm">
            <option value="Hợp đồng 12 tháng">Hợp đồng 12 tháng</option>
            <option value="Hợp đồng 24 tháng">Hợp đồng 24 tháng</option>
            <option value="Hợp đồng 36 tháng">Hợp đồng 36 tháng</option>
            <option value="Không xác định thời hạn">Không xác định thời hạn</option>
            <option value="Thử việc 2 tháng">Thử việc 2 tháng</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Ngày hết hạn HĐ</label>
          <input type="date" id="empFormContractEnd" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1 text-primary">Lương cơ bản (VNĐ)</label>
          <input type="number" id="empFormBaseSalary" class="form-control form-control-sm fw-bold border-primary" value="15000000">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Lương đóng BHXH (VNĐ)</label>
          <input type="number" id="empFormInsSalary" class="form-control form-control-sm" value="9500000">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Phụ cấp (Ăn/Xăng/ĐT)</label>
          <input type="number" id="empFormAllowance" class="form-control form-control-sm" value="1500000">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Số người phụ thuộc</label>
          <input type="number" id="empFormDependents" class="form-control form-control-sm" value="0">
        </div>
        <div class="col-6 col-md-8">
          <label class="form-label small fw-bold mb-1">Số tài khoản Ngân hàng nhận lương</label>
          <input type="text" id="empFormBank" class="form-control form-control-sm" placeholder="VD: 1903888999 - Techcombank">
        </div>

        <!-- UPLOAD HỒ SƠ ĐÍNH KÈM (HỢP ĐỒNG WORD/PDF, CCCD, CV, BẰNG CẤP) -->
        <div class="col-12 mt-2">
          <div class="p-2 rounded-3" style="background:#EFF6FF;border:1px dashed #3B82F6;">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <div>
                <label class="form-label small fw-bold mb-0 text-primary">📎 Hồ Sơ Nhân Sự Đính Kèm (Hợp đồng PDF/Word, Bảng lương Excel, Ảnh CCCD, CV)</label>
              </div>
              <div>
                <input type="file" id="empFileInput" class="d-none" multiple accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.png,.jpg,.jpeg,.zip" onchange="handleHrFileUpload(event, 'EMP')">
                <button type="button" class="btn btn-xs btn-primary fw-bold py-1 px-2" onclick="document.getElementById('empFileInput').click()">
                  <i class="bi bi-cloud-arrow-up-fill"></i> Tải File Lên (Word/Excel/PDF)
                </button>
              </div>
            </div>
            <div id="empAttachmentsList" class="d-flex flex-wrap gap-2 mb-2"></div>
            <div class="input-group input-group-sm">
              <input type="text" id="empQuickDocName" class="form-control" placeholder="Tên hồ sơ (VD: HDLD_2025.pdf)" style="max-width:220px;">
              <input type="url" id="empQuickDocUrl" class="form-control" placeholder="Hoặc dán Link Google Drive / Docs / Sheets...">
              <button class="btn btn-outline-primary fw-bold" type="button" onclick="addQuickHrDocLink('EMP')">🔗 Đính kèm Link</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalEmployeeBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-primary fw-bold px-3" onclick="submitEmployeeForm()">
        <i class="bi bi-check2-circle me-1"></i> Lưu Hồ Sơ Nhân Sự
      </button>
    </div>
  </div>
</div>

<!-- MODAL 2: GHI NHẬN CHẤM CÔNG & TĂNG CA (OT) -->
<div class="custom-modal-backdrop" id="modalAttendanceBackdrop">
  <div class="custom-modal-dialog" style="max-width:560px;">
    <div class="custom-modal-header" style="background:linear-gradient(135deg,#0F766E,#047857);">
      <span>🕒 Ghi Nhận Chấm Công Ca Làm Việc & Giờ Tăng Ca (OT)</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalAttendanceBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <input type="hidden" id="attFormId">
      <div class="row g-2">
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Ngày chấm công (*)</label>
          <input type="date" id="attFormDate" class="form-control form-control-sm">
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Nhân sự thực hiện (*)</label>
          <select id="attFormEmployee" class="form-select form-select-sm fw-bold"></select>
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Ca làm việc</label>
          <select id="attFormShift" class="form-select form-select-sm">
            <option value="Ca Hành Chính (08:00 - 17:30)">Ca Hành Chính (08:00 - 17:30)</option>
            <option value="Ca Sáng (08:00 - 12:00)">Ca Sáng (08:00 - 12:00)</option>
            <option value="Ca Chiều (13:30 - 17:30)">Ca Chiều (13:30 - 17:30)</option>
            <option value="Ca Linh Hoạt / WFH">Ca Linh Hoạt / WFH</option>
          </select>
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Hình thức làm việc</label>
          <select id="attFormWorkMode" class="form-select form-select-sm">
            <option value="Văn phòng Công ty">🏢 Văn phòng Công ty</option>
            <option value="Làm việc từ xa (WFH)">🏠 Làm việc từ xa (WFH)</option>
            <option value="Đi gặp Khách hàng (Thị trường)">🚗 Đi gặp Khách hàng (Thị trường)</option>
          </select>
        </div>
        <div class="col-3">
          <label class="form-label small fw-bold mb-1">Giờ Vào</label>
          <input type="text" id="attFormCheckIn" class="form-control form-control-sm" value="08:00">
        </div>
        <div class="col-3">
          <label class="form-label small fw-bold mb-1">Giờ Ra</label>
          <input type="text" id="attFormCheckOut" class="form-control form-control-sm" value="17:30">
        </div>
        <div class="col-3">
          <label class="form-label small fw-bold mb-1">Số công</label>
          <input type="number" step="0.5" id="attFormWorkUnits" class="form-control form-control-sm fw-bold" value="1.0">
        </div>
        <div class="col-3">
          <label class="form-label small fw-bold mb-1 text-primary">Giờ OT</label>
          <input type="number" step="0.5" id="attFormOtHours" class="form-control form-control-sm fw-bold border-primary" value="0">
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Ghi chú kết quả công việc trong ca / Vị trí GPS</label>
          <input type="text" id="attFormNotes" class="form-control form-control-sm" placeholder="Nhập nội dung công việc hoặc khách hàng đã gặp...">
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalAttendanceBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-success fw-bold px-3" onclick="submitAttendanceForm()">Lưu Chấm Công</button>
    </div>
  </div>
</div>

<!-- MODAL 3: GỬI & PHÊ DUYỆT ĐƠN XIN NGHỈ PHÉP / ĐĂNG KÝ TĂNG CA (OT) -->
<div class="custom-modal-backdrop" id="modalLeaveBackdrop">
  <div class="custom-modal-dialog" style="max-width:650px;">
    <div class="custom-modal-header" style="background:linear-gradient(135deg,#9A3412,#EA580C);">
      <span id="modalLeaveTitle">📝 Tạo / Cập Nhật Đơn Xin Nghỉ Phép, Tăng Ca (OT) & Công Tác</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalLeaveBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <input type="hidden" id="leaveFormId">
      <div class="row g-2">
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Nhân sự làm đơn (*)</label>
          <select id="leaveFormEmployee" class="form-select form-select-sm fw-bold"></select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Loại đơn từ (*)</label>
          <select id="leaveFormType" class="form-select form-select-sm fw-bold">
            <option value="Đơn xin Nghỉ phép năm (Có hưởng lương)">🌴 Đơn xin Nghỉ phép năm (Có hưởng lương)</option>
            <option value="Đăng ký Tăng ca (OT)">⚡ Đăng ký Tăng ca làm thêm giờ (OT 150%)</option>
            <option value="Đơn đăng ký Đi công tác / Gặp khách B2B">🚗 Đơn đăng ký Đi công tác / Gặp khách B2B</option>
            <option value="Đơn xin Nghỉ việc riêng (Không hưởng lương)">📅 Đơn xin Nghỉ việc riêng (Không lương)</option>
            <option value="Đơn giải trình Đi muộn / Về sớm">🕒 Đơn giải trình Đi muộn / Về sớm</option>
          </select>
        </div>
        <div class="col-4">
          <label class="form-label small fw-bold mb-1">Từ ngày (*)</label>
          <input type="date" id="leaveFormFrom" class="form-control form-control-sm">
        </div>
        <div class="col-4">
          <label class="form-label small fw-bold mb-1">Đến ngày (*)</label>
          <input type="date" id="leaveFormTo" class="form-control form-control-sm">
        </div>
        <div class="col-4">
          <label class="form-label small fw-bold mb-1 text-primary">Số ngày nghỉ / Giờ OT</label>
          <input type="number" step="0.5" id="leaveFormQty" class="form-control form-control-sm fw-bold border-primary" value="1.0">
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Lý do chi tiết & Phương án bàn giao công việc (*)</label>
          <textarea id="leaveFormReason" class="form-control form-control-sm" rows="2" placeholder="Ghi rõ lý do xin nghỉ / nội dung làm thêm giờ OT và người nhận bàn giao..."></textarea>
        </div>
        <div class="col-6" id="wrapLeaveStatusSelect">
          <label class="form-label small fw-bold mb-1">Trạng thái phê duyệt</label>
          <select id="leaveFormStatus" class="form-select form-select-sm fw-bold">
            <option value="Chờ duyệt">⏳ Chờ Quản lý / HR duyệt</option>
            <option value="Đã duyệt" id="optLeaveApprovedMgrOnly">✅ Đã phê duyệt (Chỉ Lead / HR)</option>
            <option value="Từ chối" id="optLeaveRejectedMgrOnly">↩️ Từ chối (Chỉ Lead / HR)</option>
          </select>
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Ý kiến của Trưởng nhóm / HR</label>
          <input type="text" id="leaveFormApprovalNote" class="form-control form-control-sm" placeholder="Ghi chú phê duyệt...">
        </div>

        <!-- UPLOAD FILE CHỨNG TỪ ĐƠN TỪ -->
        <div class="col-12 mt-2">
          <div class="p-2 rounded-3" style="background:#FFF7ED;border:1px dashed #F97316;">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label small fw-bold mb-0 text-dark">📎 Đính kèm Chứng từ / Biên bản bàn giao (Word, Excel, PDF, Ảnh)</label>
              <div>
                <input type="file" id="leaveFileInput" class="d-none" multiple onchange="handleHrFileUpload(event, 'LEAVE')">
                <button type="button" class="btn btn-xs btn-warning fw-bold text-dark py-0 px-2" onclick="document.getElementById('leaveFileInput').click()">
                  <i class="bi bi-paperclip"></i> + Tải File Chứng Từ
                </button>
              </div>
            </div>
            <div id="leaveAttachmentsList" class="d-flex flex-wrap gap-2"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalLeaveBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-warning fw-bold text-dark px-3" onclick="submitLeaveForm()">
        <i class="bi bi-send-check-fill me-1"></i> Lưu & Gửi Đơn Từ
      </button>
    </div>
  </div>
</div>

<!-- MODAL 4: ĐÁNH GIÁ & CẬP NHẬT TIẾN ĐỘ KPI (100% TỰ ĐỘNG CHỜ DUYỆT) -->
<div class="custom-modal-backdrop" id="modalKpiBackdrop">
  <div class="custom-modal-dialog" style="max-width:650px;">
    <div class="custom-modal-header" style="background:linear-gradient(135deg,#4C1D95,#6D28D9);">
      <span id="modalKpiTitle">🏆 Giao Mục Tiêu & Cập Nhật Tiến Độ KPI Tháng</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalKpiBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <input type="hidden" id="kpiFormId">
      <div class="alert alert-info py-1 px-2 small mb-2">
        💡 Khi nhân viên cập nhật <b>% Tiến độ đạt 100%</b>, trạng thái sẽ tự động chuyển sang <b>⏳ Chờ duyệt</b> (bảo toàn 100% thông tin nhân sự, không bao giờ làm mất mục tiêu KPI).
      </div>
      <div class="row g-2">
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Kỳ đánh giá</label>
          <input type="text" id="kpiFormPeriod" class="form-control form-control-sm" value="2025-05">
        </div>
        <div class="col-6 col-md-8">
          <label class="form-label small fw-bold mb-1">Nhân sự thực hiện (*)</label>
          <select id="kpiFormEmployee" class="form-select form-select-sm fw-bold"></select>
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Mục tiêu / Chỉ tiêu KPI trọng tâm (*)</label>
          <input type="text" id="kpiFormGoal" class="form-control form-control-sm" placeholder="Nhập chỉ tiêu KPI cụ thể...">
        </div>
        <div class="col-4">
          <label class="form-label small fw-bold mb-1 text-primary">% Tiến độ đạt (0-100%)</label>
          <input type="number" id="kpiFormProgress" class="form-control form-control-sm fw-bold border-primary" min="0" max="100" value="85" oninput="onKpiProgressInput(this.value)">
        </div>
        <div class="col-4">
          <label class="form-label small fw-bold mb-1">Mức thưởng KPI (VNĐ)</label>
          <input type="number" id="kpiFormBonus" class="form-control form-control-sm fw-bold text-success" value="2500000">
        </div>
        <div class="col-4">
          <label class="form-label small fw-bold mb-1">Trạng thái nghiệm thu</label>
          <select id="kpiFormStatus" class="form-select form-select-sm fw-bold">
            <option value="Đang thực hiện">⚡ Đang thực hiện</option>
            <option value="Chờ duyệt">⏳ Chờ Quản lý / HR duyệt</option>
            <option value="Đã duyệt" id="optKpiApprovedMgrOnly">✅ Đã duyệt nghiệm thu</option>
          </select>
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Báo cáo kết quả đạt được / Nhận xét của Quản lý</label>
          <textarea id="kpiFormNotes" class="form-control form-control-sm" rows="2"></textarea>
        </div>
        <div class="col-12">
          <div class="p-2 rounded-3" style="background:#F5F3FF;border:1px dashed #8B5CF6;">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label small fw-bold mb-0 text-dark">📎 Tệp báo cáo nghiệm thu KPI (Word, Excel, PowerPoint, PDF)</label>
              <div>
                <input type="file" id="kpiFileInput" class="d-none" multiple onchange="handleHrFileUpload(event, 'KPI')">
                <button type="button" class="btn btn-xs btn-primary py-0 px-2" onclick="document.getElementById('kpiFileInput').click()">+ Tải File Báo Cáo</button>
              </div>
            </div>
            <div id="kpiAttachmentsList" class="d-flex flex-wrap gap-2"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalKpiBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-primary fw-bold px-3" onclick="submitKpiForm()">Lưu Đánh Giá KPI</button>
    </div>
  </div>
</div>

<!-- MODAL 5: THIẾT LẬP TÀI KHOẢN & MA TRẬN QUYỀN THAO TÁC TRÊN APP (`PHAN_QUYEN`) -->
<div class="custom-modal-backdrop" id="modalUserBackdrop">
  <div class="custom-modal-dialog" style="max-width:650px;">
    <div class="custom-modal-header bg-dark">
      <span>🔐 Thiết Lập Tài Khoản Nhân Sự & Phân Quyền Thao Tác Trên App</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalUserBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <div class="row g-2">
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Username đăng nhập (*)</label>
          <input type="text" id="usrFormUsername" class="form-control form-control-sm" placeholder="vd: nv_minh">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Mật khẩu / PIN (*)</label>
          <input type="text" id="usrFormPassword" class="form-control form-control-sm" value="123456">
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small fw-bold mb-1">Mã NV liên kết</label>
          <input type="text" id="usrFormEmpId" class="form-control form-control-sm fw-bold" placeholder="VD: NV-007">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Họ và Tên nhân sự (*)</label>
          <input type="text" id="usrFormFullName" class="form-control form-control-sm" placeholder="VD: Hoàng Minh">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1 text-primary">Vai trò hệ thống (Role) (*)</label>
          <select id="usrFormRole" class="form-select form-select-sm fw-bold border-primary" onchange="onHrRoleSelectChange(this.value)">
            <option value="ADMIN">👑 ADMIN (Tổng Giám Đốc — Toàn quyền)</option>
            <option value="HR_MANAGER">💼 HR_MANAGER (GĐ Nhân Sự — Quản lý Hồ sơ, Lương & Đơn từ)</option>
            <option value="LEADER">🌟 LEADER (Team Lead — Duyệt đơn nghỉ/OT & Giao KPI tuyến dưới)</option>
            <option value="STAFF">💻 STAFF (Nhân viên — Chấm công, Gửi đơn nghỉ/OT, Xem Payslip cá nhân)</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small fw-bold mb-1">Phòng ban trực thuộc</label>
          <select id="usrFormDept" class="form-select form-select-sm">
            <option value="Phòng Kinh Doanh & CRM">Phòng Kinh Doanh & CRM</option>
            <option value="Khối Kỹ Thuật & Công Nghệ">Khối Kỹ Thuật & Công Nghệ</option>
            <option value="Phòng Hành Chính - Nhân Sự">Phòng Hành Chính - Nhân Sự</option>
            <option value="Ban Giám Đốc">Ban Giám Đốc</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Email nhận Payslip</label>
          <input type="email" id="usrFormEmail" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">SĐT Zalo</label>
          <input type="text" id="usrFormPhone" class="form-control form-control-sm">
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Trạng thái hoạt động</label>
          <select id="usrFormStatus" class="form-select form-select-sm fw-bold">
            <option value="Hoạt động">🟢 Hoạt động (Cho phép đăng nhập & thao tác)</option>
            <option value="Tạm khóa">🔒 Tạm khóa (Chặn đăng nhập)</option>
          </select>
        </div>

        <!-- 6 CHECKBOX QUYỀN THAO TÁC TRỰC TIẾP TRÊN APP -->
        <div class="col-12 mt-2">
          <div class="p-2 rounded-3" style="background:#EFF6FF;border:1px solid #93C5FD;">
            <label class="form-label small fw-bold mb-1 text-primary">🛡️ Ma Trận Quyền Thao Tác Thực Tế Trên App (Tự động đồng bộ Sheet PHAN_QUYEN & HO_SO_NHAN_SU)</label>
            <div class="row g-2 small">
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input hr-perm-chk" type="checkbox" value="MANAGE_HR">
                  <span class="fw-semibold">👥 Quản lý Hồ sơ Nhân sự & Hợp đồng toàn công ty</span>
                </label>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input hr-perm-chk" type="checkbox" value="APPROVE_LEAVE_OT">
                  <span class="fw-semibold">✅ Duyệt đơn Nghỉ phép & Tăng ca (OT) tuyến dưới</span>
                </label>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input hr-perm-chk" type="checkbox" value="MANAGE_PAYROLL">
                  <span class="fw-semibold">💰 Tính Bảng lương & Bắn Phiếu lương Email/Zalo</span>
                </label>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input hr-perm-chk" type="checkbox" value="EVALUATE_KPI">
                  <span class="fw-semibold">🏆 Giao chỉ tiêu & Duyệt nghiệm thu KPI tuyến dưới</span>
                </label>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input hr-perm-chk" type="checkbox" value="VIEW_DEPT_TEAM" checked>
                  <span class="fw-semibold">🏢 Xem lịch chấm công & phối hợp cùng Phòng ban</span>
                </label>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-check m-0">
                  <input class="form-check-input hr-perm-chk" type="checkbox" value="SELF_CHECKIN_LEAVE" checked>
                  <span class="fw-semibold">⚡ Tự Chấm công 1 chạm, Gửi đơn nghỉ/OT & Xem Payslip</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-modal-footer justify-content-between">
      <button type="button" class="btn btn-sm btn-outline-primary fw-bold" onclick="saveUserAndOpenKpiModal()">
        <i class="bi bi-trophy"></i> Lưu & Giao KPI Ngay Cho Nhân Sự Này
      </button>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalUserBackdrop')">Đóng</button>
        <button type="button" class="btn btn-sm btn-dark fw-bold px-3" onclick="submitUserForm()">Lưu Tài Khoản & Quyền</button>
      </div>
    </div>
  </div>
</div>

<!-- ======================================================================= -->
<!-- 6. JAVASCRIPT ENGINE (4-TIER RBAC + AUTO PAYROLL + FILE UPLOAD)         -->
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
    var curMonth = dStr(0).slice(0, 7);
    return {
      ok: true,
      serverTime: dStr(0) + ' 08:30:00',
      todayStr: dStr(0),
      curMonthStr: curMonth,
      config: {
        COMPANY_NAME: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ & GIẢI PHÁP SỐ NOVA-HR',
        COMPANY_TAX_CODE: '0316889900',
        COMPANY_HOTLINE: '0909.888.999',
        ADMIN_EMAIL: 'hr.admin@novahr.vn',
        CURRENT_PAYROLL_PERIOD: curMonth,
        STANDARD_WORK_DAYS: '26',
        BHXH_EMP_RATE: '10.5',
        OT_HOURLY_RATE_MULTIPLIER: '1.5',
        PERSONAL_DEDUCTION: '11000000',
        DEPENDENT_DEDUCTION: '4400000',
        ZALO_BOT_WEBHOOK_URL: 'https://webhook.site/zalo-hr-payslip-demo'
      },
      users: [
        { username: 'admin', password: '123456', empId: 'NV-001', fullName: 'Nguyễn Quản Trị (CEO)', role: 'ADMIN', department: 'Ban Giám Đốc', email: 'ceo@novahr.vn', phone: '0901234567', status: 'Hoạt động', permissions: 'MANAGE_HR,APPROVE_LEAVE_OT,MANAGE_PAYROLL,EVALUATE_KPI,VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE' },
        { username: 'hr_mgr', password: '123456', empId: 'NV-002', fullName: 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', role: 'HR_MANAGER', department: 'Phòng Hành Chính - Nhân Sự', email: 'ha.hr@novahr.vn', phone: '0902345678', status: 'Hoạt động', permissions: 'MANAGE_HR,APPROVE_LEAVE_OT,MANAGE_PAYROLL,EVALUATE_KPI,VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE' },
        { username: 'tech_lead', password: '123456', empId: 'NV-003', fullName: 'Phạm Tuấn Kiệt (Tech Lead)', role: 'LEADER', department: 'Khối Kỹ Thuật & Công Nghệ', email: 'kiet.dev@novahr.vn', phone: '0903456789', status: 'Hoạt động', permissions: 'APPROVE_LEAVE_OT,EVALUATE_KPI,VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE' },
        { username: 'sale_lead', password: '123456', empId: 'NV-004', fullName: 'Lê Minh Thư (Leader Kinh Doanh)', role: 'LEADER', department: 'Phòng Kinh Doanh & CRM', email: 'thu.sale@novahr.vn', phone: '0904567890', status: 'Hoạt động', permissions: 'APPROVE_LEAVE_OT,EVALUATE_KPI,VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE' },
        { username: 'nv_anh', password: '123456', empId: 'NV-005', fullName: 'Võ Ngọc Ánh (Chuyên viên UI/UX)', role: 'STAFF', department: 'Khối Kỹ Thuật & Công Nghệ', email: 'anh.design@novahr.vn', phone: '0905678901', status: 'Hoạt động', permissions: 'VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE' },
        { username: 'nv_minh', password: '666666', empId: 'NV-006', fullName: 'Hoàng Minh (Chuyên viên Sale)', role: 'STAFF', department: 'Phòng Kinh Doanh & CRM', email: 'minh.sale@novahr.vn', phone: '0906789012', status: 'Hoạt động', permissions: 'VIEW_DEPT_TEAM,SELF_CHECKIN_LEAVE' }
      ],
      employees: [
        { id: 'NV-001', fullName: 'Nguyễn Quản Trị (CEO)', department: 'Ban Giám Đốc', position: 'Tổng Giám Đốc (CEO)', role: 'ADMIN', phone: '0901234567', email: 'ceo@novahr.vn', joinDate: '2021-01-10', contractType: 'Không xác định thời hạn', contractEndDate: '2099-12-31', baseSalary: 45000000, insuranceSalary: 20000000, allowance: 5000000, dependents: 2, bankAccount: '1903888999901 - Techcombank', status: 'Đang làm việc', attachments: [{ id: 'DOC-01', name: 'Quyet_Dinh_Bo_Nhiem_CEO.pdf', ext: 'pdf', size: '1.2 MB', url: 'https://drive.google.com' }] },
        { id: 'NV-002', fullName: 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', department: 'Phòng Hành Chính - Nhân Sự', position: 'Giám Đốc Nhân Sự (HRD)', role: 'HR_MANAGER', phone: '0902345678', email: 'ha.hr@novahr.vn', joinDate: '2022-03-01', contractType: 'Hợp đồng 36 tháng', contractEndDate: dStr(180), baseSalary: 28000000, insuranceSalary: 15000000, allowance: 3000000, dependents: 1, bankAccount: '1903888999902 - Techcombank', status: 'Đang làm việc', attachments: [{ id: 'DOC-02', name: 'Hop_Dong_Lao_Dong_NV002.pdf', ext: 'pdf', size: '950 KB', url: 'https://drive.google.com' }, { id: 'DOC-03', name: 'Quy_Che_Luong_Thuong_2025.docx', ext: 'docx', size: '480 KB', url: 'https://docs.google.com/document' }] },
        { id: 'NV-003', fullName: 'Phạm Tuấn Kiệt (Tech Lead)', department: 'Khối Kỹ Thuật & Công Nghệ', position: 'Trưởng Nhóm Kỹ Thuật (Tech Lead)', role: 'LEADER', phone: '0903456789', email: 'kiet.dev@novahr.vn', joinDate: '2022-06-15', contractType: 'Hợp đồng 24 tháng', contractEndDate: dStr(15), baseSalary: 26000000, insuranceSalary: 14000000, allowance: 2500000, dependents: 1, bankAccount: '0071000888903 - Vietcombank', status: 'Đang làm việc', attachments: [{ id: 'DOC-04', name: 'HDLD_PhamTuanKiet_TechLead.pdf', ext: 'pdf', size: '1.1 MB', url: 'https://drive.google.com' }] },
        { id: 'NV-004', fullName: 'Lê Minh Thư (Leader Kinh Doanh)', department: 'Phòng Kinh Doanh & CRM', position: 'Trưởng Nhóm Kinh Doanh (Sales Lead)', role: 'LEADER', phone: '0904567890', email: 'thu.sale@novahr.vn', joinDate: '2022-08-01', contractType: 'Hợp đồng 24 tháng', contractEndDate: dStr(120), baseSalary: 22000000, insuranceSalary: 12000000, allowance: 2500000, dependents: 1, bankAccount: '10288899904 - VietinBank', status: 'Đang làm việc', attachments: [{ id: 'DOC-06', name: 'HDLD_LeMinhThu_SalesLead.pdf', ext: 'pdf', size: '880 KB', url: 'https://drive.google.com' }] },
        { id: 'NV-005', fullName: 'Võ Ngọc Ánh (Chuyên viên UI/UX)', department: 'Khối Kỹ Thuật & Công Nghệ', position: 'Chuyên Viên Thiết Kế UI/UX', role: 'STAFF', phone: '0905678901', email: 'anh.design@novahr.vn', joinDate: '2023-04-10', contractType: 'Hợp đồng 12 tháng', contractEndDate: dStr(10), baseSalary: 16500000, insuranceSalary: 10000000, allowance: 1800000, dependents: 0, bankAccount: '88899905 - ACB', status: 'Đang làm việc', attachments: [{ id: 'DOC-07', name: 'CV_Portfolio_VoNgocAnh.pdf', ext: 'pdf', size: '2.4 MB', url: 'https://drive.google.com' }] },
        { id: 'NV-006', fullName: 'Hoàng Minh (Chuyên viên Sale)', department: 'Phòng Kinh Doanh & CRM', position: 'Chuyên Viên Tư Vấn B2B', role: 'STAFF', phone: '0906789012', email: 'minh.sale@novahr.vn', joinDate: '2024-02-01', contractType: 'Hợp đồng 12 tháng', contractEndDate: dStr(90), baseSalary: 14000000, insuranceSalary: 9000000, allowance: 1500000, dependents: 0, bankAccount: '88899906 - MB Bank', status: 'Đang làm việc', attachments: [{ id: 'DOC-08', name: 'Ho_So_Nhan_Su_HoangMinh.docx', ext: 'docx', size: '390 KB', url: 'https://docs.google.com/document' }] }
      ],
      attendance: [
        { id: 'CC-1001', date: dStr(0), empId: 'NV-001', fullName: 'Nguyễn Quản Trị (CEO)', department: 'Ban Giám Đốc', shift: 'Ca Hành Chính (08:00 - 17:30)', checkIn: '07:50', checkOut: '18:00', workUnits: 1.0, otHours: 0, workMode: 'Văn phòng Công ty', status: 'Đúng giờ (Đủ công)', notes: 'Điều hành họp giao ban đầu tuần' },
        { id: 'CC-1002', date: dStr(0), empId: 'NV-002', fullName: 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', department: 'Phòng Hành Chính - Nhân Sự', shift: 'Ca Hành Chính (08:00 - 17:30)', checkIn: '07:55', checkOut: '17:45', workUnits: 1.0, otHours: 1.5, workMode: 'Văn phòng Công ty', status: 'Đúng giờ + Tăng ca', notes: 'Chốt bảng lương & rà soát hợp đồng nhân sự' },
        { id: 'CC-1003', date: dStr(0), empId: 'NV-003', fullName: 'Phạm Tuấn Kiệt (Tech Lead)', department: 'Khối Kỹ Thuật & Công Nghệ', shift: 'Ca Hành Chính (08:00 - 17:30)', checkIn: '08:00', checkOut: '19:30', workUnits: 1.0, otHours: 2.0, workMode: 'Văn phòng Công ty', status: 'Đúng giờ + Tăng ca', notes: 'Release bản cập nhật hệ thống Web App v4.0' },
        { id: 'CC-1004', date: dStr(0), empId: 'NV-004', fullName: 'Lê Minh Thư (Leader Kinh Doanh)', department: 'Phòng Kinh Doanh & CRM', shift: 'Ca Hành Chính (08:00 - 17:30)', checkIn: '07:58', checkOut: '18:30', workUnits: 1.0, otHours: 1.0, workMode: 'Đi gặp Khách hàng (Thị trường)', status: 'Đúng giờ + Công tác', notes: 'Họp ký hợp đồng cùng đối tác B2B SunLand' },
        { id: 'CC-1005', date: dStr(0), empId: 'NV-005', fullName: 'Võ Ngọc Ánh (Chuyên viên UI/UX)', department: 'Khối Kỹ Thuật & Công Nghệ', shift: 'Ca Hành Chính (08:00 - 17:30)', checkIn: '08:05', checkOut: '17:35', workUnits: 1.0, otHours: 1.5, workMode: 'Văn phòng Công ty', status: 'Đúng giờ + Tăng ca', notes: 'Thiết kế bộ giao diện Mobile HR Portal' },
        { id: 'CC-1006', date: dStr(0), empId: 'NV-006', fullName: 'Hoàng Minh (Chuyên viên Sale)', department: 'Phòng Kinh Doanh & CRM', shift: 'Ca Hành Chính (08:00 - 17:30)', checkIn: '08:02', checkOut: '17:30', workUnits: 1.0, otHours: 1.0, workMode: 'Văn phòng Công ty', status: 'Đúng giờ (Đủ công)', notes: 'Gọi tư vấn 15 khách hàng tiềm năng mới' }
      ],
      leaveRequests: [
        { id: 'DT-201', createdAt: dStr(-2), empId: 'NV-005', fullName: 'Võ Ngọc Ánh (Chuyên viên UI/UX)', department: 'Khối Kỹ Thuật & Công Nghệ', requestType: 'Đăng ký Tăng ca (OT)', fromDate: dStr(0), toDate: dStr(0), quantity: 3.0, reason: 'Đăng ký làm thêm 3 giờ tối để hoàn tất bộ tài liệu UI/UX bàn giao khách hàng', status: 'Chờ duyệt', approver: 'Phạm Tuấn Kiệt (Tech Lead)', approvalNote: 'Đang chờ Tech Lead hoặc HR phê duyệt', attachments: [{ id: 'ATT-L1', name: 'Ke_Hoach_Tang_Ca_UIUX.docx', ext: 'docx', size: '240 KB', url: 'https://docs.google.com/document' }] },
        { id: 'DT-202', createdAt: dStr(-1), empId: 'NV-006', fullName: 'Hoàng Minh (Chuyên viên Sale)', department: 'Phòng Kinh Doanh & CRM', requestType: 'Đơn xin Nghỉ phép năm (Có hưởng lương)', fromDate: dStr(2), toDate: dStr(2), quantity: 1.0, reason: 'Xin nghỉ phép năm 1 ngày giải quyết việc gia đình, đã bàn giao giỏ khách hàng cho chị Lê Minh Thư', status: 'Chờ duyệt', approver: 'Lê Minh Thư (Leader Kinh Doanh)', approvalNote: 'Đang chờ Leader Kinh Doanh hoặc HR duyệt', attachments: [{ id: 'ATT-L2', name: 'Bien_Ban_Ban_Giao_Khach_Hang.xlsx', ext: 'xlsx', size: '195 KB', url: 'https://docs.google.com/spreadsheets' }] },
        { id: 'DT-203', createdAt: dStr(-5), empId: 'NV-003', fullName: 'Phạm Tuấn Kiệt (Tech Lead)', department: 'Khối Kỹ Thuật & Công Nghệ', requestType: 'Đăng ký Tăng ca (OT)', fromDate: dStr(-4), toDate: dStr(-3), quantity: 6.0, reason: 'Trực nâng cấp Server & triển khai hệ thống bảo mật dữ liệu ca tối', status: 'Đã duyệt', approver: 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', approvalNote: 'Đã nghiệm thu hoàn thành tốt, tính 150% lương OT', attachments: [{ id: 'ATT-L3', name: 'Bao_Cao_Nghiem_Thu_Server_OT.pdf', ext: 'pdf', size: '680 KB', url: 'https://drive.google.com' }] }
      ],
      kpiReviews: [
        { id: 'KPI-301', period: curMonth, empId: 'NV-001', fullName: 'Nguyễn Quản Trị (CEO)', department: 'Ban Giám Đốc', goalTitle: 'Điều hành hoàn thành 100% mục tiêu doanh thu & lợi nhuận quý', weight: 100, progress: 100, score: 100, grade: 'Xuất sắc (A+)', bonusAmount: 8000000, status: 'Đã duyệt', notes: 'Vượt 115% kế hoạch doanh thu toàn công ty', attachments: [] },
        { id: 'KPI-302', period: curMonth, empId: 'NV-002', fullName: 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', department: 'Phòng Hành Chính - Nhân Sự', goalTitle: 'Chuẩn hóa hệ thống HRIS, 100% hồ sơ hợp đồng số hóa & tự động tính lương', weight: 100, progress: 100, score: 98, grade: 'Xuất sắc (A+)', bonusAmount: 4500000, status: 'Đã duyệt', notes: 'Đã hoàn tất số hóa 100% quy trình chấm công - tính lương', attachments: [{ id: 'AK-1', name: 'Bao_Cao_Nhan_Su_Thang.xlsx', ext: 'xlsx', size: '310 KB', url: 'https://docs.google.com/spreadsheets' }] },
        { id: 'KPI-303', period: curMonth, empId: 'NV-003', fullName: 'Phạm Tuấn Kiệt (Tech Lead)', department: 'Khối Kỹ Thuật & Công Nghệ', goalTitle: 'Đảm bảo tiến độ bàn giao 5 phân hệ Web App Commercial Pro đúng hạn 100%', weight: 100, progress: 95, score: 95, grade: 'Xuất sắc (A+)', bonusAmount: 5000000, status: 'Đã duyệt', notes: 'Hệ thống vận hành ổn định, đạt chuẩn Golden Master', attachments: [{ id: 'AK-2', name: 'Bien_Ban_Nghiem_Thu_Ky_Thuat.pdf', ext: 'pdf', size: '780 KB', url: 'https://drive.google.com' }] },
        { id: 'KPI-304', period: curMonth, empId: 'NV-004', fullName: 'Lê Minh Thư (Leader Kinh Doanh)', department: 'Phòng Kinh Doanh & CRM', goalTitle: 'Đạt chỉ tiêu doanh số B2B 450 triệu/tháng & tỷ lệ tái ký > 85%', weight: 100, progress: 92, score: 92, grade: 'Xuất sắc (A+)', bonusAmount: 6000000, status: 'Đã duyệt', notes: 'Chốt thành công 3 hợp đồng lớn', attachments: [] },
        { id: 'KPI-305', period: curMonth, empId: 'NV-005', fullName: 'Võ Ngọc Ánh (Chuyên viên UI/UX)', department: 'Khối Kỹ Thuật & Công Nghệ', goalTitle: 'Thiết kế hoàn chỉnh giao diện Mobile-First & bộ tài liệu hướng dẫn người dùng', weight: 100, progress: 88, score: 88, grade: 'Tốt (A)', bonusAmount: 2500000, status: 'Chờ duyệt', notes: 'Đã gửi link Figma và file PDF hướng dẫn chờ Tech Lead duyệt', attachments: [{ id: 'AK-3', name: 'UI_StyleGuide_v4.pptx', ext: 'pptx', size: '2.8 MB', url: 'https://docs.google.com/presentation' }] },
        { id: 'KPI-306', period: curMonth, empId: 'NV-006', fullName: 'Hoàng Minh (Chuyên viên Sale)', department: 'Phòng Kinh Doanh & CRM', goalTitle: 'Phát triển 30 khách hàng tiềm năng mới (Leads) & ký mới tối thiểu 2 hợp đồng', weight: 100, progress: 85, score: 85, grade: 'Tốt (A)', bonusAmount: 3000000, status: 'Chờ duyệt', notes: 'Đã đạt 28/30 Leads và ký 2 hợp đồng mới', attachments: [{ id: 'AK-4', name: 'Danh_Sach_Hop_Dong_Moi_HoangMinh.xlsx', ext: 'xlsx', size: '220 KB', url: 'https://docs.google.com/spreadsheets' }] }
      ],
      payrolls: [
        { id: 'PL-01', period: curMonth, empId: 'NV-001', fullName: 'Nguyễn Quản Trị (CEO)', department: 'Ban Giám Đốc', position: 'Tổng Giám Đốc (CEO)', baseSalary: 45000000, standardDays: 26, actualDays: 26, workDaySalary: 45000000, otHours: 0, otSalary: 0, allowance: 5000000, kpiBonus: 8000000, grossSalary: 58000000, insuranceDeduction: 2100000, taxAndPenalty: 3850000, netSalary: 52050000, status: 'Đã gửi Email/Zalo' },
        { id: 'PL-02', period: curMonth, empId: 'NV-002', fullName: 'Trần Thanh Hà (GĐ Nhân Sự - HRD)', department: 'Phòng Hành Chính - Nhân Sự', position: 'Giám Đốc Nhân Sự (HRD)', baseSalary: 28000000, standardDays: 26, actualDays: 26, workDaySalary: 28000000, otHours: 4.5, otSalary: 908654, allowance: 3000000, kpiBonus: 4500000, grossSalary: 36408654, insuranceDeduction: 1575000, taxAndPenalty: 1420000, netSalary: 33413654, status: 'Đã gửi Email/Zalo' },
        { id: 'PL-03', period: curMonth, empId: 'NV-003', fullName: 'Phạm Tuấn Kiệt (Tech Lead)', department: 'Khối Kỹ Thuật & Công Nghệ', position: 'Trưởng Nhóm Kỹ Thuật (Tech Lead)', baseSalary: 26000000, standardDays: 26, actualDays: 26, workDaySalary: 26000000, otHours: 10.5, otSalary: 1968750, allowance: 2500000, kpiBonus: 5000000, grossSalary: 35468750, insuranceDeduction: 1470000, taxAndPenalty: 1280000, netSalary: 32718750, status: 'Đã duyệt chốt lương' },
        { id: 'PL-04', period: curMonth, empId: 'NV-004', fullName: 'Lê Minh Thư (Leader Kinh Doanh)', department: 'Phòng Kinh Doanh & CRM', position: 'Trưởng Nhóm Kinh Doanh (Sales Lead)', baseSalary: 22000000, standardDays: 26, actualDays: 26, workDaySalary: 22000000, otHours: 4.0, otSalary: 634615, allowance: 2500000, kpiBonus: 6000000, grossSalary: 31134615, insuranceDeduction: 1260000, taxAndPenalty: 720000, netSalary: 29154615, status: 'Đã duyệt chốt lương' },
        { id: 'PL-05', period: curMonth, empId: 'NV-005', fullName: 'Võ Ngọc Ánh (Chuyên viên UI/UX)', department: 'Khối Kỹ Thuật & Công Nghệ', position: 'Chuyên Viên Thiết Kế UI/UX', baseSalary: 16500000, standardDays: 26, actualDays: 25.5, workDaySalary: 16182692, otHours: 4.5, otSalary: 535096, allowance: 1800000, kpiBonus: 2500000, grossSalary: 21017788, insuranceDeduction: 1050000, taxAndPenalty: 448389, netSalary: 19519399, status: 'Chờ gửi Payslip' },
        { id: 'PL-06', period: curMonth, empId: 'NV-006', fullName: 'Hoàng Minh (Chuyên viên Sale)', department: 'Phòng Kinh Doanh & CRM', position: 'Chuyên Viên Tư Vấn B2B', baseSalary: 14000000, standardDays: 26, actualDays: 25.0, workDaySalary: 13461538, otHours: 3.0, otSalary: 302885, allowance: 1500000, kpiBonus: 3000000, grossSalary: 18264423, insuranceDeduction: 945000, taxAndPenalty: 315971, netSalary: 17003452, status: 'Chờ gửi Payslip' }
      ],
      auditLogs: []
    };
  }

  var appData = buildInstantFallbackData();
  var currentUser = null;
  var chartPayrollInstance = null;
  var chartDeptInstance = null;
  var chartKpiInstance = null;
  var editingEmpAttachments = [];
  var editingLeaveAttachments = [];
  var editingKpiAttachments = [];
  var hasBooted = false;

  // =========================================================================
  // BỘ HELPER PHÂN QUYỀN 4 CẤP (ADMIN / HR_MANAGER / LEADER / STAFF)
  // =========================================================================
  function normalizeDeptKey(d) {
    var s = String(d || '').toLowerCase();
    if (s.indexOf('kỹ thuật') !== -1 || s.indexOf('công nghệ') !== -1 || s.indexOf('dev') !== -1) return 'DEPT_TECH';
    if (s.indexOf('kinh doanh') !== -1 || s.indexOf('crm') !== -1 || s.indexOf('sale') !== -1) return 'DEPT_SALES';
    if (s.indexOf('nhân sự') !== -1 || s.indexOf('hành chính') !== -1 || s.indexOf('hr') !== -1) return 'DEPT_HR';
    if (s.indexOf('giám đốc') !== -1 || s.indexOf('ceo') !== -1) return 'DEPT_EXEC';
    return s.trim();
  }

  function isSameDept(d1, d2) {
    var k1 = normalizeDeptKey(d1);
    var k2 = normalizeDeptKey(d2);
    return k1 && k2 && k1 === k2;
  }

  function getDefaultPermsByRole(roleStr) {
    var r = String(roleStr || 'STAFF').toUpperCase();
    if (r === 'ADMIN' || r === 'HR_MANAGER') {
      return ['MANAGE_HR', 'APPROVE_LEAVE_OT', 'MANAGE_PAYROLL', 'EVALUATE_KPI', 'VIEW_DEPT_TEAM', 'SELF_CHECKIN_LEAVE'];
    }
    if (r === 'LEADER' || r === 'LEAD') {
      return ['APPROVE_LEAVE_OT', 'EVALUATE_KPI', 'VIEW_DEPT_TEAM', 'SELF_CHECKIN_LEAVE'];
    }
    return ['VIEW_DEPT_TEAM', 'SELF_CHECKIN_LEAVE'];
  }

  function getUserPerms(u) {
    var target = u || currentUser;
    if (!target) return getDefaultPermsByRole('ADMIN');
    var pStr = String(target.permissions || '').toUpperCase();
    var allCodes = ['MANAGE_HR', 'APPROVE_LEAVE_OT', 'MANAGE_PAYROLL', 'EVALUATE_KPI', 'VIEW_DEPT_TEAM', 'SELF_CHECKIN_LEAVE'];
    var found = allCodes.filter(function(c) { return pStr.indexOf(c) !== -1; });
    if (found.length === 0) found = getDefaultPermsByRole(target.role);
    var r = String(target.role || '').toUpperCase();
    var fn = String(target.fullName || '').toLowerCase();
    if (r === 'LEADER' || fn.indexOf('lead') !== -1 || fn.indexOf('trưởng') !== -1) {
      if (found.indexOf('APPROVE_LEAVE_OT') === -1) found.push('APPROVE_LEAVE_OT');
      if (found.indexOf('EVALUATE_KPI') === -1) found.push('EVALUATE_KPI');
    }
    return found;
  }

  function isAdminOrHr() {
    if (!currentUser) return true;
    var r = String(currentUser.role || '').toUpperCase();
    return r === 'ADMIN' || r === 'HR_MANAGER' || getUserPerms(currentUser).indexOf('MANAGE_HR') !== -1;
  }

  function isLeaderOrAbove() {
    if (!currentUser) return true;
    if (isAdminOrHr()) return true;
    var r = String(currentUser.role || '').toUpperCase();
    var fn = String(currentUser.fullName || '').toLowerCase();
    var perms = getUserPerms(currentUser);
    return r === 'LEADER' || r === 'LEAD' || fn.indexOf('lead') !== -1 || perms.indexOf('APPROVE_LEAVE_OT') !== -1 || perms.indexOf('EVALUATE_KPI') !== -1;
  }

  function isRecordSelf(empId, fullName) {
    if (!currentUser) return true;
    var myEmpId = String(currentUser.empId || '').trim().toLowerCase();
    var myName = String(currentUser.fullName || '').trim().toLowerCase();
    var recId = String(empId || '').trim().toLowerCase();
    var recName = String(fullName || '').trim().toLowerCase();
    if (myEmpId && recId && myEmpId === recId) return true;
    if (myName && recName && myName === recName) return true;
    return false;
  }

  // Phạm vi Nhân sự mà người dùng hiện tại được phép quản lý / nhìn thấy
  function getScopedEmployees() {
    var all = (appData && appData.employees) ? appData.employees : [];
    if (!currentUser || isAdminOrHr()) return all;
    if (isLeaderOrAbove()) {
      return all.filter(function(e) {
        return isRecordSelf(e.id, e.fullName) || isSameDept(e.department, currentUser.department);
      });
    }
    return all.filter(function(e) {
      return isRecordSelf(e.id, e.fullName);
    });
  }

  function getScopedAttendance() {
    var all = (appData && appData.attendance) ? appData.attendance : [];
    if (!currentUser || isAdminOrHr()) return all;
    if (isLeaderOrAbove()) {
      return all.filter(function(a) {
        return isRecordSelf(a.empId, a.fullName) || isSameDept(a.department, currentUser.department);
      });
    }
    return all.filter(function(a) {
      return isRecordSelf(a.empId, a.fullName);
    });
  }

  function getScopedLeaves() {
    var all = (appData && appData.leaveRequests) ? appData.leaveRequests : [];
    if (!currentUser || isAdminOrHr()) return all;
    if (isLeaderOrAbove()) {
      return all.filter(function(l) {
        return isRecordSelf(l.empId, l.fullName) || isSameDept(l.department, currentUser.department);
      });
    }
    return all.filter(function(l) {
      return isRecordSelf(l.empId, l.fullName);
    });
  }

  function getScopedKpis() {
    var all = (appData && appData.kpiReviews) ? appData.kpiReviews : [];
    if (!currentUser || isAdminOrHr()) return all;
    if (isLeaderOrAbove()) {
      return all.filter(function(k) {
        return isRecordSelf(k.empId, k.fullName) || isSameDept(k.department, currentUser.department);
      });
    }
    return all.filter(function(k) {
      return isRecordSelf(k.empId, k.fullName);
    });
  }

  // Bảng lương: Chỉ ADMIN / HR_MANAGER thấy toàn công ty; LEADER & STAFF chỉ xem Phiếu lương bảo mật của cá nhân mình (trừ khi được cấp quyền MANAGE_PAYROLL)
  function getScopedPayrolls() {
    var all = (appData && appData.payrolls) ? appData.payrolls : [];
    if (!currentUser || isAdminOrHr() || getUserPerms(currentUser).indexOf('MANAGE_PAYROLL') !== -1) return all;
    return all.filter(function(p) {
      return isRecordSelf(p.empId, p.fullName);
    });
  }

  function getSubordinateAccounts() {
    var all = (appData && appData.users) ? appData.users : [];
    if (!currentUser || isAdminOrHr()) return all;
    if (isLeaderOrAbove()) {
      return all.filter(function(u) {
        if (String(u.username || '').toLowerCase() === String(currentUser.username || '').toLowerCase()) return true;
        var ur = String(u.role || '').toUpperCase();
        if (ur === 'ADMIN' || ur === 'HR_MANAGER') return false;
        return isSameDept(u.department, currentUser.department);
      });
    }
    return [];
  }

  function fmtMoney(n) {
    var v = Number(n || 0);
    if (isNaN(v)) v = 0;
    return Math.round(v).toLocaleString('vi-VN') + ' đ';
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
    var bg = type === 'danger' ? '#DC2626' : (type === 'warning' ? '#D97706' : '#047857');
    var el = document.createElement('div');
    el.style.cssText = 'background:' + bg + ';color:#fff;padding:10px 14px;border-radius:10px;margin-bottom:8px;box-shadow:0 6px 18px rgba(0,0,0,0.22);font-size:0.83rem;font-weight:600;display:flex;justify-content:space-between;align-items:center;gap:10px;';
    el.innerHTML = '<span>' + escapeHtml(msg) + '</span><button type="button" style="background:none;border:none;color:#fff;font-weight:bold;" onclick="this.parentElement.remove()">✕</button>';
    box.appendChild(el);
    setTimeout(function() { if (el && el.parentElement) el.remove(); }, 4200);
  }

  function getAttachmentBadgeMeta(nameOrExt) {
    var s = String(nameOrExt || '').toLowerCase();
    var ext = s.indexOf('.') !== -1 ? s.split('.').pop() : s;
    if (ext === 'doc' || ext === 'docx') return { cls: 'att-word', icon: '📘 Word' };
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return { cls: 'att-excel', icon: '📗 Excel' };
    if (ext === 'ppt' || ext === 'pptx') return { cls: 'att-ppt', icon: '📙 PPT' };
    if (ext === 'pdf') return { cls: 'att-pdf', icon: '📕 PDF' };
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return { cls: 'att-img', icon: '🖼️ Ảnh' };
    return { cls: 'att-other', icon: '🔗 Hồ sơ' };
  }

  function renderAttachmentChips(list) {
    var arr = Array.isArray(list) ? list : [];
    if (arr.length === 0) return '<span class="text-muted small fst-italic">Chưa đính kèm</span>';
    return '<div class="d-flex flex-wrap gap-1">' + arr.map(function(a) {
      var m = getAttachmentBadgeMeta(a.ext || a.name);
      return '<a href="' + escapeHtml(a.url || 'https://drive.google.com') + '" target="_blank" rel="noopener" class="att-chip ' + m.cls + '">' +
        '<span>' + m.icon + ':</span> <span class="text-truncate" style="max-width:130px;">' + escapeHtml(a.name) + '</span>' +
      '</a>';
    }).join('') + '</div>';
  }

  function ensureSelectOption(selectEl, val, label) {
    if (!selectEl || !val) return;
    for (var i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value === val) return;
    }
    var opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label || val;
    selectEl.appendChild(opt);
  }

  // =========================================================================
  // CHẾ ĐỘ TOÀN MÀN HÌNH 1-CLICK
  // =========================================================================
  function toggleFullScreenMode() {
    var doc = window.document;
    var docEl = doc.documentElement;
    var req = docEl.requestFullscreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    var exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (req) {
        req.call(docEl).then(function() {
          document.getElementById('txtFullScreen').textContent = '🗗 Thu Nhỏ Màn Hình';
          showToast('🔲 Đã bật chế độ Toàn Màn Hình!', 'success');
        }).catch(function() {
          document.body.classList.toggle('pseudo-fullscreen');
          showToast('💡 Đã mở rộng tối đa khung làm việc!', 'warning');
        });
      } else {
        document.body.classList.toggle('pseudo-fullscreen');
      }
    } else {
      if (exit) exit.call(doc);
      document.getElementById('txtFullScreen').textContent = '🔲 Toàn Màn Hình';
    }
  }

  // =========================================================================
  // ĐĂNG NHẬP & ÁP DỤNG GIAO DIỆN PHÂN QUYỀN 4 CẤP (RBAC)
  // =========================================================================
  function fillLoginQuick(u, p) {
    document.getElementById('loginUsername').value = u;
    document.getElementById('loginPassword').value = p;
  }

  function loginAndGoFullScreen() {
    toggleFullScreenMode();
    handleLoginSubmit();
  }

  function handleLoginSubmit() {
    var uIn = String(document.getElementById('loginUsername').value || '').trim().toLowerCase();
    var pIn = String(document.getElementById('loginPassword').value || '').trim();
    var errBox = document.getElementById('loginErrorAlert');

    var users = (appData && appData.users && appData.users.length) ? appData.users : buildInstantFallbackData().users;
    var found = users.find(function(u) {
      return String(u.username || '').trim().toLowerCase() === uIn && String(u.password || '').trim() === pIn;
    });

    if (!found && uIn === 'admin' && pIn === '123456') {
      found = buildInstantFallbackData().users[0];
    }

    if (!found) {
      errBox.textContent = '❌ Sai tài khoản hoặc mật khẩu! Hãy kiểm tra lại bảng PHAN_QUYEN.';
      errBox.classList.remove('d-none');
      return;
    }
    if (String(found.status || '').toLowerCase().indexOf('khóa') !== -1) {
      errBox.textContent = '🔒 Tài khoản này hiện đang bị tạm khóa. Vui lòng liên hệ Phòng Nhân sự (HR)!';
      errBox.classList.remove('d-none');
      return;
    }

    errBox.classList.add('d-none');
    currentUser = found;

    // Tự động đảm bảo tài khoản đăng nhập có bản ghi trong employees & payrolls để thao tác mượt ngay lập tức
    ensureLoggedUserHasHrRecords(found);

    document.getElementById('authGateScreen').style.display = 'none';
    document.getElementById('currentUserBadge').textContent = '👤 ' + found.fullName + ' [' + found.role + ']';
    document.getElementById('printActorName').textContent = found.fullName + ' (' + found.role + ')';
    document.getElementById('roleLockStatusBadge').innerHTML = '🔒 Phiên bảo mật: <b>' + escapeHtml(found.username) + '</b> (' + escapeHtml(found.empId || 'NV') + ' • ' + escapeHtml(found.department) + ')';

    applyRoleBasedUI();
    renderAllViews();
    showToast('Xin chào ' + found.fullName + ' (' + found.role + ')! Đã kích hoạt không gian làm việc theo phân quyền.', 'success');
  }

  function ensureLoggedUserHasHrRecords(u) {
    if (!u) return;
    if (!u.empId) u.empId = 'NV-' + String(u.username || 'NEW').toUpperCase();
    var hasEmp = (appData.employees || []).some(function(e) { return isRecordSelf(e.id, e.fullName); });
    if (!hasEmp) {
      appData.employees.push({
        id: u.empId,
        fullName: u.fullName,
        department: u.department || 'Phòng Kinh Doanh & CRM',
        position: u.role === 'LEADER' ? 'Trưởng Nhóm (Team Lead)' : 'Chuyên Viên',
        role: u.role || 'STAFF',
        phone: u.phone || '',
        email: u.email || '',
        joinDate: appData.todayStr || '2025-05-01',
        contractType: 'Hợp đồng 12 tháng',
        contractEndDate: '',
        baseSalary: 15000000,
        insuranceSalary: 9500000,
        allowance: 1500000,
        dependents: 0,
        bankAccount: '',
        status: 'Đang làm việc',
        attachments: []
      });
    }
    var hasPay = (appData.payrolls || []).some(function(p) { return isRecordSelf(p.empId, p.fullName); });
    if (!hasPay) {
      appData.payrolls.push({
        id: 'PL-NEW',
        period: appData.curMonthStr || '2025-05',
        empId: u.empId,
        fullName: u.fullName,
        department: u.department || 'Phòng Kinh Doanh & CRM',
        position: 'Chuyên Viên',
        baseSalary: 15000000,
        standardDays: 26,
        actualDays: 26,
        workDaySalary: 15000000,
        otHours: 0,
        otSalary: 0,
        allowance: 1500000,
        kpiBonus: 2000000,
        grossSalary: 18500000,
        insuranceDeduction: 997500,
        taxAndPenalty: 250250,
        netSalary: 17252250,
        status: 'Phiếu lương tạm tính'
      });
    }
  }

  function handleLogout() {
    currentUser = null;
    document.getElementById('loginPassword').value = '';
    document.getElementById('authGateScreen').style.display = 'flex';
  }

  function setElemVisible(id, visible) {
    var el = document.getElementById(id);
    if (!el) return;
    if (visible) el.classList.remove('d-none');
    else el.classList.add('d-none');
  }

  function applyRoleBasedUI() {
    var isHr = isAdminOrHr();
    var isLead = isLeaderOrAbove();
    var myName = currentUser ? currentUser.fullName : 'Admin';
    var myDept = currentUser ? (currentUser.department || 'Phòng ban') : '';

    var banner = document.getElementById('roleScopeDescription');
    if (isHr) {
      banner.innerHTML = '👑 <b>Chế độ Giám đốc / Quản trị Nhân sự (' + escapeHtml(myName) + '):</b> Toàn quyền quản lý Hồ sơ nhân sự, Hợp đồng, Duyệt đơn nghỉ/OT, Tính lương tự động, Bắn Payslip Email/Zalo & Phân quyền.';
    } else if (isLead) {
      banner.innerHTML = '🌟 <b>Chế độ Trưởng nhóm / Team Lead (' + escapeHtml(myName) + ' • ' + escapeHtml(myDept) + '):</b> Quản lý nhân viên tuyến dưới thuộc <b>' + escapeHtml(myDept) + '</b>, <b>Duyệt đơn Nghỉ phép / Tăng ca OT</b>, <b>Giao & Duyệt KPI tuyến dưới</b> và xem Phiếu lương cá nhân.';
    } else {
      banner.innerHTML = '💻 <b>Chế độ Nhân viên (' + escapeHtml(myName) + ' • ' + escapeHtml(myDept) + '):</b> Chấm công Vào/Ra ca 1 chạm, Gửi đơn xin nghỉ phép / đăng ký Tăng ca OT, Tự cập nhật tiến độ KPI (`100% ➔ Chờ duyệt`) & Xem Phiếu lương cá nhân.';
    }

    // Đổi nhãn Tab theo góc nhìn
    document.getElementById('lblDeskTabEmployees').textContent = isHr ? '2. Hồ Sơ Nhân Sự & Hợp Đồng' : (isLead ? '2. Nhân Sự Phòng Ban Của Tôi' : '2. Hồ Sơ Hợp Đồng Của Tôi');
    document.getElementById('lblDeskTabPayroll').textContent = isHr ? '5. Bảng Tính Lương & Phiếu Lương (Payslip)' : '5. Phiếu Lương Cá Nhân Của Tôi (Payslip)';
    document.getElementById('lblDeskTabKpi').textContent = isLead ? '6. Đánh Giá KPI & Quản Lý Tuyến Dưới' : '6. Điểm KPI Cá Nhân Của Tôi';

    // Ẩn/Hiện các nút chỉ dành cho HR / Admin
    setElemVisible('btnTopBatchPayslip', isHr);
    setElemVisible('btnDashNewEmployee', isHr);
    setElemVisible('btnEmpTabNew', isHr);
    setElemVisible('btnRecalcPayroll', isHr);
    setElemVisible('btnBatchPayslipTab', isHr);
    setElemVisible('hrSystemConfigCard', isHr);

    // Mở bảng Quản lý Tài khoản & Nhân viên tuyến dưới (`rbacManagementCol`) cho cả ADMIN, HR_MANAGER và LEADER!
    setElemVisible('rbacManagementCol', isLead);
    document.getElementById('kpiLeaderboardCol').className = isLead ? 'col-12 col-lg-6' : 'col-12';

    switchMainTab('dashboard');
  }

  function switchMainTab(tabKey) {
    var tabs = ['dashboard', 'employees', 'attendance', 'leaves', 'payroll', 'kpi'];
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

  // =========================================================================
  // ĐỒNG BỘ DỮ LIỆU TỪ GOOGLE SHEETS
  // =========================================================================
  function setSyncBadge(state, text) {
    var b = document.getElementById('syncStatusBadge');
    if (!b) return;
    if (state === 'loading') {
      b.className = 'badge bg-warning text-dark small';
      b.innerHTML = '<i class="bi bi-arrow-repeat"></i> ' + (text || 'Đang đồng bộ...');
    } else if (state === 'error') {
      b.className = 'badge bg-danger small';
      b.innerHTML = '<i class="bi bi-exclamation-triangle"></i> ' + (text || 'Chế độ Độc lập');
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
    setSyncBadge('loading', 'Đang tải dữ liệu HR...');
    google.script.run
      .withSuccessHandler(function(res) {
        if (res && res.ok) {
          appData = res;
          if (currentUser) ensureLoggedUserHasHrRecords(currentUser);
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
      .getHrSystemData();
  }

  // =========================================================================
  // RENDER TỔNG HỢP 6 PHÂN HỆ
  // =========================================================================
  function renderAllViews() {
    if (!appData) appData = buildInstantFallbackData();
    var cfg = appData.config || {};
    document.getElementById('topCompanyName').textContent = cfg.COMPANY_NAME || 'CÔNG TY CỔ PHẦN CÔNG NGHỆ & GIẢI PHÁP SỐ NOVA-HR';
    document.getElementById('printCompanyTitle').textContent = cfg.COMPANY_NAME || 'CÔNG TY CỔ PHẦN CÔNG NGHỆ & GIẢI PHÁP SỐ NOVA-HR';
    document.getElementById('lblServerTime').textContent = appData.serverTime || '-';
    document.getElementById('lblTodayStr').textContent = appData.todayStr || '-';
    document.getElementById('lblCurMonthStr').textContent = cfg.CURRENT_PAYROLL_PERIOD || appData.curMonthStr || '-';
    document.getElementById('printDateNow').textContent = appData.serverTime || '-';

    populateEmployeeSelects();
    renderDashboardSection();
    renderEmployeesSection();
    renderAttendanceSection();
    renderLeavesSection();
    renderPayrollSection();
    renderKpiAndRbacSection();
  }

  function populateEmployeeSelects() {
    var scopedEmps = getScopedEmployees();
    var isLead = isLeaderOrAbove();

    var fAttEmp = document.getElementById('filterAttEmployee');
    var prevF = fAttEmp.value || 'ALL';
    var fHtml = '<option value="ALL">-- Tất cả Nhân sự trong phạm vi (' + scopedEmps.length + ') --</option>';
    scopedEmps.forEach(function(e) {
      fHtml += '<option value="' + escapeHtml(e.id) + '">' + escapeHtml(e.id + ' - ' + e.fullName) + '</option>';
    });
    fAttEmp.innerHTML = fHtml;
    if (prevF !== 'ALL' && !scopedEmps.some(function(e) { return e.id === prevF; })) prevF = 'ALL';
    fAttEmp.value = prevF;

    var eOpts = '';
    scopedEmps.forEach(function(e) {
      eOpts += '<option value="' + escapeHtml(e.id) + '">' + escapeHtml(e.id + ' - ' + e.fullName + ' (' + e.department + ')') + '</option>';
    });
    document.getElementById('attFormEmployee').innerHTML = eOpts;
    document.getElementById('leaveFormEmployee').innerHTML = eOpts;
    document.getElementById('kpiFormEmployee').innerHTML = eOpts;

    if (!isLead && currentUser && currentUser.empId) {
      document.getElementById('attFormEmployee').value = currentUser.empId;
      document.getElementById('leaveFormEmployee').value = currentUser.empId;
      document.getElementById('kpiFormEmployee').value = currentUser.empId;
    }
  }

  // =========================================================================
  // 1. RENDER DASHBOARD & CHẤM CÔNG NHANH
  // =========================================================================
  function renderDashboardSection() {
    var isLead = isLeaderOrAbove();
    var emps = getScopedEmployees();
    var atts = getScopedAttendance();
    var leaves = getScopedLeaves();
    var kpis = getScopedKpis();
    var pays = getScopedPayrolls();
    var todayStr = appData.todayStr || '2025-05-15';

    document.getElementById('dashboardHeaderTitle').textContent = isAdminOrHr()
      ? '📊 Trung Tâm Điều Hành Nhân Sự, Chấm Công & Quỹ Lương Toàn Công Ty'
      : (isLead ? ('🌟 Bàn Điều Phối Nhân Sự Tuyến Dưới: ' + (currentUser ? currentUser.department : '')) : ('👤 Cổng Nhân Sự Cá Nhân: ' + (currentUser ? currentUser.fullName : '')));

    var todayAtts = atts.filter(function(a) { return a.date === todayStr; });
    var totalOt = 0;
    atts.forEach(function(a) { totalOt += Number(a.otHours || 0); });

    var pendingLeaves = leaves.filter(function(l) { return l.status === 'Chờ duyệt'; });

    var avgKpi = 0;
    var totalBonus = 0;
    if (kpis.length > 0) {
      var sumK = 0;
      kpis.forEach(function(k) {
        sumK += Number(k.progress || 0);
        totalBonus += Number(k.bonusAmount || 0);
      });
      avgKpi = Math.round(sumK / kpis.length);
    }

    var expContracts = emps.filter(function(e) {
      return e.contractEndDate && e.contractEndDate <= addDaysStr(todayStr, 30) && e.contractEndDate >= '2020-01-01';
    });

    var totalNet = 0;
    pays.forEach(function(p) { totalNet += Number(p.netSalary || 0); });

    document.getElementById('kpiTotalEmployees').textContent = emps.length + ' người';
    document.getElementById('kpiTodayCheckIn').textContent = todayAtts.length + '/' + emps.length + ' người';
    document.getElementById('kpiTotalOtHours').textContent = totalOt + ' giờ';
    document.getElementById('kpiPendingLeaves').textContent = pendingLeaves.length + ' đơn';
    document.getElementById('kpiAvgScore').textContent = avgKpi + '%';
    document.getElementById('kpiTotalBonus').textContent = fmtMoney(totalBonus);
    document.getElementById('kpiExpiringContracts').textContent = expContracts.length + ' HĐ';
    document.getElementById('kpiTotalNetPayroll').textContent = fmtMoney(totalNet);
    document.getElementById('badgeDashPendingLeaves').textContent = pendingLeaves.length + ' đơn chờ';

    // Danh sách Đơn từ chờ duyệt
    var lBox = document.getElementById('dashPendingLeavesBox');
    if (pendingLeaves.length === 0) {
      lBox.innerHTML = '<div class="text-muted small py-3 text-center">🎉 Không có đơn xin nghỉ phép hoặc đăng ký OT nào đang tồn đọng!</div>';
    } else {
      lBox.innerHTML = pendingLeaves.map(function(l) {
        return '<div class="p-2 border rounded-3 bg-light d-flex flex-column gap-1">' +
          '<div class="d-flex justify-content-between align-items-start">' +
            '<div class="fw-bold small text-dark">[' + escapeHtml(l.id) + '] ' + escapeHtml(l.fullName) + ' — <span class="text-primary">' + escapeHtml(l.requestType) + '</span></div>' +
            '<span class="badge bg-warning text-dark">⏳ Chờ duyệt (' + l.quantity + ' ngày/giờ)</span>' +
          '</div>' +
          '<div class="small text-secondary">📅 Từ ' + escapeHtml(l.fromDate) + ' đến ' + escapeHtml(l.toDate) + ' • Lý do: ' + escapeHtml(l.reason) + '</div>' +
          '<div class="d-flex justify-content-between align-items-center mt-1">' +
            renderAttachmentChips(l.attachments) +
            (isLead ? (
              '<div class="d-flex gap-1">' +
                '<button type="button" class="btn btn-xs btn-success fw-bold py-0 px-2" style="font-size:0.74rem;" onclick="quickApproveLeave(\'' + escapeHtml(l.id) + '\', \'Đã duyệt\')">✅ Duyệt Đơn</button>' +
                '<button type="button" class="btn btn-xs btn-outline-danger fw-bold py-0 px-2" style="font-size:0.74rem;" onclick="quickApproveLeave(\'' + escapeHtml(l.id) + '\', \'Từ chối\')">↩️ Từ Chối</button>' +
              '</div>'
            ) : (
              '<button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" style="font-size:0.74rem;" onclick="openLeaveModal(\'' + escapeHtml(l.id) + '\')">✏️ Sửa đơn</button>'
            )) +
          '</div>' +
        '</div>';
      }).join('');
    }

    // Danh sách Chấm công hôm nay
    var aBox = document.getElementById('dashTodayAttendanceBox');
    if (todayAtts.length === 0) {
      aBox.innerHTML = '<div class="text-muted small py-3 text-center">Chưa có lượt chấm công nào hôm nay. Hãy bấm <b>⚡ Chấm Công Vào Ca</b>!</div>';
    } else {
      aBox.innerHTML = todayAtts.slice(0, 5).map(function(a) {
        return '<div class="p-2 border rounded-3 bg-white d-flex justify-content-between align-items-center small">' +
          '<div>' +
            '<div class="fw-bold text-dark">👤 ' + escapeHtml(a.fullName) + ' <span class="badge bg-light text-secondary border">' + escapeHtml(a.workMode) + '</span></div>' +
            '<div class="text-muted">🕒 Vào: <b class="text-success">' + escapeHtml(a.checkIn) + '</b> • Ra: <b class="text-primary">' + escapeHtml(a.checkOut) + '</b> • OT: <b>' + a.otHours + 'h</b></div>' +
          '</div>' +
          '<span class="badge bg-success">' + escapeHtml(a.status) + '</span>' +
        '</div>';
      }).join('');
    }

    renderDashboardCharts(emps, kpis, pays);
  }

  function addDaysStr(baseStr, days) {
    var parts = String(baseStr || '2025-05-15').split('-');
    var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  function renderDashboardCharts(emps, kpis, pays) {
    if (typeof Chart === 'undefined') return;

    var ctx1 = document.getElementById('chartPayrollBreakdown');
    if (ctx1) {
      if (chartPayrollInstance) chartPayrollInstance.destroy();
      chartPayrollInstance = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: pays.map(function(p) { return p.fullName; }),
          datasets: [
            {
              label: 'Thực lĩnh (Net Pay)',
              data: pays.map(function(p) { return Number(p.netSalary || 0); }),
              backgroundColor: '#047857',
              borderRadius: 6
            },
            {
              label: 'Tổng thu nhập (Gross)',
              data: pays.map(function(p) { return Number(p.grossSalary || 0); }),
              backgroundColor: '#3B82F6',
              borderRadius: 6
            }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    var ctx2 = document.getElementById('chartDeptDistribution');
    if (ctx2) {
      if (chartDeptInstance) chartDeptInstance.destroy();
      var dMap = {};
      emps.forEach(function(e) {
        var dp = e.department || 'Khác';
        dMap[dp] = (dMap[dp] || 0) + 1;
      });
      var dLabels = Object.keys(dMap);
      chartDeptInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: dLabels,
          datasets: [{
            data: dLabels.map(function(k) { return dMap[k]; }),
            backgroundColor: ['#1E3A8A', '#047857', '#D97706', '#7C3AED']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    var ctx3 = document.getElementById('chartKpiGrades');
    if (ctx3) {
      if (chartKpiInstance) chartKpiInstance.destroy();
      var gMap = {};
      kpis.forEach(function(k) {
        var g = k.grade || 'Tốt (A)';
        gMap[g] = (gMap[g] || 0) + 1;
      });
      var gLabels = Object.keys(gMap);
      chartKpiInstance = new Chart(ctx3, {
        type: 'pie',
        data: {
          labels: gLabels,
          datasets: [{
            data: gLabels.map(function(k) { return gMap[k]; }),
            backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }

  // =========================================================================
  // 2. RENDER HỒ SƠ NHÂN SỰ & HỢP ĐỒNG (`HO_SO_NHAN_SU`)
  // =========================================================================
  function renderEmployeesSection() {
    var isHr = isAdminOrHr();
    var emps = getScopedEmployees();
    var q = String(document.getElementById('filterEmpSearch').value || '').trim().toLowerCase();
    var fDept = document.getElementById('filterEmpDept').value || 'ALL';
    var todayStr = appData.todayStr || '2025-05-15';

    var filtered = emps.filter(function(e) {
      if (fDept !== 'ALL' && !isSameDept(e.department, fDept)) return false;
      if (q) {
        var hay = (e.id + ' ' + e.fullName + ' ' + e.department + ' ' + e.position + ' ' + e.phone + ' ' + e.email).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var tbody = document.getElementById('employeesTableBody');
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4">Không có hồ sơ nhân sự trong phạm vi tìm kiếm.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(function(e) {
      var isExpSoon = e.contractEndDate && e.contractEndDate <= addDaysStr(todayStr, 30) && e.contractEndDate >= '2020-01-01';
      var showSal = isHr || isRecordSelf(e.id, e.fullName);
      var zUrl = e.phone ? ('https://zalo.me/' + String(e.phone).replace(/[^\d]/g, '')) : '';
      return '<tr>' +
        '<td class="fw-bold text-primary">' + escapeHtml(e.id) + '<br><span class="badge bg-success bg-opacity-10 text-success border border-success" style="font-size:0.68rem;">' + escapeHtml(e.status) + '</span></td>' +
        '<td>' +
          '<div class="fw-bold text-dark">' + escapeHtml(e.fullName) + '</div>' +
          '<div class="small text-muted">' + escapeHtml(e.email) + '</div>' +
          '<div class="mt-1 d-flex gap-1">' +
            (zUrl ? '<a href="' + zUrl + '" target="_blank" class="btn-zalo-quick">💬 Zalo</a>' : '') +
            (e.phone ? '<a href="tel:' + escapeHtml(e.phone) + '" class="btn btn-xs btn-outline-success py-0 px-2" style="font-size:0.7rem;">📞 ' + escapeHtml(e.phone) + '</a>' : '') +
          '</div>' +
        '</td>' +
        '<td><div class="fw-semibold text-dark">' + escapeHtml(e.position) + '</div><div class="small text-secondary">🏢 ' + escapeHtml(e.department) + ' • <span class="badge bg-dark">' + escapeHtml(e.role) + '</span></div></td>' +
        '<td>' +
          '<div class="fw-semibold">' + escapeHtml(e.contractType) + '</div>' +
          '<div class="small ' + (isExpSoon ? 'text-danger fw-bold' : 'text-muted') + '">Hạn: ' + escapeHtml(e.contractEndDate || 'Vô thời hạn') + (isExpSoon ? ' (Sắp hết hạn!)' : '') + '</div>' +
        '</td>' +
        '<td class="text-end fw-bold text-dark">' + (showSal ? fmtMoney(e.baseSalary) : '<span class="badge bg-secondary">🔒 Bảo mật</span>') + '</td>' +
        '<td class="text-end text-secondary">' + (showSal ? fmtMoney(e.allowance) : '-') + '</td>' +
        '<td>' + renderAttachmentChips(e.attachments) + '</td>' +
        '<td class="text-center">' +
          '<button type="button" class="btn btn-sm btn-outline-primary py-0 px-2 me-1" onclick="openEmployeeModal(\'' + escapeHtml(e.id) + '\')" title="Cập nhật hồ sơ & tải file hợp đồng"><i class="bi bi-pencil-square"></i> Hồ sơ</button>' +
          (isHr && e.id !== 'NV-001' ? '<button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="handleDeleteEmployee(\'' + escapeHtml(e.id) + '\')"><i class="bi bi-trash"></i></button>' : '') +
        '</td>' +
      '</tr>';
    }).join('');
  }

  // =========================================================================
  // 3. RENDER BẢNG CHẤM CÔNG & TĂNG CA OT (`CHAM_CONG`)
  // =========================================================================
  function renderAttendanceSection() {
    var atts = getScopedAttendance();
    var q = String(document.getElementById('filterAttSearch').value || '').trim().toLowerCase();
    var fEmp = document.getElementById('filterAttEmployee').value || 'ALL';
    var fMode = document.getElementById('filterAttMode').value || 'ALL';

    var filtered = atts.filter(function(a) {
      if (fEmp !== 'ALL' && a.empId !== fEmp) return false;
      if (fMode !== 'ALL' && a.workMode !== fMode) return false;
      if (q) {
        var hay = (a.id + ' ' + a.date + ' ' + a.fullName + ' ' + a.department + ' ' + a.notes).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var tbody = document.getElementById('attendanceTableBody');
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-4">Chưa có bản ghi chấm công nào trong bộ lọc.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(function(a) {
      return '<tr>' +
        '<td><div class="fw-bold">' + escapeHtml(a.id) + '</div><div class="small text-primary fw-semibold">📅 ' + escapeHtml(a.date) + '</div></td>' +
        '<td><div class="fw-bold text-dark">' + escapeHtml(a.fullName) + '</div><div class="small text-muted">' + escapeHtml(a.empId) + ' • ' + escapeHtml(a.department) + '</div></td>' +
        '<td>' + escapeHtml(a.shift) + '</td>' +
        '<td class="text-center fw-bold"><span class="text-success">' + escapeHtml(a.checkIn) + '</span> ➔ <span class="text-primary">' + escapeHtml(a.checkOut) + '</span></td>' +
        '<td class="text-center fw-bold">' + Number(a.workUnits || 1).toFixed(1) + '</td>' +
        '<td class="text-center"><span class="badge ' + (Number(a.otHours) > 0 ? 'bg-warning text-dark' : 'bg-light text-muted border') + '">+' + Number(a.otHours || 0) + ' giờ OT</span></td>' +
        '<td><span class="badge bg-info bg-opacity-10 text-dark border border-info mb-1">' + escapeHtml(a.workMode) + '</span><br><span class="badge bg-success">' + escapeHtml(a.status) + '</span></td>' +
        '<td class="small">' + escapeHtml(a.notes) + '</td>' +
        '<td class="text-center"><button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" onclick="openAttendanceModal(\'' + escapeHtml(a.id) + '\')"><i class="bi bi-pencil"></i></button></td>' +
      '</tr>';
    }).join('');
  }

  // Chấm công nhanh 1 chạm cho tài khoản đang đăng nhập
  function quickSelfCheckIn(type) {
    var u = currentUser || buildInstantFallbackData().users[0];
    var todayStr = appData.todayStr || '2025-05-15';
    var nowTime = new Date().toTimeString().slice(0, 5);
    var existing = (appData.attendance || []).find(function(a) {
      return a.date === todayStr && isRecordSelf(a.empId, a.fullName);
    });

    var payload = null;
    if (existing) {
      if (type === 'OUT') {
        existing.checkOut = nowTime;
        existing.status = 'Đã Check-out hoàn tất ca';
      } else {
        existing.checkIn = nowTime;
      }
      payload = existing;
    } else {
      payload = {
        id: 'CC-' + Math.floor(1000 + Math.random() * 8999),
        date: todayStr,
        empId: u.empId || 'NV-001',
        fullName: u.fullName,
        department: u.department || 'Phòng Kinh Doanh & CRM',
        shift: 'Ca Hành Chính (08:00 - 17:30)',
        checkIn: type === 'IN' ? nowTime : '08:00',
        checkOut: type === 'OUT' ? nowTime : '17:30',
        workUnits: 1.0,
        otHours: 0,
        workMode: 'Văn phòng Công ty',
        status: type === 'IN' ? 'Đã Check-in vào ca' : 'Đã Check-out hoàn tất ca',
        notes: 'Chấm công nhanh 1 chạm trên Web App (' + nowTime + ')',
        actor: u.username,
        actorRole: u.role
      };
      appData.attendance.unshift(payload);
    }

    renderAllViews();
    showToast((type === 'IN' ? '⚡ Đã chấm công VÀO CA lúc ' : '🏁 Đã chấm công RA CA lúc ') + nowTime + ' cho ' + u.fullName + '!', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveAttendanceRecord(payload);
    }
  }

  // =========================================================================
  // 4. RENDER ĐƠN TỪ NGHỈ PHÉP & ĐĂNG KÝ TĂNG CA OT (`DON_TU_NGHI_PHEP`)
  // =========================================================================
  function renderLeavesSection() {
    var isLead = isLeaderOrAbove();
    var leaves = getScopedLeaves();
    var q = String(document.getElementById('filterLeaveSearch').value || '').trim().toLowerCase();
    var fSt = document.getElementById('filterLeaveStatus').value || 'ALL';

    var filtered = leaves.filter(function(l) {
      if (fSt !== 'ALL' && l.status !== fSt) return false;
      if (q) {
        var hay = (l.id + ' ' + l.fullName + ' ' + l.requestType + ' ' + l.reason).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var tbody = document.getElementById('leavesTableBody');
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4">Không có đơn từ nào trong phạm vi hiển thị.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(function(l) {
      var stBadge = l.status === 'Đã duyệt'
        ? '<span class="badge bg-success">✅ Đã phê duyệt</span>'
        : (l.status === 'Từ chối' ? '<span class="badge bg-danger">↩️ Từ chối</span>' : '<span class="badge bg-warning text-dark">⏳ Chờ duyệt</span>');

      var actionHtml = '';
      if (isLead && l.status === 'Chờ duyệt') {
        actionHtml = '<div class="d-flex justify-content-center gap-1 mb-1">' +
          '<button type="button" class="btn btn-xs btn-success fw-bold py-0 px-2" style="font-size:0.73rem;" onclick="quickApproveLeave(\'' + escapeHtml(l.id) + '\', \'Đã duyệt\')">✅ Duyệt</button>' +
          '<button type="button" class="btn btn-xs btn-outline-danger fw-bold py-0 px-2" style="font-size:0.73rem;" onclick="quickApproveLeave(\'' + escapeHtml(l.id) + '\', \'Từ chối\')">↩️ Từ chối</button>' +
        '</div>';
      }
      actionHtml += '<button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" style="font-size:0.73rem;" onclick="openLeaveModal(\'' + escapeHtml(l.id) + '\')"><i class="bi bi-pencil"></i> Chi tiết / File</button>';

      return '<tr>' +
        '<td><div class="fw-bold">' + escapeHtml(l.id) + '</div><div class="small text-muted">' + escapeHtml(l.createdAt) + '</div></td>' +
        '<td><div class="fw-bold text-dark">' + escapeHtml(l.fullName) + '</div><div class="small text-secondary">' + escapeHtml(l.empId) + ' • ' + escapeHtml(l.department) + '</div></td>' +
        '<td><span class="fw-semibold text-primary">' + escapeHtml(l.requestType) + '</span></td>' +
        '<td><div class="small">Từ: <b>' + escapeHtml(l.fromDate) + '</b><br>Đến: <b>' + escapeHtml(l.toDate) + '</b></div><span class="badge bg-dark mt-1">' + l.quantity + ' ngày/giờ</span></td>' +
        '<td style="max-width:240px;"><div class="small">' + escapeHtml(l.reason) + '</div></td>' +
        '<td>' + renderAttachmentChips(l.attachments) + '</td>' +
        '<td>' + stBadge + '<div class="small text-muted mt-1">Duyệt bởi: <b>' + escapeHtml(l.approver || '-') + '</b></div><div class="small fst-italic text-secondary">' + escapeHtml(l.approvalNote || '') + '</div></td>' +
        '<td class="text-center">' + actionHtml + '</td>' +
      '</tr>';
    }).join('');
  }

  function quickApproveLeave(leaveId, newStatus) {
    if (!isLeaderOrAbove()) {
      showToast('🔒 Chỉ Trưởng nhóm (LEADER) hoặc GĐ Nhân sự (HR_MANAGER / ADMIN) mới có quyền phê duyệt đơn từ!', 'danger');
      return;
    }
    var approverName = currentUser ? currentUser.fullName : 'Quản lý / HR';
    var note = newStatus === 'Đã duyệt' ? ('Đã phê duyệt bởi ' + approverName) : ('Từ chối / Yêu cầu điều chỉnh bởi ' + approverName);

    var list = appData.leaveRequests || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === leaveId) {
        list[i].status = newStatus;
        list[i].approver = approverName;
        list[i].approvalNote = note;
        break;
      }
    }
    renderAllViews();
    showToast((newStatus === 'Đã duyệt' ? '✅ Đã phê duyệt đơn từ ' : '↩️ Đã từ chối đơn từ ') + leaveId + '!', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).approveOrRejectRequestQuick({
        id: leaveId,
        status: newStatus,
        approver: approverName,
        approvalNote: note,
        actor: currentUser ? currentUser.username : 'admin',
        actorRole: currentUser ? currentUser.role : 'LEADER'
      });
    }
  }

  // =========================================================================
  // 5. RENDER BẢNG TÍNH LƯƠNG & PHIẾU LƯƠNG CÁ NHÂN (`BANG_LUONG_THANG`)
  // =========================================================================
  function renderPayrollSection() {
    var isHr = isAdminOrHr();
    var pays = getScopedPayrolls();
    var tbody = document.getElementById('payrollTableBody');

    if (pays.length === 0) {
      tbody.innerHTML = '<tr><td colspan="12" class="text-center text-muted py-4">Chưa có phiếu lương nào trong phạm vi hiển thị.</td></tr>';
      return;
    }

    tbody.innerHTML = pays.map(function(p) {
      return '<tr>' +
        '<td><div class="fw-bold">' + escapeHtml(p.id) + '</div><span class="badge bg-light text-dark border">' + escapeHtml(p.period) + '</span></td>' +
        '<td><div class="fw-bold text-dark">' + escapeHtml(p.fullName) + '</div><div class="small text-muted">' + escapeHtml(p.empId) + ' • ' + escapeHtml(p.department) + '</div></td>' +
        '<td class="text-end">' + fmtMoney(p.baseSalary) + '</td>' +
        '<td class="text-center fw-bold">' + p.actualDays + '/' + p.standardDays + '</td>' +
        '<td class="text-end">' + fmtMoney(p.workDaySalary) + '</td>' +
        '<td class="text-end text-primary">+' + fmtMoney(p.otSalary) + '<br><small class="text-muted">(' + p.otHours + 'h OT)</small></td>' +
        '<td class="text-end">+' + fmtMoney(Number(p.allowance || 0) + Number(p.kpiBonus || 0)) + '</td>' +
        '<td class="text-end fw-bold">' + fmtMoney(p.grossSalary) + '</td>' +
        '<td class="text-end text-danger">-' + fmtMoney(Number(p.insuranceDeduction || 0) + Number(p.taxAndPenalty || 0)) + '</td>' +
        '<td class="text-end fw-bold text-success" style="font-size:0.9rem;">' + fmtMoney(p.netSalary) + '</td>' +
        '<td><span class="badge bg-success bg-opacity-10 text-success border border-success">' + escapeHtml(p.status) + '</span></td>' +
        '<td class="text-center no-print">' +
          '<div class="d-flex justify-content-center gap-1">' +
            '<button type="button" class="btn btn-xs btn-outline-dark py-0 px-2" style="font-size:0.72rem;" onclick="previewSinglePayslip(\'' + escapeHtml(p.id) + '\')">📄 Xem A4</button>' +
            (isHr ? '<button type="button" class="btn btn-xs btn-warning fw-bold text-dark py-0 px-2" style="font-size:0.72rem;" onclick="sendSinglePayslip(\'' + escapeHtml(p.id) + '\')">📨 Gửi</button>' : '') +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    // Mặc định hiển thị Phiếu lương đầu tiên trong danh sách (hoặc của chính nhân sự đang đăng nhập)
    var myPay = pays.find(function(p) { return isRecordSelf(p.empId, p.fullName); }) || pays[0];
    if (myPay) renderPayslipCardHtml(myPay);
  }

  function previewSinglePayslip(payId) {
    var p = (appData.payrolls || []).find(function(x) { return x.id === payId; });
    if (p) {
      renderPayslipCardHtml(p);
      document.getElementById('payslipPreviewCard').scrollIntoView({ behavior: 'smooth' });
    }
  }

  function renderPayslipCardHtml(p) {
    var box = document.getElementById('payslipDetailBox');
    if (!box || !p) return;
    box.innerHTML = '<div class="row g-2 mb-2 small">' +
      '<div class="col-6 col-md-3">Mã nhân sự: <b>' + escapeHtml(p.empId) + '</b></div>' +
      '<div class="col-6 col-md-3">Họ và tên: <b>' + escapeHtml(p.fullName) + '</b></div>' +
      '<div class="col-6 col-md-3">Phòng ban: <b>' + escapeHtml(p.department) + '</b></div>' +
      '<div class="col-6 col-md-3">Kỳ lương: <b class="text-primary">' + escapeHtml(p.period) + '</b></div>' +
    '</div>' +
    '<div class="table-responsive">' +
      '<table class="table table-sm table-bordered mb-0" style="font-size:0.82rem;">' +
        '<thead class="table-light"><tr><th>Khoản Mục Thu Nhập & Khấu Trừ</th><th class="text-center">Chi Tiết Công / Giờ</th><th class="text-end">Số Tiền (VNĐ)</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>1. Lương cơ bản theo hợp đồng</td><td class="text-center">' + p.standardDays + ' công chuẩn</td><td class="text-end">' + fmtMoney(p.baseSalary) + '</td></tr>' +
          '<tr><td>2. Lương ngày công thực tế hưởng</td><td class="text-center"><b>' + p.actualDays + ' công</b></td><td class="text-end fw-semibold">' + fmtMoney(p.workDaySalary) + '</td></tr>' +
          '<tr><td>3. Lương làm thêm giờ (Tăng ca OT 150%)</td><td class="text-center">' + p.otHours + ' giờ OT</td><td class="text-end text-primary">+' + fmtMoney(p.otSalary) + '</td></tr>' +
          '<tr><td>4. Phụ cấp định mức (Ăn trưa, Xăng xe, Điện thoại)</td><td class="text-center">Theo tháng</td><td class="text-end">+' + fmtMoney(p.allowance) + '</td></tr>' +
          '<tr><td>5. Thưởng hiệu suất KPI & Doanh số</td><td class="text-center">Đánh giá KPI</td><td class="text-end text-success">+' + fmtMoney(p.kpiBonus) + '</td></tr>' +
          '<tr class="table-success fw-bold"><td>TỔNG THU NHẬP (GROSS SALARY)</td><td class="text-center">-</td><td class="text-end">' + fmtMoney(p.grossSalary) + '</td></tr>' +
          '<tr><td>6. Trích nộp BHXH + BHYT + BHTN (10.5%)</td><td class="text-center">10.5% lương BHXH</td><td class="text-end text-danger">-' + fmtMoney(p.insuranceDeduction) + '</td></tr>' +
          '<tr><td>7. Thuế TNCN (Sau giảm trừ gia cảnh 11tr/tháng)</td><td class="text-center">Biểu lũy tiến</td><td class="text-end text-danger">-' + fmtMoney(p.taxAndPenalty) + '</td></tr>' +
          '<tr class="table-warning fw-bold" style="font-size:0.95rem;"><td>THỰC LĨNH CHUYỂN KHOẢN (NET PAY)</td><td class="text-center">' + escapeHtml(p.status) + '</td><td class="text-end text-success">' + fmtMoney(p.netSalary) + '</td></tr>' +
        '</tbody>' +
      '</table>' +
    '</div>';
  }

  function handleRecalculatePayroll() {
    if (!isAdminOrHr()) return;
    showToast('🔄 Đang tự động tổng hợp Ngày công, Giờ OT, Thưởng KPI, BHXH & Thuế TNCN...', 'warning');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      setSyncBadge('loading', 'Đang tính bảng lương...');
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) {
          appData = res;
          setSyncBadge('ok', 'Đã chốt lương');
          renderAllViews();
          showToast(res.message || '💰 Đã tính lại bảng lương tự động thành công!', 'success');
        }
      }).recalculateCurrentMonthPayroll({ actor: currentUser ? currentUser.username : 'hr_mgr' });
    } else {
      showToast('💰 Đã cập nhật bảng lương tự động cho toàn bộ nhân sự!', 'success');
    }
  }

  function sendSinglePayslip(payId) {
    var p = (appData.payrolls || []).find(function(x) { return x.id === payId; });
    if (!p) return;
    p.status = 'Đã gửi Email/Zalo';
    renderAllViews();
    showToast('📨 Đã gửi Phiếu lương [' + payId + '] qua Email & Bot Zalo cho ' + p.fullName + '!', 'success');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).sendPayslipNotification({ payId: payId, actor: currentUser ? currentUser.username : 'hr_mgr' });
    }
  }

  function triggerBatchSendPayslips() {
    if (!isAdminOrHr()) return;
    (appData.payrolls || []).forEach(function(p) { p.status = 'Đã gửi Email/Zalo'; });
    renderAllViews();
    showToast('🚀 Đã bắn tự động toàn bộ Phiếu lương (Payslip) qua Email & Bot Zalo cho nhân sự!', 'success');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).sendBatchPayslipNotifications({ actor: currentUser ? currentUser.username : 'hr_mgr' });
    }
  }

  // =========================================================================
  // 6. RENDER ĐÁNH GIÁ KPI & BẢNG ĐIỀU HÀNH PHÂN QUYỀN (`PHAN_QUYEN`)
  // =========================================================================
  function renderKpiAndRbacSection() {
    var isLead = isLeaderOrAbove();
    var isHr = isAdminOrHr();
    var kpis = getScopedKpis();
    var subUsers = getSubordinateAccounts();

    var kBody = document.getElementById('kpiReviewsTableBody');
    if (kpis.length === 0) {
      kBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">Chưa có mục tiêu KPI nào. Hãy bấm "+ Giao / Cập Nhật KPI"!</td></tr>';
    } else {
      kBody.innerHTML = kpis.map(function(k) {
        var stBadge = k.status === 'Đã duyệt'
          ? '<span class="badge bg-success">✅ Đã duyệt</span>'
          : (k.status === 'Chờ duyệt' ? '<span class="badge bg-warning text-dark">⏳ Chờ duyệt</span>' : '<span class="badge bg-primary">⚡ Đang làm</span>');

        return '<tr>' +
          '<td>' +
            '<div class="fw-bold text-dark">' + escapeHtml(k.fullName) + ' <span class="badge bg-light text-secondary border">' + escapeHtml(k.period) + '</span></div>' +
            '<div class="small text-primary fw-semibold">' + escapeHtml(k.goalTitle) + '</div>' +
            (k.notes ? '<div class="small text-muted fst-italic">📌 ' + escapeHtml(k.notes) + '</div>' : '') +
            '<div class="mt-1">' + renderAttachmentChips(k.attachments) + '</div>' +
          '</td>' +
          '<td class="text-center">' +
            '<div class="fw-bold text-primary">' + k.progress + '%</div>' +
            '<div class="progress mt-1" style="height:6px;"><div class="progress-bar bg-success" style="width:' + k.progress + '%"></div></div>' +
          '</td>' +
          '<td><span class="badge bg-dark mb-1">' + escapeHtml(k.grade) + '</span><div class="fw-bold text-success small">+' + fmtMoney(k.bonusAmount) + '</div></td>' +
          '<td>' + stBadge + '</td>' +
          '<td class="text-center">' +
            (isLead && k.status === 'Chờ duyệt' ? '<button type="button" class="btn btn-xs btn-success fw-bold py-0 px-2 mb-1" style="font-size:0.72rem;" onclick="quickApproveKpi(\'' + escapeHtml(k.id) + '\')">✅ Duyệt KPI</button><br>' : '') +
            '<button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" style="font-size:0.72rem;" onclick="openKpiModal(\'' + escapeHtml(k.id) + '\')">📝 Cập nhật</button>' +
          '</td>' +
        '</tr>';
      }).join('');
    }

    // Bảng Điều Hành Nhân Sự & Phân Quyền Tuyến Dưới (`PHAN_QUYEN`)
    var uBody = document.getElementById('userAccountsTableBody');
    if (uBody) {
      uBody.innerHTML = subUsers.map(function(u) {
        var isLocked = String(u.status || '').toLowerCase().indexOf('khóa') !== -1;
        var perms = getUserPerms(u);
        var pBadges = [];
        if (perms.indexOf('MANAGE_HR') !== -1) pBadges.push('<span class="badge bg-primary bg-opacity-10 text-primary border border-primary" style="font-size:0.64rem;">Hồ sơ HR</span>');
        if (perms.indexOf('APPROVE_LEAVE_OT') !== -1) pBadges.push('<span class="badge bg-success bg-opacity-10 text-success border border-success" style="font-size:0.64rem;">Duyệt Đơn/OT</span>');
        if (perms.indexOf('EVALUATE_KPI') !== -1) pBadges.push('<span class="badge bg-warning bg-opacity-10 text-dark border border-warning" style="font-size:0.64rem;">Duyệt KPI</span>');
        if (perms.indexOf('SELF_CHECKIN_LEAVE') !== -1) pBadges.push('<span class="badge bg-secondary bg-opacity-10 text-secondary border" style="font-size:0.64rem;">Chấm công/Đơn</span>');

        var roleOpts = ['ADMIN', 'HR_MANAGER', 'LEADER', 'STAFF'].map(function(r) {
          var sel = String(u.role || '').toUpperCase() === r ? 'selected' : '';
          return '<option value="' + r + '" ' + sel + '>' + r + '</option>';
        }).join('');

        return '<tr>' +
          '<td>' +
            '<div class="fw-bold text-dark">' + escapeHtml(u.fullName) + ' <span class="badge bg-light text-secondary border">' + escapeHtml(u.username) + '</span></div>' +
            '<div class="small text-muted">🆔 ' + escapeHtml(u.empId || 'NV') + ' • 🏢 ' + escapeHtml(u.department) + '</div>' +
          '</td>' +
          '<td>' +
            '<select class="form-select form-select-sm fw-bold py-0 px-1 mb-1" style="font-size:0.73rem;max-width:130px;" onchange="quickChangeHrUserRole(\'' + escapeHtml(u.username) + '\', this.value)" ' + (!isHr && u.role === 'ADMIN' ? 'disabled' : '') + '>' +
              roleOpts +
            '</select>' +
            '<div class="d-flex flex-wrap gap-1">' + pBadges.join('') + '</div>' +
          '</td>' +
          '<td>' +
            '<button type="button" class="btn btn-xs ' + (isLocked ? 'btn-danger' : 'btn-outline-success') + ' py-0 px-2 fw-bold" style="font-size:0.7rem;" onclick="quickToggleHrUserStatus(\'' + escapeHtml(u.username) + '\')">' +
              (isLocked ? '🔒 Đang khóa' : '🟢 Hoạt động') +
            '</button>' +
          '</td>' +
          '<td class="text-end">' +
            '<div class="d-inline-flex flex-wrap justify-content-end gap-1">' +
              '<button type="button" class="btn btn-xs btn-primary fw-bold py-0 px-2" style="font-size:0.71rem;" onclick="openKpiModalForUser(\'' + escapeHtml(u.username) + '\')" title="Giao KPI cho nhân sự này">🏆 Giao KPI</button>' +
              '<button type="button" class="btn btn-xs btn-outline-dark py-0 px-2" style="font-size:0.71rem;" onclick="filterAttendanceByUser(\'' + escapeHtml(u.empId) + '\', \'' + escapeHtml(u.fullName) + '\')" title="Xem lịch sử chấm công của nhân sự">🕒 Xem công</button>' +
              '<button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" style="font-size:0.71rem;" onclick="openUserModal(\'' + escapeHtml(u.username) + '\')" title="Cấu hình quyền thao tác trên App">⚙️ Quyền</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      }).join('');
    }

    // Đổ dữ liệu cấu hình
    var cfg = appData.config || {};
    document.getElementById('cfgCompanyName').value = cfg.COMPANY_NAME || '';
    document.getElementById('cfgPayrollPeriod').value = cfg.CURRENT_PAYROLL_PERIOD || appData.curMonthStr || '';
    document.getElementById('cfgStandardDays').value = cfg.STANDARD_WORK_DAYS || '26';
    document.getElementById('cfgBhxhEmpRate').value = cfg.BHXH_EMP_RATE || '10.5';
    document.getElementById('cfgOtMultiplier').value = cfg.OT_HOURLY_RATE_MULTIPLIER || '1.5';
    document.getElementById('cfgZaloWebhook').value = cfg.ZALO_BOT_WEBHOOK_URL || '';
    document.getElementById('cfgAdminEmail').value = cfg.ADMIN_EMAIL || '';
  }

  // =========================================================================
  // MODALS & CRUD HANDLERS (CÓ BẢO VỆ DỮ LIỆU KHI CẬP NHẬT 100%)
  // =========================================================================
  function openCustomModal(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }
  function closeCustomModal(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  // UPLOAD ĐA FILE DÙNG CHUNG CHO HỒ SƠ NHÂN SỰ ('EMP'), ĐƠN TỪ ('LEAVE') VÀ KPI ('KPI')
  function renderModalAttachmentEditor(targetType) {
    var list = targetType === 'EMP' ? editingEmpAttachments : (targetType === 'LEAVE' ? editingLeaveAttachments : editingKpiAttachments);
    var boxId = targetType === 'EMP' ? 'empAttachmentsList' : (targetType === 'LEAVE' ? 'leaveAttachmentsList' : 'kpiAttachmentsList');
    var box = document.getElementById(boxId);
    if (!box) return;
    if (!list || list.length === 0) {
      box.innerHTML = '<span class="text-muted small fst-italic">Chưa có tệp đính kèm.</span>';
      return;
    }
    box.innerHTML = list.map(function(att, idx) {
      var m = getAttachmentBadgeMeta(att.ext || att.name);
      return '<div class="d-inline-flex align-items-center gap-1 p-1 px-2 rounded border bg-white">' +
        '<a href="' + escapeHtml(att.url || 'https://drive.google.com') + '" target="_blank" class="att-chip ' + m.cls + ' border-0 p-0">' +
          '<span>' + m.icon + ':</span> <span>' + escapeHtml(att.name) + '</span>' +
        '</a>' +
        '<button type="button" class="btn btn-xs text-danger py-0 px-1 fw-bold" onclick="removeModalAttachment(\'' + targetType + '\', ' + idx + ')">×</button>' +
      '</div>';
    }).join('');
  }

  function removeModalAttachment(targetType, idx) {
    if (targetType === 'EMP') editingEmpAttachments.splice(idx, 1);
    else if (targetType === 'LEAVE') editingLeaveAttachments.splice(idx, 1);
    else editingKpiAttachments.splice(idx, 1);
    renderModalAttachmentEditor(targetType);
  }

  function handleHrFileUpload(event, targetType) {
    var files = event && event.target && event.target.files ? event.target.files : [];
    if (!files || files.length === 0) return;
    var uploader = currentUser ? currentUser.fullName : 'Nhân sự';
    var todayStr = appData.todayStr || '2025-05-15';

    Array.prototype.forEach.call(files, function(file) {
      var fName = file.name;
      var fExt = fName.indexOf('.') !== -1 ? fName.split('.').pop().toLowerCase() : 'pdf';
      var fSize = Math.max(1, Math.round(file.size / 1024)) + ' KB';

      var reader = new FileReader();
      reader.onload = function(e) {
        var dataUrl = String(e.target.result || '');
        var base64Part = dataUrl.indexOf(',') !== -1 ? dataUrl.split(',')[1] : '';
        var newAtt = {
          id: 'HRDOC-' + Date.now(),
          name: fName,
          ext: fExt,
          size: fSize,
          url: dataUrl || 'https://drive.google.com',
          uploadedBy: uploader,
          uploadedAt: todayStr
        };

        if (targetType === 'EMP') editingEmpAttachments.push(newAtt);
        else if (targetType === 'LEAVE') editingLeaveAttachments.push(newAtt);
        else editingKpiAttachments.push(newAtt);
        renderModalAttachmentEditor(targetType);
        showToast('📎 Đã đính kèm tệp: ' + fName, 'success');

        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run.withSuccessHandler(function(res) {
            if (res && res.ok && res.file) {
              newAtt.url = res.file.url;
              renderModalAttachmentEditor(targetType);
            }
          }).uploadHrAttachment({
            refId: targetType,
            fileName: fName,
            mimeType: file.type || 'application/octet-stream',
            fileSize: fSize,
            base64Data: base64Part,
            fallbackUrl: dataUrl,
            uploadedBy: uploader,
            role: currentUser ? currentUser.role : 'STAFF'
          });
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  }

  function addQuickHrDocLink(targetType) {
    var nameEl = document.getElementById('empQuickDocName');
    var urlEl = document.getElementById('empQuickDocUrl');
    var name = String(nameEl.value || '').trim();
    var url = String(urlEl.value || '').trim() || 'https://drive.google.com';
    if (!name) {
      showToast('Vui lòng nhập tên tài liệu!', 'warning');
      return;
    }
    var ext = name.indexOf('.') !== -1 ? name.split('.').pop().toLowerCase() : 'pdf';
    editingEmpAttachments.push({
      id: 'HRDOC-' + Date.now(),
      name: name,
      ext: ext,
      size: 'Cloud Link',
      url: url,
      uploadedBy: currentUser ? currentUser.fullName : 'HR'
    });
    nameEl.value = '';
    urlEl.value = '';
    renderModalAttachmentEditor('EMP');
  }

  // 1. EMPLOYEE MODAL
  function openEmployeeModal(empId) {
    var isHr = isAdminOrHr();
    if (!empId && !isHr) {
      showToast('🔒 Chỉ Phòng Nhân sự (HR_MANAGER / ADMIN) mới được tạo mới hồ sơ nhân sự!', 'warning');
      return;
    }
    if (empId) {
      var e = (appData.employees || []).find(function(x) { return x.id === empId; });
      if (e) {
        document.getElementById('empFormId').value = e.id;
        document.getElementById('empFormFullName').value = e.fullName;
        ensureSelectOption(document.getElementById('empFormDept'), e.department, e.department);
        document.getElementById('empFormDept').value = e.department;
        document.getElementById('empFormPosition').value = e.position;
        document.getElementById('empFormRole').value = e.role || 'STAFF';
        document.getElementById('empFormPhone').value = e.phone || '';
        document.getElementById('empFormEmail').value = e.email || '';
        document.getElementById('empFormContractType').value = e.contractType || 'Hợp đồng 12 tháng';
        document.getElementById('empFormContractEnd').value = e.contractEndDate || '';
        document.getElementById('empFormBaseSalary').value = e.baseSalary || 15000000;
        document.getElementById('empFormInsSalary').value = e.insuranceSalary || 9500000;
        document.getElementById('empFormAllowance').value = e.allowance || 1500000;
        document.getElementById('empFormDependents').value = e.dependents || 0;
        document.getElementById('empFormBank').value = e.bankAccount || '';
        editingEmpAttachments = JSON.parse(JSON.stringify(Array.isArray(e.attachments) ? e.attachments : []));
      }
    } else {
      var nextNum = (appData.employees ? appData.employees.length : 6) + 1;
      document.getElementById('empFormId').value = 'NV-00' + nextNum;
      document.getElementById('empFormFullName').value = '';
      document.getElementById('empFormPosition').value = 'Chuyên Viên';
      document.getElementById('empFormRole').value = 'STAFF';
      document.getElementById('empFormPhone').value = '';
      document.getElementById('empFormEmail').value = '';
      document.getElementById('empFormBaseSalary').value = 15000000;
      document.getElementById('empFormInsSalary').value = 9500000;
      document.getElementById('empFormAllowance').value = 1500000;
      document.getElementById('empFormDependents').value = 0;
      document.getElementById('empFormBank').value = '';
      editingEmpAttachments = [];
    }
    // Khóa các trường lương nếu nhân viên tự mở xem hồ sơ của mình
    document.getElementById('empFormBaseSalary').disabled = !isHr;
    document.getElementById('empFormInsSalary').disabled = !isHr;
    document.getElementById('empFormAllowance').disabled = !isHr;
    document.getElementById('empFormRole').disabled = !isHr;

    renderModalAttachmentEditor('EMP');
    openCustomModal('modalEmployeeBackdrop');
  }

  function submitEmployeeForm() {
    var id = String(document.getElementById('empFormId').value || '').trim();
    var fullName = String(document.getElementById('empFormFullName').value || '').trim();
    if (!fullName) {
      showToast('Vui lòng nhập Họ và Tên nhân sự!', 'danger');
      return;
    }
    var existing = (appData.employees || []).find(function(x) { return x.id === id; });
    var payload = {
      id: id || ('NV-00' + ((appData.employees || []).length + 1)),
      fullName: fullName,
      department: document.getElementById('empFormDept').value,
      position: document.getElementById('empFormPosition').value,
      role: document.getElementById('empFormRole').value || (existing ? existing.role : 'STAFF'),
      phone: document.getElementById('empFormPhone').value,
      email: document.getElementById('empFormEmail').value,
      joinDate: existing ? existing.joinDate : (appData.todayStr || '2025-05-15'),
      contractType: document.getElementById('empFormContractType').value,
      contractEndDate: document.getElementById('empFormContractEnd').value,
      baseSalary: Number(document.getElementById('empFormBaseSalary').value || (existing ? existing.baseSalary : 15000000)),
      insuranceSalary: Number(document.getElementById('empFormInsSalary').value || (existing ? existing.insuranceSalary : 9500000)),
      allowance: Number(document.getElementById('empFormAllowance').value || (existing ? existing.allowance : 1500000)),
      dependents: Number(document.getElementById('empFormDependents').value || 0),
      bankAccount: document.getElementById('empFormBank').value,
      status: 'Đang làm việc',
      attachments: editingEmpAttachments,
      actor: currentUser ? currentUser.username : 'hr_mgr',
      actorRole: currentUser ? currentUser.role : 'HR_MANAGER'
    };

    if (existing) {
      Object.assign(existing, payload);
    } else {
      appData.employees.unshift(payload);
    }
    closeCustomModal('modalEmployeeBackdrop');
    renderAllViews();
    showToast('✅ Đã lưu hồ sơ nhân sự: ' + payload.fullName, 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveEmployeeRecord(payload);
    }
  }

  function handleDeleteEmployee(empId) {
    if (!isAdminOrHr()) return;
    appData.employees = (appData.employees || []).filter(function(e) { return e.id !== empId; });
    renderAllViews();
    showToast('🗑️ Đã xóa hồ sơ nhân sự ' + empId, 'warning');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).deleteEmployeeRecord({ id: empId });
    }
  }

  // 2. ATTENDANCE MODAL
  function openAttendanceModal(attId) {
    populateEmployeeSelects();
    var isLead = isLeaderOrAbove();
    var empSel = document.getElementById('attFormEmployee');
    empSel.disabled = !isLead;

    if (attId) {
      var a = (appData.attendance || []).find(function(x) { return x.id === attId; });
      if (a) {
        ensureSelectOption(empSel, a.empId, a.empId + ' - ' + a.fullName);
        document.getElementById('attFormId').value = a.id;
        document.getElementById('attFormDate').value = a.date;
        empSel.value = a.empId;
        document.getElementById('attFormShift').value = a.shift;
        document.getElementById('attFormWorkMode').value = a.workMode;
        document.getElementById('attFormCheckIn').value = a.checkIn;
        document.getElementById('attFormCheckOut').value = a.checkOut;
        document.getElementById('attFormWorkUnits').value = a.workUnits;
        document.getElementById('attFormOtHours').value = a.otHours;
        document.getElementById('attFormNotes').value = a.notes || '';
      }
    } else {
      document.getElementById('attFormId').value = '';
      document.getElementById('attFormDate').value = appData.todayStr || '2025-05-15';
      if (currentUser && currentUser.empId) {
        ensureSelectOption(empSel, currentUser.empId, currentUser.empId + ' - ' + currentUser.fullName);
        empSel.value = currentUser.empId;
      }
      document.getElementById('attFormCheckIn').value = '08:00';
      document.getElementById('attFormCheckOut').value = '17:30';
      document.getElementById('attFormWorkUnits').value = 1.0;
      document.getElementById('attFormOtHours').value = 0;
      document.getElementById('attFormNotes').value = '';
    }
    openCustomModal('modalAttendanceBackdrop');
  }

  function submitAttendanceForm() {
    var empId = document.getElementById('attFormEmployee').value || (currentUser ? currentUser.empId : 'NV-001');
    var empObj = (appData.employees || []).find(function(e) { return e.id === empId; });
    var ot = Number(document.getElementById('attFormOtHours').value || 0);
    var payload = {
      id: document.getElementById('attFormId').value || ('CC-' + Math.floor(1000 + Math.random() * 8999)),
      date: document.getElementById('attFormDate').value,
      empId: empId,
      fullName: empObj ? empObj.fullName : (currentUser ? currentUser.fullName : empId),
      department: empObj ? empObj.department : (currentUser ? currentUser.department : ''),
      shift: document.getElementById('attFormShift').value,
      workMode: document.getElementById('attFormWorkMode').value,
      checkIn: document.getElementById('attFormCheckIn').value,
      checkOut: document.getElementById('attFormCheckOut').value,
      workUnits: Number(document.getElementById('attFormWorkUnits').value || 1.0),
      otHours: ot,
      status: ot > 0 ? 'Đúng giờ + Tăng ca' : 'Đúng giờ (Đủ công)',
      notes: document.getElementById('attFormNotes').value,
      actor: currentUser ? currentUser.username : 'admin',
      actorRole: currentUser ? currentUser.role : 'STAFF'
    };

    var existing = (appData.attendance || []).find(function(x) { return x.id === payload.id; });
    if (existing) Object.assign(existing, payload);
    else appData.attendance.unshift(payload);

    closeCustomModal('modalAttendanceBackdrop');
    renderAllViews();
    showToast('🕒 Đã lưu chấm công cho: ' + payload.fullName, 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveAttendanceRecord(payload);
    }
  }

  // 3. LEAVE / OT MODAL
  function openLeaveModal(leaveId) {
    populateEmployeeSelects();
    var isLead = isLeaderOrAbove();
    var empSel = document.getElementById('leaveFormEmployee');
    empSel.disabled = !isLead;

    var optApp = document.getElementById('optLeaveApprovedMgrOnly');
    var optRej = document.getElementById('optLeaveRejectedMgrOnly');
    if (optApp) optApp.disabled = !isLead;
    if (optRej) optRej.disabled = !isLead;
    document.getElementById('leaveFormApprovalNote').disabled = !isLead;

    var todayStr = appData.todayStr || '2025-05-15';
    if (leaveId) {
      var l = (appData.leaveRequests || []).find(function(x) { return x.id === leaveId; });
      if (l) {
        ensureSelectOption(empSel, l.empId, l.empId + ' - ' + l.fullName);
        document.getElementById('leaveFormId').value = l.id;
        empSel.value = l.empId;
        document.getElementById('leaveFormType').value = l.requestType;
        document.getElementById('leaveFormFrom').value = l.fromDate || todayStr;
        document.getElementById('leaveFormTo').value = l.toDate || todayStr;
        document.getElementById('leaveFormQty').value = l.quantity || 1;
        document.getElementById('leaveFormReason').value = l.reason || '';
        document.getElementById('leaveFormStatus').value = (!isLead && l.status !== 'Chờ duyệt') ? 'Chờ duyệt' : l.status;
        document.getElementById('leaveFormApprovalNote').value = l.approvalNote || '';
        editingLeaveAttachments = JSON.parse(JSON.stringify(Array.isArray(l.attachments) ? l.attachments : []));
      }
    } else {
      document.getElementById('leaveFormId').value = '';
      if (currentUser && currentUser.empId) {
        ensureSelectOption(empSel, currentUser.empId, currentUser.empId + ' - ' + currentUser.fullName);
        empSel.value = currentUser.empId;
      }
      document.getElementById('leaveFormFrom').value = todayStr;
      document.getElementById('leaveFormTo').value = todayStr;
      document.getElementById('leaveFormQty').value = 1.0;
      document.getElementById('leaveFormReason').value = '';
      document.getElementById('leaveFormStatus').value = 'Chờ duyệt';
      document.getElementById('leaveFormApprovalNote').value = '';
      editingLeaveAttachments = [];
    }
    renderModalAttachmentEditor('LEAVE');
    openCustomModal('modalLeaveBackdrop');
  }

  function submitLeaveForm() {
    var isLead = isLeaderOrAbove();
    var reason = String(document.getElementById('leaveFormReason').value || '').trim();
    if (!reason) {
      showToast('Vui lòng nhập lý do xin nghỉ phép / nội dung làm thêm giờ OT!', 'danger');
      return;
    }
    var leaveId = document.getElementById('leaveFormId').value;
    var existing = leaveId ? (appData.leaveRequests || []).find(function(x) { return x.id === leaveId; }) : null;

    var empId = document.getElementById('leaveFormEmployee').value || (existing ? existing.empId : (currentUser ? currentUser.empId : 'NV-001'));
    var empObj = (appData.employees || []).find(function(e) { return e.id === empId; });

    var chosenStatus = document.getElementById('leaveFormStatus').value || 'Chờ duyệt';
    if (!isLead) chosenStatus = 'Chờ duyệt';

    var payload = {
      id: leaveId || ('DT-' + Math.floor(200 + Math.random() * 799)),
      createdAt: existing ? existing.createdAt : (appData.todayStr || '2025-05-15'),
      empId: empId,
      fullName: empObj ? empObj.fullName : (existing ? existing.fullName : (currentUser ? currentUser.fullName : empId)),
      department: empObj ? empObj.department : (existing ? existing.department : (currentUser ? currentUser.department : '')),
      requestType: document.getElementById('leaveFormType').value,
      fromDate: document.getElementById('leaveFormFrom').value,
      toDate: document.getElementById('leaveFormTo').value,
      quantity: Number(document.getElementById('leaveFormQty').value || 1),
      reason: reason,
      status: chosenStatus,
      approver: isLead && chosenStatus !== 'Chờ duyệt' ? (currentUser ? currentUser.fullName : 'Quản lý') : (existing ? existing.approver : 'Ban Quản Lý / HR'),
      approvalNote: document.getElementById('leaveFormApprovalNote').value,
      attachments: editingLeaveAttachments,
      canApprove: isLead,
      actor: currentUser ? currentUser.username : 'staff',
      actorRole: currentUser ? currentUser.role : 'STAFF'
    };

    if (existing) Object.assign(existing, payload);
    else appData.leaveRequests.unshift(payload);

    closeCustomModal('modalLeaveBackdrop');
    renderAllViews();
    showToast('📝 Đã lưu và gửi đơn từ [' + payload.id + '] (' + payload.status + ')!', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveLeaveOrOtRequest(payload);
    }
  }

  // 4. KPI MODAL (CÓ BẢO VỆ 100% PROGRESS TỰ ĐỘNG CHUYỂN CHỜ DUYỆT & KHÔNG MẤT NHÂN SỰ)
  function onKpiProgressInput(val) {
    var p = Number(val || 0);
    var stEl = document.getElementById('kpiFormStatus');
    if (!stEl) return;
    if (p >= 100) {
      if (!isLeaderOrAbove() || stEl.value === 'Đang thực hiện') {
        stEl.value = 'Chờ duyệt';
      }
    }
  }

  function openKpiModal(kpiId) {
    populateEmployeeSelects();
    var isLead = isLeaderOrAbove();
    var empSel = document.getElementById('kpiFormEmployee');
    var optApp = document.getElementById('optKpiApprovedMgrOnly');
    if (optApp) optApp.disabled = !isLead;

    var isEditingAsStaff = (!!kpiId && !isLead);
    empSel.disabled = !isLead;
    document.getElementById('kpiFormGoal').disabled = isEditingAsStaff;
    document.getElementById('kpiFormBonus').disabled = !isLead;

    if (kpiId) {
      var k = (appData.kpiReviews || []).find(function(x) { return x.id === kpiId; });
      if (k) {
        ensureSelectOption(empSel, k.empId, k.empId + ' - ' + k.fullName);
        document.getElementById('kpiFormId').value = k.id;
        document.getElementById('kpiFormPeriod').value = k.period;
        empSel.value = k.empId;
        document.getElementById('kpiFormGoal').value = k.goalTitle;
        document.getElementById('kpiFormProgress').value = k.progress;
        document.getElementById('kpiFormBonus').value = k.bonusAmount;
        document.getElementById('kpiFormStatus').value = (!isLead && k.status === 'Đã duyệt') ? 'Chờ duyệt' : k.status;
        document.getElementById('kpiFormNotes').value = k.notes || '';
        editingKpiAttachments = JSON.parse(JSON.stringify(Array.isArray(k.attachments) ? k.attachments : []));
      }
    } else {
      document.getElementById('kpiFormId').value = '';
      document.getElementById('kpiFormPeriod').value = appData.curMonthStr || '2025-05';
      if (currentUser && currentUser.empId) {
        ensureSelectOption(empSel, currentUser.empId, currentUser.empId + ' - ' + currentUser.fullName);
        empSel.value = currentUser.empId;
      }
      document.getElementById('kpiFormGoal').value = '';
      document.getElementById('kpiFormProgress').value = 80;
      document.getElementById('kpiFormBonus').value = 2500000;
      document.getElementById('kpiFormStatus').value = 'Đang thực hiện';
      document.getElementById('kpiFormNotes').value = '';
      editingKpiAttachments = [];
    }
    renderModalAttachmentEditor('KPI');
    openCustomModal('modalKpiBackdrop');
  }

  function submitKpiForm() {
    var isLead = isLeaderOrAbove();
    var kpiId = document.getElementById('kpiFormId').value;
    var existing = kpiId ? (appData.kpiReviews || []).find(function(x) { return x.id === kpiId; }) : null;

    var goal = String(document.getElementById('kpiFormGoal').value || (existing ? existing.goalTitle : '')).trim();
    if (!goal) {
      showToast('Vui lòng nhập Mục tiêu / Chỉ tiêu KPI!', 'danger');
      return;
    }

    var empId = document.getElementById('kpiFormEmployee').value || (existing ? existing.empId : (currentUser ? currentUser.empId : 'NV-001'));
    var empObj = (appData.employees || []).find(function(e) { return e.id === empId; });

    var prog = Number(document.getElementById('kpiFormProgress').value || 0);
    if (prog > 100) prog = 100;
    if (prog < 0) prog = 0;

    var status = document.getElementById('kpiFormStatus').value || 'Đang thực hiện';
    if (prog >= 100) {
      prog = 100;
      if (!isLead || status === 'Đang thực hiện') {
        status = 'Chờ duyệt';
      }
    } else if (!isLead && status === 'Đã duyệt') {
      status = 'Chờ duyệt';
    }

    var grade = prog >= 90 ? 'Xuất sắc (A+)' : (prog >= 80 ? 'Tốt (A)' : (prog >= 65 ? 'Đạt (B)' : 'Cần cố gắng (C)'));
    var payload = {
      id: kpiId || ('KPI-' + Math.floor(300 + Math.random() * 699)),
      period: document.getElementById('kpiFormPeriod').value || (appData.curMonthStr || '2025-05'),
      empId: empId,
      fullName: empObj ? empObj.fullName : (existing ? existing.fullName : (currentUser ? currentUser.fullName : empId)),
      department: empObj ? empObj.department : (existing ? existing.department : (currentUser ? currentUser.department : '')),
      goalTitle: goal,
      weight: 100,
      progress: prog,
      score: prog,
      grade: grade,
      bonusAmount: Number(document.getElementById('kpiFormBonus').value || (existing ? existing.bonusAmount : 2500000)),
      status: status,
      notes: document.getElementById('kpiFormNotes').value,
      attachments: editingKpiAttachments,
      canApprove: isLead,
      actor: currentUser ? currentUser.username : 'staff',
      actorRole: currentUser ? currentUser.role : 'STAFF'
    };

    if (existing) Object.assign(existing, payload);
    else appData.kpiReviews.unshift(payload);

    closeCustomModal('modalKpiBackdrop');
    renderAllViews();
    showToast('🏆 Đã lưu cập nhật KPI của ' + payload.fullName + ' (' + prog + '% - ' + status + ')!', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveKpiReviewItem(payload);
    }
  }

  function quickApproveKpi(kpiId) {
    if (!isLeaderOrAbove()) return;
    var k = (appData.kpiReviews || []).find(function(x) { return x.id === kpiId; });
    if (!k) return;
    k.status = 'Đã duyệt';
    k.canApprove = true;
    renderAllViews();
    showToast('✅ Đã duyệt nghiệm thu KPI [' + kpiId + '] cho ' + k.fullName + '!', 'success');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveKpiReviewItem(k);
    }
  }

  // 5. USER RBAC MODAL & SUBORDINATE ACTIONS
  function setHrPermCheckboxes(permsArr) {
    var list = Array.isArray(permsArr) ? permsArr : [];
    document.querySelectorAll('.hr-perm-chk').forEach(function(chk) {
      chk.checked = list.indexOf(chk.value) !== -1;
    });
  }

  function onHrRoleSelectChange(roleVal) {
    setHrPermCheckboxes(getDefaultPermsByRole(roleVal));
  }

  function openUserModal(uname) {
    if (!isLeaderOrAbove()) {
      showToast('🔒 Chỉ cấp Trưởng nhóm / HR / Giám đốc mới được thiết lập tài khoản phân quyền!', 'danger');
      return;
    }
    var deptSel = document.getElementById('usrFormDept');
    if (uname) {
      var u = (appData.users || []).find(function(x) { return String(x.username || '').toLowerCase() === String(uname || '').toLowerCase(); });
      if (u) {
        document.getElementById('usrFormUsername').value = u.username;
        document.getElementById('usrFormPassword').value = u.password || '123456';
        document.getElementById('usrFormEmpId').value = u.empId || 'NV-007';
        document.getElementById('usrFormFullName').value = u.fullName;
        document.getElementById('usrFormRole').value = u.role || 'STAFF';
        ensureSelectOption(deptSel, u.department, u.department);
        deptSel.value = u.department;
        document.getElementById('usrFormEmail').value = u.email || '';
        document.getElementById('usrFormPhone').value = u.phone || '';
        document.getElementById('usrFormStatus').value = String(u.status || '').toLowerCase().indexOf('khóa') !== -1 ? 'Tạm khóa' : 'Hoạt động';
        setHrPermCheckboxes(getUserPerms(u));
      }
    } else {
      var nextIdx = ((appData.users || []).length + 1);
      document.getElementById('usrFormUsername').value = '';
      document.getElementById('usrFormPassword').value = '123456';
      document.getElementById('usrFormEmpId').value = 'NV-00' + nextIdx;
      document.getElementById('usrFormFullName').value = '';
      document.getElementById('usrFormRole').value = 'STAFF';
      var defDept = (currentUser && !isAdminOrHr()) ? currentUser.department : 'Phòng Kinh Doanh & CRM';
      ensureSelectOption(deptSel, defDept, defDept);
      deptSel.value = defDept;
      document.getElementById('usrFormEmail').value = '';
      document.getElementById('usrFormPhone').value = '';
      document.getElementById('usrFormStatus').value = 'Hoạt động';
      onHrRoleSelectChange('STAFF');
    }
    openCustomModal('modalUserBackdrop');
  }

  function submitUserForm(callbackAfter) {
    var uname = String(document.getElementById('usrFormUsername').value || '').trim().toLowerCase();
    if (!uname) {
      showToast('Vui lòng nhập Username đăng nhập!', 'danger');
      return;
    }
    var perms = [];
    document.querySelectorAll('.hr-perm-chk:checked').forEach(function(chk) { perms.push(chk.value); });

    var payload = {
      username: uname,
      password: document.getElementById('usrFormPassword').value || '123456',
      empId: String(document.getElementById('usrFormEmpId').value || ('NV-' + uname.toUpperCase())).trim(),
      fullName: String(document.getElementById('usrFormFullName').value || uname).trim(),
      role: document.getElementById('usrFormRole').value || 'STAFF',
      department: document.getElementById('usrFormDept').value || 'Phòng Kinh Doanh & CRM',
      email: document.getElementById('usrFormEmail').value || '',
      phone: document.getElementById('usrFormPhone').value || '',
      status: document.getElementById('usrFormStatus').value || 'Hoạt động',
      permissions: perms.join(','),
      actor: currentUser ? currentUser.username : 'admin',
      actorRole: currentUser ? currentUser.role : 'ADMIN'
    };

    var existing = (appData.users || []).find(function(x) { return String(x.username || '').toLowerCase() === uname; });
    if (existing) Object.assign(existing, payload);
    else appData.users.push(payload);

    // Tự động khởi tạo hồ sơ nhân sự & phiếu lương cho tài khoản mới để đăng nhập thao tác được ngay!
    ensureLoggedUserHasHrRecords(payload);

    closeCustomModal('modalUserBackdrop');
    renderAllViews();
    showToast('✅ Đã lưu tài khoản & đồng bộ hồ sơ nhân sự cho: ' + payload.fullName, 'success');

    if (typeof callbackAfter === 'function') callbackAfter(payload);

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveHrUserAccount(payload);
    }
  }

  function saveUserAndOpenKpiModal() {
    submitUserForm(function(savedUser) {
      openKpiModalForUser(savedUser.username);
    });
  }

  function openKpiModalForUser(uname) {
    var u = (appData.users || []).find(function(x) { return String(x.username || '').toLowerCase() === String(uname || '').toLowerCase(); });
    openKpiModal();
    if (u) {
      var sel = document.getElementById('kpiFormEmployee');
      ensureSelectOption(sel, u.empId, u.empId + ' - ' + u.fullName);
      sel.value = u.empId;
      showToast('🏆 Đang tạo mục tiêu KPI mới giao cho: ' + u.fullName, 'success');
    }
  }

  function filterAttendanceByUser(empId, fullName) {
    switchMainTab('attendance');
    var sel = document.getElementById('filterAttEmployee');
    if (sel && empId) {
      ensureSelectOption(sel, empId, empId + ' - ' + fullName);
      sel.value = empId;
    }
    renderAttendanceSection();
    showToast('🕒 Đang xem lịch sử chấm công của: ' + fullName, 'success');
  }

  function quickChangeHrUserRole(uname, newRole) {
    if (!isLeaderOrAbove()) return;
    var u = (appData.users || []).find(function(x) { return String(x.username || '').toLowerCase() === String(uname || '').toLowerCase(); });
    if (!u) return;
    u.role = newRole;
    u.permissions = getDefaultPermsByRole(newRole).join(',');
    renderAllViews();
    showToast('⚡ Đã chuyển vai trò của ' + u.fullName + ' sang [' + newRole + ']!', 'success');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveHrUserAccount(u);
    }
  }

  function quickToggleHrUserStatus(uname) {
    if (!isLeaderOrAbove() || String(uname).toLowerCase() === 'admin') return;
    var u = (appData.users || []).find(function(x) { return String(x.username || '').toLowerCase() === String(uname || '').toLowerCase(); });
    if (!u) return;
    var isLocked = String(u.status || '').toLowerCase().indexOf('khóa') !== -1;
    u.status = isLocked ? 'Hoạt động' : 'Tạm khóa';
    renderAllViews();
    showToast((u.status === 'Hoạt động' ? '🟢 Đã mở khóa: ' : '🔒 Đã tạm khóa: ') + u.fullName, 'warning');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveHrUserAccount(u);
    }
  }

  function handleSaveHrConfig() {
    if (!isAdminOrHr()) return;
    var newCfg = {
      COMPANY_NAME: document.getElementById('cfgCompanyName').value,
      CURRENT_PAYROLL_PERIOD: document.getElementById('cfgPayrollPeriod').value,
      STANDARD_WORK_DAYS: document.getElementById('cfgStandardDays').value,
      BHXH_EMP_RATE: document.getElementById('cfgBhxhEmpRate').value,
      OT_HOURLY_RATE_MULTIPLIER: document.getElementById('cfgOtMultiplier').value,
      ZALO_BOT_WEBHOOK_URL: document.getElementById('cfgZaloWebhook').value,
      ADMIN_EMAIL: document.getElementById('cfgAdminEmail').value
    };
    appData.config = Object.assign(appData.config || {}, newCfg);
    renderAllViews();
    showToast('⚙️ Đã lưu cấu hình Định mức BHXH, Thuế TNCN & Webhook Bot Zalo/Email!', 'success');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveHrSystemConfig({ config: newCfg, actor: currentUser ? currentUser.username : 'admin' });
    }
  }

  function bootHrApp() {
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
    document.addEventListener('DOMContentLoaded', bootHrApp);
  } else {
    bootHrApp();
  }
  window.addEventListener('load', bootHrApp);
</script>
</body>
</html>


```
