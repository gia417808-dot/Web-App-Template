Áp dụng @skill. Review và đồng bộ thay đổi hiện tại lên https://github.com/gia417808-dot/Web-App-Template bằng feature branch, không merge main.

Review origin/push URL/branch/status, diff và git diff --check; đọc source thực tế, chứng cứ test, source revision và gate. Kiểm tra tiền/decimal, tenant, concurrency/idempotency, import, Excel, migration, secret. Ghi self-review nếu bạn tự review chính code của mình. Nếu có bug thuộc phạm vi, sửa và test trước sync.

Plan commit theo một thay đổi có ý nghĩa; chỉ stage path đã review, không git add -A mù. Chạy git_preflight và nhóm kiểm tra phù hợp: bootstrap chỉ dùng commit hồ sơ ban đầu, application phải dùng cho code app. Giải thích check NOT_RUN thay vì coi PASS.

Act: commit, fetch origin, xem quan hệ với origin/main và remote feature branch. Nếu remote ahead/diverged, merge có review, sửa conflict và rerun test; không force. Push feature branch qua credential có sẵn; không yêu cầu token trong chat. Đối chiếu git rev-parse HEAD với SHA ref remote. Tạo draft PR khi công cụ/quyền sẵn và chưa có PR cho nhánh; body-file nêu vấn đề/thay đổi/test/giới hạn, tránh tạo trùng.

Report: changed files, checks/exit codes, commit SHA, branch, URL PR nếu thực sự tạo và phần chưa merge/deploy. Nếu sync bị chặn, nêu nguyên nhân, giữ code/commit local và hướng dẫn bước xác thực cụ thể; không tuyên bố đã push.
