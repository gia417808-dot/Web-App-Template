# Checklist cho mỗi task sản phẩm

1. REVIEW: đọc các entity-map và công thức; kiểm tra code đã có và dependency; liệt kê điểm chưa rõ, không đọc cả repo vô hạn.
2. PLAN/G0: khóa field read/write/derived, FK và trạng thái; workbook table/column mapping; oracle thường/trống/hủy/quá hạn/zero/N/A; seed liên bảng 30–100 dòng thật.
3. ACT/domain: tính decimal, validation, state guards và unit test expected cố định.
4. ACT/server: migration, service transaction, tenant/version/idempotency/audit, route + integration tests.
5. ACT/web: list/form/action/detail/dashboard/import preview; dữ liệu từ API thật.
6. ACT/workbook: generate xlsx, input validation/formula columns/metadata, roundtrip conflict.
7. VERIFY: G1/G_WEB test log; G_EXCEL recalc thật; G_OPS restore dữ liệu module trên DB thử. Review diff, không chỉ test happy path.
8. CHECKPOINT: manifest/log/hash/actual revision, state done hoặc blocked, HANDOFF và acceptance matrix. Nếu thay shared engine, chạy regression sản phẩm bị ảnh hưởng và reopen evidence cũ khi cần.

Không để 30 task cùng phase act; một task hoạt động tại một thời điểm cho bộ điều phối local. Nếu công việc quá lớn, checkpoint note rõ lát cắt đã xong/chưa xong trong task.
