/**
 * ============================================================================
 * GS-002: WEBAPP QUẢN LÝ NHẬP XUẤT TỒN ĐA KHO (V3.0 COMMERCIAL PRO - PATCHED)
 * BACKEND CONTROLLER, RBAC AUTH, USER MANAGEMENT, COSTING & AUDIT API (CODE.GS)
 * Archetype: Inventory & Warehousing (Golden Master v2.1)
 * ============================================================================
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Quản Lý Nhập Xuất Tồn Đa Kho v3.0 Pro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📦 QUẢN LÝ KHO ĐA KHO PRO (v3.0)')
    .addItem('⚡ 1. Khởi tạo / Làm mới 6 Tab Chuẩn Thương Mại', 'install_WAREHOUSE_SHEET')
    .addSeparator()
    .addItem('🌐 2. Mở Web App Quản Trị Kho (Full Screen Modal)', 'openWarehouseDialog')
    .addToUi();
}

function openWarehouseDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1380)
    .setHeight(850)
    .setTitle('Hệ Thống Quản Lý Nhập Xuất Tồn Đa Kho v3.0 (Commercial Pro)');
  SpreadsheetApp.getUi().showModalDialog(html, '📦 Web App Quản Lý Nhập Xuất Tồn Đa Kho v3.0');
}

/**
 * Đọc toàn bộ dữ liệu hệ thống 6 Tab bằng getDisplayValues() (100% an toàn Date & Locale)
 */
function getWarehouseData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dmSheet = ss.getSheetByName('DANH_MUC_HANG');
    const nxSheet = ss.getSheetByName('NHAP_XUAT');
    const pqSheet = ss.getSheetByName('PHAN_QUYEN');
    const chSheet = ss.getSheetByName('CAU_HINH');
    const nkSheet = ss.getSheetByName('NHAT_KY');

    if (!dmSheet || !nxSheet) {
      return getFallbackWarehouseData();
    }

    // 1. Đọc cấu hình doanh nghiệp
    const settings = {
      COMPANY_NAME: 'CÔNG TY TNHH CÔNG NGHỆ & THIẾT BỊ NEXSIMPLE VIỆT NAM',
      COMPANY_ADDRESS: 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM',
      COMPANY_PHONE: '0974 755 104',
      COMPANY_TAX: '0318899221',
      COSTING_METHOD: 'WEIGHTED_AVERAGE',
      ALLOW_NEGATIVE_STOCK: 'FALSE',
      PRINT_TEMPLATE_STANDARD: 'Mẫu số 01-VT / 02-VT (Ban hành theo Thông tư 200/2014/TT-BTC Bộ Tài Chính)'
    };
    if (chSheet) {
      const chVals = chSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < chVals.length; i++) {
        const k = (chVals[i][0] || '').trim();
        const v = (chVals[i][1] || '').trim();
        if (k) settings[k] = v;
      }
    }

    // 2. Đọc danh sách tài khoản phân quyền
    const users = [];
    if (pqSheet) {
      const pqVals = pqSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < pqVals.length; i++) {
        const r = pqVals[i];
        if (!r[0] || !r[0].trim()) continue;
        users.push({
          username: r[0].trim(),
          password: r[1].trim() || '123456',
          fullName: r[2].trim() || r[0].trim(),
          role: r[3].trim() || 'KEEPER',
          assignedWarehouse: r[4].trim() || 'ALL',
          permissionsDesc: r[5] || '',
          status: r[6] || 'Hoạt động'
        });
      }
    }

    // 3. Đọc danh mục hàng hóa & tồn đa kho
    const dmValues = dmSheet.getDataRange().getDisplayValues();
    const items = [];
    if (dmValues.length > 2) {
      for (let i = 2; i < dmValues.length; i++) {
        const row = dmValues[i];
        if (!row[0] || row[0].trim() === '') continue;
        // Hỗ trợ tương thích cả bảng 12 cột cũ và bảng 14 cột mới
        const is14 = row.length >= 14;
        const costPrice = parseCurrency(row[4]);
        const sellingPrice = parseCurrency(row[5]);
        const openingStock = is14 ? (parseInt(parseCurrency(row[6]), 10) || 0) : 0;
        const stockHn = parseInt(parseCurrency(is14 ? row[7] : row[6]), 10) || 0;
        const stockSg = parseInt(parseCurrency(is14 ? row[8] : row[7]), 10) || 0;
        const stockTong = parseInt(parseCurrency(is14 ? row[9] : row[8]), 10) || 0;
        const totalStock = stockHn + stockSg + stockTong;
        const minLimit = parseInt(parseCurrency(is14 ? row[12] : row[10]), 10) || 0;

        let alertStatus = 'An toàn';
        if (totalStock <= 0) alertStatus = 'Hết hàng';
        else if (totalStock <= minLimit) alertStatus = 'Sắp hết hàng';

        items.push({
          sku: row[0].trim(),
          name: row[1].trim(),
          category: row[2].trim() || 'Chưa phân loại',
          unit: row[3].trim() || 'Chiếc',
          costPrice: costPrice,
          sellingPrice: sellingPrice,
          openingStock: openingStock || totalStock,
          stock_hanoi: stockHn,
          stock_saigon: stockSg,
          stock_tong: stockTong,
          totalStock: totalStock,
          inventoryValue: totalStock * costPrice,
          minLimit: minLimit,
          alertStatus: alertStatus
        });
      }
    }

    // 4. Đọc sổ chứng từ Nhập - Xuất - Điều chuyển
    const nxValues = nxSheet.getDataRange().getDisplayValues();
    const logs = [];
    if (nxValues.length > 2) {
      for (let i = 2; i < nxValues.length; i++) {
        const row = nxValues[i];
        if (!row[0] || row[0].trim() === '') continue;
        const is14Cols = row.length >= 14;
        const qty = parseInt(parseCurrency(is14Cols ? row[6] : row[5]), 10) || 0;
        const unitPrice = parseCurrency(is14Cols ? row[7] : row[6]);
        const totalVal = parseCurrency(is14Cols ? row[8] : row[7]) || (qty * unitPrice);

        logs.push({
          code: row[0].trim(),
          timestamp: row[1].trim(),
          type: row[2].trim(),
          sku: row[3].trim(),
          name: row[4].trim(),
          unit: is14Cols ? (row[5] || 'Chiếc') : 'Chiếc',
          quantity: qty,
          unitPrice: unitPrice,
          totalVal: totalVal,
          fromWarehouse: is14Cols ? row[9] : row[8],
          toWarehouse: is14Cols ? row[10] : row[9],
          partner: is14Cols ? (row[11] || 'Khách lẻ / Nội bộ') : 'Đối tác hệ thống',
          createdBy: is14Cols ? row[12] : row[10],
          notes: is14Cols ? (row[13] || '') : (row[11] || '')
        });
      }
    }

    // 5. Đọc nhật ký hệ thống (Audit Log)
    const auditLogs = [];
    if (nkSheet) {
      const nkVals = nkSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < nkVals.length; i++) {
        const r = nkVals[i];
        if (!r[0] || !r[0].trim()) continue;
        auditLogs.push({
          timestamp: r[0],
          username: r[1],
          actorName: r[2],
          action: r[3],
          refCode: r[4],
          detail: r[5]
        });
      }
    }

    return buildWarehouseResponse(items, logs, settings, users, auditLogs.reverse(), false);
  } catch (err) {
    return getFallbackWarehouseData();
  }
}

function buildWarehouseResponse(items, logs, settings, users, auditLogs, isFallback) {
  let totalCostVal = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalHn = 0;
  let totalSg = 0;
  let totalTong = 0;

  items.forEach(function(it) {
    totalCostVal += it.totalStock * it.costPrice;
    if (it.alertStatus === 'Sắp hết hàng') lowStockCount++;
    if (it.alertStatus === 'Hết hàng') outOfStockCount++;
    totalHn += it.stock_hanoi;
    totalSg += it.stock_saigon;
    totalTong += it.stock_tong;
  });

  return {
    success: true,
    isFallback: isFallback,
    settings: settings,
    users: users,
    items: items,
    logs: logs,
    auditLogs: auditLogs,
    kpi: {
      totalSku: items.length,
      totalCostVal: totalCostVal,
      lowStockCount: lowStockCount,
      outOfStockCount: outOfStockCount,
      totalHn: totalHn,
      totalSg: totalSg,
      totalTong: totalTong
    }
  };
}

/**
 * Tạo mới hoặc Cập nhật Tài Khoản Người Dùng trong tab PHAN_QUYEN
 */
function saveUserAccount(payload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let pqSheet = ss.getSheetByName('PHAN_QUYEN');
    if (!pqSheet) {
      install_WAREHOUSE_SHEET();
      pqSheet = ss.getSheetByName('PHAN_QUYEN');
    }

    const uname = String(payload.username || '').trim().toLowerCase();
    const pass = String(payload.password || '123456').trim();
    const fullName = String(payload.fullName || '').trim();
    const role = String(payload.role || 'KEEPER').trim();
    const assignedWh = (role === 'ADMIN' || role === 'ACCOUNTANT') ? 'ALL' : String(payload.assignedWarehouse || 'Kho Hà Nội').trim();
    const status = String(payload.status || 'Hoạt động').trim();

    if (!uname || !fullName) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Tên đăng nhập và Họ tên nhân sự!' };
    }

    let permDesc = 'Thủ kho chi nhánh (Chỉ xem & lập phiếu Nhập/Xuất tại ' + assignedWh + ')';
    if (role === 'ADMIN') permDesc = 'Toàn quyền hệ thống (Xem tất cả kho, Nhập/Xuất/Chuyển, Quản lý tài khoản, Cấu hình)';
    else if (role === 'ACCOUNTANT') permDesc = 'Kế toán kho (Xem tất cả kho, Lập phiếu, Xem giá vốn, Xuất báo cáo N-X-T)';

    const vals = pqSheet.getDataRange().getValues();
    let existingRow = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toLowerCase() === uname) {
        existingRow = i + 1;
        break;
      }
    }

    if (existingRow > 0) {
      pqSheet.getRange(existingRow, 2, 1, 6).setValues([[
        pass, fullName, role, assignedWh, permDesc, status
      ]]);
      writeAuditLog(ss, payload.actorUsername || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT TÀI KHOẢN', uname, 'Cập nhật tài khoản ' + uname + ' (' + role + ' - ' + assignedWh + ')');
      return { success: true, message: 'Đã cập nhật tài khoản [' + uname + '] thành công!' };
    } else {
      pqSheet.appendRow([uname, pass, fullName, role, assignedWh, permDesc, status]);
      writeAuditLog(ss, payload.actorUsername || 'admin', payload.actorName || 'Admin', 'TẠO TÀI KHOẢN MỚI', uname, 'Tạo mới tài khoản ' + uname + ' (' + fullName + ' - ' + role + ')');
      return { success: true, message: 'Đã tạo tài khoản mới [' + uname + '] thành công!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu tài khoản: ' + err.toString() };
  }
}

/**
 * Xóa tài khoản người dùng (Không cho phép xóa tài khoản admin gốc)
 */
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

/**
 * Thêm mới hoặc Cập nhật Mã hàng hóa (SKU) trực tiếp từ Web App (Hỗ trợ cả sheet 12 cột cũ và 14 cột mới)
 */
function saveSkuMasterItem(payload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let dmSheet = ss.getSheetByName('DANH_MUC_HANG');
    if (!dmSheet) {
      install_WAREHOUSE_SHEET();
      dmSheet = ss.getSheetByName('DANH_MUC_HANG');
    }

    const sku = String(payload.sku || '').trim().toUpperCase();
    const name = String(payload.name || '').trim();
    if (!sku || !name) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Mã SKU và Tên hàng hóa!' };
    }

    const vals = dmSheet.getDataRange().getValues();
    const headerCols = vals.length >= 2 ? vals[1].length : 14;
    const is14Cols = headerCols >= 14;

    let existingRow = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === sku) {
        existingRow = i + 1;
        break;
      }
    }

    const cat = String(payload.category || 'Thiết bị').trim();
    const unit = String(payload.unit || 'Chiếc').trim();
    const cost = Number(payload.costPrice) || 0;
    const sell = Number(payload.sellingPrice) || 0;
    const minLim = parseInt(payload.minLimit, 10) || 3;
    const sHn = parseInt(payload.stock_hanoi, 10) || 0;
    const sSg = parseInt(payload.stock_saigon, 10) || 0;
    const sTong = parseInt(payload.stock_tong, 10) || 0;
    const openQty = sHn + sSg + sTong;

    if (existingRow > 0) {
      if (is14Cols) {
        dmSheet.getRange(existingRow, 2, 1, 9).setValues([[
          name, cat, unit, cost, sell, openQty, sHn, sSg, sTong
        ]]);
        dmSheet.getRange(existingRow, 13).setValue(minLim);
      } else {
        dmSheet.getRange(existingRow, 2, 1, 8).setValues([[
          name, cat, unit, cost, sell, sHn, sSg, sTong
        ]]);
        dmSheet.getRange(existingRow, 11).setValue(minLim);
      }
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT MÃ HÀNG', sku, 'Cập nhật SKU ' + sku + ' (' + name + ')');
      return { success: true, message: 'Đã cập nhật mã hàng [' + sku + '] thành công!' };
    } else {
      const nextRow = dmSheet.getLastRow() + 1;
      if (is14Cols) {
        const newRow14 = [
          sku, name, cat, unit, cost, sell, openQty, sHn, sSg, sTong,
          '=H' + nextRow + '+I' + nextRow + '+J' + nextRow,
          '=E' + nextRow + '*K' + nextRow,
          minLim,
          '=IF(K' + nextRow + '<=0, "Hết hàng", IF(K' + nextRow + '<=M' + nextRow + ', "Sắp hết hàng", "An toàn"))'
        ];
        dmSheet.getRange(nextRow, 1, 1, 14).setValues([newRow14]);
        dmSheet.getRange(nextRow, 5, 1, 2).setNumberFormat('#,##0 "₫"');
        dmSheet.getRange(nextRow, 12).setNumberFormat('#,##0 "₫"');
      } else {
        const newRow12 = [
          sku, name, cat, unit, cost, sell, sHn, sSg, sTong,
          '=G' + nextRow + '+H' + nextRow + '+I' + nextRow,
          minLim,
          '=IF(J' + nextRow + '<=K' + nextRow + ', "Cảnh báo thiếu", "Bình thường")'
        ];
        dmSheet.getRange(nextRow, 1, 1, 12).setValues([newRow12]);
        dmSheet.getRange(nextRow, 5, 1, 2).setNumberFormat('#,##0 "₫"');
      }
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'THÊM MÃ HÀNG MỚI', sku, 'Thêm mới SKU ' + sku + ' (' + name + '), Tổng tồn: ' + openQty);
      return { success: true, message: 'Đã thêm mã hàng mới [' + sku + '] vào Google Sheets thành công!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu mã hàng: ' + err.toString() };
  }
}

/**
 * Tạo phiếu Nhập kho / Xuất kho / Điều chuyển + Tự động tính lại Giá vốn bình quân liên hoàn + Ghi Audit Log
 */
function submitInventoryTx(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dmSheet = ss.getSheetByName('DANH_MUC_HANG');
    const nxSheet = ss.getSheetByName('NHAP_XUAT');

    if (!dmSheet || !nxSheet) {
      return { success: false, message: 'Chưa khởi tạo 6 Tab Trang tính! Vui lòng bấm menu Khởi tạo cấu trúc trước.' };
    }

    const qty = parseInt(data.quantity, 10) || 0;
    if (qty <= 0) {
      return { success: false, message: 'Số lượng trên phiếu phải lớn hơn 0!' };
    }

    const role = data.userRole || 'ADMIN';
    const assignedWh = data.assignedWarehouse || 'ALL';
    if (role === 'KEEPER' && assignedWh !== 'ALL') {
      if (data.type === 'Nhập kho' && data.toWarehouse !== assignedWh) {
        return { success: false, message: 'Phân quyền: Bạn chỉ được phép Nhập hàng vào ' + assignedWh + '!' };
      }
      if (data.type === 'Xuất kho' && data.fromWarehouse !== assignedWh) {
        return { success: false, message: 'Phân quyền: Bạn chỉ được phép Xuất hàng từ ' + assignedWh + '!' };
      }
      if (data.type === 'Điều chuyển' && data.fromWarehouse !== assignedWh && data.toWarehouse !== assignedWh) {
        return { success: false, message: 'Phân quyền: Lệnh điều chuyển phải liên quan đến ' + assignedWh + '!' };
      }
    }

    const dmValues = dmSheet.getDataRange().getValues();
    const is14Cols = (dmValues.length >= 2 && dmValues[1].length >= 14);
    const colHn = is14Cols ? 8 : 7; // 1-based index

    let targetRowNum = -1;
    let currentItem = null;

    for (let i = 2; i < dmValues.length; i++) {
      if (String(dmValues[i][0]).trim() === String(data.sku).trim()) {
        targetRowNum = i + 1;
        currentItem = {
          sku: dmValues[i][0],
          name: dmValues[i][1],
          unit: dmValues[i][3] || 'Chiếc',
          costPrice: Number(dmValues[i][4]) || 0,
          sellingPrice: Number(dmValues[i][5]) || 0,
          stockHn: Number(dmValues[i][colHn - 1]) || 0,
          stockSg: Number(dmValues[i][colHn]) || 0,
          stockTong: Number(dmValues[i][colHn + 1]) || 0
        };
        break;
      }
    }

    if (targetRowNum === -1 || !currentItem) {
      return { success: false, message: 'Không tìm thấy mã hàng ' + data.sku + ' trong Danh mục!' };
    }

    if (data.type === 'Xuất kho' || data.type === 'Điều chuyển') {
      let sourceStock = 0;
      if (data.fromWarehouse === 'Kho Hà Nội') sourceStock = currentItem.stockHn;
      else if (data.fromWarehouse === 'Kho Sài Gòn') sourceStock = currentItem.stockSg;
      else if (data.fromWarehouse === 'Kho Tổng') sourceStock = currentItem.stockTong;

      if (qty > sourceStock) {
        return {
          success: false,
          message: 'Cảnh báo âm kho: ' + data.fromWarehouse + ' chỉ còn tồn ' + sourceStock + ' ' + currentItem.unit + ', không đủ xuất ' + qty + '!'
        };
      }
    }

    const typePrefix = data.type === 'Nhập kho' ? 'PNK' : data.type === 'Xuất kho' ? 'PXK' : 'PDC';
    const code = data.code || (typePrefix + '-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmm'));
    const txDate = data.txDate ? (data.txDate + ' ' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'HH:mm')) : Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    const unitPrice = Number(data.unitPrice) || currentItem.costPrice;
    const totalVal = qty * unitPrice;

    let newCostPrice = currentItem.costPrice;
    const oldTotalStock = currentItem.stockHn + currentItem.stockSg + currentItem.stockTong;
    if (data.type === 'Nhập kho' && unitPrice > 0) {
      if (oldTotalStock <= 0) {
        newCostPrice = unitPrice;
      } else {
        newCostPrice = Math.round(((oldTotalStock * currentItem.costPrice) + (qty * unitPrice)) / (oldTotalStock + qty));
      }
      dmSheet.getRange(targetRowNum, 5).setValue(newCostPrice);
    }

    let nextHn = currentItem.stockHn;
    let nextSg = currentItem.stockSg;
    let nextTong = currentItem.stockTong;

    if (data.type === 'Nhập kho') {
      if (data.toWarehouse === 'Kho Hà Nội') nextHn += qty;
      else if (data.toWarehouse === 'Kho Sài Gòn') nextSg += qty;
      else if (data.toWarehouse === 'Kho Tổng') nextTong += qty;
    } else if (data.type === 'Xuất kho') {
      if (data.fromWarehouse === 'Kho Hà Nội') nextHn = Math.max(0, nextHn - qty);
      else if (data.fromWarehouse === 'Kho Sài Gòn') nextSg = Math.max(0, nextSg - qty);
      else if (data.fromWarehouse === 'Kho Tổng') nextTong = Math.max(0, nextTong - qty);
    } else if (data.type === 'Điều chuyển') {
      if (data.fromWarehouse === 'Kho Hà Nội') nextHn = Math.max(0, nextHn - qty);
      else if (data.fromWarehouse === 'Kho Sài Gòn') nextSg = Math.max(0, nextSg - qty);
      else if (data.fromWarehouse === 'Kho Tổng') nextTong = Math.max(0, nextTong - qty);

      if (data.toWarehouse === 'Kho Hà Nội') nextHn += qty;
      else if (data.toWarehouse === 'Kho Sài Gòn') nextSg += qty;
      else if (data.toWarehouse === 'Kho Tổng') nextTong += qty;
    }

    dmSheet.getRange(targetRowNum, colHn, 1, 3).setValues([[nextHn, nextSg, nextTong]]);

    nxSheet.appendRow([
      code,
      txDate,
      data.type,
      currentItem.sku,
      currentItem.name,
      currentItem.unit,
      qty,
      unitPrice,
      totalVal,
      data.fromWarehouse || 'Nhà cung cấp ngoài',
      data.toWarehouse || 'Giao khách hàng',
      data.partner || 'Đối tác kinh doanh',
      data.createdBy || 'Quản trị viên',
      data.notes || ''
    ]);

    const lastNxRow = nxSheet.getLastRow();
    nxSheet.getRange(lastNxRow, 8, 1, 2).setNumberFormat('#,##0 "₫"');

    writeAuditLog(
      ss,
      data.username || 'admin',
      data.createdBy || 'Quản trị viên',
      'LẬP PHIẾU ' + data.type.toUpperCase(),
      code,
      data.type + ' ' + qty + ' ' + currentItem.unit + ' [' + currentItem.sku + '] (' + (data.fromWarehouse || '') + ' -> ' + (data.toWarehouse || '') + '). Giá vốn BQ: ' + newCostPrice
    );

    return {
      success: true,
      message: 'Đã ghi sổ phiếu ' + code + ' và cập nhật tồn kho + giá vốn bình quân thành công!',
      code: code,
      newCostPrice: newCostPrice
    };
  } catch (err) {
    return {
      success: false,
      message: 'Lỗi xử lý chứng từ kho: ' + err.toString()
    };
  }
}

/**
 * Lưu cấu hình thông tin doanh nghiệp & biểu mẫu in
 */
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

    writeAuditLog(ss, configPayload.username || 'admin', configPayload.actorName || 'Admin', 'CẬP NHẬT CẤU HÌNH', 'CAU_HINH', 'Thay đổi thông tin doanh nghiệp / phương pháp tính giá vốn');
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

function parseCurrency(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const clean = String(str).replace(/[^\d.-]/g, '');
  return parseFloat(clean) || 0;
}

function getFallbackWarehouseData() {
  const settings = {
    COMPANY_NAME: 'CÔNG TY TNHH CÔNG NGHỆ & THIẾT BỊ NEXSIMPLE VIỆT NAM',
    COMPANY_ADDRESS: 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM',
    COMPANY_PHONE: '0974 755 104',
    COMPANY_TAX: '0318899221',
    COSTING_METHOD: 'WEIGHTED_AVERAGE',
    ALLOW_NEGATIVE_STOCK: 'FALSE',
    PRINT_TEMPLATE_STANDARD: 'Mẫu số 01-VT / 02-VT (Ban hành theo Thông tư 200/2014/TT-BTC Bộ Tài Chính)'
  };

  const users = [
    { username: 'admin', password: '123456', fullName: 'Nguyễn Minh Tuấn', role: 'ADMIN', assignedWarehouse: 'ALL', permissionsDesc: 'Toàn quyền hệ thống (Tất cả các kho)', status: 'Hoạt động' },
    { username: 'ketoan', password: '123456', fullName: 'Hoàng Thu Trang', role: 'ACCOUNTANT', assignedWarehouse: 'ALL', permissionsDesc: 'Kế toán kho (Xem toàn kho, Lập phiếu, Xuất N-X-T)', status: 'Hoạt động' },
    { username: 'thukho_hn', password: '123456', fullName: 'Trần Đình Trọng', role: 'KEEPER', assignedWarehouse: 'Kho Hà Nội', permissionsDesc: 'Thủ kho chi nhánh (Chỉ phụ trách Kho Hà Nội)', status: 'Hoạt động' },
    { username: 'thukho_sg', password: '123456', fullName: 'Lê Hoàng Nam', role: 'KEEPER', assignedWarehouse: 'Kho Sài Gòn', permissionsDesc: 'Thủ kho chi nhánh (Chỉ phụ trách Kho Sài Gòn)', status: 'Hoạt động' }
  ];

  const items = [
    { sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame Body', category: 'Thiết bị ghi hình', unit: 'Chiếc', costPrice: 72000000, sellingPrice: 85000000, openingStock: 9, stock_hanoi: 4, stock_saigon: 3, stock_tong: 5, totalStock: 12, inventoryValue: 864000000, minLimit: 4, alertStatus: 'An toàn' },
    { sku: 'SKU-LEN-2470', name: 'Ống kính Sony FE 24-70mm f/2.8 GM II', category: 'Ống kính', unit: 'Chiếc', costPrice: 38000000, sellingPrice: 46000000, openingStock: 10, stock_hanoi: 2, stock_saigon: 4, stock_tong: 6, totalStock: 12, inventoryValue: 456000000, minLimit: 4, alertStatus: 'An toàn' },
    { sku: 'SKU-DRO-M3C', name: 'Flycam DJI Mavic 3 Cine Premium Combo', category: 'Flycam & Drone', unit: 'Bộ', costPrice: 85000000, sellingPrice: 99000000, openingStock: 4, stock_hanoi: 1, stock_saigon: 1, stock_tong: 0, totalStock: 2, inventoryValue: 170000000, minLimit: 3, alertStatus: 'Sắp hết hàng' },
    { sku: 'SKU-LGT-600D', name: 'Đèn Aputure Light Storm LS 600d Pro', category: 'Ánh sáng Studio', unit: 'Bộ', costPrice: 42000000, sellingPrice: 49500000, openingStock: 15, stock_hanoi: 5, stock_saigon: 4, stock_tong: 8, totalStock: 17, inventoryValue: 714000000, minLimit: 5, alertStatus: 'An toàn' },
    { sku: 'SKU-MIC-EWDP', name: 'Micro Sennheiser EW-DP ME 2 Digital', category: 'Thiết bị âm thanh', unit: 'Bộ', costPrice: 14500000, sellingPrice: 18000000, openingStock: 18, stock_hanoi: 6, stock_saigon: 8, stock_tong: 10, totalStock: 24, inventoryValue: 348000000, minLimit: 6, alertStatus: 'An toàn' },
    { sku: 'SKU-GIM-RS3P', name: 'Gimbal Chống Rung DJI RS 3 Pro Combo', category: 'Phụ kiện Grip', unit: 'Chiếc', costPrice: 18000000, sellingPrice: 22500000, openingStock: 3, stock_hanoi: 1, stock_saigon: 1, stock_tong: 1, totalStock: 3, inventoryValue: 54000000, minLimit: 4, alertStatus: 'Sắp hết hàng' },
    { sku: 'SKU-MON-AT5', name: 'Màn hình Atomos Ninja V+ 5.2" 8K HDR', category: 'Thiết bị ghi hình', unit: 'Chiếc', costPrice: 19500000, sellingPrice: 24000000, openingStock: 6, stock_hanoi: 3, stock_saigon: 2, stock_tong: 4, totalStock: 9, inventoryValue: 175500000, minLimit: 3, alertStatus: 'An toàn' },
    { sku: 'SKU-BAT-V150', name: 'Pin V-Mount SmallRig VB155 Mini 155Wh', category: 'Phụ kiện Nguồn', unit: 'Viên', costPrice: 6200000, sellingPrice: 7900000, openingStock: 5, stock_hanoi: 0, stock_saigon: 0, stock_tong: 0, totalStock: 0, inventoryValue: 0, minLimit: 5, alertStatus: 'Hết hàng' }
  ];

  const logs = [
    { code: 'PNK-2026-1001', timestamp: '2026-10-01 09:00', type: 'Nhập kho', sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame Body', unit: 'Chiếc', quantity: 5, unitPrice: 72000000, totalVal: 360000000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Hà Nội', partner: 'Công ty TNHH Sony Electronics VN', createdBy: 'Trần Đình Trọng', notes: 'Nhập lô máy quay chính hãng CO/CQ đợt 1' },
    { code: 'PNK-2026-1002', timestamp: '2026-10-03 10:20', type: 'Nhập kho', sku: 'SKU-LEN-2470', name: 'Ống kính Sony FE 24-70mm f/2.8 GM II', unit: 'Chiếc', quantity: 4, unitPrice: 38000000, totalVal: 152000000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Sài Gòn', partner: 'Công ty TNHH Sony Electronics VN', createdBy: 'Lê Hoàng Nam', notes: 'Nhập bổ sung ống kính GM II cho chi nhánh Nam' },
    { code: 'PXK-2026-1005', timestamp: '2026-10-05 14:15', type: 'Xuất kho', sku: 'SKU-CAM-FX3', name: 'Sony FX3 Cinema Line Full-Frame Body', unit: 'Chiếc', quantity: 2, unitPrice: 85000000, totalVal: 170000000, fromWarehouse: 'Kho Hà Nội', toWarehouse: 'Giao khách hàng', partner: 'Đài Truyền Hình Kỹ Thuật Số VTC', createdBy: 'Trần Đình Trọng', notes: 'Xuất bán theo Hợp đồng kinh tế số 88/HĐKT' },
    { code: 'PDC-2026-1007', timestamp: '2026-10-07 11:30', type: 'Điều chuyển', sku: 'SKU-LGT-600D', name: 'Đèn Aputure Light Storm LS 600d Pro', unit: 'Bộ', quantity: 3, unitPrice: 42000000, totalVal: 126000000, fromWarehouse: 'Kho Tổng', toWarehouse: 'Kho Hà Nội', partner: 'Điều chuyển nội bộ hệ thống', createdBy: 'Nguyễn Minh Tuấn', notes: 'Luân chuyển thiết bị ánh sáng tăng cường miền Bắc' },
    { code: 'PNK-2026-1009', timestamp: '2026-10-09 08:45', type: 'Nhập kho', sku: 'SKU-MIC-EWDP', name: 'Micro Sennheiser EW-DP ME 2 Digital', unit: 'Bộ', quantity: 6, unitPrice: 14500000, totalVal: 87000000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Tổng', partner: 'Nhà Phân Phối Âm Thanh Hoàng Bảo Khoa', createdBy: 'Hoàng Thu Trang', notes: 'Nhập kho tổng phân phối toàn quốc' },
    { code: 'PXK-2026-1011', timestamp: '2026-10-11 16:00', type: 'Xuất kho', sku: 'SKU-DRO-M3C', name: 'Flycam DJI Mavic 3 Cine Premium Combo', unit: 'Bộ', quantity: 2, unitPrice: 99000000, totalVal: 198000000, fromWarehouse: 'Kho Sài Gòn', toWarehouse: 'Giao khách hàng', partner: 'Production House RedPixel Studio', createdBy: 'Lê Hoàng Nam', notes: 'Xuất bán trọn bộ kèm gói bảo hành DJI Care' },
    { code: 'PXK-2026-1013', timestamp: '2026-10-13 15:10', type: 'Xuất kho', sku: 'SKU-LEN-2470', name: 'Ống kính Sony FE 24-70mm f/2.8 GM II', unit: 'Chiếc', quantity: 2, unitPrice: 46000000, totalVal: 92000000, fromWarehouse: 'Kho Sài Gòn', toWarehouse: 'Giao khách hàng', partner: 'Production House RedPixel Studio', createdBy: 'Lê Hoàng Nam', notes: 'Xuất kèm đơn hàng Flycam RedPixel' },
    { code: 'PNK-2026-1015', timestamp: '2026-10-15 09:30', type: 'Nhập kho', sku: 'SKU-MON-AT5', name: 'Màn hình Atomos Ninja V+ 5.2" 8K HDR', unit: 'Chiếc', quantity: 3, unitPrice: 19500000, totalVal: 58500000, fromWarehouse: 'Nhà cung cấp ngoài', toWarehouse: 'Kho Hà Nội', partner: 'Công ty Cổ phần Thiết Bị Phim Trường Việt', createdBy: 'Trần Đình Trọng', notes: 'Nhập màn hình monitor 8K phục vụ dự án Q4' }
  ];

  const auditLogs = [
    { timestamp: '2026-10-15 09:30:12', username: 'thukho_hn', actorName: 'Trần Đình Trọng (KEEPER)', action: 'LẬP PHIẾU NHẬP KHO', refCode: 'PNK-2026-1015', detail: 'Nhập 3 Chiếc [SKU-MON-AT5] vào Kho Hà Nội. Cập nhật giá vốn bình quân.' },
    { timestamp: '2026-10-13 15:10:05', username: 'thukho_sg', actorName: 'Lê Hoàng Nam (KEEPER)', action: 'LẬP PHIẾU XUẤT KHO', refCode: 'PXK-2026-1013', detail: 'Xuất 2 Chiếc [SKU-LEN-2470] từ Kho Sài Gòn cho RedPixel Studio.' },
    { timestamp: '2026-10-07 11:30:00', username: 'admin', actorName: 'Nguyễn Minh Tuấn (ADMIN)', action: 'ĐIỀU CHUYỂN KHO', refCode: 'PDC-2026-1007', detail: 'Điều chuyển 3 Bộ [SKU-LGT-600D] từ Kho Tổng -> Kho Hà Nội.' }
  ];

  return buildWarehouseResponse(items, logs, settings, users, auditLogs, true);
}
