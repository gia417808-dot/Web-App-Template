import React, { useEffect, useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'KV01' | 'KD01' | 'KT01' | 'KV02' | 'MK01' | 'KD02' | 'KD03' | 'KD04' | 'KD05' | 'MK02' | 'MK03'>('KV01');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [kpi, setKpi] = useState<number | null>(null);

  useEffect(() => {
    let url = '/api/kv01/sanpham';
    setKpi(null);
    if (activeTab === 'KD01') url = '/api/kd01/donhang';
    if (activeTab === 'KT01') url = '/api/kt01/giaodich';
    if (activeTab === 'KV02') url = '/api/kv02/phieukho';
    if (activeTab === 'KD02') url = '/api/kd02/cohoi';
    if (activeTab === 'KD03') url = '/api/kd03/muctieu';
    if (activeTab === 'KD04') url = '/api/kd04/hopdong';
    if (activeTab === 'KD05') url = '/api/kd05/customers-care-status';
    if (activeTab === 'MK01') {
      url = '/api/mk01/noidung';
      fetch('/api/mk01/noidung/kpi', { headers: { 'x-tenant-id': 'org-123' } })
        .then(res => res.json())
        .then(data => setKpi(data.onTimePublishRate))
        .catch(console.error);
    }
    if (activeTab === 'MK02') url = '/api/mk02/chiendich';
    if (activeTab === 'MK03') {
      url = '/api/mk03/leads';
      fetch('/api/mk03/kpi', { headers: { 'x-tenant-id': 'org-123' } })
        .then(res => res.json())
        .then(data => setKpi(data.rate * 100))
        .catch(console.error);
    }

    fetch(url, { headers: { 'x-tenant-id': 'org-123' } })
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(e => setError(e.message));
  }, [activeTab]);

  return <div>
    <h1>á»¨ng dá»¥ng Quáº£n trá»‹</h1>
    <div>
      <button onClick={() => setActiveTab('KV01')}>HÃ ng HÃ³a (KV01)</button>
      <button onClick={() => setActiveTab('KD01')}>ÄÆ¡n HÃ ng (KD01)</button>
      <button onClick={() => setActiveTab('KT01')}>Giao Dá»‹ch (KT01)</button>
      <button onClick={() => setActiveTab('KV02')}>Phiáº¿u Kho (KV02)</button>
      <button onClick={() => setActiveTab('MK01')}>Ná»™i Dung (MK01)</button>
      <button onClick={() => setActiveTab('KD02')}>CÆ¡ Há»™i (KD02)</button>
      <button onClick={() => setActiveTab('KD03')}>Chá»‰ TiÃªu (KD03)</button>
      <button onClick={() => setActiveTab('KD04')}>Há»£p Äá»“ng (KD04)</button>
      <button onClick={() => setActiveTab('KD05')}>Cham soc (KD05)</button>
      <button onClick={() => setActiveTab('MK02')}>Chiến Dịch (MK02)</button>
      <button onClick={() => setActiveTab('MK03')}>Lead Nguồn (MK03)</button>
    </div>
    {error && <div className="error">{error}</div>}
    
    {activeTab === 'KV01' && (
      <table>
        <thead><tr><th>SKU</th><th>TÃªn</th><th>ÄÆ¡n vá»‹</th><th>Min</th><th>Max</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.sku}</td><td>{i.name}</td><td>{i.unit}</td><td>{i.min_qty}</td><td>{i.max_qty}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KD01' && (
      <table>
        <thead><tr><th>MÃ£ ÄÆ¡n</th><th>KhÃ¡ch HÃ ng</th><th>NgÃ y</th><th>Tráº¡ng ThÃ¡i</th><th>Tá»•ng Tiá»n</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.customer_id}</td><td>{i.business_date}</td><td>{i.status}</td><td>{i.total_vnd}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KT01' && (
      <table>
        <thead><tr><th>MÃ£ GD</th><th>TÃ i Khoáº£n</th><th>NgÃ y</th><th>Loáº¡i</th><th>Sá»‘ Tiá»n</th><th>Tráº¡ng ThÃ¡i</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.account_id}</td><td>{i.business_date}</td><td>{i.direction}</td><td>{i.amount_vnd}</td><td>{i.status}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KV02' && (
      <table>
        <thead><tr><th>MÃ£ PK</th><th>Kho</th><th>NgÃ y</th><th>Loáº¡i</th><th>Tráº¡ng ThÃ¡i</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.warehouse_id}</td><td>{i.business_date}</td><td>{i.movement_type}</td><td>{i.status}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'MK01' && (
      <div>
        {kpi !== null && <h3>Tá»· lá»‡ Ä‘Äƒng Ä‘Ãºng háº¡n: {kpi.toFixed(2)}%</h3>}
        <table>
          <thead><tr><th>MÃ£</th><th>TiÃªu Ä‘á»</th><th>NgÃ y ÄÄƒng</th><th>Tráº¡ng ThÃ¡i</th></tr></thead>
          <tbody>
            {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.title}</td><td>{i.scheduled_at}</td><td>{i.status}</td></tr>)}
          </tbody>
        </table>
      </div>
    )}

    {activeTab === 'KD02' && (
      <table>
        <thead><tr><th>MÃ£ CH</th><th>GiÃ¡ Trá»‹</th><th>XÃ¡c Suáº¥t (%)</th><th>Tráº¡ng ThÃ¡i</th><th>GiÃ¡ Trá»‹ Ká»³ Vá»ng</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.value_vnd}</td><td>{i.probability_pct}</td><td>{i.status}</td><td>{i.expected_value}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KD03' && (
      <table>
        <thead><tr><th>Ká»³ Báº¯t Äáº§u</th><th>Ká»³ Káº¿t ThÃºc</th><th>Chá»‰ TiÃªu (VND)</th><th>Doanh Thu (VND)</th><th>Tiáº¿n Äá»™ (%)</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.period_start}</td><td>{i.period_end}</td><td>{i.target_vnd}</td><td>{i.confirmed_revenue_vnd}</td><td>{i.progress_pct?.toFixed(2)}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'KD04' && (
      <table>
        <thead><tr><th>MÃ£ HÄ</th><th>Háº¿t Háº¡n</th><th>Tráº¡ng ThÃ¡i</th><th>CÃ²n Láº¡i (NgÃ y)</th><th>Cáº§n Nháº¯c</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.code}</td><td>{i.expiry_date}</td><td>{i.status}</td><td>{i.days_remaining}</td><td>{i.should_remind ? 'CÃ“' : 'KHÃ”NG'}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'MK02' && (
      <table>
        <thead><tr><th>Chiến Dịch</th><th>Ngân Sách</th><th>Đã Chi</th><th>Còn Lại</th><th>Quá Ngân Sách</th></tr></thead>
        <tbody>
          {items.map((i: any) => <tr key={i.id}><td>{i.ten_chien_dich}</td><td>{i.ngan_sach}</td><td>{i.da_chi}</td><td>{i.con_lai}</td><td>{i.qua_ngan_sach ? 'Có' : 'Không'}</td></tr>)}
        </tbody>
      </table>
    )}

    {activeTab === 'MK03' && (
      <div>
        {kpi !== null && <h3>Tỷ lệ chuyển đổi: {kpi.toFixed(2)}%</h3>}
        <table>
          <thead><tr><th>ID</th><th>Tên Lead</th><th>Trạng Thái</th><th>Nguồn ID</th><th>Ngày Tạo</th></tr></thead>
          <tbody>
            {items.map((i: any) => <tr key={i.id}><td>{i.id}</td><td>{i.ten_lead}</td><td>{i.trang_thai}</td><td>{i.nguon_id}</td><td>{i.ngay_tao}</td></tr>)}
          </tbody>
        </table>
      </div>
    )}
  </div>;
}



    {activeTab === 'MK03' && (
      <div>
        {kpi !== null && <h3>Tỷ lệ chuyển đổi: {kpi.toFixed(2)}%</h3>}
        <table>
          <thead><tr><th>ID</th><th>Tên Lead</th><th>Trạng Thái</th><th>Nguồn ID</th><th>Ngày Tạo</th></tr></thead>
          <tbody>
            {items.map((i: any) => <tr key={i.id}><td>{i.id}</td><td>{i.ten_lead}</td><td>{i.trang_thai}</td><td>{i.nguon_id}</td><td>{i.ngay_tao}</td></tr>)}
          </tbody>
        </table>
      </div>
    )}
