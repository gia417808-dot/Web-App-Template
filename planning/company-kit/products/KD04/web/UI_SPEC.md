# UI KD04
Route mục tiêu `/app/kd04`; registry ID=KD04. List, form, detail/history, dashboard, import-preview/export. Hiển thị Hợp đồng và gia hạn và action nhacGiaHan; state theo DOMAIN_SPEC. Input KPI expiry_date, as_of_date chỉ xuất hiện dạng nhập nếu schema xác định là nguồn; aggregate lấy server. Form phải có business fields của entity, không chỉ calculator.
Nhận lỗi theo code, translated tiếng Việt; disable duplicate submit, hiển thị version conflict diff; chưa có mạng vẫn giữ draft local nếu được thiết kế rõ, không giả vờ saved. E2E xác minh refresh và DB.
