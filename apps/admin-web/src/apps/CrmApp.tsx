import React, { useState, useMemo } from 'react';
import { initialCrmDeals, CustomerDeal } from '../mock/deepMockData';

interface CrmAppProps {
  onBack?: () => void;
}

export default function CrmApp({ onBack }: CrmAppProps = {}) {
  const [deals, setDeals] = useState<CustomerDeal[]>(initialCrmDeals);
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');

  // Modal tạo deal mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dealValue, setDealValue] = useState(150000000);
  const [stage, setStage] = useState<CustomerDeal['stage']>('Tiềm năng');
  const [assignedTo, setAssignedTo] = useState('Bùi Sales Lead');
  const [nextFollowUp, setNextFollowUp] = useState('2026-10-15');
  const [notes, setNotes] = useState('Khách hàng quan tâm gói phần mềm quản trị');

  const stages: CustomerDeal['stage'][] = [
    'Tiềm năng',
    'Đã liên hệ',
    'Đề xuất giải pháp',
    'Đàm phán',
    'Chốt thành công',
  ];

  const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Thống kê
  const stats = useMemo(() => {
    const totalDeals = deals.length;
    const totalValue = deals.reduce((sum, d) => sum + d.deal_value_vnd, 0);
    const wonCount = deals.filter((d) => d.stage === 'Chốt thành công').length;
    const overdueCount = deals.filter((d) => d.is_overdue).length;
    return { totalDeals, totalValue, wonCount, overdueCount };
  }, [deals]);

  // Lọc deals
  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      const matchStage = stageFilter === 'ALL' || d.stage === stageFilter;
      const matchSearch =
        d.company_name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        d.contact_person.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        d.phone.includes(searchQuery.trim());
      return matchStage && matchSearch;
    });
  }, [deals, stageFilter, searchQuery]);

  // Cập nhật stage nhanh
  const updateDealStage = (dealId: string, nextStage: CustomerDeal['stage']) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: nextStage } : d))
    );
  };

  // Đánh dấu đã gọi lại
  const markCallDone = (dealId: string) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              is_overdue: false,
              last_contact_date: new Date().toISOString().substring(0, 10),
              next_follow_up_date: '2026-10-14',
            }
          : d
      )
    );
  };

  // Thêm deal mới
  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    const newDeal: CustomerDeal = {
      id: `CRM-${Date.now()}`,
      code: `DL-2026-${String(deals.length + 1).padStart(3, '0')}`,
      company_name: companyName,
      contact_person: contactPerson,
      phone,
      email,
      deal_value_vnd: Number(dealValue),
      stage,
      assigned_to: assignedTo,
      last_contact_date: new Date().toISOString().substring(0, 10),
      next_follow_up_date: nextFollowUp,
      is_overdue: false,
      notes,
    };

    setDeals([newDeal, ...deals]);
    setShowAddModal(false);
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* HEADER CRM */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>🎯</span>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                Hệ Thống CRM & Quản Lý Phễu Bán Hàng v7.1
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748b' }}>
                Quản lý vòng đời khách hàng, pipeline cơ hội và cảnh báo lịch hẹn chăm sóc
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                backgroundColor: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '8px 16px',
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
          <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '3px' }}>
            <button
              onClick={() => setViewMode('pipeline')}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'pipeline' ? '#ffffff' : 'transparent',
                color: viewMode === 'pipeline' ? '#0f172a' : '#64748b',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              🌊 Phễu Bán Hàng
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent',
                color: viewMode === 'list' ? '#0f172a' : '#64748b',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              📋 Danh Sách Khách Hàng
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
            }}
          >
            + Thêm Cơ Hội Mới
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>Tổng cơ hội trong phễu</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{stats.totalDeals} khách hàng</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Đang tiếp cận & theo đuổi</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>Tổng giá trị phễu dự kiến</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#059669' }}>{formatVND(stats.totalValue)}</div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>Quy mô các hợp đồng mở</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>Chốt deal thành công</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#16a34a' }}>{stats.wonCount} hợp đồng</div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>✓ Đã ký và thu tiền</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>Quá hạn hẹn gọi lại</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: stats.overdueCount > 0 ? '#dc2626' : '#16a34a' }}>
            {stats.overdueCount} khách hàng
          </div>
          <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>⚠️ Cần liên hệ ngay hôm nay</div>
        </div>
      </div>

      {/* THANH TÌM KIẾM */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Giai đoạn:</span>
          {['ALL', ...stages].map((s) => (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: stageFilter === s ? '1px solid #0284c7' : '1px solid #cbd5e1',
                backgroundColor: stageFilter === s ? '#f0f9ff' : '#ffffff',
                color: stageFilter === s ? '#0284c7' : '#475569',
                fontSize: '12.5px',
                fontWeight: stageFilter === s ? '700' : '500',
                cursor: 'pointer',
              }}
            >
              {s === 'ALL' ? 'Tất cả' : s}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="🔍 Tìm công ty, người liên hệ, SĐT..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            outline: 'none',
            width: '260px',
          }}
        />
      </div>

      {/* CHẾ ĐỘ 1: PIPELINE PHỄU BÁN HÀNG */}
      {viewMode === 'pipeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', alignItems: 'flex-start' }}>
          {stages.map((stg) => {
            const stgDeals = filteredDeals.filter((d) => d.stage === stg);
            const stgVal = stgDeals.reduce((sum, d) => sum + d.deal_value_vnd, 0);

            return (
              <div
                key={stg}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '16px',
                  minHeight: '420px',
                }}
              >
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>
                      {stg}
                    </h4>
                    <span style={{ backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontSize: '11.5px', fontWeight: 'bold' }}>
                      {stgDeals.length}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#059669', marginTop: '4px' }}>
                    {formatVND(stgVal)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stgDeals.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        border: d.is_overdue ? '1px solid #f87171' : '1px solid #e2e8f0',
                        padding: '14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        position: 'relative',
                      }}
                    >
                      {d.is_overdue && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '11px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', marginBottom: '8px', display: 'inline-block' }}>
                          ⚠️ Quá hạn gọi lại: {d.next_follow_up_date}
                        </div>
                      )}

                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                        {d.company_name}
                      </div>

                      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                        👤 {d.contact_person}
                      </div>

                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                        📞 {d.phone} | ✉️ {d.email}
                      </div>

                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#0284c7', marginBottom: '8px' }}>
                        {formatVND(d.deal_value_vnd)}
                      </div>

                      <div style={{ fontSize: '11.5px', color: '#64748b', backgroundColor: '#f8fafc', padding: '6px 8px', borderRadius: '6px', marginBottom: '10px' }}>
                        📝 {d.notes}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                        {d.is_overdue ? (
                          <button
                            onClick={() => markCallDone(d.id)}
                            style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            ✓ Đã gọi lại
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                            Hẹn: {d.next_follow_up_date}
                          </span>
                        )}

                        {stg !== 'Chốt thành công' && (
                          <button
                            onClick={() => {
                              const currIdx = stages.indexOf(stg);
                              if (currIdx < stages.length - 1) {
                                updateDealStage(d.id, stages[currIdx + 1]);
                              }
                            }}
                            style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Chuyển tiếp ▶
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CHẾ ĐỘ 2: DANH SÁCH BẢNG */}
      {viewMode === 'list' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px' }}>Mã cơ hội</th>
                <th style={{ padding: '12px 16px' }}>Tên công ty</th>
                <th style={{ padding: '12px 16px' }}>Người liên hệ</th>
                <th style={{ padding: '12px 16px' }}>Số điện thoại</th>
                <th style={{ padding: '12px 16px' }}>Giá trị dự kiến</th>
                <th style={{ padding: '12px 16px' }}>Giai đoạn</th>
                <th style={{ padding: '12px 16px' }}>Phụ trách</th>
                <th style={{ padding: '12px 16px' }}>Lần hẹn kế tiếp</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0284c7' }}>{d.code}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{d.company_name}</td>
                  <td style={{ padding: '12px 16px' }}>{d.contact_person}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{d.phone}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '800', color: '#059669' }}>
                    {formatVND(d.deal_value_vnd)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                      {d.stage}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{d.assigned_to}</td>
                  <td style={{ padding: '12px 16px', color: d.is_overdue ? '#dc2626' : '#64748b', fontWeight: d.is_overdue ? 'bold' : 'normal' }}>
                    {d.next_follow_up_date} {d.is_overdue && '⚠️ Quá hạn'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL THÊM CƠ HỘI MỚI */}
      {showAddModal && (
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
                Thêm Cơ Hội Khách Hàng Mới
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Tên công ty / Tổ chức:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Công ty TNHH Giải Pháp Công Nghệ..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Người đại diện:
                  </label>
                  <input
                    type="text"
                    placeholder="Họ tên người liên hệ"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Số điện thoại:
                  </label>
                  <input
                    type="text"
                    placeholder="0912..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Giá trị hợp đồng kỳ vọng:
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000000"
                    value={dealValue}
                    onChange={(e) => setDealValue(Math.max(0, Number(e.target.value)))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 'bold', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Giai đoạn khởi tạo:
                  </label>
                  <select
                    value={stage}
                    onChange={(e: any) => setStage(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Ghi chú nhu cầu khách:
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '13px' }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                >
                  Tạo cơ hội
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
