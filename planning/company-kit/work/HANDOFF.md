# Bàn giao hiện tại
Mốc: Hiện tại. Đang triển khai tự động các phân hệ còn lại trên nhánh `feat/complete-remaining-system`.
Đã hoàn thành thêm phân hệ: **SX02 (Định mức vật tư)**.

**Các công việc đã thực hiện cho SX02:**
- Schema `VatTu`, `DinhMuc` và `DuTruVatTu` (027_sx02.sql).
- Cỗ máy trạng thái `DRAFT` ➔ `APPROVED` ➔ `ARCHIVED` cho BOM (Định mức).
- Logic dự trù vật tư: `lượng cần = định mức × kế hoạch × (1 + hao_hut/100)`. Chỉ áp dụng khi BOM đã được `APPROVED`.
- Bổ sung Tab "Định mức vật tư (SX02)" vào UI.
- Workbook engine: `SX02_3.0.0-vi.xlsx`.
- Vượt qua `verify_project.py` và các tests. Đã checkpoint rpa.

**Các module đã tự động xử lý trong lượt này:**
- KT03, KT04, KT05, NS01, NS02, NS03, NS04, NS05, SX02
