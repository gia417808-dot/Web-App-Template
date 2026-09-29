# Nguồn dữ liệu và quyền sở hữu

| Nhóm | Sở hữu dữ liệu | Sử dụng chung |
|---|---|---|
| CORE | ToChuc, NguoiDung, KhachHang, NhaCungCap, Kenh, TaiKhoanTien | Mọi sản phẩm tham chiếu UUID cùng organization |
| KD01 | BaoGia, DonHang, ChiTietDon | KD03, KT02, KT05; phiên bản giá snapshot |
| KD02 | CoHoi, GiaiDoan | MK03 conversion, không tạo bản khách trùng |
| KT01 | GiaoDich tiền, kỳ khóa, allocation | KT02/KT03/KT04; không ghi trực tiếp từ frontend |
| KV01 | SanPham/VatTu, Kho, đơn vị | Kho/mua/sản xuất; VatTu là vai trò của SanPham |
| KV02 | PhieuKho, DongPhieuKho, StockLedger, reservation | KV04 adjustment qua service; KV05 projection không tự sở hữu bảng tồn mới |
| NS01 | NhanSu | NS02/03/04; ứng viên chưa phải nhân sự cho tới tuyển |
| SX01/SX02 | LenhSanXuat, CongDoan, DinhMuc version | SX03/04/05; CongDoan master thuộc SX01, tiến độ ở NhatKySX |
| MK02 | ChienDich, ChiPhi marketing | MK04 dùng cost projection, không duplicate ledger tiền |

Tên bảng kế hoạch giữ tiếng Việt để trace; schema vật lý có thể snake_case không dấu với map rõ. ThanhToan là allocation có loại receivable/payable và FK tới GiaoDich; không tạo hai bảng trùng semantics. GiaVon là snapshot từ posted stock movements. TonKho là projection ledger. Phần thiếu cột vật lý phải hoàn thành ở task CORE/G0, không tự tạo 30 database rời.
