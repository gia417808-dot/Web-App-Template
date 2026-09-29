# KT05: Lãi gộp theo đơn

Persona: chủ doanh nghiệp một người; giao diện tiếng Việt, mở rộng quyền theo tổ chức.
Nguồn yêu cầu: `lãi gộp = doanh thu thuần − giá vốn theo dòng; thiếu giá vốn báo thiếu dữ liệu`.
Hành động nghiệp vụ cần hiện thực: **tinhLaiGop**.
Entity nguồn: DonHang, ChiTietDon, GiaVon; quyền sở hữu và tránh bảng trùng theo governance/DOMAIN_MAP.md.

## Quy tắc riêng
Thiếu cost trả null/MISSING_COST; chỉ dòng đã ghi nhận, giá vốn snapshot tại xuất; không dùng giá danh mục hiện tại.

## Workflow đề xuất cần khóa ở G0
calculated → reviewed; projection tái tạo khi ledger điều chỉnh
Mỗi cạnh trạng thái cần guard, actor, side effects, audit và ca test; frontend không gửi tùy ý status để bỏ qua action.

## Tác vụ người dùng
1. Xem danh sách/bộ lọc theo kỳ và trạng thái, truy ngược bảng nguồn.
2. Tạo/sửa dữ liệu nháp với validation và row_version; master/reference phải cùng tổ chức.
3. Thực hiện tinhLaiGop, thấy kết quả hoặc lỗi nghiệp vụ tiếng Việt; retry không nhân đôi side effect.
4. Xem KPI chính và ngoại lệ; export Excel, sửa input offline rồi import preview/conflict.

## Cấm
Không sửa trực tiếp chứng từ đã khóa/post; không coi giá trị trống là 0; không ghi kết quả tính từ client làm nguồn chuẩn. Policy không áp dụng (ví dụ kỳ khóa cho master data) phải ghi N/A có lý do ở review, không dựng hành vi thừa.
