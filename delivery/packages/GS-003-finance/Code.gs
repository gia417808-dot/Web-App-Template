/**
 * ============================================================================
 * GS-003: WEBAPP QUẢN LÝ THU CHI & DÒNG TIỀN STARTUP (V4.1)
 * BACKEND CONTROLLER & APPS SCRIPT API (CODE.GS)
 * Archetype: Finance & Cashflow
 * ============================================================================
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Quản Lý Thu Chi & Dòng Tiền Startup v4.1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💰 QUẢN LÝ THU CHI & DÒNG TIỀN')
    .addItem('⚡ Khởi tạo cấu trúc Trang tính', 'install_FINANCE_SHEET')
    .addItem('🌐 Mở Web App Quản Trị Tài Chính', 'openFinanceDialog')
    .addToUi();
}

function openFinanceDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800)
    .setTitle('Quản Lý Thu Chi & Dòng Tiền Startup v4.1');
  SpreadsheetApp.getUi().showModalDialog(html, 'Web App Quản Trị Tài Chính Startup');
}

/**
 * Lấy toàn bộ dữ liệu tài khoản và sổ quỹ thu chi
 * Sử dụng getDisplayValues() để triệt tiêu lỗi phân tách Locale và lỗi tuần tự hóa ngày tháng.
 */
function getFinanceData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tkSheet = ss.getSheetByName('TAI_KHOAN');
  const sqSheet = ss.getSheetByName('SO_QUY');

  if (!tkSheet || !sqSheet) {
    return getFallbackFinanceData();
  }

  // Đọc danh sách tài khoản
  const tkValues = tkSheet.getDataRange().getDisplayValues();
  const accounts = [];
  if (tkValues.length > 2) {
    for (let i = 2; i < tkValues.length; i++) {
      const row = tkValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      accounts.push({
        id: row[0],
        bankName: row[1],
        accountNumber: row[2],
        holderName: row[3],
        initialBalance: parseCurrency(row[4]),
        balanceVnd: parseCurrency(row[5]),
        accountType: row[6] || 'Ngân hàng',
        notes: row[7] || ''
      });
    }
  }

  // Đọc nhật ký thu chi
  const sqValues = sqSheet.getDataRange().getDisplayValues();
  const transactions = [];
  if (sqValues.length > 2) {
    for (let i = 2; i < sqValues.length; i++) {
      const row = sqValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      transactions.push({
        code: row[0],
        date: row[1],
        type: row[2] || 'Thu',
        category: row[3],
        amountVnd: parseCurrency(row[4]),
        accountName: row[5],
        projectName: row[6],
        createdBy: row[7],
        refDoc: row[8],
        method: row[9] || 'Chuyển khoản',
        notes: row[10] || ''
      });
    }
  }

  // Tính toán KPI tài chính
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balanceVnd, 0);
  const totalThu = transactions.filter(t => t.type === 'Thu').reduce((sum, t) => sum + t.amountVnd, 0);
  const totalChi = transactions.filter(t => t.type === 'Chi').reduce((sum, t) => sum + t.amountVnd, 0);
  const netCashflow = totalThu - totalChi;
  const burnRate = totalChi > 0 ? totalChi : 40000000;
  const runwayMonths = burnRate > 0 ? (totalBalance / burnRate).toFixed(1) : '99.0';

  return {
    success: true,
    accounts: accounts,
    transactions: transactions,
    kpi: {
      totalBalance: totalBalance,
      totalThu: totalThu,
      totalChi: totalChi,
      netCashflow: netCashflow,
      burnRate: burnRate,
      runwayMonths: runwayMonths
    }
  };
}

/**
 * Ghi nhận giao dịch Thu / Chi mới
 */
function submitFinanceTx(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tkSheet = ss.getSheetByName('TAI_KHOAN');
    const sqSheet = ss.getSheetByName('SO_QUY');

    if (!tkSheet || !sqSheet) {
      return { success: false, message: 'Chưa khởi tạo Trang tính! Vui lòng chạy installer.' };
    }

    const typePrefix = data.type === 'Thu' ? 'THU' : 'CHI';
    const code = data.code || (typePrefix + '-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmm'));
    const dateStr = data.date || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    const amount = Number(data.amount) || 0;

    // 1. Thêm dòng vào SO_QUY
    sqSheet.appendRow([
      code,
      dateStr,
      data.type,
      data.category,
      amount,
      data.accountName,
      data.projectName || 'Vận hành chung',
      data.createdBy || 'Kế toán quản trị',
      data.refDoc || '',
      data.method || 'Chuyển khoản VietQR',
      data.notes || ''
    ]);

    const lastRow = sqSheet.getLastRow();
    sqSheet.getRange(lastRow, 5).setNumberFormat('#,##0 "₫"');

    // 2. Cập nhật số dư hiện tại trong TAI_KHOAN (Col F = Col 6)
    const tkValues = tkSheet.getDataRange().getValues();
    for (let i = 2; i < tkValues.length; i++) {
      if (tkValues[i][1] === data.accountName) {
        const rowNum = i + 1;
        const currentBal = Number(tkValues[i][5]) || 0;
        const newBal = data.type === 'Thu' ? (currentBal + amount) : (currentBal - amount);
        tkSheet.getRange(rowNum, 6).setValue(newBal);
        break;
      }
    }

    return {
      success: true,
      message: 'Ghi nhận giao dịch ' + code + ' thành công!',
      code: code
    };
  } catch (err) {
    return {
      success: false,
      message: 'Lỗi ghi sổ quỹ: ' + err.toString()
    };
  }
}

function parseCurrency(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const clean = str.replace(/[^\d.-]/g, '');
  return parseFloat(clean) || 0;
}

function getFallbackFinanceData() {
  return {
    success: true,
    isFallback: true,
    accounts: [
      { id: 'ACC-01', bankName: 'Vietcombank Doanh Nghiệp', accountNumber: '1018899889', holderName: 'CTY TNHH TEMPLATE VIET', initialBalance: 150000000, balanceVnd: 325000000, accountType: 'Ngân hàng', notes: 'Tài khoản chính' },
      { id: 'ACC-02', bankName: 'Techcombank Thu Chi', accountNumber: '19034567890', holderName: 'LE HOANG NAM - CEO', initialBalance: 50000000, balanceVnd: 115000000, accountType: 'Ngân hàng', notes: 'Tài khoản đối ứng' },
      { id: 'ACC-03', bankName: 'Quỹ Tiền Mặt Văn Phòng', accountNumber: 'CASH-BOX-01', holderName: 'Thủ quỹ Chi nhánh', initialBalance: 15000000, balanceVnd: 8500000, accountType: 'Tiền mặt', notes: 'Tiền mặt chi tiêu lặt vặt' }
    ],
    transactions: [
      { code: 'TX-2026-001', date: '2026-08-01', type: 'Thu', category: 'Doanh thu Bán hàng', amountVnd: 45000000, accountName: 'Vietcombank Doanh Nghiệp', projectName: 'Dự án ERP Doanh Nghiệp', createdBy: 'Lê Hoàng Nam', refDoc: 'UNC-VCB-8912', method: 'Chuyển khoản VietQR', notes: 'Thanh toán đợt 1' },
      { code: 'TX-2026-002', date: '2026-08-02', type: 'Chi', category: 'Chi phí Máy chủ & Cloud', amountVnd: 4200000, accountName: 'Techcombank Thu Chi', projectName: 'Hạ tầng Core', createdBy: 'Phạm Minh Đức', refDoc: 'INV-AWS-7890', method: 'Thẻ VISA Doanh nghiệp', notes: 'Gia hạn server AWS' },
      { code: 'TX-2026-003', date: '2026-08-03', type: 'Chi', category: 'Lương nhân sự tháng 7', amountVnd: 35000000, accountName: 'Vietcombank Doanh Nghiệp', projectName: 'Khối Kỹ Thuật', createdBy: 'Trần Đình Trọng', refDoc: 'BL-L7-001', method: 'Chuyển khoản theo lô', notes: 'Lương đợt 1' },
      { code: 'TX-2026-004', date: '2026-08-04', type: 'Thu', category: 'Thu tiền dịch vụ tư vấn', amountVnd: 12500000, accountName: 'Techcombank Thu Chi', projectName: 'Khách hàng MediaPro', createdBy: 'Lê Hoàng Nam', refDoc: 'UNC-TCB-4412', method: 'Chuyển khoản VietQR', notes: 'Gói tư vấn quản trị' },
      { code: 'TX-2026-005', date: '2026-08-05', type: 'Chi', category: 'Tiếp khách & Hội thảo', amountVnd: 1850000, accountName: 'Quỹ Tiền Mặt Văn Phòng', projectName: 'Khối Kinh Doanh', createdBy: 'Thủ quỹ Chi nhánh', refDoc: 'PC-0805-01', method: 'Tiền mặt', notes: 'Ăn trưa trao đổi hợp đồng' }
    ],
    kpi: {
      totalBalance: 448500000,
      totalThu: 57500000,
      totalChi: 41050000,
      netCashflow: 16450000,
      burnRate: 41050000,
      runwayMonths: '10.9'
    }
  };
}

