# Chạy liên tục: app và agent là hai việc khác nhau

Ứng dụng chỉ chạy liên tục khi máy/host luôn bật, process được giám sát và DB bền vững. Một prompt không giữ phiên AI hoạt động khi hết quota, tắt chat hay mất mạng. Bộ kit cung cấp resume/checkpoint; chưa có scheduler gọi AI model. Không tự chạy job trả phí.

## Môi trường local → staging → production private
1. AUDIT ghi máy/OS/runtime, host sẵn có và trần chi phí; có thể chạy local trước. Laptop sleep làm app dừng, không xem là 24/7.
2. CORE tạo Dockerfile/compose hoặc dịch vụ theo host đã chọn, pin image/version, không publish cổng DB ra Internet. Container/process restart policy và persistent DB volume; readiness check thật. Không tạo file deploy giả trước khi biết entrypoint.
3. Tạo staging với dữ liệu demo, separate DB/secret; chạy migration, seed idempotent; login/E2E/Excel trên cùng revision.
4. Tạo owner theo luồng one-time không password mặc định; tắt bootstrap sau dùng. TLS, env secret, server authorization, rate limit, request size, dependency audit.
5. Backup trước migration; ưu tiên expand→backfill→switch→contract. Migration phá dữ liệu cần quyết định rõ; rollback app chỉ dùng nếu schema tương thích. Không tự chạy down migration gây mất dữ liệu.
6. Deploy private trên host đã được chọn/cho phép; kiểm tra ready, đăng nhập, tạo đơn demo, confirm, import retry và dashboard.
7. Restart app rồi host staging; đảm bảo dữ liệu còn và worker nhận lại công việc an toàn. Chuyển production sau khi gate đạt, lưu release SHA và migration version.

## Backup / restore — mục tiêu đề xuất cần xác nhận trong AUDIT
- RPO 24 giờ, RTO 2 giờ cho bản một người nhỏ; không cam kết trước diễn tập. Dữ liệu quan trọng hơn cần lịch backup dày hơn/PITR và chi phí tương ứng.
- Hằng ngày dump DB bằng công cụ PostgreSQL tương thích; encrypt, lưu off-host, retention 7 bản ngày + 4 bản tuần. Backup file upload và cấu hình phục hồi riêng; không để encryption key cùng chỗ backup duy nhất.
- Khôi phục vào DB thử mới: tạo database tách biệt, pg_restore, migration compatibility, count/sum đơn-tiền-kho, login và kiểm tra file attachment. Không restore thử đè production.
- Lưu thời điểm, kích thước/hash backup, log restore, thời gian thực tế, expected/actual. Lịch hằng ngày cần cấu hình trên host; file runbook không có nghĩa đã lên lịch.

## Worker / lịch nghiệp vụ
Reminder trong app trước, email/SMS chỉ khi người dùng bật kênh và cấu hình. Job unique theo org/job_type/entity/scheduled_at; claim có lease + heartbeat; retry exponential backoff tối đa 5 rồi DLQ. Cron dùng timezone rõ, timestamp UTC, chống double-run sau restart. Không để worker giữ transaction DB dài khi gọi bên ngoài.

## Theo dõi và phản ứng
- Ping ready mỗi 60 giây, báo sau 3 lần lỗi; cảnh báo backup quá 26 giờ, disk 80%, job DLQ>0. Đây là giá trị vận hành đề xuất, ghi lại sau load test.
- Theo dõi log cấu trúc correlation_id không PII/secret, lỗi 5xx, p95 latency, DB connections và queue lag. Log rotation để tránh đầy ổ.
- Khi sự cố tiền/kho: tạm tắt mutation liên quan, giữ đọc; chụp bằng chứng; xác minh transaction/idempotency; rollback phiên bản tương thích hoặc phục hồi thử trước. Không sửa dữ liệu trực tiếp không audit.

## Nếu muốn agent code tự tiếp tục ngoài chat
Cần runner thực trên máy/CI, adapter mô hình có API và ngân sách, scheduler, lease task, branch isolation, giới hạn số vòng/chi phí, tool allowlist và cơ chế dừng. Chỉ cấu hình khi được yêu cầu; không có trong kit này. Resume thủ công hoạt động không phụ thuộc nhà cung cấp.
