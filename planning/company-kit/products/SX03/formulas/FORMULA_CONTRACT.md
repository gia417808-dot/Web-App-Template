# Hợp đồng KPI chính SX03
Input: `progress_a,weight_a,progress_b,weight_b`. Excel Table dự kiến có đúng các tên cột ASCII này; UI có thể dùng nhãn tiếng Việt.
```excel
=IF(SUM([@weight_a],[@weight_b])=0,"",SUMPRODUCT([@[progress_a]],[@[weight_a]])/SUM([@weight_a],[@weight_b])+SUMPRODUCT([@[progress_b]],[@[weight_b]])/SUM([@weight_a],[@weight_b]))
```
Rule backend: Ví dụ 2 công đoạn; triển khai tổng quát N công đoạn SUM(p*w)/SUM(w), progress 0..1, weights >=0; tổng weight=0 trả null.
Expected thường: `{"progress_a": "1", "weight_a": "1", "progress_b": "0.5", "weight_b": "3"}` → `0.625`.
Oracle độc lập: tests/oracle.json. “error” là mã lỗi hoặc mã ngoại lệ/reason theo rule: OVERPAYMENT vẫn giữ số âm, REQUIRED_FIELD/invalid chặn input. NS04/KT01 số âm cần cảnh báo, không tự ép 0.

Công thức là biểu thức lõi, chưa bao đủ validation/blank guards trên workbook. Generator phải bọc guard required/invalid tương ứng và trả ô trống + cột cảnh báo khi null/error, không để Excel ép blank thành 0. Expected date dùng as_of_date cố định, không TODAY trong test.

Để G0 PASS: bổ sung tất cả cột/KPI, sheet/table/column map, vùng mở rộng, nguồn aggregate và hàm TypeScript chữ ký cụ thể; ca blank/canceled/overdue/zero/rounding phải PASS hoặc N/A có lý do theo nghiệp vụ. Không coi biểu thức này là workbook hoàn chỉnh.
