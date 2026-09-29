# Backend KD01
Triển khai action taoBaoGia, chotDon trong application service, domain thuần theo FORMULA_CONTRACT. Repository scope tenant, DTO allowlist. Routes theo docs/API_CONTRACT.md. Liên kết entity BaoGia, DonHang, ChiTietDon; quyền sở hữu dùng governance/DOMAIN_MAP.
Thứ tự: khóa schema và oracle → migration/seed → domain/state guards → repository/transaction → HTTP validation/auth → integration test → OpenAPI. Server recompute derived fields; optimistic row_version cho edit, lock+idempotency cho aggregate posting. Xử lý riêng: qty > 0; unit_price nguyên >= 0; discount_pct trong [0,100]. Làm tròn HALF_UP theo dòng rồi cộng; hủy đơn không cộng doanh thu.
Chưa có handler chạy trong bộ kit; không tạo endpoint trả mock rồi đánh dấu G1.
