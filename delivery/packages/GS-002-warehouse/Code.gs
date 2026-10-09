/**
 * ============================================================================
 * GS-002: WEBAPP QUẢN LÝ NHẬP XUẤT TỒN ĐA KHO (V3.0)
 * BACKEND CONTROLLER & APPS SCRIPT API (CODE.GS)
 * Archetype: Inventory & Warehousing
 * ============================================================================
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Quản Lý Nhập Xuất Tồn Đa Kho v3.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📦 QUẢN LÝ KHO ĐA KHO')
    .addItem('⚡ Khởi tạo cấu trúc Trang tính', 'install_WAREHOUSE_SHEET')
    .addItem('🌐 Mở Web App Quản Trị Kho', 'openWarehouseDialog')
    .addToUi();
}

function openWarehouseDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800)
    .setTitle('Quản Lý Nhập Xuất Tồn Đa Kho v3.0');
  SpreadsheetApp.getUi().showModalDialog(html, 'Web App Quản Trị Kho Đa Kho');
}

/**
 * Lấy dữ liệu danh mục hàng hóa và nhật ký nhập xuất
 * Sử dụng getDisplayValues() để bảo đảm định dạng số và ngày tháng chuẩn xác.
 */
function getWarehouseData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dmSheet = ss.getSheetByName('DANH_MUC_HANG');
  const nxSheet = ss.getSheetByName('NHAP_XUAT');

  if (!dmSheet || !nxSheet) {
    return getFallbackWarehouseData();
  }

  // Đọc danh mục hàng
  const dmValues = dmSheet.getDataRange().getDisplayValues();
  const items = [];
  if (dmValues.length > 2) {
    for (let i = 2; i < dmValues.length; i++) {
      const row = dmValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      const stockHn = parseInt(row[6], 10) || 0;
      const stockSg = parseInt(row[7], 10) || 0;
      const stockTong = parseInt(row[8], 10) || 0;
      const totalStock = stockHn + stockSg + stockTong;
      const minLimit = parseInt(row[10], 10) || 0;

      items.push({
        sku: row[0],
        name: row[1],
        category: row[2],
        unit: row[3],
        costPrice: parseCurrency(row[4]),
        sellingPrice: parseCurrency(row[5]),
        stock_hanoi: stockHn,
        stock_saigon: stockSg,
        stock_tong: stockTong,
        totalStock: totalStock,
        minLimit: minLimit,
        alertStatus: totalStock <= minLimit ? 'Cảnh báo thiếu' : 'Bình thường'
      });
    }
  }

  // Đọc nhật ký nhập xuất
  const nxValues = nxSheet.getDataRange().getDisplayValues();
  const logs = [];
  if (nxValues.length > 2) {
    for (let i = 2; i < nxValues.length; i++) {
      const row = nxValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      logs.push({
        code: row[0],
        timestamp: row[1],
        type: row[2],
        sku: row[3],
        name: row[4],
        quantity: parseInt(row[5], 10) || 0,
        unitPrice: parseCurrency(row[6]),
        totalVal: parseCurrency(row[7]),
        fromWarehouse: row[8],
        toWarehouse: row[9],
        createdBy: row[10],
        notes: row[11] || ''
      });
    }
  }

  // Tính KPI
  let totalCostVal = 0;
  let lowStockCount = 0;
  let totalHn = 0;
  let totalSg = 0;
  let totalTong = 0;

  items.forEach(it => {
    totalCostVal += it.totalStock * it.costPrice;
    if (it.alertStatus === 'Cảnh báo thiếu') lowStockCount++;
    totalHn += it.stock_hanoi;
    totalSg += it.stock_saigon;
    totalTong += it.stock_tong;
  });

  return {
    success: true,
    items: items,
    logs: logs,
    kpi: {
      totalSku: items.length,
      totalCostVal: totalCostVal,
      lowStockCount: lowStockCount,
      totalHn: totalHn,
      totalSg: totalSg,
      totalTong: totalTong
    }
  };
}

/**
 * Tạo phiếu nhập / xuất / điều chuyển kho
 */
function submitInventoryTx(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dmSheet = ss.getSheetByName('DANH_MUC_HANG');
    const nxSheet = ss.getSheetByName('NHAP_XUAT');

    if (!dmSheet || !nxSheet) {
      return { success: false, message: 'Chưa khởi tạo Trang tính! Vui lòng chạy installer.' };
    }

    const typePrefix = data.type === 'Nhập kho' ? 'PNK' : data.type === 'Xuất kho' ? 'PXK' : 'PDC';
    const code = data.code || (typePrefix + '-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmm'));
    const nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    const qty = parseInt(data.quantity, 10) || 1;
    const unitPrice = Number(data.unitPrice) || 0;
    const totalVal = qty * unitPrice;

    // 1. Thêm dòng vào NHAP_XUAT
    nxSheet.appendRow([
      code,
      nowStr,
      data.type,
      data.sku,
      data.name,
      qty,
      unitPrice,
      totalVal,
      data.fromWarehouse || '',
      data.toWarehouse || '',
      data.createdBy || 'Thủ kho phụ trách',
      data.notes || ''
    ]);

    const lastRow = nxSheet.getLastRow();
    nxSheet.getRange(lastRow, 7, 1, 2).setNumberFormat('#,##0 "₫"');

    // 2. Cập nhật tồn kho trong DANH_MUC_HANG
    const dmValues = dmSheet.getDataRange().getValues();
    for (let i = 2; i < dmValues.length; i++) {
      if (dmValues[i][0] === data.sku) {
        const rowNum = i + 1;
        // Col G (7) = Kho Hà Nội, Col H (8) = Kho Sài Gòn, Col I (9) = Kho Tổng
        if (data.type === 'Nhập kho') {
          if (data.toWarehouse === 'Kho Hà Nội') dmSheet.getRange(rowNum, 7).setValue((Number(dmValues[i][6]) || 0) + qty);
          else if (data.toWarehouse === 'Kho Sài Gòn') dmSheet.getRange(rowNum, 8).setValue((Number(dmValues[i][7]) || 0) + qty);
          else if (data.toWarehouse === 'Kho Tổng') dmSheet.getRange(rowNum, 9).setValue((Number(dmValues[i][8]) || 0) + qty);
        } else if (data.type === 'Xuất kho') {
          if (data.fromWarehouse === 'Kho Hà Nội') dmSheet.getRange(rowNum, 7).setValue(Math.max(0, (Number(dmValues[i][6]) || 0) - qty));
          else if (data.fromWarehouse === 'Kho Sài Gòn') dmSheet.getRange(rowNum, 8).setValue(Math.max(0, (Number(dmValues[i][7]) || 0) - qty));
          else if (data.fromWarehouse === 'Kho Tổng') dmSheet.getRange(rowNum, 9).setValue(Math.max(0, (Number(dmValues[i][8]) || 0) - qty));
        } else if (data.type === 'Điều chuyển') {
          if (data.fromWarehouse === 'Kho Hà Nội') dmSheet.getRange(rowNum, 7).setValue(Math.max(0, (Number(dmValues[i][6]) || 0) - qty));
          else if (data.fromWarehouse === 'Kho Sài Gòn') dmSheet.getRange(rowNum, 8).setValue(Math.max(0, (Number(dmValues[i][7]) || 0) - qty));
          else if (data.fromWarehouse === 'Kho Tổng') dmSheet.getRange(rowNum, 9).setValue(Math.max(0, (Number(dmValues[i][8]) || 0) - qty));

          if (data.toWarehouse === 'Kho Hà Nội') dmSheet.getRange(rowNum, 7).setValue((Number(dmValues[i][6]) || 0) + qty);
          else if (data.toWarehouse === 'Kho Sài Gòn') dmSheet.getRange(rowNum, 8).setValue((Number(dmValues[i][7]) || 0) + qty);
          else if (data.toWarehouse === 'Kho Tổng') dmSheet.getRange(rowNum, 9).setValue((Number(dmValues[i][8]) || 0) + qty);
        }
        break;
      }
    }

    return {
      success: true,
      message: 'Tạo phiếu ' + code + ' thành công!',
      code: code
    };
  } catch (err) {
    return {
      success: false,
      message: 'Lỗi ghi nhận kho: ' + err.toString()
    };
  }
}

function parseCurrency(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const clean = str.replace(/[^\d.-]/g, '');
  return parseFloat(clean) || 0;
}

function getFallbackWarehouseData() {
  return {
    success: true,
    isFallback: true,
    items: [
      { sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame', category: 'Thiết bị ghi hình', unit: 'Chiếc', costPrice: 72000000, sellingPrice: 85000000, stock_hanoi: 4, stock_saigon: 3, stock_tong: 5, totalStock: 12, minLimit: 3, alertStatus: 'Bình thường' },
      { sku: 'SKU-LEN-2470', name: 'Sony FE 24-70mm f/2.8 GM II', category: 'Ống kính', unit: 'Chiếc', costPrice: 38000000, sellingPrice: 46000000, stock_hanoi: 2, stock_saigon: 4, stock_tong: 6, totalStock: 12, minLimit: 4, alertStatus: 'Bình thường' },
      { sku: 'SKU-DRO-M3C', name: 'DJI Mavic 3 Cine Combo', category: 'Flycam', unit: 'Bộ', costPrice: 85000000, sellingPrice: 99000000, stock_hanoi: 1, stock_saigon: 1, stock_tong: 0, totalStock: 2, minLimit: 3, alertStatus: 'Cảnh báo thiếu' },
      { sku: 'SKU-LGT-600D', name: 'Aputure Light Storm LS 600d Pro', category: 'Ánh sáng', unit: 'Bộ', costPrice: 42000000, sellingPrice: 49000000, stock_hanoi: 5, stock_saigon: 4, stock_tong: 8, totalStock: 17, minLimit: 5, alertStatus: 'Bình thường' },
      { sku: 'SKU-MIC-EWDP', name: 'Sennheiser EW-DP ME 2 Wireless Mic', category: 'Âm thanh', unit: 'Bộ', costPrice: 14500000, sellingPrice: 18000000, stock_hanoi: 6, stock_saigon: 8, stock_tong: 10, totalStock: 24, minLimit: 5, alertStatus: 'Bình thường' },
      { sku: 'SKU-GIM-RS3P', name: 'DJI RS 3 Pro Gimbal Stabilizer', category: 'Chống rung', unit: 'Chiếc', costPrice: 18000000, sellingPrice: 22500000, stock_hanoi: 1, stock_saigon: 1, stock_tong: 1, totalStock: 3, minLimit: 4, alertStatus: 'Cảnh báo thiếu' }
    ],
    logs: [
      { code: 'PNK-2026-0801', timestamp: '2026-08-01 09:15', type: 'Nhập kho', sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame', quantity: 3, unitPrice: 72000000, totalVal: 216000000, fromWarehouse: 'Nhà phân phối Sony VN', toWarehouse: 'Kho Hà Nội', createdBy: 'Trần Đình Trọng', notes: 'Lô hàng chính hãng nhập đợt 1' },
      { code: 'PXK-2026-0802', timestamp: '2026-08-02 14:30', type: 'Xuất kho', sku: 'SKU-DRO-M3C', name: 'DJI Mavic 3 Cine Combo', quantity: 1, unitPrice: 85000000, totalVal: 85000000, fromWarehouse: 'Kho Sài Gòn', toWarehouse: 'Khách hàng VIP Studio', createdBy: 'Lê Hoàng Nam', notes: 'Xuất theo đơn giao ngay' },
      { code: 'PDC-2026-0803', timestamp: '2026-08-03 11:00', type: 'Điều chuyển', sku: 'SKU-LGT-600D', name: 'Aputure Light Storm LS 600d Pro', quantity: 2, unitPrice: 42000000, totalVal: 84000000, fromWarehouse: 'Kho Tổng', toWarehouse: 'Kho Hà Nội', createdBy: 'Phạm Minh Đức', notes: 'Cân đối tồn kho trước sự kiện' }
    ],
    kpi: {
      totalSku: 6,
      totalCostVal: 2689000000,
      lowStockCount: 2,
      totalHn: 19,
      totalSg: 21,
      totalTong: 30
    }
  };
}

