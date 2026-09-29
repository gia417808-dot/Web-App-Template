# UI SX03
Route mục tiêu `/app/sx03`; registry ID=SX03. List, form, detail/history, dashboard, import-preview/export. Hiển thị Tiến độ công đoạn và action capNhatTienDo; state theo DOMAIN_SPEC. Input KPI progress_a, weight_a, progress_b, weight_b chỉ xuất hiện dạng nhập nếu schema xác định là nguồn; aggregate lấy server. Form phải có business fields của entity, không chỉ calculator.
Nhận lỗi theo code, translated tiếng Việt; disable duplicate submit, hiển thị version conflict diff; chưa có mạng vẫn giữ draft local nếu được thiết kế rõ, không giả vờ saved. E2E xác minh refresh và DB.
