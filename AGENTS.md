# Web-App-Template — điểm vào cho mọi agent

Repo chính: https://github.com/gia417808-dot/Web-App-Template . Không push sang repo google-sheet cũ. Ngôn ngữ trao đổi và sản phẩm: tiếng Việt.

## 🌟 Trạng Thái Hệ Sinh Thái: `GOLDEN_MASTER_COMMERCIAL_PRO`
Hệ thống đã tích hợp hoàn chỉnh 5 Mẫu Gốc Chuẩn Thương Mại (Commercial Pro) làm hạt nhân nhân bản (Core Archetypes):
1. **`GS-001`** (`GS-001-hr` — **v4.0 Commercial Pro**, 8 Sheets): Quản Lý Nhân Sự, Chấm Công Ca/GPS, Duyệt Đơn Nghỉ Phép/OT, Đánh Giá KPI (`100% ➔ Chờ duyệt`) & Tính Lương Tự Động (BHXH/Thuế TNCN/Payslip Email & Zalo).
2. **`GS-002`** (`GS-002-warehouse` — **v3.0 Commercial Pro**, 7 Sheets): Quản Lý Nhập Xuất Tồn Đa Kho, Cổng Đăng Nhập Bắt Buộc (`Auth Gate`), Thẻ Kho, Cảnh Báo Định Mức & In Phiếu Kho A4.
3. **`GS-003`** (`GS-003-finance` — **v4.1 Commercial Pro**, 7 Sheets): Quản Lý Thu Chi, Sổ Quỹ Đa Tài Khoản (Tiền Mặt/Ngân Hàng), Công Nợ & Báo Cáo Lưu Chuyển Dòng Tiền (`Cashflow`).
4. **`GS-004`** (`GS-004-project` — **v4.4 Commercial Pro**, 7 Sheets): Quản Lý Dự Án, Khách Hàng CRM, Giao Việc Kanban/Gantt, Đa Bộ Phận RACI, Upload Đa File (`Word`/`Excel`/`PPT`/`PDF`), Tiến Độ `100% ➔ Chờ duyệt` & Bot Nhắc Việc.
5. **`GS-005`** (`GS-005-pos` — **v3.3 Commercial Pro**, 8 Sheets): Quản Lý Nhà Hàng, Cafe, POS Tính Giờ, Phân Hạng Hội Viên VIP, Đồng Bộ Phiếu Bếp KDS & Chế Độ Toàn Màn Hình (`Full Screen`).

Mỗi mẫu gốc bao gồm đủ 4 file chuẩn: `appsscript.json` (V8 engine), `installer.gs`, `Code.gs`, `Index.html` tại cả `apps/` và `delivery/packages/`.

---

Luôn áp dụng @skill: kiểm tra ngữ cảnh, căn chỉnh mục tiêu, Review → Plan → Act → Verify → Checkpoint. Quy tắc chi tiết ở `planning/company-kit/rules/WORKING_POLICY.md`; đây là chính sách dự án, không giả định mọi IDE có một lệnh @skill giống nhau.

Đọc `docs/deployment/RUNBOOK.md`, `planning/company-kit/AGENTS.md`, `planning/company-kit/START_HERE.md`, `planning/company-kit/work/HANDOFF.md`, state và task hiện tại. Các đường dẫn không có prefix trong bộ company-kit được hiểu tương đối từ `planning/company-kit/`. Source code ứng dụng đặt tại **root repo** dưới apps/packages/products/db/infra, không đặt dưới planning/company-kit. Thư mục planning chứa đặc tả; triển khai module dùng mapping ID và contract ở đó.

Kiểm tra Git root/origin/branch/status trước sửa. Tạo feature branch từ main cập nhật, không ghi đè README hay hướng dẫn có sẵn. Lấy repo hiện tại làm bằng chứng, không suy từ lời nói hoặc kế hoạch rằng đã có ứng dụng.

Bộ hồ sơ chưa có runtime app. CORE phải tạo stack TypeScript/React/Node/PostgreSQL theo ADR, package scripts thật, lockfile và test. Chọn version được hỗ trợ dựa trên tài liệu chính thức hiện tại, không install latest mù. Không sao chép toàn bộ legacy repo vào đây.

Lệnh có sẵn:
- `python tools/deployment/repo_doctor.py`
- `python tools/deployment/verify_project.py --group bootstrap`
- `python tools/deployment/verify_project.py --group application` (chạy kiểm thử bộ 5 mẫu Golden Master)
- `python tools/verify_golden_master.py` (kiểm định cú pháp Node V8 & Graveyard rules cho 5 mẫu gốc)
- `python tools/sync_commercial_pro.py` (đồng bộ 5 mẫu giữa các thư mục Monorepo)
- `python sync_to_github.py --repo-dir .` (đồng bộ tự động 2 máy tính qua GitHub)
- `python planning/company-kit/scripts/rpa.py next`

`verify_project.py --group application` đã cấu hình chạy `tools/verify_golden_master.py`. Dùng node/python trực tiếp trên Windows nếu npm.cmd không tương thích runner.

Sau mỗi task: chạy test cần thiết, review diff, cập nhật checkpoint/evidence/HANDOFF. Chỉ stage file đã review, chạy git_preflight trước commit, push feature branch khi người dùng đã yêu cầu đồng bộ. Không force push, không tự merge PR hoặc công khai deployment nếu chưa được yêu cầu. Không đưa secret vào Git.

Nếu có lỗi, tái hiện→test bắt lỗi→sửa nguyên nhân→kiểm tra lại. Không bỏ test hoặc bịa gate. Tự tiếp tục việc được phép trong phiên; hết quota thì checkpoint, không hứa tự code ngoài phiên.
