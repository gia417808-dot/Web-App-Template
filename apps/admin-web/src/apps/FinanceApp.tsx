import React, { useState, useMemo } from 'react';
import {
  initialBankAccounts,
  initialFinanceTransactions,
  initialProjectsPL,
  BankAccount,
  FinanceTransaction,
  ProjectProfitLoss,
} from '../mock/deepMockData';

export default function FinanceApp() {
  const [accounts, setAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(initialFinanceTransactions);
  const [projectsPL] = useState<ProjectProfitLoss[]>(initialProjectsPL);
  const [activeTab, setActiveTab] = useState<'transactions' | 'runway' | 'projects'>('transactions');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Thu' | 'Chi'>('ALL');

  // Modal ghi thu/chi mới
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState<'Thu' | 'Chi'>('Thu');
  const [newCategory, setNewCategory] = useState('Doanh thu Bán hàng');
  const [newAmount, setNewAmount] = useState(25000000);
  const [newAccount, setNewAccount] = useState(accounts[0]?.bank_name || '');
  const [newProject, setNewProject] = useState('Dự án ERP Doanh Nghiệp');
  const [newNote, setNewNote] = useState('Thu tiền đợt thanh toán hợp đồng');

  const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Tổng số dư tiền mặt & ngân hàng hiện có
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance_vnd, 0);
  }, [accounts]);

  // Tổng thu & chi
  const { totalThu, totalChi, monthlyBurnRate, runwayMonths } = useMemo(() => {
    const thu = transactions.filter((t) => t.type === 'Thu').reduce((sum, t) => sum + t.amount_vnd, 0);
    const chi = transactions.filter((t) => t.type === 'Chi').reduce((sum, t) => sum + t.amount_vnd, 0);

    // Burn rate tháng (tính trung bình hoặc theo chi tiêu)
    const burn = chi > 0 ? chi : 75000000;
    const runway = totalBalance > 0 ? Number((totalBalance / burn).toFixed(1)) : 0;

    return { totalThu: thu, totalChi: chi, monthlyBurnRate: burn, runwayMonths: runway };
  }, [transactions, totalBalance]);

  // Lọc giao dịch
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => typeFilter === 'ALL' || t.type === typeFilter);
  }, [transactions, typeFilter]);

  // Xử lý ghi giao dịch mới
  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAmount <= 0) return;

    const newTx: FinanceTransaction = {
      id: `TX-${Date.now()}`,
      code: `${newType === 'Thu' ? 'THU' : 'CHI'}-2026-${String(transactions.length + 1).padStart(2, '0')}`,
      date: new Date().toISOString().substring(0, 10),
      type: newType,
      category: newCategory,
      amount_vnd: Number(newAmount),
      account: newAccount,
      project: newProject,
      performer: 'Kế toán tổng hợp',
      note: newNote,
    };

    // Cập nhật số dư tài khoản
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.bank_name !== newAccount) return acc;
        const diff = newType === 'Thu' ? Number(newAmount) : -Number(newAmount);
        return { ...acc, balance_vnd: Math.max(0, acc.balance_vnd + diff) };
      })
    );

    setTransactions([newTx, ...transactions]);
    setShowModal(false);
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* HEADER WEBAPP THU CHI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>💰</span>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                Hệ Thống Dòng Tiền & Startup Burn Rate v4.1
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748b' }}>
                Quản lý số dư đa tài khoản ngân hàng, kiểm soát chi phí và tính toán số tháng Runway sinh tồn
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#059669',
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
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
            }}
          >
            + Ghi Nhận Thu / Chi Mới
          </button>
        </div>
      </div>

      {/* METRICS CARDS TÀI CHÍNH */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>Tổng quỹ khả dụng (3 tài khoản)</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{formatVND(totalBalance)}</div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px', fontWeight: '600' }}>✓ Khả năng thanh toán tức thời</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>Tổng Dòng Tiền Vào (Thu)</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#059669' }}>+{formatVND(totalThu)}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Từ bán hàng & hợp đồng</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>Tốc độ đốt tiền (Burn Rate tháng)</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#dc2626' }}>-{formatVND(monthlyBurnRate)}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Lương, server, văn phòng, ads</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '6px' }}>Dự toán Sinh tồn (Runway)</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: runwayMonths >= 6 ? '#0284c7' : '#d97706' }}>
            {runwayMonths} tháng
          </div>
          <div style={{ fontSize: '12px', color: runwayMonths >= 6 ? '#0284c7' : '#d97706', marginTop: '4px', fontWeight: '600' }}>
            {runwayMonths >= 6 ? '🛡️ Vùng an toàn hoạt động' : '⚠️ Cần gọi vốn hoặc đẩy doanh thu'}
          </div>
        </div>
      </div>

      {/* DANH SÁCH TÀI KHOẢN NGÂN HÀNG */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {accounts.map((acc) => (
          <div
            key={acc.id}
            style={{
              backgroundColor: '#ffffff',
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>{acc.bank_name}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>STK: {acc.account_number}</div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Chủ TK: {acc.account_holder}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{formatVND(acc.balance_vnd)}</div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>Hoạt động</div>
            </div>
          </div>
        ))}
      </div>

      {/* SUBTABS ĐIỀU HƯỚNG */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('transactions')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'transactions' ? '#0f172a' : '#f1f5f9',
                color: activeTab === 'transactions' ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              📑 Sổ Nhật Ký Thu Chi ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab('runway')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'runway' ? '#0f172a' : '#f1f5f9',
                color: activeTab === 'runway' ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              📊 Bảng Tính Burn Rate & Runway
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'projects' ? '#0f172a' : '#f1f5f9',
                color: activeTab === 'projects' ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              🏢 Lãi Lỗ Theo Dự Án ({projectsPL.length})
            </button>
          </div>

          {activeTab === 'transactions' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['ALL', 'Thu', 'Chi'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: typeFilter === t ? '#e2e8f0' : '#ffffff',
                    color: '#334155',
                    fontSize: '12.5px',
                    fontWeight: typeFilter === t ? '700' : '500',
                    cursor: 'pointer',
                  }}
                >
                  {t === 'ALL' ? 'Tất cả' : t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TAB 1: SỔ GIAO DỊCH */}
        {activeTab === 'transactions' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px' }}>Mã GD</th>
                  <th style={{ padding: '12px 16px' }}>Ngày</th>
                  <th style={{ padding: '12px 16px' }}>Loại</th>
                  <th style={{ padding: '12px 16px' }}>Hạng mục</th>
                  <th style={{ padding: '12px 16px' }}>Số tiền (VND)</th>
                  <th style={{ padding: '12px 16px' }}>Tài khoản</th>
                  <th style={{ padding: '12px 16px' }}>Dự án</th>
                  <th style={{ padding: '12px 16px' }}>Diễn giải / Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0284c7' }}>{tx.code}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{tx.date}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          backgroundColor: tx.type === 'Thu' ? '#dcfce7' : '#fee2e2',
                          color: tx.type === 'Thu' ? '#166534' : '#991b1b',
                        }}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{tx.category}</td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontWeight: '800',
                        color: tx.type === 'Thu' ? '#059669' : '#dc2626',
                      }}
                    >
                      {tx.type === 'Thu' ? '+' : '-'}
                      {formatVND(tx.amount_vnd)}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{tx.account}</td>
                    <td style={{ padding: '12px 16px', color: '#0284c7', fontWeight: '500' }}>{tx.project}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{tx.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: BURN RATE & RUNWAY */}
        {activeTab === 'runway' && (
          <div style={{ padding: '24px' }}>
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#166534', fontSize: '17px' }}>
                💡 Công Thức Tính Toán Sức Khỏe Tài Chính Startup
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#14532d', lineHeight: 1.6 }}>
                <strong>Runway (Tháng) = Tổng số dư tiền mặt & ngân hàng / Tốc độ đốt tiền trung bình mỗi tháng (Burn rate).</strong><br />
                Hiện tại với quỹ khả dụng <strong>{formatVND(totalBalance)}</strong> và mức chi tiêu hàng tháng là <strong>{formatVND(monthlyBurnRate)}</strong>, doanh nghiệp duy trì được <strong>{runwayMonths} tháng</strong> hoạt động an toàn mà chưa cần tính tới doanh thu mới.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Cơ cấu chi phí cố định (Hàng tháng)</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                  <span>Lương nhân sự cố định:</span>
                  <strong>{formatVND(52000000)} (61%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                  <span>Tiền thuê văn phòng:</span>
                  <strong>{formatVND(25000000)} (29%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                  <span>Hạ tầng Cloud & Công cụ:</span>
                  <strong>{formatVND(14500000)} (17%)</strong>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Khuyến nghị chiến lược dòng tiền</div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569', lineHeight: 1.8 }}>
                  <li>Tập trung thu hồi công nợ các hợp đồng đã nghiệm thu.</li>
                  <li>Tối ưu hóa ngân sách Marketing Ads theo ROI cụ thể từng kênh.</li>
                  <li>Giữ mức Runway tối thiểu 6 tháng trước khi quyết định mở rộng nhân sự mới.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LÃI LỖ THEO DỰ ÁN */}
        {activeTab === 'projects' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px' }}>Tên dự án</th>
                  <th style={{ padding: '12px 16px' }}>Doanh thu ghi nhận</th>
                  <th style={{ padding: '12px 16px' }}>Tổng chi phí thực hiện</th>
                  <th style={{ padding: '12px 16px' }}>Lợi nhuận ròng</th>
                  <th style={{ padding: '12px 16px' }}>Tỷ suất lợi nhuận (Margin)</th>
                  <th style={{ padding: '12px 16px' }}>Đánh giá hiệu quả</th>
                </tr>
              </thead>
              <tbody>
                {projectsPL.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0f172a' }}>{p.name}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#059669' }}>{formatVND(p.revenue_vnd)}</td>
                    <td style={{ padding: '12px 16px', color: '#dc2626' }}>{formatVND(p.cost_vnd)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0284c7' }}>{formatVND(p.profit_vnd)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '700' }}>{p.profit_margin_pct}%</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: p.profit_margin_pct >= 50 ? '#dcfce7' : '#e0e7ff',
                          color: p.profit_margin_pct >= 50 ? '#166534' : '#3730a3',
                        }}
                      >
                        {p.profit_margin_pct >= 50 ? '🌟 Siêu sinh lời' : '✓ Đạt kỳ vọng'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL GHI THU / CHI MỚI */}
      {showModal && (
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
              maxWidth: '500px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                Ghi Nhận Giao Dịch Tài Chính Mới
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Loại giao dịch:
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('Thu');
                      setNewCategory('Doanh thu Bán hàng');
                    }}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '8px',
                      border: newType === 'Thu' ? '2px solid #059669' : '1px solid #cbd5e1',
                      backgroundColor: newType === 'Thu' ? '#ecfdf5' : '#ffffff',
                      color: newType === 'Thu' ? '#059669' : '#475569',
                      fontWeight: '700',
                      fontSize: '13.5px',
                      cursor: 'pointer',
                    }}
                  >
                    + Thu Tiền (Vào quỹ)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('Chi');
                      setNewCategory('Chi phí Vận hành');
                    }}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '8px',
                      border: newType === 'Chi' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                      backgroundColor: newType === 'Chi' ? '#fef2f2' : '#ffffff',
                      color: newType === 'Chi' ? '#dc2626' : '#475569',
                      fontWeight: '700',
                      fontSize: '13.5px',
                      cursor: 'pointer',
                    }}
                  >
                    - Chi Tiền (Xuất quỹ)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Số tiền giao dịch (VND):
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Math.max(0, Number(e.target.value)))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', fontWeight: 'bold', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Hạng mục tài chính:
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Tài khoản tác động:
                  </label>
                  <select
                    value={newAccount}
                    onChange={(e) => setNewAccount(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.bank_name}>
                        {a.bank_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Gắn vào dự án:
                  </label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                  >
                    <option value="Dự án ERP Doanh Nghiệp">Dự án ERP Doanh Nghiệp</option>
                    <option value="Sàn GSheets Marketplace">Sàn GSheets Marketplace</option>
                    <option value="Dự án App Mobile F&B">Dự án App Mobile F&B</option>
                    <option value="Vận hành chung">Vận hành chung</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Ghi chú nội dung:
                </label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '13px' }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: newType === 'Thu' ? '#059669' : '#dc2626',
                    color: '#ffffff',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Lưu & Cập nhật số dư
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
