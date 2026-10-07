import React, { useState, useMemo } from 'react';

export type VersionId = 'v1.0' | 'v2.0' | 'v3.0' | 'v4.0' | 'v5.0';

export interface ColumnDef {
  key: string;
  label: string;
  letter: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  badgeStyle?: boolean;
}

export interface TaskRecord {
  [key: string]: any;
}

export interface VersionBlueprint {
  id: VersionId;
  versionName: string;
  badge: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  orderCode: string;
  releaseDate: string;
  sheetFormula: {
    cell: string;
    formula: string;
    explanation: string;
  };
  changelog: string[];
  systemHighlights: { label: string; desc: string; icon: string }[];
  features: {
    hasKanban: boolean;
    hasCalendar: boolean;
    hasChat: boolean;
    hasAnalytics: boolean;
    hasMultiApproval: boolean;
    hasCustomExport: boolean;
  };
  kpis: {
    label: string;
    value: string;
    subtext: string;
    color: string;
    icon: string;
  }[];
  columns: ColumnDef[];
  sampleRows: TaskRecord[];
}

// ============================================================================
// DỮ LIỆU ĐỘC BẢN 5 PHIÊN BẢN CHUẨN MỰC (MASTER BLUEPRINT)
// ============================================================================
export const MASTER_VERSIONS: Record<VersionId, VersionBlueprint> = {
  'v1.0': {
    id: 'v1.0',
    versionName: 'Version 1.0',
    badge: 'Cơ Bản Gọn Nhẹ',
    title: 'Hệ Thống Quản Lý Công Việc Cá Nhân & Nhóm Nhỏ (v1.0)',
    subtitle: 'Bảng theo dõi tiến độ công việc chuẩn gsheets.vn, chống quên việc, giao việc trực quan.',
    price: 390000,
    originalPrice: 590000,
    orderCode: 'MUA_GS_TASK_V10',
    releaseDate: '15/01/2026',
    sheetFormula: {
      cell: 'F2',
      formula: '=COUNTIF(E2:E11, "✓ Hoàn thành") / COUNTA(E2:E11)',
      explanation: 'Tỷ lệ hoàn thành tổng thể = Số đầu việc đã tích Hoàn thành / Tổng số việc giao.',
    },
    changelog: [
      'Ghi chép và theo dõi toàn bộ đầu việc hàng ngày trên 1 trang duy nhất, không lo sót việc.',
      'Phân loại nhanh trạng thái: Chờ thực hiện, Đang xử lý, Hoàn thành.',
      'Bộ lọc nhanh theo người phụ trách và hạn hoàn thành trong tuần.',
      'Tự động định dạng màu sắc (Conditional Formatting) khi công việc quá hạn.',
      'Phù hợp cá nhân, freelancer hoặc nhóm làm việc nhỏ 3-5 nhân sự.',
    ],
    systemHighlights: [
      { label: 'Nhập liệu nhanh', desc: 'Giao diện bảng phẳng, nhập và phân loại việc trong 5 giây.', icon: '⚡' },
      { label: 'Cảnh báo hạn chót', desc: 'Đổi màu đỏ khi công việc đến hạn hoặc bị trễ deadline.', icon: '⏰' },
      { label: 'Tương thích 100%', desc: 'Mở được trên Google Sheets web, mobile app Android / iOS.', icon: '📱' },
    ],
    features: {
      hasKanban: false,
      hasCalendar: false,
      hasChat: false,
      hasAnalytics: false,
      hasMultiApproval: false,
      hasCustomExport: false,
    },
    kpis: [
      { label: 'Tổng số đầu việc', value: '10 Việc', subtext: 'Trong danh sách theo dõi', color: '#0284c7', icon: '📋' },
      { label: 'Đã hoàn thành', value: '6 Việc', subtext: 'Tỷ lệ đạt 60.0%', color: '#16a34a', icon: '✅' },
      { label: 'Đang thực hiện', value: '3 Việc', subtext: 'Đang triển khai', color: '#d97706', icon: '⚡' },
      { label: 'Chờ xử lý', value: '1 Việc', subtext: 'Sắp đến hạn trong tuần', color: '#64748b', icon: '⏳' },
    ],
    columns: [
      { letter: 'A', key: 'code', label: 'Mã Việc', width: '90px', align: 'center' },
      { letter: 'B', key: 'title', label: 'Tên Công Việc / Nhiệm Vụ', width: '260px' },
      { letter: 'C', key: 'assignee', label: 'Người Thực Hiện', width: '150px' },
      { letter: 'D', key: 'due_date', label: 'Hạn Chót', width: '100px', align: 'center' },
      { letter: 'E', key: 'status', label: 'Trạng Thái', width: '130px', align: 'center', badgeStyle: true },
      { letter: 'F', key: 'notes', label: 'Ghi Chú', width: '180px' },
    ],
    sampleRows: [
      { code: 'TSK-01', title: 'Khảo sát nhu cầu khách hàng đợt 1', assignee: 'Nguyễn Văn Tuấn', due_date: '02/08/2026', status: '✓ Hoàn thành', notes: 'Đã gửi khảo sát cho 40 khách' },
      { code: 'TSK-02', title: 'Tổng hợp tài liệu yêu cầu nghiệp vụ', assignee: 'Trần Thu Hà', due_date: '04/08/2026', status: '✓ Hoàn thành', notes: 'Hoàn thành file đặc tả' },
      { code: 'TSK-03', title: 'Thiết kế bố cục giao diện bảng tính', assignee: 'Lê Hoàng Nam', due_date: '06/08/2026', status: '✓ Hoàn thành', notes: 'Giao diện tối giản 1 sheet' },
      { code: 'TSK-04', title: 'Thiết lập công thức đếm trạng thái tự động', assignee: 'Lê Hoàng Nam', due_date: '08/08/2026', status: '✓ Hoàn thành', notes: 'Hàm COUNTIF chuẩn' },
      { code: 'TSK-05', title: 'Tạo danh mục dropdown chọn người làm', assignee: 'Trần Thu Hà', due_date: '09/08/2026', status: '✓ Hoàn thành', notes: 'Data Validation list' },
      { code: 'TSK-06', title: 'Kiểm tra công thức trên điện thoại di động', assignee: 'Nguyễn Văn Tuấn', due_date: '10/08/2026', status: '✓ Hoàn thành', notes: 'Hiển thị tốt trên iOS/Android' },
      { code: 'TSK-07', title: 'Cập nhật danh sách công việc tuần mới', assignee: 'Phạm Minh Đức', due_date: '12/08/2026', status: '⚡ Đang làm', notes: 'Đang phân bổ nhân sự' },
      { code: 'TSK-08', title: 'Đánh giá tiến độ công việc giữa tháng', assignee: 'Nguyễn Văn Tuấn', due_date: '15/08/2026', status: '⚡ Đang làm', notes: 'Họp ngắn 15 phút' },
      { code: 'TSK-09', title: 'Sao lưu dữ liệu Google Drive hàng tuần', assignee: 'Phạm Minh Đức', due_date: '16/08/2026', status: '⚡ Đang làm', notes: 'Lưu bản backup .xlsx' },
      { code: 'TSK-10', title: 'Soạn hướng dẫn sử dụng nhanh cho nhân viên mới', assignee: 'Trần Thu Hà', due_date: '18/08/2026', status: '⏳ Chờ xử lý', notes: 'File PDF 2 trang' },
    ],
  },

  'v2.0': {
    id: 'v2.0',
    versionName: 'Version 2.0',
    badge: 'KPI & Checklist',
    title: 'Hệ Thống Quản Lý Công Việc & Đánh Giá KPI Nhóm (v2.0)',
    subtitle: 'Bổ sung Checklist chia nhỏ việc con, chấm điểm trọng số KPI và phân quyền giao việc cho quản lý.',
    price: 450000,
    originalPrice: 690000,
    orderCode: 'MUA_GS_TASK_V20',
    releaseDate: '28/02/2026',
    sheetFormula: {
      cell: 'H2',
      formula: '=SUMPRODUCT(E2:E11, IF(G2:G11="✓ Hoàn thành", 1, 0))',
      explanation: 'Điểm KPI thực đạt = Tổng (Trọng số KPI * Tỷ lệ hoàn thành của từng nhiệm vụ).',
    },
    changelog: [
      'Bổ sung Checklist việc con (Subtasks) giúp chia nhỏ mục tiêu, không bị ngợp việc.',
      'Tích hợp Cột Trọng Số KPI (%) để đánh giá đúng mức độ quan trọng của từng đầu việc.',
      'Phân quyền rõ vai trò: Người giao việc (Assigner) và Người chịu trách nhiệm chính (PIC).',
      'Đánh giá hiệu suất nhân sự tự động: Đạt chỉ tiêu KPI, Vượt kỳ vọng, hoặc Cần cải thiện.',
      'Bảng tổng hợp điểm KPI tự động cho từng thành viên trong nhóm cuối tháng.',
    ],
    systemHighlights: [
      { label: 'Checklist việc con', desc: 'Theo dõi tiến độ chi tiết từng bước 25% - 50% - 100%.', icon: '☑️' },
      { label: 'Đo lường KPI', desc: 'Gắn trọng số phần trăm, tự động tính điểm KPI minh bạch.', icon: '🎯' },
      { label: 'Phân quyền trách nhiệm', desc: 'Rõ ràng giữa Trưởng phòng giao và Chuyên viên thực hiện.', icon: '👥' },
    ],
    features: {
      hasKanban: false,
      hasCalendar: false,
      hasChat: false,
      hasAnalytics: false,
      hasMultiApproval: false,
      hasCustomExport: false,
    },
    kpis: [
      { label: 'Tổng điểm KPI mục tiêu', value: '100%', subtext: 'Trọng số phân bổ đều', color: '#0284c7', icon: '📊' },
      { label: 'KPI Đã Đạt Được', value: '72.5%', subtext: '7/10 việc hoàn tất KPI', color: '#16a34a', icon: '🏆' },
      { label: 'Checklist hoàn tất', value: '31 / 38 Mục', subtext: 'Tỷ lệ bước con: 81.5%', color: '#7c3aed', icon: '☑️' },
      { label: 'Nhân sự đạt chuẩn', value: '4 / 4 Thành viên', subtext: '100% nhân sự có KPI', color: '#d97706', icon: '🎖️' },
    ],
    columns: [
      { letter: 'A', key: 'code', label: 'Mã Việc', width: '90px', align: 'center' },
      { letter: 'B', key: 'title', label: 'Tên Công Việc', width: '220px' },
      { letter: 'C', key: 'assignee_role', label: 'Người Thực Hiện (Vai Trò)', width: '180px' },
      { letter: 'D', key: 'subtasks_progress', label: 'Checklist Việc Con', width: '130px', align: 'center' },
      { letter: 'E', key: 'kpi_weight', label: 'Trọng Số KPI', width: '110px', align: 'center' },
      { letter: 'F', key: 'due_date', label: 'Hạn Chót', width: '100px', align: 'center' },
      { letter: 'G', key: 'status', label: 'Trạng Thái', width: '130px', align: 'center', badgeStyle: true },
      { letter: 'H', key: 'kpi_eval', label: 'Đánh Giá KPI', width: '130px', align: 'center', badgeStyle: true },
    ],
    sampleRows: [
      { code: 'TSK-01', title: 'Xây dựng kế hoạch nội dung tháng 8', assignee_role: 'Nguyễn Văn Tuấn (Leader)', subtasks_progress: '4/4 xong (100%)', kpi_weight: '15%', due_date: '02/08/2026', status: '✓ Hoàn thành', kpi_eval: '✓ Đạt chỉ tiêu' },
      { code: 'TSK-02', title: 'Thiết kế bộ ấn phẩm nhận diện số', assignee_role: 'Trần Thu Hà (Designer)', subtasks_progress: '5/5 xong (100%)', kpi_weight: '10%', due_date: '05/08/2026', status: '✓ Hoàn thành', kpi_eval: '✓ Đạt chỉ tiêu' },
      { code: 'TSK-03', title: 'Tối ưu tốc độ tải trang sản phẩm', assignee_role: 'Lê Hoàng Nam (Developer)', subtasks_progress: '3/3 xong (100%)', kpi_weight: '15%', due_date: '07/08/2026', status: '✓ Hoàn thành', kpi_eval: '🌟 Vượt kỳ vọng' },
      { code: 'TSK-04', title: 'Tích hợp cổng thanh toán VietQR', assignee_role: 'Lê Hoàng Nam (Developer)', subtasks_progress: '4/4 xong (100%)', kpi_weight: '15%', due_date: '09/08/2026', status: '✓ Hoàn thành', kpi_eval: '✓ Đạt chỉ tiêu' },
      { code: 'TSK-05', title: 'Soạn kịch bản kĩ thuật cho đội CSKH', assignee_role: 'Hoàng Kim Yến (QA/QC)', subtasks_progress: '3/3 xong (100%)', kpi_weight: '10%', due_date: '10/08/2026', status: '✓ Hoàn thành', kpi_eval: '✓ Đạt chỉ tiêu' },
      { code: 'TSK-06', title: 'Chạy chiến dịch quảng cáo Lead Form', assignee_role: 'Phạm Minh Đức (Marketer)', subtasks_progress: '2/4 xong (50%)', kpi_weight: '10%', due_date: '12/08/2026', status: '⚡ Đang làm', kpi_eval: '⏳ Đang theo dõi' },
      { code: 'TSK-07', title: 'Viết tài liệu hướng dẫn bàn giao hệ thống', assignee_role: 'Trần Thu Hà (Content)', subtasks_progress: '3/4 xong (75%)', kpi_weight: '5%', due_date: '14/08/2026', status: '⚡ Đang làm', kpi_eval: '⏳ Đang theo dõi' },
      { code: 'TSK-08', title: 'Kiểm thử toàn diện luồng tải file Sheet', assignee_role: 'Hoàng Kim Yến (QA/QC)', subtasks_progress: '4/5 xong (80%)', kpi_weight: '10%', due_date: '16/08/2026', status: '⚡ Đang làm', kpi_eval: '⏳ Đang theo dõi' },
      { code: 'TSK-09', title: 'Khảo sát độ hài lòng của 30 khách mua', assignee_role: 'Phạm Minh Đức (Marketer)', subtasks_progress: '2/4 xong (50%)', kpi_weight: '5%', due_date: '18/08/2026', status: '⚡ Đang làm', kpi_eval: '⏳ Đang theo dõi' },
      { code: 'TSK-10', title: 'Lập báo cáo tổng kết doanh số tháng', assignee_role: 'Nguyễn Văn Tuấn (Leader)', subtasks_progress: '1/3 xong (33%)', kpi_weight: '5%', due_date: '20/08/2026', status: '⏳ Chờ xử lý', kpi_eval: '⚠️ Cần đẩy nhanh' },
    ],
  },

  'v3.0': {
    id: 'v3.0',
    versionName: 'Version 3.0',
    badge: 'Kanban & Timeline',
    title: 'Hệ Thống Quản Lý Dự Án Kanban & Lịch Biểu Tiến Độ (v3.0)',
    subtitle: 'Trực quan hóa toàn bộ dòng chảy công việc với Bảng Kanban 4 cột và Lịch biểu tiến độ (Calendar / Gantt).',
    price: 568000,
    originalPrice: 850000,
    orderCode: 'MUA_GS_TASK_V30',
    releaseDate: '15/04/2026',
    sheetFormula: {
      cell: 'I2',
      formula: '=COUNTIFS(E2:E11, "Done", H2:H11, "Khẩn cấp")',
      explanation: 'Đếm số lượng công việc Khẩn cấp đã hoàn thành đúng hạn trên bảng Kanban.',
    },
    changelog: [
      'Bổ sung chế độ xem Bảng Kanban trực quan 4 cột: Chờ làm (Backlog) -> Đang làm (Doing) -> Kiểm thử (Review) -> Hoàn thành (Done).',
      'Bổ sung Lịch biểu tiến độ (Calendar / Timeline) kiểm soát chồng chéo công việc giữa các phòng ban.',
      'Phân loại theo Phân hệ / Module (Frontend, Backend, Design, Marketing, QA/QC).',
      'Định mức Độ ưu tiên 4 cấp: Khẩn cấp (P1), Cao (P2), Trung bình (P3), Thấp (P4).',
      'Thanh đo tiến độ phần trăm (%) tự động thay đổi màu sắc theo tiến độ thực tế.',
    ],
    systemHighlights: [
      { label: 'Kanban Board tương tác', desc: 'Xem trực quan 4 trạng thái, kéo thả/chuyển trạng thái tức thì.', icon: '📌' },
      { label: 'Lịch biểu Timeline', desc: 'Xếp lịch theo ngày bắt đầu và kết thúc, tránh quá tải nguồn lực.', icon: '📅' },
      { label: 'Phân hệ đa bộ phận', desc: 'Gắn thẻ Module rõ ràng giữa Dev, Design, MKT, Vận hành.', icon: '🏷️' },
    ],
    features: {
      hasKanban: true,
      hasCalendar: true,
      hasChat: false,
      hasAnalytics: false,
      hasMultiApproval: false,
      hasCustomExport: false,
    },
    kpis: [
      { label: 'Nhiệm vụ Kanban', value: '10 Tasks', subtext: '4 Cột Kanban phân luồng', color: '#0284c7', icon: '📌' },
      { label: 'Nhiệm vụ Done', value: '5 Tasks', subtext: '50% Đã nghiệm thu xong', color: '#16a34a', icon: '✅' },
      { label: 'Đang làm (Doing)', value: '3 Tasks', subtext: 'Tiến độ trung bình 75%', color: '#0284c7', icon: '⚡' },
      { label: 'Ưu tiên Khẩn cấp (P1)', value: '2 Tasks', subtext: 'Đã hoàn tất 1, đang xử lý 1', color: '#dc2626', icon: '🔥' },
    ],
    columns: [
      { letter: 'A', key: 'code', label: 'Mã Việc', width: '90px', align: 'center' },
      { letter: 'B', key: 'title', label: 'Tên Công Việc / Hạng Mục', width: '220px' },
      { letter: 'C', key: 'module', label: 'Phân Hệ', width: '110px', align: 'center', badgeStyle: true },
      { letter: 'D', key: 'assignee', label: 'Người Phụ Trách', width: '140px' },
      { letter: 'E', key: 'kanban_col', label: 'Cột Kanban', width: '120px', align: 'center', badgeStyle: true },
      { letter: 'F', key: 'start_date', label: 'Bắt Đầu', width: '95px', align: 'center' },
      { letter: 'G', key: 'due_date', label: 'Hạn Chót', width: '95px', align: 'center' },
      { letter: 'H', key: 'priority', label: 'Ưu Tiên', width: '100px', align: 'center', badgeStyle: true },
      { letter: 'I', key: 'progress', label: 'Tiến Độ', width: '85px', align: 'center' },
    ],
    sampleRows: [
      { code: 'TSK-01', title: 'Thiết kế Wireframe & UI System', module: 'Design', assignee: 'Trần Thu Hà', kanban_col: 'Done', start_date: '01/08', due_date: '04/08', priority: 'Cao', progress: '100%' },
      { code: 'TSK-02', title: 'Khởi tạo cấu trúc dự án React Vite', module: 'Frontend', assignee: 'Lê Hoàng Nam', kanban_col: 'Done', start_date: '02/08', due_date: '05/08', priority: 'Khẩn cấp', progress: '100%' },
      { code: 'TSK-03', title: 'Xây dựng Metadata Engine 1-to-1', module: 'Backend', assignee: 'Nguyễn Văn Tuấn', kanban_col: 'Done', start_date: '04/08', due_date: '08/08', priority: 'Khẩn cấp', progress: '100%' },
      { code: 'TSK-04', title: 'Lập trình bộ chuyển đổi Version động', module: 'Frontend', assignee: 'Lê Hoàng Nam', kanban_col: 'Done', start_date: '06/08', due_date: '10/08', priority: 'Cao', progress: '100%' },
      { code: 'TSK-05', title: 'Tạo cổng thanh toán VietQR động', module: 'Fintech', assignee: 'Lê Hoàng Nam', kanban_col: 'Done', start_date: '08/08', due_date: '12/08', priority: 'Cao', progress: '100%' },
      { code: 'TSK-06', title: 'Tích hợp bảng xem trước Google Sheet', module: 'Frontend', assignee: 'Lê Hoàng Nam', kanban_col: 'Review', start_date: '10/08', due_date: '14/08', priority: 'Trung bình', progress: '90%' },
      { code: 'TSK-07', title: 'Kiểm thử luồng thanh toán và Zalo link', module: 'QA/QC', assignee: 'Hoàng Kim Yến', kanban_col: 'Doing', start_date: '12/08', due_date: '16/08', priority: 'Cao', progress: '75%' },
      { code: 'TSK-08', title: 'Tối ưu giao diện Responsive Mobile', module: 'Design', assignee: 'Trần Thu Hà', kanban_col: 'Doing', start_date: '14/08', due_date: '18/08', priority: 'Trung bình', progress: '60%' },
      { code: 'TSK-09', title: 'Biên soạn tài liệu bàn giao bản quyền', module: 'Vận hành', assignee: 'Nguyễn Văn Tuấn', kanban_col: 'Doing', start_date: '15/08', due_date: '19/08', priority: 'Thấp', progress: '40%' },
      { code: 'TSK-10', title: 'Triển khai hạ tầng Production Netlify', module: 'DevOps', assignee: 'Phạm Minh Đức', kanban_col: 'Backlog', start_date: '18/08', due_date: '22/08', priority: 'Cao', progress: '0%' },
    ],
  },

  'v4.0': {
    id: 'v4.0',
    versionName: 'Version 4.0',
    badge: 'Chat & Biểu Đồ Hiệu Suất',
    title: 'Hệ Thống Quản Trị Dự Án Tinh Gọn, Chat Nội Bộ & Biểu Đồ Hiệu Suất (v4.0)',
    subtitle: 'Đúng mô tả gsheets.vn: Tinh gọn Google Sheets không giật lag, chat thảo luận gắn theo từng task, biểu đồ hiệu suất nhân sự.',
    price: 680000,
    originalPrice: 990000,
    orderCode: 'MUA_GS_TASK_V40',
    releaseDate: '10/06/2026',
    sheetFormula: {
      cell: 'I2',
      formula: '=IF(G2<=H2, "✓ Đạt hiệu suất", "⚠️ Vượt giờ dự kiến")',
      explanation: 'So sánh giờ thực tế làm việc vs giờ dự kiến để đánh giá chỉ số hiệu quả vận hành (Efficiency Rate).',
    },
    changelog: [
      'Tích hợp Chat & Thảo luận nội bộ ngay trong từng đầu việc, không bị trôi tin nhắn trên Zalo / Slack.',
      'Kiến trúc Tinh Gọn Sheets (Lite Core): Tối ưu công thức mảng, chạy mượt mà trên 10.000 dòng dữ liệu mà không bị treo giật.',
      'Biểu đồ phân tích hiệu suất nhân sự tự động: Tỷ lệ hoàn thành đúng hạn vs Chậm tiến độ.',
      'Theo dõi thời gian thực tế làm (Actual Hours) so với Dự kiến (Estimate Hours).',
      'Báo cáo hiệu quả làm việc cá nhân hàng tuần gửi tự động cho Trưởng phòng.',
    ],
    systemHighlights: [
      { label: 'Chat nội bộ theo Task', desc: 'Thảo luận, đính kèm ghi chú ngay trong ngữ cảnh công việc.', icon: '💬' },
      { label: 'Sheets Tinh Gọn', desc: 'Tối ưu công thức nhẹ tênh, mở file tức thì không chờ đợi.', icon: '⚡' },
      { label: 'Biểu đồ hiệu suất', desc: 'Dashboard trực quan đo lường năng suất từng nhân viên.', icon: '📈' },
    ],
    features: {
      hasKanban: true,
      hasCalendar: true,
      hasChat: true,
      hasAnalytics: true,
      hasMultiApproval: false,
      hasCustomExport: false,
    },
    kpis: [
      { label: 'Tổng giờ làm thực tế', value: '142 Giờ', subtext: 'Kế hoạch: 160 Giờ (-11% tiết kiệm)', color: '#16a34a', icon: '⏱️' },
      { label: 'Hiệu suất đúng hạn', value: '92.5%', subtext: 'Vượt mục tiêu quý (+4.5%)', color: '#0284c7', icon: '🎯' },
      { label: 'Thảo luận đã gửi', value: '54 Tin nhắn', subtext: 'Tập trung 100% trong task', color: '#7c3aed', icon: '💬' },
      { label: 'Tốc độ load sheet', value: '0.4 Giây', subtext: 'Chuẩn Lite Sheets Core', color: '#059669', icon: '🚀' },
    ],
    columns: [
      { letter: 'A', key: 'code', label: 'Mã Việc', width: '85px', align: 'center' },
      { letter: 'B', key: 'title', label: 'Tên Công Việc', width: '210px' },
      { letter: 'C', key: 'assignee', label: 'Người Làm', width: '130px' },
      { letter: 'D', key: 'priority', label: 'Ưu Tiên', width: '95px', align: 'center', badgeStyle: true },
      { letter: 'E', key: 'progress', label: 'Tiến Độ', width: '80px', align: 'center' },
      { letter: 'F', key: 'chat_count', label: 'Thảo Luận', width: '100px', align: 'center' },
      { letter: 'G', key: 'actual_hrs', label: 'Giờ Thực Tế', width: '95px', align: 'center' },
      { letter: 'H', key: 'est_hrs', label: 'Dự Kiến', width: '85px', align: 'center' },
      { letter: 'I', key: 'efficiency', label: 'Hiệu Suất', width: '135px', align: 'center', badgeStyle: true },
    ],
    sampleRows: [
      { code: 'TSK-01', title: 'Thiết kế cấu trúc dữ liệu Master Blueprint', assignee: 'Nguyễn Văn Tuấn', priority: 'Khẩn cấp', progress: '100%', chat_count: '💬 8 tin', actual_hrs: '14h', est_hrs: '16h', efficiency: '🌟 Vượt tiến độ (+2h)' },
      { code: 'TSK-02', title: 'Lập trình thanh chuyển đổi Version động', assignee: 'Lê Hoàng Nam', priority: 'Cao', progress: '100%', chat_count: '💬 12 tin', actual_hrs: '18h', est_hrs: '20h', efficiency: '🌟 Vượt tiến độ (+2h)' },
      { code: 'TSK-03', title: 'Thiết kế UI Tab Bảng tính, Kanban, Chat', assignee: 'Trần Thu Hà', priority: 'Cao', progress: '100%', chat_count: '💬 5 tin', actual_hrs: '12h', est_hrs: '12h', efficiency: '✓ Đúng kế hoạch' },
      { code: 'TSK-04', title: 'Tối ưu thuật toán Lite Sheets không giật lag', assignee: 'Lê Hoàng Nam', priority: 'Khẩn cấp', progress: '100%', chat_count: '💬 9 tin', actual_hrs: '22h', est_hrs: '24h', efficiency: '🌟 Vượt tiến độ (+2h)' },
      { code: 'TSK-05', title: 'Đấu nối cổng thanh toán VietQR động', assignee: 'Phạm Minh Đức', priority: 'Cao', progress: '100%', chat_count: '💬 4 tin', actual_hrs: '10h', est_hrs: '10h', efficiency: '✓ Đúng kế hoạch' },
      { code: 'TSK-06', title: 'Xây dựng Widget Chat & Luồng thảo luận', assignee: 'Lê Hoàng Nam', priority: 'Cao', progress: '90%', chat_count: '💬 7 tin', actual_hrs: '16h', est_hrs: '15h', efficiency: '⚠️ Quá giờ 1h' },
      { code: 'TSK-07', title: 'Vẽ biểu đồ phân tích hiệu suất nhân viên', assignee: 'Trần Thu Hà', priority: 'Trung bình', progress: '85%', chat_count: '💬 3 tin', actual_hrs: '14h', est_hrs: '16h', efficiency: '✓ Đúng kế hoạch' },
      { code: 'TSK-08', title: 'Kiểm thử tải đồng thời trên 50 người dùng', assignee: 'Hoàng Kim Yến', priority: 'Cao', progress: '70%', chat_count: '💬 6 tin', actual_hrs: '15h', est_hrs: '18h', efficiency: '✓ Đúng kế hoạch' },
      { code: 'TSK-09', title: 'Soạn tài liệu tối ưu Google Sheets cho doanh nghiệp', assignee: 'Nguyễn Văn Tuấn', priority: 'Trung bình', progress: '50%', chat_count: '💬 2 tin', actual_hrs: '8h', est_hrs: '14h', efficiency: '✓ Đang làm' },
      { code: 'TSK-10', title: 'Quay video hướng dẫn sử dụng tính năng Chat', assignee: 'Trần Thu Hà', priority: 'Thấp', progress: '20%', chat_count: '💬 1 tin', actual_hrs: '3h', est_hrs: '8h', efficiency: '✓ Đang làm' },
    ],
  },

  'v5.0': {
    id: 'v5.0',
    versionName: 'Version 5.0',
    badge: 'Phê Duyệt Đa Cấp & ERP',
    title: 'Hệ Thống Quản Trị Dự Án Doanh Nghiệp & Phê Duyệt Đa Cấp (v5.0)',
    subtitle: 'Phiên bản cao cấp nhất: Luồng phê duyệt 3 cấp (Leader -> PM -> Giám đốc), kiểm soát ngân sách và Export Excel tùy biến cao cấp.',
    price: 890000,
    originalPrice: 1450000,
    orderCode: 'MUA_GS_TASK_V50',
    releaseDate: '25/08/2026',
    sheetFormula: {
      cell: 'I2',
      formula: '=IF(AND(D2="✓ Đã duyệt", E2="✓ Đã duyệt", F2="✓ Đã duyệt"), "✓ Phê duyệt 3 cấp hoàn tất", "⏳ Chờ ký duyệt")',
      explanation: 'Điều kiện kiểm duyệt chặt chẽ: Cả 3 cấp Trưởng nhóm, PM và Giám đốc đều duyệt thì mới thông qua chi ngân sách.',
    },
    changelog: [
      'Luồng Phê duyệt đa cấp 3 tầng: Cấp 1 Trưởng bộ phận -> Cấp 2 Project Manager -> Cấp 3 Ban Giám đốc.',
      'Kiểm soát ngân sách thực thi trên từng hạng mục, tự động khóa khi vượt định mức cho phép.',
      'Tính năng Xuất Excel (Export tùy biến): Tự chọn cột dữ liệu, định dạng trang in A4 chuẩn biên bản.',
      'Tích hợp mã định danh nghiệm thu điện tử (Sign-off ID) chống sửa đổi dữ liệu sau khi duyệt.',
      'Đầy đủ mọi tính năng từ v1.0, v2.0, v3.0, v4.0 (Kanban, Calendar, Chat nội bộ, Analytics, Tinh gọn Sheets).',
    ],
    systemHighlights: [
      { label: 'Phê duyệt 3 cấp', desc: 'Kiểm soát chặt chẽ quy trình duyệt ngân sách và nghiệm thu.', icon: '✍️' },
      { label: 'Quản lý ngân sách', desc: 'Theo dõi chi phí từng hạng mục, chặn vượt ngân sách.', icon: '💰' },
      { label: 'Export Excel tùy biến', desc: 'Xuất file báo cáo theo đúng biểu mẫu kế toán & quản trị.', icon: '📑' },
    ],
    features: {
      hasKanban: true,
      hasCalendar: true,
      hasChat: true,
      hasAnalytics: true,
      hasMultiApproval: true,
      hasCustomExport: true,
    },
    kpis: [
      { label: 'Tổng ngân sách dự án', value: '450,000,000 ₫', subtext: 'Đã giải ngân: 285,000,000 ₫', color: '#16a34a', icon: '💵' },
      { label: 'Đã phê duyệt 3 cấp', value: '6 / 10 Hạng mục', subtext: 'Đủ điều kiện giải ngân', color: '#0284c7', icon: '✅' },
      { label: 'Đang chờ ký duyệt', value: '3 Hạng mục', subtext: 'Cần PM & Giám đốc xem xét', color: '#d97706', icon: '⏳' },
      { label: 'Biên bản nghiệm thu', value: '6 Biên bản', subtext: 'Đã gắn mã số ký điện tử', color: '#7c3aed', icon: '📜' },
    ],
    columns: [
      { letter: 'A', key: 'code', label: 'Mã Việc', width: '85px', align: 'center' },
      { letter: 'B', key: 'title', label: 'Tên Hạng Mục / Nhiệm Vụ', width: '200px' },
      { letter: 'C', key: 'requester', label: 'Người Trình Duyệt', width: '130px' },
      { letter: 'D', key: 'lead_approval', label: 'Cấp 1: Leader', width: '110px', align: 'center', badgeStyle: true },
      { letter: 'E', key: 'pm_approval', label: 'Cấp 2: PM', width: '110px', align: 'center', badgeStyle: true },
      { letter: 'F', key: 'director_approval', label: 'Cấp 3: Giám Đốc', width: '110px', align: 'center', badgeStyle: true },
      { letter: 'G', key: 'budget_vnd', label: 'Ngân Sách (₫)', width: '110px', align: 'right' },
      { letter: 'H', key: 'overall_approval', label: 'Trạng Thái Duyệt', width: '135px', align: 'center', badgeStyle: true },
      { letter: 'I', key: 'signoff_id', label: 'Mã Nghiệm Thu', width: '110px', align: 'center' },
    ],
    sampleRows: [
      { code: 'TSK-01', title: 'Thuê hạ tầng Cloud Server AWS & CDN', requester: 'Lê Hoàng Nam', lead_approval: '✓ Đã duyệt', pm_approval: '✓ Đã duyệt', director_approval: '✓ Đã duyệt', budget_vnd: '35,000,000', overall_approval: '✓ Đã duyệt 3 cấp', signoff_id: 'BB-NT-01' },
      { code: 'TSK-02', title: 'Bản quyền công cụ thiết kế Figma Team', requester: 'Trần Thu Hà', lead_approval: '✓ Đã duyệt', pm_approval: '✓ Đã duyệt', director_approval: '✓ Đã duyệt', budget_vnd: '15,000,000', overall_approval: '✓ Đã duyệt 3 cấp', signoff_id: 'BB-NT-02' },
      { code: 'TSK-03', title: 'Tích hợp kết nối ngân hàng VietQR MB Bank', requester: 'Lê Hoàng Nam', lead_approval: '✓ Đã duyệt', pm_approval: '✓ Đã duyệt', director_approval: '✓ Đã duyệt', budget_vnd: '25,000,000', overall_approval: '✓ Đã duyệt 3 cấp', signoff_id: 'BB-NT-03' },
      { code: 'TSK-04', title: 'Thuê chuyên gia Audit bảo mật Penetration', requester: 'Phạm Minh Đức', lead_approval: '✓ Đã duyệt', pm_approval: '✓ Đã duyệt', director_approval: '✓ Đã duyệt', budget_vnd: '50,000,000', overall_approval: '✓ Đã duyệt 3 cấp', signoff_id: 'BB-NT-04' },
      { code: 'TSK-05', title: 'Chi phí Marketing Launching sản phẩm mới', requester: 'Nguyễn Văn Tuấn', lead_approval: '✓ Đã duyệt', pm_approval: '✓ Đã duyệt', director_approval: '✓ Đã duyệt', budget_vnd: '65,000,000', overall_approval: '✓ Đã duyệt 3 cấp', signoff_id: 'BB-NT-05' },
      { code: 'TSK-06', title: 'Chi thưởng hoàn thành Sprint trước hạn', requester: 'Nguyễn Văn Tuấn', lead_approval: '✓ Đã duyệt', pm_approval: '✓ Đã duyệt', director_approval: '✓ Đã duyệt', budget_vnd: '30,000,000', overall_approval: '✓ Đã duyệt 3 cấp', signoff_id: 'BB-NT-06' },
      { code: 'TSK-07', title: 'Mua sắm thiết bị kiểm thử iPad / Mac Mini', requester: 'Hoàng Kim Yến', lead_approval: '✓ Đã duyệt', pm_approval: '✓ Đã duyệt', director_approval: '⏳ Chờ ký', budget_vnd: '42,000,000', overall_approval: '⏳ Chờ Giám đốc', signoff_id: '—' },
      { code: 'TSK-08', title: 'Tổ chức Workshop chuyển giao công nghệ', requester: 'Trần Thu Hà', lead_approval: '✓ Đã duyệt', pm_approval: '⏳ Chờ duyệt', director_approval: '⏳ Chờ ký', budget_vnd: '18,000,000', overall_approval: '⏳ Chờ PM duyệt', signoff_id: '—' },
      { code: 'TSK-09', title: 'Đăng ký chứng nhận bản quyền phần mềm', requester: 'Nguyễn Văn Tuấn', lead_approval: '✓ Đã duyệt', pm_approval: '⏳ Chờ duyệt', director_approval: '⏳ Chờ ký', budget_vnd: '12,000,000', overall_approval: '⏳ Chờ PM duyệt', signoff_id: '—' },
      { code: 'TSK-10', title: 'Quỹ dự phòng phát sinh kỹ thuật quý 3', requester: 'Nguyễn Văn Tuấn', lead_approval: '⏳ Chờ duyệt', pm_approval: '⏳ Chờ duyệt', director_approval: '⏳ Chờ ký', budget_vnd: '20,000,000', overall_approval: '⏳ Đang khởi tạo', signoff_id: '—' },
    ],
  },
};

// ============================================================================
// COMPONENT MASTER APP BLUEPRINT CHÍNH
// ============================================================================
export default function MasterAppBlueprint() {
  const [selectedVersionId, setSelectedVersionId] = useState<VersionId>('v5.0');
  const [activeViewMode, setActiveViewMode] = useState<'table' | 'kanban' | 'calendar' | 'chat' | 'approval'>('table');
  const [tableSearch, setTableSearch] = useState<string>('');

  // Modal 1: Mở Template Google Sheets (Dùng thử)
  const [showSheetModal, setShowSheetModal] = useState<boolean>(false);

  // Modal 2: Đặt Mua Bản Quyền & Nhận File Gốc (VietQR Động)
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [buyerName, setBuyerName] = useState<string>('Nguyễn Văn Tuấn');
  const [buyerPhone, setBuyerPhone] = useState<string>('0988123456');
  const [buyerEmail, setBuyerEmail] = useState<string>('tuan.nguyen@gmail.com');
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);

  // Lấy dữ liệu Version hiện tại
  const currentVer = MASTER_VERSIONS[selectedVersionId];

  // Định dạng tiền tệ VND
  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // Lọc dữ liệu bảng
  const filteredRows = useMemo(() => {
    if (!tableSearch.trim()) return currentVer.sampleRows;
    const q = tableSearch.toLowerCase().trim();
    return currentVer.sampleRows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [currentVer, tableSearch]);

  // Dynamic VietQR theo số tiền và mã đơn hàng của Version đang chọn
  const dynamicQrUrl = `https://img.vietqr.io/image/970422-123456789-compact2.png?amount=${currentVer.price}&addInfo=${currentVer.orderCode}`;

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* ================================================================== */}
      {/* 1. HERO BANNER FLAGSHIP - SOURCE GỐC MASTER BLUEPRINT */}
      {/* ================================================================== */}
      <div
        style={{
          background: 'linear-gradient(135deg, #091e3a 0%, #103766 50%, #0369a1 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: '24px',
          boxShadow: '0 8px 30px rgba(2, 132, 199, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span
              style={{
                backgroundColor: 'rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '0.5px',
              }}
            >
              💎 MASTER SOURCE BLUEPRINT — KHUNG KIẾN TRÚC GỐC CHUẨN MỰC
            </span>
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
              Phiên bản đang mở: <strong style={{ color: '#facc15' }}>{currentVer.versionName} ({currentVer.badge})</strong>
            </span>
          </div>

          <h1 style={{ margin: '0 0 10px 0', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.4px' }}>
            {currentVer.title}
          </h1>

          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#e2e8f0', maxWidth: '820px', lineHeight: 1.6 }}>
            {currentVer.subtitle} Tự do chuyển đổi giữa 5 phiên bản để trải nghiệm từng cấp độ tính năng từ quản lý việc cá nhân cơ bản đến quy trình ERP phê duyệt 3 cấp doanh nghiệp!
          </p>

          {/* THANH CHỌN VERSION ĐỘNG THEO YÊU CẦU ĐỀ BÀI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', marginRight: '4px' }}>
              Chọn Phiên Bản:
            </span>
            {(['v1.0', 'v2.0', 'v3.0', 'v4.0', 'v5.0'] as VersionId[]).map((vId) => {
              const vItem = MASTER_VERSIONS[vId];
              const isSelected = selectedVersionId === vId;
              return (
                <button
                  key={vId}
                  type="button"
                  onClick={() => {
                    setSelectedVersionId(vId);
                    setActiveViewMode('table');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                    color: isSelected ? '#091e3a' : '#ffffff',
                    fontWeight: isSelected ? '800' : '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(56, 189, 248, 0.4)' : 'none',
                  }}
                >
                  <span>{vItem.versionName}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? 'rgba(9, 30, 58, 0.15)' : 'rgba(255,255,255,0.15)',
                    }}
                  >
                    {vItem.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 2. KHUNG TỔNG QUAN PHIÊN BẢN (TRÁI: THÔNG TIN & GIÁ - PHẢI: NHẬT KÝ) */}
      {/* ================================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '22px', marginBottom: '24px' }}>
        {/* CỘT TRÁI: THẺ GIÁ BÁN & 2 NÚT HÀNH ĐỘNG CHUẨN */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#0284c7',
                  backgroundColor: '#e0f2fe',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                MÃ SẢN PHẨM: {currentVer.orderCode}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Phát hành: {currentVer.releaseDate}
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>
                Giá bản quyền kích hoạt trọn đời ({currentVer.versionName}):
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#16a34a' }}>
                  {formatVND(currentVer.price)}
                </span>
                <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {formatVND(currentVer.originalPrice)}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '4px' }}>
                  Tiết kiệm {Math.round((1 - currentVer.price / currentVer.originalPrice) * 100)}%
                </span>
              </div>
            </div>

            {/* 3 ĐIỂM NHẤN KỸ THUẬT CỦA VERSION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {currentVer.systemHighlights.map((hl, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{hl.icon}</span>
                  <div>
                    <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{hl.label}: </strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{hl.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2 NÚT HÀNH ĐỘNG CHUẨN THEO YÊU CẦU ĐỀ BÀI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* NÚT 1: MỞ TEMPLATE GOOGLE SHEETS (DÙNG THỬ) */}
            <button
              type="button"
              onClick={() => setShowSheetModal(true)}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '8px',
                border: '1px solid #16a34a',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                fontWeight: '700',
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🔗</span>
              <span>Mở Template Google Sheets (Dùng thử {currentVer.versionName})</span>
            </button>

            {/* NÚT 2: ĐẶT MUA BẢN QUYỀN & NHẬN FILE GỐC */}
            <button
              type="button"
              onClick={() => {
                setOrderConfirmed(false);
                setShowCheckoutModal(true);
              }}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>💳</span>
              <span>Đặt Mua Bản Quyền & Nhận File Gốc ({formatVND(currentVer.price)})</span>
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: KHUNG "NHẬT KÝ | MÔ TẢ" HIỂN THỊ ĐÚNG GẠCH ĐẦU DÒNG TÍNH NĂNG CỦA VERSION ĐÓ */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800', color: '#0f172a' }}>
              📝 Nhật Ký Thay Đổi & Đặc Tả Tính Năng ({currentVer.versionName})
            </h3>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '3px 8px', borderRadius: '4px' }}>
              Chuẩn gsheets.vn
            </span>
          </div>

          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: '0 0 14px 0' }}>
            {currentVer.subtitle}
          </p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Danh sách tính năng độc bản được tích hợp:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#334155', lineHeight: 1.75 }}>
              {currentVer.changelog.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CÔNG THỨC GOOGLE SHEETS CỐT LÕI CỦA VERSION */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ color: '#0284c7', fontWeight: '800' }}>fx [{currentVer.sheetFormula.cell}]:</span>
              <code style={{ color: '#0f172a', fontWeight: '700', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                {currentVer.sheetFormula.formula}
              </code>
            </div>
            <div style={{ color: '#64748b', fontSize: '11.5px' }}>
              💡 <em>{currentVer.sheetFormula.explanation}</em>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. 4 THẺ KPIS ĐỘC BẢN CỦA VERSION */}
      {/* ================================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        {currentVer.kpis.map((kpi, kIdx) => (
          <div
            key={kIdx}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px 18px',
              borderLeft: `4px solid ${kpi.color}`,
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: '600' }}>{kpi.label}</span>
              <span style={{ fontSize: '18px' }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b' }}>{kpi.subtext}</div>
          </div>
        ))}
      </div>

      {/* ================================================================== */}
      {/* 4. THANH ĐIỀU HƯỚNG CHẾ ĐỘ XEM TƯƠNG TÁC (TABLE / KANBAN / CALENDAR / CHAT / APPROVAL) */}
      {/* ================================================================== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '18px 22px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
          {/* TABS CHUYỂN ĐỔI CHẾ ĐỘ XEM ĐỘC BẢN */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveViewMode('table')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: activeViewMode === 'table' ? '1px solid #0284c7' : '1px solid #e2e8f0',
                backgroundColor: activeViewMode === 'table' ? '#e0f2fe' : '#ffffff',
                color: activeViewMode === 'table' ? '#0369a1' : '#475569',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>📋</span>
              <span>Bảng Dữ Liệu 10 Dòng Mẫu ({currentVer.columns.length} Cột)</span>
            </button>

            {currentVer.features.hasKanban && (
              <button
                type="button"
                onClick={() => setActiveViewMode('kanban')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: activeViewMode === 'kanban' ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: activeViewMode === 'kanban' ? '#e0f2fe' : '#ffffff',
                  color: activeViewMode === 'kanban' ? '#0369a1' : '#475569',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>📌</span>
                <span>Bảng Kanban Board 4 Cột</span>
              </button>
            )}

            {currentVer.features.hasCalendar && (
              <button
                type="button"
                onClick={() => setActiveViewMode('calendar')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: activeViewMode === 'calendar' ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: activeViewMode === 'calendar' ? '#e0f2fe' : '#ffffff',
                  color: activeViewMode === 'calendar' ? '#0369a1' : '#475569',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>📅</span>
                <span>Lịch Biểu Tiến Độ (Timeline)</span>
              </button>
            )}

            {currentVer.features.hasChat && (
              <button
                type="button"
                onClick={() => setActiveViewMode('chat')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: activeViewMode === 'chat' ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: activeViewMode === 'chat' ? '#e0f2fe' : '#ffffff',
                  color: activeViewMode === 'chat' ? '#0369a1' : '#475569',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>💬</span>
                <span>Chat Thảo Luận Nội Bộ</span>
              </button>
            )}

            {currentVer.features.hasMultiApproval && (
              <button
                type="button"
                onClick={() => setActiveViewMode('approval')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: activeViewMode === 'approval' ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: activeViewMode === 'approval' ? '#e0f2fe' : '#ffffff',
                  color: activeViewMode === 'approval' ? '#0369a1' : '#475569',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>✍️</span>
                <span>Luồng Phê Duyệt 3 Cấp</span>
              </button>
            )}
          </div>

          {/* Ô TÌM KIẾM TRONG BẢNG */}
          <div style={{ minWidth: '260px' }}>
            <input
              type="text"
              placeholder="🔍 Lọc trong 10 dòng mẫu..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 1: BẢNG DỮ LIỆU TƯƠNG TÁC 10 DÒNG MẪU CHUẨN CỦA VERSION */}
        {/* ------------------------------------------------------------------ */}
        {activeViewMode === 'table' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                Đang hiển thị đúng <strong>{filteredRows.length}</strong> dòng mẫu chuẩn của <strong>{currentVer.versionName}</strong> với <strong>{currentVer.columns.length}</strong> cột dữ liệu.
              </div>
              {currentVer.features.hasCustomExport && (
                <button
                  type="button"
                  onClick={() => alert(`Đã trích xuất báo cáo Excel tùy biến của ${currentVer.versionName} thành công!`)}
                  style={{
                    backgroundColor: '#15803d',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>📥</span>
                  <span>Export Excel Tùy Biến (v5.0)</span>
                </button>
              )}
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left', backgroundColor: '#ffffff' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                    {currentVer.columns.map((col, idx) => (
                      <th
                        key={idx}
                        style={{
                          padding: '10px 12px',
                          color: '#334155',
                          fontWeight: '700',
                          width: col.width,
                          textAlign: col.align || 'left',
                          whiteSpace: 'nowrap',
                          borderRight: '1px solid #e2e8f0',
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#fcfcfd',
                      }}
                    >
                      {currentVer.columns.map((col, cIdx) => {
                        const val = String(row[col.key] ?? '—');
                        const isBadge = col.badgeStyle;
                        const isSuccess = val.includes('✓') || val.includes('100%') || val.includes('Vượt') || val.includes('Done');
                        const isWarning = val.includes('⚠️') || val.includes('Chờ') || val.includes('Doing') || val.includes('Review');
                        const isDanger = val.includes('Khẩn cấp') || val.includes('Chậm');

                        return (
                          <td
                            key={cIdx}
                            style={{
                              padding: '9px 12px',
                              textAlign: col.align || 'left',
                              color: '#1e293b',
                              fontWeight: cIdx === 0 ? '700' : 'normal',
                              borderRight: '1px solid #f1f5f9',
                              whiteSpace: col.width ? 'normal' : 'nowrap',
                            }}
                          >
                            {isBadge ? (
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '3px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  backgroundColor: isDanger ? '#fee2e2' : isWarning ? '#fef3c7' : isSuccess ? '#dcfce7' : '#e0f2fe',
                                  color: isDanger ? '#b91c1c' : isWarning ? '#b45309' : isSuccess ? '#15803d' : '#0369a1',
                                }}
                              >
                                {val}
                              </span>
                            ) : (
                              val
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 2: BẢNG KANBAN BOARD 4 CỘT (v3.0, v4.0, v5.0) */}
        {/* ------------------------------------------------------------------ */}
        {activeViewMode === 'kanban' && currentVer.features.hasKanban && (
          <div>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
              Quy trình luân chuyển Kanban 4 cột trực quan chuẩn {currentVer.versionName}:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {[
                { key: 'Backlog', label: 'Chờ Làm (Backlog)', bg: '#f1f5f9', headerBg: '#64748b' },
                { key: 'Doing', label: 'Đang Làm (Doing)', bg: '#e0f2fe', headerBg: '#0284c7' },
                { key: 'Review', label: 'Nghiệm Thu (Review)', bg: '#fef3c7', headerBg: '#d97706' },
                { key: 'Done', label: 'Hoàn Thành (Done)', bg: '#dcfce7', headerBg: '#16a34a' },
              ].map((column) => {
                const columnTasks = currentVer.sampleRows.filter((t) => {
                  if (t.kanban_col) return t.kanban_col === column.key;
                  if (column.key === 'Done') return String(t.status || t.overall_approval).includes('✓');
                  if (column.key === 'Doing') return String(t.status || t.overall_approval).includes('Đang');
                  if (column.key === 'Review') return String(t.status || t.overall_approval).includes('Chờ');
                  return true;
                });

                return (
                  <div
                    key={column.key}
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      padding: '12px',
                      minHeight: '360px',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: column.headerBg,
                        color: '#ffffff',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontWeight: '800',
                        fontSize: '12.5px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <span>{column.label}</span>
                      <span>({columnTasks.length})</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {columnTasks.map((t, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#ffffff',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7' }}>{t.code}</span>
                            <span style={{ fontSize: '10.5px', color: '#64748b' }}>{t.module || t.due_date}</span>
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                            {t.title}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#475569' }}>
                            <span>👤 {t.assignee || t.requester}</span>
                            <span style={{ fontWeight: '700', color: '#16a34a' }}>{t.progress || t.kpi_weight || '✓'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 3: LỊCH BIỂU TIẾN ĐỘ TIMELINE (v3.0, v4.0, v5.0) */}
        {/* ------------------------------------------------------------------ */}
        {activeViewMode === 'calendar' && currentVer.features.hasCalendar && (
          <div>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
              Tiến độ phân bổ theo Timeline tuần dự án ({currentVer.versionName}):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentVer.sampleRows.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '280px' }}>
                    <span style={{ fontWeight: '800', fontSize: '12px', color: '#0284c7' }}>{t.code}</span>
                    <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#0f172a' }}>{t.title}</span>
                  </div>

                  <div style={{ flex: 1, margin: '0 20px', backgroundColor: '#f1f5f9', height: '14px', borderRadius: '7px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: t.progress || '80%',
                        backgroundColor: (t.progress || '').includes('100') ? '#16a34a' : '#0284c7',
                        height: '100%',
                        borderRadius: '7px',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', minWidth: '160px', textAlign: 'right' }}>
                    <span>Hạn chót: <strong>{t.due_date || 'Cuối tháng'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 4: CHAT THẢO LUẬN NỘI BỘ GẮN VỚI TỪNG TASK (v4.0, v5.0) */}
        {/* ------------------------------------------------------------------ */}
        {activeViewMode === 'chat' && currentVer.features.hasChat && (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>
                Hạng mục thảo luận:
              </div>
              {currentVer.sampleRows.slice(0, 5).map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    backgroundColor: idx === 0 ? '#e0f2fe' : '#ffffff',
                    color: idx === 0 ? '#0369a1' : '#334155',
                    fontSize: '12px',
                    fontWeight: idx === 0 ? '700' : 'normal',
                    marginBottom: '6px',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <div>{t.code}: {t.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{t.chat_count || '💬 6 thảo luận'}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '340px' }}>
              <div>
                <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '14px', fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                  💬 Kênh thảo luận cho nhiệm vụ TSK-01 (Master Blueprint Architecture)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', maxWidth: '80%' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', marginBottom: '2px' }}>Nguyễn Văn Tuấn (PM) • 08:30</div>
                    <div style={{ fontSize: '12.5px', color: '#1e293b' }}>Đã xác nhận chốt 5 Version cho dòng sản phẩm Quản lý dự án. Mọi người cập nhật đúng cột dữ liệu nhé.</div>
                  </div>

                  <div style={{ backgroundColor: '#e0f2fe', padding: '10px 14px', borderRadius: '8px', maxWidth: '80%', alignSelf: 'flex-end' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#0369a1', marginBottom: '2px' }}>Lê Hoàng Nam (Fullstack) • 09:15</div>
                    <div style={{ fontSize: '12.5px', color: '#0f172a' }}>Dạ em đã hoàn thiện cơ chế chuyển đổi Version động và modal xem trước Sheet Grid thật 100%.</div>
                  </div>

                  <div style={{ backgroundColor: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', maxWidth: '80%' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#16a34a', marginBottom: '2px' }}>Hoàng Kim Yến (QA) • 09:40</div>
                    <div style={{ fontSize: '12.5px', color: '#1e293b' }}>Đã test thử luồng thanh toán VietQR và xác nhận nhận file Google Drive, hoạt động mượt mà không lỗi.</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Gửi phản hồi thảo luận nội bộ..."
                  defaultValue="✓ Xác nhận đã nghiệm thu xong tính năng."
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                />
                <button
                  type="button"
                  onClick={() => alert('Đã gửi phản hồi thảo luận nội bộ thành công!')}
                  style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer' }}
                >
                  Gửi tin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 5: LUỒNG PHÊ DUYỆT 3 CẤP (v5.0) */}
        {/* ------------------------------------------------------------------ */}
        {activeViewMode === 'approval' && currentVer.features.hasMultiApproval && (
          <div>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
              Quy trình kiểm soát & Ký duyệt 3 tầng độc bản của {currentVer.versionName}:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {currentVer.sampleRows.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '14px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '800', color: '#0284c7', fontSize: '12px' }}>{t.code}</span>
                    <span style={{ fontWeight: '800', color: '#16a34a', fontSize: '13px' }}>{t.budget_vnd} ₫</span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                    {t.title}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Cấp 1 (Trưởng nhóm):</span>
                      <strong style={{ color: '#15803d' }}>{t.lead_approval}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Cấp 2 (Project Manager):</span>
                      <strong style={{ color: t.pm_approval.includes('✓') ? '#15803d' : '#b45309' }}>{t.pm_approval}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Cấp 3 (Ban Giám đốc):</span>
                      <strong style={{ color: t.director_approval.includes('✓') ? '#15803d' : '#dc2626' }}>{t.director_approval}</strong>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                    <span style={{ color: '#64748b' }}>Biên bản: <strong>{t.signoff_id}</strong></span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '700',
                        backgroundColor: t.overall_approval.includes('✓') ? '#dcfce7' : '#fef3c7',
                        color: t.overall_approval.includes('✓') ? '#15803d' : '#b45309',
                      }}
                    >
                      {t.overall_approval}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* MODAL 1: MÔ PHỎNG GOOGLE SHEETS THẬT (DÙNG THỬ) */}
      {/* ================================================================== */}
      {showSheetModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '1000px',
              width: '100%',
              padding: '24px 28px',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a', backgroundColor: '#dcfce7', padding: '3px 8px', borderRadius: '4px' }}>
                  📊 GOOGLE SHEETS DÙNG THỬ — {currentVer.versionName}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0 0', color: '#0f172a' }}>
                  Bản Tính Mô Phỏng: {currentVer.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowSheetModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            {/* KHUNG GIẢ LẬP GOOGLE SHEETS */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
              {/* THANH XANH TIÊU ĐỀ */}
              <div style={{ backgroundColor: '#107c41', color: '#ffffff', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📊</span>
                  <span>Google Sheets — {currentVer.title}.xlsx</span>
                </div>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                  Chế độ: Đọc & Xem công thức
                </span>
              </div>

              {/* MENU BAR */}
              <div style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', padding: '4px 12px', display: 'flex', gap: '14px', fontSize: '11.5px', color: '#475569' }}>
                <span>Tệp</span>
                <span>Chỉnh sửa</span>
                <span>Xem</span>
                <span>Chèn</span>
                <span>Định dạng</span>
                <span>Dữ liệu</span>
                <span>Công cụ</span>
                <span>Tiện ích mở rộng</span>
              </div>

              {/* THANH CÔNG THỨC FX */}
              <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <span style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: '700' }}>
                  {currentVer.sheetFormula.cell}
                </span>
                <span style={{ color: '#0284c7', fontWeight: '800', fontStyle: 'italic' }}>fx</span>
                <span style={{ fontFamily: 'monospace', color: '#334155', fontWeight: '600' }}>
                  {currentVer.sheetFormula.formula}
                </span>
              </div>

              {/* GRID BẢNG TÍNH */}
              <div style={{ overflowX: 'auto', maxHeight: '320px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', backgroundColor: '#ffffff' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ width: '38px', padding: '6px', textAlign: 'center', borderRight: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b' }}>
                        ◰
                      </th>
                      {currentVer.columns.map((col, idx) => (
                        <th
                          key={idx}
                          style={{
                            padding: '6px 10px',
                            borderRight: '1px solid #cbd5e1',
                            textAlign: 'center',
                            color: '#475569',
                            fontWeight: '700',
                            backgroundColor: '#f8fafc',
                          }}
                        >
                          {col.letter}
                        </th>
                      ))}
                    </tr>

                    <tr style={{ backgroundColor: '#e8f5e9', borderBottom: '2px solid #81c784', color: '#1b5e20' }}>
                      <td style={{ padding: '6px', textAlign: 'center', borderRight: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: '700' }}>
                        1
                      </td>
                      {currentVer.columns.map((col, idx) => (
                        <th key={idx} style={{ padding: '6px 10px', borderRight: '1px solid #c8e6c9', fontWeight: '800', whiteSpace: 'nowrap' }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentVer.sampleRows.map((row, rIdx) => (
                      <tr key={rIdx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#fcfdfc' }}>
                        <td style={{ padding: '6px', textAlign: 'center', borderRight: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: '600' }}>
                          {rIdx + 2}
                        </td>
                        {currentVer.columns.map((col, cIdx) => (
                          <td key={cIdx} style={{ padding: '6px 10px', borderRight: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                            {String(row[col.key] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                💡 File thật bao gồm đầy đủ công thức mảng tự động và hướng dẫn video từng bước.
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSheetModal(false);
                  setShowCheckoutModal(true);
                }}
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Đặt Mua Bản Quyền File Này ({formatVND(currentVer.price)}) ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 2: ĐẶT MUA BẢN QUYỀN QUA VIETQR ĐỘNG */}
      {/* ================================================================== */}
      {showCheckoutModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '820px',
              width: '100%',
              padding: '26px 30px',
              maxHeight: '94vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '3px 8px', borderRadius: '4px' }}>
                  💳 ĐẶT MUA BẢN QUYỀN — {currentVer.versionName}
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                  {currentVer.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            {!orderConfirmed ? (
              <div>
                <div style={{ border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', alignItems: 'center' }}>
                    {/* QR VIETQR ĐỘNG */}
                    <div style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                      <img
                        src={dynamicQrUrl}
                        alt="VietQR Chuyển Khoản"
                        style={{ width: '176px', height: '176px', display: 'block', margin: '0 auto' }}
                      />
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', fontWeight: '600' }}>
                        Quét bằng app mọi ngân hàng
                      </div>
                    </div>

                    {/* THÔNG TIN THANH TOÁN & FORM */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12.5px', color: '#0f172a', lineHeight: 1.6, backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div>Ngân hàng: <strong>MB Bank (Quân Đội)</strong></div>
                        <div>Số tài khoản: <strong>123456789</strong></div>
                        <div>Số tiền: <strong style={{ color: '#16a34a', fontSize: '14px' }}>{formatVND(currentVer.price)}</strong></div>
                        <div>Nội dung: <strong style={{ color: '#0284c7' }}>{currentVer.orderCode}</strong></div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>
                          Họ và tên người nhận:
                        </label>
                        <input
                          type="text"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>
                          Số điện thoại / Zalo:
                        </label>
                        <input
                          type="text"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>
                          Email nhận link Google Drive:
                        </label>
                        <input
                          type="email"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setOrderConfirmed(true)}
                        style={{
                          marginTop: '6px',
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '11px',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '13.5px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                        }}
                      >
                        ✓ Xác nhận đã chuyển khoản
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* MÀN HÌNH XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG */
              <div style={{ backgroundColor: '#ecfdf5', border: '2px solid #86efac', borderRadius: '14px', padding: '26px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎉</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '19px', fontWeight: '800', color: '#166534' }}>
                  Xác Nhận Đơn Hàng Thành Công!
                </h3>
                <p style={{ margin: '0 0 14px 0', fontSize: '13.5px', color: '#15803d', lineHeight: 1.6 }}>
                  Hệ thống đã ghi nhận đơn hàng <strong>{currentVer.orderCode}</strong> ({currentVer.title}).<br />
                  Liên kết bản quyền Google Drive đã được gửi đến hộp thư <strong>{buyerEmail}</strong>.
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={`https://zalo.me/${buyerPhone.replace(/\D/g, '') || '0987654321'}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: 'none',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      padding: '11px 22px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '13px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    💬 Mở Zalo nhận file ngay
                  </a>

                  <a
                    href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/copy"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: 'none',
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      padding: '11px 22px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '13px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    📂 Mở & Tạo Bản Sao Google Drive
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`Đã tải xuống file template [${currentVer.title}.xlsx] thành công!`);
                    }}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      padding: '11px 18px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    📥 Tải Xuống File (.xlsx)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

