# Web-App-Template — điểm vào cho mọi agent

Repo chính: https://github.com/gia417808-dot/Web-App-Template . Không push sang repo google-sheet cũ. Ngôn ngữ trao đổi và sản phẩm: tiếng Việt.

Luôn áp dụng @skill: kiểm tra ngữ cảnh, căn chỉnh mục tiêu, Review → Plan → Act → Verify → Checkpoint. Quy tắc chi tiết ở `planning/company-kit/rules/WORKING_POLICY.md`; đây là chính sách dự án, không giả định mọi IDE có một lệnh @skill giống nhau.

Đọc `docs/deployment/RUNBOOK.md`, `planning/company-kit/AGENTS.md`, `planning/company-kit/START_HERE.md`, `planning/company-kit/work/HANDOFF.md`, state và task hiện tại. Các đường dẫn không có prefix trong bộ company-kit được hiểu tương đối từ `planning/company-kit/`. Source code ứng dụng đặt tại **root repo** dưới apps/packages/products/db/infra, không đặt dưới planning/company-kit. Thư mục planning chứa đặc tả; triển khai module dùng mapping ID và contract ở đó.

Kiểm tra Git root/origin/branch/status trước sửa. Tạo feature branch từ main cập nhật, không ghi đè README hay hướng dẫn có sẵn. Lấy repo hiện tại làm bằng chứng, không suy từ lời nói hoặc kế hoạch rằng đã có ứng dụng.

Bộ hồ sơ chưa có runtime app. CORE phải tạo stack TypeScript/React/Node/PostgreSQL theo ADR, package scripts thật, lockfile và test. Chọn version được hỗ trợ dựa trên tài liệu chính thức hiện tại, không install latest mù. Không sao chép toàn bộ legacy repo vào đây.

Lệnh có sẵn:
- `python tools/deployment/repo_doctor.py`
- `python tools/deployment/verify_project.py --group bootstrap`
- `python planning/company-kit/scripts/rpa.py next`

`verify_project.py --group application` cố ý trả lỗi khi chưa cấu hình check. Không coi bootstrap PASS là ứng dụng PASS. Sau CORE cập nhật deployment-checks.json bằng command thật, shell=false, dùng node/python trực tiếp trên Windows nếu npm.cmd không tương thích runner.

Sau mỗi task: chạy test cần thiết, review diff, cập nhật checkpoint/evidence/HANDOFF. Chỉ stage file đã review, chạy git_preflight trước commit, push feature branch khi người dùng đã yêu cầu đồng bộ. Không force push, không tự merge PR hoặc công khai deployment nếu chưa được yêu cầu. Không đưa secret vào Git.

Nếu có lỗi, tái hiện→test bắt lỗi→sửa nguyên nhân→kiểm tra lại. Không bỏ test hoặc bịa gate. Tự tiếp tục việc được phép trong phiên; hết quota thì checkpoint, không hứa tự code ngoài phiên.
