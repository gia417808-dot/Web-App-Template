# Quy trình áp dụng @skill

Đây là chính sách dự án chuyển thể từ skill người dùng đã chỉ định; không phải cài đặt hay chỉnh sửa skill trên tài khoản.

Mỗi lượt: đối chiếu yêu cầu mới với mục tiêu 30 sản phẩm và checkpoint hiện tại. Nếu người dùng thay đổi phạm vi, ghi quyết định có ngày thay vì âm thầm thay backlog. Không hỏi lại dữ liệu đã có; xác thực sự kiện có thể đã thay đổi bằng repo thật.

## Review → Plan → Act → Verify → Checkpoint
1. Review: đọc task, phụ thuộc, diff hiện tại, log lỗi; xác định điều đã có bằng chứng và điều chưa biết. Kiểm tra root đúng, test đúng target.
2. Plan: một lát cắt 30–90 phút; liệt kê file sẽ đổi, invariant, expected cố định, lệnh kiểm tra và cách hoàn tác. Không chỉ viết “xây module”.
3. Act: sửa phần tối thiểu hoàn thành lát cắt; schema → domain → API → UI → Excel nếu phụ thuộc yêu cầu; giữ transaction và version. Không triển khai nhiều sản phẩm dang dở cùng lúc trên cùng cây làm việc.
4. Verify: chạy unit/integration/E2E cần thiết; xem diff và dữ liệu thật. Tự review theo vai reviewer sau khi code, ghi rõ là self-review; chỉ ghi independent review khi người/agent khác đã thực sự review.
5. Checkpoint: lưu report ở reports/evidence, cập nhật state và HANDOFF, ghi task kế tiếp. Tự tiếp tục nếu đủ điều kiện. Tối đa 2 lần thử cùng một cách sửa không thành, đổi giả thuyết hoặc BLOCKED với chẩn đoán.

## Mẫu cập nhật ngắn mỗi lượt
Review: đã xác minh gì, rủi ro nào còn mở.
Plan: task và tiêu chí đạt.
Act: thay đổi cụ thể.
Verify: lệnh, kết quả hoặc NOT_RUN.
Next: tiếp tục gì, blocker nếu có.

Vai trò planner/builder/reviewer là các lượt làm việc của một agent cũng được. Không bắt buộc mua thêm mô hình hoặc dùng multi-agent. Nếu dùng nhiều máy, mỗi máy một branch/worktree và một nhóm tệp; thay schema chung đi qua người tích hợp. Khóa của rpa.py chỉ bảo vệ state local, không phải distributed lock.
