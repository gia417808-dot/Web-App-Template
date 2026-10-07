import React, { useState } from 'react';
import MasterAppBlueprint from './components/MasterAppBlueprint';
import MarketplaceApp from './apps/MarketplaceApp';
import EquipmentErpApp from './apps/EquipmentErpApp';
import WarehouseApp from './apps/WarehouseApp';
import FinanceApp from './apps/FinanceApp';
import TasksApp from './apps/TasksApp';
import PosApp from './apps/PosApp';
import CrmApp from './apps/CrmApp';

export type ActiveAppId = 'master_blueprint' | 'marketplace' | 'equipment_erp' | 'warehouse' | 'finance' | 'tasks' | 'pos' | 'crm';

interface AppTab {
  id: ActiveAppId;
  label: string;
  shortLabel: string;
  icon: string;
  badge?: string;
}

const APPS: AppTab[] = [
  { id: 'master_blueprint', label: '🌟 Flagship Master Blueprint: Quản Lý Dự Án (v1.0 - v5.0)', shortLabel: 'Master Blueprint', icon: '💎', badge: 'Flagship' },
  { id: 'marketplace', label: 'Sàn Template (Thu Gọn)', shortLabel: 'Marketplace', icon: '🏪' },
  { id: 'tasks', label: 'Quản Lý Công Việc v5.0', shortLabel: 'Kanban', icon: '📋' },
  { id: 'warehouse', label: 'Kho Đa Kho v3.0', shortLabel: 'Kho hàng', icon: '📦' },
  { id: 'finance', label: 'Thu Chi & Runway v4.1', shortLabel: 'Thu chi', icon: '💰' },
  { id: 'pos', label: 'F&B POS Nhà Hàng v3.0', shortLabel: 'POS VietQR', icon: '☕', badge: 'VietQR' },
  { id: 'crm', label: 'CRM Bán Hàng v7.1', shortLabel: 'CRM', icon: '🎯' },
  { id: 'equipment_erp', label: 'Mini-ERP & Cho Thuê Thiết Bị v1.0', shortLabel: 'Thiết bị & ERP', icon: '⚙️', badge: 'New' },
];

export default function App() {
  const [activeApp, setActiveApp] = useState<ActiveAppId>('master_blueprint');

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
                onClick={() => setActiveApp('master_blueprint')}
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
                <span style={{ fontSize: '20px' }}>💎</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.3px' }}>
                  GSHEETS.VN MASTER SUITE
                </span>
              </div>
              <span style={{ color: '#475569', fontSize: '18px' }}>|</span>
              <span style={{ fontSize: '13.5px', color: '#cbd5e1', fontWeight: '500' }}>
                Bộ Khung Chuẩn Mực (Master Blueprint) & Cơ Chế Nhân Bản Web App
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
                        backgroundColor: isActive ? '#ffffff' : tab.badge === 'Flagship' ? '#f59e0b' : tab.badge === 'New' ? '#10b981' : '#ef4444',
                        color: isActive ? '#0284c7' : tab.badge === 'Flagship' ? '#000000' : '#ffffff',
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

      {/* THANH ĐIỀU HƯỚNG CỐ ĐỊNH KHI ĐANG MỞ APP KHÁC */}
      {activeApp !== 'master_blueprint' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '10px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '62px',
            zIndex: 90,
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setActiveApp('master_blueprint')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
              }}
            >
              💎 Về Master Blueprint Flagship
            </button>
            {activeApp !== 'marketplace' && (
              <button
                type="button"
                onClick={() => setActiveApp('marketplace')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🏪 Về Sàn Marketplace
              </button>
            )}
          </div>
          <div style={{ fontSize: '13px', color: '#475569' }}>
            Đang trải nghiệm: <strong style={{ color: '#0284c7' }}>{currentAppDef.label}</strong>
          </div>
        </div>
      )}

      {/* VÙNG HIỂN THỊ NỘI DUNG ỨNG DỤNG ĐANG CHỌN */}
      <main style={{ maxWidth: '1600px', margin: '0 auto', minHeight: 'calc(100vh - 120px)' }}>
        {activeApp === 'master_blueprint' && (
          <MasterAppBlueprint />
        )}

        {activeApp === 'marketplace' && (
          <MarketplaceApp onSelectApp={(target) => setActiveApp(target as ActiveAppId)} />
        )}

        {activeApp === 'equipment_erp' && (
          <EquipmentErpApp onBack={() => setActiveApp('master_blueprint')} />
        )}

        {activeApp === 'warehouse' && (
          <WarehouseApp onBack={() => setActiveApp('master_blueprint')} />
        )}

        {activeApp === 'finance' && (
          <FinanceApp onBack={() => setActiveApp('master_blueprint')} />
        )}

        {activeApp === 'tasks' && (
          <TasksApp onBack={() => setActiveApp('master_blueprint')} />
        )}

        {activeApp === 'pos' && (
          <PosApp onBack={() => setActiveApp('master_blueprint')} />
        )}

        {activeApp === 'crm' && (
          <CrmApp onBack={() => setActiveApp('master_blueprint')} />
        )}
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
            © 2026 <strong>GSheets.vn Master Blueprint Ecosystem</strong>. Kiến trúc gốc chuẩn mực & cơ chế nhân bản chuyên sâu.
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
