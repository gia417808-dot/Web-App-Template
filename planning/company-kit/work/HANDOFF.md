# Bàn giao hiện tại
Mốc: Hiện tại. Đã hoàn thành triển khai phân hệ MK03 (Lead theo nguồn).
Nhánh làm việc hiện tại: `feat/mk03-lead-source`.

**Các công việc đã thực hiện cho MK03:**
- Đã merge nhánh `feat/mk02-campaign-budget` (chứa các fix 0-byte từ MK02) vào `main` và rebase nhánh MK03.
- Cập nhật schema `012_mk03.sql` sử dụng `organization_id` cho multi-tenant.
- Xây dựng Domain logic `mk03.ts` xử lý vòng đời Lead (new -> qualified -> converted | invalid) và tính KPI tỷ lệ chuyển đổi, bao gồm cả fix test `node:test`.
- Đã cập nhật `workbook-engine/src/index.ts` và xoá ký tự lỗi encoding do ghi nối file sinh ra.
- Viết file seed data cho MK03.
- Gắn route API `mk03Router` vào `apps/api/src/index.ts`. Dummy mk02 export được thêm lại.
- Bổ sung script tạo Excel sample cho MK03.
- Hoàn thành đầy đủ các Checkpoint review, plan, act, verify, done và vượt cổng G_EXCEL thông qua `verify_project.py` và `rpa.py`.
- Tệp manifest của MK03 đã vượt validation.

**Task tiếp theo:**
Đợi người dùng kiểm tra và commit code trên nhánh `feat/mk03-lead-source`.
Sau khi commit, chạy tiếp `rpa.py next` để kiểm tra các module chưa làm.
Lưu ý do vấn đề môi trường Windows/PowerShell, các script chạy `verify` nên dùng Node Portable.
