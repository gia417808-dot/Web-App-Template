import React, { useState, useMemo } from 'react';
import {
  initialWarehouseItems,
  initialMovementLogs,
  WarehouseStockItem,
  StockMovementLog,
} from '../mock/deepMockData';

interface WarehouseAppProps {
  onBack?: () => void;
}

export default function WarehouseApp({ onBack }: WarehouseAppProps = {}) {
  const [items, setItems] = useState<WarehouseStockItem[]>(initialWarehouseItems);
  const [logs, setLogs] = useState<StockMovementLog[]>(initialMovementLogs);
  const [selectedWarehouse, setSelectedWarehouse] = useState<'Tất cả' | 'Kho Hà Nội' | 'Kho Sài Gòn' | 'Kho Tổng'>('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'movements' | 'alerts'>('inventory');

  // Modal tạo phiếu nhập/xuất
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [movementType, setMovementType] = useState<'Nhập kho' | 'Xuất kho' | 'Điều chuyển'>('Nhập kho');
  const [selectedSku, setSelectedSku] = useState(items[0]?.sku || '');
  const [movementQty, setMovementQty] = useState(5);
  const [fromWh, setFromWh] = useState('Nhà cung cấp');
  const [toWh, setToWh] = useState('Kho Hà Nội');
  const [movementNote, setMovementNote] = useState('Nhập hàng bổ sung đợt mới');

  // Modal in phiếu kho
  const [printLog, setPrintLog] = useState<StockMovementLog | null>(null);

  const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Thống kê tổng quan
  const stats = useMemo(() => {
    let totalQty = 0;
    let totalCostVal = 0;
    let lowStockCount = 0;

    items.forEach((item) => {
      const qty =
        selectedWarehouse === 'Kho Hà Nội'
          ? item.stock_hanoi
          : selectedWarehouse === 'Kho Sài Gòn'
          ? item.stock_saigon
          : item.stock_tong;

      totalQty += qty;
      totalCostVal += qty * item.price_cost_vnd;
      if (qty <= item.min_limit) {
        lowStockCount++;
      }
    });

    return { totalQty, totalCostVal, lowStockCount, totalSku: items.length };
  }, [items, selectedWarehouse]);

  // Lọc sản phẩm
  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const matchSearch =
        i.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        i.sku.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        i.category.toLowerCase().includes(searchTerm.toLowerCase().trim());

      if (activeSubTab === 'alerts') {
        const qty =
          selectedWarehouse === 'Kho Hà Nội'
            ? i.stock_hanoi
            : selectedWarehouse === 'Kho Sài Gòn'
            ? i.stock_saigon
            : i.stock_tong;
        return matchSearch && (qty <= i.min_limit || qty >= i.max_limit);
      }

      return matchSearch;
    });
  }, [items, searchTerm, activeSubTab, selectedWarehouse]);

  // Xử lý tạo phiếu nhập/xuất kho
  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = items.find((i) => i.sku === selectedSku);
    if (!prod || movementQty <= 0) return;

    const newCode = `PXN-2026-${String(logs.length + 1).padStart(3, '0')}`;
    const newLog: StockMovementLog = {
      id: `M-${Date.now()}`,
      code: newCode,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: movementType,
      sku: prod.sku,
      product_name: prod.name,
      quantity: Number(movementQty),
      from_warehouse: fromWh,
      to_warehouse: toWh,
      performer: 'Thủ kho trưởng',
      note: movementNote,
    };

    // Cập nhật tồn kho theo logic
    setItems((prev) =>
      prev.map((item) => {
        if (item.sku !== selectedSku) return item;

        let { stock_tong, stock_hanoi, stock_saigon } = item;
        const q = Number(movementQty);

        if (movementType === 'Nhập kho') {
          if (toWh.includes('Hà Nội')) stock_hanoi += q;
          else if (toWh.includes('Sài Gòn')) stock_saigon += q;
          stock_tong += q;
        } else if (movementType === 'Xuất kho') {
          if (fromWh.includes('Hà Nội')) stock_hanoi = Math.max(0, stock_hanoi - q);
          else if (fromWh.includes('Sài Gòn')) stock_saigon = Math.max(0, stock_saigon - q);
          stock_tong = Math.max(0, stock_tong - q);
        } else if (movementType === 'Điều chuyển') {
          if (fromWh.includes('Hà Nội')) stock_hanoi = Math.max(0, stock_hanoi - q);
          if (fromWh.includes('Sài Gòn')) stock_saigon = Math.max(0, stock_saigon - q);
          if (toWh.includes('Hà Nội')) stock_hanoi += q;
          if (toWh.includes('Sài Gòn')) stock_saigon += q;
        }

        return { ...item, stock_tong, stock_hanoi, stock_saigon };
      })
    );

    setLogs([newLog, ...logs]);
    setShowCreateModal(false);
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* HEADER WEBAPP KHO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>📦</span>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                Hệ Thống Quản Lý Kho Đa Kho v3.0
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748b' }}>
                Kiểm soát tồn kho thời gian thực tại Kho Hà Nội, Kho Sài Gòn và Kho Tổng
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                backgroundColor: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '9px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ← Quay lại Sàn Marketplace
            </button>
          )}
          <button
            onClick={() => {
              setMovementType('Nhập kho');
              setFromWh('Nhà cung cấp');
              setToWh('Kho Hà Nội');
              setShowCreateModal(true);
            }}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
            }}
          >
            + Tạo Phiếu Nhập / Xuất
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>Danh mục sản phẩm</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0284c7' }}>{stats.totalSku} SKU</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Đang quản lý trên hệ thống</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>Tổng lượng tồn ({selectedWarehouse})</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#059669' }}>{stats.totalQty.toLocaleString()} món</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Đầy đủ hóa đơn chứng từ</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>Tổng giá trị tồn kho (Giá vốn)</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#7c3aed' }}>{formatVND(stats.totalCostVal)}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Tính theo giá nhập bình quân</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>Sản phẩm chạm ngưỡng cảnh báo</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: stats.lowStockCount > 0 ? '#dc2626' : '#16a34a' }}>
            {stats.lowStockCount} SKU
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Tồn dưới min hoặc vượt max</div>
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG SUB-TAB VÀ BỘ LỌC KHO */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveSubTab('inventory')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeSubTab === 'inventory' ? '#0f172a' : '#f1f5f9',
                color: activeSubTab === 'inventory' ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              📋 Danh mục tồn kho (16 SKU)
            </button>
            <button
              onClick={() => setActiveSubTab('movements')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeSubTab === 'movements' ? '#0f172a' : '#f1f5f9',
                color: activeSubTab === 'movements' ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              🔄 Nhật ký Nhập / Xuất ({logs.length})
            </button>
            <button
              onClick={() => setActiveSubTab('alerts')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeSubTab === 'alerts' ? '#dc2626' : '#fee2e2',
                color: activeSubTab === 'alerts' ? '#ffffff' : '#dc2626',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              ⚠️ Cảnh báo Min / Max ({stats.lowStockCount})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Kho xem:</span>
              <select
                value={selectedWarehouse}
                onChange={(e: any) => setSelectedWarehouse(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="Tất cả">Tất cả các kho (Kho Tổng)</option>
                <option value="Kho Hà Nội">Chi nhánh Kho Hà Nội</option>
                <option value="Kho Sài Gòn">Chi nhánh Kho Sài Gòn</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="🔍 Tìm tên sản phẩm, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
                width: '200px',
              }}
            />
          </div>
        </div>

        {/* NỘI DUNG SUBTAB 1 & 3: DANH MỤC HÀNG HÓA TỒN KHO */}
        {(activeSubTab === 'inventory' || activeSubTab === 'alerts') && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px' }}>Mã SKU</th>
                  <th style={{ padding: '12px 16px' }}>Tên sản phẩm</th>
                  <th style={{ padding: '12px 16px' }}>Nhóm hàng</th>
                  <th style={{ padding: '12px 16px' }}>Đơn vị</th>
                  <th style={{ padding: '12px 16px' }}>Giá vốn</th>
                  <th style={{ padding: '12px 16px' }}>Giá bán</th>
                  <th style={{ padding: '12px 16px' }}>Kho Hà Nội</th>
                  <th style={{ padding: '12px 16px' }}>Kho Sài Gòn</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700', color: '#0284c7' }}>Tổng Tồn</th>
                  <th style={{ padding: '12px 16px' }}>Định mức (Min/Max)</th>
                  <th style={{ padding: '12px 16px' }}>Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const isLow = item.stock_tong <= item.min_limit;
                  const isOver = item.stock_tong >= item.max_limit;
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0f172a' }}>{item.sku}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '500' }}>{item.name}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{item.category}</td>
                      <td style={{ padding: '12px 16px' }}>{item.unit}</td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{formatVND(item.price_cost_vnd)}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#059669' }}>{formatVND(item.price_sell_vnd)}</td>
                      <td style={{ padding: '12px 16px', color: '#2563eb', fontWeight: '600' }}>{item.stock_hanoi}</td>
                      <td style={{ padding: '12px 16px', color: '#7c3aed', fontWeight: '600' }}>{item.stock_saigon}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>
                        {item.stock_tong}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px' }}>
                        {item.min_limit} / {item.max_limit}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {isLow ? (
                          <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                            ⚠️ Sắp hết
                          </span>
                        ) : isOver ? (
                          <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                            ⚡ Vượt tồn
                          </span>
                        ) : (
                          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                            ✓ Đủ tồn
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* NỘI DUNG SUBTAB 2: NHẬT KÝ NHẬP / XUẤT */}
        {activeSubTab === 'movements' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px' }}>Số phiếu</th>
                  <th style={{ padding: '12px 16px' }}>Ngày giờ</th>
                  <th style={{ padding: '12px 16px' }}>Loại phiếu</th>
                  <th style={{ padding: '12px 16px' }}>Sản phẩm</th>
                  <th style={{ padding: '12px 16px' }}>Số lượng</th>
                  <th style={{ padding: '12px 16px' }}>Từ kho / Nguồn</th>
                  <th style={{ padding: '12px 16px' }}>Đến kho / Đích</th>
                  <th style={{ padding: '12px 16px' }}>Người thực hiện</th>
                  <th style={{ padding: '12px 16px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0284c7' }}>{log.code}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{log.date}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor:
                            log.type === 'Nhập kho' ? '#dcfce7' : log.type === 'Xuất kho' ? '#fee2e2' : '#e0e7ff',
                          color:
                            log.type === 'Nhập kho' ? '#166534' : log.type === 'Xuất kho' ? '#991b1b' : '#3730a3',
                        }}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{log.product_name}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '700' }}>{log.quantity}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{log.from_warehouse}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{log.to_warehouse}</td>
                    <td style={{ padding: '12px 16px' }}>{log.performer}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => setPrintLog(log)}
                        style={{
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#1e293b',
                        }}
                      >
                        🖨️ In Phiếu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL TẠO PHIẾU NHẬP / XUẤT KHO */}
      {showCreateModal && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                Tạo Phiếu Điều Chuyển Kho Hàng Mới
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMovement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Loại thao tác:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['Nhập kho', 'Xuất kho', 'Điều chuyển'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => {
                        setMovementType(t);
                        if (t === 'Nhập kho') {
                          setFromWh('Nhà cung cấp');
                          setToWh('Kho Hà Nội');
                        } else if (t === 'Xuất kho') {
                          setFromWh('Kho Hà Nội');
                          setToWh('Khách hàng');
                        } else {
                          setFromWh('Kho Hà Nội');
                          setToWh('Kho Sài Gòn');
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: movementType === t ? '2px solid #0284c7' : '1px solid #cbd5e1',
                        backgroundColor: movementType === t ? '#f0f9ff' : '#ffffff',
                        color: movementType === t ? '#0284c7' : '#475569',
                        fontWeight: '600',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Chọn sản phẩm:
                </label>
                <select
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}
                >
                  {items.map((i) => (
                    <option key={i.sku} value={i.sku}>
                      {i.sku} - {i.name} (Tồn hiện tại: {i.stock_tong} {i.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Từ kho / Nguồn xuất:
                  </label>
                  <input
                    type="text"
                    value={fromWh}
                    onChange={(e) => setFromWh(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Đến kho / Nơi nhận:
                  </label>
                  <input
                    type="text"
                    value={toWh}
                    onChange={(e) => setToWh(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Số lượng ({items.find((i) => i.sku === selectedSku)?.unit || 'Cái'}):
                </label>
                <input
                  type="number"
                  min="1"
                  value={movementQty}
                  onChange={(e) => setMovementQty(Math.max(1, Number(e.target.value)))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 'bold', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Ghi chú lý do:
                </label>
                <input
                  type="text"
                  value={movementNote}
                  onChange={(e) => setMovementNote(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '13px' }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                >
                  Xác nhận & Cập nhật tồn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IN PHIẾU KHO CHUẨN */}
      {printLog && (
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
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '650px',
              width: '100%',
              padding: '36px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              fontFamily: 'serif',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>CÔNG TY CỔ PHẦN G-SHEETS VIỆT NAM</div>
                <div style={{ fontSize: '12px' }}>Địa chỉ: Tầng 6, Tòa nhà Công Nghệ, Ba Đình, Hà Nội</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px' }}>
                <div>Mẫu số: 02-VT (Ban hành theo TT 200/2014)</div>
                <div>Số phiếu: <strong>{printLog.code}</strong></div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                PHIẾU {printLog.type.toUpperCase()}
              </h2>
              <div style={{ fontSize: '13px', fontStyle: 'italic' }}>
                Ngày lập: {printLog.date}
              </div>
            </div>

            <div style={{ fontSize: '13.5px', lineHeight: 1.8, marginBottom: '20px' }}>
              <div>Họ tên người giao/nhận: <strong>{printLog.performer}</strong></div>
              <div>Xuất tại kho (Nguồn): <strong>{printLog.from_warehouse}</strong></div>
              <div>Nhập tại kho (Đích): <strong>{printLog.to_warehouse}</strong></div>
              <div>Lý do / Diễn giải: <strong>{printLog.note}</strong></div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'center' }}>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>STT</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Mã SKU</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Tên sản phẩm, quy cách</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>ĐVT</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ textAlign: 'center' }}>
                  <td style={{ border: '1px solid #000', padding: '10px' }}>01</td>
                  <td style={{ border: '1px solid #000', padding: '10px', fontWeight: 'bold' }}>{printLog.sku}</td>
                  <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'left' }}>{printLog.product_name}</td>
                  <td style={{ border: '1px solid #000', padding: '10px' }}>Cái</td>
                  <td style={{ border: '1px solid #000', padding: '10px', fontWeight: 'bold' }}>{printLog.quantity}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center', fontSize: '13px', marginTop: '30px' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Người lập phiếu</div>
                <div style={{ fontSize: '11.5px', fontStyle: 'italic' }}>(Ký, họ tên)</div>
                <div style={{ marginTop: '45px', fontWeight: '600' }}>{printLog.performer}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Thủ kho</div>
                <div style={{ fontSize: '11.5px', fontStyle: 'italic' }}>(Ký, họ tên)</div>
                <div style={{ marginTop: '45px', fontWeight: '600' }}>Nguyễn Văn Long</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Kế toán trưởng</div>
                <div style={{ fontSize: '11.5px', fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</div>
                <div style={{ marginTop: '45px', fontWeight: '600' }}>Phạm Thu Hằng</div>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '36px' }}>
              <button
                onClick={() => setPrintLog(null)}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontFamily: 'sans-serif',
                }}
              >
                Đóng bản xem in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
