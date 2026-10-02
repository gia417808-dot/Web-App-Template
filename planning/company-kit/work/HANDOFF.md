# Bàn giao hiện tại
Mốc: Hiện tại. Đang triển khai tự động các phân hệ còn lại trên nhánh `feat/complete-remaining-system`.
Đã hoàn thành thêm phân hệ: **KT02 (Công nợ phải thu)**.

**Các công việc đã thực hiện cho KT02:**
- Schema `PhaiThu`, `ThanhToanPhaiThu` (018_kt02.sql).
- Cỗ máy trạng thái `OPEN` ➔ `PARTIALLY_PAID` ➔ `SETTLED` (và `OVERPAID`).
- Logic đối soát thu (tính tổng đã thanh toán, tính lại dư nợ, đổi trạng thái nếu vượt gốc).
- Bổ sung Tab "Công nợ phải thu (KT02)" vào UI.
- Workbook engine: `KT02_3.0.0-vi.xlsx`.
- Khắc phục sự cố zero-byte file của KV03/KV04 bằng git checkout. Vượt qua `verify_project.py` và các tests. Đã checkpoint rpa.

**Các module đã tự động xử lý trong lượt này:**
- KT02
