Áp dụng @skill. Chạy rpa.py next, chọn sản phẩm dependency-ready và đọc trọn spec của ID đó. Đừng bắt đầu 30 sản phẩm cùng lúc.

Review actual code+schema+domain+oracle. Plan một lát cắt hoàn chỉnh: dữ liệu đầu vào → action nghiệp vụ → transaction → API → UI → Excel roundtrip → dashboard. Ghi chỗ tái sử dụng core và rule khác biệt.

Act: hoàn tất G0 bằng schema vật lý/FK/constraints/read-write-derived, formula toàn bộ cột/KPI, 30–100 fixture liên kết và expected cố định. Code domain chính xác decimal/state; backend tenant/version/idempotency/audit; UI có lỗi/conflict/loading; workbook thật có Tables/validation/ID/version, import an toàn. Không chỉ tạo calculator UI để thay form nghiệp vụ.

Verify ca thường/trống/hủy/quá hạn/mẫu số 0 và concurrency theo applicability; backend/Excel thống nhất; UI E2E; backup/restore dữ liệu module. Thiếu Excel thật ghi BLOCKED_EXTERNAL, không PASS giả. Sửa lỗi, review diff rồi checkpoint. Nếu thay shared core, re-run regression và reopen gate bị stale.

Đồng bộ feature branch lên repo mới theo MASTER khi đủ điều kiện; không tự merge main. Báo ID, source paths, test actual, gate, SHA và next task.
