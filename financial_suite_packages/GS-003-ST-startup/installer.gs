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
