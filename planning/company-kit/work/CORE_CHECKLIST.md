# Checklist nền tảng — thực hiện trong AUDIT/CORE

## AUDIT / gate REVIEW
- [ ] Xác định Git root/branch/revision và dirty files, hướng dẫn repo và subfolder.
- [ ] Kiểm kê ứng dụng thật, legacy F/U, release chỉ đọc; map vào 30 ID trong LEGACY_MAPPING.csv, không tự gán khi thiếu dữ kiện.
- [ ] Ghi OS, Node/package manager, Python, DB, Excel đang có; chạy lệnh build/test hiện hữu và lưu nguyên lỗi.
- [ ] Xác định host/chi phí/máy bật liên tục, credential thiếu, ngành SX và payroll config.
- [ ] Báo phần tái sử dụng và phần cần xây; ước lượng lại 5 ngày theo code đã quan sát.

## CORE / gate DESIGN
- [ ] Khóa ADR-002 exact dependencies theo tương thích; một package manager và lockfile; giữ repo có sẵn nếu phù hợp.
- [ ] Review 30 product schema/entity map, canonical ownership, primary/FK/index/unique, trạng thái, permission, policy.
- [ ] OpenAPI thật theo API_CONTRACT; JSON decimal string; error code và pagination thống nhất.

## CORE / gate BUILD
- [ ] Tạo workspace apps/packages, scripts build/typecheck/lint/test/test:integration/test:e2e/db:migrate/db:seed/workbook:generate theo toolchain đã chọn.
- [ ] Build/admin/catalog/API, typecheck và health endpoint chạy thật trên clean install.
- [ ] CI dùng exact runtime + frozen lockfile, build/typecheck/unit; integration DB riêng và report khi fail. Không chỉ CI validate kit.

## CORE / gate AUTH + DB
- [ ] Session owner one-time setup; auth ở server, tenant A/B negative tests, PII scope.
- [ ] Migration local test, seed idempotent, transaction, row_version, audit, idempotency mismatch.
- [ ] Decimal HALF_UP, integer money JSON handling, date UTC/local boundary.
- [ ] Backup/restore smoke test DB demo để module sau dùng lại; migration không phá dữ liệu.

## CORE / gate WORKBOOK_ENGINE
- [ ] Tạo workbook đơn giản thật từ KD01 schema, Excel Tables/formula/validation/input protection/meta.
- [ ] Import preview kiểm tra allowed columns, IDs/version, malicious formula, zip size; commit all-or-nothing và retry.
- [ ] Test engine cấu trúc/roundtrip. Excel recalculation gate sản phẩm cần thực hiện riêng, không suy từ test engine.

Các tên npm scripts phía trên là hợp đồng phải tạo sau chọn toolchain, chưa phải lệnh có sẵn ở kit. Lưu command thực tế trong docs/LOCAL_COMMANDS.md khi CORE xong.
