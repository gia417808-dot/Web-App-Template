import React, { useState } from 'react';

export interface EquipmentContract {
  id: string;
  barcode: string;
  name: string;
  category: string;
  renterName: string;
  renterPhone: string;
  dailyRate: number;
  depositAmount: number;
  startDate: string;
  returnDate: string;
  status: 'renting' | 'available' | 'maintenance' | 'returned';
  contractCode: string;
  notes: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  tag: string;
  type: 'dispatch' | 'return' | 'maintenance' | 'contract' | 'audit';
  description: string;
  amount?: number;
  author: string;
}

const INITIAL_EQUIPMENT: EquipmentContract[] = [
  {
    id: 'EQ-001',
    barcode: 'BC-CAM-802',
    name: 'Sony FX3 Full-Frame Cinema Camera + Rig Tilta',
    category: 'Máy quay Cinema',
    renterName: 'Công ty Truyền thông MediaPro',
    renterPhone: '0983 112 233',
    dailyRate: 850000,
    depositAmount: 15000000,
    startDate: '2026-08-03',
    returnDate: '2026-08-06',
    status: 'renting',
    contractCode: 'HĐ-TB-2026-081',
    notes: 'Kèm 2 thẻ nhớ CFexpress Type A 160GB, 3 pin chính hãng',
  },
  {
    id: 'EQ-002',
    barcode: 'BC-DRONE-01',
    name: 'DJI Mavic 3 Cine Combo 3 Pin + RC Pro',
    category: 'Flycam & Drone',
    renterName: 'Studio Ánh Dương',
    renterPhone: '0908 445 566',
    dailyRate: 1200000,
    depositAmount: 20000000,
    startDate: '2026-07-31',
    returnDate: '2026-08-03',
    status: 'returned',
    contractCode: 'HĐ-TB-2026-075',
    notes: 'Đã thu hồi & hoàn cọc 100% lúc 10:15 ngày 03/08/2026',
  },
  {
    id: 'EQ-003',
    barcode: 'BC-LENS-2470',
    name: 'Sony FE 24-70mm f/2.8 GM II (G Master)',
    category: 'Ống kính',
    renterName: 'Kho Nội Bộ (Sẵn Sàng)',
    renterPhone: 'Thủ kho phụ trách',
    dailyRate: 450000,
    depositAmount: 10000000,
    startDate: '2026-08-03',
    returnDate: '2026-08-10',
    status: 'available',
    contractCode: 'NIÊM-PHONG-KHO',
    notes: 'Vừa hoàn tất bảo dưỡng định kỳ 13:45 ngày 03/08/2026',
  },
  {
    id: 'EQ-004',
    barcode: 'BC-LIGHT-300W',
    name: 'Đèn Aputure Light Storm 300d II + Softbox Dome',
    category: 'Ánh sáng Studio',
    renterName: 'Công ty Truyền thông MediaPro',
    renterPhone: '0983 112 233',
    dailyRate: 350000,
    depositAmount: 6000000,
    startDate: '2026-08-03',
    returnDate: '2026-08-06',
    status: 'renting',
    contractCode: 'HĐ-TB-2026-082',
    notes: 'Đi kèm chân C-Stand và tạ cát giữ thăng bằng',
  },
  {
    id: 'EQ-005',
    barcode: 'BC-AUDIO-SET01',
    name: 'Trọn gói Âm thanh Sân khấu Ngoài trời + 2 Mic Sennheiser',
    category: 'Âm thanh Sự kiện',
    renterName: 'Công ty Sự Kiện VinaEvent',
    renterPhone: '0912 889 900',
    dailyRate: 4500000,
    depositAmount: 35000000,
    startDate: '2026-08-04',
    returnDate: '2026-08-07',
    status: 'available',
    contractCode: 'HĐ-TB-2026-088',
    notes: 'Hợp đồng tạo ngày 03/08/2026 - Lịch giao 07:00 ngày 04/08/2026',
  },
  {
    id: 'EQ-006',
    barcode: 'BC-GIMBAL-RS3',
    name: 'DJI RS 3 Pro Gimbal Stabilizer Combo',
    category: 'Phụ kiện chống rung',
    renterName: 'Freelancer Tuấn Nguyễn',
    renterPhone: '0977 334 455',
    dailyRate: 300000,
    depositAmount: 5000000,
    startDate: '2026-08-02',
    returnDate: '2026-08-04',
    status: 'renting',
    contractCode: 'HĐ-TB-2026-079',
    notes: 'Kèm motor lấy nét DJI Focus Pro LiDAR',
  },
];

const INITIAL_LOGS_AUGUST_3: ActivityLog[] = [
  {
    id: 'LOG-01',
    time: '03/08/2026 08:30:15',
    tag: 'Bàn giao & Nhận cọc',
    type: 'dispatch',
    description:
      'Bàn giao thiết bị BC-CAM-802 (Sony FX3 Full-frame Cinema + Khung Rig Tilta) cho khách hàng Công ty Truyền thông MediaPro. Đã thu cọc bảo lãnh 15.000.000 ₫ qua chuyển khoản VietQR MB Bank. Quét barcode kiểm tra cảm biến và 2 thẻ nhớ CFexpress Type A hoạt động chuẩn xác. Hạn hoàn trả: 06/08/2026.',
    amount: 15000000,
    author: 'Trần Hải Nam (Thủ kho)',
  },
  {
    id: 'LOG-02',
    time: '03/08/2026 10:15:42',
    tag: 'Thu hồi & Hoàn cọc',
    type: 'return',
    description:
      'Tiếp nhận thu hồi thiết bị BC-DRONE-01 (Combo Flycam DJI Mavic 3 Cine + Bộ 3 pin) từ Studio Ánh Dương. Kiểm tra gimbal và cánh bay hoàn hảo không trầy xước. Ký biên bản bàn giao, hoàn trả 100% tiền cọc 20.000.000 ₫. Quyết toán doanh thu thuê 3 ngày: 3.600.000 ₫ đã kết chuyển vào sổ quỹ Mini-ERP.',
    amount: -20000000,
    author: 'Nguyễn Văn Minh (Kỹ thuật)',
  },
  {
    id: 'LOG-03',
    time: '03/08/2026 13:45:00',
    tag: 'Bảo trì định kỳ',
    type: 'maintenance',
    description:
      'Kỹ thuật viên bảo dưỡng cụm Lens Sony G Master 24-70mm f/2.8 GM II (Mã barcode BC-LENS-2470) sau 12 đợt thuê trong tháng. Vệ sinh thấu kính chân không, cập nhật biên bản kiểm định tình trạng tốt 99%. Chuyển trạng thái sang "Sẵn sàng cho thuê".',
    author: 'Nguyễn Văn Minh (Kỹ thuật)',
  },
  {
    id: 'LOG-04',
    time: '03/08/2026 15:20:10',
    tag: 'Tạo hợp đồng Mini-ERP',
    type: 'contract',
    description:
      'Khởi tạo hợp đồng thuê thiết bị HĐ-TB-2026-088: Trọn gói hệ thống âm thanh biểu diễn ngoài trời (Mã barcode BC-AUDIO-SET01). Khách thuê: Cty Sự Kiện VinaEvent. Tiền cọc: 35.000.000 ₫, tiền thuê: 4.500.000 ₫/ngày. Lịch giao thiết bị lúc 07:00 ngày 04/08/2026.',
    amount: 35000000,
    author: 'Lê Hoàng Yến (Kinh doanh)',
  },
  {
    id: 'LOG-05',
    time: '03/08/2026 17:30:00',
    tag: 'Chốt ca & Kiểm soát IP/Thiết bị',
    type: 'audit',
    description:
      'Hệ thống Mini-ERP tự động đối soát: 18 thiết bị đang hoạt động ngoài công trình, không phát hiện vi phạm quyền theo dòng hoặc truy cập trái phép. Toàn bộ chứng từ và log thao tác đã được sao lưu tự động lên Google Workspace.',
    author: 'Hệ thống Quản trị Tự động',
  },
];

export default function EquipmentErpApp() {
  const [equipmentList, setEquipmentList] = useState<EquipmentContract[]>(INITIAL_EQUIPMENT);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS_AUGUST_3);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form State
  const [barcodeInput, setBarcodeInput] = useState<string>('BC-CAM-802');
  const [nameInput, setNameInput] = useState<string>('Sony FX3 Full-Frame Cinema Camera');
  const [categoryInput, setCategoryInput] = useState<string>('Máy quay Cinema');
  const [renterNameInput, setRenterNameInput] = useState<string>('Công ty Truyền thông MediaPro');
  const [renterPhoneInput, setRenterPhoneInput] = useState<string>('0983 112 233');
  const [dailyRateInput, setDailyRateInput] = useState<number>(850000);
  const [depositInput, setDepositInput] = useState<number>(15000000);
  const [startDateInput, setStartDateInput] = useState<string>('2026-08-03');
  const [returnDateInput, setReturnDateInput] = useState<string>('2026-08-06');
  const [notesInput, setNotesInput] = useState<string>('Hợp đồng theo chuẩn Webapp gsheets.vn');

  // Modals
  const [selectedReceipt, setSelectedReceipt] = useState<EquipmentContract | null>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Submit form hợp đồng / thiết bị mới
  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    const newContractCode = `HĐ-TB-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newId = `EQ-${Math.floor(100 + Math.random() * 900)}`;

    const newItem: EquipmentContract = {
      id: newId,
      barcode: barcodeInput,
      name: nameInput,
      category: categoryInput,
      renterName: renterNameInput,
      renterPhone: renterPhoneInput,
      dailyRate: dailyRateInput,
      depositAmount: depositInput,
      startDate: startDateInput,
      returnDate: returnDateInput,
      status: 'renting',
      contractCode: newContractCode,
      notes: notesInput,
    };

    setEquipmentList([newItem, ...equipmentList]);

    // Thêm log vào nhật ký ngày 03/08/2026
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      time: `03/08/2026 ${new Date().toLocaleTimeString('vi-VN')}`,
      tag: 'Bàn giao & Nhận cọc',
      type: 'dispatch',
      description: `Khởi tạo hợp đồng ${newContractCode} cho thiết bị ${barcodeInput} (${nameInput}) bàn giao cho ${renterNameInput}. Nhận cọc ${formatVND(depositInput)}, đơn giá ${formatVND(dailyRateInput)}/ngày. Ngày trả dự kiến: ${returnDateInput}.`,
      amount: depositInput,
      author: 'Admin Quản Trị Mini-ERP',
    };
    setLogs([newLog, ...logs]);

    showToast(`✓ Đã lưu hợp đồng [${newContractCode}] và ghi nhận nhật ký ngày 03/08/2026 thành công!`);
  };

  // Hoàn cọc & thu hồi thiết bị
  const handleReturnEquipment = (item: EquipmentContract) => {
    setEquipmentList((prev) =>
      prev.map((eq) =>
        eq.id === item.id ? { ...eq, status: 'returned', notes: `Đã thu hồi & hoàn cọc ngày 03/08/2026` } : eq
      )
    );

    const returnLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      time: `03/08/2026 ${new Date().toLocaleTimeString('vi-VN')}`,
      tag: 'Thu hồi & Hoàn cọc',
      type: 'return',
      description: `Tiếp nhận thu hồi thiết bị ${item.barcode} (${item.name}) từ khách hàng ${item.renterName}. Kiểm tra tình trạng nguyên vẹn, giải tỏa hoàn cọc ${formatVND(item.depositAmount)} về tài khoản khách hàng.`,
      amount: -item.depositAmount,
      author: 'Thủ kho & Kỹ thuật viên',
    };
    setLogs([returnLog, ...logs]);

    showToast(`✓ Đã hoàn cọc ${formatVND(item.depositAmount)} và chuyển trạng thái thiết bị [${item.barcode}] sang ĐÃ THU HỒI!`);
  };

  // Filter list
  const filteredEquipment = equipmentList.filter((item) => {
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.barcode.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.renterName.toLowerCase().includes(q) ||
      item.contractCode.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* THÔNG BÁO TOAST */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '30px',
            backgroundColor: '#065f46',
            color: '#ffffff',
            padding: '12px 22px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 10000,
            fontSize: '13.5px',
            fontWeight: '600',
            border: '1px solid #34d399',
          }}
        >
          {notification}
        </div>
      )}

      {/* HEADER BANNER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0369a1 100%)',
          borderRadius: '16px',
          padding: '28px 34px',
          color: '#ffffff',
          marginBottom: '26px',
          boxShadow: '0 8px 24px rgba(3, 105, 161, 0.22)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255,255,255,0.18)',
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: '700',
                marginBottom: '10px',
              }}
            >
              ⚡ Webapp | Quản Trị Mini-ERP & Cho Thuê Thiết Bị (v1.0)
            </div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Quản Lý Cho Thuê Thiết Bị, Barcode & Nhật Ký Giao Dịch
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9, maxWidth: '780px', lineHeight: 1.6 }}>
              Giải pháp Mini-ERP tích hợp POS, kiểm soát barcode máy móc, hợp đồng cọc thuê theo ngày, lịch đặt & thu hồi; theo dõi bảo trì, phân quyền theo dòng và đồng bộ Google Workspace chuẩn gsheets.vn.
            </p>
          </div>

          {/* KPI CARDS */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '12px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '800' }}>48 Thiết bị</div>
              <div style={{ fontSize: '11.5px', opacity: 0.85 }}>Tổng kho quản lý</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '12px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#4ade80' }}>145.5 Tr ₫</div>
              <div style={{ fontSize: '11.5px', opacity: 0.85 }}>Tiền cọc bảo lãnh</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '12px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#38bdf8' }}>03/08/2026</div>
              <div style={{ fontSize: '11.5px', opacity: 0.85 }}>Ngày phiên làm việc</div>
            </div>
          </div>
        </div>
      </div>

      {/* KHUNG QUẢN LÝ: FORM TẠO HỢP ĐỒNG & TRA CỨU BARCODE */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '26px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📦</span>
            <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
              Form Quản Lý Thiết Bị, Barcode & Hợp Đồng Cọc Thuê
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowBarcodeScanner(true)}
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📷 Quét Barcode Nhanh (Camera)
          </button>
        </div>

        {/* CHIP CHỌN NHANH MÃ BARCODE MẪU */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Barcode mẫu có sẵn:</span>
          {['BC-CAM-802', 'BC-DRONE-01', 'BC-LENS-2470', 'BC-LIGHT-300W', 'BC-AUDIO-SET01'].map((bc) => (
            <button
              key={bc}
              type="button"
              onClick={() => {
                setBarcodeInput(bc);
                const found = INITIAL_EQUIPMENT.find((x) => x.barcode === bc);
                if (found) {
                  setNameInput(found.name);
                  setCategoryInput(found.category);
                  setDailyRateInput(found.dailyRate);
                  setDepositInput(found.depositAmount);
                  setRenterNameInput(found.renterName);
                  setRenterPhoneInput(found.renterPhone);
                }
              }}
              style={{
                backgroundColor: barcodeInput === bc ? '#0284c7' : '#f1f5f9',
                color: barcodeInput === bc ? '#ffffff' : '#334155',
                border: '1px solid #cbd5e1',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              🏷️ {bc}
            </button>
          ))}
        </div>

        {/* FORM GRID */}
        <form onSubmit={handleSaveContract}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Mã Barcode Thiết Bị:
              </label>
              <input
                type="text"
                required
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Tên Thiết Bị / Cấu Hình:
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Đơn Vị / Khách Thuê:
              </label>
              <input
                type="text"
                required
                value={renterNameInput}
                onChange={(e) => setRenterNameInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Số Điện Thoại / Zalo:
              </label>
              <input
                type="text"
                value={renterPhoneInput}
                onChange={(e) => setRenterPhoneInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Giá Thuê Theo Ngày (₫):
              </label>
              <input
                type="number"
                required
                min={0}
                step={50000}
                value={dailyRateInput}
                onChange={(e) => setDailyRateInput(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Tiền Cọc Bảo Lãnh (₫):
              </label>
              <input
                type="number"
                required
                min={0}
                step={500000}
                value={depositInput}
                onChange={(e) => setDepositInput(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Ngày Bắt Đầu:
              </label>
              <input
                type="date"
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Ngày Dự Kiến Hoàn Trả:
              </label>
              <input
                type="date"
                value={returnDateInput}
                onChange={(e) => setReturnDateInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '11px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
              }}
            >
              ➕ Lưu Hợp Đồng & Cập Nhật Nhật Ký Ngày 03/08/2026
            </button>
          </div>
        </form>
      </div>

      {/* DANH SÁCH THIẾT BỊ VÀ TRẠNG THÁI KHAI THÁC */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '26px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16.5px', fontWeight: '800', color: '#0f172a' }}>
              Danh Sách Thiết Bị Khai Thác & Hợp Đồng Cho Thuê
            </h3>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Hiển thị {filteredEquipment.length} hợp đồng thiết bị trong hệ thống
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* SEARCH */}
            <input
              type="text"
              placeholder="🔍 Tìm mã Barcode, tên máy, khách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
            />

            {/* STATUS FILTER BUTTONS */}
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'renting', label: 'Đang cho thuê' },
              { id: 'available', label: 'Sẵn sàng' },
              { id: 'returned', label: 'Đã thu hồi' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setFilterStatus(st.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: filterStatus === st.id ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: filterStatus === st.id ? '#0284c7' : '#ffffff',
                  color: filterStatus === st.id ? '#ffffff' : '#475569',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* BẢNG GRID THIẾT BỊ */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Barcode</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Thiết bị & Cấu hình</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Khách thuê</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Giá thuê/ngày</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Cọc giữ</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Thời gian</th>
                <th style={{ padding: '10px 14px', fontWeight: '700' }}>Trạng thái</th>
                <th style={{ padding: '10px 14px', fontWeight: '700', textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((eq) => {
                const isRenting = eq.status === 'renting';
                const isAvailable = eq.status === 'available';
                const isReturned = eq.status === 'returned';

                return (
                  <tr key={eq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          backgroundColor: '#f1f5f9',
                          padding: '3px 7px',
                          borderRadius: '4px',
                          color: '#0f172a',
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        🏷️ {eq.barcode}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{eq.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>HĐ: {eq.contractCode}</div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: '600', color: '#334155' }}>{eq.renterName}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{eq.renterPhone}</div>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: '700', color: '#059669' }}>
                      {formatVND(eq.dailyRate)}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: '700', color: '#0284c7' }}>
                      {formatVND(eq.depositAmount)}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '12px', color: '#475569' }}>
                      {eq.startDate} ➔ {eq.returnDate}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          backgroundColor: isRenting
                            ? '#fee2e2'
                            : isAvailable
                            ? '#dcfce7'
                            : isReturned
                            ? '#e0e7ff'
                            : '#fef3c7',
                          color: isRenting
                            ? '#dc2626'
                            : isAvailable
                            ? '#166534'
                            : isReturned
                            ? '#3730a3'
                            : '#b45309',
                        }}
                      >
                        {isRenting
                          ? 'Đang thuê'
                          : isAvailable
                          ? 'Sẵn sàng'
                          : isReturned
                          ? 'Đã thu hồi'
                          : 'Bảo trì'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {isRenting && (
                          <button
                            type="button"
                            onClick={() => handleReturnEquipment(eq)}
                            style={{
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                          >
                            ✓ Hoàn cọc
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(eq)}
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            border: '1px solid #cbd5e1',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          📄 Biên bản
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* KHỐI ĐẶC THÙ: NHẬT KÝ MÔ TẢ GIAO DỊCH NGÀY 03/08/2026 (THEO YÊU CẦU ĐỀ BÀI) */}
      {/* ==================================================================== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>📅</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                Nhật Ký Vận Hành & Giao Dịch Thiết Bị — Ngày 03/08/2026
              </h3>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Lịch sử ghi chép thời gian thực từ Google Workspace: Bàn giao máy, cọc giữ, thu hồi, bảo trì thiết bị và kiểm soát IP.
            </p>
          </div>
          <span
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: '12px',
              fontWeight: '700',
              padding: '4px 12px',
              borderRadius: '20px',
            }}
          >
            ● Đồng bộ Live Google Workspace
          </span>
        </div>

        {/* TIMELINE LOGS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {logs.map((lg) => {
            let badgeBg = '#f1f5f9';
            let badgeColor = '#334155';
            if (lg.type === 'dispatch') {
              badgeBg = '#e0f2fe';
              badgeColor = '#0369a1';
            } else if (lg.type === 'return') {
              badgeBg = '#dcfce7';
              badgeColor = '#166534';
            } else if (lg.type === 'maintenance') {
              badgeBg = '#fef3c7';
              badgeColor = '#b45309';
            } else if (lg.type === 'contract') {
              badgeBg = '#f3e8ff';
              badgeColor = '#6b21a8';
            } else if (lg.type === 'audit') {
              badgeBg = '#f1f5f9';
              badgeColor = '#0f172a';
            }

            return (
              <div
                key={lg.id}
                style={{
                  borderLeft: `4px solid ${badgeColor}`,
                  backgroundColor: '#f8fafc',
                  borderRadius: '0 10px 10px 0',
                  padding: '14px 18px',
                  border: '1px solid #e2e8f0',
                  borderLeftWidth: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>
                      ⏱️ {lg.time}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: badgeBg,
                        color: badgeColor,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {lg.tag}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Người thao tác: <strong>{lg.author}</strong>
                  </div>
                </div>

                <p style={{ margin: '0 0 6px 0', fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
                  {lg.description}
                </p>

                {lg.amount !== undefined && (
                  <div style={{ fontSize: '12px', fontWeight: '700', color: lg.amount > 0 ? '#059669' : '#dc2626' }}>
                    Biến động quỹ cọc: {lg.amount > 0 ? '+' : ''}
                    {formatVND(lg.amount)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL BIÊN BẢN BÀN GIAO THIẾT BỊ */}
      {/* ==================================================================== */}
      {selectedReceipt && (
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
              borderRadius: '14px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ borderBottom: '2px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                BIÊN BẢN BÀN GIAO THIẾT BỊ & CỌC THUÊ
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Mã HĐ: <strong>{selectedReceipt.contractCode}</strong> | Ngày: <strong>03/08/2026</strong>
              </div>
            </div>

            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#334155', marginBottom: '18px' }}>
              <div>• <strong>Mã Barcode:</strong> {selectedReceipt.barcode}</div>
              <div>• <strong>Tên thiết bị:</strong> {selectedReceipt.name}</div>
              <div>• <strong>Bên thuê:</strong> {selectedReceipt.renterName} ({selectedReceipt.renterPhone})</div>
              <div>• <strong>Đơn giá thuê:</strong> {formatVND(selectedReceipt.dailyRate)} / ngày</div>
              <div>• <strong>Tiền cọc giữ:</strong> <span style={{ color: '#0284c7', fontWeight: '800' }}>{formatVND(selectedReceipt.depositAmount)}</span></div>
              <div>• <strong>Thời gian thuê:</strong> {selectedReceipt.startDate} đến {selectedReceipt.returnDate}</div>
              <div>• <strong>Ghi chú kỹ thuật:</strong> {selectedReceipt.notes}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '20px', fontSize: '12.5px' }}>
              <div>
                <strong>BÊN GIAO THIẾT BỊ</strong>
                <div style={{ height: '50px' }}></div>
                <div style={{ color: '#64748b' }}>(Ký & đóng dấu)</div>
              </div>
              <div>
                <strong>BÊN NHẬN THIẾT BỊ</strong>
                <div style={{ height: '50px' }}></div>
                <div style={{ color: '#64748b' }}>(Ký & ghi rõ họ tên)</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                🖨️ In Biên Bản Này
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#334155',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL MÔ PHỎNG QUÉT MÃ BARCODE */}
      {/* ==================================================================== */}
      {showBarcodeScanner && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
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
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '17px', fontWeight: '800' }}>
              📷 Trình Quét Mã Barcode Thiết Bị
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
              Hướng ống kính camera về phía mã vạch dán trên thiết bị để nhận diện tự động
            </p>

            <div
              style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
                overflow: 'hidden',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  width: '80%',
                  height: '2px',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 10px #ef4444',
                  position: 'absolute',
                  top: '50%',
                }}
              />
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>[ Đang quét mã vạch... ]</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setBarcodeInput('BC-CAM-802');
                  setNameInput('Sony FX3 Full-Frame Cinema Camera + Rig Tilta');
                  setShowBarcodeScanner(false);
                  showToast('✓ Đã quét thành công mã: BC-CAM-802');
                }}
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Nhận diện BC-CAM-802
              </button>
              <button
                type="button"
                onClick={() => setShowBarcodeScanner(false)}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#334155',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
