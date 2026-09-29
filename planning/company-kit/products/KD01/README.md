# KD01 — Báo giá và đơn hàng
Phòng: Kinh doanh. Trạng thái `draft_for_review`; chưa có app/workbook đã kiểm chứng.
Đọc DOMAIN_SPEC → PRD → schema → formulas → tests → server/web/workbook.
Phụ thuộc: CORE, KV01. Nguồn bảng: BaoGia, DonHang, ChiTietDon.
Các oracle là expected cố định của KPI chính; agent phải bổ sung cho mọi cột và workflow trước G0. Dữ liệu fixtures là calculator demo, chưa phải seed liên bảng.
Cài/backup/import theo START_HERE và docs dùng chung; không có lệnh chạy riêng cho module trước CORE.
