# Bắt đầu trong 15 phút

1. Giải nén ZIP vào một thư mục riêng. Giữ bản gốc làm bộ tham chiếu.
2. Nếu đang code repo cũ: mở repo đó trong IDE. Đặt bộ này dưới `planning/company-kit/`; không giải nén đè root, không thay `AGENTS.md`, lockfile hoặc releases hiện có. Dán prompt BOOTSTRAP và nói rõ đường dẫn này. Agent phải đọc cả hướng dẫn repo cũ và kit, lập mapping trước khi di chuyển tệp.
3. Nếu chưa có repo: mở thư mục kit làm workspace và dùng nó làm gốc dự án. Agent tạo app sau khi hoàn tất AUDIT và CORE. Nếu muốn dùng Git, agent kiểm tra đã ở trong repo chưa trước khi `git init`.
4. Mở `prompts/BOOTSTRAP.md`, sao chép toàn bộ nội dung và gửi cho agent có quyền đọc/ghi file, terminal. Với Gemini chat chỉ có upload file, gửi ZIP nếu công cụ hỗ trợ hoặc đính kèm START_HERE, AGENTS, kế hoạch, state và đặc tả task đang làm; chat không có terminal chỉ hướng dẫn/chỉnh mã, không chứng minh đã chạy test.
5. Yêu cầu agent chạy `python scripts/rpa.py check` và `next` từ thư mục kit. Task đầu tiên là AUDIT. Không yêu cầu bạn xác nhận lại các sửa đổi local thông thường đã nằm trong phạm vi.
6. Khi đổi mô hình/hết quota: lưu các file thay đổi và checkpoint; chuyển cả repo hiện tại, không chỉ ZIP ban đầu. Dán `prompts/RESUME.md` vào phiên mới.

## Cách dùng theo môi trường
| Môi trường | Điểm vào | Kiểm tra |
|---|---|---|
| Gemini CLI | GEMINI.md dẫn tới AGENTS.md | Yêu cầu agent liệt kê tệp hướng dẫn vừa đọc; vẫn dán BOOTSTRAP khi cần |
| VS Code + agent extension | AGENTS.md; Copilot dùng .github/copilot-instructions.md | VS Code là IDE, cần extension/harness agent và quyền terminal |
| Antigravity IDE | Mở workspace rồi dán BOOTSTRAP | Không giả định IDE tự nạp một thư mục cấu hình riêng; yêu cầu đọc các tệp bằng đường dẫn |
| Claude/Codex hoặc agent khác | CLAUDE.md hoặc AGENTS.md; BOOTSTRAP dùng chung | Không phụ thuộc model version; kiểm tra file/terminal/test thực tế |

Tệp hướng dẫn giúp truyền ngữ cảnh; không bảo đảm mọi mô hình đều đủ khả năng thực hiện hoặc tự nhận tệp. Không tự kích hoạt chế độ bỏ qua quyền.

## Đầu vào cần tìm trong AUDIT
Repo/branch thật, thay đổi chưa commit, phiên bản runtime, ngân sách host, DB hiện có, Excel mục tiêu, dữ liệu demo, ngành sản xuất và chính sách lương. Thiếu host không chặn code local; thiếu quy tắc ngành giữ tính năng tương ứng BLOCKED, không bịa chính sách.
