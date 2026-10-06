import React, { useState, useMemo } from 'react';
import { allTemplates, TemplateItem } from '../data/allTemplates';

interface MarketplaceAppProps {
  onSelectApp: (app: 'warehouse' | 'finance' | 'tasks' | 'pos' | 'crm') => void;
}

export default function MarketplaceApp({ onSelectApp }: MarketplaceAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Modal Chi tiết & Mua hàng
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [modalTab, setModalTab] = useState<'info_checkout' | 'sheet_preview'>('info_checkout');

  // Trạng thái đơn hàng trong modal
  const [buyerName, setBuyerName] = useState<string>('Nguyễn Văn Tuấn');
  const [buyerPhone, setBuyerPhone] = useState<string>('0988123456');
  const [buyerEmail, setBuyerEmail] = useState<string>('tuan.nguyen@gmail.com');
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [currentOrderCode, setCurrentOrderCode] = useState<string>('');

  const categories = [
    'Tất cả',
    '⚡ Web App Doanh Nghiệp',
    '📊 Google Sheets Mẫu',
    'Kho & Bán lẻ',
    'Tài chính - Thu chi',
    'Dự án & Công việc',
    'F&B Nhà hàng',
    'CRM Bán hàng',
    'Nhân sự & Tiền lương',
    'Quản lý Lớp học',
    'Dịch vụ & Đặt chỗ',
    'Tiện ích Sheet',
  ];

  const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Lọc sản phẩm
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((item) => {
      let matchCat = true;
      if (selectedCategory === 'Tất cả') {
        matchCat = true;
      } else if (selectedCategory === '⚡ Web App Doanh Nghiệp') {
        matchCat = item.type === 'webapp';
      } else if (selectedCategory === '📊 Google Sheets Mẫu') {
        matchCat = item.type === 'gsheet';
      } else {
        matchCat = item.category === selectedCategory;
      }

      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase().trim());

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

  const handleOpenDetailModal = (item: TemplateItem) => {
    setSelectedTemplate(item);
    setModalTab('info_checkout');
    setOrderPlaced(false);
    setCurrentOrderCode(`DH-${item.id}-${Math.floor(100 + Math.random() * 900)}`);
  };

  // URL VietQR
  const qrUrl = selectedTemplate
    ? `https://img.vietqr.io/image/mbbank-0987654321-compact2.png?amount=${selectedTemplate.price}&addInfo=${currentOrderCode}&accountName=CONG%20TY%20GSHEETS%20VN`
    : '';

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* BANNER HỆ THỐNG */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0369a1 100%)',
          borderRadius: '16px',
          padding: '32px 36px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(3, 105, 161, 0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.18)', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
              🌟 Kho Dữ Liệu GSheets.vn — Đầy Đủ 229 Sản Phẩm Bản Quyền
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Sàn Giao Dịch Bản Quyền Mẫu Bảng Tính & Web App Doanh Nghiệp
            </h1>
            <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.9, maxWidth: '720px', lineHeight: 1.6 }}>
              Khám phá và sở hữu toàn bộ 229 công cụ quản trị thực chiến từ gsheets.vn: Kho hàng, Dòng tiền Startup, Quản lý công việc Kanban, POS Nhà hàng tích hợp VietQR, CRM bán hàng và các hàm tự động hóa đỉnh cao.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', textAlign: 'center' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '14px 20px', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
              <div style={{ fontSize: '26px', fontWeight: '800' }}>229</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>Sản phẩm sẵn có</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '14px 20px', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
              <div style={{ fontSize: '26px', fontWeight: '800' }}>100%</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>Tự động hóa Google Sheets</div>
            </div>
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM VÀ BỘ LỌC DANH MỤC */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', minWidth: '320px', flex: 1, maxWidth: '520px' }}>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm trong 229 sản phẩm (Tên, mã GS-001, mô tả, từ khóa...)"
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
              }}
            />
          </div>
          <div style={{ fontSize: '13.5px', color: '#64748b' }}>
            Tìm thấy <strong>{filteredTemplates.length}</strong> sản phẩm phù hợp | Trang <strong>{currentPage}</strong> / {totalPages}
          </div>
        </div>

        {/* NÚT TABS DANH MỤC */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#0284c7' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease-in-out',
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
                border: '1px solid #e2e8f0',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                position: 'relative',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div>
                {/* BADGE LOẠI SẢN PHẨM & MÃ */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: isWebapp ? '#e0f2fe' : '#dcfce7',
                        color: isWebapp ? '#0369a1' : '#166534',
                      }}
                    >
                      {isWebapp ? '⚡ Web App' : '📊 Google Sheet'}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600' }}>
                      {item.id}
                    </span>
                  </div>

                  <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: '600' }}>
                    {item.category}
                  </span>
                </div>

                {/* TIÊU ĐỀ */}
                <h3
                  style={{
                    fontSize: '15.5px',
                    fontWeight: '700',
                    color: '#0f172a',
                    margin: '0 0 10px 0',
                    lineHeight: 1.45,
                    minHeight: '44px',
                  }}
                >
                  {item.name}
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

                {/* TÍNH NĂNG NỔI BẬT */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {item.features.slice(0, 2).map((feat, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* FOOTER CARD: GIÁ TIỀN & CÁC NÚT THAO TÁC */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: '800', color: '#059669' }}>
                      {formatVND(item.price)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>
                      {formatVND(item.originalPrice)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
                    <div>⭐ <strong>{item.rating}</strong> (Đánh giá)</div>
                    <div>📥 <strong>{item.downloads}</strong> lượt tải</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {item.demoType === 'live_app' && item.demoAppKey ? (
                    <button
                      onClick={() => onSelectApp(item.demoAppKey!)}
                      style={{
                        flex: 1,
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 5px rgba(2, 132, 199, 0.2)',
                      }}
                    >
                      ⚡ Trải nghiệm App
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenDetailModal(item)}
                      style={{
                        flex: 1,
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      📥 Tải Mẫu Sheet
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenDetailModal(item)}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Chi tiết & Mua
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
        <button
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

        <span style={{ fontSize: '13.5px', color: '#475569', padding: '0 12px', fontWeight: '600' }}>
          Trang {currentPage} / {totalPages}
        </span>

        <button
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
      {/* MODAL CHI TIẾT SẢN PHẨM & MUA HÀNG QUA VIETQR */}
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
              maxWidth: '720px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              maxHeight: '92vh',
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
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: selectedTemplate.type === 'webapp' ? '#e0f2fe' : '#dcfce7',
                      color: selectedTemplate.type === 'webapp' ? '#0369a1' : '#166534',
                    }}
                  >
                    {selectedTemplate.type === 'webapp' ? '⚡ Web App' : '📊 Google Sheets'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{selectedTemplate.id}</span>
                  <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: '600' }}>{selectedTemplate.category}</span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  {selectedTemplate.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            {/* TAB CHUYỂN ĐỔI: THÔNG TIN MUA HÀNG <-> XEM TRƯỚC SHEET PREVIEW */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <button
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
              <button
                onClick={() => setModalTab('sheet_preview')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: modalTab === 'sheet_preview' ? '2px solid #0284c7' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: modalTab === 'sheet_preview' ? '#0284c7' : '#64748b',
                  fontWeight: '700',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                }}
              >
                📑 Xem Trước Cấu Trúc Bảng Tính
              </button>
            </div>

            {/* TAB 1: THÔNG TIN SẢN PHẨM & FORM ĐẶT MUA QUA VIETQR */}
            {modalTab === 'info_checkout' && (
              <div>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                  {selectedTemplate.description}
                </p>

                {/* HỘP CAM KẾT */}
                <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                    Quyền lợi bản quyền khi mua:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12.5px', color: '#475569' }}>
                    <div>✓ Cấp quyền truy cập Google Drive vĩnh viễn</div>
                    <div>✓ Tự do chỉnh sửa & nhân bản không giới hạn</div>
                    <div>✓ Kèm video hướng dẫn thiết lập từ A-Z</div>
                    <div>✓ Hỗ trợ kỹ thuật 1:1 qua Zalo khi cần</div>
                  </div>
                </div>

                {/* KHUNG THANH TOÁN VIETQR */}
                {!orderPlaced ? (
                  <div style={{ border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0369a1' }}>
                        Thanh Toán Nhanh Qua Mã VietQR Ngân Hàng
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
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '3px' }}>
                            Email nhận link Google Drive:
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
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '3px' }}>
                              Họ tên:
                            </label>
                            <input
                              type="text"
                              value={buyerName}
                              onChange={(e) => setBuyerName(e.target.value)}
                              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '3px' }}>
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
                        href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/copy"
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
                        onClick={() => {
                          alert(`Đã tải file mẫu [${selectedTemplate.name}] về máy tính thành công!`);
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

            {/* TAB 2: XEM TRƯỚC CẤU TRÚC BẢNG (SHEET PREVIEW) */}
            {modalTab === 'sheet_preview' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                    Giao diện mô phỏng bảng tính Google Sheets:
                  </div>
                  <span style={{ fontSize: '11.5px', backgroundColor: '#e2e8f0', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                    {selectedTemplate.sheetColumns.length} cột trường dữ liệu
                  </span>
                </div>

                {/* KHUNG MÔ PHỎNG GOOGLE SHEETS */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                  {/* THANH SHEETS HEADER */}
                  <div style={{ backgroundColor: '#107c41', color: '#ffffff', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📊 Google Sheets Template:</span>
                    <span>{selectedTemplate.name}</span>
                  </div>

                  {/* BẢNG GRID DỮ LIỆU */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#e6f4ea', borderBottom: '2px solid #34a853', color: '#137333' }}>
                          <th style={{ padding: '8px 12px', borderRight: '1px solid #c6ebd0', width: '40px', textAlign: 'center' }}>#</th>
                          {selectedTemplate.sheetColumns.map((col, idx) => (
                            <th key={idx} style={{ padding: '8px 12px', borderRight: '1px solid #c6ebd0', whiteSpace: 'nowrap', fontWeight: '700' }}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((rowIdx) => (
                          <tr key={rowIdx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: rowIdx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                            <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8', fontWeight: 'bold' }}>
                              {rowIdx}
                            </td>
                            {selectedTemplate.sheetColumns.map((col, colIdx) => (
                              <td key={colIdx} style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', color: '#334155' }}>
                                {col.includes('Mã')
                                  ? `ID-${rowIdx}0${colIdx + 1}`
                                  : col.includes('Số tiền') || col.includes('Giá') || col.includes('Lương')
                                  ? `${(rowIdx * 15000000).toLocaleString()} ₫`
                                  : col.includes('Ngày')
                                  ? `2026-10-0${rowIdx}`
                                  : col.includes('Tiến độ')
                                  ? `${rowIdx * 30}%`
                                  : col.includes('Trạng thái') || col.includes('Cảnh báo')
                                  ? '✓ Đạt chuẩn'
                                  : `Dữ liệu mẫu dòng ${rowIdx}`}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => setModalTab('info_checkout')}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Tiếp Tục Đặt Mua Mẫu Này ▶
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
