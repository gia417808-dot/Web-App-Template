# Mô hình dữ liệu KT05 — draft cần G0
Entity nghiệp vụ: DonHang, ChiTietDon, GiaVon. Tên/ownership theo governance/DOMAIN_MAP.md. Schema JSON kèm theo chỉ mô tả input calculator, không thay schema database.

Mọi entity persisted: id UUID immutable PK; organization_id UUID NOT NULL FK; created_at/updated_at timestamptz; row_version bigint>0; deleted_at nullable. Unique (organization_id,id) để FK scope. Documents thêm code unique theo org, business_date, status, confirmed_at/actor khi thích hợp. Lines có parent_id FK cùng org, sequence, references tới master. Soft delete master không phá snapshot chứng từ.

KPI input columns: net_revenue, cost. Kiểu vận chuyển numeric là decimal string, ngày ISO; mapping DB numeric/bigint/date theo docs/ARCHITECTURE. Đây có thể là query aggregate chứ không phải trường nhập tay; agent phải phân loại từng field source/derived ở review.

G0 bắt buộc: hoàn tất bảng-cột cụ thể cho DonHang, ChiTietDon, GiaVon; cardinality/FK, unique/index, null/default, enum, check constraints, source-vs-formula, quyền read/write, migration và liên kết fixture. Không chạy ORM migration từ draft chung này.

Chi tiết entity/cột đề xuất đã có ở `entity-map.json` và `db/LOGICAL_DATA_DICTIONARY.json`; đọc `db/CONSTRAINTS.md` trước khóa schema. Hoàn tất physical mapping/source/derived và constraint bổ sung qua review G0.
