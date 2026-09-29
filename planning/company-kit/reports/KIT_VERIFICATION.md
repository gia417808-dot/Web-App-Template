# Kiểm tra bộ bàn giao

Ngày tạo: 29/09/2026. Runtime kiểm tra: Python 3.12.14, Linux.

| Kiểm tra | Kết quả | Bằng chứng |
|---|---|---|
| Đủ 30 ID, file bắt buộc, JSON, DAG, FK và entity-map | PASS | kit_check.log |
| Công cụ Review–Plan–Act: 13 unit tests | PASS | unit_tests.log |
| Task kế tiếp đúng AUDIT | PASS | next_task.log |
| Release bị chặn khi 35 task còn pending | PASS — exit 1 đúng dự kiến | release_block.log |

Đã kiểm tra: trạng thái không cho nhảy bước; phụ thuộc; một task active; thiếu evidence; file evidence đổi hash; gate NOT_RUN; path traversal; lock ghi đồng thời; mở lại task vô hiệu hóa task phụ thuộc; dependency cycle; không ghi state khi kiểm tra lỗi. Test dùng thư mục tạm và manifest giả phục vụ unit test, không đẩy chúng vào evidence sản phẩm.

Các check này chỉ kiểm tra bộ hồ sơ và công cụ điều phối. Chưa chạy code ứng dụng, unit nghiệp vụ TypeScript, API/DB/UI, Excel recalc, hosting, backup/restore thật. Mọi gate sản phẩm vẫn NOT_RUN; state gốc vẫn pending. Không có package.json/migration/xlsx hoàn chỉnh được tuyên bố trong kit.

74 entity là mô hình logic đề xuất có fields/ownership/references, phải audit physical schema trước migration. 30 bộ oracle chỉ phủ KPI chính; G0 yêu cầu bổ sung toàn bộ formula/workflow và fixture liên bảng. 900 dòng calculator demo lặp lại chỉ để thử input/UI, không thay dữ liệu seed nghiệp vụ.

Bộ kit chưa sửa repo hoặc nhánh GitHub của người dùng và chưa cài skill vào tài khoản. @skill đã được chuyển thành chính sách dự án tại AGENTS/rules để phiên sau đọc lại.
