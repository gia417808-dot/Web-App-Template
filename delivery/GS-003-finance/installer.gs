/**
 * ============================================================================
 * GS-003: WEBAPP QUẢN LÝ THU CHI, SỔ QUỸ & DÒNG TIỀN (V4.1 COMMERCIAL PRO)
 * BỘ CÀI ĐẶT 6 TAB DOANH NGHIỆP TỰ ĐỘNG (INSTALLER.GS)
 * Archetype: Finance & Cashflow (Golden Master v3.0)
 * Lưu ý: KHÔNG khai báo onOpen() tại file này để tránh xung đột với Code.gs
 * ============================================================================
 */

function install_FINANCE_SHEET() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    ss.setSpreadsheetLocale('en_US');
    ss.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh');
    SpreadsheetApp.flush();
  } catch (e) {}

  const tabs = [
    'DASHBOARD',
    'TAI_KHOAN',
    'SO_QUY',
    'PHAN_QUYEN',
    'CAU_HINH',
    'NHAT_KY'
  ];
  const sheets = {};

  tabs.forEach(function(tabName) {
    let sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    }
    sheets[tabName] = sheet;
  });

  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính 1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }

  // TAB 1: DASHBOARD
  const dash = sheets['DASHBOARD'];
  dash.clear();
  dash.setTabColor('#059669');
  dash.getRange('A1:H1').merge()
    .setValue('HỆ THỐNG QUẢN TRỊ THU CHI, SỔ QUỸ ĐA TÀI KHOẢN & DÒNG TIỀN (V4.1 COMMERCIAL PRO)')
    .setFontSize(15).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.setRowHeight(1, 46);

  const dashKpiRows = [
    ['CHỈ SỐ TÀI CHÍNH & DÒNG TIỀN (REAL-TIME)', 'GIÁ TRỊ HIỆN TẠI', 'ĐƠN VỊ', 'GHI CHÚ NGHIỆP VỤ'],
    ['Tổng Ngân Quỹ Khả Dụng Toàn Hệ Thống', '=SUM(TAI_KHOAN!I3:I)', 'VNĐ', 'Tổng số dư thực tế các TK Ngân hàng + Quỹ tiền mặt'],
    ['Tổng Dòng Tiền Thu Vào Lũy Kế (Cash In)', '=SUMIF(SO_QUY!C3:C, "Phiếu Thu", SO_QUY!E3:E)', 'VNĐ', 'Tổng các khoản thu đã ghi sổ'],
    ['Tổng Dòng Tiền Chi Ra Lũy Kế (Cash Out)', '=SUMIF(SO_QUY!C3:C, "Phiếu Chi", SO_QUY!E3:E)', 'VNĐ', 'Tổng các khoản chi phí vận hành & đầu tư'],
    ['Dòng Tiền Thuần Trong Kỳ (Net Cashflow)', '=B5-B6', 'VNĐ', 'Chênh lệch Tổng Thu trừ Tổng Chi'],
    ['Tổng Công Nợ Phải Thu Khách Hàng', '=SUMIF(SO_QUY!J3:J, "Công nợ Phải thu", SO_QUY!E3:E)', 'VNĐ', 'Các chứng từ thu đang chờ khách tất toán'],
    ['Tổng Công Nợ Phải Trả Nhà Cung Cấp', '=SUMIF(SO_QUY!J3:J, "Công nợ Phải trả", SO_QUY!E3:E)', 'VNĐ', 'Các khoản chi phí chờ thanh toán cho đối tác'],
    ['Dự Phóng Runway Duy Trì Hoạt Động', '=IF(B6>0, ROUND(B4/B6, 1), 36)', 'Tháng', 'Số tháng duy trì theo tốc độ chi hiện tại (Burn Rate)']
  ];
  dash.getRange(3, 1, dashKpiRows.length, 4).setValues(dashKpiRows);
  dash.getRange('A3:D3').setFontWeight('bold').setBackground('#059669').setFontColor('#FFFFFF').setHorizontalAlignment('center');
  dash.getRange('A4:A10').setFontWeight('bold');
  dash.getRange('B4:B10').setHorizontalAlignment('right').setFontWeight('bold');
  dash.getRange('C4:C10').setHorizontalAlignment('center');
  dash.getRange('B4:B9').setNumberFormat('#,##0 "₫"');
  dash.getRange('B10').setNumberFormat('0.0 "tháng"');

  const fundSummaryRows = [
    ['PHÂN TÍCH SỐ DƯ THEO TÀI KHOẢN / QUỸ', 'SỐ DƯ ĐẦU KỲ', 'SỐ DƯ HIỆN TẠI', 'PHỤ TRÁCH QUỸ'],
    ['Vietcombank Doanh Nghiệp (ACC-01)', '=TAI_KHOAN!F3', '=TAI_KHOAN!I3', 'Nguyễn Minh Tuấn (admin)'],
    ['Techcombank Vận Hành (ACC-02)', '=TAI_KHOAN!F4', '=TAI_KHOAN!I4', 'Hoàng Thu Trang (ketoan)'],
    ['Quỹ Tiền Mặt Văn Phòng (ACC-03)', '=TAI_KHOAN!F5', '=TAI_KHOAN!I5', 'Phạm Thị Mai (thuquy_tm)'],
    ['Quỹ Dự Phòng Đầu Tư (ACC-04)', '=TAI_KHOAN!F6', '=TAI_KHOAN!I6', 'Nguyễn Minh Tuấn (admin)']
  ];
  dash.getRange(12, 1, fundSummaryRows.length, 4).setValues(fundSummaryRows);
  dash.getRange('A12:D12').setFontWeight('bold').setBackground('#0284C7').setFontColor('#FFFFFF').setHorizontalAlignment('center');
  dash.getRange('A13:A16').setFontWeight('bold');
  dash.getRange('B13:C16').setHorizontalAlignment('right').setNumberFormat('#,##0 "₫"');
  dash.setColumnWidth(1, 320);
  dash.setColumnWidth(2, 195);
  dash.setColumnWidth(3, 195);
  dash.setColumnWidth(4, 290);

  // TAB 2: TAI_KHOAN
  const tk = sheets['TAI_KHOAN'];
  tk.clear();
  tk.setTabColor('#0284C7');
  tk.getRange('A1:J1').merge()
    .setValue('DANH MỤC TÀI KHOẢN NGÂN HÀNG, VÍ ĐIỆN TỬ & QUỸ TIỀN MẶT DOANH NGHIỆP')
    .setFontSize(14).setFontWeight('bold').setBackground('#0284C7').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  tk.setRowHeight(1, 40);

  const tkHeaders = [
    'Mã Quỹ/TK', 'Tên Ngân Hàng / Quỹ', 'Số Tài Khoản / Mã Ví', 'Chủ Tài Khoản',
    'Loại Tài Khoản', 'Số Dư Đầu Kỳ', 'Tổng Thu Lũy Kế', 'Tổng Chi Lũy Kế',
    'Số Dư Hiện Tại', 'Ghi Chú Vận Hành'
  ];
  tk.getRange(2, 1, 1, tkHeaders.length).setValues([tkHeaders])
    .setFontWeight('bold').setBackground('#E0F2FE').setFontColor('#0369A1').setHorizontalAlignment('center');
  tk.setFrozenRows(2);

  const tkSampleData = [
    [
      'ACC-01', 'Vietcombank Doanh Nghiệp', '1018899889', 'CTY TNHH NEXSIMPLE VIET NAM',
      'Ngân hàng', 250000000,
      '=SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B3, SO_QUY!C3:C, "Phiếu Thu") + SUMIFS(SO_QUY!E3:E, SO_QUY!G3:G, B3, SO_QUY!C3:C, "Chuyển quỹ")',
      '=SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B3, SO_QUY!C3:C, "Phiếu Chi") + SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B3, SO_QUY!C3:C, "Chuyển quỹ")',
      '=F3+G3-H3', 'Tài khoản thanh toán B2B & Nhận doanh thu hợp đồng chính'
    ],
    [
      'ACC-02', 'Techcombank Vận Hành', '19034567890', 'CTY TNHH NEXSIMPLE VIET NAM',
      'Ngân hàng', 120000000,
      '=SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B4, SO_QUY!C3:C, "Phiếu Thu") + SUMIFS(SO_QUY!E3:E, SO_QUY!G3:G, B4, SO_QUY!C3:C, "Chuyển quỹ")',
      '=SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B4, SO_QUY!C3:C, "Phiếu Chi") + SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B4, SO_QUY!C3:C, "Chuyển quỹ")',
      '=F4+G4-H4', 'Tài khoản chi lương, marketing, cloud server & vận hành'
    ],
    [
      'ACC-03', 'Quỹ Tiền Mặt Văn Phòng', 'CASH-VP-01', 'Phạm Thị Mai (Thủ Quỹ)',
      'Tiền mặt', 35000000,
      '=SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B5, SO_QUY!C3:C, "Phiếu Thu") + SUMIFS(SO_QUY!E3:E, SO_QUY!G3:G, B5, SO_QUY!C3:C, "Chuyển quỹ")',
      '=SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B5, SO_QUY!C3:C, "Phiếu Chi") + SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B5, SO_QUY!C3:C, "Chuyển quỹ")',
      '=F5+G5-H5', 'Quỹ tiền mặt chi tiêu hành chính, tiếp khách & vận chuyển'
    ],
    [
      'ACC-04', 'Quỹ Dự Phòng Đầu Tư', 'ACB-889900', 'CTY TNHH NEXSIMPLE VIET NAM',
      'Quỹ dự phòng', 180000000,
      '=SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B6, SO_QUY!C3:C, "Phiếu Thu") + SUMIFS(SO_QUY!E3:E, SO_QUY!G3:G, B6, SO_QUY!C3:C, "Chuyển quỹ")',
      '=SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B6, SO_QUY!C3:C, "Phiếu Chi") + SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B6, SO_QUY!C3:C, "Chuyển quỹ")',
      '=F6+G6-H6', 'Quỹ tích lũy dự phòng chiến lược & mua sắm tài sản cố định'
    ]
  ];
  tk.getRange(3, 1, tkSampleData.length, tkHeaders.length).setValues(tkSampleData);
  tk.getRange('C3:C6').setNumberFormat('@');
  tk.getRange('F3:I6').setNumberFormat('#,##0 "₫"');
  tk.getRange('A3:A6').setHorizontalAlignment('center').setFontWeight('bold');
  tk.getRange('E3:E6').setHorizontalAlignment('center');

  const tkWidths = [110, 230, 150, 220, 125, 145, 145, 145, 155, 280];
  tkWidths.forEach(function(w, idx) { tk.setColumnWidth(idx + 1, w); });

  // TAB 3: SO_QUY
  const sq = sheets['SO_QUY'];
  sq.clear();
  sq.setTabColor('#F59E0B');
  sq.getRange('A1:M1').merge()
    .setValue('SỔ CHỨNG TỪ PHIẾU THU (01-TT) - PHIẾU CHI (02-TT) - LUÂN CHUYỂN QUỸ & CÔNG NỢ')
    .setFontSize(14).setFontWeight('bold').setBackground('#D97706').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sq.setRowHeight(1, 40);

  const sqHeaders = [
    'Mã Chứng Từ', 'Ngày Ghi Sổ', 'Loại Phiếu', 'Hạng Mục Thu Chi',
    'Số Tiền (VNĐ)', 'Tài Khoản / Quỹ Giao Dịch', 'Tài Khoản Đích (Chuyển Quỹ)',
    'Đối Tác (Khách Hàng / NCC / Nhân Sự)', 'Dự Án / Bộ Phận',
    'Trạng Thái Thanh Toán', 'Phương Thức', 'Người Lập Phiếu', 'Diễn Giải Chứng Từ'
  ];
  sq.getRange(2, 1, 1, sqHeaders.length).setValues([sqHeaders])
    .setFontWeight('bold').setBackground('#FEF3C7').setFontColor('#92400E').setHorizontalAlignment('center');
  sq.setFrozenRows(2);

  // Format column B as plain text (@) before setting values so dates always stay YYYY-MM-DD HH:mm
  sq.getRange('B3:B100').setNumberFormat('@');

  const sqSampleData = [
    ['PT-2026-1001', '2026-10-01 09:15', 'Phiếu Thu', 'Doanh thu bán hàng & Hợp đồng', 85000000, 'Vietcombank Doanh Nghiệp', '---', 'Tập đoàn Truyền thông NovaMedia', 'Dự án ERP Q4', 'Đã tất toán', 'Chuyển khoản VietQR', 'Hoàng Thu Trang', 'Thu tiền thanh toán đợt 1 Hợp đồng phần mềm số 102/HĐKT'],
    ['PC-2026-1002', '2026-10-03 10:30', 'Phiếu Chi', 'Chi phí Lương & Thưởng nhân sự', 42000000, 'Techcombank Vận Hành', '---', 'Bảng lương Nhân sự Khối Kỹ thuật', 'Khối Engineering', 'Đã tất toán', 'UNC Ngân hàng', 'Hoàng Thu Trang', 'Chi lương và phụ cấp dự án tháng 09/2026'],
    ['PT-2026-1004', '2026-10-05 14:20', 'Phiếu Thu', 'Doanh thu dịch vụ Tư vấn & Triển khai', 36000000, 'Techcombank Vận Hành', '---', 'Công ty CP Logistics Đông Nam Á', 'Dự án Kho Đa Điểm', 'Đã tất toán', 'Chuyển khoản VietQR', 'Nguyễn Minh Tuấn', 'Thu phí gói triển khai hệ thống Quản lý kho v3.0'],
    ['PC-2026-1006', '2026-10-07 11:00', 'Phiếu Chi', 'Chi phí Hạ tầng Cloud & Bản quyền', 8500000, 'Techcombank Vận Hành', '---', 'Amazon Web Services & Google Cloud', 'Hạ tầng Công nghệ', 'Đã tất toán', 'Thẻ Doanh nghiệp', 'Nguyễn Minh Tuấn', 'Thanh toán cước máy chủ Cloud và license định kỳ'],
    ['PCQ-2026-1008', '2026-10-09 15:00', 'Chuyển quỹ', 'Rút tiền gửi nhập quỹ tiền mặt', 15000000, 'Vietcombank Doanh Nghiệp', 'Quỹ Tiền Mặt Văn Phòng', 'Luân chuyển quỹ nội bộ', 'Khối Hành chính', 'Đã tất toán', 'Ủy nhiệm chi / Rút TM', 'Phạm Thị Mai', 'Bổ sung định mức quỹ tiền mặt văn phòng tháng 10'],
    ['PC-2026-1010', '2026-10-11 09:45', 'Phiếu Chi', 'Chi phí Hành chính, Tiếp khách & VPP', 3200000, 'Quỹ Tiền Mặt Văn Phòng', '---', 'Nhà hàng Sen Việt & VPP Thiên Long', 'Khối Kinh doanh', 'Đã tất toán', 'Tiền mặt', 'Phạm Thị Mai', 'Chi tiếp đoàn khách hàng ký hợp đồng và mua văn phòng phẩm'],
    ['PT-2026-1012', '2026-10-14 16:10', 'Phiếu Thu', 'Doanh thu bán hàng & Hợp đồng', 48000000, 'Vietcombank Doanh Nghiệp', '---', 'Chuỗi Bán Lẻ Minh Khang Mart', 'Dự án POS Chuỗi', 'Công nợ Phải thu', 'Chuyển khoản VietQR', 'Hoàng Thu Trang', 'Nghiệm thu bàn giao giai đoạn 2 (Hạn thanh toán 30/10)'],
    ['PC-2026-1015', '2026-10-16 11:20', 'Phiếu Chi', 'Chi phí Quảng cáo & Marketing', 14500000, 'Techcombank Vận Hành', '---', 'Đối tác Meta Ads & Google Ads VN', 'Khối Marketing', 'Công nợ Phải trả', 'Chuyển khoản', 'Hoàng Thu Trang', 'Chi phí chiến dịch quảng cáo Performance tháng 10/2026']
  ];
  sq.getRange(3, 1, sqSampleData.length, sqHeaders.length).setValues(sqSampleData);
  sq.getRange('E3:E10').setNumberFormat('#,##0 "₫"');
  sq.getRange('A3:C10').setHorizontalAlignment('center');
  sq.getRange('J3:K10').setHorizontalAlignment('center');

  const sqWidths = [135, 135, 110, 220, 135, 210, 195, 240, 155, 150, 145, 140, 280];
  sqWidths.forEach(function(w, idx) { sq.setColumnWidth(idx + 1, w); });

  // TAB 4: PHAN_QUYEN
  const pq = sheets['PHAN_QUYEN'];
  pq.clear();
  pq.setTabColor('#7C3AED');
  pq.getRange('A1:G1').merge()
    .setValue('BẢNG PHÂN QUYỀN TÀI KHOẢN & GIỚI HẠN TRUY CẬP SỔ QUỸ / NGÂN HÀNG (RBAC)')
    .setFontSize(14).setFontWeight('bold').setBackground('#6D28D9').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  pq.setRowHeight(1, 40);

  const pqHeaders = [
    'Tài Khoản (Username)', 'Mật Khẩu', 'Họ Và Tên Nhân Sự',
    'Vai Trò (Role)', 'Quỹ Phụ Trách', 'Quyền Thao Tác Chi Tiết', 'Trạng Thái'
  ];
  pq.getRange(2, 1, 1, pqHeaders.length).setValues([pqHeaders])
    .setFontWeight('bold').setBackground('#EDE9FE').setFontColor('#4C1D95').setHorizontalAlignment('center');
  pq.setFrozenRows(2);
  pq.getRange('A3:B50').setNumberFormat('@');

  const pqSampleData = [
    ['admin', '123456', 'Nguyễn Minh Tuấn', 'ADMIN', 'ALL', 'Giám đốc tài chính (Toàn quyền hệ thống, Xem mọi quỹ, Tạo TK, Cấu hình)', 'Hoạt động'],
    ['ketoan', '123456', 'Hoàng Thu Trang', 'ACCOUNTANT', 'ALL', 'Kế toán tổng hợp (Xem tất cả các quỹ, Lập phiếu Thu/Chi, Xuất báo cáo dòng tiền)', 'Hoạt động'],
    ['thuquy_tm', '123456', 'Phạm Thị Mai', 'CASHIER', 'Quỹ Tiền Mặt Văn Phòng', 'Thủ quỹ văn phòng (Chỉ xem & lập phiếu trên Quỹ Tiền Mặt Văn Phòng)', 'Hoạt động'],
    ['thuquy_vcb', '123456', 'Lê Hoàng Nam', 'CASHIER', 'Vietcombank Doanh Nghiệp', 'Kế toán thanh toán NH (Chỉ phụ trách TK Vietcombank Doanh Nghiệp)', 'Hoạt động']
  ];
  pq.getRange(3, 1, pqSampleData.length, pqHeaders.length).setValues(pqSampleData);
  const pqWidths = [150, 110, 180, 125, 210, 420, 110];
  pqWidths.forEach(function(w, idx) { pq.setColumnWidth(idx + 1, w); });

  // TAB 5: CAU_HINH
  const ch = sheets['CAU_HINH'];
  ch.clear();
  ch.setTabColor('#475569');
  ch.getRange('A1:C1').merge()
    .setValue('CẤU HÌNH THÔNG TIN DOANH NGHIỆP, ĐỊNH MỨC NGÂN SÁCH & BIỂU MẪU PHIẾU THU/CHI')
    .setFontSize(14).setFontWeight('bold').setBackground('#334155').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  ch.setRowHeight(1, 40);

  const chRows = [
    ['MÃ CẤU HÌNH (KEY)', 'GIÁ TRỊ CẤU HÌNH (VALUE)', 'MÔ TẢ ÁP DỤNG TRÊN WEB APP'],
    ['COMPANY_NAME', 'CÔNG TY TNHH CÔNG NGHỆ & THIẾT BỊ NEXSIMPLE VIỆT NAM', 'Đơn vị in ở góc trái trên cùng của Phiếu Thu (01-TT) & Phiếu Chi (02-TT)'],
    ['COMPANY_ADDRESS', 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM', 'Địa chỉ trụ sở in trên Phiếu Thu / Phiếu Chi & Báo cáo lưu chuyển tiền tệ'],
    ['COMPANY_PHONE', '0974 755 104', 'Số điện thoại liên hệ trên biểu mẫu chứng từ tài chính'],
    ['COMPANY_TAX', '0318899221', 'Mã số thuế doanh nghiệp'],
    ['MONTHLY_BURN_LIMIT', '80000000', 'Định mức trần chi phí vận hành/tháng để tính Runway & Cảnh báo vượt ngân sách'],
    ['ALLOW_OVERDRAFT', 'FALSE', 'FALSE = Chặn chi quá số dư khả dụng của Quỹ | TRUE = Cho phép chi thấu chi'],
    ['PRINT_TEMPLATE_STANDARD', 'Mẫu số 01-TT / 02-TT (Ban hành theo Thông tư 200/2014/TT-BTC của Bộ Tài Chính)', 'Tiêu chuẩn pháp lý in ở góc phải trên cùng của Phiếu Thu / Phiếu Chi']
  ];
  ch.getRange('B3:B10').setNumberFormat('@');
  ch.getRange(2, 1, chRows.length, 3).setValues(chRows);
  ch.getRange('A2:C2').setFontWeight('bold').setBackground('#E2E8F0').setHorizontalAlignment('center');
  ch.getRange('A3:A9').setFontWeight('bold');
  ch.setColumnWidth(1, 220);
  ch.setColumnWidth(2, 440);
  ch.setColumnWidth(3, 380);

  // TAB 6: NHAT_KY
  const nk = sheets['NHAT_KY'];
  nk.clear();
  nk.setTabColor('#DC2626');
  nk.getRange('A1:F1').merge()
    .setValue('NHẬT KÝ THAO TÁC TÀI CHÍNH & KIỂM SOÁT NỘI BỘ (AUDIT TRAIL)')
    .setFontSize(14).setFontWeight('bold').setBackground('#991B1B').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  nk.setRowHeight(1, 40);

  const nkHeaders = ['Thời Gian', 'Tài Khoản', 'Họ Tên & Vai Trò', 'Loại Thao Tác', 'Mã Tham Chiếu', 'Chi Tiết Thay Đổi'];
  nk.getRange(2, 1, 1, nkHeaders.length).setValues([nkHeaders])
    .setFontWeight('bold').setBackground('#FEE2E2').setFontColor('#7F1D1D').setHorizontalAlignment('center');
  nk.setFrozenRows(2);
  nk.getRange('A3:A100').setNumberFormat('@');

  const nowInit = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
  const nkSample = [
    [nowInit, 'admin', 'Nguyễn Minh Tuấn (ADMIN)', 'KHỞI TẠO HỆ THỐNG', 'SYS-FIN-V41', 'Khởi tạo chuẩn 6 Tab Tài Chính & Sổ Quỹ Commercial Pro v4.1 thành công'],
    ['2026-10-16 11:20:00', 'ketoan', 'Hoàng Thu Trang (ACCOUNTANT)', 'LẬP PHIẾU CHI', 'PC-2026-1015', 'Ghi nhận chi phí Marketing 14,500,000 ₫ trên Techcombank Vận Hành']
  ];
  nk.getRange(3, 1, nkSample.length, nkHeaders.length).setValues(nkSample);
  const nkWidths = [155, 120, 200, 150, 140, 440];
  nkWidths.forEach(function(w, idx) { nk.setColumnWidth(idx + 1, w); });

  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Đã khởi tạo hoàn tất 6 Tab Quản Lý Thu Chi, Sổ Quỹ & Dòng Tiền v4.1 (Commercial Pro)!',
    '✅ Cài Đặt Thành Công',
    6
  );
}
