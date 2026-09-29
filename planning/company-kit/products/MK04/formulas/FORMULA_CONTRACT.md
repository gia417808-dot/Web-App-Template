# Hợp đồng KPI chính MK04
Input: `total_cost,valid_leads`. Excel Table dự kiến có đúng các tên cột ASCII này; UI có thể dùng nhãn tiếng Việt.
```excel
=IF([@valid_leads]=0,"",[@total_cost]/[@valid_leads])
```
Rule backend: CPL tính từ tổng chi/tổng lead cùng cửa sổ; không lấy trung bình CPL từng ngày. Lead=0 trả null.
Expected thường: `{"total_cost": "300000", "valid_leads": "30"}` → `10000`.
Oracle độc lập: tests/oracle.json. “error” là mã lỗi hoặc mã ngoại lệ/reason theo rule: OVERPAYMENT vẫn giữ số âm, REQUIRED_FIELD/invalid chặn input. NS04/KT01 số âm cần cảnh báo, không tự ép 0.

Công thức là biểu thức lõi, chưa bao đủ validation/blank guards trên workbook. Generator phải bọc guard required/invalid tương ứng và trả ô trống + cột cảnh báo khi null/error, không để Excel ép blank thành 0. Expected date dùng as_of_date cố định, không TODAY trong test.

Để G0 PASS: bổ sung tất cả cột/KPI, sheet/table/column map, vùng mở rộng, nguồn aggregate và hàm TypeScript chữ ký cụ thể; ca blank/canceled/overdue/zero/rounding phải PASS hoặc N/A có lý do theo nghiệp vụ. Không coi biểu thức này là workbook hoàn chỉnh.
