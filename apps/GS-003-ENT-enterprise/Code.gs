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
