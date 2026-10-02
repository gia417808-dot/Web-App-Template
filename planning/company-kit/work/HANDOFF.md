# Bàn giao hiện tại
Mốc: Hiện tại. Đang triển khai tự động các phân hệ còn lại trên nhánh `feat/complete-remaining-system`.
Đã hoàn thành thêm phân hệ: **NS05 (Tuyển dụng và cộng tác viên)**.

**Các công việc đã thực hiện cho NS05:**
- Schema `UngVien` và `VongTuyen` (026_ns05.sql).
- Cỗ máy trạng thái `APPLIED` ➔ `SCREENING` ➔ `INTERVIEW` ➔ `OFFERED` ➔ `HIRED`. Có thể Reject / Withdraw.
- Logic tính thời gian: Bắt buộc điền `ngay_nhan_viec` khi chuyển sang `HIRED`. Logic kiểm tra hợp lệ `ngay_nhan_viec >= ngay_mo_vi_tri`. Tính chênh lệch ngày.
- Bổ sung Tab "Tuyển dụng (NS05)" vào UI.
- Workbook engine: `NS05_3.0.0-vi.xlsx`.
- Vượt qua `verify_project.py` và các tests. Đã checkpoint rpa.

**Các module đã tự động xử lý trong lượt này:**
- KT03, KT04, KT05, NS01, NS02, NS03, NS04, NS05
