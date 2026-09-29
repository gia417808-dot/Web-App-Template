# Hợp đồng KPI chính KD01
Input: `qty,unit_price,discount_pct`. Excel Table dự kiến có đúng các tên cột ASCII này; UI có thể dùng nhãn tiếng Việt.
```excel
=ROUND([@qty]*[@unit_price]*(1-[@discount_pct]/100),0)
```
Rule backend: qty > 0; unit_price nguyên >= 0; discount_pct trong [0,100]. Làm tròn HALF_UP theo dòng rồi cộng; hủy đơn không cộng doanh thu.
Expected thường: `{"qty": "2", "unit_price": "100001", "discount_pct": "10"}` → `180002`.
Oracle độc lập: tests/oracle.json. “error” là mã lỗi hoặc mã ngoại lệ/reason theo rule: OVERPAYMENT vẫn giữ số âm, REQUIRED_FIELD/invalid chặn input. NS04/KT01 số âm cần cảnh báo, không tự ép 0.

Công thức là biểu thức lõi, chưa bao đủ validation/blank guards trên workbook. Generator phải bọc guard required/invalid tương ứng và trả ô trống + cột cảnh báo khi null/error, không để Excel ép blank thành 0. Expected date dùng as_of_date cố định, không TODAY trong test.

Để G0 PASS: bổ sung tất cả cột/KPI, sheet/table/column map, vùng mở rộng, nguồn aggregate và hàm TypeScript chữ ký cụ thể; ca blank/canceled/overdue/zero/rounding phải PASS hoặc N/A có lý do theo nghiệp vụ. Không coi biểu thức này là workbook hoàn chỉnh.
