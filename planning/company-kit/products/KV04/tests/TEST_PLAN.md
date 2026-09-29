# Test KV04
1. Unit calculator: mọi case oracle.json, không tính lại expected bằng hàm triển khai; date/decimal/rounding đúng.
2. Workflow: draft → counting → reviewed → posted; snapshot phải còn hợp lệ; cạnh hợp lệ và cạnh bị cấm, duplicate action, stale version.
3. Rule riêng: Chốt theo snapshot; nếu có phát sinh sau snapshot phải đối soát trước post adjustment; chốt lại cùng key không ghi đôi.
4. Integration: database thật, tenant A/B, master FK, transaction rollback khi giữa chừng lỗi; nếu side effect tiền/kho chạy 2 request đồng thời.
5. Workbook: mở Excel 365 recalc/save, append/sort và validation, so server expected; input formula injection bị chặn.
6. Roundtrip: export→sửa input→preview→commit, replay, current row_version khác, khóa chứng từ, file org khác.
7. UI: login→list→create/update→chotKiemKe→dashboard drilldown; mobile+desktop, empty/error.
8. Ops: cài sạch + restore dữ liệu của module, không chỉ health check.
9. Ca hủy/quá hạn: xác định áp dụng ở DOMAIN_SPEC; nếu không có khái niệm ghi N/A kèm lý do, không bỏ im lặng.
