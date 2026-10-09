/**
 * ============================================================================
 * GS-003: WEBAPP QUẢN LÝ THU CHI & DÒNG TIỀN STARTUP (V4.1)
 * BỘ CÀI ĐẶT TRANG TÍNH TỰ ĐỘNG (INSTALLER.GS)
 * Archetype: Finance & Cashflow
 * ============================================================================
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💰 QUẢN LÝ THU CHI & DÒNG TIỀN')
    .addItem('⚡ Khởi tạo / Làm mới dữ liệu chuẩn', 'install_FINANCE_SHEET')
    .addItem('🌐 Mở Web App Quản Trị Tài Chính', 'openFinanceWebApp')
    .addToUi();
}

function openFinanceWebApp() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800)
    .setTitle('Quản Lý Thu Chi & Dòng Tiền Startup v4.1');
  SpreadsheetApp.getUi().showModalDialog(html, 'Web App Quản Trị Tài Chính Startup');
}

function install_FINANCE_SHEET() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabs = ['DASHBOARD', 'TAI_KHOAN', 'SO_QUY'];
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
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  // --------------------------------------------------------------------------
  // TAB 1: DASHBOARD
  // --------------------------------------------------------------------------
  const dash = sheets['DASHBOARD'];
  dash.clear();
  dash.setTabColor('#10B981');
  dash.getRange('A1:H1').merge().setValue('TỔNG QUAN TÀI CHÍNH & DÒNG TIỀN STARTUP (V4.1)')
    .setFontSize(16).setFontWeight('bold').setBackground('#10B981').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.setRowHeight(1, 45);

  const dashHeaders = [
    ['Chỉ Số Tài Chính Cốt Lõi', 'Giá Trị', 'Đơn Vị', 'Ghi Chú'],
    ['Tổng Ngân Quỹ Khả Dụng', '=SUM(TAI_KHOAN!F3:F)', 'VNĐ', 'Tổng số dư các tài khoản'],
    ['Tổng Doanh Thu / Dòng Tiền Vào', '=SUMIF(SO_QUY!C3:C, "Thu", SO_QUY!E3:E)', 'VNĐ', 'Toàn bộ khoản thu đã ghi sổ'],
    ['Tổng Chi Phí / Dòng Tiền Ra', '=SUMIF(SO_QUY!C3:C, "Chi", SO_QUY!E3:E)', 'VNĐ', 'Toàn bộ khoản chi hoạt động'],
    ['Dòng Tiền Thuần (Net Cashflow)', '=B5-B6', 'VNĐ', 'Thu ròng sau chi phí'],
    ['Monthly Burn Rate (Tốc độ đốt tiền)', '=B6 / 1', 'VNĐ/tháng', 'Chi phí vận hành trung bình'],
    ['Dự Phóng Runway Còn Lại', '=IF(B8>0, ROUND(B4/B8, 1), 99)', 'Tháng', 'Thời gian duy trì an toàn']
  ];
  dash.getRange('A3:D9').setValues(dashHeaders);
  dash.getRange('A3:D3').setFontWeight('bold').setBackground('#D1FAE5').setHorizontalAlignment('center');
  dash.getRange('A4:A9').setFontWeight('bold');
  dash.getRange('B4:B9').setHorizontalAlignment('right');
  dash.getRange('B4:B8').setNumberFormat('#,##0 "₫"');
  dash.getRange('B9').setNumberFormat('0.0 "tháng"');
  dash.setColumnWidth(1, 280);
  dash.setColumnWidth(2, 190);
  dash.setColumnWidth(3, 110);
  dash.setColumnWidth(4, 250);

  // --------------------------------------------------------------------------
  // TAB 2: TAI_KHOAN
  // --------------------------------------------------------------------------
  const tk = sheets['TAI_KHOAN'];
  tk.clear();
  tk.setTabColor('#0284C7');
  tk.getRange('A1:H1').merge().setValue('DANH SÁCH TÀI KHOẢN NGÂN HÀNG & QUỸ TIỀN MẶT')
    .setFontSize(14).setFontWeight('bold').setBackground('#0284C7').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  tk.setRowHeight(1, 40);

  const tkHeaders = [
    'Mã TK', 'Tên Ngân Hàng / Ví', 'Số Tài Khoản', 'Chủ Tài Khoản',
    'Số Dư Đầu Kỳ', 'Số Dư Hiện Tại', 'Loại Tài Khoản', 'Ghi Chú'
  ];
  tk.getRange(2, 1, 1, tkHeaders.length).setValues([tkHeaders])
    .setFontWeight('bold').setBackground('#BAE6FD').setHorizontalAlignment('center')
    .setFontColor('#0369A1');
  tk.setFrozenRows(2);

  const tkSampleData = [
    ['ACC-01', 'Vietcombank Doanh Nghiệp', '1018899889', 'CTY TNHH TEMPLATE VIET', 150000000, 325000000, 'Ngân hàng', 'Tài khoản thanh toán chính'],
    ['ACC-02', 'Techcombank Thu Chi', '19034567890', 'LE HOANG NAM - CEO', 50000000, 115000000, 'Ngân hàng', 'Tài khoản đối ứng lương & vận hành'],
    ['ACC-03', 'Quỹ Tiền Mặt Văn Phòng', 'CASH-BOX-01', 'Thủ quỹ Chi nhánh', 15000000, 8500000, 'Tiền mặt', 'Tiền mặt chi tiêu lặt vặt (Petty cash)']
  ];
  tk.getRange(3, 1, tkSampleData.length, tkHeaders.length).setValues(tkSampleData);
  tk.getRange('E3:F' + (tkSampleData.length + 2)).setNumberFormat('#,##0 "₫"');

  tk.setColumnWidth(1, 110);
  tk.setColumnWidth(2, 240);
  tk.setColumnWidth(3, 160);
  tk.setColumnWidth(4, 220);
  tk.setColumnWidth(5, 140);
  tk.setColumnWidth(6, 150);
  tk.setColumnWidth(7, 130);
  tk.setColumnWidth(8, 250);

  // --------------------------------------------------------------------------
  // TAB 3: SO_QUY
  // --------------------------------------------------------------------------
  const sq = sheets['SO_QUY'];
  sq.clear();
  sq.setTabColor('#F59E0B');
  sq.getRange('A1:K1').merge().setValue('SỔ NHẬT KÝ THU CHI & DÒNG TIỀN CHI TIẾT')
    .setFontSize(14).setFontWeight('bold').setBackground('#F59E0B').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sq.setRowHeight(1, 40);

  const sqHeaders = [
    'Mã Giao Dịch', 'Ngày Ghi Nhận', 'Loại (Thu/Chi)', 'Hạng Mục Dòng Tiền',
    'Số Tiền', 'Tài Khoản Giao Dịch', 'Dự Án / Bộ Phận', 'Người Thực Hiện',
    'Số Chứng Từ', 'Phương Thức', 'Ghi Chú Chi Tiết'
  ];
  sq.getRange(2, 1, 1, sqHeaders.length).setValues([sqHeaders])
    .setFontWeight('bold').setBackground('#FEF3C7').setHorizontalAlignment('center')
    .setFontColor('#92400E');
  sq.setFrozenRows(2);

  const sqSampleData = [
    ['TX-2026-001', '2026-08-01', 'Thu', 'Doanh thu Bán hàng', 45000000, 'Vietcombank Doanh Nghiệp', 'Dự án ERP Doanh Nghiệp', 'Lê Hoàng Nam', 'UNC-VCB-8912', 'Chuyển khoản VietQR', 'Thanh toán đợt 1 hợp đồng triển khai'],
    ['TX-2026-002', '2026-08-02', 'Chi', 'Chi phí Máy chủ & Cloud', 4200000, 'Techcombank Thu Chi', 'Hạ tầng Core', 'Phạm Minh Đức', 'INV-AWS-7890', 'Thẻ VISA Doanh nghiệp', 'Gia hạn server AWS và tên miền'],
    ['TX-2026-003', '2026-08-03', 'Chi', 'Lương nhân sự tháng 7', 35000000, 'Vietcombank Doanh Nghiệp', 'Khối Kỹ Thuật & Vận Hành', 'Trần Đình Trọng', 'BL-L7-001', 'Chuyển khoản theo lô', 'Chi lương đợt 1 cho đội ngũ dev'],
    ['TX-2026-004', '2026-08-04', 'Thu', 'Thu tiền dịch vụ tư vấn', 12500000, 'Techcombank Thu Chi', 'Khách hàng MediaPro', 'Lê Hoàng Nam', 'UNC-TCB-4412', 'Chuyển khoản VietQR', 'Gói setup hệ thống kho vận'],
    ['TX-2026-005', '2026-08-05', 'Chi', 'Tiếp khách & Hội thảo', 1850000, 'Quỹ Tiền Mặt Văn Phòng', 'Khối Kinh Doanh', 'Thủ quỹ Chi nhánh', 'PC-0805-01', 'Tiền mặt', 'Ăn trưa trao đổi hợp đồng cùng đối tác']
  ];
  sq.getRange(3, 1, sqSampleData.length, sqHeaders.length).setValues(sqSampleData);
  sq.getRange('E3:E' + (sqSampleData.length + 2)).setNumberFormat('#,##0 "₫"');

  sq.setColumnWidth(1, 140);
  sq.setColumnWidth(2, 120);
  sq.setColumnWidth(3, 110);
  sq.setColumnWidth(4, 200);
  sq.setColumnWidth(5, 140);
  sq.setColumnWidth(6, 210);
  sq.setColumnWidth(7, 190);
  sq.setColumnWidth(8, 150);
  sq.setColumnWidth(9, 130);
  sq.setColumnWidth(10, 160);
  sq.setColumnWidth(11, 280);

  SpreadsheetApp.getActiveSpreadsheet().toast('Khởi tạo trang tính Thu Chi & Dòng Tiền thành công!', 'Hoàn tất', 5);
}

