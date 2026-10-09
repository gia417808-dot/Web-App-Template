/**
 * ============================================================================
 * GS-005: WEBAPP F&B POS QUÁN CAFE / NHÀ HÀNG (V3.0)
 * BỘ CÀI ĐẶT TRANG TÍNH TỰ ĐỘNG (INSTALLER.GS)
 * Archetype: Point of Sale & F&B
 * ============================================================================
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('☕ F&B POS QUÁN CAFE / NHÀ HÀNG')
    .addItem('⚡ Khởi tạo / Làm mới dữ liệu chuẩn', 'install_POS_SHEET')
    .addItem('🌐 Mở Web App Thu Ngân POS', 'openPosWebApp')
    .addToUi();
}

function openPosWebApp() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800)
    .setTitle('F&B POS Quán Cafe / Nhà Hàng v3.0');
  SpreadsheetApp.getUi().showModalDialog(html, 'Web App F&B POS Thu Ngân');
}

function install_POS_SHEET() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabs = ['DASHBOARD', 'SO_DO_BAN', 'THUC_DON', 'HOA_DON'];
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
  dash.setTabColor('#F59E0B');
  dash.getRange('A1:H1').merge().setValue('TỔNG QUAN VẬN HÀNH F&B POS (V3.0)')
    .setFontSize(16).setFontWeight('bold').setBackground('#F59E0B').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.setRowHeight(1, 45);

  const dashHeaders = [
    ['Chỉ Số Bán Hàng Trong Ca', 'Giá Trị', 'Đơn Vị', 'Ghi Chú'],
    ['Doanh Thu Bán Hàng Hoàn Tất', '=SUM(HOA_DON!I3:I)', 'VNĐ', 'Tổng tiền các hóa đơn đã thanh toán'],
    ['Số Lượng Hóa Đơn Đã Xuất', '=COUNTA(HOA_DON!A3:A)', 'Hóa đơn', 'Tổng lượt thanh toán thành công'],
    ['Số Bàn Đang Có Khách (Occupied)', '=COUNTIF(SO_DO_BAN!D3:D, "occupied")', 'Bàn', 'Đang phục vụ đồ uống'],
    ['Số Bàn Trống Sẵn Sàng (Available)', '=COUNTIF(SO_DO_BAN!D3:D, "available")', 'Bàn', 'Có thể đón khách mới'],
    ['Doanh Thu Tạm Tính Trên Bàn', '=SUM(SO_DO_BAN!F3:F)', 'VNĐ', 'Order đang mở chưa thanh toán']
  ];
  dash.getRange('A3:D8').setValues(dashHeaders);
  dash.getRange('A3:D3').setFontWeight('bold').setBackground('#FEF3C7').setHorizontalAlignment('center');
  dash.getRange('A4:A8').setFontWeight('bold');
  dash.getRange('B4:B8').setHorizontalAlignment('right');
  dash.getRange('B4').setNumberFormat('#,##0 "₫"');
  dash.getRange('B8').setNumberFormat('#,##0 "₫"');
  dash.setColumnWidth(1, 280);
  dash.setColumnWidth(2, 180);
  dash.setColumnWidth(3, 100);
  dash.setColumnWidth(4, 260);

  // --------------------------------------------------------------------------
  // TAB 2: SO_DO_BAN
  // --------------------------------------------------------------------------
  const sdb = sheets['SO_DO_BAN'];
  sdb.clear();
  sdb.setTabColor('#3B82F6');
  sdb.getRange('A1:G1').merge().setValue('SƠ ĐỒ BÀN & TRẠNG THÁI KHÁCH HÀNG')
    .setFontSize(14).setFontWeight('bold').setBackground('#3B82F6').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sdb.setRowHeight(1, 40);

  const sdbHeaders = [
    'Số Bàn', 'Tên Bàn', 'Khu Vực Phục Vụ', 'Trạng Thái',
    'Số Khách', 'Tạm Tính Hiện Tại', 'Ghi Chú Yêu Cầu'
  ];
  sdb.getRange(2, 1, 1, sdbHeaders.length).setValues([sdbHeaders])
    .setFontWeight('bold').setBackground('#DBEAFE').setHorizontalAlignment('center')
    .setFontColor('#1E40AF');
  sdb.setFrozenRows(2);

  const sdbSampleData = [
    [1, 'Bàn 01', 'Tầng 1 - Máy lạnh', 'occupied', 3, 145000, 'Khách bàn góc cạnh cửa sổ'],
    [2, 'Bàn 02', 'Tầng 1 - Máy lạnh', 'available', 0, 0, 'Bàn đã dọn dẹp sạch sẽ'],
    [3, 'Bàn 03', 'Tầng 1 - Máy lạnh', 'occupied', 2, 95000, 'Khách đang đợi thêm bánh ngọt'],
    [4, 'Bàn 04', 'Tầng 2 - Ngoài trời', 'available', 0, 0, 'View ban công thoáng'],
    [5, 'Bàn 05', 'Tầng 2 - Ngoài trời', 'occupied', 4, 210000, 'Khách gia đình'],
    [6, 'Bàn VIP 01', 'Khu VIP Phòng Họp', 'reserved', 0, 0, 'Đã đặt trước 19:30 tối nay']
  ];
  sdb.getRange(3, 1, sdbSampleData.length, sdbHeaders.length).setValues(sdbSampleData);
  sdb.getRange('F3:F' + (sdbSampleData.length + 2)).setNumberFormat('#,##0 "₫"');

  sdb.setColumnWidth(1, 90);
  sdb.setColumnWidth(2, 120);
  sdb.setColumnWidth(3, 180);
  sdb.setColumnWidth(4, 120);
  sdb.setColumnWidth(5, 100);
  sdb.setColumnWidth(6, 160);
  sdb.setColumnWidth(7, 260);

  // --------------------------------------------------------------------------
  // TAB 3: THUC_DON
  // --------------------------------------------------------------------------
  const td = sheets['THUC_DON'];
  td.clear();
  td.setTabColor('#10B981');
  td.getRange('A1:G1').merge().setValue('THỰC ĐƠN ĐỒ UỐNG & MÓN ĂN (MENU)')
    .setFontSize(14).setFontWeight('bold').setBackground('#10B981').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  td.setRowHeight(1, 40);

  const tdHeaders = [
    'Mã Món', 'Tên Món', 'Danh Mục', 'Đơn Giá',
    'Đơn Vị', 'Trạng Thái', 'Ghi Chú Công Thức'
  ];
  td.getRange(2, 1, 1, tdHeaders.length).setValues([tdHeaders])
    .setFontWeight('bold').setBackground('#D1FAE5').setHorizontalAlignment('center')
    .setFontColor('#065F46');
  td.setFrozenRows(2);

  const tdSampleData = [
    ['MN-CF-01', 'Cà Phê Muối Huê Đặc Biệt', 'Cà phê', 35000, 'Ly', 'Có sẵn', 'Kem béo mặn cốt dừa nhẹ'],
    ['MN-CF-02', 'Cà Phê Phin Sữa Đá Cổ Điển', 'Cà phê', 29000, 'Ly', 'Có sẵn', 'Robusta rang mộc đậm đà'],
    ['MN-CF-03', 'Cold Brew Cam Vàng Tươi', 'Cà phê', 45000, 'Ly', 'Có sẵn', 'Ủ lạnh 16 tiếng mát lạnh'],
    ['MN-TR-01', 'Trà Đào Cam Sả Thảo Mộc', 'Trà & Trà sữa', 42000, 'Ly', 'Có sẵn', 'Đào miếng giòn tươi'],
    ['MN-TR-02', 'Trà Ô Long Sữa Nướng Trân Châu', 'Trà & Trà sữa', 45000, 'Ly', 'Có sẵn', 'Độ ngọt 50% thơm ngậy'],
    ['MN-BN-01', 'Bánh Tiramisu Ý Cacao', 'Bánh & Tráng miệng', 45000, 'Phần', 'Có sẵn', 'Bánh mềm xốp thơm rượu rum'],
    ['MN-AN-01', 'Khoai Tây Chiên Phô Mai Lắc', 'Ăn nhẹ', 35000, 'Đĩa', 'Có sẵn', 'Chiên vàng giòn rụm']
  ];
  td.getRange(3, 1, tdSampleData.length, tdHeaders.length).setValues(tdSampleData);
  td.getRange('D3:D' + (tdSampleData.length + 2)).setNumberFormat('#,##0 "₫"');

  td.setColumnWidth(1, 110);
  td.setColumnWidth(2, 280);
  td.setColumnWidth(3, 160);
  td.setColumnWidth(4, 130);
  td.setColumnWidth(5, 90);
  td.setColumnWidth(6, 120);
  td.setColumnWidth(7, 260);

  // --------------------------------------------------------------------------
  // TAB 4: HOA_DON
  // --------------------------------------------------------------------------
  const hd = sheets['HOA_DON'];
  hd.clear();
  hd.setTabColor('#EF4444');
  hd.getRange('A1:K1').merge().setValue('NHẬT KÝ HÓA ĐƠN BÁN HÀNG & THANH TOÁN')
    .setFontSize(14).setFontWeight('bold').setBackground('#EF4444').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  hd.setRowHeight(1, 40);

  const hdHeaders = [
    'Mã Hóa Đơn', 'Bàn Phục Vụ', 'Thời Gian', 'Thu Ngân', 'Chi Tiết Món',
    'Tạm Tính', 'Thuế VAT', 'Giảm Giá', 'Tổng Tiền', 'Phương Thức TT', 'Trạng Thái'
  ];
  hd.getRange(2, 1, 1, hdHeaders.length).setValues([hdHeaders])
    .setFontWeight('bold').setBackground('#FEE2E2').setHorizontalAlignment('center')
    .setFontColor('#991B1B');
  hd.setFrozenRows(2);

  const hdSampleData = [
    ['HD-20260803-01', 'Bàn 01', '2026-08-03 10:30', 'Lê Thu Trang', '2 Cà Phê Muối (70k), 1 Bánh Tiramisu (45k)', 115000, 9200, 0, 124200, 'Chuyển khoản VietQR', 'Đã thanh toán'],
    ['HD-20260803-02', 'Bàn 04', '2026-08-03 11:15', 'Lê Thu Trang', '1 Cold Brew Cam (45k), 1 Trà Đào (42k)', 87000, 6960, 0, 93960, 'Tiền mặt', 'Đã thanh toán'],
    ['HD-20260803-03', 'Bàn 02', '2026-08-03 12:40', 'Trần Văn Hưng', '3 Cà Phê Sữa Đá (87k), 1 Khoai Tây (35k)', 122000, 9760, 0, 131760, 'Chuyển khoản VietQR', 'Đã thanh toán']
  ];
  hd.getRange(3, 1, hdSampleData.length, hdHeaders.length).setValues(hdSampleData);
  hd.getRange('F3:I' + (hdSampleData.length + 2)).setNumberFormat('#,##0 "₫"');

  hd.setColumnWidth(1, 150);
  hd.setColumnWidth(2, 100);
  hd.setColumnWidth(3, 150);
  hd.setColumnWidth(4, 140);
  hd.setColumnWidth(5, 300);
  hd.setColumnWidth(6, 120);
  hd.setColumnWidth(7, 100);
  hd.setColumnWidth(8, 100);
  hd.setColumnWidth(9, 130);
  hd.setColumnWidth(10, 160);
  hd.setColumnWidth(11, 120);

  SpreadsheetApp.getActiveSpreadsheet().toast('Khởi tạo trang tính F&B POS thành công!', 'Hoàn tất', 5);
}

