# UI MK01
Route mục tiêu `/app/mk01`; registry ID=MK01. List, form, detail/history, dashboard, import-preview/export. Hiển thị Lịch nội dung và action lapLichDang; state theo DOMAIN_SPEC. Input KPI published_on_time, due_count chỉ xuất hiện dạng nhập nếu schema xác định là nguồn; aggregate lấy server. Form phải có business fields của entity, không chỉ calculator.
Nhận lỗi theo code, translated tiếng Việt; disable duplicate submit, hiển thị version conflict diff; chưa có mạng vẫn giữ draft local nếu được thiết kế rõ, không giả vờ saved. E2E xác minh refresh và DB.
