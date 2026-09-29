# UI SX05
Route mục tiêu `/app/sx05`; registry ID=SX05. List, form, detail/history, dashboard, import-preview/export. Hiển thị Giá thành lệnh và action tinhGiaThanh; state theo DOMAIN_SPEC. Input KPI valid_cost, good_qty chỉ xuất hiện dạng nhập nếu schema xác định là nguồn; aggregate lấy server. Form phải có business fields của entity, không chỉ calculator.
Nhận lỗi theo code, translated tiếng Việt; disable duplicate submit, hiển thị version conflict diff; chưa có mạng vẫn giữ draft local nếu được thiết kế rõ, không giả vờ saved. E2E xác minh refresh và DB.
