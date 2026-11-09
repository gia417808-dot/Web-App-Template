/**
 * ============================================================================
 * GS-003-SME: HỆ THỐNG KẾ TOÁN QUẢN TRỊ DOANH NGHIỆP VỪA & NHỎ (SME 30-150 NHÂN SỰ)
 * BỘ 3 BÁO CÁO TÀI CHÍNH LIÊN KẾT (P&L - BALANCE SHEET - CASH FLOW),
 * KIỂM SOÁT NGÂN SÁCH DỰ TOÁN VS THỰC TẾ (BVA), VỐN LƯU ĐỘNG (NWC) & EBITDA
 * Phiên bản: v4.1 Commercial Pro (Cấp 3 trong Bộ Tứ Quản Trị Tài Chính Doanh Nghiệp)
 * File: installer.gs — Khởi tạo tự động 9 Sheet Chuẩn Kế Toán Quản Trị & FP&A
 * ============================================================================
 */

function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('📊 KẾ TOÁN QUẢN TRỊ SME & BVA (GS-003-SME PRO)')
      .addItem('🚀 1. Khởi tạo / Làm mới Database Kế Toán Quản Trị SME (9 Sheets)', 'setupSmeFinanceDatabase')
      .addSeparator()
      .addItem('🔄 2. Tự động Tổng hợp lại P&L, BVA & Bảng Cân Đối Kế Toán', 'recalculateSmeFinancialStatements')
      .addItem('🔔 3. Quét & Bắn Cảnh Báo Vượt Trần Ngân Sách Phòng Ban (BVA)', 'sendSmeBudgetVarianceAlert')
      .addToUi();
  } catch (e) {}
}

function setupSmeFinanceDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Không tìm thấy Google Spreadsheet!');

  try {
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  } catch (e) {}

  var requiredTabs = [
    'HUONG_DAN_SU_DUNG',
    'CAU_HINH',
    'PHAN_QUYEN',
    'SO_NHAT_KY_HACH_TOAN',
    'BAO_CAO_PL_THU_NHAP',
    'NGAN_SACH_BVA_PHONG_BAN',
    'BANG_CAN_DOI_KE_TOAN',
    'LUU_CHUYEN_TIEN_TE_KPI',
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
  var curYearStr = Utilities.formatDate(today, 'Asia/Ho_Chi_Minh', 'yyyy');
  function fmtDateOffset(days) {
    var d = new Date(today.getTime() + days * 86400000);
    return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }

  // =========================================================================
  // 0. TAB HUONG_DAN_SU_DUNG (CẨM NANG KẾ TOÁN QUẢN TRỊ & TỪ ĐIỂN FP&A CHO NGƯỜI MỚI)
  // =========================================================================
  var shGuide = ss.getSheetByName('HUONG_DAN_SU_DUNG');
  shGuide.getRange('A1:E1').merge().setValue('📘 CẨM NANG HƯỚNG DẪN SỬ DỤNG & TỪ ĐIỂN THUẬT NGỮ KẾ TOÁN QUẢN TRỊ SME (P&L, BVA, BALANCE SHEET, NWC, EBITDA) — GS-003-SME v4.1 PRO')
    .setBackground('#1E3A8A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shGuide.setRowHeight(1, 38);

  var guideHeaders = [[
    'PHÂN NHÓM BÁO CÁO', 'THUẬT NGỮ / CHỈ SỐ TRÊN APP', 'GIẢI THÍCH DỄ HIỂU CHO NGƯỜI MỚI (NGÔN NGỮ BÌNH DÂN)',
    'CÔNG THỨC TÍNH & CHUẨN ĐÁNH GIÁ SỨC KHỎE DOANH NGHIỆP', 'VÍ DỤ THỰC TẾ TẠI DOANH NGHIỆP SME'
  ]];
  shGuide.getRange('A2:E2').setValues(guideHeaders).setBackground('#1D4ED8').setFontColor('#FFFFFF').setFontWeight('bold');

  var guideRows = [
    ['1. BÁO CÁO KẾT QUẢ KINH DOANH (P&L)', 'Doanh thu thuần (Net Revenue)', 'Số tiền bán hàng thực sự công ty được hưởng sau khi đã trừ đi các khoản chiết khấu thương mại, giảm giá hoặc hàng bán bị trả lại.', 'Doanh thu thuần = Tổng Doanh thu bán hàng - Khoản giảm trừ doanh thu', 'Bán hàng xuất hóa đơn 12,5 tỷ, chiết khấu khuyến mãi cho đại lý 500tr ➔ Doanh thu thuần = 12 tỷ đồng.'],
    ['1. BÁO CÁO KẾT QUẢ KINH DOANH (P&L)', 'Giá vốn hàng bán (COGS) & Lợi nhuận gộp (Gross Profit)', 'COGS là tiền vốn nhập hàng hóa, nguyên vật liệu hoặc chi phí sản xuất trực tiếp ra sản phẩm. Lấy Doanh thu thuần trừ Giá vốn sẽ ra Lợi nhuận gộp.', 'Lợi nhuận gộp = Doanh thu thuần - Giá vốn (COGS). Biên lãi gộp (%) = (Lợi nhuận gộp / Doanh thu thuần) × 100%.', 'Doanh thu thuần 12 tỷ, tiền nhập hàng (COGS) hết 7,2 tỷ ➔ Lợi nhuận gộp = 4,8 tỷ (Biên lãi gộp đạt 40%).'],
    ['1. BÁO CÁO KẾT QUẢ KINH DOANH (P&L)', 'EBITDA & EBIT (Lợi nhuận hoạt động)', 'EBITDA là lợi nhuận từ hoạt động kinh doanh cốt lõi TRƯỚC khi trừ Lãi vay ngân hàng, Thuế và Khấu hao máy móc. EBIT là lợi nhuận sau khi đã trừ Khấu hao.', 'EBITDA = Lợi nhuận gộp - Chi phí Bán hàng - Chi phí Quản lý (chưa trừ khấu hao). EBIT = EBITDA - Chi phí khấu hao.', 'Giúp Giám đốc biết chính xác sức làm ra tiền của bộ máy kinh doanh trước khi tính chuyện vay nợ hay khấu hao tài sản.'],
    ['1. BÁO CÁO KẾT QUẢ KINH DOANH (P&L)', 'Lợi nhuận ròng sau thuế (Net Income / Bottom Line)', 'Số tiền lãi thực sự còn lại cuối cùng thuộc về chủ doanh nghiệp sau khi đã trừ hết mọi chi phí, trả lãi vay ngân hàng và đóng thuế TNDN (20%).', 'Lợi nhuận ròng = Lợi nhuận trước thuế (EBT) - Thuế TNDN (20%). Biên lãi ròng = Lợi nhuận ròng / Doanh thu thuần.', 'Sau khi trừ hết chi phí, lãi vay và đóng thuế TNDN, công ty còn lãi ròng bỏ túi 1,68 tỷ (Biên lãi ròng 14%).'],
    ['2. KIỂM SOÁT NGÂN SÁCH (BVA)', 'BVA (Budget vs. Actual - Dự toán vs Thực tế)', 'Bảng so sánh giữa Số tiền ban giám đốc cho phép chi đầu kỳ (Budget - Dự toán) và Số tiền phòng ban đã thực sự tiêu (Actual - Thực tế).', 'Chênh lệch (Variance) = Thực tế (Actual) - Dự toán (Budget). % Sử dụng = (Actual / Budget) × 100%.', 'Phòng Marketing được duyệt ngân sách quý là 600tr (Budget), đã tiêu 540tr (Actual) ➔ Đạt 90% trần ngân sách.'],
    ['2. KIỂM SOÁT NGÂN SÁCH (BVA)', 'Cảnh báo Vượt trần Ngân sách (Over-Budget Alert)', 'Hệ thống tự động đổi màu cảnh báo: 🟢 Xanh (< 90% ngân sách), 🟡 Vàng (90% - 100% sắp chạm trần), 🔴 Đỏ (> 100% chi vượt ngân sách cho phép).', 'Nếu Chi phí Thực tế > Dự toán (> 100%) ➔ Bắt buộc Trưởng bộ phận phải giải trình trước khi Kế toán trưởng duyệt chi tiếp.', 'Phòng Hành chính được giao định mức 150tr nhưng chi tới 168tr (112%) ➔ Hệ thống bật cờ Đỏ cảnh báo vượt 18tr.'],
    ['3. BẢNG CÂN ĐỐI KẾ TOÁN (BALANCE SHEET)', 'Phương trình Cân đối Kế toán (Assets = Liabilities + Equity)', 'Bức ảnh chụp toàn bộ gia sản của công ty tại 1 thời điểm: Bên trái là TÀI SẢN (Tiền, Phải thu, Tồn kho, Máy móc); Bên phải là NGUỒN VỐN (Nợ phải trả + Vốn chủ sở hữu).', 'Quy tắc bất di bất dịch: TỔNG TÀI SẢN luôn phải BẰNG TỔNG NGUỒN VỐN (Nợ phải trả + Vốn chủ sở hữu).', 'Công ty có Tổng tài sản 18,5 tỷ = Nợ phải trả (Ngân hàng & Nhà cung cấp) 6,5 tỷ + Vốn chủ sở hữu 12 tỷ.'],
    ['3. BẢNG CÂN ĐỐI KẾ TOÁN (BALANCE SHEET)', 'Vốn lưu động ròng (Net Working Capital - NWC)', 'Số vốn ngắn hạn giúp máu lưu thông hàng ngày trong doanh nghiệp. NWC dương chứng tỏ tài sản ngắn hạn đủ sức trả hết các khoản nợ ngắn hạn.', 'NWC = (Tiền + Phải thu khách hàng + Hàng tồn kho) - Nợ ngắn hạn phải trả nhà cung cấp.', 'Tiền + Phải thu + Tồn kho = 9,2 tỷ; Nợ ngắn hạn phải trả = 4,1 tỷ ➔ Vốn lưu động ròng NWC dương +5,1 tỷ (Rất khỏe).'],
    ['4. LƯU CHUYỂN TIỀN TỆ & KPI NGÀNH', 'Vì sao Công ty có Lãi trên P&L nhưng Két lại hết tiền?', 'Vì P&L ghi nhận doanh thu ngay khi xuất hóa đơn (dù khách nợ chưa trả tiền) và không tính tiền chôn vào hàng tồn kho. Báo cáo Lưu chuyển tiền tệ (Cash Flow) sẽ chỉ ra tiền thật đang nằm ở đâu.', 'Dòng tiền Hoạt động (OCF) = Lợi nhuận ròng + Khấu hao - Tăng Phải thu khách nợ - Tăng Hàng tồn kho + Tăng Nợ nhà cung cấp.', 'Bán hàng lãi 1,68 tỷ trên giấy nhưng khách nợ thêm 1,2 tỷ và ôm thêm 800tr hàng tồn kho ➔ Dòng tiền mặt thực tế bị âm!'],
    ['5. CÁCH ĐỔI MẬT KHẨU & PHÂN QUYỀN', 'Xác thực Mật khẩu Thời gian thực trên Sheet PHAN_QUYEN', 'Khi bạn sửa mật khẩu tại cột B của Sheet PHAN_QUYEN (hoặc đổi trong Tab 6 của Web App), hệ thống kiểm tra trực tiếp trên Google Sheets tại đúng thời điểm bấm Đăng nhập.', '5 Vai trò: ADMIN (Giám đốc), CFO_CHIEF_ACC (CFO/Kế toán trưởng), DEPT_HEAD (Trưởng phòng xem BVA phòng mình), ACCOUNTANT (Kế toán viên), AUDITOR (Kiểm toán chỉ xem).', 'Sửa mật khẩu của cfo_sme trên Sheet PHAN_QUYEN ➔ Sang Web App có hiệu lực ngay lập tức mà không cần triển khai lại.']
  ];
  shGuide.getRange(3, 1, guideRows.length, 5).setValues(guideRows);
  shGuide.getRange(3, 1, guideRows.length, 5).setWrap(true).setVerticalAlignment('top');
  shGuide.setColumnWidth(1, 220);
  shGuide.setColumnWidth(2, 250);
  shGuide.setColumnWidth(3, 380);
  shGuide.setColumnWidth(4, 320);
  shGuide.setColumnWidth(5, 340);

  // =========================================================================
  // 1. TAB CAU_HINH (THÔNG SỐ TÀI CHÍNH SME, THUẾ TNDN & NGƯỠNG BVA)
  // =========================================================================
  var shCfg = ss.getSheetByName('CAU_HINH');
  shCfg.getRange('A1:D1').merge().setValue('⚙️ CẤU HÌNH HỆ THỐNG KẾ TOÁN QUẢN TRỊ SME, ĐỊNH MỨC THUẾ TNDN, TRẦN NGÂN SÁCH BVA & BOT CẢNH BÁO CFO')
    .setBackground('#0F172A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shCfg.setRowHeight(1, 36);

  var cfgHeaders = [['MÃ THAM SỐ (KEY)', 'GIÁ TRỊ CÀI ĐẶT (VALUE)', 'NHÓM CẤU HÌNH', 'MÔ TẢ CHI TIẾT']];
  shCfg.getRange('A2:D2').setValues(cfgHeaders).setBackground('#1E293B').setFontColor('#FFFFFF').setFontWeight('bold');

  var cfgData = [
    ['COMPANY_NAME', 'CÔNG TY CỔ PHẦN THƯƠNG MẠI & SẢN XUẤT ĐẠI VIỆT SME', 'DOANH_NGHIEP', 'Tên doanh nghiệp hiển thị trên Báo cáo Tài chính P&L, BVA và Bảng Cân đối Kế toán A4'],
    ['COMPANY_TAX_CODE', '0315998877', 'DOANH_NGHIEP', 'Mã số thuế doanh nghiệp'],
    ['COMPANY_SCALE', 'Doanh nghiệp Vừa & Nhỏ (Quy mô 85 Nhân sự - 6 Phòng ban)', 'DOANH_NGHIEP', 'Quy mô vận hành hiện tại'],
    ['FISCAL_PERIOD', curYearStr + ' (Kỳ báo cáo: ' + curMonthStr + ')', 'KY_KE_TOAN', 'Kỳ kế toán quản trị và kiểm soát ngân sách hiện hành'],
    ['CORP_INCOME_TAX_PCT', '20', 'THUE_DINH_MUC', 'Thuế suất Thuế Thu nhập Doanh nghiệp tiêu chuẩn (20%)'],
    ['BVA_WARNING_PCT', '85', 'KIEM_SOAT_BVA', 'Ngưỡng cảnh báo Vàng khi chi phí phòng ban chạm 85% dự toán ngân sách'],
    ['BVA_LIMIT_PCT', '100', 'KIEM_SOAT_BVA', 'Ngưỡng báo động Đỏ khi chi phí vượt 100% dự toán ngân sách được duyệt'],
    ['INDUSTRY_GROSS_MARGIN_BENCHMARK', '38', 'KPI_NGANH', 'Biên lợi nhuận gộp trung bình ngành (%) để đối sánh trên báo cáo KPI'],
    ['INDUSTRY_NET_MARGIN_BENCHMARK', '12', 'KPI_NGANH', 'Biên lợi nhuận ròng trung bình ngành (%) để đối sánh KPI'],
    ['ADMIN_EMAIL', 'cfo@daivietsme.vn', 'BOT_THONG_BAO', 'Email Giám đốc Tài chính / Kế toán trưởng nhận cảnh báo vượt ngân sách BVA'],
    ['ZALO_BOT_WEBHOOK_URL', 'https://webhook.site/zalo-sme-bva-alert', 'BOT_THONG_BAO', 'URL Webhook bắn cảnh báo vượt trần ngân sách phòng ban qua Bot Zalo']
  ];
  shCfg.getRange(3, 1, cfgData.length, 4).setValues(cfgData);
  shCfg.setColumnWidth(1, 250);
  shCfg.setColumnWidth(2, 340);
  shCfg.setColumnWidth(3, 160);
  shCfg.setColumnWidth(4, 420);

  // =========================================================================
  // 2. TAB PHAN_QUYEN (RBAC 5 VAI TRÒ: ADMIN / CFO_CHIEF_ACC / DEPT_HEAD / ACCOUNTANT / AUDITOR)
  // =========================================================================
  var shAuth = ss.getSheetByName('PHAN_QUYEN');
  shAuth.getRange('A1:I1').merge().setValue('🔐 DANH SÁCH TÀI KHOẢN & PHÂN QUYỀN KẾ TOÁN QUẢN TRỊ SME (CEO / CFO-KTT / TRƯỞNG PHÒNG / KẾ TOÁN VIÊN / KIỂM TOÁN)')
    .setBackground('#991B1B').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shAuth.setRowHeight(1, 36);

  var authHeaders = [[
    'USERNAME', 'MẬT KHẨU / PIN', 'HỌ VÀ TÊN', 'VAI TRÒ (ROLE)', 'PHÒNG BAN PHỤ TRÁCH',
    'EMAIL NHẬN BÁO CÁO', 'SĐT ZALO', 'TRẠNG THÁI', 'QUYỀN HẠN APP (PERMISSIONS)'
  ]];
  shAuth.getRange('A2:I2').setValues(authHeaders).setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold');

  var authData = [
    ['ceo_sme', '123456', 'Nguyễn Hoàng Long (Tổng Giám Đốc - CEO)', 'ADMIN', 'Ban Giám Đốc', 'long.ceo@daivietsme.vn', '0901234567', 'Hoạt động', 'FULL_FINANCE,APPROVE_JOURNAL,APPROVE_BUDGET,EDIT_BALANCE_SHEET,MANAGE_RBAC'],
    ['cfo_sme', '123456', 'Trần Tuyết Mai (CFO / Kế Toán Trưởng)', 'CFO_CHIEF_ACC', 'Phòng Tài Chính - Kế Toán', 'mai.cfo@daivietsme.vn', '0902345678', 'Hoạt động', 'FULL_FINANCE,APPROVE_JOURNAL,APPROVE_BUDGET,EDIT_BALANCE_SHEET,MANAGE_RBAC'],
    ['tp_kinhdoanh', '123456', 'Lê Quốc Khánh (GĐ Kinh Doanh & Marketing)', 'DEPT_HEAD', 'Khối Kinh Doanh & Marketing', 'khanh.sales@daivietsme.vn', '0903456789', 'Hoạt động', 'VIEW_DEPT_BVA,REQUEST_BUDGET,CREATE_JOURNAL'],
    ['tp_sanxuat', '123456', 'Phạm Văn Hùng (GĐ Sản Xuất & Cung Ứng)', 'DEPT_HEAD', 'Khối Sản Xuất & Kho Vận', 'hung.mfg@daivietsme.vn', '0904567890', 'Hoạt động', 'VIEW_DEPT_BVA,REQUEST_BUDGET,CREATE_JOURNAL'],
    ['kt_tonghop', '123456', 'Võ Minh Tâm (Kế Toán Tổng Hợp)', 'ACCOUNTANT', 'Phòng Tài Chính - Kế Toán', 'tam.acc@daivietsme.vn', '0905678901', 'Hoạt động', 'CREATE_JOURNAL,EDIT_BALANCE_SHEET,VIEW_ALL_REPORTS'],
    ['kiem_toan', '666666', 'Đoàn Kiểm Toán Độc Lập & HĐQT (Auditor)', 'AUDITOR', 'Ban Kiểm Soát & Kiểm Toán', 'audit@daivietsme.vn', '0906789012', 'Hoạt động', 'VIEW_ALL_REPORTS']
  ];
  shAuth.getRange(3, 1, authData.length, 9).setValues(authData);
  shAuth.getRange(3, 2, authData.length, 1).setNumberFormat('@');
  shAuth.getRange(3, 7, authData.length, 1).setNumberFormat('@');
  for (var ca = 1; ca <= 9; ca++) shAuth.setColumnWidth(ca, 165);

  // =========================================================================
  // 3. TAB SO_NHAT_KY_HACH_TOAN (SỔ NHẬT KÝ CHỨNG TỪ KẾ TOÁN & FILE HÓA ĐƠN VAT)
  // =========================================================================
  var shJrn = ss.getSheetByName('SO_NHAT_KY_HACH_TOAN');
  shJrn.getRange('A1:M1').merge().setValue('📒 SỔ NHẬT KÝ HẠCH TOÁN CHỨNG TỪ KẾ TOÁN, PHÂN BỔ PHÒNG BAN & ĐÍNH KÈM HÓA ĐƠN VAT / HỢP ĐỒNG')
    .setBackground('#1E3A8A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shJrn.setRowHeight(1, 36);

  var jrnHeaders = [[
    'MÃ CHỨNG TỪ', 'NGÀY HẠCH TOÁN', 'KỲ KẾ TOÁN', 'NHÓM KHOẢN MỤC P&L / BVA',
    'KHOẢN MỤC CHI TIẾT', 'DIỄN GIẢI NỘI DUNG NGHIỆP VỤ', 'PHÒNG BAN / TRUNG TÂM CHI PHÍ',
    'LOẠI BÚT TOÁN', 'SỐ TIỀN (VNĐ)', 'HÌNH THỨC THANH TOÁN / HẠCH TOÁN',
    'TRẠNG THÁI DUYỆT', 'NGƯỜI PHÊ DUYỆT', 'CHỨNG TỪ / HÓA ĐƠN ĐÍNH KÈM (WORD/EXCEL/PDF)'
  ]];
  shJrn.getRange('A2:M2').setValues(jrnHeaders).setBackground('#1D4ED8').setFontColor('#FFFFFF').setFontWeight('bold');

  var jrnData = [
    [
      'CT-1001', fmtDateOffset(-12), curMonthStr, '1. Doanh thu bán hàng & dịch vụ',
      'Doanh thu trực tiếp (Bán buôn B2B & Chuỗi đại lý)', 'Xuất hóa đơn VAT lô hàng thiết bị công nghiệp cho Hệ thống Đại lý Miền Nam', 'Khối Kinh Doanh & Marketing',
      'DOANH THU (REVENUE)', 9200000000, 'Thu chuyển khoản + Công nợ 30 ngày',
      'Đã duyệt', 'Trần Tuyết Mai (CFO / Kế Toán Trưởng)',
      JSON.stringify([{ id: 'DOC-J1', name: 'Bang_Ke_Hoa_Don_VAT_Dau_Ra_T5.xlsx', ext: 'xlsx', size: '420 KB', url: 'https://docs.google.com/spreadsheets' }])
    ],
    [
      'CT-1002', fmtDateOffset(-10), curMonthStr, '1. Doanh thu bán hàng & dịch vụ',
      'Doanh thu khác (Dịch vụ lắp đặt & Bảo trì định kỳ)', 'Thu phí dịch vụ lắp đặt, bảo trì kỹ thuật trọn gói năm cho 18 khách hàng doanh nghiệp', 'Khối Kinh Doanh & Marketing',
      'DOANH THU (REVENUE)', 3300000000, 'Thu chuyển khoản Vietcombank',
      'Đã duyệt', 'Trần Tuyết Mai (CFO / Kế Toán Trưởng)',
      JSON.stringify([{ id: 'DOC-J2', name: 'Hop_Dong_Dich_Vu_Bao_Tri_Nam.pdf', ext: 'pdf', size: '1.1 MB', url: 'https://drive.google.com' }])
    ],
    [
      'CT-1003', fmtDateOffset(-9), curMonthStr, '2. Các khoản giảm trừ doanh thu',
      'Chiết khấu thương mại & Hàng bán trả lại', 'Chiết khấu đạt doanh số quý cho 5 nhà phân phối cấp 1', 'Khối Kinh Doanh & Marketing',
      'GIẢM TRỪ DOANH THU', 500000000, 'Bù trừ công nợ phải thu',
      'Đã duyệt', 'Trần Tuyết Mai (CFO / Kế Toán Trưởng)',
      JSON.stringify([])
    ],
    [
      'CT-1004', fmtDateOffset(-8), curMonthStr, '3. Giá vốn hàng bán (COGS)',
      'Giá vốn nguyên vật liệu, hàng hóa xuất kho & sản xuất', 'Kết chuyển giá vốn lô hàng xuất bán và nguyên vật liệu trực tiếp tại xưởng', 'Khối Sản Xuất & Kho Vận',
      'GIÁ VỐN (COGS)', 7200000000, 'Xuất kho bình quân gia quyền',
      'Đã duyệt', 'Trần Tuyết Mai (CFO / Kế Toán Trưởng)',
      JSON.stringify([{ id: 'DOC-J3', name: 'Bao_Cao_Nhap_Xuat_Ton_Gia_Von.xlsx', ext: 'xlsx', size: '580 KB', url: 'https://docs.google.com/spreadsheets' }])
    ],
    [
      'CT-1005', fmtDateOffset(-6), curMonthStr, '4. Chi phí hoạt động (OPEX)',
      'Chi phí nhân viên (Lương, Thưởng KPI, BHXH 85 nhân sự)', 'Hạch toán quỹ lương, phụ cấp và trích nộp BHXH tháng cho toàn công ty', 'Phòng Hành Chính - Nhân Sự',
      'CHI PHÍ HOẠT ĐỘNG (OPEX)', 1450000000, 'Ủy nhiệm chi Techcombank',
      'Đã duyệt', 'Nguyễn Hoàng Long (Tổng Giám Đốc - CEO)',
      JSON.stringify([{ id: 'DOC-J4', name: 'Bang_Thanh_Toan_Luong_85_NhanSu.xlsx', ext: 'xlsx', size: '390 KB', url: 'https://docs.google.com/spreadsheets' }])
    ],
    [
      'CT-1006', fmtDateOffset(-5), curMonthStr, '4. Chi phí hoạt động (OPEX)',
      'Chi phí bán hàng & Hoa hồng đại lý', 'Chi hoa hồng đội ngũ kinh doanh, vận chuyển giao hàng và hội nghị khách hàng', 'Khối Kinh Doanh & Marketing',
      'CHI PHÍ HOẠT ĐỘNG (OPEX)', 620000000, 'Chuyển khoản ngân hàng',
      'Đã duyệt', 'Trần Tuyết Mai (CFO / Kế Toán Trưởng)',
      JSON.stringify([])
    ],
    [
      'CT-1007', fmtDateOffset(-4), curMonthStr, '4. Chi phí hoạt động (OPEX)',
      'Chi phí quảng cáo & Tiếp thị (Marketing)', 'Chi chiến dịch quảng cáo Google/Facebook, hội chợ triển lãm thương mại & POSM', 'Khối Kinh Doanh & Marketing',
      'CHI PHÍ HOẠT ĐỘNG (OPEX)', 480000000, 'Thanh toán hợp đồng dịch vụ',
      'Đã duyệt', 'Trần Tuyết Mai (CFO / Kế Toán Trưởng)',
      JSON.stringify([{ id: 'DOC-J5', name: 'Nghiem_Thu_Chien_Dich_Trien_Lam_B2B.pdf', ext: 'pdf', size: '860 KB', url: 'https://drive.google.com' }])
    ],
    [
      'CT-1008', fmtDateOffset(-3), curMonthStr, '4. Chi phí hoạt động (OPEX)',
      'Chi phí nghiên cứu & phát triển sản phẩm (R&D)', 'Chi phí thử nghiệm mẫu sản phẩm mới và kiểm định chất lượng ISO', 'Khối Sản Xuất & Kho Vận',
      'CHI PHÍ HOẠT ĐỘNG (OPEX)', 210000000, 'Chuyển khoản',
      'Đã duyệt', 'Trần Tuyết Mai (CFO / Kế Toán Trưởng)',
      JSON.stringify([])
    ],
    [
      'CT-1009', fmtDateOffset(-2), curMonthStr, '4. Chi phí hoạt động (OPEX)',
      'Chi phí vận hành & Quản lý doanh nghiệp (G&A)', 'Tiền thuê văn phòng, điện nước nhà xưởng, phần mềm ERP và dịch vụ pháp lý', 'Phòng Tài Chính - Kế Toán',
      'CHI PHÍ HOẠT ĐỘNG (OPEX)', 340000000, 'Chuyển khoản',
      'Đã duyệt', 'Trần Tuyết Mai (CFO / Kế Toán Trưởng)',
      JSON.stringify([])
    ],
    [
      'CT-1010', fmtDateOffset(-1), curMonthStr, '4. Chi phí hoạt động (OPEX)',
      'Đề xuất chi bổ sung Quảng cáo Sự kiện Ra mắt Sản phẩm mới', 'Đề xuất ngân sách bổ sung cho sự kiện ra mắt dòng sản phẩm mới tại TP.HCM (Vượt trần dự toán BVA)', 'Khối Kinh Doanh & Marketing',
      'CHI PHÍ HOẠT ĐỘNG (OPEX)', 125000000, 'Đề xuất chờ duyệt chi',
      'Chờ duyệt', 'Trần Tuyết Mai (CFO / Kế Toán Trưởng)',
      JSON.stringify([{ id: 'DOC-J6', name: 'To_Trinh_Xin_Vuot_Ngan_Sach_Marketing.docx', ext: 'docx', size: '310 KB', url: 'https://docs.google.com/document' }])
    ]
  ];
  shJrn.getRange(3, 1, jrnData.length, 13).setValues(jrnData);
  shJrn.getRange(3, 3, jrnData.length, 1).setNumberFormat('@');
  shJrn.getRange(3, 9, jrnData.length, 1).setNumberFormat('#,##0');
  for (var cj = 1; cj <= 13; cj++) shJrn.setColumnWidth(cj, 165);
  shJrn.setColumnWidth(6, 280);

  // =========================================================================
  // 4. TAB BAO_CAO_PL_THU_NHAP (BÁO CÁO KẾT QUẢ KINH DOANH P&L ĐA TẦNG & KPI BENCHMARK)
  // =========================================================================
  var shPl = ss.getSheetByName('BAO_CAO_PL_THU_NHAP');
  shPl.getRange('A1:J1').merge().setValue('📈 BÁO CÁO KẾT QUẢ HOẠT ĐỘNG KINH DOANH ĐA TẦNG (P&L STATEMENT) & ĐỐI SÁNH TRUNG BÌNH NGÀNH (KPI BENCHMARK)')
    .setBackground('#065F46').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shPl.setRowHeight(1, 36);

  var plHeaders = [[
    'MÃ CHỈ TIÊU', 'KHOẢN MỤC BÁO CÁO THU NHẬP (P&L)', 'PHÂN TẦNG P&L', 'KỲ NÀY (VNĐ)',
    'KỲ TRƯỚC (VNĐ)', 'CHÊNH LỆCH (+/- VNĐ)', '% TĂNG TRƯỞNG (% YoY)',
    'TỶ TRỌNG / DT THUẦN (%)', 'TRUNG BÌNH NGÀNH (%)', 'ĐÁNH GIÁ HIỆU QUẢ'
  ]];
  shPl.getRange('A2:J2').setValues(plHeaders).setBackground('#047857').setFontColor('#FFFFFF').setFontWeight('bold');

  var plData = [
    ['PL-01', '1. Tổng Doanh thu bán hàng và cung cấp dịch vụ', 'DOANH_THU', 12500000000, 10400000000, 2100000000, 20.2, 104.2, 103.0, '🟢 Tăng trưởng mạnh (+20.2% YoY)'],
    ['PL-02', '2. Các khoản giảm trừ doanh thu (Chiết khấu, Giảm giá)', 'DOANH_THU', 500000000, 400000000, 100000000, 25.0, 4.2, 3.0, '🟢 Trong ngưỡng kiểm soát (4.2%)'],
    ['PL-03', '3. DOANH THU THUẦN (Net Revenue = [1] - [2])', 'TONG_HOP', 12000000000, 10000000000, 2000000000, 20.0, 100.0, 100.0, '🟢 Vượt kế hoạch quý'],
    ['PL-04', '4. Giá vốn hàng bán (COGS - Nguyên liệu, Hàng hóa, Xưởng)', 'GIA_VON', 7200000000, 6200000000, 1000000000, 16.1, 60.0, 62.0, '🟢 Tối ưu giá vốn tốt hơn ngành 2%'],
    ['PL-05', '5. LỢI NHUẬN GỘP (Gross Profit = [3] - [4])', 'TONG_HOP', 4800000000, 3800000000, 1000000000, 26.3, 40.0, 38.0, '🟢 Biên lãi gộp 40% (Cao hơn TB ngành 38%)'],
    ['PL-06', '6. Chi phí Nhân sự & Tiền lương (Payroll & Benefits)', 'CHI_PHI_HD', 1450000000, 1320000000, 130000000, 9.8, 12.1, 13.5, '🟢 Hiệu suất nhân sự tốt (12.1% DT)'],
    ['PL-07', '7. Chi phí Bán hàng & Hoa hồng đại lý (Selling Expenses)', 'CHI_PHI_HD', 620000000, 540000000, 80000000, 14.8, 5.2, 6.0, '🟢 Hợp lý theo đà tăng doanh thu'],
    ['PL-08', '8. Chi phí Quảng cáo & Tiếp thị (Marketing Expenses)', 'CHI_PHI_HD', 480000000, 390000000, 90000000, 23.1, 4.0, 4.5, '🟡 Cần theo dõi sát BVA phòng Marketing'],
    ['PL-09', '9. Chi phí Nghiên cứu & Phát triển (R&D Expenses)', 'CHI_PHI_HD', 210000000, 180000000, 30000000, 16.7, 1.8, 2.0, '🟢 Đúng định mức R&D'],
    ['PL-10', '10. Chi phí Vận hành & Quản lý doanh nghiệp (G&A)', 'CHI_PHI_HD', 340000000, 320000000, 20000000, 6.3, 2.8, 3.5, '🟢 Kiểm soát định phí G&A rất tốt'],
    ['PL-11', '11. LỢI NHUẬN TRƯỚC THUẾ, LÃI VAY & KHẤU HAO (EBITDA)', 'TONG_HOP', 1700000000, 1050000000, 650000000, 61.9, 14.2, 12.5, '🟢 Biên EBITDA đạt 14.2% (Xuất sắc)'],
    ['PL-12', '12. Chi phí Khấu hao Tài sản cố định (Depreciation)', 'KHAU_HAO_LAI', 220000000, 200000000, 20000000, 10.0, 1.8, 2.0, '🟢 Trích khấu hao đúng chuẩn TSCĐ'],
    ['PL-13', '13. LỢI NHUẬN HOẠT ĐỘNG TRƯỚC LÃI VAY & THUẾ (EBIT)', 'TONG_HOP', 1480000000, 850000000, 630000000, 74.1, 12.3, 10.5, '🟢 Biên EBIT vượt chuẩn ngành (+1.8%)'],
    ['PL-14', '14. Doanh thu tài chính (Lãi tiền gửi) - Chi phí lãi vay ngân hàng', 'KHAU_HAO_LAI', -80000000, -90000000, 10000000, -11.1, -0.7, -1.0, '🟢 Chi phí lãi vay giảm nhờ trả bớt gốc'],
    ['PL-15', '15. Thu nhập khác / Chi phí khác (Thanh lý TSCĐ...)', 'KHAU_HAO_LAI', 50000000, 20000000, 30000000, 150.0, 0.4, 0.2, '🟢 Thu thanh lý thiết bị cũ'],
    ['PL-16', '16. LỢI NHUẬN TRƯỚC THUẾ (EBT)', 'TONG_HOP', 1450000000, 780000000, 670000000, 85.9, 12.1, 9.7, '🟢 Tăng trưởng lợi nhuận trước thuế +85.9%'],
    ['PL-17', '17. Chi phí Thuế TNDN hiện hành (20%)', 'THUE_TNDN', 290000000, 156000000, 134000000, 85.9, 2.4, 1.9, '🟢 Tạm tính 20% chuẩn quy định'],
    ['PL-18', '18. LỢI NHUẬN RÒNG SAU THUẾ (Net Profit / Bottom Line)', 'LOI_NHUAN_RONG', 1160000000, 624000000, 536000000, 85.9, 9.7, 7.8, '🏆 Biên lãi ròng 9.7% (Vượt TB ngành 7.8%)']
  ];
  shPl.getRange(3, 1, plData.length, 10).setValues(plData);
  shPl.getRange(3, 4, plData.length, 3).setNumberFormat('#,##0');
  for (var cpl = 1; cpl <= 10; cpl++) shPl.setColumnWidth(cpl, 165);
  shPl.setColumnWidth(2, 310);

  // =========================================================================
  // 5. TAB NGAN_SACH_BVA_PHONG_BAN (BUDGET VS. ACTUAL - KIỂM SOÁT TRẦN NGÂN SÁCH)
  // =========================================================================
  var shBva = ss.getSheetByName('NGAN_SACH_BVA_PHONG_BAN');
  shBva.getRange('A1:L1').merge().setValue('🎯 BẢNG KIỂM SOÁT NGÂN SÁCH DỰ TOÁN VS. THỰC TẾ THEO PHÒNG BAN (BUDGET VS. ACTUAL - BVA) & CẢNH BÁO VƯỢT TRẦN')
    .setBackground('#7C2D12').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shBva.setRowHeight(1, 36);

  var bvaHeaders = [[
    'MÃ BVA', 'KỲ NGÂN SÁCH', 'PHÒNG BAN / TRUNG TÂM CHI PHÍ', 'HẠNG MỤC NGÂN SÁCH (BVA)',
    'LOẠI CHỈ TIÊU', 'DỰ TOÁN ĐƯỢC DUYỆT - BUDGET (VNĐ)', 'THỰC TẾ PHÁT SINH - ACTUAL (VNĐ)',
    'CHÊNH LỆCH - VARIANCE (VNĐ)', '% SỬ DỤNG NGÂN SÁCH', 'TRẠNG THÁI KIỂM SOÁT TRẦN',
    'TRƯỞNG BỘ PHẬN CHỊU TRÁCH NHIỆM', 'GHI CHÚ GIẢI TRÌNH & FILE ĐÍNH KÈM'
  ]];
  shBva.getRange('A2:L2').setValues(bvaHeaders).setBackground('#9A3412').setFontColor('#FFFFFF').setFontWeight('bold');

  var bvaData = [
    ['BVA-01', curMonthStr, 'Khối Kinh Doanh & Marketing', 'Chỉ tiêu Doanh thu thuần toàn công ty', 'DOANH THU', 11500000000, 12000000000, 500000000, 104.3, '🟢 Vượt chỉ tiêu Doanh thu (+4.3%)', 'Lê Quốc Khánh (GĐ Kinh Doanh)', JSON.stringify({ notes: 'Vượt kế hoạch nhờ ký mới 3 đại lý lớn', attachments: [] })],
    ['BVA-02', curMonthStr, 'Khối Sản Xuất & Kho Vận', 'Ngân sách Giá vốn nguyên vật liệu & sản xuất (COGS)', 'CHI PHÍ', 7350000000, 7200000000, -150000000, 98.0, '🟢 Tiết kiệm chi phí (-150tr so với dự toán)', 'Phạm Văn Hùng (GĐ Sản Xuất)', JSON.stringify({ notes: 'Đàm phán giảm giá nguyên liệu đầu vào 2%', attachments: [] })],
    ['BVA-03', curMonthStr, 'Phòng Hành Chính - Nhân Sự', 'Ngân sách Quỹ lương, Thưởng KPI & BHXH (85 nhân sự)', 'CHI PHÍ', 1500000000, 1450000000, -50000000, 96.7, '🟢 Trong trần ngân sách (96.7%)', 'Trần Tuyết Mai (CFO / KTT)', JSON.stringify({ notes: 'Đúng định biên nhân sự được duyệt', attachments: [] })],
    ['BVA-04', curMonthStr, 'Khối Kinh Doanh & Marketing', 'Ngân sách Chi phí Bán hàng & Hoa hồng đại lý', 'CHI PHÍ', 600000000, 620000000, 20000000, 103.3, '🔴 Vượt trần ngân sách (+3.3% / +20tr)', 'Lê Quốc Khánh (GĐ Kinh Doanh)', JSON.stringify({ notes: 'Tăng hoa hồng thưởng vượt doanh số bán hàng quý', attachments: [{ id: 'BVA-F1', name: 'Bang_Tinh_Hoa_Hong_Vuot_Chi_Tieu.xlsx', ext: 'xlsx', size: '240 KB', url: 'https://docs.google.com/spreadsheets' }] })],
    ['BVA-05', curMonthStr, 'Khối Kinh Doanh & Marketing', 'Ngân sách Quảng cáo & Tiếp thị (Marketing Ads & Event)', 'CHI PHÍ', 450000000, 480000000, 30000000, 106.7, '🔴 Vượt trần ngân sách (+6.7% / +30tr)', 'Lê Quốc Khánh (GĐ Kinh Doanh)', JSON.stringify({ notes: 'Phát sinh thêm chi phí gian hàng Hội chợ Triển lãm B2B', attachments: [{ id: 'BVA-F2', name: 'Giai_Trinh_Chi_Phi_Hoi_Cho_B2B.pdf', ext: 'pdf', size: '510 KB', url: 'https://drive.google.com' }] })],
    ['BVA-06', curMonthStr, 'Khối Sản Xuất & Kho Vận', 'Ngân sách Nghiên cứu & Phát triển mẫu mới (R&D)', 'CHI PHÍ', 250000000, 210000000, -40000000, 84.0, '🟢 An toàn trong ngân sách (84%)', 'Phạm Văn Hùng (GĐ Sản Xuất)', JSON.stringify({ notes: 'Đã hoàn thành 2 mẫu thử nghiệm đạt chuẩn ISO', attachments: [] })],
    ['BVA-07', curMonthStr, 'Phòng Tài Chính - Kế Toán', 'Ngân sách Vận hành Văn phòng, Pháp lý & Quản lý (G&A)', 'CHI PHÍ', 360000000, 340000000, -20000000, 94.4, '🟡 Sắp chạm trần (94.4%)', 'Trần Tuyết Mai (CFO / KTT)', JSON.stringify({ notes: 'Kiểm soát chặt chi phí điện nước và văn phòng phẩm', attachments: [] })]
  ];
  shBva.getRange(3, 1, bvaData.length, 12).setValues(bvaData);
  shBva.getRange(3, 2, bvaData.length, 1).setNumberFormat('@');
  shBva.getRange(3, 6, bvaData.length, 3).setNumberFormat('#,##0');
  for (var cb = 1; cb <= 12; cb++) shBva.setColumnWidth(cb, 165);
  shBva.setColumnWidth(4, 280);

  // =========================================================================
  // 6. TAB BANG_CAN_DOI_KE_TOAN (BALANCE SHEET & VỐN LƯU ĐỘNG RÒNG NWC)
  // =========================================================================
  var shBs = ss.getSheetByName('BANG_CAN_DOI_KE_TOAN');
  shBs.getRange('A1:H1').merge().setValue('⚖️ BẢNG CÂN ĐỐI KẾ TOÁN (BALANCE SHEET: TÀI SẢN = NỢ PHẢI TRẢ + VỐN CHỦ SỞ HỮU) & VỐN LƯU ĐỘNG RÒNG (NWC)')
    .setBackground('#0F766E').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shBs.setRowHeight(1, 36);

  var bsHeaders = [[
    'MÃ CHỈ TIÊU', 'KHOẢN MỤC BẢNG CÂN ĐỐI KẾ TOÁN', 'NHÓM TÀI SẢN / NGUỒN VỐN',
    'SỐ ĐẦU KỲ (VNĐ)', 'SỐ CUỐI KỲ NÀY (VNĐ)', 'DỰ PHÓNG KỲ TỚI (VNĐ)',
    '% CƠ CẤU', 'THUYẾT MINH CHI TIẾT'
  ]];
  shBs.getRange('A2:H2').setValues(bsHeaders).setBackground('#115E59').setFontColor('#FFFFFF').setFontWeight('bold');

  var bsData = [
    ['BS-101', 'I. Tiền và các khoản tương đương tiền (Tiền mặt + Ngân hàng)', 'A. TÀI SẢN NGẮN HẠN', 2800000000, 3450000000, 4200000000, 18.6, 'Tiền gửi thanh toán Vietcombank, Techcombank & tiền gửi kỳ hạn 1-3 tháng'],
    ['BS-102', 'II. Các khoản phải thu ngắn hạn của khách hàng (Accounts Receivable)', 'A. TÀI SẢN NGẮN HẠN', 3100000000, 3650000000, 3900000000, 19.7, 'Công nợ phải thu các đại lý phân phối B2B (Kỳ hạn nợ 30 ngày)'],
    ['BS-103', 'III. Hàng tồn kho (Nguyên vật liệu, Thành phẩm - Inventory)', 'A. TÀI SẢN NGẮN HẠN', 2600000000, 2900000000, 3100000000, 15.7, 'Tồn kho tại Kho Trung tâm và Kho Nhà máy sản xuất'],
    ['BS-104', 'IV. Chi phí trả trước ngắn hạn & Thuế GTGT được khấu trừ', 'A. TÀI SẢN NGẮN HẠN', 300000000, 350000000, 350000000, 1.9, 'Chi phí bảo hiểm tài sản, thuê kho trả trước'],
    ['BS-201', 'I. Nguyên giá Tài sản cố định hữu hình (Nhà xưởng, Máy móc, Xe tải)', 'B. TÀI SẢN DÀI HẠN', 9500000000, 10200000000, 11500000000, 55.1, 'Dây chuyền máy móc sản xuất và đội xe vận tải giao hàng'],
    ['BS-202', 'II. Trừ: Giá trị hao mòn lũy kế TSCĐ (Accumulated Depreciation)', 'B. TÀI SẢN DÀI HẠN', -1800000000, -2050000000, -2350000000, -11.1, 'Khấu hao lũy kế tính theo đường thẳng'],
    ['BS-301', 'I. Phải trả người bán ngắn hạn (Accounts Payable - NCC)', 'C. NỢ NGẮN HẠN', 2100000000, 2350000000, 2500000000, 12.7, 'Công nợ mua nguyên vật liệu chưa đến hạn thanh toán'],
    ['BS-302', 'II. Thuế và các khoản phải nộp Nhà nước + Phải trả người lao động', 'C. NỢ NGẮN HẠN', 650000000, 790000000, 850000000, 4.3, 'Thuế TNDN, Thuế GTGT và lương thưởng tháng chờ chi'],
    ['BS-303', 'III. Vay và nợ thuê tài chính ngắn hạn (Ngân hàng cấp hạn mức)', 'C. NỢ NGẮN HẠN', 1500000000, 1400000000, 1200000000, 7.6, 'Vay bổ sung vốn lưu động lãi suất ưu đãi'],
    ['BS-401', 'I. Vay và nợ thuê tài chính dài hạn (Đầu tư dây chuyền nhà máy)', 'D. NỢ DÀI HẠN', 2250000000, 2000000000, 1600000000, 10.8, 'Khoản vay trung dài hạn 5 năm đầu tư máy móc'],
    ['BS-501', 'I. Vốn góp của Chủ sở hữu (Vốn điều lệ thực góp)', 'E. VỐN CHỦ SỞ HỮU', 8000000000, 8000000000, 8000000000, 43.2, 'Vốn điều lệ của các cổ đông sáng lập'],
    ['BS-502', 'II. Lợi nhuận sau thuế chưa phân phối (Retained Earnings lũy kế)', 'E. VỐN CHỦ SỞ HỮU', 2000000000, 3960000000, 6550000000, 21.4, 'Lợi nhuận giữ lại đầu kỳ + Lợi nhuận ròng trong kỳ để tái đầu tư']
  ];
  shBs.getRange(3, 1, bsData.length, 8).setValues(bsData);
  shBs.getRange(3, 4, bsData.length, 3).setNumberFormat('#,##0');
  for (var cbs = 1; cbs <= 8; cbs++) shBs.setColumnWidth(cbs, 175);
  shBs.setColumnWidth(2, 310);

  // =========================================================================
  // 7. TAB LUU_CHUYEN_TIEN_TE_KPI (BÁO CÁO LƯU CHUYỂN TIỀN TỆ GIÁN TIẾP & TRỰC TIẾP)
  // =========================================================================
  var shCf = ss.getSheetByName('LUU_CHUYEN_TIEN_TE_KPI');
  shCf.getRange('A1:G1').merge().setValue('💸 BÁO CÁO LƯU CHUYỂN TIỀN TỆ (PHƯƠNG PHÁP GIÁN TIẾP & TRỰC TIẾP) — LIÊN KẾT TỰ ĐỘNG TỪ P&L VÀ BẢNG CÂN ĐỐI')
    .setBackground('#4C1D95').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shCf.setRowHeight(1, 36);

  var cfHeaders = [[
    'MÃ DÒNG TIỀN', 'PHƯƠNG PHÁP LẬP', 'LUỒNG HOẠT ĐỘNG (3 LUỒNG)',
    'CHỈ TIÊU LƯU CHUYỂN TIỀN TỆ', 'KỲ NÀY (VNĐ)', 'DỰ PHÓNG KỲ TỚI (VNĐ)', 'THUYẾT MINH TÁC ĐỘNG DÒNG TIỀN'
  ]];
  shCf.getRange('A2:G2').setValues(cfHeaders).setBackground('#5B21B6').setFontColor('#FFFFFF').setFontWeight('bold');

  var cfData = [
    ['CF-01', 'Gián tiếp (Indirect)', 'I. Hoạt động kinh doanh (Operating)', '1. Lợi nhuận ròng sau thuế (Từ Báo cáo P&L)', 1160000000, 1450000000, 'Điểm xuất phát từ Lợi nhuận ròng trên P&L'],
    ['CF-02', 'Gián tiếp (Indirect)', 'I. Hoạt động kinh doanh (Operating)', '2. Cộng lại: Chi phí khấu hao TSCĐ (Không phải chi bằng tiền)', 220000000, 250000000, 'Khấu hao làm giảm lãi trên giấy nhưng tiền mặt không chảy ra ngoài'],
    ['CF-03', 'Gián tiếp (Indirect)', 'I. Hoạt động kinh doanh (Operating)', '3. (Tăng)/Giảm các khoản phải thu khách hàng (AR Change)', -550000000, -250000000, 'Phải thu tăng 550tr nghĩa là khách đang nợ thêm 550tr'],
    ['CF-04', 'Gián tiếp (Indirect)', 'I. Hoạt động kinh doanh (Operating)', '4. (Tăng)/Giảm hàng tồn kho (Inventory Change)', -300000000, -200000000, 'Nhập thêm hàng tồn kho 300tr làm tạm giam dòng tiền'],
    ['CF-05', 'Gián tiếp (Indirect)', 'I. Hoạt động kinh doanh (Operating)', '5. Tăng/(Giảm) các khoản phải trả nhà cung cấp & thuế (AP Change)', 390000000, 210000000, 'Chiếm dụng vốn hợp lệ từ nhà cung cấp giúp giữ lại tiền mặt'],
    ['CF-06', 'Gián tiếp (Indirect)', 'I. Hoạt động kinh doanh (Operating)', '➔ DÒNG TIỀN THUẦN TỪ HOẠT ĐỘNG KINH DOANH (Operating Cash Flow)', 920000000, 1460000000, '🟢 Dòng tiền kinh doanh dương +920 triệu (Sức khỏe tiền mặt rất tốt)'],
    ['CF-07', 'Gián tiếp (Indirect)', 'II. Hoạt động đầu tư (Investing)', '1. Tiền chi mua sắm, nâng cấp TSCĐ & Máy móc nhà xưởng (CAPEX)', -700000000, -500000000, 'Đầu tư thêm máy móc mở rộng năng lực sản xuất'],
    ['CF-08', 'Gián tiếp (Indirect)', 'II. Hoạt động đầu tư (Investing)', '2. Tiền thu từ thanh lý thiết bị cũ và lãi tiền gửi', 180000000, 140000000, 'Thu thanh lý thiết bị và lãi tiết kiệm ngân hàng'],
    ['CF-09', 'Gián tiếp (Indirect)', 'II. Hoạt động đầu tư (Investing)', '➔ DÒNG TIỀN THUẦN TỪ HOẠT ĐỘNG ĐẦU TƯ (Investing Cash Flow)', -520000000, -360000000, 'Dòng tiền âm do công ty đang đầu tư mở rộng tài sản dài hạn'],
    ['CF-10', 'Gián tiếp (Indirect)', 'III. Hoạt động tài chính (Financing)', '1. Tiền thu từ phát hành thêm vốn góp / Nhận giải ngân vay mới', 600000000, 0, 'Giải ngân vốn lưu động ngắn hạn đầu kỳ'],
    ['CF-11', 'Gián tiếp (Indirect)', 'III. Hoạt động tài chính (Financing)', '2. Tiền trả nợ gốc vay ngân hàng (Ngắn hạn + Dài hạn)', -350000000, -350000000, 'Trả nợ gốc vay đúng hạn làm giảm dư nợ ngân hàng'],
    ['CF-12', 'Gián tiếp (Indirect)', 'III. Hoạt động tài chính (Financing)', '➔ DÒNG TIỀN THUẦN TỪ HOẠT ĐỘNG TÀI CHÍNH (Financing Cash Flow)', 250000000, -350000000, 'Chủ động giảm dần dư nợ vay ngân hàng'],
    ['CF-13', 'Tổng hợp', 'IV. Tổng hợp Lưu chuyển tiền', '★ LƯU CHUYỂN TIỀN THUẦN TRONG KỲ (Net Cash Flow = I + II + III)', 650000000, 750000000, '🟢 Tiền mặt tăng ròng +650tr (Khớp 100% chênh lệch Tiền đầu kỳ 2,8 tỷ ➔ Cuối kỳ 3,45 tỷ)']
  ];
  shCf.getRange(3, 1, cfData.length, 7).setValues(cfData);
  shCf.getRange(3, 5, cfData.length, 2).setNumberFormat('#,##0');
  for (var ccf = 1; ccf <= 7; ccf++) shCf.setColumnWidth(ccf, 175);
  shCf.setColumnWidth(4, 320);

  // =========================================================================
  // 8. TAB NHAT_KY_HE_THONG (AUDIT LOGS & LỊCH SỬ KIỂM SOÁT NGÂN SÁCH BVA)
  // =========================================================================
  var shLog = ss.getSheetByName('NHAT_KY_HE_THONG');
  shLog.getRange('A1:F1').merge().setValue('🛡️ NHẬT KÝ KIỂM TOÁN HỆ THỐNG, DUYỆT CHỨNG TỪ HẠCH TOÁN & CẢNH BÁO NGÂN SÁCH BVA')
    .setBackground('#1E293B').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shLog.setRowHeight(1, 36);

  var logHeaders = [['THỜI GIAN', 'TÀI KHOẢN THỰC HIỆN', 'VAI TRÒ', 'HÀNH ĐỘNG', 'MÃ ĐỐI TƯỢNG', 'NỘI DUNG CHI TIẾT']];
  shLog.getRange('A2:F2').setValues(logHeaders).setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold');
  shLog.getRange(3, 1, 2, 6).setValues([
    [fmtDateOffset(0) + ' 08:00:00', 'ceo_sme', 'ADMIN', 'INIT_SME_DB', 'SYSTEM', 'Khởi tạo Hệ thống Kế toán Quản trị SME, P&L, Balance Sheet & BVA GS-003-SME v4.1 Commercial Pro'],
    [fmtDateOffset(0) + ' 08:15:00', 'cfo_sme', 'CFO_CHIEF_ACC', 'SYNC_3_STATEMENTS', curMonthStr, 'Đồng bộ 3 Báo cáo Tài chính (Doanh thu thuần: 12 Tỷ, EBITDA: 1.7 Tỷ, Lãi ròng: 1.16 Tỷ, NWC: +5.81 Tỷ)']
  ]);
  for (var cl = 1; cl <= 6; cl++) shLog.setColumnWidth(cl, 180);
  shLog.setColumnWidth(6, 420);

  SpreadsheetApp.flush();
  return { ok: true, message: '🎉 Đã khởi tạo thành công 9 Sheet chuẩn cho Hệ thống Kế toán Quản trị SME & BVA GS-003-SME v4.1 Commercial Pro!' };
}
