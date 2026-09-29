# UI KV02
Route mục tiêu `/app/kv02`; registry ID=KV02. List, form, detail/history, dashboard, import-preview/export. Hiển thị Nhập xuất tồn và action ghiSoKho; state theo DOMAIN_SPEC. Input KPI opening, posted_in, posted_out chỉ xuất hiện dạng nhập nếu schema xác định là nguồn; aggregate lấy server. Form phải có business fields của entity, không chỉ calculator.
Nhận lỗi theo code, translated tiếng Việt; disable duplicate submit, hiển thị version conflict diff; chưa có mạng vẫn giữ draft local nếu được thiết kế rõ, không giả vờ saved. E2E xác minh refresh và DB.
