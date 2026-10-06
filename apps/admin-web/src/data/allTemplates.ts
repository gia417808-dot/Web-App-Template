// ============================================================================
// DANH MỤC TOÀN BỘ 229 SẢN PHẨM GSHEETS.VN & WEB APP SUITE
// Nguồn dữ liệu: GSHEETS_TEN_MO_TA_TRANG_01_15(1).md
// ============================================================================

export interface TemplateItem {
  id: string;
  name: string;
  type: 'webapp' | 'gsheet';
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  downloads: number;
  demoType: 'live_app' | 'sheet_preview';
  demoAppKey?: 'warehouse' | 'finance' | 'tasks' | 'pos' | 'crm' | null;
  features: string[];
  sheetColumns: string[];
}

export const allTemplates: TemplateItem[] = [
  {
    "id": "GS-001",
    "name": "Google Sheets | Báo cáo tài chính cá nhân",
    "type": "gsheet",
    "category": "Tài chính - Thu chi",
    "description": "Mẫu theo dõi tài chính cá nhân bằng các bảng tổng quan giúp xem tình hình từ nhiều góc độ.",
    "price": 380000,
    "originalPrice": 551000,
    "rating": 4.9,
    "downloads": 217,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-002",
    "name": "Webapp | Quản lý công việc (v2.4)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Theo dõi nhiệm vụ, checklist và KPI qua Kanban, Gantt, bảng và lịch; phân quyền giao việc, nhắc hạn, lưu lịch sử. Bản 2.4 bổ sung tài liệu gắn với task, quyền xem văn bản và xuất Excel.",
    "price": 410000,
    "originalPrice": 594000,
    "rating": 4.7,
    "downloads": 284,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-003",
    "name": "Webapp | Quản lý và Cho thuê thiết bị (v1.0)",
    "type": "webapp",
    "category": "Dịch vụ & Đặt chỗ",
    "description": "Quản lý thiết bị cho thuê theo ngày, hợp đồng, cọc, tiền thuê, lịch đặt và thu hồi; theo dõi bảo trì, công nợ, hiệu quả khai thác. Có tra cứu barcode, in biên bản và phân quyền nhân sự.",
    "price": 420000,
    "originalPrice": 609000,
    "rating": 5.0,
    "downloads": 351,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Booking",
      "Khách hàng",
      "Phòng / Thiết bị",
      "Giờ nhận",
      "Giờ trả",
      "Tiền cọc (VND)",
      "Tổng thanh toán"
    ]
  },
  {
    "id": "GS-004",
    "name": "Webapp | Quản lý thu chi Doanh nghiệp (v4.1 startup)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Theo dõi thu chi, công nợ, tài khoản, khoản vay và kết quả từng dự án; bổ sung chỉ số burn rate, runway cùng phân tích hòa vốn, chi phí cố định, chi phí biến đổi và dòng tiền đầu tư cho startup.",
    "price": 430000,
    "originalPrice": 623000,
    "rating": 4.8,
    "downloads": 418,
    "demoType": "live_app",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-005",
    "name": "Webapp | Quản Lý Nhập Xuất Tồn Kho (v3.0)",
    "type": "webapp",
    "category": "Kho & Bán lẻ",
    "description": "Quản lý nhập, xuất và điều chuyển giữa nhiều kho; tính tồn và giá vốn, cảnh báo thiếu hàng, phân quyền thủ kho, in phiếu và xuất báo cáo. Có lọc thời gian và lịch sử giao dịch khách hàng, nhà cung cấp.",
    "price": 440000,
    "originalPrice": 638000,
    "rating": 4.6,
    "downloads": 485,
    "demoType": "live_app",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-006",
    "name": "Webapp | Quản lý công việc (v2.3)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Tổ chức nhiệm vụ qua Kanban, Gantt, bảng và lịch; có việc định kỳ, checklist, KPI, nhắc hạn, phân quyền và nhật ký. Hỗ trợ xuất Excel và cải tiến phần lịch trình.",
    "price": 450000,
    "originalPrice": 652000,
    "rating": 4.9,
    "downloads": 552,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-007",
    "name": "Webapp | Quản lý Báo giá (v1.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Lập báo giá và dự toán theo khối lượng, kích thước, đơn giá; quản lý phê duyệt và lịch sử sửa. Tổng hợp vật tư, giao khoán, chia kỳ thanh toán, chèn ảnh và xuất biểu mẫu Excel hoặc bản in.",
    "price": 460000,
    "originalPrice": 667000,
    "rating": 4.7,
    "downloads": 619,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-008",
    "name": "Google Sheets | Chuyển đổi vùng chọn thành Hình ảnh, PDF",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Xuất vùng ô được chọn trong Google Sheets thành ảnh hoặc PDF ngay trên trình duyệt, gồm Chrome và Edge.",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 686,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-009",
    "name": "Webapp | Hệ thống tạo Form và Phân quyền dữ liệu (v2.2)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Tạo bảng và form trên Google Sheets với kiểu dữ liệu, dropdown liên kết, công thức, nhập hàng loạt và dashboard. Phân quyền đến bảng, người dùng và dòng; xuất báo cáo, tùy biến bản in. Bản 2.2 có ánh xạ VLOOKUP và đồng bộ kết quả công thức khi sửa.",
    "price": 480000,
    "originalPrice": 696000,
    "rating": 4.8,
    "downloads": 753,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-010",
    "name": "Google Sheets | Dashboard Bất Động Sản (v1.0)",
    "type": "gsheet",
    "category": "CRM Bán hàng",
    "description": "Bảng tổng quan bán bất động sản với bộ lọc tháng, dự án, vùng và chi nhánh; xem doanh số, số căn, xu hướng, thứ hạng và thành tích nhân viên.",
    "price": 340000,
    "originalPrice": 493000,
    "rating": 4.6,
    "downloads": 820,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-011",
    "name": "Webapp | Quản Lý Thu Chi Tiệm Sửa Xe, Hộ Kinh Doanh (v2.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Theo dõi thu chi, công nợ và thanh toán nhiều lần cho cửa hàng sửa xe hoặc hộ kinh doanh. Bản 2.0 thêm phân bổ chi phí cố định, hòa vốn, đồng bộ tự động và dashboard theo cơ sở, nhân viên.",
    "price": 500000,
    "originalPrice": 725000,
    "rating": 4.9,
    "downloads": 887,
    "demoType": "live_app",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-012",
    "name": "Webapp | Quản Trị Mini-ERP (v1.0)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Ứng dụng quản trị tích hợp POS, kiểm soát chất lượng, bảng dữ liệu con và báo cáo; có quyền theo dòng, kiểm soát thiết bị/IP, lịch sử thay đổi và nhắc hạn. Dữ liệu lưu trên Google Workspace.",
    "price": 510000,
    "originalPrice": 739000,
    "rating": 4.7,
    "downloads": 954,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-013",
    "name": "Webapp | Quản Lý Thu Chi Tiệm Sửa Xe, Hộ Kinh Doanh (v1.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Ghi nhận thu chi và các đợt thanh toán, tách doanh thu khỏi tiền thực nhận; quản lý công nợ, lợi nhuận, biểu đồ và phân quyền. Có xuất Excel và in phiếu.",
    "price": 520000,
    "originalPrice": 754000,
    "rating": 5.0,
    "downloads": 1021,
    "demoType": "live_app",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-014",
    "name": "Webapp | Quản lý chăm sóc khách hàng (v7.1)",
    "type": "webapp",
    "category": "CRM Bán hàng",
    "description": "CRM tinh gọn để theo dõi trạng thái khách hàng, lịch sử chăm sóc, cuộc gọi và KPI theo người hoặc phòng ban; hỗ trợ nhiều người phụ trách, phân quyền ba cấp và xuất Excel.",
    "price": 530000,
    "originalPrice": 768000,
    "rating": 4.8,
    "downloads": 1088,
    "demoType": "live_app",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-015",
    "name": "Webapp | Quản lý quán Cafe, Nhà hàng, Quán ăn (v3.0)",
    "type": "webapp",
    "category": "F&B Nhà hàng",
    "description": "Ứng dụng gọi món, quản lý bàn và bán mang đi; cấu hình thuế, giảm giá, phụ thu, thanh toán VietQR, in bếp và hóa đơn. Có dashboard, nhật ký đơn hàng và đồng bộ Google Sheets.",
    "price": 540000,
    "originalPrice": 783000,
    "rating": 4.6,
    "downloads": 1155,
    "demoType": "live_app",
    "demoAppKey": "pos",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Món",
      "Tên đồ ăn / đồ uống",
      "Danh mục",
      "Đơn giá (VND)",
      "Định mức nguyên liệu",
      "Tình trạng phục vụ"
    ]
  },
  {
    "id": "GS-016",
    "name": "Webapp | Quản Lý Lớp Học (v2.0)",
    "type": "webapp",
    "category": "Quản lý Lớp học",
    "description": "Quản lý học sinh, lớp, lịch học, điểm danh, nhận xét và bảng điểm; tính học phí theo buổi, ghi nhận thanh toán nhiều đợt, in báo cáo phụ huynh. Có quản lý tài chính và quyền cho kế toán, giáo viên, trợ giảng.",
    "price": 390000,
    "originalPrice": 565000,
    "rating": 4.9,
    "downloads": 1222,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Học Sinh",
      "Họ và tên",
      "Lớp học",
      "Buổi học",
      "Tình trạng điểm danh",
      "Học phí",
      "Nhận xét của giáo viên"
    ]
  },
  {
    "id": "GS-017",
    "name": "Webapp | Quản Lý App Tập Trung (v2.0)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp liên kết ứng dụng theo danh mục, tìm kiếm và mở qua khung nhúng hoặc tab mới. Bản 2.0 thêm đăng nhập, đổi mật khẩu và cấp quyền ứng dụng cho người dùng, kể cả hàng loạt.",
    "price": 400000,
    "originalPrice": 580000,
    "rating": 4.7,
    "downloads": 1289,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-018",
    "name": "Webapp | Quản Lý App Tập Trung (v1.0)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Danh bạ ứng dụng theo nhóm, hỗ trợ tìm kiếm tức thì và mở trong khung nhúng hoặc tab mới; lấy dữ liệu từ Google Sheets, dùng trên điện thoại.",
    "price": 410000,
    "originalPrice": 594000,
    "rating": 5.0,
    "downloads": 1356,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-019",
    "name": "Webapp | Quản lý thu chi Doanh nghiệp (v4.1)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Quản lý dòng tiền, giao dịch, công nợ, khoản vay và lợi nhuận hợp đồng hoặc dự án. Bản 4.1 thêm burn rate, runway, dự kiến doanh thu, bảng đối soát và thông tin quyết toán; có phân quyền và xuất sổ sách.",
    "price": 420000,
    "originalPrice": 609000,
    "rating": 4.8,
    "downloads": 1423,
    "demoType": "live_app",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-020",
    "name": "Webapp | Quản lý công việc (v2.2)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Theo dõi nhiệm vụ, checklist, ưu tiên và người phụ trách qua Kanban, bảng, lịch. Bản 2.2 thêm quyền xem theo phòng ban, bộ lọc phòng, biểu đồ và ngày bắt đầu/kết thúc công việc.",
    "price": 430000,
    "originalPrice": 623000,
    "rating": 4.6,
    "downloads": 1490,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-021",
    "name": "Webapp | Quản Lý Bán Hàng (v1.1)",
    "type": "webapp",
    "category": "Kho & Bán lẻ",
    "description": "Quản lý bán hàng, kho, khách hàng, nhà cung cấp và công nợ; có POS, barcode, tích điểm, in K80, hoàn đơn và giá vốn bình quân. Hỗ trợ phân quyền, nhập sản phẩm và xuất báo cáo Excel.",
    "price": 440000,
    "originalPrice": 638000,
    "rating": 4.9,
    "downloads": 1557,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-022",
    "name": "Webapp | Quản Lý Lớp Học (v1.0)",
    "type": "webapp",
    "category": "Quản lý Lớp học",
    "description": "Quản lý học sinh tham gia nhiều lớp, điểm danh, phân công giáo viên và lịch dạy; tính học phí, công nợ, thanh toán nhiều đợt và in hóa đơn. Phân quyền giáo viên theo lớp phụ trách.",
    "price": 450000,
    "originalPrice": 652000,
    "rating": 4.7,
    "downloads": 1624,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Học Sinh",
      "Họ và tên",
      "Lớp học",
      "Buổi học",
      "Tình trạng điểm danh",
      "Học phí",
      "Nhận xét của giáo viên"
    ]
  },
  {
    "id": "GS-023",
    "name": "Webapp | Quản Lý Bán Hàng (v1.0)",
    "type": "webapp",
    "category": "Kho & Bán lẻ",
    "description": "Theo dõi đơn bán, xuất nhập tồn, khách hàng, nhà cung cấp và thanh toán nhiều kỳ; tính thuế, chiết khấu, giá vốn và lợi nhuận. Có hoàn đơn, phân quyền, nhập/xuất Excel và in phiếu.",
    "price": 460000,
    "originalPrice": 667000,
    "rating": 5.0,
    "downloads": 1691,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-024",
    "name": "Webapp | Quản lý thu chi Doanh nghiệp (v4.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Theo dõi tài khoản, thu chi, chuyển khoản, công nợ và hạn mức vay; báo cáo lợi nhuận từng hợp đồng/dự án, cảnh báo kỳ trả nợ. Có thuế linh hoạt, thanh toán nhiều lần, phân quyền và xuất Excel.",
    "price": 470000,
    "originalPrice": 681000,
    "rating": 4.8,
    "downloads": 1758,
    "demoType": "live_app",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-025",
    "name": "Webapp | Quản lý thu chi Doanh nghiệp (v3.1)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Quản lý giao dịch và số dư tài khoản, khách hàng, nhà cung cấp, công nợ và báo cáo tài chính. Bản 3.1 thêm chia đợt thanh toán, cố định cột và xuất công nợ riêng từng đối tác.",
    "price": 480000,
    "originalPrice": 696000,
    "rating": 4.6,
    "downloads": 1825,
    "demoType": "live_app",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-026",
    "name": "Webapp | Quản Lý Spa, Phòng khám (v1.0)",
    "type": "webapp",
    "category": "Dịch vụ & Đặt chỗ",
    "description": "Quản lý lịch khám dạng dòng thời gian, ngăn đặt trùng và theo dõi lịch sử khách hàng; báo cáo doanh thu bác sĩ, danh mục dịch vụ và quyền thao tác theo người dùng.",
    "price": 490000,
    "originalPrice": 710000,
    "rating": 4.9,
    "downloads": 1892,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Booking",
      "Khách hàng",
      "Phòng / Thiết bị",
      "Giờ nhận",
      "Giờ trả",
      "Tiền cọc (VND)",
      "Tổng thanh toán"
    ]
  },
  {
    "id": "GS-027",
    "name": "Webapp | Quay số trúng thưởng (v2.0)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Công cụ bốc số trong khoảng 001–999, cho phép tùy chỉnh giải, hình thức trình bày và ảnh; phù hợp tổ chức sự kiện hoặc tiệc.",
    "price": 500000,
    "originalPrice": 725000,
    "rating": 4.7,
    "downloads": 1959,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-028",
    "name": "Webapp | Quản Lý Dự án, Công việc (v5.0)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Quản lý dự án và nhiệm vụ với tiến độ, Gantt, nhắc hạn, báo cáo hiệu suất và quyền ba cấp. Bản 5.0 có đề nghị/phê duyệt, bình luận, tổ chức tài liệu, nhiều webapp và bộ lọc dự án.",
    "price": 510000,
    "originalPrice": 739000,
    "rating": 5.0,
    "downloads": 2026,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-029",
    "name": "Webapp | Quản lý công việc (v2.1)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Quản lý checklist và nhiệm vụ bằng Kanban, bảng hoặc lịch, kèm báo cáo tiến độ và phân quyền. Bản 2.1 thêm màu nhắc hạn, bộ lọc 7/30 ngày, danh sách trong Kanban và ẩn hiện thanh bên.",
    "price": 520000,
    "originalPrice": 754000,
    "rating": 4.8,
    "downloads": 2093,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-030",
    "name": "Webapp | Quản lý thu chi Doanh nghiệp (v3.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Theo dõi thu chi, chuyển tiền, số dư và công nợ đối tác. Bản 3.0 bổ sung quyền thêm/sửa/xóa theo người, xuất công nợ, đổi mật khẩu, ghi nhận người nhập và tìm khách hàng hoặc nhà cung cấp.",
    "price": 530000,
    "originalPrice": 768000,
    "rating": 4.6,
    "downloads": 2160,
    "demoType": "live_app",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-031",
    "name": "Webapp | Quản lý công việc (v2.0)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Tổ chức công việc, checklist, người phụ trách và mức ưu tiên qua Kanban, bảng, lịch; có dashboard hiệu suất, bộ lọc, tài khoản, phân quyền và lịch sử sửa.",
    "price": 540000,
    "originalPrice": 783000,
    "rating": 4.9,
    "downloads": 2227,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-032",
    "name": "Webapp | Hệ thống tạo Form và Phân quyền dữ liệu (v2.1)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Tùy biến bảng, form, dashboard và quyền truy cập trên Google Sheets/Drive. Bản 2.1 thêm dropdown lấy từ sheet khác, tìm lựa chọn, trường giờ/ngày giờ và công thức; hỗ trợ xem trước bản ghi, nhập/xuất và in báo cáo.",
    "price": 390000,
    "originalPrice": 565000,
    "rating": 4.7,
    "downloads": 2294,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-033",
    "name": "Webapp | Quản lý chăm sóc khách hàng (v7.0)",
    "type": "webapp",
    "category": "CRM Bán hàng",
    "description": "CRM theo trạng thái, lịch sử chăm sóc và đơn hàng với nhắc việc, phân quyền, báo cáo. Bản 7.0 bổ sung thống kê khu vực/cuộc gọi, lọc thời gian chăm lại và kiểm tra số điện thoại trùng.",
    "price": 400000,
    "originalPrice": 580000,
    "rating": 5.0,
    "downloads": 161,
    "demoType": "live_app",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-034",
    "name": "Webapp | Quản Lý Khách Sạn, Homestay (v1.0)",
    "type": "webapp",
    "category": "Dịch vụ & Đặt chỗ",
    "description": "Theo dõi booking theo giờ hoặc ngày cho nhiều cơ sở, kiểm tra xung đột, tình trạng phòng và lịch dọn. Có thanh toán nhiều lần, báo cáo lợi nhuận từng phòng, quyền bốn cấp, nhật ký booking và cập nhật dữ liệu tự động.",
    "price": 410000,
    "originalPrice": 594000,
    "rating": 4.8,
    "downloads": 228,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Booking",
      "Khách hàng",
      "Phòng / Thiết bị",
      "Giờ nhận",
      "Giờ trả",
      "Tiền cọc (VND)",
      "Tổng thanh toán"
    ]
  },
  {
    "id": "GS-035",
    "name": "Webapp | Hệ thống tạo Form và Phân quyền dữ liệu (v1.2)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Tạo form hoặc bảng nhiều dòng, quản lý tệp Drive, dropdown phụ thuộc và phép tính; có quyền thao tác, nhập/xuất Excel, mẫu in và sao lưu sheet. Bản 1.2 bổ sung tạo dashboard.",
    "price": 420000,
    "originalPrice": 609000,
    "rating": 4.6,
    "downloads": 295,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-036",
    "name": "Webapp | Quay số trúng thưởng (v1.0)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Bốc số ngẫu nhiên từ danh sách nhập trên Google Sheets và xuất kết quả trúng thưởng để in hoặc thành PDF. Nguồn ghi giới hạn sử dụng cá nhân, không bán lại.",
    "price": 430000,
    "originalPrice": 623000,
    "rating": 4.9,
    "downloads": 362,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-037",
    "name": "Webapp | Quản lý công việc (v1.0)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Trang nguồn chủ yếu nêu hướng dẫn tải và quyền sử dụng của NexSimpleLab; chưa cung cấp mô tả chức năng chi tiết, có giới hạn chỉnh sửa để thương mại hóa.",
    "price": 440000,
    "originalPrice": 638000,
    "rating": 4.7,
    "downloads": 429,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-038",
    "name": "Webapp | Quản lý chăm sóc khách hàng (v6.0)",
    "type": "webapp",
    "category": "CRM Bán hàng",
    "description": "Quản lý khách hàng, nhiều đơn hàng, chăm sóc và báo cáo theo trạng thái. Bản 6.0 chuyển sang Status/Table, thêm quyền nhắc việc cùng lịch sử cập nhật khách hàng.",
    "price": 450000,
    "originalPrice": 652000,
    "rating": 5.0,
    "downloads": 496,
    "demoType": "live_app",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-039",
    "name": "Webapp | Hệ thống tạo Form và Phân quyền dữ liệu (v2.0)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Xây bảng dữ liệu, form nhiều dòng, bộ lọc và dashboard tùy chỉnh; có quyền theo người, tệp Drive, định dạng điều kiện, nhập Excel và xuất/in báo cáo. Hỗ trợ xem trước bản ghi và tự ẩn cột.",
    "price": 460000,
    "originalPrice": 667000,
    "rating": 4.8,
    "downloads": 563,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-040",
    "name": "Webapp | Hệ thống tạo Form và Phân quyền dữ liệu (v1.1)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Tạo form, bảng dữ liệu và quyền xem/thêm/sửa/xóa; hỗ trợ tệp Drive, dropdown tìm kiếm/phụ thuộc, tính toán, nhập/xuất Excel. Có nhúng biểu đồ, nhóm báo cáo, tìm theo cột và in tùy khổ giấy.",
    "price": 470000,
    "originalPrice": 681000,
    "rating": 4.6,
    "downloads": 630,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-041",
    "name": "Webapp | Quản Lý Dự án, Công việc (v4.1)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Bản nâng cấp quản lý dự án từ 4.0, thêm checklist, kéo thả nhiệm vụ, xem nhanh chi tiết và tính tiến độ từ mức hoàn thành nhiệm vụ. Có lọc dự án, ngày bắt đầu và nhóm dự án đã hoàn tất.",
    "price": 480000,
    "originalPrice": 696000,
    "rating": 4.9,
    "downloads": 697,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-042",
    "name": "Webapp | Quản lý công nợ khách hàng (v1.0)",
    "type": "webapp",
    "category": "CRM Bán hàng",
    "description": "Quản lý hồ sơ khách hàng, phát sinh nợ và thanh toán, tự tính số còn phải thu; có tìm kiếm, lọc và tổng quan khách hàng nợ nhiều, kết nối Google Sheets.",
    "price": 490000,
    "originalPrice": 710000,
    "rating": 4.7,
    "downloads": 764,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-043",
    "name": "Webapp | Quản lý chăm sóc khách hàng (v5.0)",
    "type": "webapp",
    "category": "CRM Bán hàng",
    "description": "CRM theo Kanban với thông tin khách, chăm sóc, nhiều đơn hàng và báo cáo. Bản 5.0 nâng quyền nhiều cấp và đổi mật khẩu; có điều chỉnh lỗi ID đơn và xác nhận khi xóa cấu hình.",
    "price": 500000,
    "originalPrice": 725000,
    "rating": 5.0,
    "downloads": 831,
    "demoType": "live_app",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-044",
    "name": "Webapp | Quản Lý Ghi Chú (v1.0)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Ghi chú và prompt dạng cây cha-con, lịch nhiệm vụ, checklist và thống kê hoàn thành; hỗ trợ markdown, ảnh, bảng, kéo thả, lưu thông tin tài khoản và đăng nhập.",
    "price": 510000,
    "originalPrice": 739000,
    "rating": 4.8,
    "downloads": 898,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-045",
    "name": "Webapp | Quản Lý Tuyển Dụng (v2.0)",
    "type": "webapp",
    "category": "Nhân sự & Tiền lương",
    "description": "Quản lý tuyển dụng bằng Kanban hoặc bảng, báo cáo phân tích, quyền ba cấp và cấu hình quy trình. Có tải CV lên Drive và gửi email theo mẫu.",
    "price": 520000,
    "originalPrice": 754000,
    "rating": 4.6,
    "downloads": 965,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-046",
    "name": "Webapp | Quản Lý Tài Liệu, Văn Bản (v1.0)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Tập trung hồ sơ, hợp đồng và tài liệu trên Drive; phân loại, lọc, xem trước, chia sẻ và cảnh báo hết hạn. Có quyền theo danh mục/thao tác, thay tệp, nhóm hồ sơ và xuất danh sách Excel.",
    "price": 530000,
    "originalPrice": 768000,
    "rating": 4.9,
    "downloads": 1032,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-047",
    "name": "Webapp | Quản lý chấm công (v3.0)",
    "type": "webapp",
    "category": "Nhân sự & Tiền lương",
    "description": "Chấm công theo trạng thái, giờ tăng ca hoặc hàng loạt; xem timeline, báo cáo và xuất Excel. Dữ liệu năm được gói trong một sheet, có quyền Admin/User và giao diện điện thoại.",
    "price": 540000,
    "originalPrice": 783000,
    "rating": 4.7,
    "downloads": 1099,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-048",
    "name": "Google Sheets | Form Đặt phòng Khách sạn, Homestay (v4.0)",
    "type": "gsheet",
    "category": "Dịch vụ & Đặt chỗ",
    "description": "Mẫu đặt phòng đa cơ sở theo giờ, ngày hoặc nhiều ngày; kiểm tra trùng đến phút và tạo biểu đồ thống kê. Nguồn mô tả triển khai bằng công thức, không dùng code.",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 1166,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Booking",
      "Khách hàng",
      "Phòng / Thiết bị",
      "Giờ nhận",
      "Giờ trả",
      "Tiền cọc (VND)",
      "Tổng thanh toán"
    ]
  },
  {
    "id": "GS-049",
    "name": "Webapp | Quản Lý Tài Chính Cá Nhân (v3.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Bản nâng cấp tài chính cá nhân từ 2.0, thêm đăng nhập, chi tiết tài khoản và số dư theo giai đoạn; có xác nhận xóa và cải tiến giao diện, hiệu suất.",
    "price": 400000,
    "originalPrice": 580000,
    "rating": 4.8,
    "downloads": 1233,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-050",
    "name": "Webapp | Quản Lý Dự án, Công việc (v4.0)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Bản nâng cấp quản lý dự án từ 3.0, bổ sung chat chung, sao chép dự án/nhiệm vụ, thêm việc nhanh từ thẻ, biểu đồ và điều chỉnh quyền; cải tiến cấu trúc dữ liệu và giao diện.",
    "price": 410000,
    "originalPrice": 594000,
    "rating": 4.6,
    "downloads": 1300,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-051",
    "name": "Webapp | Quản lý quán Cafe, Nhà hàng, Quán ăn (v2.0)",
    "type": "webapp",
    "category": "F&B Nhà hàng",
    "description": "Gọi món cho bàn hoặc mang đi, quản lý các đợt gọi thêm, tính thuế/giảm giá/phụ thu và thanh toán VietQR. Có in hóa đơn, báo cáo theo ngày, xuất đơn hàng Excel và đồng bộ Sheets.",
    "price": 420000,
    "originalPrice": 609000,
    "rating": 4.9,
    "downloads": 1367,
    "demoType": "live_app",
    "demoAppKey": "pos",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Món",
      "Tên đồ ăn / đồ uống",
      "Danh mục",
      "Đơn giá (VND)",
      "Định mức nguyên liệu",
      "Tình trạng phục vụ"
    ]
  },
  {
    "id": "GS-052",
    "name": "Webapp | Hệ thống tạo Form và Phân quyền dữ liệu (v1.0)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Tạo bảng/form với nhiều loại trường, dropdown phụ thuộc và tính toán; quản lý tệp Drive, quyền người dùng, nhập/xuất Excel, nhúng báo cáo, mẫu in và sao lưu sheet.",
    "price": 430000,
    "originalPrice": 623000,
    "rating": 4.7,
    "downloads": 1434,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-053",
    "name": "Webapp | Quản Lý Nhập Xuất Tồn Kho (v2.0)",
    "type": "webapp",
    "category": "Kho & Bán lẻ",
    "description": "Nâng cấp ứng dụng kho từ 1.0: thêm định mức xuất theo tháng, nhiều mặt hàng trên một phiếu, in phiếu nhập/xuất và xuất báo cáo kho dạng Excel hoặc PDF.",
    "price": 440000,
    "originalPrice": 638000,
    "rating": 5.0,
    "downloads": 1501,
    "demoType": "live_app",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-054",
    "name": "Webapp | Kế hoạch Ngân sách Doanh nghiệp (v2.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Lập ngân sách theo tháng và khoản mục, so sánh thực tế, cảnh báo vượt hạn, theo dõi dòng tiền/công nợ. Bản 2.0 bổ sung đăng nhập phân quyền, quyền xem thu chi, tài khoản thanh toán và bộ lọc giao dịch.",
    "price": 450000,
    "originalPrice": 652000,
    "rating": 4.8,
    "downloads": 1568,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-055",
    "name": "Webapp | Quản Lý Tài Chính Cá Nhân (v1.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Ứng dụng ghi thu chi cá nhân, lập ngân sách và mục tiêu, xem biểu đồ; cho phép nhập, thêm, sửa, xóa và tùy chỉnh cấu hình.",
    "price": 460000,
    "originalPrice": 667000,
    "rating": 4.6,
    "downloads": 1635,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-056",
    "name": "Webapp | Kế hoạch Ngân sách Doanh nghiệp (v1.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Lập và kiểm soát ngân sách doanh nghiệp theo tháng, so sánh kế hoạch/thực tế, cảnh báo hạn mức; theo dõi dòng tiền, công nợ và kết quả kinh doanh qua báo cáo.",
    "price": 470000,
    "originalPrice": 681000,
    "rating": 4.9,
    "downloads": 1702,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-057",
    "name": "Webapp | Quản lý chăm sóc khách hàng (v4.0)",
    "type": "webapp",
    "category": "CRM Bán hàng",
    "description": "CRM dạng Kanban có chăm sóc, bộ lọc và biểu đồ; bản 4.0 cho phép nhiều đơn trên một khách và điều chỉnh quyền nhân viên không phụ trách, kèm sửa lỗi đơn hàng.",
    "price": 480000,
    "originalPrice": 696000,
    "rating": 4.7,
    "downloads": 1769,
    "demoType": "live_app",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-058",
    "name": "Webapp | Tạo bản sao Drive, Folder & Google Sheets",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Liệt kê thư mục Drive theo cấp, sao chép hàng loạt cây thư mục, đổi tên và xóa các bản sao qua giao diện web.",
    "price": 490000,
    "originalPrice": 710000,
    "rating": 5.0,
    "downloads": 1836,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-059",
    "name": "Webapp | Quản Lý Nhập Xuất Tồn Kho (v1.0)",
    "type": "webapp",
    "category": "Kho & Bán lẻ",
    "description": "Ứng dụng kho cơ bản với nhập/xuất, kiểm tra và cảnh báo tồn từng sản phẩm, dashboard và quyền đăng nhập; cấu hình trên web cho kho nhỏ.",
    "price": 500000,
    "originalPrice": 725000,
    "rating": 4.8,
    "downloads": 1903,
    "demoType": "live_app",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-060",
    "name": "Webapp | Quản lý chấm công (v1.0)",
    "type": "webapp",
    "category": "Nhân sự & Tiền lương",
    "description": "Ghi công theo giờ chính, tăng ca và vắng mặt, hỗ trợ thao tác hàng loạt; có timeline, thống kê, xuất Excel, tự lưu dữ liệu và quyền Admin/User.",
    "price": 510000,
    "originalPrice": 739000,
    "rating": 4.6,
    "downloads": 1970,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-061",
    "name": "Webapp | Quản lý chấm công (v2.0)",
    "type": "webapp",
    "category": "Nhân sự & Tiền lương",
    "description": "Chấm công theo có mặt, vắng, phép, đi muộn cùng thao tác hàng loạt; có timeline, báo cáo Excel và quyền Admin/User, lưu dữ liệu cả năm trên một sheet.",
    "price": 520000,
    "originalPrice": 754000,
    "rating": 4.9,
    "downloads": 2037,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-062",
    "name": "Webapp | Quản lý thu chi Doanh nghiệp (v2.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Theo dõi dòng tiền, số dư, thu chi/chuyển khoản, công nợ và đối tác. Bản 2.0 bổ sung xuất Excel, cấu hình sản phẩm và xem lịch sử giao dịch từng tài khoản.",
    "price": 530000,
    "originalPrice": 768000,
    "rating": 4.7,
    "downloads": 2104,
    "demoType": "live_app",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-063",
    "name": "Google Sheets | Quản Lý Lịch Hẹn",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Theo dõi lịch hẹn theo giờ và ngày, lọc theo đối tượng hoặc dịch vụ; có bảng tổng quan thống kê và cấu hình linh hoạt.",
    "price": 109000,
    "originalPrice": 158000,
    "rating": 5.0,
    "downloads": 2171,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-064",
    "name": "Google Sheets | Import Data nhiều FILE tốc độ siêu nhanh (v6.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Gom dữ liệu nhiều file/sheet có cấu trúc khác nhau; chọn cột, vùng nguồn/đích và tiêu đề. Hỗ trợ điều kiện thời gian, số, nội dung, rỗng, wildcard/OR và bật tắt cấu hình tập trung.",
    "price": 179000,
    "originalPrice": 259000,
    "rating": 4.8,
    "downloads": 2238,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-065",
    "name": "Webapp | Quản lý chăm sóc khách hàng (v3.0)",
    "type": "webapp",
    "category": "CRM Bán hàng",
    "description": "CRM theo Kanban và trạng thái với lịch sử chăm sóc, quyền trưởng nhóm/nhân viên, tìm kiếm và báo cáo. Bản 3.0 thêm thống kê doanh thu, bộ lọc và cải tiến thông báo.",
    "price": 400000,
    "originalPrice": 580000,
    "rating": 4.6,
    "downloads": 2305,
    "demoType": "live_app",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-066",
    "name": "Webapp | Quản lý chăm sóc khách hàng (v2.0)",
    "type": "webapp",
    "category": "CRM Bán hàng",
    "description": "CRM cho thông tin khách và lịch sử chăm sóc, phân quyền trưởng nhóm/nhân viên và báo cáo. Bản 2.0 bổ sung Kanban theo trạng thái, lọc thời gian và biểu đồ nhân viên bán hàng nổi bật.",
    "price": 410000,
    "originalPrice": 594000,
    "rating": 4.9,
    "downloads": 172,
    "demoType": "live_app",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-067",
    "name": "Webapp | Quản lý chăm sóc khách hàng (v1.0)",
    "type": "webapp",
    "category": "CRM Bán hàng",
    "description": "Quản lý thông tin và lịch sử chăm sóc khách hàng; hỗ trợ tìm kiếm, lọc, biểu đồ thống kê và phân quyền giao việc giữa trưởng nhóm và nhân viên.",
    "price": 420000,
    "originalPrice": 609000,
    "rating": 4.7,
    "downloads": 239,
    "demoType": "live_app",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-068",
    "name": "Webapp | Quản Lý Dự án, Công việc (v3.0)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Nâng cấp từ ứng dụng dự án 2.0, thêm quyền quản lý thành ba cấp, xem chi tiết nhiệm vụ trong thẻ dự án, tệp/mục tiêu và biểu đồ Gantt.",
    "price": 430000,
    "originalPrice": 623000,
    "rating": 5.0,
    "downloads": 306,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-069",
    "name": "Google Sheets | Theo dõi dự án, công việc (v2.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Theo dõi quy trình, nhiệm vụ chính/phụ, ưu tiên, tài liệu, người phụ trách và thời hạn trong một file. Có cảnh báo quá hạn, bộ lọc, Kanban và timeline.",
    "price": 370000,
    "originalPrice": 536000,
    "rating": 4.8,
    "downloads": 373,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-070",
    "name": "Webapp | Tạo Phiếu Khảo Sát Tinh Gọn Thay Thế Google Form (v1.0)",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Tạo khảo sát phân trang với chín nhóm trường, dropdown phụ thuộc, ảnh/camera và nén ảnh lên Drive. Có xáo câu hỏi, kéo thả, xem trước, tùy biến thương hiệu và đăng nhập cấu hình; lưu phản hồi trên Sheets.",
    "price": 450000,
    "originalPrice": 652000,
    "rating": 4.6,
    "downloads": 440,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-071",
    "name": "Webapp | Quản Lý Dự án, Công việc (v2.0)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Theo dõi dự án, giao việc, deadline và cập nhật tiến độ; thông báo việc mới/quá hạn, quyền Admin/User, lọc nhiệm vụ và báo cáo hiệu suất. Đồng bộ dữ liệu Google Sheets.",
    "price": 460000,
    "originalPrice": 667000,
    "rating": 4.9,
    "downloads": 507,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-072",
    "name": "Webapp | Quản Lý Tuyển Dụng (v1.0)",
    "type": "webapp",
    "category": "Nhân sự & Tiền lương",
    "description": "Theo dõi các giai đoạn tuyển dụng bằng Kanban kéo thả, dashboard phân tích và đăng nhập; cấu hình phòng ban/người dùng, thao tác thêm sửa xóa trên điện thoại hoặc máy tính.",
    "price": 470000,
    "originalPrice": 681000,
    "rating": 4.7,
    "downloads": 574,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-073",
    "name": "Webapp | Ứng Dụng Nén Ảnh",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Webapp | Ứng Dụng Nén Ảnh.",
    "price": 480000,
    "originalPrice": 696000,
    "rating": 5.0,
    "downloads": 641,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-074",
    "name": "Webapp | Quản lý thu chi Doanh nghiệp (v1.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Theo dõi thu, chi, chuyển tiền, số dư tài khoản và công nợ khách hàng/nhà cung cấp; có báo cáo tài chính, đăng nhập, lịch sử tài khoản và xuất Excel.",
    "price": 490000,
    "originalPrice": 710000,
    "rating": 4.8,
    "downloads": 708,
    "demoType": "live_app",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-075",
    "name": "Webapp | Ứng dụng học Tiếng Anh thông minh (v1.0)",
    "type": "webapp",
    "category": "Quản lý Lớp học",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Webapp | Ứng dụng học Tiếng Anh thông minh (v1.0).",
    "price": 500000,
    "originalPrice": 725000,
    "rating": 4.6,
    "downloads": 775,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Học Sinh",
      "Họ và tên",
      "Lớp học",
      "Buổi học",
      "Tình trạng điểm danh",
      "Học phí",
      "Nhận xét của giáo viên"
    ]
  },
  {
    "id": "GS-076",
    "name": "Webapp | Quản lý hồ sơ nhân sự (v1.0)",
    "type": "webapp",
    "category": "Nhân sự & Tiền lương",
    "description": "Hồ sơ theo dõi thông tin nhân viên, phòng ban, quá trình công tác và biến động nhân sự nội bộ.",
    "price": 510000,
    "originalPrice": 739000,
    "rating": 4.9,
    "downloads": 842,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-077",
    "name": "Google Sheets | Theo dõi công việc (v8.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Mẫu theo dõi tiến độ nhiệm vụ, phân công nhân sự, nhắc hạn chót và thống kê tỷ lệ hoàn thành dự án.",
    "price": 360000,
    "originalPrice": 522000,
    "rating": 4.7,
    "downloads": 909,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-078",
    "name": "Google Sheets | Form Đặt phòng Khách sạn, Homestay (v3.0)",
    "type": "gsheet",
    "category": "Dịch vụ & Đặt chỗ",
    "description": "Theo dõi booking theo ngày hoặc khoảng thời gian, cảnh báo trùng lịch; thống kê doanh thu và tỷ lệ phòng được sử dụng, tùy chỉnh cấu hình.",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 976,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Booking",
      "Khách hàng",
      "Phòng / Thiết bị",
      "Giờ nhận",
      "Giờ trả",
      "Tiền cọc (VND)",
      "Tổng thanh toán"
    ]
  },
  {
    "id": "GS-079",
    "name": "Webapp | Quản Lý Dự án, Công việc (v1.0)",
    "type": "webapp",
    "category": "Dự án & Công việc",
    "description": "Tổ chức dự án bằng Kanban, danh sách hoặc Gantt; giao nhiều người, quản lý nhiệm vụ con, ưu tiên, hạn và tệp đính kèm. Có kéo thả, checklist và lọc công việc.",
    "price": 540000,
    "originalPrice": 783000,
    "rating": 4.8,
    "downloads": 1043,
    "demoType": "live_app",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-080",
    "name": "Webapp | Quản Lý Chi Tiêu 6 Hũ (v1.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Phân bổ thu nhập và theo dõi chi theo phương pháp sáu hũ; điều chỉnh tỷ lệ từng hũ, xem biểu đồ ngân sách và lọc giao dịch theo thời gian, số tiền, nội dung.",
    "price": 390000,
    "originalPrice": 565000,
    "rating": 4.6,
    "downloads": 1110,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-081",
    "name": "Webapp | Quản Lý Tài Chính Cá Nhân (v2.0)",
    "type": "webapp",
    "category": "Tài chính - Thu chi",
    "description": "Tổng hợp tài sản, thu nhập, chi tiêu và tiết kiệm; ghi giao dịch và số dư nhiều tài khoản, quản lý khoản vay/nợ, danh mục đầu tư và biểu đồ phân tích, tùy chỉnh màu giao diện.",
    "price": 400000,
    "originalPrice": 580000,
    "rating": 4.9,
    "downloads": 1177,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-082",
    "name": "Webapp | Quản lý quán Cafe, Nhà hàng, Quán ăn (v1.0)",
    "type": "webapp",
    "category": "F&B Nhà hàng",
    "description": "Ứng dụng đặt món, tra cứu và sửa/xóa đơn; tính tiền, thuế, giảm giá, in bill và QR chuyển khoản. Có đăng nhập và quyền Admin để quản lý sản phẩm, người dùng, báo cáo.",
    "price": 410000,
    "originalPrice": 594000,
    "rating": 4.7,
    "downloads": 1244,
    "demoType": "live_app",
    "demoAppKey": "pos",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Món",
      "Tên đồ ăn / đồ uống",
      "Danh mục",
      "Đơn giá (VND)",
      "Định mức nguyên liệu",
      "Tình trạng phục vụ"
    ]
  },
  {
    "id": "GS-083",
    "name": "Webapp | Quản Lý Nghỉ Phép Cho Doanh Nghiệp",
    "type": "webapp",
    "category": "Nhân sự & Tiền lương",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Webapp | Quản Lý Nghỉ Phép Cho Doanh Nghiệp.",
    "price": 420000,
    "originalPrice": 609000,
    "rating": 5.0,
    "downloads": 1311,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-084",
    "name": "Webapp | Quản lý Phê Duyệt Chi Tiền Cho Doanh Nghiệp",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Webapp | Quản lý Phê Duyệt Chi Tiền Cho Doanh Nghiệp.",
    "price": 430000,
    "originalPrice": 623000,
    "rating": 4.8,
    "downloads": 1378,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-085",
    "name": "Webapp | Quản Lý Báo Cáo Cơ bản",
    "type": "webapp",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Webapp | Quản Lý Báo Cáo Cơ bản.",
    "price": 440000,
    "originalPrice": 638000,
    "rating": 4.6,
    "downloads": 1445,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-086",
    "name": "Google Sheets | Phân quyền nhập, sửa, xoá nhiều form (v2.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Bản phân quyền form chuyển file người dùng từ IMPORTRANGE sang dữ liệu thô, hỗ trợ đồng bộ từ Master về User. Nguồn nêu sức chứa khoảng 100.000 dòng và mục tiêu tăng ổn định, bảo mật.",
    "price": 119000,
    "originalPrice": 172000,
    "rating": 4.9,
    "downloads": 1512,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-087",
    "name": "Google Sheets | Phân quyền nhập, sửa, xoá nhiều form (v1.1)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Phân quyền nhập, sửa, xoá nhiều form (v1.1).",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 1579,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-088",
    "name": "Google Sheets | Phân quyền nhập, sửa, xoá nhiều form (v1.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Phân quyền nhập, sửa, xoá nhiều form (v1.0).",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 1646,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-089",
    "name": "Google Sheets | Theo dõi dự án, công việc (v1.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Quản lý nhiều quy trình và nhiệm vụ chính/phụ, gắn tài liệu, ưu tiên và người phụ trách; theo dõi hạn, cảnh báo quá hạn, xem Kanban và lọc thời gian/nhân sự.",
    "price": 270000,
    "originalPrice": 391000,
    "rating": 4.8,
    "downloads": 1713,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-090",
    "name": "Google Sheets | Sales Dashboard",
    "type": "gsheet",
    "category": "CRM Bán hàng",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Sales Dashboard.",
    "price": 320000,
    "originalPrice": 464000,
    "rating": 4.6,
    "downloads": 1780,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-091",
    "name": "Google Sheets | Phân quyền nhập liệu nhiều Form từ nhiều file (v2.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Phân quyền nhập liệu nhiều Form từ nhiều file (v2.0).",
    "price": 169000,
    "originalPrice": 245000,
    "rating": 4.9,
    "downloads": 1847,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-092",
    "name": "Google Sheets | Phân quyền nhập liệu nhiều Form từ nhiều file (v1.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Phân quyền nhập liệu nhiều Form từ nhiều file (v1.0).",
    "price": 139000,
    "originalPrice": 201000,
    "rating": 4.7,
    "downloads": 1914,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-093",
    "name": "Google Sheets | Bảng theo dõi phép năm người lao động",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Bảng theo dõi số ngày phép năm còn lại và lịch nghỉ phép của toàn bộ người lao động.",
    "price": 230000,
    "originalPrice": 333000,
    "rating": 5.0,
    "downloads": 1981,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-094",
    "name": "Google Sheets | Điểm danh và quản lý lớp học (Basic)",
    "type": "gsheet",
    "category": "Quản lý Lớp học",
    "description": "Mẫu điểm danh học sinh, sinh viên theo từng buổi học và thông báo vắng cho phụ huynh.",
    "price": 179000,
    "originalPrice": 259000,
    "rating": 4.8,
    "downloads": 2048,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Học Sinh",
      "Họ và tên",
      "Lớp học",
      "Buổi học",
      "Tình trạng điểm danh",
      "Học phí",
      "Nhận xét của giáo viên"
    ]
  },
  {
    "id": "GS-095",
    "name": "Google Sheets | Import Data nhiều FILE tốc độ siêu nhanh (v5.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Giải pháp tự động liên kết và tổng hợp dữ liệu từ nhiều file Google Sheets về một bảng tính trung tâm.",
    "price": 149000,
    "originalPrice": 216000,
    "rating": 4.6,
    "downloads": 2115,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-096",
    "name": "Google Sheets | Theo dõi công việc (song ngữ) (7.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Mẫu theo dõi tiến độ nhiệm vụ, phân công nhân sự, nhắc hạn chót và thống kê tỷ lệ hoàn thành dự án.",
    "price": 280000,
    "originalPrice": 406000,
    "rating": 4.9,
    "downloads": 2182,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-097",
    "name": "Google Sheets | Báo cáo biến động nhân sự (v2.0)",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Hồ sơ theo dõi thông tin nhân viên, phòng ban, quá trình công tác và biến động nhân sự nội bộ.",
    "price": 250000,
    "originalPrice": 362000,
    "rating": 4.7,
    "downloads": 2249,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-098",
    "name": "Google Sheets | Báo cáo biến động nhân sự (v2.1)",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Hồ sơ theo dõi thông tin nhân viên, phòng ban, quá trình công tác và biến động nhân sự nội bộ.",
    "price": 220000,
    "originalPrice": 319000,
    "rating": 5.0,
    "downloads": 2316,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-099",
    "name": "Google Sheets | Dashboard bán hàng không dùng công thức",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Dashboard bán hàng không dùng công thức.",
    "price": 370000,
    "originalPrice": 536000,
    "rating": 4.8,
    "downloads": 183,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-100",
    "name": "Google Sheets | Báo cáo CRM (v2.0)",
    "type": "gsheet",
    "category": "CRM Bán hàng",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Báo cáo CRM (v2.0).",
    "price": 300000,
    "originalPrice": 435000,
    "rating": 4.6,
    "downloads": 250,
    "demoType": "sheet_preview",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-101",
    "name": "Google Sheets | Báo cáo kết quả kinh doanh (P&L) – Basic",
    "type": "gsheet",
    "category": "Tài chính - Thu chi",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Báo cáo kết quả kinh doanh (P&L) – Basic.",
    "price": 330000,
    "originalPrice": 478000,
    "rating": 4.9,
    "downloads": 317,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-102",
    "name": "Google Sheets | Báo cáo dòng tiền (Cash Flow) – Basic",
    "type": "gsheet",
    "category": "Tài chính - Thu chi",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Báo cáo dòng tiền (Cash Flow) – Basic.",
    "price": 310000,
    "originalPrice": 449000,
    "rating": 4.7,
    "downloads": 384,
    "demoType": "sheet_preview",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-103",
    "name": "Google Sheets | NF: Hàm tách mail, sđt, họ, tên, tên đệm, ngày",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 109000,
    "originalPrice": 158000,
    "rating": 5.0,
    "downloads": 451,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-104",
    "name": "Google Sheets | Quản lý hồ sơ nhân sự",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Hồ sơ theo dõi thông tin nhân viên, phòng ban, quá trình công tác và biến động nhân sự nội bộ.",
    "price": 320000,
    "originalPrice": 464000,
    "rating": 4.8,
    "downloads": 518,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-105",
    "name": "Google Sheets | NF: Hàm bỏ dấu Tiếng Việt",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 149000,
    "originalPrice": 216000,
    "rating": 4.6,
    "downloads": 585,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-106",
    "name": "Google Sheets | NF: Hàm tìm kiếm nội dung chứa từ khoá",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 380000,
    "originalPrice": 551000,
    "rating": 4.9,
    "downloads": 652,
    "demoType": "sheet_preview",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-107",
    "name": "Google Sheets | Tạo ID không trùng lặp khi lựa chọn Dropdown",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Kỹ thuật tạo danh sách Dropdown phụ thuộc nhiều cấp độ (Tỉnh/Thành -> Quận/Huyện -> Phường/Xã).",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 719,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-108",
    "name": "Google Sheets | NF: Tạo ngày và thứ trong tháng",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | NF: Tạo ngày và thứ trong tháng.",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 786,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-109",
    "name": "Google Sheets | Báo cáo CRM (v3.0)",
    "type": "gsheet",
    "category": "CRM Bán hàng",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Báo cáo CRM (v3.0).",
    "price": 310000,
    "originalPrice": 449000,
    "rating": 4.8,
    "downloads": 853,
    "demoType": "sheet_preview",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-110",
    "name": "Google Sheets | NF: Hàm tải 1 sheet với nhiều định dạng",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 99000,
    "originalPrice": 143000,
    "rating": 4.6,
    "downloads": 920,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-111",
    "name": "Google Sheets | NF: Hàm chuyển văn bản thành hình ảnh",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 169000,
    "originalPrice": 245000,
    "rating": 4.9,
    "downloads": 987,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-112",
    "name": "Google Sheets | NF: Hàm chuyển văn bản thành gióng nói",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 139000,
    "originalPrice": 201000,
    "rating": 4.7,
    "downloads": 1054,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-113",
    "name": "Google Sheets | NF: Hàm đánh số thứ tự bỏ qua bộ lọc và blank",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 109000,
    "originalPrice": 158000,
    "rating": 5.0,
    "downloads": 1121,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-114",
    "name": "Google Sheets | NF: Hàm đọc số thành chữ",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 179000,
    "originalPrice": 259000,
    "rating": 4.8,
    "downloads": 1188,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-115",
    "name": "Google Sheets | Ứng dụng nhỏ học từ vựng Tiếng Anh",
    "type": "gsheet",
    "category": "Quản lý Lớp học",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Ứng dụng nhỏ học từ vựng Tiếng Anh.",
    "price": 149000,
    "originalPrice": 216000,
    "rating": 4.6,
    "downloads": 1255,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Học Sinh",
      "Họ và tên",
      "Lớp học",
      "Buổi học",
      "Tình trạng điểm danh",
      "Học phí",
      "Nhận xét của giáo viên"
    ]
  },
  {
    "id": "GS-116",
    "name": "Google Sheets | Theo dõi công việc (v6.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Theo dõi lịch công việc theo ngày giờ bằng bảng và lịch tháng; đánh dấu hoàn thành, liên kết tới nhiệm vụ, tìm từ khóa và lọc tháng/năm. Có hiển thị thứ và hỗ trợ nhiều ngôn ngữ.",
    "price": 330000,
    "originalPrice": 478000,
    "rating": 4.9,
    "downloads": 1322,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-117",
    "name": "Google Sheets | Theo dõi thói quen (v1.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Bảng theo dõi và hình thành thói quen tích cực mỗi ngày với đồ thị đo lường độ kiên trì.",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 1389,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-118",
    "name": "Google Sheets | Dịch và chuyển đổi văn bản thành giọng nói nhiều ngôn ngữ",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Dịch và chuyển đổi văn bản thành giọng nói nhiều ngôn ngữ.",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 1456,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-119",
    "name": "Google Sheets | Báo cáo bán hàng (v1.0)",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Báo cáo bán hàng (v1.0).",
    "price": 270000,
    "originalPrice": 391000,
    "rating": 4.8,
    "downloads": 1523,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-120",
    "name": "Google Sheets | Báo cáo bán hàng (v1.1)",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Báo cáo bán hàng (v1.1).",
    "price": 250000,
    "originalPrice": 362000,
    "rating": 4.6,
    "downloads": 1590,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-121",
    "name": "Google Sheets | Theo dõi thói quen (v3.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Theo dõi thói quen theo từng tháng, đánh dấu thực hiện và xem mức đạt mục tiêu; có biểu đồ ngày/tuần, tỷ lệ hoàn thành và danh sách thói quen nổi bật.",
    "price": 169000,
    "originalPrice": 245000,
    "rating": 4.9,
    "downloads": 1657,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-122",
    "name": "Google Sheets | Theo dõi nhân sự cơ bản",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Hồ sơ theo dõi thông tin nhân viên, phòng ban, quá trình công tác và biến động nhân sự nội bộ.",
    "price": 340000,
    "originalPrice": 493000,
    "rating": 4.7,
    "downloads": 1724,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-123",
    "name": "Google Sheets | Phiếu khảo sát đánh giá cho các phòng ban",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Phiếu khảo sát đánh giá cho các phòng ban.",
    "price": 109000,
    "originalPrice": 158000,
    "rating": 5.0,
    "downloads": 1791,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-124",
    "name": "Google Sheets | Quản lý thu chi (v2.0)",
    "type": "gsheet",
    "category": "Tài chính - Thu chi",
    "description": "Sổ nhật ký ghi chép các khoản thu tiền, chi tiền và kiểm soát số dư quỹ khả dụng của doanh nghiệp.",
    "price": 320000,
    "originalPrice": 464000,
    "rating": 4.8,
    "downloads": 1858,
    "demoType": "sheet_preview",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-125",
    "name": "Google Sheets | Quản lý thu chi (v2.1)",
    "type": "gsheet",
    "category": "Tài chính - Thu chi",
    "description": "Sổ nhật ký ghi chép các khoản thu tiền, chi tiền và kiểm soát số dư quỹ khả dụng của doanh nghiệp.",
    "price": 300000,
    "originalPrice": 435000,
    "rating": 4.6,
    "downloads": 1925,
    "demoType": "sheet_preview",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-126",
    "name": "Google Sheets | Quản lý thu chi (v1.0)",
    "type": "gsheet",
    "category": "Tài chính - Thu chi",
    "description": "Sổ nhật ký ghi chép các khoản thu tiền, chi tiền và kiểm soát số dư quỹ khả dụng của doanh nghiệp.",
    "price": 280000,
    "originalPrice": 406000,
    "rating": 4.9,
    "downloads": 1992,
    "demoType": "sheet_preview",
    "demoAppKey": "finance",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-127",
    "name": "Google Sheets | Facebook Ads Dashboard (ver02)",
    "type": "gsheet",
    "category": "CRM Bán hàng",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Facebook Ads Dashboard (ver02).",
    "price": 330000,
    "originalPrice": 478000,
    "rating": 4.7,
    "downloads": 2059,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-128",
    "name": "Google Sheets | Mẫu báo cáo chấm công cài sẵn công thức",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Bảng chấm công tự động tính công theo ca, ngày làm việc thực tế và chuyển sang bảng tính lương.",
    "price": 300000,
    "originalPrice": 435000,
    "rating": 5.0,
    "downloads": 2126,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-129",
    "name": "Google Sheets | Biểu đồ bong bóng",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Biểu đồ bong bóng.",
    "price": 129000,
    "originalPrice": 187000,
    "rating": 4.8,
    "downloads": 2193,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-130",
    "name": "Google Sheets | Báo cáo CRM (v1.0)",
    "type": "gsheet",
    "category": "CRM Bán hàng",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Báo cáo CRM (v1.0).",
    "price": 240000,
    "originalPrice": 348000,
    "rating": 4.6,
    "downloads": 2260,
    "demoType": "sheet_preview",
    "demoAppKey": "crm",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-131",
    "name": "Google Sheets | Quy trình bán hàng",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Quy trình bán hàng.",
    "price": 330000,
    "originalPrice": 478000,
    "rating": 4.9,
    "downloads": 2327,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-132",
    "name": "Google Sheets | Thời khoá biểu (v1.0)",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Lịch sắp xếp thời khóa biểu và lịch dạy cho giáo viên, học sinh theo ngày trong tuần.",
    "price": 310000,
    "originalPrice": 449000,
    "rating": 4.7,
    "downloads": 194,
    "demoType": "sheet_preview",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-133",
    "name": "Google Sheets | To do list",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | To do list.",
    "price": 290000,
    "originalPrice": 420000,
    "rating": 5.0,
    "downloads": 261,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-134",
    "name": "Google Sheets | Tổng hợp xe qua cửa khẩu",
    "type": "gsheet",
    "category": "Dịch vụ & Đặt chỗ",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tổng hợp xe qua cửa khẩu.",
    "price": 179000,
    "originalPrice": 259000,
    "rating": 4.8,
    "downloads": 328,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Booking",
      "Khách hàng",
      "Phòng / Thiết bị",
      "Giờ nhận",
      "Giờ trả",
      "Tiền cọc (VND)",
      "Tổng thanh toán"
    ]
  },
  {
    "id": "GS-135",
    "name": "Google Sheets | Tìm ngày đầu tuần và cuối tuần trong tháng",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tìm ngày đầu tuần và cuối tuần trong tháng.",
    "price": 149000,
    "originalPrice": 216000,
    "rating": 4.6,
    "downloads": 395,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-136",
    "name": "Google Sheets | Tạo ID ngẫu nhiên không trùng lặp",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tạo ID ngẫu nhiên không trùng lặp.",
    "price": 119000,
    "originalPrice": 172000,
    "rating": 4.9,
    "downloads": 462,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-137",
    "name": "Google Sheets | Tạo lịch 12 tháng chỉ với 1 công thức",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tạo lịch 12 tháng chỉ với 1 công thức.",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 529,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-138",
    "name": "Google Sheets | Tạo lịch 12 tháng theo chiều ngang",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tạo lịch 12 tháng theo chiều ngang.",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 596,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-139",
    "name": "Google Sheets | Check sim số đẹp 4 số cuối",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Công cụ hỗ trợ lọc, phân loại sim số đẹp theo đầu số, đuôi số và phong thủy.",
    "price": 129000,
    "originalPrice": 187000,
    "rating": 4.8,
    "downloads": 663,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-140",
    "name": "Google Sheets | Trộn thư bằng công thức Google Sheets",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Trộn thư bằng công thức Google Sheets.",
    "price": 99000,
    "originalPrice": 143000,
    "rating": 4.6,
    "downloads": 730,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-141",
    "name": "Google Sheets | Tách phường, quận, tỉnh/thành phố",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tách phường, quận, tỉnh/thành phố.",
    "price": 169000,
    "originalPrice": 245000,
    "rating": 4.9,
    "downloads": 797,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-142",
    "name": "Google Sheets | Dùng ký tự đặc biệt để vẽ biểu đồ",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Dùng ký tự đặc biệt để vẽ biểu đồ.",
    "price": 139000,
    "originalPrice": 201000,
    "rating": 4.7,
    "downloads": 864,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-143",
    "name": "Google Sheets | Lọc từ khoá",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Lọc từ khoá.",
    "price": 390000,
    "originalPrice": 565000,
    "rating": 5.0,
    "downloads": 931,
    "demoType": "sheet_preview",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-144",
    "name": "Google Sheets | Đọc số thành chữ nhiều ngôn ngữ",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Đọc số thành chữ nhiều ngôn ngữ.",
    "price": 179000,
    "originalPrice": 259000,
    "rating": 4.8,
    "downloads": 998,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-145",
    "name": "Google Sheets | Tính tổng chỉ tiêu theo chiều ngang",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tính tổng chỉ tiêu theo chiều ngang.",
    "price": 149000,
    "originalPrice": 216000,
    "rating": 4.6,
    "downloads": 1065,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-146",
    "name": "Google Sheets | Phân bổ khấu hao tài sản đường thẳng",
    "type": "gsheet",
    "category": "Tài chính - Thu chi",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Phân bổ khấu hao tài sản đường thẳng.",
    "price": 330000,
    "originalPrice": 478000,
    "rating": 4.9,
    "downloads": 1132,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-147",
    "name": "Google Sheets | Đảo ký tự với char(8238)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Đảo ký tự với char(8238).",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 1199,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-148",
    "name": "Google Sheets | Tổng hợp dữ liệu từ nhiều file, nhiều sheet khác nhau",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tổng hợp dữ liệu từ nhiều file, nhiều sheet khác nhau.",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 1266,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-149",
    "name": "Google Sheets | Hiển thị hình ảnh lưu trong drive",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Hiển thị hình ảnh lưu trong drive.",
    "price": 129000,
    "originalPrice": 187000,
    "rating": 4.8,
    "downloads": 1333,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-150",
    "name": "Google Sheets | Gửi Mail Cá Nhân Hoá Bằng Công Thức (v2.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Gửi Mail Cá Nhân Hoá Bằng Công Thức (v2.0).",
    "price": 99000,
    "originalPrice": 143000,
    "rating": 4.6,
    "downloads": 1400,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-151",
    "name": "Google Sheets | Phân nhóm ngẫu nhiên và không ngẫu nhiên",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Phân nhóm ngẫu nhiên và không ngẫu nhiên.",
    "price": 169000,
    "originalPrice": 245000,
    "rating": 4.9,
    "downloads": 1467,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-152",
    "name": "Google Sheets | Tách họ và tên với Regex",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tách họ và tên với Regex.",
    "price": 139000,
    "originalPrice": 201000,
    "rating": 4.7,
    "downloads": 1534,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-153",
    "name": "Google Sheets | Pivot nhiều giá trị chuỗi",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Pivot nhiều giá trị chuỗi.",
    "price": 109000,
    "originalPrice": 158000,
    "rating": 5.0,
    "downloads": 1601,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-154",
    "name": "Google Sheets | Unpivot",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Unpivot.",
    "price": 179000,
    "originalPrice": 259000,
    "rating": 4.8,
    "downloads": 1668,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-155",
    "name": "Google Sheets | Cộng dồn nhiều điều kiện",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Cộng dồn nhiều điều kiện.",
    "price": 149000,
    "originalPrice": 216000,
    "rating": 4.6,
    "downloads": 1735,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-156",
    "name": "Google Sheets | Tìm dòng cuối chứa dữ liệu",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tìm dòng cuối chứa dữ liệu.",
    "price": 119000,
    "originalPrice": 172000,
    "rating": 4.9,
    "downloads": 1802,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-157",
    "name": "Google Sheets | Rút gọn họ và tên",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Rút gọn họ và tên.",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 1869,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-158",
    "name": "Google Sheets | Làm sạch số điện thoại",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Làm sạch số điện thoại.",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 1936,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-159",
    "name": "Google Sheets | Tổng hợp các sắc thái đánh số thứ tự",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tổng hợp các sắc thái đánh số thứ tự.",
    "price": 129000,
    "originalPrice": 187000,
    "rating": 4.8,
    "downloads": 2003,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-160",
    "name": "Google Sheets | Loại bỏ dấu câu",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Loại bỏ dấu câu.",
    "price": 99000,
    "originalPrice": 143000,
    "rating": 4.6,
    "downloads": 2070,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-161",
    "name": "Google Sheets | Lấp đầy dữ liệu",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Lấp đầy dữ liệu.",
    "price": 169000,
    "originalPrice": 245000,
    "rating": 4.9,
    "downloads": 2137,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-162",
    "name": "Google Sheets | Dịch song song tất cả các ngôn ngữ trên thế giới",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Dịch song song tất cả các ngôn ngữ trên thế giới.",
    "price": 139000,
    "originalPrice": 201000,
    "rating": 4.7,
    "downloads": 2204,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-163",
    "name": "Google Sheets | Tạo next page bằng hàm query kết hợp Hyperlink",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 109000,
    "originalPrice": 158000,
    "rating": 5.0,
    "downloads": 2271,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-164",
    "name": "Google Sheets | Importrange lấy theo Tên tiêu đề cột",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Importrange lấy theo Tên tiêu đề cột.",
    "price": 179000,
    "originalPrice": 259000,
    "rating": 4.8,
    "downloads": 2338,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-165",
    "name": "Google Sheets | Tạo list phụ thuộc nhiều cấp độ không dùng code",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tạo list phụ thuộc nhiều cấp độ không dùng code.",
    "price": 149000,
    "originalPrice": 216000,
    "rating": 4.6,
    "downloads": 205,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-166",
    "name": "Google Sheets | Đọc số thành chữ",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Đọc số thành chữ.",
    "price": 119000,
    "originalPrice": 172000,
    "rating": 4.9,
    "downloads": 272,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-167",
    "name": "Google Sheets | Tổng hợp dữ liệu từ nhiều Sheet về một Sheet",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tổng hợp dữ liệu từ nhiều Sheet về một Sheet.",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 339,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-168",
    "name": "Google Sheets | Quản lý phân quyền file tập trung",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Quản lý phân quyền file tập trung.",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 406,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-169",
    "name": "Google Sheets | Điểm danh học sinh (v2.0)",
    "type": "gsheet",
    "category": "Quản lý Lớp học",
    "description": "Mẫu điểm danh học sinh, sinh viên theo từng buổi học và thông báo vắng cho phụ huynh.",
    "price": 129000,
    "originalPrice": 187000,
    "rating": 4.8,
    "downloads": 473,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Học Sinh",
      "Họ và tên",
      "Lớp học",
      "Buổi học",
      "Tình trạng điểm danh",
      "Học phí",
      "Nhận xét của giáo viên"
    ]
  },
  {
    "id": "GS-170",
    "name": "Google Sheets | Backup data nhiều file",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Backup data nhiều file.",
    "price": 99000,
    "originalPrice": 143000,
    "rating": 4.6,
    "downloads": 540,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-171",
    "name": "Google Sheets | Theo dõi công việc (v2.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Mẫu theo dõi tiến độ nhiệm vụ, phân công nhân sự, nhắc hạn chót và thống kê tỷ lệ hoàn thành dự án.",
    "price": 280000,
    "originalPrice": 406000,
    "rating": 4.9,
    "downloads": 607,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-172",
    "name": "Google Sheets | Tìm kiếm nhà bán bất động sản",
    "type": "gsheet",
    "category": "CRM Bán hàng",
    "description": "Bảng quản lý bảng hàng, giỏ hàng căn hộ, tiến độ đặt cọc và hoa hồng môi giới bất động sản.",
    "price": 240000,
    "originalPrice": 348000,
    "rating": 4.7,
    "downloads": 674,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-173",
    "name": "Google Sheets | Phân quyền nhập liệu nhiều Form từ nhiều file (v1.1)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Phân quyền nhập liệu nhiều Form từ nhiều file (v1.1).",
    "price": 109000,
    "originalPrice": 158000,
    "rating": 5.0,
    "downloads": 741,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-174",
    "name": "Google Sheets | Bảng chấm công (v3.0)",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Bảng chấm công ghi giờ vào/ra và các trạng thái nghỉ, công tác, đi muộn; tích hợp phiếu lương và tính bằng công thức mảng. Có cấu hình nhân sự, phòng ban, phép và sao chép sheet cho tháng mới.",
    "price": 320000,
    "originalPrice": 464000,
    "rating": 4.8,
    "downloads": 808,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-175",
    "name": "Google Sheets | Theo dõi công việc (v4.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Mẫu theo dõi tiến độ nhiệm vụ, phân công nhân sự, nhắc hạn chót và thống kê tỷ lệ hoàn thành dự án.",
    "price": 350000,
    "originalPrice": 507000,
    "rating": 4.6,
    "downloads": 875,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-176",
    "name": "Google Sheets | Theo dõi ăn trưa công sở",
    "type": "gsheet",
    "category": "F&B Nhà hàng",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Theo dõi ăn trưa công sở.",
    "price": 260000,
    "originalPrice": 377000,
    "rating": 4.9,
    "downloads": 942,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Món",
      "Tên đồ ăn / đồ uống",
      "Danh mục",
      "Đơn giá (VND)",
      "Định mức nguyên liệu",
      "Tình trạng phục vụ"
    ]
  },
  {
    "id": "GS-177",
    "name": "Google Sheets | Đồng bộ calandar với Google Sheets",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Đồng bộ calandar với Google Sheets.",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 1009,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-178",
    "name": "Google Sheets | Import Data nhiều FILE tốc độ siêu nhanh (v2.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Giải pháp tự động liên kết và tổng hợp dữ liệu từ nhiều file Google Sheets về một bảng tính trung tâm.",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 1076,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-179",
    "name": "Google Sheets | Điểm danh học sinh (v1.0)",
    "type": "gsheet",
    "category": "Quản lý Lớp học",
    "description": "Mẫu điểm danh học sinh, sinh viên theo từng buổi học và thông báo vắng cho phụ huynh.",
    "price": 129000,
    "originalPrice": 187000,
    "rating": 4.8,
    "downloads": 1143,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Học Sinh",
      "Họ và tên",
      "Lớp học",
      "Buổi học",
      "Tình trạng điểm danh",
      "Học phí",
      "Nhận xét của giáo viên"
    ]
  },
  {
    "id": "GS-180",
    "name": "Google Sheets | Import Data nhiều FILE tốc độ siêu nhanh (v1.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Giải pháp tự động liên kết và tổng hợp dữ liệu từ nhiều file Google Sheets về một bảng tính trung tâm.",
    "price": 99000,
    "originalPrice": 143000,
    "rating": 4.6,
    "downloads": 1210,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-181",
    "name": "Google Sheets | Import Data nhiều FILE tốc độ siêu nhanh (v3.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Giải pháp tự động liên kết và tổng hợp dữ liệu từ nhiều file Google Sheets về một bảng tính trung tâm.",
    "price": 169000,
    "originalPrice": 245000,
    "rating": 4.9,
    "downloads": 1277,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-182",
    "name": "Google Sheets | Lọc số sim",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Công cụ hỗ trợ lọc, phân loại sim số đẹp theo đầu số, đuôi số và phong thủy.",
    "price": 139000,
    "originalPrice": 201000,
    "rating": 4.7,
    "downloads": 1344,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-183",
    "name": "Google Sheets | Báo cáo Nhập Xuất Tồn (v3.0)",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Báo cáo tổng hợp số lượng nhập, xuất và tồn kho hàng hóa chi tiết theo thời gian thực và giá vốn bình quân.",
    "price": 340000,
    "originalPrice": 493000,
    "rating": 5.0,
    "downloads": 1411,
    "demoType": "sheet_preview",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-184",
    "name": "Google Sheets | Báo cáo Nhập Xuất Tồn (v1.0)",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Báo cáo tổng hợp số lượng nhập, xuất và tồn kho hàng hóa chi tiết theo thời gian thực và giá vốn bình quân.",
    "price": 320000,
    "originalPrice": 464000,
    "rating": 4.8,
    "downloads": 1478,
    "demoType": "sheet_preview",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-185",
    "name": "Google Sheets | Bảng chấm công (v2.0)",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Bảng công ba ca sáng/chiều/tối, nhập giờ linh hoạt và tính giờ chính/tăng ca bằng công thức mảng; cấu hình trạng thái nghỉ, phòng ban, chức vụ và nhân sự theo tháng.",
    "price": 270000,
    "originalPrice": 391000,
    "rating": 4.6,
    "downloads": 1545,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-186",
    "name": "Google Sheets | Báo cáo doanh thu (v2.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Bảng tính theo dõi doanh thu bán hàng, phân tích xu hướng tăng trưởng và đóng góp của từng kênh kinh doanh.",
    "price": 119000,
    "originalPrice": 172000,
    "rating": 4.9,
    "downloads": 1612,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-187",
    "name": "Google Sheets | Bảng chấm công (v1.0)",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Bảng công hai ca sáng/chiều với các trạng thái phép, nghỉ không lương, thai sản, công tác, đi muộn/về sớm; dùng công thức mảng và cấu hình nhân sự, phòng ban theo tháng.",
    "price": 350000,
    "originalPrice": 507000,
    "rating": 4.7,
    "downloads": 1679,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-188",
    "name": "Google Sheets | Quy trình tuyển dụng giản đơn",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Quy trình theo dõi ứng viên từ tiếp nhận CV, phỏng vấn đến đánh giá thử việc theo từng vị trí.",
    "price": 320000,
    "originalPrice": 464000,
    "rating": 5.0,
    "downloads": 1746,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-189",
    "name": "Google Sheets | Quản lý chi tiêu 6 hũ (v1.0)",
    "type": "gsheet",
    "category": "Tài chính - Thu chi",
    "description": "Mô hình quản lý tài chính cá nhân và phân bổ ngân sách thu nhập theo phương pháp 6 chiếc hũ thông minh.",
    "price": 370000,
    "originalPrice": 536000,
    "rating": 4.8,
    "downloads": 1813,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-190",
    "name": "Google Sheets | Quản lý chi tiêu 6 hũ (v2.0)",
    "type": "gsheet",
    "category": "Tài chính - Thu chi",
    "description": "Mô hình quản lý tài chính cá nhân và phân bổ ngân sách thu nhập theo phương pháp 6 chiếc hũ thông minh.",
    "price": 350000,
    "originalPrice": 507000,
    "rating": 4.6,
    "downloads": 1880,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-191",
    "name": "Google Sheets | Theo dõi thói quen (v2.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Bảng theo dõi và hình thành thói quen tích cực mỗi ngày với đồ thị đo lường độ kiên trì.",
    "price": 169000,
    "originalPrice": 245000,
    "rating": 4.9,
    "downloads": 1947,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-192",
    "name": "Google Sheets | Ghi chú thời gian biểu",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Ghi chú thời gian biểu.",
    "price": 139000,
    "originalPrice": 201000,
    "rating": 4.7,
    "downloads": 2014,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-193",
    "name": "Google Sheets | Thời khoá biểu (v2.0)",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Lịch sắp xếp thời khóa biểu và lịch dạy cho giáo viên, học sinh theo ngày trong tuần.",
    "price": 290000,
    "originalPrice": 420000,
    "rating": 5.0,
    "downloads": 2081,
    "demoType": "sheet_preview",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-194",
    "name": "Google Sheets | Gửi Mail Cá Nhân Hoá Bằng Công Thức (v1.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Gửi Mail Cá Nhân Hoá Bằng Công Thức (v1.0).",
    "price": 179000,
    "originalPrice": 259000,
    "rating": 4.8,
    "downloads": 2148,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-195",
    "name": "Google Sheets | Tạo card visit",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tạo card visit.",
    "price": 149000,
    "originalPrice": 216000,
    "rating": 4.6,
    "downloads": 2215,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-196",
    "name": "Google Sheets | Phiếu tính giá, check căn (v2.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Phiếu tính giá, check căn (v2.0).",
    "price": 119000,
    "originalPrice": 172000,
    "rating": 4.9,
    "downloads": 2282,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-197",
    "name": "Google Sheets | Theo dõi công việc (v1.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Mẫu theo dõi tiến độ nhiệm vụ, phân công nhân sự, nhắc hạn chót và thống kê tỷ lệ hoàn thành dự án.",
    "price": 360000,
    "originalPrice": 522000,
    "rating": 4.7,
    "downloads": 2349,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-198",
    "name": "Google Sheets | Phiếu tính giá, check căn (v1.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Phiếu tính giá, check căn (v1.0).",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 216,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-199",
    "name": "Google Sheets | Tìm kiếm mã số thuế",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tìm kiếm mã số thuế.",
    "price": 129000,
    "originalPrice": 187000,
    "rating": 4.8,
    "downloads": 283,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-200",
    "name": "Google Sheets | Form nhập liệu",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Form nhập liệu.",
    "price": 99000,
    "originalPrice": 143000,
    "rating": 4.6,
    "downloads": 350,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-201",
    "name": "Google Sheets | Theo dõi công việc (v3.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Mẫu theo dõi tiến độ nhiệm vụ, phân công nhân sự, nhắc hạn chót và thống kê tỷ lệ hoàn thành dự án.",
    "price": 280000,
    "originalPrice": 406000,
    "rating": 4.9,
    "downloads": 417,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-202",
    "name": "Google Sheets | Sơ đồ Gantt (v1.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Biểu đồ tiến độ Gantt Chart giúp trực quan hóa các giai đoạn thực hiện dự án theo tuần và tháng.",
    "price": 260000,
    "originalPrice": 377000,
    "rating": 4.7,
    "downloads": 484,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-203",
    "name": "Google Sheets | Báo cáo biến động nhân sự (v1.0)",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Hồ sơ theo dõi thông tin nhân viên, phòng ban, quá trình công tác và biến động nhân sự nội bộ.",
    "price": 290000,
    "originalPrice": 420000,
    "rating": 5.0,
    "downloads": 551,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-204",
    "name": "Google Sheets | Quản Lý Tuyển Dụng",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Quy trình theo dõi ứng viên từ tiếp nhận CV, phỏng vấn đến đánh giá thử việc theo từng vị trí.",
    "price": 260000,
    "originalPrice": 377000,
    "rating": 4.8,
    "downloads": 618,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-205",
    "name": "Google Sheets | Cách phối màu cho Google Sheets",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Cách phối màu cho Google Sheets.",
    "price": 149000,
    "originalPrice": 216000,
    "rating": 4.6,
    "downloads": 685,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-206",
    "name": "Google Sheets | Hàm Query và Importrange – Hàm truy vấn dữ liệu top 1",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 119000,
    "originalPrice": 172000,
    "rating": 4.9,
    "downloads": 752,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-207",
    "name": "Google Sheets | Tài nguyên hàm Regex – Hàm xử lý dữ liệu mạnh nhất",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 819,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-208",
    "name": "Google Sheets | Đổi lịch âm sang dương (code)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Đổi lịch âm sang dương (code).",
    "price": 159000,
    "originalPrice": 230000,
    "rating": 5.0,
    "downloads": 886,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-209",
    "name": "Google Sheets | Đóng băng các hàm không cố định",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Tập hợp công thức hàm tự động hóa xử lý chuỗi ký tự, tách dữ liệu và làm sạch bảng tính nhanh chóng.",
    "price": 129000,
    "originalPrice": 187000,
    "rating": 4.8,
    "downloads": 953,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-210",
    "name": "Google Sheets | Tìm giá trị trả về tiêu đề tương ứng",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tìm giá trị trả về tiêu đề tương ứng.",
    "price": 99000,
    "originalPrice": 143000,
    "rating": 4.6,
    "downloads": 1020,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-211",
    "name": "Google Sheets | Khoá dữ liệu loại trừ (code)",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Khoá dữ liệu loại trừ (code).",
    "price": 380000,
    "originalPrice": 551000,
    "rating": 4.9,
    "downloads": 1087,
    "demoType": "sheet_preview",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-212",
    "name": "Google Sheets | Cách tải 1 sheet từ Google Sheets",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Cách tải 1 sheet từ Google Sheets.",
    "price": 139000,
    "originalPrice": 201000,
    "rating": 4.7,
    "downloads": 1154,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-213",
    "name": "Google Sheets | Tạo bản sao nhiều thư mục Driver",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tạo bản sao nhiều thư mục Driver.",
    "price": 109000,
    "originalPrice": 158000,
    "rating": 5.0,
    "downloads": 1221,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-214",
    "name": "Google Sheets | Báo cáo chi phí",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Báo cáo chi phí.",
    "price": 179000,
    "originalPrice": 259000,
    "rating": 4.8,
    "downloads": 1288,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-215",
    "name": "Google Sheets | Báo cáo biến động nhân sự (v1.1)",
    "type": "gsheet",
    "category": "Nhân sự & Tiền lương",
    "description": "Hồ sơ theo dõi thông tin nhân viên, phòng ban, quá trình công tác và biến động nhân sự nội bộ.",
    "price": 350000,
    "originalPrice": 507000,
    "rating": 4.6,
    "downloads": 1355,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã NV",
      "Họ và tên",
      "Phòng ban",
      "Chức vụ",
      "Số công thực tế",
      "Lương cơ bản",
      "Thưởng KPI",
      "Thực lĩnh"
    ]
  },
  {
    "id": "GS-216",
    "name": "Google Sheets | Báo cáo doanh thu (v1.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Bảng tính theo dõi doanh thu bán hàng, phân tích xu hướng tăng trưởng và đóng góp của từng kênh kinh doanh.",
    "price": 119000,
    "originalPrice": 172000,
    "rating": 4.9,
    "downloads": 1422,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-217",
    "name": "Google Sheets | Báo cáo doanh thu (v4.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Bảng tính theo dõi doanh thu bán hàng, phân tích xu hướng tăng trưởng và đóng góp của từng kênh kinh doanh.",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 1489,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-218",
    "name": "Google Sheets | Theo dõi công việc (v5.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Mẫu theo dõi tiến độ nhiệm vụ, phân công nhân sự, nhắc hạn chót và thống kê tỷ lệ hoàn thành dự án.",
    "price": 390000,
    "originalPrice": 565000,
    "rating": 5.0,
    "downloads": 1556,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-219",
    "name": "Google Sheets | Báo cáo Nhập Xuất Tồn (v2.0)",
    "type": "gsheet",
    "category": "Kho & Bán lẻ",
    "description": "Báo cáo tổng hợp số lượng nhập, xuất và tồn kho hàng hóa chi tiết theo thời gian thực và giá vốn bình quân.",
    "price": 370000,
    "originalPrice": 536000,
    "rating": 4.8,
    "downloads": 1623,
    "demoType": "sheet_preview",
    "demoAppKey": "warehouse",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã SKU",
      "Tên sản phẩm",
      "Đơn vị tính",
      "Tồn đầu kỳ",
      "Nhập trong kỳ",
      "Xuất trong kỳ",
      "Tồn cuối kỳ",
      "Cảnh báo Min"
    ]
  },
  {
    "id": "GS-220",
    "name": "Google Sheets | Tính ngày kết thúc phí trung tâm tiếng anh",
    "type": "gsheet",
    "category": "Quản lý Lớp học",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Tính ngày kết thúc phí trung tâm tiếng anh.",
    "price": 99000,
    "originalPrice": 143000,
    "rating": 4.6,
    "downloads": 1690,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Học Sinh",
      "Họ và tên",
      "Lớp học",
      "Buổi học",
      "Tình trạng điểm danh",
      "Học phí",
      "Nhận xét của giáo viên"
    ]
  },
  {
    "id": "GS-221",
    "name": "Google Sheets | Quản lý chi tiêu cơ bản",
    "type": "gsheet",
    "category": "Tài chính - Thu chi",
    "description": "Mẫu bảng tính chuyên nghiệp giúp tự động hóa và nâng cao hiệu suất cho phân hệ Google Sheets | Quản lý chi tiêu cơ bản.",
    "price": 330000,
    "originalPrice": 478000,
    "rating": 4.9,
    "downloads": 1757,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã GD",
      "Ngày tháng",
      "Hạng mục thu/chi",
      "Số tiền (VND)",
      "Tài khoản nguồn",
      "Dự án / Phòng ban",
      "Ghi chú"
    ]
  },
  {
    "id": "GS-222",
    "name": "Google Sheets | Báo cáo chạy quảng cáo",
    "type": "gsheet",
    "category": "CRM Bán hàng",
    "description": "Dashboard tổng hợp số liệu chiến dịch chạy Ads, chi phí trên mỗi chuyển đổi (CPA) và doanh thu mang lại.",
    "price": 280000,
    "originalPrice": 406000,
    "rating": 4.7,
    "downloads": 1824,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Khách Hàng",
      "Tên công ty / Cá nhân",
      "Người đại diện",
      "Số điện thoại",
      "Giá trị Deal",
      "Giai đoạn phễu",
      "Ngày hẹn gọi lại"
    ]
  },
  {
    "id": "GS-223",
    "name": "Google Sheets | Dropdown phụ thuộc 4 level (code)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Kỹ thuật tạo danh sách Dropdown phụ thuộc nhiều cấp độ (Tỉnh/Thành -> Quận/Huyện -> Phường/Xã).",
    "price": 109000,
    "originalPrice": 158000,
    "rating": 5.0,
    "downloads": 1891,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-224",
    "name": "Google Sheets | Dropdown phụ thuộc 3 level (code)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Kỹ thuật tạo danh sách Dropdown phụ thuộc nhiều cấp độ (Tỉnh/Thành -> Quận/Huyện -> Phường/Xã).",
    "price": 179000,
    "originalPrice": 259000,
    "rating": 4.8,
    "downloads": 1958,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-225",
    "name": "Google Sheets | Dropdown phụ thuộc 2 level (code)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Kỹ thuật tạo danh sách Dropdown phụ thuộc nhiều cấp độ (Tỉnh/Thành -> Quận/Huyện -> Phường/Xã).",
    "price": 149000,
    "originalPrice": 216000,
    "rating": 4.6,
    "downloads": 2025,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-226",
    "name": "Google Sheets | Import Data nhiều FILE tốc độ siêu nhanh (v4.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Giải pháp tự động liên kết và tổng hợp dữ liệu từ nhiều file Google Sheets về một bảng tính trung tâm.",
    "price": 119000,
    "originalPrice": 172000,
    "rating": 4.9,
    "downloads": 2092,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-227",
    "name": "Google Sheets | Báo cáo công nợ",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Dashboard theo dõi công nợ cho lĩnh vực công nghệ, được nguồn mô tả là xây hoàn toàn bằng công thức.",
    "price": 189000,
    "originalPrice": 274000,
    "rating": 4.7,
    "downloads": 2159,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  },
  {
    "id": "GS-228",
    "name": "Google Sheets | Sơ đồ Gantt (v2.0)",
    "type": "gsheet",
    "category": "Dự án & Công việc",
    "description": "Biểu đồ tiến độ Gantt Chart giúp trực quan hóa các giai đoạn thực hiện dự án theo tuần và tháng.",
    "price": 340000,
    "originalPrice": 493000,
    "rating": 5.0,
    "downloads": 2226,
    "demoType": "sheet_preview",
    "demoAppKey": "tasks",
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "Mã Task",
      "Tên công việc",
      "Người phụ trách",
      "Ngày bắt đầu",
      "Hạn chót (Deadline)",
      "Tiến độ %",
      "Trạng thái"
    ]
  },
  {
    "id": "GS-229",
    "name": "Google Sheets | Báo cáo doanh thu (v3.0)",
    "type": "gsheet",
    "category": "Tiện ích Sheet",
    "description": "Bảng tính theo dõi doanh thu bán hàng, phân tích xu hướng tăng trưởng và đóng góp của từng kênh kinh doanh.",
    "price": 129000,
    "originalPrice": 187000,
    "rating": 4.8,
    "downloads": 2293,
    "demoType": "sheet_preview",
    "demoAppKey": null,
    "features": [
      "Tự động hóa 100% bằng công thức mảng tối ưu",
      "Giao diện trực quan, tương thích máy tính & điện thoại",
      "Kèm video hướng dẫn chi tiết và file thực hành mẫu",
      "Hỗ trợ kỹ thuật và bảo hành bản quyền trọn đời"
    ],
    "sheetColumns": [
      "STT",
      "Dữ liệu đầu vào",
      "Công thức xử lý",
      "Kết quả chuẩn hóa",
      "Trạng thái kiểm tra"
    ]
  }
];
