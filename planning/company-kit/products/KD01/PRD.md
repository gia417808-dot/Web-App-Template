# Yêu cầu màn hình KD01
Tên menu: Báo giá và đơn hàng trong Kinh doanh.
Danh sách: tìm theo mã/tên, filter kỳ/trạng thái, phân trang; tổng KPI theo tập lọc trên server, không chỉ trang hiện tại.
Chi tiết: các entity BaoGia, DonHang, ChiTietDon, liên kết master, timeline audit, trạng thái hiện tại, action taoBaoGia, chotDon.
Form: chỉ input được phép; cảnh báo validation sát trường, cảnh báo dữ liệu stale khi 409. Sau lưu fetch server canonical values.
Dashboard: KPI hợp đồng trong formulas; số null hiển thị “Chưa đủ dữ liệu” kèm reason, không vẽ 0. Click KPI mở bảng nguồn.
Import: chọn file→preview lỗi/xung đột→commit→kết quả; export có ID/version và hướng dẫn.
Accessibility: label input, keyboard, focus lỗi, không dựa màu duy nhất; desktop và mobile 390px.
Acceptance: owner hoàn thành tác vụ từ UI tới DB, refresh vẫn đúng, user sai tenant không thấy dữ liệu; trạng thái empty/loading/error/retry hoạt động.
