# Bàn giao hiện tại
Mốc: Hiện tại. Đang triển khai tự động các phân hệ còn lại trên nhánh `feat/complete-remaining-system`.
Đã hoàn thành thêm phân hệ: **NS04 (Lương quản trị)**.

**Các công việc đã thực hiện cho NS04:**
- Schema `BangLuong` và `KhoanDieuChinh` (025_ns04.sql).
- Cỗ máy trạng thái `DRAFT` ➔ `REVIEWED` ➔ `LOCKED`. Cấm tính lại khi đã khóa.
- Logic tính thực nhận: `thực nhận = lương thỏa thuận + phụ cấp − khấu trừ`.
- Bổ sung Tab "Lương quản trị (NS04)" vào UI.
- Workbook engine: `NS04_3.0.0-vi.xlsx`.
- Vượt qua `verify_project.py` và các tests. Đã checkpoint rpa.

**Các module đã tự động xử lý trong lượt này:**
- KT03, KT04, KT05, NS01, NS02, NS03, NS04
