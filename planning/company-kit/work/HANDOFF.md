# Bàn giao hiện tại
Mốc: Hiện tại. Đã hoàn thành triển khai phân hệ MK05 (Thử nghiệm nội dung).
Nhánh làm việc hiện tại: `feat/mk05-thu-nghiem-noi-dung`.

**Các công việc đã thực hiện cho MK05:**
- Thiết kế Schema `ThuNghiem`, `BienThe` (014_mk05.sql).
- Xây dựng Domain logic `mk05.ts` quản lý state (DRAFT ➔ RUNNING ➔ COMPLETED/CANCELED), tính tỷ lệ phản hồi (chặn chia cho 0).
- Tạo API xử lý hành động nghiệp vụ `chotThuNghiem`.
- Cập nhật Tab UI MK05 cho `admin-web`.
- Cấu hình Engine tạo file Excel bằng công thức Native: `=IF([@[Lượt Tiếp Cận]]>0, [@[Phản Hồi]]/[@[Lượt Tiếp Cận]], "")`.
- Đã sửa lỗi mất mát tệp index bằng script ghi nguyên bản (Rewrite) UTF-8. Các module hoạt động ổn định.
- Vượt các test unit và integration (Gate G1, G_EXCEL, G_WEB). `MK05_3.0.0-vi.xlsx` xuất thành công.
- Đã chạy tự động `rpa.py` qua tất cả các chốt (review, plan, act, verify, done).

**Task tiếp theo:**
Kiểm tra lại code. Sau đó commit và rẽ nhánh sang sản phẩm tiếp theo.
