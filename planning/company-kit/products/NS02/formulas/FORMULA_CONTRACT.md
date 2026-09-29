# Hợp đồng KPI chính NS02
Input: `clock_in,clock_out`. Excel Table dự kiến có đúng các tên cột ASCII này; UI có thể dùng nhãn tiếng Việt.
```excel
=24*MOD([@clock_out]-[@clock_in],1)
```
Rule backend: Ca <24 giờ, giờ bằng nhau trả lỗi AMBIGUOUS_SHIFT; trên 24 giờ phải dùng datetime; trừ nghỉ bằng trường cấu hình riêng trước khi tính lương.
Expected thường: `{"clock_in": "22:00", "clock_out": "06:00"}` → `8`.
Oracle độc lập: tests/oracle.json. “error” là mã lỗi hoặc mã ngoại lệ/reason theo rule: OVERPAYMENT vẫn giữ số âm, REQUIRED_FIELD/invalid chặn input. NS04/KT01 số âm cần cảnh báo, không tự ép 0.

Công thức là biểu thức lõi, chưa bao đủ validation/blank guards trên workbook. Generator phải bọc guard required/invalid tương ứng và trả ô trống + cột cảnh báo khi null/error, không để Excel ép blank thành 0. Expected date dùng as_of_date cố định, không TODAY trong test.

Để G0 PASS: bổ sung tất cả cột/KPI, sheet/table/column map, vùng mở rộng, nguồn aggregate và hàm TypeScript chữ ký cụ thể; ca blank/canceled/overdue/zero/rounding phải PASS hoặc N/A có lý do theo nghiệp vụ. Không coi biểu thức này là workbook hoàn chỉnh.
