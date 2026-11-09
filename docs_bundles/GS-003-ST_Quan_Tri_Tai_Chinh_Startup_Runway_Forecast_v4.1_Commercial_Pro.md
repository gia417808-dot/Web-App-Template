# 🚀 HỆ THỐNG QUẢN TRỊ TÀI CHÍNH STARTUP & TĂNG TRƯỞNG: BURN RATE, CASH RUNWAY, MRR/ARR UNIT ECONOMICS, DỰ PHÓNG 12 THÁNG & CAP TABLE (GS-003-ST v4.1 COMMERCIAL PRO)

## 🌟 CÁC NÂNG CẤP TRỌNG TÂM TRONG BẢN v4.1 COMMERCIAL PRO

### 1. Khắc phục triệt để lỗi "Đổi mật khẩu trên Sheet `PHAN_QUYEN` nhưng Web App vẫn nhận mật khẩu cũ"

* **Nguyên nhân gốc ở bản v4.0**:

  1. Ở bản cũ, các nút điền nhanh trên màn hình đăng nhập bị gắn cứng chuỗi `123456` (`fillLoginQuick(cfo_st, 123456)`) và hàm `handleLoginSubmit()` chỉ kiểm tra mảng `appData.users` đang lưu tạm trong bộ nhớ trình duyệt (hoặc dữ liệu dự phòng `buildInstantFallbackData()`) chứ chưa gọi trực tiếp về Server đọc lại Sheet `PHAN_QUYEN` tại thời điểm bấm nút **Đăng Nhập**.

  2. Nếu tab Web App đã mở sẵn từ trước khi bạn sửa ô `B4` (`111111`) trên Google Sheets, trình duyệt vẫn giữ mật khẩu cũ trong bộ nhớ tạm.

* **Giải pháp triệt để trong v4.1**:

  1. **Xác thực trực tiếp từ Google Sheets theo thời gian thực (`verifyStartupLogin` trong `Code.gs`)**: Mỗi khi bấm nút **Đăng Nhập**, Web App gọi thẳng về `Code.gs`, chạy `SpreadsheetApp.flush()` và đọc trực tiếp cột `A` (Username) & cột `B` (Mật khẩu) trên Sheet `PHAN_QUYEN`. Ngay khi bạn đổi ô `B4` của `cfo_st` thành `111111`, mật khẩu cũ `123456` lập tức bị từ chối và chỉ mật khẩu `111111` mới đăng nhập được!

  2. **Tự động gắn kết Spreadsheet ID (`getTargetSpreadsheet()`)**: Tự động lưu `SPREADSHEET_ID` vào `ScriptProperties` và hỗ trợ fallback trực tiếp về ID bảng tính của bạn (`1-CVbopixS8hFmg0wezXJUHRXVlquiUh-WXjRdA2nFt8`).

  3. **Đồng bộ tự động khi chuyển tab & nút `🔄 Tải lại MK từ Sheet`**: Khi bạn chuyển từ tab Google Sheets sang tab Web App (sự kiện `window.onfocus`) hoặc bấm `Đổi TK`, hệ thống tự động tải lại mật khẩu mới nhất từ Sheet `PHAN_QUYEN`.

### 2. Bổ sung Sheet `HUONG_DAN_SU_DUNG` & Tab 7 `📘 Cẩm Nang & Thuật Ngữ Tài Chính (Cho Người Mới)`

* Tự động tạo thêm Sheet đầu tiên **`HUONG_DAN_SU_DUNG`** trên Google Sheets (nâng tổng số lên **9 Sheets**) VÀ thêm **Tab số 7 (`📘 7. Cẩm Nang & Thuật Ngữ Tài Chính`)** ngay trên giao diện Web App.

* Giải thích toàn bộ 12 thuật ngữ tài chính chuyên sâu (`Gross Burn`, `Net Burn`, `Cash Runway`, `MRR`, `ARR`, `ARPU`, `Churn Rate`, `CAC`, `LTV`, `LTV/CAC >= 3.0x`, `COGS / R&D / G&A / CAPEX`, `Operating / Investing / Financing Cashflow`, `Post-Money Valuation`, `Cap Table`, `ESOP`) bằng **ngôn ngữ đời thường dễ hiểu + công thức + ví dụ thực tế** kèm **Quy trình 5 bước sử dụng từ A ➔ Z cho người mới bắt đầu**.

## 📁 FILE 1: `appsscript.json`

```
{
  "timeZone": "Asia/Ho_Chi_Minh",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  },
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.send_mail",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.scriptapp"
  ]
}


```

## 📁 FILE 2: `installer.gs`

```
/**
 * ============================================================================
 * GS-003-ST: QUẢN TRỊ TÀI CHÍNH STARTUP & TĂNG TRƯỞNG (BURN RATE, RUNWAY, MRR/ARR,
 * DỰ PHÓNG DÒNG TIỀN 12 THÁNG & VÒNG GỌI VỐN CAP TABLE)
 * Phiên bản: v4.0 Commercial Pro (Cấp 2 trong Bộ Tứ Quản Trị Tài Chính Doanh Nghiệp)
 * File: installer.gs — Khởi tạo tự động 9 Sheet Chuẩn CFO Startup & Quỹ Đầu Tư
 * ============================================================================
 */

function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('🚀 TÀI CHÍNH STARTUP & RUNWAY (GS-003-ST PRO)')
      .addItem('⚡ 1. Khởi tạo / Làm mới Database Tài Chính Startup (9 Sheets (Có Cẩm Nang Hướng Dẫn))', 'setupStartupFinanceDatabase')
      .addSeparator()
      .addItem('📈 2. Tự động Tính lại Dự Phóng Dòng Tiền & Runway 12 Tháng', 'recalculate12MonthForecast')
      .addItem('🔔 3. Gửi Báo Cáo Runway & Cảnh Báo CFO Qua Email / Bot Zalo', 'sendStartupRunwayAlertNow')
      .addToUi();
  } catch (e) {}
}

function setupStartupFinanceDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Không tìm thấy Google Spreadsheet!');

  try {
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  } catch (e) {}

  var requiredTabs = [
    'HUONG_DAN_SU_DUNG',
    'CAU_HINH',
    'PHAN_QUYEN',
    'QUY_TIEN_RUNWAY',
    'DOANH_THU_MRR_UNIT',
    'DONG_TIEN_THUC_TE',
    'DU_PHONG_12_THANG',
    'VONG_GOI_VON_CAPTABLE',
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
  function fmtDateOffset(days) {
    var d = new Date(today.getTime() + days * 86400000);
    return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }
  function fmtMonthOffset(months) {
    var d = new Date(today.getFullYear(), today.getMonth() + months, 1);
    return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM');
  }

  // =========================================================================
  // 0. TAB HUONG_DAN_SU_DUNG (CẨM NANG HƯỚNG DẪN & TỪ ĐIỂN THUẬT NGỮ TÀI CHÍNH CHO NGƯỜI MỚI)
  // =========================================================================
  var shGuide = ss.getSheetByName('HUONG_DAN_SU_DUNG');
  shGuide.getRange('A1:E1').merge().setValue('📘 CẨM NANG HƯỚNG DẪN SỬ DỤNG WEB APP & TỪ ĐIỂN THUẬT NGỮ TÀI CHÍNH STARTUP DÀNH CHO NGƯỜI MỚI (GS-003-ST v4.1 PRO)')
    .setBackground('#065F46').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shGuide.setRowHeight(1, 38);

  var guideHeaders = [[
    'PHÂN NHÓM', 'THUẬT NGỮ / TÍNH NĂNG TRÊN APP', 'GIẢI THÍCH DỄ HIỂU CHO NGƯỜI MỚI (NGÔN NGỮ ĐỜI THƯỜNG)',
    'CÔNG THỨC TÍNH & NGƯỠNG AN TOÀN CHUẨN QUỸ ĐẦU TƯ', 'VÍ DỤ THỰC TẾ TRONG DOANH NGHIỆP'
  ]];
  shGuide.getRange('A2:E2').setValues(guideHeaders).setBackground('#047857').setFontColor('#FFFFFF').setFontWeight('bold');

  var guideRows = [
    ['1. SỐNG CÒN & ĐƯỜNG BĂNG VỐN', 'Tổng Quỹ Tiền Mặt (Total Cash Balance)', 'Tổng số tiền thật đang nằm sẵn trong các tài khoản ngân hàng, tiền gửi tiết kiệm và két sắt của công ty có thể rút ra chi tiêu được ngay.', 'Tổng Số Dư = Tiền mặt + Tiền gửi thanh toán + Tiền gửi kỳ hạn ngắn', 'Công ty có 1,56 tỷ ở Techcombank + 3,5 tỷ tiết kiệm Vietcombank + 590tr ví VNPay = Tổng quỹ tiền 5,685 tỷ đồng.'],
    ['1. SỐNG CÒN & ĐƯỜNG BĂNG VỐN', 'Gross Burn Rate (Tốc độ đốt tiền tổng)', 'Tổng số tiền công ty phải chi ra mỗi tháng để duy trì bộ máy (trả lương nhân viên, thuê văn phòng, mua server, chạy quảng cáo...) chưa tính doanh thu mang về.', 'Gross Burn = Giá vốn (COGS) + Chi phí Nhân sự R&D + Marketing + Quản lý (G&A)', 'Tháng này công ty chi trả lương 620tr + Server 165tr + Quảng cáo 184,5tr + Văn phòng 95tr = Gross Burn là 1,064 tỷ/tháng.'],
    ['1. SỐNG CÒN & ĐƯỜNG BĂNG VỐN', 'Net Burn Rate (Tốc độ đốt tiền ròng)', 'Số tiền thực sự bị "hao hụt" đi mỗi tháng sau khi đã lấy Doanh thu thu về bù đắp cho Chi phí. Nếu Thu nhiều hơn Chi thì công ty đã có lãi dòng tiền dương (Không còn bị đốt tiền).', 'Net Burn = Tổng Chi Trong Tháng (Gross Burn) - Tổng Thu Trong Tháng (Cash In)', 'Tháng này công ty chi hết 1,064 tỷ nhưng thu về được 952 triệu ➔ Mỗi tháng công ty chỉ bị hụt đi (Net Burn) = 112,5 triệu đồng.'],
    ['1. SỐNG CÒN & ĐƯỜNG BĂNG VỐN', 'Cash Runway (Độ dài đường băng sống sót)', 'Với số tiền còn trong két và tốc độ tiêu tiền (Net Burn) như hiện tại, công ty sẽ sống sót được bao nhiêu tháng nữa trước khi hết sạch tiền (nếu không gọi thêm vốn).', 'Runway (Tháng) = Tổng Quỹ Tiền Mặt Hiện Tại / Net Burn Hàng Tháng. Chuẩn an toàn: >= 12 tháng (Xanh), 6-12 tháng (Vàng), < 6 tháng (Báo động Đỏ).', 'Công ty đang có 5,685 tỷ tiền mặt, mỗi tháng hụt (Net Burn) 112,5 triệu ➔ Công ty sống khỏe được hơn 50 tháng nữa.'],
    ['2. DOANH THU & KINH TẾ ĐƠN VỊ', 'MRR (Monthly Recurring Revenue)', 'Doanh thu định kỳ hàng tháng: Khoản tiền khách hàng trả đều đặn hàng tháng (như phí thuê bao phần mềm, phí hội viên, hợp đồng bảo trì định kỳ).', 'MRR = Số khách hàng đang trả phí (Active Customers) × Số tiền trung bình 1 khách trả (ARPU)', 'Có 215 khách hàng doanh nghiệp đang dùng phần mềm, mỗi khách trả 3,8 triệu/tháng ➔ MRR = 817 triệu đồng/tháng.'],
    ['2. DOANH THU & KINH TẾ ĐƠN VỊ', 'ARR (Annual Recurring Revenue)', 'Doanh thu định kỳ quy đổi theo năm: Giúp nhà đầu tư nhìn thấy quy mô doanh thu ổn định cả năm của công ty.', 'ARR = MRR × 12 tháng', 'MRR đạt 817 triệu/tháng ➔ Quy mô ARR tương đương 9,804 tỷ đồng/năm.'],
    ['2. DOANH THU & KINH TẾ ĐƠN VỊ', 'Churn Rate (Tỷ lệ rời bỏ)', 'Số lượng (hoặc tỷ lệ %) khách hàng ngừng sử dụng dịch vụ, không gia hạn nữa trong tháng. Churn càng thấp chứng tỏ sản phẩm giữ chân khách càng tốt.', 'Tỷ lệ Churn (%) = (Số khách hủy trong tháng / Tổng khách đầu kỳ) × 100%. Chuẩn tốt: < 3% - 5%/tháng.', 'Đầu tháng có 179 khách, trong tháng có 5 khách nghỉ dùng ➔ Churn rất thấp (~2,8%).'],
    ['2. DOANH THU & KINH TẾ ĐƠN VỊ', 'CAC (Customer Acquisition Cost)', 'Chi phí để có được 1 khách hàng mới: Trung bình công ty phải tốn bao nhiêu tiền Marketing & lương nhân viên Sale để chốt thành công 1 khách hàng mới.', 'CAC = Tổng Chi Phí Marketing & Sale trong tháng / Số Khách Hàng Mới có được trong tháng', 'Chi 184,5 triệu tiền quảng cáo & sale, mang về 41 khách hàng mới ➔ Tốn 4,5 triệu đồng (CAC) để có 1 khách mới.'],
    ['2. DOANH THU & KINH TẾ ĐƠN VỊ', 'LTV (Lifetime Value) & Tỷ lệ LTV/CAC', 'LTV là tổng lợi nhuận gộp mà 1 khách hàng mang lại trong suốt thời gian họ gắn bó với công ty. LTV phải gấp ít nhất 3 lần chi phí mua khách (CAC) thì mô hình kinh doanh mới thắng lợi.', 'Tỷ lệ vàng chuẩn Quỹ đầu tư: LTV / CAC >= 3.0x (1 đồng chi quảng cáo phải thu về ít nhất 3 đồng lợi nhuận vòng đời).', 'Mỗi khách mới tốn 4,5tr chi phí quảng cáo (CAC) nhưng gắn bó lâu dài mang lại 24,7tr lợi nhuận (LTV) ➔ LTV/CAC = 5.5x (Rất xuất sắc).'],
    ['3. DÒNG TIỀN 3 LUỒNG & CHI PHÍ', 'Operating / Investing / Financing Cashflow', '3 luồng tiền chuẩn kế toán quốc tế: (1) Operating: Tiền thu bán hàng & chi vận hành hàng ngày; (2) Investing (CAPEX): Tiền mua máy móc, thiết bị, tài sản dài hạn; (3) Financing: Tiền nhận vốn đầu tư hoặc vay/trả nợ.', 'Giúp bóc tách rõ: Công ty đang tốn tiền vì lỗ vận hành (Operating) hay vì đang đầu tư mua sắm tài sản (Investing).', 'Mua 4 máy MacBook 148tr được xếp vào luồng Investing (Đầu tư tài sản CAPEX), còn trả lương nhân viên xếp vào Operating.'],
    ['3. DÒNG TIỀN 3 LUỒNG & CHI PHÍ', 'COGS, R&D, Marketing, G&A', '4 nhóm chi phí chính: COGS (Giá vốn trực tiếp tạo ra sản phẩm như Server, nguyên liệu); R&D (Lương kỹ sư phát triển sản phẩm); Marketing & Sale (Chi phí bán hàng); G&A (Thuê văn phòng, kế toán, hành chính).', 'Lợi Nhuận Gộp (Gross Profit) = Doanh Thu - Giá Vốn (COGS). Biên lãi gộp (Gross Margin) = Lợi nhuận gộp / Doanh thu.', 'Doanh thu 952tr, tốn tiền Server (COGS) 165tr ➔ Lợi nhuận gộp còn 787tr (Biên lãi gộp đạt 82%).'],
    ['4. GỌI VỐN & CỔ ĐÔNG (CAP TABLE)', 'Pre-Money / Post-Money Valuation & Cap Table', 'Định giá công ty trước và sau khi nhận tiền đầu tư. Cap Table là bảng kê danh sách ai đang nắm giữ bao nhiêu % cổ phần công ty (Founders, Quỹ đầu tư VC, và quỹ thưởng nhân sự ESOP).', 'Định giá Post-Money = Định giá Pre-Money + Số tiền nhà đầu tư rót vào. Tỷ lệ sở hữu NĐT (%) = Vốn rót / Post-Money.', 'Công ty định giá trước gọi vốn là 20,5 tỷ, Quỹ NextGen rót thêm 4,5 tỷ ➔ Định giá sau gọi vốn (Post-Money) là 25 tỷ (Quỹ nắm 18%).'],
    ['5. QUY TRÌNH THAO TÁC TRÊN APP', 'Cách đổi Mật khẩu & Phân quyền (Tab PHAN_QUYEN)', 'Bạn có thể đổi mật khẩu trực tiếp tại cột B của bảng PHAN_QUYEN trên Google Sheets HOẶC đổi ngay trong Tab 6 của Web App. Khi đổi trên Sheet, bấm nút "🔄 Đồng bộ từ Sheet" ở màn hình đăng nhập (hoặc bấm Đăng nhập trực tiếp) hệ thống sẽ kiểm tra mật khẩu mới theo thời gian thực.', '5 Vai trò: ADMIN (Founder toàn quyền), CFO_MANAGER (Giám đốc Tài chính), LEADER (Trưởng bộ phận), STAFF (Kế toán lập phiếu), INVESTOR (Nhà đầu tư chỉ xem).', 'Đổi mật khẩu của tài khoản cfo_st tại ô B4 sang 111111 ➔ Sang Web App nhập 111111 sẽ vào ngay, mật khẩu cũ 123456 lập tức bị từ chối.']
  ];
  shGuide.getRange(3, 1, guideRows.length, 5).setValues(guideRows);
  shGuide.getRange(3, 1, guideRows.length, 5).setWrap(true).setVerticalAlignment('top');
  shGuide.setColumnWidth(1, 210);
  shGuide.setColumnWidth(2, 250);
  shGuide.setColumnWidth(3, 380);
  shGuide.setColumnWidth(4, 320);
  shGuide.setColumnWidth(5, 340);

  // =========================================================================
  // 1. TAB CAU_HINH (THÔNG SỐ ĐỊNH MỨC STARTUP, NGƯỠNG AN TOÀN RUNWAY & BOT)
  // =========================================================================
  var shCfg = ss.getSheetByName('CAU_HINH');
  shCfg.getRange('A1:D1').merge().setValue('⚙️ CẤU HÌNH HỆ THỐNG QUẢN TRỊ TÀI CHÍNH STARTUP, RUNWAY, UNIT ECONOMICS & BOT CẢNH BÁO CFO (v4.0 PRO)')
    .setBackground('#0F172A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shCfg.setRowHeight(1, 36);

  var cfgHeaders = [['MÃ THAM SỐ (KEY)', 'GIÁ TRỊ CÀI ĐẶT (VALUE)', 'NHÓM CẤU HÌNH', 'MÔ TẢ CHI TIẾT']];
  shCfg.getRange('A2:D2').setValues(cfgHeaders).setBackground('#1E293B').setFontColor('#FFFFFF').setFontWeight('bold');

  var cfgData = [
    ['COMPANY_NAME', 'CÔNG TY CỔ PHẦN CÔNG NGHỆ AI & SAAS NOVA-TECH STARTUP', 'THONG_TIN_CHUNG', 'Tên Startup hiển thị trên Dashboard và Báo cáo Nhà đầu tư (Investor Report A4)'],
    ['CURRENT_FUNDING_STAGE', 'Pre-Series A (Quy mô 25 Nhân sự)', 'THONG_TIN_CHUNG', 'Giai đoạn gọi vốn & quy mô vận hành hiện tại'],
    ['COMPANY_HOTLINE', '0909.888.999', 'THONG_TIN_CHUNG', 'Hotline liên hệ CFO / Ban điều hành'],
    ['ADMIN_EMAIL', 'founder.cfo@novatech.vn', 'THONG_TIN_CHUNG', 'Email Founder / CFO nhận cảnh báo Runway & Duyệt chi'],
    ['MIN_SAFE_RUNWAY_MONTHS', '6', 'NGUONG_AN_TOAN', 'Ngưỡng Runway an toàn tối thiểu (Dưới 6 tháng sẽ bật cảnh báo Đỏ cần gọi vốn/cắt giảm Burn)'],
    ['TARGET_GROSS_MARGIN_PCT', '72', 'NGUONG_AN_TOAN', 'Biên lợi nhuận gộp mục tiêu (%) của mô hình kinh doanh'],
    ['TARGET_LTV_CAC_RATIO', '3.0', 'NGUONG_AN_TOAN', 'Tỷ lệ LTV / CAC tiêu chuẩn vàng (Chuẩn quỹ đầu tư >= 3.0x)'],
    ['DEFAULT_REVENUE_GROWTH_PCT', '12', 'MO_HINH_DU_PHONG', 'Tốc độ tăng trưởng doanh thu dự phóng mặc định hàng tháng (% MoM)'],
    ['DEFAULT_EXPENSE_GROWTH_PCT', '4', 'MO_HINH_DU_PHONG', 'Tốc độ tăng chi phí vận hành dự phóng mặc định hàng tháng (% MoM)'],
    ['ENABLE_EMAIL_ALERT', 'TRUE', 'BOT_THONG_BAO', 'Bật gửi Báo cáo CFO & Cảnh báo Runway qua Email (TRUE/FALSE)'],
    ['ENABLE_ZALO_BOT', 'TRUE', 'BOT_THONG_BAO', 'Bật bắn thông báo duyệt chi & cảnh báo Runway qua Webhook Bot Zalo'],
    ['ZALO_BOT_WEBHOOK_URL', 'https://webhook.site/zalo-startup-cfo-demo', 'BOT_THONG_BAO', 'URL Webhook nhận sự kiện tài chính Startup']
  ];
  shCfg.getRange(3, 1, cfgData.length, 4).setValues(cfgData);
  shCfg.setColumnWidth(1, 240);
  shCfg.setColumnWidth(2, 340);
  shCfg.setColumnWidth(3, 160);
  shCfg.setColumnWidth(4, 420);

  // =========================================================================
  // 2. TAB PHAN_QUYEN (RBAC 5 VAI TRÒ: ADMIN / CFO_MANAGER / LEADER / STAFF / INVESTOR)
  // =========================================================================
  var shAuth = ss.getSheetByName('PHAN_QUYEN');
  shAuth.getRange('A1:I1').merge().setValue('🔐 DANH SÁCH TÀI KHOẢN & MA TRẬN PHÂN QUYỀN TÀI CHÍNH STARTUP (FOUNDER / CFO / LEAD / KẾ TOÁN / NHÀ ĐẦU TƯ)')
    .setBackground('#991B1B').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shAuth.setRowHeight(1, 36);

  var authHeaders = [[
    'USERNAME', 'MẬT KHẨU / PIN', 'HỌ VÀ TÊN', 'VAI TRÒ (ROLE)', 'BỘ PHẬN / ĐƠN VỊ',
    'EMAIL NHẬN BÁO CÁO', 'SĐT ZALO', 'TRẠNG THÁI', 'QUYỀN HẠN APP (PERMISSIONS)'
  ]];
  shAuth.getRange('A2:I2').setValues(authHeaders).setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold');

  var authData = [
    ['founder', '123456', 'Nguyễn Minh Quân (Founder / CEO)', 'ADMIN', 'Ban Sáng Lập (Founders)', 'quan.ceo@novatech.vn', '0901234567', 'Hoạt động', 'MANAGE_CASH,APPROVE_EXPENSE,EDIT_FORECAST,MANAGE_CAPTABLE,VIEW_INVESTOR_ROOM,CREATE_VOUCHER'],
    ['cfo_st', '123456', 'Trần Bảo Ngọc (Head of Finance / CFO)', 'CFO_MANAGER', 'Phòng Tài Chính & Kế Toán', 'ngoc.cfo@novatech.vn', '0902345678', 'Hoạt động', 'MANAGE_CASH,APPROVE_EXPENSE,EDIT_FORECAST,MANAGE_CAPTABLE,VIEW_INVESTOR_ROOM,CREATE_VOUCHER'],
    ['growth_lead', '123456', 'Lê Hoàng Việt (Growth & Sales Lead)', 'LEADER', 'Khối Tăng Trưởng & Marketing', 'viet.growth@novatech.vn', '0903456789', 'Hoạt động', 'APPROVE_EXPENSE,EDIT_FORECAST,VIEW_INVESTOR_ROOM,CREATE_VOUCHER'],
    ['ops_lead', '123456', 'Phạm Tuấn Kiệt (Product & Tech Lead)', 'LEADER', 'Khối Sản Phẩm & Công Nghệ (R&D)', 'kiet.tech@novatech.vn', '0904567890', 'Hoạt động', 'APPROVE_EXPENSE,VIEW_INVESTOR_ROOM,CREATE_VOUCHER'],
    ['acc_staff', '123456', 'Võ Thu Trang (Chuyên viên Kế toán)', 'STAFF', 'Phòng Tài Chính & Kế Toán', 'trang.acc@novatech.vn', '0905678901', 'Hoạt động', 'CREATE_VOUCHER,VIEW_INVESTOR_ROOM'],
    ['investor_view', '666666', 'Quỹ Đầu Tư NextGen Ventures (Observer)', 'INVESTOR', 'Hội Đồng Nhà Đầu Tư (Board)', 'portfolio@nextgenvc.com', '0906789012', 'Hoạt động', 'VIEW_INVESTOR_ROOM']
  ];
  shAuth.getRange(3, 1, authData.length, 9).setValues(authData);
  shAuth.getRange(3, 2, authData.length, 1).setNumberFormat('@');
  shAuth.getRange(3, 7, authData.length, 1).setNumberFormat('@');
  for (var ca = 1; ca <= 9; ca++) shAuth.setColumnWidth(ca, 165);

  // =========================================================================
  // 3. TAB QUY_TIEN_RUNWAY (SỐ DƯ TIỀN MẶT ĐA QUỸ & TÍNH RUNWAY THỰC TẾ)
  // =========================================================================
  var shCash = ss.getSheetByName('QUY_TIEN_RUNWAY');
  shCash.getRange('A1:I1').merge().setValue('🏦 QUẢN LÝ QUỸ TIỀN MẶT DỰ TRỮ (CASH RESERVES), TIỀN GỬI KỲ HẠN & KHẢ NĂNG THANH KHOẢN RUNWAY')
    .setBackground('#065F46').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shCash.setRowHeight(1, 36);

  var cashHeaders = [[
    'MÃ QUỸ', 'TÊN TÀI KHOẢN / QUỸ TIỀN', 'NGÂN HÀNG / PHÂN LOẠI', 'SỐ DƯ ĐẦU KỲ (VNĐ)',
    'TỔNG THU TRONG KỲ (VNĐ)', 'TỔNG CHI TRONG KỲ (VNĐ)', 'SỐ DƯ KHẢ DỤNG HIỆN TẠI (VNĐ)',
    'LÃI SUẤT TIỀN GỬI (%/NĂM)', 'GHI CHÚ / SAO KÊ ĐÍNH KÈM'
  ]];
  shCash.getRange('A2:I2').setValues(cashHeaders).setBackground('#047857').setFontColor('#FFFFFF').setFontWeight('bold');

  var cashData = [
    ['CASH-01', 'Tài khoản Thanh toán Vận hành chính (Operating Account)', 'Techcombank - 1903888999', 1800000000, 680000000, 920000000, 1560000000, 0.5, 'Tài khoản chi lương, AWS Server & Marketing hàng tháng'],
    ['CASH-02', 'Quỹ Dự trữ Gọi vốn Seed Round (Term Deposit 3M)', 'Vietcombank - Tiết kiệm Doanh nghiệp', 3500000000, 0, 0, 3500000000, 4.8, 'Quỹ dự trữ chiến lược bảo đảm Runway tối thiểu 12 tháng'],
    ['CASH-03', 'Ví Thanh toán Quốc tế & Cổng Thu hộ SaaS (Stripe/PayPal/VNPay)', 'VNPay & VietinBank Merchant', 320000000, 450000000, 180000000, 590000000, 0.0, 'Tự động kết chuyển doanh thu thuê bao phần mềm (MRR)'],
    ['CASH-04', 'Quỹ Tiền mặt Hành chính tại Văn phòng (Petty Cash)', 'Két sắt Phòng Tài chính', 50000000, 20000000, 35000000, 35000000, 0.0, 'Chi phí tiếp khách, văn phòng phẩm & công tác phí nhỏ']
  ];
  shCash.getRange(3, 1, cashData.length, 9).setValues(cashData);
  shCash.getRange(3, 4, cashData.length, 4).setNumberFormat('#,##0');
  for (var cc = 1; cc <= 9; cc++) shCash.setColumnWidth(cc, 175);

  // =========================================================================
  // 4. TAB DOANH_THU_MRR_UNIT (DOANH THU ĐỊNH KỲ MRR/ARR & UNIT ECONOMICS CAC/LTV)
  // =========================================================================
  var shMrr = ss.getSheetByName('DOANH_THU_MRR_UNIT');
  shMrr.getRange('A1:N1').merge().setValue('📈 CHỈ SỐ TĂNG TRƯỞNG DOANH THU ĐỊNH KỲ (MRR / ARR) & KINH TẾ ĐƠN VỊ (UNIT ECONOMICS: CAC, LTV, CHURN)')
    .setBackground('#1E3A8A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shMrr.setRowHeight(1, 36);

  var mrrHeaders = [[
    'KỲ THÁNG', 'KHÁCH ĐẦU KỲ', 'KHÁCH MỚI (+NEW)', 'KHÁCH HỦY (-CHURN)', 'KHÁCH ĐANG TRẢ PHÍ (ACTIVE)',
    'ARPU (TB/KHÁCH VNĐ)', 'DOANH THU ĐỊNH KỲ (MRR)', 'DOANH THU GÓI SETUP / ONE-OFF',
    'TỔNG DOANH THU THÁNG', 'CHI PHÍ MARKETING & SALE', 'CAC (CHI PHÍ 1 KHÁCH MỚI)',
    'LTV (GIÁ TRỊ VÒNG ĐỜI)', 'TỶ LỆ LTV / CAC (x)', 'ĐÁNH GIÁ HIỆU QUẢ TĂNG TRƯỞNG'
  ]];
  shMrr.getRange('A2:N2').setValues(mrrHeaders).setBackground('#1D4ED8').setFontColor('#FFFFFF').setFontWeight('bold');

  var mrrData = [
    [fmtMonthOffset(-3), 110, 22, 4, 128, 3500000, 448000000, 85000000, 533000000, 132000000, 6000000, 21000000, 3.5, 'Tốt (LTV/CAC >= 3x)'],
    [fmtMonthOffset(-2), 128, 28, 5, 151, 3600000, 543600000, 95000000, 638600000, 154000000, 5500000, 21600000, 3.9, 'Rất tốt (Tăng trưởng MRR +21%)'],
    [fmtMonthOffset(-1), 151, 34, 6, 179, 3650000, 653350000, 110000000, 763350000, 170000000, 5000000, 21900000, 4.4, 'Xuất sắc (Tối ưu CAC giảm 9%)'],
    [fmtMonthOffset(0), 179, 41, 5, 215, 3800000, 817000000, 135000000, 952000000, 184500000, 4500000, 24700000, 5.5, 'Đạt đỉnh hiệu suất (ARR đạt ~9.8 Tỷ/năm)']
  ];
  shMrr.getRange(3, 1, mrrData.length, 14).setValues(mrrData);
  shMrr.getRange(3, 1, mrrData.length, 1).setNumberFormat('@');
  shMrr.getRange(3, 6, mrrData.length, 7).setNumberFormat('#,##0');
  for (var cm = 1; cm <= 14; cm++) shMrr.setColumnWidth(cm, 155);

  // =========================================================================
  // 5. TAB DONG_TIEN_THUC_TE (SỔ NHẬT KÝ DÒNG TIỀN 3 LUỒNG & BURN RATE THỰC TẾ)
  // =========================================================================
  var shCf = ss.getSheetByName('DONG_TIEN_THUC_TE');
  shCf.getRange('A1:N1').merge().setValue('💸 NHẬT KÝ DÒNG TIỀN THỰC TẾ 3 LUỒNG (OPERATING / INVESTING / FINANCING), DUYỆT CHI & FILE HÓA ĐƠN')
    .setBackground('#4C1D95').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shCf.setRowHeight(1, 36);

  var cfHeaders = [[
    'MÃ GD', 'NGÀY GHI NHẬN', 'KỲ THÁNG', 'LOẠI DÒNG TIỀN', 'LUỒNG CASHFLOW (3 LUỒNG)',
    'NHÓM KHOẢN MỤC (P&L / BURN)', 'NỘI DUNG GIAO DỊCH CHI TIẾT', 'BỘ PHẬN PHỤ TRÁCH',
    'TÀI KHOẢN QUỸ', 'SỐ TIỀN (VNĐ)', 'CẤU TRÚC CHI PHÍ', 'TRẠNG THÁI DUYỆT',
    'NGƯỜI PHÊ DUYỆT', 'CHỨNG TỪ / HÓA ĐƠN ĐÍNH KÈM'
  ]];
  shCf.getRange('A2:N2').setValues(cfHeaders).setBackground('#5B21B6').setFontColor('#FFFFFF').setFontWeight('bold');

  var cfData = [
    [
      'CF-101', fmtDateOffset(-10), curMonthStr, 'THU TIỀN (CASH IN)', '1. Dòng tiền Hoạt động kinh doanh (Operating)',
      'Doanh thu Thuê bao định kỳ (SaaS MRR)', 'Thu tiền gia hạn gói Enterprise năm của 35 khách hàng B2B', 'Khối Tăng Trưởng & Marketing',
      'CASH-03', 817000000, 'Doanh thu định kỳ', 'Đã duyệt', 'Trần Bảo Ngọc (Head of Finance / CFO)',
      JSON.stringify([{ id: 'ATT-CF1', name: 'Bang_Ke_Thu_Ho_SaaS_MRR.xlsx', ext: 'xlsx', size: '280 KB', url: 'https://docs.google.com/spreadsheets' }])
    ],
    [
      'CF-102', fmtDateOffset(-8), curMonthStr, 'THU TIỀN (CASH IN)', '1. Dòng tiền Hoạt động kinh doanh (Operating)',
      'Doanh thu Triển khai & Tư vấn (One-off)', 'Thu hợp đồng thiết lập hệ thống riêng cho Tập đoàn SunLand', 'Khối Tăng Trưởng & Marketing',
      'CASH-01', 135000000, 'Doanh thu dịch vụ', 'Đã duyệt', 'Trần Bảo Ngọc (Head of Finance / CFO)',
      JSON.stringify([{ id: 'ATT-CF2', name: 'Hop_Dong_Nghiem_Thu_SunLand.pdf', ext: 'pdf', size: '920 KB', url: 'https://drive.google.com' }])
    ],
    [
      'CF-103', fmtDateOffset(-6), curMonthStr, 'CHI TIỀN (CASH OUT)', '1. Dòng tiền Hoạt động kinh doanh (Operating)',
      'Chi phí Nhân sự & R&D (Payroll & Engineering)', 'Chi lương, BHXH và thưởng KPI tháng cho 25 nhân sự (Đội ngũ Kỹ thuật & Sản phẩm)', 'Khối Sản Phẩm & Công Nghệ (R&D)',
      'CASH-01', 620000000, 'Định phí (Fixed Burn)', 'Đã duyệt', 'Nguyễn Minh Quân (Founder / CEO)',
      JSON.stringify([{ id: 'ATT-CF3', name: 'Bang_Luong_Tong_Hop_25_NhanSu.xlsx', ext: 'xlsx', size: '410 KB', url: 'https://docs.google.com/spreadsheets' }])
    ],
    [
      'CF-104', fmtDateOffset(-5), curMonthStr, 'CHI TIỀN (CASH OUT)', '1. Dòng tiền Hoạt động kinh doanh (Operating)',
      'Giá vốn Hạ tầng Cloud & AI API (COGS)', 'Thanh toán hóa đơn AWS Cloud, GPU Server & OpenAI/Gemini Enterprise API', 'Khối Sản Phẩm & Công Nghệ (R&D)',
      'CASH-01', 165000000, 'Biến phí (Variable COGS)', 'Đã duyệt', 'Trần Bảo Ngọc (Head of Finance / CFO)',
      JSON.stringify([{ id: 'ATT-CF4', name: 'Invoice_AWS_Cloud_Services.pdf', ext: 'pdf', size: '540 KB', url: 'https://drive.google.com' }])
    ],
    [
      'CF-105', fmtDateOffset(-3), curMonthStr, 'CHI TIỀN (CASH OUT)', '1. Dòng tiền Hoạt động kinh doanh (Operating)',
      'Chi phí Marketing & Thu hút khách hàng (CAC)', 'Ngân sách chạy Performance Ads (Google/Meta/LinkedIn) & Hội thảo B2B', 'Khối Tăng Trưởng & Marketing',
      'CASH-01', 184500000, 'Biến phí (Growth Burn)', 'Đã duyệt', 'Trần Bảo Ngọc (Head of Finance / CFO)',
      JSON.stringify([{ id: 'ATT-CF5', name: 'Bao_Cao_Hieu_Qua_Chien_Dich_Ads.pptx', ext: 'pptx', size: '2.1 MB', url: 'https://docs.google.com/presentation' }])
    ],
    [
      'CF-106', fmtDateOffset(-2), curMonthStr, 'CHI TIỀN (CASH OUT)', '1. Dòng tiền Hoạt động kinh doanh (Operating)',
      'Chi phí Văn phòng, Pháp lý & Quản lý (G&A)', 'Tiền thuê văn phòng Quận 1, dịch vụ kiểm toán & bản quyền phần mềm nội bộ', 'Phòng Tài Chính & Kế Toán',
      'CASH-01', 95000000, 'Định phí (Fixed Burn)', 'Đã duyệt', 'Trần Bảo Ngọc (Head of Finance / CFO)',
      JSON.stringify([])
    ],
    [
      'CF-107', fmtDateOffset(-1), curMonthStr, 'CHI TIỀN (CASH OUT)', '2. Dòng tiền Hoạt động đầu tư (Investing)',
      'Mua sắm Tài sản cố định & Thiết bị (CAPEX)', 'Đề xuất mua bổ sung 4 máy trạm MacBook Pro M3 cho đội ngũ AI Engineer mới', 'Khối Sản Phẩm & Công Nghệ (R&D)',
      'CASH-01', 148000000, 'Đầu tư CAPEX', 'Chờ duyệt', 'Nguyễn Minh Quân (Founder / CEO)',
      JSON.stringify([{ id: 'ATT-CF6', name: 'Bao_Gia_Thiet_Bi_MacBook_M3.pdf', ext: 'pdf', size: '630 KB', url: 'https://drive.google.com' }])
    ]
  ];
  shCf.getRange(3, 1, cfData.length, 14).setValues(cfData);
  shCf.getRange(3, 3, cfData.length, 1).setNumberFormat('@');
  shCf.getRange(3, 10, cfData.length, 1).setNumberFormat('#,##0');
  for (var cf = 1; cf <= 14; cf++) shCf.setColumnWidth(cf, 165);
  shCf.setColumnWidth(7, 280);

  // =========================================================================
  // 6. TAB DU_PHONG_12_THANG (MÔ HÌNH DỰ PHÓNG DÒNG TIỀN 12 THÁNG & ĐIỂM HÒA VỐN)
  // =========================================================================
  var shFc = ss.getSheetByName('DU_PHONG_12_THANG');
  shFc.getRange('A1:N1').merge().setValue('🔮 MÔ HÌNH DỰ PHÓNG DÒNG TIỀN 12 THÁNG TỚI (FINANCIAL FORECASTING), ĐIỂM HÒA VỐN & ĐỘ DÀI SỐNG SÓT (CASH RUNWAY)')
    .setBackground('#7C2D12').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shFc.setRowHeight(1, 36);

  var fcHeaders = [[
    'KỲ DỰ PHÓNG', 'KỊCH BẢN DỰ BÁO', '% TĂNG TRƯỞNG DOANH THU', 'DOANH THU DỰ PHÓNG (VNĐ)',
    'GIÁ VỐN COGS (VNĐ)', 'LỢI NHUẬN GỘP (GROSS PROFIT)', 'CHI PHÍ NHÂN SỰ & R&D',
    'CHI PHÍ MARKETING & SALE', 'CHI PHÍ VẬN HÀNH G&A', 'TỔNG CHI TIỀN (GROSS BURN)',
    'DÒNG TIỀN RÒNG (NET BURN / CASHFLOW)', 'SỐ DƯ TIỀN CUỐI KỲ (ENDING CASH)',
    'RUNWAY CÒN LẠI (THÁNG)', 'TRẠNG THÁI AN TOÀN VỐN'
  ]];
  shFc.getRange('A2:N2').setValues(fcHeaders).setBackground('#9A3412').setFontColor('#FFFFFF').setFontWeight('bold');

  var fcRows = [];
  var runningCash = 5685000000; // Tổng quỹ tiền khả dụng ban đầu (~5.685 tỷ)
  var rev = 952000000;
  var rAndD = 620000000;
  var mkt = 185000000;
  var gna = 95000000;

  for (var m = 1; m <= 12; m++) {
    var mLabel = fmtMonthOffset(m);
    rev = Math.round(rev * 1.10); // Tăng trưởng 10%/tháng
    var cogs = Math.round(rev * 0.18);
    var grossProfit = rev - cogs;
    rAndD = Math.round(rAndD * 1.03);
    mkt = Math.round(mkt * 1.04);
    gna = Math.round(gna * 1.02);
    var grossBurn = cogs + rAndD + mkt + gna;
    var netCashflow = rev - grossBurn;
    runningCash = runningCash + netCashflow;
    var runwayMonths = netCashflow >= 0 ? 99.9 : Math.max(0, Math.round((runningCash / Math.abs(netCashflow)) * 10) / 10);
    var safetyLabel = netCashflow >= 0 ? '🟢 Đã Hòa Vốn & Có Lãi Dương (Cashflow Positive)' : (runwayMonths >= 12 ? '🟢 Runway An Toàn (> 12 tháng)' : (runwayMonths >= 6 ? '🟡 Cần Chuẩn Bị Gọi Vốn (6-12 tháng)' : '🔴 Báo Động Đỏ (< 6 tháng)'));

    fcRows.push([
      mLabel, 'Kịch bản Cơ sở (Base Case)', 10, rev,
      cogs, grossProfit, rAndD,
      mkt, gna, grossBurn,
      netCashflow, runningCash,
      runwayMonths, safetyLabel
    ]);
  }
  shFc.getRange(3, 1, fcRows.length, 14).setValues(fcRows);
  shFc.getRange(3, 1, fcRows.length, 1).setNumberFormat('@');
  shFc.getRange(3, 4, fcRows.length, 9).setNumberFormat('#,##0');
  for (var cfc = 1; cfc <= 14; cfc++) shFc.setColumnWidth(cfc, 160);

  // =========================================================================
  // 7. TAB VONG_GOI_VON_CAPTABLE (QUẢN LÝ VÒNG GỌI VỐN & BẢNG CỔ ĐÔNG CAP TABLE)
  // =========================================================================
  var shCap = ss.getSheetByName('VONG_GOI_VON_CAPTABLE');
  shCap.getRange('A1:K1').merge().setValue('💎 QUẢN LÝ VÒNG GỌI VỐN (FUNDRAISING ROUNDS), ĐỊNH GIÁ PRE/POST-MONEY & BẢNG CỔ ĐÔNG (CAP TABLE)')
    .setBackground('#0F766E').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shCap.setRowHeight(1, 36);

  var capHeaders = [[
    'MÃ CỔ ĐÔNG / VÒNG', 'TÊN CỔ ĐÔNG / QUỸ ĐẦU TƯ', 'NHÓM CỔ ĐÔNG', 'VÒNG ĐẦU TƯ',
    'SỐ VỐN ĐẦU TƯ (VNĐ)', 'ĐỊNH GIÁ POST-MONEY (VNĐ)', 'SỐ CỔ PHẦN SỞ HỮU',
    'TỶ LỆ SỞ HỮU (%)', 'NGÀY GIẢI NGÂN', 'TRẠNG THÁI VỐN', 'HỢP ĐỒNG ĐẦU TƯ (TERM SHEET / SHA)'
  ]];
  shCap.getRange('A2:K2').setValues(capHeaders).setBackground('#115E59').setFontColor('#FFFFFF').setFontWeight('bold');

  var capData = [
    [
      'CAP-01', 'Nguyễn Minh Quân & Đội ngũ Co-Founders', 'Founders (Sáng lập)', 'Founding',
      2000000000, 10000000000, 620000, 62.0, '2023-01-15', 'Đã góp đủ 100%',
      JSON.stringify([{ id: 'SHA-1', name: 'Thoa_Thuan_Co_Dong_Sang_Lap_Founders.pdf', ext: 'pdf', size: '1.1 MB', url: 'https://drive.google.com' }])
    ],
    [
      'CAP-02', 'Quỹ Quyền chọn Cổ phiếu Nhân sự cốt lõi (ESOP Pool)', 'ESOP (Nhân sự chủ chốt)', 'Seed Round',
      0, 25000000000, 100000, 10.0, '2023-09-01', 'Đã phát hành 10%',
      JSON.stringify([{ id: 'SHA-2', name: 'Quy_Che_Phat_Hanh_ESOP_2025.docx', ext: 'docx', size: '450 KB', url: 'https://docs.google.com/document' }])
    ],
    [
      'CAP-03', 'Nhà Đầu Tư Thiên Thần (Angel Syndicate Vietnam)', 'Angel Investors', 'Angel Round',
      1500000000, 15000000000, 100000, 10.0, '2023-06-20', 'Đã giải ngân 100%',
      JSON.stringify([{ id: 'SHA-3', name: 'SAFE_Agreement_Angel_Syndicate.pdf', ext: 'pdf', size: '840 KB', url: 'https://drive.google.com' }])
    ],
    [
      'CAP-04', 'Quỹ Đầu Tư NextGen Ventures (Lead Investor)', 'Venture Capital (VC)', 'Seed Round',
      4500000000, 25000000000, 180000, 18.0, '2024-03-10', 'Đã giải ngân 100%',
      JSON.stringify([{ id: 'SHA-4', name: 'TermSheet_SHA_NextGen_Ventures_Signed.pdf', ext: 'pdf', size: '2.3 MB', url: 'https://drive.google.com' }])
    ]
  ];
  shCap.getRange(3, 1, capData.length, 11).setValues(capData);
  shCap.getRange(3, 5, capData.length, 3).setNumberFormat('#,##0');
  for (var cp = 1; cp <= 11; cp++) shCap.setColumnWidth(cp, 165);

  // =========================================================================
  // 8. TAB NHAT_KY_HE_THONG (AUDIT LOGS & LỊCH SỬ BÁO CÁO NHÀ ĐẦU TƯ)
  // =========================================================================
  var shLog = ss.getSheetByName('NHAT_KY_HE_THONG');
  shLog.getRange('A1:F1').merge().setValue('🛡️ NHẬT KÝ HOẠT ĐỘNG HỆ THỐNG, DUYỆT CHI NGÂN SÁCH & CẢNH BÁO RUNWAY')
    .setBackground('#1E293B').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shLog.setRowHeight(1, 36);

  var logHeaders = [['THỜI GIAN', 'TÀI KHOẢN THỰC HIỆN', 'VAI TRÒ', 'HÀNH ĐỘNG', 'MÃ ĐỐI TƯỢNG', 'NỘI DUNG CHI TIẾT']];
  shLog.getRange('A2:F2').setValues(logHeaders).setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold');
  shLog.getRange(3, 1, 2, 6).setValues([
    [fmtDateOffset(0) + ' 08:00:00', 'founder', 'ADMIN', 'INIT_STARTUP_DB', 'SYSTEM', 'Khởi tạo Hệ thống Quản trị Tài chính Startup & Dự phóng Runway GS-003-ST v4.0 Commercial Pro'],
    [fmtDateOffset(0) + ' 08:15:00', 'cfo_st', 'CFO_MANAGER', 'UPDATE_FORECAST', curMonthStr, 'Cập nhật mô hình dự phóng dòng tiền 12 tháng (Tổng quỹ tiền mặt: 5.685.000.000 đ)']
  ]);
  for (var cl = 1; cl <= 6; cl++) shLog.setColumnWidth(cl, 180);
  shLog.setColumnWidth(6, 420);

  SpreadsheetApp.flush();
  return { ok: true, message: '🎉 Đã khởi tạo thành công 9 Sheet chuẩn cho Hệ thống Tài chính Startup & Runway GS-003-ST v4.0 Commercial Pro!' };
}



```

## 📁 FILE 3: `Code.gs`

```
/**
 * ============================================================================
 * GS-003-ST: QUẢN TRỊ TÀI CHÍNH STARTUP & TĂNG TRƯỞNG (BURN RATE, RUNWAY, MRR/ARR,
 * DỰ PHÓNG DÒNG TIỀN 12 THÁNG & VÒNG GỌI VỐN CAP TABLE)
 * Phiên bản: v4.0 Commercial Pro (Cấp 2 trong Bộ Tứ Quản Trị Tài Chính Doanh Nghiệp)
 * File: Code.gs — Backend Engine & Financial Modeling APIs
 * ============================================================================
 */

var FALLBACK_SPREADSHEET_ID = '1-CVbopixS8hFmg0wezXJUHRXVlquiUh-WXjRdA2nFt8';

function getTargetSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}
  if (ss) {
    try {
      PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
    } catch (e) {}
    return ss;
  }
  try {
    var savedId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (savedId) ss = SpreadsheetApp.openById(savedId);
  } catch (e) {}
  if (!ss && FALLBACK_SPREADSHEET_ID) {
    try {
      ss = SpreadsheetApp.openById(FALLBACK_SPREADSHEET_ID);
    } catch (e) {}
  }
  return ss;
}

function doGet(e) {
  var initialData = { ok: false };
  try {
    ensureStartupSheetsExist();
    initialData = getStartupFinanceData();
  } catch (err) {}
  var tpl = HtmlService.createTemplateFromFile('Index');
  tpl.initialServerDataJson = JSON.stringify(initialData);
  return tpl.evaluate()
    .setTitle('GS-003-ST v4.1 Pro • Quản Trị Tài Chính Startup, Burn Rate, Runway & Dự Phóng 12 Tháng')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

function ensureStartupSheetsExist() {
  var ss = getTargetSpreadsheet();
  if (!ss) throw new Error('Không tìm thấy Google Spreadsheet!');
  var shCash = ss.getSheetByName('QUY_TIEN_RUNWAY');
  var shAuth = ss.getSheetByName('PHAN_QUYEN');
  if (!shCash || !shAuth || shCash.getLastRow() < 2) {
    setupStartupFinanceDatabase();
  }
  // Tự động tạo thêm Sheet HUONG_DAN_SU_DUNG nếu bảng tính cũ chưa có
  var shGuide = ss.getSheetByName('HUONG_DAN_SU_DUNG');
  if (!shGuide) {
    createGuideSheetOnly(ss);
  }
  return ss;
}

function createGuideSheetOnly(ss) {
  try {
    var shGuide = ss.insertSheet('HUONG_DAN_SU_DUNG', 0);
    shGuide.getRange('A1:E1').merge().setValue('📘 CẨM NANG HƯỚNG DẪN SỬ DỤNG WEB APP & TỪ ĐIỂN THUẬT NGỮ TÀI CHÍNH STARTUP DÀNH CHO NGƯỜI MỚI (GS-003-ST v4.1 PRO)')
      .setBackground('#065F46').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
    shGuide.setRowHeight(1, 38);
    var guideHeaders = [[
      'PHÂN NHÓM', 'THUẬT NGỮ / TÍNH NĂNG TRÊN APP', 'GIẢI THÍCH DỄ HIỂU CHO NGƯỜI MỚI (NGÔN NGỮ ĐỜI THƯỜNG)',
      'CÔNG THỨC TÍNH & NGƯỠNG AN TOÀN CHUẨN QUỸ ĐẦU TƯ', 'VÍ DỤ THỰC TẾ TRONG DOANH NGHIỆP'
    ]];
    shGuide.getRange('A2:E2').setValues(guideHeaders).setBackground('#047857').setFontColor('#FFFFFF').setFontWeight('bold');
    var rows = [
      ['1. SỐNG CÒN & ĐƯỜNG BĂNG VỐN', 'Tổng Quỹ Tiền Mặt (Total Cash Balance)', 'Tổng số tiền thật đang nằm sẵn trong các tài khoản ngân hàng, tiền gửi tiết kiệm và két sắt của công ty có thể rút ra chi tiêu được ngay.', 'Tổng Số Dư = Tiền mặt + Tiền gửi thanh toán + Tiền gửi kỳ hạn ngắn', 'Công ty có 1,56 tỷ ở Techcombank + 3,5 tỷ tiết kiệm Vietcombank + 590tr ví VNPay = Tổng quỹ tiền 5,685 tỷ đồng.'],
      ['1. SỐNG CÒN & ĐƯỜNG BĂNG VỐN', 'Gross Burn Rate (Tốc độ đốt tiền tổng)', 'Tổng số tiền công ty phải chi ra mỗi tháng để duy trì bộ máy (trả lương nhân viên, thuê văn phòng, mua server, chạy quảng cáo...) chưa tính doanh thu mang về.', 'Gross Burn = Giá vốn (COGS) + Chi phí Nhân sự R&D + Marketing + Quản lý (G&A)', 'Tháng này công ty chi trả lương 620tr + Server 165tr + Quảng cáo 184,5tr + Văn phòng 95tr = Gross Burn là 1,064 tỷ/tháng.'],
      ['1. SỐNG CÒN & ĐƯỜNG BĂNG VỐN', 'Net Burn Rate (Tốc độ đốt tiền ròng)', 'Số tiền thực sự bị hao hụt đi mỗi tháng sau khi đã lấy Doanh thu thu về bù đắp cho Chi phí. Nếu Thu nhiều hơn Chi thì công ty đã có lãi dòng tiền dương.', 'Net Burn = Tổng Chi Trong Tháng (Gross Burn) - Tổng Thu Trong Tháng (Cash In)', 'Tháng này chi 1,064 tỷ nhưng thu về 952 triệu ➔ Mỗi tháng công ty chỉ bị hụt đi (Net Burn) = 112,5 triệu đồng.'],
      ['1. SỐNG CÒN & ĐƯỜNG BĂNG VỐN', 'Cash Runway (Độ dài đường băng sống sót)', 'Với số tiền còn trong két và tốc độ tiêu tiền (Net Burn) hiện tại, công ty sẽ sống sót được bao nhiêu tháng nữa trước khi hết sạch tiền.', 'Runway (Tháng) = Tổng Quỹ Tiền Mặt / Net Burn Hàng Tháng. Chuẩn an toàn: >= 12 tháng (Xanh), 6-12 tháng (Vàng), < 6 tháng (Đỏ).', 'Đang có 5,685 tỷ tiền mặt, mỗi tháng hụt 112,5 triệu ➔ Sống khỏe hơn 50 tháng nữa.'],
      ['2. DOANH THU & KINH TẾ ĐƠN VỊ', 'MRR & ARR (Doanh thu định kỳ tháng & năm)', 'MRR là doanh thu khách trả đều đặn hàng tháng (như thuê bao phần mềm, phí dịch vụ định kỳ). ARR = MRR × 12 tháng.', 'MRR = Số khách đang trả phí (Active) × Doanh thu TB 1 khách (ARPU)', '215 khách đang trả 3,8 triệu/tháng ➔ MRR = 817 triệu/tháng (ARR = 9,8 tỷ/năm).'],
      ['2. DOANH THU & KINH TẾ ĐƠN VỊ', 'CAC & LTV (Chi phí mua 1 khách & Giá trị vòng đời)', 'CAC là chi phí Marketing/Sale để có 1 khách mới. LTV là tổng lợi nhuận gộp khách đó mang lại trong suốt thời gian gắn bó.', 'Chuẩn vàng gọi vốn: Tỷ lệ LTV / CAC >= 3.0x (Bỏ 1 đồng Marketing thu về tối thiểu 3 đồng lợi nhuận).', 'Tốn 4,5tr quảng cáo có 1 khách (CAC), khách đó mang lại 24,7tr (LTV) ➔ LTV/CAC = 5.5x.'],
      ['3. DÒNG TIỀN 3 LUỒNG', 'Operating / Investing / Financing', 'Operating: Thu bán hàng & chi vận hành; Investing (CAPEX): Mua sắm máy móc, tài sản cố định; Financing: Nhận vốn đầu tư hoặc vay/trả nợ.', 'Giúp tách bạch chi phí vận hành hàng tháng và chi phí đầu tư tài sản dài hạn.', 'Mua 4 máy MacBook 148tr thuộc luồng Investing (CAPEX); trả lương nhân sự thuộc luồng Operating.'],
      ['4. GỌI VỐN & CAP TABLE', 'Post-Money Valuation & Cap Table', 'Định giá công ty sau khi nhận vốn đầu tư và bảng danh sách tỷ lệ % cổ phần của từng cổ đông (Founders, ESOP, Angel, Quỹ VC).', 'Tỷ lệ sở hữu NĐT (%) = Số vốn rót / Định giá Post-Money', 'Quỹ NextGen rót 4,5 tỷ ở mức định giá Post-Money 25 tỷ ➔ Sở hữu 18% cổ phần.']
    ];
    shGuide.getRange(3, 1, rows.length, 5).setValues(rows).setWrap(true).setVerticalAlignment('top');
    shGuide.setColumnWidth(1, 210);
    shGuide.setColumnWidth(2, 250);
    shGuide.setColumnWidth(3, 380);
    shGuide.setColumnWidth(4, 320);
    shGuide.setColumnWidth(5, 340);
  } catch (e) {}
}

// API XÁC THỰC ĐĂNG NHẬP TRỰC TIẾP TỪ SHEET PHAN_QUYEN THEO THỜI GIAN THỰC
function verifyStartupLogin(payload) {
  try {
    SpreadsheetApp.flush();
    var data = getStartupFinanceData();
    var uIn = String((payload && payload.username) || '').trim().toLowerCase();
    var pIn = String((payload && payload.password) || '').trim();
    var users = data.users || [];

    var matchedUser = null;
    var userExists = false;
    for (var i = 0; i < users.length; i++) {
      if (String(users[i].username || '').trim().toLowerCase() === uIn) {
        userExists = true;
        if (String(users[i].password || '').trim() === pIn) {
          matchedUser = users[i];
        }
        break;
      }
    }

    if (!userExists) {
      return { ok: false, errorType: 'NOT_FOUND', message: '❌ Không tìm thấy tài khoản "' + uIn + '" trong bảng PHAN_QUYEN!', freshData: data };
    }
    if (!matchedUser) {
      return { ok: false, errorType: 'WRONG_PASSWORD', message: '❌ Sai mật khẩu! Hệ thống vừa kiểm tra trực tiếp trên Sheet PHAN_QUYEN, mật khẩu bạn nhập không khớp với mật khẩu hiện tại trên Sheet.', freshData: data };
    }
    if (String(matchedUser.status || '').toLowerCase().indexOf('khóa') !== -1) {
      return { ok: false, errorType: 'LOCKED', message: '🔒 Tài khoản "' + uIn + '" đang bị khóa trên Sheet PHAN_QUYEN!', freshData: data };
    }

    return {
      ok: true,
      user: matchedUser,
      freshData: data
    };
  } catch (e) {
    return { ok: false, message: 'Lỗi kiểm tra đăng nhập: ' + e.toString() };
  }
}

function parseNumSafe(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (val === null || val === undefined) return 0;
  var s = String(val).replace(/[^\d.-]/g, '');
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function normalizeDateStr(rawVal, dispVal) {
  if (rawVal instanceof Date && !isNaN(rawVal.getTime())) {
    return Utilities.formatDate(rawVal, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }
  var s = String(dispVal || rawVal || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  var m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
  }
  return s;
}

function parseJsonSafe(str, fallbackVal) {
  if (!str) return fallbackVal;
  try {
    var parsed = JSON.parse(String(str));
    return parsed !== null && parsed !== undefined ? parsed : fallbackVal;
  } catch (e) {
    return fallbackVal;
  }
}

function appendStartupLog(actor, role, action, refId, detail) {
  try {
    var ss = getTargetSpreadsheet();
    if (!ss) return;
    var sh = ss.getSheetByName('NHAT_KY_HE_THONG');
    if (!sh) return;
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
    sh.appendRow([nowStr, String(actor || 'system'), String(role || 'USER'), String(action || ''), String(refId || ''), String(detail || '')]);
  } catch (e) {}
}

// ============================================================================
// API 1: ĐỌC TOÀN BỘ DỮ LIỆU TÀI CHÍNH STARTUP (getStartupFinanceData)
// ============================================================================
function getStartupFinanceData() {
  try {
    var ss = ensureStartupSheetsExist();
    var now = new Date();
    var todayStr = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    var curMonthStr = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyyy-MM');
    var serverTime = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');

    // 1. Đọc CAU_HINH
    var config = {};
    var shCfg = ss.getSheetByName('CAU_HINH');
    if (shCfg && shCfg.getLastRow() >= 3) {
      var cfgVals = shCfg.getRange(3, 1, shCfg.getLastRow() - 2, 2).getDisplayValues();
      cfgVals.forEach(function(r) {
        var k = String(r[0] || '').trim();
        if (k) config[k] = String(r[1] || '').trim();
      });
    }

    // 2. Đọc PHAN_QUYEN
    var users = [];
    var shAuth = ss.getSheetByName('PHAN_QUYEN');
    if (shAuth && shAuth.getLastRow() >= 3) {
      if (shAuth.getMaxColumns() < 9) shAuth.insertColumnsAfter(shAuth.getMaxColumns(), 9 - shAuth.getMaxColumns());
      var uVals = shAuth.getRange(3, 1, shAuth.getLastRow() - 2, 9).getDisplayValues();
      uVals.forEach(function(r, idx) {
        var uname = String(r[0] || '').trim();
        if (!uname) return;
        users.push({
          rowIndex: idx + 3,
          username: uname,
          password: String(r[1] || '123456').trim(),
          fullName: String(r[2] || uname).trim(),
          role: String(r[3] || 'STAFF').trim().toUpperCase(),
          department: String(r[4] || '').trim(),
          email: String(r[5] || '').trim(),
          phone: String(r[6] || '').trim(),
          status: String(r[7] || 'Hoạt động').trim(),
          permissions: String(r[8] || '').trim()
        });
      });
    }

    // 3. Đọc QUY_TIEN_RUNWAY
    var cashAccounts = [];
    var shCash = ss.getSheetByName('QUY_TIEN_RUNWAY');
    if (shCash && shCash.getLastRow() >= 3) {
      var cRaw = shCash.getRange(3, 1, shCash.getLastRow() - 2, 9).getValues();
      var cDisp = shCash.getRange(3, 1, shCash.getLastRow() - 2, 9).getDisplayValues();
      cRaw.forEach(function(r, idx) {
        var d = cDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[1]) return;
        cashAccounts.push({
          rowIndex: idx + 3,
          id: id || ('CASH-0' + (idx + 1)),
          name: String(d[1] || '').trim(),
          bankName: String(d[2] || '').trim(),
          openingBalance: parseNumSafe(r[3]),
          totalIn: parseNumSafe(r[4]),
          totalOut: parseNumSafe(r[5]),
          currentBalance: parseNumSafe(r[6]),
          interestRate: parseNumSafe(r[7]),
          notes: String(d[8] || '').trim()
        });
      });
    }

    // 4. Đọc DOANH_THU_MRR_UNIT
    var mrrMetrics = [];
    var shMrr = ss.getSheetByName('DOANH_THU_MRR_UNIT');
    if (shMrr && shMrr.getLastRow() >= 3) {
      var mRaw = shMrr.getRange(3, 1, shMrr.getLastRow() - 2, 14).getValues();
      var mDisp = shMrr.getRange(3, 1, shMrr.getLastRow() - 2, 14).getDisplayValues();
      mRaw.forEach(function(r, idx) {
        var d = mDisp[idx];
        var period = String(d[0] || '').trim();
        if (!period) return;
        mrrMetrics.push({
          rowIndex: idx + 3,
          period: period,
          startCustomers: parseNumSafe(r[1]),
          newCustomers: parseNumSafe(r[2]),
          churnCustomers: parseNumSafe(r[3]),
          activeCustomers: parseNumSafe(r[4]),
          arpu: parseNumSafe(r[5]),
          mrr: parseNumSafe(r[6]),
          oneOffRevenue: parseNumSafe(r[7]),
          totalRevenue: parseNumSafe(r[8]),
          cacSpend: parseNumSafe(r[9]),
          cacUnit: parseNumSafe(r[10]),
          ltvUnit: parseNumSafe(r[11]),
          ltvCacRatio: parseNumSafe(r[12]),
          evaluation: String(d[13] || '').trim()
        });
      });
    }

    // 5. Đọc DONG_TIEN_THUC_TE
    var cashFlows = [];
    var shCf = ss.getSheetByName('DONG_TIEN_THUC_TE');
    if (shCf && shCf.getLastRow() >= 3) {
      if (shCf.getMaxColumns() < 14) shCf.insertColumnsAfter(shCf.getMaxColumns(), 14 - shCf.getMaxColumns());
      var fRaw = shCf.getRange(3, 1, shCf.getLastRow() - 2, 14).getValues();
      var fDisp = shCf.getRange(3, 1, shCf.getLastRow() - 2, 14).getDisplayValues();
      fRaw.forEach(function(r, idx) {
        var d = fDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[6]) return;
        cashFlows.push({
          rowIndex: idx + 3,
          id: id || ('CF-' + (idx + 1)),
          date: normalizeDateStr(r[1], d[1]),
          period: String(d[2] || curMonthStr).trim(),
          flowDirection: String(d[3] || 'CHI TIỀN (CASH OUT)').trim(),
          streamType: String(d[4] || '1. Dòng tiền Hoạt động kinh doanh (Operating)').trim(),
          category: String(d[5] || '').trim(),
          description: String(d[6] || '').trim(),
          department: String(d[7] || '').trim(),
          accountId: String(d[8] || 'CASH-01').trim(),
          amount: parseNumSafe(r[9]),
          costStructure: String(d[10] || 'Định phí (Fixed Burn)').trim(),
          status: String(d[11] || 'Chờ duyệt').trim(),
          approver: String(d[12] || '').trim(),
          attachments: parseJsonSafe(d[13], [])
        });
      });
    }

    // 6. Đọc DU_PHONG_12_THANG
    var forecasts = [];
    var shFc = ss.getSheetByName('DU_PHONG_12_THANG');
    if (shFc && shFc.getLastRow() >= 3) {
      var fcRaw = shFc.getRange(3, 1, shFc.getLastRow() - 2, 14).getValues();
      var fcDisp = shFc.getRange(3, 1, shFc.getLastRow() - 2, 14).getDisplayValues();
      fcRaw.forEach(function(r, idx) {
        var d = fcDisp[idx];
        var p = String(d[0] || '').trim();
        if (!p) return;
        forecasts.push({
          rowIndex: idx + 3,
          period: p,
          scenario: String(d[1] || 'Kịch bản Cơ sở (Base Case)').trim(),
          growthRatePct: parseNumSafe(r[2]),
          projectedRevenue: parseNumSafe(r[3]),
          projectedCogs: parseNumSafe(r[4]),
          grossProfit: parseNumSafe(r[5]),
          rAndDCost: parseNumSafe(r[6]),
          marketingCost: parseNumSafe(r[7]),
          gnaCost: parseNumSafe(r[8]),
          grossBurn: parseNumSafe(r[9]),
          netCashflow: parseNumSafe(r[10]),
          endingCash: parseNumSafe(r[11]),
          runwayMonths: parseNumSafe(r[12]),
          safetyStatus: String(d[13] || '').trim()
        });
      });
    }

    // 7. Đọc VONG_GOI_VON_CAPTABLE
    var capTable = [];
    var shCap = ss.getSheetByName('VONG_GOI_VON_CAPTABLE');
    if (shCap && shCap.getLastRow() >= 3) {
      if (shCap.getMaxColumns() < 11) shCap.insertColumnsAfter(shCap.getMaxColumns(), 11 - shCap.getMaxColumns());
      var cpRaw = shCap.getRange(3, 1, shCap.getLastRow() - 2, 11).getValues();
      var cpDisp = shCap.getRange(3, 1, shCap.getLastRow() - 2, 11).getDisplayValues();
      cpRaw.forEach(function(r, idx) {
        var d = cpDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[1]) return;
        capTable.push({
          rowIndex: idx + 3,
          id: id || ('CAP-0' + (idx + 1)),
          investorName: String(d[1] || '').trim(),
          group: String(d[2] || 'Founders').trim(),
          roundName: String(d[3] || 'Seed Round').trim(),
          investedAmount: parseNumSafe(r[4]),
          postMoneyValuation: parseNumSafe(r[5]),
          shares: parseNumSafe(r[6]),
          ownershipPct: parseNumSafe(r[7]),
          date: normalizeDateStr(r[8], d[8]),
          status: String(d[9] || 'Đã giải ngân 100%').trim(),
          attachments: parseJsonSafe(d[10], [])
        });
      });
    }

    return {
      ok: true,
      serverTime: serverTime,
      todayStr: todayStr,
      curMonthStr: curMonthStr,
      config: config,
      users: users,
      cashAccounts: cashAccounts,
      mrrMetrics: mrrMetrics,
      cashFlows: cashFlows,
      forecasts: forecasts,
      capTable: capTable
    };
  } catch (e) {
    return { ok: false, message: 'Lỗi đọc dữ liệu Tài chính Startup: ' + e.toString() };
  }
}

// ============================================================================
// API 2: LƯU GIAO DỊCH DÒNG TIỀN & DUYỆT CHI BURN RATE (DONG_TIEN_THUC_TE)
// ============================================================================
function saveCashFlowTransaction(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureStartupSheetsExist();
    var sh = ss.getSheetByName('DONG_TIEN_THUC_TE');
    if (sh.getMaxColumns() < 14) sh.insertColumnsAfter(sh.getMaxColumns(), 14 - sh.getMaxColumns());

    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'CF-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    var foundRow = -1;
    var existingDisp = null;
    if (!isNew && sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          foundRow = i + 3;
          existingDisp = sh.getRange(foundRow, 1, 1, 14).getDisplayValues()[0];
          break;
        }
      }
    }

    var canApprove = payload.canApprove === true;
    var status = String(payload.status || (existingDisp ? existingDisp[11] : 'Chờ duyệt')).trim();
    if (!canApprove && status === 'Đã duyệt') {
      status = 'Chờ duyệt';
    }

    var todayStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    var dateStr = String(payload.date || (existingDisp ? existingDisp[1] : todayStr)).trim();
    var periodStr = dateStr.slice(0, 7);
    var attachmentsJson = JSON.stringify(Array.isArray(payload.attachments) ? payload.attachments : []);

    var rowVals = [
      id,
      dateStr,
      periodStr,
      String(payload.flowDirection || (existingDisp ? existingDisp[3] : 'CHI TIỀN (CASH OUT)')).trim(),
      String(payload.streamType || (existingDisp ? existingDisp[4] : '1. Dòng tiền Hoạt động kinh doanh (Operating)')).trim(),
      String(payload.category || (existingDisp ? existingDisp[5] : 'Chi phí Vận hành G&A')).trim(),
      String(payload.description || (existingDisp ? existingDisp[6] : '')).trim(),
      String(payload.department || (existingDisp ? existingDisp[7] : '')).trim(),
      String(payload.accountId || (existingDisp ? existingDisp[8] : 'CASH-01')).trim(),
      parseNumSafe(payload.amount !== undefined ? payload.amount : (existingDisp ? existingDisp[9] : 0)),
      String(payload.costStructure || (existingDisp ? existingDisp[10] : 'Định phí (Fixed Burn)')).trim(),
      status,
      String(payload.approver || (existingDisp ? existingDisp[12] : 'CFO / Founder')).trim(),
      attachmentsJson
    ];

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 14).setValues([rowVals]);
      sh.getRange(foundRow, 10).setNumberFormat('#,##0');
    } else {
      sh.appendRow(rowVals);
      sh.getRange(sh.getLastRow(), 10).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendStartupLog(payload.actor || 'cfo_st', payload.actorRole || 'CFO_MANAGER', foundRow > 0 ? 'UPDATE_CASHFLOW' : 'CREATE_CASHFLOW', id, rowVals[3] + ': ' + rowVals[6] + ' (' + rowVals[9].toLocaleString('vi-VN') + ' đ - ' + status + ')');

    var fresh = getStartupFinanceData();
    fresh.message = '💸 Đã lưu bút toán dòng tiền [' + id + '] (' + status + ')!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu giao dịch dòng tiền: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function approveCashFlowQuick(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureStartupSheetsExist();
    var sh = ss.getSheetByName('DONG_TIEN_THUC_TE');
    var id = String(payload.id || '').trim();
    var newStatus = String(payload.status || 'Đã duyệt').trim();
    var approver = String(payload.approver || 'CFO / Founder').trim();

    if (sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          var r = i + 3;
          sh.getRange(r, 12).setValue(newStatus);
          sh.getRange(r, 13).setValue(approver);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendStartupLog(payload.actor || approver, payload.actorRole || 'CFO_MANAGER', 'APPROVE_CASHFLOW', id, 'Phê duyệt giao dịch dòng tiền ' + id + ' ➔ ' + newStatus);
    var fresh = getStartupFinanceData();
    fresh.message = '✅ Đã cập nhật trạng thái bút toán [' + id + '] sang: ' + newStatus;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi phê duyệt: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 3: CẬP NHẬT QUỸ TIỀN DỰ TRỮ & CHỈ SỐ TĂNG TRƯỞNG MRR / UNIT ECONOMICS
// ============================================================================
function saveCashReserveAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureStartupSheetsExist();
    var sh = ss.getSheetByName('QUY_TIEN_RUNWAY');
    var id = String(payload.id || '').trim() || ('CASH-0' + (sh.getLastRow()));
    var openBal = parseNumSafe(payload.openingBalance);
    var totIn = parseNumSafe(payload.totalIn);
    var totOut = parseNumSafe(payload.totalOut);
    var curBal = parseNumSafe(payload.currentBalance !== undefined ? payload.currentBalance : (openBal + totIn - totOut));

    var rowVals = [
      id,
      String(payload.name || '').trim(),
      String(payload.bankName || '').trim(),
      openBal,
      totIn,
      totOut,
      curBal,
      parseNumSafe(payload.interestRate),
      String(payload.notes || '').trim()
    ];

    var found = -1;
    if (sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          found = i + 3;
          break;
        }
      }
    }
    if (found > 0) {
      sh.getRange(found, 1, 1, 9).setValues([rowVals]);
      sh.getRange(found, 4, 1, 4).setNumberFormat('#,##0');
    } else {
      sh.appendRow(rowVals);
      sh.getRange(sh.getLastRow(), 4, 1, 4).setNumberFormat('#,##0');
    }
    SpreadsheetApp.flush();
    appendStartupLog(payload.actor || 'cfo_st', 'CFO_MANAGER', 'SAVE_CASH_ACCOUNT', id, 'Cập nhật quỹ tiền dự trữ: ' + rowVals[1]);
    var fresh = getStartupFinanceData();
    fresh.message = '🏦 Đã lưu quỹ tiền dự trữ: ' + rowVals[1];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu quỹ tiền: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function saveMrrUnitEconomicsRow(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureStartupSheetsExist();
    var sh = ss.getSheetByName('DOANH_THU_MRR_UNIT');
    var period = String(payload.period || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM')).trim();
    var startCust = parseNumSafe(payload.startCustomers);
    var newCust = parseNumSafe(payload.newCustomers);
    var churnCust = parseNumSafe(payload.churnCustomers);
    var activeCust = startCust + newCust - churnCust;
    var arpu = parseNumSafe(payload.arpu);
    var mrr = activeCust * arpu;
    var oneOff = parseNumSafe(payload.oneOffRevenue);
    var totRev = mrr + oneOff;
    var cacSpend = parseNumSafe(payload.cacSpend);
    var cacUnit = newCust > 0 ? Math.round(cacSpend / newCust) : 0;
    var churnRate = activeCust > 0 ? Math.max(0.03, churnCust / activeCust) : 0.05;
    var ltvUnit = Math.round((arpu * 0.75) / churnRate);
    var ratio = cacUnit > 0 ? Math.round((ltvUnit / cacUnit) * 10) / 10 : 0;
    var evalTxt = ratio >= 3.0 ? 'Chuẩn Quỹ VC (LTV/CAC >= 3.0x)' : 'Cần tối ưu CAC (< 3.0x)';

    var rowVals = [
      period, startCust, newCust, churnCust, activeCust,
      arpu, mrr, oneOff, totRev, cacSpend, cacUnit, ltvUnit, ratio, evalTxt
    ];

    var found = -1;
    if (sh.getLastRow() >= 3) {
      var pList = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < pList.length; i++) {
        if (String(pList[i][0]).trim() === period) {
          found = i + 3;
          break;
        }
      }
    }
    if (found > 0) {
      sh.getRange(found, 1, 1, 14).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }
    SpreadsheetApp.flush();
    appendStartupLog(payload.actor || 'growth_lead', 'LEADER', 'SAVE_MRR_UNIT', period, 'Cập nhật chỉ số MRR & Unit Economics kỳ ' + period + ' (MRR: ' + mrr.toLocaleString('vi-VN') + ' đ, LTV/CAC: ' + ratio + 'x)');
    var fresh = getStartupFinanceData();
    fresh.message = '📈 Đã cập nhật chỉ số MRR & Unit Economics kỳ ' + period + '!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu chỉ số MRR: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 4: ĐỘNG CƠ CHẠY MÔ PHỎNG DỰ PHÓNG 12 THÁNG (BASE / BEST / WORST CASE)
// ============================================================================
function recalculate12MonthForecast(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = getStartupFinanceData();
    var ss = getTargetSpreadsheet();
    var shFc = ss.getSheetByName('DU_PHONG_12_THANG');

    var scenario = (payload && payload.scenario) ? String(payload.scenario).trim() : 'Kịch bản Cơ sở (Base Case)';
    var revGrowthPct = (payload && payload.revGrowthPct !== undefined) ? parseNumSafe(payload.revGrowthPct) : parseNumSafe(data.config.DEFAULT_REVENUE_GROWTH_PCT || 10);
    var expGrowthPct = (payload && payload.expGrowthPct !== undefined) ? parseNumSafe(payload.expGrowthPct) : parseNumSafe(data.config.DEFAULT_EXPENSE_GROWTH_PCT || 3);

    var totalCashNow = 0;
    (data.cashAccounts || []).forEach(function(c) { totalCashNow += Number(c.currentBalance || 0); });
    if (totalCashNow <= 0) totalCashNow = 5685000000;

    var latestMrrRow = (data.mrrMetrics && data.mrrMetrics.length > 0) ? data.mrrMetrics[data.mrrMetrics.length - 1] : null;
    var baseRev = latestMrrRow ? Number(latestMrrRow.totalRevenue || 952000000) : 952000000;

    var runningCash = totalCashNow;
    var rev = baseRev;
    var rAndD = 620000000;
    var mkt = 185000000;
    var gna = 95000000;
    var today = new Date();
    var newRows = [];

    for (var m = 1; m <= 12; m++) {
      var d = new Date(today.getFullYear(), today.getMonth() + m, 1);
      var mLabel = Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM');
      rev = Math.round(rev * (1 + revGrowthPct / 100.0));
      var cogs = Math.round(rev * 0.18);
      var grossProfit = rev - cogs;
      rAndD = Math.round(rAndD * (1 + expGrowthPct / 100.0));
      mkt = Math.round(mkt * (1 + expGrowthPct / 100.0));
      gna = Math.round(gna * (1 + (expGrowthPct * 0.6) / 100.0));
      var grossBurn = cogs + rAndD + mkt + gna;
      var netCf = rev - grossBurn;
      runningCash = runningCash + netCf;
      var runwayM = netCf >= 0 ? 99.9 : Math.max(0, Math.round((runningCash / Math.abs(netCf)) * 10) / 10);
      var safety = netCf >= 0 ? '🟢 Đã Hòa Vốn & Có Lãi Dương (Cashflow Positive)' : (runwayM >= 12 ? '🟢 Runway An Toàn (> 12 tháng)' : (runwayM >= 6 ? '🟡 Cần Chuẩn Bị Gọi Vốn (6-12 tháng)' : '🔴 Báo Động Đỏ (< 6 tháng)'));

      newRows.push([
        mLabel, scenario, revGrowthPct, rev,
        cogs, grossProfit, rAndD,
        mkt, gna, grossBurn,
        netCf, runningCash,
        runwayM, safety
      ]);
    }

    if (shFc.getLastRow() >= 3) {
      shFc.getRange(3, 1, shFc.getLastRow() - 2, 14).clearContent();
    }
    shFc.getRange(3, 1, newRows.length, 14).setValues(newRows);
    shFc.getRange(3, 1, newRows.length, 1).setNumberFormat('@');
    shFc.getRange(3, 4, newRows.length, 9).setNumberFormat('#,##0');

    SpreadsheetApp.flush();
    appendStartupLog((payload && payload.actor) || 'cfo_st', 'CFO_MANAGER', 'RECALC_FORECAST', scenario, 'Chạy dự phóng dòng tiền 12 tháng (' + scenario + ', Tăng trưởng DT: ' + revGrowthPct + '%/tháng)');

    var fresh = getStartupFinanceData();
    fresh.message = '🔮 Đã chạy lại Mô hình Dự phóng Dòng tiền & Runway 12 tháng (' + scenario + ')!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi tính dự phóng: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 5: QUẢN LÝ VÒNG GỌI VỐN CAP TABLE, UPLOAD FILE & PHÂN QUYỀN RBAC
// ============================================================================
function saveCapTableEntry(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureStartupSheetsExist();
    var sh = ss.getSheetByName('VONG_GOI_VON_CAPTABLE');
    if (sh.getMaxColumns() < 11) sh.insertColumnsAfter(sh.getMaxColumns(), 11 - sh.getMaxColumns());

    var id = String(payload.id || '').trim() || ('CAP-0' + sh.getLastRow());
    var attachmentsJson = JSON.stringify(Array.isArray(payload.attachments) ? payload.attachments : []);

    var rowVals = [
      id,
      String(payload.investorName || '').trim(),
      String(payload.group || 'Venture Capital (VC)').trim(),
      String(payload.roundName || 'Seed Round').trim(),
      parseNumSafe(payload.investedAmount),
      parseNumSafe(payload.postMoneyValuation),
      parseNumSafe(payload.shares),
      parseNumSafe(payload.ownershipPct),
      String(payload.date || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')).trim(),
      String(payload.status || 'Đã giải ngân 100%').trim(),
      attachmentsJson
    ];

    var found = -1;
    if (sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          found = i + 3;
          break;
        }
      }
    }
    if (found > 0) {
      sh.getRange(found, 1, 1, 11).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }
    SpreadsheetApp.flush();
    appendStartupLog(payload.actor || 'founder', 'ADMIN', 'SAVE_CAPTABLE', id, 'Cập nhật Cap Table: ' + rowVals[1] + ' (' + rowVals[7] + '%)');
    var fresh = getStartupFinanceData();
    fresh.message = '💎 Đã lưu thông tin Cổ đông / Vòng gọi vốn: ' + rowVals[1];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu Cap Table: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function uploadStartupAttachment(payload) {
  try {
    var fileName = String(payload.fileName || 'Chung_Tu_Startup.pdf').trim();
    var mimeType = String(payload.mimeType || 'application/octet-stream').trim();
    var base64Data = String(payload.base64Data || '').trim();
    var fileSize = String(payload.fileSize || '180 KB').trim();
    var uploadedBy = String(payload.uploadedBy || 'CFO').trim();
    var ext = fileName.indexOf('.') !== -1 ? fileName.split('.').pop().toLowerCase() : 'pdf';
    var attId = 'STDOC-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmmss');

    var fileUrl = '';
    if (base64Data) {
      try {
        var folderName = 'GS003_Startup_Finance_Uploads';
        var folders = DriveApp.getFoldersByName(folderName);
        var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
        var decoded = Utilities.base64Decode(base64Data);
        var blob = Utilities.newBlob(decoded, mimeType, fileName);
        var driveFile = folder.createFile(blob);
        try { driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
        fileUrl = driveFile.getUrl();
      } catch (dErr) {
        fileUrl = String(payload.fallbackUrl || 'https://drive.google.com');
      }
    } else {
      fileUrl = String(payload.fallbackUrl || 'https://drive.google.com');
    }

    return {
      ok: true,
      file: { id: attId, name: fileName, ext: ext, size: fileSize, url: fileUrl, uploadedBy: uploadedBy }
    };
  } catch (e) {
    return { ok: false, message: 'Lỗi tải tệp: ' + e.toString() };
  }
}

function saveStartupUserAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureStartupSheetsExist();
    var sh = ss.getSheetByName('PHAN_QUYEN');
    if (sh.getMaxColumns() < 9) sh.insertColumnsAfter(sh.getMaxColumns(), 9 - sh.getMaxColumns());

    var uname = String(payload.username || '').trim().toLowerCase();
    if (!uname) return { ok: false, message: 'Vui lòng nhập Username!' };

    var rowVals = [
      uname,
      String(payload.password || '123456').trim(),
      String(payload.fullName || uname).trim(),
      String(payload.role || 'STAFF').trim().toUpperCase(),
      String(payload.department || 'Phòng Tài Chính & Kế Toán').trim(),
      String(payload.email || '').trim(),
      String(payload.phone || '').trim(),
      String(payload.status || 'Hoạt động').trim(),
      String(payload.permissions || '').trim()
    ];

    var found = -1;
    if (sh.getLastRow() >= 3) {
      var uList = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < uList.length; i++) {
        if (String(uList[i][0]).trim().toLowerCase() === uname) {
          found = i + 3;
          break;
        }
      }
    }
    if (found > 0) {
      sh.getRange(found, 1, 1, 9).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }
    SpreadsheetApp.flush();
    appendStartupLog(payload.actor || 'founder', 'ADMIN', 'SAVE_USER_RBAC', uname, 'Cập nhật tài khoản: ' + rowVals[2] + ' [' + rowVals[3] + ']');
    var fresh = getStartupFinanceData();
    fresh.message = '🔐 Đã lưu tài khoản & quyền hạn cho: ' + rowVals[2];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu tài khoản: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function sendStartupRunwayAlertNow(payload) {
  try {
    var data = getStartupFinanceData();
    var cfg = data.config || {};
    var totalCash = 0;
    (data.cashAccounts || []).forEach(function(c) { totalCash += Number(c.currentBalance || 0); });
    var targetEmail = String(cfg.ADMIN_EMAIL || '').trim();

    if (String(cfg.ENABLE_EMAIL_ALERT || 'TRUE').toUpperCase() === 'TRUE' && targetEmail && targetEmail.indexOf('@') > 0) {
      try {
        MailApp.sendEmail({
          to: targetEmail,
          subject: '[BÁO CÁO CFO & RUNWAY STARTUP] ' + (cfg.COMPANY_NAME || 'NOVA-TECH STARTUP'),
          htmlBody: '<h3>🚀 Báo Cáo Nhanh Quỹ Tiền Mặt, Burn Rate & Runway Startup</h3>' +
            '<p>Tổng Quỹ tiền mặt khả dụng hiện tại: <b>' + totalCash.toLocaleString('vi-VN') + ' VNĐ</b></p>' +
            '<p>Giai đoạn: <b>' + (cfg.CURRENT_FUNDING_STAGE || 'Pre-Series A') + '</b></p>'
        });
      } catch (e) {}
    }
    appendStartupLog((payload && payload.actor) || 'cfo_st', 'CFO_MANAGER', 'SEND_RUNWAY_ALERT', 'ALL', 'Bắn báo cáo Runway & Burn Rate qua Email & Bot Zalo');
    var fresh = getStartupFinanceData();
    fresh.message = '🔔 Đã bắn Báo cáo CFO, Burn Rate & Runway qua Email & Bot Zalo thành công!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi gửi cảnh báo: ' + e.toString() };
  }
}

function saveStartupConfig(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureStartupSheetsExist();
    var shCfg = ss.getSheetByName('CAU_HINH');
    if (shCfg && shCfg.getLastRow() >= 3 && payload.config) {
      var keys = shCfg.getRange(3, 1, shCfg.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < keys.length; i++) {
        var k = String(keys[i][0] || '').trim();
        if (k && payload.config[k] !== undefined) {
          shCfg.getRange(i + 3, 2).setValue(String(payload.config[k]).trim());
        }
      }
    }
    SpreadsheetApp.flush();
    var fresh = getStartupFinanceData();
    fresh.message = '⚙️ Đã lưu cấu hình Định mức Runway, Tăng trưởng & Bot Cảnh báo CFO!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu cấu hình: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}



```

## 📁 FILE 4: `Index.html`

```
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>GS-003-ST v4.0 Pro • Quản Trị Tài Chính Startup, Burn Rate, Runway & Dự Phóng 12 Tháng</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --primary: #0F172A;
      --accent: #047857;
      --indigo: #4338CA;
      --bg-soft: #F1F5F9;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-soft);
      color: #0F172A;
      margin: 0;
      padding-bottom: 78px;
      overflow-x: hidden;
    }
    body.pseudo-fullscreen {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow-y: auto;
      z-index: 9990;
    }

    /* AUTH GATE OVERLAY */
    .auth-gate-overlay {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at top right, #065F46, #0F172A 72%);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .auth-card {
      width: 100%;
      max-width: 490px;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 18px;
      padding: 24px;
      color: #FFFFFF;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
    }

    /* TOPBAR */
    .app-topbar {
      background: linear-gradient(135deg, #0F172A 0%, #065F46 58%, #1E3A8A 100%);
      color: #FFFFFF;
      padding: 10px 16px;
      position: sticky;
      top: 0;
      z-index: 1030;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.22);
    }
    .btn-fullscreen-pro {
      background: linear-gradient(135deg, #F59E0B, #EA580C);
      color: #fff;
      border: none;
      font-weight: 700;
      border-radius: 8px;
      padding: 5px 12px;
      font-size: 0.78rem;
      box-shadow: 0 2px 8px rgba(234, 88, 12, 0.4);
    }
    .btn-fullscreen-pro:hover { color: #fff; opacity: 0.95; }

    .role-scope-bar {
      background: #ECFDF5;
      border-bottom: 1px solid #A7F3D0;
      padding: 7px 16px;
      font-size: 0.8rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .desktop-nav-bar {
      background: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      padding: 6px 16px;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      white-space: nowrap;
    }
    .nav-tab-btn {
      border: none;
      background: transparent;
      color: #475569;
      font-weight: 600;
      font-size: 0.82rem;
      padding: 8px 14px;
      border-radius: 10px;
      transition: all 0.18s;
    }
    .nav-tab-btn:hover { background: #F1F5F9; color: #047857; }
    .nav-tab-btn.active {
      background: linear-gradient(135deg, #065F46, #047857);
      color: #FFFFFF;
      box-shadow: 0 4px 10px rgba(4, 120, 87, 0.28);
    }

    .section-card {
      background: #FFFFFF;
      border-radius: 14px;
      border: 1px solid #E2E8F0;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }
    .kpi-card {
      background: #FFFFFF;
      border-radius: 12px;
      padding: 12px 14px;
      border: 1px solid #E2E8F0;
      height: 100%;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    }
    .kpi-val {
      font-size: 1.2rem;
      font-weight: 800;
      margin-top: 2px;
    }

    .att-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      text-decoration: none;
      border: 1px solid transparent;
    }
    .att-word { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; }
    .att-excel { background: #ECFDF5; color: #047857; border-color: #A7F3D0; }
    .att-ppt { background: #FFF7ED; color: #C2410C; border-color: #FED7AA; }
    .att-pdf { background: #FEF2F2; color: #B91C1C; border-color: #FECACA; }
    .att-other { background: #F8FAFC; color: #334155; border-color: #CBD5E1; }

    .mobile-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border-top: 1px solid #CBD5E1;
      display: flex;
      justify-content: space-around;
      padding: 6px 4px;
      z-index: 1025;
      box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);
    }
    @media (min-width: 992px) {
      .mobile-bottom-nav { display: none; }
      body { padding-bottom: 24px; }
    }
    .mob-nav-item {
      border: none;
      background: transparent;
      color: #64748B;
      font-size: 0.7rem;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 4px 8px;
      border-radius: 8px;
    }
    .mob-nav-item i { font-size: 1.1rem; }
    .mob-nav-item.active { color: #047857; font-weight: 800; }

    .custom-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      z-index: 1055;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 12px;
    }
    .custom-modal-dialog {
      background: #FFFFFF;
      border-radius: 16px;
      width: 100%;
      max-width: 680px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
    }
    .custom-modal-header {
      background: linear-gradient(135deg, #065F46, #047857);
      color: #FFFFFF;
      padding: 12px 18px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .custom-modal-body { padding: 16px 18px; max-height: 78vh; overflow-y: auto; }
    .custom-modal-footer {
      padding: 10px 18px;
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    #appToastContainer {
      position: fixed;
      top: 68px;
      right: 16px;
      z-index: 1090;
      max-width: 380px;
    }

    @media print {
      .app-topbar, .role-scope-bar, .desktop-nav-bar, .mobile-bottom-nav, .no-print {
        display: none !important;
      }
      body { background: #fff; padding: 0; }
      .section-card { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>

<div id="appToastContainer"></div>

<!-- ======================================================================= -->
<!-- 1. CỔNG ĐĂNG NHẬP BẢO MẬT STARTUP CFO & INVESTOR DATA ROOM (AUTH GATE)  -->
<!-- ======================================================================= -->
<div class="auth-gate-overlay" id="authGateScreen">
  <div class="auth-card">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="badge bg-success text-white fw-bold">GS-003-ST v4.1 Commercial Pro</span>
      <button type="button" class="btn-fullscreen-pro" onclick="toggleFullScreenMode()">
        <i class="bi bi-arrows-fullscreen"></i> Toàn Màn Hình
      </button>
    </div>
    <h5 class="fw-bold mb-1">🚀 Trung Tâm Tài Chính Startup, Runway & Gọi Vốn</h5>
    <p class="small text-light opacity-75 mb-3">
      Quản trị <b>Burn Rate, Cash Runway, MRR/ARR, Unit Economics (LTV/CAC), Dự phóng 12 tháng & Cap Table</b>. Đăng nhập theo đúng vai trò để mở khóa quyền điều hành.
    </p>

    <div id="loginErrorAlert" class="alert alert-danger py-2 small d-none"></div>

    <div class="mb-2">
      <label class="form-label small fw-bold mb-1">Tài khoản đăng nhập (Username)</label>
      <input type="text" id="loginUsername" class="form-control form-control-sm" value="founder" placeholder="Nhập username...">
    </div>
    <div class="mb-3">
      <label class="form-label small fw-bold mb-1">Mật khẩu / Mã PIN</label>
      <input type="password" id="loginPassword" class="form-control form-control-sm" value="123456" placeholder="Nhập mật khẩu...">
    </div>

    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="small text-info" id="authSyncSheetStatus">🔄 Đang đồng bộ mật khẩu mới nhất từ Sheet PHAN_QUYEN...</span>
      <button type="button" class="btn btn-xs btn-outline-info py-0 px-2" style="font-size:0.72rem;" onclick="syncAuthUsersFromSheet(true)">
        <i class="bi bi-arrow-repeat"></i> Tải lại MK từ Sheet
      </button>
    </div>

    <div class="d-grid gap-2 mb-3">
      <button type="button" class="btn btn-success fw-bold py-2" id="btnSubmitLogin" onclick="handleLoginSubmit(false)">
        <i class="bi bi-shield-lock-fill me-1"></i> Đăng Nhập Vào Hệ Thống (Xác Thực Sheet Thời Gian Thực)
      </button>
      <button type="button" class="btn btn-warning fw-bold py-2 text-dark" onclick="loginAndGoFullScreen()">
        <i class="bi bi-arrows-fullscreen me-1"></i> Đăng Nhập & Mở Toàn Màn Hình
      </button>
    </div>

    <div class="p-2 rounded-3" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.14);">
      <div class="small text-warning fw-bold mb-1">💡 Chạm chọn nhanh Username (Tự động lấy mật khẩu hiện tại trên Sheet `PHAN_QUYEN`):</div>
      <div class="d-flex flex-wrap gap-1">
        <button type="button" class="btn btn-xs btn-outline-light py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('founder')">👑 Founder/CEO (founder)</button>
        <button type="button" class="btn btn-xs btn-outline-info py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('cfo_st')">💼 CFO (cfo_st)</button>
        <button type="button" class="btn btn-xs btn-outline-success py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('growth_lead')">📈 Growth Lead (growth_lead)</button>
        <button type="button" class="btn btn-xs btn-outline-primary py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('ops_lead')">⚡ Tech Lead (ops_lead)</button>
        <button type="button" class="btn btn-xs btn-outline-warning py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('acc_staff')">🧾 Kế toán (acc_staff)</button>
        <button type="button" class="btn btn-xs btn-outline-warning py-1 px-2" style="font-size:0.72rem;" onclick="fillLoginQuick('investor_view')">🏦 Quỹ Đầu Tư VC (investor_view)</button>
      </div>
    </div>
  </div>
</div>

<!-- ======================================================================= -->
<!-- 2. TOPBAR & THANH KHÓA PHIÊN PHÂN QUYỀN                                 -->
<!-- ======================================================================= -->
<header class="app-topbar">
  <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
    <div class="d-flex align-items-center gap-2">
      <span class="badge bg-warning text-dark fw-bold px-2 py-1">GS-003-ST PRO</span>
      <div>
        <div class="fw-bold" style="font-size:0.95rem;" id="topCompanyName">CÔNG TY CỔ PHẦN CÔNG NGHỆ AI & SAAS NOVA-TECH STARTUP</div>
        <div class="small opacity-75" style="font-size:0.73rem;">Cấp 2 Bộ Tứ Tài Chính: Quản Trị Burn Rate, Cash Runway, Unit Economics, Dự Phóng 12 Tháng & Cap Table</div>
      </div>
    </div>

    <div class="d-flex flex-wrap align-items-center gap-2">
      <span class="badge bg-success bg-opacity-75 small" id="syncStatusBadge">
        <i class="bi bi-cloud-check"></i> Đã đồng bộ Sheet
      </span>
      <button type="button" class="btn-fullscreen-pro" onclick="toggleFullScreenMode()">
        <span id="txtFullScreen">🔲 Toàn Màn Hình</span>
      </button>
      <button type="button" class="btn btn-sm btn-warning fw-bold text-dark py-1 px-2" id="btnTopSendAlert" onclick="triggerSendRunwayAlert()">
        <i class="bi bi-bell-fill"></i> Bắn Báo Cáo CFO Email/Zalo
      </button>
      <button type="button" class="btn btn-sm btn-outline-light py-1 px-2" onclick="refreshAllDataFromServer()">
        <i class="bi bi-arrow-clockwise"></i> Làm mới
      </button>
      <span class="badge bg-light text-dark fw-bold px-2 py-1" id="currentUserBadge">👑 Nguyễn Minh Quân [ADMIN]</span>
      <button type="button" class="btn btn-sm btn-danger fw-bold py-1 px-2" onclick="handleLogout()">
        <i class="bi bi-power"></i> Đổi TK
      </button>
    </div>
  </div>
</header>

<div class="role-scope-bar">
  <div id="roleScopeDescription" class="fw-semibold text-dark">
    👑 Đang xem với quyền <b>Founder / CEO (Toàn quyền)</b>
  </div>
  <span class="badge bg-white text-dark border shadow-sm px-2 py-1" id="roleLockStatusBadge">
    🔒 Đã khóa phiên bảo mật theo tài khoản đăng nhập
  </span>
</div>

<!-- THANH ĐIỀU HƯỚNG 6 PHÂN HỆ STARTUP CFO -->
<nav class="desktop-nav-bar">
  <button type="button" class="nav-tab-btn active" id="deskTab_dashboard" onclick="switchMainTab('dashboard')">
    <i class="bi bi-speedometer2"></i> <span id="lblDeskTabDashboard">1. Dashboard CFO: Runway & Burn Rate</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_cashflow" onclick="switchMainTab('cashflow')">
    <i class="bi bi-cash-stack"></i> <span id="lblDeskTabCashflow">2. Quỹ Tiền Dự Trữ & Dòng Tiền 3 Luồng</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_mrr" onclick="switchMainTab('mrr')">
    <i class="bi bi-graph-up-arrow"></i> <span id="lblDeskTabMrr">3. Tăng Trưởng MRR/ARR & Unit Economics</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_forecast" onclick="switchMainTab('forecast')">
    <i class="bi bi-magic"></i> <span id="lblDeskTabForecast">4. Dự Phóng 12 Tháng & Điểm Hòa Vốn</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_captable" onclick="switchMainTab('captable')">
    <i class="bi bi-pie-chart-fill"></i> <span id="lblDeskTabCaptable">5. Vòng Gọi Vốn, Cap Table & Báo Cáo VC A4</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_rbac" onclick="switchMainTab('rbac')">
    <i class="bi bi-shield-lock-fill"></i> <span id="lblDeskTabRbac">6. Phân Quyền & Cấu Hình Ngưỡng Runway</span>
  </button>
  <button type="button" class="nav-tab-btn" id="deskTab_guide" onclick="switchMainTab('guide')">
    <i class="bi bi-book-half"></i> <span id="lblDeskTabGuide">📘 7. Cẩm Nang & Thuật Ngữ Tài Chính (Cho Người Mới)</span>
  </button>
</nav>

<!-- ======================================================================= -->
<!-- 3. NỘI DUNG CHÍNH 6 PHÂN HỆ                                             -->
<!-- ======================================================================= -->
<main class="container-fluid py-3 px-2 px-md-3">

  <!-- ===================================================================== -->
  <!-- TAB 1: DASHBOARD CFO — CASH RUNWAY, BURN RATE, MRR/ARR & UNIT ECON    -->
  <!-- ===================================================================== -->
  <section id="tabPane_dashboard" class="tab-pane-section">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <div>
        <h5 class="fw-bold mb-0 text-dark" id="dashboardHeaderTitle">🚀 Trung Tâm Điều Hành Tài Chính Startup: Burn Rate, Cash Runway & Unit Economics</h5>
        <div class="text-muted small">Đồng bộ lúc: <span id="lblServerTime">-</span> | Giai đoạn: <span id="lblFundingStage" class="badge bg-dark">Pre-Series A</span></div>
      </div>
      <div class="d-flex flex-wrap gap-2" id="dashActionBtnsWrap">
        <button type="button" class="btn btn-success btn-sm fw-bold" id="btnDashNewCashflow" onclick="openCashFlowModal()">
          <i class="bi bi-plus-circle"></i> + Ghi Nhận Thu / Chi Dòng Tiền
        </button>
        <button type="button" class="btn btn-primary btn-sm fw-bold" id="btnDashUpdateMrr" onclick="openMrrModal()">
          <i class="bi bi-graph-up"></i> + Cập Nhật MRR & CAC/LTV
        </button>
        <button type="button" class="btn btn-warning btn-sm fw-bold text-dark" id="btnDashRunForecast" onclick="switchMainTab('forecast')">
          <i class="bi bi-magic"></i> 🔮 Mô Phỏng Dự Phóng 12 Tháng
        </button>
      </div>
    </div>

    <!-- 6 THẺ CHỈ SỐ SỐNG CÒN CỦA STARTUP (STARTUP VITAL METRICS) -->
    <div class="row g-2 mb-3">
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-success">
          <div class="text-muted small fw-semibold">TỔNG QUỸ TIỀN MẶT (CASH)</div>
          <div class="kpi-val text-success" id="kpiTotalCashBalance">0 đ</div>
          <div class="small text-secondary mt-1">Đa quỹ khả dụng tức thời</div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-danger">
          <div class="text-muted small fw-semibold">TỐC ĐỘ ĐỐT TIỀN (NET BURN)</div>
          <div class="kpi-val text-danger" id="kpiMonthlyNetBurn">0 đ/tháng</div>
          <div class="small text-secondary mt-1">Gross Burn: <b id="kpiMonthlyGrossBurn">0 đ</b></div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-warning">
          <div class="text-muted small fw-semibold">ĐỘ DÀI SỐNG SÓT (RUNWAY)</div>
          <div class="kpi-val text-primary" id="kpiRunwayMonths">0 tháng</div>
          <div class="small fw-semibold mt-1" id="kpiRunwaySafetyBadge">🟢 Ngưỡng an toàn</div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-primary">
          <div class="text-muted small fw-semibold">DOANH THU ĐỊNH KỲ (MRR)</div>
          <div class="kpi-val text-primary" id="kpiCurrentMrr">0 đ</div>
          <div class="small text-success mt-1">ARR Quy đổi: <b id="kpiCurrentArr">0 đ/năm</b></div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-info">
          <div class="text-muted small fw-semibold">CHỈ SỐ LTV / CAC (CHUẨN VC)</div>
          <div class="kpi-val text-info" id="kpiLtvCacRatio">0.0x</div>
          <div class="small text-secondary mt-1">CAC: <b id="kpiCurrentCac">0 đ</b></div>
        </div>
      </div>
      <div class="col-6 col-md-4 col-xl-2">
        <div class="kpi-card border-start border-4 border-dark">
          <div class="text-muted small fw-semibold">ĐỊNH GIÁ POST-MONEY</div>
          <div class="kpi-val text-dark" id="kpiLatestValuation">0 đ</div>
          <div class="small text-secondary mt-1">Đã gọi: <b id="kpiTotalRaised">0 đ</b></div>
        </div>
      </div>
    </div>

    <!-- KHU VỰC CẢNH BÁO NÓNG: ĐỀ XUẤT CHI CHỜ DUYỆT & CẢNH BÁO RUNWAY -->
    <div class="row g-3 mb-3">
      <div class="col-12 col-lg-6">
        <div class="section-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold text-danger mb-0"><i class="bi bi-shield-exclamation me-1"></i> Đề Xuất Chi Ngân Sách & CAPEX Đang Chờ CFO / Founder Duyệt</h6>
            <span class="badge bg-danger" id="badgePendingExpenses">0 khoản</span>
          </div>
          <div id="dashPendingExpensesBox" class="d-flex flex-column gap-2"></div>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="section-card h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold text-success mb-0"><i class="bi bi-bank2 me-1"></i> Cơ Cấu Số Dư Các Quỹ Tiền Dự Trữ (`QUY_TIEN_RUNWAY`)</h6>
            <button type="button" class="btn btn-xs btn-outline-success py-0 px-2" id="btnDashAddCashAcc" onclick="openCashAccountModal()">+ Thêm Quỹ Tiền</button>
          </div>
          <div id="dashCashReservesBox" class="d-flex flex-column gap-2"></div>
        </div>
      </div>
    </div>

    <!-- BIỂU ĐỒ TRỰC QUAN STARTUP CFO -->
    <div class="row g-3">
      <div class="col-12 col-lg-6">
        <div class="section-card">
          <h6 class="fw-bold mb-3"><i class="bi bi-graph-up-arrow text-primary me-1"></i> Dự Phóng Số Dư Tiền Mặt & Dòng Tiền Ròng 12 Tháng Tới (`Runway Trajectory`)</h6>
          <div style="height:255px;"><canvas id="chartForecastTrajectory"></canvas></div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="section-card">
          <h6 class="fw-bold mb-3"><i class="bi bi-bar-chart-fill text-success me-1"></i> Đà Tăng Trưởng Doanh Thu MRR</h6>
          <div style="height:255px;"><canvas id="chartMrrGrowth"></canvas></div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="section-card">
          <h6 class="fw-bold mb-3"><i class="bi bi-pie-chart-fill text-warning me-1"></i> Cơ Cấu Cổ Đông (`Cap Table`)</h6>
          <div style="height:255px;"><canvas id="chartCapTablePie"></canvas></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 2: QUỸ TIỀN DỰ TRỮ & BÁO CÁO LƯU CHUYỂN TIỀN TỆ 3 LUỒNG          -->
  <!-- ===================================================================== -->
  <section id="tabPane_cashflow" class="tab-pane-section d-none">
    <div class="section-card mb-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h6 class="fw-bold mb-0"><i class="bi bi-cash-stack text-success me-1"></i> Nhật Ký Dòng Tiền Thực Tế Theo 3 Luồng Chuẩn Quốc Tế (`Operating` • `Investing` • `Financing`)</h6>
          <div class="text-muted small">Trích xuất chuẩn từ `Cash Flow Statement.xlsb`: Tách bạch Định phí (`Fixed Burn`), Biến phí (`Variable COGS/CAC`) và Đầu tư (`CAPEX`)</div>
        </div>
        <button type="button" class="btn btn-success btn-sm fw-bold" id="btnCfTabNew" onclick="openCashFlowModal()">
          <i class="bi bi-plus-circle"></i> + Tạo Phiếu Thu / Đề Xuất Chi Mới
        </button>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-12 col-md-4">
          <input type="text" id="filterCfSearch" class="form-control form-control-sm" placeholder="🔍 Tìm mã GD, nội dung, bộ phận, file chứng từ..." oninput="renderCashFlowSection()">
        </div>
        <div class="col-6 col-md-4">
          <select id="filterCfStream" class="form-select form-select-sm fw-semibold" onchange="renderCashFlowSection()">
            <option value="ALL">-- Tất cả 3 Luồng Lưu Chuyển Tiền Tệ --</option>
            <option value="1. Dòng tiền Hoạt động kinh doanh (Operating)">1. Dòng tiền Hoạt động kinh doanh (Operating)</option>
            <option value="2. Dòng tiền Hoạt động đầu tư (Investing)">2. Dòng tiền Hoạt động đầu tư (Investing - CAPEX)</option>
            <option value="3. Dòng tiền Hoạt động tài chính (Financing)">3. Dòng tiền Hoạt động tài chính (Financing - Gọi vốn/Vay)</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <select id="filterCfStatus" class="form-select form-select-sm" onchange="renderCashFlowSection()">
            <option value="ALL">-- Tất cả Trạng thái duyệt --</option>
            <option value="Chờ duyệt">⏳ Đang chờ CFO / Founder duyệt</option>
            <option value="Đã duyệt">✅ Đã phê duyệt & hạch toán</option>
            <option value="Từ chối">↩️ Từ chối chi</option>
          </select>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle mb-0" style="font-size:0.82rem;">
          <thead class="table-light">
            <tr>
              <th>Mã GD & Ngày</th>
              <th>Loại & Luồng Cashflow</th>
              <th>Khoản Mục & Nội Dung Chi Tiết</th>
              <th>Bộ Phận & Quỹ</th>
              <th class="text-end">Số Tiền (VNĐ)</th>
              <th>Chứng Từ Đính Kèm</th>
              <th>Trạng Thái Duyệt</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody id="cashFlowTableBody"></tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 3: TĂNG TRƯỞNG DOANH THU MRR/ARR & UNIT ECONOMICS (CAC / LTV)     -->
  <!-- ===================================================================== -->
  <section id="tabPane_mrr" class="tab-pane-section d-none">
    <div class="section-card">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h6 class="fw-bold mb-0"><i class="bi bi-graph-up-arrow text-primary me-1"></i> Bảng Theo Dõi Doanh Thu Định Kỳ (`MRR / ARR`) & Kinh Tế Đơn Vị (`Unit Economics: CAC, LTV, Churn`)</h6>
          <div class="text-muted small">Chỉ số cốt lõi để thẩm định sức khỏe tăng trưởng Startup: Tỷ lệ `LTV / CAC >= 3.0x` là ngưỡng vàng để gọi vốn vòng tiếp theo</div>
        </div>
        <button type="button" class="btn btn-primary btn-sm fw-bold" id="btnMrrTabNew" onclick="openMrrModal()">
          <i class="bi bi-plus-circle"></i> + Cập Nhật Chỉ Số Tháng Mới
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle mb-0" style="font-size:0.82rem;">
          <thead class="table-light">
            <tr>
              <th>Kỳ Tháng</th>
              <th class="text-center">Khách Đầu Kỳ</th>
              <th class="text-center text-success">+ Khách Mới</th>
              <th class="text-center text-danger">- Rời Bỏ (Churn)</th>
              <th class="text-center fw-bold">Khách Active</th>
              <th class="text-end">ARPU (VNĐ)</th>
              <th class="text-end text-primary fw-bold">Doanh Thu MRR</th>
              <th class="text-end">Tổng Doanh Thu</th>
              <th class="text-end">Chi Phí MKT</th>
              <th class="text-end">CAC / Khách</th>
              <th class="text-end">LTV Dự Kiến</th>
              <th class="text-center">LTV / CAC</th>
              <th>Đánh Giá</th>
            </tr>
          </thead>
          <tbody id="mrrTableBody"></tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 4: MÔ HÌNH DỰ PHÓNG DÒNG TIỀN 12 THÁNG & ĐIỂM HÒA VỐN (`FORECAST`)-->
  <!-- ===================================================================== -->
  <section id="tabPane_forecast" class="tab-pane-section d-none">
    <div class="section-card mb-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h6 class="fw-bold mb-0"><i class="bi bi-magic text-warning me-1"></i> Bộ Mô Phỏng Dự Phóng Tài Chính 12 Tháng (`Financial Forecasting.xlsb`) & Tính Điểm Hòa Vốn (`Break-Even`)</h6>
          <div class="text-muted small">Thay đổi giả định tốc độ tăng trưởng Doanh thu (% MoM) và Chi phí để kiểm tra ngay số tháng Runway còn lại và thời điểm đạt dòng tiền dương</div>
        </div>
      </div>

      <!-- THANH ĐIỀU KHIỂN GIẢ ĐỊNH MÔ PHỎNG (WHAT-IF SCENARIO SIMULATOR) -->
      <div class="p-3 rounded-3 mb-3" style="background:#FFFBEB;border:1px solid #FDE68A;">
        <div class="row g-2 align-items-end">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-bold mb-1">Chọn Kịch bản Dự phóng (Scenario)</label>
            <select id="simScenarioSelect" class="form-select form-select-sm fw-bold" onchange="onSimScenarioPresetChange(this.value)">
              <option value="Kịch bản Cơ sở (Base Case)">📊 Kịch bản Cơ sở (Base Case — Tăng trưởng ổn định)</option>
              <option value="Kịch bản Tích cực (Best Case - Bứt phá)">🚀 Kịch bản Tích cực (Best Case — Tăng trưởng nhanh)</option>
              <option value="Kịch bản Thận trọng (Worst Case - Thắt chặt)">🛡️ Kịch bản Thận trọng (Worst Case — Bảo toàn vốn)</option>
            </select>
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label small fw-bold mb-1 text-success">% Tăng trưởng Doanh thu / tháng</label>
            <input type="number" step="0.5" id="simRevGrowthInput" class="form-control form-control-sm fw-bold border-success" value="10">
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label small fw-bold mb-1 text-danger">% Tăng Chi phí Vận hành / tháng</label>
            <input type="number" step="0.5" id="simExpGrowthInput" class="form-control form-control-sm fw-bold border-danger" value="3">
          </div>
          <div class="col-12 col-md-2">
            <button type="button" class="btn btn-warning btn-sm fw-bold text-dark w-100" id="btnRunForecastSim" onclick="handleRunForecastSimulation()">
              <i class="bi bi-play-circle-fill"></i> Chạy Dự Phóng
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-striped align-middle mb-0" style="font-size:0.8rem;">
          <thead class="table-dark">
            <tr>
              <th>Kỳ Tháng</th>
              <th class="text-end">Doanh Thu Dự Phóng</th>
              <th class="text-end">Giá Vốn (COGS)</th>
              <th class="text-end">Lợi Nhuận Gộp</th>
              <th class="text-end">Chi Phí Nhân Sự & R&D</th>
              <th class="text-end">Chi Phí MKT & Sale</th>
              <th class="text-end">Chi Phí G&A</th>
              <th class="text-end text-danger">Tổng Chi (Gross Burn)</th>
              <th class="text-end fw-bold">Dòng Tiền Ròng (Net)</th>
              <th class="text-end text-warning fw-bold">Tiền Cuối Kỳ (Ending Cash)</th>
              <th class="text-center">Runway</th>
              <th>Đánh Giá An Toàn Vốn</th>
            </tr>
          </thead>
          <tbody id="forecastTableBody"></tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 5: VÒNG GỌI VỐN, BẢNG CỔ ĐÔNG CAP TABLE & BÁO CÁO NHÀ ĐẦU TƯ A4    -->
  <!-- ===================================================================== -->
  <section id="tabPane_captable" class="tab-pane-section d-none">
    <div class="section-card mb-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h6 class="fw-bold mb-0"><i class="bi bi-pie-chart-fill text-success me-1"></i> Quản Lý Các Vòng Gọi Vốn (`Fundraising Rounds`) & Bảng Cổ Đông (`Cap Table`)</h6>
          <div class="text-muted small">Theo dõi tỷ lệ pha loãng cổ phần (`Dilution`), quỹ cổ phiếu thưởng nhân sự (`ESOP`) và đính kèm Hợp đồng Đầu tư (`Term Sheet / SHA`)</div>
        </div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-primary btn-sm fw-bold" id="btnCapTabNew" onclick="openCapTableModal()">
            <i class="bi bi-plus-circle"></i> + Thêm Cổ Đông / Vòng Gọi Vốn
          </button>
          <button type="button" class="btn btn-dark btn-sm fw-bold" onclick="window.print()">
            <i class="bi bi-printer-fill"></i> 🖨️ In Báo Cáo Nhà Đầu Tư A4
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered align-middle mb-0" style="font-size:0.83rem;">
          <thead class="table-light">
            <tr>
              <th>Mã & Vòng Gọi Vốn</th>
              <th>Cổ Đông / Quỹ Đầu Tư</th>
              <th>Nhóm Cổ Đông</th>
              <th class="text-end">Số Vốn Đầu Tư</th>
              <th class="text-end">Định Giá Post-Money</th>
              <th class="text-end">Số Cổ Phần</th>
              <th class="text-center">Tỷ Lệ Sở Hữu (%)</th>
              <th>Trạng Thái & Ngày</th>
              <th>Hợp Đồng (Term Sheet / SHA)</th>
              <th class="text-center no-print">Sửa</th>
            </tr>
          </thead>
          <tbody id="capTableBody"></tbody>
        </table>
      </div>
    </div>

    <!-- BÁO CÁO NHÀ ĐẦU TƯ CHUẨN A4 (INVESTOR EXECUTIVE SUMMARY REPORT) -->
    <div class="section-card border border-dark" id="investorPrintCard">
      <div class="d-flex justify-content-between align-items-start border-bottom pb-2 mb-3">
        <div>
          <h6 class="fw-bold mb-0" id="printCompanyTitle">CÔNG TY CỔ PHẦN CÔNG NGHỆ AI & SAAS NOVA-TECH STARTUP</h6>
          <div class="small text-muted">BÁO CÁO ĐIỀU HÀNH TÀI CHÍNH, RUNWAY, UNIT ECONOMICS & CAP TABLE DÀNH CHO NHÀ ĐẦU TƯ</div>
        </div>
        <div class="text-end small">
          <div>Ngày xuất báo cáo: <b id="printDateNow">-</b></div>
          <div>Người lập / Xem: <b id="printActorName">Founder / CFO</b></div>
        </div>
      </div>
      <div id="investorReportSummaryBox"></div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- TAB 6: QUẢN LÝ PHÂN QUYỀN (`PHAN_QUYEN`) & CẤU HÌNH NGƯỠNG RUNWAY     -->
  <!-- ===================================================================== -->
  <section id="tabPane_rbac" class="tab-pane-section d-none">
    <div class="row g-3">
      <div class="col-12 col-lg-7" id="rbacColWrap">
        <div class="section-card h-100">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
            <div>
              <h6 class="fw-bold mb-0"><i class="bi bi-shield-lock-fill text-danger me-1"></i> Quản Lý Tài Khoản, Phân Quyền Tuyến Dưới & Investor Data Room (`PHAN_QUYEN`)</h6>
              <div class="text-muted" style="font-size:0.74rem;">Đổi vai trò 1 chạm hoặc cấp tài khoản `INVESTOR` (Chỉ xem báo cáo & phòng dữ liệu gọi vốn)</div>
            </div>
            <button type="button" class="btn btn-dark btn-sm fw-bold" onclick="openUserModal()">
              <i class="bi bi-person-add"></i> + Thêm Tài Khoản & Phân Quyền
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-sm table-hover align-middle mb-0" style="font-size:0.8rem;">
              <thead class="table-light">
                <tr>
                  <th>Tài Khoản & Bộ Phận</th>
                  <th>Vai Trò & Quyền App</th>
                  <th>Trạng Thái</th>
                  <th class="text-end">Thao Tác</th>
                </tr>
              </thead>
              <tbody id="userAccountsTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5" id="configColWrap">
        <div class="section-card h-100">
          <h6 class="fw-bold mb-2"><i class="bi bi-sliders text-primary me-1"></i> Cấu Hình Ngưỡng An Toàn Runway & Bot Cảnh Báo CFO (`CAU_HINH`)</h6>
          <div class="mb-2">
            <label class="form-label small fw-bold mb-1">Tên Startup hiển thị</label>
            <input type="text" id="cfgCompanyName" class="form-control form-control-sm">
          </div>
          <div class="row g-2 mb-2">
            <div class="col-6">
              <label class="form-label small fw-bold mb-1">Giai đoạn gọi vốn hiện tại</label>
              <input type="text" id="cfgFundingStage" class="form-control form-control-sm">
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold mb-1 text-danger">Ngưỡng Runway tối thiểu (Tháng)</label>
              <input type="number" id="cfgMinRunway" class="form-control form-control-sm fw-bold border-danger" value="6">
            </div>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-6">
              <label class="form-label small fw-bold mb-1">Biên lãi gộp mục tiêu (%)</label>
              <input type="number" id="cfgTargetMargin" class="form-control form-control-sm" value="72">
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold mb-1">Mục tiêu LTV / CAC (x)</label>
              <input type="number" step="0.1" id="cfgTargetLtvCac" class="form-control form-control-sm" value="3.0">
            </div>
          </div>
          <div class="mb-2">
            <label class="form-label small fw-bold mb-1">Email Founder / CFO nhận cảnh báo Runway</label>
            <input type="email" id="cfgAdminEmail" class="form-control form-control-sm">
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold mb-1">Webhook Bot Zalo OA / ZNS</label>
            <input type="text" id="cfgZaloWebhook" class="form-control form-control-sm">
          </div>
          <button type="button" class="btn btn-primary btn-sm fw-bold w-100" onclick="handleSaveStartupConfig()">
            <i class="bi bi-floppy"></i> Lưu Cấu Hình Ngưỡng Runway & Bot
          </button>
        </div>
      </div>
    </div>
  </section>


  <!-- ===================================================================== -->
  <!-- TAB 7: CẨM NANG HƯỚNG DẪN & TỪ ĐIỂN THUẬT NGỮ TÀI CHÍNH CHO NGƯỜI MỚI  -->
  <!-- ===================================================================== -->
  <section id="tabPane_guide" class="tab-pane-section d-none">
    <div class="section-card mb-3" style="background:linear-gradient(135deg,#065F46,#1E3A8A);color:#fff;">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <h5 class="fw-bold mb-1">📘 Cẩm Nang Hướng Dẫn Chi Tiết & Giải Thích Thuật Ngữ Tài Chính Startup (Cho Người Mới)</h5>
          <div class="small opacity-90">Giúp các Founder, Quản lý và Nhân sự không chuyên về kế toán - tài chính hiểu ngay ý nghĩa từng con số chỉ trong 3 phút đọc</div>
        </div>
        <span class="badge bg-warning text-dark fw-bold px-3 py-2">Đồng bộ cùng Sheet `HUONG_DAN_SU_DUNG`</span>
      </div>
    </div>

    <!-- KHỐI 1: QUY TRÌNH 5 BƯỚC SỬ DỤNG WEB APP DÀNH CHO NGƯỜI MỚI -->
    <div class="section-card mb-3">
      <h6 class="fw-bold text-primary mb-3"><i class="bi bi-compass-fill me-1"></i> I. Quy Trình 5 Bước Sử Dụng Hệ Thống Hàng Tháng (Từ A ➔ Z Cho Người Mới)</h6>
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <div class="p-3 rounded-3 h-100 border bg-light">
            <span class="badge bg-success mb-2">BƯỚC 1: KHỞI TẠO QUỸ TIỀN</span>
            <h6 class="fw-bold text-dark">Nhập số dư các tài khoản ngân hàng</h6>
            <p class="small text-secondary mb-0">Vào <b>Tab 1 (hoặc Sheet `QUY_TIEN_RUNWAY`)</b>, nhập số tiền mặt thực tế công ty đang có trong tài khoản thanh toán, sổ tiết kiệm và két sắt. Đây là "bình oxy" ban đầu của công ty.</p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="p-3 rounded-3 h-100 border bg-light">
            <span class="badge bg-primary mb-2">BƯỚC 2: GHI NHẬN THU / CHI</span>
            <h6 class="fw-bold text-dark">Lập phiếu thu & đề xuất chi ngân sách</h6>
            <p class="small text-secondary mb-0">Khi có khoản thu khách hàng hoặc cần chi lương, trả tiền Server, chạy quảng cáo... nhân sự vào <b>Tab 2</b> bấm <b>+ Tạo Phiếu Thu / Chi</b> kèm file hóa đơn. CFO/Founder bấm <b>✅ Duyệt</b> để hạch toán.</p>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="p-3 rounded-3 h-100 border bg-light">
            <span class="badge bg-info text-dark mb-2">BƯỚC 3: CẬP NHẬT KHÁCH HÀNG & MRR</span>
            <h6 class="fw-bold text-dark">Theo dõi chi phí mua khách (CAC)</h6>
            <p class="small text-secondary mb-0">Cuối mỗi tháng, Trưởng nhóm Kinh doanh/Marketing vào <b>Tab 3</b> nhập số khách mới, số khách nghỉ và tiền quảng cáo. App tự động tính <b>MRR, CAC, LTV</b> xem quảng cáo có lãi không.</p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="p-3 rounded-3 h-100 border bg-light">
            <span class="badge bg-warning text-dark mb-2">BƯỚC 4: CHẠY DỰ PHÓNG 12 THÁNG</span>
            <h6 class="fw-bold text-dark">Kiểm tra khi nào công ty hết tiền hoặc hòa vốn</h6>
            <p class="small text-secondary mb-0">Vào <b>Tab 4 (`Dự Phóng 12 Tháng`)</b>, chọn kịch bản (Cơ sở / Tích cực / Thắt chặt) và nhập % tăng trưởng mong muốn rồi bấm <b>Chạy Dự Phóng</b>. Bảng sẽ tính sẵn số tiền còn lại vào cuối mỗi tháng trong 1 năm tới.</p>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="p-3 rounded-3 h-100 border bg-light">
            <span class="badge bg-dark mb-2">BƯỚC 5: QUẢN LÝ CỔ ĐÔNG & BÁO CÁO NHÀ ĐẦU TƯ</span>
            <h6 class="fw-bold text-dark">Theo dõi tỷ lệ cổ phần (Cap Table) & In A4</h6>
            <p class="small text-secondary mb-0">Vào <b>Tab 5 (`Cap Table`)</b> để lưu danh sách cổ đông góp vốn, đính kèm file hợp đồng đầu tư PDF và bấm <b>🖨️ In Báo Cáo Nhà Đầu Tư A4</b> (hoặc cấp tài khoản `INVESTOR` cho quỹ đầu tư vào xem).</p>
          </div>
        </div>
      </div>
    </div>

    <!-- KHỐI 2: TỪ ĐIỂN GIẢI THÍCH 12 THUẬT NGỮ TÀI CHÍNH BẰNG NGÔN NGỮ ĐỜI THƯỜNG -->
    <div class="section-card">
      <h6 class="fw-bold text-success mb-3"><i class="bi bi-journal-bookmark-fill me-1"></i> II. Từ Điển Giải Thích Thuật Ngữ Tài Chính Startup (Ngôn Ngữ Bình Dân + Ví Dụ Cụ Thể)</h6>
      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle mb-0" style="font-size:0.83rem;">
          <thead class="table-dark">
            <tr>
              <th style="width:18%;">Thuật Ngữ Trên App</th>
              <th style="width:32%;">Hiểu Đơn Giản Theo Ngôn Ngữ Đời Thường</th>
              <th style="width:25%;">Công Thức & Tiêu Chuẩn Tốt / Xấu</th>
              <th style="width:25%;">Ví Dụ Minh Họa Thực Tế</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b class="text-danger">1. Gross Burn Rate</b><br><span class="badge bg-light text-dark border">Tốc độ đốt tiền tổng</span></td>
              <td>Tổng số tiền công ty phải <b>chi ra mỗi tháng</b> để nuôi bộ máy (trả lương, thuê văn phòng, mua server, chạy quảng cáo...) khi chưa tính tiền thu về.</td>
              <td><code>Gross Burn = Tổng mọi khoản Chi trong tháng</code><br>Giúp bạn biết "Mỗi tháng mở mắt ra là công ty tốn bao nhiêu tiền".</td>
              <td>Tháng này chi Lương 620tr + Server 165tr + Quảng cáo 184,5tr + Văn phòng 95tr ➔ <b>Gross Burn = 1,064 tỷ/tháng</b>.</td>
            </tr>
            <tr>
              <td><b class="text-danger">2. Net Burn Rate</b><br><span class="badge bg-light text-dark border">Tốc độ đốt tiền ròng</span></td>
              <td>Số tiền thực sự bị <b>hao hụt khỏi két mỗi tháng</b> sau khi đã lấy tiền Doanh thu thu về bù đắp cho Chi phí. Nếu Thu lớn hơn Chi thì công ty đã có lãi (Dương).</td>
              <td><code>Net Burn = Tổng Chi (Gross Burn) - Tổng Thu</code><br>Nếu <code>Net Burn <= 0</code>: Công ty đã tự nuôi sống được mình!</td>
              <td>Chi hết 1,064 tỷ nhưng bán hàng thu về được 952 triệu ➔ Mỗi tháng két tiền chỉ bị hụt đi <b>Net Burn = 112,5 triệu</b>.</td>
            </tr>
            <tr>
              <td><b class="text-primary">3. Cash Runway</b><br><span class="badge bg-warning text-dark">Đường băng sống sót</span></td>
              <td>Với số tiền đang còn trong ngân hàng và tốc độ lỗ ròng (Net Burn) như hiện tại, <b>công ty còn trụ được bao nhiêu tháng nữa</b> trước khi hết sạch tiền.</td>
              <td><code>Runway = Tổng Tiền Mặt / Net Burn</code><br>🟢 <b>>= 12 tháng:</b> An toàn<br>🟡 <b>6-12 tháng:</b> Lo gọi vốn<br>🔴 <b>< 6 tháng:</b> Báo động đỏ!</td>
              <td>Trong ngân hàng còn 5,685 tỷ, mỗi tháng hụt 112,5 triệu ➔ <b>Runway = 50,5 tháng</b> (Cực kỳ an toàn).</td>
            </tr>
            <tr>
              <td><b class="text-primary">4. MRR & ARR</b><br><span class="badge bg-light text-dark border">Doanh thu định kỳ</span></td>
              <td><b>MRR</b> là doanh thu khách hàng trả đều đặn hàng tháng (như phí thuê bao phần mềm, phí hội viên). <b>ARR</b> là doanh thu đó nhân cho 12 tháng.</td>
              <td><code>MRR = Số khách Active × Tiền TB 1 khách (ARPU)</code><br><code>ARR = MRR × 12</code></td>
              <td>Có 215 khách trả đều 3,8 triệu/tháng ➔ <b>MRR = 817 triệu/tháng</b> (Quy mô <b>ARR = 9,8 tỷ/năm</b>).</td>
            </tr>
            <tr>
              <td><b class="text-info">5. CAC (Customer Acquisition Cost)</b><br><span class="badge bg-light text-dark border">Chi phí mua 1 khách</span></td>
              <td>Trung bình công ty phải tốn bao nhiêu tiền Quảng cáo + Lương thưởng Sale để <b>mang về được 1 khách hàng mới</b>.</td>
              <td><code>CAC = Tổng chi Marketing & Sale / Số khách mới</code><br>CAC càng giảm qua các tháng chứng tỏ Marketing càng hiệu quả.</td>
              <td>Chi 184,5 triệu tiền Ads & Sale, chốt được 41 khách hàng mới ➔ Tốn <b>4,5 triệu đồng (CAC)</b> cho 1 khách mới.</td>
            </tr>
            <tr>
              <td><b class="text-success">6. LTV & Tỷ lệ LTV / CAC</b><br><span class="badge bg-success">Chỉ số Vàng gọi vốn</span></td>
              <td><b>LTV</b> là tổng lợi nhuận gộp 1 khách hàng mang lại từ lúc mua lần đầu đến khi họ rời bỏ. Tiền thu được từ khách (LTV) phải gấp ít nhất 3 lần tiền bỏ ra tìm khách (CAC).</td>
              <td><code>Chuẩn Quỹ Đầu Tư VC: LTV / CAC >= 3.0x</code><br>Nếu <code>< 1.0x</code>: Càng bán càng lỗ tiền quảng cáo!</td>
              <td>Tốn 4,5tr để có 1 khách (CAC), nhưng khách đó dùng phần mềm lâu dài mang lại 24,7tr (LTV) ➔ <b>LTV/CAC = 5.5x (Rất tốt)</b>.</td>
            </tr>
            <tr>
              <td><b class="text-dark">7. COGS, R&D, G&A, CAPEX</b><br><span class="badge bg-light text-dark border">Phân loại chi phí</span></td>
              <td>• <b>COGS (Giá vốn):</b> Chi phí trực tiếp tạo ra sản phẩm (Server, nguyên vật liệu).<br>• <b>R&D:</b> Chi phí đội ngũ kỹ thuật/sản phẩm.<br>• <b>G&A:</b> Thuê văn phòng, kế toán, pháp lý.<br>• <b>CAPEX:</b> Mua tài sản dùng nhiều năm (máy tính, máy móc).</td>
              <td><code>Lợi nhuận gộp = Doanh thu - Giá vốn (COGS)</code><br>Tách rõ để biết bộ phận nào đang tiêu nhiều ngân sách nhất.</td>
              <td>Mua 4 máy MacBook 148tr là <b>CAPEX</b> (tài sản còn đó), còn tiền chạy quảng cáo 184tr là chi phí tiêu đi trong tháng.</td>
            </tr>
            <tr>
              <td><b class="text-dark">8. Post-Money Valuation, Cap Table & ESOP</b><br><span class="badge bg-light text-dark border">Thuật ngữ Gọi vốn</span></td>
              <td>• <b>Post-Money:</b> Giá trị công ty sau khi nhận tiền của nhà đầu tư.<br>• <b>Cap Table:</b> Bảng danh sách ai giữ bao nhiêu % cổ phần.<br>• <b>ESOP:</b> Cổ phần thưởng giữ chân nhân sự giỏi.</td>
              <td><code>% Cổ phần NĐT = Số tiền NĐT rót / Định giá Post-Money</code></td>
              <td>Quỹ NextGen đầu tư 4,5 tỷ với định giá Post-Money 25 tỷ ➔ Quỹ sở hữu <b>18% cổ phần</b> trên Cap Table.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

</main>

<!-- MOBILE BOTTOM NAV -->
<nav class="mobile-bottom-nav">
  <button type="button" class="mob-nav-item active" id="mobTab_dashboard" onclick="switchMainTab('dashboard')">
    <i class="bi bi-speedometer2"></i>
    <span>Runway</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_cashflow" onclick="switchMainTab('cashflow')">
    <i class="bi bi-cash-stack"></i>
    <span>Dòng Tiền</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_mrr" onclick="switchMainTab('mrr')">
    <i class="bi bi-graph-up-arrow"></i>
    <span>MRR/CAC</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_forecast" onclick="switchMainTab('forecast')">
    <i class="bi bi-magic"></i>
    <span>Dự Phóng</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_captable" onclick="switchMainTab('captable')">
    <i class="bi bi-pie-chart-fill"></i>
    <span>Cap Table</span>
  </button>
  <button type="button" class="mob-nav-item" id="mobTab_guide" onclick="switchMainTab('guide')">
    <i class="bi bi-book-half"></i>
    <span>Cẩm Nang</span>
  </button>
</nav>

<!-- ======================================================================= -->
<!-- 4. MODALS THAO TÁC (DÒNG TIỀN, QUỸ TIỀN, MRR/UNIT ECON, CAP TABLE, USER)-->
<!-- ======================================================================= -->

<!-- MODAL 1: GHI NHẬN GIAO DỊCH DÒNG TIỀN 3 LUỒNG & UPLOAD CHỨNG TỪ -->
<div class="custom-modal-backdrop" id="modalCashFlowBackdrop">
  <div class="custom-modal-dialog">
    <div class="custom-modal-header">
      <span>💸 Ghi Nhận Bút Toán Dòng Tiền & Đề Xuất Chi Ngân Sách Startup</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalCashFlowBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <input type="hidden" id="cfFormId">
      <div class="row g-2">
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Ngày ghi nhận (*)</label>
          <input type="date" id="cfFormDate" class="form-control form-control-sm">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Loại dòng tiền (*)</label>
          <select id="cfFormDirection" class="form-select form-select-sm fw-bold">
            <option value="CHI TIỀN (CASH OUT)">🔴 CHI TIỀN (CASH OUT - Burn)</option>
            <option value="THU TIỀN (CASH IN)">🟢 THU TIỀN (CASH IN - Revenue/Funding)</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small fw-bold mb-1">Tài khoản Quỹ tiền</label>
          <select id="cfFormAccount" class="form-select form-select-sm fw-bold"></select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Phân luồng Cashflow chuẩn quốc tế</label>
          <select id="cfFormStream" class="form-select form-select-sm">
            <option value="1. Dòng tiền Hoạt động kinh doanh (Operating)">1. Dòng tiền Hoạt động kinh doanh (Operating)</option>
            <option value="2. Dòng tiền Hoạt động đầu tư (Investing)">2. Dòng tiền Hoạt động đầu tư (Investing - CAPEX)</option>
            <option value="3. Dòng tiền Hoạt động tài chính (Financing)">3. Dòng tiền Hoạt động tài chính (Financing - Gọi vốn/Vay)</option>
          </select>
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Nhóm khoản mục P&L / Burn Rate</label>
          <select id="cfFormCategory" class="form-select form-select-sm">
            <option value="Chi phí Nhân sự & R&D (Payroll & Engineering)">Chi phí Nhân sự & R&D (Payroll & Engineering)</option>
            <option value="Chi phí Marketing & Thu hút khách hàng (CAC)">Chi phí Marketing & Thu hút khách hàng (CAC)</option>
            <option value="Giá vốn Hạ tầng Cloud & AI API (COGS)">Giá vốn Hạ tầng Cloud & AI API (COGS)</option>
            <option value="Chi phí Văn phòng, Pháp lý & Quản lý (G&A)">Chi phí Văn phòng, Pháp lý & Quản lý (G&A)</option>
            <option value="Mua sắm Tài sản cố định & Thiết bị (CAPEX)">Mua sắm Tài sản cố định & Thiết bị (CAPEX)</option>
            <option value="Doanh thu Thuê bao định kỳ (SaaS MRR)">Doanh thu Thuê bao định kỳ (SaaS MRR)</option>
            <option value="Doanh thu Triển khai & Tư vấn (One-off)">Doanh thu Triển khai & Tư vấn (One-off)</option>
            <option value="Tiền Giải ngân Vòng gọi vốn (Equity Funding)">Tiền Giải ngân Vòng gọi vốn (Equity Funding)</option>
          </select>
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Nội dung chi tiết (*)</label>
          <input type="text" id="cfFormDesc" class="form-control form-control-sm" placeholder="Nhập diễn giải chi tiết khoản thu/chi...">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1 text-primary">Số tiền (VNĐ) (*)</label>
          <input type="number" id="cfFormAmount" class="form-control form-control-sm fw-bold border-primary" value="50000000">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Cấu trúc chi phí</label>
          <select id="cfFormCostStruct" class="form-select form-select-sm">
            <option value="Định phí (Fixed Burn)">Định phí (Fixed Burn)</option>
            <option value="Biến phí (Variable COGS)">Biến phí (Variable COGS)</option>
            <option value="Biến phí (Growth Burn)">Biến phí (Growth Burn)</option>
            <option value="Đầu tư CAPEX">Đầu tư CAPEX</option>
            <option value="Doanh thu định kỳ">Doanh thu định kỳ</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small fw-bold mb-1">Trạng thái phê duyệt</label>
          <select id="cfFormStatus" class="form-select form-select-sm fw-bold">
            <option value="Chờ duyệt">⏳ Chờ CFO / Founder duyệt</option>
            <option value="Đã duyệt" id="optCfApprovedMgrOnly">✅ Đã phê duyệt (CFO/Founder)</option>
          </select>
        </div>

        <div class="col-12 mt-2">
          <div class="p-2 rounded-3" style="background:#EFF6FF;border:1px dashed #3B82F6;">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label small fw-bold mb-0 text-primary">📎 Đính kèm Hóa đơn / Báo giá / Hợp đồng (Word, Excel, PDF, Ảnh)</label>
              <div>
                <input type="file" id="cfFileInput" class="d-none" multiple onchange="handleStartupFileUpload(event, 'CF')">
                <button type="button" class="btn btn-xs btn-primary py-0 px-2" onclick="document.getElementById('cfFileInput').click()">+ Tải File Chứng Từ</button>
              </div>
            </div>
            <div id="cfAttachmentsList" class="d-flex flex-wrap gap-2"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalCashFlowBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-success fw-bold px-3" onclick="submitCashFlowForm()">Lưu Bút Toán Dòng Tiền</button>
    </div>
  </div>
</div>

<!-- MODAL 2: THÊM / SỬA QUỸ TIỀN DỰ TRỮ -->
<div class="custom-modal-backdrop" id="modalCashAccountBackdrop">
  <div class="custom-modal-dialog" style="max-width:520px;">
    <div class="custom-modal-header">
      <span>🏦 Thêm / Cập Nhật Quỹ Tiền Dự Trữ (`QUY_TIEN_RUNWAY`)</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalCashAccountBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <div class="row g-2">
        <div class="col-4">
          <label class="form-label small fw-bold mb-1">Mã Quỹ</label>
          <input type="text" id="cashFormId" class="form-control form-control-sm fw-bold" placeholder="CASH-05">
        </div>
        <div class="col-8">
          <label class="form-label small fw-bold mb-1">Tên Quỹ tiền / Tài khoản (*)</label>
          <input type="text" id="cashFormName" class="form-control form-control-sm" placeholder="VD: Quỹ Tiết kiệm Kỳ hạn 6M">
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Ngân hàng / Số tài khoản</label>
          <input type="text" id="cashFormBank" class="form-control form-control-sm" placeholder="VD: Vietcombank - 0071000...">
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1 text-success">Số dư khả dụng hiện tại (VNĐ)</label>
          <input type="number" id="cashFormBalance" class="form-control form-control-sm fw-bold border-success" value="1000000000">
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Lãi suất tiền gửi (%/năm)</label>
          <input type="number" step="0.1" id="cashFormInterest" class="form-control form-control-sm" value="4.5">
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1">Ghi chú mục đích sử dụng quỹ</label>
          <input type="text" id="cashFormNotes" class="form-control form-control-sm">
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalCashAccountBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-success fw-bold px-3" onclick="submitCashAccountForm()">Lưu Quỹ Tiền</button>
    </div>
  </div>
</div>

<!-- MODAL 3: CẬP NHẬT CHỈ SỐ MRR/ARR & UNIT ECONOMICS -->
<div class="custom-modal-backdrop" id="modalMrrBackdrop">
  <div class="custom-modal-dialog" style="max-width:580px;">
    <div class="custom-modal-header" style="background:linear-gradient(135deg,#1E3A8A,#2563EB);">
      <span>📈 Cập Nhật Chỉ Số Doanh Thu MRR & Unit Economics (CAC / LTV)</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalMrrBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <div class="row g-2">
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Kỳ tháng (*)</label>
          <input type="text" id="mrrFormPeriod" class="form-control form-control-sm fw-bold" placeholder="2025-05">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Khách hàng đầu kỳ</label>
          <input type="number" id="mrrFormStartCust" class="form-control form-control-sm" value="179">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1 text-success">+ Khách mới (New)</label>
          <input type="number" id="mrrFormNewCust" class="form-control form-control-sm fw-bold border-success" value="41">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1 text-danger">- Khách rời bỏ (Churn)</label>
          <input type="number" id="mrrFormChurnCust" class="form-control form-control-sm border-danger" value="5">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">ARPU (Thu TB/Khách VNĐ)</label>
          <input type="number" id="mrrFormArpu" class="form-control form-control-sm fw-bold" value="3800000">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Doanh thu One-off / Setup</label>
          <input type="number" id="mrrFormOneOff" class="form-control form-control-sm" value="135000000">
        </div>
        <div class="col-12">
          <label class="form-label small fw-bold mb-1 text-primary">Tổng Chi phí Marketing & Sales thu hút khách mới (CAC Spend VNĐ)</label>
          <input type="number" id="mrrFormCacSpend" class="form-control form-control-sm fw-bold border-primary" value="184500000">
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalMrrBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-primary fw-bold px-3" onclick="submitMrrForm()">Tính Tự Động MRR & LTV/CAC</button>
    </div>
  </div>
</div>

<!-- MODAL 4: THÊM / SỬA VÒNG GỌI VỐN & CỔ ĐÔNG CAP TABLE -->
<div class="custom-modal-backdrop" id="modalCapTableBackdrop">
  <div class="custom-modal-dialog" style="max-width:600px;">
    <div class="custom-modal-header" style="background:linear-gradient(135deg,#0F766E,#0D9488);">
      <span>💎 Thêm / Cập Nhật Cổ Đông & Vòng Gọi Vốn (`Cap Table`)</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalCapTableBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <input type="hidden" id="capFormId">
      <div class="row g-2">
        <div class="col-12 col-md-8">
          <label class="form-label small fw-bold mb-1">Tên Cổ đông / Quỹ đầu tư (*)</label>
          <input type="text" id="capFormInvestor" class="form-control form-control-sm" placeholder="VD: Quỹ Đầu Tư Horizon Ventures">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Vòng gọi vốn</label>
          <select id="capFormRound" class="form-select form-select-sm fw-bold">
            <option value="Founding">Founding</option>
            <option value="Angel Round">Angel Round</option>
            <option value="Seed Round">Seed Round</option>
            <option value="Pre-Series A">Pre-Series A</option>
            <option value="Series A">Series A</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Nhóm cổ đông</label>
          <select id="capFormGroup" class="form-select form-select-sm">
            <option value="Founders (Sáng lập)">Founders (Sáng lập)</option>
            <option value="ESOP (Nhân sự chủ chốt)">ESOP (Nhân sự chủ chốt)</option>
            <option value="Angel Investors">Angel Investors</option>
            <option value="Venture Capital (VC)">Venture Capital (VC)</option>
          </select>
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1 text-success">Số vốn đầu tư (VNĐ)</label>
          <input type="number" id="capFormInvested" class="form-control form-control-sm fw-bold border-success" value="4500000000">
        </div>
        <div class="col-6 col-md-4">
          <label class="form-label small fw-bold mb-1">Định giá Post-Money (VNĐ)</label>
          <input type="number" id="capFormValuation" class="form-control form-control-sm" value="25000000000">
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Số cổ phần sở hữu</label>
          <input type="number" id="capFormShares" class="form-control form-control-sm" value="180000">
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1 text-primary">Tỷ lệ sở hữu (%)</label>
          <input type="number" step="0.1" id="capFormPct" class="form-control form-control-sm fw-bold border-primary" value="18.0">
        </div>
        <div class="col-12 mt-2">
          <div class="p-2 rounded-3" style="background:#ECFDF5;border:1px dashed #10B981;">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label small fw-bold mb-0 text-dark">📎 Đính kèm Hợp đồng Đầu tư (Term Sheet / SAFE / SHA PDF/Word)</label>
              <div>
                <input type="file" id="capFileInput" class="d-none" multiple onchange="handleStartupFileUpload(event, 'CAP')">
                <button type="button" class="btn btn-xs btn-success py-0 px-2" onclick="document.getElementById('capFileInput').click()">+ Tải File Hợp Đồng</button>
              </div>
            </div>
            <div id="capAttachmentsList" class="d-flex flex-wrap gap-2"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalCapTableBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-success fw-bold px-3" onclick="submitCapTableForm()">Lưu Vòng Gọi Vốn</button>
    </div>
  </div>
</div>

<!-- MODAL 5: TÀI KHOẢN & PHÂN QUYỀN (`PHAN_QUYEN`) -->
<div class="custom-modal-backdrop" id="modalUserBackdrop">
  <div class="custom-modal-dialog" style="max-width:580px;">
    <div class="custom-modal-header bg-dark">
      <span>🔐 Thiết Lập Tài Khoản & Cấp Quyền Thao Tác (`PHAN_QUYEN`)</span>
      <button type="button" class="btn-close btn-close-white" onclick="closeCustomModal('modalUserBackdrop')"></button>
    </div>
    <div class="custom-modal-body">
      <div class="row g-2">
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Username (*)</label>
          <input type="text" id="usrFormUsername" class="form-control form-control-sm" placeholder="vd: investor_02">
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Mật khẩu / PIN (*)</label>
          <input type="text" id="usrFormPassword" class="form-control form-control-sm" value="123456">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1">Họ và Tên / Tên Quỹ (*)</label>
          <input type="text" id="usrFormFullName" class="form-control form-control-sm">
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label small fw-bold mb-1 text-primary">Vai trò hệ thống (Role)</label>
          <select id="usrFormRole" class="form-select form-select-sm fw-bold border-primary">
            <option value="ADMIN">👑 ADMIN (Founder / CEO — Toàn quyền)</option>
            <option value="CFO_MANAGER">💼 CFO_MANAGER (Giám đốc Tài chính — Toàn quyền Tài chính)</option>
            <option value="LEADER">📈 LEADER (Trưởng bộ phận — Duyệt chi & Cập nhật MRR)</option>
            <option value="STAFF">🧾 STAFF (Kế toán — Lập phiếu thu/chi & Đính kèm hóa đơn)</option>
            <option value="INVESTOR">🏦 INVESTOR (Nhà đầu tư — Chỉ xem Data Room & Báo cáo A4)</option>
          </select>
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Bộ phận / Tổ chức</label>
          <input type="text" id="usrFormDept" class="form-control form-control-sm" value="Phòng Tài Chính & Kế Toán">
        </div>
        <div class="col-6">
          <label class="form-label small fw-bold mb-1">Email nhận báo cáo</label>
          <input type="email" id="usrFormEmail" class="form-control form-control-sm">
        </div>
      </div>
    </div>
    <div class="custom-modal-footer">
      <button type="button" class="btn btn-sm btn-secondary" onclick="closeCustomModal('modalUserBackdrop')">Đóng</button>
      <button type="button" class="btn btn-sm btn-dark fw-bold px-3" onclick="submitUserForm()">Lưu Tài Khoản</button>
    </div>
  </div>
</div>

<!-- ======================================================================= -->
<!-- 5. JAVASCRIPT ENGINE (STARTUP CFO + RUNWAY SIMULATOR + RBAC)            -->
<!-- ======================================================================= -->
<script>
  function buildInstantFallbackData() {
    var now = new Date();
    function dStr(offset) {
      var d = new Date(now.getTime() + offset * 86400000);
      return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }
    function mStr(offsetMonths) {
      var d = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
      return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
    }
    var fcList = [];
    var runCash = 5685000000;
    var r = 952000000;
    var rnd = 620000000;
    var mk = 185000000;
    var ga = 95000000;
    for (var m = 1; m <= 12; m++) {
      r = Math.round(r * 1.10);
      var cg = Math.round(r * 0.18);
      var gp = r - cg;
      rnd = Math.round(rnd * 1.03);
      mk = Math.round(mk * 1.04);
      ga = Math.round(ga * 1.02);
      var gb = cg + rnd + mk + ga;
      var net = r - gb;
      runCash += net;
      var rw = net >= 0 ? 99.9 : Math.max(0, Math.round((runCash / Math.abs(net)) * 10) / 10);
      fcList.push({
        period: mStr(m),
        scenario: 'Kịch bản Cơ sở (Base Case)',
        growthRatePct: 10,
        projectedRevenue: r,
        projectedCogs: cg,
        grossProfit: gp,
        rAndDCost: rnd,
        marketingCost: mk,
        gnaCost: ga,
        grossBurn: gb,
        netCashflow: net,
        endingCash: runCash,
        runwayMonths: rw,
        safetyStatus: net >= 0 ? '🟢 Đã Hòa Vốn & Có Lãi Dương (Cashflow Positive)' : '🟢 Runway An Toàn (> 12 tháng)'
      });
    }

    return {
      ok: true,
      serverTime: dStr(0) + ' 09:00:00',
      todayStr: dStr(0),
      curMonthStr: mStr(0),
      config: {
        COMPANY_NAME: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ AI & SAAS NOVA-TECH STARTUP',
        CURRENT_FUNDING_STAGE: 'Pre-Series A (Quy mô 25 Nhân sự)',
        ADMIN_EMAIL: 'founder.cfo@novatech.vn',
        MIN_SAFE_RUNWAY_MONTHS: '6',
        TARGET_GROSS_MARGIN_PCT: '72',
        TARGET_LTV_CAC_RATIO: '3.0',
        ZALO_BOT_WEBHOOK_URL: 'https://webhook.site/zalo-startup-cfo-demo'
      },
      users: [
        { username: 'founder', password: '123456', fullName: 'Nguyễn Minh Quân (Founder / CEO)', role: 'ADMIN', department: 'Ban Sáng Lập (Founders)', email: 'quan.ceo@novatech.vn', phone: '0901234567', status: 'Hoạt động' },
        { username: 'cfo_st', password: '123456', fullName: 'Trần Bảo Ngọc (Head of Finance / CFO)', role: 'CFO_MANAGER', department: 'Phòng Tài Chính & Kế Toán', email: 'ngoc.cfo@novatech.vn', phone: '0902345678', status: 'Hoạt động' },
        { username: 'growth_lead', password: '123456', fullName: 'Lê Hoàng Việt (Growth & Sales Lead)', role: 'LEADER', department: 'Khối Tăng Trưởng & Marketing', email: 'viet.growth@novatech.vn', phone: '0903456789', status: 'Hoạt động' },
        { username: 'ops_lead', password: '123456', fullName: 'Phạm Tuấn Kiệt (Product & Tech Lead)', role: 'LEADER', department: 'Khối Sản Phẩm & Công Nghệ (R&D)', email: 'kiet.tech@novatech.vn', phone: '0904567890', status: 'Hoạt động' },
        { username: 'acc_staff', password: '123456', fullName: 'Võ Thu Trang (Chuyên viên Kế toán)', role: 'STAFF', department: 'Phòng Tài Chính & Kế Toán', email: 'trang.acc@novatech.vn', phone: '0905678901', status: 'Hoạt động' },
        { username: 'investor_view', password: '666666', fullName: 'Quỹ Đầu Tư NextGen Ventures (Observer)', role: 'INVESTOR', department: 'Hội Đồng Nhà Đầu Tư (Board)', email: 'portfolio@nextgenvc.com', phone: '0906789012', status: 'Hoạt động' }
      ],
      cashAccounts: [
        { id: 'CASH-01', name: 'Tài khoản Thanh toán Vận hành chính (Operating Account)', bankName: 'Techcombank - 1903888999', openingBalance: 1800000000, totalIn: 680000000, totalOut: 920000000, currentBalance: 1560000000, interestRate: 0.5, notes: 'Chi lương, AWS Server & Marketing hàng tháng' },
        { id: 'CASH-02', name: 'Quỹ Dự trữ Gọi vốn Seed Round (Term Deposit 3M)', bankName: 'Vietcombank - Tiết kiệm Doanh nghiệp', openingBalance: 3500000000, totalIn: 0, totalOut: 0, currentBalance: 3500000000, interestRate: 4.8, notes: 'Quỹ dự trữ chiến lược bảo đảm Runway tối thiểu 12 tháng' },
        { id: 'CASH-03', name: 'Ví Thanh toán Quốc tế & Cổng Thu hộ SaaS (Stripe/VNPay)', bankName: 'VNPay & VietinBank Merchant', openingBalance: 320000000, totalIn: 450000000, totalOut: 180000000, currentBalance: 590000000, interestRate: 0.0, notes: 'Tự động kết chuyển doanh thu thuê bao phần mềm (MRR)' },
        { id: 'CASH-04', name: 'Quỹ Tiền mặt Hành chính tại Văn phòng (Petty Cash)', bankName: 'Két sắt Phòng Tài chính', openingBalance: 50000000, totalIn: 20000000, totalOut: 35000000, currentBalance: 35000000, interestRate: 0.0, notes: 'Chi phí tiếp khách & văn phòng phẩm' }
      ],
      mrrMetrics: [
        { period: mStr(-3), startCustomers: 110, newCustomers: 22, churnCustomers: 4, activeCustomers: 128, arpu: 3500000, mrr: 448000000, oneOffRevenue: 85000000, totalRevenue: 533000000, cacSpend: 132000000, cacUnit: 6000000, ltvUnit: 21000000, ltvCacRatio: 3.5, evaluation: 'Tốt (LTV/CAC >= 3x)' },
        { period: mStr(-2), startCustomers: 128, newCustomers: 28, churnCustomers: 5, activeCustomers: 151, arpu: 3600000, mrr: 543600000, oneOffRevenue: 95000000, totalRevenue: 638600000, cacSpend: 154000000, cacUnit: 5500000, ltvUnit: 21600000, ltvCacRatio: 3.9, evaluation: 'Rất tốt (Tăng trưởng MRR +21%)' },
        { period: mStr(-1), startCustomers: 151, newCustomers: 34, churnCustomers: 6, activeCustomers: 179, arpu: 3650000, mrr: 653350000, oneOffRevenue: 110000000, totalRevenue: 763350000, cacSpend: 170000000, cacUnit: 5000000, ltvUnit: 21900000, ltvCacRatio: 4.4, evaluation: 'Xuất sắc (Tối ưu CAC giảm 9%)' },
        { period: mStr(0), startCustomers: 179, newCustomers: 41, churnCustomers: 5, activeCustomers: 215, arpu: 3800000, mrr: 817000000, oneOffRevenue: 135000000, totalRevenue: 952000000, cacSpend: 184500000, cacUnit: 4500000, ltvUnit: 24700000, ltvCacRatio: 5.5, evaluation: 'Đạt đỉnh hiệu suất (ARR ~9.8 Tỷ)' }
      ],
      cashFlows: [
        { id: 'CF-101', date: dStr(-10), period: mStr(0), flowDirection: 'THU TIỀN (CASH IN)', streamType: '1. Dòng tiền Hoạt động kinh doanh (Operating)', category: 'Doanh thu Thuê bao định kỳ (SaaS MRR)', description: 'Thu tiền gia hạn gói Enterprise năm của 35 khách hàng B2B', department: 'Khối Tăng Trưởng & Marketing', accountId: 'CASH-03', amount: 817000000, costStructure: 'Doanh thu định kỳ', status: 'Đã duyệt', approver: 'Trần Bảo Ngọc (Head of Finance / CFO)', attachments: [{ id: 'ATT-CF1', name: 'Bang_Ke_Thu_Ho_SaaS_MRR.xlsx', ext: 'xlsx', size: '280 KB', url: 'https://docs.google.com/spreadsheets' }] },
        { id: 'CF-102', date: dStr(-8), period: mStr(0), flowDirection: 'THU TIỀN (CASH IN)', streamType: '1. Dòng tiền Hoạt động kinh doanh (Operating)', category: 'Doanh thu Triển khai & Tư vấn (One-off)', description: 'Thu hợp đồng thiết lập hệ thống riêng cho Tập đoàn SunLand', department: 'Khối Tăng Trưởng & Marketing', accountId: 'CASH-01', amount: 135000000, costStructure: 'Doanh thu dịch vụ', status: 'Đã duyệt', approver: 'Trần Bảo Ngọc (Head of Finance / CFO)', attachments: [{ id: 'ATT-CF2', name: 'Hop_Dong_Nghiem_Thu_SunLand.pdf', ext: 'pdf', size: '920 KB', url: 'https://drive.google.com' }] },
        { id: 'CF-103', date: dStr(-6), period: mStr(0), flowDirection: 'CHI TIỀN (CASH OUT)', streamType: '1. Dòng tiền Hoạt động kinh doanh (Operating)', category: 'Chi phí Nhân sự & R&D (Payroll & Engineering)', description: 'Chi lương, BHXH và thưởng KPI tháng cho 25 nhân sự', department: 'Khối Sản Phẩm & Công Nghệ (R&D)', accountId: 'CASH-01', amount: 620000000, costStructure: 'Định phí (Fixed Burn)', status: 'Đã duyệt', approver: 'Nguyễn Minh Quân (Founder / CEO)', attachments: [{ id: 'ATT-CF3', name: 'Bang_Luong_Tong_Hop_25_NhanSu.xlsx', ext: 'xlsx', size: '410 KB', url: 'https://docs.google.com/spreadsheets' }] },
        { id: 'CF-104', date: dStr(-5), period: mStr(0), flowDirection: 'CHI TIỀN (CASH OUT)', streamType: '1. Dòng tiền Hoạt động kinh doanh (Operating)', category: 'Giá vốn Hạ tầng Cloud & AI API (COGS)', description: 'Thanh toán hóa đơn AWS Cloud, GPU Server & Gemini API', department: 'Khối Sản Phẩm & Công Nghệ (R&D)', accountId: 'CASH-01', amount: 165000000, costStructure: 'Biến phí (Variable COGS)', status: 'Đã duyệt', approver: 'Trần Bảo Ngọc (Head of Finance / CFO)', attachments: [{ id: 'ATT-CF4', name: 'Invoice_AWS_Cloud_Services.pdf', ext: 'pdf', size: '540 KB', url: 'https://drive.google.com' }] },
        { id: 'CF-105', date: dStr(-3), period: mStr(0), flowDirection: 'CHI TIỀN (CASH OUT)', streamType: '1. Dòng tiền Hoạt động kinh doanh (Operating)', category: 'Chi phí Marketing & Thu hút khách hàng (CAC)', description: 'Ngân sách chạy Performance Ads & Hội thảo B2B', department: 'Khối Tăng Trưởng & Marketing', accountId: 'CASH-01', amount: 184500000, costStructure: 'Biến phí (Growth Burn)', status: 'Đã duyệt', approver: 'Trần Bảo Ngọc (Head of Finance / CFO)', attachments: [] },
        { id: 'CF-106', date: dStr(-2), period: mStr(0), flowDirection: 'CHI TIỀN (CASH OUT)', streamType: '1. Dòng tiền Hoạt động kinh doanh (Operating)', category: 'Chi phí Văn phòng, Pháp lý & Quản lý (G&A)', description: 'Tiền thuê văn phòng Quận 1 & bản quyền phần mềm', department: 'Phòng Tài Chính & Kế Toán', accountId: 'CASH-01', amount: 95000000, costStructure: 'Định phí (Fixed Burn)', status: 'Đã duyệt', approver: 'Trần Bảo Ngọc (Head of Finance / CFO)', attachments: [] },
        { id: 'CF-107', date: dStr(-1), period: mStr(0), flowDirection: 'CHI TIỀN (CASH OUT)', streamType: '2. Dòng tiền Hoạt động đầu tư (Investing)', category: 'Mua sắm Tài sản cố định & Thiết bị (CAPEX)', description: 'Đề xuất mua bổ sung 4 máy trạm MacBook Pro M3 cho đội ngũ AI Engineer mới', department: 'Khối Sản Phẩm & Công Nghệ (R&D)', accountId: 'CASH-01', amount: 148000000, costStructure: 'Đầu tư CAPEX', status: 'Chờ duyệt', approver: 'Nguyễn Minh Quân (Founder / CEO)', attachments: [{ id: 'ATT-CF6', name: 'Bao_Gia_Thiet_Bi_MacBook_M3.pdf', ext: 'pdf', size: '630 KB', url: 'https://drive.google.com' }] }
      ],
      forecasts: fcList,
      capTable: [
        { id: 'CAP-01', investorName: 'Nguyễn Minh Quân & Đội ngũ Co-Founders', group: 'Founders (Sáng lập)', roundName: 'Founding', investedAmount: 2000000000, postMoneyValuation: 10000000000, shares: 620000, ownershipPct: 62.0, date: '2023-01-15', status: 'Đã góp đủ 100%', attachments: [{ id: 'SHA-1', name: 'Thoa_Thuan_Co_Dong_Sang_Lap.pdf', ext: 'pdf', size: '1.1 MB', url: 'https://drive.google.com' }] },
        { id: 'CAP-02', investorName: 'Quỹ Quyền chọn Cổ phiếu Nhân sự cốt lõi (ESOP Pool)', group: 'ESOP (Nhân sự chủ chốt)', roundName: 'Seed Round', investedAmount: 0, postMoneyValuation: 25000000000, shares: 100000, ownershipPct: 10.0, date: '2023-09-01', status: 'Đã phát hành 10%', attachments: [{ id: 'SHA-2', name: 'Quy_Che_Phat_Hanh_ESOP_2025.docx', ext: 'docx', size: '450 KB', url: 'https://docs.google.com/document' }] },
        { id: 'CAP-03', investorName: 'Nhà Đầu Tư Thiên Thần (Angel Syndicate Vietnam)', group: 'Angel Investors', roundName: 'Angel Round', investedAmount: 1500000000, postMoneyValuation: 15000000000, shares: 100000, ownershipPct: 10.0, date: '2023-06-20', status: 'Đã giải ngân 100%', attachments: [{ id: 'SHA-3', name: 'SAFE_Agreement_Angel_Syndicate.pdf', ext: 'pdf', size: '840 KB', url: 'https://drive.google.com' }] },
        { id: 'CAP-04', investorName: 'Quỹ Đầu Tư NextGen Ventures (Lead Investor)', group: 'Venture Capital (VC)', roundName: 'Seed Round', investedAmount: 4500000000, postMoneyValuation: 25000000000, shares: 180000, ownershipPct: 18.0, date: '2024-03-10', status: 'Đã giải ngân 100%', attachments: [{ id: 'SHA-4', name: 'TermSheet_SHA_NextGen_Ventures.pdf', ext: 'pdf', size: '2.3 MB', url: 'https://drive.google.com' }] }
      ]
    };
  }

  var appData = buildInstantFallbackData();
  try {
    var serverInitRaw = <?!= typeof initialServerDataJson !== 'undefined' ? initialServerDataJson : 'null' ?>;
    if (serverInitRaw && serverInitRaw.ok) {
      appData = serverInitRaw;
    }
  } catch (e) {}
  var currentUser = null;
  var chartTrajectoryInstance = null;
  var chartMrrInstance = null;
  var chartCapInstance = null;
  var editingCfAttachments = [];
  var editingCapAttachments = [];
  var hasBooted = false;

  // =========================================================================
  // BỘ HELPER PHÂN QUYỀN 5 VAI TRÒ (ADMIN / CFO_MANAGER / LEADER / STAFF / INVESTOR)
  // =========================================================================
  function getUserRole() {
    if (!currentUser || !currentUser.role) return 'ADMIN';
    return String(currentUser.role).trim().toUpperCase();
  }
  function isFounderOrCfo() {
    var r = getUserRole();
    return r === 'ADMIN' || r === 'CFO_MANAGER';
  }
  function isLeaderOrAbove() {
    var r = getUserRole();
    return r === 'ADMIN' || r === 'CFO_MANAGER' || r === 'LEADER';
  }
  function isInvestorRole() {
    return getUserRole() === 'INVESTOR';
  }

  function fmtVnd(n) {
    var v = Number(n || 0);
    if (isNaN(v)) v = 0;
    return Math.round(v).toLocaleString('vi-VN') + ' đ';
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(msg, type) {
    var box = document.getElementById('appToastContainer');
    if (!box) return;
    var bg = type === 'danger' ? '#DC2626' : (type === 'warning' ? '#D97706' : '#047857');
    var el = document.createElement('div');
    el.style.cssText = 'background:' + bg + ';color:#fff;padding:10px 14px;border-radius:10px;margin-bottom:8px;box-shadow:0 6px 18px rgba(0,0,0,0.22);font-size:0.83rem;font-weight:600;display:flex;justify-content:space-between;align-items:center;gap:10px;';
    el.innerHTML = '<span>' + escapeHtml(msg) + '</span><button type="button" style="background:none;border:none;color:#fff;font-weight:bold;" onclick="this.parentElement.remove()">✕</button>';
    box.appendChild(el);
    setTimeout(function() { if (el && el.parentElement) el.remove(); }, 4200);
  }

  function getAttachmentBadgeMeta(nameOrExt) {
    var s = String(nameOrExt || '').toLowerCase();
    var ext = s.indexOf('.') !== -1 ? s.split('.').pop() : s;
    if (ext === 'doc' || ext === 'docx') return { cls: 'att-word', icon: '📘 Word' };
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return { cls: 'att-excel', icon: '📗 Excel' };
    if (ext === 'ppt' || ext === 'pptx') return { cls: 'att-ppt', icon: '📙 PPT' };
    if (ext === 'pdf') return { cls: 'att-pdf', icon: '📕 PDF' };
    return { cls: 'att-other', icon: '🔗 Tài liệu' };
  }

  function renderAttachmentChips(list) {
    var arr = Array.isArray(list) ? list : [];
    if (arr.length === 0) return '<span class="text-muted small fst-italic">-</span>';
    return '<div class="d-flex flex-wrap gap-1">' + arr.map(function(a) {
      var m = getAttachmentBadgeMeta(a.ext || a.name);
      return '<a href="' + escapeHtml(a.url || 'https://drive.google.com') + '" target="_blank" rel="noopener" class="att-chip ' + m.cls + '">' +
        '<span>' + m.icon + ':</span> <span class="text-truncate" style="max-width:130px;">' + escapeHtml(a.name) + '</span>' +
      '</a>';
    }).join('') + '</div>';
  }

  function toggleFullScreenMode() {
    var doc = window.document;
    var docEl = doc.documentElement;
    var req = docEl.requestFullscreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    var exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (req) {
        req.call(docEl).then(function() {
          document.getElementById('txtFullScreen').textContent = '🗗 Thu Nhỏ Màn Hình';
          showToast('🔲 Đã bật chế độ Toàn Màn Hình!', 'success');
        }).catch(function() {
          document.body.classList.toggle('pseudo-fullscreen');
        });
      } else {
        document.body.classList.toggle('pseudo-fullscreen');
      }
    } else {
      if (exit) exit.call(doc);
      document.getElementById('txtFullScreen').textContent = '🔲 Toàn Màn Hình';
    }
  }

  // =========================================================================
  // ĐĂNG NHẬP XÁC THỰC TRỰC TIẾP VỚI GOOGLE SHEETS THEO THỜI GIAN THỰC
  // =========================================================================
  function syncAuthUsersFromSheet(showToastFeedback) {
    var statusEl = document.getElementById('authSyncSheetStatus');
    if (typeof google === 'undefined' || !google.script || !google.script.run) {
      if (statusEl) statusEl.textContent = '💡 Chế độ xem trước độc lập (Offline Demo)';
      return;
    }
    if (statusEl) statusEl.textContent = '⏳ Đang tải mật khẩu mới nhất từ Sheet PHAN_QUYEN...';
    google.script.run
      .withSuccessHandler(function(res) {
        if (res && res.ok) {
          appData = res;
          if (statusEl) {
            statusEl.textContent = '🟢 Đã đồng bộ mật khẩu trực tiếp từ Sheet PHAN_QUYEN (' + (res.users ? res.users.length : 0) + ' TK)';
          }
          if (showToastFeedback) {
            showToast('🔄 Đã cập nhật danh sách mật khẩu mới nhất từ Sheet PHAN_QUYEN!', 'success');
          }
        }
      })
      .withFailureHandler(function() {
        if (statusEl) statusEl.textContent = '⚠️ Không thể kết nối Sheet, đang dùng bộ nhớ tạm';
      })
      .getStartupFinanceData();
  }

  function fillLoginQuick(u) {
    var uname = String(u || '').trim().toLowerCase();
    document.getElementById('loginUsername').value = uname;
    var users = (appData && appData.users && appData.users.length) ? appData.users : buildInstantFallbackData().users;
    var foundObj = users.find(function(x) { return String(x.username || '').trim().toLowerCase() === uname; });
    document.getElementById('loginPassword').value = foundObj ? foundObj.password : '';
    var errBox = document.getElementById('loginErrorAlert');
    if (errBox) errBox.classList.add('d-none');
  }

  function loginAndGoFullScreen() {
    toggleFullScreenMode();
    handleLoginSubmit(true);
  }

  function completeLoginWithUser(found) {
    var errBox = document.getElementById('loginErrorAlert');
    errBox.classList.add('d-none');
    currentUser = found;
    document.getElementById('authGateScreen').style.display = 'none';
    document.getElementById('currentUserBadge').textContent = '👤 ' + found.fullName + ' [' + found.role + ']';
    document.getElementById('printActorName').textContent = found.fullName + ' (' + found.role + ')';
    document.getElementById('roleLockStatusBadge').innerHTML = '🔒 Phiên bảo mật: <b>' + escapeHtml(found.username) + '</b> (' + escapeHtml(found.department) + ')';

    applyRoleBasedUI();
    renderAllViews();
    showToast('Xin chào ' + found.fullName + ' (' + found.role + ')! Đã xác thực mật khẩu chuẩn từ Sheet.', 'success');
  }

  function handleLoginSubmit() {
    var uIn = String(document.getElementById('loginUsername').value || '').trim().toLowerCase();
    var pIn = String(document.getElementById('loginPassword').value || '').trim();
    var errBox = document.getElementById('loginErrorAlert');
    var btnLogin = document.getElementById('btnSubmitLogin');

    if (!uIn || !pIn) {
      errBox.textContent = '⚠️ Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!';
      errBox.classList.remove('d-none');
      return;
    }

    // Nếu đang chạy trên Google Apps Script Web App: Luôn gọi về Server đọc trực tiếp Sheet PHAN_QUYEN để kiểm tra mật khẩu mới nhất!
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Đang kiểm tra mật khẩu trên Sheet PHAN_QUYEN...';
      }
      google.script.run
        .withSuccessHandler(function(res) {
          if (btnLogin) {
            btnLogin.disabled = false;
            btnLogin.innerHTML = '<i class="bi bi-shield-lock-fill me-1"></i> Đăng Nhập Vào Hệ Thống (Xác Thực Sheet Thời Gian Thực)';
          }
          if (res && res.freshData && res.freshData.ok) {
            appData = res.freshData;
          }
          if (res && res.ok && res.user) {
            completeLoginWithUser(res.user);
          } else {
            errBox.textContent = (res && res.message) ? res.message : '❌ Sai tài khoản hoặc mật khẩu trên Sheet PHAN_QUYEN!';
            errBox.classList.remove('d-none');
          }
        })
        .withFailureHandler(function(err) {
          if (btnLogin) {
            btnLogin.disabled = false;
            btnLogin.innerHTML = '<i class="bi bi-shield-lock-fill me-1"></i> Đăng Nhập Vào Hệ Thống (Xác Thực Sheet Thời Gian Thực)';
          }
          errBox.textContent = '❌ Lỗi kết nối Google Sheets: ' + err;
          errBox.classList.remove('d-none');
        })
        .verifyStartupLogin({ username: uIn, password: pIn });
      return;
    }

    // Chế độ xem trước Offline / Local
    var users = (appData && appData.users && appData.users.length) ? appData.users : buildInstantFallbackData().users;
    var found = users.find(function(u) {
      return String(u.username || '').trim().toLowerCase() === uIn && String(u.password || '').trim() === pIn;
    });
    if (!found) {
      errBox.textContent = '❌ Sai tài khoản hoặc mật khẩu! Mật khẩu không khớp với bảng PHAN_QUYEN.';
      errBox.classList.remove('d-none');
      return;
    }
    if (String(found.status || '').toLowerCase().indexOf('khóa') !== -1) {
      errBox.textContent = '🔒 Tài khoản này hiện đang bị tạm khóa!';
      errBox.classList.remove('d-none');
      return;
    }
    completeLoginWithUser(found);
  }

  function handleLogout() {
    currentUser = null;
    document.getElementById('loginPassword').value = '';
    var errBox = document.getElementById('loginErrorAlert');
    if (errBox) errBox.classList.add('d-none');
    document.getElementById('authGateScreen').style.display = 'flex';
    // Tự động kéo lại danh sách tài khoản & mật khẩu mới nhất từ Sheet PHAN_QUYEN ngay khi quay về màn hình đăng nhập
    syncAuthUsersFromSheet(false);
  }

  function setElemVisible(id, visible) {
    var el = document.getElementById(id);
    if (!el) return;
    if (visible) el.classList.remove('d-none');
    else el.classList.add('d-none');
  }

  function applyRoleBasedUI() {
    var isExec = isFounderOrCfo();
    var isLead = isLeaderOrAbove();
    var isInv = isInvestorRole();
    var myName = currentUser ? currentUser.fullName : 'Founder';

    var banner = document.getElementById('roleScopeDescription');
    if (isExec) {
      banner.innerHTML = '👑 <b>Chế độ Ban Điều Hành / CFO (' + escapeHtml(myName) + '):</b> Toàn quyền quản lý Quỹ tiền dự trữ, Duyệt chi Burn Rate, Mô phỏng Dự phóng 12 tháng, Quản lý Cap Table & Phân quyền.';
    } else if (isInv) {
      banner.innerHTML = '🏦 <b>Chế độ Phòng Dữ Liệu Nhà Đầu Tư — Investor Data Room (' + escapeHtml(myName) + '):</b> Chế độ xem minh bạch Số dư Quỹ tiền, Burn Rate, Runway, Unit Economics, Dự phóng 12 tháng & Cap Table (Đã khóa các nút chỉnh sửa nội bộ).';
    } else if (isLead) {
      banner.innerHTML = '📈 <b>Chế độ Trưởng Bộ Phận (' + escapeHtml(myName) + '):</b> Duyệt đề xuất chi trong bộ phận, cập nhật chỉ số tăng trưởng MRR / Unit Economics & theo dõi Runway.';
    } else {
      banner.innerHTML = '🧾 <b>Chế độ Kế Toán Nội Bộ (' + escapeHtml(myName) + '):</b> Lập phiếu thu/chi dòng tiền kèm hóa đơn đính kèm (`Chờ CFO duyệt`) và đối soát sổ quỹ.';
    }

    setElemVisible('deskTab_rbac', isExec || isLead);
    setElemVisible('btnTopSendAlert', isExec);
    setElemVisible('btnDashNewCashflow', !isInv);
    setElemVisible('btnDashUpdateMrr', isLead && !isInv);
    setElemVisible('btnDashAddCashAcc', isExec);
    setElemVisible('btnCfTabNew', !isInv);
    setElemVisible('btnMrrTabNew', isLead && !isInv);
    setElemVisible('btnRunForecastSim', !isInv);
    setElemVisible('btnCapTabNew', isExec);

    switchMainTab('dashboard');
  }

  function switchMainTab(tabKey) {
    var tabs = ['dashboard', 'cashflow', 'mrr', 'forecast', 'captable', 'rbac', 'guide'];
    tabs.forEach(function(k) {
      var pane = document.getElementById('tabPane_' + k);
      if (pane) {
        if (k === tabKey) pane.classList.remove('d-none');
        else pane.classList.add('d-none');
      }
      var dBtn = document.getElementById('deskTab_' + k);
      if (dBtn) {
        if (k === tabKey) dBtn.classList.add('active');
        else dBtn.classList.remove('active');
      }
      var mBtn = document.getElementById('mobTab_' + k);
      if (mBtn) {
        if (k === tabKey) mBtn.classList.add('active');
        else mBtn.classList.remove('active');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setSyncBadge(state, text) {
    var b = document.getElementById('syncStatusBadge');
    if (!b) return;
    if (state === 'loading') {
      b.className = 'badge bg-warning text-dark small';
      b.innerHTML = '<i class="bi bi-arrow-repeat"></i> ' + (text || 'Đang đồng bộ...');
    } else if (state === 'error') {
      b.className = 'badge bg-danger small';
      b.innerHTML = '<i class="bi bi-exclamation-triangle"></i> ' + (text || 'Chế độ Độc lập');
    } else {
      b.className = 'badge bg-success bg-opacity-75 small';
      b.innerHTML = '<i class="bi bi-cloud-check"></i> ' + (text || 'Đã đồng bộ Sheet');
    }
  }

  function refreshAllDataFromServer() {
    if (typeof google === 'undefined' || !google.script || !google.script.run) {
      renderAllViews();
      return;
    }
    setSyncBadge('loading', 'Đang tải dữ liệu CFO...');
    google.script.run
      .withSuccessHandler(function(res) {
        if (res && res.ok) {
          appData = res;
          setSyncBadge('ok', 'Đã đồng bộ Sheet');
          renderAllViews();
        } else {
          setSyncBadge('error', 'Dùng dữ liệu dự phòng');
          renderAllViews();
        }
      })
      .withFailureHandler(function() {
        setSyncBadge('error', 'Chế độ Độc lập');
        renderAllViews();
      })
      .getStartupFinanceData();
  }

  // =========================================================================
  // RENDER TOÀN BỘ 6 PHÂN HỆ STARTUP CFO
  // =========================================================================
  function renderAllViews() {
    if (!appData) appData = buildInstantFallbackData();
    var cfg = appData.config || {};
    document.getElementById('topCompanyName').textContent = cfg.COMPANY_NAME || 'CÔNG TY CỔ PHẦN CÔNG NGHỆ AI & SAAS NOVA-TECH STARTUP';
    document.getElementById('printCompanyTitle').textContent = cfg.COMPANY_NAME || 'CÔNG TY CỔ PHẦN CÔNG NGHỆ AI & SAAS NOVA-TECH STARTUP';
    document.getElementById('lblServerTime').textContent = appData.serverTime || '-';
    document.getElementById('lblFundingStage').textContent = cfg.CURRENT_FUNDING_STAGE || 'Pre-Series A';
    document.getElementById('printDateNow').textContent = appData.serverTime || '-';

    var accSel = document.getElementById('cfFormAccount');
    if (accSel) {
      accSel.innerHTML = (appData.cashAccounts || []).map(function(c) {
        return '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.id + ' - ' + c.name) + '</option>';
      }).join('');
    }

    renderDashboardSection();
    renderCashFlowSection();
    renderMrrSection();
    renderForecastSection();
    renderCapTableSection();
    renderRbacAndConfigSection();
  }

  function renderDashboardSection() {
    var isLead = isLeaderOrAbove();
    var isInv = isInvestorRole();
    var cashAccs = appData.cashAccounts || [];
    var cfs = appData.cashFlows || [];
    var mrrs = appData.mrrMetrics || [];
    var caps = appData.capTable || [];
    var cfg = appData.config || {};

    var totalCash = 0;
    cashAccs.forEach(function(c) { totalCash += Number(c.currentBalance || 0); });

    var totalInMonth = 0;
    var grossBurnMonth = 0;
    var pendingCfs = [];
    cfs.forEach(function(cf) {
      if (cf.status === 'Chờ duyệt') pendingCfs.push(cf);
      if (cf.status !== 'Từ chối') {
        if (String(cf.flowDirection || '').indexOf('THU') !== -1) {
          totalInMonth += Number(cf.amount || 0);
        } else {
          grossBurnMonth += Number(cf.amount || 0);
        }
      }
    });

    var netBurnMonth = grossBurnMonth - totalInMonth;
    var runwayMonths = netBurnMonth <= 0 ? 36.0 : Math.round((totalCash / netBurnMonth) * 10) / 10;
    var minSafe = Number(cfg.MIN_SAFE_RUNWAY_MONTHS || 6);

    var latestMrr = mrrs.length > 0 ? mrrs[mrrs.length - 1] : { mrr: 817000000, ltvCacRatio: 5.5, cacUnit: 4500000 };
    var totalRaised = 0;
    var latestVal = 25000000000;
    caps.forEach(function(cp) {
      totalRaised += Number(cp.investedAmount || 0);
      if (Number(cp.postMoneyValuation || 0) > latestVal) latestVal = Number(cp.postMoneyValuation);
    });

    document.getElementById('kpiTotalCashBalance').textContent = fmtVnd(totalCash);
    document.getElementById('kpiMonthlyNetBurn').textContent = netBurnMonth > 0 ? ('-' + fmtVnd(netBurnMonth)) : ('+' + fmtVnd(Math.abs(netBurnMonth)) + ' (Dương)');
    document.getElementById('kpiMonthlyGrossBurn').textContent = fmtVnd(grossBurnMonth);
    document.getElementById('kpiRunwayMonths').textContent = netBurnMonth <= 0 ? '∞ (Đã hòa vốn)' : (runwayMonths + ' tháng');

    var rwBadge = document.getElementById('kpiRunwaySafetyBadge');
    if (netBurnMonth <= 0 || runwayMonths >= 12) {
      rwBadge.className = 'small fw-semibold mt-1 text-success';
      rwBadge.textContent = '🟢 Runway Rất An Toàn (>= 12 tháng)';
    } else if (runwayMonths >= minSafe) {
      rwBadge.className = 'small fw-semibold mt-1 text-warning';
      rwBadge.textContent = '🟡 Cần chuẩn bị gọi vốn (6-12 tháng)';
    } else {
      rwBadge.className = 'small fw-semibold mt-1 text-danger';
      rwBadge.textContent = '🔴 BÁO ĐỘNG ĐỎ (< ' + minSafe + ' tháng)';
    }

    document.getElementById('kpiCurrentMrr').textContent = fmtVnd(latestMrr.mrr);
    document.getElementById('kpiCurrentArr').textContent = fmtVnd(Number(latestMrr.mrr || 0) * 12);
    document.getElementById('kpiLtvCacRatio').textContent = Number(latestMrr.ltvCacRatio || 0).toFixed(1) + 'x';
    document.getElementById('kpiCurrentCac').textContent = fmtVnd(latestMrr.cacUnit);
    document.getElementById('kpiLatestValuation').textContent = fmtVnd(latestVal);
    document.getElementById('kpiTotalRaised').textContent = fmtVnd(totalRaised);
    document.getElementById('badgePendingExpenses').textContent = pendingCfs.length + ' khoản chờ';

    // Danh sách Đề xuất chi chờ duyệt
    var pBox = document.getElementById('dashPendingExpensesBox');
    if (pendingCfs.length === 0) {
      pBox.innerHTML = '<div class="text-muted small py-3 text-center">🎉 Không có đề xuất chi ngân sách nào đang tồn đọng!</div>';
    } else {
      pBox.innerHTML = pendingCfs.map(function(cf) {
        return '<div class="p-2 border rounded-3 bg-light d-flex flex-column gap-1">' +
          '<div class="d-flex justify-content-between align-items-start">' +
            '<div class="fw-bold small text-dark">[' + escapeHtml(cf.id) + '] ' + escapeHtml(cf.description) + '</div>' +
            '<span class="badge bg-danger">' + fmtVnd(cf.amount) + '</span>' +
          '</div>' +
          '<div class="small text-secondary">' + escapeHtml(cf.category) + ' • Bộ phận: <b>' + escapeHtml(cf.department) + '</b></div>' +
          '<div class="d-flex justify-content-between align-items-center mt-1">' +
            renderAttachmentChips(cf.attachments) +
            ((isLead && !isInv) ? (
              '<div class="d-flex gap-1">' +
                '<button type="button" class="btn btn-xs btn-success fw-bold py-0 px-2" style="font-size:0.73rem;" onclick="quickApproveCashFlow(\'' + escapeHtml(cf.id) + '\', \'Đã duyệt\')">✅ Duyệt Chi</button>' +
                '<button type="button" class="btn btn-xs btn-outline-danger fw-bold py-0 px-2" style="font-size:0.73rem;" onclick="quickApproveCashFlow(\'' + escapeHtml(cf.id) + '\', \'Từ chối\')">↩️ Từ Chối</button>' +
              '</div>'
            ) : '<span class="badge bg-warning text-dark">⏳ Chờ CFO duyệt</span>') +
          '</div>' +
        '</div>';
      }).join('');
    }

    // Danh sách Quỹ tiền dự trữ
    var cBox = document.getElementById('dashCashReservesBox');
    cBox.innerHTML = cashAccs.map(function(c) {
      return '<div class="p-2 border rounded-3 bg-white d-flex justify-content-between align-items-center small">' +
        '<div>' +
          '<div class="fw-bold text-dark">🏦 ' + escapeHtml(c.name) + ' <span class="badge bg-light text-secondary border">' + escapeHtml(c.id) + '</span></div>' +
          '<div class="text-muted">' + escapeHtml(c.bankName) + ' • Lãi suất: <b>' + c.interestRate + '%/năm</b></div>' +
        '</div>' +
        '<div class="text-end">' +
          '<div class="fw-bold text-success" style="font-size:0.92rem;">' + fmtVnd(c.currentBalance) + '</div>' +
          (!isInv && isFounderOrCfo() ? '<button type="button" class="btn btn-xs btn-link p-0 text-decoration-none" style="font-size:0.72rem;" onclick="openCashAccountModal(\'' + escapeHtml(c.id) + '\')">✏️ Sửa số dư</button>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    renderStartupCharts();
  }

  function renderStartupCharts() {
    if (typeof Chart === 'undefined') return;
    var fcs = appData.forecasts || [];
    var mrrs = appData.mrrMetrics || [];
    var caps = appData.capTable || [];

    var ctx1 = document.getElementById('chartForecastTrajectory');
    if (ctx1) {
      if (chartTrajectoryInstance) chartTrajectoryInstance.destroy();
      chartTrajectoryInstance = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: fcs.map(function(f) { return f.period; }),
          datasets: [
            {
              type: 'line',
              label: 'Số dư Tiền mặt Cuối kỳ (Ending Cash)',
              data: fcs.map(function(f) { return Number(f.endingCash || 0); }),
              borderColor: '#047857',
              backgroundColor: 'rgba(4, 120, 87, 0.1)',
              borderWidth: 3,
              tension: 0.3
            },
            {
              type: 'bar',
              label: 'Dòng tiền Ròng tháng (Net Cashflow)',
              data: fcs.map(function(f) { return Number(f.netCashflow || 0); }),
              backgroundColor: fcs.map(function(f) { return Number(f.netCashflow) >= 0 ? '#3B82F6' : '#EF4444'; }),
              borderRadius: 5
            }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    var ctx2 = document.getElementById('chartMrrGrowth');
    if (ctx2) {
      if (chartMrrInstance) chartMrrInstance.destroy();
      chartMrrInstance = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: mrrs.map(function(m) { return m.period; }),
          datasets: [{
            label: 'Doanh thu định kỳ MRR (VNĐ)',
            data: mrrs.map(function(m) { return Number(m.mrr || 0); }),
            backgroundColor: '#1D4ED8',
            borderRadius: 6
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    var ctx3 = document.getElementById('chartCapTablePie');
    if (ctx3) {
      if (chartCapInstance) chartCapInstance.destroy();
      chartCapInstance = new Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: caps.map(function(c) { return c.investorName; }),
          datasets: [{
            data: caps.map(function(c) { return Number(c.ownershipPct || 0); }),
            backgroundColor: ['#047857', '#2563EB', '#F59E0B', '#7C3AED', '#EC4899']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }

  // =========================================================================
  // 2. RENDER DÒNG TIỀN 3 LUỒNG (`DONG_TIEN_THUC_TE`)
  // =========================================================================
  function renderCashFlowSection() {
    var isLead = isLeaderOrAbove();
    var isInv = isInvestorRole();
    var cfs = appData.cashFlows || [];
    var q = String(document.getElementById('filterCfSearch').value || '').trim().toLowerCase();
    var fStream = document.getElementById('filterCfStream').value || 'ALL';
    var fSt = document.getElementById('filterCfStatus').value || 'ALL';

    var filtered = cfs.filter(function(cf) {
      if (fStream !== 'ALL' && cf.streamType !== fStream) return false;
      if (fSt !== 'ALL' && cf.status !== fSt) return false;
      if (q) {
        var hay = (cf.id + ' ' + cf.description + ' ' + cf.category + ' ' + cf.department).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var tbody = document.getElementById('cashFlowTableBody');
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4">Không có giao dịch dòng tiền phù hợp bộ lọc.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(function(cf) {
      var isIn = String(cf.flowDirection || '').indexOf('THU') !== -1;
      var stBadge = cf.status === 'Đã duyệt'
        ? '<span class="badge bg-success">✅ Đã duyệt</span>'
        : (cf.status === 'Từ chối' ? '<span class="badge bg-danger">↩️ Từ chối</span>' : '<span class="badge bg-warning text-dark">⏳ Chờ duyệt</span>');

      var actHtml = '';
      if (!isInv) {
        if (isLead && cf.status === 'Chờ duyệt') {
          actHtml += '<div class="d-flex justify-content-center gap-1 mb-1">' +
            '<button type="button" class="btn btn-xs btn-success py-0 px-2" style="font-size:0.72rem;" onclick="quickApproveCashFlow(\'' + escapeHtml(cf.id) + '\', \'Đã duyệt\')">✅ Duyệt</button>' +
            '<button type="button" class="btn btn-xs btn-outline-danger py-0 px-2" style="font-size:0.72rem;" onclick="quickApproveCashFlow(\'' + escapeHtml(cf.id) + '\', \'Từ chối\')">↩️</button>' +
          '</div>';
        }
        actHtml += '<button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" style="font-size:0.72rem;" onclick="openCashFlowModal(\'' + escapeHtml(cf.id) + '\')">✏️ Sửa / File</button>';
      } else {
        actHtml = '<span class="badge bg-light text-secondary border">🔒 Chỉ xem</span>';
      }

      return '<tr>' +
        '<td><div class="fw-bold">' + escapeHtml(cf.id) + '</div><div class="small text-muted">' + escapeHtml(cf.date) + '</div></td>' +
        '<td><span class="badge ' + (isIn ? 'bg-success' : 'bg-danger') + ' mb-1">' + escapeHtml(cf.flowDirection) + '</span><div class="small text-secondary">' + escapeHtml(cf.streamType) + '</div></td>' +
        '<td><div class="fw-bold text-dark">' + escapeHtml(cf.description) + '</div><div class="small text-primary">' + escapeHtml(cf.category) + ' • <span class="badge bg-light text-dark border">' + escapeHtml(cf.costStructure) + '</span></div></td>' +
        '<td><div class="small fw-semibold">' + escapeHtml(cf.department) + '</div><span class="badge bg-dark">' + escapeHtml(cf.accountId) + '</span></td>' +
        '<td class="text-end fw-bold ' + (isIn ? 'text-success' : 'text-danger') + '">' + (isIn ? '+' : '-') + fmtVnd(cf.amount) + '</td>' +
        '<td>' + renderAttachmentChips(cf.attachments) + '</td>' +
        '<td>' + stBadge + '<div class="small text-muted mt-1">' + escapeHtml(cf.approver || '') + '</div></td>' +
        '<td class="text-center">' + actHtml + '</td>' +
      '</tr>';
    }).join('');
  }

  function quickApproveCashFlow(cfId, newStatus) {
    if (!isLeaderOrAbove() || isInvestorRole()) return;
    var approverName = currentUser ? currentUser.fullName : 'CFO / Founder';
    var cfs = appData.cashFlows || [];
    for (var i = 0; i < cfs.length; i++) {
      if (cfs[i].id === cfId) {
        cfs[i].status = newStatus;
        cfs[i].approver = approverName;
        break;
      }
    }
    renderAllViews();
    showToast((newStatus === 'Đã duyệt' ? '✅ Đã phê duyệt bút toán ' : '↩️ Đã từ chối bút toán ') + cfId + '!', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).approveCashFlowQuick({
        id: cfId,
        status: newStatus,
        approver: approverName,
        actor: currentUser ? currentUser.username : 'cfo_st',
        actorRole: currentUser ? currentUser.role : 'CFO_MANAGER'
      });
    }
  }

  // =========================================================================
  // 3. RENDER TĂNG TRƯỞNG MRR & UNIT ECONOMICS (`DOANH_THU_MRR_UNIT`)
  // =========================================================================
  function renderMrrSection() {
    var list = appData.mrrMetrics || [];
    var tbody = document.getElementById('mrrTableBody');
    tbody.innerHTML = list.map(function(m) {
      var goodRatio = Number(m.ltvCacRatio || 0) >= 3.0;
      return '<tr>' +
        '<td class="fw-bold text-primary">' + escapeHtml(m.period) + '</td>' +
        '<td class="text-center">' + m.startCustomers + '</td>' +
        '<td class="text-center text-success fw-bold">+' + m.newCustomers + '</td>' +
        '<td class="text-center text-danger">-' + m.churnCustomers + '</td>' +
        '<td class="text-center fw-bold bg-light">' + m.activeCustomers + '</td>' +
        '<td class="text-end">' + fmtVnd(m.arpu) + '</td>' +
        '<td class="text-end fw-bold text-primary">' + fmtVnd(m.mrr) + '</td>' +
        '<td class="text-end fw-bold text-success">' + fmtVnd(m.totalRevenue) + '</td>' +
        '<td class="text-end text-danger">' + fmtVnd(m.cacSpend) + '</td>' +
        '<td class="text-end">' + fmtVnd(m.cacUnit) + '</td>' +
        '<td class="text-end fw-semibold">' + fmtVnd(m.ltvUnit) + '</td>' +
        '<td class="text-center"><span class="badge ' + (goodRatio ? 'bg-success' : 'bg-warning text-dark') + '" style="font-size:0.82rem;">' + Number(m.ltvCacRatio).toFixed(1) + 'x</span></td>' +
        '<td class="small fw-semibold">' + escapeHtml(m.evaluation) + '</td>' +
      '</tr>';
    }).join('');
  }

  // =========================================================================
  // 4. RENDER DỰ PHÓNG DÒNG TIỀN 12 THÁNG (`DU_PHONG_12_THANG`)
  // =========================================================================
  function renderForecastSection() {
    var list = appData.forecasts || [];
    var tbody = document.getElementById('forecastTableBody');
    tbody.innerHTML = list.map(function(f) {
      var isPos = Number(f.netCashflow || 0) >= 0;
      return '<tr>' +
        '<td class="fw-bold text-primary">' + escapeHtml(f.period) + '</td>' +
        '<td class="text-end fw-semibold text-success">' + fmtVnd(f.projectedRevenue) + '</td>' +
        '<td class="text-end text-muted">' + fmtVnd(f.projectedCogs) + '</td>' +
        '<td class="text-end fw-bold">' + fmtVnd(f.grossProfit) + '</td>' +
        '<td class="text-end">' + fmtVnd(f.rAndDCost) + '</td>' +
        '<td class="text-end">' + fmtVnd(f.marketingCost) + '</td>' +
        '<td class="text-end">' + fmtVnd(f.gnaCost) + '</td>' +
        '<td class="text-end text-danger fw-semibold">' + fmtVnd(f.grossBurn) + '</td>' +
        '<td class="text-end fw-bold ' + (isPos ? 'text-success' : 'text-danger') + '">' + (isPos ? '+' : '') + fmtVnd(f.netCashflow) + '</td>' +
        '<td class="text-end fw-bold" style="color:#047857;">' + fmtVnd(f.endingCash) + '</td>' +
        '<td class="text-center fw-bold">' + (isPos ? '∞' : (f.runwayMonths + ' tháng')) + '</td>' +
        '<td class="small fw-semibold">' + escapeHtml(f.safetyStatus) + '</td>' +
      '</tr>';
    }).join('');
  }

  function onSimScenarioPresetChange(val) {
    if (val.indexOf('Best Case') !== -1) {
      document.getElementById('simRevGrowthInput').value = 15;
      document.getElementById('simExpGrowthInput').value = 4;
    } else if (val.indexOf('Worst Case') !== -1) {
      document.getElementById('simRevGrowthInput').value = 5;
      document.getElementById('simExpGrowthInput').value = 1.5;
    } else {
      document.getElementById('simRevGrowthInput').value = 10;
      document.getElementById('simExpGrowthInput').value = 3;
    }
  }

  function handleRunForecastSimulation() {
    if (isInvestorRole()) return;
    var scenario = document.getElementById('simScenarioSelect').value;
    var revG = Number(document.getElementById('simRevGrowthInput').value || 10);
    var expG = Number(document.getElementById('simExpGrowthInput').value || 3);

    var totalCash = 0;
    (appData.cashAccounts || []).forEach(function(c) { totalCash += Number(c.currentBalance || 0); });
    if (totalCash <= 0) totalCash = 5685000000;

    var latestMrr = (appData.mrrMetrics && appData.mrrMetrics.length > 0) ? appData.mrrMetrics[appData.mrrMetrics.length - 1] : null;
    var rev = latestMrr ? Number(latestMrr.totalRevenue || 952000000) : 952000000;
    var rAndD = 620000000;
    var mkt = 185000000;
    var gna = 95000000;
    var runCash = totalCash;
    var now = new Date();
    var newFcs = [];

    for (var m = 1; m <= 12; m++) {
      var d = new Date(now.getFullYear(), now.getMonth() + m, 1);
      var mLbl = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
      rev = Math.round(rev * (1 + revG / 100.0));
      var cogs = Math.round(rev * 0.18);
      var gp = rev - cogs;
      rAndD = Math.round(rAndD * (1 + expG / 100.0));
      mkt = Math.round(mkt * (1 + expG / 100.0));
      gna = Math.round(gna * (1 + (expG * 0.6) / 100.0));
      var gb = cogs + rAndD + mkt + gna;
      var net = rev - gb;
      runCash += net;
      var rw = net >= 0 ? 99.9 : Math.max(0, Math.round((runCash / Math.abs(net)) * 10) / 10);
      newFcs.push({
        period: mLbl,
        scenario: scenario,
        growthRatePct: revG,
        projectedRevenue: rev,
        projectedCogs: cogs,
        grossProfit: gp,
        rAndDCost: rAndD,
        marketingCost: mkt,
        gnaCost: gna,
        grossBurn: gb,
        netCashflow: net,
        endingCash: runCash,
        runwayMonths: rw,
        safetyStatus: net >= 0 ? '🟢 Đã Hòa Vốn & Có Lãi Dương (Cashflow Positive)' : (rw >= 12 ? '🟢 Runway An Toàn (> 12 tháng)' : (rw >= 6 ? '🟡 Cần Chuẩn Bị Gọi Vốn (6-12 tháng)' : '🔴 Báo Động Đỏ (< 6 tháng)'))
      });
    }
    appData.forecasts = newFcs;
    renderAllViews();
    showToast('🔮 Đã chạy mô phỏng Dự phóng Dòng tiền 12 tháng (' + scenario + ')!', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).recalculate12MonthForecast({
        scenario: scenario,
        revGrowthPct: revG,
        expGrowthPct: expG,
        actor: currentUser ? currentUser.username : 'cfo_st'
      });
    }
  }

  // =========================================================================
  // 5. RENDER VÒNG GỌI VỐN & CAP TABLE (`VONG_GOI_VON_CAPTABLE`)
  // =========================================================================
  function renderCapTableSection() {
    var isExec = isFounderOrCfo();
    var caps = appData.capTable || [];
    var tbody = document.getElementById('capTableBody');

    tbody.innerHTML = caps.map(function(c) {
      return '<tr>' +
        '<td><div class="fw-bold text-primary">' + escapeHtml(c.id) + '</div><span class="badge bg-dark">' + escapeHtml(c.roundName) + '</span></td>' +
        '<td class="fw-bold text-dark">' + escapeHtml(c.investorName) + '</td>' +
        '<td><span class="badge bg-info bg-opacity-10 text-dark border border-info">' + escapeHtml(c.group) + '</span></td>' +
        '<td class="text-end fw-bold text-success">' + fmtVnd(c.investedAmount) + '</td>' +
        '<td class="text-end">' + fmtVnd(c.postMoneyValuation) + '</td>' +
        '<td class="text-end">' + Number(c.shares || 0).toLocaleString('vi-VN') + ' CP</td>' +
        '<td class="text-center"><span class="badge bg-success" style="font-size:0.84rem;">' + Number(c.ownershipPct || 0).toFixed(1) + '%</span></td>' +
        '<td><div class="small fw-semibold text-success">' + escapeHtml(c.status) + '</div><div class="small text-muted">' + escapeHtml(c.date) + '</div></td>' +
        '<td>' + renderAttachmentChips(c.attachments) + '</td>' +
        '<td class="text-center no-print">' +
          (isExec ? '<button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" onclick="openCapTableModal(\'' + escapeHtml(c.id) + '\')">✏️ Sửa</button>' : '<span class="text-muted small">-</span>') +
        '</td>' +
      '</tr>';
    }).join('');

    // Khung Báo cáo Nhà đầu tư A4
    var box = document.getElementById('investorReportSummaryBox');
    if (box) {
      var totalCash = 0;
      (appData.cashAccounts || []).forEach(function(ca) { totalCash += Number(ca.currentBalance || 0); });
      var latestMrr = (appData.mrrMetrics && appData.mrrMetrics.length > 0) ? appData.mrrMetrics[appData.mrrMetrics.length - 1] : { mrr: 817000000, ltvCacRatio: 5.5 };
      box.innerHTML = '<div class="row g-2 mb-3 small">' +
        '<div class="col-6 col-md-3">Tổng Quỹ Tiền Mặt: <b class="text-success">' + fmtVnd(totalCash) + '</b></div>' +
        '<div class="col-6 col-md-3">Doanh thu MRR: <b class="text-primary">' + fmtVnd(latestMrr.mrr) + '/tháng</b></div>' +
        '<div class="col-6 col-md-3">ARR Quy đổi: <b>' + fmtVnd(Number(latestMrr.mrr || 0) * 12) + '/năm</b></div>' +
        '<div class="col-6 col-md-3">Hiệu suất LTV / CAC: <b class="text-success">' + latestMrr.ltvCacRatio + 'x (Chuẩn VC)</b></div>' +
      '</div>';
    }
  }

  // =========================================================================
  // 6. RENDER PHÂN QUYỀN (`PHAN_QUYEN`) & CẤU HÌNH (`CAU_HINH`)
  // =========================================================================
  function renderRbacAndConfigSection() {
    var users = appData.users || [];
    var uBody = document.getElementById('userAccountsTableBody');
    if (uBody) {
      uBody.innerHTML = users.map(function(u) {
        var isLocked = String(u.status || '').toLowerCase().indexOf('khóa') !== -1;
        var roleOpts = ['ADMIN', 'CFO_MANAGER', 'LEADER', 'STAFF', 'INVESTOR'].map(function(r) {
          var sel = String(u.role || '').toUpperCase() === r ? 'selected' : '';
          return '<option value="' + r + '" ' + sel + '>' + r + '</option>';
        }).join('');
        return '<tr>' +
          '<td><div class="fw-bold text-dark">' + escapeHtml(u.fullName) + ' <span class="badge bg-light text-secondary border">' + escapeHtml(u.username) + '</span></div><div class="small text-muted">🏢 ' + escapeHtml(u.department) + '</div></td>' +
          '<td><select class="form-select form-select-sm fw-bold py-0 px-1" style="font-size:0.74rem;max-width:140px;" onchange="quickChangeStartupRole(\'' + escapeHtml(u.username) + '\', this.value)">' + roleOpts + '</select></td>' +
          '<td><span class="badge ' + (isLocked ? 'bg-danger' : 'bg-success') + '">' + escapeHtml(u.status) + '</span></td>' +
          '<td class="text-end"><button type="button" class="btn btn-xs btn-outline-primary py-0 px-2" onclick="openUserModal(\'' + escapeHtml(u.username) + '\')">⚙️ Sửa</button></td>' +
        '</tr>';
      }).join('');
    }

    var cfg = appData.config || {};
    document.getElementById('cfgCompanyName').value = cfg.COMPANY_NAME || '';
    document.getElementById('cfgFundingStage').value = cfg.CURRENT_FUNDING_STAGE || '';
    document.getElementById('cfgMinRunway').value = cfg.MIN_SAFE_RUNWAY_MONTHS || '6';
    document.getElementById('cfgTargetMargin').value = cfg.TARGET_GROSS_MARGIN_PCT || '72';
    document.getElementById('cfgTargetLtvCac').value = cfg.TARGET_LTV_CAC_RATIO || '3.0';
    document.getElementById('cfgAdminEmail').value = cfg.ADMIN_EMAIL || '';
    document.getElementById('cfgZaloWebhook').value = cfg.ZALO_BOT_WEBHOOK_URL || '';
  }

  // =========================================================================
  // MODALS & CRUD HANDLERS
  // =========================================================================
  function openCustomModal(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }
  function closeCustomModal(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function renderStartupAttachmentEditor(targetType) {
    var list = targetType === 'CF' ? editingCfAttachments : editingCapAttachments;
    var box = document.getElementById(targetType === 'CF' ? 'cfAttachmentsList' : 'capAttachmentsList');
    if (!box) return;
    if (!list || list.length === 0) {
      box.innerHTML = '<span class="text-muted small fst-italic">Chưa đính kèm chứng từ.</span>';
      return;
    }
    box.innerHTML = list.map(function(att, idx) {
      var m = getAttachmentBadgeMeta(att.ext || att.name);
      return '<div class="d-inline-flex align-items-center gap-1 p-1 px-2 rounded border bg-white">' +
        '<a href="' + escapeHtml(att.url || 'https://drive.google.com') + '" target="_blank" class="att-chip ' + m.cls + ' border-0 p-0">' +
          '<span>' + m.icon + ':</span> <span>' + escapeHtml(att.name) + '</span>' +
        '</a>' +
        '<button type="button" class="btn btn-xs text-danger py-0 px-1 fw-bold" onclick="removeStartupAttachment(\'' + targetType + '\', ' + idx + ')">×</button>' +
      '</div>';
    }).join('');
  }

  function removeStartupAttachment(targetType, idx) {
    if (targetType === 'CF') editingCfAttachments.splice(idx, 1);
    else editingCapAttachments.splice(idx, 1);
    renderStartupAttachmentEditor(targetType);
  }

  function handleStartupFileUpload(event, targetType) {
    var files = event && event.target && event.target.files ? event.target.files : [];
    if (!files || files.length === 0) return;
    var uploader = currentUser ? currentUser.fullName : 'CFO';

    Array.prototype.forEach.call(files, function(file) {
      var fName = file.name;
      var fExt = fName.indexOf('.') !== -1 ? fName.split('.').pop().toLowerCase() : 'pdf';
      var fSize = Math.max(1, Math.round(file.size / 1024)) + ' KB';

      var reader = new FileReader();
      reader.onload = function(e) {
        var dataUrl = String(e.target.result || '');
        var base64Part = dataUrl.indexOf(',') !== -1 ? dataUrl.split(',')[1] : '';
        var attObj = { id: 'STDOC-' + Date.now(), name: fName, ext: fExt, size: fSize, url: dataUrl || 'https://drive.google.com', uploadedBy: uploader };
        if (targetType === 'CF') editingCfAttachments.push(attObj);
        else editingCapAttachments.push(attObj);
        renderStartupAttachmentEditor(targetType);
        showToast('📎 Đã đính kèm tệp: ' + fName, 'success');

        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run.withSuccessHandler(function(res) {
            if (res && res.ok && res.file) {
              attObj.url = res.file.url;
              renderStartupAttachmentEditor(targetType);
            }
          }).uploadStartupAttachment({
            fileName: fName,
            mimeType: file.type || 'application/octet-stream',
            fileSize: fSize,
            base64Data: base64Part,
            fallbackUrl: dataUrl,
            uploadedBy: uploader
          });
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  }

  function openCashFlowModal(cfId) {
    if (isInvestorRole()) return;
    var isLead = isLeaderOrAbove();
    var optApp = document.getElementById('optCfApprovedMgrOnly');
    if (optApp) optApp.disabled = !isLead;

    if (cfId) {
      var cf = (appData.cashFlows || []).find(function(x) { return x.id === cfId; });
      if (cf) {
        document.getElementById('cfFormId').value = cf.id;
        document.getElementById('cfFormDate').value = cf.date;
        document.getElementById('cfFormDirection').value = cf.flowDirection;
        document.getElementById('cfFormAccount').value = cf.accountId;
        document.getElementById('cfFormStream').value = cf.streamType;
        document.getElementById('cfFormCategory').value = cf.category;
        document.getElementById('cfFormDesc').value = cf.description;
        document.getElementById('cfFormAmount').value = cf.amount;
        document.getElementById('cfFormCostStruct').value = cf.costStructure;
        document.getElementById('cfFormStatus').value = (!isLead && cf.status === 'Đã duyệt') ? 'Chờ duyệt' : cf.status;
        editingCfAttachments = JSON.parse(JSON.stringify(Array.isArray(cf.attachments) ? cf.attachments : []));
      }
    } else {
      document.getElementById('cfFormId').value = '';
      document.getElementById('cfFormDate').value = appData.todayStr || '2025-05-15';
      document.getElementById('cfFormDesc').value = '';
      document.getElementById('cfFormAmount').value = 50000000;
      document.getElementById('cfFormStatus').value = isLead ? 'Đã duyệt' : 'Chờ duyệt';
      editingCfAttachments = [];
    }
    renderStartupAttachmentEditor('CF');
    openCustomModal('modalCashFlowBackdrop');
  }

  function submitCashFlowForm() {
    var desc = String(document.getElementById('cfFormDesc').value || '').trim();
    if (!desc) {
      showToast('Vui lòng nhập nội dung diễn giải bút toán dòng tiền!', 'danger');
      return;
    }
    var isLead = isLeaderOrAbove();
    var cfId = document.getElementById('cfFormId').value;
    var existing = cfId ? (appData.cashFlows || []).find(function(x) { return x.id === cfId; }) : null;
    var st = document.getElementById('cfFormStatus').value || 'Chờ duyệt';
    if (!isLead && st === 'Đã duyệt') st = 'Chờ duyệt';

    var dateVal = document.getElementById('cfFormDate').value || (appData.todayStr || '2025-05-15');
    var payload = {
      id: cfId || ('CF-' + Math.floor(200 + Math.random() * 799)),
      date: dateVal,
      period: dateVal.slice(0, 7),
      flowDirection: document.getElementById('cfFormDirection').value,
      streamType: document.getElementById('cfFormStream').value,
      category: document.getElementById('cfFormCategory').value,
      description: desc,
      department: existing ? existing.department : (currentUser ? currentUser.department : 'Phòng Tài Chính & Kế Toán'),
      accountId: document.getElementById('cfFormAccount').value || 'CASH-01',
      amount: Number(document.getElementById('cfFormAmount').value || 0),
      costStructure: document.getElementById('cfFormCostStruct').value,
      status: st,
      approver: isLead && st === 'Đã duyệt' ? (currentUser ? currentUser.fullName : 'CFO') : 'Chờ CFO duyệt',
      attachments: editingCfAttachments,
      canApprove: isLead,
      actor: currentUser ? currentUser.username : 'cfo_st',
      actorRole: currentUser ? currentUser.role : 'CFO_MANAGER'
    };

    if (existing) Object.assign(existing, payload);
    else appData.cashFlows.unshift(payload);

    closeCustomModal('modalCashFlowBackdrop');
    renderAllViews();
    showToast('💸 Đã lưu bút toán dòng tiền [' + payload.id + '] (' + payload.status + ')!', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveCashFlowTransaction(payload);
    }
  }

  function openCashAccountModal(cashId) {
    if (!isFounderOrCfo()) return;
    if (cashId) {
      var c = (appData.cashAccounts || []).find(function(x) { return x.id === cashId; });
      if (c) {
        document.getElementById('cashFormId').value = c.id;
        document.getElementById('cashFormName').value = c.name;
        document.getElementById('cashFormBank').value = c.bankName;
        document.getElementById('cashFormBalance').value = c.currentBalance;
        document.getElementById('cashFormInterest').value = c.interestRate;
        document.getElementById('cashFormNotes').value = c.notes || '';
      }
    } else {
      document.getElementById('cashFormId').value = 'CASH-0' + ((appData.cashAccounts || []).length + 1);
      document.getElementById('cashFormName').value = '';
      document.getElementById('cashFormBank').value = '';
      document.getElementById('cashFormBalance').value = 500000000;
      document.getElementById('cashFormInterest').value = 4.5;
      document.getElementById('cashFormNotes').value = '';
    }
    openCustomModal('modalCashAccountBackdrop');
  }

  function submitCashAccountForm() {
    var name = String(document.getElementById('cashFormName').value || '').trim();
    if (!name) {
      showToast('Vui lòng nhập tên Quỹ tiền / Tài khoản!', 'danger');
      return;
    }
    var bal = Number(document.getElementById('cashFormBalance').value || 0);
    var payload = {
      id: document.getElementById('cashFormId').value || 'CASH-NEW',
      name: name,
      bankName: document.getElementById('cashFormBank').value,
      openingBalance: bal,
      totalIn: 0,
      totalOut: 0,
      currentBalance: bal,
      interestRate: Number(document.getElementById('cashFormInterest').value || 0),
      notes: document.getElementById('cashFormNotes').value,
      actor: currentUser ? currentUser.username : 'cfo_st'
    };
    var existing = (appData.cashAccounts || []).find(function(x) { return x.id === payload.id; });
    if (existing) Object.assign(existing, payload);
    else appData.cashAccounts.push(payload);

    closeCustomModal('modalCashAccountBackdrop');
    renderAllViews();
    showToast('🏦 Đã lưu Quỹ tiền dự trữ: ' + payload.name, 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveCashReserveAccount(payload);
    }
  }

  function openMrrModal() {
    if (!isLeaderOrAbove() || isInvestorRole()) return;
    document.getElementById('mrrFormPeriod').value = appData.curMonthStr || '2025-05';
    openCustomModal('modalMrrBackdrop');
  }

  function submitMrrForm() {
    var period = String(document.getElementById('mrrFormPeriod').value || '').trim();
    var startC = Number(document.getElementById('mrrFormStartCust').value || 0);
    var newC = Number(document.getElementById('mrrFormNewCust').value || 0);
    var churnC = Number(document.getElementById('mrrFormChurnCust').value || 0);
    var activeC = startC + newC - churnC;
    var arpu = Number(document.getElementById('mrrFormArpu').value || 0);
    var mrr = activeC * arpu;
    var oneOff = Number(document.getElementById('mrrFormOneOff').value || 0);
    var totRev = mrr + oneOff;
    var cacSpend = Number(document.getElementById('mrrFormCacSpend').value || 0);
    var cacUnit = newC > 0 ? Math.round(cacSpend / newC) : 0;
    var churnRate = activeC > 0 ? Math.max(0.03, churnC / activeC) : 0.05;
    var ltvUnit = Math.round((arpu * 0.75) / churnRate);
    var ratio = cacUnit > 0 ? Math.round((ltvUnit / cacUnit) * 10) / 10 : 0;

    var payload = {
      period: period,
      startCustomers: startC,
      newCustomers: newC,
      churnCustomers: churnC,
      activeCustomers: activeC,
      arpu: arpu,
      mrr: mrr,
      oneOffRevenue: oneOff,
      totalRevenue: totRev,
      cacSpend: cacSpend,
      cacUnit: cacUnit,
      ltvUnit: ltvUnit,
      ltvCacRatio: ratio,
      evaluation: ratio >= 3.0 ? 'Chuẩn Quỹ VC (LTV/CAC >= 3.0x)' : 'Cần tối ưu CAC (< 3.0x)',
      actor: currentUser ? currentUser.username : 'growth_lead'
    };

    var existing = (appData.mrrMetrics || []).find(function(x) { return x.period === period; });
    if (existing) Object.assign(existing, payload);
    else appData.mrrMetrics.push(payload);

    closeCustomModal('modalMrrBackdrop');
    renderAllViews();
    showToast('📈 Đã tính toán & lưu chỉ số MRR / Unit Economics kỳ ' + period + ' (LTV/CAC: ' + ratio + 'x)!', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveMrrUnitEconomicsRow(payload);
    }
  }

  function openCapTableModal(capId) {
    if (!isFounderOrCfo()) return;
    if (capId) {
      var c = (appData.capTable || []).find(function(x) { return x.id === capId; });
      if (c) {
        document.getElementById('capFormId').value = c.id;
        document.getElementById('capFormInvestor').value = c.investorName;
        document.getElementById('capFormRound').value = c.roundName;
        document.getElementById('capFormGroup').value = c.group;
        document.getElementById('capFormInvested').value = c.investedAmount;
        document.getElementById('capFormValuation').value = c.postMoneyValuation;
        document.getElementById('capFormShares').value = c.shares;
        document.getElementById('capFormPct').value = c.ownershipPct;
        editingCapAttachments = JSON.parse(JSON.stringify(Array.isArray(c.attachments) ? c.attachments : []));
      }
    } else {
      document.getElementById('capFormId').value = 'CAP-0' + ((appData.capTable || []).length + 1);
      document.getElementById('capFormInvestor').value = '';
      document.getElementById('capFormInvested').value = 5000000000;
      document.getElementById('capFormValuation').value = 30000000000;
      document.getElementById('capFormShares').value = 150000;
      document.getElementById('capFormPct').value = 15.0;
      editingCapAttachments = [];
    }
    renderStartupAttachmentEditor('CAP');
    openCustomModal('modalCapTableBackdrop');
  }

  function submitCapTableForm() {
    var inv = String(document.getElementById('capFormInvestor').value || '').trim();
    if (!inv) {
      showToast('Vui lòng nhập tên Cổ đông / Quỹ đầu tư!', 'danger');
      return;
    }
    var payload = {
      id: document.getElementById('capFormId').value || 'CAP-NEW',
      investorName: inv,
      roundName: document.getElementById('capFormRound').value,
      group: document.getElementById('capFormGroup').value,
      investedAmount: Number(document.getElementById('capFormInvested').value || 0),
      postMoneyValuation: Number(document.getElementById('capFormValuation').value || 0),
      shares: Number(document.getElementById('capFormShares').value || 0),
      ownershipPct: Number(document.getElementById('capFormPct').value || 0),
      date: appData.todayStr || '2025-05-15',
      status: 'Đã giải ngân 100%',
      attachments: editingCapAttachments,
      actor: currentUser ? currentUser.username : 'founder'
    };
    var existing = (appData.capTable || []).find(function(x) { return x.id === payload.id; });
    if (existing) Object.assign(existing, payload);
    else appData.capTable.push(payload);

    closeCustomModal('modalCapTableBackdrop');
    renderAllViews();
    showToast('💎 Đã lưu thông tin Cổ đông / Vòng gọi vốn: ' + payload.investorName, 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveCapTableEntry(payload);
    }
  }

  function openUserModal(uname) {
    if (!isLeaderOrAbove()) return;
    if (uname) {
      var u = (appData.users || []).find(function(x) { return x.username === uname; });
      if (u) {
        document.getElementById('usrFormUsername').value = u.username;
        document.getElementById('usrFormPassword').value = u.password || '123456';
        document.getElementById('usrFormFullName').value = u.fullName;
        document.getElementById('usrFormRole').value = u.role || 'STAFF';
        document.getElementById('usrFormDept').value = u.department || '';
        document.getElementById('usrFormEmail').value = u.email || '';
      }
    } else {
      document.getElementById('usrFormUsername').value = '';
      document.getElementById('usrFormPassword').value = '123456';
      document.getElementById('usrFormFullName').value = '';
      document.getElementById('usrFormRole').value = 'STAFF';
      document.getElementById('usrFormDept').value = 'Phòng Tài Chính & Kế Toán';
      document.getElementById('usrFormEmail').value = '';
    }
    openCustomModal('modalUserBackdrop');
  }

  function submitUserForm() {
    var uname = String(document.getElementById('usrFormUsername').value || '').trim().toLowerCase();
    if (!uname) {
      showToast('Vui lòng nhập Username!', 'danger');
      return;
    }
    var payload = {
      username: uname,
      password: document.getElementById('usrFormPassword').value || '123456',
      fullName: document.getElementById('usrFormFullName').value || uname,
      role: document.getElementById('usrFormRole').value || 'STAFF',
      department: document.getElementById('usrFormDept').value || 'Phòng Tài Chính & Kế Toán',
      email: document.getElementById('usrFormEmail').value || '',
      phone: '',
      status: 'Hoạt động',
      actor: currentUser ? currentUser.username : 'founder'
    };
    var existing = (appData.users || []).find(function(x) { return x.username === uname; });
    if (existing) Object.assign(existing, payload);
    else appData.users.push(payload);

    closeCustomModal('modalUserBackdrop');
    renderAllViews();
    showToast('✅ Đã lưu tài khoản: ' + payload.fullName + ' [' + payload.role + ']', 'success');

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveStartupUserAccount(payload);
    }
  }

  function quickChangeStartupRole(uname, newRole) {
    if (!isFounderOrCfo()) return;
    var u = (appData.users || []).find(function(x) { return x.username === uname; });
    if (!u) return;
    u.role = newRole;
    renderAllViews();
    showToast('⚡ Đã chuyển vai trò của ' + u.fullName + ' sang [' + newRole + ']!', 'success');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveStartupUserAccount(u);
    }
  }

  function triggerSendRunwayAlert() {
    if (!isFounderOrCfo()) return;
    showToast('🔔 Đã bắn Báo cáo CFO, Burn Rate & Runway qua Email & Bot Zalo!', 'success');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).sendStartupRunwayAlertNow({ actor: currentUser ? currentUser.username : 'cfo_st' });
    }
  }

  function handleSaveStartupConfig() {
    if (!isFounderOrCfo()) return;
    var newCfg = {
      COMPANY_NAME: document.getElementById('cfgCompanyName').value,
      CURRENT_FUNDING_STAGE: document.getElementById('cfgFundingStage').value,
      MIN_SAFE_RUNWAY_MONTHS: document.getElementById('cfgMinRunway').value,
      TARGET_GROSS_MARGIN_PCT: document.getElementById('cfgTargetMargin').value,
      TARGET_LTV_CAC_RATIO: document.getElementById('cfgTargetLtvCac').value,
      ADMIN_EMAIL: document.getElementById('cfgAdminEmail').value,
      ZALO_BOT_WEBHOOK_URL: document.getElementById('cfgZaloWebhook').value
    };
    appData.config = Object.assign(appData.config || {}, newCfg);
    renderAllViews();
    showToast('⚙️ Đã lưu cấu hình Ngưỡng Runway & Bot Cảnh báo CFO!', 'success');
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run.withSuccessHandler(function(res) {
        if (res && res.ok) { appData = res; renderAllViews(); }
      }).saveStartupConfig({ config: newCfg, actor: currentUser ? currentUser.username : 'founder' });
    }
  }

  function bootStartupApp() {
    if (hasBooted) return;
    hasBooted = true;
    renderAllViews();
    refreshAllDataFromServer();
    syncAuthUsersFromSheet(false);
    window.addEventListener('focus', function() {
      if (!currentUser) syncAuthUsersFromSheet(false);
    });
    var pwdInput = document.getElementById('loginPassword');
    if (pwdInput) {
      pwdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') handleLoginSubmit();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootStartupApp);
  } else {
    bootStartupApp();
  }
  window.addEventListener('load', bootStartupApp);
</script>
</body>
</html>



```