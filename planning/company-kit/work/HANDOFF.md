# Bàn giao hiện tại
Mốc: Hiện tại. Đang triển khai tự động các phân hệ còn lại trên nhánh `feat/complete-remaining-system`.
Đã hoàn thành thêm phân hệ: **KT04 (Ngân sách và thực chi)**.

**Các công việc đã thực hiện cho KT04:**
- Schema `NganSach` (020_kt04.sql) có liên kết với `HangMucNganSach` (từ KT01).
- Cỗ máy trạng thái `DRAFT` ➔ `APPROVED` ➔ `LOCKED`.
- Logic kiểm soát vượt chi (trừ số thực chi vào dự toán, tính chênh lệch, hỗ trợ update dự toán có revision).
- Bổ sung Tab "Ngân sách thực chi (KT04)" vào UI.
- Workbook engine: `KT04_3.0.0-vi.xlsx`.
- Vượt qua `verify_project.py` và các tests. Đã checkpoint rpa.

**Các module đã tự động xử lý trong lượt này:**
- KT03, KT04
