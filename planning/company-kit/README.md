# Công ty một người — bộ bàn giao triển khai 5 ngày

**Bắt đầu tại START_HERE.md.** Đây là bộ đặc tả, cấu trúc repository, backlog và công cụ điều phối công việc để agent tiếp tục code. Chưa phải ứng dụng hoàn thiện và chưa có 30 workbook `.xlsx` chạy thật.

Phạm vi giữ nguyên: 6 phòng ban × 5 sản phẩm; mỗi sản phẩm có Excel độc lập và màn hình Web dùng chung database. CRM/ERP kết nối các nghiệp vụ. Mục tiêu sprint: 29/09–03/10/2026, giờ Việt Nam. Nếu bắt đầu ngày khác, dịch toàn bộ lịch 5 ngày.

## Tệp cần mở
- `START_HERE.md`: thao tác dùng bộ hồ sơ trên máy mới hoặc repo cũ.
- `KE_HOACH_5_NGAY.md`: lịch, đầu ra, tiêu chí dừng/mở rộng phạm vi.
- `prompts/BOOTSTRAP.md`: prompt đầy đủ để dán vào agent.
- `AGENTS.md`: quy tắc chung; `GEMINI.md`, `CLAUDE.md`, `.github/copilot-instructions.md`: tệp điều hướng.
- `governance/PRODUCT_CATALOG.json`: 30 sản phẩm và phụ thuộc.
- `db/LOGICAL_DATA_DICTIONARY.json`: 74 entity logic, kèm constraints và entity map từng sản phẩm.
- `products/<ID>/`: đặc tả, schema định hướng, công thức mẫu, oracle, kế hoạch code/test.
- `work/state.json`, `work/tasks.json`, `work/HANDOFF.md`: trạng thái và công việc kế tiếp.
- `scripts/rpa.py`: kiểm tra kit, chọn việc, lưu checkpoint; không gọi API mô hình và không tự code.
- `docs/OPERATIONS_24_7.md`: vận hành app liên tục, backup/restore, xử lý sự cố.
- `reports/KIT_VERIFICATION.md`: kết quả kiểm tra bộ bàn giao; không phải kết quả nghiệm thu ứng dụng.

## Lệnh có sẵn (Python 3.10+)
```sh
python scripts/rpa.py check
python scripts/rpa.py next
python -m unittest discover -s tests -v
```
Windows có thể thay `python` bằng `py -3`. Không có lệnh `npm install` dùng ngay trong bộ này: agent phải audit repo và khóa dependency ở task CORE. Mọi `package.json`, Dockerfile và migration của app phải được tạo/kiểm chứng sau audit, không cài mù hoặc ghi đè repo cũ.

## Trạng thái trung thực
30 bộ hồ sơ: `draft_for_review`; G0 chưa PASS vì schema vật lý, toàn bộ cột workbook và fixtures liên bảng còn phải hoàn tất trên repo thật. Oracle có ví dụ cố định cho từng KPI chính. Mỗi bộ gồm 30 đầu vào demo lặp lại có ID riêng để thử giao diện, không coi đó là 30 nghiệp vụ đa dạng hay seed database đã liên kết. Chưa có backend/frontend, chưa deploy, chưa kiểm tra Excel thật.
