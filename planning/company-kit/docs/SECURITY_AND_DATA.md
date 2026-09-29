# Quyền, dữ liệu và ngoại lệ

Server kiểm tra session + action scope + organization cho mọi query và mutation, export/import, worker. ID hợp lệ nhưng sai tenant trả không thấy. Mọi FK master/document được kiểm tra cùng tổ chức. Chỉ owner cấu hình kỳ khóa, policy kho âm, profile tổ chức.

Input allowlist, schema validation, parameterized SQL, CSRF nếu cookie, không CORS wildcard với credentials. Workbook có thông tin hồ sơ/lương phải owner-only. Không xuất secret; masked log. Attachment phải kiểm tra loại/kích thước và URL authorization, không public mặc định.

Các sự kiện tiền/kho đồng thời cần transaction và lock; version cho sửa form không đủ bảo vệ aggregate tồn. Idempotency key lưu cùng transaction kết quả; duplicate same request trả kết quả cũ, khác hash trả 409.

Soft delete master có tham chiếu không làm đứt lịch sử; SKU/customer snapshot trên chứng từ. Không xóa vật lý chứng từ posted. Retention PII và yêu cầu xóa cần chính sách riêng; không giả định soft delete là tuân thủ luật. KT/NS chỉ quản trị nội bộ, không khẳng định chuẩn thuế/BHXH.
