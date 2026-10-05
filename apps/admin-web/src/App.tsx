import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const [activeTab, setActiveTab] = useState<'KV01' | 'KD01' | 'KT01' | 'KV02' | 'MK01' | 'KD02' | 'KD03' | 'KD04' | 'KD05'>('KV01');
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [kpi, setKpi] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    setKpi(null);
    setError('');

    async function loadData() {
      // 1. Nếu có cấu hình Supabase Client, truy vấn trực tiếp bảng tương ứng
      if (supabase) {
        const tableMap: Record<string, string> = {
          KV01: 'SanPham',
          KD01: 'DonHang',
          KT01: 'GiaoDich',
          KV02: 'PhieuKho',
          MK01: 'NoiDung',
          KD02: 'CoHoi',
          KD03: 'MucTieu',
          KD04: 'HopDong',
          KD05: 'CustomerCareStatus',
        };
        const tableName = tableMap[activeTab];
        try {
          const { data, error: sbError } = await supabase.from(tableName).select('*');
          if (!isMounted) return;
          if (sbError) {
            console.warn(`Supabase query warning [${tableName}]:`, sbError.message);
            setItems([]);
            setError(`Chưa tải được dữ liệu từ Supabase (${sbError.message}).`);
          } else {
            setItems(data || []);
            setError('');
          }
          return;
        } catch (err: any) {
          if (!isMounted) return;
          console.warn('Lỗi kết nối Supabase:', err);
          setItems([]);
          setError(`Lỗi kết nối Supabase: ${err?.message || 'Không xác định'}`);
          return;
        }
      }

      // 2. Fallback nếu dùng REST API: Kiểm tra an toàn Content-Type để tránh lỗi parse "<!DOCTYPE"
      let url = '/api/kv01/sanpham';
      if (activeTab === 'KD01') url = '/api/kd01/donhang';
      if (activeTab === 'KT01') url = '/api/kt01/giaodich';
      if (activeTab === 'KV02') url = '/api/kv02/phieukho';
      if (activeTab === 'KD02') url = '/api/kd02/cohoi';
      if (activeTab === 'KD03') url = '/api/kd03/muctieu';
      if (activeTab === 'KD04') url = '/api/kd04/hopdong';
      if (activeTab === 'KD05') url = '/api/kd05/customers-care-status';

      if (activeTab === 'MK01') {
        url = '/api/mk01/noidung';
        try {
          const kpiRes = await fetch(`${API_BASE_URL}/api/mk01/noidung/kpi`, { headers: { 'x-tenant-id': 'org-123' } });
          const contentType = kpiRes.headers.get('content-type') || '';
          if (kpiRes.ok && contentType.includes('application/json')) {
            const kpiData = await kpiRes.json();
            if (isMounted) setKpi(kpiData.onTimePublishRate ?? null);
          }
        } catch {
          // Bỏ qua lỗi KPI, không làm gián đoạn giao diện
        }
      }

      try {
        const fullUrl = API_BASE_URL ? `${API_BASE_URL}${url}` : url;
        const res = await fetch(fullUrl, { headers: { 'x-tenant-id': 'org-123' } });
        if (!isMounted) return;

        const contentType = res.headers.get('content-type') || '';
        // Tuyệt đối không parse JSON nếu server trả về HTML (ví dụ trang 404 Netlify)
        if (!contentType.includes('application/json')) {
          setItems([]);
          setError('Chưa cấu hình API hoặc chưa kết nối Supabase. Vui lòng cấu hình VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trên Netlify.');
          return;
        }

        if (!res.ok) {
          setItems([]);
          setError(`Lỗi máy chủ API (${res.status} ${res.statusText})`);
          return;
        }

        const data = await res.json();
        setItems(Array.isArray(data) ? data : (data?.data || []));
        setError('');
      } catch (e: any) {
        if (!isMounted) return;
        setItems([]);
        setError(`Không thể kết nối đến máy chủ: ${e.message}`);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Ứng dụng Quản trị</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setActiveTab('KV01')}>Hàng Hóa (KV01)</button>
        <button onClick={() => setActiveTab('KD01')}>Đơn Hàng (KD01)</button>
        <button onClick={() => setActiveTab('KT01')}>Giao Dịch (KT01)</button>
        <button onClick={() => setActiveTab('KV02')}>Phiếu Kho (KV02)</button>
        <button onClick={() => setActiveTab('MK01')}>Nội Dung (MK01)</button>
        <button onClick={() => setActiveTab('KD02')}>Cơ Hội (KD02)</button>
        <button onClick={() => setActiveTab('KD03')}>Chỉ Tiêu (KD03)</button>
        <button onClick={() => setActiveTab('KD04')}>Hợp Đồng (KD04)</button>
        <button onClick={() => setActiveTab('KD05')}>Chăm Sóc (KD05)</button>
      </div>

      {error && (
        <div className="error" style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}
      
      {activeTab === 'KV01' && (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Mã SKU</th>
              <th>Tên</th>
              <th>Đơn vị</th>
              <th>Tối thiểu</th>
              <th>Tối đa</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#777' }}>Chưa có dữ liệu</td></tr>
            ) : (
              items.map((i: any) => (
                <tr key={i.id || i.sku}>
                  <td>{i.sku}</td>
                  <td>{i.name}</td>
                  <td>{i.unit}</td>
                  <td>{i.min_qty}</td>
                  <td>{i.max_qty}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {activeTab === 'KD01' && (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Mã Đơn</th>
              <th>Khách Hàng</th>
              <th>Ngày</th>
              <th>Trạng Thái</th>
              <th>Tổng Tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#777' }}>Chưa có dữ liệu</td></tr>
            ) : (
              items.map((i: any) => (
                <tr key={i.id || i.code}>
                  <td>{i.code}</td>
                  <td>{i.customer_id}</td>
                  <td>{i.business_date}</td>
                  <td>{i.status}</td>
                  <td>{i.total_vnd}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {activeTab === 'KT01' && (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Mã GD</th>
              <th>Tài Khoản</th>
              <th>Ngày</th>
              <th>Loại</th>
              <th>Số Tiền</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#777' }}>Chưa có dữ liệu</td></tr>
            ) : (
              items.map((i: any) => (
                <tr key={i.id || i.code}>
                  <td>{i.code}</td>
                  <td>{i.account_id}</td>
                  <td>{i.business_date}</td>
                  <td>{i.direction}</td>
                  <td>{i.amount_vnd}</td>
                  <td>{i.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {activeTab === 'KV02' && (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Mã PK</th>
              <th>Kho</th>
              <th>Ngày</th>
              <th>Loại</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#777' }}>Chưa có dữ liệu</td></tr>
            ) : (
              items.map((i: any) => (
                <tr key={i.id || i.code}>
                  <td>{i.code}</td>
                  <td>{i.warehouse_id}</td>
                  <td>{i.business_date}</td>
                  <td>{i.movement_type}</td>
                  <td>{i.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {activeTab === 'MK01' && (
        <div>
          {kpi !== null && <h3 style={{ marginBottom: '12px' }}>Tỷ lệ đăng đúng hạn: {kpi.toFixed(2)}%</h3>}
          <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tiêu đề</th>
                <th>Ngày Đăng</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#777' }}>Chưa có dữ liệu</td></tr>
              ) : (
                items.map((i: any) => (
                  <tr key={i.id || i.code}>
                    <td>{i.code}</td>
                    <td>{i.title}</td>
                    <td>{i.scheduled_at}</td>
                    <td>{i.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'KD02' && (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Mã CH</th>
              <th>Giá Trị</th>
              <th>Xác Suất (%)</th>
              <th>Trạng Thái</th>
              <th>Giá Trị Kỳ Vọng</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#777' }}>Chưa có dữ liệu</td></tr>
            ) : (
              items.map((i: any) => (
                <tr key={i.id || i.code}>
                  <td>{i.code}</td>
                  <td>{i.value_vnd}</td>
                  <td>{i.probability_pct}</td>
                  <td>{i.status}</td>
                  <td>{i.expected_value}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {activeTab === 'KD03' && (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Kỳ Bắt Đầu</th>
              <th>Kỳ Kết Thúc</th>
              <th>Chỉ Tiêu (VND)</th>
              <th>Doanh Thu (VND)</th>
              <th>Tiến Độ (%)</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#777' }}>Chưa có dữ liệu</td></tr>
            ) : (
              items.map((i: any) => (
                <tr key={i.id}>
                  <td>{i.period_start}</td>
                  <td>{i.period_end}</td>
                  <td>{i.target_vnd}</td>
                  <td>{i.confirmed_revenue_vnd}</td>
                  <td>{i.progress_pct?.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {activeTab === 'KD04' && (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Mã HĐ</th>
              <th>Hết Hạn</th>
              <th>Trạng Thái</th>
              <th>Còn Lại (Ngày)</th>
              <th>Cần Nhắc</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#777' }}>Chưa có dữ liệu</td></tr>
            ) : (
              items.map((i: any) => (
                <tr key={i.id || i.code}>
                  <td>{i.code}</td>
                  <td>{i.expiry_date}</td>
                  <td>{i.status}</td>
                  <td>{i.days_remaining}</td>
                  <td>{i.should_remind ? 'CÓ' : 'KHÔNG'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {activeTab === 'KD05' && (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Khách Hàng</th>
              <th>Trạng Thái</th>
              <th>Điểm Hài Lòng</th>
              <th>Ghi Chú</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#777' }}>Chưa có dữ liệu</td></tr>
            ) : (
              items.map((i: any, idx: number) => (
                <tr key={i.id || idx}>
                  <td>{i.customer_id || i.ten_khach_hang || 'KH-DEMO'}</td>
                  <td>{i.status || i.trang_thai || 'Đang chăm sóc'}</td>
                  <td>{i.score ?? i.diem ?? '-'}</td>
                  <td>{i.note || i.ghi_chu || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
