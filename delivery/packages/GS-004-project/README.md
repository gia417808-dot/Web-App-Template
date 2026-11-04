# GS-004 — Hệ Thống Quản Lý Dự Án, Khách Hàng CRM, Giao Việc Kanban/Gantt, Đa Bộ Phận RACI & Bot Nhắc Việc (v4.4 Commercial Pro)

## Điểm nổi bật
- **Phiên bản**: `v4.4 Commercial Pro` (Chuẩn Golden Master)
- **Số bảng dữ liệu tự động khởi tạo**: `7 Sheets`
- **Tính năng cốt lõi**: Phân quyền đa tầng (ADMIN/MANAGER/LEADER/CRM_SALE/STAFF), Mô hình đa bộ phận RACI + Checklist, Upload đa file (Word/Excel/PPT/PDF), Tiến độ 100% tự động Chờ duyệt & Bot Nhắc việc Email/Zalo

## Cấu trúc 4 File Chuẩn Google Apps Script
1. `appsscript.json`: Cấu hình Manifest & OAuth Scopes chuẩn V8 Runtime.
2. `installer.gs`: Script tự động khởi tạo toàn bộ cấu trúc bảng tính, định dạng màu sắc và nạp dữ liệu mẫu thực tế.
3. `Code.gs`: Backend API xử lý nghiệp vụ có khóa chống ghi đè (`LockService`), tự động mở rộng cột và fallback an toàn.
4. `Index.html`: Giao diện Single-Page Web App (Responsive Mobile-First + Full-Screen Mode + Phân quyền RBAC).

## Hướng dẫn Triển khai Nhanh
1. Mở Google Sheets mới ➔ Chọn **Tiện ích mở rộng (Extensions)** ➔ **Apps Script**.
2. Copy nội dung 4 file (`appsscript.json`, `installer.gs`, `Code.gs`, `Index.html`) vào dự án Apps Script (hoặc đẩy bằng lệnh `clasp push`).
3. Chạy hàm khởi tạo trong `installer.gs` để tạo tự động toàn bộ các Sheet.
4. Bấm **Triển khai (Deploy)** ➔ **Tùy chọn triển khai mới (New deployment)** ➔ **Ứng dụng web (Web app)** ➔ Quyền truy cập: **Bất kỳ ai (Anyone)**.
