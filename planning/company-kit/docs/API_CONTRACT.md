# Hợp đồng API dùng chung

Prefix `/api/v1`; session cookie HttpOnly/Secure/SameSite phù hợp, CSRF cho mutation nếu dùng cookie. Không viết auth mới nếu repo có giải pháp được kiểm chứng. Owner có toàn quyền trong organization của mình, không thể đọc organization khác. PII NS restricted theo scope dù chỉ một owner hiện tại.

- GET `/products/{productId}/records?cursor=&limit=&q=&status=&from=&to=`: validate filter, cap limit 100; trả `{data,next_cursor}`.
- POST `/products/{productId}/records`: create draft, `{data:{id,row_version,...}}`, 201.
- PATCH `/products/{productId}/records/{id}`: expected_row_version bắt buộc; 409 VERSION_CONFLICT kèm current version khi được phép đọc.
- POST `/products/{productId}/records/{id}/actions/{action}`: explicit transition, idempotency key bắt buộc cho posting; reuse key với body khác trả 409 IDEMPOTENCY_MISMATCH.
- POST `/products/{productId}/imports/preview`: file allowlist, size/zip limits; kiểm tra schema_version, ID, tenant, kiểu, công thức lạ; trả preview_id + errors/conflicts, không ghi.
- POST `/products/{productId}/imports/{preview_id}/commit`: recheck versions trong transaction, idempotent; preview có TTL và bound owner/org/file hash. Không ghi một phần mặc định; trả lỗi từng dòng để sửa.
- GET `/products/{productId}/export`: worksheet contract + stable IDs/versions; quyền như đọc dữ liệu. Dùng snapshot nhất quán.
- GET `/products/{productId}/dashboard`: cùng filter/period, null_reason cho dữ liệu thiếu.
- GET `/health/live`: process sống; `/health/ready`: DB/dependency cần thiết; không lộ config.

Lỗi: `{error:{code,message,field_errors,correlation_id}}`; 400 malformed, 401 thiếu xác thực, 403 không quyền, 404 không thấy trong scope, 409 xung đột/trạng thái/key, 422 vi phạm nghiệp vụ, 429 giới hạn, 500 lỗi có correlation_id. Không lộ SQL/stack cho UI.

Trạng thái chuẩn dự thảo theo module tại product DOMAIN_SPEC; không dùng một máy trạng thái cứng cho HR/pipeline/kho. OpenAPI thật là đầu ra CORE; routes trên là hợp đồng mục tiêu, chưa là API đã chạy.
