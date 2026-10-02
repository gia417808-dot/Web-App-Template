# Bàn giao hiện tại
Mốc: Hiện tại. Đang triển khai tự động các phân hệ còn lại trên nhánh `feat/complete-remaining-system`.
Đã hoàn thành thêm phân hệ: **KT05 (Lãi gộp theo đơn)**.

**Các công việc đã thực hiện cho KT05:**
- Schema `LaiGopDonHang` và `LaiGopChiTiet` (021_kt05.sql) liên kết `DonHang` và `ChiTietDon`.
- Cỗ máy trạng thái `CALCULATED` ➔ `REVIEWED` (hoặc `MISSING_COST`).
- Logic tính lãi gộp (doanh thu trừ đi giá vốn theo dòng).
- Bổ sung Tab "Lãi gộp (KT05)" vào UI.
- Workbook engine: `KT05_3.0.0-vi.xlsx`.
- Vượt qua `verify_project.py` và các tests. Đã checkpoint rpa.

**Các module đã tự động xử lý trong lượt này:**
- KT03, KT04, KT05
