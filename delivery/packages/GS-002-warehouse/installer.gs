/**
 * ============================================================================
 * GS-002: WEBAPP QUẢN LÝ NHẬP XUẤT TỒN ĐA KHO (V3.0)
 * BỘ CÀI ĐẶT TRANG TÍNH TỰ ĐỘNG (INSTALLER.GS)
 * Archetype: Inventory & Warehousing
 * ============================================================================
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📦 QUẢN LÝ KHO ĐA KHO')
    .addItem('⚡ Khởi tạo / Làm mới dữ liệu chuẩn', 'install_WAREHOUSE_SHEET')
    .addItem('🌐 Mở Web App Quản Trị Kho', 'openWarehouseWebApp')
    .addToUi();
}

function openWarehouseWebApp() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800)
    .setTitle('Quản Lý Nhập Xuất Tồn Đa Kho v3.0');
  SpreadsheetApp.getUi().showModalDialog(html, 'Web App Quản Trị Kho Đa Kho');
}

function install_WAREHOUSE_SHEET() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabs = ['DASHBOARD', 'DANH_MUC_HANG', 'NHAP_XUAT'];
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
  dash.setTabColor('#0284C7');
  dash.getRange('A1:H1').merge().setValue('TỔNG QUAN HỆ THỐNG QUẢN LÝ NHẬP XUẤT TỒN ĐA KHO')
    .setFontSize(16).setFontWeight('bold').setBackground('#0284C7').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.setRowHeight(1, 45);

  const dashHeaders = [
    ['Chỉ Số Kho Hàng', 'Giá Trị', 'Đơn Vị', 'Ghi Chú'],
    ['Tổng Số Mặt Hàng (SKU)', '=COUNTA(DANH_MUC_HANG!A3:A)', 'SKU', 'Mặt hàng đang kinh doanh'],
    ['Tổng Giá Trị Hàng Tồn', '=SUMPRODUCT(DANH_MUC_HANG!E3:E100, (DANH_MUC_HANG!G3:G100 + DANH_MUC_HANG!H3:H100 + DANH_MUC_HANG!I3:I100))', 'VNĐ', 'Theo giá vốn bình quân'],
    ['SKU Cảnh Báo Sắp Hết Hàng', '=COUNTIF(DANH_MUC_HANG!L3:L, "Cảnh báo thiếu")', 'SKU', 'Tồn kho dưới ngưỡng tối thiểu'],
    ['Tổng Tồn Kho Hà Nội', '=SUM(DANH_MUC_HANG!G3:G)', 'Sản phẩm', 'Kho chi nhánh Miền Bắc'],
    ['Tổng Tồn Kho Sài Gòn', '=SUM(DANH_MUC_HANG!H3:H)', 'Sản phẩm', 'Kho chi nhánh Miền Nam'],
    ['Tổng Tồn Kho Tổng Trung Tâm', '=SUM(DANH_MUC_HANG!I3:I)', 'Sản phẩm', 'Kho Hub phân phối']
  ];
  dash.getRange('A3:D9').setValues(dashHeaders);
  dash.getRange('A3:D3').setFontWeight('bold').setBackground('#E0F2FE').setHorizontalAlignment('center');
  dash.getRange('A4:A9').setFontWeight('bold');
  dash.getRange('B4:B9').setHorizontalAlignment('right');
  dash.getRange('B5').setNumberFormat('#,##0 "₫"');
  dash.setColumnWidth(1, 260);
  dash.setColumnWidth(2, 180);
  dash.setColumnWidth(3, 100);
  dash.setColumnWidth(4, 250);

  // --------------------------------------------------------------------------
  // TAB 2: DANH_MUC_HANG
  // --------------------------------------------------------------------------
  const dm = sheets['DANH_MUC_HANG'];
  dm.clear();
  dm.setTabColor('#059669');
  dm.getRange('A1:L1').merge().setValue('DANH MỤC HÀNG HÓA & TỒN KHO THỜI GIAN THỰC')
    .setFontSize(14).setFontWeight('bold').setBackground('#059669').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dm.setRowHeight(1, 40);

  const dmHeaders = [
    'Mã SKU', 'Tên Hàng Hóa', 'Danh Mục', 'Đơn Vị', 'Giá Vốn',
    'Giá Bán', 'Tồn Kho HN', 'Tồn Kho SG', 'Tồn Kho Tổng', 'Tổng Tồn',
    'Mức Min', 'Trạng Thái Cảnh Báo'
  ];
  dm.getRange(2, 1, 1, dmHeaders.length).setValues([dmHeaders])
    .setFontWeight('bold').setBackground('#D1FAE5').setHorizontalAlignment('center')
    .setFontColor('#065F46');
  dm.setFrozenRows(2);

  const dmSampleData = [
    ['SKU-CAM-FX3', 'Sony FX3 Cinema Line Full-Frame', 'Thiết bị ghi hình', 'Chiếc', 72000000, 85000000, 4, 3, 5, '=G3+H3+I3', 3, '=IF(J3<=K3, "Cảnh báo thiếu", "Bình thường")'],
    ['SKU-LEN-2470', 'Sony FE 24-70mm f/2.8 GM II', 'Ống kính', 'Chiếc', 38000000, 46000000, 2, 4, 6, '=G4+H4+I4', 4, '=IF(J4<=K4, "Cảnh báo thiếu", "Bình thường")'],
    ['SKU-DRO-M3C', 'DJI Mavic 3 Cine Combo', 'Flycam', 'Bộ', 85000000, 99000000, 1, 1, 2, '=G5+H5+I5', 3, '=IF(J5<=K5, "Cảnh báo thiếu", "Bình thường")'],
    ['SKU-LGT-600D', 'Aputure Light Storm LS 600d Pro', 'Ánh sáng', 'Bộ', 42000000, 49000000, 5, 4, 8, '=G6+H6+I6', 5, '=IF(J6<=K6, "Cảnh báo thiếu", "Bình thường")'],
    ['SKU-MIC-EWDP', 'Sennheiser EW-DP ME 2 Wireless Mic', 'Âm thanh', 'Bộ', 14500000, 18000000, 6, 8, 10, '=G7+H7+I7', 5, '=IF(J7<=K7, "Cảnh báo thiếu", "Bình thường")'],
    ['SKU-GIM-RS3P', 'DJI RS 3 Pro Gimbal Stabilizer', 'Chống rung', 'Chiếc', 18000000, 22500000, 3, 2, 4, '=G8+H8+I8', 4, '=IF(J8<=K8, "Cảnh báo thiếu", "Bình thường")']
  ];
  dm.getRange(3, 1, dmSampleData.length, dmHeaders.length).setValues(dmSampleData);
  dm.getRange('E3:F' + (dmSampleData.length + 2)).setNumberFormat('#,##0 "₫"');

  dm.setColumnWidth(1, 120);
  dm.setColumnWidth(2, 280);
  dm.setColumnWidth(3, 150);
  dm.setColumnWidth(4, 90);
  dm.setColumnWidth(5, 120);
  dm.setColumnWidth(6, 120);
  dm.setColumnWidth(7, 100);
  dm.setColumnWidth(8, 100);
  dm.setColumnWidth(9, 110);
  dm.setColumnWidth(10, 100);
  dm.setColumnWidth(11, 90);
  dm.setColumnWidth(12, 150);

  // --------------------------------------------------------------------------
  // TAB 3: NHAP_XUAT
  // --------------------------------------------------------------------------
  const nx = sheets['NHAP_XUAT'];
  nx.clear();
  nx.setTabColor('#F59E0B');
  nx.getRange('A1:L1').merge().setValue('NHẬT KÝ NHẬP - XUẤT - ĐIỀU CHUYỂN KHO')
    .setFontSize(14).setFontWeight('bold').setBackground('#F59E0B').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  nx.setRowHeight(1, 40);

  const nxHeaders = [
    'Mã Phiếu', 'Thời Gian', 'Loại Phiếu', 'Mã SKU', 'Tên Hàng Hóa',
    'Số Lượng', 'Đơn Giá', 'Thành Tiền', 'Từ Kho', 'Đến Kho',
    'Người Thực Hiện', 'Ghi Chú'
  ];
  nx.getRange(2, 1, 1, nxHeaders.length).setValues([nxHeaders])
    .setFontWeight('bold').setBackground('#FEF3C7').setHorizontalAlignment('center')
    .setFontColor('#92400E');
  nx.setFrozenRows(2);

  const nxSampleData = [
    ['PNK-2026-0801', '2026-08-01 09:15', 'Nhập kho', 'SKU-CAM-FX3', 'Sony FX3 Cinema Line Full-Frame', 3, 72000000, 216000000, 'Nhà phân phối Sony VN', 'Kho Hà Nội', 'Trần Đình Trọng', 'Lô hàng chính hãng nhập đợt 1'],
    ['PXK-2026-0802', '2026-08-02 14:30', 'Xuất kho', 'SKU-DRO-M3C', 'DJI Mavic 3 Cine Combo', 1, 85000000, 85000000, 'Kho Sài Gòn', 'Khách hàng VIP Studio', 'Lê Hoàng Nam', 'Xuất theo đơn giao ngay'],
    ['PDC-2026-0803', '2026-08-03 11:00', 'Điều chuyển', 'SKU-LGT-600D', 'Aputure Light Storm LS 600d Pro', 2, 42000000, 84000000, 'Kho Tổng', 'Kho Hà Nội', 'Phạm Minh Đức', 'Cân đối tồn kho trước sự kiện']
  ];
  nx.getRange(3, 1, nxSampleData.length, nxHeaders.length).setValues(nxSampleData);
  nx.getRange('G3:H' + (nxSampleData.length + 2)).setNumberFormat('#,##0 "₫"');

  nx.setColumnWidth(1, 140);
  nx.setColumnWidth(2, 150);
  nx.setColumnWidth(3, 120);
  nx.setColumnWidth(4, 120);
  nx.setColumnWidth(5, 260);
  nx.setColumnWidth(6, 90);
  nx.setColumnWidth(7, 120);
  nx.setColumnWidth(8, 130);
  nx.setColumnWidth(9, 180);
  nx.setColumnWidth(10, 160);
  nx.setColumnWidth(11, 150);
  nx.setColumnWidth(12, 280);

  SpreadsheetApp.getActiveSpreadsheet().toast('Khởi tạo trang tính Quản lý Kho Đa Kho thành công!', 'Hoàn tất', 5);
}

