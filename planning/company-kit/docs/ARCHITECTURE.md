# Kiến trúc cần triển khai

ADR-001: TypeScript monorepo; React cho admin/catalog, Node API, PostgreSQL. Đây là hướng công nghệ theo bản gốc, không ép thay stack repo đang chạy. AUDIT phải chọn runtime/thư viện đang được hỗ trợ từ nguồn chính thức, ghi phiên bản chính xác và lockfile trong ADR-002 trước cài đặt. Không sử dụng `latest` cho production.

`packages/domain`: pure rules, decimal, trạng thái và oracle. `apps/api`: auth, service, repository, transaction. `packages/workbook-engine`: render schema→Tables/validation/protection; export/import preview, không thực thi formula từ file nhập. `packages/ui`: form/table/filter/accessibility. `packages/auth-audit`: authorization, tenant filter, audit event. Admin và catalog là 2 entry riêng, dùng cùng catalog metadata nhưng public chỉ công bố module đã đủ gate.

Một PostgreSQL là nguồn dữ liệu chuẩn. Không dual-write Sheets. Entity chung có UUID, organization_id, UTC timestamps, row_version tăng mỗi cập nhật, deleted_at. FK chéo tenant dùng composite (organization_id,id); unique nghiệp vụ theo tổ chức. Backend derive organization từ phiên đã xác thực, không từ payload. Secret chỉ env, không export workbook.

Tiền: bigint VND ở DB, decimal string trong JSON để tránh JS safe-integer loss. Quantity: numeric(20,6); discount: numeric(7,4); domain decimal chính xác. HALF_UP tiền theo dòng; tổng bằng tổng dòng đã làm tròn. Phép chia giữ decimal đến UI; giá trị thiếu là null kèm reason, không biến thành 0. as_of_date do request/test cố định, tránh kết quả trôi theo đồng hồ.

Transaction boundaries: xác nhận đơn ghi order+snapshot+receivable event; xuất kho ghi voucher+ledger+cost snapshot; receipt ghi cash+allocations; sản xuất ghi consumption/output qua warehouse service. Dùng outbox cùng transaction nếu cần worker. Event có event_id, source_type/source_id, organization_id, occurred_at, schema_version. Consumer dedup event_id; retry có backoff/giới hạn và hàng đợi lỗi.

Không cho chỉnh trực tiếp chứng từ posted. Hủy trước post là trạng thái, sau post là reversal reference đến bản gốc. Transaction đã chốt phải audit actor/action/before/after/reason/correlation_id; không ghi password/token. Row_version update có điều kiện; không khớp trả 409.

Dashboard dựa trên query projection cùng định nghĩa kỳ. Mỗi KPI mở bộ lọc bảng gốc. Catalog không có nút mua/“sẵn dùng” khi gate chưa đạt. Mobile ưu tiên bảng có scroll có nhãn, form đọc được, trạng thái loading/empty/error và keyboard.
