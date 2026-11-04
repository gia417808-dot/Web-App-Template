/**
 * ============================================================================
 * GS-005: WEBAPP QUẢN LÝ NHÀ HÀNG, CAFE, POS TÍNH GIỜ & VIETQR ĐỘNG (V3.3 PRO)
 * BACKEND CONTROLLER, TABLE ORDERING, BILLING, VIP MEMBERS, KDS & AUDIT (CODE.GS)
 * Archetype: Point of Sale & F&B (Golden Master v3.3)
 * ============================================================================
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('F&B POS Quản Lý Nhà Hàng, Cafe, Hội Viên VIP & Bếp KDS v3.3 Pro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('☕ F&B POS NHÀ HÀNG & CAFE PRO (v3.3)')
    .addItem('⚡ 1. Khởi tạo / Làm mới 9 Tab Chuẩn Thương Mại (v3.3)', 'install_POS_SHEET')
    .addSeparator()
    .addItem('🖥️ 2. Mở Web App Thu Ngân POS (Toàn Màn Hình / Full Screen)', 'openPosDialog')
    .addToUi();
}

function openPosDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1920)
    .setHeight(1080)
    .setTitle('Hệ Thống F&B POS Quản Lý Nhà Hàng, Cafe, Hội Viên VIP, Bếp KDS & VietQR v3.3 Pro');
  SpreadsheetApp.getUi().showModalDialog(html, '☕ Web App F&B POS Thu Ngân & Gọi Món v3.3 (Nhấn nút 🔲 Toàn Màn Hình trên thanh công cụ để phóng cực đại)');
}

function openPosWebApp() {
  openPosDialog();
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

function normalizeDateStr(rawVal, dispVal) {
  if (rawVal && Object.prototype.toString.call(rawVal) === '[object Date]' && !isNaN(rawVal.getTime())) {
    return Utilities.formatDate(rawVal, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
  }
  const str = String(dispVal || rawVal || '').trim();
  if (!str) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str;
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(.*)$/);
  if (slashMatch) {
    const p1 = parseInt(slashMatch[1], 10);
    const p2 = parseInt(slashMatch[2], 10);
    const yr = slashMatch[3];
    const timePart = (slashMatch[4] || ' 10:00').trim();
    const mm = String(p1 <= 12 ? p1 : p2).padStart(2, '0');
    const dd = String(p1 <= 12 ? p2 : p1).padStart(2, '0');
    return yr + '-' + mm + '-' + dd + (timePart ? ' ' + timePart : '');
  }
  return str;
}

function getDefaultUsersList() {
  return [
    { username: 'admin', password: '123456', fullName: 'Nguyễn Minh Tuấn', role: 'ADMIN', assignedZone: 'ALL', permissionsDesc: 'Quản lý toàn quyền (Xem doanh thu, Sửa thực đơn, Quản lý Hội viên VIP, Cấu hình VietQR, Phân quyền)', status: 'Hoạt động' },
    { username: 'thungan_ca1', password: '123456', fullName: 'Lê Thu Trang', role: 'CASHIER', assignedZone: 'ALL', permissionsDesc: 'Thu ngân POS (Tính tiền, In hóa đơn K80, Thêm/Đổi hạng Hội viên VIP, Check VietQR)', status: 'Hoạt động' },
    { username: 'order_tang1', password: '123456', fullName: 'Nguyễn Văn Minh', role: 'STAFF', assignedZone: 'Tầng 1 — Cafe & Sân Vườn', permissionsDesc: 'Phục vụ gọi món (Mở bàn, Chọn món, Gửi đơn cho bếp KDS, Nhận món giao bàn)', status: 'Hoạt động' },
    { username: 'order_bida', password: '123456', fullName: 'Hoàng Văn Bách', role: 'STAFF', assignedZone: 'Khu Bida & Phòng VIP Tính Giờ', permissionsDesc: 'Phục vụ khu bida/VIP (Bật giờ chơi bida, Gọi đồ uống, Gửi đơn bếp)', status: 'Hoạt động' },
    { username: 'bep_truong', password: '123456', fullName: 'Trần Văn Đầu Bếp', role: 'KITCHEN', assignedZone: 'Bếp & Pha Chế (KDS)', permissionsDesc: 'Màn hình Bếp KDS (Nhận đơn -> Đang chế biến -> Báo xong món -> Giao phục vụ)', status: 'Hoạt động' }
  ];
}

function ensureAuxSheetsExist(ss) {
  const fallback = getFallbackPosData();

  // Tự động khởi tạo tab HOI_VIEN_VIP nếu Sheet cũ từ bản v3.0/v3.1 chưa có
  let hvSheet = ss.getSheetByName('HOI_VIEN_VIP');
  if (!hvSheet) {
    hvSheet = ss.insertSheet('HOI_VIEN_VIP');
    hvSheet.setTabColor('#0EA5E9');
    hvSheet.getRange('A1:I1').merge()
      .setValue('DANH SÁCH HỘI VIÊN THÂN THIẾT (MEMBER) & CƠ CHẾ PHÂN HẠNG BẠC / VÀNG / BẠCH KIM')
      .setFontSize(13).setFontWeight('bold').setBackground('#0369A1').setFontColor('#FFFFFF')
      .setHorizontalAlignment('center');
    const hvHeaders = ['Mã Hội Viên', 'Họ Và Tên Hội Viên', 'Số Điện Thoại', 'Hạng Thẻ Hiện Tại', 'Tổng Chi Tiêu Tích Lũy (₫)', 'Số Lượt Đến', 'Cơ Chế Phân Hạng', 'Trạng Thái Thẻ', 'Ghi Chú Ưu Đãi'];
    hvSheet.getRange(2, 1, 1, hvHeaders.length).setValues([hvHeaders]).setFontWeight('bold').setBackground('#E0F2FE');
    hvSheet.setFrozenRows(2);
    hvSheet.getRange('C3:C100').setNumberFormat('@');
    const hvRows = fallback.vipMembers.map(function(m) {
      return [m.id, m.name, m.phone, m.tier, m.spent, m.visits, m.tierMode || 'Tự động theo chi tiêu', m.status || 'Hoạt động', m.notes || ''];
    });
    hvSheet.getRange(3, 1, hvRows.length, hvHeaders.length).setValues(hvRows);
    hvSheet.getRange(3, 5, hvRows.length, 1).setNumberFormat('#,##0 "₫"');
  }

  // Tự động khởi tạo tab PHIEU_BEP_KDS nếu Sheet cũ từ bản v3.0/v3.1 chưa có
  let kdsSheet = ss.getSheetByName('PHIEU_BEP_KDS');
  if (!kdsSheet) {
    kdsSheet = ss.insertSheet('PHIEU_BEP_KDS');
    kdsSheet.setTabColor('#EA580C');
    kdsSheet.getRange('A1:H1').merge()
      .setValue('ĐIỀU PHỐI PHIẾU CHẾ BIẾN BẾP & QUẦY PHA CHẾ (KDS WORKFLOW REAL-TIME)')
      .setFontSize(13).setFontWeight('bold').setBackground('#C2410C').setFontColor('#FFFFFF')
      .setHorizontalAlignment('center');
    const kdsHeaders = ['Mã Phiếu KDS', 'Mã Bàn', 'Tên Bàn / Phòng', 'Khu Vực', 'Giờ Gửi Bếp', 'Nhân Viên Order', 'Trạng Thái Phiếu Bếp', 'Chi Tiết Món (JSON)'];
    kdsSheet.getRange(2, 1, 1, kdsHeaders.length).setValues([kdsHeaders]).setFontWeight('bold').setBackground('#FFEDD5');
    kdsSheet.setFrozenRows(2);
    kdsSheet.getRange('E3:E100').setNumberFormat('@');
    const kdsRows = fallback.kitchenTickets.map(function(k) {
      return [k.ticketId, k.tableCode, k.tableName, k.zone || '', k.orderTime || '', k.waiter || '', k.status || 'Chờ chế biến', JSON.stringify(k.items || [])];
    });
    kdsSheet.getRange(3, 1, kdsRows.length, kdsHeaders.length).setValues(kdsRows);
  }
}

function ensurePosSheetsExist() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return null;
    if (!ss.getSheetByName('SO_DO_BAN') || !ss.getSheetByName('THUC_DON') || !ss.getSheetByName('HOA_DON')) {
      install_POS_SHEET();
    } else {
      ensureAuxSheetsExist(ss);
    }
    return ss;
  } catch (e) {
    return null;
  }
}

function computeTierBySpent(spentAmount, settings) {
  const s = settings || {};
  const platMin = Number(s.TIER_PLATINUM_MIN) || 15000000;
  const goldMin = Number(s.TIER_GOLD_MIN) || 8000000;
  const silvMin = Number(s.TIER_SILVER_MIN) || 3000000;
  const pPct = s.DISCOUNT_PLATINUM || '15';
  const gPct = s.DISCOUNT_GOLD || '10';
  const sPct = s.DISCOUNT_SILVER || '5';

  const val = Number(spentAmount) || 0;
  if (val >= platMin) return 'Bạch Kim (Platinum - ' + pPct + '%)';
  if (val >= goldMin) return 'Vàng (Gold - ' + gPct + '%)';
  if (val >= silvMin) return 'Bạc (Silver - ' + sPct + '%)';
  return 'Thân Thiết (Member - 0%)';
}

function getPosData() {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) {
      return getFallbackPosData();
    }

    const sdbSheet = ss.getSheetByName('SO_DO_BAN');
    const tdSheet = ss.getSheetByName('THUC_DON');
    const hdSheet = ss.getSheetByName('HOA_DON');
    const hvSheet = ss.getSheetByName('HOI_VIEN_VIP');
    const kdsSheet = ss.getSheetByName('PHIEU_BEP_KDS');
    const pqSheet = ss.getSheetByName('PHAN_QUYEN');
    const chSheet = ss.getSheetByName('CAU_HINH');
    const nkSheet = ss.getSheetByName('NHAT_KY');

    if (!sdbSheet || !tdSheet || !hdSheet) {
      return getFallbackPosData();
    }

    const fallback = getFallbackPosData();
    const settings = Object.assign({}, fallback.settings);
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
          role: String(r[3] || '').trim() || 'STAFF',
          assignedZone: String(r[4] || '').trim() || 'ALL',
          permissionsDesc: String(r[5] || '').trim(),
          status: String(r[6] || '').trim() || 'Hoạt động'
        });
      }
    }
    const finalUsers = users.length > 0 ? users : fallback.users;

    // Đọc THUC_DON
    const tdRaw = tdSheet.getDataRange().getValues();
    const tdDisp = tdSheet.getDataRange().getDisplayValues();
    const menuItems = [];
    if (tdDisp.length > 2) {
      for (let i = 2; i < tdDisp.length; i++) {
        const dRow = tdDisp[i];
        const rRow = tdRaw[i] || dRow;
        const code = String(dRow[0] || '').trim();
        if (!code) continue;
        menuItems.push({
          code: code,
          name: String(dRow[1] || '').trim(),
          category: String(dRow[2] || 'Khác').trim(),
          unit: String(dRow[3] || 'Phần').trim(),
          price: parseCurrency(rRow[4], dRow[4]),
          costPrice: parseCurrency(rRow[5], dRow[5]),
          promo: String(dRow[6] || 'Không').trim(),
          kitchenStation: String(dRow[7] || 'Bếp').trim(),
          status: String(dRow[8] || 'Còn hàng').trim(),
          notes: String(dRow[9] || '').trim()
        });
      }
    }
    const finalMenu = menuItems.length > 0 ? menuItems : fallback.menuItems;

    // Đọc SO_DO_BAN
    const sdbRaw = sdbSheet.getDataRange().getValues();
    const sdbDisp = sdbSheet.getDataRange().getDisplayValues();
    const tables = [];
    if (sdbDisp.length > 2) {
      for (let i = 2; i < sdbDisp.length; i++) {
        const dRow = sdbDisp[i];
        const rRow = sdbRaw[i] || dRow;
        const code = String(dRow[0] || '').trim();
        if (!code) continue;
        tables.push({
          code: code,
          name: String(dRow[1] || '').trim(),
          zone: String(dRow[2] || 'Tầng 1 — Cafe & Sân Vườn').trim(),
          serviceType: String(dRow[3] || 'Bàn Cafe thường').trim(),
          status: String(dRow[4] || 'Trống').trim(),
          hourlyRate: parseCurrency(rRow[5], dRow[5]),
          openTime: normalizeDateStr(rRow[6], dRow[6]),
          guestCount: parseInt(rRow[7] || dRow[7], 10) || 0,
          dishAmount: parseCurrency(rRow[8], dRow[8]),
          hourAmount: parseCurrency(rRow[9], dRow[9]),
          totalAmount: parseCurrency(rRow[10], dRow[10]),
          notes: String(dRow[11] || '').trim(),
          kdsStatus: String(dRow[12] || '').trim() || (String(dRow[4] || '').trim() === 'Trống' ? '---' : 'Đang chế biến')
        });
      }
    }
    const finalTables = tables.length > 0 ? tables : fallback.tables;

    // Đọc HOA_DON
    const hdRaw = hdSheet.getDataRange().getValues();
    const hdDisp = hdSheet.getDataRange().getDisplayValues();
    const invoices = [];
    if (hdDisp.length > 2) {
      for (let i = 2; i < hdDisp.length; i++) {
        const dRow = hdDisp[i];
        const rRow = hdRaw[i] || dRow;
        const code = String(dRow[0] || '').trim();
        if (!code) continue;
        invoices.push({
          code: code,
          date: normalizeDateStr(rRow[1], dRow[1]),
          tableName: String(dRow[2] || '').trim(),
          waiter: String(dRow[3] || '').trim(),
          cashier: String(dRow[4] || '').trim(),
          customer: String(dRow[5] || 'Khách vãng lai').trim(),
          vipTier: String(dRow[6] || 'Vãng lai (0%)').trim(),
          dishAmount: parseCurrency(rRow[7], dRow[7]),
          timeUsed: String(dRow[8] || '0').trim(),
          hourAmount: parseCurrency(rRow[9], dRow[9]),
          discount: parseCurrency(rRow[10], dRow[10]),
          totalAmount: parseCurrency(rRow[11], dRow[11]),
          paymentMethod: String(dRow[12] || 'VietQR Động').trim(),
          status: String(dRow[13] || 'Đã tất toán').trim()
        });
      }
    }
    const finalInvoices = invoices.length > 0 ? invoices : fallback.invoices;

    // Đọc HOI_VIEN_VIP
    const vipMembers = [];
    if (hvSheet && hvSheet.getLastRow() >= 3) {
      const hvRaw = hvSheet.getDataRange().getValues();
      const hvDisp = hvSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < hvDisp.length; i++) {
        const dRow = hvDisp[i];
        const rRow = hvRaw[i] || dRow;
        const id = String(dRow[0] || '').trim();
        if (!id) continue;
        vipMembers.push({
          id: id,
          name: String(dRow[1] || '').trim(),
          phone: String(dRow[2] || '').trim(),
          tier: String(dRow[3] || 'Bạc (Silver - 5%)').trim(),
          spent: parseCurrency(rRow[4], dRow[4]),
          visits: parseInt(rRow[5] || dRow[5], 10) || 1,
          tierMode: String(dRow[6] || 'Tự động theo chi tiêu').trim(),
          status: String(dRow[7] || 'Hoạt động').trim(),
          notes: String(dRow[8] || '').trim()
        });
      }
    }
    const finalVipMembers = vipMembers.length > 0 ? vipMembers : fallback.vipMembers;

    // Đọc PHIEU_BEP_KDS
    const kitchenTickets = [];
    if (kdsSheet && kdsSheet.getLastRow() >= 3) {
      const kdsDisp = kdsSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < kdsDisp.length; i++) {
        const dRow = kdsDisp[i];
        const ticketId = String(dRow[0] || '').trim();
        if (!ticketId) continue;
        let parsedItems = [];
        try {
          parsedItems = JSON.parse(dRow[7] || '[]');
        } catch (e) {
          parsedItems = [];
        }
        kitchenTickets.push({
          ticketId: ticketId,
          tableCode: String(dRow[1] || '').trim(),
          tableName: String(dRow[2] || '').trim(),
          zone: String(dRow[3] || '').trim(),
          orderTime: String(dRow[4] || '').trim(),
          waiter: String(dRow[5] || '').trim(),
          status: String(dRow[6] || 'Chờ chế biến').trim(),
          items: parsedItems
        });
      }
    }
    const finalKitchenTickets = kitchenTickets.length > 0 ? kitchenTickets : fallback.kitchenTickets;

    // Đọc NHAT_KY
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
    const finalLogs = auditLogs.length > 0 ? auditLogs.reverse() : fallback.auditLogs;

    return buildPosResponse(finalTables, finalMenu, finalInvoices, settings, finalUsers, finalLogs, finalVipMembers, finalKitchenTickets, false);
  } catch (err) {
    return getFallbackPosData();
  }
}

function buildPosResponse(tables, menuItems, invoices, settings, users, auditLogs, vipMembers, kitchenTickets, isFallback) {
  let totalRevenue = 0;
  let totalDishesRevenue = 0;
  let totalHourRevenue = 0;
  let occupiedTables = 0;
  let availableTables = 0;
  let currentPendingAmount = 0;

  for (let t = 0; t < tables.length; t++) {
    const tbl = tables[t];
    if (tbl.status === 'Đang phục vụ' || tbl.status === 'Chờ thanh toán') {
      occupiedTables++;
      currentPendingAmount += Number(tbl.totalAmount) || 0;
    } else if (tbl.status === 'Trống') {
      availableTables++;
    }
  }

  for (let i = 0; i < invoices.length; i++) {
    const inv = invoices[i];
    if (inv.status === 'Đã tất toán') {
      totalRevenue += Number(inv.totalAmount) || 0;
      totalDishesRevenue += Number(inv.dishAmount) || 0;
      totalHourRevenue += Number(inv.hourAmount) || 0;
    }
  }

  return {
    success: true,
    isFallback: Boolean(isFallback),
    settings: settings,
    users: users,
    tables: tables,
    menuItems: menuItems,
    invoices: invoices,
    vipMembers: vipMembers || [],
    kitchenTickets: kitchenTickets || [],
    auditLogs: auditLogs,
    kpi: {
      totalRevenue: totalRevenue,
      totalDishesRevenue: totalDishesRevenue,
      totalHourRevenue: totalHourRevenue,
      invoiceCount: invoices.length,
      occupiedTables: occupiedTables,
      availableTables: availableTables,
      currentPendingAmount: currentPendingAmount
    }
  };
}

// ============================================================================
// QUẢN LÝ HỘI VIÊN VIP & ĐỔI CƠ CHẾ PHÂN HẠNG (VIP MEMBER & TIER MECHANISM)
// ============================================================================
function saveVipMember(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu hội viên trên phiên làm việc!' };
    const hvSheet = ss.getSheetByName('HOI_VIEN_VIP');
    const chSheet = ss.getSheetByName('CAU_HINH');

    const settings = {};
    if (chSheet && chSheet.getLastRow() >= 3) {
      const chVals = chSheet.getDataRange().getDisplayValues();
      for (let i = 2; i < chVals.length; i++) {
        if (chVals[i][0]) settings[String(chVals[i][0]).trim()] = String(chVals[i][1] || '').trim();
      }
    }

    const id = String(payload.id || ('VIP-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'mmss'))).trim().toUpperCase();
    const name = String(payload.name || '').trim();
    const phone = String(payload.phone || '').trim();
    if (!name) return { success: false, message: 'Vui lòng nhập Họ và tên Hội viên!' };

    const spent = Math.max(0, Number(payload.spent) || 0);
    const visits = Math.max(1, parseInt(payload.visits, 10) || 1);
    const tierMode = String(payload.tierMode || 'Tự động theo chi tiêu').trim();
    const status = String(payload.status || 'Hoạt động').trim();
    const notes = String(payload.notes || '').trim();

    let tier = String(payload.tier || 'Bạc (Silver - 5%)').trim();
    if (tierMode === 'Tự động theo chi tiêu' && payload.autoRecalcTier) {
      tier = computeTierBySpent(spent, settings);
    }

    const vals = hvSheet.getDataRange().getValues();
    let rowNum = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === id) {
        rowNum = i + 1;
        break;
      }
    }

    if (rowNum > 0) {
      hvSheet.getRange(rowNum, 3).setNumberFormat('@');
      hvSheet.getRange(rowNum, 2, 1, 8).setValues([[name, phone, tier, spent, visits, tierMode, status, notes]]);
      hvSheet.getRange(rowNum, 5).setNumberFormat('#,##0 "₫"');
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT HỘI VIÊN VIP', id, 'Cập nhật hội viên ' + name + ' (' + tier + ' • ' + tierMode + ')');
      return { success: true, message: 'Đã cập nhật thông tin & hạng thẻ cho hội viên [' + name + ']!', member: { id: id, name: name, phone: phone, tier: tier, spent: spent, visits: visits, tierMode: tierMode, status: status, notes: notes } };
    } else {
      const nextR = hvSheet.getLastRow() + 1;
      hvSheet.getRange(nextR, 3).setNumberFormat('@');
      hvSheet.appendRow([id, name, phone, tier, spent, visits, tierMode, status, notes]);
      hvSheet.getRange(nextR, 5).setNumberFormat('#,##0 "₫"');
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'THÊM HỘI VIÊN VIP MỚI', id, 'Thêm hội viên mới ' + name + ' (' + phone + ' • ' + tier + ')');
      return { success: true, message: 'Đã thêm hội viên mới [' + name + '] vào danh sách VIP!', member: { id: id, name: name, phone: phone, tier: tier, spent: spent, visits: visits, tierMode: tierMode, status: status, notes: notes } };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu hội viên: ' + err.toString() };
  }
}

function deleteVipMember(memberId, actorName) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã xóa hội viên!' };
    const hvSheet = ss.getSheetByName('HOI_VIEN_VIP');
    if (!hvSheet) return { success: false, message: 'Chưa có tab HOI_VIEN_VIP!' };

    const targetId = String(memberId || '').trim().toUpperCase();
    const vals = hvSheet.getDataRange().getValues();
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === targetId) {
        const mName = vals[i][1];
        hvSheet.deleteRow(i + 1);
        SpreadsheetApp.flush();
        writeAuditLog(ss, 'admin', actorName || 'Admin', 'XÓA HỘI VIÊN VIP', targetId, 'Đã xóa hội viên ' + mName + ' (' + targetId + ')');
        return { success: true, message: 'Đã xóa hội viên [' + mName + ']!' };
      }
    }
    return { success: false, message: 'Không tìm thấy mã hội viên ' + targetId };
  } catch (err) {
    return { success: false, message: 'Lỗi xóa hội viên: ' + err.toString() };
  }
}

function saveVipTierMechanism(cfgPayload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu cơ chế phân hạng hội viên!' };
    const chSheet = ss.getSheetByName('CAU_HINH');
    const hvSheet = ss.getSheetByName('HOI_VIEN_VIP');

    const keysToSave = ['DISCOUNT_SILVER', 'DISCOUNT_GOLD', 'DISCOUNT_PLATINUM', 'TIER_SILVER_MIN', 'TIER_GOLD_MIN', 'TIER_PLATINUM_MIN', 'VIP_TIER_MODE'];
    const chVals = chSheet.getDataRange().getValues();
    const existingKeys = {};
    for (let i = 2; i < chVals.length; i++) {
      existingKeys[String(chVals[i][0]).trim()] = i + 1;
    }

    keysToSave.forEach(function(k) {
      if (cfgPayload.hasOwnProperty(k)) {
        if (existingKeys[k]) {
          chSheet.getRange(existingKeys[k], 2).setNumberFormat('@').setValue(String(cfgPayload[k]));
        } else {
          const nextR = chSheet.getLastRow() + 1;
          chSheet.getRange(nextR, 2).setNumberFormat('@');
          chSheet.appendRow([k, String(cfgPayload[k]), 'Cấu hình cơ chế phân hạng hội viên VIP']);
        }
      }
    });

    // Tự động tính lại hạng thẻ cho toàn bộ hội viên có chế độ "Tự động theo chi tiêu" (hoặc nếu ép tính lại tất cả)
    if (hvSheet && hvSheet.getLastRow() >= 3 && cfgPayload.recalcAllMembers) {
      const hvVals = hvSheet.getDataRange().getValues();
      for (let r = 2; r < hvVals.length; r++) {
        const mode = String(hvVals[r][6] || 'Tự động theo chi tiêu').trim();
        if (cfgPayload.forceOverrideAll || mode === 'Tự động theo chi tiêu') {
          const spent = parseCurrency(hvVals[r][4], hvVals[r][4]);
          const newTier = computeTierBySpent(spent, cfgPayload);
          hvSheet.getRange(r + 1, 4).setValue(newTier);
          if (cfgPayload.forceOverrideAll) {
            hvSheet.getRange(r + 1, 7).setValue('Tự động theo chi tiêu');
          }
        }
      }
    }

    SpreadsheetApp.flush();
    writeAuditLog(ss, cfgPayload.username || 'admin', cfgPayload.actorName || 'Admin', 'ĐỔI CƠ CHẾ HẠNG VIP', 'HOI_VIEN_VIP', 'Cập nhật ngưỡng lên hạng Bạc/Vàng/Bạch Kim & % chiết khấu');
    return { success: true, message: 'Đã cập nhật cơ chế phân hạng & tự động đồng bộ hạng thẻ cho các hội viên!' };
  } catch (err) {
    return { success: false, message: 'Lỗi cập nhật cơ chế phân hạng: ' + err.toString() };
  }
}

// ============================================================================
// ĐIỀU PHỐI PHIẾU BẾP KDS & ĐỒNG BỘ TRẠNG THÁI BÀN (KDS WORKFLOW SYNC)
// ============================================================================
function createOrUpdateKdsTicket(ticketPayload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã cập nhật phiếu bếp KDS!' };
    const kdsSheet = ss.getSheetByName('PHIEU_BEP_KDS');
    const sdbSheet = ss.getSheetByName('SO_DO_BAN');

    const ticketId = String(ticketPayload.ticketId || '').trim();
    const tableCode = String(ticketPayload.tableCode || '').trim();
    const tableName = String(ticketPayload.tableName || tableCode).trim();
    const zone = String(ticketPayload.zone || '').trim();
    const orderTime = String(ticketPayload.orderTime || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'HH:mm')).trim();
    const waiter = String(ticketPayload.waiter || 'Phục vụ').trim();
    const status = String(ticketPayload.status || 'Chờ chế biến').trim();
    const itemsJson = JSON.stringify(ticketPayload.items || []);

    if (kdsSheet) {
      const vals = kdsSheet.getDataRange().getValues();
      let rowNum = -1;
      for (let i = 2; i < vals.length; i++) {
        if (String(vals[i][0]).trim() === ticketId) {
          rowNum = i + 1;
          break;
        }
      }
      if (rowNum > 0) {
        kdsSheet.getRange(rowNum, 7, 1, 2).setValues([[status, itemsJson]]);
      } else {
        const nextR = kdsSheet.getLastRow() + 1;
        kdsSheet.getRange(nextR, 5).setNumberFormat('@');
        kdsSheet.appendRow([ticketId, tableCode, tableName, zone, orderTime, waiter, status, itemsJson]);
      }
    }

    // Đồng bộ trạng thái bếp lên cột 13 (Trạng Thái Bếp KDS) của SO_DO_BAN
    if (sdbSheet && tableCode) {
      const sdbVals = sdbSheet.getDataRange().getValues();
      for (let j = 2; j < sdbVals.length; j++) {
        if (String(sdbVals[j][0]).trim().toUpperCase() === tableCode.toUpperCase()) {
          sdbSheet.getRange(j + 1, 13).setValue(status);
          break;
        }
      }
    }

    SpreadsheetApp.flush();
    writeAuditLog(ss, ticketPayload.username || 'kitchen', ticketPayload.actorName || 'Bếp KDS', 'CẬP NHẬT PHIẾU BẾP KDS', ticketId, 'Bàn ' + tableName + ' -> Trạng thái bếp: ' + status);
    return { success: true, message: 'Đã cập nhật trạng thái phiếu bếp [' + ticketId + '] thành: ' + status };
  } catch (err) {
    return { success: false, message: 'Lỗi cập nhật KDS: ' + err.toString() };
  }
}

function updateTableOrder(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu order bàn trên phiên làm việc!' };
    const sdbSheet = ss.getSheetByName('SO_DO_BAN');
    if (!sdbSheet) return { success: false, message: 'Chưa có tab SO_DO_BAN!' };

    const tableCode = String(payload.tableCode || '').trim();
    const vals = sdbSheet.getDataRange().getValues();
    let rowNum = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === tableCode.toUpperCase()) {
        rowNum = i + 1;
        break;
      }
    }

    const status = String(payload.status || 'Đang phục vụ').trim();
    const openTime = payload.openTime !== undefined ? String(payload.openTime).trim() : Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    const guestCount = parseInt(payload.guestCount, 10) || 0;
    const dishAmount = Number(payload.dishAmount) || 0;
    const hourAmount = Number(payload.hourAmount) || 0;
    const totalAmount = Number(payload.totalAmount) !== undefined && !isNaN(Number(payload.totalAmount)) ? Number(payload.totalAmount) : (dishAmount + hourAmount);
    const notes = String(payload.notes || '').trim();
    const kdsStatus = String(payload.kdsStatus || (status === 'Trống' ? '---' : 'Chờ chế biến')).trim();

    if (rowNum === -1) {
      const nextR = sdbSheet.getLastRow() + 1;
      sdbSheet.getRange(nextR, 7).setNumberFormat('@');
      sdbSheet.appendRow([
        tableCode,
        payload.tableName || tableCode,
        payload.zone || 'Tầng 1 — Cafe & Sân Vườn',
        payload.serviceType || 'Bàn Cafe thường',
        status,
        Number(payload.hourlyRate) || 0,
        openTime,
        guestCount,
        dishAmount,
        hourAmount,
        totalAmount,
        notes,
        kdsStatus
      ]);
      sdbSheet.getRange(nextR, 9, 1, 3).setNumberFormat('#,##0 "₫"');
    } else {
      sdbSheet.getRange(rowNum, 5).setValue(status);
      sdbSheet.getRange(rowNum, 7).setNumberFormat('@').setValue(openTime);
      sdbSheet.getRange(rowNum, 8).setValue(guestCount);
      sdbSheet.getRange(rowNum, 9, 1, 3).setValues([[dishAmount, hourAmount, totalAmount]]);
      sdbSheet.getRange(rowNum, 9, 1, 3).setNumberFormat('#,##0 "₫"');
      sdbSheet.getRange(rowNum, 12).setValue(notes);
      if (payload.kdsStatus) {
        sdbSheet.getRange(rowNum, 13).setValue(kdsStatus);
      }
    }

    SpreadsheetApp.flush();
    writeAuditLog(ss, payload.username || 'staff', payload.actorName || 'Nhân viên Order', 'GỌI MÓN / CẬP NHẬT BÀN', tableCode, 'Bàn ' + tableCode + ' - Trạng thái: ' + status + ' - Tiền: ' + totalAmount + ' ₫ (' + notes + ')');

    return { success: true, message: 'Đã lưu order bàn [' + tableCode + '] thành công!' };
  } catch (err) {
    return { success: false, message: 'Lỗi cập nhật bàn: ' + err.toString() };
  }
}

function saveTableItem(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu bàn trên phiên làm việc!' };
    const sdbSheet = ss.getSheetByName('SO_DO_BAN');

    const code = String(payload.code || '').trim().toUpperCase();
    const name = String(payload.name || '').trim();
    if (!code || !name) return { success: false, message: 'Vui lòng nhập Mã bàn và Tên bàn!' };

    const zone = String(payload.zone || 'Tầng 1 — Cafe & Sân Vườn').trim();
    const serviceType = String(payload.serviceType || 'Bàn Cafe thường').trim();
    const hourlyRate = Number(payload.hourlyRate) || 0;
    const notes = String(payload.notes || '').trim();

    const vals = sdbSheet.getDataRange().getValues();
    let rowNum = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === code) {
        rowNum = i + 1;
        break;
      }
    }

    if (rowNum > 0) {
      sdbSheet.getRange(rowNum, 2, 1, 3).setValues([[name, zone, serviceType]]);
      sdbSheet.getRange(rowNum, 6).setValue(hourlyRate).setNumberFormat('#,##0 "₫"');
      sdbSheet.getRange(rowNum, 12).setValue(notes);
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT BÀN', code, 'Cập nhật bàn ' + code + ' (' + name + ')');
      return { success: true, message: 'Đã cập nhật bàn [' + name + ']!' };
    } else {
      const nextR = sdbSheet.getLastRow() + 1;
      sdbSheet.getRange(nextR, 7).setNumberFormat('@');
      sdbSheet.appendRow([code, name, zone, serviceType, 'Trống', hourlyRate, '', 0, 0, 0, 0, notes, '---']);
      sdbSheet.getRange(nextR, 6).setNumberFormat('#,##0 "₫"');
      sdbSheet.getRange(nextR, 9, 1, 3).setNumberFormat('#,##0 "₫"');
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'THÊM BÀN MỚI', code, 'Thêm bàn mới ' + code + ' (' + name + ')');
      return { success: true, message: 'Đã thêm bàn mới [' + name + '] vào sơ đồ bàn!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu bàn: ' + err.toString() };
  }
}

function checkoutTable(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã tất toán hóa đơn!' };
    const sdbSheet = ss.getSheetByName('SO_DO_BAN');
    const hdSheet = ss.getSheetByName('HOA_DON');
    const hvSheet = ss.getSheetByName('HOI_VIEN_VIP');
    const kdsSheet = ss.getSheetByName('PHIEU_BEP_KDS');
    const chSheet = ss.getSheetByName('CAU_HINH');

    if (!sdbSheet || !hdSheet) return { success: false, message: 'Chưa có tab SO_DO_BAN hoặc HOA_DON!' };

    const tableCode = String(payload.tableCode || '').trim();
    const code = payload.code || ('HD-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmm'));
    const txDate = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    const tableName = String(payload.tableName || tableCode).trim();
    const waiter = String(payload.waiter || 'Phục vụ').trim();
    const cashier = String(payload.cashier || 'Thu ngân').trim();
    const customer = String(payload.customer || 'Khách vãng lai').trim();
    const vipTier = String(payload.vipTier || 'Vãng lai (0%)').trim();
    const dishAmount = Number(payload.dishAmount) || 0;
    const timeUsed = String(payload.timeUsed || '0 phút').trim();
    const hourAmount = Number(payload.hourAmount) || 0;
    const discount = Number(payload.discount) || 0;
    const totalAmount = Number(payload.totalAmount) || Math.max(0, dishAmount + hourAmount - discount);
    const method = String(payload.paymentMethod || 'VietQR Động').trim();

    // 1. Ghi vào HOA_DON
    const nextHdRow = hdSheet.getLastRow() + 1;
    hdSheet.getRange(nextHdRow, 2).setNumberFormat('@');
    hdSheet.appendRow([
      code, txDate, tableName, waiter, cashier, customer, vipTier,
      dishAmount, timeUsed, hourAmount, discount, totalAmount, method, 'Đã tất toán'
    ]);
    hdSheet.getRange(nextHdRow, 8).setNumberFormat('#,##0 "₫"');
    hdSheet.getRange(nextHdRow, 10, 1, 3).setNumberFormat('#,##0 "₫"');

    // 2. Reset Bàn về Trống
    const vals = sdbSheet.getDataRange().getValues();
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === tableCode.toUpperCase()) {
        const rowNum = i + 1;
        sdbSheet.getRange(rowNum, 5).setValue('Trống');
        sdbSheet.getRange(rowNum, 7).setValue('');
        sdbSheet.getRange(rowNum, 8).setValue(0);
        sdbSheet.getRange(rowNum, 9, 1, 3).setValues([[0, 0, 0]]);
        sdbSheet.getRange(rowNum, 12).setValue('Đã thanh toán bill ' + code);
        sdbSheet.getRange(rowNum, 13).setValue('---');
        break;
      }
    }

    // 3. Đánh dấu các phiếu bếp của bàn này thành Đã giao bàn
    if (kdsSheet && kdsSheet.getLastRow() >= 3) {
      const kdsVals = kdsSheet.getDataRange().getValues();
      for (let k = 2; k < kdsVals.length; k++) {
        if (String(kdsVals[k][1]).trim().toUpperCase() === tableCode.toUpperCase() && String(kdsVals[k][6]).trim() !== 'Đã giao bàn') {
          kdsSheet.getRange(k + 1, 7).setValue('Đã giao bàn');
        }
      }
    }

    // 4. Tự động cộng chi tiêu tích lũy & nâng hạng cho Hội viên VIP nếu khớp mã hoặc tên/SĐT
    if (hvSheet && hvSheet.getLastRow() >= 3 && (payload.memberId || (customer && customer !== 'Khách vãng lai'))) {
      const settings = {};
      if (chSheet && chSheet.getLastRow() >= 3) {
        const chVals = chSheet.getDataRange().getDisplayValues();
        for (let c = 2; c < chVals.length; c++) {
          if (chVals[c][0]) settings[String(chVals[c][0]).trim()] = String(chVals[c][1] || '').trim();
        }
      }
      const hvVals = hvSheet.getDataRange().getValues();
      const targetMemberId = String(payload.memberId || '').trim().toUpperCase();
      for (let m = 2; m < hvVals.length; m++) {
        const rowId = String(hvVals[m][0]).trim().toUpperCase();
        const rowName = String(hvVals[m][1]).trim().toLowerCase();
        const rowPhone = String(hvVals[m][2]).trim();
        if ((targetMemberId && rowId === targetMemberId) || (rowName && customer.toLowerCase().indexOf(rowName) !== -1) || (rowPhone && customer.indexOf(rowPhone) !== -1)) {
          const newSpent = (parseCurrency(hvVals[m][4], hvVals[m][4]) || 0) + totalAmount;
          const newVisits = (parseInt(hvVals[m][5], 10) || 0) + 1;
          const mode = String(hvVals[m][6] || 'Tự động theo chi tiêu').trim();
          const updatedTier = (mode === 'Tự động theo chi tiêu') ? computeTierBySpent(newSpent, settings) : String(hvVals[m][3]);
          hvSheet.getRange(m + 1, 4, 1, 3).setValues([[updatedTier, newSpent, newVisits]]);
          hvSheet.getRange(m + 1, 5).setNumberFormat('#,##0 "₫"');
          break;
        }
      }
    }

    SpreadsheetApp.flush();
    writeAuditLog(ss, payload.username || 'cashier', cashier, 'THANH TOÁN HÓA ĐƠN', code, 'Thanh toán thành công ' + totalAmount + ' ₫ cho ' + tableName + ' (' + method + ')');

    return { success: true, message: 'Đã thanh toán hóa đơn [' + code + '] và trả bàn [' + tableCode + '] về trạng thái Trống!', code: code };
  } catch (err) {
    return { success: false, message: 'Lỗi thanh toán bàn: ' + err.toString() };
  }
}

function saveMenuItem(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu món ăn vào thực đơn!' };
    const tdSheet = ss.getSheetByName('THUC_DON');

    const code = String(payload.code || '').trim().toUpperCase();
    const name = String(payload.name || '').trim();
    if (!code || !name) return { success: false, message: 'Vui lòng nhập Mã món và Tên món!' };

    const cat = String(payload.category || 'Món khác').trim();
    const unit = String(payload.unit || 'Phần').trim();
    const price = Number(payload.price) || 0;
    const cost = Number(payload.costPrice) || 0;
    const promo = String(payload.promo || 'Không').trim();
    const kitchen = String(payload.kitchenStation || 'Bếp').trim();
    const status = String(payload.status || 'Còn hàng').trim();
    const notes = String(payload.notes || '').trim();

    const vals = tdSheet.getDataRange().getValues();
    let rowNum = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toUpperCase() === code) {
        rowNum = i + 1;
        break;
      }
    }

    if (rowNum > 0) {
      tdSheet.getRange(rowNum, 2, 1, 9).setValues([[name, cat, unit, price, cost, promo, kitchen, status, notes]]);
      tdSheet.getRange(rowNum, 5, 1, 2).setNumberFormat('#,##0 "₫"');
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT MÓN', code, 'Cập nhật món ' + code + ' (' + name + ' - ' + price + ' ₫)');
      return { success: true, message: 'Đã cập nhật món [' + name + '] thành công!' };
    } else {
      const nextR = tdSheet.getLastRow() + 1;
      tdSheet.appendRow([code, name, cat, unit, price, cost, promo, kitchen, status, notes]);
      tdSheet.getRange(nextR, 5, 1, 2).setNumberFormat('#,##0 "₫"');
      SpreadsheetApp.flush();
      writeAuditLog(ss, payload.username || 'admin', payload.actorName || 'Admin', 'THÊM MÓN MỚI', code, 'Thêm mới món ' + code + ' (' + name + ' - ' + price + ' ₫)');
      return { success: true, message: 'Đã thêm món mới [' + name + '] vào thực đơn!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu món: ' + err.toString() };
  }
}

function saveStoreConfig(cfg) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu cấu hình quán và VietQR!' };
    const chSheet = ss.getSheetByName('CAU_HINH');
    if (!chSheet) return { success: false, message: 'Chưa có tab CAU_HINH!' };

    const vals = chSheet.getDataRange().getValues();
    const existingKeys = {};
    for (let i = 2; i < vals.length; i++) {
      existingKeys[String(vals[i][0]).trim()] = i + 1;
    }

    Object.keys(cfg).forEach(function(k) {
      if (k === 'username' || k === 'actorName') return;
      if (existingKeys[k]) {
        chSheet.getRange(existingKeys[k], 2).setNumberFormat('@').setValue(String(cfg[k]));
      } else {
        const nextR = chSheet.getLastRow() + 1;
        chSheet.getRange(nextR, 2).setNumberFormat('@');
        chSheet.appendRow([k, String(cfg[k]), 'Cấu hình bổ sung']);
      }
    });

    writeAuditLog(ss, cfg.username || 'admin', cfg.actorName || 'Admin', 'CẬP NHẬT CẤU HÌNH', 'CAU_HINH', 'Thay đổi thông tin quán / tài khoản VietQR / tỷ lệ chiết khấu');
    return { success: true, message: 'Đã lưu cấu hình quán, VietQR và cơ chế hạng VIP thành công!' };
  } catch (err) {
    return { success: false, message: 'Lỗi lưu cấu hình: ' + err.toString() };
  }
}

function saveUserAccount(payload) {
  try {
    const ss = ensurePosSheetsExist();
    if (!ss) return { success: true, message: 'Đã lưu tài khoản nhân sự!' };
    const pqSheet = ss.getSheetByName('PHAN_QUYEN');

    const uname = String(payload.username || '').trim().toLowerCase();
    const pass = String(payload.password || '123456').trim();
    const fullName = String(payload.fullName || '').trim();
    const role = String(payload.role || 'STAFF').trim();
    const assignedZone = (role === 'ADMIN' || role === 'CASHIER') ? 'ALL' : String(payload.assignedZone || 'Tầng 1 — Cafe & Sân Vườn').trim();
    const status = String(payload.status || 'Hoạt động').trim();

    if (!uname || !fullName) return { success: false, message: 'Vui lòng nhập Tên đăng nhập và Họ tên!' };

    let permDesc = 'Nhân viên phục vụ gọi món tại ' + assignedZone;
    if (role === 'ADMIN') permDesc = 'Quản lý toàn quyền hệ thống';
    else if (role === 'CASHIER') permDesc = 'Thu ngân thanh toán POS & In hóa đơn K80';
    else if (role === 'KITCHEN') permDesc = 'Màn hình Bếp KDS chế biến món';

    const vals = pqSheet.getDataRange().getValues();
    let rowNum = -1;
    for (let i = 2; i < vals.length; i++) {
      if (String(vals[i][0]).trim().toLowerCase() === uname) {
        rowNum = i + 1;
        break;
      }
    }

    if (rowNum > 0) {
      pqSheet.getRange(rowNum, 2).setNumberFormat('@');
      pqSheet.getRange(rowNum, 2, 1, 6).setValues([[pass, fullName, role, assignedZone, permDesc, status]]);
      writeAuditLog(ss, payload.actorUsername || 'admin', payload.actorName || 'Admin', 'CẬP NHẬT TÀI KHOẢN', uname, 'Cập nhật TK ' + uname + ' (' + role + ')');
      return { success: true, message: 'Đã cập nhật tài khoản [' + uname + ']!' };
    } else {
      const nextR = pqSheet.getLastRow() + 1;
      pqSheet.getRange(nextR, 1, 1, 2).setNumberFormat('@');
      pqSheet.appendRow([uname, pass, fullName, role, assignedZone, permDesc, status]);
      writeAuditLog(ss, payload.actorUsername || 'admin', payload.actorName || 'Admin', 'TẠO TÀI KHOẢN MỚI', uname, 'Tạo mới TK ' + uname + ' (' + role + ')');
      return { success: true, message: 'Đã tạo tài khoản mới [' + uname + ']!' };
    }
  } catch (err) {
    return { success: false, message: 'Lỗi lưu tài khoản: ' + err.toString() };
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

function getFallbackPosData() {
  const settings = {
    STORE_NAME: 'NEXSIMPLE F&B RESTAURANT & COFFEE',
    STORE_ADDRESS: 'Số 93/4 Liên Khu 5-6, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM',
    STORE_PHONE: '0974 755 104',
    STORE_WIFI: 'NexSimple_Coffee / Pass: 88889999',
    BANK_ID: 'MB',
    BANK_ACCOUNT_NO: '0974755104',
    BANK_ACCOUNT_NAME: 'NGUYEN MINH TUAN',
    DISCOUNT_SILVER: '5',
    DISCOUNT_GOLD: '10',
    DISCOUNT_PLATINUM: '15',
    TIER_SILVER_MIN: '3000000',
    TIER_GOLD_MIN: '8000000',
    TIER_PLATINUM_MIN: '15000000',
    VIP_TIER_MODE: 'AUTO_AND_MANUAL',
    PRINT_TEMPLATE_STANDARD: 'HÓA ĐƠN THANH TOÁN (BILL TÍNH TIỀN) - KHỔ K80 / A5'
  };

  const users = getDefaultUsersList();

  const tables = [
    { code: 'BAN-01', name: 'Bàn 01 (Cửa Sổ)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Đang phục vụ', hourlyRate: 0, openTime: '2026-10-28 08:15', guestCount: 3, dishAmount: 119000, hourAmount: 0, totalAmount: 119000, notes: '2x Cà Phê Muối Đặc Biệt, 1x Bánh Tiramisu Cacao Ý', kdsStatus: 'Đã giao bàn' },
    { code: 'BAN-02', name: 'Bàn 02 (Sofa)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Trống', hourlyRate: 0, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'Đã dọn dẹp sạch sẽ', kdsStatus: '---' },
    { code: 'BAN-03', name: 'Bàn 03 (Gia Đình)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Đang phục vụ', hourlyRate: 0, openTime: '2026-10-28 08:30', guestCount: 4, dishAmount: 129000, hourAmount: 0, totalAmount: 129000, notes: '3x Trà Đào Cam Sả Tươi (Mua 2 Tặng 1), 1x Khoai Tây Chiên Lắc Phô Mai', kdsStatus: 'Đang chế biến' },
    { code: 'BAN-04', name: 'Bàn 04 (Ban Công)', zone: 'Tầng 1 — Cafe & Sân Vườn', serviceType: 'Bàn Cafe thường', status: 'Trống', hourlyRate: 0, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'View thoáng mát', kdsStatus: '---' },
    { code: 'NH-01', name: 'Bàn Ăn 01 (Lẩu/Nướng)', zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh', serviceType: 'Bàn Ăn Nhà Hàng', status: 'Đang phục vụ', hourlyRate: 0, openTime: '2026-10-28 08:20', guestCount: 5, dishAmount: 622000, hourAmount: 0, totalAmount: 622000, notes: '1x Combo Lẩu Hải Sản Thượng Hạng, 2x Trà Ô Long Sữa Trân Châu', kdsStatus: 'Chờ chế biến' },
    { code: 'NH-02', name: 'Bàn Ăn 02 (VIP Tròn)', zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh', serviceType: 'Bàn Ăn Nhà Hàng', status: 'Trống', hourlyRate: 0, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'Sẵn sàng đón khách', kdsStatus: '---' },
    { code: 'NH-03', name: 'Bàn Ăn 03 (Gia Đình)', zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh', serviceType: 'Bàn Ăn Nhà Hàng', status: 'Đang phục vụ', hourlyRate: 0, openTime: '2026-10-28 08:10', guestCount: 2, dishAmount: 370000, hourAmount: 0, totalAmount: 370000, notes: '2x Bò Bít Tết Sốt Tiêu Đen', kdsStatus: 'Đã giao bàn' },
    { code: 'BIDA-01', name: 'Bàn Bida 01 (Carom)', zone: 'Khu Bida & Phòng VIP Tính Giờ', serviceType: 'Bàn Tính Giờ (Bida/VIP)', status: 'Đang phục vụ', hourlyRate: 60000, openTime: '2026-10-28 07:30', guestCount: 2, dishAmount: 74000, hourAmount: 90000, totalAmount: 164000, notes: '1x Cà Phê Sữa Đá, 1x Khoai Tây Chiên + 90 phút Bida', kdsStatus: 'Đã xong - Chờ bưng' },
    { code: 'BIDA-02', name: 'Bàn Bida 02 (Pool)', zone: 'Khu Bida & Phòng VIP Tính Giờ', serviceType: 'Bàn Tính Giờ (Bida/VIP)', status: 'Trống', hourlyRate: 60000, openTime: '', guestCount: 0, dishAmount: 0, hourAmount: 0, totalAmount: 0, notes: 'Bàn 9 bóng chuẩn giải đấu', kdsStatus: '---' },
    { code: 'VIP-01', name: 'Phòng VIP Hoàng Gia', zone: 'Khu Bida & Phòng VIP Tính Giờ', serviceType: 'Bàn Tính Giờ (Bida/VIP)', status: 'Đang phục vụ', hourlyRate: 120000, openTime: '2026-10-28 07:00', guestCount: 8, dishAmount: 1062000, hourAmount: 240000, totalAmount: 1302000, notes: '2x Combo Lẩu Hải Sản Thượng Hạng + 120 phút Phòng VIP', kdsStatus: 'Đã giao bàn' }
  ];

  const menuItems = [
    { code: 'MN-CF-01', name: 'Cà Phê Muối Đặc Biệt', category: 'Cà Phê', unit: 'Ly', price: 35000, costPrice: 12000, promo: 'Không', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Kem muối béo ngậy, cafe rang mộc' },
    { code: 'MN-CF-02', name: 'Cà Phê Sữa Đá Sài Gòn', category: 'Cà Phê', unit: 'Ly', price: 29000, costPrice: 9000, promo: 'Không', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Robusta đậm đà, sữa đặc truyền thống' },
    { code: 'MN-TR-01', name: 'Trà Đào Cam Sả Tươi', category: 'Trà & Nước Ép', unit: 'Ly', price: 42000, costPrice: 14000, promo: 'Mua 2 Tặng 1', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Tự động tặng 1 ly miễn phí khi gọi đủ 3 ly' },
    { code: 'MN-TR-02', name: 'Trà Ô Long Sữa Trân Châu', category: 'Trà & Nước Ép', unit: 'Ly', price: 45000, costPrice: 15000, promo: 'Mua 2 Tặng 1', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Trân châu đen dẻo dai — Mua 2 Tặng 1' },
    { code: 'MN-AN-01', name: 'Bò Bít Tết Sốt Tiêu Đen', category: 'Món Chính & Lẩu', unit: 'Đĩa', price: 185000, costPrice: 85000, promo: 'Không', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Thăn bò Úc mềm mọng sốt tiêu cay nhẹ' },
    { code: 'MN-AN-02', name: 'Mì Ý Sốt Bò Bằm Bolognaise', category: 'Món Chính & Lẩu', unit: 'Đĩa', price: 95000, costPrice: 38000, promo: 'Không', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Sốt cà chua bò tươi chuẩn Ý' },
    { code: 'MN-AN-03', name: 'Khoai Tây Chiên Lắc Phô Mai', category: 'Ăn Nhẹ & Khai Vị', unit: 'Đĩa', price: 45000, costPrice: 16000, promo: 'Mua Kèm Giảm 20%', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Mua kèm đồ uống hoặc combo giảm ngay 20%' },
    { code: 'MN-AN-04', name: 'Bánh Tiramisu Cacao Ý', category: 'Bánh & Tráng Miệng', unit: 'Phần', price: 49000, costPrice: 18000, promo: 'Mua Kèm Giảm 20%', kitchenStation: 'Bếp Lạnh / Bánh', status: 'Còn hàng', notes: 'Mua kèm Cà phê/Trà giảm 20%' },
    { code: 'CB-LUNCH-01', name: 'Combo Trưa Nhanh (Mì Ý + Cà Phê + Bánh)', category: 'Combo Tiết Kiệm', unit: 'Combo', price: 159000, costPrice: 65000, promo: 'Combo Giảm 15%', kitchenStation: 'Bếp & Pha Chế', status: 'Còn hàng', notes: 'Tiết kiệm 15% so với gọi lẻ từng món' },
    { code: 'CB-LAU-02', name: 'Combo Lẩu Hải Sản Thượng Hạng (4-5 người)', category: 'Combo Tiết Kiệm', unit: 'Nồi', price: 590000, costPrice: 260000, promo: 'Giảm 10% Giờ Vàng', kitchenStation: 'Bếp Nấu Nóng', status: 'Còn hàng', notes: 'Tôm càng, mực ống, cá hồi, rau nấm tươi' },
    { code: 'CB-BIDA-03', name: 'Combo Chiến Hữu Bida (4 Nước Tăng Lực + Khô Bò)', category: 'Combo Tiết Kiệm', unit: 'Combo', price: 140000, costPrice: 55000, promo: 'Combo Giảm 15%', kitchenStation: 'Quầy Pha Chế', status: 'Còn hàng', notes: 'Combo ưu đãi dành riêng cho bàn Bida & VIP' }
  ];

  const vipMembers = [
    { id: 'VIP-01', name: 'Công ty Cổ phần AlphaTech', phone: '0909 111 222', tier: 'Bạch Kim (Platinum - 15%)', spent: 28500000, visits: 24, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Khách doanh nghiệp đặt tiệc VIP thường xuyên' },
    { id: 'VIP-02', name: 'Nguyễn Hoàng Hải', phone: '0918 666 888', tier: 'Bạch Kim (Platinum - 15%)', spent: 19200000, visits: 19, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Hội viên Platinum — Ưu tiên phòng VIP' },
    { id: 'VIP-03', name: 'Phạm Quốc Cường', phone: '0918 889 999', tier: 'Vàng (Gold - 10%)', spent: 11400000, visits: 15, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Khách quen khu Cafe & Bida' },
    { id: 'VIP-04', name: 'Lê Ngọc Bảo Trân', phone: '0988 777 555', tier: 'Vàng (Gold - 10%)', spent: 8900000, visits: 12, tierMode: 'Cố định hạng (Chủ quán cấp)', status: 'Hoạt động', notes: 'Đối tác thân thiết được cấp thẻ Vàng' },
    { id: 'VIP-05', name: 'Trần Đình Trọng', phone: '0974 123 456', tier: 'Bạc (Silver - 5%)', spent: 4200000, visits: 8, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Hội viên CLB Bida Carom' },
    { id: 'VIP-06', name: 'Võ Minh Khôi', phone: '0933 444 999', tier: 'Bạc (Silver - 5%)', spent: 3150000, visits: 6, tierMode: 'Tự động theo chi tiêu', status: 'Hoạt động', notes: 'Hội viên mới đăng ký thẻ Bạc' }
  ];

  const kitchenTickets = [
    {
      ticketId: 'KDS-1001',
      tableCode: 'BAN-03',
      tableName: 'Bàn 03 (Gia Đình)',
      zone: 'Tầng 1 — Cafe & Sân Vườn',
      orderTime: '08:30',
      waiter: 'Nguyễn Văn Minh (order_tang1)',
      items: [
        { code: 'MN-TR-01', name: 'Trà Đào Cam Sả Tươi', qty: 3, kitchenStation: 'Quầy Pha Chế', notes: 'Mua 2 Tặng 1 — Ít đá', itemStatus: 'Đang chế biến' },
        { code: 'MN-AN-03', name: 'Khoai Tây Chiên Lắc Phô Mai', qty: 1, kitchenStation: 'Bếp Nấu Nóng', notes: 'Kèm tương ớt', itemStatus: 'Đang chế biến' }
      ],
      status: 'Đang chế biến'
    },
    {
      ticketId: 'KDS-1002',
      tableCode: 'NH-01',
      tableName: 'Bàn Ăn 01 (Lẩu/Nướng)',
      zone: 'Tầng 2 — Nhà Hàng & Phòng Lạnh',
      orderTime: '08:35',
      waiter: 'Nguyễn Văn Minh (order_tang1)',
      items: [
        { code: 'CB-LAU-02', name: 'Combo Lẩu Hải Sản Thượng Hạng (4-5 người)', qty: 1, kitchenStation: 'Bếp Nấu Nóng', notes: 'Nước lẩu Thái chua cay', itemStatus: 'Chờ chế biến' },
        { code: 'MN-TR-02', name: 'Trà Ô Long Sữa Trân Châu', qty: 2, kitchenStation: 'Quầy Pha Chế', notes: '50% đường', itemStatus: 'Chờ chế biến' }
      ],
      status: 'Chờ chế biến'
    },
    {
      ticketId: 'KDS-1003',
      tableCode: 'BIDA-01',
      tableName: 'Bàn Bida 01 (Carom)',
      zone: 'Khu Bida & Phòng VIP Tính Giờ',
      orderTime: '08:15',
      waiter: 'Hoàng Văn Bách (order_bida)',
      items: [
        { code: 'MN-CF-02', name: 'Cà Phê Sữa Đá Sài Gòn', qty: 1, kitchenStation: 'Quầy Pha Chế', notes: 'Đậm cafe', itemStatus: 'Đã xong' }
      ],
      status: 'Đã xong - Chờ bưng'
    }
  ];

  const invoices = [
    { code: 'HD-2026-1001', date: '2026-10-26 10:30', tableName: 'Bàn 01 (Cửa Sổ)', waiter: 'Nguyễn Văn Minh', cashier: 'Lê Thu Trang', customer: 'Phạm Quốc Cường (0918 889 999)', vipTier: 'Vàng (Gold - 10%)', dishAmount: 145000, timeUsed: '0', hourAmount: 0, discount: 14500, totalAmount: 130500, paymentMethod: 'VietQR Động', status: 'Đã tất toán' },
    { code: 'HD-2026-1002', date: '2026-10-26 12:15', tableName: 'Bàn Ăn 01 (Lẩu/Nướng)', waiter: 'Nguyễn Văn Minh', cashier: 'Lê Thu Trang', customer: 'Công ty Cổ phần AlphaTech (0909 111 222)', vipTier: 'Bạch Kim (Platinum - 15%)', dishAmount: 680000, timeUsed: '0', hourAmount: 0, discount: 102000, totalAmount: 578000, paymentMethod: 'VietQR Động', status: 'Đã tất toán' },
    { code: 'HD-2026-1003', date: '2026-10-26 14:00', tableName: 'Bàn Bida 01 (Carom)', waiter: 'Hoàng Văn Bách', cashier: 'Lê Thu Trang', customer: 'Trần Đình Trọng (0974 123 456)', vipTier: 'Bạc (Silver - 5%)', dishAmount: 85000, timeUsed: '120 phút (2.0h)', hourAmount: 120000, discount: 10250, totalAmount: 194750, paymentMethod: 'Tiền mặt', status: 'Đã tất toán' },
    { code: 'HD-2026-1004', date: '2026-10-26 16:45', tableName: 'Bàn 03 (Gia Đình)', waiter: 'Nguyễn Văn Minh', cashier: 'Lê Thu Trang', customer: 'Khách Vãng Lai', vipTier: 'Vãng lai (0%)', dishAmount: 185000, timeUsed: '0', hourAmount: 0, discount: 42000, totalAmount: 143000, paymentMethod: 'VietQR Động', status: 'Đã tất toán' }
  ];

  const auditLogs = [
    { timestamp: '2026-10-26 16:45:00', username: 'thungan_ca1', actorName: 'Lê Thu Trang (CASHIER)', action: 'THANH TOÁN HÓA ĐƠN', refCode: 'HD-2026-1004', detail: 'Thanh toán Bàn 03 (Gia Đình) thành công 143,000 ₫ qua VietQR Động. Áp dụng Mua 2 tặng 1.' },
    { timestamp: '2026-10-26 14:00:00', username: 'thungan_ca1', actorName: 'Lê Thu Trang (CASHIER)', action: 'THANH TOÁN HÓA ĐƠN', refCode: 'HD-2026-1003', detail: 'Thanh toán Bàn Bida 01 (Carom) 194,750 ₫. Tiền giờ 120,000 ₫ + Tiền đồ uống 85,000 ₫. Chiết khấu VIP Bạc 5%.' },
    { timestamp: '2026-10-26 10:30:15', username: 'thungan_ca1', actorName: 'Lê Thu Trang (CASHIER)', action: 'THANH TOÁN HÓA ĐƠN', refCode: 'HD-2026-1001', detail: 'Thanh toán Bàn 01 (Cửa Sổ) thành công 130,500 ₫ qua VietQR Động. Chiết khấu Gold 10%.' }
  ];

  return buildPosResponse(tables, menuItems, invoices, settings, users, auditLogs, vipMembers, kitchenTickets, true);
}
