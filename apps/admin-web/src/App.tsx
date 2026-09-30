import React, { useEffect, useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'KV01' | 'KD01' | 'KT01' | 'KV02'>('KV01');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let url = '/api/kv01/sanpham';
    if (activeTab === 'KD01') url = '/api/kd01/donhang';
    if (activeTab === 'KT01') url = '/api/kt01/giaodich';
    if (activeTab === 'KV02') url = '/api/kv02/phieukho';

    fetch(url, { headers: { 'x-tenant-id': 'org-123' } })
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(e => setError(e.message));
  }, [activeTab]);

  return <div>
    <h1>Ứng dụng Quản trị</h1>
    <div>
      <button onClick={() => setActiveTab('KV01')}>Hàng Hóa (KV01)</button>
      <button onClick={() => setActiveTab('KD01')}>Đơn Hàng (KD01)</button>
      <button onClick={() => setActiveTab('KT01')}>Giao Dịch (KT01)</button>
      <button onClick={() => setActiveTab('KV02')}>Phiếu Kho (KV02)</button>
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
  </div>;
}