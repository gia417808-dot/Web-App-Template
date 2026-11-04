# BỘ 4-FILE GOLDEN MASTER (BẢO MẬT CỔNG ĐĂNG NHẬP BẮT BUỘC): GS-002 — QUẢN LÝ NHẬP XUẤT TỒN ĐA KHO (V3.0 COMMERCIAL PRO)

Bản cập nhật này đã khóa **Cổng Đăng Nhập Bắt Buộc (`#authGateScreen`)**:
1. **Chặn 100% truy cập thẳng vào dữ liệu:** Khi mở link Web App hoặc mở Modal từ Google Sheets, toàn bộ giao diện và số liệu kho bị ẩn hoàn toàn (`d-none`). Người dùng **bắt buộc phải nhập đúng `Username` + `Mật khẩu`** đang có trong tab `PHAN_QUYEN` (kể cả tài khoản `test` bạn vừa tạo mới) mới vào được bên trong.
2. **Loại bỏ thanh đổi vai trò tự do:** Không ai có thể tự ý chuyển quyền trên thanh công cụ nữa. Khi bấm **Đăng Xuất**, hệ thống lập tức khóa màn hình quay về cổng đăng nhập.
3. **Phân quyền nghiêm ngặt sau khi đăng nhập:**
   - Tài khoản `ADMIN` (ví dụ `admin`): Thấy toàn bộ các kho + mục **Tài Khoản & Phân Quyền**, **Cấu Hình** và nút **+ Tạo TK**.
   - Tài khoản `KEEPER` (ví dụ `thukho_hn`, `thukho_sg`, `test`): Bị ẩn hoàn toàn mục Quản lý tài khoản/Cấu hình và bị khóa cứng chỉ được xem & thao tác trên đúng kho chi nhánh được giao.

## 1. File 1: `appsscript.json`

```json
{
  "timeZone": "Asia/Ho_Chi_Minh",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE"
  }
}
```

## 2. File 2: `installer.gs`

```javascript
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
```

## 3. File 3: `Code.gs`

```javascript
/**
 * ============================================================================
 * GS-002: WEBAPP QUẢN LÝ NHẬP XUẤT TỒN ĐA KHO (V3.0 COMMERCIAL PRO - PATCHED)
 * BACKEND CONTROLLER, RBAC AUTH, USER MANAGEMENT, COSTING & AUDIT API (CODE.GS)
 * Archetype: Inventory & Warehousing (Golden Master v2.1)
 * ============================================================================
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Quản Lý Nhập Xuất Tồn Đa Kho v3.0 Pro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📦 QUẢN LÝ KHO ĐA KHO PRO (v3.0)')
    .addItem('⚡ 1. Khởi tạo / Làm mới 6 Tab Chuẩn Thương Mại', 'install_WAREHOUSE_SHEET')
    .addSeparator()
    .addItem('🌐 2. Mở Web App Quản Trị Kho (Full Screen Modal)', 'openWarehouseDialog')
    .addToUi();
}

function openWarehouseDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1380)
    .setHeight(850)
    .setTitle('Hệ Thống Quản Lý Nhập Xuất Tồn Đa Kho v3.0 (Commercial Pro)');
  SpreadsheetApp.getUi().showModalDialog(html, '📦 Web App Quản Lý Nhập Xuất Tồn Đa Kho v3.0');
}

/**
 * Đọc toàn bộ dữ liệu hệ thống 6 Tab bằng getDisplayValues() (100% an toàn Date & Locale)
 */
function getWarehouseData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dmSheet = ss.getSheetByName('DANH_MUC_HANG');
    const nxSheet = ss.getSheetByName('NHAP_XUAT');
    const pqSheet = ss.getSheetByName('PHAN_QUYEN');
    const chSheet = ss.getSheetByName('CAU_HINH');
    const nkSheet = ss.getSheetByName('NHAT_KY');

    if (!dmSheet || !nxSheet) {
      return getFallbackWarehouseData();
    }

    // 1. Đọc cấu hình doanh nghiệp
    const settings = {
      COMPANY_NAME: 'CÔNG TY TNHH CÔNG NGHỆ & THIẾT BỊ NEXSIMPLE VIỆT NAM',
      COMPANY_ADDRESS: 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM',
      COMPANY_PHONE: '0974 755 104',
      COMPANY_TAX: '0318899221',
      COSTING_METHOD: 'WEIGHTED_AVERAGE',
      ALLOW_NEGATIVE_STOCK: 'FALSE',
      PRINT_TEMPLATE_STANDARD: 'Mẫu số 01-VT / 02-VT (Ban hành theo Thông tư 200/2014/TT-BTC Bộ Tài Chính)'
    };
    if (chSheet) {
      const chVals = chSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < chVals.length; i++) {
        const k = (chVals[i][0] || '').trim();
        const v = (chVals[i][1] || '').trim();
        if (k) settings[k] = v;
      }
    }

    // 2. Đọc danh sách tài khoản phân quyền
    const users = [];
    if (pqSheet) {
      const pqVals = pqSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < pqVals.length; i++) {
        const r = pqVals[i];
        if (!r[0] || !r[0].trim()) continue;
        users.push({
          username: r[0].trim(),
          password: r[1].trim() || '123456',
          fullName: r[2].trim() || r[0].trim(),
          role: r[3].trim() || 'KEEPER',
          assignedWarehouse: r[4].trim() || 'ALL',
          permissionsDesc: r[5] || '',
          status: r[6] || 'Hoạt động'
        });
      }
    }

    // 3. Đọc danh mục hàng hóa & tồn đa kho
    const dmValues = dmSheet.getDataRange().getDisplayValues();
    const items = [];
    if (dmValues.length > 2) {
      for (let i = 2; i < dmValues.length; i++) {
        const row = dmValues[i];
        if (!row[0] || row[0].trim() === '') continue;
        // Hỗ trợ tương thích cả bảng 12 cột cũ và bảng 14 cột mới
        const is14 = row.length >= 14;
        const costPrice = parseCurrency(row[4]);
        const sellingPrice = parseCurrency(row[5]);
        const openingStock = is14 ? (parseInt(parseCurrency(row[6]), 10) || 0) : 0;
        const stockHn = parseInt(parseCurrency(is14 ? row[7] : row[6]), 10) || 0;
        const stockSg = parseInt(parseCurrency(is14 ? row[8] : row[7]), 10) || 0;
        const stockTong = parseInt(parseCurrency(is14 ? row[9] : row[8]), 10) || 0;
        const totalStock = stockHn + stockSg + stockTong;
        const minLimit = parseInt(parseCurrency(is14 ? row[12] : row[10]), 10) || 0;

        let alertStatus = 'An toàn';
        if (totalStock <= 0) alertStatus = 'Hết hàng';
        else if (totalStock <= minLimit) alertStatus = 'Sắp hết hàng';

        items.push({
          sku: row[0].trim(),
          name: row[1].trim(),
          category: row[2].trim() || 'Chưa phân loại',
          unit: row[3].trim() || 'Chiếc',
          costPrice: costPrice,
          sellingPrice: sellingPrice,
          openingStock: openingStock || totalStock,
          stock_hanoi: stockHn,
          stock_saigon: stockSg,
          stock_tong: stockTong,
          totalStock: totalStock,
          inventoryValue: totalStock * costPrice,
          minLimit: minLimit,
          alertStatus: alertStatus
        });
      }
    }

    // 4. Đọc sổ chứng từ Nhập - Xuất - Điều chuyển
    const nxValues = nxSheet.getDataRange().getDisplayValues();
    const logs = [];
    if (nxValues.length > 2) {
      for (let i = 2; i < nxValues.length; i++) {
        const row = nxValues[i];
        if (!row[0] || row[0].trim() === '') continue;
        const is14Cols = row.length >= 14;
        const qty = parseInt(parseCurrency(is14Cols ? row[6] : row[5]), 10) || 0;
        const unitPrice = parseCurrency(is14Cols ? row[7] : row[6]);
        const totalVal = parseCurrency(is14Cols ? row[8] : row[7]) || (qty * unitPrice);

        logs.push({
          code: row[0].trim(),
          timestamp: row[1].trim(),
          type: row[2].trim(),
          sku: row[3].trim(),
          name: row[4].trim(),
          unit: is14Cols ? (row[5] || 'Chiếc') : 'Chiếc',
          quantity: qty,
          unitPrice: unitPrice,
          totalVal: totalVal,
          fromWarehouse: is14Cols ? row[9] : row[8],
          toWarehouse: is14Cols ? row[10] : row[9],
          partner: is14Cols ? (row[11] || 'Khách lẻ / Nội bộ') : 'Đối tác hệ thống',
          createdBy: is14Cols ? row[12] : row[10],
          notes: is14Cols ? (row[13] || '') : (row[11] || '')
        });
      }
    }

    // 5. Đọc nhật ký hệ thống (Audit Log)
    const auditLogs = [];
    if (nkSheet) {
      const nkVals = nkSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < nkVals.length; i++) {
        const r = nkVals[i];
        if (!r[0] || !r[0].trim()) continue;
        auditLogs.push({
          timestamp: r[0],
          username: r[1],
          actorName: r[2],
          action: r[3],
          refCode: r[4],
          detail: r[5]
        });
      }
    }

    return buildWarehouseResponse(items, logs, settings, users, auditLogs.reverse(), false);
  } catch (err) {
    return getFallbackWarehouseData();
  }
}

function buildWarehouseResponse(items, logs, settings, users, auditLogs, isFallback) {
  let totalCostVal = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalHn = 0;
  let totalSg = 0;
  let totalTong = 0;

  items.forEach(function(it) {
    totalCostVal += it.totalStock * it.costPrice;
    if (it.alertStatus === 'Sắp hết hàng') lowStockCount++;
    if (it.alertStatus === 'Hết hàng') outOfStockCount++;
    totalHn += it.stock_hanoi;
    totalSg += it.stock_saigon;
    totalTong += it.stock_tong;
  });

  return {
    success: true,
    isFallback: isFallback,
    settings: settings,
    users: users,
    items: items,
    logs: logs,
    auditLogs: auditLogs,
    kpi: {
      totalSku: items.length,
      totalCostVal: totalCostVal,
      lowStockCount: lowStockCount,
      outOfStockCount: outOfStockCount,
      totalHn: totalHn,
      totalSg: totalSg,
      totalTong: totalTong
    }
  };
}

/**
 * Tạo mới hoặc Cập nhật Tài Khoản Người Dùng trong tab PHAN_QUYEN
 */
function saveUserAccount(payload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let pqSheet = ss.getSheetByName('PHAN_QUYEN');
    if (!pqSheet) {
      install_WAREHOUSE_SHEET();
      pqSheet = ss.getSheetByName('PHAN_QUYEN');
    }

    const uname = String(payload.username || '').trim().toLowerCase();
    const pass = String(payload.password || '123456').trim();
    const fullName = String(payload.fullName || '').trim();
    const role = String(payload.role || 'KEEPER').trim();
    const assignedWh = (role === 'ADMIN' || role === 'ACCOUNTANT') ? 'ALL' : String(payload.assignedWarehouse || 'Kho Hà Nội').trim();
    const status = String(payload.status || 'Hoạt động').trim();

    if (!uname || !fullName) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Tên đăng nhập và Họ tên nhân sự!' };
    }

    let permDesc = 'Thủ kho chi nhánh (Chỉ xem & lập phiếu Nhập/Xuất tại ' + assignedWh + ')';
    if (role === 'ADMIN') permDesc = 'Toàn quyền hệ thống (Xem tất cả kho, Nhập/Xuất/Chuyển, Quản lý tài khoản, Cấu hình)';
    else if (role === 'ACCOUNTANT') permDesc = 'Kế toán kho (Xem tất cả kho, Lập phiếu, Xem giá vốn, Xuất báo cáo N-X-T)';

    const vals = pqSheet.getDataRange().getValues();
    let existingRow = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toLowerCase() === uname) {
        existingRow = i + 1;
        break;
      }
    }

    if (existingRow > 0) {
      pqSheet.getRange(existingRow, 2, 1, 6).setValues([[
        pass, fullName, role, assignedWh, permDesc, status
      ]]);
      writeAuditLog(ss, payload.actorUsername || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT TÀI KHOẢN', uname, 'Cập nhật tài khoản ' + uname + ' (' + role + ' - ' + assignedWh + ')');
      return { success: true, message: 'Đã cập nhật tài khoản [' + uname + '] thành công!' };
    } else {
      pqSheet.appendRow([uname, pass, fullName, role, assignedWh, permDesc, status]);
      writeAuditLog(ss, payload.actorUsername || 'admin', payload.actorName || 'Admin', 'TẠO TÀI KHOẢN MỚI', uname, 'Tạo mới tài khoản ' + uname + ' (' + fullName + ' - ' + role + ')');
      return { success: true, message: 'Đã tạo tài khoản mới [' + uname + '] thành công!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu tài khoản: ' + err.toString() };
  }
}

/**
 * Xóa tài khoản người dùng (Không cho phép xóa tài khoản admin gốc)
 */
function deleteUserAccount(targetUsername, actorName) {
  try {
    const uname = String(targetUsername || '').trim().toLowerCase();
    if (uname === 'admin') {
      return { success: false, message: 'Không thể xóa tài khoản Quản trị viên gốc (admin)!' };
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const pqSheet = ss.getSheetByName('PHAN_QUYEN');
    if (!pqSheet) return { success: false, message: 'Chưa có tab PHAN_QUYEN!' };

    const vals = pqSheet.getDataRange().getValues();
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toLowerCase() === uname) {
        pqSheet.deleteRow(i + 1);
        writeAuditLog(ss, 'admin', actorName || 'Admin', 'XÓA TÀI KHOẢN', uname, 'Đã xóa tài khoản ' + uname);
        return { success: true, message: 'Đã xóa tài khoản [' + uname + ']!' };
      }
    }
    return { success: false, message: 'Không tìm thấy tài khoản ' + uname };
  } catch (err) {
    return { success: false, message: 'Lỗi xóa tài khoản: ' + err.toString() };
  }
}

/**
 * Thêm mới hoặc Cập nhật Mã hàng hóa (SKU) trực tiếp từ Web App (Hỗ trợ cả sheet 12 cột cũ và 14 cột mới)
 */
function saveSkuMasterItem(payload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let dmSheet = ss.getSheetByName('DANH_MUC_HANG');
    if (!dmSheet) {
      install_WAREHOUSE_SHEET();
      dmSheet = ss.getSheetByName('DANH_MUC_HANG');
    }

    const sku = String(payload.sku || '').trim().toUpperCase();
    const name = String(payload.name || '').trim();
    if (!sku || !name) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Mã SKU và Tên hàng hóa!' };
    }

    const vals = dmSheet.getDataRange().getValues();
    const headerCols = vals.length >= 2 ? vals[1].length : 14;
    const is14Cols = headerCols >= 14;

    let existingRow = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === sku) {
        existingRow = i + 1;
        break;
      }
    }

    const cat = String(payload.category || 'Thiết bị').trim();
    const unit = String(payload.unit || 'Chiếc').trim();
    const cost = Number(payload.costPrice) || 0;
    const sell = Number(payload.sellingPrice) || 0;
    const minLim = parseInt(payload.minLimit, 10) || 3;
    const sHn = parseInt(payload.stock_hanoi, 10) || 0;
    const sSg = parseInt(payload.stock_saigon, 10) || 0;
    const sTong = parseInt(payload.stock_tong, 10) || 0;
    const openQty = sHn + sSg + sTong;

    if (existingRow > 0) {
      if (is14Cols) {
        dmSheet.getRange(existingRow, 2, 1, 9).setValues([[
          name, cat, unit, cost, sell, openQty, sHn, sSg, sTong
        ]]);
        dmSheet.getRange(existingRow, 13).setValue(minLim);
      } else {
        dmSheet.getRange(existingRow, 2, 1, 8).setValues([[
          name, cat, unit, cost, sell, sHn, sSg, sTong
        ]]);
        dmSheet.getRange(existingRow, 11).setValue(minLim);
      }
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT MÃ HÀNG', sku, 'Cập nhật SKU ' + sku + ' (' + name + ')');
      return { success: true, message: 'Đã cập nhật mã hàng [' + sku + '] thành công!' };
    } else {
      const nextRow = dmSheet.getLastRow() + 1;
      if (is14Cols) {
        const newRow14 = [
          sku, name, cat, unit, cost, sell, openQty, sHn, sSg, sTong,
          '=H' + nextRow + '+I' + nextRow + '+J' + nextRow,
          '=E' + nextRow + '*K' + nextRow,
          minLim,
          '=IF(K' + nextRow + '<=0, "Hết hàng", IF(K' + nextRow + '<=M' + nextRow + ', "Sắp hết hàng", "An toàn"))'
        ];
        dmSheet.getRange(nextRow, 1, 1, 14).setValues([newRow14]);
        dmSheet.getRange(nextRow, 5, 1, 2).setNumberFormat('#,##0 "₫"');
        dmSheet.getRange(nextRow, 12).setNumberFormat('#,##0 "₫"');
      } else {
        const newRow12 = [
          sku, name, cat, unit, cost, sell, sHn, sSg, sTong,
          '=G' + nextRow + '+H' + nextRow + '+I' + nextRow,
          minLim,
          '=IF(J' + nextRow + '<=K' + nextRow + ', "Cảnh báo thiếu", "Bình thường")'
        ];
        dmSheet.getRange(nextRow, 1, 1, 12).setValues([newRow12]);
        dmSheet.getRange(nextRow, 5, 1, 2).setNumberFormat('#,##0 "₫"');
      }
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'THÊM MÃ HÀNG MỚI', sku, 'Thêm mới SKU ' + sku + ' (' + name + '), Tổng tồn: ' + openQty);
      return { success: true, message: 'Đã thêm mã hàng mới [' + sku + '] vào Google Sheets thành công!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu mã hàng: ' + err.toString() };
  }
}

/**
 * Tạo phiếu Nhập kho / Xuất kho / Điều chuyển + Tự động tính lại Giá vốn bình quân liên hoàn + Ghi Audit Log
 */
function submitInventoryTx(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dmSheet = ss.getSheetByName('DANH_MUC_HANG');
    const nxSheet = ss.getSheetByName('NHAP_XUAT');

    if (!dmSheet || !nxSheet) {
      return { success: false, message: 'Chưa khởi tạo 6 Tab Trang tính! Vui lòng bấm menu Khởi tạo cấu trúc trước.' };
    }

    const qty = parseInt(data.quantity, 10) || 0;
    if (qty <= 0) {
      return { success: false, message: 'Số lượng trên phiếu phải lớn hơn 0!' };
    }

    const role = data.userRole || 'ADMIN';
    const assignedWh = data.assignedWarehouse || 'ALL';
    if (role === 'KEEPER' && assignedWh !== 'ALL') {
      if (data.type === 'Nhập kho' && data.toWarehouse !== assignedWh) {
        return { success: false, message: 'Phân quyền: Bạn chỉ được phép Nhập hàng vào ' + assignedWh + '!' };
      }
      if (data.type === 'Xuất kho' && data.fromWarehouse !== assignedWh) {
        return { success: false, message: 'Phân quyền: Bạn chỉ được phép Xuất hàng từ ' + assignedWh + '!' };
      }
      if (data.type === 'Điều chuyển' && data.fromWarehouse !== assignedWh && data.toWarehouse !== assignedWh) {
        return { success: false, message: 'Phân quyền: Lệnh điều chuyển phải liên quan đến ' + assignedWh + '!' };
      }
    }

    const dmValues = dmSheet.getDataRange().getValues();
    const is14Cols = (dmValues.length >= 2 && dmValues[1].length >= 14);
    const colHn = is14Cols ? 8 : 7; // 1-based index

    let targetRowNum = -1;
    let currentItem = null;

    for (let i = 2; i < dmValues.length; i++) {
      if (String(dmValues[i][0]).trim() === String(data.sku).trim()) {
        targetRowNum = i + 1;
        currentItem = {
          sku: dmValues[i][0],
          name: dmValues[i][1],
          unit: dmValues[i][3] || 'Chiếc',
          costPrice: Number(dmValues[i][4]) || 0,
          sellingPrice: Number(dmValues[i][5]) || 0,
          stockHn: Number(dmValues[i][colHn - 1]) || 0,
          stockSg: Number(dmValues[i][colHn]) || 0,
          stockTong: Number(dmValues[i][colHn + 1]) || 0
        };
        break;
      }
    }

    if (targetRowNum === -1 || !currentItem) {
      return { success: false, message: 'Không tìm thấy mã hàng ' + data.sku + ' trong Danh mục!' };
    }

    if (data.type === 'Xuất kho' || data.type === 'Điều chuyển') {
      let sourceStock = 0;
      if (data.fromWarehouse === 'Kho Hà Nội') sourceStock = currentItem.stockHn;
      else if (data.fromWarehouse === 'Kho Sài Gòn') sourceStock = currentItem.stockSg;
      else if (data.fromWarehouse === 'Kho Tổng') sourceStock = currentItem.stockTong;

      if (qty > sourceStock) {
        return {
          success: false,
          message: 'Cảnh báo âm kho: ' + data.fromWarehouse + ' chỉ còn tồn ' + sourceStock + ' ' + currentItem.unit + ', không đủ xuất ' + qty + '!'
        };
      }
    }

    const typePrefix = data.type === 'Nhập kho' ? 'PNK' : data.type === 'Xuất kho' ? 'PXK' : 'PDC';
    const code = data.code || (typePrefix + '-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmm'));
    const txDate = data.txDate ? (data.txDate + ' ' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'HH:mm')) : Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    const unitPrice = Number(data.unitPrice) || currentItem.costPrice;
    const totalVal = qty * unitPrice;

    let newCostPrice = currentItem.costPrice;
    const oldTotalStock = currentItem.stockHn + currentItem.stockSg + currentItem.stockTong;
    if (data.type === 'Nhập kho' && unitPrice > 0) {
      if (oldTotalStock <= 0) {
        newCostPrice = unitPrice;
      } else {
        newCostPrice = Math.round(((oldTotalStock * currentItem.costPrice) + (qty * unitPrice)) / (oldTotalStock + qty));
      }
      dmSheet.getRange(targetRowNum, 5).setValue(newCostPrice);
    }

    let nextHn = currentItem.stockHn;
    let nextSg = currentItem.stockSg;
    let nextTong = currentItem.stockTong;

    if (data.type === 'Nhập kho') {
      if (data.toWarehouse === 'Kho Hà Nội') nextHn += qty;
      else if (data.toWarehouse === 'Kho Sài Gòn') nextSg += qty;
      else if (data.toWarehouse === 'Kho Tổng') nextTong += qty;
    } else if (data.type === 'Xuất kho') {
      if (data.fromWarehouse === 'Kho Hà Nội') nextHn = Math.max(0, nextHn - qty);
      else if (data.fromWarehouse === 'Kho Sài Gòn') nextSg = Math.max(0, nextSg - qty);
      else if (data.fromWarehouse === 'Kho Tổng') nextTong = Math.max(0, nextTong - qty);
    } else if (data.type === 'Điều chuyển') {
      if (data.fromWarehouse === 'Kho Hà Nội') nextHn = Math.max(0, nextHn - qty);
      else if (data.fromWarehouse === 'Kho Sài Gòn') nextSg = Math.max(0, nextSg - qty);
      else if (data.fromWarehouse === 'Kho Tổng') nextTong = Math.max(0, nextTong - qty);

      if (data.toWarehouse === 'Kho Hà Nội') nextHn += qty;
      else if (data.toWarehouse === 'Kho Sài Gòn') nextSg += qty;
      else if (data.toWarehouse === 'Kho Tổng') nextTong += qty;
    }

    dmSheet.getRange(targetRowNum, colHn, 1, 3).setValues([[nextHn, nextSg, nextTong]]);

    nxSheet.appendRow([
      code,
      txDate,
      data.type,
      currentItem.sku,
      currentItem.name,
      currentItem.unit,
      qty,
      unitPrice,
      totalVal,
      data.fromWarehouse || 'Nhà cung cấp ngoài',
      data.toWarehouse || 'Giao khách hàng',
      data.partner || 'Đối tác kinh doanh',
      data.createdBy || 'Quản trị viên',
      data.notes || ''
    ]);

    const lastNxRow = nxSheet.getLastRow();
    nxSheet.getRange(lastNxRow, 8, 1, 2).setNumberFormat('#,##0 "₫"');

    writeAuditLog(
      ss,
      data.username || 'admin',
      data.createdBy || 'Quản trị viên',
      'LẬP PHIẾU ' + data.type.toUpperCase(),
      code,
      data.type + ' ' + qty + ' ' + currentItem.unit + ' [' + currentItem.sku + '] (' + (data.fromWarehouse || '') + ' -> ' + (data.toWarehouse || '') + '). Giá vốn BQ: ' + newCostPrice
    );

    return {
      success: true,
      message: 'Đã ghi sổ phiếu ' + code + ' và cập nhật tồn kho + giá vốn bình quân thành công!',
      code: code,
      newCostPrice: newCostPrice
    };
  } catch (err) {
    return {
      success: false,
      message: 'Lỗi xử lý chứng từ kho: ' + err.toString()
    };
  }
}

/**
 * Lưu cấu hình thông tin doanh nghiệp & biểu mẫu in
 */
function saveCompanyConfig(configPayload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const chSheet = ss.getSheetByName('CAU_HINH');
    if (!chSheet) return { success: false, message: 'Chưa có tab CAU_HINH!' };

    const vals = chSheet.getDataRange().getValues();
    for (let i = 2; i < vals.length; i++) {
      const key = String(vals[i][0]).trim();
      if (configPayload.hasOwnProperty(key)) {
        chSheet.getRange(i + 1, 2).setValue(configPayload[key]);
      }
    }

    writeAuditLog(ss, configPayload.username || 'admin', configPayload.actorName || 'Admin', 'CẬP NHẬT CẤU HÌNH', 'CAU_HINH', 'Thay đổi thông tin doanh nghiệp / phương pháp tính giá vốn');
    return { success: true, message: 'Đã lưu cấu hình doanh nghiệp và biểu mẫu in thành công!' };
  } catch (err) {
    return { success: false, message: 'Lỗi lưu cấu hình: ' + err.toString() };
  }
}

function writeAuditLog(ss, username, actorName, action, refCode, detail) {
  try {
    const nkSheet = ss.getSheetByName('NHAT_KY');
    if (!nkSheet) return;
    const nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
    nkSheet.appendRow([nowStr, username, actorName, action, refCode, detail]);
  } catch (e) {}
}

function parseCurrency(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const clean = String(str).replace(/[^\d.-]/g, '');
  return parseFloat(clean) || 0;
}

function getFallbackWarehouseData() {
  const settings = {
    COMPANY_NAME: 'CÔNG TY TNHH CÔNG NGHỆ & THIẾT BỊ NEXSIMPLE VIỆT NAM',
    COMPANY_ADDRESS: 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM',
    COMPANY_PHONE: '0974 755 104',
    COMPANY_TAX: '0318899221',
    COSTING_METHOD: 'WEIGHTED_AVERAGE',
    ALLOW_NEGATIVE_STOCK: 'FALSE',
    PRINT_TEMPLATE_STANDARD: 'Mẫu số 01-VT / 02-VT (Ban hành theo Thông tư 200/2014/TT-BTC Bộ Tài Chính)'
  };

  const users = [
    { username: 'admin', password: '123456', fullName: 'Nguyễn Minh Tuấn', role: 'ADMIN', assignedWarehouse: 'ALL', permissionsDesc: 'Toàn quyền hệ thống (Tất cả các kho)', status: 'Hoạt động' },
    { username: 'ketoan', password: '123456', fullName: 'Hoàng Thu Trang', role: 'ACCOUNTANT', assignedWarehouse: 'ALL', permissionsDesc: 'Kế toán kho (Xem toàn kho, Lập phiếu, Xuất N-X-T)', status: 'Hoạt động' },
    { username: 'thukho_hn', password: '123456', fullName: 'Trần Đình Trọng', role: 'KEEPER', assignedWarehouse: 'Kho Hà Nội', permissionsDesc: 'Thủ kho chi nhánh (Chỉ phụ trách Kho Hà Nội)', status: 'Hoạt động' },
    { username: 'thukho_sg', password: '123456', fullName: 'Lê Hoàng Nam', role: 'KEEPER', assignedWarehouse: 'Kho Sài Gòn', permissionsDesc: 'Thủ kho chi nhánh (Chỉ phụ trách Kho Sài Gòn)', status: 'Hoạt động' }
  ];

  const items = [
    { sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame Body', category: 'Thiết bị ghi hình', unit: 'Chiếc', costPrice: 72000000, sellingPrice: 85000000, openingStock: 9, stock_hanoi: 4, stock_saigon: 3, stock_tong: 5, totalStock: 12, inventoryValue: 864000000, minLimit: 4, alertStatus: 'An toàn' },
    { sku: 'SKU-LEN-2470', name: 'Ống kính Sony FE 24-70mm f/2.8 GM II', category: 'Ống kính', unit: 'Chiếc', costPrice: 38000000, sellingPrice: 46000000, openingStock: 10, stock_hanoi: 2, stock_saigon: 4, stock_tong: 6, totalStock: 12, inventoryValue: 456000000, minLimit: 4, alertStatus: 'An toàn' },
    { sku: 'SKU-DRO-M3C', name: 'Flycam DJI Mavic 3 Cine Premium Combo', category: 'Flycam & Drone', unit: 'Bộ', costPrice: 85000000, sellingPrice: 99000000, openingStock: 4, stock_hanoi: 1, stock_saigon: 1, stock_tong: 0, totalStock: 2, inventoryValue: 170000000, minLimit: 3, alertStatus: 'Sắp hết hàng' },
    { sku: 'SKU-LGT-600D', name: 'Đèn Aputure Light Storm LS 600d Pro', category: 'Ánh sáng Studio', unit: 'Bộ', costPrice: 42000000, sellingPrice: 49500000, openingStock: 15, stock_hanoi: 5, stock_saigon: 4, stock_tong: 8, totalStock: 17, inventoryValue: 714000000, minLimit: 5, alertStatus: 'An toàn' },
    { sku: 'SKU-MIC-EWDP', name: 'Micro Sennheiser EW-DP ME 2 Digital', category: 'Thiết bị âm thanh', unit: 'Bộ', costPrice: 14500000, sellingPrice: 18000000, openingStock: 18, stock_hanoi: 6, stock_saigon: 8, stock_tong: 10, totalStock: 24, inventoryValue: 348000000, minLimit: 6, alertStatus: 'An toàn' },
    { sku: 'SKU-GIM-RS3P', name: 'Gimbal Chống Rung DJI RS 3 Pro Combo', category: 'Phụ kiện Grip', unit: 'Chiếc', costPrice: 18000000, sellingPrice: 22500000, openingStock: 3, stock_hanoi: 1, stock_saigon: 1, stock_tong: 1, totalStock: 3, inventoryValue: 54000000, minLimit: 4, alertStatus: 'Sắp hết hàng' },
    { sku: 'SKU-MON-AT5', name: 'Màn hình Atomos Ninja V+ 5.2" 8K HDR', category: 'Thiết bị ghi hình', unit: 'Chiếc', costPrice: 19500000, sellingPrice: 24000000, openingStock: 6, stock_hanoi: 3, stock_saigon: 2, stock_tong: 4, totalStock: 9, inventoryValue: 175500000, minLimit: 3, alertStatus: 'An toàn' },
    { sku: 'SKU-BAT-V150', name: 'Pin V-Mount SmallRig VB155 Mini 155Wh', category: 'Phụ kiện Nguồn', unit: 'Viên', costPrice: 6200000, sellingPrice: 7900000, openingStock: 5, stock_hanoi: 0, stock_saigon: 0, stock_tong: 0, totalStock: 0, inventoryValue: 0, minLimit: 5, alertStatus: 'Hết hàng' }
  ];

  const logs = [
    { code: 'PNK-2026-1001', timestamp: '2026-10-01 09:00', type: 'Nhập kho', sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame Body', unit: 'Chiếc', quantity: 5, unitPrice: 72000000, totalVal: 360000000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Hà Nội', partner: 'Công ty TNHH Sony Electronics VN', createdBy: 'Trần Đình Trọng', notes: 'Nhập lô máy quay chính hãng CO/CQ đợt 1' },
    { code: 'PNK-2026-1002', timestamp: '2026-10-03 10:20', type: 'Nhập kho', sku: 'SKU-LEN-2470', name: 'Ống kính Sony FE 24-70mm f/2.8 GM II', unit: 'Chiếc', quantity: 4, unitPrice: 38000000, totalVal: 152000000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Sài Gòn', partner: 'Công ty TNHH Sony Electronics VN', createdBy: 'Lê Hoàng Nam', notes: 'Nhập bổ sung ống kính GM II cho chi nhánh Nam' },
    { code: 'PXK-2026-1005', timestamp: '2026-10-05 14:15', type: 'Xuất kho', sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame Body', unit: 'Chiếc', quantity: 2, unitPrice: 85000000, totalVal: 170000000, fromWarehouse: 'Kho Hà Nội', toWarehouse: 'Giao khách hàng', partner: 'Đài Truyền Hình Kỹ Thuật Số VTC', createdBy: 'Trần Đình Trọng', notes: 'Xuất bán theo Hợp đồng kinh tế số 88/HĐKT' },
    { code: 'PDC-2026-1007', timestamp: '2026-10-07 11:30', type: 'Điều chuyển', sku: 'SKU-LGT-600D', name: 'Đèn Aputure Light Storm LS 600d Pro', unit: 'Bộ', quantity: 3, unitPrice: 42000000, totalVal: 126000000, fromWarehouse: 'Kho Tổng', toWarehouse: 'Kho Hà Nội', partner: 'Điều chuyển nội bộ hệ thống', createdBy: 'Nguyễn Minh Tuấn', notes: 'Luân chuyển thiết bị ánh sáng tăng cường miền Bắc' },
    { code: 'PNK-2026-1009', timestamp: '2026-10-09 08:45', type: 'Nhập kho', sku: 'SKU-MIC-EWDP', name: 'Micro Sennheiser EW-DP ME 2 Digital', unit: 'Bộ', quantity: 6, unitPrice: 14500000, totalVal: 87000000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Tổng', partner: 'Nhà Phân Phối Âm Thanh Hoàng Bảo Khoa', createdBy: 'Hoàng Thu Trang', notes: 'Nhập kho tổng phân phối toàn quốc' },
    { code: 'PXK-2026-1011', timestamp: '2026-10-11 16:00', type: 'Xuất kho', sku: 'SKU-DRO-M3C', name: 'Flycam DJI Mavic 3 Cine Premium Combo', unit: 'Bộ', quantity: 2, unitPrice: 99000000, totalVal: 198000000, fromWarehouse: 'Kho Sài Gòn', toWarehouse: 'Giao khách hàng', partner: 'Production House RedPixel Studio', createdBy: 'Lê Hoàng Nam', notes: 'Xuất bán trọn bộ kèm gói bảo hành DJI Care' },
    { code: 'PXK-2026-1013', timestamp: '2026-10-13 15:10', type: 'Xuất kho', sku: 'SKU-LEN-2470', name: 'Ống kính Sony FE 24-70mm f/2.8 GM II', unit: 'Chiếc', quantity: 2, unitPrice: 46000000, totalVal: 92000000, fromWarehouse: 'Kho Sài Gòn', toWarehouse: 'Giao khách hàng', partner: 'Production House RedPixel Studio', createdBy: 'Lê Hoàng Nam', notes: 'Xuất kèm đơn hàng Flycam RedPixel' },
    { code: 'PNK-2026-1015', timestamp: '2026-10-15 09:30', type: 'Nhập kho', sku: 'SKU-MON-AT5', name: 'Màn hình Atomos Ninja V+ 5.2" 8K HDR', unit: 'Chiếc', quantity: 3, unitPrice: 19500000, totalVal: 58500000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Hà Nội', partner: 'Công ty Cổ phần Thiết Bị Phim Trường Việt', createdBy: 'Trần Đình Trọng', notes: 'Nhập màn hình monitor 8K phục vụ dự án Q4' }
  ];

  const auditLogs = [
    { timestamp: '2026-10-15 09:30:12', username: 'thukho_hn', actorName: 'Trần Đình Trọng (KEEPER)', action: 'LẬP PHIẾU NHẬP KHO', refCode: 'PNK-2026-1015', detail: 'Nhập 3 Chiếc [SKU-MON-AT5] vào Kho Hà Nội. Cập nhật giá vốn bình quân.' },
    { timestamp: '2026-10-13 15:10:05', username: 'thukho_sg', actorName: 'Lê Hoàng Nam (KEEPER)', action: 'LẬP PHIẾU XUẤT KHO', refCode: 'PXK-2026-1013', detail: 'Xuất 2 Chiếc [SKU-LEN-2470] từ Kho Sài Gòn cho RedPixel Studio.' },
    { timestamp: '2026-10-07 11:30:00', username: 'admin', actorName: 'Nguyễn Minh Tuấn (ADMIN)', action: 'ĐIỀU CHUYỂN KHO', refCode: 'PDC-2026-1007', detail: 'Điều chuyển 3 Bộ [SKU-LGT-600D] từ Kho Tổng -> Kho Hà Nội.' }
  ];

  return buildWarehouseResponse(items, logs, settings, users, auditLogs, true);
}
```

## 4. File 4: `Index.html` (Cập nhật Cổng Đăng Nhập Bắt Buộc — Hãy copy đè vào `Index.html` trên Apps Script)

```html
<!DOCTYPE html>
<html lang="vi" data-bs-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GS-002 • Quản Lý Nhập Xuất Tồn Đa Kho (v3.0 Commercial Pro)</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --sidebar-width: 245px;
      --brand-primary: #0284c7;
      --brand-dark: #0f172a;
      --surface-bg: #f1f5f9;
      --card-bg: #ffffff;
    }
    [data-bs-theme="dark"] {
      --surface-bg: #0f172a;
      --card-bg: #1e293b;
    }
    body {
      background-color: var(--surface-bg);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 0.875rem;
      overflow-x: hidden;
    }

    /* Full-Screen Mandatory Auth Gate */
    #authGateScreen {
      min-height: 100vh;
      width: 100%;
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0284c7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .auth-card {
      background: #ffffff;
      color: #0f172a;
      border-radius: 18px;
      max-width: 430px;
      width: 100%;
      padding: 32px 30px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
    }

    .app-wrapper {
      display: flex;
      min-height: 100vh;
    }
    /* Sidebar */
    .app-sidebar {
      width: var(--sidebar-width);
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      transition: width 0.2s ease;
      z-index: 1030;
    }
    .app-sidebar.collapsed {
      width: 68px;
    }
    .app-sidebar.collapsed .hide-on-collapse {
      display: none !important;
    }
    .sidebar-brand {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-menu {
      padding: 10px 8px;
      flex: 1;
    }
    .nav-menu-btn {
      width: 100%;
      text-align: left;
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 9px 12px;
      border-radius: 9px;
      margin-bottom: 4px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.15s;
    }
    .nav-menu-btn:hover {
      background: rgba(255,255,255,0.07);
      color: #ffffff;
    }
    .nav-menu-btn.active {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
    }
    /* Main Content */
    .app-main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .app-topbar {
      background: var(--card-bg);
      border-bottom: 1px solid rgba(148, 163, 184, 0.2);
      padding: 8px 16px;
      position: sticky;
      top: 0;
      z-index: 1020;
    }
    .filter-strip {
      background: var(--card-bg);
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      padding: 8px 16px;
    }
    .kpi-card {
      background: var(--card-bg);
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      height: 100%;
    }
    .panel-card {
      background: var(--card-bg);
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      margin-bottom: 16px;
    }
    .badge-safe { background-color: #dcfce7; color: #166534; font-weight: 700; }
    .badge-low { background-color: #fef3c7; color: #92400e; font-weight: 700; }
    .badge-out { background-color: #fee2e2; color: #991b1b; font-weight: 700; }
    .badge-in { background-color: #dcfce7; color: #15803d; }
    .badge-export { background-color: #fee2e2; color: #b91c1c; }
    .badge-transfer { background-color: #e0f2fe; color: #0369a1; }
    .table > :not(caption) > * > * {
      padding: 8px 8px;
      vertical-align: middle;
      font-size: 0.84rem;
    }
    /* Sticky left column for SKU table so SKU & Product Name are never cut off */
    .sticky-col-left {
      position: sticky;
      left: 0;
      z-index: 2;
      background-color: var(--card-bg) !important;
      box-shadow: 2px 0 5px rgba(0,0,0,0.05);
    }
    /* Print Voucher Styling */
    .voucher-print-box {
      background: #ffffff !important;
      color: #000000 !important;
      padding: 24px 28px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-family: "Times New Roman", Times, serif;
      font-size: 13.5px;
    }
    .voucher-print-box table {
      width: 100%;
      border-collapse: collapse;
      color: #000000 !important;
    }
    .voucher-print-box th, .voucher-print-box td {
      border: 1px solid #000000 !important;
      padding: 6px 8px;
      color: #000000 !important;
    }
    /* Dedicated top-level print sheet for 100% reliable printing inside Google Sheets Modal */
    #dedicatedPrintSheet {
      display: none;
      background: #ffffff;
      color: #000000;
      padding: 20px;
      font-family: "Times New Roman", Times, serif;
    }
    @media print {
      body > *:not(#dedicatedPrintSheet) {
        display: none !important;
      }
      #dedicatedPrintSheet {
        display: block !important;
        position: static !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      #dedicatedPrintSheet table {
        width: 100% !important;
        border-collapse: collapse !important;
      }
      #dedicatedPrintSheet th, #dedicatedPrintSheet td {
        border: 1px solid #000000 !important;
        padding: 6px 8px !important;
        color: #000000 !important;
      }
    }
  </style>
</head>
<body>

<!-- DEDICATED PRINT CONTAINER (CHỐNG TRẮNG TRANG KHI IN TRONG GOOGLE SHEETS MODAL) -->
<div id="dedicatedPrintSheet"></div>

<!-- FULL-SCREEN MANDATORY LOGIN GATE (BẮT BUỘC ĐĂNG NHẬP TRƯỚC KHI VÀO HỆ THỐNG) -->
<div id="authGateScreen">
  <div class="auth-card">
    <div class="text-center mb-4">
      <div class="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-4 shadow-sm mb-3" style="width:58px;height:58px;font-size:28px;">
        📦
      </div>
      <h4 class="fw-bold mb-1" style="color:#0f172a;">ĐĂNG NHẬP HỆ THỐNG KHO</h4>
      <div class="small text-secondary" id="authGateCompanySub">Hệ Thống Quản Lý Nhập Xuất Tồn Đa Kho v3.0 Pro</div>
      <div class="mt-2">
        <span class="badge bg-info-subtle text-primary border border-info-subtle" id="authSyncStatus">
          <span class="spinner-border spinner-border-sm me-1"></span> Đang kết nối dữ liệu phân quyền...
        </span>
      </div>
    </div>

    <form onsubmit="handleMandatoryLogin(event)">
      <div class="mb-3">
        <label class="form-label small fw-bold text-uppercase text-secondary">Tên Đăng Nhập (Username)</label>
        <div class="input-group">
          <span class="input-group-text bg-light"><i class="bi bi-person-fill text-primary"></i></span>
          <input type="text" class="form-control fw-bold" id="gateUsername" placeholder="Nhập tên tài khoản..." required autofocus>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label small fw-bold text-uppercase text-secondary">Mật Khẩu (Password)</label>
        <div class="input-group">
          <span class="input-group-text bg-light"><i class="bi bi-key-fill text-primary"></i></span>
          <input type="password" class="form-control" id="gatePassword" placeholder="Nhập mật khẩu..." required>
          <button class="btn btn-outline-secondary" type="button" onclick="toggleGatePassVisibility()" title="Hiện / Ẩn mật khẩu">
            <i class="bi bi-eye" id="gatePassEye"></i>
          </button>
        </div>
      </div>

      <div id="gateErrorAlert" class="alert alert-danger py-2 small d-none mb-3"></div>

      <div class="d-grid mt-4">
        <button type="submit" class="btn btn-primary fw-bold py-2 fs-6 shadow-sm" id="btnGateLogin">
          <i class="bi bi-shield-lock-fill me-1"></i> Đăng Nhập Vào Hệ Thống
        </button>
      </div>
    </form>

    <div class="border-top mt-4 pt-3 text-center">
      <div class="small text-secondary">
        <i class="bi bi-shield-check text-success me-1"></i> Bảo mật theo phân quyền <code>PHAN_QUYEN</code> trên Google Sheets
      </div>
    </div>
  </div>
</div>

<div class="app-wrapper d-none" id="mainAppWrapper">
  <!-- LEFT SIDEBAR -->
  <aside class="app-sidebar" id="appSidebar">
    <div class="sidebar-brand">
      <div class="d-flex align-items-center gap-2">
        <div class="bg-info text-dark fw-bold rounded-3 d-flex align-items-center justify-content-center" style="width:34px;height:34px;font-size:17px;">
          📦
        </div>
        <div class="hide-on-collapse">
          <div class="fw-bold text-white" style="font-size:13.5px;">KHO ĐA KHO PRO</div>
          <div class="text-info" style="font-size:11px;font-weight:700;">GS-002 • v3.0 Pro</div>
        </div>
      </div>
      <button class="btn btn-sm btn-dark border-secondary text-light" onclick="toggleSidebar()" title="Thu gọn / Mở rộng thanh bên">
        <i class="bi bi-layout-sidebar-inset"></i>
      </button>
    </div>

    <div class="nav-menu">
      <div class="text-uppercase text-secondary fw-bold px-2 mb-2 hide-on-collapse" style="font-size:10px;letter-spacing:0.6px;">
        Phân hệ vận hành
      </div>
      <button class="nav-menu-btn active" id="nav-dashboard" onclick="switchView('dashboard')">
        <i class="bi bi-pie-chart-fill fs-5"></i>
        <span class="hide-on-collapse">Tổng Quan & Biểu Đồ</span>
      </button>
      <button class="nav-menu-btn" id="nav-inventory" onclick="switchView('inventory')">
        <i class="bi bi-box-seam-fill fs-5"></i>
        <span class="hide-on-collapse">Danh Mục Hàng & Đa Kho</span>
      </button>
      <button class="nav-menu-btn" id="nav-nxt" onclick="switchView('nxt')">
        <i class="bi bi-table fs-5"></i>
        <span class="hide-on-collapse">Báo Cáo Nhập-Xuất-Tồn</span>
      </button>
      <button class="nav-menu-btn" id="nav-vouchers" onclick="switchView('vouchers')">
        <i class="bi bi-journal-text fs-5"></i>
        <span class="hide-on-collapse">Sổ Phiếu & Lịch Sử Đối Tác</span>
      </button>

      <div class="text-uppercase text-secondary fw-bold px-2 mt-3 mb-2 hide-on-collapse" style="font-size:10px;letter-spacing:0.6px;">
        Tài khoản & Quản trị
      </div>
      <button class="nav-menu-btn" id="nav-rbac" onclick="switchView('rbac')">
        <i class="bi bi-people-fill fs-5"></i>
        <span class="hide-on-collapse">Tài Khoản & Phân Quyền</span>
      </button>
      <button class="nav-menu-btn" id="nav-settings" onclick="switchView('settings')">
        <i class="bi bi-gear-fill fs-5"></i>
        <span class="hide-on-collapse">Cấu Hình & Mẫu In BTC</span>
      </button>
    </div>

    <!-- Current User Session Box in Sidebar Footer -->
    <div class="p-3 border-top border-secondary border-opacity-25 hide-on-collapse">
      <div class="d-flex align-items-center justify-content-between mb-1">
        <span class="small text-secondary">Tài khoản: <code class="text-info" id="sidebarUsername">admin</code></span>
        <span class="badge bg-info text-dark" id="sidebarRoleBadge">ADMIN</span>
      </div>
      <div class="fw-bold text-white text-truncate" id="sidebarUserName">Nguyễn Minh Tuấn</div>
      <div class="small text-warning mt-1 mb-2" id="sidebarWhScope">
        <i class="bi bi-geo-alt-fill"></i> Phạm vi: Tất cả các kho
      </div>
      <div class="d-grid gap-1">
        <button class="btn btn-xs btn-outline-light btn-sm py-1" id="btnSidebarCreateUser" onclick="openUserModal()">
          <i class="bi bi-person-plus-fill me-1"></i> + Tạo Tài Khoản Mới
        </button>
        <button class="btn btn-xs btn-danger btn-sm py-1 fw-bold" onclick="handleLogout()">
          <i class="bi bi-power me-1"></i> Đăng Xuất Khóa Màn Hình
        </button>
      </div>
    </div>
  </aside>

  <!-- MAIN CONTENT AREA -->
  <div class="app-main">
    <!-- TOPBAR -->
    <header class="app-topbar d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div class="d-flex align-items-center gap-2">
        <span class="fw-bold" style="font-size:0.95rem;" id="topbarCompanyTitle">CÔNG TY TNHH CÔNG NGHỆ & THIẾT BỊ NEXSIMPLE VIỆT NAM</span>
        <span class="badge bg-success-subtle text-success border border-success-subtle" id="connBadge">
          <i class="bi bi-check-circle-fill me-1"></i> Đã đồng bộ
        </span>
      </div>

      <div class="d-flex flex-wrap align-items-center gap-2">
        <!-- Thông tin phiên đăng nhập bảo mật & Đăng xuất -->
        <div class="d-flex align-items-center gap-1 bg-light border rounded-3 px-2 py-1">
          <i class="bi bi-person-check-fill text-success"></i>
          <span class="small fw-bold" id="topUserBadge">Chưa đăng nhập</span>
          <span class="badge bg-primary ms-1" id="topRoleBadge">--</span>
        </div>

        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary fw-semibold" id="btnTopCreateUser" onclick="openUserModal()" title="Tạo tài khoản mới (Chỉ Admin)">
            <i class="bi bi-person-plus-fill me-1"></i> + Tạo TK
          </button>
          <button class="btn btn-outline-danger fw-bold" onclick="handleLogout()" title="Đăng xuất và khóa màn hình">
            <i class="bi bi-box-arrow-right me-1"></i> Đăng Xuất
          </button>
        </div>

        <button class="btn btn-outline-secondary btn-sm" onclick="toggleTheme()" title="Chế độ Sáng / Tối">
          <i class="bi bi-moon-stars-fill" id="themeIcon"></i>
        </button>

        <button class="btn btn-outline-primary btn-sm" onclick="loadData()" title="Làm mới dữ liệu từ Google Sheets">
          <i class="bi bi-arrow-clockwise"></i>
        </button>

        <div class="btn-group btn-group-sm">
          <button class="btn btn-success fw-bold" onclick="openTxModal('Nhập kho')">
            + Nhập Kho
          </button>
          <button class="btn btn-danger fw-bold" onclick="openTxModal('Xuất kho')">
            - Xuất Kho
          </button>
          <button class="btn btn-primary fw-bold" onclick="openTxModal('Điều chuyển')">
            Điều Chuyển
          </button>
        </div>
      </div>
    </header>

    <!-- GLOBAL FILTER STRIP (DATE RANGE + WAREHOUSE + COSTING METHOD) -->
    <div class="filter-strip d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div class="d-flex flex-wrap align-items-center gap-2">
        <div class="input-group input-group-sm" style="width: auto;">
          <span class="input-group-text fw-semibold"><i class="bi bi-building me-1"></i> Kho:</span>
          <select class="form-select form-select-sm fw-bold" id="globalWarehouseFilter" onchange="refreshAllViews()">
            <option value="ALL">Tất cả các kho (Toàn hệ thống)</option>
            <option value="Kho Hà Nội">Kho Hà Nội (Miền Bắc)</option>
            <option value="Kho Sài Gòn">Kho Sài Gòn (Miền Nam)</option>
            <option value="Kho Tổng">Kho Tổng (Trung Tâm)</option>
          </select>
        </div>

        <div class="input-group input-group-sm" style="width: auto;">
          <span class="input-group-text"><i class="bi bi-calendar-range me-1"></i> Từ ngày:</span>
          <input type="date" class="form-control form-control-sm" id="filterStartDate" value="2026-01-01" onchange="refreshAllViews()">
          <span class="input-group-text">Đến ngày:</span>
          <input type="date" class="form-control form-control-sm" id="filterEndDate" value="2026-12-31" onchange="refreshAllViews()">
        </div>

        <button class="btn btn-sm btn-link text-decoration-none p-0 ms-1" onclick="resetDateFilter()">
          Xem toàn thời gian
        </button>
      </div>

      <div class="d-flex align-items-center gap-2">
        <span class="small text-secondary fw-semibold">Phương pháp tính giá vốn:</span>
        <select class="form-select form-select-sm" style="width:auto;" id="costingMethodSelect" onchange="refreshAllViews()">
          <option value="WEIGHTED_AVERAGE">Bình quân gia quyền liên hoàn</option>
          <option value="PERIODIC">Bình quân gia quyền cuối kỳ</option>
        </select>
      </div>
    </div>

    <!-- BODY CONTAINER -->
    <div class="container-fluid p-3">

      <!-- ================================================================ -->
      <!-- VIEW 1: DASHBOARD (TỔNG QUAN & BIỂU ĐỒ TRỰC QUAN) -->
      <!-- ================================================================ -->
      <div id="view-dashboard" class="view-section">
        <div class="row g-3 mb-3">
          <div class="col-6 col-xl-3">
            <div class="kpi-card border-start border-primary border-4">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-secondary small fw-bold text-uppercase">Tổng Mặt Hàng & Tồn</span>
                <span class="badge bg-primary-subtle text-primary"><i class="bi bi-boxes"></i> SKU</span>
              </div>
              <div class="h4 fw-bold mt-2 mb-1" id="kpiTotalQty">--</div>
              <div class="small text-secondary" id="kpiTotalSkuSub">Đang quản lý -- mã SKU</div>
            </div>
          </div>
          <div class="col-6 col-xl-3">
            <div class="kpi-card border-start border-success border-4">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-secondary small fw-bold text-uppercase">Giá Trị Tồn Kho (Giá Vốn)</span>
                <span class="badge bg-success-subtle text-success"><i class="bi bi-cash-stack"></i> VNĐ</span>
              </div>
              <div class="h5 fw-bold text-success mt-2 mb-1" id="kpiTotalVal">--</div>
              <div class="small text-secondary" id="kpiCostMethodSub">Theo giá vốn bình quân</div>
            </div>
          </div>
          <div class="col-6 col-xl-3">
            <div class="kpi-card border-start border-info border-4">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-secondary small fw-bold text-uppercase">Nhập / Xuất Trong Kỳ Lọc</span>
                <span class="badge bg-info-subtle text-info"><i class="bi bi-arrow-left-right"></i> Luân chuyển</span>
              </div>
              <div class="h5 fw-bold mt-2 mb-1" id="kpiPeriodInOut">--</div>
              <div class="small text-secondary" id="kpiPeriodCountSub">-- phiếu phát sinh trong kỳ</div>
            </div>
          </div>
          <div class="col-6 col-xl-3">
            <div class="kpi-card border-start border-danger border-4">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-secondary small fw-bold text-uppercase">Cảnh Báo Thiếu / Hết Hàng</span>
                <span class="badge bg-danger-subtle text-danger"><i class="bi bi-exclamation-triangle-fill"></i> Cảnh báo</span>
              </div>
              <div class="h4 fw-bold text-danger mt-2 mb-1" id="kpiAlertCount">--</div>
              <div class="small text-secondary" id="kpiAlertSub">Chạm ngưỡng Min hoặc tồn = 0</div>
            </div>
          </div>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <div class="panel-card mb-0 border-top border-info border-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="fw-bold mb-0"><i class="bi bi-geo-alt-fill text-info me-1"></i> Kho Hà Nội (Miền Bắc)</h6>
                <span class="badge bg-info-subtle text-info" id="whHnQty">0 SP</span>
              </div>
              <div class="fs-5 fw-bold text-primary" id="whHnVal">0 ₫</div>
              <div class="small text-secondary mt-1">Thủ kho phụ trách: <strong>Trần Đình Trọng</strong></div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="panel-card mb-0 border-top border-warning border-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="fw-bold mb-0"><i class="bi bi-geo-alt-fill text-warning me-1"></i> Kho Sài Gòn (Miền Nam)</h6>
                <span class="badge bg-warning-subtle text-warning" id="whSgQty">0 SP</span>
              </div>
              <div class="fs-5 fw-bold text-warning" id="whSgVal">0 ₫</div>
              <div class="small text-secondary mt-1">Thủ kho phụ trách: <strong>Lê Hoàng Nam</strong></div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="panel-card mb-0 border-top border-success border-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="fw-bold mb-0"><i class="bi bi-building-fill-check text-success me-1"></i> Kho Tổng (Hub Phân Phối)</h6>
                <span class="badge bg-success-subtle text-success" id="whTongQty">0 SP</span>
              </div>
              <div class="fs-5 fw-bold text-success" id="whTongVal">0 ₫</div>
              <div class="small text-secondary mt-1">Quản lý điều phối: <strong>Nguyễn Minh Tuấn</strong></div>
            </div>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-lg-7">
            <div class="panel-card h-100 mb-0">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold mb-0"><i class="bi bi-bar-chart-line-fill text-primary me-2"></i>Giá Trị Tồn Kho Theo Mã Hàng (Top SKU)</h6>
                <span class="small text-secondary">Đơn vị: Triệu VNĐ</span>
              </div>
              <div style="height: 270px;">
                <canvas id="skuValueChart"></canvas>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="panel-card h-100 mb-0">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold mb-0"><i class="bi bi-pie-chart-fill text-success me-2"></i>Tỷ Trọng Giá Trị Tồn Giữa 3 Kho</h6>
                <span class="small text-secondary">Tự động cập nhật</span>
              </div>
              <div style="height: 270px;">
                <canvas id="warehousePieChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================ -->
      <!-- VIEW 2: DANH MỤC HÀNG HÓA & TỒN ĐA KHO (INVENTORY MATRIX) -->
      <!-- ================================================================ -->
      <div id="view-inventory" class="view-section d-none">
        <div class="panel-card">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h5 class="fw-bold mb-1"><i class="bi bi-box-seam text-primary me-2"></i>Danh Mục Hàng Hóa & Tồn Kho Thời Gian Thực</h5>
              <div class="small text-secondary">Bấm <strong>"+ Thêm Mã SKU"</strong> để thêm mặt hàng mới, <strong>"✏️ Sửa"</strong> để chỉnh sửa, hoặc <strong>"📒 Thẻ kho"</strong> để xem lịch sử vào/ra</div>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <input type="text" class="form-control form-control-sm" style="width:210px;" id="invSearchInput" placeholder="🔍 Tìm mã SKU, tên hàng, danh mục..." oninput="renderInventoryTable()">
              <select class="form-select form-select-sm" style="width:160px;" id="invAlertFilter" onchange="renderInventoryTable()">
                <option value="ALL">Tất cả trạng thái tồn</option>
                <option value="An toàn">🟢 Định mức an toàn</option>
                <option value="Sắp hết hàng">🟡 Cảnh báo sắp hết</option>
                <option value="Hết hàng">🔴 Đã hết hàng (Tồn = 0)</option>
              </select>
              <button class="btn btn-sm btn-outline-success fw-semibold" onclick="exportInventoryCsv()">
                <i class="bi bi-file-earmark-excel me-1"></i> Xuất Excel
              </button>
              <button class="btn btn-sm btn-primary fw-bold px-3" id="btnAddSku" onclick="openSkuModal()">
                <i class="bi bi-plus-circle-fill me-1"></i> + Thêm Mã SKU
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover table-bordered align-middle mb-0">
              <thead class="table-light text-center small text-uppercase">
                <tr>
                  <th class="sticky-col-left" style="min-width:110px;">Mã SKU</th>
                  <th class="text-start" style="min-width:210px;">Tên Hàng Hóa & Danh Mục</th>
                  <th>ĐVT</th>
                  <th>Giá Vốn BQ</th>
                  <th>Giá Bán Lẻ</th>
                  <th class="table-info">Kho HN</th>
                  <th class="table-warning">Kho SG</th>
                  <th class="table-success">Kho Tổng</th>
                  <th>Tồn Lọc</th>
                  <th>Giá Trị Tồn</th>
                  <th>Min</th>
                  <th>Trạng Thái</th>
                  <th style="min-width:195px;">Thao Tác</th>
                </tr>
              </thead>
              <tbody id="inventoryTbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ================================================================ -->
      <!-- VIEW 3: BÁO CÁO NHẬP - XUẤT - TỒN CHUẨN KẾ TOÁN (N-X-T REPORT) -->
      <!-- ================================================================ -->
      <div id="view-nxt" class="view-section d-none">
        <div class="panel-card">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h5 class="fw-bold mb-1"><i class="bi bi-table text-success me-2"></i>Báo Cáo Tổng Hợp Nhập – Xuất – Tồn (Số Lượng & Giá Trị Chuẩn Kế Toán)</h5>
              <div class="small text-secondary" id="nxtPeriodSubtitle">Kỳ báo cáo: Toàn thời gian • Kho: Tất cả các kho</div>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-success fw-semibold" onclick="exportNxtCsv()">
                <i class="bi bi-file-earmark-spreadsheet me-1"></i> Xuất Báo Cáo N-X-T (Excel)
              </button>
              <button class="btn btn-sm btn-primary fw-bold" onclick="printNxtReport()">
                <i class="bi bi-printer-fill me-1"></i> Xem Bản In & In Báo Cáo N-X-T
              </button>
            </div>
          </div>

          <div class="table-responsive" id="nxtTableWrapper">
            <table class="table table-bordered table-hover align-middle mb-0">
              <thead class="table-light text-center small">
                <tr>
                  <th rowspan="2">Mã SKU</th>
                  <th rowspan="2" class="text-start">Tên Hàng Hóa / Vật Tư</th>
                  <th rowspan="2">ĐVT</th>
                  <th rowspan="2">Đơn Giá Vốn BQ</th>
                  <th colspan="2" class="table-secondary">TỒN ĐẦU KỲ</th>
                  <th colspan="2" class="table-success">NHẬP TRONG KỲ</th>
                  <th colspan="2" class="table-danger">XUẤT TRONG KỲ</th>
                  <th colspan="2" class="table-primary">TỒN CUỐI KỲ</th>
                </tr>
                <tr>
                  <th class="table-secondary">SL</th>
                  <th class="table-secondary">Giá Trị (₫)</th>
                  <th class="table-success">SL</th>
                  <th class="table-success">Giá Trị (₫)</th>
                  <th class="table-danger">SL</th>
                  <th class="table-danger">Giá Trị (₫)</th>
                  <th class="table-primary">SL</th>
                  <th class="table-primary">Giá Trị (₫)</th>
                </tr>
              </thead>
              <tbody id="nxtReportTbody"></tbody>
              <tfoot class="table-light fw-bold" id="nxtReportTfoot"></tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- ================================================================ -->
      <!-- VIEW 4: SỔ CHỨNG TỪ & LỊCH SỬ NHÀ CUNG CẤP / KHÁCH HÀNG -->
      <!-- ================================================================ -->
      <div id="view-vouchers" class="view-section d-none">
        <div class="panel-card">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div class="d-flex align-items-center gap-2">
              <h5 class="fw-bold mb-0"><i class="bi bi-journal-check text-warning me-2"></i>Sổ Chứng Từ & Lịch Sử Giao Dịch Đối Tác</h5>
              <div class="btn-group btn-group-sm ms-2">
                <button class="btn btn-outline-primary active" id="subtab-voucher-list" onclick="switchVoucherSubTab('list')">
                  Danh Sách Phiếu Kho
                </button>
                <button class="btn btn-outline-primary" id="subtab-partner-history" onclick="switchVoucherSubTab('partners')">
                  Lịch Sử Theo NCC & Khách Hàng
                </button>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <input type="text" class="form-control form-control-sm" style="width:210px;" id="voucherSearchInput" placeholder="🔍 Tìm mã phiếu, đối tác, SKU..." oninput="renderVouchersView()">
              <select class="form-select form-select-sm" style="width:150px;" id="voucherTypeFilter" onchange="renderVouchersView()">
                <option value="ALL">Tất cả loại phiếu</option>
                <option value="Nhập kho">📥 Phiếu Nhập Kho</option>
                <option value="Xuất kho">📤 Phiếu Xuất Kho</option>
                <option value="Điều chuyển">🔄 Phiếu Điều Chuyển</option>
              </select>
              <button class="btn btn-sm btn-outline-success fw-semibold" onclick="exportVouchersCsv()">
                <i class="bi bi-download me-1"></i> Xuất Excel Sổ Phiếu
              </button>
            </div>
          </div>

          <div id="voucherListPane" class="table-responsive">
            <table class="table table-hover table-bordered align-middle mb-0">
              <thead class="table-light text-center small text-uppercase">
                <tr>
                  <th>Mã Phiếu</th>
                  <th>Ngày Giờ</th>
                  <th>Loại Phiếu</th>
                  <th>Mã SKU & Hàng Hóa</th>
                  <th>SL</th>
                  <th>Đơn Giá</th>
                  <th>Thành Tiền</th>
                  <th>Từ Kho ➔ Đến Kho</th>
                  <th>Đối Tác (NCC / Khách Hàng)</th>
                  <th>Người Lập</th>
                  <th>Biểu Mẫu In</th>
                </tr>
              </thead>
              <tbody id="vouchersTbody"></tbody>
            </table>
          </div>

          <div id="partnerHistoryPane" class="d-none">
            <div class="alert alert-info py-2 small mb-3">
              <i class="bi bi-info-circle-fill me-1"></i> Tổng hợp lịch sử giao dịch Nhập/Xuất theo từng <strong>Nhà Cung Cấp & Khách Hàng</strong> trong kỳ lọc hiện tại.
            </div>
            <div class="table-responsive">
              <table class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-light text-center small text-uppercase">
                  <tr>
                    <th class="text-start">Tên Nhà Cung Cấp / Khách Hàng / Đối Tác</th>
                    <th>Phân Loại Giao Dịch</th>
                    <th>Số Phiếu Phát Sinh</th>
                    <th>Tổng Số Lượng Hàng</th>
                    <th>Tổng Giá Trị Giao Dịch (₫)</th>
                    <th>Giao Dịch Gần Nhất</th>
                  </tr>
                </thead>
                <tbody id="partnerSummaryTbody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================ -->
      <!-- VIEW 5: QUẢN LÝ TÀI KHOẢN, PHÂN QUYỀN & NHẬT KÝ THAO TÁC (RBAC) -->
      <!-- ================================================================ -->
      <div id="view-rbac" class="view-section d-none">
        <div class="row g-3">
          <div class="col-lg-7">
            <div class="panel-card h-100 mb-0">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 class="fw-bold mb-0"><i class="bi bi-people-fill text-primary me-2"></i>Quản Lý Tài Khoản & Phân Quyền Theo Kho (Tab PHAN_QUYEN)</h6>
                  <div class="small text-secondary">Tạo tài khoản nhân viên, gán kho phụ trách và đổi mật khẩu đăng nhập</div>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-primary fw-semibold" onclick="openLoginModal()">
                    <i class="bi bi-box-arrow-in-right me-1"></i> Đăng Nhập TK Khác
                  </button>
                  <button class="btn btn-sm btn-primary fw-bold" onclick="openUserModal()">
                    <i class="bi bi-person-plus-fill me-1"></i> + Tạo Tài Khoản Mới
                  </button>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-bordered table-hover table-sm align-middle">
                  <thead class="table-light small text-center">
                    <tr>
                      <th>Username</th>
                      <th>Mật Khẩu</th>
                      <th>Họ Tên Nhân Sự</th>
                      <th>Vai Trò</th>
                      <th>Kho Phụ Trách</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody id="rbacUsersTbody"></tbody>
                </table>
              </div>
              <div class="small text-secondary mt-2">
                💡 <strong>Cơ chế phân quyền:</strong> Tài khoản có vai trò <code>KEEPER</code> (Thủ kho) chỉ được xem và lập phiếu cho đúng chi nhánh được gán. Tài khoản <code>ADMIN</code> và <code>ACCOUNTANT</code> được truy cập tất cả các kho.
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="panel-card h-100 mb-0">
              <h6 class="fw-bold mb-3"><i class="bi bi-clock-history text-danger me-2"></i>Nhật Ký Thao Tác Hệ Thống (Tab NHAT_KY - Audit Trail)</h6>
              <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                <table class="table table-bordered table-sm align-middle">
                  <thead class="table-light small text-center">
                    <tr>
                      <th>Thời Gian</th>
                      <th>Người Thao Tác</th>
                      <th>Hành Động</th>
                      <th>Chi Tiết</th>
                    </tr>
                  </thead>
                  <tbody id="auditLogsTbody"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================ -->
      <!-- VIEW 6: CẤU HÌNH DOANH NGHIỆP & TÙY BIẾN BIỂU MẪU IN -->
      <!-- ================================================================ -->
      <div id="view-settings" class="view-section d-none">
        <div class="panel-card" style="max-width: 820px;">
          <h5 class="fw-bold mb-1"><i class="bi bi-sliders text-primary me-2"></i>Cấu Hình Doanh Nghiệp & Biểu Mẫu In Ấn (Tab CAU_HINH)</h5>
          <p class="small text-secondary mb-3">
            Mọi thông tin cập nhật tại đây sẽ tự động đồng bộ vào trang tính <code>CAU_HINH</code> và áp dụng trực tiếp lên tiêu đề Phiếu Nhập Kho / Phiếu Xuất Kho / Báo Cáo Nhập-Xuất-Tồn.
          </p>

          <form onsubmit="handleSaveSettings(event)">
            <div class="row g-3">
              <div class="col-md-8">
                <label class="form-label fw-semibold small">Tên Doanh Nghiệp / Cửa Hàng (In góc trái trên phiếu)</label>
                <input type="text" class="form-control" id="cfgCompanyName" required>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold small">Mã Số Thuế</label>
                <input type="text" class="form-control" id="cfgCompanyTax">
              </div>
              <div class="col-md-8">
                <label class="form-label fw-semibold small">Địa Chỉ Trụ Sở / Kho Chính</label>
                <input type="text" class="form-control" id="cfgCompanyAddress">
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold small">Số Điện Thoại Hotline</label>
                <input type="text" class="form-control" id="cfgCompanyPhone">
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small">Phương Pháp Tính Giá Vốn Mặc Định</label>
                <select class="form-select" id="cfgCostingMethod">
                  <option value="WEIGHTED_AVERAGE">Bình quân gia quyền liên hoàn (Sau mỗi lần nhập)</option>
                  <option value="PERIODIC">Bình quân gia quyền cả kỳ dự trữ</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small">Tiêu Chuẩn Biểu Mẫu In (Góc phải phiếu)</label>
                <input type="text" class="form-control" id="cfgPrintStandard">
              </div>
            </div>
            <div class="mt-4 d-flex gap-2">
              <button type="submit" class="btn btn-primary fw-bold" id="btnSaveConfig">
                <i class="bi bi-save me-1"></i> Lưu Cấu Hình Doanh Nghiệp
              </button>
            </div>
          </form>
        </div>
      </div>

    </div><!-- /container-fluid -->
  </div><!-- /app-main -->
</div><!-- /app-wrapper -->

<!-- ====================================================================== -->
<!-- MODAL 1: LẬP PHIẾU NHẬP KHO / XUẤT KHO / ĐIỀU CHUYỂN KHO -->
<!-- ====================================================================== -->
<div class="modal fade" id="txModal" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title fw-bold" id="txModalTitle">Lập Phiếu Kho</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Loại Giao Dịch Kho</label>
            <select class="form-select fw-bold" id="txType" onchange="onTxTypeChange()">
              <option value="Nhập kho">📥 Nhập kho (Tăng tồn & Giá vốn)</option>
              <option value="Xuất kho">📤 Xuất kho (Giảm tồn kho xuất)</option>
              <option value="Điều chuyển">🔄 Điều chuyển nội bộ giữa 2 kho</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Ngày Chứng Từ</label>
            <input type="date" class="form-control" id="txDate">
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Người Lập Phiếu</label>
            <input type="text" class="form-control bg-light" id="txCreator" readonly>
          </div>

          <div class="col-md-8">
            <label class="form-label fw-semibold small">Chọn Mặt Hàng (SKU)</label>
            <select class="form-select" id="txSku" onchange="onTxSkuSelect()"></select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Tồn Kho Hiện Tại (HN / SG / Tổng)</label>
            <input type="text" class="form-control bg-light fw-bold text-primary" id="txStockPreview" readonly>
          </div>

          <div class="col-md-4">
            <label class="form-label fw-semibold small" id="lblFromWh">Từ Kho / Nguồn Hàng</label>
            <select class="form-select" id="txFromWh"></select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small" id="lblToWh">Đến Kho / Đích Nhận</label>
            <select class="form-select" id="txToWh"></select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Nhà Cung Cấp / Khách Hàng</label>
            <input type="text" class="form-control" id="txPartner" placeholder="Tên công ty / đối tác...">
          </div>

          <div class="col-md-4">
            <label class="form-label fw-semibold small">Số Lượng</label>
            <input type="number" class="form-control fw-bold" id="txQty" min="1" value="2" oninput="calcTxModalTotal()">
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Đơn Giá (VNĐ)</label>
            <input type="number" class="form-control" id="txPrice" min="0" step="10000" oninput="calcTxModalTotal()">
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold small">Thành Tiền Tự Động</label>
            <input type="text" class="form-control bg-success-subtle text-success fw-bold" id="txTotalPreview" readonly>
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold small">Diễn Giải / Ghi Chú Chứng Từ (In trên phiếu)</label>
            <input type="text" class="form-control" id="txNotes" placeholder="Nhập theo PO / Xuất theo hợp đồng số...">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        <button type="button" class="btn btn-primary fw-bold px-4" id="btnSubmitTx" onclick="submitTransaction()">
          <i class="bi bi-check2-circle me-1"></i> Ghi Sổ & Cập Nhật Tồn Kho
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ====================================================================== -->
<!-- MODAL 2: SỔ THẺ KHO CHI TIẾT MẶT HÀNG (STOCK CARD - MẪU S12-DN) -->
<!-- ====================================================================== -->
<div class="modal fade" id="stockCardModal" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title fw-bold">
          <i class="bi bi-journal-bookmark-fill me-2"></i>Sổ Thẻ Kho Chi Tiết Mặt Hàng (Mẫu S12-DN)
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="d-flex flex-wrap justify-content-between align-items-center bg-light p-3 rounded-3 mb-3 border">
          <div>
            <div class="fw-bold fs-5 text-dark" id="scItemTitle">--</div>
            <div class="small text-secondary" id="scItemMeta">--</div>
          </div>
          <div class="text-end">
            <div class="small text-secondary">Tồn cuối hiện tại (Toàn hệ thống):</div>
            <div class="h4 fw-bold text-primary mb-0" id="scCurrentTotal">--</div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle mb-0">
            <thead class="table-light text-center small text-uppercase">
              <tr>
                <th>Số Hiệu Chứng Từ</th>
                <th>Ngày Tháng</th>
                <th class="text-start">Diễn Giải & Đối Tác</th>
                <th>Kho Giao Dịch</th>
                <th class="table-success">SL Nhập (+)</th>
                <th class="table-danger">SL Xuất (-)</th>
                <th class="table-primary">Tồn Lũy Kế</th>
                <th>Người Thực Hiện</th>
              </tr>
            </thead>
            <tbody id="stockCardTbody"></tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        <button type="button" class="btn btn-primary fw-bold" onclick="printCurrentStockCard()">
          <i class="bi bi-printer-fill me-1"></i> Xem Bản In & In Sổ Thẻ Kho
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ====================================================================== -->
<!-- MODAL 3: XEM TRƯỚC BẢN IN & XUẤT PDF (DÙNG CHUNG CHO PHIẾU + BÁO CÁO N-X-T + THẺ KHO) -->
<!-- ====================================================================== -->
<div class="modal fade" id="printVoucherModal" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white no-print">
        <h5 class="modal-title fw-bold" id="printModalHeaderTitle"><i class="bi bi-printer-fill me-2"></i>Xem Trước Bản In Chuẩn Bộ Tài Chính</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body bg-secondary-subtle p-3" style="max-height: 78vh; overflow-y: auto;">
        <div id="printAreaContainer" class="voucher-print-box">
          <!-- Populated dynamically -->
        </div>
      </div>
      <div class="modal-footer no-print">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        <button type="button" class="btn btn-primary fw-bold px-4" onclick="executePrintNow()">
          <i class="bi bi-printer-fill me-1"></i> In Ngay / Lưu Thành PDF
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ====================================================================== -->
<!-- MODAL 4: THÊM MỚI / CẬP NHẬT MÃ HÀNG HÓA (SKU) -->
<!-- ====================================================================== -->
<div class="modal fade" id="skuModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title fw-bold" id="skuModalTitle">Thêm / Cập Nhật Danh Mục Hàng Hóa (SKU)</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="row g-3">
          <div class="col-md-5">
            <label class="form-label small fw-semibold">Mã SKU (*)</label>
            <input type="text" class="form-control fw-bold text-uppercase" id="fmSkuCode" placeholder="VD: SKU-CAM-A7S3">
          </div>
          <div class="col-md-7">
            <label class="form-label small fw-semibold">Danh Mục Nhóm Hàng</label>
            <input type="text" class="form-control" id="fmSkuCat" value="Thiết bị ghi hình">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">Tên Hàng Hóa / Quy Cách (*)</label>
            <input type="text" class="form-control" id="fmSkuName" placeholder="VD: Máy quay Sony Alpha A7S III Body">
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-semibold">Đơn Vị Tính</label>
            <input type="text" class="form-control" id="fmSkuUnit" value="Chiếc">
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-semibold">Giá Vốn BQ (₫)</label>
            <input type="number" class="form-control" id="fmSkuCost" value="65000000">
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-semibold">Giá Bán Lẻ (₫)</label>
            <input type="number" class="form-control" id="fmSkuSell" value="75000000">
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-semibold">Tồn Kho HN</label>
            <input type="number" class="form-control" id="fmSkuHn" value="2">
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-semibold">Tồn Kho SG</label>
            <input type="number" class="form-control" id="fmSkuSg" value="2">
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-semibold">Tồn Kho Tổng</label>
            <input type="number" class="form-control" id="fmSkuTong" value="4">
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-semibold">Định Mức Min</label>
            <input type="number" class="form-control" id="fmSkuMin" value="3">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
        <button type="button" class="btn btn-primary fw-bold px-4" id="btnSaveSkuSubmit" onclick="submitNewSku()">
          <i class="bi bi-check-lg me-1"></i> Lưu Mã Hàng Vào Sheet
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ====================================================================== -->
<!-- MODAL 5: ĐĂNG NHẬP TÀI KHOẢN HỆ THỐNG (AUTHENTICATION MODAL) -->
<!-- ====================================================================== -->
<div class="modal fade" id="loginModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title fw-bold"><i class="bi bi-shield-lock-fill text-info me-2"></i>Đăng Nhập Hệ Thống Kho Đa Kho</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form onsubmit="handleLoginSubmit(event)">
          <div class="mb-3">
            <label class="form-label small fw-bold">Tên Đăng Nhập (Username)</label>
            <input type="text" class="form-control fw-bold" id="loginUsernameInput" placeholder="VD: admin, ketoan, thukho_hn..." required>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Mật Khẩu</label>
            <input type="password" class="form-control" id="loginPasswordInput" value="123456" required>
          </div>
          <div id="loginErrorBox" class="alert alert-danger py-2 small d-none"></div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary fw-bold py-2">
              <i class="bi bi-box-arrow-in-right me-1"></i> Đăng Nhập Ngay
            </button>
          </div>
        </form>

        <div class="border-top mt-3 pt-3">
          <div class="small text-secondary fw-semibold mb-2">Chọn nhanh tài khoản có sẵn (Mật khẩu mặc định: <code>123456</code>):</div>
          <div class="d-flex flex-wrap gap-1" id="quickLoginChips"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ====================================================================== -->
<!-- MODAL 6: TẠO MỚI / CẬP NHẬT TÀI KHOẢN NHÂN SỰ (USER CRUD MODAL) -->
<!-- ====================================================================== -->
<div class="modal fade" id="userModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title fw-bold" id="userModalTitle"><i class="bi bi-person-plus-fill me-2"></i>Tạo / Cập Nhật Tài Khoản Nhân Sự</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Tên Đăng Nhập (Username) (*)</label>
            <input type="text" class="form-control fw-bold" id="ufUsername" placeholder="VD: thukho_danang">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Mật Khẩu Đăng Nhập (*)</label>
            <input type="text" class="form-control" id="ufPassword" value="123456">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">Họ Và Tên Nhân Sự (*)</label>
            <input type="text" class="form-control" id="ufFullName" placeholder="VD: Phạm Văn Khoa">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Vai Trò Phân Quyền</label>
            <select class="form-select fw-semibold" id="ufRole" onchange="onUserFormRoleChange()">
              <option value="ADMIN">ADMIN (Giám đốc - Toàn quyền)</option>
              <option value="ACCOUNTANT">ACCOUNTANT (Kế toán - Toàn kho)</option>
              <option value="KEEPER" selected>KEEPER (Thủ kho chi nhánh)</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Kho Chi Nhánh Phụ Trách</label>
            <select class="form-select fw-semibold" id="ufWarehouse">
              <option value="Kho Hà Nội">Kho Hà Nội (Miền Bắc)</option>
              <option value="Kho Sài Gòn">Kho Sài Gòn (Miền Nam)</option>
              <option value="Kho Tổng">Kho Tổng (Trung Tâm)</option>
              <option value="ALL">ALL (Tất cả các kho)</option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">Trạng Thái Tài Khoản</label>
            <select class="form-select" id="ufStatus">
              <option value="Hoạt động">🟢 Hoạt động</option>
              <option value="Tạm khóa">🔴 Tạm khóa</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
        <button type="button" class="btn btn-primary fw-bold px-4" id="btnSaveUserSubmit" onclick="submitUserAccount()">
          <i class="bi bi-check2-circle me-1"></i> Lưu Tài Khoản Vào Sheet
        </button>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
  const FALLBACK_DATA = {
    isFallback: true,
    settings: {
      COMPANY_NAME: 'CÔNG TY TNHH CÔNG NGHỆ & THIẾT BỊ NEXSIMPLE VIỆT NAM',
      COMPANY_ADDRESS: 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM',
      COMPANY_PHONE: '0974 755 104',
      COMPANY_TAX: '0318899221',
      COSTING_METHOD: 'WEIGHTED_AVERAGE',
      ALLOW_NEGATIVE_STOCK: 'FALSE',
      PRINT_TEMPLATE_STANDARD: 'Mẫu số 01-VT / 02-VT (Ban hành theo Thông tư 200/2014/TT-BTC Bộ Tài Chính)'
    },
    users: [
      { username: 'admin', password: '123456', fullName: 'Nguyễn Minh Tuấn', role: 'ADMIN', assignedWarehouse: 'ALL', permissionsDesc: 'Toàn quyền hệ thống (Tất cả các kho)', status: 'Hoạt động' },
      { username: 'ketoan', password: '123456', fullName: 'Hoàng Thu Trang', role: 'ACCOUNTANT', assignedWarehouse: 'ALL', permissionsDesc: 'Kế toán kho (Xem toàn kho, Lập phiếu, Xuất N-X-T)', status: 'Hoạt động' },
      { username: 'thukho_hn', password: '123456', fullName: 'Trần Đình Trọng', role: 'KEEPER', assignedWarehouse: 'Kho Hà Nội', permissionsDesc: 'Thủ kho chi nhánh (Chỉ phụ trách Kho Hà Nội)', status: 'Hoạt động' },
      { username: 'thukho_sg', password: '123456', fullName: 'Lê Hoàng Nam', role: 'KEEPER', assignedWarehouse: 'Kho Sài Gòn', permissionsDesc: 'Thủ kho chi nhánh (Chỉ phụ trách Kho Sài Gòn)', status: 'Hoạt động' }
    ],
    items: [
      { sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame Body', category: 'Thiết bị ghi hình', unit: 'Chiếc', costPrice: 72000000, sellingPrice: 85000000, openingStock: 9, stock_hanoi: 4, stock_saigon: 3, stock_tong: 5, totalStock: 12, inventoryValue: 864000000, minLimit: 4, alertStatus: 'An toàn' },
      { sku: 'SKU-LEN-2470', name: 'Ống kính Sony FE 24-70mm f/2.8 GM II', category: 'Ống kính', unit: 'Chiếc', costPrice: 38000000, sellingPrice: 46000000, openingStock: 10, stock_hanoi: 2, stock_saigon: 4, stock_tong: 6, totalStock: 12, inventoryValue: 456000000, minLimit: 4, alertStatus: 'An toàn' },
      { sku: 'SKU-DRO-M3C', name: 'Flycam DJI Mavic 3 Cine Premium Combo', category: 'Flycam & Drone', unit: 'Bộ', costPrice: 85000000, sellingPrice: 99000000, openingStock: 4, stock_hanoi: 1, stock_saigon: 1, stock_tong: 0, totalStock: 2, inventoryValue: 170000000, minLimit: 3, alertStatus: 'Sắp hết hàng' },
      { sku: 'SKU-LGT-600D', name: 'Đèn Aputure Light Storm LS 600d Pro', category: 'Ánh sáng Studio', unit: 'Bộ', costPrice: 42000000, sellingPrice: 49500000, openingStock: 15, stock_hanoi: 5, stock_saigon: 4, stock_tong: 8, totalStock: 17, inventoryValue: 714000000, minLimit: 5, alertStatus: 'An toàn' },
      { sku: 'SKU-MIC-EWDP', name: 'Micro Sennheiser EW-DP ME 2 Digital', category: 'Thiết bị âm thanh', unit: 'Bộ', costPrice: 14500000, sellingPrice: 18000000, openingStock: 18, stock_hanoi: 6, stock_saigon: 8, stock_tong: 10, totalStock: 24, inventoryValue: 348000000, minLimit: 6, alertStatus: 'An toàn' },
      { sku: 'SKU-GIM-RS3P', name: 'Gimbal Chống Rung DJI RS 3 Pro Combo', category: 'Phụ kiện Grip', unit: 'Chiếc', costPrice: 18000000, sellingPrice: 22500000, openingStock: 3, stock_hanoi: 1, stock_saigon: 1, stock_tong: 1, totalStock: 3, inventoryValue: 54000000, minLimit: 4, alertStatus: 'Sắp hết hàng' },
      { sku: 'SKU-MON-AT5', name: 'Màn hình Atomos Ninja V+ 5.2" 8K HDR', category: 'Thiết bị ghi hình', unit: 'Chiếc', costPrice: 19500000, sellingPrice: 24000000, openingStock: 6, stock_hanoi: 3, stock_saigon: 2, stock_tong: 4, totalStock: 9, inventoryValue: 175500000, minLimit: 3, alertStatus: 'An toàn' },
      { sku: 'SKU-BAT-V150', name: 'Pin V-Mount SmallRig VB155 Mini 155Wh', category: 'Phụ kiện Nguồn', unit: 'Viên', costPrice: 6200000, sellingPrice: 7900000, openingStock: 5, stock_hanoi: 0, stock_saigon: 0, stock_tong: 0, totalStock: 0, inventoryValue: 0, minLimit: 5, alertStatus: 'Hết hàng' }
    ],
    logs: [
      { code: 'PNK-2026-1001', timestamp: '2026-10-01 09:00', type: 'Nhập kho', sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame Body', unit: 'Chiếc', quantity: 5, unitPrice: 72000000, totalVal: 360000000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Hà Nội', partner: 'Công ty TNHH Sony Electronics VN', createdBy: 'Trần Đình Trọng', notes: 'Nhập lô máy quay chính hãng CO/CQ đợt 1' },
      { code: 'PNK-2026-1002', timestamp: '2026-10-03 10:20', type: 'Nhập kho', sku: 'SKU-LEN-2470', name: 'Ống kính Sony FE 24-70mm f/2.8 GM II', unit: 'Chiếc', quantity: 4, unitPrice: 38000000, totalVal: 152000000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Sài Gòn', partner: 'Công ty TNHH Sony Electronics VN', createdBy: 'Lê Hoàng Nam', notes: 'Nhập bổ sung ống kính GM II cho chi nhánh Nam' },
      { code: 'PXK-2026-1005', timestamp: '2026-10-05 14:15', type: 'Xuất kho', sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame Body', unit: 'Chiếc', quantity: 2, unitPrice: 85000000, totalVal: 170000000, fromWarehouse: 'Kho Hà Nội', toWarehouse: 'Giao khách hàng', partner: 'Đài Truyền Hình Kỹ Thuật Số VTC', createdBy: 'Trần Đình Trọng', notes: 'Xuất bán theo Hợp đồng kinh tế số 88/HĐKT' },
      { code: 'PDC-2026-1007', timestamp: '2026-10-07 11:30', type: 'Điều chuyển', sku: 'SKU-LGT-600D', name: 'Đèn Aputure Light Storm LS 600d Pro', unit: 'Bộ', quantity: 3, unitPrice: 42000000, totalVal: 126000000, fromWarehouse: 'Kho Tổng', toWarehouse: 'Kho Hà Nội', partner: 'Điều chuyển nội bộ hệ thống', createdBy: 'Nguyễn Minh Tuấn', notes: 'Luân chuyển thiết bị ánh sáng tăng cường miền Bắc' },
      { code: 'PNK-2026-1009', timestamp: '2026-10-09 08:45', type: 'Nhập kho', sku: 'SKU-MIC-EWDP', name: 'Micro Sennheiser EW-DP ME 2 Digital', unit: 'Bộ', quantity: 6, unitPrice: 14500000, totalVal: 87000000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Tổng', partner: 'Nhà Phân Phối Âm Thanh Hoàng Bảo Khoa', createdBy: 'Hoàng Thu Trang', notes: 'Nhập kho tổng phân phối toàn quốc' },
      { code: 'PXK-2026-1011', timestamp: '2026-10-11 16:00', type: 'Xuất kho', sku: 'SKU-DRO-M3C', name: 'Flycam DJI Mavic 3 Cine Premium Combo', unit: 'Bộ', quantity: 2, unitPrice: 99000000, totalVal: 198000000, fromWarehouse: 'Kho Sài Gòn', toWarehouse: 'Giao khách hàng', partner: 'Production House RedPixel Studio', createdBy: 'Lê Hoàng Nam', notes: 'Xuất bán trọn bộ kèm gói bảo hành DJI Care' },
      { code: 'PXK-2026-1013', timestamp: '2026-10-13 15:10', type: 'Xuất kho', sku: 'SKU-LEN-2470', name: 'Ống kính Sony FE 24-70mm f/2.8 GM II', unit: 'Chiếc', quantity: 2, unitPrice: 46000000, totalVal: 92000000, fromWarehouse: 'Kho Sài Gòn', toWarehouse: 'Giao khách hàng', partner: 'Production House RedPixel Studio', createdBy: 'Lê Hoàng Nam', notes: 'Xuất kèm đơn hàng Flycam RedPixel' },
      { code: 'PNK-2026-1015', timestamp: '2026-10-15 09:30', type: 'Nhập kho', sku: 'SKU-MON-AT5', name: 'Màn hình Atomos Ninja V+ 5.2" 8K HDR', unit: 'Chiếc', quantity: 3, unitPrice: 19500000, totalVal: 58500000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Hà Nội', partner: 'Công ty Cổ phần Thiết Bị Phim Trường Việt', createdBy: 'Trần Đình Trọng', notes: 'Nhập màn hình monitor 8K phục vụ dự án Q4' }
    ],
    auditLogs: [
      { timestamp: '2026-10-15 09:30:12', username: 'thukho_hn', actorName: 'Trần Đình Trọng (KEEPER)', action: 'LẬP PHIẾU NHẬP KHO', refCode: 'PNK-2026-1015', detail: 'Nhập 3 Chiếc [SKU-MON-AT5] vào Kho Hà Nội. Cập nhật giá vốn bình quân.' },
      { timestamp: '2026-10-13 15:10:05', username: 'thukho_sg', actorName: 'Lê Hoàng Nam (KEEPER)', action: 'LẬP PHIẾU XUẤT KHO', refCode: 'PXK-2026-1013', detail: 'Xuất 2 Chiếc [SKU-LEN-2470] từ Kho Sài Gòn cho RedPixel Studio.' },
      { timestamp: '2026-10-07 11:30:00', username: 'admin', actorName: 'Nguyễn Minh Tuấn (ADMIN)', action: 'ĐIỀU CHUYỂN KHO', refCode: 'PDC-2026-1007', detail: 'Điều chuyển 3 Bộ [SKU-LGT-600D] từ Kho Tổng -> Kho Hà Nội.' }
    ]
  };

  let appData = JSON.parse(JSON.stringify(FALLBACK_DATA));
  let currentUser = null;
  let isAuthenticated = false;
  let isDataReady = false;
  let currentStockCardSku = '';
  let skuChartInstance = null;
  let pieChartInstance = null;

  function toggleGatePassVisibility() {
    const inp = document.getElementById('gatePassword');
    const eye = document.getElementById('gatePassEye');
    if (inp.type === 'password') {
      inp.type = 'text';
      eye.className = 'bi bi-eye-slash';
    } else {
      inp.type = 'password';
      eye.className = 'bi bi-eye';
    }
  }

  function handleMandatoryLogin(e) {
    e.preventDefault();
    const u = (document.getElementById('gateUsername').value || '').trim().toLowerCase();
    const p = (document.getElementById('gatePassword').value || '').trim();
    const errEl = document.getElementById('gateErrorAlert');

    const matched = (appData.users || []).find(acc =>
      String(acc.username || '').trim().toLowerCase() === u &&
      String(acc.password || '').trim() === p
    );

    if (!matched) {
      errEl.innerHTML = '<i class="bi bi-exclamation-octagon-fill me-1"></i> Sai tên đăng nhập hoặc mật khẩu! Vui lòng kiểm tra lại trong tab <code>PHAN_QUYEN</code>.';
      errEl.classList.remove('d-none');
      return;
    }

    if (String(matched.status || '').trim() === 'Tạm khóa') {
      errEl.innerHTML = '<i class="bi bi-lock-fill me-1"></i> Tài khoản <strong>' + matched.username + '</strong> đã bị tạm khóa! Vui lòng liên hệ Quản trị viên.';
      errEl.classList.remove('d-none');
      return;
    }

    errEl.classList.add('d-none');
    isAuthenticated = true;
    document.getElementById('authGateScreen').classList.add('d-none');
    document.getElementById('mainAppWrapper').classList.remove('d-none');
    applyCurrentUserSession(matched);
  }

  function handleLogout() {
    isAuthenticated = false;
    currentUser = null;
    document.getElementById('mainAppWrapper').classList.add('d-none');
    document.getElementById('authGateScreen').classList.remove('d-none');
    document.getElementById('gatePassword').value = '';
    document.getElementById('gateErrorAlert').classList.add('d-none');
    document.getElementById('gateUsername').focus();
  }

  function formatVND(val) {
    return new Intl.NumberFormat('vi-VN').format(Math.round(Number(val) || 0)) + ' ₫';
  }

  function toggleSidebar() {
    document.getElementById('appSidebar').classList.toggle('collapsed');
  }

  function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-bs-theme') === 'dark';
    html.setAttribute('data-bs-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeIcon').className = isDark ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill text-warning';
  }

  function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('d-none'));
    document.getElementById('view-' + viewId).classList.remove('d-none');

    document.querySelectorAll('.nav-menu-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('nav-' + viewId).classList.add('active');

    refreshAllViews();
  }

  function switchVoucherSubTab(mode) {
    const isList = mode === 'list';
    document.getElementById('subtab-voucher-list').classList.toggle('active', isList);
    document.getElementById('subtab-partner-history').classList.toggle('active', !isList);
    document.getElementById('voucherListPane').classList.toggle('d-none', !isList);
    document.getElementById('partnerHistoryPane').classList.toggle('d-none', isList);
  }

  function resetDateFilter() {
    document.getElementById('filterStartDate').value = '2026-01-01';
    document.getElementById('filterEndDate').value = '2026-12-31';
    refreshAllViews();
  }

  function syncRoleDropdownOptions() {
    // Đã khóa chuyển đổi tự do; hàm giữ lại để tương thích khi cập nhật danh sách user
  }

  function applyCurrentUserSession(userObj) {
    currentUser = userObj || appData.users[0];
    const isAdmin = currentUser.role === 'ADMIN';

    document.getElementById('sidebarUsername').innerText = currentUser.username;
    document.getElementById('topUserBadge').innerText = currentUser.fullName + ' (' + currentUser.username + ')';
    document.getElementById('topRoleBadge').innerText = currentUser.role;
    document.getElementById('sidebarRoleBadge').innerText = currentUser.role;
    document.getElementById('sidebarUserName').innerText = currentUser.fullName;

    // Phân quyền hiển thị menu Quản trị & Tạo tài khoản (Chỉ ADMIN mới thấy)
    const navRbac = document.getElementById('nav-rbac');
    const navSettings = document.getElementById('nav-settings');
    const btnTopCreate = document.getElementById('btnTopCreateUser');
    const btnSideCreate = document.getElementById('btnSidebarCreateUser');

    if (navRbac) navRbac.classList.toggle('d-none', !isAdmin);
    if (navSettings) navSettings.classList.toggle('d-none', !isAdmin);
    if (btnTopCreate) btnTopCreate.classList.toggle('d-none', !isAdmin);
    if (btnSideCreate) btnSideCreate.classList.toggle('d-none', !isAdmin);

    // Nếu không phải Admin mà đang ở tab Quản trị thì chuyển về Tổng quan
    if (!isAdmin) {
      const rbacSec = document.getElementById('view-rbac');
      const cfgSec = document.getElementById('view-settings');
      if ((rbacSec && !rbacSec.classList.contains('d-none')) || (cfgSec && !cfgSec.classList.contains('d-none'))) {
        switchView('dashboard');
      }
    }

    const whSelect = document.getElementById('globalWarehouseFilter');
    if (currentUser.role === 'KEEPER' && currentUser.assignedWarehouse !== 'ALL') {
      whSelect.value = currentUser.assignedWarehouse;
      whSelect.disabled = true;
      document.getElementById('sidebarWhScope').innerHTML = '<i class="bi bi-lock-fill"></i> Khóa quyền: ' + currentUser.assignedWarehouse;
    } else {
      whSelect.disabled = false;
      whSelect.value = 'ALL';
      document.getElementById('sidebarWhScope').innerHTML = '<i class="bi bi-geo-alt-fill"></i> Phạm vi: Tất cả các kho';
    }

    const btnAddSku = document.getElementById('btnAddSku');
    if (btnAddSku) btnAddSku.disabled = false;

    refreshAllViews();
  }

  function onQuickRoleChange() {
    const uname = document.getElementById('quickRoleSelect').value;
    const found = appData.users.find(u => u.username === uname) || appData.users[0];
    applyCurrentUserSession(found);
  }

  // ==========================================================================
  // ĐĂNG NHẬP & QUẢN LÝ TÀI KHOẢN (FIX LỖI 1)
  // ==========================================================================
  function openLoginModal() {
    document.getElementById('loginUsernameInput').value = currentUser.username || 'admin';
    document.getElementById('loginPasswordInput').value = currentUser.password || '123456';
    document.getElementById('loginErrorBox').classList.add('d-none');

    const chips = document.getElementById('quickLoginChips');
    chips.innerHTML = (appData.users || []).map(u => `
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="quickFillLogin('${u.username}', '${u.password || '123456'}')">
        <strong>${u.username}</strong> (${u.fullName})
      </button>
    `).join('');

    new bootstrap.Modal(document.getElementById('loginModal')).show();
  }

  function quickFillLogin(u, p) {
    document.getElementById('loginUsernameInput').value = u;
    document.getElementById('loginPasswordInput').value = p;
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const u = document.getElementById('loginUsernameInput').value.trim().toLowerCase();
    const p = document.getElementById('loginPasswordInput').value.trim();
    const errBox = document.getElementById('loginErrorBox');

    const matched = (appData.users || []).find(acc =>
      acc.username.toLowerCase() === u && String(acc.password || '123456') === p
    );

    if (!matched) {
      errBox.innerText = 'Sai tên đăng nhập hoặc mật khẩu! Vui lòng kiểm tra lại.';
      errBox.classList.remove('d-none');
      return;
    }
    if (matched.status === 'Tạm khóa') {
      errBox.innerText = 'Tài khoản này đang bị tạm khóa! Vui lòng liên hệ Admin.';
      errBox.classList.remove('d-none');
      return;
    }

    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    applyCurrentUserSession(matched);
  }

  function openUserModal(editUsername) {
    const uInput = document.getElementById('ufUsername');
    if (editUsername) {
      const existing = appData.users.find(u => u.username === editUsername);
      if (existing) {
        document.getElementById('userModalTitle').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Cập Nhật Tài Khoản: ' + existing.username;
        uInput.value = existing.username;
        uInput.readOnly = true;
        document.getElementById('ufPassword').value = existing.password || '123456';
        document.getElementById('ufFullName').value = existing.fullName || '';
        document.getElementById('ufRole').value = existing.role || 'KEEPER';
        document.getElementById('ufWarehouse').value = existing.assignedWarehouse || 'Kho Hà Nội';
        document.getElementById('ufStatus').value = existing.status || 'Hoạt động';
      }
    } else {
      document.getElementById('userModalTitle').innerHTML = '<i class="bi bi-person-plus-fill me-2"></i>Tạo Tài Khoản Nhân Sự Mới';
      uInput.value = '';
      uInput.readOnly = false;
      document.getElementById('ufPassword').value = '123456';
      document.getElementById('ufFullName').value = '';
      document.getElementById('ufRole').value = 'KEEPER';
      document.getElementById('ufWarehouse').value = 'Kho Hà Nội';
      document.getElementById('ufStatus').value = 'Hoạt động';
    }
    onUserFormRoleChange();
    new bootstrap.Modal(document.getElementById('userModal')).show();
  }

  function onUserFormRoleChange() {
    const r = document.getElementById('ufRole').value;
    const whSel = document.getElementById('ufWarehouse');
    if (r === 'ADMIN' || r === 'ACCOUNTANT') {
      whSel.value = 'ALL';
      whSel.disabled = true;
    } else {
      whSel.disabled = false;
      if (whSel.value === 'ALL') whSel.value = 'Kho Hà Nội';
    }
  }

  function submitUserAccount() {
    const uname = document.getElementById('ufUsername').value.trim().toLowerCase();
    const pass = document.getElementById('ufPassword').value.trim() || '123456';
    const fullName = document.getElementById('ufFullName').value.trim();
    const role = document.getElementById('ufRole').value;
    const wh = (role === 'ADMIN' || role === 'ACCOUNTANT') ? 'ALL' : document.getElementById('ufWarehouse').value;
    const status = document.getElementById('ufStatus').value;

    if (!uname || !fullName) {
      alert('Vui lòng nhập đầy đủ Tên đăng nhập (Username) và Họ tên nhân sự!');
      return;
    }

    const payload = {
      username: uname,
      password: pass,
      fullName: fullName,
      role: role,
      assignedWarehouse: wh,
      status: status,
      actorUsername: currentUser.username,
      actorName: currentUser.fullName
    };

    const btn = document.getElementById('btnSaveUserSubmit');
    btn.disabled = true;
    btn.innerText = 'Đang lưu...';

    // Cập nhật ngay trên giao diện local
    const idx = appData.users.findIndex(u => u.username.toLowerCase() === uname);
    const userRecord = {
      username: uname,
      password: pass,
      fullName: fullName,
      role: role,
      assignedWarehouse: wh,
      permissionsDesc: role === 'ADMIN' ? 'Toàn quyền hệ thống' : (role === 'ACCOUNTANT' ? 'Kế toán toàn kho' : 'Thủ kho ' + wh),
      status: status
    };
    if (idx >= 0) appData.users[idx] = userRecord;
    else appData.users.push(userRecord);

    syncRoleDropdownOptions();
    renderRbacAndAudit();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(function(res) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Lưu Tài Khoản Vào Sheet';
          bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
          alert(res && res.message ? res.message : 'Đã lưu tài khoản vào tab PHAN_QUYEN!');
          loadData();
        })
        .withFailureHandler(function() {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Lưu Tài Khoản Vào Sheet';
          bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
          alert('Đã lưu tài khoản [' + uname + '] trên phiên làm việc! (Lưu ý: Cập nhật Code.gs mới nhất để ghi xuống Sheet)');
        })
        .saveUserAccount(payload);
    } else {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Lưu Tài Khoản Vào Sheet';
      bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
      alert('Đã tạo/cập nhật tài khoản [' + uname + '] thành công!');
    }
  }

  function removeUserAccount(uname) {
    if (uname === 'admin') {
      alert('Không thể xóa tài khoản Quản trị viên gốc (admin)!');
      return;
    }
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản [' + uname + '] không?')) return;

    appData.users = appData.users.filter(u => u.username !== uname);
    syncRoleDropdownOptions();
    renderRbacAndAudit();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(function(res) {
          if (res && res.message) alert(res.message);
        })
        .deleteUserAccount(uname, currentUser.fullName);
    }
  }

  // ==========================================================================
  // CORE DATA HELPERS
  // ==========================================================================
  function getItemStockByWh(item, whFilter) {
    if (whFilter === 'Kho Hà Nội') return item.stock_hanoi;
    if (whFilter === 'Kho Sài Gòn') return item.stock_saigon;
    if (whFilter === 'Kho Tổng') return item.stock_tong;
    return item.stock_hanoi + item.stock_saigon + item.stock_tong;
  }

  function getFilteredLogs() {
    const startStr = document.getElementById('filterStartDate').value || '2000-01-01';
    const endStr = document.getElementById('filterEndDate').value || '2099-12-31';
    const whFilter = document.getElementById('globalWarehouseFilter').value;

    return appData.logs.filter(log => {
      const logDate = (log.timestamp || '').substring(0, 10);
      const matchDate = (!logDate) || (logDate >= startStr && logDate <= endStr);
      const matchWh = whFilter === 'ALL' || log.fromWarehouse === whFilter || log.toWarehouse === whFilter;
      return matchDate && matchWh;
    });
  }

  function loadData() {
    const badge = document.getElementById('connBadge');
    const authStatus = document.getElementById('authSyncStatus');
    badge.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Đang đồng bộ...';

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(function(res) {
          if (res && res.success) {
            appData = res;
            if (!appData.users || appData.users.length === 0) {
              appData.users = JSON.parse(JSON.stringify(FALLBACK_DATA.users));
            }
            badge.innerHTML = res.isFallback
              ? '<i class="bi bi-lightning-charge-fill me-1"></i> Chế độ Demo Độc Lập'
              : '<i class="bi bi-cloud-check-fill me-1"></i> Đồng bộ Google Sheets';
            if (authStatus) {
              authStatus.className = 'badge bg-success-subtle text-success border border-success-subtle';
              authStatus.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Đã kết nối (' + appData.users.length + ' tài khoản trên Sheet)';
            }
          }
          isDataReady = true;
          populateSettingsForm();
          if (appData.settings && appData.settings.COMPANY_NAME) {
            document.getElementById('authGateCompanySub').innerText = appData.settings.COMPANY_NAME;
          }
          // Chỉ cập nhật giao diện nếu người dùng ĐÃ đăng nhập
          if (isAuthenticated && currentUser) {
            const refreshedUser = appData.users.find(u => u.username.toLowerCase() === currentUser.username.toLowerCase()) || currentUser;
            applyCurrentUserSession(refreshedUser);
          }
        })
        .withFailureHandler(function() {
          appData = JSON.parse(JSON.stringify(FALLBACK_DATA));
          isDataReady = true;
          badge.innerHTML = '<i class="bi bi-lightning-charge-fill me-1"></i> Dữ liệu Fallback';
          if (authStatus) {
            authStatus.className = 'badge bg-warning-subtle text-dark';
            authStatus.innerHTML = '<i class="bi bi-laptop me-1"></i> Sẵn sàng đăng nhập';
          }
          populateSettingsForm();
          if (isAuthenticated && currentUser) {
            applyCurrentUserSession(currentUser);
          }
        })
        .getWarehouseData();
    } else {
      appData = JSON.parse(JSON.stringify(FALLBACK_DATA));
      isDataReady = true;
      badge.innerHTML = '<i class="bi bi-laptop me-1"></i> Chế độ Standalone Pro';
      if (authStatus) {
        authStatus.className = 'badge bg-success-subtle text-success border border-success-subtle';
        authStatus.innerHTML = '<i class="bi bi-shield-check me-1"></i> Hệ thống sẵn sàng xác thực';
      }
      populateSettingsForm();
      if (isAuthenticated && currentUser) {
        applyCurrentUserSession(currentUser);
      }
    }
  }

  function populateSettingsForm() {
    const s = appData.settings || FALLBACK_DATA.settings;
    document.getElementById('topbarCompanyTitle').innerText = s.COMPANY_NAME || 'HỆ THỐNG QUẢN LÝ KHO ĐA KHO';
    document.getElementById('cfgCompanyName').value = s.COMPANY_NAME || '';
    document.getElementById('cfgCompanyTax').value = s.COMPANY_TAX || '';
    document.getElementById('cfgCompanyAddress').value = s.COMPANY_ADDRESS || '';
    document.getElementById('cfgCompanyPhone').value = s.COMPANY_PHONE || '';
    document.getElementById('cfgCostingMethod').value = s.COSTING_METHOD || 'WEIGHTED_AVERAGE';
    document.getElementById('cfgPrintStandard').value = s.PRINT_TEMPLATE_STANDARD || '';
  }

  function refreshAllViews() {
    renderDashboard();
    renderInventoryTable();
    renderNxtReport();
    renderVouchersView();
    renderRbacAndAudit();
  }

  // ==========================================================================
  // RENDER 1: DASHBOARD & CHARTS
  // ==========================================================================
  function renderDashboard() {
    const whFilter = document.getElementById('globalWarehouseFilter').value;
    const costMethod = document.getElementById('costingMethodSelect').value;
    const periodLogs = getFilteredLogs();

    let totalQty = 0, totalVal = 0, alertCount = 0;
    let hnQty = 0, hnVal = 0, sgQty = 0, sgVal = 0, tongQty = 0, tongVal = 0;

    appData.items.forEach(it => {
      const unitCost = costMethod === 'PERIODIC' ? Math.round(it.costPrice * 0.985) : it.costPrice;
      const q = getItemStockByWh(it, whFilter);
      totalQty += q;
      totalVal += q * unitCost;
      if (q <= it.minLimit) alertCount++;

      hnQty += it.stock_hanoi;
      hnVal += it.stock_hanoi * unitCost;
      sgQty += it.stock_saigon;
      sgVal += it.stock_saigon * unitCost;
      tongQty += it.stock_tong;
      tongVal += it.stock_tong * unitCost;
    });

    let inQty = 0, outQty = 0;
    periodLogs.forEach(l => {
      if (l.type === 'Nhập kho') inQty += l.quantity;
      else if (l.type === 'Xuất kho') outQty += l.quantity;
    });

    document.getElementById('kpiTotalQty').innerText = totalQty.toLocaleString('vi-VN') + ' ĐV';
    document.getElementById('kpiTotalSkuSub').innerText = 'Quản lý ' + appData.items.length + ' mã SKU • Phạm vi: ' + (whFilter === 'ALL' ? 'Toàn hệ thống' : whFilter);
    document.getElementById('kpiTotalVal').innerText = formatVND(totalVal);
    document.getElementById('kpiCostMethodSub').innerText = costMethod === 'WEIGHTED_AVERAGE' ? 'Phương pháp: Bình quân liên hoàn' : 'Phương pháp: Bình quân cuối kỳ';
    document.getElementById('kpiPeriodInOut').innerHTML = '<span class="text-success">+' + inQty + ' Nhập</span> / <span class="text-danger">-' + outQty + ' Xuất</span>';
    document.getElementById('kpiPeriodCountSub').innerText = periodLogs.length + ' phiếu kho trong kỳ lọc';
    document.getElementById('kpiAlertCount').innerText = alertCount + ' SKU';

    document.getElementById('whHnQty').innerText = hnQty + ' SP';
    document.getElementById('whHnVal').innerText = formatVND(hnVal);
    document.getElementById('whSgQty').innerText = sgQty + ' SP';
    document.getElementById('whSgVal').innerText = formatVND(sgVal);
    document.getElementById('whTongQty').innerText = tongQty + ' SP';
    document.getElementById('whTongVal').innerText = formatVND(tongVal);

    if (typeof Chart !== 'undefined') {
      const labels = appData.items.map(i => i.sku.replace('SKU-', ''));
      const valuesM = appData.items.map(i => Math.round((getItemStockByWh(i, whFilter) * i.costPrice) / 1000000));

      const ctxBar = document.getElementById('skuValueChart');
      if (skuChartInstance) skuChartInstance.destroy();
      skuChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Giá trị tồn kho (Triệu ₫)',
            data: valuesM,
            backgroundColor: '#0284c7',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });

      const ctxPie = document.getElementById('warehousePieChart');
      if (pieChartInstance) pieChartInstance.destroy();
      pieChartInstance = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
          labels: ['Kho Hà Nội', 'Kho Sài Gòn', 'Kho Tổng'],
          datasets: [{
            data: [Math.round(hnVal / 1000000), Math.round(sgVal / 1000000), Math.round(tongVal / 1000000)],
            backgroundColor: ['#0284c7', '#f59e0b', '#10b981']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  }

  // ==========================================================================
  // RENDER 2: INVENTORY TABLE (FIX CỘT TRÁI STICKY & NÚT SỬA / THÊM SKU)
  // ==========================================================================
  function renderInventoryTable() {
    const q = (document.getElementById('invSearchInput').value || '').toLowerCase().trim();
    const alertFilter = document.getElementById('invAlertFilter').value;
    const whFilter = document.getElementById('globalWarehouseFilter').value;
    const tbody = document.getElementById('inventoryTbody');

    const filtered = appData.items.filter(it => {
      const stockInScope = getItemStockByWh(it, whFilter);
      const statusInScope = stockInScope <= 0 ? 'Hết hàng' : (stockInScope <= it.minLimit ? 'Sắp hết hàng' : 'An toàn');
      const matchSearch = !q || it.sku.toLowerCase().includes(q) || it.name.toLowerCase().includes(q) || it.category.toLowerCase().includes(q);
      const matchAlert = alertFilter === 'ALL' || statusInScope === alertFilter;
      return matchSearch && matchAlert;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="13" class="text-center py-4 text-secondary">Không tìm thấy mặt hàng phù hợp bộ lọc</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(it => {
      const stockInScope = getItemStockByWh(it, whFilter);
      const statusInScope = stockInScope <= 0 ? 'Hết hàng' : (stockInScope <= it.minLimit ? 'Sắp hết hàng' : 'An toàn');
      let badgeCls = 'badge-safe';
      if (statusInScope === 'Sắp hết hàng') badgeCls = 'badge-low';
      if (statusInScope === 'Hết hàng') badgeCls = 'badge-out';

      return `
        <tr>
          <td class="fw-bold text-primary text-center sticky-col-left">${it.sku}</td>
          <td>
            <div class="fw-bold">${it.name}</div>
            <div class="small text-secondary">${it.category}</div>
          </td>
          <td class="text-center">${it.unit}</td>
          <td class="text-end fw-semibold">${formatVND(it.costPrice)}</td>
          <td class="text-end text-secondary">${formatVND(it.sellingPrice)}</td>
          <td class="text-center fw-bold table-info">${it.stock_hanoi}</td>
          <td class="text-center fw-bold table-warning">${it.stock_saigon}</td>
          <td class="text-center fw-bold table-success">${it.stock_tong}</td>
          <td class="text-center fw-bold fs-6">${stockInScope}</td>
          <td class="text-end fw-bold text-success">${formatVND(stockInScope * it.costPrice)}</td>
          <td class="text-center text-secondary">${it.minLimit}</td>
          <td class="text-center"><span class="badge ${badgeCls}">${statusInScope}</span></td>
          <td class="text-center">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary fw-semibold" onclick="openStockCard('${it.sku}')" title="Xem Sổ Thẻ Kho">
                📒 Thẻ kho
              </button>
              <button class="btn btn-outline-secondary" onclick="openSkuModal('${it.sku}')" title="Sửa thông tin mã hàng">
                ✏️ Sửa
              </button>
              <button class="btn btn-outline-success" onclick="openTxModal('Nhập kho', '${it.sku}')" title="Nhập kho">
                +Nhập
              </button>
              <button class="btn btn-outline-danger" onclick="openTxModal('Xuất kho', '${it.sku}')" title="Xuất kho">
                -Xuất
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================================================
  // RENDER 3: BÁO CÁO NHẬP - XUẤT - TỒN CHUẨN KẾ TOÁN (N-X-T)
  // ==========================================================================
  function renderNxtReport() {
    const startStr = document.getElementById('filterStartDate').value;
    const endStr = document.getElementById('filterEndDate').value;
    const whFilter = document.getElementById('globalWarehouseFilter').value;
    const periodLogs = getFilteredLogs();

    document.getElementById('nxtPeriodSubtitle').innerText =
      `Kỳ báo cáo: Từ ${startStr} đến ${endStr} • Phạm vi kho: ${whFilter === 'ALL' ? 'Tất cả các kho' : whFilter}`;

    let sumOpenQty = 0, sumOpenVal = 0;
    let sumInQty = 0, sumInVal = 0;
    let sumOutQty = 0, sumOutVal = 0;
    let sumCloseQty = 0, sumCloseVal = 0;

    const rowsHtml = appData.items.map(it => {
      let inQty = 0, outQty = 0;
      periodLogs.forEach(l => {
        if (l.sku !== it.sku) return;
        if (l.type === 'Nhập kho') {
          if (whFilter === 'ALL' || l.toWarehouse === whFilter) inQty += l.quantity;
        } else if (l.type === 'Xuất kho') {
          if (whFilter === 'ALL' || l.fromWarehouse === whFilter) outQty += l.quantity;
        } else if (l.type === 'Điều chuyển') {
          if (whFilter !== 'ALL') {
            if (l.toWarehouse === whFilter) inQty += l.quantity;
            if (l.fromWarehouse === whFilter) outQty += l.quantity;
          }
        }
      });

      const closeQty = getItemStockByWh(it, whFilter);
      const openQty = Math.max(0, closeQty - inQty + outQty);

      const openVal = openQty * it.costPrice;
      const inVal = inQty * it.costPrice;
      const outVal = outQty * it.costPrice;
      const closeVal = closeQty * it.costPrice;

      sumOpenQty += openQty; sumOpenVal += openVal;
      sumInQty += inQty; sumInVal += inVal;
      sumOutQty += outQty; sumOutVal += outVal;
      sumCloseQty += closeQty; sumCloseVal += closeVal;

      return `
        <tr>
          <td class="fw-bold text-center text-primary">${it.sku}</td>
          <td class="fw-semibold">${it.name}</td>
          <td class="text-center">${it.unit}</td>
          <td class="text-end">${formatVND(it.costPrice)}</td>
          <td class="text-center fw-semibold">${openQty}</td>
          <td class="text-end">${formatVND(openVal)}</td>
          <td class="text-center fw-bold text-success">${inQty}</td>
          <td class="text-end text-success">${formatVND(inVal)}</td>
          <td class="text-center fw-bold text-danger">${outQty}</td>
          <td class="text-end text-danger">${formatVND(outVal)}</td>
          <td class="text-center fw-bold text-primary fs-6">${closeQty}</td>
          <td class="text-end fw-bold text-primary">${formatVND(closeVal)}</td>
        </tr>
      `;
    }).join('');

    document.getElementById('nxtReportTbody').innerHTML = rowsHtml;
    document.getElementById('nxtReportTfoot').innerHTML = `
      <tr>
        <td colspan="4" class="text-end text-uppercase">Tổng Cộng Toàn Kỳ:</td>
        <td class="text-center">${sumOpenQty}</td>
        <td class="text-end">${formatVND(sumOpenVal)}</td>
        <td class="text-center text-success">${sumInQty}</td>
        <td class="text-end text-success">${formatVND(sumInVal)}</td>
        <td class="text-center text-danger">${sumOutQty}</td>
        <td class="text-end text-danger">${formatVND(sumOutVal)}</td>
        <td class="text-center text-primary">${sumCloseQty}</td>
        <td class="text-end text-primary">${formatVND(sumCloseVal)}</td>
      </tr>
    `;
  }

  // ==========================================================================
  // RENDER 4: SỔ CHỨNG TỪ & LỊCH SỬ NHÀ CUNG CẤP / KHÁCH HÀNG
  // ==========================================================================
  function renderVouchersView() {
    const q = (document.getElementById('voucherSearchInput').value || '').toLowerCase().trim();
    const tFilter = document.getElementById('voucherTypeFilter').value;
    const periodLogs = getFilteredLogs();

    const filtered = periodLogs.filter(l => {
      const matchType = tFilter === 'ALL' || l.type === tFilter;
      const matchSearch = !q ||
        l.code.toLowerCase().includes(q) ||
        l.sku.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        (l.partner || '').toLowerCase().includes(q);
      return matchType && matchSearch;
    });

    const tbody = document.getElementById('vouchersTbody');
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11" class="text-center py-4 text-secondary">Không có chứng từ kho trong khoảng lọc này</td></tr>';
    } else {
      tbody.innerHTML = filtered.map(l => {
        let badge = '<span class="badge badge-in">📥 Nhập kho</span>';
        if (l.type === 'Xuất kho') badge = '<span class="badge badge-export">📤 Xuất kho</span>';
        if (l.type === 'Điều chuyển') badge = '<span class="badge badge-transfer">🔄 Điều chuyển</span>';

        return `
          <tr>
            <td class="fw-bold text-primary text-center">${l.code}</td>
            <td class="text-center small">${l.timestamp}</td>
            <td class="text-center">${badge}</td>
            <td>
              <div class="fw-semibold">${l.name}</div>
              <div class="small text-secondary">${l.sku}</div>
            </td>
            <td class="text-center fw-bold">${l.quantity} ${l.unit || ''}</td>
            <td class="text-end">${formatVND(l.unitPrice)}</td>
            <td class="text-end fw-bold text-success">${formatVND(l.totalVal)}</td>
            <td class="small text-center">${l.fromWarehouse} ➔ <strong>${l.toWarehouse}</strong></td>
            <td class="fw-semibold">${l.partner || '---'}</td>
            <td class="small text-center">${l.createdBy}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-dark fw-semibold" onclick="openPrintVoucher('${l.code}')">
                <i class="bi bi-printer me-1"></i> In phiếu
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    const partnerMap = {};
    filtered.forEach(l => {
      const pName = l.partner || 'Đối tác nội bộ / Khách lẻ';
      if (!partnerMap[pName]) {
        partnerMap[pName] = {
          name: pName,
          type: l.type === 'Nhập kho' ? 'Nhà Cung Cấp' : (l.type === 'Xuất kho' ? 'Khách Hàng' : 'Nội Bộ'),
          count: 0,
          totalQty: 0,
          totalVal: 0,
          lastDate: l.timestamp
        };
      }
      partnerMap[pName].count++;
      partnerMap[pName].totalQty += l.quantity;
      partnerMap[pName].totalVal += l.totalVal;
      if (l.timestamp > partnerMap[pName].lastDate) partnerMap[pName].lastDate = l.timestamp;
    });

    const pRows = Object.values(partnerMap);
    const pTbody = document.getElementById('partnerSummaryTbody');
    if (pRows.length === 0) {
      pTbody.innerHTML = '<tr><td colspan="6" class="text-center py-3 text-secondary">Chưa có dữ liệu đối tác</td></tr>';
    } else {
      pTbody.innerHTML = pRows.map(p => `
        <tr>
          <td class="fw-bold">${p.name}</td>
          <td class="text-center"><span class="badge bg-secondary-subtle text-dark">${p.type}</span></td>
          <td class="text-center fw-bold">${p.count} phiếu</td>
          <td class="text-center">${p.totalQty} SP</td>
          <td class="text-end fw-bold text-primary">${formatVND(p.totalVal)}</td>
          <td class="text-center small">${p.lastDate}</td>
        </tr>
      `).join('');
    }
  }

  // ==========================================================================
  // RENDER 5: RBAC USERS & AUDIT LOGS
  // ==========================================================================
  function renderRbacAndAudit() {
    const uTbody = document.getElementById('rbacUsersTbody');
    uTbody.innerHTML = (appData.users || []).map(u => `
      <tr class="${(currentUser && u.username === currentUser.username) ? 'table-info' : ''}">
        <td class="fw-bold text-center"><code>${u.username}</code></td>
        <td class="text-center"><code>${u.password || '123456'}</code></td>
        <td class="fw-semibold">${u.fullName}</td>
        <td class="text-center"><span class="badge bg-primary">${u.role}</span></td>
        <td class="text-center fw-bold">${u.assignedWarehouse === 'ALL' ? 'Toàn hệ thống' : u.assignedWarehouse}</td>
        <td class="text-center"><span class="badge ${u.status === 'Tạm khóa' ? 'bg-danger' : 'bg-success'}">${u.status || 'Hoạt động'}</span></td>
        <td class="text-center">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary" onclick="openUserModal('${u.username}')" title="Sửa quyền / Đổi mật khẩu">
              <i class="bi bi-pencil-square"></i> Sửa
            </button>
            ${u.username !== 'admin' ? `
              <button class="btn btn-outline-danger" onclick="removeUserAccount('${u.username}')" title="Xóa tài khoản">
                <i class="bi bi-trash"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');

    const aTbody = document.getElementById('auditLogsTbody');
    aTbody.innerHTML = (appData.auditLogs || []).map(a => `
      <tr>
        <td class="small text-center text-nowrap">${a.timestamp}</td>
        <td class="small fw-semibold">${a.actorName}</td>
        <td class="text-center"><span class="badge bg-warning-subtle text-dark">${a.action}</span></td>
        <td class="small">${a.detail}</td>
      </tr>
    `).join('');
  }

  // ==========================================================================
  // MODAL SỔ THẺ KHO CHI TIẾT MẶT HÀNG (STOCK CARD - S12-DN)
  // ==========================================================================
  function openStockCard(sku) {
    currentStockCardSku = sku;
    const item = appData.items.find(i => i.sku === sku);
    if (!item) return;

    document.getElementById('scItemTitle').innerText = `${item.sku} — ${item.name}`;
    document.getElementById('scItemMeta').innerText =
      `Danh mục: ${item.category} • ĐVT: ${item.unit} • Giá vốn BQ: ${formatVND(item.costPrice)} • Tồn đầu kỳ: ${item.openingStock} ${item.unit}`;
    document.getElementById('scCurrentTotal').innerText = `${item.totalStock} ${item.unit}`;

    const itemLogs = appData.logs.filter(l => l.sku === sku);
    let runningBalance = item.openingStock || 0;

    let html = `
      <tr class="table-secondary fw-bold">
        <td class="text-center">DAU-KY</td>
        <td class="text-center">01/10/2026</td>
        <td>Số dư tồn kho đầu kỳ chuyển sang</td>
        <td class="text-center">Toàn hệ thống</td>
        <td class="text-center">--</td>
        <td class="text-center">--</td>
        <td class="text-center text-primary">${runningBalance}</td>
        <td class="text-center">Hệ thống</td>
      </tr>
    `;

    itemLogs.forEach(l => {
      let inQ = 0, outQ = 0;
      if (l.type === 'Nhập kho') {
        inQ = l.quantity;
        runningBalance += inQ;
      } else if (l.type === 'Xuất kho') {
        outQ = l.quantity;
        runningBalance = Math.max(0, runningBalance - outQ);
      } else {
        inQ = l.quantity;
        outQ = l.quantity;
      }

      html += `
        <tr>
          <td class="fw-bold text-center text-primary">${l.code}</td>
          <td class="text-center small">${l.timestamp}</td>
          <td>
            <div class="fw-semibold">${l.type}: ${l.partner || ''}</div>
            <div class="small text-secondary">${l.notes || ''}</div>
          </td>
          <td class="text-center small">${l.fromWarehouse} ➔ ${l.toWarehouse}</td>
          <td class="text-center fw-bold text-success">${inQ > 0 ? '+' + inQ : '--'}</td>
          <td class="text-center fw-bold text-danger">${outQ > 0 ? '-' + outQ : '--'}</td>
          <td class="text-center fw-bold text-primary">${runningBalance}</td>
          <td class="text-center small">${l.createdBy}</td>
        </tr>
      `;
    });

    document.getElementById('stockCardTbody').innerHTML = html;
    new bootstrap.Modal(document.getElementById('stockCardModal')).show();
  }

  // ==========================================================================
  // HỆ THỐNG IN ẤN KHÔNG BỊ TRẮNG TRANG (FIX LỖI 2 TRIỆT ĐỂ)
  // Hỗ trợ: 1. In Phiếu Kho (01-VT/02-VT) | 2. In Báo Cáo N-X-T | 3. In Sổ Thẻ Kho
  // ==========================================================================
  function showPrintPreviewWithHtml(titleText, htmlContent) {
    document.getElementById('printModalHeaderTitle').innerHTML = '<i class="bi bi-printer-fill me-2"></i>' + titleText;
    document.getElementById('printAreaContainer').innerHTML = htmlContent;
    document.getElementById('dedicatedPrintSheet').innerHTML = htmlContent;
    new bootstrap.Modal(document.getElementById('printVoucherModal')).show();
  }

  function executePrintNow() {
    const contentHtml = document.getElementById('printAreaContainer').innerHTML;
    document.getElementById('dedicatedPrintSheet').innerHTML = contentHtml;

    // Ưu tiên mở cửa sổ in độc lập để thoát hoàn toàn khỏi iframe của Google Sheets Modal
    try {
      const printWin = window.open('', '_blank', 'width=1050,height=800');
      if (printWin && printWin.document) {
        printWin.document.open();
        printWin.document.write(`
          <!DOCTYPE html>
          <html lang="vi">
          <head>
            <meta charset="UTF-8">
            <title>In Chứng Từ & Báo Cáo Kho - GS-002</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              body { background: #fff; color: #000; font-family: "Times New Roman", Times, serif; font-size: 13.5px; padding: 24px; }
              table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 12px; }
              th, td { border: 1px solid #000 !important; padding: 6px 8px !important; color: #000 !important; vertical-align: middle; }
              thead th { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; }
              @media print {
                @page { size: A4; margin: 12mm; }
              }
            </style>
          </head>
          <body>
            ${contentHtml}
            <script>
              window.onload = function() {
                setTimeout(function() { window.focus(); window.print(); }, 350);
              };
            <\/script>
          </body>
          </html>
        `);
        printWin.document.close();
        return;
      }
    } catch (e) {}

    // Fallback nếu trình duyệt chặn popup: In trực tiếp từ #dedicatedPrintSheet đã cô lập CSS
    window.print();
  }

  function openPrintVoucher(code) {
    const log = appData.logs.find(l => l.code === code);
    if (!log) return;

    const s = appData.settings || FALLBACK_DATA.settings;
    const isImport = log.type === 'Nhập kho';
    const voucherTitle = isImport ? 'PHIẾU NHẬP KHO' : (log.type === 'Xuất kho' ? 'PHIẾU XUẤT KHO' : 'PHIẾU ĐIỀU CHUYỂN KHO NỘI BỘ');
    const formNo = isImport ? 'Mẫu số 01 - VT' : 'Mẫu số 02 - VT';

    const html = `
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div class="fw-bold text-uppercase">${s.COMPANY_NAME}</div>
          <div class="small">Địa chỉ: ${s.COMPANY_ADDRESS}</div>
          <div class="small">MST: ${s.COMPANY_TAX} • ĐT: ${s.COMPANY_PHONE}</div>
        </div>
        <div class="text-end small">
          <div class="fw-bold">${formNo}</div>
          <div>(Ban hành theo Thông tư 200/2014/TT-BTC</div>
          <div>của Bộ Tài Chính)</div>
        </div>
      </div>

      <div class="text-center my-3">
        <h4 class="fw-bold mb-1">${voucherTitle}</h4>
        <div class="fst-italic">Thời gian lập: ${log.timestamp} — Số phiếu: <strong>${log.code}</strong></div>
      </div>

      <div class="mb-3" style="line-height: 1.8;">
        <div>- Đối tác (Nhà cung cấp / Người nhận hàng): <strong>${log.partner || 'Đối tác kinh doanh'}</strong></div>
        <div>- Kho xuất / Nguồn hàng: <strong>${log.fromWarehouse}</strong> &nbsp;&nbsp;|&nbsp;&nbsp; Kho nhập / Đích nhận: <strong>${log.toWarehouse}</strong></div>
        <div>- Lý do / Diễn giải chứng từ: ${log.notes || 'Theo chứng từ giao dịch kho'}</div>
      </div>

      <table class="table table-bordered border-dark text-dark my-3">
        <thead class="text-center fw-bold">
          <tr>
            <th style="width:50px;">STT</th>
            <th>Mã SKU</th>
            <th>Tên, nhãn hiệu, quy cách, phẩm chất vật tư, hàng hóa</th>
            <th>ĐVT</th>
            <th>Số Lượng</th>
            <th>Đơn Giá (₫)</th>
            <th>Thành Tiền (₫)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">1</td>
            <td class="text-center fw-bold">${log.sku}</td>
            <td class="fw-semibold">${log.name}</td>
            <td class="text-center">${log.unit || 'Chiếc'}</td>
            <td class="text-center fw-bold">${log.quantity}</td>
            <td class="text-end">${formatVND(log.unitPrice)}</td>
            <td class="text-end fw-bold">${formatVND(log.totalVal)}</td>
          </tr>
          <tr class="fw-bold">
            <td colspan="4" class="text-end">CỘNG THÀNH TIỀN:</td>
            <td class="text-center">${log.quantity}</td>
            <td></td>
            <td class="text-end">${formatVND(log.totalVal)}</td>
          </tr>
        </tbody>
      </table>

      <div class="mb-4">
        <em>- Tổng số tiền (viết bằng số): <strong>${formatVND(log.totalVal)}</strong> (Đã kiểm đủ số lượng và quy cách).</em>
      </div>

      <div class="row text-center mt-4 pt-2">
        <div class="col-3">
          <div class="fw-bold">Người lập phiếu</div>
          <div class="small fst-italic">(Ký, họ tên)</div>
          <div style="margin-top: 55px;" class="fw-semibold">${log.createdBy}</div>
        </div>
        <div class="col-3">
          <div class="fw-bold">Người giao / nhận</div>
          <div class="small fst-italic">(Ký, họ tên)</div>
          <div style="margin-top: 55px;" class="fw-semibold">${log.partner || ''}</div>
        </div>
        <div class="col-3">
          <div class="fw-bold">Thủ kho</div>
          <div class="small fst-italic">(Ký, họ tên)</div>
          <div style="margin-top: 55px;" class="fw-semibold">${currentUser.fullName}</div>
        </div>
        <div class="col-3">
          <div class="fw-bold">Kế toán trưởng / Giám đốc</div>
          <div class="small fst-italic">(Ký, họ tên, đóng dấu)</div>
          <div style="margin-top: 55px;" class="fw-semibold">Nguyễn Minh Tuấn</div>
        </div>
      </div>
    `;

    showPrintPreviewWithHtml('Xem Trước Bản In: ' + voucherTitle + ' (' + log.code + ')', html);
  }

  function printNxtReport() {
    const s = appData.settings || FALLBACK_DATA.settings;
    const periodText = document.getElementById('nxtPeriodSubtitle').innerText;
    const tableHtml = document.getElementById('nxtTableWrapper').innerHTML;

    const html = `
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div class="fw-bold text-uppercase">${s.COMPANY_NAME}</div>
          <div class="small">Địa chỉ: ${s.COMPANY_ADDRESS}</div>
          <div class="small">MST: ${s.COMPANY_TAX} • ĐT: ${s.COMPANY_PHONE}</div>
        </div>
        <div class="text-end small">
          <div class="fw-bold">Mẫu báo cáo: BC-NXT-01</div>
          <div>(Chuẩn Kế Toán Doanh Nghiệp)</div>
        </div>
      </div>

      <div class="text-center my-3">
        <h4 class="fw-bold mb-1">BẢNG TỔNG HỢP NHẬP – XUẤT – TỒN KHO HÀNG HÓA</h4>
        <div class="fst-italic">${periodText}</div>
      </div>

      ${tableHtml}

      <div class="row text-center mt-4 pt-3">
        <div class="col-4">
          <div class="fw-bold">Người lập biểu</div>
          <div class="small fst-italic">(Ký, họ tên)</div>
          <div style="margin-top: 55px;" class="fw-semibold">${currentUser.fullName}</div>
        </div>
        <div class="col-4">
          <div class="fw-bold">Kế toán kho</div>
          <div class="small fst-italic">(Ký, họ tên)</div>
          <div style="margin-top: 55px;" class="fw-semibold">Hoàng Thu Trang</div>
        </div>
        <div class="col-4">
          <div class="fw-bold">Giám đốc phê duyệt</div>
          <div class="small fst-italic">(Ký, họ tên, đóng dấu)</div>
          <div style="margin-top: 55px;" class="fw-semibold">Nguyễn Minh Tuấn</div>
        </div>
      </div>
    `;

    showPrintPreviewWithHtml('Xem Trước Bản In: Báo Cáo Tổng Hợp Nhập – Xuất – Tồn', html);
  }

  function printCurrentStockCard() {
    const s = appData.settings || FALLBACK_DATA.settings;
    const itemTitle = document.getElementById('scItemTitle').innerText;
    const itemMeta = document.getElementById('scItemMeta').innerText;
    const tbodyHtml = document.getElementById('stockCardTbody').innerHTML;

    const scModalInstance = bootstrap.Modal.getInstance(document.getElementById('stockCardModal'));
    if (scModalInstance) scModalInstance.hide();

    const html = `
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div class="fw-bold text-uppercase">${s.COMPANY_NAME}</div>
          <div class="small">Địa chỉ: ${s.COMPANY_ADDRESS}</div>
        </div>
        <div class="text-end small">
          <div class="fw-bold">Mẫu số S12-DN</div>
          <div>(Thông tư 200/2014/TT-BTC)</div>
        </div>
      </div>

      <div class="text-center my-3">
        <h4 class="fw-bold mb-1">THẺ KHO (SỔ CHI TIẾT VẬT TƯ HÀNG HÓA)</h4>
        <div class="fw-bold">${itemTitle}</div>
        <div class="small fst-italic">${itemMeta}</div>
      </div>

      <table class="table table-bordered border-dark text-dark my-3">
        <thead class="text-center fw-bold">
          <tr>
            <th>Số Hiệu CT</th>
            <th>Ngày Tháng</th>
            <th>Diễn Giải & Đối Tác</th>
            <th>Kho Giao Dịch</th>
            <th>SL Nhập (+)</th>
            <th>SL Xuất (-)</th>
            <th>Tồn Lũy Kế</th>
            <th>Người Thực Hiện</th>
          </tr>
        </thead>
        <tbody>${tbodyHtml}</tbody>
      </table>
    `;

    showPrintPreviewWithHtml('Xem Trước Bản In: Sổ Thẻ Kho (' + currentStockCardSku + ')', html);
  }

  // ==========================================================================
  // MODAL LẬP PHIẾU NHẬP / XUẤT / ĐIỀU CHUYỂN
  // ==========================================================================
  function openTxModal(defaultType, defaultSku) {
    document.getElementById('txType').value = defaultType || 'Nhập kho';
    document.getElementById('txDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('txCreator').value = `${currentUser.fullName} (${currentUser.role})`;

    const skuSelect = document.getElementById('txSku');
    skuSelect.innerHTML = appData.items.map(i =>
      `<option value="${i.sku}">${i.sku} — ${i.name} (Tồn: ${i.totalStock} ${i.unit})</option>`
    ).join('');
    if (defaultSku) skuSelect.value = defaultSku;

    onTxTypeChange();
    onTxSkuSelect();
    new bootstrap.Modal(document.getElementById('txModal')).show();
  }

  function onTxTypeChange() {
    const t = document.getElementById('txType').value;
    const fromSel = document.getElementById('txFromWh');
    const toSel = document.getElementById('txToWh');
    const whOptions = ['Kho Hà Nội', 'Kho Sài Gòn', 'Kho Tổng'];

    if (t === 'Nhập kho') {
      fromSel.innerHTML = '<option value="Nhà cung cấp ngoài">Nhà cung cấp ngoài</option>';
      toSel.innerHTML = whOptions.map(w => `<option value="${w}">${w}</option>`).join('');
      if (currentUser.role === 'KEEPER' && currentUser.assignedWarehouse !== 'ALL') {
        toSel.value = currentUser.assignedWarehouse;
      }
      document.getElementById('txPartner').value = 'Công ty TNHH Sony Electronics VN';
    } else if (t === 'Xuất kho') {
      fromSel.innerHTML = whOptions.map(w => `<option value="${w}">${w}</option>`).join('');
      if (currentUser.role === 'KEEPER' && currentUser.assignedWarehouse !== 'ALL') {
        fromSel.value = currentUser.assignedWarehouse;
      }
      toSel.innerHTML = '<option value="Giao khách hàng">Giao khách hàng</option>';
      document.getElementById('txPartner').value = 'Khách hàng Doanh nghiệp B2B';
    } else {
      fromSel.innerHTML = whOptions.map(w => `<option value="${w}">${w}</option>`).join('');
      toSel.innerHTML = whOptions.map(w => `<option value="${w}">${w}</option>`).join('');
      fromSel.value = 'Kho Tổng';
      toSel.value = 'Kho Hà Nội';
      document.getElementById('txPartner').value = 'Điều chuyển nội bộ hệ thống';
    }
    onTxSkuSelect();
  }

  function onTxSkuSelect() {
    const sku = document.getElementById('txSku').value;
    const it = appData.items.find(i => i.sku === sku);
    if (!it) return;
    document.getElementById('txStockPreview').value = `HN: ${it.stock_hanoi} | SG: ${it.stock_saigon} | Tổng: ${it.stock_tong}`;
    const t = document.getElementById('txType').value;
    document.getElementById('txPrice').value = t === 'Xuất kho' ? it.sellingPrice : it.costPrice;
    calcTxModalTotal();
  }

  function calcTxModalTotal() {
    const q = parseInt(document.getElementById('txQty').value, 10) || 0;
    const p = Number(document.getElementById('txPrice').value) || 0;
    document.getElementById('txTotalPreview').value = formatVND(q * p);
  }

  function submitTransaction() {
    const t = document.getElementById('txType').value;
    const sku = document.getElementById('txSku').value;
    const it = appData.items.find(i => i.sku === sku);
    if (!it) return;

    const qty = parseInt(document.getElementById('txQty').value, 10) || 0;
    const price = Number(document.getElementById('txPrice').value) || 0;
    const fromWh = document.getElementById('txFromWh').value;
    const toWh = document.getElementById('txToWh').value;
    const partner = document.getElementById('txPartner').value.trim();
    const notes = document.getElementById('txNotes').value.trim();
    const txDate = document.getElementById('txDate').value;

    if (t === 'Điều chuyển' && fromWh === toWh) {
      alert('Kho xuất và Kho nhận điều chuyển không được trùng nhau!');
      return;
    }

    if (currentUser.role === 'KEEPER' && currentUser.assignedWarehouse !== 'ALL') {
      if (t === 'Nhập kho' && toWh !== currentUser.assignedWarehouse) {
        alert('Phân quyền Thủ kho: Bạn chỉ được phép Nhập hàng vào ' + currentUser.assignedWarehouse + '!');
        return;
      }
      if (t === 'Xuất kho' && fromWh !== currentUser.assignedWarehouse) {
        alert('Phân quyền Thủ kho: Bạn chỉ được phép Xuất hàng từ ' + currentUser.assignedWarehouse + '!');
        return;
      }
    }

    if (t === 'Xuất kho' || t === 'Điều chuyển') {
      let avail = 0;
      if (fromWh === 'Kho Hà Nội') avail = it.stock_hanoi;
      else if (fromWh === 'Kho Sài Gòn') avail = it.stock_saigon;
      else if (fromWh === 'Kho Tổng') avail = it.stock_tong;
      if (qty > avail) {
        alert(`Cảnh báo âm kho: ${fromWh} chỉ còn tồn ${avail} ${it.unit}, không đủ xuất ${qty} ${it.unit}!`);
        return;
      }
    }

    const payload = {
      type: t,
      txDate: txDate,
      sku: it.sku,
      name: it.name,
      unit: it.unit,
      quantity: qty,
      unitPrice: price,
      fromWarehouse: fromWh,
      toWarehouse: toWh,
      partner: partner,
      notes: notes,
      username: currentUser.username,
      createdBy: currentUser.fullName,
      userRole: currentUser.role,
      assignedWarehouse: currentUser.assignedWarehouse
    };

    const btn = document.getElementById('btnSubmitTx');
    btn.disabled = true;
    btn.innerText = 'Đang ghi sổ...';

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(function(res) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Ghi Sổ & Cập Nhật Tồn Kho';
          if (!res.success) {
            alert(res.message);
            return;
          }
          bootstrap.Modal.getInstance(document.getElementById('txModal')).hide();
          loadData();
        })
        .withFailureHandler(function(err) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Ghi Sổ & Cập Nhật Tồn Kho';
          alert('Lỗi: ' + err);
        })
        .submitInventoryTx(payload);
    } else {
      const prefix = t === 'Nhập kho' ? 'PNK' : (t === 'Xuất kho' ? 'PXK' : 'PDC');
      const newCode = prefix + '-2026-' + Math.floor(1000 + Math.random() * 9000);

      if (t === 'Nhập kho') {
        const oldTotal = it.stock_hanoi + it.stock_saigon + it.stock_tong;
        if (price > 0) {
          it.costPrice = oldTotal <= 0 ? price : Math.round(((oldTotal * it.costPrice) + (qty * price)) / (oldTotal + qty));
        }
        if (toWh === 'Kho Hà Nội') it.stock_hanoi += qty;
        if (toWh === 'Kho Sài Gòn') it.stock_saigon += qty;
        if (toWh === 'Kho Tổng') it.stock_tong += qty;
      } else if (t === 'Xuất kho') {
        if (fromWh === 'Kho Hà Nội') it.stock_hanoi = Math.max(0, it.stock_hanoi - qty);
        if (fromWh === 'Kho Sài Gòn') it.stock_saigon = Math.max(0, it.stock_saigon - qty);
        if (fromWh === 'Kho Tổng') it.stock_tong = Math.max(0, it.stock_tong - qty);
      } else {
        if (fromWh === 'Kho Hà Nội') it.stock_hanoi = Math.max(0, it.stock_hanoi - qty);
        if (fromWh === 'Kho Sài Gòn') it.stock_saigon = Math.max(0, it.stock_saigon - qty);
        if (fromWh === 'Kho Tổng') it.stock_tong = Math.max(0, it.stock_tong - qty);
        if (toWh === 'Kho Hà Nội') it.stock_hanoi += qty;
        if (toWh === 'Kho Sài Gòn') it.stock_saigon += qty;
        if (toWh === 'Kho Tổng') it.stock_tong += qty;
      }

      it.totalStock = it.stock_hanoi + it.stock_saigon + it.stock_tong;
      it.inventoryValue = it.totalStock * it.costPrice;
      it.alertStatus = it.totalStock <= 0 ? 'Hết hàng' : (it.totalStock <= it.minLimit ? 'Sắp hết hàng' : 'An toàn');

      appData.logs.unshift({
        code: newCode,
        timestamp: txDate + ' 10:00',
        type: t,
        sku: it.sku,
        name: it.name,
        unit: it.unit,
        quantity: qty,
        unitPrice: price,
        totalVal: qty * price,
        fromWarehouse: fromWh,
        toWarehouse: toWh,
        partner: partner,
        createdBy: currentUser.fullName,
        notes: notes
      });

      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Ghi Sổ & Cập Nhật Tồn Kho';
      bootstrap.Modal.getInstance(document.getElementById('txModal')).hide();
      refreshAllViews();
    }
  }

  // ==========================================================================
  // THÊM MỚI & SỬA MÃ HÀNG SKU (FIX LỖI 3 TRIỆT ĐỂ)
  // ==========================================================================
  function openSkuModal(editSku) {
    const codeInput = document.getElementById('fmSkuCode');
    if (editSku) {
      const existing = appData.items.find(i => i.sku === editSku);
      if (existing) {
        document.getElementById('skuModalTitle').innerText = 'Cập Nhật Mã Hàng: ' + existing.sku;
        codeInput.value = existing.sku;
        codeInput.readOnly = true;
        document.getElementById('fmSkuCat').value = existing.category || 'Thiết bị';
        document.getElementById('fmSkuName').value = existing.name || '';
        document.getElementById('fmSkuUnit').value = existing.unit || 'Chiếc';
        document.getElementById('fmSkuCost').value = existing.costPrice || 0;
        document.getElementById('fmSkuSell').value = existing.sellingPrice || 0;
        document.getElementById('fmSkuHn').value = existing.stock_hanoi || 0;
        document.getElementById('fmSkuSg').value = existing.stock_saigon || 0;
        document.getElementById('fmSkuTong').value = existing.stock_tong || 0;
        document.getElementById('fmSkuMin').value = existing.minLimit || 3;
      }
    } else {
      const nextNum = String((appData.items ? appData.items.length : 0) + 1).padStart(2, '0');
      document.getElementById('skuModalTitle').innerText = 'Thêm Mã Hàng Hóa (SKU) Mới';
      codeInput.value = 'SKU-NEW-' + nextNum;
      codeInput.readOnly = false;
      document.getElementById('fmSkuCat').value = 'Thiết bị ghi hình';
      document.getElementById('fmSkuName').value = '';
      document.getElementById('fmSkuUnit').value = 'Chiếc';
      document.getElementById('fmSkuCost').value = '15000000';
      document.getElementById('fmSkuSell').value = '19500000';
      document.getElementById('fmSkuHn').value = '5';
      document.getElementById('fmSkuSg').value = '3';
      document.getElementById('fmSkuTong').value = '2';
      document.getElementById('fmSkuMin').value = '3';
    }
    new bootstrap.Modal(document.getElementById('skuModal')).show();
  }

  function submitNewSku() {
    const sku = document.getElementById('fmSkuCode').value.trim().toUpperCase();
    const name = document.getElementById('fmSkuName').value.trim();
    if (!sku || !name) {
      alert('Vui lòng nhập đầy đủ Mã SKU và Tên hàng hóa!');
      return;
    }

    const payload = {
      sku: sku,
      name: name,
      category: document.getElementById('fmSkuCat').value.trim() || 'Thiết bị',
      unit: document.getElementById('fmSkuUnit').value.trim() || 'Chiếc',
      costPrice: Number(document.getElementById('fmSkuCost').value) || 0,
      sellingPrice: Number(document.getElementById('fmSkuSell').value) || 0,
      stock_hanoi: parseInt(document.getElementById('fmSkuHn').value, 10) || 0,
      stock_saigon: parseInt(document.getElementById('fmSkuSg').value, 10) || 0,
      stock_tong: parseInt(document.getElementById('fmSkuTong').value, 10) || 0,
      minLimit: parseInt(document.getElementById('fmSkuMin').value, 10) || 3,
      username: currentUser.username,
      actorName: currentUser.fullName
    };

    const btn = document.getElementById('btnSaveSkuSubmit');
    btn.disabled = true;
    btn.innerText = 'Đang lưu...';

    // Cập nhật ngay lập tức trên UI để người dùng thấy ngay kết quả
    const total = payload.stock_hanoi + payload.stock_saigon + payload.stock_tong;
    const newItemObj = {
      ...payload,
      openingStock: total,
      totalStock: total,
      inventoryValue: total * payload.costPrice,
      alertStatus: total <= 0 ? 'Hết hàng' : (total <= payload.minLimit ? 'Sắp hết hàng' : 'An toàn')
    };

    const existingIdx = appData.items.findIndex(i => i.sku.toUpperCase() === sku);
    if (existingIdx >= 0) {
      appData.items[existingIdx] = newItemObj;
    } else {
      appData.items.unshift(newItemObj);
    }
    refreshAllViews();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(function(res) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Lưu Mã Hàng Vào Sheet';
          bootstrap.Modal.getInstance(document.getElementById('skuModal')).hide();
          alert(res && res.message ? res.message : 'Đã lưu mã hàng ' + sku + ' vào Google Sheets!');
          loadData();
        })
        .withFailureHandler(function(err) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Lưu Mã Hàng Vào Sheet';
          bootstrap.Modal.getInstance(document.getElementById('skuModal')).hide();
          alert('Đã thêm mã hàng [' + sku + '] lên bảng hiển thị! (Lưu ý: Hãy dán bản Code.gs mới nhất để ghi tự động xuống Sheet: ' + err + ')');
        })
        .saveSkuMasterItem(payload);
    } else {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Lưu Mã Hàng Vào Sheet';
      bootstrap.Modal.getInstance(document.getElementById('skuModal')).hide();
      alert('Đã lưu mã hàng [' + sku + '] thành công!');
    }
  }

  function handleSaveSettings(e) {
    e.preventDefault();
    const cfg = {
      COMPANY_NAME: document.getElementById('cfgCompanyName').value.trim(),
      COMPANY_TAX: document.getElementById('cfgCompanyTax').value.trim(),
      COMPANY_ADDRESS: document.getElementById('cfgCompanyAddress').value.trim(),
      COMPANY_PHONE: document.getElementById('cfgCompanyPhone').value.trim(),
      COSTING_METHOD: document.getElementById('cfgCostingMethod').value,
      PRINT_TEMPLATE_STANDARD: document.getElementById('cfgPrintStandard').value.trim(),
      username: currentUser.username,
      actorName: currentUser.fullName
    };
    appData.settings = { ...appData.settings, ...cfg };
    populateSettingsForm();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        alert(res.message);
      }).saveCompanyConfig(cfg);
    } else {
      alert('Đã lưu cấu hình doanh nghiệp và cập nhật mẫu in thành công!');
    }
  }

  // ==========================================================================
  // XUẤT EXCEL (CSV UTF-8 BOM CHUẨN TIẾNG VIỆT)
  // ==========================================================================
  function downloadCsvUtf8(filename, rows) {
    const csvContent = '\uFEFF' + rows.map(r =>
      r.map(cell => '"' + String(cell === null || cell === undefined ? '' : cell).replace(/"/g, '""') + '"').join(',')
    ).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportInventoryCsv() {
    const rows = [
      ['Mã SKU', 'Tên Hàng Hóa', 'Danh Mục', 'ĐVT', 'Giá Vốn BQ', 'Giá Bán', 'Tồn Kho HN', 'Tồn Kho SG', 'Tồn Kho Tổng', 'Tổng Tồn', 'Giá Trị Tồn', 'Mức Min', 'Trạng Thái']
    ];
    appData.items.forEach(it => {
      rows.push([
        it.sku, it.name, it.category, it.unit, it.costPrice, it.sellingPrice,
        it.stock_hanoi, it.stock_saigon, it.stock_tong, it.totalStock,
        it.totalStock * it.costPrice, it.minLimit, it.alertStatus
      ]);
    });
    downloadCsvUtf8('Danh_Muc_Ton_Kho_Da_Kho_GS002.csv', rows);
  }

  function exportNxtCsv() {
    const rows = [
      ['Mã SKU', 'Tên Hàng Hóa', 'ĐVT', 'Giá Vốn BQ', 'Tồn Đầu SL', 'Tồn Đầu Giá Trị', 'Tồn Cuối SL', 'Tồn Cuối Giá Trị']
    ];
    appData.items.forEach(it => {
      rows.push([
        it.sku, it.name, it.unit, it.costPrice,
        it.openingStock, it.openingStock * it.costPrice,
        it.totalStock, it.totalStock * it.costPrice
      ]);
    });
    downloadCsvUtf8('Bao_Cao_Nhap_Xuat_Ton_GS002.csv', rows);
  }

  function exportVouchersCsv() {
    const rows = [
      ['Mã Phiếu', 'Ngày Giờ', 'Loại Phiếu', 'Mã SKU', 'Tên Hàng Hóa', 'ĐVT', 'Số Lượng', 'Đơn Giá', 'Thành Tiền', 'Từ Kho', 'Đến Kho', 'Đối Tác', 'Người Lập', 'Ghi Chú']
    ];
    getFilteredLogs().forEach(l => {
      rows.push([
        l.code, l.timestamp, l.type, l.sku, l.name, l.unit || 'Chiếc',
        l.quantity, l.unitPrice, l.totalVal, l.fromWarehouse, l.toWarehouse,
        l.partner || '', l.createdBy, l.notes || ''
      ]);
    });
    downloadCsvUtf8('So_Chung_Tu_Nhap_Xuat_Kho_GS002.csv', rows);
  }

  document.addEventListener('DOMContentLoaded', loadData);
</script>
</body>
</html>
```
