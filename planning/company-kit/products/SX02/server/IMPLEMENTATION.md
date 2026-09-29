# Backend SX02
Triển khai action duTruVatTu trong application service, domain thuần theo FORMULA_CONTRACT. Repository scope tenant, DTO allowlist. Routes theo docs/API_CONTRACT.md. Liên kết entity DinhMuc, VatTu; quyền sở hữu dùng governance/DOMAIN_MAP.
Thứ tự: khóa schema và oracle → migration/seed → domain/state guards → repository/transaction → HTTP validation/auth → integration test → OpenAPI. Server recompute derived fields; optimistic row_version cho edit, lock+idempotency cho aggregate posting. Xử lý riêng: Định mức có version và đơn vị; waste_pct trong [0,100] là policy MVP có thể sửa qua ADR; không trộn kg với cái.
Chưa có handler chạy trong bộ kit; không tạo endpoint trả mock rồi đánh dấu G1.
