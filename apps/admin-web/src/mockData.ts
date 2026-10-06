export interface ProductKV01 {
  id: string;
  sku: string;
  name: string;
  stock: number;
  unit: string;
  min_qty: number;
  max_qty: number;
  status: 'Đủ tồn kho' | 'Sắp hết hàng' | 'Vượt tồn';
}

export interface OrderKD01 {
  id: string;
  code: string;
  customer: string;
  total_vnd: number;
  order_date: string;
  status: 'Hoàn thành' | 'Đang xử lý' | 'Đã hủy' | 'Chờ thanh toán';
}

export interface TransactionKT01 {
  id: string;
  code: string;
  type: 'Thu' | 'Chi';
  amount_vnd: number;
  performer: string;
  date: string;
  status: 'Đã hạch toán' | 'Chờ duyệt';
}

export interface WarehouseApprovalKV02 {
  id: string;
  code: string;
  movement_type: 'Nhập kho' | 'Xuất kho' | 'Chuyển kho';
  warehouse: string;
  creator: string;
  created_date: string;
  status: 'Đã duyệt' | 'Chờ duyệt' | 'Từ chối';
}

export interface ContentMK01 {
  id: string;
  code: string;
  title: string;
  channel: string;
  scheduled_at: string;
  status: 'Đã xuất bản' | 'Lên lịch' | 'Bản nháp';
  on_time: boolean;
}

export interface OpportunityKD02 {
  id: string;
  code: string;
  customer: string;
  expected_value_vnd: number;
  probability_pct: number;
  stage: 'Khám phá' | 'Đề xuất giải pháp' | 'Đàm phán' | 'Chốt thành công';
}

export interface SalesTargetKD03 {
  id: string;
  period: string;
  target_vnd: number;
  actual_vnd: number;
  progress_pct: number;
  status: 'Đạt chỉ tiêu' | 'Đang tiến hành' | 'Chậm tiến độ';
}

export interface ContractKD04 {
  id: string;
  code: string;
  customer: string;
  contract_value_vnd: number;
  expiry_date: string;
  status: 'Hiệu lực' | 'Sắp hết hạn' | 'Đã thanh lý';
  should_remind: boolean;
}

export interface CustomerCareKD05 {
  id: string;
  customer_id: string;
  customer_name: string;
  last_contact_date: string;
  satisfaction_score: number;
  status: 'Hài lòng' | 'Bình thường' | 'Cần chú ý';
}

export const mockProductsKV01: ProductKV01[] = [
  { id: '1', sku: 'SP-001', name: 'Máy tính bảng Galaxy Tab S9', stock: 45, unit: 'Cái', min_qty: 10, max_qty: 100, status: 'Đủ tồn kho' },
  { id: '2', sku: 'SP-002', name: 'Điện thoại iPhone 16 Pro Max 256GB', stock: 8, unit: 'Cái', min_qty: 10, max_qty: 50, status: 'Sắp hết hàng' },
  { id: '3', sku: 'SP-003', name: 'Bàn phím cơ không dây MX Mechanical', stock: 120, unit: 'Cái', min_qty: 20, max_qty: 100, status: 'Vượt tồn' },
  { id: '4', sku: 'SP-004', name: 'Màn hình Dell UltraSharp 27 inch 4K', stock: 24, unit: 'Cái', min_qty: 5, max_qty: 40, status: 'Đủ tồn kho' },
  { id: '5', sku: 'SP-005', name: 'Chuột Logitech MX Master 3S', stock: 4, unit: 'Cái', min_qty: 15, max_qty: 60, status: 'Sắp hết hàng' },
  { id: '6', sku: 'SP-006', name: 'Tai nghe Sony WH-1000XM5', stock: 30, unit: 'Cái', min_qty: 10, max_qty: 50, status: 'Đủ tồn kho' },
];

export const mockOrdersKD01: OrderKD01[] = [
  { id: '1', code: 'DH-2026-001', customer: 'Công ty Cổ phần Công nghệ Alpha', total_vnd: 85000000, order_date: '2026-10-01', status: 'Hoàn thành' },
  { id: '2', code: 'DH-2026-002', customer: 'Tập đoàn Đầu tư Bất động sản Hòa Phát', total_vnd: 142000000, order_date: '2026-10-02', status: 'Đang xử lý' },
  { id: '3', code: 'DH-2026-003', customer: 'Nguyễn Văn Minh (Cá nhân)', total_vnd: 27500000, order_date: '2026-10-03', status: 'Chờ thanh toán' },
  { id: '4', code: 'DH-2026-004', customer: 'Công ty TNHH Truyền thông Sáng Tạo', total_vnd: 56000000, order_date: '2026-10-04', status: 'Hoàn thành' },
  { id: '5', code: 'DH-2026-005', customer: 'Trần Thị Thu Thảo', total_vnd: 14500000, order_date: '2026-10-05', status: 'Đã hủy' },
];

export const mockTransactionsKT01: TransactionKT01[] = [
  { id: '1', code: 'GD-THU-001', type: 'Thu', amount_vnd: 85000000, performer: 'Kế toán Thu Trang', date: '2026-10-01', status: 'Đã hạch toán' },
  { id: '2', code: 'GD-CHI-002', type: 'Chi', amount_vnd: 25000000, performer: 'Kế toán Hùng Dũng', date: '2026-10-02', status: 'Đã hạch toán' },
  { id: '3', code: 'GD-THU-003', type: 'Thu', amount_vnd: 56000000, performer: 'Kế toán Thu Trang', date: '2026-10-04', status: 'Đã hạch toán' },
  { id: '4', code: 'GD-CHI-004', type: 'Chi', amount_vnd: 18500000, performer: 'Kế toán Hùng Dũng', date: '2026-10-05', status: 'Chờ duyệt' },
];

export const mockWarehouseApprovalsKV02: WarehouseApprovalKV02[] = [
  { id: '1', code: 'PK-NK-001', movement_type: 'Nhập kho', warehouse: 'Kho Tổng TP.HCM', creator: 'Thủ kho Hoàng Long', created_date: '2026-10-01', status: 'Đã duyệt' },
  { id: '2', code: 'PK-XK-002', movement_type: 'Xuất kho', warehouse: 'Kho Phân Phối Hà Nội', creator: 'Thủ kho Quang Hải', created_date: '2026-10-02', status: 'Đã duyệt' },
  { id: '3', code: 'PK-CK-003', movement_type: 'Chuyển kho', warehouse: 'Kho HCM -> Kho Đà Nẵng', creator: 'Thủ kho Hoàng Long', created_date: '2026-10-04', status: 'Chờ duyệt' },
  { id: '4', code: 'PK-XK-004', movement_type: 'Xuất kho', warehouse: 'Kho Tổng TP.HCM', creator: 'Thủ kho Văn Toàn', created_date: '2026-10-05', status: 'Từ chối' },
];

export const mockContentsMK01: ContentMK01[] = [
  { id: '1', code: 'ND-POST-01', title: 'Thông báo ra mắt dòng sản phẩm Pro Max 2026', channel: 'Facebook Fanpage', scheduled_at: '2026-10-01 09:00', status: 'Đã xuất bản', on_time: true },
  { id: '2', code: 'ND-POST-02', title: 'Video unboxing Dell UltraSharp 4K chi tiết', channel: 'YouTube Channel', scheduled_at: '2026-10-03 20:00', status: 'Đã xuất bản', on_time: true },
  { id: '3', code: 'ND-POST-03', title: 'Chiến dịch khuyến mãi mùa tựu trường giảm 20%', channel: 'TikTok & Reels', scheduled_at: '2026-10-06 12:00', status: 'Lên lịch', on_time: true },
  { id: '4', code: 'ND-POST-04', title: 'Bản tin công nghệ tuần 40: Xu hướng AI trên thiết bị', channel: 'Website Blog', scheduled_at: '2026-10-07 15:00', status: 'Bản nháp', on_time: false },
];

export const mockOpportunitiesKD02: OpportunityKD02[] = [
  { id: '1', code: 'CH-2026-01', customer: 'Ngân hàng Thương mại Quốc Tế', expected_value_vnd: 350000000, probability_pct: 80, stage: 'Đàm phán' },
  { id: '2', code: 'CH-2026-02', customer: 'Trường Đại học Bách Khoa', expected_value_vnd: 180000000, probability_pct: 50, stage: 'Đề xuất giải pháp' },
  { id: '3', code: 'CH-2026-03', customer: 'Chuỗi Khách sạn Mường Thanh', expected_value_vnd: 520000000, probability_pct: 100, stage: 'Chốt thành công' },
  { id: '4', code: 'CH-2026-04', customer: 'Trung tâm Dữ liệu Viễn thông', expected_value_vnd: 220000000, probability_pct: 20, stage: 'Khám phá' },
];

export const mockSalesTargetsKD03: SalesTargetKD03[] = [
  { id: '1', period: 'Quý 1/2026', target_vnd: 1200000000, actual_vnd: 1350000000, progress_pct: 112.5, status: 'Đạt chỉ tiêu' },
  { id: '2', period: 'Quý 2/2026', target_vnd: 1500000000, actual_vnd: 1480000000, progress_pct: 98.67, status: 'Đang tiến hành' },
  { id: '3', period: 'Quý 3/2026', target_vnd: 1800000000, actual_vnd: 1820000000, progress_pct: 101.11, status: 'Đạt chỉ tiêu' },
  { id: '4', period: 'Quý 4/2026 (Hiện tại)', target_vnd: 2000000000, actual_vnd: 350000000, progress_pct: 17.5, status: 'Đang tiến hành' },
];

export const mockContractsKD04: ContractKD04[] = [
  { id: '1', code: 'HD-DV-001', customer: 'Công ty Cổ phần Alpha', contract_value_vnd: 500000000, expiry_date: '2026-12-31', status: 'Hiệu lực', should_remind: false },
  { id: '2', code: 'HD-BT-002', customer: 'Tập đoàn Hòa Phát', contract_value_vnd: 240000000, expiry_date: '2026-10-20', status: 'Sắp hết hạn', should_remind: true },
  { id: '3', code: 'HD-TL-003', customer: 'Công ty TNHH Sáng Tạo', contract_value_vnd: 180000000, expiry_date: '2026-09-30', status: 'Đã thanh lý', should_remind: false },
];

export const mockCustomerCareKD05: CustomerCareKD05[] = [
  { id: '1', customer_id: 'KH-001', customer_name: 'Alpha Corporation', last_contact_date: '2026-10-02', satisfaction_score: 9.5, status: 'Hài lòng' },
  { id: '2', customer_id: 'KH-002', customer_name: 'Tập đoàn Hòa Phát', last_contact_date: '2026-10-04', satisfaction_score: 8.0, status: 'Hài lòng' },
  { id: '3', customer_id: 'KH-003', customer_name: 'Nguyễn Văn Minh', last_contact_date: '2026-09-28', satisfaction_score: 6.5, status: 'Bình thường' },
  { id: '4', customer_id: 'KH-004', customer_name: 'Trần Thị Thu Thảo', last_contact_date: '2026-10-05', satisfaction_score: 4.0, status: 'Cần chú ý' },
];

