# Kế hoạch triển khai toàn bộ phạm vi trong 5 ngày

Ngày 1–5: **29/09 đến 03/10/2026**, múi giờ Asia/Ho_Chi_Minh. Mốc mới thay mốc 4 ngày của tài liệu gốc. Đây là mục tiêu triển khai có gate, không phải cam kết 30 sản phẩm thương mại sẽ hoàn tất bất kể hiện trạng repo.

## Kết quả cần có
Một hệ thống với 30 màn hình nghiệp vụ, 30 workbook độc lập, đăng nhập owner, database chung, danh mục giới thiệu, CRM/ERP nối chứng từ, nhập/xuất có kiểm tra, dashboard truy về nguồn, backup/restore và hướng dẫn vận hành. G0–G_OPS phải có bằng chứng. Sheets/AppSheet không thuộc đợt này; chỉ thêm khi có yêu cầu và kiểm thử thực tế.

**Ngân sách năng lực:** giả định một người 8 giờ/ngày = 40 giờ tập trung; agent hỗ trợ code nhưng không thay Excel QA và quyết định nghiệp vụ. Nếu khởi đầu trắng, 30 sản phẩm hoàn chỉnh trong 40 giờ không phải kế hoạch đáng tin. Lịch dưới dùng các đợt mở rộng có điều kiện dựa trên nền tảng và code tái sử dụng đã kiểm chứng. Cuối ngày 1 quyết định năng lực; cuối ngày 2 đo tốc độ từ lát cắt đầu tiên. 30 bộ đặc tả trong kit chưa đồng nghĩa 30 phần mềm.

| Ngày | Review | Plan và Act (giờ làm việc tương đối) | Verify / đầu ra |
|---|---|---|---|
| 1 — 29/09 | 0–1h audit repo, hướng dẫn, dirty files, legacy, môi trường | 1–2h chốt kiến trúc/dependency; 2–5h CORE auth, DB, audit, UI shell; 5–7h master data và 30 spec/schema mapping; 7–8h review | AUDIT xong; CORE build/typecheck/auth/tenant/backup smoke; 30 phạm vi được rà soát, blocker ngành ghi rõ |
| 2 — 30/09 | 0–0.5h kiểm tra gate nền | 0.5–4h KD01 báo giá→đơn, Excel roundtrip; 4–6h KT01 thu chi/khóa kỳ; 6–7h KV01→KV02; 7–8h fix/review | Đơn và tiền/kho nhất quán; concurrency/idempotency không ghi đôi; Excel mở tính lại. Chưa qua thì dành ngày 3 sửa, không đẩy thêm module |
| 3 — 01/10 | 0–0.5h đo tốc độ và dependency | 0.5–2h MK01 và lịch việc; 2–4h KD02–05, MK02–05; 4–6h KV03–05, KT02–05 theo topo; 6–8h liên kết CRM/ERP + regression | Mục tiêu đợt 20 module KD/MK/KT/KV chỉ khi engine dùng lại đủ; nếu không, hoàn thiện 4 ưu tiên và ghi phần thiếu |
| 4 — 02/10 | 0–0.5h kiểm tra config HR/SX và dữ liệu | 0.5–3h NS01–05; 3–5.5h SX02→SX01→SX03/04→SX05; 5.5–7h 30 Excel/report; 7–8h review toàn bộ | Mục tiêu đủ 30 về chức năng; NS04 không tính thuế chưa đặc tả; SX không tự nối kho khi chưa đủ posting rules. Loại module chưa đạt khỏi bản phát hành |
| 5 — 03/10 | 0–1h đóng danh sách lỗi, feature freeze | 1–3h clean install/E2E 30 ID + Excel QA; 3–5h backup/restore, quyền, import conflict; 5–6h host private nếu được phép và có chi phí phù hợp; 6–8h restart/rollback/UAT, bàn giao | Release candidate có ma trận bằng chứng, workbook, URL private nếu đã deploy, hướng dẫn vận hành và backlog thật. Không phát hành nếu lỗi tiền/quyền/mất dữ liệu |

## Các bước áp dụng mỗi ngày
1. Mở agent, dùng RESUME; đọc HANDOFF và chạy next. Không khởi tạo lại code.
2. Mỗi lát cắt 30–90 phút; một task đang hoạt động; checkpoint khi đổi task hoặc đổi phiên.
3. Dùng dữ liệu demo, không dùng PII thật để thử. Từng sản phẩm nghiệm thu theo docs/QUALITY_GATES.md.
4. Cuối ngày chạy END_OF_DAY, lưu tất cả thay đổi. Nếu đang dùng Git, commit thay đổi đã review; không commit secret. Push remote hiện hữu khi được phép.
5. Ngày 5 đóng phiên bản chỉ gồm ID đã đủ gate, kèm danh sách chưa đạt. “Toàn bộ hoàn thiện” chỉ được dùng nếu cả 30 đủ gate cùng integration/operations.

## Kiểm soát khả thi và phương án khi chậm
- Hết ngày 1 core chưa build/auth được: ưu tiên nền, không mở 30 task code. Giữ mục tiêu và báo rủi ro lịch.
- Hết ngày 2 KD01 chưa qua Excel/Web/import: đo nguyên nhân; 3 ngày còn lại tập trung KD01→KT01→KV02→MK01, giữ 26 mục còn lại trong backlog. Đây là phương án giảm phạm vi bản phát hành, không phải hoàn tất yêu cầu 30.
- Nếu core sẵn từ repo cũ: đo giờ/sản phẩm sau 2 lát cắt; số giờ còn lại phải >= khối lượng + 25% sửa lỗi. Chưa đủ thì báo lịch thực tế bổ sung, không hứa “không lỗi”.
- Thuê/chạy nhiều agent là lựa chọn riêng, không điều kiện mặc định và không tự phát sinh chi phí. Một người có thể đóng vai planner/builder/reviewer theo lượt.
- Thiếu Excel thật: G_EXCEL=BLOCKED_EXTERNAL; tạo workbook và kiểm tra cấu trúc được nhưng chưa gọi là đã kiểm chứng Excel.

## Trình tự phụ thuộc
CORE → KV01 → KV02; CORE → KD01 → KD03; CORE → KT01; KD01+KT01 → KT02; KV03+KT01 → KT03; KD01+KV02 → KT05; MK02+MK03 → MK04; NS01→NS02/NS03→NS04; KV01→SX02→SX01→SX03/SX04→SX05. Backlog máy đọc chứa toàn bộ thứ tự.
