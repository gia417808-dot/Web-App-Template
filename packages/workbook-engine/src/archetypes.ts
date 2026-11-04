/**
 * Centralized Core Archetypes Definition
 * Generated from registry/assets.json (Golden Master Commercial Pro)
 */

export interface ArchetypeDefinition {
  id: string;
  code: string;
  canonicalDir: string;
  name: string;
  version: string;
  groupArchetype: string;
  sheetsCount: number;
  spreadsheetId: string;
  templatePreviewUrl: string;
  packagePath: string;
  features: string[];
}

export const CORE_ARCHETYPES: Record<string, ArchetypeDefinition> = {
  'GS-001': {
    id: 'GS-001',
    code: 'GS-001',
    canonicalDir: 'GS-001-hr',
    name: 'Quản Lý Nhân Sự, Chấm Công Ca/GPS, KPI & Tính Lương Tự Động',
    version: 'v4.0 Commercial Pro',
    groupArchetype: 'Human Resources & Payroll',
    sheetsCount: 8,
    spreadsheetId: '1lFURWpqf8fhlPyEbxnY0aQm3r40hhcVQ35JORZiUsJo',
    templatePreviewUrl: 'https://docs.google.com/spreadsheets/d/1lFURWpqf8fhlPyEbxnY0aQm3r40hhcVQ35JORZiUsJo/template/preview',
    packagePath: 'delivery/packages/GS-001-hr',
    features: [
      'Quản lý hồ sơ nhân sự, danh bạ, hợp đồng và tệp đính kèm Word/Excel/PDF',
      'Chấm công vào/ra ca 1 chạm kèm GPS và phân loại ca làm việc linh hoạt',
      'Phê duyệt trực tuyến đơn xin nghỉ phép, tăng ca OT và giải trình đi muộn',
      'Giao và đánh giá KPI/OKR tự động (tiến độ 100% tự động chuyển Chờ duyệt)',
      'Động cơ tính lương tự động BHXH 10.5%, thuế TNCN lũy tiến và xuất phiếu lương A4',
      'Bắn thông báo phiếu lương cá nhân (Payslip) tự động qua Email và Bot Zalo'
    ]
  },
  'GS-002': {
    id: 'GS-002',
    code: 'GS-002',
    canonicalDir: 'GS-002-warehouse',
    name: 'Quản Lý Nhập Xuất Tồn Đa Kho & Cảnh Báo Định Mức',
    version: 'v3.0 Commercial Pro',
    groupArchetype: 'Inventory & Warehousing',
    sheetsCount: 7,
    spreadsheetId: '1zx9Lo4p0_fRuCf_x6J_Jg-qcC1TBdS9vqYlmLUVSZe0',
    templatePreviewUrl: 'https://docs.google.com/spreadsheets/d/1zx9Lo4p0_fRuCf_x6J_Jg-qcC1TBdS9vqYlmLUVSZe0/template/preview',
    packagePath: 'delivery/packages/GS-002-warehouse',
    features: [
      'Quản lý danh mục hàng hóa, phân loại ngành hàng và vị trí kho',
      'Tự động tính tồn kho tức thời và đơn giá vốn bình quân gia quyền',
      'Cổng đăng nhập bảo mật (Auth Gate) kiểm soát quyền thủ kho',
      'Hệ thống cảnh báo định mức tồn tối thiểu (Min) và quá tải (Max)',
      'Lập, in và xuất phiếu Nhập - Xuất - Điều chuyển kho chuẩn A4',
      'Thẻ kho chi tiết và báo cáo tổng hợp Nhập Xuất Tồn theo kỳ'
    ]
  },
  'GS-003': {
    id: 'GS-003',
    code: 'GS-003',
    canonicalDir: 'GS-003-finance',
    name: 'Quản Lý Thu Chi, Sổ Quỹ Đa Tài Khoản & Dòng Tiền Startup',
    version: 'v4.1 Commercial Pro',
    groupArchetype: 'Finance & Cashflow',
    sheetsCount: 7,
    spreadsheetId: '1n7d3qaFfmTy98cEzhRYtoyVry4AKbwmM6nWk309K4Ieg',
    templatePreviewUrl: 'https://docs.google.com/spreadsheets/d/1n7d3qaFfmTy98cEzhRYtoyVry4AKbwmM6nWk309K4Ieg/template/preview',
    packagePath: 'delivery/packages/GS-003-finance',
    features: [
      'Sổ quỹ quản lý đa tài khoản ngân hàng và tiền mặt thời gian thực',
      'Tự động phân loại dòng tiền theo khoản mục Thu - Chi chuyên sâu',
      'Báo cáo Lãi - Lỗ (P&L) và dòng tiền thuần (Cashflow) tự động',
      'Cảnh báo âm quỹ, đo lường tốc độ tiêu tiền (Burn rate) & Runway',
      'Theo dõi công nợ phải thu, phải trả và tự động nhắc hạn đến hạn',
      'Phân tích cấu trúc chi phí theo từng dự án và trung tâm chi phí'
    ]
  },
  'GS-004': {
    id: 'GS-004',
    code: 'GS-004',
    canonicalDir: 'GS-004-project',
    name: 'Quản Lý Dự Án, Khách Hàng CRM, Kanban/Gantt & RACI',
    version: 'v4.4 Commercial Pro',
    groupArchetype: 'Project & Task Management',
    sheetsCount: 7,
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    templatePreviewUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/template/preview',
    packagePath: 'delivery/packages/GS-004-project',
    features: [
      'Quản lý danh mục dự án, hợp đồng và khách hàng CRM đa kênh',
      'Giao việc và điều phối tiến độ đa chiều (Kanban, Gantt chart, RACI matrix)',
      'Tiến độ 100% tự động chuyển Chờ duyệt, bảo toàn nhân sự và mã dự án',
      'Upload đa file đính kèm trực tiếp (Word, Excel, PowerPoint, PDF, Ảnh)',
      'Phân quyền điều hành 4 cấp (Admin, Manager, Leader, Staff)',
      'Bot Zalo & Email tự động nhắc hạn deadline công việc hàng ngày'
    ]
  },
  'GS-005': {
    id: 'GS-005',
    code: 'GS-005',
    canonicalDir: 'GS-005-pos',
    name: 'Quản Lý Nhà Hàng, Cafe, POS Tính Giờ, VIP & Bếp KDS',
    version: 'v3.3 Commercial Pro',
    groupArchetype: 'Point of Sale & F&B',
    sheetsCount: 8,
    spreadsheetId: '1fnbPOS_V30_fRuCf_x6J_Jg-qcC1TBdS9vqYlmLUVSZe0',
    templatePreviewUrl: 'https://docs.google.com/spreadsheets/d/1fnbPOS_V30_fRuCf_x6J_Jg-qcC1TBdS9vqYlmLUVSZe0/template/preview',
    packagePath: 'delivery/packages/GS-005-pos',
    features: [
      'Quản lý sơ đồ bàn phòng, khu vực động theo thời gian thực',
      'Order gọi món tức thời, đồng bộ phiếu chế biến sang màn hình bếp KDS',
      'Tính giờ dịch vụ tự động cho phòng hát Karaoke, bàn Bida theo phút',
      'Phân hạng hội viên VIP, tích điểm đổi quà và chiết khấu bậc thang',
      'Tích hợp mã VietQR động tự sinh kèm số tiền và nội dung thanh toán',
      'Chế độ toàn màn hình (Full Screen), xuất và in hóa đơn A4 / K80 chuyên nghiệp'
    ]
  }
};

export function getArchetype(id: string): ArchetypeDefinition | undefined {
  return CORE_ARCHETYPES[id];
}
