# UI KD05
Route mục tiêu `/app/kd05`; registry ID=KD05. List, form, detail/history, dashboard, import-preview/export. Hiển thị Chăm sóc khách hàng và action lapLichChamSoc; state theo DOMAIN_SPEC. Input KPI last_contact_date, as_of_date chỉ xuất hiện dạng nhập nếu schema xác định là nguồn; aggregate lấy server. Form phải có business fields của entity, không chỉ calculator.
Nhận lỗi theo code, translated tiếng Việt; disable duplicate submit, hiển thị version conflict diff; chưa có mạng vẫn giữ draft local nếu được thiết kế rõ, không giả vờ saved. E2E xác minh refresh và DB.
