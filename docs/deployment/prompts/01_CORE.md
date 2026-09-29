Áp dụng @skill và đọc AGENTS/RUNBOOK/checkpoint. Thực thi CORE sau AUDIT trên repo gia417808-dot/Web-App-Template; giữ code hợp lệ đã có, không bootstrap lại.

Review môi trường và đặc tả kiến trúc/dictionary/constraints/quality gates. Plan schema và thin slice đầu tiên có login→API→DB→UI→export; khóa dependency tương thích, version và lockfile. Đưa quyết định vào ADR, tạo SPEC_IMPLEMENTATION_MAP.json.

Act: tạo TypeScript monorepo React + Node API + PostgreSQL ở root repo, scripts dev/build/typecheck/lint/test/test:integration/test:e2e/db:migrate/db:seed/workbook:generate thực sự gọi code có tồn tại. Tạo .env.example không secret, auth owner có setup one-time, tenant server-side, UUID/row_version/audit, decimal HALF_UP, transaction/idempotency, health/ready. Workbook engine có meta/id/version/validation/protected formulas/import preview và commit kiểm tra lại. Màn hình module chưa code hiển thị trạng thái chưa sẵn sàng, không dữ liệu fake giả là production.

Verify clean install, typecheck/build, unit/integration auth/tenant/decimal/roundtrip; cập nhật deployment-checks.json application bằng command thật và docs/deployment/LOCAL_COMMANDS.md. Không phát sinh test rỗng hoặc script exit 0 giả.

Fix lỗi gặp trong phạm vi, lưu log/revision, checkpoint CORE đúng gate. Commit/push feature branch theo quyền đã cho trong MASTER nếu tests đạt và diff được review; thiếu credential thì giữ commit local và báo rõ. Tiếp tục task sẵn sàng, không tự deploy công khai hoặc mua host.
