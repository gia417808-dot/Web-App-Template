import React, { useState } from 'react';
import MarketplaceApp from './apps/MarketplaceApp';
import EquipmentErpApp from './apps/EquipmentErpApp';
import WarehouseApp from './apps/WarehouseApp';
import FinanceApp from './apps/FinanceApp';
import TasksApp from './apps/TasksApp';
import PosApp from './apps/PosApp';
import CrmApp from './apps/CrmApp';

export type ActiveAppId = 'marketplace' | 'equipment_erp' | 'warehouse' | 'finance' | 'tasks' | 'pos' | 'crm';

interface AppTab {
  id: ActiveAppId;
  label: string;
  shortLabel: string;
  icon: string;
  badge?: string;
}

const APPS: AppTab[] = [
  { id: 'marketplace', label: 'Sàn Template (229 SP)', shortLabel: 'Marketplace', icon: '🏪', badge: 'Hot' },
  { id: 'equipment_erp', label: 'Mini-ERP & Cho Thuê Thiết Bị v1.0', shortLabel: 'Thiết bị & ERP', icon: '⚙️', badge: 'New' },
  { id: 'warehouse', label: 'Kho Đa Kho v3.0', shortLabel: 'Kho hàng', icon: '📦' },
  { id: 'finance', label: 'Thu Chi & Runway v4.1', shortLabel: 'Thu chi', icon: '💰' },
  { id: 'tasks', label: 'Quản Lý Công Việc v5.0', shortLabel: 'Kanban', icon: '📋' },
  { id: 'pos', label: 'F&B POS Nhà Hàng v3.0', shortLabel: 'POS VietQR', icon: '☕', badge: 'VietQR' },
  { id: 'crm', label: 'CRM Bán Hàng v7.1', shortLabel: 'CRM', icon: '🎯' },
];

export default function App() {
  const [activeApp, setActiveApp] = useState<ActiveAppId>('marketplace');

  const currentAppDef = APPS.find((a) => a.id === activeApp) || APPS[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* TOP HEADER HỆ THỐNG & APP SWITCHER */}
      <header
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px' }}>
          {/* DÒNG TIÊU ĐỀ CHÍNH */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '62px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                onClick={() => setActiveApp('marketplace')}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(2, 132, 199, 0.2)',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                <span style={{ fontSize: '20px' }}>⚡</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.3px' }}>
                  GSHEETS.VN ECOSYSTEM
                </span>
              </div>
              <span style={{ color: '#475569', fontSize: '18px' }}>|</span>
              <span style={{ fontSize: '13.5px', color: '#cbd5e1', fontWeight: '500' }}>
                Hệ Sinh Thái 229 Sản Phẩm Quản Trị Vận Hành Doanh Nghiệp
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span
                style={{
                  fontSize: '12px',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                Offline Ready 100%
              </span>
            </div>
          </div>

          {/* THANH ĐIỀU HƯỚNG APP SWITCHER TƯƠNG TÁC */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '8px 0' }}>
            {APPS.map((tab) => {
              const isActive = tab.id === activeApp;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveApp(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? '#0284c7' : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : '500',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease-in-out',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        backgroundColor: isActive ? '#ffffff' : tab.badge === 'New' ? '#10b981' : '#ef4444',
                        color: isActive ? '#0284c7' : '#ffffff',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        marginLeft: '2px',
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* VÙNG HIỂN THỊ NỘI DUNG ỨNG DỤNG ĐANG CHỌN */}
      <main style={{ maxWidth: '1600px', margin: '0 auto', minHeight: 'calc(100vh - 120px)' }}>
        {activeApp === 'marketplace' && (
          <MarketplaceApp onSelectApp={(target) => setActiveApp(target)} />
        )}

        {activeApp === 'equipment_erp' && <EquipmentErpApp />}

        {activeApp === 'warehouse' && <WarehouseApp />}

        {activeApp === 'finance' && <FinanceApp />}

        {activeApp === 'tasks' && <TasksApp />}

        {activeApp === 'pos' && <PosApp />}

        {activeApp === 'crm' && <CrmApp />}
      </main>

      {/* FOOTER HỆ THỐNG */}
      <footer
        style={{
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          padding: '20px 24px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#64748b',
          marginTop: '40px',
        }}
      >
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            © 2026 <strong>GSheets.vn Ecosystem Suite</strong>. Toàn bộ 229 giải pháp quản trị vận hành độc bản, tối ưu Netlify / Vercel.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Phân hệ đang mở: <strong style={{ color: '#0284c7' }}>{currentAppDef.label}</strong></span>
            <span>Chuẩn hóa: UTF-8 without BOM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
