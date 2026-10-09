/**
 * ============================================================================
 * GS-005: WEBAPP F&B POS QUÁN CAFE / NHÀ HÀNG (V3.0)
 * BACKEND CONTROLLER & APPS SCRIPT API (CODE.GS)
 * Archetype: Point of Sale & F&B
 * ============================================================================
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('F&B POS Quán Cafe / Nhà Hàng v3.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('☕ F&B POS QUÁN CAFE / NHÀ HÀNG')
    .addItem('⚡ Khởi tạo cấu trúc Trang tính', 'install_POS_SHEET')
    .addItem('🌐 Mở Web App Thu Ngân POS', 'openPosDialog')
    .addToUi();
}

function openPosDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800)
    .setTitle('F&B POS Quán Cafe / Nhà Hàng v3.0');
  SpreadsheetApp.getUi().showModalDialog(html, 'Web App F&B POS Thu Ngân');
}

/**
 * Lấy dữ liệu sơ đồ bàn, menu thực đơn và lịch sử hóa đơn
 * Sử dụng getDisplayValues() để bảo đảm định dạng an toàn tuyệt đối.
 */
function getPOSData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sdbSheet = ss.getSheetByName('SO_DO_BAN');
  const tdSheet = ss.getSheetByName('THUC_DON');
  const hdSheet = ss.getSheetByName('HOA_DON');

  if (!sdbSheet || !tdSheet || !hdSheet) {
    return getFallbackPOSData();
  }

  // Đọc sơ đồ bàn
  const sdbValues = sdbSheet.getDataRange().getDisplayValues();
  const tables = [];
  if (sdbValues.length > 2) {
    for (let i = 2; i < sdbValues.length; i++) {
      const row = sdbValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      tables.push({
        id: parseInt(row[0], 10) || (i - 1),
        name: row[1],
        area: row[2],
        status: row[3] || 'available',
        guestCount: parseInt(row[4], 10) || 0,
        currentTotal: parseCurrency(row[5]),
        notes: row[6] || ''
      });
    }
  }

  // Đọc thực đơn
  const tdValues = tdSheet.getDataRange().getDisplayValues();
  const menuItems = [];
  if (tdValues.length > 2) {
    for (let i = 2; i < tdValues.length; i++) {
      const row = tdValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      menuItems.push({
        id: row[0],
        name: row[1],
        category: row[2],
        price: parseCurrency(row[3]),
        unit: row[4],
        status: row[5] || 'Có sẵn',
        notes: row[6] || ''
      });
    }
  }

  // Đọc lịch sử hóa đơn
  const hdValues = hdSheet.getDataRange().getDisplayValues();
  const invoices = [];
  if (hdValues.length > 2) {
    for (let i = 2; i < hdValues.length; i++) {
      const row = hdValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      invoices.push({
        invoiceCode: row[0],
        tableName: row[1],
        createdAt: row[2],
        cashier: row[3],
        itemsSummary: row[4],
        subtotal: parseCurrency(row[5]),
        vat: parseCurrency(row[6]),
        discount: parseCurrency(row[7]),
        totalPayment: parseCurrency(row[8]),
        paymentMethod: row[9],
        status: row[10] || 'Đã thanh toán'
      });
    }
  }

  // Tính toán KPI
  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const availableCount = tables.filter(t => t.status === 'available').length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalPayment, 0);

  return {
    success: true,
    tables: tables,
    menuItems: menuItems,
    invoices: invoices,
    kpi: {
      totalRevenue: totalRevenue,
      invoiceCount: invoices.length,
      occupiedTables: occupiedCount,
      availableTables: availableCount
    }
  };
}

/**
 * Thanh toán order và lưu hóa đơn
 */
function submitPOSOrder(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sdbSheet = ss.getSheetByName('SO_DO_BAN');
    const hdSheet = ss.getSheetByName('HOA_DON');

    if (!sdbSheet || !hdSheet) {
      return { success: false, message: 'Chưa khởi tạo Trang tính! Vui lòng chạy installer.' };
    }

    const invoiceCode = data.invoiceCode || ('HD-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmmss'));
    const nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    const subtotal = Number(data.subtotal) || 0;
    const vat = Number(data.vat) || 0;
    const discount = Number(data.discount) || 0;
    const totalPayment = Number(data.totalPayment) || (subtotal + vat - discount);

    // 1. Thêm dòng vào HOA_DON
    hdSheet.appendRow([
      invoiceCode,
      data.tableName,
      nowStr,
      data.cashier || 'Thu ngân ca 1',
      data.itemsSummary || '',
      subtotal,
      vat,
      discount,
      totalPayment,
      data.paymentMethod || 'Chuyển khoản VietQR',
      'Đã thanh toán'
    ]);

    const lastRow = hdSheet.getLastRow();
    hdSheet.getRange(lastRow, 6, 1, 4).setNumberFormat('#,##0 "₫"');

    // 2. Cập nhật giải phóng bàn trong SO_DO_BAN
    const sdbValues = sdbSheet.getDataRange().getValues();
    for (let i = 2; i < sdbValues.length; i++) {
      if (sdbValues[i][1] === data.tableName || String(sdbValues[i][0]) === String(data.tableId)) {
        const rowNum = i + 1;
        sdbSheet.getRange(rowNum, 4).setValue('available'); // status
        sdbSheet.getRange(rowNum, 5).setValue(0);           // khách
        sdbSheet.getRange(rowNum, 6).setValue(0);           // tiền tạm tính
        break;
      }
    }

    return {
      success: true,
      message: 'Thanh toán thành công ' + invoiceCode + ' (' + totalPayment.toLocaleString('vi-VN') + ' đ)!',
      invoiceCode: invoiceCode
    };
  } catch (err) {
    return {
      success: false,
      message: 'Lỗi ghi hóa đơn: ' + err.toString()
    };
  }
}

function parseCurrency(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const clean = str.replace(/[^\d.-]/g, '');
  return parseFloat(clean) || 0;
}

function getFallbackPOSData() {
  return {
    success: true,
    isFallback: true,
    tables: [
      { id: 1, name: 'Bàn 01', area: 'Tầng 1 - Máy lạnh', status: 'occupied', guestCount: 3, currentTotal: 145000, notes: 'Khách bàn góc cạnh cửa sổ' },
      { id: 2, name: 'Bàn 02', area: 'Tầng 1 - Máy lạnh', status: 'available', guestCount: 0, currentTotal: 0, notes: 'Bàn đã dọn dẹp sạch sẽ' },
      { id: 3, name: 'Bàn 03', area: 'Tầng 1 - Máy lạnh', status: 'occupied', guestCount: 2, currentTotal: 95000, notes: 'Khách đang đợi thêm bánh ngọt' },
      { id: 4, name: 'Bàn 04', area: 'Tầng 2 - Ngoài trời', status: 'available', guestCount: 0, currentTotal: 0, notes: 'View ban công thoáng' },
      { id: 5, name: 'Bàn 05', area: 'Tầng 2 - Ngoài trời', status: 'occupied', guestCount: 4, currentTotal: 210000, notes: 'Khách gia đình' },
      { id: 6, name: 'Bàn VIP 01', area: 'Khu VIP Phòng Họp', status: 'reserved', guestCount: 0, currentTotal: 0, notes: 'Đã đặt trước 19:30 tối nay' }
    ],
    menuItems: [
      { id: 'MN-CF-01', name: 'Cà Phê Muối Huê Đặc Biệt', category: 'Cà phê', price: 35000, unit: 'Ly', status: 'Có sẵn', notes: 'Kem béo mặn' },
      { id: 'MN-CF-02', name: 'Cà Phê Phin Sữa Đá Cổ Điển', category: 'Cà phê', price: 29000, unit: 'Ly', status: 'Có sẵn', notes: 'Robusta rang mộc' },
      { id: 'MN-CF-03', name: 'Cold Brew Cam Vàng Tươi', category: 'Cà phê', price: 45000, unit: 'Ly', status: 'Có sẵn', notes: 'Ủ lạnh 16 tiếng' },
      { id: 'MN-TR-01', name: 'Trà Đào Cam Sả Thảo Mộc', category: 'Trà & Trà sữa', price: 42000, unit: 'Ly', status: 'Có sẵn', notes: 'Đào giòn tươi' },
      { id: 'MN-TR-02', name: 'Trà Ô Long Sữa Nướng', category: 'Trà & Trà sữa', price: 45000, unit: 'Ly', status: 'Có sẵn', notes: 'Ngọt 50%' },
      { id: 'MN-BN-01', name: 'Bánh Tiramisu Ý Cacao', category: 'Bánh & Tráng miệng', price: 45000, unit: 'Phần', status: 'Có sẵn', notes: 'Bánh mềm xốp' },
      { id: 'MN-AN-01', Khoai: 'Khoai Tây Chiên Phô Mai', category: 'Ăn nhẹ', price: 35000, unit: 'Đĩa', status: 'Có sẵn', notes: 'Chiên vàng giòn' }
    ],
    invoices: [
      { invoiceCode: 'HD-20260803-01', tableName: 'Bàn 01', createdAt: '2026-08-03 10:30', cashier: 'Lê Thu Trang', itemsSummary: '2 Cà Phê Muối, 1 Bánh Tiramisu', subtotal: 115000, vat: 9200, discount: 0, totalPayment: 124200, paymentMethod: 'Chuyển khoản VietQR', status: 'Đã thanh toán' },
      { invoiceCode: 'HD-20260803-02', tableName: 'Bàn 04', createdAt: '2026-08-03 11:15', cashier: 'Lê Thu Trang', itemsSummary: '1 Cold Brew Cam, 1 Trà Đào', subtotal: 87000, vat: 6960, discount: 0, totalPayment: 93960, paymentMethod: 'Tiền mặt', status: 'Đã thanh toán' }
    ],
    kpi: {
      totalRevenue: 218160,
      invoiceCount: 2,
      occupiedTables: 3,
      availableTables: 2
    }
  };
}

