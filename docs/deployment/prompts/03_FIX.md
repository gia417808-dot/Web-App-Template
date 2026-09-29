Áp dụng @skill. Sửa lỗi hiện tại trong repo Web-App-Template, giữ nguyên mục tiêu và thay đổi chưa commit của tôi.

1. REVIEW: lấy nguyên lỗi đầu tiên, command, cwd, runtime, branch/SHA, diff và env names (không in secret). Đọc log mới nhất ở reports/local/verification hoặc test runner; phân biệt lỗi code, dependency, config, quyền, external service.
2. REPRODUCE: chạy command hẹp tái hiện, mô tả expected/actual. Nếu không tái hiện, báo điều đã kiểm tra và dữ liệu còn thiếu; không bịa nguyên nhân.
3. PLAN: chọn giả thuyết có bằng chứng, file ảnh hưởng, cách kiểm tra; tạo regression test tái hiện nếu là bug nghiệp vụ đáng giữ.
4. ACT: sửa nguyên nhân tối thiểu. Không xóa test, nới expected, tắt typecheck/auth/concurrency, xóa lockfile hoặc reset/drop DB để làm xanh. Không kill mọi process, không ghi đè công việc người dùng.
5. VERIFY: test lỗi cũ, regression liên quan, build/typecheck nếu ảnh hưởng. Kiểm tra diff và tác động tiền/kho/quyền. Nếu hai lần cùng cách thất bại, đổi giả thuyết dựa log.
6. CHECKPOINT: ghi issue report expected/actual, root cause, file sửa, command/exit code, còn thiếu. Evidence gate stale phải reopen.
7. SYNC: commit/push feature branch đúng repo theo MASTER khi đã review và kiểm tra đạt, không force và không tự merge main. Thiếu credential không chặn sửa local; báo chính xác bước sync bị chặn.

Nếu chưa có log trong phiên, tự chạy kiểm tra hiện hữu thích hợp trước khi yêu cầu tôi cung cấp lại.
