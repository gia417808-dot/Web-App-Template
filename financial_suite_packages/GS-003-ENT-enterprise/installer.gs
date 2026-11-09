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
