# Test SX03
1. Unit calculator: mọi case oracle.json, không tính lại expected bằng hàm triển khai; date/decimal/rounding đúng.
2. Workflow: pending → in_progress → completed|blocked; nhật ký append-only; cạnh hợp lệ và cạnh bị cấm, duplicate action, stale version.
3. Rule riêng: Ví dụ 2 công đoạn; triển khai tổng quát N công đoạn SUM(p*w)/SUM(w), progress 0..1, weights >=0; tổng weight=0 trả null.
4. Integration: database thật, tenant A/B, master FK, transaction rollback khi giữa chừng lỗi; nếu side effect tiền/kho chạy 2 request đồng thời.
5. Workbook: mở Excel 365 recalc/save, append/sort và validation, so server expected; input formula injection bị chặn.
6. Roundtrip: export→sửa input→preview→commit, replay, current row_version khác, khóa chứng từ, file org khác.
7. UI: login→list→create/update→capNhatTienDo→dashboard drilldown; mobile+desktop, empty/error.
8. Ops: cài sạch + restore dữ liệu của module, không chỉ health check.
9. Ca hủy/quá hạn: xác định áp dụng ở DOMAIN_SPEC; nếu không có khái niệm ghi N/A kèm lý do, không bỏ im lặng.
