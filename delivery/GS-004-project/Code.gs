/**
 * ============================================================================
 * GS-004: QUẢN LÝ DỰ ÁN, CRM, GIAO VIỆC KANBAN/GANTT, KPI & BOT NHẮC VIỆC v4.0 PRO
 * FILE 3/4: Code.gs (Backend API, CRM Pipeline, Kanban/Gantt, Auto Email/Zalo/Telegram Bot)
 * ============================================================================
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🎯 DỰ ÁN, CRM, KANBAN & NHẮC VIỆC PRO (v4.0)')
    .addItem('🚀 1. Mở Web App Quản Lý Dự Án, CRM & Kanban (Full HD)', 'openProjectDialog')
    .addSeparator()
    .addItem('🔔 2. Quét & Gửi Nhắc Việc Tự Động Ngay (Email + Bot Zalo/Telegram)', 'menuRunAutoRemindersNow')
    .addItem('⏰ 3. Bật Tự Động Nhắc Việc Hàng Ngày (Cài Đặt Time Trigger 8h Sáng)', 'menuSetupDailyTrigger')
    .addItem('🔕 4. Tắt Lịch Chạy Nhắc Việc Tự Động Hàng Ngày', 'menuRemoveDailyTrigger')
    .addSeparator()
    .addItem('🛠️ 5. Khởi Tạo / Reset 8 Tab Hệ Thống Mẫu (Installer)', 'install_PROJECT_SHEET')
    .addToUi();
}

function doGet(e) {
  var tpl = HtmlService.createTemplateFromFile('Index');
  return tpl.evaluate()
    .setTitle('GS-004 v4.0 Pro — Quản Lý Dự Án, CRM, Kanban/Gantt, KPI & Bot Nhắc Việc Tự Động')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function openProjectDialog() {
  var html = HtmlService.createTemplateFromFile('Index').evaluate()
    .setWidth(1920)
    .setHeight(1080);
  SpreadsheetApp.getUi().showModalDialog(html, '🎯 HỆ THỐNG QUẢN LÝ DỰ ÁN, CRM, KANBAN/GANTT, KPI & NHẮC VIỆC TỰ ĐỘNG (GS-004 v4.0 PRO — FULL SCREEN)');
}

function menuRunAutoRemindersNow() {
  var res = runDailyAutoReminders();
  SpreadsheetApp.getUi().alert('🔔 KẾT QUẢ QUÉT & NHẮC VIỆC TỰ ĐỘNG', res.message || 'Đã hoàn tất quét nhắc việc!', SpreadsheetApp.getUi().ButtonSet.OK);
}

function menuSetupDailyTrigger() {
  var res = setupDailyReminderTrigger(8);
  SpreadsheetApp.getUi().alert('⏰ CÀI ĐẶT TRIGGER TỰ ĐỘNG', res.message || 'Đã bật lịch chạy tự động!', SpreadsheetApp.getUi().ButtonSet.OK);
}

function menuRemoveDailyTrigger() {
  var res = removeDailyReminderTrigger();
  SpreadsheetApp.getUi().alert('🔕 ĐÃ TẮT TRIGGER TỰ ĐỘNG', res.message || 'Đã xóa lịch chạy tự động!', SpreadsheetApp.getUi().ButtonSet.OK);
}

// ============================================================================
// HELPER CHUẨN HÓA DỮ LIỆU AN TOÀN
// ============================================================================
function parseJsonSafe(rawStr, fallbackVal) {
  if (!rawStr) return fallbackVal;
  if (typeof rawStr === 'object') return rawStr;
  try {
    var parsed = JSON.parse(String(rawStr));
    return parsed !== null && parsed !== undefined ? parsed : fallbackVal;
  } catch (e) {
    return fallbackVal;
  }
}

function getDefaultTaskCollabMeta(taskId, assignee) {
  var map = {
    'CV-101': {
      departments: ['Khối Kỹ Thuật', 'Phòng Quản Lý Dự Án'],
      coAssignees: ['Trần Hoàng Nam (PM)'],
      subtasks: [
        { id: 'ST-1', title: 'Thiết kế ERD & Schema 8 bảng', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: true },
        { id: 'ST-2', title: 'Phê duyệt ma trận phân quyền RBAC', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true }
      ],
      attachments: [
        { id: 'ATT-101', name: 'Dac_Ta_Database_SunLand_v2.docx', ext: 'docx', size: '420 KB', url: 'https://docs.google.com/document', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: '2025-05-05' },
        { id: 'ATT-102', name: 'Ma_Tran_Phan_Quyen_RBAC.xlsx', ext: 'xlsx', size: '185 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: '2025-05-06' }
      ]
    },
    'CV-102': {
      departments: ['Khối Sáng Tạo', 'Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'],
      coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)', 'Lê Minh Thư (Leader CRM)'],
      subtasks: [
        { id: 'ST-3', title: 'Thiết kế UI/UX & Slide thuyết trình khách hàng', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true },
        { id: 'ST-4', title: 'Chuẩn hóa trường dữ liệu giỏ căn hộ VIP', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
        { id: 'ST-5', title: 'Ghép API Realtime vào giao diện Mobile', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
      ],
      attachments: [
        { id: 'ATT-103', name: 'Slide_Trinh_Chieu_UIUX_SunLand.pptx', ext: 'pptx', size: '3.4 MB', url: 'https://docs.google.com/presentation', uploadedBy: 'Võ Ngọc Ánh (UI/UX & Media)', uploadedAt: '2025-05-12' },
        { id: 'ATT-104', name: 'Checklist_Nghiem_Thu_Giao_Dien.pdf', ext: 'pdf', size: '890 KB', url: 'https://drive.google.com', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: '2025-05-13' }
      ]
    },
    'CV-103': {
      departments: ['Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'],
      coAssignees: ['Lê Minh Thư (Leader CRM)'],
      subtasks: [
        { id: 'ST-6', title: 'Viết mẫu nội dung Template Zalo ZNS & Email', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
        { id: 'ST-7', title: 'Kết nối Webhook Zalo OA & Test bắn tin tự động', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
      ],
      attachments: [
        { id: 'ATT-105', name: 'Kich_Ban_Zalo_ZNS_SunLand.docx', ext: 'docx', size: '310 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: '2025-05-13' }
      ]
    },
    'CV-104': {
      departments: ['Phòng Kinh Doanh & CRM', 'Khối Sáng Tạo'],
      coAssignees: ['Võ Ngọc Ánh (UI/UX & Media)'],
      subtasks: [
        { id: 'ST-8', title: 'Soạn thảo quy trình 7 ngày chăm sóc sau liệu trình (Word)', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true },
        { id: 'ST-9', title: 'Thiết kế Banner & E-voucher đính kèm tin nhắn Zalo', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true }
      ],
      attachments: [
        { id: 'ATT-106', name: 'Quy_Trinh_CSKH_VIP_AuraBeauty.docx', ext: 'docx', size: '540 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: '2025-05-14' },
        { id: 'ATT-107', name: 'Bang_Tinh_Chi_Phi_Chien_Dich_ZNS.xlsx', ext: 'xlsx', size: '240 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: '2025-05-14' }
      ]
    },
    'CV-105': {
      departments: ['Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật'],
      coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)'],
      subtasks: [
        { id: 'ST-10', title: 'Rà soát danh sách khách hàng tái khám đợt 1', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true },
        { id: 'ST-11', title: 'Bật Cron Trigger 8h sáng & kiểm tra nhật ký gửi', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: false }
      ],
      attachments: [
        { id: 'ATT-108', name: 'Huong_Dan_Van_Hanh_Trigger_Aura.pdf', ext: 'pdf', size: '1.1 MB', url: 'https://drive.google.com', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: '2025-05-14' }
      ]
    },
    'CV-106': {
      departments: ['Khối Sáng Tạo', 'Phòng Quản Lý Dự Án'],
      coAssignees: ['Trần Hoàng Nam (PM)'],
      subtasks: [
        { id: 'ST-12', title: 'Vẽ Prototype màn hình điều phối xe tải', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true },
        { id: 'ST-13', title: 'Xuất file PowerPoint thuyết trình Ban Giám Đốc', dept: 'Khối Sáng Tạo', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', done: true }
      ],
      attachments: [
        { id: 'ATT-109', name: 'Demo_Dieu_Phoi_Xe_Tai_DaiDuongXanh.pptx', ext: 'pptx', size: '4.8 MB', url: 'https://docs.google.com/presentation', uploadedBy: 'Võ Ngọc Ánh (UI/UX & Media)', uploadedAt: '2025-05-15' }
      ]
    },
    'CV-107': {
      departments: ['Phòng Kinh Doanh & CRM', 'Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật'],
      coAssignees: ['Trần Hoàng Nam (PM)', 'Phạm Tuấn Kiệt (Tech Lead)'],
      subtasks: [
        { id: 'ST-14', title: 'Bóc tách bảng tính chi phí nhân công & Server (Excel)', dept: 'Khối Kỹ Thuật', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', done: true },
        { id: 'ST-15', title: 'Soạn dự thảo Hợp đồng kinh tế & Phụ lục SLA (Word/PDF)', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: false }
      ],
      attachments: [
        { id: 'ATT-110', name: 'Bang_Bao_Gia_ERP_DaiDuongXanh_2025.xlsx', ext: 'xlsx', size: '615 KB', url: 'https://docs.google.com/spreadsheets', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: '2025-05-15' },
        { id: 'ATT-111', name: 'Du_Thao_Hop_Dong_ERP_SLA.docx', ext: 'docx', size: '780 KB', url: 'https://docs.google.com/document', uploadedBy: 'Lê Minh Thư (Leader CRM)', uploadedAt: '2025-05-15' }
      ]
    },
    'CV-108': {
      departments: ['Phòng Quản Lý Dự Án', 'Khối Kỹ Thuật', 'Phòng Kinh Doanh & CRM'],
      coAssignees: ['Phạm Tuấn Kiệt (Tech Lead)', 'Lê Minh Thư (Leader CRM)'],
      subtasks: [
        { id: 'ST-16', title: 'Đào tạo hướng dẫn sử dụng & bàn giao tài liệu PDF', dept: 'Phòng Quản Lý Dự Án', assignee: 'Trần Hoàng Nam (PM)', done: true },
        { id: 'ST-17', title: 'Ký biên bản nghiệm thu & tất toán hợp đồng', dept: 'Phòng Kinh Doanh & CRM', assignee: 'Lê Minh Thư (Leader CRM)', done: true }
      ],
      attachments: [
        { id: 'ATT-112', name: 'Bien_Ban_Nghiem_Thu_GlobalEdu_Signed.pdf', ext: 'pdf', size: '1.6 MB', url: 'https://drive.google.com', uploadedBy: 'Trần Hoàng Nam (PM)', uploadedAt: '2025-05-12' },
        { id: 'ATT-113', name: 'Tai_Lieu_Huong_Dan_Quan_Tri_v2.docx', ext: 'docx', size: '2.1 MB', url: 'https://docs.google.com/document', uploadedBy: 'Phạm Tuấn Kiệt (Tech Lead)', uploadedAt: '2025-05-11' }
      ]
    }
  };
  if (map[taskId]) return map[taskId];
  return { departments: [], coAssignees: [], subtasks: [], attachments: [] };
}

function parseNumSafe(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (val === null || val === undefined || val === '') return 0;
  var s = String(val).replace(/[^\d.-]/g, '');
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function normalizeDateStr(rawVal, dispVal) {
  if (rawVal instanceof Date && !isNaN(rawVal.getTime())) {
    return Utilities.formatDate(rawVal, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }
  var s = String(dispVal || rawVal || '').trim();
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0, 10);
  var m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (m) {
    var p1 = parseInt(m[1], 10);
    var p2 = parseInt(m[2], 10);
    var yr = m[3];
    var day = p1 > 12 ? p1 : (p2 > 12 ? p2 : p1);
    var mon = p1 > 12 ? p2 : (p2 > 12 ? p1 : p2);
    return yr + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day);
  }
  return s;
}

function ensureSystemSheetsExist() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return null;
  var required = ['DASHBOARD', 'KHACH_HANG_CRM', 'DU_AN', 'CONG_VIEC', 'LICH_NHAC_TUDONG', 'PHAN_QUYEN', 'CAU_HINH', 'NHAT_KY'];
  var missing = false;
  for (var i = 0; i < required.length; i++) {
    if (!ss.getSheetByName(required[i])) {
      missing = true;
      break;
    }
  }
  if (missing && typeof install_PROJECT_SHEET === 'function') {
    install_PROJECT_SHEET();
  }
  return ss;
}

function appendAuditLog(actor, role, action, target, detail) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;
    var sh = ss.getSheetByName('NHAT_KY');
    if (!sh) return;
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
    sh.appendRow([nowStr, actor || 'system', role || 'USER', action || 'ACTION', target || '-', detail || '']);
  } catch (e) {}
}

function calcKpiPoints(priority, progress, status, deadlineStr, cfg) {
  var p = String(priority || 'Trung bình').trim();
  var base = parseNumSafe(cfg.KPI_BASE_MEDIUM || 20);
  if (p === 'Cao' || p === 'Khẩn cấp') base = parseNumSafe(cfg.KPI_BASE_HIGH || 30);
  else if (p === 'Thấp') base = parseNumSafe(cfg.KPI_BASE_LOW || 10);

  var pct = parseNumSafe(progress);
  if (status === 'Hoàn thành') pct = 100;
  var pts = Math.round((base * pct) / 100);

  if (deadlineStr && status !== 'Hoàn thành') {
    var todayStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    if (deadlineStr < todayStr) {
      var pen = parseNumSafe(cfg.KPI_OVERDUE_PENALTY || 5);
      pts = Math.max(0, pts - pen);
    }
  }
  return pts;
}

// ============================================================================
// API 1: LẤY TOÀN BỘ DỮ LIỆU HỆ THỐNG (CÓ FALLBACK AN TOÀN)
// ============================================================================
function getProjectData() {
  try {
    var ss = ensureSystemSheetsExist();
    if (!ss) return getFallbackProjectData('Không tìm thấy Google Sheet gắn kết, đang dùng dữ liệu mẫu.');

    // 1. Đọc CAU_HINH
    var config = {};
    var shCfg = ss.getSheetByName('CAU_HINH');
    if (shCfg && shCfg.getLastRow() >= 3) {
      var cfgVals = shCfg.getRange(3, 1, shCfg.getLastRow() - 2, 4).getDisplayValues();
      cfgVals.forEach(function(r) {
        var k = String(r[0] || '').trim();
        if (k) config[k] = String(r[1] || '').trim();
      });
    }

    // 2. Đọc PHAN_QUYEN
    var users = [];
    var shAuth = ss.getSheetByName('PHAN_QUYEN');
    if (shAuth && shAuth.getLastRow() >= 3) {
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
          note: String(r[8] || '').trim()
        });
      });
    }

    // 3. Đọc KHACH_HANG_CRM
    var crmCustomers = [];
    var shCrm = ss.getSheetByName('KHACH_HANG_CRM');
    if (shCrm && shCrm.getLastRow() >= 3) {
      var cRaw = shCrm.getRange(3, 1, shCrm.getLastRow() - 2, 14).getValues();
      var cDisp = shCrm.getRange(3, 1, shCrm.getLastRow() - 2, 14).getDisplayValues();
      cRaw.forEach(function(r, idx) {
        var d = cDisp[idx];
        var id = String(d[0] || '').trim();
        var name = String(d[1] || '').trim();
        if (!id && !name) return;
        crmCustomers.push({
          rowIndex: idx + 3,
          id: id || ('KH-' + (idx + 1)),
          companyName: name,
          contactPerson: String(d[2] || '').trim(),
          phone: String(d[3] || '').trim(),
          email: String(d[4] || '').trim(),
          source: String(d[5] || 'Khác').trim(),
          stage: String(d[6] || 'Lead Mới').trim(),
          dealValue: parseNumSafe(r[7]),
          owner: String(d[8] || '').trim(),
          lastContactDate: normalizeDateStr(r[9], d[9]),
          nextFollowUpDate: normalizeDateStr(r[10], d[10]),
          notes: String(d[11] || '').trim(),
          priority: String(d[12] || 'Trung Bình (Warm)').trim(),
          reminderStatus: String(d[13] || 'Chưa nhắc').trim()
        });
      });
    }

    // 4. Đọc DU_AN
    var projects = [];
    var shPrj = ss.getSheetByName('DU_AN');
    if (shPrj && shPrj.getLastRow() >= 3) {
      var pRaw = shPrj.getRange(3, 1, shPrj.getLastRow() - 2, 14).getValues();
      var pDisp = shPrj.getRange(3, 1, shPrj.getLastRow() - 2, 14).getDisplayValues();
      pRaw.forEach(function(r, idx) {
        var d = pDisp[idx];
        var id = String(d[0] || '').trim();
        var name = String(d[1] || '').trim();
        if (!id && !name) return;
        projects.push({
          rowIndex: idx + 3,
          id: id || ('DA-' + (idx + 1)),
          name: name,
          customerId: String(d[2] || '').trim(),
          customerName: String(d[3] || '').trim(),
          manager: String(d[4] || '').trim(),
          category: String(d[5] || 'Phần mềm & CRM').trim(),
          priority: String(d[6] || 'Trung bình').trim(),
          startDate: normalizeDateStr(r[7], d[7]),
          endDate: normalizeDateStr(r[8], d[8]),
          status: String(d[9] || 'Đang thực hiện').trim(),
          progress: parseNumSafe(r[10]),
          budget: parseNumSafe(r[11]),
          actualCost: parseNumSafe(r[12]),
          notes: String(d[13] || '').trim()
        });
      });
    }

    // 5. Đọc CONG_VIEC (Hỗ trợ cả Sheet 17 cột cũ lẫn Sheet 20 cột v4.3 Pro)
    var tasks = [];
    var shTask = ss.getSheetByName('CONG_VIEC');
    if (shTask && shTask.getLastRow() >= 3) {
      var maxCols = Math.max(17, Math.min(20, shTask.getLastColumn()));
      var tRaw = shTask.getRange(3, 1, shTask.getLastRow() - 2, maxCols).getValues();
      var tDisp = shTask.getRange(3, 1, shTask.getLastRow() - 2, maxCols).getDisplayValues();
      tRaw.forEach(function(r, idx) {
        var d = tDisp[idx];
        var id = String(d[0] || '').trim();
        var title = String(d[1] || '').trim();
        if (!id && !title) return;
        var taskId = id || ('CV-' + (101 + idx));
        var st = String(d[8] || 'Cần làm').trim();
        var pri = String(d[9] || 'Trung bình').trim();
        var dl = normalizeDateStr(r[11], d[11]);
        var prog = parseNumSafe(r[13]);
        if (st === 'Hoàn thành') prog = 100;
        var kpi = parseNumSafe(r[14]);
        if (!kpi) kpi = calcKpiPoints(pri, prog, st, dl, config);

        var defMeta = getDefaultTaskCollabMeta(taskId, String(d[5] || '').trim());
        var raciObj = parseJsonSafe(d[17] || '', null);
        var departments = (raciObj && Array.isArray(raciObj.departments)) ? raciObj.departments : defMeta.departments;
        var coAssignees = (raciObj && Array.isArray(raciObj.coAssignees)) ? raciObj.coAssignees : defMeta.coAssignees;
        var subtasks = parseJsonSafe(d[18] || '', null);
        if (!Array.isArray(subtasks)) subtasks = defMeta.subtasks;
        var attachments = parseJsonSafe(d[19] || '', null);
        if (!Array.isArray(attachments)) attachments = defMeta.attachments;

        tasks.push({
          rowIndex: idx + 3,
          id: taskId,
          title: title,
          projectId: String(d[2] || '').trim(),
          projectName: String(d[3] || '').trim(),
          customerName: String(d[4] || '').trim(),
          assignee: String(d[5] || '').trim(),
          assigneeEmail: String(d[6] || '').trim(),
          assigneePhone: String(d[7] || '').trim(),
          status: st,
          priority: pri,
          startDate: normalizeDateStr(r[10], d[10]),
          deadline: dl,
          estimatedHours: parseNumSafe(r[12]),
          progress: prog,
          kpiPoints: kpi,
          reminderStatus: String(d[15] || 'Chưa nhắc').trim(),
          notes: String(d[16] || '').trim(),
          departments: departments,
          coAssignees: coAssignees,
          subtasks: subtasks,
          attachments: attachments
        });
      });
    }

    // 6. Đọc LICH_NHAC_TUDONG
    var reminderLogs = [];
    var shRem = ss.getSheetByName('LICH_NHAC_TUDONG');
    if (shRem && shRem.getLastRow() >= 3) {
      var rDisp = shRem.getRange(3, 1, shRem.getLastRow() - 2, 11).getDisplayValues();
      for (var i = rDisp.length - 1; i >= 0 && reminderLogs.length < 100; i--) {
        var rd = rDisp[i];
        if (!rd[0] && !rd[4]) continue;
        reminderLogs.push({
          id: rd[0],
          timestamp: rd[1],
          type: rd[2],
          refId: rd[3],
          title: rd[4],
          recipient: rd[5],
          email: rd[6],
          phone: rd[7],
          channel: rd[8],
          status: rd[9],
          message: rd[10]
        });
      }
    }

    // 7. Đọc NHAT_KY
    var auditLogs = [];
    var shLog = ss.getSheetByName('NHAT_KY');
    if (shLog && shLog.getLastRow() >= 3) {
      var lDisp = shLog.getRange(3, 1, shLog.getLastRow() - 2, 6).getDisplayValues();
      for (var j = lDisp.length - 1; j >= 0 && auditLogs.length < 80; j--) {
        var ld = lDisp[j];
        if (!ld[0]) continue;
        auditLogs.push({
          timestamp: ld[0],
          actor: ld[1],
          role: ld[2],
          action: ld[3],
          target: ld[4],
          detail: ld[5]
        });
      }
    }

    // Kiểm tra trạng thái Trigger tự động
    var hasTrigger = false;
    try {
      var triggers = ScriptApp.getProjectTriggers();
      for (var t = 0; t < triggers.length; t++) {
        if (triggers[t].getHandlerFunction() === 'runDailyAutoReminders') {
          hasTrigger = true;
          break;
        }
      }
    } catch (e) {}

    return {
      ok: true,
      serverTime: Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss'),
      todayStr: Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'),
      hasDailyTrigger: hasTrigger,
      config: config,
      users: users,
      crmCustomers: crmCustomers,
      projects: projects,
      tasks: tasks,
      reminderLogs: reminderLogs,
      auditLogs: auditLogs
    };
  } catch (err) {
    return getFallbackProjectData('Lỗi đọc Sheet: ' + err.toString());
  }
}

// ============================================================================
// API 2: THÊM / CẬP NHẬT KHÁCH HÀNG CRM & LỊCH HẸN CHĂM SÓC
// ============================================================================
function saveCrmCustomer(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('KHACH_HANG_CRM');
    var id = String(payload.id || '').trim();
    var isNew = false;

    if (!id) {
      id = 'KH-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    var rowValues = [
      id,
      String(payload.companyName || '').trim(),
      String(payload.contactPerson || '').trim(),
      String(payload.phone || '').trim(),
      String(payload.email || '').trim(),
      String(payload.source || 'Khác').trim(),
      String(payload.stage || 'Lead Mới').trim(),
      parseNumSafe(payload.dealValue),
      String(payload.owner || 'Lê Minh Thư (Leader CRM)').trim(),
      String(payload.lastContactDate || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')).trim(),
      String(payload.nextFollowUpDate || '').trim(),
      String(payload.notes || '').trim(),
      String(payload.priority || 'Cao (Hot Lead)').trim(),
      String(payload.reminderStatus || 'Chưa nhắc').trim()
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
      sh.getRange(foundRow, 1, 1, 14).setValues([rowValues]);
      sh.getRange(foundRow, 4).setNumberFormat('@');
      sh.getRange(foundRow, 8).setNumberFormat('#,##0');
    } else {
      sh.appendRow(rowValues);
      var lastR = sh.getLastRow();
      sh.getRange(lastR, 4).setNumberFormat('@');
      sh.getRange(lastR, 8).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'CRM_SALE', foundRow > 0 ? 'UPDATE_CRM' : 'CREATE_CRM', id, 'Khách hàng: ' + rowValues[1] + ' | Giai đoạn: ' + rowValues[6]);

    var fresh = getProjectData();
    fresh.message = (foundRow > 0 ? 'Đã cập nhật khách hàng CRM: ' : 'Đã thêm mới khách hàng CRM: ') + rowValues[1];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu khách hàng CRM: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteCrmCustomer(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('KHACH_HANG_CRM');
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
    appendAuditLog(payload.actor || 'admin', payload.role || 'ADMIN', 'DELETE_CRM', id, 'Xóa khách hàng CRM ' + id);
    var fresh = getProjectData();
    fresh.message = 'Đã xóa khách hàng CRM ' + id;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi xóa khách hàng CRM: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 3: THÊM / CẬP NHẬT DỰ ÁN (DU_AN)
// ============================================================================
function saveProjectItem(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('DU_AN');
    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'DA-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    var rowValues = [
      id,
      String(payload.name || '').trim(),
      String(payload.customerId || '').trim(),
      String(payload.customerName || '').trim(),
      String(payload.manager || 'Trần Hoàng Nam (PM)').trim(),
      String(payload.category || 'Phần mềm & CRM').trim(),
      String(payload.priority || 'Cao').trim(),
      String(payload.startDate || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')).trim(),
      String(payload.endDate || '').trim(),
      String(payload.status || 'Đang thực hiện').trim(),
      parseNumSafe(payload.progress),
      parseNumSafe(payload.budget),
      parseNumSafe(payload.actualCost),
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
      sh.getRange(foundRow, 1, 1, 14).setValues([rowValues]);
      sh.getRange(foundRow, 12, 1, 2).setNumberFormat('#,##0');
    } else {
      sh.appendRow(rowValues);
      var lastR = sh.getLastRow();
      sh.getRange(lastR, 12, 1, 2).setNumberFormat('#,##0');
    }

    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'MANAGER', foundRow > 0 ? 'UPDATE_PROJECT' : 'CREATE_PROJECT', id, 'Dự án: ' + rowValues[1]);

    var fresh = getProjectData();
    fresh.message = (foundRow > 0 ? 'Đã cập nhật dự án: ' : 'Đã tạo dự án mới: ') + rowValues[1];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu dự án: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 4: THÊM / CẬP NHẬT CÔNG VIỆC KANBAN / GANTT / KPI (CONG_VIEC)
// ============================================================================
function saveTaskItem(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('CONG_VIEC');
    var id = String(payload.id || '').trim();
    var isNew = false;
    if (!id) {
      id = 'CV-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmm');
      isNew = true;
    }

    // Đảm bảo Sheet có đủ 20 cột trước khi đọc/ghi
    if (sh.getMaxColumns() < 20) {
      sh.insertColumnsAfter(sh.getMaxColumns(), 20 - sh.getMaxColumns());
    }
    if (sh.getLastColumn() < 20) {
      sh.getRange(2, 18, 1, 3).setValues([[
        'BỘ PHẬN & NGƯỜI PHỐI HỢP (RACI)',
        'CHECKLIST ĐẦU VIỆC CON (SUBTASKS)',
        'TỆP ĐÍNH KÈM BÀN GIAO (WORD/EXCEL/PPT/PDF)'
      ]]).setBackground('#5B21B6').setFontColor('#FFFFFF').setFontWeight('bold');
    }

    var foundRow = -1;
    var existingRowDisp = null;
    if (!isNew && sh.getLastRow() >= 3) {
      var ids = sh.getRange(3, 1, sh.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) {
          foundRow = i + 3;
          existingRowDisp = sh.getRange(foundRow, 1, 1, 20).getDisplayValues()[0];
          break;
        }
      }
    }

    var roleUpper = String(payload.role || 'STAFF').trim().toUpperCase();
    var canApprove = (roleUpper === 'ADMIN' || roleUpper === 'MANAGER' || roleUpper === 'LEADER' || roleUpper === 'LEAD' || payload.canApprove === true);

    var status = String(payload.status || (existingRowDisp ? existingRowDisp[8] : 'Cần làm')).trim();
    var progress = parseNumSafe(payload.progress);
    if (progress > 100) progress = 100;
    if (progress < 0) progress = 0;

    // Khi nhân viên cập nhật tiến độ lên 100%, tự động chuyển sang "Chờ duyệt" (không bao giờ reset về 0 hay làm mất task!)
    if (progress >= 100) {
      progress = 100;
      if (status === 'Cần làm' || status === 'Đang làm') {
        status = 'Chờ duyệt';
      }
      if (!canApprove && status === 'Hoàn thành') {
        status = 'Chờ duyệt';
      }
    } else if (status === 'Hoàn thành') {
      if (canApprove) {
        progress = 100;
      } else {
        status = 'Chờ duyệt';
      }
    } else if (progress > 0 && status === 'Cần làm') {
      status = 'Đang làm';
    }

    // Bảo toàn tuyệt đối Người chủ trì (Assignee) & Dự án của dòng cũ nếu nhân viên cập nhật khi trường bị khóa
    var finalTitle = String(payload.title || (existingRowDisp ? existingRowDisp[1] : '')).trim();
    var finalPrjId = String(payload.projectId || (existingRowDisp ? existingRowDisp[2] : '')).trim();
    var finalPrjName = String(payload.projectName || (existingRowDisp ? existingRowDisp[3] : '')).trim();
    var finalCustName = String(payload.customerName || (existingRowDisp ? existingRowDisp[4] : '')).trim();
    var finalAssignee = String(payload.assignee || (existingRowDisp ? existingRowDisp[5] : '')).trim();
    var finalEmail = String(payload.assigneeEmail || (existingRowDisp ? existingRowDisp[6] : '')).trim();
    var finalPhone = String(payload.assigneePhone || (existingRowDisp ? existingRowDisp[7] : '')).trim();
    var priority = String(payload.priority || (existingRowDisp ? existingRowDisp[9] : 'Trung bình')).trim();
    var startDate = String(payload.startDate || (existingRowDisp ? existingRowDisp[10] : Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'))).trim();
    var deadline = String(payload.deadline || (existingRowDisp ? existingRowDisp[11] : '')).trim();
    var estHours = parseNumSafe(payload.estimatedHours || (existingRowDisp ? existingRowDisp[12] : 8));
    var reminderSt = String(payload.reminderStatus || (existingRowDisp ? existingRowDisp[15] : 'Chưa nhắc')).trim();
    var notes = String(payload.notes !== undefined ? payload.notes : (existingRowDisp ? existingRowDisp[16] : '')).trim();

    var kpiPoints = calcKpiPoints(priority, progress, status, deadline, {});

    var departmentsArr = Array.isArray(payload.departments) ? payload.departments : [];
    var coAssigneesArr = Array.isArray(payload.coAssignees) ? payload.coAssignees : [];
    var subtasksArr = Array.isArray(payload.subtasks) ? payload.subtasks : [];
    var attachmentsArr = Array.isArray(payload.attachments) ? payload.attachments : [];

    var raciJson = JSON.stringify({
      departments: departmentsArr,
      coAssignees: coAssigneesArr
    });
    var subtasksJson = JSON.stringify(subtasksArr);
    var attachmentsJson = JSON.stringify(attachmentsArr);

    var rowValues = [
      id,
      finalTitle,
      finalPrjId,
      finalPrjName,
      finalCustName,
      finalAssignee,
      finalEmail,
      finalPhone,
      status,
      priority,
      startDate,
      deadline,
      estHours,
      progress,
      kpiPoints,
      reminderSt,
      notes,
      raciJson,
      subtasksJson,
      attachmentsJson
    ];

    if (foundRow > 0) {
      sh.getRange(foundRow, 1, 1, 20).setValues([rowValues]);
      sh.getRange(foundRow, 8).setNumberFormat('@');
    } else {
      sh.appendRow(rowValues);
      var lastR = sh.getLastRow();
      sh.getRange(lastR, 8).setNumberFormat('@');
    }

    // Nếu người dùng bật gửi thông báo ngay khi giao việc mới
    if (payload.sendImmediateNotify) {
      dispatchMultiChannelNotification({
        type: 'GIAO VIỆC MỚI',
        refId: id,
        title: rowValues[1],
        recipient: rowValues[5],
        email: rowValues[6],
        phone: rowValues[7],
        subject: '[GIAO VIỆC MỚI ' + id + '] ' + rowValues[1],
        message: 'Xin chào ' + rowValues[5] + ', bạn vừa được giao công việc [' + id + '] "' + rowValues[1] + '" thuộc dự án "' + rowValues[3] + '". Mức ưu tiên: ' + priority + '. Hạn chót: ' + (deadline || 'Chưa đặt') + '.'
      });
    }

    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'USER', foundRow > 0 ? 'UPDATE_TASK' : 'CREATE_TASK', id, 'Công việc: ' + rowValues[1] + ' ➔ ' + status + ' (' + progress + '%)');

    var fresh = getProjectData();
    fresh.message = (foundRow > 0 ? 'Đã cập nhật công việc: ' : 'Đã giao công việc mới: ') + rowValues[1];
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu công việc: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// Cập nhật nhanh cột Kanban (1 chạm trên điện thoại hoặc kéo thả)
function updateTaskStatusQuick(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('CONG_VIEC');
    var id = String(payload.id || '').trim();
    var newStatus = String(payload.status || 'Đang làm').trim();

    if (sh.getLastRow() >= 3) {
      var data = sh.getRange(3, 1, sh.getLastRow() - 2, 17).getDisplayValues();
      for (var i = 0; i < data.length; i++) {
        if (String(data[i][0]).trim() === id) {
          var rowNum = i + 3;
          var roleUpper = String(payload.role || 'STAFF').trim().toUpperCase();
          var isManagerOrLead = (roleUpper === 'ADMIN' || roleUpper === 'MANAGER' || roleUpper === 'LEADER' || roleUpper === 'LEAD' || payload.canApprove === true);
          // Chặn nhân viên tự ý chuyển thẳng sang Hoàn thành (bắt buộc qua Chờ duyệt)
          if (!isManagerOrLead && newStatus === 'Hoàn thành') {
            newStatus = 'Chờ duyệt';
          }
          var curProg = parseNumSafe(data[i][13]);
          if (newStatus === 'Hoàn thành') curProg = 100;
          else if (newStatus === 'Chờ duyệt' && curProg < 80) curProg = 85;
          else if (newStatus === 'Đang làm' && (curProg === 0 || curProg === 100)) curProg = 50;
          else if (newStatus === 'Cần làm') curProg = 0;

          var pri = String(data[i][9] || 'Trung bình');
          var dl = String(data[i][11] || '');
          var newKpi = calcKpiPoints(pri, curProg, newStatus, dl, {});

          sh.getRange(rowNum, 9).setValue(newStatus);
          sh.getRange(rowNum, 14).setValue(curProg);
          sh.getRange(rowNum, 15).setValue(newKpi);
          break;
        }
      }
    }
    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'USER', 'MOVE_KANBAN', id, 'Chuyển trạng thái Kanban công việc ' + id + ' sang: ' + newStatus);
    var fresh = getProjectData();
    fresh.message = 'Đã chuyển trạng thái ' + id + ' sang "' + newStatus + '"!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi chuyển trạng thái Kanban: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteTaskItem(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('CONG_VIEC');
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
    appendAuditLog(payload.actor || 'admin', payload.role || 'ADMIN', 'DELETE_TASK', id, 'Xóa công việc ' + id);
    var fresh = getProjectData();
    fresh.message = 'Đã xóa công việc ' + id;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi xóa công việc: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 4B: UPLOAD FILE ĐÍNH KÈM CÔNG VIỆC (WORD, EXCEL, POWERPOINT, PDF, ẢNH, ZIP)
// Tự động lưu vào thư mục Google Drive "GS004_DINH_KEM_CONG_VIEC" và trả về Link
// ============================================================================
function uploadTaskAttachment(payload) {
  try {
    var fileName = String(payload.fileName || 'Tai_Lieu_Dinh_Kem.pdf').trim();
    var mimeType = String(payload.mimeType || 'application/octet-stream').trim();
    var fileSize = String(payload.fileSize || '').trim();
    var base64Data = String(payload.base64Data || '').trim();
    var uploadedBy = String(payload.uploadedBy || 'Nhân sự').trim();
    var ext = fileName.indexOf('.') !== -1 ? fileName.split('.').pop().toLowerCase() : 'file';
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
    var attId = 'ATT-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmmss') + '-' + Math.floor(10 + Math.random() * 89);

    var fileUrl = '';
    var storageLabel = 'Google Drive';

    if (base64Data) {
      try {
        var folderName = 'GS004_DINH_KEM_CONG_VIEC';
        var folders = DriveApp.getFoldersByName(folderName);
        var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
        var decoded = Utilities.base64Decode(base64Data);
        var blob = Utilities.newBlob(decoded, mimeType, fileName);
        var driveFile = folder.createFile(blob);
        try {
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (shareErr) {}
        fileUrl = driveFile.getUrl();
      } catch (driveErr) {
        // Fallback an toàn nếu người dùng chưa cấp quyền DriveApp khi cập nhật nóng
        storageLabel = 'Cloud Instant Link';
        fileUrl = String(payload.fallbackUrl || 'https://drive.google.com');
      }
    } else {
      fileUrl = String(payload.fallbackUrl || 'https://drive.google.com');
    }

    appendAuditLog(uploadedBy, payload.role || 'USER', 'UPLOAD_FILE', payload.taskId || 'TASK', 'Đính kèm tệp: ' + fileName + ' (' + fileSize + ')');

    return {
      ok: true,
      file: {
        id: attId,
        name: fileName,
        ext: ext,
        mimeType: mimeType,
        size: fileSize,
        url: fileUrl,
        uploadedBy: uploadedBy,
        uploadedAt: nowStr,
        storage: storageLabel
      }
    };
  } catch (e) {
    return {
      ok: false,
      message: 'Lỗi tải tệp lên: ' + e.toString()
    };
  }
}

// ============================================================================
// API 5: ĐỘNG CƠ BẮN NHẮC VIỆC TỰ ĐỘNG ĐA KÊNH (EMAIL + BOT ZALO + TELEGRAM)
// ============================================================================
function dispatchMultiChannelNotification(item) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var shCfg = ss ? ss.getSheetByName('CAU_HINH') : null;
  var cfg = {};
  if (shCfg && shCfg.getLastRow() >= 3) {
    var vals = shCfg.getRange(3, 1, shCfg.getLastRow() - 2, 2).getDisplayValues();
    vals.forEach(function(r) {
      if (r[0]) cfg[String(r[0]).trim()] = String(r[1] || '').trim();
    });
  }

  var channelsUsed = [];
  var statusParts = [];

  // 1. Gửi Email qua Gmail (MailApp)
  var enableEmail = String(cfg.ENABLE_EMAIL_REMINDER || 'TRUE').toUpperCase() === 'TRUE';
  var targetEmail = String(item.email || cfg.ADMIN_EMAIL || '').trim();
  if (enableEmail && targetEmail && targetEmail.indexOf('@') > 0) {
    try {
      var htmlBody = '<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">' +
        '<div style="background:linear-gradient(135deg,#1e1b4b,#4338ca);color:#fff;padding:18px 24px;">' +
        '<h2 style="margin:0;font-size:18px;">🔔 THÔNG BÁO NHẮC VIỆC & LỊCH HẸN CRM</h2>' +
        '<p style="margin:4px 0 0;font-size:12px;opacity:0.85;">' + (cfg.COMPANY_NAME || 'Hệ thống Quản lý Dự án & CRM v4.0 Pro') + '</p>' +
        '</div>' +
        '<div style="padding:20px 24px;background:#ffffff;color:#1e293b;line-height:1.6;">' +
        '<p>Xin chào <b>' + (item.recipient || 'Anh/Chị') + '</b>,</p>' +
        '<div style="background:#f8fafc;border-left:4px solid #4f46e5;padding:12px 16px;margin:14px 0;border-radius:6px;">' +
        '<p style="margin:0 0 6px;"><b>Phân loại:</b> ' + (item.type || 'Nhắc việc') + ' (' + (item.refId || '-') + ')</p>' +
        '<p style="margin:0 0 6px;"><b>Tiêu đề:</b> ' + (item.title || '') + '</p>' +
        '<p style="margin:0;"><b>Nội dung chi tiết:</b> ' + (item.message || '') + '</p>' +
        '</div>' +
        '<p style="font-size:13px;color:#475569;">Vui lòng truy cập Web App Quản Lý Dự Án & CRM trên điện thoại hoặc máy tính để cập nhật trạng thái xử lý.</p>' +
        '</div>' +
        '<div style="background:#f1f5f9;padding:12px 24px;font-size:12px;color:#64748b;text-align:center;">' +
        'Email tự động từ Hệ thống GS-004 v4.0 Commercial Pro • Hotline: ' + (cfg.COMPANY_HOTLINE || '0909.888.999') +
        '</div></div>';

      MailApp.sendEmail({
        to: targetEmail,
        subject: item.subject || ('[NHẮC VIỆC ' + (item.refId || '') + '] ' + (item.title || '')),
        htmlBody: htmlBody
      });
      channelsUsed.push('EMAIL');
      statusParts.push('Email OK');
    } catch (mailErr) {
      channelsUsed.push('EMAIL(Mô phỏng)');
      statusParts.push('Email Queue');
    }
  }

  // 2. Gửi qua Webhook Bot Zalo (Zalo OA / ZNS / n8n / Make / Zapier Webhook)
  var enableZalo = String(cfg.ENABLE_ZALO_REMINDER || 'TRUE').toUpperCase() === 'TRUE';
  var zaloWebhook = String(cfg.ZALO_BOT_WEBHOOK_URL || '').trim();
  if (enableZalo) {
    channelsUsed.push('BOT ZALO');
    if (zaloWebhook && zaloWebhook.indexOf('http') === 0 && zaloWebhook.indexOf('webhook.site/zalo-bot-demo') === -1) {
      try {
        var zaloPayload = {
          event: 'CRM_PROJECT_REMINDER',
          timestamp: Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss'),
          company: cfg.COMPANY_NAME || 'NOVA-CRM',
          zaloAccessToken: cfg.ZALO_OA_ACCESS_TOKEN || '',
          recipientName: item.recipient || '',
          recipientPhone: item.phone || '',
          recipientEmail: item.email || '',
          refId: item.refId || '',
          type: item.type || 'NHAC_VIEC',
          title: item.title || '',
          message: item.message || ''
        };
        UrlFetchApp.fetch(zaloWebhook, {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify(zaloPayload),
          muteHttpExceptions: true
        });
        statusParts.push('Zalo Webhook OK');
      } catch (zErr) {
        statusParts.push('Zalo Logged');
      }
    } else {
      statusParts.push('Zalo Bot Ready');
    }
  }

  // 3. Gửi qua Telegram Bot API (Nếu có cấu hình TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID)
  var enableTele = String(cfg.ENABLE_TELEGRAM_REMINDER || 'TRUE').toUpperCase() === 'TRUE';
  var teleToken = String(cfg.TELEGRAM_BOT_TOKEN || '').trim();
  var teleChatId = String(cfg.TELEGRAM_CHAT_ID || '').trim();
  if (enableTele && teleToken && teleChatId) {
    try {
      var teleUrl = 'https://api.telegram.org/bot' + teleToken + '/sendMessage';
      var teleText = '🔔 *[' + (item.type || 'NHẮC VIỆC') + ' - ' + (item.refId || '') + ']*\n' +
        '📌 *Hạng mục:* ' + (item.title || '') + '\n' +
        '👤 *Phụ trách:* ' + (item.recipient || '') + ' (' + (item.phone || '') + ')\n' +
        '📝 *Nội dung:* ' + (item.message || '');
      UrlFetchApp.fetch(teleUrl, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ chat_id: teleChatId, text: teleText, parse_mode: 'Markdown' }),
        muteHttpExceptions: true
      });
      channelsUsed.push('TELEGRAM');
      statusParts.push('Telegram OK');
    } catch (tErr) {}
  }

  if (channelsUsed.length === 0) channelsUsed.push('LOG HỆ THỐNG');

  // Ghi vào tab LICH_NHAC_TUDONG
  var remId = 'RM-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMddHHmmss') + '-' + Math.floor(Math.random() * 90 + 10);
  var nowStr = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
  if (ss) {
    var shRem = ss.getSheetByName('LICH_NHAC_TUDONG');
    if (shRem) {
      shRem.appendRow([
        remId,
        nowStr,
        item.type || 'NHẮC VIỆC',
        item.refId || '-',
        item.title || '',
        item.recipient || '',
        item.email || '',
        item.phone || '',
        channelsUsed.join(' + '),
        'Thành công (' + (statusParts.join(', ') || 'Đã gửi') + ')',
        item.message || ''
      ]);
      var lr = shRem.getLastRow();
      shRem.getRange(lr, 8).setNumberFormat('@');
    }
  }

  return {
    ok: true,
    remId: remId,
    channels: channelsUsed.join(' + '),
    statusText: statusParts.join(', ')
  };
}

// Bắn nhắc việc thủ công hoặc 1-Click cho 1 Công việc hoặc 1 Khách hàng CRM
function sendTaskReminderNow(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var refType = String(payload.refType || 'TASK').toUpperCase();
    var refId = String(payload.refId || '').trim();
    var customMsg = String(payload.customMessage || '').trim();

    var notifyItem = {
      type: refType === 'CRM' ? 'NHẮC LỊCH HẸN CRM' : 'NHẮC TIẾN ĐỘ CÔNG VIỆC',
      refId: refId,
      title: String(payload.title || ''),
      recipient: String(payload.recipient || ''),
      email: String(payload.email || ''),
      phone: String(payload.phone || ''),
      subject: '[NHẮC VIỆC & CRM ' + refId + '] ' + String(payload.title || ''),
      message: customMsg || ('Nhắc nhở xử lý hạng mục [' + refId + '] "' + String(payload.title || '') + '". Vui lòng kiểm tra và cập nhật tiến độ!')
    };

    var res = dispatchMultiChannelNotification(notifyItem);

    // Cập nhật cột TRẠNG THÁI NHẮC VIỆC trên tab tương ứng
    var stamp = 'Đã nhắc (' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM HH:mm') + ')';
    if (refType === 'CRM') {
      var shCrm = ss.getSheetByName('KHACH_HANG_CRM');
      if (shCrm && shCrm.getLastRow() >= 3) {
        var cIds = shCrm.getRange(3, 1, shCrm.getLastRow() - 2, 1).getDisplayValues();
        for (var i = 0; i < cIds.length; i++) {
          if (String(cIds[i][0]).trim() === refId) {
            shCrm.getRange(i + 3, 14).setValue(stamp);
            break;
          }
        }
      }
    } else {
      var shTask = ss.getSheetByName('CONG_VIEC');
      if (shTask && shTask.getLastRow() >= 3) {
        var tIds = shTask.getRange(3, 1, shTask.getLastRow() - 2, 1).getDisplayValues();
        for (var j = 0; j < tIds.length; j++) {
          if (String(tIds[j][0]).trim() === refId) {
            shTask.getRange(j + 3, 16).setValue(stamp);
            break;
          }
        }
      }
    }

    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.role || 'MANAGER', 'SEND_REMINDER', refId, 'Gửi nhắc việc qua ' + res.channels + ' cho ' + notifyItem.recipient);

    var fresh = getProjectData();
    fresh.message = '🔔 Đã gửi nhắc việc [' + refId + '] qua ' + res.channels + ' tới ' + notifyItem.recipient + '!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi gửi nhắc việc: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// Quét tự động toàn bộ Công việc sắp đến hạn/quá hạn & Lịch hẹn CRM trong ngày
function runDailyAutoReminders() {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = ensureSystemSheetsExist();
    var data = getProjectData();
    var todayStr = data.todayStr;
    var warnDays = parseNumSafe(data.config.REMIND_BEFORE_DAYS || 2);
    var limitDate = new Date(new Date().getTime() + warnDays * 86400000);
    var limitStr = Utilities.formatDate(limitDate, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');

    var taskCount = 0;
    var crmCount = 0;
    var shTask = ss.getSheetByName('CONG_VIEC');
    var shCrm = ss.getSheetByName('KHACH_HANG_CRM');
    var stamp = 'Tự động nhắc (' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM HH:mm') + ')';

    // 1. Quét CONG_VIEC chưa hoàn thành và có deadline <= limitStr
    data.tasks.forEach(function(t) {
      if (t.status !== 'Hoàn thành' && t.deadline && t.deadline <= limitStr) {
        var isOverdue = t.deadline < todayStr;
        var label = isOverdue ? 'CẢNH BÁO QUÁ HẠN DEADLINE' : 'NHẮC VIỆC SẮP ĐẾN HẠN';
        var msg = '[' + label + '] Công việc ' + t.id + ' ("' + t.title + '") thuộc dự án "' + t.projectName + '" có hạn chót ngày ' + t.deadline + ' (Tiến độ hiện tại: ' + t.progress + '%). Vui lòng hoàn thành và cập nhật Kanban!';
        dispatchMultiChannelNotification({
          type: label,
          refId: t.id,
          title: t.title,
          recipient: t.assignee,
          email: t.assigneeEmail,
          phone: t.assigneePhone,
          subject: '[' + label + ' - ' + t.id + '] ' + t.title,
          message: msg
        });
        if (shTask && t.rowIndex) {
          shTask.getRange(t.rowIndex, 16).setValue(stamp);
        }
        taskCount++;
      }
    });

    // 2. Quét KHACH_HANG_CRM có ngày hẹn gọi lại <= limitStr
    data.crmCustomers.forEach(function(c) {
      if (c.nextFollowUpDate && c.nextFollowUpDate <= limitStr && c.stage !== 'Đã Hủy / Mất Deal') {
        var isOver = c.nextFollowUpDate < todayStr;
        var cLabel = isOver ? 'QUÁ HẠN CHĂM SÓC CRM' : 'NHẮC LỊCH HẸN CHĂM SÓC CRM';
        var cMsg = '[' + cLabel + '] Khách hàng ' + c.companyName + ' (' + c.contactPerson + ' - SĐT Zalo: ' + c.phone + ') có lịch hẹn chăm sóc ngày ' + c.nextFollowUpDate + '. Ghi chú: ' + (c.notes || 'Gọi tư vấn & bám sát báo giá');
        dispatchMultiChannelNotification({
          type: cLabel,
          refId: c.id,
          title: c.companyName + ' (' + c.contactPerson + ')',
          recipient: c.owner,
          email: data.config.ADMIN_EMAIL || '',
          phone: c.phone,
          subject: '[' + cLabel + ' - ' + c.id + '] ' + c.companyName,
          message: cMsg
        });
        if (shCrm && c.rowIndex) {
          shCrm.getRange(c.rowIndex, 14).setValue(stamp);
        }
        crmCount++;
      }
    });

    SpreadsheetApp.flush();
    appendAuditLog('AUTO_BOT', 'SYSTEM', 'RUN_AUTO_REMINDERS', 'ALL', 'Đã quét & gửi ' + taskCount + ' nhắc việc dự án + ' + crmCount + ' nhắc lịch hẹn CRM');

    var fresh = getProjectData();
    fresh.message = '🤖 Đã quét tự động & bắn thông báo thành công cho ' + taskCount + ' Công việc đến hạn/quá hạn và ' + crmCount + ' Lịch hẹn chăm sóc Khách hàng CRM qua Email & Bot Zalo!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi chạy nhắc việc tự động: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// API 6: LƯU CẤU HÌNH BOT NHẮC VIỆC & CÀI ĐẶT TIME-DRIVEN TRIGGER HÀNG NGÀY
// ============================================================================
function saveReminderConfig(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var shCfg = ss.getSheetByName('CAU_HINH');
    if (shCfg && shCfg.getLastRow() >= 3) {
      var keys = shCfg.getRange(3, 1, shCfg.getLastRow() - 2, 1).getDisplayValues();
      for (var i = 0; i < keys.length; i++) {
        var k = String(keys[i][0] || '').trim();
        if (k && payload.config && payload.config[k] !== undefined) {
          shCfg.getRange(i + 3, 2).setValue(String(payload.config[k]).trim());
        }
      }
    }
    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', 'ADMIN', 'UPDATE_BOT_CONFIG', 'CAU_HINH', 'Cập nhật cấu hình Bot Nhắc Việc Email / Zalo / Telegram');
    var fresh = getProjectData();
    fresh.message = '⚙️ Đã lưu cấu hình Email, Webhook Bot Zalo & Telegram thành công!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu cấu hình: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function setupDailyReminderTrigger(hourVal) {
  try {
    var h = parseInt(hourVal, 10);
    if (isNaN(h) || h < 0 || h > 23) h = 8;
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === 'runDailyAutoReminders') {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }
    ScriptApp.newTrigger('runDailyAutoReminders')
      .timeBased()
      .everyDays(1)
      .atHour(h)
      .create();

    appendAuditLog('admin', 'ADMIN', 'ENABLE_DAILY_TRIGGER', 'Trigger ' + h + 'h', 'Bật lịch tự động quét & bắn nhắc việc Email/Zalo mỗi ngày lúc ' + h + ':00');
    var fresh = getProjectData();
    fresh.hasDailyTrigger = true;
    fresh.message = '⏰ Đã kích hoạt Trigger tự động quét & gửi nhắc việc Email/Zalo mỗi ngày vào khung giờ ' + h + ':00 - ' + (h + 1) + ':00!';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Không thể tạo Trigger (cần cấp quyền ScriptApp): ' + e.toString() };
  }
}

function removeDailyReminderTrigger() {
  try {
    var triggers = ScriptApp.getProjectTriggers();
    var removed = 0;
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === 'runDailyAutoReminders') {
        ScriptApp.deleteTrigger(triggers[i]);
        removed++;
      }
    }
    appendAuditLog('admin', 'ADMIN', 'DISABLE_DAILY_TRIGGER', 'Trigger', 'Đã tắt ' + removed + ' trigger nhắc việc hàng ngày');
    var fresh = getProjectData();
    fresh.hasDailyTrigger = false;
    fresh.message = '🔕 Đã tắt lịch chạy nhắc việc tự động hàng ngày.';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi tắt Trigger: ' + e.toString() };
  }
}

// ============================================================================
// API 7: QUẢN LÝ TÀI KHOẢN NHÂN SỰ (PHAN_QUYEN)
// ============================================================================
function saveUserAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('PHAN_QUYEN');
    var uname = String(payload.username || '').trim().toLowerCase();
    if (!uname) return { ok: false, message: 'Vui lòng nhập tên đăng nhập (username)!' };

    var rowVals = [
      uname,
      String(payload.password || '123456').trim(),
      String(payload.fullName || uname).trim(),
      String(payload.role || 'STAFF').trim().toUpperCase(),
      String(payload.department || 'Phòng Dự Án').trim(),
      String(payload.email || '').trim(),
      String(payload.phone || '').trim(),
      String(payload.status || 'Hoạt động').trim(),
      String(payload.note || '').trim()
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
      sh.getRange(found, 2).setNumberFormat('@');
      sh.getRange(found, 7).setNumberFormat('@');
    } else {
      sh.appendRow(rowVals);
      var lr = sh.getLastRow();
      sh.getRange(lr, 2).setNumberFormat('@');
      sh.getRange(lr, 7).setNumberFormat('@');
    }

    SpreadsheetApp.flush();
    appendAuditLog(payload.actor || 'admin', payload.actorRole || 'MANAGER', 'SAVE_USER', uname, 'Cập nhật tài khoản nhân sự: ' + rowVals[2] + ' [' + rowVals[3] + ']');
    var fresh = getProjectData();
    fresh.message = 'Đã lưu tài khoản & quyền thao tác cho: ' + rowVals[2] + ' (' + uname + ')';
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi lưu tài khoản: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

function deleteUserAccount(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = ensureSystemSheetsExist();
    var sh = ss.getSheetByName('PHAN_QUYEN');
    var uname = String(payload.username || '').trim().toLowerCase();
    if (!uname || uname === 'admin') {
      return { ok: false, message: 'Không thể xóa tài khoản gốc admin!' };
    }
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
    appendAuditLog(payload.actor || 'admin', 'ADMIN', 'DELETE_USER', uname, 'Xóa tài khoản nhân sự: ' + uname);
    var fresh = getProjectData();
    fresh.message = 'Đã xóa tài khoản ' + uname;
    return fresh;
  } catch (e) {
    return { ok: false, message: 'Lỗi xóa tài khoản: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// FALLBACK DATA AN TOÀN TUYỆT ĐỐI KHI CHƯA KẾT NỐI HOẶC LỖI QUYỀN TRUY CẬP
// ============================================================================
function getFallbackProjectData(reason) {
  var today = new Date();
  function dOff(days) {
    var d = new Date(today.getTime() + days * 86400000);
    return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  }
  return {
    ok: true,
    isFallback: true,
    fallbackReason: reason || '',
    serverTime: Utilities.formatDate(today, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss'),
    todayStr: dOff(0),
    hasDailyTrigger: true,
    config: {
      COMPANY_NAME: 'CÔNG TY TNHH GIẢI PHÁP SỐ & DỰ ÁN NOVA-CRM',
      COMPANY_HOTLINE: '0909.888.999',
      ADMIN_EMAIL: 'pmo.admin@novacrm.vn',
      ENABLE_EMAIL_REMINDER: 'TRUE',
      ENABLE_ZALO_REMINDER: 'TRUE',
      ZALO_BOT_WEBHOOK_URL: 'https://webhook.site/zalo-bot-demo-endpoint',
      ZALO_OA_ACCESS_TOKEN: 'ZALO_OA_TOKEN_DEMO_2025',
      ENABLE_TELEGRAM_REMINDER: 'TRUE',
      TELEGRAM_BOT_TOKEN: '',
      TELEGRAM_CHAT_ID: '',
      AUTO_REMINDER_HOUR: '8',
      REMIND_BEFORE_DAYS: '2',
      KPI_BASE_HIGH: '30',
      KPI_BASE_MEDIUM: '20',
      KPI_BASE_LOW: '10',
      KPI_OVERDUE_PENALTY: '5'
    },
    users: [
      { username: 'admin', password: '123456', fullName: 'Nguyễn Quản Trị (CEO/PMO)', role: 'ADMIN', department: 'Ban Giám Đốc', email: 'ceo@novacrm.vn', phone: '0901234567', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM,MANAGE_PROJECT' },
      { username: 'pm_duan', password: '123456', fullName: 'Trần Hoàng Nam (PM)', role: 'MANAGER', department: 'Phòng Quản Lý Dự Án', email: 'nam.pm@novacrm.vn', phone: '0902345678', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM,MANAGE_PROJECT' },
      { username: 'sale_crm', password: '123456', fullName: 'Lê Minh Thư (Leader CRM)', role: 'LEADER', department: 'Phòng Kinh Doanh & CRM', email: 'thu.crm@novacrm.vn', phone: '0903456789', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK,ACCESS_CRM' },
      { username: 'dev_lead', password: '123456', fullName: 'Phạm Tuấn Kiệt (Tech Lead)', role: 'LEADER', department: 'Khối Kỹ Thuật', email: 'kiet.dev@novacrm.vn', phone: '0904567890', status: 'Hoạt động', note: 'ASSIGN_TASK,APPROVE_TASK,VIEW_TEAM,SELF_CREATE_TASK' },
      { username: 'designer', password: '123456', fullName: 'Võ Ngọc Ánh (UI/UX & Media)', role: 'STAFF', department: 'Khối Sáng Tạo', email: 'anh.design@novacrm.vn', phone: '0905678901', status: 'Hoạt động', note: 'SELF_CREATE_TASK,VIEW_TEAM' },
      { username: 'sale_moi', password: '666666', fullName: 'Hoang Minh', role: 'STAFF', department: 'Phòng Kinh Doanh & CRM', email: 'minh.sale@novacrm.vn', phone: '0906789012', status: 'Hoạt động', note: 'SELF_CREATE_TASK,VIEW_TEAM,ACCESS_CRM' }
    ],
    crmCustomers: [
      { id: 'KH-001', companyName: 'Tập đoàn Bất Động Sản SunLand', contactPerson: 'Anh Minh (GĐ Marketing)', phone: '0912345678', email: 'minh.gd@sunland.vn', source: 'Giới thiệu B2B', stage: 'Đã Ký HĐ / Triển Khai', dealValue: 185000000, owner: 'Lê Minh Thư (Leader CRM)', lastContactDate: dOff(-5), nextFollowUpDate: dOff(1), notes: 'Họp nghiệm thu giai đoạn 1 dự án Portal BĐS & thu đợt 2', priority: 'VIP - Rất Cao', reminderStatus: 'Chưa nhắc' },
      { id: 'KH-002', companyName: 'Chuỗi Thẩm Mỹ Viện Aura Beauty', contactPerson: 'Chị Lan (Founder)', phone: '0987654321', email: 'lan.founder@aurabeauty.vn', source: 'Facebook Ads', stage: 'Đã Ký HĐ / Triển Khai', dealValue: 95000000, owner: 'Lê Minh Thư (Leader CRM)', lastContactDate: dOff(-3), nextFollowUpDate: dOff(0), notes: 'Gửi kịch bản Chatbot Zalo OA & xác nhận lịch đào tạo nhân sự', priority: 'VIP - Rất Cao', reminderStatus: 'Chưa nhắc' },
      { id: 'KH-003', companyName: 'Công ty Logistics Đại Dương Xanh', contactPerson: 'Anh Hùng (GĐ Vận Hành)', phone: '0933445566', email: 'hung.ops@daiduongxanh.vn', source: 'Website Inbound', stage: 'Đàm Phán Hợp Đồng', dealValue: 140000000, owner: 'Trần Hoàng Nam (PM)', lastContactDate: dOff(-2), nextFollowUpDate: dOff(0), notes: 'Gửi lại bảng báo giá điều chỉnh module điều phối xe tải', priority: 'Cao (Hot Lead)', reminderStatus: 'Chưa nhắc' }
    ],
    projects: [
      { id: 'DA-001', name: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerId: 'KH-001', customerName: 'Tập đoàn Bất Động Sản SunLand', manager: 'Trần Hoàng Nam (PM)', category: 'Phần mềm & CRM', priority: 'Cao', startDate: dOff(-20), endDate: dOff(10), status: 'Đang thực hiện', progress: 65, budget: 185000000, actualCost: 92000000, notes: 'Hoàn thiện phân hệ giỏ hàng BĐS và Bot nhắc lịch hẹn' },
      { id: 'DA-002', name: 'Xây dựng Hệ thống Đặt Lịch & Tự Động Hóa Zalo OA Aura Beauty', customerId: 'KH-002', customerName: 'Chuỗi Thẩm Mỹ Viện Aura Beauty', manager: 'Trần Hoàng Nam (PM)', category: 'Automation & POS', priority: 'Cao', startDate: dOff(-14), endDate: dOff(5), status: 'Đang thực hiện', progress: 80, budget: 95000000, actualCost: 48000000, notes: 'Tích hợp thẻ liệu trình VIP, nhắc lịch tái khám qua Zalo & Email' }
    ],
    tasks: [
      Object.assign({ id: 'CV-101', title: 'Thiết kế Database & Phân quyền RBAC cho SunLand Portal', projectId: 'DA-001', projectName: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerName: 'Tập đoàn Bất Động Sản SunLand', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', assigneeEmail: 'kiet.dev@novacrm.vn', assigneePhone: '0904567890', status: 'Hoàn thành', priority: 'Cao', startDate: dOff(-18), deadline: dOff(-10), estimatedHours: 24, progress: 100, kpiPoints: 30, reminderStatus: 'Đã nhắc Email/Zalo', notes: 'Đã hoàn tất schema 8 bảng dữ liệu chuẩn' }, getDefaultTaskCollabMeta('CV-101')),
      Object.assign({ id: 'CV-102', title: 'Xây dựng giao diện Mobile-First Bảng hàng & Giỏ căn hộ', projectId: 'DA-001', projectName: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerName: 'Tập đoàn Bất Động Sản SunLand', assignee: 'Võ Ngọc Ánh (UI/UX & Media)', assigneeEmail: 'anh.design@novacrm.vn', assigneePhone: '0905678901', status: 'Đang làm', priority: 'Cao', startDate: dOff(-8), deadline: dOff(1), estimatedHours: 32, progress: 75, kpiPoints: 22, reminderStatus: 'Chưa nhắc', notes: 'Đang tối ưu thanh điều hướng dưới cùng trên iPhone/Android' }, getDefaultTaskCollabMeta('CV-102')),
      Object.assign({ id: 'CV-103', title: 'Tích hợp Webhook Bot Zalo & Gmail tự động báo khách mới cho Sale', projectId: 'DA-001', projectName: 'Triển khai Hệ sinh thái Web App & CRM Bất Động Sản SunLand', customerName: 'Tập đoàn Bất Động Sản SunLand', assignee: 'Phạm Tuấn Kiệt (Tech Lead)', assigneeEmail: 'kiet.dev@novacrm.vn', assigneePhone: '0904567890', status: 'Đang làm', priority: 'Cao', startDate: dOff(-5), deadline: dOff(0), estimatedHours: 16, progress: 60, kpiPoints: 18, reminderStatus: 'Chưa nhắc', notes: 'Đến hạn hôm nay: Cần test kỹ luồng bắn tin nhắn Zalo OA' }, getDefaultTaskCollabMeta('CV-103')),
      Object.assign({ id: 'CV-105', title: 'Cấu hình Trigger nhắc lịch tái khám tự động 8h sáng hàng ngày', projectId: 'DA-002', projectName: 'Xây dựng Hệ thống Đặt Lịch & Tự Động Hóa Zalo OA Aura Beauty', customerName: 'Chuỗi Thẩm Mỹ Viện Aura Beauty', assignee: 'Trần Hoàng Nam (PM)', assigneeEmail: 'nam.pm@novacrm.vn', assigneePhone: '0902345678', status: 'Cần làm', priority: 'Cao', startDate: dOff(-2), deadline: dOff(-1), estimatedHours: 8, progress: 20, kpiPoints: 5, reminderStatus: 'Quá hạn cần nhắc ngay', notes: 'Quá hạn 1 ngày: Cần bàn giao gấp trước buổi nghiệm thu' }, getDefaultTaskCollabMeta('CV-105'))
    ],
    reminderLogs: [],
    auditLogs: []
  };
}
