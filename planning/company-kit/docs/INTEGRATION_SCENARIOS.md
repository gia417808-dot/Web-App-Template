# Kịch bản nghiệm thu liên phòng (expected độc lập)

## I01 Bán hàng → kho → công nợ → tiền
SKU DEMO-A, kho DEMO-W, tồn 10; giá vốn snapshot 60.000/đơn vị. Đơn bán 2 × 100.000, giảm 10% => 180.000 VND. Confirm chỉ tạo phải thu 180.000, chưa trừ kho cho tới posted phiếu xuất. Xuất 2 => tồn 8; giá vốn 120.000; lãi gộp 60.000. Thu 100.000 => tiền +100.000, phải thu 80.000. Retry mỗi bước cùng key không thay lần hai. Hủy trước confirm không tạo công nợ. Sau post dùng reversal, không đổi header thành canceled rồi bỏ ledger.

## I02 Mua hàng → phải trả → nhận kho → chi
Đặt 10 × 50.000 => nghĩa vụ phải trả theo policy nhận hóa đơn; MVP ghi nhận khi chứng từ phải trả được xác nhận, không tự tạo hai lần từ PO và receipt. Nhận 6 => kho +6, còn nhận 4. Chi 200.000 cho gốc phải trả 500.000 => còn 300.000. Cần phân biệt lượng đã nhận với công nợ và hóa đơn nhà cung cấp.

## I03 Sản xuất
BOM 2 đơn vị vật tư/1 thành phẩm; kế hoạch 10, hao hụt 5% => dự trù 21. Xuất thực 20, nhập đạt 9, lỗi 1. Tiến độ đạt 90%; giá thành 900.000 chi phí hợp lệ / 9 =100.000. Ledger phải có kho/vật tư/thành phẩm/đơn vị; không lấy dự trù làm xuất thực. Nếu thiếu cost, SX05 báo MISSING_COST.

## I04 Đồng thời và nhập Excel
Tồn 1, hai yêu cầu xuất 1 khác key chạy đồng thời: một thành công, một INSUFFICIENT_STOCK, cuối tồn 0. Export row_version=3; Web sửa thành 4; import bản 3 phải conflict và không sửa dữ liệu. Import repeat commit cùng key chỉ tạo một lần.

## I05 Tenant và khôi phục
Org A/B có dữ liệu riêng; session A truy cập ID B trên GET/PATCH/export/import bị từ chối hoặc 404. Tạo backup dữ liệu demo sau I01, restore sang DB mới: order=180.000, receivable=80.000, stock=8, cash tăng 100.000; chạy lại login/dashboard.
