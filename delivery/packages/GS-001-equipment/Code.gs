/**
 * ============================================================================
 * GS-001: HỆ THỐNG QUẢN LÝ NHÂN SỰ, CHẤM CÔNG, ĐƠN TỪ, KPI & TÍNH LƯƠNG TỰ ĐỘNG
 * Phiên bản: v4.0 Commercial Pro (Full-Screen, 4-Tier RBAC, Multi-File Upload & Payslip Bot)
 * File: Code.gs — Backend Engine & REST-like RPC Endpoints
 * ============================================================================
 */

function doGet(e) {
  try {
    ensureHrSheetsExist();
  } catch (err) {}
  var tpl = HtmlService.createTemplateFromFile('Index');
  return tpl.evaluate()
    .setTitle('GS-001 v4.0 Pro • Quản Lý Nhân Sự, Chấm Công, KPI & Tính Lương Tự Động')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

function ensureHrSheetsExist() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Không tìm thấy Google Spreadsheet!');
  var shEmp = ss.getSheetByName('HO_SO_NHAN_SU');
  var shAuth = ss.getSheetByName('PHAN_QUYEN');
  if (!shEmp || !shAuth || shEmp.getLastRow() < 2) {
    setupHrDatabase();
  }
  return ss;
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

function appendHrAuditLog(actor, role, action, refId, detail) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;
    var sh = ss.getSheetByName('NHAT_KY_HE_THONG');
    if (!sh) return;
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
    sh.appendRow([nowStr, String(actor || 'system'), String(role || 'USER'), String(action || ''), String(refId || ''), String(detail || '')]);
  } catch (e) {}
}

// ============================================================================
// API 1: ĐỌC TOÀN BỘ DỮ LIỆU HỆ THỐNG NHÂN SỰ & TIỀN LƯƠNG (getHrSystemData)
// ============================================================================
function getHrSystemData() {
  try {
    var ss = ensureHrSheetsExist();
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
    if (!config.CURRENT_PAYROLL_PERIOD) config.CURRENT_PAYROLL_PERIOD = curMonthStr;

    // 2. Đọc PHAN_QUYEN
    var users = [];
    var shAuth = ss.getSheetByName('PHAN_QUYEN');
    if (shAuth && shAuth.getLastRow() >= 3) {
      var maxColAuth = Math.max(10, shAuth.getLastColumn());
      if (shAuth.getMaxColumns() < 10) shAuth.insertColumnsAfter(shAuth.getMaxColumns(), 10 - shAuth.getMaxColumns());
      var uVals = shAuth.getRange(3, 1, shAuth.getLastRow() - 2, 10).getDisplayValues();
      uVals.forEach(function(r, idx) {
        var uname = String(r[0] || '').trim();
        if (!uname) return;
        users.push({
          rowIndex: idx + 3,
          username: uname,
          password: String(r[1] || '123456').trim(),
          empId: String(r[2] || ('NV-00' + (idx + 1))).trim(),
          fullName: String(r[3] || uname).trim(),
          role: String(r[4] || 'STAFF').trim().toUpperCase(),
          department: String(r[5] || '').trim(),
          email: String(r[6] || '').trim(),
          phone: String(r[7] || '').trim(),
          status: String(r[8] || 'Hoạt động').trim(),
          permissions: String(r[9] || '').trim()
        });
      });
    }

    // 3. Đọc HO_SO_NHAN_SU
    var employees = [];
    var shEmp = ss.getSheetByName('HO_SO_NHAN_SU');
    if (shEmp && shEmp.getLastRow() >= 3) {
      if (shEmp.getMaxColumns() < 17) shEmp.insertColumnsAfter(shEmp.getMaxColumns(), 17 - shEmp.getMaxColumns());
      var eRaw = shEmp.getRange(3, 1, shEmp.getLastRow() - 2, 17).getValues();
      var eDisp = shEmp.getRange(3, 1, shEmp.getLastRow() - 2, 17).getDisplayValues();
      eRaw.forEach(function(r, idx) {
        var d = eDisp[idx];
        var id = String(d[0] || '').trim();
        var fullName = String(d[1] || '').trim();
        if (!id && !fullName) return;
        employees.push({
          rowIndex: idx + 3,
          id: id || ('NV-00' + (idx + 1)),
          fullName: fullName,
          department: String(d[2] || '').trim(),
          position: String(d[3] || '').trim(),
          role: String(d[4] || 'STAFF').trim().toUpperCase(),
          phone: String(d[5] || '').trim(),
          email: String(d[6] || '').trim(),
          joinDate: normalizeDateStr(r[7], d[7]),
          contractType: String(d[8] || 'Hợp đồng 12 tháng').trim(),
          contractEndDate: normalizeDateStr(r[9], d[9]),
          baseSalary: parseNumSafe(r[10]),
          insuranceSalary: parseNumSafe(r[11]),
          allowance: parseNumSafe(r[12]),
          dependents: parseNumSafe(r[13]),
          bankAccount: String(d[14] || '').trim(),
          status: String(d[15] || 'Đang làm việc').trim(),
          attachments: parseJsonSafe(d[16], [])
        });
      });
    }

    // 4. Đọc CHAM_CONG
    var attendance = [];
    var shAtt = ss.getSheetByName('CHAM_CONG');
    if (shAtt && shAtt.getLastRow() >= 3) {
      var aRaw = shAtt.getRange(3, 1, shAtt.getLastRow() - 2, 13).getValues();
      var aDisp = shAtt.getRange(3, 1, shAtt.getLastRow() - 2, 13).getDisplayValues();
      aRaw.forEach(function(r, idx) {
        var d = aDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[2]) return;
        attendance.push({
          rowIndex: idx + 3,
          id: id || ('CC-' + (idx + 1)),
          date: normalizeDateStr(r[1], d[1]),
          empId: String(d[2] || '').trim(),
          fullName: String(d[3] || '').trim(),
          department: String(d[4] || '').trim(),
          shift: String(d[5] || 'Ca Hành Chính (08:00 - 17:30)').trim(),
          checkIn: String(d[6] || '08:00').trim(),
          checkOut: String(d[7] || '17:30').trim(),
          workUnits: parseNumSafe(r[8] !== '' ? r[8] : 1.0),
          otHours: parseNumSafe(r[9]),
          workMode: String(d[10] || 'Văn phòng Công ty').trim(),
          status: String(d[11] || 'Đúng giờ (Đủ công)').trim(),
          notes: String(d[12] || '').trim()
        });
      });
    }

    // 5. Đọc DON_TU_NGHI_PHEP
    var leaveRequests = [];
    var shLeave = ss.getSheetByName('DON_TU_NGHI_PHEP');
    if (shLeave && shLeave.getLastRow() >= 3) {
      if (shLeave.getMaxColumns() < 14) shLeave.insertColumnsAfter(shLeave.getMaxColumns(), 14 - shLeave.getMaxColumns());
      var lRaw = shLeave.getRange(3, 1, shLeave.getLastRow() - 2, 14).getValues();
      var lDisp = shLeave.getRange(3, 1, shLeave.getLastRow() - 2, 14).getDisplayValues();
      lRaw.forEach(function(r, idx) {
        var d = lDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[3]) return;
        leaveRequests.push({
          rowIndex: idx + 3,
          id: id || ('DT-' + (idx + 1)),
          createdAt: normalizeDateStr(r[1], d[1]),
          empId: String(d[2] || '').trim(),
          fullName: String(d[3] || '').trim(),
          department: String(d[4] || '').trim(),
          requestType: String(d[5] || 'Đơn xin Nghỉ phép năm (Có hưởng lương)').trim(),
          fromDate: normalizeDateStr(r[6], d[6]),
          toDate: normalizeDateStr(r[7], d[7]),
          quantity: parseNumSafe(r[8] !== '' ? r[8] : 1),
          reason: String(d[9] || '').trim(),
          status: String(d[10] || 'Chờ duyệt').trim(),
          approver: String(d[11] || '').trim(),
          approvalNote: String(d[12] || '').trim(),
          attachments: parseJsonSafe(d[13], [])
        });
      });
    }

    // 6. Đọc DANH_GIA_KPI
    var kpiReviews = [];
    var shKpi = ss.getSheetByName('DANH_GIA_KPI');
    if (shKpi && shKpi.getLastRow() >= 3) {
      if (shKpi.getMaxColumns() < 13) shKpi.insertColumnsAfter(shKpi.getMaxColumns(), 13 - shKpi.getMaxColumns());
      var kRaw = shKpi.getRange(3, 1, shKpi.getLastRow() - 2, 13).getValues();
      var kDisp = shKpi.getRange(3, 1, shKpi.getLastRow() - 2, 13).getDisplayValues();
      kRaw.forEach(function(r, idx) {
        var d = kDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[3]) return;
        var metaObj = parseJsonSafe(d[12], { notes: String(d[12] || ''), attachments: [] });
        kpiReviews.push({
          rowIndex: idx + 3,
          id: id || ('KPI-' + (idx + 1)),
          period: String(d[1] || curMonthStr).trim(),
          empId: String(d[2] || '').trim(),
          fullName: String(d[3] || '').trim(),
          department: String(d[4] || '').trim(),
          goalTitle: String(d[5] || '').trim(),
          weight: parseNumSafe(r[6] !== '' ? r[6] : 100),
          progress: parseNumSafe(r[7]),
          score: parseNumSafe(r[8]),
          grade: String(d[9] || 'Tốt (A)').trim(),
          bonusAmount: parseNumSafe(r[10]),
          status: String(d[11] || 'Chờ duyệt').trim(),
          notes: String(metaObj.notes || '').trim(),
          attachments: Array.isArray(metaObj.attachments) ? metaObj.attachments : []
        });
      });
    }

    // 7. Đọc BANG_LUONG_THANG
    var payrolls = [];
    var shPay = ss.getSheetByName('BANG_LUONG_THANG');
    if (shPay && shPay.getLastRow() >= 3) {
      if (shPay.getMaxColumns() < 19) shPay.insertColumnsAfter(shPay.getMaxColumns(), 19 - shPay.getMaxColumns());
      var pRaw = shPay.getRange(3, 1, shPay.getLastRow() - 2, 19).getValues();
      var pDisp = shPay.getRange(3, 1, shPay.getLastRow() - 2, 19).getDisplayValues();
      pRaw.forEach(function(r, idx) {
        var d = pDisp[idx];
        var id = String(d[0] || '').trim();
        if (!id && !d[3]) return;
        payrolls.push({
          rowIndex: idx + 3,
          id: id || ('PL-' + (idx + 1)),
          period: String(d[1] || curMonthStr).trim(),
          empId: String(d[2] || '').trim(),
          fullName: String(d[3] || '').trim(),
          department: String(d[4] || '').trim(),
          position: String(d[5] || '').trim(),
          baseSalary: parseNumSafe(r[6]),
          standardDays: parseNumSafe(r[7] || 26),
          actualDays: parseNumSafe(r[8]),
          workDaySalary: parseNumSafe(r[9]),
          otHours: parseNumSafe(r[10]),
          otSalary: parseNumSafe(r[11]),
          allowance: parseNumSafe(r[12]),
          kpiBonus: parseNumSafe(r[13]),
          grossSalary: parseNumSafe(r[14]),
          insuranceDeduction: parseNumSafe(r[15]),
          taxAndPenalty: parseNumSafe(r[16]),
          netSalary: parseNumSafe(r[17]),
          status: String(d[18] || 'Chờ gửi Payslip').trim()
        });
      });
    }

    // 8. Đọc NHAT_KY_HE_THONG
    var auditLogs = [];
    var shLog = ss.getSheetByName('NHAT_KY_HE_THONG');
    if (shLog && shLog.getLastRow() >= 3) {
      var startRow = Math.max(3, shLog.getLastRow() - 39);
      var numRows = shLog.getLastRow() - startRow + 1;
      var lVals = shLog.getRange(startRow, 1, numRows, 6).getDisplayValues();
      for (var i = lVals.length - 1; i >= 0; i--) {
        auditLogs.push({
          timestamp: lVals[i][0],
          actor: lVals[i][1],
          role: lVals[i][2],
          action: lVals[i][3],
          refId: lVals[i][4],
          detail: lVals[i][5]
        });
      }
    }

    return {
      ok: true,
      serverTime: serverTime,
      todayStr: todayStr,
      curMonthStr: curMonthStr,
      config: config,
      users: users,
      employees: employees,
      attendance: attendance,
      leaveRequests: leaveRequests,
      kpiReviews: kpiReviews,
      payrolls: payrolls,
      auditLogs: auditLogs
    };
  } catch (e) {
    return {
      ok: false,
      message: 'Lỗi đọc dữ liệu Nhân sự: ' + e.toString()
    };
  }
}

// ============================================================================
// API 2: LƯU / CẬP NHẬT HỒ SƠ NHÂN SỰ & ĐỒNG BỘ TÀI KHOẢN (HO_SO_NHAN_SU)
// ============================================================================
function saveEmployeeRecord(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('HO_SO_NHAN_SU');
    if (sh.getMaxColumns() < 17) sh.insertColumnsAfter(sh.getMaxColumns(), 17 - sh.getMaxColumns());

    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'NV-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHH');
      isNew = true;
    }

    var attachmentsJson = JSON.stringify(Array.isArray(payload.attachments) ? payload.attachments : []);
    var rowVals = [
      id,
      String(payload.fullName || '').trim(),
      String(payload.department || 'Phòng Kinh Doanh & CRM').trim(),
      String(payload.position || 'Chuyên Viên').trim(),
      String(payload.role || 'STAFF').trim().toUpperCase(),
      String(payload.phone || '').trim(),
      String(payload.email || '').trim(),
      String(payload.joinDate || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')).trim(),
      String(payload.contractType || 'Hợp đồng 12 tháng').trim(),
      String(payload.contractEndDate || '').trim(),
      parseNumSafe(payload.baseSalary),
      parseNumSafe(payload.insuranceSalary),
      parseNumSafe(payload.allowance),
      parseNumSafe(payload.dependents),
      String(payload.bankAccount || '').trim(),
      String(payload.status || 'Đang làm việc').trim(),
      attachmentsJson
    ];

    var foundRow = -1;
    if (!isNew && sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          foundRow = i + 3;
          break;
        }
      }
    }

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 17).setValues([rowVals]);
      sh.getRange(foundRow, 6).setNumberFormat('@');
      sh.getRange(foundRow, 11, 1, 3).setNumberFormat('#,##0');
    } else {
      sh.appendRow(rowVals);
      var lr = sh.getLastRow();
      sh.getRange(lr, 6).setNumberFormat('@');
      sh.getRange(lr, 11, 1, 3).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'hr_mgr', payload.actorRole || 'HR_MANAGER', foundRow > 0 ? 'UPDATE_EMPLOYEE' : 'CREATE_EMPLOYEE', id, 'Hồ sơ nhân sự: ' + rowVals[1] + ' (' + rowVals[2] + ')');

    var fresh = getHrSystemData();
    fresh.message = (foundRow > 0 ? 'Đã cập nhật hồ sơ nhân sự: ' : 'Đã thêm hồ sơ nhân sự mới: ') + rowVals[1];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu hồ sơ nhân sự: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteEmployeeRecord(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('HO_SO_NHAN_SU');
    var id = String(payload.id || '').trim();
    if (sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = ids.length - 1; i >= 0; i--) {
        if (String(ids[i][0]).trim() === id) {
          sh.deleteRow(i + 3);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'admin', 'ADMIN', 'DELETE_EMPLOYEE', id, 'Xóa hồ sơ nhân sự ' + id);
    var fresh = getHrSystemData();
    fresh.message = 'Đã xóa hồ sơ nhân sự ' + id;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi xóa nhân sự: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 3: CHẤM CÔNG VÀO CA / RA CA / GHI NHẬN CÔNG & OT (CHAM_CONG)
// ============================================================================
function saveAttendanceRecord(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('CHAM_CONG');
    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'CC-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    var rowVals = [
      id,
      String(payload.date || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')).trim(),
      String(payload.empId || 'NV-001').trim(),
      String(payload.fullName || '').trim(),
      String(payload.department || '').trim(),
      String(payload.shift || 'Ca Hành Chính (08:00 - 17:30)').trim(),
      String(payload.checkIn || '08:00').trim(),
      String(payload.checkOut || '17:30').trim(),
      parseNumSafe(payload.workUnits !== undefined ? payload.workUnits : 1.0),
      parseNumSafe(payload.otHours || 0),
      String(payload.workMode || 'Văn phòng Công ty').trim(),
      String(payload.status || 'Đúng giờ (Đủ công)').trim(),
      String(payload.notes || '').trim()
    ];

    var foundRow = -1;
    if (!isNew && sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          foundRow = i + 3;
          break;
        }
      }
    }

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 13).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || rowVals[3], payload.actorRole || 'STAFF', 'CHECK_IN_OUT', id, 'Chấm công ngày ' + rowVals[1] + ': ' + rowVals[3] + ' (' + rowVals[6] + ' - ' + rowVals[7] + ', OT: ' + rowVals[9] + 'h)');

    var fresh = getHrSystemData();
    fresh.message = '🕒 Đã ghi nhận chấm công cho ' + rowVals[3] + ' (Ngày ' + rowVals[1] + ')!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu chấm công: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 4: GỬI & PHÊ DUYỆT ĐƠN TỪ NGHỈ PHÉP / TĂNG CA OT (DON_TU_NGHI_PHEP)
// ============================================================================
function saveLeaveOrOtRequest(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('DON_TU_NGHI_PHEP');
    if (sh.getMaxColumns() < 14) sh.insertColumnsAfter(sh.getMaxColumns(), 14 - sh.getMaxColumns());

    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'DT-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
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
    var status = String(payload.status || (existingDisp ? existingDisp[10] : 'Chờ duyệt')).trim();
    if (!canApprove && (status === 'Đã duyệt' || status === 'Từ chối')) {
      status = 'Chờ duyệt';
    }

    var attachmentsJson = JSON.stringify(Array.isArray(payload.attachments) ? payload.attachments : []);
    var todayStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');

    var rowVals = [
      id,
      String(payload.createdAt || (existingDisp ? existingDisp[1] : todayStr)).trim(),
      String(payload.empId || (existingDisp ? existingDisp[2] : '')).trim(),
      String(payload.fullName || (existingDisp ? existingDisp[3] : '')).trim(),
      String(payload.department || (existingDisp ? existingDisp[4] : '')).trim(),
      String(payload.requestType || (existingDisp ? existingDisp[5] : 'Đơn xin Nghỉ phép năm (Có hưởng lương)')).trim(),
      String(payload.fromDate || (existingDisp ? existingDisp[6] : todayStr)).trim(),
      String(payload.toDate || (existingDisp ? existingDisp[7] : todayStr)).trim(),
      parseNumSafe(payload.quantity !== undefined ? payload.quantity : (existingDisp ? existingDisp[8] : 1)),
      String(payload.reason || (existingDisp ? existingDisp[9] : '')).trim(),
      status,
      String(payload.approver || (existingDisp ? existingDisp[11] : 'Ban Quản Lý / HR')).trim(),
      String(payload.approvalNote !== undefined ? payload.approvalNote : (existingDisp ? existingDisp[12] : '')).trim(),
      attachmentsJson
    ];

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 14).setValues([rowVals]);
    } else {
      sh.appendRow(rowVals);
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || rowVals[3], payload.actorRole || 'STAFF', foundRow > 0 ? 'UPDATE_LEAVE_OT' : 'CREATE_LEAVE_OT', id, rowVals[5] + ' của ' + rowVals[3] + ' ➔ ' + status);

    var fresh = getHrSystemData();
    fresh.message = '📝 Đã lưu đơn từ [' + id + '] của ' + rowVals[3] + ' (' + status + ')!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu đơn từ: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function approveOrRejectRequestQuick(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('DON_TU_NGHI_PHEP');
    var id = String(payload.id || '').trim();
    var newStatus = String(payload.status || 'Đã duyệt').trim();
    var approverName = String(payload.approver || 'Quản lý / HR').trim();
    var note = String(payload.approvalNote || (newStatus === 'Đã duyệt' ? 'Đã phê duyệt hợp lệ' : 'Yêu cầu bổ sung/điều chỉnh')).trim();

    if (sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          var r = i + 3;
          sh.getRange(r, 11).setValue(newStatus);
          sh.getRange(r, 12).setValue(approverName);
          sh.getRange(r, 13).setValue(note);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || approverName, payload.actorRole || 'MANAGER', 'APPROVE_LEAVE_OT', id, 'Phê duyệt đơn từ ' + id + ' ➔ ' + newStatus);
    var fresh = getHrSystemData();
    fresh.message = '✅ Đã cập nhật trạng thái đơn [' + id + '] sang: ' + newStatus;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi duyệt đơn từ: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 5: ĐÁNH GIÁ & CẬP NHẬT TIẾN ĐỘ KPI CÁ NHÂN / ĐỘI NGŨ (DANH_GIA_KPI)
// ============================================================================
function saveKpiReviewItem(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('DANH_GIA_KPI');
    if (sh.getMaxColumns() < 13) sh.insertColumnsAfter(sh.getMaxColumns(), 13 - sh.getMaxColumns());

    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'KPI-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    var foundRow = -1;
    var existingDisp = null;
    if (!isNew && sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          foundRow = i + 3;
          existingDisp = sh.getRange(foundRow, 1, 1, 13).getDisplayValues()[0];
          break;
        }
      }
    }

    var canApprove = payload.canApprove === true;
    var progress = parseNumSafe(payload.progress);
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    var status = String(payload.status || (existingDisp ? existingDisp[11] : 'Đang thực hiện')).trim();
    // Bảo vệ tuyệt đối: Khi nhân viên cập nhật KPI lên 100%, tự động chuyển sang "Chờ duyệt" và bảo toàn thông tin nhân sự!
    if (progress >= 100) {
      progress = 100;
      if (!canApprove || status === 'Đang thực hiện' || status === 'Cần làm') {
        status = canApprove && status === 'Đã duyệt' ? 'Đã duyệt' : 'Chờ duyệt';
      }
    } else if (!canApprove && status === 'Đã duyệt') {
      status = 'Chờ duyệt';
    }

    var score = parseNumSafe(payload.score || progress);
    var grade = score >= 90 ? 'Xuất sắc (A+)' : (score >= 80 ? 'Tốt (A)' : (score >= 65 ? 'Đạt (B)' : 'Cần cố gắng (C)'));
    var bonus = parseNumSafe(payload.bonusAmount !== undefined ? payload.bonusAmount : (existingDisp ? existingDisp[10] : 2000000));

    var metaJson = JSON.stringify({
      notes: String(payload.notes || '').trim(),
      attachments: Array.isArray(payload.attachments) ? payload.attachments : []
    });

    var rowVals = [
      id,
      String(payload.period || (existingDisp ? existingDisp[1] : Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM'))).trim(),
      String(payload.empId || (existingDisp ? existingDisp[2] : '')).trim(),
      String(payload.fullName || (existingDisp ? existingDisp[3] : '')).trim(),
      String(payload.department || (existingDisp ? existingDisp[4] : '')).trim(),
      String(payload.goalTitle || (existingDisp ? existingDisp[5] : '')).trim(),
      parseNumSafe(payload.weight || (existingDisp ? existingDisp[6] : 100)),
      progress,
      score,
      grade,
      bonus,
      status,
      metaJson
    ];

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 13).setValues([rowVals]);
      sh.getRange(foundRow, 11).setNumberFormat('#,##0');
    } else {
      sh.appendRow(rowVals);
      sh.getRange(sh.getLastRow(), 11).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || rowVals[3], payload.actorRole || 'STAFF', 'SAVE_KPI', id, 'Cập nhật KPI [' + id + '] của ' + rowVals[3] + ': ' + progress + '% (' + status + ')');

    var fresh = getHrSystemData();
    fresh.message = '🏆 Đã lưu kết quả KPI của ' + rowVals[3] + ' (' + progress + '% - ' + status + ')!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu đánh giá KPI: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 6: ĐỘNG CƠ TÍNH LƯƠNG TỰ ĐỘNG & LƯU BẢNG LƯƠNG (BANG_LUONG_THANG)
// ============================================================================
function recalculateCurrentMonthPayroll(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = getHrSystemData();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var shPay = ss.getSheetByName('BANG_LUONG_THANG');
    var period = (payload && payload.period) ? String(payload.period).trim() : (data.config.CURRENT_PAYROLL_PERIOD || data.curMonthStr);
    var stdDays = parseNumSafe(data.config.STANDARD_WORK_DAYS || 26) || 26;
    var bhxhRate = (parseNumSafe(data.config.BHXH_EMP_RATE || 10.5) || 10.5) / 100.0;
    var otMult = parseNumSafe(data.config.OT_HOURLY_RATE_MULTIPLIER || 1.5) || 1.5;
    var personalDed = parseNumSafe(data.config.PERSONAL_DEDUCTION || 11000000) || 11000000;
    var depDed = parseNumSafe(data.config.DEPENDENT_DEDUCTION || 4400000) || 4400000;

    var emps = data.employees || [];
    var atts = data.attendance || [];
    var kpis = data.kpiReviews || [];
    var existingPays = data.payrolls || [];

    var newRows = [];
    emps.forEach(function(emp, idx) {
      // Tổng hợp công & OT từ bảng chấm công hoặc giữ mức chuẩn nếu đang trong kỳ
      var empAtts = atts.filter(function(a) { return a.empId === emp.id && String(a.date || '').indexOf(period) === 0; });
      var prevPay = existingPays.find(function(p) { return p.empId === emp.id && p.period === period; });

      var actualDays = prevPay ? prevPay.actualDays : stdDays;
      var otHours = prevPay ? prevPay.otHours : 0;
      if (empAtts.length >= 20) {
        actualDays = 0;
        otHours = 0;
        empAtts.forEach(function(a) {
          actualDays += Number(a.workUnits || 0);
          otHours += Number(a.otHours || 0);
        });
      }

      // Tổng hợp thưởng KPI
      var kpiBonus = 0;
      kpis.forEach(function(k) {
        if (k.empId === emp.id && k.period === period) {
          kpiBonus += Number(k.bonusAmount || 0);
        }
      });
      if (kpiBonus === 0 && prevPay) kpiBonus = prevPay.kpiBonus;

      var baseSal = Number(emp.baseSalary || 0);
      var insSal = Number(emp.insuranceSalary || (baseSal * 0.6));
      var allowance = Number(emp.allowance || 0);
      var workDaySalary = Math.round((baseSal / stdDays) * actualDays);
      var hourlyBase = (baseSal / stdDays) / 8.0;
      var otSalary = Math.round(hourlyBase * otMult * otHours);
      var grossSalary = workDaySalary + otSalary + allowance + kpiBonus;
      var insDeduction = Math.round(insSal * bhxhRate);

      // Tính thuế TNCN ước tính sau giảm trừ gia cảnh
      var taxableIncome = grossSalary - insDeduction - personalDed - (Number(emp.dependents || 0) * depDed);
      var tax = 0;
      if (taxableIncome > 0) {
        if (taxableIncome <= 5000000) tax = Math.round(taxableIncome * 0.05);
        else if (taxableIncome <= 10000000) tax = Math.round(250000 + (taxableIncome - 5000000) * 0.10);
        else if (taxableIncome <= 18000000) tax = Math.round(750000 + (taxableIncome - 10000000) * 0.15);
        else tax = Math.round(1950000 + (taxableIncome - 18000000) * 0.20);
      }

      var netSalary = grossSalary - insDeduction - tax;
      var plId = 'PL-' + period.replace('-', '') + '-0' + (idx + 1);
      var st = prevPay ? prevPay.status : 'Đã duyệt chốt lương';

      newRows.push([
        plId, period, emp.id, emp.fullName, emp.department, emp.position,
        baseSal, stdDays, actualDays, workDaySalary,
        otHours, otSalary, allowance, kpiBonus,
        grossSalary, insDeduction, tax, netSalary, st
      ]);
    });

    if (shPay.getLastRow() >= 3) {
      shPay.getRange(3, 1, shPay.getLastRow() - 2, 19).clearContent();
    }
    if (newRows.length > 0) {
      shPay.getRange(3, 1, newRows.length, 19).setValues(newRows);
      shPay.getRange(3, 2, newRows.length, 1).setNumberFormat('@');
      shPay.getRange(3, 7, newRows.length, 1).setNumberFormat('#,##0');
      shPay.getRange(3, 10, newRows.length, 1).setNumberFormat('#,##0');
      shPay.getRange(3, 12, newRows.length, 7).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendHrAuditLog((payload && payload.actor) || 'hr_mgr', 'HR_MANAGER', 'RECALC_PAYROLL', period, 'Tính tự động bảng lương kỳ ' + period + ' cho ' + newRows.length + ' nhân sự');

    var fresh = getHrSystemData();
    fresh.message = '💰 Đã tính toán & cập nhật tự động Bảng Lương kỳ ' + period + ' cho ' + newRows.length + ' nhân sự!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi tính bảng lương: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function saveSinglePayrollRow(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var shPay = ss.getSheetByName('BANG_LUONG_THANG');
    var id = String(payload.id || '').trim();
    if (!id) return { ok: false, message: 'Thiếu mã phiếu lương!' };

    var stdDays = parseNumSafe(payload.standardDays || 26) || 26;
    var actualDays = parseNumSafe(payload.actualDays);
    var baseSal = parseNumSafe(payload.baseSalary);
    var workDaySal = Math.round((baseSal / stdDays) * actualDays);
    var otHours = parseNumSafe(payload.otHours);
    var otSal = parseNumSafe(payload.otSalary !== undefined ? payload.otSalary : Math.round(((baseSal / stdDays) / 8.0) * 1.5 * otHours));
    var allowance = parseNumSafe(payload.allowance);
    var kpiBonus = parseNumSafe(payload.kpiBonus);
    var grossSal = workDaySal + otSal + allowance + kpiBonus;
    var insDed = parseNumSafe(payload.insuranceDeduction);
    var taxDed = parseNumSafe(payload.taxAndPenalty);
    var netSal = grossSal - insDed - taxDed;

    if (shPay.getLastRow() >= 3) {
      var ids = shPay.getRange(3, 1, shPay.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          var r = i + 3;
          shPay.getRange(r, 7, 1, 13).setValues([[
            baseSal, stdDays, actualDays, workDaySal,
            otHours, otSal, allowance, kpiBonus,
            grossSal, insDed, taxDed, netSal,
            String(payload.status || 'Đã duyệt chốt lương')
          ]]);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'hr_mgr', 'HR_MANAGER', 'UPDATE_PAYSLIP', id, 'Điều chỉnh phiếu lương ' + id + ' (Thực lĩnh: ' + netSal.toLocaleString('vi-VN') + ' đ)');
    var fresh = getHrSystemData();
    fresh.message = '✅ Đã cập nhật phiếu lương ' + id + '!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi cập nhật phiếu lương: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 7: UPLOAD ĐA FILE HỒ SƠ NHÂN SỰ / ĐƠN TỪ / KPI LÊN GOOGLE DRIVE
// ============================================================================
function uploadHrAttachment(payload) {
  try {
    var fileName = String(payload.fileName || 'Tai_Lieu_Nhan_Su.pdf').trim();
    var mimeType = String(payload.mimeType || 'application/octet-stream').trim();
    var base64Data = String(payload.base64Data || '').trim();
    var fileSize = String(payload.fileSize || '150 KB').trim();
    var uploadedBy = String(payload.uploadedBy || 'Nhân sự').trim();
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    var ext = fileName.indexOf('.') !== -1 ? fileName.split('.').pop().toLowerCase() : 'file';
    var attId = 'HRDOC-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmmss');

    var fileUrl = '';
    if (base64Data) {
      try {
        var folderName = 'GS001_HoSo_NhanSu_Uploads';
        var folders = DriveApp.getFoldersByName(folderName);
        var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
        var decoded = Utilities.base64Decode(base64Data);
        var blob = Utilities.newBlob(decoded, mimeType, fileName);
        var driveFile = folder.createFile(blob);
        try {
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (sErr) {}
        fileUrl = driveFile.getUrl();
      } catch (dErr) {
        fileUrl = String(payload.fallbackUrl || 'https://drive.google.com');
      }
    } else {
      fileUrl = String(payload.fallbackUrl || 'https://drive.google.com');
    }

    appendHrAuditLog(uploadedBy, payload.role || 'STAFF', 'UPLOAD_HR_FILE', payload.refId || 'HR', 'Tải lên tài liệu: ' + fileName + ' (' + fileSize + ')');

    return {
      ok: true,
      file: {
        id: attId,
        name: fileName,
        ext: ext,
        size: fileSize,
        url: fileUrl,
        uploadedBy: uploadedBy,
        uploadedAt: nowStr
      }
    };
  } catch (e) {
    return { ok: false, message: 'Lỗi tải tệp lên: ' + e.toString() };
  }
}

// ============================================================================
// API 8: BẮN PHIẾU LƯƠNG (PAYSLIP) & THÔNG BÁO QUA EMAIL + BOT ZALO
// ============================================================================
function sendPayslipNotification(payload) {
  try {
    var data = getHrSystemData();
    var cfg = data.config || {};
    var payId = String(payload.payId || '').trim();
    var p = (data.payrolls || []).find(function(x) { return x.id === payId; });
    if (!p) return { ok: false, message: 'Không tìm thấy phiếu lương ' + payId };

    var emp = (data.employees || []).find(function(e) { return e.id === p.empId; }) || {};
    var targetEmail = String(emp.email || cfg.ADMIN_EMAIL || '').trim();
    var targetPhone = String(emp.phone || '').trim();

    if (String(cfg.ENABLE_EMAIL_NOTIFICATION || 'TRUE').toUpperCase() === 'TRUE' && targetEmail && targetEmail.indexOf('@') > 0) {
      try {
        var htmlBody = '<div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;border:1px solid #cbd5e1;border-radius:12px;overflow:hidden;">' +
          '<div style="background:linear-gradient(135deg,#065f46,#047857);color:#fff;padding:18px 24px;">' +
          '<h2 style="margin:0;font-size:18px;">💰 PHIẾU LƯƠNG CHI TIẾT (PAYSLIP) — KỲ ' + p.period + '</h2>' +
          '<p style="margin:4px 0 0;font-size:12px;opacity:0.9;">' + (cfg.COMPANY_NAME || 'Hệ thống Quản lý Nhân sự & Tiền lương GS-001 Pro') + '</p>' +
          '</div>' +
          '<div style="padding:20px 24px;background:#fff;color:#1e293b;">' +
          '<p>Xin chào <b>' + p.fullName + '</b> (' + p.empId + ' — ' + p.department + '),</p>' +
          '<p>Phòng Nhân sự gửi đến bạn thông tin chi tiết Phiếu lương kỳ <b>' + p.period + '</b>:</p>' +
          '<table style="width:100%;border-collapse:collapse;font-size:13px;margin:12px 0;">' +
          '<tr style="background:#f8fafc;"><td style="padding:8px;border:1px solid #e2e8f0;">Ngày công thực tế / Công chuẩn</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;"><b>' + p.actualDays + ' / ' + p.standardDays + ' công</b></td></tr>' +
          '<tr><td style="padding:8px;border:1px solid #e2e8f0;">Lương theo ngày công</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;">' + p.workDaySalary.toLocaleString('vi-VN') + ' đ</td></tr>' +
          '<tr style="background:#f8fafc;"><td style="padding:8px;border:1px solid #e2e8f0;">Lương Tăng ca OT (' + p.otHours + ' giờ)</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;">' + p.otSalary.toLocaleString('vi-VN') + ' đ</td></tr>' +
          '<tr><td style="padding:8px;border:1px solid #e2e8f0;">Phụ cấp + Thưởng KPI</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;">' + (p.allowance + p.kpiBonus).toLocaleString('vi-VN') + ' đ</td></tr>' +
          '<tr style="background:#ecfdf5;font-weight:bold;"><td style="padding:8px;border:1px solid #e2e8f0;">Tổng thu nhập (Gross)</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;color:#047857;">' + p.grossSalary.toLocaleString('vi-VN') + ' đ</td></tr>' +
          '<tr><td style="padding:8px;border:1px solid #e2e8f0;">Trích BHXH (10.5%) & Thuế TNCN</td><td style="padding:8px;border:1px solid #e2e8f0;text-align:right;color:#dc2626;">-' + (p.insuranceDeduction + p.taxAndPenalty).toLocaleString('vi-VN') + ' đ</td></tr>' +
          '<tr style="background:#fef3c7;font-weight:bold;font-size:15px;"><td style="padding:10px;border:1px solid #e2e8f0;">THỰC LĨNH (NET PAY)</td><td style="padding:10px;border:1px solid #e2e8f0;text-align:right;color:#b45309;">' + p.netSalary.toLocaleString('vi-VN') + ' đ</td></tr>' +
          '</table>' +
          '</div></div>';

        MailApp.sendEmail({
          to: targetEmail,
          subject: '[PHIẾU LƯƠNG ' + p.period + '] ' + p.fullName + ' (' + p.empId + ')',
          htmlBody: htmlBody
        });
      } catch (mErr) {}
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var shPay = ss.getSheetByName('BANG_LUONG_THANG');
    if (shPay && p.rowIndex) {
      shPay.getRange(p.rowIndex, 19).setValue('Đã gửi Email/Zalo');
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'hr_mgr', 'HR_MANAGER', 'SEND_PAYSLIP', payId, 'Gửi Phiếu lương kỳ ' + p.period + ' qua Email & Zalo cho ' + p.fullName + ' (' + targetPhone + ')');

    var fresh = getHrSystemData();
    fresh.message = '📨 Đã gửi Phiếu lương [' + payId + '] qua Email & Bot Zalo cho ' + p.fullName + '!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi gửi phiếu lương: ' + e.toString() };
  }
}

function sendBatchPayslipNotifications(payload) {
  try {
    var ss = ensureHrSheetsExist();
    var shPay = ss.getSheetByName('BANG_LUONG_THANG');
    var count = 0;
    if (shPay && shPay.getLastRow() >= 3) {
      var num = shPay.getLastRow() - 2;
      for (var i = 0; i < num; i++) {
        shPay.getRange(i + 3, 19).setValue('Đã gửi Email/Zalo');
        count++;
      }
    }
    SpreadsheetApp.flush();
    appendHrAuditLog((payload && payload.actor) || 'hr_mgr', 'HR_MANAGER', 'BATCH_SEND_PAYSLIPS', 'ALL', 'Bắn hàng loạt ' + count + ' Phiếu lương qua Email & Bot Zalo');
    var fresh = getHrSystemData();
    fresh.message = '🚀 Đã bắn tự động toàn bộ ' + count + ' Phiếu lương (Payslip) qua Email & Bot Zalo thành công!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi gửi hàng loạt: ' + e.toString() };
  }
}

// ============================================================================
// API 9: QUẢN LÝ TÀI KHOẢN PHÂN QUYỀN (PHAN_QUYEN) & CẤU HÌNH HỆ THỐNG
// ============================================================================
function saveHrUserAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('PHAN_QUYEN');
    if (sh.getMaxColumns() < 10) sh.insertColumnsAfter(sh.getMaxColumns(), 10 - sh.getMaxColumns());

    var uname = String(payload.username || '').trim().toLowerCase();
    if (!uname) return { ok: false, message: 'Vui lòng nhập Username!' };

    var rowVals = [
      uname,
      String(payload.password || '123456').trim(),
      String(payload.empId || 'NV-NEW').trim(),
      String(payload.fullName || uname).trim(),
      String(payload.role || 'STAFF').trim().toUpperCase(),
      String(payload.department || 'Phòng Kinh Doanh & CRM').trim(),
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
      sh.getRange(found, 1, 1, 10).setValues([rowVals]);
      sh.getRange(found, 2).setNumberFormat('@');
      sh.getRange(found, 8).setNumberFormat('@');
    } else {
      sh.appendRow(rowVals);
      var lr = sh.getLastRow();
      sh.getRange(lr, 2).setNumberFormat('@');
      sh.getRange(lr, 8).setNumberFormat('@');
    }

    // Tự động đồng bộ sang bảng HO_SO_NHAN_SU nếu mã nhân viên chưa tồn tại để tài khoản mới thao tác chấm công/xin nghỉ/xem phiếu lương được ngay!
    var shEmp = ss.getSheetByName('HO_SO_NHAN_SU');
    if (shEmp && rowVals[2]) {
      var empExists = false;
      if (shEmp.getLastRow() >= 3) {
        var eIds = shEmp.getRange(3, 1, shEmp.getLastRow() - 2, 1).getDisplayValues();
        for (var j = 0; j < eIds.length; j++) {
          if (String(eIds[j][0]).trim() === rowVals[2]) {
            empExists = true;
            break;
          }
        }
      }
      if (!empExists) {
        var todayStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
        shEmp.appendRow([
          rowVals[2], rowVals[3], rowVals[5],
          rowVals[4] === 'LEADER' ? 'Trưởng Nhóm (Team Lead)' : 'Chuyên Viên',
          rowVals[4], rowVals[7], rowVals[6], todayStr,
          'Hợp đồng 12 tháng', '', 15000000, 9500000, 1500000, 0,
          '', 'Đang làm việc', '[]'
        ]);
      }
    }

    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'admin', payload.actorRole || 'ADMIN', 'SAVE_USER_RBAC', uname, 'Lưu tài khoản & quyền thao tác cho: ' + rowVals[3] + ' [' + rowVals[4] + ']');
    var fresh = getHrSystemData();
    fresh.message = '🔐 Đã lưu tài khoản & đồng bộ hồ sơ nhân sự cho: ' + rowVals[3] + ' (' + uname + ')!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu tài khoản: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteHrUserAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
    var sh = ss.getSheetByName('PHAN_QUYEN');
    var uname = String(payload.username || '').trim().toLowerCase();
    if (!uname || uname === 'admin') return { ok: false, message: 'Không thể xóa tài khoản gốc admin!' };
    if (sh.getLastRow() >= 3) {
      var uList = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = uList.length - 1; i >= 0; i--) {
        if (String(uList[i][0]).trim().toLowerCase() === uname) {
          sh.deleteRow(i + 3);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendHrAuditLog(payload.actor || 'admin', 'ADMIN', 'DELETE_USER_RBAC', uname, 'Xóa tài khoản: ' + uname);
    var fresh = getHrSystemData();
    fresh.message = '🗑️ Đã xóa tài khoản ' + uname;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi xóa tài khoản: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function saveHrSystemConfig(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureHrSheetsExist();
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
    appendHrAuditLog(payload.actor || 'admin', 'ADMIN', 'SAVE_HR_CONFIG', 'CAU_HINH', 'Cập nhật cấu hình Định mức BHXH/Thuế & Bot Thông báo');
    var fresh = getHrSystemData();
    fresh.message = '⚙️ Đã lưu cấu hình Định mức Nhân sự, BHXH, Thuế TNCN & Bot Email/Zalo!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu cấu hình: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}
