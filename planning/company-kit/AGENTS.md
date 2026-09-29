# Hướng dẫn chung cho agent

Ngôn ngữ trao đổi/UI/tài liệu: tiếng Việt. Áp dụng yêu cầu `@skill` trong mỗi lượt: kiểm tra ngữ cảnh → căn chỉnh mục tiêu → review → plan → act → verify → checkpoint. Quy trình được cụ thể hóa tại `rules/WORKING_POLICY.md`; tên @skill không phải lệnh mà mọi IDE tự hỗ trợ.

Đọc theo thứ tự: START_HERE → work/HANDOFF → work/state.json → work/tasks.json → đặc tả task được chọn. Đọc KE_HOACH_5_NGAY và docs/ARCHITECTURE khi bắt đầu. Nạp tài liệu theo task, không nhồi cả 30 sản phẩm vào mỗi lượt.

Trước sửa repo hiện hữu: đọc hướng dẫn root và thư mục con, git status, branch, lockfile và lịch sử. Không ghi đè sửa đổi người dùng, release legacy hoặc bí mật. Không hard-code đường dẫn máy. Với kit đặt dưới planning/, hướng dẫn repo thật vẫn áp dụng theo phạm vi.

Giữ nguyên 30 ID; database là nguồn ghi chuẩn, Excel import qua preview/conflict. Tiền nguyên VND; quantity decimal; UTC lưu trữ và Asia/Ho_Chi_Minh hiển thị. Backend kiểm soát quyền, tính toán và trạng thái; không tin organization_id từ client.

Task chỉ DONE khi đủ gate và bằng chứng trên revision thực tế. Lỗi test phải sửa hoặc báo BLOCKED, không xóa/skip test để làm xanh. Không gọi schema draft, README hay hình demo là app đã xong.

Tự tiếp tục task sẵn sàng trong phạm vi khi còn công cụ/ngữ cảnh; không dừng sau một bản plan. Hết phiên/quota/credential thì checkpoint. Không hứa chạy nền ngoài phiên. Không tự mua dịch vụ, gửi email, công khai dữ liệu hoặc chạy migration phá dữ liệu.

Sau mỗi lát cắt: ghi kết quả Review, Plan, Act, Verify; file đã đổi; lệnh/exit code; task kế tiếp; hạn chế. Dùng `scripts/rpa.py`, đọc `work/README.md`. Khi không có công cụ, nói rõ NOT_RUN.
