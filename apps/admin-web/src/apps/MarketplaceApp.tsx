import React, { useState, useMemo, useEffect } from 'react';
import exactCatalogData from '../data/exactCatalog.json';
import { getProductDataset, ProductDataset, ProductColumn } from '../utils/productDataEngine';

export interface ExactCatalogProduct {
  id: string;
  title: string;
  cleanTitle?: string;
  rawName: string;
  type: 'webapp' | 'gsheet';
  version: string;
  category: string;
  description: string;
  shortDesc?: string;
  suitableFor?: string[];
  features: string[];
  price: number;
  originalPrice: number;
  appRoute: string;
  sheetUrl: string | null;
  templatePreviewUrl?: string;
}

const catalog: ExactCatalogProduct[] = exactCatalogData as ExactCatalogProduct[];

export type AppDestination = 'master_blueprint' | 'equipment_erp' | 'warehouse' | 'finance' | 'tasks' | 'pos' | 'crm';

interface MarketplaceAppProps {
  onSelectApp: (app: AppDestination) => void;
}

// Kiểm tra xem sản phẩm có trùng khớp trực tiếp 100% với các phân hệ lớn trong hệ thống hay không
export function getCoreAppIfExactMatch(item: ExactCatalogProduct): AppDestination | null {
  const t = item.title.toLowerCase();

  if (t.includes('quản lý dự án & công việc') || (t.includes('công việc') && t.includes('v5.0')) || t.includes('dự án & công việc')) {
    return 'master_blueprint';
  }
  if (t.includes('cho thuê thiết bị') || t.includes('mini-erp') || t.includes('thiết bị')) {
    return 'equipment_erp';
  }
  if (t.includes('kho đa kho') || (t.includes('quản lý kho') && t.includes('v3.0'))) {
    return 'warehouse';
  }
  if (t.includes('thu chi doanh nghiệp') || t.includes('runway') || t.includes('burn rate')) {
    return 'finance';
  }
  if (t.includes('pos nhà hàng') || t.includes('pos cafe') || t.includes('f&b')) {
    return 'pos';
  }
  if (t.includes('crm bán hàng & cskh') || (t.includes('crm') && t.includes('v7.1'))) {
    return 'crm';
  }

  return null;
}

export default function MarketplaceApp({ onSelectApp }: MarketplaceAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Modal Chi tiết & Trải nghiệm độc bản 1-to-1
  const [selectedTemplate, setSelectedTemplate] = useState<ExactCatalogProduct | null>(null);
  const [modalTab, setModalTab] = useState<'webapp_demo' | 'sheet_preview' | 'info_checkout'>('webapp_demo');

  // Quản lý dữ liệu động của bảng trong modal
  const [localRows, setLocalRows] = useState<{ [key: string]: string }[]>([]);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<{ [key: string]: string }>({});
  const [actionFeedback, setActionFeedback] = useState<string>('');

  // Trạng thái đơn hàng trong modal checkout
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

  // Sinh dữ liệu động 1-to-1 thông qua Metadata Engine
  const dataset: ProductDataset | null = useMemo(() => {
    if (!selectedTemplate) return null;
    return getProductDataset(
      selectedTemplate.id,
      selectedTemplate.title,
      selectedTemplate.category,
      selectedTemplate.description,
      selectedTemplate.version
    );
  }, [selectedTemplate]);

  // Cập nhật lại state bảng dữ liệu khi mở hoặc đổi template
  useEffect(() => {
    if (dataset) {
      setLocalRows(dataset.rows);
      const initialForm: { [key: string]: string } = {};
      dataset.sampleFormFields.forEach((field) => {
        initialForm[field.key] = field.defaultValue;
      });
      setNewRowData(initialForm);
      setTableSearch('');
      setShowAddForm(false);
      setActionFeedback('');
    }
  }, [dataset]);

  // Mở modal xem trước với tab tương ứng
  const handleOpenModal = (item: ExactCatalogProduct, tab: 'webapp_demo' | 'sheet_preview' | 'info_checkout') => {
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

      // Tạm thời ẩn các sản phẩm chưa hoàn thiện mô tả hoặc thiếu tính năng
      const hasCompleteDesc = item.description && item.description.trim().length >= 20 && item.features && item.features.length >= 1;
      if (!hasCompleteDesc) return false;

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

  // URL VietQR động theo chuẩn: https://img.vietqr.io/image/970422-123456789-compact2.png?amount={price}&addInfo=MUA_{id}
  const dynamicQrUrl = selectedTemplate
    ? `https://img.vietqr.io/image/970422-123456789-compact2.png?amount=${selectedTemplate.price}&addInfo=MUA_${selectedTemplate.id}`
    : '';

  // Lọc dòng trong modal theo từ khóa tìm kiếm
  const displayedRows = useMemo(() => {
    if (!tableSearch.trim()) return localRows;
    const q = tableSearch.toLowerCase().trim();
    return localRows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [localRows, tableSearch]);

  // Xử lý thêm dòng mới
  const handleAddNewRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataset) return;
    setLocalRows([newRowData, ...localRows]);
    setShowAddForm(false);
    setActionFeedback('✓ Đã ghi nhận bản ghi mới vào hệ thống demo!');
    setTimeout(() => setActionFeedback(''), 3000);
  };

  // Xử lý xóa dòng
  const handleDeleteRow = (index: number) => {
    setLocalRows((prev) => prev.filter((_, i) => i !== index));
    setActionFeedback('✓ Đã cập nhật dữ liệu bảng');
    setTimeout(() => setActionFeedback(''), 2000);
  };

  // Xử lý thao tác nhanh
  const handleQuickAction = (actionText: string) => {
    if (actionText.includes('Thêm') || actionText.includes('+') || actionText.includes('Bàn giao') || actionText.includes('Ghi nhận')) {
      setShowAddForm(true);
    } else if (actionText.includes('Xuất') || actionText.includes('Báo cáo') || actionText.includes('Đối soát')) {
      setActionFeedback(`📊 Thao tác: ${actionText} thành công!`);
      setTimeout(() => setActionFeedback(''), 3000);
    } else {
      setActionFeedback(`⚡ Đã kích hoạt nghiệp vụ: ${actionText}`);
      setTimeout(() => setActionFeedback(''), 3000);
    }
  };

  const coreAppMatch = selectedTemplate ? getCoreAppIfExactMatch(selectedTemplate) : null;

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
            <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.9, maxWidth: '780px', lineHeight: 1.6 }}>
              Khám phá 76 Web App thực chiến độc bản và 153 mẫu Google Sheets tự động hóa chuyên sâu. Mỗi sản phẩm đều được kết nối với Metadata Engine mô phỏng chính xác 100% cột dữ liệu, chỉ số KPIs và công thức nghiệp vụ tương ứng!
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

      {/* SẢN PHẨM MẪU CỜ ĐẦU (FLAGSHIP MASTER BLUEPRINT) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #091e3a 0%, #1e3a8a 60%, #0369a1 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          color: '#ffffff',
          marginBottom: '26px',
          boxShadow: '0 6px 20px rgba(2, 132, 199, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ backgroundColor: '#f59e0b', color: '#000000', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '800' }}>
              ★ SẢN PHẨM MẪU CỜ ĐẦU (FLAGSHIP DEMO)
            </span>
            <span style={{ fontSize: '12px', color: '#93c5fd', fontWeight: '700' }}>
              BẢN GỐC CHUẨN MỰC GSHEETS.VN (5 PHIÊN BẢN v1.0 → v5.0)
            </span>
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '21px', fontWeight: '800' }}>
            Hệ Thống Quản Lý Dự Án & Công Việc (Master Blueprint)
          </h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#cbd5e1', maxWidth: '680px', lineHeight: 1.5 }}>
            Trải nghiệm trọn vẹn quy trình chuẩn: Đổi version động [v1.0 - v5.0], nhật ký tính năng thật, bảng dữ liệu 10 dòng mẫu chuẩn, mở Google Sheets mô phỏng và đặt mua VietQR!
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelectApp('master_blueprint')}
          style={{
            backgroundColor: '#38bdf8',
            color: '#091e3a',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>💎</span>
          <span>Khám Phá Master Blueprint Ngay</span>
        </button>
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

                {/* DANH SÁCH TÍNH NĂNG ĐỘC BẢN */}
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

                {/* ĐỐI TƯỢNG PHÙ HỢP NẾU CÓ */}
                {item.suitableFor && item.suitableFor.length > 0 && (
                  <div style={{ marginBottom: '12px', fontSize: '11.5px', color: '#0369a1', backgroundColor: '#f0f9ff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #bae6fd', lineHeight: 1.4 }}>
                    🎯 <strong>Phù hợp:</strong> {item.suitableFor.slice(0, 3).join(', ')}
                  </div>
                )}
              </div>

              {/* FOOTER CARD: GIÁ BÁN & NÚT HÀNH ĐỘNG */}
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

                {/* HÀNG NÚT BẤM MỞ TRỰC TIẾP STRICT PRODUCT VIEWER ĐỘC BẢN */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {isWebapp ? (
                    <button
                      type="button"
                      onClick={() => handleOpenModal(item, 'webapp_demo')}
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
                    <button
                      type="button"
                      onClick={() => handleOpenModal(item, 'sheet_preview')}
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

                  <button
                    type="button"
                    onClick={() => handleOpenModal(item, isWebapp ? 'webapp_demo' : 'sheet_preview')}
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

      {/* THANH ĐIỀU HƯỚNG PHÂN TRANG */}
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
      {/* STRICT PRODUCT VIEWER MODAL: 1-TO-1 METADATA-DRIVEN ENGINE */}
      {/* ==================================================================== */}
      {selectedTemplate && dataset && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
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
              maxWidth: '1080px',
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              maxHeight: '94vh',
              overflowY: 'auto',
            }}
          >
            {/* TIÊU ĐỀ MODAL VỚI BẢN XEM TRƯỚC VÀ BADGES ĐỘC BẢN */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
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
                  <span style={{ fontSize: '11.5px', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                    {dataset.appIcon} {dataset.domainTitle}
                  </span>
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                  BẢN XEM TRƯỚC: {selectedTemplate.title}
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {coreAppMatch && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(null);
                      onSelectApp(coreAppMatch);
                    }}
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    🚀 Mở App Toàn Màn Hình
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(null)}
                  style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* TAB CHUYỂN ĐỔI 3 CHẾ ĐỘ TRẢI NGHIỆM */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setModalTab('webapp_demo')}
                style={{
                  padding: '10px 18px',
                  border: 'none',
                  borderBottom: modalTab === 'webapp_demo' ? '3px solid #0284c7' : '3px solid transparent',
                  backgroundColor: 'transparent',
                  color: modalTab === 'webapp_demo' ? '#0284c7' : '#64748b',
                  fontWeight: '700',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                ⚡ Trải nghiệm Web App Nghiệp Vụ
              </button>

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
                  borderBottom: modalTab === 'info_checkout' ? '3px solid #f59e0b' : '3px solid transparent',
                  backgroundColor: 'transparent',
                  color: modalTab === 'info_checkout' ? '#d97706' : '#64748b',
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

            {/* THÔNG BÁO TÁC VỤ PHẢN HỒI */}
            {actionFeedback && (
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                {actionFeedback}
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 1: TRẢI NGHIỆM WEB APP NGHIỆP VỤ THỰC CHIẾN (1-TO-1) */}
            {/* ================================================================ */}
            {modalTab === 'webapp_demo' && (
              <div>
                {/* 4 THẺ CHỈ SỐ KPIS ĐỘC BẢN CỦA ĐÚNG SẢN PHẨM */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                  {dataset.kpis.map((kpi, kIdx) => (
                    <div
                      key={kIdx}
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        borderLeft: `4px solid ${kpi.color || '#0284c7'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                          {kpi.label}
                        </span>
                        {kpi.icon && <span style={{ fontSize: '16px' }}>{kpi.icon}</span>}
                      </div>
                      <div style={{ fontSize: '19px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
                        {kpi.value}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {kpi.subtext}
                      </div>
                    </div>
                  ))}
                </div>

                {/* THANH THAO TÁC NHANH VÀ TÌM KIẾM DÒNG DỮ LIỆU */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {/* CÁC NÚT QUICK ACTION ĐỘC BẢN */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {dataset.quickActions.map((qa, qIdx) => (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => handleQuickAction(qa)}
                        style={{
                          backgroundColor: qIdx === 0 ? '#0284c7' : '#ffffff',
                          color: qIdx === 0 ? '#ffffff' : '#334155',
                          border: qIdx === 0 ? 'none' : '1px solid #cbd5e1',
                          padding: '7px 13px',
                          borderRadius: '6px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: qIdx === 0 ? '0 2px 4px rgba(2, 132, 199, 0.2)' : 'none',
                        }}
                      >
                        {qa}
                      </button>
                    ))}
                  </div>

                  {/* TÌM KIẾM TRONG BẢNG DỮ LIỆU */}
                  <div style={{ minWidth: '280px', flex: 1, maxWidth: '380px' }}>
                    <input
                      type="text"
                      placeholder={dataset.searchPlaceholder}
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12.5px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* FORM THÊM BẢN GHI NHANH (NẾU ĐANG BẬT) */}
                {showAddForm && (
                  <form
                    onSubmit={handleAddNewRow}
                    style={{
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                      ✍️ Thêm bản ghi mới ({dataset.domainTitle}):
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                      {dataset.sampleFormFields.map((field) => (
                        <div key={field.key}>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#475569', marginBottom: '3px' }}>
                            {field.label}:
                          </label>
                          {field.type === 'select' && field.options ? (
                            <select
                              value={newRowData[field.key] || field.defaultValue}
                              onChange={(e) => setNewRowData({ ...newRowData, [field.key]: e.target.value })}
                              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                            >
                              {field.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              value={newRowData[field.key] ?? field.defaultValue}
                              onChange={(e) => setNewRowData({ ...newRowData, [field.key]: e.target.value })}
                              style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#16a34a', color: '#ffffff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        ✓ Lưu bản ghi
                      </button>
                    </div>
                  </form>
                )}

                {/* BẢNG DỮ LIỆU TƯƠNG TÁC ĐẦY ĐỦ CỘT ĐỘC BẢN */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflowX: 'auto', marginBottom: '16px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left', backgroundColor: '#ffffff' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                        {dataset.columns.map((col, idx) => (
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
                        <th style={{ padding: '10px 12px', color: '#334155', fontWeight: '700', width: '80px', textAlign: 'center' }}>
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedRows.length > 0 ? (
                        displayedRows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            style={{
                              borderBottom: '1px solid #f1f5f9',
                              backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#fcfcfd',
                            }}
                          >
                            {dataset.columns.map((col, cIdx) => {
                              const val = row[col.key] || '—';
                              const isBadge = col.badgeStyle;
                              const isPositive = String(val).includes('✓') || String(val).includes('Đã') || String(val).includes('Hoàn thành') || String(val).includes('Khớp');
                              const isWarning = String(val).includes('⚠️') || String(val).includes('Chờ') || String(val).includes('Cao');
                              const isDanger = String(val).includes('Trễ') || String(val).includes('Nợ') || String(val).includes('Khẩn cấp');

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
                                        backgroundColor: isDanger ? '#fee2e2' : isWarning ? '#fef3c7' : isPositive ? '#dcfce7' : '#e0f2fe',
                                        color: isDanger ? '#b91c1c' : isWarning ? '#b45309' : isPositive ? '#15803d' : '#0369a1',
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
                            <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                              <button
                                type="button"
                                title="Xóa bản ghi demo này"
                                onClick={() => handleDeleteRow(rIdx)}
                                style={{
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  color: '#94a3b8',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                }}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={dataset.columns.length + 1}
                            style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}
                          >
                            Không tìm thấy bản ghi nào phù hợp với từ khóa "{tableSearch}".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* KHUNG CHUYỂN TIẾP ĐẶT MUA BẢN QUYỀN */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f9ff', padding: '14px 20px', borderRadius: '10px', border: '1px solid #bae6fd', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#0369a1' }}>
                      Bạn muốn sở hữu vĩnh viễn Web App & Mẫu Sheet này?
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Giá ưu đãi trọn đời: <strong style={{ color: '#059669', fontSize: '14px' }}>{formatVND(selectedTemplate.price)}</strong> (Bao gồm file Google Drive, code Web App và hỗ trợ kỹ thuật).
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalTab('info_checkout')}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
                    }}
                  >
                    💳 Đặt mua ngay qua VietQR ▶
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 2: XEM TRƯỚC CẤU TRÚC SHEET GIẢ LẬP GOOGLE SHEETS */}
            {/* ================================================================ */}
            {modalTab === 'sheet_preview' && (
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

                {/* KHUNG GIẢ LẬP GIAO DIỆN GOOGLE SHEETS */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  {/* THANH TIÊU ĐỀ */}
                  <div style={{ backgroundColor: '#107c41', color: '#ffffff', padding: '9px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', fontWeight: '700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>📊</span>
                      <span>Google Sheets — {selectedTemplate.title}.xlsx</span>
                    </div>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                      Chế độ: Chỉ xem mẫu
                    </span>
                  </div>

                  {/* THANH MENU */}
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

                  {/* THANH CÔNG THỨC FX CHÍNH XÁC THEO NGHIỆP VỤ */}
                  <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: '700', color: '#0f172a' }}>
                      {dataset.formulaInfo.cell}
                    </span>
                    <span style={{ color: '#0284c7', fontWeight: '800', fontStyle: 'italic' }}>fx</span>
                    <span style={{ fontFamily: 'monospace', color: '#334155', fontWeight: '600' }}>
                      {dataset.formulaInfo.formula}
                    </span>
                  </div>

                  {/* BANNER GIẢI THÍCH CÔNG THỨC */}
                  <div style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '5px 12px', fontSize: '11.5px', color: '#64748b' }}>
                    💡 <em>{dataset.formulaInfo.explanation}</em>
                  </div>

                  {/* BẢNG GRID DỮ LIỆU CÓ HEADER CỘT A, B, C... VÀ HÀNG 1, 2, 3... */}
                  <div style={{ overflowX: 'auto', maxHeight: '340px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', backgroundColor: '#ffffff' }}>
                      <thead>
                        {/* HÀNG TIÊU ĐỀ CHỮ CÁI A, B, C... */}
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                          <th style={{ width: '38px', padding: '6px', textAlign: 'center', borderRight: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '11px' }}>
                            ◰
                          </th>
                          {dataset.columns.map((col, idx) => (
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

                        {/* HÀNG 1: TÊN CÁC CỘT */}
                        <tr style={{ backgroundColor: '#e8f5e9', borderBottom: '2px solid #81c784', color: '#1b5e20' }}>
                          <td style={{ padding: '7px', textAlign: 'center', borderRight: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: '700' }}>
                            1
                          </td>
                          {dataset.columns.map((col, idx) => (
                            <th
                              key={idx}
                              style={{
                                padding: '7px 10px',
                                borderRight: '1px solid #c8e6c9',
                                fontWeight: '800',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {localRows.map((row, rIdx) => {
                          const rowNum = rIdx + 2;
                          return (
                            <tr
                              key={rIdx}
                              style={{
                                borderBottom: '1px solid #e2e8f0',
                                backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#fcfdfc',
                              }}
                            >
                              {/* CỘT SỐ HÀNG 1, 2, 3... */}
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

                              {/* CÁC Ô DỮ LIỆU */}
                              {dataset.columns.map((col, cIdx) => {
                                const val = row[col.key] || '';
                                return (
                                  <td
                                    key={cIdx}
                                    style={{
                                      padding: '7px 10px',
                                      borderRight: '1px solid #e2e8f0',
                                      color: val.includes('⚠️') ? '#b45309' : val.includes('✓') ? '#15803d' : '#1e293b',
                                      fontWeight: cIdx === 0 || val.includes('✓') ? '600' : 'normal',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {val}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* DANH SÁCH TÍNH NĂNG TÍCH HỢP */}
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
            {/* TAB 3: ĐẶT MUA QUA VIETQR ĐỘNG & NHẬN FILE BẢN QUYỀN */}
            {/* ================================================================ */}
            {modalTab === 'info_checkout' && (
              <div>
                {!orderPlaced ? (
                  <div>
                    <div style={{ border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
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

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px', alignItems: 'center' }}>
                        {/* MÃ VIETQR ĐỘNG THEO ĐÚNG CHUẨN ĐỀ BÀI */}
                        <div style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                          <img
                            src={dynamicQrUrl}
                            alt="VietQR Chuyển Khoản"
                            style={{ width: '190px', height: '190px', display: 'block', margin: '0 auto' }}
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div style={{ display: 'none', width: '190px', height: '190px', lineHeight: '190px', fontSize: '12px', color: '#64748b' }}>
                            [QR MB Bank]
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', fontWeight: '600' }}>
                            Quét bằng app mọi ngân hàng để kích hoạt tự động
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

                    {/* NÚT TRẢI NGHIỆM WEB APP NGAY */}
                    <div style={{ textAlign: 'center', marginTop: '14px' }}>
                      <button
                        type="button"
                        onClick={() => setModalTab('webapp_demo')}
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
                        ⚡ Xem Trải Nghiệm Nghiệp Vụ Demo
                      </button>
                    </div>
                  </div>
                ) : (
                  /* MÀN HÌNH XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG VÀ NÚT MỞ ZALO NHẬN FILE NGAY */
                  <div style={{ backgroundColor: '#ecfdf5', border: '2px solid #86efac', borderRadius: '16px', padding: '30px', textAlign: 'center' }}>
                    <div style={{ fontSize: '42px', marginBottom: '8px' }}>🎉</div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800', color: '#166534' }}>
                      Xác Nhận Đơn Hàng Thành Công!
                    </h3>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#15803d', lineHeight: 1.6 }}>
                      Hệ thống đã ghi nhận thanh toán cho đơn hàng <strong>MUA_{selectedTemplate.id}</strong> ({selectedTemplate.title}).<br />
                      Đường link bản quyền Google Drive đã được gửi đến hộp thư <strong>{buyerEmail}</strong>.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                      {/* NÚT MỞ ZALO NHẬN FILE NGAY */}
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
