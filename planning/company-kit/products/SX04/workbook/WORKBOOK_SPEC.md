# Workbook SX04
Tên đầu ra: `SX04_3.0.0-vi.xlsx` chỉ gắn release version sau gate. Sheets: HuongDan, DanhMuc, DauVao cho PhieuKiem, LoaiLoi, BaoCao, Dashboard, Meta. Nếu header/lines tách thành sheets riêng, lưu map hoàn chỉnh ở contract trước code.
Table KPI ví dụ `T_SX04_KPI` dùng columns defective_units, inspected_units cùng `result`, `validation_message`; không coi tất cả KPI input là raw input nếu chúng là aggregate. Formula theo FORMULA_CONTRACT, có blank/invalid guard, unlocked inputs/locked formulas, validation, định dạng và stable IDs. Raw document sheets dùng canonical DB fields và row_version.
Export/import theo docs/EXCEL_IMPORT_EXPORT; 30–100 dòng demo thực cần bổ sung ở SEED_PLAN. Chưa có xlsx binary trong kit, agent phải generate và recalc trên Excel thật để G_EXCEL PASS.
