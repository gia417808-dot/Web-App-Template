/**
 * ============================================================================
 * GS-004: WEBAPP QUẢN LÝ TIẾN ĐỘ DỰ ÁN & TASKS (V4.0)
 * BỘ CÀI ĐẶT TRANG TÍNH TỰ ĐỘNG (INSTALLER.GS)
 * Archetype: Project & Task Management
 * ============================================================================
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎯 QUẢN LÝ TIẾN ĐỘ DỰ ÁN & TASKS')
    .addItem('⚡ Khởi tạo / Làm mới dữ liệu chuẩn', 'install_PROJECT_SHEET')
    .addItem('🌐 Mở Web App Quản Trị Kanban', 'openProjectWebApp')
    .addToUi();
}

function openProjectWebApp() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800)
    .setTitle('Quản Lý Dự Án & Tasks v4.0');
  SpreadsheetApp.getUi().showModalDialog(html, 'Web App Quản Trị Dự Án & Tasks');
}

function install_PROJECT_SHEET() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabs = ['DASHBOARD', 'DU_AN', 'CONG_VIEC'];
  const sheets = {};

  tabs.forEach(function(tabName) {
    let sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    }
    sheets[tabName] = sheet;
  });

  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính 1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  // --------------------------------------------------------------------------
  // TAB 1: DASHBOARD
  // --------------------------------------------------------------------------
  const dash = sheets['DASHBOARD'];
  dash.clear();
  dash.setTabColor('#6366F1');
  dash.getRange('A1:H1').merge().setValue('TỔNG QUAN TIẾN ĐỘ DỰ ÁN & CÔNG VIỆC ĐỘI NHÓM')
    .setFontSize(16).setFontWeight('bold').setBackground('#6366F1').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dash.setRowHeight(1, 45);

  const dashHeaders = [
    ['Chỉ Số Tiến Độ', 'Giá Trị', 'Đơn Vị', 'Ghi Chú'],
    ['Tổng Số Dự Án Đang Chạy', '=COUNTA(DU_AN!A3:A)', 'Dự án', 'Dự án hoạt động'],
    ['Tổng Số Công Việc (Tasks)', '=COUNTA(CONG_VIEC!A3:A)', 'Nhiệm vụ', 'Toàn bộ backlog & task'],
    ['Công Việc Đang Thực Hiện', '=COUNTIF(CONG_VIEC!H3:H, "doing")', 'Nhiệm vụ', 'Đang xử lý'],
    ['Công Việc Chờ Nghiệm Thu / Test', '=COUNTIF(CONG_VIEC!H3:H, "review")', 'Nhiệm vụ', 'Đang review'],
    ['Công Việc Đã Hoàn Thành', '=COUNTIF(CONG_VIEC!H3:H, "done")', 'Nhiệm vụ', 'Đã nghiệm thu'],
    ['Tỷ Lệ Hoàn Thành Tổng Thể', '=IF(B5>0, ROUND(B8/B5, 2), 0)', '%', 'Tiến độ hoàn thành']
  ];
  dash.getRange('A3:D9').setValues(dashHeaders);
  dash.getRange('A3:D3').setFontWeight('bold').setBackground('#EEF2FF').setHorizontalAlignment('center');
  dash.getRange('A4:A9').setFontWeight('bold');
  dash.getRange('B4:B9').setHorizontalAlignment('right');
  dash.getRange('B9').setNumberFormat('0.0%');
  dash.setColumnWidth(1, 280);
  dash.setColumnWidth(2, 170);
  dash.setColumnWidth(3, 100);
  dash.setColumnWidth(4, 250);

  // --------------------------------------------------------------------------
  // TAB 2: DU_AN
  // --------------------------------------------------------------------------
  const da = sheets['DU_AN'];
  da.clear();
  da.setTabColor('#4F46E5');
  da.getRange('A1:I1').merge().setValue('DANH SÁCH DỰ ÁN TRỌNG ĐIỂM')
    .setFontSize(14).setFontWeight('bold').setBackground('#4F46E5').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  da.setRowHeight(1, 40);

  const daHeaders = [
    'Mã Dự Án', 'Tên Dự Án', 'Quản Trị Viên', 'Ngày Bắt Đầu', 'Deadline',
    'Ngân Sách', 'Tiến Độ %', 'Trạng Thái', 'Ghi Chú'
  ];
  da.getRange(2, 1, 1, daHeaders.length).setValues([daHeaders])
    .setFontWeight('bold').setBackground('#E0E7FF').setHorizontalAlignment('center')
    .setFontColor('#3730A3');
  da.setFrozenRows(2);

  const daSampleData = [
    ['PRJ-01', 'Hệ Thống ERP Doanh Nghiệp Nhỏ', 'Lê Hoàng Nam', '2026-07-01', '2026-10-30', 120000000, 0.75, 'active', 'Triển khai giai đoạn 2'],
    ['PRJ-02', 'Nâng Cấp Web App Storefront Netlify', 'Phạm Minh Đức', '2026-08-01', '2026-09-15', 35000000, 0.90, 'active', 'Tối ưu UI mobile & checkout'],
    ['PRJ-03', 'Tích Hợp Cổng VietQR Tự Động', 'Trần Đình Trọng', '2026-07-15', '2026-08-20', 25000000, 1.00, 'completed', 'Nghiệm thu thành công webhook']
  ];
  da.getRange(3, 1, daSampleData.length, daHeaders.length).setValues(daSampleData);
  da.getRange('F3:F' + (daSampleData.length + 2)).setNumberFormat('#,##0 "₫"');
  da.getRange('G3:G' + (daSampleData.length + 2)).setNumberFormat('0.0%');

  da.setColumnWidth(1, 110);
  da.setColumnWidth(2, 280);
  da.setColumnWidth(3, 180);
  da.setColumnWidth(4, 120);
  da.setColumnWidth(5, 120);
  da.setColumnWidth(6, 140);
  da.setColumnWidth(7, 100);
  da.setColumnWidth(8, 120);
  da.setColumnWidth(9, 260);

  // --------------------------------------------------------------------------
  // TAB 3: CONG_VIEC
  // --------------------------------------------------------------------------
  const cv = sheets['CONG_VIEC'];
  cv.clear();
  cv.setTabColor('#EC4899');
  cv.getRange('A1:J1').merge().setValue('SỔ NHẬT KÝ NHIỆM VỤ & TASKS (KANBAN / SPRINT)')
    .setFontSize(14).setFontWeight('bold').setBackground('#EC4899').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  cv.setRowHeight(1, 40);

  const cvHeaders = [
    'Mã Task', 'Tiêu Đề Nhiệm Vụ', 'Mã Dự Án', 'Phân Loại', 'Người Phụ Trách',
    'Mức Ưu Tiên', 'Hạn Chót', 'Trạng Thái', 'Tiến Độ Subtask', 'Mô Tả Chi Tiết'
  ];
  cv.getRange(2, 1, 1, cvHeaders.length).setValues([cvHeaders])
    .setFontWeight('bold').setBackground('#FCE7F3').setHorizontalAlignment('center')
    .setFontColor('#9D174D');
  cv.setFrozenRows(2);

  const cvSampleData = [
    ['TSK-101', 'Thiết kế Mockup UI Kho Vận và Bảng Nhập Xuất', 'PRJ-01', 'UI/UX Design', 'Nguyễn Thị Mai', 'Cao', '2026-08-10', 'done', '3/3 hoàn thành', 'Wireframe Figma hoàn tất và đã được phê duyệt'],
    ['TSK-102', 'Viết Apps Script API Controller kết nối Sheet', 'PRJ-01', 'Backend Script', 'Lê Hoàng Nam', 'Khẩn cấp', '2026-08-12', 'doing', '2/3 hoàn thành', 'Hoàn tất hàm getWarehouseData, đang code submitInventoryTx'],
    ['TSK-103', 'Kiểm thử tải đồng thời và đồng bộ Locale', 'PRJ-01', 'QA & Testing', 'Trần Đình Trọng', 'Cao', '2026-08-14', 'review', '1/2 hoàn thành', 'Chạy kịch bản 50 users nhập liệu song song'],
    ['TSK-104', 'Tối ưu Bundle Web App React Vite', 'PRJ-02', 'Frontend Core', 'Phạm Minh Đức', 'Trung bình', '2026-08-15', 'doing', '1/2 hoàn thành', 'Tách vendor chunk để load dưới 1.2s'],
    ['TSK-105', 'Soạn thảo Runbook và tài liệu bàn giao', 'PRJ-01', 'Tài liệu kỹ thuật', 'Lê Hoàng Nam', 'Thấp', '2026-08-20', 'backlog', '0/1 hoàn thành', 'Tạo file hướng dẫn cài đặt và sử dụng']
  ];
  cv.getRange(3, 1, cvSampleData.length, cvHeaders.length).setValues(cvSampleData);

  cv.setColumnWidth(1, 110);
  cv.setColumnWidth(2, 300);
  cv.setColumnWidth(3, 110);
  cv.setColumnWidth(4, 140);
  cv.setColumnWidth(5, 180);
  cv.setColumnWidth(6, 120);
  cv.setColumnWidth(7, 120);
  cv.setColumnWidth(8, 120);
  cv.setColumnWidth(9, 140);
  cv.setColumnWidth(10, 320);

  SpreadsheetApp.getActiveSpreadsheet().toast('Khởi tạo trang tính Quản lý Dự Án & Tasks thành công!', 'Hoàn tất', 5);
}

