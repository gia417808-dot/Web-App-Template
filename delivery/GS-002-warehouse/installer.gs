/**
 * ============================================================================
 * GS-002: WEBAPP QUẢN LÝ NHẬP XUẤT TỒN ĐA KHO (V3.0 COMMERCIAL PRO)
 * BỘ CÀI ĐẶT 6 TAB DOANH NGHIỆP TỰ ĐỘNG (INSTALLER.GS)
 * Archetype: Inventory & Warehousing (Golden Master v2.0)
 * Lưu ý: KHÔNG khai báo onOpen() tại file này để tránh xung đột với Code.gs
 * ============================================================================
 */

function install_WAREHOUSE_SHEET() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Khóa chuẩn Locale en_US và Timezone để triệt tiêu 100% lỗi công thức #ERROR!
  try {
    ss.setSpreadsheetLocale('en_US');
    ss.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh');
    SpreadsheetApp.flush();
  } catch (e) {}

  const tabs = [
    'DASHBOARD',
    'DANH_MUC_HANG',
    'NHAP_XUAT',
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

  // Xóa sheet mặc định nếu có
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính 1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // TAB 1: DASHBOARD (TỔNG QUAN & BÁO CÁO ĐA KHO)
  // --------------------------------------------------------------------------
  const dash = sheets['DASHBOARD'];
  dash.clear();
  dash.setTabColor('#0284C7');
  dash.getRange('A1:H1').merge()
    .setValue('HỆ THỐNG QUẢN TRỊ NHẬP XUẤT TỒN ĐA KHO (V3.0 COMMERCIAL PRO)')
    .setFontSize(15).setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.setRowHeight(1, 46);

  const dashKpiRows = [
    ['CHỈ SỐ VẬN HÀNH KHO (REAL-TIME)', 'GIÁ TRỊ HIỆN TẠI', 'ĐƠN VỊ', 'GHI CHÚ NGHIỆP VỤ'],
    ['Tổng Số Mặt Hàng Quản Lý (SKU)', '=COUNTA(DANH_MUC_HANG!A3:A)', 'SKU', 'Toàn bộ danh mục đang kích hoạt'],
    ['Tổng Số Lượng Tồn Toàn Hệ Thống', '=SUM(DANH_MUC_HANG!K3:K)', 'Đơn vị', 'Cộng dồn Kho HN + Kho SG + Kho Tổng'],
    ['Tổng Giá Trị Tồn Kho (Giá Vốn BQ)', '=SUM(DANH_MUC_HANG!L3:L)', 'VNĐ', 'Tính theo phương pháp Bình quân gia quyền'],
    ['Số Mã Hàng Cảnh Báo Sắp Hết / Hết Hàng', '=COUNTIF(DANH_MUC_HANG!N3:N, "Sắp hết hàng") + COUNTIF(DANH_MUC_HANG!N3:N, "Hết hàng")', 'SKU', 'Chạm hoặc dưới định mức tồn tối thiểu (Min)'],
    ['Tổng Giá Trị Nhập Kho Lũy Kế', '=SUMIF(NHAP_XUAT!C3:C, "Nhập kho", NHAP_XUAT!I3:I)', 'VNĐ', 'Tổng tiền hàng nhập từ Nhà cung cấp'],
    ['Tổng Giá Trị Xuất Kho Lũy Kế', '=SUMIF(NHAP_XUAT!C3:C, "Xuất kho", NHAP_XUAT!I3:I)', 'VNĐ', 'Tổng giá trị xuất bán / xuất sử dụng'],
    ['Tổng Lệnh Điều Chuyển Nội Bộ', '=COUNTIF(NHAP_XUAT!C3:C, "Điều chuyển")', 'Phiếu', 'Luân chuyển cân đối giữa các chi nhánh']
  ];
  dash.getRange(3, 1, dashKpiRows.length, 4).setValues(dashKpiRows);
  dash.getRange('A3:D3').setFontWeight('bold').setBackground('#0284C7').setFontColor('#FFFFFF').setHorizontalAlignment('center');
  dash.getRange('A4:A10').setFontWeight('bold');
  dash.getRange('B4:B10').setHorizontalAlignment('right').setFontWeight('bold');
  dash.getRange('C4:C10').setHorizontalAlignment('center');
  dash.getRange('B6').setNumberFormat('#,##0 "₫"');
  dash.getRange('B8:B9').setNumberFormat('#,##0 "₫"');

  // Bảng phân tích theo từng kho chi nhánh trên Dashboard
  const branchRows = [
    ['PHÂN TÍCH TỒN KHO THEO CHI NHÁNH', 'TỔNG SỐ LƯỢNG TỒN', 'GIÁ TRỊ TỒN KHO (ƯỚC TÍNH)', 'PHụ TRÁCH KHO'],
    ['Kho Hà Nội (Chi nhánh Miền Bắc)', '=SUM(DANH_MUC_HANG!H3:H)', '=SUMPRODUCT(DANH_MUC_HANG!E3:E50, DANH_MUC_HANG!H3:H50)', 'Trần Đình Trọng (thukho_hn)'],
    ['Kho Sài Gòn (Chi nhánh Miền Nam)', '=SUM(DANH_MUC_HANG!I3:I)', '=SUMPRODUCT(DANH_MUC_HANG!E3:E50, DANH_MUC_HANG!I3:I50)', 'Lê Hoàng Nam (thukho_sg)'],
    ['Kho Tổng (Hub Phân Phối Trung Tâm)', '=SUM(DANH_MUC_HANG!J3:J)', '=SUMPRODUCT(DANH_MUC_HANG!E3:E50, DANH_MUC_HANG!J3:J50)', 'Nguyễn Minh Tuấn (admin)']
  ];
  dash.getRange(12, 1, branchRows.length, 4).setValues(branchRows);
  dash.getRange('A12:D12').setFontWeight('bold').setBackground('#059669').setFontColor('#FFFFFF').setHorizontalAlignment('center');
  dash.getRange('A13:A15').setFontWeight('bold');
  dash.getRange('B13:C15').setHorizontalAlignment('right');
  dash.getRange('C13:C15').setNumberFormat('#,##0 "₫"');

  dash.setColumnWidth(1, 310);
  dash.setColumnWidth(2, 190);
  dash.setColumnWidth(3, 210);
  dash.setColumnWidth(4, 290);

  // --------------------------------------------------------------------------
  // TAB 2: DANH_MUC_HANG (DANH MỤC SKU, GIÁ VỐN BQ & TỒN ĐA KHO)
  // --------------------------------------------------------------------------
  const dm = sheets['DANH_MUC_HANG'];
  dm.clear();
  dm.setTabColor('#059669');
  dm.getRange('A1:N1').merge()
    .setValue('DANH MỤC HÀNG HÓA, GIÁ VỐN BÌNH QUÂN & TỒN KHO ĐA CHI NHÁNH')
    .setFontSize(14).setFontWeight('bold').setBackground('#059669').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dm.setRowHeight(1, 40);

  const dmHeaders = [
    'Mã SKU', 'Tên Hàng Hóa / Quy Cách', 'Danh Mục', 'ĐVT',
    'Giá Vốn BQ', 'Giá Bán Lẻ', 'Tồn Đầu Kỳ',
    'Tồn Kho HN', 'Tồn Kho SG', 'Tồn Kho Tổng',
    'Tổng Tồn Cuối', 'Giá Trị Tồn Kho', 'Định Mức Min', 'Trạng Thái Tồn'
  ];
  dm.getRange(2, 1, 1, dmHeaders.length).setValues([dmHeaders])
    .setFontWeight('bold').setBackground('#D1FAE5').setFontColor('#065F46').setHorizontalAlignment('center');
  dm.setFrozenRows(2);

  const dmSampleData = [
    ['SKU-CAM-FX3', 'Sony FX3 Cinema Line Full-Frame Body', 'Thiết bị ghi hình', 'Chiếc', 72000000, 85000000, 9, 4, 3, 5, '=H3+I3+J3', '=E3*K3', 4, '=IF(K3<=0, "Hết hàng", IF(K3<=M3, "Sắp hết hàng", "An toàn"))'],
    ['SKU-LEN-2470', 'Ống kính Sony FE 24-70mm f/2.8 GM II', 'Ống kính', 'Chiếc', 38000000, 46000000, 10, 2, 4, 6, '=H4+I4+J4', '=E4*K4', 4, '=IF(K4<=0, "Hết hàng", IF(K4<=M4, "Sắp hết hàng", "An toàn"))'],
    ['SKU-DRO-M3C', 'Flycam DJI Mavic 3 Cine Premium Combo', 'Flycam & Drone', 'Bộ', 85000000, 99000000, 4, 1, 1, 0, '=H5+I5+J5', '=E5*K5', 3, '=IF(K5<=0, "Hết hàng", IF(K5<=M5, "Sắp hết hàng", "An toàn"))'],
    ['SKU-LGT-600D', 'Đèn Aputure Light Storm LS 600d Pro', 'Ánh sáng Studio', 'Bộ', 42000000, 49500000, 15, 5, 4, 8, '=H6+I6+J6', '=E6*K6', 5, '=IF(K6<=0, "Hết hàng", IF(K6<=M6, "Sắp hết hàng", "An toàn"))'],
    ['SKU-MIC-EWDP', 'Micro Sennheiser EW-DP ME 2 Digital', 'Thiết bị âm thanh', 'Bộ', 14500000, 18000000, 20, 6, 8, 10, '=H7+I7+J7', '=E7*K7', 6, '=IF(K7<=0, "Hết hàng", IF(K7<=M7, "Sắp hết hàng", "An toàn"))'],
    ['SKU-GIM-RS3P', 'Gimbal Chống Rung DJI RS 3 Pro Combo', 'Phụ kiện Grip', 'Chiếc', 18000000, 22500000, 5, 1, 1, 1, '=H8+I8+J8', '=E8*K8', 4, '=IF(K8<=0, "Hết hàng", IF(K8<=M8, "Sắp hết hàng", "An toàn"))'],
    ['SKU-MON-AT5', 'Màn hình Atomos Ninja V+ 5.2" 8K HDR', 'Thiết bị ghi hình', 'Chiếc', 19500000, 24000000, 8, 3, 2, 4, '=H9+I9+J9', '=E9*K9', 3, '=IF(K9<=0, "Hết hàng", IF(K9<=M9, "Sắp hết hàng", "An toàn"))'],
    ['SKU-BAT-V150', 'Pin V-Mount SmallRig VB155 Mini 155Wh', 'Phụ kiện Nguồn', 'Viên', 6200000, 7900000, 18, 0, 0, 0, '=H10+I10+J10', '=E10*K10', 5, '=IF(K10<=0, "Hết hàng", IF(K10<=M10, "Sắp hết hàng", "An toàn"))']
  ];
  dm.getRange(3, 1, dmSampleData.length, dmHeaders.length).setValues(dmSampleData);
  dm.getRange('E3:F10').setNumberFormat('#,##0 "₫"');
  dm.getRange('L3:L10').setNumberFormat('#,##0 "₫"');
  dm.getRange('G3:K10').setHorizontalAlignment('center');
  dm.getRange('M3:N10').setHorizontalAlignment('center');

  const dmWidths = [120, 260, 145, 75, 125, 125, 95, 95, 95, 100, 105, 140, 95, 130];
  dmWidths.forEach(function(w, idx) { dm.setColumnWidth(idx + 1, w); });

  // --------------------------------------------------------------------------
  // TAB 3: NHAP_XUAT (SỔ CHỨNG TỪ NHẬP - XUẤT - ĐIỀU CHUYỂN & ĐỐI TÁC)
  // --------------------------------------------------------------------------
  const nx = sheets['NHAP_XUAT'];
  nx.clear();
  nx.setTabColor('#F59E0B');
  nx.getRange('A1:N1').merge()
    .setValue('SỔ CHỨNG TỪ NHẬP KHO - XUẤT KHO - ĐIỀU CHUYỂN & LỊCH SỬ ĐỐI TÁC')
    .setFontSize(14).setFontWeight('bold').setBackground('#D97706').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  nx.setRowHeight(1, 40);

  const nxHeaders = [
    'Mã Phiếu', 'Ngày Giao Dịch', 'Loại Phiếu', 'Mã SKU', 'Tên Hàng Hóa',
    'ĐVT', 'Số Lượng', 'Đơn Giá', 'Thành Tiền',
    'Từ Kho / Nguồn', 'Đến Kho / Đích', 'Đối Tác (NCC / Khách Hàng)',
    'Người Lập Phiếu', 'Ghi Chú Chứng Từ'
  ];
  nx.getRange(2, 1, 1, nxHeaders.length).setValues([nxHeaders])
    .setFontWeight('bold').setBackground('#FEF3C7').setFontColor('#92400E').setHorizontalAlignment('center');
  nx.setFrozenRows(2);

  const nxSampleData = [
    ['PNK-2026-1001', '2026-10-01 09:00', 'Nhập kho', 'SKU-CAM-FX3', 'Sony FX3 Cinema Line Full-Frame Body', 'Chiếc', 5, 72000000, 360000000, 'Nhà cung cấp ngoài', 'Kho Hà Nội', 'Công ty TNHH Sony Electronics VN', 'Trần Đình Trọng', 'Nhập lô máy quay chính hãng CO/CQ đợt 1'],
    ['PNK-2026-1002', '2026-10-03 10:20', 'Nhập kho', 'SKU-LEN-2470', 'Ống kính Sony FE 24-70mm f/2.8 GM II', 'Chiếc', 4, 38000000, 152000000, 'Nhà cung cấp ngoài', 'Kho Sài Gòn', 'Công ty TNHH Sony Electronics VN', 'Lê Hoàng Nam', 'Nhập bổ sung ống kính GM II cho chi nhánh Nam'],
    ['PXK-2026-1005', '2026-10-05 14:15', 'Xuất kho', 'SKU-CAM-FX3', 'Sony FX3 Cinema Line Full-Frame Body', 'Chiếc', 2, 85000000, 170000000, 'Kho Hà Nội', 'Giao khách hàng', 'Đài Truyền Hình Kỹ Thuật Số VTC', 'Trần Đình Trọng', 'Xuất bán theo Hợp đồng kinh tế số 88/HĐKT'],
    ['PDC-2026-1007', '2026-10-07 11:30', 'Điều chuyển', 'SKU-LGT-600D', 'Đèn Aputure Light Storm LS 600d Pro', 'Bộ', 3, 42000000, 126000000, 'Kho Tổng', 'Kho Hà Nội', 'Điều chuyển nội bộ hệ thống', 'Nguyễn Minh Tuấn', 'Luân chuyển thiết bị ánh sáng tăng cường miền Bắc'],
    ['PNK-2026-1009', '2026-10-09 08:45', 'Nhập kho', 'SKU-MIC-EWDP', 'Micro Sennheiser EW-DP ME 2 Digital', 'Bộ', 6, 14500000, 87000000, 'Nhà cung cấp ngoài', 'Kho Tổng', 'Nhà Phân Phối Âm Thanh Hoàng Bảo Khoa', 'Hoàng Thu Trang', 'Nhập kho tổng phân phối toàn quốc'],
    ['PXK-2026-1011', '2026-10-11 16:00', 'Xuất kho', 'SKU-DRO-M3C', 'Flycam DJI Mavic 3 Cine Premium Combo', 'Bộ', 2, 99000000, 198000000, 'Kho Sài Gòn', 'Giao khách hàng', 'Production House RedPixel Studio', 'Lê Hoàng Nam', 'Xuất bán trọn bộ kèm gói bảo hành DJI Care'],
    ['PXK-2026-1013', '2026-10-13 15:10', 'Xuất kho', 'SKU-LEN-2470', 'Ống kính Sony FE 24-70mm f/2.8 GM II', 'Chiếc', 2, 46000000, 92000000, 'Kho Sài Gòn', 'Giao khách hàng', 'Production House RedPixel Studio', 'Lê Hoàng Nam', 'Xuất kèm đơn hàng Flycam RedPixel'],
    ['PNK-2026-1015', '2026-10-15 09:30', 'Nhập kho', 'SKU-MON-AT5', 'Màn hình Atomos Ninja V+ 5.2" 8K HDR', 'Chiếc', 3, 19500000, 58500000, 'Nhà cung cấp ngoài', 'Kho Hà Nội', 'Công ty Cổ phần Thiết Bị Phim Trường Việt', 'Trần Đình Trọng', 'Nhập màn hình monitor 8K phục vụ dự án Q4']
  ];
  nx.getRange(3, 1, nxSampleData.length, nxHeaders.length).setValues(nxSampleData);
  nx.getRange('H3:I10').setNumberFormat('#,##0 "₫"');
  nx.getRange('F3:G10').setHorizontalAlignment('center');

  const nxWidths = [135, 135, 110, 115, 240, 70, 85, 120, 130, 145, 145, 230, 140, 260];
  nxWidths.forEach(function(w, idx) { nx.setColumnWidth(idx + 1, w); });

  // --------------------------------------------------------------------------
  // TAB 4: PHAN_QUYEN (QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN THEO KHO)
  // --------------------------------------------------------------------------
  const pq = sheets['PHAN_QUYEN'];
  pq.clear();
  pq.setTabColor('#7C3AED');
  pq.getRange('A1:G1').merge()
    .setValue('BẢNG PHÂN QUYỀN TÀI KHOẢN & GIỚI HẠN TRUY CẬP KHO CHI NHÁNH (RBAC)')
    .setFontSize(14).setFontWeight('bold').setBackground('#6D28D9').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  pq.setRowHeight(1, 40);

  const pqHeaders = [
    'Tài Khoản (Username)', 'Mật Khẩu', 'Họ Và Tên Nhân Sự',
    'Vai Trò (Role)', 'Kho Phụ Trách', 'Quyền Thao Tác Chi Tiết', 'Trạng Thái'
  ];
  pq.getRange(2, 1, 1, pqHeaders.length).setValues([pqHeaders])
    .setFontWeight('bold').setBackground('#EDE9FE').setFontColor('#4C1D95').setHorizontalAlignment('center');
  pq.setFrozenRows(2);

  const pqSampleData = [
    ['admin', '123456', 'Nguyễn Minh Tuấn', 'ADMIN', 'ALL', 'Toàn quyền hệ thống (Xem tất cả kho, Nhập/Xuất/Chuyển, Hủy phiếu, Cấu hình)', 'Hoạt động'],
    ['ketoan', '123456', 'Hoàng Thu Trang', 'ACCOUNTANT', 'ALL', 'Kế toán kho (Xem tất cả kho, Lập phiếu, Xem giá vốn, Xuất báo cáo N-X-T)', 'Hoạt động'],
    ['thukho_hn', '123456', 'Trần Đình Trọng', 'KEEPER', 'Kho Hà Nội', 'Thủ kho chi nhánh (Chỉ xem & lập phiếu Nhập/Xuất tại Kho Hà Nội)', 'Hoạt động'],
    ['thukho_sg', '123456', 'Lê Hoàng Nam', 'KEEPER', 'Kho Sài Gòn', 'Thủ kho chi nhánh (Chỉ xem & lập phiếu Nhập/Xuất tại Kho Sài Gòn)', 'Hoạt động']
  ];
  pq.getRange(3, 1, pqSampleData.length, pqHeaders.length).setValues(pqSampleData);
  const pqWidths = [150, 110, 180, 120, 140, 420, 110];
  pqWidths.forEach(function(w, idx) { pq.setColumnWidth(idx + 1, w); });

  // --------------------------------------------------------------------------
  // TAB 5: CAU_HINH (THÔNG TIN DOANH NGHIỆP, PHƯƠNG PHÁP GIÁ VỐN & MẪU IN)
  // --------------------------------------------------------------------------
  const ch = sheets['CAU_HINH'];
  ch.clear();
  ch.setTabColor('#475569');
  ch.getRange('A1:C1').merge()
    .setValue('CẤU HÌNH THÔNG TIN DOANH NGHIỆP, PHƯƠNG PHÁP GIÁ VỐN & BIỂU MẪU IN')
    .setFontSize(14).setFontWeight('bold').setBackground('#334155').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  ch.setRowHeight(1, 40);

  const chRows = [
    ['MÃ CẤU HÌNH (KEY)', 'GIÁ TRỊ CẤU HÌNH (VALUE)', 'MÔ TẢ ÁP DỤNG TRÊN WEB APP'],
    ['COMPANY_NAME', 'CÔNG TY TNHH CÔNG NGHỆ & THIẾT BỊ NEXSIMPLE VIỆT NAM', 'Hiển thị trên Quốc hiệu / Tiêu đề trái của Phiếu Nhập - Xuất Kho'],
    ['COMPANY_ADDRESS', 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM', 'Địa chỉ in trên tiêu đề Phiếu Nhập - Xuất Kho & Báo cáo N-X-T'],
    ['COMPANY_PHONE', '0974 755 104', 'Số điện thoại hotline hiển thị trên chứng từ in'],
    ['COMPANY_TAX', '0318899221', 'Mã số thuế doanh nghiệp in trên biểu mẫu kế toán'],
    ['COSTING_METHOD', 'WEIGHTED_AVERAGE', 'Phương pháp tính giá vốn: WEIGHTED_AVERAGE (Bình quân liên hoàn) | PERIODIC (Bình quân cả kỳ)'],
    ['ALLOW_NEGATIVE_STOCK', 'FALSE', 'FALSE = Chặn xuất quá số tồn kho thực tế | TRUE = Cho phép xuất âm kho'],
    ['PRINT_TEMPLATE_STANDARD', 'Mẫu số 01-VT / 02-VT (Ban hành theo Thông tư 200/2014/TT-BTC Bộ Tài Chính)', 'Tiêu chuẩn pháp lý in ở góc phải trên cùng của Phiếu Nhập/Xuất']
  ];
  ch.getRange(2, 1, chRows.length, 3).setValues(chRows);
  ch.getRange('A2:C2').setFontWeight('bold').setBackground('#E2E8F0').setHorizontalAlignment('center');
  ch.getRange('A3:A9').setFontWeight('bold');
  ch.setColumnWidth(1, 220);
  ch.setColumnWidth(2, 440);
  ch.setColumnWidth(3, 380);

  // --------------------------------------------------------------------------
  // TAB 6: NHAT_KY (AUDIT LOG GHI VẾT THAO TÁC HỆ THỐNG)
  // --------------------------------------------------------------------------
  const nk = sheets['NHAT_KY'];
  nk.clear();
  nk.setTabColor('#DC2626');
  nk.getRange('A1:F1').merge()
    .setValue('NHẬT KÝ THAO TÁC HỆ THỐNG & KIỂM SOÁT NỘI BỘ (AUDIT TRAIL)')
    .setFontSize(14).setFontWeight('bold').setBackground('#991B1B').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  nk.setRowHeight(1, 40);

  const nkHeaders = ['Thời Gian', 'Tài Khoản', 'Họ Tên & Vai Trò', 'Loại Thao Tác', 'Mã Tham Chiếu', 'Chi Tiết Thay Đổi'];
  nk.getRange(2, 1, 1, nkHeaders.length).setValues([nkHeaders])
    .setFontWeight('bold').setBackground('#FEE2E2').setFontColor('#7F1D1D').setHorizontalAlignment('center');
  nk.setFrozenRows(2);

  const nowInit = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
  const nkSample = [
    [nowInit, 'admin', 'Nguyễn Minh Tuấn (ADMIN)', 'KHỞI TẠO HỆ THỐNG', 'SYS-INIT-V30', 'Khởi tạo chuẩn 6 Tab Commercial Pro v2.0 thành công'],
    ['2026-10-15 09:30:12', 'thukho_hn', 'Trần Đình Trọng (KEEPER)', 'LẬP PHIẾU NHẬP', 'PNK-2026-1015', 'Nhập 3 Chiếc SKU-MON-AT5 vào Kho Hà Nội, cập nhật giá vốn bình quân']
  ];
  nk.getRange(3, 1, nkSample.length, nkHeaders.length).setValues(nkSample);
  const nkWidths = [155, 120, 200, 150, 140, 440];
  nkWidths.forEach(function(w, idx) { nk.setColumnWidth(idx + 1, w); });

  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Đã khởi tạo hoàn tất 6 Tab Quản Lý Nhập Xuất Tồn Đa Kho v3.0 (Commercial Pro)!',
    '✅ Cài Đặt Thành Công',
    6
  );
}
