# Gate và định nghĩa hoàn thành

| Gate | Điều kiện | Evidence tối thiểu |
|---|---|---|
| G0 | Spec, schema vật lý/khóa/constraint, công thức cho mọi cột/KPI, fixture liên kết 30–100 dòng, expected độc lập, API/UI contract được review | review.md, schema/fixtures validated, mapping legacy |
| G1 | Domain + API CRUD/actions/integration/import-export + regression | command log, exit code, expected/actual, negative/concurrency cases |
| G_EXCEL | Workbook thật mở tính lại đúng trên Excel mục tiêu; append/sort/validation/protection/roundtrip | xlsx + recalc values + Excel version + ảnh và report |
| G_WEB | Build, login, role/tenant, CRUD, dashboard drilldown, desktop/mobile E2E | build log, E2E log, screenshots không PII |
| G_OPS | Cài sạch, backup/restore thật trên DB thử, restart, theo dõi, rollback | runbook cùng log và dữ liệu sau phục hồi |

G2/G3 Google chỉ áp dụng khi quảng cáo Sheets/AppSheet; mặc định không áp dụng, không PASS giả. G4 ready_to_sell cần tất cả gate liên quan + onboarding/licensing/nội dung bán đúng khả năng và kiểm tra kinh doanh riêng; sprint này không mặc định bán sản phẩm.

Trạng thái evidence: PASS, FAIL, NOT_RUN, BLOCKED_EXTERNAL. FAIL hoặc blocker không được coi PASS. Tất cả 30 ở draft_for_review khi nhận kit. `check` chỉ kiểm tra tính toàn vẹn kit. `release-check` cần mọi task done + evidence gate; kiểm tra manifest không thay việc người review đọc logs/ảnh.

Evidence đặt `reports/evidence/<TASK>/<RUN>/manifest.json`, ghi task_id, source_revision, timestamp ISO có timezone, environment, reviewer, gates [{id,status,expected,actual,command,exit_code,files:[{path,sha256}]}]. Path tương đối gốc kit, ở reports/evidence; file phải tồn tại, không rỗng, hash đúng. Manual QA dùng command='MANUAL: ...' và exit_code=null, vẫn ghi observed actual. Revision nên là full Git SHA của code đã test; nếu dirty, ghi revision kèm diff hash và lưu diff, không gọi đó clean release.

Không log secrets. Gate PASS của manifest phải được kiểm tra thực tế. rpa.py chặn thiếu gate/evidence/hash nhưng không thể phát hiện người khai gian hoặc thay review chuyên môn.
