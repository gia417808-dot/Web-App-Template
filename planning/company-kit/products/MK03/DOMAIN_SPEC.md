# MK03: Lead theo nguồn

Persona: chủ doanh nghiệp một người; giao diện tiếng Việt, mở rộng quyền theo tổ chức.
Nguồn yêu cầu: `tỷ lệ chuyển đổi = lead thành khách / lead hợp lệ theo cùng kỳ`.
Hành động nghiệp vụ cần hiện thực: **ganNguonLead**.
Entity nguồn: Lead, NguonLead; quyền sở hữu và tránh bảng trùng theo governance/DOMAIN_MAP.md.

## Quy tắc riêng
Cohort theo ngày tạo lead; loại spam/trùng theo id chuẩn; converted <= valid_leads.

## Workflow đề xuất cần khóa ở G0
new → qualified → converted|invalid; merge duplicate có trace
Mỗi cạnh trạng thái cần guard, actor, side effects, audit và ca test; frontend không gửi tùy ý status để bỏ qua action.

## Tác vụ người dùng
1. Xem danh sách/bộ lọc theo kỳ và trạng thái, truy ngược bảng nguồn.
2. Tạo/sửa dữ liệu nháp với validation và row_version; master/reference phải cùng tổ chức.
3. Thực hiện ganNguonLead, thấy kết quả hoặc lỗi nghiệp vụ tiếng Việt; retry không nhân đôi side effect.
4. Xem KPI chính và ngoại lệ; export Excel, sửa input offline rồi import preview/conflict.

## Cấm
Không sửa trực tiếp chứng từ đã khóa/post; không coi giá trị trống là 0; không ghi kết quả tính từ client làm nguồn chuẩn. Policy không áp dụng (ví dụ kỳ khóa cho master data) phải ghi N/A có lý do ở review, không dựng hành vi thừa.
