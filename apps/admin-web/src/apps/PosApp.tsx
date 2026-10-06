import React, { useState, useMemo } from 'react';
import { initialMenuItems, initialTables, MenuItem, TableItem } from '../mock/deepMockData';

export default function PosApp() {
  const [tables, setTables] = useState<TableItem[]>(initialTables);
  const [menuItems] = useState<MenuItem[]>(initialMenuItems);
  const [selectedTableId, setSelectedTableId] = useState<number>(1);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('Tất cả');
  const [menuSearch, setMenuSearch] = useState<string>('');

  // Modal VietQR
  const [showQrModal, setShowQrModal] = useState(false);
  // Modal Hóa đơn in
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const categories = ['Tất cả', 'Cà phê', 'Trà & Trà sữa', 'Bánh & Tráng miệng', 'Ăn nhẹ'];

  // Lọc món theo category & search
  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = selectedMenuCategory === 'Tất cả' || item.category === selectedMenuCategory;
      const matchSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase().trim());
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedMenuCategory, menuSearch]);

  // Tính tiền bàn hiện tại
  const { subtotal, discount, vat, totalPayment } = useMemo(() => {
    const sub = selectedTable.current_order.reduce((sum, item) => sum + item.price_vnd * item.quantity, 0);
    const disc = 0; // Giảm giá
    const v = Math.round((sub - disc) * 0.08); // VAT 8%
    const tot = sub - disc + v;
    return { subtotal: sub, discount: disc, vat: v, totalPayment: tot };
  }, [selectedTable]);

  // Thêm món vào bàn
  const addItemToOrder = (item: MenuItem) => {
    setTables((prev) =>
      prev.map((tbl) => {
        if (tbl.id !== selectedTableId) return tbl;

        const existing = tbl.current_order.find((i) => i.menu_item_id === item.id);
        let updatedOrder = [];
        if (existing) {
          updatedOrder = tbl.current_order.map((i) =>
            i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          updatedOrder = [
            ...tbl.current_order,
            { menu_item_id: item.id, name: item.name, quantity: 1, price_vnd: item.price_vnd },
          ];
        }

        return {
          ...tbl,
          status: 'Đang phục vụ',
          guest_count: tbl.guest_count || 2,
          check_in_time: tbl.check_in_time || '10:00',
          current_order: updatedOrder,
        };
      })
    );
  };

  // Tăng/giảm số lượng món
  const changeItemQuantity = (menuItemId: string, delta: number) => {
    setTables((prev) =>
      prev.map((tbl) => {
        if (tbl.id !== selectedTableId) return tbl;

        const updatedOrder = tbl.current_order
          .map((i) => (i.menu_item_id === menuItemId ? { ...i, quantity: i.quantity + delta } : i))
          .filter((i) => i.quantity > 0);

        return {
          ...tbl,
          current_order: updatedOrder,
          status: updatedOrder.length === 0 ? 'Trống' : tbl.status,
        };
      })
    );
  };

  // Thanh toán hoàn tất
  const handleCheckoutComplete = () => {
    setTables((prev) =>
      prev.map((tbl) => {
        if (tbl.id !== selectedTableId) return tbl;
        return { ...tbl, status: 'Trống', guest_count: 0, check_in_time: undefined, current_order: [] };
      })
    );
    setShowQrModal(false);
    setShowInvoiceModal(false);
  };

  // VietQR Image URL
  const qrUrl = `https://img.vietqr.io/image/mbbank-0987654321-compact2.png?amount=${totalPayment}&addInfo=Ban${selectedTableId}%20ThanhToan&accountName=QUAN%20CAFE%20GSHEETS`;

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* HEADER POS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>☕</span>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
              Phần Mềm Quản Lý Bán Hàng F&B POS v3.0
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748b' }}>
              Sơ đồ 12 bàn, gọi món trực quan và sinh mã VietQR chuyển khoản tự động
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', backgroundColor: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>
            🟢 Thu ngân: Ca sáng (Nguyễn Thu Ngân)
          </span>
        </div>
      </div>

      {/* SƠ ĐỒ BÀN (12 BÀN) */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>
          Sơ đồ bàn phục vụ:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
          {tables.map((tbl) => {
            const isSelected = tbl.id === selectedTableId;
            const isOccupied = tbl.status === 'Đang phục vụ';
            const orderCount = tbl.current_order.reduce((s, i) => s + i.quantity, 0);

            return (
              <div
                key={tbl.id}
                onClick={() => setSelectedTableId(tbl.id)}
                style={{
                  backgroundColor: isSelected ? '#0284c7' : isOccupied ? '#fef3c7' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#1e293b',
                  border: isSelected ? '2px solid #0284c7' : isOccupied ? '1px solid #f59e0b' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '12px 10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease-in-out',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '700' }}>{tbl.name}</div>
                <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.9 }}>
                  {isOccupied ? `Khách: ${tbl.guest_count} | ${orderCount} món` : 'Trống'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KHU VỰC THAO TÁC POS 2 CỘT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'flex-start' }}>
        {/* CỘT TRÁI: THỰC ĐƠN MÓN ĂN & NƯỚC UỐNG */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            {/* DANH MỤC MÓN */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedMenuCategory(c)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: selectedMenuCategory === c ? '#0f172a' : '#f1f5f9',
                    color: selectedMenuCategory === c ? '#ffffff' : '#475569',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="🔍 Tìm món..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                outline: 'none',
                width: '150px',
              }}
            />
          </div>

          {/* LƯỚI CARD MÓN ĂN */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                onClick={() => addItemToOrder(item)}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  cursor: 'pointer',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.15s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '28px', marginBottom: '6px' }}>{item.icon}</div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', lineHeight: 1.3 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{item.category}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#059669' }}>
                    {formatVND(item.price_vnd)}
                  </span>
                  <span style={{ backgroundColor: '#0284c7', color: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                    +
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT HÓA ĐƠN BÀN ĐANG CHỌN */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                {selectedTable.name}
              </h3>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Trạng thái: <strong>{selectedTable.status}</strong>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Xóa trắng các món đang gọi của bàn này?')) {
                  handleCheckoutComplete();
                }
              }}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
            >
              Hủy order
            </button>
          </div>

          {/* DANH SÁCH MÓN ĐÃ GỌI */}
          <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '16px' }}>
            {selectedTable.current_order.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 10px', color: '#94a3b8', fontSize: '13px' }}>
                Bàn chưa có món nào. Bấm vào thực đơn bên trái để thêm món.
              </div>
            ) : (
              selectedTable.current_order.map((item) => (
                <div
                  key={item.menu_item_id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f8fafc',
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{item.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{formatVND(item.price_vnd)}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => changeItemQuantity(item.menu_item_id, -1)}
                      style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '12px' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: '700', minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => changeItemQuantity(item.menu_item_id, 1)}
                      style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '12px' }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ width: '80px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                    {formatVND(item.price_vnd * item.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* TỔNG TIỀN VÀ THANH TOÁN */}
          <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#64748b' }}>
              <span>Tạm tính tiền món:</span>
              <strong>{formatVND(subtotal)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#64748b' }}>
              <span>Thuế GTGT (VAT 8%):</span>
              <strong>{formatVND(vat)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #f1f5f9', marginTop: '6px', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
              <span>Tổng cộng thanh toán:</span>
              <span style={{ color: '#059669' }}>{formatVND(totalPayment)}</span>
            </div>
          </div>

          {/* NÚT THAO TÁC THANH TOÁN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <button
              disabled={selectedTable.current_order.length === 0}
              onClick={() => setShowQrModal(true)}
              style={{
                backgroundColor: selectedTable.current_order.length === 0 ? '#94a3b8' : '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: selectedTable.current_order.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              📱 Tạo Mã VietQR Thanh Toán
            </button>

            <button
              disabled={selectedTable.current_order.length === 0}
              onClick={() => setShowInvoiceModal(true)}
              style={{
                backgroundColor: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: selectedTable.current_order.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              🧾 In Hóa Đơn & Đóng Bàn
            </button>
          </div>
        </div>
      </div>

      {/* MODAL MÃ VIETQR ĐỘNG */}
      {showQrModal && (
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
              borderRadius: '16px',
              maxWidth: '420px',
              width: '100%',
              padding: '26px',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                Thanh Toán Chuyển Khoản VietQR
              </h3>
              <button
                onClick={() => setShowQrModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div>Bàn thanh toán: <strong>{selectedTable.name}</strong></div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0284c7', marginTop: '4px' }}>
                {formatVND(totalPayment)}
              </div>
            </div>

            {/* HÌNH ẢNH MÃ VIETQR */}
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '16px', display: 'inline-block', marginBottom: '16px', backgroundColor: '#ffffff' }}>
              <img
                src={qrUrl}
                alt="Mã VietQR Thanh Toán"
                style={{ width: '220px', height: '220px', display: 'block', margin: '0 auto' }}
                onError={(e: any) => {
                  // Fallback hiển thị hộp QR mô phỏng nếu mạng offline
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none', width: '220px', height: '220px', lineHeight: '220px', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '13px' }}>
                [QR Chuyển Khoản VietQR]
              </div>
            </div>

            <div style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
              <div>Ngân hàng: <strong>MB Bank (Ngân hàng Quân Đội)</strong></div>
              <div>Số tài khoản: <strong>0987654321</strong></div>
              <div>Chủ tài khoản: <strong>QUAN CAFE GSHEETS</strong></div>
              <div>Nội dung CK: <strong>Ban{selectedTableId} ThanhToan</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowQrModal(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              >
                Đóng
              </button>
              <button
                onClick={handleCheckoutComplete}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#ffffff', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
              >
                ✓ Đã Nhận Tiền
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IN HÓA ĐƠN TẠM TÍNH */}
      {showInvoiceModal && (
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
              borderRadius: '10px',
              maxWidth: '380px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
              fontFamily: 'monospace',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>GSHEETS COFFEE & BISTRO</h3>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Đ/c: 123 Phố Huế, Hai Bà Trưng, Hà Nội</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Hotline: 0988.123.456</div>
              <div style={{ borderBottom: '1px dashed #000', margin: '12px 0' }} />
              <div style={{ fontSize: '15px', fontWeight: 'bold' }}>HÓA ĐƠN THANH TOÁN</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Bàn: {selectedTable.name} | Giờ: {selectedTable.check_in_time || '10:00'}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              {selectedTable.current_order.map((i) => (
                <div key={i.menu_item_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '4px 0' }}>
                  <span>{i.name} x{i.quantity}</span>
                  <span>{formatVND(i.price_vnd * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed #000', paddingTop: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tiền món:</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Thuế VAT 8%:</span>
                <span>{formatVND(vat)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginTop: '6px' }}>
                <span>TỔNG CỘNG:</span>
                <span>{formatVND(totalPayment)}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: '#64748b' }}>
              <div>Cảm ơn quý khách và hẹn gặp lại!</div>
              <div>Wifi: GSheets_Free | Pass: 88888888</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button
                onClick={() => setShowInvoiceModal(false)}
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontFamily: 'sans-serif', fontSize: '12px' }}
              >
                Đóng
              </button>
              <button
                onClick={handleCheckoutComplete}
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '12px' }}
              >
                Xác nhận In & Dọn bàn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
