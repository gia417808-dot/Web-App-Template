import React, { useState, useMemo } from 'react';
import exactCatalogData from '../data/exactCatalog.json';

export interface ExactCatalogProduct {
  id: string;
  title: string;
  rawName: string;
  type: 'webapp' | 'gsheet';
  version: string;
  category: string;
  description: string;
  features: string[];
  price: number;
  originalPrice: number;
  appRoute: string;
  sheetUrl: string | null;
}

const catalog: ExactCatalogProduct[] = exactCatalogData as ExactCatalogProduct[];

export type AppDestination = 'equipment_erp' | 'warehouse' | 'finance' | 'tasks' | 'pos' | 'crm';

interface MarketplaceAppProps {
  onSelectApp: (app: AppDestination) => void;
}

// Phân loại chính xác 6 App nghiệp vụ theo yêu cầu
export function getAppForProduct(item: ExactCatalogProduct): AppDestination {
  const text = (item.title + ' ' + item.category + ' ' + item.description + ' ' + (item.appRoute || '')).toLowerCase();

  // 1. Nhóm Thiết bị, Mini-ERP
  if (
    text.includes('thiết bị') ||
    text.includes('mini-erp') ||
    text.includes('mini erp') ||
    text.includes('cho thuê thiết bị') ||
    item.appRoute === 'equipment' ||
    item.appRoute === 'erp'
  ) {
    return 'equipment_erp';
  }

  // 2. Nhóm Kho
  if (
    text.includes('kho') ||
    text.includes('nhập xuất tồn') ||
    text.includes('tồn kho') ||
    text.includes('thủ kho') ||
    text.includes('vận tải') ||
    text.includes('vận chuyển') ||
    item.appRoute === 'inventory' ||
    item.category === 'Quản lý Kho'
  ) {
    return 'warehouse';
  }

  // 3. Nhóm Thu chi, Tài chính, Ngân sách
  if (
    text.includes('thu chi') ||
    text.includes('tài chính') ||
    text.includes('ngân sách') ||
    text.includes('dòng tiền') ||
    text.includes('runway') ||
    text.includes('burn rate') ||
    text.includes('chi tiêu') ||
    text.includes('sổ quỹ') ||
    text.includes('phê duyệt chi') ||
    text.includes('tiền mặt') ||
    text.includes('công nợ') ||
    item.appRoute === 'cashflow' ||
    item.category === 'Tài chính - Thu chi'
  ) {
    return 'finance';
  }

  // 4. Nhóm Cafe, Nhà hàng, Quán ăn, F&B
  if (
    text.includes('nhà hàng') ||
    text.includes('cafe') ||
    text.includes('cà phê') ||
    text.includes('quán ăn') ||
    text.includes('f&b') ||
    text.includes('pos') ||
    text.includes('bàn ăn') ||
    text.includes('menu') ||
    item.appRoute === 'fnb' ||
    item.appRoute === 'restaurant' ||
    item.category === 'F&B & Nhà hàng'
  ) {
    return 'pos';
  }

  // 5. Nhóm Khách hàng, CRM, Bán hàng
  if (
    text.includes('khách hàng') ||
    text.includes('crm') ||
    text.includes('cskh') ||
    text.includes('bán hàng') ||
    text.includes('báo giá') ||
    text.includes('chăm sóc khách hàng') ||
    text.includes('sales') ||
    text.includes('pipeline') ||
    item.appRoute === 'crm' ||
    item.category === 'CRM & Khách hàng'
  ) {
    return 'crm';
  }

  // 6. Nhóm Công việc, Dự án, Task, Gantt (và quản trị chung)
  return 'tasks';
}

// Dữ liệu mô phỏng Google Sheets chân thực theo từng nhóm sản phẩm
function getSheetPreviewData(item: ExactCatalogProduct) {
  const text = (item.title + ' ' + item.category + ' ' + item.description).toLowerCase();

  if (text.includes('thu chi') || text.includes('tài chính') || text.includes('ngân sách') || text.includes('dòng tiền') || text.includes('runway') || text.includes('công nợ')) {
    return {
      formula: '=SUM(D2:D7) - SUM(E2:E7)',
      activeCell: 'F7',
      columns: [
        { letter: 'A', name: 'STT' },
        { letter: 'B', name: 'Ngày Ghi Nhận' },
        { letter: 'C', name: 'Khoản Mục Nghiệp Vụ' },
        { letter: 'D', name: 'Phân Loại Dòng Tiền' },
        { letter: 'E', name: 'Số Tiền Thu (₫)' },
        { letter: 'F', name: 'Số Tiền Chi (₫)' },
        { letter: 'G', name: 'Số Dư Lũy Kế (₫)' },
        { letter: 'H', name: 'Trạng Thái Đối Soát' },
      ],
      rows: [
        ['1', '01/08/2026', 'Doanh thu bán lẻ đợt 1', 'Dòng tiền kinh doanh', '45,000,000', '0', '125,000,000', '✓ Đã khớp sao kê'],
        ['2', '02/08/2026', 'Tiền thuê mặt bằng văn phòng', 'Chi phí cố định', '0', '18,000,000', '107,000,000', '✓ Đã duyệt chi'],
        ['3', '03/08/2026', 'Thanh toán hợp đồng dự án', 'Doanh thu dịch vụ', '68,000,000', '0', '175,000,000', '✓ Đã nhận tiền'],
        ['4', '04/08/2026', 'Chi phí chạy Ads Marketing', 'Chi phí biến đổi', '0', '12,500,000', '162,500,000', '✓ Hóa đơn VAT'],
        ['5', '05/08/2026', 'Chi lương nhân sự & KPI', 'Chi phí nhân sự', '0', '52,000,000', '110,500,000', '✓ Chuyển khoản MB'],
        ['6', '06/08/2026', 'Thu hồi công nợ đối tác', 'Dòng tiền kinh doanh', '35,000,000', '0', '145,500,000', '✓ Đã đối soát'],
      ],
    };
  }

  if (text.includes('kho') || text.includes('nhập xuất tồn') || text.includes('tồn kho') || text.includes('vận tải')) {
    return {
      formula: '=E3 + F3 - G3',
      activeCell: 'H3',
      columns: [
        { letter: 'A', name: 'STT' },
        { letter: 'B', name: 'Mã SKU' },
        { letter: 'C', name: 'Tên Sản Phẩm / Hàng Hóa' },
        { letter: 'D', name: 'ĐVT' },
        { letter: 'E', name: 'Tồn Đầu Kỳ' },
        { letter: 'F', name: 'Tổng Nhập' },
        { letter: 'G', name: 'Tổng Xuất' },
        { letter: 'H', name: 'Tồn Cuối Kỳ' },
        { letter: 'I', name: 'Cảnh Báo Min/Max' },
      ],
      rows: [
        ['1', 'SKU-IP15-PM', 'iPhone 15 Pro Max 256GB Natural Titanium', 'Chiếc', '40', '25', '30', '35', '✓ Đạt định mức'],
        ['2', 'SKU-MAC-M3P', 'MacBook Pro 14 M3 Pro 18GB/512GB Space Black', 'Chiếc', '15', '10', '8', '17', '✓ Đạt định mức'],
        ['3', 'SKU-AP-PRO2', 'Tai nghe AirPods Pro 2 MagSafe USB-C', 'Chiếc', '8', '50', '46', '12', '⚠️ Cảnh báo tồn thấp'],
        ['4', 'SKU-DELL-U27', 'Màn hình Dell UltraSharp 27 4K U2723QE', 'Chiếc', '20', '15', '12', '23', '✓ Đạt định mức'],
        ['5', 'SKU-KEY-MXM', 'Bàn phím cơ không dây Logitech MX Mechanical', 'Chiếc', '35', '20', '22', '33', '✓ Đạt định mức'],
        ['6', 'SKU-MOU-MX3S', 'Chuột không dây Logitech MX Master 3S', 'Chiếc', '5', '30', '28', '7', '⚠️ Cảnh báo tồn thấp'],
      ],
    };
  }

  if (text.includes('công việc') || text.includes('dự án') || text.includes('task') || text.includes('kanban') || text.includes('gantt') || text.includes('kpi')) {
    return {
      formula: '=COUNTIF(H2:H7, "Hoàn thành") / COUNTA(H2:H7)',
      activeCell: 'G4',
      columns: [
        { letter: 'A', name: 'STT' },
        { letter: 'B', name: 'Mã Task' },
        { letter: 'C', name: 'Nội Dung Công Việc / Hạng Mục' },
        { letter: 'D', name: 'Phụ Trách' },
        { letter: 'E', name: 'Bắt Đầu' },
        { letter: 'F', name: 'Hạn Chót' },
        { letter: 'G', name: 'Tiến Độ' },
        { letter: 'H', name: 'Trạng Thái' },
      ],
      rows: [
        ['1', 'TSK-01', 'Khảo sát yêu cầu & Đặc tả chức năng hệ thống', 'Nguyễn Minh Tuấn', '01/08/2026', '05/08/2026', '100%', '✓ Hoàn thành'],
        ['2', 'TSK-02', 'Thiết kế UI/UX Dashboard & Design System', 'Trần Thu Hà', '06/08/2026', '12/08/2026', '100%', '✓ Hoàn thành'],
        ['3', 'TSK-03', 'Lập trình Frontend React & Module Nghiệp vụ', 'Lê Hoàng Nam', '13/08/2026', '22/08/2026', '85%', '⚡ Đang xử lý'],
        ['4', 'TSK-04', 'Tích hợp thanh toán VietQR & Cổng nhận file', 'Phạm Văn Đức', '18/08/2026', '24/08/2026', '90%', '⚡ Đang xử lý'],
        ['5', 'TSK-05', 'Kiểm thử bảo mật, UAT & Tối ưu Responsive', 'Hoàng Kim Yến', '25/08/2026', '28/08/2026', '40%', '⏳ Đang test'],
        ['6', 'TSK-06', 'Triển khai Production & Bàn giao hướng dẫn', 'Nguyễn Minh Tuấn', '29/08/2026', '31/08/2026', '0%', '⏱️ Chưa bắt đầu'],
      ],
    };
  }

  if (text.includes('crm') || text.includes('khách hàng') || text.includes('bán hàng') || text.includes('báo giá')) {
    return {
      formula: '=QUERY(DEALS!A:H, "SELECT SUM(E) WHERE F=\'Chốt hợp đồng\'")',
      activeCell: 'E3',
      columns: [
        { letter: 'A', name: 'STT' },
        { letter: 'B', name: 'Mã Deal' },
        { letter: 'C', name: 'Tên Doanh Nghiệp / Khách Hàng' },
        { letter: 'D', name: 'Người Đại Diện' },
        { letter: 'E', name: 'Giá Trị Dự Kiến (₫)' },
        { letter: 'F', name: 'Giai Đoạn Phễu' },
        { letter: 'G', name: 'Xác Suất' },
        { letter: 'H', name: 'Hạn Ký Hợp Đồng' },
      ],
      rows: [
        ['1', 'DL-101', 'Tập đoàn Xây dựng & Địa ốc Vinahome', 'Lê Tuấn Vũ (GĐ Vận hành)', '250,000,000', 'Đàm phán điều khoản', '80%', '15/08/2026'],
        ['2', 'DL-102', 'Chuỗi Bán Lẻ Thời Trang SunFashion', 'Phạm Bích Ngọc (CEO)', '180,000,000', 'Chốt hợp đồng', '100%', '08/08/2026'],
        ['3', 'DL-103', 'Cty Logistics & Vận Tải Toàn Cầu Apex', 'Hoàng Đình Trọng (CTO)', '320,000,000', 'Đề xuất giải pháp', '60%', '20/08/2026'],
        ['4', 'DL-104', 'Hệ Thống Nhà Hàng Hương Biển Group', 'Đỗ Mai Chi (Kế toán trưởng)', '95,000,000', 'Đã gửi báo giá', '50%', '18/08/2026'],
        ['5', 'DL-105', 'Startup Công Nghệ AI NovaTech', 'Trần Quốc Bảo (Founder)', '140,000,000', 'Tiếp cận ban đầu', '30%', '25/08/2026'],
        ['6', 'DL-106', 'Cty Dược Mỹ Phẩm Tràng An', 'Vũ Minh Tâm (Phụ trách mua)', '210,000,000', 'Chốt hợp đồng', '100%', '06/08/2026'],
      ],
    };
  }

  // Mặc định tổng quát
  return {
    formula: '=VLOOKUP(B2, DULIEU_GOC!A:E, 4, FALSE)',
    activeCell: 'F2',
    columns: [
      { letter: 'A', name: 'STT' },
      { letter: 'B', name: 'Mã Chỉ Số' },
      { letter: 'C', name: 'Khoản Mục Quản Trị' },
      { letter: 'D', name: 'Tham Số Đầu Vào' },
      { letter: 'E', name: 'Công Thức Tính Toán' },
      { letter: 'F', name: 'Kết Quả Tự Động' },
      { letter: 'G', name: 'Tiêu Chuẩn Đạt' },
      { letter: 'H', name: 'Ghi Chú Đánh Giá' },
    ],
    rows: [
      ['1', 'CS-01', 'Định mức hiệu suất vận hành', '120 Giờ máy', 'Hệ số chuẩn hóa K=1.2', '144 Điểm đạt', '✓ Đạt tiêu chuẩn', 'Tự động trích xuất'],
      ['2', 'CS-02', 'Tỷ lệ sai số xử lý nghiệp vụ', '0.2% Tổng lệnh', 'Ngưỡng kiểm soát < 0.5%', '0.18%', '✓ Vượt kỳ vọng', 'Dữ liệu thời gian thực'],
      ['3', 'CS-03', 'Hệ số quay vòng tài sản', '45 Lượt / Tháng', 'Chu kỳ luân chuyển 6.5 ngày', '4.8 Lần', '✓ Đạt chỉ tiêu', 'Đã khóa ô bảo mật'],
      ['4', 'CS-04', 'Mức độ hài lòng của người dùng', '4.9 / 5.0 Sao', 'Khảo sát 250 lượt phản hồi', '98.2%', '✓ Rất hài lòng', 'Đồng bộ Drive'],
      ['5', 'CS-05', 'Tiết kiệm thời gian thao tác', '3.5 Giờ / Ngày', 'Tự động hóa công thức mảng', '82% Tiết kiệm', '✓ Xuất sắc', 'Không lỗi vòng lặp'],
      ['6', 'CS-06', 'Chi phí vận hành định kỳ', '0 ₫ Server', 'Chạy trên Google Sheets', '100% Miễn phí máy chủ', '✓ Tiết kiệm tối đa', 'Bảo hành trọn đời'],
    ],
  };
}

export default function MarketplaceApp({ onSelectApp }: MarketplaceAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Modal Chi tiết & Mua hàng
  const [selectedTemplate, setSelectedTemplate] = useState<ExactCatalogProduct | null>(null);
  const [modalTab, setModalTab] = useState<'sheet_preview' | 'info_checkout'>('sheet_preview');

  // Trạng thái đơn hàng trong modal
  const [buyerName, setBuyerName] = useState<string>('Nguyễn Văn Tuấn');
  const [buyerPhone, setBuyerPhone] = useState<string>('0988123456');
  const [buyerEmail, setBuyerEmail] = useState<string>('tuan.nguyen@gmail.com');
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  // 8 Bộ lọc danh mục chính xác
  const categories = [
    'Tất cả',
    '76 Web App Thực Chiến',
    'Mẫu Google Sheet',
    'Kho Vận',
    'Tài Chính - Thu Chi',
    'Dự Án - Công Việc',
    'F&B Nhà Hàng',
    'CRM',
  ];

  const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Điều hướng chuyển trang khi mở Web App theo phân nhóm chính xác
  const handleOpenWebApp = (item: ExactCatalogProduct) => {
    const targetApp = getAppForProduct(item);
    onSelectApp(targetApp);
  };

  // Mở modal xem trước Google Sheets
  const handleOpenSheetModal = (item: ExactCatalogProduct, tab: 'sheet_preview' | 'info_checkout' = 'sheet_preview') => {
    setSelectedTemplate(item);
    setModalTab(tab);
    setOrderPlaced(false);
  };

  // Lọc sản phẩm theo danh mục và từ khóa
  const filteredTemplates = useMemo(() => {
    return catalog.filter((item) => {
      let matchCat = true;
      if (selectedCategory === 'Tất cả') {
        matchCat = true;
      } else if (selectedCategory === '76 Web App Thực Chiến') {
        matchCat = item.type === 'webapp';
      } else if (selectedCategory === 'Mẫu Google Sheet') {
        matchCat = item.type === 'gsheet';
      } else if (selectedCategory === 'Kho Vận') {
        matchCat =
          item.category === 'Quản lý Kho' ||
          item.category.toLowerCase().includes('kho') ||
          item.title.toLowerCase().includes('kho') ||
          item.appRoute === 'inventory';
      } else if (selectedCategory === 'Tài Chính - Thu Chi') {
        matchCat =
          item.category === 'Tài chính - Thu chi' ||
          item.category.toLowerCase().includes('tài chính') ||
          item.title.toLowerCase().includes('thu chi') ||
          item.title.toLowerCase().includes('tài chính') ||
          item.appRoute === 'cashflow';
      } else if (selectedCategory === 'Dự Án - Công Việc') {
        matchCat =
          item.category === 'Dự án & Công việc' ||
          item.title.toLowerCase().includes('công việc') ||
          item.title.toLowerCase().includes('kanban') ||
          item.title.toLowerCase().includes('gantt') ||
          item.appRoute === 'project';
      } else if (selectedCategory === 'F&B Nhà Hàng') {
        matchCat =
          item.category === 'F&B & Nhà hàng' ||
          item.title.toLowerCase().includes('nhà hàng') ||
          item.title.toLowerCase().includes('pos') ||
          item.title.toLowerCase().includes('quán') ||
          item.appRoute === 'fnb' ||
          item.appRoute === 'restaurant';
      } else if (selectedCategory === 'CRM') {
        matchCat =
          item.category === 'CRM & Khách hàng' ||
          item.title.toLowerCase().includes('crm') ||
          item.title.toLowerCase().includes('khách hàng') ||
          item.appRoute === 'crm';
      }

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.version.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Phân trang
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage) || 1;
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(start, start + itemsPerPage);
  }, [filteredTemplates, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  // URL VietQR động theo yêu cầu đề bài:
  // https://img.vietqr.io/image/970422-123456789-compact2.png?amount={price}&addInfo=MUA_{id}
  const dynamicQrUrl = selectedTemplate
    ? `https://img.vietqr.io/image/970422-123456789-compact2.png?amount=${selectedTemplate.price}&addInfo=MUA_${selectedTemplate.id}`
    : '';

  const sheetData = selectedTemplate ? getSheetPreviewData(selectedTemplate) : null;

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* BANNER HỆ THỐNG */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0369a1 100%)',
          borderRadius: '16px',
          padding: '30px 36px',
          color: '#ffffff',
          marginBottom: '26px',
          boxShadow: '0 4px 20px rgba(3, 105, 161, 0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.18)', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>
              🌟 Hệ Sinh Thái 229 Sản Phẩm Bản Quyền Chuẩn GSheets.vn
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Sàn Bản Quyền Web App & Mẫu Google Sheets Doanh Nghiệp
            </h1>
            <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.9, maxWidth: '750px', lineHeight: 1.6 }}>
              Khám phá 76 Web App thực chiến độc bản (Kho đa kho, Thu chi Startup, Quản lý công việc Kanban, POS Nhà hàng VietQR, CRM Bán hàng, Cho thuê thiết bị / Mini-ERP) và 153 mẫu Google Sheets tự động hóa chuyên sâu. Trải nghiệm trực tiếp không qua trung gian!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', textAlign: 'center' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '14px 20px', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
              <div style={{ fontSize: '26px', fontWeight: '800' }}>76</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>Web App Chuyên Sâu</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '14px 20px', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
              <div style={{ fontSize: '26px', fontWeight: '800' }}>153</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>Mẫu Google Sheet</div>
            </div>
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM VÀ BỘ LỌC DANH MỤC */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', minWidth: '320px', flex: 1, maxWidth: '540px' }}>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm nhanh (Tên sản phẩm, mã GS-001, tính năng, version...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ fontSize: '13.5px', color: '#64748b' }}>
            Tìm thấy <strong>{filteredTemplates.length}</strong> sản phẩm | Trang <strong>{currentPage}</strong> / {totalPages}
          </div>
        </div>

        {/* 8 NÚT TABS DANH MỤC CHÍNH XÁC */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '20px',
                  border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#0284c7' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease-in-out',
                  boxShadow: isSelected ? '0 2px 6px rgba(2, 132, 199, 0.25)' : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* LƯỚI CARD SẢN PHẨM (12 SP / TRANG) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '22px', marginBottom: '32px' }}>
        {paginatedTemplates.map((item) => {
          const isWebapp = item.type === 'webapp';

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: isWebapp ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isWebapp
                  ? '0 4px 12px rgba(2, 132, 199, 0.08)'
                  : '0 2px 6px rgba(0,0,0,0.04)',
                position: 'relative',
              }}
            >
              <div>
                {/* BADGE PHÂN LOẠI & MÃ ĐỊNH DANH */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        backgroundColor: isWebapp ? '#e0f2fe' : '#dcfce7',
                        color: isWebapp ? '#0369a1' : '#166534',
                        border: isWebapp ? '1px solid #bae6fd' : '1px solid #bbf7d0',
                      }}
                    >
                      {isWebapp ? '⚡ Web App Chuyên Sâu' : '📊 Mẫu Google Sheet'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', backgroundColor: '#f1f5f9', padding: '3px 7px', borderRadius: '4px' }}>
                      {item.version}
                    </span>
                  </div>

                  <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700' }}>
                    {item.id}
                  </span>
                </div>

                {/* TIÊU ĐỀ SẢN PHẨM */}
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: '#0f172a',
                    margin: '0 0 10px 0',
                    lineHeight: 1.45,
                    minHeight: '44px',
                  }}
                >
                  {item.title}
                </h3>

                {/* MÔ TẢ TÓM TẮT */}
                <p
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    lineHeight: 1.55,
                    margin: '0 0 14px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '60px',
                  }}
                >
                  {item.description}
                </p>

                {/* DANH SÁCH TÍNH NĂNG ĐỘC BẢN LẤY TRỰC TIẾP TỪ ITEM.FEATURES */}
                <div style={{ marginBottom: '16px', minHeight: '68px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Tính năng độc bản ({item.version}):
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.55 }}>
                    {item.features && item.features.length > 0 ? (
                      item.features.slice(0, 3).map((feat, fIdx) => (
                        <li key={fIdx} style={{ marginBottom: '3px' }}>
                          {feat}
                        </li>
                      ))
                    ) : (
                      <li>{item.description}</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* FOOTER CARD: GIÁ BÁN & NÚT HÀNH ĐỘNG PHÂN BIỆT THEO TYPE */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: isWebapp ? '#0284c7' : '#059669' }}>
                      {formatVND(item.price)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>
                      {formatVND(item.originalPrice)}
                    </div>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#0284c7', fontWeight: '600' }}>
                    {item.category}
                  </span>
                </div>

                {/* HÀNG NÚT BẤM CHUẨN HÓA LOGIC */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {isWebapp ? (
                    /* NÚT CHÍNH CHO WEBAPP: CHUYỂN ĐÚNG PHÂN HỆ APP THỰC TẾ */
                    <button
                      type="button"
                      onClick={() => handleOpenWebApp(item)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #1e40af 0%, #0284c7 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
                      }}
                    >
                      ⚡ Trải nghiệm Web App
                    </button>
                  ) : (
                    /* NÚT CHÍNH CHO GOOGLE SHEET THEO ĐÚNG YÊU CẦU: "Xem Mẫu Bảng Tính & Đặt Mua" */
                    <button
                      type="button"
                      onClick={() => handleOpenSheetModal(item, 'sheet_preview')}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                      }}
                    >
                      📊 Xem Mẫu Bảng Tính & Đặt Mua
                    </button>
                  )}

                  {/* NÚT CHI TIẾT */}
                  <button
                    type="button"
                    onClick={() => handleOpenSheetModal(item, 'info_checkout')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      fontSize: '12.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: currentPage <= 1 ? '#f1f5f9' : '#ffffff',
            color: currentPage <= 1 ? '#94a3b8' : '#334155',
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          ◀ Trang trước
        </button>

        <span style={{ fontSize: '13.5px', color: '#475569', padding: '0 12px', fontWeight: '700' }}>
          Trang {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: currentPage >= totalPages ? '#f1f5f9' : '#ffffff',
            color: currentPage >= totalPages ? '#94a3b8' : '#334155',
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          Trang sau ▶
        </button>
      </div>

      {/* ==================================================================== */}
      {/* MODAL 2 TAB: XEM TRƯỚC CẤU TRÚC SHEET & ĐẶT MUA QUA VIETQR */}
      {/* ==================================================================== */}
      {selectedTemplate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.78)',
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
              maxWidth: '860px',
              width: '100%',
              padding: '26px 30px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
              maxHeight: '94vh',
              overflowY: 'auto',
            }}
          >
            {/* TIÊU ĐỀ MODAL & NÚT ĐÓNG */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: selectedTemplate.type === 'webapp' ? '#e0f2fe' : '#dcfce7',
                      color: selectedTemplate.type === 'webapp' ? '#0369a1' : '#166534',
                    }}
                  >
                    {selectedTemplate.type === 'webapp' ? '⚡ Web App Chuyên Sâu' : '📊 Mẫu Google Sheets'}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700' }}>
                    {selectedTemplate.id} • {selectedTemplate.version}
                  </span>
                  <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: '700' }}>
                    {selectedTemplate.category}
                  </span>
                </div>
                <h2 style={{ fontSize: '19px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  {selectedTemplate.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            {/* TAB CHUYỂN ĐỔI CHÍNH XÁC THEO YÊU CẦU ĐỀ BÀI */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setModalTab('sheet_preview')}
                style={{
                  padding: '10px 18px',
                  border: 'none',
                  borderBottom: modalTab === 'sheet_preview' ? '3px solid #16a34a' : '3px solid transparent',
                  backgroundColor: 'transparent',
                  color: modalTab === 'sheet_preview' ? '#16a34a' : '#64748b',
                  fontWeight: '700',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                📊 Xem trước cấu trúc Sheet
              </button>

              <button
                type="button"
                onClick={() => setModalTab('info_checkout')}
                style={{
                  padding: '10px 18px',
                  border: 'none',
                  borderBottom: modalTab === 'info_checkout' ? '3px solid #0284c7' : '3px solid transparent',
                  backgroundColor: 'transparent',
                  color: modalTab === 'info_checkout' ? '#0284c7' : '#64748b',
                  fontWeight: '700',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                💳 Đặt Mua & Nhận File Bản Quyền
              </button>
            </div>

            {/* ================================================================ */}
            {/* TAB 1: XEM TRƯỚC CẤU TRÚC SHEET (BẢNG GIẢ LẬP GOOGLE SHEETS) */}
            {/* ================================================================ */}
            {modalTab === 'sheet_preview' && sheetData && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#475569' }}>
                    Mô phỏng bảng tính Google Sheets: <strong>{selectedTemplate.title}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalTab('info_checkout')}
                    style={{
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                    }}
                  >
                    Tiếp tục đặt mua mẫu này ▶
                  </button>
                </div>

                {/* KHUNG GIẢ LẬP GIAO DIỆN GOOGLE SHEETS ĐÍCH THỰC */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  {/* THANH TIÊU ĐỀ GOOGLE SHEETS */}
                  <div style={{ backgroundColor: '#107c41', color: '#ffffff', padding: '9px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', fontWeight: '700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>📊</span>
                      <span>Google Sheets — {selectedTemplate.title}.xlsx</span>
                    </div>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                      Chế độ: Chỉ xem mẫu
                    </span>
                  </div>

                  {/* THANH MENU GIẢ LẬP */}
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
                    <span style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: '700', color: '#0f172a' }}>
                      {sheetData.activeCell}
                    </span>
                    <span style={{ color: '#0284c7', fontWeight: '800', fontStyle: 'italic' }}>fx</span>
                    <span style={{ fontFamily: 'monospace', color: '#334155', fontWeight: '600' }}>
                      {sheetData.formula}
                    </span>
                  </div>

                  {/* BẢNG GRID DỮ LIỆU CÓ HEADER CHỮ CÁI A, B, C... VÀ SỐ DÒNG 1, 2, 3... */}
                  <div style={{ overflowX: 'auto', maxHeight: '340px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', backgroundColor: '#ffffff' }}>
                      <thead>
                        {/* HÀNG TIÊU ĐỀ CHỮ CÁI A, B, C... */}
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                          <th style={{ width: '38px', padding: '6px', textAlign: 'center', borderRight: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '11px' }}>
                            ◰
                          </th>
                          {sheetData.columns.map((col, idx) => (
                            <th
                              key={idx}
                              style={{
                                padding: '6px 10px',
                                borderRight: '1px solid #cbd5e1',
                                textAlign: 'center',
                                color: '#475569',
                                fontWeight: '700',
                                backgroundColor: '#f8fafc',
                                minWidth: '90px',
                              }}
                            >
                              {col.letter}
                            </th>
                          ))}
                        </tr>

                        {/* HÀNG DÒNG 1: TÊN CÁC CỘT TRƯỜNG DỮ LIỆU */}
                        <tr style={{ backgroundColor: '#e8f5e9', borderBottom: '2px solid #81c784', color: '#1b5e20' }}>
                          <td style={{ padding: '7px', textAlign: 'center', borderRight: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: '700' }}>
                            1
                          </td>
                          {sheetData.columns.map((col, idx) => (
                            <th
                              key={idx}
                              style={{
                                padding: '7px 10px',
                                borderRight: '1px solid #c8e6c9',
                                fontWeight: '800',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {col.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sheetData.rows.map((rowCells, rIdx) => {
                          const rowNum = rIdx + 2;
                          return (
                            <tr
                              key={rIdx}
                              style={{
                                borderBottom: '1px solid #e2e8f0',
                                backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#fcfdfc',
                              }}
                            >
                              {/* CỘT SỐ DÒNG 1, 2, 3... */}
                              <td
                                style={{
                                  padding: '7px',
                                  textAlign: 'center',
                                  borderRight: '1px solid #cbd5e1',
                                  backgroundColor: '#f1f5f9',
                                  color: '#64748b',
                                  fontWeight: '600',
                                  userSelect: 'none',
                                }}
                              >
                                {rowNum}
                              </td>

                              {/* CÁC Ô SỐ LIỆU KINH DOANH MẪU */}
                              {rowCells.map((val, cIdx) => (
                                <td
                                  key={cIdx}
                                  style={{
                                    padding: '7px 10px',
                                    borderRight: '1px solid #e2e8f0',
                                    color: val.includes('⚠️') ? '#b45309' : val.includes('✓') ? '#15803d' : '#1e293b',
                                    fontWeight: cIdx === 1 || val.includes('✓') ? '600' : 'normal',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* THÔNG TIN TÍNH NĂNG TÍCH HỢP */}
                <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                    ⚡ Điểm mạnh của bản quyền Google Sheets này:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: '#475569', lineHeight: 1.6 }}>
                    {selectedTemplate.features.map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                    <li>Công thức tự động 100%, không cần cài đặt phần mềm bên thứ ba.</li>
                    <li>Tương thích máy tính, máy tính bảng và điện thoại di động qua Google Drive.</li>
                  </ul>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => setModalTab('info_checkout')}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 22px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
                    }}
                  >
                    Tiếp tục đặt mua mẫu này ▶
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 2: ĐẶT MUA & NHẬN FILE BẢN QUYỀN (VIETQR ĐỘNG) */}
            {/* ================================================================ */}
            {modalTab === 'info_checkout' && (
              <div>
                {!orderPlaced ? (
                  <div>
                    <div style={{ border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0369a1' }}>
                            Thanh Toán VietQR Nhận Liên Kết Bản Quyền Tự Động
                          </h4>
                          <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                            Mã sản phẩm: <strong>{selectedTemplate.id}</strong> • Phí kích hoạt trọn đời
                          </span>
                        </div>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#059669' }}>
                          {formatVND(selectedTemplate.price)}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '22px', alignItems: 'center' }}>
                        {/* MÃ VIETQR ĐỘNG CHUẨN ĐỀ BÀI: https://img.vietqr.io/image/970422-123456789-compact2.png?amount={price}&addInfo=MUA_{id} */}
                        <div style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                          <img
                            src={dynamicQrUrl}
                            alt="VietQR Chuyển Khoản"
                            style={{ width: '176px', height: '176px', display: 'block', margin: '0 auto' }}
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div style={{ display: 'none', width: '176px', height: '176px', lineHeight: '176px', fontSize: '12px', color: '#64748b' }}>
                            [QR MB Bank]
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', fontWeight: '600' }}>
                            Quét bằng app mọi ngân hàng
                          </div>
                        </div>

                        {/* FORM THÔNG TIN NGƯỜI MUA */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ fontSize: '12.5px', color: '#0f172a', lineHeight: 1.6, backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div>Ngân hàng: <strong>MB Bank (Ngân Hàng Quân Đội)</strong></div>
                            <div>Số tài khoản: <strong>123456789</strong></div>
                            <div>Nội dung chuyển khoản: <strong style={{ color: '#0284c7' }}>MUA_{selectedTemplate.id}</strong></div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>
                              Họ và tên:
                            </label>
                            <input
                              type="text"
                              required
                              value={buyerName}
                              onChange={(e) => setBuyerName(e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>
                              Số điện thoại / Zalo:
                            </label>
                            <input
                              type="text"
                              required
                              value={buyerPhone}
                              onChange={(e) => setBuyerPhone(e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>
                              Email nhận liên kết Google Drive:
                            </label>
                            <input
                              type="email"
                              required
                              value={buyerEmail}
                              onChange={(e) => setBuyerEmail(e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => setOrderPlaced(true)}
                            style={{
                              marginTop: '8px',
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '11px',
                              borderRadius: '8px',
                              fontWeight: '700',
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                            }}
                          >
                            ✓ Xác nhận đã chuyển khoản
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* NÚT MỞ THẲNG WEB APP NẾU ĐÂY LÀ SẢN PHẨM WEBAPP */}
                    {selectedTemplate.type === 'webapp' && (
                      <div style={{ textAlign: 'center', marginTop: '14px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTemplate(null);
                            handleOpenWebApp(selectedTemplate);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #1e40af 0%, #0284c7 100%)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            fontSize: '13.5px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          ⚡ Trải nghiệm Web App ngay
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* MÀN HÌNH XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG VÀ NÚT MỞ ZALO NHẬN FILE NGAY */
                  <div style={{ backgroundColor: '#ecfdf5', border: '2px solid #86efac', borderRadius: '16px', padding: '30px', textAlign: 'center' }}>
                    <div style={{ fontSize: '42px', marginBottom: '8px' }}>🎉</div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800', color: '#166534' }}>
                      Xác Nhận Đơn Hàng Thành Công!
                    </h3>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#15803d', lineHeight: 1.6 }}>
                      Hệ thống đã ghi nhận thanh toán cho đơn hàng <strong>MUA_{selectedTemplate.id}</strong>.<br />
                      Đường link bản quyền Google Drive đã được gửi đến hộp thư <strong>{buyerEmail}</strong>.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                      {/* NÚT MỞ ZALO NHẬN FILE NGAY THEO YÊU CẦU ĐỀ BÀI */}
                      <a
                        href={`https://zalo.me/${buyerPhone.replace(/\D/g, '') || '0987654321'}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: 'none',
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)',
                        }}
                      >
                        💬 Mở Zalo nhận file ngay
                      </a>

                      {/* LIÊN KẾT GOOGLE DRIVE */}
                      <a
                        href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/copy"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: 'none',
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)',
                        }}
                      >
                        📂 Mở & Tạo Bản Sao Google Drive
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          alert(`Đã tải file mẫu [${selectedTemplate.title}] về máy tính thành công!`);
                        }}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          padding: '12px 20px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        📥 Tải Xuống File (.xlsx)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
