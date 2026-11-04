/**
 * ============================================================================
 * GS-003: WEBAPP QUẢN LÝ THU CHI, SỔ QUỸ & DÒNG TIỀN (V4.1 COMMERCIAL PRO)
 * BACKEND CONTROLLER, RBAC AUTH, FUND CRUD, VOUCHERS & AUDIT API (CODE.GS)
 * Archetype: Finance & Cashflow (Golden Master v3.0)
 * ============================================================================
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Quản Lý Thu Chi, Sổ Quỹ & Dòng Tiền v4.1 Pro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💰 QUẢN LÝ THU CHI & SỔ QUỸ PRO (v4.1)')
    .addItem('⚡ 1. Khởi tạo / Làm mới 6 Tab Chuẩn Thương Mại', 'install_FINANCE_SHEET')
    .addSeparator()
    .addItem('🌐 2. Mở Web App Quản Trị Tài Chính (Full Screen Modal)', 'openFinanceDialog')
    .addToUi();
}

function openFinanceDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1380)
    .setHeight(850)
    .setTitle('Hệ Thống Quản Lý Thu Chi, Sổ Quỹ Đa Tài Khoản & Dòng Tiền v4.1 (Commercial Pro)');
  SpreadsheetApp.getUi().showModalDialog(html, '💰 Web App Quản Lý Thu Chi & Sổ Quỹ v4.1 Pro');
}

function openFinanceWebApp() {
  openFinanceDialog();
}

function normalizeDateStr(rawVal, dispVal) {
  if (rawVal && Object.prototype.toString.call(rawVal) === '[object Date]' && !isNaN(rawVal.getTime())) {
    return Utilities.formatDate(rawVal, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
  }
  const str = String(dispVal || rawVal || '').trim();
  if (!str) return Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str;
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(.*)$/);
  if (slashMatch) {
    const p1 = parseInt(slashMatch[1], 10);
    const p2 = parseInt(slashMatch[2], 10);
    const yr = slashMatch[3];
    const timePart = (slashMatch[4] || ' 09:00').trim();
    // In en_US locale p1 is month, p2 is day; if p1 > 12 then p1 is day
    const mm = String(p1 <= 12 ? p1 : p2).padStart(2, '0');
    const dd = String(p1 <= 12 ? p2 : p1).padStart(2, '0');
    return yr + '-' + mm + '-' + dd + (timePart ? ' ' + timePart : '');
  }
  return str;
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

function getDefaultUsersList() {
  return [
    { username: 'admin', password: '123456', fullName: 'Nguyễn Minh Tuấn', role: 'ADMIN', assignedFund: 'ALL', permissionsDesc: 'Giám đốc tài chính (Toàn quyền hệ thống)', status: 'Hoạt động' },
    { username: 'ketoan', password: '123456', fullName: 'Hoàng Thu Trang', role: 'ACCOUNTANT', assignedFund: 'ALL', permissionsDesc: 'Kế toán tổng hợp (Toàn bộ các quỹ, Lập phiếu, Báo cáo)', status: 'Hoạt động' },
    { username: 'thuquy_tm', password: '123456', fullName: 'Phạm Thị Mai', role: 'CASHIER', assignedFund: 'Quỹ Tiền Mặt Văn Phòng', permissionsDesc: 'Thủ quỹ văn phòng (Chỉ phụ trách Quỹ Tiền Mặt Văn Phòng)', status: 'Hoạt động' },
    { username: 'thuquy_vcb', password: '123456', fullName: 'Lê Hoàng Nam', role: 'CASHIER', assignedFund: 'Vietcombank Doanh Nghiệp', permissionsDesc: 'Kế toán thanh toán NH (Chỉ phụ trách Vietcombank Doanh Nghiệp)', status: 'Hoạt động' }
  ];
}

function getFinanceData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tkSheet = ss.getSheetByName('TAI_KHOAN');
    const sqSheet = ss.getSheetByName('SO_QUY');
    const pqSheet = ss.getSheetByName('PHAN_QUYEN');
    const chSheet = ss.getSheetByName('CAU_HINH');
    const nkSheet = ss.getSheetByName('NHAT_KY');

    if (!tkSheet || !sqSheet) {
      return getFallbackFinanceData();
    }

    const settings = {
      COMPANY_NAME: 'CÔNG TY TNHH CÔNG NGHỆ & THIẾT BỊ NEXSIMPLE VIỆT NAM',
      COMPANY_ADDRESS: 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM',
      COMPANY_PHONE: '0974 755 104',
      COMPANY_TAX: '0318899221',
      MONTHLY_BURN_LIMIT: '80000000',
      ALLOW_OVERDRAFT: 'FALSE',
      PRINT_TEMPLATE_STANDARD: 'Mẫu số 01-TT / 02-TT (Ban hành theo Thông tư 200/2014/TT-BTC của Bộ Tài Chính)'
    };
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
          role: String(r[3] || '').trim() || 'CASHIER',
          assignedFund: String(r[4] || '').trim() || 'ALL',
          permissionsDesc: String(r[5] || '').trim(),
          status: String(r[6] || '').trim() || 'Hoạt động'
        });
      }
    }
    if (users.length === 0) {
      const defUsers = getDefaultUsersList();
      for (let u = 0; u < defUsers.length; u++) users.push(defUsers[u]);
    }

    const sqRaw = sqSheet.getDataRange().getValues();
    const sqDisp = sqSheet.getDataRange().getDisplayValues();
    const transactions = [];
    if (sqDisp.length > 2) {
      for (let i = 2; i < sqDisp.length; i++) {
        const dRow = sqDisp[i];
        const rRow = sqRaw[i] || dRow;
        const code = String(dRow[0] || '').trim();
        if (!code) continue;

        const is13Cols = dRow.length >= 13;
        const rawType = String(dRow[2] || 'Phiếu Thu').trim();
        const normType = (rawType === 'Thu' || rawType === 'Phiếu Thu')
          ? 'Phiếu Thu'
          : ((rawType === 'Chi' || rawType === 'Phiếu Chi') ? 'Phiếu Chi' : 'Chuyển quỹ');

        transactions.push({
          code: code,
          date: normalizeDateStr(rRow[1], dRow[1]),
          type: normType,
          category: String(dRow[3] || 'Hạng mục chung').trim(),
          amountVnd: parseCurrency(rRow[4], dRow[4]),
          accountName: String(dRow[5] || 'Vietcombank Doanh Nghiệp').trim(),
          toAccountName: is13Cols ? String(dRow[6] || '---').trim() : '---',
          partner: is13Cols ? String(dRow[7] || 'Đối tác kinh doanh').trim() : String(dRow[6] || 'Đối tác').trim(),
          projectName: is13Cols ? String(dRow[8] || 'Vận hành chung').trim() : String(dRow[6] || 'Vận hành chung').trim(),
          paymentStatus: is13Cols ? String(dRow[9] || 'Đã tất toán').trim() : 'Đã tất toán',
          method: is13Cols ? String(dRow[10] || 'Chuyển khoản VietQR').trim() : String(dRow[9] || 'Chuyển khoản').trim(),
          createdBy: is13Cols ? String(dRow[11] || 'Kế toán').trim() : String(dRow[7] || 'Kế toán').trim(),
          notes: is13Cols ? String(dRow[12] || '').trim() : String(dRow[10] || '').trim()
        });
      }
    }

    const tkRaw = tkSheet.getDataRange().getValues();
    const tkDisp = tkSheet.getDataRange().getDisplayValues();
    const accounts = [];
    if (tkDisp.length > 2) {
      for (let i = 2; i < tkDisp.length; i++) {
        const dRow = tkDisp[i];
        const rRow = tkRaw[i] || dRow;
        const id = String(dRow[0] || '').trim();
        if (!id) continue;

        const is10Cols = dRow.length >= 10;
        const bankName = String(dRow[1] || '').trim();
        const openingBal = is10Cols ? parseCurrency(rRow[5], dRow[5]) : parseCurrency(rRow[4], dRow[4]);

        let calcIn = 0;
        let calcOut = 0;
        for (let t = 0; t < transactions.length; t++) {
          const tx = transactions[t];
          if (tx.type === 'Phiếu Thu' && tx.accountName === bankName) {
            calcIn += tx.amountVnd;
          } else if (tx.type === 'Phiếu Chi' && tx.accountName === bankName) {
            calcOut += tx.amountVnd;
          } else if (tx.type === 'Chuyển quỹ') {
            if (tx.accountName === bankName) calcOut += tx.amountVnd;
            if (tx.toAccountName === bankName) calcIn += tx.amountVnd;
          }
        }

        const currentBal = openingBal + calcIn - calcOut;

        accounts.push({
          id: id,
          bankName: bankName,
          accountNumber: String(dRow[2] || '').trim(),
          holderName: String(dRow[3] || '').trim(),
          accountType: is10Cols ? String(dRow[4] || 'Ngân hàng').trim() : String(dRow[6] || 'Ngân hàng').trim(),
          initialBalance: openingBal,
          totalIn: calcIn,
          totalOut: calcOut,
          balanceVnd: currentBal,
          notes: is10Cols ? String(dRow[9] || '').trim() : String(dRow[7] || '').trim()
        });
      }
    }

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

    return buildFinanceResponse(accounts, transactions, settings, users, auditLogs.reverse(), false);
  } catch (err) {
    return getFallbackFinanceData();
  }
}

function buildFinanceResponse(accounts, transactions, settings, users, auditLogs, isFallback) {
  let totalBalance = 0;
  let totalThu = 0;
  let totalChi = 0;
  let receivableTotal = 0;
  let payableTotal = 0;

  for (let i = 0; i < accounts.length; i++) {
    totalBalance += Number(accounts[i].balanceVnd) || 0;
  }

  for (let j = 0; j < transactions.length; j++) {
    const tx = transactions[j];
    const amt = Number(tx.amountVnd) || 0;
    if (tx.type === 'Phiếu Thu') totalThu += amt;
    if (tx.type === 'Phiếu Chi') totalChi += amt;
    if (tx.paymentStatus === 'Công nợ Phải thu') receivableTotal += amt;
    if (tx.paymentStatus === 'Công nợ Phải trả') payableTotal += amt;
  }

  const netCashflow = totalThu - totalChi;
  const burnRate = totalChi > 0 ? totalChi : (parseCurrency(settings.MONTHLY_BURN_LIMIT, settings.MONTHLY_BURN_LIMIT) || 80000000);
  const runwayMonths = burnRate > 0 ? (totalBalance / burnRate).toFixed(1) : '36.0';

  return {
    success: true,
    isFallback: Boolean(isFallback),
    settings: settings,
    users: users,
    accounts: accounts,
    transactions: transactions,
    auditLogs: auditLogs,
    kpi: {
      totalBalance: totalBalance,
      totalThu: totalThu,
      totalChi: totalChi,
      netCashflow: netCashflow,
      receivableTotal: receivableTotal,
      payableTotal: payableTotal,
      burnRate: burnRate,
      runwayMonths: String(runwayMonths)
    }
  };
}

function saveFundAccount(payload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let tkSheet = ss.getSheetByName('TAI_KHOAN');
    if (!tkSheet) {
      install_FINANCE_SHEET();
      tkSheet = ss.getSheetByName('TAI_KHOAN');
    }

    const id = String(payload.id || '').trim().toUpperCase();
    const bankName = String(payload.bankName || '').trim();
    if (!id || !bankName) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Mã Quỹ/TK và Tên Ngân Hàng / Quỹ!' };
    }

    const accNo = String(payload.accountNumber || '').trim();
    const holder = String(payload.holderName || '').trim();
    const accType = String(payload.accountType || 'Ngân hàng').trim();
    const initBal = Number(payload.initialBalance) || 0;
    const notes = String(payload.notes || '').trim();

    const vals = tkSheet.getDataRange().getValues();
    const is10Cols = (vals.length >= 2 && vals[1].length >= 10);
    let existingRow = -1;

    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === id) {
        existingRow = i + 1;
        break;
      }
    }

    if (existingRow > 0) {
      if (is10Cols) {
        tkSheet.getRange(existingRow, 2, 1, 5).setValues([[bankName, accNo, holder, accType, initBal]]);
        tkSheet.getRange(existingRow, 10).setValue(notes);
      } else {
        tkSheet.getRange(existingRow, 2, 1, 4).setValues([[bankName, accNo, holder, initBal]]);
        tkSheet.getRange(existingRow, 7, 1, 2).setValues([[accType, notes]]);
      }
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT QUỸ/TK', id, 'Cập nhật quỹ ' + bankName + ' (Số dư đầu: ' + initBal + ')');
      return { success: true, message: 'Đã cập nhật quỹ/tài khoản [' + bankName + '] thành công!' };
    } else {
      const nextRow = tkSheet.getLastRow() + 1;
      if (is10Cols) {
        const newRow10 = [
          id, bankName, accNo, holder, accType, initBal,
          '=SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B' + nextRow + ', SO_QUY!C3:C, "Phiếu Thu") + SUMIFS(SO_QUY!E3:E, SO_QUY!G3:G, B' + nextRow + ', SO_QUY!C3:C, "Chuyển quỹ")',
          '=SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B' + nextRow + ', SO_QUY!C3:C, "Phiếu Chi") + SUMIFS(SO_QUY!E3:E, SO_QUY!F3:F, B' + nextRow + ', SO_QUY!C3:C, "Chuyển quỹ")',
          '=F' + nextRow + '+G' + nextRow + '-H' + nextRow,
          notes
        ];
        tkSheet.getRange(nextRow, 1, 1, 10).setValues([newRow10]);
        tkSheet.getRange(nextRow, 6, 1, 4).setNumberFormat('#,##0 "₫"');
      } else {
        tkSheet.appendRow([id, bankName, accNo, holder, initBal, initBal, accType, notes]);
      }
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'THÊM QUỸ/TK MỚI', id, 'Thêm mới quỹ ' + bankName + ' (' + accNo + ')');
      return { success: true, message: 'Đã thêm mới quỹ/tài khoản [' + bankName + '] vào Google Sheets!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu quỹ/tài khoản: ' + err.toString() };
  }
}

function submitFinanceTx(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tkSheet = ss.getSheetByName('TAI_KHOAN');
    const sqSheet = ss.getSheetByName('SO_QUY');

    if (!tkSheet || !sqSheet) {
      return { success: false, message: 'Chưa khởi tạo 6 Tab Trang tính! Vui lòng bấm menu Khởi tạo cấu trúc trước.' };
    }

    const amount = Number(data.amount) || 0;
    if (amount <= 0) {
      return { success: false, message: 'Số tiền trên chứng từ phải lớn hơn 0!' };
    }

    const role = data.userRole || 'ADMIN';
    const assignedFund = data.assignedFund || 'ALL';
    if (role === 'CASHIER' && assignedFund !== 'ALL') {
      if (data.accountName !== assignedFund && data.toAccountName !== assignedFund) {
        return { success: false, message: 'Phân quyền Thủ quỹ: Bạn chỉ được phép lập chứng từ trên [' + assignedFund + ']!' };
      }
    }

    const prefix = data.type === 'Phiếu Thu' ? 'PT' : (data.type === 'Phiếu Chi' ? 'PC' : 'PCQ');
    const code = data.code || (prefix + '-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmm'));
    const txDate = data.date ? (data.date + ' ' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'HH:mm')) : Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');

    const sqHeaders = sqSheet.getLastRow() >= 2 ? sqSheet.getRange(2, 1, 1, sqSheet.getLastColumn()).getValues()[0] : [];
    const is13Cols = sqHeaders.length >= 13;

    const nextRow = sqSheet.getLastRow() + 1;
    sqSheet.getRange(nextRow, 2).setNumberFormat('@');

    if (is13Cols) {
      sqSheet.appendRow([
        code,
        txDate,
        data.type,
        data.category || 'Hạng mục vận hành',
        amount,
        data.accountName,
        data.type === 'Chuyển quỹ' ? (data.toAccountName || '---') : '---',
        data.partner || 'Đối tác kinh doanh',
        data.projectName || 'Vận hành chung',
        data.paymentStatus || 'Đã tất toán',
        data.method || 'Chuyển khoản VietQR',
        data.createdBy || 'Kế toán',
        data.notes || ''
      ]);
    } else {
      sqSheet.appendRow([
        code,
        txDate,
        data.type === 'Phiếu Thu' ? 'Thu' : 'Chi',
        data.category || 'Hạng mục vận hành',
        amount,
        data.accountName,
        data.projectName || 'Vận hành chung',
        data.createdBy || 'Kế toán',
        code,
        data.method || 'Chuyển khoản VietQR',
        data.notes || ''
      ]);
    }

    const lastRow = sqSheet.getLastRow();
    sqSheet.getRange(lastRow, 5).setNumberFormat('#,##0 "₫"');
    SpreadsheetApp.flush();

    writeAuditLog(
      ss,
      data.username || 'admin',
      data.createdBy || 'Kế toán',
      'LẬP ' + data.type.toUpperCase(),
      code,
      data.type + ' ' + amount + ' ₫ tại [' + data.accountName + '] - Đối tác: ' + (data.partner || '')
    );

    return {
      success: true,
      message: 'Đã ghi sổ chứng từ ' + code + ' và cập nhật số dư quỹ thành công!',
      code: code
    };
  } catch (err) {
    return {
      success: false,
      message: 'Lỗi ghi sổ quỹ: ' + err.toString()
    };
  }
}

function saveUserAccount(payload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let pqSheet = ss.getSheetByName('PHAN_QUYEN');
    if (!pqSheet) {
      install_FINANCE_SHEET();
      pqSheet = ss.getSheetByName('PHAN_QUYEN');
    }

    const uname = String(payload.username || '').trim().toLowerCase();
    const pass = String(payload.password || '123456').trim();
    const fullName = String(payload.fullName || '').trim();
    const role = String(payload.role || 'CASHIER').trim();
    const assignedFund = (role === 'ADMIN' || role === 'ACCOUNTANT') ? 'ALL' : String(payload.assignedFund || 'Quỹ Tiền Mặt Văn Phòng').trim();
    const status = String(payload.status || 'Hoạt động').trim();

    if (!uname || !fullName) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Tên đăng nhập và Họ tên nhân sự!' };
    }

    let permDesc = 'Thủ quỹ chuyên trách (Chỉ xem & lập phiếu trên ' + assignedFund + ')';
    if (role === 'ADMIN') permDesc = 'Giám đốc tài chính (Toàn quyền hệ thống, Xem mọi quỹ, Tạo TK, Cấu hình)';
    else if (role === 'ACCOUNTANT') permDesc = 'Kế toán tổng hợp (Xem tất cả các quỹ, Lập phiếu Thu/Chi, Xuất báo cáo dòng tiền)';

    const vals = pqSheet.getDataRange().getValues();
    let existingRow = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toLowerCase() === uname) {
        existingRow = i + 1;
        break;
      }
    }

    if (existingRow > 0) {
      pqSheet.getRange(existingRow, 2).setNumberFormat('@');
      pqSheet.getRange(existingRow, 2, 1, 6).setValues([[
        pass, fullName, role, assignedFund, permDesc, status
      ]]);
      writeAuditLog(ss, payload.actorUsername || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT TÀI KHOẢN', uname, 'Cập nhật tài khoản ' + uname + ' (' + role + ' - ' + assignedFund + ')');
      return { success: true, message: 'Đã cập nhật tài khoản [' + uname + '] thành công!' };
    } else {
      const nextR = pqSheet.getLastRow() + 1;
      pqSheet.getRange(nextR, 1, 1, 2).setNumberFormat('@');
      pqSheet.appendRow([uname, pass, fullName, role, assignedFund, permDesc, status]);
      writeAuditLog(ss, payload.actorUsername || 'admin', payload.actorName || 'Admin', 'TẠO TÀI KHOẢN MỚI', uname, 'Tạo mới tài khoản ' + uname + ' (' + fullName + ' - ' + role + ')');
      return { success: true, message: 'Đã tạo tài khoản mới [' + uname + '] thành công!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu tài khoản: ' + err.toString() };
  }
}

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

    writeAuditLog(ss, configPayload.username || 'admin', configPayload.actorName || 'Admin', 'CẬP NHẬT CẤU HÌNH', 'CAU_HINH', 'Thay đổi thông tin doanh nghiệp / hạn mức chi phí');
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

function getFallbackFinanceData() {
  const settings = {
    COMPANY_NAME: 'CÔNG TY TNHH CÔNG NGHỆ & THIẾT BỊ NEXSIMPLE VIỆT NAM',
    COMPANY_ADDRESS: 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM',
    COMPANY_PHONE: '0974 755 104',
    COMPANY_TAX: '0318899221',
    MONTHLY_BURN_LIMIT: '80000000',
    ALLOW_OVERDRAFT: 'FALSE',
    PRINT_TEMPLATE_STANDARD: 'Mẫu số 01-TT / 02-TT (Ban hành theo Thông tư 200/2014/TT-BTC của Bộ Tài Chính)'
  };

  const users = getDefaultUsersList();

  const accounts = [
    { id: 'ACC-01', bankName: 'Vietcombank Doanh Nghiệp', accountNumber: '1018899889', holderName: 'CTY TNHH NEXSIMPLE VIET NAM', accountType: 'Ngân hàng', initialBalance: 250000000, totalIn: 133000000, totalOut: 15000000, balanceVnd: 368000000, notes: 'Tài khoản nhận doanh thu hợp đồng B2B chính' },
    { id: 'ACC-02', bankName: 'Techcombank Vận Hành', accountNumber: '19034567890', holderName: 'CTY TNHH NEXSIMPLE VIET NAM', accountType: 'Ngân hàng', initialBalance: 120000000, totalIn: 36000000, totalOut: 65000000, balanceVnd: 91000000, notes: 'Tài khoản chi lương, server & marketing' },
    { id: 'ACC-03', bankName: 'Quỹ Tiền Mặt Văn Phòng', accountNumber: 'CASH-VP-01', holderName: 'Phạm Thị Mai (Thủ Quỹ)', accountType: 'Tiền mặt', initialBalance: 35000000, totalIn: 15000000, totalOut: 3200000, balanceVnd: 46800000, notes: 'Quỹ tiền mặt chi tiêu hành chính văn phòng' },
    { id: 'ACC-04', bankName: 'Quỹ Dự Phòng Đầu Tư', accountNumber: 'ACB-889900', holderName: 'CTY TNHH NEXSIMPLE VIET NAM', accountType: 'Quỹ dự phòng', initialBalance: 180000000, totalIn: 0, totalOut: 0, balanceVnd: 180000000, notes: 'Quỹ tích lũy dự phòng chiến lược' }
  ];

  const transactions = [
    { code: 'PT-2026-1001', date: '2026-10-01 09:15', type: 'Phiếu Thu', category: 'Doanh thu bán hàng & Hợp đồng', amountVnd: 85000000, accountName: 'Vietcombank Doanh Nghiệp', toAccountName: '---', partner: 'Tập đoàn Truyền thông NovaMedia', projectName: 'Dự án ERP Q4', paymentStatus: 'Đã tất toán', method: 'Chuyển khoản VietQR', createdBy: 'Hoàng Thu Trang', notes: 'Thu tiền thanh toán đợt 1 Hợp đồng phần mềm số 102/HĐKT' },
    { code: 'PC-2026-1002', date: '2026-10-03 10:30', type: 'Phiếu Chi', category: 'Chi phí Lương & Thưởng nhân sự', amountVnd: 42000000, accountName: 'Techcombank Vận Hành', toAccountName: '---', partner: 'Bảng lương Nhân sự Khối Kỹ thuật', projectName: 'Khối Engineering', paymentStatus: 'Đã tất toán', method: 'UNC Ngân hàng', createdBy: 'Hoàng Thu Trang', notes: 'Chi lương và phụ cấp dự án tháng 09/2026' },
    { code: 'PT-2026-1004', date: '2026-10-05 14:20', type: 'Phiếu Thu', category: 'Doanh thu dịch vụ Tư vấn & Triển khai', amountVnd: 36000000, accountName: 'Techcombank Vận Hành', toAccountName: '---', partner: 'Công ty CP Logistics Đông Nam Á', projectName: 'Dự án Kho Đa Điểm', paymentStatus: 'Đã tất toán', method: 'Chuyển khoản VietQR', createdBy: 'Nguyễn Minh Tuấn', notes: 'Thu phí gói triển khai hệ thống Quản lý kho v3.0' },
    { code: 'PC-2026-1006', date: '2026-10-07 11:00', type: 'Phiếu Chi', category: 'Chi phí Hạ tầng Cloud & Bản quyền', amountVnd: 8500000, accountName: 'Techcombank Vận Hành', toAccountName: '---', partner: 'Amazon Web Services & Google Cloud', 'projectName': 'Hạ tầng Công nghệ', paymentStatus: 'Đã tất toán', method: 'Thẻ Doanh nghiệp', createdBy: 'Nguyễn Minh Tuấn', notes: 'Thanh toán cước máy chủ Cloud và license định kỳ' },
    { code: 'PCQ-2026-1008', date: '2026-10-09 15:00', type: 'Chuyển quỹ', category: 'Rút tiền gửi nhập quỹ tiền mặt', amountVnd: 15000000, accountName: 'Vietcombank Doanh Nghiệp', toAccountName: 'Quỹ Tiền Mặt Văn Phòng', partner: 'Luân chuyển quỹ nội bộ', projectName: 'Khối Hành chính', paymentStatus: 'Đã tất toán', method: 'Ủy nhiệm chi / Rút TM', createdBy: 'Phạm Thị Mai', notes: 'Bổ sung định mức quỹ tiền mặt văn phòng tháng 10' },
    { code: 'PC-2026-1010', date: '2026-10-11 09:45', type: 'Phiếu Chi', category: 'Chi phí Hành chính, Tiếp khách & VPP', amountVnd: 3200000, accountName: 'Quỹ Tiền Mặt Văn Phòng', toAccountName: '---', partner: 'Nhà hàng Sen Việt & VPP Thiên Long', projectName: 'Khối Kinh doanh', paymentStatus: 'Đã tất toán', method: 'Tiền mặt', createdBy: 'Phạm Thị Mai', notes: 'Chi tiếp đoàn khách hàng ký hợp đồng và mua văn phòng phẩm' },
    { code: 'PT-2026-1012', date: '2026-10-14 16:10', type: 'Phiếu Thu', category: 'Doanh thu bán hàng & Hợp đồng', amountVnd: 48000000, accountName: 'Vietcombank Doanh Nghiệp', toAccountName: '---', partner: 'Chuỗi Bán Lẻ Minh Khang Mart', projectName: 'Dự án POS Chuỗi', paymentStatus: 'Công nợ Phải thu', method: 'Chuyển khoản VietQR', createdBy: 'Hoàng Thu Trang', notes: 'Nghiệm thu bàn giao giai đoạn 2 (Hạn thanh toán 30/10)' },
    { code: 'PC-2026-1015', date: '2026-10-16 11:20', type: 'Phiếu Chi', category: 'Chi phí Quảng cáo & Marketing', amountVnd: 14500000, accountName: 'Techcombank Vận Hành', toAccountName: '---', partner: 'Đối tác Meta Ads & Google Ads VN', projectName: 'Khối Marketing', paymentStatus: 'Công nợ Phải trả', method: 'Chuyển khoản', createdBy: 'Hoàng Thu Trang', notes: 'Chi phí chiến dịch quảng cáo Performance tháng 10/2026' }
  ];

  const auditLogs = [
    { timestamp: '2026-10-16 11:20:00', username: 'ketoan', actorName: 'Hoàng Thu Trang (ACCOUNTANT)', action: 'LẬP PHIẾU CHI', refCode: 'PC-2026-1015', detail: 'Ghi nhận chi phí Marketing 14,500,000 ₫ trên Techcombank Vận Hành' },
    { timestamp: '2026-10-14 16:10:00', username: 'ketoan', actorName: 'Hoàng Thu Trang (ACCOUNTANT)', action: 'LẬP PHIẾU THU', refCode: 'PT-2026-1012', detail: 'Ghi nhận doanh thu 48,000,000 ₫ từ Chuỗi Minh Khang Mart' },
    { timestamp: '2026-10-09 15:00:00', username: 'thuquy_tm', actorName: 'Phạm Thị Mai (CASHIER)', action: 'CHUYỂN QUỸ NỘI BỘ', refCode: 'PCQ-2026-1008', detail: 'Chuyển 15,000,000 ₫ từ Vietcombank -> Quỹ Tiền Mặt Văn Phòng' }
  ];

  return buildFinanceResponse(accounts, transactions, settings, users, auditLogs, true);
}
