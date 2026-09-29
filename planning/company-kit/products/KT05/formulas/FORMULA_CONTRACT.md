# Hợp đồng KPI chính KT05
Input: `net_revenue,cost`. Excel Table dự kiến có đúng các tên cột ASCII này; UI có thể dùng nhãn tiếng Việt.
```excel
=[@net_revenue]-[@cost]
```
Rule backend: Thiếu cost trả null/MISSING_COST; chỉ dòng đã ghi nhận, giá vốn snapshot tại xuất; không dùng giá danh mục hiện tại.
Expected thường: `{"net_revenue": "1000000", "cost": "650000"}` → `350000`.
Oracle độc lập: tests/oracle.json. “error” là mã lỗi hoặc mã ngoại lệ/reason theo rule: OVERPAYMENT vẫn giữ số âm, REQUIRED_FIELD/invalid chặn input. NS04/KT01 số âm cần cảnh báo, không tự ép 0.

Công thức là biểu thức lõi, chưa bao đủ validation/blank guards trên workbook. Generator phải bọc guard required/invalid tương ứng và trả ô trống + cột cảnh báo khi null/error, không để Excel ép blank thành 0. Expected date dùng as_of_date cố định, không TODAY trong test.

Để G0 PASS: bổ sung tất cả cột/KPI, sheet/table/column map, vùng mở rộng, nguồn aggregate và hàm TypeScript chữ ký cụ thể; ca blank/canceled/overdue/zero/rounding phải PASS hoặc N/A có lý do theo nghiệp vụ. Không coi biểu thức này là workbook hoàn chỉnh.
