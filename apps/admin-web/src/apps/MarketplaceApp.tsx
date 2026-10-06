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

interface MarketplaceAppProps {
  onSelectApp: (app: 'equipment_erp' | 'warehouse' | 'finance' | 'tasks' | 'pos' | 'crm') => void;
}

export default function MarketplaceApp({ onSelectApp }: MarketplaceAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Modal Chi tiết & Mua hàng
  const [selectedTemplate, setSelectedTemplate] = useState<ExactCatalogProduct | null>(null);
  const [modalTab, setModalTab] = useState<'info_checkout' | 'sheet_preview'>('info_checkout');

  // Trạng thái đơn hàng trong modal
  const [buyerName, setBuyerName] = useState<string>('Nguyễn Văn Tuấn');
  const [buyerPhone, setBuyerPhone] = useState<string>('0988123456');
  const [buyerEmail, setBuyerEmail] = useState<string>('tuan.nguyen@gmail.com');
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [currentOrderCode, setCurrentOrderCode] = useState<string>('');

  // 8 Bộ lọc danh mục chính xác theo yêu cầu đề bài
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

  // Điều hướng chuyển trang khi mở Web App theo appRoute
  const handleOpenWebApp = (item: ExactCatalogProduct) => {
    if (item.appRoute === 'equipment' || item.appRoute === 'erp') {
      onSelectApp('equipment_erp');
    } else if (item.appRoute === 'inventory') {
      onSelectApp('warehouse');
    } else if (item.appRoute === 'cashflow') {
      onSelectApp('finance');
    } else if (item.appRoute === 'project') {
      onSelectApp('tasks');
    } else if (item.appRoute === 'fnb' || item.appRoute === 'restaurant') {
      onSelectApp('pos');
    } else if (item.appRoute === 'crm') {
      onSelectApp('crm');
    } else {
      // Nhận diện theo từ khóa tiêu đề hoặc danh mục
      const lower = (item.title + ' ' + item.category).toLowerCase();
      if (lower.includes('thiết bị') || lower.includes('erp')) {
        onSelectApp('equipment_erp');
      } else if (lower.includes('kho') || lower.includes('vận')) {
        onSelectApp('warehouse');
      } else if (lower.includes('thu chi') || lower.includes('tài chính') || lower.includes('runway')) {
        onSelectApp('finance');
      } else if (lower.includes('công việc') || lower.includes('tiến độ') || lower.includes('kanban')) {
        onSelectApp('tasks');
      } else if (lower.includes('nhà hàng') || lower.includes('quán') || lower.includes('pos')) {
        onSelectApp('pos');
      } else if (lower.includes('crm') || lower.includes('khách hàng') || lower.includes('bán hàng')) {
        onSelectApp('crm');
      } else {
        onSelectApp('equipment_erp');
      }
    }
  };

  // Mở modal xem trước Google Sheets có iframe thật
  const handleOpenSheetPreview = (item: ExactCatalogProduct) => {
    setSelectedTemplate(item);
    setModalTab('sheet_preview');
    setOrderPlaced(false);
    setCurrentOrderCode(`DH-${item.id}-${Math.floor(100 + Math.random() * 900)}`);
  };

  // Mở modal chi tiết & mua hàng
  const handleOpenDetailModal = (item: ExactCatalogProduct) => {
    setSelectedTemplate(item);
    setModalTab('info_checkout');
    setOrderPlaced(false);
    setCurrentOrderCode(`DH-${item.id}-${Math.floor(100 + Math.random() * 900)}`);
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

  // URL VietQR
  const qrUrl = selectedTemplate
    ? `https://img.vietqr.io/image/mbbank-0987654321-compact2.png?amount=${selectedTemplate.price}&addInfo=${currentOrderCode}&accountName=CONG%20TY%20GSHEETS%20VN`
    : '';

  const liveSheetUrl =
    selectedTemplate?.sheetUrl ||
    'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview';

  const copyDriveUrl = liveSheetUrl.replace('/preview', '/copy');

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
              Khám phá 76 Web App thực chiến độc bản (Mini-ERP, Cho thuê thiết bị, Kho đa kho, Thu chi Startup, POS VietQR, CRM) và 153 mẫu Google Sheets tự động hóa chuyên sâu. Trải nghiệm trực tiếp không qua trung gian!
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
                    /* NÚT CHÍNH CHO WEBAPP: TUYỆT ĐỐI KHÔNG HIỂN THỊ CHỮ TẢI MẪU SHEET */
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
                    /* NÚT CHÍNH CHO GOOGLE SHEET: MỞ KHUNG XEM TRƯỚC VÀ NHẬN BẢN SAO */
                    <button
                      type="button"
                      onClick={() => handleOpenSheetPreview(item)}
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
                      📊 Xem & Nhận Bản Sao Google Sheet
                    </button>
                  )}

                  {/* NÚT CHI TIẾT & ĐẶT MUA */}
                  <button
                    type="button"
                    onClick={() => handleOpenDetailModal(item)}
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
      {/* MODAL CHI TIẾT SẢN PHẨM & REAL GOOGLE SHEET PREVIEW & VIETQR */}
      {/* ==================================================================== */}
      {selectedTemplate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
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
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
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

            {/* TAB CHUYỂN ĐỔI MODAL */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '18px' }}>
              {selectedTemplate.type === 'gsheet' && (
                <button
                  type="button"
                  onClick={() => setModalTab('sheet_preview')}
                  style={{
                    padding: '10px 16px',
                    border: 'none',
                    borderBottom: modalTab === 'sheet_preview' ? '2px solid #16a34a' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    color: modalTab === 'sheet_preview' ? '#16a34a' : '#64748b',
                    fontWeight: '700',
                    fontSize: '13.5px',
                    cursor: 'pointer',
                  }}
                >
                  📊 Xem Trước Trực Tiếp Google Sheets
                </button>
              )}

              <button
                type="button"
                onClick={() => setModalTab('info_checkout')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: modalTab === 'info_checkout' ? '2px solid #0284c7' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: modalTab === 'info_checkout' ? '#0284c7' : '#64748b',
                  fontWeight: '700',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                }}
              >
                💳 Thông Tin & Đặt Mua VietQR
              </button>
            </div>

            {/* ================================================================ */}
            {/* TAB 1: XEM TRƯỚC GOOGLE SHEET THẬT QUA IFRAME (REAL SHEET PREVIEW) */}
            {/* ================================================================ */}
            {modalTab === 'sheet_preview' && selectedTemplate.type === 'gsheet' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                    📊 Khung xem trước bảng tính Google Sheets trực tiếp:
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {/* NÚT TẠO BẢN SAO VỀ DRIVE CỦA BẠN */}
                    <a
                      href={copyDriveUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: 'none',
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '12.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
                      }}
                    >
                      📂 Tạo Bản Sao Về Drive Của Bạn
                    </a>

                    {/* NÚT ĐẶT MUA FILE GỐC */}
                    <button
                      type="button"
                      onClick={() => setModalTab('info_checkout')}
                      style={{
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                      }}
                    >
                      💳 Đặt Mua File Gốc (VietQR)
                    </button>
                  </div>
                </div>

                {/* KHUNG IFRAME NHÚNG TRỰC TIẾP GOOGLE SHEETS */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ backgroundColor: '#107c41', color: '#ffffff', padding: '8px 14px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📊 Google Sheets Embed:</span>
                    <span>{selectedTemplate.title}</span>
                  </div>
                  <iframe
                    src={liveSheetUrl}
                    title={selectedTemplate.title}
                    style={{
                      width: '100%',
                      height: '460px',
                      border: 'none',
                      backgroundColor: '#ffffff',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 2: THÔNG TIN CHI TIẾT & THANH TOÁN VIETQR */}
            {/* ================================================================ */}
            {modalTab === 'info_checkout' && (
              <div>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                  {selectedTemplate.description}
                </p>

                {/* HỘP HIỂN THỊ TÍNH NĂNG ĐỘC BẢN CỦA PHIÊN BẢN ĐÓ */}
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    Danh mục tính năng bản quyền ({selectedTemplate.version}):
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
                    {selectedTemplate.features.map((feat, idx) => (
                      <li key={idx}><strong>{feat}</strong></li>
                    ))}
                    <li>Cấp quyền truy cập vĩnh viễn trên tài khoản Google Workspace / Drive của bạn.</li>
                    <li>Bảo hành kỹ thuật và hướng dẫn sử dụng chi tiết từ đội ngũ GSheets.vn.</li>
                  </ul>
                </div>

                {/* NÚT MỞ THẲNG WEB APP NẾU ĐÂY LÀ SẢN PHẨM WEBAPP */}
                {selectedTemplate.type === 'webapp' && (
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
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
                        padding: '12px 28px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      ⚡ Mở Trực Tiếp Trình Duyệt Web App {selectedTemplate.title}
                    </button>
                  </div>
                )}

                {/* KHUNG THANH TOÁN VIETQR */}
                {!orderPlaced ? (
                  <div style={{ border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800', color: '#0369a1' }}>
                        Thanh Toán Nhanh Bản Quyền Qua VietQR Ngân Hàng
                      </h4>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>
                        {formatVND(selectedTemplate.price)}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px', alignItems: 'center' }}>
                      {/* ẢNH QR VIETQR */}
                      <div style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                        <img
                          src={qrUrl}
                          alt="VietQR Chuyển Khoản"
                          style={{ width: '160px', height: '160px', display: 'block', margin: '0 auto' }}
                          onError={(e: any) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div style={{ display: 'none', width: '160px', height: '160px', lineHeight: '160px', fontSize: '12px', color: '#64748b' }}>
                          [QR MB Bank]
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>Quét bằng app ngân hàng</div>
                      </div>

                      {/* FORM THÔNG TIN NGƯỜI NHẬN FILE */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '12.5px', color: '#0f172a', lineHeight: 1.5 }}>
                          <div>Ngân hàng: <strong>MB Bank (Ngân hàng Quân Đội)</strong></div>
                          <div>STK: <strong>0987654321</strong> | Chủ TK: <strong>CONG TY GSHEETS VN</strong></div>
                          <div>Mã đơn hàng / Nội dung: <strong style={{ color: '#0284c7' }}>{currentOrderCode}</strong></div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>
                            Email nhận link bản quyền Google Drive:
                          </label>
                          <input
                            type="email"
                            required
                            value={buyerEmail}
                            onChange={(e) => setBuyerEmail(e.target.value)}
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>
                              Họ tên người mua:
                            </label>
                            <input
                              type="text"
                              value={buyerName}
                              onChange={(e) => setBuyerName(e.target.value)}
                              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
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
                              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setOrderPlaced(true)}
                          style={{
                            marginTop: '6px',
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '13.5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          ✓ Tôi Đã Chuyển Khoản - Kích Hoạt Nhận File Ngay
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* MÀN HÌNH XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG */
                  <div style={{ backgroundColor: '#ecfdf5', border: '2px solid #86efac', borderRadius: '14px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#166534' }}>
                      Xác Nhận Đơn Hàng Thành Công!
                    </h3>
                    <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#15803d' }}>
                      Hệ thống đã ghi nhận thanh toán cho đơn hàng <strong>{currentOrderCode}</strong>.<br />
                      Đường link bản quyền Google Drive đã được gửi đến hộp thư <strong>{buyerEmail}</strong>.
                    </p>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <a
                        href={copyDriveUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: 'none',
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '13.5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        📂 Mở & Sao Chép Vào Google Drive Của Bạn
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
                          padding: '10px 18px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '13.5px',
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
