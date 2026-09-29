# Backend SX05
Triển khai action tinhGiaThanh trong application service, domain thuần theo FORMULA_CONTRACT. Repository scope tenant, DTO allowlist. Routes theo docs/API_CONTRACT.md. Liên kết entity LenhSanXuat, XuatVatTu, ChiPhiSX; quyền sở hữu dùng governance/DOMAIN_MAP.
Thứ tự: khóa schema và oracle → migration/seed → domain/state guards → repository/transaction → HTTP validation/auth → integration test → OpenAPI. Server recompute derived fields; optimistic row_version cho edit, lock+idempotency cho aggregate posting. Xử lý riêng: Tổng hợp vật tư thực xuất, nhân công, chi phí được duyệt; số lượng đạt 0 trả null; giữ precision trước làm tròn báo cáo.
Chưa có handler chạy trong bộ kit; không tạo endpoint trả mock rồi đánh dấu G1.
