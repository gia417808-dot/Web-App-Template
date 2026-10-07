import json
import re

# 1. Đọc file markdown nguồn
with open('GSHEETS_TEN_MO_TA_TRANG_01_15(1).md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

table_lines = [l.strip() for l in lines if '|' in l and not l.startswith('| ---')]
data_rows = table_lines[1:]

products = []

def enrich_features(title, desc):
    """Tự động sinh tính năng và đối tượng nếu mô tả nguồn bị rỗng"""
    title_lower = title.lower()
    
    # Mặc định theo nhóm ngành
    if "kho" in title_lower or "nhập xuất tồn" in title_lower:
        suitable = ["Cửa hàng bán lẻ", "Xưởng sản xuất", "Kho hàng thương mại điện tử", "Đại lý phân phối"]
        features = [
            "Quản lý danh mục hàng hóa và vị trí kho",
            "Tự động tính tồn kho tức thời và giá vốn bình quân",
            "Hệ thống cảnh báo hàng sắp hết (Min) và quá tải (Max)",
            "Lập và in phiếu Nhập - Xuất - Điều chuyển kho",
            "Báo cáo tổng hợp Nhập Xuất Tồn theo khoảng thời gian tùy chọn",
            "Phân quyền thủ kho và nhân viên nhập liệu"
        ]
    elif "thu chi" in title_lower or "tài chính" in title_lower or "dòng tiền" in title_lower:
        suitable = ["Doanh nghiệp vừa và nhỏ (SME)", "Startup khởi nghiệp", "Chủ shop bán hàng", "Hộ kinh doanh cá thể"]
        features = [
            "Sổ quỹ quản lý đa tài khoản ngân hàng và tiền mặt",
            "Tự động phân loại dòng tiền theo hạng mục Thu - Chi",
            "Báo cáo Lãi - Lỗ (P&L) và dòng tiền thuần tự động cập nhật",
            "Đo lường chỉ số tài chính, tỷ lệ hòa vốn và cảnh báo âm quỹ",
            "Theo dõi công nợ phải thu, phải trả và nhắc hạn thanh toán",
            "Hỗ trợ phân tích chi phí theo từng dự án / phòng ban"
        ]
    elif "công việc" in title_lower or "dự án" in title_lower or "task" in title_lower:
        suitable = ["Agency truyền thông", "Đội ngũ thiết kế, IT", "Quản lý thi công xây dựng", "Doanh nghiệp vận hành theo dự án"]
        features = [
            "Giao việc và giám sát tiến độ công việc đa chiều (Kanban, Bảng, Lịch)",
            "Thiết lập công việc lặp lại định kỳ và nhắc hạn quá hạn tự động",
            "Đo lường tỷ lệ hoàn thành KPI của từng nhân sự",
            "Đính kèm tài liệu và phân quyền xem theo cấp độ bảo mật",
            "Lưu nhật ký lịch sử chỉnh sửa và cập nhật trạng thái thời gian thực",
            "Xuất báo cáo tiến độ dự án định dạng Excel / PDF"
        ]
    elif "thiết bị" in title_lower or "cho thuê" in title_lower:
        suitable = ["Studio quay phim, chụp ảnh", "Cho thuê âm thanh - ánh sáng", "Cho thuê máy móc xây dựng", "Đơn vị tổ chức sự kiện"]
        features = [
            "Quản lý toàn bộ danh mục thiết bị và tình trạng thực tế",
            "Lập hợp đồng cho thuê, tự động tính tiền thuê và tiền cọc",
            "Cảnh báo trùng lịch đặt giữ chỗ thiết bị",
            "Quy trình kiểm tra thu hồi máy và hoàn cọc linh hoạt",
            "Lịch bảo trì, bảo dưỡng và kiểm định thiết bị định kỳ",
            "Báo cáo hiệu suất khai thác tài sản và công nợ khách hàng"
        ]
    elif "cafe" in title_lower or "nhà hàng" in title_lower or "f&b" in title_lower:
        suitable = ["Quán cafe, trà sữa", "Nhà hàng, quán ăn", "Quán bida, dịch vụ giải trí", "Chuỗi đồ uống mang đi"]
        features = [
            "Quản lý sơ đồ bàn phòng trực quan theo thời gian thực",
            "Order gọi món nhanh trên điện thoại hoặc máy tính bảng",
            "Tự động tính tiền, áp dụng khuyến mãi và in hóa đơn tạm tính",
            "Tích hợp mã VietQR động hỗ trợ chuyển khoản chính xác",
            "Trừ tồn kho nguyên vật liệu theo định lượng món",
            "Báo cáo doanh thu theo ca làm việc, món bán chạy và hình thức thanh toán"
        ]
    else:
        suitable = ["Doanh nghiệp cá nhân", "Quản lý phòng ban", "Chuyên viên vận hành", "Kinh doanh tự do"]
        features = [
            "Chuẩn hóa dữ liệu theo cấu trúc bảng tính doanh nghiệp",
            "Tích hợp các hàm tự động hóa (QUERY, FILTER, SUMIFS)",
            "Bảng tổng hợp Dashboard với biểu đồ trực quan",
            "Bộ lọc dữ liệu nhanh theo nhiều tiêu chí",
            "Dễ dàng nhân bản và tùy chỉnh theo nhu cầu riêng",
            "Bảo đảm tính toàn vẹn và độ chính xác của số liệu"
        ]
        
    return suitable, features

def detect_category(clean_title):
    title_lower = clean_title.lower()
    if "kho" in title_lower or "nhập xuất tồn" in title_lower or "vận tải" in title_lower:
        return "Quản lý Kho", "inventory"
    elif "thu chi" in title_lower or "tài chính" in title_lower or "dòng tiền" in title_lower or "ngân sách" in title_lower or "sổ quỹ" in title_lower:
        return "Tài chính - Thu chi", "cashflow"
    elif "công việc" in title_lower or "dự án" in title_lower or "task" in title_lower or "kanban" in title_lower:
        return "Dự án & Công việc", "project"
    elif "thiết bị" in title_lower or "cho thuê" in title_lower or "erp" in title_lower:
        return "Mini-ERP & Thiết bị", "equipment"
    elif "cafe" in title_lower or "nhà hàng" in title_lower or "f&b" in title_lower or "quán" in title_lower:
        return "F&B & Nhà hàng", "fnb"
    elif "crm" in title_lower or "khách hàng" in title_lower or "bán hàng" in title_lower or "sales" in title_lower:
        return "CRM & Khách hàng", "crm"
    else:
        return "Tiện ích Doanh nghiệp", "general"

# 2. Xử lý từng dòng sản phẩm
for index, line in enumerate(data_rows):
    parts = re.split(r'(?<!\\)\|', line)
    parts = [p.strip().replace(r'\|', '|') for p in parts if p.strip()]
    if len(parts) >= 2:
        raw_name = parts[0]
        desc = parts[1]
        
        is_webapp = "webapp" in raw_name.lower()
        p_type = "webapp" if is_webapp else "gsheet"
        clean_title = raw_name.replace("Webapp | ", "").replace("Google Sheets | ", "").replace("Webapp |", "").replace("Google Sheets |", "").strip()
        
        # Tách version nếu có
        ver_match = re.search(r'\((v[\d\.\s\w\-]+)\)', clean_title)
        version = ver_match.group(1) if ver_match else "v1.0"
        
        # Bổ sung tính năng và đối tượng thông minh
        suitable_for, features = enrich_features(clean_title, desc)
        
        # Tạo mô tả tóm tắt nếu mô tả nguồn bị trống
        short_desc = desc
        if "trang nguồn" in desc.lower() or len(desc.strip()) < 10:
            short_desc = f"Giải pháp {clean_title} hỗ trợ chuẩn hóa quy trình, tối ưu vận hành và tự động hóa báo cáo trên hệ thống Google Workspace."

        cat_name, app_route = detect_category(clean_title)

        products.append({
            "id": f"GS-{index+1:03d}",
            "title": raw_name,
            "rawName": raw_name,
            "cleanTitle": clean_title,
            "type": p_type,
            "version": version,
            "category": cat_name,
            "price": 559000 if is_webapp else 299000,
            "originalPrice": 850000 if is_webapp else 450000,
            "description": short_desc,
            "shortDesc": short_desc,
            "suitableFor": suitable_for,
            "features": features,
            "appRoute": app_route,
            "sheetUrl": "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
            "templatePreviewUrl": f"https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/template/preview"
        })

# 3. Xuất ra file JSON chuẩn cho Frontend
output_path = 'apps/admin-web/src/data/exactCatalog.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"Processed successfully {len(products)} products and saved to {output_path}!")
