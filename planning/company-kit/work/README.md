# Điều phối task bằng Python

`python scripts/rpa.py check`: validate danh mục 30, dependency DAG, schema JSON, oracle và tệp cần có; không test ứng dụng.
`python scripts/rpa.py next`: task đang dở hoặc task pending có phụ thuộc done; không tự chạy model.
`python scripts/rpa.py checkpoint AUDIT review --note "Đã đọc repo"`: pending→review.
Các bước: review→plan→act→verify→done. Có thể verify→act để sửa; mọi bước active→blocked; blocked→review để tiếp tục. `--note` phải ghi nội dung thật. done cần `--evidence reports/evidence/.../manifest.json` đủ gate. Ghi manifest và logs trước khi gọi. Evidence path/hash phải đúng; dữ liệu giả để test chỉ tạo trong thư mục tạm ở tests, không dùng làm kết quả thật.

`python scripts/rpa.py release-check`: fail nếu còn task chưa done hoặc evidence thiếu/sai. Dù manifest hợp lệ vẫn cần review log thực tế; script không xác minh người khai báo trung thực.

`python scripts/rpa.py reopen KD01 --note "Đổi quy tắc làm tròn"`: mở lại task và toàn bộ task phụ thuộc, xóa evidence reference đã stale, không xóa file evidence cũ. Dùng khi code ảnh hưởng kết quả cũ. Source revision được lưu trong evidence; khi code đổi phải phân tích phạm vi và reopen tương ứng.

State lưu atomic và lock local chống hai process ghi cùng lúc, chỉ một task active. Lock stale sau crash: kiểm tra không còn process trước khi xóa work/.state.lock bằng tay. Nhiều máy dùng branch riêng; không đồng bộ state bằng last-write-wins.
