# KD02: Pipeline cơ hội

Persona: chủ doanh nghiệp một người; giao diện tiếng Việt, mở rộng quyền theo tổ chức.
Nguồn yêu cầu: `giá trị kỳ vọng = giá trị × xác suất; cơ hội mất không cộng forecast`.
Hành động nghiệp vụ cần hiện thực: **chuyenGiaiDoan**.
Entity nguồn: CoHoi, GiaiDoan; quyền sở hữu và tránh bảng trùng theo governance/DOMAIN_MAP.md.

## Quy tắc riêng
Xác suất 0..100; lost có forecast 0, won 100%; lưu lịch sử chuyển giai đoạn.

## Workflow đề xuất cần khóa ở G0
new → qualified → proposal → won|lost; đổi giai đoạn ghi lịch sử
Mỗi cạnh trạng thái cần guard, actor, side effects, audit và ca test; frontend không gửi tùy ý status để bỏ qua action.

## Tác vụ người dùng
1. Xem danh sách/bộ lọc theo kỳ và trạng thái, truy ngược bảng nguồn.
2. Tạo/sửa dữ liệu nháp với validation và row_version; master/reference phải cùng tổ chức.
3. Thực hiện chuyenGiaiDoan, thấy kết quả hoặc lỗi nghiệp vụ tiếng Việt; retry không nhân đôi side effect.
4. Xem KPI chính và ngoại lệ; export Excel, sửa input offline rồi import preview/conflict.

## Cấm
Không sửa trực tiếp chứng từ đã khóa/post; không coi giá trị trống là 0; không ghi kết quả tính từ client làm nguồn chuẩn. Policy không áp dụng (ví dụ kỳ khóa cho master data) phải ghi N/A có lý do ở review, không dựng hành vi thừa.
