import ExcelJS from 'exceljs';
import { Lead, NguonLead, mk03Domain } from '@web-app-template/domain';

export async function generateMk03Workbook(leads: Lead[], sources: NguonLead[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    // Sheet 1: Nguồn Lead
    const sourceSheet = workbook.addWorksheet('Nguồn Lead');
    sourceSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Tên Nguồn', key: 'ten_nguon', width: 30 },
        { header: 'Mô Tả', key: 'mo_ta', width: 40 }
    ];
    sources.forEach(src => sourceSheet.addRow(src));
    sourceSheet.addTable({
        name: 'NguonLeadTable',
        ref: 'A1',
        headerRow: true,
        totalsRow: false,
        columns: [
            { name: 'ID', filterButton: true },
            { name: 'Tên Nguồn', filterButton: true },
            { name: 'Mô Tả', filterButton: true }
        ],
        rows: sources.map(s => [s.id, s.ten_nguon, s.mo_ta])
    });

    // Sheet 2: Danh sách Lead
    const leadSheet = workbook.addWorksheet('Danh sách Lead');
    leadSheet.columns = [
        { header: 'ID', key: 'id', width: 20 },
        { header: 'Nguồn ID', key: 'nguon_id', width: 20 },
        { header: 'Tên Lead', key: 'ten_lead', width: 30 },
        { header: 'Số Điện Thoại', key: 'so_dien_thoai', width: 15 },
        { header: 'Trạng Thái', key: 'trang_thai', width: 15 },
        { header: 'Ngày Tạo', key: 'ngay_tao', width: 20 }
    ];
    
    const rows = leads.map(l => [
        l.id, l.nguon_id, l.ten_lead, l.so_dien_thoai, l.trang_thai, l.ngay_tao
    ]);
    
    if (rows.length > 0) {
        leadSheet.addTable({
            name: 'LeadTable',
            ref: 'A1',
            headerRow: true,
            totalsRow: false,
            columns: [
                { name: 'ID', filterButton: true },
                { name: 'Nguồn ID', filterButton: true },
                { name: 'Tên Lead', filterButton: true },
                { name: 'Số Điện Thoại', filterButton: true },
                { name: 'Trạng Thái', filterButton: true },
                { name: 'Ngày Tạo', filterButton: true }
            ],
            rows
        });
    }

    // Sheet 3: Báo cáo Tỷ lệ chuyển đổi
    const reportSheet = workbook.addWorksheet('Báo Cáo KPI');
    reportSheet.columns = [
        { header: 'Chỉ số', key: 'metric', width: 30 },
        { header: 'Giá trị', key: 'value', width: 20 },
        { header: 'Công thức / Ghi chú', key: 'note', width: 40 }
    ];

    const kpi = mk03Domain.calculateConversionRate(leads);
    
    reportSheet.addRow({
        metric: 'Lead thành khách (converted)',
        value: kpi.converted,
        note: '=COUNTIF(LeadTable[Trạng Thái], "converted")'
    });
    
    reportSheet.addRow({
        metric: 'Lead hợp lệ (tổng - invalid)',
        value: kpi.validLeads,
        note: '=COUNTIFS(LeadTable[Trạng Thái], "<>invalid")'
    });

    reportSheet.addRow({
        metric: 'Tỷ lệ chuyển đổi',
        value: kpi.rate,
        note: '=B2/B3'
    });
    
    reportSheet.getCell('B4').numFmt = '0.00%';

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}
