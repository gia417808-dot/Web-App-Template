# Backend MK05
Triển khai action chotThuNghiem trong application service, domain thuần theo FORMULA_CONTRACT. Repository scope tenant, DTO allowlist. Routes theo docs/API_CONTRACT.md. Liên kết entity ThuNghiem, BienThe; quyền sở hữu dùng governance/DOMAIN_MAP.
Thứ tự: khóa schema và oracle → migration/seed → domain/state guards → repository/transaction → HTTP validation/auth → integration test → OpenAPI. Server recompute derived fields; optimistic row_version cho edit, lock+idempotency cho aggregate posting. Xử lý riêng: MVP dùng unique respondent <= unique reach; reach=0 trả null. Chỉ mô tả tỷ lệ, không kết luận ý nghĩa thống kê hay tự chọn thắng.
Chưa có handler chạy trong bộ kit; không tạo endpoint trả mock rồi đánh dấu G1.
