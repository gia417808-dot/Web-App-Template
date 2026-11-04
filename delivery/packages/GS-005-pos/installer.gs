/**
 * ============================================================================
 * GS-005: WEBAPP QUẢN LÝ NHÀ HÀNG, CAFE, POS TÍNH GIỜ & VIETQR ĐỘNG (V3.3 PRO)
 * BỘ CÀI ĐẶT 9 TAB DOANH NGHIỆP TỰ ĐỘNG (INSTALLER.GS)
 * Bao gồm: DASHBOARD, SO_DO_BAN, THUC_DON, HOA_DON, HOI_VIEN_VIP, PHIEU_BEP_KDS,
 *          PHAN_QUYEN, CAU_HINH, NHAT_KY
 * Archetype: Point of Sale & F&B (Golden Master v3.3)
 * Lưu ý: KHÔNG khai báo onOpen() tại file này để tránh xung đột với Code.gs
 * ============================================================================
 */

function install_POS_SHEET() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return;

  try {
    ss.setSpreadsheetLocale('en_US');
    ss.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh');
    SpreadsheetApp.flush();
  } catch (e) {}

  const tabs = [
    'DASHBOARD',
    'SO_DO_BAN',
    'THUC_DON',
    'HOA_DON',
    'HOI_VIEN_VIP',
    'PHIEU_BEP_KDS',
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
  dash.setTabColor('#F59E0B');
  dash.getRange('A1:H1').merge()
    .setValue('HỆ THỐNG QUẢN LÝ F&B POS NHÀ HÀNG, CAFE & BIDA TÍNH GIỜ (V3.3 COMMERCIAL PRO)')
    .setFontSize(15).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.setRowHeight(1, 46);

  const dashKpiRows = [
    ['CHỈ SỐ BÁN HÀNG & PHỤC VỤ (REAL-TIME)', 'GIÁ TRỊ HIỆN TẠI', 'ĐƠN VỊ', 'GHI CHÚ NGHIỆP VỤ'],
    ['Tổng Doanh Thu Đã Thu Hoàn Tất', '=SUM(HOA_DON!L3:L)', 'VNĐ', 'Tổng tiền thực thu từ các hóa đơn đã tất toán'],
    ['Tổng Doanh Thu Tiền Giờ (Bida/VIP)', '=SUM(HOA_DON!J3:J)', 'VNĐ', 'Tiền dịch vụ tính giờ phòng VIP & bàn bida'],
    ['Tổng Doanh Thu Tiền Món & Combo', '=SUM(HOA_DON!H3:H)', 'VNĐ', 'Doanh số thực phẩm, đồ uống & combo'],
    ['Tổng Số Lượng Hóa Đơn Xuất Ca', '=COUNTA(HOA_DON!A3:A)', 'Hóa đơn', 'Tổng lượt bàn đã checkout thành công'],
    ['Số Bàn Đang Phục Vụ (Có Khách)', '=COUNTIF(SO_DO_BAN!E3:E, "Đang phục vụ")', 'Bàn', 'Các bàn/phòng đang mở order'],
    ['Tổng Số Hội Viên Thân Thiết (VIP)', '=COUNTA(HOI_VIEN_VIP!A3:A)', 'Hội viên', 'Hội viên Bạc (Silver), Vàng (Gold), Bạch Kim (Platinum)'],
    ['Số Phiếu Bếp KDS Đang Chờ / Chế Biến', '=COUNTIF(PHIEU_BEP_KDS!G3:G, "Chờ chế biến")+COUNTIF(PHIEU_BEP_KDS!G3:G, "Đang chế biến")', 'Phiếu KDS', 'Phiếu order đang chờ bếp hoặc quầy bar chế biến']
  ];
  dash.getRange(3, 1, dashKpiRows.length, 4).setValues(dashKpiRows);
  dash.getRange('A3:D3').setFontWeight('bold').setBackground('#D97706').setFontColor('#FFFFFF').setHorizontalAlignment('center');
  dash.getRange('A4:A10').setFontWeight('bold');
  dash.getRange('B4:B10').setHorizontalAlignment('right').setFontWeight('bold');
  dash.getRange('C4:C10').setHorizontalAlignment('center');
  dash.getRange('B4:B6').setNumberFormat('#,##0 "₫"');

  const zoneRows = [
    ['PHÂN TÍCH DOANH THU THEO KHU VỰC PHỤC VỤ', 'SỐ BÀN ĐANG PHỤC VỤ', 'TIỀN TẠM TÍNH (VNĐ)', 'QUẢN LÝ KHU VỰC'],
    ['Tầng 1 — Cafe & Sân Vườn', '=COUNTIFS(SO_DO_BAN!C3:C, "Tầng 1 — Cafe & Sân Vườn", SO_DO_BAN!E3:E, "Đang phục vụ")', '=SUMIF(SO_DO_BAN!C3:C, "Tầng 1 — Cafe & Sân Vườn", SO_DO_BAN!K3:K)', 'Nguyễn Văn Minh (order_tang1)'],
    ['Tầng 2 — Nhà Hàng & Phòng Lạnh', '=COUNTIFS(SO_DO_BAN!C3:C, "Tầng 2 — Nhà Hàng & Phòng Lạnh", SO_DO_BAN!E3:E, "Đang phục vụ")', '=SUMIF(SO_DO_BAN!C3:C, "Tầng 2 — Nhà Hàng & Phòng Lạnh", SO_DO_BAN!K3:K)', 'Lê Thu Trang (thungan_ca1)'],
    ['Khu Bida & Phòng VIP Tính Giờ', '=COUNTIFS(SO_DO_BAN!C3:C, "Khu Bida & Phòng VIP Tính Giờ", SO_DO_BAN!E3:E, "Đang phục vụ")', '=SUMIF(SO_DO_BAN!C3:C, "Khu Bida & Phòng VIP Tính Giờ", SO_DO_BAN!K3:K)', 'Hoàng Văn Bách (order_bida)']
  ];
  dash.getRange(12, 1, zoneRows.length, 4).setValues(zoneRows);
  dash.getRange('A12:D12').setFontWeight('bold').setBackground('#0284C7').setFontColor('#FFFFFF').setHorizontalAlignment('center');
  dash.getRange('A13:A15').setFontWeight('bold');
  dash.getRange('B13:C15').setHorizontalAlignment('right');
  dash.getRange('C13:C15').setNumberFormat('#,##0 "₫"');
  dash.setColumnWidth(1, 320);
  dash.setColumnWidth(2, 195);
  dash.setColumnWidth(3, 205);
  dash.setColumnWidth(4, 280);

  // TAB 2: SO_DO_BAN
  const sdb = sheets['SO_DO_BAN'];
  sdb.clear();
  sdb.setTabColor('#0284C7');
  sdb.getRange('A1:M1').merge()
    .setValue('SƠ ĐỒ BÀN / PHÒNG, ĐỒNG HỒ TÍNH GIỜ BIDA/VIP, TRẠNG THÁI BẾP & ORDER HIỆN TẠI')
    .setFontSize(14).setFontWeight('bold').setBackground('#0284C7').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sdb.setRowHeight(1, 40);

  const sdbHeaders = [
    'Mã Bàn', 'Tên Bàn / Phòng', 'Khu Vực', 'Loại Dịch Vụ', 'Trạng Thái',
    'Đơn Giá Giờ (₫/h)', 'Thời Gian Mở Bàn', 'Số Khách', 'Tạm Tính Tiền Món',
    'Tạm Tính Tiền Giờ', 'Tổng Tạm Tính (₫)', 'Ghi Chú Order', 'Trạng Thái Bếp KDS'
  ];
  sdb.getRange(2, 1, 1, sdbHeaders.length).setValues([sdbHeaders])
    .setFontWeight('bold').setBackground('#E0F2FE').setFontColor('#0369A1').setHorizontalAlignment('center');
  sdb.setFrozenRows(2);
  sdb.getRange('G3:G50').setNumberFormat('@');

  const nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
  const sdbSampleData = [
    ['BAN-01', 'Bàn 01 (Cửa Sổ)', 'Tầng 1 — Cafe & Sân Vườn', 'Bàn Cafe thường', 'Đang phục vụ', 0, nowStr, 3, 119000, 0, 119000, '2x Cà Phê Muối Đặc Biệt, 1x Bánh Tiramisu Cacao Ý', 'Đã giao bàn'],
    ['BAN-02', 'Bàn 02 (Sofa)', 'Tầng 1 — Cafe & Sân Vườn', 'Bàn Cafe thường', 'Trống', 0, '', 0, 0, 0, 0, 'Đã dọn sạch sẽ', '---'],
    ['BAN-03', 'Bàn 03 (Gia Đình)', 'Tầng 1 — Cafe & Sân Vườn', 'Bàn Cafe thường', 'Đang phục vụ', 0, nowStr, 4, 129000, 0, 129000, '3x Trà Đào Cam Sả Tươi (Mua 2 Tặng 1), 1x Khoai Tây Chiên Lắc Phô Mai', 'Đang chế biến'],
    ['BAN-04', 'Bàn 04 (Ban Công)', 'Tầng 1 — Cafe & Sân Vườn', 'Bàn Cafe thường', 'Trống', 0, '', 0, 0, 0, 0, 'View thoáng mát', '---'],
    ['NH-01', 'Bàn Ăn 01 (Lẩu/Nướng)', 'Tầng 2 — Nhà Hàng & Phòng Lạnh', 'Bàn Ăn Nhà Hàng', 'Đang phục vụ', 0, nowStr, 5, 622000, 0, 622000, '1x Combo Lẩu Hải Sản Thượng Hạng, 2x Trà Ô Long Sữa Trân Châu', 'Chờ chế biến'],
    ['NH-02', 'Bàn Ăn 02 (VIP Tròn)', 'Tầng 2 — Nhà Hàng & Phòng Lạnh', 'Bàn Ăn Nhà Hàng', 'Trống', 0, '', 0, 0, 0, 0, 'Sẵn sàng xếp bàn', '---'],
    ['NH-03', 'Bàn Ăn 03 (Gia Đình)', 'Tầng 2 — Nhà Hàng & Phòng Lạnh', 'Bàn Ăn Nhà Hàng', 'Đang phục vụ', 0, nowStr, 2, 370000, 0, 370000, '2x Bò Bít Tết Sốt Tiêu Đen', 'Đã giao bàn'],
    ['BIDA-01', 'Bàn Bida 01 (Carom)', 'Khu Bida & Phòng VIP Tính Giờ', 'Bàn Tính Giờ (Bida/VIP)', 'Đang phục vụ', 60000, nowStr, 2, 87000, 90000, 177000, '1x Cà Phê Sữa Đá Sài Gòn, 1x Khoai Tây Chiên + 90p Bida', 'Đã xong - Chờ bưng'],
    ['BIDA-02', 'Bàn Bida 02 (Pool)', 'Khu Bida & Phòng VIP Tính Giờ', 'Bàn Tính Giờ (Bida/VIP)', 'Trống', 60000, '', 0, 0, 0, 0, 'Bàn Pool 9 bóng chuẩn giải đấu', '---'],
    ['VIP-01', 'Phòng VIP Hoàng Gia', 'Khu Bida & Phòng VIP Tính Giờ', 'Bàn Tính Giờ (Bida/VIP)', 'Đang phục vụ', 120000, nowStr, 8, 1062000, 240000, 1302000, '2x Combo Lẩu Hải Sản Thượng Hạng + 120p Phòng VIP', 'Đã giao bàn']
  ];
  sdb.getRange(3, 1, sdbSampleData.length, sdbHeaders.length).setValues(sdbSampleData);
  sdb.getRange('F3:F12').setNumberFormat('#,##0 "₫"');
  sdb.getRange('I3:K12').setNumberFormat('#,##0 "₫"');
  sdb.getRange('A3:A12').setHorizontalAlignment('center').setFontWeight('bold');
  sdb.getRange('D3:E12').setHorizontalAlignment('center');
  sdb.getRange('H3:H12').setHorizontalAlignment('center');
  sdb.getRange('M3:M12').setHorizontalAlignment('center');

  const sdbWidths = [105, 175, 230, 160, 125, 125, 145, 85, 135, 135, 145, 260, 150];
  sdbWidths.forEach(function(w, idx) { sdb.setColumnWidth(idx + 1, w); });

  // TAB 3: THUC_DON
  const td = sheets['THUC_DON'];
  td.clear();
  td.setTabColor('#10B981');
  td.getRange('A1:J1').merge()
    .setValue('DANH MỤC MÓN ĂN, ĐỒ UỐNG, COMBO & CHƯƠNG TRÌNH KHUYẾN MÃI')
    .setFontSize(14).setFontWeight('bold').setBackground('#059669').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  td.setRowHeight(1, 40);

  const tdHeaders = [
    'Mã Món', 'Tên Món Ăn / Đồ Uống / Combo', 'Danh Mục', 'Đơn Vị',
    'Đơn Giá Bán', 'Giá Vốn', 'Khuyến Mãi Áp Dụng', 'Khu Chế Biến',
    'Trạng Thái', 'Mô Tả / Ghi Chú'
  ];
  td.getRange(2, 1, 1, tdHeaders.length).setValues([tdHeaders])
    .setFontWeight('bold').setBackground('#D1FAE5').setFontColor('#065F46').setHorizontalAlignment('center');
  td.setFrozenRows(2);

  const tdSampleData = [
    ['MN-CF-01', 'Cà Phê Muối Đặc Biệt', 'Cà Phê', 'Ly', 35000, 12000, 'Không', 'Quầy Pha Chế', 'Còn hàng', 'Kem muối béo ngậy, cafe rang mộc'],
    ['MN-CF-02', 'Cà Phê Sữa Đá Sài Gòn', 'Cà Phê', 'Ly', 29000, 9000, 'Không', 'Quầy Pha Chế', 'Còn hàng', 'Robusta đậm đà, sữa đặc truyền thống'],
    ['MN-TR-01', 'Trà Đào Cam Sả Tươi', 'Trà & Nước Ép', 'Ly', 42000, 14000, 'Mua 2 Tặng 1', 'Quầy Pha Chế', 'Còn hàng', 'Tự động tặng 1 ly miễn phí khi gọi đủ 3 ly'],
    ['MN-TR-02', 'Trà Ô Long Sữa Trân Châu', 'Trà & Nước Ép', 'Ly', 45000, 15000, 'Mua 2 Tặng 1', 'Quầy Pha Chế', 'Còn hàng', 'Trân châu đen dẻo dai — Mua 2 Tặng 1'],
    ['MN-AN-01', 'Bò Bít Tết Sốt Tiêu Đen', 'Món Chính & Lẩu', 'Đĩa', 185000, 85000, 'Không', 'Bếp Nấu Nóng', 'Còn hàng', 'Thăn bò Úc mềm mọng sốt tiêu cay nhẹ'],
    ['MN-AN-02', 'Mì Ý Sốt Bò Bằm Bolognaise', 'Món Chính & Lẩu', 'Đĩa', 95000, 38000, 'Không', 'Bếp Nấu Nóng', 'Còn hàng', 'Sốt cà chua bò tươi chuẩn Ý'],
    ['MN-AN-03', 'Khoai Tây Chiên Lắc Phô Mai', 'Ăn Nhẹ & Khai Vị', 'Đĩa', 45000, 16000, 'Mua Kèm Giảm 20%', 'Bếp Nấu Nóng', 'Còn hàng', 'Mua kèm đồ uống hoặc combo giảm ngay 20%'],
    ['MN-AN-04', 'Bánh Tiramisu Cacao Ý', 'Bánh & Tráng Miệng', 'Phần', 49000, 18000, 'Mua Kèm Giảm 20%', 'Bếp Lạnh / Bánh', 'Còn hàng', 'Mua kèm Cà phê/Trà giảm 20%'],
    ['CB-LUNCH-01', 'Combo Trưa Nhanh (Mì Ý + Cà Phê + Bánh)', 'Combo Tiết Kiệm', 'Combo', 159000, 65000, 'Combo Giảm 15%', 'Bếp & Pha Chế', 'Còn hàng', 'Tiết kiệm 15% so với gọi lẻ từng món'],
    ['CB-LAU-02', 'Combo Lẩu Hải Sản Thượng Hạng (4-5 người)', 'Combo Tiết Kiệm', 'Nồi', 590000, 260000, 'Giảm 10% Giờ Vàng', 'Bếp Nấu Nóng', 'Còn hàng', 'Tôm càng, mực ống, cá hồi, rau nấm tươi'],
    ['CB-BIDA-03', 'Combo Chiến Hữu Bida (4 Nước Tăng Lực + Khô Bò)', 'Combo Tiết Kiệm', 'Combo', 140000, 55000, 'Combo Giảm 15%', 'Quầy Pha Chế', 'Còn hàng', 'Combo ưu đãi dành riêng cho bàn Bida & VIP']
  ];
  td.getRange(3, 1, tdSampleData.length, tdHeaders.length).setValues(tdSampleData);
  td.getRange('E3:F13').setNumberFormat('#,##0 "₫"');
  td.getRange('A3:A13').setHorizontalAlignment('center').setFontWeight('bold');
  td.getRange('D3:D13').setHorizontalAlignment('center');
  td.getRange('G3:I13').setHorizontalAlignment('center');

  const tdWidths = [115, 290, 160, 85, 125, 115, 165, 140, 110, 260];
  tdWidths.forEach(function(w, idx) { td.setColumnWidth(idx + 1, w); });

  // TAB 4: HOA_DON
  const hd = sheets['HOA_DON'];
  hd.clear();
  hd.setTabColor('#EF4444');
  hd.getRange('A1:N1').merge()
    .setValue('SỔ NHẬT KÝ HÓA ĐƠN BÁN HÀNG, THANH TOÁN VIETQR & CHIẾT KHẤU')
    .setFontSize(14).setFontWeight('bold').setBackground('#DC2626').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  hd.setRowHeight(1, 40);

  const hdHeaders = [
    'Mã Hóa Đơn', 'Ngày Giờ', 'Bàn Phục Vụ', 'Nhân Viên Order', 'Thu Ngân',
    'Khách Hàng', 'Hạng Hội Viên', 'Tiền Món Ăn', 'Thời Gian Giờ', 'Tiền Giờ',
    'Giảm Giá / Khuyến Mãi', 'Tổng Thanh Toán', 'Hình Thức TT', 'Trạng Thái'
  ];
  hd.getRange(2, 1, 1, hdHeaders.length).setValues([hdHeaders])
    .setFontWeight('bold').setBackground('#FEE2E2').setFontColor('#991B1B').setHorizontalAlignment('center');
  hd.setFrozenRows(2);
  hd.getRange('B3:B100').setNumberFormat('@');

  const hdSampleData = [
    ['HD-2026-1001', '2026-10-26 10:30', 'Bàn 01 (Cửa Sổ)', 'Nguyễn Văn Minh', 'Lê Thu Trang', 'Phạm Quốc Cường (0918 889 999)', 'Vàng (Gold - 10%)', 145000, '0', 0, 14500, 130500, 'VietQR Động', 'Đã tất toán'],
    ['HD-2026-1002', '2026-10-26 12:15', 'Bàn Ăn 01 (Lẩu/Nướng)', 'Nguyễn Văn Minh', 'Lê Thu Trang', 'Công ty Cổ phần AlphaTech (0909 111 222)', 'Bạch Kim (Platinum - 15%)', 680000, '0', 0, 102000, 578000, 'VietQR Động', 'Đã tất toán'],
    ['HD-2026-1003', '2026-10-26 14:00', 'Bàn Bida 01 (Carom)', 'Hoàng Văn Bách', 'Lê Thu Trang', 'Trần Đình Trọng (0974 123 456)', 'Bạc (Silver - 5%)', 85000, '120 phút (2.0h)', 120000, 10250, 194750, 'Tiền mặt', 'Đã tất toán'],
    ['HD-2026-1004', '2026-10-26 16:45', 'Bàn 03 (Gia Đình)', 'Nguyễn Văn Minh', 'Lê Thu Trang', 'Khách Vãng Lai', 'Vãng lai (0%)', 185000, '0', 0, 42000, 143000, 'VietQR Động', 'Đã tất toán']
  ];
  hd.getRange(3, 1, hdSampleData.length, hdHeaders.length).setValues(hdSampleData);
  hd.getRange('H3:H6').setNumberFormat('#,##0 "₫"');
  hd.getRange('J3:L6').setNumberFormat('#,##0 "₫"');
  hd.getRange('A3:A6').setHorizontalAlignment('center').setFontWeight('bold');
  hd.getRange('C3:E6').setHorizontalAlignment('center');
  hd.getRange('G3:G6').setHorizontalAlignment('center');
  hd.getRange('M3:N6').setHorizontalAlignment('center');

  const hdWidths = [140, 145, 175, 145, 130, 230, 165, 125, 135, 120, 155, 145, 140, 120];
  hdWidths.forEach(function(w, idx) { hd.setColumnWidth(idx + 1, w); });

  // TAB 5: HOI_VIEN_VIP (MỞ KHÓA QUẢN LÝ THÀNH VIÊN & CƠ CHẾ PHÂN HẠNG)
  const hv = sheets['HOI_VIEN_VIP'];
  hv.clear();
  hv.setTabColor('#0EA5E9');
  hv.getRange('A1:I1').merge()
    .setValue('DANH SÁCH HỘI VIÊN THÂN THIẾT (MEMBER) & CƠ CHẾ PHÂN HẠNG BẠC / VÀNG / BẠCH KIM')
    .setFontSize(14).setFontWeight('bold').setBackground('#0369A1').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  hv.setRowHeight(1, 40);

  const hvHeaders = [
    'Mã Hội Viên', 'Họ Và Tên Hội Viên', 'Số Điện Thoại', 'Hạng Thẻ Hiện Tại',
    'Tổng Chi Tiêu Tích Lũy (₫)', 'Số Lượt Đến', 'Cơ Chế Phân Hạng', 'Trạng Thái Thẻ', 'Ghi Chú Ưu Đãi'
  ];
  hv.getRange(2, 1, 1, hvHeaders.length).setValues([hvHeaders])
    .setFontWeight('bold').setBackground('#E0F2FE').setFontColor('#075985').setHorizontalAlignment('center');
  hv.setFrozenRows(2);
  hv.getRange('C3:C100').setNumberFormat('@');

  const hvSampleData = [
    ['VIP-01', 'Công ty Cổ phần AlphaTech', '0909 111 222', 'Bạch Kim (Platinum - 15%)', 28500000, 24, 'Tự động theo chi tiêu', 'Hoạt động', 'Khách doanh nghiệp đặt tiệc VIP thường xuyên'],
    ['VIP-02', 'Nguyễn Hoàng Hải', '0918 666 888', 'Bạch Kim (Platinum - 15%)', 19200000, 19, 'Tự động theo chi tiêu', 'Hoạt động', 'Hội viên Platinum — Ưu tiên phòng VIP'],
    ['VIP-03', 'Phạm Quốc Cường', '0918 889 999', 'Vàng (Gold - 10%)', 11400000, 15, 'Tự động theo chi tiêu', 'Hoạt động', 'Khách quen khu Cafe & Bida'],
    ['VIP-04', 'Lê Ngọc Bảo Trân', '0988 777 555', 'Vàng (Gold - 10%)', 8900000, 12, 'Cố định hạng (Chủ quán cấp)', 'Hoạt động', 'Đối tác thân thiết được cấp thẻ Vàng'],
    ['VIP-05', 'Trần Đình Trọng', '0974 123 456', 'Bạc (Silver - 5%)', 4200000, 8, 'Tự động theo chi tiêu', 'Hoạt động', 'Hội viên CLB Bida Carom'],
    ['VIP-06', 'Võ Minh Khôi', '0933 444 999', 'Bạc (Silver - 5%)', 3150000, 6, 'Tự động theo chi tiêu', 'Hoạt động', 'Hội viên mới đăng ký thẻ Bạc']
  ];
  hv.getRange(3, 1, hvSampleData.length, hvHeaders.length).setValues(hvSampleData);
  hv.getRange('E3:E15').setNumberFormat('#,##0 "₫"');
  hv.getRange('A3:A15').setHorizontalAlignment('center').setFontWeight('bold');
  hv.getRange('C3:D15').setHorizontalAlignment('center');
  hv.getRange('F3:H15').setHorizontalAlignment('center');

  const hvWidths = [120, 230, 135, 190, 175, 110, 185, 130, 260];
  hvWidths.forEach(function(w, idx) { hv.setColumnWidth(idx + 1, w); });

  // TAB 6: PHIEU_BEP_KDS (ĐỒNG BỘ TRẠNG THÁI PHIẾU GIAO CHO BẾP)
  const kds = sheets['PHIEU_BEP_KDS'];
  kds.clear();
  kds.setTabColor('#EA580C');
  kds.getRange('A1:H1').merge()
    .setValue('ĐIỀU PHỐI PHIẾU CHẾ BIẾN BẾP & QUẦY PHA CHẾ (KDS WORKFLOW REAL-TIME)')
    .setFontSize(14).setFontWeight('bold').setBackground('#C2410C').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  kds.setRowHeight(1, 40);

  const kdsHeaders = [
    'Mã Phiếu KDS', 'Mã Bàn', 'Tên Bàn / Phòng', 'Khu Vực',
    'Giờ Gửi Bếp', 'Nhân Viên Order', 'Trạng Thái Phiếu Bếp', 'Chi Tiết Món (JSON)'
  ];
  kds.getRange(2, 1, 1, kdsHeaders.length).setValues([kdsHeaders])
    .setFontWeight('bold').setBackground('#FFEDD5').setFontColor('#9A3412').setHorizontalAlignment('center');
  kds.setFrozenRows(2);
  kds.getRange('E3:E100').setNumberFormat('@');

  const kdsSampleData = [
    [
      'KDS-1001', 'BAN-03', 'Bàn 03 (Gia Đình)', 'Tầng 1 — Cafe & Sân Vườn', '11:15', 'Nguyễn Văn Minh (order_tang1)', 'Đang chế biến',
      JSON.stringify([
        { code: 'MN-TR-01', name: 'Trà Đào Cam Sả Tươi', qty: 3, kitchenStation: 'Quầy Pha Chế', notes: 'Mua 2 Tặng 1 — Ít đá', itemStatus: 'Đang chế biến' },
        { code: 'MN-AN-03', name: 'Khoai Tây Chiên Lắc Phô Mai', qty: 1, kitchenStation: 'Bếp Nấu Nóng', notes: 'Kèm tương ớt', itemStatus: 'Đang chế biến' }
      ])
    ],
    [
      'KDS-1002', 'NH-01', 'Bàn Ăn 01 (Lẩu/Nướng)', 'Tầng 2 — Nhà Hàng & Phòng Lạnh', '11:20', 'Nguyễn Văn Minh (order_tang1)', 'Chờ chế biến',
      JSON.stringify([
        { code: 'CB-LAU-02', name: 'Combo Lẩu Hải Sản Thượng Hạng (4-5 người)', qty: 1, kitchenStation: 'Bếp Nấu Nóng', notes: 'Nước lẩu Thái chua cay', itemStatus: 'Chờ chế biến' },
        { code: 'MN-TR-02', name: 'Trà Ô Long Sữa Trân Châu', qty: 2, kitchenStation: 'Quầy Pha Chế', notes: '50% đường', itemStatus: 'Chờ chế biến' }
      ])
    ],
    [
      'KDS-1003', 'BIDA-01', 'Bàn Bida 01 (Carom)', 'Khu Bida & Phòng VIP Tính Giờ', '10:25', 'Hoàng Văn Bách (order_bida)', 'Đã xong - Chờ bưng',
      JSON.stringify([
        { code: 'MN-CF-02', name: 'Cà Phê Sữa Đá Sài Gòn', qty: 1, kitchenStation: 'Quầy Pha Chế', notes: 'Đậm cafe', itemStatus: 'Đã xong' }
      ])
    ]
  ];
  kds.getRange(3, 1, kdsSampleData.length, kdsHeaders.length).setValues(kdsSampleData);
  kds.getRange('A3:B10').setHorizontalAlignment('center').setFontWeight('bold');
  kds.getRange('E3:G10').setHorizontalAlignment('center');
  const kdsWidths = [125, 100, 175, 220, 110, 210, 165, 420];
  kdsWidths.forEach(function(w, idx) { kds.setColumnWidth(idx + 1, w); });

  // TAB 7: PHAN_QUYEN
  const pq = sheets['PHAN_QUYEN'];
  pq.clear();
  pq.setTabColor('#7C3AED');
  pq.getRange('A1:G1').merge()
    .setValue('BẢNG PHÂN QUYỀN TÀI KHOẢN NHÂN VIÊN POS & TRUY CẬP HỆ THỐNG (RBAC)')
    .setFontSize(14).setFontWeight('bold').setBackground('#6D28D9').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  pq.setRowHeight(1, 40);

  const pqHeaders = [
    'Tài Khoản (Username)', 'Mật Khẩu', 'Họ Và Tên Nhân Sự',
    'Vai Trò (Role)', 'Khu Vực Phụ Trách', 'Quyền Hạn Thao Tác', 'Trạng Thái'
  ];
  pq.getRange(2, 1, 1, pqHeaders.length).setValues([pqHeaders])
    .setFontWeight('bold').setBackground('#EDE9FE').setFontColor('#4C1D95').setHorizontalAlignment('center');
  pq.setFrozenRows(2);
  pq.getRange('A3:B50').setNumberFormat('@');

  const pqSampleData = [
    ['admin', '123456', 'Nguyễn Minh Tuấn', 'ADMIN', 'ALL', 'Quản lý toàn quyền (Xem doanh thu, Sửa thực đơn, Quản lý Hội viên VIP, Cấu hình VietQR, Phân quyền)', 'Hoạt động'],
    ['thungan_ca1', '123456', 'Lê Thu Trang', 'CASHIER', 'ALL', 'Thu ngân POS (Tính tiền, In hóa đơn K80, Thêm/Đổi hạng Hội viên VIP, Check VietQR)', 'Hoạt động'],
    ['order_tang1', '123456', 'Nguyễn Văn Minh', 'STAFF', 'Tầng 1 — Cafe & Sân Vườn', 'Phục vụ gọi món (Mở bàn, Chọn món, Gửi đơn cho bếp KDS, Nhận món giao bàn)', 'Hoạt động'],
    ['order_bida', '123456', 'Hoàng Văn Bách', 'STAFF', 'Khu Bida & Phòng VIP Tính Giờ', 'Phục vụ khu bida/VIP (Bật giờ chơi bida, Gọi đồ uống, Gửi đơn bếp)', 'Hoạt động'],
    ['bep_truong', '123456', 'Trần Văn Đầu Bếp', 'KITCHEN', 'Bếp & Pha Chế (KDS)', 'Màn hình Bếp KDS (Nhận đơn -> Đang chế biến -> Báo xong món -> Giao phục vụ)', 'Hoạt động']
  ];
  pq.getRange(3, 1, pqSampleData.length, pqHeaders.length).setValues(pqSampleData);
  const pqWidths = [150, 110, 180, 125, 230, 420, 110];
  pqWidths.forEach(function(w, idx) { pq.setColumnWidth(idx + 1, w); });

  // TAB 8: CAU_HINH
  const ch = sheets['CAU_HINH'];
  ch.clear();
  ch.setTabColor('#475569');
  ch.getRange('A1:C1').merge()
    .setValue('CẤU HÌNH THÔNG TIN QUÁN, TÀI KHOẢN VIETQR & CƠ CHẾ PHÂN HẠNG HỘI VIÊN VIP')
    .setFontSize(14).setFontWeight('bold').setBackground('#334155').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  ch.setRowHeight(1, 40);

  const chRows = [
    ['MÃ CẤU HÌNH (KEY)', 'GIÁ TRỊ CẤU HÌNH (VALUE)', 'MÔ TẢ ÁP DỤNG TRÊN WEB APP'],
    ['STORE_NAME', 'NEXSIMPLE F&B RESTAURANT & COFFEE', 'Tên quán in trên đầu Hóa đơn thanh toán K80/A5'],
    ['STORE_ADDRESS', 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM', 'Địa chỉ in trên hóa đơn thanh toán'],
    ['STORE_PHONE', '0974 755 104', 'Số điện thoại hotline in trên hóa đơn'],
    ['STORE_WIFI', 'NexSimple_Coffee / Pass: 88889999', 'Thông tin Wi-Fi in dưới chân bill cho khách'],
    ['BANK_ID', 'MB', 'Mã ngân hàng nhận tiền VietQR (MB, VCB, TCB, ACB, ICB...)'],
    ['BANK_ACCOUNT_NO', '0974755104', 'Số tài khoản ngân hàng nhận tiền chuyển khoản'],
    ['BANK_ACCOUNT_NAME', 'NGUYEN MINH TUAN', 'Tên chủ tài khoản hiển thị trên mã QR Napas 247'],
    ['DISCOUNT_SILVER', '5', 'Tỷ lệ giảm giá cho Hội viên Hạng Bạc (Silver %)'],
    ['DISCOUNT_GOLD', '10', 'Tỷ lệ giảm giá cho Hội viên Hạng Vàng (Gold %)'],
    ['DISCOUNT_PLATINUM', '15', 'Tỷ lệ giảm giá cho Hội viên Hạng Bạch Kim (Platinum %)'],
    ['TIER_SILVER_MIN', '3000000', 'Định mức chi tiêu tích lũy tối thiểu lên Hạng Bạc - Silver (VNĐ)'],
    ['TIER_GOLD_MIN', '8000000', 'Định mức chi tiêu tích lũy tối thiểu lên Hạng Vàng - Gold (VNĐ)'],
    ['TIER_PLATINUM_MIN', '15000000', 'Định mức chi tiêu tích lũy tối thiểu lên Hạng Bạch Kim - Platinum (VNĐ)'],
    ['VIP_TIER_MODE', 'AUTO_AND_MANUAL', 'Cơ chế phân hạng: AUTO_AND_MANUAL (Tự động nâng hạng theo chi tiêu + Cho phép đổi hạng thủ công)'],
    ['PRINT_TEMPLATE_STANDARD', 'HÓA ĐƠN THANH TOÁN (BILL TÍNH TIỀN) - KHỔ K80 / A5', 'Tiêu chuẩn mẫu in']
  ];
  ch.getRange('B3:B20').setNumberFormat('@');
  ch.getRange(2, 1, chRows.length, 3).setValues(chRows);
  ch.getRange('A2:C2').setFontWeight('bold').setBackground('#E2E8F0').setHorizontalAlignment('center');
  ch.getRange('A3:A17').setFontWeight('bold');
  ch.setColumnWidth(1, 230);
  ch.setColumnWidth(2, 420);
  ch.setColumnWidth(3, 440);

  // TAB 9: NHAT_KY
  const nk = sheets['NHAT_KY'];
  nk.clear();
  nk.setTabColor('#DC2626');
  nk.getRange('A1:F1').merge()
    .setValue('NHẬT KÝ THAO TÁC POS, ORDER BẾP, HỘI VIÊN VIP & THANH TOÁN (AUDIT TRAIL)')
    .setFontSize(14).setFontWeight('bold').setBackground('#991B1B').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  nk.setRowHeight(1, 40);

  const nkHeaders = ['Thời Gian', 'Tài Khoản', 'Họ Tên & Vai Trò', 'Loại Thao Tác', 'Mã Bàn / HĐ / VIP', 'Chi Tiết Thao Tác'];
  nk.getRange(2, 1, 1, nkHeaders.length).setValues([nkHeaders])
    .setFontWeight('bold').setBackground('#FEE2E2').setFontColor('#7F1D1D').setHorizontalAlignment('center');
  nk.setFrozenRows(2);
  nk.getRange('A3:A100').setNumberFormat('@');

  const nowInit = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
  const nkSample = [
    [nowInit, 'admin', 'Nguyễn Minh Tuấn (ADMIN)', 'KHỞI TẠO HỆ THỐNG', 'SYS-POS-V33', 'Khởi tạo chuẩn 9 Tab F&B POS v3.3 (Tích hợp Quản lý Hội Viên VIP & Trạng Thái Phiếu Bếp KDS)'],
    ['2026-10-26 10:30:15', 'thungan_ca1', 'Lê Thu Trang (CASHIER)', 'THANH TOÁN HÓA ĐƠN', 'HD-2026-1001', 'Thanh toán Bàn 01 thành công 130,500 ₫ qua VietQR Động. Cộng tích lũy VIP Gold 10%.']
  ];
  nk.getRange(3, 1, nkSample.length, nkHeaders.length).setValues(nkSample);
  const nkWidths = [155, 120, 200, 175, 150, 440];
  nkWidths.forEach(function(w, idx) { nk.setColumnWidth(idx + 1, w); });

  try {
    ss.toast(
      'Đã khởi tạo hoàn tất 9 Tab F&B POS Nhà Hàng, Cafe, Hội Viên VIP & Bếp KDS v3.3 (Commercial Pro)!',
      '✅ Cài Đặt Thành Công',
      6
    );
  } catch (e) {}
}
