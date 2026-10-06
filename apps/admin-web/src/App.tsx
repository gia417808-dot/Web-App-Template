import React, { useState, useMemo } from 'react';
import {
  mockProductsKV01,
  mockOrdersKD01,
  mockTransactionsKT01,
  mockWarehouseApprovalsKV02,
  mockContentsMK01,
  mockOpportunitiesKD02,
  mockSalesTargetsKD03,
  mockContractsKD04,
  mockCustomerCareKD05,
} from './mockData';

type TabId = 'KV01' | 'KD01' | 'KT01' | 'KV02' | 'MK01' | 'KD02' | 'KD03' | 'KD04' | 'KD05';

interface TabDefinition {
  id: TabId;
  label: string;
  category: 'Kho vận' | 'Kinh doanh' | 'Kế toán' | 'Marketing';
  icon: string;
}

const TABS: TabDefinition[] = [
  { id: 'KV01', label: 'Hàng Hóa (KV01)', category: 'Kho vận', icon: '📦' },
  { id: 'KV02', label: 'Phê Duyệt Kho (KV02)', category: 'Kho vận', icon: '📋' },
  { id: 'KD01', label: 'Đơn Hàng (KD01)', category: 'Kinh doanh', icon: '🛒' },
  { id: 'KD02', label: 'Cơ Hội (KD02)', category: 'Kinh doanh', icon: '🎯' },
  { id: 'KD03', label: 'Chỉ Tiêu (KD03)', category: 'Kinh doanh', icon: '📈' },
  { id: 'KD04', label: 'Hợp Đồng (KD04)', category: 'Kinh doanh', icon: '📑' },
  { id: 'KD05', label: 'Chăm Sóc (KD05)', category: 'Kinh doanh', icon: '🤝' },
  { id: 'KT01', label: 'Giao Dịch (KT01)', category: 'Kế toán', icon: '💰' },
  { id: 'MK01', label: 'Nội Dung (MK01)', category: 'Marketing', icon: '📢' },
];

function formatVND(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('KV01');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentTabDef = TABS.find((t) => t.id === activeTab)!;

  // Xử lý filter và search tùy theo Tab
  const { filteredItems, statusOptions, summaryCards } = useMemo(() => {
    let raw: any[] = [];
    let statuses: string[] = [];
    let cards: { label: string; value: string | number; color: string }[] = [];

    switch (activeTab) {
      case 'KV01': {
        raw = mockProductsKV01;
        statuses = Array.from(new Set(raw.map((i) => i.status)));
        const totalItems = raw.reduce((sum, i) => sum + i.stock, 0);
        const lowStock = raw.filter((i) => i.status === 'Sắp hết hàng').length;
        cards = [
          { label: 'Tổng số SKU', value: raw.length, color: '#2563eb' },
          { label: 'Tổng lượng tồn', value: totalItems.toLocaleString(), color: '#059669' },
          { label: 'Sản phẩm sắp hết', value: lowStock, color: lowStock > 0 ? '#dc2626' : '#16a34a' },
        ];
        break;
      }
      case 'KD01': {
        raw = mockOrdersKD01;
        statuses = Array.from(new Set(raw.map((i) => i.status)));
        const totalRev = raw.reduce((sum, i) => sum + i.total_vnd, 0);
        const completed = raw.filter((i) => i.status === 'Hoàn thành').length;
        cards = [
          { label: 'Tổng đơn hàng', value: raw.length, color: '#2563eb' },
          { label: 'Tổng doanh thu', value: formatVND(totalRev), color: '#059669' },
          { label: 'Đơn hoàn thành', value: completed, color: '#16a34a' },
        ];
        break;
      }
      case 'KT01': {
        raw = mockTransactionsKT01;
        statuses = Array.from(new Set(raw.map((i) => i.status)));
        const totalThu = raw.filter((i) => i.type === 'Thu').reduce((s, i) => s + i.amount_vnd, 0);
        const totalChi = raw.filter((i) => i.type === 'Chi').reduce((s, i) => s + i.amount_vnd, 0);
        cards = [
          { label: 'Tổng giao dịch', value: raw.length, color: '#2563eb' },
          { label: 'Tổng dòng tiền vào (Thu)', value: formatVND(totalThu), color: '#059669' },
          { label: 'Tổng chi phí (Chi)', value: formatVND(totalChi), color: '#dc2626' },
        ];
        break;
      }
      case 'KV02': {
        raw = mockWarehouseApprovalsKV02;
        statuses = Array.from(new Set(raw.map((i) => i.status)));
        const pending = raw.filter((i) => i.status === 'Chờ duyệt').length;
        cards = [
          { label: 'Tổng phiếu kho', value: raw.length, color: '#2563eb' },
          { label: 'Phiếu đã duyệt', value: raw.filter((i) => i.status === 'Đã duyệt').length, color: '#059669' },
          { label: 'Chờ phê duyệt', value: pending, color: pending > 0 ? '#d97706' : '#16a34a' },
        ];
        break;
      }
      case 'MK01': {
        raw = mockContentsMK01;
        statuses = Array.from(new Set(raw.map((i) => i.status)));
        const onTimeRate = (raw.filter((i) => i.on_time).length / raw.length) * 100;
        cards = [
          { label: 'Tổng số nội dung', value: raw.length, color: '#2563eb' },
          { label: 'Đã xuất bản', value: raw.filter((i) => i.status === 'Đã xuất bản').length, color: '#059669' },
          { label: 'Tỷ lệ đúng hạn', value: `${onTimeRate.toFixed(1)}%`, color: '#7c3aed' },
        ];
        break;
      }
      case 'KD02': {
        raw = mockOpportunitiesKD02;
        statuses = Array.from(new Set(raw.map((i) => i.stage)));
        const totalExpected = raw.reduce((s, i) => s + i.expected_value_vnd, 0);
        cards = [
          { label: 'Số cơ hội mở', value: raw.length, color: '#2563eb' },
          { label: 'Tổng giá trị kỳ vọng', value: formatVND(totalExpected), color: '#059669' },
          { label: 'Chốt thành công', value: raw.filter((i) => i.stage === 'Chốt thành công').length, color: '#16a34a' },
        ];
        break;
      }
      case 'KD03': {
        raw = mockSalesTargetsKD03;
        statuses = Array.from(new Set(raw.map((i) => i.status)));
        const totalTarget = raw.reduce((s, i) => s + i.target_vnd, 0);
        const totalActual = raw.reduce((s, i) => s + i.actual_vnd, 0);
        cards = [
          { label: 'Kỳ đánh giá', value: raw.length, color: '#2563eb' },
          { label: 'Tổng chỉ tiêu giao', value: formatVND(totalTarget), color: '#4b5563' },
          { label: 'Thực đạt lũy kế', value: formatVND(totalActual), color: '#059669' },
        ];
        break;
      }
      case 'KD04': {
        raw = mockContractsKD04;
        statuses = Array.from(new Set(raw.map((i) => i.status)));
        const needRemind = raw.filter((i) => i.should_remind).length;
        cards = [
          { label: 'Hợp đồng quản lý', value: raw.length, color: '#2563eb' },
          { label: 'Hợp đồng hiệu lực', value: raw.filter((i) => i.status === 'Hiệu lực').length, color: '#059669' },
          { label: 'Cần nhắc gia hạn', value: needRemind, color: needRemind > 0 ? '#dc2626' : '#16a34a' },
        ];
        break;
      }
      case 'KD05': {
        raw = mockCustomerCareKD05;
        statuses = Array.from(new Set(raw.map((i) => i.status)));
        const avgScore = raw.reduce((s, i) => s + i.satisfaction_score, 0) / raw.length;
        cards = [
          { label: 'Khách hàng chăm sóc', value: raw.length, color: '#2563eb' },
          { label: 'Điểm hài lòng TB', value: `${avgScore.toFixed(1)} / 10`, color: '#059669' },
          { label: 'Khách cần chú ý', value: raw.filter((i) => i.status === 'Cần chú ý').length, color: '#dc2626' },
        ];
        break;
      }
    }

    const filtered = raw.filter((item) => {
      const matchSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter || item.stage === statusFilter;
      return matchSearch && matchStatus;
    });

    return { filteredItems: filtered, statusOptions: statuses, summaryCards: cards };
  }, [activeTab, searchTerm, statusFilter]);

  // Phân trang
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const currentPagedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setSearchTerm('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* SIDEBAR BÊN TRÁI */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '0.5px' }}>
            ⚡ ERP DASHBOARD
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Hệ thống quản trị hợp nhất</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {['Kho vận', 'Kinh doanh', 'Kế toán', 'Marketing'].map((cat) => (
            <div key={cat} style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', padding: '0 10px', marginBottom: '6px' }}>
                {cat}
              </div>
              {TABS.filter((t) => t.category === cat).map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isActive ? '#2563eb' : 'transparent',
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      cursor: 'pointer',
                      fontSize: '13.5px',
                      fontWeight: isActive ? '600' : 'normal',
                      textAlign: 'left',
                      transition: 'all 0.15s ease-in-out',
                      marginBottom: '4px',
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid #1e293b', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
          Trạng thái: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Hoạt động 100%</span>
        </div>
      </aside>

      {/* KHU VỰC NỘI DUNG CHÍNH */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* HEADER */}
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              HỆ THỐNG QUẢN TRỊ KINH DOANH & VẬN HÀNH
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Phân hệ đang xem: <strong style={{ color: '#2563eb' }}>{currentTabDef.label}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '20px', fontWeight: '500' }}>
              Chế độ: Dữ liệu chuẩn hoá (Offline Ready)
            </span>
          </div>
        </header>

        {/* THẺ THỐNG KÊ (METRICS CARDS) */}
        <div style={{ padding: '24px 32px 0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {summaryCards.map((card, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{card.label}</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: card.color }}>{card.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BẢNG DỮ LIỆU CHÍNH */}
        <div style={{ padding: '24px 32px', flex: 1 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {/* THANH TÌM KIẾM VÀ BỘ LỌC */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm theo từ khóa..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    width: '100%',
                    maxWidth: '360px',
                    outline: 'none',
                  }}
                />

                {statusOptions.length > 0 && (
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                    }}
                  >
                    <option value="ALL">-- Tất cả trạng thái --</option>
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Tìm thấy: <strong>{filteredItems.length}</strong> bản ghi
              </div>
            </div>

            {/* BẢNG THỂ HIỆN DỮ LIỆU */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                    {activeTab === 'KV01' && (
                      <>
                        <th style={{ padding: '12px 16px' }}>Mã SKU</th>
                        <th style={{ padding: '12px 16px' }}>Tên sản phẩm</th>
                        <th style={{ padding: '12px 16px' }}>Tồn kho</th>
                        <th style={{ padding: '12px 16px' }}>Đơn vị tính</th>
                        <th style={{ padding: '12px 16px' }}>Mức tối thiểu</th>
                        <th style={{ padding: '12px 16px' }}>Mức tối đa</th>
                        <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                      </>
                    )}
                    {activeTab === 'KD01' && (
                      <>
                        <th style={{ padding: '12px 16px' }}>Mã đơn hàng</th>
                        <th style={{ padding: '12px 16px' }}>Khách hàng</th>
                        <th style={{ padding: '12px 16px' }}>Tổng tiền</th>
                        <th style={{ padding: '12px 16px' }}>Ngày đặt</th>
                        <th style={{ padding: '12px 16px' }}>Trạng thái xử lý</th>
                      </>
                    )}
                    {activeTab === 'KT01' && (
                      <>
                        <th style={{ padding: '12px 16px' }}>Mã GD</th>
                        <th style={{ padding: '12px 16px' }}>Loại thu/chi</th>
                        <th style={{ padding: '12px 16px' }}>Số tiền</th>
                        <th style={{ padding: '12px 16px' }}>Người thực hiện</th>
                        <th style={{ padding: '12px 16px' }}>Ngày giao dịch</th>
                        <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                      </>
                    )}
                    {activeTab === 'KV02' && (
                      <>
                        <th style={{ padding: '12px 16px' }}>Mã phiếu</th>
                        <th style={{ padding: '12px 16px' }}>Loại phiếu</th>
                        <th style={{ padding: '12px 16px' }}>Kho hàng</th>
                        <th style={{ padding: '12px 16px' }}>Người tạo</th>
                        <th style={{ padding: '12px 16px' }}>Ngày tạo</th>
                        <th style={{ padding: '12px 16px' }}>Trạng thái duyệt</th>
                      </>
                    )}
                    {activeTab === 'MK01' && (
                      <>
                        <th style={{ padding: '12px 16px' }}>Mã nội dung</th>
                        <th style={{ padding: '12px 16px' }}>Tiêu đề</th>
                        <th style={{ padding: '12px 16px' }}>Kênh phân phối</th>
                        <th style={{ padding: '12px 16px' }}>Lên lịch lúc</th>
                        <th style={{ padding: '12px 16px' }}>Đúng hạn</th>
                        <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                      </>
                    )}
                    {activeTab === 'KD02' && (
                      <>
                        <th style={{ padding: '12px 16px' }}>Mã cơ hội</th>
                        <th style={{ padding: '12px 16px' }}>Khách hàng</th>
                        <th style={{ padding: '12px 16px' }}>Giá trị kỳ vọng</th>
                        <th style={{ padding: '12px 16px' }}>Xác suất (%)</th>
                        <th style={{ padding: '12px 16px' }}>Giai đoạn bán hàng</th>
                      </>
                    )}
                    {activeTab === 'KD03' && (
                      <>
                        <th style={{ padding: '12px 16px' }}>Kỳ đánh giá</th>
                        <th style={{ padding: '12px 16px' }}>Chỉ tiêu giao</th>
                        <th style={{ padding: '12px 16px' }}>Thực đạt</th>
                        <th style={{ padding: '12px 16px' }}>Tiến độ (%)</th>
                        <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                      </>
                    )}
                    {activeTab === 'KD04' && (
                      <>
                        <th style={{ padding: '12px 16px' }}>Mã hợp đồng</th>
                        <th style={{ padding: '12px 16px' }}>Khách hàng</th>
                        <th style={{ padding: '12px 16px' }}>Giá trị hợp đồng</th>
                        <th style={{ padding: '12px 16px' }}>Ngày hết hạn</th>
                        <th style={{ padding: '12px 16px' }}>Nhắc gia hạn</th>
                        <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                      </>
                    )}
                    {activeTab === 'KD05' && (
                      <>
                        <th style={{ padding: '12px 16px' }}>Mã khách hàng</th>
                        <th style={{ padding: '12px 16px' }}>Tên khách hàng</th>
                        <th style={{ padding: '12px 16px' }}>Lần liên hệ cuối</th>
                        <th style={{ padding: '12px 16px' }}>Điểm hài lòng</th>
                        <th style={{ padding: '12px 16px' }}>Trạng thái hỗ trợ</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentPagedItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                        Không có dữ liệu phù hợp với điều kiện tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    currentPagedItems.map((row: any) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {activeTab === 'KV01' && (
                          <>
                            <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a' }}>{row.sku}</td>
                            <td style={{ padding: '12px 16px' }}>{row.name}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{row.stock}</td>
                            <td style={{ padding: '12px 16px' }}>{row.unit}</td>
                            <td style={{ padding: '12px 16px', color: '#64748b' }}>{row.min_qty}</td>
                            <td style={{ padding: '12px 16px', color: '#64748b' }}>{row.max_qty}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  backgroundColor:
                                    row.status === 'Đủ tồn kho' ? '#dcfce7' : row.status === 'Sắp hết hàng' ? '#fee2e2' : '#fef3c7',
                                  color:
                                    row.status === 'Đủ tồn kho' ? '#166534' : row.status === 'Sắp hết hàng' ? '#991b1b' : '#92400e',
                                }}
                              >
                                {row.status}
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === 'KD01' && (
                          <>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{row.code}</td>
                            <td style={{ padding: '12px 16px' }}>{row.customer}</td>
                            <td style={{ padding: '12px 16px', fontWeight: '600', color: '#059669' }}>{formatVND(row.total_vnd)}</td>
                            <td style={{ padding: '12px 16px' }}>{row.order_date}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  backgroundColor: row.status === 'Hoàn thành' ? '#dcfce7' : '#e0f2fe',
                                  color: row.status === 'Hoàn thành' ? '#166534' : '#0369a1',
                                }}
                              >
                                {row.status}
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === 'KT01' && (
                          <>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{row.code}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ color: row.type === 'Thu' ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                                {row.type}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{formatVND(row.amount_vnd)}</td>
                            <td style={{ padding: '12px 16px' }}>{row.performer}</td>
                            <td style={{ padding: '12px 16px' }}>{row.date}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', backgroundColor: '#f1f5f9' }}>
                                {row.status}
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === 'KV02' && (
                          <>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{row.code}</td>
                            <td style={{ padding: '12px 16px' }}>{row.movement_type}</td>
                            <td style={{ padding: '12px 16px' }}>{row.warehouse}</td>
                            <td style={{ padding: '12px 16px' }}>{row.creator}</td>
                            <td style={{ padding: '12px 16px' }}>{row.created_date}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  backgroundColor: row.status === 'Đã duyệt' ? '#dcfce7' : '#fef3c7',
                                  color: row.status === 'Đã duyệt' ? '#166534' : '#92400e',
                                }}
                              >
                                {row.status}
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === 'MK01' && (
                          <>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{row.code}</td>
                            <td style={{ padding: '12px 16px' }}>{row.title}</td>
                            <td style={{ padding: '12px 16px', color: '#6366f1' }}>{row.channel}</td>
                            <td style={{ padding: '12px 16px' }}>{row.scheduled_at}</td>
                            <td style={{ padding: '12px 16px' }}>{row.on_time ? '✅ Đúng hạn' : '⚠️ Trễ'}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', backgroundColor: '#f1f5f9' }}>
                                {row.status}
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === 'KD02' && (
                          <>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{row.code}</td>
                            <td style={{ padding: '12px 16px' }}>{row.customer}</td>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{formatVND(row.expected_value_vnd)}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{row.probability_pct}%</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                                {row.stage}
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === 'KD03' && (
                          <>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{row.period}</td>
                            <td style={{ padding: '12px 16px' }}>{formatVND(row.target_vnd)}</td>
                            <td style={{ padding: '12px 16px', fontWeight: '600', color: '#059669' }}>{formatVND(row.actual_vnd)}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{row.progress_pct}%</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', backgroundColor: '#f0fdf4', color: '#15803d' }}>
                                {row.status}
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === 'KD04' && (
                          <>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{row.code}</td>
                            <td style={{ padding: '12px 16px' }}>{row.customer}</td>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{formatVND(row.contract_value_vnd)}</td>
                            <td style={{ padding: '12px 16px' }}>{row.expiry_date}</td>
                            <td style={{ padding: '12px 16px' }}>
                              {row.should_remind ? (
                                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>⚠️ CẦN NHẮC</span>
                              ) : (
                                <span style={{ color: '#16a34a' }}>Bình thường</span>
                              )}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', backgroundColor: '#f1f5f9' }}>
                                {row.status}
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === 'KD05' && (
                          <>
                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{row.customer_id}</td>
                            <td style={{ padding: '12px 16px' }}>{row.customer_name}</td>
                            <td style={{ padding: '12px 16px' }}>{row.last_contact_date}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#eab308' }}>⭐ {row.satisfaction_score}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  backgroundColor: row.status === 'Hài lòng' ? '#dcfce7' : '#fee2e2',
                                  color: row.status === 'Hài lòng' ? '#166534' : '#991b1b',
                                }}
                              >
                                {row.status}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* THANH PHÂN TRANG (PAGINATION) */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Trang {currentPage} / {totalPages}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: currentPage <= 1 ? '#f1f5f9' : '#ffffff',
                    color: currentPage <= 1 ? '#94a3b8' : '#334155',
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                  }}
                >
                  ◀ Trang trước
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: currentPage >= totalPages ? '#f1f5f9' : '#ffffff',
                    color: currentPage >= totalPages ? '#94a3b8' : '#334155',
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Trang sau ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
