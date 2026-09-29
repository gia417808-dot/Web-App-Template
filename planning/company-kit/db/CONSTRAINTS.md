# Constraint và chỉ mục bắt buộc

Đọc LOGICAL_DATA_DICTIONARY.json. Đây là đề xuất logic chi tiết, chưa phải migration đã chạy. Đối chiếu bảng repo thật trước đổi tên/migrate.

- Tất cả FK nghiệp vụ cùng tổ chức: FOREIGN KEY (organization_id, entity_id) REFERENCES Entity(organization_id,id). ToChuc có id; self organization_id không bắt buộc. NguoiDung.organization_id phải tồn tại và derived server-side cho request.
- code hoặc sku unique theo organization, normalize case khi so mã; giữ snapshot trên chứng từ. Chọn giữ unique kể cả soft-deleted cho mã đã sử dụng; muốn tái dùng phải ADR.
- ChiTietDon/ChiTietBaoGia: quantity>0, unit_price>=0, discount 0..100; line_total computed server; unique(parent,sequence) khi có sequence.
- SoDuPhep unique employee+period; không overlap kỳ cho cùng employee. Duyệt phép lock balance và version. NS04 lương âm là exception cần review, không clamp; chính sách ngành chưa rõ thì không final lock.
- ThanhToan CHECK đúng một trong receivable_id/payable_id khác null; amount>0; FK transaction và customer/supplier consistency được service kiểm tra; tổng allocation không vượt available transaction trong transaction lock. Unique allocation source key chống ghi đôi.
- DonHang/BaoGia/DonMua total là aggregate line round; không cho PATCH total. GiaoDich direction in/out, amount>0; số dư âm là policy, không đổi direction bằng số tiền âm.
- KyKhoa không overlap cho org; kiểm tra posting/adjustment business_date trong transaction, không chỉ client.
- DinhMuc unique product+version; DongDinhMuc unique bom+material; per_unit_qty>0, waste 0..100, đơn vị phù hợp. Released order giữ BOM snapshot/version.
- PhieuKiem inspected>=0; defective từ COUNT DISTINCT mẫu lỗi, không đếm loại lỗi; unique MauKiem(inspection_id,sample_code), LoiTrenMau(sample_id,defect_type_id).
- StockLedger unique warehouse_line_id nếu một dòng tương ứng một movement; transfer phải hai voucher liên kết cùng transaction. Quantity delta dấu theo type; lock product+warehouse aggregate trước cấm âm. Projection stock balance dùng để lock/update cần row_version và đối soát ledger.
- NhanHangMua unique purchase_line+warehouse_line; nhận dư là exception theo policy; tránh cộng receipt canceled/reversed.
- MucTon unique product+warehouse; 0<=min<=target<=max. Danh mục KV01 hiển thị thông tin này từ MucTon, không duplicate các ngưỡng trên SanPham.
- ChiSoKenh unique channel+business_date+source_batch_id; import replacement có revision để không cộng trùng. Lead merge theo canonical ID, không so name đơn thuần.
- Job unique org+job_type+entity+scheduled_at; Idempotency unique org+actor+key, request hash đối chiếu; Outbox dedup consumer theo event id.
- Index mỗi FK + (organization_id,business_date,status) cho bảng chứng từ; audit index org+entity_type+entity_id+created_at. Không index mọi field theo cảm tính.
- Derived status như overdue và current balance query từ nguồn, không cho client tự set.
