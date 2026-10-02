# Bàn giao hiện tại
Mốc: Hiện tại. Đang triển khai tự động các phân hệ còn lại trên nhánh `feat/complete-remaining-system`.
Đã hoàn thành thêm phân hệ: **SX05 (Giá thành lệnh)**.

**Các công việc đã thực hiện cho SX05:**
- Schema `LenhSanXuat` (thêm chi phí, giá thành, trạng thái) và `ChiPhiSX` (031_sx05.sql).
- Cỗ máy trạng thái `DRAFT` ➔ `CALCULATED` ➔ `LOCKED` cho giá thành lệnh.
- Logic tính toán: Giá thành đơn vị = Tổng chi phí (APPROVED) / Lượng đạt. Chặn khóa nếu tổng chi phí <= 0.
- Bổ sung Tab "Giá thành (SX05)" vào UI.
- Workbook engine: `SX05_3.0.0-vi.xlsx`.
- Vượt qua `verify_project.py` và các tests. Đã checkpoint rpa.

**Các module đã tự động xử lý trong lượt này:**
- KT03, KT04, KT05, NS01, NS02, NS03, NS04, NS05, SX02, SX01, SX03, SX04, SX05
