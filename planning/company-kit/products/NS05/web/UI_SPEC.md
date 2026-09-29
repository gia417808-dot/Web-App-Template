# UI NS05
Route mục tiêu `/app/ns05`; registry ID=NS05. List, form, detail/history, dashboard, import-preview/export. Hiển thị Tuyển dụng và cộng tác viên và action chuyenVongTuyen; state theo DOMAIN_SPEC. Input KPI opened_date, hired_date chỉ xuất hiện dạng nhập nếu schema xác định là nguồn; aggregate lấy server. Form phải có business fields của entity, không chỉ calculator.
Nhận lỗi theo code, translated tiếng Việt; disable duplicate submit, hiển thị version conflict diff; chưa có mạng vẫn giữ draft local nếu được thiết kế rõ, không giả vờ saved. E2E xác minh refresh và DB.
