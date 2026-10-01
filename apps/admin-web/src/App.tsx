import React, { useEffect, useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'KV01' | 'KD01' | 'KT01' | 'KV02' | 'MK01' | 'KD02' | 'KD03' | 'KD04' | 'KD05' | 'MK02'>('KV01');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [kpi, setKpi] = useState<number | null>(null);

  const fetchItems = () => {
    let url = '/api/kv01/sanpham';
    setKpi(null);
    if (activeTab === 'KD01') url = '/api/kd01/donhang';
    if (activeTab === 'KT01') url = '/api/kt01/giaodich';
    if (activeTab === 'KV02') url = '/api/kv02/phieukho';
    if (activeTab === 'KD02') url = '/api/kd02/cohoi';
    if (activeTab === 'KD03') url = '/api/kd03/muctieu';
    if (activeTab === 'KD04') url = '/api/kd04/hopdong';
    if (activeTab === 'KD05') url = '/api/kd05/customers-care-status';
    if (activeTab === 'MK02') url = '/api/mk02/chiendich';
    if (activeTab === 'MK01') {
      url = '/api/mk01/noidung';
      fetch('/api/mk01/noidung/kpi', { headers: { 'x-tenant-id': 'org-123' } })
        .then(res => res.json())
        .then(data => setKpi(data.onTimePublishRate))
        .catch(console.error);
    }

    fetch(url, { headers: { 'x-tenant-id': 'org-123' } })
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(e => setError(e.message));
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  return <div>
    <h1>Ứng dụng Quản trị</h1>
    <div>
      <button onClick={() => setActiveTab('KV01')}>Hàng Hóa (KV01)</button>
      <button onClick={() => setActiveTab('KD01')}>Đơn Hàng (KD01)</button>
      <button onClick={() => setActiveTab('KT01')}>Giao Dịch (KT01)</button>
      <button onClick={() => setActiveTab('KV02')}>Phiếu Kho (KV02)</button>
      <button onClick={() => setActiveTab('MK01')}>Nội Dung (MK01)</button>
      <button onClick={() => setActiveTab('KD02')}>Cơ Hội (KD02)</button>
      <button onClick={() => setActiveTab('KD03')}>Chỉ Tiêu (KD03)</button>
      <button onClick={() => setActiveTab('KD04')}>Hợp Đồng (KD04)</button>
      <button onClick={() => setActiveTab('KD05')}>Chăm Sóc (KD05)</button>
      <button onClick={() => setActiveTab('MK02')}>Chiến Dịch (MK02)</button>
    </div>
    {error && <div className="error">{error}</div>}
    
    {activeTab === 'KV01' && (
      <table>
        <thead><tr><th>SKU</th><th>Tên</th><th>Đơn vị</th><th>Min</th><th>Max</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.sku}</td><td>{i.name}</td><td>{i.unit}</td><td>{i.min_qty}</td><td>{i.max_qty}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KD01' && (
      <table>
        <thead><tr><th>Mã Đơn</th><th>Khách Hàng</th><th>Ngày</th><th>Trạng Thái</th><th>Tổng Tiền</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.customer_id}</td><td>{i.business_date}</td><td>{i.status}</td><td>{i.total_vnd}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KT01' && (
      <table>
        <thead><tr><th>Mã GD</th><th>Tài Khoản</th><th>Ngày</th><th>Loại</th><th>Số Tiền</th><th>Trạng Thái</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.account_id}</td><td>{i.business_date}</td><td>{i.direction}</td><td>{i.amount_vnd}</td><td>{i.status}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KV02' && (
      <table>
        <thead><tr><th>Mã PK</th><th>Kho</th><th>Ngày</th><th>Loại</th><th>Trạng Thái</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.warehouse_id}</td><td>{i.business_date}</td><td>{i.movement_type}</td><td>{i.status}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'MK01' && (
      <div>
        {kpi !== null && <h3>Tỷ lệ đăng đúng hạn: {kpi.toFixed(2)}%</h3>}
        <table>
          <thead><tr><th>Mã</th><th>Tiêu đề</th><th>Ngày Đăng</th><th>Trạng Thái</th></tr></thead>
          <tbody>
            {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.title}</td><td>{i.scheduled_at}</td><td>{i.status}</td></tr>)}
          </tbody>
        </table>
      </div>
    )}

    {activeTab === 'KD02' && (
      <table>
        <thead><tr><th>Mã CH</th><th>Giá Trị</th><th>Xác Suất (%)</th><th>Trạng Thái</th><th>Giá Trị Kỳ Vọng</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.value_vnd}</td><td>{i.probability_pct}</td><td>{i.status}</td><td>{i.expected_value}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KD03' && (
      <table>
        <thead><tr><th>Kỳ Bắt Đầu</th><th>Kỳ Kết Thúc</th><th>Chỉ Tiêu (VND)</th><th>Doanh Thu (VND)</th><th>Tiến Độ (%)</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.period_start}</td><td>{i.period_end}</td><td>{i.target_vnd}</td><td>{i.confirmed_revenue_vnd}</td><td>{i.progress_pct?.toFixed(2)}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KD04' && (
      <table>
        <thead><tr><th>Mã HĐ</th><th>Hết Hạn</th><th>Trạng Thái</th><th>Còn Lại (Ngày)</th><th>Cần Nhắc</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.expiry_date}</td><td>{i.status}</td><td>{i.days_remaining}</td><td>{i.should_remind ? 'CÓ' : 'KHÔNG'}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KD05' && (
      <table>
        <thead><tr><th>Tên KH</th><th>Mã KH</th><th>Tương Tác Cuối</th><th>Trễ (Ngày)</th></tr></thead>
        <tbody>
          {items.map((i: any) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.code}</td>
              <td>{i.last_interaction ? new Date(i.last_interaction.interaction_date).toLocaleDateString() : 'Chưa có'}</td>
              <td>{i.days_since_last_interaction === 'NO_CONTACT' ? 'NO_CONTACT' : i.days_since_last_interaction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

    {activeTab === 'MK02' && (
      <div>
        <table>
          <thead>
            <tr>
              <th>Mã CD</th>
              <th>Tên Chiến Dịch</th>
              <th>Thời Gian</th>
              <th>Dự Toán (VND)</th>
              <th>Đã Chi (VND)</th>
              <th>Ngân Sách Còn Lại</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((cd: any) => (
              <tr key={cd.id}>
                <td>{cd.code}</td>
                <td>{cd.name}</td>
                <td>{cd.start_date} ~ {cd.end_date}</td>
                <td>{Number(cd.budget_vnd).toLocaleString()}</td>
                <td>{Number(cd.confirmed_cost).toLocaleString()}</td>
                <td style={{ color: cd.is_over_budget ? 'red' : 'inherit', fontWeight: cd.is_over_budget ? 'bold' : 'normal' }}>
                  {Number(cd.remaining_budget).toLocaleString()} {cd.is_over_budget && '(VƯỢT)'}
                </td>
                <td>{cd.status}</td>
                <td>
                  {cd.status === 'ACTIVE' && (
                    <button onClick={() => {
                      fetch(`/api/mk02/chiendich/${cd.id}/khoa-ngan-sach`, {
                        method: 'POST',
                        headers: { 'x-tenant-id': 'org-123' }
                      })
                      .then(async res => {
                        if (!res.ok) {
                          const err = await res.json();
                          alert(err.error || 'Lỗi khóa ngân sách');
                        } else {
                          alert('Đã khóa ngân sách thành công');
                          fetchItems();
                        }
                      })
                      .catch(e => alert(e.message));
                    }}>
                      Khóa Ngân Sách
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>;
}
