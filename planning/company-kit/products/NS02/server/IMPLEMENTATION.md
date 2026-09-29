# Backend NS02
Triển khai action duyetChamCong trong application service, domain thuần theo FORMULA_CONTRACT. Repository scope tenant, DTO allowlist. Routes theo docs/API_CONTRACT.md. Liên kết entity CaLam, ChamCong; quyền sở hữu dùng governance/DOMAIN_MAP.
Thứ tự: khóa schema và oracle → migration/seed → domain/state guards → repository/transaction → HTTP validation/auth → integration test → OpenAPI. Server recompute derived fields; optimistic row_version cho edit, lock+idempotency cho aggregate posting. Xử lý riêng: Ca <24 giờ, giờ bằng nhau trả lỗi AMBIGUOUS_SHIFT; trên 24 giờ phải dùng datetime; trừ nghỉ bằng trường cấu hình riêng trước khi tính lương.
Chưa có handler chạy trong bộ kit; không tạo endpoint trả mock rồi đánh dấu G1.
