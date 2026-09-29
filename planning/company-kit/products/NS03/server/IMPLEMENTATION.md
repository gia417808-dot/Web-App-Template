# Backend NS03
Triển khai action duyetNghiPhep trong application service, domain thuần theo FORMULA_CONTRACT. Repository scope tenant, DTO allowlist. Routes theo docs/API_CONTRACT.md. Liên kết entity SoDuPhep, DonNghi; quyền sở hữu dùng governance/DOMAIN_MAP.
Thứ tự: khóa schema và oracle → migration/seed → domain/state guards → repository/transaction → HTTP validation/auth → integration test → OpenAPI. Server recompute derived fields; optimistic row_version cho edit, lock+idempotency cho aggregate posting. Xử lý riêng: Chỉ đơn approved giảm phép; cancel hoàn phép bằng reversal; khóa bản ghi số dư khi duyệt, cấm vượt nếu policy không cho phép.
Chưa có handler chạy trong bộ kit; không tạo endpoint trả mock rồi đánh dấu G1.
