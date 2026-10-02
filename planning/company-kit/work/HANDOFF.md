# Bàn giao hiện tại
Mốc: Hiện tại. Đang triển khai tự động các phân hệ còn lại trên nhánh `feat/complete-remaining-system`.
Đã hoàn thành thêm phân hệ: **NS02 (Chấm công và ca)**.

**Các công việc đã thực hiện cho NS02:**
- Schema `CaLam` và `ChamCong` (023_ns02.sql).
- Cỗ máy trạng thái `DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` | `REJECTED`.
- Logic tính giờ làm ca qua nửa đêm: `MOD(ra - vao, 24) - tru_gio_nghi`. Báo lỗi `AMBIGUOUS_SHIFT` nếu giờ bằng nhau.
- Bổ sung Tab "Chấm công (NS02)" vào UI.
- Workbook engine: `NS02_3.0.0-vi.xlsx`.
- Vượt qua `verify_project.py` và các tests. Đã checkpoint rpa.

**Các module đã tự động xử lý trong lượt này:**
- KT03, KT04, KT05, NS01, NS02
