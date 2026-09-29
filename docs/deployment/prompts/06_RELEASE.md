Áp dụng @skill. Nghiệm thu hệ thống theo đúng 30 ID, không dựa số file hoặc số test exit 0. Review ma trận G0/G1/G_EXCEL/G_WEB/G_OPS và source revision cùng evidence. Chạy clean install, build/typecheck, business/integration/E2E, Excel recalc, import conflict, backup/restore và restart trên môi trường được phép.

Phát hiện thiếu gate thì lập danh sách ID/blocker, sửa phần local có thể làm; không nâng status giả. Review staging/private host, TLS/secret/DB persistence/monitor/cost trước deploy. GitHub là source hosting, push không tự chứng minh app chạy. Không mua dịch vụ hoặc đổi public audience khi chưa được yêu cầu.

Ghi release candidate SHA, migration version, hướng dẫn người dùng, rollback, backup/restore evidence, số sản phẩm đạt và phần còn thiếu. Chỉ gọi toàn hệ thống hoàn thiện khi tất cả 30 cùng integration/operations đạt gate; thiếu thì bàn giao đúng mức hoàn thành. Không tự merge main nếu chưa được chỉ định.
