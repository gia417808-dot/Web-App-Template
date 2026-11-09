# 🏛️ GS-003-ENT v4.1 Commercial Pro — Trung Tâm Điều Hành FP&A Tập Đoàn & Đa Chi Nhánh (> 500 Nhân Sự)

**Báo Cáo Hợp Nhất Đa Đơn Vị (`Multi-BU Consolidation`) • Đa Kịch Bản (`Base/Best/Worst Case` & `What-if Sensitivity`) • Trung Tâm Chi Phí (`Cost Centers & Committed PO`) • Thẩm Định Đầu Tư Vốn (`CAPEX NPV/IRR/Payback`) • Đối Chiếu Loại Trừ Nội Bộ (`Intercompany Elimination`) + Cẩm Nang FP&A Tập Đoàn Cho Người Mới**

## 1. Kiến Trúc 9 Sheet Tự Động Khởi Tạo & Đồng Bộ 2 Chiều (`SpreadsheetApp.flush()`)

1. `HUONG_DAN_SU_DUNG`: Cẩm nang giải nghĩa chi tiết 8 nhóm kiến thức FP&A Tập đoàn (`Multi-BU Consolidation`, `Intercompany Elimination`, `Base/Best/Worst Scenario Modeling`, `Cost Centers & Committed PO`, `HQ Shared Services Allocation`, `WACC vs ROIC & EVA`, `CAPEX NPV/IRR/Payback`, Quy trình 5 bước điều hành) kèm ví dụ thực tế.

2. `CAU_HINH`: Tham số Tập đoàn (`HOLDING_NAME`, `WACC_PCT = 11.5%`, `CIT_TAX_RATE_PCT = 20%`, `HURDLE_RATE_IRR_PCT = 15%`, `MAX_PAYBACK_YEARS = 4.0`, `CC_ALERT_THRESHOLD_PCT = 85%`, `USD_VND_RATE`, `ACTIVE_SCENARIO`).

3. `PHAN_QUYEN`: Phân quyền 4 cấp Tập đoàn (`group_ceo`, `group_cfo`, `head_fpa`, `bu_director`) với cơ chế **xác thực mật khẩu trực tiếp từ Google Sheets theo thời gian thực (`verifyEntLogin`)** — đổi mật khẩu trên Sheet có hiệu lực ngay lập tức trên Web App.

4. `HOP_NHAT_DON_VI_BU`: Báo cáo Hợp nhất Kết quả Kinh doanh & Hiệu quả Vốn theo 6 Đơn vị thành viên (`BU-01` → `BU-06`): Doanh thu bên ngoài, Doanh thu nội bộ (`IC`), Giá vốn (`COGS`), OPEX trực tiếp, Phí HQ phân bổ, `EBITDA`, Khấu hao (`D&A`), `EBIT`, Thuế `CIT`, `NOPAT`, Vốn đầu tư (`Invested Capital`), `ROIC (%)` và Giá trị kinh tế gia tăng (`EVA`).

5. `KICH_BAN_DU_PHONG_12T`: Mô hình Dự phóng Dòng tiền & EBITDA 12 tháng cho 3 kịch bản (`BASE`, `BEST`, `WORST`) kết hợp Bộ mô phỏng độ nhạy thời gian thực (`What-if Sensitivity Sliders`) và Ma trận độ nhạy 2 chiều.

6. `TRUNG_TAM_CHI_PHI_CC`: Kiểm soát Ngân sách Trung tâm Chi phí (`Approved Budget` vs `Actual Spend` vs `Committed PO`) và tự động phân bổ Chi phí Dịch vụ chung Tập đoàn (`HQ Shared Services Allocation`) theo Doanh thu hoặc Nhân sự.

7. `DANH_MUC_DAU_TU_CAPEX`: Thẩm định Danh mục Dự án Đầu tư Vốn & M&A, tự động chiết khấu dòng tiền 5 năm theo `WACC` để tính `NPV`, `IRR (%)` và `Thời gian hoàn vốn (Payback Years)`.

8. `GIAO_DICH_NOI_BO_IC`: Sổ Đối chiếu & Loại trừ Giao dịch Nội bộ Tập đoàn giữa các BU (`Seller BU` vs `Buyer BU`), kiểm soát chênh lệch đối chiếu bằng `0` trước khi lên báo cáo hợp nhất.

9. `NHAT_KY_HE_THONG`: Nhật ký Kiểm toán Tập đoàn (`Enterprise Audit Trail`) ghi vết toàn bộ thao tác điều hành.

## 2. File 1: `appsscript.json`

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

## 3. File 2: `installer.gs`

```
/**
 * ============================================================================
 * GS-003-ENT: TRUNG TÂM ĐIỀU HÀNH FP&A TẬP ĐOÀN & ĐA CHI NHÁNH (> 500 NHÂN SỰ)
 * BÁO CÁO HỢP NHẤT ĐA ĐƠN VỊ (MULTI-BU CONSOLIDATION), ĐA KỊCH BẢN (BASE/BEST/WORST),
 * TRUNG TÂM CHI PHÍ (COST CENTERS), ĐẦU TƯ VỐN (CAPEX NPV/IRR) & GIAO DỊCH NỘI BỘ
 * Phiên bản: v4.1 Commercial Pro (Cấp 4 trong Bộ Tứ Quản Trị Tài Chính Doanh Nghiệp)
 * File: installer.gs — Khởi tạo tự động 9 Sheet Chuẩn FP&A Tập Đoàn
 * ============================================================================
 */

function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('🏛️ FP&A TẬP ĐOÀN & MULTI-BU (GS-003-ENT PRO)')
      .addItem('🚀 1. Khởi tạo / Làm mới Database FP&A Tập Đoàn (9 Sheets)', 'setupEntFinanceDatabase')
      .addSeparator()
      .addItem('🔄 2. Tự động Hợp nhất Báo cáo Tập đoàn & Loại trừ Nội bộ', 'recalculateEntConsolidation')
      .addItem('🔔 3. Quét & Cảnh báo Vượt Ngân sách Trung tâm Chi phí (Cost Centers)', 'sendEntCostCenterAlert')
      .addToUi();
  } catch (e) {}
}

function setupEntFinanceDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Không tìm thấy Google Spreadsheet!');

  try {
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  } catch (e) {}

  var requiredTabs = [
    'HUONG_DAN_SU_DUNG',
    'CAU_HINH',
    'PHAN_QUYEN',
    'HOP_NHAT_DON_VI_BU',
    'KICH_BAN_DU_PHONG_12T',
    'TRUNG_TAM_CHI_PHI_CC',
    'DANH_MUC_DAU_TU_CAPEX',
    'GIAO_DICH_NOI_BO_IC',
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
  var curYearStr = Utilities.formatDate(today, 'Asia/Ho_Chi_Minh', 'yyyy');
  function fmtDateOffset(days) {
    var d = new Date(today.getTime() + days * 86400000);
    return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }

  // =========================================================================
  // 1. TAB HUONG_DAN_SU_DUNG (CẨM NANG FP&A TẬP ĐOÀN CHO NGƯỜI MỚI)
  // =========================================================================
  var shGuide = ss.getSheetByName('HUONG_DAN_SU_DUNG');
  shGuide.getRange('A1:E1').merge().setValue('📘 CẨM NANG HƯỚNG DẪN SỬ DỤNG & TỪ ĐIỂN THUẬT NGỮ FP&A TẬP ĐOÀN (MULTI-BU, SCENARIO, COST CENTER, CAPEX NPV/IRR, ROIC vs WACC) — GS-003-ENT v4.1 PRO')
    .setBackground('#0F172A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  shGuide.setRowHeight(1, 38);

  var guideHeaders = [[
    'PHÂN NHÓM ĐIỀU HÀNH', 'THUẬT NGỮ / CHỈ SỐ TRÊN APP', 'GIẢI THÍCH DỄ HIỂU CHO NGƯỜI MỚI (NGÔN NGỮ BÌNH DÂN)',
    'CÔNG THỨC CHUẨN TẬP ĐOÀN & NGƯỠNG RA QUYẾT ĐỊNH CỦA HĐQT', 'VÍ DỤ THỰC TẾ TẠI TẬP ĐOÀN > 500 NHÂN SỰ'
  ]];
  shGuide.getRange('A2:E2').setValues(guideHeaders).setBackground('#1E3A8A').setFontColor('#FFFFFF').setFontWeight('bold');

  var guideRows = [
    [
      '1. Báo Cáo Hợp Nhất Đa Đơn Vị (Multi-BU Consolidation)',
      'Business Unit (BU) & Báo cáo Hợp nhất (Consolidated P&L)',
      'Mỗi công ty con hoặc khối kinh doanh (Công nghệ, Sản xuất, Phân phối...) là 1 Đơn vị kinh doanh (BU). Báo cáo Hợp nhất là bức tranh tổng hợp toàn Tập đoàn sau khi cộng gộp các BU và trừ đi các khoản mua bán chéo nội bộ.',
      'Doanh thu Hợp nhất = Tổng Doanh thu Bên ngoài (External Revenue) của tất cả BU (Đã loại trừ Doanh thu Nội bộ Intercompany)',
      'BU Công nghệ bán phần mềm 1,2 tỷ cho BU Phân phối và bán ra thị trường 32 tỷ. Khi lên báo cáo Tập đoàn, 1,2 tỷ nội bộ bị loại trừ, chỉ ghi nhận 32 tỷ doanh thu thực thu từ bên ngoài.'
    ],
    [
      '2. Giao Dịch Nội Bộ & Loại Trừ (Intercompany Elimination)',
      'Intercompany (IC) Revenue / Expense Elimination',
      'Khi các công ty con trong cùng Tập đoàn mua bán hàng hóa, cho vay hoặc thu phí dịch vụ lẫn nhau, nếu cộng ngang sẽ làm "phồng ảo" doanh thu và chi phí của Tập đoàn. Hệ thống tự động đối khớp và triệt tiêu (Eliminate) các khoản này.',
      'Chênh lệch Đối chiếu Nội bộ = |Phải thu Nội bộ BU Bán - Phải trả Nội bộ BU Mua| (Bắt buộc = 0 khi khóa sổ)',
      'Văn phòng Tập đoàn (HQ) thu phí quản trị 800 triệu từ BU Sản xuất. Trên báo cáo riêng, HQ có thu 800tr, BU có chi 800tr; trên báo cáo Hợp nhất Tập đoàn, khoản này tự động triệt tiêu về 0.'
    ],
    [
      '3. Mô Hình Đa Kịch Bản (Scenario Modeling)',
      'Base Case / Best Case / Worst Case & What-if Sensitivity',
      'Thay vì chỉ lập 1 kế hoạch cố định, Tập đoàn luôn chuẩn bị 3 kịch bản: Kịch bản Cơ sở (Base - khả năng xảy ra cao nhất), Kịch bản Tích cực (Best - thị trường thuận lợi) và Kịch bản Phòng thủ (Worst - suy thoái/đứt gãy chuỗi cung ứng).',
      'Biên độ Độ nhạy (What-if): Thay đổi +-5% Doanh thu hoặc +-3% Giá vốn (COGS) tác động bao nhiêu tỷ đồng lên EBITDA và Dòng tiền tự do (FCF) toàn Tập đoàn',
      'Nếu giá nguyên liệu tăng 5% (Worst Case), EBITDA Tập đoàn giảm 14,5 tỷ; CFO kích hoạt ngay phương án cắt giảm 15% ngân sách chi phí không thiết yếu.'
    ],
    [
      '4. Trung Tâm Chi Phí & Cam Kết Chi (Cost Centers & Committed PO)',
      'Approved Budget vs Actual Spend vs Committed PO',
      'Ở quy mô Tập đoàn, nếu chỉ nhìn "Thực chi" (Actual) thì đã muộn vì các phòng ban đã ký hợp đồng mua sắm (PO) chờ thanh toán. Ngân sách khả dụng thực sự phải trừ đi cả các khoản Đã ký PO cam kết chi (Committed).',
      'Ngân sách Khả dụng (Available Budget) = Ngân sách Được duyệt (Approved) - Thực chi (Actual) - Đã cam kết PO (Committed)',
      'Khối Marketing có ngân sách Quý là 10 tỷ, đã giải ngân 6,5 tỷ và vừa ký hợp đồng sự kiện 2,5 tỷ (Committed PO). Ngân sách khả dụng còn lại chỉ là 1,0 tỷ (đã dùng 90%).'
    ],
    [
      '5. Phân Bổ Chi Phí Tập Đoàn (HQ Shared Services Allocation)',
      'Cost Allocation Driver (Headcount / Revenue / Square Meter)',
      'Các bộ phận dùng chung tại Trụ sở chính (Ban Pháp chế, CNTT Tập đoàn, Nhân sự Tập đoàn, Kiểm toán nội bộ) không trực tiếp tạo doanh thu nên chi phí được phân bổ công bằng xuống các BU theo tiêu thức minh bạch (Tỷ trọng Doanh thu hoặc Số lượng nhân sự).',
      'Chi phí HQ phân bổ cho BU (i) = Tổng Chi phí HQ cần phân bổ × (% Tỷ trọng Phân bổ của BU i)',
      'Trung tâm CNTT Tập đoàn chi 4 tỷ/quý. BU Thương mại chiếm 40% nhân sự toàn Tập đoàn nên nhận phân bổ 1,6 tỷ chi phí hạ tầng CNTT.'
    ],
    [
      '6. Chi Phí Vốn & Giá Trị Kinh Tế Gia Tăng (WACC, ROIC & EVA)',
      'ROIC (Tỷ suất Sinh lời trên Vốn Đầu tư) vs WACC (Chi phí Sử dụng Vốn)',
      'WACC là lãi suất bình quân Tập đoàn phải trả cho Ngân hàng và Cổ đông để huy động vốn (ví dụ 11%/năm). ROIC là tỷ suất sinh lời thực tế mà mỗi BU tạo ra từ số vốn được giao. Một BU chỉ thực sự tạo ra giá trị mới (EVA > 0) khi ROIC lớn hơn WACC.',
      'ROIC (%) = NOPAT (Lợi nhuận sau thuế từ HĐKD) / Vốn đầu tư (Invested Capital) | EVA = Invested Capital × (ROIC - WACC)',
      'BU Công nghệ được giao 80 tỷ vốn, tạo ra NOPAT 19,2 tỷ -> ROIC = 24%/năm. Với WACC Tập đoàn là 11%, BU này tạo ra giá trị gia tăng kinh tế EVA = 80 × (24% - 11%) = +10,4 tỷ đồng.'
    ],
    [
      '7. Thẩm Định Dự Án Đầu Tư Vốn (CAPEX Portfolio: NPV, IRR, Payback)',
      'NPV (Giá trị Hiện tại Ròng), IRR (Tỷ suất Hoàn vốn Nội bộ) & Payback Period',
      'Trước khi chi hàng chục tỷ xây nhà máy, mở chuỗi hay M&A, Hội đồng Đầu tư dùng 3 thước đo: NPV > 0 (dự án đem lại lãi ròng sau khi quy dòng tiền tương lai về hiện tại), IRR > WACC (lãi suất dự án cao hơn lãi vốn vay) và Thời gian hoàn vốn (Payback) nằm trong chuẩn cho phép.',
      'Quy tắc Phê duyệt CAPEX: Duyệt đầu tư khi NPV > 0 VÀ IRR > WACC (Hurdle Rate) VÀ Payback <= Chuẩn Tập đoàn',
      'Dự án Nhà máy Tự động hóa cần vốn CAPEX 45 tỷ, dòng tiền thu về 5 năm đạt NPV = +16,8 tỷ, IRR = 21,4% (> WACC 11%), hoàn vốn sau 3,1 năm -> Hội đồng Đầu tư Phê duyệt.'
    ],
    [
      '8. Quy Trình 5 Bước Điều Hành Trên Web App',
      'Luồng Vận Hành Chuẩn Từ BU Lên HĐQT Tập Đoàn (100% Real-time Sync)',
      'Bước 1: Đăng nhập theo phân quyền (CEO/CFO Tập đoàn, Trưởng ban FP&A, Giám đốc BU) -> Bước 2: Cập nhật Kết quả Kinh doanh từng BU & Giao dịch Nội bộ -> Bước 3: Kiểm soát Ngân sách Trung tâm Chi phí (Actual + Committed PO) -> Bước 4: Chạy Mô phỏng Đa kịch bản (Base/Best/Worst) & Độ nhạy -> Bước 5: Thẩm định danh mục CAPEX & Xuất báo cáo HĐQT.',
      'Mọi thao tác Thêm / Sửa / Xóa trên Web App đều tự động ghi 2 chiều xuống Google Sheets (SpreadsheetApp.flush()) và cập nhật mật khẩu trực tiếp từ Sheet PHAN_QUYEN.',
      'Khi CFO đổi mật khẩu của Giám đốc BU trên Sheet PHAN_QUYEN hoặc điều chỉnh WACC từ 11% lên 12%, Web App áp dụng ngay lập tức mà không cần triển khai lại.'
    ]
  ];
  shGuide.getRange(3, 1, guideRows.length, 5).setValues(guideRows);
  shGuide.getRange(3, 1, guideRows.length, 5).setWrap(true).setVerticalAlignment('top').setFontSize(10);
  shGuide.getRange(3, 1, guideRows.length, 2).setFontWeight('bold').setBackground('#F8FAFC');
  shGuide.setColumnWidth(1, 210);
  shGuide.setColumnWidth(2, 230);
  shGuide.setColumnWidth(3, 360);
  shGuide.setColumnWidth(4, 310);
  shGuide.setColumnWidth(5, 340);

  // =========================================================================
  // 2. TAB CAU_HINH (THAM SỐ TẬP ĐOÀN & HỘI ĐỒNG ĐẦU TƯ)
  // =========================================================================
  var shCfg = ss.getSheetByName('CAU_HINH');
  shCfg.getRange('A1:C1').setValues([['KHOA_CAU_HINH', 'GIA_TRI', 'MO_TA_CHI_TIET']])
    .setBackground('#0F172A').setFontColor('#FFFFFF').setFontWeight('bold');

  var cfgRows = [
    ['HOLDING_NAME', 'TẬP ĐOÀN ĐẦU TƯ & CÔNG NGHỆ ĐẠI VIỆT (DAI VIET GROUP HOLDINGS)', 'Tên pháp nhân Tập đoàn / Tổng công ty hiển thị trên báo cáo HĐQT'],
    ['FISCAL_YEAR', curYearStr, 'Năm tài chính hợp nhất hiện hành'],
    ['REPORTING_PERIOD', curMonthStr, 'Kỳ báo cáo hợp nhất hiện tại (YYYY-MM)'],
    ['CURRENCY', 'VND', 'Đơn vị tiền tệ báo cáo hợp nhất'],
    ['USD_VND_RATE', '25450', 'Tỷ giá quy đổi USD/VND phục vụ hợp nhất đơn vị quốc tế'],
    ['WACC_PCT', '11.5', 'Chi phí sử dụng vốn bình quân gia quyền Tập đoàn (WACC %/năm)'],
    ['CIT_TAX_RATE_PCT', '20', 'Thuế suất Thuế Thu nhập Doanh nghiệp tiêu chuẩn (CIT %)'],
    ['HURDLE_RATE_IRR_PCT', '15.0', 'Tỷ suất IRR tối thiểu Hội đồng Đầu tư yêu cầu khi duyệt dự án CAPEX (%)'],
    ['MAX_PAYBACK_YEARS', '4.0', 'Thời gian hoàn vốn tối đa cho phép đối với dự án CAPEX (Năm)'],
    ['CC_ALERT_THRESHOLD_PCT', '85', 'Ngưỡng cảnh báo sử dụng ngân sách Trung tâm chi phí (Actual + Committed >= % Budget)'],
    ['ACTIVE_SCENARIO', 'BASE', 'Kịch bản điều hành mặc định (BASE = Cơ sở, BEST = Tích cực, WORST = Phòng thủ)'],
    ['TARGET_GROUP_EBITDA_MARGIN_PCT', '24.0', 'Mục tiêu Biên EBITDA Hợp nhất toàn Tập đoàn (%)'],
    ['TARGET_GROUP_ROIC_PCT', '18.5', 'Mục tiêu Tỷ suất sinh lời trên vốn đầu tư toàn Tập đoàn (ROIC %)'],
    ['ALERT_EMAIL', 'cfo.group@daiviet-holdings.vn', 'Email nhận cảnh báo vượt ngân sách Trung tâm chi phí & chênh lệch nội bộ']
  ];
  shCfg.getRange(2, 1, cfgRows.length, 3).setValues(cfgRows);
  shCfg.setColumnWidth(1, 260);
  shCfg.setColumnWidth(2, 340);
  shCfg.setColumnWidth(3, 460);

  // =========================================================================
  // 3. TAB PHAN_QUYEN (RBAC TẬP ĐOÀN - XÁC THỰC TRỰC TIẾP TỪ SHEET)
  // =========================================================================
  var shAuth = ss.getSheetByName('PHAN_QUYEN');
  shAuth.getRange('A1:I1').setValues([[
    'USERNAME', 'MAT_KHAU', 'HO_TEN', 'VAI_TRO', 'DON_VI_BU', 'EMAIL', 'PHAM_VI_DU_LIEU', 'QUYEN_PHE_DUYET', 'TRANG_THAI'
  ]]).setBackground('#0F172A').setFontColor('#FFFFFF').setFontWeight('bold');

  var authRows = [
    ['group_ceo', 'ceo123', 'Chủ Tịch / TGĐ Tập Đoàn Trần Quốc Vương', 'GROUP_CEO', 'ALL_GROUP', 'ceo@daiviet-holdings.vn', 'ALL_GROUP', 'APPROVE_ALL_CAPEX_AND_BUDGET', 'HOAT_DONG'],
    ['group_cfo', 'cfo123', 'CFO Tập Đoàn Nguyễn Minh Tuyết', 'GROUP_CFO', 'ALL_GROUP', 'cfo@daiviet-holdings.vn', 'ALL_GROUP', 'APPROVE_CONSOLIDATION_AND_CAPEX', 'HOAT_DONG'],
    ['head_fpa', 'fpa123', 'Trưởng Ban FP&A Tập Đoàn Lê Hoàng Bách', 'HEAD_FPA', 'ALL_GROUP', 'fpa@daiviet-holdings.vn', 'ALL_GROUP', 'MANAGE_SCENARIO_AND_ALLOCATION', 'HOAT_DONG'],
    ['bu_director', 'bu123', 'Giám Đốc Khối Công Nghệ Phạm Tuấn Anh', 'BU_DIRECTOR', 'BU-01', 'bu01@daiviet-holdings.vn', 'BU_ONLY', 'SUBMIT_BU_REPORT_AND_CAPEX', 'HOAT_DONG']
  ];
  shAuth.getRange(2, 1, authRows.length, 9).setValues(authRows);
  shAuth.getRange(2, 1, authRows.length, 2).setNumberFormat('@');
  shAuth.setColumnWidths(1, 9, 165);

  // =========================================================================
  // 4. TAB HOP_NHAT_DON_VI_BU (BÁO CÁO KẾT QUẢ KINH DOANH & VỐN ĐẦU TƯ THEO BU)
  // =========================================================================
  var shBu = ss.getSheetByName('HOP_NHAT_DON_VI_BU');
  shBu.getRange('A1:R1').setValues([[
    'MA_BU', 'TEN_DON_VI_BU', 'KHOI_NGANH', 'GIAM_DOC_BU', 'NHAN_SU_HC',
    'DOANH_THU_BEN_NGOAI', 'DOANH_THU_NOI_BO_IC', 'GIA_VON_COGS', 'CHI_PHI_OPEX_TRUC_TIEP',
    'CHI_PHI_HQ_PHAN_BO', 'EBITDA_BU', 'KHAU_HAO_DA', 'EBIT_BU', 'THUE_CIT',
    'LOI_NHUAN_SAU_THUE_NOPAT', 'VON_DAU_TU_INVESTED_CAP', 'ROIC_PCT', 'EVA_GIA_TRI_GIA_TANG'
  ]]).setBackground('#1E3A8A').setFontColor('#FFFFFF').setFontWeight('bold');

  // Helper to build BU rows with consistent math (WACC = 11.5%, CIT = 20%)
  function makeBuRow(code, name, sector, director, hc, extRev, icRev, cogs, directOpex, hqAlloc, da, invCap) {
    var totalRev = extRev + icRev;
    var ebitda = totalRev - cogs - directOpex - hqAlloc;
    var ebit = ebitda - da;
    var tax = ebit > 0 ? Math.round(ebit * 0.20) : 0;
    var nopat = ebit - tax;
    var roicPct = invCap > 0 ? Number(((nopat / invCap) * 100).toFixed(2)) : 0;
    var eva = Math.round(nopat - (invCap * 0.115));
    return [
      code, name, sector, director, hc,
      extRev, icRev, cogs, directOpex,
      hqAlloc, ebitda, da, ebit, tax,
      nopat, invCap, roicPct, eva
    ];
  }

  var buRows = [
    makeBuRow('BU-01', 'Khối Công Nghệ, Cloud & AI Enterprise', 'Công Nghệ & SaaS', 'Phạm Tuấn Anh', 185,
              48500000000, 3200000000, 14200000000, 16800000000, 2100000000, 1800000000, 68000000000),
    makeBuRow('BU-02', 'Khối Thương Mại & Phân Phối Toàn Quốc', 'Thương Mại B2B/B2C', 'Đặng Thu Hà', 240,
              76000000000, 1800000000, 49500000000, 13400000000, 2400000000, 1500000000, 55000000000),
    makeBuRow('BU-03', 'Khối Sản Xuất Công Nghiệp & Tự Động Hóa', 'Sản Xuất Chế Tạo', 'Vũ Hoàng Nam', 310,
              92000000000, 4500000000, 58800000000, 14600000000, 2800000000, 4200000000, 110000000000),
    makeBuRow('BU-04', 'Khối Chuỗi Cung Ứng & Logistics Lạnh', 'Hậu Cần & Kho Vận', 'Ngô Quốc Khánh', 145,
              34500000000, 2900000000, 20400000000, 7200000000, 1400000000, 2100000000, 46000000000),
    makeBuRow('BU-05', 'Khối Hạ Tầng Khu Công Nghiệp & Năng Lượng Xanh', 'BĐS Công Nghiệp', 'Trịnh Minh Đức', 95,
              54000000000, 1100000000, 24500000000, 8900000000, 1800000000, 3600000000, 125000000000),
    makeBuRow('BU-06', 'Trung Tâm Dịch Vụ Chung Tập Đoàn (HQ Shared Services)', 'Quản Trị Tập Đoàn', 'Nguyễn Minh Tuyết', 65,
              0, 10500000000, 0, 9800000000, 0, 550000000, 18000000000)
  ];
  shBu.getRange(2, 1, buRows.length, 18).setValues(buRows);
  shBu.getRange(2, 6, buRows.length, 11).setNumberFormat('#,##0');
  shBu.getRange(2, 18, buRows.length, 1).setNumberFormat('#,##0');
  shBu.setColumnWidths(1, 18, 145);

  // =========================================================================
  // 5. TAB KICH_BAN_DU_PHONG_12T (MÔ HÌNH DỰ PHÓNG ĐA KỊCH BẢN 12 THÁNG)
  // =========================================================================
  var shScen = ss.getSheetByName('KICH_BAN_DU_PHONG_12T');
  shScen.getRange('A1:N1').setValues([[
    'MA_DONG', 'MA_KICH_BAN', 'KY_THANG', 'DOANH_THU_HOP_NHAT', 'GIA_VON_COGS',
    'LOI_NHUAN_GOP', 'CHI_PHI_OPEX_TAP_DOAN', 'EBITDA_TAP_DOAN', 'BIEN_EBITDA_PCT',
    'CAPEX_GIAI_NGAN', 'THAY_DOI_VON_LUU_DONG_NWC', 'DONG_TIEN_TU_DO_FCF', 'SO_DU_TIEN_TAP_DOAN', 'GHI_CHU_KICH_BAN'
  ]]).setBackground('#047857').setFontColor('#FFFFFF').setFontWeight('bold');

  var scenRows = [];
  var scenarios = [
    { code: 'BASE', revMult: 1.00, cogsRatio: 0.548, opexMult: 1.00, capexBase: 4200000000, note: 'Kịch bản Cơ sở (Base Case) — Tăng trưởng ổn định theo kế hoạch HĐQT' },
    { code: 'BEST', revMult: 1.16, cogsRatio: 0.525, opexMult: 1.05, capexBase: 4800000000, note: 'Kịch bản Tích cực (Best Case) — Mở rộng thị phần B2B & tối ưu biên gộp' },
    { code: 'WORST', revMult: 0.84, cogsRatio: 0.582, opexMult: 0.92, capexBase: 2600000000, note: 'Kịch bản Phòng thủ (Worst Case) — Suy giảm cầu & kích hoạt cắt giảm OPEX/CAPEX' }
  ];

  var rowCounter = 1;
  scenarios.forEach(function(sc) {
    var cashBal = 85000000000;
    for (var m = 1; m <= 12; m++) {
      var mStr = curYearStr + '-' + (m < 10 ? '0' + m : '' + m);
      var baseMonthlyRev = (48500000000 + (m - 1) * 2150000000);
      var rev = Math.round(baseMonthlyRev * sc.revMult);
      var cogs = Math.round(rev * sc.cogsRatio);
      var gp = rev - cogs;
      var opex = Math.round((11200000000 + (m - 1) * 320000000) * sc.opexMult);
      var ebitda = gp - opex;
      var ebitdaMargin = rev > 0 ? Number(((ebitda / rev) * 100).toFixed(2)) : 0;
      var capex = (m % 3 === 0) ? Math.round(sc.capexBase * 1.35) : sc.capexBase;
      var nwcDelta = Math.round(rev * 0.018);
      var taxEst = ebitda > 0 ? Math.round(ebitda * 0.16) : 0;
      var fcf = ebitda - taxEst - capex - nwcDelta;
      cashBal += fcf;
      var rowId = 'SC-' + sc.code + '-' + (m < 10 ? '0' + m : '' + m);
      scenRows.push([
        rowId, sc.code, mStr, rev, cogs, gp, opex, ebitda, ebitdaMargin, capex, nwcDelta, fcf, cashBal, sc.note
      ]);
      rowCounter++;
    }
  });
  shScen.getRange(2, 1, scenRows.length, 14).setValues(scenRows);
  shScen.getRange(2, 4, scenRows.length, 5).setNumberFormat('#,##0');
  shScen.getRange(2, 10, scenRows.length, 4).setNumberFormat('#,##0');
  shScen.setColumnWidths(1, 14, 150);

  // =========================================================================
  // 6. TAB TRUNG_TAM_CHI_PHI_CC (QUẢN TRỊ NGÂN SÁCH COST CENTERS & COMMITTED PO)
  // =========================================================================
  var shCc = ss.getSheetByName('TRUNG_TAM_CHI_PHI_CC');
  shCc.getRange('A1:M1').setValues([[
    'MA_CC', 'TEN_TRUNG_TAM_CHI_PHI', 'DON_VI_BU', 'LOAI_TRUNG_TAM', 'TIEU_THUC_PHAN_BO',
    'NGAN_SACH_DUYET_BUDGET', 'THUC_CHI_ACTUAL', 'CAM_KET_PO_COMMITTED', 'TONG_SU_DUNG_TOTAL_USED',
    'NGAN_SACH_KHA_DUNG', 'TY_LE_SU_DUNG_PCT', 'TRANG_THAI_KIEM_SOAT', 'NGUOI_PHU_TRACH'
  ]]).setBackground('#4338CA').setFontColor('#FFFFFF').setFontWeight('bold');

  function makeCcRow(code, name, bu, ctype, driver, budget, actual, committed, owner) {
    var totalUsed = actual + committed;
    var avail = budget - totalUsed;
    var pct = budget > 0 ? Number(((totalUsed / budget) * 100).toFixed(1)) : 0;
    var status = pct > 100 ? 'VUOT_NGAN_SACH' : (pct >= 85 ? 'CANH_BAO_CAO' : 'AN_TOAN');
    return [code, name, bu, ctype, driver, budget, actual, committed, totalUsed, avail, pct, status, owner];
  }

  var ccRows = [
    makeCcRow('CC-101', 'Trung Tâm R&D AI & Hạ Tầng Cloud Tập Đoàn', 'BU-01', 'PROFIT_SUPPORT', 'Tỷ trọng Doanh thu Công nghệ', 8500000000, 5600000000, 1850000000, 'Phạm Tuấn Anh'),
    makeCcRow('CC-102', 'Trung Tâm Tiếp Thị Số & Trade Marketing Toàn Quốc', 'BU-02', 'REVENUE_DRIVER', 'Tỷ trọng Doanh số B2B/B2C', 7200000000, 5400000000, 1450000000, 'Đặng Thu Hà'),
    makeCcRow('CC-103', 'Trung Tâm Bảo Trì Dây Chuyền & Khuôn Mẫu Nhà Máy', 'BU-03', 'MANUFACTURING_OH', 'Số giờ máy chạy (Machine Hours)', 9600000000, 6800000000, 1300000000, 'Vũ Hoàng Nam'),
    makeCcRow('CC-104', 'Trung Tâm Điều Phối Đội Xe & Kho Lạnh Miền Nam', 'BU-04', 'LOGISTICS_OPS', 'Sản lượng tấn-km vận chuyển', 5400000000, 4100000000, 1550000000, 'Ngô Quốc Khánh'),
    makeCcRow('CC-105', 'Ban Phát Triển Dự Án & Pháp Lý Khu Công Nghiệp', 'BU-05', 'PROJECT_DEV', 'Diện tích đất thương phẩm (Ha)', 6200000000, 3900000000, 950000000, 'Trịnh Minh Đức'),
    makeCcRow('CC-901', 'Khối Công Nghệ Thông Tin & An Ninh Mạng Tập Đoàn (HQ IT)', 'BU-06', 'SHARED_SERVICE_HQ', 'Số lượng nhân sự (Headcount)', 4500000000, 3100000000, 820000000, 'Lê Hoàng Bách'),
    makeCcRow('CC-902', 'Ban Tài Chính FP&A, Pháp Chế & Kiểm Toán Nội Bộ (HQ G&A)', 'BU-06', 'SHARED_SERVICE_HQ', 'Tỷ trọng Doanh thu Hợp nhất', 3800000000, 2650000000, 450000000, 'Nguyễn Minh Tuyết'),
    makeCcRow('CC-903', 'Học Viện Đào Tạo & Quản Trị Nguồn Nhân Lực Tập Đoàn (HQ HR)', 'BU-06', 'SHARED_SERVICE_HQ', 'Số lượng nhân sự (Headcount)', 2200000000, 1450000000, 380000000, 'Trần Quốc Vương')
  ];
  shCc.getRange(2, 1, ccRows.length, 13).setValues(ccRows);
  shCc.getRange(2, 6, ccRows.length, 5).setNumberFormat('#,##0');
  shCc.setColumnWidths(1, 13, 155);

  // =========================================================================
  // 7. TAB DANH_MUC_DAU_TU_CAPEX (THẨM ĐỊNH DỰ ÁN CAPEX: NPV, IRR, PAYBACK)
  // =========================================================================
  var shCapex = ss.getSheetByName('DANH_MUC_DAU_TU_CAPEX');
  shCapex.getRange('A1:N1').setValues([[
    'MA_DU_AN', 'TEN_DU_AN_CAPEX', 'DON_VI_BU', 'NHOM_DAU_TU', 'VON_DAU_TU_CAPEX',
    'DONG_TIEN_NAM_1', 'DONG_TIEN_NAM_2', 'DONG_TIEN_NAM_3', 'DONG_TIEN_NAM_4', 'DONG_TIEN_NAM_5',
    'NPV_HIEN_TAI_RONG', 'IRR_TY_SUAT_PCT', 'THOI_GIAN_HOAN_VON_NAM', 'TRANG_THAI_PHE_DUYET'
  ]]).setBackground('#0F766E').setFontColor('#FFFFFF').setFontWeight('bold');

  var capexRows = [
    [
      'CAPEX-2026-01', 'Tự Động Hóa Dây Chuyền Robot Hàn & Lắp Ráp Nhà Máy Số 2', 'BU-03', 'Mở Rộng Sản Xuất',
      45000000000, 12500000000, 16800000000, 19500000000, 21000000000, 22500000000,
      19840000000, 24.6, 2.8, 'DA_PHE_DUYET'
    ],
    [
      'CAPEX-2026-02', 'Xây Dựng Trung Tâm Dữ Liệu AI Cloud & GPU Cluster', 'BU-01', 'Hạ Tầng Công Nghệ',
      32000000000, 9800000000, 13200000000, 15400000000, 16900000000, 18200000000,
      18620000000, 28.4, 2.6, 'DA_PHE_DUYET'
    ],
    [
      'CAPEX-2026-03', 'Hệ Thống Kho Lạnh Tự Động AS/RS Khu Vực Đồng Bằng Sông Cửu Long', 'BU-04', 'Hạ Tầng Logistics',
      28000000000, 6500000000, 8900000000, 10800000000, 12200000000, 13500000000,
      7850000000, 19.2, 3.2, 'CHO_HD_DAU_TU'
    ],
    [
      'CAPEX-2026-04', 'Hệ Thống Điện Mặt Trời Áp Mái 15MWp Khu Công Nghiệp Xanh', 'BU-05', 'Năng Lượng Xanh ESG',
      38000000000, 8200000000, 10500000000, 12400000000, 13800000000, 14900000000,
      4120000000, 15.3, 3.6, 'CHO_HD_DAU_TU'
    ],
    [
      'CAPEX-2026-05', 'Mua Lại Chuỗi Phân Phối Bán Lẻ Khu Vực Miền Trung (M&A)', 'BU-02', 'Thương Vụ M&A',
      24000000000, 3800000000, 5200000000, 6400000000, 7100000000, 7800000000,
      -2650000000, 7.8, 4.4, 'CAN_CAU_TRUC_LAI'
    ]
  ];
  shCapex.getRange(2, 1, capexRows.length, 14).setValues(capexRows);
  shCapex.getRange(2, 5, capexRows.length, 7).setNumberFormat('#,##0');
  shCapex.setColumnWidths(1, 14, 155);

  // =========================================================================
  // 8. TAB GIAO_DICH_NOI_BO_IC (ĐỐI CHIẾU & LOẠI TRỪ GIAO DỊCH NỘI BỘ TẬP ĐOÀN)
  // =========================================================================
  var shIc = ss.getSheetByName('GIAO_DICH_NOI_BO_IC');
  shIc.getRange('A1:K1').setValues([[
    'MA_BUT_TOAN_IC', 'NGAY_HACH_TOAN', 'BU_BAN_CUNG_CAP', 'BU_MUA_NHAN_DICH_VU',
    'LOAI_GIAO_DICH_IC', 'NOI_DUNG_GIAO_DICH', 'GIA_TRI_GHI_NHAN_BEN_BAN',
    'GIA_TRI_GHI_NHAN_BEN_MUA', 'CHENH_LECH_DOI_CHIEU', 'TRANG_THAI_LOAI_TRU', 'NGUOI_KIEM_SOAT'
  ]]).setBackground('#7C2D12').setFontColor('#FFFFFF').setFontWeight('bold');

  var icRows = [
    ['IC-2026-001', fmtDateOffset(-14), 'BU-01', 'BU-02', 'DICH_VU_CONG_NGHE', 'Cung cấp bản quyền nền tảng ERP & AI dự báo tồn kho cho Khối Thương Mại', 1850000000, 1850000000, 0, 'DA_LOAI_TRU_HOP_NHAT', 'Lê Hoàng Bách'],
    ['IC-2026-002', fmtDateOffset(-11), 'BU-01', 'BU-03', 'DICH_VU_CONG_NGHE', 'Triển khai hệ thống IoT giám sát dây chuyền nhà máy thông minh', 1350000000, 1350000000, 0, 'DA_LOAI_TRU_HOP_NHAT', 'Lê Hoàng Bách'],
    ['IC-2026-003', fmtDateOffset(-9), 'BU-03', 'BU-02', 'BAN_HANG_NOI_BO', 'Chuyển giao lô thiết bị công nghiệp tiêu chuẩn phân phối đại lý Quý hiện tại', 4500000000, 4500000000, 0, 'DA_LOAI_TRU_HOP_NHAT', 'Nguyễn Minh Tuyết'],
    ['IC-2026-004', fmtDateOffset(-6), 'BU-04', 'BU-02', 'DICH_VU_LOGISTICS', 'Cước vận tải đường trục Bắc Nam & lưu kho lạnh hàng thương mại', 2900000000, 2900000000, 0, 'DA_LOAI_TRU_HOP_NHAT', 'Lê Hoàng Bách'],
    ['IC-2026-005', fmtDateOffset(-4), 'BU-05', 'BU-03', 'THUE_HA_TANG_KCN', 'Phí thuê nhà xưởng tiêu chuẩn & điện mặt trời tại KCN Đại Việt', 1100000000, 1100000000, 0, 'DA_LOAI_TRU_HOP_NHAT', 'Nguyễn Minh Tuyết'],
    ['IC-2026-006', fmtDateOffset(-2), 'BU-06', 'ALL_BU', 'PHI_QUAN_TRI_HQ', 'Phí dịch vụ dùng chung Tập đoàn (HQ IT, Pháp chế, Kiểm toán, HR) phân bổ xuống 5 BU', 10500000000, 10500000000, 0, 'DA_LOAI_TRU_HOP_NHAT', 'Nguyễn Minh Tuyết']
  ];
  shIc.getRange(2, 1, icRows.length, 11).setValues(icRows);
  shIc.getRange(2, 7, icRows.length, 3).setNumberFormat('#,##0');
  shIc.setColumnWidths(1, 11, 160);

  // =========================================================================
  // 9. TAB NHAT_KY_HE_THONG (ENTERPRISE AUDIT TRAIL)
  // =========================================================================
  var shLog = ss.getSheetByName('NHAT_KY_HE_THONG');
  shLog.getRange('A1:F1').setValues([[
    'THOI_GIAN', 'NGUOI_DUNG', 'VAI_TRO', 'HANH_DONG', 'DOI_TUONG_TAC_DONG', 'CHI_TIET_THAY_DOI'
  ]]).setBackground('#0F172A').setFontColor('#FFFFFF').setFontWeight('bold');

  shLog.appendRow([
    Utilities.formatDate(today, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss'),
    'SYSTEM_INSTALLER',
    'GROUP_CFO',
    'INIT_ENTERPRISE_FPA_DB',
    'ALL_9_SHEETS',
    'Khởi tạo hoàn tất 9 Sheets hệ thống FP&A Tập Đoàn (GS-003-ENT v4.1 Commercial Pro) kèm Cẩm nang HUONG_DAN_SU_DUNG'
  ]);
  shLog.setColumnWidths(1, 6, 195);

  SpreadsheetApp.flush();
  return {
    success: true,
    message: 'Đã khởi tạo thành công 9 Sheets chuẩn FP&A Tập Đoàn (GS-003-ENT v4.1 Commercial Pro)!'
  };
}


```

## 4. File 3: `Code.gs`

```
/**
 * ============================================================================
 * GS-003-ENT: TRUNG TÂM ĐIỀU HÀNH FP&A TẬP ĐOÀN & ĐA CHI NHÁNH (> 500 NHÂN SỰ)
 * Phiên bản: v4.1 Commercial Pro (Cấp 4 trong Bộ Tứ Quản Trị Tài Chính Doanh Nghiệp)
 * File: Code.gs — Backend Engine, Real-time Sheet Auth, Multi-BU Consolidation,
 *                 3-Scenario Engine, Cost Center Control, CAPEX NPV/IRR & 2-Way Sync
 * ============================================================================
 */

/**
 * Chuẩn Kỹ Thuật Cốt Lõi #1:
 * Hàm lấy Spreadsheet đích KHÔNG ĐỆ QUY (chỉ gọi hàm lấy ActiveSpreadsheet đúng 1 lần)
 */
function getTargetSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}
  if (ss) {
    try {
      PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
    } catch (e2) {}
    return ss;
  }
  try {
    var savedId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (savedId) {
      return SpreadsheetApp.openById(savedId);
    }
  } catch (e3) {}
  throw new Error('Không thể kết nối Google Spreadsheet. Hãy mở file Google Sheet và chạy hàm setupEntFinanceDatabase() trong installer.gs một lần để liên kết ID.');
}

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  var initPayload = {};
  try {
    initPayload = getEntInitialData();
  } catch (err) {
    initPayload = { error: err.message };
  }
  template.INITIAL_PAYLOAD_JSON = JSON.stringify(initPayload);
  return template.evaluate()
    .setTitle('GS-003-ENT v4.1 Pro • Trung Tâm Điều Hành FP&A Tập Đoàn & Đa Đơn Vị (Multi-BU)')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

function toNum_(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (val === null || val === undefined || val === '') return 0;
  var s = String(val).replace(/[^0-9.-]/g, '');
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function fmtIsoDate_(val) {
  if (!val) return '';
  if (Object.prototype.toString.call(val) === '[object Date]') {
    if (isNaN(val.getTime())) return '';
    return Utilities.formatDate(val, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }
  return String(val).trim();
}

function ensureEntDatabaseReady_(ss) {
  var checkSheet = ss.getSheetByName('HOP_NHAT_DON_VI_BU');
  var guideSheet = ss.getSheetByName('HUONG_DAN_SU_DUNG');
  if (!checkSheet || !guideSheet) {
    setupEntFinanceDatabase();
  }
}

function appendEntAuditLog_(ss, username, role, action, target, detail) {
  try {
    var sh = ss.getSheetByName('NHAT_KY_HE_THONG');
    if (!sh) return;
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
    sh.appendRow([nowStr, username || 'system', role || 'GROUP_CFO', action, target, detail]);
  } catch (e) {}
}

/**
 * Chuẩn Kỹ Thuật Cốt Lõi #2:
 * Đọc trực tiếp danh sách tài khoản & mật khẩu từ Sheet PHAN_QUYEN theo thời gian thực
 */
function readEntUsersDirect_(ss) {
  var sh = ss.getSheetByName('PHAN_QUYEN');
  if (!sh || sh.getLastRow() < 2) return [];
  var vals = sh.getRange(2, 1, sh.getLastRow() - 1, 9).getDisplayValues();
  var list = [];
  for (var i = 0; i < vals.length; i++) {
    var r = vals[i];
    var u = String(r[0] || '').trim();
    if (!u) continue;
    list.push({
      username: u,
      password: String(r[1] || '').trim(),
      fullName: String(r[2] || '').trim(),
      role: String(r[3] || 'BU_DIRECTOR').trim(),
      buCode: String(r[4] || 'ALL_GROUP').trim(),
      email: String(r[5] || '').trim(),
      scope: String(r[6] || 'ALL_GROUP').trim(),
      approvalRight: String(r[7] || '').trim(),
      status: String(r[8] || 'HOAT_DONG').trim()
    });
  }
  return list;
}

function getEntAuthUsersFromSheet() {
  var ss = getTargetSpreadsheet();
  ensureEntDatabaseReady_(ss);
  return {
    success: true,
    users: readEntUsersDirect_(ss)
  };
}

function verifyEntLogin(payload) {
  var ss = getTargetSpreadsheet();
  ensureEntDatabaseReady_(ss);
  var uname = String((payload && payload.username) || '').trim().toLowerCase();
  var pass = String((payload && payload.password) || '').trim();
  var users = readEntUsersDirect_(ss);

  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    if (u.username.toLowerCase() === uname) {
      if (u.status === 'KHOA') {
        return { success: false, message: 'Tài khoản này đã bị khóa trên Sheet PHAN_QUYEN!' };
      }
      if (u.password === pass) {
        return {
          success: true,
          user: u,
          allUsers: users,
          message: 'Xác thực thành công trực tiếp từ Sheet PHAN_QUYEN!'
        };
      } else {
        return {
          success: false,
          message: 'Mật khẩu không chính xác (Đã đối chiếu trực tiếp với Sheet PHAN_QUYEN mới nhất)!'
        };
      }
    }
  }
  return {
    success: false,
    message: 'Không tìm thấy tài khoản "' + uname + '" trong Sheet PHAN_QUYEN!'
  };
}

/**
 * Tải toàn bộ dữ liệu 9 Sheets về Web App
 */
function getEntInitialData() {
  var ss = getTargetSpreadsheet();
  ensureEntDatabaseReady_(ss);

  // 1. CAU_HINH
  var shCfg = ss.getSheetByName('CAU_HINH');
  var config = {};
  if (shCfg && shCfg.getLastRow() >= 2) {
    var cfgRows = shCfg.getRange(2, 1, shCfg.getLastRow() - 1, 3).getDisplayValues();
    cfgRows.forEach(function(r) {
      var k = String(r[0] || '').trim();
      if (k) config[k] = String(r[1] || '').trim();
    });
  }

  // 2. PHAN_QUYEN
  var users = readEntUsersDirect_(ss);

  // 3. HUONG_DAN_SU_DUNG
  var shGuide = ss.getSheetByName('HUONG_DAN_SU_DUNG');
  var guides = [];
  if (shGuide && shGuide.getLastRow() >= 3) {
    var gVals = shGuide.getRange(3, 1, shGuide.getLastRow() - 2, 5).getDisplayValues();
    gVals.forEach(function(r) {
      if (!r[0] && !r[1]) return;
      guides.push({
        group: r[0],
        term: r[1],
        plainMeaning: r[2],
        formulaBenchmark: r[3],
        example: r[4]
      });
    });
  }

  // 4. HOP_NHAT_DON_VI_BU
  var shBu = ss.getSheetByName('HOP_NHAT_DON_VI_BU');
  var businessUnits = [];
  if (shBu && shBu.getLastRow() >= 2) {
    var buVals = shBu.getRange(2, 1, shBu.getLastRow() - 1, 18).getValues();
    buVals.forEach(function(r) {
      var code = String(r[0] || '').trim();
      if (!code) return;
      businessUnits.push({
        buCode: code,
        buName: String(r[1] || '').trim(),
        sector: String(r[2] || '').trim(),
        director: String(r[3] || '').trim(),
        headcount: toNum_(r[4]),
        extRevenue: toNum_(r[5]),
        icRevenue: toNum_(r[6]),
        cogs: toNum_(r[7]),
        directOpex: toNum_(r[8]),
        hqAlloc: toNum_(r[9]),
        ebitda: toNum_(r[10]),
        da: toNum_(r[11]),
        ebit: toNum_(r[12]),
        taxCit: toNum_(r[13]),
        nopat: toNum_(r[14]),
        investedCap: toNum_(r[15]),
        roicPct: toNum_(r[16]),
        eva: toNum_(r[17])
      });
    });
  }

  // 5. KICH_BAN_DU_PHONG_12T
  var shScen = ss.getSheetByName('KICH_BAN_DU_PHONG_12T');
  var scenarios = [];
  if (shScen && shScen.getLastRow() >= 2) {
    var scVals = shScen.getRange(2, 1, shScen.getLastRow() - 1, 14).getValues();
    scVals.forEach(function(r) {
      var rowId = String(r[0] || '').trim();
      if (!rowId) return;
      scenarios.push({
        rowId: rowId,
        scenarioCode: String(r[1] || 'BASE').trim(),
        month: fmtIsoDate_(r[2]).slice(0, 7),
        consolidatedRev: toNum_(r[3]),
        cogs: toNum_(r[4]),
        grossProfit: toNum_(r[5]),
        groupOpex: toNum_(r[6]),
        groupEbitda: toNum_(r[7]),
        ebitdaMarginPct: toNum_(r[8]),
        capexOutflow: toNum_(r[9]),
        nwcDelta: toNum_(r[10]),
        fcf: toNum_(r[11]),
        cashBalance: toNum_(r[12]),
        note: String(r[13] || '').trim()
      });
    });
  }

  // 6. TRUNG_TAM_CHI_PHI_CC
  var shCc = ss.getSheetByName('TRUNG_TAM_CHI_PHI_CC');
  var costCenters = [];
  if (shCc && shCc.getLastRow() >= 2) {
    var ccVals = shCc.getRange(2, 1, shCc.getLastRow() - 1, 13).getValues();
    ccVals.forEach(function(r) {
      var ccCode = String(r[0] || '').trim();
      if (!ccCode) return;
      costCenters.push({
        ccCode: ccCode,
        ccName: String(r[1] || '').trim(),
        buCode: String(r[2] || '').trim(),
        ccType: String(r[3] || '').trim(),
        allocDriver: String(r[4] || '').trim(),
        approvedBudget: toNum_(r[5]),
        actualSpend: toNum_(r[6]),
        committedPo: toNum_(r[7]),
        totalUsed: toNum_(r[8]),
        availableBudget: toNum_(r[9]),
        usedPct: toNum_(r[10]),
        status: String(r[11] || 'AN_TOAN').trim(),
        owner: String(r[12] || '').trim()
      });
    });
  }

  // 7. DANH_MUC_DAU_TU_CAPEX
  var shCapex = ss.getSheetByName('DANH_MUC_DAU_TU_CAPEX');
  var capexProjects = [];
  if (shCapex && shCapex.getLastRow() >= 2) {
    var cxVals = shCapex.getRange(2, 1, shCapex.getLastRow() - 1, 14).getValues();
    cxVals.forEach(function(r) {
      var pCode = String(r[0] || '').trim();
      if (!pCode) return;
      capexProjects.push({
        projectCode: pCode,
        projectName: String(r[1] || '').trim(),
        buCode: String(r[2] || '').trim(),
        category: String(r[3] || '').trim(),
        initialCapex: toNum_(r[4]),
        cfYear1: toNum_(r[5]),
        cfYear2: toNum_(r[6]),
        cfYear3: toNum_(r[7]),
        cfYear4: toNum_(r[8]),
        cfYear5: toNum_(r[9]),
        npv: toNum_(r[10]),
        irrPct: toNum_(r[11]),
        paybackYears: toNum_(r[12]),
        approvalStatus: String(r[13] || 'CHO_HD_DAU_TU').trim()
      });
    });
  }

  // 8. GIAO_DICH_NOI_BO_IC
  var shIc = ss.getSheetByName('GIAO_DICH_NOI_BO_IC');
  var intercompany = [];
  if (shIc && shIc.getLastRow() >= 2) {
    var icVals = shIc.getRange(2, 1, shIc.getLastRow() - 1, 11).getValues();
    icVals.forEach(function(r) {
      var icId = String(r[0] || '').trim();
      if (!icId) return;
      intercompany.push({
        icCode: icId,
        date: fmtIsoDate_(r[1]),
        sellerBu: String(r[2] || '').trim(),
        buyerBu: String(r[3] || '').trim(),
        txType: String(r[4] || '').trim(),
        description: String(r[5] || '').trim(),
        sellerAmount: toNum_(r[6]),
        buyerAmount: toNum_(r[7]),
        diffAmount: toNum_(r[8]),
        elimStatus: String(r[9] || 'DA_LOAI_TRU_HOP_NHAT').trim(),
        controller: String(r[10] || '').trim()
      });
    });
  }

  // 9. NHAT_KY_HE_THONG
  var shLog = ss.getSheetByName('NHAT_KY_HE_THONG');
  var auditLogs = [];
  if (shLog && shLog.getLastRow() >= 2) {
    var startRow = Math.max(2, shLog.getLastRow() - 39);
    var numRows = shLog.getLastRow() - startRow + 1;
    var logVals = shLog.getRange(startRow, 1, numRows, 6).getDisplayValues();
    for (var i = logVals.length - 1; i >= 0; i--) {
      var lr = logVals[i];
      auditLogs.push({
        timestamp: lr[0],
        user: lr[1],
        role: lr[2],
        action: lr[3],
        target: lr[4],
        detail: lr[5]
      });
    }
  }

  return {
    success: true,
    config: config,
    users: users,
    guides: guides,
    businessUnits: businessUnits,
    scenarios: scenarios,
    costCenters: costCenters,
    capexProjects: capexProjects,
    intercompany: intercompany,
    auditLogs: auditLogs
  };
}

/**
 * Helper tính NPV, IRR và Payback cho dự án CAPEX
 */
function computeCapexMetrics_(initialCapex, cf1, cf2, cf3, cf4, cf5, waccPct) {
  var r = (toNum_(waccPct) || 11.5) / 100.0;
  var cfs = [toNum_(cf1), toNum_(cf2), toNum_(cf3), toNum_(cf4), toNum_(cf5)];
  var pvSum = 0;
  for (var t = 0; t < cfs.length; t++) {
    pvSum += cfs[t] / Math.pow(1 + r, t + 1);
  }
  var npv = Math.round(pvSum - toNum_(initialCapex));

  // Tính IRR bằng phương pháp Newton-Raphson / Bisection trong khoảng [-50%, +150%]
  var low = -0.45;
  var high = 1.80;
  var mid = 0.15;
  for (var iter = 0; iter < 60; iter++) {
    mid = (low + high) / 2;
    var fMid = -toNum_(initialCapex);
    for (var k = 0; k < cfs.length; k++) {
      fMid += cfs[k] / Math.pow(1 + mid, k + 1);
    }
    if (fMid > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  var irrPct = Number((mid * 100).toFixed(1));

  // Tính Payback Period (Năm)
  var cum = 0;
  var payback = 5.5;
  var cap = toNum_(initialCapex);
  for (var y = 0; y < cfs.length; y++) {
    var prevCum = cum;
    cum += cfs[y];
    if (cum >= cap && cfs[y] > 0) {
      payback = Number((y + (cap - prevCum) / cfs[y]).toFixed(1));
      break;
    }
  }
  return {
    npv: npv,
    irrPct: irrPct,
    paybackYears: payback
  };
}

/**
 * 1. Lưu / Cập nhật Đơn vị Kinh doanh (BU) trong HOP_NHAT_DON_VI_BU
 */
function saveEntBusinessUnit(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = getTargetSpreadsheet();
    var sh = ss.getSheetByName('HOP_NHAT_DON_VI_BU');
    var shCfg = ss.getSheetByName('CAU_HINH');
    var waccPct = 11.5;
    var citPct = 20.0;
    if (shCfg && shCfg.getLastRow() >= 2) {
      var cfgRows = shCfg.getRange(2, 1, shCfg.getLastRow() - 1, 2).getDisplayValues();
      cfgRows.forEach(function(r) {
        if (r[0] === 'WACC_PCT') waccPct = toNum_(r[1]) || 11.5;
        if (r[0] === 'CIT_TAX_RATE_PCT') citPct = toNum_(r[1]) || 20.0;
      });
    }

    var buCode = String(payload.buCode || '').trim().toUpperCase();
    if (!buCode) buCode = 'BU-0' + (sh.getLastRow());
    var buName = String(payload.buName || '').trim();
    var sector = String(payload.sector || '').trim();
    var director = String(payload.director || '').trim();
    var headcount = toNum_(payload.headcount);
    var extRev = toNum_(payload.extRevenue);
    var icRev = toNum_(payload.icRevenue);
    var cogs = toNum_(payload.cogs);
    var directOpex = toNum_(payload.directOpex);
    var hqAlloc = toNum_(payload.hqAlloc);
    var da = toNum_(payload.da);
    var invCap = toNum_(payload.investedCap);

    var totalRev = extRev + icRev;
    var ebitda = totalRev - cogs - directOpex - hqAlloc;
    var ebit = ebitda - da;
    var taxCit = ebit > 0 ? Math.round(ebit * (citPct / 100.0)) : 0;
    var nopat = ebit - taxCit;
    var roicPct = invCap > 0 ? Number(((nopat / invCap) * 100).toFixed(2)) : 0;
    var eva = Math.round(nopat - (invCap * (waccPct / 100.0)));

    var rowValues = [
      buCode, buName, sector, director, headcount,
      extRev, icRev, cogs, directOpex,
      hqAlloc, ebitda, da, ebit, taxCit,
      nopat, invCap, roicPct, eva
    ];

    var foundRow = -1;
    if (sh.getLastRow() >= 2) {
      var codes = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues();
      for (var i = 0; i < codes.length; i++) {
        if (String(codes[i][0]).trim().toUpperCase() === buCode) {
          foundRow = i + 2;
          break;
        }
      }
    }

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 18).setValues([rowValues]);
    } else {
      sh.appendRow(rowValues);
    }

    appendEntAuditLog_(ss, payload.actorUser, payload.actorRole, 'SAVE_BUSINESS_UNIT', buCode,
      'Cập nhật BU ' + buName + ': ExtRev=' + extRev + ', EBITDA=' + ebitda + ', ROIC=' + roicPct + '%, EVA=' + eva);
    SpreadsheetApp.flush();
    return getEntInitialData();
  } finally {
    lock.releaseLock();
  }
}

/**
 * 2. Lưu / Cập nhật Dòng Dự phóng Kịch bản 12 Tháng (KICH_BAN_DU_PHONG_12T)
 */
function saveEntScenarioMonth(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = getTargetSpreadsheet();
    var sh = ss.getSheetByName('KICH_BAN_DU_PHONG_12T');
    var scCode = String(payload.scenarioCode || 'BASE').trim().toUpperCase();
    var month = String(payload.month || '').trim();
    var rowId = String(payload.rowId || '').trim();
    if (!rowId) {
      var mSuffix = month.slice(-2) || '01';
      rowId = 'SC-' + scCode + '-' + mSuffix;
    }

    var rev = toNum_(payload.consolidatedRev);
    var cogs = toNum_(payload.cogs);
    var gp = rev - cogs;
    var opex = toNum_(payload.groupOpex);
    var ebitda = gp - opex;
    var ebitdaMargin = rev > 0 ? Number(((ebitda / rev) * 100).toFixed(2)) : 0;
    var capex = toNum_(payload.capexOutflow);
    var nwcDelta = toNum_(payload.nwcDelta);
    var taxEst = ebitda > 0 ? Math.round(ebitda * 0.16) : 0;
    var fcf = ebitda - taxEst - capex - nwcDelta;
    var cashBal = toNum_(payload.cashBalance) || (85000000000 + fcf);
    var note = String(payload.note || '').trim();

    var rowVals = [
      rowId, scCode, month, rev, cogs, gp, opex, ebitda, ebitdaMargin, capex, nwcDelta, fcf, cashBal, note
    ];

    var foundRow = -1;
    if (sh.getLastRow() >= 2) {
      var ids = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === rowId ||
           (String(ids[i][1]).trim().toUpperCase() === scCode && String(ids[i][2]).trim().slice(0, 7) === month)) {
          foundRow = i + 2;
          rowVals[0] = String(ids[i][0]).trim() || rowId;
          break;
        }
      }
    }

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 14).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }

    appendEntAuditLog_(ss, payload.actorUser, payload.actorRole, 'SAVE_SCENARIO_MONTH', rowVals[0],
      'Cập nhật kịch bản ' + scCode + ' kỳ ' + month + ': Doanh thu=' + rev + ', EBITDA=' + ebitda + ', FCF=' + fcf);
    SpreadsheetApp.flush();
    return getEntInitialData();
  } finally {
    lock.releaseLock();
  }
}

/**
 * 3. Lưu / Cập nhật Trung tâm Chi phí & Phân bổ HQ (TRUNG_TAM_CHI_PHI_CC)
 */
function saveEntCostCenter(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = getTargetSpreadsheet();
    var sh = ss.getSheetByName('TRUNG_TAM_CHI_PHI_CC');
    var shCfg = ss.getSheetByName('CAU_HINH');
    var alertPct = 85;
    if (shCfg && shCfg.getLastRow() >= 2) {
      var cfgVals = shCfg.getRange(2, 1, shCfg.getLastRow() - 1, 2).getDisplayValues();
      cfgVals.forEach(function(r) {
        if (r[0] === 'CC_ALERT_THRESHOLD_PCT') alertPct = toNum_(r[1]) || 85;
      });
    }

    var ccCode = String(payload.ccCode || '').trim().toUpperCase();
    if (!ccCode) ccCode = 'CC-' + (100 + sh.getLastRow());
    var ccName = String(payload.ccName || '').trim();
    var buCode = String(payload.buCode || 'BU-06').trim();
    var ccType = String(payload.ccType || 'PROFIT_SUPPORT').trim();
    var allocDriver = String(payload.allocDriver || 'Tỷ trọng Doanh thu').trim();
    var budget = toNum_(payload.approvedBudget);
    var actual = toNum_(payload.actualSpend);
    var committed = toNum_(payload.committedPo);
    var owner = String(payload.owner || '').trim();

    var totalUsed = actual + committed;
    var avail = budget - totalUsed;
    var usedPct = budget > 0 ? Number(((totalUsed / budget) * 100).toFixed(1)) : 0;
    var status = usedPct > 100 ? 'VUOT_NGAN_SACH' : (usedPct >= alertPct ? 'CANH_BAO_CAO' : 'AN_TOAN');

    var rowVals = [
      ccCode, ccName, buCode, ccType, allocDriver,
      budget, actual, committed, totalUsed, avail, usedPct, status, owner
    ];

    var foundRow = -1;
    if (sh.getLastRow() >= 2) {
      var codes = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues();
      for (var i = 0; i < codes.length; i++) {
        if (String(codes[i][0]).trim().toUpperCase() === ccCode) {
          foundRow = i + 2;
          break;
        }
      }
    }

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 13).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }

    appendEntAuditLog_(ss, payload.actorUser, payload.actorRole, 'SAVE_COST_CENTER', ccCode,
      'Cập nhật Trung tâm chi phí ' + ccName + ': Budget=' + budget + ', Used=' + totalUsed + ' (' + usedPct + '%)');
    SpreadsheetApp.flush();
    return getEntInitialData();
  } finally {
    lock.releaseLock();
  }
}

/**
 * 4. Lưu / Thẩm định Dự án Đầu tư CAPEX (DANH_MUC_DAU_TU_CAPEX)
 */
function saveEntCapexProject(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = getTargetSpreadsheet();
    var sh = ss.getSheetByName('DANH_MUC_DAU_TU_CAPEX');
    var shCfg = ss.getSheetByName('CAU_HINH');
    var waccPct = 11.5;
    if (shCfg && shCfg.getLastRow() >= 2) {
      var cfgVals = shCfg.getRange(2, 1, shCfg.getLastRow() - 1, 2).getDisplayValues();
      cfgVals.forEach(function(r) {
        if (r[0] === 'WACC_PCT') waccPct = toNum_(r[1]) || 11.5;
      });
    }

    var pCode = String(payload.projectCode || '').trim().toUpperCase();
    if (!pCode) pCode = 'CAPEX-2026-0' + sh.getLastRow();
    var pName = String(payload.projectName || '').trim();
    var buCode = String(payload.buCode || 'BU-01').trim();
    var category = String(payload.category || 'Mở Rộng Sản Xuất').trim();
    var initCapex = toNum_(payload.initialCapex);
    var cf1 = toNum_(payload.cfYear1);
    var cf2 = toNum_(payload.cfYear2);
    var cf3 = toNum_(payload.cfYear3);
    var cf4 = toNum_(payload.cfYear4);
    var cf5 = toNum_(payload.cfYear5);
    var approvalStatus = String(payload.approvalStatus || 'CHO_HD_DAU_TU').trim();

    var metrics = computeCapexMetrics_(initCapex, cf1, cf2, cf3, cf4, cf5, waccPct);

    var rowVals = [
      pCode, pName, buCode, category, initCapex,
      cf1, cf2, cf3, cf4, cf5,
      metrics.npv, metrics.irrPct, metrics.paybackYears, approvalStatus
    ];

    var foundRow = -1;
    if (sh.getLastRow() >= 2) {
      var codes = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues();
      for (var i = 0; i < codes.length; i++) {
        if (String(codes[i][0]).trim().toUpperCase() === pCode) {
          foundRow = i + 2;
          break;
        }
      }
    }

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 14).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }

    appendEntAuditLog_(ss, payload.actorUser, payload.actorRole, 'SAVE_CAPEX_PROJECT', pCode,
      'Thẩm định dự án ' + pName + ': CAPEX=' + initCapex + ', NPV=' + metrics.npv + ', IRR=' + metrics.irrPct + '%, Status=' + approvalStatus);
    SpreadsheetApp.flush();
    return getEntInitialData();
  } finally {
    lock.releaseLock();
  }
}

/**
 * 5. Lưu / Đối chiếu Bút toán Giao dịch Nội bộ (GIAO_DICH_NOI_BO_IC)
 */
function saveEntIntercompanyTx(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = getTargetSpreadsheet();
    var sh = ss.getSheetByName('GIAO_DICH_NOI_BO_IC');

    var icCode = String(payload.icCode || '').trim().toUpperCase();
    if (!icCode) icCode = 'IC-2026-00' + sh.getLastRow();
    var txDate = String(payload.date || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')).trim();
    var sellerBu = String(payload.sellerBu || 'BU-01').trim();
    var buyerBu = String(payload.buyerBu || 'BU-02').trim();
    var txType = String(payload.txType || 'DICH_VU_CONG_NGHE').trim();
    var desc = String(payload.description || '').trim();
    var sellerAmt = toNum_(payload.sellerAmount);
    var buyerAmt = toNum_(payload.buyerAmount);
    var diffAmt = Math.abs(sellerAmt - buyerAmt);
    var elimStatus = diffAmt === 0 ? 'DA_LOAI_TRU_HOP_NHAT' : 'LECH_CHO_DOI_CHIEU';
    var controller = String(payload.controller || payload.actorUser || 'Ban FP&A').trim();

    var rowVals = [
      icCode, txDate, sellerBu, buyerBu, txType, desc, sellerAmt, buyerAmt, diffAmt, elimStatus, controller
    ];

    var foundRow = -1;
    if (sh.getLastRow() >= 2) {
      var codes = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues();
      for (var i = 0; i < codes.length; i++) {
        if (String(codes[i][0]).trim().toUpperCase() === icCode) {
          foundRow = i + 2;
          break;
        }
      }
    }

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 11).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }

    appendEntAuditLog_(ss, payload.actorUser, payload.actorRole, 'SAVE_IC_TRANSACTION', icCode,
      'Đối chiếu giao dịch nội bộ ' + sellerBu + ' -> ' + buyerBu + ': Bán=' + sellerAmt + ', Mua=' + buyerAmt + ', Lệch=' + diffAmt);
    SpreadsheetApp.flush();
    return getEntInitialData();
  } finally {
    lock.releaseLock();
  }
}

/**
 * 6. Tự động Phân bổ Chi phí Dịch vụ Chung Tập đoàn (HQ Shared Services Allocation) xuống các BU
 */
function runEntHqCostAllocation(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = getTargetSpreadsheet();
    var shCc = ss.getSheetByName('TRUNG_TAM_CHI_PHI_CC');
    var shBu = ss.getSheetByName('HOP_NHAT_DON_VI_BU');
    var shCfg = ss.getSheetByName('CAU_HINH');

    var waccPct = 11.5;
    var citPct = 20.0;
    if (shCfg && shCfg.getLastRow() >= 2) {
      var cfgVals = shCfg.getRange(2, 1, shCfg.getLastRow() - 1, 2).getDisplayValues();
      cfgVals.forEach(function(r) {
        if (r[0] === 'WACC_PCT') waccPct = toNum_(r[1]) || 11.5;
        if (r[0] === 'CIT_TAX_RATE_PCT') citPct = toNum_(r[1]) || 20.0;
      });
    }

    var driverMode = String((payload && payload.driverMode) || 'REVENUE').trim().toUpperCase();

    // Tính tổng chi phí HQ Shared Services (Actual + Committed của BU-06 hoặc loại SHARED_SERVICE_HQ)
    var totalHqPool = 0;
    if (shCc && shCc.getLastRow() >= 2) {
      var ccVals = shCc.getRange(2, 1, shCc.getLastRow() - 1, 13).getValues();
      ccVals.forEach(function(r) {
        if (String(r[2]).trim() === 'BU-06' || String(r[3]).trim() === 'SHARED_SERVICE_HQ') {
          totalHqPool += toNum_(r[8]); // TONG_SU_DUNG_TOTAL_USED
        }
      });
    }
    if (totalHqPool <= 0) totalHqPool = 10500000000;

    if (shBu && shBu.getLastRow() >= 2) {
      var buVals = shBu.getRange(2, 1, shBu.getLastRow() - 1, 18).getValues();
      var totalDriverWeight = 0;
      for (var i = 0; i < buVals.length; i++) {
        var code = String(buVals[i][0]).trim();
        if (code === 'BU-06') continue;
        if (driverMode === 'HEADCOUNT') {
          totalDriverWeight += toNum_(buVals[i][4]);
        } else {
          totalDriverWeight += toNum_(buVals[i][5]); // External Revenue
        }
      }

      for (var j = 0; j < buVals.length; j++) {
        var r = buVals[j];
        var bCode = String(r[0]).trim();
        if (bCode === 'BU-06') {
          r[6] = totalHqPool; // HQ IC Revenue
          r[9] = 0;
        } else {
          var w = (driverMode === 'HEADCOUNT') ? toNum_(r[4]) : toNum_(r[5]);
          var allocAmt = totalDriverWeight > 0 ? Math.round(totalHqPool * (w / totalDriverWeight)) : 0;
          r[9] = allocAmt;
        }
        var totRev = toNum_(r[5]) + toNum_(r[6]);
        var ebitda = totRev - toNum_(r[7]) - toNum_(r[8]) - toNum_(r[9]);
        var ebit = ebitda - toNum_(r[11]);
        var tax = ebit > 0 ? Math.round(ebit * (citPct / 100.0)) : 0;
        var nopat = ebit - tax;
        var invCap = toNum_(r[15]);
        var roic = invCap > 0 ? Number(((nopat / invCap) * 100).toFixed(2)) : 0;
        var eva = Math.round(nopat - (invCap * (waccPct / 100.0)));

        r[10] = ebitda;
        r[12] = ebit;
        r[13] = tax;
        r[14] = nopat;
        r[16] = roic;
        r[17] = eva;
      }
      shBu.getRange(2, 1, buVals.length, 18).setValues(buVals);
    }

    appendEntAuditLog_(ss, payload && payload.actorUser, payload && payload.actorRole, 'RUN_HQ_COST_ALLOCATION', driverMode,
      'Phân bổ tự động tổng chi phí HQ (' + totalHqPool + ' VND) xuống các BU theo tiêu thức ' + driverMode);
    SpreadsheetApp.flush();
    return getEntInitialData();
  } finally {
    lock.releaseLock();
  }
}

/**
 * 7. Lưu Cấu hình Tập đoàn (CAU_HINH) & Tài khoản Phân quyền (PHAN_QUYEN)
 */
function saveEntSettings(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = getTargetSpreadsheet();
    var shCfg = ss.getSheetByName('CAU_HINH');
    if (shCfg && payload && payload.config) {
      var cfgMap = payload.config;
      var existing = shCfg.getLastRow() >= 2 ? shCfg.getRange(2, 1, shCfg.getLastRow() - 1, 3).getValues() : [];
      var existingKeys = {};
      for (var i = 0; i < existing.length; i++) {
        var k = String(existing[i][0] || '').trim();
        if (k && cfgMap.hasOwnProperty(k)) {
          existing[i][1] = String(cfgMap[k]);
          existingKeys[k] = true;
        }
      }
      if (existing.length > 0) {
        shCfg.getRange(2, 1, existing.length, 3).setValues(existing);
      }
      Object.keys(cfgMap).forEach(function(k) {
        if (!existingKeys[k]) {
          shCfg.appendRow([k, String(cfgMap[k]), 'Tham số cập nhật từ Web App']);
        }
      });
    }
    appendEntAuditLog_(ss, payload.actorUser, payload.actorRole, 'UPDATE_GROUP_SETTINGS', 'CAU_HINH',
      'Cập nhật tham số cấu hình Tập đoàn (WACC, CIT, Tỷ giá, Kịch bản mặc định)');
    SpreadsheetApp.flush();
    return getEntInitialData();
  } finally {
    lock.releaseLock();
  }
}

function saveEntUserAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = getTargetSpreadsheet();
    var sh = ss.getSheetByName('PHAN_QUYEN');
    var uname = String(payload.username || '').trim().toLowerCase();
    if (!uname) throw new Error('Username không được để trống!');

    var rowVals = [
      uname,
      String(payload.password || '123456').trim(),
      String(payload.fullName || '').trim(),
      String(payload.role || 'BU_DIRECTOR').trim(),
      String(payload.buCode || 'ALL_GROUP').trim(),
      String(payload.email || '').trim(),
      String(payload.scope || 'ALL_GROUP').trim(),
      String(payload.approvalRight || 'SUBMIT_BU_REPORT_AND_CAPEX').trim(),
      String(payload.status || 'HOAT_DONG').trim()
    ];

    var foundRow = -1;
    if (sh.getLastRow() >= 2) {
      var uList = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues();
      for (var i = 0; i < uList.length; i++) {
        if (String(uList[i][0]).trim().toLowerCase() === uname) {
          foundRow = i + 2;
          break;
        }
      }
    }

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 9).setValues([rowVals]);
      sh.getRange(foundRow, 1, 1, 2).setNumberFormat('@');
    } else {
      sh.appendRow(rowVals);
      sh.getRange(sh.getLastRow(), 1, 1, 2).setNumberFormat('@');
    }

    appendEntAuditLog_(ss, payload.actorUser, payload.actorRole, 'SAVE_USER_ACCOUNT', uname,
      'Cập nhật tài khoản & mật khẩu phân quyền Tập đoàn: ' + uname + ' (' + rowVals[3] + ')');
    SpreadsheetApp.flush();
    return getEntInitialData();
  } finally {
    lock.releaseLock();
  }
}

/**
 * 8. Xóa bản ghi theo bảng (BU, Cost Center, CAPEX, Intercompany)
 */
function deleteEntRecord(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = getTargetSpreadsheet();
    var type = String(payload.recordType || '').trim().toUpperCase();
    var idVal = String(payload.recordId || '').trim().toUpperCase();
    var sheetMap = {
      'BU': 'HOP_NHAT_DON_VI_BU',
      'CC': 'TRUNG_TAM_CHI_PHI_CC',
      'CAPEX': 'DANH_MUC_DAU_TU_CAPEX',
      'IC': 'GIAO_DICH_NOI_BO_IC'
    };
    var shName = sheetMap[type];
    if (!shName) throw new Error('Loại bản ghi không hợp lệ: ' + type);
    var sh = ss.getSheetByName(shName);
    if (sh && sh.getLastRow() >= 2) {
      var ids = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues();
      for (var i = ids.length - 1; i >= 0; i--) {
        if (String(ids[i][0]).trim().toUpperCase() === idVal) {
          sh.deleteRow(i + 2);
          break;
        }
      }
    }
    appendEntAuditLog_(ss, payload.actorUser, payload.actorRole, 'DELETE_RECORD_' + type, idVal,
      'Xóa bản ghi ' + idVal + ' khỏi bảng ' + shName);
    SpreadsheetApp.flush();
    return getEntInitialData();
  } finally {
    lock.releaseLock();
  }
}

function recalculateEntConsolidation() {
  return runEntHqCostAllocation({ driverMode: 'REVENUE', actorUser: 'MENU_TRIGGER', actorRole: 'GROUP_CFO' });
}

function sendEntCostCenterAlert() {
  var data = getEntInitialData();
  var overList = (data.costCenters || []).filter(function(c) { return c.usedPct >= 85; });
  return {
    success: true,
    alertCount: overList.length,
    message: 'Đã quét ' + (data.costCenters || []).length + ' Trung tâm chi phí: Phát hiện ' + overList.length + ' trung tâm vượt ngưỡng cảnh báo (>=85% ngân sách).'
  };
}


```

## 5. File 4: `Index.html`

```
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>GS-003-ENT v4.1 Pro • Trung Tâm Điều Hành FP&A Tập Đoàn & Đa Đơn Vị (Multi-BU)</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --primary: #0F172A;
      --primary-accent: #1E3A8A;
      --emerald: #047857;
      --amber: #D97706;
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
      background: radial-gradient(circle at top right, #1E3A8A, #0F172A 72%);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .auth-card {
      width: 100%;
      max-width: 520px;
      background: rgba(15, 23, 42, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 18px;
      padding: 24px;
      color: #FFFFFF;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
    }

    /* TOPBAR */
    .app-topbar {
      background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 55%, #0F766E 100%);
      color: #FFFFFF;
      padding: 10px 16px;
      position: sticky;
      top: 0;
      z-index: 1030;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.25);
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
      background: #EFF6FF;
      border-bottom: 1px solid #BFDBFE;
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
      padding: 8px 13px;
      border-radius: 8px;
      transition: all 0.15s ease;
    }
    .nav-tab-btn:hover { background: #F1F5F9; color: #0F172A; }
    .nav-tab-btn.active {
      background: #0F172A;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.28);
    }

    .kpi-card {
      background: #FFFFFF;
      border-radius: 14px;
      padding: 15px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
      height: 100%;
    }
    .kpi-title {
      font-size: 0.73rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #64748B;
      margin-bottom: 4px;
    }
    .kpi-value {
      font-size: 1.25rem;
      font-weight: 800;
      color: #0F172A;
    }
    .kpi-sub {
      font-size: 0.74rem;
      color: #64748B;
      margin-top: 4px;
    }

    .section-card {
      background: #FFFFFF;
      border-radius: 14px;
      border: 1px solid #E2E8F0;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
    }

    .table-pro {
      font-size: 0.8rem;
      vertical-align: middle;
    }
    .table-pro thead th {
      background: #0F172A;
      color: #FFFFFF;
      font-weight: 600;
      font-size: 0.74rem;
      text-transform: uppercase;
      white-space: nowrap;
      padding: 9px 10px;
    }
    .table-pro tbody td {
      padding: 8px 10px;
      white-space: nowrap;
    }

    .badge-soft-success { background: #DCFCE7; color: #166534; font-weight: 700; }
    .badge-soft-warning { background: #FEF3C7; color: #92400E; font-weight: 700; }
    .badge-soft-danger  { background: #FEE2E2; color: #991B1B; font-weight: 700; }
    .badge-soft-info    { background: #DBEAFE; color: #1E40AF; font-weight: 700; }

    .guide-box {
      border-left: 4px solid #1E3A8A;
      background: #F8FAFC;
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 12px;
    }

    /* MOBILE BOTTOM NAV */
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
      z-index: 1030;
    }
    .mob-nav-btn {
      border: none;
      background: none;
      color: #64748B;
      font-size: 0.68rem;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .mob-nav-btn.active { color: #1E3A8A; font-weight: 800; }

    /* LOADING SPINNER OVERLAY */
    #loadingOverlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
  </style>
</head>
<body>

  <!-- SPINNER OVERLAY -->
  <div id="loadingOverlay">
    <div class="text-center bg-dark p-4 rounded-4 shadow-lg border border-secondary">
      <div class="spinner-border text-warning mb-2" role="status"></div>
      <div class="fw-bold small" id="loadingText">Đang đồng bộ dữ liệu 2 chiều với Google Sheets...</div>
    </div>
  </div>

  <!-- AUTH LOGIN GATE -->
  <div id="authGateOverlay" class="auth-gate-overlay">
    <div class="auth-card">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="badge bg-warning text-dark fw-bold px-2 py-1">GS-003-ENT v4.1 PRO</span>
        <span class="small text-info fw-semibold"><i class="bi bi-shield-check me-1"></i>Real-time Sheet Auth</span>
      </div>
      <h5 class="fw-bold mb-1">🏛️ Trung Tâm Điều Hành FP&A Tập Đoàn</h5>
      <p class="small text-secondary mb-3">
        Hợp Nhất Đa Đơn Vị (Multi-BU) • Đa Kịch Bản (Base/Best/Worst) • Trung Tâm Chi Phí (Cost Centers) • Thẩm Định CAPEX (NPV/IRR)
      </p>

      <div id="authErrorBox" class="alert alert-danger py-2 small d-none"></div>

      <div class="mb-2">
        <label class="form-label small fw-semibold mb-1">Tài khoản đăng nhập (Sheet <code>PHAN_QUYEN</code>)</label>
        <input type="text" id="loginUsername" class="form-control form-control-sm bg-dark text-white border-secondary" value="group_cfo">
      </div>
      <div class="mb-3">
        <label class="form-label small fw-semibold mb-1">Mật khẩu (Đối chiếu trực tiếp thời gian thực)</label>
        <input type="password" id="loginPassword" class="form-control form-control-sm bg-dark text-white border-secondary" value="cfo123">
      </div>

      <button id="btnDoLogin" class="btn btn-primary w-100 fw-bold py-2 mb-3" onclick="handleEntLogin()">
        <i class="bi bi-box-arrow-in-right me-1"></i>Đăng Nhập Hệ Thống Điều Hành Tập Đoàn
      </button>

      <div class="border-top border-secondary pt-2">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="small text-secondary">Điền nhanh tài khoản mẫu (Tự cập nhật mật khẩu mới từ Sheet):</span>
          <button class="btn btn-link btn-sm text-info p-0 text-decoration-none" onclick="syncAuthUsersFromSheet(true)">
            <i class="bi bi-arrow-repeat"></i> Làm mớiPass
          </button>
        </div>
        <div class="d-flex flex-wrap gap-1">
          <button class="btn btn-outline-light btn-sm py-0 px-2" style="font-size:0.72rem" onclick="fillLoginQuick('group_ceo')">Chủ Tịch/CEO (group_ceo)</button>
          <button class="btn btn-outline-warning btn-sm py-0 px-2" style="font-size:0.72rem" onclick="fillLoginQuick('group_cfo')">CFO Tập Đoàn (group_cfo)</button>
          <button class="btn btn-outline-info btn-sm py-0 px-2" style="font-size:0.72rem" onclick="fillLoginQuick('head_fpa')">Trưởng FP&A (head_fpa)</button>
          <button class="btn btn-outline-success btn-sm py-0 px-2" style="font-size:0.72rem" onclick="fillLoginQuick('bu_director')">Giám Đốc BU (bu_director)</button>
        </div>
      </div>
    </div>
  </div>

  <!-- TOPBAR -->
  <header class="app-topbar">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div>
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-warning text-dark fw-bold">GS-003-ENT v4.1</span>
          <h6 class="mb-0 fw-bold" id="topHoldingName">TẬP ĐOÀN ĐẦU TƯ & CÔNG NGHỆ ĐẠI VIỆT</h6>
        </div>
        <div class="small opacity-75" id="topPeriodSubtitle">
          Kỳ Hợp Nhất: 2026 • WACC: 11.5% • Kịch Bản Điều Hành: BASE CASE
        </div>
      </div>
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <button class="btn-fullscreen-pro" onclick="toggleFullScreenMode()" id="btnFullscreen">
          <i class="bi bi-arrows-fullscreen me-1"></i>Toàn Màn Hình
        </button>
        <button class="btn btn-sm btn-light fw-semibold" onclick="refreshAllDataFromServer()">
          <i class="bi bi-arrow-clockwise me-1"></i>Đồng Bộ Sheet
        </button>
        <button class="btn btn-sm btn-outline-light" onclick="switchEntTab('tabGuide')">
          <i class="bi bi-journal-bookmark-fill me-1"></i>Cẩm Nang FP&A
        </button>
        <button class="btn btn-sm btn-danger fw-semibold" onclick="handleEntLogout()">
          <i class="bi bi-power"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- ROLE & FILTER BAR -->
  <div class="role-scope-bar">
    <div>
      <i class="bi bi-person-badge-fill text-primary me-1"></i>
      Đang điều hành: <strong id="currentUserBadge">CFO Tập Đoàn Nguyễn Minh Tuyết (GROUP_CFO)</strong>
      <span class="badge bg-primary ms-1" id="currentScopeBadge">Phạm vi: ALL_GROUP</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <label class="small fw-semibold mb-0">Lọc Đơn Vị (BU):</label>
      <select id="globalBuFilter" class="form-select form-select-sm" style="width:220px" onchange="renderAllEntViews()">
        <option value="ALL">🏛️ Toàn Tập Đoàn (Consolidated)</option>
      </select>
      <label class="small fw-semibold mb-0 ms-1">Kịch bản:</label>
      <select id="globalScenarioFilter" class="form-select form-select-sm" style="width:155px" onchange="onGlobalScenarioChange()">
        <option value="BASE">🎯 BASE CASE (Cơ sở)</option>
        <option value="BEST">🚀 BEST CASE (Tích cực)</option>
        <option value="WORST">🛡️ WORST CASE (Phòng thủ)</option>
      </select>
    </div>
  </div>

  <!-- DESKTOP TABS -->
  <nav class="desktop-nav-bar">
    <button class="nav-tab-btn active" data-tab="tabExec" onclick="switchEntTab('tabExec')">📊 1. Executive Boardroom</button>
    <button class="nav-tab-btn" data-tab="tabBu" onclick="switchEntTab('tabBu')">🏢 2. Hợp Nhất Đa Đơn Vị (Multi-BU)</button>
    <button class="nav-tab-btn" data-tab="tabScenario" onclick="switchEntTab('tabScenario')">🎯 3. Đa Kịch Bản & Độ Nhạy (What-if)</button>
    <button class="nav-tab-btn" data-tab="tabCostCenter" onclick="switchEntTab('tabCostCenter')">🛡️ 4. Trung Tâm Chi Phí (Cost Centers)</button>
    <button class="nav-tab-btn" data-tab="tabCapexIc" onclick="switchEntTab('tabCapexIc')">💎 5. Đầu Tư CAPEX & Giao Dịch Nội Bộ</button>
    <button class="nav-tab-btn" data-tab="tabSettings" onclick="switchEntTab('tabSettings')">⚙️ 6. Cấu Hình & Phân Quyền</button>
    <button class="nav-tab-btn" data-tab="tabGuide" onclick="switchEntTab('tabGuide')">📘 7. Cẩm Nang FP&A Tập Đoàn (Cho Người Mới)</button>
  </nav>

  <!-- MAIN CONTAINER -->
  <main class="container-fluid py-3 px-3">

    <!-- =================================================================== -->
    <!-- TAB 1: EXECUTIVE BOARDROOM DASHBOARD                                -->
    <!-- =================================================================== -->
    <section id="tabExec" class="ent-tab-pane">
      <div class="row g-3 mb-3">
        <div class="col-6 col-md-4 col-xl-2">
          <div class="kpi-card">
            <div class="kpi-title">Doanh Thu Hợp Nhất (Thuần)</div>
            <div class="kpi-value text-primary" id="kpiConsRev">0</div>
            <div class="kpi-sub" id="kpiConsRevSub">Đã loại trừ nội bộ (IC)</div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-xl-2">
          <div class="kpi-card">
            <div class="kpi-title">EBITDA Hợp Nhất Tập Đoàn</div>
            <div class="kpi-value text-success" id="kpiGroupEbitda">0</div>
            <div class="kpi-sub" id="kpiGroupEbitdaSub">Biên EBITDA: 0%</div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-xl-2">
          <div class="kpi-card">
            <div class="kpi-title">Lợi Nhuận Sau Thuế (NOPAT)</div>
            <div class="kpi-value text-dark" id="kpiGroupNopat">0</div>
            <div class="kpi-sub" id="kpiGroupNopatSub">Sau khấu hao & thuế CIT</div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-xl-2">
          <div class="kpi-card">
            <div class="kpi-title">ROIC Hợp Nhất vs WACC</div>
            <div class="kpi-value text-info" id="kpiGroupRoic">0%</div>
            <div class="kpi-sub" id="kpiGroupRoicSub">Chi phí vốn WACC: 11.5%</div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-xl-2">
          <div class="kpi-card">
            <div class="kpi-title">Giá Trị Kinh Tế Gia Tăng (EVA)</div>
            <div class="kpi-value text-success" id="kpiGroupEva">0</div>
            <div class="kpi-sub" id="kpiGroupEvaSub">NOPAT - (Vốn × WACC)</div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-xl-2">
          <div class="kpi-card">
            <div class="kpi-title">Ngân Sách Cost Center Khả Dụng</div>
            <div class="kpi-value text-warning" id="kpiAvailBudget">0</div>
            <div class="kpi-sub" id="kpiAvailBudgetSub">Cảnh báo vượt trần: 0 TT</div>
          </div>
        </div>
      </div>

      <!-- CHARTS ROW -->
      <div class="row g-3 mb-3">
        <div class="col-lg-6">
          <div class="section-card h-100">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold mb-0"><i class="bi bi-bar-chart-steps text-primary me-1"></i>Đóng Góp Doanh Thu, EBITDA & EVA Theo Đơn Vị (BU)</h6>
              <span class="badge badge-soft-info">Đơn vị: Tỷ VND</span>
            </div>
            <div style="height:290px"><canvas id="chartBuPerformance"></canvas></div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="section-card h-100">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold mb-0"><i class="bi bi-graph-up-arrow text-success me-1"></i>So Sánh Quỹ Đạo EBITDA & Dòng Tiền Tự Do 3 Kịch Bản (12 Tháng)</h6>
              <span class="badge badge-soft-success" id="execActiveScenarioBadge">Kịch bản: BASE</span>
            </div>
            <div style="height:290px"><canvas id="chartScenarioTrajectory"></canvas></div>
          </div>
        </div>
      </div>

      <!-- EXECUTIVE CONSOLIDATION BRIDGE & ALERTS -->
      <div class="row g-3">
        <div class="col-lg-7">
          <div class="section-card">
            <h6 class="fw-bold mb-2"><i class="bi bi-diagram-3-fill text-primary me-1"></i>Bảng Cầu Nối Hợp Nhất Tập Đoàn (Consolidation & Intercompany Elimination Bridge)</h6>
            <div class="table-responsive">
              <table class="table table-bordered table-hover table-pro mb-0">
                <thead>
                  <tr>
                    <th>Chỉ Tiêu Hợp Nhất Tập Đoàn</th>
                    <th class="text-end">Tổng Cộng Ngang Các BU</th>
                    <th class="text-end">Bút Toán Loại Trừ Nội Bộ (IC)</th>
                    <th class="text-end">Số Thực Hợp Nhất Toàn Tập Đoàn</th>
                    <th>Ghi Chú Kiểm Toán</th>
                  </tr>
                </thead>
                <tbody id="execConsolidationBridgeBody"></tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="section-card">
            <h6 class="fw-bold mb-2"><i class="bi bi-shield-exclamation text-danger me-1"></i>Cảnh Báo Điều Hành Trọng Yếu (CFO Executive Radar)</h6>
            <div id="execRadarAlertsBox"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- TAB 2: MULTI-BU CONSOLIDATION & ROIC/EVA                            -->
    <!-- =================================================================== -->
    <section id="tabBu" class="ent-tab-pane d-none">
      <div class="section-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h6 class="fw-bold mb-0">🏢 Báo Cáo Hợp Nhất Kết Quả Kinh Doanh & Hiệu Quả Sử Dụng Vốn Theo Đơn Vị (Multi-BU P&L, ROIC & EVA)</h6>
            <div class="small text-secondary">
              Tự động tính <code>EBITDA</code>, <code>NOPAT</code>, <code>ROIC (%) = NOPAT / Vốn Đầu Tư</code> và <code>EVA = NOPAT - (Vốn Đầu Tư × WACC)</code>
            </div>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <div class="input-group input-group-sm" style="width:310px">
              <span class="input-group-text bg-light fw-semibold">Tiêu thức phân bổ HQ:</span>
              <select id="hqAllocDriverSelect" class="form-select">
                <option value="REVENUE">Theo Tỷ Trọng Doanh Thu</option>
                <option value="HEADCOUNT">Theo Quy Mô Nhân Sự (HC)</option>
              </select>
              <button class="btn btn-outline-primary fw-bold" onclick="triggerHqCostAllocation()">Phân Bổ Ngay</button>
            </div>
            <button class="btn btn-primary btn-sm fw-bold" onclick="openBuModal()">
              <i class="bi bi-plus-circle me-1"></i>Thêm / Cập Nhật Đơn Vị (BU)
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered table-hover table-pro mb-0">
            <thead>
              <tr>
                <th>Mã BU</th>
                <th>Tên Đơn Vị Kinh Doanh</th>
                <th>Khối Ngành</th>
                <th>Giám Đốc BU</th>
                <th class="text-end">Nhân Sự</th>
                <th class="text-end">DT Bên Ngoài</th>
                <th class="text-end">DT Nội Bộ (IC)</th>
                <th class="text-end">Giá Vốn (COGS)</th>
                <th class="text-end">OPEX Trực Tiếp</th>
                <th class="text-end">Phí HQ Phân Bổ</th>
                <th class="text-end">EBITDA</th>
                <th class="text-end">NOPAT (Sau Thuế)</th>
                <th class="text-end">Vốn Đầu Tư</th>
                <th class="text-end">ROIC (%)</th>
                <th class="text-end">EVA (Gia Tăng)</th>
                <th class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody id="buTableBody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- TAB 3: SCENARIO MODELING & WHAT-IF SENSITIVITY                      -->
    <!-- =================================================================== -->
    <section id="tabScenario" class="ent-tab-pane d-none">
      <div class="row g-3 mb-3">
        <!-- WHAT-IF SIMULATOR -->
        <div class="col-lg-5">
          <div class="section-card h-100">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold mb-0"><i class="bi bi-sliders text-primary me-1"></i>Bộ Mô Phỏng Độ Nhạy Thời Gian Thực (What-if Stress Test)</h6>
              <button class="btn btn-outline-secondary btn-sm py-0" onclick="resetWhatIfSliders()">Đặt lại 0%</button>
            </div>
            <p class="small text-secondary mb-3">
              Kéo thanh trượt để kiểm tra tác động tức thì của biến động vĩ mô lên <strong>EBITDA Cả Năm</strong> và <strong>Dòng Tiền Tự Do (FCF)</strong> của kịch bản đang chọn:
            </p>

            <div class="mb-3">
              <div class="d-flex justify-content-between small fw-bold mb-1">
                <span>1. Biến động Doanh thu Hợp nhất (%):</span>
                <span class="text-primary" id="lblSensRev">0%</span>
              </div>
              <input type="range" class="form-range" id="sliderSensRev" min="-25" max="30" step="1" value="0" oninput="renderScenarioAndWhatIf()">
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between small fw-bold mb-1">
                <span>2. Biến động Giá vốn hàng bán COGS (%):</span>
                <span class="text-danger" id="lblSensCogs">0%</span>
              </div>
              <input type="range" class="form-range" id="sliderSensCogs" min="-15" max="20" step="1" value="0" oninput="renderScenarioAndWhatIf()">
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between small fw-bold mb-1">
                <span>3. Cắt giảm / Tăng Chi phí vận hành OPEX (%):</span>
                <span class="text-warning" id="lblSensOpex">0%</span>
              </div>
              <input type="range" class="form-range" id="sliderSensOpex" min="-25" max="25" step="1" value="0" oninput="renderScenarioAndWhatIf()">
            </div>

            <div class="p-3 rounded-3 bg-light border">
              <div class="row g-2 text-center">
                <div class="col-4">
                  <div class="small text-secondary">Doanh Thu Sau Mô Phỏng</div>
                  <div class="fw-bold text-primary" id="simTotalRev">0</div>
                  <div class="small" id="simDeltaRev">0</div>
                </div>
                <div class="col-4">
                  <div class="small text-secondary">EBITDA Sau Mô Phỏng</div>
                  <div class="fw-bold text-success" id="simTotalEbitda">0</div>
                  <div class="small" id="simDeltaEbitda">0</div>
                </div>
                <div class="col-4">
                  <div class="small text-secondary">FCF Cả Năm Sau Mô Phỏng</div>
                  <div class="fw-bold text-dark" id="simTotalFcf">0</div>
                  <div class="small" id="simDeltaFcf">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2D SENSITIVITY MATRIX -->
        <div class="col-lg-7">
          <div class="section-card h-100">
            <h6 class="fw-bold mb-1"><i class="bi bi-grid-3x3-gap-fill text-success me-1"></i>Ma Trận Độ Nhạy 2 Chiều: EBITDA Tập Đoàn Cả Năm (Đơn vị: Tỷ VND)</h6>
            <div class="small text-secondary mb-2">
              Trục dọc: Biến động Doanh thu (<code>-10%</code> đến <code>+10%</code>) • Trục ngang: Biến động Giá vốn COGS (<code>-6%</code> đến <code>+6%</code>)
            </div>
            <div class="table-responsive">
              <table class="table table-bordered table-pro text-center mb-0" id="sensitivityMatrixTable"></table>
            </div>
          </div>
        </div>
      </div>

      <!-- 12-MONTH SCENARIO TABLE -->
      <div class="section-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h6 class="fw-bold mb-0">📅 Bảng Dự Phóng Dòng Tiền & EBITDA 12 Tháng Theo Kịch Bản (<span id="scenTableTitleCode">BASE</span>)</h6>
            <div class="small text-secondary">Mọi chỉnh sửa được lưu trực tiếp xuống Sheet <code>KICH_BAN_DU_PHONG_12T</code></div>
          </div>
          <button class="btn btn-success btn-sm fw-bold" onclick="openScenarioModal()">
            <i class="bi bi-pencil-square me-1"></i>Cập Nhật Tháng Dự Phóng
          </button>
        </div>
        <div class="table-responsive">
          <table class="table table-bordered table-hover table-pro mb-0">
            <thead>
              <tr>
                <th>Mã Dòng</th>
                <th>Kịch Bản</th>
                <th>Kỳ Tháng</th>
                <th class="text-end">Doanh Thu Hợp Nhất</th>
                <th class="text-end">Giá Vốn (COGS)</th>
                <th class="text-end">Lợi Nhuận Gộp</th>
                <th class="text-end">OPEX Tập Đoàn</th>
                <th class="text-end">EBITDA</th>
                <th class="text-end">Biên EBITDA</th>
                <th class="text-end">Giải Ngân CAPEX</th>
                <th class="text-end">Thay Đổi NWC</th>
                <th class="text-end">Dòng Tiền Tự Do (FCF)</th>
                <th class="text-end">Số Dư Tiền Tập Đoàn</th>
                <th class="text-center">Sửa</th>
              </tr>
            </thead>
            <tbody id="scenarioTableBody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- TAB 4: COST CENTERS & COMMITTED PO CONTROL                          -->
    <!-- =================================================================== -->
    <section id="tabCostCenter" class="ent-tab-pane d-none">
      <div class="section-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h6 class="fw-bold mb-0">🛡️ Kiểm Soát Ngân Sách Trung Tâm Chi Phí (Approved Budget vs Actual Spend vs Committed PO)</h6>
            <div class="small text-secondary">
              Công thức chuẩn Tập đoàn: <code>Ngân sách Khả dụng = Ngân sách Duyệt - Thực Chi (Actual) - Hợp Đồng Đã Ký Chờ Thanh Toán (Committed PO)</code>
            </div>
          </div>
          <button class="btn btn-primary btn-sm fw-bold" onclick="openCostCenterModal()">
            <i class="bi bi-plus-circle me-1"></i>Thêm / Cập Nhật Trung Tâm Chi Phí
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered table-hover table-pro mb-0">
            <thead>
              <tr>
                <th>Mã CC</th>
                <th>Tên Trung Tâm Chi Phí</th>
                <th>Đơn Vị BU</th>
                <th>Phân Loại</th>
                <th>Tiêu Thức Phân Bổ</th>
                <th class="text-end">Ngân Sách Duyệt</th>
                <th class="text-end">Thực Chi (Actual)</th>
                <th class="text-end">Cam Kết PO (Committed)</th>
                <th class="text-end">Tổng Đã Dùng</th>
                <th class="text-end">Ngân Sách Khả Dụng</th>
                <th class="text-end">% Sử Dụng</th>
                <th class="text-center">Trạng Thái</th>
                <th>Người Phụ Trách</th>
                <th class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody id="costCenterTableBody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- TAB 5: CAPEX PORTFOLIO (NPV/IRR) & INTERCOMPANY ELIMINATION         -->
    <!-- =================================================================== -->
    <section id="tabCapexIc" class="ent-tab-pane d-none">
      <!-- CAPEX PORTFOLIO -->
      <div class="section-card mb-3">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h6 class="fw-bold mb-0">💎 Danh Mục Thẩm Định Dự Án Đầu Tư Vốn Tập Đoàn (CAPEX Portfolio: NPV, IRR & Payback Period)</h6>
            <div class="small text-secondary">
              Hệ thống tự động chiết khấu dòng tiền 5 năm theo <code>WACC Tập đoàn</code> để tính <code>NPV</code>, <code>IRR (%)</code> và <code>Thời gian hoàn vốn (Năm)</code>
            </div>
          </div>
          <button class="btn btn-success btn-sm fw-bold" onclick="openCapexModal()">
            <i class="bi bi-plus-circle me-1"></i>Thẩm Định / Thêm Dự Án CAPEX
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered table-hover table-pro mb-0">
            <thead>
              <tr>
                <th>Mã Dự Án</th>
                <th>Tên Dự Án Đầu Tư CAPEX / M&A</th>
                <th>BU</th>
                <th>Nhóm Đầu Tư</th>
                <th class="text-end">Vốn CAPEX Ban Đầu</th>
                <th class="text-end">CF Năm 1</th>
                <th class="text-end">CF Năm 2</th>
                <th class="text-end">CF Năm 3</th>
                <th class="text-end">CF Năm 4</th>
                <th class="text-end">CF Năm 5</th>
                <th class="text-end">NPV (Hiện Tại Ròng)</th>
                <th class="text-end">IRR (%)</th>
                <th class="text-end">Hoàn Vốn</th>
                <th class="text-center">Phê Duyệt HĐĐT</th>
                <th class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody id="capexTableBody"></tbody>
          </table>
        </div>
      </div>

      <!-- INTERCOMPANY TRANSACTIONS -->
      <div class="section-card">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h6 class="fw-bold mb-0">🔄 Sổ Đối Chiếu & Loại Trừ Giao Dịch Nội Bộ Tập Đoàn (Intercompany Transactions & Eliminations)</h6>
            <div class="small text-secondary">
              Kiểm soát khớp số liệu giữa BU Bán và BU Mua (<code>Chênh lệch = 0</code>) để tự động loại trừ khi lên Báo cáo Hợp nhất Tập đoàn
            </div>
          </div>
          <button class="btn btn-warning btn-sm fw-bold text-dark" onclick="openIcModal()">
            <i class="bi bi-arrow-left-right me-1"></i>Ghi Nhận / Đối Chiếu Giao Dịch Nội Bộ
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered table-hover table-pro mb-0">
            <thead>
              <tr>
                <th>Mã Bút Toán IC</th>
                <th>Ngày Hạch Toán</th>
                <th>BU Bán / Cung Cấp</th>
                <th>BU Mua / Nhận</th>
                <th>Loại Giao Dịch</th>
                <th>Nội Dung Giao Dịch Nội Bộ</th>
                <th class="text-end">Ghi Nhận Bên Bán</th>
                <th class="text-end">Ghi Nhận Bên Mua</th>
                <th class="text-end">Chênh Lệch Đối Chiếu</th>
                <th class="text-center">Trạng Thái Loại Trừ</th>
                <th>Kiểm Soát Viên</th>
                <th class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody id="icTableBody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- TAB 6: GROUP SETTINGS, RBAC & AUDIT TRAIL                           -->
    <!-- =================================================================== -->
    <section id="tabSettings" class="ent-tab-pane d-none">
      <div class="row g-3">
        <!-- GROUP CONFIG -->
        <div class="col-lg-5">
          <div class="section-card h-100">
            <h6 class="fw-bold mb-3"><i class="bi bi-sliders2-vertical text-primary me-1"></i>Tham Số Quản Trị Tập Đoàn & Hội Đồng Đầu Tư (Sheet <code>CAU_HINH</code>)</h6>
            <div class="row g-2">
              <div class="col-12">
                <label class="form-label small fw-semibold mb-1">Tên Pháp Nhân Tập Đoàn / Holding</label>
                <input type="text" id="cfgHoldingName" class="form-control form-control-sm">
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold mb-1">Năm Tài Chính</label>
                <input type="text" id="cfgFiscalYear" class="form-control form-control-sm">
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold mb-1">Kỳ Báo Cáo (YYYY-MM)</label>
                <input type="text" id="cfgReportingPeriod" class="form-control form-control-sm">
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold mb-1">Chi Phí Vốn WACC (%/năm)</label>
                <input type="number" step="0.1" id="cfgWaccPct" class="form-control form-control-sm">
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold mb-1">Thuế Suất CIT (%)</label>
                <input type="number" step="0.5" id="cfgCitTaxPct" class="form-control form-control-sm">
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold mb-1">Ngưỡng IRR Tối Thiểu Duyệt CAPEX (%)</label>
                <input type="number" step="0.5" id="cfgHurdleIrrPct" class="form-control form-control-sm">
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold mb-1">Thời Gian Hoàn Vốn Tối Đa (Năm)</label>
                <input type="number" step="0.1" id="cfgMaxPayback" class="form-control form-control-sm">
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold mb-1">Ngưỡng Cảnh Báo Cost Center (%)</label>
                <input type="number" step="1" id="cfgCcAlertPct" class="form-control form-control-sm">
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold mb-1">Tỷ Giá Quy Đổi USD/VND</label>
                <input type="number" step="10" id="cfgUsdVndRate" class="form-control form-control-sm">
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold mb-1">Mục Tiêu Biên EBITDA Tập Đoàn (%)</label>
                <input type="number" step="0.5" id="cfgTargetEbitdaPct" class="form-control form-control-sm">
              </div>
              <div class="col-6">
                <label class="form-label small fw-semibold mb-1">Mục Tiêu ROIC Tập Đoàn (%)</label>
                <input type="number" step="0.5" id="cfgTargetRoicPct" class="form-control form-control-sm">
              </div>
              <div class="col-12 mt-3">
                <button class="btn btn-primary btn-sm w-100 fw-bold py-2" onclick="saveGroupSettingsForm()">
                  <i class="bi bi-cloud-arrow-up-fill me-1"></i>Lưu Cấu Hình Tập Đoàn Xuống Google Sheets
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- RBAC ACCOUNTS -->
        <div class="col-lg-7">
          <div class="section-card mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 class="fw-bold mb-0"><i class="bi bi-people-fill text-success me-1"></i>Quản Lý Tài Khoản & Mật Khẩu Phân Quyền (Sheet <code>PHAN_QUYEN</code>)</h6>
                <div class="small text-secondary">Đổi mật khẩu tại đây hoặc trực tiếp trên Sheet đều có hiệu lực ngay lập tức</div>
              </div>
              <button class="btn btn-success btn-sm fw-bold" onclick="openUserModal()">
                <i class="bi bi-person-plus-fill me-1"></i>Thêm / Đổi Mật Khẩu
              </button>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered table-hover table-pro mb-0">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Mật Khẩu Hiện Tại</th>
                    <th>Họ Tên Lãnh Đạo</th>
                    <th>Vai Trò</th>
                    <th>Đơn Vị BU</th>
                    <th>Phạm Vi</th>
                    <th>Trạng Thái</th>
                    <th class="text-center">Sửa</th>
                  </tr>
                </thead>
                <tbody id="userTableBody"></tbody>
              </table>
            </div>
          </div>

          <!-- AUDIT TRAIL -->
          <div class="section-card">
            <h6 class="fw-bold mb-2"><i class="bi bi-clock-history text-secondary me-1"></i>Nhật Ký Kiểm Toán Hệ Thống Tập Đoàn (Sheet <code>NHAT_KY_HE_THONG</code>)</h6>
            <div class="table-responsive" style="max-height:240px;overflow-y:auto;">
              <table class="table table-bordered table-sm table-pro mb-0">
                <thead>
                  <tr>
                    <th>Thời Gian</th>
                    <th>Người Thực Hiện</th>
                    <th>Vai Trò</th>
                    <th>Hành Động</th>
                    <th>Đối Tượng</th>
                    <th>Chi Tiết Thay Đổi</th>
                  </tr>
                </thead>
                <tbody id="auditLogTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- TAB 7: BEGINNER GUIDE & ENTERPRISE FP&A GLOSSARY                    -->
    <!-- =================================================================== -->
    <section id="tabGuide" class="ent-tab-pane d-none">
      <div class="section-card mb-3">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <span class="badge bg-primary mb-1">DÀNH CHO NGƯỜI MỚI & LÃNH ĐẠO CÁC KHỐI</span>
            <h5 class="fw-bold mb-1">📘 Cẩm Nang Giải Nghĩa Thuật Ngữ Quản Trị Tài Chính Tập Đoàn (Enterprise FP&A)</h5>
            <div class="small text-secondary">
              Nội dung này được đồng bộ trực tiếp với Sheet đầu tiên <code>HUONG_DAN_SU_DUNG</code> trên Google Sheets giúp bất kỳ ai cũng hiểu rõ ý nghĩa các con số.
            </div>
          </div>
          <div class="input-group input-group-sm" style="width:280px">
            <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
            <input type="text" id="guideSearchInput" class="form-control" placeholder="Tìm thuật ngữ (VD: ROIC, WACC, NPV, IC...)" oninput="renderGuideCards()">
          </div>
        </div>

        <div id="guideCardsContainer" class="row g-3"></div>
      </div>
    </section>

  </main>

  <!-- MOBILE BOTTOM NAVIGATION -->
  <nav class="mobile-bottom-nav d-md-none">
    <button class="mob-nav-btn active" data-tab="tabExec" onclick="switchEntTab('tabExec')">
      <i class="bi bi-speedometer2 fs-6"></i><span>HĐQT</span>
    </button>
    <button class="mob-nav-btn" data-tab="tabBu" onclick="switchEntTab('tabBu')">
      <i class="bi bi-buildings fs-6"></i><span>Multi-BU</span>
    </button>
    <button class="mob-nav-btn" data-tab="tabScenario" onclick="switchEntTab('tabScenario')">
      <i class="bi bi-sliders fs-6"></i><span>Kịch Bản</span>
    </button>
    <button class="mob-nav-btn" data-tab="tabCostCenter" onclick="switchEntTab('tabCostCenter')">
      <i class="bi bi-shield-check fs-6"></i><span>Chi Phí</span>
    </button>
    <button class="mob-nav-btn" data-tab="tabCapexIc" onclick="switchEntTab('tabCapexIc')">
      <i class="bi bi-gem fs-6"></i><span>CAPEX/IC</span>
    </button>
    <button class="mob-nav-btn" data-tab="tabGuide" onclick="switchEntTab('tabGuide')">
      <i class="bi bi-journal-text fs-6"></i><span>Cẩm Nang</span>
    </button>
  </nav>

  <!-- ===================================================================== -->
  <!-- MODALS FOR 2-WAY CRUD SYNC                                            -->
  <!-- ===================================================================== -->

  <!-- 1. MODAL BUSINESS UNIT (BU) -->
  <div class="modal fade" id="modalBu" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white py-2">
          <h6 class="modal-title fw-bold">🏢 Thêm / Cập Nhật Đơn Vị Kinh Doanh (Sheet HOP_NHAT_DON_VI_BU)</h6>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-2">
            <div class="col-md-3">
              <label class="form-label small fw-bold mb-1">Mã Đơn Vị (BU Code)</label>
              <input type="text" id="buFormCode" class="form-control form-control-sm" placeholder="VD: BU-01">
            </div>
            <div class="col-md-5">
              <label class="form-label small fw-bold mb-1">Tên Đơn Vị Kinh Doanh / Công Ty Con</label>
              <input type="text" id="buFormName" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Khối Ngành</label>
              <input type="text" id="buFormSector" class="form-control form-control-sm">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Giám Đốc BU</label>
              <input type="text" id="buFormDirector" class="form-control form-control-sm">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Quy Mô Nhân Sự (Headcount)</label>
              <input type="number" id="buFormHc" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-primary">Doanh Thu Bên Ngoài (VND)</label>
              <input type="number" id="buFormExtRev" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-info">Doanh Thu Nội Bộ IC (VND)</label>
              <input type="number" id="buFormIcRev" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-danger">Giá Vốn COGS (VND)</label>
              <input type="number" id="buFormCogs" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">OPEX Trực Tiếp Tại BU (VND)</label>
              <input type="number" id="buFormDirectOpex" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Chi Phí HQ Phân Bổ (VND)</label>
              <input type="number" id="buFormHqAlloc" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Khấu Hao D&A (VND)</label>
              <input type="number" id="buFormDa" class="form-control form-control-sm">
            </div>
            <div class="col-md-12">
              <label class="form-label small fw-bold mb-1 text-success">Vốn Đầu Tư Được Giao (Invested Capital - VND) — Để tính ROIC (%) & EVA</label>
              <input type="number" id="buFormInvCap" class="form-control form-control-sm">
            </div>
          </div>
        </div>
        <div class="modal-footer py-2">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-primary btn-sm fw-bold" onclick="submitBuForm()">
            <i class="bi bi-check2-circle me-1"></i>Lưu & Đồng Bộ Google Sheets
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 2. MODAL SCENARIO MONTH -->
  <div class="modal fade" id="modalScenario" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-success text-white py-2">
          <h6 class="modal-title fw-bold">🎯 Cập Nhật Dự Phóng Tháng Theo Kịch Bản (Sheet KICH_BAN_DU_PHONG_12T)</h6>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="scenFormRowId">
          <div class="row g-2">
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Mã Kịch Bản</label>
              <select id="scenFormCode" class="form-select form-select-sm">
                <option value="BASE">BASE (Kịch bản Cơ sở)</option>
                <option value="BEST">BEST (Kịch bản Tích cực)</option>
                <option value="WORST">WORST (Kịch bản Phòng thủ)</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Kỳ Tháng (YYYY-MM)</label>
              <input type="text" id="scenFormMonth" class="form-control form-control-sm" placeholder="2026-06">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-primary">Doanh Thu Hợp Nhất (VND)</label>
              <input type="number" id="scenFormRev" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-danger">Giá Vốn COGS (VND)</label>
              <input type="number" id="scenFormCogs" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">OPEX Toàn Tập Đoàn (VND)</label>
              <input type="number" id="scenFormOpex" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Giải Ngân CAPEX Trong Tháng (VND)</label>
              <input type="number" id="scenFormCapex" class="form-control form-control-sm">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Thay Đổi Vốn Lưu Động NWC (VND)</label>
              <input type="number" id="scenFormNwc" class="form-control form-control-sm">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Số Dư Tiền Mặt Cuối Kỳ (VND)</label>
              <input type="number" id="scenFormCash" class="form-control form-control-sm">
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold mb-1">Ghi Chú Giả Định Kịch Bản</label>
              <input type="text" id="scenFormNote" class="form-control form-control-sm">
            </div>
          </div>
        </div>
        <div class="modal-footer py-2">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-success btn-sm fw-bold" onclick="submitScenarioForm()">
            <i class="bi bi-check2-circle me-1"></i>Lưu Dòng Dự Phóng
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. MODAL COST CENTER -->
  <div class="modal fade" id="modalCostCenter" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white py-2">
          <h6 class="modal-title fw-bold">🛡️ Thêm / Cập Nhật Trung Tâm Chi Phí (Sheet TRUNG_TAM_CHI_PHI_CC)</h6>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-2">
            <div class="col-md-3">
              <label class="form-label small fw-bold mb-1">Mã Trung Tâm (CC Code)</label>
              <input type="text" id="ccFormCode" class="form-control form-control-sm" placeholder="CC-101">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Tên Trung Tâm Chi Phí</label>
              <input type="text" id="ccFormName" class="form-control form-control-sm">
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-bold mb-1">Thuộc Đơn Vị BU</label>
              <input type="text" id="ccFormBu" class="form-control form-control-sm" placeholder="BU-01 / BU-06">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Phân Loại Trung Tâm</label>
              <select id="ccFormType" class="form-select form-select-sm">
                <option value="PROFIT_SUPPORT">PROFIT_SUPPORT (Hỗ trợ kinh doanh)</option>
                <option value="REVENUE_DRIVER">REVENUE_DRIVER (Thúc đẩy doanh số)</option>
                <option value="MANUFACTURING_OH">MANUFACTURING_OH (Sản xuất nhà máy)</option>
                <option value="LOGISTICS_OPS">LOGISTICS_OPS (Vận hành kho vận)</option>
                <option value="PROJECT_DEV">PROJECT_DEV (Phát triển dự án)</option>
                <option value="SHARED_SERVICE_HQ">SHARED_SERVICE_HQ (Dịch vụ chung Tập đoàn)</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Tiêu Thức Phân Bổ (Cost Driver)</label>
              <input type="text" id="ccFormDriver" class="form-control form-control-sm" placeholder="Số lượng nhân sự / Tỷ trọng DT">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Người Phụ Trách</label>
              <input type="text" id="ccFormOwner" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-primary">Ngân Sách Được Duyệt (Approved)</label>
              <input type="number" id="ccFormBudget" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-danger">Thực Chi Lũy Kế (Actual Spend)</label>
              <input type="number" id="ccFormActual" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-warning">Cam Kết PO Chờ Trả (Committed)</label>
              <input type="number" id="ccFormCommitted" class="form-control form-control-sm">
            </div>
          </div>
        </div>
        <div class="modal-footer py-2">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-primary btn-sm fw-bold" onclick="submitCostCenterForm()">
            <i class="bi bi-check2-circle me-1"></i>Lưu Ngân Sách Trung Tâm Chi Phí
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. MODAL CAPEX PROJECT -->
  <div class="modal fade" id="modalCapex" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-success text-white py-2">
          <h6 class="modal-title fw-bold">💎 Thẩm Định Dự Án Đầu Tư CAPEX / M&A (Tự Động Tính NPV, IRR & Payback)</h6>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-2">
            <div class="col-md-3">
              <label class="form-label small fw-bold mb-1">Mã Dự Án</label>
              <input type="text" id="capexFormCode" class="form-control form-control-sm" placeholder="CAPEX-2026-06">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Tên Dự Án Đầu Tư Vốn / M&A</label>
              <input type="text" id="capexFormName" class="form-control form-control-sm">
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-bold mb-1">Đơn Vị Đề Xuất (BU)</label>
              <input type="text" id="capexFormBu" class="form-control form-control-sm" placeholder="BU-01">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Nhóm Đầu Tư</label>
              <input type="text" id="capexFormCategory" class="form-control form-control-sm" placeholder="Mở Rộng Sản Xuất / Hạ Tầng AI">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-danger">Vốn Đầu Tư CAPEX Ban Đầu (VND)</label>
              <input type="number" id="capexFormInit" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Trạng Thái Phê Duyệt HĐĐT</label>
              <select id="capexFormStatus" class="form-select form-select-sm">
                <option value="CHO_HD_DAU_TU">CHO_HD_DAU_TU (Chờ Hội đồng Đầu tư)</option>
                <option value="DA_PHE_DUYET">DA_PHE_DUYET (Đã phê duyệt giải ngân)</option>
                <option value="CAN_CAU_TRUC_LAI">CAN_CAU_TRUC_LAI (Cần cấu trúc lại phương án)</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-success">Dòng Tiền Thuần Năm 1 (CF1)</label>
              <input type="number" id="capexFormCf1" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-success">Dòng Tiền Thuần Năm 2 (CF2)</label>
              <input type="number" id="capexFormCf2" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-success">Dòng Tiền Thuần Năm 3 (CF3)</label>
              <input type="number" id="capexFormCf3" class="form-control form-control-sm">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1 text-success">Dòng Tiền Thuần Năm 4 (CF4)</label>
              <input type="number" id="capexFormCf4" class="form-control form-control-sm">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1 text-success">Dòng Tiền Thuần Năm 5 (CF5)</label>
              <input type="number" id="capexFormCf5" class="form-control form-control-sm">
            </div>
          </div>
        </div>
        <div class="modal-footer py-2">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-success btn-sm fw-bold" onclick="submitCapexForm()">
            <i class="bi bi-calculator me-1"></i>Tính NPV/IRR & Lưu Google Sheets
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 5. MODAL INTERCOMPANY TRANSACTION -->
  <div class="modal fade" id="modalIc" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-warning text-dark py-2">
          <h6 class="modal-title fw-bold">🔄 Ghi Nhận & Đối Chiếu Giao Dịch Nội Bộ (Sheet GIAO_DICH_NOI_BO_IC)</h6>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-2">
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Mã Bút Toán IC</label>
              <input type="text" id="icFormCode" class="form-control form-control-sm" placeholder="IC-2026-007">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Ngày Hạch Toán</label>
              <input type="date" id="icFormDate" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Loại Giao Dịch Nội Bộ</label>
              <select id="icFormType" class="form-select form-select-sm">
                <option value="BAN_HANG_NOI_BO">BAN_HANG_NOI_BO (Mua bán hàng hóa nội bộ)</option>
                <option value="DICH_VU_CONG_NGHE">DICH_VU_CONG_NGHE (Dịch vụ CNTT/Cloud)</option>
                <option value="DICH_VU_LOGISTICS">DICH_VU_LOGISTICS (Vận tải & Kho lạnh)</option>
                <option value="THUE_HA_TANG_KCN">THUE_HA_TANG_KCN (Thuê nhà xưởng/Năng lượng)</option>
                <option value="PHI_QUAN_TRI_HQ">PHI_QUAN_TRI_HQ (Phí quản trị Tập đoàn)</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Đơn Vị Bán / Cung Cấp (Seller BU)</label>
              <input type="text" id="icFormSeller" class="form-control form-control-sm" placeholder="BU-01">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Đơn Vị Mua / Nhận Dịch Vụ (Buyer BU)</label>
              <input type="text" id="icFormBuyer" class="form-control form-control-sm" placeholder="BU-02">
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold mb-1">Nội Dung Kinh Tế Giao Dịch Nội Bộ</label>
              <input type="text" id="icFormDesc" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-primary">Giá Trị Ghi Nhận Bên Bán (VND)</label>
              <input type="number" id="icFormSellerAmt" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1 text-success">Giá Trị Ghi Nhận Bên Mua (VND)</label>
              <input type="number" id="icFormBuyerAmt" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-1">Người Kiểm Soát Đối Chiếu</label>
              <input type="text" id="icFormController" class="form-control form-control-sm">
            </div>
          </div>
        </div>
        <div class="modal-footer py-2">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-warning btn-sm fw-bold text-dark" onclick="submitIcForm()">
            <i class="bi bi-check2-circle me-1"></i>Lưu & Đối Chiếu Loại Trừ Nội Bộ
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 6. MODAL USER ACCOUNT -->
  <div class="modal fade" id="modalUser" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white py-2">
          <h6 class="modal-title fw-bold">🔐 Cập Nhật Tài Khoản & Mật Khẩu (Sheet PHAN_QUYEN)</h6>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row g-2">
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Username</label>
              <input type="text" id="userFormUsername" class="form-control form-control-sm">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1 text-danger">Mật Khẩu Mới</label>
              <input type="text" id="userFormPassword" class="form-control form-control-sm">
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold mb-1">Họ Tên Lãnh Đạo / Cán Bộ</label>
              <input type="text" id="userFormFullName" class="form-control form-control-sm">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Vai Trò Tập Đoàn</label>
              <select id="userFormRole" class="form-select form-select-sm">
                <option value="GROUP_CEO">GROUP_CEO (Chủ tịch / TGĐ Tập đoàn)</option>
                <option value="GROUP_CFO">GROUP_CFO (CFO Tập đoàn)</option>
                <option value="HEAD_FPA">HEAD_FPA (Trưởng ban FP&A)</option>
                <option value="BU_DIRECTOR">BU_DIRECTOR (Giám đốc BU)</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Mã Đơn Vị (BU)</label>
              <input type="text" id="userFormBu" class="form-control form-control-sm" value="ALL_GROUP">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Email</label>
              <input type="email" id="userFormEmail" class="form-control form-control-sm">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-1">Trạng Thái</label>
              <select id="userFormStatus" class="form-select form-select-sm">
                <option value="HOAT_DONG">HOAT_DONG</option>
                <option value="KHOA">KHOA</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer py-2">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-success btn-sm fw-bold" onclick="submitUserForm()">
            <i class="bi bi-check2-circle me-1"></i>Lưu Tài Khoản Xuống Sheet
          </button>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    // =========================================================================
    // GLOBAL STATE & MOCK FALLBACK (FOR PREVIEW & GAS RUNTIME)
    // =========================================================================
    var RAW_SERVER_PAYLOAD = <?!= typeof INITIAL_PAYLOAD_JSON !== 'undefined' ? INITIAL_PAYLOAD_JSON : 'null' ?>;

    var APP_STATE = {
      config: {},
      users: [],
      guides: [],
      businessUnits: [],
      scenarios: [],
      costCenters: [],
      capexProjects: [],
      intercompany: [],
      auditLogs: [],
      currentUser: null,
      charts: {
        buChart: null,
        scenChart: null
      }
    };

    function getFallbackMockData() {
      return {
        config: {
          HOLDING_NAME: 'TẬP ĐOÀN ĐẦU TƯ & CÔNG NGHỆ ĐẠI VIỆT (DAI VIET GROUP HOLDINGS)',
          FISCAL_YEAR: '2026',
          REPORTING_PERIOD: '2026-11',
          CURRENCY: 'VND',
          USD_VND_RATE: '25450',
          WACC_PCT: '11.5',
          CIT_TAX_RATE_PCT: '20',
          HURDLE_RATE_IRR_PCT: '15.0',
          MAX_PAYBACK_YEARS: '4.0',
          CC_ALERT_THRESHOLD_PCT: '85',
          ACTIVE_SCENARIO: 'BASE',
          TARGET_GROUP_EBITDA_MARGIN_PCT: '24.0',
          TARGET_GROUP_ROIC_PCT: '18.5'
        },
        users: [
          { username: 'group_ceo', password: 'ceo123', fullName: 'Chủ Tịch / TGĐ Tập Đoàn Trần Quốc Vương', role: 'GROUP_CEO', buCode: 'ALL_GROUP', email: 'ceo@daiviet-holdings.vn', scope: 'ALL_GROUP', approvalRight: 'APPROVE_ALL_CAPEX_AND_BUDGET', status: 'HOAT_DONG' },
          { username: 'group_cfo', password: 'cfo123', fullName: 'CFO Tập Đoàn Nguyễn Minh Tuyết', role: 'GROUP_CFO', buCode: 'ALL_GROUP', email: 'cfo@daiviet-holdings.vn', scope: 'ALL_GROUP', approvalRight: 'APPROVE_CONSOLIDATION_AND_CAPEX', status: 'HOAT_DONG' },
          { username: 'head_fpa', password: 'fpa123', fullName: 'Trưởng Ban FP&A Tập Đoàn Lê Hoàng Bách', role: 'HEAD_FPA', buCode: 'ALL_GROUP', email: 'fpa@daiviet-holdings.vn', scope: 'ALL_GROUP', approvalRight: 'MANAGE_SCENARIO_AND_ALLOCATION', status: 'HOAT_DONG' },
          { username: 'bu_director', password: 'bu123', fullName: 'Giám Đốc Khối Công Nghệ Phạm Tuấn Anh', role: 'BU_DIRECTOR', buCode: 'BU-01', email: 'bu01@daiviet-holdings.vn', scope: 'BU_ONLY', approvalRight: 'SUBMIT_BU_REPORT_AND_CAPEX', status: 'HOAT_DONG' }
        ],
        guides: [
          { group: '1. Báo Cáo Hợp Nhất Đa Đơn Vị', term: 'Business Unit (BU) & Consolidated P&L', plainMeaning: 'Mỗi công ty con hoặc khối kinh doanh là 1 BU. Báo cáo Hợp nhất cộng gộp các BU và loại trừ doanh thu mua bán nội bộ.', formulaBenchmark: 'Doanh thu Hợp nhất = Tổng Doanh thu Bên ngoài của tất cả BU', example: 'BU Công nghệ bán phần mềm 1,2 tỷ cho BU Phân phối và bán ra thị trường 32 tỷ -> Hợp nhất ghi nhận 32 tỷ.' },
          { group: '2. Chi Phí Vốn & Giá Trị Gia Tăng', term: 'ROIC (%) vs WACC (%) & EVA', plainMeaning: 'WACC là lãi suất bình quân huy động vốn; ROIC là tỷ suất sinh lời thực tế trên vốn đầu tư của BU.', formulaBenchmark: 'ROIC = NOPAT / Invested Capital | EVA = Invested Capital × (ROIC - WACC)', example: 'Vốn 80 tỷ, ROIC 24% > WACC 11.5% -> Tạo ra giá trị kinh tế gia tăng EVA dương.' }
        ],
        businessUnits: [
          { buCode: 'BU-01', buName: 'Khối Công Nghệ, Cloud & AI Enterprise', sector: 'Công Nghệ & SaaS', director: 'Phạm Tuấn Anh', headcount: 185, extRevenue: 48500000000, icRevenue: 3200000000, cogs: 14200000000, directOpex: 16800000000, hqAlloc: 2100000000, ebitda: 18600000000, da: 1800000000, ebit: 16800000000, taxCit: 3360000000, nopat: 13440000000, investedCap: 68000000000, roicPct: 19.76, eva: 5620000000 },
          { buCode: 'BU-02', buName: 'Khối Thương Mại & Phân Phối Toàn Quốc', sector: 'Thương Mại B2B/B2C', director: 'Đặng Thu Hà', headcount: 240, extRevenue: 76000000000, icRevenue: 1800000000, cogs: 49500000000, directOpex: 13400000000, hqAlloc: 2400000000, ebitda: 12500000000, da: 1500000000, ebit: 11000000000, taxCit: 2200000000, nopat: 8800000000, investedCap: 55000000000, roicPct: 16.0, eva: 2475000000 }
        ],
        scenarios: [],
        costCenters: [],
        capexProjects: [],
        intercompany: [],
        auditLogs: []
      };
    }

    function fmtVnd(n) {
      var v = Number(n || 0);
      return v.toLocaleString('vi-VN') + ' ₫';
    }

    function fmtBil(n) {
      var v = Number(n || 0) / 1e9;
      return v.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Tỷ';
    }

    function showLoading(msg) {
      var el = document.getElementById('loadingOverlay');
      var txt = document.getElementById('loadingText');
      if (txt && msg) txt.textContent = msg;
      if (el) el.style.display = 'flex';
    }

    function hideLoading() {
      var el = document.getElementById('loadingOverlay');
      if (el) el.style.display = 'none';
    }

    function hydrateState(payload) {
      if (!payload || payload.error) {
        payload = getFallbackMockData();
      }
      APP_STATE.config = payload.config || {};
      APP_STATE.users = payload.users || [];
      APP_STATE.guides = payload.guides || [];
      APP_STATE.businessUnits = payload.businessUnits || [];
      APP_STATE.scenarios = payload.scenarios || [];
      APP_STATE.costCenters = payload.costCenters || [];
      APP_STATE.capexProjects = payload.capexProjects || [];
      APP_STATE.intercompany = payload.intercompany || [];
      APP_STATE.auditLogs = payload.auditLogs || [];

      populateBuFilterDropdown();
      renderAllEntViews();
    }

    // =========================================================================
    // REAL-TIME AUTHENTICATION DIRECTLY AGAINST SHEET PHAN_QUYEN
    // =========================================================================
    function syncAuthUsersFromSheet(showToastAfter) {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(function(res) {
            if (res && res.users) {
              APP_STATE.users = res.users;
              var curInputUser = (document.getElementById('loginUsername').value || '').trim().toLowerCase();
              if (curInputUser) {
                var matched = APP_STATE.users.find(function(u) { return u.username.toLowerCase() === curInputUser; });
                if (matched) {
                  document.getElementById('loginPassword').value = matched.password;
                }
              }
              if (showToastAfter) {
                alert('Đã đồng bộ mật khẩu mới nhất trực tiếp từ Sheet PHAN_QUYEN!');
              }
            }
          })
          .getEntAuthUsersFromSheet();
      }
    }

    function fillLoginQuick(uname) {
      document.getElementById('loginUsername').value = uname;
      var applyUserPass = function() {
        var found = (APP_STATE.users || []).find(function(u) {
          return String(u.username || '').toLowerCase() === String(uname).toLowerCase();
        });
        if (found) {
          document.getElementById('loginPassword').value = found.password;
        }
      };
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(function(res) {
            if (res && res.users) APP_STATE.users = res.users;
            applyUserPass();
          })
          .getEntAuthUsersFromSheet();
      } else {
        applyUserPass();
      }
    }

    function handleEntLogin() {
      var u = (document.getElementById('loginUsername').value || '').trim();
      var p = (document.getElementById('loginPassword').value || '').trim();
      var errBox = document.getElementById('authErrorBox');
      errBox.classList.add('d-none');

      if (!u || !p) {
        errBox.textContent = 'Vui lòng nhập đầy đủ Username và Mật khẩu!';
        errBox.classList.remove('d-none');
        return;
      }

      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang xác thực mật khẩu trực tiếp với Sheet PHAN_QUYEN...');
        google.script.run
          .withSuccessHandler(function(res) {
            hideLoading();
            if (res && res.success && res.user) {
              if (res.allUsers) APP_STATE.users = res.allUsers;
              completeLoginSession(res.user);
            } else {
              errBox.textContent = (res && res.message) || 'Sai tài khoản hoặc mật khẩu!';
              errBox.classList.remove('d-none');
            }
          })
          .withFailureHandler(function(err) {
            hideLoading();
            errBox.textContent = 'Lỗi kết nối Server: ' + err.message;
            errBox.classList.remove('d-none');
          })
          .verifyEntLogin({ username: u, password: p });
      } else {
        var found = (APP_STATE.users || []).find(function(item) {
          return item.username.toLowerCase() === u.toLowerCase() && item.password === p;
        });
        if (found) {
          completeLoginSession(found);
        } else {
          errBox.textContent = 'Sai mật khẩu hoặc tài khoản!';
          errBox.classList.remove('d-none');
        }
      }
    }

    function completeLoginSession(userObj) {
      APP_STATE.currentUser = userObj;
      document.getElementById('authGateOverlay').style.display = 'none';
      document.getElementById('currentUserBadge').textContent = userObj.fullName + ' (' + userObj.role + ')';
      document.getElementById('currentScopeBadge').textContent = 'Phạm vi: ' + (userObj.buCode || 'ALL_GROUP');

      var buSelect = document.getElementById('globalBuFilter');
      if (userObj.role === 'BU_DIRECTOR' && userObj.buCode && userObj.buCode !== 'ALL_GROUP') {
        buSelect.value = userObj.buCode;
        buSelect.disabled = true;
      } else {
        buSelect.disabled = false;
        buSelect.value = 'ALL';
      }
      renderAllEntViews();
    }

    function handleEntLogout() {
      APP_STATE.currentUser = null;
      document.getElementById('authGateOverlay').style.display = 'flex';
      syncAuthUsersFromSheet(false);
    }

    window.addEventListener('focus', function() {
      if (!APP_STATE.currentUser) {
        syncAuthUsersFromSheet(false);
      }
    });

    // =========================================================================
    // NAVIGATION & FULLSCREEN
    // =========================================================================
    function switchEntTab(tabId) {
      document.querySelectorAll('.ent-tab-pane').forEach(function(el) {
        el.classList.add('d-none');
      });
      var target = document.getElementById(tabId);
      if (target) target.classList.remove('d-none');

      document.querySelectorAll('.nav-tab-btn, .mob-nav-btn').forEach(function(btn) {
        if (btn.getAttribute('data-tab') === tabId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    function toggleFullScreenMode() {
      var btn = document.getElementById('btnFullscreen');
      if (!document.fullscreenElement && !document.body.classList.contains('pseudo-fullscreen')) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(function() {
            document.body.classList.add('pseudo-fullscreen');
          });
        } else {
          document.body.classList.add('pseudo-fullscreen');
        }
        btn.innerHTML = '<i class="bi bi-fullscreen-exit me-1"></i>Thoát Toàn Màn Hình';
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
        document.body.classList.remove('pseudo-fullscreen');
        btn.innerHTML = '<i class="bi bi-arrows-fullscreen me-1"></i>Toàn Màn Hình';
      }
    }

    function refreshAllDataFromServer() {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang tải dữ liệu mới nhất từ 9 Sheets...');
        google.script.run
          .withSuccessHandler(function(res) {
            hideLoading();
            hydrateState(res);
          })
          .withFailureHandler(function(err) {
            hideLoading();
            alert('Lỗi tải dữ liệu: ' + err.message);
          })
          .getEntInitialData();
      } else {
        renderAllEntViews();
      }
    }

    function populateBuFilterDropdown() {
      var sel = document.getElementById('globalBuFilter');
      var curVal = sel.value || 'ALL';
      var html = '<option value="ALL">🏛️ Toàn Tập Đoàn (Consolidated)</option>';
      (APP_STATE.businessUnits || []).forEach(function(b) {
        html += '<option value="' + b.buCode + '">' + b.buCode + ' • ' + b.buName + '</option>';
      });
      sel.innerHTML = html;
      sel.value = curVal;

      var activeScen = APP_STATE.config.ACTIVE_SCENARIO || 'BASE';
      var scSel = document.getElementById('globalScenarioFilter');
      if (scSel && !scSel.getAttribute('data-user-changed')) {
        scSel.value = activeScen;
      }
    }

    function onGlobalScenarioChange() {
      var scSel = document.getElementById('globalScenarioFilter');
      if (scSel) scSel.setAttribute('data-user-changed', '1');
      renderAllEntViews();
    }

    // =========================================================================
    // MASTER RENDERING ENGINE
    // =========================================================================
    function renderAllEntViews() {
      var cfg = APP_STATE.config || {};
      var waccPct = parseFloat(cfg.WACC_PCT || '11.5');
      var activeScenario = (document.getElementById('globalScenarioFilter').value || cfg.ACTIVE_SCENARIO || 'BASE').toUpperCase();
      var selectedBu = document.getElementById('globalBuFilter').value || 'ALL';

      document.getElementById('topHoldingName').textContent = cfg.HOLDING_NAME || 'TẬP ĐOÀN ĐẦU TƯ & CÔNG NGHỆ ĐẠI VIỆT';
      document.getElementById('topPeriodSubtitle').textContent =
        'Kỳ Hợp Nhất: ' + (cfg.REPORTING_PERIOD || '2026') + ' • WACC Tập Đoàn: ' + waccPct + '% • Kịch Bản Điều Hành: ' + activeScenario + ' CASE';
      document.getElementById('execActiveScenarioBadge').textContent = 'Kịch bản: ' + activeScenario;
      document.getElementById('scenTableTitleCode').textContent = activeScenario;

      renderExecDashboard(selectedBu, activeScenario, waccPct);
      renderBuTable(selectedBu);
      renderScenarioAndWhatIf();
      renderCostCentersTable(selectedBu);
      renderCapexAndIcTables(selectedBu, waccPct);
      renderSettingsAndUsers();
      renderGuideCards();
    }

    // -------------------------------------------------------------------------
    // 1. RENDER EXECUTIVE BOARDROOM
    // -------------------------------------------------------------------------
    function renderExecDashboard(selectedBu, activeScenario, waccPct) {
      var buList = (APP_STATE.businessUnits || []).filter(function(b) {
        return selectedBu === 'ALL' ? true : b.buCode === selectedBu;
      });

      var sumExtRev = 0, sumIcRev = 0, sumCogs = 0, sumDirectOpex = 0, sumHqAlloc = 0;
      var sumEbitda = 0, sumDa = 0, sumEbit = 0, sumTax = 0, sumNopat = 0, sumInvCap = 0;

      buList.forEach(function(b) {
        sumExtRev += Number(b.extRevenue || 0);
        sumIcRev += Number(b.icRevenue || 0);
        sumCogs += Number(b.cogs || 0);
        sumDirectOpex += Number(b.directOpex || 0);
        sumHqAlloc += Number(b.hqAlloc || 0);
        sumEbitda += Number(b.ebitda || 0);
        sumDa += Number(b.da || 0);
        sumEbit += Number(b.ebit || 0);
        sumTax += Number(b.taxCit || 0);
        sumNopat += Number(b.nopat || 0);
        sumInvCap += Number(b.investedCap || 0);
      });

      // Consolidated adjustments when viewing ALL_GROUP: Intercompany Revenue & Expense cancel out
      var ebitdaMargin = sumExtRev > 0 ? ((sumEbitda / sumExtRev) * 100).toFixed(1) : '0.0';
      var groupRoic = sumInvCap > 0 ? ((sumNopat / sumInvCap) * 100).toFixed(2) : '0.00';
      var groupEva = sumNopat - Math.round(sumInvCap * (waccPct / 100.0));

      var ccList = (APP_STATE.costCenters || []).filter(function(c) {
        return selectedBu === 'ALL' ? true : c.buCode === selectedBu;
      });
      var sumAvailBudget = 0;
      var alertCcCount = 0;
      ccList.forEach(function(c) {
        sumAvailBudget += Number(c.availableBudget || 0);
        if (Number(c.usedPct || 0) >= 85) alertCcCount++;
      });

      document.getElementById('kpiConsRev').textContent = fmtBil(sumExtRev);
      document.getElementById('kpiConsRevSub').textContent = 'Đã loại trừ IC: ' + fmtBil(sumIcRev);

      document.getElementById('kpiGroupEbitda').textContent = fmtBil(sumEbitda);
      document.getElementById('kpiGroupEbitdaSub').textContent = 'Biên EBITDA Hợp nhất: ' + ebitdaMargin + '%';

      document.getElementById('kpiGroupNopat').textContent = fmtBil(sumNopat);
      document.getElementById('kpiGroupNopatSub').textContent = 'Thuế CIT: ' + fmtBil(sumTax);

      document.getElementById('kpiGroupRoic').textContent = groupRoic + '%';
      document.getElementById('kpiGroupRoicSub').textContent = 'So với WACC: ' + waccPct + '% (' + (parseFloat(groupRoic) >= waccPct ? 'Tạo giá trị' : 'Dưới WACC') + ')';

      document.getElementById('kpiGroupEva').textContent = (groupEva >= 0 ? '+' : '') + fmtBil(groupEva);
      document.getElementById('kpiGroupEvaSub').textContent = 'Vốn đầu tư: ' + fmtBil(sumInvCap);

      document.getElementById('kpiAvailBudget').textContent = fmtBil(sumAvailBudget);
      document.getElementById('kpiAvailBudgetSub').textContent = 'Cảnh báo >=85% trần: ' + alertCcCount + ' Trung tâm';

      // Consolidation Bridge Table
      var rawTotalRev = sumExtRev + sumIcRev;
      var rawTotalCost = sumCogs + sumDirectOpex + sumHqAlloc;
      var consTotalCost = rawTotalCost - sumIcRev;
      var bridgeHtml = ''
        + '<tr><td class="fw-bold">1. Tổng Doanh Thu (Gồm cả Nội bộ)</td><td class="text-end">' + fmtVnd(rawTotalRev) + '</td><td class="text-end text-danger">-' + fmtVnd(sumIcRev) + '</td><td class="text-end fw-bold text-primary">' + fmtVnd(sumExtRev) + '</td><td>Loại trừ 100% Doanh thu nội bộ giữa các BU & Phí HQ</td></tr>'
        + '<tr><td class="fw-bold">2. Tổng Chi Phí (COGS + OPEX + Phân bổ HQ)</td><td class="text-end">' + fmtVnd(rawTotalCost) + '</td><td class="text-end text-success">-' + fmtVnd(sumIcRev) + '</td><td class="text-end fw-bold">' + fmtVnd(consTotalCost) + '</td><td>Triệt tiêu giá vốn & phí dịch vụ nội bộ tương ứng</td></tr>'
        + '<tr class="table-success"><td class="fw-bold">3. EBITDA Hợp Nhất Toàn Tập Đoàn</td><td class="text-end fw-bold">' + fmtVnd(sumEbitda) + '</td><td class="text-end">0 ₫</td><td class="text-end fw-bold text-success">' + fmtVnd(sumEbitda) + '</td><td>Biên EBITDA Hợp nhất đạt ' + ebitdaMargin + '%</td></tr>'
        + '<tr><td class="fw-bold">4. Lợi Nhuận Sau Thuế (NOPAT) & EVA</td><td class="text-end">' + fmtVnd(sumNopat) + '</td><td class="text-end">0 ₫</td><td class="text-end fw-bold text-dark">' + fmtVnd(sumNopat) + '</td><td>EVA toàn Tập đoàn: <strong>' + fmtVnd(groupEva) + '</strong> (ROIC ' + groupRoic + '%)</td></tr>';
      document.getElementById('execConsolidationBridgeBody').innerHTML = bridgeHtml;

      // Executive Alerts Box
      var alerts = [];
      ccList.forEach(function(c) {
        if (c.usedPct >= 85) {
          alerts.push('<div class="alert alert-warning py-2 px-3 mb-2 small"><i class="bi bi-exclamation-triangle-fill me-1"></i><strong>' + c.ccCode + ' (' + c.ccName + '):</strong> Đã dùng <strong>' + c.usedPct + '%</strong> ngân sách (Thực chi + PO = ' + fmtBil(c.totalUsed) + '). Khả dụng còn: ' + fmtBil(c.availableBudget) + '.</div>');
        }
      });
      (APP_STATE.capexProjects || []).forEach(function(p) {
        if (p.npv < 0 || p.irrPct < waccPct) {
          alerts.push('<div class="alert alert-danger py-2 px-3 mb-2 small"><i class="bi bi-x-octagon-fill me-1"></i><strong>Dự án ' + p.projectCode + ' (' + p.projectName + '):</strong> NPV = ' + fmtBil(p.npv) + ', IRR = ' + p.irrPct + '% (< WACC ' + waccPct + '%). Khuyến nghị: <strong>Cấu trúc lại hoặc Từ chối</strong>.</div>');
        }
      });
      (APP_STATE.intercompany || []).forEach(function(ic) {
        if (ic.diffAmount > 0) {
          alerts.push('<div class="alert alert-danger py-2 px-3 mb-2 small"><i class="bi bi-arrow-left-right me-1"></i><strong>Lệch đối chiếu nội bộ ' + ic.icCode + ' (' + ic.sellerBu + ' → ' + ic.buyerBu + '):</strong> Chênh lệch ' + fmtVnd(ic.diffAmount) + '.</div>');
        }
      });
      if (alerts.length === 0) {
        alerts.push('<div class="alert alert-success py-2 px-3 mb-0 small"><i class="bi bi-check-circle-fill me-1"></i>Toàn bộ Trung tâm chi phí, Danh mục CAPEX và Giao dịch nội bộ đang trong ngưỡng an toàn chuẩn Tập đoàn.</div>');
      }
      document.getElementById('execRadarAlertsBox').innerHTML = alerts.join('');

      renderExecCharts(buList);
    }

    function renderExecCharts(buList) {
      if (typeof Chart === 'undefined') return;

      // Chart 1: BU Performance
      var ctxBu = document.getElementById('chartBuPerformance');
      if (ctxBu) {
        if (APP_STATE.charts.buChart) APP_STATE.charts.buChart.destroy();
        var nonHqBus = buList.filter(function(b) { return b.buCode !== 'BU-06'; });
        APP_STATE.charts.buChart = new Chart(ctxBu, {
          type: 'bar',
          data: {
            labels: nonHqBus.map(function(b) { return b.buCode; }),
            datasets: [
              {
                label: 'Doanh Thu Bên Ngoài (Tỷ)',
                data: nonHqBus.map(function(b) { return Number((b.extRevenue / 1e9).toFixed(2)); }),
                backgroundColor: '#1E3A8A'
              },
              {
                label: 'EBITDA (Tỷ)',
                data: nonHqBus.map(function(b) { return Number((b.ebitda / 1e9).toFixed(2)); }),
                backgroundColor: '#047857'
              },
              {
                label: 'EVA Giá Trị Gia Tăng (Tỷ)',
                data: nonHqBus.map(function(b) { return Number((b.eva / 1e9).toFixed(2)); }),
                backgroundColor: '#D97706'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
          }
        });
      }

      // Chart 2: 3-Scenario EBITDA Trajectory
      var ctxSc = document.getElementById('chartScenarioTrajectory');
      if (ctxSc) {
        if (APP_STATE.charts.scenChart) APP_STATE.charts.scenChart.destroy();
        var baseRows = (APP_STATE.scenarios || []).filter(function(r) { return r.scenarioCode === 'BASE'; });
        var bestRows = (APP_STATE.scenarios || []).filter(function(r) { return r.scenarioCode === 'BEST'; });
        var worstRows = (APP_STATE.scenarios || []).filter(function(r) { return r.scenarioCode === 'WORST'; });
        var labels = baseRows.map(function(r) { return r.month; });

        APP_STATE.charts.scenChart = new Chart(ctxSc, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'BEST CASE EBITDA (Tỷ)',
                data: bestRows.map(function(r) { return Number((r.groupEbitda / 1e9).toFixed(2)); }),
                borderColor: '#047857',
                backgroundColor: 'rgba(4,120,87,0.08)',
                tension: 0.3,
                fill: false
              },
              {
                label: 'BASE CASE EBITDA (Tỷ)',
                data: baseRows.map(function(r) { return Number((r.groupEbitda / 1e9).toFixed(2)); }),
                borderColor: '#1E3A8A',
                backgroundColor: 'rgba(30,58,138,0.12)',
                tension: 0.3,
                fill: true
              },
              {
                label: 'WORST CASE EBITDA (Tỷ)',
                data: worstRows.map(function(r) { return Number((r.groupEbitda / 1e9).toFixed(2)); }),
                borderColor: '#DC2626',
                borderDash: [5, 4],
                tension: 0.3,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
          }
        });
      }
    }

    // -------------------------------------------------------------------------
    // 2. RENDER MULTI-BU CONSOLIDATION TABLE
    // -------------------------------------------------------------------------
    function renderBuTable(selectedBu) {
      var list = (APP_STATE.businessUnits || []).filter(function(b) {
        return selectedBu === 'ALL' ? true : b.buCode === selectedBu;
      });
      var waccPct = parseFloat((APP_STATE.config && APP_STATE.config.WACC_PCT) || '11.5');
      var rowsHtml = '';

      list.forEach(function(b) {
        var roicBadge = b.roicPct >= waccPct
          ? '<span class="badge badge-soft-success">' + b.roicPct + '%</span>'
          : '<span class="badge badge-soft-warning">' + b.roicPct + '%</span>';
        var evaCls = b.eva >= 0 ? 'text-success fw-bold' : 'text-danger fw-bold';

        rowsHtml += '<tr>'
          + '<td class="fw-bold text-primary">' + b.buCode + '</td>'
          + '<td class="fw-semibold">' + b.buName + '</td>'
          + '<td><span class="badge bg-light text-dark border">' + b.sector + '</span></td>'
          + '<td>' + b.director + '</td>'
          + '<td class="text-end">' + b.headcount + '</td>'
          + '<td class="text-end fw-semibold">' + fmtVnd(b.extRevenue) + '</td>'
          + '<td class="text-end text-secondary">' + fmtVnd(b.icRevenue) + '</td>'
          + '<td class="text-end text-danger">' + fmtVnd(b.cogs) + '</td>'
          + '<td class="text-end">' + fmtVnd(b.directOpex) + '</td>'
          + '<td class="text-end text-info">' + fmtVnd(b.hqAlloc) + '</td>'
          + '<td class="text-end fw-bold text-success">' + fmtVnd(b.ebitda) + '</td>'
          + '<td class="text-end fw-bold">' + fmtVnd(b.nopat) + '</td>'
          + '<td class="text-end">' + fmtVnd(b.investedCap) + '</td>'
          + '<td class="text-end">' + roicBadge + '</td>'
          + '<td class="text-end ' + evaCls + '">' + (b.eva >= 0 ? '+' : '') + fmtVnd(b.eva) + '</td>'
          + '<td class="text-center">'
          + '  <button class="btn btn-outline-primary btn-sm py-0 px-2 me-1" onclick="editBuRow(\'' + b.buCode + '\')"><i class="bi bi-pencil"></i></button>'
          + '  <button class="btn btn-outline-danger btn-sm py-0 px-2" onclick="deleteEntItem(\'BU\', \'' + b.buCode + '\')"><i class="bi bi-trash"></i></button>'
          + '</td>'
          + '</tr>';
      });
      document.getElementById('buTableBody').innerHTML = rowsHtml || '<tr><td colspan="16" class="text-center py-3">Chưa có dữ liệu BU</td></tr>';
    }

    // -------------------------------------------------------------------------
    // 3. RENDER SCENARIO & WHAT-IF SENSITIVITY
    // -------------------------------------------------------------------------
    function resetWhatIfSliders() {
      document.getElementById('sliderSensRev').value = 0;
      document.getElementById('sliderSensCogs').value = 0;
      document.getElementById('sliderSensOpex').value = 0;
      renderScenarioAndWhatIf();
    }

    function renderScenarioAndWhatIf() {
      var activeScenario = (document.getElementById('globalScenarioFilter').value || 'BASE').toUpperCase();
      var sensRevPct = parseFloat(document.getElementById('sliderSensRev').value || '0');
      var sensCogsPct = parseFloat(document.getElementById('sliderSensCogs').value || '0');
      var sensOpexPct = parseFloat(document.getElementById('sliderSensOpex').value || '0');

      document.getElementById('lblSensRev').textContent = (sensRevPct >= 0 ? '+' : '') + sensRevPct + '%';
      document.getElementById('lblSensCogs').textContent = (sensCogsPct >= 0 ? '+' : '') + sensCogsPct + '%';
      document.getElementById('lblSensOpex').textContent = (sensOpexPct >= 0 ? '+' : '') + sensOpexPct + '%';

      var rows = (APP_STATE.scenarios || []).filter(function(r) {
        return r.scenarioCode === activeScenario;
      });

      var baseRevSum = 0, baseCogsSum = 0, baseOpexSum = 0, baseEbitdaSum = 0, baseFcfSum = 0;
      var simRevSum = 0, simEbitdaSum = 0, simFcfSum = 0;

      var tableHtml = '';
      rows.forEach(function(r) {
        baseRevSum += r.consolidatedRev;
        baseCogsSum += r.cogs;
        baseOpexSum += r.groupOpex;
        baseEbitdaSum += r.groupEbitda;
        baseFcfSum += r.fcf;

        var sRev = Math.round(r.consolidatedRev * (1 + sensRevPct / 100.0));
        var sCogs = Math.round(r.cogs * (1 + sensRevPct / 100.0) * (1 + sensCogsPct / 100.0));
        var sOpex = Math.round(r.groupOpex * (1 + sensOpexPct / 100.0));
        var sEbitda = sRev - sCogs - sOpex;
        var sTax = sEbitda > 0 ? Math.round(sEbitda * 0.16) : 0;
        var sFcf = sEbitda - sTax - r.capexOutflow - r.nwcDelta;

        simRevSum += sRev;
        simEbitdaSum += sEbitda;
        simFcfSum += sFcf;

        tableHtml += '<tr>'
          + '<td class="fw-bold">' + r.rowId + '</td>'
          + '<td><span class="badge badge-soft-info">' + r.scenarioCode + '</span></td>'
          + '<td class="fw-semibold">' + r.month + '</td>'
          + '<td class="text-end fw-semibold text-primary">' + fmtVnd(r.consolidatedRev) + '</td>'
          + '<td class="text-end text-danger">' + fmtVnd(r.cogs) + '</td>'
          + '<td class="text-end">' + fmtVnd(r.grossProfit) + '</td>'
          + '<td class="text-end">' + fmtVnd(r.groupOpex) + '</td>'
          + '<td class="text-end fw-bold text-success">' + fmtVnd(r.groupEbitda) + '</td>'
          + '<td class="text-end">' + r.ebitdaMarginPct + '%</td>'
          + '<td class="text-end">' + fmtVnd(r.capexOutflow) + '</td>'
          + '<td class="text-end">' + fmtVnd(r.nwcDelta) + '</td>'
          + '<td class="text-end fw-bold">' + fmtVnd(r.fcf) + '</td>'
          + '<td class="text-end fw-bold text-dark">' + fmtVnd(r.cashBalance) + '</td>'
          + '<td class="text-center"><button class="btn btn-outline-success btn-sm py-0 px-2" onclick="editScenarioRow(\'' + r.rowId + '\')"><i class="bi bi-pencil"></i></button></td>'
          + '</tr>';
      });
      document.getElementById('scenarioTableBody').innerHTML = tableHtml || '<tr><td colspan="14" class="text-center py-3">Chưa có dữ liệu dự phóng 12 tháng</td></tr>';

      var dRev = simRevSum - baseRevSum;
      var dEbitda = simEbitdaSum - baseEbitdaSum;
      var dFcf = simFcfSum - baseFcfSum;

      document.getElementById('simTotalRev').textContent = fmtBil(simRevSum);
      document.getElementById('simDeltaRev').innerHTML = '<span class="' + (dRev >= 0 ? 'text-success' : 'text-danger') + '">' + (dRev >= 0 ? '+' : '') + fmtBil(dRev) + '</span>';

      document.getElementById('simTotalEbitda').textContent = fmtBil(simEbitdaSum);
      document.getElementById('simDeltaEbitda').innerHTML = '<span class="' + (dEbitda >= 0 ? 'text-success' : 'text-danger') + '">' + (dEbitda >= 0 ? '+' : '') + fmtBil(dEbitda) + '</span>';

      document.getElementById('simTotalFcf').textContent = fmtBil(simFcfSum);
      document.getElementById('simDeltaFcf').innerHTML = '<span class="' + (dFcf >= 0 ? 'text-success' : 'text-danger') + '">' + (dFcf >= 0 ? '+' : '') + fmtBil(dFcf) + '</span>';

      // Build 2D Sensitivity Matrix (Rev Shocks vs COGS Shocks)
      var revShocks = [-10, -5, 0, 5, 10];
      var cogsShocks = [-6, -3, 0, 3, 6];
      var matHtml = '<thead><tr><th>Doanh Thu \\ Giá Vốn COGS</th>';
      cogsShocks.forEach(function(cs) {
        matHtml += '<th>COGS ' + (cs >= 0 ? '+' : '') + cs + '%</th>';
      });
      matHtml += '</tr></thead><tbody>';

      revShocks.forEach(function(rs) {
        matHtml += '<tr><td class="fw-bold bg-light">DT ' + (rs >= 0 ? '+' : '') + rs + '%</td>';
        cogsShocks.forEach(function(cs) {
          var mRev = baseRevSum * (1 + rs / 100.0);
          var mCogs = baseCogsSum * (1 + rs / 100.0) * (1 + cs / 100.0);
          var mEb = mRev - mCogs - baseOpexSum;
          var isCenter = (rs === 0 && cs === 0);
          var cellCls = isCenter ? 'table-primary fw-bold' : (mEb >= baseEbitdaSum ? 'text-success fw-semibold' : 'text-danger');
          matHtml += '<td class="' + cellCls + '">' + fmtBil(mEb) + '</td>';
        });
        matHtml += '</tr>';
      });
      matHtml += '</tbody>';
      document.getElementById('sensitivityMatrixTable').innerHTML = matHtml;
    }

    // -------------------------------------------------------------------------
    // 4. RENDER COST CENTERS TABLE
    // -------------------------------------------------------------------------
    function renderCostCentersTable(selectedBu) {
      var list = (APP_STATE.costCenters || []).filter(function(c) {
        return selectedBu === 'ALL' ? true : c.buCode === selectedBu;
      });
      var html = '';
      list.forEach(function(c) {
        var badge = '<span class="badge badge-soft-success">AN TOÀN</span>';
        if (c.usedPct > 100) badge = '<span class="badge badge-soft-danger">VƯỢT NGÂN SÁCH</span>';
        else if (c.usedPct >= 85) badge = '<span class="badge badge-soft-warning">CẢNH BÁO CAO</span>';

        html += '<tr>'
          + '<td class="fw-bold text-primary">' + c.ccCode + '</td>'
          + '<td class="fw-semibold">' + c.ccName + '</td>'
          + '<td><span class="badge bg-dark">' + c.buCode + '</span></td>'
          + '<td>' + c.ccType + '</td>'
          + '<td>' + c.allocDriver + '</td>'
          + '<td class="text-end fw-semibold">' + fmtVnd(c.approvedBudget) + '</td>'
          + '<td class="text-end text-danger">' + fmtVnd(c.actualSpend) + '</td>'
          + '<td class="text-end text-warning fw-semibold">' + fmtVnd(c.committedPo) + '</td>'
          + '<td class="text-end fw-bold">' + fmtVnd(c.totalUsed) + '</td>'
          + '<td class="text-end fw-bold ' + (c.availableBudget >= 0 ? 'text-success' : 'text-danger') + '">' + fmtVnd(c.availableBudget) + '</td>'
          + '<td class="text-end fw-bold">' + c.usedPct + '%</td>'
          + '<td class="text-center">' + badge + '</td>'
          + '<td>' + c.owner + '</td>'
          + '<td class="text-center">'
          + '  <button class="btn btn-outline-primary btn-sm py-0 px-2 me-1" onclick="editCostCenterRow(\'' + c.ccCode + '\')"><i class="bi bi-pencil"></i></button>'
          + '  <button class="btn btn-outline-danger btn-sm py-0 px-2" onclick="deleteEntItem(\'CC\', \'' + c.ccCode + '\')"><i class="bi bi-trash"></i></button>'
          + '</td>'
          + '</tr>';
      });
      document.getElementById('costCenterTableBody').innerHTML = html || '<tr><td colspan="14" class="text-center py-3">Chưa có Trung tâm chi phí</td></tr>';
    }

    // -------------------------------------------------------------------------
    // 5. RENDER CAPEX PORTFOLIO & INTERCOMPANY TABLES
    // -------------------------------------------------------------------------
    function renderCapexAndIcTables(selectedBu, waccPct) {
      var capexList = (APP_STATE.capexProjects || []).filter(function(p) {
        return selectedBu === 'ALL' ? true : p.buCode === selectedBu;
      });
      var cxHtml = '';
      capexList.forEach(function(p) {
        var stBadge = '<span class="badge badge-soft-info">CHỜ HĐ ĐẦU TƯ</span>';
        if (p.approvalStatus === 'DA_PHE_DUYET') stBadge = '<span class="badge badge-soft-success">ĐÃ PHÊ DUYỆT</span>';
        else if (p.approvalStatus === 'CAN_CAU_TRUC_LAI') stBadge = '<span class="badge badge-soft-danger">CẦN CẤU TRÚC LẠI</span>';

        cxHtml += '<tr>'
          + '<td class="fw-bold text-primary">' + p.projectCode + '</td>'
          + '<td class="fw-semibold">' + p.projectName + '</td>'
          + '<td><span class="badge bg-dark">' + p.buCode + '</span></td>'
          + '<td>' + p.category + '</td>'
          + '<td class="text-end fw-bold text-danger">' + fmtVnd(p.initialCapex) + '</td>'
          + '<td class="text-end">' + fmtBil(p.cfYear1) + '</td>'
          + '<td class="text-end">' + fmtBil(p.cfYear2) + '</td>'
          + '<td class="text-end">' + fmtBil(p.cfYear3) + '</td>'
          + '<td class="text-end">' + fmtBil(p.cfYear4) + '</td>'
          + '<td class="text-end">' + fmtBil(p.cfYear5) + '</td>'
          + '<td class="text-end fw-bold ' + (p.npv >= 0 ? 'text-success' : 'text-danger') + '">' + fmtVnd(p.npv) + '</td>'
          + '<td class="text-end fw-bold ' + (p.irrPct >= waccPct ? 'text-success' : 'text-danger') + '">' + p.irrPct + '%</td>'
          + '<td class="text-end">' + p.paybackYears + ' năm</td>'
          + '<td class="text-center">' + stBadge + '</td>'
          + '<td class="text-center">'
          + '  <button class="btn btn-outline-success btn-sm py-0 px-2 me-1" onclick="editCapexRow(\'' + p.projectCode + '\')"><i class="bi bi-pencil"></i></button>'
          + '  <button class="btn btn-outline-danger btn-sm py-0 px-2" onclick="deleteEntItem(\'CAPEX\', \'' + p.projectCode + '\')"><i class="bi bi-trash"></i></button>'
          + '</td>'
          + '</tr>';
      });
      document.getElementById('capexTableBody').innerHTML = cxHtml || '<tr><td colspan="15" class="text-center py-3">Chưa có dự án CAPEX</td></tr>';

      // Intercompany Table
      var icList = (APP_STATE.intercompany || []).filter(function(ic) {
        return selectedBu === 'ALL' ? true : (ic.sellerBu === selectedBu || ic.buyerBu === selectedBu);
      });
      var icHtml = '';
      icList.forEach(function(ic) {
        var elimBadge = ic.diffAmount === 0
          ? '<span class="badge badge-soft-success">ĐÃ LOẠI TRỪ HỢP NHẤT</span>'
          : '<span class="badge badge-soft-danger">LỆCH ĐỐI CHIẾU</span>';

        icHtml += '<tr>'
          + '<td class="fw-bold text-primary">' + ic.icCode + '</td>'
          + '<td>' + ic.date + '</td>'
          + '<td><span class="badge bg-primary">' + ic.sellerBu + '</span></td>'
          + '<td><span class="badge bg-info text-dark">' + ic.buyerBu + '</span></td>'
          + '<td>' + ic.txType + '</td>'
          + '<td>' + ic.description + '</td>'
          + '<td class="text-end fw-semibold">' + fmtVnd(ic.sellerAmount) + '</td>'
          + '<td class="text-end fw-semibold">' + fmtVnd(ic.buyerAmount) + '</td>'
          + '<td class="text-end fw-bold ' + (ic.diffAmount === 0 ? 'text-success' : 'text-danger') + '">' + fmtVnd(ic.diffAmount) + '</td>'
          + '<td class="text-center">' + elimBadge + '</td>'
          + '<td>' + ic.controller + '</td>'
          + '<td class="text-center">'
          + '  <button class="btn btn-outline-warning btn-sm py-0 px-2 me-1 text-dark" onclick="editIcRow(\'' + ic.icCode + '\')"><i class="bi bi-pencil"></i></button>'
          + '  <button class="btn btn-outline-danger btn-sm py-0 px-2" onclick="deleteEntItem(\'IC\', \'' + ic.icCode + '\')"><i class="bi bi-trash"></i></button>'
          + '</td>'
          + '</tr>';
      });
      document.getElementById('icTableBody').innerHTML = icHtml || '<tr><td colspan="12" class="text-center py-3">Chưa có bút toán nội bộ</td></tr>';
    }

    // -------------------------------------------------------------------------
    // 6. RENDER SETTINGS, RBAC USERS & AUDIT LOGS
    // -------------------------------------------------------------------------
    function renderSettingsAndUsers() {
      var cfg = APP_STATE.config || {};
      document.getElementById('cfgHoldingName').value = cfg.HOLDING_NAME || '';
      document.getElementById('cfgFiscalYear').value = cfg.FISCAL_YEAR || '2026';
      document.getElementById('cfgReportingPeriod').value = cfg.REPORTING_PERIOD || '2026-11';
      document.getElementById('cfgWaccPct').value = cfg.WACC_PCT || '11.5';
      document.getElementById('cfgCitTaxPct').value = cfg.CIT_TAX_RATE_PCT || '20';
      document.getElementById('cfgHurdleIrrPct').value = cfg.HURDLE_RATE_IRR_PCT || '15.0';
      document.getElementById('cfgMaxPayback').value = cfg.MAX_PAYBACK_YEARS || '4.0';
      document.getElementById('cfgCcAlertPct').value = cfg.CC_ALERT_THRESHOLD_PCT || '85';
      document.getElementById('cfgUsdVndRate').value = cfg.USD_VND_RATE || '25450';
      document.getElementById('cfgTargetEbitdaPct').value = cfg.TARGET_GROUP_EBITDA_MARGIN_PCT || '24.0';
      document.getElementById('cfgTargetRoicPct').value = cfg.TARGET_GROUP_ROIC_PCT || '18.5';

      var uHtml = '';
      (APP_STATE.users || []).forEach(function(u) {
        uHtml += '<tr>'
          + '<td class="fw-bold text-primary">' + u.username + '</td>'
          + '<td><code>' + u.password + '</code></td>'
          + '<td class="fw-semibold">' + u.fullName + '</td>'
          + '<td><span class="badge bg-dark">' + u.role + '</span></td>'
          + '<td>' + u.buCode + '</td>'
          + '<td>' + u.scope + '</td>'
          + '<td><span class="badge ' + (u.status === 'HOAT_DONG' ? 'badge-soft-success' : 'badge-soft-danger') + '">' + u.status + '</span></td>'
          + '<td class="text-center"><button class="btn btn-outline-primary btn-sm py-0 px-2" onclick="editUserRow(\'' + u.username + '\')"><i class="bi bi-pencil"></i></button></td>'
          + '</tr>';
      });
      document.getElementById('userTableBody').innerHTML = uHtml;

      var logHtml = '';
      (APP_STATE.auditLogs || []).forEach(function(l) {
        logHtml += '<tr>'
          + '<td class="text-secondary">' + l.timestamp + '</td>'
          + '<td class="fw-semibold">' + l.user + '</td>'
          + '<td><span class="badge bg-light text-dark border">' + l.role + '</span></td>'
          + '<td class="fw-bold text-primary">' + l.action + '</td>'
          + '<td>' + l.target + '</td>'
          + '<td class="text-wrap">' + l.detail + '</td>'
          + '</tr>';
      });
      document.getElementById('auditLogTableBody').innerHTML = logHtml || '<tr><td colspan="6" class="text-center py-2">Chưa có nhật ký</td></tr>';
    }

    // -------------------------------------------------------------------------
    // 7. RENDER BEGINNER GUIDE (HUONG_DAN_SU_DUNG)
    // -------------------------------------------------------------------------
    function renderGuideCards() {
      var kw = (document.getElementById('guideSearchInput').value || '').trim().toLowerCase();
      var list = (APP_STATE.guides || []).filter(function(g) {
        if (!kw) return true;
        var blob = (g.group + ' ' + g.term + ' ' + g.plainMeaning + ' ' + g.formulaBenchmark + ' ' + g.example).toLowerCase();
        return blob.indexOf(kw) !== -1;
      });

      var html = '';
      list.forEach(function(g) {
        html += '<div class="col-lg-6">'
          + '  <div class="guide-box h-100">'
          + '    <div class="small fw-bold text-primary text-uppercase mb-1">' + g.group + '</div>'
          + '    <h6 class="fw-bold text-dark mb-2">' + g.term + '</h6>'
          + '    <p class="small mb-2"><strong>💡 Giải thích dễ hiểu:</strong> ' + g.plainMeaning + '</p>'
          + '    <div class="p-2 rounded bg-white border small mb-2"><strong>📐 Công thức & Chuẩn Tập đoàn:</strong> <code>' + g.formulaBenchmark + '</code></div>'
          + '    <div class="small text-secondary"><strong>📌 Ví dụ thực tế:</strong> ' + g.example + '</div>'
          + '  </div>'
          + '</div>';
      });
      document.getElementById('guideCardsContainer').innerHTML = html || '<div class="col-12 text-center py-4 text-secondary">Không tìm thấy thuật ngữ phù hợp.</div>';
    }

    // =========================================================================
    // CRUD MODAL HANDLERS & SERVER RPC CALLS
    // =========================================================================
    function getActorMeta() {
      return {
        actorUser: (APP_STATE.currentUser && APP_STATE.currentUser.username) || 'group_cfo',
        actorRole: (APP_STATE.currentUser && APP_STATE.currentUser.role) || 'GROUP_CFO'
      };
    }

    // --- 1. BU CRUD ---
    function openBuModal() {
      document.getElementById('buFormCode').value = 'BU-0' + ((APP_STATE.businessUnits || []).length + 1);
      document.getElementById('buFormName').value = '';
      document.getElementById('buFormSector').value = '';
      document.getElementById('buFormDirector').value = '';
      document.getElementById('buFormHc').value = 100;
      document.getElementById('buFormExtRev').value = 35000000000;
      document.getElementById('buFormIcRev').value = 1500000000;
      document.getElementById('buFormCogs').value = 18000000000;
      document.getElementById('buFormDirectOpex').value = 7500000000;
      document.getElementById('buFormHqAlloc').value = 1200000000;
      document.getElementById('buFormDa').value = 1500000000;
      document.getElementById('buFormInvCap').value = 45000000000;
      new bootstrap.Modal(document.getElementById('modalBu')).show();
    }

    function editBuRow(buCode) {
      var b = (APP_STATE.businessUnits || []).find(function(x) { return x.buCode === buCode; });
      if (!b) return;
      document.getElementById('buFormCode').value = b.buCode;
      document.getElementById('buFormName').value = b.buName;
      document.getElementById('buFormSector').value = b.sector;
      document.getElementById('buFormDirector').value = b.director;
      document.getElementById('buFormHc').value = b.headcount;
      document.getElementById('buFormExtRev').value = b.extRevenue;
      document.getElementById('buFormIcRev').value = b.icRevenue;
      document.getElementById('buFormCogs').value = b.cogs;
      document.getElementById('buFormDirectOpex').value = b.directOpex;
      document.getElementById('buFormHqAlloc').value = b.hqAlloc;
      document.getElementById('buFormDa').value = b.da;
      document.getElementById('buFormInvCap').value = b.investedCap;
      new bootstrap.Modal(document.getElementById('modalBu')).show();
    }

    function submitBuForm() {
      var meta = getActorMeta();
      var payload = {
        buCode: document.getElementById('buFormCode').value,
        buName: document.getElementById('buFormName').value,
        sector: document.getElementById('buFormSector').value,
        director: document.getElementById('buFormDirector').value,
        headcount: document.getElementById('buFormHc').value,
        extRevenue: document.getElementById('buFormExtRev').value,
        icRevenue: document.getElementById('buFormIcRev').value,
        cogs: document.getElementById('buFormCogs').value,
        directOpex: document.getElementById('buFormDirectOpex').value,
        hqAlloc: document.getElementById('buFormHqAlloc').value,
        da: document.getElementById('buFormDa').value,
        investedCap: document.getElementById('buFormInvCap').value,
        actorUser: meta.actorUser,
        actorRole: meta.actorRole
      };
      bootstrap.Modal.getInstance(document.getElementById('modalBu')).hide();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang lưu Đơn vị Kinh doanh (BU) & tính lại ROIC/EVA trên Google Sheets...');
        google.script.run
          .withSuccessHandler(function(res) { hideLoading(); hydrateState(res); })
          .withFailureHandler(function(err) { hideLoading(); alert('Lỗi: ' + err.message); })
          .saveEntBusinessUnit(payload);
      }
    }

    function triggerHqCostAllocation() {
      var driverMode = document.getElementById('hqAllocDriverSelect').value || 'REVENUE';
      var meta = getActorMeta();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang tự động phân bổ Chi phí Dịch vụ chung Tập đoàn (HQ) xuống các BU theo ' + driverMode + '...');
        google.script.run
          .withSuccessHandler(function(res) { hideLoading(); hydrateState(res); })
          .withFailureHandler(function(err) { hideLoading(); alert('Lỗi: ' + err.message); })
          .runEntHqCostAllocation({ driverMode: driverMode, actorUser: meta.actorUser, actorRole: meta.actorRole });
      }
    }

    // --- 2. SCENARIO CRUD ---
    function openScenarioModal() {
      var curScen = document.getElementById('globalScenarioFilter').value || 'BASE';
      document.getElementById('scenFormRowId').value = '';
      document.getElementById('scenFormCode').value = curScen;
      document.getElementById('scenFormMonth').value = '2026-06';
      document.getElementById('scenFormRev').value = 58000000000;
      document.getElementById('scenFormCogs').value = 31500000000;
      document.getElementById('scenFormOpex').value = 12400000000;
      document.getElementById('scenFormCapex').value = 4200000000;
      document.getElementById('scenFormNwc').value = 950000000;
      document.getElementById('scenFormCash').value = 115000000000;
      document.getElementById('scenFormNote').value = 'Cập nhật dự phóng kịch bản từ Web App';
      new bootstrap.Modal(document.getElementById('modalScenario')).show();
    }

    function editScenarioRow(rowId) {
      var r = (APP_STATE.scenarios || []).find(function(x) { return x.rowId === rowId; });
      if (!r) return;
      document.getElementById('scenFormRowId').value = r.rowId;
      document.getElementById('scenFormCode').value = r.scenarioCode;
      document.getElementById('scenFormMonth').value = r.month;
      document.getElementById('scenFormRev').value = r.consolidatedRev;
      document.getElementById('scenFormCogs').value = r.cogs;
      document.getElementById('scenFormOpex').value = r.groupOpex;
      document.getElementById('scenFormCapex').value = r.capexOutflow;
      document.getElementById('scenFormNwc').value = r.nwcDelta;
      document.getElementById('scenFormCash').value = r.cashBalance;
      document.getElementById('scenFormNote').value = r.note;
      new bootstrap.Modal(document.getElementById('modalScenario')).show();
    }

    function submitScenarioForm() {
      var meta = getActorMeta();
      var payload = {
        rowId: document.getElementById('scenFormRowId').value,
        scenarioCode: document.getElementById('scenFormCode').value,
        month: document.getElementById('scenFormMonth').value,
        consolidatedRev: document.getElementById('scenFormRev').value,
        cogs: document.getElementById('scenFormCogs').value,
        groupOpex: document.getElementById('scenFormOpex').value,
        capexOutflow: document.getElementById('scenFormCapex').value,
        nwcDelta: document.getElementById('scenFormNwc').value,
        cashBalance: document.getElementById('scenFormCash').value,
        note: document.getElementById('scenFormNote').value,
        actorUser: meta.actorUser,
        actorRole: meta.actorRole
      };
      bootstrap.Modal.getInstance(document.getElementById('modalScenario')).hide();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang lưu dự phóng kịch bản xuống Sheet KICH_BAN_DU_PHONG_12T...');
        google.script.run
          .withSuccessHandler(function(res) { hideLoading(); hydrateState(res); })
          .withFailureHandler(function(err) { hideLoading(); alert('Lỗi: ' + err.message); })
          .saveEntScenarioMonth(payload);
      }
    }

    // --- 3. COST CENTER CRUD ---
    function openCostCenterModal() {
      document.getElementById('ccFormCode').value = 'CC-' + (101 + (APP_STATE.costCenters || []).length);
      document.getElementById('ccFormName').value = '';
      document.getElementById('ccFormBu').value = 'BU-01';
      document.getElementById('ccFormType').value = 'PROFIT_SUPPORT';
      document.getElementById('ccFormDriver').value = 'Tỷ trọng Doanh thu';
      document.getElementById('ccFormOwner').value = '';
      document.getElementById('ccFormBudget').value = 5000000000;
      document.getElementById('ccFormActual').value = 2800000000;
      document.getElementById('ccFormCommitted').value = 900000000;
      new bootstrap.Modal(document.getElementById('modalCostCenter')).show();
    }

    function editCostCenterRow(ccCode) {
      var c = (APP_STATE.costCenters || []).find(function(x) { return x.ccCode === ccCode; });
      if (!c) return;
      document.getElementById('ccFormCode').value = c.ccCode;
      document.getElementById('ccFormName').value = c.ccName;
      document.getElementById('ccFormBu').value = c.buCode;
      document.getElementById('ccFormType').value = c.ccType;
      document.getElementById('ccFormDriver').value = c.allocDriver;
      document.getElementById('ccFormOwner').value = c.owner;
      document.getElementById('ccFormBudget').value = c.approvedBudget;
      document.getElementById('ccFormActual').value = c.actualSpend;
      document.getElementById('ccFormCommitted').value = c.committedPo;
      new bootstrap.Modal(document.getElementById('modalCostCenter')).show();
    }

    function submitCostCenterForm() {
      var meta = getActorMeta();
      var payload = {
        ccCode: document.getElementById('ccFormCode').value,
        ccName: document.getElementById('ccFormName').value,
        buCode: document.getElementById('ccFormBu').value,
        ccType: document.getElementById('ccFormType').value,
        allocDriver: document.getElementById('ccFormDriver').value,
        owner: document.getElementById('ccFormOwner').value,
        approvedBudget: document.getElementById('ccFormBudget').value,
        actualSpend: document.getElementById('ccFormActual').value,
        committedPo: document.getElementById('ccFormCommitted').value,
        actorUser: meta.actorUser,
        actorRole: meta.actorRole
      };
      bootstrap.Modal.getInstance(document.getElementById('modalCostCenter')).hide();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang lưu ngân sách Trung tâm chi phí xuống Sheet TRUNG_TAM_CHI_PHI_CC...');
        google.script.run
          .withSuccessHandler(function(res) { hideLoading(); hydrateState(res); })
          .withFailureHandler(function(err) { hideLoading(); alert('Lỗi: ' + err.message); })
          .saveEntCostCenter(payload);
      }
    }

    // --- 4. CAPEX CRUD ---
    function openCapexModal() {
      document.getElementById('capexFormCode').value = 'CAPEX-2026-0' + ((APP_STATE.capexProjects || []).length + 1);
      document.getElementById('capexFormName').value = '';
      document.getElementById('capexFormBu').value = 'BU-01';
      document.getElementById('capexFormCategory').value = 'Mở Rộng Sản Xuất';
      document.getElementById('capexFormInit').value = 30000000000;
      document.getElementById('capexFormStatus').value = 'CHO_HD_DAU_TU';
      document.getElementById('capexFormCf1').value = 8500000000;
      document.getElementById('capexFormCf2').value = 11200000000;
      document.getElementById('capexFormCf3').value = 13500000000;
      document.getElementById('capexFormCf4').value = 15000000000;
      document.getElementById('capexFormCf5').value = 16500000000;
      new bootstrap.Modal(document.getElementById('modalCapex')).show();
    }

    function editCapexRow(pCode) {
      var p = (APP_STATE.capexProjects || []).find(function(x) { return x.projectCode === pCode; });
      if (!p) return;
      document.getElementById('capexFormCode').value = p.projectCode;
      document.getElementById('capexFormName').value = p.projectName;
      document.getElementById('capexFormBu').value = p.buCode;
      document.getElementById('capexFormCategory').value = p.category;
      document.getElementById('capexFormInit').value = p.initialCapex;
      document.getElementById('capexFormStatus').value = p.approvalStatus;
      document.getElementById('capexFormCf1').value = p.cfYear1;
      document.getElementById('capexFormCf2').value = p.cfYear2;
      document.getElementById('capexFormCf3').value = p.cfYear3;
      document.getElementById('capexFormCf4').value = p.cfYear4;
      document.getElementById('capexFormCf5').value = p.cfYear5;
      new bootstrap.Modal(document.getElementById('modalCapex')).show();
    }

    function submitCapexForm() {
      var meta = getActorMeta();
      var payload = {
        projectCode: document.getElementById('capexFormCode').value,
        projectName: document.getElementById('capexFormName').value,
        buCode: document.getElementById('capexFormBu').value,
        category: document.getElementById('capexFormCategory').value,
        initialCapex: document.getElementById('capexFormInit').value,
        approvalStatus: document.getElementById('capexFormStatus').value,
        cfYear1: document.getElementById('capexFormCf1').value,
        cfYear2: document.getElementById('capexFormCf2').value,
        cfYear3: document.getElementById('capexFormCf3').value,
        cfYear4: document.getElementById('capexFormCf4').value,
        cfYear5: document.getElementById('capexFormCf5').value,
        actorUser: meta.actorUser,
        actorRole: meta.actorRole
      };
      bootstrap.Modal.getInstance(document.getElementById('modalCapex')).hide();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang tính toán NPV, IRR, Payback & lưu xuống Sheet DANH_MUC_DAU_TU_CAPEX...');
        google.script.run
          .withSuccessHandler(function(res) { hideLoading(); hydrateState(res); })
          .withFailureHandler(function(err) { hideLoading(); alert('Lỗi: ' + err.message); })
          .saveEntCapexProject(payload);
      }
    }

    // --- 5. INTERCOMPANY CRUD ---
    function openIcModal() {
      document.getElementById('icFormCode').value = 'IC-2026-00' + ((APP_STATE.intercompany || []).length + 1);
      document.getElementById('icFormDate').value = new Date().toISOString().slice(0, 10);
      document.getElementById('icFormType').value = 'DICH_VU_CONG_NGHE';
      document.getElementById('icFormSeller').value = 'BU-01';
      document.getElementById('icFormBuyer').value = 'BU-02';
      document.getElementById('icFormDesc').value = '';
      document.getElementById('icFormSellerAmt').value = 1500000000;
      document.getElementById('icFormBuyerAmt').value = 1500000000;
      document.getElementById('icFormController').value = 'Lê Hoàng Bách';
      new bootstrap.Modal(document.getElementById('modalIc')).show();
    }

    function editIcRow(icCode) {
      var ic = (APP_STATE.intercompany || []).find(function(x) { return x.icCode === icCode; });
      if (!ic) return;
      document.getElementById('icFormCode').value = ic.icCode;
      document.getElementById('icFormDate').value = ic.date;
      document.getElementById('icFormType').value = ic.txType;
      document.getElementById('icFormSeller').value = ic.sellerBu;
      document.getElementById('icFormBuyer').value = ic.buyerBu;
      document.getElementById('icFormDesc').value = ic.description;
      document.getElementById('icFormSellerAmt').value = ic.sellerAmount;
      document.getElementById('icFormBuyerAmt').value = ic.buyerAmount;
      document.getElementById('icFormController').value = ic.controller;
      new bootstrap.Modal(document.getElementById('modalIc')).show();
    }

    function submitIcForm() {
      var meta = getActorMeta();
      var payload = {
        icCode: document.getElementById('icFormCode').value,
        date: document.getElementById('icFormDate').value,
        txType: document.getElementById('icFormType').value,
        sellerBu: document.getElementById('icFormSeller').value,
        buyerBu: document.getElementById('icFormBuyer').value,
        description: document.getElementById('icFormDesc').value,
        sellerAmount: document.getElementById('icFormSellerAmt').value,
        buyerAmount: document.getElementById('icFormBuyerAmt').value,
        controller: document.getElementById('icFormController').value,
        actorUser: meta.actorUser,
        actorRole: meta.actorRole
      };
      bootstrap.Modal.getInstance(document.getElementById('modalIc')).hide();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang đối chiếu & lưu Giao dịch nội bộ xuống Sheet GIAO_DICH_NOI_BO_IC...');
        google.script.run
          .withSuccessHandler(function(res) { hideLoading(); hydrateState(res); })
          .withFailureHandler(function(err) { hideLoading(); alert('Lỗi: ' + err.message); })
          .saveEntIntercompanyTx(payload);
      }
    }

    // --- 6. SETTINGS & RBAC USER CRUD ---
    function saveGroupSettingsForm() {
      var meta = getActorMeta();
      var cfgMap = {
        HOLDING_NAME: document.getElementById('cfgHoldingName').value,
        FISCAL_YEAR: document.getElementById('cfgFiscalYear').value,
        REPORTING_PERIOD: document.getElementById('cfgReportingPeriod').value,
        WACC_PCT: document.getElementById('cfgWaccPct').value,
        CIT_TAX_RATE_PCT: document.getElementById('cfgCitTaxPct').value,
        HURDLE_RATE_IRR_PCT: document.getElementById('cfgHurdleIrrPct').value,
        MAX_PAYBACK_YEARS: document.getElementById('cfgMaxPayback').value,
        CC_ALERT_THRESHOLD_PCT: document.getElementById('cfgCcAlertPct').value,
        USD_VND_RATE: document.getElementById('cfgUsdVndRate').value,
        TARGET_GROUP_EBITDA_MARGIN_PCT: document.getElementById('cfgTargetEbitdaPct').value,
        TARGET_GROUP_ROIC_PCT: document.getElementById('cfgTargetRoicPct').value
      };
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang lưu tham số cấu hình Tập đoàn xuống Sheet CAU_HINH...');
        google.script.run
          .withSuccessHandler(function(res) { hideLoading(); hydrateState(res); })
          .withFailureHandler(function(err) { hideLoading(); alert('Lỗi: ' + err.message); })
          .saveEntSettings({ config: cfgMap, actorUser: meta.actorUser, actorRole: meta.actorRole });
      }
    }

    function openUserModal() {
      document.getElementById('userFormUsername').value = '';
      document.getElementById('userFormPassword').value = '123456';
      document.getElementById('userFormFullName').value = '';
      document.getElementById('userFormRole').value = 'BU_DIRECTOR';
      document.getElementById('userFormBu').value = 'BU-01';
      document.getElementById('userFormEmail').value = '';
      document.getElementById('userFormStatus').value = 'HOAT_DONG';
      new bootstrap.Modal(document.getElementById('modalUser')).show();
    }

    function editUserRow(uname) {
      var u = (APP_STATE.users || []).find(function(x) { return x.username === uname; });
      if (!u) return;
      document.getElementById('userFormUsername').value = u.username;
      document.getElementById('userFormPassword').value = u.password;
      document.getElementById('userFormFullName').value = u.fullName;
      document.getElementById('userFormRole').value = u.role;
      document.getElementById('userFormBu').value = u.buCode;
      document.getElementById('userFormEmail').value = u.email;
      document.getElementById('userFormStatus').value = u.status;
      new bootstrap.Modal(document.getElementById('modalUser')).show();
    }

    function submitUserForm() {
      var meta = getActorMeta();
      var payload = {
        username: document.getElementById('userFormUsername').value,
        password: document.getElementById('userFormPassword').value,
        fullName: document.getElementById('userFormFullName').value,
        role: document.getElementById('userFormRole').value,
        buCode: document.getElementById('userFormBu').value,
        email: document.getElementById('userFormEmail').value,
        scope: document.getElementById('userFormBu').value === 'ALL_GROUP' ? 'ALL_GROUP' : 'BU_ONLY',
        status: document.getElementById('userFormStatus').value,
        actorUser: meta.actorUser,
        actorRole: meta.actorRole
      };
      bootstrap.Modal.getInstance(document.getElementById('modalUser')).hide();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang cập nhật tài khoản & mật khẩu xuống Sheet PHAN_QUYEN...');
        google.script.run
          .withSuccessHandler(function(res) { hideLoading(); hydrateState(res); })
          .withFailureHandler(function(err) { hideLoading(); alert('Lỗi: ' + err.message); })
          .saveEntUserAccount(payload);
      }
    }

    // --- 7. GENERIC DELETE ---
    function deleteEntItem(recordType, recordId) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi ' + recordId + ' khỏi Google Sheets?')) return;
      var meta = getActorMeta();
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        showLoading('Đang xóa bản ghi ' + recordId + ' trên Google Sheets...');
        google.script.run
          .withSuccessHandler(function(res) { hideLoading(); hydrateState(res); })
          .withFailureHandler(function(err) { hideLoading(); alert('Lỗi: ' + err.message); })
          .deleteEntRecord({ recordType: recordType, recordId: recordId, actorUser: meta.actorUser, actorRole: meta.actorRole });
      }
    }

    // INITIALIZE ON LOAD
    window.addEventListener('DOMContentLoaded', function() {
      hydrateState(RAW_SERVER_PAYLOAD);
      syncAuthUsersFromSheet(false);
    });
  </script>
</body>
</html>


```