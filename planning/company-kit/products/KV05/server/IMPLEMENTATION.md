# Backend KV05
Triển khai action deXuatBoSung trong application service, domain thuần theo FORMULA_CONTRACT. Repository scope tenant, DTO allowlist. Routes theo docs/API_CONTRACT.md. Liên kết entity MucTon, TonKho; quyền sở hữu dùng governance/DOMAIN_MAP.
Thứ tự: khóa schema và oracle → migration/seed → domain/state guards → repository/transaction → HTTP validation/auth → integration test → OpenAPI. Server recompute derived fields; optimistic row_version cho edit, lock+idempotency cho aggregate posting. Xử lý riêng: available=on_hand-reserved; target cấu hình theo SKU/kho; không tự đặt mua; tồn khả dụng vượt target gợi ý 0.
Chưa có handler chạy trong bộ kit; không tạo endpoint trả mock rồi đánh dấu G1.
