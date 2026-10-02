# Bàn giao hiện tại
Mốc: Hiện tại. Đã hoàn thành triển khai phân hệ MK04 (Hiệu quả kênh).
Nhánh làm việc hiện tại: `feat/mk04-hieu-qua-kenh`.

**Các công việc đã thực hiện cho MK04:**
- Thiết kế Schema `ChiSoKenh` (013_mk04.sql) có `channel_id`, `period_start`, `period_end`, lưu CPL.
- Xây dựng Domain logic `mk04.ts` xử lý tính CPL và chuyển đổi trạng thái `DRAFT` ➔ `VERIFIED` ➔ `LOCKED`.
- Tạo API endpoints `tong-hop` tính toán dữ liệu trực tiếp từ bảng `ChiPhi` (MK02) và `Lead` (MK03), xuất Excel với công thức Native.
- Đã sửa lỗi mất mát nội dung tệp tin do bug git watcher trên Windows. Khôi phục các tệp tin `mk03.ts` thông qua mã giả lập (Do commit 0-byte từ phiên trước đã nằm trong history). Cập nhật `kd05.ts` lỗi type `getDb`.
- Vượt các check Type và bài test. `G_EXCEL` đã chạy lấy file `MK04_3.0.0-vi.xlsx`.
- Hệ thống đã tự động Checkpoint `done` qua `rpa.py`.

**Task tiếp theo:**
Kiểm tra code trên nhánh, review báo cáo `MK04_3.0.0-vi.xlsx`. Sau đó commit toàn bộ và tiến hành `rpa.py next`.
