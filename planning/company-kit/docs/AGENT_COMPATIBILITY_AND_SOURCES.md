# Tính tương thích và nguồn kiểm tra

Tài liệu dự án dùng Markdown + JSON + Python chuẩn, không phụ thuộc mô hình. Auto-discovery tùy harness: Gemini CLI có GEMINI.md; VS Code hướng dẫn Copilot/AGENTS tùy agent được chọn. Antigravity dùng BOOTSTRAP đọc tệp rõ ràng; chưa xác minh cơ chế config riêng, không tạo rule file không rõ hỗ trợ.

Nguồn chính thức đã tham khảo ngày 29/09/2026:
- https://code.visualstudio.com/docs/agent-customization/custom-instructions — định dạng hướng dẫn phụ thuộc harness.
- https://geminicli.com/docs/cli/gemini-md/ — nạp ngữ cảnh qua GEMINI.md.
- https://www.postgresql.org/docs/current/backup.html — các phương pháp backup/restore; triển khai phải chọn theo phiên bản DB thật.

Các quy tắc tiền, sản phẩm và phạm vi xuất phát từ docs/SOURCE_PLAN_4_DAYS.md. Lịch 5 ngày, policy ca <24h, ngưỡng vận hành và quy tắc tỷ lệ unique là đề xuất thiết kế mới; xác nhận bằng ADR khi khác nhu cầu. Chưa đọc mã repo GitHub trong lần tạo bộ kit; không nhận định repo hiện có đã triển khai tới đâu.
