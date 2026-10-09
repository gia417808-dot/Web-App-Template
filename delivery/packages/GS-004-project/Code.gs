/**
 * ============================================================================
 * GS-004: WEBAPP QUẢN LÝ TIẾN ĐỘ DỰ ÁN & TASKS (V4.0)
 * BACKEND CONTROLLER & APPS SCRIPT API (CODE.GS)
 * Archetype: Project & Task Management
 * ============================================================================
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Quản Lý Dự Án & Tasks v4.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎯 QUẢN LÝ TIẾN ĐỘ DỰ ÁN & TASKS')
    .addItem('⚡ Khởi tạo cấu trúc Trang tính', 'install_PROJECT_SHEET')
    .addItem('🌐 Mở Web App Quản Trị Kanban', 'openProjectDialog')
    .addToUi();
}

function openProjectDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800)
    .setTitle('Quản Lý Dự Án & Tasks v4.0');
  SpreadsheetApp.getUi().showModalDialog(html, 'Web App Quản Trị Dự Án & Tasks');
}

/**
 * Lấy danh sách dự án và nhiệm vụ công việc
 * Sử dụng getDisplayValues() để bảo đảm định dạng text/ngày tháng an toàn.
 */
function getProjectData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const daSheet = ss.getSheetByName('DU_AN');
  const cvSheet = ss.getSheetByName('CONG_VIEC');

  if (!daSheet || !cvSheet) {
    return getFallbackProjectData();
  }

  // Đọc danh mục dự án
  const daValues = daSheet.getDataRange().getDisplayValues();
  const projects = [];
  if (daValues.length > 2) {
    for (let i = 2; i < daValues.length; i++) {
      const row = daValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      projects.push({
        id: row[0],
        name: row[1],
        manager: row[2],
        startDate: row[3],
        endDate: row[4],
        budget: parseCurrency(row[5]),
        progress: row[6],
        status: row[7] || 'active',
        notes: row[8] || ''
      });
    }
  }

  // Đọc danh sách nhiệm vụ
  const cvValues = cvSheet.getDataRange().getDisplayValues();
  const tasks = [];
  if (cvValues.length > 2) {
    for (let i = 2; i < cvValues.length; i++) {
      const row = cvValues[i];
      if (!row[0] || row[0].trim() === '') continue;
      tasks.push({
        id: row[0],
        title: row[1],
        projectId: row[2],
        category: row[3],
        assignee: row[4],
        priority: row[5] || 'Trung bình',
        dueDate: row[6],
        status: row[7] || 'backlog',
        subtasks: row[8] || '0/1',
        description: row[9] || ''
      });
    }
  }

  // Tính toán KPI
  const totalTasks = tasks.length;
  const doing = tasks.filter(t => t.status === 'doing').length;
  const review = tasks.filter(t => t.status === 'review').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const backlog = tasks.filter(t => t.status === 'backlog').length;
  const completionRate = totalTasks > 0 ? Math.round((done / totalTasks) * 100) : 0;

  return {
    success: true,
    projects: projects,
    tasks: tasks,
    kpi: {
      totalProjects: projects.length,
      totalTasks: totalTasks,
      doing: doing,
      review: review,
      done: done,
      backlog: backlog,
      completionRate: completionRate
    }
  };
}

/**
 * Tạo mới một nhiệm vụ (Task)
 */
function submitNewTask(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const cvSheet = ss.getSheetByName('CONG_VIEC');

    if (!cvSheet) {
      return { success: false, message: 'Chưa khởi tạo Trang tính! Vui lòng chạy installer.' };
    }

    const taskId = data.id || ('TSK-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'MMdd-HHmm'));

    cvSheet.appendRow([
      taskId,
      data.title,
      data.projectId || 'PRJ-01',
      data.category || 'Công việc chung',
      data.assignee || 'Chưa phân công',
      data.priority || 'Trung bình',
      data.dueDate || '',
      data.status || 'backlog',
      '0/1 hoàn thành',
      data.description || ''
    ]);

    return {
      success: true,
      message: 'Tạo công việc ' + taskId + ' thành công!',
      taskId: taskId
    };
  } catch (err) {
    return {
      success: false,
      message: 'Lỗi ghi task: ' + err.toString()
    };
  }
}

function parseCurrency(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  const clean = str.replace(/[^\d.-]/g, '');
  return parseFloat(clean) || 0;
}

function getFallbackProjectData() {
  return {
    success: true,
    isFallback: true,
    projects: [
      { id: 'PRJ-01', name: 'Hệ Thống ERP Doanh Nghiệp Nhỏ', manager: 'Lê Hoàng Nam', startDate: '2026-07-01', endDate: '2026-10-30', budget: 120000000, progress: '75%', status: 'active', notes: 'Triển khai giai đoạn 2' },
      { id: 'PRJ-02', name: 'Nâng Cấp Web App Storefront Netlify', manager: 'Phạm Minh Đức', startDate: '2026-08-01', endDate: '2026-09-15', budget: 35000000, progress: '90%', status: 'active', notes: 'Tối ưu UI mobile & checkout' },
      { id: 'PRJ-03', name: 'Tích Hợp Cổng VietQR Tự Động', manager: 'Trần Đình Trọng', startDate: '2026-07-15', endDate: '2026-08-20', budget: 25000000, progress: '100%', status: 'completed', notes: 'Nghiệm thu thành công webhook' }
    ],
    tasks: [
      { id: 'TSK-101', title: 'Thiết kế Mockup UI Kho Vận và Bảng Nhập Xuất', projectId: 'PRJ-01', category: 'UI/UX Design', assignee: 'Nguyễn Thị Mai', priority: 'Cao', dueDate: '2026-08-10', status: 'done', subtasks: '3/3 hoàn thành', description: 'Wireframe Figma hoàn tất và đã được phê duyệt' },
      { id: 'TSK-102', title: 'Viết Apps Script API Controller kết nối Sheet', projectId: 'PRJ-01', category: 'Backend Script', assignee: 'Lê Hoàng Nam', priority: 'Khẩn cấp', dueDate: '2026-08-12', status: 'doing', subtasks: '2/3 hoàn thành', description: 'Hoàn tất hàm getWarehouseData, đang code submitInventoryTx' },
      { id: 'TSK-103', title: 'Kiểm thử tải đồng thời và đồng bộ Locale', projectId: 'PRJ-01', category: 'QA & Testing', assignee: 'Trần Đình Trọng', priority: 'Cao', dueDate: '2026-08-14', status: 'review', subtasks: '1/2 hoàn thành', description: 'Chạy kịch bản 50 users nhập liệu song song' },
      { id: 'TSK-104', title: 'Tối ưu Bundle Web App React Vite', projectId: 'PRJ-02', category: 'Frontend Core', assignee: 'Phạm Minh Đức', priority: 'Trung bình', dueDate: '2026-08-15', status: 'doing', subtasks: '1/2 hoàn thành', description: 'Tách vendor chunk để load dưới 1.2s' },
      { id: 'TSK-105', title: 'Soạn thảo Runbook và tài liệu bàn giao', projectId: 'PRJ-01', category: 'Tài liệu kỹ thuật', assignee: 'Lê Hoàng Nam', priority: 'Thấp', dueDate: '2026-08-20', status: 'backlog', subtasks: '0/1 hoàn thành', description: 'Tạo file hướng dẫn cài đặt và sử dụng' }
    ],
    kpi: {
      totalProjects: 3,
      totalTasks: 5,
      doing: 2,
      review: 1,
      done: 1,
      backlog: 1,
      completionRate: 20
    }
  };
}

