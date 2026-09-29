# Kế hoạch hệ thống điều hành công ty một người: 30 mẫu Excel và Web App

**Bản thiết kế ngày 28/09/2026 · Ngôn ngữ sản phẩm: tiếng Việt · Thời hạn nội dung: trước tối 02/10/2026 (giờ Việt Nam)**

## 1. Quyết định sản phẩm

Một tài khoản chủ doanh nghiệp có sáu không gian công việc: Kinh doanh, Nhân sự, Marketing, Kế toán quản trị, Sản xuất, Kho vận. CRM kết nối lead/khách hàng/tương tác với báo giá, đơn hàng; ERP kết nối bán hàng, mua hàng, tồn kho, sản xuất và dòng tiền. Mỗi nghiệp vụ có **một nguồn dữ liệu chuẩn**, một mẫu `.xlsx` có thể dùng độc lập và một màn hình Web App dùng chung dữ liệu chuẩn khi nhập/xuất. Không gọi một bảng công việc cá nhân là hệ thống nhân sự nhiều người; vẫn thiết kế bảng nhân sự đủ để mở rộng.

Trang danh mục lấy cảm hứng từ cách duyệt mẫu, bộ lọc và trang chi tiết của gsheets.vn; luồng bán hàng/kho tham khảo Sapo; luồng công việc/quy trình tham khảo Base. Không sao chép giao diện, mã nguồn hay nội dung của các bên này. Website giới thiệu mẫu tách khỏi ứng dụng quản trị đăng nhập.

**Hai mức hoàn thành khác nhau:** Trong bốn ngày có thể khóa đặc tả, cấu trúc, hợp đồng công thức/hàm cho toàn bộ 30 sản phẩm và triển khai lõi cùng một đến hai lát cắt chạy thật, nếu repo hiện tại dùng được. Hoàn thiện và kiểm chứng 30 cặp Excel + Web App + CRM/ERP ở mức thương mại cần nhiều vòng phát triển hơn; không lấy số file tạo ra làm bằng chứng hoàn tất.

## 2. Bản đồ 30 sản phẩm

Mỗi hàng tương ứng một `products/<ID>/` riêng, gồm đặc tả, schema, workbook, API, giao diện, fixture, test. “Hàm” là nghiệp vụ cần hiện thực ở backend; “tính” là công thức/KPI cần có ở Excel và backend, không phải lệnh tạo file tự động. Danh sách 5 mẫu/phòng ban là đợt đầu; chỉ nâng lên 6–10 khi năm mẫu đầu có bằng chứng chạy được.

| Phòng ban | ID | Sản phẩm Excel + Web App | Bảng chính | Hàm nghiệp vụ | Tính toán và kiểm thử mẫu |
|---|---|---|---|---|---|
| Kinh doanh | KD01 | Báo giá và đơn hàng | `BaoGia`, `DonHang`, `ChiTietDon` | `taoBaoGia`, `chotDon` | tiền dòng = lượng × đơn giá × (1 − giảm giá); tổng đơn từ chi tiết, hủy không tính doanh thu |
| Kinh doanh | KD02 | Pipeline cơ hội | `CoHoi`, `GiaiDoan` | `chuyenGiaiDoan` | giá trị kỳ vọng = giá trị × xác suất; cơ hội mất không cộng forecast |
| Kinh doanh | KD03 | Chỉ tiêu bán hàng | `MucTieu`, `DonHang` | `tinhTienDoBan` | hoàn thành = doanh thu xác nhận / chỉ tiêu, mẫu số 0 xử lý rõ |
| Kinh doanh | KD04 | Hợp đồng và gia hạn | `HopDong`, `MocGiaHan` | `nhacGiaHan` | ngày còn lại, cảnh báo trước hạn; đã chấm dứt không nhắc |
| Kinh doanh | KD05 | Chăm sóc khách hàng | `KhachHang`, `TuongTac` | `lapLichChamSoc` | số ngày từ tương tác cuối, khách chưa từng tương tác là ngoại lệ |
| Nhân sự | NS01 | Hồ sơ nhân sự | `NhanSu`, `TaiLieu` | `capNhatHoSo` | thâm niên theo ngày vào làm; ngày tương lai bị từ chối |
| Nhân sự | NS02 | Chấm công và ca | `CaLam`, `ChamCong` | `duyetChamCong` | giờ làm qua nửa đêm = 24 × MOD(giờ ra − giờ vào,1) |
| Nhân sự | NS03 | Nghỉ phép | `SoDuPhep`, `DonNghi` | `duyetNghiPhep` | phép còn = đầu kỳ + phát sinh − phép đã duyệt; không trừ đơn hủy |
| Nhân sự | NS04 | Lương quản trị | `BangLuong`, `KhoanDieuChinh` | `chotBangLuong` | thực nhận quản trị = lương thỏa thuận + phụ cấp − khấu trừ; quy tắc thuế/BHXH cần cấu hình riêng |
| Nhân sự | NS05 | Tuyển dụng và cộng tác viên | `UngVien`, `VongTuyen` | `chuyenVongTuyen` | thời gian tuyển = ngày nhận việc − ngày mở vị trí; chưa tuyển trả trống |
| Marketing | MK01 | Lịch nội dung | `NoiDung`, `Kenh` | `lapLichDang` | tỷ lệ đúng hạn = bài đã đăng đúng hạn / bài phải đăng |
| Marketing | MK02 | Chiến dịch và ngân sách | `ChienDich`, `ChiPhi` | `khoaNganSach` | ngân sách còn = dự toán − chi phí xác nhận |
| Marketing | MK03 | Lead theo nguồn | `Lead`, `NguonLead` | `ganNguonLead` | tỷ lệ chuyển đổi = lead thành khách / lead hợp lệ theo cùng kỳ |
| Marketing | MK04 | Hiệu quả kênh | `ChiSoKenh`, `ChiPhi` | `tongHopKenh` | CPL = chi phí / lead hợp lệ; không cộng trung bình CPL từng ngày |
| Marketing | MK05 | Thử nghiệm nội dung | `ThuNghiem`, `BienThe` | `chotThuNghiem` | tỷ lệ phản hồi = phản hồi / lượt tiếp cận; thiếu mẫu số hiển thị chưa đủ dữ liệu |
| Kế toán quản trị | KT01 | Thu chi và dòng tiền | `GiaoDich`, `TaiKhoanTien` | `ghiNhanGiaoDich` | số dư = đầu kỳ + thu duyệt − chi duyệt; chặn giao dịch kỳ khóa |
| Kế toán quản trị | KT02 | Công nợ phải thu | `PhaiThu`, `ThanhToan` | `doiSoatThu` | còn phải thu = gốc − thanh toán xác nhận; trả dư tạo ngoại lệ |
| Kế toán quản trị | KT03 | Công nợ phải trả | `PhaiTra`, `ThanhToan` | `doiSoatChi` | còn phải trả = gốc − thanh toán xác nhận; không âm thầm ép về 0 |
| Kế toán quản trị | KT04 | Ngân sách và thực chi | `NganSach`, `GiaoDich` | `kiemSoatVuotChi` | chênh lệch = dự toán − thực chi theo hạng mục/kỳ |
| Kế toán quản trị | KT05 | Lãi gộp theo đơn | `DonHang`, `ChiTietDon`, `GiaVon` | `tinhLaiGop` | lãi gộp = doanh thu thuần − giá vốn theo dòng; thiếu giá vốn báo thiếu dữ liệu |
| Sản xuất | SX01 | Lệnh sản xuất | `LenhSanXuat`, `CongDoan` | `phatHanhLenh` | hoàn thành = lượng đạt / lượng kế hoạch; không tính lượng lỗi là đạt |
| Sản xuất | SX02 | Định mức vật tư | `DinhMuc`, `VatTu` | `duTruVatTu` | lượng cần = định mức × lượng kế hoạch × (1 + hao hụt cấu hình) |
| Sản xuất | SX03 | Tiến độ công đoạn | `CongDoan`, `NhatKySX` | `capNhatTienDo` | tiến độ trọng số = Σ(% đạt × trọng số) / Σ(trọng số) |
| Sản xuất | SX04 | Chất lượng và lỗi | `PhieuKiem`, `LoaiLoi` | `ghiNhanLoi` | tỷ lệ lỗi = số lượng lỗi / số lượng kiểm, chống đếm lặp mẫu |
| Sản xuất | SX05 | Giá thành lệnh | `LenhSanXuat`, `XuatVatTu`, `ChiPhiSX` | `tinhGiaThanh` | giá thành/đơn vị đạt = tổng chi phí hợp lệ / lượng đạt |
| Kho vận | KV01 | Danh mục hàng và kho | `SanPham`, `Kho` | `capNhatDanhMuc` | mã hàng duy nhất; đơn vị tính và giới hạn min/max nhất quán |
| Kho vận | KV02 | Nhập xuất tồn | `PhieuKho`, `DongPhieuKho` | `ghiSoKho` | tồn = đầu kỳ + nhập hợp lệ − xuất hợp lệ; cấm xuất âm nếu cấu hình |
| Kho vận | KV03 | Mua hàng | `YeuCauMua`, `DonMua` | `datMuaHang` | chênh lệch nhận = lượng đặt − lượng nhận hợp lệ |
| Kho vận | KV04 | Kiểm kê | `DotKiemKe`, `DongKiemKe` | `chotKiemKe` | lệch = đếm thực tế − tồn sổ tại thời điểm chốt |
| Kho vận | KV05 | Cảnh báo bổ sung | `MucTon`, `TonKho` | `deXuatBoSung` | lượng gợi ý = MAX(0, tồn mục tiêu − tồn khả dụng) |

Với công ty một người, ưu tiên KD01, KT01, KV02, MK01; NS01–NS05 và SX01–SX05 có dữ liệu mẫu cho mô hình mở rộng, chỉ bật luồng có nhu cầu thực tế. Không tự động nối một mẫu sản xuất vào tồn kho khi chưa có quy tắc xuất vật tư/nhập thành phẩm.

## 3. Sơ đồ dữ liệu, CRM và ERP

**Master data:** `ToChuc`, `NguoiDung`, `KhachHang`, `NhaCungCap`, `SanPham`, `Kho`, `NhanSu`, `Kenh`, `TaiKhoanTien`. Mọi bảng có `id` bất biến, `organization_id`, `created_at`, `updated_at`, `row_version`, `deleted_at`. Tiền lưu số nguyên đồng VND ở backend; số lượng lưu decimal, không dùng kiểu float tiền. Thời gian lưu UTC; hiển thị `Asia/Ho_Chi_Minh`.

**Chuỗi bán hàng:** Lead → Cơ hội → Báo giá → Đơn hàng → Phiếu xuất → Phải thu → Thanh toán. **Chuỗi mua/sản xuất:** Yêu cầu mua → Đơn mua → Phiếu nhập → Định mức → Lệnh sản xuất → Xuất vật tư → Nhập thành phẩm. **Chuỗi vận hành:** Nhiệm vụ → hạn xử lý → nhật ký → kết quả. CRM là phần của chuỗi khách hàng; ERP là phần nối đơn, kho, mua, sản xuất và tài chính. Các bước có trạng thái `nháp`, `đã xác nhận`, `đã hủy` cùng quy tắc chuyển trạng thái riêng; không cho sửa trực tiếp chứng từ đã chốt.

Một nguồn ghi là database ứng dụng. Excel là bản xuất để làm việc độc lập hoặc nhập qua luồng kiểm tra, không phải đồng biên tập hai chiều ngầm định. Import dùng mã định danh và `row_version`, báo xung đột thay vì ghi đè. Nếu cần Google Sheets/Apps Script/AppSheet, bổ sung adapter sau khi một luồng dữ liệu được kiểm chứng.

## 4. Cấu trúc repository đề xuất

```text
<project-root>/
├── AGENTS.md                         # quy ước build, tiếng Việt, gate
├── history.md                        # quyết định và lỗi đã gặp
├── governance/
│   ├── PRODUCT_CATALOG.yaml         # 30 ID, trạng thái, legacy F/U
│   ├── DOMAIN_MAP.md                 # dữ liệu và luồng liên phòng
│   └── ACCEPTANCE_MATRIX.md          # nghiệm thu theo ID
├── packages/
│   ├── domain/                        # types, rules, state machine
│   ├── workbook-engine/               # xuất/nhập xlsx, styles, formula map
│   ├── ui/                            # bảng, biểu mẫu, bộ lọc, chart
│   └── auth-audit/                    # quyền và nhật ký
├── apps/
│   ├── admin-web/                     # Web App đăng nhập
│   ├── api/                           # CRUD, workflow, import/export
│   └── catalog-web/                   # danh mục/trang giới thiệu
├── departments/                      # 6 README theo phòng ban
├── products/<PRODUCT_ID>/
│   ├── product.yaml                   # ID, scope, legacySku, status
│   ├── DOMAIN_SPEC.md                 # persona, nghiệp vụ, bất biến
│   ├── PRD.md                         # màn hình, luồng, ngoại lệ
│   ├── schema/                         # bảng, khóa, validation
│   ├── formulas/FORMULA_CONTRACT.md  # input, công thức, expected
│   ├── workbook/                       # template xlsx, sheet map
│   ├── server/                         # use case, endpoint, adapter
│   ├── web/                            # form, bảng, dashboard
│   ├── fixtures/                       # 30–100 bản ghi demo liên kết
│   ├── tests/                          # business oracle + import/export
│   └── README.md                      # cách cài, giới hạn
├── db/migrations/
├── integrations/google-sheets/       # Apps Script chỉ khi có use case
├── integrations/appsheet/             # App ID/binding/evidence thật
├── releases/legacy/                  # 0.1.0–2.0.0 chỉ đọc
├── reports/evidence/<ID>/<VERSION>/
└── scripts/                           # inventory, scaffold, QA
```

Không giả định repo cũ đã có cấu trúc này. Trước khi sửa repo thật: xác định project root từ Git, đọc `AGENTS.md`, `history.md`, audit danh mục F/U và đối chiếu mapping; không hard-code ổ C:/D:/E:, không ghi đè release cũ. ID sản phẩm mới không dùng F/U làm taxonomy; có thể giữ `legacySku` để truy vết. Version là thay đổi của cùng sản phẩm, không đại diện cho sản phẩm khác.

## 5. Hợp đồng bắt buộc cho từng mẫu

`product.yaml` ghi ID, phòng ban, persona, bản `3.0.0-vi` khi đủ điều kiện, nguồn legacy, trạng thái, nền tảng hiện có, phụ thuộc, gate. `DOMAIN_SPEC.md` ghi 3–5 tác vụ người dùng, sơ đồ trạng thái, quy tắc khóa và lỗi. `schema/` ghi tên bảng, cột, kiểu, khóa ngoại, unique, nhập tay hay công thức, quyền đọc/ghi. `FORMULA_CONTRACT.md` cho **từng** cột/KPI ghi công thức Excel 365, bản Sheets nếu hỗ trợ, hàm TypeScript tương đương, vùng áp dụng, tự mở rộng, expected cho ít nhất ca thường/trống/hủy/quá hạn/mẫu số 0. `fixtures/` có 30–100 dòng demo tiếng Việt có liên kết thực và ca biên. `tests/` có expected cố định từ nghiệp vụ, không sao chép chính hàm tính làm oracle. `README.md` chỉ dẫn cài, nhập/xuất, giới hạn, sao lưu.

**Excel:** danh mục/đầu vào/chứng từ/báo cáo/dashboard/hướng dẫn; Excel Tables với structured references để tự mở rộng; data validation, ô công thức được bảo vệ, công thức tương thích phiên bản Excel mục tiêu. `SUMIFS`, `COUNTIFS`, `XLOOKUP`, `IFERROR`, `EOMONTH`, `SUMPRODUCT` chỉ dùng nơi đúng nghiệp vụ. Không lấy số dòng làm ID cố định vì sort sẽ đổi ID. **Web App:** danh sách, tìm kiếm, tạo/sửa, trạng thái, lịch sử, dashboard, xuất/nhập Excel; backend là nguồn quyết định, frontend không được tự tính số tiền rồi ghi đè. Bản một người có một tài khoản chủ nhưng vẫn kiểm tra quyền ở server để mở rộng sau này.

### Một hợp đồng minh họa: KD01

`ChiTietDon`: `ma_dong`, `don_hang_id`, `san_pham_id`, `so_luong`, `don_gia_vnd`, `giam_gia_phan_tram`, `thanh_tien_vnd`. `DonHang`: `id`, `khach_hang_id`, `ngay_tao`, `trang_thai`, `tong_tien_vnd`, `row_version`. Giảm giá trong [0,100], lượng > 0, đơn giá ≥ 0. Quy tắc làm tròn VND được thống nhất **theo dòng trước khi cộng tổng**.

```excel
=IF(OR([@Số_lượng]="",[@Đơn_giá]=""),"",ROUND([@Số_lượng]*[@Đơn_giá]*(1-[@Giảm_giá_%]/100),0))
=IF([@Mã_đơn]="","",SUMIFS(ChiTietDon[Thành_tiền],ChiTietDon[Mã_đơn],[@Mã_đơn]))
```

Đây là công thức hợp đồng cho Excel Table với tên cột dự kiến; phải tạo Table và kiểm tra locale/phiên bản Excel khi xuất thực tế. Giá trị mã ID do ứng dụng hoặc workbook generator cấp; không dùng `ROW()` làm ID vĩnh viễn.

```ts
type DongDon = { soLuong: number; donGiaVnd: number; giamGiaPhanTram: number };
export function tinhThanhTien(dong: DongDon): number {
  const { soLuong, donGiaVnd, giamGiaPhanTram } = dong;
  if (!Number.isFinite(soLuong) || soLuong <= 0 ||
      !Number.isSafeInteger(donGiaVnd) || donGiaVnd < 0 ||
      !Number.isFinite(giamGiaPhanTram) || giamGiaPhanTram < 0 || giamGiaPhanTram > 100) {
    throw new Error('Chi tiết đơn hàng không hợp lệ');
  }
  const ketQua = Math.round(soLuong * donGiaVnd * (1 - giamGiaPhanTram / 100));
  if (!Number.isSafeInteger(ketQua)) throw new Error('Giá trị đơn hàng vượt giới hạn');
  return ketQua;
}
```

Đoạn mã chỉ minh họa hợp đồng KD01, chưa phải triển khai 30 sản phẩm; triển khai thật cần decimal cho số lượng, quy tắc làm tròn thống nhất và test đối chiếu Excel ↔ backend.

## 6. Giao diện và kiến trúc triển khai

- **Ứng dụng:** một menu chính theo phòng ban; trang tổng quan công ty một người hiển thị doanh thu đã xác nhận, tiền khả dụng, phải thu đến hạn, tồn thấp và việc sắp đến hạn; từng KPI mở được bảng nguồn.
- **Danh mục:** thẻ 30 sản phẩm, lọc phòng ban/nền tảng/trạng thái, trang chi tiết có ảnh demo thật, chức năng, yêu cầu cài đặt, trạng thái kiểm chứng. Không hiển thị nút mua hoặc tuyên bố AppSheet sẵn có khi chưa đạt gate.
- **Kiến trúc đề xuất:** TypeScript monorepo, frontend React, API Node, PostgreSQL, bộ xuất/nhập XLSX; lựa chọn chính xác phiên bản/thư viện sau audit môi trường. Mã doanh nghiệp ở `packages/domain` dùng chung backend và workbook contract. Ứng dụng một người có thể chạy local trước; chỉ triển khai cloud sau khi kiểm tra chi phí, backup, quyền truy cập và nhu cầu dùng nhiều thiết bị.
- **Kiểm soát dữ liệu:** xác thực, server-side authorization, `organization_id`, validation, audit sự kiện, optimistic concurrency, soft-delete, backup và khôi phục kiểm thử. Import phải chặn công thức độc hại trong ô dữ liệu và không xóa công thức của workbook. Chứng từ đã xác nhận được sửa bằng thao tác điều chỉnh có nhật ký.
- **Kế toán:** KT01–KT05 là quản trị nội bộ; không gắn nhãn phần mềm kế toán/thuế tuân thủ pháp lý khi chưa có đặc tả và kiểm tra chuyên môn tương ứng.

## 7. Bốn ngày với đầu ra đo được

| Mốc | Công việc | Bằng chứng cuối ngày |
|---|---|---|
| Ngày 1, 28–29/09 | Audit repo/AGENTS/history/releases; chốt 30 ID và dependency; thiết kế dữ liệu master, luồng CRM/ERP; chọn KD01 | catalog đầy đủ, sơ đồ bảng/khóa, 30 phạm vi riêng, inventory legacy; không sửa release cũ |
| Ngày 2, 29–30/09 | Hoàn thiện 30 DOMAIN_SPEC/schema, màn hình, trạng thái; viết FORMULA_CONTRACT và oracle cho từng sản phẩm; dựng core data/API/workbook | 30 hợp đồng sản phẩm đã rà soát; code chung build/typecheck; mẫu Excel KD01 có nhiều dòng demo |
| Ngày 3, 30/09–01/10 | Hoàn thiện lát cắt KD01 từ Excel → Web CRUD → dashboard → import/export; nối CRM cơ bản; bắt đầu KT01 | test nghiệp vụ, đối soát Excel/backend, demo 30–100 dòng; không đếm scaffold rỗng là hoàn thành |
| Ngày 4, 01–02/10 | Hoàn thiện KT01 nếu không vướng chất lượng; kiểm tra hồi quy, khóa spec/code plan cho 28 mẫu còn lại; ghi rõ roadmap triển khai từng lát cắt | hai sản phẩm tối đa có bằng chứng đúng gate; 30 đặc tả, hàm/công thức/fixture/test plan đầy đủ; danh sách còn mở và ước lượng tiếp theo |

Mốc bốn ngày tính từ tối 28/09 đến tối 02/10 theo giờ Việt Nam. Nếu audit repo cho thấy nền tảng hiện hữu chưa dùng được, dành thời gian sửa nền tảng; báo lại số lát cắt chạy thật thay vì tuyên bố 30 app đã hoàn thiện. Sau mốc này triển khai theo thứ tự KD01 → KT01 → KV02 → MK01 → phần còn lại theo nhu cầu, mỗi lần một sản phẩm có dữ liệu đến dashboard và test.

## 8. Gate và định nghĩa hoàn thành

| Gate | Nội dung | Trạng thái khi đạt |
|---|---|---|
| G0 | manifest/schema/spec/công thức/fixture expected hợp lệ, tiếng Việt, không placeholder | `specified` |
| G1 | 30–100 demo liên kết; công thức và dashboard đối chiếu oracle; CRUD/import/export/backup/khóa kỳ và regression chạy local | `local_verified` |
| G2 | Cài trên Google Sheets thật khi sản phẩm quảng cáo Sheets; kiểm tra công thức, dữ liệu, dashboard, rerun, backup, log | `google_verified` |
| G3 | Chỉ khi bán AppSheet: App ID, binding, view, action, bot, security filter, sync/offline và CRUD thật | AppSheet đã chứng minh |
| G4 | G2/G3 nếu quảng cáo các nền tảng đó, onboarding, mô tả đúng khả năng, demo không PII, bản sạch cài thành công | `ready_to_sell` |

Với sản phẩm **Excel + Web App**, bổ sung gate thực tế riêng: mở và tính lại `.xlsx` trong Excel mục tiêu; Web App build, đăng nhập, CRUD, import/export, bảo vệ dữ liệu, backup/restore và kiểm thử trên trình duyệt desktop/mobile. G2/G3 của Google chỉ áp dụng nếu có quảng cáo Google Sheets/AppSheet. Từng gate ghi `PASS`, `FAIL`, `NOT_RUN` hoặc `BLOCKED_EXTERNAL` kèm thời gian, môi trường, expected, actual và ảnh/log; không tự nâng trạng thái khi thiếu bằng chứng.

## 9. Các giả định cần xác thực khi bắt đầu làm repo

1. Repo GitHub hiện tại và nhánh `feature/kd-bao-gia-don-hang-3.0.0-vi` là nguồn code liên quan; xác minh nhánh, `AGENTS.md`, `history.md`, công cụ build và trạng thái thay đổi trước khi sửa.
2. Đợt đầu dùng **5 sản phẩm mỗi phòng**, tổng 30 sản phẩm, mỗi sản phẩm hai cách sử dụng Excel/Web. CRM/ERP là lõi kết nối, không phải 2 × 30 ứng dụng tách biệt.
3. Chưa có thông tin ngành sản xuất và chính sách lương/thuế; các công thức phụ thuộc ngành/quy định ở trạng thái chờ cấu hình, không bịa giá trị mặc định.
4. Bản kế hoạch này không chứng minh website, file Excel hay Web App đã được triển khai; bằng chứng bắt đầu khi thực thi trên repo và môi trường thật.
