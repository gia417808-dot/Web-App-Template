# GS-002 — Hệ Thống Quản Lý Nhập Xuất Tồn Đa Kho, Cảnh Báo Tồn Tối Thiểu & In Phiếu Kho A4 (v3.0 Commercial Pro)

## Điểm nổi bật
- **Phiên bản**: `v3.0 Commercial Pro` (Chuẩn Golden Master)
- **Số bảng dữ liệu tự động khởi tạo**: `7 Sheets`
- **Tính năng cốt lõi**: Cổng đăng nhập bắt buộc (Auth Gate), Quản lý đa kho, Nhập/Xuất/Chuyển kho, Thẻ kho thông minh, Cảnh báo dưới định mức & In phiếu Nhập/Xuất chuẩn A4

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
