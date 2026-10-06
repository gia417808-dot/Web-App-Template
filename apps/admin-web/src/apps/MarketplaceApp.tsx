import React, { useState, useMemo } from 'react';
import { mockTemplates, GSheetTemplate } from '../mock/deepMockData';

interface MarketplaceAppProps {
  onSelectApp: (app: 'warehouse' | 'finance' | 'tasks' | 'pos' | 'crm') => void;
}

export default function MarketplaceApp({ onSelectApp }: MarketplaceAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<GSheetTemplate | null>(null);

  const categories = [
    'Tất cả',
    'Kho & Bán lẻ',
    'Tài chính & Thu chi',
    'Quản lý Công việc',
    'F&B & Nhà hàng',
    'CRM & Bán hàng',
    'Nhân sự & Tiền lương',
    'Sản xuất',
  ];

  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter((item) => {
      const matchCat = selectedCategory === 'Tất cả' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* BANNER THƯƠNG HIỆU */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
          borderRadius: '16px',
          padding: '32px 36px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(2, 132, 199, 0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>
              🌟 Hệ sinh thái 229+ Giải pháp Quản trị GSheets.vn
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Sàn Bản Quyền Mẫu Bảng Tính & Web App Doanh Nghiệp
            </h1>
            <p style={{ margin: '10px 0 0 0', fontSize: '14.5px', opacity: 0.92, maxWidth: '680px', lineHeight: 1.6 }}>
              Bộ công cụ tự động hóa vận hành được đóng gói sẵn. Trải nghiệm trực tiếp các phiên bản Web App tương tác thông minh ngay trên trình duyệt mà không cần cài đặt thêm phần mềm!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', textAlign: 'center' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '14px 22px', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>229+</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>Sản phẩm sẵn có</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '14px 22px', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>15,800+</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>Doanh nghiệp tin dùng</div>
            </div>
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM VÀ DANH MỤC */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', minWidth: '320px', flex: 1, maxWidth: '480px' }}>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm mẫu quản lý (Kho, Thu chi, POS, CRM, Kanban...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            />
          </div>
          <div style={{ fontSize: '13.5px', color: '#64748b' }}>
            Hiển thị <strong>{filteredTemplates.length}</strong> / {mockTemplates.length} sản phẩm tiêu biểu
          </div>
        </div>

        {/* CÁC NÚT DANH MỤC */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#0284c7' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  fontWeight: isSelected ? '600' : '500',
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

      {/* LƯỚI SẢN PHẨM TEMPLATE (GRID) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredTemplates.map((item) => (
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
            {item.isFeatured && (
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                🔥 {item.tag}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11.5px', backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
                  {item.code}
                </span>
                <span style={{ fontSize: '11.5px', color: '#0284c7', fontWeight: '600' }}>
                  {item.category}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                {item.name}
              </h3>

              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                {item.description}
              </p>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Tính năng cốt lõi:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {item.features.map((feat, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11.5px',
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
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: '800', color: '#059669' }}>
                    {formatVND(item.price_vnd)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', textDecoration: 'line-through' }}>
                    {formatVND(item.original_price_vnd)}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
                  <div>⭐ <strong>{item.rating}</strong> (320+ vote)</div>
                  <div>📥 <strong>{item.downloads}</strong> lượt tải</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {item.appTarget ? (
                  <button
                    onClick={() => onSelectApp(item.appTarget!)}
                    style={{
                      flex: 1,
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
                    }}
                  >
                    ⚡ Trải nghiệm Web App
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedTemplate(item)}
                    style={{
                      flex: 1,
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Tải mẫu Google Sheet
                  </button>
                )}

                <button
                  onClick={() => setSelectedTemplate(item)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL XEM CHI TIẾT SẢN PHẨM */}
      {selectedTemplate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {selectedTemplate.category}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '8px 0 0 0', color: '#0f172a' }}>
                  {selectedTemplate.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
              {selectedTemplate.description}
            </p>

            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>
                Gói sản phẩm bao gồm:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
                {selectedTemplate.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
                <li>Định dạng chuẩn: Google Sheets tự động hóa + Web App tương tác</li>
                <li>Hỗ trợ nâng cấp và bảo hành kỹ thuật trọn đời</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#059669' }}>
                  {formatVND(selectedTemplate.price_vnd)}
                </span>
                <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '8px' }}>
                  {formatVND(selectedTemplate.original_price_vnd)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedTemplate.appTarget && (
                  <button
                    onClick={() => {
                      const tgt = selectedTemplate.appTarget!;
                      setSelectedTemplate(null);
                      onSelectApp(tgt);
                    }}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    ⚡ Mở Web App Trực Tiếp
                  </button>
                )}
                <button
                  onClick={() => setSelectedTemplate(null)}
                  style={{
                    backgroundColor: '#e2e8f0',
                    color: '#334155',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
