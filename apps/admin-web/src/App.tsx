import React, { useEffect, useState } from 'react';
export default function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/kv01/sanpham', { headers: { 'x-tenant-id': 'org-123' } })
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(e => setError(e.message));
  }, []);
  return <div>
    <h1>Danh Mục Hàng Hoá</h1>
    {error && <div className="error">{error}</div>}
    <table>
      <thead><tr><th>SKU</th><th>Tên</th><th>Đơn vị</th><th>Min</th><th>Max</th></tr></thead>
      <tbody>
        {items.map((i: any) => <tr key={i.id}><td>{i.sku}</td><td>{i.name}</td><td>{i.unit}</td><td>{i.min_qty}</td><td>{i.max_qty}</td></tr>)}
      </tbody>
    </table>
  </div>;
}