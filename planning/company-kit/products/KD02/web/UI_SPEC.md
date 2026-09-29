# UI KD02
Route mục tiêu `/app/kd02`; registry ID=KD02. List, form, detail/history, dashboard, import-preview/export. Hiển thị Pipeline cơ hội và action chuyenGiaiDoan; state theo DOMAIN_SPEC. Input KPI value, probability_pct chỉ xuất hiện dạng nhập nếu schema xác định là nguồn; aggregate lấy server. Form phải có business fields của entity, không chỉ calculator.
Nhận lỗi theo code, translated tiếng Việt; disable duplicate submit, hiển thị version conflict diff; chưa có mạng vẫn giữ draft local nếu được thiết kế rõ, không giả vờ saved. E2E xác minh refresh và DB.
