# UI SX04
Route mục tiêu `/app/sx04`; registry ID=SX04. List, form, detail/history, dashboard, import-preview/export. Hiển thị Chất lượng và lỗi và action ghiNhanLoi; state theo DOMAIN_SPEC. Input KPI defective_units, inspected_units chỉ xuất hiện dạng nhập nếu schema xác định là nguồn; aggregate lấy server. Form phải có business fields của entity, không chỉ calculator.
Nhận lỗi theo code, translated tiếng Việt; disable duplicate submit, hiển thị version conflict diff; chưa có mạng vẫn giữ draft local nếu được thiết kế rõ, không giả vờ saved. E2E xác minh refresh và DB.
