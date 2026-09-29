# Backend KV03
Triển khai action datMuaHang trong application service, domain thuần theo FORMULA_CONTRACT. Repository scope tenant, DTO allowlist. Routes theo docs/API_CONTRACT.md. Liên kết entity YeuCauMua, DonMua; quyền sở hữu dùng governance/DOMAIN_MAP.
Thứ tự: khóa schema và oracle → migration/seed → domain/state guards → repository/transaction → HTTP validation/auth → integration test → OpenAPI. Server recompute derived fields; optimistic row_version cho edit, lock+idempotency cho aggregate posting. Xử lý riêng: Nhận một phần; chênh lệch âm là nhận dư cần policy, không âm thầm ép 0; received lấy phiếu posted.
Chưa có handler chạy trong bộ kit; không tạo endpoint trả mock rồi đánh dấu G1.
