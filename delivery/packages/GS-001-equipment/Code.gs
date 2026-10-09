/**
 * ============================================================================
 * GS-001: WEBAPP QUẢN LÝ VÀ CHO THUÊ THIẾT BỊ (V1.0)
 * BACKEND CONTROLLER & APPS SCRIPT API (CODE.GS)
 * Archetype: Rental & Assets
 * ============================================================================
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Quản Lý Cho Thuê Thiết Bị v1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 QUẢN LÝ CHO THUÊ THIẾT BỊ')
    .addItem('⚡ Khởi tạo cấu trúc Trang tính', 'install_EQUIPMENT_SHEET')
    .addItem('🌐 Mở Web App Quản Trị', 'openWebAppDialog')
    .addToUi();
}

function openWebAppDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800)
    .setTitle('Quản Lý Cho Thuê Thiết Bị v1.0');
  SpreadsheetApp.getUi().showModalDialog(html, 'Web App Quản Trị Thiết Bị');
}

/**
 * Lấy toàn bộ dữ liệu thiết bị và hợp đồng
 * Sử dụng getDisplayValues() để triệt tiêu lỗi phân tách Locale và lệch Date serialization.
 */
function getSystemData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tbSheet = ss.getSheetByName('THIET_BI');
  const hdSheet = ss.getSheetByName('HOP_DONG');

  if (!tbSheet || !hdSheet) {
    // Nếu chưa khởi tạo sheet, trả về mock chuẩn để webapp vẫn hoạt động độc lập
    return getFallbackEquipmentData();
  }

  // Đọc danh mục thiết bị
  const tbValues = tbSheet.getDataRange().getDisplayValues();
  const equipment = [];
  if (tbValues.length > 2) {
    for (let i = 2; i < tbValues.length; i++) {
      const row = tbValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      equipment.push({
        id: row[0],
        barcode: row[1],
        name: row[2],
        category: row[3],
        dailyRate: parseCurrency(row[4]),
        depositAmount: parseCurrency(row[5]),
        status: row[6] || 'available',
        renterName: row[7] || '',
        startDate: row[8] || '',
        returnDate: row[9] || '',
        contractCode: row[10] || '',
        notes: row[11] || ''
      });
    }
  }

  // Đọc hợp đồng
  const hdValues = hdSheet.getDataRange().getDisplayValues();
  const contracts = [];
  if (hdValues.length > 2) {
    for (let i = 2; i < hdValues.length; i++) {
      const row = hdValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      contracts.push({
        contractCode: row[0],
        renterName: row[1],
        renterPhone: row[2],
        equipmentId: row[3],
        equipmentName: row[4],
        startDate: row[5],
        returnDate: row[6],
        rentDays: parseInt(row[7], 10) || 1,
        totalRental: parseCurrency(row[8]),
        depositAmount: parseCurrency(row[9]),
        status: row[10] || 'Đang thuê',
        notes: row[11] || ''
      });
    }
  }

  // Tính toán KPI
  const total = equipment.length;
  const renting = equipment.filter(e => e.status === 'renting').length;
  const available = equipment.filter(e => e.status === 'available').length;
  const maintenance = equipment.filter(e => e.status === 'maintenance').length;
  const totalDeposit = equipment.filter(e => e.status === 'renting').reduce((sum, e) => sum + e.depositAmount, 0);

  return {
    success: true,
    equipment: equipment,
    contracts: contracts,
    kpi: {
      total: total,
      renting: renting,
      available: available,
      maintenance: maintenance,
      totalDeposit: totalDeposit
    }
  };
}

/**
 * Tạo mới hợp đồng cho thuê và cập nhật trạng thái thiết bị
 */
function submitRentalOrder(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tbSheet = ss.getSheetByName('THIET_BI');
    const hdSheet = ss.getSheetByName('HOP_DONG');

    if (!tbSheet || !hdSheet) {
      return { success: false, message: 'Chưa khởi tạo Trang tính! Vui lòng chạy installer trước.' };
    }

    const contractCode = data.contractCode || ('HĐ-TB-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmm'));
    const rentDays = parseInt(data.rentDays, 10) || 1;
    const dailyRate = Number(data.dailyRate) || 0;
    const totalRental = rentDays * dailyRate;
    const depositAmount = Number(data.depositAmount) || 0;

    // 1. Thêm dòng vào HOP_DONG
    hdSheet.appendRow([
      contractCode,
      data.renterName,
      data.renterPhone,
      data.equipmentId,
      data.equipmentName,
      data.startDate,
      data.returnDate,
      rentDays,
      totalRental,
      depositAmount,
      'Đang thuê',
      data.notes || 'Hợp đồng tạo qua Web App'
    ]);

    // Định dạng tiền tệ cho dòng mới
    const lastHdRow = hdSheet.getLastRow();
    hdSheet.getRange(lastHdRow, 9, 1, 2).setNumberFormat('#,##0 "₫"');

    // 2. Cập nhật trạng thái trong THIET_BI
    const tbValues = tbSheet.getDataRange().getValues();
    for (let i = 2; i < tbValues.length; i++) {
      if (tbValues[i][0] === data.equipmentId) {
        const rowNum = i + 1;
        tbSheet.getRange(rowNum, 7).setValue('renting'); // status
        tbSheet.getRange(rowNum, 8).setValue(data.renterName);
        tbSheet.getRange(rowNum, 9).setValue(data.startDate);
        tbSheet.getRange(rowNum, 10).setValue(data.returnDate);
        tbSheet.getRange(rowNum, 11).setValue(contractCode);
        break;
      }
    }

    return {
      success: true,
      message: 'Tạo hợp đồng ' + contractCode + ' thành công!',
      contractCode: contractCode
    };
  } catch (err) {
    return {
      success: false,
      message: 'Lỗi ghi nhận hợp đồng: ' + err.toString()
    };
  }
}

function parseCurrency(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const clean = str.replace(/[^\d.-]/g, '');
  return parseFloat(clean) || 0;
}

function getFallbackEquipmentData() {
  return {
    success: true,
    isFallback: true,
    equipment: [
      { id: 'EQ-001', barcode: 'BC-CAM-802', name: 'Sony FX3 Full-Frame Cinema Camera + Rig Tilta', category: 'Máy quay Cinema', dailyRate: 850000, depositAmount: 15000000, status: 'renting', renterName: 'Công ty Truyền thông MediaPro', startDate: '2026-08-03', returnDate: '2026-08-06', contractCode: 'HĐ-TB-2026-081', notes: 'Kèm 2 thẻ nhớ CFexpress Type A 160GB, 3 pin' },
      { id: 'EQ-002', barcode: 'BC-DRONE-01', name: 'DJI Mavic 3 Cine Combo 3 Pin + RC Pro', category: 'Flycam & Drone', dailyRate: 1200000, depositAmount: 20000000, status: 'returned', renterName: 'Studio Ánh Dương', startDate: '2026-07-31', returnDate: '2026-08-03', contractCode: 'HĐ-TB-2026-075', notes: 'Đã thu hồi, hoàn cọc 100%' },
      { id: 'EQ-003', barcode: 'BC-LENS-2470', name: 'Sony FE 24-70mm f/2.8 GM II (G Master)', category: 'Ống kính', dailyRate: 450000, depositAmount: 10000000, status: 'available', renterName: '', startDate: '', returnDate: '', contractCode: '', notes: 'Kính trong veo, có cap trước sau và hood zin' },
      { id: 'EQ-004', barcode: 'BC-LIGHT-600', name: 'Aputure LS 600d Pro Daylight LED Monolight', category: 'Ánh sáng sân khấu', dailyRate: 600000, depositAmount: 12000000, status: 'renting', renterName: 'Production House RedPixel', startDate: '2026-08-02', returnDate: '2026-08-05', contractCode: 'HĐ-TB-2026-080', notes: 'Gồm chóa Hyper Reflector, ngàm Bowens và vali' },
      { id: 'EQ-005', barcode: 'BC-AUDIO-WIR', name: 'Sennheiser EW-DP ME 2 Set Digital Wireless', category: 'Thiết bị âm thanh', dailyRate: 350000, depositAmount: 5000000, status: 'maintenance', renterName: '', startDate: '', returnDate: '', contractCode: '', notes: 'Đang bảo dưỡng định kỳ jack cắm' },
      { id: 'EQ-006', barcode: 'BC-GIM-RS3', name: 'DJI RS 3 Pro Gimbal Combo', category: 'Chống rung & Grip', dailyRate: 400000, depositAmount: 8000000, status: 'available', renterName: '', startDate: '', returnDate: '', contractCode: '', notes: 'Đầy đủ motor focus và thanh đỡ' }
    ],
    contracts: [
      { contractCode: 'HĐ-TB-2026-081', renterName: 'Công ty Truyền thông MediaPro', renterPhone: '0983 112 233', equipmentId: 'EQ-001', equipmentName: 'Sony FX3 Full-Frame Cinema Camera + Rig Tilta', startDate: '2026-08-03', returnDate: '2026-08-06', rentDays: 3, totalRental: 2550000, depositAmount: 15000000, status: 'Đang thuê', notes: 'Giao lúc 08:30 sáng, đầy đủ phụ kiện' },
      { contractCode: 'HĐ-TB-2026-080', renterName: 'Production House RedPixel', renterPhone: '0912 334 556', equipmentId: 'EQ-004', equipmentName: 'Aputure LS 600d Pro Daylight LED Monolight', startDate: '2026-08-02', returnDate: '2026-08-05', rentDays: 3, totalRental: 1800000, depositAmount: 12000000, status: 'Đang thuê', notes: 'Kiểm tra bóng sáng chuẩn CRI 96+' }
    ],
    kpi: {
      total: 6,
      renting: 2,
      available: 2,
      maintenance: 1,
      totalDeposit: 27000000
    }
  };
}

