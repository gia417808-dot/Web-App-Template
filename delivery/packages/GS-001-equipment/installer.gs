/**
 * ============================================================================
 * GS-001: WEBAPP QUẢN LÝ VÀ CHO THUÊ THIẾT BỊ (V1.0)
 * BỘ CÀI ĐẶT TRANG TÍNH TỰ ĐỘNG (INSTALLER.GS)
 * Archetype: Rental & Assets
 * ============================================================================
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 QUẢN LÝ CHO THUÊ THIẾT BỊ')
    .addItem('⚡ Khởi tạo / Làm mới dữ liệu chuẩn', 'install_EQUIPMENT_SHEET')
    .addItem('🌐 Mở Web App Quản Trị', 'openWebAppModal')
    .addToUi();
}

function openWebAppModal() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800)
    .setTitle('Quản Lý Cho Thuê Thiết Bị v1.0');
  SpreadsheetApp.getUi().showModalDialog(html, 'Web App Cho Thuê Thiết Bị');
}

function install_EQUIPMENT_SHEET() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabs = ['DASHBOARD', 'THIET_BI', 'HOP_DONG'];
  const sheets = {};

  tabs.forEach(function(tabName) {
    let sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    }
    sheets[tabName] = sheet;
  });

  // Xóa sheet mặc định nếu có
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính 1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  // --------------------------------------------------------------------------
  // TAB 1: DASHBOARD
  // --------------------------------------------------------------------------
  const dash = sheets['DASHBOARD'];
  dash.clear();
  dash.setTabColor('#1A73E8');
  dash.getRange('A1:H1').merge().setValue('TỔNG QUAN HỆ THỐNG QUẢN LÝ VÀ CHO THUÊ THIẾT BỊ')
    .setFontSize(16).setFontWeight('bold').setBackground('#1A73E8').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.setRowHeight(1, 45);

  const dashHeaders = [
    ['Chỉ Số Vận Hành', 'Giá Trị', 'Đơn Vị', 'Ghi Chú'],
    ['Tổng Thiết Bị Quản Lý', '=COUNTA(THIET_BI!A3:A)', 'Mục', 'Toàn bộ danh mục'],
    ['Thiết Bị Đang Cho Thuê', '=COUNTIF(THIET_BI!G3:G, "renting")', 'Mục', 'Đang giao khách'],
    ['Thiết Bị Có Sẵn Trong Kho', '=COUNTIF(THIET_BI!G3:G, "available")', 'Mục', 'Sẵn sàng giao'],
    ['Thiết Bị Đang Bảo Trì', '=COUNTIF(THIET_BI!G3:G, "maintenance")', 'Mục', 'Kiểm tra kỹ thuật'],
    ['Tổng Giá Trị Tiền Cọc Đang Giữ', '=SUMIF(THIET_BI!G3:G, "renting", THIET_BI!F3:F)', 'VNĐ', 'Cọc bảo đảm'],
    ['Tổng Doanh Thu Hợp Đồng', '=SUM(HOP_DONG!I3:I)', 'VNĐ', 'Theo hợp đồng']
  ];
  dash.getRange('A3:D9').setValues(dashHeaders);
  dash.getRange('A3:D3').setFontWeight('bold').setBackground('#E8F0FE').setHorizontalAlignment('center');
  dash.getRange('A4:A9').setFontWeight('bold');
  dash.getRange('B4:B9').setHorizontalAlignment('right');
  dash.getRange('B8:B9').setNumberFormat('#,##0 "₫"');
  dash.setColumnWidth(1, 260);
  dash.setColumnWidth(2, 160);
  dash.setColumnWidth(3, 100);
  dash.setColumnWidth(4, 220);

  // --------------------------------------------------------------------------
  // TAB 2: THIET_BI
  // --------------------------------------------------------------------------
  const tb = sheets['THIET_BI'];
  tb.clear();
  tb.setTabColor('#0D9488');
  tb.getRange('A1:L1').merge().setValue('DANH MỤC THIẾT BỊ & TÀI SẢN CHO THUÊ')
    .setFontSize(14).setFontWeight('bold').setBackground('#0D9488').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  tb.setRowHeight(1, 40);

  const tbHeaders = [
    'Mã TB', 'Mã Vạch', 'Tên Thiết Bị', 'Danh Mục', 'Giá Thuê/Ngày',
    'Tiền Cọc', 'Trạng Thái', 'Người Thuê', 'Ngày Bắt Đầu', 'Ngày Trả Dự Kiến',
    'Mã Hợp Đồng', 'Ghi Chú Kỹ Thuật'
  ];
  tb.getRange(2, 1, 1, tbHeaders.length).setValues([tbHeaders])
    .setFontWeight('bold').setBackground('#CCFBF1').setHorizontalAlignment('center')
    .setFontColor('#115E59');
  tb.setFrozenRows(2);

  const tbSampleData = [
    ['EQ-001', 'BC-CAM-802', 'Sony FX3 Full-Frame Cinema Camera + Rig Tilta', 'Máy quay Cinema', 850000, 15000000, 'renting', 'Công ty Truyền thông MediaPro', '2026-08-03', '2026-08-06', 'HĐ-TB-2026-081', 'Kèm 2 thẻ CFexpress Type A 160GB, 3 pin chính hãng'],
    ['EQ-002', 'BC-DRONE-01', 'DJI Mavic 3 Cine Combo 3 Pin + RC Pro', 'Flycam & Drone', 1200000, 20000000, 'returned', 'Studio Ánh Dương', '2026-07-31', '2026-08-03', 'HĐ-TB-2026-075', 'Đã kiểm tra động cơ và gimbal hoàn hảo'],
    ['EQ-003', 'BC-LENS-2470', 'Sony FE 24-70mm f/2.8 GM II (G Master)', 'Ống kính', 450000, 10000000, 'available', '', '', '', '', 'Kính trong veo, có cap trước sau và hood zin'],
    ['EQ-004', 'BC-LIGHT-600', 'Aputure LS 600d Pro Daylight LED Monolight', 'Ánh sáng sân khấu', 600000, 12000000, 'renting', 'Production House RedPixel', '2026-08-02', '2026-08-05', 'HĐ-TB-2026-080', 'Gồm chóa Hyper Reflector, ngàm Bowens và vali Rolling Case'],
    ['EQ-005', 'BC-AUDIO-WIR', 'Sennheiser EW-DP ME 2 Set Digital Wireless', 'Thiết bị âm thanh', 350000, 5000000, 'maintenance', '', '', '', '', 'Đang thay jack 3.5mm mic cài áo, test thu âm ổn'],
    ['EQ-006', 'BC-GIM-RS3', 'DJI RS 3 Pro Gimbal Combo', 'Chống rung & Grip', 400000, 8000000, 'available', '', '', '', '', 'Đầy đủ Focus Motor và RavenEye Image Transmitter']
  ];
  tb.getRange(3, 1, tbSampleData.length, tbHeaders.length).setValues(tbSampleData);
  tb.getRange('E3:F' + (tbSampleData.length + 2)).setNumberFormat('#,##0 "₫"');

  tb.setColumnWidth(1, 90);
  tb.setColumnWidth(2, 120);
  tb.setColumnWidth(3, 300);
  tb.setColumnWidth(4, 150);
  tb.setColumnWidth(5, 130);
  tb.setColumnWidth(6, 130);
  tb.setColumnWidth(7, 120);
  tb.setColumnWidth(8, 220);
  tb.setColumnWidth(9, 110);
  tb.setColumnWidth(10, 120);
  tb.setColumnWidth(11, 140);
  tb.setColumnWidth(12, 320);

  // --------------------------------------------------------------------------
  // TAB 3: HOP_DONG
  // --------------------------------------------------------------------------
  const hd = sheets['HOP_DONG'];
  hd.clear();
  hd.setTabColor('#F59E0B');
  hd.getRange('A1:L1').merge().setValue('SỔ THEO DÕI HỢP ĐỒNG CHO THUÊ THIẾT BỊ')
    .setFontSize(14).setFontWeight('bold').setBackground('#F59E0B').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  hd.setRowHeight(1, 40);

  const hdHeaders = [
    'Mã Hợp Đồng', 'Khách Hàng', 'Số Điện Thoại', 'Mã Thiết Bị', 'Tên Thiết Bị',
    'Ngày Thuê', 'Ngày Trả', 'Số Ngày', 'Tổng Tiền Thuê', 'Tiền Cọc',
    'Trạng Thái HĐ', 'Ghi Chú Bàn Giao'
  ];
  hd.getRange(2, 1, 1, hdHeaders.length).setValues([hdHeaders])
    .setFontWeight('bold').setBackground('#FEF3C7').setHorizontalAlignment('center')
    .setFontColor('#92400E');
  hd.setFrozenRows(2);

  const hdSampleData = [
    ['HĐ-TB-2026-081', 'Công ty Truyền thông MediaPro', '0983 112 233', 'EQ-001', 'Sony FX3 Full-Frame Cinema Camera + Rig Tilta', '2026-08-03', '2026-08-06', 3, 2550000, 15000000, 'Đang thuê', 'Giao lúc 08:30 sáng, đầy đủ phụ kiện'],
    ['HĐ-TB-2026-080', 'Production House RedPixel', '0912 334 556', 'EQ-004', 'Aputure LS 600d Pro Daylight LED Monolight', '2026-08-02', '2026-08-05', 3, 1800000, 12000000, 'Đang thuê', 'Kiểm tra bóng sáng chuẩn CRI 96+'],
    ['HĐ-TB-2026-075', 'Studio Ánh Dương', '0908 445 566', 'EQ-002', 'DJI Mavic 3 Cine Combo 3 Pin + RC Pro', '2026-07-31', '2026-08-03', 3, 3600000, 20000000, 'Đã hoàn tất', 'Đã thu hồi, hoàn cọc 100%']
  ];
  hd.getRange(3, 1, hdSampleData.length, hdHeaders.length).setValues(hdSampleData);
  hd.getRange('I3:J' + (hdSampleData.length + 2)).setNumberFormat('#,##0 "₫"');

  hd.setColumnWidth(1, 140);
  hd.setColumnWidth(2, 220);
  hd.setColumnWidth(3, 120);
  hd.setColumnWidth(4, 100);
  hd.setColumnWidth(5, 280);
  hd.setColumnWidth(6, 110);
  hd.setColumnWidth(7, 110);
  hd.setColumnWidth(8, 80);
  hd.setColumnWidth(9, 130);
  hd.setColumnWidth(10, 130);
  hd.setColumnWidth(11, 120);
  hd.setColumnWidth(12, 300);

  SpreadsheetApp.getActiveSpreadsheet().toast('Khởi tạo trang tính Quản lý Thiết bị thành công!', 'Hoàn tất', 5);
}

