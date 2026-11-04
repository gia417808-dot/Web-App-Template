# Ngữ cảnh agent
Đọc `AGENTS.md` tại root repo và `docs/deployment/RUNBOOK.md`. Áp dụng @skill, Review → Plan → Act → Verify → Checkpoint. Source code ở root repo; hồ sơ tại planning/company-kit.

## 🌟 Trạng Thái: `GOLDEN_MASTER_COMMERCIAL_PRO`
Đã nghiệm thu và tích hợp 5 Mẫu Gốc Commercial Pro:
- `GS-001` (`GS-001-hr` — **v4.0**, 8 Sheets): Nhân Sự, Chấm Công, KPI & Tính Lương Tự Động.
- `GS-002` (`GS-002-warehouse` — **v3.0**, 7 Sheets): Nhập Xuất Tồn Đa Kho & Cảnh Báo Định Mức.
- `GS-003` (`GS-003-finance` — **v4.1**, 7 Sheets): Thu Chi, Sổ Quỹ Đa Tài Khoản & Dòng Tiền Startup.
- `GS-004` (`GS-004-project` — **v4.4**, 7 Sheets): Quản Lý Dự Án, CRM, Kanban/Gantt & RACI.
- `GS-005` (`GS-005-pos` — **v3.3**, 8 Sheets): Nhà Hàng, Cafe POS Tính Giờ, VIP & Bếp KDS.

Lệnh kiểm tra: `python tools/deployment/verify_project.py --group application` hoặc `python tools/verify_golden_master.py`.
Lệnh đồng bộ 2 máy tính: `python sync_to_github.py --repo-dir . --push`.
Không khai PASS nếu chưa chạy đúng kiểm tra.
