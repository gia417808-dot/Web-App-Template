# Bàn giao hiện tại
Mốc: Hiện tại. Đang triển khai tự động các phân hệ còn lại trên nhánh `feat/complete-remaining-system`.
Đã hoàn thành thêm phân hệ: **NS03 (Nghỉ phép)**.

**Các công việc đã thực hiện cho NS03:**
- Schema `SoDuPhep` và `DonNghi` (024_ns03.sql).
- Cỗ máy trạng thái `DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` | `REJECTED`, `APPROVED` ➔ `CANCELED`.
- Logic duyệt đơn nghỉ phép: Trừ đi số phép còn lại (chỉ tính vào cột `phep_da_duyet`). Báo lỗi `NS03Error` nếu không đủ số dư.
- Logic hủy đơn: Hoàn trả số phép (giảm `phep_da_duyet`).
- Bổ sung Tab "Nghỉ phép (NS03)" vào UI.
- Workbook engine: `NS03_3.0.0-vi.xlsx`.
- Vượt qua `verify_project.py` và các tests. Đã checkpoint rpa.

**Các module đã tự động xử lý trong lượt này:**
- KT03, KT04, KT05, NS01, NS02, NS03
