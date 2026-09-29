# Excel độc lập và dữ liệu ứng dụng

Target mặc định để kiểm thử: Excel 365 desktop; xác minh thực tế ở AUDIT. Formula serialization dùng tên hàm tiếng Anh, dấu phân cách OOXML; UI locale có thể khác. Không tuyên bố Google Sheets/AppSheet tương thích khi chưa test.

Mỗi workbook có HuongDan, DanhMuc, DauVao, BaoCao, Dashboard và Meta. Dữ liệu chứng từ tách header/lines theo entity; Table tên ổn định không dấu. Công thức structured references để tự mở rộng; input màu riêng; validation có danh sách và giới hạn, freeze pane, filter, định dạng VND/ngày/tỷ lệ. Bảo vệ ô formula giúp tránh sửa nhầm, không phải cơ chế bảo mật.

Meta: product_id, schema_version, export_id, organization_ref không bí mật, generated_at, template_version. Mỗi row có stable UUID và row_version; không dùng ROW làm ID. Offline mới: ô ID trống được cấp UUID khi import preview, preview giữ mapping và commit retry không tạo lại. Export mới vẫn giữ ID/version.

Import chỉ nhận giá trị trong input columns được allowlist. Formula trong input bị từ chối (xlsx formula node hoặc chuỗi nguy hiểm theo ngữ cảnh), không eval macro/external link. Formula hợp lệ ở cột được generator quản lý thì bỏ giá trị client gửi và recompute server. Kiểm tra file thực, kích thước và zip bomb; không chỉ dựa đuôi file. Text bắt đầu =,+,-,@ ở cột text phải export dạng text; numeric âm hợp lệ vẫn là number, không cấm mọi dấu '-'.

Conflict: base_version khác current -> 409 với diff; cho user xem và chọn sửa bản mới, không last-write-wins. Locked/posted rows không cho cập nhật thông thường. Lưu import log/hash/actor/counts/errors; commit transaction toàn batch theo phiên bản đầu. File ngoại tổ chức không được thay tenant.

QA: workbook generator không phải calculation engine. Mở và recalc/save trong Excel mục tiêu rồi đối chiếu cached values với oracle cố định. Thử append/sort/filter, ô trống, hủy, denominator 0, date overdue và roundtrip với row_version conflict. Ảnh workbook và actual values là evidence; test đọc XML không thay gate Excel thật.
