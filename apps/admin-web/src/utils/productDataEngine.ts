// ============================================================================
// METADATA-DRIVEN PRODUCT DATASET ENGINE
// Sinh cấu trúc cột, KPIs và dữ liệu mẫu độc bản 1-to-1 theo tiêu đề sản phẩm
// ============================================================================

export interface ProductKPI {
  label: string;
  value: string;
  subtext: string;
  color?: string;
  icon?: string;
}

export interface ProductColumn {
  letter: string;
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  badgeStyle?: boolean;
}

export interface ProductDataset {
  domain: string;
  domainTitle: string;
  versionBadge: string;
  appIcon: string;
  kpis: ProductKPI[];
  columns: ProductColumn[];
  rows: { [key: string]: string }[];
  formulaInfo: {
    cell: string;
    formula: string;
    explanation: string;
  };
  searchPlaceholder: string;
  sampleFormFields: {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    defaultValue: string;
    options?: string[];
  }[];
  quickActions: string[];
}

export function getProductDataset(
  id: string,
  rawTitle: string,
  rawCategory: string = '',
  rawDescription: string = '',
  version: string = 'v1.0'
): ProductDataset {
  const title = (rawTitle + ' ' + rawCategory + ' ' + rawDescription).toLowerCase();

  // 1. NHÓM TIỆM SỬA XE / HỘ KINH DOANH
  if (title.includes('sửa xe') || title.includes('tiệm sửa xe') || title.includes('xe máy') || title.includes('gara')) {
    return {
      domain: 'motorcycle_repair',
      domainTitle: 'Hệ Thống Quản Lý Tiệm Sửa Xe & Hộ Kinh Doanh Dịch Vụ',
      versionBadge: version,
      appIcon: '🛵',
      kpis: [
        { label: 'Xe tiếp nhận hôm nay', value: '18 Xe', subtext: 'Đã hoàn thành 15 xe', color: '#0284c7', icon: '🏍️' },
        { label: 'Doanh thu hôm nay', value: '6,450,000 ₫', subtext: '+18% so với hôm qua', color: '#059669', icon: '💰' },
        { label: 'Tiền phụ tùng thay thế', value: '4,150,000 ₫', subtext: 'Nhớt, lốp, sên, bugi', color: '#d97706', icon: '⚙️' },
        { label: 'Tiền công thợ sửa', value: '2,300,000 ₫', subtext: '3 thợ kỹ thuật chính', color: '#7c3aed', icon: '🔧' },
      ],
      columns: [
        { letter: 'A', key: 'stt', label: 'Mã Phiếu', width: '90px', align: 'center' },
        { letter: 'B', key: 'license_plate', label: 'Biển Số / Tên Khách', width: '150px' },
        { letter: 'C', key: 'bike_model', label: 'Loại Xe Máy', width: '130px' },
        { letter: 'D', key: 'repair_items', label: 'Hạng Mục Sửa Chữa & Bảo Dưỡng', width: '260px' },
        { letter: 'E', key: 'parts_cost', label: 'Tiền Phụ Tùng (₫)', width: '130px', align: 'right' },
        { letter: 'F', key: 'labor_cost', label: 'Tiền Công (₫)', width: '110px', align: 'right' },
        { letter: 'G', key: 'total_cost', label: 'Tổng Tiền (₫)', width: '130px', align: 'right' },
        { letter: 'H', key: 'payment_status', label: 'Thanh Toán', width: '120px', align: 'center', badgeStyle: true },
      ],
      rows: [
        {
          stt: 'PX-01',
          license_plate: '29E2-688.12 (Anh Nam)',
          bike_model: 'Honda SH 150i ABS',
          repair_items: 'Bảo dưỡng nồi, thay dây curoa Bando, vệ sinh kim phun',
          parts_cost: '950,000',
          labor_cost: '250,000',
          total_cost: '1,200,000',
          payment_status: '✓ Đã thanh toán (VietQR)',
        },
        {
          stt: 'PX-02',
          license_plate: '59P1-345.89 (Chị Lan)',
          bike_model: 'Honda Vision 110',
          repair_items: 'Thay nhớt máy Motul Scooter, nhớt lap, căn chỉnh phanh',
          parts_cost: '220,000',
          labor_cost: '50,000',
          total_cost: '270,000',
          payment_status: '✓ Đã thanh toán (Tiền mặt)',
        },
        {
          stt: 'PX-03',
          license_plate: '30F4-991.02 (Anh Tuấn)',
          bike_model: 'Honda Wave Alpha',
          repair_items: 'Thay nhông xích DID, thay lốp sau Casumina, vá săm',
          parts_cost: '480,000',
          labor_cost: '100,000',
          total_cost: '580,000',
          payment_status: '✓ Đã thanh toán (VietQR)',
        },
        {
          stt: 'PX-04',
          license_plate: '29K1-778.33 (Anh Dũng)',
          bike_model: 'Yamaha Exciter 150',
          repair_items: 'Thay chén cổ, xúc bình xăng con, thay bugi NGK Iridium',
          parts_cost: '620,000',
          labor_cost: '180,000',
          total_cost: '800,000',
          payment_status: '⚡ Đang sửa chữa',
        },
        {
          stt: 'PX-05',
          license_plate: '51V2-124.55 (Anh Khang)',
          bike_model: 'Honda Air Blade 125',
          repair_items: 'Thay cặp lốp không săm Michelin City Grip, thay má phanh',
          parts_cost: '1,450,000',
          labor_cost: '150,000',
          total_cost: '1,600,000',
          payment_status: '✓ Đã thanh toán (VietQR)',
        },
        {
          stt: 'PX-06',
          license_plate: '29B1-567.89 (Bác Hùng)',
          bike_model: 'Honda Lead 125',
          repair_items: 'Súc két nước mát, thay bình ắc quy GS 12V-6Ah',
          parts_cost: '430,000',
          labor_cost: '70,000',
          total_cost: '500,000',
          payment_status: '⏳ Chờ lấy xe',
        },
      ],
      formulaInfo: {
        cell: 'G2',
        formula: '=E2 + F2',
        explanation: 'Tổng hóa đơn = Tiền phụ tùng thay thế + Tiền công thợ.',
      },
      searchPlaceholder: '🔍 Tìm biển số xe, tên khách, dòng xe (SH, Wave, Vision...)...',
      sampleFormFields: [
        { key: 'license_plate', label: 'Biển số / Tên khách', type: 'text', defaultValue: '29B1-888.99 (Anh Hưng)' },
        { key: 'bike_model', label: 'Dòng xe máy', type: 'text', defaultValue: 'Honda SH 125i' },
        { key: 'repair_items', label: 'Hạng mục sửa chữa', type: 'text', defaultValue: 'Thay nhớt Motul + bảo dưỡng côn' },
        { key: 'parts_cost', label: 'Tiền phụ tùng (₫)', type: 'number', defaultValue: '350000' },
        { key: 'labor_cost', label: 'Tiền công (₫)', type: 'number', defaultValue: '100000' },
      ],
      quickActions: ['+ Tiếp nhận xe sửa mới', '🖨️ In phiếu biên nhận', '📊 Báo cáo doanh thu ngày', '📦 Tra tồn phụ tùng'],
    };
  }

  // 2. NHÓM KHÁCH SẠN / HOMESTAY / ĐẶT PHÒNG
  if (title.includes('khách sạn') || title.includes('homestay') || title.includes('đặt phòng') || title.includes('resort')) {
    return {
      domain: 'hotel_homestay',
      domainTitle: 'Hệ Thống Quản Lý Đặt Phòng Khách Sạn & Homestay',
      versionBadge: version,
      appIcon: '🏨',
      kpis: [
        { label: 'Tỷ lệ lấp đầy phòng', value: '85.7%', subtext: '18/21 phòng có khách', color: '#0284c7', icon: '🔑' },
        { label: 'Doanh thu phòng hôm nay', value: '14,200,000 ₫', subtext: 'Bao gồm phụ thu & minibar', color: '#059669', icon: '💵' },
        { label: 'Check-in hôm nay', value: '7 Phòng', subtext: '5 khách đã nhận phòng', color: '#d97706', icon: '🛎️' },
        { label: 'Check-out & Dọn phòng', value: '4 Phòng', subtext: '3 phòng đã dọn sạch', color: '#7c3aed', icon: '🧹' },
      ],
      columns: [
        { letter: 'A', key: 'room_no', label: 'Số Phòng', width: '90px', align: 'center' },
        { letter: 'B', key: 'room_type', label: 'Hạng Phòng', width: '150px' },
        { letter: 'C', key: 'guest_name', label: 'Tên Khách Đặt & SĐT', width: '180px' },
        { letter: 'D', key: 'checkin_time', label: 'Check-in', width: '110px', align: 'center' },
        { letter: 'E', key: 'checkout_time', label: 'Check-out', width: '110px', align: 'center' },
        { letter: 'F', key: 'rate_per_night', label: 'Giá/Đêm (₫)', width: '120px', align: 'right' },
        { letter: 'G', key: 'deposit_vnd', label: 'Cọc Đã Nhận (₫)', width: '120px', align: 'right' },
        { letter: 'H', key: 'room_status', label: 'Trạng Thái', width: '130px', align: 'center', badgeStyle: true },
      ],
      rows: [
        {
          room_no: 'P-101',
          room_type: 'Deluxe King View Biển',
          guest_name: 'Nguyễn Hoàng Anh (0912.445.678)',
          checkin_time: '03/08 14:00',
          checkout_time: '06/08 12:00',
          rate_per_night: '1,200,000',
          deposit_vnd: '1,500,000',
          room_status: '🟢 Đang có khách',
        },
        {
          room_no: 'P-102',
          room_type: 'Deluxe Twin Ban Công',
          guest_name: 'Trần Mai Phương (0988.334.221)',
          checkin_time: '03/08 14:30',
          checkout_time: '05/08 12:00',
          rate_per_night: '950,000',
          deposit_vnd: '1,000,000',
          room_status: '🟢 Đang có khách',
        },
        {
          room_no: 'P-201',
          room_type: 'Suite Gia Đình 4 Khách',
          guest_name: 'Lê Tuấn Vũ (0903.112.334)',
          checkin_time: '02/08 15:00',
          checkout_time: '07/08 11:30',
          rate_per_night: '1,800,000',
          deposit_vnd: '3,000,000',
          room_status: '🟢 Đang có khách',
        },
        {
          room_no: 'P-202',
          room_type: 'Studio Ban Công Thoáng',
          guest_name: 'Vũ Minh Tâm (0977.889.900)',
          checkin_time: '03/08 18:00',
          checkout_time: '04/08 12:00',
          rate_per_night: '850,000',
          deposit_vnd: '850,000',
          room_status: '🟡 Chờ check-in tối',
        },
        {
          room_no: 'P-301',
          room_type: 'Penthouse View Panorama',
          guest_name: 'Đoàn Thu Hà (0934.556.778)',
          checkin_time: '01/08 14:00',
          checkout_time: '03/08 12:00',
          rate_per_night: '3,500,000',
          deposit_vnd: '5,000,000',
          room_status: '🧹 Đang dọn buồng',
        },
        {
          room_no: 'P-302',
          room_type: 'Standard King Yên Tĩnh',
          guest_name: 'Trống sẵn sàng',
          checkin_time: '--',
          checkout_time: '--',
          rate_per_night: '750,000',
          deposit_vnd: '0',
          room_status: '⚪ Sẵn sàng đón khách',
        },
      ],
      formulaInfo: {
        cell: 'G2',
        formula: '=F2 * DATEDIF(D2, E2, "D")',
        explanation: 'Tổng tiền lưu trú = Giá phòng/đêm * Số đêm thực tế.',
      },
      searchPlaceholder: '🔍 Tìm số phòng (P-101, P-201), tên khách, SĐT...',
      sampleFormFields: [
        { key: 'room_no', label: 'Số phòng', type: 'text', defaultValue: 'P-203' },
        { key: 'room_type', label: 'Hạng phòng', type: 'text', defaultValue: 'Deluxe King Ban Công' },
        { key: 'guest_name', label: 'Tên khách & SĐT', type: 'text', defaultValue: 'Phạm Minh Đức (0912.999.888)' },
        { key: 'rate_per_night', label: 'Giá/đêm (₫)', type: 'number', defaultValue: '1100000' },
        { key: 'deposit_vnd', label: 'Tiền cọc (₫)', type: 'number', defaultValue: '1000000' },
      ],
      quickActions: ['+ Đặt phòng mới (Booking)', '🛎️ Check-in nhanh', '💳 Thanh toán & Check-out', '🧹 Cập nhật trạng thái dọn'],
    };
  }

  // 3. NHÓM CHẤM CÔNG / TIỀN LƯƠNG / NHÂN SỰ / NGHỈ PHÉP
  if (title.includes('chấm công') || title.includes('tiền lương') || title.includes('lương') || title.includes('nhân sự') || title.includes('nghỉ phép')) {
    return {
      domain: 'hr_payroll',
      domainTitle: 'Hệ Thống Quản Lý Chấm Công, Tính Lương & Hồ Sơ Nhân Sự',
      versionBadge: version,
      appIcon: '👥',
      kpis: [
        { label: 'Tổng quỹ lương tháng', value: '168,500,000 ₫', subtext: 'Chi trả 24 nhân sự', color: '#059669', icon: '💰' },
        { label: 'Tỷ lệ đi làm đủ công', value: '96.2%', subtext: '23/24 nhân sự đạt chuẩn', color: '#0284c7', icon: '📅' },
        { label: 'Tổng giờ tăng ca (OT)', value: '148 Giờ', subtext: 'Hệ số lương 1.5x - 2.0x', color: '#d97706', icon: '⏰' },
        { label: 'Đơn nghỉ phép chờ duyệt', value: '2 Đơn', subtext: 'Phép năm & việc cá nhân', color: '#7c3aed', icon: '📝' },
      ],
      columns: [
        { letter: 'A', key: 'emp_id', label: 'Mã NV', width: '80px', align: 'center' },
        { letter: 'B', key: 'full_name', label: 'Họ Và Tên Nhân Sự', width: '170px' },
        { letter: 'C', key: 'department', label: 'Phòng Ban', width: '130px' },
        { letter: 'D', key: 'work_days', label: 'Công Chuẩn', width: '90px', align: 'center' },
        { letter: 'E', key: 'ot_hours', label: 'Giờ OT', width: '80px', align: 'center' },
        { letter: 'F', key: 'base_salary', label: 'Lương Cơ Bản (₫)', width: '130px', align: 'right' },
        { letter: 'G', key: 'allowance', label: 'Phụ Cấp (₫)', width: '110px', align: 'right' },
        { letter: 'H', key: 'net_salary', label: 'Thực Lĩnh (₫)', width: '130px', align: 'right' },
        { letter: 'I', key: 'status', label: 'Trạng Thái', width: '110px', align: 'center', badgeStyle: true },
      ],
      rows: [
        {
          emp_id: 'NV-01',
          full_name: 'Phạm Minh Tuấn',
          department: 'Khối Công Nghệ',
          work_days: '24 / 24',
          ot_hours: '16',
          base_salary: '22,000,000',
          allowance: '2,500,000',
          net_salary: '26,100,000',
          status: '✓ Đã chuyển khoản',
        },
        {
          emp_id: 'NV-02',
          full_name: 'Hoàng Thu Trang',
          department: 'Phòng Tài Chính - Kế Toán',
          work_days: '24 / 24',
          ot_hours: '8',
          base_salary: '18,000,000',
          allowance: '2,000,000',
          net_salary: '20,600,000',
          status: '✓ Đã chuyển khoản',
        },
        {
          emp_id: 'NV-03',
          full_name: 'Lê Văn Hoàng',
          department: 'Phòng Kinh Doanh (B2B)',
          work_days: '23 / 24',
          ot_hours: '12',
          base_salary: '15,000,000',
          allowance: '8,500,000 (Hoa hồng)',
          net_salary: '24,200,000',
          status: '✓ Đã chuyển khoản',
        },
        {
          emp_id: 'NV-04',
          full_name: 'Vũ Mai Anh',
          department: 'Phòng UI/UX & Thiết Kế',
          work_days: '24 / 24',
          ot_hours: '4',
          base_salary: '16,000,000',
          allowance: '1,500,000',
          net_salary: '17,800,000',
          status: '✓ Đã chuyển khoản',
        },
        {
          emp_id: 'NV-05',
          full_name: 'Nguyễn Quốc Bảo',
          department: 'Vận Hành & Chăm Sóc KH',
          work_days: '24 / 24',
          ot_hours: '10',
          base_salary: '12,000,000',
          allowance: '1,800,000',
          net_salary: '14,400,000',
          status: '✓ Đã chuyển khoản',
        },
        {
          emp_id: 'NV-06',
          full_name: 'Đặng Minh Châu',
          department: 'Phòng Nhân Sự Tuyển Dụng',
          work_days: '22 / 24',
          ot_hours: '0',
          base_salary: '13,500,000',
          allowance: '1,500,000',
          net_salary: '13,875,000',
          status: '✓ Đã chuyển khoản',
        },
      ],
      formulaInfo: {
        cell: 'H2',
        formula: '=(F2 / 24) * D2 + G2 + (F2 / 24 / 8 * 1.5 * E2)',
        explanation: 'Thực lĩnh = (Lương cứng / Ngày công chuẩn) * Công thực tế + Phụ cấp + Làm thêm giờ OT.',
      },
      searchPlaceholder: '🔍 Tìm mã nhân viên, tên nhân sự, phòng ban...',
      sampleFormFields: [
        { key: 'emp_id', label: 'Mã NV', type: 'text', defaultValue: 'NV-07' },
        { key: 'full_name', label: 'Họ và tên', type: 'text', defaultValue: 'Trần Văn Quyết' },
        { key: 'department', label: 'Phòng ban', type: 'text', defaultValue: 'Phòng Kỹ Thuật' },
        { key: 'base_salary', label: 'Lương cơ bản (₫)', type: 'number', defaultValue: '15000000' },
        { key: 'allowance', label: 'Phụ cấp (₫)', type: 'number', defaultValue: '2000000' },
      ],
      quickActions: ['+ Chấm công ca hôm nay', '📝 Tạo phiếu lương tháng', '🖨️ Xuất bảng lương VietQR', '🏖️ Duyệt đơn nghỉ phép'],
    };
  }

  // 4. NHÓM LỚP HỌC / HỌC SINH / ĐIỂM DANH / KHÓA HỌC
  if (title.includes('lớp học') || title.includes('học sinh') || title.includes('học viên') || title.includes('điểm danh') || title.includes('khóa học')) {
    return {
      domain: 'education_class',
      domainTitle: 'Hệ Thống Quản Lý Lớp Học, Điểm Danh & Học Phí',
      versionBadge: version,
      appIcon: '🎓',
      kpis: [
        { label: 'Tổng số học viên', value: '64 Học viên', subtext: '4 Lớp học đang vận hành', color: '#0284c7', icon: '👨‍🎓' },
        { label: 'Tỷ lệ điểm danh', value: '94.8%', subtext: 'Buổi học gần nhất', color: '#059669', icon: '✅' },
        { label: 'Học phí đã thu', value: '186,000,000 ₫', subtext: 'Đạt 92% kế hoạch khóa', color: '#d97706', icon: '💰' },
        { label: 'Học phí còn nợ', value: '16,000,000 ₫', subtext: '3 học viên đang hẹn đợt 2', color: '#dc2626', icon: '⏳' },
      ],
      columns: [
        { letter: 'A', key: 'student_id', label: 'Mã HV', width: '80px', align: 'center' },
        { letter: 'B', key: 'student_name', label: 'Tên Học Viên', width: '160px' },
        { letter: 'C', key: 'class_name', label: 'Lớp / Khóa Học', width: '160px' },
        { letter: 'D', key: 'attendance', label: 'Chuyên Cần', width: '100px', align: 'center' },
        { letter: 'E', key: 'test_score', label: 'Điểm Test', width: '90px', align: 'center' },
        { letter: 'F', key: 'tuition_fee', label: 'Học Phí Khóa (₫)', width: '120px', align: 'right' },
        { letter: 'G', key: 'paid_vnd', label: 'Đã Thu (₫)', width: '120px', align: 'right' },
        { letter: 'H', key: 'tuition_status', label: 'Tình Trạng Phí', width: '120px', align: 'center', badgeStyle: true },
      ],
      rows: [
        {
          student_id: 'HV-101',
          student_name: 'Đỗ Nhật Nam',
          class_name: 'IELTS Master 7.5+',
          attendance: '12 / 12 Buổi',
          test_score: '8.0 Điểm',
          tuition_fee: '8,500,000',
          paid_vnd: '8,500,000',
          tuition_status: '✓ Hoàn tất 100%',
        },
        {
          student_id: 'HV-102',
          student_name: 'Nguyễn Thảo My',
          class_name: 'Frontend React & Next.js',
          attendance: '11 / 12 Buổi',
          test_score: '9.2 Điểm',
          tuition_fee: '9,000,000',
          paid_vnd: '9,000,000',
          tuition_status: '✓ Hoàn tất 100%',
        },
        {
          student_id: 'HV-103',
          student_name: 'Trần Gia Bảo',
          class_name: 'Tiếng Anh Giao Tiếp Pro',
          attendance: '10 / 12 Buổi',
          test_score: '7.8 Điểm',
          tuition_fee: '6,000,000',
          paid_vnd: '3,000,000',
          tuition_status: '⚠️ Còn nợ 3,000,000 ₫',
        },
        {
          student_id: 'HV-104',
          student_name: 'Lê Phương Linh',
          class_name: 'Tin Học & Google Sheets',
          attendance: '12 / 12 Buổi',
          test_score: '9.5 Điểm',
          tuition_fee: '4,500,000',
          paid_vnd: '4,500,000',
          tuition_status: '✓ Hoàn tất 100%',
        },
        {
          student_id: 'HV-105',
          student_name: 'Phạm Minh Khôi',
          class_name: 'Frontend React & Next.js',
          attendance: '12 / 12 Buổi',
          test_score: '8.8 Điểm',
          tuition_fee: '9,000,000',
          paid_vnd: '9,000,000',
          tuition_status: '✓ Hoàn tất 100%',
        },
        {
          student_id: 'HV-106',
          student_name: 'Vũ Đức Thành',
          class_name: 'IELTS Master 7.5+',
          attendance: '9 / 12 Buổi',
          test_score: '7.2 Điểm',
          tuition_fee: '8,500,000',
          paid_vnd: '4,500,000',
          tuition_status: '⚠️ Còn nợ 4,000,000 ₫',
        },
      ],
      formulaInfo: {
        cell: 'G2',
        formula: '=IF(F2=G2, "Hoàn tất", "Còn nợ " & TEXT(F2-G2, "#,##0 ₫"))',
        explanation: 'Kiểm tra trạng thái đóng học phí và tính toán số tiền còn nợ tự động.',
      },
      searchPlaceholder: '🔍 Tìm mã học viên, tên học viên, lớp học...',
      sampleFormFields: [
        { key: 'student_id', label: 'Mã HV', type: 'text', defaultValue: 'HV-107' },
        { key: 'student_name', label: 'Họ tên học viên', type: 'text', defaultValue: 'Bùi Tuấn Anh' },
        { key: 'class_name', label: 'Lớp học', type: 'text', defaultValue: 'IELTS Master 7.5+' },
        { key: 'tuition_fee', label: 'Học phí (₫)', type: 'number', defaultValue: '8500000' },
        { key: 'paid_vnd', label: 'Đã đóng (₫)', type: 'number', defaultValue: '8500000' },
      ],
      quickActions: ['+ Đăng ký học viên mới', '✅ Điểm danh buổi học', '💳 Thu học phí & Xuất biên lai', '📊 Báo cáo kết quả kiểm tra'],
    };
  }

  // 5. NHÓM SPA / PHÒNG KHÁM / THẨM MỸ
  if (title.includes('spa') || title.includes('phòng khám') || title.includes('thẩm mỹ') || title.includes('bệnh nhân')) {
    return {
      domain: 'spa_clinic',
      domainTitle: 'Hệ Thống Quản Lý Spa, Thẩm Mỹ Viện & Phòng Khám',
      versionBadge: version,
      appIcon: '💆',
      kpis: [
        { label: 'Lịch hẹn hôm nay', value: '26 Khách', subtext: '21 khách đã hoàn thành', color: '#0284c7', icon: '📅' },
        { label: 'Doanh thu dịch vụ', value: '18,850,000 ₫', subtext: 'Gồm thẻ liệu trình & mỹ phẩm', color: '#059669', icon: '💰' },
        { label: 'Kỹ thuật viên / Bác sĩ', value: '8 Chuyên viên', subtext: '100% đang trong ca làm', color: '#d97706', icon: '👩‍⚕️' },
        { label: 'Đánh giá 5 sao', value: '98.5%', subtext: 'Khảo sát sau trị liệu', color: '#7c3aed', icon: '⭐' },
      ],
      columns: [
        { letter: 'A', key: 'booking_id', label: 'Mã Lịch', width: '80px', align: 'center' },
        { letter: 'B', key: 'customer_name', label: 'Khách Hàng & SĐT', width: '180px' },
        { letter: 'C', key: 'service_name', label: 'Liệu Trình Trị Liệu', width: '220px' },
        { letter: 'D', key: 'therapist', label: 'KTV / Bác Sĩ', width: '130px' },
        { letter: 'E', key: 'booking_time', label: 'Giờ Hẹn', width: '110px', align: 'center' },
        { letter: 'F', key: 'price_vnd', label: 'Chi Phí (₫)', width: '120px', align: 'right' },
        { letter: 'G', key: 'status', label: 'Trạng Thái', width: '130px', align: 'center', badgeStyle: true },
      ],
      rows: [
        {
          booking_id: 'SPA-01',
          customer_name: 'Chị Lê Phương Mai (0983.112.233)',
          service_name: 'Cấy Tinh Chất Trẻ Hóa Da Cá Hồi',
          therapist: 'Bác sĩ Mai Anh',
          booking_time: '09:00 - 10:30',
          price_vnd: '2,500,000',
          status: '✓ Đã hoàn thành',
        },
        {
          booking_id: 'SPA-02',
          customer_name: 'Chị Trần Thu Thảo (0904.556.789)',
          service_name: 'Gội Đầu Dưỡng Sinh & Trị Liệu Cổ Vai Gáy',
          therapist: 'KTV Yến Nhi',
          booking_time: '10:30 - 11:45',
          price_vnd: '450,000',
          status: '✓ Đã hoàn thành',
        },
        {
          booking_id: 'SPA-03',
          customer_name: 'Anh Vũ Đức Thắng (0912.889.900)',
          service_name: 'Trị Mụn Chuẩn Y Khoa Laser CO2',
          therapist: 'Bác sĩ Tuấn Hưng',
          booking_time: '13:30 - 15:00',
          price_vnd: '1,800,000',
          status: '⚡ Đang thực hiện',
        },
        {
          booking_id: 'SPA-04',
          customer_name: 'Chị Nguyễn Bảo Ngọc (0978.334.455)',
          service_name: 'Chăm Sóc Da Chuyên Sâu Aqua Peel',
          therapist: 'KTV Kim Ngân',
          booking_time: '15:15 - 16:30',
          price_vnd: '850,000',
          status: '⏳ Chờ tiếp đón',
        },
        {
          booking_id: 'SPA-05',
          customer_name: 'Chị Đoàn Thị Hạnh (0936.778.899)',
          service_name: 'Massage Body Đá Nóng Thư Giãn',
          therapist: 'KTV Hồng Thắm',
          booking_time: '16:45 - 18:00',
          price_vnd: '650,000',
          status: '⏳ Chờ tiếp đón',
        },
      ],
      formulaInfo: {
        cell: 'F2',
        formula: '=SUM(F2:F6)',
        explanation: 'Tổng doanh thu dịch vụ theo ca làm việc trong ngày.',
      },
      searchPlaceholder: '🔍 Tìm tên khách hàng, số điện thoại, kỹ thuật viên...',
      sampleFormFields: [
        { key: 'booking_id', label: 'Mã lịch', type: 'text', defaultValue: 'SPA-06' },
        { key: 'customer_name', label: 'Khách hàng & SĐT', type: 'text', defaultValue: 'Chị Hoàng Thùy Linh (0902.111.222)' },
        { key: 'service_name', label: 'Dịch vụ liệu trình', type: 'text', defaultValue: 'Chăm sóc da chuyên sâu Aqua Peel' },
        { key: 'therapist', label: 'Kỹ thuật viên', type: 'text', defaultValue: 'KTV Yến Nhi' },
        { key: 'price_vnd', label: 'Chi phí (₫)', type: 'number', defaultValue: '850000' },
      ],
      quickActions: ['+ Đặt lịch hẹn mới', '💆 Bàn giao chuyên viên', '💳 Thanh toán hóa đơn', '🧴 Xuất kho mỹ phẩm'],
    };
  }

  // 6. NHÓM TÀI CHÍNH CÁ NHÂN / 6 HŨ
  if (title.includes('tài chính cá nhân') || title.includes('6 hũ') || title.includes('chi tiêu')) {
    return {
      domain: 'personal_finance',
      domainTitle: 'Hệ Thống Quản Lý Tài Chính Cá Nhân & Quy Tắc 6 Chiếc Hũ',
      versionBadge: version,
      appIcon: '🏺',
      kpis: [
        { label: 'Tổng thu nhập tháng', value: '45,000,000 ₫', subtext: 'Lương & thu nhập thụ động', color: '#059669', icon: '💵' },
        { label: 'Đã chi tiêu trong tháng', value: '26,450,000 ₫', subtext: '58.7% hạn mức ngân sách', color: '#0284c7', icon: '📉' },
        { label: 'Quỹ tự do tài chính (FFA)', value: '85,200,000 ₫', subtext: 'Tích lũy cổ phiếu & chứng chỉ quỹ', color: '#d97706', icon: '📈' },
        { label: 'Tiết kiệm khẩn cấp (LTSS)', value: '120,000,000 ₫', subtext: 'Đủ 6 tháng chi phí sinh hoạt', color: '#7c3aed', icon: '🛡️' },
      ],
      columns: [
        { letter: 'A', key: 'date', label: 'Ngày', width: '90px', align: 'center' },
        { letter: 'B', key: 'item_name', label: 'Khoản Mục Chi Tiêu / Thu Vào', width: '220px' },
        { letter: 'C', key: 'jar_name', label: 'Hũ Tài Chính', width: '180px' },
        { letter: 'D', key: 'amount_vnd', label: 'Số Tiền (₫)', width: '130px', align: 'right' },
        { letter: 'E', key: 'payment_method', label: 'Phương Thức', width: '120px', align: 'center' },
        { letter: 'F', key: 'remaining_jar', label: 'Số Dư Hũ (₫)', width: '130px', align: 'right' },
      ],
      rows: [
        {
          date: '01/08/2026',
          item_name: 'Thu nhập lương công ty',
          jar_name: '💰 Phân bổ tự động 6 hũ',
          amount_vnd: '+45,000,000',
          payment_method: 'Chuyển khoản VCB',
          remaining_jar: '45,000,000',
        },
        {
          date: '02/08/2026',
          item_name: 'Tiền thuê căn hộ & phí dịch vụ',
          jar_name: '🏠 NEC - Nhu cầu thiết yếu (55%)',
          amount_vnd: '-8,500,000',
          payment_method: 'Chuyển khoản MB',
          remaining_jar: '16,250,000',
        },
        {
          date: '03/08/2026',
          item_name: 'Mua chứng chỉ quỹ ETF VN30',
          jar_name: '📈 FFA - Tự do tài chính (10%)',
          amount_vnd: '-4,500,000',
          payment_method: 'App Chứng khoán',
          remaining_jar: '0',
        },
        {
          date: '04/08/2026',
          item_name: 'Khóa học Prompt Engineering & AI',
          jar_name: '📚 EDU - Phát triển bản thân (10%)',
          amount_vnd: '-3,200,000',
          payment_method: 'Thẻ tín dụng',
          remaining_jar: '1,300,000',
        },
        {
          date: '05/08/2026',
          item_name: 'Bữa tối BBQ mừng hoàn thành dự án',
          jar_name: '🎉 PLAY - Hưởng thụ (10%)',
          amount_vnd: '-1,450,000',
          payment_method: 'VietQR',
          remaining_jar: '3,050,000',
        },
        {
          date: '06/08/2026',
          item_name: 'Đóng góp quỹ cơm từ thiện viện K',
          jar_name: '❤️ GIVE - Cho đi & giúp đỡ (5%)',
          amount_vnd: '-1,000,000',
          payment_method: 'Chuyển khoản',
          remaining_jar: '1,250,000',
        },
      ],
      formulaInfo: {
        cell: 'D2',
        formula: '=SUMIFS(D:D, C:C, "*NEC*")',
        explanation: 'Tổng chi tiêu theo từng hũ tài chính tự động cân đối tỷ lệ phần trăm.',
      },
      searchPlaceholder: '🔍 Tìm khoản chi tiêu, tên hũ (NEC, FFA, EDU, PLAY...)...',
      sampleFormFields: [
        { key: 'item_name', label: 'Khoản chi tiêu / Thu nhập', type: 'text', defaultValue: 'Mua sách phát triển kỹ năng' },
        { key: 'jar_name', label: 'Hũ tài chính', type: 'select', defaultValue: 'EDU - Phát triển bản thân (10%)', options: ['NEC - Thiết yếu (55%)', 'FFA - Tự do TC (10%)', 'LTSS - Tiết kiệm (10%)', 'EDU - Học vấn (10%)', 'PLAY - Hưởng thụ (10%)', 'GIVE - Cho đi (5%)'] },
        { key: 'amount_vnd', label: 'Số tiền (₫)', type: 'number', defaultValue: '350000' },
        { key: 'payment_method', label: 'Phương thức', type: 'text', defaultValue: 'Chuyển khoản' },
      ],
      quickActions: ['+ Ghi chép chi tiêu', '📥 Nhập thu nhập mới', '📊 Phân tích cơ cấu 6 hũ', '🎯 Đặt mục tiêu tiết kiệm'],
    };
  }

  // 7. NHÓM BẤT ĐỘNG SẢN / ĐỊA ỐC
  if (title.includes('bất động sản') || title.includes('nhà đất') || title.includes('căn hộ')) {
    return {
      domain: 'real_estate',
      domainTitle: 'Hệ Thống Quản Lý Giỏ Hàng Bất Động Sản & Hoa Hồng Môi Giới',
      versionBadge: version,
      appIcon: '🏢',
      kpis: [
        { label: 'Tổng giá trị giỏ hàng', value: '42.8 Tỷ ₫', subtext: '16 BĐS đang mở bán', color: '#0284c7', icon: '🏘️' },
        { label: 'Giao dịch chốt cọc', value: '4 Căn', subtext: 'Tháng 08/2026', color: '#059669', icon: '🤝' },
        { label: 'Hoa hồng dự kiến', value: '642,000,000 ₫', subtext: 'Trung bình 1.5% - 2.0%', color: '#d97706', icon: '💰' },
        { label: 'Lượt khách xem nhà', value: '32 Lượt', subtext: 'Hẹn trong tuần này', color: '#7c3aed', icon: '🚗' },
      ],
      columns: [
        { letter: 'A', key: 'prop_id', label: 'Mã Căn', width: '90px', align: 'center' },
        { letter: 'B', key: 'prop_name', label: 'Loại Hình & Tên BĐS', width: '220px' },
        { letter: 'C', key: 'location', label: 'Vị Trí / Dự Án', width: '180px' },
        { letter: 'D', key: 'area_m2', label: 'Diện Tích', width: '90px', align: 'center' },
        { letter: 'E', key: 'price_vnd', label: 'Giá Bán (₫)', width: '130px', align: 'right' },
        { letter: 'F', key: 'agent', label: 'Môi Giới', width: '130px' },
        { letter: 'G', key: 'status', label: 'Tình Trạng', width: '130px', align: 'center', badgeStyle: true },
      ],
      rows: [
        {
          prop_id: 'BĐS-01',
          prop_name: 'Căn hộ 2PN2WC Masteri Centre',
          location: 'Vinhomes Grand Park, Q9',
          area_m2: '68 m²',
          price_vnd: '3,850,000,000',
          agent: 'Nguyễn Văn Tuấn',
          status: '🟢 Đang mở bán',
        },
        {
          prop_id: 'BĐS-02',
          prop_name: 'Shophouse Chân Đế 2 Tầng',
          location: 'Aqua City, Đồng Nai',
          area_m2: '120 m²',
          price_vnd: '7,200,000,000',
          agent: 'Trần Thu Hà',
          status: '🤝 Đã cọc thiện chí',
        },
        {
          prop_id: 'BĐS-03',
          prop_name: 'Biệt Thự Đơn Lập View Hồ',
          location: 'Ecopark Hưng Yên',
          area_m2: '240 m²',
          price_vnd: '16,500,000,000',
          agent: 'Lê Hoàng Nam',
          status: '🟢 Đang mở bán',
        },
        {
          prop_id: 'BĐS-04',
          prop_name: 'Đất Nền Sổ Đỏ Ven Biển',
          location: 'Khu đô thị Điện Nam, Đà Nẵng',
          area_m2: '100 m²',
          price_vnd: '2,150,000,000',
          agent: 'Phạm Văn Đức',
          status: '✓ Đã công chứng',
        },
        {
          prop_id: 'BĐS-05',
          prop_name: 'Căn Hộ Studio Cao Cấp',
          location: 'Vinhomes Smart City, Nam Từ Liêm',
          area_m2: '32 m²',
          price_vnd: '1,750,000,000',
          agent: 'Hoàng Kim Yến',
          status: '🟢 Đang mở bán',
        },
      ],
      formulaInfo: {
        cell: 'E2',
        formula: '=SUM(E2:E6)',
        explanation: 'Tổng giá trị giỏ hàng bất động sản đang phân phối.',
      },
      searchPlaceholder: '🔍 Tìm mã căn, tên dự án, vị trí, môi giới phụ trách...',
      sampleFormFields: [
        { key: 'prop_id', label: 'Mã căn', type: 'text', defaultValue: 'BĐS-06' },
        { key: 'prop_name', label: 'Loại hình BĐS', type: 'text', defaultValue: 'Căn hộ 3PN2WC Sky Oasis' },
        { key: 'location', label: 'Dự án / Vị trí', type: 'text', defaultValue: 'Ecopark Hưng Yên' },
        { key: 'price_vnd', label: 'Giá bán (₫)', type: 'number', defaultValue: '4500000000' },
        { key: 'agent', label: 'Môi giới phụ trách', type: 'text', defaultValue: 'Nguyễn Văn Tuấn' },
      ],
      quickActions: ['+ Thêm BĐS vào giỏ hàng', '🤝 Khởi tạo giao dịch cọc', '📅 Lên lịch dẫn khách xem', '🖨️ Xuất tờ rơi chào bán'],
    };
  }

  // 8. NHÓM TIỆN ÍCH FORM / KHẢO SÁT / PHÂN QUYỀN
  if (title.includes('tạo form') || title.includes('khảo sát') || title.includes('phân quyền') || title.includes('biểu mẫu')) {
    return {
      domain: 'form_survey',
      domainTitle: 'Hệ Thống Tạo Form Khảo Sát & Phân Quyền Dữ Liệu Tinh Gọn',
      versionBadge: version,
      appIcon: '📋',
      kpis: [
        { label: 'Tổng phản hồi tiếp nhận', value: '1,428 Lượt', subtext: 'Đồng bộ Google Sheets tức thì', color: '#0284c7', icon: '📥' },
        { label: 'Form đang kích hoạt', value: '6 Biểu mẫu', subtext: 'Không giới hạn lượt nộp', color: '#059669', icon: '🟢' },
        { label: 'Tỷ lệ hoàn thành Form', value: '94.2%', subtext: 'Tối ưu UI trên điện thoại', color: '#d97706', icon: '📱' },
        { label: 'Cấp độ phân quyền', value: '3 Cấp độ', subtext: 'Admin, Biên tập, Người xem', color: '#7c3aed', icon: '🔒' },
      ],
      columns: [
        { letter: 'A', key: 'form_id', label: 'Mã Form', width: '90px', align: 'center' },
        { letter: 'B', key: 'form_title', label: 'Tên Biểu Mẫu Khảo Sát', width: '250px' },
        { letter: 'C', key: 'questions_count', label: 'Số Câu Hỏi', width: '100px', align: 'center' },
        { letter: 'D', key: 'submissions', label: 'Phản Hồi', width: '100px', align: 'center' },
        { letter: 'E', key: 'access_role', label: 'Phân Quyền', width: '140px', align: 'center' },
        { letter: 'F', key: 'last_active', label: 'Gửi Gần Nhất', width: '120px', align: 'center' },
        { letter: 'G', key: 'status', label: 'Trạng Thái', width: '120px', align: 'center', badgeStyle: true },
      ],
      rows: [
        {
          form_id: 'FRM-01',
          form_title: 'Khảo sát mức độ hài lòng khách hàng NPS',
          questions_count: '6 Câu',
          submissions: '542',
          access_role: '🌐 Công khai',
          last_active: '5 phút trước',
          status: '🟢 Đang nhận tin',
        },
        {
          form_id: 'FRM-02',
          form_title: 'Phiếu đăng ký hội thảo Chuyển đổi số AI',
          questions_count: '8 Câu',
          submissions: '388',
          access_role: '🌐 Công khai',
          last_active: '12 phút trước',
          status: '🟢 Đang nhận tin',
        },
        {
          form_id: 'FRM-03',
          form_title: 'Yêu cầu cấp phát thiết bị & tài sản nội bộ',
          questions_count: '5 Câu',
          submissions: '124',
          access_role: '🔒 Nội bộ công ty',
          last_active: '1 giờ trước',
          status: '🟢 Đang nhận tin',
        },
        {
          form_id: 'FRM-04',
          form_title: 'Đánh giá hiệu suất nhân viên 360 độ Q2',
          questions_count: '15 Câu',
          submissions: '215',
          access_role: '🔒 Cấp quản lý',
          last_active: 'Hôm qua',
          status: '⏸️ Đã đóng cổng',
        },
        {
          form_id: 'FRM-05',
          form_title: 'Đăng ký nhận tài liệu Google Sheets Automation',
          questions_count: '4 Câu',
          submissions: '159',
          access_role: '🌐 Công khai',
          last_active: '2 giờ trước',
          status: '🟢 Đang nhận tin',
        },
      ],
      formulaInfo: {
        cell: 'D2',
        formula: '=COUNTA(PHANHOI_RAW!A2:A)',
        explanation: 'Tự động đếm số lượng phản hồi gửi về Google Sheets theo thời gian thực.',
      },
      searchPlaceholder: '🔍 Tìm mã form, tên khảo sát, quyền truy cập...',
      sampleFormFields: [
        { key: 'form_id', label: 'Mã biểu mẫu', type: 'text', defaultValue: 'FRM-06' },
        { key: 'form_title', label: 'Tên form khảo sát', type: 'text', defaultValue: 'Thu thập thông tin đối tác cung ứng' },
        { key: 'questions_count', label: 'Số câu hỏi', type: 'number', defaultValue: '7' },
        { key: 'access_role', label: 'Phân quyền', type: 'text', defaultValue: 'Nội bộ công ty' },
      ],
      quickActions: ['+ Thiết kế Form mới', '🔗 Sao chép liên kết chia sẻ', '📊 Xem biểu đồ kết quả', '⚙️ Thiết lập phân quyền'],
    };
  }

  // 9. NHÓM TIỆN ÍCH HÀM / TỰ ĐỘNG HÓA DRIVE / IMPORT DATA / CÔNG THỨC
  if (title.includes('import data') || title.includes('bản sao drive') || title.includes('dropdown') || title.includes('pdf') || title.includes('nén ảnh') || title.includes('tiện ích')) {
    return {
      domain: 'automation_utility',
      domainTitle: 'Hệ Thống Tự Động Hóa Google Workspace & Tiện Ích Hàm',
      versionBadge: version,
      appIcon: '⚡',
      kpis: [
        { label: 'Tác vụ tự động đã chạy', value: '4,890 Lệnh', subtext: 'Chạy liên tục không treo file', color: '#059669', icon: '🚀' },
        { label: 'Tốc độ xử lý trung bình', value: '0.42 Giây', subtext: 'Tối ưu công thức mảng ArrayFormula', color: '#0284c7', icon: '⚡' },
        { label: 'Tệp liên kết thành công', value: '18 File Sheets', subtext: 'Dữ liệu đồng bộ 2 chiều', color: '#d97706', icon: '📂' },
        { label: 'Tiết kiệm thời gian/ngày', value: '3.5 Giờ', subtext: 'Thay thế thao tác copy-paste thủ công', color: '#7c3aed', icon: '⏱️' },
      ],
      columns: [
        { letter: 'A', key: 'task_id', label: 'STT', width: '70px', align: 'center' },
        { letter: 'B', key: 'input_source', label: 'Dữ Liệu Đầu Vào (Input)', width: '220px' },
        { letter: 'C', key: 'formula_logic', label: 'Hàm / Công Thức Xử Lý', width: '220px' },
        { letter: 'D', key: 'output_result', label: 'Kết Quả Trả Về (Output)', width: '200px' },
        { letter: 'E', key: 'exec_speed', label: 'Tốc Độ', width: '90px', align: 'center' },
        { letter: 'F', key: 'status', label: 'Trạng Thái', width: '120px', align: 'center', badgeStyle: true },
      ],
      rows: [
        {
          task_id: '1',
          input_source: 'Liên kết 12 file Chi nhánh Tỉnh',
          formula_logic: '=IMPORTRANGE(FileID, "BaoCao!A:H")',
          output_result: '1,250 Dòng dữ liệu chuẩn hóa',
          exec_speed: '0.6s',
          status: '✓ Đồng bộ thành công',
        },
        {
          task_id: '2',
          input_source: 'Trích xuất top 10 sản phẩm bán chạy',
          formula_logic: '=QUERY(DATA!A:H, "SELECT B, SUM(E) GROUP BY B LIMIT 10")',
          output_result: 'Bảng Top 10 kèm tổng doanh thu',
          exec_speed: '0.2s',
          status: '✓ Tính toán tức thì',
        },
        {
          task_id: '3',
          input_source: 'Dropdown chọn Tỉnh ➔ hiện Quận/Huyện',
          formula_logic: '=FILTER(DM_HUYEN!B:B, DM_HUYEN!A:A = A2)',
          output_result: 'Danh sách lọc 2 cấp chuẩn xác',
          exec_speed: '0.1s',
          status: '✓ Không lỗi #N/A',
        },
        {
          task_id: '4',
          input_source: 'Xuất vùng chọn báo cáo sang PDF/Ảnh',
          formula_logic: 'Google Apps Script Auto-Export PDF',
          output_result: 'Tệp PDF đính kèm email tự động',
          exec_speed: '1.2s',
          status: '✓ Đã gửi đến Drive',
        },
        {
          task_id: '5',
          input_source: 'Tự động sao chép cây Folder Drive mẫu',
          formula_logic: 'Batch Copy Drive API v3',
          output_result: 'Nhân bản 25 thư mục phân quyền',
          exec_speed: '1.8s',
          status: '✓ Hoàn tất phân quyền',
        },
      ],
      formulaInfo: {
        cell: 'C2',
        formula: '=ARRAYFORMULA(XLOOKUP(A2:A, DANHMUC!A:A, DANHMUC!C:C, ""))',
        explanation: 'Xử lý hàng loạt hàng nghìn dòng bằng một công thức mảng duy nhất tại ô đầu tiên.',
      },
      searchPlaceholder: '🔍 Tìm tên hàm (IMPORTRANGE, QUERY, XLOOKUP), tác vụ xử lý...',
      sampleFormFields: [
        { key: 'input_source', label: 'Nguồn dữ liệu đầu vào', type: 'text', defaultValue: 'Bảng kê bán lẻ từ Web App' },
        { key: 'formula_logic', label: 'Công thức áp dụng', type: 'text', defaultValue: '=QUERY(RAW!A:E, "SELECT A, SUM(D)")' },
        { key: 'output_result', label: 'Kết quả kỳ vọng', type: 'text', defaultValue: 'Báo cáo tổng hợp doanh thu' },
      ],
      quickActions: ['⚡ Chạy đồng bộ dữ liệu ngay', '📄 Xuất báo cáo PDF tự động', '🔗 Kiểm tra liên kết Drive', '🧪 Thử nghiệm công thức'],
    };
  }

  // 10. NHÓM QUẢN LÝ KHO / NHẬP XUẤT TỒN
  if (title.includes('kho') || title.includes('nhập xuất tồn') || title.includes('tồn kho')) {
    return {
      domain: 'inventory_stock',
      domainTitle: 'Hệ Thống Quản Lý Nhập Xuất Tồn Kho Đa Điểm',
      versionBadge: version,
      appIcon: '📦',
      kpis: [
        { label: 'Tổng giá trị hàng tồn', value: '485,200,000 ₫', subtext: 'Kiểm kê tại 3 kho trung tâm', color: '#059669', icon: '💰' },
        { label: 'Tổng số mã SKU', value: '142 Mặt hàng', subtext: '100% có mã vạch barcode', color: '#0284c7', icon: '🏷️' },
        { label: 'Cảnh báo sắp hết hàng', value: '3 Mặt hàng', subtext: 'Chạm ngưỡng tối thiểu Min', color: '#dc2626', icon: '⚠️' },
        { label: 'Lệnh nhập xuất hôm nay', value: '14 Phiếu', subtext: '8 phiếu xuất, 6 phiếu nhập', color: '#d97706', icon: '📑' },
      ],
      columns: [
        { letter: 'A', key: 'sku', label: 'Mã SKU', width: '100px', align: 'center' },
        { letter: 'B', key: 'product_name', label: 'Tên Sản Phẩm / Hàng Hóa', width: '220px' },
        { letter: 'C', key: 'unit', label: 'ĐVT', width: '70px', align: 'center' },
        { letter: 'D', key: 'opening_stock', label: 'Tồn Đầu', width: '80px', align: 'center' },
        { letter: 'E', key: 'import_qty', label: 'Nhập', width: '80px', align: 'center' },
        { letter: 'F', key: 'export_qty', label: 'Xuất', width: '80px', align: 'center' },
        { letter: 'G', key: 'closing_stock', label: 'Tồn Cuối', width: '90px', align: 'center' },
        { letter: 'H', key: 'status_alert', label: 'Tình Trạng Tồn', width: '130px', align: 'center', badgeStyle: true },
      ],
      rows: [
        { sku: 'SKU-IP15-PM', product_name: 'iPhone 15 Pro Max 256GB Natural', unit: 'Chiếc', opening_stock: '40', import_qty: '25', export_qty: '30', closing_stock: '35', status_alert: '✓ Định mức an toàn' },
        { sku: 'SKU-MAC-M3P', product_name: 'MacBook Pro 14 M3 Pro 18GB/512GB', unit: 'Chiếc', opening_stock: '15', import_qty: '10', export_qty: '8', closing_stock: '17', status_alert: '✓ Định mức an toàn' },
        { sku: 'SKU-AP-PRO2', product_name: 'Tai nghe AirPods Pro 2 USB-C', unit: 'Chiếc', opening_stock: '8', import_qty: '50', export_qty: '46', closing_stock: '12', status_alert: '⚠️ Cảnh báo tồn thấp' },
        { sku: 'SKU-DELL-U27', product_name: 'Màn hình Dell UltraSharp 27 4K U2723QE', unit: 'Chiếc', opening_stock: '20', import_qty: '15', export_qty: '12', closing_stock: '23', status_alert: '✓ Định mức an toàn' },
        { sku: 'SKU-KEY-MXM', product_name: 'Bàn phím cơ không dây Logitech MX Mechanical', unit: 'Chiếc', opening_stock: '35', import_qty: '20', export_qty: '22', closing_stock: '33', status_alert: '✓ Định mức an toàn' },
        { sku: 'SKU-MOU-MX3S', product_name: 'Chuột không dây Logitech MX Master 3S', unit: 'Chiếc', opening_stock: '5', import_qty: '30', export_qty: '28', closing_stock: '7', status_alert: '⚠️ Cảnh báo tồn thấp' },
      ],
      formulaInfo: {
        cell: 'G2',
        formula: '=D2 + E2 - F2',
        explanation: 'Tồn kho cuối kỳ = Tồn đầu kỳ + Tổng số lượng nhập - Tổng số lượng xuất.',
      },
      searchPlaceholder: '🔍 Tìm mã SKU, tên sản phẩm, tình trạng kho...',
      sampleFormFields: [
        { key: 'sku', label: 'Mã SKU', type: 'text', defaultValue: 'SKU-PAD-M2' },
        { key: 'product_name', label: 'Tên sản phẩm', type: 'text', defaultValue: 'iPad Air 11 M2 128GB' },
        { key: 'unit', label: 'Đơn vị tính', type: 'text', defaultValue: 'Chiếc' },
        { key: 'import_qty', label: 'Số lượng nhập', type: 'number', defaultValue: '10' },
      ],
      quickActions: ['+ Tạo phiếu nhập kho', '- Tạo phiếu xuất kho', '🔄 Điều chuyển nội bộ', '📊 Xuất biên bản kiểm kê'],
    };
  }

  // 11. NHÓM F&B / NHÀ HÀNG / CAFE / POS
  if (title.includes('nhà hàng') || title.includes('cafe') || title.includes('quán ăn') || title.includes('f&b') || title.includes('pos')) {
    return {
      domain: 'restaurant_pos',
      domainTitle: 'Hệ Thống Bán Hàng F&B POS, Quản Lý Bàn & Menu',
      versionBadge: version,
      appIcon: '☕',
      kpis: [
        { label: 'Doanh thu ca sáng', value: '4,850,000 ₫', subtext: '38 Lượt hóa đơn', color: '#059669', icon: '💵' },
        { label: 'Bàn đang phục vụ', value: '8 / 12 Bàn', subtext: 'Công suất phục vụ 66.7%', color: '#0284c7', icon: '🪑' },
        { label: 'Món bán chạy nhất', value: 'Cà phê Muối', subtext: '42 ly đã bán trong ca', color: '#d97706', icon: '☕' },
        { label: 'Thanh toán VietQR', value: '82%', subtext: 'Quét mã tự động khớp tiền', color: '#7c3aed', icon: '📲' },
      ],
      columns: [
        { letter: 'A', key: 'order_id', label: 'Mã Đơn', width: '90px', align: 'center' },
        { letter: 'B', key: 'table_no', label: 'Bàn / Khu Vực', width: '120px' },
        { letter: 'C', key: 'item_name', label: 'Món Ăn / Thức Uống', width: '200px' },
        { letter: 'D', key: 'qty', label: 'SL', width: '60px', align: 'center' },
        { letter: 'E', key: 'unit_price', label: 'Đơn Giá (₫)', width: '110px', align: 'right' },
        { letter: 'F', key: 'total_price', label: 'Thành Tiền (₫)', width: '120px', align: 'right' },
        { letter: 'G', key: 'pay_method', label: 'Hình Thức', width: '110px', align: 'center' },
        { letter: 'H', key: 'status', label: 'Trạng Thái', width: '120px', align: 'center', badgeStyle: true },
      ],
      rows: [
        { order_id: 'ORD-101', table_no: 'Bàn 01 (Tầng 1)', item_name: 'Cà phê Muối Kem Béo', qty: '2', unit_price: '45,000', total_price: '90,000', pay_method: 'VietQR MB', status: '✓ Đã thanh toán' },
        { order_id: 'ORD-102', table_no: 'Bàn 03 (Tầng 1)', item_name: 'Trà Đào Cam Sả Tươi', qty: '3', unit_price: '55,000', total_price: '165,000', pay_method: 'VietQR MB', status: '✓ Đã thanh toán' },
        { order_id: 'ORD-103', table_no: 'Bàn VIP 01 (T2)', item_name: 'Set Bò Tảng Nướng Tiêu', qty: '1', unit_price: '285,000', total_price: '285,000', pay_method: 'Chờ thanh toán', status: '⚡ Đang phục vụ' },
        { order_id: 'ORD-104', table_no: 'Bàn 06 (Sân vườn)', item_name: 'Bia Craft IPA Thủ Công', qty: '4', unit_price: '75,000', total_price: '300,000', pay_method: 'Chờ thanh toán', status: '⚡ Đang phục vụ' },
        { order_id: 'ORD-105', table_no: 'Mang về (Takeaway)', item_name: 'Bánh Croissant Bơ Pháp', qty: '2', unit_price: '35,000', total_price: '70,000', pay_method: 'Tiền mặt', status: '✓ Đã thanh toán' },
      ],
      formulaInfo: {
        cell: 'F2',
        formula: '=D2 * E2',
        explanation: 'Thành tiền món = Số lượng * Đơn giá niêm yết trong menu.',
      },
      searchPlaceholder: '🔍 Tìm số bàn, mã order, tên món...',
      sampleFormFields: [
        { key: 'table_no', label: 'Số bàn', type: 'text', defaultValue: 'Bàn 05' },
        { key: 'item_name', label: 'Tên món', type: 'text', defaultValue: 'Bạc Xỉu Sữa Tươi Nóng' },
        { key: 'qty', label: 'Số lượng', type: 'number', defaultValue: '2' },
        { key: 'unit_price', label: 'Đơn giá (₫)', type: 'number', defaultValue: '45000' },
      ],
      quickActions: ['+ Mở bàn / Thêm order', '🧾 In tạm tính hóa đơn', '📲 Tạo mã VietQR bàn', '✅ Chốt ca & Bàn giao'],
    };
  }

  // 12. NHÓM CRM / KHÁCH HÀNG / BÁN HÀNG / BÁO GIÁ
  if (title.includes('khách hàng') || title.includes('crm') || title.includes('bán hàng') || title.includes('báo giá')) {
    return {
      domain: 'crm_sales',
      domainTitle: 'Hệ Thống CRM & Quản Lý Phễu Bán Hàng Chuyên Sâu',
      versionBadge: version,
      appIcon: '🎯',
      kpis: [
        { label: 'Tổng giá trị Deal trong phễu', value: '1,450,000,000 ₫', subtext: '18 Cơ hội kinh doanh', color: '#0284c7', icon: '💼' },
        { label: 'Doanh thu chốt thành công', value: '420,000,000 ₫', subtext: 'Đạt 105% chỉ tiêu tháng', color: '#059669', icon: '🏆' },
        { label: 'Tỷ lệ chuyển đổi phễu', value: '38.5%', subtext: 'Từ Lead sang Hợp đồng', color: '#d97706', icon: '📈' },
        { label: 'Lịch hẹn chăm sóc hôm nay', value: '5 Khách', subtext: 'Gọi điện & Demo sản phẩm', color: '#7c3aed', icon: '📞' },
      ],
      columns: [
        { letter: 'A', key: 'deal_id', label: 'Mã Deal', width: '90px', align: 'center' },
        { letter: 'B', key: 'company_name', label: 'Doanh Nghiệp / Khách Hàng', width: '220px' },
        { letter: 'C', key: 'contact_person', label: 'Người Đại Diện & SĐT', width: '180px' },
        { letter: 'D', key: 'deal_value', label: 'Giá Trị Dự Kiến (₫)', width: '140px', align: 'right' },
        { letter: 'E', key: 'stage', label: 'Giai Đoạn Phễu', width: '140px', align: 'center' },
        { letter: 'F', key: 'probability', label: 'Xác Suất', width: '90px', align: 'center' },
        { letter: 'G', key: 'owner', label: 'Phụ Trách', width: '120px' },
      ],
      rows: [
        { deal_id: 'DL-101', company_name: 'Tập đoàn BĐS Vinahome', contact_person: 'Lê Tuấn Vũ (0982.112.334)', deal_value: '250,000,000', stage: 'Đàm phán hợp đồng', probability: '80%', owner: 'Bùi Sales Lead' },
        { deal_id: 'DL-102', company_name: 'Chuỗi Thời Trang SunFashion', contact_person: 'Phạm Bích Ngọc (0904.556.778)', deal_value: '180,000,000', stage: 'Chốt hợp đồng', probability: '100%', owner: 'Trần Thu Hà' },
        { deal_id: 'DL-103', company_name: 'Logistics Toàn Cầu Apex', contact_person: 'Hoàng Đình Trọng (0912.889.900)', deal_value: '320,000,000', stage: 'Đề xuất giải pháp', probability: '60%', owner: 'Lê Hoàng Nam' },
        { deal_id: 'DL-104', company_name: 'Nhà Hàng Hương Biển Group', contact_person: 'Đỗ Mai Chi (0978.334.455)', deal_value: '95,000,000', stage: 'Đã gửi báo giá', probability: '50%', owner: 'Phạm Văn Đức' },
        { deal_id: 'DL-105', company_name: 'Dược Phẩm Tràng An', contact_person: 'Vũ Minh Tâm (0936.778.899)', deal_value: '210,000,000', stage: 'Chốt hợp đồng', probability: '100%', owner: 'Bùi Sales Lead' },
      ],
      formulaInfo: {
        cell: 'D2',
        formula: '=QUERY(DEALS!A:G, "SELECT SUM(D) WHERE E=\'Chốt hợp đồng\'")',
        explanation: 'Tổng doanh thu thực tế từ các hợp đồng đã chốt thành công trong tháng.',
      },
      searchPlaceholder: '🔍 Tìm tên công ty, người đại diện, số điện thoại...',
      sampleFormFields: [
        { key: 'deal_id', label: 'Mã Deal', type: 'text', defaultValue: 'DL-106' },
        { key: 'company_name', label: 'Tên doanh nghiệp', type: 'text', defaultValue: 'Cty TNHH Truyền Thông NextGen' },
        { key: 'contact_person', label: 'Người liên hệ', type: 'text', defaultValue: 'Trần Văn Nam (0913.555.666)' },
        { key: 'deal_value', label: 'Giá trị dự kiến (₫)', type: 'number', defaultValue: '120000000' },
      ],
      quickActions: ['+ Tạo Lead / Cơ hội mới', '📞 Lên lịch gọi chăm sóc', '📄 Xuất báo giá tự động', '🤝 Ký kết hợp đồng'],
    };
  }

  // 13. NHÓM THIẾT BỊ / MINI-ERP / CHO THUÊ
  if (title.includes('thiết bị') || title.includes('cho thuê') || title.includes('mini-erp') || title.includes('erp')) {
    return {
      domain: 'equipment_erp',
      domainTitle: 'Hệ Thống Quản Lý Mini-ERP & Cho Thuê Thiết Bị',
      versionBadge: version,
      appIcon: '⚙️',
      kpis: [
        { label: 'Thiết bị đang cho thuê', value: '18 Máy', subtext: 'Tổng kho quản lý 48 máy', color: '#0284c7', icon: '🎥' },
        { label: 'Tổng tiền cọc đang giữ', value: '145,500,000 ₫', subtext: 'Bảo lãnh tài sản hợp đồng', color: '#059669', icon: '🛡️' },
        { label: 'Doanh thu thuê tháng', value: '84,200,000 ₫', subtext: 'Tăng trưởng 22% so với tháng trước', color: '#d97706', icon: '📈' },
        { label: 'Hạn hoàn trả hôm nay', value: '3 Thiết bị', subtext: 'Ngày kiểm tra 03/08/2026', color: '#7c3aed', icon: '📅' },
      ],
      columns: [
        { letter: 'A', key: 'barcode', label: 'Barcode', width: '110px', align: 'center' },
        { letter: 'B', key: 'equip_name', label: 'Thiết Bị & Cấu Hình', width: '230px' },
        { letter: 'C', key: 'renter_name', label: 'Khách Thuê / Đơn Vị', width: '180px' },
        { letter: 'D', key: 'rate_per_day', label: 'Giá Thuê/Ngày (₫)', width: '130px', align: 'right' },
        { letter: 'E', key: 'deposit_vnd', label: 'Cọc Giữ (₫)', width: '130px', align: 'right' },
        { letter: 'F', key: 'rental_period', label: 'Thời Gian', width: '130px', align: 'center' },
        { letter: 'G', key: 'status', label: 'Trạng Thái', width: '120px', align: 'center', badgeStyle: true },
      ],
      rows: [
        { barcode: 'BC-CAM-802', equip_name: 'Sony FX3 Cinema Full-Frame + Rig Tilta', renter_name: 'Cty Truyền thông MediaPro', rate_per_day: '850,000', deposit_vnd: '15,000,000', rental_period: '03/08 - 06/08', status: '🔴 Đang cho thuê' },
        { barcode: 'BC-DRONE-01', equip_name: 'DJI Mavic 3 Cine Combo 3 Pin', renter_name: 'Studio Ánh Dương', rate_per_day: '1,200,000', deposit_vnd: '20,000,000', rental_period: '31/07 - 03/08', status: '✓ Đã thu hồi & hoàn cọc' },
        { barcode: 'BC-LENS-2470', equip_name: 'Sony FE 24-70mm f/2.8 GM II', renter_name: 'Kho Nội Bộ (Sẵn sàng)', rate_per_day: '450,000', deposit_vnd: '10,000,000', rental_period: 'Bảo dưỡng 03/08', status: '🟢 Sẵn sàng cho thuê' },
        { barcode: 'BC-LIGHT-300W', equip_name: 'Đèn Aputure Light Storm 300d II', renter_name: 'Cty Truyền thông MediaPro', rate_per_day: '350,000', deposit_vnd: '6,000,000', rental_period: '03/08 - 06/08', status: '🔴 Đang cho thuê' },
        { barcode: 'BC-AUDIO-SET', equip_name: 'Trọn gói Âm thanh Sân khấu Ngoài trời', renter_name: 'Cty Sự Kiện VinaEvent', rate_per_day: '4,500,000', deposit_vnd: '35,000,000', rental_period: '04/08 - 07/08', status: '🟢 Sẵn sàng bàn giao' },
      ],
      formulaInfo: {
        cell: 'E2',
        formula: '=D2 * DATEDIF(F2_START, F2_END, "D")',
        explanation: 'Doanh thu tiền thuê = Giá thuê/ngày * Số ngày thuê theo hợp đồng.',
      },
      searchPlaceholder: '🔍 Tìm mã barcode (BC-CAM-802), tên thiết bị, khách thuê...',
      sampleFormFields: [
        { key: 'barcode', label: 'Mã Barcode', type: 'text', defaultValue: 'BC-GIMBAL-RS4' },
        { key: 'equip_name', label: 'Tên thiết bị', type: 'text', defaultValue: 'DJI RS 4 Pro Gimbal Stabilizer' },
        { key: 'renter_name', label: 'Khách thuê', type: 'text', defaultValue: 'Freelancer Tuấn Nguyễn' },
        { key: 'rate_per_day', label: 'Giá thuê/ngày (₫)', type: 'number', defaultValue: '350000' },
        { key: 'deposit_vnd', label: 'Tiền cọc giữ (₫)', type: 'number', defaultValue: '6000000' },
      ],
      quickActions: ['+ Bàn giao thiết bị mới', '🔍 Quét Barcode Camera', '💸 Hoàn cọc & Thu hồi', '🛠️ Nhật ký bảo trì máy'],
    };
  }

  // 14. NHÓM THU CHI / DÒNG TIỀN / SỔ QUỸ (Mặc định cho các sản phẩm Tài chính)
  if (title.includes('thu chi') || title.includes('tài chính') || title.includes('dòng tiền') || title.includes('ngân sách') || title.includes('sổ quỹ')) {
    return {
      domain: 'cashflow_finance',
      domainTitle: 'Hệ Thống Quản Lý Dòng Tiền & Thu Chi Doanh Nghiệp',
      versionBadge: version,
      appIcon: '💰',
      kpis: [
        { label: 'Tổng số dư các quỹ', value: '468,250,000 ₫', subtext: 'VCB, Techcombank, Tiền mặt', color: '#059669', icon: '💵' },
        { label: 'Tổng tiền thu trong kỳ', value: '185,000,000 ₫', subtext: 'Doanh thu bán hàng & dịch vụ', color: '#0284c7', icon: '📈' },
        { label: 'Tổng tiền chi trong kỳ', value: '112,400,000 ₫', subtext: 'Chi phí vận hành & lương', color: '#d97706', icon: '📉' },
        { label: 'Dòng tiền ròng (Net CF)', value: '+72,600,000 ₫', subtext: 'Dương tiền mặt an toàn', color: '#7c3aed', icon: '🛡️' },
      ],
      columns: [
        { letter: 'A', key: 'trans_id', label: 'Mã GD', width: '90px', align: 'center' },
        { letter: 'B', key: 'date', label: 'Ngày', width: '90px', align: 'center' },
        { letter: 'C', key: 'category', label: 'Khoản Mục Thu / Chi', width: '220px' },
        { letter: 'D', key: 'type', label: 'Loại', width: '80px', align: 'center', badgeStyle: true },
        { letter: 'E', key: 'amount_vnd', label: 'Số Tiền (₫)', width: '130px', align: 'right' },
        { letter: 'F', key: 'account', label: 'Tài Khoản', width: '120px' },
        { letter: 'G', key: 'performer', label: 'Người Thực Hiện', width: '120px' },
      ],
      rows: [
        { trans_id: 'TC-01', date: '01/08/2026', category: 'Thu tiền thanh toán Hợp đồng ERP', type: 'Thu', amount_vnd: '65,000,000', account: 'VCB Doanh Nghiệp', performer: 'Kế toán trưởng' },
        { trans_id: 'TC-02', date: '02/08/2026', category: 'Chi thanh toán tiền thuê mặt bằng', type: 'Chi', amount_vnd: '18,000,000', account: 'Techcombank', performer: 'Thủ quỹ' },
        { trans_id: 'TC-03', date: '03/08/2026', category: 'Thu bán lẻ giải pháp phần mềm', type: 'Thu', amount_vnd: '45,000,000', account: 'VietQR MB Bank', performer: 'Trưởng nhóm Sales' },
        { trans_id: 'TC-04', date: '04/08/2026', category: 'Chi phí Marketing & Quảng cáo Ads', type: 'Chi', amount_vnd: '12,500,000', account: 'Thẻ tín dụng VCB', performer: 'Trưởng phòng MKT' },
        { trans_id: 'TC-05', date: '05/08/2026', category: 'Chi lương nhân sự & thưởng KPI', type: 'Chi', amount_vnd: '52,000,000', account: 'Techcombank', performer: 'Kế toán trưởng' },
      ],
      formulaInfo: {
        cell: 'E2',
        formula: '=SUMIF(D:D, "Thu", E:E) - SUMIF(D:D, "Chi", E:E)',
        explanation: 'Dòng tiền ròng (Net Cashflow) = Tổng các khoản Thu - Tổng các khoản Chi.',
      },
      searchPlaceholder: '🔍 Tìm mã giao dịch, khoản mục thu/chi, tài khoản...',
      sampleFormFields: [
        { key: 'trans_id', label: 'Mã GD', type: 'text', defaultValue: 'TC-06' },
        { key: 'category', label: 'Khoản mục thu / chi', type: 'text', defaultValue: 'Thu tiền dịch vụ tư vấn' },
        { key: 'type', label: 'Loại', type: 'select', defaultValue: 'Thu', options: ['Thu', 'Chi'] },
        { key: 'amount_vnd', label: 'Số tiền (₫)', type: 'number', defaultValue: '25000000' },
        { key: 'account', label: 'Tài khoản', type: 'text', defaultValue: 'VCB Doanh Nghiệp' },
      ],
      quickActions: ['+ Ghi nhận Thu tiền', '- Ghi nhận Chi tiền', '🏦 Đối soát số dư ngân hàng', '📊 Xuất báo cáo P&L'],
    };
  }

  // 15. NHÓM CÔNG VIỆC / DỰ ÁN / TASK / KANBAN (Mặc định cho các sản phẩm Công việc)
  return {
    domain: 'work_project',
    domainTitle: 'Hệ Thống Quản Lý Dự Án & Tiến Độ Công Việc Chuyên Sâu',
    versionBadge: version,
    appIcon: '📋',
    kpis: [
      { label: 'Tổng số nhiệm vụ', value: '48 Tasks', subtext: 'Phân bổ trong Sprint hiện tại', color: '#0284c7', icon: '📝' },
      { label: 'Đã hoàn thành', value: '36 Tasks', subtext: 'Tỷ lệ hoàn thành 75.0%', color: '#059669', icon: '✅' },
      { label: 'Nhiệm vụ ưu tiên cao', value: '5 Tasks', subtext: 'Cần giải quyết trước 18:00', color: '#dc2626', icon: '🔥' },
      { label: 'Đúng hạn Deadline', value: '94.2%', subtext: 'Hiệu suất vận hành xuất sắc', color: '#7c3aed', icon: '⏰' },
    ],
    columns: [
      { letter: 'A', key: 'task_id', label: 'Mã Task', width: '90px', align: 'center' },
      { letter: 'B', key: 'task_title', label: 'Tên Công Việc / Hạng Mục', width: '250px' },
      { letter: 'C', key: 'assignee', label: 'Người Phụ Trách', width: '150px' },
      { letter: 'D', key: 'due_date', label: 'Hạn Chót', width: '100px', align: 'center' },
      { letter: 'E', key: 'priority', label: 'Độ Ưu Tiên', width: '100px', align: 'center', badgeStyle: true },
      { letter: 'F', key: 'progress', label: 'Tiến Độ', width: '80px', align: 'center' },
      { letter: 'G', key: 'status', label: 'Trạng Thái', width: '130px', align: 'center', badgeStyle: true },
    ],
    rows: [
      { task_id: 'TSK-01', task_title: 'Lập kế hoạch Sprint & Đặc tả nghiệp vụ', assignee: 'Nguyễn Minh Tuấn (PM)', due_date: '05/08/2026', priority: 'Cao', progress: '100%', status: '✓ Hoàn thành' },
      { task_id: 'TSK-02', task_title: 'Thiết kế giao diện Figma Design System', assignee: 'Trần Thu Hà (UI/UX)', due_date: '10/08/2026', priority: 'Cao', progress: '100%', status: '✓ Hoàn thành' },
      { task_id: 'TSK-03', task_title: 'Lập trình Frontend React & Dynamic Viewer', assignee: 'Lê Hoàng Nam (Fullstack)', due_date: '18/08/2026', priority: 'Khẩn cấp', progress: '85%', status: '⚡ Đang làm' },
      { task_id: 'TSK-04', task_title: 'Kiểm thử UAT, Bảo mật & Responsive Mobile', assignee: 'Hoàng Kim Yến (QA/QC)', due_date: '22/08/2026', priority: 'Trung bình', progress: '40%', status: '⏳ Đang test' },
      { task_id: 'TSK-05', task_title: 'Triển khai Production & Bàn giao tài liệu', assignee: 'Phạm Văn Đức (DevOps)', due_date: '25/08/2026', priority: 'Trung bình', progress: '0%', status: '⏱️ Chờ làm' },
    ],
    formulaInfo: {
      cell: 'F2',
      formula: '=COUNTIF(G2:G6, "✓ Hoàn thành") / COUNTA(G2:G6)',
      explanation: 'Tỷ lệ hoàn thành dự án = Số lượng việc hoàn thành / Tổng số đầu việc.',
    },
    searchPlaceholder: '🔍 Tìm mã task, tên công việc, người phụ trách...',
    sampleFormFields: [
      { key: 'task_id', label: 'Mã Task', type: 'text', defaultValue: 'TSK-06' },
      { key: 'task_title', label: 'Tên công việc', type: 'text', defaultValue: 'Tối ưu tốc độ tải trang Core Web Vitals' },
      { key: 'assignee', label: 'Người phụ trách', type: 'text', defaultValue: 'Lê Hoàng Nam' },
      { key: 'due_date', label: 'Hạn chót', type: 'date', defaultValue: '2026-08-30' },
    ],
    quickActions: ['+ Thêm đầu việc mới', '📊 Chuyển chế độ Kanban', '📅 Xem biểu đồ Gantt', '✅ Báo cáo nghiệm thu'],
  };
}

