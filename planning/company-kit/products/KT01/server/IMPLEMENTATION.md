# Backend KT01
Triển khai action ghiNhanGiaoDich trong application service, domain thuần theo FORMULA_CONTRACT. Repository scope tenant, DTO allowlist. Routes theo docs/API_CONTRACT.md. Liên kết entity GiaoDich, TaiKhoanTien; quyền sở hữu dùng governance/DOMAIN_MAP.
Thứ tự: khóa schema và oracle → migration/seed → domain/state guards → repository/transaction → HTTP validation/auth → integration test → OpenAPI. Server recompute derived fields; optimistic row_version cho edit, lock+idempotency cho aggregate posting. Xử lý riêng: Số tiền VND nguyên; direction quyết định dấu; khóa kỳ; chuyển khoản nội bộ có cặp bút toán cùng transfer_id.
Chưa có handler chạy trong bộ kit; không tạo endpoint trả mock rồi đánh dấu G1.
