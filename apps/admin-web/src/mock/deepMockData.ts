// ============================================================================
// HỆ THỐNG DỮ LIỆU NGHIỆP VỤ SÂU (DEEP MOCK DATA)
// Lấy cảm hứng từ 229 sản phẩm GSheets.vn: Kho đa kho, Thu chi Runway, Kanban, POS VietQR, CRM
// ============================================================================

// ----------------------------------------------------------------------------
// 1. SÀN TEMPLATE GSHEETS (MARKETPLACE - 229 SẢN PHẨM PHÂN LOẠI)
// ----------------------------------------------------------------------------
export interface GSheetTemplate {
  id: string;
  code: string;
  name: string;
  category: 'Kho & Bán lẻ' | 'Tài chính & Thu chi' | 'Quản lý Công việc' | 'F&B & Nhà hàng' | 'CRM & Bán hàng' | 'Nhân sự & Tiền lương' | 'Sản xuất';
  tag: string;
  price_vnd: number;
  original_price_vnd: number;
  rating: number;
  downloads: number;
  description: string;
  features: string[];
  appTarget?: 'warehouse' | 'finance' | 'tasks' | 'pos' | 'crm';
  isFeatured?: boolean;
}

export const mockTemplates: GSheetTemplate[] = [
  {
    id: 'TPL-001',
    code: 'GS-KHO-V3',
    name: 'Hệ thống Quản lý Kho Đa Kho v3.0 (Tự động tính Tồn - Nhập - Xuất)',
    category: 'Kho & Bán lẻ',
    tag: 'Bán chạy nhất',
    price_vnd: 450000,
    original_price_vnd: 650000,
    rating: 4.9,
    downloads: 1420,
    description: 'Quản lý tồn kho theo thời gian thực tại nhiều kho (Hà Nội, Sài Gòn, Kho Tổng), tự động cảnh báo mức tối thiểu/tối đa, in phiếu nhập xuất PDF.',
    features: ['Quản lý 15+ SKU chi tiết', 'Tồn đa kho thời gian thực', 'In phiếu nhập/xuất kho', 'Cảnh báo tồn an toàn'],
    appTarget: 'warehouse',
    isFeatured: true,
  },
  {
    id: 'TPL-002',
    code: 'GS-TC-V4',
    name: 'Bảng Quản lý Dòng Tiền & Startup Burn Rate Runway v4.1',
    category: 'Tài chính & Thu chi',
    tag: 'Khuyên dùng',
    price_vnd: 390000,
    original_price_vnd: 550000,
    rating: 4.9,
    downloads: 1150,
    description: 'Kiểm soát dòng tiền doanh nghiệp, tính toán chính xác Burn rate hàng tháng, số tháng Runway còn lại và phân tích lãi lỗ theo từng dự án.',
    features: ['Theo dõi đa tài khoản ngân hàng', 'Bảng tính Runway & Burn rate', 'Phân bổ chi phí theo dự án', 'Báo cáo lãi lỗ tức thì'],
    appTarget: 'finance',
    isFeatured: true,
  },
  {
    id: 'TPL-003',
    code: 'GS-TASK-V5',
    name: 'Quản lý Tiến độ Công việc & Dự án Kanban/Gantt v5.0',
    category: 'Quản lý Công việc',
    tag: 'Phổ biến',
    price_vnd: 350000,
    original_price_vnd: 500000,
    rating: 4.8,
    downloads: 980,
    description: 'Chuyển đổi linh hoạt giữa giao diện Kanban Board 4 cột và bảng dữ liệu chi tiết, theo dõi checklist công việc con và hạn chót theo nhân sự.',
    features: ['Kanban Board tương tác', 'Xem dạng Bảng chi tiết', 'Checklist việc con', 'Theo dõi deadline & độ ưu tiên'],
    appTarget: 'tasks',
    isFeatured: true,
  },
  {
    id: 'TPL-004',
    code: 'GS-POS-V3',
    name: 'Phần mềm POS Cafe / Nhà hàng Tích hợp VietQR Động v3.0',
    category: 'F&B & Nhà hàng',
    tag: 'Hot trend',
    price_vnd: 490000,
    original_price_vnd: 700000,
    rating: 5.0,
    downloads: 1650,
    description: 'Quản lý sơ đồ 12 bàn, gọi món trực quan, tự động tính tổng tiền và tạo mã VietQR thanh toán chuẩn ngân hàng kèm in hóa đơn.',
    features: ['Sơ đồ bàn động', 'Thực đơn món đa dạng', 'Tạo mã VietQR tự động', 'In hóa đơn tạm tính'],
    appTarget: 'pos',
    isFeatured: true,
  },
  {
    id: 'TPL-005',
    code: 'GS-CRM-V7',
    name: 'Hệ thống CRM Quản lý Phễu Bán Hàng & Chăm sóc Khách hàng v7.1',
    category: 'CRM & Bán hàng',
    tag: 'Đánh giá cao',
    price_vnd: 420000,
    original_price_vnd: 600000,
    rating: 4.8,
    downloads: 870,
    description: 'Quản lý hồ sơ khách hàng, pipeline bán hàng 5 giai đoạn, nhật ký cuộc gọi và hệ thống cảnh báo lịch hẹn gọi lại.',
    features: ['Pipeline bán hàng 5 giai đoạn', 'Lịch sử chăm sóc & gọi điện', 'Cảnh báo hẹn gọi lại', 'Dự báo doanh số chốt'],
    appTarget: 'crm',
    isFeatured: true,
  },
  {
    id: 'TPL-006',
    code: 'GS-HR-V2',
    name: 'Bảng Chấm Công & Tính Lương Tự Động Theo KPI v2.5',
    category: 'Nhân sự & Tiền lương',
    tag: 'Mới cập nhật',
    price_vnd: 290000,
    original_price_vnd: 450000,
    rating: 4.7,
    downloads: 720,
    description: 'Tự động tổng hợp ngày công, tính lương cơ bản, phụ cấp, thưởng KPI và xuất phiếu lương cho từng nhân sự.',
    features: ['Chấm công theo ca', 'Tính bảo hiểm & thuế TNCN', 'Tự động xuất phiếu lương cá nhân'],
  },
  {
    id: 'TPL-007',
    code: 'GS-SX-V3',
    name: 'Kế Hoạch Sản Xuất & Định Mức Nguyên Vật Liệu (BOM) v3.2',
    category: 'Sản xuất',
    tag: 'Chuyên sâu',
    price_vnd: 550000,
    original_price_vnd: 800000,
    rating: 4.9,
    downloads: 610,
    description: 'Lập lệnh sản xuất, tính toán nhu cầu nguyên vật liệu từ công thức định mức BOM, kiểm soát tiến độ từng công đoạn.',
    features: ['Cây định mức BOM đa tầng', 'Kế hoạch theo đơn đặt hàng', 'Cảnh báo thiếu hụt vật tư'],
  },
  {
    id: 'TPL-008',
    code: 'GS-RETAIL-V1',
    name: 'Sổ Bán Hàng Tạp Hóa & Quản lý Công Nợ Khách Hàng v1.8',
    category: 'Kho & Bán lẻ',
    tag: 'Dễ dùng',
    price_vnd: 199000,
    original_price_vnd: 350000,
    rating: 4.6,
    downloads: 1300,
    description: 'Thích hợp cho cửa hàng vừa và nhỏ: ghi sổ bán hàng mỗi ngày, theo dõi công nợ phải thu, in phiếu thu tiền nhanh.',
    features: ['Sổ bán hàng theo ngày', 'Sổ nợ chi tiết từng khách', 'Nhắc nợ tự động qua Zalo/SMS'],
  },
];

// ----------------------------------------------------------------------------
// 2. KHO HÀNG ĐA KHO (WAREHOUSE DATA - 15+ SKU, 3 KHO)
// ----------------------------------------------------------------------------
export interface WarehouseStockItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  price_cost_vnd: number;
  price_sell_vnd: number;
  stock_tong: number;
  stock_hanoi: number;
  stock_saigon: number;
  min_limit: number;
  max_limit: number;
}

export interface StockMovementLog {
  id: string;
  code: string;
  date: string;
  type: 'Nhập kho' | 'Xuất kho' | 'Điều chuyển';
  sku: string;
  product_name: string;
  quantity: number;
  from_warehouse: string;
  to_warehouse: string;
  performer: string;
  note: string;
}

export const initialWarehouseItems: WarehouseStockItem[] = [
  { id: '1', sku: 'SKU-001', name: 'Điện thoại iPhone 16 Pro Max 256GB', category: 'Thiết bị di động', unit: 'Cái', price_cost_vnd: 28000000, price_sell_vnd: 32500000, stock_tong: 25, stock_hanoi: 10, stock_saigon: 15, min_limit: 10, max_limit: 60 },
  { id: '2', sku: 'SKU-002', name: 'Máy tính bảng Samsung Galaxy Tab S9', category: 'Thiết bị di động', unit: 'Cái', price_cost_vnd: 15000000, price_sell_vnd: 18200000, stock_tong: 42, stock_hanoi: 20, stock_saigon: 22, min_limit: 15, max_limit: 80 },
  { id: '3', sku: 'SKU-003', name: 'Màn hình Dell UltraSharp 27 inch 4K (U2723QE)', category: 'Màn hình', unit: 'Cái', price_cost_vnd: 11500000, price_sell_vnd: 13900000, stock_tong: 18, stock_hanoi: 8, stock_saigon: 10, min_limit: 10, max_limit: 50 },
  { id: '4', sku: 'SKU-004', name: 'Bàn phím cơ Logitech MX Mechanical Wireless', category: 'Phụ kiện', unit: 'Cái', price_cost_vnd: 2800000, price_sell_vnd: 3590000, stock_tong: 65, stock_hanoi: 30, stock_saigon: 35, min_limit: 20, max_limit: 100 },
  { id: '5', sku: 'SKU-005', name: 'Chuột Logitech MX Master 3S Dark Grey', category: 'Phụ kiện', unit: 'Cái', price_cost_vnd: 1850000, price_sell_vnd: 2450000, stock_tong: 8, stock_hanoi: 3, stock_saigon: 5, min_limit: 15, max_limit: 70 },
  { id: '6', sku: 'SKU-006', name: 'Tai nghe chống ồn Sony WH-1000XM5 Black', category: 'Âm thanh', unit: 'Cái', price_cost_vnd: 6500000, price_sell_vnd: 7990000, stock_tong: 30, stock_hanoi: 12, stock_saigon: 18, min_limit: 10, max_limit: 50 },
  { id: '7', sku: 'SKU-007', name: 'Ổ cứng di động SSD Kingston XS1000 1TB', category: 'Lưu trữ', unit: 'Cái', price_cost_vnd: 1650000, price_sell_vnd: 2190000, stock_tong: 85, stock_hanoi: 40, stock_saigon: 45, min_limit: 20, max_limit: 120 },
  { id: '8', sku: 'SKU-008', name: 'Cáp sạc Type-C to Lightning Anker 0.9m', category: 'Phụ kiện', unit: 'Sợi', price_cost_vnd: 180000, price_sell_vnd: 290000, stock_tong: 140, stock_hanoi: 60, stock_saigon: 80, min_limit: 50, max_limit: 200 },
  { id: '9', sku: 'SKU-009', name: 'Củ sạc Anker GaNPrime 65W 3 cổng', category: 'Phụ kiện', unit: 'Cái', price_cost_vnd: 680000, price_sell_vnd: 950000, stock_tong: 52, stock_hanoi: 22, stock_saigon: 30, min_limit: 15, max_limit: 90 },
  { id: '10', sku: 'SKU-010', name: 'Ghế công thái học Ergonomic Sihoo M57', category: 'Nội thất', unit: 'Chiếc', price_cost_vnd: 3200000, price_sell_vnd: 4150000, stock_tong: 12, stock_hanoi: 5, stock_saigon: 7, min_limit: 8, max_limit: 30 },
  { id: '11', sku: 'SKU-011', name: 'Bàn nâng hạ tự động thông minh 1m4 x 70cm', category: 'Nội thất', unit: 'Bộ', price_cost_vnd: 4500000, price_sell_vnd: 5890000, stock_tong: 6, stock_hanoi: 2, stock_saigon: 4, min_limit: 5, max_limit: 25 },
  { id: '12', sku: 'SKU-012', name: 'Webcam Logitech Brio 4K Ultra HD', category: 'Phụ kiện', unit: 'Cái', price_cost_vnd: 3600000, price_sell_vnd: 4690000, stock_tong: 14, stock_hanoi: 6, stock_saigon: 8, min_limit: 8, max_limit: 35 },
  { id: '13', sku: 'SKU-013', name: 'Micro thu âm Podcast Shure MV7 USB/XLR', category: 'Âm thanh', unit: 'Cái', price_cost_vnd: 5800000, price_sell_vnd: 6990000, stock_tong: 9, stock_hanoi: 4, stock_saigon: 5, min_limit: 5, max_limit: 25 },
  { id: '14', sku: 'SKU-014', name: 'Đèn treo màn hình chống mỏi mắt Baseus Pro', category: 'Phụ kiện', unit: 'Cái', price_cost_vnd: 380000, price_sell_vnd: 550000, stock_tong: 75, stock_hanoi: 35, stock_saigon: 40, min_limit: 20, max_limit: 100 },
  { id: '15', sku: 'SKU-015', name: 'Máy chiếu mini thông minh XGIMI Halo+ 1080P', category: 'Thiết bị di động', unit: 'Cái', price_cost_vnd: 14500000, price_sell_vnd: 17900000, stock_tong: 7, stock_hanoi: 3, stock_saigon: 4, min_limit: 5, max_limit: 20 },
  { id: '16', sku: 'SKU-016', name: 'Router Wifi 6 Mesh ASUS RT-AX53U', category: 'Mạng', unit: 'Cái', price_cost_vnd: 1100000, price_sell_vnd: 1490000, stock_tong: 38, stock_hanoi: 18, stock_saigon: 20, min_limit: 15, max_limit: 60 },
];

export const initialMovementLogs: StockMovementLog[] = [
  { id: 'M-01', code: 'PN-2026-001', date: '2026-10-01 09:30', type: 'Nhập kho', sku: 'SKU-001', product_name: 'Điện thoại iPhone 16 Pro Max 256GB', quantity: 15, from_warehouse: 'Nhà cung cấp Apple VN', to_warehouse: 'Kho Hà Nội', performer: 'Nguyễn Văn Long', note: 'Nhập hàng đợt 1 tháng 10' },
  { id: 'M-02', code: 'PX-2026-002', date: '2026-10-02 14:15', type: 'Xuất kho', sku: 'SKU-003', product_name: 'Màn hình Dell UltraSharp 27 inch 4K', quantity: 4, from_warehouse: 'Kho Sài Gòn', to_warehouse: 'Công ty CP Công Nghệ Next', performer: 'Lê Thu Trang', note: 'Xuất giao dự án văn phòng' },
  { id: 'M-03', code: 'DC-2026-003', date: '2026-10-03 11:00', type: 'Điều chuyển', sku: 'SKU-004', product_name: 'Bàn phím cơ Logitech MX Mechanical', quantity: 10, from_warehouse: 'Kho Hà Nội', to_warehouse: 'Kho Sài Gòn', performer: 'Trần Hải Đăng', note: 'Điều chuyển cân đối kho miền Nam' },
  { id: 'M-04', code: 'PX-2026-004', date: '2026-10-04 16:40', type: 'Xuất kho', sku: 'SKU-005', product_name: 'Chuột Logitech MX Master 3S Dark Grey', quantity: 6, from_warehouse: 'Kho Hà Nội', to_warehouse: 'Khách lẻ showroom', performer: 'Nguyễn Văn Long', note: 'Xuất bán lẻ' },
  { id: 'M-05', code: 'PN-2026-005', date: '2026-10-05 10:20', type: 'Nhập kho', sku: 'SKU-008', product_name: 'Cáp sạc Type-C to Lightning Anker 0.9m', quantity: 50, from_warehouse: 'Nhà phân phối Anker', to_warehouse: 'Kho Sài Gòn', performer: 'Lê Thu Trang', note: 'Nhập bổ sung tồn kho an toàn' },
];

// ----------------------------------------------------------------------------
// 3. THU CHI DOANH NGHIỆP & STARTUP BURN RATE RUNWAY v4.1
// ----------------------------------------------------------------------------
export interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  balance_vnd: number;
}

export interface FinanceTransaction {
  id: string;
  code: string;
  date: string;
  type: 'Thu' | 'Chi';
  category: string;
  amount_vnd: number;
  account: string;
  project: string;
  performer: string;
  note: string;
}

export interface ProjectProfitLoss {
  id: string;
  name: string;
  revenue_vnd: number;
  cost_vnd: number;
  profit_vnd: number;
  profit_margin_pct: number;
}

export const initialBankAccounts: BankAccount[] = [
  { id: 'ACC-1', bank_name: 'Vietcombank Doanh Nghiệp', account_number: '0071001234567', account_holder: 'CTY CP G-SHEETS VIETNAM', balance_vnd: 540000000 },
  { id: 'ACC-2', bank_name: 'Techcombank Chi Nhánh Đống Đa', account_number: '19036789101112', account_holder: 'CTY CP G-SHEETS VIETNAM', balance_vnd: 295000000 },
  { id: 'ACC-3', bank_name: 'Quỹ Tiền Mặt Văn Phòng', account_number: 'CASH-HN', account_holder: 'Thủ quỹ Mai Phương', balance_vnd: 55000000 },
];

export const initialFinanceTransactions: FinanceTransaction[] = [
  { id: 'TX-01', code: 'THU-2026-01', date: '2026-10-01', type: 'Thu', category: 'Doanh thu Hợp đồng', amount_vnd: 185000000, account: 'Vietcombank Doanh Nghiệp', project: 'Dự án ERP Doanh Nghiệp', performer: 'Nguyễn Kế Toán', note: 'Thanh toán đợt 2 triển khai hệ thống' },
  { id: 'TX-02', code: 'CHI-2026-02', date: '2026-10-02', type: 'Chi', category: 'Lương nhân sự', amount_vnd: 52000000, account: 'Vietcombank Doanh Nghiệp', project: 'Vận hành chung', performer: 'Mai Thủ Quỹ', note: 'Chi trả lương đợt 1 cho team dev' },
  { id: 'TX-03', code: 'CHI-2026-03', date: '2026-10-03', type: 'Chi', category: 'Hạ tầng Cloud & Server', amount_vnd: 14500000, account: 'Techcombank Chi Nhánh Đống Đa', project: 'Dự án E-commerce', performer: 'Nguyễn Kế Toán', note: 'Thanh toán AWS Cloud & Supabase Pro' },
  { id: 'TX-04', code: 'THU-2026-04', date: '2026-10-04', type: 'Thu', category: 'Bán bản quyền Template', amount_vnd: 68500000, account: 'Techcombank Chi Nhánh Đống Đa', project: 'Sàn GSheets Marketplace', performer: 'Bùi Sales Lead', note: 'Doanh thu bán mẫu trực tuyến tuần 40' },
  { id: 'TX-05', code: 'CHI-2026-05', date: '2026-10-04', type: 'Chi', category: 'Chi phí Marketing & Ads', amount_vnd: 18000000, account: 'Vietcombank Doanh Nghiệp', project: 'Sàn GSheets Marketplace', performer: 'Trần Marketing', note: 'Chạy chiến dịch Google Search & Meta Ads' },
  { id: 'TX-06', code: 'CHI-2026-06', date: '2026-10-05', type: 'Chi', category: 'Tiền thuê văn phòng', amount_vnd: 25000000, account: 'Techcombank Chi Nhánh Đống Đa', project: 'Vận hành chung', performer: 'Mai Thủ Quỹ', note: 'Tiền thuê tòa nhà văn phòng tháng 10' },
];

export const initialProjectsPL: ProjectProfitLoss[] = [
  { id: 'PRJ-1', name: 'Dự án ERP Doanh Nghiệp', revenue_vnd: 420000000, cost_vnd: 210000000, profit_vnd: 210000000, profit_margin_pct: 50.0 },
  { id: 'PRJ-2', name: 'Sàn GSheets Marketplace', revenue_vnd: 280000000, cost_vnd: 95000000, profit_vnd: 185000000, profit_margin_pct: 66.07 },
  { id: 'PRJ-3', name: 'Dự án App Mobile F&B', revenue_vnd: 160000000, cost_vnd: 115000000, profit_vnd: 45000000, profit_margin_pct: 28.13 },
];

// ----------------------------------------------------------------------------
// 4. QUẢN LÝ CÔNG VIỆC KANBAN & GANTT v5.0
// ----------------------------------------------------------------------------
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'backlog' | 'doing' | 'review' | 'done';
  priority: 'Khẩn cấp' | 'Cao' | 'Trung bình' | 'Thấp';
  assignee: string;
  assignee_avatar: string;
  due_date: string;
  progress_pct: number;
  subtasks: SubTask[];
}

export const initialTasks: TaskItem[] = [
  {
    id: 'TASK-1',
    code: 'TSK-101',
    title: 'Thiết kế giao diện POS Cafe tích hợp VietQR',
    description: 'Xây dựng layout chọn bàn, menu món và modal hiển thị mã QR thanh toán.',
    status: 'done',
    priority: 'Khẩn cấp',
    assignee: 'Đặng Tuấn Anh (UI/UX)',
    assignee_avatar: '👨‍🎨',
    due_date: '2026-10-04',
    progress_pct: 100,
    subtasks: [
      { id: 'st1', title: 'Phác thảo wireframe sơ đồ 12 bàn', completed: true },
      { id: 'st2', title: 'Thiết kế card món ăn & giỏ hàng', completed: true },
      { id: 'st3', title: 'Tạo component VietQR pop-up', completed: true },
    ],
  },
  {
    id: 'TASK-2',
    code: 'TSK-102',
    title: 'Xây dựng module tính Burn Rate & Runway tài chính',
    description: 'Tự động tính số tháng runway dựa trên quỹ khả dụng chia cho chi phí trung bình.',
    status: 'doing',
    priority: 'Cao',
    assignee: 'Lê Hoàng Nam (Fullstack)',
    assignee_avatar: '👨‍💻',
    due_date: '2026-10-07',
    progress_pct: 65,
    subtasks: [
      { id: 'st4', title: 'Định nghĩa schema bảng ngân hàng', completed: true },
      { id: 'st5', title: 'Viết công thức tính Burn Rate trung bình', completed: true },
      { id: 'st6', title: 'Vẽ biểu đồ dự toán dòng tiền', completed: false },
    ],
  },
  {
    id: 'TASK-3',
    code: 'TSK-103',
    title: 'Tối ưu hóa tốc độ tải bảng tồn kho 15+ SKU',
    description: 'Chuyển sang cơ chế render ảo và phân trang nhanh cho danh mục sản phẩm.',
    status: 'review',
    priority: 'Trung bình',
    assignee: 'Phạm Minh Trí (Frontend)',
    assignee_avatar: '⚡',
    due_date: '2026-10-06',
    progress_pct: 90,
    subtasks: [
      { id: 'st7', title: 'Benchmark thời gian lọc theo kho', completed: true },
      { id: 'st8', title: 'Kiểm tra in phiếu nhập xuất PDF', completed: true },
    ],
  },
  {
    id: 'TASK-4',
    code: 'TSK-104',
    title: 'Soạn thảo tài liệu hướng dẫn sử dụng Sàn Template',
    description: 'Viết tài liệu chi tiết hướng dẫn khách hàng cách kích hoạt và sao chép mẫu về Drive.',
    status: 'backlog',
    priority: 'Thấp',
    assignee: 'Trần Thu Hà (Content)',
    assignee_avatar: '✍️',
    due_date: '2026-10-10',
    progress_pct: 10,
    subtasks: [
      { id: 'st9', title: 'Viết kịch bản video demo', completed: false },
      { id: 'st10', title: 'Chụp ảnh màn hình các tính năng chính', completed: false },
    ],
  },
  {
    id: 'TASK-5',
    code: 'TSK-105',
    title: 'Tích hợp bộ lọc phễu CRM và hẹn lịch gọi lại',
    description: 'Tự động đánh dấu đỏ các khách hàng quá hạn 3 ngày chưa liên hệ lại.',
    status: 'doing',
    priority: 'Cao',
    assignee: 'Lê Hoàng Nam (Fullstack)',
    assignee_avatar: '👨‍💻',
    due_date: '2026-10-08',
    progress_pct: 45,
    subtasks: [
      { id: 'st11', title: 'Tạo state lưu lịch sử cuộc gọi', completed: true },
      { id: 'st12', title: 'Gắn badge cảnh báo quá hạn', completed: false },
    ],
  },
];

// ----------------------------------------------------------------------------
// 5. F&B POS CAFE / NHÀ HÀNG & VIETQR v3.0
// ----------------------------------------------------------------------------
export interface MenuItem {
  id: string;
  name: string;
  category: 'Cà phê' | 'Trà & Trà sữa' | 'Bánh & Tráng miệng' | 'Ăn nhẹ';
  price_vnd: number;
  icon: string;
}

export interface OrderDetailItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  price_vnd: number;
}

export interface TableItem {
  id: number;
  name: string;
  status: 'Trống' | 'Đang phục vụ';
  guest_count: number;
  check_in_time?: string;
  current_order: OrderDetailItem[];
}

export const initialMenuItems: MenuItem[] = [
  { id: 'MN-01', name: 'Cà phê Phin Sữa Đá Đậm Đà', category: 'Cà phê', price_vnd: 29000, icon: '☕' },
  { id: 'MN-02', name: 'Cà phê Đen Đá Nguyên Chất', category: 'Cà phê', price_vnd: 25000, icon: '☕' },
  { id: 'MN-03', name: 'Bạc Xỉu Sữa Tươi 3 Tầng', category: 'Cà phê', price_vnd: 35000, icon: '🥛' },
  { id: 'MN-04', name: 'Cold Brew Cam Sả Thanh Mát', category: 'Cà phê', price_vnd: 45000, icon: '🧊' },
  { id: 'MN-05', name: 'Trà Đào Cam Sả Tươi', category: 'Trà & Trà sữa', price_vnd: 42000, icon: '🍑' },
  { id: 'MN-06', name: 'Trà Vải Hoa Hồng Nhiệt Đới', category: 'Trà & Trà sữa', price_vnd: 45000, icon: '🌹' },
  { id: 'MN-07', name: 'Trà Sữa Oolong Nướng Trân Châu', category: 'Trà & Trà sữa', price_vnd: 48000, icon: '🧋' },
  { id: 'MN-08', name: 'Matcha Latte Nhật Bản', category: 'Trà & Trà sữa', price_vnd: 49000, icon: '🍵' },
  { id: 'MN-09', name: 'Bánh Croissant Bơ Pháp', category: 'Bánh & Tráng miệng', price_vnd: 32000, icon: '🥐' },
  { id: 'MN-10', name: 'Bánh Tiramisu Ý Cacao', category: 'Bánh & Tráng miệng', price_vnd: 45000, icon: '🍰' },
  { id: 'MN-11', name: 'Mousse Chanh Leo Phô Mai', category: 'Bánh & Tráng miệng', price_vnd: 38000, icon: '🧀' },
  { id: 'MN-12', name: 'Khoai Tây Chiên Lắc Phô Mai', category: 'Ăn nhẹ', price_vnd: 35000, icon: '🍟' },
  { id: 'MN-13', name: 'Bánh Mì Kẹp Thịt Nướng Đặc Biệt', category: 'Ăn nhẹ', price_vnd: 39000, icon: '🥖' },
  { id: 'MN-14', name: 'Xúc Xích Đức Nướng Phô Mai', category: 'Ăn nhẹ', price_vnd: 32000, icon: '🌭' },
];

export const initialTables: TableItem[] = [
  { id: 1, name: 'Bàn 01 (Cửa sổ)', status: 'Đang phục vụ', guest_count: 2, check_in_time: '10:15', current_order: [{ menu_item_id: 'MN-01', name: 'Cà phê Phin Sữa Đá Đậm Đà', quantity: 2, price_vnd: 29000 }, { menu_item_id: 'MN-09', name: 'Bánh Croissant Bơ Pháp', quantity: 1, price_vnd: 32000 }] },
  { id: 2, name: 'Bàn 02 (Trong nhà)', status: 'Trống', guest_count: 0, current_order: [] },
  { id: 3, name: 'Bàn 03 (Sofa)', status: 'Đang phục vụ', guest_count: 4, check_in_time: '09:40', current_order: [{ menu_item_id: 'MN-07', name: 'Trà Sữa Oolong Nướng Trân Châu', quantity: 3, price_vnd: 48000 }, { menu_item_id: 'MN-12', name: 'Khoai Tây Chiên Lắc Phô Mai', quantity: 2, price_vnd: 35000 }] },
  { id: 4, name: 'Bàn 04 (Trong nhà)', status: 'Trống', guest_count: 0, current_order: [] },
  { id: 5, name: 'Bàn 05 (Ban công)', status: 'Đang phục vụ', guest_count: 1, check_in_time: '10:30', current_order: [{ menu_item_id: 'MN-04', name: 'Cold Brew Cam Sả Thanh Mát', quantity: 1, price_vnd: 45000 }] },
  { id: 6, name: 'Bàn 06 (Trong nhà)', status: 'Trống', guest_count: 0, current_order: [] },
  { id: 7, name: 'Bàn 07 (Bàn tròn)', status: 'Trống', guest_count: 0, current_order: [] },
  { id: 8, name: 'Bàn 08 (Trong nhà)', status: 'Trống', guest_count: 0, current_order: [] },
  { id: 9, name: 'Bàn 09 (Sofa dài)', status: 'Trống', guest_count: 0, current_order: [] },
  { id: 10, name: 'Bàn 10 (Ban công)', status: 'Trống', guest_count: 0, current_order: [] },
  { id: 11, name: 'Bàn 11 (Phòng họp nhỏ)', status: 'Trống', guest_count: 0, current_order: [] },
  { id: 12, name: 'Bàn 12 (Phòng VIP)', status: 'Trống', guest_count: 0, current_order: [] },
];

// ----------------------------------------------------------------------------
// 6. CRM KHÁCH HÀNG & BÁN HÀNG v7.1
// ----------------------------------------------------------------------------
export interface CustomerDeal {
  id: string;
  code: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  deal_value_vnd: number;
  stage: 'Tiềm năng' | 'Đã liên hệ' | 'Đề xuất giải pháp' | 'Đàm phán' | 'Chốt thành công';
  assigned_to: string;
  last_contact_date: string;
  next_follow_up_date: string;
  is_overdue: boolean;
  notes: string;
}

export const initialCrmDeals: CustomerDeal[] = [
  { id: 'CRM-01', code: 'DL-2026-001', company_name: 'Tập đoàn Đầu tư & Công nghệ Alpha', contact_person: 'Nguyễn Văn Minh (GĐ Kỹ thuật)', phone: '0912 345 678', email: 'minh.nguyen@alphagroup.vn', deal_value_vnd: 350000000, stage: 'Đàm phán', assigned_to: 'Bùi Sales Lead', last_contact_date: '2026-10-02', next_follow_up_date: '2026-10-06', is_overdue: false, notes: 'Khách hàng quan tâm gói phần mềm quản lý kho đa điểm và POS' },
  { id: 'CRM-02', code: 'DL-2026-002', company_name: 'Chuỗi Nhà hàng Lẩu Bò Sài Gòn', contact_person: 'Trần Thu Thủy (Chủ chuỗi)', phone: '0988 765 432', email: 'thuytran@laubosaigon.com', deal_value_vnd: 120000000, stage: 'Chốt thành công', assigned_to: 'Lê Thu Trang', last_contact_date: '2026-10-04', next_follow_up_date: '2026-10-10', is_overdue: false, notes: 'Đã ký hợp đồng triển khai 5 chi nhánh POS VietQR' },
  { id: 'CRM-03', code: 'DL-2026-003', company_name: 'Công ty CP Phân phối Thiết bị Điện tử Sun', contact_person: 'Phạm Đức Cường (TP Mua hàng)', phone: '0903 112 233', email: 'cuong.pd@sunelec.vn', deal_value_vnd: 220000000, stage: 'Đề xuất giải pháp', assigned_to: 'Bùi Sales Lead', last_contact_date: '2026-09-28', next_follow_up_date: '2026-10-03', is_overdue: true, notes: 'Cần gọi lại xác nhận báo giá chiết khấu đơn hàng 100 license' },
  { id: 'CRM-04', code: 'DL-2026-004', company_name: 'Startup EdTech Học Dễ', contact_person: 'Vũ Hải Nam (Co-founder)', phone: '0977 445 566', email: 'nam.vu@hocde.ai', deal_value_vnd: 75000000, stage: 'Đã liên hệ', assigned_to: 'Lê Thu Trang', last_contact_date: '2026-10-03', next_follow_up_date: '2026-10-07', is_overdue: false, notes: 'Quan tâm bảng quản lý thu chi Startup Burn rate' },
  { id: 'CRM-05', code: 'DL-2026-005', company_name: 'Xưởng Sản Xuất Đồ Gỗ Mỹ Nghệ Hoàng Gia', contact_person: 'Hoàng Trọng Nghĩa (Chủ xưởng)', phone: '0945 998 877', email: 'nghia.hoang@hoanggiagroup.com', deal_value_vnd: 180000000, stage: 'Tiềm năng', assigned_to: 'Bùi Sales Lead', last_contact_date: '2026-10-05', next_follow_up_date: '2026-10-09', is_overdue: false, notes: 'Khách hàng để lại thông tin qua form Facebook Ads' },
];
