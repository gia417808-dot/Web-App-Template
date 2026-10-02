# Bàn giao hiện tại
Mốc: Hiện tại. Đang triển khai tự động các phân hệ còn lại trên nhánh `feat/complete-remaining-system`.
Đã hoàn thành thêm phân hệ: **KT03 (Công nợ phải trả)**.

**Các công việc đã thực hiện cho KT03:**
- Schema `NhaCungCap`, `PhaiTra`, `ThanhToanPhaiTra` (019_kt03.sql).
- Cỗ máy trạng thái `OPEN` ➔ `PARTIALLY_PAID` ➔ `SETTLED` (và `OVERPAID`).
- Logic đối soát chi (tính tổng đã thanh toán, tính lại dư nợ, đổi trạng thái nếu chi dư).
- Bổ sung Tab "Công nợ phải trả (KT03)" vào UI.
- Workbook engine: `KT03_3.0.0-vi.xlsx`.
- Vượt qua `verify_project.py` và các tests. Đã checkpoint rpa.

**Các module đã tự động xử lý trong lượt này:**
- KT03
