# ☕ BỘ MÃ NGUỒN GOLDEN MASTER 3/5: GS-005 — QUẢN LÝ NHÀ HÀNG, CAFE, POS TÍNH GIỜ, HỘI VIÊN VIP & BẾP KDS (v3.3 COMMERCIAL PRO — FULL SCREEN EDITION)

## 🖥️ TÍNH NĂNG MỚI TRONG BẢN v3.3: NHẤP VÀO HIỆN TOÀN MÀN HÌNH (1-CLICK FULL SCREEN)

Bản **v3.3 Commercial Pro** tích hợp cơ chế **Phóng To Toàn Màn Hình (Full Screen)** tại **4 vị trí trực quan** trên giao diện (hỗ trợ đồng thời cả link Web App `/exec` lẫn hộp thoại Modal bên trong Google Sheets):

1. **Nút `🔲 Toàn Màn Hình` nổi bật trên thanh công cụ chính (Topbar):**

   * Nằm ngay cạnh bộ lọc khu vực bàn trên thanh Topbar (`id="btnTopFullscreen"`).

   * Khi nhấp vào, ứng dụng tự động kích hoạt chế độ **HTML5 Full Screen (`requestFullscreen`)** tràn 100% màn hình máy tính/máy POS (tương đương phím `F11`), đồng thời tự động chuyển nút thành **`🗗 Thoát Toàn Màn Hình`** màu đỏ để bạn thu nhỏ lại bất cứ lúc nào.

   * Nếu mở bên trong iframe của Google Sheets mà trình duyệt giới hạn quyền Fullscreen, hệ thống tự động thu gọn thanh bên (`Sidebar`) để mở rộng tối đa không gian sơ đồ bàn.

2. **Nút `🔲 Toàn Màn Hình` ngay góc phải trên màn hình Đăng Nhập (`#authGateScreen`):**

   * Giúp Thu ngân hoặc Nhân viên Order bật chế độ Toàn Màn Hình ngay từ bước đăng nhập đầu ca.

3. **Nút `📺 Phóng To KDS Toàn Màn Hình (TV Mode)` tại Màn Hình Bếp KDS:**

   * Khi nhấp vào nút này tại tab **Màn Hình Bếp (KDS)**, hệ thống vừa phóng toàn màn hình vừa **ẩn hoàn toàn thanh menu bên trái và thanh công cụ phía trên** để màn hình Tivi/Tablet trong bếp hiển thị 100% các phiếu chế biến món.

4. **Nút `🔲 Toàn Màn Hình` ngay trên thanh tiêu đề Cửa Sổ Gọi Món (`#orderModal`) + Mở rộng hộp thoại Google Sheets tối đa (`1920x1080`):**

   * Khi bấm vào một bàn để gọi món hoặc tính tiền, bạn có thể nhấp nút **`🔲 Toàn Màn Hình`** ở góc trên bên phải cửa sổ gọi món để cửa sổ gọi món bung tràn 100% khung hình (`modal-fullscreen`).

   * Trong `Code.gs`, hàm `openPosDialog()` đã được nâng kích thước khung từ `1380x850` lên **`1920x1080`** để khi mở từ Google Sheets, cửa sổ luôn tự động giãn sát mép màn hình.

## 📁 FILE 1/4: `appsscript.json`

```
{
  "timeZone": "Asia/Ho_Chi_Minh",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
}


```

## 📁 FILE 2/4: `installer.gs`

```
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


```

## 📁 FILE 3/4: `Code.gs`

```
/**
 * ============================================================================
 * GS-005: WEBAPP QUẢN LÝ NHÀ HÀNG, CAFE, POS TÍNH GIỜ & VIETQR ĐỘNG (V3.3 PRO)
 * BACKEND CONTROLLER, TABLE ORDERING, BILLING, VIP MEMBERS, KDS & AUDIT (CODE.GS)
 * Archetype: Point of Sale & F&B (Golden Master v3.3)
 * ============================================================================
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('F&B POS Quản Lý Nhà Hàng, Cafe, Hội Viên VIP & Bếp KDS v3.3 Pro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('☕ F&B POS NHÀ HÀNG & CAFE PRO (v3.3)')
    .addItem('⚡ 1. Khởi tạo / Làm mới 9 Tab Chuẩn Thương Mại (v3.3)', 'install_POS_SHEET')
    .addSeparator()
    .addItem('🖥️ 2. Mở Web App Thu Ngân POS (Toàn Màn Hình / Full Screen)', 'openPosDialog')
    .addToUi();
}

function openPosDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1920)
    .setHeight(1080)
    .setTitle('Hệ Thống F&B POS Quản Lý Nhà Hàng, Cafe, Hội Viên VIP, Bếp KDS & VietQR v3.3 Pro');
  SpreadsheetApp.getUi().showModalDialog(html, '☕ Web App F&B POS Thu Ngân & Gọi Món v3.3 (Nhấn nút 🔲 Toàn Màn Hình trên thanh công cụ để phóng cực đại)');
}

function openPosWebApp() {
  openPosDialog();
}

function parseCurrency(rawVal, dispVal) {
  if (typeof rawVal === 'number' && !isNaN(rawVal)) return Math.round(rawVal);
  const s = String(rawVal !== undefined && rawVal !== null && rawVal !== '' ? rawVal : (dispVal || '')).trim();
  if (!s) return 0;
  const isNeg = s.indexOf('-') !== -1;
  const digitsOnly = s.replace(/[^\d]/g, '');
  if (!digitsOnly) return 0;
  const num = parseInt(digitsOnly, 10) || 0;
  return isNeg ? -num : num;
}

function normalizeDateStr(rawVal, dispVal) {
  if (rawVal && Object.prototype.toString.call(rawVal) === '[object Date]' && !isNaN(rawVal.getTime())) {
    return Utilities.formatDate(rawVal, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
  }
  const str = String(dispVal || rawVal || '').trim();
  if (!str) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str;
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(.*)$/);
  if (slashMatch) {
    const p1 = parseInt(slashMatch[1], 10);
    const p2 = parseInt(slashMatch[2], 10);
    const yr = slashMatch[3];
    const timePart = (slashMatch[4] || ' 10:00').trim();
    const mm = String(p1 <= 12 ? p1 : p2).padStart(2, '0');
    const dd = String(p1 <= 12 ? p2 : p1).padStart(2, '0');
    return yr + '-' + mm + '-' + dd + (timePart ? ' ' + timePart : '');
  }
  return str;
}

function getDefaultUsersList() {
  return [
    { username: 'admin', password: '123456', fullName: 'Nguyễn Minh Tuấn', role: 'ADMIN', assignedZone: 'ALL', permissionsDesc: 'Quản lý toàn quyền (Xem doanh thu, Sửa thực đơn, Quản lý Hội viên VIP, Cấu hình VietQR, Phân quyền)', status: 'Hoạt động' },
    { username: 'thungan_ca1', password: '123456', fullName: 'Lê Thu Trang', role: 'CASHIER', assignedZone: 'ALL', permissionsDesc: 'Thu ngân POS (Tính tiền, In hóa đơn K80, Thêm/Đổi hạng Hội viên VIP, Check VietQR)', status: 'Hoạt động' },
    { username: 'order_tang1', password: '123456', fullName: 'Nguyễn Văn Minh', role: 'STAFF', assignedZone: 'Tầng 1 — Cafe & Sân Vườn', permissionsDesc: 'Phục vụ gọi món (Mở bàn, Chọn món, Gửi đơn cho bếp KDS, Nhận món giao bàn)', status: 'Hoạt động' },
    { username: 'order_bida', password: '123456', fullName: 'Hoàng Văn Bách', role: 'STAFF', assignedZone: 'Khu Bida & Phòng VIP Tính Giờ', permissionsDesc: 'Phục vụ khu bida/VIP (Bật giờ chơi bida, Gọi đồ uống, Gửi đơn bếp)', status: 'Hoạt động' },
    { username: 'bep_truong', password: '123456', fullName: 'Trần Văn Đầu Bếp', role: 'KITCHEN', assignedZone: 'Bếp & Pha Chế (KDS)', permissionsDesc: 'Màn hình Bếp KDS (Nhận đơn -> Đang chế biến -> Báo xong món -> Giao phục vụ)', status: 'Hoạt động' }
  ];
}

function ensureAuxSheetsExist(ss) {
  const fallback = getFallbackPosData();

  // Tự động khởi tạo tab HOI_VIEN_VIP nếu Sheet cũ từ bản v3.0/v3.1 chưa có
  let hvSheet = ss.getSheetByName('HOI_VIEN_VIP');
  if (!hvSheet) {
    hvSheet = ss.insertSheet('HOI_VIEN_VIP');
    hvSheet.setTabColor('#0EA5E9');
    hvSheet.getRange('A1:I1').merge()
      .setValue('DANH SÁCH HỘI VIÊN THÂN THIẾT (MEMBER) & CƠ CHẾ PHÂN HẠNG BẠC / VÀNG / BẠCH KIM')
      .setFontSize(13).setFontWeight('bold').setBackground('#0369A1').setFontColor('#FFFFFF')
      .setHorizontalAlignment('center');
    const hvHeaders = ['Mã Hội Viên', 'Họ Và Tên Hội Viên', 'Số Điện Thoại', 'Hạng Thẻ Hiện Tại', 'Tổng Chi Tiêu Tích Lũy (₫)', 'Số Lượt Đến', 'Cơ Chế Phân Hạng', 'Trạng Thái Thẻ', 'Ghi Chú Ưu Đãi'];
    hvSheet.getRange(2, 1, 1, hvHeaders.length).setValues([hvHeaders]).setFontWeight('bold').setBackground('#E0F2FE');
    hvSheet.setFrozenRows(2);
    hvSheet.getRange('C3:C100').setNumberFormat('@');
    const hvRows = fallback.vipMembers.map(function(m) {
      return [m.id, m.name, m.phone, m.tier, m.spent, m.visits, m.tierMode || 'Tự động theo chi tiêu', m.status || 'Hoạt động', m.notes || ''];
    });
    hvSheet.getRange(3, 1, hvRows.length, hvHeaders.length).setValues(hvRows);
    hvSheet.getRange(3, 5, hvRows.length, 1).setNumberFormat('#,##0 "₫"');
  }

  // Tự động khởi tạo tab PHIEU_BEP_KDS nếu Sheet cũ từ bản v3.0/v3.1 chưa có
  let kdsSheet = ss.getSheetByName('PHIEU_BEP_KDS');
  if (!kdsSheet) {
    kdsSheet = ss.insertSheet('PHIEU_BEP_KDS');
    kdsSheet.setTabColor('#EA580C');
    kdsSheet.getRange('A1:H1').merge()
      .setValue('ĐIỀU PHỐI PHIẾU CHẾ BIẾN BẾP & QUẦY PHA CHẾ (KDS WORKFLOW REAL-TIME)')
      .setFontSize(13).setFontWeight('bold').setBackground('#C2410C').setFontColor('#FFFFFF')
      .setHorizontalAlignment('center');
    const kdsHeaders = ['Mã Phiếu KDS', 'Mã Bàn', 'Tên Bàn / Phòng', 'Khu Vực', 'Giờ Gửi Bếp', 'Nhân Viên Order', 'Trạng Thái Phiếu Bếp', 'Chi Tiết Món (JSON)'];
    kdsSheet.getRange(2, 1, 1, kdsHeaders.length).setValues([kdsHeaders]).setFontWeight('bold').setBackground('#FFEDD5');
    kdsSheet.setFrozenRows(2);
    kdsSheet.getRange('E3:E100').setNumberFormat('@');
    const kdsRows = fallback.kitchenTickets.map(function(k) {
      return [k.ticketId, k.tableCode, k.tableName, k.zone || '', k.orderTime || '', k.waiter || '', k.status || 'Chờ chế biến', JSON.stringify(k.items || [])];
    });
    kdsSheet.getRange(3, 1, kdsRows.length, kdsHeaders.length).setValues(kdsRows);
  }
}

function ensurePosSheetsExist() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return null;
    if (!ss.getSheetByName('SO_DO_BAN') || !ss.getSheetByName('THUC_DON') || !ss.getSheetByName('HOA_DON')) {
      install_POS_SHEET();
    } else {
      ensureAuxSheetsExist(ss);
    }
    return ss;
  } catch (e) {
    return null;
  }
}

function computeTierBySpent(spentAmount, settings) {
  const s = settings || {};
  const platMin = Number(s.TIER_PLATINUM_MIN) || 15000000;
  const goldMin = Number(s.TIER_GOLD_MIN) || 8000000;
  const silvMin = Number(s.TIER_SILVER_MIN) || 3000000;
  const pPct = s.DISCOUNT_PLATINUM || '15';
  const gPct = s.DISCOUNT_GOLD || '10';
  const sPct = s.DISCOUNT_SILVER || '5';

  const val = Number(spentAmount) || 0;
  if (val >= platMin) return 'Bạch Kim (Platinum - ' + pPct + '%)';
  if (val >= goldMin) return 'Vàng (Gold - ' + gPct + '%)';
  if (val >= silvMin) return 'Bạc (Silver - ' + sPct + '%)';
  return 'Thân Thiết (Member - 0%)';
}

function getPosData() {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) {
      return getFallbackPosData();
    }

    const sdbSheet = ss.getSheetByName('SO_DO_BAN');
    const tdSheet = ss.getSheetByName('THUC_DON');
    const hdSheet = ss.getSheetByName('HOA_DON');
    const hvSheet = ss.getSheetByName('HOI_VIEN_VIP');
    const kdsSheet = ss.getSheetByName('PHIEU_BEP_KDS');
    const pqSheet = ss.getSheetByName('PHAN_QUYEN');
    const chSheet = ss.getSheetByName('CAU_HINH');
    const nkSheet = ss.getSheetByName('NHAT_KY');

    if (!sdbSheet || !tdSheet || !hdSheet) {
      return getFallbackPosData();
    }

    const fallback = getFallbackPosData();
    const settings = Object.assign({}, fallback.settings);
    if (chSheet && chSheet.getLastRow() >= 3) {
      const chVals = chSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < chVals.length; i++) {
        const k = String(chVals[i][0] || '').trim();
        const v = String(chVals[i][1] || '').trim();
        if (k) settings[k] = v;
      }
    }

    const users = [];
    if (pqSheet && pqSheet.getLastRow() >= 3) {
      const pqVals = pqSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < pqVals.length; i++) {
        const r = pqVals[i];
        const uname = String(r[0] || '').trim();
        if (!uname) continue;
        users.push({
          username: uname,
          password: String(r[1] || '').trim() || '123456',
          fullName: String(r[2] || '').trim() || uname,
          role: String(r[3] || '').trim() || 'STAFF',
          assignedZone: String(r[4] || '').trim() || 'ALL',
          permissionsDesc: String(r[5] || '').trim(),
          status: String(r[6] || '').trim() || 'Hoạt động'
        });
      }
    }
    const finalUsers = users.length > 0 ? users : fallback.users;

    // Đọc THUC_DON
    const tdRaw = tdSheet.getDataRange().getValues();
    const tdDisp = tdSheet.getDataRange().getDisplayValues();
    const menuItems = [];
    if (tdDisp.length > 2) {
      for (let i = 2; i < tdDisp.length; i++) {
        const dRow = tdDisp[i];
        const rRow = tdRaw[i] || dRow;
        const code = String(dRow[0] || '').trim();
        if (!code) continue;
        menuItems.push({
          code: code,
          name: String(dRow[1] || '').trim(),
          category: String(dRow[2] || 'Khác').trim(),
          unit: String(dRow[3] || 'Phần').trim(),
          price: parseCurrency(rRow[4], dRow[4]),
          costPrice: parseCurrency(rRow[5], dRow[5]),
          promo: String(dRow[6] || 'Không').trim(),
          kitchenStation: String(dRow[7] || 'Bếp').trim(),
          status: String(dRow[8] || 'Còn hàng').trim(),
          notes: String(dRow[9] || '').trim()
        });
      }
    }
    const finalMenu = menuItems.length > 0 ? menuItems : fallback.menuItems;

    // Đọc SO_DO_BAN
    const sdbRaw = sdbSheet.getDataRange().getValues();
    const sdbDisp = sdbSheet.getDataRange().getDisplayValues();
    const tables = [];
    if (sdbDisp.length > 2) {
      for (let i = 2; i < sdbDisp.length; i++) {
        const dRow = sdbDisp[i];
        const rRow = sdbRaw[i] || dRow;
        const code = String(dRow[0] || '').trim();
        if (!code) continue;
        tables.push({
          code: code,
          name: String(dRow[1] || '').trim(),
          zone: String(dRow[2] || 'Tầng 1 — Cafe & Sân Vườn').trim(),
          serviceType: String(dRow[3] || 'Bàn Cafe thường').trim(),
          status: String(dRow[4] || 'Trống').trim(),
          hourlyRate: parseCurrency(rRow[5], dRow[5]),
          openTime: normalizeDateStr(rRow[6], dRow[6]),
          guestCount: parseInt(rRow[7] || dRow[7], 10) || 0,
          dishAmount: parseCurrency(rRow[8], dRow[8]),
          hourAmount: parseCurrency(rRow[9], dRow[9]),
          totalAmount: parseCurrency(rRow[10], dRow[10]),
          notes: String(dRow[11] || '').trim(),
          kdsStatus: String(dRow[12] || '').trim() || (String(dRow[4] || '').trim() === 'Trống' ? '---' : 'Đang chế biến')
        });
      }
    }
    const finalTables = tables.length > 0 ? tables : fallback.tables;

    // Đọc HOA_DON
    const hdRaw = hdSheet.getDataRange().getValues();
    const hdDisp = hdSheet.getDataRange().getDisplayValues();
    const invoices = [];
    if (hdDisp.length > 2) {
      for (let i = 2; i < hdDisp.length; i++) {
        const dRow = hdDisp[i];
        const rRow = hdRaw[i] || dRow;
        const code = String(dRow[0] || '').trim();
        if (!code) continue;
        invoices.push({
          code: code,
          date: normalizeDateStr(rRow[1], dRow[1]),
          tableName: String(dRow[2] || '').trim(),
          waiter: String(dRow[3] || '').trim(),
          cashier: String(dRow[4] || '').trim(),
          customer: String(dRow[5] || 'Khách vãng lai').trim(),
          vipTier: String(dRow[6] || 'Vãng lai (0%)').trim(),
          dishAmount: parseCurrency(rRow[7], dRow[7]),
          timeUsed: String(dRow[8] || '0').trim(),
          hourAmount: parseCurrency(rRow[9], dRow[9]),
          discount: parseCurrency(rRow[10], dRow[10]),
          totalAmount: parseCurrency(rRow[11], dRow[11]),
          paymentMethod: String(dRow[12] || 'VietQR Động').trim(),
          status: String(dRow[13] || 'Đã tất toán').trim()
        });
      }
    }
    const finalInvoices = invoices.length > 0 ? invoices : fallback.invoices;

    // Đọc HOI_VIEN_VIP
    const vipMembers = [];
    if (hvSheet && hvSheet.getLastRow() >= 3) {
      const hvRaw = hvSheet.getDataRange().getValues();
      const hvDisp = hvSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < hvDisp.length; i++) {
        const dRow = hvDisp[i];
        const rRow = hvRaw[i] || dRow;
        const id = String(dRow[0] || '').trim();
        if (!id) continue;
        vipMembers.push({
          id: id,
          name: String(dRow[1] || '').trim(),
          phone: String(dRow[2] || '').trim(),
          tier: String(dRow[3] || 'Bạc (Silver - 5%)').trim(),
          spent: parseCurrency(rRow[4], dRow[4]),
          visits: parseInt(rRow[5] || dRow[5], 10) || 1,
          tierMode: String(dRow[6] || 'Tự động theo chi tiêu').trim(),
          status: String(dRow[7] || 'Hoạt động').trim(),
          notes: String(dRow[8] || '').trim()
        });
      }
    }
    const finalVipMembers = vipMembers.length > 0 ? vipMembers : fallback.vipMembers;

    // Đọc PHIEU_BEP_KDS
    const kitchenTickets = [];
    if (kdsSheet && kdsSheet.getLastRow() >= 3) {
      const kdsDisp = kdsSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < kdsDisp.length; i++) {
        const dRow = kdsDisp[i];
        const ticketId = String(dRow[0] || '').trim();
        if (!ticketId) continue;
        let parsedItems = [];
        try {
          parsedItems = JSON.parse(dRow[7] || '[]');
        } catch (e) {
          parsedItems = [];
        }
        kitchenTickets.push({
          ticketId: ticketId,
          tableCode: String(dRow[1] || '').trim(),
          tableName: String(dRow[2] || '').trim(),
          zone: String(dRow[3] || '').trim(),
          orderTime: String(dRow[4] || '').trim(),
          waiter: String(dRow[5] || '').trim(),
          status: String(dRow[6] || 'Chờ chế biến').trim(),
          items: parsedItems
        });
      }
    }
    const finalKitchenTickets = kitchenTickets.length > 0 ? kitchenTickets : fallback.kitchenTickets;

    // Đọc NHAT_KY
    const auditLogs = [];
    if (nkSheet && nkSheet.getLastRow() >= 3) {
      const nkRaw = nkSheet.getDataRange().getValues();
      const nkDisp = nkSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < nkDisp.length; i++) {
        const r = nkDisp[i];
        const rr = nkRaw[i] || r;
        if (!r[0] && !r[1]) continue;
        auditLogs.push({
          timestamp: normalizeDateStr(rr[0], r[0]),
          username: String(r[1] || ''),
          actorName: String(r[2] || ''),
          action: String(r[3] || ''),
          refCode: String(r[4] || ''),
          detail: String(r[5] || '')
        });
      }
    }
    const finalLogs = auditLogs.length > 0 ? auditLogs.reverse() : fallback.auditLogs;

    return buildPosResponse(finalTables, finalMenu, finalInvoices, settings, finalUsers, finalLogs, finalVipMembers, finalKitchenTickets, false);
  } catch (err) {
    return getFallbackPosData();
  }
}

function buildPosResponse(tables, menuItems, invoices, settings, users, auditLogs, vipMembers, kitchenTickets, isFallback) {
  let totalRevenue = 0;
  let totalDishesRevenue = 0;
  let totalHourRevenue = 0;
  let occupiedTables = 0;
  let availableTables = 0;
  let currentPendingAmount = 0;

  for (let t = 0; t < tables.length; t++) {
    const tbl = tables[t];
    if (tbl.status === 'Đang phục vụ' || tbl.status === 'Chờ thanh toán') {
      occupiedTables++;
      currentPendingAmount += Number(tbl.totalAmount) || 0;
    } else if (tbl.status === 'Trống') {
      availableTables++;
    }
  }

  for (let i = 0; i < invoices.length; i++) {
    const inv = invoices[i];
    if (inv.status === 'Đã tất toán') {
      totalRevenue += Number(inv.totalAmount) || 0;
      totalDishesRevenue += Number(inv.dishAmount) || 0;
      totalHourRevenue += Number(inv.hourAmount) || 0;
    }
  }

  return {
    success: true,
    isFallback: Boolean(isFallback),
    settings: settings,
    users: users,
    tables: tables,
    menuItems: menuItems,
    invoices: invoices,
    vipMembers: vipMembers || [],
    kitchenTickets: kitchenTickets || [],
    auditLogs: auditLogs,
    kpi: {
      totalRevenue: totalRevenue,
      totalDishesRevenue: totalDishesRevenue,
      totalHourRevenue: totalHourRevenue,
      invoiceCount: invoices.length,
      occupiedTables: occupiedTables,
      availableTables: availableTables,
      currentPendingAmount: currentPendingAmount
    }
  };
}

// ============================================================================
// QUẢN LÝ HỘI VIÊN VIP & ĐỔI CƠ CHẾ PHÂN HẠNG (VIP MEMBER & TIER MECHANISM)
// ============================================================================
function saveVipMember(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu hội viên trên phiên làm việc!' };
    const hvSheet = ss.getSheetByName('HOI_VIEN_VIP');
    const chSheet = ss.getSheetByName('CAU_HINH');

    const settings = {};
    if (chSheet && chSheet.getLastRow() >= 3) {
      const chVals = chSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < chVals.length; i++) {
        if (chVals[i][0]) settings[String(chVals[i][0]).trim()] = String(chVals[i][1] || '').trim();
      }
    }

    const id = String(payload.id || ('VIP-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'mmss'))).trim().toUpperCase();
    const name = String(payload.name || '').trim();
    const phone = String(payload.phone || '').trim();
    if (!name) return { success: false, message: 'Vui lòng nhập Họ và tên Hội viên!' };

    const spent = Math.max(0, Number(payload.spent) || 0);
    const visits = Math.max(1, parseInt(payload.visits, 10) || 1);
    const tierMode = String(payload.tierMode || 'Tự động theo chi tiêu').trim();
    const status = String(payload.status || 'Hoạt động').trim();
    const notes = String(payload.notes || '').trim();

    let tier = String(payload.tier || 'Bạc (Silver - 5%)').trim();
    if (tierMode === 'Tự động theo chi tiêu' && payload.autoRecalcTier) {
      tier = computeTierBySpent(spent, settings);
    }

    const vals = hvSheet.getDataRange().getValues();
    let rowNum = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === id) {
        rowNum = i + 1;
        break;
      }
    }

    if (rowNum > 0) {
      hvSheet.getRange(rowNum, 3).setNumberFormat('@');
      hvSheet.getRange(rowNum, 2, 1, 8).setValues([[name, phone, tier, spent, visits, tierMode, status, notes]]);
      hvSheet.getRange(rowNum, 5).setNumberFormat('#,##0 "₫"');
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT HỘI VIÊN VIP', id, 'Cập nhật hội viên ' + name + ' (' + tier + ' • ' + tierMode + ')');
      return { success: true, message: 'Đã cập nhật thông tin & hạng thẻ cho hội viên [' + name + ']!', member: { id: id, name: name, phone: phone, tier: tier, spent: spent, visits: visits, tierMode: tierMode, status: status, notes: notes } };
    } else {
      const nextR = hvSheet.getLastRow() + 1;
      hvSheet.getRange(nextR, 3).setNumberFormat('@');
      hvSheet.appendRow([id, name, phone, tier, spent, visits, tierMode, status, notes]);
      hvSheet.getRange(nextR, 5).setNumberFormat('#,##0 "₫"');
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'THÊM HỘI VIÊN VIP MỚI', id, 'Thêm hội viên mới ' + name + ' (' + phone + ' • ' + tier + ')');
      return { success: true, message: 'Đã thêm hội viên mới [' + name + '] vào danh sách VIP!', member: { id: id, name: name, phone: phone, tier: tier, spent: spent, visits: visits, tierMode: tierMode, status: status, notes: notes } };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu hội viên: ' + err.toString() };
  }
}

function deleteVipMember(memberId, actorName) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã xóa hội viên!' };
    const hvSheet = ss.getSheetByName('HOI_VIEN_VIP');
    if (!hvSheet) return { success: false, message: 'Chưa có tab HOI_VIEN_VIP!' };

    const targetId = String(memberId || '').trim().toUpperCase();
    const vals = hvSheet.getDataRange().getValues();
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === targetId) {
        const mName = vals[i][1];
        hvSheet.deleteRow(i + 1);
        SpreadsheetApp.flush();
        writeAuditLog(ss, 'admin', actorName || 'Admin', 'XÓA HỘI VIÊN VIP', targetId, 'Đã xóa hội viên ' + mName + ' (' + targetId + ')');
        return { success: true, message: 'Đã xóa hội viên [' + mName + ']!' };
      }
    }
    return { success: false, message: 'Không tìm thấy mã hội viên ' + targetId };
  } catch (err) {
    return { success: false, message: 'Lỗi xóa hội viên: ' + err.toString() };
  }
}

function saveVipTierMechanism(cfgPayload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu cơ chế phân hạng hội viên!' };
    const chSheet = ss.getSheetByName('CAU_HINH');
    const hvSheet = ss.getSheetByName('HOI_VIEN_VIP');

    const keysToSave = ['DISCOUNT_SILVER', 'DISCOUNT_GOLD', 'DISCOUNT_PLATINUM', 'TIER_SILVER_MIN', 'TIER_GOLD_MIN', 'TIER_PLATINUM_MIN', 'VIP_TIER_MODE'];
    const chVals = chSheet.getDataRange().getValues();
    const existingKeys = {};
    for (let i = 2; i < chVals.length; i++) {
      existingKeys[String(chVals[i][0]).trim()] = i + 1;
    }

    keysToSave.forEach(function(k) {
      if (cfgPayload.hasOwnProperty(k)) {
        if (existingKeys[k]) {
          chSheet.getRange(existingKeys[k], 2).setNumberFormat('@').setValue(String(cfgPayload[k]));
        } else {
          const nextR = chSheet.getLastRow() + 1;
          chSheet.getRange(nextR, 2).setNumberFormat('@');
          chSheet.appendRow([k, String(cfgPayload[k]), 'Cấu hình cơ chế phân hạng hội viên VIP']);
        }
      }
    });

    // Tự động tính lại hạng thẻ cho toàn bộ hội viên có chế độ "Tự động theo chi tiêu" (hoặc nếu ép tính lại tất cả)
    if (hvSheet && hvSheet.getLastRow() >= 3 && cfgPayload.recalcAllMembers) {
      const hvVals = hvSheet.getDataRange().getValues();
      for (let r = 2; r < hvVals.length; r++) {
        const mode = String(hvVals[r][6] || 'Tự động theo chi tiêu').trim();
        if (cfgPayload.forceOverrideAll || mode === 'Tự động theo chi tiêu') {
          const spent = parseCurrency(hvVals[r][4], hvVals[r][4]);
          const newTier = computeTierBySpent(spent, cfgPayload);
          hvSheet.getRange(r + 1, 4).setValue(newTier);
          if (cfgPayload.forceOverrideAll) {
            hvSheet.getRange(r + 1, 7).setValue('Tự động theo chi tiêu');
          }
        }
      }
    }

    SpreadsheetApp.flush();
    writeAuditLog(ss, cfgPayload.username || 'admin', cfgPayload.actorName || 'Admin', 'ĐỔI CƠ CHẾ HẠNG VIP', 'HOI_VIEN_VIP', 'Cập nhật ngưỡng lên hạng Bạc/Vàng/Bạch Kim & % chiết khấu');
    return { success: true, message: 'Đã cập nhật cơ chế phân hạng & tự động đồng bộ hạng thẻ cho các hội viên!' };
  } catch (err) {
    return { success: false, message: 'Lỗi cập nhật cơ chế phân hạng: ' + err.toString() };
  }
}

// ============================================================================
// ĐIỀU PHỐI PHIẾU BẾP KDS & ĐỒNG BỘ TRẠNG THÁI BÀN (KDS WORKFLOW SYNC)
// ============================================================================
function createOrUpdateKdsTicket(ticketPayload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã cập nhật phiếu bếp KDS!' };
    const kdsSheet = ss.getSheetByName('PHIEU_BEP_KDS');
    const sdbSheet = ss.getSheetByName('SO_DO_BAN');

    const ticketId = String(ticketPayload.ticketId || '').trim();
    const tableCode = String(ticketPayload.tableCode || '').trim();
    const tableName = String(ticketPayload.tableName || tableCode).trim();
    const zone = String(ticketPayload.zone || '').trim();
    const orderTime = String(ticketPayload.orderTime || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'HH:mm')).trim();
    const waiter = String(ticketPayload.waiter || 'Phục vụ').trim();
    const status = String(ticketPayload.status || 'Chờ chế biến').trim();
    const itemsJson = JSON.stringify(ticketPayload.items || []);

    if (kdsSheet) {
      const vals = kdsSheet.getDataRange().getValues();
      let rowNum = -1;
      for (let i = 2; i < vals.length; i++) {
        if (String(vals[i][0]).trim() === ticketId) {
          rowNum = i + 1;
          break;
        }
      }
      if (rowNum > 0) {
        kdsSheet.getRange(rowNum, 7, 1, 2).setValues([[status, itemsJson]]);
      } else {
        const nextR = kdsSheet.getLastRow() + 1;
        kdsSheet.getRange(nextR, 5).setNumberFormat('@');
        kdsSheet.appendRow([ticketId, tableCode, tableName, zone, orderTime, waiter, status, itemsJson]);
      }
    }

    // Đồng bộ trạng thái bếp lên cột 13 (Trạng Thái Bếp KDS) của SO_DO_BAN
    if (sdbSheet && tableCode) {
      const sdbVals = sdbSheet.getDataRange().getValues();
      for (let j = 2; j < sdbVals.length; j++) {
        if (String(sdbVals[j][0]).trim().toUpperCase() === tableCode.toUpperCase()) {
          sdbSheet.getRange(j + 1, 13).setValue(status);
          break;
        }
      }
    }

    SpreadsheetApp.flush();
    writeAuditLog(ss, ticketPayload.username || 'kitchen', ticketPayload.actorName || 'Bếp KDS', 'CẬP NHẬT PHIẾU BẾP KDS', ticketId, 'Bàn ' + tableName + ' -> Trạng thái bếp: ' + status);
    return { success: true, message: 'Đã cập nhật trạng thái phiếu bếp [' + ticketId + '] thành: ' + status };
  } catch (err) {
    return { success: false, message: 'Lỗi cập nhật KDS: ' + err.toString() };
  }
}

function updateTableOrder(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu order bàn trên phiên làm việc!' };
    const sdbSheet = ss.getSheetByName('SO_DO_BAN');
    if (!sdbSheet) return { success: false, message: 'Chưa có tab SO_DO_BAN!' };

    const tableCode = String(payload.tableCode || '').trim();
    const vals = sdbSheet.getDataRange().getValues();
    let rowNum = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === tableCode.toUpperCase()) {
        rowNum = i + 1;
        break;
      }
    }

    const status = String(payload.status || 'Đang phục vụ').trim();
    const openTime = payload.openTime !== undefined ? String(payload.openTime).trim() : Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    const guestCount = parseInt(payload.guestCount, 10) || 0;
    const dishAmount = Number(payload.dishAmount) || 0;
    const hourAmount = Number(payload.hourAmount) || 0;
    const totalAmount = Number(payload.totalAmount) !== undefined && !isNaN(Number(payload.totalAmount)) ? Number(payload.totalAmount) : (dishAmount + hourAmount);
    const notes = String(payload.notes || '').trim();
    const kdsStatus = String(payload.kdsStatus || (status === 'Trống' ? '---' : 'Chờ chế biến')).trim();

    if (rowNum === -1) {
      const nextR = sdbSheet.getLastRow() + 1;
      sdbSheet.getRange(nextR, 7).setNumberFormat('@');
      sdbSheet.appendRow([
        tableCode,
        payload.tableName || tableCode,
        payload.zone || 'Tầng 1 — Cafe & Sân Vườn',
        payload.serviceType || 'Bàn Cafe thường',
        status,
        Number(payload.hourlyRate) || 0,
        openTime,
        guestCount,
        dishAmount,
        hourAmount,
        totalAmount,
        notes,
        kdsStatus
      ]);
      sdbSheet.getRange(nextR, 9, 1, 3).setNumberFormat('#,##0 "₫"');
    } else {
      sdbSheet.getRange(rowNum, 5).setValue(status);
      sdbSheet.getRange(rowNum, 7).setNumberFormat('@').setValue(openTime);
      sdbSheet.getRange(rowNum, 8).setValue(guestCount);
      sdbSheet.getRange(rowNum, 9, 1, 3).setValues([[dishAmount, hourAmount, totalAmount]]);
      sdbSheet.getRange(rowNum, 9, 1, 3).setNumberFormat('#,##0 "₫"');
      sdbSheet.getRange(rowNum, 12).setValue(notes);
      if (payload.kdsStatus) {
        sdbSheet.getRange(rowNum, 13).setValue(kdsStatus);
      }
    }

    SpreadsheetApp.flush();
    writeAuditLog(ss, payload.username || 'staff', payload.actorName || 'Nhân viên Order', 'GỌI MÓN / CẬP NHẬT BÀN', tableCode, 'Bàn ' + tableCode + ' - Trạng thái: ' + status + ' - Tiền: ' + totalAmount + ' ₫ (' + notes + ')');

    return { success: true, message: 'Đã lưu order bàn [' + tableCode + '] thành công!' };
  } catch (err) {
    return { success: false, message: 'Lỗi cập nhật bàn: ' + err.toString() };
  }
}

function saveTableItem(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu bàn trên phiên làm việc!' };
    const sdbSheet = ss.getSheetByName('SO_DO_BAN');

    const code = String(payload.code || '').trim().toUpperCase();
    const name = String(payload.name || '').trim();
    if (!code || !name) return { success: false, message: 'Vui lòng nhập Mã bàn và Tên bàn!' };

    const zone = String(payload.zone || 'Tầng 1 — Cafe & Sân Vườn').trim();
    const serviceType = String(payload.serviceType || 'Bàn Cafe thường').trim();
    const hourlyRate = Number(payload.hourlyRate) || 0;
    const notes = String(payload.notes || '').trim();

    const vals = sdbSheet.getDataRange().getValues();
    let rowNum = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === code) {
        rowNum = i + 1;
        break;
      }
    }

    if (rowNum > 0) {
      sdbSheet.getRange(rowNum, 2, 1, 3).setValues([[name, zone, serviceType]]);
      sdbSheet.getRange(rowNum, 6).setValue(hourlyRate).setNumberFormat('#,##0 "₫"');
      sdbSheet.getRange(rowNum, 12).setValue(notes);
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT BÀN', code, 'Cập nhật bàn ' + code + ' (' + name + ')');
      return { success: true, message: 'Đã cập nhật bàn [' + name + ']!' };
    } else {
      const nextR = sdbSheet.getLastRow() + 1;
      sdbSheet.getRange(nextR, 7).setNumberFormat('@');
      sdbSheet.appendRow([code, name, zone, serviceType, 'Trống', hourlyRate, '', 0, 0, 0, 0, notes, '---']);
      sdbSheet.getRange(nextR, 6).setNumberFormat('#,##0 "₫"');
      sdbSheet.getRange(nextR, 9, 1, 3).setNumberFormat('#,##0 "₫"');
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'THÊM BÀN MỚI', code, 'Thêm bàn mới ' + code + ' (' + name + ')');
      return { success: true, message: 'Đã thêm bàn mới [' + name + '] vào sơ đồ bàn!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu bàn: ' + err.toString() };
  }
}

function checkoutTable(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã tất toán hóa đơn!' };
    const sdbSheet = ss.getSheetByName('SO_DO_BAN');
    const hdSheet = ss.getSheetByName('HOA_DON');
    const hvSheet = ss.getSheetByName('HOI_VIEN_VIP');
    const kdsSheet = ss.getSheetByName('PHIEU_BEP_KDS');
    const chSheet = ss.getSheetByName('CAU_HINH');

    if (!sdbSheet || !hdSheet) return { success: false, message: 'Chưa có tab SO_DO_BAN hoặc HOA_DON!' };

    const tableCode = String(payload.tableCode || '').trim();
    const code = payload.code || ('HD-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmm'));
    const txDate = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    const tableName = String(payload.tableName || tableCode).trim();
    const waiter = String(payload.waiter || 'Phục vụ').trim();
    const cashier = String(payload.cashier || 'Thu ngân').trim();
    const customer = String(payload.customer || 'Khách vãng lai').trim();
    const vipTier = String(payload.vipTier || 'Vãng lai (0%)').trim();
    const dishAmount = Number(payload.dishAmount) || 0;
    const timeUsed = String(payload.timeUsed || '0 phút').trim();
    const hourAmount = Number(payload.hourAmount) || 0;
    const discount = Number(payload.discount) || 0;
    const totalAmount = Number(payload.totalAmount) || Math.max(0, dishAmount + hourAmount - discount);
    const method = String(payload.paymentMethod || 'VietQR Động').trim();

    // 1. Ghi vào HOA_DON
    const nextHdRow = hdSheet.getLastRow() + 1;
    hdSheet.getRange(nextHdRow, 2).setNumberFormat('@');
    hdSheet.appendRow([
      code, txDate, tableName, waiter, cashier, customer, vipTier,
      dishAmount, timeUsed, hourAmount, discount, totalAmount, method, 'Đã tất toán'
    ]);
    hdSheet.getRange(nextHdRow, 8).setNumberFormat('#,##0 "₫"');
    hdSheet.getRange(nextHdRow, 10, 1, 3).setNumberFormat('#,##0 "₫"');

    // 2. Reset Bàn về Trống
    const vals = sdbSheet.getDataRange().getValues();
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === tableCode.toUpperCase()) {
        const rowNum = i + 1;
        sdbSheet.getRange(rowNum, 5).setValue('Trống');
        sdbSheet.getRange(rowNum, 7).setValue('');
        sdbSheet.getRange(rowNum, 8).setValue(0);
        sdbSheet.getRange(rowNum, 9, 1, 3).setValues([[0, 0, 0]]);
        sdbSheet.getRange(rowNum, 12).setValue('Đã thanh toán bill ' + code);
        sdbSheet.getRange(rowNum, 13).setValue('---');
        break;
      }
    }

    // 3. Đánh dấu các phiếu bếp của bàn này thành Đã giao bàn
    if (kdsSheet && kdsSheet.getLastRow() >= 3) {
      const kdsVals = kdsSheet.getDataRange().getValues();
      for (let k = 2; k < kdsVals.length; k++) {
        if (String(kdsVals[k][1]).trim().toUpperCase() === tableCode.toUpperCase() && String(kdsVals[k][6]).trim() !== 'Đã giao bàn') {
          kdsSheet.getRange(k + 1, 7).setValue('Đã giao bàn');
        }
      }
    }

    // 4. Tự động cộng chi tiêu tích lũy & nâng hạng cho Hội viên VIP nếu khớp mã hoặc tên/SĐT
    if (hvSheet && hvSheet.getLastRow() >= 3 && (payload.memberId || (customer && customer !== 'Khách vãng lai'))) {
      const settings = {};
      if (chSheet && chSheet.getLastRow() >= 3) {
        const chVals = chSheet.getDataRange().getDisplayValues();
        for (let c = 2; c < chVals.length; c++) {
          if (chVals[c][0]) settings[String(chVals[c][0]).trim()] = String(chVals[c][1] || '').trim();
        }
      }
      const hvVals = hvSheet.getDataRange().getValues();
      const targetMemberId = String(payload.memberId || '').trim().toUpperCase();
      for (let m = 2; m < hvVals.length; m++) {
        const rowId = String(hvVals[m][0]).trim().toUpperCase();
        const rowName = String(hvVals[m][1]).trim().toLowerCase();
        const rowPhone = String(hvVals[m][2]).trim();
        if ((targetMemberId && rowId === targetMemberId) || (rowName && customer.toLowerCase().indexOf(rowName) !== -1) || (rowPhone && customer.indexOf(rowPhone) !== -1)) {
          const newSpent = (parseCurrency(hvVals[m][4], hvVals[m][4]) || 0) + totalAmount;
          const newVisits = (parseInt(hvVals[m][5], 10) || 0) + 1;
          const mode = String(hvVals[m][6] || 'Tự động theo chi tiêu').trim();
          const updatedTier = (mode === 'Tự động theo chi tiêu') ? computeTierBySpent(newSpent, settings) : String(hvVals[m][3]);
          hvSheet.getRange(m + 1, 4, 1, 3).setValues([[updatedTier, newSpent, newVisits]]);
          hvSheet.getRange(m + 1, 5).setNumberFormat('#,##0 "₫"');
          break;
        }
      }
    }

    SpreadsheetApp.flush();
    writeAuditLog(ss, payload.username || 'cashier', cashier, 'THANH TOÁN HÓA ĐƠN', code, 'Thanh toán thành công ' + totalAmount + ' ₫ cho ' + tableName + ' (' + method + ')');

    return { success: true, message: 'Đã thanh toán hóa đơn [' + code + '] và trả bàn [' + tableCode + '] về trạng thái Trống!', code: code };
  } catch (err) {
    return { success: false, message: 'Lỗi thanh toán bàn: ' + err.toString() };
  }
}

function saveMenuItem(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu món ăn vào thực đơn!' };
    const tdSheet = ss.getSheetByName('THUC_DON');

    const code = String(payload.code || '').trim().toUpperCase();
    const name = String(payload.name || '').trim();
    if (!code || !name) return { success: false, message: 'Vui lòng nhập Mã món và Tên món!' };

    const cat = String(payload.category || 'Món khác').trim();
    const unit = String(payload.unit || 'Phần').trim();
    const price = Number(payload.price) || 0;
    const cost = Number(payload.costPrice) || 0;
    const promo = String(payload.promo || 'Không').trim();
    const kitchen = String(payload.kitchenStation || 'Bếp').trim();
    const status = String(payload.status || 'Còn hàng').trim();
    const notes = String(payload.notes || '').trim();

    const vals = tdSheet.getDataRange().getValues();
    let rowNum = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === code) {
        rowNum = i + 1;
        break;
      }
    }

    if (rowNum > 0) {
      tdSheet.getRange(rowNum, 2, 1, 9).setValues([[name, cat, unit, price, cost, promo, kitchen, status, notes]]);
      tdSheet.getRange(rowNum, 5, 1, 2).setNumberFormat('#,##0 "₫"');
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT MÓN', code, 'Cập nhật món ' + code + ' (' + name + ' - ' + price + ' ₫)');
      return { success: true, message: 'Đã cập nhật món [' + name + '] thành công!' };
    } else {
      const nextR = tdSheet.getLastRow() + 1;
      tdSheet.appendRow([code, name, cat, unit, price, cost, promo, kitchen, status, notes]);
      tdSheet.getRange(nextR, 5, 1, 2).setNumberFormat('#,##0 "₫"');
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'THÊM MÓN MỚI', code, 'Thêm mới món ' + code + ' (' + name + ' - ' + price + ' ₫)');
      return { success: true, message: 'Đã thêm món mới [' + name + '] vào thực đơn!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu món: ' + err.toString() };
  }
}

function saveStoreConfig(cfg) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu cấu hình quán và VietQR!' };
    const chSheet = ss.getSheetByName('CAU_HINH');
    if (!chSheet) return { success: false, message: 'Chưa có tab CAU_HINH!' };

    const vals = chSheet.getDataRange().getValues();
    const existingKeys = {};
    for (let i = 2; i < vals.length; i++) {
      existingKeys[String(vals[i][0]).trim()] = i + 1;
    }

    Object.keys(cfg).forEach(function(k) {
      if (k === 'username' || k === 'actorName') return;
      if (existingKeys[k]) {
        chSheet.getRange(existingKeys[k], 2).setNumberFormat('@').setValue(String(cfg[k]));
      } else {
        const nextR = chSheet.getLastRow() + 1;
        chSheet.getRange(nextR, 2).setNumberFormat('@');
        chSheet.appendRow([k, String(cfg[k]), 'Cấu hình bổ sung']);
      }
    });

    writeAuditLog(ss, cfg.username || 'admin', cfg.actorName || 'Admin', 'CẬP NHẬT CẤU HÌNH', 'CAU_HINH', 'Thay đổi thông tin quán / tài khoản VietQR / tỷ lệ chiết khấu');
    return { success: true, message: 'Đã lưu cấu hình quán, VietQR và cơ chế hạng VIP thành công!' };
  } catch (err) {
    return { success: false, message: 'Lỗi lưu cấu hình: ' + err.toString() };
  }
}

function saveUserAccount(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu tài khoản nhân sự!' };
    const pqSheet = ss.getSheetByName('PHAN_QUYEN');

    const uname = String(payload.username || '').trim().toLowerCase();
    const pass = String(payload.password || '123456').trim();
    const fullName = String(payload.fullName || '').trim();
    const role = String(payload.role || 'STAFF').trim();
    const assignedZone = (role === 'ADMIN' || role === 'CASHIER') ? 'ALL' : String(payload.assignedZone || 'Tầng 1 — Cafe & Sân Vườn').trim();
    const status = String(payload.status || 'Hoạt động').trim();

    if (!uname || !fullName) return { success: false, message: 'Vui lòng nhập Tên đăng nhập và Họ tên!' };

    let permDesc = 'Nhân viên phục vụ gọi món tại ' + assignedZone;
    if (role === 'ADMIN') permDesc = 'Quản lý toàn quyền hệ thống';
    else if (role === 'CASHIER') permDesc = 'Thu ngân thanh toán POS & In hóa đơn K80';
    else if (role === 'KITCHEN') permDesc = 'Màn hình Bếp KDS chế biến món';

    const vals = pqSheet.getDataRange().getValues();
    let rowNum = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toLowerCase() === uname) {
        rowNum = i + 1;
        break;
      }
    }

    if (rowNum > 0) {
      pqSheet.getRange(rowNum, 2).setNumberFormat('@');
      pqSheet.getRange(rowNum, 2, 1, 6).setValues([[pass, fullName, role, assignedZone, permDesc, status]]);
      writeAuditLog(ss, payload.actorUsername || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT TÀI KHOẢN', uname, 'Cập nhật TK ' + uname + ' (' + role + ')');
      return { success: true, message: 'Đã cập nhật tài khoản [' + uname + ']!' };
    } else {
      const nextR = pqSheet.getLastRow() + 1;
      pqSheet.getRange(nextR, 1, 1, 2).setNumberFormat('@');
      pqSheet.appendRow([uname, pass, fullName, role, assignedZone, permDesc, status]);
      writeAuditLog(ss, payload.actorUsername || 'admin', payload.actorName || 'Admin', 'TẠO TÀI KHOẢN MỚI', uname, 'Tạo mới TK ' + uname + ' (' + role + ')');
      return { success: true, message: 'Đã tạo tài khoản mới [' + uname + ']!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu tài khoản: ' + err.toString() };
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

function getFallbackPosData() {
  const settings = {
    STORE_NAME: 'NEXSIMPLE F&B RESTAURANT & COFFEE',
    STORE_ADDRESS: 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM',
    STORE_PHONE: '0974 755 104',
    STORE_WIFI: 'NexSimple_Coffee / Pass: 88889999',
    BANK_ID: 'MB',
    BANK_ACCOUNT_NO: '0974755104',
    BANK_ACCOUNT_NAME: 'NGUYEN MINH TUAN',
    DISCOUNT_SILVER: '5',
    DISCOUNT_GOLD: '10',
    DISCOUNT_PLATINUM: '15',
    TIER_SILVER_MIN: '3000000',
    TIER_GOLD_MIN: '8000000',
    TIER_PLATINUM_MIN: '15000000',
    VIP_TIER_MODE: 'AUTO_AND_MANUAL',
    PRINT_TEMPLATE_STANDARD: 'HÓA ĐƠN THANH TOÁN (BILL TÍNH TIỀN) - KHỔ K80 / A5'
  };

  const users = getDefaultUsersList();

  const tables = [
    { code: 'BAN-01', name: 'Bàn 01 (Cửa Sổ)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Đang phục vụ', hourlyRate: 0, openTime: '2026-10-28 08:15', guestCount: 3, dishAmount: 119000, hourAmount: 0, totalAmount: 119000, notes: '2x Cà Phê Muối Đặc Biệt, 1x Bánh Tiramisu Cacao Ý', kdsStatus: 'Đã giao bàn' },
    { code: 'BAN-02', name: 'Bàn 02 (Sofa)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Trống', hourlyRate: 0, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'Đã dọn dẹp sạch sẽ', kdsStatus: '---' },
    { code: 'BAN-03', name: 'Bàn 03 (Gia Đình)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Đang phục vụ', hourlyRate: 0, openTime: '2026-10-28 08:30', guestCount: 4, dishAmount: 129000, hourAmount: 0, totalAmount: 129000, notes: '3x Trà Đào Cam Sả Tươi (Mua 2 Tặng 1), 1x Khoai Tây Chiên Lắc Phô Mai', kdsStatus: 'Đang chế biến' },
    { code: 'BAN-04', name: 'Bàn 04 (Ban Công)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Trống', hourlyRate: 0, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'View thoáng mát', kdsStatus: '---' },
    { code: 'NH-01', name: 'Bàn Ăn 01 (Lẩu/Nướng)', zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh', serviceType: 'Bàn Ăn Nhà Hàng', status: 'Đang phục vụ', hourlyRate: 0, openTime: '2026-10-28 08:20', guestCount: 5, dishAmount: 622000, hourAmount: 0, totalAmount: 622000, notes: '1x Combo Lẩu Hải Sản Thượng Hạng, 2x Trà Ô Long Sữa Trân Châu', kdsStatus: 'Chờ chế biến' },
    { code: 'NH-02', name: 'Bàn Ăn 02 (VIP Tròn)', zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh', serviceType: 'Bàn Ăn Nhà Hàng', status: 'Trống', hourlyRate: 0, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'Sẵn sàng đón khách', kdsStatus: '---' },
    { code: 'NH-03', name: 'Bàn Ăn 03 (Gia Đình)', zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh', serviceType: 'Bàn Ăn Nhà Hàng', status: 'Đang phục vụ', hourlyRate: 0, openTime: '2026-10-28 08:10', guestCount: 2, dishAmount: 370000, hourAmount: 0, totalAmount: 370000, notes: '2x Bò Bít Tết Sốt Tiêu Đen', kdsStatus: 'Đã giao bàn' },
    { code: 'BIDA-01', name: 'Bàn Bida 01 (Carom)', zone: 'Khu Bida & Phòng VIP Tính Giờ', serviceType: 'Bàn Tính Giờ (Bida/VIP)', status: 'Đang phục vụ', hourlyRate: 60000, openTime: '2026-10-28 07:30', guestCount: 2, dishAmount: 74000, hourAmount: 90000, totalAmount: 164000, notes: '1x Cà Phê Sữa Đá, 1x Khoai Tây Chiên + 90 phút Bida', kdsStatus: 'Đã xong - Chờ bưng' },
    { code: 'BIDA-02', name: 'Bàn Bida 02 (Pool)', zone: 'Khu Bida & Phòng VIP Tính Giờ', serviceType: 'Bàn Tính Giờ (Bida/VIP)', status: 'Trống', hourlyRate: 60000, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'Bàn 9 bóng chuẩn giải đấu', kdsStatus: '---' },
    { code: 'VIP-01', name: 'Phòng VIP Hoàng Gia', zone: 'Khu Bida & Phòng VIP Tính Giờ', serviceType: 'Bàn Tính Giờ (Bida/VIP)', status: 'Đang phục vụ', hourlyRate: 120000, openTime: '2026-10-28 07:00', guestCount: 8, dishAmount: 1062000, hourAmount: 240000, totalAmount: 1302000, notes: '2x Combo Lẩu Hải Sản Thượng Hạng + 120 phút Phòng VIP', kdsStatus: 'Đã giao bàn' }
  ];

  const menuItems = [
    { code: 'MN-CF-01', name: 'Cà Phê Muối Đặc Biệt', category: 'Cà Phê', unit: 'Ly', price: 35000, costPrice: 12000, promo: 'Không', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Kem muối béo ngậy, cafe rang mộc' },
    { code: 'MN-CF-02', name: 'Cà Phê Sữa Đá Sài Gòn', category: 'Cà Phê', unit: 'Ly', price: 29000, costPrice: 9000, promo: 'Không', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Robusta đậm đà, sữa đặc truyền thống' },
    { code: 'MN-TR-01', name: 'Trà Đào Cam Sả Tươi', category: 'Trà & Nước Ép', unit: 'Ly', price: 42000, costPrice: 14000, promo: 'Mua 2 Tặng 1', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Tự động tặng 1 ly miễn phí khi gọi đủ 3 ly' },
    { code: 'MN-TR-02', name: 'Trà Ô Long Sữa Trân Châu', category: 'Trà & Nước Ép', unit: 'Ly', price: 45000, costPrice: 15000, promo: 'Mua 2 Tặng 1', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Trân châu đen dẻo dai — Mua 2 Tặng 1' },
    { code: 'MN-AN-01', name: 'Bò Bít Tết Sốt Tiêu Đen', category: 'Món Chính & Lẩu', unit: 'Đĩa', price: 185000, costPrice: 85000, promo: 'Không', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Thăn bò Úc mềm mọng sốt tiêu cay nhẹ' },
    { code: 'MN-AN-02', name: 'Mì Ý Sốt Bò Bằm Bolognaise', category: 'Món Chính & Lẩu', unit: 'Đĩa', price: 95000, costPrice: 38000, promo: 'Không', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Sốt cà chua bò tươi chuẩn Ý' },
    { code: 'MN-AN-03', name: 'Khoai Tây Chiên Lắc Phô Mai', category: 'Ăn Nhẹ & Khai Vị', unit: 'Đĩa', price: 45000, costPrice: 16000, promo: 'Mua Kèm Giảm 20%', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Mua kèm đồ uống hoặc combo giảm ngay 20%' },
    { code: 'MN-AN-04', name: 'Bánh Tiramisu Cacao Ý', category: 'Bánh & Tráng Miệng', unit: 'Phần', price: 49000, costPrice: 18000, promo: 'Mua Kèm Giảm 20%', kitchenStation: 'Bếp Lạnh / Bánh', status: 'Còn hàng', notes: 'Mua kèm Cà phê/Trà giảm 20%' },
    { code: 'CB-LUNCH-01', name: 'Combo Trưa Nhanh (Mì Ý + Cà Phê + Bánh)', category: 'Combo Tiết Kiệm', unit: 'Combo', price: 159000, costPrice: 65000, promo: 'Combo Giảm 15%', kitchenStation: 'Bếp & Pha Chế', status: 'Còn hàng', notes: 'Tiết kiệm 15% so với gọi lẻ từng món' },
    { code: 'CB-LAU-02', name: 'Combo Lẩu Hải Sản Thượng Hạng (4-5 người)', category: 'Combo Tiết Kiệm', unit: 'Nồi', price: 590000, costPrice: 260000, promo: 'Giảm 10% Giờ Vàng', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Tôm càng, mực ống, cá hồi, rau nấm tươi' },
    { code: 'CB-BIDA-03', name: 'Combo Chiến Hữu Bida (4 Nước Tăng Lực + Khô Bò)', category: 'Combo Tiết Kiệm', unit: 'Combo', price: 140000, costPrice: 55000, promo: 'Combo Giảm 15%', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Combo ưu đãi dành riêng cho bàn Bida & VIP' }
  ];

  const vipMembers = [
    { id: 'VIP-01', name: 'Công ty Cổ phần AlphaTech', phone: '0909 111 222', tier: 'Bạch Kim (Platinum - 15%)', spent: 28500000, visits: 24, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Khách doanh nghiệp đặt tiệc VIP thường xuyên' },
    { id: 'VIP-02', name: 'Nguyễn Hoàng Hải', phone: '0918 666 888', tier: 'Bạch Kim (Platinum - 15%)', spent: 19200000, visits: 19, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Hội viên Platinum — Ưu tiên phòng VIP' },
    { id: 'VIP-03', name: 'Phạm Quốc Cường', phone: '0918 889 999', tier: 'Vàng (Gold - 10%)', spent: 11400000, visits: 15, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Khách quen khu Cafe & Bida' },
    { id: 'VIP-04', name: 'Lê Ngọc Bảo Trân', phone: '0988 777 555', tier: 'Vàng (Gold - 10%)', spent: 8900000, visits: 12, tierMode: 'Cố định hạng (Chủ quán cấp)', status: 'Hoạt động', notes: 'Đối tác thân thiết được cấp thẻ Vàng' },
    { id: 'VIP-05', name: 'Trần Đình Trọng', phone: '0974 123 456', tier: 'Bạc (Silver - 5%)', spent: 4200000, visits: 8, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Hội viên CLB Bida Carom' },
    { id: 'VIP-06', name: 'Võ Minh Khôi', phone: '0933 444 999', tier: 'Bạc (Silver - 5%)', spent: 3150000, visits: 6, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Hội viên mới đăng ký thẻ Bạc' }
  ];

  const kitchenTickets = [
    {
      ticketId: 'KDS-1001',
      tableCode: 'BAN-03',
      tableName: 'Bàn 03 (Gia Đình)',
      zone: 'Tầng 1 — Cafe & Sân Vườn',
      orderTime: '08:30',
      waiter: 'Nguyễn Văn Minh (order_tang1)',
      items: [
        { code: 'MN-TR-01', name: 'Trà Đào Cam Sả Tươi', qty: 3, kitchenStation: 'Quầy Pha Chế', notes: 'Mua 2 Tặng 1 — Ít đá', itemStatus: 'Đang chế biến' },
        { code: 'MN-AN-03', name: 'Khoai Tây Chiên Lắc Phô Mai', qty: 1, kitchenStation: 'Bếp Nấu Nóng', notes: 'Kèm tương ớt', itemStatus: 'Đang chế biến' }
      ],
      status: 'Đang chế biến'
    },
    {
      ticketId: 'KDS-1002',
      tableCode: 'NH-01',
      tableName: 'Bàn Ăn 01 (Lẩu/Nướng)',
      zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh',
      orderTime: '08:35',
      waiter: 'Nguyễn Văn Minh (order_tang1)',
      items: [
        { code: 'CB-LAU-02', name: 'Combo Lẩu Hải Sản Thượng Hạng (4-5 người)', qty: 1, kitchenStation: 'Bếp Nấu Nóng', notes: 'Nước lẩu Thái chua cay', itemStatus: 'Chờ chế biến' },
        { code: 'MN-TR-02', name: 'Trà Ô Long Sữa Trân Châu', qty: 2, kitchenStation: 'Quầy Pha Chế', notes: '50% đường', itemStatus: 'Chờ chế biến' }
      ],
      status: 'Chờ chế biến'
    },
    {
      ticketId: 'KDS-1003',
      tableCode: 'BIDA-01',
      tableName: 'Bàn Bida 01 (Carom)',
      zone: 'Khu Bida & Phòng VIP Tính Giờ',
      orderTime: '08:15',
      waiter: 'Hoàng Văn Bách (order_bida)',
      items: [
        { code: 'MN-CF-02', name: 'Cà Phê Sữa Đá Sài Gòn', qty: 1, kitchenStation: 'Quầy Pha Chế', notes: 'Đậm cafe', itemStatus: 'Đã xong' }
      ],
      status: 'Đã xong - Chờ bưng'
    }
  ];

  const invoices = [
    { code: 'HD-2026-1001', date: '2026-10-26 10:30', tableName: 'Bàn 01 (Cửa Sổ)', waiter: 'Nguyễn Văn Minh', cashier: 'Lê Thu Trang', customer: 'Phạm Quốc Cường (0918 889 999)', vipTier: 'Vàng (Gold - 10%)', dishAmount: 145000, timeUsed: '0', hourAmount: 0, discount: 14500, totalAmount: 130500, paymentMethod: 'VietQR Động', status: 'Đã tất toán' },
    { code: 'HD-2026-1002', date: '2026-10-26 12:15', tableName: 'Bàn Ăn 01 (Lẩu/Nướng)', waiter: 'Nguyễn Văn Minh', cashier: 'Lê Thu Trang', customer: 'Công ty Cổ phần AlphaTech (0909 111 222)', vipTier: 'Bạch Kim (Platinum - 15%)', dishAmount: 680000, timeUsed: '0', hourAmount: 0, discount: 102000, totalAmount: 578000, paymentMethod: 'VietQR Động', status: 'Đã tất toán' },
    { code: 'HD-2026-1003', date: '2026-10-26 14:00', tableName: 'Bàn Bida 01 (Carom)', waiter: 'Hoàng Văn Bách', cashier: 'Lê Thu Trang', customer: 'Trần Đình Trọng (0974 123 456)', vipTier: 'Bạc (Silver - 5%)', dishAmount: 85000, timeUsed: '120 phút (2.0h)', hourAmount: 120000, discount: 10250, totalAmount: 194750, paymentMethod: 'Tiền mặt', status: 'Đã tất toán' },
    { code: 'HD-2026-1004', date: '2026-10-26 16:45', tableName: 'Bàn 03 (Gia Đình)', waiter: 'Nguyễn Văn Minh', cashier: 'Lê Thu Trang', customer: 'Khách Vãng Lai', vipTier: 'Vãng lai (0%)', dishAmount: 185000, timeUsed: '0', hourAmount: 0, discount: 42000, totalAmount: 143000, paymentMethod: 'VietQR Động', status: 'Đã tất toán' }
  ];

  const auditLogs = [
    { timestamp: '2026-10-26 16:45:00', username: 'thungan_ca1', actorName: 'Lê Thu Trang (CASHIER)', action: 'THANH TOÁN HÓA ĐƠN', refCode: 'HD-2026-1004', detail: 'Thanh toán Bàn 03 (Gia Đình) thành công 143,000 ₫ qua VietQR Động. Áp dụng Mua 2 tặng 1.' },
    { timestamp: '2026-10-26 14:00:00', username: 'thungan_ca1', actorName: 'Lê Thu Trang (CASHIER)', action: 'THANH TOÁN HÓA ĐƠN', refCode: 'HD-2026-1003', detail: 'Thanh toán Bàn Bida 01 (Carom) 194,750 ₫. Tiền giờ 120,000 ₫ + Tiền đồ uống 85,000 ₫. Chiết khấu VIP Bạc 5%.' },
    { timestamp: '2026-10-26 10:30:15', username: 'thungan_ca1', actorName: 'Lê Thu Trang (CASHIER)', action: 'THANH TOÁN HÓA ĐƠN', refCode: 'HD-2026-1001', detail: 'Thanh toán Bàn 01 (Cửa Sổ) thành công 130,500 ₫ qua VietQR Động. Chiết khấu Gold 10%.' }
  ];

  return buildPosResponse(tables, menuItems, invoices, settings, users, auditLogs, vipMembers, kitchenTickets, true);
}


```

## 📁 FILE 4/4: `Index.html`

```
<!DOCTYPE html>
<html lang="vi" data-bs-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GS-005: F&B POS Nhà Hàng, Cafe, Bida Tính Giờ & VietQR Động v3.3 Pro</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --sidebar-width: 260px;
      --sidebar-collapsed-width: 74px;
      --brand-primary: #d97706;
      --bg-soft: #f8fafc;
      --card-border: #e2e8f0;
    }
    [data-bs-theme="dark"] {
      --bg-soft: #0f172a;
      --card-border: #1e293b;
    }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background-color: var(--bg-soft);
      overflow-x: hidden;
      margin: 0;
    }
    #authGateScreen {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: linear-gradient(135deg, #78350f 0%, #0f172a 55%, #b45309 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .auth-card {
      width: 100%;
      max-width: 480px;
      background: #ffffff;
      color: #0f172a;
      border-radius: 18px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.45);
      padding: 26px 28px 22px;
    }
    .quick-role-btn {
      font-size: 11.5px;
      padding: 6px 8px;
      border-radius: 8px;
      text-align: left;
      transition: all 0.15s;
    }
    .quick-role-btn:hover {
      transform: translateY(-1px);
    }
    .app-wrapper {
      display: flex;
      min-height: 100vh;
      width: 100%;
    }
    .app-sidebar {
      width: var(--sidebar-width);
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      transition: width 0.25s ease;
      flex-shrink: 0;
      z-index: 1030;
    }
    .app-sidebar.collapsed {
      width: var(--sidebar-collapsed-width);
    }
    .app-sidebar.collapsed .hide-on-collapse {
      display: none !important;
    }
    .sidebar-brand {
      padding: 15px 18px;
      border-bottom: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-menu {
      padding: 12px 10px;
      flex: 1;
    }
    .nav-menu-btn {
      width: 100%;
      border: none;
      background: transparent;
      color: #94a3b8;
      padding: 10px 14px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 13.5px;
      margin-bottom: 5px;
      text-align: left;
      transition: all 0.2s;
    }
    .nav-menu-btn:hover {
      background: rgba(255,255,255,0.06);
      color: #ffffff;
    }
    .nav-menu-btn.active {
      background: linear-gradient(135deg, #d97706, #b45309);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
    }
    .app-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .app-topbar {
      background: var(--bs-body-bg);
      border-bottom: 1px solid var(--card-border);
      padding: 12px 22px;
      position: sticky;
      top: 0;
      z-index: 1020;
    }
    .kpi-card {
      border-radius: 14px;
      border: 1px solid var(--card-border);
      background: var(--bs-body-bg);
      padding: 16px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
      height: 100%;
    }
    .kpi-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .panel-card {
      border-radius: 14px;
      border: 1px solid var(--card-border);
      background: var(--bs-body-bg);
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    }
    .table-item-card {
      border-radius: 14px;
      border: 2px solid var(--card-border);
      background: var(--bs-body-bg);
      padding: 14px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .table-item-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }
    .table-status-available { border-color: #10b981 !important; }
    .table-status-occupied { border-color: #ef4444 !important; background: rgba(239, 68, 68, 0.03); }
    .table-status-checkout { border-color: #f59e0b !important; background: rgba(245, 158, 11, 0.04); }
    .menu-item-card {
      border-radius: 12px;
      border: 1px solid var(--card-border);
      background: var(--bs-body-bg);
      padding: 12px;
      cursor: pointer;
      transition: all 0.15s;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .menu-item-card:hover {
      border-color: #d97706;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.18);
    }
    .order-cart-panel {
      border-radius: 14px;
      border: 1px solid var(--card-border);
      background: var(--bs-body-bg);
      padding: 16px;
    }
    .kds-ticket-card {
      border-radius: 14px;
      border: 2px solid #ef4444;
      background: var(--bs-body-bg);
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .kds-ticket-ready {
      border-color: #10b981 !important;
      background: rgba(16, 185, 129, 0.04);
    }
    .slicer-chip {
      border-radius: 20px;
      font-size: 12.5px;
      font-weight: 600;
      padding: 5px 14px;
      transition: all 0.15s;
    }
    .table thead th {
      white-space: nowrap;
      vertical-align: middle;
    }
    .kds-status-waiting {
      border-color: #f59e0b !important;
      background: rgba(245, 158, 11, 0.04);
    }
    .kds-status-cooking {
      border-color: #ef4444 !important;
      background: rgba(239, 68, 68, 0.04);
    }
    .kds-status-ready {
      border-color: #0284c7 !important;
      background: rgba(2, 132, 199, 0.05);
    }
    .kds-status-served {
      border-color: #10b981 !important;
      background: rgba(16, 185, 129, 0.05);
    }
    /* Chế độ Toàn Màn Hình (Full Screen & KDS TV Mode) */
    body.pos-fullscreen-active .app-topbar {
      padding: 8px 16px;
    }
    body.kds-tv-fullscreen .app-sidebar,
    body.kds-tv-fullscreen .app-topbar {
      display: none !important;
    }
    body.kds-tv-fullscreen .app-main {
      width: 100vw !important;
      min-height: 100vh !important;
    }
    .btn-fullscreen-pulse {
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.35);
    }
    #dedicatedPrintSheet { display: none; }
    @media print {
      body > *:not(#dedicatedPrintSheet) { display: none !important; }
      #dedicatedPrintSheet {
        display: block !important;
        position: static !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 6mm !important;
        background: #ffffff !important;
        color: #000000 !important;
        font-family: 'Segoe UI', Tahoma, sans-serif !important;
        font-size: 13px !important;
      }
      #dedicatedPrintSheet table {
        width: 100% !important;
        border-collapse: collapse !important;
      }
      #dedicatedPrintSheet th,
      #dedicatedPrintSheet td {
        border-bottom: 1px dashed #000000 !important;
        padding: 4px 6px !important;
        color: #000000 !important;
      }
    }
  </style>
</head>
<body>

<div id="dedicatedPrintSheet"></div>

<!-- FULL-SCREEN MANDATORY LOGIN GATE -->
<div id="authGateScreen">
  <div class="auth-card position-relative">
    <button type="button" class="btn btn-sm btn-outline-dark fw-bold position-absolute top-0 end-0 m-3" onclick="toggleFullScreenMode()" title="Bật / Tắt chế độ Toàn Màn Hình">
      <i class="bi bi-arrows-fullscreen me-1" id="gateFsIcon"></i><span id="gateFsText">Toàn Màn Hình</span>
    </button>
    <div class="text-center mb-3">
      <div class="d-inline-flex align-items-center justify-content-center bg-warning text-dark rounded-4 shadow-sm mb-2" style="width:54px;height:54px;font-size:26px;">
        ☕
      </div>
      <h4 class="fw-bold mb-1" style="color:#0f172a;">ĐĂNG NHẬP F&B POS THU NGÂN</h4>
      <div class="small text-secondary" id="authGateCompanySub">Hệ Thống Quản Lý Nhà Hàng, Cafe, Bida Tính Giờ & VietQR v3.3 Pro</div>
      <div class="mt-2">
        <span class="badge bg-success-subtle text-success border border-success-subtle" id="authSyncStatus">
          <i class="bi bi-shield-check me-1"></i> Sẵn sàng xác thực (5 tài khoản • 10 bàn • 11 món)
        </span>
      </div>
    </div>

    <div id="loginFormBox">
      <div class="mb-3">
        <label class="form-label small fw-bold text-uppercase text-secondary mb-1">Tên Đăng Nhập (Username)</label>
        <div class="input-group">
          <span class="input-group-text bg-light"><i class="bi bi-person-fill text-warning"></i></span>
          <input type="text" class="form-control fw-bold" id="gateUsername" value="admin" placeholder="Nhập tên tài khoản (VD: admin)..." onkeydown="if(event.key==='Enter'){event.preventDefault();handleMandatoryLogin();}">
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label small fw-bold text-uppercase text-secondary mb-1">Mật Khẩu (Password)</label>
        <div class="input-group">
          <span class="input-group-text bg-light"><i class="bi bi-key-fill text-warning"></i></span>
          <input type="password" class="form-control" id="gatePassword" value="123456" placeholder="Nhập mật khẩu (Mặc định: 123456)..." onkeydown="if(event.key==='Enter'){event.preventDefault();handleMandatoryLogin();}">
          <button class="btn btn-outline-secondary" type="button" onclick="toggleGatePassVisibility()" title="Hiện / Ẩn mật khẩu">
            <i class="bi bi-eye" id="gatePassEye"></i>
          </button>
        </div>
      </div>

      <div id="gateErrorAlert" class="alert alert-danger py-2 small d-none mb-3"></div>

      <div class="d-grid mt-3">
        <button type="button" class="btn btn-warning fw-bold py-2 fs-6 shadow-sm text-dark" id="btnGateLogin" onclick="handleMandatoryLogin()">
          <i class="bi bi-shield-lock-fill me-1"></i> Đăng Nhập Vào Hệ Thống POS
        </button>
      </div>
    </div>

    <!-- QUICK LOGIN CHIPS -->
    <div class="border-top mt-3 pt-3">
      <div class="small fw-bold text-secondary mb-2 text-center">
        <i class="bi bi-lightning-charge-fill text-warning me-1"></i>Chọn nhanh tài khoản phân quyền mẫu (Pass: <code>123456</code>):
      </div>
      <div class="row g-2">
        <div class="col-6">
          <button type="button" class="btn btn-outline-dark w-100 quick-role-btn" onclick="quickLoginAs('admin', '123456')">
            <div class="fw-bold">👑 Quản Lý (ADMIN)</div>
            <div class="text-secondary" style="font-size:10.5px;">TK: <code>admin</code> • Toàn quyền</div>
          </button>
        </div>
        <div class="col-6">
          <button type="button" class="btn btn-outline-warning text-dark w-100 quick-role-btn" onclick="quickLoginAs('thungan_ca1', '123456')">
            <div class="fw-bold">💵 Thu Ngân (CASHIER)</div>
            <div class="text-secondary" style="font-size:10.5px;">TK: <code>thungan_ca1</code> • Tính tiền & In bill</div>
          </button>
        </div>
        <div class="col-6">
          <button type="button" class="btn btn-outline-primary w-100 quick-role-btn" onclick="quickLoginAs('order_tang1', '123456')">
            <div class="fw-bold">📱 Order Phục Vụ (STAFF)</div>
            <div class="text-secondary" style="font-size:10.5px;">TK: <code>order_tang1</code> • Gọi món bàn</div>
          </button>
        </div>
        <div class="col-6">
          <button type="button" class="btn btn-outline-info text-dark w-100 quick-role-btn" onclick="quickLoginAs('bep_truong', '123456')">
            <div class="fw-bold">👨‍🍳 Bếp Trưởng (KITCHEN)</div>
            <div class="text-secondary" style="font-size:10.5px;">TK: <code>bep_truong</code> • Màn hình KDS</div>
          </button>
        </div>
      </div>
      <div class="small text-secondary text-center mt-2" style="font-size:11px;">
        <i class="bi bi-shield-check text-success me-1"></i> Bảo mật RBAC theo bảng <code>PHAN_QUYEN</code> trên Google Sheets
      </div>
    </div>
  </div>
</div>

<div class="app-wrapper d-none" id="mainAppWrapper">
  <aside class="app-sidebar" id="appSidebar">
    <div class="sidebar-brand">
      <div class="d-flex align-items-center gap-2">
        <div class="bg-warning text-dark fw-bold rounded-3 d-flex align-items-center justify-content-center" style="width:34px;height:34px;font-size:17px;">
          ☕
        </div>
        <div class="hide-on-collapse">
          <div class="fw-bold text-white" style="font-size:13.5px;">F&B POS & BIDA PRO</div>
          <div class="text-warning" style="font-size:11px;font-weight:700;">GS-005 • v3.3 Pro</div>
        </div>
      </div>
      <button class="btn btn-sm btn-dark border-secondary text-light" type="button" onclick="toggleSidebar()" title="Thu gọn / Mở rộng thanh bên">
        <i class="bi bi-layout-sidebar-inset"></i>
      </button>
    </div>

    <div class="nav-menu">
      <div class="text-uppercase text-secondary fw-bold px-2 mb-2 hide-on-collapse" style="font-size:10px;letter-spacing:0.6px;">
        Nghiệp vụ bán hàng POS
      </div>
      <button class="nav-menu-btn active" type="button" id="nav-tables" onclick="switchView('tables')">
        <i class="bi bi-grid-3x3-gap-fill fs-5"></i>
        <span class="hide-on-collapse">Sơ Đồ Bàn & Phòng Bida</span>
      </button>
      <button class="nav-menu-btn" type="button" id="nav-kds" onclick="switchView('kds')">
        <i class="bi bi-fire fs-5 text-warning"></i>
        <span class="hide-on-collapse">Màn Hình Bếp (KDS)</span>
        <span class="badge bg-danger rounded-pill ms-auto hide-on-collapse" id="badgePendingKitchen">2</span>
      </button>
      <button class="nav-menu-btn" type="button" id="nav-menu" onclick="switchView('menu')">
        <i class="bi bi-cup-hot-fill fs-5"></i>
        <span class="hide-on-collapse">Thực Đơn & Khuyến Mãi</span>
      </button>
      <button class="nav-menu-btn" type="button" id="nav-invoices" onclick="switchView('invoices')">
        <i class="bi bi-receipt fs-5"></i>
        <span class="hide-on-collapse">Sổ Hóa Đơn & VIP Slicer</span>
      </button>

      <div class="text-uppercase text-secondary fw-bold px-2 mt-3 mb-2 hide-on-collapse" style="font-size:10px;letter-spacing:0.6px;">
        Báo cáo & Quản trị
      </div>
      <button class="nav-menu-btn" type="button" id="nav-dashboard" onclick="switchView('dashboard')">
        <i class="bi bi-bar-chart-line-fill fs-5"></i>
        <span class="hide-on-collapse">Doanh Thu & Dòng Tiền</span>
      </button>
      <button class="nav-menu-btn" type="button" id="nav-rbac" onclick="switchView('rbac')">
        <i class="bi bi-people-fill fs-5"></i>
        <span class="hide-on-collapse">Tài Khoản & Nhân Viên</span>
      </button>
      <button class="nav-menu-btn" type="button" id="nav-settings" onclick="switchView('settings')">
        <i class="bi bi-gear-fill fs-5"></i>
        <span class="hide-on-collapse">Cấu Hình Quán & VietQR</span>
      </button>
    </div>

    <div class="p-3 border-top border-secondary border-opacity-25 hide-on-collapse">
      <div class="small text-secondary mb-1">Đang đăng nhập:</div>
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="fw-bold text-white small" id="sidebarUsername">admin</span>
        <span class="badge bg-warning text-dark" id="sidebarRoleBadge">ADMIN</span>
      </div>
      <div class="small text-light fw-semibold mb-1" id="sidebarUserName">Nguyễn Minh Tuấn</div>
      <div class="small text-warning mb-2" style="font-size:11.5px;" id="sidebarZoneScope">
        <i class="bi bi-geo-alt-fill"></i> Khu vực: Toàn bộ quán
      </div>
      <div class="d-grid gap-1">
        <button class="btn btn-xs btn-outline-warning btn-sm py-1 text-light" type="button" id="btnSidebarCreateUser" onclick="openUserModal()">
          <i class="bi bi-person-plus-fill me-1"></i> Tạo Tài Khoản Mới
        </button>
        <button class="btn btn-xs btn-outline-danger btn-sm py-1" type="button" onclick="handleLogout()">
          <i class="bi bi-power me-1"></i> Đăng Xuất / Đổi TK
        </button>
      </div>
    </div>
  </aside>

  <div class="app-main">
    <header class="app-topbar">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <h5 class="fw-bold mb-0 d-flex align-items-center gap-2">
            <span id="topbarStoreTitle">NEXSIMPLE F&B RESTAURANT & COFFEE</span>
            <span class="badge bg-success-subtle text-success border border-success-subtle" style="font-size:11px;" id="connBadge">
              <i class="bi bi-cloud-check-fill me-1"></i> Đã sẵn sàng
            </span>
          </h5>
          <div class="text-secondary small">Gọi Món POS • Link Bếp KDS • Tính Giờ Bida/VIP • VietQR Động • Hạng Hội Viên Silver/Gold/Platinum</div>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2">
          <select class="form-select form-select-sm fw-semibold border-warning" style="width: 225px;" id="globalZoneFilter" onchange="onGlobalZoneSelectChange()">
            <option value="ALL">Tất cả các Khu vực bàn</option>
            <option value="Tầng 1 — Cafe & Sân Vườn">Tầng 1 — Cafe & Sân Vườn</option>
            <option value="Tầng 2 — Nhà Hàng & Phòng Lạnh">Tầng 2 — Nhà Hàng & Phòng Lạnh</option>
            <option value="Khu Bida & Phòng VIP Tính Giờ">Khu Bida & Phòng VIP Tính Giờ</option>
          </select>

          <button class="btn btn-warning text-dark fw-bold btn-sm btn-fullscreen-pulse" type="button" id="btnTopFullscreen" onclick="toggleFullScreenMode()" title="Nhấp để phóng Toàn Màn Hình (Full Screen) hoặc nhấn phím F11">
            <i class="bi bi-arrows-fullscreen me-1" id="topFsIcon"></i><span id="topFsText">Toàn Màn Hình</span>
          </button>
          <button class="btn btn-outline-primary btn-sm" type="button" onclick="loadData()" title="Làm mới dữ liệu từ Google Sheets">
            <i class="bi bi-arrow-clockwise"></i>
          </button>
          <button class="btn btn-outline-secondary btn-sm" type="button" onclick="toggleTheme()" title="Chế độ Sáng / Tối">
            <i class="bi bi-moon-stars-fill" id="themeIcon"></i>
          </button>

          <div class="vr mx-1"></div>
          <div class="d-flex align-items-center gap-1 bg-body-tertiary border rounded-pill px-2 py-1">
            <span class="badge bg-warning text-dark rounded-pill" id="topRoleBadge">ADMIN</span>
            <span class="small fw-bold px-1" id="topUserBadge">Nguyễn Minh Tuấn</span>
            <button class="btn btn-sm btn-link text-danger p-0 px-1" type="button" onclick="handleLogout()" title="Đăng xuất">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>

          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-dark fw-bold" type="button" onclick="openTableModal()">
              <i class="bi bi-plus-square me-1"></i> Thêm Bàn/Bida
            </button>
            <button class="btn btn-primary fw-bold" type="button" onclick="switchView('kds')">
              <i class="bi bi-fire me-1"></i> Bếp KDS
            </button>
            <button class="btn btn-warning text-dark fw-bold" type="button" onclick="openNewMenuModal()">
              <i class="bi bi-plus-circle me-1"></i> Thêm Món / Combo
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="p-3 p-md-4">
      <!-- VIEW 1: SƠ ĐỒ BÀN / PHÒNG & TÍNH GIỜ REAL-TIME -->
      <section id="view-tables" class="view-section">
        <!-- SLICER BAR CHO KHU VỰC & TRẠNG THÁI BÀN -->
        <div class="panel-card py-3 px-3 mb-3">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div class="d-flex flex-wrap align-items-center gap-1" id="zoneSlicerGroup">
              <span class="small fw-bold text-secondary me-1"><i class="bi bi-funnel-fill text-warning me-1"></i>Slicer Khu Vực:</span>
              <button type="button" class="btn btn-sm btn-warning text-dark slicer-chip" onclick="setTableZoneSlicer('ALL', this)">Tất cả (10)</button>
              <button type="button" class="btn btn-sm btn-outline-secondary slicer-chip" onclick="setTableZoneSlicer('Tầng 1 — Cafe & Sân Vườn', this)">☕ Tầng 1 — Cafe</button>
              <button type="button" class="btn btn-sm btn-outline-secondary slicer-chip" onclick="setTableZoneSlicer('Tầng 2 — Nhà Hàng & Phòng Lạnh', this)">🍲 Tầng 2 — Nhà Hàng</button>
              <button type="button" class="btn btn-sm btn-outline-secondary slicer-chip" onclick="setTableZoneSlicer('Khu Bida & Phòng VIP Tính Giờ', this)">🎱 Bida & VIP Tính Giờ</button>
            </div>

            <div class="d-flex flex-wrap align-items-center gap-2">
              <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-dark fw-semibold" id="statusBtnAll" onclick="setTableStatusSlicer('ALL')">Tất cả</button>
                <button type="button" class="btn btn-outline-danger fw-semibold" id="statusBtnOccupied" onclick="setTableStatusSlicer('Đang phục vụ')">Đang có khách (<span id="countOccupied">0</span>)</button>
                <button type="button" class="btn btn-outline-success fw-semibold" id="statusBtnAvailable" onclick="setTableStatusSlicer('Trống')">Bàn Trống (<span id="countAvailable">0</span>)</button>
                <button type="button" class="btn btn-outline-warning text-dark fw-semibold" id="statusBtnTimer" onclick="setTableStatusSlicer('TIMER')">Bàn Tính Giờ (<span id="countTimerTables">0</span>)</button>
              </div>
              <input type="text" class="form-control form-control-sm" style="width: 190px;" id="tableSearchInput" placeholder="Tìm tên bàn, mã bàn..." oninput="renderTablesView()">
            </div>
          </div>
        </div>

        <div class="row g-3" id="tablesGridContainer"></div>
      </section>

      <!-- VIEW 2: MÀN HÌNH BẾP (KDS - KITCHEN DISPLAY SYSTEM) -->
      <section id="view-kds" class="view-section d-none">
        <div class="panel-card mb-3">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2 pb-2 border-bottom">
            <div>
              <h5 class="fw-bold mb-1 text-danger d-flex align-items-center gap-2">
                <i class="bi bi-fire"></i> MÀN HÌNH BẾP & QUẦY PHA CHẾ (KDS ĐIỀU PHỐI TRẠNG THÁI REAL-TIME)
              </h5>
              <div class="text-secondary small">Bấm trực tiếp vào từng món hoặc nút trạng thái trên thẻ phiếu để chuyển: <strong>Chờ chế biến ➔ Đang chế biến ➔ Đã xong - Chờ bưng ➔ Đã giao bàn</strong> (Đồng bộ tự động lên Sơ đồ bàn & Google Sheets).</div>
            </div>
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <span class="badge bg-danger fs-6" id="kdsTicketCount">0 Phiếu Đang Chờ Bếp</span>
              <button type="button" class="btn btn-sm btn-dark fw-bold" id="btnKdsTvMode" onclick="toggleKdsTvFullscreen()" title="Phóng to Màn Hình Bếp KDS ra Toàn Màn Hình TV (Ẩn thanh bên & thanh trên)">
                <i class="bi bi-display me-1" id="kdsTvIcon"></i><span id="kdsTvText">Phóng To KDS Toàn Màn Hình</span>
              </button>
              <button type="button" class="btn btn-sm btn-outline-primary fw-semibold" onclick="loadData()">
                <i class="bi bi-arrow-clockwise me-1"></i> Đồng Bộ KDS
              </button>
            </div>
          </div>

          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div class="d-flex flex-wrap align-items-center gap-1">
              <span class="small fw-bold text-secondary me-1"><i class="bi bi-shop me-1"></i>Trạm Bếp/Bar:</span>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-danger fw-bold" id="kdsStationAll" onclick="setKdsStationFilter('ALL')">Tất cả Bếp & Bar</button>
                <button type="button" class="btn btn-outline-secondary fw-semibold" id="kdsStationBar" onclick="setKdsStationFilter('Quầy Pha Chế')">🍹 Quầy Pha Chế</button>
                <button type="button" class="btn btn-outline-secondary fw-semibold" id="kdsStationHot" onclick="setKdsStationFilter('Bếp Nấu Nóng')">🔥 Bếp Nấu Nóng</button>
                <button type="button" class="btn btn-outline-secondary fw-semibold" id="kdsStationCold" onclick="setKdsStationFilter('Bếp Lạnh / Bánh')">🍰 Bếp Lạnh / Bánh</button>
              </div>
            </div>

            <div class="d-flex flex-wrap align-items-center gap-1" id="kdsStatusFilterGroup">
              <span class="small fw-bold text-secondary me-1"><i class="bi bi-funnel-fill text-warning me-1"></i>Trạng thái phiếu:</span>
              <button type="button" class="btn btn-sm btn-dark slicer-chip" onclick="setKdsStatusFilter('ALL', this)">Tất cả phiếu (<span id="kdsCntAll">0</span>)</button>
              <button type="button" class="btn btn-sm btn-outline-warning text-dark slicer-chip" onclick="setKdsStatusFilter('Chờ chế biến', this)">⏳ Chờ chế biến (<span id="kdsCntWaiting">0</span>)</button>
              <button type="button" class="btn btn-sm btn-outline-danger slicer-chip" onclick="setKdsStatusFilter('Đang chế biến', this)">🔥 Đang chế biến (<span id="kdsCntCooking">0</span>)</button>
              <button type="button" class="btn btn-sm btn-outline-primary slicer-chip" onclick="setKdsStatusFilter('Đã xong - Chờ bưng', this)">🔔 Đã xong - Chờ bưng (<span id="kdsCntReady">0</span>)</button>
              <button type="button" class="btn btn-sm btn-outline-success slicer-chip" onclick="setKdsStatusFilter('Đã giao bàn', this)">✅ Đã giao bàn (<span id="kdsCntServed">0</span>)</button>
            </div>
          </div>
        </div>

        <div class="row g-3" id="kdsTicketsGrid"></div>
      </section>

      <!-- VIEW 3: THỰC ĐƠN & COMBO KHUYẾN MÃI -->
      <section id="view-menu" class="view-section d-none">
        <div class="panel-card">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h5 class="fw-bold mb-1"><i class="bi bi-cup-hot-fill text-warning me-2"></i>Thực Đơn, Combo & Chương Trình Khuyến Mãi (Mua 2 Tặng 1 / Mua Kèm)</h5>
              <div class="small text-secondary">Quản lý giá bán, khu chế biến KDS và quy tắc tự động tính khuyến mãi Mua 2 tặng 1, Mua kèm giảm 20%, Combo tiết kiệm</div>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <select class="form-select form-select-sm fw-semibold" style="width: 175px;" id="menuCatFilter" onchange="renderMenuTableView()">
                <option value="ALL">Tất cả danh mục</option>
                <option value="Cà Phê">Cà Phê</option>
                <option value="Trà & Nước Ép">Trà & Nước Ép</option>
                <option value="Món Chính & Lẩu">Món Chính & Lẩu</option>
                <option value="Ăn Nhẹ & Khai Vị">Ăn Nhẹ & Khai Vị</option>
                <option value="Bánh & Tráng Miệng">Bánh & Tráng Miệng</option>
                <option value="Combo Tiết Kiệm">Combo Tiết Kiệm</option>
              </select>
              <select class="form-select form-select-sm fw-semibold border-danger" style="width: 185px;" id="menuPromoFilter" onchange="renderMenuTableView()">
                <option value="ALL">Tất cả Khuyến mãi</option>
                <option value="Mua 2 Tặng 1">🎁 Mua 2 Tặng 1</option>
                <option value="Mua Kèm Giảm 20%">🍟 Mua Kèm Giảm 20%</option>
                <option value="Combo Giảm 15%">🏷️ Combo Giảm 15%</option>
                <option value="Giảm 10% Giờ Vàng">⭐ Giảm 10% Giờ Vàng</option>
              </select>
              <input type="text" class="form-control form-control-sm" style="width: 200px;" id="menuSearchInput" placeholder="Tìm tên món, mã món..." oninput="renderMenuTableView()">
              <button class="btn btn-sm btn-warning text-dark fw-bold" type="button" onclick="openNewMenuModal()">
                <i class="bi bi-plus-lg me-1"></i> + Thêm Món / Combo
              </button>
              <button class="btn btn-sm btn-outline-success fw-semibold" type="button" onclick="exportMenuCsv()">
                <i class="bi bi-download me-1"></i> Xuất CSV
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle mb-0">
              <thead class="table-light text-center small text-uppercase">
                <tr>
                  <th>Mã Món</th>
                  <th class="text-start">Tên Món / Combo</th>
                  <th>Danh Mục</th>
                  <th>ĐVT</th>
                  <th class="text-end">Đơn Giá Bán</th>
                  <th class="text-end">Giá Vốn</th>
                  <th>Khuyến Mãi Tự Động</th>
                  <th>Khu Chế Biến (KDS)</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody id="menuTableTbody"></tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- VIEW 4: SỔ HÓA ĐƠN, VIETQR & PHÂN HẠNG KHÁCH HÀNG VIP SLICER -->
      <section id="view-invoices" class="view-section d-none">
        <!-- VIP CUSTOMER SLICER & CRM PANEL -->
        <div class="panel-card mb-3">
          <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3 pb-2 border-bottom">
            <div>
              <h5 class="fw-bold mb-1"><i class="bi bi-gem text-primary me-2"></i>Quản Lý Hội Viên VIP & Cơ Chế Phân Hạng (Bạc / Silver • Vàng / Gold • Bạch Kim / Platinum)</h5>
              <div class="small text-secondary" id="vipTierRuleSummaryText">
                Cơ chế hiện tại: <strong>Tự động nâng hạng theo chi tiêu + Cho phép đổi hạng trực tiếp</strong> • Bạc (≥ 3,000,000 ₫, -5%) • Vàng (≥ 8,000,000 ₫, -10%) • Bạch Kim (≥ 15,000,000 ₫, -15%)
              </div>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <button type="button" class="btn btn-sm btn-primary fw-bold" onclick="openVipMemberModal()">
                <i class="bi bi-person-plus-fill me-1"></i> + Thêm Hội Viên Mới
              </button>
              <button type="button" class="btn btn-sm btn-warning text-dark fw-bold" onclick="openTierMechanismModal()">
                <i class="bi bi-sliders me-1"></i> ⚙️ Đổi Cơ Chế Phân Hạng & Định Mức
              </button>
              <button type="button" class="btn btn-sm btn-outline-success fw-semibold" onclick="recalculateAllMembersTiers()">
                <i class="bi bi-arrow-repeat me-1"></i> Tự Động Xếp Hạng Lại
              </button>
            </div>
          </div>

          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div class="d-flex flex-wrap gap-1" id="vipTierSlicerButtons">
              <button type="button" class="btn btn-sm btn-primary slicer-chip" onclick="setVipSlicer('ALL', this)">Tất cả Hạng (<span id="vipCntAll">0</span>)</button>
              <button type="button" class="btn btn-sm btn-outline-secondary slicer-chip" onclick="setVipSlicer('Bạc', this)">🥈 Hạng Bạc - Silver (<span id="vipCntSilver">0</span>)</button>
              <button type="button" class="btn btn-sm btn-outline-warning text-dark slicer-chip" onclick="setVipSlicer('Vàng', this)">🥇 Hạng Vàng - Gold (<span id="vipCntGold">0</span>)</button>
              <button type="button" class="btn btn-sm btn-outline-info text-dark slicer-chip" onclick="setVipSlicer('Bạch Kim', this)">💎 Bạch Kim - Platinum (<span id="vipCntPlat">0</span>)</button>
              <button type="button" class="btn btn-sm btn-outline-dark slicer-chip" onclick="setVipSlicer('Vãng lai', this)">Khách Vãng Lai (0%)</button>
            </div>
            <div class="input-group input-group-sm" style="width: 240px;">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control" id="vipMemberSearchInput" placeholder="Tìm tên hội viên, SĐT, mã..." oninput="renderInvoicesView()">
            </div>
          </div>

          <div class="row g-2" id="vipCustomersCardsRow"></div>
        </div>

        <!-- INVOICE LEDGER -->
        <div class="panel-card">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h5 class="fw-bold mb-1"><i class="bi bi-receipt text-danger me-2"></i>Nhật Ký Hóa Đơn Bán Hàng, Nhân Viên Order/Thu Ngân & VietQR</h5>
              <div class="small text-secondary">Lịch sử thanh toán chi tiết bao gồm tiền món, tiền giờ bida/VIP, khuyến mãi Mua 2 tặng 1 và chiết khấu hạng thẻ</div>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <input type="text" class="form-control form-control-sm" style="width: 230px;" id="invSearchInput" placeholder="Tìm số HĐ, bàn, khách hàng..." oninput="renderInvoicesView()">
              <button class="btn btn-sm btn-outline-success fw-semibold" type="button" onclick="exportInvoicesCsv()">
                <i class="bi bi-download me-1"></i> Xuất CSV Hóa Đơn
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle mb-0">
              <thead class="table-light text-center small text-uppercase">
                <tr>
                  <th>Số HĐ</th>
                  <th>Thời Gian</th>
                  <th>Bàn</th>
                  <th>NV Order / Thu Ngân</th>
                  <th>Khách Hàng & Hạng VIP</th>
                  <th class="text-end">Tiền Món</th>
                  <th>Thời Gian Giờ</th>
                  <th class="text-end">Tiền Giờ</th>
                  <th class="text-end text-danger">Giảm Giá/VIP</th>
                  <th class="text-end text-primary fs-6">Tổng Thanh Toán</th>
                  <th>Hình Thức</th>
                  <th>In Bill K80</th>
                </tr>
              </thead>
              <tbody id="invoicesTableTbody"></tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- VIEW 5: DOANH THU & DÒNG TIỀN -->
      <section id="view-dashboard" class="view-section d-none">
        <div class="row g-3 mb-4">
          <div class="col-md-6 col-xl-3">
            <div class="kpi-card border-top border-warning border-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="text-secondary small fw-bold text-uppercase">Tổng Doanh Thu Đã Thu</div>
                  <h4 class="fw-bold mt-1 mb-1 text-primary" id="kpiTotalRevenue">0 ₫</h4>
                  <div class="small text-secondary" id="kpiInvoiceCountSub">Trên 0 hóa đơn hoàn tất</div>
                </div>
                <div class="kpi-icon bg-warning-subtle text-dark"><i class="bi bi-cash-coin"></i></div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xl-3">
            <div class="kpi-card border-top border-success border-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="text-secondary small fw-bold text-uppercase">Doanh Thu Món Ăn / Đồ Uống</div>
                  <h4 class="fw-bold mt-1 mb-1 text-success" id="kpiDishesRevenue">0 ₫</h4>
                  <div class="small text-secondary">Từ thực đơn & combo</div>
                </div>
                <div class="kpi-icon bg-success-subtle text-success"><i class="bi bi-cup-straw"></i></div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xl-3">
            <div class="kpi-card border-top border-primary border-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="text-secondary small fw-bold text-uppercase">Doanh Thu Tiền Giờ (Bida/VIP)</div>
                  <h4 class="fw-bold mt-1 mb-1 text-primary" id="kpiHourRevenue">0 ₫</h4>
                  <div class="small text-secondary">Phòng VIP & Bàn Bida</div>
                </div>
                <div class="kpi-icon bg-primary-subtle text-primary"><i class="bi bi-stopwatch-fill"></i></div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xl-3">
            <div class="kpi-card border-top border-danger border-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="text-secondary small fw-bold text-uppercase">Tạm Tính Đang Phục Vụ</div>
                  <h4 class="fw-bold mt-1 mb-1 text-danger" id="kpiPendingAmount">0 ₫</h4>
                  <div class="small text-secondary" id="kpiOccupiedCountSub">Trên 0 bàn đang có khách</div>
                </div>
                <div class="kpi-icon bg-danger-subtle text-danger"><i class="bi bi-clock-history"></i></div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-lg-7">
            <div class="panel-card h-100 mb-0">
              <h6 class="fw-bold mb-3"><i class="bi bi-bar-chart-fill text-warning me-2"></i>Phân Bổ Doanh Thu Theo Nhóm Món & Dịch Vụ</h6>
              <div style="height: 290px;"><canvas id="revenueBarChart"></canvas></div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="panel-card h-100 mb-0">
              <h6 class="fw-bold mb-3"><i class="bi bi-pie-chart-fill text-success me-2"></i>Cơ Cấu Tiền Món vs Tiền Giờ Bida/VIP</h6>
              <div style="height: 290px;"><canvas id="revenuePieChart"></canvas></div>
            </div>
          </div>
        </div>
      </section>

      <!-- VIEW 6: TÀI KHOẢN & PHÂN QUYỀN (RBAC) -->
      <section id="view-rbac" class="view-section d-none">
        <div class="row g-3">
          <div class="col-lg-7">
            <div class="panel-card h-100 mb-0">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 class="fw-bold mb-0"><i class="bi bi-people-fill text-primary me-2"></i>Tài Khoản Phân Quyền Nhân Sự POS (Tab PHAN_QUYEN)</h6>
                  <div class="small text-secondary">Quản lý (ADMIN), Thu ngân (CASHIER), Nhân viên Order (STAFF), Đầu Bếp (KITCHEN)</div>
                </div>
                <button class="btn btn-sm btn-primary fw-bold" type="button" onclick="openUserModal()">
                  <i class="bi bi-person-plus-fill me-1"></i> + Tạo Tài Khoản Mới
                </button>
              </div>
              <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle mb-0">
                  <thead class="table-light text-center small text-uppercase">
                    <tr>
                      <th>Username</th>
                      <th>Mật Khẩu</th>
                      <th>Họ Tên</th>
                      <th>Vai Trò</th>
                      <th>Khu Vực Phụ Trách</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody id="rbacUsersTbody"></tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="panel-card h-100 mb-0">
              <h6 class="fw-bold mb-3"><i class="bi bi-clock-history text-danger me-2"></i>Nhật Ký Thao Tác Bán Hàng & Bếp (Tab NHAT_KY)</h6>
              <div class="table-responsive" style="max-height: 420px;">
                <table class="table table-sm table-bordered table-hover align-middle mb-0">
                  <thead class="table-light small">
                    <tr>
                      <th>Thời Gian</th>
                      <th>Nhân Sự</th>
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
      </section>

      <!-- VIEW 7: CẤU HÌNH QUÁN & VIETQR -->
      <section id="view-settings" class="view-section d-none">
        <div class="panel-card" style="max-width: 820px;">
          <h6 class="fw-bold mb-1"><i class="bi bi-gear-fill text-secondary me-2"></i>Cấu Hình Quán, Mã VietQR & Chiết Khấu Hội Viên VIP (Tab CAU_HINH)</h6>
          <p class="text-secondary small mb-3">Thông tin tài khoản ngân hàng bên dưới sẽ tự động tạo mã QR Napas 247 trên màn hình thu ngân và in lên hóa đơn K80.</p>
          <div>
            <div class="row g-3">
              <div class="col-md-8">
                <label class="form-label small fw-bold">Tên Quán Cafe / Nhà Hàng (In trên đầu bill)</label>
                <input type="text" class="form-control" id="cfgStoreName">
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold">Hotline Liên Hệ</label>
                <input type="text" class="form-control" id="cfgStorePhone">
              </div>
              <div class="col-12">
                <label class="form-label small fw-bold">Địa Chỉ Cơ Sở</label>
                <input type="text" class="form-control" id="cfgStoreAddress">
              </div>
              <div class="col-12">
                <label class="form-label small fw-bold">Thông Tin Wi-Fi In Dưới Chân Bill</label>
                <input type="text" class="form-control" id="cfgStoreWifi">
              </div>

              <div class="col-md-4">
                <label class="form-label small fw-bold text-primary">Ngân Hàng Nhận VietQR (Bank ID)</label>
                <input type="text" class="form-control fw-bold" id="cfgBankId" placeholder="VD: MB, VCB, TCB, ACB, ICB">
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-primary">Số Tài Khoản Ngân Hàng (*)</label>
                <input type="text" class="form-control fw-bold" id="cfgAccountNo" placeholder="VD: 0974755104">
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-primary">Tên Chủ Tài Khoản (*)</label>
                <input type="text" class="form-control fw-bold text-uppercase" id="cfgAccountName" placeholder="VD: NGUYEN MINH TUAN">
              </div>

              <div class="col-md-4">
                <label class="form-label small fw-bold text-secondary">Chiết Khấu VIP Bạc (Silver %)</label>
                <div class="input-group">
                  <input type="number" class="form-control" id="cfgDiscountSilver" value="5">
                  <span class="input-group-text">%</span>
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-warning-emphasis">Chiết Khấu VIP Vàng (Gold %)</label>
                <div class="input-group">
                  <input type="number" class="form-control" id="cfgDiscountGold" value="10">
                  <span class="input-group-text">%</span>
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold text-info">Chiết Khấu VIP Bạch Kim (Platinum %)</label>
                <div class="input-group">
                  <input type="number" class="form-control" id="cfgDiscountPlatinum" value="15">
                  <span class="input-group-text">%</span>
                </div>
              </div>
            </div>

            <div class="mt-4 d-flex gap-2">
              <button type="button" class="btn btn-warning text-dark fw-bold px-4" onclick="handleSaveStoreSettings()">
                <i class="bi bi-check2-circle me-1"></i> Lưu Cấu Hình & Cập Nhật VietQR
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</div>

<!-- MODAL 1: GỌI MÓN & TÍNH TIỀN BÀN (POS ORDER & CHECKOUT DIALOG) -->
<div class="modal" id="orderModal" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" id="orderModalDialog">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white py-2">
        <div class="d-flex flex-wrap align-items-center gap-2">
          <h5 class="modal-title fw-bold mb-0" id="orderModalTableTitle">Bàn 01</h5>
          <span class="badge bg-warning text-dark" id="orderModalZoneBadge">Tầng 1</span>
          <span class="badge bg-info text-dark" id="orderModalServiceTypeBadge">Bàn thường</span>
          <button type="button" class="btn btn-xs btn-outline-light btn-sm py-0 px-2 ms-2" onclick="openTableModal(currentOperatingTable ? currentOperatingTable.code : '')">
            <i class="bi bi-pencil-square me-1"></i>Sửa Bàn/Giá Giờ
          </button>
        </div>
        <div class="d-flex align-items-center gap-2 ms-auto">
          <button type="button" class="btn btn-xs btn-warning text-dark fw-bold btn-sm py-0 px-2" onclick="toggleOrderModalFullscreen()" title="Phóng to cửa sổ gọi món toàn màn hình">
            <i class="bi bi-arrows-fullscreen me-1" id="orderModalFsIcon"></i><span id="orderModalFsText">Toàn Màn Hình</span>
          </button>
          <button type="button" class="btn-close btn-close-white m-0" onclick="hideBsModal('orderModal')"></button>
        </div>
      </div>

      <div class="modal-body p-3">
        <div class="row g-3">
          <!-- LEFT: MENU SELECTOR -->
          <div class="col-lg-7">
            <div class="d-flex flex-wrap gap-1 mb-2" id="orderMenuCatPills"></div>
            <div class="input-group input-group-sm mb-2">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control" id="orderSearchMenu" placeholder="Tìm nhanh tên món, mã món, combo..." oninput="renderOrderModalMenuList()">
            </div>
            <div class="row g-2" style="max-height: 490px; overflow-y: auto;" id="orderModalMenuGrid"></div>
          </div>

          <!-- RIGHT: CART & CHECKOUT -->
          <div class="col-lg-5">
            <div class="order-cart-panel shadow-sm">
              <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                <div>
                  <span class="fw-bold fs-6"><i class="bi bi-cart3 me-1"></i> Giỏ Hàng Bàn Đang Chọn</span>
                  <span class="badge bg-danger ms-1" id="cartItemCountBadge">0 món</span>
                </div>
                <div class="d-flex align-items-center gap-1">
                  <label class="small text-secondary mb-0">Số khách:</label>
                  <input type="number" class="form-control form-control-sm text-center fw-bold" style="width:55px;" id="cartGuestCountInput" value="2" min="1" max="50">
                </div>
              </div>

              <!-- TIMER SECTION FOR BILLIARDS / VIP ROOM -->
              <div id="cartTimerSection" class="p-2 mb-2 bg-warning-subtle border border-warning rounded-3 d-none">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="small fw-bold text-dark"><i class="bi bi-stopwatch-fill me-1"></i>Tính Giờ Bida / Phòng VIP:</span>
                  <span class="badge bg-danger" id="cartHourlyRateBadge">60,000 ₫/giờ</span>
                </div>
                <div class="row g-1 align-items-center">
                  <div class="col-7">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text">Số phút chơi</span>
                      <input type="number" class="form-control fw-bold text-center" id="cartMinutesPlayedInput" value="90" min="0" step="15" oninput="calculateCartTotals()">
                    </div>
                  </div>
                  <div class="col-5 text-end">
                    <div class="fw-bold text-danger" id="cartHourAmountText">+90,000 ₫</div>
                  </div>
                </div>
                <div class="d-flex gap-1 mt-1">
                  <button type="button" class="btn btn-xs btn-outline-dark btn-sm py-0 px-2" onclick="setCartMinutesPlayed(30)">30p</button>
                  <button type="button" class="btn btn-xs btn-outline-dark btn-sm py-0 px-2" onclick="setCartMinutesPlayed(60)">1 giờ</button>
                  <button type="button" class="btn btn-xs btn-outline-dark btn-sm py-0 px-2" onclick="setCartMinutesPlayed(90)">1.5 giờ</button>
                  <button type="button" class="btn btn-xs btn-outline-dark btn-sm py-0 px-2" onclick="setCartMinutesPlayed(120)">2 giờ</button>
                  <button type="button" class="btn btn-xs btn-outline-dark btn-sm py-0 px-2" onclick="setCartMinutesPlayed(180)">3 giờ</button>
                </div>
              </div>

              <!-- DISHES LIST IN CART -->
              <div style="max-height: 210px; overflow-y: auto;" id="cartItemsListContainer" class="mb-2"></div>

              <!-- CUSTOMER & VIP TIER SELECTOR -->
              <div class="border-top pt-2 mb-2">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <label class="form-label small fw-bold mb-0"><i class="bi bi-gem text-primary me-1"></i>Khách Hàng & Hạng Thẻ VIP:</label>
                  <div class="d-flex align-items-center gap-1">
                    <button type="button" class="btn btn-xs btn-outline-primary btn-sm py-0 px-2" onclick="openVipMemberModal()">+ Thêm Hội Viên</button>
                    <span class="badge bg-primary-subtle text-primary" id="cartVipDiscountLabel">Giảm VIP 0%</span>
                  </div>
                </div>
                <div class="row g-1 mb-1">
                  <div class="col-12">
                    <select class="form-select form-select-sm" id="cartPresetCustomerSelect" onchange="onSelectPresetVipCustomer()">
                      <option value="">-- Chọn nhanh Hội viên VIP hoặc nhập tên bên dưới --</option>
                    </select>
                  </div>
                </div>
                <div class="row g-1">
                  <div class="col-6">
                    <input type="text" class="form-control form-control-sm fw-semibold" id="cartCustomerName" placeholder="Tên khách / SĐT..." value="Khách vãng lai">
                  </div>
                  <div class="col-6">
                    <select class="form-select form-select-sm fw-bold text-primary" id="cartVipTierSelect" onchange="calculateCartTotals()">
                      <option value="Vãng lai (0%)" data-percent="0">Vãng lai (0%)</option>
                      <option value="Bạc (Silver - 5%)" data-percent="5">🥈 Hạng Bạc - Silver (5%)</option>
                      <option value="Vàng (Gold - 10%)" data-percent="10">🥇 Hạng Vàng - Gold (10%)</option>
                      <option value="Bạch Kim (Platinum - 15%)" data-percent="15">💎 Bạch Kim - Platinum (15%)</option>
                    </select>
                  </div>
                </div>
                <div class="row g-1 mt-1 align-items-center">
                  <div class="col-7">
                    <span class="small text-secondary">Chiết khấu thêm / Voucher (%):</span>
                  </div>
                  <div class="col-5">
                    <div class="input-group input-group-sm">
                      <input type="number" class="form-control text-end fw-bold" id="cartExtraDiscountPercent" value="0" min="0" max="100" oninput="calculateCartTotals()">
                      <span class="input-group-text">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SUMMARY CALCULATIONS -->
              <div class="bg-body-tertiary p-2 rounded-3 border small mb-2">
                <div class="d-flex justify-content-between mb-1">
                  <span>Tiền món ăn / đồ uống:</span>
                  <span class="fw-bold" id="cartSummaryDishAmt">0 ₫</span>
                </div>
                <div class="d-flex justify-content-between mb-1" id="cartSummaryHourRow">
                  <span>Tiền giờ Bida / Phòng VIP:</span>
                  <span class="fw-bold text-warning-emphasis" id="cartSummaryHourAmt">0 ₫</span>
                </div>
                <div class="d-flex justify-content-between mb-1 text-danger">
                  <span>KM tự động (Mua 2 tặng 1 / Mua kèm / Combo):</span>
                  <span class="fw-bold" id="cartSummaryPromoAmt">-0 ₫</span>
                </div>
                <div class="d-flex justify-content-between mb-1 text-danger">
                  <span>Chiết khấu Hạng Thẻ VIP & Voucher:</span>
                  <span class="fw-bold" id="cartSummaryVipAmt">-0 ₫</span>
                </div>
                <div class="d-flex justify-content-between border-top pt-1 fs-5 fw-bold text-primary">
                  <span>Tổng thanh toán:</span>
                  <span id="cartSummaryTotalPayable">0 ₫</span>
                </div>
              </div>

              <!-- ACTION BUTTONS -->
              <div class="d-grid gap-2">
                <div class="row g-1">
                  <div class="col-6">
                    <button type="button" class="btn btn-danger w-100 fw-bold py-2 btn-sm" onclick="sendOrderToKitchen()">
                      <i class="bi bi-fire me-1"></i> Gửi Bếp (KDS)
                    </button>
                  </div>
                  <div class="col-6">
                    <button type="button" class="btn btn-primary w-100 fw-bold py-2 btn-sm" onclick="saveTableTemporaryOrder()">
                      <i class="bi bi-save me-1"></i> Lưu Tạm Tính
                    </button>
                  </div>
                </div>

                <button type="button" class="btn btn-success fw-bold py-2 fs-6 shadow-sm" onclick="openCheckoutVietQrModal()">
                  <i class="bi bi-qr-code-scan me-1"></i> Thanh Toán & In Bill (VietQR)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 2: THANH TOÁN VIETQR ĐỘNG & IN BILL K80 (CHECKOUT MODAL) -->
<div class="modal" id="checkoutModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-success text-white">
        <h6 class="modal-title fw-bold"><i class="bi bi-qr-code me-2"></i>Thanh Toán Hóa Đơn & Mã VietQR Động</h6>
        <button type="button" class="btn-close btn-close-white" onclick="hideBsModal('checkoutModal')"></button>
      </div>

      <div class="modal-body text-center p-3">
        <div class="text-secondary small">Quét mã QR qua app ngân hàng bất kỳ để chuyển khoản tự động đúng số tiền:</div>
        <div class="my-2 p-2 bg-white rounded border d-inline-block shadow-sm">
          <img id="checkoutQrImg" src="" alt="Mã VietQR Động" style="width: 230px; height: 230px; object-fit: contain;">
        </div>
        <div class="fs-4 fw-bold text-success mb-1" id="checkoutAmountDisplay">0 ₫</div>
        <div class="small text-secondary mb-2">Nội dung CK: <strong class="text-dark" id="checkoutOrderCodeText">HD-2026-XXXX</strong></div>

        <div class="row g-2 text-start mb-2">
          <div class="col-6">
            <label class="form-label small fw-bold mb-1">Nhân viên Order:</label>
            <input type="text" class="form-control form-control-sm fw-semibold" id="checkoutWaiterInput" value="Nguyễn Văn Minh">
          </div>
          <div class="col-6">
            <label class="form-label small fw-bold mb-1">Nhân viên Thu ngân:</label>
            <input type="text" class="form-control form-control-sm fw-semibold" id="checkoutCashierInput" value="Lê Thu Trang">
          </div>
        </div>

        <div class="mb-2 text-start">
          <label class="form-label small fw-bold mb-1">Phương thức thanh toán:</label>
          <select class="form-select form-select-sm fw-semibold" id="checkoutPaymentMethodSelect">
            <option value="VietQR Động">📱 Chuyển khoản VietQR Động (Napas 247)</option>
            <option value="Tiền mặt">💵 Tiền mặt tại quầy</option>
            <option value="Thẻ Doanh nghiệp / POS">💳 Quẹt thẻ POS</option>
          </select>
        </div>
      </div>

      <div class="modal-footer d-flex justify-content-between">
        <button type="button" class="btn btn-outline-secondary btn-sm" onclick="hideBsModal('checkoutModal'); showBsModal('orderModal');">
          <i class="bi bi-arrow-left me-1"></i> Quay Lại Bàn
        </button>
        <button type="button" class="btn btn-success fw-bold px-4" id="btnConfirmCheckout" onclick="confirmCheckoutAndPrintBill()">
          <i class="bi bi-printer-fill me-1"></i> Xác Nhận Đã Thu Tiền & In Bill K80
        </button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 3: XEM TRƯỚC VÀ IN HÓA ĐƠN K80 / A5 -->
<div class="modal" id="printBillModal" tabindex="-1">
  <div class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white">
        <h6 class="modal-title fw-bold" id="printModalHeaderTitle"><i class="bi bi-printer-fill me-2"></i>Xem Trước Hóa Đơn Thanh Toán (K80 / A5)</h6>
        <button type="button" class="btn-close btn-close-white" onclick="hideBsModal('printBillModal')"></button>
      </div>
      <div class="modal-body p-3 bg-white text-dark" id="printAreaContainer"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="hideBsModal('printBillModal')">Đóng</button>
        <button type="button" class="btn btn-success fw-bold px-4" onclick="executePrintBillNow()">
          <i class="bi bi-printer-fill me-1"></i> Bấm In Bill Ngay (Khổ K80 / A5)
        </button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 4: THÊM / SỬA MÓN ĂN & COMBO -->
<div class="modal" id="menuItemModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-warning text-dark">
        <h6 class="modal-title fw-bold" id="menuItemModalTitle"><i class="bi bi-plus-circle me-2"></i>Thêm Món Ăn / Combo Mới</h6>
        <button type="button" class="btn-close" onclick="hideBsModal('menuItemModal')"></button>
      </div>
      <div class="modal-body">
        <div class="row g-2">
          <div class="col-md-5">
            <label class="form-label small fw-bold">Mã Món (*)</label>
            <input type="text" class="form-control fw-bold text-uppercase" id="fmMenuCode" placeholder="VD: MN-CF-05">
          </div>
          <div class="col-md-7">
            <label class="form-label small fw-bold">Danh Mục (*)</label>
            <select class="form-select" id="fmMenuCategory">
              <option value="Cà Phê">Cà Phê</option>
              <option value="Trà & Nước Ép">Trà & Nước Ép</option>
              <option value="Món Chính & Lẩu">Món Chính & Lẩu</option>
              <option value="Ăn Nhẹ & Khai Vị">Ăn Nhẹ & Khai Vị</option>
              <option value="Bánh & Tráng Miệng">Bánh & Tráng Miệng</option>
              <option value="Combo Tiết Kiệm">Combo Tiết Kiệm</option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">Tên Món Ăn / Đồ Uống / Combo (*)</label>
            <input type="text" class="form-control fw-semibold" id="fmMenuName" placeholder="VD: Trà Đào Cam Sả Đặc Biệt">
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-bold">ĐVT</label>
            <input type="text" class="form-control" id="fmMenuUnit" value="Ly">
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-bold">Giá Bán (*)</label>
            <input type="number" class="form-control fw-bold text-primary" id="fmMenuPrice" value="45000" min="0" step="5000">
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-bold">Giá Vốn</label>
            <input type="number" class="form-control" id="fmMenuCost" value="15000" min="0" step="5000">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold">Chương Trình Khuyến Mãi</label>
            <select class="form-select" id="fmMenuPromo">
              <option value="Không">Không áp dụng</option>
              <option value="Mua 2 Tặng 1">🎁 Mua 2 Tặng 1</option>
              <option value="Mua Kèm Giảm 20%">🍟 Mua Kèm Giảm 20%</option>
              <option value="Combo Giảm 15%">🏷️ Combo Giảm 15%</option>
              <option value="Giảm 10% Giờ Vàng">⭐ Giảm 10% Giờ Vàng</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold">Khu Chế Biến (KDS)</label>
            <select class="form-select" id="fmMenuKitchen">
              <option value="Quầy Pha Chế">Quầy Pha Chế</option>
              <option value="Bếp Nấu Nóng">Bếp Nấu Nóng</option>
              <option value="Bếp Lạnh / Bánh">Bếp Lạnh / Bánh</option>
              <option value="Bếp & Pha Chế">Bếp & Pha Chế</option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">Ghi Chú Công Thức / Mô Tả</label>
            <input type="text" class="form-control" id="fmMenuNotes" placeholder="VD: Đào miếng tươi giòn, sả chanh thơm">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="hideBsModal('menuItemModal')">Hủy</button>
        <button type="button" class="btn btn-warning text-dark fw-bold px-4 btn-sm" id="btnSaveMenuSubmit" onclick="submitMenuItemForm()">
          <i class="bi bi-check-lg me-1"></i> Lưu Vào Thực Đơn
        </button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 5: THÊM / SỬA BÀN & PHÒNG BIDA TÍNH GIỜ -->
<div class="modal" id="tableModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-info text-dark">
        <h6 class="modal-title fw-bold" id="tableModalTitle"><i class="bi bi-grid-3x3-gap-fill me-2"></i>Thêm / Cập Nhật Bàn & Phòng Tính Giờ</h6>
        <button type="button" class="btn-close" onclick="hideBsModal('tableModal')"></button>
      </div>
      <div class="modal-body">
        <div class="row g-2">
          <div class="col-md-5">
            <label class="form-label small fw-bold">Mã Bàn (*)</label>
            <input type="text" class="form-control fw-bold text-uppercase" id="tmTableCode" placeholder="VD: BIDA-03">
          </div>
          <div class="col-md-7">
            <label class="form-label small fw-bold">Tên Bàn / Phòng (*)</label>
            <input type="text" class="form-control fw-semibold" id="tmTableName" placeholder="VD: Bàn Bida 03 (Libre)">
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">Khu Vực Phục Vụ</label>
            <select class="form-select" id="tmTableZone">
              <option value="Tầng 1 — Cafe & Sân Vườn">Tầng 1 — Cafe & Sân Vườn</option>
              <option value="Tầng 2 — Nhà Hàng & Phòng Lạnh">Tầng 2 — Nhà Hàng & Phòng Lạnh</option>
              <option value="Khu Bida & Phòng VIP Tính Giờ">Khu Bida & Phòng VIP Tính Giờ</option>
            </select>
          </div>
          <div class="col-md-7">
            <label class="form-label small fw-bold">Loại Hình Dịch Vụ</label>
            <select class="form-select" id="tmServiceType">
              <option value="Bàn Cafe thường">Bàn Cafe thường (Không tính giờ)</option>
              <option value="Bàn Ăn Nhà Hàng">Bàn Ăn Nhà Hàng (Không tính giờ)</option>
              <option value="Bàn Tính Giờ (Bida/VIP)">Bàn Tính Giờ (Bida / Phòng VIP)</option>
            </select>
          </div>
          <div class="col-md-5">
            <label class="form-label small fw-bold">Đơn Giá Giờ (₫/giờ)</label>
            <input type="number" class="form-control fw-bold text-danger" id="tmHourlyRate" value="0" min="0" step="10000">
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">Ghi Chú Bàn</label>
            <input type="text" class="form-control" id="tmTableNotes" placeholder="VD: Bàn tiêu chuẩn thi đấu">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="hideBsModal('tableModal')">Hủy</button>
        <button type="button" class="btn btn-info text-dark fw-bold px-4 btn-sm" onclick="submitTableForm()">
          <i class="bi bi-check2-circle me-1"></i> Lưu Sơ Đồ Bàn
        </button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 6: TẠO / SỬA TÀI KHOẢN NHÂN VIÊN -->
<div class="modal" id="userModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h6 class="modal-title fw-bold" id="userModalTitle"><i class="bi bi-person-plus-fill me-2"></i>Tạo / Sửa Tài Khoản Nhân Viên POS</h6>
        <button type="button" class="btn-close btn-close-white" onclick="hideBsModal('userModal')"></button>
      </div>
      <div class="modal-body">
        <div class="row g-2">
          <div class="col-md-6">
            <label class="form-label small fw-bold">Username (*)</label>
            <input type="text" class="form-control fw-bold" id="ufUsername" placeholder="VD: order_tang2">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold">Mật Khẩu (*)</label>
            <input type="text" class="form-control fw-bold text-primary" id="ufPassword" value="123456">
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">Họ Và Tên (*)</label>
            <input type="text" class="form-control" id="ufFullName" placeholder="VD: Hoàng Thu Thảo">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold">Vai Trò</label>
            <select class="form-select fw-semibold" id="ufRole">
              <option value="STAFF">Phục vụ Order (STAFF)</option>
              <option value="CASHIER">Thu ngân POS (CASHIER)</option>
              <option value="KITCHEN">Đầu bếp KDS (KITCHEN)</option>
              <option value="ADMIN">Quản lý (ADMIN)</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold">Khu Vực Phụ Trách</label>
            <select class="form-select fw-semibold" id="ufZone">
              <option value="Tầng 1 — Cafe & Sân Vườn">Tầng 1 — Cafe & Sân Vườn</option>
              <option value="Tầng 2 — Nhà Hàng & Phòng Lạnh">Tầng 2 — Nhà Hàng & Phòng Lạnh</option>
              <option value="Khu Bida & Phòng VIP Tính Giờ">Khu Bida & Phòng VIP Tính Giờ</option>
              <option value="Bếp & Pha Chế (KDS)">Bếp & Pha Chế (KDS)</option>
              <option value="ALL">ALL (Toàn bộ quán)</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="hideBsModal('userModal')">Hủy</button>
        <button type="button" class="btn btn-primary fw-bold px-4 btn-sm" onclick="submitUserAccountForm()">
          <i class="bi bi-check2-circle me-1"></i> Lưu Tài Khoản Vào Sheet
        </button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 7: THÊM / SỬA HỘI VIÊN VIP & ĐỔI HẠNG THÀNH VIÊN (MỞ KHÓA 100%) -->
<div class="modal" id="vipMemberModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h6 class="modal-title fw-bold" id="vipMemberModalTitle"><i class="bi bi-gem me-2"></i>Thêm / Cập Nhật Hội Viên VIP & Đổi Hạng</h6>
        <button type="button" class="btn-close btn-close-white" onclick="hideBsModal('vipMemberModal')"></button>
      </div>
      <div class="modal-body">
        <div class="row g-2">
          <div class="col-md-5">
            <label class="form-label small fw-bold">Mã Hội Viên (*)</label>
            <input type="text" class="form-control fw-bold text-uppercase" id="vmMemberId" placeholder="VD: VIP-07">
          </div>
          <div class="col-md-7">
            <label class="form-label small fw-bold">Số Điện Thoại (*)</label>
            <input type="text" class="form-control fw-bold" id="vmMemberPhone" placeholder="VD: 0909 888 777">
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">Họ Và Tên Hội Viên / Doanh Nghiệp (*)</label>
            <input type="text" class="form-control fw-semibold" id="vmMemberName" placeholder="VD: Nguyễn Minh Khang">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold text-primary">Cơ Chế Phân Hạng Cho Member Này</label>
            <select class="form-select fw-semibold border-primary" id="vmTierMode" onchange="onVmTierModeChange()">
              <option value="Tự động theo chi tiêu">🔄 Tự động nâng hạng theo chi tiêu</option>
              <option value="Cố định hạng (Chủ quán cấp)">📌 Cố định hạng (Chọn hạng thủ công)</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold text-primary">Hạng Thẻ Hiện Tại (Đổi Trực Tiếp)</label>
            <select class="form-select fw-bold text-primary" id="vmMemberTier">
              <option value="Thân Thiết (Member - 0%)">👤 Thân Thiết (Member - 0%)</option>
              <option value="Bạc (Silver - 5%)">🥈 Hạng Bạc (Silver - 5%)</option>
              <option value="Vàng (Gold - 10%)">🥇 Hạng Vàng (Gold - 10%)</option>
              <option value="Bạch Kim (Platinum - 15%)">💎 Hạng Bạch Kim (Platinum - 15%)</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold">Tổng Chi Tiêu Tích Lũy (VNĐ)</label>
            <input type="number" class="form-control fw-bold text-success" id="vmMemberSpent" value="0" min="0" step="100000" oninput="onVmSpentInput()">
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-bold">Số Lượt Đến</label>
            <input type="number" class="form-control text-center fw-bold" id="vmMemberVisits" value="1" min="1">
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-bold">Trạng Thái Thẻ</label>
            <select class="form-select fw-semibold" id="vmMemberStatus">
              <option value="Hoạt động">🟢 Hoạt động</option>
              <option value="Tạm khóa">🔴 Tạm khóa</option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold">Ghi Chú Sở Thích / Ưu Đãi Riêng</label>
            <input type="text" class="form-control" id="vmMemberNotes" placeholder="VD: Khách quen Bida bàn 01, thích cafe ít sữa...">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="hideBsModal('vipMemberModal')">Hủy</button>
        <button type="button" class="btn btn-primary fw-bold px-4 btn-sm" onclick="submitVipMemberForm()">
          <i class="bi bi-check2-circle me-1"></i> Lưu Hội Viên & Đồng Bộ Sheet
        </button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 8: ĐỔI CƠ CHẾ PHÂN HẠNG THÀNH VIÊN & ĐỊNH MỨC CHI TIÊU (TIER MECHANISM MODAL) -->
<div class="modal" id="tierMechanismModal" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-warning text-dark">
        <h6 class="modal-title fw-bold"><i class="bi bi-sliders me-2"></i>Cấu Hình Cơ Chế Phân Hạng Thành Viên (Silver • Gold • Platinum)</h6>
        <button type="button" class="btn-close" onclick="hideBsModal('tierMechanismModal')"></button>
      </div>
      <div class="modal-body">
        <div class="alert alert-info py-2 small mb-3">
          <i class="bi bi-info-circle-fill me-1"></i> Thiết lập định mức chi tiêu tích lũy để hệ thống tự động nâng hạng khi khách thanh toán hóa đơn, hoặc cho phép chọn đổi hạng thủ công cho từng thành viên.
        </div>

        <div class="mb-3">
          <label class="form-label small fw-bold text-primary">Chế Độ Vận Hành Phân Hạng Toàn Hệ Thống:</label>
          <select class="form-select fw-bold border-primary" id="tmVipModeSelect">
            <option value="AUTO_AND_MANUAL">🔄 Linh hoạt: Tự động nâng hạng theo chi tiêu + Cho phép chỉnh tay từng Member</option>
            <option value="STRICT_AUTO">⚡ Tự động 100%: Ép toàn bộ Member xếp hạng theo đúng ngưỡng chi tiêu bên dưới</option>
            <option value="MANUAL_ONLY">📌 Thủ công: Giữ nguyên hạng thẻ do Chủ quán / Thu ngân gán cho từng Member</option>
          </select>
        </div>

        <div class="row g-3">
          <!-- SILVER -->
          <div class="col-md-4">
            <div class="p-3 border rounded-3 bg-body-tertiary h-100">
              <div class="fw-bold text-secondary mb-2">🥈 HẠNG BẠC (SILVER)</div>
              <label class="form-label small fw-semibold mb-1">Chi tiêu tối thiểu (₫):</label>
              <input type="number" class="form-control form-control-sm fw-bold mb-2" id="tmSilverMin" value="3000000" step="500000">
              <label class="form-label small fw-semibold mb-1">Mức giảm giá hóa đơn (%):</label>
              <div class="input-group input-group-sm">
                <input type="number" class="form-control fw-bold" id="tmSilverPct" value="5" min="0" max="100">
                <span class="input-group-text">%</span>
              </div>
            </div>
          </div>

          <!-- GOLD -->
          <div class="col-md-4">
            <div class="p-3 border border-warning rounded-3 bg-warning-subtle h-100">
              <div class="fw-bold text-dark mb-2">🥇 HẠNG VÀNG (GOLD)</div>
              <label class="form-label small fw-semibold mb-1">Chi tiêu tối thiểu (₫):</label>
              <input type="number" class="form-control form-control-sm fw-bold mb-2" id="tmGoldMin" value="8000000" step="1000000">
              <label class="form-label small fw-semibold mb-1">Mức giảm giá hóa đơn (%):</label>
              <div class="input-group input-group-sm">
                <input type="number" class="form-control fw-bold" id="tmGoldPct" value="10" min="0" max="100">
                <span class="input-group-text">%</span>
              </div>
            </div>
          </div>

          <!-- PLATINUM -->
          <div class="col-md-4">
            <div class="p-3 border border-info rounded-3 bg-info-subtle h-100">
              <div class="fw-bold text-dark mb-2">💎 BẠCH KIM (PLATINUM)</div>
              <label class="form-label small fw-semibold mb-1">Chi tiêu tối thiểu (₫):</label>
              <input type="number" class="form-control form-control-sm fw-bold mb-2" id="tmPlatMin" value="15000000" step="1000000">
              <label class="form-label small fw-semibold mb-1">Mức giảm giá hóa đơn (%):</label>
              <div class="input-group input-group-sm">
                <input type="number" class="form-control fw-bold" id="tmPlatPct" value="15" min="0" max="100">
                <span class="input-group-text">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" onclick="hideBsModal('tierMechanismModal')">Đóng</button>
        <button type="button" class="btn btn-warning text-dark fw-bold px-4 btn-sm" onclick="submitTierMechanismForm()">
          <i class="bi bi-check2-all me-1"></i> Áp Dụng Cơ Chế & Cập Nhật Hạng Thẻ
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
      STORE_NAME: 'NEXSIMPLE F&B RESTAURANT & COFFEE',
      STORE_ADDRESS: 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM',
      STORE_PHONE: '0974 755 104',
      STORE_WIFI: 'NexSimple_Coffee / Pass: 88889999',
      BANK_ID: 'MB',
      BANK_ACCOUNT_NO: '0974755104',
      BANK_ACCOUNT_NAME: 'NGUYEN MINH TUAN',
      DISCOUNT_SILVER: '5',
      DISCOUNT_GOLD: '10',
      DISCOUNT_PLATINUM: '15',
      TIER_SILVER_MIN: '3000000',
      TIER_GOLD_MIN: '8000000',
      TIER_PLATINUM_MIN: '15000000',
      VIP_TIER_MODE: 'AUTO_AND_MANUAL'
    },
    users: [
      { username: 'admin', password: '123456', fullName: 'Nguyễn Minh Tuấn', role: 'ADMIN', assignedZone: 'ALL', permissionsDesc: 'Quản lý toàn quyền', status: 'Hoạt động' },
      { username: 'thungan_ca1', password: '123456', fullName: 'Lê Thu Trang', role: 'CASHIER', assignedZone: 'ALL', permissionsDesc: 'Thu ngân POS & In hóa đơn K80', status: 'Hoạt động' },
      { username: 'order_tang1', password: '123456', fullName: 'Nguyễn Văn Minh', role: 'STAFF', assignedZone: 'Tầng 1 — Cafe & Sân Vườn', permissionsDesc: 'Phục vụ gọi món Tầng 1', status: 'Hoạt động' },
      { username: 'order_bida', password: '123456', fullName: 'Hoàng Văn Bách', role: 'STAFF', assignedZone: 'Khu Bida & Phòng VIP Tính Giờ', permissionsDesc: 'Phục vụ khu Bida & VIP', status: 'Hoạt động' },
      { username: 'bep_truong', password: '123456', fullName: 'Trần Văn Đầu Bếp', role: 'KITCHEN', assignedZone: 'Bếp & Pha Chế (KDS)', permissionsDesc: 'Màn hình Bếp KDS', status: 'Hoạt động' }
    ],
    tables: [
      {
        code: 'BAN-01', name: 'Bàn 01 (Cửa Sổ)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Đang phục vụ',
        hourlyRate: 0, openTime: '2026-10-27 10:30', guestCount: 3, dishAmount: 119000, hourAmount: 0, totalAmount: 119000,
        notes: '2x Cà Phê Muối Đặc Biệt, 1x Bánh Tiramisu Cacao Ý',
        cartItems: [
          { code: 'MN-CF-01', name: 'Cà Phê Muối Đặc Biệt', unit: 'Ly', price: 35000, qty: 2, promo: 'Không', kitchenStation: 'Quầy Pha Chế', notes: 'Ít đá, nhiều kem muối' },
          { code: 'MN-AN-04', name: 'Bánh Tiramisu Cacao Ý', unit: 'Phần', price: 49000, qty: 1, promo: 'Mua Kèm Giảm 20%', kitchenStation: 'Bếp Lạnh / Bánh', notes: 'Dùng kèm cafe' }
        ]
      },
      {
        code: 'BAN-02', name: 'Bàn 02 (Sofa)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Trống',
        hourlyRate: 0, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'Đã dọn dẹp sạch sẽ', cartItems: []
      },
      {
        code: 'BAN-03', name: 'Bàn 03 (Gia Đình)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Đang phục vụ',
        hourlyRate: 0, openTime: '2026-10-27 11:15', guestCount: 4, dishAmount: 120000, hourAmount: 0, totalAmount: 120000,
        notes: '3x Trà Đào Cam Sả Tươi (Mua 2 Tặng 1), 1x Khoai Tây Chiên Lắc Phô Mai',
        cartItems: [
          { code: 'MN-TR-01', name: 'Trà Đào Cam Sả Tươi', unit: 'Ly', price: 42000, qty: 3, promo: 'Mua 2 Tặng 1', kitchenStation: 'Quầy Pha Chế', notes: 'Tặng 1 ly miễn phí' },
          { code: 'MN-AN-03', name: 'Khoai Tây Chiên Lắc Phô Mai', unit: 'Đĩa', price: 45000, qty: 1, promo: 'Mua Kèm Giảm 20%', kitchenStation: 'Bếp Nấu Nóng', notes: 'Chiên giòn kèm tương ớt' }
        ]
      },
      {
        code: 'BAN-04', name: 'Bàn 04 (Ban Công)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Trống',
        hourlyRate: 0, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'View thoáng mát', cartItems: []
      },
      {
        code: 'NH-01', name: 'Bàn Ăn 01 (Lẩu/Nướng)', zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh', serviceType: 'Bàn Ăn Nhà Hàng', status: 'Đang phục vụ',
        hourlyRate: 0, openTime: '2026-10-27 11:00', guestCount: 5, dishAmount: 621000, hourAmount: 0, totalAmount: 621000,
        notes: '1x Combo Lẩu Hải Sản Thượng Hạng, 2x Trà Ô Long Sữa Trân Châu',
        cartItems: [
          { code: 'CB-LAU-02', name: 'Combo Lẩu Hải Sản Thượng Hạng (4-5 người)', unit: 'Nồi', price: 590000, qty: 1, promo: 'Giảm 10% Giờ Vàng', kitchenStation: 'Bếp Nấu Nóng', notes: 'Nước lẩu Thái chua cay' },
          { code: 'MN-TR-02', name: 'Trà Ô Long Sữa Trân Châu', unit: 'Ly', price: 45000, qty: 2, promo: 'Mua 2 Tặng 1', kitchenStation: 'Quầy Pha Chế', notes: '50% đường' }
        ]
      },
      {
        code: 'NH-02', name: 'Bàn Ăn 02 (VIP Tròn)', zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh', serviceType: 'Bàn Ăn Nhà Hàng', status: 'Trống',
        hourlyRate: 0, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'Sẵn sàng đón khách', cartItems: []
      },
      {
        code: 'NH-03', name: 'Bàn Ăn 03 (Gia Đình)', zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh', serviceType: 'Bàn Ăn Nhà Hàng', status: 'Đang phục vụ',
        hourlyRate: 0, openTime: '2026-10-27 11:45', guestCount: 2, dishAmount: 370000, hourAmount: 0, totalAmount: 370000,
        notes: '2x Bò Bít Tết Sốt Tiêu Đen',
        cartItems: [
          { code: 'MN-AN-01', name: 'Bò Bít Tết Sốt Tiêu Đen', unit: 'Đĩa', price: 185000, qty: 2, promo: 'Không', kitchenStation: 'Bếp Nấu Nóng', notes: 'Chín vừa (Medium)' }
        ]
      },
      {
        code: 'BIDA-01', name: 'Bàn Bida 01 (Carom)', zone: 'Khu Bida & Phòng VIP Tính Giờ', serviceType: 'Bàn Tính Giờ (Bida/VIP)', status: 'Đang phục vụ',
        hourlyRate: 60000, openTime: '2026-10-27 10:15', minutesPlayed: 90, guestCount: 2, dishAmount: 65000, hourAmount: 90000, totalAmount: 155000,
        notes: '1x Cà Phê Sữa Đá, 1x Khoai Tây Chiên + 90 phút Bida',
        cartItems: [
          { code: 'MN-CF-02', name: 'Cà Phê Sữa Đá Sài Gòn', unit: 'Ly', price: 29000, qty: 1, promo: 'Không', kitchenStation: 'Quầy Pha Chế', notes: 'Đậm cafe' },
          { code: 'MN-AN-03', name: 'Khoai Tây Chiên Lắc Phô Mai', unit: 'Đĩa', price: 45000, qty: 1, promo: 'Mua Kèm Giảm 20%', kitchenStation: 'Bếp Nấu Nóng', notes: '' }
        ]
      },
      {
        code: 'BIDA-02', name: 'Bàn Bida 02 (Pool)', zone: 'Khu Bida & Phòng VIP Tính Giờ', serviceType: 'Bàn Tính Giờ (Bida/VIP)', status: 'Trống',
        hourlyRate: 60000, openTime: '', minutesPlayed: 60, guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'Bàn 9 bóng chuẩn giải đấu', cartItems: []
      },
      {
        code: 'VIP-01', name: 'Phòng VIP Hoàng Gia', zone: 'Khu Bida & Phòng VIP Tính Giờ', serviceType: 'Bàn Tính Giờ (Bida/VIP)', status: 'Đang phục vụ',
        hourlyRate: 120000, openTime: '2026-10-27 09:30', minutesPlayed: 120, guestCount: 8, dishAmount: 1062000, hourAmount: 240000, totalAmount: 1302000,
        notes: '2x Combo Lẩu Hải Sản Thượng Hạng + 120 phút Phòng VIP',
        cartItems: [
          { code: 'CB-LAU-02', name: 'Combo Lẩu Hải Sản Thượng Hạng (4-5 người)', unit: 'Nồi', price: 590000, qty: 2, promo: 'Giảm 10% Giờ Vàng', kitchenStation: 'Bếp Nấu Nóng', notes: 'Phục vụ phòng VIP' }
        ]
      }
    ],
    menuItems: [
      { code: 'MN-CF-01', name: 'Cà Phê Muối Đặc Biệt', category: 'Cà Phê', unit: 'Ly', price: 35000, costPrice: 12000, promo: 'Không', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Kem muối béo ngậy, cafe rang mộc' },
      { code: 'MN-CF-02', name: 'Cà Phê Sữa Đá Sài Gòn', category: 'Cà Phê', unit: 'Ly', price: 29000, costPrice: 9000, promo: 'Không', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Robusta đậm đà, sữa đặc truyền thống' },
      { code: 'MN-TR-01', name: 'Trà Đào Cam Sả Tươi', category: 'Trà & Nước Ép', unit: 'Ly', price: 42000, costPrice: 14000, promo: 'Mua 2 Tặng 1', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Tự động tặng 1 ly miễn phí khi gọi đủ 3 ly' },
      { code: 'MN-TR-02', name: 'Trà Ô Long Sữa Trân Châu', category: 'Trà & Nước Ép', unit: 'Ly', price: 45000, costPrice: 15000, promo: 'Mua 2 Tặng 1', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Trân châu đen dẻo dai — Mua 2 Tặng 1' },
      { code: 'MN-AN-01', name: 'Bò Bít Tết Sốt Tiêu Đen', category: 'Món Chính & Lẩu', unit: 'Đĩa', price: 185000, costPrice: 85000, promo: 'Không', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Thăn bò Úc mềm mọng sốt tiêu cay nhẹ' },
      { code: 'MN-AN-02', name: 'Mì Ý Sốt Bò Bằm Bolognaise', category: 'Món Chính & Lẩu', unit: 'Đĩa', price: 95000, costPrice: 38000, promo: 'Không', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Sốt cà chua bò tươi chuẩn Ý' },
      { code: 'MN-AN-03', name: 'Khoai Tây Chiên Lắc Phô Mai', category: 'Ăn Nhẹ & Khai Vị', unit: 'Đĩa', price: 45000, costPrice: 16000, promo: 'Mua Kèm Giảm 20%', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Mua kèm đồ uống hoặc combo giảm ngay 20%' },
      { code: 'MN-AN-04', name: 'Bánh Tiramisu Cacao Ý', category: 'Bánh & Tráng Miệng', unit: 'Phần', price: 49000, costPrice: 18000, promo: 'Mua Kèm Giảm 20%', kitchenStation: 'Bếp Lạnh / Bánh', status: 'Còn hàng', notes: 'Mua kèm Cà phê/Trà giảm 20%' },
      { code: 'CB-LUNCH-01', name: 'Combo Trưa Nhanh (Mì Ý + Cà Phê + Bánh)', category: 'Combo Tiết Kiệm', unit: 'Combo', price: 159000, costPrice: 65000, promo: 'Combo Giảm 15%', kitchenStation: 'Bếp & Pha Chế', status: 'Còn hàng', notes: 'Tiết kiệm 15% so với gọi lẻ từng món' },
      { code: 'CB-LAU-02', name: 'Combo Lẩu Hải Sản Thượng Hạng (4-5 người)', category: 'Combo Tiết Kiệm', unit: 'Nồi', price: 590000, costPrice: 260000, promo: 'Giảm 10% Giờ Vàng', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Tôm càng, mực ống, cá hồi, rau nấm tươi' },
      { code: 'CB-BIDA-03', name: 'Combo Chiến Hữu Bida (4 Nước Tăng Lực + Khô Bò)', category: 'Combo Tiết Kiệm', unit: 'Combo', price: 140000, costPrice: 55000, promo: 'Combo Giảm 15%', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Combo ưu đãi dành riêng cho bàn Bida & VIP' }
    ],
    invoices: [
      { code: 'HD-2026-1001', date: '2026-10-26 10:30', tableName: 'Bàn 01 (Cửa Sổ)', waiter: 'Nguyễn Văn Minh', cashier: 'Lê Thu Trang', customer: 'Phạm Quốc Cường (0918889999)', vipTier: 'Vàng (Gold - 10%)', dishAmount: 145000, timeUsed: '0', hourAmount: 0, discount: 14500, totalAmount: 130500, paymentMethod: 'VietQR Động', status: 'Đã tất toán' },
      { code: 'HD-2026-1002', date: '2026-10-26 12:15', tableName: 'Bàn Ăn 01 (Lẩu/Nướng)', waiter: 'Nguyễn Văn Minh', cashier: 'Lê Thu Trang', customer: 'Công ty Cổ phần AlphaTech', vipTier: 'Bạch Kim (Platinum - 15%)', dishAmount: 680000, timeUsed: '0', hourAmount: 0, discount: 102000, totalAmount: 578000, paymentMethod: 'VietQR Động', status: 'Đã tất toán' },
      { code: 'HD-2026-1003', date: '2026-10-26 14:00', tableName: 'Bàn Bida 01 (Carom)', waiter: 'Hoàng Văn Bách', cashier: 'Lê Thu Trang', customer: 'Trần Đình Trọng (0974123456)', vipTier: 'Bạc (Silver - 5%)', dishAmount: 85000, timeUsed: '120 phút (2.0h)', hourAmount: 120000, discount: 10250, totalAmount: 194750, paymentMethod: 'Tiền mặt', status: 'Đã tất toán' },
      { code: 'HD-2026-1004', date: '2026-10-26 16:45', tableName: 'Bàn 03 (Gia Đình)', waiter: 'Nguyễn Văn Minh', cashier: 'Lê Thu Trang', customer: 'Khách Vãng Lai', vipTier: 'Vãng lai (0%)', dishAmount: 185000, timeUsed: '0', hourAmount: 0, discount: 42000, totalAmount: 143000, paymentMethod: 'VietQR Động', status: 'Đã tất toán' }
    ],
    auditLogs: [
      { timestamp: '2026-10-26 16:45:00', username: 'thungan_ca1', actorName: 'Lê Thu Trang (CASHIER)', action: 'THANH TOÁN HÓA ĐƠN', refCode: 'HD-2026-1004', detail: 'Thanh toán Bàn 03 (Gia Đình) thành công 143,000 ₫ qua VietQR Động. Áp dụng Mua 2 tặng 1.' },
      { timestamp: '2026-10-26 14:00:00', username: 'thungan_ca1', actorName: 'Lê Thu Trang (CASHIER)', action: 'THANH TOÁN HÓA ĐƠN', refCode: 'HD-2026-1003', detail: 'Thanh toán Bàn Bida 01 (Carom) 194,750 ₫. Tiền giờ 120,000 ₫ + Tiền đồ uống 85,000 ₫. Chiết khấu VIP Bạc 5%.' },
      { timestamp: '2026-10-26 10:30:15', username: 'thungan_ca1', actorName: 'Lê Thu Trang (CASHIER)', action: 'THANH TOÁN HÓA ĐƠN', refCode: 'HD-2026-1001', detail: 'Thanh toán Bàn 01 (Cửa Sổ) thành công 130,500 ₫ qua VietQR Động. Chiết khấu Gold 10%.' }
    ]
  };

  FALLBACK_DATA.vipMembers = [
    { id: 'VIP-01', name: 'Công ty Cổ phần AlphaTech', phone: '0909 111 222', tier: 'Bạch Kim (Platinum - 15%)', spent: 28500000, visits: 24, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Khách doanh nghiệp đặt tiệc VIP thường xuyên' },
    { id: 'VIP-02', name: 'Nguyễn Hoàng Hải', phone: '0918 666 888', tier: 'Bạch Kim (Platinum - 15%)', spent: 19200000, visits: 19, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Hội viên Platinum — Ưu tiên phòng VIP' },
    { id: 'VIP-03', name: 'Phạm Quốc Cường', phone: '0918 889 999', tier: 'Vàng (Gold - 10%)', spent: 11400000, visits: 15, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Khách quen khu Cafe & Bida' },
    { id: 'VIP-04', name: 'Lê Ngọc Bảo Trân', phone: '0988 777 555', tier: 'Vàng (Gold - 10%)', spent: 8900000, visits: 12, tierMode: 'Cố định hạng (Chủ quán cấp)', status: 'Hoạt động', notes: 'Đối tác thân thiết được cấp thẻ Vàng' },
    { id: 'VIP-05', name: 'Trần Đình Trọng', phone: '0974 123 456', tier: 'Bạc (Silver - 5%)', spent: 4200000, visits: 8, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Hội viên CLB Bida Carom' },
    { id: 'VIP-06', name: 'Võ Minh Khôi', phone: '0933 444 999', tier: 'Bạc (Silver - 5%)', spent: 3150000, visits: 6, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Hội viên mới đăng ký thẻ Bạc' }
  ];

  FALLBACK_DATA.kitchenTickets = [
    {
      ticketId: 'KDS-1001',
      tableCode: 'BAN-03',
      tableName: 'Bàn 03 (Gia Đình)',
      zone: 'Tầng 1 — Cafe & Sân Vườn',
      orderTime: '08:30',
      waiter: 'Nguyễn Văn Minh (order_tang1)',
      items: [
        { code: 'MN-TR-01', name: 'Trà Đào Cam Sả Tươi', qty: 3, kitchenStation: 'Quầy Pha Chế', notes: 'Mua 2 Tặng 1 — Ít đá', itemStatus: 'Đang chế biến' },
        { code: 'MN-AN-03', name: 'Khoai Tây Chiên Lắc Phô Mai', qty: 1, kitchenStation: 'Bếp Nấu Nóng', notes: 'Kèm tương ớt', itemStatus: 'Đang chế biến' }
      ],
      status: 'Đang chế biến'
    },
    {
      ticketId: 'KDS-1002',
      tableCode: 'NH-01',
      tableName: 'Bàn Ăn 01 (Lẩu/Nướng)',
      zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh',
      orderTime: '08:35',
      waiter: 'Nguyễn Văn Minh (order_tang1)',
      items: [
        { code: 'CB-LAU-02', name: 'Combo Lẩu Hải Sản Thượng Hạng (4-5 người)', qty: 1, kitchenStation: 'Bếp Nấu Nóng', notes: 'Nước lẩu Thái chua cay', itemStatus: 'Chờ chế biến' },
        { code: 'MN-TR-02', name: 'Trà Ô Long Sữa Trân Châu', qty: 2, kitchenStation: 'Quầy Pha Chế', notes: '50% đường', itemStatus: 'Chờ chế biến' }
      ],
      status: 'Chờ chế biến'
    },
    {
      ticketId: 'KDS-1003',
      tableCode: 'BIDA-01',
      tableName: 'Bàn Bida 01 (Carom)',
      zone: 'Khu Bida & Phòng VIP Tính Giờ',
      orderTime: '08:15',
      waiter: 'Hoàng Văn Bách (order_bida)',
      items: [
        { code: 'MN-CF-02', name: 'Cà Phê Sữa Đá Sài Gòn', qty: 1, kitchenStation: 'Quầy Pha Chế', notes: 'Đậm cafe', itemStatus: 'Đã xong' }
      ],
      status: 'Đã xong - Chờ bưng'
    }
  ];

  let appData = JSON.parse(JSON.stringify(FALLBACK_DATA));
  let kitchenTickets = appData.kitchenTickets;
  let currentUser = null;
  let isAuthenticated = false;
  let currentOperatingTable = null;
  let currentCartItems = [];
  let activeTableStatusSlicer = 'ALL';
  let activeKdsStationFilter = 'ALL';
  let activeKdsStatusFilter = 'ALL';
  let activeVipSlicer = 'ALL';
  let revenueBarChartInstance = null;
  let revenuePieChartInstance = null;
  let hasBooted = false;

  function cleanupModalBackdrops() {
    const openModals = document.querySelectorAll('.modal.show');
    if (openModals.length === 0) {
      document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  function hideBsModal(id) {
    try {
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const inst = bootstrap.Modal.getInstance(el);
        if (inst) inst.hide();
      }
      el.classList.remove('show');
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
      el.removeAttribute('aria-modal');
    } catch (e) {}
    cleanupModalBackdrops();
  }

  function showBsModal(id) {
    try {
      document.querySelectorAll('.modal.show').forEach(other => {
        if (other.id && other.id !== id) {
          hideBsModal(other.id);
        }
      });
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        bootstrap.Modal.getOrCreateInstance(el).show();
      } else {
        el.classList.add('show');
        el.style.display = 'block';
        el.removeAttribute('aria-hidden');
        el.setAttribute('aria-modal', 'true');
      }
    } catch (e) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('show');
        el.style.display = 'block';
      }
    }
  }

  function formatVND(val) {
    return new Intl.NumberFormat('vi-VN').format(Math.round(Number(val) || 0)) + ' ₫';
  }

  function getClientNowStr() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  }

  function buildClientInvoiceCode() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const rnd = Math.floor(10 + Math.random() * 90);
    return `HD-${yyyy}${mm}${dd}-${hh}${mi}-${rnd}`;
  }

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

  function quickLoginAs(uname, pass) {
    document.getElementById('gateUsername').value = uname;
    document.getElementById('gatePassword').value = pass;
    handleMandatoryLogin();
  }

  function handleMandatoryLogin() {
    const u = String(document.getElementById('gateUsername').value || '').trim().toLowerCase();
    const p = String(document.getElementById('gatePassword').value || '').trim();
    const errEl = document.getElementById('gateErrorAlert');

    const userList = (appData.users && appData.users.length > 0) ? appData.users : FALLBACK_DATA.users;

    const matched = userList.find(acc =>
      String(acc.username || '').toLowerCase() === u && String(acc.password || '123456') === p
    );

    if (!matched) {
      errEl.innerHTML = '<i class="bi bi-exclamation-octagon-fill me-1"></i> Sai tên đăng nhập hoặc mật khẩu! Vui lòng chọn 1 trong các tài khoản mẫu bên dưới (Mật khẩu: <code>123456</code>).';
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
    cleanupModalBackdrops();
    document.getElementById('mainAppWrapper').classList.add('d-none');
    document.getElementById('authGateScreen').classList.remove('d-none');
    document.getElementById('gateUsername').focus();
  }

  function applyCurrentUserSession(userObj) {
    currentUser = userObj || (appData.users && appData.users[0]) || FALLBACK_DATA.users[0];
    const isAdmin = currentUser.role === 'ADMIN';
    const isKitchen = currentUser.role === 'KITCHEN';

    document.getElementById('sidebarUsername').innerText = currentUser.username;
    document.getElementById('topUserBadge').innerText = currentUser.fullName;
    document.getElementById('topRoleBadge').innerText = currentUser.role;
    document.getElementById('sidebarRoleBadge').innerText = currentUser.role;
    document.getElementById('sidebarUserName').innerText = currentUser.fullName;
    document.getElementById('sidebarZoneScope').innerHTML = '<i class="bi bi-geo-alt-fill"></i> Khu vực: ' + (currentUser.assignedZone || 'Toàn bộ quán');

    const navRbac = document.getElementById('nav-rbac');
    const navSettings = document.getElementById('nav-settings');
    const navDashboard = document.getElementById('nav-dashboard');
    const btnSideCreate = document.getElementById('btnSidebarCreateUser');

    if (navRbac) navRbac.classList.toggle('d-none', !isAdmin);
    if (navSettings) navSettings.classList.toggle('d-none', !isAdmin);
    if (btnSideCreate) btnSideCreate.classList.toggle('d-none', !isAdmin);
    if (navDashboard) navDashboard.classList.toggle('d-none', !isAdmin && currentUser.role !== 'CASHIER');

    refreshAllPosViews();
    if (isKitchen) {
      switchView('kds');
    } else {
      switchView('tables');
    }
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

  let isPseudoFullscreen = false;

  function isBrowserInFullscreen() {
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      isPseudoFullscreen
    );
  }

  function syncFullscreenButtonsUi() {
    const active = isBrowserInFullscreen();
    document.body.classList.toggle('pos-fullscreen-active', active);

    const topBtn = document.getElementById('btnTopFullscreen');
    const topIcon = document.getElementById('topFsIcon');
    const topText = document.getElementById('topFsText');
    if (topBtn && topIcon && topText) {
      topBtn.className = active ? 'btn btn-danger fw-bold btn-sm' : 'btn btn-warning text-dark fw-bold btn-sm btn-fullscreen-pulse';
      topIcon.className = active ? 'bi bi-fullscreen-exit me-1' : 'bi bi-arrows-fullscreen me-1';
      topText.innerText = active ? 'Thoát Toàn Màn Hình' : 'Toàn Màn Hình';
    }

    const gateIcon = document.getElementById('gateFsIcon');
    const gateText = document.getElementById('gateFsText');
    if (gateIcon && gateText) {
      gateIcon.className = active ? 'bi bi-fullscreen-exit me-1' : 'bi bi-arrows-fullscreen me-1';
      gateText.innerText = active ? 'Thoát Toàn Màn Hình' : 'Toàn Màn Hình';
    }
  }

  function toggleFullScreenMode() {
    const docEl = document.documentElement;
    const currentlyFs = Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );

    if (!currentlyFs && !isPseudoFullscreen) {
      const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
      if (req) {
        try {
          const p = req.call(docEl);
          if (p && typeof p.then === 'function') {
            p.then(function() {
              isPseudoFullscreen = true;
              syncFullscreenButtonsUi();
            }).catch(function() {
              // Fallback nếu iframe Google Sheets chặn requestFullscreen: Bật Kiosk Full-Viewport + Thu gọn Sidebar
              isPseudoFullscreen = true;
              const sb = document.getElementById('appSidebar');
              if (sb && !sb.classList.contains('collapsed')) sb.classList.add('collapsed');
              syncFullscreenButtonsUi();
            });
            return;
          }
        } catch (e) {}
      }
      isPseudoFullscreen = true;
      const sb = document.getElementById('appSidebar');
      if (sb && !sb.classList.contains('collapsed')) sb.classList.add('collapsed');
      syncFullscreenButtonsUi();
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
      if (currentlyFs && exit) {
        try { exit.call(document); } catch (e) {}
      }
      isPseudoFullscreen = false;
      document.body.classList.remove('kds-tv-fullscreen');
      syncFullscreenButtonsUi();
      syncKdsTvButtonUi();
    }
  }

  function syncKdsTvButtonUi() {
    const isTv = document.body.classList.contains('kds-tv-fullscreen');
    const btn = document.getElementById('btnKdsTvMode');
    const icon = document.getElementById('kdsTvIcon');
    const txt = document.getElementById('kdsTvText');
    if (btn && icon && txt) {
      btn.className = isTv ? 'btn btn-sm btn-danger fw-bold' : 'btn btn-sm btn-dark fw-bold';
      icon.className = isTv ? 'bi bi-fullscreen-exit me-1' : 'bi bi-display me-1';
      txt.innerText = isTv ? 'Thoát KDS Toàn Màn Hình' : 'Phóng To KDS Toàn Màn Hình';
    }
  }

  function toggleKdsTvFullscreen() {
    const isTv = document.body.classList.toggle('kds-tv-fullscreen');
    syncKdsTvButtonUi();
    if (isTv && !isBrowserInFullscreen()) {
      toggleFullScreenMode();
    } else if (!isTv && isBrowserInFullscreen()) {
      toggleFullScreenMode();
    }
  }

  function toggleOrderModalFullscreen() {
    const dlg = document.getElementById('orderModalDialog');
    if (!dlg) return;
    const isFull = dlg.classList.toggle('modal-fullscreen');
    dlg.classList.toggle('modal-xl', !isFull);
    const icon = document.getElementById('orderModalFsIcon');
    const txt = document.getElementById('orderModalFsText');
    if (icon && txt) {
      icon.className = isFull ? 'bi bi-fullscreen-exit me-1' : 'bi bi-arrows-fullscreen me-1';
      txt.innerText = isFull ? 'Thu Nhỏ Cửa Sổ' : 'Toàn Màn Hình';
    }
  }

  document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
      isPseudoFullscreen = false;
      document.body.classList.remove('kds-tv-fullscreen');
      syncKdsTvButtonUi();
    }
    syncFullscreenButtonsUi();
  });
  document.addEventListener('webkitfullscreenchange', syncFullscreenButtonsUi);

  function switchView(viewId) {
    cleanupModalBackdrops();
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('d-none'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.remove('d-none');

    document.querySelectorAll('.nav-menu-btn').forEach(btn => btn.classList.remove('active'));
    const navBtn = document.getElementById('nav-' + viewId);
    if (navBtn) navBtn.classList.add('active');

    if (viewId === 'tables') renderTablesView();
    else if (viewId === 'kds') renderKdsView();
    else if (viewId === 'menu') renderMenuTableView();
    else if (viewId === 'invoices') renderInvoicesView();
    else if (viewId === 'dashboard') renderDashboardView();
    else if (viewId === 'rbac') renderRbacView();
    else if (viewId === 'settings') populateStoreSettings();
  }

  function refreshAllPosViews() {
    renderTablesView();
    renderKdsView();
    renderMenuTableView();
    renderInvoicesView();
    renderRbacView();
    populateStoreSettings();
  }

  function onGlobalZoneSelectChange() {
    document.querySelectorAll('#zoneSlicerGroup button').forEach(btn => {
      btn.className = 'btn btn-sm btn-outline-secondary slicer-chip';
    });
    renderTablesView();
  }

  function setTableZoneSlicer(zoneVal, btnEl) {
    document.getElementById('globalZoneFilter').value = zoneVal;
    document.querySelectorAll('#zoneSlicerGroup button').forEach(btn => {
      btn.className = 'btn btn-sm btn-outline-secondary slicer-chip';
    });
    if (btnEl) {
      btnEl.className = 'btn btn-sm btn-warning text-dark slicer-chip';
    }
    renderTablesView();
  }

  function setTableStatusSlicer(statusVal) {
    activeTableStatusSlicer = statusVal;
    document.getElementById('statusBtnAll').className = statusVal === 'ALL' ? 'btn btn-dark fw-semibold' : 'btn btn-outline-dark fw-semibold';
    document.getElementById('statusBtnOccupied').className = statusVal === 'Đang phục vụ' ? 'btn btn-danger fw-semibold' : 'btn btn-outline-danger fw-semibold';
    document.getElementById('statusBtnAvailable').className = statusVal === 'Trống' ? 'btn btn-success fw-semibold' : 'btn btn-outline-success fw-semibold';
    document.getElementById('statusBtnTimer').className = statusVal === 'TIMER' ? 'btn btn-warning text-dark fw-semibold' : 'btn btn-outline-warning text-dark fw-semibold';
    renderTablesView();
  }

  function renderTablesView() {
    const zoneFilter = document.getElementById('globalZoneFilter').value;
    const q = (document.getElementById('tableSearchInput').value || '').toLowerCase().trim();
    const container = document.getElementById('tablesGridContainer');

    if (!appData.tables || appData.tables.length === 0) {
      appData.tables = JSON.parse(JSON.stringify(FALLBACK_DATA.tables));
    }

    let availCount = 0, occCount = 0, timerCount = 0;
    appData.tables.forEach(t => {
      if (t.status === 'Trống') availCount++;
      else occCount++;
      if (String(t.serviceType || '').indexOf('Tính Giờ') !== -1) timerCount++;
    });
    document.getElementById('countAvailable').innerText = availCount;
    document.getElementById('countOccupied').innerText = occCount;
    document.getElementById('countTimerTables').innerText = timerCount;

    const filtered = appData.tables.filter(t => {
      const matchZone = zoneFilter === 'ALL' || t.zone === zoneFilter;
      const matchSearch = !q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || String(t.notes || '').toLowerCase().includes(q);
      let matchStatus = true;
      if (activeTableStatusSlicer === 'Đang phục vụ') matchStatus = (t.status !== 'Trống');
      else if (activeTableStatusSlicer === 'Trống') matchStatus = (t.status === 'Trống');
      else if (activeTableStatusSlicer === 'TIMER') matchStatus = (String(t.serviceType || '').indexOf('Tính Giờ') !== -1);
      return matchZone && matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div class="col-12 text-center py-5 text-secondary">Không tìm thấy bàn / phòng phù hợp bộ lọc</div>';
      return;
    }

    container.innerHTML = filtered.map(t => {
      const isOccupied = t.status === 'Đang phục vụ' || t.status === 'Chờ thanh toán';
      const isTimer = String(t.serviceType || '').indexOf('Tính Giờ') !== -1;
      let cardCls = 'table-status-available';
      let badgeCls = 'bg-success';
      if (t.status === 'Đang phục vụ') { cardCls = 'table-status-occupied'; badgeCls = 'bg-danger'; }
      else if (t.status === 'Chờ thanh toán') { cardCls = 'table-status-checkout'; badgeCls = 'bg-warning text-dark'; }

      let timerInfoHtml = '';
      if (isTimer) {
        timerInfoHtml = `
          <div class="mt-2 pt-2 border-top small d-flex justify-content-between align-items-center">
            <span class="badge bg-warning-subtle text-dark border border-warning-subtle"><i class="bi bi-stopwatch-fill me-1"></i>${t.hourlyRate ? formatVND(t.hourlyRate) + '/h' : 'Tính giờ'}</span>
            <span class="fw-bold ${isOccupied ? 'text-danger' : 'text-secondary'}">${isOccupied ? 'Đang tính giờ (' + (t.minutesPlayed || 90) + 'p)' : 'Sẵn sàng bật giờ'}</span>
          </div>
        `;
      }

      let kdsBadgeHtml = '';
      if (isOccupied) {
        const latestTicket = (kitchenTickets || []).find(kt => kt.tableCode === t.code);
        const kStat = (latestTicket ? latestTicket.status : (t.kdsStatus || 'Đang chế biến'));
        let kCls = 'bg-warning text-dark';
        let kIcon = '⏳';
        if (kStat === 'Đang chế biến' || kStat === 'Đang nấu') { kCls = 'bg-danger'; kIcon = '🔥'; }
        else if (kStat === 'Đã xong - Chờ bưng' || kStat === 'Đã xong') { kCls = 'bg-primary'; kIcon = '🔔'; }
        else if (kStat === 'Đã giao bàn') { kCls = 'bg-success'; kIcon = '✅'; }
        kdsBadgeHtml = `<div class="mt-1"><span class="badge ${kCls}" style="font-size:10.5px;">${kIcon} Bếp: ${kStat}</span></div>`;
      }

      return `
        <div class="col-sm-6 col-md-4 col-xl-3">
          <div class="table-item-card ${cardCls}" onclick="openTableOrderModal('${t.code}')">
            <div>
              <div class="d-flex justify-content-between align-items-start mb-2">
                <span class="badge ${badgeCls}">${t.status}</span>
                <span class="badge bg-light text-dark border">${t.code}</span>
              </div>
              <div class="fw-bold fs-5 text-dark mb-1 text-truncate">${t.name}</div>
              <div class="small text-secondary text-truncate mb-1"><i class="bi bi-geo-alt-fill text-warning me-1"></i>${t.zone}</div>
              <div class="small text-muted text-truncate mb-1" style="font-size:11.5px;">${t.notes || 'Bấm để mở bàn & gọi món'}</div>
              ${kdsBadgeHtml}
            </div>

            <div>
              <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                <div class="small text-secondary"><i class="bi bi-people-fill me-1"></i>${t.guestCount || 0} khách</div>
                <div class="fw-bold ${isOccupied ? 'text-danger fs-6' : 'text-success small'}">
                  ${isOccupied ? formatVND(t.totalAmount) : 'Bấm Gọi Món ➔'}
                </div>
              </div>
              ${timerInfoHtml}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function getVipMembersList() {
    if (!appData.vipMembers || !Array.isArray(appData.vipMembers) || appData.vipMembers.length === 0) {
      appData.vipMembers = JSON.parse(JSON.stringify(FALLBACK_DATA.vipMembers));
    }
    return appData.vipMembers;
  }

  function getTierDiscountPercent(tierStr) {
    const s = appData.settings || FALLBACK_DATA.settings;
    const t = String(tierStr || '');
    if (t.indexOf('Bạch Kim') !== -1 || t.indexOf('Platinum') !== -1) return Number(s.DISCOUNT_PLATINUM) || 15;
    if (t.indexOf('Vàng') !== -1 || t.indexOf('Gold') !== -1) return Number(s.DISCOUNT_GOLD) || 10;
    if (t.indexOf('Bạc') !== -1 || t.indexOf('Silver') !== -1) return Number(s.DISCOUNT_SILVER) || 5;
    return 0;
  }

  function computeClientTierBySpent(spentAmount) {
    const s = appData.settings || FALLBACK_DATA.settings;
    const platMin = Number(s.TIER_PLATINUM_MIN) || 15000000;
    const goldMin = Number(s.TIER_GOLD_MIN) || 8000000;
    const silvMin = Number(s.TIER_SILVER_MIN) || 3000000;
    const pPct = s.DISCOUNT_PLATINUM || '15';
    const gPct = s.DISCOUNT_GOLD || '10';
    const sPct = s.DISCOUNT_SILVER || '5';

    const val = Number(spentAmount) || 0;
    if (val >= platMin) return `Bạch Kim (Platinum - ${pPct}%)`;
    if (val >= goldMin) return `Vàng (Gold - ${gPct}%)`;
    if (val >= silvMin) return `Bạc (Silver - ${sPct}%)`;
    return 'Thân Thiết (Member - 0%)';
  }

  function refreshVipTierSelectOptions() {
    const s = appData.settings || FALLBACK_DATA.settings;
    const sPct = s.DISCOUNT_SILVER || '5';
    const gPct = s.DISCOUNT_GOLD || '10';
    const pPct = s.DISCOUNT_PLATINUM || '15';

    const cartSel = document.getElementById('cartVipTierSelect');
    if (cartSel) {
      const prev = cartSel.value;
      cartSel.innerHTML = `
        <option value="Vãng lai (0%)" data-percent="0">Vãng lai (0%)</option>
        <option value="Thân Thiết (Member - 0%)" data-percent="0">👤 Thân Thiết (Member - 0%)</option>
        <option value="Bạc (Silver - ${sPct}%)" data-percent="${sPct}">🥈 Hạng Bạc - Silver (${sPct}%)</option>
        <option value="Vàng (Gold - ${gPct}%)" data-percent="${gPct}">🥇 Hạng Vàng - Gold (${gPct}%)</option>
        <option value="Bạch Kim (Platinum - ${pPct}%)" data-percent="${pPct}">💎 Bạch Kim - Platinum (${pPct}%)</option>
      `;
      if ([...cartSel.options].some(o => o.value === prev)) cartSel.value = prev;
    }

    const vmSel = document.getElementById('vmMemberTier');
    if (vmSel) {
      const prevVm = vmSel.value;
      vmSel.innerHTML = `
        <option value="Thân Thiết (Member - 0%)">👤 Thân Thiết (Member - 0%)</option>
        <option value="Bạc (Silver - ${sPct}%)">🥈 Hạng Bạc (Silver - ${sPct}%)</option>
        <option value="Vàng (Gold - ${gPct}%)">🥇 Hạng Vàng (Gold - ${gPct}%)</option>
        <option value="Bạch Kim (Platinum - ${pPct}%)">💎 Hạng Bạch Kim (Platinum - ${pPct}%)</option>
      `;
      if ([...vmSel.options].some(o => o.value === prevVm)) vmSel.value = prevVm;
    }
  }

  function populatePresetVipDropdown() {
    refreshVipTierSelectOptions();
    const sel = document.getElementById('cartPresetCustomerSelect');
    if (!sel) return;
    const activeMembers = getVipMembersList().filter(c => c.status !== 'Tạm khóa');
    sel.innerHTML = '<option value="">-- Chọn nhanh Hội viên VIP (Silver / Gold / Platinum) --</option>' +
      activeMembers.map(c => `<option value="${c.id}">${c.name} (${c.phone || c.id}) — ${c.tier}</option>`).join('');
  }

  function onSelectPresetVipCustomer() {
    const id = document.getElementById('cartPresetCustomerSelect').value;
    if (!id) return;
    const cust = getVipMembersList().find(c => c.id === id);
    if (!cust) return;
    document.getElementById('cartCustomerName').value = `${cust.name}${cust.phone ? ' (' + cust.phone + ')' : ''}`;
    const cartSel = document.getElementById('cartVipTierSelect');
    if (cartSel) {
      const matchOpt = [...cartSel.options].find(o => o.value.split('(')[0].trim() === cust.tier.split('(')[0].trim());
      if (matchOpt) cartSel.value = matchOpt.value;
    }
    calculateCartTotals();
  }

  function openTableOrderModal(tableCode) {
    const table = (appData.tables || []).find(t => t.code === tableCode);
    if (!table) return;

    currentOperatingTable = table;
    document.getElementById('orderModalTableTitle').innerText = `${table.name} (${table.code})`;
    document.getElementById('orderModalZoneBadge').innerText = table.zone;
    document.getElementById('orderModalServiceTypeBadge').innerText = table.serviceType;
    document.getElementById('cartGuestCountInput').value = table.guestCount > 0 ? table.guestCount : 2;
    document.getElementById('cartExtraDiscountPercent').value = 0;

    populatePresetVipDropdown();

    const isTimer = String(table.serviceType || '').indexOf('Tính Giờ') !== -1;
    const timerSection = document.getElementById('cartTimerSection');
    const hourRow = document.getElementById('cartSummaryHourRow');
    if (isTimer) {
      timerSection.classList.remove('d-none');
      hourRow.classList.remove('d-none');
      const rate = Number(table.hourlyRate) || 60000;
      document.getElementById('cartHourlyRateBadge').innerText = formatVND(rate) + '/giờ';
      document.getElementById('cartMinutesPlayedInput').value = table.minutesPlayed !== undefined ? table.minutesPlayed : (table.status === 'Đang phục vụ' ? 90 : 60);
    } else {
      timerSection.classList.add('d-none');
      hourRow.classList.add('d-none');
    }

    if (table.cartItems && Array.isArray(table.cartItems) && table.cartItems.length > 0) {
      currentCartItems = JSON.parse(JSON.stringify(table.cartItems));
    } else {
      const fbTable = FALLBACK_DATA.tables.find(ft => ft.code === table.code);
      if (table.status !== 'Trống' && fbTable && fbTable.cartItems && fbTable.cartItems.length > 0) {
        currentCartItems = JSON.parse(JSON.stringify(fbTable.cartItems));
      } else {
        currentCartItems = [];
      }
    }

    selectedOrderCat = 'Tất cả';
    renderOrderModalCategories();
    renderOrderModalMenuList();
    renderCartItemsList();
    calculateCartTotals();
    showBsModal('orderModal');
  }

  function setCartMinutesPlayed(mins) {
    document.getElementById('cartMinutesPlayedInput').value = mins;
    calculateCartTotals();
  }

  let selectedOrderCat = 'Tất cả';
  function renderOrderModalCategories() {
    const cats = ['Tất cả', '🎁 Khuyến Mãi & Combo', 'Cà Phê', 'Trà & Nước Ép', 'Món Chính & Lẩu', 'Ăn Nhẹ & Khai Vị', 'Bánh & Tráng Miệng', 'Combo Tiết Kiệm'];
    const pContainer = document.getElementById('orderMenuCatPills');
    pContainer.innerHTML = cats.map(c => `
      <button type="button" class="btn btn-sm ${c === selectedOrderCat ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'} py-1 px-2" onclick="filterOrderModalMenuByCat('${c}', this)">
        ${c}
      </button>
    `).join('');
  }

  function filterOrderModalMenuByCat(catName, btnEl) {
    selectedOrderCat = catName;
    renderOrderModalCategories();
    renderOrderModalMenuList();
  }

  function renderOrderModalMenuList() {
    const q = (document.getElementById('orderSearchMenu').value || '').toLowerCase().trim();
    const container = document.getElementById('orderModalMenuGrid');

    if (!appData.menuItems || appData.menuItems.length === 0) {
      appData.menuItems = JSON.parse(JSON.stringify(FALLBACK_DATA.menuItems));
    }

    const filtered = appData.menuItems.filter(m => {
      let matchCat = true;
      if (selectedOrderCat === '🎁 Khuyến Mãi & Combo') {
        matchCat = (m.promo && m.promo !== 'Không') || m.category === 'Combo Tiết Kiệm';
      } else if (selectedOrderCat !== 'Tất cả') {
        matchCat = (m.category === selectedOrderCat);
      }
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || String(m.promo || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div class="col-12 text-center py-4 text-secondary">Không tìm thấy món ăn phù hợp</div>';
      return;
    }

    container.innerHTML = filtered.map(m => {
      let promoBadge = '';
      if (m.promo === 'Mua 2 Tặng 1') promoBadge = '<span class="badge bg-danger">🎁 Mua 2 Tặng 1</span>';
      else if (m.promo === 'Mua Kèm Giảm 20%') promoBadge = '<span class="badge bg-success">🍟 Mua Kèm -20%</span>';
      else if (m.promo === 'Combo Giảm 15%') promoBadge = '<span class="badge bg-warning text-dark">🏷️ Combo -15%</span>';
      else if (m.promo === 'Giảm 10% Giờ Vàng') promoBadge = '<span class="badge bg-info text-dark">⭐ Giờ Vàng -10%</span>';

      return `
        <div class="col-sm-6 col-md-4">
          <div class="menu-item-card" onclick="addDishToCart('${m.code}')">
            <div>
              <div class="d-flex justify-content-between align-items-start mb-1">
                <span class="badge bg-secondary-subtle text-dark" style="font-size:10px;">${m.category}</span>
                ${promoBadge}
              </div>
              <div class="fw-bold text-dark small">${m.name}</div>
              <div class="text-secondary mt-1" style="font-size:11px;">ĐVT: ${m.unit} • ${m.kitchenStation}</div>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2 pt-1 border-top">
              <span class="fw-bold text-primary">${formatVND(m.price)}</span>
              <span class="btn btn-xs btn-warning text-dark btn-sm p-0 px-2 fw-bold">+ Chọn</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function addDishToCart(dishCode) {
    const dish = (appData.menuItems || []).find(m => m.code === dishCode);
    if (!dish) return;

    const existing = currentCartItems.find(c => c.code === dishCode);
    if (existing) {
      existing.qty += 1;
    } else {
      currentCartItems.push({
        code: dish.code,
        name: dish.name,
        unit: dish.unit,
        price: Number(dish.price) || 0,
        qty: 1,
        promo: dish.promo || 'Không',
        kitchenStation: dish.kitchenStation || 'Quầy Pha Chế',
        notes: ''
      });
    }
    renderCartItemsList();
    calculateCartTotals();
  }

  function changeCartItemQty(idx, delta) {
    if (!currentCartItems[idx]) return;
    currentCartItems[idx].qty += delta;
    if (currentCartItems[idx].qty <= 0) {
      currentCartItems.splice(idx, 1);
    }
    renderCartItemsList();
    calculateCartTotals();
  }

  function updateCartItemNote(idx, val) {
    if (!currentCartItems[idx]) return;
    currentCartItems[idx].notes = val;
  }

  function renderCartItemsList() {
    const container = document.getElementById('cartItemsListContainer');
    const totalQty = currentCartItems.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('cartItemCountBadge').innerText = `${currentCartItems.length} loại (${totalQty} phần)`;

    if (currentCartItems.length === 0) {
      container.innerHTML = '<div class="text-center py-4 text-secondary small border rounded-3 bg-light">Chưa có món nào trong giỏ.<br>Bấm vào các món bên trái để gọi món cho bàn.</div>';
      return;
    }

    container.innerHTML = currentCartItems.map((c, idx) => {
      let promoHint = '';
      if (c.promo === 'Mua 2 Tặng 1') {
        if (c.qty === 2) {
          promoHint = `<div class="mt-1"><button type="button" class="btn btn-xs btn-danger btn-sm py-0 px-2" onclick="changeCartItemQty(${idx}, 1)">🎁 Đã mua 2: Bấm nhận thêm 1 ${c.unit} MIỄN PHÍ!</button></div>`;
        } else if (c.qty >= 3) {
          const freeUnits = Math.floor(c.qty / 3);
          promoHint = `<div class="text-danger fw-bold" style="font-size:11px;">🎁 Mua 2 Tặng 1: Đã miễn phí ${freeUnits} ${c.unit} (-${formatVND(freeUnits * c.price)})</div>`;
        } else {
          promoHint = `<div class="text-warning-emphasis" style="font-size:10.5px;">🎁 KM Mua 2 Tặng 1 (Gọi thêm 1 để tặng 1)</div>`;
        }
      } else if (c.promo && c.promo !== 'Không') {
        promoHint = `<div class="text-success fw-semibold" style="font-size:10.5px;">🏷️ Áp dụng: ${c.promo}</div>`;
      }

      return `
        <div class="p-2 mb-1 bg-body-tertiary rounded-3 border">
          <div class="d-flex justify-content-between align-items-start">
            <div style="max-width: 58%;">
              <div class="fw-bold small">${c.name}</div>
              <div class="text-secondary" style="font-size:11px;">${formatVND(c.price)} / ${c.unit} • ${c.kitchenStation}</div>
              ${promoHint}
            </div>
            <div class="d-flex align-items-center gap-1">
              <button type="button" class="btn btn-xs btn-outline-secondary p-0 px-2 fw-bold" onclick="changeCartItemQty(${idx}, -1)">-</button>
              <span class="fw-bold px-1 small">${c.qty}</span>
              <button type="button" class="btn btn-xs btn-outline-secondary p-0 px-2 fw-bold" onclick="changeCartItemQty(${idx}, 1)">+</button>
              <span class="fw-bold text-primary small ms-1" style="min-width:68px; text-align:right;">${formatVND(c.price * c.qty)}</span>
            </div>
          </div>
          <div class="mt-1">
            <input type="text" class="form-control form-control-sm py-0 px-2" style="font-size:11px; height:24px;" placeholder="Ghi chú bếp (VD: ít đá, 50% đường, không cay...)" value="${c.notes || ''}" oninput="updateCartItemNote(${idx}, this.value)">
          </div>
        </div>
      `;
    }).join('');
  }

  function calculateCartTotals() {
    let dishSubtotal = 0;
    let promoDiscount = 0;
    const hasMultipleItems = currentCartItems.length >= 2 || currentCartItems.some(x => x.qty >= 2);

    currentCartItems.forEach(c => {
      const lineAmt = (Number(c.price) || 0) * (Number(c.qty) || 0);
      dishSubtotal += lineAmt;

      if (c.promo === 'Mua 2 Tặng 1' && c.qty >= 3) {
        const freeCount = Math.floor(c.qty / 3);
        promoDiscount += freeCount * c.price;
      } else if (c.promo === 'Mua Kèm Giảm 20%' && hasMultipleItems) {
        promoDiscount += Math.round(lineAmt * 0.20);
      } else if (c.promo === 'Combo Giảm 15%') {
        promoDiscount += Math.round(lineAmt * 0.15);
      } else if (c.promo === 'Giảm 10% Giờ Vàng') {
        promoDiscount += Math.round(lineAmt * 0.10);
      }
    });

    let hourAmount = 0;
    let minutesPlayed = 0;
    if (currentOperatingTable && String(currentOperatingTable.serviceType || '').indexOf('Tính Giờ') !== -1) {
      const ratePerHour = Number(currentOperatingTable.hourlyRate) || 60000;
      minutesPlayed = Math.max(0, Number(document.getElementById('cartMinutesPlayedInput').value) || 0);
      hourAmount = Math.round((minutesPlayed / 60) * ratePerHour);
      document.getElementById('cartHourAmountText').innerText = `+${formatVND(hourAmount)} (${minutesPlayed}p)`;
      document.getElementById('cartSummaryHourAmt').innerText = formatVND(hourAmount);
    } else {
      document.getElementById('cartSummaryHourAmt').innerText = '0 ₫';
    }

    const vipSel = document.getElementById('cartVipTierSelect');
    const vipPercent = (vipSel && vipSel.selectedOptions && vipSel.selectedOptions[0])
      ? (Number(vipSel.selectedOptions[0].getAttribute('data-percent')) || 0)
      : 0;
    const extraPercent = Math.min(100, Math.max(0, Number(document.getElementById('cartExtraDiscountPercent').value) || 0));
    const totalPercent = Math.min(100, vipPercent + extraPercent);

    document.getElementById('cartVipDiscountLabel').innerText = `Giảm VIP ${vipPercent}%${extraPercent > 0 ? ' + KM ' + extraPercent + '%' : ''}`;

    const afterPromoSubtotal = Math.max(0, dishSubtotal - promoDiscount) + hourAmount;
    const vipDiscount = Math.round(afterPromoSubtotal * (totalPercent / 100));
    const totalPayable = Math.max(0, dishSubtotal + hourAmount - promoDiscount - vipDiscount);

    document.getElementById('cartSummaryDishAmt').innerText = formatVND(dishSubtotal);
    document.getElementById('cartSummaryPromoAmt').innerText = `-${formatVND(promoDiscount)}`;
    document.getElementById('cartSummaryVipAmt').innerText = `-${formatVND(vipDiscount)}`;
    document.getElementById('cartSummaryTotalPayable').innerText = formatVND(totalPayable);

    return {
      dishSubtotal,
      hourAmount,
      minutesPlayed,
      promoDiscount,
      vipDiscount,
      totalPayable
    };
  }

  function syncCurrentTableState(totals) {
    if (!currentOperatingTable) return;
    const guestCount = Math.max(1, parseInt(document.getElementById('cartGuestCountInput').value, 10) || 2);
    const hasService = currentCartItems.length > 0 || totals.hourAmount > 0;

    currentOperatingTable.status = hasService ? 'Đang phục vụ' : 'Trống';
    currentOperatingTable.guestCount = hasService ? guestCount : 0;
    currentOperatingTable.minutesPlayed = totals.minutesPlayed;
    currentOperatingTable.openTime = currentOperatingTable.openTime || getClientNowStr();
    currentOperatingTable.dishAmount = Math.max(0, totals.dishSubtotal - totals.promoDiscount);
    currentOperatingTable.hourAmount = totals.hourAmount;
    currentOperatingTable.totalAmount = totals.totalPayable;
    currentOperatingTable.cartItems = JSON.parse(JSON.stringify(currentCartItems));
    currentOperatingTable.notes = currentCartItems.map(c => `${c.qty}x ${c.name}`).join(', ') + (totals.hourAmount > 0 ? ` (+${totals.minutesPlayed}p giờ)` : '');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.updateTableOrder({
        tableCode: currentOperatingTable.code,
        tableName: currentOperatingTable.name,
        zone: currentOperatingTable.zone,
        serviceType: currentOperatingTable.serviceType,
        hourlyRate: currentOperatingTable.hourlyRate,
        status: currentOperatingTable.status,
        openTime: currentOperatingTable.openTime,
        guestCount: currentOperatingTable.guestCount,
        dishAmount: currentOperatingTable.dishAmount,
        hourAmount: currentOperatingTable.hourAmount,
        totalAmount: currentOperatingTable.totalAmount,
        notes: currentOperatingTable.notes,
        username: currentUser ? currentUser.username : 'order_staff',
        actorName: currentUser ? currentUser.fullName : 'Nhân viên Order'
      });
    }
  }

  function normalizeKdsStatus(st) {
    const s = String(st || '').trim();
    if (s === 'Đang nấu') return 'Đang chế biến';
    if (s === 'Đã xong') return 'Đã xong - Chờ bưng';
    if (['Chờ chế biến', 'Đang chế biến', 'Đã xong - Chờ bưng', 'Đã giao bàn'].indexOf(s) !== -1) return s;
    return 'Chờ chế biến';
  }

  function syncTicketToTableAndBackend(ticket) {
    if (!ticket) return;
    ticket.status = normalizeKdsStatus(ticket.status);
    const tbl = (appData.tables || []).find(t => t.code === ticket.tableCode);
    if (tbl && tbl.status !== 'Trống') {
      tbl.kdsStatus = ticket.status;
    }
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.createOrUpdateKdsTicket({
        ticketId: ticket.ticketId,
        tableCode: ticket.tableCode,
        tableName: ticket.tableName,
        zone: ticket.zone,
        orderTime: ticket.orderTime,
        waiter: ticket.waiter,
        status: ticket.status,
        items: ticket.items || [],
        username: currentUser ? currentUser.username : 'kitchen',
        actorName: currentUser ? currentUser.fullName : 'Bếp KDS'
      });
    }
  }

  function sendOrderToKitchen() {
    if (currentCartItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 món ăn hoặc đồ uống để gửi xuống Màn Hình Bếp (KDS)!');
      return;
    }
    const totals = calculateCartTotals();
    currentOperatingTable.kdsStatus = 'Chờ chế biến';
    syncCurrentTableState(totals);

    const itemsWithStatus = currentCartItems.map(it => ({
      ...JSON.parse(JSON.stringify(it)),
      itemStatus: it.itemStatus || 'Chờ chế biến'
    }));

    const newTicket = {
      ticketId: 'KDS-' + Math.floor(1000 + Math.random() * 9000),
      tableCode: currentOperatingTable.code,
      tableName: currentOperatingTable.name,
      zone: currentOperatingTable.zone,
      orderTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      waiter: currentUser ? `${currentUser.fullName} (${currentUser.username})` : 'Nguyễn Văn Minh (order_tang1)',
      items: itemsWithStatus,
      status: 'Chờ chế biến'
    };
    kitchenTickets.unshift(newTicket);
    appData.kitchenTickets = kitchenTickets;
    syncTicketToTableAndBackend(newTicket);

    hideBsModal('orderModal');
    renderTablesView();
    renderKdsView();
    alert(`🔥 Đã gửi phiếu chế biến [${newTicket.ticketId}] của [${currentOperatingTable.name}] xuống Màn Hình Bếp (KDS) ở trạng thái "Chờ chế biến"!`);
  }

  function saveTableTemporaryOrder() {
    const totals = calculateCartTotals();
    syncCurrentTableState(totals);
    hideBsModal('orderModal');
    renderTablesView();
  }

  function setKdsStationFilter(station) {
    activeKdsStationFilter = station;
    document.getElementById('kdsStationAll').className = station === 'ALL' ? 'btn btn-danger fw-bold' : 'btn btn-outline-secondary fw-semibold';
    document.getElementById('kdsStationBar').className = station === 'Quầy Pha Chế' ? 'btn btn-danger fw-bold' : 'btn btn-outline-secondary fw-semibold';
    document.getElementById('kdsStationHot').className = station === 'Bếp Nấu Nóng' ? 'btn btn-danger fw-bold' : 'btn btn-outline-secondary fw-semibold';
    document.getElementById('kdsStationCold').className = station === 'Bếp Lạnh / Bánh' ? 'btn btn-danger fw-bold' : 'btn btn-outline-secondary fw-semibold';
    renderKdsView();
  }

  function setKdsStatusFilter(statusKey, btnEl) {
    activeKdsStatusFilter = statusKey;
    document.querySelectorAll('#kdsStatusFilterGroup button').forEach(b => {
      b.className = 'btn btn-sm btn-outline-secondary slicer-chip';
    });
    if (btnEl) {
      btnEl.className = 'btn btn-sm btn-dark slicer-chip';
    }
    renderKdsView();
  }

  function updateKdsTicketStatus(ticketId, newStatus) {
    const tk = (kitchenTickets || []).find(t => t.ticketId === ticketId);
    if (!tk) return;
    tk.status = normalizeKdsStatus(newStatus);

    // Đồng bộ trạng thái các món con trong phiếu
    if (tk.status === 'Chờ chế biến') {
      (tk.items || []).forEach(it => { it.itemStatus = 'Chờ chế biến'; });
    } else if (tk.status === 'Đang chế biến') {
      (tk.items || []).forEach(it => {
        if (!it.itemStatus || it.itemStatus === 'Chờ chế biến') it.itemStatus = 'Đang chế biến';
      });
    } else if (tk.status === 'Đã xong - Chờ bưng' || tk.status === 'Đã giao bàn') {
      (tk.items || []).forEach(it => { it.itemStatus = 'Đã xong'; });
    }

    syncTicketToTableAndBackend(tk);
    renderKdsView();
    renderTablesView();
  }

  function cycleKdsItemStatus(ticketId, itemIdx) {
    const tk = (kitchenTickets || []).find(t => t.ticketId === ticketId);
    if (!tk || !tk.items || !tk.items[itemIdx]) return;
    const cur = tk.items[itemIdx].itemStatus || 'Chờ chế biến';
    let next = 'Đang chế biến';
    if (cur === 'Chờ chế biến') next = 'Đang chế biến';
    else if (cur === 'Đang chế biến') next = 'Đã xong';
    else next = 'Chờ chế biến';
    tk.items[itemIdx].itemStatus = next;

    // Tự động suy diễn trạng thái phiếu tổng từ trạng thái các món
    const allDone = tk.items.every(i => i.itemStatus === 'Đã xong');
    const anyWorking = tk.items.some(i => i.itemStatus === 'Đang chế biến' || i.itemStatus === 'Đã xong');
    if (allDone) {
      tk.status = 'Đã xong - Chờ bưng';
    } else if (anyWorking) {
      tk.status = 'Đang chế biến';
    } else {
      tk.status = 'Chờ chế biến';
    }

    syncTicketToTableAndBackend(tk);
    renderKdsView();
    renderTablesView();
  }

  function renderKdsView() {
    const grid = document.getElementById('kdsTicketsGrid');
    if (!grid) return;

    (kitchenTickets || []).forEach(k => {
      k.status = normalizeKdsStatus(k.status);
      (k.items || []).forEach(it => {
        if (!it.itemStatus) {
          it.itemStatus = (k.status === 'Đã xong - Chờ bưng' || k.status === 'Đã giao bàn') ? 'Đã xong' : k.status;
        }
      });
    });

    const cntWaiting = kitchenTickets.filter(k => k.status === 'Chờ chế biến').length;
    const cntCooking = kitchenTickets.filter(k => k.status === 'Đang chế biến').length;
    const cntReady = kitchenTickets.filter(k => k.status === 'Đã xong - Chờ bưng').length;
    const cntServed = kitchenTickets.filter(k => k.status === 'Đã giao bàn').length;
    const pendingCount = cntWaiting + cntCooking + cntReady;

    document.getElementById('badgePendingKitchen').innerText = cntWaiting + cntCooking;
    document.getElementById('kdsTicketCount').innerText = `${cntWaiting + cntCooking} Đang làm • ${cntReady} Chờ bưng`;
    if (document.getElementById('kdsCntAll')) document.getElementById('kdsCntAll').innerText = kitchenTickets.length;
    if (document.getElementById('kdsCntWaiting')) document.getElementById('kdsCntWaiting').innerText = cntWaiting;
    if (document.getElementById('kdsCntCooking')) document.getElementById('kdsCntCooking').innerText = cntCooking;
    if (document.getElementById('kdsCntReady')) document.getElementById('kdsCntReady').innerText = cntReady;
    if (document.getElementById('kdsCntServed')) document.getElementById('kdsCntServed').innerText = cntServed;

    const filteredTickets = kitchenTickets.filter(k => {
      const matchStation = activeKdsStationFilter === 'ALL' ||
        (k.items || []).some(it => String(it.kitchenStation || '').indexOf(activeKdsStationFilter) !== -1 || it.kitchenStation === 'Bếp & Pha Chế');
      const matchStatus = activeKdsStatusFilter === 'ALL' || k.status === activeKdsStatusFilter;
      return matchStation && matchStatus;
    });

    if (filteredTickets.length === 0) {
      grid.innerHTML = '<div class="col-12 text-center py-5 text-secondary fs-5"><i class="bi bi-check-circle-fill text-success me-2"></i>Không có phiếu bếp nào trong bộ lọc này!</div>';
      return;
    }

    grid.innerHTML = filteredTickets.map(k => {
      const realIdx = kitchenTickets.findIndex(orig => orig.ticketId === k.ticketId);
      const st = k.status;
      let cardCls = 'kds-status-waiting';
      let badgeCls = 'bg-warning text-dark';
      let nextBtnHtml = `<button type="button" class="btn btn-danger fw-bold btn-sm flex-grow-1" onclick="updateKdsTicketStatus('${k.ticketId}', 'Đang chế biến')"><i class="bi bi-fire me-1"></i> 1. Nhận Đơn & Bắt Đầu Nấu</button>`;

      if (st === 'Đang chế biến') {
        cardCls = 'kds-status-cooking';
        badgeCls = 'bg-danger';
        nextBtnHtml = `<button type="button" class="btn btn-primary fw-bold btn-sm flex-grow-1" onclick="updateKdsTicketStatus('${k.ticketId}', 'Đã xong - Chờ bưng')"><i class="bi bi-bell-fill me-1"></i> 2. Báo Xong Món (Chờ Bưng)</button>`;
      } else if (st === 'Đã xong - Chờ bưng') {
        cardCls = 'kds-status-ready';
        badgeCls = 'bg-primary';
        nextBtnHtml = `<button type="button" class="btn btn-success fw-bold btn-sm flex-grow-1" onclick="updateKdsTicketStatus('${k.ticketId}', 'Đã giao bàn')"><i class="bi bi-check2-circle me-1"></i> 3. Xác Nhận Đã Giao Lên Bàn</button>`;
      } else if (st === 'Đã giao bàn') {
        cardCls = 'kds-status-served';
        badgeCls = 'bg-success';
        nextBtnHtml = `<button type="button" class="btn btn-outline-success fw-bold btn-sm flex-grow-1" onclick="updateKdsTicketStatus('${k.ticketId}', 'Đang chế biến')"><i class="bi bi-arrow-counterclockwise me-1"></i> Đã Giao Bàn (Bấm để mở lại)</button>`;
      }

      const itemsHtml = (k.items || []).map((it, itemIdx) => {
        if (activeKdsStationFilter !== 'ALL' && String(it.kitchenStation || '').indexOf(activeKdsStationFilter) === -1 && it.kitchenStation !== 'Bếp & Pha Chế') {
          return '';
        }
        const iStat = it.itemStatus || 'Chờ chế biến';
        let iBtnCls = 'btn-outline-warning text-dark';
        let iIcon = '⏳ Chờ làm';
        if (iStat === 'Đang chế biến') { iBtnCls = 'btn-danger'; iIcon = '🔥 Đang làm'; }
        else if (iStat === 'Đã xong') { iBtnCls = 'btn-success'; iIcon = '✅ Đã xong'; }

        return `
          <div class="py-1 border-bottom border-light">
            <div class="d-flex justify-content-between align-items-center gap-1">
              <div>
                <span class="fw-bold ${iStat === 'Đã xong' ? 'text-decoration-line-through text-secondary' : 'text-dark'} fs-6">${it.qty}x ${it.name}</span>
                <span class="badge bg-secondary ms-1" style="font-size:10px;">${it.kitchenStation}</span>
              </div>
              <button type="button" class="btn btn-xs ${iBtnCls} btn-sm py-0 px-2 fw-bold" style="font-size:11px; white-space:nowrap;" onclick="cycleKdsItemStatus('${k.ticketId}', ${itemIdx})" title="Bấm để đổi trạng thái món này">
                ${iIcon}
              </button>
            </div>
            ${it.notes ? `<div class="text-danger fst-italic" style="font-size:11.5px;"><i class="bi bi-chat-dots me-1"></i>Ghi chú: ${it.notes}</div>` : ''}
          </div>
        `;
      }).join('');

      return `
        <div class="col-md-6 col-xl-4">
          <div class="kds-ticket-card ${cardCls}">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2 gap-1">
                <div>
                  <span class="badge ${badgeCls}">${st}</span>
                  <span class="fw-bold ms-1">${k.ticketId}</span>
                </div>
                <div class="d-flex align-items-center gap-1">
                  <select class="form-select form-select-sm py-0 px-2 fw-bold" style="width:auto; font-size:11.5px; height:26px;" onchange="updateKdsTicketStatus('${k.ticketId}', this.value)" title="Đổi nhanh trạng thái phiếu bếp">
                    <option value="Chờ chế biến" ${st === 'Chờ chế biến' ? 'selected' : ''}>⏳ Chờ chế biến</option>
                    <option value="Đang chế biến" ${st === 'Đang chế biến' ? 'selected' : ''}>🔥 Đang chế biến</option>
                    <option value="Đã xong - Chờ bưng" ${st === 'Đã xong - Chờ bưng' ? 'selected' : ''}>🔔 Đã xong - Chờ bưng</option>
                    <option value="Đã giao bàn" ${st === 'Đã giao bàn' ? 'selected' : ''}>✅ Đã giao bàn</option>
                  </select>
                  <span class="badge bg-dark"><i class="bi bi-clock me-1"></i>${k.orderTime}</span>
                </div>
              </div>

              <!-- THANH NÚT THAO TÁC NHANH NGAY ĐẦU THẺ ĐỂ KHÔNG BỊ KHUẤT -->
              <div class="d-flex gap-1 mb-2">
                ${nextBtnHtml}
              </div>

              <div class="d-flex justify-content-between align-items-center mb-1">
                <div class="h5 fw-bold text-primary mb-0">${k.tableName}</div>
                <span class="badge bg-warning text-dark">${k.zone || 'Tại bàn'}</span>
              </div>
              <div class="small text-secondary mb-2"><i class="bi bi-person-badge me-1"></i>NV Order: <strong>${k.waiter}</strong></div>

              <div class="border rounded-3 p-2 bg-body-tertiary mb-3 small">
                <div class="text-secondary mb-1" style="font-size:11px;"><i class="bi bi-hand-index-thumb me-1"></i>Bấm vào nút bên phải từng món để đổi trạng thái món:</div>
                ${itemsHtml}
              </div>
            </div>

            <div class="d-flex gap-2">
              <button type="button" class="btn btn-outline-dark btn-sm fw-semibold" onclick="printKitchenTicket(${realIdx})">
                <i class="bi bi-printer"></i> In Phiếu Bếp
              </button>
              ${nextBtnHtml}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function printKitchenTicket(idx) {
    const k = kitchenTickets[idx];
    if (!k) return;
    const html = `
      <div style="max-width: 340px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 13px; color: #000;">
        <div style="text-align:center; font-weight:bold; font-size:16px;">PHIẾU CHẾ BIẾN BẾP / BAR (KDS)</div>
        <div style="text-align:center;">Mã phiếu: <strong>${k.ticketId}</strong> • Giờ order: <strong>${k.orderTime}</strong></div>
        <div style="margin:6px 0; border-top:1px dashed #000;"></div>
        <div style="font-size:15px; font-weight:bold;">BÀN: ${k.tableName} (${k.zone || ''})</div>
        <div>Nhân viên Order: <strong>${k.waiter}</strong></div>
        <div style="margin:6px 0; border-top:1px dashed #000;"></div>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid #000;">
              <th style="text-align:left;">Tên Món & Ghi Chú</th>
              <th style="text-align:right;">SL</th>
            </tr>
          </thead>
          <tbody>
            ${k.items.map(it => `
              <tr>
                <td style="padding:4px 0;"><strong>${it.name}</strong><br><small>[${it.kitchenStation}] ${it.notes || ''}</small></td>
                <td style="text-align:right; font-weight:bold; font-size:15px;">x${it.qty}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    document.getElementById('printModalHeaderTitle').innerHTML = '<i class="bi bi-printer-fill me-2"></i>Phiếu Chế Biến Bếp K80 (' + k.ticketId + ')';
    document.getElementById('printAreaContainer').innerHTML = html;
    document.getElementById('dedicatedPrintSheet').innerHTML = html;
    showBsModal('printBillModal');
  }

  let pendingCheckoutData = null;

  function openCheckoutVietQrModal() {
    if (!currentOperatingTable) return;
    const totals = calculateCartTotals();
    if (totals.totalPayable <= 0 && currentCartItems.length === 0) {
      alert('Bàn chưa có món ăn hoặc tiền giờ để thanh toán! Vui lòng chọn món bên trái trước.');
      return;
    }

    const s = appData.settings || FALLBACK_DATA.settings;
    const invCode = buildClientInvoiceCode();
    const customer = document.getElementById('cartCustomerName').value.trim() || 'Khách vãng lai';
    const vipTier = document.getElementById('cartVipTierSelect').value;
    const isTimer = String(currentOperatingTable.serviceType || '').indexOf('Tính Giờ') !== -1;

    const defaultWaiter = currentUser && currentUser.role === 'STAFF' ? currentUser.fullName : 'Nguyễn Văn Minh (Order)';
    const defaultCashier = currentUser ? currentUser.fullName : 'Lê Thu Trang (Thu ngân)';
    document.getElementById('checkoutWaiterInput').value = defaultWaiter;
    document.getElementById('checkoutCashierInput').value = defaultCashier;

    pendingCheckoutData = {
      code: invCode,
      date: getClientNowStr(),
      tableCode: currentOperatingTable.code,
      tableName: currentOperatingTable.name,
      zone: currentOperatingTable.zone,
      waiter: defaultWaiter,
      cashier: defaultCashier,
      customer: customer,
      vipTier: vipTier,
      dishAmount: totals.dishSubtotal,
      timeUsed: isTimer ? `${totals.minutesPlayed} phút (${(totals.minutesPlayed / 60).toFixed(1)}h)` : '0',
      hourAmount: totals.hourAmount,
      promoDiscount: totals.promoDiscount,
      vipDiscount: totals.vipDiscount,
      discount: totals.promoDiscount + totals.vipDiscount,
      totalAmount: totals.totalPayable,
      items: JSON.parse(JSON.stringify(currentCartItems))
    };

    const bankId = s.BANK_ID || 'MB';
    const accNo = s.BANK_ACCOUNT_NO || '0974755104';
    const accName = encodeURIComponent(s.BANK_ACCOUNT_NAME || 'NGUYEN MINH TUAN');
    const addInfo = encodeURIComponent(invCode);
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accNo}-compact2.png?amount=${totals.totalPayable}&addInfo=${addInfo}&accountName=${accName}`;

    document.getElementById('checkoutQrImg').src = qrUrl;
    document.getElementById('checkoutAmountDisplay').innerText = formatVND(totals.totalPayable);
    document.getElementById('checkoutOrderCodeText').innerText = `${invCode} (${currentOperatingTable.name})`;

    hideBsModal('orderModal');
    showBsModal('checkoutModal');
  }

  function confirmCheckoutAndPrintBill() {
    if (!pendingCheckoutData) return;
    const method = document.getElementById('checkoutPaymentMethodSelect').value;
    const waiterName = document.getElementById('checkoutWaiterInput').value.trim() || pendingCheckoutData.waiter;
    const cashierName = document.getElementById('checkoutCashierInput').value.trim() || pendingCheckoutData.cashier;

    pendingCheckoutData.paymentMethod = method;
    pendingCheckoutData.waiter = waiterName;
    pendingCheckoutData.cashier = cashierName;

    const newInvoice = {
      code: pendingCheckoutData.code,
      date: pendingCheckoutData.date,
      tableName: pendingCheckoutData.tableName,
      waiter: waiterName,
      cashier: cashierName,
      customer: pendingCheckoutData.customer,
      vipTier: pendingCheckoutData.vipTier,
      dishAmount: pendingCheckoutData.dishAmount,
      timeUsed: pendingCheckoutData.timeUsed,
      hourAmount: pendingCheckoutData.hourAmount,
      discount: pendingCheckoutData.discount,
      totalAmount: pendingCheckoutData.totalAmount,
      paymentMethod: method,
      status: 'Đã tất toán',
      items: pendingCheckoutData.items
    };
    appData.invoices.unshift(newInvoice);

    appData.auditLogs.unshift({
      timestamp: pendingCheckoutData.date + ':00',
      username: currentUser ? currentUser.username : 'thungan_ca1',
      actorName: cashierName,
      action: 'THANH TOÁN HÓA ĐƠN',
      refCode: pendingCheckoutData.code,
      detail: `Thanh toán ${pendingCheckoutData.tableName} số tiền ${formatVND(pendingCheckoutData.totalAmount)} (${method})`
    });

    const tbl = (appData.tables || []).find(t => t.code === pendingCheckoutData.tableCode);
    if (tbl) {
      tbl.status = 'Trống';
      tbl.openTime = '';
      tbl.guestCount = 0;
      tbl.dishAmount = 0;
      tbl.hourAmount = 0;
      tbl.totalAmount = 0;
      tbl.cartItems = [];
      tbl.kdsStatus = '---';
      tbl.notes = 'Đã thanh toán bill ' + pendingCheckoutData.code;
    }

    // Tự động chuyển các phiếu bếp KDS của bàn vừa thanh toán sang Đã giao bàn
    (kitchenTickets || []).forEach(tk => {
      if (tk.tableCode === pendingCheckoutData.tableCode && tk.status !== 'Đã giao bàn') {
        tk.status = 'Đã giao bàn';
        (tk.items || []).forEach(it => { it.itemStatus = 'Đã xong'; });
      }
    });

    // Tự động cộng doanh số tích lũy & xét nâng hạng cho Hội viên VIP
    const selectedMemberId = document.getElementById('cartPresetCustomerSelect') ? document.getElementById('cartPresetCustomerSelect').value : '';
    pendingCheckoutData.memberId = selectedMemberId;
    const custLower = String(pendingCheckoutData.customer || '').toLowerCase();
    const matchedMember = getVipMembersList().find(m =>
      (selectedMemberId && m.id === selectedMemberId) ||
      (m.name && custLower.indexOf(m.name.toLowerCase()) !== -1) ||
      (m.phone && custLower.indexOf(m.phone) !== -1)
    );
    if (matchedMember) {
      matchedMember.spent = (Number(matchedMember.spent) || 0) + (Number(pendingCheckoutData.totalAmount) || 0);
      matchedMember.visits = (parseInt(matchedMember.visits, 10) || 0) + 1;
      const globalMode = (appData.settings && appData.settings.VIP_TIER_MODE) || 'AUTO_AND_MANUAL';
      if (globalMode !== 'MANUAL_ONLY' && matchedMember.tierMode !== 'Cố định hạng (Chủ quán cấp)') {
        matchedMember.tier = computeClientTierBySpent(matchedMember.spent);
      }
    }

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.checkoutTable({
        ...pendingCheckoutData,
        username: currentUser ? currentUser.username : 'cashier',
        actorName: cashierName
      });
    }

    hideBsModal('checkoutModal');
    renderTablesView();
    renderInvoicesView();
    renderDashboardView();
    openPrintBillPreview(pendingCheckoutData);
  }

  function openPrintBillPreview(invData) {
    const s = appData.settings || FALLBACK_DATA.settings;
    const listItems = (invData.items && invData.items.length > 0)
      ? invData.items
      : [{ name: 'Combo đồ ăn & thức uống theo bàn (' + invData.tableName + ')', qty: 1, price: invData.dishAmount, unit: 'Lượt', promo: 'Không' }];

    const itemsHtml = listItems.map(it => `
      <tr>
        <td style="padding:4px 0;">
          <strong>${it.name}</strong>
          ${it.promo && it.promo !== 'Không' ? `<br><small style="color:#d97706;">[${it.promo}]</small>` : ''}
          <br><small>${it.qty} ${it.unit || 'Phần'} x ${formatVND(it.price)}</small>
        </td>
        <td style="text-align:right; padding:4px 0; vertical-align:bottom;"><strong>${formatVND(it.price * it.qty)}</strong></td>
      </tr>
    `).join('');

    const bankId = s.BANK_ID || 'MB';
    const accNo = s.BANK_ACCOUNT_NO || '0974755104';
    const accName = encodeURIComponent(s.BANK_ACCOUNT_NAME || 'NGUYEN MINH TUAN');
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accNo}-compact2.png?amount=${invData.totalAmount}&addInfo=${encodeURIComponent(invData.code)}&accountName=${accName}`;

    const billHtml = `
      <div style="max-width: 380px; margin: 0 auto; text-align: center; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 13px; line-height: 1.5; color: #000;">
        <div style="font-weight: bold; font-size: 16px; text-transform: uppercase;">${s.STORE_NAME}</div>
        <div>Đ/c: ${s.STORE_ADDRESS}</div>
        <div>Hotline: ${s.STORE_PHONE}</div>
        <div style="margin: 8px 0; border-top: 1px dashed #000;"></div>

        <div style="font-weight: bold; font-size: 15px;">HÓA ĐƠN THANH TOÁN (POS BILL)</div>
        <div>Số HĐ: <strong>${invData.code}</strong> — Bàn: <strong>${invData.tableName}</strong></div>
        <div style="font-size: 11.5px; color: #333;">Ngày giờ: ${invData.date || getClientNowStr()}</div>
        <div style="font-size: 11.5px;">NV Order: <strong>${invData.waiter || 'Phục vụ'}</strong> • Thu ngân: <strong>${invData.cashier || 'Thu ngân'}</strong></div>
        <div style="font-size: 11.5px;">Khách hàng: <strong>${invData.customer}</strong> (${invData.vipTier})</div>
        <div style="margin: 8px 0; border-top: 1px dashed #000;"></div>

        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12.5px;">
          <thead>
            <tr style="border-bottom: 1px solid #000;">
              <th style="padding-bottom: 4px;">Tên Món / Dịch Vụ</th>
              <th style="text-align: right; padding-bottom: 4px;">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin: 8px 0; border-top: 1px dashed #000;"></div>

        <div style="text-align: right; line-height: 1.75;">
          <div>Tiền món ăn/đồ uống: <strong>${formatVND(invData.dishAmount)}</strong></div>
          ${Number(invData.hourAmount) > 0 ? `<div>Tiền giờ (${invData.timeUsed}): <strong>+${formatVND(invData.hourAmount)}</strong></div>` : ''}
          ${Number(invData.discount) > 0 ? `<div style="color:#dc2626;">Khuyến mãi & Giảm VIP: <strong>-${formatVND(invData.discount)}</strong></div>` : ''}
          <div style="font-size: 16px; font-weight: bold; border-top: 1px solid #000; padding-top: 4px;">TỔNG THANH TOÁN: ${formatVND(invData.totalAmount)}</div>
          <div style="font-size: 12px; font-style: italic;">Phương thức: ${invData.paymentMethod || 'VietQR Động'}</div>
        </div>

        <div style="margin: 10px 0 6px; text-align: center;">
          <img src="${qrUrl}" alt="Mã VietQR" style="width: 145px; height: 145px; border: 1px solid #ddd; padding: 4px; border-radius: 6px;">
          <div style="font-size: 10.5px; color: #444; margin-top: 2px;">Mã VietQR Động Napas 247 (${s.BANK_ID} - ${s.BANK_ACCOUNT_NO})</div>
        </div>

        <div style="margin: 8px 0; border-top: 1px dashed #000;"></div>
        <div style="font-size: 11.5px;">Wi-Fi miễn phí: <strong>${s.STORE_WIFI}</strong></div>
        <div style="font-weight: bold; margin-top: 4px;">CẢM ƠN QUÝ KHÁCH & HẸN GẶP LẠI!</div>
      </div>
    `;

    document.getElementById('printModalHeaderTitle').innerHTML = '<i class="bi bi-printer-fill me-2"></i>Xem Trước Hóa Đơn Thanh Toán (' + invData.code + ')';
    document.getElementById('printAreaContainer').innerHTML = billHtml;
    document.getElementById('dedicatedPrintSheet').innerHTML = billHtml;
    showBsModal('printBillModal');
  }

  function executePrintBillNow() {
    const content = document.getElementById('printAreaContainer').innerHTML;
    document.getElementById('dedicatedPrintSheet').innerHTML = content;

    try {
      const pWin = window.open('', '_blank', 'width=480,height=720');
      if (pWin && pWin.document) {
        pWin.document.open();
        pWin.document.write(
          '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>In Hóa Đơn K80 - GS-005</title>' +
          '<style>' +
          'body { font-family: "Segoe UI", Tahoma, sans-serif; margin: 0; padding: 12px; font-size: 13px; color: #000; background: #fff; }' +
          '@media print { @page { size: 80mm auto; margin: 0; } body { padding: 4mm; } }' +
          '</style></head><body>' + content +
          '<scr' + 'ipt>window.onload = function() { setTimeout(function() { window.focus(); window.print(); }, 250); };</scr' + 'ipt>' +
          '</body></html>'
        );
        pWin.document.close();
        return;
      }
    } catch (e) {}

    window.print();
  }

  function renderMenuTableView() {
    const cat = document.getElementById('menuCatFilter').value;
    const promoF = document.getElementById('menuPromoFilter').value;
    const q = (document.getElementById('menuSearchInput').value || '').toLowerCase().trim();
    const tbody = document.getElementById('menuTableTbody');

    const filtered = (appData.menuItems || []).filter(m => {
      const matchCat = cat === 'ALL' || m.category === cat;
      const matchPromo = promoF === 'ALL' || m.promo === promoF;
      const matchQ = !q || m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q);
      return matchCat && matchPromo && matchQ;
    });

    tbody.innerHTML = filtered.map(m => `
      <tr>
        <td class="fw-bold text-center text-primary">${m.code}</td>
        <td>
          <div class="fw-bold">${m.name}</div>
          <div class="small text-secondary">${m.notes || ''}</div>
        </td>
        <td><span class="badge bg-secondary-subtle text-dark">${m.category}</span></td>
        <td class="text-center">${m.unit}</td>
        <td class="text-end fw-bold text-success">${formatVND(m.price)}</td>
        <td class="text-end text-secondary">${formatVND(m.costPrice)}</td>
        <td class="text-center"><span class="badge ${m.promo !== 'Không' ? 'bg-danger' : 'bg-light text-dark border'}">${m.promo}</span></td>
        <td class="text-center small fw-semibold">${m.kitchenStation}</td>
        <td class="text-center"><span class="badge ${m.status === 'Còn hàng' ? 'bg-success' : 'bg-danger'}">${m.status}</span></td>
        <td class="text-center">
          <button type="button" class="btn btn-xs btn-outline-primary btn-sm" onclick="editMenuItem('${m.code}')">Sửa</button>
        </td>
      </tr>
    `).join('');
  }

  function setVipSlicer(tierKey, btnEl) {
    activeVipSlicer = tierKey;
    document.querySelectorAll('#vipTierSlicerButtons button').forEach(b => {
      b.className = 'btn btn-sm btn-outline-secondary slicer-chip';
    });
    if (btnEl) {
      btnEl.className = 'btn btn-sm btn-primary slicer-chip';
    }
    renderInvoicesView();
  }

  function updateVipRuleSummaryBanner() {
    const s = appData.settings || FALLBACK_DATA.settings;
    const banner = document.getElementById('vipTierRuleSummaryText');
    if (!banner) return;
    const silvMin = formatVND(s.TIER_SILVER_MIN || 3000000);
    const goldMin = formatVND(s.TIER_GOLD_MIN || 8000000);
    const platMin = formatVND(s.TIER_PLATINUM_MIN || 15000000);
    const modeLabel = s.VIP_TIER_MODE === 'STRICT_AUTO'
      ? 'Tự động 100% theo doanh số tích lũy'
      : (s.VIP_TIER_MODE === 'MANUAL_ONLY' ? 'Phân hạng thủ công (Chủ quán/Thu ngân gán)' : 'Tự động nâng hạng theo chi tiêu + Cho phép đổi hạng trực tiếp');
    banner.innerHTML = `Cơ chế hiện tại: <strong class="text-primary">${modeLabel}</strong> • 🥈 Bạc (≥ ${silvMin}, -${s.DISCOUNT_SILVER || 5}%) • 🥇 Vàng (≥ ${goldMin}, -${s.DISCOUNT_GOLD || 10}%) • 💎 Bạch Kim (≥ ${platMin}, -${s.DISCOUNT_PLATINUM || 15}%)`;
  }

  function renderInvoicesView() {
    refreshVipTierSelectOptions();
    updateVipRuleSummaryBanner();

    const members = getVipMembersList();
    const s = appData.settings || FALLBACK_DATA.settings;
    const sPct = s.DISCOUNT_SILVER || '5';
    const gPct = s.DISCOUNT_GOLD || '10';
    const pPct = s.DISCOUNT_PLATINUM || '15';

    if (document.getElementById('vipCntAll')) document.getElementById('vipCntAll').innerText = members.length;
    if (document.getElementById('vipCntSilver')) document.getElementById('vipCntSilver').innerText = members.filter(m => String(m.tier).indexOf('Bạc') !== -1).length;
    if (document.getElementById('vipCntGold')) document.getElementById('vipCntGold').innerText = members.filter(m => String(m.tier).indexOf('Vàng') !== -1).length;
    if (document.getElementById('vipCntPlat')) document.getElementById('vipCntPlat').innerText = members.filter(m => String(m.tier).indexOf('Bạch Kim') !== -1).length;

    const vipSearch = (document.getElementById('vipMemberSearchInput') ? document.getElementById('vipMemberSearchInput').value : '').toLowerCase().trim();
    const vipRow = document.getElementById('vipCustomersCardsRow');
    if (vipRow) {
      if (activeVipSlicer === 'Vãng lai') {
        vipRow.innerHTML = `
          <div class="col-12">
            <div class="p-3 border rounded-3 bg-body-tertiary d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <div class="fw-bold text-dark"><i class="bi bi-people me-1"></i>Đang lọc nhóm Hóa đơn Khách Vãng Lai (0% chiết khấu thẻ)</div>
                <div class="small text-secondary">Bạn có thể đăng ký khách vãng lai thành Hội viên mới để tích lũy doanh số và áp dụng chiết khấu Hạng Bạc / Vàng / Bạch Kim.</div>
              </div>
              <button type="button" class="btn btn-sm btn-primary fw-bold" onclick="openVipMemberModal()">
                <i class="bi bi-person-plus-fill me-1"></i> + Đăng Ký Hội Viên Mới Ngay
              </button>
            </div>
          </div>
        `;
      } else {
        const filteredVip = members.filter(c => {
          const matchTier = activeVipSlicer === 'ALL' || String(c.tier || '').indexOf(activeVipSlicer) !== -1;
          const matchSearch = !vipSearch ||
            String(c.name || '').toLowerCase().includes(vipSearch) ||
            String(c.phone || '').toLowerCase().includes(vipSearch) ||
            String(c.id || '').toLowerCase().includes(vipSearch);
          return matchTier && matchSearch;
        });

        if (filteredVip.length === 0) {
          vipRow.innerHTML = `
            <div class="col-12 text-center py-3 text-secondary small">
              Chưa có hội viên nào trong nhóm này.
              <button type="button" class="btn btn-xs btn-outline-primary btn-sm ms-2" onclick="openVipMemberModal()">+ Thêm Hội Viên Mới</button>
            </div>
          `;
        } else {
          vipRow.innerHTML = filteredVip.map(c => {
            let badgeColor = 'bg-secondary';
            if (String(c.tier).indexOf('Bạch Kim') !== -1) badgeColor = 'bg-info text-dark';
            else if (String(c.tier).indexOf('Vàng') !== -1) badgeColor = 'bg-warning text-dark';
            else if (String(c.tier).indexOf('Bạc') !== -1) badgeColor = 'bg-secondary text-white';

            const isLocked = c.status === 'Tạm khóa';

            return `
              <div class="col-md-6 col-xl-4">
                <div class="p-3 border rounded-3 ${isLocked ? 'bg-danger-subtle border-danger' : 'bg-body-tertiary'} h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div class="d-flex justify-content-between align-items-start mb-1">
                      <div>
                        <span class="badge bg-dark me-1">${c.id}</span>
                        <span class="fw-bold text-dark">${c.name}</span>
                      </div>
                      <span class="badge ${isLocked ? 'bg-danger' : 'bg-success-subtle text-success border border-success-subtle'}" style="cursor:pointer;" onclick="toggleVipMemberLock('${c.id}')" title="Bấm để Mở khóa / Tạm khóa thẻ">
                        ${isLocked ? '🔒 Đang khóa (Bấm mở)' : '🟢 Hoạt động'}
                      </span>
                    </div>
                    <div class="small text-secondary mb-2">
                      <i class="bi bi-telephone-fill text-primary me-1"></i>${c.phone || 'Chưa cập nhật SĐT'} • <span class="fst-italic">${c.tierMode || 'Tự động theo chi tiêu'}</span>
                    </div>

                    <div class="d-flex justify-content-between align-items-center bg-white p-2 rounded border mb-2">
                      <div>
                        <div class="text-secondary" style="font-size:10.5px;">TỔNG CHI TIÊU (${c.visits || 1} lượt)</div>
                        <div class="fw-bold text-primary fs-6">${formatVND(c.spent)}</div>
                      </div>
                      <div class="text-end">
                        <div class="text-secondary" style="font-size:10.5px;">ĐỔI HẠNG TRỰC TIẾP</div>
                        <select class="form-select form-select-sm py-0 px-2 fw-bold" style="font-size:11.5px; height:26px;" onchange="quickChangeMemberTier('${c.id}', this.value)">
                          <option value="Thân Thiết (Member - 0%)" ${String(c.tier).indexOf('Thân Thiết') !== -1 ? 'selected' : ''}>👤 Thân Thiết (0%)</option>
                          <option value="Bạc (Silver - ${sPct}%)" ${String(c.tier).indexOf('Bạc') !== -1 ? 'selected' : ''}>🥈 Hạng Bạc (-${sPct}%)</option>
                          <option value="Vàng (Gold - ${gPct}%)" ${String(c.tier).indexOf('Vàng') !== -1 ? 'selected' : ''}>🥇 Hạng Vàng (-${gPct}%)</option>
                          <option value="Bạch Kim (Platinum - ${pPct}%)" ${String(c.tier).indexOf('Bạch Kim') !== -1 ? 'selected' : ''}>💎 Bạch Kim (-${pPct}%)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center pt-1 border-top">
                    <span class="badge ${badgeColor}">${c.tier}</span>
                    <div class="btn-group btn-group-sm">
                      <button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" onclick="openVipMemberModal('${c.id}')">
                        <i class="bi bi-pencil-square"></i> Sửa / Đổi cơ chế
                      </button>
                      <button type="button" class="btn btn-xs btn-outline-danger py-0 px-2" onclick="deleteVipMemberClient('${c.id}')">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    }

    const q = (document.getElementById('invSearchInput').value || '').toLowerCase().trim();
    const tbody = document.getElementById('invoicesTableTbody');

    const filtered = (appData.invoices || []).filter(i => {
      const matchVip = activeVipSlicer === 'ALL' || String(i.vipTier || '').indexOf(activeVipSlicer) !== -1;
      const matchQ = !q || i.code.toLowerCase().includes(q) || i.tableName.toLowerCase().includes(q) || i.customer.toLowerCase().includes(q);
      return matchVip && matchQ;
    });

    tbody.innerHTML = filtered.map(i => `
      <tr>
        <td class="fw-bold text-center text-primary">${i.code}</td>
        <td class="small text-center">${i.date}</td>
        <td class="fw-semibold">${i.tableName}</td>
        <td class="small">
          <div>Order: <strong>${i.waiter || 'Phục vụ'}</strong></div>
          <div class="text-secondary">Thu ngân: ${i.cashier}</div>
        </td>
        <td>
          <div class="fw-semibold">${i.customer}</div>
          <span class="badge bg-warning-subtle text-dark border">${i.vipTier}</span>
        </td>
        <td class="text-end">${formatVND(i.dishAmount)}</td>
        <td class="text-center small">${i.timeUsed}</td>
        <td class="text-end">${formatVND(i.hourAmount)}</td>
        <td class="text-end text-danger fw-semibold">${Number(i.discount) > 0 ? '-' + formatVND(i.discount) : '0 ₫'}</td>
        <td class="text-end fw-bold text-primary fs-6">${formatVND(i.totalAmount)}</td>
        <td class="text-center"><span class="badge bg-info-subtle text-dark">${i.paymentMethod}</span></td>
        <td class="text-center">
          <button type="button" class="btn btn-sm btn-outline-dark fw-semibold" onclick="reprintInvoice('${i.code}')">
            <i class="bi bi-printer me-1"></i> In Bill
          </button>
        </td>
      </tr>
    `).join('');
  }

  function reprintInvoice(code) {
    const inv = (appData.invoices || []).find(i => i.code === code);
    if (!inv) return;
    openPrintBillPreview({
      ...inv,
      tableCode: 'REPRINT',
      items: inv.items || [
        { name: 'Chi tiết món ăn & đồ uống theo HĐ ' + inv.code, qty: 1, price: inv.dishAmount, unit: 'HĐ', promo: 'Không' }
      ]
    });
  }

  function openVipMemberModal(editId) {
    refreshVipTierSelectOptions();
    const members = getVipMembersList();
    if (editId) {
      const m = members.find(x => x.id === editId);
      if (!m) return;
      document.getElementById('vipMemberModalTitle').innerHTML = `<i class="bi bi-pencil-square me-2"></i>Cập Nhật Hội Viên & Phân Hạng: ${m.id}`;
      document.getElementById('vmMemberId').value = m.id;
      document.getElementById('vmMemberId').readOnly = true;
      document.getElementById('vmMemberName').value = m.name || '';
      document.getElementById('vmMemberPhone').value = m.phone || '';
      document.getElementById('vmTierMode').value = m.tierMode || 'Tự động theo chi tiêu';
      document.getElementById('vmMemberSpent').value = m.spent || 0;
      document.getElementById('vmMemberVisits').value = m.visits || 1;
      document.getElementById('vmMemberStatus').value = m.status || 'Hoạt động';
      document.getElementById('vmMemberNotes').value = m.notes || '';

      const vmSel = document.getElementById('vmMemberTier');
      const matchOpt = [...vmSel.options].find(o => o.value.split('(')[0].trim() === String(m.tier || '').split('(')[0].trim());
      if (matchOpt) vmSel.value = matchOpt.value;
    } else {
      const nextNum = members.length + 1;
      document.getElementById('vipMemberModalTitle').innerHTML = '<i class="bi bi-person-plus-fill me-2"></i>Thêm Hội Viên VIP Mới';
      document.getElementById('vmMemberId').value = 'VIP-' + String(nextNum).padStart(2, '0');
      document.getElementById('vmMemberId').readOnly = false;
      document.getElementById('vmMemberName').value = '';
      document.getElementById('vmMemberPhone').value = '';
      document.getElementById('vmTierMode').value = 'Tự động theo chi tiêu';
      document.getElementById('vmMemberSpent').value = '3500000';
      document.getElementById('vmMemberVisits').value = '1';
      document.getElementById('vmMemberStatus').value = 'Hoạt động';
      document.getElementById('vmMemberNotes').value = '';
      onVmSpentInput();
    }
    showBsModal('vipMemberModal');
  }

  function onVmTierModeChange() {
    const mode = document.getElementById('vmTierMode').value;
    if (mode === 'Tự động theo chi tiêu') {
      onVmSpentInput();
    }
  }

  function onVmSpentInput() {
    const mode = document.getElementById('vmTierMode').value;
    if (mode === 'Tự động theo chi tiêu') {
      const spent = Number(document.getElementById('vmMemberSpent').value) || 0;
      document.getElementById('vmMemberTier').value = computeClientTierBySpent(spent);
    }
  }

  function submitVipMemberForm() {
    const id = document.getElementById('vmMemberId').value.trim().toUpperCase();
    const name = document.getElementById('vmMemberName').value.trim();
    const phone = document.getElementById('vmMemberPhone').value.trim();
    if (!id || !name) {
      alert('Vui lòng nhập Mã hội viên và Họ tên hội viên!');
      return;
    }

    const spent = Math.max(0, Number(document.getElementById('vmMemberSpent').value) || 0);
    const visits = Math.max(1, parseInt(document.getElementById('vmMemberVisits').value, 10) || 1);
    const tierMode = document.getElementById('vmTierMode').value;
    const tier = document.getElementById('vmMemberTier').value;
    const status = document.getElementById('vmMemberStatus').value;
    const notes = document.getElementById('vmMemberNotes').value.trim();

    const memberObj = { id, name, phone, tier, spent, visits, tierMode, status, notes };
    const members = getVipMembersList();
    const idx = members.findIndex(m => m.id === id);
    if (idx >= 0) members[idx] = memberObj;
    else members.unshift(memberObj);

    hideBsModal('vipMemberModal');
    populatePresetVipDropdown();
    renderInvoicesView();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.saveVipMember({
        ...memberObj,
        username: currentUser ? currentUser.username : 'admin',
        actorName: currentUser ? currentUser.fullName : 'Admin'
      });
    }
  }

  function quickChangeMemberTier(memberId, newTierValue) {
    const members = getVipMembersList();
    const m = members.find(x => x.id === memberId);
    if (!m) return;
    m.tier = newTierValue;
    m.tierMode = 'Cố định hạng (Chủ quán cấp)';
    populatePresetVipDropdown();
    renderInvoicesView();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.saveVipMember({
        ...m,
        username: currentUser ? currentUser.username : 'admin',
        actorName: currentUser ? currentUser.fullName : 'Admin'
      });
    }
  }

  function toggleVipMemberLock(memberId) {
    const members = getVipMembersList();
    const m = members.find(x => x.id === memberId);
    if (!m) return;
    m.status = (m.status === 'Tạm khóa') ? 'Hoạt động' : 'Tạm khóa';
    populatePresetVipDropdown();
    renderInvoicesView();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.saveVipMember({
        ...m,
        username: currentUser ? currentUser.username : 'admin',
        actorName: currentUser ? currentUser.fullName : 'Admin'
      });
    }
  }

  function deleteVipMemberClient(memberId) {
    const members = getVipMembersList();
    const m = members.find(x => x.id === memberId);
    if (!m) return;
    if (!confirm(`Bạn có chắc chắn muốn xóa hội viên [${m.name}] không?`)) return;
    appData.vipMembers = members.filter(x => x.id !== memberId);
    populatePresetVipDropdown();
    renderInvoicesView();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.deleteVipMember(memberId, currentUser ? currentUser.fullName : 'Admin');
    }
  }

  function openTierMechanismModal() {
    const s = appData.settings || FALLBACK_DATA.settings;
    document.getElementById('tmVipModeSelect').value = s.VIP_TIER_MODE || 'AUTO_AND_MANUAL';
    document.getElementById('tmSilverMin').value = s.TIER_SILVER_MIN || '3000000';
    document.getElementById('tmGoldMin').value = s.TIER_GOLD_MIN || '8000000';
    document.getElementById('tmPlatMin').value = s.TIER_PLATINUM_MIN || '15000000';
    document.getElementById('tmSilverPct').value = s.DISCOUNT_SILVER || '5';
    document.getElementById('tmGoldPct').value = s.DISCOUNT_GOLD || '10';
    document.getElementById('tmPlatPct').value = s.DISCOUNT_PLATINUM || '15';
    showBsModal('tierMechanismModal');
  }

  function submitTierMechanismForm() {
    const mode = document.getElementById('tmVipModeSelect').value;
    const silvMin = String(Math.max(0, Number(document.getElementById('tmSilverMin').value) || 3000000));
    const goldMin = String(Math.max(0, Number(document.getElementById('tmGoldMin').value) || 8000000));
    const platMin = String(Math.max(0, Number(document.getElementById('tmPlatMin').value) || 15000000));
    const silvPct = String(Math.min(100, Math.max(0, Number(document.getElementById('tmSilverPct').value) || 5)));
    const goldPct = String(Math.min(100, Math.max(0, Number(document.getElementById('tmGoldPct').value) || 10)));
    const platPct = String(Math.min(100, Math.max(0, Number(document.getElementById('tmPlatPct').value) || 15)));

    appData.settings = {
      ...appData.settings,
      VIP_TIER_MODE: mode,
      TIER_SILVER_MIN: silvMin,
      TIER_GOLD_MIN: goldMin,
      TIER_PLATINUM_MIN: platMin,
      DISCOUNT_SILVER: silvPct,
      DISCOUNT_GOLD: goldPct,
      DISCOUNT_PLATINUM: platPct
    };

    const forceAll = (mode === 'STRICT_AUTO');
    if (mode !== 'MANUAL_ONLY') {
      getVipMembersList().forEach(m => {
        if (forceAll || m.tierMode === 'Tự động theo chi tiêu') {
          m.tier = computeClientTierBySpent(m.spent);
          if (forceAll) m.tierMode = 'Tự động theo chi tiêu';
        }
      });
    }

    hideBsModal('tierMechanismModal');
    populateStoreSettings();
    populatePresetVipDropdown();
    renderInvoicesView();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.saveVipTierMechanism({
        VIP_TIER_MODE: mode,
        TIER_SILVER_MIN: silvMin,
        TIER_GOLD_MIN: goldMin,
        TIER_PLATINUM_MIN: platMin,
        DISCOUNT_SILVER: silvPct,
        DISCOUNT_GOLD: goldPct,
        DISCOUNT_PLATINUM: platPct,
        recalcAllMembers: mode !== 'MANUAL_ONLY',
        forceOverrideAll: forceAll,
        username: currentUser ? currentUser.username : 'admin',
        actorName: currentUser ? currentUser.fullName : 'Admin'
      });
    }
    alert('✅ Đã cập nhật cơ chế phân hạng & đồng bộ ưu đãi thẻ thành viên thành công!');
  }

  function recalculateAllMembersTiers() {
    getVipMembersList().forEach(m => {
      m.tier = computeClientTierBySpent(m.spent);
      m.tierMode = 'Tự động theo chi tiêu';
    });
    populatePresetVipDropdown();
    renderInvoicesView();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      const s = appData.settings || FALLBACK_DATA.settings;
      google.script.run.saveVipTierMechanism({
        ...s,
        recalcAllMembers: true,
        forceOverrideAll: true,
        username: currentUser ? currentUser.username : 'admin',
        actorName: currentUser ? currentUser.fullName : 'Admin'
      });
    }
    alert('🔄 Đã tự động xếp hạng lại toàn bộ Hội viên theo định mức chi tiêu tích lũy!');
  }

  function renderDashboardView() {
    let rev = 0, dishRev = 0, hourRev = 0;
    (appData.invoices || []).forEach(i => {
      rev += Number(i.totalAmount) || 0;
      dishRev += Number(i.dishAmount) || 0;
      hourRev += Number(i.hourAmount) || 0;
    });

    let pending = 0, occ = 0;
    (appData.tables || []).forEach(t => {
      if (t.status === 'Đang phục vụ' || t.status === 'Chờ thanh toán') {
        occ++;
        pending += Number(t.totalAmount) || 0;
      }
    });

    document.getElementById('kpiTotalRevenue').innerText = formatVND(rev);
    document.getElementById('kpiInvoiceCountSub').innerText = `Trên ${(appData.invoices || []).length} hóa đơn hoàn tất`;
    document.getElementById('kpiDishesRevenue').innerText = formatVND(dishRev);
    document.getElementById('kpiHourRevenue').innerText = formatVND(hourRev);
    document.getElementById('kpiPendingAmount').innerText = formatVND(pending);
    document.getElementById('kpiOccupiedCountSub').innerText = `Trên ${occ} bàn đang có khách`;

    if (typeof Chart !== 'undefined') {
      const ctxBar = document.getElementById('revenueBarChart');
      if (revenueBarChartInstance) revenueBarChartInstance.destroy();
      if (ctxBar) {
        revenueBarChartInstance = new Chart(ctxBar, {
          type: 'bar',
          data: {
            labels: ['Cà Phê', 'Trà & Nước Ép', 'Món Chính & Lẩu', 'Ăn Nhẹ', 'Bánh', 'Combo', 'Tiền Giờ Bida/VIP'],
            datasets: [{
              label: 'Doanh số (Nghìn ₫)',
              data: [180, 240, 520, 140, 110, 390, Math.round((hourRev || 240000) / 1000)],
              backgroundColor: '#f59e0b',
              borderRadius: 6
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      const ctxPie = document.getElementById('revenuePieChart');
      if (revenuePieChartInstance) revenuePieChartInstance.destroy();
      if (ctxPie) {
        revenuePieChartInstance = new Chart(ctxPie, {
          type: 'doughnut',
          data: {
            labels: ['Tiền Món Ăn/Uống', 'Tiền Giờ Bida/VIP'],
            datasets: [{
              data: [dishRev || 1000000, hourRev || 240000],
              backgroundColor: ['#10b981', '#3b82f6']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }
    }
  }

  function renderRbacView() {
    const tbody = document.getElementById('rbacUsersTbody');
    tbody.innerHTML = (appData.users || []).map(u => `
      <tr>
        <td class="fw-bold text-center"><code>${u.username}</code></td>
        <td class="text-center"><code>${u.password || '123456'}</code></td>
        <td class="fw-semibold">${u.fullName}</td>
        <td class="text-center"><span class="badge bg-primary">${u.role}</span></td>
        <td class="text-center">${u.assignedZone}</td>
        <td class="text-center"><span class="badge ${u.status === 'Hoạt động' ? 'bg-success' : 'bg-danger'}">${u.status || 'Hoạt động'}</span></td>
        <td class="text-center">
          <button type="button" class="btn btn-xs btn-outline-primary btn-sm" onclick="editUser('${u.username}')">Sửa</button>
        </td>
      </tr>
    `).join('');

    const auditTbody = document.getElementById('auditLogsTbody');
    auditTbody.innerHTML = (appData.auditLogs || []).map(a => `
      <tr>
        <td class="small text-nowrap">${a.timestamp}</td>
        <td class="small fw-semibold">${a.actorName}</td>
        <td class="text-center"><span class="badge bg-warning-subtle text-dark">${a.action}</span></td>
        <td class="small">${a.detail}</td>
      </tr>
    `).join('');
  }

  function populateStoreSettings() {
    const s = appData.settings || FALLBACK_DATA.settings;
    document.getElementById('cfgStoreName').value = s.STORE_NAME || '';
    document.getElementById('cfgStorePhone').value = s.STORE_PHONE || '';
    document.getElementById('cfgStoreAddress').value = s.STORE_ADDRESS || '';
    document.getElementById('cfgStoreWifi').value = s.STORE_WIFI || '';
    document.getElementById('cfgBankId').value = s.BANK_ID || 'MB';
    document.getElementById('cfgAccountNo').value = s.BANK_ACCOUNT_NO || '0974755104';
    document.getElementById('cfgAccountName').value = s.BANK_ACCOUNT_NAME || 'NGUYEN MINH TUAN';
    document.getElementById('cfgDiscountSilver').value = s.DISCOUNT_SILVER || '5';
    document.getElementById('cfgDiscountGold').value = s.DISCOUNT_GOLD || '10';
    document.getElementById('cfgDiscountPlatinum').value = s.DISCOUNT_PLATINUM || '15';
  }

  function handleSaveStoreSettings() {
    const cfg = {
      STORE_NAME: document.getElementById('cfgStoreName').value.trim(),
      STORE_PHONE: document.getElementById('cfgStorePhone').value.trim(),
      STORE_ADDRESS: document.getElementById('cfgStoreAddress').value.trim(),
      STORE_WIFI: document.getElementById('cfgStoreWifi').value.trim(),
      BANK_ID: document.getElementById('cfgBankId').value.trim().toUpperCase(),
      BANK_ACCOUNT_NO: document.getElementById('cfgAccountNo').value.trim(),
      BANK_ACCOUNT_NAME: document.getElementById('cfgAccountName').value.trim().toUpperCase(),
      DISCOUNT_SILVER: document.getElementById('cfgDiscountSilver').value.trim(),
      DISCOUNT_GOLD: document.getElementById('cfgDiscountGold').value.trim(),
      DISCOUNT_PLATINUM: document.getElementById('cfgDiscountPlatinum').value.trim(),
      username: currentUser ? currentUser.username : 'admin',
      actorName: currentUser ? currentUser.fullName : 'Admin'
    };
    appData.settings = { ...appData.settings, ...cfg };
    document.getElementById('topbarStoreTitle').innerText = cfg.STORE_NAME;

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        alert(res && res.message ? res.message : 'Đã lưu cấu hình!');
      }).saveStoreConfig(cfg);
    } else {
      alert('Đã lưu cấu hình thông tin quán và tài khoản VietQR thành công!');
    }
  }

  function openTableModal(editCode) {
    if (editCode) {
      const t = (appData.tables || []).find(x => x.code === editCode);
      if (t) {
        document.getElementById('tmTableCode').value = t.code;
        document.getElementById('tmTableCode').readOnly = true;
        document.getElementById('tmTableName').value = t.name;
        document.getElementById('tmTableZone').value = t.zone;
        document.getElementById('tmServiceType').value = t.serviceType;
        document.getElementById('tmHourlyRate').value = t.hourlyRate || 0;
        document.getElementById('tmTableNotes').value = t.notes || '';
      }
    } else {
      const nextIdx = (appData.tables ? appData.tables.length : 10) + 1;
      document.getElementById('tmTableCode').value = 'BAN-' + String(nextIdx).padStart(2, '0');
      document.getElementById('tmTableCode').readOnly = false;
      document.getElementById('tmTableName').value = 'Bàn Mới ' + String(nextIdx).padStart(2, '0');
      document.getElementById('tmTableZone').value = 'Tầng 1 — Cafe & Sân Vườn';
      document.getElementById('tmServiceType').value = 'Bàn Cafe thường';
      document.getElementById('tmHourlyRate').value = '0';
      document.getElementById('tmTableNotes').value = 'Sẵn sàng đón khách';
    }
    showBsModal('tableModal');
  }

  function submitTableForm() {
    const code = document.getElementById('tmTableCode').value.trim().toUpperCase();
    const name = document.getElementById('tmTableName').value.trim();
    if (!code || !name) {
      alert('Vui lòng nhập Mã bàn và Tên bàn!');
      return;
    }
    const zone = document.getElementById('tmTableZone').value;
    const serviceType = document.getElementById('tmServiceType').value;
    const hourlyRate = Number(document.getElementById('tmHourlyRate').value) || 0;
    const notes = document.getElementById('tmTableNotes').value.trim();

    const idx = (appData.tables || []).findIndex(t => t.code === code);
    if (idx >= 0) {
      appData.tables[idx].name = name;
      appData.tables[idx].zone = zone;
      appData.tables[idx].serviceType = serviceType;
      appData.tables[idx].hourlyRate = hourlyRate;
      appData.tables[idx].notes = notes;
    } else {
      appData.tables.push({
        code, name, zone, serviceType, status: 'Trống',
        hourlyRate, openTime: '', minutesPlayed: 60, guestCount: 0,
        dishAmount: 0, hourAmount: 0, totalAmount: 0, notes, cartItems: []
      });
    }

    hideBsModal('tableModal');
    renderTablesView();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.saveTableItem({
        code, name, zone, serviceType, hourlyRate, notes,
        username: currentUser ? currentUser.username : 'admin',
        actorName: currentUser ? currentUser.fullName : 'Admin'
      });
    }
  }

  function openNewMenuModal() {
    document.getElementById('menuItemModalTitle').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Thêm Món Ăn / Combo Mới';
    document.getElementById('fmMenuCode').value = 'MN-NEW-' + Math.floor(10 + Math.random() * 90);
    document.getElementById('fmMenuCode').readOnly = false;
    document.getElementById('fmMenuName').value = '';
    document.getElementById('fmMenuPrice').value = '45000';
    document.getElementById('fmMenuCost').value = '15000';
    document.getElementById('fmMenuPromo').value = 'Không';
    document.getElementById('fmMenuNotes').value = '';
    showBsModal('menuItemModal');
  }

  function editMenuItem(code) {
    const item = (appData.menuItems || []).find(m => m.code === code);
    if (!item) return;
    document.getElementById('menuItemModalTitle').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Cập Nhật Món: ' + item.code;
    document.getElementById('fmMenuCode').value = item.code;
    document.getElementById('fmMenuCode').readOnly = true;
    document.getElementById('fmMenuCategory').value = item.category;
    document.getElementById('fmMenuName').value = item.name;
    document.getElementById('fmMenuUnit').value = item.unit;
    document.getElementById('fmMenuPrice').value = item.price;
    document.getElementById('fmMenuCost').value = item.costPrice;
    document.getElementById('fmMenuPromo').value = item.promo;
    document.getElementById('fmMenuKitchen').value = item.kitchenStation;
    document.getElementById('fmMenuNotes').value = item.notes || '';
    showBsModal('menuItemModal');
  }

  function submitMenuItemForm() {
    const code = document.getElementById('fmMenuCode').value.trim().toUpperCase();
    const name = document.getElementById('fmMenuName').value.trim();
    if (!code || !name) {
      alert('Vui lòng nhập Mã món và Tên món!');
      return;
    }
    const payload = {
      code,
      name,
      category: document.getElementById('fmMenuCategory').value,
      unit: document.getElementById('fmMenuUnit').value.trim() || 'Phần',
      price: Number(document.getElementById('fmMenuPrice').value) || 0,
      costPrice: Number(document.getElementById('fmMenuCost').value) || 0,
      promo: document.getElementById('fmMenuPromo').value,
      kitchenStation: document.getElementById('fmMenuKitchen').value,
      status: 'Còn hàng',
      notes: document.getElementById('fmMenuNotes').value.trim(),
      username: currentUser ? currentUser.username : 'admin',
      actorName: currentUser ? currentUser.fullName : 'Admin'
    };

    const idx = (appData.menuItems || []).findIndex(m => m.code === code);
    if (idx >= 0) appData.menuItems[idx] = payload;
    else appData.menuItems.unshift(payload);

    hideBsModal('menuItemModal');
    renderMenuTableView();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.saveMenuItem(payload);
    }
  }

  function openUserModal(editUsername) {
    if (editUsername) {
      const existing = (appData.users || []).find(u => u.username === editUsername);
      if (existing) {
        document.getElementById('userModalTitle').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Cập Nhật Tài Khoản: ' + existing.username;
        document.getElementById('ufUsername').value = existing.username;
        document.getElementById('ufUsername').readOnly = true;
        document.getElementById('ufPassword').value = existing.password || '123456';
        document.getElementById('ufFullName').value = existing.fullName || '';
        document.getElementById('ufRole').value = existing.role || 'STAFF';
        document.getElementById('ufZone').value = existing.assignedZone || 'ALL';
      }
    } else {
      document.getElementById('userModalTitle').innerHTML = '<i class="bi bi-person-plus-fill me-2"></i>Tạo Tài Khoản Nhân Viên POS';
      document.getElementById('ufUsername').value = '';
      document.getElementById('ufUsername').readOnly = false;
      document.getElementById('ufPassword').value = '123456';
      document.getElementById('ufFullName').value = '';
      document.getElementById('ufRole').value = 'STAFF';
      document.getElementById('ufZone').value = 'Tầng 1 — Cafe & Sân Vườn';
    }
    showBsModal('userModal');
  }

  function editUser(username) {
    openUserModal(username);
  }

  function submitUserAccountForm() {
    const uname = document.getElementById('ufUsername').value.trim().toLowerCase();
    const pass = document.getElementById('ufPassword').value.trim() || '123456';
    const fullName = document.getElementById('ufFullName').value.trim();
    if (!uname || !fullName) {
      alert('Vui lòng nhập Username và Họ tên!');
      return;
    }
    const payload = {
      username: uname,
      password: pass,
      fullName: fullName,
      role: document.getElementById('ufRole').value,
      assignedZone: document.getElementById('ufZone').value,
      status: 'Hoạt động',
      actorUsername: currentUser ? currentUser.username : 'admin',
      actorName: currentUser ? currentUser.fullName : 'Admin'
    };

    const idx = (appData.users || []).findIndex(u => u.username === uname);
    if (idx >= 0) appData.users[idx] = payload;
    else appData.users.push(payload);

    hideBsModal('userModal');
    renderRbacView();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.saveUserAccount(payload);
    }
  }

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

  function exportMenuCsv() {
    const rows = [['Mã Món', 'Tên Món', 'Danh Mục', 'ĐVT', 'Giá Bán', 'Giá Vốn', 'Khuyến Mãi', 'Khu Chế Biến', 'Trạng Thái']];
    (appData.menuItems || []).forEach(m => {
      rows.push([m.code, m.name, m.category, m.unit, m.price, m.costPrice, m.promo, m.kitchenStation, m.status]);
    });
    downloadCsvUtf8('Thuc_Don_Nha_Hang_GS005.csv', rows);
  }

  function exportInvoicesCsv() {
    const rows = [['Số HĐ', 'Thời Gian', 'Bàn', 'NV Order', 'Thu Ngân', 'Khách Hàng', 'Hạng VIP', 'Tiền Món', 'Tiền Giờ', 'Giảm Giá', 'Tổng Tiền', 'Hình Thức']];
    (appData.invoices || []).forEach(i => {
      rows.push([i.code, i.date, i.tableName, i.waiter || '', i.cashier, i.customer, i.vipTier, i.dishAmount, i.hourAmount, i.discount, i.totalAmount, i.paymentMethod]);
    });
    downloadCsvUtf8('Nhat_Ky_Hoa_Don_GS005.csv', rows);
  }

  function loadData() {
    const badge = document.getElementById('connBadge');
    const authStatus = document.getElementById('authSyncStatus');
    if (badge) badge.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Đang đồng bộ...';

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      let settled = false;
      const timer = setTimeout(function() {
        if (!settled) {
          if (badge) badge.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Dữ liệu POS Sẵn Sàng';
          if (authStatus) {
            authStatus.className = 'badge bg-success-subtle text-success border border-success-subtle';
            authStatus.innerHTML = '<i class="bi bi-shield-check me-1"></i> Sẵn sàng đăng nhập (' + (appData.users ? appData.users.length : 5) + ' tài khoản • ' + (appData.tables ? appData.tables.length : 10) + ' bàn)';
          }
        }
      }, 2000);

      google.script.run
        .withSuccessHandler(function(res) {
          settled = true;
          clearTimeout(timer);
          if (res && res.success) {
            appData.settings = Object.assign({}, FALLBACK_DATA.settings, res.settings || {});
            appData.users = (res.users && res.users.length > 0) ? res.users : JSON.parse(JSON.stringify(FALLBACK_DATA.users));
            appData.menuItems = (res.menuItems && res.menuItems.length > 0) ? res.menuItems : JSON.parse(JSON.stringify(FALLBACK_DATA.menuItems));
            appData.invoices = (res.invoices && res.invoices.length > 0) ? res.invoices : JSON.parse(JSON.stringify(FALLBACK_DATA.invoices));
            appData.vipMembers = (res.vipMembers && res.vipMembers.length > 0) ? res.vipMembers : JSON.parse(JSON.stringify(FALLBACK_DATA.vipMembers));
            appData.kitchenTickets = (res.kitchenTickets && res.kitchenTickets.length > 0) ? res.kitchenTickets : JSON.parse(JSON.stringify(FALLBACK_DATA.kitchenTickets));
            kitchenTickets = appData.kitchenTickets;
            appData.auditLogs = (res.auditLogs && res.auditLogs.length > 0) ? res.auditLogs : JSON.parse(JSON.stringify(FALLBACK_DATA.auditLogs));

            if (res.tables && res.tables.length > 0) {
              appData.tables = res.tables.map(t => {
                const fbT = FALLBACK_DATA.tables.find(ft => ft.code === t.code);
                return {
                  ...t,
                  minutesPlayed: t.minutesPlayed || (fbT ? fbT.minutesPlayed : 90),
                  cartItems: (t.status !== 'Trống' && fbT && fbT.cartItems) ? JSON.parse(JSON.stringify(fbT.cartItems)) : []
                };
              });
            } else {
              appData.tables = JSON.parse(JSON.stringify(FALLBACK_DATA.tables));
            }

            if (badge) {
              badge.innerHTML = res.isFallback
                ? '<i class="bi bi-lightning-charge-fill me-1"></i> Dữ liệu POS Chuẩn'
                : '<i class="bi bi-cloud-check-fill me-1"></i> Đồng bộ Google Sheets';
            }
            if (authStatus) {
              authStatus.className = 'badge bg-success-subtle text-success border border-success-subtle';
              authStatus.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Đã kết nối Sheet (' + appData.users.length + ' TK • ' + appData.tables.length + ' bàn • ' + appData.menuItems.length + ' món)';
            }
          }
          if (appData.settings && appData.settings.STORE_NAME) {
            document.getElementById('topbarStoreTitle').innerText = appData.settings.STORE_NAME;
          }
          refreshAllPosViews();
        })
        .withFailureHandler(function() {
          settled = true;
          clearTimeout(timer);
          if (badge) badge.innerHTML = '<i class="bi bi-lightning-charge-fill me-1"></i> Chế độ POS Độc Lập';
          refreshAllPosViews();
        })
        .getPosData();
    } else {
      if (badge) badge.innerHTML = '<i class="bi bi-laptop me-1"></i> Chế độ Standalone Pro';
      refreshAllPosViews();
    }
  }

  function bootPosApp() {
    if (hasBooted) return;
    hasBooted = true;
    try {
      refreshAllPosViews();
    } catch (e) {}
    loadData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPosApp);
  } else {
    bootPosApp();
  }
  window.addEventListener('load', bootPosApp);
</script>
</body>
</html>


```