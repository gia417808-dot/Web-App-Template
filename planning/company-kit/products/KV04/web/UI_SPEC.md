# UI KV04
Route mục tiêu `/app/kv04`; registry ID=KV04. List, form, detail/history, dashboard, import-preview/export. Hiển thị Kiểm kê và action chotKiemKe; state theo DOMAIN_SPEC. Input KPI counted, book_at_snapshot chỉ xuất hiện dạng nhập nếu schema xác định là nguồn; aggregate lấy server. Form phải có business fields của entity, không chỉ calculator.
Nhận lỗi theo code, translated tiếng Việt; disable duplicate submit, hiển thị version conflict diff; chưa có mạng vẫn giữ draft local nếu được thiết kế rõ, không giả vờ saved. E2E xác minh refresh và DB.
