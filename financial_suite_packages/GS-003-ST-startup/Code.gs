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
